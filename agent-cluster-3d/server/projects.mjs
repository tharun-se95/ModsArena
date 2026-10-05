// Which project a working directory belongs to: the git repository's main
// root (a worktree counts as its repository), named after its origin remote.
// Directories outside any repository are their own project.

import { existsSync, readFileSync, statSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'

const cache = new Map()

function gitRoot(start) {
  let dir = resolve(start)
  for (;;) {
    const dotGit = join(dir, '.git')
    if (existsSync(dotGit)) {
      if (statSync(dotGit).isDirectory()) return { root: dir, gitDir: dotGit }
      // A worktree: `.git` is a file naming <main>/.git/worktrees/<name>.
      const pointer = /gitdir:\s*(.+)/.exec(readFileSync(dotGit, 'utf8'))?.[1]?.trim()
      const main = pointer && /^(.*)[\\/]\.git[\\/]worktrees[\\/]/.exec(resolve(dir, pointer))?.[1]
      if (main) return { root: main, gitDir: join(main, '.git') }
      return { root: dir, gitDir: dotGit }
    }
    const up = dirname(dir)
    if (up === dir) return null
    dir = up
  }
}

export function repoName(remote) {
  if (!remote) return null
  const m = /[:/]([^/:]+\/[^/]+?)(?:\.git)?\/?$/.exec(remote)
  return m ? m[1] : null
}

function originRemote(gitDir) {
  try {
    const config = readFileSync(join(gitDir, 'config'), 'utf8')
    const section = /\[remote "origin"\]([^[]*)/.exec(config)?.[1] ?? ''
    const url = /url\s*=\s*(.+)/.exec(section)?.[1]?.trim()
    // Never pass on credentials embedded in an https remote.
    return url ? url.replace(/\/\/[^/@]+@/, '//') : null
  } catch {
    return null
  }
}

export function findProject(cwd) {
  if (!cwd) return { id: 'unknown', name: 'unknown', remote: null }
  if (cache.has(cwd)) return cache.get(cwd)
  let project
  try {
    const git = gitRoot(cwd)
    const root = git?.root ?? cwd
    const remote = git ? originRemote(git.gitDir) : null
    project = { id: root, name: repoName(remote) ?? basename(root), remote }
  } catch {
    project = { id: cwd, name: basename(cwd) || cwd, remote: null }
  }
  cache.set(cwd, project)
  return project
}
