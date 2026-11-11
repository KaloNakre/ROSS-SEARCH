@echo off
set "PATH=%~dp0.tools\git\cmd;%~dp0.tools\node-v20.18.0-win-x64;%PATH%"
cls
echo ========================================================
echo Pushing ROSS-SEARCH to GitHub...
echo Repository: https://github.com/KaloNakre/ROSS-SEARCH
echo ========================================================
echo.
git push origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo SUCCESS: Project pushed to GitHub!
    echo.
    echo The GitHub Actions deployment is now running.
    echo In a few moments, your live site will be active at:
    echo.
    echo https://kalonakre.github.io/ROSS-SEARCH/
    echo ========================================================
) else (
    echo.
    echo [NOTE] If GitHub asked for a password, note that GitHub
    echo requires a Personal Access Token (PAT):
    echo 1. Open: https://github.com/settings/tokens
    echo 2. Click "Generate new token (classic)"
    echo 3. Check "repo" and "workflow" scopes
    echo 4. Paste that token when prompted for Password.
)
echo.
pause
