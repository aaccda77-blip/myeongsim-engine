/**
 * SmartAiSimulationEngine.ts
 * 
 * [모듈식 전역 스마트 AI 시뮬레이션 엔진]
 * 
 * 제미나이(Gemini 2.5 Flash) API를 직접 구동시키지 않고도,
 * 1. 사용자의 실제 생년월일/시간을 바탕으로 정확한 사주팔자(천간·지지)와 일간(10간)을 정밀 계산합니다.
 * 2. 10대 일간(甲·乙·丙·丁·戊·己·庚·辛·壬·癸) 고유의 기질과 2026년 병오년(丙午年) 세운의 오행 상호작용을 1:1로 매칭합니다.
 * 3. 챗봇의 2단계 템플릿(따뜻한 마음 언어 정제 + 명쾌한 1초 결론 및 현실적 대안)과 3S 감동 에세이를 100% 개인화하여 즉시 생성합니다.
 * 4. Vercel AI SDK 호환 ReadableStream을 통해 실제 AI처럼 자연스럽게 타이핑되는 스트리밍 경험을 선사합니다.
 */

import { Solar, Lunar } from 'lunar-javascript';
import { Q38_CHATGPT_VS_MYEONGSIM } from '@/modules/MyeongsimAiPhilosophyModule';

export interface UserContextData {
    userName?: string;
    birthDate?: string;
    birthTime?: string;
    calendarType?: string;
    gender?: string;
    dayMaster?: string;
    energyLevel?: string | number;
    sleepQuality?: string | number;
    stressFactors?: string[] | string;
    mbti?: string;
    enneagram?: string;
    disc?: string;
    big5?: string;
}

// 10대 일간별 정밀 사주 특성 및 2026 병오년(丙午年) 세운 매트릭스
interface DayMasterProfile {
    element: string;
    natureName: string;
    keyword: string;
    coreTalent: string;
    darkCode: string;
    syncPrescription: string;
    shiftPower: string;
    byeongoFortune2026: string;
    bestTime: string;
}

