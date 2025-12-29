$ErrorActionPreference = "Stop"

$PemKey = ".\gabia_key.pem"
$Server = "ubuntu@139.150.81.122"
$RemoteDir = "/home/ubuntu"
$AppName = "myeongsim"

Write-Host "=========================================="
Write-Host "   Myeongsim Deployment (Auto-Setup)"
Write-Host "=========================================="

# 1. Compress
Write-Host "[Step 1] Compressing project files..."
if (Test-Path deploy.tar.gz) { Remove-Item deploy.tar.gz }
tar --exclude='node_modules' --exclude='.next' --exclude='.git' --exclude='deploy.tar.gz' -czf deploy.tar.gz .
if (-not (Test-Path deploy.tar.gz)) {
    Write-Error "Failed to create deploy.tar.gz"
    exit 1
}

# 2. Upload
Write-Host "[Step 2] Uploading to Server ($Server)..."
scp -i $PemKey -o StrictHostKeyChecking=no deploy.tar.gz "${Server}:${RemoteDir}/deploy.tar.gz"

# 3. Remote Execution
Write-Host "[Step 3] Configuring Remote Server & Deploying..."
$RemoteScriptBlock = @"
set -e

echo '--- Updating System ---'
export DEBIAN_FRONTEND=noninteractive
sudo apt-get update -y

echo '--- Checking/Installing Node.js 20 ---'
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo 'Node.js already installed.'
fi

echo '--- Installing PM2 ---'
sudo npm install -g pm2

echo '--- Deploying App ---'


echo '--- Preparing Application ---'
mkdir -p $RemoteDir/$AppName
sudo tar -xzf $RemoteDir/deploy.tar.gz -C $RemoteDir/$AppName --no-same-owner
sudo chown -R ubuntu:ubuntu $RemoteDir/$AppName
cd $RemoteDir/$AppName

# [Fix] Remove conflicting files from previous failed builds
rm -f reproduce_saju.ts reproduce_saju.js

echo '--- Installing Nginx ---'
if ! command -v nginx &> /dev/null; then
    sudo apt-get install -y nginx
fi

echo '--- Configuring Nginx ---'
# Copy nginx config from app dir to sites-available
sudo cp $RemoteDir/$AppName/myeongsim.nginx /etc/nginx/sites-available/myeongsim
# Link logic
if [ ! -f /etc/nginx/sites-enabled/myeongsim ]; then
    sudo ln -s /etc/nginx/sites-available/myeongsim /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
fi
# Test and Reload
sudo nginx -t
sudo systemctl reload nginx

echo '--- Configuring Firewall ---'
sudo ufw allow 80
sudo ufw allow 443
# sudo ufw allow 3000 # Optional, close if not needed externally
# sudo ufw --force enable # Be careful not to lock out SSH

# Remove old modules if package.json changed drastically, but usually update is fine
# rm -rf node_modules 

echo '--- Installing Dependencies ---'
npm install

echo '--- Building Next.js App ---'
npm run build

echo '--- Starting with PM2 ---'
pm2 delete $AppName 2> /dev/null || true
pm2 start npm --name "$AppName" -- start -- -p 3000
pm2 save
"@

# Encode script to prevent CRLF issues
$Bytes = [System.Text.Encoding]::UTF8.GetBytes($RemoteScriptBlock)
$EncodedScript = [Convert]::ToBase64String($Bytes)

# Execute via SSH (Decode & Run)
Write-Host "[Step 3] Executing Remote Script..."
ssh -i $PemKey -o StrictHostKeyChecking=no $Server "echo '$EncodedScript' | base64 -d | tr -d '\r' | bash"

Write-Host "=========================================="
Write-Host "   ✅ Deployment Complete!"
Write-Host "   URL: http://139.150.81.122:3000"
Write-Host "=========================================="
