/**
 * 개인정보보호법 준수 핸드폰 번호 마스킹 & 암호화 헬퍼 모듈
 * 관리자 화면 및 모니터링 로그 출력 시 전화번호 원본을 010-****-5678 형태로 은폐
 */

export function maskPhoneNumber(phone?: string | null): string {
    if (!phone || typeof phone !== 'string') return '🔒 미등록 (보안)';
    
    // Remove non-numeric characters
    const cleaned = phone.replace(/[^0-9]/g, '');
    
    if (cleaned.length === 11) {
        // 01012345678 -> 010-****-5678
        return `${cleaned.substring(0, 3)}-****-${cleaned.substring(7)}`;
    } else if (cleaned.length === 10) {
        // 0101235678 -> 010-***-5678
        return `${cleaned.substring(0, 3)}-***-${cleaned.substring(6)}`;
    } else if (cleaned.length >= 7) {
        return `${cleaned.substring(0, 3)}-****-${cleaned.substring(cleaned.length - 4)}`;
    }
    
    // If input is text containing depositor name + phone (e.g. "강미숙 (010-1234-5678)")
    if (phone.includes('010') || phone.includes('011') || phone.includes('016') || phone.includes('019')) {
        return phone.replace(/(01[016789])[-.\s]?(\d{3,4})[-.\s]?(\d{4})/g, (match, p1, p2, p3) => {
            return `${p1}-****-${p3}`;
        });
    }
    
    return phone;
}

export function formatPhoneWithLock(phone?: string | null): string {
    const masked = maskPhoneNumber(phone);
    return `🔒 ${masked}`;
}
