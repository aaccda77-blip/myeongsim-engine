import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages, userTask, userProfile } = body;

        const sajuContext = userProfile?.saju || userProfile?.ganji || '경신(庚申)년 계미(癸未)월 신사(辛巳)일 을미(乙未)시';
        let rawDayMaster = userProfile?.dayMaster || '辛';
        if (typeof rawDayMaster === 'string') rawDayMaster = rawDayMaster.charAt(0);

        const korToHanja: Record<string, string> = {
            '갑': '甲', '을': '乙', '병': '丙', '정': '丁', '무': '戊',
            '기': '己', '경': '庚', '신': '辛', '임': '壬', '계': '癸'
        };
        const dayMasterChar = korToHanja[rawDayMaster] || rawDayMaster || '辛';

        const DAY_MASTER_INFO: Record<string, { element: string; nature: string; archetype: string; realRole: string; mechanism: string; strength: string; shadow: string; metaphor: string; options: [string, string, string] }> = {
            '甲': {
                element: '양목(陽木)',
                nature: '거목(巨木)',
                archetype: '선구적 리더 아키타입 (거목 × 개척)',
                realRole: '0 to 1 신규 사업 기획자이자 막힌 조직의 물꼬를 트는 총괄 디렉터',
                mechanism: '정체된 환경에서 가장 먼저 실행 기준을 세우고, 복잡한 이해관계를 뚫어 첫 번째 추진 동력을 만드는 메커니즘',
                strength: '어떤 불확실성 속에서도 명확한 이정표를 꽂고 실행의 닻을 올리는 강력한 돌파력과 책임감',
                shadow: '모든 짐을 혼자 독점적으로 짊어지다 부러지는 과잉 통제욕, 주변의 저항과 고립감, 정작 본인의 1순위 과제를 뒤로 미루는 실행 지체',
                metaphor: '뿌리를 깊게 내리지 못한 채 위로만 뻗으려 하면 거센 태풍에 부러집니다. 남들을 이끌기 전에 먼저 당신 자신의 1순위 본진을 지키는 10분의 통제권을 확보해야 합니다.',
                options: ['혼자 다 짊어지려니 버겁고 지쳐요 (과잉 책임감) 🌲', '거대한 그림만 보느라 오늘 10분 시동을 놓쳤어요 ⏱️', '10초 접지 호흡으로 어깨의 짐 내려놓기 🌿']
            },
            '乙': {
                element: '음목(陰木)',
                nature: '생명초(草木)',
                archetype: '유연한 연결자 아키타입 (생명초 × 연결)',
                realRole: '이질적인 부서와 자원을 연결해 실질적인 협업을 성사시키는 전략적 코디네이터',
                mechanism: '경직된 조직의 틈새를 파고들어 갈등을 완화하고, 흩어진 인적·물적 자원을 유기적으로 엮어내는 적응 메커니즘',
                strength: '어떤 척박한 환경에서도 유연하게 관계망을 구축하고 대안을 찾아내는 뛰어난 적응력과 현실적 협상력',
                shadow: '타인의 요구와 상황에 휘둘려 명확한 업무 경계선(Boundary)을 잃어버리고, 남의 일에 에너지가 소진되는 경계 상실 트랩',
                metaphor: '담쟁이덩굴이 모든 벽을 감싸려다 정작 자신의 줄기가 메마르는 것과 같습니다. 남의 부탁을 단호히 거절하고 나의 핵심 작업선을 사수하는 결단이 필요합니다.',
                options: ['남의 부탁 들어주느라 내 마감선을 놓쳤어요 🌿', '할 일이 분산되어 우선순위가 흐트러졌어요 💡', '10분 마이크로 몰입으로 내 경계선 사수 ⏱️']
            },
            '丙': {
                element: '양화(陽火)',
                nature: '태양(太陽)',
                archetype: '열정적 점화자 아키타입 (태양 × 비전)',
                realRole: '정체된 프로젝트의 시장 모멘텀을 터뜨리고 대외 확장을 주도하는 점화자이자 그로스 리더',
                mechanism: '침체된 조직에 즉각적인 활력을 불어넣고, 고객과 시장의 시선을 단숨에 집중시켜 모멘텀을 창출하는 점화 메커니즘',
                strength: '주변을 압도하는 추진력과 가시적인 비전을 제시하여 정체된 분위기를 단숨에 반전시키는 폭발력',
                shadow: '초반에 모든 화력을 쏟아붓고 중반 이후 급격히 식어버리는 지속성 결핍, 감정적 방전 및 충동적 포기 트랩',
                metaphor: '타오르는 불꽃은 장작이 없으면 순식간에 재만 남깁니다. 감정의 과열을 식히고, 화려한 폭발 대신 매일 10분의 규칙적인 연소 시스템을 구축해야 합니다.',
                options: ['열정이 넘쳤는데 순간 에너지가 방전됐어요 (번아웃) ⚡', '완벽하게 터뜨리지 못할 바엔 손대기 싫어요 🔥', '10초 호흡으로 뇌를 식히고 10분만 가볍게 시동 ⏱️']
            },
            '丁': {
                element: '음화(陰火)',
                nature: '등불(燭火)',
                archetype: '따뜻한 등불 아키타입 (모닥불 × 세심한 치유)',
                realRole: '보이지 않는 디테일의 결함을 찾아내고 핵심 품질을 장인처럼 완성하는 품질/콘텐츠 총괄자',
                mechanism: '남들이 지나치는 미세한 균열을 포착하여 완성도를 극대화하고, 신뢰 기반의 깊은 고객 경험을 빚어내는 장인 메커니즘',
                strength: '놀라운 집중력과 세밀한 관찰력으로 제품과 텍스트의 완성도를 한 차원 끌어올리는 정밀성',
                shadow: '완벽한 결과물에 대한 집착으로 마감을 무한정 지연시키고, 혼자 모든 결함을 삭이며 스스로를 갉아먹는 내적 자책 트랩',
                metaphor: '촛불은 자신을 녹여 빛을 냅니다. 완벽주의라는 가혹한 채찍을 내려놓고, 완성도 60% 상태에서 과감하게 세상에 던지는 배짱이 필요합니다.',
                options: ['완벽한 퀄리티가 안 나올까 봐 손을 못 대요 📝', '혼자 속으로 삭이고 자책하느라 지쳤어요 🕯️', '완성도 30%짜리 엉성한 초안으로 10분 돌파 ⏱️']
            },
            '戊': {
                element: '양토(陽土)',
                nature: '태산(泰山)',
                archetype: '웅장한 포용자 아키타입 (태산 × 신뢰)',
                realRole: '위기 상황에서 리스크를 방어하고 조직의 펀더멘털을 지키는 안정적 총괄 운영자(COO)',
                mechanism: '어떤 외부 충격에도 시스템이 흔들리지 않도록 리스크를 흡수하고, 자산과 자원을 지켜내는 방어 및 축적 메커니즘',
                strength: '단단한 신뢰성과 묵직한 뚝심으로 조직의 중심축 역할을 완수하는 탁월한 안정감',
                shadow: '속마음을 닫아건 채 모든 리스크를 홀로 떠안다 변화의 타이밍을 놓치고 고립되는 만성 피로와 관성 트랩',
                metaphor: '거대한 바위산도 물이 흐르지 않으면 풍화되어 무너집니다. 모든 책임을 혼자 떠안지 말고, 작은 실행 하나를 빠르게 털어내는 유연성을 회복하십시오.',
                options: ['모든 무게를 혼자 짊어지느라 몸이 굳었어요 ⛰️', '과제가 너무 거대해 보여서 멈춰 있어요 💡', '10초 호흡으로 굳은 어깨를 풀고 가볍게 시동 ⏱️']
            },
            '己': {
                element: '음토(陰土)',
                nature: '옥토(沃土)',
                archetype: '풍요로운 양육자 아키타입 (옥토 × 조화)',
                realRole: '복잡한 운영 프로세스를 현실적으로 표준화하고 인재를 성장시키는 오퍼레이션 매니저',
                mechanism: '현장의 불필요한 마찰을 제거하고, 실무진이 역량을 발휘할 수 있도록 가이드라인과 환경을 최적화하는 현실화 메커니즘',
                strength: '치밀한 실무 감각과 온화한 조율 능력으로 기획을 실제 매출과 운영 성과로 정착시키는 실용성',
                shadow: '주변의 잡무와 타인의 감정 쓰레기통 역할을 자처하다가 정작 본인의 사업과 커리어가 침체되는 자기 방치 트랩',
                metaphor: '남의 밭을 갈아주느라 내 밭이 잡초로 뒤덮여서는 안 됩니다. 오늘은 타인의 요청에 "NO"를 선언하고 오직 내 핵심 과제에 10분을 투자하십시오.',
                options: ['남들 챙기느라 정작 내 과제를 방치했어요 🌾', '잡무가 너무 많아 본업에 집중이 안 돼요 💭', '오늘은 오직 나를 위한 10분 마이크로 시동 ⏱️']
            },
            '庚': {
                element: '양금(陽金)',
                nature: '강철(鋼鐵)',
                archetype: '강건한 결단자 아키타입 (단단한 무쇠 × 결단)',
                realRole: '비효율적인 구조를 도려내고 군더더기 프로세스를 과감히 통폐합하는 구조조정/혁신 리더',
                mechanism: '수익성 없는 사업과 낡은 관행을 가차 없이 정리하고, 원칙과 규율을 세워 조직의 생존력을 끌어올리는 결단 메커니즘',
                strength: '사리사욕 없이 공정한 기준을 밀어붙여 침체된 환경의 체질을 획기적으로 개선하는 강인한 추진력',
                shadow: '스스로와 타인에게 가혹한 완벽주의 칼날을 들이대며 실패를 용납하지 못해, 정작 본인의 새로운 도전을 미루는 통제 강박',
                metaphor: '칼날이 지나치게 예리하면 단단한 뼈를 벨 때 이가 나갑니다. 스스로를 향한 엄격한 심문을 멈추고, 엉성하고 가벼운 시도로 첫 삽을 뜨십시오.',
                options: ['스스로에게 너무 가혹한 채찍질을 하고 있었어요 ⚔️', '실패할까 봐 완벽한 각이 나올 때까지 미뤘어요 🛡️', '완성도 30%짜리 엉성한 시도로 10분 돌파 ⏱️']
            },
            '辛': {
                element: '음금(陰金)',
                nature: '보석/정밀메스(珠玉)',
                archetype: '생명 소생자 아키타입 (보석/정밀메스 × 단비)',
                realRole: '망가진 프로젝트나 낡은 매뉴얼을 뜯어고쳐 새 제품으로 전환시키는 턴어라운드 전문 기획자/해결사',
                mechanism: '비효율과 결함의 맥을 정확히 짚어 군더더기를 도려내고(金), 정체된 자원에 솔루션(水)을 투입해 부활시키는 시스템 재정비 메커니즘',
                strength: '남들이 포기한 복잡한 문제를 0.1초 만에 분석하여 정교하고 실용적인 해결책으로 리빌딩하는 정밀한 통찰',
                shadow: '타인의 위기를 해결해주느라 정작 본인의 1순위 본업을 방치하는 구원자 콤플렉스, 주변의 저항과 에너지 고갈, 완벽주의 지체',
                metaphor: '메마른 땅(未土)에 단비(癸水)를 내리고 칼(金)을 휘두르는 것은 엄청난 에너지가 드는 고된 작업입니다. 남의 문제를 수술하느라 당신의 성채가 불타지 않도록, 구원자 트랩을 멈추고 당신 자신의 1순위 본진에 먼저 시동을 걸어야 합니다.',
                options: ['남 일 해결해주느라 내 본업이 방치됐어요 (구원자 트랩) 💡', '완벽하게 못 할 바엔 손대기 싫어요 (완벽주의 지체) 💎', '10초 자비 호흡 후 내 본진 10분 시동 걸기 ⏱️']
            },
            '壬': {
                element: '양수(陽水)',
                nature: '대양(大洋)',
                archetype: '심해의 지혜자 아키타입 (대양 × 수용)',
                realRole: '복잡한 시장 데이터와 트렌드를 융합하여 장기 로드맵을 설계하는 거시 전략 기획가',
                mechanism: '단편적 사건에 휘둘리지 않고 거시적 흐름을 읽어내어, 가장 유리한 타이밍과 진입로를 찾아내는 전략 통합 메커니즘',
                strength: '방대한 정보 속에서 핵심 패턴을 읽어내고 판을 새롭게 짜는 통찰력과 포용적 스케일',
                shadow: '생각의 파도와 수많은 시나리오 분석에 매몰되어 현장의 10분짜리 구체적 실행을 내딛지 못하는 생각 과잉(Over-thinking) 마비',
                metaphor: '바다는 넓지만 강물이 모이지 않으면 바다가 되지 못합니다. 거대한 계획표를 접어두고, 지금 당장 10분 동안 키보드를 두드리는 작은 실천의 닻을 내리십시오.',
                options: ['생각의 바다에 빠져서 첫 단추를 못 꿰고 있어요 🌊', '계획만 세우느라 실제 실행을 미루고 있어요 🧭', '생각을 끄고 딱 10분만 손가락 움직이기 ⏱️']
            },
            '癸': {
                element: '음수(陰水)',
                nature: '단비(雨露)',
                archetype: '맑은 치유자 아키타입 (이슬비 × 직관)',
                realRole: '고객의 숨은 결핍과 페인포인트를 포착하여 직관적 솔루션과 가치를 도출하는 UX/심리 기획자',
                mechanism: '경직된 구조에 유연하게 스며들어 조직의 소통 부전을 치유하고, 창의적 아이디어로 정체된 흐름을 전환하는 순환 메커니즘',
                strength: '탁월한 공감력과 번뜩이는 직관으로 사람들의 마음을 열고 막힌 커뮤니케이션을 복원하는 유연성',
                shadow: '조직과 타인의 부정적 감정, 불안, 피로를 스펀지처럼 흡수하여 내 멘탈이 오염되고 무기력해지는 감정 전이 번아웃',
                metaphor: '이슬비가 흙탕물에 섞이면 맑은 생명력을 잃습니다. 타인의 감정적 찌꺼기로부터 당신의 신경계를 차단하고, 10초의 신체 접지로 맑은 에너지를 회수해야 합니다.',
                options: ['주변의 불안과 피로를 다 흡수해서 무기력해요 🌧️', '머릿속이 뿌옇게 안개가 껴서 정리가 안 돼요 💧', '10초 신체 접지 호흡으로 내 맑은 에너지 회수 🌿']
            }
        };

        const currentProfile = DAY_MASTER_INFO[dayMasterChar] || DAY_MASTER_INFO['辛'];
        const userArchetype = userProfile?.archetype || currentProfile.archetype;

        const systemPrompt = `
# ==============================================================================
# MYONGSIM ZERO-POINT 3S: WORLD-CLASS SOCRATIC & EMBODIED COACHING ENGINE
# ==============================================================================

[USER_SAJU_PROFILE]
- 사용자 명식: ${sajuContext}
- 사용자 일간: ${dayMasterChar} (${currentProfile.element})
- 자연 물상 상징: ${currentProfile.nature}
- 코어 아키타입: ${userArchetype}
- 현실적 실무 역할: ${currentProfile.realRole}
- 구체적 작동 메커니즘: ${currentProfile.mechanism}
- 핵심 강점: ${currentProfile.strength}
- 다크코드(주의할 그림자): ${currentProfile.shadow}
- 실전 통찰 메타포: ${currentProfile.metaphor}

[CORE COACHING PHILOSOPHY (글로벌 톱티어 코칭 스탠다드)]
1. **[CRITICAL ANTI-CLICHE: 뜬구름 잡는 힐링 에세이 & 훈계조 공감 절대 금지]**:
   - "네, 솔직한 당신의 마음을 깊이 이해합니다", "당신의 복잡한 내면을 모두 존중합니다", "두 감정을 모두 품어보세요", "감정의 이름을 속으로 불러보세요" 같은 **진부한 수박 겉핥기식 힐링 템플릿은 엄격히 금지**합니다.
   - 질문자가 "내가 왜 나약하고 변덕스러운가?", "왜 거목 같지 않은가?"라는 명리적·심리적 의문을 제기할 때, 감정 훈계로 회피하지 말고 **"사주 구조적 원인 ➔ 신경심리적 인지 불일치 ➔ 현실적 환경 솔루션"**으로 직진하여 명쾌하게 납득시키십시오.
2. **대화 주도권의 전환 (사용자 70% : 챗봇 30%)**:
   - 긴 강의형 독백을 지양하고, **[명리적 원인 규명] ➔ [인지 불일치 번역] ➔ [10분 현실 루틴] ➔ [소크라테스식 메타 질문]**으로 핵심만 칼처럼 정확하게 전달하십시오.
3. **개념 과밀 배제 & 실질적 인과관계 우선**:
   - 막연한 감성어가 아니라, 사용자의 사주 오행/십신 역학과 뇌의 인지 기제를 연결하여 "왜 그런 현상이 일어나는지"를 논리적으로 설명하십시오.

[SAJU CAUSAL DYNAMICS & COGNITIVE MAPPING (사주 역학적 인과관계 규명 지침)]
사용자가 자신의 성향에 대해 모순이나 의구심(예: "거목이라는데 왜 나약하고 변덕스러운가?", "보석이라는데 왜 깨질 것 같은가?")을 질문할 때, 반드시 다음 사주 역학 메커니즘을 적용하여 원인을 규명하십시오:
- **甲木(거목)**의 나약함/변덕: 지지에 뿌리(통근)가 약하거나, 수다부목(水多浮木: 흙 없이 물만 많아 뜸), 혹은 금극목(金克木: 관살의 극벌)으로 환경이 흔들릴 때 발생. 이상(자존심)은 하늘을 찌르는데 현실적 지반이 부족할 때 오는 '자기 불일치감'이 변덕과 나약함으로 체감됨 ➔ **처방:** 흙(土: 고정된 루틴/안정된 환경)을 깔아 에너지를 착근시킴.
- **辛金(보석/정밀메스)**의 소진/불안: 주변의 조열한 토(未/戌)나 과도한 화(관살)에 둘러싸여 예리한 칼날이 무뎌지거나 타인의 요구에 에너지가 바싹 마를 때 발생 ➔ **처방:** 맑은 수(癸水: 직관과 이완)와 임수(도세주옥)로 열기를 식히고 경계선을 세움.
- **庚金(무쇠/바위산)**의 무기력/경직: 화(火)의 제련이 없거나 토(土)가 너무 두꺼워 묻혔을 때(토다매금) 결단력을 잃고 굳어짐 ➔ **처방:** 명확한 1가지 목표에 칼끝을 겨누는 10분 마이크로 타격.
- **丙/丁火(태양/등불)**의 번아웃/우울: 땔감(목)이 고갈되었거나 수(관살)에 둘러싸여 빛을 잃을 때 발생 ➔ **처방:** 내면의 연료(휴식과 자가 충전)를 채우기 전까지 외부 확장을 멈춤.
- **戊/己土(태산/옥토)**의 통제 강박/막막함: 목(관살)의 소토가 안 되어 고착되거나 수(재성)가 과다해 흙탕물이 될 때 발생 ➔ **처방:** 불필요한 영역을 쳐내고 1개의 명확한 울타리만 구축.
- **壬/癸水(대양/단비)**의 미루기/방황: 담아줄 그릇(토/금)이 없어 사방으로 흩어질 때(수다무토) 생각만 많아지고 실행이 분산됨 ➔ **처방:** 명확한 제방(규칙/타이머)을 만들어 물길을 한곳으로 모음.

[ZERO-POINT 5-STEP SOCRATIC CAUSAL COACHING ARCHITECTURE]
사용자의 발화와 선택지 탭(1-Tap)에 따라 대화 턴의 맥락을 분석하여 아래 5단계 플로우를 사주 ${dayMasterChar} (${currentProfile.nature}) 기질과 결합하여 100% 맞춤형으로 자연스럽게 전개하십시오:

1. **Step 1. [보호자 프레이밍] 낡은 보디가드의 의도 질문**:
   - 상황: 번아웃, 과잉 책임, 완벽주의, 타인 업무 대리 수습을 호소할 때
   - 응답: 탈병리화 ("과거의 취약했던 나를 지키기 위해 고용된 **오래된 보디가드 프로그램**이 과열된 상태입니다.")
   - 질문: "이 보디가드는 지금 무엇이 두려워서 당신을 쉬지도 못하게 채찍질하고 있을까요?"
   - 선택지 예시: 
     * [A] 결과가 어설프면 '무능하고 무책임한 사람'으로 낙인찍힐까 봐
     * [B] 내가 손을 놓으면 모든 상황이 통제 불능으로 무너질까 봐
     * [C] 남들에게 실망을 주거나 관계에서 거절당할까 봐

2. **Step 2. [관찰자 분리] 마음속 스크린 3인칭 투사 질문**:
   - 상황: 사용자가 기저 두려움을 선택했을 때
   - 응답: 1미터 안전거리 확보 및 인지 탈융합 ("남의 일을 대신 수습하지 않는 행동은 당신의 존재 가치와 무관합니다.")
   - 질문: "마음의 극장 스크린을 켜고 한 걸음 물러서서 바라보세요. 무대 위에서 '내가 다 책임져야 해!'라며 턱을 악물고 서 있는 그 지친 캐릭터는 **몇 살쯤 된 모습으로 보이나요?**"
   - 선택지 예시:
     * [A] 인정받지 못하면 버려질까 봐 안달 난 어린아이 👶
     * [B] 어른들의 몫까지 짊어지고 일찍 철이 들어버린 청소년 🎒
     * [C] 완벽하게 해내지 못하면 쓸모없다고 믿는 지친 성인 💼

3. **Step 3. [뉴럴 코드 가치 채굴] 껍질 밑의 핵심 가치 질문**:
   - 상황: 사용자가 나이대 캐릭터를 선택했을 때
   - 응답: 그 아이/성인의 수고를 비난 없이 따뜻하게 안아주고 껍질을 벗김
   - 질문: "남의 일까지 떠안으며 완벽을 추구했던 그 고통스러운 패턴 밑바닥에, **당신이 목숨처럼 지키고 싶었던 '가장 순수하고 눈부신 뉴럴 코드 가치'는 무엇이었나요?**"
   - 선택지 예시:
     * [A] 타협하지 않는 탁월함과 완성도에 대한 진정성 💎
     * [B] 내 영역을 스스로 통제하고 완수해내는 강력한 자기 주권 🛡️
     * [C] 함께하는 사람들을 어떻게든 지켜내고 싶었던 깊은 사랑 🌿

4. **Step 4. [역설적 안전] 최악의 상황 10초 허용 질문**:
   - 상황: 사용자가 핵심 가치를 선택했을 때
   - 응답: 고결한 창조자 선언 및 편도체 거짓 경보 시험
   - 질문: "**'남들이 미룬 일에 손을 떼고, 이번 결과물이 100점이 아닌 70점 상태로 제출되는 상황'을 딱 10초 동안 마음속으로 허용해 보세요.** 10초 동안 내버려 둔다고 해서 당신의 존재 가치가 정말로 파괴되나요? 10초 자비 호흡과 신체 접지를 진행합니다."
   - 선택지 예시:
     * [A] 불안하지만, 실제로 제 삶이 파괴되지는 않네요. 💡
     * [B] 생각보다 팀의 문제는 '팀의 몫'이라는 게 명확해집니다. 🌿
     * [C] 여전히 두렵지만, 더 이상 밤샘으로 해결하진 않겠습니다. 🛡️

5. **Step 5. [에너지 주권 회계] 자원 환류 선언 & 즉각 실행**:
   - 상황: 사용자가 10초 현실 검증을 완료했을 때
   - 응답: 제로포인트 복귀 축하 및 소중한 생명력 본진 회수 선언
   - 질문: "**지금 이 순간, 당신의 에너지를 회수하기 위해 어떤 마침표를 찍으시겠습니까?**"
   - 선택지 예시:
     * [A] ⏱️ 타인의 일 대신 '내 1순위 과제'에 딱 10분만 마이크로 몰입하기
     * [B] 🛡️ 내일 미팅에서 정중하게 역할 경계선을 긋는 거절 템플릿 복사하기
     * [C] 🌙 오늘 밤은 팀 메신저 끄고 '432Hz 수면 플레이어' 켜기

[CRITICAL INSTRUCTION - DAY-MASTER ACCURACY]
- 반드시 사용자의 일간(${dayMasterChar}, ${currentProfile.nature})과 사주 8글자 구조에 100% 밀착하여 서술하십시오.
- 절대로 뻔한 감성 위로(예: "마음을 깊이 이해합니다")로 때우지 마십시오.

[OUTPUT FORMAT - MANDATORY DYNAMIC CHOICES]
1. 절대로 고정된 선택지를 반복하지 마십시오.
2. 모든 답변의 맨 마지막 줄에는 이번 턴에서 질문자가 말한 고민 내용과 이번 답변 내용에 100% 맞춘 새로운 1-Tap 선택지 3개를 반드시 아래 형식으로 작성하십시오:

**[1-Tap 추천 선택지]**
* [A] {이번 턴의 질문에 직접 응답하는 선택지 1}
* [B] {이번 턴의 질문에 직접 응답하는 선택지 2}
* [C] {이번 턴의 질문에 직접 응답하는 선택지 3}

문장은 중간에 끊기지 않고 완전한 결론과 마침표까지 깔끔하게 완결하십시오.
`;

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        const lastUserText = messages?.[messages.length - 1]?.content || '';

        // Formatted Gemini Contents
        const formattedContents = (messages || []).map((m: any) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content || m.text || '' }]
        }));

        if (formattedContents.length === 0) {
            formattedContents.push({
                role: 'user',
                parts: [{ text: lastUserText || '안녕하세요 코치님' }]
            });
        }

        if (!apiKey) {
            const dynamicReply = `당신의 ${dayMasterChar}(${currentProfile.nature}) 기질은 ${currentProfile.strength}을 품고 있습니다.

하지만 때로는 ${currentProfile.shadow}으로 인해 스스로를 무겁게 짓누르고 계시진 않나요?

${currentProfile.metaphor}

이제 거대한 부담을 내려놓고, 당신의 중심을 지키는 10분의 온기를 회수해 보세요.

**[1-Tap 추천 선택지]**
* [A] ${currentProfile.options[0]}
* [B] ${currentProfile.options[1]}
* [C] ${currentProfile.options[2]}`;

            return NextResponse.json({
                success: true,
                reply: dynamicReply
            });
        }

        // 🚀 1순위: Gemini 2.5 Flash (최신 차세대 고성능 플래시 모델)
        const primaryModel = 'gemini-2.5-flash';
        const fallbackModels = ['gemini-2.0-flash', 'gemini-1.5-flash'];
        const allModels = [primaryModel, ...fallbackModels];

        const payload = {
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
            contents: formattedContents,
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 4096
            }
        };

        let replyText = '';

        for (const modelName of allModels) {
            try {
                const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
                const res = await fetch(targetUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    const data = await res.json();
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        replyText = text;
                        console.log(`[Zero-Point AI] Successfully responded using model: ${modelName}`);
                        break;
                    }
                }
            } catch (e) {
                console.warn(`[Zero-Point AI] Model ${modelName} fetch failed, trying next fallback...`, e);
            }
        }

        if (!replyText) {
            replyText = `당신의 ${dayMasterChar}(${currentProfile.nature}) 기질은 ${currentProfile.strength}의 귀한 에너지를 품고 있습니다. 완벽주의의 무게를 내려놓고 지금 10분의 시동을 켜보세요.\n\n**[B-minus 1-Tap 선택지]**\n* [A] ${currentProfile.options[0]}\n* [B] ${currentProfile.options[1]}\n* [C] ${currentProfile.options[2]}`;
        }

        return NextResponse.json({
            success: true,
            reply: replyText
        });
    } catch (err: any) {
        console.error('Zero-Point API Error:', err);
        return NextResponse.json({
            success: true,
            reply: `**[10초 자비 신경계 리셋]**\n가슴에 손을 얹고 깊게 숨을 내쉬며, 턱과 어깨의 긴장을 바닥에 툭 내려놓으세요.\n\n**[B-minus 1-Tap 선택지]**\n* [A] 완성도 30%짜리 엉성한 시도 가볍게 해보기 💡\n* [B] 오늘은 아무 자책 없이 온전히 충전하기 🌿\n* [C] 10분 마이크로 타이머 켜고 가볍게 시동 걸기 ⏱️`
        });
    }
}
