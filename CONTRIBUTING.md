# Contributing

Thanks for helping. Bug reports with `npx github:tharun-se95/ModsArena doctor` output are the most useful thing there is; pull requests are welcome too.

## Layout

- **`agent-office/`** is the Claude Code plugin: the mod (`hooks/register.ts`), the `/office` skill, and the bridge (`server/`, Node built-ins only, no dependencies).
- **`visualizer/`** is the page's source, plain Three.js, built into `agent-office/server/public/app.js`. The built file is committed so running the office needs only Node; CI checks it matches its source.
- **`e2e/`** drives the real bridge and page in headless Chromium, with a fake `claude` on the PATH.
- **`scripts/`** keeps the version in step across manifests and builds the hosted demo.

How it all fits together is in [docs/guide.md](docs/guide.md#how-it-works). The bridge's event schema is at the top of `agent-office/server/normalize.mjs`; any other producer can `POST` the same shapes.

## Develop

You need Node 20 or newer and Claude Code.

```sh
git clone https://github.com/tharun-se95/ModsArena && cd ModsArena
claude --plugin-dir ./agent-office               # load the plugin from your checkout
cd visualizer && npm ci && npm run build         # rebuild the page (or: npm run watch)
```

## Test

```sh
npm test                                         # bridge, CLI, page model, scripts
npm run lint                                     # eslint, after `npm ci` at the root
claude plugin test agent-office                  # mod tests (hooks/register.test.ts)
claude plugin validate --strict .                # the marketplace
claude plugin validate --strict agent-office     # the plugin, as the engine loads it
cd e2e && npm ci && npx playwright install chromium && npm test   # the office in a browser
node scripts/build-demo-site.mjs                 # the hosted demo, into site/
```

CI runs all of these on every pull request, with the bridge tests on Linux, macOS and Windows.

## Pull requests

- Keep each one to one change, and add a test for it.
- **Anything users install needs a new version.** `main` is what the marketplace serves, so a change under `agent-office/` or to `.claude-plugin/` must bump the version, or no one with auto-update gets it. CI's version check says so. Run `node scripts/version.mjs set <version>` to bump every manifest at once, and add a `CHANGELOG.md` section.
- Write user-facing text (the page, the CHANGELOG, the README) in plain words, for someone who doesn't know how it works inside.
- Mind the [stability policy](docs/compatibility.md#stability): anything listed there changes only in a major version.

## Release

Maintainers, once the version bump is merged to `main`: run **[Actions → Release → Run workflow](https://github.com/tharun-se95/ModsArena/actions/workflows/release.yml)** on `main`. It runs CI again, checks every manifest against the version (`node scripts/version.mjs check`), tags it, and publishes a GitHub Release with that version's CHANGELOG section. Claude Code's marketplace picks the new version up from `main`.

## Security

Please don't open public issues for vulnerabilities: see [SECURITY.md](SECURITY.md).
