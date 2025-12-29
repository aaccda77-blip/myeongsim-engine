$Server = "ubuntu@139.150.81.122"
$KeyFile = "gabia_key.pem"

Write-Host "=========================================="
Write-Host "   Myeongsim Coaching - Password Deploy   "
Write-Host "=========================================="
Write-Host "Tip: Password is '4@qXbWli'"
Write-Host ""
Write-Host "[Step 1] Stream-Uploading deploy.tar.gz via SSH..."

# Using scp without batch mode to allow password input if key fails
scp -o StrictHostKeyChecking=no -i $KeyFile -q deploy.tar.gz ${Server}:~/deploy.tar.gz

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ SCP Failed (Key rejected?). Trying fallback (SSH Pipe) with Password..."
    # The pipe method is tricky with interactive password. 
    # Better to rely on SCP asking for password if key fails.
    # But if SCP failed due to 'Message too long' (not auth), we need the pipe.
    
    # We will try the pipe command purely, expecting it to prompt for password if key fails.
    cmd.exe /c "type deploy.tar.gz | ssh -o StrictHostKeyChecking=no -i $KeyFile $Server ""cat > deploy.tar.gz"""
}

Write-Host "✅ Upload Complete!"
Write-Host ""
Write-Host "[Step 2] Executing Remote Commands..."

ssh -o StrictHostKeyChecking=no -i $KeyFile $Server "sudo tar -xzvf deploy.tar.gz && sudo npm install --production && sudo npm run build && sudo pm2 restart all || sudo npm start"