const DAY_MASTER_PROFILES: Record<string, DayMasterProfile> = {
    '甲': {
        element: '양목(陽木)',
        natureName: '푸른 거목(소나무)',
        keyword: '개척과 당당한 추진력',
        coreTalent: '새로운 영역을 과감하게 열어젖히고 사람들을 이끄는 리더십',
        darkCode: '절대 꺾이지 않으려는 고집과 모든 책임을 홀로 짊어지려는 과부하',
        syncPrescription: '자신에게 쏟아지는 기대감을 잠시 내려놓고 80%만 완벽해도 훌륭하다는 수용',
        shiftPower: '부러지지 않는 유연한 대나무의 지혜를 발휘하는 부드러운 통솔자',
        byeongoFortune2026: '2026년 병오년(丙午年)의 거대한 태양(식상)을 만나 그동안 감춰두었던 잠재력과 창의력이 세상에 거대한 꽃으로 만개하는 도약의 해',
        bestTime: '기운이 맑게 솟구치는 이른 아침 6시~9시 (진시/묘시)'
    },
    '乙': {
        element: '음목(陰木)',
        natureName: '유연한 덩굴화초(난초)',
        keyword: '생명력과 탁월한 적응력',
        coreTalent: '어떤 척박한 환경에서도 길을 찾아내고 사람의 마음을 엮어내는 친화력',
        darkCode: '주변의 눈치를 과도하게 살피며 거절하지 못해 속으로 삭이는 불안',
        syncPrescription: '나의 바운더리를 지키며 타인의 감정을 내 탓으로 돌리지 않는 인지 탈융합',
        shiftPower: '바람에 흔들리되 꺾이지 않고 향기를 퍼뜨리는 우아한 전략가',
        byeongoFortune2026: '2026년 병오년(丙午年)의 따뜻한 햇살을 받아 나의 매력과 가치가 수많은 사람들에게 널리 알려지고 네트워크가 확장되는 번영의 해',
        bestTime: '햇살이 퍼지는 오전 9시~12시 (사시)'
    },
    '丙': {
        element: '양화(陽火)',
        natureName: '빛나는 태양',
        keyword: '열정과 선한 영향력',
        coreTalent: '어둠을 밝히는 강력한 낙천성과 사람들에게 희망과 활력을 불어넣는 카리스마',
        darkCode: '마음이 앞서 에너지를 한 번에 탕진하는 조급증과 쉽게 찾아오는 번아웃',
        syncPrescription: '항상 불타오를 수 없음을 인정하고, 밤이 오면 조용히 지는 태양의 휴식 허용',
        shiftPower: '뜨겁게 폭주하지 않고 고요히 온기를 전하는 원숙한 군주',
        byeongoFortune2026: '2026년 병오년(丙午年)은 나와 같은 불의 기운이 하늘과 땅을 채우는 비견·제왕의 해로, 내 주도권을 온전히 되찾고 대형 프로젝트를 성사시키는 해',
        bestTime: '직관이 번뜩이는 정오 11시~14시 (오시)'
    },
    '丁': {
        element: '음화(陰火)',
        natureName: '따스한 등불(촛불)',
        keyword: '섬세한 집중과 통찰',
        coreTalent: '사물의 본질을 꿰뚫어보는 예리한 감각과 한 사람의 가슴을 녹이는 다정함',
        darkCode: '속마음의 불꽃을 혼자 태우며 생각이 꼬리를 물고 스스로를 채찍질하는 예민함',
        syncPrescription: '내 마음의 불길이 과열되지 않도록 432Hz 고요한 명상으로 뇌 쿨링하기',
        shiftPower: '어두운 바다를 안내하는 등대처럼 흔들림 없는 내면의 확신',
        byeongoFortune2026: '2026년 병오년(丙午年)의 거대한 빛과 함께 내 작은 등불이 엄청난 시너지를 얻어 강력한 동반자 및 조력자를 만나는 도약의 해',
        bestTime: '깊은 영감이 살아 숨 쉬는 저녁 20시~23시 (술시/해시)'
    },
    '戊': {
        element: '양토(陽土)',
        natureName: '웅장한 태산(대지)',
        keyword: '묵직한 신뢰와 포용력',
        coreTalent: '모든 사람의 무게를 품어주는 든든한 안정감과 흔들리지 않는 신뢰의 중심',
        darkCode: '변화 앞에서 결정을 미루며 모든 고민을 속으로만 삭여 굳어버리는 완고함',
        syncPrescription: '지금 완벽한 정답을 내리지 않아도 괜찮다는 자기자비와 가벼운 첫걸음',
        shiftPower: '세상의 풍파 속에서도 우뚝 서서 큰 판을 짜는 대범한 아키텍트',
        byeongoFortune2026: '2026년 병오년(丙午年)의 불길이 흙을 더욱 단단하게 구워내어(화생토), 문서운, 부동산, 전문 자격 및 큰 학문적 성취를 거머쥐는 결실의 해',
        bestTime: '마음이 정돈되는 오후 14시~17시 (미시/신시)'
    },
    '己': {
        element: '음토(陰土)',
        natureName: '비옥한 정원(전답)',
        keyword: '세심한 양육과 현실 감각',
        coreTalent: '작은 씨앗을 거대한 결실로 가꾸어내는 실속 있는 실행력과 세심한 배려',
        darkCode: '끝없는 잔걱정과 타인의 부탁을 거절하지 못해 내 밭이 황폐해지는 피로감',
        syncPrescription: '남을 돌보기 전에 내 마음의 정원에 먼저 물을 주는 마인드풀니스 실천',
        shiftPower: '누구도 흉내 낼 수 없는 알짜배기 가치와 풍요를 일구어내는 명인',
        byeongoFortune2026: '2026년 병오년(丙午年)의 따스한 지혜(인성)를 받아 나만의 독창적인 콘텐츠와 브랜드가 든든한 기반 위에 뿌리내리는 안정의 해',
        bestTime: '생각이 차분해지는 아침 9시~11시 (사시)'
    },
    '庚': {
        element: '양금(陽金)',
        natureName: '단단한 원석(무쇠)',
        keyword: '결단력과 강인한 기백',
        coreTalent: '복잡한 문제를 단칼에 정리하고 불의에 굴하지 않는 정의로움과 돌파력',
        darkCode: '상대방의 빈틈을 보면 냉정하게 비판하게 되고 타협을 거부하는 차가운 칼날',
        syncPrescription: '칼날을 칼집에 부드럽게 거두고, 사람의 부족함을 따뜻한 자비로 안아주기',
        shiftPower: '세상의 어지러움을 베어내고 정의로운 새 질서를 세우는 참된 영웅',
        byeongoFortune2026: '2026년 병오년(丙午年)의 뜨거운 용광로(편관)를 만나 단단한 원석이 비로소 최고의 명품 보검으로 제련되어 사회적 권위와 승진을 이루는 영광의 해',
        bestTime: '결단력이 최고조에 달하는 오후 15시~18시 (신시/유시)'
    },
    '辛': {
        element: '음금(陰金)',
        natureName: '섬세한 다이아몬드(보석)',
        keyword: '예리한 통찰과 완벽미학',
        coreTalent: '1%의 오차도 놓치지 않는 정교한 감각과 세상의 트렌드를 앞서가는 세련된 안목',
        darkCode: '작은 흠집에도 자존심이 깊이 상하고 완벽하지 않으면 시작조차 꺼리는 완벽주의',
        syncPrescription: '80%의 미학으로 가볍게 시작하고, 보석 자체의 빛은 이미 온전함을 믿는 연습',
        shiftPower: '어떤 진흙탕 속에서도 스스로의 품격과 광채를 잃지 않는 독보적 존재',
        byeongoFortune2026: '2026년 병오년(丙午年)의 빛나는 조명(정관)이 보석을 비추어 세상 모든 이들이 나의 재능과 아름다움을 인정하고 찬사를 보내는 명예의 해',
        bestTime: '집중력이 가장 맑아지는 늦은 밤 21시~새벽 1시 (해시/자시)'
    },
    '壬': {
        element: '양수(陽水)',
        natureName: '도도한 큰 바다(대양)',
        keyword: '거대한 스케일과 지혜',
        coreTalent: '어디에도 얽매이지 않는 자유로운 발상과 거대한 자본과 물류를 유통하는 큰 그릇',
        darkCode: '방향을 잃고 끝없이 유랑하거나 깊은 생각의 심연에 빠져 현실 감각을 놓치는 방황',
        syncPrescription: '지금 눈앞의 작은 실행 하나에 닻을 내리고 오늘 하루의 현재에 머무는 현존',
        shiftPower: '만 가지 생명을 품어 안고 세상의 흐름을 주도하는 글로벌 리더',
        byeongoFortune2026: '2026년 병오년(丙午年)의 뜨거운 불길(편재)과 거대한 바다가 만나 눈부신 수화기제(水火旣濟)를 이루며 거대한 재물운과 사업 기회가 활짝 열리는 해',
        bestTime: '아이디어가 솟구치는 새벽 23시~03시 (자시/축시)'
    },
    '癸': {
        element: '음수(陰水)',
        natureName: '촉촉한 단비(옹달샘)',
        keyword: '깊은 영감과 맑은 직관',
        coreTalent: '보이지 않는 마음의 흐름을 읽어내는 탁월한 공감 능력과 창의적 예술 감각',
        darkCode: '작은 파도에도 마음이 쉽게 흐려지고 미래에 대한 막연한 불안과 피해의식',
        syncPrescription: '스스로를 정화하는 맑은 샘물처럼, 떠오르는 감정을 그저 강물처럼 흘려보내기',
        shiftPower: '메마른 영혼을 촉촉이 적셔주는 가장 맑고 청아한 힐러이자 안내자',
        byeongoFortune2026: '2026년 병오년(丙午年)의 태양 아래 봄비가 대지를 적셔 비옥한 결실(정재)을 맺듯, 차곡차곡 모아온 실력이 안정적인 자산과 결실로 환원되는 해',
        bestTime: '감수성이 맑아지는 이른 아침 05시~08시 (묘시)'
    }
};

