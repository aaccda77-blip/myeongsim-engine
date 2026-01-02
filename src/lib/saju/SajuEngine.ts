/**
 * SajuEngine.ts - 통합 만세력 계산 엔진 (v2.0)
 * 
 * 목적: 사주팔자(四柱八字) 계산의 단일 소스 오브 트루스
 * 특징:
 *  - 양력/음력 완벽 지원
 *  - 클라이언트/서버 양쪽에서 사용 가능
 *  - 견고한 에러 핸들링
 *  - 명확한 타입 정의
 */

import { Solar, Lunar } from 'lunar-javascript';

// ============== 타입 정의 ==============
export interface SajuPillar {
    gan: string;        // 천간 (한자)
    ji: string;         // 지지 (한자)
    ganKor: string;     // 천간 (한글)
    jiKor: string;      // 지지 (한글)
    ganElement: string; // 오행
    jiElement: string;  // 오행
    ganColor: string;   // 색상코드
    jiColor: string;    // 색상코드
}

export interface FourPillars {
    year: SajuPillar;
    month: SajuPillar;
    day: SajuPillar;
    time: SajuPillar;
}

export interface SajuResult {
    success: boolean;
    error?: string;
    fourPillars: FourPillars;
    dayMaster: string;          // 일간 (한글, 예: "경금")
    dayMasterChar: string;      // 일간 한자
    currentDaewoon?: string;    // 현재 대운
    currentSeun?: string;       // 현재 세운
    inputInfo: {
        birthDate: string;
        birthTime: string;
        calendarType: 'solar' | 'lunar';
        gender: 'male' | 'female';
    };
}

// ============== 매핑 테이블 ==============
const GAN_DATA: Record<string, { kor: string; element: string; color: string }> = {
    '甲': { kor: '갑', element: '목', color: '#10B981' },
    '乙': { kor: '을', element: '목', color: '#10B981' },
    '丙': { kor: '병', element: '화', color: '#EF4444' },
    '丁': { kor: '정', element: '화', color: '#EF4444' },
    '戊': { kor: '무', element: '토', color: '#F59E0B' },
    '己': { kor: '기', element: '토', color: '#F59E0B' },
    '庚': { kor: '경', element: '금', color: '#9CA3AF' },
    '辛': { kor: '신', element: '금', color: '#9CA3AF' },
    '壬': { kor: '임', element: '수', color: '#3B82F6' },
    '癸': { kor: '계', element: '수', color: '#3B82F6' },
};

const JI_DATA: Record<string, { kor: string; element: string; color: string; animal: string }> = {
    '子': { kor: '자', element: '수', color: '#3B82F6', animal: '쥐' },
    '丑': { kor: '축', element: '토', color: '#F59E0B', animal: '소' },
    '寅': { kor: '인', element: '목', color: '#10B981', animal: '호랑이' },
    '卯': { kor: '묘', element: '목', color: '#10B981', animal: '토끼' },
    '辰': { kor: '진', element: '토', color: '#F59E0B', animal: '용' },
    '巳': { kor: '사', element: '화', color: '#EF4444', animal: '뱀' },
    '午': { kor: '오', element: '화', color: '#EF4444', animal: '말' },
    '未': { kor: '미', element: '토', color: '#F59E0B', animal: '양' },
    '申': { kor: '신', element: '금', color: '#9CA3AF', animal: '원숭이' },
    '酉': { kor: '유', element: '금', color: '#9CA3AF', animal: '닭' },
    '戌': { kor: '술', element: '토', color: '#F59E0B', animal: '개' },
    '亥': { kor: '해', element: '수', color: '#3B82F6', animal: '돼지' },
};

// ============== 헬퍼 함수 ==============
function createPillar(ganChar: string, jiChar: string): SajuPillar {
    const ganInfo = GAN_DATA[ganChar] || { kor: '?', element: '?', color: '#888' };
    const jiInfo = JI_DATA[jiChar] || { kor: '?', element: '?', color: '#888' };

    return {
        gan: ganChar,
        ji: jiChar,
        ganKor: ganInfo.kor,
        jiKor: jiInfo.kor,
        ganElement: ganInfo.element,
        jiElement: jiInfo.element,
        ganColor: ganInfo.color,
        jiColor: jiInfo.color,
    };
}

