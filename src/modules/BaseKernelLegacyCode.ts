/**
 * BaseKernelLegacyCode.ts
 * 년주(Base Kernel) 전용 레거시 다크 코드
 * 
 * "초기 부팅 과정에서 발생한 시스템 환경 변수"
 * = 유전적 기질 + 어린 시절 환경 + 집안 분위기
 * 
 * UX: "⚠️ 초기 부팅 에러 (Legacy Bug)" / "당신의 잘못이 아닙니다"
 * 
 * ⚠️ 독립 모듈 — 기존 챗봇 시스템에 영향 없음
 */

export interface LegacyCode {
    id: number;
    traditional: string;
    legacyName: string;
    varName: string;
    diagnosis: string;
    group: string;
    symptom: string;
}

export class BaseKernelLegacyCode {

    static readonly LEGACY_CODES: LegacyCode[] = [
        // === 🌱 갑(甲): 뿌리 내리기(Rooting) 오류 ===
        {
            id: 1, traditional: '갑자', legacyName: '수중 부유 오류', varName: 'Rooting_Fail', group: 'Pioneer', symptom: '불안정',
            diagnosis: '차가운 물 위에 뜬 나무. 주거가 불안정하거나 부모의 지원이 불안정함.'
        },
        {
            id: 11, traditional: '갑술', legacyName: '척박지 로딩', varName: 'Dry_Soil_Error', group: 'Pioneer', symptom: '결핍',
            diagnosis: '메마른 땅에 심은 나무. 어린 시절 경제적/정서적 자원 부족을 경험.'
        },
        {
            id: 21, traditional: '갑신', legacyName: '절단된 뿌리', varName: 'Cut_Root_Trauma', group: 'Pioneer', symptom: '트라우마',
            diagnosis: '바위 위 위태로운 나무. 초기 신체적 상처(수술)나 가정 불화의 기억.'
        },
        {
            id: 31, traditional: '갑오', legacyName: '연소된 자원', varName: 'Resource_Burn', group: 'Pioneer', symptom: '소진',
            diagnosis: '불타버린 나무. 집안의 자산이나 기운이 빠르게 소진된 환경.'
        },
        {
            id: 41, traditional: '갑진', legacyName: '과밀도 뿌리', varName: 'Over_Crowded', group: 'Pioneer', symptom: '경쟁',
            diagnosis: '젖은 흙의 경쟁. 형제나 주변 관계로 인해 내 몫을 챙기기 힘든 경쟁 환경.'
        },
        {
            id: 51, traditional: '갑인', legacyName: '경직된 기둥', varName: 'Rigid_Structure', group: 'Pioneer', symptom: '통제',
            diagnosis: '너무 꼿꼿한 나무. 가부장적이거나 엄격한 가풍으로 인한 유연성 부족.'
        },

        // === 🌿 을(乙): 생존 적응(Survival) 오류 ===
        {
            id: 2, traditional: '을축', legacyName: '동토의 씨앗', varName: 'Frozen_Seed', group: 'Networker', symptom: '억압',
            diagnosis: '얼어붙은 땅. 어린 시절 감정 표현이 억압되고 위축된 환경.'
        },
        {
            id: 12, traditional: '을해', legacyName: '부유하는 덩굴', varName: 'Drifting_Vine', group: 'Networker', symptom: '이동',
            diagnosis: '물 위의 풀. 이사가 잦거나 부모님의 직업상 이동이 많아 정착 불가.'
        },
        {
            id: 22, traditional: '을유', legacyName: '가위눌린 새싹', varName: 'Pruned_Shoot', group: 'Networker', symptom: '예민',
            diagnosis: '잘려나간 풀. 예민한 신경성 기질을 타고나거나 잔병치레가 많음.'
        },
        {
            id: 32, traditional: '을미', legacyName: '갈증 나는 화초', varName: 'Thirst_Error', group: 'Networker', symptom: '결핍',
            diagnosis: '물 없는 사막. 정서적 결핍이나 애정에 대한 목마름이 초기값으로 설정됨.'
        },
        {
            id: 42, traditional: '을사', legacyName: '조급한 개화', varName: 'Early_Bloom_Bug', group: 'Networker', symptom: '조숙',
            diagnosis: '너무 빨리 핀 꽃. 어릴 때부터 어른스러워야 했던(애늙은이) 환경.'
        },
        {
            id: 52, traditional: '을묘', legacyName: '얽힌 뿌리', varName: 'Tangled_Roots', group: 'Networker', symptom: '복잡',
            diagnosis: '복잡한 덩굴. 가족 구성원이 복잡하거나 형제간의 경쟁/비교가 심함.'
        },

        // === 🔥 병(丙): 에너지 발산(Output) 오류 ===
        {
            id: 3, traditional: '병인', legacyName: '과열된 엔진', varName: 'Overheat_Start', group: 'Visionary', symptom: '부담감',
            diagnosis: '연료 과다. 부모의 기대가 너무 커서 부담감을 안고 시작함.'
        },
        {
            id: 13, traditional: '병자', legacyName: '가려진 태양', varName: 'Eclipse_Mode', group: 'Visionary', symptom: '억압',
            diagnosis: '구름 낀 태양. 능력을 다 펼치기 어려운 억압된 초기 환경.'
        },
        {
            id: 23, traditional: '병술', legacyName: '저무는 석양', varName: 'Sunset_Gloom', group: 'Visionary', symptom: '쇠퇴',
            diagnosis: '산 너머 태양. 집안의 세력이 기울거나 화려했던 과거에 갇힌 가풍.'
        },
        {
            id: 33, traditional: '병신', legacyName: '분산된 빛', varName: 'Scattered_Light', group: 'Visionary', symptom: '산만',
            diagnosis: '산만한 환경. 이것저것 관심은 많으나 하나에 집중하기 힘든 분위기.'
        },
        {
            id: 43, traditional: '병오', legacyName: '폭발적 화기', varName: 'Explosion_Risk', group: 'Visionary', symptom: '다혈질',
            diagnosis: '너무 뜨거운 불. 다혈질적인 유전적 기질이나 분쟁이 잦은 환경.'
        },
        {
            id: 53, traditional: '병진', legacyName: '습기 찬 태양', varName: 'Humid_Sun', group: 'Visionary', symptom: '좌절',
            diagnosis: '가려진 빛. 재능은 있으나 현실적인 제약으로 드러나지 못한 어린 시절.'
        },

        // === 🕯️ 정(丁): 정서 안정(Stable) 오류 ===
        {
            id: 4, traditional: '정묘', legacyName: '흔들리는 촛불', varName: 'Flickering_Light', group: 'Analyst', symptom: '정서불안',
            diagnosis: '바람 앞의 등불. 부모님의 관계 불안정이나 정서적 불안.'
        },
        {
            id: 14, traditional: '정축', legacyName: '어둠 속 등대', varName: 'Dark_Lighthouse', group: 'Analyst', symptom: '비밀',
            diagnosis: '밤을 지키는 불. 남모르는 가족의 비밀이나 우울감이 기저에 깔림.'
        },
        {
            id: 24, traditional: '정해', legacyName: '물 위의 불빛', varName: 'Unstable_Base', group: 'Analyst', symptom: '비현실',
            diagnosis: '꺼질 듯 말 듯. 영적/종교적 분위기가 강하거나 현실 감각이 부족한 환경.'
        },
        {
            id: 34, traditional: '정유', legacyName: '예민한 불꽃', varName: 'Sensitive_Flame', group: 'Analyst', symptom: '강박',
            diagnosis: '녹아내리는 쇠. 완벽주의적인 양육 태도로 인한 강박적 기질 형성.'
        },
        {
            id: 44, traditional: '정미', legacyName: '건조한 열기', varName: 'Dry_Heat_Stress', group: 'Analyst', symptom: '성과압박',
            diagnosis: '메마른 열정. 따뜻한 정서적 교류보다 성과나 희생을 강요받음.'
        },
        {
            id: 54, traditional: '정사', legacyName: '고립된 횃불', varName: 'Isolated_Fire', group: 'Analyst', symptom: '단절',
            diagnosis: '너무 강한 불. 독단적인 가풍으로 인해 소통이 단절된 초기 경험.'
        },

        // === ⛰️ 무(戊): 기반(Foundation) 오류 ===
        {
            id: 5, traditional: '무진', legacyName: '거대한 장벽', varName: 'Giant_Wall', group: 'Platform', symptom: '무게감',
            diagnosis: '첩첩산중. 넘어야 할 산이 많은(해결해야 할 가족 문제) 환경.'
        },
        {
            id: 15, traditional: '무인', legacyName: '독재의 산', varName: 'Authority_Peak', group: 'Platform', symptom: '권위',
            diagnosis: '호랑이가 사는 산. 엄격한 규율이나 권위적인 아버지의 영향.'
        },
        {
            id: 25, traditional: '무자', legacyName: '무너진 댐', varName: 'Dam_Collapse', group: 'Platform', symptom: '내실부족',
            diagnosis: '기반 약화. 겉은 멀쩡해 보이나 내실(재정)이 부족했던 초기 환경.'
        },
        {
            id: 35, traditional: '무술', legacyName: '고립된 요새', varName: 'Lonely_Fortress', group: 'Platform', symptom: '폐쇄',
            diagnosis: '닫힌 성문. 외부와 교류가 적고 폐쇄적인 가정 환경.'
        },
        {
            id: 45, traditional: '무신', legacyName: '쓸쓸한 광산', varName: 'Empty_Mine', group: 'Platform', symptom: '고독',
            diagnosis: '자원 고갈. 부모와의 이별이나 정서적 고독을 일찍 경험함.'
        },
        {
            id: 55, traditional: '무오', legacyName: '휴화산 경고', varName: 'Volcano_Dormant', group: 'Platform', symptom: '억압분노',
            diagnosis: '잠재된 폭발. 겉으로 표현하지 못하고 억눌린 가정 내 분노.'
        },

        // === 🪴 기(己): 토양(Soil) 오류 ===
        {
            id: 6, traditional: '기사', legacyName: '갈라진 논밭', varName: 'Cracked_Field', group: 'Manager', symptom: '불안정',
            diagnosis: '뜨거운 흙. 안정감이 부족하고 변동이 심한 초기 주거 환경.'
        },
        {
            id: 16, traditional: '기묘', legacyName: '손상된 텃밭', varName: 'Damaged_Garden', group: 'Manager', symptom: '침해',
            diagnosis: '뿌리 내리기 힘듦. 잦은 간섭이나 침해로 인한 자아 경계 손상.'
        },
        {
            id: 26, traditional: '기축', legacyName: '동토의 창고', varName: 'Frozen_Storage', group: 'Manager', symptom: '냉정',
            diagnosis: '꽁꽁 언 땅. 감정을 드러내면 안 되는 무겁고 차가운 가풍.'
        },
        {
            id: 36, traditional: '기해', legacyName: '진흙탕 오류', varName: 'Muddy_Error', group: 'Manager', symptom: '혼란',
            diagnosis: '물 먹은 흙. 가정 내 복잡한 문제(이성/돈)로 인한 혼란.'
        },
        {
            id: 46, traditional: '기유', legacyName: '자갈밭 로딩', varName: 'Gravel_Field', group: 'Manager', symptom: '긴장',
            diagnosis: '척박한 땅. 예민하고 날카로운 양육 태도로 인한 긴장감.'
        },
        {
            id: 56, traditional: '기미', legacyName: '메마른 대지', varName: 'Arid_Zone', group: 'Manager', symptom: '인내강요',
            diagnosis: '사막화 진행. 풍요로움보다는 인내와 끈기를 강요받은 환경.'
        },

        // === ⚔️ 경(庚): 규율(Rule) 오류 ===
        {
            id: 7, traditional: '경오', legacyName: '달궈진 쇠', varName: 'Heated_Metal', group: 'Executor', symptom: '훈육스트레스',
            diagnosis: '불 속의 검. 끊임없는 단련(잔소리, 훈육)을 받으며 자란 스트레스.'
        },
        {
            id: 17, traditional: '경진', legacyName: '매몰된 원석', varName: 'Buried_Ore', group: 'Executor', symptom: '미발굴',
            diagnosis: '흙 묻은 쇠. 재능은 있으나 환경이 받쳐주지 않아 묻혀있던 시기.'
        },
        {
            id: 27, traditional: '경인', legacyName: '부러진 칼', varName: 'Broken_Blade', group: 'Executor', symptom: '충돌',
            diagnosis: '충돌 사고. 초기 신체적 부상이나 부모님과의 강한 마찰.'
        },
        {
            id: 37, traditional: '경자', legacyName: '녹슬은 칼', varName: 'Rusted_Blade', group: 'Executor', symptom: '정서부식',
            diagnosis: '차가운 물속. 냉소적이고 비판적인 가정 분위기로 인한 정서 부식.'
        },
        {
            id: 47, traditional: '경술', legacyName: '괴강의 압박', varName: 'Pressure_Cooker', group: 'Executor', symptom: '압박',
            diagnosis: '강한 압력. 특수한 가정 환경이나 강한 카리스마에 눌려 지냄.'
        },
        {
            id: 57, traditional: '경신', legacyName: '강철 프레임', varName: 'Iron_Cage', group: 'Executor', symptom: '완벽주의',
            diagnosis: '절대적 기준. 타협 없는 완벽주의적 가풍이나 강한 통제.'
        },

        // === 💎 신(辛): 예민(Sensitivity) 오류 ===
        {
            id: 8, traditional: '신미', legacyName: '열받은 보석', varName: 'Hot_Gem_Stress', group: 'Specialist', symptom: '긴장',
            diagnosis: '뜨거운 흙 속. 주변의 압박으로 인해 늘 긴장 상태였던 신경계.'
        },
        {
            id: 18, traditional: '신사', legacyName: '용해된 금속', varName: 'Melted_Metal', group: 'Specialist', symptom: '변형',
            diagnosis: '형태 변형. 나의 본질을 지키기보다 환경에 맞춰야 했던 스트레스.'
        },
        {
            id: 28, traditional: '신묘', legacyName: '손상된 칼날', varName: 'Nicked_Blade', group: 'Specialist', symptom: '과민반응',
            diagnosis: '예민한 충돌. 작은 자극에도 크게 반응하는 신경성 기질 유전.'
        },
        {
            id: 38, traditional: '신축', legacyName: '냉동 창고', varName: 'Cryo_Chamber', group: 'Specialist', symptom: '냉담',
            diagnosis: '차가운 보석. 따뜻한 온기가 부족하여 마음의 문을 닫은 초기 설정.'
        },
        {
            id: 48, traditional: '신해', legacyName: '세척 강박', varName: 'Washing_Obsession', group: 'Specialist', symptom: '결벽',
            diagnosis: '물에 씻긴 보석. 지나친 청결함이나 도덕적 결벽을 요구받음.'
        },
        {
            id: 58, traditional: '신유', legacyName: '날카로운 파편', varName: 'Sharp_Fragment', group: 'Specialist', symptom: '정부족',
            diagnosis: '서로 찌름. 가족 간에도 예의와 선을 중시하여 정이 부족함.'
        },

        // === 🌊 임(壬): 유동(Flow) 오류 ===
        {
            id: 9, traditional: '임신', legacyName: '수원 오염', varName: 'Source_Pollution', group: 'Strategist', symptom: '혼란',
            diagnosis: '시작점의 혼란. 생각이나 가치관이 정립되지 않은 혼란스러운 초기 교육.'
        },
        {
            id: 19, traditional: '임오', legacyName: '불안한 호수', varName: 'Boiling_Lake', group: 'Strategist', symptom: '기복',
            diagnosis: '끓는 물. 부모의 관계가 불안정하거나 재정적 기복이 심함.'
        },
        {
            id: 29, traditional: '임진', legacyName: '탁한 흙탕물', varName: 'Muddy_Stream', group: 'Strategist', symptom: '무게감',
            diagnosis: '혼탁한 물. 집안의 복잡한 사정(비밀)이나 감당하기 힘든 무게감.'
        },
        {
            id: 39, traditional: '임인', legacyName: '설기된 수원', varName: 'Drained_Source', group: 'Strategist', symptom: '고갈',
            diagnosis: '물 빠짐. 자식(나)을 위해 부모가 희생하거나 자원이 고갈됨.'
        },
        {
            id: 49, traditional: '임자', legacyName: '쓰나미 경보', varName: 'Tsunami_Alert', group: 'Strategist', symptom: '범람',
            diagnosis: '범람하는 물. 감정의 기복이 심한 가족력이나 이동수가 매우 잦음.'
        },
        {
            id: 59, traditional: '임술', legacyName: '막힌 물길', varName: 'Blocked_Stream', group: 'Strategist', symptom: '단절',
            diagnosis: '고인 물. 소통이 단절되거나 답답한 가정 환경.'
        },

        // === 💧 계(癸): 감성(Emotion) 오류 ===
        {
            id: 10, traditional: '계유', legacyName: '차가운 빗물', varName: 'Cold_Rain', group: 'Healer', symptom: '정서냉랭',
            diagnosis: '금속 위의 물. 물질적으로는 풍요로울 수 있으나 정서적으로 냉랭함.'
        },
        {
            id: 20, traditional: '계미', legacyName: '증발된 수분', varName: 'Vapor_Loss', group: 'Healer', symptom: '근원결핍',
            diagnosis: '마른 땅의 비. 애정을 갈구하나 채워지지 않는 근원적 결핍.'
        },
        {
            id: 30, traditional: '계사', legacyName: '안개 속 미로', varName: 'Foggy_Maze', group: 'Healer', symptom: '모호함',
            diagnosis: '시야 차단. 집안 분위기가 모호하거나 비밀이 많아 불안함.'
        },
        {
            id: 40, traditional: '계묘', legacyName: '새벽 이슬', varName: 'Morning_Dew_Legacy', group: 'Healer', symptom: '약한기반',
            diagnosis: '찰나의 존재. 맑고 순수하나 현실적인 기반이 약한 유전적 기질.'
        },
        {
            id: 50, traditional: '계축', legacyName: '결빙된 눈물', varName: 'Frozen_Tears', group: 'Healer', symptom: '유전우울',
            diagnosis: '얼어붙은 땅. 깊은 내면의 슬픔이나 우울감을 물려받음.'
        },
        {
            id: 60, traditional: '계해', legacyName: '심해의 어둠', varName: 'Deep_Sea_Dark', group: 'Healer', symptom: '고독',
            diagnosis: '빛이 없는 곳. 속내를 알 수 없는 과묵함이나 고독한 성장 배경.'
        },
    ];

    static getById(id: number): LegacyCode | undefined {
        return this.LEGACY_CODES.find(c => c.id === id);
    }

    /** AI 프롬프트 주입용 년주 레거시 코드 프로토콜 */
    static generatePromptProtocol(): string {
        let p = `\n[🧬 년주(Base Kernel) 레거시 다크 코드 시스템]\n`;
        p += `**프레임:** "당신의 잘못이 아닙니다. 초기 부팅 과정의 환경 변수입니다."\n`;
        p += `**UX:** "⚠️ 레거시 시스템 경고: 초기 부팅 에러 감지"\n\n`;
        p += `**적용 규칙:**\n`;
        p += `1. 사용자의 년주를 분석할 때 해당 레거시 코드를 참조\n`;
        p += `2. "당신이 왜 그런 성향을 가졌는지"에 대한 근원적 설명 제공\n`;
        p += `3. 절대 비난하지 않고, "초기 환경 변수"로 객관화\n\n`;

        for (const c of this.LEGACY_CODES) {
            p += `[ID:${c.id}] ${c.legacyName}(${c.varName}): ${c.diagnosis}\n`;
        }
        return p;
    }
}
