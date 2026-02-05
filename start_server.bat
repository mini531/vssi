@echo off
echo Starting Local Web Server...
echo Open your browser to: http://localhost:8000/screens/SAM_AS_10_01.html
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "server.ps1"
pause
