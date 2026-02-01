/**
 * DrillDownProtocol.ts - 아이콘 확장 및 심층 탐색 프로토콜 (Fixed Ver.)
 * 
 * 목적: Progressive Disclosure (점진적 공개) 패턴 구현
 * 특징:
 *  - 메인 아이콘 6개로 단순함 유지
 *  - 터치 시 서브메뉴 펼침 (Bottom Sheet)
 *  - 사용자 사주 데이터 기반 추천 배지
 *  - 뇌과학/심리학 기반 호기심 자극 문구
 */

import { generateAwakeningPrompt } from './AwakeningPromptEngine';

// ============== 타입 정의 ==============

export interface SubMenuItem {
    id: string;
    label: string;
    desc?: string;
    intent: string;
    icon?: string;
    isPremium?: boolean;
    children?: SubMenuItem[]; // [NEW] 3단계 중첩 메뉴 지원
}

export interface MainIcon {
    id: string;
    label: string;
    icon: string;
    neuro_trigger: string;  // 호기심 자극 문구 (뇌과학)
    style?: 'default' | 'premium_gold' | 'premium_purple' | 'healing_green';
    sub_menus: SubMenuItem[];
}

export interface IconRecommendation {
    id: string;
    badge: string;
    priority?: number;
}

// ============== 메인 아이콘 맵 (최종 정리본) ==============