function parseDate(dateStr: string): { year: number; month: number; day: number } | null {
    if (!dateStr || typeof dateStr !== 'string') return null;

    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
    if (year < 1900 || year > 2100) return null;
    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;

    return { year, month, day };
}

function parseTime(timeStr: string): { hour: number; minute: number } {
    if (!timeStr || timeStr === 'unknown') {
        return { hour: 12, minute: 0 }; // 기본값: 정오
    }

    const parts = timeStr.split(':');
    if (parts.length >= 2) {
        const hour = parseInt(parts[0], 10);
        const minute = parseInt(parts[1], 10);
        if (!isNaN(hour) && !isNaN(minute)) {
            return { hour: Math.min(23, Math.max(0, hour)), minute: Math.min(59, Math.max(0, minute)) };
        }
    }

    return { hour: 12, minute: 0 };
}

// ============== 메인 계산 함수 ==============
export function calculateSaju(
    birthDate: string,
    birthTime: string = '12:00',
    calendarType: 'solar' | 'lunar' = 'solar',
    gender: 'male' | 'female' = 'male'
): SajuResult {
    // 1. 입력 검증
    const dateInfo = parseDate(birthDate);
    if (!dateInfo) {
        return {
            success: false,
            error: `잘못된 날짜 형식: ${birthDate}. 'YYYY-MM-DD' 형식이 필요합니다.`,
            fourPillars: createEmptyPillars(),
            dayMaster: '오류',
            dayMasterChar: '?',
            inputInfo: { birthDate, birthTime, calendarType, gender },
        };
    }

    const timeInfo = parseTime(birthTime);

    try {
        // 2. 음력/양력에 따른 Lunar 객체 생성
        let lunar: Lunar;

        if (calendarType === 'lunar') {
            // 음력 입력: 직접 Lunar 생성
            lunar = Lunar.fromYmdHms(
                dateInfo.year,
                dateInfo.month,
                dateInfo.day,
                timeInfo.hour,
                timeInfo.minute,
                0
            );
        } else {
            // 양력 입력: Solar → Lunar 변환
            const solar = Solar.fromYmdHms(
                dateInfo.year,
                dateInfo.month,
                dateInfo.day,
                timeInfo.hour,
                timeInfo.minute,
                0
            );
            lunar = solar.getLunar();
        }

        // 3. 팔자(八字) 추출
        const bazi = lunar.getEightChar();

        const yearGan = bazi.getYearGan();
        const yearJi = bazi.getYearZhi();
        const monthGan = bazi.getMonthGan();
        const monthJi = bazi.getMonthZhi();
        const dayGan = bazi.getDayGan();
        const dayJi = bazi.getDayZhi();
        const timeGan = bazi.getTimeGan();
        const timeJi = bazi.getTimeZhi();

        // 4. 사주 구성
        const fourPillars: FourPillars = {
            year: createPillar(yearGan, yearJi),
            month: createPillar(monthGan, monthJi),
            day: createPillar(dayGan, dayJi),
            time: createPillar(timeGan, timeJi),
        };

        // 5. 일간 정보
        const dayMasterInfo = GAN_DATA[dayGan] || { kor: '?', element: '?' };
        const dayMaster = `${dayMasterInfo.kor}${dayMasterInfo.element}`;

        // 6. 대운/세운 (선택적)
        let currentDaewoon: string | undefined;
        let currentSeun: string | undefined;

        try {
            const genderNum = gender === 'male' ? 1 : 0;
            const yun = (bazi as any).getYun(genderNum);
            const daewoonList = yun.getDaYun();
            const currentYear = new Date().getFullYear();

            for (const dy of daewoonList) {
                if (dy.getStartYear() <= currentYear) {
                    currentDaewoon = `${dy.getGanZhi()} 대운`;
                }
            }

            // 세운
            const now = new Date();
            const currentSolar = Solar.fromYmdHms(now.getFullYear(), now.getMonth() + 1, now.getDate(), 12, 0, 0);
            const currentBazi = currentSolar.getLunar().getEightChar();
            currentSeun = `${currentBazi.getYearGan()}${currentBazi.getYearZhi()}`;
        } catch (e) {
            console.warn('대운/세운 계산 실패:', e);
        }

        return {
            success: true,
            fourPillars,
            dayMaster,
            dayMasterChar: dayGan,
            currentDaewoon,
            currentSeun,
            inputInfo: { birthDate, birthTime, calendarType, gender },
        };

    } catch (error: any) {
        console.error('사주 계산 오류:', error);
        return {
            success: false,
            error: `계산 중 오류 발생: ${error.message || '알 수 없는 오류'}`,
            fourPillars: createEmptyPillars(),
            dayMaster: '오류',
            dayMasterChar: '?',
            inputInfo: { birthDate, birthTime, calendarType, gender },
        };
    }
}

