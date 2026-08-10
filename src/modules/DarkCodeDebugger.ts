/**
 * DarkCodeDebugger.ts
 * 60갑자 다크 코드 디버깅 엔진
 * 
 * 사용자의 단점을 "성격 결함"이 아닌 "시스템 버그"로 프레이밍
 * → 죄책감 없이 디버깅(개선)에 참여하도록 유도
 * 
 * CBT(인지행동코칭) 기반: 객관화 → 분석 → 패치
 * 
 * ⚠️ 독립 모듈 — 기존 챗봇 시스템에 영향 없음
 */

export interface DarkCodeEntry {
    id: number;
    errorCode: string;
    diagnosis: string;
    patch: string;
    group: string;
    symptom: string;
}

export class DarkCodeDebugger {

    static readonly DARK_CODES: DarkCodeEntry[] = [
        // === 🌱 갑(甲): 시작과 추진의 오류 ===
        {
            id: 1, errorCode: 'Early_Burnout', group: 'Pioneer', symptom: '조급함',
            diagnosis: '의욕 과다로 초반에 모든 연료를 소진하여 방전됨.',
            patch: '에너지 분배 로직 재설정'
        },
        {
            id: 11, errorCode: 'Isolation_Wall', group: 'Pioneer', symptom: '독단',
            diagnosis: '타인의 도움을 거절하고 독단적으로 고립을 자초함.',
            patch: '협업 프로토콜 활성화'
        },
        {
            id: 21, errorCode: 'Conflict_Error', group: 'Pioneer', symptom: '마찰',
            diagnosis: '기존 질서를 무시하고 부딪혀 불필요한 마찰음 발생.',
            patch: '속도 조절 및 완충 장치 설치'
        },
        {
            id: 31, errorCode: 'Impulse_Leak', group: 'Pioneer', symptom: '말실수',
            diagnosis: '필터링 없는 언행으로 설화(말실수) 데이터 유출.',
            patch: '언어 출력 지연(Latency) 설정'
        },
        {
            id: 41, errorCode: 'Over_Spec', group: 'Pioneer', symptom: '과대망상',
            diagnosis: '현실성 없는 너무 큰 목표만 세우다 실행 불가 상태.',
            patch: '목표 세분화(Chunking)'
        },
        {
            id: 51, errorCode: 'Rigid_Frame', group: 'Pioneer', symptom: '경직',
            diagnosis: '유연성이 부족하여 강한 충격에 부러질 위험.',
            patch: '유연성(Flexibility) 모듈 탑재'
        },

        // === 🌿 을(乙): 관계와 적응의 오류 ===
        {
            id: 2, errorCode: 'Frozen_Sentiment', group: 'Networker', symptom: '억압',
            diagnosis: '감정을 억압하다 내부 시스템 과부하(화병) 발생.',
            patch: '감정 배출구(Vent) 개방'
        },
        {
            id: 12, errorCode: 'Drifting_Mode', group: 'Networker', symptom: '불안정',
            diagnosis: '한곳에 정착하지 못하고 목적 없이 부유함.',
            patch: '앵커링(Anchoring) 포인트 설정'
        },
        {
            id: 22, errorCode: 'Self_Injury', group: 'Networker', symptom: '자해적사고',
            diagnosis: '예민한 칼날을 자신에게 겨누어 자존감을 깎아먹음.',
            patch: '자기 자비(Self-Compassion)'
        },
        {
            id: 32, errorCode: 'Anxiety_Loop', group: 'Networker', symptom: '걱정',
            diagnosis: '일어나지 않은 미래를 걱정하느라 CPU 점유율 낭비.',
            patch: '\'지금-여기\' 포커싱 훈련'
        },
        {
            id: 42, errorCode: 'Show_off_Bug', group: 'Networker', symptom: '허세',
            diagnosis: '내실보다 보여지는 허세와 겉치레에 리소스 낭비.',
            patch: '내면 가치 인덱싱(Indexing)'
        },
        {
            id: 52, errorCode: 'Dependence_Trap', group: 'Networker', symptom: '의존',
            diagnosis: '타인에게 과도하게 의존하여 독자 생존 불가.',
            patch: '자립성(Autonomy) 강화'
        },

        // === 🔥 병(丙): 발산과 열정의 오류 ===
        {
            id: 3, errorCode: 'Manic_Phase', group: 'Visionary', symptom: '조울',
            diagnosis: '감정의 고저가 심해 일관성 있는 퍼포먼스 불가.',
            patch: '감정 평형 유지(EQ) 훈련'
        },
        {
            id: 13, errorCode: 'Panic_Disorder', group: 'Visionary', symptom: '공포',
            diagnosis: '보이지 않는 불안과 공포에 압도되어 시스템 다운.',
            patch: '명상 및 호흡 안정화'
        },
        {
            id: 23, errorCode: 'Sunset_Depression', group: 'Visionary', symptom: '공허',
            diagnosis: '화려한 활동 후 찾아오는 급격한 공허함과 우울.',
            patch: '회복 탄력성 루틴 실행'
        },
        {
            id: 33, errorCode: 'Fake_Persona', group: 'Visionary', symptom: '기회주의',
            diagnosis: '이익을 위해 진심 없는 가면을 쓰고 인간관계 계산.',
            patch: '진정성(Authenticity) 회복'
        },
        {
            id: 43, errorCode: 'Overheating', group: 'Visionary', symptom: '독선',
            diagnosis: '독선과 다혈질로 주변 관계를 태워버림.',
            patch: '쿨링 시스템(Cooling) 가동'
        },
        {
            id: 53, errorCode: 'Illusion_Error', group: 'Visionary', symptom: '몽상',
            diagnosis: '실체 없는 허상을 쫓으며 현실 감각 상실.',
            patch: '현실 검증(Reality Check)'
        },

        // === 🕯️ 정(丁): 집중과 집착의 오류 ===
        {
            id: 4, errorCode: 'Nervous_Break', group: 'Analyst', symptom: '예민',
            diagnosis: '작은 자극에도 신경이 곤두서서 시스템 불안정.',
            patch: '둔감력(Desensitization) 훈련'
        },
        {
            id: 14, errorCode: 'Obsession_Loop', group: 'Analyst', symptom: '집착',
            diagnosis: '과거의 상처나 원망을 무한 반복 재생(Replay).',
            patch: '과거 데이터 포맷(Format)'
        },
        {
            id: 24, errorCode: 'Reality_Escape', group: 'Analyst', symptom: '도피',
            diagnosis: '현실의 문제를 회피하고 환상이나 종교로 도피.',
            patch: '그라운딩(Grounding) 기법'
        },
        {
            id: 34, errorCode: 'Critical_Bug', group: 'Analyst', symptom: '비판',
            diagnosis: '타인의 결점만 찾아내어 비판하는 오류 탐지 과다.',
            patch: '칭찬 알고리즘 설치'
        },
        {
            id: 44, errorCode: 'Dryout_Warning', group: 'Analyst', symptom: '냉담',
            diagnosis: '감정이 메말라 타인의 고통에 무감각해짐.',
            patch: '공감 뉴런 재활성화'
        },
        {
            id: 54, errorCode: 'Tunnel_Vision', group: 'Analyst', symptom: '맹목',
            diagnosis: '하나에 꽂혀 주변 상황을 전혀 보지 못하는 맹목성.',
            patch: '광각 렌즈(Wide View) 전환'
        },

        // === ⛰️ 무(戊): 고집과 정체의 오류 ===
        {
            id: 5, errorCode: 'Stubborn_Rock', group: 'Platform', symptom: '불통',
            diagnosis: '입력값을 거부하고 자신의 방식만 고집하는 불통.',
            patch: '개방성(Openness) 업데이트'
        },
        {
            id: 15, errorCode: 'Power_Struggle', group: 'Platform', symptom: '권위주의',
            diagnosis: '자신의 힘을 과시하고 타인을 찍어누르려는 권위주의.',
            patch: '서번트 리더십 모듈'
        },
        {
            id: 25, errorCode: 'Miser_Logic', group: 'Platform', symptom: '인색',
            diagnosis: '지나치게 이해타산을 따져 인색하게 구는 계산 오류.',
            patch: '나눔(Sharing) 프로토콜'
        },
        {
            id: 35, errorCode: 'Dogmatic_Error', group: 'Platform', symptom: '원칙고수',
            diagnosis: '융통성 없이 원칙만 내세워 조직을 경직시킴.',
            patch: '유연한 사고 훈련'
        },
        {
            id: 45, errorCode: 'Isolation_Mode', group: 'Platform', symptom: '폐쇄',
            diagnosis: '타인과 섞이지 않고 스스로를 고립시키는 폐쇄성.',
            patch: '소셜 네트워크 접속'
        },
        {
            id: 55, errorCode: 'Eruption_Risk', group: 'Platform', symptom: '분노폭발',
            diagnosis: '참고 참다가 한 번에 폭발하여 관계를 파괴함.',
            patch: '감정 압력 밸브 조절'
        },

        // === 🪴 기(己): 의심과 소극성의 오류 ===
        {
            id: 6, errorCode: 'Suspicion_Bug', group: 'Manager', symptom: '의심',
            diagnosis: '타인의 호의를 믿지 못하고 의심하는 불안 회로.',
            patch: '신뢰 데이터 축적'
        },
        {
            id: 16, errorCode: 'Sensitivity_Spike', group: 'Manager', symptom: '위축',
            diagnosis: '스트레스 저항성이 낮아 쉽게 상처받고 위축됨.',
            patch: '멘탈 방화벽 강화'
        },
        {
            id: 26, errorCode: 'Passive_Aggressive', group: 'Manager', symptom: '수동공격',
            diagnosis: '불만을 직접 말하지 않고 뒤에서 은근히 표출함.',
            patch: '솔직한 의사소통(Assertiveness)'
        },
        {
            id: 36, errorCode: 'Identity_Loss', group: 'Manager', symptom: '우유부단',
            diagnosis: '주관 없이 이리저리 휩쓸리는 우유부단함.',
            patch: '가치관(Value) 재설정'
        },
        {
            id: 46, errorCode: 'Cold_Cut', group: 'Manager', symptom: '냉정',
            diagnosis: '이익이 되지 않으면 가차 없이 관계를 끊는 냉정함.',
            patch: '인간애(Humanity) 복원'
        },
        {
            id: 56, errorCode: 'Victim_Mentality', group: 'Manager', symptom: '피해의식',
            diagnosis: '자신만 고생한다고 생각하는 피해의식 바이러스.',
            patch: '감사 일기(Gratitude) 쓰기'
        },

        // === ⚔️ 경(庚): 공격과 무모의 오류 ===
        {
            id: 7, errorCode: 'Naked_Vulnerability', group: 'Executor', symptom: '이중성',
            diagnosis: '겉은 강해 보이나 속은 여려서 쉽게 무너지는 이중성.',
            patch: '내면 아이(Inner Child) 치유'
        },
        {
            id: 17, errorCode: 'Bulldozer_Error', group: 'Executor', symptom: '독주',
            diagnosis: '주변의 피해를 무시하고 목표만 향해 밀어붙임.',
            patch: '주변 스캐닝 기능 탑재'
        },
        {
            id: 27, errorCode: 'Hasty_Crash', group: 'Executor', symptom: '무모',
            diagnosis: '앞뒤 안 가리고 덤비다 사고를 치는 무모함.',
            patch: '브레이크 시스템 점검'
        },
        {
            id: 37, errorCode: 'Cynical_Virus', group: 'Executor', symptom: '냉소',
            diagnosis: '모든 것을 부정적이고 냉소적으로 보는 시각 오류.',
            patch: '긍정 필터 렌즈 장착'
        },
        {
            id: 47, errorCode: 'Violent_Trigger', group: 'Executor', symptom: '공격성',
            diagnosis: '자존심을 건드리면 폭력적으로 반응하는 공격성.',
            patch: '분노 조절 프로그램'
        },
        {
            id: 57, errorCode: 'Dictator_Mode', group: 'Executor', symptom: '독재',
            diagnosis: '타인을 통제하고 지배하려는 독재자적 성향.',
            patch: '경청(Listening) 모드 전환'
        },

        // === 💎 신(辛): 예민과 단절의 오류 ===
        {
            id: 8, errorCode: 'Stress_Fracture', group: 'Specialist', symptom: '붕괴',
            diagnosis: '내면의 압박을 견디다 멘탈이 산산조각 남.',
            patch: '스트레스 완화 루틴'
        },
        {
            id: 18, errorCode: 'Suspicion_Loop', group: 'Specialist', symptom: '시험',
            diagnosis: '상대를 시험하고 끊임없이 의심하는 테스팅 오류.',
            patch: '믿음의 도약(Leap of Faith)'
        },
        {
            id: 28, errorCode: 'Nervous_Spasm', group: 'Specialist', symptom: '변덕',
            diagnosis: '감정 기복이 심하고 변덕스러운 히스테리 증상.',
            patch: '감정 안정제(Serenity)'
        },
        {
            id: 38, errorCode: 'Cold_Wall', group: 'Specialist', symptom: '단절',
            diagnosis: '마음의 문을 닫고 누구와도 소통하지 않는 냉담함.',
            patch: '온정(Warmth) 주입'
        },
        {
            id: 48, errorCode: 'Sharp_Tongue', group: 'Specialist', symptom: '독설',
            diagnosis: '날카로운 말로 타인의 가슴에 비수를 꽂음.',
            patch: '비폭력 대화법(NVC)'
        },
        {
            id: 58, errorCode: 'Isolation_Cut', group: 'Specialist', symptom: '결벽',
            diagnosis: '자신의 기준에 안 맞으면 모두 잘라내는 결벽증.',
            patch: '포용력(Tolerance) 확장'
        },

        // === 🌊 임(壬): 음흉과 과잉의 오류 ===
        {
            id: 9, errorCode: 'Over_Thinking', group: 'Strategist', symptom: '과사고',
            diagnosis: '행동하지 않고 머릿속으로 시뮬레이션만 돌림.',
            patch: '즉각 실행(Just Do It)'
        },
        {
            id: 19, errorCode: 'Chaos_Mode', group: 'Strategist', symptom: '혼란',
            diagnosis: '이성과 감성이 충돌하여 혼란스러운 상태 지속.',
            patch: '중심 잡기(Centering)'
        },
        {
            id: 29, errorCode: 'Dark_Swamp', group: 'Strategist', symptom: '음흉',
            diagnosis: '속내를 알 수 없는 비밀스러움과 음흉함.',
            patch: '투명성(Transparency) 확보'
        },
        {
            id: 39, errorCode: 'Intellectual_Snob', group: 'Strategist', symptom: '오만',
            diagnosis: '아는 척하며 타인을 무시하는 지적 오만함.',
            patch: '겸손(Humility) 미덕 장착'
        },
        {
            id: 49, errorCode: 'Flood_Damage', group: 'Strategist', symptom: '범람',
            diagnosis: '감정이 범람하여 주변 사람들을 힘들게 함.',
            patch: '감정의 댐(Dam) 건설'
        },
        {
            id: 59, errorCode: 'Secret_Vault', group: 'Strategist', symptom: '음모론',
            diagnosis: '지나치게 비밀이 많고 음모론적인 사고방식.',
            patch: '신뢰 공유 네트워크'
        },

        // === 💧 계(癸): 우울과 계산의 오류 ===
        {
            id: 10, errorCode: 'Sterile_Room', group: 'Healer', symptom: '결벽',
            diagnosis: '결벽증적으로 타인을 배척하는 차가운 완벽주의.',
            patch: '인간적 허술함 수용'
        },
        {
            id: 20, errorCode: 'Sacrifice_Bug', group: 'Healer', symptom: '자기희생',
            diagnosis: '남 챙기느라 자신은 돌보지 않는 희생자 코스프레.',
            patch: '자기 돌봄(Self-Care) 우선'
        },
        {
            id: 30, errorCode: 'Chameleon_Error', group: 'Healer', symptom: '변절',
            diagnosis: '상황에 따라 말을 바꾸는 기회주의적 태도.',
            patch: '일관성(Consistency) 유지'
        },
        {
            id: 40, errorCode: 'Fragile_Glass', group: 'Healer', symptom: '유리멘탈',
            diagnosis: '현실 감각이 부족하고 유리 멘탈로 쉽게 깨짐.',
            patch: '멘탈 강화(Hardening)'
        },
        {
            id: 50, errorCode: 'Frozen_Dark', group: 'Healer', symptom: '우울',
            diagnosis: '깊고 어두운 우울의 늪에 빠져 헤어 나오지 못함.',
            patch: '빛(Hope)을 찾는 활동'
        },
        {
            id: 60, errorCode: 'Black_Hole', group: 'Healer', symptom: '탐욕',
            diagnosis: '모든 것을 빨아들이고 내놓지 않는 과도한 욕심.',
            patch: '비움과 순환(Flow)'
        },
    ];

