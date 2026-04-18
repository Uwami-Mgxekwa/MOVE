# Start ngrok tunnels for frontend and backend, then auto-update frontend/.env

Write-Host "Starting ngrok tunnels..." -ForegroundColor Cyan

# Start backend tunnel in background
Start-Process "ngrok" -ArgumentList "http 8080" -WindowStyle Normal

# Start frontend tunnel in background  
Start-Process "ngrok" -ArgumentList "http 5173" -WindowStyle Normal

# Wait for ngrok to initialize
Write-Host "Waiting for tunnels to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 4

# Fetch tunnel URLs from ngrok local API
try {
    $tunnels = (Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels").tunnels

    $backendUrl = ($tunnels | Where-Object { $_.config.addr -like "*8080*" } | Select-Object -First 1).public_url
    $frontendUrl = ($tunnels | Where-Object { $_.config.addr -like "*5173*" } | Select-Object -First 1).public_url

    # Prefer https
    if ($backendUrl -like "http://*") {
        $backendUrl = $backendUrl -replace "^http://", "https://"
    }
    if ($frontendUrl -like "http://*") {
        $frontendUrl = $frontendUrl -replace "^http://", "https://"
    }

    # Update frontend/.env
    $envPath = "frontend\.env"
    $envContent = Get-Content $envPath -Raw
    if ($envContent -match "VITE_API_URL=") {
        $envContent = $envContent -replace "VITE_API_URL=.*", "VITE_API_URL=$backendUrl"
    } else {
        $envContent += "`nVITE_API_URL=$backendUrl"
    }
    Set-Content $envPath $envContent

    Write-Host ""
    Write-Host "Tunnels ready!" -ForegroundColor Green
    Write-Host "  Frontend: $frontendUrl" -ForegroundColor White
    Write-Host "  Backend:  $backendUrl" -ForegroundColor White
    Write-Host ""
    Write-Host "Open on your phone: $frontendUrl" -ForegroundColor Cyan
    Write-Host "frontend/.env updated with backend URL." -ForegroundColor Green
    Write-Host ""
    Write-Host "Restart the frontend dev server for the URL change to take effect." -ForegroundColor Yellow
} catch {
    Write-Host "Could not read ngrok API. Make sure ngrok is running." -ForegroundColor Red
    Write-Host "Manually check http://localhost:4040 for your tunnel URLs." -ForegroundColor Yellow
}

Read-Host "Press Enter to close"