export const ICON_DRILL_DOWN_MAP: Record<string, MainIcon> = {
    // ============================================
    // [NEW] 5-Section Hierarchy (Expanded Logic)
    // ============================================

    // 0. [퀀텀 자각] (Quantum Awakening) - NEW Hidden Room
    QUANTUM_AWAKENING: {
        id: 'QUANTUM_AWAKENING',
        label: "0. 퀀텀 자각",
        icon: "🌌",
        neuro_trigger: "무의식의 별을 연결하는 히든 룸",
        style: 'premium_purple',
        sub_menus: [
            { id: "qa_1", label: "0-1. 108 자각 프로토콜", desc: "무의식을 깨우는 108가지 질문", intent: "saju_108_awakening" },
            { id: "qa_2", label: "0-2. 감정 연금술 (Emotion Alchemy)", desc: "감정을 에너지로 변환하는 기술", intent: "ms_emotion_alchemy" },
            { id: "qa_3", label: "0-3. 그림자 작업 (Shadow Work)", desc: "내면의 어둠과 대화하기", intent: "ms_shadow_work" }
        ]
    },

    // 1. [나의 명심] (My Core)
    MY_CORE: {
        id: 'MY_CORE',
        label: "1. 나의 명심",
        icon: "🔮",
        neuro_trigger: "나의 본질과 재능 정밀 분석",
        style: 'premium_purple',
        sub_menus: [
            {
                id: "core_1_1",
                label: "1-1. 본질 분석 (Identity)",
                desc: "나의 영혼과 사회적 그릇",
                intent: "NAV_CORE_IDENTITY",
                children: [
                    { id: "mc_1", label: "1. 내 영혼의 씨앗 (일간/일주)", desc: "나의 본질과 기질 분석", intent: "saju_core_summary" },
                    { id: "mc_2", label: "2. 일간 심층 분석", desc: "나의 잠재력 깊이 보기", intent: "day_master_deep" },
                    { id: "hq_today", label: "💬 오늘의 Q&A", desc: "명심 AI 코치가 매일 함께하는 건강 상담", intent: "daily_health_qa" },
                    { id: "mc_3", label: "3. 사회적 가면 (십성/격국)", desc: "나의 사회적 역할과 그릇 크기", intent: "deep_gyeokguk_weapon" },
                    { id: "mc_6", label: "6. 숨겨진 욕망 (지장간/심리)", desc: "무의식과 내면의 심리", intent: "hour_pillar_desire" },
                    { id: "mc_4", label: "4. 인생 배터리 (12운성)", desc: "나의 에너지 총량과 흐름", intent: "deep_12_wunsung_cycle" }
                ]
            },
            {
                id: "core_1_2",
                label: "1-2. 재능과 결핍 (Talent & Lack)",
                desc: "나만의 필살기와 보완점",
                intent: "NAV_CORE_TALENT",
                children: [
                    { id: "mc_5", label: "5. 나의 필살기 (신살)", desc: "나만의 특수 능력과 매력", intent: "deep_special_stars" },
                    { id: "mc_7", label: "7. 채워야 할 구멍 (공망/조후)", desc: "인생의 결핍과 온도 조절", intent: "gongmang_deep_analysis" },
                    { id: "mc_14", label: "14. 운명의 풍경화 (물상론)", desc: "그림으로 보는 내 사주 이미지", intent: "ms_pical_image" }
                ]
            },
            {
                id: "core_1_3",
                label: "1-3. 신체 프로파일링 (Body Scan)",
                desc: "사주로 보는 건강과 스타일",
                intent: "NAV_CORE_BODY",
                children: [
                    { id: "mc_27", label: "27. 사주 의학 검진", desc: "오행으로 보는 취약 장기 예보", intent: "deep_health_weakness" },
                    { id: "mc_47", label: "47. 보이스 건강 스캔", desc: "목소리(Hz)로 진단하는 오장육부", intent: "ms_voice_scan" },
                    { id: "mc_44", label: "44. DNA 크로스 체크", desc: "유전자 검사와 사주의 교차 검증", intent: "ms_dna_check" },
                    { id: "mc_28", label: "28. 형상과 스타일", desc: "내 외모 특징과 맞춤 스타일링", intent: "ms_style_guide" }
                ]
            }
        ]
    },

    // 2. [실전 코칭] (Strategy Lab)
    STRATEGY_LAB: {
        id: 'STRATEGY_LAB',
        label: "2. 실전 코칭",
        icon: "🎯",
        neuro_trigger: "이기는 타이밍과 전략의 모든 것",
        style: 'premium_gold',
        sub_menus: [
            {
                id: "strat_2_1",
                label: "2-1. 타이밍 전략 (Timing)",
                desc: "승부수와 골든타임",
                intent: "NAV_STRAT_TIMING",
                children: [
                    { id: "sl_15", label: "15. 올해의 승부수 (세운/대운)", desc: "1년 및 10년 단위 인생 판세 분석", intent: "saju_daewoon_flow" },
                    { id: "sl_20", label: "20. 오늘의 미션 (일진/월운)", desc: "매일 아침 받는 구체적 행동 지침", intent: "daily_fortune" },
                    { id: "sl_26", label: "26. 골든 타임 (바이오 클락)", desc: "하루 중 가장 운이 좋은 시간대", intent: "golden_time_analysis" },
                    { id: "sl_17", label: "17. 전략 포지션 (12신살)", desc: "올해 내가 취해야 할 태도(공격/수비)", intent: "ms_12sinsal_strategy" }
                ]
            },
            {
                id: "strat_2_2",
                label: "2-2. 개운 솔루션 (Solution)",
                desc: "부족한 운을 채우는 비법",
                intent: "NAV_STRAT_SOLUTION",
                children: [
                    { id: "sl_16", label: "16. 오행 에너지 점수", desc: "실시간 내 운의 수치화 그래프", intent: "ohaeng_balance_report" },
                    { id: "sl_18", label: "18. 비밀 병기 (허자/입묘)", desc: "위기 탈출을 위한 히든카드", intent: "ms_hidden_weapon" },
                    { id: "sl_39", label: "39. AI 작명소 (성명학)", desc: "부족한 운을 채우는 이름/닉네임", intent: "ms_naming_ai" },
                    { id: "sl_21", label: "21. 하늘의 조언 (주역)", desc: "답답할 때 던지는 동양 철학의 신탁", intent: "ms_iching_oracle" }
                ]
            },
            {
                id: "strat_2_3",
                label: "2-3. 현실 조작 (Tactics)",
                desc: "환경과 방향을 활용한 개운",
                intent: "NAV_STRAT_TACTICS",
                children: [
                    { id: "sl_29", label: "29. 방위 나침반 (기문둔갑)", desc: "지금 행운을 잡으러 가는 방향", intent: "ms_lucky_direction" },
                    { id: "sl_32", label: "32. 리얼타임 싱크", desc: "날씨, 뉴스 등 외부 환경 연동 조언", intent: "smart_context_card" }
                ]
            }
        ]
    },

    // 3. [명심 라이프] (Life & Healing)
    LIFE_HEALING: {
        id: 'LIFE_HEALING',
        label: "3. 명심 라이프",
        icon: "🌿",
        neuro_trigger: "관계 회복과 일상의 힐링",
        style: 'healing_green',
        sub_menus: [
            {
                id: "life_3_1",
                label: "3-1. 관계와 소통 (Connection)",
                desc: "나와 타인의 에너지 균형",
                intent: "NAV_LIFE_CONNECTION",
                children: [
                    { id: "lh_22", label: "22. 정밀 궁합 (케미스트리)", desc: "연인, 친구와의 전생 및 속궁합", intent: "saju_compatibility" },
                    { id: "lh_35", label: "35. 귀인 레이더", desc: "내 운명을 채워줄 사람 찾기 (LBS)", intent: "deep_noble_connection" },
                    { id: "lh_31", label: "31. 조직 명리학", desc: "우리 가족, 회사 팀의 에너지 균형", intent: "ms_team_chemistry" },
                    { id: "lh_30", label: "30. 디지털 트윈 대화", desc: "나와 똑같은 AI 페르소나와 상담", intent: "ms_digital_twin_talk" }
                ]
            },
            {
                id: "life_3_2",
                label: "3-2. 패밀리 케어 (Family)",
                desc: "가족과 반려동물을 위한 명리",
                intent: "NAV_LIFE_FAMILY",
                children: [
                    { id: "lh_36", label: "36. 영재 육아 코칭", desc: "아이의 적성과 맞춤 훈육법", intent: "ms_parenting_coach" },
                    { id: "lh_38", label: "38. 멍냥 명리", desc: "반려동물의 속마음과 집사 궁합", intent: "ms_pet_saju" },
                    { id: "lh_51", label: "51. 디지털 제사상", desc: "AI로 복원된 조상님과의 대화", intent: "ms_digital_ritual" }
                ]
            },
            {
                id: "life_3_3",
                label: "3-3. 힐링과 공간 (Healing)",
                desc: "공간과 소리로 치유하기",
                intent: "NAV_LIFE_HEALING",
                children: [
                    { id: "lh_34", label: "34. 소닉 테라피 (EMDR/음악)", desc: "나에게 필요한 주파수(ASMR) 처방", intent: "play_healing_music" },
                    { id: "lh_37", label: "37. 꿈 해몽 분석", desc: "무의식의 메시지를 오행으로 해석", intent: "ms_dream_analysis" },
                    { id: "lh_42", label: "42. 스마트 풍수 (IoT)", desc: "집안 조명/온도 자동 제어", intent: "ms_smart_fengshui" },
                    { id: "lh_24", label: "24. 개운 인테리어", desc: "나를 살리는 잠자리 방향과 배치", intent: "ms_interior_lucky" }
                ]
            }
        ]
    },

    // 4. [세상과 부] (World & Wealth)
    WORLD_WEALTH: {
        id: 'WORLD_WEALTH',
        label: "4. 세상과 부",
        icon: "🌍",
        neuro_trigger: "경제 흐름과 사회적 성공",
        style: 'default',
        sub_menus: [
            {
                id: "world_4_1",
                label: "4-1. 부의 흐름 (Economy)",
                desc: "국가와 기업, 그리고 나의 부",
                intent: "NAV_WORLD_ECONOMY",
                children: [
                    { id: "ww_40", label: "40. 주식/국운 명리", desc: "투자 타이밍과 기업 운세", intent: "ms_stock_saju" },
                    { id: "ww_50", label: "50. 글로벌 운세 지도", desc: "나에게 맞는 이민/여행 국가", intent: "ms_global_map" },
                    { id: "ww_43", label: "43. 나비 효과 계산기", desc: "나의 행동이 미치는 사회적 파장", intent: "ms_butterfly_effect" }
                ]
            },
            {
                id: "world_4_2",
                label: "4-2. 사회와 미래 (Society)",
                desc: "사회적 트렌드와 나의 미래",
                intent: "NAV_WORLD_SOCIETY",
                children: [
                    { id: "ww_52", label: "52. 집단 무의식 예보", desc: "오늘의 사회적 분위기(Big Data)", intent: "ms_collective_forecast" },
                    { id: "ww_33", label: "33. 운명 아트", desc: "내 사주를 AI 예술로 시각화", intent: "ms_fate_art" },
                    { id: "ww_41", label: "41. 운명 NFT", desc: "블록체인에 기록되는 디지털 부적", intent: "ms_fate_nft" }
                ]
            }
        ]
    },

    // 5. [초월 연구소] (X-Lab)
    X_LAB: {
        id: 'X_LAB',
        label: "5. 초월 연구소",
        icon: "🧬",
        neuro_trigger: "과학과 신비의 경계를 넘다",
        style: 'premium_purple',
        sub_menus: [
            {
                id: "xlab_5_1",
                label: "5-1. 우주와 차원 (Universe)",
                desc: "우주적 관점의 운명",
                intent: "NAV_XLAB_UNIVERSE",
                children: [
                    { id: "xl_46", label: "46. 천문 사주 (NASA)", desc: "태어난 날의 실제 우주 지도", intent: "ms_astronomy_saju" },
                    { id: "xl_55", label: "55. 화성 만세력", desc: "다행성 시대를 위한 화성 운세", intent: "ms_mars_cal" },
                    { id: "xl_45", label: "45. 멀티버스 시뮬레이션", desc: "다른 선택의 평행 우주 확인", intent: "ms_multiverse_sim" },
                    { id: "xl_57", label: "57. 아카식 레코드", desc: "영혼의 우주 로그 파일 열람", intent: "ms_akashic_record" }
                ]
            },
            {
                id: "xlab_5_2",
                label: "5-2. 생명과 신 (God Mode)",
                desc: "생명과 업보의 비밀",
                intent: "NAV_XLAB_GOD",
                children: [
                    { id: "xl_48", label: "48. 제왕 메이커", desc: "완벽한 운명을 가진 아이 택일", intent: "ms_king_maker" },
                    { id: "xl_49", label: "49. 수명 시계", desc: "생명 에너지 고갈 시기 예측", intent: "ms_lifespan_clock" },
                    { id: "xl_25", label: "25. 전생 리딩", desc: "현생의 업보와 전생 추적", intent: "ms_past_life" }
                ]
            },
            {
                id: "xlab_5_3",
                label: "5-3. 시스템 제어 (System)",
                desc: "운명 시스템 직접 개입",
                intent: "NAV_XLAB_SYSTEM",
                children: [
                    { id: "xl_54", label: "54. 뉴럴 사주 (BCI)", desc: "뇌파 제어를 통한 멘탈 케어", intent: "ms_neural_bci" },
                    { id: "xl_56", label: "56. 현실 조작 (양자 해킹)", desc: "확률을 확정 짓는 운명 개입", intent: "ms_reality_hack" },
                    { id: "xl_58", label: "58. 유니버스 메이커", desc: "나만의 물리 법칙 창조", intent: "ms_universe_maker" },
                    { id: "xl_59", label: "59. 열반 (로그아웃)", desc: "데이터 완전 삭제 및 졸업", intent: "ms_nirvana_logout" }
                ]
            }
        ]
    },

    // 5.5. [3D 정밀 진단] (Neural Engineering) - NEW System Persona Mode
    NEURAL_ENGINEERING: {
        id: 'NEURAL_ENGINEERING',
        label: "3D 정밀 진단",
        icon: "🧬",
        neuro_trigger: "내면의 3차원 에너지 좌표 분석",
        style: 'premium_purple',
        sub_menus: [
            {
                id: "ne_1",
                label: "3D 좌표 스캔 (Full Scan)",
                desc: "X(의식), Y(주파수), Z(벡터) 전체 정밀 분석",
                intent: "ms_3d_full_scan"
            },
            {
                id: "ne_x",
                label: "X축: 의식 코드 (Code)",
                desc: "Dark vs Neural vs Meta 현위치 확인",
                intent: "ms_3d_x_axis"
            },
            {
                id: "ne_y",
                label: "Y축: 주파수 측정 (Freq)",
                desc: "나의 행동이 생산적인가? 파괴적인가?",
                intent: "ms_3d_y_axis"
            },
            {
                id: "ne_z",
                label: "Z축: 에너지 벡터 (Vector)",
                desc: "폭발(Out) vs 함몰(In) 위험도 진단",
                intent: "ms_3d_z_axis"
            },
            {
                id: "ne_64",
                label: "64비트 뉴럴 코드 (Decoder)",
                desc: "나의 DNA에 각인된 64가지 원형 분석",
                intent: "ms_64_neural_code" // New Intent
            },
            {
                id: "ne_action",
                label: "🚀 3S 솔루션 실행 (Action)",
                desc: "진단 결과를 실행 코드로 변환 (Scan-Sync-Shift)",
                intent: "ms_3s_protocol_start"
            }
        ]
    },

    // ============================================
    // [LEGACY] Original Functions (Restored)
    // ============================================

    // 6. 💰 부의 그릇 (WEALTH)
    WEALTH: {
        id: 'WEALTH',
        label: "부의 그릇 (Original)",
        icon: "💰",
        neuro_trigger: "왜 벌어도 모이지 않을까?",
        style: 'default',
        sub_menus: [
            { id: "w_1", label: "🕳️ '밑 빠진 독' 탐지기 (Leak)", desc: "돈이 새는 운명의 구멍 찾기", intent: "ms_wealth_leak" },
            { id: "w_2", label: "💎 '돈을 부르는' 무기 (Weapon)", desc: "투자형 vs 저축형 부자 코드", intent: "ms_wealth_weapon" },
            { id: "w_3", label: "📈 인생의 '잭팟' 타이밍 (Timing)", desc: "자산 증식의 골든타임", intent: "ms_wealth_timing" },
            { id: "w_4", label: "🧪 재물운 강화 코칭", desc: "AI 맞춤 실천 과제", intent: "coaching_wealth_action", isPremium: true }
        ]
    },

    // 7. ⌚ 바이오싱크 (BIO_SYNC)
    BIO_SYNC: {
        id: 'BIO_SYNC',
        label: "생체 연동 (Bio-Sync)",
        icon: "⌚",
        neuro_trigger: "실시간 운명 동기화",
        style: 'default',
        sub_menus: [
            { id: "b_1", label: "⚡ Bio-Sync 대시보드", desc: "웨어러블 연결 및 데이터 확인", intent: "bio_sync_dashboard_view" },
            { id: "b_checkin", label: "🩺 통합 체크인", desc: "Saju + 4분면 정밀 분석", intent: "integral_checkin_view" },
            { id: "b_2", label: "🧘 생체 리듬 명상", desc: "심박수에 맞춘 호흡 가이드", intent: "bio_rhythm_meditation" },
            { id: "b_patent_1", label: "🚨 [특허] 위기 개입", desc: "급성 스트레스 차단 (S-C-A-R)", intent: "demo_patent_features", isPremium: true },
            { id: "b_patent_2", label: "🛡️ [특허] 선제적 예방", desc: "스트레스 패턴 예측 및 알림", intent: "demo_preventive_care", isPremium: true },
            { id: "b_patent_recovery", label: "📉 [특허] 실시간 진정", desc: "심박수 안정화 시각화", intent: "demo_realtime_recovery", isPremium: true },
            { id: "b_idea_1", label: "🧬 Neuro-Saju", desc: "오행-신경계 공명 테스트", intent: "demo_neuro_saju", isPremium: true },
            { id: "b_context", label: "🌅 오늘의 에너지 분석", desc: "BPM + 사주 + 바이오리듬 통합", intent: "smart_context_card" },
            { id: "b_golden", label: "⏰ 골든타임 알림", desc: "지금 뭐하면 좋을까?", intent: "golden_time_analysis" },
            { id: "b_quit_smoke", label: "🚭 금연 알아차림", desc: "ACT 기반 흡연 욕구 대처", intent: "quit_smoking_act" },
            { id: "b_quit_drink", label: "🍺 금주 알아차림", desc: "CBT 기반 음주 충동 관리", intent: "quit_drinking_cbt" },
            { id: "b_addiction", label: "🎮 중독 탈출", desc: "DBT 기반 디지털/도박 대처", intent: "addiction_escape_dbt" },
            { id: "b_sos", label: "🆘 SOS 긴급", desc: "4-7-8 호흡 가이드 (성우 음성)", intent: "sos_breathing_guide" }
        ]
    },

    // 8. ❤️ 관계의 멍 (RELATIONSHIP)
    RELATIONSHIP: {
        id: 'RELATIONSHIP',
        label: "관계의 멍 (Original)",
        icon: "❤️",
        neuro_trigger: "반복되는 상처 끊어내기",
        style: 'healing_green',
        sub_menus: [
            { id: "r_1", label: "💘 매력의 법칙 (Attraction)", desc: "나는 어떤 사람에게 끌리는가?", intent: "ms_rel_attraction" },
            { id: "r_2", label: "🪞 관계의 거울 (Mirror)", desc: "상대방은 나의 무엇을 비추는가?", intent: "ms_rel_mirror" },
            { id: "r_3", label: "⏳ 사랑의 타이밍 (Timing)", desc: "언제 운명의 상대를 만나는가?", intent: "ms_rel_timing" },
            { id: "r_4", label: "💞 정밀 궁합 (Compatibility)", desc: "상대방과의 에너지 조화도", intent: "saju_compatibility" }
        ]
    },

    // 9. 🚀 천직 발견 (CAREER)
    CAREER: {
        id: 'CAREER',
        label: "천직 발견 (Original)",
        icon: "🚀",
        neuro_trigger: "나는 이 일을 하려고 태어났다",
        style: 'default',
        sub_menus: [
            { id: "c_1", label: "🗡️ 나만의 '히든 스킬' (Skill)", desc: "남들은 모르는 나의 사기급 능력", intent: "ms_career_skill" },
            { id: "c_2", label: "⚖️ 월급 vs 야생마 (Path)", desc: "직장인인가, 사업가인가?", intent: "ms_career_path" },
            { id: "c_3", label: "🔋 '무한 동력' 에너지 (Energy)", desc: "번아웃 없이 일하는 법", intent: "ms_career_energy" },
            { id: "c_4", label: "📊 커리어 타이밍", desc: "이직/승진 최적 시기", intent: "career_timing_analysis", isPremium: true }
        ]
    },

    // 10. 🧬 성격분석 (PERSONALITY -> Soul Architecture)
    PERSONALITY_ANALYSIS: {
        id: 'PERSONALITY_ANALYSIS',
        label: "성격분석 (Original)",
        icon: "🧬",
        neuro_trigger: "나만의 본질 에너지 코드",
        style: 'premium_purple',
        sub_menus: [
            { id: "g_1", label: "🏛️ 소울 아키텍처 (Soul)", desc: "내 영혼의 설계도 해킹", intent: "ms_soul_arch" },
            { id: "g_2", label: "🌑 다크 사이드 & 빛 (Shadow)", desc: "단점이 최고의 무기가 된다", intent: "ms_dark_side" },
            { id: "g_3", label: "💫 번영 열쇠", desc: "재물운 핵심 코드", intent: "prosperity_key_analysis" },
            { id: "g_neural", label: "🧬 뉴럴 프로필", desc: "Life's Work, Evolution", intent: "neural_profile_analysis" },
            { id: "g_5", label: "🧠 심리 치유 아키타입", desc: "DBT/ACT/MBCT 통합 처방", intent: "therapy_archetype_view" },
            { id: "g_strength", label: "📊 강점/재능 리포트", desc: "인적자원 역량 분석", intent: "strength_talent_report", isPremium: true }
        ]
    },

    // 11. 💊 데일리 미션 (DAILY -> Energy Cheat Key)
    DAILY_MISSION: {
        id: 'DAILY_MISSION',
        label: "데일리 미션 (Original)",
        icon: "💊",
        neuro_trigger: "오늘 뭘 해야 운이 트일까?",
        style: 'default',
        sub_menus: [
            { id: "d_0", label: "⚔️ 오늘의 퀘스트 (Quest)", desc: "오늘의 운을 200% 활용법", intent: "ms_daily_quest" },
            { id: "d_1", label: "🔋 오행 에너지 충전소 (Charge)", desc: "부족한 기운 즉시 처방", intent: "ms_energy_station" },
            { id: "d_3", label: "🧘 명상 가이드", desc: "5분 마음 정화", intent: "meditation_guide" },
            { id: "d_4", label: "✅ 미션 기록", desc: "실천 이력 확인", intent: "mission_history" }
        ]
    },

    // 12. 🔮 사주분석 (SAJU -> Destiny GPS)
    SAJU_ANALYSIS: {
        id: 'SAJU_ANALYSIS',
        label: "사주분석 (Original)",
        icon: "🔮",
        neuro_trigger: "운명의 설계도 확인",
        style: 'premium_purple',
        sub_menus: [
            { id: "s_0", label: "🌦️ 인생의 날씨 예보 (Weather)", desc: "내일 비가 올까, 해가 뜰까?", intent: "ms_destiny_weather" },
            { id: "s_1", label: "🌊 10년 대운 파도타기 (Wave)", desc: "지금 노를 저을 때인가?", intent: "ms_life_wave" },
            { id: "s_2", label: "💼 직업/사업운", desc: "성공을 부르는 타이밍", intent: "saju_career_detail" },
            { id: "s_3", label: "❤️ 결혼/연애운", desc: "나의 인연과 시기", intent: "saju_marriage_timing" }
        ]
    },

    // 13. 🌿 명심 힐링 (HEALING -> Neural Healing)
    STRESS_RELIEF: {
        id: 'STRESS_RELIEF',
        label: "명심 힐링 (Original)",
        icon: "🌿",
        neuro_trigger: "지친 마음 쉬어가기",
        style: 'healing_green',
        sub_menus: [
            { id: "h_sonic", label: "🎧 주파수 처방전 (Sonic)", desc: "듣기만 해도 운이 좋아진다?", intent: "ms_sonic_cure" },
            { id: "h_detox", label: "🧠 멘탈 디톡스 (Detox)", desc: "뇌파를 씻어내는 호흡법", intent: "ms_mental_detox" },
            { id: "h_music", label: "🎵 힐링 음악 (소닉 테라피)", desc: "그냥 두는 연습 듣기", intent: "play_healing_music" }
        ]
    },

    // 14. 💡 오늘의 건강상식 (HEALTH_QA - NEW)
    HEALTH_QA: {
        id: 'HEALTH_QA',
        label: "오늘의 건강상식",
        icon: "💡",
        neuro_trigger: "매일 새로운 헬스케어 지식",
        style: 'healing_green',
        sub_menus: [
            {
                id: "hq_today",
                label: "💬 오늘의 Q&A",
                desc: "AI가 매일 생성하는 건강 상담",
                intent: "daily_health_qa"
            },
            {
                id: "hq_archive",
                label: "📚 지난 상담 보기",
                desc: "이전 건강상식 아카이브",
                intent: "health_qa_archive"
            },
            {
                id: "hq_custom",
                label: "🔍 맞춤 질문하기",
                desc: "궁금한 건강 주제 직접 물어보기",
                intent: "health_qa_custom"
            }
        ]
    },

    // 15. ⚖️ 바이오 밸런서 (BIO_CARE - NEW)
    BIO_CARE: {
        id: 'BIO_CARE',
        label: "바이오 밸런서",
        icon: "⚖️",
        neuro_trigger: "약물·영양·신체의 균형 관리",
        style: 'healing_green',
        sub_menus: [
            {
                id: "bc_med_literacy",
                label: "💊 약물 리터러시",
                desc: "내 약을 제대로 이해하기",
                intent: "bio_care_med_literacy"
            },
            {
                id: "bc_nutri_synergy",
                label: "🥗 시너지 영양학",
                desc: "보충제와 약물의 조화",
                intent: "bio_care_nutri_synergy"
            },
            {
                id: "bc_body_log",
                label: "📊 신체 알아차림 로그",
                desc: "증상 기록 및 패턴 파악",
                intent: "bio_care_body_log"
            },
            {
                id: "bc_educator_note",
                label: "📚 전문가의 한마디",
                desc: "보건교육사 칼럼",
                intent: "bio_care_educator_note"
            }
        ]
    },

    // 14. 108 자각 (AWARENESS_108 - Quantum Upgrade)
    AWARENESS_108: {
        id: 'AWARENESS_108',
        label: "108 자각 (Quantum)",
        icon: "🧘",
        neuro_trigger: "당신의 운명을 해킹하는 108가지 코드",
        style: 'premium_purple',
        sub_menus: [
            {
                id: "phase_1",
                label: "Phase 1: 소울 해킹 (1~18)",
                desc: "영혼의 설계도 해독",
                intent: "NAV_PHASE_1",
                children: [
                    { id: "qk_1", label: "01. 📜 내 영혼의 설계도", desc: "태어난 순간의 운명 지도", intent: "ms_soul_blueprint" },
                    { id: "qk_2", label: "02. 💎 내면의 절대 코어", desc: "흔들리지 않는 진짜 나", intent: "ms_inner_core" },
                    { id: "qk_3", label: "03. 🎭 사회적 가면 (Persona)", desc: "세상이 원하는 나 vs 진짜 나", intent: "ms_social_persona" },
                    { id: "qk_4", label: "04. 🐍 금지된 욕망", desc: "나조차 몰랐던 은밀한 본능", intent: "ms_forbidden_desire" },
                    { id: "qk_5", label: "05. 🕳️ 운명의 웜홀 (Void)", desc: "채워지지 않는 구멍의 비밀", intent: "ms_void_wormhole" },
                    { id: "qk_6", label: "06. 🔋 퀀텀 배터리 (12운성)", desc: "나의 에너지 레벨 측정", intent: "deep_12_wunsung_cycle" },
                    { id: "qk_7", label: "07. ⚔️ 비밀 무기 (신살)", desc: "위기에 발동하는 특수 스킬", intent: "deep_special_stars" },
                    { id: "qk_8", label: "08. ⚖️ 오행 연금술", desc: "결핍을 에너지로 바꾸는 법", intent: "ohaeng_balance_report" }
                ]
            },
            {
                id: "phase_2",
                label: "Phase 2: 리얼타임 스캔 (19~36)",
                desc: "현재 에너지 상태 진단",
                intent: "NAV_PHASE_2",
                children: [
                    { id: "qk_19", label: "19. ☁️ 영혼의 날씨 예보", desc: "지금 내 마음의 기상도", intent: "ms_soul_weather" },
                    { id: "qk_20", label: "20. 🎭 갭 스캐너 (Gap)", desc: "이상과 현실의 오차 측정", intent: "ms_gap_scanner" },
                    { id: "qk_21", label: "21. 👾 내 안의 버그 탐지", desc: "반복되는 시스템 오류 수정", intent: "ms_dark_bug" },
                    { id: "qk_22", label: "22. 🩸 에너지 뱀파이어 식별", desc: "내 기를 뺏는 존재 차단", intent: "ms_energy_vampire" },
                    { id: "qk_23", label: "23. 🔋 활력 충전소", desc: "나만의 고속 충전 방식", intent: "assess_energy_source" },
                    { id: "qk_24", label: "24. 🧱 변화 저항값 측정", desc: "변화를 거부하는 에고 확인", intent: "assess_change_resistance" }
                ]
            },
            {
                id: "phase_3",
                label: "Phase 3: 운명 연금술 (37~54)",
                desc: "운명의 궤도 수정",
                intent: "NAV_PHASE_3",
                children: [
                    { id: "qk_37", label: "37. 🧠 뇌 회로 재배선", desc: "생각 패턴 바꾸기 리부트", intent: "ms_brain_rewire" },
                    { id: "qk_38", label: "38. ⏳ 타임라인 접속", desc: "미래의 내가 보내는 신호", intent: "ms_timeline_connect" },
                    { id: "qk_39", label: "39. 🌑 쉐도우 댄스", desc: "그림자와 친구가 되는 법", intent: "ms_shadow_dance" },
                    { id: "qk_40", label: "40. 🌊 무위(Wu-Wei) 흐름", desc: "가장 쉬운 성공 경로 찾기", intent: "ms_wu_wei" },
                    { id: "qk_41", label: "41. 🖼️ 운명 리프레이밍", desc: "불행을 서사로 바꾸는 기술", intent: "assess_perspective_quiz" },
                    { id: "qk_42", label: "42. ❤️ 사랑의 거울 (Mirror)", desc: "관계에서 나를 보기", intent: "ms_rel_mirror" }
                ]
            },
            {
                id: "phase_4",
                label: "Phase 4: 메타 뷰 (55~90)",
                desc: "관찰자 시점 획득",
                intent: "NAV_PHASE_4",
                children: [
                    { id: "qk_55", label: "55. ☁️ 생각의 하늘 날기", desc: "생각과 나 분리하기", intent: "ms_sky_view" },
                    { id: "qk_56", label: "56. 🎧 내면의 악플러 음소거", desc: "비판적 자아 끄기", intent: "ms_mute_hater" },
                    { id: "qk_57", label: "57. 🌌 우주적 자아 접속", desc: "Big Mind와의 동기화", intent: "ms_cosmos_login" },
                    { id: "qk_58", label: "58. 🧬 DNA 카르마 정화", desc: "물려받은 운명 끊기", intent: "year_pillar_roots" },
                    { id: "qk_59", label: "59. 👁️ 제3의 눈 (직관)", desc: "논리를 넘어선 통찰", intent: "ms_iching_oracle" }
                ]
            },
            {
                id: "phase_5",
                label: "Phase 5: 마스터리 (91~108)",
                desc: "자유의지 발현",
                intent: "NAV_PHASE_5",
                children: [
                    { id: "qk_91", label: "91. 🔑 마스터 키 획득", desc: "내 운명의 핵심 코드", intent: "ms_master_key" },
                    { id: "qk_92", label: "92. 🛡️ 쉐도우 헌터 자격", desc: "어둠을 다스리는 자", intent: "ms_shadow_hunter" },
                    { id: "qk_93", label: "93. 🎨 내 운명 작곡하기", desc: "새로운 삶의 악보 쓰기", intent: "ms_compose_destiny" },
                    { id: "qk_108", label: "108. 🏁 여정의 완성", desc: "새로운 시작을 위한 축배", intent: "ms_journey_end" }
                ]
            }
        ]
    },







    // 15. 🚀 무실패 스타트업 설계 (STARTUP_DESIGN - Restored)
    STARTUP_DESIGN: {
        id: 'STARTUP_DESIGN',
        label: "무실패 스타트업 (Original)",
        icon: "🚀",
        neuro_trigger: "내 사주에 맞는 무실패 창업 전략",
        style: 'premium_gold',
        sub_menus: [
            {
                id: "sd_dna",
                label: "🧠 CEO DNA (리더십 코드)",
                desc: "나는 스티브 잡스형인가, 관리자형인가?",
                intent: "ms_startup_dna"
            },
            {
                id: "sd_wealth",
                label: "🔥 머니 마그넷 (부의 필살기)",
                desc: "내 사주가 돈을 버는 가장 빠른 길",
                intent: "ms_startup_wealth"
            },
            {
                id: "sd_timing",
                label: "🚀 퀀텀 스케일 (확장 타이밍)",
                desc: "언제 엑셀을 밟아야 하는가?",
                intent: "ms_startup_timing"
            }
        ]
    }
};

