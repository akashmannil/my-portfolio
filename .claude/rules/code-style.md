# Code Style Rules

These rules apply to all JavaScript/JSX files in `src/`.

## Imports

- No `import React from 'react'` — Vite's JSX transform handles it automatically
- Named React hook imports are fine: `import { useState, useEffect } from 'react'`
- Group imports: external libraries → internal components → constants/utils
- No default + named mixed imports on one line

## Components

- Functional components only — no class components
- Component name matches file name (PascalCase)
- One component per file
- Keep components under ~100 lines; extract sub-components when larger
- Props destructured in the function signature, not inside the body

## Hooks

- Use `useGSAP` (from `@gsap/react`) for all GSAP animations — not `useEffect`
- `useEffect` dependency arrays must be explicit — never omit them
- Event listeners registered in `useEffect` must be cleaned up in the return function
- State setters must use the computed value: `setState(computed)` not `setState(hardcoded)`

## Formatting

- 2-space indentation
- Single quotes for strings
- Semicolons optional but consistent within a file
- JSX attributes on separate lines when there are 3 or more props

## Comments

- No comments explaining what the code does — name things clearly instead
- Only comment non-obvious constraints, workarounds, or subtle invariants
- No commented-out code blocks — delete unused code

## Tailwind

- Use custom theme tokens (`bg-ink`, `text-fog`, `text-accent`, etc. — defined in `src/index.css` under `@theme`) rather than raw hex; use arbitrary-value syntax (`text-[10px]`, `bg-ink/70`) where no token fits
- Prefer existing utility classes over inline `style={{}}` props (the exception is values computed at runtime, e.g. the `ProjectHotspot` overlay position)
- Responsive prefixes are mobile-first: base = phone, then `sm:` (≥640) `md:` (≥768) `lg:` (≥1024) `xl:` (≥1280). The 3D stage treats `<1024px` as "compact" (see `src/components/three/responsive.js`)
