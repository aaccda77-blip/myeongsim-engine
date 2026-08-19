import { getQuantumModeContext, QUANTUM_MODES } from '../data/QuantumHackingDB';
import { getRelationshipContext, RELATIONSHIP_MODES } from '../data/RelationshipContentDB';
import { calculateEnergyLifecycle, calculateExpansionVoid, JIJANGGAN_MAP, ENERGY_LIFECYCLE_STAGES } from '../utils/sajuLogic';

/**
 * SelfCoachingModule.ts - 자각과 자유의지 발현을 위한 자기코칭 엔진
 * [Upgrade Version 2.0] - Trigger Modes & Quantum Hacking Support
 */

export interface CoachingResponse {
    type: 'COACHING_PROMPT';
    message: string;
    options: {
        label: string;
        value: string;
        trigger_mode?: string; // [Added] Trigger mode for UI interactions (e.g., CONSCIOUSNESS_LEVEL_3)
        next_prompt_guide?: string;
    }[];
    system_prompt_injection?: string;
}

// [Added] Import Awakening Quantum Helper
import { getAwakeningContext, AWAKENING_PHASE_1, AWAKENING_PHASE_2, AWAKENING_PHASE_3, AWAKENING_PHASE_4, AWAKENING_PHASE_5 } from '../data/AwakeningQuantumDB';
// [Added] Import Integrated Quantum Helper
import { getIntegratedQuantumContext, PERSONALITY_MODES, SAJU_MODES, DAILY_MODES, HEALING_MODES } from '../data/IntegratedQuantumDB';
// [Added] Import Wealth/Career Helper
import { getWealthContext, getCareerContext, WEALTH_MODES, CAREER_MODES } from '../data/WealthCareerDB';
// [Added] Import Startup Helper
import { getStartupContext, STARTUP_MODES } from '../data/StartupContentDB';

export class SelfCoachingModule {

