@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-24
set PATH=%USERPROFILE%\Maven\apache-maven-3.9.6\bin;%PATH%

echo Loading environment variables...
for /f "tokens=1,2 delims==" %%a in (backend\.env) do (
    if not "%%a"=="" if not "%%a:~0,1%"=="#" set %%a=%%b
)

echo Starting MOVE backend...
cd backend
mvn spring-boot:run
if errorlevel 1 (
    echo.
    echo Backend failed to start. See error above.
    pause
)