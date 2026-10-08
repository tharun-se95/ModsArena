// Tool calls the way a person would say them: "Checking the tests" rather
// than "ran npm test -- --watch=false", "Reading the sign-in code" rather
// than "read session.ts". Pure: it knows nothing of the page, so the node
// tests can read it, and words.js, the bubbles and the transcript share it.
//
// Every description comes in three tenses:
//   now   "Checking the tests"        what it's doing right now
//   done  "Checked the tests"         what it did
//   fail  "Couldn't check the tests"  what didn't work

// A verb as [doing, did, do].
const V = {
  read: ['Reading', 'Read', 'read'],
  look: ['Looking', 'Looked', 'look'],
  search: ['Searching', 'Searched', 'search'],
  change: ['Changing', 'Changed', 'change'],
  write: ['Writing', 'Wrote', 'write'],
  check: ['Checking', 'Checked', 'check'],
  build: ['Building', 'Built', 'build'],
  install: ['Installing', 'Installed', 'install'],
  save: ['Saving', 'Saved', 'save'],
  send: ['Sending', 'Sent', 'send'],
  fetch: ['Fetching', 'Fetched', 'fetch'],
  switch: ['Switching', 'Switched', 'switch'],
  tidy: ['Tidying', 'Tidied', 'tidy'],
  run: ['Running', 'Ran', 'run'],
  hand: ['Handing', 'Handed', 'hand'],
  update: ['Updating', 'Updated', 'update'],
  ask: ['Asking', 'Asked', 'ask'],
  share: ['Sharing', 'Shared', 'share'],
  use: ['Using', 'Used', 'use'],
  make: ['Making', 'Made', 'make'],
  clean: ['Cleaning', 'Cleaned', 'clean'],
  create: ['Creating', 'Created', 'create'],
  remove: ['Removing', 'Removed', 'remove'],
  start: ['Starting', 'Started', 'start'],
  move: ['Moving', 'Moved', 'move'],
  wait: ['Waiting', 'Waited', 'wait'],
}

const say = (verb, rest) => {
  const [now, done, base] = V[verb]
  const tail = rest ? ` ${rest}` : ''
  return { now: `${now}${tail}`, done: `${done}${tail}`, fail: `Couldn’t ${base}${tail}` }
}

// ---------------------------------------------------------------------------
// Files: what part of the work a path belongs to.

// Words in a path that say what the code is about, first match wins.
const AREAS = [
  [/\b(auth|login|logout|session|signin|sign-in|oauth|password|token)s?\b/i, 'sign-in'],
  [/\b(refund)s?\b/i, 'refund'],
  [/\b(payment|billing|charge|invoice|checkout|stripe)s?\b/i, 'payment'],
  [/\b(webhook)s?\b/i, 'webhook'],
  [/\b(chart|graph|plot)s?\b/i, 'chart'],
  [/\b(dashboard)s?\b/i, 'dashboard'],
  [/\b(user|account|profile)s?\b/i, 'account'],
  [/\b(api|route|handler|endpoint|controller)s?\b/i, 'API'],
  [/\b(db|database|migration|schema)s?\b/i, 'database'],
  [/\b(email|mail|notification)s?\b/i, 'notification'],
  [/\b(search)\b/i, 'search'],
  [/\b(cache)\b/i, 'caching'],
  [/\b(worker|queue|job)s?\b/i, 'background job'],
  [/\b(ui|component|view|page|screen|widget)s?\b/i, 'screen'],
  [/\b(util|helper|lib)s?\b/i, 'helper'],
]

const STEM = path => String(path).split(/[\\/]/).filter(Boolean).pop() ?? String(path)
const words = s => s.replace(/\.[^.]+$/, '').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_.]+/g, ' ').trim().toLowerCase()

// The folder nearest the file says most ("charts/tokens.ts" is chart
// code), then the file's own name.
function areaOf(path) {
  const parts = String(path).split(/[\\/]/).filter(Boolean)
  const file = parts.pop() ?? ''
  for (const part of [...parts.reverse(), file]) {
    const hit = AREAS.find(([re]) => re.test(part.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[._-]/g, ' ')))
    if (hit) return hit[1]
  }
  return null
}

