# Changelog: ROSS-SEARCH Platform

All notable changes to this project are documented in this file.

## [2.1.0] - 2026-11-22
### Added
- **Core Token & Project Intelligence:** Installed `rtk` v1.2.1, `graphify` v0.9.114, `repomix` v1.14.0, `uv` v0.13.9.
- **Global & Workspace MCP Architecture:** Configured Sequential Thinking, Filesystem, Git, Graphify, Serena, Context7, Playwright, Chrome DevTools, and GitHub in `mcp_config.json`.
- **Authentic Paper Repository:** Added 20 landmark verified research papers across Cyber Security, NLP, CV, ML, Blockchain, IoT, and Healthcare AI.
- **Student Search Audit Trail:** Implemented `GET /api/research/query-history` and dedicated UI tab.
- **Built-in PDF Viewer:** Fullscreen modal reader with automatic download tracking.
- **Automated Verification:** Created `backend/test_student_research_automation.py` covering auth, discovery, PDF streaming, AI summary latency, and library persistence.

### Fixed
- Fixed Antigravity IDE terminal launch crash caused by missing `D:\Antigravity IDE projects` directory.
- Fixed domain selection counter and persistence bug in `EditStudentProfile.jsx`.
- Fixed `StudentInterest` SQLAlchemy `viewonly=True` persistence failure in `backend/app/api/routes/students.py`.

## [2.0.0] - 2026-11-21
### Changed
- Complete removal of internal modular names across 27 frontend and backend files.
