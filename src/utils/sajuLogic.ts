import { INTERACTION_DATA, HEALTH_DATA, InteractionRule, HealthConstitution } from '../data/advancedAnalysisData';
import { GYEOKGUK_DATA, YONGSIN_DATA, GyeokgukRule, YongsinRule } from '../data/finalAnalysisData';
import { CROSS_ANALYSIS_DATA, COMPLEX_DATA, CrossAnalysisRule, ComplexRule } from '../data/microAnalysisData';

// --- Types ---
export type ElementType = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export type PolarityType = '+' | '-';

export interface SajuAnalysisResult {
    tenGod: {
        code: string;
        name: string;
    };
    wunsung?: {
        code: string;
        name: string;
        energyLevel: 'strong' | 'weak' | 'rising' | 'storage';
    };
    hiddenStem?: {
        code: string;
        interpretation: string;
    };
    fullDescription: string;
}

export interface SoulAnalysisResult extends SajuAnalysisResult {
    gongmang: {
        isVoid: boolean;
        branches: string[];
        message?: string;
    };
    climate: {
        message: string;
    };
    soulMessage: string;
}

export interface DivineSoulAnalysisResult extends SoulAnalysisResult {
    interactions: InteractionRule[];
    health: HealthConstitution | null;
    gyeokguk: GyeokgukRule | null;
    yongsin: YongsinRule | null;
    micro: {
        cross: CrossAnalysisRule | null;
        complex: ComplexRule[];
    };
}

// --- Data Constants ---
export const STEM_DATA: Record<string, { element: ElementType; polarity: PolarityType; name_kor: string }> = {
    '갑': { element: 'wood', polarity: '+', name_kor: '갑목' },
    '을': { element: 'wood', polarity: '-', name_kor: '을목' },
    '병': { element: 'fire', polarity: '+', name_kor: '병화' },
    '정': { element: 'fire', polarity: '-', name_kor: '정화' },
    '무': { element: 'earth', polarity: '+', name_kor: '무토' },
    '기': { element: 'earth', polarity: '-', name_kor: '기토' },
    '경': { element: 'metal', polarity: '+', name_kor: '경금' },
    '신': { element: 'metal', polarity: '-', name_kor: '신금' }, // 辛
    '임': { element: 'water', polarity: '+', name_kor: '임수' },
    '계': { element: 'water', polarity: '-', name_kor: '계수' },
    'Gap': { element: 'wood', polarity: '+', name_kor: '갑목' },
    'Eul': { element: 'wood', polarity: '-', name_kor: '을목' },
    'Byung': { element: 'fire', polarity: '+', name_kor: '병화' },
    'Jung': { element: 'fire', polarity: '-', name_kor: '정화' },
    'Mu': { element: 'earth', polarity: '+', name_kor: '무토' },
    'Gi': { element: 'earth', polarity: '-', name_kor: '기토' },
    'Gyeong': { element: 'metal', polarity: '+', name_kor: '경금' },
    'Sin': { element: 'metal', polarity: '-', name_kor: '신금' },
    'Im': { element: 'water', polarity: '+', name_kor: '임수' },
    'Gye': { element: 'water', polarity: '-', name_kor: '계수' },
};