// "src/auth/session.ts" -> "the sign-in code"; "README.md" -> "the readme".
export function fileTopic(path) {
  const p = String(path ?? '').replace(/^https?:\/\/\S+/, '')
  if (!p) return 'a file'
  const file = STEM(p)
  if (/(^|[\\/])readme(\.\w+)?$/i.test(p)) return 'the readme'
  if (/changelog/i.test(file)) return 'the changelog'
  if (/(^|[\\/])(package(-lock)?\.json|tsconfig[\w.]*\.json|pyproject\.toml|cargo\.toml|go\.mod|requirements\.txt|\.env[\w.]*|[\w.-]*config\.[cm]?[jt]s|\.eslintrc[\w.]*)$/i.test(p)) return 'the project settings'
  if (/(^|[\\/])(\.github|ci|\.circleci)[\\/]|\.ya?ml$|dockerfile/i.test(p)) return 'the build setup'
  if (/\.(test|spec)\.\w+$|(^|[\\/])(__tests__|tests?)[\\/]/i.test(p)) {
    const area = areaOf(p)
    return area ? `the ${area} tests` : 'the tests'
  }
  if (/\.(md|mdx|rst|txt)$/i.test(file) || /(^|[\\/])docs?[\\/]/i.test(p)) return 'the docs'
  if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(file)) return 'a picture'
  if (/\.(css|scss|sass|less)$/i.test(file)) return 'the styling'
  if (/\.(json|csv|tsv|xml)$/i.test(file)) return 'some data'
  if (/\.(sh|bash|zsh|ps1)$/i.test(file)) return 'a script'
  if (/\.ipynb$/i.test(file)) return 'a notebook'
  const area = areaOf(p)
  if (area) return `the ${area} code`
  // Nothing to go on: name it after the file, "the session handler code".
  const name = words(file)
  return name ? `the ${name} code` : 'a file'
}

// ---------------------------------------------------------------------------
// Searches

// "**/*.test.ts" -> "test files"; "*.md" -> "docs"; "src/**/*.tsx" -> "code files".
function globTopic(pattern) {
  const p = String(pattern ?? '')
  if (/test|spec/i.test(p)) return 'test files'
  if (/\.(md|mdx|rst|txt)\b/i.test(p)) return 'docs'
  if (/\.(png|jpe?g|gif|svg|webp)\b/i.test(p)) return 'pictures'
  if (/\.(css|scss|less)\b/i.test(p)) return 'stylesheets'
  if (/\.(json|ya?ml|toml)\b/i.test(p) || /config/i.test(p)) return 'settings files'
  if (/\.\w+\b/.test(p)) return 'code files'
  return 'files'
}

const clipQuote = (s, n = 28) => {
  const t = String(s).replace(/\s+/g, ' ').trim()
  return `“${t.length > n ? `${t.slice(0, n - 1)}…` : t}”`
}

