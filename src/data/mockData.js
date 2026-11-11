// Local UI placeholder data for ROSS-SEARCH (Module 1)
// Adheres strictly to the Personal Information Rules:
// - No real student names, IDs, email addresses, phone numbers, or personal details
// - Neutral placeholder identifiers (e.g., "Dr. Full Name", "Student Candidate")
// - No profile photos or generated avatars; empty state placeholders only

export const DEPARTMENTS = [
  "Department of Computer Science and Engineering",
  "Department of Software Engineering",
  "Department of Information Technology and Management",
  "Department of Data Science",
  "Department of Electrical and Electronic Engineering"
];

export const RESEARCH_DOMAINS = [
  { id: "ml", name: "Machine Learning", category: "Artificial Intelligence" },
  { id: "ds", name: "Data Science", category: "Data Analytics" },
  { id: "cyber", name: "Cyber Security", category: "Security & Networks" },
  { id: "robotics", name: "AI & Robotics", category: "Artificial Intelligence" },
  { id: "nlp", name: "Natural Language Processing", category: "Artificial Intelligence" },
  { id: "cv", name: "Computer Vision", category: "Artificial Intelligence" },
  { id: "iot", name: "Internet of Things", category: "Embedded Systems" },
  { id: "cloud", name: "Cloud Computing", category: "Distributed Systems" },
  { id: "bio", name: "Bioinformatics", category: "Interdisciplinary" },
  { id: "blockchain", name: "Blockchain", category: "Security & Networks" },
  { id: "hci", name: "Human-Computer Interaction", category: "Software Systems" },
  { id: "others", name: "Others", category: "General" }
];

export const SECTIONS = ["60_A", "60_B", "60_C", "61_A", "61_B", "61_C", "62_A", "62_B"];