export const BRANCH_DATA: Record<string, { element: ElementType; polarity: PolarityType; name_kor: string; season: string }> = {
    '인': { element: 'wood', polarity: '+', name_kor: '인목', season: 'spring' },
    '묘': { element: 'wood', polarity: '-', name_kor: '묘목', season: 'spring' },
    '진': { element: 'earth', polarity: '+', name_kor: '진토', season: 'spring' },
    '사': { element: 'fire', polarity: '+', name_kor: '사화', season: 'summer' },
    '오': { element: 'fire', polarity: '-', name_kor: '오화', season: 'summer' },
    '미': { element: 'earth', polarity: '-', name_kor: '미토', season: 'summer' },
    '신': { element: 'metal', polarity: '+', name_kor: '신금', season: 'fall' }, // 申
    '유': { element: 'metal', polarity: '-', name_kor: '유금', season: 'fall' },
    '술': { element: 'earth', polarity: '+', name_kor: '술토', season: 'fall' },
    '해': { element: 'water', polarity: '+', name_kor: '해수', season: 'winter' },
    '자': { element: 'water', polarity: '-', name_kor: '자수', season: 'winter' },
    '축': { element: 'earth', polarity: '-', name_kor: '축토', season: 'winter' },
    'In': { element: 'wood', polarity: '+', name_kor: '인목', season: 'spring' },
    'Myo': { element: 'wood', polarity: '-', name_kor: '묘목', season: 'spring' },
    'Jin': { element: 'earth', polarity: '+', name_kor: '진토', season: 'spring' },
    'Sa': { element: 'fire', polarity: '+', name_kor: '사화', season: 'summer' },
    'O': { element: 'fire', polarity: '-', name_kor: '오화', season: 'summer' },
    'Mi': { element: 'earth', polarity: '-', name_kor: '미토', season: 'summer' },
    'Shin': { element: 'metal', polarity: '+', name_kor: '신금', season: 'fall' },
    'Yu': { element: 'metal', polarity: '-', name_kor: '유금', season: 'fall' },
    'Sul': { element: 'earth', polarity: '+', name_kor: '술토', season: 'fall' },
    'Hae': { element: 'water', polarity: '+', name_kor: '해수', season: 'winter' },
    'Ja': { element: 'water', polarity: '-', name_kor: '자수', season: 'winter' },
    'Chuk': { element: 'earth', polarity: '-', name_kor: '축토', season: 'winter' },
};

const ELEMENT_RELATION: Record<ElementType, ElementType> = {
    'wood': 'fire', 'fire': 'earth', 'earth': 'metal', 'metal': 'water', 'water': 'wood'
};
const ELEMENT_CONTROL: Record<ElementType, ElementType> = {
    'wood': 'earth', 'fire': 'metal', 'earth': 'water', 'metal': 'wood', 'water': 'fire'
};

export const WUNSUNG_STAGES = [
    'jang_saeng', 'mok_yok', 'gwan_dae', 'geon_rok', 'je_wang',
    'soe', 'byung', 'sa', 'myo', 'jeol', 'tae', 'yang'
];

type WunsungLevel = 'strong' | 'weak' | 'rising' | 'storage';

export const getWunsungLevel = (code: string): WunsungLevel => {
    if (['geon_rok', 'je_wang', 'gwan_dae'].includes(code)) return 'strong';
    if (['byung', 'sa', 'myo', 'jeol'].includes(code)) return 'weak';
    if (['myo'].includes(code)) return 'storage';
    return 'rising';
};

export const calculateWunsung = (gan: string, ji: string): { code: string; name: string } => {
    // [Fix] Robust Type Check for non-string truthy values (e.g. objects/numbers)
    if (typeof gan !== 'string' || typeof ji !== 'string' || !gan || !ji) {
        return { code: 'yang', name: '양' }; // Safety Fallback
    }
    const ganCode = gan.charCodeAt(0);
    const jiCode = ji.charCodeAt(0);
    const index = (ganCode + jiCode) % 12;
    const stage = WUNSUNG_STAGES[index];

    const names: Record<string, string> = {
        'jang_saeng': '장생', 'mok_yok': '목욕', 'gwan_dae': '관대', 'geon_rok': '건록',
        'je_wang': '제왕', 'soe': '쇠', 'byung': '병', 'sa': '사',
        'myo': '묘', 'jeol': '절', 'tae': '태', 'yang': '양'
    };

    return { code: stage, name: names[stage] || '양' };
};

