import { getQuantumModeContext, QUANTUM_MODES } from '../data/QuantumHackingDB';
import { getRelationshipContext, RELATIONSHIP_MODES } from '../data/RelationshipContentDB';
import { calculateWunsung, calculateGongmang, JIJANGGAN_MAP, WUNSUNG_STAGES } from '../utils/sajuLogic';

/**
 * SelfCoachingModule.ts - ?ê°ê³??ìœ ?˜ì? ë°œí˜„???„í•œ ?ê¸°ì½”ì¹­ ?”ì§„
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
     * ?˜ë„(Intent)?€ ?¬ì£¼ ?°ì´?°ë? ë°›ì•„ '? ì œ??ì§ˆë¬¸'???ì„±?©ë‹ˆ??
     */
    public static getCoachingResponse(intent: string, sajuData: any, dayMasterOverride?: string): CoachingResponse | null {

        const dayMaster = dayMasterOverride || sajuData?.dayMaster || '?¹ì‹ ';
        // KO Char Extraction (Safety)
        const dayMasterChar = dayMaster.replace(/[^\uAC00-\uD7A3]/g, '') || 'ê°?;

        // [PHASE 3-i] 108 Awakening Quantum Modes (Top Priority)
        if (intent.startsWith('ms_soul_') || intent.startsWith('ms_void_') || intent.startsWith('ms_gap_') || intent.startsWith('ms_brain_') || intent.startsWith('ms_sky_') || intent.startsWith('ms_master_') || intent.startsWith('ms_shadow_')) {
            const context = getAwakeningContext(intent, sajuData);
            const allPhases = { ...AWAKENING_PHASE_1, ...AWAKENING_PHASE_2, ...AWAKENING_PHASE_3, ...AWAKENING_PHASE_4, ...AWAKENING_PHASE_5 };
            const modeInfo = allPhases[intent];

            if (modeInfo) {
                return {
                    type: 'COACHING_PROMPT',
                    message: `### ${modeInfo.title}\n\n**"${modeInfo.subtitle}"**\n\n${modeInfo.core_concept}\n\n???„ë¡œ? ì½œ???œì‘?˜ì‹œê² ìŠµ?ˆê¹Œ?`,
                    options: [
                        { label: "?? ?„ë¡œ? ì½œ ?œì‘", value: "start_protocol", trigger_mode: "immediate", next_prompt_guide: `User initiates ${modeInfo.title}. Apply: ${modeInfo.saju_analysis_guide}` },
                        { label: "?¹ï¸ ë§¤ë‰´??ë³´ê¸°", value: "explain_protocol", trigger_mode: "immediate", next_prompt_guide: `Explain the concept of ${modeInfo.title} in the Awakening journey.` }
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
                    message: `### ${modeInfo.title}\n\n**"${modeInfo.subtitle}"**\n\n${modeInfo.core_concept}\n\n?¹ì‹ ??ë§¤íŠ¸ë¦?Š¤ë¥??´ë…?˜ì‹œê² ìŠµ?ˆê¹Œ?`,
                    options: [
                        { label: "?§¬ ?¤ê³„???´ë…", value: "analyze_soul", trigger_mode: "immediate", next_prompt_guide: `User initiates ${modeInfo.title}. Apply: ${modeInfo.saju_analysis_guide}` },
                        { label: "?¹ï¸ ê°œë… ?¤ëª…", value: "explain_soul", trigger_mode: "immediate", next_prompt_guide: `Explain the Saju concept of ${modeInfo.title}.` }
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
                    message: `### ${modeInfo.title}\n\n**"${modeInfo.subtitle}"**\n\n${modeInfo.core_concept}\n\në¯¸ë˜ ?ˆì¸¡???•ì¸?˜ì‹œê² ìŠµ?ˆê¹Œ?`,
                    options: [
                        { label: "?“¡ ?˜í‰???¤ìº”", value: "analyze_forecast", trigger_mode: "immediate", next_prompt_guide: `User initiates ${modeInfo.title}. Apply: ${modeInfo.saju_analysis_guide}` },
                        { label: "?ŒŠ ?„ëµ ë¸Œë¦¬??, value: "explain_forecast", trigger_mode: "immediate", next_prompt_guide: `Explain Saju forecasting strategy for ${modeInfo.title}.` }
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
                    message: `### ${modeInfo.title}\n\n**"${modeInfo.subtitle}"**\n\n${modeInfo.core_concept}\n\n?¤ëŠ˜??ë¯¸ì…˜???œì‘??ì¤€ë¹„ê? ?˜ì…¨?˜ìš”?`,
                    options: [
                        { label: "??ë¯¸ì…˜ ?¤í–‰", value: "give_mission", trigger_mode: "immediate", next_prompt_guide: `User initiates ${modeInfo.title}. Apply: ${modeInfo.saju_analysis_guide}` },
                        { label: "?”‹ ?ë„ˆì§€ ë¦¬í¬??, value: "check_energy", trigger_mode: "immediate", next_prompt_guide: `Analyze daily energy for ${modeInfo.title}.` }
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
                    message: `### ${modeInfo.title}\n\n**"${modeInfo.subtitle}"**\n\n${modeInfo.core_concept}\n\nì¹˜ìœ  ?¸ì…˜???œì‘?˜ì‹œê² ìŠµ?ˆê¹Œ?`,
                    options: [
                        { label: "?§ ?Œë¼???œì‘", value: "start_therapy", trigger_mode: "immediate", next_prompt_guide: `User initiates ${modeInfo.title}. Apply: ${modeInfo.saju_analysis_guide}` },
                        { label: "?§  ?ë¦¬ ?¤ëª…", value: "explain_therapy", trigger_mode: "immediate", next_prompt_guide: `Explain Saju healing theory for ${modeInfo.title}.` }
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
                    message: `### ${modeInfo.title}\n\n**"${modeInfo.subtitle}"**\n\n${modeInfo.core_concept}\n\n?¹ì‹ ??ë¶€??ì½”ë“œë¥??¤ìº”?˜ì‹œê² ìŠµ?ˆê¹Œ?`,
                    options: [
                        { label: "?’° ë¨¸ë‹ˆ ?Œë¡œ???¤ìº”", value: "analyze_wealth_flow", trigger_mode: "immediate", next_prompt_guide: `User initiates ${modeInfo.title}. Apply: ${modeInfo.saju_analysis_guide}` },
                        { label: "?“Š ?¬ì ?„ëµ", value: "explain_wealth_strategy", trigger_mode: "immediate", next_prompt_guide: `Explain Saju wealth strategy for ${modeInfo.title}.` }
                    ],
                    system_prompt_injection: context
                };
            }
        }

        // [PHASE 3-f] Quantum Career Modes (Priority High)
        if (intent.startsWith('ms_career_')) {
            const context = getCareerContext(intent, sajuData);
            const modeInfo = CAREER_MODES[intent];

            if (modeInfo) {
                return {
                    type: 'COACHING_PROMPT',
                    message: `### ${modeInfo.title}\n\n**"${modeInfo.subtitle}"**\n\n${modeInfo.core_concept}\n\n?¨ê²¨ì§?? ì¬?¥ì„ ? ê¸ˆ ?´ì œ?˜ì‹œê² ìŠµ?ˆê¹Œ?`,
                    options: [
                        { label: "?? ?ˆë“  ?¤í‚¬ ë°œê²¬", value: "analyze_career_skill", trigger_mode: "immediate", next_prompt_guide: `User initiates ${modeInfo.title}. Apply: ${modeInfo.saju_analysis_guide}` },
                        { label: "?–ï¸ ì§„ë¡œ ?í•©???‰ê?", value: "explain_career_path", trigger_mode: "immediate", next_prompt_guide: `Explain Saju career path for ${modeInfo.title}.` }
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
                    message: `### ${modeInfo.title}\n\n**"${modeInfo.subtitle}"**\n\n${modeInfo.core_concept}\n\n?¹ì‹ ??ë¹„ì¦ˆ?ˆìŠ¤ DNAë¥??´ë…?˜ì‹œê² ìŠµ?ˆê¹Œ?`,
                    options: [
                        {
                            label: "?? ì°½ì—…ê°€ ì½”ë“œ ë¶„ì„",
                            value: "analyze_startup_dna",
                            trigger_mode: "immediate",
                            next_prompt_guide: `User initiates ${modeInfo.title}. Apply: ${modeInfo.saju_analysis_guide}`
                        },
                        {
                            label: "?“š ?„ëµ ë¸Œë¦¬??,
                            value: "explain_startup_theory",
                            trigger_mode: "immediate",
                            next_prompt_guide: `Explain the concept of ${modeInfo.title} in Saju Business Theory.`
                        }
                    ],
                    system_prompt_injection: context
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
                    message: `### ${modeInfo.title}\n\n**"${modeInfo.subtitle}"**\n\n${modeInfo.core_concept}\n\n?¹ì‹ ??ê´€ê³?ì½”ë“œë¥?ë¶„ì„?˜ì‹œê² ìŠµ?ˆê¹Œ?`,
                    options: [
                        {
                            label: "?¤ï¸ ?¬ë‘??DNA ë¶„ì„",
                            value: "analyze_love_code",
                            trigger_mode: "immediate",
                            next_prompt_guide: `User initiates ${modeInfo.title}. Apply: ${modeInfo.saju_analysis_guide}`
                        },
                        {
                            label: "?“š ê´€ê³??´ë¡  ?êµ¬",
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
                    message: `### ${modeInfo.title}\n\n**"${modeInfo.subtitle}"**\n\n${modeInfo.core_concept}\n\n???„ë¡œ? ì½œ???´ë–»ê²??œì‘?˜ì‹œê² ìŠµ?ˆê¹Œ?`,
                    options: [
                        {
                            label: "?? ?„ë¡œ? ì½œ ?¤í–‰",
                            value: "execute_hack",
                            trigger_mode: "immediate",
                            next_prompt_guide: `User initiates ${modeInfo.title}. Apply the following analysis guide: ${modeInfo.saju_analysis_guide}`
                        },
                        {
                            label: "?¹ï¸ ë§¤ë‰´??ë³´ê¸°",
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
            'ê°?: 'ê³§ê²Œ ë»—ì–´?˜ê????±ì¥ ë³¸ëŠ¥', '??: '? ì—°?˜ê²Œ ?ì‘?˜ëŠ” ?ì¡´??,
            'ë³?: '?¸ìƒ??ë°íˆ???´ì •', '??: '?¬ì„¸?˜ê²Œ ?€?¤ë¥´??ì´›ë¶ˆ',
            'ë¬?: 'ëª¨ë“  ê²ƒì„ ?ˆëŠ” ?¬ì§??, 'ê¸?: '?¤ì† ?ˆê²Œ ê¸°ë¥´???„ì‹¤ê°?,
            'ê²?: '?¨í˜¸??ê²°ë‹¨??, '??: '?ˆë¦¬?˜ê³  ?•êµ??ë³´ì„',
            '??: 'ê¹Šê³  ?“ì? ì§€??, 'ê³?: '?¤ë©°?œëŠ” ê°ìˆ˜??
        };
        const myTrait = traits[dayMasterChar] || 'ê³ ìœ ??? ì¬??;

        // 1. [Gap] Essence (Saju Core Summary)
        if (intent === 'saju_core_summary') {
            return {
                type: 'COACHING_PROMPT',
                message: `?” **[?´ëŸ´ ?¸ì‚¬?´íŠ¸] ë³¸ì§ˆê³¼ì˜ ê°?(Gap)**\n\n?Œì›?˜ì˜ ?€ê³ ë‚œ ?”ì§„(?¼ê°„)?€ **'${myTrait}(${dayMaster})'**?…ë‹ˆ?? ?´ëŠ” ë³¸ë˜ ê±°ì¹  ê²??†ì´ ë»—ì–´?˜ê??????ë„ˆì§€?…ë‹ˆ??\n\n?˜ì?ë§?ì§€ê¸????”ì§„???¼ë§ˆ???œìš©?˜ê³  ê³„ì‹ ê°€?? ?¹ì‹œ ?„ì‹¤??ë²½ì— ë¶€?ªí? ?¤ìŠ¤ë¡?**'?œë™??êº¼ë²„ë¦?ê²?**?€ ?„ë‹Œì§€ ì§„ë‹¨???„ìš”?©ë‹ˆ??\n\nì§€ê¸??¹ì‹ ???íƒœ??ê°€??ê°€ê¹Œìš´ ë§ì„ ? íƒ?´ì£¼?¸ìš”.`,
                options: [
                    {
                        label: "?Œ‘ ?ˆë²¨ 1: \"???ë˜ ?´ë˜\" (?¨ë…)",
                        value: "LEVEL_1_GIVEUP",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_1",
                        next_prompt_guide: `[Diagnosis] User is identified with limits. Coach: "That's a learned helplessness. Your Saju engine is intact. Let's restart it."`
                    },
                    {
                        label: "?Œ— ?ˆë²¨ 2: \"ì°¸ê³  ?¬ëŠ” ê±°ì?\" (?µì••)",
                        value: "LEVEL_2_SUPPRESS",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_2",
                        next_prompt_guide: `[Acceptance] User is suppressing their nature. Coach: "Endurance is not a virtue here. It causes engine overheating (stress). Acknowledge the pressure."`
                    },
                    {
                        label: "?Œ• ?ˆë²¨ 3: \"?˜ë‹µê²???ê±°ì•¼\" (?œìš©)",
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
                'ê°?: 'ë»£ë»£??ê³ ì§‘', '??: 'ì£¼ë? ?ˆì¹˜', 'ë³?: 'ê¸‰í•œ ?±ê²©', '??: '?ˆë???ì§‘ì°©',
                'ë¬?: '?ë ¤?°ì§„ ?µë‹µ??, 'ê¸?: '?˜ì‹¬ê³?ë¶ˆì•ˆ', 'ê²?: 'ì°¨ê????…ì„¤', '??: '? ì¹´ë¡œìš´ ë¹„íŒ',
                '??: '?Œí‰???ë‚´', 'ê³?: 'ê°ì • ê¸°ë³µ'
            };
            const myShadow = shadows[dayMasterChar] || '?´ë©´??ê·¸ë¦¼??;

            return {
                type: 'COACHING_PROMPT',
                message: `?‘ï¸?**[108 ?ê°] ê·¸ë¦¼??ëª…ëª…?˜ê¸° (Naming)**\n\nì§€ê¸??Œì›?˜ì„ ê´´ë¡­?ˆëŠ” ê°ì •??**'${myShadow}'**?´ë¼ê³??´ë¦„ ë¶™ì—¬ë³´ê² ?µë‹ˆ??\n?´ê²ƒ?€ ?¹ì‹ ???±ê²©??ê²°í•¨???„ë‹ˆ?? ?„í—˜???Œë¦¬??**'?œìŠ¤??ê²½ë³´?¥ì¹˜'**?…ë‹ˆ??\n\n??ê²½ë³´ê°€ ?¸ë¦´ ?? ?¹ì‹ ?€ ë³´í†µ ?´ë–»ê²?ë°˜ì‘?˜ì‹­?ˆê¹Œ?`,
                options: [
                    {
                        label: "?ŒŠ 1. ê°ì •???©ì“¸ë¦°ë‹¤ (?ë™ë°˜ì‘)",
                        value: "LEVEL_1_REACT",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_1",
                        next_prompt_guide: `[Diagnosis] User is overwhelmed. Coach: "Name it 'The Shadow'. It is just weather passing through your sky. Watch it rain."`
                    },
                    {
                        label: "?›¡ï¸?2. ???œë‹¤ê³??¸ìš´??(?ê¸°ê²€??",
                        value: "LEVEL_2_FIGHT",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_2",
                        next_prompt_guide: `[Acceptance] User is fighting the emotion. Coach: "Fighting creates resistance. Allow the shadow to exist. It has a message."`
                    },
                    {
                        label: "?”­ 3. ? í˜¸ë¥??½ëŠ”??(ê´€ì°°ì)",
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
                message: `?­ **[108 ?ê°] ë¬´ë? ?¬ì •??(Reframing)**\n\n?”ì£¼(Month Pillar)???¹ì‹ ?ê²Œ ì£¼ì–´ì§?**'?¬íšŒ??ë°°ì—­'**?…ë‹ˆ??\n?„êµ°ê°€?ê²Œ???´ê²ƒ??'ë¨¹ê³ ?´ê¸° ?„í•œ ì§??´ì?ë§? ê´€?ì„ ë°”ê¾¸ë©?**'???¬ëŠ¥???¤í—˜?˜ëŠ” ë¬´ë?'**ê°€ ?©ë‹ˆ??\n\n?Œì›?˜ì? ?„ì¬ ì§ì¥?´ë‚˜ ?¬íšŒ?í™œ???´ë–¤ ê´€?ìœ¼ë¡?ë°”ë¼ë³´ê³  ê³„ì‹­?ˆê¹Œ?`,
                options: [
                    {
                        label: "?“ï¸ 1. ?ì¡´???„í•œ ê°ì˜¥ (?¼í•´??",
                        value: "LEVEL_1_PRISON",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_1",
                        next_prompt_guide: `[Diagnosis] User feels trapped. Coach: "Valid feeling. But realize you have the key. Start by changing one small routine today."`
                    },
                    {
                        label: "?”ï¸ 2. ?´ê²¨???˜ëŠ” ?„ì¥ (?¬ì‚¬)",
                        value: "LEVEL_2_BATTLEFIELD",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_2",
                        next_prompt_guide: `[Acceptance] User is fighting the world. Coach: "Relax the shoulders. You don't perform well in survival mode. Turn it into a game."`
                    },
                    {
                        label: "?ª 3. ?¤í—˜?˜ëŠ” ?€?´í„° (ì°½ì¡°??",
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
                message: `?§¬ **[108 ?ê°] ì¹´ë¥´ë§?ë¶„ë¦¬ (Separation)**\n\n?„ì£¼(Year Pillar)???¹ì‹ ??? íƒ?˜ì? ?Šì? **'ì£¼ì–´ì§??˜ê²½(ê°€ë¬?ë¿Œë¦¬)'**?…ë‹ˆ??\në§ì? ?¬ëŒ?¤ì´ ë¶€ëª¨ë‚˜ ?˜ê²½???¬ì–´ì¤€ '? ë…'???ì‹ ???ê°?´ë¼ê³?ì°©ê°?˜ë©° ?´ì•„ê°‘ë‹ˆ??\n\nì§€ê¸??¹ì‹ ??ë¶™ì¡ê³??ˆëŠ” ?ê°("?˜ëŠ” ~?´ì•¼ ?œë‹¤")??**ì§„ì§œ ?¹ì‹ ??ê²ƒì…?ˆê¹Œ, ?„ë‹ˆë©?ë¬¼ë ¤ë°›ì? ê²ƒì…?ˆê¹Œ?**`,
                options: customizedOptions,
                system_prompt_injection: `[Roots Protocol] Year Pillar. Goal: Move from Inheritance to Mutation.`
            };
        }

        // 5. [Desire] Hour Pillar
        if (intent === 'hour_pillar_desire') {
            const hourBranch = sajuData?.fourPillars?.time?.ji?.char || sajuData?.hourPillar?.branch || '??;
            const jijanggan = JIJANGGAN_MAP[hourBranch] || { main: '?' };
            const hiddenDesire = this.getNaturalDesire(jijanggan.main || '?');
            const hourStem = sajuData?.fourPillars?.time?.gan?.char || sajuData?.timePillar?.stem || '';
            const tenGod = this.calculateTenGod(dayMasterChar, hourStem);

            return {
                type: 'COACHING_PROMPT',
                message: `?¨ **[108 ?ê°] ?•ë§???¤í˜„ (Manifestation)**\n\n?œì£¼(Hour Pillar) ê¹Šì? ê³³ì—??**'${hiddenDesire}'**?¼ëŠ” ?œìˆ˜??ë³¸ëŠ¥???¨ì–´ ?ˆìŠµ?ˆë‹¤.\n(??„±: ${tenGod}, ?¼ëª… **'ë§ë…„??ë¹„ë? ë¬´ê¸°'**)\n\n?´ê²ƒ?€ ?¨ë“¤?ê²Œ ë³´ì—¬ì£¼ê¸° ?„í•œ ê²ƒì´ ?„ë‹ˆ?? ?¤ì§ **'?˜ì˜ ê¸°ì¨'**???„í•œ ?ë„ˆì§€?…ë‹ˆ?? ???•ë§???€?˜ëŠ” ?¹ì‹ ???œë„??ë¬´ì—‡?…ë‹ˆê¹?`,
                options: [
                    {
                        label: "?”’ 1. ?¨ê¸°ê³?ì°¸ëŠ”??(?µì••)",
                        value: "LEVEL_1_REPRESS",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_1",
                        next_prompt_guide: `[Diagnosis] User represses desire. Coach: "Repressed desire becomes toxic. It's safe to let a little steam out. What is a small secret pleasure?"`
                    },
                    {
                        label: "?–ï¸ 2. ?ˆì¹˜ ë³´ë©° ê°ˆë“±?œë‹¤ (?€??",
                        value: "LEVEL_2_CONFLICT",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_2",
                        next_prompt_guide: `[Acceptance] User compromises. Coach: "You don't need permission to be happy. The mask is heavy. Drop it for 10 minutes."`
                    },
                    {
                        label: "?? 3. ??ë©‹ë?ë¡??œì¶œ?œë‹¤ (?ìœ )",
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
                { el: 'ëª?Wood)', score: ohaeng.wood || 0, keyword: '?±ì¥ê³??˜ìš•' },
                { el: '??Fire)', score: ohaeng.fire || 0, keyword: '?´ì •ê³??œí˜„' },
                { el: '??Earth)', score: ohaeng.earth || 0, keyword: '?¬ìš©ê³?ì¤‘ì¬' },
                { el: 'ê¸?Metal)', score: ohaeng.metal || 0, keyword: 'ê²°ë‹¨ê³??Œì‹ ' },
                { el: '??Water)', score: ohaeng.water || 0, keyword: 'ì§€?œì? ? ì—°?? }
            ].sort((a, b) => a.score - b.score);

            const weakest = scores[0];
            const dominant = scores[4];

            return {
                type: 'COACHING_PROMPT',
                message: `?–ï¸ **[108 ?ê°] ?¤í–‰???°ê¸ˆ??(ë¹?ê³µê°„??ë¯¸í•™)**\n\n?Œì›?˜ì˜ ?¬ì£¼??**'${dominant.el}'**??ê¸°ìš´??ê°•í•œ ë°˜ë©´, **'${weakest.el}'**??ê¸°ìš´?€ ë¹„ì›Œ???ˆìŠµ?ˆë‹¤.\n\në³´í†µ?€ ?´ë? 'ë¶€ì¡±í•¨'?´ë¼ ë¶€ë¥´ë©° ì±„ìš°??? ì“°ì§€ë§? ëª…ì‹¬ì½”ì¹­?€ ?´ë? ?¹ì‹ ë§Œì˜ **'ê³ ìœ ???¬ë°±'**?¼ë¡œ ?´ì„?©ë‹ˆ??\n\n??ë¹„ì›Œì§?ê³µê°„(${weakest.keyword})???¹ì‹ ?€ ?„ì¬ ?´ë–»ê²?ê²½í—˜?˜ê³  ê³„ì‹­?ˆê¹Œ?`,
                options: [
                    {
                        label: "?Œ‘ ?ˆë²¨ 1: ê²°í•???¬ìƒ??(Victim)",
                        value: `LEVEL_1_LACK_${weakest.el}`,
                        trigger_mode: "CONSCIOUSNESS_LEVEL_1",
                        next_prompt_guide: `User feels victimized by the lack of ${weakest.el}. Validate their pain but point out the 'Victim Mindset'.`
                    },
                    {
                        label: "?Œ— ?ˆë²¨ 2: ê°€ë©????¬ì‚¬ (Fighter)",
                        value: `LEVEL_2_FAKE_${weakest.el}`,
                        trigger_mode: "CONSCIOUSNESS_LEVEL_2",
                        next_prompt_guide: `User is pretending to have ${weakest.el} to fit in. Highlight the exhaustion of this mask and suggest dropping it.`
                    },
                    {
                        label: "?Œ• ?ˆë²¨ 3: ?¬ë°±??ì°½ì¡°??(Creator)",
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
            const dayBranch = sajuData?.fourPillars?.day?.ji?.char || sajuData?.dayPillar?.branch || '??;
            const voidBranches = calculateGongmang(dayGan, dayBranch);

            // Safe Access & Fallbacks
            const yearBranch = sajuData?.fourPillars?.year?.ji?.char || sajuData?.yearPillar?.branch || '';
            const monthBranch = sajuData?.fourPillars?.month?.ji?.char || sajuData?.monthPillar?.branch || '';
            const hourBranch = sajuData?.fourPillars?.time?.ji?.char || sajuData?.hourPillar?.branch || '';

            // Target determination logic
            let targetPillar = "";
            let mission = "";

            if (monthBranch && voidBranches.includes(monthBranch)) {
                targetPillar = "?”ì£¼(Month Pillar)";
                mission = "?­ **ë¯¸ì…˜: ?ˆì „??ë°˜í•­** (?ì‹¬ ë©”ë‰´ ?€ê²??œí‚¤ê¸????Œì‹¬???¼íƒˆ)";
            } else if (yearBranch && voidBranches.includes(yearBranch)) {
                targetPillar = "?„ì£¼(Year Pillar)";
                mission = "?§¬ **ë¯¸ì…˜: ì¹´ë¥´ë§??Šê¸°** (ê°€ì¡±ì˜ ?¡ì? ê´€???˜ë‚˜ ê±°ë??˜ê¸°)";
            } else if (hourBranch && voidBranches.includes(hourBranch)) {
                targetPillar = "?œì£¼(Hour Pillar)";
                mission = "?¨ **ë¯¸ì…˜: ë¬´ìš©(?¡ç”¨)??ì°½ì¡°** (ê²°ê³¼ë¬??†ëŠ” ?™ì„œ, ë©ë•Œë¦¬ê¸°)";
            } else if (voidBranches.includes(dayBranch)) {
                targetPillar = "?¼ì£¼(Day Pillar)";
                mission = "? **ë¯¸ì…˜: ?„ì „??ê³ ë…** (30ë¶„ê°„ ?„ë²½???¨ì ˆ)";
            } else {
                targetPillar = "?†ìŒ";
                mission = "?§± **ë¯¸ì…˜: ?„ì‹¤??ë§ˆìŠ¤??* (?‘ì? ì²?†Œ/?•ë¦¬ ?¬ì„±)";
            }

            let message = targetPillar === "?†ìŒ"
                ? `?”­ **[108 ?ê°] ê³µë§ ?†ìŒ: ê½?ì°?ì±…ì„ê°?*\n\nê³µë§???†ë‹¤??ê²ƒì? ?„ì‹¤???¨ë‹¨??ë¿Œë¦¬?´ë ¸?Œì„ ?˜ë??©ë‹ˆ?? ?˜ì?ë§?ì±…ì„ê°ì´ ?ˆë¬´ ë¬´ê±°??**'?¼íƒˆ???ìœ '**ë¥??µëˆ„ë¥´ê³  ?ˆì????Šë‚˜??`
                : `?ŒŒ **[108 ?ê°] ?„ì‹¤ ?´í‚¹ (Reality Hacking)**\n\n?¬ì£¼??**[${targetPillar}]** ?ì—­??**'ê³µë§(Void)'** ì½”ë“œê°€ ì¼œì ¸ ?ˆìŠµ?ˆë‹¤.\n?´ê³³?€ ?¸ìƒ??ê·œì¹™???µí•˜ì§€ ?ŠëŠ” ?´ë°©êµ¬ì…?ˆë‹¤. ?´ë? **'ê²°í•'**?¼ë¡œ ?ë¼??‹ˆê¹? ?„ë‹ˆë©?**'?ìœ ??ë¬?**?¼ë¡œ ?°ì‹œê² ìŠµ?ˆê¹Œ?`;

            return {
                type: 'COACHING_PROMPT',
                message: message,
                options: [
                    {
                        label: "?Œ‘ ?ˆë²¨ 1: \"???˜ë§Œ ?´ëŸ´ê¹?\" (?˜ìš©)",
                        value: "LEVEL_1_HUNGER_VOID",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_1",
                        next_prompt_guide: `[Diagnosis] User feels Void as Lack. Coach: "Name this feeling 'The Void'. It's a system signal, not a flaw."`
                    },
                    {
                        label: "???ˆë²¨ 2: \"?¨ë“¤ê³??¤ë¥´ê²??´ë˜\" (?„í™˜)",
                        value: "LEVEL_2_INVENTOR_VOID",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_2",
                        next_prompt_guide: `[Transformation] User hacks the system. Coach: "Great shift. How does it feel to break the rules safely?"`
                    },
                    {
                        label: "???ˆë²¨ 3: \"??ê³µí—ˆ?¨ì´ ?˜ì˜ ë¬´ê¸°??" (ì´ˆì›”)",
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
                'deep_ten_gods_psychology': '??„±(?æ˜Ÿ) ?¬ë¦¬ êµ¬ì¡°',
                'deep_12_wunsung_cycle': '12?´ì„± ?ë„ˆì§€ ê·¸ë˜??,
                'deep_daewoon_mission': '?€??Great Cycle)??ë¯¸ì…˜',
                'deep_yongsin_guardian': '?©ì‹ (Guardian) ?œìš©ë²?,
                'deep_gyeokguk_weapon': 'ê²©êµ­(Structure) ?¬íšŒ??ë¬´ê¸°',
                'deep_spouse_palace': '?¼ì?(Spouse) ?ë§ˆ??,
                'deep_special_stars': '? ì‚´(Special Stars) ë§¤ë ¥',
                'deep_noble_connection': 'ì²œì„ê·€??Noble) ?¸ì—°',
                'deep_health_weakness': '?€ê³ ë‚œ ê±´ê°• ì·¨ì•½??,
                'deep_soul_age': '?í˜¼???±ìˆ™??(Soul Age)'
            };
            const topic = topicMap[intent] || '?¬ì¸µ ?´ëª… ë¶„ì„';

            return {
                type: 'COACHING_PROMPT',
                message: `?“œ **[108 ?ê°] ${topic} ?¬ì¸µ ë¦¬í¬??*\n\n?Œì›?˜ì˜ ?¬ì£¼ ê¹Šì? ê³³ì— ?¨ê²¨ì§?**'${topic}'** ì½”ë“œë¥??´ë…?©ë‹ˆ??\n\n??ì§€?ì? ?¨ìˆœ???•ë³´ê°€ ?„ë‹ˆ?? ?¹ì‹ ??ë¬´ì˜?ì ?¼ë¡œ ?°ë¥´ê³??ˆë˜ **'?´ëª…??ì§€??**ë¥?ë³´ì—¬ì¤ë‹ˆ?? ?´ë–¤ ë§ˆìŒ?¼ë¡œ ??ì§€?œë? ?´ì–´ë³´ì‹œê² ìŠµ?ˆê¹Œ?`,
                options: [
                    {
                        label: "?§  ?ˆë²¨ 1: \"?Œê³  ?¶ë‹¤\" (ì§€???•êµ¬)",
                        value: "LEVEL_1_KNOWLEDGE",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_1",
                        next_prompt_guide: `[Diagnosis] User seeks knowledge about ${topic}. Coach: "Knowledge is power. Let me explain the structure of your ${topic}."`
                    },
                    {
                        label: "?’¡ ?ˆë²¨ 2: \"?´í•´?˜ê³  ?¶ë‹¤\" (?ë¦¬ ?êµ¬)",
                        value: "LEVEL_2_UNDERSTAND",
                        trigger_mode: "CONSCIOUSNESS_LEVEL_2",
                        next_prompt_guide: `[Acceptance] User wants to understand principles. Coach: "Let's dive deeper. How does this ${topic} manifest in your daily connection?"`
                    },
                    {
                        label: "?”® ?ˆë²¨ 3: \"?œìš©?˜ê³  ?¶ë‹¤\" (ì§€???ìš©)",
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
                        message: `?ï¸ **[108 ?ê°] ?¤ëŠ˜??ê°ì • ê¸°ìƒ??*\n\nê°ì •?€ ?¹ì‹ ???í˜¼??ë³´ë‚´??'? ì”¨'?€ ê°™ìŠµ?ˆë‹¤. ì¢‹ê³  ?˜ì¨?€ ?†ìŠµ?ˆë‹¤. ?¨ì? ì§€?˜ê°ˆ ë¿ì…?ˆë‹¤.\n\nì§€ê¸??¹ì‹ ??ë§ˆìŒ ?˜ëŠ˜?€ ?´ë–¤ ?íƒœ?¸ê???`,
                        options: [
                            { label: "?Œªï¸???’??(?•ë„??ë¶ˆì•ˆ)", value: "L1_STORM", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Emotion is storm. Coach: "Let it rain. Do not fight the storm. It will pass."` },
                            { label: "?ï¸ ?ë¦¼ (?µë‹µ???°ìš¸)", value: "L2_CLOUDY", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Emotion is cloudy. Coach: "Clouds block the sun, but the sun is always there. What is the cloud made of?"` },
                            { label: "?€ï¸?ë§‘ìŒ (?‰ì˜¨/ê¸°ì¨)", value: "L3_SUNNY", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Emotion is sunny. Coach: "Great. Radiate this sunlight to someone else today."` }
                        ], system_prompt_injection: `[Emotion Protocol] Validate weather metaphor.`
                    };
                    case 'assess_stress_level': return {
                        ...base,
                        message: `?”‹ **[108 ?ê°] ?¤íŠ¸?ˆìŠ¤ ?ë„ˆì§€ ì¸¡ì •**\n\n?¤íŠ¸?ˆìŠ¤??'?˜ìœ ê²????„ë‹ˆ?? ?¹ì‹ ??ì¤‘ìš”?˜ê²Œ ?ê°?˜ëŠ” ê²ƒì´ ?„í˜‘ë°›ê³  ?ˆë‹¤??**'? í˜¸'**?…ë‹ˆ??\n\nì§€ê¸??¹ì‹ ??? ê²½ê³„ëŠ” ?´ëŠ ?•ë„??ê²½ë³´ë¥??¸ë¦¬ê³??ˆìŠµ?ˆê¹Œ?`,
                        options: [
                            { label: "?š¨ ?ìƒ‰ ê²½ë³´ (?€ë²„ë¦¼/Burnout)", value: "L1_BURNOUT", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] High stress. Coach: "Stop everything. Your system needs immediate reboot. Breathe."` },
                            { label: "? ï¸ ?©ìƒ‰ ê²½ë³´ (ê¸´ì¥??Tension)", value: "L2_TENSION", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Moderate stress. Coach: "Tension creates focus, but too much breaks the string. Where do you feel it?"` },
                            { label: "?Ÿ¢ ?¹ìƒ‰ ?íƒœ (?ë‹¹???ê·¹)", value: "L3_OPTIMAL", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Eustress. Coach: "Use this energy to crush your goal today."` }
                        ], system_prompt_injection: `[Stress Protocol] Reframe stress as signal.`
                    };
                    case 'assess_gap_analysis': return {
                        ...base,
                        message: `?ª **[108 ?ê°] ?´ìƒê³??„ì‹¤??ê°?Gap)**\n\n?°ë¦¬??ì¢…ì¢… '?´ê? ?˜ì–´???˜ëŠ” ???€ 'ì§€ê¸ˆì˜ ?? ?¬ì´?ì„œ ê³ í†µë°›ìŠµ?ˆë‹¤.\n\nì§€ê¸?ê±°ìš¸ ?ì— ë¹„ì¹œ ?¹ì‹ ?€ ?„êµ¬?…ë‹ˆê¹?`,
                        options: [
                            { label: "?Œ«ï¸??´ê? ?„êµ°ì§€ ëª¨ë¥´ê² ë‹¤ (?¼ë?)", value: "L1_LOST", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Identity confusion. Coach: "The gap is painful. But the gap is where growth happens."` },
                            { label: "?­ ?¨ë“¤???í•˜????(?°ê¸°)", value: "L2_MASK", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Living a persona. Coach: "The mask is heavy. Who is behind the mask?"` },
                            { label: "???ˆëŠ” ê·¸ë?ë¡œì˜ ??(?˜ìš©)", value: "L3_REAL", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Self-acceptance. Coach: "Power comes from alignment. What is your truth today?"` }
                        ], system_prompt_injection: `[Gap Protocol] Focus on authenticity.`
                    };
                    case 'assess_dark_code': return {
                        ...base,
                        message: `?Œ‘ **[108 ?ê°] ?¤í¬ ì½”ë“œ(Dark Code) ê°ì?**\n\n?¹ì‹ ??ë°˜ë³µ?ìœ¼ë¡??˜ì–´ì§€ê²??˜ëŠ” **'?¸ìƒ????**???ˆë‚˜?? (?? ?„ë²½ì£¼ì˜, ?˜ì‹¬, ?Œí”¼)\n\nì§€ê¸?ê°€???œì„±?”ëœ ê·¸ë¦¼?ëŠ” ë¬´ì—‡?…ë‹ˆê¹?`,
                        options: [
                            { label: "?˜« ??ê°™ì? ?¤ìˆ˜ë¥??ˆë‹¤ (?ì±…)", value: "L1_REPEAT", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Pattern repetition. Coach: "Awareness is the first step. You are not the pattern."` },
                            { label: "?? ?¨í„´??ë³´ì´ê¸??œì‘?œë‹¤ (ê´€ì°?", value: "L2_SEEING", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Observing pattern. Coach: "Good eye. When does this pattern usually show up?"` },
                            { label: "?› ï¸??„êµ¬ë¡??????ˆë‹¤ (?°ê¸ˆ??", value: "L3_ALCHEMY", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Transmuting shadow. Coach: "Your shadow is your fuel. How will you use it?"` }
                        ], system_prompt_injection: `[Dark Code Protocol] Shadow work.`
                    };
                    case 'assess_neural_code': return {
                        ...base,
                        message: `?§¬ **[108 ?ê°] ?´ëŸ´ ì½”ë“œ(Talent) ë°œí˜„**\n\në°˜ë?ë¡? ?¹ì‹ ???˜ë“¤?´ì? ?Šê³ ???ì—°?¤ëŸ½ê²??˜í•˜??**'ì²œì¬??**?€ ë¬´ì—‡?¸ê???\n\nì§€ê¸??¹ì‹ ???¬ëŠ¥ ?ë„ˆì§€???´ë–»ê²??ë¥´ê³??ˆìŠµ?ˆê¹Œ?`,
                        options: [
                            { label: "?”’ ê½?ë§‰í? ?ˆë‹¤ (?¬ëŠ¥ ë¯¸ì‚¬??", value: "L1_BLOCKED", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Talent blocked. Coach: "A flowing river never stales. Unblock your flow."` },
                            { label: "?—ï¸?ê°€??ë°˜ì§?¸ë‹¤ (ê°„í—??", value: "L2_SPARK", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Intermittent flow. Coach: "Fan the spark. What triggers your flow state?"` },
                            { label: "?ŒŠ ì½¸ì½¸ ?Ÿì•„ì§„ë‹¤ (ëª°ì…)", value: "L3_FLOW", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Full flow. Coach: "Ride the wave. Create something uselessly beautiful today."` }
                        ], system_prompt_injection: `[Neural Protocol] Encouraging flow.`
                    };
                    case 'assess_identification': return {
                        ...base,
                        message: `?­ **[108 ?ê°] ?™ì¼??Identification) ì§„ë‹¨**\n\n"?˜ëŠ” ~~???¬ëŒ?´ì•¼"?¼ê³  ë¯¿ëŠ” ?œê°„, ?¹ì‹ ??ê°€?¥ì„±?€ ê·??€ ?ˆì— ê°‡íˆê²??©ë‹ˆ??\n\nì§€ê¸??¹ì‹ ??ê°€??ê½?ë¬¶ê³  ?ˆëŠ” 'ê¼¬ë¦¬????ë¬´ì—‡?…ë‹ˆê¹?`,
                        options: [
                            { label: "?·ï¸???• ??ê°‡í˜ (?„ë§ˆ/?„ë¹ /?€????", value: "L1_ROLE", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Identified with Role. Coach: "You are playing a role, but you are NOT the role. Who is the actor?"` },
                            { label: "?¤• ?ì²˜??ê°‡í˜ (?¼í•´???˜ì)", value: "L2_WOUND", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Identified with Wound. Coach: "The wound is part of your history, not your identity. Detach from the pain."` },
                            { label: "?ŒŒ ?˜ëŠ” ê·¸ì? ì¡´ì¬?œë‹¤ (ê´€ì°°ì)", value: "L3_BEING", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Pure Being. Coach: "Perfect. Remain as the Witness. What do you see?"` }
                        ], system_prompt_injection: `[Identification Protocol] Break labels.`
                    };
                    case 'assess_unconscious_habit': return {
                        ...base,
                        message: `?•¸ï¸?**[108 ?ê°] ë¬´ì˜?ì  ?µê? ?¬ì°©**\n\n?¤íŠ¸?ˆìŠ¤ë¥?ë°›ì„ ???˜ë„ ëª¨ë¥´ê²??€?´ë‚˜?¤ëŠ” '?ë™ ë°˜ì‘'???ˆë‚˜??\n?´ê²ƒ?€ ?¹ì‹ ??ë¬´ì˜?ì´ ë³´ë‚´??êµ¬ì¡° ? í˜¸?…ë‹ˆ??`,
                        options: [
                            { label: "?“± ?°ë§Œ ë³¸ë‹¤ (?„ì‹¤ ?„í”¼)", value: "L1_ESCAPE", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Habit: Escapism. Coach: "Dopamine is a painkiller. What pain are you numbing?"` },
                            { label: "?¬ ??‹/?Œì£¼ (ê°ì • ë§ˆì·¨)", value: "L2_NUMB", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Habit: Numbing. Coach: "Hunger for food is often hunger for love or peace. Distinguish the hunger."` },
                            { label: "?§˜ ?¸í¡?¼ë¡œ ?Œì•„?¨ë‹¤ (ê·¸ë¼?´ë”©)", value: "L3_BREATH", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Habit: Grounding. Coach: "Excellent using the breath. Deepen it now."` }
                        ], system_prompt_injection: `[Habit Protocol] Recognize triggers.`
                    };
                    case 'assess_self_criticism': return {
                        ...base,
                        message: `?–ï¸ **[108 ?ê°] ?´ë©´???¬íŒê´€ (Inner Critic)**\n\n?¹ì‹ ??ë¨¸ë¦¿?ì—???˜ë£¨ ì¢…ì¼ ?¹ì‹ ???‰ê??˜ëŠ” ëª©ì†Œë¦¬ê? ?´ê³  ?ˆìŠµ?ˆë‹¤.\n?¤ëŠ˜ ê·??¬íŒê´€?€ ?¹ì‹ ?ê²Œ ?´ë–¤ ?ê²°???´ë ¸?µë‹ˆê¹?`,
                        options: [
                            { label: "?”¨ \"??ë¶€ì¡±í•´\" (? ì£„ ?ê²°)", value: "L1_GUILTY", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Critic says Guilty. Coach: "That judge is biased. OBJECT to the verdict. Ask for evidence."` },
                            { label: "?¤” \"???˜í•  ???†ì—ˆ??\" (?¬ë¦¬)", value: "L2_DOUBT", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Critic is Doubting. Coach: "Perfection is a myth. 'Good Enough' is the new perfect."` },
                            { label: "?¤ \"ì¶©ë¶„??? ì¼??" (ë¬´ì£„/ê²©ë ¤)", value: "L3_INNOCENT", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Critic is Ally. Coach: "Turn the Judge into a Coach. What is the constructive feedback?"` }
                        ], system_prompt_injection: `[Critic Protocol] Taming the inner judge.`
                    };
                    case 'assess_social_persona': return {
                        ...base,
                        message: `?­ **[108 ?ê°] ?¬íšŒ??ê°€ë©?(Persona)**\n\n?¨ë“¤?ê²Œ ë³´ì—¬ì£¼ê¸° ?„í•´ ?°ê³  ?ˆëŠ” 'ê°€ë©????ˆë‚˜??\nê°€ë©´ì? ë³´í˜¸ ?¥ë¹„ì§€ë§? ?ˆë¬´ ?¤ë˜ ?°ë©´ ?¼êµ´???©ìŠµ?ˆë‹¤.`,
                        options: [
                            { label: "?¤¡ 'ì°©í•œ ?¬ëŒ' ?°ê¸° ì¤?, value: "L1_NICE", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Nice Guy Persona. Coach: "Being nice often means suppressing anger. Where is your anger hiding?"` },
                            { label: "?˜ 'ê°•í•œ ì²? ?°ê¸° ì¤?, value: "L2_STRONG", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Strong Persona. Coach: "Vulnerability is the only true strength. Drop the shield for a minute."` },
                            { label: "?Œ¿ ?ˆëŠ” ê·¸ë?ë¡??œí˜„ ì¤?, value: "L3_AUTHENTIC", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Authenticity. Coach: "Stay naked. It connects deeply."` }
                        ], system_prompt_injection: `[Persona Protocol] Authenticity check.`
                    };
                    case 'assess_energy_drain': return {
                        ...base,
                        message: `?•³ï¸?**[108 ?ê°] ?ë„ˆì§€ ?„ìˆ˜(Drain) ?ì?**\n\në°?ë¹ ì§„ ?…ì— ë¬¼ì„ ë¶“ê³  ?ˆì§„ ?Šë‚˜??\nì§€ê¸??¹ì‹ ???ëª…?¥ì„ ê°€??ë§ì´ ë¹¨ì•„?¤ì´??êµ¬ë©?€ ?´ë””?…ë‹ˆê¹?`,
                        options: [
                            { label: "?—£ï¸?ë¶ˆí•„?”í•œ ?¸ê°„ê´€ê³?, value: "L1_PEOPLE", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Drain: Relationships. Coach: "Energy vampires exist. Learn to say a polite but firm NO."` },
                            { label: "?¤¯ ?Šì„?†ëŠ” ê±±ì •/?¡ë…", value: "L2_WORRY", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Drain: Worry loop. Coach: "Worrying is praying for what you don't want. Change the channel."` },
                            { label: "?“± ë¬´ì˜ë¯¸í•œ ?•ë³´ ê³¼ë???, value: "L3_INFO", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Drain: Info overload. Coach: "Digital Detox mission prescribed. 30 mins unplugged."` }
                        ], system_prompt_injection: `[Energy Protocol] Plug the leaks.`
                    };
                    case 'assess_energy_source': return {
                        ...base,
                        message: `?”‹ **[108 ?ê°] ?œë ¥???ì²œ (Source)**\n\në°˜ë?ë¡? ë¬´ì—‡???????¹ì‹ ???í˜¼???´ì•„?¨ì‰¬??ê²ƒì„ ?ë¼?˜ìš”?\nê·¸ê²ƒ???¹ì‹ ??'ì¶©ì „ê¸??…ë‹ˆ??`,
                        options: [
                            { label: "?Œ¿ ?ì—° ?ì— ?ˆì„ ??, value: "L1_NATURE", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Source: Nature. Coach: "Nature resets the nervous system. Can you see the sky right now?"` },
                            { label: "?¨ ì°½ì¡°?ì¸ ?¼ì„ ????, value: "L2_CREATE", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Source: Creation. Coach: "You were born to create. Make something small today."` },
                            { label: "?¤« ê³ ìš”???¼ì ?ˆì„ ??, value: "L3_SOLITUDE", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Source: Solitude. Coach: "Solitude is the school of genius. Protect your alone time."` }
                        ], system_prompt_injection: `[Source Protocol] Recharging strategy.`
                    };
                    case 'assess_not_myself': return {
                        ...base,
                        message: `?š© **[108 ?ê°] ë¹„ì??Not-Self) ? í˜¸**\n\n"?´ê±´ ?´ê? ?„ë‹ˆ???¼ê³  ?ê»´ì§€???œê°„???ˆì—ˆ?˜ìš”?\nê·?ë¶ˆí¸?¨ì? ?¹ì‹ ???¬ë°”ë¥?ê¶¤ë„ë¥?ë²—ì–´?¬ìŒ???Œë¦¬??ê²½ë³´?…ë‹ˆ??`,
                        options: [
                            { label: "?˜£ ?˜ê¸° ?«ì? ë¶€?ì„ ?¤ì–´ì¤???, value: "L1_YESMAN", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Not-Self: People Pleasing. Coach: "Every false Yes is a No to yourself. Practice a small No."` },
                            { label: "?˜¡ ?¨ê³¼ ?˜ë? ë¹„êµ????, value: "L2_COMPARE", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Not-Self: Comparison. Coach: "Comparison is the thief of joy. Stay in your lane."` },
                            { label: "?ƒ?â™‚ï¸????ë„ë¥??ƒê³  ?œë‘ë¥???, value: "L3_RUSH", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Not-Self: Rushing. Coach: "Slow down. Alignment happens in the pauses."` }
                        ], system_prompt_injection: `[Not-Self Protocol] Recognition of misalignment.`
                    };
                    case 'assess_perspective_quiz': return {
                        ...base,
                        message: `?‘“ **[108 ?ê°] ê´€??Perspective) ?ŒìŠ¤??*\n\nê°™ì? ?¬ê±´???´ë–¤ ?Œì¦ˆë¡?ë³´ëŠ?ì— ?°ë¼ ì§€?¥ì´ ?˜ê¸°?? êµí›ˆ???˜ê¸°???©ë‹ˆ??\nì§€ê¸??¹ì‹ ?€ ?´ë–¤ ?ˆê²½???°ê³  ?¸ìƒ??ë³´ê³  ?ˆë‚˜??`,
                        options: [
                            { label: "?Œš \"?¸ìƒ?€ ?„í—˜??" (?ë ¤?€)", value: "L1_FEAR", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Lens: Fear. Coach: "Fear is False Evidence Appearing Real. What is the evidence?"` },
                            { label: "?–ï¸ \"?¸ìƒ?€ ê³µí‰?´ì•¼ ??" (?µì œ)", value: "L2_CONTROL", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Lens: Control. Coach: "Life is unfair but generous. Release the need to control."` },
                            { label: "? \"ëª¨ë“  ê±?ë°°ì??´ë‹¤\" (?˜ìš©)", value: "L3_LEARN", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Lens: Learning. Coach: "Everything is material for your growth. Even this."` }
                        ], system_prompt_injection: `[Perspective Protocol] Reframing.`
                    };
                    case 'assess_change_resistance': return {
                        ...base,
                        message: `?§± **[108 ?ê°] ë³€???€??Resistance) ì¸¡ì •**\n\n?ˆë¡œ???ë¦„???¤ì–´?¤ë ¤ ???? ?°ë¦¬???ê³ ??ë³¸ëŠ¥?ìœ¼ë¡?ë¬¸ì„ ê±¸ì–´ ? ê¸‰?ˆë‹¤.\nì§€ê¸??¹ì‹  ?ì˜ 'ë³€?????€???”ì§???¬ì •?€?`,
                        options: [
                            { label: "?¥¶ ë¬´ì„­ê³?ê·€ì°?‹¤ (ê±°ë?)", value: "L1_REJECT", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Resistance: Reject. Coach: "Comfort zone is a dead zone. What are you protecting?"` },
                            { label: "?˜° ?´ì•¼ ?˜ëŠ”??.. (ë§ì„¤??", value: "L2_HESITATE", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Resistance: Hesitate. Coach: "The water feels cold only before you jump. Jump."` },
                            { label: "?ŒŠ ?Œë„ë¥??€ë³´ì (?˜ìš©)", value: "L3_SURF", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Resistance: Surf. Coach: "Change is the only constant. Surf the chaos."` }
                        ], system_prompt_injection: `[Change Protocol] Embracing flow.`
                    };
                    case 'assess_inner_thirst': return {
                        ...base,
                        message: `?Œµ **[108 ?ê°] ?í˜¼??ê°ˆì¦ (Thirst)**\n\nëª¸ì´ ëª©ë§ˆë¥?ê²??„ë‹ˆ?? ?í˜¼??ëª©ë§ˆë¥??œê°„???ˆìŠµ?ˆë‹¤.\nì§€ê¸??¹ì‹ ???´ë©´ ê¹Šì? ê³³ì—??ê°€??ê°„ì ˆ???í•˜??ê²ƒì??`,
                        options: [
                            { label: "?›Œ ???¬ê³  ?¶ë‹¤ (?´ì‹)", value: "L1_REST", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Thirst: Rest. Coach: "Rest is a responsibility. Schedule non-negotiable rest."` },
                            { label: "?‘‚ ??ë§ì„ ?¤ì–´ì¤?(?¸ì •/ê³µê°)", value: "L2_HEARD", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Thirst: Validation. Coach: "I hear you. You exist. You matter."` },
                            { label: "?? ?˜ë? ?ˆëŠ” ?¼ì„ ?˜ê³  ?¶ë‹¤ (?±ì¥)", value: "L3_GROWTH", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Thirst: Purpose. Coach: "Meaning is made, not found. Make meaning today."` }
                        ], system_prompt_injection: `[Thirst Protocol] Identifying needs.`
                    };
                    case 'assess_wealth_current': return {
                        ...base,
                        message: `?’° **[108 ?ê°] ?¬ë¬¼(Wealth) ?ë„ˆì§€ ê²€ì§?*\n\n?ˆì? ?ë„ˆì§€?…ë‹ˆ?? ?„ì¬ ?ˆì„ ?€?˜ëŠ” ?¹ì‹ ??ì£¼íŒŒ?˜ëŠ” ?´ë–»?µë‹ˆê¹?\n?ˆì„ ?ê°????ê°€??ë¨¼ì? ?œëŠ” ê°ì •?€?`,
                        options: [
                            { label: "?˜± ?†ì–´??ë¶ˆì•ˆ?˜ë‹¤ (ê²°í•/ê³µí¬)", value: "L1_LACK", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Wealth: Lack mindset. Coach: "Scarcity attracts scarcity. Shift focus to what you HAVE."` },
                            { label: "?˜¤ ??ë²Œì–´???˜ëŠ”??(?•ë§/?•ë°•)", value: "L2_GREED", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Wealth: Pressure. Coach: "Chasing money pushes it away. Attract it with value."` },
                            { label: "?™ ?ˆëŠ” ê²ƒì— ê°ì‚¬ (?ìš”/?œí™˜)", value: "L3_ABUNDANCE", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Wealth: Flow. Coach: "Gratitude unlocks abundance. What is wealth to you beyond money?"` }
                        ], system_prompt_injection: `[Wealth Protocol] Abundance mindset.`
                    };
                    case 'assess_relationship_current': return {
                        ...base,
                        message: `?’ **[108 ?ê°] ê´€ê³?Relationship) ?ë„ˆì§€ ê²€ì§?*\n\n?¸ê°„ê´€ê³„ëŠ” ?˜ì˜ 'ê±°ìš¸'?…ë‹ˆ??\n?”ì¦˜ ì£¼ë? ?¬ëŒ?¤ì„ ë³´ë©° ?œëŠ” ?ê°?€?`,
                        options: [
                            { label: "?‘¿ ?¤ë“¤ ???€?´ê¹Œ (ë¹„ë‚œ/ì§œì¦)", value: "L1_BLAME", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Relation: Blame. Coach: "The world is a mirror. What part of you is irritated?"` },
                            { label: "?˜¢ ?˜ë§Œ ì°¸ìœ¼ë©???(?¬ìƒ/?µìš¸)", value: "L2_VICTIM", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Relation: Martyr. Coach: "Self-sacrifice is not love. It's self-betrayal. Set a boundary."` },
                            { label: "?¤ ?œë¡œ ?¤ë¥´êµ¬ë‚˜ (ì¡´ì¤‘/ê±°ë¦¬)", value: "L3_RESPECT", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Relation: Harmony. Coach: "Differences make the harmony. Dance with the difference."` }
                        ], system_prompt_injection: `[Relationship Protocol] Mirror neuron.`
                    };
                    case 'assess_health_current': return {
                        ...base,
                        message: `?©º **[108 ?ê°] ? ì²´(Health) ?ë„ˆì§€ ê²€ì§?*\n\nëª¸ì? ë¬´ì˜?ì˜ ì§€?„ì…?ˆë‹¤.\nì§€ê¸??¹ì‹ ??ëª¸ì´ ë³´ë‚´??ë©”ì‹œì§€??ë¬´ì—‡?…ë‹ˆê¹?`,
                        options: [
                            { label: "?¤’ ?¬ê¸°?€ê¸??¤ì‹œê³??„í”„??(ê²½ê³ )", value: "L1_PAIN", trigger_mode: "CONSCIOUSNESS_LEVEL_1", next_prompt_guide: `[Diagnosis] Health: Pain. Coach: "Pain is a messenger. Listen to it. What is it saying 'No' to?"` },
                            { label: "?˜ª ë¬´ê²ê³?ì²˜ì§„??(ë°©ì „)", value: "L2_TIRED", trigger_mode: "CONSCIOUSNESS_LEVEL_2", next_prompt_guide: `[Acceptance] Health: Fatigue. Coach: "Fatigue is forced rest. Allow the recharge."` },
                            { label: "?’ª ê°€ë³ê³  ?ìƒ?˜ë‹¤ (?œë ¥)", value: "L3_VITAL", trigger_mode: "CONSCIOUSNESS_LEVEL_3", next_prompt_guide: `[Transformation] Health: Vitality. Coach: "Vitality is precious. Invest it wisely today."` }
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
                message: `### ${topic}\n\n???´ëª…??ì°¨ì›???í—˜?˜ì‹œê² ìŠµ?ˆê¹Œ?`,
                options: [
                    {
                        label: "?”® ë¶„ì„ ?œì‘?˜ê¸°",
                        value: "analyze_start",
                        trigger_mode: "immediate",
                        next_prompt_guide: `The user wants to explore '${topic}'. Act as an expert in this specific esoteric field. Use their Saju data to provide unique insights.`
                    },
                    {
                        label: "?“š ?´ê±´ ë¬´ì—‡?¸ê???",
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
            'ê°?: 'Growth', '??: 'Survival', 'ë³?: 'Passion', '??: 'Devotion',
            'ë¬?: 'Trust', 'ê¸?: 'Nurturing', 'ê²?: 'Revolution', '??: 'Perfection',
            '??: 'Wisdom', 'ê³?: 'Connection'
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
        const woods = ['ê°?, '??];
        const fires = ['ë³?, '??];
        const earths = ['ë¬?, 'ê¸?];
        const metals = ['ê²?, '??];
        const waters = ['??, 'ê³?];

        const commonGuide = {
            burden: "?¬ìš©?ëŠ” ê³¼ê±°ë¥?'ì§??¼ë¡œ ?ë‚?ˆë‹¤. ë°©ì–´ê¸°ì œ(ê°€ë©????€??ì§ˆë¬¸?˜ì„¸??",
            chaos: "?¬ìš©?ëŠ” ê³¼ê±°ë¥?'?¼ë?'?¼ë¡œ ?ë‚?ˆë‹¤. ?ì¡´ ?„ëµ???€??ì§ˆë¬¸?˜ì„¸??",
            root: "?¬ìš©?ëŠ” ê³¼ê±°ë¥?'?ì›'?¼ë¡œ ?ë‚?ˆë‹¤. ?„ì¬ ê¿ˆê³¼???°ê²°?±ì„ ì§ˆë¬¸?˜ì„¸??"
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

        if (woods.includes(dayMasterChar)) { // ëª? ?±ì¥ ?•êµ¬
            return createOptions("?? ê°€ì§€ì¹˜ê¸° ?¹í•œ ???µë‹µ?ˆë‹¤ (?µì••)", "?Œªï¸?ë¹„ë°”?Œì´ ?ˆë¬´ ê±°ì…Œ??(?¼ë?)", "?Œ³ ê¹Šì´ ë¿Œë¦¬ ?´ë¦¬ê³?ë²„í…¼??(?¸ë‚´)");
        } else if (fires.includes(dayMasterChar)) { // ?? ë°œì‚° ?•êµ¬
            return createOptions("?•¯ï¸?êº¼ì§„ ë¶ˆì²˜??ë¬´ê¸°?¥í–ˆ??(?Œì™¸)", "?”¥ ê±·ì¡?????†ëŠ” ?°ë¶ˆ ê°™ì•˜??(ì¶©ëŒ)", "?€ï¸??˜ë§Œ???¨ê¸°ë¥?ì§€ì¼°ë‹¤ (?´ì •)");
        } else if (earths.includes(dayMasterChar)) { // ?? ?˜ìš©/?ˆì • ?•êµ¬
            return createOptions("?œï¸?ì²™ë°•???…ì²˜??ë©”ë§?ë‹¤ (ê²°í•)", "?Œ‹ ê°‘ìê¸?ë¬´ë„ˆì§€??ì§€ì§?ê°™ì•˜??(ë¶ˆì•ˆ)", "?°ï¸ ?¨ë‹¨??ê¸°ë°˜???˜ì–´ì£¼ì—ˆ??(?¬ìš©)");
        } else if (metals.includes(dayMasterChar)) { // ê¸? ?ì¹™/ê²°ë‹¨ ?•êµ¬
            return createOptions("?“ï¸ ê°•ìš”???€??ê°‡í? ?ˆì—ˆ??(ê°•ë°•)", "?—¡ï¸?ë¶€?¬ì§„ ì¹¼ì²˜???ì²˜ë°›ì•˜??(ì¢Œì ˆ)", "?’ ?¤ìŠ¤ë¡œë? ?¨ë‹¨?˜ê²Œ ?œë ¨?ˆë‹¤ (?±ì¥)");
        } else if (waters.includes(dayMasterChar)) { // ?? ? ì—°/ì§€???•êµ¬
            return createOptions("?’§ ê³ ì¸ ë¬¼ì²˜???©ì–´ê°”ë‹¤ (ì¹¨ì²´)", "?ŒŠ ?©ì“¸??? ë‚´?¤ê????ìˆ˜ ê°™ì•˜??(?ì‹¤)", "?ï¸?? ìœ ???ë¥´??ê°•ì´ ?˜ì—ˆ??(ì§€??");
        }

        // Fallback
        return createOptions("?ª¨ ë¬´ê±°??ì§?(ì¡±ì‡„)", "?Œªï¸??¼ë??¤ëŸ¬????’ (?ì²˜)", "?Œ³ ?¨ë‹¨??ì§€ì§€?€ (?ì›)");
    }
}

