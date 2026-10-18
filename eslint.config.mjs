// The lint baseline: eslint's recommended rules over the bridge (Node), the
// page's source (browser) and the scripts. `npm run lint`; CI runs it too.
import js from '@eslint/js'
import globals from 'globals'

export default [
  { ignores: ['**/node_modules/', 'agent-office/server/public/', 'site/', 'visualizer/studio/', '.claude-plugin/types/', 'agent-office/.claude-plugin/types/'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    rules: {
      'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none', ignoreRestSiblings: true }],
      // An empty catch is how this code says "best effort, ignore failure".
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
  { files: ['agent-office/server/**', 'scripts/**', 'e2e/**', '*.mjs'], languageOptions: { globals: globals.node } },
  { files: ['visualizer/**'], languageOptions: { globals: globals.browser } },
  // Code a test hands to page.evaluate() runs in the browser.
  { files: ['e2e/**'], languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  { files: ['visualizer/*.mjs', 'visualizer/scripts/**', 'visualizer/src/*.test.mjs'], languageOptions: { globals: { ...globals.node, ...globals.browser } } },
]
