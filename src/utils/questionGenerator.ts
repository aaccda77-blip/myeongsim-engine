import { analyzeAdvancedBlueprint, AdvancedBlueprintResult } from './sajuLogic';
import { CoachingQuestion, ReportData } from '../types/report';

// --- Saju Element & Polarity Database ---
// H: Heavenly Stem (Gan)
const STEM_DATA: Record<string, { element: string; polarity: string }> = {
    '갑': { element: 'wood', polarity: '+' }, '을': { element: 'wood', polarity: '-' },
    '병': { element: 'fire', polarity: '+' }, '정': { element: 'fire', polarity: '-' },
    '무': { element: 'earth', polarity: '+' }, '기': { element: 'earth', polarity: '-' },
    '경': { element: 'metal', polarity: '+' }, '신': { element: 'metal', polarity: '-' }, // 辛 (Yin Metal)
    '임': { element: 'water', polarity: '+' }, '계': { element: 'water', polarity: '-' },

    // English Code Fallbacks
    'Gap': { element: 'wood', polarity: '+' }, 'Eul': { element: 'wood', polarity: '-' }
};

// E: Earthly Branch (Ji)
const BRANCH_DATA: Record<string, { element: string; polarity: string }> = {
    '자': { element: 'water', polarity: '+' }, '축': { element: 'earth', polarity: '-' },
    '인': { element: 'wood', polarity: '+' }, '묘': { element: 'wood', polarity: '-' },
    '진': { element: 'earth', polarity: '+' }, '사': { element: 'fire', polarity: '+' },
    '오': { element: 'fire', polarity: '-' }, '미': { element: 'earth', polarity: '-' },
    '신': { element: 'metal', polarity: '+' }, // 申 (Yang Metal) - Collision resolved by splitting maps
    '유': { element: 'metal', polarity: '-' }, '술': { element: 'earth', polarity: '+' },
    '해': { element: 'water', polarity: '-' },

    // English Code Fallbacks
    'Ja': { element: 'water', polarity: '+' }, 'Chuk': { element: 'earth', polarity: '-' }
};

const ELEMENT_RELATION: Record<string, string> = {
    'wood': 'fire', 'fire': 'earth', 'earth': 'metal', 'metal': 'water', 'water': 'wood' // Generating (Producing)
};
const ELEMENT_CONTROL: Record<string, string> = {
    'wood': 'earth', 'fire': 'metal', 'earth': 'water', 'metal': 'wood', 'water': 'fire' // Controlling (Conquering)
};

// --- Logic: Calculate Ten God (Sibseong) ---
// Compares Day Master (Self) with Month Branch (Society/Environment)
const calculateTenGod = (dayMaster: string, monthBranch: string): string => {
    // 1. Get Element & Polarity
    // Fallback to Gap/Ja if invalid
    const dm = STEM_DATA[dayMaster] || { element: 'wood', polarity: '+' };
    const mb = BRANCH_DATA[monthBranch] || { element: 'water', polarity: '+' };

    const me = dm.element;
    const you = mb.element;
    const samePolarity = dm.polarity === mb.polarity;

    // 2. Compare Relationships
    if (me === you) {
        // [Friend / Robber] Same Element
        return samePolarity ? 'bi' : 'geop';
    } else if (ELEMENT_RELATION[me] === you) {
        // [Expression] I produce You
        return samePolarity ? 'sik' : 'sang_gwan';
    } else if (ELEMENT_CONTROL[me] === you) {
        // [Wealth] I control You
        return samePolarity ? 'pyun_jae' : 'jae';
    } else if (ELEMENT_CONTROL[you] === me) {
        // [Power/Official] You control Me
        return samePolarity ? 'pyun_gwan' : 'gwan';
    } else if (ELEMENT_RELATION[you] === me) {
        // [Resource/Seal] You produce Me
        return samePolarity ? 'pyun_in' : 'in';
    }

    // Fallback
    return 'bi';
};

