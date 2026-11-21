# Development Roadmap & Action Items (TODO)

## High Priority
- [ ] Connect Playwright test runner to run automated UI smoke tests on `http://localhost:5173`.
- [ ] Implement supervisor batch allocation auto-balancing algorithm.
- [ ] Set up automated Git hook to run `graphify update .` post-commit.

## Deep Learning & Research Infrastructure
- [ ] Integrate fabric defect segmentation metrics evaluation suite (Dice, mIoU, Precision, Recall).
- [ ] Create automated mask risk audit script to verify binary mask integrity and ground-truth alignment.
- [ ] Ensure train/validation/test splits avoid fabric pattern or loom-level leakage.

## Maintenance
- [ ] Review Sentry and PostgreSQL MCP server connection credentials when production databases are provisioned.
