import { ReportData } from '@/types/report';
import { getTagsBySaju } from '@/data/Saju3SScenarios';

// 지지 충(沖) 관계 정의
const ZHI_CHUNG_MAP: Record<string, string> = {
    '子': '午', '午': '子',
    '丑': '未', '未': '丑',
    '寅': '申', '申': '寅',
    '卯': '酉', '酉': '卯',
    '辰': '戌', '戌': '辰',
    '巳': '亥', '亥': '巳',
    '자': '오', '오': '자',
    '축': '미', '미': '축',
    '인': '신', '신': '인',
    '묘': '유', '유': '묘',
    '진': '술', '술': '진',
    '사': '해', '해': '사'
};

// 지지 형(刑) 관계 정의 (대표적인 삼형 및 자형)
const ZHI_HYUNG_MAP: Record<string, string[]> = {
    '寅': ['巳', '申'],
    '巳': ['寅', '申'],
    '申': ['寅', '巳'],
    '丑': ['戌', '未'],
    '戌': ['丑', '未'],
    '未': ['丑', '戌'],
    '子': ['卯'],
    '卯': ['子'],
    '辰': ['辰'],
    '午': ['午'],
    '酉': ['酉'],
    '亥': ['亥'],
    '인': ['사', '신'],
    '사': ['인', '신'],
    '신': ['인', '사'],
    '축': ['술', '미'],
    '술': ['축', '미'],
    '미': ['축', '술'],
    '자': ['묘'],
    '묘': ['자'],
    '진': ['진'],
    '오': ['오'],
    '유': ['유'],
    '해': ['해']
};

// 태그명에 따른 인지왜곡 키워드 매핑
const TAG_COGNITIVE_MAP: Record<string, string[]> = {
    '#자기검열_루프(Self-Censoring)': ['자기검열', '검열', 'Censoring'],
    '#미세결함_과각성(Hyper-Vigilance)': ['미세결함', '과각성', 'Vigilance', '결함'],
    '#인지적_마비(Analysis Paralysis)': ['인지적 마비', '마비', 'Paralysis', '분석마비'],
    '#통제불안_방어기제(Defense Mechanism)': ['통제불안', '방어기제', '통제', 'Defense'],
    '#타인평가_융합(Cognitive Fusion)': ['타인평가', '융합', '평가', 'Fusion'],
    '#완벽주의_도파민_고갈': ['완벽주의', '도파민', '완벽', '고갈'],
    '#신경증적_기준선(Baseline Anxiety)': ['신경증적', '불안', 'Anxiety', '신경증'],
    '#감정_단열막(Emotional Insulation)': ['감정 단열막', '단열막', '감정단열', 'Insulation'],
    '#흑백논리_인지왜곡': ['흑백논리', '이분법', '흑백', '이분법적'],
    '#투사적_비판(Projection)': ['투사적 비판', '투사', '비판', 'Projection'],
    
    '#성장강박_오류(Growth Fixation)': ['성장강박', '강박', '성장', 'Fixation'],
    '#고립_방어기제(Isolation Defense)': ['고립', '외로움', 'Isolation'],
    '#완벽주의_데드락(Deadlock)': ['완벽주의', '데드락', 'Deadlock'],
    '#추락_과각성(Fall Anxiety)': ['추락', '불안', 'Anxiety'],
    '#우월성_분리(Superiority Detachment)': ['우월성', '분리', 'Detachment'],
    '#책임감_과부하(Responsibility Overload)': ['책임감', '과부하', '책임', 'Overload'],
    '#속도_동기화_실패(Desynchronization)': ['속도', '동기화', '초조함'],
    '#경직된_절대방위(Rigid Defenses)': ['경직', '방위', 'Rigid'],
    '#한방강박_인지왜곡(All-or-Nothing)': ['한방강박', '흑백논리', 'All-or-Nothing'],
    '#리더십_소외(Leadership Alienation)': ['리더십', '소외', 'Alienation'],
    
    '#과적응_증후군(Over-Adaptation)': ['과적응', '적응', 'Adaptation'],
    '#경계선_침범(Boundary Violation)': ['경계선', '침범', 'Boundary'],
    '#자아고갈_번아웃(Ego Depletion)': ['번아웃', '고갈', 'Depletion'],
    '#감정적_전염(Emotional Contagion)': ['감정적 전염', '전염', 'Contagion'],
    '#회복강박_피로(Resilience Fatigue)': ['회복강박', '피로', 'Resilience'],
    '#타인기대_투사(Projected Expectation)': ['타인기대', '투사', 'Expectation'],
    '#가면_우울증(Masked Depression)': ['가면', '우울증', 'Depression'],
    '#과잉생존_지능(Hyper-Survival)': ['과잉생존', '생존', 'Survival'],
    '#은밀한_의존성(Covert Dependency)': ['의존성', '의존', 'Dependency'],
    '#자아정체성_방황(Identity Diffusion)': ['자아정체성', '방황', 'Identity']
};

