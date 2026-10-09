// The front desk's job cards and the small rules around them: what a job
// is called, and which session took which job. Pure, so it's tested on its
// own (jobcards.test.mjs); desk.js draws them.

// Job cards and their templates. A [bracketed] part is yours to fill in:
// it's selected when the template drops in, so typing replaces it.
export const KINDS = [
  { id: 'write', name: 'Write', blurb: 'A README, release notes, a how-to', templates: [
    ['A README', 'Write a short, friendly README for this project: what it does, how to set it up, and how to use it. Keep it plain and easy to skim.'],
    ['Release notes', 'Write release notes for the changes since [the last release], in plain words for people who use it, not the people who built it.'],
    ['A how-to', 'Write a step-by-step how-to for [a task people do here], with an example at each step.'],
  ] },
  { id: 'research', name: 'Research', blurb: 'Find out how something works', templates: [
    ['How does it work?', 'Explain how [this part of the project] works, in plain words, with the files that matter. Don’t change anything.'],
    ['Compare options', 'Compare a few ways to [solve this problem] for this project. Say what each costs and which you’d pick. Don’t change anything.'],
    ['Map the project', 'Give me a tour of this project: what lives where and how the pieces fit together. Don’t change anything.'],
  ] },
  { id: 'fix', name: 'Fix', blurb: 'Something’s broken or failing', templates: [
    ['A bug', 'Fix this bug: [what goes wrong, and when]. Find the cause first, then fix it and add a test that would have caught it.'],
    ['Failing tests', 'The tests are failing. Find out why and fix the cause, not the tests, unless the tests are wrong.'],
    ['Typos and links', 'Find and fix typos and broken links in the docs.'],
  ] },
  { id: 'review', name: 'Review', blurb: 'A second pair of eyes', templates: [
    ['My latest changes', 'Review my latest changes for bugs and anything confusing. List what you find, most important first. Don’t change anything.'],
    ['Security', 'Look through [this part of the project] for security problems. Explain each in plain words and how to fix it. Don’t change anything.'],
    ['Easy to use?', 'Check whether [this feature] is easy to use for someone new. Suggest small fixes. Don’t change anything.'],
  ] },
  { id: 'plan', name: 'Plan', blurb: 'Think it through before building', templates: [
    ['A new feature', 'Plan how to add [the feature]. Write the plan as small steps with what each one touches. Don’t change any files yet.'],
    ['Break it down', 'Break [a big job] into small steps I can hand out one at a time. Don’t change any files yet.'],
    ['A cleanup', 'Plan a cleanup of [the messy part]: what to tidy first and what to leave alone. Don’t change any files yet.'],
  ] },
  { id: 'other', name: 'Something else', blurb: 'Say it in your own words', templates: [] },
]

// A job's name: the first sentence of what you asked, kept short.
export function titleOf(prompt) {
  const first = prompt.replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s/)[0].replace(/[.:]$/, '')
  return first.length > 60 ? `${first.slice(0, 57)}…` : first
}


// The job a session is doing, if the front desk started it: by its session
// id or the short id `claude --bg` printed, or, while the bridge hasn't
// heard the id yet, the newest job still starting in the same project.
export function matchJob(jobs, n) {
  if (!n?.session) return null
  const list = [...jobs]
  for (const job of list) {
    if (job.session === n.session || (job.short && n.session.startsWith(job.short))) return job
  }
  for (const job of list.reverse()) {
    if (job.state === 'starting' && !job.short && (job.dir === n.cwd || job.dir === n.project)) return job
  }
  return null
}
