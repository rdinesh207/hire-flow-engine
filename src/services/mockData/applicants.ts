
import { ApplicantProfile } from '../../types';

export const applicantProfiles: ApplicantProfile[] = [
  {
    id: "applicant-1",
    name: "Emily Chen",
    workAuthorization: "US Citizen",
    yearsOfExperience: 6,
    countryOfOrigin: "United States",
    dateOfBirth: "1990-03-15",
    address: "123 Tech Ave, San Francisco, CA",
    personalStatement: "Experienced frontend developer with a passion for creating intuitive user interfaces. I specialize in React and modern JavaScript frameworks, with a focus on accessibility and performance optimization.",
    resumeFileType: "pdf",
    workExperience: [
      {
        company: "WebTech Solutions",
        title: "Senior Frontend Developer",
        startDate: "2020-02-01",
        endDate: undefined, // Current job
        description: "Leading frontend development for an e-commerce platform. Implemented state management with Redux, migrated codebase to TypeScript, and improved performance by 40%.",
        skills: ["React", "Redux", "TypeScript", "Webpack", "Jest"]
      },
      {
        company: "Digital Innovations",
        title: "Frontend Developer",
        startDate: "2017-05-15",
        endDate: "2020-01-15",
        description: "Developed responsive web applications using React and collaborated with designers to implement UI components.",
        skills: ["React", "JavaScript", "CSS", "HTML", "Responsive Design"]
      }
    ],
    education: [
      {
        institution: "University of California, Berkeley",
        degree: "Bachelor's",
        field: "Computer Science",
        startDate: "2013-09-01",
        endDate: "2017-05-30"
      }
    ],
    lastPosition: "Senior Frontend Developer",
    lastPositionLevel: "Senior",
    urls: [
      "https://github.com/emilychen",
      "https://linkedin.com/in/emilychen",
      "https://emilychen.dev"
    ],
    projects: [
      {
        name: "E-commerce UI Library",
        description: "A reusable component library built with React and Styled Components for e-commerce applications.",
        url: "https://github.com/emilychen/ecommerce-ui",
        technologies: ["React", "Styled Components", "Storybook", "TypeScript"]
      }
    ],
    createdAt: "2023-04-10T08:30:00Z",
    updatedAt: "2023-04-10T08:30:00Z"
  },
  {
    id: "applicant-2",
    name: "Michael Rodriguez",
    workAuthorization: "Green Card Holder",
    yearsOfExperience: 5,
    countryOfOrigin: "Mexico",
    dateOfBirth: "1992-07-22",
    address: "456 Coding Lane, Austin, TX",
    personalStatement: "Full stack developer with a strong background in building scalable web applications. I enjoy solving complex problems and optimizing application performance.",
    resumeFileType: "pdf",
    workExperience: [
      {
        company: "Tech Innovators",
        title: "Full Stack Developer",
        startDate: "2019-04-10",
        endDate: undefined, // Current job
        description: "Building microservices architecture using Node.js and React. Implemented CI/CD pipelines and containerized applications with Docker.",
        skills: ["Node.js", "React", "MongoDB", "Docker", "AWS"]
      },
      {
        company: "Software Solutions Inc",
        title: "Junior Developer",
        startDate: "2017-03-01",
        endDate: "2019-03-31",
        description: "Developed features for a CRM system and collaborated with the QA team for testing.",
        skills: ["JavaScript", "Angular", "MySQL", "Git"]
      }
    ],
    education: [
      {
        institution: "University of Texas at Austin",
        degree: "Master's",
        field: "Information Technology",
        startDate: "2015-09-01",
        endDate: "2017-05-30"
      },
      {
        institution: "Universidad Nacional Autónoma de México",
        degree: "Bachelor's",
        field: "Computer Engineering",
        startDate: "2011-09-01",
        endDate: "2015-05-30"
      }
    ],
    lastPosition: "Full Stack Developer",
    lastPositionLevel: "Mid-level",
    urls: [
      "https://github.com/michaelrodriguez",
      "https://linkedin.com/in/michaelrodriguez"
    ],
    projects: [
      {
        name: "Inventory Management System",
        description: "A real-time inventory management system for small businesses.",
        url: "https://github.com/michaelrodriguez/inventory-system",
        technologies: ["Node.js", "React", "MongoDB", "Socket.io", "Express"]
      }
    ],
    createdAt: "2023-04-15T10:45:00Z",
    updatedAt: "2023-04-15T10:45:00Z"
  },
  {
    id: "applicant-3",
    name: "Sarah Johnson",
    workAuthorization: "US Citizen",
    yearsOfExperience: 7,
    countryOfOrigin: "United States",
    dateOfBirth: "1989-11-05",
    address: "789 Data Street, Seattle, WA",
    personalStatement: "Machine learning engineer with expertise in natural language processing and computer vision. I'm passionate about applying AI to solve real-world problems and improving model accuracy and efficiency.",
    resumeFileType: "pdf",
    workExperience: [
      {
        company: "AI Research Lab",
        title: "Machine Learning Engineer",
        startDate: "2018-08-01",
        endDate: undefined, // Current job
        description: "Developing and deploying deep learning models for NLP tasks. Improved model inference time by 35% through optimization techniques.",
        skills: ["Python", "TensorFlow", "PyTorch", "NLP", "Docker"]
      },
      {
        company: "Data Analytics Corp",
        title: "Data Scientist",
        startDate: "2016-02-15",
        endDate: "2018-07-20",
        description: "Built predictive models for customer behavior and implemented data pipelines for processing large datasets.",
        skills: ["Python", "Scikit-learn", "SQL", "Pandas", "Spark"]
      }
    ],
    education: [
      {
        institution: "University of Washington",
        degree: "Master's",
        field: "Computer Science (AI Specialization)",
        startDate: "2014-09-01",
        endDate: "2016-06-30"
      },
      {
        institution: "Stanford University",
        degree: "Bachelor's",
        field: "Applied Mathematics",
        startDate: "2010-09-01",
        endDate: "2014-05-30"
      }
    ],
    lastPosition: "Machine Learning Engineer",
    lastPositionLevel: "Senior",
    urls: [
      "https://github.com/sarahjohnson",
      "https://linkedin.com/in/sarahjohnson",
      "https://sarahjohnson.ai"
    ],
    projects: [
      {
        name: "Sentiment Analysis API",
        description: "A REST API for real-time sentiment analysis of text using transformer models.",
        url: "https://github.com/sarahjohnson/sentiment-api",
        technologies: ["Python", "Flask", "Transformers", "Docker", "AWS Lambda"]
      }
    ],
    createdAt: "2023-04-20T09:15:00Z",
    updatedAt: "2023-04-20T09:15:00Z"
  },
  {
    id: "applicant-4",
    name: "David Kim",
    workAuthorization: "H1B Visa",
    yearsOfExperience: 4,
    countryOfOrigin: "South Korea",
    dateOfBirth: "1993-02-18",
    address: "101 Cloud Avenue, Boston, MA",
    personalStatement: "DevOps engineer focused on cloud infrastructure and automation. I enjoy building reliable, scalable systems and streamlining development workflows.",
    resumeFileType: "pdf",
    workExperience: [
      {
        company: "Cloud Solutions",
        title: "DevOps Engineer",
        startDate: "2020-01-15",
        endDate: undefined, // Current job
        description: "Managing Kubernetes clusters and implementing infrastructure as code using Terraform. Automated deployment processes reducing deployment time by 60%.",
        skills: ["Kubernetes", "Terraform", "AWS", "Docker", "CI/CD"]
      },
      {
        company: "Tech Systems Inc",
        title: "Systems Administrator",
        startDate: "2018-03-10",
        endDate: "2019-12-31",
        description: "Managed Linux servers and network infrastructure. Implemented monitoring solutions and automated routine maintenance tasks.",
        skills: ["Linux", "Bash", "Ansible", "Nagios", "Networking"]
      }
    ],
    education: [
      {
        institution: "Massachusetts Institute of Technology",
        degree: "Master's",
        field: "Computer Science",
        startDate: "2016-09-01",
        endDate: "2018-05-30"
      },
      {
        institution: "Seoul National University",
        degree: "Bachelor's",
        field: "Computer Engineering",
        startDate: "2012-03-01",
        endDate: "2016-02-28"
      }
    ],
    lastPosition: "DevOps Engineer",
    lastPositionLevel: "Mid-level",
    urls: [
      "https://github.com/davidkim",
      "https://linkedin.com/in/davidkim"
    ],
    projects: [
      {
        name: "Infrastructure Monitoring Dashboard",
        description: "A real-time dashboard for monitoring cloud infrastructure and alerting on anomalies.",
        url: "https://github.com/davidkim/infra-monitor",
        technologies: ["Go", "Prometheus", "Grafana", "Kubernetes", "React"]
      }
    ],
    createdAt: "2023-04-25T14:20:00Z",
    updatedAt: "2023-04-25T14:20:00Z"
  },
  {
    id: "applicant-5",
    name: "Jennifer Martinez",
    workAuthorization: "US Citizen",
    yearsOfExperience: 8,
    countryOfOrigin: "United States",
    dateOfBirth: "1988-09-12",
    address: "234 Backend Road, Chicago, IL",
    personalStatement: "Experienced backend developer specializing in microservices and distributed systems. I'm passionate about building robust, scalable APIs and optimizing database performance.",
    resumeFileType: "pdf",
    workExperience: [
      {
        company: "Financial Tech",
        title: "Lead Backend Developer",
        startDate: "2019-06-01",
        endDate: undefined, // Current job
        description: "Leading a team of backend developers, designing microservices architecture, and implementing secure payment processing systems.",
        skills: ["Java", "Spring Boot", "Kafka", "PostgreSQL", "Microservices"]
      },
      {
        company: "E-commerce Platform",
        title: "Backend Developer",
        startDate: "2016-04-10",
        endDate: "2019-05-15",
        description: "Developed RESTful APIs and implemented caching strategies to improve response times.",
        skills: ["Java", "Spring", "MySQL", "Redis", "REST API"]
      },
      {
        company: "Software Consultancy",
        title: "Junior Developer",
        startDate: "2014-07-01",
        endDate: "2016-03-31",
        description: "Contributed to various client projects across different industries.",
        skills: ["Java", "JavaScript", "SQL", "Git"]
      }
    ],
    education: [
      {
        institution: "University of Illinois at Urbana-Champaign",
        degree: "Bachelor's",
        field: "Computer Science",
        startDate: "2010-09-01",
        endDate: "2014-05-30"
      }
    ],
    lastPosition: "Lead Backend Developer",
    lastPositionLevel: "Senior",
    urls: [
      "https://github.com/jennifermartinez",
      "https://linkedin.com/in/jennifermartinez",
      "https://jennifermartinez.dev"
    ],
    projects: [
      {
        name: "Distributed Cache Library",
        description: "A Java library for distributed caching with multiple backend options.",
        url: "https://github.com/jennifermartinez/distributed-cache",
        technologies: ["Java", "Redis", "Memcached", "Hazelcast"]
      }
    ],
    createdAt: "2023-05-01T11:30:00Z",
    updatedAt: "2023-05-01T11:30:00Z"
  }
];
