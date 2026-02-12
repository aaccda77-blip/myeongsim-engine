$filePath = "c:\Users\aaccd\Downloads\ux\myeongsim-report\src\components\chat\ChatInterface.tsx"
$content = Get-Content -Path $filePath -Raw

# Replace meditation
$meditationRegex = 'handleSend\("🧘 \*\*\[생체 리듬 명상 시작\].*?"\);'
$content = [regex]::Replace($content, $meditationRegex, "handleSend(t('intents.bio_rhythm_meditation'));", [System.Text.RegularExpressions.RegexOptions]::Singleline)

# Replace patent 1
$patent1Regex = 'handleSend\("🧬 \*\*\[뉴로-사주 공명 분석\].*?"\);'
$content = [regex]::Replace($content, $patent1Regex, "handleSend(t('intents.patent_1'));", [System.Text.RegularExpressions.RegexOptions]::Singleline)

# Replace patent 2
$patent2Regex = 'handleSend\("🕵️ \*\*\[무의식 진실 탐지기\].*?"\);'
$content = [regex]::Replace($content, $patent2Regex, "handleSend(t('intents.patent_2'));", [System.Text.RegularExpressions.RegexOptions]::Singleline)

# Replace quit_smoking_act block (more specific)
$smokingRegex = 'if \(intent === ''quit_smoking_act''\) \{.*?handleSend\(actMsg\);\s+return;\s+\}'
$content = [regex]::Replace($content, $smokingRegex, "if (intent === 'quit_smoking_act') {`n                                    handleSend(t('intents.quit_smoking'));`n                                    return;`n                                }", [System.Text.RegularExpressions.RegexOptions]::Singleline)

# Replace quit_drinking_cbt block
$drinkingRegex = 'if \(intent === ''quit_drinking_cbt''\) \{.*?handleSend\(cbtMsg\);\s+return;\s+\}'
$content = [regex]::Replace($content, $drinkingRegex, "if (intent === 'quit_drinking_cbt') {`n                                    handleSend(t('intents.quit_drinking'));`n                                    return;`n                                }", [System.Text.RegularExpressions.RegexOptions]::Singleline)

# Replace addiction_escape_dbt block
$addictionRegex = 'if \(intent === ''addiction_escape_dbt''\) \{.*?handleSend\(dbtMsg\);\s+return;\s+\}'
$content = [regex]::Replace($content, $addictionRegex, "if (intent === 'addiction_escape_dbt') {`n                                    handleSend(t('intents.addiction_escape'));`n                                    return;`n                                }", [System.Text.RegularExpressions.RegexOptions]::Singleline)

[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
Write-Output "Successfully replaced hardcoded strings in ChatInterface.tsx"