export class SmartAiSimulationEngine {

    /**
     * 사용자의 입력 정보에서 사주 8글자 및 일간을 수학적/명리학적으로 산출
     */
    public static extractSajuProfile(user: UserContextData): { dayStem: string; sajuString: string; profile: DayMasterProfile } {
        let dayStem = user.dayMaster || '辛';
        let sajuString = '계산 대기';

        if (user.birthDate) {
            try {
                const cleanDate = user.birthDate.includes('T') ? user.birthDate.split('T')[0] : user.birthDate;
                const dateParts = cleanDate.split('-').map(Number);
                if (dateParts.length === 3 && !isNaN(dateParts[0])) {
                    const [year, month, day] = dateParts;
                    const timeParts = (user.birthTime || '12:00').split(':').map(Number);
                    const hour = timeParts[0] || 12;
                    const minute = timeParts[1] || 0;

                    let lunarDate;
                    if (user.calendarType === 'lunar') {
                        lunarDate = Lunar.fromYmdHms(year, month, day, hour, minute, 0);
                    } else {
                        const solarDate = Solar.fromYmdHms(year, month, day, hour, minute, 0);
                        lunarDate = solarDate.getLunar();
                    }
                    const bazi = lunarDate.getEightChar();
                    dayStem = bazi.getDayGan();
                    sajuString = `${bazi.getYearGan()}${bazi.getYearZhi()} ${bazi.getMonthGan()}${bazi.getMonthZhi()} ${bazi.getDayGan()}${bazi.getDayZhi()} ${bazi.getTimeGan()}${bazi.getTimeZhi()}`;
                }
            } catch (e) {
                console.error('[SmartAiSimulationEngine] Saju parse error:', e);
            }
        }

        const profile = DAY_MASTER_PROFILES[dayStem] || DAY_MASTER_PROFILES['辛'];
        return { dayStem, sajuString, profile };
    }