export const JIJANGGAN_MAP: Record<string, { main: string; initial: string; middle?: string }> = {
    '자': { main: '계', initial: '임' },
    '축': { main: '기', initial: '계', middle: '신' },
    '인': { main: '갑', initial: '무', middle: '병' },
    '묘': { main: '을', initial: '갑' },
    '진': { main: '무', initial: '을', middle: '계' },
    '사': { main: '병', initial: '무', middle: '경' },
    '오': { main: '정', initial: '병', middle: '기' },
    '미': { main: '기', initial: '정', middle: '을' },
    '신': { main: '경', initial: '무', middle: '임' },
    '유': { main: '신', initial: '경' },
    '술': { main: '무', initial: '신', middle: '정' },
    '해': { main: '임', initial: '무', middle: '갑' }
};

// --- Helper Calculations ---
export const calculateGongmang = (gan: string, ji: string): string[] => {
    const GAN_ORDER = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
    const JI_ORDER = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

    const gIndex = GAN_ORDER.indexOf(gan) !== -1 ? GAN_ORDER.indexOf(gan) : 0;
    const jIndex = JI_ORDER.indexOf(ji) !== -1 ? JI_ORDER.indexOf(ji) : 0;

    const diff = (jIndex - gIndex + 12) % 12;

    if (diff === 0) return ['술', '해'];
    if (diff === 10) return ['신', '유'];
    if (diff === 8) return ['오', '미'];
    if (diff === 6) return ['진', '사'];
    if (diff === 4) return ['인', '묘'];
    if (diff === 2) return ['자', '축'];

    return [];
};

const calculateTemperature = (monthBranch: string, dayMasterElement: string): string => {
    const mb = BRANCH_DATA[monthBranch] || BRANCH_DATA['Ja'];
    const season = mb.season;

    if (season === 'winter' && (dayMasterElement === 'fire' || dayMasterElement === 'wood')) {
        return "당신은 얼어붙은 환경의 **'난로'** 같은 존재입니다. 모두가 당신의 따뜻함을 원하지만, 정작 당신은 에너지가 고갈되기 쉽습니다. 스스로를 먼저 데우세요.";
    }
    if (season === 'summer' && (dayMasterElement === 'fire' || dayMasterElement === 'earth')) {
        return "당신은 한여름의 **'용광로'**입니다. 열정이 넘치지만, 가끔은 그 열기가 주변을 지치게 합니다. 차가운 이성으로 열기를 식히는 지혜가 필요합니다.";
    }
    if (season === 'spring' && dayMasterElement === 'wood') {
        return "당신은 봄의 **'새싹'**처럼 의욕이 앞섭니다. 시작은 잘하지만 마무리가 약할 수 있으니 끈기를 기르세요.";
    }
    if (season === 'fall' && dayMasterElement === 'metal') {
        return "당신은 가을의 **'서리'**처럼 냉철합니다. 일 처리는 완벽하지만 인간미가 부족하다는 말을 듣기 쉬우니 유연함을 가지세요.";
    }
    return "당신의 사주는 계절과 오행이 평이하게 어우러져 있습니다.";
};

const calculateInteraction = (branches: string[]): InteractionRule[] => {
    const activeInteractions: InteractionRule[] = [];
    INTERACTION_DATA.forEach(rule => {
        if (rule.pair.every(p => branches.includes(p))) {
            activeInteractions.push(rule);
        }
    });
    return activeInteractions;
};

const calculateHealth = (weakestElement: string): HealthConstitution | null => {
    return HEALTH_DATA[weakestElement as keyof typeof HEALTH_DATA] || null;
};

const calculateGyeokguk = (tenGodCode: string): GyeokgukRule | null => {
    const map: Record<string, string> = {
        'sik': 'sikshin', 'sang_gwan': 'sangwan',
        'pyun_jae': 'pyunjae', 'jae': 'jeongjae',
        'pyun_gwan': 'pyungwan', 'gwan': 'jeonggwan',
        'pyun_in': 'pyunin', 'in': 'jeongin',
        'bi': 'sikshin', 'geop': 'sangwan'
    };
    const id = map[tenGodCode];
    return GYEOKGUK_DATA.find(g => g.id === id) || null;
};

