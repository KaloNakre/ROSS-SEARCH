@echo off
set "PATH=%~dp0.tools\git\cmd;%~dp0.tools\node-v20.18.0-win-x64;%PATH%"
echo Pushing ROSS-SEARCH to https://github.com/KaloNakre/ROSS-SEARCH...
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo Push completed successfully!
    echo.
    echo Live GitHub Pages Deployment will be available at:
    echo https://kalonakre.github.io/ROSS-SEARCH/
    echo ========================================================
) else (
    echo.
    echo If GitHub asks for a password, please use a GitHub Personal Access Token (PAT):
    echo 1. Go to https://github.com/settings/tokens
    echo 2. Generate a token with 'repo' and 'workflow' scopes
    echo 3. Paste the token as the password.
)
pause

