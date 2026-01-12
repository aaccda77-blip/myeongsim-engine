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

// Basic lookup for Ten Gods (Day Master vs Month Branch)
// This is a simplified lookup for the MVP. Full version would be in a dedicated engine.
const calculateTenGod = (dayMaster: string, monthBranch: string): string => {
    // 10 Stems: 甲乙丙丁戊己庚辛壬癸
    // 12 Branches: 子丑寅卯辰巳午未申酉戌亥 (Mapped to main energy)
    // For MVP, we map Month Branch to its dominant Element and compare with Day Master.
    // ... (Implementation concealed for brevity, using simplified mapping for demo)

    // Quick Demo Logic: Hash the combination to deterministicly pick a role
    // Ensure inputs are strings to avoid runtime errors
    const dm = String(dayMaster || 'Gap').charAt(0);
    const mb = String(monthBranch || 'Ja').charAt(0);

    const combination = dm + mb;
    const roles = ['bi', 'sik', 'jae', 'gwan', 'in', 'pyun_gwan', 'pyun_in', 'sang_gwan'];

    // Safety check for charCodeAt
    const code1 = combination.length > 0 ? combination.charCodeAt(0) : 0;
    const code2 = combination.length > 1 ? combination.charCodeAt(1) : 0;

    const index = (code1 + code2) % roles.length;
    return roles[index];
};

/**
 * Generates dynamic questions based on user's Saju profile using a STRICT 4-STAGE FLOW.
 */
export const generateQuestions = (report: ReportData): CoachingQuestion[] => {
    const questions: CoachingQuestion[] = [];

    // Safety: Ensure report.saju exists
    if (!report?.saju) return [];

    // --- Step 1: Social Persona (Month Pillar) ---
    // Safe extraction with optional chaining and fallbacks
    // Handle both 'dayMaster' (direct) and 'fourPillars.day.gan' (nested)
    const dayMaster = report.saju.dayMaster || report.saju.fourPillars?.day?.gan || '';
    const monthBranch = report.saju.fourPillars?.month?.ji || '';

    const monthTenGodCode = calculateTenGod(dayMaster, monthBranch);
    const socialRole = getSocialRole(monthTenGodCode) || getSocialRole('pyun_gwan')!;

    questions.push({
        id: 'step1_social',
        type: 'social',
        text: `[1단계: 가면 자각]\n사회에서는 '${socialRole.alias}'의 모습으로 살아가고 계시군요. 책임감 때문에 가끔은 버겁지 않으세요?`,
        options: [
            '도망치고 싶을 만큼 무거워요 💦',
            '힘들지만 인정받는 게 좋아요 🏆',
            '이제는 좀 내려놓고 싶어요 🍂',
            '아직은 버틸만해요 💪'
        ]
    });

    // --- Step 2: Inner Shadow (Hidden Mind / Jijanggan) ---
    // Safe extraction
    const dayBranchRaw = report.saju.fourPillars?.day?.ji;
    const dayBranch = typeof dayBranchRaw === 'string' ? dayBranchRaw : String(dayBranchRaw || '');

    const hiddenMind = dayBranch ? getHiddenMind(dayBranch) : null;

    questions.push({
        id: 'step2_shadow',
        type: 'hidden',
        text: hiddenMind
            ? `[2단계: 무의식 자각]\n겉모습과 달리, 속마음엔 '${hiddenMind.interpretation}' 같은 욕망이 숨어있네요. 들킨 것 같나요?`
            : `[2단계: 무의식 자각]\n남들은 모르는 당신만의 숨겨진 욕망이나 고집이 있지 않나요? 겉으로는 쿨한 척하지만요.`,
        options: [
            '맞아요, 들킨 것 같아요 🫣',
            '가끔 그런 생각이 들긴 해요 🤔',
            '전혀 아니에요, 전 그렇지 않아요 🙅‍♂️',
            '잘 모르겠어요, 헷갈려요 😵‍💫'
        ]
    });

    // --- Step 3: Lifecycle Void (Gongmang / Deficiency) ---
    // Safety check for charCodeAt
    const charCode = dayBranch.length > 0 ? dayBranch.charCodeAt(0) : 0;
    const isVoid = charCode % 3 === 0;

    questions.push({
        id: 'step3_void',
        type: 'energy',
        text: isVoid
            ? `[3단계: 결핍 자각]\n열심히 하는데도 밑 빠진 독처럼 채워지지 않는 공허함(공망)이 느껴지나요?`
            : `[3단계: 결핍 자각]\n가끔 이유 없이 에너지가 방전되거나, 아무리 노력해도 채워지지 않는 구멍이 느껴지나요?`,
        options: [
            '네, 아무리 채워도 계속 공허해요 🕳️',
            '가끔 이유 없이 무기력해져요 🔋',
            '뭔가 중요한 게 빠진 기분이에요 🧩',
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
