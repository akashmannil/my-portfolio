# /project:fix-issue

Fix a specific bug or reported issue in the portfolio codebase.

## Steps

1. **Understand the issue** — read the description $ARGUMENTS carefully; ask for clarification if the reproduction steps are unclear
2. **Locate the source** — check `src/constants/index.js` first for content bugs; then look in the relevant section or component
3. **Fix minimally** — change only what is necessary; do not refactor surrounding code unless it directly causes the issue
4. **Verify** — run `npm run dev` and confirm the fix in the browser; check that the surrounding section still renders correctly
5. **Lint** — run `npm run lint` and resolve any new warnings

## Common issue patterns

| Symptom | Likely cause |
| --- | --- |
| Section not animating | GSAP ScrollTrigger not registered at module level |
| Smooth scroll not working | `document.querySelector(ele)` returning null — check `ele` prop value |
| Email form not sending | Missing or wrong `.env` variable |
| 3D model not loading | Wrong path in `public/models/` or missing `<Suspense>` |
| Navbar always `scrolled` | `setScrolled` called with hardcoded `true` instead of the computed value |
