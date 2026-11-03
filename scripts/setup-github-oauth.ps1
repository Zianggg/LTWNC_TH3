# Ghi thông tin GitHub OAuth App vào .env.local (chạy trên máy) và Vercel (production).
# Chạy: powershell -ExecutionPolicy Bypass -File scripts\setup-github-oauth.ps1
# Secret được nhập ẩn và chỉ nằm trong bộ nhớ của script, không in ra màn hình.

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

function Read-Secret([string]$prompt) {
  $secure = Read-Host -Prompt $prompt -AsSecureString
  $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  try { return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) }
  finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
}

function Set-LocalEnv([string]$name, [string]$value) {
  $file = Join-Path $root ".env.local"
  $lines = @()
  if (Test-Path $file) { $lines = @(Get-Content $file -Encoding UTF8) }
  $found = $false
  $lines = $lines | ForEach-Object {
    if ($_ -match "^$name=") { $found = $true; "$name=$value" } else { $_ }
  }
  if (-not $found) { $lines += "$name=$value" }
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [IO.File]::WriteAllLines($file, [string[]]$lines, $utf8NoBom)
}

function Set-VercelEnv([string]$name, [string]$value) {
  # Xoá giá trị cũ (nếu có) rồi thêm mới; giá trị đi qua stdin, không nằm trên dòng lệnh.
  # Ghi ra file tạm không có ký tự xuống dòng (pipe của PowerShell 5.1 sẽ thêm "\r\n" vào secret).
  & cmd /c "npx --yes vercel@latest env rm $name production --yes >nul 2>&1"
  $tmp = [IO.Path]::GetTempFileName()
  try {
    [IO.File]::WriteAllText($tmp, $value, (New-Object System.Text.UTF8Encoding($false)))
    & cmd /c "npx --yes vercel@latest env add $name production < `"$tmp`" >nul"
    if ($LASTEXITCODE -ne 0) { throw "Khong luu duoc $name len Vercel" }
  } finally {
    Remove-Item $tmp -Force -ErrorAction SilentlyContinue
  }
  Write-Host "  Vercel: da luu $name" -ForegroundColor Green
}

Write-Host ""
Write-Host "== 1/2. OAuth App cho ban Vercel (callback https://class-deadline-hub.vercel.app/api/auth/callback/github)" -ForegroundColor Cyan
$prodId = Read-Host "Client ID (Enter de bo qua)"
if ($prodId) {
  $prodSecret = Read-Secret "Client secret"
  Set-VercelEnv "AUTH_GITHUB_ID" $prodId.Trim()
  Set-VercelEnv "AUTH_GITHUB_SECRET" $prodSecret.Trim()
  $prodSecret = $null
}

Write-Host ""
Write-Host "== 2/2. OAuth App cho may nay (callback http://localhost:3000/api/auth/callback/github)" -ForegroundColor Cyan
$localId = Read-Host "Client ID (Enter de bo qua)"
if ($localId) {
  $localSecret = Read-Secret "Client secret"
  Set-LocalEnv "AUTH_GITHUB_ID" $localId.Trim()
  Set-LocalEnv "AUTH_GITHUB_SECRET" $localSecret.Trim()
  $localSecret = $null
  Write-Host "  .env.local: da luu AUTH_GITHUB_ID va AUTH_GITHUB_SECRET" -ForegroundColor Green
}

Write-Host ""
Write-Host "Xong. Quay lai cuoc tro chuyen va nhan 'xong' de deploy lai." -ForegroundColor Cyan