export const INITIAL_SUPERVISORS = [
  {
    id: "sup-01",
    name: "Dr. Full Name",
    designation: "Professor",
    department: "Department of CSE",
    email: "supervisor.cse01@diu.edu.bd",
    room: "Room 602, Academic Building 4",
    phone: "+880 1XXXXXXXXX",
    expertise: ["Machine Learning", "Data Science", "Cyber Security", "AI & Robotics", "Data Analytics"],
    about: "A dedicated researcher in the field of Machine Learning and Artificial Intelligence, with numerous publications in top-tier journals.",
    acceptingTeams: true,
    availableSlots: 2,
    maxSlots: 5,
    education: "Ph.D. in Computer Science & Engineering",
    publications: [
      "Deep Learning Approaches in Automated Disease Detection (IEEE Access, 2024)",
      "Hybrid Feature Selection Framework for Cyber Threat Detection (Springer, 2023)"
    ]
  },
  {
    id: "sup-02",
    name: "Dr. Full Name",
    designation: "Associate Professor",
    department: "Department of CSE",
    email: "supervisor.cse02@diu.edu.bd",
    room: "Room 504, Academic Building 4",
    phone: "+880 1XXXXXXXXX",
    expertise: ["Natural Language Processing", "Machine Learning", "Data Science"],
    about: "Research interests center on Low-Resource Natural Language Processing, text mining, and cross-lingual information retrieval.",
    acceptingTeams: true,
    availableSlots: 1,
    maxSlots: 4,
    education: "Ph.D. in Information Science",
    publications: [
      "Benchmarking Low-Resource Transformer Models for Sentiment Analysis (ACM, 2024)"
    ]
  },
  {
    id: "sup-03",
    name: "Dr. Full Name",
    designation: "Assistant Professor",
    department: "Department of CSE",
    email: "supervisor.cse03@diu.edu.bd",
    room: "Room 412, Academic Building 4",
    phone: "+880 1XXXXXXXXX",
    expertise: ["Cyber Security", "Blockchain", "Cloud Computing"],
    about: "Investigates zero-trust architectures, decentralized authentication protocols, and cloud infrastructure security.",
    acceptingTeams: true,
    availableSlots: 3,
    maxSlots: 5,
    education: "Ph.D. in Cyber Systems and Networks",
    publications: [
      "Decentralized Identity Verification using Smart Contracts (IEEE S&P Workshops, 2023)"
    ]
  },
  {
    id: "sup-04",
    name: "Dr. Full Name",
    designation: "Professor",
    department: "Department of SWE",
    email: "supervisor.swe01@diu.edu.bd",
    room: "Room 701, Academic Building 3",
    phone: "+880 1XXXXXXXXX",
    expertise: ["Computer Vision", "AI & Robotics", "Internet of Things"],
    about: "Specializes in autonomous drone navigation, multi-sensor fusion, and smart agricultural robotics.",
    acceptingTeams: false,
    availableSlots: 0,
    maxSlots: 4,
    education: "Ph.D. in Robotics and Automated Systems",
    publications: [
      "Real-Time Object Tracking in Resource-Constrained Embedded Devices (Sensors, 2024)"
    ]
  },
  {
    id: "sup-05",
    name: "Dr. Full Name",
    designation: "Associate Professor",
    department: "Department of CSE",
    email: "supervisor.cse05@diu.edu.bd",
    room: "Room 305, Academic Building 4",
    phone: "+880 1XXXXXXXXX",
    expertise: ["Bioinformatics", "Data Science", "Machine Learning"],
    about: "Focuses on genomic data sequence alignment, computational biology algorithms, and disease biomarker identification.",
    acceptingTeams: true,
    availableSlots: 2,
    maxSlots: 4,
    education: "Ph.D. in Bioinformatics",
    publications: [
      "Computational Mapping of Genomic Variants in Rare Diseases (BMC Bioinformatics, 2023)"
    ]
  },
  {
    id: "sup-06",
    name: "Dr. Full Name",
    designation: "Assistant Professor",
    department: "Department of CSE",
    email: "supervisor.cse06@diu.edu.bd",
    room: "Room 218, Academic Building 4",
    phone: "+880 1XXXXXXXXX",
    expertise: ["Human-Computer Interaction", "Data Science", "AI & Robotics"],
    about: "Explores accessible technology design, UX evaluation frameworks, and multimodal user interfaces.",
    acceptingTeams: true,
    availableSlots: 2,
    maxSlots: 3,
    education: "Ph.D. in Human-Centered Computing",
    publications: [
      "Assistive Interface Evaluation for Cognitive Accessibility (CHI, 2024)"
    ]
  }
];

