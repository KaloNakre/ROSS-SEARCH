# ROSS-SEARCH — Academic Research Intelligence Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-brightgreen?style=for-the-badge&logo=render)](https://ross-search.onrender.com)
[![API Docs](https://img.shields.io/badge/API%20Docs-FastAPI-blue?style=for-the-badge&logo=fastapi)](https://ross-search-api.onrender.com/docs)
[![Backend Health](https://img.shields.io/badge/Health%20Check-Active-success?style=for-the-badge)](https://ross-search-api.onrender.com/api/health)

**A Research-Oriented Smart Search and Academic Intelligence Platform for FYP and Thesis Development.**
**University:** Daffodil International University (DIU)
**Live Production URL:** [https://ross-search.onrender.com](https://ross-search.onrender.com)
**Live API Documentation:** [https://ross-search-api.onrender.com/docs](https://ross-search-api.onrender.com/docs)

---

## 🚀 Overview

ROSS-SEARCH is a comprehensive Academic Research Intelligence Platform built for Daffodil International University (DIU) students preparing Final Year Projects (FYP) and Master's Theses.

**Technology Stack:** React 18 + Vite + Tailwind CSS + FastAPI + SQLite + Lucide Icons + React Router v6

The platform provides end-to-end research support: from supervisor discovery and team formation, to AI-powered academic paper analysis, topic similarity detection, and a departmental shared knowledge repository.

---

## 👥 Project Team

| Contributor | Student ID | GitHub Profile |
|---|---|---|
| **Md. Robayet Islam** | 232-35-809 | [![GitHub](https://img.shields.io/badge/GitHub-KaloNakre-181717?style=flat&logo=github)](https://github.com/KaloNakre) |
| **Riya Saha** | 232-35-715 | [![GitHub](https://img.shields.io/badge/GitHub-suronjonaSahA-181717?style=flat&logo=github)](https://github.com/suronjonaSahA) |
| **Tamim Hasan Sami** | 232-35-313 | [![GitHub](https://img.shields.io/badge/GitHub-TamimWhos-181717?style=flat&logo=github)](https://github.com/TamimWhos) |

> **Repository:** Write and commit access maintained by Md. Robayet Islam. All contributors are recognized for their platform development responsibilities.

---

## 🎨 Design & Privacy Principles

1. **Branding:** Uses `ROSS-SEARCH` as the unified platform name throughout.
2. **Official Palette:** DIU professional colors (`#094B8A` primary blue, `#008751` green, `#0A1E3F` deep navy, `#EBF4FC` background).
3. **Official Imagery:** High-resolution DIU Ashulia campus building and official logos.
4. **Privacy First:**
   - No real or fake generated human portraits.
   - Neutral placeholders (`Dr. Full Name`, `Student Candidate`) used throughout.
   - Profile image upload with instant preview, replace, and remove.
   - Actionable empty states throughout.

---

## 🧭 Platform Pages & Routes

### Student Portal

| # | Page | Route | Scope |
|---|---|---|---|
| 1 | **Home / Landing Page** | `/` | Public platform showcase |
| 2 | **Student Registration** | `/register` | Account creation with research interest selection |
| 3 | **Login** | `/login` | Multi-role authentication |
| 4 | **Student Dashboard** | `/student/dashboard` | Overview metrics and quick actions |
| 5 | **Student Profile** | `/student/profile` | Academic profile, interests, and project status |
| 6 | **Edit Student Profile** | `/student/profile/edit` | Profile management with research domain selection |
| 7 | **Research Interests** | `/student/research-interests` | Interest taxonomy management |
| 8 | **Find Supervisor** | `/supervisors` | Supervisor discovery with domain and department filters |
| 9 | **Supervisor Profile** | `/supervisors/:id` | Credentials, expertise, and supervision request |
| 10 | **Edit Supervisor Profile** | `/supervisor/profile/edit` | Supervisor profile and expertise management |
| 11 | **Search Students by Section** | `/students/section` | Peer discovery within academic sections |
| 12 | **Team Search & Formation** | `/teams/search` | Browse teams and explore open positions |
| 13 | **Create Team** | `/teams/create` | Team creation with domain selection |
| 14 | **Team Details** | `/teams/:id` | Roster management and supervisor assignment |
| 15 | **My Teams** | `/teams/my-teams` | Personal team management |

### Academic Research Features

| # | Page | Route | Scope |
|---|---|---|---|
| 16 | **Research Discovery** | `/research/discovery` | Federated paper search across arXiv, Crossref, OpenAlex |
| 17 | **AI Research Breakdown** | `/research/summarizer` | Multi-model AI analysis of research papers |
| 18 | **Public Research Assistant** | `/research/chat` | AI research Q&A — no login required |
| 19 | **Topic Similarity** | `/research/topics` | NLP duplicate thesis topic detection |
| 20 | **Shared Knowledge Repository** | `/research/shared-knowledge` | Departmental AI-analyzed paper database |

### Administration

| # | Page | Route | Scope |
|---|---|---|---|
| 21 | **Admin Dashboard** | `/admin/dashboard` | Platform analytics overview |
| 22 | **Manage Students** | `/admin/users` | Student directory and account management |
| 23 | **Manage Supervisors** | `/admin/supervisors` | Faculty directory and capacity management |
| 24 | **Role Management (RBAC)** | `/admin/roles` | Role permissions and access control |
| 25 | **Database Studio** | `/admin/database` | Live database exploration with cascade viewer |

---

## ⚡ Quick Start

```bash
# Install frontend dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start backend API
cd backend && uvicorn app.main:app --reload
```

> **Role Switching:** Use the **Switch View** pill in the top navigation to toggle between `Student`, `Supervisor`, and `Admin` perspectives.

---

## 🔬 Core Platform Features

### Academic Research Discovery
- Federated search across arXiv, Crossref, and OpenAlex open-access repositories
- Filter by domain, year range, and author
- Personal reading library with BibTeX export
- DIU FYP/Thesis project archive search

### AI Research Breakdown
- Multi-model analysis engine: Google Gemini 1.5 Flash/Pro, Groq Llama 3.3, PyMuPDF Neural NLP (offline)
- Strict academic honesty enforcement — unstated metrics flagged explicitly
- Supports PDF upload, arXiv URL, or direct text input
- Results include: problem statement, objectives, methodology, datasets, results, limitations, research gaps, and future directions

### Research Topic Intelligence
- NLP-powered topic similarity detection against DIU archive and active cohort
- Duplicate rejection threshold (>70% similarity)
- Novel thesis topic suggestions with methodology, datasets, and novelty angle

### Supervisor Discovery & Management
- Supervisor directory with research expertise, availability, and slot tracking
- Supervision request workflow with accept/reject pipeline
- Research opportunity publishing with deadline and quota management

### Team Formation
- Intra-section peer discovery
- Team creation with supervisor nomination
- Member management and join request approval

### Browser Extension (Manifest V3)
- Domain security audit: HTTPS/TLS, security headers, risk scoring
- 12-section technical security analysis report
- Real-time domain intelligence — no login required

### AI Research Assistant (Public)
- Free access to AI research Q&A without mandatory login
- Rate-limited for responsible use (100 requests/min)
- Multi-model routing for optimal response quality

---

## 📂 Source Code Structure

```
ROSS-SEARCH/
├── src/
│   ├── components/          # Shared UI components (Sidebar, Topbar, Layout)
│   ├── context/             # Authentication & JWT context
│   ├── data/                # Research domain taxonomy and mock data
│   ├── pages/
│   │   ├── admin/           # Administration pages
│   │   ├── research/        # Academic research features
│   │   ├── student/         # Student-specific pages
│   │   └── supervisor/      # Supervisor management pages
│   └── services/            # API service clients
├── backend/
│   ├── app/
│   │   ├── api/routes/      # FastAPI REST endpoints
│   │   ├── models/          # SQLAlchemy database models
│   │   ├── schemas/         # Pydantic validation schemas
│   │   └── services/        # AI, PDF processing, academic search engines
│   ├── test_suite.py        # Core system verification (3 iterations × 9 steps)
│   └── test_module2_master.py  # Research intelligence test suite (9 tests)
└── extension/               # Chromium Manifest V3 browser extension
```

---

## ✅ Platform Verification Status

| Verification Suite | Result |
|---|---|
| Core system (auth, teams, admin) — 3 iterations | **27/27 PASS** |
| Research intelligence API — 9 endpoint tests | **9/9 PASS** |
| Frontend production build | **✅ 1648 modules, 0 errors** |

---

## 🔧 Backend API Endpoints (Key)

| Endpoint | Method | Description |
|---|---|---|
| `/api/research/academic-papers` | GET | Federated paper discovery with year/author filters |
| `/api/research/summarize-pdf` | POST | AI Research Breakdown engine |
| `/api/research/chat` | POST | Public AI research assistant |
| `/api/research/check-similarity` | POST | Topic duplicate detection |
| `/api/research/suggest-topics` | GET | Novel thesis topic suggestions |
| `/api/research/library` | GET/POST | Personal reading library management |
| `/api/research/library/export` | GET | BibTeX citation export |
| `/api/extension/analyze-domain` | POST | 12-section domain security audit |

> **Academic Integrity:** All academic papers sourced from authentic open-access repositories (arXiv, Crossref, OpenAlex). Zero fabricated citations or AI-generated research results.
