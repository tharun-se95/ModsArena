// The office in a real browser against a real bridge: signing in, talking to
// an ended session, making and removing things, deleting for good, and that
// nothing a reply says can run. `npm test` in e2e/ (CI runs it).
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from 'playwright'
import { ARGS, SESSIONS, makeAccount, startBridge, until } from './fixtures.mjs'

let browser, page, bridge, home
const problems = []

before(async () => {
  home = makeAccount()
  bridge = await startBridge(home)
  browser = await chromium.launch({ args: ARGS })
  const context = await browser.newContext({ viewport: { width: 1280, height: 820 }, reducedMotion: 'reduce' })
  page = await context.newPage()
  page.on('pageerror', e => problems.push(e.message))
  page.on('console', m => { if (/Content Security Policy|Refused to/.test(m.text())) problems.push(m.text()) })
})

after(async () => {
  await browser?.close()
  await bridge?.stop()
})

const thread = text => page.locator('.thread .entry', { hasText: text })
const room = name => page.locator('section.project', { has: page.locator('.room-name', { hasText: new RegExp(`^${name}$`, 'i') }) })
const back = () => page.evaluate(() => document.querySelector('[data-back]')?.click())
async function menu(scope, action) {
  await scope.locator('details.more > summary').first().click()
  await scope.locator(`[data-manage="${action}"]`).first().click()
}

test('the office opens only with your key, then stays signed in', async () => {
  const locked = await page.goto(bridge.base + '/')
  assert.equal(locked.status(), 401)
  await page.goto(bridge.signIn)
  assert.equal(new URL(page.url()).search, '', 'the key leaves the address')
  await page.waitForSelector('section.project')
  assert.equal(await page.locator('section.project').count(), 3)
  await page.reload()
  await page.waitForSelector('section.project')
})

test('an ended session is picked up again, and answers in its conversation', async () => {
  await thread('Dark mode for the charts').click()
  await page.waitForSelector('.tx-compose.resume textarea')
  await page.locator('.tx-compose textarea').fill('Also make the legend follow the theme')
  await page.locator('.tx-compose textarea').press('Enter')
  assert.ok(await until(() => bridge.calls().some(c => c.args[1] === '--resume' && c.args[2] === SESSIONS.dark)))
  const call = bridge.calls().find(c => c.args[1] === '--resume')
  assert.equal(call.cwd, join(home, 'code', 'dashboard'))
  assert.ok(await until(() => page.locator('.tx.say', { hasText: 'Here is my answer to: Also make the legend' }).count(), 20000))
  assert.ok(await until(() => page.locator('.tx-compose:not(.resume)').count()), 'the box switches to live chat')
  await back()
})

test('a custom agent type is saved where Claude Code reads it, never over another', async () => {
  await menu(room('payments'), 'agenttype')
  const fill = async name => {
    await page.locator('#aname').fill(name)
    await page.locator('#adesc').fill('Writes tests after changes')
    await page.locator('#abody').fill('Write small tests and run them.')
    await page.locator('#manage .mgo').click()
  }
  await fill('Test Writer')
  const file = join(home, 'code', 'payments', '.claude', 'agents', 'test-writer.md')
  assert.ok(await until(() => existsSync(file)))
  assert.match(readFileSync(file, 'utf8'), /^---\nname: test-writer\n/)
  await menu(room('payments'), 'agenttype')
  await fill('test-writer')
  assert.ok(await until(async () => /already an agent/.test(await page.locator('#manage .mnote').textContent())))
  await page.keyboard.press('Escape')
})

test('a new thread starts in the project its + belongs to', async () => {
  await room('docs').locator('.room-new').click()
  assert.equal(await page.locator('#desk[open] .jroom.on', { hasText: /docs/i }).count(), 1)
  await page.locator('#jprompt').fill('Write a changelog for the guide')
  await page.locator('.jgo').click()
  assert.ok(await until(() => bridge.calls().some(c => c.args[1] === '-n' && c.cwd === join(home, 'code', 'docs'))))
  assert.ok(await until(() => thread('Write a changelog').count(), 20000))
})

test('remove from office hides a project until you bring it back; nothing is deleted', async () => {
  await menu(room('docs'), 'remove')
  assert.equal(await room('docs').count(), 0)
  await page.reload()
  await page.waitForSelector('section.project')
  assert.equal(await room('docs').count(), 0, 'still removed after a reload')
  assert.ok(existsSync(bridge.transcript('docs', SESSIONS.proof)))
  await page.locator('#settings-open').click()
  await page.locator('.set-removed summary').click()
  await page.locator('.set-removed [data-restore]').first().click()
  assert.ok(await until(() => room('docs').count()))
  await page.locator('#settings-open').click()
})

test('delete for good removes the conversation’s files, never the project’s', async () => {
  await thread('Add idempotency keys').click()
  await menu(page.locator('.dmenu'), 'delete')
  await page.locator('#manage .mgo.danger').click()
  assert.ok(await until(() => !existsSync(bridge.transcript('payments', SESSIONS.keys))))
  assert.ok(existsSync(join(home, 'code', 'payments')))
  await back()
  assert.ok(await until(async () => (await thread('Add idempotency keys').count()) === 0))
})

test('nothing a reply says can run in the page', async () => {
  const t = Date.now()
  await bridge.report([
    { t, kind: 'session.start', session: 'hostile-1', cwd: join(home, 'code', 'payments') },
    { t, kind: 'turn.start', session: 'hostile-1', turnId: 'u', text: 'Hostile reply' },
    { t, kind: 'turn.complete', session: 'hostile-1', turnId: 'u', reason: 'answer', answer: 'See [a](https://x.com/(https://x/onmouseover=window.__pwned=1//) and [b](https://x.com/(https://x/autofocus/onfocus=window.__pwned=2//)' },
    { t, kind: 'asset.add', session: 'hostile-1', id: 'o1', type: 'pr', title: 'PR', url: 'javascript:alert(1)', meta: { additions: '<img src=x onerror=window.__pwned=3>' } },
  ])
  assert.ok(await until(() => thread('Hostile reply').count()))
  await thread('Hostile reply').click()
  await page.waitForSelector('.tx-log')
  for (const tab of ['transcript', 'outputs']) {
    await page.locator(`[data-tab="${tab}"]`).click()
    for (const a of await page.locator('#side a').all()) { await a.hover().catch(() => {}); await a.focus().catch(() => {}) }
  }
  const handlers = await page.evaluate(() => [...document.querySelectorAll('*')].filter(el => [...el.attributes].some(a => /^on/i.test(a.name))).length)
  assert.equal(handlers, 0)
  assert.equal(await page.evaluate(() => window.__pwned ?? 0), 0)
  await back()
})

test('a phone gets the inbox first', async () => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.reload()
  await page.waitForSelector('.phone-tabs')
  assert.ok(await page.locator('.phone-tabs').isVisible())
  await page.setViewportSize({ width: 1280, height: 820 })
})

test('no page errors, and the page broke none of its own rules', () => {
  assert.deepEqual(problems, [])
})
