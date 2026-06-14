@echo off
REM ZOE Sustainability Platform - Windows launcher.
REM
REM Double-click this file (or run it in a terminal). It runs the PowerShell
REM setup script with the execution policy bypassed for this one run only, so
REM you do NOT hit the "running scripts is disabled on this system" error.
REM
REM It installs everything (Node if missing, dependencies) and starts the app.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0windows.ps1"

echo.
echo The servers have stopped. Press any key to close this window.
pause >nul
