# Testing Guidelines

This project currently has no automated test suite. Follow these manual verification steps whenever making changes.

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
- [ ] The affected section renders without console errors
- [ ] Animations trigger at the correct scroll position
- [ ] The section is responsive — check at mobile (375px), tablet (768px), and desktop (1280px)
- [ ] No layout shift when scrolling through the page

## After constants/index.js changes

- [ ] All modified sections display the updated content
- [ ] No broken image paths (check browser network tab for 404s)
- [ ] Date ranges in `expCards` are chronologically correct (start before end)

## After Contact form changes

- [ ] Form submits and shows loading state
- [ ] A real test email arrives at the configured EmailJS endpoint
- [ ] Form resets after successful submission
- [ ] Validation prevents empty submission

## After 3D scene changes

- [ ] Model loads on first visit (no infinite Suspense fallback)
- [ ] No WebGL context errors in the console
- [ ] Scene is interactive (OrbitControls respond to mouse/touch)

## Production build verification

```bash
npm run build && npm run preview
```

- [ ] Build completes with no errors
- [ ] Preview matches the dev server output
- [ ] Assets load from the `dist/` directory (no missing files)
