# Agent Cluster 3D: UI revamp plan

The review found that the side panels already do the monitoring, and the 3D view mostly gets in the way: it opens unreadable, clicks throw the camera around, rotation and zoom lose things, agents are moving targets, the feed scrolls too fast, warnings get buried, and the map hides urgency. This plan fixes each of those, then gives the whole page one calm, modern look.

## What the page is for

You glance at it beside your terminal and get three answers in under two seconds:

1. **Is anything in trouble?** A session or agent near its context limit, or a run of failing tools.
2. **What is working right now?** Which sessions and agents are busy, and on what.
3. **Where should I look?** One click takes you to it, and nothing else moves.

Every change below serves one of those three answers.

## Design direction

- **Calm instrument, not a light show.** The field is dark and quiet. Color appears only where it carries meaning: fill level (green, amber, red), activity (a soft pulse), and failure (red). Glow is reserved for things that are working.
- **Type does the work.** Labels are crisp HTML text at a fixed pixel size, so they read the same at any zoom. The interface uses a system sans-serif, and numbers use a monospace face with tabular figures.
- **One accent.** Cyan marks interactive and live elements. Status colors stay separate from the accent.
- **Panels as glass cards** with one border weight, one radius, and generous spacing, all set from a single token sheet.

## Review findings and fixes

| # | Finding | Fix |
| --- | --- | --- |
| 1 | The first screen is unreadable | Labels become fixed-size HTML pills (name, status dot, context %). The page opens framed on the busiest project, or on the project you last chose. Agent labels appear when you are close enough to read them (level of detail), so the overview stays clean. |
| 2 | Clicking throws you into the scene | A click selects: the node gets a highlight ring, its links light up, everything else dims, and the panel opens. The camera does not move. Double-click, or **Focus** in the panel, glides to a comfortable distance. |
| 3 | Rotation loses things | The camera orbits the middle of what is on screen, not the scene origin. Tilt is limited to about 50 degrees off head-on, so the layout can never turn edge-on. **Reset view** (or R) frames everything again. |
| 4 | Zoom goes to the wrong place | Zoom follows the mouse, with soft limits on how close or far you can go. |
| 5 | Agents are small, moving targets | Nothing moves anymore. Sessions sit on a grid inside their project, subagents on fixed rings around their session, nested agents around their parent, and tools in a tight ring around whoever runs them. Each node has a larger invisible hit area, and labels can be clicked too. |
| 6 | The feed is too fast and ambiguous | The feed follows the project filter. Each line names its session and agent. Lines arrive in batches twice a second, and the feed pauses while you hover it. **All / Problems** chips switch to failures and warnings only. |
| 7 | Needs attention fills with old news | Context warnings come first, sorted by how full they are, each with a small bar. Compactions show only for the last 60 seconds, at most three, and fade out. |
| 8a | Urgency is invisible on the map | Session and agent rings show only how full they are, colored green, amber, then red. The category breakdown moves into the panel. Over 80% adds a red halo that pulses slowly. |
| 8b | Project shapes carry no information | The wireframe shapes are replaced by a flat outline under each project's sessions, with a header label: name, live sessions, working agents, fullest window. |
| 8c | Live cost flickers in the header | The header shows what you monitor: live sessions, working agents, running tools, and needs-attention count. Cost moves to the session panel and the project label's tooltip. |

## Layout of the page

```
┌ top bar ─────────────────────────────────────────────────────────────┐
│ ◉ Agent Cluster   [All] [payments-api ●2] [web-dashboard ●1]   live │
├──────────────────────────────────────────────────┬───────────────────┤
│ live 3 · agents 5 · tools 4 · attention 1        │ NEEDS ATTENTION   │
│                                                  │  ▮▮▮▮▮▮▯ 84% …    │
│            3D field (head-on, fixed layout)      │ ACTIVITY [All|⚠]  │
│                                                  │  session › agent  │
│ [selection card]               [⟲ reset] [legend]│  …                │
└──────────────────────────────────────────────────┴───────────────────┘
```

- **Top bar:** brand, project chips (each with a live count and a red dot when that project needs attention), connection state. On phones the chips scroll sideways.
- **Stat strip:** four monitoring numbers, no cost.
- **Right column:** the Needs attention card on top, then Activity with filter chips. On phones this becomes a bottom sheet that starts folded.
- **Selection card:** bottom-left, with a radial context gauge, the category breakdown, prompts, subagents and compactions, plus **Focus** and **Close**.
- **Corner tools:** Reset view, plus a legend that folds away.

## The 3D field

- **Fixed layout:** projects on a grid, sessions on a grid inside each project, subagents on rings, tools close by. Slots are stable, so nothing shifts when work starts or ends.
- **Nodes:** a session is a soft glowing core inside a fill ring. An agent is a smaller core with its own fill ring, tinted by agent type. A tool is a small diamond that flashes green or red and fades.
- **Links:** straight, thin and quiet. A link carries light only while its child is working.
- **Hover:** highlights the node and its links, and dims the rest a little.
- **Selection:** a white ring and dimmed surroundings until you click empty space.
- **Finished agents** fade after 20 seconds and stay listed on their session.

## Build order

1. Model: finished agents fade but are remembered, project summaries, a feed with context.
2. Layout: a fixed, slot-based layout for every node.
3. Scene: new node look, fill-only rings, HTML labels with level of detail, hover and selection highlighting.
4. Camera: orbit around content, limited tilt, zoom to cursor, reset view, no movement on click.
5. HUD: tokens and type, top bar with chips, stat strip, ranked attention, batched and filterable feed, selection card with gauge.
6. Phones: top-bar chips scroll, bottom sheet, canvas fits the gap.
7. Verify by recording the same walkthrough as the review, and compare.
