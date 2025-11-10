# Script để chạy frontend nhanh
# Chạy: .\start-frontend.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STARTING FRONTEND DEV SERVER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

Write-Host "🚀 Starting Vite dev server..." -ForegroundColor Green
Write-Host ""
Write-Host "Sau khi server chạy, mở trình duyệt:" -ForegroundColor Cyan
Write-Host "  👉 http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Nhấn Ctrl+C để dừng server" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

# Chạy dev server
npm run dev
