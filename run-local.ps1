$ErrorActionPreference = "Stop"

$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectDir

Write-Host "Starting PawWash local preview..."
Write-Host "Open: http://127.0.0.1:4173"
Write-Host ""
Write-Host "Press Ctrl+C to stop the server."

python -m http.server 4173 --bind 127.0.0.1