/**
 * 사주 8자 + 오늘 일진 + 심리 리포트를 융합하여 실시간으로 가장 적합한 2개 태그를 선정합니다.
 */
export function calculateDynamicCoachingTags(
    reportData: ReportData | null,
    todayPillar: { gan: string; zhi: string; ganElement: string; zhiElement: string }
): string[] {
    if (!reportData) {
        console.warn("⚠️ [Scorer] reportData가 없어 기본 태그를 반환합니다.");
        return [];
    }

    // 1. 일간(Day Master) 추출
    let dayMasterRaw = reportData.saju?.dayMaster || '';
    const STEM_KOR_TO_HANJA: Record<string, string> = {
        '갑': '甲', '을': '乙', '병': '丙', '정': '丁', '무': '戊',
        '기': '己', '경': '庚', '신': '辛', '임': '壬', '계': '癸'
    };
    
    let finalHanja = '';
    const hanjaMatch = dayMasterRaw.toString().match(/[甲乙丙丁戊己庚辛壬癸]/);
    if (hanjaMatch) {
        finalHanja = hanjaMatch[0];
    } else {
        const korMatch = dayMasterRaw.toString().match(/[갑을병정무기경신임계]/);
        if (korMatch) finalHanja = STEM_KOR_TO_HANJA[korMatch[0]];
    }

    if (!finalHanja) {
        console.warn("⚠️ [Scorer] 일간 감지 실패. 기본 2개 태그 반환.");
        return [];
    }

    // 일간 기준 10개 태그 후보군 가져오기
    const allTags = getTagsBySaju(finalHanja);
    if (!allTags || allTags.length === 0) return [];

    // 태그별 가중치 스코어 맵 생성
    const scores: Record<string, number> = {};
    allTags.forEach(tag => {
        scores[tag] = 50; // 기본 점수 50점 세팅
    });

    // ────────── [차원 1] 사주 8자 원국 오행 분석 (가중치 30%) ──────────
    const ohaeng = reportData.saju?.ohaeng || reportData.saju?.elements;
    if (ohaeng) {
        // 내 사주에 과다한 오행 (비율이 높음)
        const total = (ohaeng.wood || 0) + (ohaeng.fire || 0) + (ohaeng.earth || 0) + (ohaeng.metal || 0) + (ohaeng.water || 0) || 1;
        const metalRatio = (ohaeng.metal || 0) / total;
        const fireRatio = (ohaeng.fire || 0) / total;
        const woodRatio = (ohaeng.wood || 0) / total;
        const waterRatio = (ohaeng.water || 0) / total;
        const earthRatio = (ohaeng.earth || 0) / total;

        // 예: 신금(辛金) 일간이면서 사주에 금(Metal)이 과다(30% 이상)한 경우 -> 완벽주의, 자기검열 가중치 추가
        if (metalRatio > 0.3) {
            allTags.forEach(tag => {
                if (tag.includes('완벽주의') || tag.includes('자기검열') || tag.includes('통제') || tag.includes('경직')) {
                    scores[tag] += 15;
                }
            });
        }

        // 예: 화(Fire) 기운이 과다(30% 이상)인 경우 -> 발산형 번아웃, 과열, 충동 관련 가중치 추가
        if (fireRatio > 0.3) {
            allTags.forEach(tag => {
                if (tag.includes('번아웃') || tag.includes('충동') || tag.includes('과열') || tag.includes('아드레날린')) {
                    scores[tag] += 15;
                }
            });
        }

        // 특정 기운이 아예 고갈된 경우 (예: 수(Water)가 0인 경우 -> 감정 단열, 고립, 마비 경향)
        if (waterRatio === 0) {
            allTags.forEach(tag => {
                if (tag.includes('단열막') || tag.includes('고립') || tag.includes('마비')) {
                    scores[tag] += 15;
                }
            });
        }
    }

    // ────────── [차원 2] 일진(오늘의 기운) 충/형/오행 분석 (가중치 30%) ──────────
    const todayZhi = todayPillar.zhi; // 오늘 지지 (한자/한글)
    const fp = reportData.saju?.fourPillars;
    if (fp && todayZhi) {
        // 내 사주 원국의 지지들 (년지, 월지, 일지, 시지)
        const userZhis = [
            fp.year?.ji,
            fp.month?.ji,
            fp.day?.ji,
            fp.time?.ji
        ].filter(Boolean) as string[];

        let hasConflict = false;
        userZhis.forEach(userZhi => {
            // 1) 지지 충(沖) 감지
            if (ZHI_CHUNG_MAP[userZhi] === todayZhi || ZHI_CHUNG_MAP[todayZhi] === userZhi) {
                hasConflict = true;
            }
            // 2) 지지 형(刑) 감지
            if (ZHI_HYUNG_MAP[userZhi]?.includes(todayZhi) || ZHI_HYUNG_MAP[todayZhi]?.includes(userZhi)) {
                hasConflict = true;
            }
        });

        // 오늘 내 지지와 충/형이 일어나는 경우 -> 불안/신경증/스트레스성 태그 가중치 증폭
        if (hasConflict) {
            console.log(`⚡ [Scorer] 오늘 일진 지지(${todayZhi})와 내 사주 원국 지지 간 충/형 감지! 불안 텐션 스코어 가산.`);
            allTags.forEach(tag => {
                if (tag.includes('신경증적') || tag.includes('과각성') || tag.includes('불안') || tag.includes('방어기제')) {
                    scores[tag] += 20;
                }
            });
        }

        // 오늘 들어오는 일진 천간 오행이 내 사주에 극(剋)을 하는 기운인 경우 (관성/압박)
        if (finalHanja === '辛' && (todayPillar.gan === '丙' || todayPillar.gan === '丁' || todayPillar.gan === '병' || todayPillar.gan === '정')) {
            allTags.forEach(tag => {
                if (tag.includes('타인평가') || tag.includes('기준선') || tag.includes('통제')) {
                    scores[tag] += 10;
                }
            });
        }
    }

    // ────────── [차원 3] 심리 리포트 인지왜곡 패턴 매칭 (가중치 40%) ──────────
    const distortions = reportData.psychology?.cognitiveDistortions || [];
    const shadowTitle = reportData.psychology?.shadowTitle || '';
    const shadowDesc = reportData.psychology?.shadowDescription || '';
    
    // 매치할 텍스트 덩어리 병합
    const psychTextContext = [
        ...distortions,
        shadowTitle,
        shadowDesc
    ].join(' ').toLowerCase();

    allTags.forEach(tag => {
        const matchKeywords = TAG_COGNITIVE_MAP[tag];
        if (matchKeywords) {
            let matchCount = 0;
            matchKeywords.forEach(kw => {
                if (psychTextContext.includes(kw.toLowerCase())) {
                    matchCount++;
                }
            });
            // 겹치는 심리 키워드가 있을 경우 점수 추가 (개수당 15점 가산, 최대 30점)
            if (matchCount > 0) {
                scores[tag] += Math.min(30, matchCount * 15);
            }
        }
    });

    // 5. 점수 기준 내림차순 정렬하여 상위 2개 태그 추출
    const sortedTags = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    const finalTags = sortedTags.slice(0, 2);

    console.log("🎯 [Scorer Realtime] 다차원 스코어 결과:", scores);
    console.log("🚀 [Scorer Realtime] 선정된 탑 2 태그:", finalTags);

    return finalTags;
}
