# CLAUDE.md

Team instructions for Claude Code when working in this repository.

## Project Overview

This is **Akash Mannil's personal portfolio**. It ships **two mutually exclusive top-level views**, chosen by `src/hooks/useViewMode.js` (persisted in `localStorage.view-mode`; switching triggers a full page reload so the outgoing view's WebGL/canvas contexts tear down):

- **`standard`** (default) — a single-page React app organised as **tabs** (Home / About / Experience / Skills / Work / Contact). Each tab is a full-height page with its own 3D Three.js scene; GSAP fades one tab out and the next in, while a single fixed canvas morphs its scene to match.
- **`arcade`** — a pixel-art workstation that presents the same portfolio as a little game on a CRT. See the Arcade section below.

All visible content (copy, images, experience, skills, projects) is managed through [src/constants/index.js](src/constants/index.js) and feeds **both** views. The Work tab also pulls the latest public repos live from the GitHub API.

In the standard view there is **no long-scroll narrative and no ScrollTrigger/Lenis** — it is tab-based. Individual tabs (Work, Contact) can scroll internally, but moving _between_ tabs is a state change, not a scroll.

## Stack at a Glance

- **React 19** + **Vite 7** — functional components only, no class components
- **Tailwind CSS 4** — utility-first; custom tokens defined in `src/index.css` under `@theme`
- **Three.js / @react-three/fiber** (+ **drei**) — 3D rendering; every Canvas component lives in `src/components/three/`. One fixed `ScrollStage` canvas holds all scenes; the active tab's camera framing/colour lives in `stagePose.js` → `tabPoses`
- **GSAP 3** (+ `@gsap/react`) — animations use the `useGSAP` hook (never `useEffect`); tab page transitions are driven by `src/components/TabView.jsx`
- **EmailJS** — contact form; credentials are Vite env vars (`VITE_APP_EMAILJS_*`)
- **Ambient "Live" mode** — an opt-in navbar toggle that re-themes the app to the user's real local time of day and weather (geolocation + the key-less [Open-Meteo](https://open-meteo.com/) API); see the Ambient section below

## Architecture

`App.jsx` is a thin switch: it reads the view mode and renders either `<ArcadeView>` or `<StandardView>`. The tab/ambient hooks live inside `StandardView` so they never run in arcade mode.

`StandardView` holds the single source of truth for the tabbed site: the active tab id in `useState`. It renders four persistent layers:

| Layer | File | Role |
| --- | --- | --- |
| `NavBar` | `src/components/NavBar.jsx` | Top tab bar (desktop) + hamburger menu (mobile); calls `onSelect(tabId)` |
| `ScrollStage` | `src/components/three/ScrollStage.jsx` | The one fixed R3F canvas (`z-0`, `pointer-events-none`); fades out as a tab scrolls (except Work) |
| `TabView` | `src/components/TabView.jsx` | Maps the active tab id → section component and cross-fades between them |
| `TabProgress` + `ProjectHotspot` | `src/components/TabProgress.jsx`, `ProjectHotspot.jsx` | Persistent nav indicator/advance control, and the invisible link over the 3D project deck |

**The 3D stage is driven by one-way data flow.** The UI writes to the shared mutable `stageInputs` object in `stagePose.js` (`tab`, `journey`, `project`); the R3F frame loop in `MorphRig.jsx` only ever _reads_ it and damps the scene toward the target every frame. **Never tween Three.js objects directly from React** — set `stageInputs` (via `setStageTab`, or `gsap.to(stageInputs, …)` for the `journey`/`project` scalars) and let `MorphRig` follow.

Each tab shows one scene, chosen by the `actor` index in its `tabPoses` entry, drawn from `stageSequence` in `stagePose.js`:

| Tab | `actor` | Scene key | Component |
| --- | --- | --- | --- |
| home | 0 | `laptop` | `FloatingLaptop` |
| about | 1 | `desk` | `DeskScene` |
| experience | 2 | `rocket` | `JourneyRocket` |
| skills | 3 | `sphere` | `TechSphere` |
| work | 4 | `cards` | `ProjectCards3D` |
| contact | 6 | `dish` | `ContactDish` |

(`actor` 5 = `rack` / `ServerRack` is currently unused — it belonged to the removed Stats section. On compact widths, `MorphRig` raises and shrinks the scene so it sits behind copy as an ambient backdrop.)

### Navigation — three ways to move

1. **Nav tabs** — `NavBar` (desktop bar / mobile menu) and the `TabProgress` dot rail jump straight to any tab.
2. **The advance control** — `TabProgress`'s "Next" chip. On a scrollable tab (Work) it first smooth-scrolls to the next `[data-scroll-stop]` section and only crosses to the next tab once past the last one. Hidden on Experience (its stepper's arrow advances). On desktop it's a labelled bottom-right chip; on mobile it merges with the dots into one compact centre-bottom pill.
3. **Edge scroll** — `src/hooks/useEdgeNav.js`: an extra wheel/swipe past a page's bottom (or top) crosses to the next (or previous) tab. Backward navigation lands at the previous page's bottom (`TabView` passes `entryDir` to pages). The Experience tab mounts its own `manual` instance so scroll walks its role stepper before crossing tabs; the app-level instance stands down while `[data-manual-edge-nav]` is in the DOM.

