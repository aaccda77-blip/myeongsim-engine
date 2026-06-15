'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, ArrowRight, Shield, Award, Sparkles, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';

interface MptiTestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyPlanner?: (
        resultType: ElementKey,
        answers: Record<ElementKey, number>,
        birthOhaeng: Record<ElementKey, number>,
        avatarCode: string
    ) => void;
    userProfile?: any;
}

type ElementKey = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

interface ElementInfo {
    name: string;
    chinese: string;
    color: string;
    bgGlow: string;
    badgeBg: string;
    icon: string;
    archetype: string;
    tagline: string;
    traits: string[];
    weaknesses: string[];
    prescription: string;
    action: string;
}

const ELEMENT_DATA: Record<ElementKey, ElementInfo> = {
    wood: {
        name: '목',
        chinese: '木',
        color: 'text-emerald-400',
        bgGlow: 'shadow-[0_0_50px_rgba(16,185,129,0.25)] border-emerald-500/30',
        badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        icon: '🌱',
        archetype: '새싹 선비 (Wood Scholar)',
        tagline: '무한히 성장하며 비전을 개척하는 탐구자',
        traits: [
            '배움과 성장을 즐기며 지적 호기심이 매우 강합니다.',
            '진취적인 개척자 기질로 새로운 일을 시작하는 능력이 뛰어납니다.',
            '비전과 미래를 제시하여 다른 사람들에게 영감을 줍니다.'
        ],
        weaknesses: [
            '성장에 대한 강박으로 인해 쉽게 번아웃(Throttling)됩니다.',
            '가만히 쉬는 법을 모르며, 끊임없이 무언가를 해야 안심합니다.',
            '시작은 거창하나 마무리가 다소 취약할 수 있습니다.'
        ],
        prescription: '과도한 성장 회로가 뇌의 마스터 CPU를 과열시키고 있습니다. 하루 10분은 자라나기를 멈추고 땅속 깊이 뿌리를 내리듯 아무것도 하지 않는 깊은 이완(Cooling)을 훈련하세요.',
        action: '하루 한 번, 스마트폰과 책을 끄고 5분간 심호흡하며 의식적인 정지 상태 갖기.'
    },
    fire: {
        name: '화',
        chinese: '火',
        color: 'text-rose-400',
        bgGlow: 'shadow-[0_0_50px_rgba(244,63,94,0.25)] border-rose-500/30',
        badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        icon: '🔥',
        archetype: '등불 광대 (Fire Performer)',
        tagline: '세상을 밝히고 마음을 움직이는 뜨거운 감성가',
        traits: [
            '뛰어난 소통 능력과 풍부한 감수성을 지니고 있습니다.',
            '타인에게 따뜻한 온기와 에너지를 불어넣는 리액션 마스터입니다.',
            '자신의 가치와 재능을 세상에 화려하게 표현하는 힘이 있습니다.'
        ],
        weaknesses: [
            '타인의 시선과 피드백에 감정이 크게 흔들립니다.',
            '감정의 열기가 지나쳐 순간적인 감정 과부하를 겪기 쉽습니다.',
            '표현 뒤에 몰려오는 내면의 외로움과 공허함이 큽니다.'
        ],
        prescription: '타오르는 촛불은 바람에 취약합니다. 타인의 부정적인 평가나 시기심이라는 외풍이 내 마스터 CPU 코어에 도달하지 못하도록 마음의 방화벽(샌드박스 프로토콜)을 가동하십시오.',
        action: '타인에게 리액션하기 전, 스스로에게 "지금 내 감정 온도는 몇 도인가?" 3초간 자문하기.'
    },
    earth: {
        name: '토',
        chinese: '土',
        color: 'text-amber-400',
        bgGlow: 'shadow-[0_0_50px_rgba(245,158,11,0.25)] border-amber-500/30',
        badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        icon: '⛰️',
        archetype: '대지 조정자 (Earth Mediator)',
        tagline: '모두를 품어 안고 조율하는 따뜻한 중재자',
        traits: [
            '높은 신뢰성과 묵묵한 책임감을 지니고 있습니다.',
            '팀이나 공동체의 갈등을 조용히 중재하고 화합을 이끕니다.',
            '타인의 고충을 내 일처럼 아끼고 품어주는 안식처 같은 존재입니다.'
        ],
        weaknesses: [
            '남들을 배려하느라 정작 나 자신의 상처나 신호는 외면합니다.',
            '거절을 극도로 어려워하여 원치 않는 짐을 짊어지곤 합니다.',
            '속으로 삼켜둔 답답함이 누적되어 마음의 체증(가슴 앓이)이 생깁니다.'
        ],
        prescription: '대지는 모든 생명을 자라게 하지만 정작 자신의 필요를 말하지는 못합니다. 하루 한 번은 타인의 필요가 아닌, 나 자신의 "마음 경고음"에 주파수를 맞추고 단호하게 거절하는 경계선을 설정하세요.',
        action: '거절해야 할 일이 생겼을 때 바로 답하지 않고 "생각해 본 뒤 10분 후에 말씀드릴게요"라고 시간 벌기.'
    },
    metal: {
        name: '금',
        chinese: '金',
        color: 'text-slate-300',
        bgGlow: 'shadow-[0_0_50px_rgba(203,213,225,0.25)] border-slate-500/30',
        badgeBg: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
        icon: '🛡️',
        archetype: '강철 무관 (Metal Guardian)',
        tagline: '흐트러짐 없는 원칙과 결단력의 소유자',
        traits: [
            '확실한 원칙과 논리적인 분석력으로 무장하고 있습니다.',
            '목표를 향해 타협 없이 달려가는 칼 같은 결단력을 보입니다.',
            '주변의 혼란을 정리하고 올바른 시스템과 규칙을 세우는 능력이 큽니다.'
        ],
        weaknesses: [
            '완벽주의 기질로 인해 스스로와 타인을 옥죄고 피곤하게 만듭니다.',
            '통제 불가능한 상황을 마주하면 극심한 불안이나 분노를 느낍니다.',
            '감정적인 부드러움이 부족하여 대인 관계에서 차가워 보일 수 있습니다.'
        ],
        prescription: '단단한 쇠는 너무 강하면 쉽게 부러집니다. 단단함에 유연하고 맑은 물(癸水 식신)의 기운을 더해 부드러운 순환로를 개설해야 합니다. "완벽하지 않아도 안전하다"는 자각 패치를 인가하십시오.',
        action: '일의 진척이 80% 정도 되었을 때 "이 정도면 충분히 훌륭하다"고 소리 내어 말해보기.'
    },
    water: {
        name: '수',
        chinese: '水',
        color: 'text-sky-400',
        bgGlow: 'shadow-[0_0_50px_rgba(56,189,248,0.25)] border-sky-500/30',
        badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
        icon: '🌊',
        archetype: '심해 현인 (Water Sage)',
        tagline: '세상의 본질을 꿰뚫어 보는 지혜로운 사색가',
        traits: [
            '현상의 이면과 본질을 꿰뚫어 보는 통찰력이 비범합니다.',
            '상황에 유연하게 대처하며 물처럼 고요하고 차분한 지혜를 지녔습니다.',
            '남들이 보지 못하는 깊이 있는 정신 세계와 통찰을 보유하고 있습니다.'
        ],
        weaknesses: [
            '생각과 번뇌가 지나치게 많아 우울감이나 불안으로 흐르기 쉽습니다.',
            '깊은 침잠 속으로 고립되는 경향이 있어 자발적 외톨이가 되곤 합니다.',
            '행동력과 추진 동력이 쉽게 방전되어 무기력(Throttling)에 빠집니다.'
        ],
        prescription: '흐르지 않고 깊이 고인 물은 결국 썩고 맙니다. 심해의 고독에서 빠져나와 밝은 햇빛 아래로 작은 물방울을 흘려보내야 합니다. 생각을 즉시 행동으로 전환하는 실천 루틴을 가동하세요.',
        action: '아무 생각 없이 5초 안에 몸을 움직여 산책하거나, 가볍게 주변 사람에게 먼저 말 걸기.'
    }
};