// ============== 추천 엔진 ==============

/**
 * 사용자 맞춤형 아이콘 추천 엔진
 * 사주 데이터를 분석해 가장 필요한 아이콘에 '추천' 배지를 달아줍니다.
 */
export function getRecommendedIcons(userProfile: any): IconRecommendation[] {
    const recommendations: IconRecommendation[] = [];

    if (!userProfile?.saju) return recommendations;

    // 1. 재성(돈) 이슈 -> 세상과 부
    if (userProfile.saju?.wealth_status === 'broken' || userProfile.saju?.wealth_status === 'weak') {
        recommendations.push({ id: 'WORLD_WEALTH', badge: '🔥 부의 흐름', priority: 1 });
    }
    // 2. 교운기 -> 실전 코칭
    if (userProfile.saju?.is_changing_period) {
        recommendations.push({ id: 'STRATEGY_LAB', badge: '⏳ 타이밍', priority: 1 });
    }
    // 3. 관성(관계) 충돌 -> 명심 라이프
    if (userProfile.saju?.relationship_clash) {
        recommendations.push({ id: 'LIFE_HEALING', badge: '💔 관계 치유', priority: 2 });
    }
    // 4. 식상(표현) 막힘 -> 나의 명심
    if (userProfile.saju?.expression_blocked) {
        recommendations.push({ id: 'MY_CORE', badge: '🔓 잠재력 발견', priority: 2 });
    }

    // [NEW] 초월 연구소는 호기심 자극
    recommendations.push({
        id: 'X_LAB',
        badge: 'NEW'
    });

    return recommendations.sort((a, b) => (a.priority || 99) - (b.priority || 99));
}

