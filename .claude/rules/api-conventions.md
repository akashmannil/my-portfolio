# API & Component Conventions

## Data layer — constants/index.js

All static portfolio content lives in `src/constants/index.js`. Follow these conventions when editing:

- Each exported constant is a plain array/object of plain values — no functions, no JSX
- Image paths are relative to `public/` and start with `/` (e.g. `/images/logo.png`)
- 3D model paths are relative to `public/models/` (e.g. `/models/rocket-cartoon.glb`)
- Dates in `expCards` must be chronologically ordered: start date before end date
- All entries referencing a person's name must use the owner's name (Akash / Akash Mannil)

Live constants in use: `tabs`, `resumeFile`, `github`, `heroCopy`, `manifesto`, `counterItems`, `projects`, `expCards`, `skillRows`, `skillSystem`, `sceneData`, `socialImgs`. Some legacy exports from the original template (`testimonials`, `abilities`, `words`, `logoIconsList`, `expLogos`, `techStackImgs`, `techStackIcons`) are still exported but unused — do not build new features on them.

## EmailJS integration

Environment variables are accessed via `import.meta.env`:

```js
import.meta.env.VITE_APP_EMAILJS_SERVICE_ID
import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID
import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
```

Never hard-code EmailJS IDs in component files.

## GSAP conventions

There is **no ScrollTrigger and no Lenis** in this project — do not register or import them. Animations are triggered by mount (tab entry) and explicit UI events, not scroll position.

```js
// Use useGSAP inside components. Scope selector-based tweens to the section
// so they don't leak across tabs.
const ref = useRef(null);
useGSAP(() => {
  gsap.fromTo('.target', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 });
}, { scope: ref });
```

- Pass `{ scope: ref }` (or `[]` for one-time global setup) to `useGSAP`
- Prefer class selectors (`.project-card`, `.m-word`, `.journey-panel`) over IDs
- To animate the 3D stage, tween the shared `stageInputs` scalars — e.g. `gsap.to(stageInputs, { journey: step, duration: 0.9 })` — never tween Three.js objects from React

## Three.js / R3F conventions

- All 3D scenes render inside the single `<Canvas>` in `ScrollStage.jsx`; new scene components go in `src/components/three/` and are registered in `stageSequence` (`stagePose.js`) + the `SCENES` map (`MorphRig.jsx`)
- Always wrap model components with `<Suspense fallback={null}>`; load `.glb` via `useGLTF` from `@react-three/drei` and `useGLTF.preload(path)` at module level
- Set `castShadow` / `receiveShadow` on meshes that interact with lights
- **One-way data flow:** the UI writes `stageInputs` (`tab` via `setStageTab`; `journey`/`project` via gsap); `MorphRig`'s `useFrame` reads it and damps toward the target with `MathUtils.damp`. Do not read React state inside `useFrame`
- The canvas is `pointer-events-none`. To make 3D content clickable, project its world position to screen coordinates each frame into a shared object and overlay a positioned HTML element (see `ProjectCards3D` → `three/projectHotspot.js` → `ProjectHotspot.jsx`)

## Tab navigation conventions

- Tabs are defined in `constants → tabs` (`{ id, label }`) and mapped to section components in `TabView.jsx`'s `PAGES` map — keep the two in sync when adding a tab
- `App.jsx` owns the active-tab state; every navigator (NavBar, TabProgress, edge-scroll) calls the same `onSelect(tabId)`
- Section pages receive `onSelect` and `entryDir` props from `TabView`
- Mark a section as an in-tab scroll target with `data-scroll-stop` + `data-scroll-label="…"`; `TabProgress`'s advance control steps through these before crossing tabs
- A tab that pages internally (e.g. Journey's role stepper) marks its wrapper `data-manual-edge-nav` and mounts `useEdgeNav({ manual: true, requireEdges: false })`

## Arcade view (`src/arcade/`)

- `src/hooks/useViewMode.js` owns the `standard` / `arcade` switch (`localStorage.view-mode`). `setViewMode` always reloads — never try to hot-swap the views, the outgoing one holds a WebGL or canvas context
- Arcade and ambient Live mode are mutually exclusive; entering arcade writes `ambient=off`
- Everything renders onto one low-res canvas (`VIEW_W×VIEW_H` in `scene.js`) that is CSS-scaled with `image-rendering: pixelated`. Keep all coordinates in that low-res space and let the browser scale — never draw at device resolution
- **No external assets.** Text uses the hand-authored 5×7 bitmap font in `pixelFont.js`; sound is synthesised in `audio.js`; art is `fillRect` primitives. Don't introduce sprite sheets, image files or webfonts here
- Content must come from `constants` via `gameData.js` — don't hard-code portfolio copy in the renderer, and don't render prose on the CRT (use bars, badges, items, cabinets)
- Any new sound cue goes in `NOTES` (`audio.js`) and must raise `soundLevel()` so the on-screen speakers visibly react; keep the mute control working
- The dev-only `window.__arcadeGoto(mode)` handle is guarded by `import.meta.env.DEV` for tests — don't rely on it at runtime

## GitHub repo feed (Work tab)

- Configured entirely by `constants → github` (`username`, `excludeRepos`, `excludePrefixes`, `maxRepos`); fetched once and cached at module level in `src/hooks/useGithubRepos.js`
- A curated `projects` entry with a matching `repoName` is filtered out of the live list to avoid duplicates
- Card preview images come from `opengraph.githubassets.com` (unauthenticated, ~100 req/hr rate limit) — a `429` during heavy local testing is the CDN throttling, not a bug

## Ambient "Live" mode

- Themes are swapped by overriding the `@theme` colour tokens as inline CSS custom properties on `document.documentElement` (`useAmbient.js` → `applyPalette` / `clearPalette`). This works because every component uses the semantic tokens (`bg-ink`, `text-paper`, …) which resolve to `var(--color-*)`. Palettes are keyed by the five phases in `AMBIENT_PHASES`; keep the token set in sync with `index.css`
- Time and Weather each support an `Auto` value plus manual overrides (`AMBIENT_PHASES` / `AMBIENT_WEATHERS`, exported for the `AmbientToggle` selects); the effective value = manual if set, else auto. `localStorage`: `ambient` (on/off), `ambient-manual` (`{ time, weather }`)
- The feature is opt-in and must stay off until toggled — do not fetch geolocation/weather on load, and only when **Weather is on Auto**. Use **Open-Meteo** (`api.open-meteo.com`, no key, CORS-enabled); round coordinates before sending; always degrade to time-only on permission-denied/fetch-failure
- Adding a phase means updating `PALETTES` (useAmbient) + `AMBIENT_LIGHT`/`KEY_COLOR`/`CANVAS_FILTER` (ScrollStage) + `ORB_Y` (AmbientSky) together
- Keep the performance disclaimer in `AmbientToggle`; weather visuals belong in the two ambient canvases — `AmbientSky` (z-0, behind the 3D stage) and `GlassView` (z-20, the "through glass" pane in front of content, below the interactive UI) — both keyed off the same `ambient` state, both gated to Live mode, both respecting `prefers-reduced-motion`. Don't add always-on DOM effects
- `GlassView` must stay readable: keep condensation beads biased to the edges and the frost a periphery vignette so the centre reading area stays clear; per-weather intensity lives in its `GLASS` map
