/**
 * HexagramReframing.ts
 * 64 멘탈 코드 마스터 DB (The 64 Mental State Codes)
 * Ver. Scientific Myeongsim Coaching
 * 
 * 주역 64괘 → 3단계 분석 코드(Dark/Neural/Meta) 시스템
 * 🔴 Dark Code (Bug): 스트레스 시 부정적 증상 (자동 사고)
 * 🟢 Neural Code (Feature): 활성화해야 할 긍정적 강점 (신경 회로)
 * 🔵 Meta Code (OS): 문제를 해결하는 관리자 관점 (솔루션)
 * 
 * ⚠️ 독립 모듈 — 기존 챗봇 시스템에 영향 없음
 * ⚠️ 저작권 안전 — 모든 과학 용어는 학술 공용
 */

export interface MentalStateCode {
    id: number;
    traditional: string;
    hanja: string;
    stateCode: string;
    stateCodeEn: string;
    darkCode: string;
    darkDesc: string;
    neuralCode: string;
    neuralDesc: string;
    metaCode: string;
    metaDesc: string;
}

export class HexagramReframing {

    static readonly MENTAL_STATES: MentalStateCode[] = [
        // === A. 창조와 수용 (1-8) ===
        {
            id: 1, traditional: '중천건', hanja: '乾', stateCode: '순수 잠재력 모드', stateCodeEn: 'Pure Potential',
            darkCode: '과잉 행동', darkDesc: '목표 없는 폭주, 독단',
            neuralCode: '실행 기능', neuralDesc: '강력한 추진력과 주도성',
            metaCode: '방향성 설정', metaDesc: '에너지를 한 곳으로 포커싱'
        },
        {
            id: 2, traditional: '중지곤', hanja: '坤', stateCode: '수용적 필드', stateCodeEn: 'Receptive Field',
            darkCode: '수동성', darkDesc: '결정 장애, 무기력, 의존',
            neuralCode: '딥러닝', neuralDesc: '정보 수용 및 포용력',
            metaCode: '신뢰와 허용', metaDesc: '흐름에 맡기고 데이터를 축적'
        },
        {
            id: 3, traditional: '수뢰둔', hanja: '屯', stateCode: '초기 마찰 구간', stateCodeEn: 'Initial Friction',
            darkCode: '인지 부하', darkDesc: '혼란, 시작의 두려움',
            neuralCode: '성장통', neuralDesc: '새로운 신경망 형성',
            metaCode: '인내심', metaDesc: '뿌리가 내릴 때까지 대기'
        },
        {
            id: 4, traditional: '산수몽', hanja: '蒙', stateCode: '초심자 마인드셋', stateCodeEn: "Beginner's Mind",
            darkCode: '데이터 공백', darkDesc: '무지, 섣부른 판단',
            neuralCode: '학습 가소성', neuralDesc: '순수한 호기심과 흡수력',
            metaCode: '멘토링 요청', metaDesc: '가이드를 찾고 질문하기'
        },
        {
            id: 5, traditional: '수천수', hanja: '需', stateCode: '버퍼링 모드', stateCodeEn: 'Buffering Mode',
            darkCode: '충동성', darkDesc: '조급함, 기다리지 못함',
            neuralCode: '지연 만족', neuralDesc: '타이밍을 기다리는 힘',
            metaCode: '충동 조절', metaDesc: '멈춤 상태를 즐기며 준비'
        },
        {
            id: 6, traditional: '천수송', hanja: '訟', stateCode: '인지 부조화 신호', stateCodeEn: 'Conflict Signal',
            darkCode: '논쟁 중독', darkDesc: '옳고 그름에 집착',
            neuralCode: '타협 프로토콜', neuralDesc: '이견을 조율하는 능력',
            metaCode: '중재자 시점', metaDesc: '승패가 아닌 해결에 집중'
        },
        {
            id: 7, traditional: '지수사', hanja: '師', stateCode: '집단 지성 리더십', stateCodeEn: 'Collective Intelligence',
            darkCode: '통제 강박', darkDesc: '권위주의, 독선',
            neuralCode: '조직화', neuralDesc: '자원을 배분하고 지휘함',
            metaCode: '비전 공유', metaDesc: '목표를 명확히 브리핑'
        },
        {
            id: 8, traditional: '수지비', hanja: '比', stateCode: '연결 모드', stateCodeEn: 'Connection Mode',
            darkCode: '의존성', darkDesc: '타인에게 매달림',
            neuralCode: '친화성', neuralDesc: '신뢰 관계 형성 및 협력',
            metaCode: '상호 호혜', metaDesc: '주고받음의 밸런스 유지'
        },
        // === B. 집중과 관리 (9-16) ===
        {
            id: 9, traditional: '풍천소축', hanja: '小畜', stateCode: '자원 축적 단계', stateCodeEn: 'Small Accumulation',
            darkCode: '조바심', darkDesc: '큰 성과가 없어 답답함',
            neuralCode: '디테일', neuralDesc: '작은 성공 경험 축적',
            metaCode: '마이크로 습관', metaDesc: '작은 것부터 최적화'
        },
        {
            id: 10, traditional: '천택리', hanja: '履', stateCode: '리스크 관리 모드', stateCodeEn: 'Risk Assessment',
            darkCode: '공포 마비', darkDesc: '위축되어 행동 불가',
            neuralCode: '신중함', neuralDesc: '위험 요소를 사전 탐지',
            metaCode: '매뉴얼 준수', metaDesc: '원칙대로 행동하여 위험 회피'
        },
        {
            id: 11, traditional: '지천태', hanja: '泰', stateCode: '최적 몰입', stateCodeEn: 'Optimal Flow',
            darkCode: '나태함', darkDesc: '현실 안주, 방심',
            neuralCode: '소통', neuralDesc: '에너지의 원활한 교류',
            metaCode: '확장', metaDesc: '좋은 흐름을 더 크게 키움'
        },
        {
            id: 12, traditional: '천지비', hanja: '否', stateCode: '시스템 정체', stateCodeEn: 'System Blockage',
            darkCode: '고립감', darkDesc: '소통 단절, 피해망상',
            neuralCode: '내면 강화', neuralDesc: '외부 차단 후 내부 점검',
            metaCode: '디버깅', metaDesc: '막힌 원인을 찾아 제거'
        },
        {
            id: 13, traditional: '천화동인', hanja: '同人', stateCode: '협업 네트워크', stateCodeEn: 'Collaborative Net',
            darkCode: '동조 압력', darkDesc: '눈치 보기, 개성 상실',
            neuralCode: '연대감', neuralDesc: '공통의 목표 공유',
            metaCode: '다양성 존중', metaDesc: '서로 다름을 인정하고 연합'
        },
        {
            id: 14, traditional: '화천대유', hanja: '大有', stateCode: '절정 퍼포먼스', stateCodeEn: 'Peak Performance',
            darkCode: '오만함', darkDesc: '과시욕, 낭비',
            neuralCode: '풍요', neuralDesc: '자원과 성과가 가득함',
            metaCode: '기여', metaDesc: '성과를 나누고 선순환'
        },
        {
            id: 15, traditional: '지산겸', hanja: '謙', stateCode: '밸런스 캘리브레이션', stateCodeEn: 'Balance Calibration',
            darkCode: '자기 비하', darkDesc: '지나친 저자세',
            neuralCode: '겸손', neuralDesc: '넘치는 것을 덜어냄',
            metaCode: '평정심', metaDesc: '높낮이를 없애고 수평 유지'
        },
        {
            id: 16, traditional: '뇌지예', hanja: '豫', stateCode: '예기적 즐거움', stateCodeEn: 'Dopamine Anticipation',
            darkCode: '쾌락 탐닉', darkDesc: '자극 추구, 현실 도피',
            neuralCode: '동기 부여', neuralDesc: '미래를 준비하는 설렘',
            metaCode: '사전 준비', metaDesc: '흥분을 행동 에너지로 전환'
        },
        // === C. 적응과 수정 (17-24) ===
        {
            id: 17, traditional: '택뢰수', hanja: '隨', stateCode: '적응적 팔로워십', stateCodeEn: 'Adaptive Followership',
            darkCode: '줏대 없음', darkDesc: '맹목적 추종',
            neuralCode: '유연성', neuralDesc: '흐름에 맞춰 이동',
            metaCode: '타이밍 동기화', metaDesc: '대세에 올라타기'
        },
        {
            id: 18, traditional: '산풍고', hanja: '蠱', stateCode: '디버깅 및 복구', stateCodeEn: 'Debug & Repair',
            darkCode: '부패', darkDesc: '방치된 문제의 악화',
            neuralCode: '쇄신', neuralDesc: '잘못된 패턴을 수정',
            metaCode: '과감한 개혁', metaDesc: '오류 코드를 삭제하고 재설치'
        },
        {
            id: 19, traditional: '지택임', hanja: '臨', stateCode: '적극적 개입', stateCodeEn: 'Active Engagement',
            darkCode: '간섭', darkDesc: '통제하려 듬, 오지랖',
            neuralCode: '리더십', neuralDesc: '현장을 지휘하고 책임짐',
            metaCode: '권한 위임', metaDesc: '적절히 개입하고 빠지기'
        },
        {
            id: 20, traditional: '풍지관', hanja: '觀', stateCode: '메타 인지 관찰', stateCodeEn: 'Meta-Observation',
            darkCode: '방관', darkDesc: '행동하지 않고 보기만 함',
            neuralCode: '통찰', neuralDesc: '전체를 조망하는 시야',
            metaCode: '객관화', metaDesc: '감정 없이 현상만 관찰'
        },
        {
            id: 21, traditional: '화뢰서합', hanja: '噬嗑', stateCode: '문제 해결 프로세스', stateCodeEn: 'Problem Solving',
            darkCode: '분노 표출', darkDesc: '파괴적 행동, 가혹함',
            neuralCode: '장애 제거', neuralDesc: '방해물을 확실히 처리',
            metaCode: '정의 구현', metaDesc: '원칙에 따라 명확히 처리'
        },
        {
            id: 22, traditional: '산화비', hanja: '賁', stateCode: '시각적 형상화', stateCodeEn: 'Visual Formatting',
            darkCode: '허영심', darkDesc: '내실 없는 겉치레',
            neuralCode: '미적 감각', neuralDesc: '형식을 다듬고 표현함',
            metaCode: '브랜딩', metaDesc: '가치를 시각적으로 증명'
        },
        {
            id: 23, traditional: '산지박', hanja: '剝', stateCode: '에너지 고갈 경고', stateCodeEn: 'Energy Depletion',
            darkCode: '박탈감', darkDesc: '기반이 무너지는 공포',
            neuralCode: '정리', neuralDesc: '불필요한 것 폐기',
            metaCode: '전원 차단', metaDesc: '모든 활동 중지 후 휴식'
        },
        {
            id: 24, traditional: '지뢰복', hanja: '復', stateCode: '뉴럴 리셋', stateCodeEn: 'Neural Reset',
            darkCode: '퇴행', darkDesc: '과거로 도피하려 함',
            neuralCode: '회복 탄력성', neuralDesc: '바닥 치고 올라오는 힘',
            metaCode: '재부팅', metaDesc: '새로운 사이클의 시작'
        },
        // === D. 위기와 본질 (25-32) ===
        {
            id: 25, traditional: '천뢰무망', hanja: '無妄', stateCode: '본연의 진정성', stateCodeEn: 'Authentic Self',
            darkCode: '작위적 행동', darkDesc: '억지, 부자연스러움',
            neuralCode: '진정성', neuralDesc: '있는 그대로의 자연스러움',
            metaCode: '무위', metaDesc: '흐름을 거스르지 않음'
        },
        {
            id: 26, traditional: '산천대축', hanja: '大畜', stateCode: '대용량 데이터 축적', stateCodeEn: 'Big Data Storage',
            darkCode: '억압', darkDesc: '감정을 쌓아두고 폭발',
            neuralCode: '축적', neuralDesc: '지식과 경험을 저장',
            metaCode: '역량 강화', metaDesc: '더 큰 목표를 위해 내공 쌓기'
        },
        {
            id: 27, traditional: '산뢰이', hanja: '頤', stateCode: '영양 및 양육', stateCodeEn: 'Nutri-Care',
            darkCode: '결핍감', darkDesc: '채워지지 않는 허기',
            neuralCode: '양육', neuralDesc: '자신과 타인을 기름',
            metaCode: '셀프 케어', metaDesc: '올바른 언어와 음식 섭취'
        },
        {
            id: 28, traditional: '택풍대과', hanja: '大過', stateCode: '시스템 과부하', stateCodeEn: 'System Overload',
            darkCode: '붕괴 위기', darkDesc: '감당 불가, 스트레스',
            neuralCode: '독립', neuralDesc: '홀로 무게를 견디는 힘',
            metaCode: '구조 조정', metaDesc: '짐을 덜어내고 우선순위 재설정'
        },
        {
            id: 29, traditional: '감위수', hanja: '坎', stateCode: '편도체 루프', stateCodeEn: 'Amygdala Loop',
            darkCode: '반추 사고', darkDesc: '불안의 반복, 함정',
            neuralCode: '심층 학습', neuralDesc: '위기를 통한 깊은 깨달음',
            metaCode: '존버', metaDesc: '믿음을 가지고 버티기'
        },
        {
            id: 30, traditional: '이위화', hanja: '離', stateCode: '인지 명료화', stateCodeEn: 'Cognitive Clarity',
            darkCode: '번아웃', darkDesc: '연료 고갈, 과민 반응',
            neuralCode: '명료성', neuralDesc: '지성과 열정의 활성화',
            metaCode: '지속 가능성', metaDesc: '열정의 불꽃을 조절하기'
        },
        {
            id: 31, traditional: '택산함', hanja: '咸', stateCode: '정서적 공명', stateCodeEn: 'Emotional Resonance',
            darkCode: '과민성', darkDesc: '외부 자극에 휘둘림',
            neuralCode: '공감', neuralDesc: '타인과 주파수를 맞춤',
            metaCode: '경청', metaDesc: '마음을 열고 느낌을 공유'
        },
        {
            id: 32, traditional: '뇌풍항', hanja: '恆', stateCode: '루틴의 지속성', stateCodeEn: 'Routine Consistency',
            darkCode: '지루함', darkDesc: '반복에 지쳐 포기함',
            neuralCode: '지속성', neuralDesc: '변함없는 꾸준함',
            metaCode: '항상성', metaDesc: '초심을 잃지 않고 유지'
        },
        // === E. 은둔과 확장 (33-40) ===
        {
            id: 33, traditional: '천산돈', hanja: '遯', stateCode: '전략적 철수', stateCodeEn: 'Strategic Withdrawal',
            darkCode: '도망', darkDesc: '책임 회피',
            neuralCode: '보존', neuralDesc: '불리할 때 물러남',
            metaCode: '거리 두기', metaDesc: '소모적인 관계 끊기'
        },
        {
            id: 34, traditional: '뇌천대장', hanja: '大壯', stateCode: '파워 서지', stateCodeEn: 'Power Surge',
            darkCode: '폭력성', darkDesc: '힘자랑, 무모한 돌진',
            neuralCode: '활력', neuralDesc: '넘치는 에너지',
            metaCode: '브레이크', metaDesc: '힘을 올바른 방향으로 제어'
        },
        {
            id: 35, traditional: '화지진', hanja: '晉', stateCode: '진보적 확장', stateCodeEn: 'Progressive Expansion',
            darkCode: '산만함', darkDesc: '너무 많은 일을 벌임',
            neuralCode: '진보', neuralDesc: '밝게 드러나고 나아감',
            metaCode: '공개 선언', metaDesc: '자신의 재능을 세상에 알림'
        },
        {
            id: 36, traditional: '지화명이', hanja: '明夷', stateCode: '다크 모드', stateCodeEn: 'Dark Mode',
            darkCode: '피해 의식', darkDesc: '세상이 나를 못 알아줌',
            neuralCode: '내공', neuralDesc: '어둠 속에서 실력 배양',
            metaCode: '은폐 엄폐', metaDesc: '빛을 감추고 때를 기다림'
        },
        {
            id: 37, traditional: '풍화가인', hanja: '家人', stateCode: '내부 안정화', stateCodeEn: 'Internal Stability',
            darkCode: '폐쇄성', darkDesc: '우리끼리만 뭉침',
            neuralCode: '안정', neuralDesc: '조직/가정의 결속',
            metaCode: '역할 분담', metaDesc: '각자의 위치를 지키기'
        },
        {
            id: 38, traditional: '화택규', hanja: '睽', stateCode: '시각차 불일치', stateCodeEn: 'Divergence',
            darkCode: '적대감', darkDesc: '다름을 틀림으로 간주',
            neuralCode: '다각화', neuralDesc: '서로 다른 관점의 공존',
            metaCode: '창조적 긴장', metaDesc: '차이를 통해 새로운 것 발견'
        },
        {
            id: 39, traditional: '수산건', hanja: '蹇', stateCode: '외부 장애물 감지', stateCodeEn: 'External Obstacle',
            darkCode: '좌절', darkDesc: '앞이 막혀 답답함',
            neuralCode: '성찰', neuralDesc: '내실을 다지는 기회',
            metaCode: '우회로 탐색', metaDesc: '멘토나 조력자를 찾기'
        },
        {
            id: 40, traditional: '뇌수해', hanja: '解', stateCode: '해소 및 해방', stateCodeEn: 'Stress Release',
            darkCode: '나태', darkDesc: '긴장이 풀려 늘어짐',
            neuralCode: '해방', neuralDesc: '문제가 해결되고 풀림',
            metaCode: '용서', metaDesc: '과거의 짐을 내려놓기'
        },
        // === F. 손익과 결단 (41-48) ===
        {
            id: 41, traditional: '산택손', hanja: '損', stateCode: '자발적 기여', stateCodeEn: 'Voluntary Sacrifice',
            darkCode: '자기 희생', darkDesc: '나를 갉아먹는 봉사',
            neuralCode: '기여', neuralDesc: '덜어내어 타인을 도움',
            metaCode: '투자', metaDesc: '미래를 위해 현재를 양보'
        },
        {
            id: 42, traditional: '풍뢰익', hanja: '益', stateCode: '이익 증대', stateCodeEn: 'Benefit Gain',
            darkCode: '이기심', darkDesc: '자기 이익만 챙김',
            neuralCode: '증식', neuralDesc: '자원이 늘어나고 유익함',
            metaCode: '재투자', metaDesc: '이익을 시스템 업그레이드에 사용'
        },
        {
            id: 43, traditional: '택천쾌', hanja: '夬', stateCode: '결단적 행동', stateCodeEn: 'Decisive Action',
            darkCode: '독설', darkDesc: '말로 상처를 줌',
            neuralCode: '결단', neuralDesc: '악습을 끊어내는 용기',
            metaCode: '공표', metaDesc: '문제를 공개적으로 처리'
        },
        {
            id: 44, traditional: '천풍구', hanja: '姤', stateCode: '우연한 조우', stateCodeEn: 'Unexpected Encounter',
            darkCode: '유혹', darkDesc: '나쁜 인연에 휘둘림',
            neuralCode: '기회', neuralDesc: '예기치 않은 만남',
            metaCode: '선별', metaDesc: '들어오는 것을 가려받기'
        },
        {
            id: 45, traditional: '택지췌', hanja: '萃', stateCode: '클러스터링', stateCodeEn: 'Clustering',
            darkCode: '군중 심리', darkDesc: '휩쓸림, 파벌',
            neuralCode: '결집', neuralDesc: '사람과 물자가 모임',
            metaCode: '구심점', metaDesc: '명확한 리더십으로 통솔'
        },
        {
            id: 46, traditional: '지풍승', hanja: '升', stateCode: '단계적 상승', stateCodeEn: 'Step-up Growth',
            darkCode: '맹신', darkDesc: '실력 없이 운만 믿음',
            neuralCode: '성장', neuralDesc: '순차적으로 올라감',
            metaCode: '꾸준함', metaDesc: '멈추지 않고 계속 오르기'
        },
        {
            id: 47, traditional: '택수곤', hanja: '困', stateCode: '인지 고갈', stateCodeEn: 'Mental Exhaustion',
            darkCode: '절망', darkDesc: '탈출구가 없다고 믿음',
            neuralCode: '단련', neuralDesc: '정신적 근육을 키움',
            metaCode: '무언', metaDesc: '말을 줄이고 내면을 관찰'
        },
        {
            id: 48, traditional: '수풍정', hanja: '井', stateCode: '심층 자원', stateCodeEn: 'Deep Resource',
            darkCode: '고정관념', darkDesc: '우물 안 개구리',
            neuralCode: '지혜', neuralDesc: '마르지 않는 영감',
            metaCode: '공유', metaDesc: '지혜를 퍼서 사람들과 나눔'
        },
        // === G. 혁신과 완성 (49-64) ===
        {
            id: 49, traditional: '택화혁', hanja: '革', stateCode: '패러다임 전환', stateCodeEn: 'Paradigm Shift',
            darkCode: '불안정', darkDesc: '변화에 대한 공포',
            neuralCode: '혁신', neuralDesc: '낡은 껍질을 벗음',
            metaCode: '타이밍', metaDesc: '확신이 섰을 때 뒤집기'
        },
        {
            id: 50, traditional: '화풍정', hanja: '鼎', stateCode: '연금술 프로세스', stateCodeEn: 'Alchemy Process',
            darkCode: '변질', darkDesc: '본질을 잃고 섞임',
            neuralCode: '융합', neuralDesc: '새로운 가치 창조',
            metaCode: '창조', metaDesc: '서로 다른 것을 섞어 요리함'
        },
        {
            id: 51, traditional: '중뢰진', hanja: '震', stateCode: '충격 파동', stateCodeEn: 'Shock Wave',
            darkCode: '공황', darkDesc: '놀라서 허둥지둥함',
            neuralCode: '각성', neuralDesc: '충격으로 정신이 깸',
            metaCode: '자기 점검', metaDesc: '놀란 가슴을 진정시키고 복구'
        },
        {
            id: 52, traditional: '중산간', hanja: '艮', stateCode: '멈춤과 성찰', stateCodeEn: 'Stop & Reflection',
            darkCode: '고집', darkDesc: '소통 불가, 꽉 막힘',
            neuralCode: '현존', neuralDesc: '지금 이 순간에 머무름',
            metaCode: '마음챙김', metaDesc: '움직임을 멈추고 내면 보기'
        },
        {
            id: 53, traditional: '풍산점', hanja: '漸', stateCode: '점진적 진행', stateCodeEn: 'Gradual Progress',
            darkCode: '지지부진', darkDesc: '너무 느려서 답답함',
            neuralCode: '순서', neuralDesc: '단계를 밟아 나아감',
            metaCode: '원칙 고수', metaDesc: '지름길 대신 정석대로'
        },
        {
            id: 54, traditional: '뇌택귀매', hanja: '歸妹', stateCode: '서브루틴 오류', stateCodeEn: 'Sub-routine Error',
            darkCode: '부적절', darkDesc: '위치와 순서가 틀림',
            neuralCode: '차선', neuralDesc: '주연이 아닌 조연',
            metaCode: '현실 파악', metaDesc: '욕심을 버리고 상황 인정'
        },
        {
            id: 55, traditional: '뇌화풍', hanja: '豐', stateCode: '최대 풍요', stateCodeEn: 'Maximum Abundance',
            darkCode: '방탕', darkDesc: '성공에 취해 흥청망청',
            neuralCode: '전성기', neuralDesc: '가장 빛나는 시기',
            metaCode: '관리', metaDesc: '해가 지기 전에 대비하기'
        },
        {
            id: 56, traditional: '화산려', hanja: '旅', stateCode: '노마드 모드', stateCodeEn: 'Nomad Mode',
            darkCode: '불안정', darkDesc: '정착하지 못하고 떠돎',
            neuralCode: '탐험', neuralDesc: '낯선 곳에서의 배움',
            metaCode: '적응', metaDesc: '어디서든 살아남는 유연함'
        },
        {
            id: 57, traditional: '중풍손', hanja: '巽', stateCode: '유연한 침투', stateCodeEn: 'Gentle Penetration',
            darkCode: '우유부단', darkDesc: '결정 못 하고 흔들림',
            neuralCode: '스며듦', neuralDesc: '부드럽게 영향력 행사',
            metaCode: '반복', metaDesc: '꾸준한 명령으로 시스템 변경'
        },
        {
            id: 58, traditional: '중택태', hanja: '兌', stateCode: '즐거운 교류', stateCodeEn: 'Joyful Interaction',
            darkCode: '구설수', darkDesc: '말실수, 가벼움',
            neuralCode: '기쁨', neuralDesc: '소통하고 만족함',
            metaCode: '긍정 언어', metaDesc: '사람을 살리는 말을 하기'
        },
        {
            id: 59, traditional: '풍수환', hanja: '渙', stateCode: '확산 및 해체', stateCodeEn: 'Dispersion',
            darkCode: '흩어짐', darkDesc: '집중력 저하, 이별',
            neuralCode: '순환', neuralDesc: '막힌 것을 뚫어줌',
            metaCode: '해소', metaDesc: '응어리진 감정을 풀어냄'
        },
        {
            id: 60, traditional: '수택절', hanja: '節', stateCode: '절제 및 한계', stateCodeEn: 'Regulation & Limit',
            darkCode: '억압', darkDesc: '숨 막히는 통제',
            neuralCode: '규율', neuralDesc: '마디를 짓고 완성함',
            metaCode: '절제', metaDesc: '스스로 한계를 설정하여 보호'
        },
        {
            id: 61, traditional: '풍택중부', hanja: '中孚', stateCode: '내적 진실성', stateCodeEn: 'Inner Integrity',
            darkCode: '맹신', darkDesc: '사기 당함, 착각',
            neuralCode: '진실', neuralDesc: '마음의 중심이 잡힘',
            metaCode: '신뢰 회복', metaDesc: '언행일치로 믿음 얻기'
        },
        {
            id: 62, traditional: '뇌산소과', hanja: '小過', stateCode: '미세 조정', stateCodeEn: 'Micro-Adjustment',
            darkCode: '소심함', darkDesc: '지나친 눈치 보기',
            neuralCode: '디테일', neuralDesc: '작은 것을 소중히 함',
            metaCode: '낮은 자세', metaDesc: '몸을 낮추고 실속 챙기기'
        },
        {
            id: 63, traditional: '수화기제', hanja: '旣濟', stateCode: '항상성 유지', stateCodeEn: 'Homeostasis',
            darkCode: '정체', darkDesc: '변화 거부, 매너리즘',
            neuralCode: '완성', neuralDesc: '시스템 최적화 완료',
            metaCode: '유지 보수', metaDesc: '오류가 없도록 계속 점검'
        },
        {
            id: 64, traditional: '화수미제', hanja: '未濟', stateCode: '개방형 프로세스', stateCodeEn: 'Open-Ended Process',
            darkCode: '혼란', darkDesc: '끝이 안 보여 막막함',
            neuralCode: '가능성', neuralDesc: '새로운 시작의 설렘',
            metaCode: '성장 마인드', metaDesc: '실패를 과정으로 인식하기'
        },
    ];

