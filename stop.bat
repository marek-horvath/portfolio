@echo off
setlocal EnableExtensions
cd /d "%~dp0"

where docker >nul 2>&1
if errorlevel 1 (
  echo ERROR: Docker was not found. Install Docker Desktop or stop the containers manually.
  goto :fail
)

docker info >nul 2>&1
if errorlevel 1 (
  echo ERROR: Docker Engine is not running. Start Docker Desktop and try again.
  goto :fail
)

echo Stopping the portfolio...
docker compose down
if errorlevel 1 (
  echo ERROR: Docker Compose could not stop the application.
  goto :fail
)

echo Portfolio stopped. Persistent data was kept.
exit /b 0

:fail
echo.
echo Press any key to close this window.
pause >nul
exit /b 1
