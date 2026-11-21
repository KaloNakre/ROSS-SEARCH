# Project Context: ROSS-SEARCH & Academic Research Intelligence

## 1. Executive Summary
ROSS-SEARCH is a production-grade Academic Research Intelligence & FYP/Thesis Management Platform designed for Daffodil International University (DIU). It bridges undergraduate research preparation, supervisor matching, team formation, automated literature discovery, multi-model AI paper breakdown, and departmental thesis similarity deduplication.

In addition to the software engineering platform, the environment hosts dedicated deep learning research infrastructure focusing on computer vision and fabric defect detection.

## 2. Platform Architecture Stack
- **Frontend:** React 18, Vite 5, Tailwind CSS, React Router v6, Lucide Icons, Axios/Fetch.
- **Backend:** FastAPI (Python 3.12), SQLAlchemy 2.0 ORM, Pydantic v2, SQLite (dev) / PostgreSQL (prod).
- **Security & Auth:** OAuth2 password flow, JWT tokens, BCrypt password hashing, RBAC (Student, Supervisor, Admin).
- **Academic AI Engines:**
  - Google Gemini 1.5 Pro / Flash & Groq Llama 3 via unified `ai_provider.py`.
  - PyMuPDF (fitz) text and structural section parser.
  - TF-IDF + Cosine Vector similarity topic deduplication engine.
  - Federated academic search (arXiv API, Crossref API, OpenAlex API).

## 3. Core University Data & Workflows
- **Departments:** Computer Science & Engineering (CSE), Software Engineering (SWE), Information Technology & Management (ITM), Data Science (DS), Electrical & Electronic Engineering (EEE).
- **Research Domains:** Cyber Security, Natural Language Processing, Computer Vision, Machine Learning, Blockchain & Distributed Systems, Internet of Things, Healthcare AI, Robotics & Embedded Systems.
- **Academic Hierarchy:** Admin (Department Head/Coordinator), Supervisors (Faculty with slot limits), Students (Cohort batches 40-65).

## 4. Key Developer & Runtime Environments
- **Node.js Environment:** Node v20.18.0 at `E:\Thesis\.tools\node-v20.18.0-win-x64`
- **Python Environment:** Python 3.12.10
- **Package & Tool Manager:** `uv` & `uvx` at `C:\Users\robay\.local\bin`
- **Token Compression Proxy:** `rtk` (Rust Token Killer) at `C:\Users\robay\.local\bin\rtk.exe`
- **Codebase Knowledge Graph:** `graphify` (Graphify-Labs AST parser)
- **Context Packaging:** `repomix` v1.14.0
