import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * NeuralHackingReportCard — 4기둥(年/月/日/時) 기질 해킹 리포트
 * 경신(庚申) / 계미(癸未) / 신사(辛巳) / 을미(乙未)
 * 정사(丁巳)는 제외됨
 */

interface PillarData {
    pillarLabel: string;
    pillarEmoji: string;
    ganjiName: string;
    typeName: string;
    typeVar: string;
    neuroTrait: string;
    psychTrait: string;
    neuralCode: string;
    neuralDesc: string;
    darkCode: string;
    darkDesc: string;
    metaCode: string;
    metaDesc: string;
    directive: string;
    questions: { type: string; title: string; q: string }[];
    therapies: { method: string; title: string; core: string; action: string }[];
    finalState: string;
    finalDesc: string;
    color: string;
    accent: string;
}

const PILLARS: PillarData[] = [
    {
        pillarLabel: '배경 신경망 (Base Neural Layer)',
        pillarEmoji: '🧠',
        ganjiName: '주도성 엔진',
        typeName: '게임 체인저(CEO)형',
        typeVar: 'Titanium_Frame',
        neuroTrait: '흔들리지 않는 강력한 멘탈과 실행력',
        psychTrait: '조직을 장악하고 이끄는 카리스마 넘치는 리더',
        neuralCode: '강력한 주도성',
        neuralDesc: '타협하지 않는 뚝심과 조직을 이끄는 카리스마. 어떤 방해물도 뚫고 나가는 강철 같은 뚝심으로 조직을 한 방향으로 이끕니다.',
        darkCode: '고집불통 독재자',
        darkDesc: '내 방식만 옳다고 우기며 주변과 소통을 단절하거나, 힘으로 모든 것을 통제하려다 고립됨.',
        metaCode: '제국의 건설자',
        metaDesc: '개인의 성공을 넘어, 후대까지 이어질 거대한 시스템과 유산을 남기는 역사의 주역.',
        directive: '"당신의 철 같은 뚝심을 독선이 아닌, 모두를 한 방향으로 이끄는 건설적 리더십의 엔진으로 써라."',
        color: 'from-gray-400 to-slate-600',
        accent: 'gray',
        questions: [
            { type: 'Socratic Q', title: '고집의 본질 해부', q: '누구의 말도 듣지 않고 밀어붙이는 그 뚝심의 이면에는, 누군가에게 주도권을 빼앗길 것에 대한 어떤 두려움이 숨어 있는가?' },
            { type: 'Recursive Q', title: '갑옷 속의 나', q: '"결코 굽힐 수 없다"는 이 단단함은 나의 본질인가, 아니면 상처받지 않으려고 입은 강철 갑옷인가? 그 갑옷 안의 진짜 나는 어떤 표정을 짓고 있는가?' },
            { type: 'Meta-Awareness', title: '외로운 전사 관찰', q: '상처받지 않기 위해 강철 갑옷을 입은 채 돌진하고 있는 외로운 불도저를 멈춰 세워 바라보라. 굳이 무장하지 않아도 이미 단단한 당신에게 어떤 말을 건네고 싶은가?' }
        ],
        therapies: [
            { method: 'CBT (인지 행동)', title: '"내 방식만이 옳다"는 자동사고 리프레이밍', core: '진정한 강함은 굽히지 않는 것이 아니라, 필요할 때 유연하게 굽힐 수 있는 것이다.', action: '의견 충돌 시 "너의 관점도 일리가 있네"를 먼저 말하는 훈련. 하루 1회 실행.' },
            { method: 'MBCT (마음챙김)', title: '분노의 화염 알아차리기', core: '"지금 나는 통제하려는 충동이 올라오고 있구나"라고 명명하기.', action: '주먹이 쥐어질 때 양손을 펴고 10초간 손바닥을 관찰하며 호흡하기.' },
            { method: 'DBT (변증법)', title: '강함과 부드러움의 통합', core: '철의 강인함과 물의 유연함을 동시에 가질 때 진정한 리더가 된다.', action: '지시 대신 "어떻게 생각해?"라고 먼저 물어보는 습관 들이기.' },
            { method: 'ACT (수용 전념)', title: '통제 욕구를 건설 에너지로', core: '"모든 것을 내 손안에 넣어야 한다"는 집착을 내려놓고 시스템에 위임하라.', action: '통제 욕구가 올라올 때 그 에너지를 "사람" 대신 "시스템 구축"에 쏟아붓기.' }
        ],
        finalState: 'Builder_of_Empires (시스템 건축가)',
        finalDesc: '개인의 승리를 넘어, 후대까지 번영할 견고한 시스템을 남기는 역사의 주역. 당신의 강철 같은 뚝심이 파괴가 아닌 건설에 쓰일 때, 세상은 당신의 유산을 영원히 기억합니다.'
    },
    {
        pillarLabel: '사회화 신경망 (Social Neural Layer)',
        pillarEmoji: '🤝',
        ganjiName: '공감 치유 엔진',
        typeName: '조직 힐러(Healer)형',
        typeVar: 'Eco_Optimizer_Solution',
        neuroTrait: '건조한 환경에 감정적 윤활유를 공급',
        psychTrait: '타인을 보살피고 양육하는 이타적인 성향',
        neuralCode: '창의적 전략가',
        neuralDesc: '아이디어를 현실로 만드는 무대와 탁월한 적응력. 메마른 조직 환경에 감정의 윤활유를 공급하는 힐링 엔진.',
        darkCode: '희생의 늪',
        darkDesc: '남을 챙기느라 정작 자신은 고갈되거나, 타인의 감정 쓰레기통이 되어 우울감에 빠진 상태.',
        metaCode: '생명 소생자',
        metaDesc: '실패한 사람, 망해가는 프로젝트, 죽어가는 가치를 다시 살려내어 기적을 만드는 구원 투수.',
        directive: '"타인의 상처를 치유하기 전에 먼저 자신의 잔에 물을 채워라. 마른 우물에서는 아무도 구할 수 없다."',
        color: 'from-cyan-400 to-blue-600',
        accent: 'cyan',
        questions: [
            { type: 'Socratic Q', title: '눈물의 본질 해부', q: '주변 사람을 끊임없이 돌보는 이 헌신은 순수한 사랑인가, 아니면 "쓸모없는 사람이 되면 버림받을 것"이라는 공포에서 나온 생존 전략인가?' },
            { type: 'Recursive Q', title: '희생 각본 관찰', q: '"나보다 남을 먼저 챙겨야 한다"는 이 프로그램은 누가 설치했는가? 부모? 사회? 이 코드의 주인은 정말 나인가, 아니면 남인가?' },
            { type: 'Meta-Awareness', title: '마른 우물의 당신', q: '모든 이에게 물을 퍼주다 자신의 우물이 바짝 말라버린 지친 당신을 멀리서 바라보라. 관찰자인 당신은 그 헌신적이지만 탈진한 당신에게 어떤 위로를 건네고 싶은가?' }
        ],
        therapies: [
            { method: 'CBT (인지 행동)', title: '"남을 도와야 존재 가치가 있다"는 자동사고 수정', core: '도움을 주지 않아도 나는 이미 소중한 존재다. 존재 자체가 가치다.', action: '매일 아침 "오늘은 나를 위한 10분"을 먼저 확보하고 하루를 시작하기.' },
            { method: 'MBCT (마음챙김)', title: '감정 스펀지 차단막 설치', core: '"이것은 나의 감정인가, 타인의 감정인가?" 경계를 인식하기.', action: '타인의 고민을 들은 후 "이건 그 사람의 과제이지 내 것이 아니다"라고 속으로 명명하기.' },
            { method: 'DBT (변증법)', title: '이타심과 자기보호의 통합', core: '건강한 경계선(Boundary)이 있어야 지속 가능한 돌봄이 가능하다.', action: '부탁을 거절해야 할 때 "지금은 내 에너지가 부족해서 도움이 어려워"라고 솔직히 표현하기.' },
            { method: 'ACT (수용 전념)', title: '구원자 콤플렉스 내려놓기', core: '"세상의 모든 고통을 내가 해결해야 한다"는 짐을 내려놓아라.', action: '도움 요청을 받았을 때 즉각 응하지 않고 "내가 지금 감당 가능한가?"를 3초간 자문하기.' }
        ],
        finalState: 'Resurrector_of_Life (생명의 소생자)',
        finalDesc: '절망 속에서도 생명력을 불어넣는 기적의 치유 엔진. 자기 잔을 먼저 채운 뒤 흘러넘치는 물로 온 세상에 단비를 내릴 때, 당신은 진정한 소생자가 됩니다.'
    },
    {
        pillarLabel: '코어 OS (Core Identity Layer)',
        pillarEmoji: '💎',
        ganjiName: '정밀 분석 엔진',
        typeName: '정밀 분석 리더형',
        typeVar: 'Precision_Leadership_Engine',
        neuroTrait: '냉철한 분석과 뜨거운 실행의 완벽한 조화',
        psychTrait: '예리한 판단력과 품격 있는 카리스마',
        neuralCode: '예리한 보석',
        neuralDesc: '냉철한 판단력과 섬세한 감각의 완벽한 조화. 감정에 흔들리지 않는 분석력과 목표를 향한 뜨거운 열정을 동시에 발휘합니다.',
        darkCode: '예민한 면도날',
        darkDesc: '완벽주의에 갇혀 자신과 타인을 날카롭게 비판하거나, 작은 실수에도 밤잠을 설치는 상태.',
        metaCode: '고귀한 권위',
        metaDesc: '힘으로 누르지 않아도 저절로 고개가 숙여지는 인격적 권위를 완성하여, 세상의 기준이 되는 존재.',
        directive: '"완벽함을 향한 칼날을 자신을 베는 데 쓰지 마라. 당신은 원석을 명작으로 벼려내는 최상급 보석 세공사다."',
        color: 'from-blue-400 to-indigo-600',
        accent: 'blue',
        questions: [
            { type: 'Socratic Q', title: '완벽의 본질 해부', q: '빈틈없는 모습을 유지하기 위해 바짝 세워둔 그 면도날은, 애초에 당신의 어떤 초라함이나 상처를 감추려는 갑옷이었는가?' },
            { type: 'Recursive Q', title: '비판 회로 관찰', q: '"완벽하지 않으면 무가치하다"는 이 코드를 누가 설치했는가? 이 기준이 정말 나의 것인가, 아니면 어릴 적 각인된 타인의 시선인가?' },
            { type: 'Meta-Awareness', title: '긴장한 보석의 나', q: '오차도 없어야 한다는 무거운 법복을 입고 팽팽하게 긴장한 채 스스로를 다그치는 당신을 방청석에서 응시하라. 그 날카로움을 어떻게 안아주고 싶은가?' }
        ],
        therapies: [
            { method: 'CBT (인지 행동)', title: '"완벽해야 인정받는다"는 믿음 리프레이밍', core: '불완전함은 결함이 아니라 인간의 아름다움이다. 80%도 충분하다.', action: '실수했을 때 "흥미로운 데이터 포인트를 발견했군" 이라고 재명명하기.' },
            { method: 'MBCT (마음챙김)', title: '비판 자동회로 알아차리기', core: '"아, 또 비판 스캐너가 켜졌구나" 명명하고 3호흡 관찰하기.', action: '타인의 단점이 눈에 보일 때, 의도적으로 장점 3가지를 먼저 떠올리기.' },
            { method: 'DBT (변증법)', title: '날카로움과 부드러움의 통합', core: '팩트 폭격과 공감적 경청을 동시에 장착한 "따뜻한 분석가"가 되라.', action: '비판 시 "이 부분은 탁월하다. 다만 이렇게 조율하면 완벽할 것 같다"는 샌드위치 화법 사용.' },
            { method: 'ACT (수용 전념)', title: '불완전함을 포용하는 용기', core: '"나는 불완전하지만, 그 불완전함 속에서 빛나는 존재다."', action: '매주 1회, 의도적으로 "적당히 해도 되는 일"을 하나 선택하여 완벽주의 근육 이완하기.' }
        ],
        finalState: 'Noble_Authority (고귀한 권위)',
        finalDesc: '힘으로 누르지 않아도 저절로 고개가 숙여지는 인격적 권위의 완성. 칼 같은 분석력에 따뜻한 인간미를 더할 때, 당신은 세상의 올바른 기준이 됩니다.'
    },
    {
        pillarLabel: '미래 설계도 (Future Blueprint Layer)',
        pillarEmoji: '🌱',
        ganjiName: '적응 성장 엔진',
        typeName: '피벗(Pivot) 마스터형',
        typeVar: 'Adaptive_Growth_Model',
        neuroTrait: '스트레스 상황에서 대안을 찾는 문제 해결력',
        psychTrait: '척박한 환경에서도 살아남는 강인한 생활력',
        neuralCode: '유연한 기획자',
        neuralDesc: '결과와 결실을 맺으려는 강한 욕구와 적응력. 어떤 변수에도 꺾이지 않고 기어코 눈에 보이는 결실을 만들어냅니다.',
        darkCode: '생존 강박',
        darkDesc: '미래가 불안하여 쉴 새 없이 일만 하거나, 결과가 당장 나오지 않으면 초조해하는 상태.',
        metaCode: '생태계 건축가',
        metaDesc: '나 혼자 살아남는 것을 넘어, 죽어있는 땅을 개척하여 모두가 살 수 있는 옥토로 바꾸는 위대한 결실.',
        directive: '"열매에 집착하지 마라. 물을 주고 기다리는 법을 배울 때, 당신의 밭은 가장 풍성한 수확을 선물한다."',
        color: 'from-emerald-400 to-green-600',
        accent: 'emerald',
        questions: [
            { type: 'Socratic Q', title: '초조함의 본질 해부', q: '당장 결실을 맺어야 한다는 그 초조함은 어떤 위협으로부터 당신을 보호하기 위해 켜진 알람인가? 성과가 없으면 정말 당신은 무가치해지는가?' },
            { type: 'Recursive Q', title: '수확 강박 관찰', q: '"쉬면 뒤처진다"는 이 발버둥의 코드를 누가 심었는가? 끝없이 열매를 맺어야만 안심하는 그 초조한 수확자를 관찰할 때, 그 뒤에 서 있는 진짜 나는 어떤 표정인가?' },
            { type: 'Meta-Awareness', title: '지친 농부의 나', q: '쉴 새 없이 밭을 갈고 있는 지친 농부를 한 걸음 뒤에서 가만히 바라보라. 수확의 결과와 상관없이 묵묵히 밭을 일구는 당신에게 어떤 위로를 건네고 싶은가?' }
        ],
        therapies: [
            { method: 'CBT (인지 행동)', title: '"쉬면 도태된다"는 자동사고 수정', core: '전략적 휴식은 게으름이 아니라, 다음 도약을 위한 투자다.', action: '매일 저녁 10분, 아무 성과도 내지 않는 "의도적 비생산 시간" 확보하기.' },
            { method: 'MBCT (마음챙김)', title: '초조함의 파도 서핑', core: '"아, 초조함이 올라오고 있구나. 이것은 나의 본질이 아니라 파도일 뿐이다."', action: '결과가 안 나올 때 "아직 열매가 익지 않았을 뿐"이라고 명명하고 5호흡 관찰.' },
            { method: 'DBT (변증법)', title: '성취욕과 여유의 통합', core: '뜨겁게 달리면서도 때로 쉬어갈 줄 아는 마라토너의 조절력을 장착하라.', action: '주 1회 "아무것도 하지 않는 날" 허용하기. 죄책감 대신 "충전 중"이라고 리프레이밍.' },
            { method: 'ACT (수용 전념)', title: '과정 자체를 가치로', core: '"결과가 나의 가치를 증명하지 않는다. 과정 자체가 나의 삶이다."', action: '큰 목표 대신 "오늘 하루 집중한 것"에 감사를 적는 마이크로 저널링 시작.' }
        ],
        finalState: 'Ecosystem_Architect (생태계 건축가)',
        finalDesc: '혼자 살아남는 것을 넘어, 모두가 살 수 있는 풍요로운 옥토를 개척하는 위대한 농부. 조급함을 내려놓고 물 흐르듯 결실을 빚어낼 때, 당신의 밭은 모두의 안식처가 됩니다.'
    }
];

