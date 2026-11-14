// module1Service.js — Centralized client service for Robayet Islam's Module 1 responsibilities.
// Manages: Opportunities, Research Interests, Requests, Individual/Team Assignments, and Matching.
// Uses reactive localStorage caching for seamless frontend interactions without mutating the database.

const STORAGE_KEYS = {
  OPPORTUNITIES: 'ross_opportunities',
  RESEARCH_INTERESTS: 'ross_published_interests',
  SUPERVISOR_EXPERTISE: 'ross_supervisor_expertise',
  STUDENT_REQUESTS: 'ross_supervision_requests',
  ASSIGNMENTS: 'ross_assignments',
};

// Initial Seed Data for Demonstration
const DEFAULT_OPPORTUNITIES = [
  {
    id: 1,
    supervisorId: 1,
    supervisorName: "Dr. Syed Tareq",
    department: "Department of Computer Science and Engineering",
    title: "Deep Learning for Bengali Natural Language Processing",
    description: "Developing novel transformer-based representations and semantic parsing models for low-resource Bengali linguistic datasets.",
    domain: "Natural Language Processing",
    keywords: ["Transformers", "Bengali NLP", "BERT", "Low-Resource AI"],
    requiredSkills: "Python, PyTorch/TensorFlow, HuggingFace, NLP fundamentals",
    studentType: "Both", // "Individual", "Team", "Both"
    maxCapacity: 4,
    availablePositions: 2,
    applicationDeadline: "2026-12-15",
    status: "Active", // "Active", "Inactive"
    isPublished: true,
    createdAt: "2026-11-01",
  },
  {
    id: 2,
    supervisorId: 1,
    supervisorName: "Dr. Syed Tareq",
    department: "Department of Computer Science and Engineering",
    title: "Explainable AI in Medical Diagnostic Imaging",
    description: "Investigation of Grad-CAM and attention mechanisms for interpreting chest X-ray and CT scan automated diagnostic classifiers.",
    domain: "Machine Learning",
    keywords: ["XAI", "Computer Vision", "Medical Imaging", "PyTorch"],
    requiredSkills: "Python, Convolutional Neural Networks, OpenCV, Medical Imaging",
    studentType: "Team",
    maxCapacity: 3,
    availablePositions: 3,
    applicationDeadline: "2026-12-30",
    status: "Active",
    isPublished: true,
    createdAt: "2026-11-05",
  },
  {
    id: 3,
    supervisorId: 2,
    supervisorName: "Prof. Dr. Ashraf Ali",
    department: "Department of Computer Science and Engineering",
    title: "Smart Grid Cyber-Physical Threat Detection",
    description: "Machine learning-assisted intrusion detection and automated mitigation for critical energy distribution infrastructure.",
    domain: "Cyber Security",
    keywords: ["SCADA", "Intrusion Detection", "Zero-Trust", "Anomaly Detection"],
    requiredSkills: "Network Security, Wireshark, Python, Scikit-Learn",
    studentType: "Both",
    maxCapacity: 5,
    availablePositions: 1,
    applicationDeadline: "2026-11-28",
    status: "Active",
    isPublished: true,
    createdAt: "2026-10-25",
  }
];

const DEFAULT_EXPERTISE = [
  { id: 1, name: "Machine Learning", domain: "Artificial Intelligence", level: "Expert", keywords: ["Deep Learning", "PyTorch", "Transformers"] },
  { id: 2, name: "Natural Language Processing", domain: "Artificial Intelligence", level: "Expert", keywords: ["LLMs", "Information Extraction", "Bengali NLP"] },
  { id: 3, name: "Computer Vision", domain: "Artificial Intelligence", level: "Advanced", keywords: ["Object Detection", "YOLO", "Segmentation"] },
  { id: 4, name: "Cyber Security", domain: "Security & Networks", level: "Advanced", keywords: ["Network Forensics", "Threat Intelligence"] },
];

const DEFAULT_REQUESTS = [
  {
    id: 1,
    studentId: "201-15-313",
    studentName: "Tamim Hasan Sami",
    studentEmail: "sami.cse@diu.edu.bd",
    department: "Department of Computer Science and Engineering",
    cgpa: "3.84",
    researchInterests: ["Natural Language Processing", "Machine Learning"],
    opportunityId: 1,
    opportunityTitle: "Deep Learning for Bengali Natural Language Processing",
    supervisorId: 1,
    message: "Respected Sir, I have built several sentiment analysis models in Bengali and would be honored to pursue my thesis in Bengali transformer architectures under your guidance.",
    status: "pending", // "pending", "accepted", "rejected"
    responseNote: null,
    submittedAt: "2026-11-12",
  },
  {
    id: 2,
    studentId: "201-15-715",
    studentName: "Riya Saha",
    studentEmail: "riya.cse@diu.edu.bd",
    department: "Department of Computer Science and Engineering",
    cgpa: "3.92",
    researchInterests: ["Cyber Security", "Cloud Security"],
    opportunityId: 3,
    opportunityTitle: "Smart Grid Cyber-Physical Threat Detection",
    supervisorId: 2,
    message: "Dear Professor, our team is studying SCADA network vulnerabilities and we want to conduct our undergraduate research in cyber threat classification.",
    status: "pending",
    responseNote: null,
    submittedAt: "2026-11-13",
  }
];

