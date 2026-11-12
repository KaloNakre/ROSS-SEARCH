// mockData.js — Static reference data only.
// NO personal student/supervisor data. All live data comes from the backend API.

export const DEPARTMENTS = [
  "Department of Computer Science and Engineering",
  "Department of Software Engineering",
  "Department of Information Technology and Management",
  "Department of Data Science",
  "Department of Electrical and Electronic Engineering"
];

export const RESEARCH_DOMAINS = [
  { id: "ml",         name: "Machine Learning",            category: "Artificial Intelligence" },
  { id: "ds",         name: "Data Science",                category: "Data Analytics" },
  { id: "cyber",      name: "Cyber Security",              category: "Security & Networks" },
  { id: "robotics",   name: "AI & Robotics",               category: "Artificial Intelligence" },
  { id: "nlp",        name: "Natural Language Processing", category: "Artificial Intelligence" },
  { id: "cv",         name: "Computer Vision",             category: "Artificial Intelligence" },
  { id: "iot",        name: "Internet of Things",          category: "Embedded Systems" },
  { id: "cloud",      name: "Cloud Computing",             category: "Distributed Systems" },
  { id: "bio",        name: "Bioinformatics",              category: "Interdisciplinary" },
  { id: "blockchain", name: "Blockchain",                  category: "Security & Networks" },
  { id: "hci",        name: "Human-Computer Interaction",  category: "Software Systems" },
  { id: "others",     name: "Others",                      category: "General" },
];

export const SECTIONS = ["60_A", "60_B", "60_C", "61_A", "61_B", "61_C", "62_A", "62_B"];

// ── All student, supervisor, team, and stats data is fetched from the API ──
// ── Removed: INITIAL_SUPERVISORS, INITIAL_STUDENTS, INITIAL_TEAMS, ADMIN_STATS ──
