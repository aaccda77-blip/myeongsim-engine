/**
 * SovereignCoachingReport.tsx
 * 🔬 명심(明心) 프리미엄 통합 코칭 리포트 — 사회적 기여 모달
 *
 * - 기존 챗봇 시스템에 완전 독립적으로 동작
 * - 사용자 사주(userProfile) 데이터를 받아 동적으로 리포트 생성
 * - HTML 컨셉 디자인을 동일하게 React 모달로 구현
 */

'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronDown, ChevronUp, Diamond, Gem } from 'lucide-react';

// ─────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────
interface SovereignCoachingReportProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile?: any; // 사용자 사주 프로필
}

// ─────────────────────────────────────────────
// 헬퍼: 사주 데이터 추출 유틸
// ─────────────────────────────────────────────
function extractSajuInfo(userProfile: any) {
    const saju = userProfile?.saju || {};

    // 사주 기둥 추출 (legacy flat / nested 모두 지원)
    const getPillarChar = (pillar: any, part: 'stem' | 'branch'): string => {
        if (!pillar) return '?';
        if (part === 'stem') {
            if (typeof pillar.stem === 'string') return pillar.stem;
            if (pillar.gan?.char) return pillar.gan.char;
            if (typeof pillar.gan === 'string') return pillar.gan;
        }
        if (part === 'branch') {
            if (typeof pillar.branch === 'string') return pillar.branch;
            if (pillar.ji?.char) return pillar.ji.char;
            if (typeof pillar.ji === 'string') return pillar.ji;
        }
        return '?';
    };

    const day = saju.dayPillar || saju.fourPillars?.day || {};
    const month = saju.monthPillar || saju.fourPillars?.month || {};
    const year = saju.yearPillar || saju.fourPillars?.year || {};
    const time = saju.timePillar || saju.hourPillar || saju.fourPillars?.time || saju.fourPillars?.hour || {};

    const dayStem = getPillarChar(day, 'stem');
    const dayBranch = getPillarChar(day, 'branch');
    const monthStem = getPillarChar(month, 'stem');
    const monthBranch = getPillarChar(month, 'branch');
    const yearStem = getPillarChar(year, 'stem');
    const yearBranch = getPillarChar(year, 'branch');
    const timeStem = getPillarChar(time, 'stem');
    const timeBranch = getPillarChar(time, 'branch');

    const ilgan = `${dayStem}${dayBranch}`;
    const fullSaju = `${yearStem}${yearBranch} ${monthStem}${monthBranch} ${ilgan} ${timeStem}${timeBranch}`;

    // 오행 분포
    const ohaeng = saju.ohaeng || { metal: 30, earth: 20, fire: 15, water: 15, wood: 10 };

    const name = userProfile?.name || userProfile?.displayName || '소버린';
    const birthDate = userProfile?.birthDate ? new Date(userProfile.birthDate).getFullYear() : '';

    return {
        name,
        birthDate,
        dayStem,
        dayBranch,
        ilgan,
        fullSaju,
        yearPillar: `${yearStem}${yearBranch}`,
        monthPillar: `${monthStem}${monthBranch}`,
        dayPillar: ilgan,
        timePillar: `${timeStem}${timeBranch}`,
        ohaeng,
    };
}

// ─────────────────────────────────────────────
// 일간별 명심 코칭 텍스트 DB (모듈식)
// ─────────────────────────────────────────────
interface IlganCoaching {
    ilganLabel: string;
    identity: string;
    coreIssue: string;
    cafeResult: string;
    primaryDrive: string;
    confidence: string;
    outputCode: string;
    phase1: { title: string; inner: string; env: string; social: string; future: string; synthesis: string };
    darkCode: { id: string; tag: string; symptoms: string[] };
    neuralPrompts: { id: string; label: string; q: string }[];
    steps: { label: string; desc: string }[];
    metaSelf: string;
    finalQuote: string;
    finalQuoteKo: string;
    closingMessage: string;
}

