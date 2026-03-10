import re

file_path = r'c:\Users\aaccd\Downloads\ux\myeongsim-report\src\components\chat\ChatInterface.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace meditation
meditation_pattern = re.compile(r'handleSend\("🧘 \*\*\[생체 리듬 명상 시작\].*?"\);', re.DOTALL)
content = meditation_pattern.sub(r"handleSend(t('intents.bio_rhythm_meditation'));", content)

# Replace patent 1
patent1_pattern = re.compile(r'handleSend\("🧬 \*\*\[뉴로-사주 공명 분석\].*?"\);', re.DOTALL)
content = patent1_pattern.sub(r"handleSend(t('intents.patent_1'));", content)

# Replace patent 2
patent2_pattern = re.compile(r'handleSend\("🕵️ \*\*\[무의식 진실 탐지기\].*?"\);', re.DOTALL)
content = patent2_pattern.sub(r"handleSend(t('intents.patent_2'));", content)

# Replace quit_smoking_act block
smoking_pattern = re.compile(r'if \(intent === \'quit_smoking_act\'\) \{.*?handleSend\(actMsg\);\s+return;\s+\}', re.DOTALL)
content = smoking_pattern.sub(r"if (intent === 'quit_smoking_act') {\n                                    handleSend(t('intents.quit_smoking'));\n                                    return;\n                                }", content)

# Replace quit_drinking_cbt block
drinking_pattern = re.compile(r'if \(intent === \'quit_drinking_cbt\'\) \{.*?handleSend\(cbtMsg\);\s+return;\s+\}', re.DOTALL)
content = drinking_pattern.sub(r"if (intent === 'quit_drinking_cbt') {\n                                    handleSend(t('intents.quit_drinking'));\n                                    return;\n                                }", content)

# Replace addiction_escape_dbt block
addiction_pattern = re.compile(r'if \(intent === \'addiction_escape_dbt\'\) \{.*?handleSend\(dbtMsg\);\s+return;\s+\}', re.DOTALL)
content = addiction_pattern.sub(r"if (intent === 'addiction_escape_dbt') {\n                                    handleSend(t('intents.addiction_escape'));\n                                    return;\n                                }", content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully replaced hardcoded strings in ChatInterface.tsx")
