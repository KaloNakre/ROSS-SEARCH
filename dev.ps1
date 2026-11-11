$env:PATH = "$PSScriptRoot\.tools\node-v20.18.0-win-x64;" + $env:PATH
Write-Host "Starting ROSS-SEARCH Development Server..." -ForegroundColor Cyan
npm run dev