const DEFAULT_ASSIGNMENTS = [
  {
    id: 1,
    type: "individual", // "individual" | "team"
    targetId: "201-15-809",
    targetName: "Robayet Islam",
    department: "Department of Computer Science and Engineering",
    opportunityId: 1,
    opportunityTitle: "Deep Learning for Bengali Natural Language Processing",
    supervisorId: 1,
    supervisorName: "Dr. Syed Tareq",
    assignedDate: "2026-11-10",
    status: "Active", // "Active", "Completed", "Pending Review"
    progress: 35,
    notes: "Assigned initial literature review on Bengali subword tokenization."
  }
];

// Helper to access storage safely
function getStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

export const module1Service = {
  // ── PART 04: Research Opportunities ────────────────────────────
  getOpportunities() {
    return getStorage(STORAGE_KEYS.OPPORTUNITIES, DEFAULT_OPPORTUNITIES);
  },

  getOpportunityById(id) {
    const list = this.getOpportunities();
    return list.find(o => String(o.id) === String(id)) || null;
  },

  createOpportunity(payload) {
    const list = this.getOpportunities();
    const newId = list.length > 0 ? Math.max(...list.map(o => o.id)) + 1 : 1;
    const item = {
      id: newId,
      supervisorId: payload.supervisorId || 1,
      supervisorName: payload.supervisorName || "Current Supervisor",
      department: payload.department || "Department of CSE",
      title: payload.title,
      description: payload.description,
      domain: payload.domain,
      keywords: Array.isArray(payload.keywords) ? payload.keywords : (payload.keywords ? payload.keywords.split(',').map(k => k.trim()) : []),
      requiredSkills: payload.requiredSkills,
      studentType: payload.studentType || "Both",
      maxCapacity: Number(payload.maxCapacity) || 4,
      availablePositions: Number(payload.availablePositions) || Number(payload.maxCapacity) || 4,
      applicationDeadline: payload.applicationDeadline,
      status: payload.status || "Active",
      isPublished: payload.isPublished ?? true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    list.unshift(item);
    setStorage(STORAGE_KEYS.OPPORTUNITIES, list);
    return item;
  },

  updateOpportunity(id, updates) {
    const list = this.getOpportunities();
    const idx = list.findIndex(o => String(o.id) === String(id));
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString().split('T')[0] };
      setStorage(STORAGE_KEYS.OPPORTUNITIES, list);
      return list[idx];
    }
    return null;
  },

  deleteOpportunity(id) {
    let list = this.getOpportunities();
    list = list.filter(o => String(o.id) !== String(id));
    setStorage(STORAGE_KEYS.OPPORTUNITIES, list);
    return true;
  },

  toggleOpportunityStatus(id) {
    const list = this.getOpportunities();
    const opp = list.find(o => String(o.id) === String(id));
    if (opp) {
      opp.status = opp.status === 'Active' ? 'Inactive' : 'Active';
      setStorage(STORAGE_KEYS.OPPORTUNITIES, list);
      return opp;
    }
    return null;
  },

  toggleOpportunityPublish(id) {
    const list = this.getOpportunities();
    const opp = list.find(o => String(o.id) === String(id));
    if (opp) {
      opp.isPublished = !opp.isPublished;
      setStorage(STORAGE_KEYS.OPPORTUNITIES, list);
      return opp;
    }
    return null;
  },

  // ── PART 02: Research Expertise Tags ──────────────────────────
  getExpertise() {
    return getStorage(STORAGE_KEYS.SUPERVISOR_EXPERTISE, DEFAULT_EXPERTISE);
  },

  addExpertise(expertiseItem) {
    const list = this.getExpertise();
    const newId = list.length > 0 ? Math.max(...list.map(e => e.id)) + 1 : 1;
    const item = {
      id: newId,
      name: expertiseItem.name.trim(),
      domain: expertiseItem.domain || "Computer Science",
      level: expertiseItem.level || "Advanced",
      keywords: Array.isArray(expertiseItem.keywords) 
        ? expertiseItem.keywords 
        : (expertiseItem.keywords ? expertiseItem.keywords.split(',').map(k => k.trim()) : [])
    };
    list.push(item);
    setStorage(STORAGE_KEYS.SUPERVISOR_EXPERTISE, list);
    return item;
  },

  removeExpertise(id) {
    let list = this.getExpertise();
    list = list.filter(e => String(e.id) !== String(id));
    setStorage(STORAGE_KEYS.SUPERVISOR_EXPERTISE, list);
    return true;
  },

  updateExpertise(id, updates) {
    const list = this.getExpertise();
    const idx = list.findIndex(e => String(e.id) === String(id));
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      setStorage(STORAGE_KEYS.SUPERVISOR_EXPERTISE, list);
      return list[idx];
    }
    return null;
  },

  // ── PART 03: Published Research Interests ──────────────────────
  getPublishedInterests() {
    return getStorage(STORAGE_KEYS.RESEARCH_INTERESTS, [
      {
        id: 1,
        title: "Bengali Natural Language Understanding & Generative Modeling",
        domain: "Natural Language Processing",
        description: "Focusing on semantic ambiguity resolution, syntactic dependency parsing, and domain-adapted LLM fine-tuning for Bengali dialectal variations.",
        keywords: ["NLU", "Transformers", "Dialectal NLP", "Generative AI"],
        requiredSkills: "Python, PyTorch, HuggingFace Transformers, Linux",
        studentType: "Both",
        capacity: 4,
        status: "Published",
        date: "2026-11-01"
      },
      {
        id: 2,
        title: "Robust Medical Image Segmentation using Vision Transformers",
        domain: "Computer Vision",
        description: "Designing hybrid CNN-Transformer architectures for organ boundary delineation in sparse ultrasound and MRI image sets.",
        keywords: ["ViT", "Segmentation", "Medical AI", "U-Net"],
        requiredSkills: "OpenCV, PyTorch, Medical Imaging, CUDA",
        studentType: "Team",
        capacity: 3,
        status: "Published",
        date: "2026-11-04"
      }
    ]);
  },

  publishResearchInterest(payload) {
    const list = this.getPublishedInterests();
    const newId = list.length > 0 ? Math.max(...list.map(i => i.id)) + 1 : 1;
    const item = {
      id: newId,
      title: payload.title,
      domain: payload.domain,
      description: payload.description,
      keywords: Array.isArray(payload.keywords) ? payload.keywords : (payload.keywords ? payload.keywords.split(',').map(k => k.trim()) : []),
      requiredSkills: payload.requiredSkills,
      studentType: payload.studentType || "Both",
      capacity: Number(payload.capacity) || 3,
      status: "Published",
      date: new Date().toISOString().split('T')[0]
    };
    list.unshift(item);
    setStorage(STORAGE_KEYS.RESEARCH_INTERESTS, list);
    return item;
  },

  deletePublishedInterest(id) {
    let list = this.getPublishedInterests();
    list = list.filter(i => String(i.id) !== String(id));
    setStorage(STORAGE_KEYS.RESEARCH_INTERESTS, list);
    return true;
  },

  // ── PART 07: Supervision Requests ──────────────────────────────
  getRequests() {
    return getStorage(STORAGE_KEYS.STUDENT_REQUESTS, DEFAULT_REQUESTS);
  },

  submitRequest(payload) {
    const list = this.getRequests();
    const newId = list.length > 0 ? Math.max(...list.map(r => r.id)) + 1 : 1;
    const item = {
      id: newId,
      studentId: payload.studentId || "201-15-809",
      studentName: payload.studentName || "Current Student",
      studentEmail: payload.studentEmail || "student@diu.edu.bd",
      department: payload.department || "Department of CSE",
      cgpa: payload.cgpa || "3.75",
      researchInterests: payload.researchInterests || ["Machine Learning"],
      opportunityId: payload.opportunityId || null,
      opportunityTitle: payload.opportunityTitle || "General Supervision",
      supervisorId: payload.supervisorId || 1,
      message: payload.message,
      status: "pending",
      responseNote: null,
      submittedAt: new Date().toISOString().split('T')[0]
    };
    list.unshift(item);
    setStorage(STORAGE_KEYS.STUDENT_REQUESTS, list);
    return item;
  },

  respondToRequest(id, status, responseNote = '') {
    const list = this.getRequests();
    const req = list.find(r => String(r.id) === String(id));
    if (req) {
      req.status = status; // "accepted" | "rejected"
      req.responseNote = responseNote;
      req.respondedAt = new Date().toISOString().split('T')[0];
      setStorage(STORAGE_KEYS.STUDENT_REQUESTS, list);
      return req;
    }
    return null;
  },

  // ── PART 08, 09, 10: Assignments ──────────────────────────────
  getAssignments() {
    return getStorage(STORAGE_KEYS.ASSIGNMENTS, DEFAULT_ASSIGNMENTS);
  },

  assignIndividualStudent({ student, opportunityId, opportunityTitle, notes }) {
    const list = this.getAssignments();

    // Check if already assigned
    const already = list.find(a => a.type === 'individual' && a.targetId === student.student_id && a.status === 'Active');
    if (already) {
      throw new Error(`Student ${student.full_name} (${student.student_id}) is already actively assigned to "${already.opportunityTitle}". Please unassign them first if reassignment is needed.`);
    }

    const newId = list.length > 0 ? Math.max(...list.map(a => a.id)) + 1 : 1;
    const assignment = {
      id: newId,
      type: "individual",
      targetId: student.student_id,
      targetName: student.full_name,
      department: student.department,
      opportunityId,
      opportunityTitle,
      supervisorId: 1,
      supervisorName: "Dr. Syed Tareq",
      assignedDate: new Date().toISOString().split('T')[0],
      status: "Active",
      progress: 0,
      notes: notes || "Assigned by faculty supervisor."
    };
    list.unshift(assignment);
    setStorage(STORAGE_KEYS.ASSIGNMENTS, list);
    return assignment;
  },

  assignTeam({ team, opportunityId, opportunityTitle, notes }) {
    const list = this.getAssignments();

    // Check if team already actively assigned
    const already = list.find(a => a.type === 'team' && a.targetId === team.id && a.status === 'Active');
    if (already) {
      throw new Error(`Team "${team.name}" is already actively assigned to "${already.opportunityTitle}". Please unassign first if reassignment is needed.`);
    }

    const newId = list.length > 0 ? Math.max(...list.map(a => a.id)) + 1 : 1;
    const assignment = {
      id: newId,
      type: "team",
      targetId: team.id,
      targetName: team.name,
      department: team.department || "Department of CSE",
      memberCount: team.members ? team.members.length : 3,
      members: team.members || [],
      opportunityId,
      opportunityTitle,
      supervisorId: 1,
      supervisorName: "Dr. Syed Tareq",
      assignedDate: new Date().toISOString().split('T')[0],
      status: "Active",
      progress: 0,
      notes: notes || "Team assigned to research opportunity."
    };
    list.unshift(assignment);
    setStorage(STORAGE_KEYS.ASSIGNMENTS, list);
    return assignment;
  },

  unassignTarget(id, reason = '') {
    const list = this.getAssignments();
    const idx = list.findIndex(a => String(a.id) === String(id));
    if (idx !== -1) {
      const removed = list.splice(idx, 1)[0];
      setStorage(STORAGE_KEYS.ASSIGNMENTS, list);
      return removed;
    }
    return null;
  },

  updateAssignmentStatus(id, newStatus) {
    const list = this.getAssignments();
    const item = list.find(a => String(a.id) === String(id));
    if (item) {
      item.status = newStatus;
      setStorage(STORAGE_KEYS.ASSIGNMENTS, list);
      return item;
    }
    return null;
  },

  // ── PART 06: Matching Calculation Engine ───────────────────────
  calculateMatches(studentInterests = [], studentPreferredDomain = '') {
    const opportunities = this.getOpportunities().filter(o => o.isPublished && o.status === 'Active');
    
    // Normalize student tags
    const normalizedInterests = studentInterests.map(i => (typeof i === 'string' ? i : i.name || '').toLowerCase());
    const normalizedDomain = (studentPreferredDomain || '').toLowerCase();

    return opportunities.map(opp => {
      const oppDomain = (opp.domain || '').toLowerCase();
      const oppKeywords = (opp.keywords || []).map(k => k.toLowerCase());
      
      const matchingKeywords = oppKeywords.filter(k => 
        normalizedInterests.some(si => si.includes(k) || k.includes(si))
      );
      
      const domainMatch = normalizedDomain && (oppDomain.includes(normalizedDomain) || normalizedDomain.includes(oppDomain));
      
      let score = 0;
      if (domainMatch) score += 40;
      score += Math.min(matchingKeywords.length * 20, 60);

      return {
        opportunity: opp,
        score: Math.min(score, 100),
        domainMatch: Boolean(domainMatch),
        matchingKeywords,
        isDemoScore: true // Explicitly marked as demonstration data
      };
    }).sort((a, b) => b.score - a.score);
  }
};

export default module1Service;
