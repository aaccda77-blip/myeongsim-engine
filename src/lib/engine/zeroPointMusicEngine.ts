/**
 * ==============================================================================
 * 🎼 ZeroPointMusicEngine — 사주 맞춤 제로포인트 에세이 가사 & 오행 처방 엔진
 * ==============================================================================
 * 사용자의 사주 4주 8글자와 심리/감정 상태(조급함, 번아웃, 완벽주의, 정체 등)를
 * 융합 분석하여 1:1 맞춤 음악 처방전과 시적인 에세이 가사를 생성합니다.
 * ==============================================================================
 */

import { SajuElementType, SOUND_REMEDY_PRESETS, SoundRemedyConfig } from '@/lib/sound/zeroPointSoundEngine';
import { parseSajuFourPillars, extractStem } from '@/lib/engine/ntsBusinessRecommender';

export type EmotionalState = 'rush' | 'overthinking' | 'perfectionism' | 'stagnation' | 'depression';

export interface ZeroPointTrackInfo {
    trackTitle: string;
    subTitle: string;
    targetElement: SajuElementType;
    sajuDiagnosis: string;
    remedyConfig: SoundRemedyConfig;
    lyricsVerses: { timeLabel: string; line: string }[];
    myeongsimCoaching: string;
    albumArtTheme: {
        bgGradient: string;
        accentColor: string;
        elementBadge: string;
        icon: string;
    };
}

export const EMOTIONAL_STATE_OPTIONS = [
    { id: 'rush' as EmotionalState, label: '조급함 · 과열', icon: '🔥', hint: '마음이 급하고 쉬지 못하는 상태' },
    { id: 'overthinking' as EmotionalState, label: '생각 과다 · 번민', icon: '🧠', hint: '꼬리를 무는 생각으로 머리가 무거운 상태' },
    { id: 'perfectionism' as EmotionalState, label: '완벽주의 · 경직', icon: '🛡️', hint: '모든 것을 통제하려다 몸과 마음이 굳은 상태' },
    { id: 'stagnation' as EmotionalState, label: '답답함 · 에너지 정체', icon: '⛰️', hint: '일이 뜻대로 풀리지 않고 막힌 느낌' },
    { id: 'depression' as EmotionalState, label: '무기력 · 에너지 침체', icon: '🌧️', hint: '의욕이 떨어지고 마음이 차가워진 상태' }
];

