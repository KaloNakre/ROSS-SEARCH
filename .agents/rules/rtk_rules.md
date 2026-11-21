# RTK (Rust Token Killer) Command Optimization Rules

## 1. Operating Rules
1. **Default Proxying:** Always prefix common developer commands with `rtk` when running in terminal:
   - `rtk git status` / `rtk git diff` / `rtk git log -n 5`
   - `rtk npm test` / `rtk npm run build`
   - `rtk pytest` / `rtk ruff check`
2. **Preservation of Errors:** RTK automatically preserves critical stack traces, compiler errors, and failed test assertions while stripping boilerplate headers, ASCII art, and progress bars.
3. **Full Output Bypass:** If raw uncompressed logs are strictly necessary for deep forensic debugging, use `rtk bypass <cmd>` or raw execution.
4. **Token Savings Audit:** Routinely run `rtk gain` to inspect token savings metrics and efficiency rates across sessions.
