@echo off
echo Starting ROSS-SEARCH FastAPI Backend...
cd /d %~dp0backend
"C:\Users\robay\AppData\Local\Programs\Python\Python312\python.exe" -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pause