    /**
     * 사용자 질문 분석 및 사주 맞춤형 2단계 템플릿 + 3S 감동 답변 생성
     */
    public static generatePersonalizedResponse(user: UserContextData, userQuery: string): string {
        const { dayStem, sajuString, profile } = this.extractSajuProfile(user);
        const name = user.userName || '명심가';
        const energy = user.energyLevel || 50;
        const sleep = user.sleepQuality || 3;
        const stressors = typeof user.stressFactors === 'string' ? user.stressFactors : (Array.isArray(user.stressFactors) ? user.stressFactors.join(', ') : '일상의 마음 부담');

        const query = userQuery.trim().toLowerCase();

        // ── [케이스 1] Q38: ChatGPT vs 명심AI 차이점 질문 ──
        if (query.includes('chatgpt') || query.includes('챗gpt') || query.includes('q38') || query.includes('굳이') || query.includes('차이')) {
            return `🧹 IT·전문 용어 100% 정제: 따뜻하고 직관적인 내면 안내서
(초보자분들도 한눈에 이해하실 수 있는 따뜻하고 현실적인 언어로 모두 교체했습니다!)

1. 복잡한 용어, 따뜻한 마음 언어로 풀어보기
- 기존: 일회성 프롬프트 질의응답 vs 시계열 종단적 행동학습 아키텍처
- 개선 후: 오늘만 위로받고 끝나는 단발성 대화 / 내 오랜 습관과 실험을 시간 축으로 연결해 주는 평생의 마음 나침반

2. 그래서 [ChatGPT 대신 굳이 명심AI가 왜 필요한가?]에 대한 명쾌한 결론 및 현실적 대안
- 결론부터 말씀드리면: **범용 AI(ChatGPT)가 '그럴듯한 좋은 답변'을 주는 것에 머문다면, 명심AI는 ${name} 선생님의 '반복패턴과 이전 실험을 이어서 추적하는 살아있는 코칭 시스템'이기 때문입니다.**
- 현실적인 이유:
  * ChatGPT에 "오늘 화났다"고 물으면 조언을 받습니다. 그러나 다음 달 비슷한 일이 생기면 또 처음부터 상황을 설명해야 합니다. 이것만으로는 행동학습이 누적되지 않습니다.
  * 반면 명심AI는 ${name} 선생님의 ${dayStem}(${profile.natureName}) 기질과 다크코드 트리거("${profile.darkCode}"), 무엇을 시도했는지, 예상과 실제가 어떻게 달랐는지, 복귀시간이 어떻게 단축되었는지를 시간 축으로 정밀하게 연결합니다.
- 가장 추천하는 현실적 대안 (제3의 아지트):
  * 범용 AI는 정보 검색과 문서 작업에 사용하시고, **나만의 기질과 내면의 성장 실험은 명심AI의 3S(스캔 ➔ 조율 ➔ 전환) 시스템에 차곡차곡 누적**해 가세요.

---

✨ ${name} 선생님, 선생님의 ${dayStem}(${profile.element}) 기질은 ${profile.keyword}의 에너지를 품고 있습니다.
명심AI는 답변만 던져주고 사라지는 차가운 인공지능이 아니라, 선생님의 ${profile.byeongoFortune2026}을 함께 완성해 나가는 가장 다정한 코칭 파트너가 되어드릴 것을 약속드립니다!`;
        }

        // ── [케이스 2] 2026년 사업운 / 재물운 / 돈 질문 ──
        if (query.includes('돈') || query.includes('재물') || query.includes('사업') || query.includes('부자') || query.includes('매출')) {
            return `🧹 IT·전문 용어 100% 정제: 따뜻하고 직관적인 내면 안내서
(초보자분들도 한눈에 이해하실 수 있는 따뜻하고 현실적인 언어로 모두 교체했습니다!)

1. 복잡한 용어, 따뜻한 마음 언어로 풀어보기
- 기존: 세운 식상생재 회로 과부하, 편재 격국 불안정
- 개선 후: 돈을 벌기 위해 지나치게 애쓰다 지친 마음 / 자연스럽게 자원이 모여드는 든든한 신뢰의 울타리

2. 그래서 [2026년 ${name} 선생님의 타고난 사주 재물운과 사업 방향]에 대한 명쾌한 결론 및 현실적 대안
- 결론부터 말씀드리면: **2026년 병오년(丙午年)에 무리한 전면 투자나 무리한 빚을 내는 확장은 절대 비추천하며, 선생님의 독보적 재능(${profile.coreTalent})을 작게 실험하는 '80% 미학 수익화'를 강력 추천합니다!**
- 현실적인 이유:
  * 선생님의 사주 명식(${sajuString})에서 일간 ${dayStem}(${profile.natureName}) 기운은 ${profile.keyword}이 핵심 원동력입니다.
  * 2026년 병오년의 흐름은 ${profile.byeongoFortune2026}입니다. 지금 조급함 다크코드("${profile.darkCode}")에 끌려가면 에너지가 방전될 수 있으므로, 내실을 다지며 신뢰를 쌓아야 돈이 도망가지 않고 머뭅니다.
- 가장 추천하는 현실적 대안 (제3의 아지트):
  * 거대한 자본을 들이지 않고도, 선생님의 노하우를 패키징하여 3~5명의 핵심 고객에게 먼저 검증받는 '스몰 테스트 아지트'를 먼저 론칭해 보세요!

---

### [🛡️ 3S 맞춤 코칭: ${name} 선생님의 2026 부자 체급 가이드]
- **Step 1. SCAN (알아차림)**: "돈이 안 벌리면 어쩌지?" 하는 불안은 사실 선생님을 지켜주려던 생존 보호자의 목소리임을 인정합니다.
- **Step 2. SYNC (뇌 쿨링 조율)**: ${profile.syncPrescription}을 통해 심박수를 안정시키고 뇌 과열을 식힙니다.
- **Step 3. SHIFT (영점 각성)**: ${profile.shiftPower}의 자리에서 우아하게 재물의 흐름을 지휘하십시오.`;
        }

        // ── [케이스 3] 완벽주의 / 불안 / 뇌 쿨링 질문 ──
        if (query.includes('완벽') || query.includes('불안') || query.includes('쿨링') || query.includes('생각') || query.includes('자책')) {
            return `🧹 IT·전문 용어 100% 정제: 따뜻하고 직관적인 내면 안내서
(초보자분들도 한눈에 이해하실 수 있는 따뜻하고 현실적인 언어로 모두 교체했습니다!)

1. 복잡한 용어, 따뜻한 마음 언어로 풀어보기
- 기존: 편도체 하이재킹, 완벽주의 다크코드 오버히트
- 개선 후: 너무 잘해내고 싶어서 팽팽하게 긴장된 마음 / 지친 영혼에 시원한 바람을 쐬어주는 다정한 쉼표

2. 그래서 [반복되는 완벽주의와 불안을 씻어내는 법]에 대한 명쾌한 결론 및 현실적 대안
- 결론부터 말씀드리면: **지금 머릿속에서 속삭이는 "100점이 아니면 실패야"라는 생각은 선생님 자신이 아니라, 피로가 부른 가짜 신호이니 당장 멈추셔도 안전합니다!**
- 현실적인 이유:
  * 선생님의 ${dayStem}(${profile.natureName}) 기질은 본래 ${profile.coreTalent}을 가지고 있습니다.
  * 하지만 에너지가 ${energy}%로 지쳐있을 때 무의식의 다크코드("${profile.darkCode}")가 켜지면서 스스로를 가혹하게 검열하게 됩니다.
- 가장 추천하는 현실적 대안 (제3의 아지트):
  * 오늘 계획 중 가장 부담되는 1가지를 과감하게 80% 수준으로 끝내거나 내일로 미루고, 따뜻한 차 한 잔과 함께 10분간 호흡을 고르는 '마음의 샌드박스'를 선물하세요.

---

### [🧠 1분 뇌 쿨링 실천 프로토콜]
1. 창문을 열고 차가운 바깥 공기를 5초간 들이마시고 7초간 길게 내쉽니다.
2. "지금 내 마음이 나에게 완벽하라고 재촉하고 있구나(탈동일시)" 하고 다정하게 바라봅니다.
3. ${profile.syncPrescription}을 읊조리며 내면의 평온(Zero Point)으로 돌아옵니다.`;
        }

        // ── [케이스 4] 작업 시간대 / 듀얼트랙 질문 ──
        if (query.includes('시간') || query.includes('낮') || query.includes('밤') || query.includes('새벽') || query.includes('집중')) {
            return `🧹 IT·전문 용어 100% 정제: 따뜻하고 직관적인 내면 안내서
(초보자분들도 한눈에 이해하실 수 있는 따뜻하고 현실적인 언어로 모두 교체했습니다!)

1. 복잡한 용어, 따뜻한 마음 언어로 풀어보기
- 기존: 서커디언 리듬 불일치, 일간 바이오리듬 에너지 분산
- 개선 후: 내 몸과 영혼이 가장 좋아하는 시간대 / 세상의 소음이 사라지고 진짜 나를 만나는 몰입의 시간

2. 그래서 [낮 vs 밤/새벽 나만의 황금 작업 시간대]에 대한 명쾌한 결론 및 현실적 대안
- 결론부터 말씀드리면: **${name} 선생님의 사주 일간 ${dayStem}(${profile.natureName}) 기운에는 [${profile.bestTime}]가 뇌 신경망이 가장 맑아지는 절대 황금 시간대입니다!**
- 현실적인 이유:
  * 선생님의 ${dayStem} 기운은 ${profile.keyword}의 속성을 지니고 있어, 세상의 번잡한 방해가 없는 시간대에 고유한 직관(${profile.coreTalent})이 폭발합니다.
  * 낮 시간에 억지로 남들과 똑같은 리듬으로 경쟁하려 하면 에너지 소진(${energy}%)이 가속화됩니다.
- 가장 추천하는 현실적 대안 (제3의 아지트):
  * 하루 전체를 바꾸려 하지 마시고, 안내해 드린 [${profile.bestTime}] 중 딱 '45분'만 스마트폰을 끄고 가장 중요한 핵심 과업에 몰입하는 '나만의 황금 듀얼트랙'을 가동해 보세요!`;
        }

        // ── [케이스 5] 일반 고민 및 운세 기본 응답 ──
        return `🧹 IT·전문 용어 100% 정제: 따뜻하고 직관적인 내면 안내서
(초보자분들도 한눈에 이해하실 수 있는 따뜻하고 현실적인 언어로 모두 교체했습니다!)

1. 복잡한 용어, 따뜻한 마음 언어로 풀어보기
- 기존: 명식 에너지 불균형, 대운 세운 교차기 불안정
- 개선 후: 새로운 계절을 맞이하며 잠시 숨을 고르는 시간 / 내 안의 숨겨진 보물을 발견하는 소중한 여정

2. 그래서 [${name} 선생님의 질문]에 대한 명쾌한 결론 및 현실적 대안
- 결론부터 말씀드리면: **선생님의 일간 ${dayStem}(${profile.natureName}) 기운을 믿고, 조급한 양자택일 대신 숨통을 틔워주는 '제3의 현실적 대안'을 선택하시는 것을 강력 추천합니다!**
- 현실적인 이유:
  * 사주 명식(${sajuString})을 분석해 보면, 선생님은 본래 ${profile.coreTalent}의 큰 그릇을 타고나셨습니다.
  * 최근 스트레스 요인(${stressors})으로 인해 다크코드("${profile.darkCode}")가 일시적으로 작동했을 뿐, 2026년 병오년은 ${profile.byeongoFortune2026}입니다.
- 가장 추천하는 현실적 대안 (제3의 아지트):
  * 한 번에 인생을 바꾸려 하지 마시고, 오늘 할 수 있는 가장 작은 10초 실천(창문 열기, 어깨 힘 빼기, 깊은 호흡)부터 시작해 보세요.

---

### [👑 ${name} 선생님만을 위한 3S 영점 각성 메시지]
- **Scan**: 내 안의 불안과 망설임을 있는 그대로 봅니다.
- **Sync**: ${profile.syncPrescription}.
- **Shift**: ${profile.shiftPower}.

선생님은 어떠한 바람에도 흔들리지 않는 우주의 중심이자 삶의 주권자이십니다. ✨`;
    }