// A grep pattern that reads like words gets quoted; a regex doesn't.
const looksLikeWords = p => /^[\w .:'-]{2,40}$/.test(p)

// ---------------------------------------------------------------------------
// Shell commands: what a command is for, not what it says.

const COMMANDS = [
  [/\b(npm|pnpm|yarn|bun)\s+(run\s+)?test\b|\b(jest|vitest|mocha|pytest|rspec|phpunit|playwright test)\b|\b(go|cargo|deno|dotnet|mix|swift)\s+test\b|node\s+--test|\bmake\s+test\b|\btox\b/i, ['check', 'the tests']],
  [/\b(eslint|prettier|ruff|black|flake8|rubocop|gofmt|clippy|stylelint)\b|\b(npm|pnpm|yarn)\s+(run\s+)?(lint|format|fmt)\b/i, ['tidy', 'the code']],
  [/\b(tsc|typecheck|mypy|pyright)\b/i, ['check', 'the types']],
  [/\b(npm|pnpm|yarn|bun)\s+(run\s+)?build\b|\b(cargo|go|swift)\s+build\b|\bmake\b|\b(webpack|vite build|esbuild|rollup|gradle|mvn)\b/i, ['build', 'the project']],
  [/\b(npm|pnpm|yarn|bun)\s+(ci|install|i|add)\b|\bpip3?\s+install\b|\bbrew\s+install\b|\bapt(-get)?\s+install\b|\bcargo\s+add\b|\bgo\s+get\b|\bbundle\s+install\b/i, ['install', 'what the project needs']],
  [/\b(npm|pnpm|yarn)\s+(run\s+)?(dev|start|serve)\b|\b(serve|http-server|uvicorn|flask run|rails s)\b/i, ['start', 'the app']],
  [/\bgit\s+(diff|status|show)\b/i, ['look', 'over the changes']],
  [/\bgit\s+(log|blame|reflog)\b/i, ['look', 'back through the history']],
  [/\bgit\s+commit\b/i, ['save', 'a checkpoint']],
  [/\bgit\s+push\b/i, ['send', 'the changes up']],
  [/\bgit\s+(pull|fetch|clone)\b/i, ['fetch', 'the latest code']],
  [/\bgit\s+(checkout|switch|branch)\b/i, ['switch', 'branches']],
  [/\bgit\s+(add|stash|restore|reset|rebase|merge|cherry-pick)\b/i, ['tidy', 'up the changes']],
  [/\bgh\s+pr\b/i, ['update', 'the pull request']],
  [/\bgh\s+(issue|run|api)\b/i, ['check', 'GitHub']],
  [/\b(docker|podman|kubectl)\b/i, ['run', 'the containers']],
  [/\b(curl|wget|http)\b/i, ['fetch', 'a web page']],
  [/^\s*(rm|rmdir)\b/i, ['clean', 'up some files']],
  [/^\s*(mkdir|touch)\b/i, ['make', 'a new folder']],
  [/^\s*(mv|cp)\b/i, ['move', 'some files']],
  [/^\s*(ls|find|tree|du|pwd)\b/i, ['look', 'around the files']],
  [/^\s*(cat|head|tail|less|wc|grep|rg|sed -n)\b/i, ['read', 'some files']],
  [/^\s*(sleep|wait)\b/i, ['wait', 'a moment']],
  [/^\s*(node|python3?|ruby|deno|bun|tsx|ts-node|bash|sh)\s+\S/i, ['run', 'a script']],
]

function commandSay(command) {
  const c = String(command ?? '').trim()
  // A chain does what its first meaningful step does: "cd x && npm test".
  const parts = c.split(/\s*(?:&&|\|\||;|\|)\s*/).filter(s => s && !/^(cd|export|set|source|\.)\b/.test(s))
  for (const part of parts.length ? parts : [c]) {
    const hit = COMMANDS.find(([re]) => re.test(part))
    if (hit) return say(...hit[1])
  }
  return say('run', 'a command')
}

// ---------------------------------------------------------------------------
// Connected apps (MCP): mcp__github__list_pull_requests is "Looking at pull
// requests on GitHub".

const BRANDS = { github: 'GitHub', gitlab: 'GitLab', slack: 'Slack', linear: 'Linear', notion: 'Notion', jira: 'Jira', atlassian: 'Atlassian', figma: 'Figma', gmail: 'Gmail', google_drive: 'Google Drive', sentry: 'Sentry', stripe: 'Stripe', asana: 'Asana', datadog: 'Datadog', postgres: 'the database', playwright: 'the browser', claude_in_chrome: 'the browser' }

export function appName(server) {
  const s = String(server ?? '').replace(/^plugin_\w+?_/, '').toLowerCase()
  if (BRANDS[s]) return BRANDS[s]
  const nice = s.replace(/[-_]+/g, ' ').trim()
  return nice ? nice.replace(/\b\w/g, c => c.toUpperCase()) : 'an app'
}

function mcpSay(tool) {
  const [, server = '', name = ''] = String(tool).split('__')
  const app = appName(server)
  const [verb, ...rest] = name.split(/[_-]+/).filter(Boolean)
  const what = rest.join(' ').replace(/\bprs?\b/i, 'pull requests').trim()
  const on = what ? `${what} on ${app}` : app
  switch ((verb ?? '').toLowerCase()) {
    case 'list': case 'get': case 'read': case 'search': case 'find': case 'query': case 'fetch': case 'view':
      return say('look', `at ${on}`)
    case 'create': case 'add': case 'open': case 'new':
      return say('create', what ? `${/^[aeiou]/i.test(what) ? 'an' : 'a'} ${what.replace(/s$/, '')} on ${app}` : `something on ${app}`)
    case 'update': case 'edit': case 'set': case 'patch': case 'merge':
      return say('update', on)
    case 'delete': case 'remove': case 'close': case 'trash':
      return say('remove', on)
    case 'send': case 'post': case 'reply': case 'comment':
      return say('send', what ? `a ${what.replace(/s$/, '')} on ${app}` : `a message on ${app}`)
    default:
      return say('use', app)
  }
}

// ---------------------------------------------------------------------------
// The one entry point.

export function describe(tool, summary) {
  const t = String(tool ?? '')
  const s = summary == null ? '' : String(summary)
  if (t.startsWith('mcp__')) return mcpSay(t)
  switch (t) {
    case 'Read': case 'NotebookRead':
      return say('read', fileTopic(s))
    case 'Edit': case 'MultiEdit': case 'NotebookEdit':
      return say('change', fileTopic(s))
    case 'Write':
      return say('write', fileTopic(s))
    case 'Grep':
      return s && looksLikeWords(s) ? say('search', `the code for ${clipQuote(s)}`) : say('search', 'through the code')
    case 'Glob':
      return say('look', `for ${globTopic(s)}`)
    case 'LS':
      return say('look', 'around the files')
    case 'WebFetch': {
      const host = /^https?:\/\/(?:www\.)?([^/\s]+)/i.exec(s)?.[1]
      return say('read', host ? `a page on ${host}` : 'a web page')
    }
    case 'WebSearch':
      return say('search', s ? `the web for ${clipQuote(s)}` : 'the web')
    case 'Bash': case 'PowerShell':
      return commandSay(s)
    case 'BashOutput':
      return say('check', 'on a running command')
    case 'KillShell': case 'KillBash':
      return say('remove', 'a running command')
    case 'Task': case 'Agent':
      return say('hand', 'work to a helper')
    case 'TodoWrite': case 'TaskCreate': case 'TaskUpdate':
      return say('update', 'its checklist')
    case 'AskUserQuestion':
      return say('ask', 'you something')
    case 'ExitPlanMode':
      return say('share', 'a plan')
    case 'Skill':
      return say('use', s ? `the ${s} skill` : 'a skill')
    case 'SendMessage':
      return say('send', 'a message')
    case '':
      return say('use', 'a tool')
    default:
      return say('use', t.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase())
  }
}

// ---------------------------------------------------------------------------
// A run of tool calls as one step: "Looked through 6 files and ran the
// tests". Each call is { tool, summary, ok }.

const plural = (n, one, many = `${one}s`) => `${n === 1 ? 'a' : n} ${n === 1 ? one : many}`
const joinAnd = list => (list.length < 2 ? list.join('') : `${list.slice(0, -1).join(', ')} and ${list.at(-1)}`)

export function stepSummary(calls) {
  if (!calls.length) return ''
  if (calls.length === 1) {
    const d = describe(calls[0].tool, calls[0].summary)
    return calls[0].ok === false ? d.fail : calls[0].ok === undefined ? d.now : d.done
  }
  const reads = new Set(), edits = new Set(), writes = new Set()
  let searches = 0, web = 0, helpers = 0
  const commands = [] // distinct "ran the tests" style phrases, in order
  for (const c of calls) {
    const s = c.summary ?? ''
    switch (c.tool) {
      case 'Read': case 'NotebookRead': reads.add(s); break
      case 'Edit': case 'MultiEdit': case 'NotebookEdit': edits.add(s); break
      case 'Write': writes.add(s); break
      case 'Grep': case 'Glob': case 'LS': searches++; break
      case 'WebFetch': case 'WebSearch': web++; break
      case 'Task': case 'Agent': helpers++; break
      case 'Bash': case 'PowerShell': {
        const d = describe(c.tool, s).done
        // In a summary, tests are something it ran.
        const phrase = (d.charAt(0).toLowerCase() + d.slice(1)).replace(/^checked the tests$/, 'ran the tests')
        if (!commands.includes(phrase)) commands.push(phrase)
        break
      }
      default: {
        const d = describe(c.tool, s).done
        const phrase = d.charAt(0).toLowerCase() + d.slice(1)
        if (!commands.includes(phrase)) commands.push(phrase)
      }
    }
  }
  const parts = []
  if (reads.size) parts.push(reads.size === 1 ? `read ${fileTopic([...reads][0])}` : `looked through ${reads.size} files`)
  if (searches) parts.push(searches === 1 ? 'searched the code' : searches === 2 ? 'searched the code twice' : `searched the code ${searches} times`)
  if (edits.size) parts.push(`changed ${plural(edits.size, 'file')}`)
  if (writes.size) parts.push(`wrote ${plural(writes.size, 'new file')}`)
  if (web) parts.push(`read ${plural(web, 'web page')}`)
  if (helpers) parts.push(helpers === 1 ? 'brought in a helper' : `brought in ${helpers} helpers`)
  // Commands say what they were for; past three, they're just commands.
  if (commands.length <= 3) parts.push(...commands)
  else parts.push(`ran ${commands.length} commands`)
  const text = joinAnd(parts.slice(0, 4)) + (parts.length > 4 ? ' and more' : '')
  return text.charAt(0).toUpperCase() + text.slice(1)
}
