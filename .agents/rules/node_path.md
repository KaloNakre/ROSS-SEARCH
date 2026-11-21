# Node / npm / npx Environment Rule

Always prefix commands invoking `node`, `npm`, or `npx` with:
```powershell
$env:PATH = "E:\Thesis\.tools\node-v20.18.0-win-x64;$env:PATH"
```
This ensures project-scoped Node.js tools are resolved within the standard sandbox without modifying system PATH or creating wrapper files.
