$env:PATH = "$PSScriptRoot\.tools\git\cmd;$PSScriptRoot\.tools\node-v20.18.0-win-x64;" + $env:PATH
Write-Host "Pushing ROSS-SEARCH to https://github.com/KaloNakre/ROSS-SEARCH..." -ForegroundColor Cyan
git push -u origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================================" -ForegroundColor Green
    Write-Host "Push completed successfully!" -ForegroundColor Green
    Write-Host "`nLive GitHub Pages Deployment will be available at:" -ForegroundColor Yellow
    Write-Host "https://kalonakre.github.io/ROSS-SEARCH/" -ForegroundColor Cyan
    Write-Host "========================================================`n" -ForegroundColor Green
} else {
    Write-Host "`nIf authentication is required, use your GitHub Personal Access Token (PAT):" -ForegroundColor Yellow
    Write-Host "1. Go to https://github.com/settings/tokens"
    Write-Host "2. Generate token with 'repo' scope"
    Write-Host "3. Paste token when prompted for password."
}