const ILGAN_COACHING_DB: Record<string, IlganCoaching> = {
    '辛': {
        ilganLabel: '辛金(신금, 음금) — 완성된 보석·예리한 칼날',
        identity: '이미 완성되어 예리하고 섬세한 보석입니다. 극한의 순도와 완벽주의를 지향하며, 주변의 탁기를 견디지 못하는 고결한 주권자(Sovereign)의 본질을 지닙니다.',
        coreIssue: '금(金)이 과잉된 구조. 서버의 냉각 시스템이 과부하된 상태를 의미합니다. 보석이 너무 많아 서로를 긁어내고 있는 쟁재·숙살의 기운이 극에 달합니다.',
        cafeResult: 'Final[수] = 74.0점 🏆 만장일치 WINNER — 심층 센서(水)가 핵심 드라이브',
        primaryDrive: '🔮 심층 센서 (Deep Sensor, 水)',
        confidence: '98%',
        outputCode: 'N-DEEP-SYNC',
        phase1: {
            title: '辛巳 일주 4D 뇌지도 (4D Full Neural Blueprint)',
            inner: '자신을 끊임없이 연마하여 빛나게 하려는 강력한 추진력과 내면의 뜨거운 열망(巳火)이 공존하는 상태입니다.',
            env: '경쟁이 치열하고 결과주의적인 환경에 노출되어 있습니다. 거대한 금속의 덩어리들이 부딪히는 소음 속에서 고요를 찾아야 합니다.',
            social: '타인의 시선과 사회적 기준이 메마른 대지(未土)처럼 당신의 갈증을 유발합니다. 창의적 표현(癸水)이 메마르기 쉬운 구조입니다.',
            future: '최종적인 결실은 유연함(乙木)에서 옵니다. 고집스러운 강직함보다 부드러운 수용성이 부를 창출하는 핵심 키가 됩니다.',
            synthesis: '당신의 시스템은 고성능 엔진과 취약한 냉각 장치를 동시에 탑재하고 있습니다. 뛰어난 지적 능력과 섬세한 감각을 지녔으나, 이를 출력할 때 발생하는 열기(스트레스)를 해소할 배출구가 부족합니다. 자기 검열이 너무 강해지면 보석은 빛을 잃고 날카로운 파편이 되어 자신을 찌르게 됩니다.',
        },
        darkCode: {
            id: 'D-WATER-OVERFLOW',
            tag: '방열판 고장',
            symptoms: [
                '완벽하지 않으면 시작조차 하지 않으려는 마비성 완벽주의',
                '타인의 사소한 비판에도 영혼이 베이는 듯한 극심한 감정적 마모',
                '에너지가 고갈되었음에도 멈추지 못하고 자신을 채찍질하는 강박적 번아웃',
            ],
        },
        neuralPrompts: [
            { id: '01', label: 'SOCRATES PROMPT', q: '"내가 지금 느끼는 이 완벽에 대한 압박은 나의 생존을 돕고 있는가, 아니면 나의 통치권을 침해하고 있는가?"' },
            { id: '02', label: 'RECURSIVE PROMPT', q: '"오늘 내가 한 실수 중 1년 뒤에도 기억날 것이 하나라도 있는가? 없다면 왜 지금 나를 처벌하고 있는가?"' },
            { id: '03', label: 'META-COGNITION PROMPT', q: '"나는 지금 보석으로서 빛나고 싶은 것인가, 아니면 그저 부서지지 않으려고 경직되어 있는 것인가?"' },
        ],
        steps: [
            { label: 'STEP 01: 코어 안정화 (CBT)', desc: '흑백 논리의 인지적 오류를 탐지하십시오. 세상은 100점 아니면 0점이 아닙니다. 중간 지대의 회색조를 수용할 때 당신의 예리함은 비로소 전략적 무기가 됩니다.' },
            { label: 'STEP 02: 장갑 해제 (ACT)', desc: '당신의 생각과 당신 자신을 분리하십시오. "나는 무능하다"가 아니라 "나는 무능하다는 생각을 하고 있다"라고 객관화하십시오. 당신은 그 생각을 관찰하는 하늘이지, 지나가는 먹구름이 아닙니다.' },
            { label: 'STEP 03: 대류 현상 (DBT)', desc: '감정의 파도를 억누르지 말고 타십시오. 임수(壬水)의 에너지는 흐름입니다. 일주일에 한 번, 목적 없는 창작이나 몰입을 통해 감정의 배출구를 강제로 개방하십시오.' },
            { label: 'STEP 04: 결실 (MBCT)', desc: '현재에 머무는 감각을 회복하십시오. 미래의 불안과 과거의 후회라는 금속성 소음을 끄고, 지금 이 순간 당신의 손끝에 닿는 감각에 집중할 때 진정한 주권자의 결실(乙木)이 맺힙니다.' },
        ],
        metaSelf: '이제 당신은 더 이상 타인에 의해 제련되는 원석이 아닙니다. 스스로의 광채를 조절할 줄 아는 완성된 보석이자, 깊은 지혜의 바다를 품은 군주입니다. 예리함은 통찰로 변모했고, 강박은 우아함으로 승화되었습니다. 당신의 진화는 이제부터가 시작입니다.',
        finalQuote: '"夏月辛金, 壬水為尊"',
        finalQuoteKo: '여름의 신금은 반드시 맑은 물로 세척해야 보석처럼 빛난다.',
        closingMessage: '당신의 뜨거운 여름날을 식혀줄 임수(壬水)의 지혜를 잊지 마십시오. 부족함을 채우려 애쓰기보다, 이미 넘치는 것을 흘려보낼 때 당신의 명식은 비로소 완성됩니다. 옥죄던 긴장의 끈을 15%만 풀어내십시오.',
    },
    '甲': {
        ilganLabel: '甲木(갑목, 양목) — 곧게 뻗는 대나무·선구자',
        identity: '하늘을 향해 꺾이지 않고 자라는 직목(直木). 개척과 리더십의 선구자적 에너지를 지닌 주권자입니다.',
        coreIssue: '木이 강하면 뿌리가 대지를 뒤흔들고, 약하면 방향을 잃습니다. 화(火)를 통해 에너지를 설기해야 빛납니다.',
        cafeResult: 'Final[화] = 71.0점 🏆 — 발산·표현(火) 에너지가 핵심 드라이브',
        primaryDrive: '🔥 표현 발전기 (Expression Engine, 火)',
        confidence: '95%',
        outputCode: 'N-EXPRESS-PRIME',
        phase1: {
            title: '甲木 일간 4D 뇌지도',
            inner: '강한 추진력과 독립 의지. 타협하지 않으려는 원칙주의가 내면 깊이 자리합니다.',
            env: '치열한 경쟁 속에서도 홀로 길을 개척하는 선구자형. 조직보다 자신의 가치를 앞세웁니다.',
            social: '타인을 이끌기를 원하지만, 종종 독단적으로 보여 갈등이 생깁니다. 관계의 유연성이 핵심 과제입니다.',
            future: '결국 당신의 나무가 열매를 맺으려면 수분(水)의 흐름이 필요합니다. 공감과 경청이 성공의 토양이 됩니다.',
            synthesis: '강한 추진력은 당신의 최대 자산이지만, 때로는 멈추고 주변의 목소리를 들을 때 비로소 진정한 리더십이 완성됩니다.',
        },
        darkCode: {
            id: 'D-ROOT-LOCK',
            tag: '독단 과부하',
            symptoms: [
                '내 방식대로만 하려는 강한 고집',
                '빠른 결정으로 인한 관계 균열',
                '인정받지 못할 때 폭발하는 자존심',
            ],
        },
        neuralPrompts: [
            { id: '01', label: 'SOCRATES PROMPT', q: '"나의 이 확신은 진실에서 나온 것인가, 아니면 두려움에서 나온 방어막인가?"' },
            { id: '02', label: 'RECURSIVE PROMPT', q: '"내가 고집하는 이 방식이 5년 뒤의 나를 위한 것인가, 아니면 지금의 자존심을 위한 것인가?"' },
            { id: '03', label: 'META-COGNITION PROMPT', q: '"나는 지금 이끌고 있는가, 아니면 밀어붙이고 있는가?"' },
        ],
        steps: [
            { label: 'STEP 01: 속도 조절 (CBT)', desc: '빠른 결정의 인지적 오류를 점검하십시오. 3초를 멈추고 상대의 관점을 먼저 물어보는 습관이 당신의 리더십을 완성합니다.' },
            { label: 'STEP 02: 유연성 훈련 (ACT)', desc: '"내 방식만이 맞다"는 생각에서 분리하십시오. 다양한 방법이 같은 목적지에 도달할 수 있습니다.' },
            { label: 'STEP 03: 공감 채널 개방 (DBT)', desc: '상대의 말이 끝나기 전에 반박하지 마십시오. 완전히 듣고 나서 말할 때, 당신의 말은 더욱 강력해집니다.' },
            { label: 'STEP 04: 협력의 열매 (MBCT)', desc: '혼자가 아닌 함께 이룬 성공을 경험할 때 甲木은 비로소 숲을 이룹니다. 오늘 누군가의 공을 인정해 주십시오.' },
        ],
        metaSelf: '홀로 곧게 선 나무에서 무성한 숲을 이루는 존재로 진화했습니다. 당신의 개척 정신은 이제 더 많은 이들을 품는 포용의 힘이 되었습니다.',
        finalQuote: '"木需水土以培其根"',
        finalQuoteKo: '나무는 물과 흙이 있어야 뿌리를 키울 수 있다.',
        closingMessage: '당신의 직선적인 에너지가 세상을 개척합니다. 단, 뿌리를 적셔줄 물(水)의 공감과 토대를 굳혀줄 흙(土)의 신뢰를 함께 키우십시오.',
    },
    '乙': {
        ilganLabel: '乙木(을목, 음목) — 부드러운 넝쿨·유연한 생존자',
        identity: '어떤 환경에서도 꿋꿋이 살아남는 넝쿨. 부드럽지만 어떤 강자도 감고 올라가는 무서운 생명력의 주권자입니다.',
        coreIssue: '木이 유연하지만 지지대가 없으면 방향을 잃습니다. 명확한 가치관(土)이 당신을 올바른 곳으로 이끕니다.',
        cafeResult: 'Final[화] = 68.0점 🏆 — 창의적 표현(火)이 핵심 에너지',
        primaryDrive: '🌿 창의 연결자 (Creative Connector, 火)',
        confidence: '92%',
        outputCode: 'N-ADAPT-BLOOM',
        phase1: {
            title: '乙木 일간 4D 뇌지도',
            inner: '섬세한 감수성과 뛰어난 적응력. 상대의 마음을 읽는 고감도 센서가 내재되어 있습니다.',
            env: '다양한 환경에서 생존하는 카멜레온 같은 적응력. 그러나 정작 자신의 색을 잃을 위험이 있습니다.',
            social: '타인을 위해 자신을 맞추다가 스스로를 잃는 패턴. 경계선 설정이 핵심 과제입니다.',
            future: '당신의 창의적 재능이 꽃을 피울 때 재성(財)의 결실이 옵니다. 자신의 독창성을 신뢰하십시오.',
            synthesis: '유연함은 당신의 초능력이지만, 때로는 자신만의 본색을 지키는 용기가 필요합니다. 틀을 벗어난 창의성이 당신의 진정한 강점입니다.',
        },
        darkCode: {
            id: 'D-IDENTITY-BLUR',
            tag: '자아 희석 경보',
            symptoms: [
                '지나친 타인 중심적 사고로 자신의 욕구를 억압',
                '결정을 내리지 못하는 만성적 우유부단',
                '인정받고자 하는 과도한 욕구',
            ],
        },
        neuralPrompts: [
            { id: '01', label: 'SOCRATES PROMPT', q: '"지금 내가 상대에게 맞추는 것은 진정한 배려인가, 아니면 거절당할 두려움인가?"' },
            { id: '02', label: 'RECURSIVE PROMPT', q: '"나는 지금 누구를 위해 이 결정을 내리고 있는가? 정말 나를 위한 것이기는 한가?"' },
            { id: '03', label: 'META-COGNITION PROMPT', q: '"나의 진짜 본색은 무엇인가? 아무도 보지 않는다면 나는 어떤 선택을 할 것인가?"' },
        ],
        steps: [
            { label: 'STEP 01: 경계선 세우기 (CBT)', desc: '"괜찮아요"라고 말하기 전에 정말 괜찮은지 확인하십시오. No라고 말하는 연습이 당신을 지킵니다.' },
            { label: 'STEP 02: 자기 인식 훈련 (ACT)', desc: '"나는 ___가 필요하다"는 문장을 매일 하나씩 완성해 보십시오. 당신의 욕구에 이름을 붙이는 것이 첫 걸음입니다.' },
            { label: 'STEP 03: 창의성 발현 (DBT)', desc: '규칙을 벗어난 창의적 표현 활동을 주 2회 이상 하십시오. 그림, 글쓰기, 요리 등 결과물에 집착하지 않는 순수한 창작.' },
            { label: 'STEP 04: 독창성 신뢰 (MBCT)', desc: '당신의 독특한 관점이 세상에 필요한 이유를 매일 상기하십시오. 틀에서 벗어난 것이 당신의 가치입니다.' },
        ],
        metaSelf: '타인을 위한 유연함에서 자신을 위한 유연함으로 진화했습니다. 이제 당신은 어디서든 꽃을 피우는 강인한 생명력의 소유자입니다.',
        finalQuote: '"柔弱者生之徒"',
        finalQuoteKo: '부드럽고 약한 것이 생명의 무리에 속한다 (노자).',
        closingMessage: '당신의 유연함은 세상에서 가장 강한 힘입니다. 단, 그 유연함이 자신의 중심 위에서 발휘될 때만 진정한 아름다움이 드러납니다.',
    },

    // ──────────────────────────────────────────────────────
    // 丙 — 태양·열정의 군주
    // ──────────────────────────────────────────────────────
    '丙': {
        ilganLabel: '丙火(병화, 양화) — 타오르는 태양·열정의 군주',
        identity: '온 세상을 밝히는 태양의 기운. 숨기지 않고 전부를 내어주는 강렬한 존재감과 카리스마로 주변을 압도하는 주권자입니다.',
        coreIssue: '火가 과하면 만물을 태우고, 부족하면 세상이 어두워집니다. 수(水)의 절제가 없으면 에너지가 산산이 흩어져 번아웃으로 이어집니다.',
        cafeResult: 'Final[수] = 72.0점 🏆 — 절제·성찰(水) 에너지가 핵심 균형 드라이브',
        primaryDrive: '🌊 절제 항법사 (Balance Navigator, 水)',
        confidence: '94%',
        outputCode: 'N-SOLAR-COOL',
        phase1: {
            title: '丙火 일간 4D 뇌지도',
            inner: '뜨거운 열정과 압도적인 존재감. 무대 위에서 빛나도록 설계된 천부적 리더입니다.',
            env: '당신의 빛이 너무 강하면 주변 사람들이 눈을 감습니다. 때로는 밝기를 낮추는 지혜가 더 큰 영향력을 만듭니다.',
            social: '관심과 사랑을 받을 때 최고 성과를 내지만, 무시당한다고 느끼면 감정 폭발이 일어납니다. 안정적 인정 체계 구축이 핵심입니다.',
            future: '장기적 성공은 꾸준함(土)과 지혜(水)로 완성됩니다. 순간적인 화려함보다 지속 가능한 빛을 만드는 것이 목표입니다.',
            synthesis: '당신은 세상을 밝히는 별입니다. 그러나 태양도 지는 시간이 있어야 다시 뜰 수 있습니다. 쉬는 것도 당신의 파워입니다.',
        },
        darkCode: {
            id: 'D-SOLAR-BURNOUT',
            tag: '과열 방전',
            symptoms: [
                '인정받지 못하면 존재 자체가 부정당하는 듯한 감각',
                '모든 에너지를 쏟아붓다가 갑자기 무너지는 번아웃 사이클',
                '자기 자신이 주목의 중심이 되지 못할 때 느끼는 강한 공허감',
            ],
        },
        neuralPrompts: [
            { id: '01', label: 'SOCRATES PROMPT', q: '"내가 지금 빛나고 싶은 것인가, 아니면 어둠이 두려워 멈추지 못하는 것인가?"' },
            { id: '02', label: 'RECURSIVE PROMPT', q: '"나는 에너지가 100%일 때만 가치 있는 사람인가? 40%의 나는 사랑받을 자격이 없는가?"' },
            { id: '03', label: 'META-COGNITION PROMPT', q: '"태양은 스스로 빛나기 위해 애쓰지 않는다. 나는 지금 빛나고 있는가, 아니면 빛나려고 애쓰고 있는가?"' },
        ],
        steps: [
            { label: 'STEP 01: 에너지 예산 관리 (CBT)', desc: '하루 에너지를 100으로 보고, 각 활동에 숫자를 할당하십시오. 총합이 80을 넘으면 다음 날을 위해 20을 저축하는 습관을 만드십시오.' },
            { label: 'STEP 02: 조명 조절 훈련 (ACT)', desc: '"나는 항상 빛나야 한다"는 생각에서 분리하십시오. 당신의 가치는 존재 자체에 있지, 성과의 화려함에 있지 않습니다.' },
            { label: 'STEP 03: 감정 온도계 (DBT)', desc: '분노나 흥분이 8/10 이상일 때는 즉각적 반응을 하지 마십시오. 15분을 기다리면 火의 온도가 내려가고 智慧가 올라옵니다.' },
            { label: 'STEP 04: 고요 속 충전 (MBCT)', desc: '하루 10분, 완전한 어둠 속에서 호흡하십시오. 태양은 밤에 에너지를 모읍니다. 당신의 쉼이 곧 다음 날의 빛입니다.' },
        ],
        metaSelf: '세상을 태울 듯한 불꽃에서 세상을 따뜻하게 감싸는 햇살로 진화했습니다. 이제 당신의 빛은 눈부시지 않고, 포근하게 스며듭니다.',
        finalQuote: '"日中則昃, 月盈則食"',
        finalQuoteKo: '해가 중천에 이르면 기울고, 달이 차면 이지러진다 (주역). 절정의 순간에 물러설 줄 아는 지혜가 당신을 영원하게 합니다.',
        closingMessage: '당신의 열정은 세상에서 가장 강력한 에너지입니다. 단, 그 불꽃을 가장 중요한 것에만 집중할 때 당신은 진정한 태양이 됩니다.',
    },

    // ──────────────────────────────────────────────────────
    // 丁 — 촛불·심리 치료사
    // ──────────────────────────────────────────────────────
    '丁': {
        ilganLabel: '丁火(정화, 음화) — 꺼지지 않는 촛불·심리 치료사',
        identity: '어두운 곳에서 조용히 타오르는 촛불. 화려하지 않지만 가장 필요한 순간에 빛을 주는 섬세한 감성의 주권자입니다.',
        coreIssue: '丁火는 외부의 강한 바람에 쉽게 흔들립니다. 내면의 중심(甲木)이 없으면 지나친 타인 의존과 감정 기복으로 소진됩니다.',
        cafeResult: 'Final[목] = 69.0점 🏆 — 내면 성장(木)이 핵심 에너지 공급원',
        primaryDrive: '🕯️ 내면 조명자 (Inner Illuminator, 木)',
        confidence: '91%',
        outputCode: 'N-CANDLE-GROW',
        phase1: {
            title: '丁火 일간 4D 뇌지도',
            inner: '예민한 감수성과 높은 공감 능력. 상대의 감정을 본능적으로 읽어내는 심리 치료사형 내면 구조입니다.',
            env: '타인의 에너지를 흡수하기 쉬운 구조. 부정적인 환경에서는 촛불이 꺼지듯 급격히 소진됩니다.',
            social: '깊은 1:1 관계에서 최고 역량이 발휘됩니다. 대규모 사교 활동보다 의미 있는 소수와의 연결이 필요합니다.',
            future: '꾸준한 자기 성장(木)이 쌓일 때, 당신의 빛은 영원히 꺼지지 않는 불꽃이 됩니다.',
            synthesis: '당신의 섬세함은 세상이 필요로 하는 치유의 빛입니다. 그러나 타인을 밝히기 전에 먼저 자신의 심지를 튼튼히 해야 합니다.',
        },
        darkCode: {
            id: 'D-WICK-BURNDOWN',
            tag: '심지 소진 경보',
            symptoms: [
                '타인의 감정에 과도하게 동화되어 자신의 경계를 잃는 감정 융합',
                '사소한 말 한 마디에도 깊이 상처받고 오래 기억하는 과민 반응',
                '혼자만의 시간 없이 지속되는 인간관계로 인한 만성 피로',
            ],
        },
        neuralPrompts: [
            { id: '01', label: 'SOCRATES PROMPT', q: '"나는 지금 상대를 위해 빛나고 있는가, 아니면 무서워서 꺼지지 못하고 있는가?"' },
            { id: '02', label: 'RECURSIVE PROMPT', q: '"내가 이 사람의 감정을 나의 것처럼 느끼는 것이 공감인가, 아니면 자기 경계의 붕괴인가?"' },
            { id: '03', label: 'META-COGNITION PROMPT', q: '"촛불이 자신을 태워 남을 밝힌다. 나는 언제까지 타오를 수 있는가?"' },
        ],
        steps: [
            { label: 'STEP 01: 감정 경계선 (CBT)', desc: '상대의 감정이 나의 감정인지 확인하는 습관을 만드십시오. "이것은 내 감정인가, 아니면 상대에게서 흡수한 것인가?"라고 매일 물으십시오.' },
            { label: 'STEP 02: 자기 돌봄 의식 (ACT)', desc: '하루 30분은 철저히 나만을 위한 시간으로 확보하십시오. 이것은 이기적인 것이 아니라 심지를 충전하는 필수 행위입니다.' },
            { label: 'STEP 03: 감정 일지 (DBT)', desc: '오늘 가장 강하게 느낀 감정 3가지와 그 원인을 기록하십시오. 감정을 글로 쓰면 촛불의 흔들림이 안정됩니다.' },
            { label: 'STEP 04: 내면 성장 루틴 (MBCT)', desc: '매일 10분, 뿌리를 키우는 독서나 학습을 하십시오. 甲木이 튼튼할수록 丁火는 더 밝고 오래 타오릅니다.' },
        ],
        metaSelf: '타인을 위해 소비되던 빛에서 스스로 충전하고 나누는 영원한 불꽃으로 진화했습니다. 당신의 촛불은 이제 자신도 따뜻하게 합니다.',
        finalQuote: '"燈燃己身, 照諸黯冥"',
        finalQuoteKo: '등불은 자신을 태워 모든 어둠을 밝힌다. 단, 심지가 충분해야 오래 탈 수 있다.',
        closingMessage: '당신의 섬세한 빛은 세상에서 가장 따뜻한 에너지입니다. 먼저 자신을 충전하십시오. 가득 찬 촛불이 더 오래, 더 밝게 타오릅니다.',
    },

    // ──────────────────────────────────────────────────────
    // 戊 — 대산·포용자
    // ──────────────────────────────────────────────────────
    '戊': {
        ilganLabel: '戊土(무토, 양토) — 흔들리지 않는 대산·포용자',
        identity: '거대한 산처럼 움직이지 않는 안정감과 포용력. 모든 것을 품되 결코 무너지지 않는 대지의 주권자입니다.',
        coreIssue: '土가 너무 두터우면 물이 스며들지 못하고 나무도 자라지 못합니다. 지나친 고집과 변화 거부가 성장을 막는 핵심 리스크입니다.',
        cafeResult: 'Final[목] = 67.0점 🏆 — 변화·성장(木) 에너지가 핵심 활성 드라이브',
        primaryDrive: '🌱 성장 촉진제 (Growth Catalyst, 木)',
        confidence: '90%',
        outputCode: 'N-MOUNTAIN-GROW',
        phase1: {
            title: '戊土 일간 4D 뇌지도',
            inner: '흔들리지 않는 중심과 신뢰감. 위기 상황에서 오히려 빛을 발하는 진정한 안정의 기둥입니다.',
            env: '변화가 빠른 환경에서 적응이 느리지만, 한 번 자리를 잡으면 누구보다 강한 기반을 만듭니다.',
            social: '깊고 오래된 신뢰 관계를 선호합니다. 새로운 변화보다 검증된 방식을 선택하는 경향이 갈등을 만들기도 합니다.',
            future: '변화를 수용할 때(木) 당신의 산은 더욱 풍요로워집니다. 새로운 씨앗을 받아들이는 넉넉한 흙이 되십시오.',
            synthesis: '당신은 위기에서 모두가 기대는 산입니다. 그러나 산도 계절에 따라 변화합니다. 유연성을 더하면 당신은 더욱 위대해집니다.',
        },
        darkCode: {
            id: 'D-BEDROCK-LOCK',
            tag: '변화 거부 과부하',
            symptoms: [
                '새로운 방식에 대한 강한 저항과 "원래 이렇게 했는데"의 고집',
                '자신의 페이스와 다른 사람들에 대한 답답함과 비판',
                '변화에 대한 불안이 무기력이나 과식 등 신체 증상으로 나타남',
            ],
        },
        neuralPrompts: [
            { id: '01', label: 'SOCRATES PROMPT', q: '"내가 이 방식을 고수하는 것은 정말 최선이기 때문인가, 아니면 변화가 두렵기 때문인가?"' },
            { id: '02', label: 'RECURSIVE PROMPT', q: '"지금 내가 거부하고 있는 이 변화가 5년 뒤에는 어떻게 보일 것인가?"' },
            { id: '03', label: 'META-COGNITION PROMPT', q: '"산이 바람에 흔들리지 않는 것은 강함인가, 아니면 뿌리가 있기 때문인가? 나의 뿌리는 무엇인가?"' },
        ],
        steps: [
            { label: 'STEP 01: 변화 실험 (CBT)', desc: '매주 한 가지, 작고 안전한 새로운 것을 시도하십시오. 작은 성공들이 쌓이면 변화가 위협이 아닌 성장임을 뇌가 학습합니다.' },
            { label: 'STEP 02: 유연성 훈련 (ACT)', desc: '"이것만이 옳다"는 확신에서 잠시 내려오십시오. 여러 관점을 호기심으로 탐색하는 것이 산을 더 풍요롭게 합니다.' },
            { label: 'STEP 03: 감정 흐름 허용 (DBT)', desc: '감정을 즉각 해결하려 하지 마십시오. 대산이 강을 품듯, 감정의 흐름을 판단 없이 바라보는 연습을 하십시오.' },
            { label: 'STEP 04: 소통 빈도 높이기 (MBCT)', desc: '신뢰하는 한 사람과 주 1회, 내면의 이야기를 나누십시오. 말하지 않으면 산 속의 보물을 아무도 모릅니다.' },
        ],
        metaSelf: '변화를 두려워하던 거대한 바위산에서 모든 씨앗을 품는 풍요로운 대지로 진화했습니다. 당신의 안정감은 이제 성장의 토대가 됩니다.',
        finalQuote: '"厚德載物"',
        finalQuoteKo: '두터운 덕은 만물을 실어 나른다 (주역 곤괘). 당신의 포용이 세상의 기반이 됩니다.',
        closingMessage: '당신의 안정감은 세상이 가장 필요로 하는 선물입니다. 그 탄탄한 기반 위에 변화의 씨앗 하나를 심어보십시오.',
    },

    // ──────────────────────────────────────────────────────
    // 己 — 텃밭·섬세한 조율자
    // ──────────────────────────────────────────────────────
    '己': {
        ilganLabel: '己土(기토, 음토) — 풍요로운 텃밭·섬세한 조율자',
        identity: '척박한 곳에서도 생명을 키워내는 부드러운 흙. 조용하지만 모든 관계를 연결하고 조율하는 숨은 주권자입니다.',
        coreIssue: '己土는 물이 많으면 진흙이 되고, 목이 자라면 뿌리에 침식됩니다. 자신의 경계 없이 타인에게 소비되는 구조가 핵심 위험입니다.',
        cafeResult: 'Final[화] = 70.0점 🏆 — 에너지 충전(火) 드라이브가 핵심',
        primaryDrive: '🌻 에너지 충전소 (Energy Charger, 火)',
        confidence: '93%',
        outputCode: 'N-FIELD-WARM',
        phase1: {
            title: '己土 일간 4D 뇌지도',
            inner: '세심하고 꼼꼼한 배려. 모든 이의 필요를 미리 파악하고 조용히 채워주는 천부적 조율자입니다.',
            env: '뒤에서 조용히 모든 것을 유지하다 보면, 정작 자신의 공로는 인정받지 못하는 구조에 놓이기 쉽습니다.',
            social: '모든 관계의 중간에서 다리 역할을 합니다. 그러나 특정 편을 들지 못하는 스트레스가 지속될 수 있습니다.',
            future: '자신의 풍요로운 재능에 火의 열정이 더해질 때, 당신의 텃밭은 세상을 먹이는 농장이 됩니다.',
            synthesis: '당신은 보이지 않는 곳에서 세상을 유지하는 핵심 시스템입니다. 이제 그 시스템이 스스로를 먼저 돌보는 법을 배울 때입니다.',
        },
        darkCode: {
            id: 'D-SOIL-DEPLETION',
            tag: '양분 고갈 경보',
            symptoms: [
                '모든 사람을 만족시키려다 정작 자신의 욕구는 뒷전으로 미루는 패턴',
                '공로를 인정받지 못할 때 조용히 쌓이는 억울함과 서운함',
                '결정을 내리지 못하고 상황이 해결되기를 기다리는 소극성',
            ],
        },
        neuralPrompts: [
            { id: '01', label: 'SOCRATES PROMPT', q: '"나는 지금 모두를 행복하게 하려는 것인가, 아니면 누군가를 불행하게 할까봐 두려운 것인가?"' },
            { id: '02', label: 'RECURSIVE PROMPT', q: '"내가 보이지 않는 곳에서 한 모든 일들, 나는 그것들에 충분히 감사하고 있는가?"' },
            { id: '03', label: 'META-COGNITION PROMPT', q: '"텃밭이 자신을 먼저 비옥하게 해야 좋은 작물을 키울 수 있다. 나는 언제 마지막으로 나를 먼저 돌봤는가?"' },
        ],
        steps: [
            { label: 'STEP 01: 자기 인정 (CBT)', desc: '오늘 내가 한 일 3가지를 스스로 칭찬하십시오. 남이 알아주지 않아도 당신의 기여는 실재합니다. 먼저 스스로 인정하십시오.' },
            { label: 'STEP 02: "나는 중요하다" 훈련 (ACT)', desc: '"나의 필요는 남의 필요만큼 중요하다"는 문장을 매일 아침 읽으십시오. 믿기 어려워도 괜찮습니다. 반복이 믿음을 만듭니다.' },
            { label: 'STEP 03: 욕구 표현 연습 (DBT)', desc: '오늘 한 가지, 원하는 것을 직접 말로 요청하십시오. "해주면 좋겠어"가 아닌 "나는 이것이 필요해"라고 말하십시오.' },
            { label: 'STEP 04: 충전 의식 (MBCT)', desc: '일주일에 한 번, 완전히 자신만을 위한 활동을 계획하고 실행하십시오. 텃밭도 쉬어야 다음 계절에 더 풍요롭습니다.' },
        ],
        metaSelf: '남을 위해 소비되던 흙에서 스스로 비옥함을 유지하는 풍요로운 대지로 진화했습니다. 이제 당신의 텃밭은 자신도 먹이고 세상도 먹입니다.',
        finalQuote: '"地勢坤, 君子以厚德載物"',
        finalQuoteKo: '대지의 형세는 유순하니, 군자는 이로써 두터운 덕으로 만물을 싣는다 (주역 곤괘).',
        closingMessage: '당신의 조용한 헌신이 세상을 유지합니다. 이제 그 헌신의 10%만 자신에게 돌리십시오. 텃밭의 주인도 배가 불러야 합니다.',
    },

    // ──────────────────────────────────────────────────────
    // 庚 — 강철·전사
    // ──────────────────────────────────────────────────────
    '庚': {
        ilganLabel: '庚金(경금, 양금) — 난공불락의 강철·전사',
        identity: '압도적인 의지력과 불굴의 독립심. 어떤 역경에도 꺾이지 않는 강철 같은 주권자입니다.',
        coreIssue: '庚金은 火의 담금질 없이는 날카롭지 못하고, 水의 설기 없이는 과강(過剛)의 위험이 있습니다. 극복만 있고 유연성이 없으면 부러집니다.',
        cafeResult: 'Final[수] = 73.0점 🏆 — 유연한 지혜(水) 설기가 핵심 드라이브',
        primaryDrive: '💧 유연 전략가 (Flexible Strategist, 水)',
        confidence: '96%',
        outputCode: 'N-STEEL-FLOW',
        phase1: {
            title: '庚金 일간 4D 뇌지도',
            inner: '강한 의지와 냉철한 판단력. 감정보다 원칙을 중시하는 전략가형 내면 구조입니다.',
            env: '치열한 경쟁 환경에서 빛나며, 위기에서 오히려 정신이 맑아지는 역경 내성이 탁월합니다.',
            social: '너무 직설적이고 타협을 모르는 모습이 타인에게 차갑게 느껴질 수 있습니다. 온도를 조절하는 것이 핵심 과제입니다.',
            future: '지략과 지혜(水)가 당신의 강철에 더해질 때, 당신은 세상에서 가장 날카롭고 유연한 검이 됩니다.',
            synthesis: '당신은 최전선에 설 수 있는 전사입니다. 그러나 전쟁에서 이기는 것은 힘만이 아닙니다. 외교와 유연성이 더해질 때 비로소 통수권자가 됩니다.',
        },
        darkCode: {
            id: 'D-IRON-RIGID',
            tag: '강성 과부하',
            symptoms: [
                '타협을 패배로 인식하는 흑백 논리의 강박',
                '타인의 약점에 대한 낮은 관용과 냉소적 시선',
                '극도의 자기 규율로 인한 심리적 경직과 휴식 불능',
            ],
        },
        neuralPrompts: [
            { id: '01', label: 'SOCRATES PROMPT', q: '"나는 지금 강한 것인가, 아니면 굽히는 것이 두려워 경직된 것인가?"' },
            { id: '02', label: 'RECURSIVE PROMPT', q: '"내가 이 싸움에서 이긴다면 무엇을 얻는가? 지는 것이 더 현명한 선택일 때는 없는가?"' },
            { id: '03', label: 'META-COGNITION PROMPT', q: '"강철은 불에 의해 단련된다. 나를 단련시키는 이 도전을 나는 어떻게 바라보고 있는가?"' },
        ],
        steps: [
            { label: 'STEP 01: 온도 조절 (CBT)', desc: '"이것은 치명적인가, 아니면 불편한 것인가?"를 먼저 구분하십시오. 대부분의 갈등은 치명적이지 않습니다. 반응의 크기를 상황에 맞추십시오.' },
            { label: 'STEP 02: 전략적 후퇴 훈련 (ACT)', desc: '오늘 한 가지 작은 타협을 의도적으로 선택하십시오. 이것은 패배가 아니라 더 큰 전쟁을 위한 에너지 비축입니다.' },
            { label: 'STEP 03: 공감 근육 키우기 (DBT)', desc: '상대의 입장을 2분간 완전히 대변해 보는 연습을 하십시오. 적을 이해하는 것이 가장 강력한 전략입니다.' },
            { label: 'STEP 04: 휴전 의식 (MBCT)', desc: '매일 밤 10분, 아무것도 하지 않는 시간을 강제로 만드십시오. 전사도 쉬어야 더 강해집니다.' },
        ],
        metaSelf: '부러지지 않기 위해 경직되었던 강철에서 흐를 줄 아는 유연한 검으로 진화했습니다. 이제 당신의 강함은 부드러움으로 완성됩니다.',
        finalQuote: '"天下莫柔弱於水, 而攻堅強者莫之能勝"',
        finalQuoteKo: '세상에 물보다 부드러운 것은 없지만, 단단한 것을 공격하는 데 물보다 나은 것도 없다 (노자). 강함의 완성은 유연함입니다.',
        closingMessage: '당신의 불굴의 의지는 세상에서 가장 강한 에너지입니다. 이제 그 힘에 물의 지혜를 더하십시오. 강철과 물이 만날 때 최강의 검이 완성됩니다.',
    },

    // ──────────────────────────────────────────────────────
    // 壬 — 대해·전략가
    // ──────────────────────────────────────────────────────
    '壬': {
        ilganLabel: '壬水(임수, 양수) — 광활한 대해·전략의 군주',
        identity: '모든 것을 담는 바다. 깊고 광활한 통찰력과 유연한 전략으로 세상의 흐름을 읽는 주권자입니다.',
        coreIssue: '水가 지나치면 범람하여 모든 것을 삼키고, 부족하면 방향을 잃습니다. 木의 배출 채널이 없으면 생각이 감정을 압도하여 행동 마비가 일어납니다.',
        cafeResult: 'Final[목] = 75.0점 🏆 — 표현·실행(木) 에너지가 핵심 돌파 드라이브',
        primaryDrive: '🌊→🌿 실행 항법사 (Action Navigator, 木)',
        confidence: '97%',
        outputCode: 'N-OCEAN-ACT',
        phase1: {
            title: '壬水 일간 4D 뇌지도',
            inner: '끊임없이 흐르는 분석적 사고와 전략적 직관. 아무도 보지 못하는 패턴을 읽어내는 마스터마인드입니다.',
            env: '변화무쌍한 환경에서 오히려 빛을 발합니다. 고정된 구조보다 자유롭게 흐를 수 있는 환경이 최고의 성과를 냅니다.',
            social: '깊이 있는 대화를 선호하며, 피상적 관계에서 쉽게 지루함을 느낍니다. 소수의 깊은 연결이 필요합니다.',
            future: '생각을 행동으로 실행할 때(木) 당신의 전략은 비로소 지도가 됩니다. 머릿속에만 있는 바다는 세상을 적시지 못합니다.',
            synthesis: '당신은 세상에서 가장 깊은 사고를 하는 존재입니다. 그 깊이만큼의 행동이 따라올 때 당신은 역사를 바꿉니다.',
        },
        darkCode: {
            id: 'D-DEEP-OVERFLOW',
            tag: '사고 범람 경보',
            symptoms: [
                '너무 많은 가능성을 분석하다가 아무것도 시작하지 못하는 결정 마비',
                '타인이 자신의 깊이를 이해하지 못한다는 만성적 고독감',
                '감정보다 논리를 앞세우다가 정작 내면의 욕구를 무시하는 패턴',
            ],
        },
        neuralPrompts: [
            { id: '01', label: 'SOCRATES PROMPT', q: '"나는 지금 분석하고 있는가, 아니면 시작하는 것이 두려워 분석을 핑계로 삼고 있는가?"' },
            { id: '02', label: 'RECURSIVE PROMPT', q: '"완벽한 전략이 준비될 때까지 기다린다면, 나는 평생 기다려야 할 수도 있다. 지금 당장 할 수 있는 첫 걸음은 무엇인가?"' },
            { id: '03', label: 'META-COGNITION PROMPT', q: '"바다는 강을 통해 세상에 닿는다. 나의 강, 즉 나의 행동 채널은 무엇인가?"' },
        ],
        steps: [
            { label: 'STEP 01: 5초 실행 법칙 (CBT)', desc: '생각이 시작되면 5초 안에 첫 번째 행동을 하십시오. 뇌가 분석 모드로 전환되기 전에 몸이 먼저 움직여야 합니다.' },
            { label: 'STEP 02: "충분히 좋다" 기준 (ACT)', desc: '"완벽한 계획"보다 "충분히 좋은 계획 + 즉각 실행"이 더 강합니다. 80%의 준비가 되었다면 시작하십시오.' },
            { label: 'STEP 03: 감정 헤엄치기 (DBT)', desc: '논리로 묻어두었던 감정을 일주일에 한 번 꺼내어 바라보십시오. 바다가 출렁일 수 있어야 건강한 바다입니다.' },
            { label: 'STEP 04: 일일 행동 로그 (MBCT)', desc: '오늘 한 가지, 생각에서 행동으로 옮긴 것을 기록하십시오. 작은 실행의 누적이 당신의 대해를 지도로 만듭니다.' },
        ],
        metaSelf: '머릿속에만 가득했던 전략이 이제 세상을 바꾸는 실행으로 흘러나옵니다. 당신의 대해는 이제 강이 되어 세상을 적십니다.',
        finalQuote: '"上善若水, 水善利萬物而不爭"',
        finalQuoteKo: '최고의 선은 물과 같다. 물은 만물을 이롭게 하면서도 다투지 않는다 (노자). 당신의 지혜가 세상을 이롭게 합니다.',
        closingMessage: '당신의 깊은 통찰은 세상이 필요로 하는 가장 귀한 자원입니다. 이제 그 지혜를 세상으로 흘려보내십시오. 바다는 흘러야 바다입니다.',
    },

    // ──────────────────────────────────────────────────────
    // 癸 — 이슬·치유자
    // ──────────────────────────────────────────────────────
    '癸': {
        ilganLabel: '癸水(계수, 음수) — 생명을 살리는 이슬·치유자',
        identity: '메마른 대지에 생명을 주는 이슬비. 조용하지만 가장 깊은 곳까지 스며드는 섬세한 치유의 주권자입니다.',
        coreIssue: '癸水는 戊土에 막히면 흐르지 못하고 고입니다. 타인의 기대와 틀에 갇혀 자신의 흐름을 잃는 것이 핵심 위험입니다.',
        cafeResult: 'Final[목] = 66.0점 🏆 — 자기 표현(木) 에너지가 핵심 해방 드라이브',
        primaryDrive: '🌧️ 치유 해방자 (Healing Liberator, 木)',
        confidence: '89%',
        outputCode: 'N-DEW-FREE',
        phase1: {
            title: '癸水 일간 4D 뇌지도',
            inner: '극도로 예민한 공감 안테나. 말하지 않아도 상대의 마음 깊은 곳을 느끼는 천부적 치유자입니다.',
            env: '진심을 이해해주는 환경에서 최고 역량이 발휘됩니다. 차갑고 결과만 중시하는 환경에서는 심하게 소진됩니다.',
            social: '표면적 관계보다 영혼의 연결을 원합니다. 이해받지 못한다는 느낌이 깊은 고독감으로 이어질 수 있습니다.',
            future: '자신의 감성을 창의적으로 표현(木)할 때, 당신의 치유 에너지는 세상을 적시는 장마가 됩니다.',
            synthesis: '당신의 예민함은 저주가 아닌 초능력입니다. 그 감수성을 억누르지 말고 표현하십시오. 이슬은 흘러야 생명을 살립니다.',
        },
        darkCode: {
            id: 'D-DEW-TRAPPED',
            tag: '공감 소진 경보',
            symptoms: [
                '아무도 나의 진심을 이해하지 못한다는 만성적 고독감과 오해받는 느낌',
                '타인의 고통을 나의 것처럼 느끼다가 자신이 사라지는 감정 경계 붕괴',
                '표현하지 못한 감정들이 신체 증상(두통, 소화 장애 등)으로 나타남',
            ],
        },
        neuralPrompts: [
            { id: '01', label: 'SOCRATES PROMPT', q: '"내가 느끼는 이 깊은 외로움은 진짜인가, 아니면 나 자신과 연결되지 못해서 오는 것인가?"' },
            { id: '02', label: 'RECURSIVE PROMPT', q: '"나는 언제 마지막으로 온전히 나 자신으로 있었는가? 그때 어떤 느낌이었는가?"' },
            { id: '03', label: 'META-COGNITION PROMPT', q: '"이슬은 새벽에 가장 빛난다. 나를 가장 빛나게 하는 나만의 새벽은 무엇인가?"' },
        ],
        steps: [
            { label: 'STEP 01: 감정 언어 확장 (CBT)', desc: '"기분이 이상해"를 더 구체적인 감정 언어로 바꾸십시오. "서럽다", "억울하다", "허전하다"처럼 세분화할수록 치유가 빨라집니다.' },
            { label: 'STEP 02: 창의적 표현 채널 (ACT)', desc: '감정을 말이 아닌 다른 방식으로 표현하십시오. 그림, 음악, 글쓰기, 공예 등 당신만의 창의 채널을 찾아 주 3회 이상 사용하십시오.' },
            { label: 'STEP 03: 감정 경계선 설정 (DBT)', desc: '"지금 나는 이것을 감당할 여유가 없어"라고 말하는 연습을 하십시오. 이슬도 구름에 물이 있어야 내릴 수 있습니다.' },
            { label: 'STEP 04: 자기 공감 의식 (MBCT)', desc: '매일 잠들기 전, 오늘의 나에게 "수고했어"라고 말하십시오. 타인을 치유하기 전에, 먼저 자신을 치유하십시오.' },
        ],
        metaSelf: '타인의 상처에 흡수되던 이슬에서 자신을 충전하고 세상을 적시는 봄비로 진화했습니다. 당신의 치유는 이제 스스로도 치유합니다.',
        finalQuote: '"天下之至柔, 馳騁天下之至堅"',
        finalQuoteKo: '세상에서 가장 부드러운 것이 세상에서 가장 단단한 것을 뚫는다 (노자). 당신의 섬세함이 세상을 바꿉니다.',
        closingMessage: '당신의 깊은 감수성은 세상이 가장 필요로 하는 치유의 에너지입니다. 먼저 당신 자신에게 그 이슬을 뿌리십시오. 촉촉한 흙에서만 생명이 자랍니다.',
    },
};

