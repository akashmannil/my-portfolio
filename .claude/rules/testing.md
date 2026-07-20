# Testing Guidelines

This project has no automated test suite. Follow these manual verification steps whenever making changes. (When driving the app headlessly, the built-in `run` skill launches the dev server and a headless browser.)

## Before every commit

Run the linter:

```bash
npm run lint
```

Zero errors required. Warnings should be investigated and resolved where practical.

## After component changes

Start the dev server and manually verify:

```bash
npm run dev
```

Checklist:
- [ ] The affected tab renders without console errors
- [ ] Tab entry/exit transitions play (fade + the 3D scene morphs to the new tab)
- [ ] Responsive at mobile (390px), tablet (768px), and desktop (1280px+)
- [ ] No horizontal overflow / layout shift

## After navigation changes

- [ ] NavBar tabs (desktop bar + mobile hamburger menu) switch tabs and mark the active one
- [ ] `TabProgress` dot rail (desktop) / bottom pill (mobile) reflects and changes the active tab
- [ ] The advance control scrolls through `data-scroll-stop` sections on Work before crossing to Contact; hidden on Experience
- [ ] Edge scroll: an extra wheel/swipe past a page bottom crosses to the next tab; past the top returns to the previous tab (landing at its bottom)
- [ ] Deep link + refresh on `/#work` (etc.) opens the right tab

## After constants/index.js changes

- [ ] All modified tabs display the updated content
- [ ] No broken image paths (check the network tab for 404s)
- [ ] Date ranges in `expCards` are chronologically correct (start before end)
- [ ] `tabs` edits stay in sync with the `PAGES` map in `TabView.jsx`

## After Work tab / GitHub feed changes

- [ ] Live repos load under "Latest commits" (or the rate-limit fallback link shows on a `429`)
- [ ] Curated `projects` with a `repoName` are not duplicated in the live list
- [ ] The 3D deck tracks the in-view/hovered project and its "open project" overlay opens the correct URL in a new tab (desktop, ≥1024px)

## After Contact form changes

- [ ] Form submits and shows loading state
- [ ] A real test email arrives at the configured EmailJS endpoint
- [ ] Form resets after successful submission
- [ ] Validation prevents empty submission

## After 3D scene changes

- [ ] The scene loads on first visit to its tab (no infinite Suspense fallback)
- [ ] No WebGL context errors in the console
- [ ] Switching to/from the tab morphs the stage smoothly (no snapping)
- [ ] The scene stays on-screen and readable at mobile widths (ambient backdrop framing)

## Production build verification

```bash
npm run build && npm run preview
```

- [ ] Build completes with no errors
- [ ] Preview matches the dev server output
- [ ] Assets load from `dist/` (no missing files)
