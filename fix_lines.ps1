$filePath = "c:\Users\aaccd\Downloads\ux\myeongsim-report\src\components\coaching\GeniusFullReportModal.tsx"
$lines = Get-Content $filePath
$newLines = @()
for ($i = 0; $i -lt $lines.Length; $i++) {
    # Lines 401-423 are 0-indexed 400-422
    if ($i -ge 400 -and $i -le 422) {
        continue
    }
    $newLines += $lines[$i]
}
$newLines | Set-Content $filePath -Encoding UTF8
Write-Host "Done. Removed lines 401-423. New line count: $($newLines.Length)"
