@echo off
echo Starting ngrok tunnel for backend (port 8080)...
echo.
echo Once the URL appears, copy the https:// URL and update frontend/.env
echo Set: VITE_API_URL=https://YOUR-URL.ngrok-free.app
echo Then restart the frontend dev server.
echo.
ngrok http 8080