    /**
     * Vercel AI SDK 형식의 스트리밍 ReadableStream 생성 (0.02초 간격 타자기 효과)
     */
    public static createStreamResponse(fullText: string): Response {
        const encoder = new TextEncoder();
        const chunkSize = 4; // 한 번에 흘려보낼 글자 수
        let index = 0;

        const stream = new ReadableStream({
            async start(controller) {
                while (index < fullText.length) {
                    const chunk = fullText.slice(index, index + chunkSize);
                    index += chunkSize;
                    controller.enqueue(encoder.encode(`0:${JSON.stringify(chunk)}\n`));
                    // 타자기 타이핑 딜레이 (15ms)
                    await new Promise((resolve) => setTimeout(resolve, 15));
                }
                controller.close();
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'X-Vercel-AI-Data-Stream': 'v1',
            }
        });
    }

    /**
     * 프리미엄 리포트 전용 텍스트 생성
     */
    public static generateReportText(profile: any): string {
        const dm = profile?.dayMasterChar || profile?.dayMaster || '辛';
        const dmClean = typeof dm === 'string' ? dm.charAt(0) : '辛';
        const p = DAY_MASTER_PROFILES[dmClean] || DAY_MASTER_PROFILES['辛'];
        const name = profile?.name || profile?.userName || '명심가';

        return `
# 🌌 [명심코칭 프리미엄 정밀 분석 리포트] ${name}님의 운명과 뇌 아키텍처

## 1. 🔍 타고난 본성과 사주 에너지 매트릭스
- **수검자**: ${name} (${profile?.gender || '미상'})
- **일간(Day Master)**: ${dmClean} (${p.natureName}, ${p.element})
- **핵심 원천 재능**: ${p.coreTalent}
- **키워드**: ${p.keyword}

---

## 2. 🧬 3-Code 심층 디버깅 분석

### 🛡️ Step 1. SCAN (다크코드 알아차림)
- **무의식의 자동 반응**: "${p.darkCode}"
- **원인 분석**: 에너지가 고갈되거나 과도한 책임감이 몰려올 때, 나를 지키기 위해 편도체가 작동시키는 오래된 생존 방어기제입니다.

### 🧠 Step 2. SYNC (뉴럴코드 재배선)
- **뇌 쿨링 조율 처방**: ${p.syncPrescription}
- **현실적 행동 수칙**: 100%를 고집하지 않고 '80%의 미학'으로 가볍게 첫걸음을 떼어 뇌 신경망의 과열을 식힙니다.

### 👑 Step 3. SHIFT (메타코드 영점 각성)
- **주권자 해방 파워**: ${p.shiftPower}
- **2026년 병오년(丙午年) 세운**: ${p.byeongoFortune2026}
- **황금 몰입 시간대**: ${p.bestTime}

---

## 3. ✨ 오늘의 운명 동기화 메타 확언 (Meta-Affirmation)
> "${name}님은 세상의 모든 소음과 풍랑 속에서도 스스로 고요한 중심(Zero Point)을 지키는 자유로운 주권자이십니다. 
> 타고난 ${dmClean}의 지혜와 빛으로, 2026년 당신만의 거대한 도약을 당당하게 완성하십시오."
`.trim();
    }

