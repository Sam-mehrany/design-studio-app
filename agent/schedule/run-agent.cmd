@echo off
rem Called by Windows Task Scheduler. Runs the agent once and appends its output to runs\scheduled.log.
cd /d "%~dp0.."
if not exist runs mkdir runs
echo. >> runs\scheduled.log
echo ==== %date% %time% ==== >> runs\scheduled.log
node src\run.js >> runs\scheduled.log 2>&1
exit /b %errorlevel%
