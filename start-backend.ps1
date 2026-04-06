$env:JAVA_HOME = "C:\Program Files\Java\jdk-24"
$env:PATH = "$env:USERPROFILE\Maven\apache-maven-3.9.6\bin;$env:PATH"
Write-Host "Starting MOVE backend..." -ForegroundColor Cyan
Set-Location backend
& mvn spring-boot:run
