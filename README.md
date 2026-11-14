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
| **Robayet Islam** | 201-15-809 | **Supervisor Management & Opportunity Matching**<br>• Supervisor Profile Management & Credentials<br>• Research Expertise & Tag-Based Topic Publishing<br>• Research Opportunity Management (Deadlines, Quotas)<br>• Student Supervision Request & Assignment Management | [![GitHub](https://img.shields.io/badge/GitHub-KaloNakre-181717?style=flat&logo=github)](https://github.com/KaloNakre) |
| **Riya Saha** | 201-15-715 | **Student Management & RBAC**<br>• Student Self-Registration & Academic Profiles<br>• Preferred Research Interests & Domains<br>• Role-Based Access Control (Student, Supervisor, Admin) | [![GitHub](https://img.shields.io/badge/GitHub-suronjonaSahA-181717?style=flat&logo=github)](https://github.com/suronjonaSahA) |
| **Tamim Hasan Sami** | 201-15-313 | **Peer Discovery & Team Formation**<br>• Intra-Section Student Search & Peer Discovery<br>• FYP/Thesis Team Creation & Formation<br>• Team Member Management & Roster Integration | [![GitHub](https://img.shields.io/badge/GitHub-TamimWhos-181717?style=flat&logo=github)](https://github.com/TamimWhos) |

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

