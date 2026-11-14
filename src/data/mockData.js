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

export const SECTIONS = [
  "40_A", "40_B", "40_C",
  "41_A", "41_B", "41_C",
  "42_A", "42_B", "42_C",
  "43_A", "43_B", "43_C",
  "44_A", "44_B", "44_C",
  "45_A", "45_B", "45_C",
  "46_A", "46_B", "46_C",
  "47_A", "47_B", "47_C",
  "48_A", "48_B", "48_C",
  "49_A", "49_B", "49_C",
  "50_A", "50_B", "50_C",
  "51_A", "51_B", "51_C",
  "52_A", "52_B", "52_C",
  "53_A", "53_B", "53_C",
  "54_A", "54_B", "54_C",
  "55_A", "55_B", "55_C",
  "56_A", "56_B", "56_C",
  "57_A", "57_B", "57_C",
  "58_A", "58_B", "58_C",
  "59_A", "59_B", "59_C",
  "60_A", "60_B", "60_C",
  "61_A", "61_B", "61_C",
  "62_A", "62_B", "62_C",
  "63_A", "63_B", "63_C",
  "64_A", "64_B", "64_C"
];

// ── All student, supervisor, team, and stats data is fetched from the API ──
// ── Removed: INITIAL_SUPERVISORS, INITIAL_STUDENTS, INITIAL_TEAMS, ADMIN_STATS ──