export function generateZeroPointMusicTrack(
    userProfile: any,
    selectedEmotion: EmotionalState = 'rush',
    includeName: boolean = true
): ZeroPointTrackInfo {
    const userName = userProfile?.userName || userProfile?.name || '명심가';
    const saju = userProfile?.saju || {};
    const p = parseSajuFourPillars(saju);
    const dGan = p.dGan || '甲';

    // 1. 일간 및 감정 상태를 기반으로 처방 오행(Remedy Element) 결정
    let targetElement: SajuElementType = 'wood';
    let diagnosis = '';
    let trackTitle = '';
    let subTitle = '';
    let verses: { timeLabel: string; line: string }[] = [];
    let coaching = '';

    const namePrefix = includeName ? `${userName} 님, ` : '';

    if (selectedEmotion === 'rush' || dGan === '丙' || dGan === '丁') {
        // 화(火) 과열 ➔ 수(水) 처방 (잔잔한 물/첼로로 열기 식힘)
        targetElement = 'fire';
        diagnosis = `뜨거운 불길과 조급한 긴장감이 과열된 상태입니다. 깊은 호수의 차분함과 수(水)의 잔향으로 마음에 고요한 여백을 선물합니다.`;
        trackTitle = `${userName} 님의 [깊은 밤 잔잔한 호수에서]`;
        subTitle = `${p.dGan}${p.dJi}일주 기질 1:1 맞춤 코칭 에세이노래 (65 BPM)`;
        verses = [
            { timeLabel: '00:00 - 00:45', line: `${namePrefix}쉼 없이 타오르던 마음의 불꽃을` },
            { timeLabel: '00:46 - 01:30', line: '깊은 호수 같은 고요에 비추어 보네' },
            { timeLabel: '01:31 - 02:15', line: '서두르지 않아도 모든 것은 제자리를 찾아가고' },
            { timeLabel: '02:16 - 03:00', line: '그 평온한 제로점에서 비로소 온전한 나를 만나네' }
        ];
        coaching = '💡 [명심 처방]: 앞으로 달려가려는 조급함을 1분간 멈출 때, 상황을 꿰뚫어보는 진짜 지혜가 솟아납니다.';
    } else if (selectedEmotion === 'overthinking' || dGan === '甲' || dGan === '乙') {
        // 목(木) 과다 ➔ 숲속 힐링 처방 (생각 가지치기)
        targetElement = 'wood';
        diagnosis = `의욕과 생각이 무성하게 뻗어나가 머리가 무거운 상태입니다. 깊은 뿌리의 고요에 기댈 수 있도록 맑은 어쿠스틱 선율을 처방합니다.`;
        trackTitle = `${userName} 님의 [푸른 나무의 평온한 쉼]`;
        subTitle = `${p.dGan}${p.dJi}일주 기질 1:1 맞춤 코칭 에세이노래 (75 BPM)`;
        verses = [
            { timeLabel: '00:00 - 00:45', line: `${namePrefix}하늘 높이 뻗어 나가려던 수많은 생각의 가지들` },
            { timeLabel: '00:46 - 01:30', line: '바람에 실어 보내고 뿌리의 고요에 기대어' },
            { timeLabel: '01:31 - 02:15', line: '증명하지 않아도 존재하는 그 자체로 충분한' },
            { timeLabel: '02:16 - 03:00', line: '숲의 침묵 속에 마음을 내려놓네' }
        ];
        coaching = '💡 [명심 처방]: 생각을 더하기보다 불필요한 걱정을 덜어낼 때, 가장 선명한 해답이 찾아옵니다.';
    } else if (selectedEmotion === 'perfectionism' || dGan === '庚' || dGan === '辛') {
        // 금(金) 경직 ➔ 웜 인디 어쿠스틱 처방 (이완과 온기)
        targetElement = 'metal';
        diagnosis = `1%의 오차도 용납하지 않으려는 완벽주의로 어깨와 신경이 경직된 상태입니다. 따스한 어쿠스틱 선율로 긴장을 녹여냅니다.`;
        trackTitle = `${userName} 님의 [부드러운 온기의 선율]`;
        subTitle = `${p.dGan}${p.dJi}일주 기질 1:1 맞춤 코칭 에세이노래 (70 BPM)`;
        verses = [
            { timeLabel: '00:00 - 00:45', line: `${namePrefix}날카롭게 날을 세우던 마음의 긴장들` },
            { timeLabel: '00:46 - 01:30', line: '따스한 햇살 같은 선율에 부드럽게 녹아내리네' },
            { timeLabel: '01:31 - 02:15', line: '완벽하지 않아도 아름다운 삶의 결을 따라' },
            { timeLabel: '02:16 - 03:00', line: '고요한 제로포인트에서 참된 자유를 얻네' }
        ];
        coaching = '💡 [명심 처방]: 통제하려는 손을 놓을 때, 비로소 세상의 모든 조화가 나를 돕기 시작합니다.';
    } else if (selectedEmotion === 'stagnation' || dGan === '戊' || dGan === '己') {
        // 토(土) 정체 ➔ 맑은 피아노 처방 (흐름과 순환)
        targetElement = 'earth';
        diagnosis = `단단하게 굳은 흙처럼 에너지가 정체되어 답답함을 느끼는 상태입니다. 시원하게 흐르는 맑은 피아노 선율로 순환을 돕습니다.`;
        trackTitle = `${userName} 님의 [새벽 시냇물과 맑은 피아노]`;
        subTitle = `${p.dGan}${p.dJi}일주 기질 1:1 맞춤 코칭 에세이노래 (72 BPM)`;
        verses = [
            { timeLabel: '00:00 - 00:45', line: `${namePrefix}굳게 닫혀있던 마음의 문을 열고` },
            { timeLabel: '00:46 - 01:30', line: '새벽 시냇물처럼 맑은 선율이 흘러가네' },
            { timeLabel: '01:31 - 02:15', line: '막혀있던 모든 응어리가 시원하게 풀려나고' },
            { timeLabel: '02:16 - 03:00', line: '새로운 생명의 기운이 가슴 가득 차오르네' }
        ];
        coaching = '💡 [명심 처방]: 정체는 멈춤이 아닌 새로운 도약을 위한 축적의 시간입니다. 가볍게 숨을 내쉬어 보세요.';
    } else {
        // 수(水) 침체 ➔ 아침 햇살 활력 처방 (온기와 빛)
        targetElement = 'water';
        diagnosis = `마음이 가라앉고 차가운 무기력감이 찾아온 상태입니다. 따뜻한 햇살 같은 Rhodes 건반과 희망의 파동으로 온기를 채웁니다.`;
        trackTitle = `${userName} 님의 [아침 햇살의 따스한 파동]`;
        subTitle = `${p.dGan}${p.dJi}일주 기질 1:1 맞춤 코칭 에세이노래 (80 BPM)`;
        verses = [
            { timeLabel: '00:00 - 00:45', line: `${namePrefix}차갑고 깊은 생각의 바다 위에` },
            { timeLabel: '00:46 - 01:30', line: '눈부신 아침 햇살이 따스하게 비추이네' },
            { timeLabel: '01:31 - 02:15', line: '어둠을 뚫고 피어나는 희망의 온기를 품고' },
            { timeLabel: '02:16 - 03:00', line: '온전하고 빛나는 나 자신으로 걸어 나가네' }
        ];
        coaching = '💡 [명심 처방]: 깊은 어둠 속에서도 빛은 언제나 준비되어 있습니다. 따스한 온기를 가슴에 품으세요.';
    }

    const remedyConfig = SOUND_REMEDY_PRESETS[targetElement];

    const albumArtThemes: Record<SajuElementType, any> = {
        wood: {
            bgGradient: 'from-emerald-950 via-teal-900 to-slate-950',
            accentColor: '#10b981',
            elementBadge: '木 포레스트 테라피',
            icon: '🌲'
        },
        fire: {
            bgGradient: 'from-blue-950 via-indigo-950 to-slate-950',
            accentColor: '#3b82f6',
            elementBadge: '水 쿨다운 앰비언스',
            icon: '🌊'
        },
        earth: {
            bgGradient: 'from-amber-950 via-yellow-950 to-slate-950',
            accentColor: '#f59e0b',
            elementBadge: '土 맑은 피아노 리셋',
            icon: '🎹'
        },
        metal: {
            bgGradient: 'from-purple-950 via-slate-900 to-slate-950',
            accentColor: '#8b5cf6',
            elementBadge: '金 웜 어쿠스틱 이완',
            icon: '🎸'
        },
        water: {
            bgGradient: 'from-pink-950 via-rose-950 to-slate-950',
            accentColor: '#ec4899',
            elementBadge: '日 선샤인 에너지',
            icon: '☀️'
        }
    };

    return {
        trackTitle,
        subTitle,
        targetElement,
        sajuDiagnosis: diagnosis,
        remedyConfig,
        lyricsVerses: verses,
        myeongsimCoaching: coaching,
        albumArtTheme: albumArtThemes[targetElement]
    };
}