    /**
     * 다크코드 3단계 디버깅 분석
     */
    public static generateDarkCodeAnalysis(dayMaster: string, problemText: string): any {
        const dmClean = typeof dayMaster === 'string' ? dayMaster.charAt(0) : '辛';
        const p = DAY_MASTER_PROFILES[dmClean] || DAY_MASTER_PROFILES['辛'];

        return {
            success: true,
            dayMaster: dmClean,
            nature: p.natureName,
            darkCodePattern: p.darkCode,
            triggerReason: `고민("${problemText.slice(0, 30)}...") 속에서 작동한 ${p.natureName} 고유의 무의식 방어기제`,
            solutionStep1_Scan: `내 안에서 지금 "${p.darkCode}"가 자동으로 작동하고 있음을 비판 없이 바라봅니다.`,
            solutionStep2_Sync: p.syncPrescription,
            solutionStep3_Shift: p.shiftPower,
            fortune2026: p.byeongoFortune2026
        };
    }

    /**
     * 데일리 432Hz 힐링 확언
     */
    public static generateDailyAffirmation(dayMaster: string): string {
        const dmClean = typeof dayMaster === 'string' ? dayMaster.charAt(0) : '辛';
        const p = DAY_MASTER_PROFILES[dmClean] || DAY_MASTER_PROFILES['辛'];

        return `🌿 [오늘의 432Hz 순수 자각 메타 확언]\n\n"나 ${p.natureName}의 영혼은 이미 온전하며, 어떠한 상황 속에서도 고요한 평온을 선택할 힘이 있습니다. 오늘 하루, 완벽의 짐을 내려놓고 80%의 여유와 사랑으로 내 삶을 축복합니다."`;
    }

