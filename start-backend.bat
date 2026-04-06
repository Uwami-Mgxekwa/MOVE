@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-24
set PATH=%USERPROFILE%\Maven\apache-maven-3.9.6\bin;%PATH%
echo Starting MOVE backend...
cd backend
mvn spring-boot:run