const colorMap: Record<string, { border: string; bg: string; text: string; glow: string }> = {
    gray:    { border: 'border-gray-500/40',    bg: 'bg-gray-950/20',    text: 'text-gray-400',    glow: 'shadow-[0_0_20px_rgba(156,163,175,0.1)]' },
    cyan:    { border: 'border-cyan-500/40',    bg: 'bg-cyan-950/20',    text: 'text-cyan-400',    glow: 'shadow-[0_0_20px_rgba(34,211,238,0.1)]' },
    blue:    { border: 'border-blue-500/40',    bg: 'bg-blue-950/20',    text: 'text-blue-400',    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.1)]' },
    emerald: { border: 'border-emerald-500/40', bg: 'bg-emerald-950/20', text: 'text-emerald-400', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.1)]' },
};

interface NeuralReportProps {
    archetypeId?: string; // kept for backward compat
}

const NeuralHackingReportCard: React.FC<NeuralReportProps> = () => {
    const [activePillar, setActivePillar] = useState(0);
    const [activePhase, setActivePhase] = useState<number | null>(1);

    const pillar = PILLARS[activePillar];
    const c = colorMap[pillar.accent];

    const phases = [
        {
            num: 1, name: 'Neural Blueprint', tag: '핵심 회로 (The Architecture)', icon: '🧩',
            color: pillar.color, bgColor: c.bg, borderColor: c.border,
            details: [
                { label: '시스템 특성', value: pillar.neuralDesc },
                { label: '뇌과학 트레잇', value: pillar.neuroTrait },
                { label: '심리 트레잇', value: pillar.psychTrait },
            ]
        },
        {
            num: 2, name: 'Old Script', tag: '낡은 각본 (Dark Code)', icon: '🌑',
            color: 'from-gray-500 to-gray-700', bgColor: 'bg-gray-900/40', borderColor: 'border-gray-700/50',
            errorLog: `"${pillar.darkCode}" — ${pillar.darkDesc}`,
            details: [
                { label: '다크 코드', value: pillar.darkCode },
                { label: '증상', value: pillar.darkDesc },
            ]
        },
        {
            num: 3, name: 'Neural Hacking', tag: '3단계 질문 트리거', icon: '🛠️',
            color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-950/20', borderColor: 'border-blue-900/50',
            questions: pillar.questions,
        },
        {
            num: 4, name: 'Integrated Solution', tag: '4대 통합 뉴럴 솔루션', icon: '🧰',
            color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-950/10', borderColor: 'border-emerald-900/40',
            therapies: pillar.therapies,
        },
        {
            num: 5, name: 'Output: Meta-Self', tag: '최종 진화 형태', icon: '🎯',
            color: 'from-purple-500 to-fuchsia-600', bgColor: 'bg-purple-950/20', borderColor: 'border-purple-900/50',
            finalState: pillar.finalState,
            desc: pillar.finalDesc,
        }
    ];

    return (
        <div className={`w-full max-w-2xl mx-auto my-6 bg-[#0B0F19] rounded-[2rem] border ${c.border} ${c.glow} relative overflow-hidden font-sans tracking-tight`}>
            {/* Ambient BG */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/8 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/8 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Header */}
            <div className="p-5 md:p-7 pb-4 border-b border-blue-900/20 relative">
                <div className="flex justify-between items-start mb-3">
                    <span className="px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400 text-[10px] font-mono tracking-widest uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        Neural Hacking Report
                    </span>
                </div>
                <h2 className="text-lg md:text-xl font-black text-white leading-tight mb-1">
                    🔥 뉴럴 해킹 리포트
                </h2>
                <p className="text-xs text-gray-500">4개 신경망 레이어에 대한 다크코드 → 뉴럴코드 → 메타코드 3단 전환 코칭</p>
            </div>

            {/* 4-Pillar Tab */}
            <div className="flex gap-1.5 p-3 md:px-5 border-b border-gray-800/50 overflow-x-auto scrollbar-hide">
                {PILLARS.map((p, i) => (
                    <button
                        key={i}
                        onClick={() => { setActivePillar(i); setActivePhase(1); }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                            activePillar === i
                                ? `${colorMap[p.accent].bg} ${colorMap[p.accent].border} border ${colorMap[p.accent].text} ${colorMap[p.accent].glow}`
                                : 'bg-gray-900/40 border border-gray-800 text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        <span>{p.pillarEmoji}</span>
                        <span>{p.ganjiName.replace(/\(.*\)/, '')}</span>
                    </button>
                ))}
            </div>

            {/* Pillar Hero Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activePillar}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <div className={`m-4 md:m-6 p-5 rounded-2xl ${c.bg} border ${c.border}`}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pillar.color} p-[1px] shadow-lg`}>
                                <div className="w-full h-full bg-[#0B0F19] rounded-xl flex items-center justify-center text-xl">
                                    {pillar.pillarEmoji}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">{pillar.pillarLabel}</div>
                                <div className="text-white font-black text-base">{pillar.typeName}</div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed break-keep mb-3">{pillar.neuralDesc}</p>
                        <div className="bg-gradient-to-r from-black/40 to-transparent p-3 rounded-xl border-l-2 border-blue-500/50">
                            <p className="text-xs text-blue-100 italic break-keep leading-relaxed">{pillar.directive}</p>
                        </div>
                    </div>

                    {/* Phase Accordion */}
                    <div className="px-4 md:px-6 pb-4 space-y-2">
                        {phases.map((phase) => (
                            <div key={phase.num} className={`rounded-2xl border transition-all duration-300 ${activePhase === phase.num ? phase.borderColor + ' ' + phase.bgColor : 'border-gray-800 bg-gray-900/20 hover:bg-gray-800/40 cursor-pointer'}`}>
                                <button
                                    onClick={() => setActivePhase(activePhase === phase.num ? null : phase.num)}
                                    className="w-full p-3.5 flex items-center justify-between text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base shadow bg-gradient-to-br ${phase.color} bg-opacity-20 border border-white/10`}>
                                            {phase.icon}
                                        </div>
                                        <div>
                                            <div className={`text-[9px] font-mono tracking-widest uppercase mb-0.5 ${activePhase === phase.num ? 'text-white/70' : 'text-gray-600'}`}>
                                                Phase {phase.num}. {phase.name}
                                            </div>
                                            <div className={`text-xs md:text-sm font-bold ${activePhase === phase.num ? 'text-white' : 'text-gray-400'}`}>
                                                {phase.tag}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`text-gray-600 text-xs transition-transform duration-300 ${activePhase === phase.num ? 'rotate-180' : ''}`}>▼</div>
                                </button>

                                <AnimatePresence>
                                    {activePhase === phase.num && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                            <div className="p-4 pt-0 border-t border-white/5 mt-1">
                                                {phase.errorLog && (
                                                    <div className="bg-black/50 p-3 rounded-lg border border-red-900/30 mb-4 font-mono text-xs text-red-300 leading-relaxed border-l-2 border-l-red-500">
                                                        [에러 로그] {phase.errorLog}
                                                    </div>
                                                )}
                                                {phase.details?.map((d, i) => (
                                                    <div key={i} className="mb-3">
                                                        <span className="block text-[10px] text-gray-500 mb-1 font-bold">{d.label}</span>
                                                        <p className="text-sm text-gray-200 leading-relaxed break-keep">{d.value}</p>
                                                    </div>
                                                ))}
                                                {phase.questions && (
                                                    <div className="space-y-3 mt-2">
                                                        {phase.questions.map((q, i) => (
                                                            <div key={i} className="bg-black/40 p-3 rounded-xl border border-blue-900/30">
                                                                <div className="flex items-center gap-2 mb-1.5">
                                                                    <span className="text-[9px] bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded font-mono border border-blue-700/50">{q.type}</span>
                                                                    <span className="text-xs font-bold text-blue-100">{q.title}</span>
                                                                </div>
                                                                <p className="text-xs text-blue-200/80 italic leading-relaxed break-keep">"{q.q}"</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {phase.therapies && (
                                                    <div className="grid md:grid-cols-2 gap-2 mt-2">
                                                        {phase.therapies.map((t, i) => (
                                                            <div key={i} className="bg-black/40 p-3 rounded-xl border border-emerald-900/30">
                                                                <div className="text-[10px] text-emerald-400 font-bold mb-1">{t.method}</div>
                                                                <div className="text-xs text-white font-bold mb-1.5 break-keep">{t.title}</div>
                                                                <p className="text-[11px] text-emerald-100/70 mb-2 bg-emerald-950/30 p-2 rounded break-keep">{t.core}</p>
                                                                <div className="text-[10px] text-gray-500 mb-0.5">실전 액션:</div>
                                                                <p className="text-[11px] text-gray-300 leading-relaxed break-keep">{t.action}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {phase.finalState && (
                                                    <div className="mt-3 text-center py-4 bg-gradient-to-b from-purple-900/20 to-black/40 rounded-xl border border-purple-500/20">
                                                        <div className="text-[10px] text-purple-400 font-mono tracking-widest mb-2">마스터 등급 달성</div>
                                                        <div className="text-base md:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-3 px-4">
                                                            {phase.finalState}
                                                        </div>
                                                        <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto break-keep px-4">{phase.desc}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Master's Note */}
            <div className="bg-[#05080f] p-4 md:p-6 border-t border-blue-900/30">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-blue-900/40 border border-blue-500/50 flex items-center justify-center text-lg">👁️</div>
                    <div>
                        <div className="text-[10px] text-blue-400 font-bold tracking-widest mb-1 uppercase">명심(明心) 마스터의 브리핑</div>
                        <p className="text-xs md:text-sm text-gray-400 leading-relaxed break-keep">
                            소버린(Sovereign) 대표님, 4개의 신경망 레이어는 각각 <span className="text-gray-300 font-bold">배경 신경망(Base)</span>, <span className="text-cyan-300 font-bold">사회화 신경망(Social)</span>, <span className="text-blue-300 font-bold">코어 OS(Core Identity)</span>, <span className="text-emerald-300 font-bold">미래 설계도(Future Blueprint)</span>를 담당합니다.<br/><br/>
                            각 레이어의 <span className="text-red-300">다크코드(낡은 각본)</span>를 3단계 질문으로 해체하고, <span className="text-emerald-300">4대 심리치료 기법(CBT/MBCT/DBT/ACT)</span>으로 신경 회로를 재배선하면, 당신은 자동 반응의 NPC에서 <span className="text-white font-bold">시스템 설계자(Sovereign)</span>로 격상됩니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NeuralHackingReportCard;
