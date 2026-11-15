# ROSS-SEARCH (Module 1)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-brightgreen?style=for-the-badge&logo=render)](https://ross-search.onrender.com)
[![API Docs](https://img.shields.io/badge/API%20Docs-FastAPI-blue?style=for-the-badge&logo=fastapi)](https://ross-search-api.onrender.com/docs)
[![Backend Health](https://img.shields.io/badge/Health%20Check-Active-success?style=for-the-badge)](https://ross-search-api.onrender.com/api/health)

**A Research-Oriented Smart Search and Shared Knowledge Platform for FYP and Thesis Development.**  
**University:** Daffodil International University (DIU)  
**Live Production URL:** [https://ross-search.onrender.com](https://ross-search.onrender.com)  
**Live API Documentation:** [https://ross-search-api.onrender.com/docs](https://ross-search-api.onrender.com/docs)  

---

## 🚀 Overview

This repository contains the complete frontend UI for **MODULE 1** of ROSS-SEARCH, built with **React 18 + Vite + Tailwind CSS + Lucide Icons + React Router v6**. The design faithfully implements the layouts, DIU color scheme, and typography from the project specifications and mockups.

---

## 👥 Module 1 Project Team & Contributors

| Contributor | ID | Role & Assigned Module 1 Scope | GitHub Profile |
|---|---|---|---|
| **Md. Robayet Islam** | 232-35-809 | **Supervisor Management & Opportunity Matching**<br>• Supervisor Profile Management & Credentials<br>• Research Expertise & Tag-Based Topic Publishing<br>• Research Opportunity Management (Deadlines, Quotas)<br>• Student Supervision Request & Assignment Management | [![GitHub](https://img.shields.io/badge/GitHub-KaloNakre-181717?style=flat&logo=github)](https://github.com/KaloNakre) |
| **Riya Saha** | 232-35-715 | **Student Management & RBAC**<br>• Student Self-Registration & Academic Profiles<br>• Preferred Research Interests & Domains<br>• Role-Based Access Control (Student, Supervisor, Admin) | [![GitHub](https://img.shields.io/badge/GitHub-suronjonaSahA-181717?style=flat&logo=github)](https://github.com/suronjonaSahA) |
| **Tamim Hasan Sami** | 232-35-313 | **Peer Discovery & Team Formation**<br>• Intra-Section Student Search & Peer Discovery<br>• FYP/Thesis Team Creation & Formation<br>• Team Member Management & Roster Integration | [![GitHub](https://img.shields.io/badge/GitHub-TamimWhos-181717?style=flat&logo=github)](https://github.com/TamimWhos) |

> **Contributor Notice:** Teammates are officially recognized as project contributors for their respective Continuous Assessment 1 module responsibilities. Repository write and commit access is maintained exclusively by Robayet Islam.

---

## 🎨 Design & Strict Privacy Rules Compliance

1. **Branding & Title:** Uses `ROSS-SEARCH` without the word "Management" in branding or main title.
2. **Official Palette:** Daffodil International University professional colors (`#094B8A` primary blue, `#008751` green, `#0A1E3F` deep navy sidebar, `#EBF4FC` soft background).
3. **Official Imagery:** Uses high-resolution extracts of the official DIU Ashulia permanent campus building and official DIU logos.
4. **Privacy & No Fake Personal Data:**
   - No real or fake generated human portraits or stock profile photos.
   - Neutral placeholders (`Dr. Full Name`, `Student Candidate`, `211-15-XXXX`) used throughout.
   - Clean text-based supervisor cards in *Find Suitable Supervisor* with no avatars.
   - Student & Supervisor profiles default to a neutral empty image placeholder until the user uploads an image.
   - Profile edit pages feature an interactive **Image Upload Widget** with instant preview, replace, and remove capabilities.
   - Actionable empty states with buttons (e.g. *No Teams Found! -> Create New Team*).

---

## 🧭 Module 1 Navigation & Page Routes

| # | Page Name | Route | Role / Scope |
|---|---|---|---|
| 1 | **Home / Landing Page** | `/` | Public showcase with DIU campus photo, hero, and feature cards |
| 2 | **Student Registration** | `/register` | Registration form with validation & multi-interest selection |
| 3 | **Login** | `/login` | Role-selectable login, OAuth buttons & DIU brand graphic |
| 4 | **Student Dashboard** | `/student/dashboard` | 4 stat cards (24 supervisors, 2 teams, etc.), quick actions & logs |
| 5 | **Student Profile** | `/student/profile` | Neutral placeholder avatar, section, interests & project title |
| 6 | **Edit Student Profile** | `/student/profile/edit` | Profile image upload/replace/remove widget & form fields |
| 7 | **Research Interests & Preferred Domains** | `/student/research-interests` | Multi-category interest chips, custom tag adder & primary domain |
| 8 | **Find Suitable Supervisor** | `/supervisors` | Clean text-based cards, domain & dept filters, slot indicators |
| 9 | **Supervisor Profile** | `/supervisors/:id` | Full credentials, research expertise badges, contact request modal |
| 10 | **Edit Supervisor Profile** | `/supervisor/profile/edit` | Supervisor picture upload/replace/remove, tags, room & slots |
| 11 | **Search Students by Section** | `/students/section` | Intra-section matching (e.g. 60_A), invite to active team |
| 12 | **Team Search & Formation** | `/teams/search` | Search Team / Create Team tabs, 0/5 member summary card |
| 13 | **Create Team** | `/teams/create` | Project title, domain selection, section picker, abstract input |
| 14 | **Team Details** | `/teams/:id` | Roster list, remove member, add teammate modal, supervisor assignment |
| 15 | **My Teams** | `/teams/my-teams` | Empty state (*No Teams Found!*) or team management cards |
| 16 | **Admin Dashboard** | `/admin/dashboard` | 4 stat cards (125 students, 45 supervisors, 78 teams, 112 projects) |
| 17 | **Manage Students & Users** | `/admin/users` | Student directory, section verification, add user modal |
| 18 | **Manage Supervisors & Expertise** | `/admin/supervisors` | Faculty directory, capacity quotas, add supervisor modal |
| 19 | **Role Management (RBAC)** | `/admin/roles` | Role definitions, feature permission matrix & live role switcher |

---

## ⚡ Quick Start & Development

To run the development server:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```

To preview the built production bundle:
```bash
npm run preview
```

> **Note on Testing Roles:** Use the interactive **Switch View** pill in the top navigation bar to seamlessly toggle between `Student`, `Supervisor`, and `Admin` perspectives at any time.

---

## 📂 Module 1 Source Code Directory & Direct Contribution Links

This section provides direct GitHub source code links for faculty evaluation. Each team member's architectural responsibilities, UI components, backend APIs, and data models can be inspected directly by clicking the corresponding links below.

---

### 1. 👨‍💻 Md. Robayet Islam (ID: 232-35-809) — Module 1 Lead & Core Engine Architect
*Primary Responsibilities:* Supervisor Management, Research Opportunity Publishing, Live Database Studio, Cascade Data Integrity, and AI Research Matching.

#### Frontend UI Pages & Components
* **Supervisor Directory & Discovery:** [`src/pages/FindSupervisorPage.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/FindSupervisorPage.jsx)
* **Supervisor Public Profile:** [`src/pages/SupervisorProfile.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/SupervisorProfile.jsx)
* **Supervisor Profile Management & Upload Widget:** [`src/pages/EditSupervisorProfile.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/EditSupervisorProfile.jsx)
* **Supervisor Faculty Dashboard:** [`src/pages/supervisor/SupervisorDashboard.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/supervisor/SupervisorDashboard.jsx)
* **Research Expertise & Taxonomy Management:** [`src/pages/supervisor/ResearchExpertisePage.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/supervisor/ResearchExpertisePage.jsx)
* **Publish Thesis Research Interests:** [`src/pages/supervisor/PublishResearchInterestPage.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/supervisor/PublishResearchInterestPage.jsx)
* **Research Opportunities & Capacity Quotas:** [`src/pages/supervisor/ResearchOpportunitiesPage.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/supervisor/ResearchOpportunitiesPage.jsx)
* **Supervision Requests & Application Pipeline:** [`src/pages/supervisor/SupervisorRequestsPage.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/supervisor/SupervisorRequestsPage.jsx)
* **Individual Student Thesis Assignment:** [`src/pages/supervisor/IndividualStudentAssignmentPage.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/supervisor/IndividualStudentAssignmentPage.jsx)
* **Team Thesis Assignment & Allocation:** [`src/pages/supervisor/TeamAssignmentPage.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/supervisor/TeamAssignmentPage.jsx)
* **Assigned Students & Teams Cohort Overview:** [`src/pages/supervisor/AssignedStudentsTeamsPage.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/supervisor/AssignedStudentsTeamsPage.jsx)
* **Live Database Studio (Permanent Cascade Explorer):** [`src/pages/admin/DatabaseViewerPage.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/admin/DatabaseViewerPage.jsx)
* **Secure Administrator Authentication Portal:** [`src/pages/AdminLoginPage.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/AdminLoginPage.jsx)
* **AI Research Matching Engine:** [`src/pages/student/ResearchMatchingPage.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/student/ResearchMatchingPage.jsx)

#### Backend API, Data Models & Architecture
* **Supervisor Management REST API:** [`backend/app/api/routes/supervisors.py`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/backend/app/api/routes/supervisors.py)
* **Supervisor Pydantic Validation Schemas:** [`backend/app/schemas/supervisor.py`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/backend/app/schemas/supervisor.py)
* **Supervisor Relational Database Model:** [`backend/app/models/supervisor.py`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/backend/app/models/supervisor.py)
* **Supervision Requests Workflow API:** [`backend/app/api/routes/supervision_requests.py`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/backend/app/api/routes/supervision_requests.py)
* **Supervision Requests Model:** [`backend/app/models/supervision_request.py`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/backend/app/models/supervision_request.py)
* **Admin Database Studio & Cascade Engine:** [`backend/app/api/routes/admin.py`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/backend/app/api/routes/admin.py)
* **Database Connection & Multi-Thread Pool:** [`backend/app/database/connection.py`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/backend/app/database/connection.py)
* **Automated 3-Iteration Verification Suite:** [`backend/test_suite.py`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/backend/test_suite.py)

---

### 2. 👩‍💻 Riya Saha (ID: 232-35-715) — Student Registration & RBAC Architect
*Primary Responsibilities:* Student Self-Registration, Profile Management, Academic Interests Taxonomy, and Role-Based Access Control (RBAC).

#### Frontend UI Pages & Components
* **Account Type Selection (Student / Supervisor):** [`src/pages/AccountTypeSelectionPage.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/AccountTypeSelectionPage.jsx)
* **Student Self-Registration:** [`src/pages/StudentRegistrationPage.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/StudentRegistrationPage.jsx)
* **Unified Authentication (Student, Supervisor, Admin):** [`src/pages/LoginPage.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/LoginPage.jsx)
* **Authentication Context & JWT State Management:** [`src/context/AuthContext.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/context/AuthContext.jsx)
* **Role-Based Access Control (RBAC) Route Guard:** [`src/components/ProtectedRoute.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/components/ProtectedRoute.jsx)
* **Student Academic Profile:** [`src/pages/StudentProfile.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/StudentProfile.jsx)
* **Edit Student Profile & Preferences:** [`src/pages/EditStudentProfile.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/EditStudentProfile.jsx)
* **Student Dashboard & Overview Metrics:** [`src/pages/StudentDashboard.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/StudentDashboard.jsx)
* **Declared Research Interests & Domains:** [`src/pages/ResearchInterestsPage.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/ResearchInterestsPage.jsx)
* **Administrator User Management Directory:** [`src/pages/ManageUsersPage.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/ManageUsersPage.jsx)
* **RBAC Role Definitions & Permission Matrix:** [`src/pages/RoleManagementPage.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/RoleManagementPage.jsx)

#### Backend API, Data Models & Architecture
* **Authentication & Token Revocation API:** [`backend/app/api/routes/auth.py`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/backend/app/api/routes/auth.py)
* **Argon2id Password Security & JWT Utilities:** [`backend/app/core/security.py`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/backend/app/core/security.py)
* **Student Profile REST API:** [`backend/app/api/routes/students.py`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/backend/app/api/routes/students.py)
* **Student Pydantic Validation Schemas:** [`backend/app/schemas/student.py`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/backend/app/schemas/student.py)
* **Student Relational Database Model:** [`backend/app/models/student.py`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/backend/app/models/student.py)
* **Research Domains & Taxonomy API:** [`backend/app/api/routes/research.py`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/backend/app/api/routes/research.py)
* **Research Domains Model:** [`backend/app/models/research_interest.py`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/backend/app/models/research_interest.py)
* **User Accounts & Role Enumeration Model:** [`backend/app/models/user.py`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/backend/app/models/user.py)

---

### 3. 👨‍💻 Tamim Hasan Sami (ID: 232-35-313) — Peer Discovery, Team Formation & Join Workflow
*Primary Responsibilities:* Intra-Section Peer Discovery, FYP/Thesis Team Creation, Open Slot Detection, and Team Join Request ("Add to the Team") Workflow.

#### Frontend UI Pages & Components
* **Intra-Section Student Search & Peer Discovery:** [`src/pages/SearchStudentsSection.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/SearchStudentsSection.jsx)
* **Create FYP / Thesis Team:** [`src/pages/CreateTeamPage.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/CreateTeamPage.jsx)
* **Team Search & Open Slot Exploration ("Add to the Team"):** [`src/pages/TeamSearchPage.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/TeamSearchPage.jsx)
* **Team Details, Roster & Join Request Approval:** [`src/pages/TeamDetailsPage.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/TeamDetailsPage.jsx)
* **My Teams Dashboard & Outgoing Applications:** [`src/pages/MyTeamsPage.jsx`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/src/pages/MyTeamsPage.jsx)

#### Backend API, Data Models & Architecture
* **Team Management & Join Requests REST API:** [`backend/app/api/routes/teams.py`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/backend/app/api/routes/teams.py)
* **Team Pydantic Validation Schemas:** [`backend/app/schemas/team.py`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/backend/app/schemas/team.py)
* **Team, TeamMember & TeamJoinRequest Database Models:** [`backend/app/models/team.py`](https://github.com/KaloNakre/ROSS-SEARCH/blob/main/backend/app/models/team.py)