### The Work tab (live GitHub + clickable 3D)

- **Curated projects** come from `constants → projects`; below them, **live repos** are fetched by `src/hooks/useGithubRepos.js` (module-level cache; username + filters in `constants → github`) and rendered as `RepoCard`s. A curated project's `repoName` de-dupes it from the live list.
- The active project the 3D deck shows is tracked by an IntersectionObserver on `.project-card` (plus hover), written to `stageInputs.project`.
- The canvas is `pointer-events-none`, so the deck's "open project" is made clickable by projecting the active card's screen rect each frame (`ProjectCards3D` → `three/projectHotspot.js`) and overlaying a transparent `<a>` (`ProjectHotspot.jsx`). **To make any other 3D element clickable, reuse this projection-overlay pattern — do not give the canvas pointer events** (it would swallow all page clicks/scroll).

### Ambient "Live" mode

Off by default; toggled and configured from the navbar settings popover (`AmbientToggle` — a desktop popover / mobile menu block with **Time** and **Weather** selects). When on, `src/hooks/useAmbient.js`:

- Classifies the local hour into five phases `dawn / day / afternoon / dusk / night` and the Open-Meteo WMO code into `clear / clouds / fog / rain / snow / storm`.
- Applies a per-phase palette by overriding the `@theme` colour tokens as inline CSS variables on `<html>` (dawn/day/afternoon flip to light themes; dusk/night stay dark). Toggling off removes the overrides, reverting to the default dark theme. Phase and manual overrides persist in `localStorage` (`ambient`, `ambient-manual`).
- **Auto vs manual:** each of Time/Weather defaults to `Auto`. Auto weather requests **geolocation** (rounded to ~1km) and fetches **Open-Meteo** (no API key; refreshes every 10 min, clock re-checked each minute); denied/failed → **time-only** (palette from the clock, no weather). Setting Time or Weather to a specific value overrides Auto — and if Weather is manual, geolocation/network is never touched. The exported `AMBIENT_PHASES` / `AMBIENT_WEATHERS` drive the selects.

Weather visuals are two canvas overlays: `src/components/AmbientSky.jsx` (z-0, BEHIND the 3D stage — sun/moon dimmed under overcast, per-condition sky veil, rain/snow whose colour adapts to the light/dark palette, storm lightning) and `src/components/GlassView.jsx` (z-20, IN FRONT of the page content but below the interactive UI — a "viewed through glass" pane: overall tint, edge condensation frost, a drifting reflection glare, and refractive water droplets that slide as rain-streaks or sit as condensation beads; beads bias to the edges so the reading area stays clear). Both respect `prefers-reduced-motion`. `ScrollStage` also, per phase, brightens its lights and applies a `CANVAS_FILTER` colour-grade to the 3D layer so the models don't read as neon on light palettes. **The performance disclaimer in `AmbientToggle` is required — keep it** (the mode runs continuous canvas + 3D work). When adding a phase, update the palette in `useAmbient` AND the `AMBIENT_LIGHT` / `KEY_COLOR` / `CANVAS_FILTER` maps in `ScrollStage` and `ORB_Y` in `AmbientSky`.

### The Arcade view (`src/arcade/`)

Entered from the navbar's **Arcade** control (sitting right next to **Live**) and exited from the in-scene "Exit Arcade" button. Arcade and Live are mutually exclusive — switching to arcade forces `ambient` off.

Everything is drawn programmatically onto a low-resolution canvas (`512×320`) that is CSS-scaled with `image-rendering: pixelated`, so there are **no sprite sheets, no image assets and no font files** to load:

| File | Role |
| --- | --- |
| `ArcadeView.jsx` | React shell: sizes the canvas, runs the rAF loop, owns keyboard/pointer input, composites the game buffer into the scene |
| `scene.js` | The room: CRT monitor + bezel, keyboard, mouse, two speakers, poster, plant, desk, and the over-the-shoulder pixel operator |
| `game.js` | What's on the CRT: a `boot → hub → panel` state machine plus all five gamified panels |
| `gameData.js` | Reshapes `constants` into game objects (stations, quests, inventory items, cabinets, comm channels) |
| `pixelFont.js` | A hand-authored 5×7 bitmap font (`drawText`) so text stays true pixels at any scale |
| `audio.js` | WebAudio chiptune blips, synthesised (no audio files), plus the decaying `soundLevel()` the speakers react to |

The in-screen game deliberately shows **no prose** — the portfolio is expressed as game furniture: a walkable hub with five stations, then `STATS` (RPG stat bars), `QUEST LOG` (roles as cleared levels), `INVENTORY` (skills as tiered items), `ARCADE` (projects as selectable cabinets, Enter opens the real URL) and `COMMS` (socials as channels).

