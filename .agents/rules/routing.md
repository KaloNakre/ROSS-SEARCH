# Intelligent Tool Usage & Token Routing Strategy

To minimize token consumption and maximize context precision, agents MUST route tool invocations strictly according to the following operational matrix:

| Task / Domain | Primary Tools | Execution Strategy |
|---|---|---|
| **Codebase Exploration & Architecture** | `Graphify` + `Serena` | Query AST graph nodes/edges; resolve symbols instead of re-reading entire directories. |
| **Terminal & Shell Operations** | Standard CLI / Shell | Execute commands directly in terminal; batch related commands efficiently. |
| **Large Codebase Context Packaging** | `Repomix` | Use `repomix-output.xml` or custom include filters. Never dump uncompressed folders. |
| **Framework & API Documentation** | `Context7` | Query current version documentation for Python, FastAPI, React, Next.js, and Tailwind CSS. |
| **Version Control & Repository Operations** | `Git MCP` + `GitHub MCP` | Use structural Git queries for commit history, branch info, and clean non-destructive diffs. |
| **Frontend Diagnostics & DOM/Console** | `Chrome DevTools MCP` | Inspect console logs, network latency, and rendering errors without raw page scrapes. |
| **Automated End-to-End Testing** | `Playwright MCP` | Run functional headless UI assertions and user journey verification. |
| **Academic & Technical Research** | `Exa MCP` / arXiv / Crossref | Retrieve primary sources, published papers, and official DOIs. Never fabricate papers. |
| **Complex Engineering Reasoning** | `Sequential Thinking MCP` | Formulate multi-step hypotheses, evaluate architectural trade-offs, and verify plans. |
| **Project Continuity & Historical State** | `Project Memory Files` | Consult `PROJECT_CONTEXT.md`, `ARCHITECTURE.md`, `PROGRESS.md`, and `DECISIONS.md`. |
