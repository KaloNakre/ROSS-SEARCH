@echo off
set "PATH=%~dp0.tools\node-v20.18.0-win-x64;%PATH%"
echo Building ROSS-SEARCH for Production...
npm run build
pause

