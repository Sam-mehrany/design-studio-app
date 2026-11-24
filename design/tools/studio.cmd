@echo off
rem Start the design studio against the real vault and open it in the default browser.
rem Pass --port NNNN to use a different port.
setlocal
set "PORT=7391"
if not "%~1"=="" if /i "%~1"=="--port" set "PORT=%~2"
start "" "http://127.0.0.1:%PORT%/"
node "%~dp0studio.js" %*