    static getById(id: number): DarkCodeEntry | undefined {
        return this.DARK_CODES.find(c => c.id === id);
    }

    static getByErrorCode(code: string): DarkCodeEntry | undefined {
        return this.DARK_CODES.find(c => c.errorCode === code);
    }

    /** AI 프롬프트 주입용 다크 코드 디버깅 프로토콜 */
    static generatePromptProtocol(): string {
        let p = `\n[⚠️ 다크 코드 디버깅 엔진 (Dark Code Debugger)]\n`;
        p += `**UX 프레임:** "⚠️ 시스템 경고: [Dark Code] 감지. 최적화하시겠습니까?"\n`;
        p += `**핵심 원칙:** 단점은 "결함"이 아닌 "일시적 시스템 오류(Bug)"로 프레이밍\n\n`;
        p += `**분석 → 패치 프로토콜:**\n`;
        p += `1. 사용자의 부정적 패턴 감지 시 해당 다크 코드 식별\n`;
        p += `2. "현재 [Error Code] 버그가 활성화된 상태입니다" 로 분석\n`;
        p += `3. 구체적인 디버깅 솔루션(Patch)을 코칭으로 제공\n\n`;

        for (const d of this.DARK_CODES) {
            p += `[${d.errorCode}] → 분석: ${d.diagnosis} → 패치: ${d.patch}\n`;
        }
        return p;
    }
}