// 빈 사주 생성 (오류 시)
function createEmptyPillars(): FourPillars {
    const emptyPillar: SajuPillar = {
        gan: '?', ji: '?', ganKor: '?', jiKor: '?',
        ganElement: '?', jiElement: '?', ganColor: '#888', jiColor: '#888',
    };
    return { year: { ...emptyPillar }, month: { ...emptyPillar }, day: { ...emptyPillar }, time: { ...emptyPillar } };
}

// ============== 유틸리티 함수 ==============

/**
 * 사주 정보를 사람이 읽기 쉬운 문자열로 변환
 */
export function formatSajuForDisplay(result: SajuResult): string {
    if (!result.success) return `오류: ${result.error}`;

    const p = result.fourPillars;
    return `
[사주 명식]
년주: ${p.year.gan}${p.year.ji} (${p.year.ganKor}${p.year.jiKor})
월주: ${p.month.gan}${p.month.ji} (${p.month.ganKor}${p.month.jiKor})
일주: ${p.day.gan}${p.day.ji} (${p.day.ganKor}${p.day.jiKor}) ← 본인
시주: ${p.time.gan}${p.time.ji} (${p.time.ganKor}${p.time.jiKor})

일간(Day Master): ${result.dayMaster}
대운: ${result.currentDaewoon || '정보 없음'}
`.trim();
}

/**
 * AI 프롬프트용 사주 정보 블록 생성
 */
export function generateSajuPromptBlock(result: SajuResult): string {
    if (!result.success) return `[사주 계산 오류: ${result.error}]`;

    const p = result.fourPillars;
    const info = result.inputInfo;

    return `
:::SAJU_DATA_TRUTH:::
## 사용자 사주 정보 (정확한 데이터)
- **생일**: ${info.birthDate} (${info.calendarType === 'lunar' ? '음력' : '양력'})
- **시간**: ${info.birthTime}
- **성별**: ${info.gender === 'male' ? '남성' : '여성'}

## 사주팔자 (四柱八字)
| 기둥 | 한자 | 한글 | 설명 |
|------|------|------|------|
| 년주 (Year) | ${p.year.gan}${p.year.ji} | ${p.year.ganKor}${p.year.jiKor} | 조상, 사회적 환경 |
| 월주 (Month) | ${p.month.gan}${p.month.ji} | ${p.month.ganKor}${p.month.jiKor} | 부모, 성장 환경 |
| **일주 (Day)** | **${p.day.gan}${p.day.ji}** | **${p.day.ganKor}${p.day.jiKor}** | **본인 (가장 중요)** 🌟 |
| 시주 (Time) | ${p.time.gan}${p.time.ji} | ${p.time.ganKor}${p.time.jiKor} | 자녀, 말년 운 |

## 핵심 정보
- **일간 (Day Master)**: ${result.dayMaster} (${result.dayMasterChar})
- 현재 대운: ${result.currentDaewoon || '정보 없음'}
- 현재 세운: ${result.currentSeun || '정보 없음'}

> ⚠️ **주의**: 년주(${p.year.ganKor}${p.year.jiKor})와 일주(${p.day.ganKor}${p.day.jiKor})를 혼동하지 마세요!
:::END_SAJU_DATA:::
`.trim();
}