const QUESTIONS = [
    {
        q: '새로운 일이나 흥미로운 취미를 시작할 때, 당신의 마음속에서 가장 먼저 일어나는 생각은 무엇인가요?',
        options: [
            { text: '이 일을 통해 내가 얼마나 더 배우고 성장하며 나아갈 수 있을까? (배움과 호기심)', key: 'wood', mbti: ['E', 'N'], enneagram: 'heart', bigFive: { O: 2, E: 1 } },
            { text: '어떻게 하면 사람들과 이 즐거움을 함께 나누고 소통할 수 있을까? (소통과 나눔)', key: 'fire', mbti: ['E', 'F'], enneagram: 'heart', bigFive: { E: 2, A: 1 } },
            { text: '모두가 편안하고 다치지 않게 조화롭고 안전하게 가려면 어떻게 해야 할까? (안정과 배려)', key: 'earth', mbti: ['I', 'F'], enneagram: 'gut', bigFive: { A: 2, N: 1 } },
            { text: '구체적인 순서와 완벽한 규칙을 정하고 꼼꼼히 정리하며 시작해야지. (계획과 원칙)', key: 'metal', mbti: ['I', 'T', 'J'], enneagram: 'gut', bigFive: { C: 2 } },
            { text: '이 일의 본질은 무엇이고, 내 인생에서 어떤 의미가 있는지 깊이 생각해보자. (사색과 의미)', key: 'water', mbti: ['I', 'N', 'P'], enneagram: 'head', bigFive: { O: 2 } }
        ]
    },
    {
        q: '몸과 마음이 몹시 지치고 스트레스가 가득 찼을 때, 당신이 에너지를 다시 채우는 가장 편안한 방법은 무엇인가요?',
        options: [
            { text: '새로운 것을 배우거나 앞으로의 설레는 계획을 세워본다.', key: 'wood', mbti: ['N', 'P'], enneagram: 'heart', bigFive: { O: 2 } },
            { text: '사람들을 만나 감정을 나누거나 활기찬 활동을 통해 털어낸다.', key: 'fire', mbti: ['E', 'F'], enneagram: 'heart', bigFive: { E: 2 } },
            { text: '나만의 아늑한 공간에서 편안하게 쉬며 에너지를 조용히 채운다.', key: 'earth', mbti: ['I', 'F'], enneagram: 'gut', bigFive: { A: 2 } },
            { text: '주변의 복잡한 물건이나 생각을 깔끔하게 정리정돈한다.', key: 'metal', mbti: ['I', 'T', 'J'], enneagram: 'gut', bigFive: { C: 2 } },
            { text: '혼자만의 고요한 시간을 가지며 마음에 평화를 얻는다.', key: 'water', mbti: ['I', 'N'], enneagram: 'head', bigFive: { O: 1 } }
        ]
    },
    {
        q: '다른 사람과 대화를 나눌 때, 내 마음의 빗장이 스르륵 열리고 깊이 연결되는 소통의 순간은 언제인가요?',
        options: [
            { text: '서로의 꿈과 서로를 성장시키는 밝은 이야기를 나눌 때', key: 'wood', mbti: ['N', 'E'], enneagram: 'heart', bigFive: { O: 2, E: 1 } },
            { text: '환한 웃음과 뜨거운 감정적 공감이 끊임없이 오갈 때', key: 'fire', mbti: ['F', 'E'], enneagram: 'heart', bigFive: { E: 2, A: 1 } },
            { text: '내밀한 고민을 말없이 따뜻하게 들어주고 위로해 줄 때', key: 'earth', mbti: ['F', 'I'], enneagram: 'gut', bigFive: { A: 2 } },
            { text: '불필요한 사담 없이 명확하고 신뢰할 수 있는 정보를 나눌 때', key: 'metal', mbti: ['T', 'J'], enneagram: 'gut', bigFive: { C: 1 } },
            { text: '삶의 깊은 철학이나 마음의 지혜에 대해 조용히 대화할 때', key: 'water', mbti: ['N', 'I'], enneagram: 'head', bigFive: { O: 2 } }
        ]
    },
    {
        q: '나에게 완벽하게 자유로운 주말이 주어진다면, 어떤 하루를 가장 보내고 싶으신가요?',
        options: [
            { text: '인생의 배움과 성장을 돕는 책을 읽거나 클래스에 참여하기', key: 'wood', mbti: ['J'], enneagram: 'heart', bigFive: { C: 1, O: 1 } },
            { text: '마음이 통하는 사람들과 맛집이나 파티에 가서 즐겁게 소통하기', key: 'fire', mbti: ['E'], enneagram: 'heart', bigFive: { E: 2 } },
            { text: '가족이나 가까운 사람들과 함께 맛있는 음식을 먹으며 푹 쉬기', key: 'earth', mbti: ['I'], enneagram: 'gut', bigFive: { A: 1 } },
            { text: '한 주의 일정, 소비, 계획 등을 깔끔하고 차분하게 정리하기', key: 'metal', mbti: ['T', 'J'], enneagram: 'gut', bigFive: { C: 2 } },
            { text: '방해받지 않고 조용히 명상, 차 마시기, 음악 감상 등으로 나에게 집중하기', key: 'water', mbti: ['I', 'N'], enneagram: 'head', bigFive: { O: 2 } }
        ]
    },
    {
        q: '뜻하지 않은 크고 작은 실패나 실수를 겪었을 때, 마음을 다잡고 일어나는 나만의 힘은 어디서 나오나요?',
        options: [
            { text: '이것 또한 좋은 경험이다! 곧바로 새로운 계획을 세워 도전한다.', key: 'wood', mbti: ['E'], enneagram: 'heart', bigFive: { C: 1, E: 1 } },
            { text: '주변 사람들에게 힘든 마음을 털어놓고 정서적인 응원을 받는다.', key: 'fire', mbti: ['F', 'E'], enneagram: 'heart', bigFive: { E: 1, A: 1 } },
            { text: '흘러가는 대로 마음을 푹 내려놓고 다시 충전될 시간을 묵묵히 기다린다.', key: 'earth', mbti: ['P'], enneagram: 'gut', bigFive: { A: 1, N: 1 } },
            { text: '실패의 원인을 냉정하게 분석하여 똑같은 실수를 반복하지 않도록 대책을 세운다.', key: 'metal', mbti: ['T', 'J'], enneagram: 'gut', bigFive: { C: 2 } },
            { text: '이 시련이 내 인생에 어떤 소중한 가르침을 주는지 깊이 성찰한다.', key: 'water', mbti: ['N'], enneagram: 'head', bigFive: { O: 2 } }
        ]
    },
    {
        q: '누군가 나에게 아픈 비판이나 지적을 했을 때, 당신의 마음에서 일어나는 가장 솔직한 반응은 무엇인가요?',
        options: [
            { text: '더 발전하라는 좋은 조언으로 받아들이고, 성장의 자극제로 삼는다.', key: 'wood', mbti: ['P'], enneagram: 'heart', bigFive: { O: 1 } },
            { text: '순간적으로 가슴이 답답해지며 나를 해명하고 싶은 마음이 든다.', key: 'fire', mbti: ['F'], enneagram: 'heart', bigFive: { E: 1, N: 1 } },
            { text: '상대방의 마음이 상했을까 봐 조마조마해지며 미안한 감정이 먼저 든다.', key: 'earth', mbti: ['F'], enneagram: 'gut', bigFive: { A: 1, N: 2 } },
            { text: '말에 논리적인 타당성이 있는지 따져본 후, 사실인 부분만 받아들인다.', key: 'metal', mbti: ['T', 'J'], enneagram: 'gut', bigFive: { C: 1 } },
            { text: '내 마음속의 어떤 생각과 행동이 이러한 상황을 불러왔는지 조용히 돌아본다.', key: 'water', mbti: ['I'], enneagram: 'head', bigFive: { O: 1 } }
        ]
    },
    {
        q: '당신이 삶에서 가장 이루고 싶은 궁극적인 행복과 인생의 성공은 어떤 모습인가요?',
        options: [
            { text: '배움을 멈추지 않고 어제보다 성숙해진 나를 마주하는 것', key: 'wood', mbti: ['N'], enneagram: 'heart', bigFive: { O: 2 } },
            { text: '나만의 밝은 에너지와 재능으로 세상에 선한 온기를 널리 퍼뜨리는 것', key: 'fire', mbti: ['E'], enneagram: 'heart', bigFive: { E: 2 } },
            { text: '주변 사람들과 갈등 없이 포근하고 따뜻한 평화를 지키는 것', key: 'earth', mbti: ['F'], enneagram: 'gut', bigFive: { A: 2 } },
            { text: '어지러운 환경을 단정하고 명확한 질서로 가꾸어 나가는 것', key: 'metal', mbti: ['J'], enneagram: 'gut', bigFive: { C: 2 } },
            { text: '그 어떤 삶의 풍파에도 흔들리지 않는 깊고 고요한 지혜를 지니는 것', key: 'water', mbti: ['I'], enneagram: 'head', bigFive: { O: 2 } }
        ]
    },
    {
        q: '가까운 사람이 "나 요즘 너무 힘들어..."라고 마음을 털어놓을 때, 내 생각은 어떻게 움직이나요?',
        options: [
            { text: '그 친구의 성장을 가로막는 원인을 찾아내고 앞으로 나아갈 해결책을 찾아주려 한다.', key: 'wood', mbti: ['T'], enneagram: 'heart', bigFive: { C: 1 } },
            { text: '마치 내 일처럼 마음이 짠해져서 꼭 안아주며 눈물로 깊이 공감해 준다.', key: 'fire', mbti: ['F'], enneagram: 'heart', bigFive: { A: 2 } },
            { text: '묵묵히 곁에서 이야기를 들어주고 맛있는 것을 챙겨주며 힘이 되어주려 한다.', key: 'earth', mbti: ['F'], enneagram: 'gut', bigFive: { A: 2 } },
            { text: '힘들게 만든 정확한 상황이 무엇인지 이야기를 들어보며 차분히 파악한다.', key: 'metal', mbti: ['T', 'J'], enneagram: 'gut', bigFive: { C: 1 } },
            { text: '친구의 지친 마음 너머의 삶의 의미를 짚어주고 지혜롭게 성찰할 수 있게 돕는다.', key: 'water', mbti: ['N'], enneagram: 'head', bigFive: { O: 1 } }
        ]
    },
    {
        q: '처음 가보는 모임이나 낯선 사람들의 공간에 참여했을 때, 당신은 어떤 모습인가요?',
        options: [
            { text: '호기심을 가지고 적극적으로 사람들에게 다가가 대화를 이끌어낸다.', key: 'wood', mbti: ['E'], enneagram: 'heart', bigFive: { E: 1, O: 1 } },
            { text: '밝고 활기찬 인사로 어색한 분위기를 풀고 웃음소리를 만들어낸다.', key: 'fire', mbti: ['E'], enneagram: 'heart', bigFive: { E: 2 } },
            { text: '조용히 미소 지으며 먼저 따뜻하게 다가와 주는 사람들과 편안하게 소통한다.', key: 'earth', mbti: ['I'], enneagram: 'gut', bigFive: { A: 2 } },
            { text: '모임이 어떤 성격인지 관찰하며 질서와 흐름을 조심스럽게 파악한다.', key: 'metal', mbti: ['T'], enneagram: 'gut', bigFive: { C: 1 } },
            { text: '흐르는 강물처럼 분위기를 가만히 보며, 모인 이들의 깊은 생각과 본질을 느낀다.', key: 'water', mbti: ['I'], enneagram: 'head', bigFive: { O: 1 } }
        ]
    },
    {
        q: '주어진 일을 계획하고 진행할 때, 내 알고리즘이 일을 풀어가는 방식은 무엇인가요?',
        options: [
            { text: '아이디어가 떠오르면 즉시 즐겁게 실행하고 세부 정리는 나중에 생각한다.', key: 'wood', mbti: ['P'], enneagram: 'heart', bigFive: { O: 1 } },
            { text: '재미있고 나를 설레게 하는 파트부터 에너지를 쏟아 질주한다.', key: 'fire', mbti: ['P'], enneagram: 'heart', bigFive: { E: 1 } },
            { text: '함께 일하는 동료들의 상태와 페이스를 먼저 고려하며 무리 없이 맞춘다.', key: 'earth', mbti: ['F'], enneagram: 'gut', bigFive: { A: 1 } },
            { text: '시작하기 전에 세부적인 순서와 타임라인을 꼼꼼하게 정리해 둔다.', key: 'metal', mbti: ['J'], enneagram: 'gut', bigFive: { C: 2 } },
            { text: '이 일을 지금 내가 왜 해야 하는지, 근본적인 철학과 가치를 먼저 정립한다.', key: 'water', mbti: ['N'], enneagram: 'head', bigFive: { O: 1 } }
        ]
    },
    {
        q: '사랑하는 연인이나 소중한 사람과 말다툼이 생겼을 때, 당신이 행동하는 자연스러운 방식은 무엇인가요?',
        options: [
            { text: '앞으로 더 나은 관계를 위해 어떻게 변화하면 좋을지 대화와 타협을 제안한다.', key: 'wood', mbti: ['N', 'E'], enneagram: 'heart', bigFive: { O: 1 } },
            { text: '속상하고 서운했던 감정을 솔직하고 강하게 쏟아내며 표현한다.', key: 'fire', mbti: ['F', 'E'], enneagram: 'heart', bigFive: { E: 1, N: 1 } },
            { text: '싸우는 상황 자체가 마음 아파서, 일단 상대를 다독이고 다정하게 사과한다.', key: 'earth', mbti: ['I', 'F'], enneagram: 'gut', bigFive: { A: 2 } },
            { text: '서로가 무엇을 오해했는지 사실 관계를 차분히 가려내며 타협점을 조율한다.', key: 'metal', mbti: ['T', 'J'], enneagram: 'gut', bigFive: { C: 1 } },
            { text: '차분히 생각할 혼자만의 시간이 필요해서 조용히 마음의 동굴로 들어간다.', key: 'water', mbti: ['I', 'T'], enneagram: 'head', bigFive: { O: 1 } }
        ]
    },
    {
        q: '마음에 드는 물건을 사거나 돈을 지출할 때, 내 마음에서 가장 크게 작용하는 기준은 무엇인가요?',
        options: [
            { text: '내가 배우고 경험하며 성장하는 데 소중한 도움을 줄 물건인가?', key: 'wood', mbti: ['N'], enneagram: 'heart', bigFive: { O: 2 } },
            { text: '나의 개성을 돋보이게 해주고 볼 때마다 나를 설레게 하는 아이템인가?', key: 'fire', mbti: ['E'], enneagram: 'heart', bigFive: { E: 1, O: 1 } },
            { text: '검증된 품질로 나와 내 가족, 주변 사람들이 함께 기쁨을 나눌 수 있는가?', key: 'earth', mbti: ['F'], enneagram: 'gut', bigFive: { A: 2 } },
            { text: '성능, 가격, 유용성 등이 가장 합리적이고 쓸모 있는 실용품인가?', key: 'metal', mbti: ['T', 'J'], enneagram: 'gut', bigFive: { C: 2 } },
            { text: '내 삶을 불필요한 낭비 없이 맑게 유지해 주는 본질적인 필요품인가?', key: 'water', mbti: ['I'], enneagram: 'head', bigFive: { O: 1 } }
        ]
    },
    {
        q: '새로운 지식이나 유용한 정보를 가장 빠르고 확실하게 내 것으로 만드는 공부 방법은 무엇인가요?',
        options: [
            { text: '이론보다 일단 직접 부딪치고 시도하며 온몸으로 경험하는 방법', key: 'wood', mbti: ['E', 'P'], enneagram: 'heart', bigFive: { O: 1 } },
            { text: '재미있는 영상이나 열정적인 사람들과 교류하며 눈과 귀로 신나게 채우는 방법', key: 'fire', mbti: ['E'], enneagram: 'heart', bigFive: { E: 1 } },
            { text: '누군가 곁에서 친절하고 차분하게 마음 써주며 가르쳐주는 따뜻한 방법', key: 'earth', mbti: ['F'], enneagram: 'gut', bigFive: { A: 2 } },
            { text: '잘 정리된 교재와 꼼꼼한 지침서, 매뉴얼을 순서대로 읽고 정리하는 방법', key: 'metal', mbti: ['T', 'J'], enneagram: 'gut', bigFive: { C: 2 } },
            { text: '조용한 나만의 공간에서 깊이 생각하고 원리를 통찰하며 깨닫는 방법', key: 'water', mbti: ['I', 'N'], enneagram: 'head', bigFive: { O: 2 } }
        ]
    },
    {
        q: '인생의 중요한 갈림길에서 나도 모르게 주저하며 멈칫하게 만드는 가장 큰 두려움은 무엇인가요?',
        options: [
            { text: '이 자리에 안주하여 내 성장이 영영 멈춰버리고 뒤처질지 모른다는 생각', key: 'wood', mbti: ['N'], enneagram: 'heart', bigFive: { O: 1 } },
            { text: '내가 가진 매력과 성과가 세상에 인정받지 못하고 소외될지 모른다는 우려', key: 'fire', mbti: ['E'], enneagram: 'heart', bigFive: { E: 1, N: 1 } },
            { text: '가장 아끼는 사람들의 따뜻한 믿음과 사랑을 잃고 홀로 외로워질지 모른다는 걱정', key: 'earth', mbti: ['F'], enneagram: 'gut', bigFive: { A: 1, N: 2 } },
            { text: '상황이 통제 불가능해져 내 소중한 일상이 엉망으로 꼬일지 모른다는 위기감', key: 'metal', mbti: ['T', 'J'], enneagram: 'gut', bigFive: { C: 1, N: 1 } },
            { text: '정신없이 바쁜 세상에 휩쓸려 내 참된 내면의 목소리를 잃어버릴지 모른다는 생각', key: 'water', mbti: ['I'], enneagram: 'head', bigFive: { O: 2 } }
        ]
    },
    {
        q: '하루 중 마음이 너무나도 지치고 공허할 때, 나를 따뜻하게 다독여주는 위로의 에너지는 무엇인가요?',
        options: [
            { text: '가벼운 산책이나 취미 활동을 즐기며 나의 활력을 다시 깨워본다.', key: 'wood', mbti: ['E'], enneagram: 'heart', bigFive: { O: 1 } },
            { text: '좋아하는 즐거운 음악을 흥얼거리거나 밝은 자극을 마주하며 기분을 돌린다.', key: 'fire', mbti: ['E'], enneagram: 'heart', bigFive: { E: 1 } },
            { text: '나만의 침대에 가만히 누워 좋아하는 이의 온기나 다정한 안부를 떠올린다.', key: 'earth', mbti: ['F'], enneagram: 'gut', bigFive: { A: 2 } },
            { text: '어질러진 오늘을 가볍게 정돈하고, 편안한 마음으로 내일의 계획을 정리해둔다.', key: 'metal', mbti: ['T', 'J'], enneagram: 'gut', bigFive: { C: 2 } },
            { text: '조용히 눈을 감고 "나는 이대로 충분하다"는 온전함의 명상을 누린다.', key: 'water', mbti: ['I'], enneagram: 'head', bigFive: { O: 2 } }
        ]
    }
];

