# Akash Mannil — Portfolio

A personal developer portfolio built as an interactive, **tab-based single-page app**. Each section — Home, About, Experience, Skills, Work, Contact — is a full-height page with its own animated 3D scene, and a single fixed WebGL canvas morphs between scenes as you move between tabs. The Work tab shows curated projects plus the latest repositories pulled live from GitHub.

**Live demo:** [my-portfolio-ashen-rho-24.vercel.app](https://my-portfolio-ashen-rho-24.vercel.app)

## Features

- **Tabbed experience** — one 3D Three.js scene per tab, with GSAP cross-fades between tabs (no long-scroll narrative)
- **Three ways to navigate** — the nav bar / mobile menu, a persistent progress indicator with an advance button, and "edge scroll" (keep scrolling past a page edge to cross to the next tab)
- **Live GitHub feed** — the Work tab fetches recent public repos from the GitHub API and renders them alongside hand-picked projects
- **Interactive 3D** — a floating laptop, desk, rocket "career" stepper, skill solar system, project deck (with clickable "open project" cards) and a contact dish
- **Contact form** — wired to EmailJS
- **Responsive & motion-aware** — adapts framing for phone/tablet/desktop and respects `prefers-reduced-motion`

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | React 19 + Vite 7 |
| Styling | Tailwind CSS 4 |
| 3D graphics | Three.js + @react-three/fiber + @react-three/drei |
| Animation | GSAP 3 (with @gsap/react) |
| Email | EmailJS |
| Linting | ESLint 9 |

> Note: the app is **tab-based** — there is intentionally no ScrollTrigger or smooth-scroll library.

## Getting Started

**Prerequisites:** Node.js 18+ and npm.

```bash
git clone https://github.com/akashmannil/my-portfolio.git
cd my-portfolio
npm install
```

Create a `.env` file in the project root with your EmailJS credentials (from the [EmailJS](https://www.emailjs.com/) dashboard):

```env
VITE_APP_EMAILJS_SERVICE_ID=your_service_id
VITE_APP_EMAILJS_TEMPLATE_ID=your_template_id
VITE_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

Then:

```bash
npm run dev      # start the dev server at http://127.0.0.1:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
npm run lint     # run ESLint
```

## Editing Content

Almost everything visible — copy, experience, skills, projects, social links, the GitHub feed settings — is data in **[`src/constants/index.js`](src/constants/index.js)**. Theme colours and fonts are tokens in **[`src/index.css`](src/index.css)** (`@theme`). You rarely need to touch component files for content changes.

Key data:

- `tabs` — the tabs and their labels
- `heroCopy`, `manifesto`, `counterItems` — Home / About copy and stats
- `expCards` — work experience (each `brand` is printed on the rocket hull)
- `skillRows`, `skillSystem` — skill marquee + 3D solar system
- `projects` — curated Work entries (a `repoName` hides that repo from the live feed)
- `github` — GitHub feed username and filters
- `socialImgs`, `resumeFile` — social links and résumé download

Swap images in `public/images/` and 3D models in `public/models/` as needed.

## Project Structure

```text
src/
  App.jsx                 # owns the active-tab state; renders the persistent layers
  main.jsx                # React entry point
  index.css               # Tailwind theme tokens + global styles
  constants/index.js      # all site content
  components/
    NavBar.jsx            # desktop tab bar + mobile menu
    TabView.jsx           # maps active tab → section page, cross-fades between them
    TabProgress.jsx       # progress indicator + advance / "next" control
    ProjectHotspot.jsx    # invisible link overlaying the active 3D project card
    ContactForm.jsx, RepoCard.jsx, JourneyPanel.jsx
    three/                # every 3D scene + the fixed ScrollStage canvas
      ScrollStage.jsx      # the one <Canvas>
      MorphRig.jsx         # per-frame loop that morphs the stage to the active tab
      stagePose.js         # tabPoses + the shared stageInputs the UI writes to
      FloatingLaptop, DeskScene, JourneyRocket, TechSphere,
      ProjectCards3D, ContactDish, ...
  sections/               # one page per tab (Hero, About, Journey, Skills, Projects, Contact)
  hooks/
    useEdgeNav.js         # scroll-past-the-edge tab crossing
    useGithubRepos.js     # live GitHub repo fetch + cache
```

For a deeper architectural tour — how the 3D stage is driven, the navigation model, the GitHub feed, and how 3D content is made clickable — see [CLAUDE.md](CLAUDE.md).

## Deployment

Any static host works. The project builds to `dist/` and is currently deployed on [Vercel](https://vercel.com/). Set the `VITE_APP_EMAILJS_*` environment variables in your host's dashboard.

## Credits

- Rocket model — "Minimal Cartoon Rocketship" by [Gambsmoore](https://poly.pizza/m/dsjkFYy-rb0) (CC-BY)
- Satellite dish model by [Kenney](https://poly.pizza/m/IDRrztoAMB)
