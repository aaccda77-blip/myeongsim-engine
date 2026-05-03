const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'coaching', 'DailyBioSyncPanel.tsx');
const backupPath = filePath + '.bak';

console.log('🔍 파일 인코딩 검사 및 복구 시작...');

try {
    const buffer = fs.readFileSync(filePath);
    
    // 백업 생성
    fs.writeFileSync(backupPath, buffer);
    console.log('✅ 백업 파일 생성 완료:', backupPath);

    // utf8로 디코딩 (깨진 문자는  로 변환됨)
    const decodedString = buffer.toString('utf8');
    
    if (decodedString.includes('\ufffd')) {
        console.log('⚠️ 유효하지 않은 UTF-8 문자가 발견되었습니다. (해당 부분은  로 대체되었습니다)');
        
        const lines = decodedString.split(/\r?\n/);
        lines.forEach((line, index) => {
            if (line.includes('\ufffd')) {
                console.log(`\n▶ [${index + 1}번째 줄 주변 확인]:`);
                console.log(line.trim());
            }
        });
        
        // 올바른 utf8 포맷으로 다시 덮어쓰기
        fs.writeFileSync(filePath, decodedString, 'utf8');
        console.log('\n✅ 파일 인코딩이 UTF-8로 성공적으로 수정되었습니다.');
        console.log('💡 안내: 코드 내에 "" 기호가 있는 부분을 찾아 원래 어떤 글자였는지 확인 후 수정해주세요.');
    } else {
         console.log('✅ 유효하지 않은 문자를 찾을 수 없습니다. (이미 정상적인 UTF-8일 수 있습니다)');
    }
} catch (error) {
    console.error('❌ 스크립트 실행 중 오류:', error);
}
