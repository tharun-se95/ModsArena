// Which kit each kind of helper wears as a robot crab, after the mascot
// sheets' variations, so you can tell them apart by more than colour (the
// blocks' crowns, in crab). Pure: no DOM, no Three.js; crab.js builds them.
//
//   session          Lead        Classic, carrying the lead's gem
//   general-purpose  Builder     Minimal: just the crab
//   Explore          Researcher  Explorer: a backpack with a bedroll
//   Plan             Planner     Creative: a beret
//   code-reviewer    Reviewer    Coder: big round glasses
//   test-runner      Tester      Focus: headphones

export const KITS = ['none', 'gem', 'backpack', 'beret', 'glasses', 'headphones']

const BY_TYPE = {
  session: 'gem',
  'general-purpose': 'none',
  Explore: 'backpack',
  Plan: 'beret',
  'code-reviewer': 'glasses',
  'test-runner': 'headphones',
}

// Anything we don't know is a plain crab.
export const kitFor = type => BY_TYPE[type] ?? 'none'