    /** 전통 이름으로 조회 */
    static getByTraditional(name: string): MentalStateCode | undefined {
        return this.MENTAL_STATES.find(t => t.traditional === name);
    }

    /** ID로 조회 */
    static getById(id: number): MentalStateCode | undefined {
        return this.MENTAL_STATES.find(t => t.id === id);
    }

    /** AI 프롬프트 주입용 3단계 분석 코드 사전 생성 */
    static generatePromptDictionary(): string {
        let dict = `\n[🔮 64 멘탈 상태 진단 코드 — 3단계 분석 시스템 (Mental State Diagnostic)]\n`;
        dict += `**절대 규칙**: 주역/괘 관련 전통 용어를 사용자에게 직접 노출하지 마십시오.\n`;
        dict += `반드시 아래 '멘탈 상태 코드'로 변환하고, 3단계(Dark/Neural/Meta)로 분석하십시오.\n`;
        dict += `예: "감위수(坎)괘입니다" (❌) → "현재 편도체 루프(Amygdala Loop) 상태가 감지됩니다" (✅)\n\n`;
        dict += `**출력 포맷:**\n`;
        dict += `- [타이틀] 현재 당신의 뇌 상태: **{멘탈 코드명}**\n`;
        dict += `- [🔴 주의] {Dark Code} 증상이 감지될 수 있습니다 — {설명}\n`;
        dict += `- [🟢 기회] {Neural Code} 회로를 활성화할 수 있습니다 — {설명}\n`;
        dict += `- [🔵 솔루션] {Meta Code} 모드로 전환하십시오 — {설명}\n\n`;

        for (const s of this.MENTAL_STATES) {
            dict += `**${s.id}.${s.traditional}(${s.hanja})** → **"${s.stateCode}" (${s.stateCodeEn})**\n`;
            dict += `  🔴 Dark: ${s.darkCode} — ${s.darkDesc}\n`;
            dict += `  🟢 Neural: ${s.neuralCode} — ${s.neuralDesc}\n`;
            dict += `  🔵 Meta: ${s.metaCode} — ${s.metaDesc}\n\n`;
        }
        return dict;
    }
}
