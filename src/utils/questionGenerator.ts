import { ReportData } from '@/types/report';
import { getSocialRole } from '@/data/socialRoleData';
import { getWunsungData } from '@/data/wunsungData';
import { getHiddenMind } from '@/data/deepAnalysisData';
import { getInteractionInfo } from '@/data/advancedAnalysisData';

export interface CoachingQuestion {
    id: string;
    type: 'social' | 'hidden' | 'energy' | 'clash';
    text: string;
    options?: string[]; // Optional user choice buttons
}

// Basic Ten God Mapping (Simplified for MVP)
// This maps the relationship between Day Master and Month Branch (or dominant energy)
const calculateTenGod = (dayMaster: string, monthBranch: string): string => {
    // Basic Element Mapping
    const elements = { 'G': 'wood', 'E': 'wood', 'B': 'fire', 'J': 'fire', 'M': 'earth', 'K': 'earth', 'G2': 'metal', 'S': 'metal', 'I': 'water', 'G3': 'water' };

    // Ensure we have strings
    const dm = String(dayMaster || '').charAt(0);
    const mb = String(monthBranch || '').charAt(0);

    // If we have actual Korean characters (e.g. 갑, 자), use a hash to ensure VARIETY.
    // Real Saju logic would require checking Element relationships (Wood vs Fire etc).
    // For this MVP to show *different* results for *different* inputs:
    const hash = (dm.charCodeAt(0) + mb.charCodeAt(0));
    const roles = ['bi', 'sik', 'jae', 'gwan', 'in', 'pyun_gwan', 'pyun_in', 'sang_gwan'];

    return roles[hash % roles.length];
};

/**
 * Generates dynamic questions based on user's Saju profile using a STRICT 4-STAGE FLOW.
 */
export const generateQuestions = (report: ReportData): CoachingQuestion[] => {
    const questions: CoachingQuestion[] = [];

    // Safety: Ensure report.saju exists
    if (!report?.saju) return [];

    // --- Step 1: Social Persona (Month Pillar) ---
    // Extract REAL data points.
    // report.saju.fourPillars.day.gan -> "갑" (Gap)
    // report.saju.fourPillars.month.ji -> "자" (Ja)
    const dayMaster = report.saju.dayMaster || report.saju.fourPillars?.day?.gan || '갑';
    const monthBranch = report.saju.fourPillars?.month?.ji || '자';

    // Calculate distinct code based on the specific characters
    const monthTenGodCode = calculateTenGod(dayMaster, monthBranch);
    const socialRole = getSocialRole(monthTenGodCode) || getSocialRole('pyun_gwan')!;

    questions.push({
        id: 'step1_social',
        type: 'social',
        text: `[1단계: 가면 자각]\n당신의 사주(월지)를 보니 사회에서는 '${socialRole.alias}'의 가면을 쓰고 계시군요.\n책임감 때문에 가끔은 버겁지 않으세요?`,
        options: [
            '도망치고 싶을 만큼 무거워요 💦',
            '힘들지만 인정받는 게 좋아요 🏆',
            '이제는 좀 내려놓고 싶어요 🍂',
            '아직은 버틸만해요 💪'
        ]
    });

    // --- Step 2: Inner Shadow (Hidden Mind / Jijanggan) ---
    const dayBranch = String(report.saju.fourPillars?.day?.ji || '자');
    const hiddenMind = getHiddenMind(dayBranch); // This is a Direct Lookup! 1:1 Mapping

    questions.push({
        id: 'step2_shadow',
        type: 'hidden',
        text: hiddenMind
            ? `[2단계: 무의식 자각]\n겉보기에 당신의 일지는 '${dayBranch}'이지만, 그 속에는 '${hiddenMind.interpretation}' 같은 욕망이 숨어있네요.\n혹시 들킨 것 같나요?`
            : `[2단계: 무의식 자각]\n남들은 모르는 당신만의 숨겨진 욕망이나 고집이 있지 않나요? 겉으로는 쿨한 척하지만요.`,
        options: [
            '맞아요, 들킨 것 같아요 🫣',
            '가끔 그런 생각이 들긴 해요 🤔',
            '전혀 아니에요, 전 그렇지 않아요 🙅‍♂️',
            '잘 모르겠어요, 헷갈려요 😵‍💫'
        ]
    });

    // --- Step 3: Lifecycle Void (Gongmang / Deficiency) ---
    // Deterministic Void Check based on Day Branch char code
    const isVoid = (dayBranch.charCodeAt(0) % 3 === 0);

    questions.push({
        id: 'step3_void',
        type: 'energy',
        text: isVoid
            ? `[3단계: 결핍 자각]\n당신의 에너지 흐름이 잠시 끊기는 '공망' 구간이 감지됩니다.\n밑 빠진 독처럼 채워지지 않는 공허함이 느껴지나요?`
            : `[3단계: 결핍 자각]\n지금은 에너지가 채워져 있지만, 가끔 이유 없이 방전되지는 않나요?\n아무리 노력해도 채워지지 않는 구멍이 있나요?`,
        options: [
            isVoid ? '네, 아무리 채워도 계속 공허해요 🕳️' : '가끔 이유 없이 무기력해져요 🔋',
            '뭔가 중요한 게 빠진 기분이에요 🧩',
            '지금은 괜찮지만 불안해요 ☁️',
            '지금 삶에 충분히 만족해요 ✨'
        ]
    });

    return questions;
}

/**
 * Returns the final "Destiny Choice" question. (Step 4)
 */
export const getDestinyChoice = (roleAlias: string): CoachingQuestion => {
    return {
        id: 'destiny_choice',
        type: 'social',
        text: `[4단계: 운명 선택]\n이 모든 것이 당신의 설계도입니다. 하지만 운명은 고정된 게 아닙니다. 이제 어떻게 하시겠습니까?`,
        options: [
            `A. 수용과 개선\n(운명을 받아들이고 현명하게 관리하겠다)`,
            `B. 혁신과 개척\n(가면을 벗고 새로운 나로 다시 태어나겠다)`
        ]
    };
};

// Helper for single lookup (kept for compatibility)
export const getSocialQuestion = (tenGodCode: string): CoachingQuestion | null => {
    return null; // Deprecated in favor of generateQuestions
};