export const INITIAL_STUDENTS = [
  {
    id: "stu-01",
    name: "Student Candidate A",
    studentId: "211-15-XXXX1",
    department: "Department of CSE",
    section: "60_A",
    batch: "60th",
    email: "student.candidate1@s.diu.edu.bd",
    phone: "+880 1XXXXXXXXX",
    interests: ["Machine Learning", "Data Science"],
    preferredTopic: "Predictive Analytics for Health Informatics",
    teamStatus: "Looking for Team",
    bio: "Undergraduate CSE researcher interested in applying statistical learning algorithms to real-world healthcare datasets."
  },
  {
    id: "stu-02",
    name: "Student Candidate B",
    studentId: "211-15-XXXX2",
    department: "Department of CSE",
    section: "60_A",
    batch: "60th",
    email: "student.candidate2@s.diu.edu.bd",
    phone: "+880 1XXXXXXXXX",
    interests: ["Cyber Security", "Blockchain"],
    preferredTopic: "Decentralized Zero-Trust Architecture",
    teamStatus: "Looking for Team",
    bio: "Focused on cryptographic protocols, vulnerability assessment, and blockchain-based verifiable credentials."
  },
  {
    id: "stu-03",
    name: "Student Candidate C",
    studentId: "211-15-XXXX3",
    department: "Department of CSE",
    section: "60_A",
    batch: "60th",
    email: "student.candidate3@s.diu.edu.bd",
    phone: "+880 1XXXXXXXXX",
    interests: ["AI & Robotics", "Computer Vision"],
    preferredTopic: "Autonomous Navigation with Sensor Fusion",
    teamStatus: "Team Member",
    bio: "Passionate about ROS, OpenCV, edge computing, and real-time path planning for unmanned ground vehicles."
  },
  {
    id: "stu-04",
    name: "Student Candidate D",
    studentId: "211-15-XXXX4",
    department: "Department of CSE",
    section: "60_B",
    batch: "60th",
    email: "student.candidate4@s.diu.edu.bd",
    phone: "+880 1XXXXXXXXX",
    interests: ["Natural Language Processing", "Machine Learning"],
    preferredTopic: "Bengali Text Summarization and Dialogue Agents",
    teamStatus: "Looking for Team",
    bio: "Working on Bengali language computational modeling, tokenization pipelines, and low-resource BERT variants."
  },
  {
    id: "stu-05",
    name: "Student Candidate E",
    studentId: "211-15-XXXX5",
    department: "Department of CSE",
    section: "60_B",
    batch: "60th",
    email: "student.candidate5@s.diu.edu.bd",
    phone: "+880 1XXXXXXXXX",
    interests: ["Data Science", "Cloud Computing"],
    preferredTopic: "Distributed Pipeline for Environmental Sensing",
    teamStatus: "Looking for Team",
    bio: "Enthusiastic about big data processing, Apache Spark, and cloud-native backend microservices."
  },
  {
    id: "stu-06",
    name: "Student Candidate F",
    studentId: "212-15-XXXX6",
    department: "Department of CSE",
    section: "61_A",
    batch: "61st",
    email: "student.candidate6@s.diu.edu.bd",
    phone: "+880 1XXXXXXXXX",
    interests: ["Internet of Things", "AI & Robotics"],
    preferredTopic: "Smart Campus Energy Optimization",
    teamStatus: "Looking for Team",
    bio: "Hardware prototyping, microcontrollers, and wireless sensor telemetry systems."
  }
];

export const INITIAL_TEAMS = [
  {
    id: "team-01",
    teamName: "Alpha Research Lab",
    projectTitle: "Automated Diagnostic Pipeline Using Multimodal Deep Learning",
    domain: "Machine Learning",
    department: "Department of CSE",
    section: "60_A",
    leaderId: "stu-current",
    leaderName: "Student Candidate (Current User)",
    supervisorId: "sup-01",
    supervisorName: "Dr. Full Name",
    status: "Formation Complete",
    membersCount: 3,
    maxMembers: 5,
    members: [
      { id: "stu-current", name: "Student Candidate (Team Leader)", studentId: "211-15-XXXX0", role: "Leader", department: "Dept. of CSE" },
      { id: "stu-01", name: "Student Candidate A", studentId: "211-15-XXXX1", role: "Member", department: "Dept. of CSE" },
      { id: "stu-02", name: "Student Candidate B", studentId: "211-15-XXXX2", role: "Member", department: "Dept. of CSE" }
    ],
    description: "Developing a robust multi-stage deep learning model to aid medical practitioners in detecting pulmonary conditions from radiology scans."
  }
];

export const ADMIN_STATS = {
  totalStudents: 125,
  totalSupervisors: 45,
  totalTeams: 78,
  totalProjects: 112
};

export const RECENT_ACTIVITIES = {
  student: [
    { id: 1, text: "Team invitation received", time: "2 hours ago", type: "team" },
    { id: 2, text: "Supervisor profile viewed", time: "1 day ago", type: "supervisor" },
    { id: 3, text: "Research topic updated", time: "2 days ago", type: "topic" }
  ],
  admin: [
    { id: 1, text: "New student registered", time: "2m ago", type: "student" },
    { id: 2, text: "New supervisor added", time: "5m ago", type: "supervisor" },
    { id: 3, text: "Team created", time: "10m ago", type: "team" }
  ]
};