const calculateYongsin = (dayMasterElement: string, monthSeason: string): YongsinRule | null => {
    let yongsinElement = 'fire';
    if (monthSeason === 'winter') yongsinElement = 'fire';
    else if (monthSeason === 'summer') yongsinElement = 'water';
    else if (monthSeason === 'spring') yongsinElement = 'metal';
    else if (monthSeason === 'fall') yongsinElement = 'wood';
    return YONGSIN_DATA[yongsinElement as keyof typeof YONGSIN_DATA] || null;
};

const calculateMicroAnalysis = (tenGodCode: string, wunsungLevel: string, branches: string[]): { cross: CrossAnalysisRule | null, complex: ComplexRule[] } => {
    let roleType: 'wealth' | 'career' | 'study' | null = null;
    if (tenGodCode.includes('jae')) roleType = 'wealth';
    else if (tenGodCode.includes('gwan')) roleType = 'career';
    else if (tenGodCode.includes('in')) roleType = 'study';

    let energyGroup: any = wunsungLevel;
    if (energyGroup === 'rising') energyGroup = 'new';

    const cross = roleType ? CROSS_ANALYSIS_DATA.find(c => c.role_type === roleType && c.energy_group === energyGroup) || null : null;

    const activeComplexes: ComplexRule[] = [];
    COMPLEX_DATA.forEach(c => {
        if (c.pair.every(p => branches.includes(p))) {
            activeComplexes.push(c);
        }
    });

    return { cross, complex: activeComplexes };
};

// --- Main Analysis Functions (Exports) ---

export const analyzeSaju = (dayMaster: string, monthBranch: string): SajuAnalysisResult => {
    const dm = STEM_DATA[dayMaster] || STEM_DATA['Gap'];
    const mb = BRANCH_DATA[monthBranch] || BRANCH_DATA['Ja'];

    // Ten God (Role) Calculation
    let tenGodCode = 'bi';
    const me = dm.element;
    const you = mb.element;
    const samePolarity = dm.polarity === mb.polarity;

    if (me === you) tenGodCode = samePolarity ? 'bi' : 'geop';
    else if (ELEMENT_RELATION[me] === you) tenGodCode = samePolarity ? 'sik' : 'sang_gwan';
    else if (ELEMENT_CONTROL[me] === you) tenGodCode = samePolarity ? 'pyun_jae' : 'jae';
    else if (ELEMENT_CONTROL[you] === me) tenGodCode = samePolarity ? 'pyun_gwan' : 'gwan';
    else if (ELEMENT_RELATION[you] === me) tenGodCode = samePolarity ? 'pyun_in' : 'in';

    const tenGodNames: Record<string, string> = {
        'bi': '비견(독립군)', 'geop': '겁재(승부사)',
        'sik': '식신(한우물)', 'sang_gwan': '상관(혁명가)',
        'pyun_jae': '편재(사업가)', 'jae': '정재(관리자)',
        'pyun_gwan': '편관(해결사)', 'gwan': '정관(모범생)',
        'pyun_in': '편인(철학자)', 'in': '정인(사랑둥이)'
    };
    const roleName = tenGodNames[tenGodCode];

    // Wunsung (Energy) Calculation
    const wunsung = calculateWunsung(dayMaster, monthBranch);
    const wunsungLevel = getWunsungLevel(wunsung.code);

    // Hidden Stem
    const jijanggan = JIJANGGAN_MAP[monthBranch] || JIJANGGAN_MAP['자'];
    const hiddenChar = jijanggan?.middle || jijanggan?.initial || '임';
    const hiddenStem = STEM_DATA[hiddenChar] || STEM_DATA['Im'];

    // --- Composite Description Logic (Upgrade) ---
    let description = "";

    // 1. Energy-Based Attitude
    if (wunsungLevel === 'strong') {
        description = `당신은 **${roleName}** 역할을 수행할 때, **'누구보다 강력하고 주도적으로'** 밀어붙이는 스타일입니다. 자신감이 넘치지만 독단을 주의하세요.`;
    } else if (wunsungLevel === 'weak') {
        description = `당신은 **${roleName}** 역할을 수행할 때, **'섬세하고 정신적인 영역'**에서 빛을 발합니다. 체력보다는 지혜와 전략으로 승부하는 지략가 타입입니다.`;
    } else if (wunsungLevel === 'rising') {
        description = `당신은 **${roleName}** 역할에 대해 **'호기심과 순수한 열정'**을 가지고 있습니다. 좋은 후원자나 환경을 만나면 무섭게 성장할 잠재력이 있습니다.`;
    } else {
        description = `당신은 **${roleName}** 역할을 차분하게 준비하며, 에너지를 효율적으로 비축하고 있는 상태입니다.`;
    }

    // 2. Temperature (Climate) Advice Injection
    const climateMsg = calculateTemperature(monthBranch, me);
    if (climateMsg && !climateMsg.includes('평이하게')) {
        description += `\n\n또한 ${climateMsg}`;
    }

    return {
        tenGod: { code: tenGodCode, name: roleName },
        wunsung: { ...wunsung, energyLevel: wunsungLevel },
        hiddenStem: { code: hiddenChar, interpretation: `${hiddenStem.element}의 기운` },
        fullDescription: description
    };
};

