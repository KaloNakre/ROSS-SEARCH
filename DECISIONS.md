# Architectural & Engineering Decisions (ADR)

## ADR-001: Unified Academic Platform Identity
- **Date:** 2026-11-21
- **Status:** Accepted & Implemented
- **Decision:** Eliminate all internal developer names, student IDs, and module numbers (`Module 1`, `Module 2`) from user-facing screens and API routes. The platform is strictly branded as `ROSS-SEARCH: Academic Research Intelligence Platform`.

## ADR-002: Token-Efficient Developer Tooling (RTK + Graphify)
- **Date:** 2026-11-22
- **Status:** Accepted & Implemented
- **Decision:** Integrate RTK as a CLI proxy for Git, npm, and test commands to intercept noisy outputs and compress them before reaching LLM context. Pair with Graphify for deterministic AST graph navigation rather than blindly re-reading full files.

## ADR-003: SSRF Protection on PDF Streaming
- **Date:** 2026-11-20
- **Status:** Accepted & Implemented
- **Decision:** Implement strict IP/domain validation in `pdf_processor.py`. Ban loopback (127.0.0.1, localhost), link-local (169.254.0.0/16), and private RFC 1918 subnets when downloading research papers to protect server infrastructure.

## ADR-004: Dual-Tier MCP Architecture (Global + Workspace)
- **Date:** 2026-11-22
- **Status:** Accepted & Implemented
- **Decision:** Maintain `~/.gemini/config/mcp_config.json` for global environment capabilities while defining `.agents/mcp_config.json` inside the project using `${workspaceFolder}`. This guarantees that projects remain self-contained, portable, and secure.