/**
 * 메인 아이콘 목록 가져오기 (추천 배지 포함 + 정렬 로직 수정됨)
 */
export function getMainIconsWithRecommendations(userProfile?: any): (MainIcon & { badge?: string })[] {
    const icons = Object.values(ICON_DRILL_DOWN_MAP);
    const recommendations = userProfile ? getRecommendedIcons(userProfile) : [];

    // 1. 배지와 추천 우선순위(_recommendedPriority) 매핑
    const mappedIcons = icons.map(icon => {
        const rec = recommendations.find(r => r.id === icon.id);
        return {
            ...icon,
            badge: rec?.badge,
            _recommendedPriority: rec?.priority ?? 999 // 추천된 경우 우선순위, 없으면 999
        };
    });

    // 2. 기본 우선순위 정의 (1.나의명심 ~ 5.초월연구소 / 6.Legacy)
    const DEFAULT_PRIORITY: Record<string, number> = {
        'QUANTUM_AWAKENING': -1, // [Top Priority]
        'NEURAL_ENGINEERING': -0.8, // [New Top Priority]
        'AWARENESS_108': 0, // [Restored Top]
        'STARTUP_DESIGN': 0.5, // [Restored High Priority]
        'MY_CORE': 1,
        'STRATEGY_LAB': 2,
        'LIFE_HEALING': 3,
        'WORLD_WEALTH': 4,
        'X_LAB': 5,
        // Legacy Menus (Appended as requested)
        'WEALTH': 6,
        'BIO_SYNC': 7,
        'RELATIONSHIP': 8,
        'CAREER': 9,
        'PERSONALITY_ANALYSIS': 10,
        'DAILY_MISSION': 11,
        'SAJU_ANALYSIS': 12,
        'STRESS_RELIEF': 13,
        'HEALTH_QA': 14, // [NEW] 오늘의 건강상식
        'BIO_CARE': 15 // [NEW] 바이오 밸런서
    };

    // 3. 정렬 로직
    return mappedIcons.sort((a, b) => {
        if (a._recommendedPriority !== 999 && b._recommendedPriority !== 999) {
            return a._recommendedPriority - b._recommendedPriority;
        }
        if (a._recommendedPriority !== 999) return -1;
        if (b._recommendedPriority !== 999) return 1;

        const priorityA = DEFAULT_PRIORITY[a.id] ?? 99;
        const priorityB = DEFAULT_PRIORITY[b.id] ?? 99;
        return priorityA - priorityB;
    });
}