export const analyzeSoul = (dayMaster: string, monthBranch: string, dayBranch: string): SoulAnalysisResult => {
    const basic = analyzeSaju(dayMaster, monthBranch);

    const voids = calculateGongmang(dayMaster, dayBranch);
    const isMonthVoid = voids.includes(monthBranch);
    const gongmangMsg = isMonthVoid
        ? "사회적 활동(월지)에 대해 **'채워지지 않는 허기'**를 느낍니다. 이 분야에 대해 남다른 집착이나 공허함이 있을 수 있습니다."
        : undefined;

    const dmVal = STEM_DATA[dayMaster] || STEM_DATA['Gap'];
    const climMsg = calculateTemperature(monthBranch, dmVal.element);

    let soulMsg = "";
    if (isMonthVoid) {
        soulMsg = `겉보기에 당신은 '${basic.tenGod.name}' 역할을 하지만, 사실 그 자리는 '공망(Void)'이라 아무리 채워도 공허할 수 있습니다.`;
    } else if (climMsg.includes('난로') || climMsg.includes('용광로')) {
        soulMsg = climMsg;
    } else if (basic.wunsung?.energyLevel === 'weak') {
        soulMsg = `겉모습은 '${basic.tenGod.name}'이지만 에너지가 약해 실전보다는 전략가로 나서야 합니다.`;
    } else {
        soulMsg = `내면의 '${basic.hiddenStem?.code}' 기운이 당신의 반전 매력입니다. 그 숨겨진 욕망을 무시하지 마세요.`;
    }

    return {
        ...basic,
        gongmang: { isVoid: isMonthVoid, branches: voids, message: gongmangMsg },
        climate: { message: climMsg },
        soulMessage: soulMsg
    };
};

export const analyzeDivineSoul = (dayMaster: string, monthBranch: string, dayBranch: string): DivineSoulAnalysisResult => {
    const soulResult = analyzeSoul(dayMaster, monthBranch, dayBranch);

    const branches = [monthBranch, dayBranch];
    const dmVal = STEM_DATA[dayMaster] || STEM_DATA['Gap'];
    const mbVal = BRANCH_DATA[monthBranch] || BRANCH_DATA['Ja'];

    const interactions = calculateInteraction(branches);

    let weakElement = 'water';
    if (mbVal.season === 'summer') weakElement = 'water';
    else if (mbVal.season === 'winter') weakElement = 'fire';
    else if (mbVal.season === 'spring') weakElement = 'earth';
    else if (mbVal.season === 'fall') weakElement = 'wood';
    const health = calculateHealth(weakElement);

    const gyeokguk = calculateGyeokguk(soulResult.tenGod.code);
    const yongsin = calculateYongsin(dmVal.element, mbVal.season);

    const micro = calculateMicroAnalysis(soulResult.tenGod.code, soulResult.wunsung!.energyLevel, branches);

    return {
        ...soulResult,
        interactions,
        health,
        gyeokguk,
        yongsin,
        micro
    };
};
