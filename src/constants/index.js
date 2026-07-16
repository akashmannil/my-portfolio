const navLinks = [
  {
    name: "Work",
    link: "#work",
  },
  {
    name: "Experience",
    link: "#experience",
  },
  {
    name: "Skills",
    link: "#skills",
  },
  {
    name: "Download Resume",
    link: "",
    download: true
  },
];

const heroCopy = {
  eyebrow: "Akash Mannil — Full Stack Developer",
  lines: [
    { text: "Code with", style: "sans" },
    { text: "character.", style: "serif" },
  ],
  sub: "Six years of building fast, reliable, human-friendly software — from Angular front ends at enterprise scale to open-source full-stack work.",
};

const manifesto =
  "I believe great software feels effortless. Every interface I build starts with a question — how should this feel? — and ends with clean, scalable code that answers it. From resolving production incidents at telecom scale to shipping open-source features with distributed teams, I bring craft, calm, and curiosity to every line.";

const projects = [
  {
    title: "JobMatch",
    desc: "A two-sided hiring platform that reframes the job hunt as live market intelligence — candidates track the roles, salaries and skills trending right now, while recruiters win on proof over reach. Built for signal, not spam.",
    imgPath: "/images/job-finder.png",
    url: "https://job-finder-poc.vercel.app/",
    tags: ["React", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "QuestBoard",
    desc: "A gamified promotion board for indie games where great titles rise on merit instead of ad budgets. Studios post quests, players level up and earn for spreading the word — all wrapped in a retro pixel-arcade UI with a day-by-day simulation.",
    imgPath: "/images/quest-board.png",
    url: "https://quest-board-poc.vercel.app/",
    tags: ["React", "TypeScript", "Game UI"],
  },
  {
    title: "CineVault",
    desc: "A cinematic personal film archive for curating the movies that matter — rate them, keep private notes, build a watchlist and rediscover your taste over time. Full-stack app deployed on Render.",
    imgPath: "/images/cinevault.png",
    url: "https://moviesmanager.onrender.com/",
    tags: ["Node.js", "Express", "MongoDB"],
  },
  {
    title: "Project Management MVP",
    desc: "A polished marketing site for a college project-management program — hands-on curriculum, outcome stats and a clean, conversion-focused layout built with jQuery, vanilla JS and TailwindCSS.",
    imgPath: "/images/pm-mvp.png",
    url: "https://lcsf2411.github.io/pm-mvp/",
    tags: ["JavaScript", "jQuery", "TailwindCSS"],
  },
  {
    title: "ArcBlade Works",
    desc: "A premium brand site for a precision power-tool maker — bold editorial typography, smooth scroll and a product showcase, purpose-built for a real client brief.",
    imgPath: "/images/arcblade.png",
    url: "https://lcsf2411.github.io/",
    tags: ["HTML", "CSS", "JavaScript"],
  },
];

const sceneData = {
  laptopScreen: [
    { text: 'const dev = "Akash Mannil"', tone: 'base' },
    { text: 'dev.role = "Full Stack Developer"', tone: 'base' },
    { text: 'dev.experience = "6+ years"', tone: 'accent' },
    { text: 'dev.stack = [React, Angular, Node]', tone: 'base' },
    { text: '// code with character.', tone: 'dim' },
    { text: 'dev.ship(ideas, craft) _', tone: 'accent' },
  ],
  deskScreen: [
    { text: '~ $ whoami', tone: 'dim' },
    { text: 'Akash - builder of calm software', tone: 'base' },
    { text: '~ $ uptime', tone: 'dim' },
    { text: '6+ years / enterprise to open source', tone: 'accent' },
  ],
  contactScreen: [
    { text: '> establishing uplink...', tone: 'dim' },
    { text: '> channel: OPEN', tone: 'accent' },
    { text: '> response time: fast', tone: 'base' },
    { text: '> send_message( ) _', tone: 'accent' },
  ],
};

const skillRows = [
  ["React", "Angular", "JavaScript", "TypeScript", "HTML", "CSS"],
  ["Node.js", "Express", "MongoDB", "Python", "MEAN Stack", "REST APIs"],
  ["Three.js", "GSAP", "TailwindCSS", "WordPress", "Splunk", "Git"],
];

const skillSystem = {
  core: "javascript",
  planets: [
    { label: "react", color: "#61dafb", size: 0.115 },
    { label: "typescript", color: "#4c8fd6", size: 0.09 },
    { label: "angular", color: "#dd0031", size: 0.11, ring: true },
    { label: "node.js", color: "#8cc84b", size: 0.1, moon: "express" },
    { label: "mongodb", color: "#47a248", size: 0.085 },
    { label: "python", color: "#ffd43b", size: 0.075 },
    { label: "wordpress", color: "#5da9d1", size: 0.07 },
    { label: "three.js", color: "#f4f2ec", size: 0.065, wireframe: true },
  ],
};

const words = [
  { text: "Ideas", imgPath: "/images/ideas.svg" },
  { text: "Concepts", imgPath: "/images/concepts.svg" },
  { text: "Designs", imgPath: "/images/designs.svg" },
  { text: "Code", imgPath: "/images/code.svg" },
  { text: "Ideas", imgPath: "/images/ideas.svg" },
  { text: "Concepts", imgPath: "/images/concepts.svg" },
  { text: "Designs", imgPath: "/images/designs.svg" },
  { text: "Code", imgPath: "/images/code.svg" },
];

const counterItems = [
  { value: 6, suffix: "+", label: "Years of Experience" },
  { value: 100, suffix: "%", label: "Customer Satisfaction / Feedback Scores" },
  { value: 3, suffix: " < hours", label: "Average Time to Resolution" },
  { value: 99, suffix: "%", label: "Codebase Quality / Test Coverage" },
];

const logoIconsList = [
  { imgPath: "/images/logos/company-logo-1.png" },
  { imgPath: "/images/logos/company-logo-2.png" },
  { imgPath: "/images/logos/company-logo-4.png" },
  { imgPath: "/images/logos/company-logo-5.png" },
  { imgPath: "/images/logos/company-logo-6.png" },
  { imgPath: "/images/logos/company-logo-9.png" },
  { imgPath: "/images/logos/company-logo-12.png" },
  { imgPath: "/images/logos/company-logo-13.png" },
  { imgPath: "/images/logos/company-logo-14.png" },
];

const abilities = [
  {
    imgPath: "/images/seo.png",
    title: "Quality Focus",
    desc: "Delivering high-quality results while maintaining attention to every detail.",
  },
  {
    imgPath: "/images/chat.png",
    title: "Reliable Communication",
    desc: "Keeping you updated at every step to ensure transparency and clarity.",
  },
  {
    imgPath: "/images/time.png",
    title: "On-Time Delivery",
    desc: "Making sure projects are completed on schedule, with quality & attention to detail.",
  },
];

const techStackImgs = [
  {
    name: "React Developer",
    imgPath: "/images/logos/react.png",
  },
  {
    name: "Python Developer",
    imgPath: "/images/logos/python.svg",
  },
  {
    name: "Backend Developer",
    imgPath: "/images/logos/node.png",
  },
  {
    name: "Interactive Developer",
    imgPath: "/images/logos/three.png",
  },
  {
    name: "Project Manager",
    imgPath: "/images/logos/git.svg",
  },
];

const techStackIcons = [
  {
    name: "React/Angular Developer",
    modelPath: "/models/react_logo-transformed.glb",
    scale: 1,
    rotation: [0, 0, 0],
  },
  {
    name: "Python Developer",
    modelPath: "/models/python-transformed.glb",
    scale: 0.8,
    rotation: [0, 0, 0],
  },
  {
    name: "NodeJS/ExpressJS Developer",
    modelPath: "/models/node-transformed.glb",
    scale: 5,
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    name: "Interactive Developer",
    modelPath: "/models/three.js-transformed.glb",
    scale: 0.05,
    rotation: [0, 0, 0],
  },
  {
    name: "Project Manager",
    modelPath: "/models/git-svg-transformed.glb",
    scale: 0.05,
    rotation: [0, -Math.PI / 4, 0],
  },
];

const expCards = [
  {
    review:
      "Akash consistently contributed high-quality code in a remote, open-source environment, showing strong communication, reliability, and a proactive approach to collaboration.",
    imgPath: "/images/exp_checkmate.jpg",
    logoPath: "/images/exp_checkmate.jpg",
    title: "Full Stack Developer Intern",
    date: "January 2026 - April 2026",
    responsibilities: [
      "Contributed to Checkmate, an open-source infrastructure monitoring platform tracking uptime, servers, Docker containers, and hardware health.",
      "Rebuilt and optimized React components for the status and uptime dashboard pages, improving data clarity and user interaction.",
      "Collaborated asynchronously with an international open-source team, maintaining clean commit history and PR documentation.",
    ],
  },
  {
    review:
      "Akash improved our WordPress site with clean, user-focused pages and impactful performance optimizations.",
    imgPath: "/images/exp_1_2_.png",
    logoPath: "/images/logo_4_1.png",
    title: "Wordpress Developer",
    date: "January 2024 - June 2024",
    responsibilities: [
      "Developed and maintained user-facing pages for the wordpress website.",
      "Collaborated closely with Users and Clients to ensure seamless user experiences.",
      "Optimized web applications for maximum speed and scalability.",
    ],
  },
  {
    review:
      "Akash delivered reliable front-end solutions, resolved critical issues efficiently, and played a key role in improving performance and user experience.",
    imgPath: "/images/exp_2_1_.png",
    logoPath: "/images/logo_5.png",
    title: "Front End Developer",
    date: "February 2020 - January 2023",
    responsibilities: [
      "Led risk control and resolved 15+ monthly incidents across production/non-production sites.",
      "Built responsive UIs with Angular & MEAN stack, improving performance and user experience.",
      "Used Splunk & internal tools to troubleshoot sessions, boosting detection speed by 25% and site efficiency.",
    ],
  },
  {
    review:
      "Akash led the end-to-end development of a reliable internal tool with clean code, strong UI/UX focus, and excellent performance optimization.",
    imgPath: "/images/exp_3.png",
    logoPath: "/images/logo_6.png",
    title: "Full Stack Developer",
    date: "September 2019 - Feb 2020",
    responsibilities: [
      "Developed TalentCapture using the MEAN stack to manage recruitment data.",
      "Led full development lifecycle with focus on W3C standards and clean UI/UX.",
      "Debugged and reviewed code to ensure performance and reliability.",
    ],
  },
];

const expLogos = [
  {
    name: "logo1",
    imgPath: "/images/logo1.png",
  },
  {
    name: "logo2",
    imgPath: "/images/logo2.png",
  },
  {
    name: "logo3",
    imgPath: "/images/logo3.png",
  },
];

const testimonials = [
  {
    name: "Esther Howard",
    mentions: "@estherhoward",
    review:
      "I can’t say enough good things about Akash. He was able to take our complex project requirements and turn them into a seamless, functional website. His problem-solving abilities are outstanding.",
    imgPath: "/images/client1.png",
  },
  {
    name: "Wade Warren",
    mentions: "@wadewarren",
    review:
      "Working with Akash was a fantastic experience. He transformed our outdated website into a modern, user-friendly platform. His attention to detail and commitment to quality are unmatched. Highly recommend him for any web dev projects.",
    imgPath: "/images/client3.png",
  },
  {
    name: "Guy Hawkins",
    mentions: "@guyhawkins",
    review:
      "Collaborating with Akash was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Akash's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Akash is the ideal partner.",
    imgPath: "/images/client2.png",
  },
  {
    name: "Marvin McKinney",
    mentions: "@marvinmckinney",
    review:
      "Akash was a pleasure to work with. He turned our outdated website into a fresh, intuitive platform that’s both modern and easy to navigate. Fantastic work overall.",
    imgPath: "/images/client5.png",
  },
  {
    name: "Floyd Miles",
    mentions: "@floydmiles",
    review:
      "Akash’s expertise in web development is truly impressive. He delivered a robust and scalable solution for our e-commerce site, and our online sales have significantly increased since the launch. He’s a true professional!",
    imgPath: "/images/client4.png",
  },
  {
    name: "Albert Flores",
    mentions: "@albertflores",
    review:
      "Akash was a pleasure to work with. He understood our requirements perfectly and delivered a website that exceeded our expectations. His skills in both frontend and backend dev are top-notch.",
    imgPath: "/images/client6.png",
  },
];

const socialImgs = [
  {
    name: "linkedin",
    url: "https://www.linkedin.com/in/akash-mannil/",
    imgPath: "/images/linkedin.png",
  },
  {
    name: "github",
    url: "https://github.com/akashmannil",
    imgPath: "/images/github.png",
  },
  {
    name: "x",
    url: "https://x.com/akashmannil",
    imgPath: "/images/x.png",
  },
  {
    name: "insta",
    url: "https://www.instagram.com/notyrann/",
    imgPath: "/images/insta.png",
  },
];

export {
  words,
  abilities,
  logoIconsList,
  counterItems,
  expCards,
  expLogos,
  testimonials,
  socialImgs,
  techStackIcons,
  techStackImgs,
  navLinks,
  heroCopy,
  manifesto,
  projects,
  skillRows,
  skillSystem,
  sceneData,
};