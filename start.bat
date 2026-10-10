@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

echo Checking Docker Engine...
where docker >nul 2>&1
if errorlevel 1 (
  echo.
  echo ERROR: Docker was not found. Install and start Docker Desktop, then try again.
  goto :fail
)

docker info >nul 2>&1
if errorlevel 1 (
  echo.
  echo ERROR: Docker Engine is not running. Start Docker Desktop and wait until it is ready.
  goto :fail
)

docker compose version >nul 2>&1
if errorlevel 1 (
  echo.
  echo ERROR: Docker Compose is not available. Update Docker Desktop and try again.
  goto :fail
)

if not exist ".env" (
  echo Creating local .env with a generated admin password...
  for /f "usebackq delims=" %%P in (`powershell -NoProfile -Command "[guid]::NewGuid().ToString('N')"`) do set "ADMIN_PASSWORD=%%P"
  if not defined ADMIN_PASSWORD (
    echo ERROR: The local admin password could not be generated.
    goto :fail
  )
  > ".env" echo FRONTEND_PORT=8081
  >> ".env" echo API_PORT=3002
  >> ".env" echo ANALYTICS_ADMIN_PASSWORD=!ADMIN_PASSWORD!
  >> ".env" echo ALLOWED_ORIGINS=http://127.0.0.1:8081,http://localhost:8081
  >> ".env" echo MINIMUM_CITATION_COUNT=60
)

for /f "tokens=1,* delims==" %%A in ('findstr /b "FRONTEND_PORT=" .env') do set "FRONTEND_PORT=%%B"
for /f "tokens=1,* delims==" %%A in ('findstr /b "API_PORT=" .env') do set "API_PORT=%%B"
if not defined FRONTEND_PORT set "FRONTEND_PORT=8081"
if not defined API_PORT set "API_PORT=3002"

echo Building and starting the portfolio...
docker compose up -d --build
if errorlevel 1 (
  echo.
  echo ERROR: Docker Compose could not start the application.
  docker compose logs --tail 80
  goto :fail
)

echo Waiting for the API and frontend to become ready...
set /a ATTEMPT=0
:wait_loop
set /a ATTEMPT+=1

powershell -NoProfile -Command "try { $r = Invoke-WebRequest -UseBasicParsing -TimeoutSec 3 'http://127.0.0.1:%API_PORT%/api/health'; if ($r.StatusCode -eq 200) { exit 0 } } catch {}; exit 1" >nul 2>&1
set "API_READY=!errorlevel!"
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -UseBasicParsing -TimeoutSec 3 'http://127.0.0.1:%FRONTEND_PORT%/portfolio/'; if ($r.StatusCode -eq 200) { exit 0 } } catch {}; exit 1" >nul 2>&1
set "FRONTEND_READY=!errorlevel!"

if "!API_READY!"=="0" if "!FRONTEND_READY!"=="0" goto :ready
if !ATTEMPT! GEQ 60 (
  echo.
  echo ERROR: The application did not become ready within 120 seconds.
  docker compose ps
  docker compose logs --tail 100
  goto :fail
)

>nul 2>&1 ping 127.0.0.1 -n 3
goto :wait_loop

:ready
echo.
echo Portfolio is ready at http://127.0.0.1:%FRONTEND_PORT%/portfolio/
start "" "http://127.0.0.1:%FRONTEND_PORT%/portfolio/"
exit /b 0

:fail
echo.
echo Press any key to close this window.
pause >nul
exit /b 1
