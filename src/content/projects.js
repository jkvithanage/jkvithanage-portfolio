/** @typedef {import("./models.js").Project} Project */

/** @type {Project[]} */
export const projects = [
  {
    title: "My Cash Flow",
    summary: "Personal finance tracking application.",
    description: [{ type: "text", content: "Analyse your financial transactions to determine how you have spent money and your earnings. You can add multiple bank accounts and add transactions associated with each. Most importantly, you can import bulk transactions at once from a CSV file. You can see a summary of your financial activities from the dashboard section." }],
    image: { asset: "myCashFlow", alt: "Screenshot of My Cash Flow dashboard page" },
    preview: { href: "https://mycashflow.cc/", label: "Visit My Cash Flow website" },
    tags: ["Ruby on Rails", "Tabler UI", "PostgreSQL", "Stimulus", "Apexcharts"],
    actions: [
      { type: "link", label: "Live", href: "https://mycashflow.cc/", ariaLabel: "Visit My Cash Flow website" },
      { type: "link", label: "GitHub", href: "https://github.com/jkvithanage/mycashflow", ariaLabel: "Visit My Cash Flow GitHub repository" },
    ],
  },
  {
    title: "My Portfolio Website",
    summary: "My first personal portfolio website.",
    description: [
      { type: "text", content: "This is the first version of my portfolio website. I created it using just HTML5, SCSS, and some JavaScript. All components and sections were designed and developed from scratch with plain HTML and CSS. My main goal was to build a fully responsive, accessible and high-performance website. Below is a screenshot of the " },
      { type: "link", content: "Google PageSpeed Insights", href: "https://pagespeed.web.dev/analysis/https-www-jkvithanage-com/lpw35hijlz?form_factor=desktop", label: "Visit Google PageSpeed Insights" },
      { type: "text", content: " of this website." },
    ],
    image: { asset: "portfolio", alt: "Screenshot of my personal portfolio website" },
    additionalImage: { asset: "portfolioPageSpeed", alt: "PageSpeed Insights of the portfolio website." },
    preview: { href: "https://www.jkvithanage.com/", label: "Visit My Portfolio Website" },
    tags: ["HTML5", "SCSS", "JavaScript", "Vite.js", "PostCSS"],
    actions: [
      { type: "link", label: "Live", href: "https://www.jkvithanage.com/", ariaLabel: "Visit my portfolio website" },
      { type: "link", label: "GitHub", href: "https://github.com/jkvithanage/jkvithanage-portfolio", ariaLabel: "Visit My Portfolio Website GitHub repository" },
    ],
  },
  {
    title: "Customer Invoice Portal",
    summary: "Invoice generator for a software retailer.",
    description: [
      { type: "text", content: "Christy Software sells software licenses on the " },
      { type: "link", content: "Sellix", href: "https://sellix.io/", label: "Visit Sellix e-commerce platform" },
      { type: "text", content: " e-commerce platform, and this app was developed to let their customers get an invoice for all purchase activities for a given period." },
    ],
    image: { asset: "invoicePortal", alt: "Screenshot of invoice portal web app" },
    preview: { href: "https://invoices.christysoftware.com/", label: "Visit invoice portal web app" },
    tags: ["JavaScript", "Bootstrap", "SCSS", "Fetch API", "Tagify", "jsPDF"],
    actions: [
      { type: "link", label: "Live", href: "https://invoices.christysoftware.com/", ariaLabel: "Visit invoice portal web app" },
      { type: "disabled", label: "GitHub" },
    ],
  },
  {
    title: "Astrolog",
    summary: "A social platform for space enthusiasts, along with a built-in community.",
    description: [{ type: "text", content: "This is a full-stack Ruby on Rails app developed as the final project at Le Wagon coding bootcamp with a team of 3 members in 2 weeks." }],
    image: { asset: "astrolog", alt: "Screenshot of Astrolog website" },
    preview: { href: "https://astrolog.fly.dev", label: "Visit Astrolog website" },
    tags: ["Ruby on Rails", "PostgreSQL", "Bootstrap", "SCSS", "Cloudinary", "RESTful APIs"],
    actions: [
      { type: "link", label: "Live", href: "https://astrolog.fly.dev", ariaLabel: "Visit Astrolog website" },
      { type: "link", label: "GitHub", href: "https://github.com/McDrivin/astrolog", ariaLabel: "Visit Astrolog GitHub repository" },
    ],
  },
];