/**
 * 서브메뉴 아이템으로 AI 대화 시작 프롬프트 생성
 */
export function generateChatPromptFromIntent(intent: string, userProfile?: any): string {
    // 0. [Self-Coaching] 대화형 코칭 엔진 트리거 (Backend Interception)
    const selfCoachingIntents = [
        'saju_core_summary', 'day_master_deep', 'month_pillar_role', 'year_pillar_roots',
        'hour_pillar_desire', 'ohaeng_balance_report', 'gongmang_deep_analysis'
    ];

    // [New] 'ms_'(Myeongsim) prefix for new features
    if (selfCoachingIntents.includes(intent) || intent.startsWith('assess_') || intent.startsWith('deep_') || intent.startsWith('ms_') || intent.startsWith('NAV_')) {
        return `[INTENT:${intent}]`;
    }

    // 1. 108 자각 엔진 우선 시도
    const awakeningPrompt = generateAwakeningPrompt(intent, userProfile);
    if (awakeningPrompt) {
        return awakeningPrompt;
    }

    // 2. 기본 프롬프트 맵 (Fallback)
    const prompts: Record<string, string> = {
        // 기존 프롬프트 유지 (필요시)
        'shadow_exhaustion': '돈이 새는 패턴을 분석해주세요.',
        'gift_divine_will': '나만의 부자 코드를 알려주세요.',
        // ... (Legacy prompts can remain as fallback or be removed if unused)
    };

    return prompts[intent] || '이 주제에 대해 깊이 있게 분석해주세요.';
}

/**
 * 스타일에 따른 CSS 클래스 반환 (프론트엔드용)
 */
export function getIconStyleClasses(style?: MainIcon['style']): string {
    switch (style) {
        case 'premium_gold':
            return 'border-2 border-amber-400 shadow-lg shadow-amber-400/20 bg-gradient-to-br from-amber-500/10 to-yellow-500/10';
        case 'premium_purple':
            return 'border-2 border-purple-400 shadow-lg shadow-purple-400/20 bg-gradient-to-br from-purple-500/10 to-indigo-500/10';
        case 'healing_green':
            return 'border-2 border-emerald-400 shadow-lg shadow-emerald-400/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/10';
        default:
            return 'border border-white/10 bg-white/5';
    }
}
