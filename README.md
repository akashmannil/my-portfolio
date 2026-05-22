# Akash Mannil — Portfolio

A modern, immersive personal portfolio built with React 19, Three.js, and GSAP. Features 3D interactive models, scroll-triggered animations, and a live contact form.

## Live Site

[akashmannil.dev](https://akashmannil.dev) <!-- update when deployed -->

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | React 19 + Vite 7 |
| Styling | Tailwind CSS 4 |
| 3D Graphics | Three.js + @react-three/fiber + @react-three/drei |
| Animations | GSAP 3 + ScrollTrigger |
| Email | EmailJS |
| Linting | ESLint 9 |

## Project Structure

```text
src/
├── App.jsx               # Root component — section orchestration
├── main.jsx              # React entry point
├── index.css             # Global styles + Tailwind + custom theme vars
├── constants/
│   └── index.js          # All static data (nav, experience, projects, etc.)
├── components/
│   ├── NavBar.jsx         # Fixed header with scroll detection
│   ├── Button.jsx         # CTA button with smooth scroll
│   ├── AnimatedCounter.jsx
│   ├── GlowCard.jsx       # Mouse-tracking glow effect card
│   ├── TitleHeader.jsx
│   ├── HeroModels/        # 3D hero scene (canvas, lighting, particles, room)
│   └── Models/            # 3D contact + tech-stack icon models
└── sections/
    ├── Hero.jsx
    ├── ShowcaseSection.jsx
    ├── LogoSection.jsx
    ├── FeatureCards.jsx
    ├── ExperienceSection.jsx
    ├── TechStack.jsx
    ├── Contact.jsx
    └── Footer.jsx
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file at the project root:

```env
VITE_APP_EMAILJS_SERVICE_ID=your_service_id
VITE_APP_EMAILJS_TEMPLATE_ID=your_template_id
VITE_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

Get these values from [EmailJS](https://www.emailjs.com/) after setting up a service and email template.

### Development

```bash
npm run dev
```

Runs the dev server at `http://127.0.0.1:5173`.

### Production Build

```bash
npm run build
```

Output is in `dist/`. Preview locally with:

```bash
npm run preview
```

## Key Features

- **3D Hero Section** — Interactive room model rendered with Three.js
- **Animated Tech Stack** — 3D rotating logos (React, Python, Node, Three.js, Git)
- **Scroll Animations** — GSAP ScrollTrigger on every section
- **Glow Cards** — Mouse-position-tracking radial glow on experience cards
- **Live Contact Form** — EmailJS integration with loading/error states
- **Animated Word Slider** — CSS keyframe hero text cycling

## Updating Content

All portfolio data lives in [src/constants/index.js](src/constants/index.js):

- `navLinks` — navigation items
- `expCards` — work experience entries
- `techStackIcons` / `techStackImgs` — skills
- `testimonials` — client reviews
- `socialImgs` — social media links

Swap images in `public/images/` and 3D models in `public/models/` as needed.