export default function MptiTestModal({ isOpen, onClose, onApplyPlanner, userProfile }: MptiTestModalProps) {
    const { reportData } = useReportStore();

    const birthOhaeng = useMemo(() => {
        return reportData?.saju?.ohaeng || reportData?.saju?.elements || { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    }, [reportData]);

    const [step, setStep] = useState<number>(0); // 0: Intro, 1: Quiz, 2: Loading, 3: Result
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [answers, setAnswers] = useState<Record<ElementKey, number>>({
        wood: 0,
        fire: 0,
        earth: 0,
        metal: 0,
        water: 0
    });

    const [psychologyScores, setPsychologyScores] = useState({
        mbti: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
        enneagram: { gut: 0, heart: 0, head: 0 },
        bigFive: { O: 0, C: 0, E: 0, A: 0, N: 0 }
    });

    const combined = useMemo(() => {
        return {
            wood: answers.wood + (birthOhaeng.wood || 0),
            fire: answers.fire + (birthOhaeng.fire || 0),
            earth: answers.earth + (birthOhaeng.earth || 0),
            metal: answers.metal + (birthOhaeng.metal || 0),
            water: answers.water + (birthOhaeng.water || 0)
        };
    }, [answers, birthOhaeng]);

    const combinedTotal = useMemo(() => {
        return Object.values(combined).reduce((a, b) => a + b, 0) || 1;
    }, [combined]);

    const [resultType, setResultType] = useState<ElementKey>('wood');
    const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(false);
    const [loadingLogIndex, setLoadingLogIndex] = useState<number>(0);
    
    // [NEW] FPTI 상세/가이드 팝업을 위한 로컬 상태
    const [showFptiDetail, setShowFptiDetail] = useState<boolean>(false);
    const [showManseGuide, setShowManseGuide] = useState<boolean>(false);
    const [activeSajuTagDetail, setActiveSajuTagDetail] = useState<{ title: string; content: string } | null>(null);

    // [NEW] 일진 및 사주 맞춤 동적 질문을 위한 상태 및 메타데이터 정의
    const [dynamicQuestions, setDynamicQuestions] = useState<any[]>([]);
    const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(false);
    const [todayUngi, setTodayUngi] = useState<{ yearGanZhi: string; monthGanZhi: string; dayGanZhi: string } | null>(null);
    const [isFallbackActive, setIsFallbackActive] = useState<boolean>(false);

    const OHAENG_METADATA: Record<ElementKey, { mbti: string[], enneagram: string, bigFive: Record<string, number> }> = {
        wood: { mbti: ['E', 'N'], enneagram: 'heart', bigFive: { O: 2, E: 1 } },
        fire: { mbti: ['E', 'F'], enneagram: 'heart', bigFive: { E: 2, A: 1 } },
        earth: { mbti: ['I', 'F'], enneagram: 'gut', bigFive: { A: 2, N: 1 } },
        metal: { mbti: ['I', 'T', 'J'], enneagram: 'gut', bigFive: { C: 2 } },
        water: { mbti: ['I', 'N', 'P'], enneagram: 'head', bigFive: { O: 2 } }
    };

    const questionsList = useMemo(() => {
        return dynamicQuestions.length > 0 ? dynamicQuestions : QUESTIONS;
    }, [dynamicQuestions]);

    const fetchDynamicQuestions = async () => {
        setIsLoadingQuestions(true);
        setIsFallbackActive(false);
        try {
            const getTodayString = () => {
                const now = new Date();
                return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
            };
            const todayStr = getTodayString();
            const userId = userProfile?.id || (reportData as any)?.userId || 'guest';
            const cacheKey = `fpti_questions_${userId}`;
            const errorFallbackKey = `fpti_questions_fallback_${userId}`;
            
            // 1. 에러/Rate Limit Fallback 캐시 검사 (오늘 이미 차단/장애가 났었다면 서버를 다시 찌르지 않음)
            if (typeof window !== 'undefined') {
                const fallbackDate = localStorage.getItem(errorFallbackKey);
                if (fallbackDate === todayStr) {
                    console.log('[FPTI Client Cache] Fallback active for today. Using static questions.');
                    setDynamicQuestions(QUESTIONS);
                    setIsFallbackActive(true);
                    setIsLoadingQuestions(false);
                    return;
                }
            }

            // 2. 1차 필터: 로컬 스토리지에 오늘 날짜의 질문 세트가 이미 있는지 검사
            const cachedDataRaw = typeof window !== 'undefined' ? localStorage.getItem(cacheKey) : null;
            if (cachedDataRaw) {
                try {
                    const cached = JSON.parse(cachedDataRaw);
                    if (cached.date === todayStr && cached.questions && cached.questions.length > 0) {
                        setDynamicQuestions(cached.questions);
                        if (cached.todayIljin) {
                            setTodayUngi(cached.todayIljin);
                        }
                        setIsLoadingQuestions(false);
                        return; // API 호출을 생략하고 캐시 데이터 즉시 복구 (서버 트래픽 0으로 차단)
                    }
                } catch (e) {
                    console.error('Failed to parse cached FPTI questions:', e);
                }
            }

            // 3. 비로그인 사용자(Guest)인 경우, API를 호출하지 않고 즉시 정적 질문 롤백
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (userId === 'guest' || !uuidRegex.test(userId)) {
                console.log('[FPTI Client Security] Guest user or invalid UUID. Bypassing API.');
                setDynamicQuestions(QUESTIONS);
                setIsLoadingQuestions(false);
                return;
            }

            // 4. 캐시가 없을 경우에만 API 호출 (오늘 하루 최초 1회만 호출 보장)
            const res = await fetch('/api/coaching/mpti-questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });

            // 429 Rate Limit 혹은 기타 에러인 경우
            if (res.status === 429) {
                console.warn('[FPTI Client Security] Server rate limit (429) received.');
                if (typeof window !== 'undefined') {
                    localStorage.setItem(errorFallbackKey, todayStr);
                }
                setDynamicQuestions(QUESTIONS);
                setIsFallbackActive(true);
                setIsLoadingQuestions(false);
                return;
            }

            const data = await res.json();
            if (data.success && data.questions && data.questions.length > 0) {
                setDynamicQuestions(data.questions);
                if (data.todayIljin) {
                    setTodayUngi(data.todayIljin);
                }
                
                // 오늘 날짜로 응답 질문을 안전하게 로컬 캐시에 저장
                if (typeof window !== 'undefined') {
                    localStorage.setItem(cacheKey, JSON.stringify({
                        date: todayStr,
                        questions: data.questions,
                        todayIljin: data.todayIljin
                    }));
                }

                // 만약 서버에서 에러가 나서 Fallback을 내렸다면 Fallback 활성화 알림
                if (data.isFallback) {
                    setIsFallbackActive(true);
                    if (typeof window !== 'undefined') {
                        localStorage.setItem(errorFallbackKey, todayStr);
                    }
                }
            } else {
                // 응답 오류 발생 시 오늘 하루 동안은 더이상 서버를 찌르지 않도록 설정
                console.warn('[FPTI Client Security] Invalid server response. Fallback triggered.');
                if (typeof window !== 'undefined') {
                    localStorage.setItem(errorFallbackKey, todayStr);
                }
                setDynamicQuestions(QUESTIONS);
                setIsFallbackActive(true);
            }
        } catch (err) {
            console.error('[MPTI Questions Fetch Error]:', err);
            // 네트워크 레벨 에러 발생 시에도 Fallback 캐싱
            const getTodayString = () => {
                const now = new Date();
                return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
            };
            const userId = userProfile?.id || (reportData as any)?.userId || 'guest';
            if (typeof window !== 'undefined') {
                localStorage.setItem(`fpti_questions_fallback_${userId}`, getTodayString());
            }
            setDynamicQuestions(QUESTIONS);
            setIsFallbackActive(true);
        } finally {
            setIsLoadingQuestions(false);
        }
    };

    // 모달 오픈 시 질문 자동 Fetch 및 닫힐 때 리셋
    useEffect(() => {
        if (isOpen) {
            fetchDynamicQuestions();
        } else {
            setDynamicQuestions([]);
            setTodayUngi(null);
            setIsFallbackActive(false);
        }
    }, [isOpen]);

    const getSajuTagDescription = (tag: string): { title: string; content: string } => {
        // 심리 지표 분석 추출
        const mbti = psychologyScores.mbti;
        const enneagram = psychologyScores.enneagram;
        const bigFive = psychologyScores.bigFive;

        const isIntrovert = mbti.I > mbti.E;
        const isIntuitive = mbti.N > mbti.S;
        const isThinking = mbti.T > mbti.F;
        const isJudging = mbti.J > mbti.P;
        const mbtiCode = `${isIntrovert ? 'I' : 'E'}${isIntuitive ? 'N' : 'S'}${isThinking ? 'T' : 'F'}${isJudging ? 'J' : 'P'}`;

        let enneagramCenter = '감정/가슴(Heart)';
        if (enneagram.gut > enneagram.heart && enneagram.gut > enneagram.head) enneagramCenter = '본능/장(Gut)';
        else if (enneagram.head > enneagram.heart && enneagram.head > enneagram.gut) enneagramCenter = '사고/머리(Head)';

        const isHighNeuroticism = bigFive.N >= 4;
        const isHighConscientiousness = bigFive.C >= 4;
        const isHighOpenness = bigFive.O >= 4;

        if (tag.endsWith('띠')) {
            const rawZodiac = tag.replace('띠', '');
            return {
                title: `✨ 타고난 인생 무대배경: ${tag}`,
                content: `태어난 해의 지지(年支)에 해당하는 수호동물 '${rawZodiac}'의 기운은 당신이 지구라는 물리적 공간에 첫 발을 내디딜 때 마주한 사회적인 첫인상이자 무의식적인 기틀을 뜻합니다.\n\n동양학에서 '띠'는 한 사람의 영혼이 세상과 맺은 최초의 약속이자 삶의 거대한 무대 배경입니다. '${rawZodiac}'가 지닌 고유의 지혜와 수호의 에너지는 당신의 사회적 관계 속에서 든든한 방어막이 되어 줄 것입니다. 자신만의 아름다운 삶을 펼쳐 나갈 첫 번째 우주적 축복으로 이해해 보세요.`
            };
        }
        if (tag.endsWith('일주')) {
            return {
                title: `🧭 나를 상징하는 우주적 자아: ${tag}`,
                content: `당신이 태어난 날의 하늘의 기운(일간)과 땅의 맥박(일지)이 결합한 '${tag}'는 사주 역학에서 가장 중요한 '나 자신'의 본질과 핵심을 나타냅니다.\n\n누군가 정해준 기준이나 에고(Ego)의 잡음에 휘둘리지 않고, 오직 자신 본연의 우주적 결(Sync)을 지키며 살아가도록 약속된 빛나는 좌표입니다. 스스로의 고유한 결을 마주하고 이 기운을 온전히 수용할 때, 삶의 복잡한 매듭들이 가장 편안하고 자연스럽게 풀려나가기 시작할 것입니다.`
            };
        }
        if (tag === '신강사주') {
            return {
                title: `💪 단단한 주체성의 에너지: 신강사주 (身强)`,
                content: `사주 원국에서 '나를 돕는 기운(비겁과 인성)'의 뿌리가 깊고 풍부하여, 외부의 모진 바람과 환경의 변화 속에서도 스스로를 지켜낼 수 있는 든든한 주체성과 단단한 내면 서버를 가졌음을 의미합니다.\n\n어떤 난관 앞에서도 주관을 잃지 않는 강인한 뚝심이 선물로 주어졌지만, 에고가 지나치게 단단해지면 고집이나 소통의 부재가 될 수 있습니다. 댐의 풍부한 물이 강줄기를 타고 흐르듯, 당신의 든든한 에너지를 부드러운 배려와 상생의 표현(식신/상관)으로 흘려보낼 때 비로소 완성도 높은 삶의 조율이 이루어집니다.`
            };
        }
        if (tag === '신약사주') {
            return {
                title: `🍃 유연하고 부드러운 조화의 에너지: 신약사주 (身弱)`,
                content: `'신약'이라는 말은 결코 에너지가 약하거나 모자라다는 부정적인 뜻이 아닙니다. 오히려 굳어져 부러지기 쉬운 단단한 기둥 대신, 거센 풍파를 만나도 부드럽게 몸을 흔들며 상생하는 유연한 대나무의 성질을 뜻합니다.\n\n세상의 흐름을 직관적으로 읽고 타인과 조화롭게 정렬(Sync)하는 부드러운 공감 능력은 당신만의 위대한 축복입니다. 다만 타인의 자극이나 비난에 내면의 방화벽이 쉽게 얇아질 수 있으니, 매일 스스로를 안아주는 자존감(비겁)과 깊은 배움과 지혜(인성)의 버퍼를 넉넉하게 채워 마음의 안전지대를 견고히 해주세요.`
            };
        }
        if (tag.endsWith('공망')) {
            const chars = tag.replace('공망', '');
            return {
                title: `🔮 결핍이 빚어낸 위대한 창조: ${tag}`,
                content: `하늘의 십간(10간)과 땅의 십이지(12지)가 서로 손을 잡을 때, 짝이 맞지 않아 텅 비어 있는 우주적인 틈새 '${chars}'의 기운을 뜻합니다.\n\n명리학에서 공망은 비어 있음(Void)을 의미하지만, 이는 결코 상실이나 슬픔이 아닙니다. 비어 있기에 더 많은 것을 채울 수 있는 무한한 제로 포인트(Zero Point)이자, 그 결핍을 예술적인 갈망과 눈부신 사회적 공헌으로 승화하려는 거대한 에너지의 씨앗입니다. 비어 있는 빈 바디(Body)를 가졌기에 가장 아름다운 공명음을 내는 악기처럼, 당신의 결핍은 세상을 아름답게 울릴 당신만의 찬란한 노래의 시작점입니다.`
            };
        }
        if (tag.endsWith('지공망')) {
            return {
                title: `🌌 마음의 공터이자 성장 스포트라이트: ${tag}`,
                content: `태어난 날(일주)을 기준으로 계산된 공망의 글자가 당신 사주 원국의 특정 위치인 '${tag}'에 실재하고 있어, 그 영역에서 우주적 비어 있음이 역동적으로 작용함을 나타냅니다.\n\n예를 들어 년지공망은 자립심과 독창적인 자기 개척의 힘을 기르는 원동력이 되며, 월지공망은 부모나 사회적 배경의 아쉬움을 더 깊은 영성적 성찰과 성실함으로 극복하게 돕는 성장의 자양분이 됩니다. 비어 있는 공간은 어둠이 아니라, 당신이 스스로의 깊은 참나의 온기와 지혜의 빛으로 환하게 채워 나가야 할 '인생의 주인공 스포트라이트' 구역입니다.`
            };
        }

        // --- 격국(Gyeokguk) 분석: 명심코칭 관점의 인지/행동 알고리즘 및 현대 심리(MBTI, 에니어그램, 빅파이브) 융합 분석 ---
        let gyeokType = "일반격";
        let sajuIntro = "";
        let cognitiveBug = "";
        let behaviorProtocol = "";

        if (tag.includes("인") || tag.includes("인성")) {
            gyeokType = "학문과 성찰의 현자 (인성격)";
            sajuIntro = `당신은 선천적으로 진리를 탐구하고 세상을 깊이 관조하는 사상가(인성격)의 그릇을 타고났습니다.`;
            
            if (isIntuitive && enneagramCenter.includes("머리")) {
                cognitiveBug = `🧠 [인지 버그] 선천의 인성격과 후천의 N(직관), 머리형 에너지가 시너지를 내어 뛰어난 지적 통찰력을 발휘합니다. 다만, 생각의 소음이 과도해져 행동력이 떨어지는 '머릿속 무한 루프(Infinite Loop)'나 과도한 불안에 쉽게 노출되는 취약점이 있습니다.`;
            } else {
                cognitiveBug = `🧠 [인지 버그] 타인의 정보와 지식을 끊임없이 분석하고 수집하느라 정작 지금 마주해야 할 내면의 주체적인 목소리나 즉각적인 실천력을 방치하는 경향이 있습니다.`;
            }

            behaviorProtocol = `⚙️ [행동 알고리즘] 
1. 회광반조(생각 멈춤): 생각이나 걱정이 일어날 때, 3초간 코끝 호흡에 집중하며 '이 생각은 실제로 사실인가, 아니면 에고의 소음인가?' 질문하고 한숨으로 비워냅니다.
2. 1분 실행 프로토콜: 새로운 구상이 시작되면 더 분석하려 하지 말고, 단 1분 안에 물리적인 행동(메모 작성, 검색, 이메일 쓰기)으로 변환해 출력하세요.
3. 성실성 C 보강: 매일 저녁 잠들기 전 5분간 마음속의 부유하는 생각을 일기장에 적어 밖으로 분리 배출함으로써 뇌의 RAM 메모리를 비워 줍니다.`;

        } else if (tag.includes("재") || tag.includes("재성")) {
            gyeokType = "현실적 설계와 비전의 건축가 (재성격)";
            sajuIntro = `당신은 선천적으로 현실을 기획하고 유용한 가치와 큰 흐름을 만들어내는 아키텍트(재성격)의 그릇을 타고났습니다.`;

            if (isThinking && isHighConscientiousness) {
                cognitiveBug = `🧠 [인지 버그] 선천의 재성격과 후천의 T(사고), 높은 성실성(C)이 조화를 이루어 목표 지향적인 탁월한 성과를 창출합니다. 다만, 세상과 모든 관계를 완벽하게 통제하고 지휘하려는 독선적 강박이나 예상을 빗나갔을 때의 초조함이라는 인지 왜곡이 있습니다.`;
            } else {
                cognitiveBug = `🧠 [인지 버그] 눈앞의 가시적인 유용성과 일 처리의 합리성에 과도하게 치중하여, 정작 마음의 평화나 타인과의 본질적인 정서적 유대를 사소하게 생각하고 넘기기 쉽습니다.`;
            }

            behaviorProtocol = `⚙️ [행동 알고리즘]
1. 저항수용(흐름 순응): 예기치 못한 차질이나 계획 변경이 일어날 때, 저항하지 않고 '우주가 내게 새로운 창의적 루트를 선물하고 있다'고 관점을 180도 전환해 수용합니다.
2. 30%의 여백 시스템: 일주일 일정 중 30%는 고의적으로 계획을 잡지 않은 채 공백으로 두어, 즉흥적이고 편안한 영혼의 쉼을 경험하세요.
3. 우호성 A 보강: 타인의 미숙한 결과나 속도를 다그치지 않고, "그럴 수도 있지, 각자의 고유한 우주적 타이밍이 있다"며 따스하게 격려하는 언어 알고리즘을 사용합니다.`;

        } else if (tag.includes("식") || tag.includes("상") || tag.includes("식상")) {
            gyeokType = "창조적 표현과 치유의 예술가 (식상격)";
            sajuIntro = `당신은 선천적으로 나를 자유롭게 드러내고 표현하며, 세상을 널리 이롭게 돕는 치유가(식상격)의 그릇을 타고났습니다.`;

            if (mbti.F > mbti.T && enneagramCenter.includes("가슴")) {
                cognitiveBug = `🧠 [인지 버그] 선천의 식상격과 후천의 F(감정), 가슴형 에너지가 결합하여 눈물겨울 만큼 헌신적인 사랑을 나눕니다. 그러나 타인의 기분이나 피드백에 과민하게 반응하여 거절을 못 하고, 스스로를 돌보기 전에 감정의 소모와 정서적 번아웃을 겪기 쉬운 인지 패턴입니다.`;
            } else {
                cognitiveBug = `🧠 [인지 버그] 에너지를 과도하게 타인에게 쏟아붓고 나를 표현하느라 내면의 고요한 침묵 서버(비겁)가 고갈되어, 이유 없는 공허감이나 갑작스러운 감정 폭발에 도달하게 됩니다.`;
            }

            behaviorProtocol = `⚙️ [행동 알고리즘]
1. 본질경청(경계 방화벽): 남을 돕거나 응하기 전에, 내 아랫배에 집중하며 '내 배터리가 지금 이것을 감당할 정서적 에너지가 넉넉한가?'를 스스로에게 먼저 물어봅니다.
2. 정중한 지연 대답: 부탁을 받을 때 즉시 승낙하는 버릇을 멈추고, "제가 제 일정을 확인해 보고 30분 뒤에 다시 말씀드릴게요"라고 말하는 쿠션 어구 알고리즘을 실행합니다.
3. 마음 접지(Grounding): 하루에 한 번 자연의 소리를 들으며 10분간 나의 신체 감각과 동기화(Sync)하여 밖으로 새어 나간 에너지를 안으로 회수합니다.`;

        } else if (tag.includes("관") || tag.includes("관성")) {
            gyeokType = "질서와 정의의 수호자 (관성격)";
            sajuIntro = `당신은 선천적으로 책임감과 명예를 소중히 하고, 조직이나 사회 속에서 올바른 질서를 다스리는 리더(관성격)의 그릇을 타고났습니다.`;

            if (isJudging && isHighNeuroticism) {
                cognitiveBug = `🧠 [인지 버그] 선천의 관성격과 후천의 J(판단), 높은 예민성(N)이 만나 자신을 '완벽한 의무와 도덕'의 테두리 안에 묶어두려 합니다. 끊임없이 자아를 검열하고 회고하며 죄책감이나 자책감을 유발하는 '엄격한 판사 에고'가 내면에서 날카롭게 동작하는 인지 왜곡입니다.`;
            } else {
                cognitiveBug = `🧠 [인지 버그] 외부의 규범이나 타인의 시선, 사회적 명예라는 레이더망을 항상 켜두고 있어, 진정한 내가 바라는 어린아이 같은 유쾌한 기쁨과 자유로운 해방감을 스스로 강박적으로 억압하게 됩니다.`;
            }

            behaviorProtocol = `⚙️ [행동 알고리즘]
1. 당위적 규칙 해체: 마음에서 "너는 ~해야만 해"라는 강박이 떠오를 때마다, "그렇게 하지 않아도 내 존재는 그 자체로 온전하며 우주의 무한한 사랑을 받고 있다"고 조용히 되뇌어 줍니다.
2. 일탈 놀이터 프로토콜: 정해진 매뉴얼 없이 무작정 걷거나, 마음 내키는 대로 귀여운 낭비를 해보는 등 작은 일탈적 자유 행동을 정기적으로 체험하세요.
3. 신경성 N 완화: 가슴에 손을 얹고 세 번의 심호흡을 하며 '안전하고, 고요하며, 나는 충분하다'고 자율신경계를 안정시키는 접지(Grounding)를 돕습니다.`;

        } else {
            gyeokType = "주체성과 동료애의 개척자 (비겁격)";
            sajuIntro = `당신은 선천적으로 강인한 자존감을 바탕으로, 흔들리지 않는 신념을 구축하고 동료들과 연대하여 길을 개척하는 선구자(비겁격)의 그릇을 타고났습니다.`;

            if (enneagramCenter.includes("장") || bigFive.E >= 4) {
                cognitiveBug = `🧠 [인지 버그] 선천의 비겁격과 후천의 장(Gut)형 혹은 높은 외향성(E)이 시너지를 발휘해 압도적인 행동력을 갖춥니다. 다만, 내 약점을 타인에게 보이면 패배한다는 두려움에 사로잡혀 모든 무거운 짐을 혼자서 짊어지고 고독한 전사를 자처하는 영웅 에고의 늪에 빠지기 쉽습니다.`;
            } else {
                cognitiveBug = `🧠 [인지 버그] 내 주관과 방식이 지나치게 옳다고 확신하는 나머지, 상대방의 타당한 제안이나 감정을 밀어내어 대인관계 장벽을 스스로 높이는 인지적 고립이 일어날 수 있습니다.`;
            }

            behaviorProtocol = `⚙️ [행동 알고리즘]
1. 취약함의 수용: 일주일에 한 번 신뢰하는 파트너나 거울 속의 자신에게 "나 지금 조금 지치고 짐이 무겁다"고 내 솔직한 온도의 연약함을 표현해 봅니다.
2. 공동 아키텍처: 나 홀로 독주하려 하기보다, 주변의 지혜로운 동료에게 먼저 자문을 구하고 의견의 합을 맞추는 공동 파트너십을 행동으로 훈련합니다.
3. 타자 경청 알고리즘: 갈등이 발생했을 때 내 판단 논리를 즉각 꺼내어 반박하지 않고, 상대의 말이 끝날 때까지 1분간 깊은 눈빛으로 그냥 들으며 수용하는 훈련을 합니다.`;
        }

        return {
            title: `🎯 내 사회적 천직 아키텍처: ${tag} (${gyeokType})`,
            content: `${sajuIntro}

📌 격국의 탄생과 정통 명학 도출원리
명리학에서 격국(Gyeokguk)은 당신이 세상이라는 넓은 오케스트라에서 어떤 악기를 연주하며 사회에 기여할지를 규정하는 아키텍처입니다. 
당신이 태어난 달인 월지(月支)는 계절의 가장 강력한 우주적 에너지가 깃든 생명 서버입니다. 이 월지 속에 숨겨진 지장간(땅속에 품은 씨앗인 초기, 중기, 본기)의 글자 중, 하늘(천간)에 솟구쳐 나와 관계를 맺는 글자를 격국으로 도출합니다. 만약 월지의 본기가 투출하면 그것을 가장 우선적인 격으로 정하며, 투출이 없다면 월지 본기 고유의 기운을 바탕으로 격국을 판정하여 삶의 그릇과 사회적 재능의 형태를 읽어냅니다.

--------------------------------------------------

🧩 후천 심리 분석 융합 데이터 (MBTI: ${mbtiCode} | Enneagram: ${enneagramCenter} 센터 | BigFive)
선천적인 사주 격국이 당신의 '우주적 운영체제(OS)'라면, 후천적인 심리 지표는 당신이 삶 속에서 겪은 수많은 경험과 반응이 누적되어 설치된 '애플리케이션(App)'들입니다. 이 둘이 충돌하거나 조화를 이루는 지점을 해독해 봅니다.

${cognitiveBug}

--------------------------------------------------

💎 명심코칭의 마음 디버깅 & 행동 알고리즘
에고의 소음과 인지적 착각을 정화하고, 참나(True Self)와 온전히 동기화(Sync)하여 삶을 가장 지혜롭고 자연스러운 춤사위로 바꾸는 행동 가이드입니다.

${behaviorProtocol}`
        };
    };

    // [NEW] FPTI 코드 및 번역 매핑 데이터
    const fptiCodes: Record<ElementKey, { code: string; name: string; avatar: string; description: string }> = {
        wood: { code: 'SNC', name: '새싹 선비', avatar: '🧙‍♂️', description: '창조적이고 배움을 즐기며 유연하게 뻗어나가는 성향' },
        fire: { code: 'LTG', name: '등불 광대', avatar: '🧙‍♀️', description: '열정적이고 사교적이며 감정을 솔직하게 표현하는 성향' },
        earth: { code: 'EMC', name: '대지 조정자', avatar: '🧙‍♂️', description: '듬직하고 편안하며 타인의 갈등을 평화롭게 조율하는 성향' },
        metal: { code: 'DMG', name: '능숙한 기술자', avatar: '🧙‍♀️', description: '논리적이고 원칙적이며 섬세하게 결단하고 실행하는 성향' },
        water: { code: 'DPH', name: '심해 현인', avatar: '🧙‍♂️', description: '직관적이고 지혜로우며 생각이 깊고 흐르는 물처럼 유연한 성향' }
    };

    const avatarCode = `${fptiCodes[resultType].code} (${fptiCodes[resultType].name})`;

    // [NEW] 사주 띠 매핑
    const sajuZodiacMap: Record<string, string> = {
        '子': '쥐띠', '丑': '소띠', '寅': '호랑이띠', '卯': '토끼띠',
        '辰': '용띠', '巳': '뱀띠', '午': '말띠', '未': '양띠',
        '申': '원숭이띠', '酉': '닭띠', '戌': '개띠', '亥': '돼지띠',
        // 한글 키 추가 (CoverView에서 저장 시 한글 지지 사용)
        '자': '쥐띠', '축': '소띠', '인': '호랑이띠', '묘': '토끼띠',
        '진': '용띠', '사': '뱀띠', '오': '말띠', '미': '양띠',
        '신': '원숭이띠', '유': '닭띠', '술': '개띠', '해': '돼지띠'
    };

    // [FIX] gan/ji가 객체({ char, hanja, ... })일 수도 있고 문자열일 수도 있으므로 안전하게 추출
    const resolveChar = (val: any): string => {
        if (!val) return '';
        if (typeof val === 'string') return val;
        return val.char || val.hanja || '';
    };

    // [NEW] 사주 4주 8글자 전체 파싱 로직
    const parsedFourPillars = useMemo(() => {
        const defaultPillars = {
            year: { gan: '경', ganHanja: '庚', ganLabel: '금', ganColor: '#9CA3AF', ji: '신', jiHanja: '申', jiLabel: '금', jiColor: '#9CA3AF' },
            month: { gan: '무', ganHanja: '戊', ganLabel: '토', ganColor: '#F59E0B', ji: '자', jiHanja: '子', jiLabel: '수', jiColor: '#3B82F6' },
            day: { gan: '병', ganHanja: '丙', ganLabel: '화', ganColor: '#EF4444', ji: '오', jiHanja: '午', jiLabel: '화', jiColor: '#EF4444' },
            time: { gan: '기', ganHanja: '己', ganLabel: '토', ganColor: '#F59E0B', ji: '축', jiHanja: '丑', jiLabel: '토', jiColor: '#F59E0B' }
        };

        if (!reportData?.saju?.fourPillars) return defaultPillars;
        const fp = reportData.saju.fourPillars;

        const getPillarData = (pillar: any) => {
            if (!pillar) return { gan: '', ganHanja: '', ganLabel: '', ganColor: '', ji: '', jiHanja: '', jiLabel: '', jiColor: '' };
            
            const gan = pillar.gan;
            const ji = pillar.ji;

            return {
                gan: typeof gan === 'string' ? gan : (gan?.char || ''),
                ganHanja: typeof gan === 'string' ? '' : (gan?.hanja || ''),
                ganLabel: typeof gan === 'string' ? '' : (gan?.label || ''),
                ganColor: typeof gan === 'string' ? '#9CA3AF' : (gan?.color || '#9CA3AF'),
                ji: typeof ji === 'string' ? ji : (ji?.char || ''),
                jiHanja: typeof ji === 'string' ? '' : (ji?.hanja || ''),
                jiLabel: typeof ji === 'string' ? '' : (ji?.label || ''),
                jiColor: typeof ji === 'string' ? '#3B82F6' : (ji?.color || '#3B82F6')
            };
        };

        return {
            year: getPillarData(fp.year),
            month: getPillarData(fp.month),
            day: getPillarData(fp.day),
            time: getPillarData(fp.time)
        };
    }, [reportData]);

    // [NEW] 후천 행동 성향(DISC) 및 직업흥미(Holland) 점수 연산 헬퍼 (오행 점수 기반 매핑)
    const discScores = useMemo(() => {
        const w = answers.wood || 0;
        const f = answers.fire || 0;
        const e = answers.earth || 0;
        const m = answers.metal || 0;
        const wa = answers.water || 0;

        const rawD = m * 1.5 + f * 0.5;
        const rawI = f * 1.5 + w * 0.5;
        const rawS = e * 1.5 + wa * 0.5;
        const rawC = wa * 1.5 + m * 0.5;

        const scale = (val: number) => {
            if (val === 0) return 0;
            return Math.min(100, Math.round((val / 7.5) * 100));
        };

        return {
            D: scale(rawD),
            I: scale(rawI),
            S: scale(rawS),
            C: scale(rawC)
        };
    }, [answers]);

    const hollandScores = useMemo(() => {
        const w = answers.wood || 0;
        const f = answers.fire || 0;
        const e = answers.earth || 0;
        const m = answers.metal || 0;
        const wa = answers.water || 0;

        const rawR = m;
        const rawI = wa;
        const rawA = w;
        const rawS = e * 0.5 + f * 0.5;
        const rawE = f * 0.5 + m * 0.5;
        const rawC = m * 0.5 + e * 0.5;

        const scale = (val: number) => {
            if (val === 0) return 0;
            return Math.min(100, Math.round((val / 5) * 100));
        };

        return {
            R: scale(rawR),
            I: scale(rawI),
            A: scale(rawA),
            S: scale(rawS),
            E: scale(rawE),
            C: scale(rawC)
        };
    }, [answers]);

    // [NEW] 후천 심리 지표 시각화용 퍼센트 연산 헬퍼
    const mbtiPercents = useMemo(() => {
        const { E, I, S, N, T, F, J, P } = psychologyScores.mbti;
        const calcPct = (val1: number, val2: number) => {
            const total = val1 + val2;
            if (total === 0) return 50;
            return Math.round((val1 / total) * 100);
        };
        return {
            E: calcPct(E, I),
            I: calcPct(I, E),
            S: calcPct(S, N),
            N: calcPct(N, S),
            T: calcPct(T, F),
            F: calcPct(F, T),
            J: calcPct(J, P),
            P: calcPct(P, J)
        };
    }, [psychologyScores]);

    const enneagramPercents = useMemo(() => {
        const { gut, heart, head } = psychologyScores.enneagram;
        const total = gut + heart + head;
        if (total === 0) return { gut: 33, heart: 33, head: 33 };
        return {
            gut: Math.round((gut / total) * 100),
            heart: Math.round((heart / total) * 100),
            head: Math.round((head / total) * 100)
        };
    }, [psychologyScores]);

    const bigFivePercents = useMemo(() => {
        const { O, C, E, A, N } = psychologyScores.bigFive;
        const scale = (val: number) => Math.min(Math.round((val / 6) * 100), 100);
        return { O: scale(O), C: scale(C), E: scale(E), A: scale(A), N: scale(N) };
    }, [psychologyScores]);

    // [NEW] 교차분석 AI 리포트 상태 및 통신 함수
    const [crossoverResult, setCrossoverResult] = useState<any>(null);
    const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'summary' | 'saju' | 'psychology' | 'ai'>('summary');

    // [NEW] AI가 실시간 분석한 맞춤 강점 및 취약패턴 연산 (Fallback 포함)
    const dynamicTraits = useMemo(() => {
        if (crossoverResult && Array.isArray(crossoverResult.customTraits) && crossoverResult.customTraits.length > 0) {
            return crossoverResult.customTraits;
        }
        return ELEMENT_DATA[resultType].traits;
    }, [crossoverResult, resultType]);

    const dynamicWeaknesses = useMemo(() => {
        if (crossoverResult && Array.isArray(crossoverResult.customWeaknesses) && crossoverResult.customWeaknesses.length > 0) {
            return crossoverResult.customWeaknesses;
        }
        return ELEMENT_DATA[resultType].weaknesses;
    }, [crossoverResult, resultType]);

    const fetchCrossoverReport = async (avatarCodeStr: string) => {
        setIsAiLoading(true);
        try {
            const res = await fetch('/api/coaching/mpti-planner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: userProfile?.userName || '익명',
                    avatarCode: avatarCodeStr,
                    birthOhaeng: birthOhaeng,
                    answers: answers,
                    crossoverMode: true,
                    sajuPillars: parsedFourPillars,
                    psychologyScores: {
                        ...psychologyScores,
                        disc: discScores,
                        holland: hollandScores
                    }
                })
            });
            const data = await res.json();
            setCrossoverResult(data);
        } catch (e) {
            console.error('Crossover analysis failed:', e);
        } finally {
            setIsAiLoading(false);
        }
    };

    // [NEW] 사주 일주/십성 배지 칩스 추출
    const sajuTags = useMemo(() => {
        if (!reportData?.saju) return ['원숭이띠', '신사일주', '신강사주', '편재격'];
        const tags: string[] = [];
        
        const yearJi = parsedFourPillars.year.ji || '신';
        const yearJiHanja = parsedFourPillars.year.jiHanja || '申';
        const dayGan = parsedFourPillars.day.gan || '병';
        const dayJi = parsedFourPillars.day.ji || '오';
        const yearGan = parsedFourPillars.year.gan || '경';
        const monthGan = parsedFourPillars.month.gan || '무';
        const monthJi = parsedFourPillars.month.ji || '자';
        const timeGan = parsedFourPillars.time.gan || '기';
        const timeJi = parsedFourPillars.time.ji || '축';

        // 1. 띠
        tags.push(sajuZodiacMap[yearJiHanja] || sajuZodiacMap[yearJi] || '원숭이띠');
        
        // 2. 일주
        tags.push(dayGan && dayJi ? `${dayGan}${dayJi}일주` : '신사일주');
        
        // 3. 신강/신약
        const tenGods = reportData.saju.tenGods;
        if (tenGods) {
            const selfResource = (tenGods.self || 0) + (tenGods.resource || 0);
            const threshold = selfResource > 10 ? 40 : 4;
            tags.push(selfResource >= threshold ? '신강사주' : '신약사주');
        } else {
            tags.push('신강사주');
        }
        
        // 4. 격국 (월지 지장간 및 천간 투출 기반 정밀 격국)
        const GAN_INFO: Record<string, { element: string; polarity: string }> = {
            '갑': { element: 'wood', polarity: '+' }, '을': { element: 'wood', polarity: '-' },
            '병': { element: 'fire', polarity: '+' }, '정': { element: 'fire', polarity: '-' },
            '무': { element: 'earth', polarity: '+' }, '기': { element: 'earth', polarity: '-' },
            '경': { element: 'metal', polarity: '+' }, '신': { element: 'metal', polarity: '-' },
            '임': { element: 'water', polarity: '+' }, '계': { element: 'water', polarity: '-' }
        };
        
        const getTenGod = (dGan: string, tGan: string): string => {
            const d = GAN_INFO[dGan];
            const t = GAN_INFO[tGan] || GAN_INFO[tGan.slice(0, 1)];
            if (!d || !t) return '비견';
            const samePolarity = d.polarity === t.polarity;
            if (d.element === t.element) return samePolarity ? '비견' : '겁재';
            const saeng: Record<string, string> = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' };
            if (saeng[d.element] === t.element) return samePolarity ? '식신' : '상관';
            const geuk: Record<string, string> = { wood: 'earth', fire: 'metal', earth: 'water', metal: 'wood', water: 'fire' };
            if (geuk[d.element] === t.element) return samePolarity ? '편재' : '정재';
            if (saeng[t.element] === d.element) return samePolarity ? '편인' : '정인';
            if (geuk[t.element] === d.element) return samePolarity ? '편관' : '정관';
            return '비견';
        };

        const getGyeokguk = (dGan: string, mJi: string, yGan: string, mGan: string, tGan: string): string => {
            const jijanggan: Record<string, { main: string; middle?: string; initial: string }> = {
                '자': { main: '계', initial: '임' },
                '축': { main: '기', middle: '신', initial: '계' },
                '인': { main: '갑', middle: '병', initial: '무' },
                '묘': { main: '을', initial: '갑' },
                '진': { main: '무', middle: '계', initial: '을' },
                '사': { main: '병', middle: '경', initial: '무' },
                '오': { main: '정', middle: '기', initial: '병' },
                '미': { main: '기', middle: '을', initial: '정' },
                '신': { main: '경', middle: '임', initial: '무' },
                '유': { main: '신', initial: '경' },
                '술': { main: '무', middle: '신', initial: '정' },
                '해': { main: '임', middle: '갑', initial: '무' }
            };
            const jj = jijanggan[mJi];
            if (!jj) return '비견격';
            const candidates = [jj.main, jj.middle, jj.initial].filter(Boolean) as string[];
            const heavenGans = [yGan, mGan, tGan];
            for (const cand of candidates) {
                if (heavenGans.includes(cand)) {
                    return `${getTenGod(dGan, cand)}격`;
                }
            }
            return `${getTenGod(dGan, jj.main)}격`;
        };

        const gyeokguk = getGyeokguk(dayGan, monthJi, yearGan, monthGan, timeGan);
        tags.push(gyeokguk);

        // 5. 공망 분석 추가
        const getGongmang = (dGan: string, dJi: string) => {
            const gans = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
            const jis = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
            const gIdx = gans.indexOf(dGan);
            const jIdx = jis.indexOf(dJi);
            if (gIdx === -1 || jIdx === -1) return { chars: [] as string[], name: '' };
            const diff = (jIdx - gIdx + 12) % 12;
            let idx1 = 0, idx2 = 0;
            if (diff === 0) { idx1 = 10; idx2 = 11; } // 술해
            else if (diff === 10) { idx1 = 8; idx2 = 9; } // 신유
            else if (diff === 8) { idx1 = 6; idx2 = 7; } // 오미
            else if (diff === 6) { idx1 = 4; idx2 = 5; } // 진사
            else if (diff === 4) { idx1 = 2; idx2 = 3; } // 인묘
            else if (diff === 2) { idx1 = 0; idx2 = 1; } // 자축
            return {
                chars: [jis[idx1], jis[idx2]],
                name: `${jis[idx1]}${jis[idx2]}공망`
            };
        };

        const gongmangInfo = getGongmang(dayGan, dayJi);
        if (gongmangInfo.name) {
            tags.push(gongmangInfo.name);
            const activeGongmangs: string[] = [];
            if (gongmangInfo.chars.includes(yearJi)) activeGongmangs.push('년지공망');
            if (gongmangInfo.chars.includes(monthJi)) activeGongmangs.push('월지공망');
            if (gongmangInfo.chars.includes(dayJi)) activeGongmangs.push('일지공망');
            if (gongmangInfo.chars.includes(timeJi)) activeGongmangs.push('시지공망');
            activeGongmangs.forEach(g => tags.push(g));
        }

        return tags;
    }, [reportData, parsedFourPillars]);
    
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const LOADING_LOGS = [
        '⚡ [SYSTEM] FPTI_CORE_COMPILER V2.0 로딩 완료.',
        `📂 [DATA] 사용자 프로필 연동 완료 (${userProfile?.userName || '익명'}님 마운트)`,
        '🧠 [NEURAL] DMN(디폴트 모드 네트워크) 활성 비율 계산 중...',
        '📊 [ALGORITHM] 오행(五行) 에너지 행렬 벡터 정밀 투영 중...',
        '🌱 [PROCESS] 목(木) 성향 지표 분석 완료...',
        '🔥 [PROCESS] 화(火) 성향 지표 분석 완료...',
        '⛰️ [PROCESS] 토(土) 성향 지표 분석 완료...',
        '🛡️ [PROCESS] 금(金) 성향 지표 분석 완료...',
        '🌊 [PROCESS] 수(水) 성향 지표 분석 완료...',
        '⚙️ [PRESCRIPTION] FPTI 명심 행동 코드 빌드 완료.',
        '🚀 [SYSTEM] 명심 FPTI 아키텍처 매핑 정렬 성공!'
    ];

    // BGM 오디오 제어
    useEffect(() => {
        if (isOpen) {
            audioRef.current = new Audio('/sounds/528hz_healing_bgm.mp3');
            audioRef.current.loop = true;
            audioRef.current.volume = 0.4;
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
                setIsBgmPlaying(false);
            }
            // 모달이 닫힐 때 상태 리셋
            setStep(0);
            setCurrentQuestion(0);
            setAnswers({ wood: 0, fire: 0, earth: 0, metal: 0, water: 0 });
            setPsychologyScores({
                mbti: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
                enneagram: { gut: 0, heart: 0, head: 0 },
                bigFive: { O: 0, C: 0, E: 0, A: 0, N: 0 }
            });
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [isOpen]);

    const toggleBgm = () => {
        if (!audioRef.current) return;
        if (isBgmPlaying) {
            audioRef.current.pause();
            setIsBgmPlaying(false);
        } else {
            audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
            setIsBgmPlaying(true);
        }
    };

    // 로딩 시퀀스 제어
    useEffect(() => {
        if (step === 2) {
            setLoadingLogIndex(0);
            const interval = setInterval(() => {
                setLoadingLogIndex(prev => {
                    if (prev >= LOADING_LOGS.length - 1) {
                        clearInterval(interval);
                        // 최다 득점 유형 연산 (선천 사주 + 후천 설문 결합 기준)
                        const maxElement = Object.keys(combined).reduce((a, b) => 
                            combined[a as ElementKey] >= combined[b as ElementKey] ? a : b
                        ) as ElementKey;
                        setResultType(maxElement);

                        const newAvatar = `${fptiCodes[maxElement].code} (${fptiCodes[maxElement].name})`;
                        fetchCrossoverReport(newAvatar);

                        setTimeout(() => setStep(3), 800); // 마지막 로그 출력 후 0.8초 후 결과창으로
                        return prev;
                    }
                    return prev + 1;
                });
            }, 300);
            return () => clearInterval(interval);
        }
    }, [step, combined]);

    if (!isOpen) return null;

    const handleAnswerSelect = (option: any) => {
        const key = option.key as ElementKey;
        const meta = OHAENG_METADATA[key] || {};

        setAnswers(prev => ({
            ...prev,
            [key]: prev[key] + 1
        }));

        // MBTI 가중치 누적
        const mbtiList = option.mbti || meta.mbti;
        if (mbtiList) {
            setPsychologyScores(prev => {
                const newMbti = { ...prev.mbti };
                mbtiList.forEach((m: keyof typeof newMbti) => {
                    if (newMbti[m] !== undefined) {
                        newMbti[m] += 1;
                    }
                });
                return { ...prev, mbti: newMbti };
            });
        }

        // 에니어그램 가중치 누적
        const enneagramVal = option.enneagram || meta.enneagram;
        if (enneagramVal) {
            setPsychologyScores(prev => {
                const newEnneagram = { ...prev.enneagram };
                const enne = enneagramVal as keyof typeof newEnneagram;
                if (newEnneagram[enne] !== undefined) {
                    newEnneagram[enne] += 1;
                }
                return { ...prev, enneagram: newEnneagram };
            });
        }

        // Big Five 가중치 누적
        const bigFiveVal = option.bigFive || meta.bigFive;
        if (bigFiveVal) {
            setPsychologyScores(prev => {
                const newBigFive = { ...prev.bigFive };
                Object.entries(bigFiveVal).forEach(([k, v]) => {
                    const bfKey = k as keyof typeof newBigFive;
                    if (newBigFive[bfKey] !== undefined) {
                        newBigFive[bfKey] += (v as number);
                    }
                });
                return { ...prev, bigFive: newBigFive };
            });
        }

        if (currentQuestion < questionsList.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setStep(2); // 로딩 시퀀스로 이동
        }
    };

    const handleRetest = () => {
        setAnswers({ wood: 0, fire: 0, earth: 0, metal: 0, water: 0 });
        setPsychologyScores({
            mbti: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
            enneagram: { gut: 0, heart: 0, head: 0 },
            bigFive: { O: 0, C: 0, E: 0, A: 0, N: 0 }
        });
        setCurrentQuestion(0);
        setStep(1);
        fetchDynamicQuestions(); // 재테스트 진행 시 새 일진 퀴즈 Fetch
    };

    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0) || 1;
    const currentResult = ELEMENT_DATA[resultType];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[3500] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto">
                {/* 메인 카드 패널 */}
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-lg shadow-[0_15px_50px_rgba(0,0,0,0.8)] relative flex flex-col overflow-hidden max-h-[92vh]"
                >
                    {/* 상단 헤더 탭 */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-900 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
                        <div className="flex items-center gap-2">
                            <span className="text-teal-400 text-sm font-mono font-bold">SYS-FPTI V2.0</span>
                            <span className="h-3 w-[1px] bg-slate-800"></span>
                            <span className="text-slate-300 text-xs font-semibold">명심 운명 성향 해독기</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {/* BGM 컨트롤 버튼 */}
                            <button
                                onClick={toggleBgm}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] border font-mono transition-all ${
                                    isBgmPlaying 
                                    ? 'bg-teal-500/10 text-teal-400 border-teal-500/30 shadow-[0_0_10px_rgba(20,184,166,0.15)]' 
                                    : 'bg-slate-900 text-slate-500 border-slate-800'
                                }`}
                            >
                                {isBgmPlaying ? (
                                    <>
                                        <span className="flex gap-[2px] items-end h-2 w-2.5">
                                            <span className="w-[1.5px] bg-teal-400 animate-[bounce_0.8s_infinite_100ms] h-full"></span>
                                            <span className="w-[1.5px] bg-teal-400 animate-[bounce_0.8s_infinite_300ms] h-2/3"></span>
                                            <span className="w-[1.5px] bg-teal-400 animate-[bounce_0.8s_infinite_500ms] h-1/2"></span>
                                        </span>
                                        <span>528Hz ON</span>
                                    </>
                                ) : (
                                    <>
                                        <Play size={10} className="fill-slate-500" />
                                        <span>528Hz BGM</span>
                                    </>
                                )}
                            </button>

                            {/* 닫기 버튼 */}
                            <button
                                onClick={onClose}
                                className="bg-slate-900 p-1.5 rounded-full text-slate-400 hover:text-white border border-slate-800 transition-all hover:bg-slate-850"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* 스크롤 가능한 본문 영역 */}
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
                        {/* 0. INTRO SCREEN */}
                        {step === 0 && (
                            <div className="flex flex-col items-center text-center py-6">
                                <div className="relative mb-6">
                                    {/* 신비로운 오행 다이어그램 느낌의 그래픽 효과 */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 via-indigo-500/20 to-purple-500/20 blur-2xl rounded-full w-32 h-32 -z-10 animate-[pulse_3s_infinite]"></div>
                                    <div className="w-24 h-24 rounded-2xl border border-teal-500/20 flex items-center justify-center bg-slate-950 shadow-[0_0_30px_rgba(20,184,166,0.1)] relative">
                                        <span className="text-4xl">🔮</span>
                                        <div className="absolute -top-1 -right-1 flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                                        </div>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-2 font-premium tracking-tight">
                                    내 타고난 운명 성향 해독기 (FPTI)
                                </h2>
                                <h3 className="text-teal-400 text-xs font-mono mb-4 tracking-widest uppercase">
                                    Fate Personality Type Indicator
                                </h3>

                                <p className="text-slate-400 text-xs leading-relaxed max-w-sm mb-8 break-keep">
                                    선천적으로 타고난 동양의 <strong>오행(五행: 목·화·토·금·수) 에너지 밸런스</strong>와 내 사주의 핵심인 <strong>일주(日柱) 기운</strong>을 정밀 연산하여, 나만의 동양풍 아바타 카드와 맞춤 운명 처방전을 컴파일합니다.
                                </p>

                                <button
                                    onClick={() => setStep(1)}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold text-sm transition-all hover:shadow-[0_0_30px_rgba(20,184,166,0.3)] flex items-center justify-center gap-2 group"
                                >
                                    <span>운명 아키텍처 해독 시작</span>
                                    <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}

                        {/* 1. QUIZ SCREEN */}
                        {step === 1 && (
                            <div className="flex flex-col py-2">
                                {isLoadingQuestions ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="relative w-16 h-16 mb-6">
                                            <div className="absolute inset-0 rounded-full border-2 border-teal-500/10" />
                                            <div className="absolute inset-0 rounded-full border-2 border-t-teal-400 animate-[spin_1.5s_linear_infinite]" />
                                            <div className="absolute inset-2 rounded-full border border-sky-400/20 animate-[spin_3s_reverse_linear_infinite]" />
                                            <span className="absolute inset-0 flex items-center justify-center text-xl">🔮</span>
                                        </div>
                                        <h4 className="text-teal-400 font-bold text-sm mb-2 font-premium">오늘의 일진 주파수 정렬 중...</h4>
                                        <p className="text-slate-400 text-[11px] leading-relaxed max-w-xs break-keep">
                                            {todayUngi ? `오늘의 일진(${todayUngi.dayGanZhi}일)` : '오늘의 우주 기운'}과 당신의 타고난 사주팔자, 그리고 현재의 피로도를 분석하여 맞춤형 운명 해독 문항을 동적으로 생성하고 있습니다.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {/* 진행바 */}
                                        <div className="mb-6">
                                            <div className="flex justify-between items-center text-xs text-slate-500 font-mono mb-2">
                                                <span>QUESTION {String(currentQuestion + 1).padStart(2, '0')} / {questionsList.length}</span>
                                                <span className="text-teal-400">{Math.round(((currentQuestion + 1) / questionsList.length) * 100)}%</span>
                                            </div>
                                            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
                                                    style={{ width: `${((currentQuestion + 1) / questionsList.length) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* 질문 내용 */}
                                        <div className="mb-6 min-h-[90px]">
                                            <h3 className="text-white text-md font-semibold leading-relaxed break-keep flex gap-2">
                                                <HelpCircle size={18} className="text-teal-400 shrink-0 mt-0.5" />
                                                <span>{questionsList[currentQuestion]?.q}</span>
                                            </h3>
                                        </div>

                                        {/* 보기 선택지 */}
                                        <div className="flex flex-col gap-3">
                                            {questionsList[currentQuestion]?.options.map((option: any, idx: number) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleAnswerSelect(option)}
                                                    className="w-full text-left p-4 rounded-xl border border-slate-900 hover:border-slate-850 bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white text-xs leading-normal transition-all duration-200 flex items-start gap-3 group active:scale-[0.99]"
                                                >
                                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-500 group-hover:text-teal-400 group-hover:border-teal-500/30 shrink-0">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="break-keep">{option.text}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* 2. LOADING SCREEN */}
                        {step === 2 && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="relative mb-8">
                                    {/* 로딩 애니메이션 링 */}
                                    <div className="w-16 h-16 rounded-full border-2 border-teal-500/10 border-t-teal-400 animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-lg">🔮</div>
                                </div>

                                <div className="w-full max-w-sm bg-slate-950 border border-slate-900 rounded-xl p-4 font-mono text-[10px] text-slate-400 h-40 overflow-y-auto flex flex-col gap-1 shadow-inner custom-scrollbar">
                                    {LOADING_LOGS.slice(0, loadingLogIndex + 1).map((log, idx) => (
                                        <div key={idx} className={`${idx === loadingLogIndex ? 'text-teal-400 animate-[pulse_1.5s_infinite]' : 'text-slate-400'}`}>
                                            {log}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 3. RESULT SCREEN */}
                        {step === 3 && (
                            <div className="flex flex-col py-2">
                                {/* 신비로운 오리엔탈 FPTI 아바타 카드 */}
                                <div className={`w-full rounded-3xl border bg-slate-950/65 p-6 flex flex-col items-center text-center relative overflow-hidden mb-5 ${currentResult.bgGlow} border-teal-500/20 backdrop-blur-md`}>
                                    {/* 프리미엄 골드 프레임 오버레이 */}
                                    <div className="absolute inset-0 border border-amber-500/10 rounded-3xl pointer-events-none m-1.5" />
                                    <div className="absolute top-2 right-4 text-[9px] font-mono text-amber-500/60 uppercase tracking-widest">FPTI AVATAR CARD</div>
                                    
                                    {/* 꼬마 마법사 아바타 합성 그래픽 */}
                                    <div className="relative w-28 h-28 mx-auto my-3 flex items-center justify-center">
                                         {/* 백그라운드 오라 광원 효과 */}
                                         <div className={`absolute inset-2 rounded-full blur-xl opacity-60 animate-[pulse_2.5s_infinite] ${
                                             resultType === 'wood' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                                             resultType === 'fire' ? 'bg-gradient-to-r from-rose-500 to-orange-500' :
                                             resultType === 'earth' ? 'bg-gradient-to-r from-amber-500 to-yellow-600' :
                                             resultType === 'metal' ? 'bg-gradient-to-r from-slate-300 to-zinc-500' :
                                             'bg-gradient-to-r from-sky-500 to-blue-600'
                                         }`} />
                                         {/* 아바타 테두리 링 */}
                                         <div className="absolute inset-0 rounded-full border border-dashed border-teal-500/20 animate-[spin_30s_linear_infinite]" />
                                         <div className="absolute inset-1 rounded-full border border-double border-amber-500/20 animate-[spin_15s_linear_infinite_reverse]" />
                                         
                                         {/* 아바타 본체 서클 */}
                                         <div className="relative w-20 h-20 bg-slate-900/95 rounded-full border border-slate-800/80 flex items-center justify-center shadow-lg overflow-hidden group">
                                             <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-500 via-transparent to-transparent" />
                                             
                                             {/* 아바타 이모지 */}
                                             <span className="text-4xl select-none z-10 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] transform group-hover:scale-110 transition-transform duration-300">
                                                 {fptiCodes[resultType].avatar}
                                             </span>
                                             
                                             {/* 데코레이션 요소 */}
                                             <span className="absolute bottom-1 right-2 text-md z-20 animate-[bounce_2s_infinite_300ms]">👻</span>
                                             <span className="absolute top-1 left-2 text-md z-20 animate-[pulse_1.2s_infinite]">🪐</span>
                                         </div>
                                     </div>
                                     
                                     {/* FPTI 기질 구분 배지 */}
                                     <div className={`text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border mb-3 font-bold ${currentResult.badgeBg}`}>
                                         {currentResult.chinese} 오행 핵심 운명
                                     </div>
                                     
                                     {/* FPTI 코드 및 명칭 */}
                                     <h3 className="text-white text-xl font-extrabold mb-1 font-premium tracking-wide">
                                         FPTI: <span className="text-teal-400">{fptiCodes[resultType].code}</span> ({fptiCodes[resultType].name})
                                     </h3>
                                     <p className="text-slate-400 text-xs break-keep font-medium mb-4">{currentResult.tagline}</p>
                                     
                                     {/* 사주 칩 배지 렌더링 영역 (스카이블루 톤 + 클릭 인터랙션) */}
                                     <div className="flex flex-wrap gap-2 justify-center w-full mt-1">
                                         {sajuTags.map((tag, idx) => (
                                             <button 
                                                 key={idx}
                                                 onClick={() => setActiveSajuTagDetail(getSajuTagDescription(tag))}
                                                 className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 hover:border-sky-400/40 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-tight shadow-sm hover:scale-[1.03] active:scale-95 transition-all cursor-pointer flex items-center gap-1 group"
                                                 title={`${tag} 상세 설명 보기`}
                                             >
                                                 <span>{tag}</span>
                                                 <span className="text-[9px] opacity-40 group-hover:opacity-100 group-hover:text-sky-300 transition-opacity">🔍</span>
                                             </button>
                                         ))}
                                     </div>
                                </div>

                                {/* 4대 탭 바 시스템 */}
                                <div className="flex bg-slate-950 border border-slate-900 rounded-2xl p-1 mb-5 gap-1 sticky top-0 z-40 backdrop-blur-md">
                                    {[
                                        { id: 'summary', name: '종합 요약', icon: '✨' },
                                        { id: 'saju', name: '선천 (사주)', icon: '🧭' },
                                        { id: 'psychology', name: '후천 (심리)', icon: '🧠' },
                                        { id: 'ai', name: '교차 분석', icon: '🔮' }
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={`flex-1 py-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
                                                activeTab === tab.id
                                                ? 'bg-gradient-to-r from-teal-500/10 to-emerald-600/10 text-teal-400 border border-teal-500/20 shadow-[0_0_10px_rgba(20,184,166,0.1)]'
                                                : 'text-slate-500 border border-transparent hover:text-slate-350'
                                            }`}
                                        >
                                            <span>{tab.icon}</span>
                                            <span>{tab.name}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* 탭 콘텐츠 렌더링 분기 */}
                                {activeTab === 'summary' && (
                                    <div className="flex flex-col gap-5">
                                        {/* 조화도 지수 */}
                                        {crossoverResult && (
                                            <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-transparent pointer-events-none" />
                                                <div className="relative shrink-0 flex items-center justify-center w-14 h-14 rounded-full border-2 border-teal-500/20 bg-slate-950 text-white font-mono font-bold text-sm">
                                                    {crossoverResult.harmonyScore}%
                                                    <div className="absolute inset-0 rounded-full border border-t-teal-400 animate-[spin_4s_linear_infinite]" />
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[9px] font-mono text-teal-400 tracking-wider">HARMONY INDEX</span>
                                                    <span className="text-white text-xs font-bold leading-normal break-keep">선천 기질과 후천 성향의 조화도</span>
                                                    <span className="text-slate-400 text-[9.5px] leading-normal break-keep">사주의 선천적 오행 그릇과 설문을 통해 발현된 현대 심리 성향이 조화를 이루는 비율입니다.</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* AI 총평 요약 */}
                                        <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl relative overflow-hidden">
                                            <h4 className="text-white text-xs font-semibold mb-3 flex items-center gap-1.5 font-premium">
                                                <span>✨</span>
                                                <span>종합 운명 우주 총평</span>
                                            </h4>
                                            {isAiLoading ? (
                                                <div className="flex flex-col items-center justify-center py-6 gap-2">
                                                    <div className="w-5 h-5 rounded-full border-2 border-teal-500/10 border-t-teal-400 animate-spin" />
                                                    <span className="text-slate-500 text-[10px] font-mono">AI COMPILING ANALYSIS...</span>
                                                </div>
                                            ) : crossoverResult ? (
                                                <p className="text-slate-300 text-[11px] leading-relaxed break-keep whitespace-pre-line">
                                                    {crossoverResult.analysisIntro}
                                                </p>
                                            ) : (
                                                <span className="text-slate-500 text-[10px]">종합 분석을 준비 중입니다.</span>
                                            )}
                                        </div>

                                        {/* FPTI 상세 설명 및 만세력 가이드 버튼 2개 추가 */}
                                        <div className="grid grid-cols-2 gap-2.5">
                                            <button
                                                onClick={() => setShowFptiDetail(true)}
                                                className="py-3 px-4 rounded-xl border border-slate-900 hover:border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white font-medium text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                            >
                                                <span>📖</span>
                                                <span>FPTI 코드 해독서</span>
                                            </button>
                                            <button
                                                onClick={() => setShowManseGuide(true)}
                                                className="py-3 px-4 rounded-xl border border-slate-900 hover:border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white font-medium text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                            >
                                                <span>🧭</span>
                                                <span>만세력 리포트 가이드</span>
                                            </button>
                                        </div>

                                        {/* 강점 */}
                                        <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl">
                                            <h5 className="text-teal-400 text-xs font-semibold mb-2.5 flex items-center gap-1">
                                                <CheckCircle2 size={12} />
                                                <span>타고난 강점 및 능력</span>
                                            </h5>
                                            <ul className="flex flex-col gap-1.5">
                                                {dynamicTraits.map((t: any, i: number) => (
                                                    <li key={i} className="text-slate-300 text-[11px] leading-relaxed flex items-start gap-1.5 break-keep">
                                                        <span className="text-teal-500 shrink-0 mt-0.5">•</span>
                                                        <span>{t}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* 약점 */}
                                        <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl">
                                            <h5 className="text-rose-400 text-xs font-semibold mb-2.5 flex items-center gap-1">
                                                <X size={12} />
                                                <span>취약한 지주(Throttling) 패턴</span>
                                            </h5>
                                            <ul className="flex flex-col gap-1.5">
                                                {dynamicWeaknesses.map((w: any, i: number) => (
                                                    <li key={i} className="text-slate-300 text-[11px] leading-relaxed flex items-start gap-1.5 break-keep">
                                                        <span className="text-rose-500 shrink-0 mt-0.5">•</span>
                                                        <span>{w}</span>
                                                     </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'saju' && (
                                    <div className="flex flex-col gap-5">
                                        {/* 동양풍 만세력 4주 8글자 비주얼 카드 그리드 */}
                                        <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl">
                                            <h4 className="text-white text-xs font-semibold mb-4 flex items-center gap-1.5">
                                                <span>☯️</span>
                                                <span>선천 사주 팔자 (四柱八字) 원국</span>
                                            </h4>
                                            
                                            <div className="grid grid-cols-4 gap-2 mb-4">
                                                {[
                                                    { name: '시주', key: 'time' },
                                                    { name: '일주', key: 'day' },
                                                    { name: '월주', key: 'month' },
                                                    { name: '년주', key: 'year' }
                                                ].map(pillar => {
                                                    const p = parsedFourPillars[pillar.key as 'year' | 'month' | 'day' | 'time'];
                                                    return (
                                                        <div key={pillar.key} className="flex flex-col border border-slate-900 rounded-xl overflow-hidden bg-slate-950 text-center font-mono">
                                                            <div className="bg-slate-900 py-1 text-[9px] text-slate-500 font-semibold">{pillar.name}</div>
                                                            
                                                            {/* 천간 */}
                                                            <div className="py-2.5 border-b border-slate-900/60 relative" style={{ color: p.ganColor }}>
                                                                <span className="text-[8px] absolute top-1 right-1.5 opacity-40">{p.ganLabel}</span>
                                                                <div className="text-lg font-bold">{p.ganHanja || p.gan}</div>
                                                                <div className="text-[10px] text-slate-400 mt-0.5">{p.gan}</div>
                                                            </div>
                                                            
                                                            {/* 지지 */}
                                                            <div className="py-2.5 relative" style={{ color: p.jiColor }}>
                                                                <span className="text-[8px] absolute top-1 right-1.5 opacity-40">{p.jiLabel}</span>
                                                                <div className="text-lg font-bold">{p.jiHanja || p.ji}</div>
                                                                <div className="text-[10px] text-slate-400 mt-0.5">{p.ji}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* 오행 분포 1줄 요약 */}
                                            <div className="h-[1px] bg-slate-900 my-4" />
                                            <h4 className="text-slate-400 text-[10px] font-semibold mb-3 flex items-center gap-1">
                                                <span>📊</span>
                                                <span>오행 에너지 비율 (선천+후천 누적)</span>
                                            </h4>
                                            <div className="flex flex-col gap-2.5">
                                                {(Object.keys(ELEMENT_DATA) as ElementKey[]).map((key) => {
                                                    const score = combined[key];
                                                    const pct = Math.round((score / combinedTotal) * 100);
                                                    const info = ELEMENT_DATA[key];
                                                    const isDominant = key === resultType;
                                                    const birthScore = birthOhaeng[key] || 0;
                                                    const quizScore = answers[key] || 0;
                                                    
                                                    const barColorMap: Record<ElementKey, string> = {
                                                        wood: 'bg-emerald-500',
                                                        fire: 'bg-rose-500',
                                                        earth: 'bg-amber-500',
                                                        metal: 'bg-slate-400',
                                                        water: 'bg-sky-500'
                                                    };

                                                    return (
                                                        <div key={key} className="flex flex-col gap-1">
                                                            <div className="flex justify-between items-center text-[10px]">
                                                                <span className={`flex items-center gap-1 font-semibold ${isDominant ? 'text-white' : 'text-slate-450'}`}>
                                                                    <span>{info.icon}</span>
                                                                    <span>{info.name}({info.chinese})</span>
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-slate-500 text-[8.5px]">
                                                                        (선천 {birthScore} + 후천 {quizScore})
                                                                    </span>
                                                                    <span className={`font-mono ${isDominant ? 'text-teal-400' : 'text-slate-500'}`}>{pct}%</span>
                                                                </div>
                                                            </div>
                                                            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                                                                <div 
                                                                    className={`h-full ${barColorMap[key]} transition-all duration-1000`}
                                                                    style={{ width: `${pct}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* AI 선천 사주 분석 텍스트 */}
                                        <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl">
                                            <h4 className="text-white text-xs font-semibold mb-3 flex items-center gap-1.5">
                                                <span>🧭</span>
                                                <span>선천 기질의 에너지 흐름 해독</span>
                                            </h4>
                                            {isAiLoading ? (
                                                <div className="flex flex-col items-center justify-center py-6 gap-2">
                                                    <div className="w-5 h-5 rounded-full border-2 border-teal-500/10 border-t-teal-400 animate-spin" />
                                                    <span className="text-slate-500 text-[10px]">AI DECODING SAJU...</span>
                                                </div>
                                            ) : crossoverResult ? (
                                                <p className="text-slate-300 text-[11px] leading-relaxed break-keep whitespace-pre-line">
                                                    {crossoverResult.sajuAnalysis}
                                                </p>
                                            ) : (
                                                <span className="text-slate-500 text-[10px]">사주 데이터를 분석 중입니다.</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'psychology' && (
                                    <div className="flex flex-col gap-5">
                                        {/* 후천 심리 지표 시각화 차트 */}
                                        <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl flex flex-col gap-4">
                                            <h4 className="text-white text-xs font-semibold mb-1 flex items-center gap-1.5">
                                                <span>🧠</span>
                                                <span>후천적 성격 구조 (심리 스코어)</span>
                                            </h4>

                                            {/* 1. 16가지 성격 성향 지표 게이지 */}
                                            <div className="flex flex-col gap-2.5 border-b border-slate-900 pb-4">
                                                <span className="text-[9px] font-mono text-teal-400 tracking-wider uppercase">16 PERSONALITY DIMENSIONS</span>
                                                {[
                                                    { labelL: 'E (외향)', labelR: 'I (내향)', pctL: mbtiPercents.E, pctR: mbtiPercents.I },
                                                    { labelL: 'N (직관)', labelR: 'S (감각)', pctL: mbtiPercents.N, pctR: mbtiPercents.S },
                                                    { labelL: 'F (감정)', labelR: 'T (사고)', pctL: mbtiPercents.F, pctR: mbtiPercents.T },
                                                    { labelL: 'P (인식)', labelR: 'J (판단)', pctL: mbtiPercents.P, pctR: mbtiPercents.J }
                                                ].map((dim, idx) => (
                                                    <div key={idx} className="flex flex-col gap-1">
                                                        <div className="flex justify-between text-[9px] text-slate-400 font-medium">
                                                            <span>{dim.labelL} {dim.pctL}%</span>
                                                            <span>{dim.pctR}% {dim.labelR}</span>
                                                        </div>
                                                        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden flex">
                                                            <div className="h-full bg-teal-500 transition-all duration-1000" style={{ width: `${dim.pctL}%` }} />
                                                            <div className="h-full bg-slate-800 transition-all duration-1000" style={{ width: `${dim.pctR}%` }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* 2. 에니어그램 삼중추 비율 누적 바 */}
                                            <div className="flex flex-col gap-2.5 border-b border-slate-900 pb-4">
                                                <span className="text-[9px] font-mono text-teal-400 tracking-wider uppercase">ENNEAGRAM CENTERS</span>
                                                <div className="flex justify-between text-[9px] text-slate-455">
                                                    <span className="text-emerald-400">장형(행동) {enneagramPercents.gut}%</span>
                                                    <span className="text-rose-400">가슴형(감정) {enneagramPercents.heart}%</span>
                                                    <span className="text-sky-400">머리형(사색) {enneagramPercents.head}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden flex">
                                                    <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${enneagramPercents.gut}%` }} />
                                                    <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${enneagramPercents.heart}%` }} />
                                                    <div className="h-full bg-sky-500 transition-all duration-1000" style={{ width: `${enneagramPercents.head}%` }} />
                                                </div>
                                            </div>

                                            {/* 3. Big Five 5대 성향 게이지 */}
                                            <div className="flex flex-col gap-2.5">
                                                <span className="text-[9px] font-mono text-teal-400 tracking-wider uppercase">BIG FIVE METRICS</span>
                                                {[
                                                    { name: '경험 개방성 (Openness)', val: bigFivePercents.O, color: 'bg-teal-500' },
                                                    { name: '목표 성실성 (Conscientiousness)', val: bigFivePercents.C, color: 'bg-emerald-500' },
                                                    { name: '자극 외향성 (Extraversion)', val: bigFivePercents.E, color: 'bg-rose-500' },
                                                    { name: '대인 친화성 (Agreeableness)', val: bigFivePercents.A, color: 'bg-amber-500' },
                                                    { name: '정서 불안정 (Neuroticism)', val: bigFivePercents.N, color: 'bg-red-500' }
                                                ].map((bf, idx) => (
                                                    <div key={idx} className="flex flex-col gap-1">
                                                        <div className="flex justify-between text-[9px] text-slate-400">
                                                            <span>{bf.name}</span>
                                                            <span className="font-mono text-white">{bf.val}%</span>
                                                        </div>
                                                        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                                                            <div className={`h-full ${bf.color} transition-all duration-1000`} style={{ width: `${bf.val}%` }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* 4. DISC 행동 성향 지표 게이지 */}
                                            <div className="flex flex-col gap-2.5 border-t border-slate-900 pt-4">
                                                <span className="text-[9px] font-mono text-teal-400 tracking-wider uppercase">DISC BEHAVIOR PATTERNS</span>
                                                {[
                                                    { name: 'D (주도형 - Dominance)', val: discScores.D, color: 'bg-gradient-to-r from-red-500 to-rose-400' },
                                                    { name: 'I (사교형 - Influence)', val: discScores.I, color: 'bg-gradient-to-r from-pink-500 to-purple-400' },
                                                    { name: 'S (안정형 - Steadiness)', val: discScores.S, color: 'bg-gradient-to-r from-teal-500 to-emerald-400' },
                                                    { name: 'C (신중형 - Conscientiousness)', val: discScores.C, color: 'bg-gradient-to-r from-blue-500 to-indigo-400' }
                                                ].map((disc, idx) => (
                                                    <div key={idx} className="flex flex-col gap-1">
                                                        <div className="flex justify-between text-[9px] text-slate-400 font-medium">
                                                            <span>{disc.name}</span>
                                                            <span className="font-mono text-white">{disc.val}%</span>
                                                        </div>
                                                        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                                                            <div className={`h-full ${disc.color} transition-all duration-1000`} style={{ width: `${disc.val}%` }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* 5. Holland 직업적성 흥미 6대 유형 게이지 */}
                                            <div className="flex flex-col gap-2.5 border-t border-slate-900 pt-4">
                                                <span className="text-[9px] font-mono text-teal-400 tracking-wider uppercase">HOLLAND CAREER INTERESTS (RIASEC)</span>
                                                {[
                                                    { name: 'R (현실형 - Realistic)', val: hollandScores.R, color: 'bg-orange-500' },
                                                    { name: 'I (탐구형 - Investigative)', val: hollandScores.I, color: 'bg-sky-500' },
                                                    { name: 'A (예술형 - Artistic)', val: hollandScores.A, color: 'bg-violet-500' },
                                                    { name: 'S (사회형 - Social)', val: hollandScores.S, color: 'bg-emerald-500' },
                                                    { name: 'E (기업가형 - Enterprising)', val: hollandScores.E, color: 'bg-amber-500' },
                                                    { name: 'C (관습형 - Conventional)', val: hollandScores.C, color: 'bg-slate-400' }
                                                ].map((hol, idx) => (
                                                    <div key={idx} className="flex flex-col gap-1">
                                                        <div className="flex justify-between text-[9px] text-slate-400 font-medium">
                                                            <span>{hol.name}</span>
                                                            <span className="font-mono text-white">{hol.val}%</span>
                                                        </div>
                                                        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                                                            <div className={`h-full ${hol.color} transition-all duration-1000`} style={{ width: `${hol.val}%` }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* AI 후천 심리 분석 텍스트 */}
                                        <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl">
                                            <h4 className="text-white text-xs font-semibold mb-3 flex items-center gap-1.5">
                                                <span>🧠</span>
                                                <span>후천적 행동 경향 해독</span>
                                            </h4>
                                            {isAiLoading ? (
                                                <div className="flex flex-col items-center justify-center py-6 gap-2">
                                                    <div className="w-5 h-5 rounded-full border-2 border-teal-500/10 border-t-teal-400 animate-spin" />
                                                    <span className="text-slate-500 text-[10px]">AI PARSING PSYCHOLOGY...</span>
                                                </div>
                                            ) : crossoverResult ? (
                                                <p className="text-slate-300 text-[11px] leading-relaxed break-keep whitespace-pre-line">
                                                    {crossoverResult.psychologyAnalysis}
                                                </p>
                                            ) : (
                                                <span className="text-slate-500 text-[10px]">심리 지표를 분석 중입니다.</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'ai' && (
                                    <div className="flex flex-col gap-5">
                                        {/* AI 선천x후천 디버깅 분석 */}
                                        <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-b from-teal-500/[0.02] to-transparent pointer-events-none" />
                                            <h4 className="text-white text-xs font-semibold mb-3 flex items-center gap-1.5 font-premium">
                                                <span>🔮</span>
                                                <span>선천 기질 x 후천 성향 교차 디버깅</span>
                                            </h4>
                                            {isAiLoading ? (
                                                <div className="flex flex-col items-center justify-center py-10 gap-3">
                                                    <div className="w-6 h-6 rounded-full border-2 border-teal-500/10 border-t-teal-400 animate-spin" />
                                                    <span className="text-slate-500 text-[9px] font-mono tracking-widest animate-pulse">COMPILING CROSSOVER SYSTEM...</span>
                                                </div>
                                            ) : crossoverResult ? (
                                                <p className="text-slate-300 text-[11px] leading-relaxed break-keep whitespace-pre-line">
                                                    {crossoverResult.crossoverAnalysis}
                                                </p>
                                            ) : (
                                                <span className="text-slate-500 text-[10px]">교차 분석을 생성하는 중입니다.</span>
                                            )}
                                        </div>

                                        {/* 삶의 조율 가이드 처방전 */}
                                        <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-teal-500/20 p-5 rounded-2xl">
                                            <h4 className="text-white text-xs font-semibold mb-3 flex items-center gap-1.5">
                                                <span>🎯</span>
                                                <span>에고 조율 및 본질 회복 가이드</span>
                                            </h4>
                                            {isAiLoading ? (
                                                <div className="flex flex-col items-center justify-center py-6 gap-2">
                                                    <div className="w-5 h-5 rounded-full border-2 border-teal-500/10 border-t-teal-400 animate-spin" />
                                                    <span className="text-slate-500 text-[10px]">COMPILING GUIDE...</span>
                                                </div>
                                            ) : crossoverResult ? (
                                                <p className="text-slate-300 text-[11px] leading-relaxed break-keep whitespace-pre-line">
                                                    {crossoverResult.lifeGuide}
                                                </p>
                                            ) : (
                                                <span className="text-slate-500 text-[10px]">가이드를 생성 중입니다.</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* 하단 액션 버튼 */}
                                <div className="flex gap-2.5 mt-5 border-t border-slate-900 pt-5 sticky bottom-0 bg-slate-950/90 backdrop-blur-md pb-1 z-30">
                                    <button
                                        onClick={handleRetest}
                                        className="flex-1 py-3.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-400 hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                                    >
                                        <RotateCcw size={12} />
                                        <span>다시 분석하기</span>
                                    </button>
                                    
                                    <button
                                        onClick={() => {
                                            if (onApplyPlanner) {
                                                onApplyPlanner(resultType, answers, birthOhaeng, avatarCode);
                                            } else {
                                                onClose();
                                            }
                                        }}
                                        disabled={isAiLoading}
                                        className={`flex-[1.5] py-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] ${
                                            isAiLoading 
                                            ? 'bg-slate-900 text-slate-600 border border-slate-900 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:shadow-[0_0_20px_rgba(20,184,166,0.2)]'
                                        }`}
                                    >
                                        <span>맞춤 코칭 플래너 적용하기</span>
                                        <ChevronRight size={12} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FPTI 상세설명 팝업 */}
                    <AnimatePresence>
                        {showFptiDetail && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute inset-4 z-[3600] bg-slate-950/98 border border-slate-850 rounded-3xl p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md"
                            >
                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                                    <div className="flex justify-between items-center mb-5 border-b border-slate-900 pb-3">
                                        <h4 className="text-teal-400 font-bold text-sm font-premium flex items-center gap-2">
                                            <span>📖</span> FPTI 성향 코드 상세 해독
                                        </h4>
                                        <button 
                                            onClick={() => setShowFptiDetail(false)}
                                            className="p-1 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                    <div className="text-xs text-slate-300 space-y-3 font-sans break-keep leading-relaxed">
                                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-900/60 mb-2">
                                            <span className="text-white font-bold block mb-1 text-[13px]">유형 코드: {fptiCodes[resultType].code} ({fptiCodes[resultType].name})</span>
                                            <span className="text-slate-400">{fptiCodes[resultType].description}</span>
                                        </div>
                                        <p>
                                            <strong>FPTI (Fate Personality Type Indicator)</strong>는 동양의 전통 음양오행설(선천 기운)과 현대의 심리 검사(후천적 반응)를 결합하여 개발된 맞춤형 운명 성향 지표입니다.
                                        </p>
                                        <p>
                                            {resultType === 'wood' && "🌱 목(木) 성향은 스프링처럼 위로 솟구치고 뻗어나가는 기운입니다. 기획력과 추진력이 뛰어나지만, 끊임없이 성장해야 한다는 강박(번아웃)에 노출되기 쉽습니다."}
                                            {resultType === 'fire' && "🔥 화(火) 성향은 사방으로 확산되고 타오르는 기운입니다. 사교적이고 표현력이 풍부하지만, 감정이 쉽게 과열되어 대인관계 피로를 느낄 수 있습니다."}
                                            {resultType === 'earth' && "⛰️ 토(土) 성향은 모든 것을 받아들이고 조율하는 흙의 기운입니다. 중재력과 신뢰감이 높지만, 거절을 못 해 혼자 끙끙 앓는 성향이 있습니다."}
                                            {resultType === 'metal' && "🛡️ 금(金) 성향은 단단하게 응축되고 결단하는 쇠의 기운입니다. 완벽주의와 논리적인 원칙을 중시하지만, 지나친 통제 성향으로 긴장감이 높을 수 있습니다."}
                                            {resultType === 'water' && "🌊 수(水) 성향은 아래로 흐르고 모이는 물의 기운입니다. 통찰력과 직관력이 매우 뛰어나지만, 생각이 지나치게 많아 우울감이나 행동 저하에 빠지기 쉽습니다."}
                                        </p>
                                        <p className="bg-teal-950/20 text-teal-400 p-3.5 rounded-xl border border-teal-500/10 text-[11px] font-medium leading-relaxed">
                                            💡 <strong>명심 코칭 제안:</strong> 자신의 주기질 오행의 취약점을 디버깅하고, 에고(Ego)의 잡음을 내려놓음으로써 마음의 디폴트 모드 네트워크(DMN)를 안정시킬 수 있습니다.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowFptiDetail(false)}
                                    className="w-full mt-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-semibold text-xs transition-all"
                                >
                                    돌아가기
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* 만세력 가이드 팝업 */}
                    <AnimatePresence>
                        {showManseGuide && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute inset-4 z-[3600] bg-slate-950/98 border border-slate-850 rounded-3xl p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md"
                            >
                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                                    <div className="flex justify-between items-center mb-5 border-b border-slate-900 pb-3">
                                        <h4 className="text-sky-400 font-bold text-sm font-premium flex items-center gap-2">
                                            <span>🧭</span> 내 만세력(사주) 리포트 가이드
                                        </h4>
                                        <button 
                                            onClick={() => setShowManseGuide(false)}
                                            className="p-1 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                    <div className="text-xs text-slate-300 space-y-3 font-sans break-keep leading-relaxed">
                                        <p>
                                            <strong>만세력(萬歲曆)</strong>은 자신이 태어난 연, 월, 일, 시의 기운을 천간(天干)과 지지(地支)의 여덟 글자(사주팔자)로 변환한 동양의 전통 시간 역학 도구입니다.
                                        </p>
                                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-900 space-y-3 mb-2">
                                            <div>
                                                <span className="text-sky-400 font-bold block text-[11px] mb-0.5">1. 띠 (연지 - 年支)</span>
                                                <span className="text-slate-400 text-[10px] leading-relaxed block">태어난 해의 지지로, 사회적 기틀과 내면의 잠재적 첫인상을 결정합니다.</span>
                                            </div>
                                            <div>
                                                <span className="text-sky-400 font-bold block text-[11px] mb-0.5">2. 일주 (일간/일지 - 日干/日支)</span>
                                                <span className="text-slate-400 text-[10px] leading-relaxed block">사주 분석에서 가장 중요한 핵심으로, '나 자신'의 본질적인 성격과 내밀한 내면 세계를 상징합니다.</span>
                                            </div>
                                            <div>
                                                <span className="text-sky-400 font-bold block text-[11px] mb-0.5">3. 신강/신약</span>
                                                <span className="text-slate-400 text-[10px] leading-relaxed block">나를 도와주는 오행(비겁, 인성)의 기운이 강하면 '신강', 설기시키는 기운(식상, 재성, 관성)이 많으면 '신약'으로 분류하며 에너지 조율의 기준이 됩니다.</span>
                                            </div>
                                            <div>
                                                <span className="text-sky-400 font-bold block text-[11px] mb-0.5">4. 격국 (십성 격국)</span>
                                                <span className="text-slate-400 text-[10px] leading-relaxed block">내 사주에서 가장 도드라진 역할 모델을 나타내는 것으로, 내가 사회적으로 추구하는 행동 양식과 그릇을 뜻합니다.</span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-slate-500 italic">
                                            * 이 가이드는 사용자의 태어난 일시 분석 데이터와 실시간 연동되어 최적화된 키워드 배지 칩으로 자동 제공되고 있습니다.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowManseGuide(false)}
                                    className="w-full mt-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-semibold text-xs transition-all"
                                >
                                    돌아가기
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* 사주 상세 태그 팝업 모달 */}
                    <AnimatePresence>
                        {activeSajuTagDetail && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute inset-4 z-[3700] bg-slate-950/98 border border-slate-850 rounded-3xl p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md"
                            >
                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                                    <div className="flex justify-between items-center mb-5 border-b border-slate-900 pb-3">
                                        <h4 className="text-sky-400 font-bold text-sm font-premium flex items-center gap-2">
                                            <span>🔮</span> {activeSajuTagDetail.title}
                                        </h4>
                                        <button 
                                            onClick={() => setActiveSajuTagDetail(null)}
                                            className="p-1 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                    <div className="text-xs text-slate-300 space-y-4 font-sans break-keep leading-relaxed whitespace-pre-wrap">
                                        {activeSajuTagDetail.content}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveSajuTagDetail(null)}
                                    className="w-full mt-5 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg hover:shadow-[0_0_15px_rgba(56,189,248,0.2)] active:scale-98 transition-all"
                                >
                                    깊은 가르침 마음에 담기
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
