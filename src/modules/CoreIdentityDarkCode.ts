/**
 * CoreIdentityDarkCode.ts
 * 일주(Core Identity) 전용 다크 코드
 * 
 * "나 자신(Self)"의 본질적 취약점 + "배우자(Partner)" 관계 오류
 * UX: "⚠️ 코어 시스템 경고 (Kernel Panic)" / "⚠️ 자아 정체성 오류"
 * 
 * ⚠️ 독립 모듈 — 기존 챗봇 시스템에 영향 없음
 */

export interface CoreDarkCode {
    id: number;
    errorName: string;
    varName: string;
    diagnosis: string;
    group: string;
    symptom: string;
}

export class CoreIdentityDarkCode {

    static readonly CORE_CODES: CoreDarkCode[] = [
        // === 🌱 갑(甲): 자존심과 경직(Stiffness) 오류 ===
        {
            id: 1, errorName: '뿌리 없는 나무', varName: 'Rootless_OS', group: 'Pioneer', symptom: '변덕',
            diagnosis: '주관이 흔들리고 변덕이 심해 한 길을 못 감. (부부 불안)'
        },
        {
            id: 11, errorName: '건조한 번아웃', varName: 'Burnout_Loop', group: 'Pioneer', symptom: '집착',
            diagnosis: '성과에 집착하다 스스로와 배우자를 말라 죽게 함.'
        },
        {
            id: 21, errorName: '자기 절단', varName: 'Self_Cut_Error', group: 'Pioneer', symptom: '극단',
            diagnosis: '스트레스를 받으면 자학하거나 관계를 끊어버리는 극단성.'
        },
        {
            id: 31, errorName: '성급한 과부하', varName: 'Over_Clocking', group: 'Pioneer', symptom: '조급',
            diagnosis: '결과를 너무 빨리 보려다 일을 그르치는 조급증.'
        },
        {
            id: 41, errorName: '자아 비대증', varName: 'Ego_Bloat', group: 'Pioneer', symptom: '오만',
            diagnosis: '자신의 능력을 과신하여 타인을 무시하는 오만함.'
        },
        {
            id: 51, errorName: '절대 고집', varName: 'Rigid_Core', group: 'Pioneer', symptom: '타협불가',
            diagnosis: '부러질지언정 굽히지 않아 배우자와의 타협이 불가능함.'
        },

        // === 🌿 을(乙): 의존과 신경증(Neurosis) 오류 ===
        {
            id: 2, errorName: '냉동된 감정', varName: 'Cold_Boot_Fail', group: 'Networker', symptom: '꽁함',
            diagnosis: '속내를 드러내지 않고 꽁해 있다가 뒤늦게 폭발함.'
        },
        {
            id: 12, errorName: '부유하는 영혼', varName: 'Drifting_Identity', group: 'Networker', symptom: '방랑',
            diagnosis: '현실 감각이 부족하고 이상향만 쫓아다니는 방랑벽.'
        },
        {
            id: 22, errorName: '신경 쇠약', varName: 'Nervous_Breakdown', group: 'Networker', symptom: '예민',
            diagnosis: '예민함이 극에 달해 배우자에게 날카로운 말을 쏟아냄.'
        },
        {
            id: 32, errorName: '불안한 공회전', varName: 'Anxiety_Spin', group: 'Networker', symptom: '강박',
            diagnosis: '사소한 일에도 걱정이 꼬리를 물어 밤잠을 설치는 강박.'
        },
        {
            id: 42, errorName: '허영심 바이러스', varName: 'Vanity_Virus', group: 'Networker', symptom: '허영',
            diagnosis: '남에게 보여지는 모습에 치중하느라 내실을 다지지 못함.'
        },
        {
            id: 52, errorName: '집착의 덩굴', varName: 'Dependency_Link', group: 'Networker', symptom: '집착',
            diagnosis: '파트너에게 과도하게 집착하고 소유하려는 의존성.'
        },

        // === 🔥 병(丙): 감정 기복과 과시(Show) 오류 ===
        {
            id: 3, errorName: '조증 모드', varName: 'Manic_Start', group: 'Visionary', symptom: '용두사미',
            diagnosis: '시작은 창대하나 끝이 미약한 전형적인 용두사미.'
        },
        {
            id: 13, errorName: '그림자 자아', varName: 'Shadow_Self', group: 'Visionary', symptom: '이중성',
            diagnosis: '밝은 겉모습 뒤에 숨겨진 깊은 우울감과 이중성.'
        },
        {
            id: 23, errorName: '황혼의 우울', varName: 'Sunset_Blues', group: 'Visionary', symptom: '과거집착',
            diagnosis: '화려했던 과거에 갇혀 현재의 초라함을 견디지 못함.'
        },
        {
            id: 33, errorName: '가면 증후군', varName: 'Masking_Glitch', group: 'Visionary', symptom: '가면',
            diagnosis: '이득을 위해 연기하며 진실된 관계를 맺지 않음.'
        },
        {
            id: 43, errorName: '과열 폭발', varName: 'Super_Heated', group: 'Visionary', symptom: '다혈질',
            diagnosis: '자존심을 건드리면 물불 안 가리고 폭발하는 다혈질.'
        },
        {
            id: 53, errorName: '현실 왜곡', varName: 'Illusion_Mode', group: 'Visionary', symptom: '합리화',
            diagnosis: '자신의 잘못을 인정하지 않고 상황을 합리화하는 망상.'
        },

        // === 🕯️ 정(丁): 집착과 소심(Narrow) 오류 ===
        {
            id: 4, errorName: '민감 센서', varName: 'Sensitive_Sensor', group: 'Analyst', symptom: '과민',
            diagnosis: '배우자의 사소한 표정 변화에도 의미를 부여하고 상처받음.'
        },
        {
            id: 14, errorName: '원망 저장소', varName: 'Grudge_Storage', group: 'Analyst', symptom: '원망',
            diagnosis: '과거의 서운한 일을 절대 잊지 않고 꺼내어 복수함.'
        },
        {
            id: 24, errorName: '현실 이탈', varName: 'Reality_Disconnect', group: 'Analyst', symptom: '도피',
            diagnosis: '영적인 세계나 종교에 심취하여 현실 가정을 등한시함.'
        },
        {
            id: 34, errorName: '날선 비평가', varName: 'Sharp_Critic', group: 'Analyst', symptom: '검열',
            diagnosis: '완벽주의 성향으로 자신과 타인을 끊임없이 검열함.'
        },
        {
            id: 44, errorName: '감정 고갈', varName: 'Dry_Out', group: 'Analyst', symptom: '무감각',
            diagnosis: '희생하다 지쳐버려 아무런 감정도 느끼지 못하는 상태.'
        },
        {
            id: 54, errorName: '터널 시야', varName: 'Tunnel_Vision_Core', group: 'Analyst', symptom: '집착',
            diagnosis: '한 사람이나 목표에 꽂히면 주변을 다 태워버리는 집착.'
        },

        // === ⛰️ 무(戊): 불통과 고립(Isolation) 오류 ===
        {
            id: 5, errorName: '옹고집 블록', varName: 'Stubborn_Block', group: 'Platform', symptom: '타협불가',
            diagnosis: '누가 뭐라 해도 내 갈 길만 가는 타협 불가 상태.'
        },
        {
            id: 15, errorName: '권력 중독', varName: 'Power_Trip', group: 'Platform', symptom: '지배',
            diagnosis: '가정이나 관계에서 우위를 점하고 지배하려는 성향.'
        },
        {
            id: 25, errorName: '구두쇠 로직', varName: 'Miser_Lock', group: 'Platform', symptom: '인색',
            diagnosis: '돈에 너무 집착하여 인간관계의 정을 잃어버림.'
        },
        {
            id: 35, errorName: '고립된 성벽', varName: 'Isolation_Wall_Core', group: 'Platform', symptom: '폐쇄',
            diagnosis: '마음의 문을 닫고 누구도 들여보내지 않는 폐쇄성.'
        },
        {
            id: 45, errorName: '고독한 천재', varName: 'Loner_Protocol', group: 'Platform', symptom: '고독',
            diagnosis: '타인과 어울리기보다 혼자만의 세계에 갇힘. (배우자 외로움)'
        },
        {
            id: 55, errorName: '마그마 분출', varName: 'Magma_Burst', group: 'Platform', symptom: '폭발',
            diagnosis: '평소엔 과묵하다가 한 번 화나면 걷잡을 수 없음.'
        },

        // === 🪴 기(己): 의심과 자기비하(Self-Pity) 오류 ===
        {
            id: 6, errorName: '의심 스캐너', varName: 'Suspicion_Scan', group: 'Manager', symptom: '의심',
            diagnosis: '사랑받고 있는지 끊임없이 확인하고 의심하는 불안.'
        },
        {
            id: 16, errorName: '스트레스 스파이크', varName: 'Stress_Spike', group: 'Manager', symptom: '취약',
            diagnosis: '멘탈이 약해 작은 충격에도 무너지고 회피함.'
        },
        {
            id: 26, errorName: '침묵의 폭탄', varName: 'Silent_Bomb', group: 'Manager', symptom: '수동공격',
            diagnosis: '불만을 말로 하지 않고 행동으로 보여주는 수동 공격성.'
        },
        {
            id: 36, errorName: '혼란 매트릭스', varName: 'Confusion_Matrix', group: 'Manager', symptom: '우유부단',
            diagnosis: '주관이 뚜렷하지 않아 이성 문제나 선택에서 우유부단함.'
        },
        {
            id: 46, errorName: '냉소적 절단', varName: 'Cynical_Cut', group: 'Manager', symptom: '비정',
            diagnosis: '이해타산이 안 맞으면 칼같이 관계를 정리하는 비정함.'
        },
        {
            id: 56, errorName: '피해자 코드', varName: 'Victim_Code', group: 'Manager', symptom: '남탓',
            diagnosis: '모든 불행의 원인을 남 탓이나 환경 탓으로 돌림.'
        },

        // === ⚔️ 경(庚): 공격성과 무모함(Rashness) 오류 ===
        {
            id: 7, errorName: '자기 검열', varName: 'Self_Punish', group: 'Executor', symptom: '자기학대',
            diagnosis: '스스로에게 너무 엄격하여 휴식을 허락하지 않음.'
        },
        {
            id: 17, errorName: '폭주 기관차', varName: 'Reckless_Drive', group: 'Executor', symptom: '독단',
            diagnosis: '배우자의 의견을 무시하고 독단적으로 일을 저지름.'
        },
        {
            id: 27, errorName: '충돌 에러', varName: 'Collision_Error', group: 'Executor', symptom: '다툼',
            diagnosis: '직선적인 언행으로 인해 끊임없이 다툼이 발생함.'
        },
        {
            id: 37, errorName: '얼음 송곳', varName: 'Ice_Logic', group: 'Executor', symptom: '냉정',
            diagnosis: '논리적이지만 차가운 말로 배우자의 가슴을 후벼 팜.'
        },
        {
            id: 47, errorName: '전투 모드', varName: 'Combat_Mode', group: 'Executor', symptom: '경계',
            diagnosis: '세상을 적과 아군으로만 구분하여 늘 날이 서 있음.'
        },
        {
            id: 57, errorName: '독재자 코어', varName: 'Dictator_Core', group: 'Executor', symptom: '통제',
            diagnosis: '타협 없는 강한 주관으로 상대를 질리게 함.'
        },

        // === 💎 신(辛): 예민과 결벽(Perfection) 오류 ===
        {
            id: 8, errorName: '히스테리 루프', varName: 'Hysteria_Loop', group: 'Specialist', symptom: '신경질',
            diagnosis: '뜨거운 흙 속의 보석. 감정 조절이 안 되어 신경질적임.'
        },
        {
            id: 18, errorName: '의심 운영체제', varName: 'Suspicion_OS', group: 'Specialist', symptom: '시험',
            diagnosis: '완벽을 추구하다 스스로를 믿지 못하고 타인을 시험함.'
        },
        {
            id: 28, errorName: '변덕 스윙', varName: 'Mood_Swing', group: 'Specialist', symptom: '변덕',
            diagnosis: '기분이 롤러코스터 같아 종잡을 수 없는 성격.'
        },
        {
            id: 38, errorName: '동결된 심장', varName: 'Frozen_Heart', group: 'Specialist', symptom: '냉담',
            diagnosis: '차갑고 냉정하여 타인의 감정에 공감하지 못함.'
        },
        {
            id: 48, errorName: '날카로운 독설', varName: 'Sharp_Tongue_Core', group: 'Specialist', symptom: '독설',
            diagnosis: '지적이고 논리적이나, 말로 사람을 베는 재주가 있음.'
        },
        {
            id: 58, errorName: '순수주의 버그', varName: 'Purist_Bug', group: 'Specialist', symptom: '독선',
            diagnosis: '"나 아니면 다 틀렸다"는 독선적인 완벽주의.'
        },

        // === 🌊 임(壬): 과잉 사고와 음흉(Hidden) 오류 ===
        {
            id: 9, errorName: '유휴 CPU', varName: 'Idle_CPU', group: 'Strategist', symptom: '행동불능',
            diagnosis: '머리는 좋으나 행동하지 않고 시뮬레이션만 돌림.'
        },
        {
            id: 19, errorName: '혼돈의 커널', varName: 'Chaos_Kernel', group: 'Strategist', symptom: '내적갈등',
            diagnosis: '감정과 이성이 수시로 충돌하여 내적 갈등이 심함.'
        },
        {
            id: 29, errorName: '비밀 서버', varName: 'Secret_Server', group: 'Strategist', symptom: '비밀',
            diagnosis: '배우자에게조차 말하지 못하는 깊은 비밀이나 딴주머니.'
        },
        {
            id: 39, errorName: '지적 오만', varName: 'Arrogance_Bug', group: 'Strategist', symptom: '가르침',
            diagnosis: '내가 제일 똑똑하다고 생각하여 타인을 가르치려 듦.'
        },
        {
            id: 49, errorName: '감정의 홍수', varName: 'Emotional_Flood', group: 'Strategist', symptom: '범람',
            diagnosis: '욕망이나 감정이 범람하면 제어가 불가능함.'
        },
        {
            id: 59, errorName: '편집증 방화벽', varName: 'Paranoia_Firewall', group: 'Strategist', symptom: '편집증',
            diagnosis: '세상을 믿지 못하고 끊임없이 음모론을 제기함.'
        },

        // === 💧 계(癸): 우울과 계산(Calculation) 오류 ===
        {
            id: 10, errorName: '무균실 구역', varName: 'Sterile_Zone', group: 'Healer', symptom: '접근불가',
            diagnosis: '너무 깨끗하고 차가워서 사람이 접근하기 힘듦.'
        },
        {
            id: 20, errorName: '희생양 콤플렉스', varName: 'Self_Sacrifice', group: 'Healer', symptom: '희생반복',
            diagnosis: '퍼주고 나서 상처받는 패턴을 무한 반복함.'
        },
        {
            id: 30, errorName: '이중 부팅', varName: 'Dual_Boot', group: 'Healer', symptom: '이중성',
            diagnosis: '겉과 속이 확연히 달라 진심을 알 수 없음.'
        },
        {
            id: 40, errorName: '유리 멘탈', varName: 'Fragile_Glass_Core', group: 'Healer', symptom: '깨짐',
            diagnosis: '순수하지만 현실의 벽에 부딪히면 와장창 깨짐.'
        },
        {
            id: 50, errorName: '심연의 우울', varName: 'Deep_Blue', group: 'Healer', symptom: '우울',
            diagnosis: '깊고 어두운 생각에 빠져 헤어 나오지 못함.'
        },
        {
            id: 60, errorName: '욕망의 싱크홀', varName: 'Greed_Sinkhole', group: 'Healer', symptom: '욕망',
            diagnosis: '겉은 조용하나 속은 모든 것을 가지고 싶은 욕망이 가득함.'
        },
    ];

    static getById(id: number): CoreDarkCode | undefined {
        return this.CORE_CODES.find(c => c.id === id);
    }

    /** AI 프롬프트 주입용 일주 코어 아이덴티티 프로토콜 */
    static generatePromptProtocol(): string {
        let p = `\n[🧠 일주(Core Identity) 코어 다크 코드 시스템]\n`;
        p += `**프레임:** "⚠️ 코어 시스템 경고 (Kernel Panic): 자아 정체성 오류 감지"\n`;
        p += `**핵심:** 나의 본질적 취약점 + 친밀한 관계(배우자)에서의 치명적 오류\n\n`;
        p += `**적용 규칙:**\n`;
        p += `1. 사용자의 일주를 분석할 때 해당 코어 다크 코드를 참조\n`;
        p += `2. 자아 성찰 및 연애/결혼 고민 시 맞춤 분석 제공\n`;
        p += `3. "성격 탓"이 아닌 "코어 시스템의 일시적 오류"로 프레이밍\n\n`;

        for (const c of this.CORE_CODES) {
            p += `[${c.varName}] ${c.errorName}: ${c.diagnosis}\n`;
        }
        return p;
    }
}
