# /project:review

Review the current branch changes for code quality, correctness, and consistency with this portfolio's standards.

## What to check

1. **Bugs** — logic errors, wrong DOM API calls, missing event.preventDefault(), stale closures in useEffect
2. **React standards** — no unnecessary `import React`, hooks follow rules-of-hooks, useGSAP used instead of useEffect for animations
3. **Content correctness** — all data changes in `src/constants/index.js` are accurate (dates not inverted, names correct)
4. **Dead code** — no commented-out blocks, unused imports, or orphaned variables
5. **3D scene safety** — any new R3F/Three.js scene has a `<Suspense>` boundary
6. **Accessibility** — images have meaningful `alt` text, form inputs have `htmlFor` labels
7. **Performance** — no inline object/array literals passed as props to memo'd components

## Output format

Report findings as:
- **[BUG]** — must fix before merge
- **[WARN]** — should fix, not blocking
- **[NOTE]** — suggestion or observation

End with a short summary: ready to merge / needs changes.