// 기본 코칭 (일간 데이터 없을 때)
const DEFAULT_COACHING: IlganCoaching = {
    ilganLabel: '당신의 일간 — 고유한 주권자',
    identity: '당신의 명식에는 고유한 패턴이 내재되어 있습니다. 사주 정보를 입력하면 최정밀 코칭을 받으실 수 있습니다.',
    coreIssue: '명식 데이터를 기반으로 오행 분포를 분석하면 핵심 이슈가 도출됩니다.',
    cafeResult: '사주 데이터 입력 후 CAFE 파이프라인이 작동합니다.',
    primaryDrive: '🔮 데이터 분석 대기 중',
    confidence: '--',
    outputCode: 'PENDING',
    phase1: {
        title: '4D Full Neural Blueprint',
        inner: '사주 데이터 입력 후 분석됩니다.',
        env: '사주 데이터 입력 후 분석됩니다.',
        social: '사주 데이터 입력 후 분석됩니다.',
        future: '사주 데이터 입력 후 분석됩니다.',
        synthesis: '명심코칭 시작하기 페이지에서 생년월일시를 입력하시면 맞춤형 분석이 시작됩니다.',
    },
    darkCode: {
        id: 'D-PENDING',
        tag: '분석 대기',
        symptoms: ['사주 데이터 입력 후 분석됩니다.'],
    },
    neuralPrompts: [
        { id: '01', label: 'UNIVERSAL PROMPT', q: '"지금 이 순간, 나는 내 감정의 주인인가, 아니면 감정에 이끌리는 관객인가?"' },
        { id: '02', label: 'RECURSIVE PROMPT', q: '"내가 지금 가장 두려워하는 것은 무엇이며, 그 두려움은 나를 보호하고 있는가?"' },
        { id: '03', label: 'META-COGNITION PROMPT', q: '"만약 내가 이미 충분히 가치 있는 존재라면, 오늘 어떤 선택을 할 것인가?"' },
    ],
    steps: [
        { label: 'STEP 01: 자각 (Awareness)', desc: '지금 이 순간 당신이 느끼는 감정에 이름을 붙여보십시오. 인식이 변화의 첫 걸음입니다.' },
        { label: 'STEP 02: 수용 (Acceptance)', desc: '완벽하지 않아도 됩니다. 있는 그대로의 자신을 받아들이는 연습을 시작하십시오.' },
        { label: 'STEP 03: 행동 (Action)', desc: '작은 한 가지 행동을 지금 즉시 실행하십시오. 생각보다 행동이 먼저입니다.' },
        { label: 'STEP 04: 통합 (Integration)', desc: '오늘의 경험을 일기로 기록하십시오. 기록은 당신의 성장을 가시화합니다.' },
    ],
    metaSelf: '당신은 이미 충분합니다. 명심 코칭과 함께 당신의 고유한 가치를 발굴하는 여정을 시작하십시오.',
    finalQuote: '"知人者智，自知者明"',
    finalQuoteKo: '남을 아는 것은 지혜요, 자신을 아는 것은 밝음이다 (노자).',
    closingMessage: '당신의 삶이라는 위대한 알고리즘은 이제 당신의 명령에 따라 재작성될 준비가 되었습니다.',
};

