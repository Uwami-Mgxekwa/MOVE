$env:JAVA_HOME = "C:\Program Files\Java\jdk-24"
$env:PATH = "$env:USERPROFILE\Maven\apache-maven-3.9.6\bin;$env:PATH"

# Load .env file
Get-Content "backend\.env" | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
        [System.Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), 'Process')
    }
}

Write-Host "Starting MOVE backend..." -ForegroundColor Cyan
Set-Location backend
& mvn clean spring-boot:run

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nBackend failed to start. See error above." -ForegroundColor Red
    Read-Host "Press Enter to close"
}