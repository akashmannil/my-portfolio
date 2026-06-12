# API & Component Conventions

## Data layer — constants/index.js

All static portfolio content lives in `src/constants/index.js`. Follow these conventions when editing:

- Each exported constant is a plain array of plain objects — no functions, no JSX
- Image paths are relative to `public/` and start with `/` (e.g. `/images/logo.png`)
- 3D model paths are relative to `public/models/` (e.g. `/models/react_logo-transformed.glb`)
- Dates in `expCards` must be chronologically ordered: start date before end date
- All entries referencing a person's name must use the owner's name (Akash / Akash Mannil)

## EmailJS integration

Environment variables are accessed via `import.meta.env`:

```js
import.meta.env.VITE_APP_EMAILJS_SERVICE_ID
import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID
import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
```

Never hard-code EmailJS IDs in component files.

## GSAP conventions

```js
// Register plugins at module level, outside the component
gsap.registerPlugin(ScrollTrigger);

// Use useGSAP inside components
useGSAP(() => {
  gsap.fromTo('.target', { opacity: 0 }, { opacity: 1, scrollTrigger: { ... } });
}, []);
```

- Always pass `[]` as the second arg to `useGSAP` for one-time setup
- Use `.timeline-card`, `.expText` etc. class selectors — avoid querying by ID inside GSAP

## Three.js / R3F conventions

- All 3D canvases are wrapped in `<Canvas>` from `@react-three/fiber`
- Always wrap model components with `<Suspense fallback={null}>` (or a spinner)
- Use `useGLTF` from `@react-three/drei` for loading `.glb` models
- Set `castShadow` and `receiveShadow` on mesh elements that interact with lights

## Smooth scroll (Button component)

```jsx
// Correct usage
<Button text="See my Work" id="button" ele="#work" className="md:w-80 md:h-16" />
```

- `ele` must be a valid CSS selector matching a section `id` in the DOM
- `id` prop being truthy enables the smooth-scroll override; omit it to use default anchor behaviour

## NavBar scroll detection

```js
useEffect(() => {
  const handleScroll = () => setScrolled(window.scrollY > 10);
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []); // empty array — register once
```

The `scrolled` state drives the `.scrolled` / `.not-scrolled` class on the `<header>`.