// --- NEW V2 GENERATOR: Using "Divine Soul Engine" ---
export const generateQuestions = (report: ReportData): CoachingQuestion[] => {
    const questions: CoachingQuestion[] = [];

    // Safety: Ensure report.saju exists
    if (!report?.saju) return [];

    // Extract Basic Data (Defensive)
    const dayMaster = report.saju.dayMaster || report.saju.fourPillars?.day?.gan || '갑';
    const monthBranch = report.saju.fourPillars?.month?.ji || '자';
    const dayBranch = String(report.saju.fourPillars?.day?.ji || '자');

    // Run Divine Analysis
    const soul: AdvancedBlueprintResult = analyzeAdvancedBlueprint(dayMaster, monthBranch, dayBranch);

    // --- Step 1: Social Persona (Modal Profile + Regulation/Creation) ---
    // Use "Cross Analysis" message if available, else Ten God
    let step1Text = `[1단계: 가면 자각]\n당신은 사회에서 '${soul.modalProfile.name}'의 역할을 맡고 있군요.`;
    if (soul.micro.cross) {
        step1Text += `\n특히 ${soul.micro.cross.message}`;
    } else {
        step1Text += `\n책임감 때문에 가끔은 버겁지 않으세요?`;
    }

    questions.push({
        id: 'step1_social',
        type: 'social',
        text: step1Text,
        options: [
            '도망치고 싶을 만큼 무거워요 💦',
            '힘들지만 인정받는 게 좋아요 🏆',
            '이제는 좀 내려놓고 싶어요 🍂',
            '아직은 버틸만해요 💪'
        ]
    });

    // --- Step 2: Inner Shadow (Latent Energy Code) ---
    // Use "Psychological Complex" if active, else Latent Code
    let step2Text = "";
    if (soul.micro.complex.length > 0) {
        const complex = soul.micro.complex[0];
        step2Text = `[2단계: 무의식 자각]\n가끔 설명할 수 없는 감정이 올라오지 않나요? 당신에겐 '${complex.name}(${complex.keyword})'이 있어, ${complex.psychology}`;
    } else {
        step2Text = `[2단계: 무의식 자각]\n겉모습과 달리, 속마음엔 '${soul.latentEnergyCode?.interpretation}'이 숨어있네요. 남들은 모르는 당신만의 반전 매력이자 욕망입니다.`;
    }

    questions.push({
        id: 'step2_shadow',
        type: 'hidden',
        text: step2Text,
        options: [
            '맞아요, 들킨 것 같아요 🫣',
            '가끔 그런 생각이 들긴 해요 🤔',
            '전혀 아니에요, 전 그렇지 않아요 🙅‍♂️',
            '잘 모르겠어요, 헷갈려요 😵‍💫'
        ]
    });

    // --- Step 3: Lifecycle Void (Expansion Void / Climate / Energy Level) ---
    // Prioritize Void > Climate > Energy Weakness
    let step3Text = "";
    if (soul.expansionVoid.isVoid) {
        step3Text = `[3단계: 결핍 자각]\n${soul.expansionVoid.message}`;
    } else if (soul.climate.message.includes('난로') || soul.climate.message.includes('용광로')) {
        step3Text = `[3단계: 에너지 자각]\n${soul.climate.message}`;
    } else if (soul.energyLifecycle?.energyLevel === 'weak') {
        step3Text = `[3단계: 에너지 자각]\n당신의 에너지는 무리하면 쉽게 방전되는 '섬세한(Weak)' 상태입니다. 육체적 노동보다는 전략을 써야 합니다.`;
    } else {
        step3Text = `[3단계: 에너지 자각]\n지금 당신은 에너지가 채워져 있지만, 가끔 이유 없이 방전되지는 않나요? 스스로를 충전하는 법을 알고 계신가요?`;
    }

    questions.push({
        id: 'step3_void',
        type: 'energy',
        text: step3Text,
        options: [
            '네, 그 점이 항상 고민이었어요 💧',
            '가끔 그렇게 느껴요 🔋',
            '어떻게 채워야 할지 모르겠어요 🧩',
            '지금 삶에 충분히 만족해요 ✨'
        ]
    });

    // Step 4 is Destiny Choice (Free Will) - logic remains external or appended later specific to Destiny
    // (Handled by getDestinyChoice in main component usually, or if we want to integrate it here, we keep it separate as it's a generated 'Conclusion' question)

    return questions;
};

export const getQuestions = generateQuestions; // Alias if needed

export const getDestinyChoice = (report: ReportData): CoachingQuestion => {
    // Generate simple Destiny Choice based on Day Master simply, or use Soul Analysis if desired.
    // For now, keep it simple or strictly Saju based.

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
