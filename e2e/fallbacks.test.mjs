// The office where things are missing: no WebGL, and no bridge at all (the
// hosted demo, built the way GitHub Pages serves it).
import { test, after } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { mkdtempSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, extname } from 'node:path'
import { execFileSync } from 'node:child_process'
import { chromium } from 'playwright'
import { ARGS, makeAccount, startBridge, until } from './fixtures.mjs'

const cleanup = []
mkdirSync(join(import.meta.dirname, 'failures'), { recursive: true })
after(async () => { for (const fn of cleanup.reverse()) await fn() })

test('without WebGL the office says so, and everything else works', async () => {
  const bridge = await startBridge(makeAccount())
  cleanup.push(() => bridge.stop())
  const browser = await chromium.launch({ args: ['--disable-webgl', '--disable-3d-apis'] })
  cleanup.push(() => browser.close())
  const page = await browser.newPage({ viewport: { width: 1280, height: 820 } })
  const errors = []
  page.on('pageerror', e => errors.push(e.message))
  await page.goto(bridge.signIn)
  await page.waitForSelector('.no-webgl')
  assert.ok(await until(() => page.locator('#conn.live').count()))
  assert.equal(await page.locator('section.project').count(), 3)
  await page.locator('.thread .entry', { hasText: 'Fix the double-charge race' }).click()
  await page.waitForSelector('.tx-compose textarea')
  assert.deepEqual(errors, [])
})

test('the hosted demo plays without a bridge', async () => {
  const site = mkdtempSync(join(tmpdir(), 'office-site-'))
  execFileSync(process.execPath, [join(import.meta.dirname, '..', 'scripts', 'build-demo-site.mjs'), site])
  const types = { '.html': 'text/html', '.woff2': 'font/woff2' }
  const server = createServer(async (req, res) => {
    try {
      const path = join(site, req.url === '/' ? 'index.html' : decodeURIComponent(req.url.slice(1)))
      res.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' })
      res.end(await readFile(path))
    } catch {
      res.writeHead(404).end()
    }
  })
  await new Promise(r => server.listen(0, '127.0.0.1', r))
  cleanup.push(() => new Promise(r => server.close(r)))
  const browser = await chromium.launch({ args: ARGS })
  cleanup.push(() => browser.close())
  const page = await browser.newPage({ viewport: { width: 1280, height: 820 }, reducedMotion: 'reduce' })
  const errors = []
  page.on('pageerror', e => errors.push(e.message))
  await page.goto(`http://127.0.0.1:${server.address().port}/`, { timeout: 60000 })
  await page.waitForSelector('section.project', { timeout: 30000 })
  // The demo keeps working while you click, so the list can shift under the
  // pointer on a slow machine; like a person, click again if the wrong
  // thread opened.
  const opened = () => page.locator('.tx-compose .tx-what').first().textContent({ timeout: 5000 }).catch(() => '')
  for (let i = 0; i < 3 && !/Dark mode for the charts/.test(await opened()); i++) {
    await page.locator('.thread .entry', { hasText: 'Dark mode for the charts' }).first().click()
  }
  try {
    await page.waitForSelector('.tx-compose.resume textarea')
  } catch (err) {
    await page.screenshot({ path: join(import.meta.dirname, 'failures', 'hosted-demo.png') }).catch(() => {})
    throw new Error(`${err.message}\nopen: ${await opened() || 'nothing'}`, { cause: err })
  }
  await page.locator('.tx-compose textarea').fill('Demo: pick it up again')
  await page.locator('.tx-compose textarea').press('Enter')
  assert.ok(await until(() => page.locator('.tx.you', { hasText: 'Demo: pick it up again' }).count()))
  assert.deepEqual(errors, [])
})
