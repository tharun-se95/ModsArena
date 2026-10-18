import { test } from 'node:test'
import assert from 'node:assert/strict'
import { markdown, inline, plain } from './markdown.js'

test('bold, italic, code and links inline', () => {
  assert.equal(inline('**The studio `.env`** now'), '<strong>The studio <code>.env</code></strong> now')
  assert.equal(inline('an *italic* word'), 'an <em>italic</em> word')
  assert.equal(inline('see [the PR](https://github.com/a/b/pull/1).'), 'see <a href="https://github.com/a/b/pull/1" target="_blank" rel="noopener noreferrer">the PR</a>.')
  // Marks inside code stay as typed.
  assert.equal(inline('`GOOGLE_FLOW_*` and `**x**`'), '<code>GOOGLE_FLOW_*</code> and <code>**x**</code>')
  // snake_case words aren't italicised.
  assert.equal(inline('TOKEN_ENCRYPTION_KEY and ADMIN_SECRET'), 'TOKEN_ENCRYPTION_KEY and ADMIN_SECRET')
})

test('nothing gets through as HTML, and only http(s) links are made', () => {
  const html = markdown('<img src=x onerror=alert(1)> [x](javascript:alert(1)) **<b>hi</b>**')
  assert.ok(!html.includes('<img'))
  assert.ok(!html.includes('<b>'))
  assert.ok(!html.includes('href="javascript'))
  assert.ok(html.includes('&lt;img'))
})

test('paragraphs, a bullet list and a table, as in a typical reply', () => {
  const src = [
    'I filled **18** keys.',
    '',
    '**Where the 18 came from:**',
    '- **autoYT** (`~/Developer/autoYT/.env.local`), 11 keys',
    '- **instagram-poster**, 7 keys',
    '',
    '| Key | Result | Likely meaning |',
    '| --- | --- | --- |',
    '| Supabase | 540 | Project is **paused**. |',
    '| xAI | 403 | Blocked |',
    '',
    'Which do you want?',
  ].join('\n')
  const html = markdown(src)
  assert.match(html, /^<p>I filled <strong>18<\/strong> keys.<\/p>/)
  assert.match(html, /<ul><li><strong>autoYT<\/strong> \(<code>~\/Developer\/autoYT\/.env.local<\/code>\), 11 keys<\/li><li>/)
  assert.match(html, /<table><thead><tr><th>Key<\/th><th>Result<\/th><th>Likely meaning<\/th><\/tr><\/thead><tbody><tr><td>Supabase<\/td><td>540<\/td><td>Project is <strong>paused<\/strong>.<\/td><\/tr>/)
  assert.match(html, /<p>Which do you want\?<\/p>$/)
})

test('numbered and nested lists, headings, code blocks, quotes and rules', () => {
  assert.equal(markdown('1. one\n2. two\n   - inner'), '<ol><li>one</li><li>two<ul><li>inner</li></ul></li></ol>')
  assert.equal(markdown('3. three\n4. four'), '<ol start="3"><li>three</li><li>four</li></ol>')
  assert.equal(markdown('## Next steps'), '<h4 class="md-h">Next steps</h4>')
  assert.equal(markdown('```js\nconst a = <b>\n```'), '<pre class="md-code"><code>const a = &lt;b&gt;</code></pre>')
  assert.equal(markdown('> quoted **bit**'), '<blockquote><p>quoted <strong>bit</strong></p></blockquote>')
  assert.equal(markdown('a\n\n---\n\nb'), '<p>a</p><hr><p>b</p>')
  // Lines in one paragraph keep their breaks.
  assert.equal(markdown('line one\nline two'), '<p>line one<br>line two</p>')
})

test('plain() turns a reply into one clean line for previews', () => {
  const src = 'Found it: **the build reads a stale cache key.**\n\n- `ci/cache.yml` keys on `package.json`\n\n| Run | Before |\n| --- | --- |\n| Flaky | **6** |'
  assert.equal(plain(src), 'Found it: the build reads a stale cache key. ci/cache.yml keys on package.json Run · Before Flaky · 6')
  assert.equal(plain('Plain words stay as they are.'), 'Plain words stay as they are.')
})

// Text from Claude can carry anything a repo or a web page put in front of
// it: no input may produce a tag or an attribute the renderer didn't mean.
const HOSTILE = [
  '[a](https://x.com/(https://x/onmouseover=window.__pwned=1//)',
  '[a](https://x.com/(https://x/autofocus/onfocus=alert(1)//)',
  'https://x/" onmouseover="alert(1)',
  "https://x/' onmouseover='alert(1)",
  '[x](https://e.com?a=1&b="2") [y](javascript:alert(1)) [z](https://a.b/"><img src=x onerror=alert(1)>)',
  '<img src=x onerror=alert(1)> **<b>bold</b>** `</code><script>x</script>`',
  '[**a**](https://a.b/__x__) __[b](https://c.d/*e*)__ https://f.g/~~h~~',
  '\u00000\u0000 [\u00001\u0000](https://a.b)',
]

test('no input can add a tag or an attribute', () => {
  const allowed = /^<(\/?(p|strong|em|del|code|ul|ol|li|blockquote|br|hr|pre|table|thead|tbody|tr|th|td|div|h[3-6])( class="[\w-]+")?|a href="https?:\/\/[^"<>]*" target="_blank" rel="noopener noreferrer"|\/a)>$/
  for (const src of HOSTILE) {
    for (const html of [markdown(src), inline(src)]) {
      for (const tag of html.match(/<[^>]*>/g) ?? []) assert.match(tag, allowed, `${src} -> ${tag}`)
      assert.doesNotMatch(html, /<(?!\/?(p|strong|em|del|code|ul|ol|li|blockquote|br|hr|pre|table|thead|tbody|tr|th|td|div|h\d|a)\b)/, src)
    }
  }
})

test('links and marks still work together', () => {
  assert.equal(inline('**see [docs](https://d.io/p)**'), '<strong>see <a href="https://d.io/p" target="_blank" rel="noopener noreferrer">docs</a></strong>')
  assert.equal(inline('go to https://a.com/x, then'), 'go to <a href="https://a.com/x" target="_blank" rel="noopener noreferrer">https://a.com/x</a>, then')
})
