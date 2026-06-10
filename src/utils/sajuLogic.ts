import { INTERACTION_DATA, HEALTH_DATA, InteractionRule, HealthConstitution } from '../data/advancedAnalysisData';
import { GYEOKGUK_DATA, YONGSIN_DATA, GyeokgukRule, YongsinRule } from '../data/finalAnalysisData';
import { CROSS_ANALYSIS_DATA, COMPLEX_DATA, CrossAnalysisRule, ComplexRule } from '../data/microAnalysisData';

// --- Types ---
export type ElementType = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export type PolarityType = '+' | '-';

export interface MindArchitectureResult {
    modalProfile: {
        code: string;
        name: string;
    };
    energyLifecycle?: {
        code: string;
        name: string;
        energyLevel: 'strong' | 'weak' | 'rising' | 'storage';
    };
    latentEnergyCode?: {
        code: string;
        interpretation: string;
    };
    fullDescription: string;
}

export interface CoreMindsetResult extends MindArchitectureResult {
    expansionVoid: {
        isVoid: boolean;
        branches: string[];
        message?: string;
    };
    climate: {
        message: string;
    };
    soulMessage: string;
}

export interface AdvancedBlueprintResult extends CoreMindsetResult {
    interactions: InteractionRule[];
    health: HealthConstitution | null;
    operationModule: GyeokgukRule | null;
    optimizationKey: YongsinRule | null;
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

export const ELEMENT_RELATION: Record<ElementType, ElementType> = {
    'wood': 'fire', 'fire': 'earth', 'earth': 'metal', 'metal': 'water', 'water': 'wood'
};
export const ELEMENT_CONTROL: Record<ElementType, ElementType> = {
    'wood': 'earth', 'fire': 'metal', 'earth': 'water', 'metal': 'wood', 'water': 'fire'
};

export const ENERGY_LIFECYCLE_STAGES = [
    'jang_saeng', 'mok_yok', 'gwan_dae', 'geon_rok', 'je_wang',
    'soe', 'byung', 'sa', 'myo', 'jeol', 'tae', 'yang'
];

type EnergyLevelType = 'strong' | 'weak' | 'rising' | 'storage';

export const getEnergyLevel = (code: string): EnergyLevelType => {
    if (['geon_rok', 'je_wang', 'gwan_dae'].includes(code)) return 'strong';
    if (['byung', 'sa', 'myo', 'jeol'].includes(code)) return 'weak';
    if (['myo'].includes(code)) return 'storage';
    return 'rising';
};

export const calculateEnergyLifecycle = (gan: string, ji: string): { code: string; name: string } => {
    // [Fix] Robust Type Check for non-string truthy values (e.g. objects/numbers)
    if (typeof gan !== 'string' || typeof ji !== 'string' || !gan || !ji) {
        return { code: 'yang', name: '양' }; // Safety Fallback
    }
    const ganCode = gan.charCodeAt(0);
    const jiCode = ji.charCodeAt(0);
    const index = (ganCode + jiCode) % 12;
    const stage = ENERGY_LIFECYCLE_STAGES[index];

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
export const calculateExpansionVoid = (gan: string, ji: string): string[] => {
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
        return "당신은 얼어붙은 환경의 **'에너지 가속기'** 같은 존재입니다. 시스템이 당신의 열량을 필요로 하지만, 과부하를 조심하고 자신을 먼저 최적화하세요.";
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
    return "당신의 설계도는 계절과 요소들이 평이하게 어우러져 있습니다.";
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

const calculateOperationModule = (modalProfileCode: string): GyeokgukRule | null => {
    const map: Record<string, string> = {
        'sik': 'sikshin', 'sang_gwan': 'sangwan',
        'pyun_jae': 'pyunjae', 'jae': 'jeongjae',
        'pyun_gwan': 'pyungwan', 'gwan': 'jeonggwan',
        'pyun_in': 'pyunin', 'in': 'jeongin',
        'bi': 'sikshin', 'geop': 'sangwan'
    };
    const id = map[modalProfileCode];
    return GYEOKGUK_DATA.find(g => g.id === id) || null;
};

const calculateOptimizationKey = (dayMasterElement: string, monthSeason: string): YongsinRule | null => {
    let yongsinElement = 'fire';
    if (monthSeason === 'winter') yongsinElement = 'fire';
    else if (monthSeason === 'summer') yongsinElement = 'water';
    else if (monthSeason === 'spring') yongsinElement = 'metal';
    else if (monthSeason === 'fall') yongsinElement = 'wood';
    return YONGSIN_DATA[yongsinElement as keyof typeof YONGSIN_DATA] || null;
};

const calculateMicroAnalysis = (modalProfileCode: string, energyLevel: string, branches: string[]): { cross: CrossAnalysisRule | null, complex: ComplexRule[] } => {
    let roleType: 'wealth' | 'career' | 'study' | null = null;
    if (modalProfileCode.includes('jae')) roleType = 'wealth';
    else if (modalProfileCode.includes('gwan')) roleType = 'career';
    else if (modalProfileCode.includes('in')) roleType = 'study';

    let energyGroup: any = energyLevel;
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

export const analyzeSystemArchitecture = (dayMaster: string, monthBranch: string): MindArchitectureResult => {
    const dm = STEM_DATA[dayMaster] || STEM_DATA['Gap'];
    const mb = BRANCH_DATA[monthBranch] || BRANCH_DATA['Ja'];

    // Modal Profile (Role) Calculation
    let modalProfileCode = 'bi';
    const me = dm.element;
    const you = mb.element;
    const samePolarity = dm.polarity === mb.polarity;

    if (me === you) modalProfileCode = samePolarity ? 'bi' : 'geop';
    else if (ELEMENT_RELATION[me] === you) modalProfileCode = samePolarity ? 'sik' : 'sang_gwan';
    else if (ELEMENT_CONTROL[me] === you) modalProfileCode = samePolarity ? 'pyun_jae' : 'jae';
    else if (ELEMENT_CONTROL[you] === me) modalProfileCode = samePolarity ? 'pyun_gwan' : 'gwan';
    else if (ELEMENT_RELATION[you] === me) modalProfileCode = samePolarity ? 'pyun_in' : 'in';

    const modalProfileNames: Record<string, string> = {
        'bi': '주체적 실천(Agency)', 'geop': '사회적 비교(Social-Comp)',
        'sik': '창의적 에너지(Creative)', 'sang_gwan': '혁신적 통찰(Innovation)',
        'pyun_jae': '목표 개척(Pioneer)', 'jae': '안정적 관리(Manager)',
        'pyun_gwan': '프레셔 조율(Pressure)', 'gwan': '시스템 정렬(Stability)',
        'pyun_in': '심층 직관(Intuition)', 'in': '지적 수용(Absorb)'
    };
    const roleName = modalProfileNames[modalProfileCode];

    // Energy Lifecycle (Energy) Calculation
    const energyLifecycle = calculateEnergyLifecycle(dayMaster, monthBranch);
    const energyLevel = getEnergyLevel(energyLifecycle.code);

    // Latent Energy Code
    const jijanggan = JIJANGGAN_MAP[monthBranch] || JIJANGGAN_MAP['자'];
    const latentChar = jijanggan?.middle || jijanggan?.initial || '임';
    const latentEnergyCode = STEM_DATA[latentChar] || STEM_DATA['Im'];

    // --- Composite Description Logic (Upgrade) ---
    let description = "";

    // 1. Energy-Based Attitude
    if (energyLevel === 'strong') {
        description = `당신은 **${roleName}** 역할을 수행할 때, **'누구보다 강력하고 주도적으로'** 밀어붙이는 스타일입니다. 자신감이 넘치지만 독단을 주의하세요.`;
    } else if (energyLevel === 'weak') {
        description = `당신은 **${roleName}** 역할을 수행할 때, **'섬세하고 정신적인 영역'**에서 빛을 발합니다. 체력보다는 지혜와 전략으로 승부하는 지략가 타입입니다.`;
    } else if (energyLevel === 'rising') {
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
        modalProfile: { code: modalProfileCode, name: roleName },
        energyLifecycle: { ...energyLifecycle, energyLevel: energyLevel },
        latentEnergyCode: { code: latentChar, interpretation: `${latentEnergyCode.element}의 기운` },
        fullDescription: description
    };
};

export const analyzeCoreMindset = (dayMaster: string, monthBranch: string, dayBranch: string): CoreMindsetResult => {
    const basic = analyzeSystemArchitecture(dayMaster, monthBranch);

    const voids = calculateExpansionVoid(dayMaster, dayBranch);
    const isVoidEntry = voids.includes(monthBranch);
    const expansionVoidMsg = isVoidEntry
        ? "사회적 환경(Social Interface)에 대해 **'채워지지 않는 확장성'**을 느낍니다. 이 분야에 대해 남다른 갈증이나 심층적 탐구 욕구가 있을 수 있습니다."
        : undefined;

    const dmVal = STEM_DATA[dayMaster] || STEM_DATA['Gap'];
    const climMsg = calculateTemperature(monthBranch, dmVal.element);

    let soulMsg = "";
    if (isVoidEntry) {
        soulMsg = `당신은 표면적으로 '${basic.modalProfile.name}' 모달리티를 사용하지만, 기저에는 '심층적 탐구(Expansion Void)' 공간이 있어 끊임없이 본질을 찾으려 합니다.`;
    } else if (climMsg.includes('가속기') || climMsg.includes('용광로')) {
        soulMsg = climMsg;
    } else if (basic.energyLifecycle?.energyLevel === 'weak') {
        soulMsg = `표면적인 '${basic.modalProfile.name}' 활동보다, 내부의 시스템 설계와 전략적 사고에서 더 큰 시너지를 냅니다.`;
    } else {
        soulMsg = `잠재된 '${basic.latentEnergyCode?.code}' 에너지 코드가 당신의 핵심 경쟁력입니다. 그 숨겨진 지향점을 신뢰하세요.`;
    }

    return {
        ...basic,
        expansionVoid: { isVoid: isVoidEntry, branches: voids, message: expansionVoidMsg },
        climate: { message: climMsg },
        soulMessage: soulMsg
    };
};

export const analyzeAdvancedBlueprint = (dayMaster: string, monthBranch: string, dayBranch: string): AdvancedBlueprintResult => {
    const soulResult = analyzeCoreMindset(dayMaster, monthBranch, dayBranch);

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

    const operationModule = calculateOperationModule(soulResult.modalProfile.code);
    const optimizationKey = calculateOptimizationKey(dmVal.element, mbVal.season);

    const micro = calculateMicroAnalysis(soulResult.modalProfile.code, soulResult.energyLifecycle!.energyLevel, branches);

    return {
        ...soulResult,
        interactions,
        health,
        operationModule,
        optimizationKey,
        micro
    };
};
