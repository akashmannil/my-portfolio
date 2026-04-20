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
    name: "Industry Exposure",
    link: "#industryExp",
  },
  {
    name: "Download Resume",
    link: "",
    download: true
  },
];

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
  { value: 4, suffix: "+", label: "Years of Experience" },
  { value: 100, suffix: "%", label: "Customer Satisfaction / Feedback Scores" },
  { value: 3, suffix: " < hours", label: "Average Time to Resolution" },
  { value: 99, suffix: "%", label: "Codebase Quality / Test Coverage" },
];

const logoIconsList = [
  {
    imgPath: "/images/logos/company-logo-1.png",
  },
  {
    imgPath: "/images/logos/company-logo-2.png",
  },
  // {
  //   imgPath: "/images/logos/company-logo-3.png",
  // },
  {
    imgPath: "/images/logos/company-logo-4.png",
  },
  {
    imgPath: "/images/logos/company-logo-5.png",
  },
  {
    imgPath: "/images/logos/company-logo-6.png",
  },
  // {
  //   imgPath: "/images/logos/company-logo-7.png",
  // },
  // {
  //   imgPath: "/images/logos/company-logo-8.png",
  // },
  {
    imgPath: "/images/logos/company-logo-9.png",
  },
  // {
  //   imgPath: "/images/logos/company-logo-10.png",
  // },
  // {
  //   imgPath: "/images/logos/company-logo-11.png",
  // },
  {
    imgPath: "/images/logos/company-logo-12.png",
  },
  {
    imgPath: "/images/logos/company-logo-13.png",
  },
  {
    imgPath: "/images/logos/company-logo-14.png",
  },
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
    date: "January 2026 - April 2024",
    responsibilities: [
      "Contributed to an open-source project within a remote team, building and maintaining user-facing features.",
      "Demonstrated strong communication, self-motivation, and reliability in a distributed work environment.",
      "Supported development efforts with a focus on clean, scalable, and efficient code.",
    ],
  },
  {
    review:
      "Akash improved our WordPress site with clean, user-focused pages and impactful performance optimizations.",
    imgPath: "/images/exp_1_2_.png",
    logoPath: "/images/logo_4_1.png",
    title: "Wordpress Developer",
    date: "January 2024 - July 2024",
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
      "I can’t say enough good things about Adrian. He was able to take our complex project requirements and turn them into a seamless, functional website. His problem-solving abilities are outstanding.",
    imgPath: "/images/client1.png",
  },
  {
    name: "Wade Warren",
    mentions: "@wadewarren",
    review:
      "Working with Adrian was a fantastic experience. He transformed our outdated website into a modern, user-friendly platform. His attention to detail and commitment to quality are unmatched. Highly recommend him for any web dev projects.",
    imgPath: "/images/client3.png",
  },
  {
    name: "Guy Hawkins",
    mentions: "@guyhawkins",
    review:
      "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
    imgPath: "/images/client2.png",
  },
  {
    name: "Marvin McKinney",
    mentions: "@marvinmckinney",
    review:
      "Adrian was a pleasure to work with. He turned our outdated website into a fresh, intuitive platform that’s both modern and easy to navigate. Fantastic work overall.",
    imgPath: "/images/client5.png",
  },
  {
    name: "Floyd Miles",
    mentions: "@floydmiles",
    review:
      "Adrian’s expertise in web development is truly impressive. He delivered a robust and scalable solution for our e-commerce site, and our online sales have significantly increased since the launch. He’s a true professional!",
    imgPath: "/images/client4.png",
  },
  {
    name: "Albert Flores",
    mentions: "@albertflores",
    review:
      "Adrian was a pleasure to work with. He understood our requirements perfectly and delivered a website that exceeded our expectations. His skills in both frontend and backend dev are top-notch.",
    imgPath: "/images/client6.png",
  },
];

const socialImgs = [
  {
    name: "linkedin",
    url: "https://in.linkedin.com/in/akash-mannil/",
    imgPath: "/images/linkedin.png",
  },
  {
    name: "github",
    url: "https://www.github.com/akashmannil/",
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
};