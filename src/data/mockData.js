// mockData.js — Static reference data only.
// NO personal student/supervisor data. All live data comes from the backend API.

export const DEPARTMENTS = [
  "Department of Computer Science and Engineering",
  "Department of Software Engineering",
  "Department of Information Technology and Management",
  "Department of Data Science",
  "Department of Electrical and Electronic Engineering"
];

// Canonical research domains matching backend/app/database/seed.py and ross_search.db
export const RESEARCH_DOMAINS = [
  { id: 1, name: "Machine Learning", category: "Artificial Intelligence" },
  { id: 2, name: "Data Science", category: "Data Analytics" },
  { id: 3, name: "Cyber Security", category: "Security & Networks" },
  { id: 4, name: "AI & Robotics", category: "Artificial Intelligence" },
  { id: 5, name: "Natural Language Processing", category: "Artificial Intelligence" },
  { id: 6, name: "Computer Vision", category: "Artificial Intelligence" },
  { id: 7, name: "Internet of Things", category: "Embedded Systems" },
  { id: 8, name: "Cloud Computing", category: "Distributed Systems" },
  { id: 9, name: "Bioinformatics", category: "Interdisciplinary" },
  { id: 10, name: "Blockchain", category: "Security & Networks" },
  { id: 11, name: "Human-Computer Interaction", category: "Software Systems" },
  { id: 12, name: "Others", category: "General" },
];

export const RESEARCH_SUBDOMAINS = [
  "SCADA & Industrial Control Security",
  "Zero-Trust Cloud Architecture",
  "Large Language Models & Transformers",
  "Low-Resource Bengali NLP",
  "Real-Time Object Detection (YOLO)",
  "Medical Image Segmentation (U-Net)",
  "Federated Learning & Differential Privacy",
  "Edge Quantization (INT8) on IoT Devices",
  "Smart Contracts & Decentralized Storage (IPFS)",
  "Explainable AI (XAI) & Attribution",
  "Autonomous Robotic Navigation",
  "Time-Series Telemetry Anomaly Detection"
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
