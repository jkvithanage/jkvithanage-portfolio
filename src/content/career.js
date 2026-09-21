/** @typedef {import("./models.js").Education} Education */
/** @typedef {import("./models.js").WorkExperience} WorkExperience */

/** @type {WorkExperience[]} */
export const workExperiences = [
  {
    organization: {
      name: "Swivel Group Pty Ltd",
      href: "https://swivelgroup.com.au/",
      label: "Visit Swivel Group official website",
    },
    title: "Ruby on Rails Developer",
    dates: "2025 Jan - Present",
    description: [
      [{ type: "text", content: "Developed backend services for a Ruby on Rails-based Strata Management System." }],
      [{ type: "text", content: "Collaborated with cross-functional teams to translate business requirements into technical solutions and deliver impactful features." }],
      [{ type: "text", content: "Implemented features and bug fixes, utilizing test-driven development (TDD) practices." }],
      [{ type: "text", content: "Optimized performance-critical endpoints, reducing response times by 40-70% and ensuring all requests met SLAs of under 3 seconds." }],
      [{ type: "text", content: "Delivered urgent hotfixes for production issues, restoring functionality quickly and minimizing downtime." }],
      [{ type: "text", content: "Reported directly to the Engineering Manager, ensuring alignment with project goals and technical requirements." }],
    ],
  },
  {
    organization: { name: "Self employed" },
    title: "Freelance Web Developer",
    dates: "2023 Jan - Now",
    description: [
      [{ type: "text", content: "Built an inventory management system for AYT Trading Ltd using Ruby on Rails, Hotwire, PostgreSQL, and Tailwind CSS." }],
      [{ type: "text", content: "Developed an invoice generator module for an e-commerce platform." }],
      [{ type: "text", content: "Created a Reddit web scraper using Ruby and Selenium WebDriver." }],
      [{ type: "link", content: "Find me on Upwork.", href: "https://www.upwork.com/freelancers/~01ac14c03ad8691410", label: "Hire me on Upwork" }],
    ],
  },
  {
    organization: { name: "Self employed" },
    title: "Graphic Designer",
    dates: "2012 Oct - 2022 May",
    description: [
      [{ type: "text", content: "Offered various graphic design services on Fiverr, from print designs to web designs." }],
      [{ type: "text", content: "Worked with over 3,000 clients from different industries, including advertising, photography, digital marketing, and real estate." }],
      [{ type: "link", content: "Visit my graphic design portfolio.", href: "https://graphics.jkvithanage.com", label: "Visit my graphic design portfolio" }],
    ],
  },
  {
    organization: {
      name: "Lanka Sugar Company Ltd",
      href: "https://www.linkedin.com/company/lscl/",
      label: "Visit Lanka Sugar Company LinkedIn profile",
    },
    title: "Chemical Engineer",
    dates: "2017 Nov - 2018 Dec",
    description: [
      [{ type: "text", content: "Managed and coordinated the production process." }],
      [{ type: "text", content: "Led process optimization efforts that boosted plant efficiency by 8%." }],
      [{ type: "text", content: "Developed engineering schematics using AutoCAD and MS Visio." }],
    ],
  },
];

/** @type {Education[]} */
export const educationEntries = [
  {
    organization: {
      name: "Torrens University Australia",
      href: "https://www.torrens.edu.au/",
      label: "Visit Torrens University homepage",
    },
    title: "Master of Business Information Systems",
    dates: "2024 Feb - Present",
    description: [
      [{ type: "text", content: "Currently in my last trimester with a GPA of 6.3/7.0." }],
      [{ type: "text", content: "Gained a solid end-to-end knowledge of the Software Development Lifecycle." }],
      [{ type: "text", content: "Got hands-on with data analytics and AI/ML (keen to dive deeper into ML)." }],
      [{ type: "text", content: "Volunteered twice at Social Enterprise Hub as a developer and a design thinker." }],
    ],
  },
  {
    organization: {
      name: "Le Wagon - Melbourne",
      href: "https://www.lewagon.com/melbourne",
      label: "Read more about Le Wagon Melbourne campus",
    },
    title: "Web Development Bootcamp",
    dates: "2022 Oct - 2022 Dec",
    description: [
      [{ type: "text", content: "Attended full-stack web development bootcamp (Batch #1044)." }],
      [{ type: "text", content: "It was an 11-week intensive coding bootcamp learning a complete set of technical skills required for a full-stack developer based on the Ruby on Rails framework, along with HTML, CSS, JavaScript, PostgreSQL, Git, Heroku, and more." }],
    ],
  },
  {
    organization: {
      name: "University of Peradeniya",
      href: "https://eng.pdn.ac.lk/",
      label: "Visit University of Peradeniya Engineering faculty website",
    },
    title: "BSc Engineering (Hons)",
    dates: "2013 March - 2017 Dec",
    description: [
      [{ type: "text", content: "Specialised in Chemical & Process Engineering." }],
      [{ type: "text", content: "Gained a broad knowledge of many engineering disciplines, including electrical & electronic, mechanical, computer, civil, and manufacturing engineering." }],
      [
        { type: "text", content: "Conducted highly successful research in " },
        { type: "link", content: "biogas production using sugar industry waste", href: "https://www.dropbox.com/s/oxfwj6k1ti81j33/CP507%20E11223.pdf?dl=0", label: "Read my final research publication" },
        { type: "text", content: ". (The research impressed the chairman and board of directors of Lanka Sugar Company, who offered me my first job as a fresh graduate.)." },
      ],
    ],
  },
];