**Interaction feedback is part of the scene, not a HUD:** pressing a key lights that keycap and moves the operator's left hand to it; moving/clicking the pointer moves the right hand on the mouse and presses its button; every sound cue raises `soundLevel()`, which pulses the speaker cones, fills the VU meters and emits anime-style radiating sound arcs. Sound has a visible mute toggle and only starts the AudioContext on a gesture.

## Coding Standards

See `.claude/rules/` for detailed rules. Short version:

- No `import React from 'react'` — the JSX transform is enabled
- No unnecessary comments; name things clearly instead
- Prefer editing `src/constants/index.js` for content changes over touching component files
- Keep components under ~100 lines; split into smaller pieces if larger
- All 3D scenes need a `<Suspense>` boundary with a fallback
- Use `useGSAP` (not `useEffect`) for animation; drive the 3D stage through `stageInputs`, never by mutating Three objects from React

## Common Tasks

| Task | Where to look |
| --- | --- |
| Add/rename/reorder tabs | `src/constants/index.js` → `tabs` (rendered by `NavBar`/`TabProgress`, mapped to pages in `TabView.jsx`) |
| Tune the GitHub repo feed (Work tab) | `src/constants/index.js` → `github` (username, `excludeRepos`, `excludePrefixes`, `maxRepos`; fetched by `src/hooks/useGithubRepos.js`) |
| Add/edit experience | `src/constants/index.js` → `expCards` (rendered by `src/sections/Journey.jsx`; `brand` is the short wordmark printed on the rocket hull) |
| Add a curated project | `src/constants/index.js` → `projects` (+ `repoName` to hide its live repo, + image in `public/images/`) |
| Edit hero copy | `src/constants/index.js` → `heroCopy` (Home tab) |
| Edit approach/manifesto + stat counters | `src/constants/index.js` → `manifesto`, `counterItems` (About tab) |
| Edit skill marquee rows | `src/constants/index.js` → `skillRows` |
| Edit the 3D skill solar system | `src/constants/index.js` → `skillSystem` (rendered by `TechSphere` / `SkillPlanet`) |
| Edit on-screen text inside a 3D scene | `src/constants/index.js` → `sceneData` (laptop/desk/contact terminals) |
| Change social links | `src/constants/index.js` → `socialImgs` |
| Change the résumé file | `src/constants/index.js` → `resumeFile` (+ file in `public/`) |
| Change theme colours / fonts | `src/index.css` → `@theme` tokens |
| Adjust ambient time-of-day palettes / weather mapping | `src/hooks/useAmbient.js` (`PALETTES`, `weatherFromCode`) |
| Adjust ambient sky/weather visuals | `src/components/AmbientSky.jsx` |
| Adjust the "glass pane" overlay (droplets/frost/glare) | `src/components/GlassView.jsx` → `GLASS` per-weather map |
| Tune per-tab 3D framing / colour | `src/components/three/stagePose.js` → `tabPoses` |
| Adjust the nav indicator / advance control | `src/components/TabProgress.jsx` |
| Adjust edge-scroll tab crossing | `src/hooks/useEdgeNav.js` |
| Edit a 3D scene | `src/components/three/` → component named in the table above |
| Change what the arcade shows on the CRT | `src/arcade/game.js` (`panels`) + `src/arcade/gameData.js` |
| Change the arcade room / monitor / peripherals / operator | `src/arcade/scene.js` |
| Add an arcade sound cue | `src/arcade/audio.js` → `NOTES` |

## Dev Commands

```bash
npm run dev      # start dev server (127.0.0.1:5173)
npm run build    # production build → dist/
npm run preview  # preview production build locally
npm run lint     # ESLint check
```

## Environment Variables

Required — create `.env` at project root:

```env
VITE_APP_EMAILJS_SERVICE_ID=
VITE_APP_EMAILJS_TEMPLATE_ID=
VITE_APP_EMAILJS_PUBLIC_KEY=
```

(No key is needed for the weather feed — Ambient mode uses the free Open-Meteo API.)

## What NOT to do

- Do not push `.env` — it contains live EmailJS credentials
- Do not add TypeScript without a deliberate project decision; this repo is plain JS
- Do not install UI component libraries (Shadcn, MUI, etc.) — the design is intentionally custom
- Do not refactor working 3D scenes unless the task requires it — Three.js/R3F setup is fragile to churn
- Do not reintroduce ScrollTrigger/Lenis or a long-scroll narrative — the standard view is tab-based
- Do not give the `ScrollStage` canvas pointer events — use the `ProjectHotspot` projection-overlay pattern to make 3D content clickable
- Do not add sprite sheets, image assets or webfonts to `src/arcade/` — every pixel is drawn in code on purpose, which keeps the view dependency-free and instantly loadable
- Do not put prose on the arcade CRT — content there is expressed as game objects (bars, badges, items, cabinets), not paragraphs
- Do not let arcade and Live mode be enabled at once — they are mutually exclusive views
