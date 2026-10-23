export interface ProjectData {
  title: string
  subtitle: string
  period: string
  tech: string[]
  points: string[]
  link: string
  linkText: string
  badge: string
}

export interface InternshipData {
  company: string
  role: string
  period: string
  highlights: string[]
  badge: string
}

export interface AchievementData {
  title: string
  subtitle: string
  metric: string
  description: string
}

export const RESUME_DATA = {
  name: 'Saanya Garg',
  role: 'Full Stack Developer',
  tagline: 'Building meaningful experiences, one idea at a time.',
  bio: 'Computer Science Engineering student at VIT Bhopal with a passion for building AI-powered, social-impact, and enterprise full-stack web applications that solve real-world problems.',

  education: {
    institution: 'Vellore Institute of Technology, Bhopal',
    degree: 'B.Tech · Computer Science and Engineering',
    period: 'August 2023 – May 2027',
    cgpa: '9.19 / 10.0',
    location: 'Bhopal, Madhya Pradesh, India',
    focus: 'Data Structures, Algorithms, Cloud Computing, AI & Distributed Systems',
  },

  internships: [
    {
      company: 'AmasQIS.ai',
      role: 'Full Stack Developer Intern',
      period: 'May 2025 – October 2025',
      badge: 'FINTECH & BANKING ARCHITECTURE',
      highlights: [
        'Built and deployed high-performance banking applications utilizing Node.js, Express, and JavaScript.',
        'Engineered scalable backend RESTful microservices adhering to strict Object-Oriented Design (OOP) principles.',
        'Automated CI/CD pipelines through GitHub Actions, ensuring seamless automated testing and zero-downtime releases.',
        'Audited and enhanced application security, reliability, and transaction latency across high-throughput endpoints.',
      ],
    },
    {
      company: 'UPTOSKILLS (AICTE)',
      role: 'Full Stack Developer Intern',
      period: 'February 2025 – May 2025',
      badge: 'PERFORMANCE & RESPONSIVE UI',
      highlights: [
        'Architected modern, responsive web applications prioritizing accessibility and cross-device fluidity.',
        'Systematically optimized frontend rendering pipelines and asset bundling, decreasing page-load time by 35%.',
        'Spearheaded state management refactoring and API response caching for accelerated client-side responsiveness.',
      ],
    },
    {
      company: 'Codveda Technologies',
      role: 'Frontend Web Developer',
      period: 'February 2025 – March 2025',
      badge: 'MODULAR COMPONENT ARCHITECTURE',
      highlights: [
        'Engineered reusable, atomic React design components that standardized user interface development across teams.',
        'Delivered modular architecture patterns that directly slashed frontend development redundancy by 25%.',
        'Collaborated closely with UX designers to translate wireframes into pixel-perfect, accessible interactive interfaces.',
      ],
    },
  ] as InternshipData[],

  projects: [
    {
      title: 'SaathiCircle',
      subtitle: 'AI-Powered Senior Care & Wellbeing Platform',
      period: 'December 2025 – February 2026',
      badge: 'AI & HEALTHCARE',
      tech: ['React.js', 'Node.js', 'REST APIs', 'MongoDB', 'Firebase'],
      points: [
        'Integrated instantaneous emergency SOS alert workflows dispatching geographic telemetry to primary caregivers.',
        'Engineered AI voice assistance and natural multilingual interactions tailored specifically for elderly demographics.',
        'Constructed intuitive mood and vital check-in tracking with secure real-time caregiver monitoring dashboards.',
        'Implemented enterprise-grade Firebase authentication and role-based permissions protecting sensitive healthcare data.',
      ],
      link: 'https://tinyurl.com/SaathiCircle',
      linkText: 'View on GitHub',
    },
    {
      title: 'LaadliBachao',
      subtitle: 'Female Foeticide Prevention & Survivor Support Platform',
      period: 'June 2025 – July 2025',
      badge: 'SOCIAL IMPACT TECH',
      tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
      points: [
        'Architected secure real-time incident reporting and emergency alert notification dispatch mechanisms.',
        'Engineered robust backend database pipelines that streamlined casework and reduced manual emergency response effort by 45%.',
        'Implemented sensitive survivor consultation scheduling and encrypted confidential community resource access.',
      ],
      link: 'https://tinyurl.com/LaadliBachao',
      linkText: 'Explore Project',
    },
    {
      title: 'Garg Associates',
      subtitle: 'Modern Digital Platform for Family Law Practice',
      period: 'May 2025 – June 2025',
      badge: 'LEGALTECH & ENTERPRISE',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'MongoDB'],
      points: [
        'Engineered a comprehensive client-service portal featuring intelligent legal domain taxonomy search filters.',
        'Structured automated consultation intake funnels that increased client-attorney matching accuracy by 40%.',
        'Built secure document verification workflows and an administrative case-management scheduling interface.',
      ],
      link: 'https://tinyurl.com/GargAssociates',
      linkText: 'Explore Platform',
    },
  ] as ProjectData[],

  achievements: [
    {
      title: 'MP Police Cyber Safety Hackathon',
      subtitle: '3rd Place Winner',
      metric: '3rd / 300+ Teams',
      description: 'Awarded 3rd place among 300+ competitive developer teams across the state for pioneering cyber safety threat mitigation and incident response tooling.',
    },
    {
      title: 'Epsilon Texpedition Hackathon 2026',
      subtitle: 'Top 10 Finalist',
      metric: 'Top 10 Finalist',
      description: 'Selected into the elite Top 10 finalist bracket nationwide for engineering innovative software solutions addressing complex enterprise engineering challenges.',
    },
    {
      title: 'Flipkart GRiD 8.0',
      subtitle: 'National Semifinalist',
      metric: 'National Semifinalist',
      description: 'Recognized as a Semifinalist in one of India’s most prestigious flagship collegiate technical hackathons spanning tens of thousands of engineering participants.',
    },
    {
      title: 'Samsung Solve for Tomorrow',
      subtitle: 'Top 100 Ideation Round',
      metric: 'Top 0.5% of 20,000+',
      description: 'Ranked in the top 0.5% from a massive nationwide field of over 20,000 teams for architecting transformative tech solutions for social betterment.',
    },
  ] as AchievementData[],

  skills: {
    languages: ['Java', 'Python', 'C++', 'JavaScript'],
    fundamentals: ['Object-Oriented Programming (OOP)', 'DBMS', 'REST APIs', 'System Design'],
    frontend: ['HTML5', 'CSS3', 'React.js', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
    backend: ['Node.js', 'Express.js', 'FastAPI'],
    databases: ['MySQL', 'MongoDB', 'SQL', 'Firebase'],
    cloudAndTools: [
      'AWS EC2', 'AWS S3', 'AWS IAM', 'AWS Lambda',
      'Docker', 'CI/CD', 'GitHub Actions', 'Git', 'GitHub', 'Vercel'
    ],
  },

  certifications: [
    {
      name: 'AWS Certified AI Practitioner',
      issuer: 'Amazon Web Services',
      tag: 'Cloud & Artificial Intelligence',
    },
    {
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      tag: 'Cloud Architecture & Scalability',
    },
    {
      name: 'Machine Learning Specialization',
      issuer: 'Stanford University · Coursera',
      tag: 'Deep Learning & Algorithms',
    },
    {
      name: 'Introduction to Java',
      issuer: 'LearnQuest · Coursera',
      tag: 'Core OOP & Software Engineering',
    },
    {
      name: 'Introduction to Back-End Development',
      issuer: 'Meta · Coursera',
      tag: 'APIs & Server Architecture',
    },
    {
      name: 'Foundations of Coding Full-Stack',
      issuer: 'Microsoft · Coursera',
      tag: 'Full-Stack Web Development',
    },
  ],

  contact: {
    name: 'Saanya Garg',
    email: 'saanyagarg400@gmail.com',
    phone: '+91 7983789937',
    linkedin: 'https://tinyurl.com/Saanya-linkedin',
    github: 'https://github.com/SaanyaGarg01',
    location: 'VIT Bhopal, India',
    closingNote: 'Every journey starts with an idea. Let’s build the next one together.',
  },
}