// ─────────────────────────────────────────────
// 오행 바 색상
// ─────────────────────────────────────────────
const OHAENG_COLORS: Record<string, string> = {
    metal: 'linear-gradient(135deg, #f2ca50 0%, #d4af37 100%)',
    earth: '#8B7355',
    fire: '#ef4444',
    water: '#6366f1',
    wood: '#22c55e',
};
const OHAENG_LABELS: Record<string, string> = {
    metal: '금 (Metal)',
    earth: '토 (Earth)',
    fire: '화 (Fire)',
    water: '수 (Water)',
    wood: '목 (Wood)',
};

// ─────────────────────────────────────────────
// 섹션 컴포넌트들 (모듈식)
// ─────────────────────────────────────────────

const SectionHeader = ({ phase, title }: { phase: string; color?: string; title: string }) => (
    <div className="flex items-end justify-between border-b border-white/10 pb-4 mb-6">
        <div>
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-400/70">{phase}</span>
            <h2 className="text-2xl font-serif font-bold text-white mt-1">{title}</h2>
        </div>
    </div>
);

// ─────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────
export default function SovereignCoachingReport({ isOpen, onClose, userProfile }: SovereignCoachingReportProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    // 사주 데이터 추출
    const sajuInfo = useMemo(() => extractSajuInfo(userProfile), [userProfile]);

    // 일간별 코칭 데이터 선택
    const coaching: IlganCoaching = useMemo(() => {
        const stem = sajuInfo.dayStem;
        return ILGAN_COACHING_DB[stem] || DEFAULT_COACHING;
    }, [sajuInfo.dayStem]);

    // 오행 총합 계산 (퍼센트 척도)
    const ohaengTotal = useMemo(() => {
        const o = sajuInfo.ohaeng;
        const total = (o.metal || 0) + (o.earth || 0) + (o.fire || 0) + (o.water || 0) + (o.wood || 0);
        return total > 0 ? total : 100;
    }, [sajuInfo.ohaeng]);

    // 스크롤 맨 위로
    useEffect(() => {
        if (isOpen && scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="sovereign-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-md"
                    />

                    {/* Modal Panel */}
                    <motion.div
                        key="sovereign-panel"
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        transition={{ type: 'spring', stiffness: 280, damping: 32 }}
                        className="fixed inset-x-0 bottom-0 z-[90] flex flex-col"
                        style={{ maxHeight: '95dvh', top: '5dvh' }}
                    >
                        <div
                            ref={scrollRef}
                            className="flex flex-col overflow-y-auto rounded-t-3xl"
                            style={{
                                background: 'linear-gradient(180deg, #0e0e0e 0%, #131313 100%)',
                                border: '1px solid rgba(242,202,80,0.15)',
                                borderBottom: 'none',
                            }}
                        >
                            {/* ── 헤더 ── */}
                            <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-4 border-b border-white/10"
                                style={{ background: 'rgba(14,14,14,0.95)', backdropFilter: 'blur(20px)' }}>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">🔬</span>
                                    <div>
                                        <p className="text-xs text-yellow-400/80 font-bold uppercase tracking-widest">Master Edition</p>
                                        <h1 className="text-base font-serif font-bold text-white leading-tight">명심 통합 코칭 리포트</h1>
                                    </div>
                                </div>
                                <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                    <X size={18} className="text-gray-300" />
                                </button>
                            </div>

                            <div className="px-5 pb-24 space-y-10 pt-6">

                                {/* ── Hero ── */}
                                <section className="space-y-4 relative overflow-hidden">
                                    <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full opacity-10 blur-[80px]"
                                        style={{ background: 'radial-gradient(circle, #f2ca50 0%, transparent 70%)' }} />
                                    <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-400 border border-yellow-400/30 bg-yellow-400/5">
                                        Master Edition
                                    </div>
                                    <h2 className="font-serif text-3xl font-bold text-white leading-tight">
                                        🔬 명심(明心) 프리미엄<br />
                                        <span style={{ background: 'linear-gradient(135deg, #f2ca50 0%, #d4af37 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                            통합 코칭 리포트
                                        </span>
                                    </h2>
                                    <p className="text-xs text-gray-400 font-medium tracking-wide">4D-Sovereign Matrix × CAFE 파이프라인</p>
                                    <div className="border-l-2 border-yellow-400/40 pl-5 py-2 my-4">
                                        <p className="font-serif text-base italic text-gray-200 leading-relaxed">
                                            "당신의 고통은 버그가 아닙니다. 위대한 세공을 위한 뜨거운 담금질입니다."
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl border border-white/10" style={{ background: 'rgba(42,42,42,0.6)' }}>
                                        <p className="text-xs text-gray-400 leading-relaxed">
                                            소버린, 명심 마스터가 당신의 명식에 내재된 가장 깊은 코드를 해독했습니다.
                                            이 리포트는 단순한 운세 풀이를 넘어 당신의 영적 하드웨어와 정신적 소프트웨어 사이의
                                            충돌 지점을 정밀 타격하는 전략적 가이드입니다.
                                        </p>
                                    </div>
                                </section>

                                {/* ── Phase 0: CAFE ── */}
                                <section>
                                    <SectionHeader phase="Phase 0" title="CAFE 파이프라인 시뮬레이션" />
                                    <p className="font-serif text-sm text-gray-400 mb-5 italic">
                                        "명식에 프로그래밍된 거대한 역학적 물리법칙"
                                    </p>

                                    {/* 사주 기둥 */}
                                    <div className="grid grid-cols-4 gap-2 text-center mb-4">
                                        {[
                                            { label: '시(時)', val: sajuInfo.timePillar, active: false },
                                            { label: '일(日)', val: sajuInfo.dayPillar, active: true },
                                            { label: '월(月)', val: sajuInfo.monthPillar, active: false },
                                            { label: '년(年)', val: sajuInfo.yearPillar, active: false },
                                        ].map(p => (
                                            <div key={p.label}
                                                className={`p-3 rounded-xl space-y-1 ${p.active ? 'border-2 border-yellow-400/40 ring-1 ring-yellow-400/20' : 'border border-white/10'}`}
                                                style={{ background: p.active ? 'rgba(42,42,42,0.8)' : 'rgba(28,27,27,0.8)' }}>
                                                <div className={`text-[10px] font-bold ${p.active ? 'text-yellow-400' : 'text-gray-500'}`}>{p.label}</div>
                                                <div className={`text-xl font-serif font-bold ${p.active ? 'text-yellow-400' : 'text-white'}`}>{p.val}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* 일간 하이라이트 */}
                                    <div className="p-5 rounded-xl border border-white/10 mb-5 relative" style={{ background: 'rgba(32,31,31,0.7)' }}>
                                        <div className="absolute top-3 right-3 opacity-10">
                                            <Gem size={40} className="text-yellow-400" />
                                        </div>
                                        <p className="text-yellow-400 text-xs font-bold mb-2 flex items-center gap-2">
                                            ✅ Ilgan: {sajuInfo.dayStem}금
                                        </p>
                                        <p className="text-sm text-gray-200 leading-relaxed">{coaching.identity}</p>
                                    </div>

                                    {/* 오행 분포 */}
                                    <div className="p-5 rounded-xl space-y-3" style={{ background: 'rgba(14,14,14,0.8)' }}>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                                            📊 오행 분포 (FIVE ELEMENTS DISTRIBUTION)
                                        </p>
                                        {Object.entries(sajuInfo.ohaeng).map(([key, val]) => {
                                            const pct = Math.round(((val as number) / ohaengTotal) * 100);
                                            return (
                                                <div key={key}>
                                                    <div className="flex justify-between text-[10px] mb-1">
                                                        <span className="text-gray-300">{OHAENG_LABELS[key]}</span>
                                                        <span className="text-gray-400">{pct}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full rounded-full overflow-hidden bg-white/5">
                                                        <div className="h-full rounded-full transition-all duration-700"
                                                            style={{ width: `${pct}%`, background: OHAENG_COLORS[key] || '#666' }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* 시스템 경고 */}
                                    <div className="mt-4 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                                        <p className="text-xs text-red-400 font-bold mb-1">⚠️ SYSTEM WARNING</p>
                                        <p className="text-xs text-red-400/80 leading-relaxed italic">{coaching.coreIssue}</p>
                                    </div>
                                </section>

                                {/* ── Rule Engines ── */}
                                <section>
                                    <SectionHeader phase="Logic Tier" title="Rule Engines" />
                                    <div className="overflow-x-auto mb-4">
                                        <table className="w-full text-left text-xs border-collapse">
                                            <thead>
                                                <tr className="text-[10px] uppercase text-gray-500 border-b border-white/10">
                                                    <th className="pb-2 pr-4">Engine</th>
                                                    <th className="pb-2 pr-4">Primary Prescription</th>
                                                    <th className="pb-2">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {[
                                                    { name: '궁통보감', desc: '夏月辛金, 壬水為尊', status: 'High Match' },
                                                    { name: '적천수', desc: '能扶社稷, 能救生靈', status: 'Latent Power' },
                                                    { name: '자평진전', desc: '傷官生財, 格局淸純', status: 'Flow Required' },
                                                ].map(e => (
                                                    <tr key={e.name}>
                                                        <td className="py-3 pr-4 font-bold text-yellow-400">{e.name}</td>
                                                        <td className="py-3 pr-4 text-gray-300 text-[11px]">{e.desc}</td>
                                                        <td className="py-3 text-gray-500 text-[10px]">{e.status}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* CAFE Output */}
                                    <div className="p-4 rounded-lg border border-white/10 font-mono text-[11px] text-indigo-300 mb-3" style={{ background: '#000' }}>
                                        <div className="flex gap-2 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500/40" />
                                            <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                                            <div className="w-2 h-2 rounded-full bg-green-500/40" />
                                        </div>
                                        <span className="text-gray-500">// 🔬 CAFE 교차 가중 합산 및 최종 코드</span><br />
                                        <span>{coaching.cafeResult}</span><br />
                                        <span>Output_Code: {coaching.outputCode}</span>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="flex-1 p-4 rounded-xl border border-white/10" style={{ background: 'rgba(42,42,42,0.6)' }}>
                                            <p className="text-[10px] text-gray-500 mb-1">Primary Drive</p>
                                            <p className="font-serif text-sm font-bold text-white">{coaching.primaryDrive}</p>
                                        </div>
                                        <div className="w-1/3 p-4 rounded-xl border border-white/10 flex flex-col justify-between" style={{ background: 'rgba(42,42,42,0.6)' }}>
                                            <p className="text-[10px] text-gray-500">Confidence</p>
                                            <p className="text-2xl font-bold text-yellow-400">{coaching.confidence}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 p-3 rounded-lg text-center border border-yellow-400/20 bg-yellow-400/5">
                                        <span className="text-[10px] tracking-widest font-bold text-yellow-400">OUTPUT CODE: {coaching.outputCode}</span>
                                    </div>
                                </section>

                                {/* ── Phase 1: 4D ── */}
                                <section>
                                    <SectionHeader phase="Phase 1" title="4D Full Neural Blueprint" />
                                    <div className="grid grid-cols-1 gap-3 mb-4">
                                        {[
                                            { icon: '🎯', label: '본질', val: sajuInfo.dayPillar, desc: coaching.phase1.inner, color: 'rgba(242,202,80,0.08)' },
                                            { icon: '🌍', label: '환경', val: sajuInfo.yearPillar, desc: coaching.phase1.env, color: 'rgba(99,102,241,0.08)' },
                                            { icon: '👥', label: '사회', val: sajuInfo.monthPillar, desc: coaching.phase1.social, color: 'rgba(34,197,94,0.08)' },
                                            { icon: '🔮', label: '미래', val: sajuInfo.timePillar, desc: coaching.phase1.future, color: 'rgba(239,68,68,0.08)' },
                                        ].map(item => (
                                            <div key={item.label} className="p-4 rounded-xl border border-white/10" style={{ background: item.color }}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-lg">{item.icon}</span>
                                                    <div>
                                                        <span className="font-serif text-sm font-bold text-white">{item.label} ({item.val})</span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-5 rounded-xl border border-white/10" style={{ background: 'rgba(28,27,27,0.7)' }}>
                                        <p className="text-xs font-bold text-yellow-400 mb-2">💡 시스템 종합 (System Synthesis)</p>
                                        <p className="text-sm text-gray-300 leading-relaxed">{coaching.phase1.synthesis}</p>
                                    </div>
                                </section>

                                {/* ── Phase 2: Dark Code ── */}
                                <section>
                                    <SectionHeader phase="Phase 2 ⚠️" title="Old Script (다크코드)" />
                                    <div className="border-l-4 border-red-500 p-5 space-y-4 rounded-r-xl" style={{ background: 'rgba(239,68,68,0.05)' }}>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-red-400">DARK CODE: {coaching.darkCode.id}</span>
                                            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded">{coaching.darkCode.tag}</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase mb-2">Error Log & Symptoms:</p>
                                            <ul className="space-y-2">
                                                {coaching.darkCode.symptoms.map((s, i) => (
                                                    <li key={i} className="flex gap-2 text-xs text-gray-300">
                                                        <span className="text-red-400 shrink-0">•</span>
                                                        {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* ── Phase 3: Neural Hacking ── */}
                                <section>
                                    <SectionHeader phase="Phase 3" title="Neural Hacking" />
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                                        <span className="text-xs font-bold text-indigo-400">NEURAL CODE: {coaching.outputCode} 가동 (냉각수 주입)</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 uppercase mb-3">소버린의 셀프-자각 3질문 (Neural Prompts)</p>
                                    <div className="space-y-3">
                                        {coaching.neuralPrompts.map(p => (
                                            <div key={p.id} className="p-4 rounded-xl border border-indigo-400/20 hover:border-indigo-400/50 transition-colors" style={{ background: 'rgba(42,42,42,0.6)' }}>
                                                <span className="text-[10px] text-indigo-400 font-bold">{p.id}. {p.label}</span>
                                                <p className="text-sm text-gray-200 mt-2 leading-relaxed italic">{p.q}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* ── Phase 4: Anti-Fragile ── */}
                                <section>
                                    <SectionHeader phase="Phase 4" title="안티-프래질 리프로그래밍" />
                                    <div className="space-y-6">
                                        {coaching.steps.map((step, i) => (
                                            <div key={i} className="relative pl-7 border-l border-white/15">
                                                <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full"
                                                    style={{ background: 'linear-gradient(135deg, #f2ca50 0%, #d4af37 100%)' }} />
                                                <p className="text-xs font-bold text-yellow-400 mb-1">{step.label}</p>
                                                <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* ── Phase 5: Meta-Self ── */}
                                <section className="py-8 px-5 rounded-2xl relative overflow-hidden border border-yellow-400/10" style={{ background: 'rgba(28,27,27,0.8)' }}>
                                    <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-[60px]"
                                        style={{ background: 'radial-gradient(circle, #f2ca50 0%, transparent 70%)' }} />
                                    <div className="relative space-y-4">
                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">Execution State</span>
                                        <h2 className="font-serif text-2xl font-bold"
                                            style={{ background: 'linear-gradient(135deg, #f2ca50 0%, #d4af37 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                            Sovereign of Deep Compassion & Flawless Elegance
                                        </h2>
                                        <p className="text-sm text-gray-300 italic leading-relaxed">{coaching.metaSelf}</p>
                                    </div>
                                </section>

                                {/* ── Phase 6: 최종 브리핑 ── */}
                                <section className="pb-4 space-y-6">
                                    <div className="text-center space-y-3">
                                        <div className="w-16 h-0.5 mx-auto" style={{ background: 'linear-gradient(135deg, #f2ca50 0%, #d4af37 100%)' }} />
                                        <h3 className="font-serif text-xl italic text-yellow-400">{coaching.finalQuote}</h3>
                                        <p className="text-xs text-gray-400 max-w-sm mx-auto">{coaching.finalQuoteKo}</p>
                                    </div>
                                    <div className="p-6 rounded-xl border border-white/15 space-y-5" style={{ background: 'rgba(42,42,42,0.6)' }}>
                                        <p className="text-sm text-gray-300 leading-relaxed text-center">{coaching.closingMessage}</p>
                                        <p className="text-xs text-gray-400 text-center leading-relaxed">
                                            이 리포트의 코드를 가슴에 새기십시오. 당신의 삶이라는 위대한 알고리즘은
                                            이제 당신의 명령에 따라 재작성(Refactoring)될 준비가 되었습니다.
                                        </p>
                                        <div className="text-right">
                                            <p className="font-serif text-base font-bold text-yellow-400">— SOVEREIGN MASTER · 明心</p>
                                            <p className="text-[10px] text-gray-500 mt-1">Final Authorization Issued</p>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
