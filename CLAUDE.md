# CLAUDE.md

Team instructions for Claude Code when working in this repository.

## Project Overview

This is **Akash Mannil's personal portfolio** — a single-page React app with 3D Three.js scenes and GSAP scroll animations. All visible content (text, images, experience, skills) is managed through [src/constants/index.js](src/constants/index.js).

## Stack at a Glance

- **React 19** + **Vite 7** — no class components, use functional components only
- **Tailwind CSS 4** — utility-first; custom tokens defined in `src/index.css` under `@theme`
- **Three.js / @react-three/fiber** — 3D rendering; all Canvas components live in `src/components/three/` (a single fixed `ScrollStage` canvas drives the scroll experience)
- **Lenis** — smooth scrolling, wired into GSAP's ticker in `src/App.jsx`
- **GSAP 3** — animations use `useGSAP` hook (not `useEffect`); register plugins at module level (`gsap.registerPlugin(ScrollTrigger)`)
- **EmailJS** — contact form; credentials are Vite env vars (`VITE_APP_EMAILJS_*`)

## Coding Standards

See `.claude/rules/` for detailed rules. Short version:

- No `import React from 'react'` — JSX transform is enabled
- No unnecessary comments; name things clearly instead
- Prefer editing `src/constants/index.js` for content changes over touching component files
- Keep components under 100 lines where possible; split into smaller pieces if larger
- All 3D scenes need a `<Suspense>` boundary with a fallback

## Common Tasks

| Task | Where to look |
|---|---|
| Change nav links | `src/constants/index.js` → `navLinks` |
| Add/edit experience | `src/constants/index.js` → `expCards` (rendered by `src/sections/Journey.jsx`) |
| Add a project | `src/constants/index.js` → `projects` + add image to `public/images/` |
| Edit hero / manifesto copy | `src/constants/index.js` → `heroCopy`, `manifesto` |
| Edit skill marquee rows | `src/constants/index.js` → `skillRows` |
| Change social links | `src/constants/index.js` → `socialImgs` |
| Change theme colours / fonts | `src/index.css` → `@theme` tokens |
| Tune 3D scroll choreography | `src/components/three/stagePose.js` → `sectionKeyframes` |
| Edit a 3D scene (laptop, desk, graph, sphere, cards, rack, terminal) | `src/components/three/` → scene component named in `stageSequence` |

## Dev Commands

```bash
npm run dev      # start dev server (127.0.0.1:5173)
npm run build    # production build → dist/
npm run preview  # preview production build locally
npm run lint     # ESLint check
```

## Environment Variables

Required — create `.env` at project root:

```
VITE_APP_EMAILJS_SERVICE_ID=
VITE_APP_EMAILJS_TEMPLATE_ID=
VITE_APP_EMAILJS_PUBLIC_KEY=
```

## What NOT to do

- Do not push `.env` — it contains live EmailJS credentials
- Do not add TypeScript without a deliberate project decision; this repo is plain JS
- Do not install UI component libraries (Shadcn, MUI, etc.) — the design is intentionally custom
- Do not refactor working 3D scenes unless the task specifically requires it — Three.js/R3F setup is fragile to churn
