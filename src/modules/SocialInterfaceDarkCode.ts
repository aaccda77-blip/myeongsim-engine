/**
 * SocialInterfaceDarkCode.ts
 * 월주(Social Interface) 전용 다크 코드
 * 
 * "조직 생활에서의 버그(Organizational Bug)"
 * "대인관계 호환성 오류(Compatibility Error)"
 * 
 * UX: "⚠️ 소셜 네트워크 경고" / "⚠️ 업무 환경 부적응 알림"
 * 
 * ⚠️ 독립 모듈 — 기존 챗봇 시스템에 영향 없음
 */

export interface SocialDarkCode {
    id: number;
    errorName: string;
    varName: string;
    diagnosis: string;
    group: string;
    symptom: string;
}

export class SocialInterfaceDarkCode {

    static readonly SOCIAL_CODES: SocialDarkCode[] = [
        // === 🌱 갑(甲): 사회적 경직(Rigidity) 오류 ===
        {
            id: 1, errorName: '나홀로 리더', varName: 'Solo_Leader_Bug', group: 'Pioneer', symptom: '독단',
            diagnosis: '팀원들과 융화되지 못하고 혼자 앞서나가는 독단성.'
        },
        {
            id: 11, errorName: '고독한 늑대', varName: 'Lonely_Wolf', group: 'Pioneer', symptom: '고립',
            diagnosis: '조직 내 파벌을 거부하고 스스로 고립을 자초함.'
        },
        {
            id: 21, errorName: '하극상 충돌', varName: 'Rebel_Clash', group: 'Pioneer', symptom: '마찰',
            diagnosis: '상사나 기존 시스템의 권위에 끊임없이 도전하여 마찰 발생.'
        },
        {
            id: 31, errorName: '직설적 화법', varName: 'Direct_Talk_Error', group: 'Pioneer', symptom: '직설',
            diagnosis: '회의 시간이나 공적인 자리에서 너무 솔직하여 분위기를 깸.'
        },
        {
            id: 41, errorName: '독불장군', varName: 'My_Way_Only', group: 'Pioneer', symptom: '고집',
            diagnosis: '내 뜻대로 안 되면 판을 엎어버리는 타협 없는 고집.'
        },
        {
            id: 51, errorName: '뻣뻣한 목', varName: 'Stiff_Neck', group: 'Pioneer', symptom: '자존심',
            diagnosis: '굽힐 줄 모르는 자존심 때문에 좋은 기회를 놓침.'
        },

        // === 🌿 을(乙): 의존 및 휩쓸림(Drift) 오류 ===
        {
            id: 2, errorName: '억눌린 불만', varName: 'Silent_Protest', group: 'Networker', symptom: '참기',
            diagnosis: '불합리한 처우를 묵묵히 참다가 병(번아웃)이 남.'
        },
        {
            id: 12, errorName: '부유하는 직업', varName: 'Job_Drifter', group: 'Networker', symptom: '불안정',
            diagnosis: '한 직장에 정착하지 못하고 계속 이직하거나 방황함.'
        },
        {
            id: 22, errorName: '예민한 가위', varName: 'Stress_Cutter', group: 'Networker', symptom: '단절',
            diagnosis: '동료들의 말 한마디에 상처받고 관계를 끊어버림.'
        },
        {
            id: 32, errorName: '눈치 보는 생존', varName: 'Radar_Overload', group: 'Networker', symptom: '눈치',
            diagnosis: '주변 눈치를 너무 보느라 에너지가 고갈됨.'
        },
        {
            id: 42, errorName: '보여주기식 성과', varName: 'Visual_Work_Only', group: 'Networker', symptom: '허세',
            diagnosis: '실속 있는 업무보다 겉으로 드러나는 성과에만 집착.'
        },
        {
            id: 52, errorName: '파벌 형성', varName: 'Clique_Maker', group: 'Networker', symptom: '친목',
            diagnosis: '공적인 업무보다 사적인 친목 도모에 에너지를 낭비.'
        },

        // === 🔥 병(丙): 과시 및 산만(Distraction) 오류 ===
        {
            id: 3, errorName: '초반 러시 과다', varName: 'Start_Too_Fast', group: 'Visionary', symptom: '용두사미',
            diagnosis: '프로젝트 초반에만 열정적이고 마무리가 흐지부지됨.'
        },
        {
            id: 13, errorName: '가려진 성과', varName: 'Hidden_Credit', group: 'Visionary', symptom: '공빼앗김',
            diagnosis: '내가 한 일이 티가 안 나거나 남에게 공을 뺏김.'
        },
        {
            id: 23, errorName: '과거 영광 집착', varName: 'Retro_Bias', group: 'Visionary', symptom: '꼰대',
            diagnosis: '"내가 왕년에는..." 라며 과거 경력만 내세우는 꼰대 기질.'
        },
        {
            id: 33, errorName: '산만한 멀티', varName: 'Multi_Task_Fail', group: 'Visionary', symptom: '산만',
            diagnosis: '이것저것 다 건드려놓고 하나도 제대로 수습 못함.'
        },
        {
            id: 43, errorName: '트러블 메이커', varName: 'Noise_Generator', group: 'Visionary', symptom: '분란',
            diagnosis: '과도한 자기주장으로 조직 내 분란의 중심이 됨.'
        },
        {
            id: 53, errorName: '허풍선이', varName: 'Bluff_Error', group: 'Visionary', symptom: '허풍',
            diagnosis: '실현 불가능한 비전만 제시하여 신뢰를 잃음.'
        },

        // === 🕯️ 정(丁): 감정 소모(Drain) 오류 ===
        {
            id: 4, errorName: '감정 기복', varName: 'Mood_Swing_Job', group: 'Analyst', symptom: '기복',
            diagnosis: '기분에 따라 업무 효율이 극과 극을 달림.'
        },
        {
            id: 14, errorName: '희생양 컴플렉스', varName: 'Scapegoat_Bug', group: 'Analyst', symptom: '억울',
            diagnosis: '궂은일은 도맡아 하고도 인정받지 못하는 억울함.'
        },
        {
            id: 24, errorName: '현실 도피', varName: 'Fantasy_Work', group: 'Analyst', symptom: '도피',
            diagnosis: '직장 생활의 스트레스를 술이나 유흥, 종교로 품.'
        },
        {
            id: 34, errorName: '마이크로 매니징', varName: 'Micro_Manage_Bug', group: 'Analyst', symptom: '통제',
            diagnosis: '부하 직원의 사소한 실수도 용납 못해 숨 막히게 함.'
        },
        {
            id: 44, errorName: '열정 페이', varName: 'Passion_Exploit', group: 'Analyst', symptom: '착취',
            diagnosis: '보상 없는 헌신을 강요받거나 스스로 자처함.'
        },
        {
            id: 54, errorName: '편협한 시각', varName: 'Narrow_View', group: 'Analyst', symptom: '편협',
            diagnosis: '내 방식만이 옳다고 믿어 팀원들과 소통 단절.'
        },

        // === ⛰️ 무(戊): 불통 및 정체(Stagnation) 오류 ===
        {
            id: 5, errorName: '복지부동', varName: 'Static_Mode', group: 'Platform', symptom: '정체',
            diagnosis: '변화하는 시장 환경에 적응하지 않고 기존 방식을 고수함.'
        },
        {
            id: 15, errorName: '권위주의', varName: 'Boss_Trap', group: 'Platform', symptom: '서열',
            diagnosis: '직급이나 서열을 지나치게 따져 수평적 소통 불가.'
        },
        {
            id: 25, errorName: '계산적 관계', varName: 'Calculated_Rel', group: 'Platform', symptom: '계산',
            diagnosis: '동료를 이익의 수단으로만 보고 철저히 계산함.'
        },
        {
            id: 35, errorName: '철벽 방어', varName: 'Iron_Wall', group: 'Platform', symptom: '부서이기주의',
            diagnosis: '타 부서와의 협업을 거부하고 자기 부서 이기주의에 빠짐.'
        },
        {
            id: 45, errorName: '나홀로 전문가', varName: 'Isolation_Expert', group: 'Platform', symptom: '비협업',
            diagnosis: '실력은 좋으나 협업 능력이 제로(0)인 아웃사이더.'
        },
        {
            id: 55, errorName: '화산 폭발', varName: 'Sudden_Rage', group: 'Platform', symptom: '폭발',
            diagnosis: '평소엔 조용하다가 한 번 화나면 조직을 뒤집어놓음.'
        },

        // === 🪴 기(己): 의심 및 소극(Passive) 오류 ===
        {
            id: 6, errorName: '의심병', varName: 'Mistrust_Loop', group: 'Manager', symptom: '불신',
            diagnosis: '상사나 동료의 의도를 계속 의심하며 방어적으로 행동.'
        },
        {
            id: 16, errorName: '멘탈 붕괴', varName: 'Weak_Shield', group: 'Manager', symptom: '위축',
            diagnosis: '작은 지적에도 크게 상처받아 퇴사를 고민함.'
        },
        {
            id: 26, errorName: '수동적 공격', varName: 'Passive_Aggro', group: 'Manager', symptom: '지연',
            diagnosis: '앞에서 반대하지 않고 뒤에서 일을 지연시키는 태도.'
        },
        {
            id: 36, errorName: '선택 장애', varName: 'Decision_Fail', group: 'Manager', symptom: '회피',
            diagnosis: '결정적인 순간에 책임을 피하려다 타이밍을 놓침.'
        },
        {
            id: 46, errorName: '냉정한 손절', varName: 'Cold_Cut_Rel', group: 'Manager', symptom: '손절',
            diagnosis: '동료가 실수하면 가차 없이 잘라내어 인심을 잃음.'
        },
        {
            id: 56, errorName: '피해 망상', varName: 'Victim_Mindset', group: 'Manager', symptom: '피해의식',
            diagnosis: '"나만 제일 힘들다"는 생각에 빠져 주변을 질리게 함.'
        },

        // === ⚔️ 경(庚): 충돌 및 강압(Force) 오류 ===
        {
            id: 7, errorName: '자기 학대', varName: 'Self_Torture', group: 'Executor', symptom: '과로',
            diagnosis: '완벽한 성과를 위해 자신을 극한으로 몰아붙임.'
        },
        {
            id: 17, errorName: '불도저', varName: 'Bulldozer_Err', group: 'Executor', symptom: '강행',
            diagnosis: '팀원의 사정을 봐주지 않고 무리하게 프로젝트를 강행.'
        },
        {
            id: 27, errorName: '성급한 결정', varName: 'Hasty_Decision', group: 'Executor', symptom: '성급',
            diagnosis: '충분한 검토 없이 질러버려서 수습하느라 고생함.'
        },
        {
            id: 37, errorName: '비판적 독설', varName: 'Toxic_Critic', group: 'Executor', symptom: '독설',
            diagnosis: '회의 때마다 팩트 폭격으로 동료들의 사기를 꺾음.'
        },
        {
            id: 47, errorName: '과잉 충성', varName: 'Blind_Loyalty', group: 'Executor', symptom: '맹목충성',
            diagnosis: '조직 논리에 맹목적으로 충성하다가 토사구팽 당함.'
        },
        {
            id: 57, errorName: '독재자', varName: 'Dictator_Rule', group: 'Executor', symptom: '독재',
            diagnosis: '내 말은 곧 법이다. 토를 달지 못하게 함.'
        },

        // === 💎 신(辛): 예민 및 단절(Cut) 오류 ===
        {
            id: 8, errorName: '스트레스 골절', varName: 'Stress_Fracture_Social', group: 'Specialist', symptom: '붕괴',
            diagnosis: '업무 압박감을 견디지 못하고 멘탈이 바스러짐.'
        },
        {
            id: 18, errorName: '의전 강박', varName: 'Protocol_Obsession', group: 'Specialist', symptom: '형식',
            diagnosis: '형식과 절차를 지나치게 따져 업무 속도 저하.'
        },
        {
            id: 28, errorName: '히스테리', varName: 'Nervous_Fit', group: 'Specialist', symptom: '불안정',
            diagnosis: '감정적으로 불안정하여 주변 사람들이 눈치를 보게 함.'
        },
        {
            id: 38, errorName: '철벽남/녀', varName: 'Ice_Wall', group: 'Specialist', symptom: '차단',
            diagnosis: '업무 외적인 사담이나 교류를 일절 차단함.'
        },
        {
            id: 48, errorName: '말실수(칼)', varName: 'Sharp_Tongue_Social', group: 'Specialist', symptom: '독설',
            diagnosis: '의도치 않게 던진 차가운 말 한마디로 적을 만듦.'
        },
        {
            id: 58, errorName: '결벽증', varName: 'Clean_Freak', group: 'Specialist', symptom: '결벽',
            diagnosis: '타인의 작은 실수나 결점도 용납하지 못해 고립됨.'
        },

        // === 🌊 임(壬): 과잉 및 모호(Blur) 오류 ===
        {
            id: 9, errorName: '기획만 백번', varName: 'Planning_Loop', group: 'Strategist', symptom: '회의중독',
            diagnosis: '아이디어는 많으나 실행으로 옮기지 않고 회의만 함.'
        },
        {
            id: 19, errorName: '혼란 가중', varName: 'Chaos_Maker', group: 'Strategist', symptom: '지시변경',
            diagnosis: '이랬다저랬다 지시를 바꿔 실무진을 혼란에 빠트림.'
        },
        {
            id: 29, errorName: '정치 9단', varName: 'Politics_Game', group: 'Strategist', symptom: '사내정치',
            diagnosis: '업무 능력보다 사내 라인 타기에 더 몰두함.'
        },
        {
            id: 39, errorName: '지적 허세', varName: 'Smart_Snob', group: 'Strategist', symptom: '가르침',
            diagnosis: '동료들을 가르치려 들거나 무시하는 태도.'
        },
        {
            id: 49, errorName: '업무 범람', varName: 'Work_Tsunami', group: 'Strategist', symptom: '야근강요',
            diagnosis: '일 욕심이 너무 많아 팀원들까지 야근의 늪에 빠트림.'
        },
        {
            id: 59, errorName: '음모론자', varName: 'Conspiracy_Bug', group: 'Strategist', symptom: '불신',
            diagnosis: '회사의 방침을 믿지 않고 뒤에서 딴소리를 함.'
        },

        // === 💧 계(癸): 감성 및 스며듦(Infiltration) 오류 ===
        {
            id: 10, errorName: '차가운 필터', varName: 'Ice_Filter', group: 'Healer', symptom: '등급매김',
            diagnosis: '겉으로는 웃지만 속으로는 사람을 급으로 나누어 평가함.'
        },
        {
            id: 20, errorName: '과잉 양육(번아웃)', varName: 'Caretaker_Burnout', group: 'Healer', symptom: '감정쓰레기통',
            diagnosis: '동료들의 감정 쓰레기통 역할을 자처하다 방전됨.'
        },
        {
            id: 30, errorName: '카멜레온', varName: 'Mask_Switch', group: 'Healer', symptom: '본심상실',
            diagnosis: '누구에게나 맞추려다 보니 정작 내 본심을 잃어버림.'
        },
        {
            id: 40, errorName: '유약한 멘탈', varName: 'Glass_Heart', group: 'Healer', symptom: '거절불능',
            diagnosis: '싫은 소리를 못해서 거절해야 할 일을 떠맡음.'
        },
        {
            id: 50, errorName: '음지의 리더', varName: 'Shadow_Leader', group: 'Healer', symptom: '여론조종',
            diagnosis: '공식적인 리더보다 뒤에서 여론을 조종하려는 성향.'
        },
        {
            id: 60, errorName: '블랙홀', varName: 'Energy_Drain', group: 'Healer', symptom: '감정전염',
            diagnosis: '자신의 우울한 감정을 조직 전체에 전염시킴.'
        },
    ];

    static getById(id: number): SocialDarkCode | undefined {
        return this.SOCIAL_CODES.find(c => c.id === id);
    }

    /** AI 프롬프트 주입용 월주 소셜 인터페이스 프로토콜 */
    static generatePromptProtocol(): string {
        let p = `\n[🌐 월주(Social Interface) 소셜 다크 코드 시스템]\n`;
        p += `**프레임:** "⚠️ 소셜 네트워크 경고: 업무 환경 호환성 오류 감지"\n`;
        p += `**핵심:** 조직 생활에서의 버그를 객관적으로 분석\n\n`;
        p += `**적용 규칙:**\n`;
        p += `1. 사용자의 월주를 분석할 때 해당 소셜 다크 코드를 참조\n`;
        p += `2. 직장/사회생활 고민 시 맞춤 분석 제공\n`;
        p += `3. "성격 탓"이 아닌 "호환성 오류"로 프레이밍\n\n`;

        for (const c of this.SOCIAL_CODES) {
            p += `[${c.varName}] ${c.errorName}: ${c.diagnosis}\n`;
        }
        return p;
    }
}