    /**
     * 의도(Intent)와 사주 데이터를 받아 '선제적 질문'을 생성합니다.
     */
    public static getCoachingResponse(intent: string, sajuData: any, dayMasterOverride?: string): CoachingResponse | null {

        const dayMaster = dayMasterOverride || sajuData?.dayMaster || '당신';
        // KO Char Extraction (Safety)
        const dayMasterChar = dayMaster.replace(/[^\uAC00-\uD7A3]/g, '') || '갑';

        // [NEW] 3D Neural Engineering Modes (Priority: Highest)
        if (intent.startsWith('ms_3d_') || intent === 'ms_64_neural_code' || intent === 'ms_3s_protocol_start') {

            // 1. Full 3D Scan
            if (intent === 'ms_3d_full_scan') {
                return {
                    type: 'COACHING_PROMPT',
                    message: `🧬 **3D 정밀 분석: 전체 좌표 스캔**\n\n당신의 내면 에너지를 3차원 좌표계로 분석합니다:\n\n- **X축 (의식 코드)**: Dark → Neural → Meta 현재 위치\n- **Y축 (주파수)**: 생산적 vs 파괴적 행동 패턴\n- **Z축 (벡터)**: 에너지 폭발(Out) vs 함몰(In) 위험도\n\n전체 스캔을 시작하시겠습니까?`,
                    options: [
                        { label: "🚀 전체 스캔 시작", value: "start_full_scan", trigger_mode: "immediate", next_prompt_guide: "Perform comprehensive 3D analysis: X-axis (consciousness level), Y-axis (frequency/behavior), Z-axis (energy vector). Provide detailed insights for each dimension." },
                        { label: "📊 개별 축 선택", value: "select_axis", trigger_mode: "immediate", next_prompt_guide: "Let user choose which axis to analyze first (X, Y, or Z)." }
                    ],
                    system_prompt_injection: `[3D Scan Protocol] Analyze user's energy in 3D coordinate system. DayMaster: ${dayMasterChar}.`
                };
            }

            // 2. X-Axis: Consciousness Code
            if (intent === 'ms_3d_x_axis') {
                return {
                    type: 'COACHING_PROMPT',
                    message: `🧠 **X축 분석: 의식 코드 (Consciousness Level)**\n\n당신의 현재 의식 상태를 3단계로 분석합니다:\n\n- **Dark Code (어둠)**: 무의식적 반응, 피해자 모드\n- **Neural Code (각성)**: 자각, 관찰자 모드\n- **Meta Code (초월)**: 창조자, 의미 부여 모드\n\n최근 일주일간 당신의 의식 상태는?`,
                    options: [
                        { label: "🌑 Dark: 자동반응 모드", value: "DARK_MODE", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: "User is in Dark Code (reactive mode). Guide them to recognize automatic patterns and start observing." },
                        { label: "🧬 Neural: 관찰자 모드", value: "NEURAL_MODE", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: "User is in Neural Code (observer mode). Help them deepen awareness and find patterns." },
                        { label: "✨ Meta: 창조자 모드", value: "META_MODE", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: "User is in Meta Code (creator mode). Support them in manifesting intentions and creating meaning." }
                    ],
                    system_prompt_injection: `[X-Axis Protocol] Consciousness level analysis. DayMaster: ${dayMasterChar}.`
                };
            }

            // 3. Y-Axis: Frequency
            if (intent === 'ms_3d_y_axis') {
                return {
                    type: 'COACHING_PROMPT',
                    message: `📡 **Y축 분석: 주파수 측정 (Behavior Frequency)**\n\n당신의 행동 패턴이 생산적인지 파괴적인지 측정합니다:\n\n- **고주파 (High)**: 창조, 성장, 기여\n- **중립 (Neutral)**: 유지, 반복, 안정\n- **저주파 (Low)**: 소모, 회피, 파괴\n\n최근 당신의 행동 주파수는?`,
                    options: [
                        { label: "📈 고주파: 창조/성장 중", value: "HIGH_FREQ", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: "User is in high frequency (creative/growth mode). Amplify this energy with specific actions." },
                        { label: "➡️ 중립: 유지/반복 중", value: "NEUTRAL_FREQ", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: "User is in neutral frequency (maintenance mode). Help them identify what needs to shift." },
                        { label: "📉 저주파: 소모/회피 중", value: "LOW_FREQ", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: "User is in low frequency (destructive mode). Identify energy drains and provide recovery protocol." }
                    ],
                    system_prompt_injection: `[Y-Axis Protocol] Frequency analysis. DayMaster: ${dayMasterChar}.`
                };
            }

            // 4. Z-Axis: Energy Vector
            if (intent === 'ms_3d_z_axis') {
                return {
                    type: 'COACHING_PROMPT',
                    message: `⚡ **Z축 분석: 에너지 벡터 (Energy Direction)**\n\n당신의 에너지가 어느 방향으로 흐르는지 분석합니다:\n\n- **폭발 (Explosion)**: 과잉 표출, 번아웃 위험\n- **균형 (Balance)**: 적절한 흐름\n- **함몰 (Implosion)**: 억압, 우울 위험\n\n현재 당신의 에너지 방향은?`,
                    options: [
                        { label: "💥 폭발: 과잉 표출", value: "EXPLOSION", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: "User's energy is exploding outward (burnout risk). Provide grounding and containment strategies." },
                        { label: "⚖️ 균형: 적절한 흐름", value: "BALANCE", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: "User's energy is balanced. Help them maintain this equilibrium." },
                        { label: "🕳️ 함몰: 억압/우울", value: "IMPLOSION", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: "User's energy is imploding inward (depression risk). Provide expression and release strategies." }
                    ],
                    system_prompt_injection: `[Z-Axis Protocol] Energy vector analysis. DayMaster: ${dayMasterChar}.`
                };
            }

            // 5. 64 Neural Code Decoder
            if (intent === 'ms_64_neural_code') {
                return {
                    type: 'COACHING_PROMPT',
                    message: `🧬 **64비트 뉴럴 코드 (Myeongsim Neural Codes Decoder)**\n\n당신의 DNA에 각인된 64가지 원형 코드를 분석합니다.\n\n각 코드는 3단계로 구성됩니다:\n- **Dark Code**: 그림자 패턴\n- **Gift**: 재능\n- **Meta Code**: 초월적 선물\n\n어떤 코드를 먼저 해독하시겠습니까?`,
                    options: [
                        { label: "🌑 Dark Code 분석", value: "decode_dark", trigger_mode: "immediate", next_prompt_guide: "Analyze user's shadow patterns using their Saju data. Identify recurring dark codes." },
                        { label: "🎁 Gift 발견", value: "decode_gift", trigger_mode: "immediate", next_prompt_guide: "Identify user's natural talents and gifts using their Saju data." },
                        { label: "✨ Meta Code 각성", value: "decode_meta", trigger_mode: "immediate", next_prompt_guide: "Explore user's transcendent potential using their Saju data." },
                        { label: "🔮 전체 코드 맵", value: "full_code_map", trigger_mode: "immediate", next_prompt_guide: "Provide comprehensive 64-code analysis based on user's complete Saju chart." }
                    ],
                    system_prompt_injection: `[64 Neural Code Protocol] Myeongsim Neural Codes analysis. DayMaster: ${dayMasterChar}.`
                };
            }

            // 6. 3S Protocol (Scan-Sync-Shift)
            if (intent === 'ms_3s_protocol_start') {
                return {
                    type: 'COACHING_PROMPT',
                    message: `🚀 **3S 솔루션 프로토콜**\n\n분석 결과를 실행 가능한 행동으로 변환합니다:\n\n1. **Scan**: 현재 상태 스캔\n2. **Sync**: 목표와 동기화\n3. **Shift**: 즉각 실행\n\n어떤 영역부터 시작하시겠습니까?`,
                    options: [
                        { label: "🧠 의식 전환 (Mindset Shift)", value: "3S_MINDSET", trigger_mode: "immediate", next_prompt_guide: "Guide user through 3S protocol for mindset transformation: Scan current beliefs → Sync with desired state → Shift with specific action." },
                        { label: "⚡ 에너지 최적화 (Energy Optimization)", value: "3S_ENERGY", trigger_mode: "immediate", next_prompt_guide: "Guide user through 3S protocol for energy optimization: Scan energy drains → Sync with vitality → Shift with recovery action." },
                        { label: "🎯 행동 실행 (Action Execution)", value: "3S_ACTION", trigger_mode: "immediate", next_prompt_guide: "Guide user through 3S protocol for immediate action: Scan obstacles → Sync with goal → Shift with first step." }
                    ],
                    system_prompt_injection: `[3S Protocol] Scan-Sync-Shift transformation. DayMaster: ${dayMasterChar}.`
                };
            }
        }

        // [NEW] Quantum Awakening Modes (108 Protocol, Emotion Alchemy, Shadow Work)
        if (intent === 'saju_108_awakening' || intent === 'ms_emotion_alchemy' || intent === 'ms_shadow_work') {

            // 1. 108 Awakening Protocol
            if (intent === 'saju_108_awakening') {
                return {
                    type: 'COACHING_PROMPT',
                    message: `🌌 **108 자각 프로토콜**\n\n무의식을 깨우는 108가지 질문 여정을 시작합니다.\n\n이 프로토콜은 당신의 무의식 깊은 곳에 숨겨진 진실을 발견하는 과정입니다. 각 질문은 당신의 내면을 비추는 거울입니다.\n\n어떤 카테고리부터 탐험하시겠습니까?`,
                    options: [
                        { label: "🪞 자아 인식 (1-25번)", value: "awk_category_self", trigger_mode: "immediate", next_prompt_guide: "Show protocols 1-25 for self-awareness. Each protocol guides user through dark code → neural code → meta code transformation." },
                        { label: "🌑 그림자 통합 (26-45번)", value: "awk_category_shadow", trigger_mode: "immediate", next_prompt_guide: "Show protocols 26-45 for shadow integration. Help user face and integrate disowned parts." },
                        { label: "💞 관계 역학 (46-65번)", value: "awk_category_relationship", trigger_mode: "immediate", next_prompt_guide: "Show protocols 46-65 for relationship dynamics. Guide user to healthier connections." },
                        { label: "🎯 삶의 목적 (66-88번)", value: "awk_category_purpose", trigger_mode: "immediate", next_prompt_guide: "Show protocols 66-88 for life purpose. Help user discover and live their calling." },
                        { label: "✨ 초월 (89-108번)", value: "awk_category_transcendence", trigger_mode: "immediate", next_prompt_guide: "Show protocols 89-108 for transcendence. Guide user to spiritual awakening and unity consciousness." }
                    ],
                    system_prompt_injection: `[108 Awakening Protocol] Multi-dimensional consciousness exploration. DayMaster: ${dayMasterChar}. Use Awakening108DB for protocol content.`
                };
            }

            // 2. Emotion Alchemy
            if (intent === 'ms_emotion_alchemy') {
                return {
                    type: 'COACHING_PROMPT',
                    message: `⚗️ **감정 연금술 (Emotion Alchemy)**\n\n감정을 에너지로 변환하는 기술을 배웁니다.\n\n부정적 감정은 '나쁜 것'이 아니라 **'변환되지 않은 에너지'**입니다. 연금술사처럼 이 원석을 황금으로 바꾸는 법을 익힙니다.\n\n지금 가장 다루기 힘든 감정은 무엇입니까?`,
                    options: [
                        { label: "😰 불안/두려움", value: "ALCHEMY_FEAR", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: "Transform fear into awareness. Fear signals what matters. Ask: What is this fear protecting? Convert to vigilance energy." },
                        { label: "😡 분노/짜증", value: "ALCHEMY_ANGER", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: "Transform anger into boundaries. Anger signals violated values. Ask: What boundary was crossed? Convert to assertive energy." },
                        { label: "😢 슬픔/우울", value: "ALCHEMY_SADNESS", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: "Transform sadness into depth. Sadness signals loss or longing. Ask: What needs to be grieved? Convert to compassion energy." },
                        { label: "😫 무기력/권태", value: "ALCHEMY_APATHY", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: "Transform apathy into redirection. Apathy signals misalignment. Ask: What needs to change? Convert to transformation energy." },
                        { label: "😖 수치심/죄책감", value: "ALCHEMY_SHAME", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: "Transform shame into growth. Shame signals gap between values and actions. Ask: What can I learn? Convert to integrity energy." }
                    ],
                    system_prompt_injection: `[Emotion Alchemy Protocol] Transform negative emotions into fuel. DayMaster: ${dayMasterChar}. Use Saju elements to guide emotional processing.`
                };
            }

            // 3. Shadow Work
            if (intent === 'ms_shadow_work') {
                return {
                    type: 'COACHING_PROMPT',
                    message: `🌑 **그림자 작업 (Shadow Work)**\n\n내면의 어둠과 대화하기\n\n당신이 숨기고 싶어 하는 부분, 인정하기 싫은 면모가 바로 **'그림자(Shadow)'**입니다. 이것을 억압하면 무의식에서 당신을 조종합니다. 하지만 직면하고 통합하면 가장 강력한 힘이 됩니다.\n\n어떤 그림자와 대화하시겠습니까?`,
                    options: [
                        { label: "🎭 가면 속 진짜 나", value: "SHADOW_PERSONA", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: "Explore the gap between social mask and true self. Ask: Who are you when nobody's watching? Integrate authentic self." },
                        { label: "👿 인정하기 싫은 욕망", value: "SHADOW_DESIRE", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: "Explore repressed desires. Ask: What do you secretly want but judge yourself for wanting? Integrate shadow desires." },
                        { label: "💢 투사된 분노", value: "SHADOW_PROJECTION", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: "Explore what you hate in others (projection). Ask: What trait in others triggers you most? That's your shadow. Own it." },
                        { label: "🕳️ 내면의 공허함", value: "SHADOW_VOID", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: "Explore existential void. Ask: What are you avoiding by staying busy? Face the emptiness. Find meaning in it." },
                        { label: "⚡ 억압된 힘", value: "SHADOW_POWER", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: "Explore disowned power. Ask: What strength did you hide to fit in? Reclaim your power. Use it wisely." }
                    ],
                    system_prompt_injection: `[Shadow Work Protocol] Integrate disowned parts of self. DayMaster: ${dayMasterChar}. Use Saju Hidden Stems to reveal shadow patterns.`
                };
            }
        }

        // [PHASE 3-i] 108 Awakening Quantum Modes (Top Priority)
        if (intent.startsWith('ms_soul_') || intent.startsWith('ms_void_') || intent.startsWith('ms_gap_') || intent.startsWith('ms_brain_') || intent.startsWith('ms_sky_') || intent.startsWith('ms_master_') || intent.startsWith('ms_shadow_')) {
            const context = getAwakeningContext(intent, sajuData);
            const allPhases = { ...AWAKENING_PHASE_1, ...AWAKENING_PHASE_2, ...AWAKENING_PHASE_3, ...AWAKENING_PHASE_4, ...AWAKENING_PHASE_5 };
            const modeInfo = allPhases[intent];

            if (modeInfo) {
                return {
                    type: 'COACHING_PROMPT',
                    message: `### ${modeInfo.title}\n\n**"${modeInfo.subtitle}"**\n\n${modeInfo.core_concept}\n\n이 프로토콜을 시작하시겠습니까?`,
                    options: [
                        { label: "🚀 프로토콜 시작", value: "start_protocol", trigger_mode: "immediate", next_prompt_guide: `User initiates ${modeInfo.title}. Apply: ${modeInfo.saju_analysis_guide}` },
                        { label: "ℹ️ 매뉴얼 보기", value: "explain_protocol", trigger_mode: "immediate", next_prompt_guide: `Explain the concept of ${modeInfo.title} in the Awakening journey.` }
                    ],
                    system_prompt_injection: context
                };
            }
        }

        // [PHASE 3-h] Final Integrated Modes (Priority High)
        // 1. Personality (Soul Architecture)
        if (intent.startsWith('ms_soul_') || intent.startsWith('ms_dark_')) {
            const context = getIntegratedQuantumContext(intent, sajuData);
            const modeInfo = PERSONALITY_MODES[intent];
            if (modeInfo) {
                return {
                    type: 'COACHING_PROMPT',
                    message: `### ${modeInfo.title}\n\n**"${modeInfo.subtitle}"**\n\n${modeInfo.core_concept}\n\n당신의 매트릭스를 해독하시겠습니까?`,
                    options: [
                        { label: "🧬 설계도 해독", value: "analyze_soul", trigger_mode: "immediate", next_prompt_guide: `User initiates ${modeInfo.title}. Apply: ${modeInfo.saju_analysis_guide}` },
                        { label: "ℹ️ 개념 설명", value: "explain_soul", trigger_mode: "immediate", next_prompt_guide: `Explain the Saju concept of ${modeInfo.title}.` }
                    ],
                    system_prompt_injection: context
                };
            }
        }
        // 2. Saju (Destiny GPS)
        if (intent.startsWith('ms_destiny_') || intent.startsWith('ms_life_')) {
            const context = getIntegratedQuantumContext(intent, sajuData);
            const modeInfo = SAJU_MODES[intent];
            if (modeInfo) {
                return {
                    type: 'COACHING_PROMPT',
                    message: `### ${modeInfo.title}\n\n**"${modeInfo.subtitle}"**\n\n${modeInfo.core_concept}\n\n미래 예측을 확인하시겠습니까?`,
                    options: [
                        { label: "📡 수평선 스캔", value: "analyze_forecast", trigger_mode: "immediate", next_prompt_guide: `User initiates ${modeInfo.title}. Apply: ${modeInfo.saju_analysis_guide}` },
                        { label: "🌊 전략 브리핑", value: "explain_forecast", trigger_mode: "immediate", next_prompt_guide: `Explain Saju forecasting strategy for ${modeInfo.title}.` }
                    ],
                    system_prompt_injection: context
                };
            }
        }
        // 3. Daily (Energy Cheat Key)
        if (intent.startsWith('ms_daily_') || intent.startsWith('ms_energy_')) {
            const context = getIntegratedQuantumContext(intent, sajuData);
            const modeInfo = DAILY_MODES[intent];
            if (modeInfo) {
                return {
                    type: 'COACHING_PROMPT',
                    message: `### ${modeInfo.title}\n\n**"${modeInfo.subtitle}"**\n\n${modeInfo.core_concept}\n\n오늘의 미션을 시작할 준비가 되셨나요?`,
                    options: [
                        { label: "⚡ 미션 실행", value: "give_mission", trigger_mode: "immediate", next_prompt_guide: `User initiates ${modeInfo.title}. Apply: ${modeInfo.saju_analysis_guide}` },
                        { label: "🔋 에너지 리포트", value: "check_energy", trigger_mode: "immediate", next_prompt_guide: `Analyze daily energy for ${modeInfo.title}.` }
                    ],
                    system_prompt_injection: context
                };
            }
        }
        // 4. Healing (Neural Healing)
        if (intent.startsWith('ms_sonic_') || intent.startsWith('ms_mental_')) {
            const context = getIntegratedQuantumContext(intent, sajuData);
            const modeInfo = HEALING_MODES[intent];
            if (modeInfo) {
                return {
                    type: 'COACHING_PROMPT',
                    message: `### ${modeInfo.title}\n\n**"${modeInfo.subtitle}"**\n\n${modeInfo.core_concept}\n\n치유 세션을 시작하시겠습니까?`,
                    options: [
                        { label: "🎧 테라피 시작", value: "start_therapy", trigger_mode: "immediate", next_prompt_guide: `User initiates ${modeInfo.title}. Apply: ${modeInfo.saju_analysis_guide}` },
                        { label: "🧠 원리 설명", value: "explain_therapy", trigger_mode: "immediate", next_prompt_guide: `Explain Saju healing theory for ${modeInfo.title}.` }
                    ],
                    system_prompt_injection: context
                };
            }
        }

        // [PHASE 3-e] Quantum Wealth Modes (Priority High)
        if (intent.startsWith('ms_wealth_')) {
            const context = getWealthContext(intent, sajuData);
            const modeInfo = WEALTH_MODES[intent];

            if (modeInfo) {
                return {
                    type: 'COACHING_PROMPT',
                    message: `### ${modeInfo.title}\n\n**"${modeInfo.subtitle}"**\n\n${modeInfo.core_concept}\n\n당신의 부의 코드를 스캔하시겠습니까?`,
                    options: [
                        { label: "💰 머니 플로우 스캔", value: "analyze_wealth_flow", trigger_mode: "immediate", next_prompt_guide: `User initiates ${modeInfo.title}. Apply: ${modeInfo.saju_analysis_guide}` },
                        { label: "📊 투자 전략", value: "explain_wealth_strategy", trigger_mode: "immediate", next_prompt_guide: `Explain Saju wealth strategy for ${modeInfo.title}.` }
                    ],
                    system_prompt_injection: context
                };
            }
        }

        // [PHASE 3-f] Quantum Career Modes (Priority High)
        if (intent.startsWith('ms_career_') || intent === 'career_timing_analysis') {
            const context = getCareerContext(intent, sajuData);
            const modeInfo = CAREER_MODES[intent];

            if (modeInfo) {
                return {
                    type: 'COACHING_PROMPT',
                    message: `### ${modeInfo.title}\n\n**"${modeInfo.subtitle}"**\n\n${modeInfo.core_concept}\n\n숨겨진 잠재력을 잠금 해제하시겠습니까?`,
                    options: [
                        { label: "🚀 히든 스킬 발견", value: "analyze_career_skill", trigger_mode: "immediate", next_prompt_guide: `User initiates ${modeInfo.title}. Apply: ${modeInfo.saju_analysis_guide}` },
                        { label: "⚖️ 진로 적합성 평가", value: "explain_career_path", trigger_mode: "immediate", next_prompt_guide: `Explain Saju career path for ${modeInfo.title}.` }
                    ],
                    system_prompt_injection: context
                };
            }
        }

        // [PHASE 3-d] Quantum Startup Modes (Priority High)
        if (intent.startsWith('ms_startup_')) {
            const context = getStartupContext(intent, sajuData);
            const modeInfo = STARTUP_MODES[intent];

            if (modeInfo) {
                return {
                    type: 'COACHING_PROMPT',
                    message: `### ${modeInfo.title}\n\n**"${modeInfo.subtitle}"**\n\n${modeInfo.core_concept}\n\n당신의 비즈니스 DNA를 해독하시겠습니까?`,
                    options: [
                        {
                            label: "🚀 창업가 코드 분석",
                            value: "analyze_startup_dna",
                            trigger_mode: "immediate",
                            next_prompt_guide: `User initiates ${modeInfo.title}. Apply: ${modeInfo.saju_analysis_guide}`
                        },
                        {
                            label: "📚 전략 브리핑",
                            value: "explain_startup_theory",
                            trigger_mode: "immediate",
                            next_prompt_guide: `Explain the concept of ${modeInfo.title} in Saju Business Theory.`
                        }
                    ],
                    system_prompt_injection: context
                };
            }

            // [NEW] 창업 컨텐츠 매칭
            if (intent === 'ms_startup_content_match') {
                const dayMaster = dayMasterOverride || sajuData?.dayMaster || '갑';
                const dayMasterChar = dayMaster.replace(/[^\uAC00-\uD7A3]/g, '') || '갑';

                return {
                    type: 'COACHING_PROMPT',
                    message: `💡 **내게 맞는 창업 아이템 분석**\n\n회원님의 일간 **'${dayMasterChar}'**를 기반으로, 창업 성공 확률이 높은 컨텐츠와 재료를 분석합니다.\n\n어떤 분야의 창업을 고민하고 계신가요?`,
                    options: [
                        {
                            label: "🍽️ 외식/식음료 (F&B)",
                            value: "STARTUP_FB",
                            trigger_mode: "CONSCIOUSNESS_LEVEL_1",
                            next_prompt_guide: `User wants F&B startup analysis. Based on DayMaster ${dayMasterChar}, analyze: 1) Best food/beverage type 2) Ingredient compatibility 3) Customer target 4) Location strategy.`
                        },
                        {
                            label: "🛍️ 유통/커머스 (Retail)",
                            value: "STARTUP_RETAIL",
                            trigger_mode: "CONSCIOUSNESS_LEVEL_2",
                            next_prompt_guide: `User wants Retail startup analysis. Based on DayMaster ${dayMasterChar}, analyze: 1) Product category 2) Sales channel (online/offline) 3) Brand positioning.`
                        },
                        {
                            label: "💻 IT/테크 (Tech)",
                            value: "STARTUP_TECH",
                            trigger_mode: "CONSCIOUSNESS_LEVEL_3",
                            next_prompt_guide: `User wants Tech startup analysis. Based on DayMaster ${dayMasterChar}, analyze: 1) Service type (SaaS/Platform/Content) 2) Technical stack 3) Market timing.`
                        },
                        {
                            label: "🎨 크리에이티브 (Creative)",
                            value: "STARTUP_CREATIVE",
                            trigger_mode: "CONSCIOUSNESS_LEVEL_3",
                            next_prompt_guide: `User wants Creative startup analysis. Based on DayMaster ${dayMasterChar}, analyze: 1) Content type 2) Monetization strategy 3) Collaboration potential.`
                        }
                    ],
                    system_prompt_injection: `[Startup Content Match Protocol] DayMaster: ${dayMasterChar}. Provide specific, actionable startup recommendations based on Saju elements.`
                };
            }

            // [NEW] 창업가 뉴럴코드 자각
            if (intent === 'ms_startup_neural_awakening') {
                return {
                    type: 'COACHING_PROMPT',
                    message: `🧠 **창업가 다크코드 → 뉴럴코드 전환**\n\n스타트업 성공을 가로막는 **'다크코드(무의식적 방해 패턴)'**를 **'뉴럴코드(성장 동력)'**로 전환하는 자각 프로토콜입니다.\n\n지금 창업 과정에서 가장 큰 걸림돌은 무엇인가요?`,
                    options: [
                        {
                            label: "😰 완벽주의 (Perfectionism)",
                            value: "DARK_PERFECTIONISM",
                            trigger_mode: "CONSCIOUSNESS_LEVEL_1",
                            next_prompt_guide: `[Dark Code: Perfectionism] User is stuck in perfectionism. Coach: "Done is better than perfect. Your dark code is analysis paralysis. Neural code: Ship fast, iterate faster. What is the MVP you can launch this week?"`
                        },
                        {
                            label: "🤔 자기 의심 (Imposter Syndrome)",
                            value: "DARK_IMPOSTER",
                            trigger_mode: "CONSCIOUSNESS_LEVEL_2",
                            next_prompt_guide: `[Dark Code: Imposter] User doubts their capability. Coach: "Every founder feels this. Your dark code is self-sabotage. Neural code: Fake it till you make it. What is one bold move you can make today?"`
                        },
                        {
                            label: "💰 돈에 대한 두려움 (Money Fear)",
                            value: "DARK_MONEY_FEAR",
                            trigger_mode: "CONSCIOUSNESS_LEVEL_2",
                            next_prompt_guide: `[Dark Code: Money Fear] User fears financial risk. Coach: "Fear is False Evidence. Your dark code is scarcity mindset. Neural code: Money follows value. What value can you create today?"`
                        },
                        {
                            label: "🏃 번아웃 (Burnout)",
                            value: "DARK_BURNOUT",
                            trigger_mode: "CONSCIOUSNESS_LEVEL_1",
                            next_prompt_guide: `[Dark Code: Burnout] User is exhausted. Coach: "Rest is productive. Your dark code is hustle culture addiction. Neural code: Strategic rest. Schedule 1 hour of complete rest today."`
                        },
                        {
                            label: "👥 팀 갈등 (Team Conflict)",
                            value: "DARK_TEAM",
                            trigger_mode: "CONSCIOUSNESS_LEVEL_2",
                            next_prompt_guide: `[Dark Code: Team Conflict] User struggles with team dynamics. Coach: "Conflict is data. Your dark code is control freak. Neural code: Delegate and trust. What can you let go today?"`
                        },
                        {
                            label: "⏰ 타이밍 불안 (Timing Anxiety)",
                            value: "DARK_TIMING",
                            trigger_mode: "CONSCIOUSNESS_LEVEL_3",
                            next_prompt_guide: `[Dark Code: Timing] User worries about market timing. Coach: "The best time was yesterday. The second best is now. Your dark code is waiting for perfect moment. Neural code: Start messy. What can you test today?"`
                        }
                    ],
                    system_prompt_injection: `[Startup Neural Awakening Protocol] Help user transform their dark code into neural code. Provide specific, actionable coaching based on their choice.`
                };
            }
        }

        // [PHASE 3-c] Quantum Relationship Modes (Priority High)
        if (intent.startsWith('ms_rel_')) {
            const context = getRelationshipContext(intent, sajuData);
            const modeInfo = RELATIONSHIP_MODES[intent];

            if (modeInfo) {
                return {
                    type: 'COACHING_PROMPT',
                    message: `### ${modeInfo.title}\n\n**"${modeInfo.subtitle}"**\n\n${modeInfo.core_concept}\n\n당신의 관계 코드를 분석하시겠습니까?`,
                    options: [
                        {
                            label: "❤️ 사랑의 DNA 분석",
                            value: "analyze_love_code",
                            trigger_mode: "immediate",
                            next_prompt_guide: `User initiates ${modeInfo.title}. Apply: ${modeInfo.saju_analysis_guide}`
                        },
                        {
                            label: "📚 관계 이론 탐구",
                            value: "explain_love_theory",
                            trigger_mode: "immediate",
                            next_prompt_guide: `Explain the concept of ${modeInfo.title} in Saju.`
                        }
                    ],
                    system_prompt_injection: context
                };
            }
        }

        // [PHASE 3-b] Quantum Reality Hacking Modes (Priority High)
        if (intent.startsWith('ms_x_') && (intent.includes('dev') || intent.includes('quantum') || intent.includes('alchemy'))) {
            const context = getQuantumModeContext(intent, sajuData);
            const modeInfo = QUANTUM_MODES[intent];

            if (modeInfo) {
                return {
                    type: 'COACHING_PROMPT',
                    message: `### ${modeInfo.title}\n\n**"${modeInfo.subtitle}"**\n\n${modeInfo.core_concept}\n\n이 프로토콜을 어떻게 시작하시겠습니까?`,
                    options: [
                        {
                            label: "🚀 프로토콜 실행",
                            value: "execute_hack",
                            trigger_mode: "immediate",
                            next_prompt_guide: `User initiates ${modeInfo.title}. Apply the following analysis guide: ${modeInfo.saju_analysis_guide}`
                        },
                        {
                            label: "ℹ️ 매뉴얼 보기",
                            value: "explain_hack_concept",
                            trigger_mode: "immediate",
                            next_prompt_guide: `Explain the deep philosophy of ${modeInfo.title} and how it relates to Saju.`
                        }
                    ],
                    system_prompt_injection: context
                };
            }
        }

        // Simple Element Mapping
        const traits: Record<string, string> = {
            '갑': '곧게 뻗어나가는 성장 본능', '을': '유연하게 적응하는 생존력',
            '병': '세상을 밝히는 열정', '정': '섬세하게 타오르는 촛불',
            '무': '모든 것을 품는 듬직함', '기': '실속 있게 기르는 현실감',
            '경': '단호한 결단력', '신': '예리하고 정교한 보석',
            '임': '깊고 넓은 지혜', '계': '스며드는 감수성'
        };
        const myTrait = traits[dayMasterChar] || '고유한 잠재력';

        // 1. [Gap] Essence (Saju Core Summary)
        if (intent === 'saju_core_summary') {
            return {
                type: 'COACHING_PROMPT',
                message: `🔍 **[108 자각] 본질과의 갭 (Gap)**\n\n회원님의 타고난 엔진(일간)은 **'${myTrait}(${dayMaster})'**입니다. 이는 본래 거칠 것 없이 뻗어나가야 할 에너지입니다.\n\n하지만 지금 이 엔진을 얼마나 활용하고 계신가요? 혹시 현실의 벽에 부딪혀 스스로 **'시동을 꺼버린 것'**은 아닌지 분석이 필요합니다.\n\n지금 당신의 상태에 가장 가까운 말을 선택해주세요.`,
                options: [
                    {
                        label: "🌑 레벨 1: \"난 원래 이래\" (단념)",
                        value: "LEVEL_1_GIVEUP",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_1",
                        next_prompt_guide: `[Diagnosis] User is identified with limits. Coach: "That's a learned helplessness. Your Saju engine is intact. Let's restart it."`
                    },
                    {
                        label: "🌗 레벨 2: \"참고 사는 거지\" (억압)",
                        value: "LEVEL_2_SUPPRESS",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_2",
                        next_prompt_guide: `[Acceptance] User is suppressing their nature. Coach: "Endurance is not a virtue here. It causes engine overheating (stress). Acknowledge the pressure."`
                    },
                    {
                        label: "🌕 레벨 3: \"나답게 쓸 거야\" (활용)",
                        value: "LEVEL_3_UTILIZE",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_3",
                        next_prompt_guide: `[Transformation] User is ready to use their trait. Coach: "Excellent. Propose a small 'Engine Test' mission for today."`
                    }
                ],
                system_prompt_injection: `[Core Essence Protocol] DayMaster: ${dayMaster} (${myTrait}). Goal: Move from Helplessness to Utilization.`
            };
        }

        // 2. [Shadow] Day Master Deep
        if (intent === 'day_master_deep') {
            const shadows: Record<string, string> = {
                '갑': '뻣뻣한 고집', '을': '주변 눈치', '병': '급한 성격', '정': '예민한 집착',
                '무': '느려터진 답답함', '기': '의심과 불안', '경': '차가운 독설', '신': '날카로운 비판',
                '임': '음흉한 속내', '계': '감정 기복'
            };
            const myShadow = shadows[dayMasterChar] || '내면의 그림자';

            return {
                type: 'COACHING_PROMPT',
                message: `👁️ **[108 자각] 그림자 명명하기 (Naming)**\n\n지금 회원님을 괴롭히는 감정을 **'${myShadow}'**이라고 이름 붙여보겠습니다.\n이것은 당신의 성격적 결함이 아니라, 위험을 알리는 **'시스템 경보장치'**입니다.\n\n이 경보가 울릴 때, 당신은 보통 어떻게 반응하십니까?`,
                options: [
                    {
                        label: "🌊 1. 감정에 휩쓸린다 (자동반응)",
                        value: "LEVEL_1_REACT",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_1",
                        next_prompt_guide: `[Diagnosis] User is overwhelmed. Coach: "Name it 'The Shadow'. It is just weather passing through your sky. Watch it rain."`
                    },
                    {
                        label: "🛡️ 2. 안 된다고 싸운다 (자기검열)",
                        value: "LEVEL_2_FIGHT",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_2",
                        next_prompt_guide: `[Acceptance] User is fighting the emotion. Coach: "Fighting creates resistance. Allow the shadow to exist. It has a message."`
                    },
                    {
                        label: "🔭 3. 신호를 읽는다 (관찰자)",
                        value: "LEVEL_3_OBSERVE",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_3",
                        next_prompt_guide: `[Transformation] User is observing. Coach: "What is this acute Signal telling you to protect? Use the Shadow as a Radar."`
                    }
                ],
                system_prompt_injection: `[Shadow Protocol] Shadow Name: ${myShadow}. Goal: Move from Reaction to Observation.`
            };
        }

        // 3. [Role] Month Pillar
        if (intent === 'month_pillar_role') {
            return {
                type: 'COACHING_PROMPT',
                message: `🎭 **[108 자각] 무대 재정의 (Reframing)**\n\n월주(Month Pillar)는 당신에게 주어진 **'사회적 배역'**입니다.\n누군가에게는 이것이 '먹고살기 위한 짐'이지만, 관점을 바꾸면 **'내 재능을 실험하는 무대'**가 됩니다.\n\n회원님은 현재 직장이나 사회생활을 어떤 관점으로 바라보고 계십니까?`,
                options: [
                    {
                        label: "⛓️ 1. 생존을 위한 감옥 (피해자)",
                        value: "LEVEL_1_PRISON",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_1",
                        next_prompt_guide: `[Diagnosis] User feels trapped. Coach: "Valid feeling. But realize you have the key. Start by changing one small routine today."`
                    },
                    {
                        label: "⚔️ 2. 이겨야 하는 전장 (투사)",
                        value: "LEVEL_2_BATTLEFIELD",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_2",
                        next_prompt_guide: `[Acceptance] User is fighting the world. Coach: "Relax the shoulders. You don't perform well in survival mode. Turn it into a game."`
                    },
                    {
                        label: "🎪 3. 실험하는 놀이터 (창조자)",
                        value: "LEVEL_3_PLAYGROUND",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_3",
                        next_prompt_guide: `[Transformation] User sees work as play. Coach: "Perfect. What is the 'Main Act' you want to direct on this stage?"`
                    }
                ],
                system_prompt_injection: `[Role Protocol] Month Pillar. Goal: Move from Prison to Playground.`
            };
        }

        // 4. [Roots] Year Pillar
        if (intent === 'year_pillar_roots') {
            // Updated Helper Logic with Trigger Mode support
            const customizedOptions = this.getRootsOptionsByElement(dayMasterChar);

            return {
                type: 'COACHING_PROMPT',
                message: `🧬 **[108 자각] 카르마 분리 (Separation)**\n\n년주(Year Pillar)는 당신이 선택하지 않은 **'주어진 환경(가문/뿌리)'**입니다.\n많은 사람들이 부모나 환경이 심어준 '신념'을 자신의 생각이라고 착각하며 살아갑니다.\n\n지금 당신을 붙잡고 있는 생각("나는 ~해야 한다")이 **진짜 당신의 것입니까, 아니면 물려받은 것입니까?**`,
                options: customizedOptions,
                system_prompt_injection: `[Roots Protocol] Year Pillar. Goal: Move from Inheritance to Mutation.`
            };
        }

        // 5. [Desire] Hour Pillar
        if (intent === 'hour_pillar_desire') {
            const hourBranch = sajuData?.fourPillars?.time?.ji?.char || sajuData?.hourPillar?.branch || '자';
            const jijanggan = JIJANGGAN_MAP[hourBranch] || { main: '?' };
            const hiddenDesire = this.getNaturalDesire(jijanggan.main || '?');
            const hourStem = sajuData?.fourPillars?.time?.gan?.char || sajuData?.timePillar?.stem || '';
            const tenGod = this.calculateTenGod(dayMasterChar, hourStem);

            return {
                type: 'COACHING_PROMPT',
                message: `🎨 **[108 자각] 욕망의 실현 (Manifestation)**\n\n시주(Hour Pillar) 깊은 곳에는 **'${hiddenDesire}'**라는 순수한 본능이 숨어 있습니다.\n(십성: ${tenGod}, 일명 **'말년의 비밀 무기'**)\n\n이것은 남들에게 보여주기 위한 것이 아니라, 오직 **'나의 기쁨'**을 위한 에너지입니다. 이 욕망을 대하는 당신의 태도는 무엇입니까?`,
                options: [
                    {
                        label: "🔒 1. 숨기고 참는다 (억압)",
                        value: "LEVEL_1_REPRESS",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_1",
                        next_prompt_guide: `[Diagnosis] User represses desire. Coach: "Repressed desire becomes toxic. It's safe to let a little steam out. What is a small secret pleasure?"`
                    },
                    {
                        label: "⚖️ 2. 눈치 보며 갈등한다 (타협)",
                        value: "LEVEL_2_CONFLICT",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_2",
                        next_prompt_guide: `[Acceptance] User compromises. Coach: "You don't need permission to be happy. The mask is heavy. Drop it for 10 minutes."`
                    },
                    {
                        label: "🚀 3. 내 멋대로 표출한다 (자유)",
                        value: "LEVEL_3_MANIFEST",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_3",
                        next_prompt_guide: `[Transformation] User is ready. Coach: "Propose a 'Useless Action' Mission. Do something purely for joy, with zero productivity."`
                    }
                ],
                system_prompt_injection: `[Desire Protocol] Hour Pillar. Hidden Desire: ${hiddenDesire}. Goal: Move from Repression to Manifestation.`
            };
        }

        // 6. [Ohaeng] Balance - Alchemy of Deficiency
        if (intent === 'ohaeng_balance_report') {
            const ohaeng = sajuData?.ohaeng || { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
            const scores = [
                { el: '목(Wood)', score: ohaeng.wood || 0, keyword: '성장과 의욕' },
                { el: '화(Fire)', score: ohaeng.fire || 0, keyword: '열정과 표현' },
                { el: '토(Earth)', score: ohaeng.earth || 0, keyword: '포용과 중재' },
                { el: '금(Metal)', score: ohaeng.metal || 0, keyword: '결단과 소신' },
                { el: '수(Water)', score: ohaeng.water || 0, keyword: '지혜와 유연함' }
            ].sort((a, b) => a.score - b.score);

            const weakest = scores[0];
            const dominant = scores[4];

            return {
                type: 'COACHING_PROMPT',
                message: `⚖️ **[108 자각] 오행의 연금술 (빈 공간의 미학)**\n\n회원님의 사주는 **'${dominant.el}'**의 기운이 강한 반면, **'${weakest.el}'**의 기운은 비워져 있습니다.\n\n보통은 이를 '부족함'이라 부르며 채우려 애쓰지만, 명심코칭은 이를 당신만의 **'고유한 여백'**으로 해석합니다.\n\n이 비워진 공간(${weakest.keyword})을 당신은 현재 어떻게 경험하고 계십니까?`,
                options: [
                    {
                        label: "🌑 레벨 1: 결핍의 희생자 (Victim)",
                        value: `LEVEL_1_LACK_${weakest.el}`,
                        trigger_mode: "CONSCIOUSNESS_LEVEL_1",
                        next_prompt_guide: `User feels victimized by the lack of ${weakest.el}. Validate their pain but point out the 'Victim Mindset'.`
                    },
                    {
                        label: "🌗 레벨 2: 가면 쓴 투사 (Fighter)",
                        value: `LEVEL_2_FAKE_${weakest.el}`,
                        trigger_mode: "CONSCIOUSNESS_LEVEL_2",
                        next_prompt_guide: `User is pretending to have ${weakest.el} to fit in. Highlight the exhaustion of this mask and suggest dropping it.`
                    },
                    {
                        label: "🌕 레벨 3: 여백의 창조자 (Creator)",
                        value: `LEVEL_3_SPACE_${weakest.el}`,
                        trigger_mode: "CONSCIOUSNESS_LEVEL_3",
                        next_prompt_guide: `User embraces the lack of ${weakest.el} as a strategic 'Space'. Ask how they will use this empty space creatively today.`
                    }
                ],
                system_prompt_injection: `[DEEP SAJU CONTEXT: Ohaeng Alchemy] Dominant: ${dominant.el}, Weakest: ${weakest.el}. Goal: Reframe Deficiency as Space.`
            };
        }

        // 8. [Gongmang] The Void Portal
        if (intent === 'gongmang_deep_analysis') {
            const dayGan = dayMasterChar;
            const dayBranch = sajuData?.fourPillars?.day?.ji?.char || sajuData?.dayPillar?.branch || '자';
            const voidBranches = calculateExpansionVoid(dayGan, dayBranch);

            // Safe Access & Fallbacks
            const yearBranch = sajuData?.fourPillars?.year?.ji?.char || sajuData?.yearPillar?.branch || '';
            const monthBranch = sajuData?.fourPillars?.month?.ji?.char || sajuData?.monthPillar?.branch || '';
            const hourBranch = sajuData?.fourPillars?.time?.ji?.char || sajuData?.hourPillar?.branch || '';

            // Target determination logic
            let targetPillar = "";
            let mission = "";

            if (monthBranch && voidBranches.includes(monthBranch)) {
                targetPillar = "월주(Month Pillar)";
                mission = "🎭 **미션: 안전한 반항** (점심 메뉴 튀게 시키기 등 소심한 일탈)";
            } else if (yearBranch && voidBranches.includes(yearBranch)) {
                targetPillar = "년주(Year Pillar)";
                mission = "🧬 **미션: 카르마 끊기** (가족의 낡은 관습 하나 거부하기)";
            } else if (hourBranch && voidBranches.includes(hourBranch)) {
                targetPillar = "시주(Hour Pillar)";
                mission = "🎨 **미션: 무용(無用)의 창조** (결과물 없는 낙서, 멍때리기)";
            } else if (voidBranches.includes(dayBranch)) {
                targetPillar = "일주(Day Pillar)";
                mission = "🏝 **미션: 완전한 고독** (30분간 완벽한 단절)";
            } else {
                targetPillar = "없음";
                mission = "🧱 **미션: 현실의 마스터** (작은 청소/정리 달성)";
            }

            let message = targetPillar === "없음"
                ? `🔭 **[108 자각] 공망 없음: 꽉 찬 책임감**\n\n공망이 없다는 것은 현실에 단단히 뿌리내렸음을 의미합니다. 하지만 책임감이 너무 무거워 **'일탈의 자유'**를 억누르고 있지는 않나요?`
                : `🌌 **[108 자각] 현실 해킹 (Reality Hacking)**\n\n사주의 **[${targetPillar}]** 영역에 **'공망(Void)'** 코드가 켜져 있습니다.\n이곳은 세상의 규칙이 통하지 않는 해방구입니다. 이를 **'결핍'**으로 느끼십니까, 아니면 **'자유의 문'**으로 쓰시겠습니까?`;

            return {
                type: 'COACHING_PROMPT',
                message: message,
                options: [
                    {
                        label: "🌑 레벨 1: \"왜 나만 이럴까?\" (수용)",
                        value: "LEVEL_1_HUNGER_VOID",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_1",
                        next_prompt_guide: `[Diagnosis] User feels Void as Lack. Coach: "Name this feeling 'The Void'. It's a system signal, not a flaw."`
                    },
                    {
                        label: "⚡ 레벨 2: \"남들과 다르게 살래\" (전환)",
                        value: "LEVEL_2_INVENTOR_VOID",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_2",
                        next_prompt_guide: `[Transformation] User hacks the system. Coach: "Great shift. How does it feel to break the rules safely?"`
                    },
                    {
                        label: "✨ 레벨 3: \"이 공허함이 나의 무기다\" (초월)",
                        value: "LEVEL_3_META_VOID",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_3",
                        next_prompt_guide: `[Meta-Action] User is Creator. Mission: '${mission}'.`
                    }
                ],
                system_prompt_injection: `[Gongmang Protocol] Target: ${targetPillar}. Mission: ${mission}.`
            };
        }

        // 9. [Phase 1 Extension] Deep Saju Knowledge (Items 9-18)
        if (intent.startsWith('deep_')) {
            const topicMap: Record<string, string> = {
                'deep_ten_gods_psychology': '십성(十星) 심리 구조',
                'deep_12_wunsung_cycle': '12운성 에너지 그래프',
                'deep_daewoon_mission': '대운(Great Cycle)의 미션',
                'deep_yongsin_guardian': '용신(Guardian) 활용법',
                'deep_gyeokguk_weapon': '격국(Structure) 사회적 무기',
                'deep_spouse_palace': '일지(Spouse) 속마음',
                'deep_special_stars': '신살(Special Stars) 매력',
                'deep_noble_connection': '천을귀인(Noble) 인연',
                'deep_health_weakness': '타고난 건강 취약점',
                'deep_soul_age': '영혼의 성숙도 (Soul Age)'
            };
            const topic = topicMap[intent] || '심층 운명 분석';

            return {
                type: 'COACHING_PROMPT',
                message: `📜 **[108 자각] ${topic} 심층 리포트**\n\n회원님의 사주 깊은 곳에 숨겨진 **'${topic}'** 코드를 해독합니다.\n\n이 지식은 단순한 정보가 아니라, 당신이 무의식적으로 따르고 있던 **'운명의 지도'**를 보여줍니다. 어떤 마음으로 이 지혜를 열어보시겠습니까?`,
                options: [
                    {
                        label: "🧠 레벨 1: \"알고 싶다\" (지식 욕구)",
                        value: "LEVEL_1_KNOWLEDGE",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_1",
                        next_prompt_guide: `[Diagnosis] User seeks knowledge about ${topic}. Coach: "Knowledge is power. Let me explain the structure of your ${topic}."`
                    },
                    {
                        label: "💡 레벨 2: \"이해하고 싶다\" (원리 탐구)",
                        value: "LEVEL_2_UNDERSTAND",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_2",
                        next_prompt_guide: `[Acceptance] User wants to understand principles. Coach: "Let's dive deeper. How does this ${topic} manifest in your daily connection?"`
                    },
                    {
                        label: "🔮 레벨 3: \"활용하고 싶다\" (지혜 적용)",
                        value: "LEVEL_3_WISDOM",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_3",
                        next_prompt_guide: `[Transformation] User wants wisdom. Coach: "Wisdom is action. Here is how you use your ${topic} as a weapon today."`
                    }
                ],
                system_prompt_injection: `[Deep Saju Protocol] Topic: ${topic}. Guide: Explain principle -> Connect to life -> Provide application.`
            };
        }

        // 10. [Phase 2] Specific Assessment Handler (Items 19-36) - Rich Content Version
        if (intent.startsWith('assess_')) {
            const getAssessmentContent = (intent: string): CoachingResponse | null => {
                const base = { type: 'COACHING_PROMPT' as const };

                switch (intent) {
                    case 'assess_emotion_checkin': return {
                        ...base,
                        message: `☁️ **[108 자각] 오늘의 감정 기상도**\n\n감정은 당신의 영혼이 보내는 '날씨'와 같습니다. 좋고 나쁨은 없습니다. 단지 지나갈 뿐입니다.\n\n지금 당신의 마음 하늘은 어떤 상태인가요?`,
                        options: [
                            { label: "🌪️ 폭풍우 (압도됨/불안)", value: "L1_STORM", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Emotion is storm. Coach: "Let it rain. Do not fight the storm. It will pass."` },
                            { label: "☁️ 흐림 (답답함/우울)", value: "L2_CLOUDY", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Emotion is cloudy. Coach: "Clouds block the sun, but the sun is always there. What is the cloud made of?"` },
                            { label: "☀️ 맑음 (평온/기쁨)", value: "L3_SUNNY", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Emotion is sunny. Coach: "Great. Radiate this sunlight to someone else today."` }
                        ], system_prompt_injection: `[Emotion Protocol] Validate weather metaphor.`
                    };
                    case 'assess_stress_level': return {
                        ...base,
                        message: `🔋 **[108 자각] 스트레스 에너지 측정**\n\n스트레스는 '나쁜 것'이 아니라, 당신이 중요하게 생각하는 것이 위협받고 있다는 **'신호'**입니다.\n\n지금 당신의 신경계는 어느 정도의 경보를 울리고 있습니까?`,
                        options: [
                            { label: "🚨 적색 경보 (타버림/Burnout)", value: "L1_BURNOUT", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] High stress. Coach: "Stop everything. Your system needs immediate reboot. Breathe."` },
                            { label: "⚠️ 황색 경보 (긴장됨/Tension)", value: "L2_TENSION", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Moderate stress. Coach: "Tension creates focus, but too much breaks the string. Where do you feel it?"` },
                            { label: "🟢 녹색 상태 (적당한 자극)", value: "L3_OPTIMAL", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Eustress. Coach: "Use this energy to crush your goal today."` }
                        ], system_prompt_injection: `[Stress Protocol] Reframe stress as signal.`
                    };
                    case 'assess_gap_analysis': return {
                        ...base,
                        message: `🪞 **[108 자각] 이상과 현실의 갭(Gap)**\n\n우리는 종종 '내가 되어야 하는 나'와 '지금의 나' 사이에서 고통받습니다.\n\n지금 거울 속에 비친 당신은 누구입니까?`,
                        options: [
                            { label: "🌫️ 내가 누군지 모르겠다 (혼란)", value: "L1_LOST", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Identity confusion. Coach: "The gap is painful. But the gap is where growth happens."` },
                            { label: "🎭 남들이 원하는 나 (연기)", value: "L2_MASK", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Living a persona. Coach: "The mask is heavy. Who is behind the mask?"` },
                            { label: "✨ 있는 그대로의 나 (수용)", value: "L3_REAL", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Self-acceptance. Coach: "Power comes from alignment. What is your truth today?"` }
                        ], system_prompt_injection: `[Gap Protocol] Focus on authenticity.`
                    };
                    case 'assess_dark_code': return {
                        ...base,
                        message: `🌑 **[108 자각] 다크 코드(Dark Code) 감지**\n\n당신을 반복적으로 넘어지게 하는 **'인생의 덫'**이 있나요? (예: 완벽주의, 의심, 회피)\n\n지금 가장 활성화된 그림자는 무엇입니까?`,
                        options: [
                            { label: "😫 또 같은 실수를 했다 (자책)", value: "L1_REPEAT", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Pattern repetition. Coach: "Awareness is the first step. You are not the pattern."` },
                            { label: "👀 패턴이 보이기 시작한다 (관찰)", value: "L2_SEEING", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Observing pattern. Coach: "Good eye. When does this pattern usually show up?"` },
                            { label: "🛠️ 도구로 쓸 수 있다 (연금술)", value: "L3_ALCHEMY", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Transmuting shadow. Coach: "Your shadow is your fuel. How will you use it?"` }
                        ], system_prompt_injection: `[Dark Code Protocol] Shadow work.`
                    };
                    case 'assess_neural_code': return {
                        ...base,
                        message: `🧬 **[108 자각] 뉴럴 코드(Talent) 발현**\n\n반대로, 당신이 힘들이지 않고도 자연스럽게 잘하는 **'천재성'**은 무엇인가요?\n\n지금 당신의 재능 에너지는 어떻게 흐르고 있습니까?`,
                        options: [
                            { label: "🔒 꽉 막혀 있다 (재능 미사용)", value: "L1_BLOCKED", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Talent blocked. Coach: "A flowing river never stales. Unblock your flow."` },
                            { label: "🗝️ 가끔 반짝인다 (간헐적)", value: "L2_SPARK", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Intermittent flow. Coach: "Fan the spark. What triggers your flow state?"` },
                            { label: "🌊 콸콸 쏟아진다 (몰입)", value: "L3_FLOW", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Full flow. Coach: "Ride the wave. Create something uselessly beautiful today."` }
                        ], system_prompt_injection: `[Neural Protocol] Encouraging flow.`
                    };
                    case 'assess_identification': return {
                        ...base,
                        message: `🎭 **[108 자각] 동일시(Identification) 분석**\n\n"나는 ~~한 사람이야"라고 믿는 순간, 당신의 가능성은 그 틀 안에 갇히게 됩니다.\n\n지금 당신을 가장 꽉 묶고 있는 '꼬리표'는 무엇입니까?`,
                        options: [
                            { label: "🏷️ 역할에 갇힘 (엄마/아빠/팀장 등)", value: "L1_ROLE", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Identified with Role. Coach: "You are playing a role, but you are NOT the role. Who is the actor?"` },
                            { label: "🤕 상처에 갇힘 (피해자/환자)", value: "L2_WOUND", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Identified with Wound. Coach: "The wound is part of your history, not your identity. Detach from the pain."` },
                            { label: "🌌 나는 그저 존재한다 (관찰자)", value: "L3_BEING", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Pure Being. Coach: "Perfect. Remain as the Witness. What do you see?"` }
                        ], system_prompt_injection: `[Identification Protocol] Break labels.`
                    };
                    case 'assess_unconscious_habit': return {
                        ...base,
                        message: `🕸️ **[108 자각] 무의식적 습관 포착**\n\n스트레스를 받을 때 나도 모르게 튀어나오는 '자동 반응'이 있나요?\n이것은 당신의 무의식이 보내는 구조 신호입니다.`,
                        options: [
                            { label: "📱 폰만 본다 (현실 도피)", value: "L1_ESCAPE", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Habit: Escapism. Coach: "Dopamine is a painkiller. What pain are you numbing?"` },
                            { label: "🍬 폭식/음주 (감정 마취)", value: "L2_NUMB", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Habit: Numbing. Coach: "Hunger for food is often hunger for love or peace. Distinguish the hunger."` },
                            { label: "🧘 호흡으로 돌아온다 (그라운딩)", value: "L3_BREATH", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Habit: Grounding. Coach: "Excellent using the breath. Deepen it now."` }
                        ], system_prompt_injection: `[Habit Protocol] Recognize triggers.`
                    };
                    case 'assess_self_criticism': return {
                        ...base,
                        message: `⚖️ **[108 자각] 내면의 재판관 (Inner Critic)**\n\n당신의 머릿속에는 하루 종일 당신을 평가하는 목소리가 살고 있습니다.\n오늘 그 재판관은 당신에게 어떤 판결을 내렸습니까?`,
                        options: [
                            { label: "🔨 \"넌 부족해\" (유죄 판결)", value: "L1_GUILTY", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Critic says Guilty. Coach: "That judge is biased. OBJECT to the verdict. Ask for evidence."` },
                            { label: "🤔 \"더 잘할 수 없었나?\" (심리)", value: "L2_DOUBT", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Critic is Doubting. Coach: "Perfection is a myth. 'Good Enough' is the new perfect."` },
                            { label: "🤝 \"충분히 애썼어\" (무죄/격려)", value: "L3_INNOCENT", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Critic is Ally. Coach: "Turn the Judge into a Coach. What is the constructive feedback?"` }
                        ], system_prompt_injection: `[Critic Protocol] Taming the inner judge.`
                    };
                    case 'assess_social_persona': return {
                        ...base,
                        message: `🎭 **[108 자각] 사회적 가면 (Persona)**\n\n남들에게 보여주기 위해 쓰고 있는 '가면'이 있나요?\n가면은 보호 장비지만, 너무 오래 쓰면 얼굴이 썩습니다.`,
                        options: [
                            { label: "🤡 '착한 사람' 연기 중", value: "L1_NICE", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Nice Guy Persona. Coach: "Being nice often means suppressing anger. Where is your anger hiding?"` },
                            { label: "😎 '강한 척' 연기 중", value: "L2_STRONG", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Strong Persona. Coach: "Vulnerability is the only true strength. Drop the shield for a minute."` },
                            { label: "🌿 있는 그대로 표현 중", value: "L3_AUTHENTIC", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Authenticity. Coach: "Stay naked. It connects deeply."` }
                        ], system_prompt_injection: `[Persona Protocol] Authenticity check.`
                    };
                    case 'assess_energy_drain': return {
                        ...base,
                        message: `🕳️ **[108 자각] 에너지 누수(Drain) 탐지**\n\n밑 빠진 독에 물을 붓고 있진 않나요?\n지금 당신의 생명력을 가장 많이 빨아들이는 구멍은 어디입니까?`,
                        options: [
                            { label: "🗣️ 불필요한 인간관계", value: "L1_PEOPLE", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Drain: Relationships. Coach: "Energy vampires exist. Learn to say a polite but firm NO."` },
                            { label: "🤯 끊임없는 걱정/잡념", value: "L2_WORRY", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Drain: Worry loop. Coach: "Worrying is praying for what you don't want. Change the channel."` },
                            { label: "📱 무의미한 정보 과부하", value: "L3_INFO", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Drain: Info overload. Coach: "Digital Detox mission prescribed. 30 mins unplugged."` }
                        ], system_prompt_injection: `[Energy Protocol] Plug the leaks.`
                    };
                    case 'assess_energy_source': return {
                        ...base,
                        message: `🔋 **[108 자각] 활력의 원천 (Source)**\n\n반대로, 무엇을 할 때 당신의 영혼이 살아숨쉬는 것을 느끼나요?\n그것이 당신의 '충전기'입니다.`,
                        options: [
                            { label: "🌿 자연 속에 있을 때", value: "L1_NATURE", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Source: Nature. Coach: "Nature resets the nervous system. Can you see the sky right now?"` },
                            { label: "🎨 창조적인 일을 할 때", value: "L2_CREATE", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Source: Creation. Coach: "You were born to create. Make something small today."` },
                            { label: "🤫 고요히 혼자 있을 때", value: "L3_SOLITUDE", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Source: Solitude. Coach: "Solitude is the school of genius. Protect your alone time."` }
                        ], system_prompt_injection: `[Source Protocol] Recharging strategy.`
                    };
                    case 'assess_not_myself': return {
                        ...base,
                        message: `🚩 **[108 자각] 비자아(Not-Self) 신호**\n\n"이건 내가 아니야"라고 느껴지는 순간이 있었나요?\n그 불편함은 당신이 올바른 궤도를 벗어났음을 알리는 경보입니다.`,
                        options: [
                            { label: "😣 하기 싫은 부탁을 들어줄 때", value: "L1_YESMAN", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Not-Self: People Pleasing. Coach: "Every false Yes is a No to yourself. Practice a small No."` },
                            { label: "😡 남과 나를 비교할 때", value: "L2_COMPARE", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Not-Self: Comparison. Coach: "Comparison is the thief of joy. Stay in your lane."` },
                            { label: "🏃‍♂️ 내 속도를 잃고 서두를 때", value: "L3_RUSH", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Not-Self: Rushing. Coach: "Slow down. Alignment happens in the pauses."` }
                        ], system_prompt_injection: `[Not-Self Protocol] Recognition of misalignment.`
                    };
                    case 'assess_perspective_quiz': return {
                        ...base,
                        message: `👓 **[108 자각] 관점(Perspective) 테스터**\n\n같은 사건도 어떤 렌즈로 보느냐에 따라 지옥이 되기도, 교훈이 되기도 합니다.\n지금 당신은 어떤 안경을 쓰고 세상을 보고 있나요?`,
                        options: [
                            { label: "🌚 \"세상은 위험해\" (두려움)", value: "L1_FEAR", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Lens: Fear. Coach: "Fear is False Evidence Appearing Real. What is the evidence?"` },
                            { label: "⚖️ \"세상은 공평해야 해\" (통제)", value: "L2_CONTROL", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Lens: Control. Coach: "Life is unfair but generous. Release the need to control."` },
                            { label: "🎁 \"모든 건 배움이다\" (수용)", value: "L3_LEARN", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Lens: Learning. Coach: "Everything is material for your growth. Even this."` }
                        ], system_prompt_injection: `[Perspective Protocol] Reframing.`
                    };
                    case 'assess_change_resistance': return {
                        ...base,
                        message: `🧱 **[108 자각] 변화 저항(Resistance) 측정**\n\n새로운 흐름이 들어오려 할 때, 우리의 에고는 본능적으로 문을 걸어 잠급니다.\n지금 당신 앞의 '변화'에 대해 솔직한 심정은?`,
                        options: [
                            { label: "🥶 무섭고 귀찮다 (거부)", value: "L1_REJECT", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Resistance: Reject. Coach: "Comfort zone is a dead zone. What are you protecting?"` },
                            { label: "😰 해야 하는데... (망설임)", value: "L2_HESITATE", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Resistance: Hesitate. Coach: "The water feels cold only before you jump. Jump."` },
                            { label: "🌊 파도를 타보자 (수용)", value: "L3_SURF", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Resistance: Surf. Coach: "Change is the only constant. Surf the chaos."` }
                        ], system_prompt_injection: `[Change Protocol] Embracing flow.`
                    };
                    case 'assess_inner_thirst': return {
                        ...base,
                        message: `🌵 **[108 자각] 영혼의 갈증 (Thirst)**\n\n몸이 목마른 게 아니라, 영혼이 목마른 순간이 있습니다.\n지금 당신의 내면 깊은 곳에서 가장 간절히 원하는 것은?`,
                        options: [
                            { label: "🛌 푹 쉬고 싶다 (휴식)", value: "L1_REST", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Thirst: Rest. Coach: "Rest is a responsibility. Schedule non-negotiable rest."` },
                            { label: "👂 내 말을 들어줘 (인정/공감)", value: "L2_HEARD", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Thirst: Validation. Coach: "I hear you. You exist. You matter."` },
                            { label: "🚀 의미 있는 일을 하고 싶다 (성장)", value: "L3_GROWTH", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Thirst: Purpose. Coach: "Meaning is made, not found. Make meaning today."` }
                        ], system_prompt_injection: `[Thirst Protocol] Identifying needs.`
                    };
                    case 'assess_wealth_current': return {
                        ...base,
                        message: `💰 **[108 자각] 재물(Wealth) 에너지 검진**\n\n돈은 에너지입니다. 현재 돈을 대하는 당신의 주파수는 어떻습니까?\n돈을 생각할 때 가장 먼저 드는 감정은?`,
                        options: [
                            { label: "😱 없어서 불안하다 (결핍/공포)", value: "L1_LACK", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Wealth: Lack mindset. Coach: "Scarcity attracts scarcity. Shift focus to what you HAVE."` },
                            { label: "😤 더 벌어야 하는데 (욕망/압박)", value: "L2_GREED", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Wealth: Pressure. Coach: "Chasing money pushes it away. Attract it with value."` },
                            { label: "🙏 있는 것에 감사 (풍요/순환)", value: "L3_ABUNDANCE", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Wealth: Flow. Coach: "Gratitude unlocks abundance. What is wealth to you beyond money?"` }
                        ], system_prompt_injection: `[Wealth Protocol] Abundance mindset.`
                    };
                    case 'assess_relationship_current': return {
                        ...base,
                        message: `💞 **[108 자각] 관계(Relationship) 에너지 검진**\n\n인간관계는 나의 '거울'입니다.\n요즘 주변 사람들을 보며 드는 생각은?`,
                        options: [
                            { label: "👿 다들 왜 저럴까 (비난/짜증)", value: "L1_BLAME", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Relation: Blame. Coach: "The world is a mirror. What part of you is irritated?"` },
                            { label: "😢 나만 참으면 돼 (희생/억울)", value: "L2_VICTIM", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Relation: Martyr. Coach: "Self-sacrifice is not love. It's self-betrayal. Set a boundary."` },
                            { label: "🤝 서로 다르구나 (존중/거리)", value: "L3_RESPECT", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Relation: Harmony. Coach: "Differences make the harmony. Dance with the difference."` }
                        ], system_prompt_injection: `[Relationship Protocol] Mirror neuron.`
                    };
                    case 'assess_health_current': return {
                        ...base,
                        message: `🩺 **[108 자각] 신체(Health) 에너지 검진**\n\n몸은 무의식의 지도입니다.\n지금 당신의 몸이 보내는 메시지는 무엇입니까?`,
                        options: [
                            { label: "🤒 여기저기 쑤시고 아프다 (경고)", value: "L1_PAIN", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Health: Pain. Coach: "Pain is a messenger. Listen to it. What is it saying 'No' to?"` },
                            { label: "😪 무겁고 처진다 (방전)", value: "L2_TIRED", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Health: Fatigue. Coach: "Fatigue is forced rest. Allow the recharge."` },
                            { label: "💪 가볍고 생생하다 (활력)", value: "L3_VITAL", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Health: Vitality. Coach: "Vitality is precious. Invest it wisely today."` }
                        ], system_prompt_injection: `[Health Protocol] Somatic awareness.`
                    };
                    default: return null;
                }
            };
            return getAssessmentContent(intent);
        }

        // [PHASE 3] New Myeongsim Features (ms_ prefix)
        if (intent.startsWith('ms_')) {
            const topicMap: Record<string, string> = {
                // Identity & Body
                'ms_pical_image': 'Saju Graphical Imagery (Mul-sang)',
                'ms_voice_scan': 'Health Analysis via Voice Frequency',
                'ms_dna_check': 'Saju vs DNA Cross-Validation',
                'ms_style_guide': 'Physiognomy & Fashion Styling',
                // Strategy
                'ms_12sinsal_strategy': '12 Sinsal Strategic Positioning',
                'ms_hidden_weapon': 'Hidden Stems (Heoja) & Grave (Ipmyo) Strategy',
                'ms_naming_ai': 'Name Analysis & Recommendation (Seongmyeonghak)',
                'ms_iching_oracle': 'I-Ching (Book of Changes) Divination',
                'ms_lucky_direction': 'Qi Men Dun Jia (Directional Strategy)',
                // Life
                'ms_team_chemistry': 'Organizational Dynamics & Team Harmony',
                'ms_digital_twin_talk': 'Dialogue with AI Digital Twin Persona',
                'ms_parenting_coach': 'Gifted Child Parenting & Aptitude',
                'ms_pet_saju': 'Pet Psychology & Compatibility',
                'ms_digital_ritual': 'Digital Ancestral Rite & Dialogue',
                'ms_dream_analysis': 'Dream Interpretation via Five Elements',
                'ms_smart_fengshui': 'IoT Smart Feng Shui',
                'ms_interior_lucky': 'Interior Design for Luck',
                // World
                'ms_stock_saju': 'Stock Market & National Fortune Flow',
                'ms_global_map': 'Global Relocation & Travel Luck',
                'ms_butterfly_effect': 'Social Impact Simulation (Butterfly Effect)',
                'ms_collective_forecast': 'Collective Unconscious Trend Forecast',
                'ms_fate_art': 'Generative Art based on Destiny',
                'ms_fate_nft': 'Destiny NFT Creation',
                // X-Lab
                'ms_astronomy_saju': 'Actual Astronomical Chart Analysis',
                'ms_mars_cal': 'Mars Calendar Fortune',
                'ms_multiverse_sim': 'Multiverse Choice Simulation',
                'ms_akashic_record': 'Akashic Record Access',
                'ms_king_maker': 'Birth Selection (Cesarean) for Destiny',
                'ms_lifespan_clock': 'Vitality & Lifespan Estimation',
                'ms_past_life': 'Past Life Regression & Karma',
                'ms_neural_bci': 'BCI Neural Entrainment',
                'ms_reality_hack': 'Quantum Reality Hacking',
                'ms_universe_maker': 'Personal Universe Creation',
                'ms_nirvana_logout': 'System Logout (Nirvana)'
            };

            const topic = topicMap[intent] || 'Deep Analysis';

            return {
                type: 'COACHING_PROMPT',
                message: `### ${topic}\n\n이 운명의 차원을 탐험하시겠습니까?`,
                options: [
                    {
                        label: "🔮 분석 시작하기",
                        value: "analyze_start",
                        trigger_mode: "immediate",
                        next_prompt_guide: `The user wants to explore '${topic}'. Act as an expert in this specific esoteric field. Use their Saju data to provide unique insights.`
                    },
                    {
                        label: "📚 이건 무엇인가요?",
                        value: "explain_concept",
                        trigger_mode: "immediate",
                        next_prompt_guide: `Explain the concept of '${topic}' and why it matters in Saju.`
                    }
                ],
                system_prompt_injection: `You are the Myeongsim AI, an expert in '${topic}'. The user selected this specific analysis module. Provide high-level, mystical yet logical insights based on their Day Master and Saju structure. Maintain the 'Diagnosis-Acceptance-Transformation' flow.`
            };
        }

        return null;
    }

    // --- Helper Methods ---

    public static getDeepContext(sajuData: any): string {
        return ""; // Placeholder as per previous implementation logic
    }

    private static getNaturalDesire(stem: string): string {
        const map: Record<string, string> = {
            '갑': 'Growth', '을': 'Survival', '병': 'Passion', '정': 'Devotion',
            '무': 'Trust', '기': 'Nurturing', '경': 'Revolution', '신': 'Perfection',
            '임': 'Wisdom', '계': 'Connection'
        };
        return map[stem] || 'Potential';
    }

    private static calculateTenGod(dmEl: string, targetEl: string): string {
        // Simple mock for TenGod calculation if specialized util is missing, 
        // relying on previous logic or simplified check.
        // For robustness, let's restore the basic comparison logic.
        if (dmEl === targetEl) return 'bi'; // Bigeop
        return 'gwan'; // Default fallback if not fully implemented in snippet
    }

    // [Updated Helper] Now returns options WITH trigger_mode
    private static getRootsOptionsByElement(dayMasterChar: string): CoachingResponse['options'] {
        const woods = ['갑', '을'];
        const fires = ['병', '정'];
        const earths = ['무', '기'];
        const metals = ['경', '신'];
        const waters = ['임', '계'];

        const commonGuide = {
            burden: "사용자는 과거를 '짐'으로 느낍니다. 방어기제(가면)에 대해 질문하세요.",
            chaos: "사용자는 과거를 '혼란'으로 느낍니다. 생존 전략에 대해 질문하세요.",
            root: "사용자는 과거를 '자원'으로 느낍니다. 현재 꿈과의 연결성을 질문하세요."
        };

        // Base Template
        const createOptions = (burdenText: string, chaosText: string, rootText: string) => [
            {
                label: `1. ${burdenText}`,
                value: "LEVEL_1_BURDEN",
                trigger_mode: "CONSCIOUSNESS_LEVEL_1",
                next_prompt_guide: commonGuide.burden
            },
            {
                label: `2. ${chaosText}`,
                value: "LEVEL_2_CHAOS",
                trigger_mode: "CONSCIOUSNESS_LEVEL_2",
                next_prompt_guide: commonGuide.chaos
            },
            {
                label: `3. ${rootText}`,
                value: "LEVEL_3_ROOT",
                trigger_mode: "CONSCIOUSNESS_LEVEL_3",
                next_prompt_guide: commonGuide.root
            }
        ];

        if (woods.includes(dayMasterChar)) { // 목: 성장 욕구
            return createOptions("🥀 가지치기 당한 듯 답답했다 (억압)", "🌪️ 비바람이 너무 거셌다 (혼란)", "🌳 깊이 뿌리 내리고 버텼다 (인내)");
        } else if (fires.includes(dayMasterChar)) { // 화: 발산 욕구
            return createOptions("🕯️ 꺼진 불처럼 무기력했다 (소외)", "🔥 걷잡을 수 없는 산불 같았다 (충돌)", "☀️ 나만의 온기를 지켰다 (열정)");
        } else if (earths.includes(dayMasterChar)) { // 토: 수용/안정 욕구
            return createOptions("🏜️ 척박한 땅처럼 메말랐다 (결핍)", "🌋 갑자기 무너지는 지진 같았다 (불안)", "⛰️ 단단한 기반이 되어주었다 (포용)");
        } else if (metals.includes(dayMasterChar)) { // 금: 원칙/결단 욕구
            return createOptions("⛓️ 강요된 틀에 갇혀 있었다 (강박)", "🗡️ 부러진 칼처럼 상처받았다 (좌절)", "💎 스스로를 단단하게 제련했다 (성장)");
        } else if (waters.includes(dayMasterChar)) { // 수: 유연/지혜 욕구
            return createOptions("💧 고인 물처럼 썩어갔다 (침체)", "🌊 휩쓸려 떠내려가는 홍수 같았다 (상실)", "🏞️ 유유히 흐르는 강이 되었다 (지혜)");
        }

        // Fallback
        return createOptions("🪨 무거운 짐 (족쇄)", "🌪️ 혼란스러운 폭풍 (상처)", "🌳 단단한 지지대 (자원)");
    }
}