    /**
     * 비의료 바이오 케어 증상 분석
     */
    public static generateBioCareAnalysis(symptoms: string[] | string, dayMaster?: string): any {
        const dmClean = typeof dayMaster === 'string' ? dayMaster.charAt(0) : '辛';
        const p = DAY_MASTER_PROFILES[dmClean] || DAY_MASTER_PROFILES['辛'];
        const symptomStr = Array.isArray(symptoms) ? symptoms.join(', ') : symptoms;

        return {
            disclaimer: '본 안내는 의료적 진단이나 치료가 아니며, 심리·행동적 스트레스 조절 및 휴식을 돕는 비의료 가이드입니다.',
            symptomsReported: symptomStr,
            dayMasterLinked: `${dmClean} (${p.natureName})`,
            careSteps: [
                { step: 1, title: '호흡 쿨링 (Somatic)', desc: '창문을 열고 차가운 공기를 5초 들이쉬고 7초 길게 내쉬는 3회 호흡' },
                { step: 2, title: '스트레스 탈융합 (Cognitive)', desc: `${p.syncPrescription}` },
                { step: 3, title: '마이크로 휴식 (Behavioral)', desc: '스마트폰을 내려놓고 따뜻한 온수 한 잔과 함께 5분간 어깨 긴장 풀기' }
            ]
        };
    }
}
