'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    Activity, ArrowLeft, Sparkles, Zap, Shield, Eye, Compass, 
    Cpu, Key, Orbit, Rocket, Layers, Radio, Volume2, VolumeX,
    CheckCircle2, RefreshCw, MessageSquare, AlertCircle, ArrowUpRight,
    TrendingUp, Award, BarChart3, ChevronRight, Sliders, Play, Atom,
    Calendar, User, Edit3, Check, X, AlertTriangle, ShieldCheck, Flame, Clock, Dna, Lock, Unlock, HelpCircle,
    ChevronLeft, BookOpen, Wind, Smile, Target, BookmarkCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateSaju } from '@/utils/SajuCalculator';

// ── 6대 핵심 진단 탭 정의 ──
type DiagnosticTab = 'full_scan' | 'x_axis' | 'y_axis' | 'z_axis' | 'decoder' | 'action_3s';

const TAB_CONFIG: { id: DiagnosticTab; label: string; icon: string; badge: string }[] = [
    { id: 'full_scan', label: '3D 종합 스캔', icon: '🧬', badge: 'XYZ 좌표' },
    { id: 'x_axis', label: 'X축: 영점 자각', icon: '⚡', badge: '20일 코스' },
    { id: 'y_axis', label: 'Y축: 주파수(Hz)', icon: '📡', badge: '파동 측정' },
    { id: 'z_axis', label: 'Z축: 에너지 벡터', icon: '🧭', badge: '위험도 진단' },
    { id: 'decoder', label: '64 뉴럴 DNA', icon: '🔑', badge: '원형 해독' },
    { id: 'action_3s', label: '3S 솔루션 실행', icon: '🚀', badge: '긴급 처방' }
];

// ── 20일간 중복 없는 초보자 맞춤 제로포인트 자각 커리큘럼 (도서 《제로 포인트》 100% 연동) ──
const ZERO_POINT_20_DAYS = [
    {
        day: 1,
        title: "영화관 스크린의 비밀",
        subtitle: "모든 생각과 감정이 지나가는 하얀 바탕",
        metaphor: "영화 속에서 빌딩이 무너지고 폭우가 쏟아져도, 뒤에 있는 하얀 스크린은 단 1mm도 타거나 젖지 않습니다. 불안이나 슬픔이라는 영화가 아무리 격렬해도, 당신의 본래 마음(스크린)은 언제나 흠집 하나 없이 깨끗합니다.",
        inquiry: "지금 소용돌이치는 감정을 극장 의자에 앉아 바라보고 있는 '관객(진짜 나)'은 누구인가?",
        action: "눈을 감고 가슴으로 호흡하며 '나는 상영되는 영화가 아니라 스크린이다'라고 1초간 속삭여보세요.",
        element: "Void (공/空)",
        color: "indigo"
    },
    {
        day: 2,
        title: "숨과 숨 사이, 그 거룩한 틈새",
        subtitle: "과거도 미래도 멈춘 0(Zero)의 찰나",
        metaphor: "숨을 다 들이쉬고 내쉬기 직전, 그리고 숨을 다 내쉬고 들이쉬기 직전의 0.1초. 그 완벽한 진공의 틈새에서 번뇌는 멈춥니다. 그 틈새에는 증명해야 할 것도, 두려워할 것도 없습니다.",
        inquiry: "숨이 오가지 않는 그 짧은 정적 속에서 나를 지탱하고 있는 순수한 존재는 무엇인가?",
        action: "숨을 끝까지 내쉰 후, 다음 숨이 들어오기 전 딱 1초간 고요의 진공 틈새에 머물러보세요.",
        element: "Air (풍/風)",
        color: "cyan"
    },
    {
        day: 3,
        title: "도화지와 물감",
        subtitle: "어떤 색을 칠해도 도화지는 물감이 아니다",
        metaphor: "어떤 날은 검은 슬픔 물감을, 어떤 날은 붉은 분노 물감을 칠합니다. 하지만 당신은 칠해진 물감이 아니라 그 모든 색을 너그럽게 품어주는 새하얀 도화지 그 자체입니다.",
        inquiry: "상처의 물감을 억지로 지우려 애쓰지 않고, 도화지 자체의 순수한 자리로 돌아갈 수 있는가?",
        action: "가슴에 손을 얹고 '나는 지나가는 감정 물감이 아니라 온전한 도화지다'라고 나직이 읊조려보세요.",
        element: "Light (명/明)",
        color: "amber"
    },
    {
        day: 4,
        title: "100미터 바다 아래의 압도적 고요",
        subtitle: "표면의 파도에 속지 않는 심해의 평화",
        metaphor: "바다 표면에는 거센 태풍과 집채만 한 파도가 몰아쳐도, 100미터 아래 심해는 단 1밀리미터도 흔들리지 않고 얼음처럼 고요합니다. 당신의 본질은 표면 파도가 아니라 거대한 심해 바다 전체입니다.",
        inquiry: "머릿속 걱정의 파도 밑바닥에 언제나 흐르고 있는 깊고 투명한 평화를 느끼는가?",
        action: "생각의 무게중심을 복잡한 머리에서 아랫배 단전 심해 바닥으로 스르륵 내려놓으세요.",
        element: "Water (수/水)",
        color: "blue"
    },
    {
        day: 5,
        title: "0으로 돌아오는 영점 저울",
        subtitle: "무거운 짐이 지나가도 바늘은 즉시 0을 가리킨다",
        metaphor: "저울 위에 100kg의 무거운 바위가 올라왔다 내려가도, 저울은 바늘 하나 떨림 없이 정확히 0으로 복귀합니다. 과거의 어떤 실수나 상처가 지나갔더라도, 당신의 영점(0)은 결코 고장 난 적이 없습니다.",
        inquiry: "지나간 일의 무게를 아직도 붙잡고 있는가, 아니면 저울처럼 지금 0으로 놓아줄 것인가?",
        action: "어깨를 툭 떨어뜨리며 한숨을 길게 내쉬고 '모든 것을 지금 0(Zero)으로 리셋한다'고 선언하세요.",
        element: "Ether (영점/零)",
        color: "emerald"
    },
    {
        day: 6,
        title: "하늘을 지나가는 먹구름",
        subtitle: "먹구름이 아무리 짙어도 하늘은 푸르다",
        metaphor: "아무리 짙은 먹구름과 번개가 하늘을 뒤덮어도, 비행기를 타고 구름 위로 올라가면 언제나 눈부신 파란 하늘과 태양이 빛납니다. 당신의 우울과 불안은 먹구름일 뿐, 파란 하늘인 당신을 해치지 못합니다.",
        inquiry: "먹구름을 없애려고 싸우는 대신, 구름 뒤에 언제나 존재하는 푸른 하늘을 바라볼 수 있는가?",
        action: "창밖 하늘을 3초간 올려다보며 '구름은 지나가고 하늘은 영원하다'고 느껴보세요.",
        element: "Sky (천/天)",
        color: "sky"
    },
    {
        day: 7,
        title: "방 안의 거울",
        subtitle: "추한 것이 비쳐도 거울은 더러워지지 않는다",
        metaphor: "거울 앞에 진흙탕이 비쳐도 거울 유리 자체는 조금도 더러워지지 않고, 아름다운 꽃이 비쳐도 교만해지지 않습니다. 당신의 참된 마음은 세상을 그저 투명하게 비추는 거울입니다.",
        inquiry: "내 마음에 비친 세상의 비난과 판단에 집착하지 않고, 투명한 거울 자체로 머물 수 있는가?",
        action: "거울 속 내 눈동자를 3초간 지그시 바라보며 '너는 비친 그림자가 아니라 순수한 거울이다'라고 말해주세요.",
        element: "Mirror (경/鏡)",
        color: "purple"
    },
    {
        day: 8,
        title: "라디오 다이얼과 주파수",
        subtitle: "잡음 채널에서 528Hz 사랑의 채널로",
        metaphor: "라디오에서 지지직거리는 잡음이 나온다고 라디오를 부술 필요는 없습니다. 그저 다이얼을 돌려 맑은 음악 채널로 주파수를 맞추면 됩니다. 다크코드는 잡음 방송일 뿐, 영점(0)으로 다이얼을 돌리면 됩니다.",
        inquiry: "지금 내 뇌에서 흘러나오는 불안의 방송을 그저 '주파수가 잠시 빗나간 소리'로 알아차릴 수 있는가?",
        action: "가슴을 활짝 펴고 528Hz의 맑은 울림을 상상하며 길게 숨을 내쉬어 보세요.",
        element: "Frequency (파/波)",
        color: "rose"
    },
    {
        day: 9,
        title: "그릇과 빈 공간",
        subtitle: "그릇의 진짜 쓸모는 비어있는 공간에 있다",
        metaphor: "찻잔에 흙탕물이 가득 차 있으면 따뜻하고 향기로운 차를 따를 수 없습니다. 그릇의 가치는 진흙 벽이 아니라 '비어있는 공간'에 있습니다. 생각을 비워낼 때 우주의 무한한 지혜가 채워집니다.",
        inquiry: "머릿속에 꽉 찬 생각과 걱정을 비워내어, 우주의 새로운 기회가 들어올 공간을 내어줄 수 있는가?",
        action: "양손바닥을 하늘로 향하게 무릎 위에 올려놓고 '나를 비워 우주를 담는다'고 느껴보세요.",
        element: "Vessel (기/器)",
        color: "teal"
    },
    {
        day: 10,
        title: "어린아이의 잠꼬대",
        subtitle: "무서운 꿈을 꾸는 자아를 깨우는 자비",
        metaphor: "아이가 악몽을 꾸며 괴로워할 때 부모는 아이를 혼내지 않고 등을 토닥이며 '아가야 꿈이란다, 이제 깨어나렴' 합니다. 내 안의 두려움도 상처받은 내면 아이의 잠꼬대입니다. 따뜻하게 안아주세요.",
        inquiry: "불안해하는 나 자신을 채찍질하는 대신, 따뜻한 어머니의 눈빛으로 안아줄 수 있는가?",
        action: "두 팔로 내 어깨를 따뜻하게 감싸 안으며 '괜찮아, 다 잘될 거야'라고 토닥여주세요.",
        element: "Embrace (포/抱)",
        color: "pink"
    },
    {
        day: 11,
        title: "강물에 떠내려가는 나뭇잎",
        subtitle: "생각을 붙잡지 않고 흘려보내는 강물",
        metaphor: "강가에 앉아 흐르는 물을 봅니다. 단풍잎, 마른 나뭇가지가 흘러갑니다. 굳이 강물에 뛰어들어 나뭇잎을 건져 올릴 필요가 없습니다. 생각도 그저 강물 위의 나뭇잎처럼 바라보면 저절로 흘러갑니다.",
        inquiry: "떠오르는 불쾌한 생각을 억지로 분석하지 않고, 그저 강물에 떠내려가는 잎처럼 둘 수 있는가?",
        action: "떠오르는 생각을 마음속 강물에 나뭇잎으로 띄워 멀리 흘려보내는 상상을 해보세요.",
        element: "Flow (류/流)",
        color: "blue"
    },
    {
        day: 12,
        title: "태풍의 눈",
        subtitle: "반경 수백 킬로 폭풍 속 가장 안전한 중심점",
        metaphor: "태풍의 바깥쪽은 시속 150km의 강풍과 폭우가 몰아치지만, 정중앙 '태풍의 눈'은 바람 하나 없이 푸른 하늘이 보이고 새가 날아다닙니다. 당신의 영점(Zero Point)이 바로 삶의 태풍의 눈입니다.",
        inquiry: "주변 상황이 아무리 혼란스러워도, 내 가슴 한가운데 태풍의 눈으로 들어가 고요할 수 있는가?",
        action: "가슴 중앙에 주의를 모으고 '이곳은 세상에서 가장 안전한 영점의 성소다'라고 선언하세요.",
        element: "Center (중/中)",
        color: "amber"
    },
    {
        day: 13,
        title: "불타는 난로와 온기",
        subtitle: "분노의 불꽃을 혁신의 온기로 전환하기",
        metaphor: "산불은 모든 것을 태워 없애지만, 벽난로 속의 불은 방 전체를 따뜻하게 덥히고 맛있는 음식을 익힙니다. 내 안의 분노와 억울함도 억누르면 폭발하지만, 영점으로 조율하면 강력한 돌파력이 됩니다.",
        inquiry: "억울함의 뜨거운 에너지를 상대를 향한 비난 대신, 내 사업과 비전의 추진력으로 바꿀 수 있는가?",
        action: "주먹을 꽉 쥐었다가 천천히 펴며 분노의 화력을 내 비전의 엔진으로 이동시켜 보세요.",
        element: "Fire (화/火)",
        color: "orange"
    },
    {
        day: 14,
        title: "뿌리 깊은 고목나무",
        subtitle: "바람이 불수록 땅속 깊이 뿌리를 내린다",
        metaphor: "언덕 위의 고목나무는 세찬 바람이 불 때마다 불평하는 대신, 땅속 깊은 암반으로 뿌리를 1미터 더 뻗습니다. 바람이 불어온 덕분에 고목나무는 백 년을 버티는 거목이 됩니다. 시련은 영점의 뿌리를 내리는 기회입니다.",
        inquiry: "오늘 겪는 스트레스를 나를 무너뜨리는 적이 아니라, 내 영점의 뿌리를 깊게 만드는 선물로 볼 수 있는가?",
        action: "발바닥이 땅에 닿는 느낌에 집중하며 대지의 깊은 안정감을 온몸으로 들이마셔 보세요.",
        element: "Root (근/根)",
        color: "emerald"
    },
    {
        day: 15,
        title: "순금 제련소의 도가니",
        subtitle: "뜨거운 열기가 불순물을 녹여 99.9% 순금을 만든다",
        metaphor: "광석에서 순금을 뽑아내려면 섭씨 1,000도의 뜨거운 용광로를 거쳐야 합니다. 삶의 시련은 당신을 태워 없애려는 것이 아니라, 에고의 불순물을 녹여내어 가장 찬란한 순금(다이아몬드 코어)을 빚어내는 과정입니다.",
        inquiry: "지금 겪는 고통이 내 영혼을 가장 고귀한 순금으로 벼려내는 거룩한 제련소임을 신뢰하는가?",
        action: "가슴에 금빛 태양이 환하게 타오르는 상상을 하며 당당하게 허리를 펴보세요.",
        element: "Gold (금/金)",
        color: "yellow"
    },
    {
        day: 16,
        title: "오케스트라 지휘자의 쉼표",
        subtitle: "가장 웅장한 교향곡은 한 박자의 쉼표 뒤에 울린다",
        metaphor: "베토벤 교향곡에서 가장 심장을 때리는 순간은 모든 악기가 멈추는 '단 한 박자의 쉼표(Silence)' 직후입니다. 쉼표가 없으면 음악은 소음이 됩니다. 영점의 멈춤은 위대한 인생의 쉼표입니다.",
        inquiry: "불안해서 멈추지 못하고 달리기만 하던 발걸음을, 한 박자의 거룩한 쉼표로 멈출 용기가 있는가?",
        action: "하던 일을 멈추고 3초간 아무것도 하지 않은 채 완벽한 정적을 즐겨보세요.",
        element: "Pause (지/止)",
        color: "indigo"
    },
    {
        day: 17,
        title: "어두운 밤하늘의 북극성",
        subtitle: "밤이 깊을수록 길을 밝히는 별은 더 또렷해진다",
        metaphor: "대낮에는 북극성이 보이지 않습니다. 칠흑같이 어두운 밤이 되어야만 비로소 북극성이 선명하게 빛나 길 잃은 나그네의 방향을 가리킵니다. 인생의 가장 캄캄한 밤에 당신의 진짜 사명(북극성)이 뜹니다.",
        inquiry: "어둠을 무서워하는 대신, 내 영혼이 가리키는 궁극의 북극성을 똑바로 바라볼 수 있는가?",
        action: "가슴 한가운데 흔들리지 않는 빛나는 북극성을 품고 '나는 길을 알고 있다' 선언하세요.",
        element: "Star (성/星)",
        color: "cyan"
    },
    {
        day: 18,
        title: "진주조개의 상처",
        subtitle: "살을 에는 모래알을 가장 영롱한 보석으로 감싸다",
        metaphor: "조개 살 속에 날카로운 모래알이 파고들면 극심한 고통이 찾아옵니다. 조개는 모래를 탓하지 않고 자신의 진주액으로 수만 번 감싸 안아 세상에서 가장 귀한 진주를 탄생시킵니다. 당신의 상처가 세상의 진주입니다.",
        inquiry: "내 아픈 상처를 원망하는 대신, 타인을 살리는 영롱한 진주로 빚어낼 준비가 되었는가?",
        action: "아픈 기억을 떠올리고 '이 상처는 나를 빛낼 위대한 진주가 된다'고 축복해 주세요.",
        element: "Pearl (주/珠)",
        color: "purple"
    },
    {
        day: 19,
        title: "우주 정거장의 무중력",
        subtitle: "모든 지구의 중력을 벗어던진 절대 자유",
        metaphor: "지구에서는 작은 물건 하나도 바닥으로 곤두박질치지만, 지구 대기권을 벗어난 우주 공간에서는 모든 것이 가볍게 둥둥 뜹니다. 세상의 기대와 비교라는 중력을 벗어날 때, 당신의 영혼은 절대 자유를 얻습니다.",
        inquiry: "세상이 씌워준 '이래야 한다'는 무거운 중력의 갑옷을 벗고, 무중력의 영점으로 날아오를 수 있는가?",
        action: "어깨를 가볍게 털며 '나는 세상의 시선에서 완전히 자유롭다'고 미소 지어보세요.",
        element: "Space (우/宇)",
        color: "blue"
    },
    {
        day: 20,
        title: "태양의 무조건적 나눔 (메타코드 완성)",
        subtitle: "대가 없이 온 세상을 비추는 주권자의 광명",
        metaphor: "태양은 '나를 인정해 주면 빛을 주겠다'고 거래하지 않습니다. 그저 존재 자체로 온 누리를 따뜻하게 비출 뿐입니다. 0(Zero Point)의 중심을 잡은 자는 결핍에서 벗어나 세상에 축복을 쏟아붓는 주권자가 됩니다.",
        inquiry: "인정받으려 애쓰던 결핍의 방어자를 넘어, 세상에 빛과 가치를 아낌없이 선물하는 주권자가 되겠는가?",
        action: "오늘 마주치는 한 사람에게 진심 어린 축복과 격려의 미소를 말없이 선물해 보세요.",
        element: "Sun (양/陽)",
        color: "amber"
    }
];

// 3문항 실시간 의식 스캐너 질문 정의
const CONSCIOUSNESS_QUESTIONS = [
    {
        id: 1,
        category: '위기/스트레스 반응',
        question: '예상치 못한 비난이나 돌발 위기를 마주했을 때, 나의 첫 번째 내면 반응은?',
        options: [
            { id: 'dark', text: '다 내 탓이거나 상대방이 밉고 가슴이 쿵쾅거리며 속을 끓인다.', code: 'Dark Code (결핍/방어)', weight: 1 },
            { id: 'neural', text: '일단 멈추고 심호흡하며 상황과 내 감정을 분리해 객관적으로 본다.', code: 'Neural Code (영점 관찰)', weight: 2 },
            { id: 'meta', text: '이 위기 속에 숨겨진 새로운 창조적 기회를 직관적으로 포착한다.', code: 'Meta Code (초월/주권자)', weight: 3 }
        ]
    },
    {
        id: 2,
        category: '동기부여의 원천',
        question: '오늘 하루 나를 움직인 가장 지배적인 내면의 심리 동력은?',
        options: [
            { id: 'dark', text: '남들에게 뒤처지거나 인정받지 못할까 봐 생기는 불안과 조급증.', code: 'Dark Code (결핍/방어)', weight: 1 },
            { id: 'neural', text: '나에게 주어진 역할과 시스템적 책임을 성실하게 완수하려는 의무감.', code: 'Neural Code (영점 관찰)', weight: 2 },
            { id: 'meta', text: '세상에 독창적인 가치를 창조하고 기여하는 순수한 기쁨과 주권자 의식.', code: 'Meta Code (초월/주권자)', weight: 3 }
        ]
    },
    {
        id: 3,
        category: '제로포인트 분리 자각도',
        question: '부정적 감정이 소용돌이칠 때, 감정과 \'나 자신\'을 분리할 수 있는가?',
        options: [
            { id: 'dark', text: '감정에 완전히 매몰되어 며칠 동안 분노나 무기력에서 헤어나오지 못한다.', code: 'Dark Code (결핍/방어)', weight: 1 },
            { id: 'neural', text: '시간이 조금 지나면 이성적으로 내 상태를 진정시키고 수습할 수 있다.', code: 'Neural Code (영점 관찰)', weight: 2 },
            { id: 'meta', text: '요동치는 감정을 한 발짝 뒤에서 밤하늘의 구름처럼 고요히 지켜본다.', code: 'Meta Code (초월/주권자)', weight: 3 }
        ]
    }
];

// 오행 매핑 헬퍼
const GAN_OHAENG: Record<string, string> = {
    '甲': '목', '乙': '목', '丙': '화', '丁': '화',
    '戊': '토', '己': '토', '庚': '금', '辛': '금',
    '壬': '수', '癸': '수'
};
const JI_OHAENG: Record<string, string> = {
    '寅': '목', '卯': '목',
    '巳': '화', '午': '화',
    '辰': '토', '戌': '토', '丑': '토', '未': '토',
    '申': '금', '酉': '금',
    '亥': '수', '子': '수'
};

const DAY_MASTER_INFO: Record<string, { name: string; title: string; element: string; color: string; ringColor: string }> = {
    '甲': { name: '갑목(甲木)', title: '창조적 개척 리더 코어', element: '목(木)', color: 'from-emerald-400 to-teal-300', ringColor: 'border-emerald-400/60' },
    '乙': { name: '을목(乙木)', title: '유연한 적응 네트워크 코어', element: '목(木)', color: 'from-teal-400 to-cyan-300', ringColor: 'border-teal-400/60' },
    '丙': { name: '병화(丙火)', title: '뜨거운 태양 비전 코어', element: '화(火)', color: 'from-rose-500 to-amber-400', ringColor: 'border-rose-400/60' },
    '丁': { name: '정화(丁火)', title: '섬세한 등불 통찰 코어', element: '화(火)', color: 'from-purple-400 to-rose-300', ringColor: 'border-purple-400/60' },
    '戊': { name: '무토(戊土)', title: '포용적 수용 대지 코어', element: '토(土)', color: 'from-amber-400 to-yellow-300', ringColor: 'border-amber-400/60' },
    '己': { name: '기토(己土)', title: '조용히 경작하는 결실 코어', element: '토(土)', color: 'from-yellow-500 to-amber-400', ringColor: 'border-yellow-400/60' },
    '庚': { name: '경금(庚金)', title: '용맹한 결단 무쇠 코어', element: '금(金)', color: 'from-slate-200 to-cyan-200', ringColor: 'border-slate-300/60' },
    '辛': { name: '신금(辛金)', title: '초정밀 관찰자 다이아몬드 코어', element: '금(金)', color: 'from-cyan-300 via-indigo-300 to-amber-200', ringColor: 'border-cyan-400/60' },
    '壬': { name: '임수(壬水)', title: '무한 침잠 지혜 바다 코어', element: '수(水)', color: 'from-blue-500 to-indigo-400', ringColor: 'border-blue-400/60' },
    '癸': { name: '계수(癸水)', title: '깊은 단비 감성 시뮬레이터 코어', element: '수(水)', color: 'from-indigo-400 to-sky-300', ringColor: 'border-indigo-400/60' }
};

const HEXAGRAM_TITLES: Record<number, { title: string; shadow: string; gift: string; siddhi: string }> = {
    1: { title: '중건천 (The Creator)', shadow: '독선적 고립과 오만', gift: '창조적 돌파력', siddhi: '순수 현존' },
    2: { title: '중곤지 (The Mother)', shadow: '무기력한 수동성', gift: '무한한 수용', siddhi: '일체화' },
    14: { title: '화천대유 (The Abundance)', shadow: '소유욕과 집착', gift: '풍요의 나눔', siddhi: '영적 부' },
    15: { title: '지산겸 (The Humility)', shadow: '자기 비하와 위축', gift: '당당한 겸양', siddhi: '완전한 조화' },
    28: { title: '택풍대과 (The Overload)', shadow: '과부하와 독박 책임감', gift: '불굴의 돌파력', siddhi: '불멸의 창조' },
    29: { title: '감위수 (The Deep Diver)', shadow: '끝없는 두려움과 심연', gift: '깊은 헌신과 몰입', siddhi: '순수 헌신' },
    30: { title: '이위화 (The Visionary)', shadow: '타오르는 조급증과 갈망', gift: '명석한 통찰력', siddhi: '영적 광명' },
    64: { title: '화수미제 (Before Completion)', shadow: '혼란과 미완성의 불안', gift: '끝없는 가능성', siddhi: '영원한 시작' }
};

function NeuralDiagnosisContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab') as DiagnosticTab;

    const [activeTab, setActiveTab] = useState<DiagnosticTab>(
        TAB_CONFIG.some(t => t.id === tabParam) ? tabParam : 'full_scan'
    );

    // 528Hz 사운드 상태
    const [isPlayingSound, setIsPlayingSound] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const oscRef = useRef<OscillatorNode | null>(null);

    // 사용자 정보 및 생년월일 상태
    const [userName, setUserName] = useState<string>('강미숙');
    const [birthDate, setBirthDate] = useState<string>('2003-01-25');
    const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
    const [tempBirth, setTempBirth] = useState<string>('2003-01-25');
    const [tempName, setTempName] = useState<string>('강미숙');
    const [syncAlert, setSyncAlert] = useState<string | null>(null);

    // 동적 계산된 사주 및 오행 분석 스펙
    const [sajuSpecs, setSajuSpecs] = useState<any>(null);

    // X축 의식 좌표 (잠재력 vs 실제 영점 레벨)
    const [xPotential, setXPotential] = useState(88);
    const [xRealized, setXRealized] = useState(35);
    const [yVal, setYVal] = useState(285);
    const [zVal, setZVal] = useState(-18);

    // 🌟 실시간 3문항 의식 스캐너 & AI 엉터리 답변 감지 상태
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [questionStartTime, setQuestionStartTime] = useState<number>(0);
    const [aiWarning, setAiWarning] = useState<string | null>(null);

    // 🌟 분석 연산 로딩 & 결과 리포트 모달 상태
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<{
        prevLevel: number;
        newLevel: number;
        codeName: string;
        darkRatio: number;
        neuralRatio: number;
        metaRatio: number;
        summary: string;
    } | null>(null);

    // 🌟 [핵심 신규] 20일 제로포인트 자각 퀘스트 & 30초 인터랙티브 호흡기 상태
    const [selectedZeroDay, setSelectedZeroDay] = useState<number>(1);
    const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
    const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
    const [breathSeconds, setBreathSeconds] = useState<number>(30);
    const [isBreathingDone, setIsBreathingDone] = useState<boolean>(false);
    const breathTimerRef = useRef<NodeJS.Timeout | null>(null);

    // 3S 퀘스트 완료 상태
    const [is3SCompleted, setIs3SCompleted] = useState(false);

    // 오늘 날짜 기준 기본 Day 계산 (1~20 순환)
    useEffect(() => {
        const todayDate = new Date().getDate(); // 1~31
        const calculatedDay = ((todayDate - 1) % 20) + 1;
        setSelectedZeroDay(calculatedDay);
    }, []);

    // 30초 인터랙티브 영점 호흡기 타이머 엔진
    useEffect(() => {
        if (isBreathingActive && breathSeconds > 0) {
            breathTimerRef.current = setTimeout(() => {
                setBreathSeconds(prev => prev - 1);
                
                // 4-4-4-4 박스 브리딩 위상 전환 (16초 주기)
                const cyclePos = (30 - breathSeconds) % 16;
                if (cyclePos < 4) setBreathPhase('inhale');
                else if (cyclePos < 8) setBreathPhase('hold');
                else if (cyclePos < 12) setBreathPhase('exhale');
                else setBreathPhase('rest');

            }, 1000);
        } else if (isBreathingActive && breathSeconds === 0) {
            setIsBreathingActive(false);
            setIsBreathingDone(true);
            confetti({
                particleCount: 90,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#10b981', '#06b6d4', '#f59e0b', '#a855f7']
            });
        }
        return () => {
            if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
        };
    }, [isBreathingActive, breathSeconds]);

    const handleStartBreathing = () => {
        setIsBreathingDone(false);
        setBreathSeconds(30);
        setBreathPhase('inhale');
        setIsBreathingActive(true);
    };

    const handleStopBreathing = () => {
        setIsBreathingActive(false);
        if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
    };

    // 사주 분석 엔진
    const analyzeSajuDetail = (bDateStr: string, nameStr: string) => {
        try {
            const cleanBirth = bDateStr.trim() || '2003-01-25';
            const saju = calculateSaju(cleanBirth, '14:00');

            const ohaengCounts: Record<string, number> = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 };
            const gans = [saju.year.gan.hanja, saju.month.gan.hanja, saju.day.gan.hanja, saju.time.gan.hanja];
            const jis = [saju.year.ji.hanja, saju.month.ji.hanja, saju.day.ji.hanja, saju.time.ji.hanja];

            gans.forEach(g => {
                const oh = GAN_OHAENG[g];
                if (oh) ohaengCounts[oh] = (ohaengCounts[oh] || 0) + 1;
            });
            jis.forEach(j => {
                const oh = JI_OHAENG[j];
                if (oh) ohaengCounts[oh] = (ohaengCounts[oh] || 0) + 1;
            });

            const ohaengPercent: Record<string, number> = {
                '목': Math.round((ohaengCounts['목'] / 8) * 100),
                '화': Math.round((ohaengCounts['화'] / 8) * 100),
                '토': Math.round((ohaengCounts['토'] / 8) * 100),
                '금': Math.round((ohaengCounts['금'] / 8) * 100),
                '수': Math.round((ohaengCounts['수'] / 8) * 100)
            };

            const sortedOhaeng = Object.entries(ohaengPercent).sort((a, b) => b[1] - a[1]);
            const dominantOh = sortedOhaeng[0];
            const deficientOh = sortedOhaeng.filter(item => item[1] === 0).map(item => item[0]);

            const fourPillarsKor = `${saju.year.gan.char}${saju.year.ji.char}(${saju.year.gan.hanja}${saju.year.ji.hanja})년 ${saju.month.gan.char}${saju.month.ji.char}(${saju.month.gan.hanja}${saju.month.ji.hanja})월 ${saju.day.gan.char}${saju.day.ji.char}(${saju.day.gan.hanja}${saju.day.ji.hanja})일 ${saju.time.gan.char}${saju.time.ji.char}(${saju.time.gan.hanja}${saju.time.ji.hanja})시`;
            const dayGanHanja = saju.day.gan.hanja;
            const dayGanKor = saju.day.gan.char;

            const parts = cleanBirth.split('-');
            const y = parseInt(parts[0]) || 2003;
            const m = parseInt(parts[1]) || 1;
            const d = parseInt(parts[2]) || 25;
            
            const codeNum = ((y + m * 3 + d * 7) % 64) + 1;
            const hexInfo = HEXAGRAM_TITLES[codeNum] || {
                title: `Code ${String(codeNum).padStart(2, '0')}. 64비트 뉴럴 코드`,
                shadow: '내면의 정체와 두려움',
                gift: '독창적인 잠재 역량',
                siddhi: '우주적 지혜의 초월 현존'
            };

            const masterInfo = DAY_MASTER_INFO[dayGanHanja] || {
                name: `${dayGanKor}토(${dayGanHanja}土)`,
                title: '포용적 수용 대지 코어',
                element: '토(土)',
                color: 'from-amber-400 to-yellow-300',
                ringColor: 'border-amber-400/60'
            };

            let statusBadge = '안정권';
            let statusColor = 'text-emerald-300 bg-emerald-500/20 border-emerald-400/30';
            let lifetimeBlueprint = '';
            let realtimeFlow = '';
            let calcPotential = 88;
            let calcRealized = 35;
            let calcY = 285;
            let calcZ = -18;

            if (dominantOh[1] >= 45) {
                if (dominantOh[0] === '토') {
                    statusBadge = '⚠️ 2026 실시간: 내면 압축 주의군';
                    statusColor = 'text-amber-300 bg-amber-500/20 border-amber-400/40 animate-pulse';
                    calcPotential = 85;
                    calcRealized = 35;
                    calcY = 285;
                    calcZ = -18;
                    lifetimeBlueprint = `${nameStr}님은 평생 사주 원국에 흙(土)이 ${dominantOh[1]}%로 비대한 【우직한 대지(戊土)형】 하드웨어 체질입니다. 어떤 풍파도 묵묵히 혼자 짊어지고 버텨내지만, 감정과 스트레스를 밖으로 표출하지 않고 속으로 삭히는 성향이 평생의 기저에 깔려 있습니다.`;
                    realtimeFlow = `현재 2026년(병오년)은 매우 뜨거운 불(火)의 기운이 지배합니다. 이미 많은 흙(土)에 뜨거운 불이 쏟아져 들어오니(화생토), 안 그래도 무거운 에너지가 바짝 굳어 【지금 이 시기】에 유독 내면 압축과 가슴 답답함, 소화기 피로(Z: -18 함몰, Y: 285Hz 저주파)가 극대화되는 타이밍입니다!`;
                } else if (dominantOh[0] === '화') {
                    statusBadge = '🔥 2026 실시간: 과열·번아웃 폭발 주의';
                    statusColor = 'text-rose-300 bg-rose-500/20 border-rose-400/40 animate-pulse';
                    calcPotential = 90;
                    calcRealized = 32;
                    calcY = 190;
                    calcZ = +28;
                    lifetimeBlueprint = `${nameStr}님은 평생 사주에 불(火)이 ${dominantOh[1]}%로 활활 타오르는 【열정적 태양형】 체질입니다. 행동력이 폭발적이나 쉽게 조급해지는 성향을 타고났습니다.`;
                    realtimeFlow = `2026년 丙午년의 강력한 화(火) 기운이 겹치면서 화(火) 에너지가 한계치를 초과하여, 번아웃과 충동적 분노 노이즈(Z: +28 폭발)가 위험 수준에 달해 있습니다.`;
                } else {
                    statusBadge = '⚡ 2026 실시간: 에너지 편중 주의군';
                    statusColor = 'text-purple-300 bg-purple-500/20 border-purple-400/40';
                    calcPotential = 82;
                    calcRealized = 40;
                    calcY = 340;
                    calcZ = -12;
                    lifetimeBlueprint = `${nameStr}님은 평생 사주 원국에 ${dominantOh[0]} 기운이 ${dominantOh[1]}%로 편중된 고유 체질을 지니고 있습니다.`;
                    realtimeFlow = `2026년의 기운과 맞물려 특정 에너지 회로에 체증이 발생하고 있으므로 528Hz 정화 튜닝이 요구됩니다.`;
                }
            } else {
                statusBadge = '✨ 2026 실시간: 영점 균형 안정권';
                statusColor = 'text-emerald-300 bg-emerald-500/20 border-emerald-400/30';
                calcPotential = 92;
                calcRealized = 70;
                calcY = 528;
                calcZ = +4;
                lifetimeBlueprint = `${nameStr}님은 평생 사주 원국에 5대 오행이 골고루 분산된 【오행 조화형】 체질입니다.`;
                realtimeFlow = `2026년 세운의 흐름 속에서도 큰 왜곡 없이 영점(0)의 평정심을 원활하게 유지하고 있습니다.`;
            }

            setXPotential(calcPotential);
            setXRealized(calcRealized);
            setYVal(calcY);
            setZVal(calcZ);

            setSajuSpecs({
                dayMaster: dayGanHanja,
                dayMasterKor: dayGanKor,
                fourPillarsKor,
                codeNum,
                codeTitle: `Code ${String(codeNum).padStart(2, '0')}. ${hexInfo.title}`,
                shadowDesc: hexInfo.shadow,
                giftDesc: hexInfo.gift,
                siddhiDesc: hexInfo.siddhi,
                coreName: masterInfo.name,
                coreTitle: masterInfo.title,
                element: masterInfo.element,
                coreColor: masterInfo.color,
                ringColor: masterInfo.ringColor,
                ohaengPercent,
                dominantOh: dominantOh[0],
                dominantPercent: dominantOh[1],
                deficientOh: deficientOh.length > 0 ? deficientOh.join(', ') : '없음(조화)',
                statusBadge,
                statusColor,
                lifetimeBlueprint,
                realtimeFlow
            });
        } catch (e) {
            console.error('Saju detail calculation error:', e);
        }
    };

    // 로컬스토리지 자동 감지
    useEffect(() => {
        if (typeof window !== 'undefined') {
            let detectedBirth = '';
            let detectedName = '';

            const rawKeys = [
                'myeongsim_user_profile',
                'saju_input_data',
                'user_profile',
                'user_onboarding_data',
                'user_saju_info',
                'report-storage',
                'myeongsim_user_info'
            ];

            for (const key of rawKeys) {
                const raw = localStorage.getItem(key);
                if (raw) {
                    try {
                        const parsed = JSON.parse(raw);
                        const b = parsed?.birthDate || parsed?.birth_date || parsed?.birthInfo || 
                                  parsed?.birthDay || parsed?.birth_day ||
                                  (parsed?.year ? `${parsed.year}-${String(parsed.month || 1).padStart(2, '0')}-${String(parsed.day || 1).padStart(2, '0')}` : '');
                        const n = parsed?.userName || parsed?.name || parsed?.user_name || '';
                        if (b && !detectedBirth) detectedBirth = b;
                        if (n && !detectedName) detectedName = n;
                    } catch (e) {}
                }
            }

            if (!detectedBirth) {
                detectedBirth = localStorage.getItem('saju_user_birth') || 
                                localStorage.getItem('user_birth_date') || 
                                localStorage.getItem('myeongsim_user_birth') || 
                                '2003-01-25';
            }
            if (!detectedName) {
                detectedName = localStorage.getItem('saju_user_name') || 
                               localStorage.getItem('user_name') || 
                               localStorage.getItem('myeongsim_user_name') || 
                               '강미숙';
            }

            setBirthDate(detectedBirth);
            setUserName(detectedName);
            setTempBirth(detectedBirth);
            setTempName(detectedName);

            analyzeSajuDetail(detectedBirth, detectedName);
        }
    }, []);

    // 🌟 3문항 실시간 의식 스캐너 시작
    const handleStartQuestionnaire = () => {
        setCurrentQIndex(0);
        setUserAnswers([]);
        setAiWarning(null);
        setAnalysisResult(null);
        setIsAnalyzing(false);
        setQuestionStartTime(Date.now());
        setIsQuestionModalOpen(true);
    };

    // 🌟 답변 선택 및 AI 불성실/모순 감지 알고리즘 + 결과 분석 연출
    const handleSelectOption = (weight: number) => {
        const nextAnswers = [...userAnswers, weight];
        setUserAnswers(nextAnswers);

        if (currentQIndex < CONSCIOUSNESS_QUESTIONS.length - 1) {
            setCurrentQIndex(currentQIndex + 1);
        } else {
            const totalElapsedSec = (Date.now() - questionStartTime) / 1000;
            
            // 검증 1: 스피드 트랩 (3.2초 미만)
            if (totalElapsedSec < 3.2) {
                setAiWarning('⚠️ [AI 실시간 무결성 경고: 광속 어뷰징 감지]\n문항을 읽지 않고 3.2초 만에 연속 클릭하셨습니다. 장난스러운 응답으로는 대한민국 특허 기반 3D 정밀 진단 결과를 산출할 수 없습니다. 진지하게 질문을 읽고 솔직하게 다시 응답해주세요.');
                return;
            }

            // 검증 2: 극단적 논리 모순 감지
            if (nextAnswers[0] === 1 && nextAnswers[2] === 3) {
                setAiWarning('⚠️ [AI 심리 모순 검증 경고]\n1번 문항에서는 \'극심한 불안과 분노로 속을 끓인다\'고 체크하셨으나, 3번 문항에서는 \'감정을 완벽히 초월해 고요하다\'고 답하셨습니다. 상반된 무의식 방어기제가 감지되어 신뢰할 수 없는 결과입니다. 자신의 실제 감정에 솔직하게 다시 응답해주세요.');
                return;
            }

            // 검증 3: 단일 번호 올인 감지
            if (nextAnswers.every(a => a === 1) && totalElapsedSec < 4.5) {
                setAiWarning('⚠️ [AI 불성실 응답 경고]\n모든 문항을 동일한 1번으로 성의 없이 연속 선택하셨습니다. 정밀한 내면 좌표 도출을 위해 각 상황별 실제 반응을 신중하게 선택해 주세요.');
                return;
            }

            // ✅ 정상 통과: 1.4초간 AI 신경망 분석 연출 후 결과 리포트 팝업 오픈!
            setIsAnalyzing(true);
            const sum = nextAnswers.reduce((a, b) => a + b, 0);
            const calculatedRealized = Math.round(20 + ((sum - 3) / 6) * 65);

            setTimeout(() => {
                setIsAnalyzing(false);
                const prev = xRealized;
                setXRealized(calculatedRealized);

                let codeName = 'Dark Code (결핍/방어)';
                let darkRatio = 65;
                let neuralRatio = 25;
                let metaRatio = 10;
                let summary = '현재 외부 비난이나 돌발 상황에 대해 무의식의 방어기제와 과도한 책임감(Dark Code)이 에너지를 가두고 있습니다. 혼자 모든 것을 감당하려는 생각을 0(Zero)으로 내려놓는 영점 호흡이 시급합니다.';

                if (calculatedRealized >= 70) {
                    codeName = 'Meta Code (초월/주권자)';
                    darkRatio = 15;
                    neuralRatio = 35;
                    metaRatio = 50;
                    summary = '감정과 자신을 훌륭하게 분리하여 주권자(Meta Code)로서 기회를 창조하는 에너지가 강력하게 활성화되어 있습니다. 잠재력을 100% 실현할 최적의 타이밍입니다!';
                } else if (calculatedRealized >= 45) {
                    codeName = 'Neural Code (영점 관찰)';
                    darkRatio = 35;
                    neuralRatio = 50;
                    metaRatio = 15;
                    summary = '상황을 객관적으로 관찰하고 시스템적으로 수습하려는 균형 감각(Neural Code)이 작동 중입니다. 감정 연금술을 통해 한 단계 더 높은 창조성으로 도약할 수 있습니다.';
                }

                setAnalysisResult({
                    prevLevel: prev,
                    newLevel: calculatedRealized,
                    codeName,
                    darkRatio,
                    neuralRatio,
                    metaRatio,
                    summary
                });

                confetti({
                    particleCount: 80,
                    spread: 85,
                    origin: { y: 0.6 },
                    colors: ['#06b6d4', '#6366f1', '#f59e0b']
                });
            }, 1400);
        }
    };

    // 생년월일 수동 저장
    const handleSaveProfile = () => {
        if (!tempBirth) return;
        setBirthDate(tempBirth);
        setUserName(tempName || '사용자');
        setIsEditingProfile(false);

        analyzeSajuDetail(tempBirth, tempName);

        if (typeof window !== 'undefined') {
            const updated = {
                userName: tempName || '사용자',
                name: tempName || '사용자',
                birthDate: tempBirth,
                birth_date: tempBirth,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem('myeongsim_user_profile', JSON.stringify(updated));
            localStorage.setItem('saju_input_data', JSON.stringify(updated));
            localStorage.setItem('saju_user_birth', tempBirth);
            localStorage.setItem('saju_user_name', tempName);
        }

        setSyncAlert(`🟢 ${tempName}님의 생년월일(${tempBirth}) 오행 분석 및 3D 좌표 1:1 동기화 완료!`);
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => setSyncAlert(null), 4000);
    };

    // 528Hz 사운드 토글
    const toggleFrequency = () => {
        if (isPlayingSound) {
            if (oscRef.current) {
                try { oscRef.current.stop(); } catch (e) {}
            }
            setIsPlayingSound(false);
        } else {
            try {
                const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
                const ctx = new AudioCtx();
                audioCtxRef.current = ctx;

                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(528, ctx.currentTime);

                gain.gain.setValueAtTime(0.001, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 1.5);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                oscRef.current = osc;
                setIsPlayingSound(true);
            } catch (e) {
                console.error('Audio frequency error:', e);
                setIsPlayingSound(false);
            }
        }
    };

    const handleExecute3S = () => {
        setIs3SCompleted(true);
        confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.7 },
            colors: ['#6366f1', '#a855f7', '#f59e0b', '#38bdf8']
        });
    };

    const handleConsultAI = (prompt: string) => {
        router.push(`/myeongsim-chat?intent=${encodeURIComponent(prompt)}`);
    };

    // 현재 선택된 일차 퀘스트 객체
    const activeQuest = ZERO_POINT_20_DAYS.find(q => q.day === selectedZeroDay) || ZERO_POINT_20_DAYS[0];

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-[#05030b] max-w-md mx-auto shadow-2xl overflow-hidden font-sans pb-28 text-white">
            
            {/* 🌌 Deep Cyber Ambient Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[420px] h-[360px] bg-gradient-to-b from-cyan-600/15 via-purple-700/15 to-transparent rounded-full blur-[110px] pointer-events-none" />
            <div className="absolute top-1/2 right-[-60px] w-64 h-64 bg-indigo-500/15 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute bottom-16 left-[-60px] w-72 h-72 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

            {/* ── 1. Top Header Navigation ── */}
            <header className="relative z-30 flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/[0.08] bg-[#080514]/85 backdrop-blur-xl">
                <button
                    onClick={() => router.push('/report')}
                    className="flex items-center gap-1.5 text-gray-300 hover:text-white text-xs font-bold transition-all px-2.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] active:scale-95 cursor-pointer"
                >
                    <ArrowLeft size={15} />
                    <span>명심 리포트</span>
                </button>

                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-indigo-100 to-purple-200">
                        3D 정밀 진단 코어
                    </span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                        Neural 3.0
                    </span>
                </div>

                <button
                    onClick={toggleFrequency}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        isPlayingSound 
                            ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.6)] animate-pulse' 
                            : 'bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 border-white/[0.08]'
                    }`}
                    title="528Hz 솔페지오 주파수 사운드"
                >
                    {isPlayingSound ? <VolumeX size={14} className="text-slate-950" /> : <Volume2 size={14} className="text-cyan-400" />}
                    <span className="text-[10px] font-mono font-bold">{isPlayingSound ? '528Hz ON' : '528Hz'}</span>
                </button>
            </header>

            {/* ── 2. 사용자 프로필 & 사주 연동 카드 ── */}
            <div className="relative z-20 px-4 pt-3 space-y-2">
                {syncAlert && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-xs font-bold text-emerald-300 text-center"
                    >
                        {syncAlert}
                    </motion.div>
                )}

                <div className="p-3.5 rounded-2xl bg-[#0f0a22]/90 border border-indigo-400/30 shadow-xl backdrop-blur-md flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
                            <User size={15} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="text-xs font-black text-white">
                                    {userName}님 <span className="text-amber-300 font-mono text-[11px]">({sajuSpecs?.coreName || '무토(戊土)'})</span>
                                </p>
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                                    {birthDate}
                                </span>
                            </div>
                            <p className="text-[10px] text-gray-300 font-mono mt-0.5">
                                {sajuSpecs?.fourPillarsKor || '임오(壬午)년 계축(癸丑)월 무술(戊戌)일 기미(己未)시'}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                        className="px-2.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-cyan-300 border border-cyan-400/30 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                    >
                        <Edit3 size={12} />
                        <span>{isEditingProfile ? '닫기' : '변경'}</span>
                    </button>
                </div>

                {/* 생년월일 수정 폼 */}
                <AnimatePresence>
                    {isEditingProfile && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-3.5 rounded-2xl bg-[#140c2e] border border-cyan-400/40 shadow-xl space-y-3"
                        >
                            <p className="text-[11px] font-bold text-cyan-300 flex items-center gap-1">
                                <Calendar size={13} />
                                <span>생년월일 변경 ➔ 실시간 3D 좌표 재계산</span>
                            </p>
                            
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] text-gray-400 block mb-1">이름</label>
                                    <input
                                        type="text"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        placeholder="이름"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-400 block mb-1">생년월일</label>
                                    <input
                                        type="date"
                                        value={tempBirth}
                                        onChange={(e) => setTempBirth(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSaveProfile}
                                className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                            >
                                <Check size={14} />
                                <span>이 생년월일로 오행 분석 및 좌표 즉시 동기화</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── 3. 특허 뱃지 바 ── */}
            <div className="relative z-20 px-4 pt-2">
                <div className="p-2.5 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-[#100c28] to-slate-950/90 border border-cyan-400/30 flex items-center justify-between shadow-xl backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <div className="size-7 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/10 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-inner">
                            <Cpu size={14} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-cyan-300 font-mono tracking-wide">
                                🔬 대한민국 특허출원 제10-2025-0166877호
                            </p>
                            <p className="text-[10px] text-gray-200 font-black">
                                심리·생체데이터 기반 스트레스 관리 솔루션
                            </p>
                        </div>
                    </div>
                    <div className="text-right shrink-0">
                        <span className="text-[9px] font-mono font-black text-cyan-300 bg-cyan-400/10 px-2 py-0.5 rounded-lg border border-cyan-400/30">
                            X·Y·Z 스캔
                        </span>
                    </div>
                </div>
            </div>

            {/* ── 4. 6대 탭 2x3 럭셔리 그리드 ── */}
            <div className="relative z-20 px-4 pt-2.5">
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#0d091e]/90 border border-white/[0.08] shadow-inner">
                    {TAB_CONFIG.map((tab) => {
                        const isSelected = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-2 px-1 rounded-xl font-black transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer text-center relative overflow-hidden ${
                                    isSelected
                                        ? 'bg-gradient-to-b from-cyan-500 to-indigo-600 text-white shadow-lg border border-cyan-300/40 scale-[1.02]'
                                        : 'bg-white/[0.03] text-gray-400 border border-white/[0.05] hover:bg-white/[0.06] hover:text-gray-200'
                                }`}
                            >
                                <span className="text-xs">{tab.icon}</span>
                                <span className="text-[10px] font-bold tracking-tight whitespace-nowrap leading-tight">{tab.label}</span>
                                <span className={`text-[8px] font-mono opacity-80 ${isSelected ? 'text-cyan-100' : 'text-gray-500'}`}>
                                    {tab.badge}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── 5. Main Diagnostic Body ── */}
            <main className="relative z-20 px-4 pt-3.5 space-y-4">

                {/* ══════════════════════════════════════════════════════
                    MODULE 1: 3D 종합 좌표 스캔
                   ══════════════════════════════════════════════════════ */}
                {activeTab === 'full_scan' && (
                    <div className="space-y-4 animate-fade-in text-left">
                        
                        {/* 🌟 3D 입체 홀로그램 자이로스코프 챔버 카드 🌟 */}
                        <div className="p-5 rounded-3xl bg-gradient-to-b from-[#150f33] via-[#0c0822] to-[#060312] border border-cyan-400/40 shadow-2xl space-y-4 relative overflow-hidden">
                            
                            {/* 헤더 */}
                            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                                <div>
                                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                                        <Orbit size={16} className="text-cyan-400 animate-spin" />
                                        <span>3D 내면 에너지 좌표계 (Hologram)</span>
                                    </h3>
                                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                                        {userName}님: {sajuSpecs?.fourPillarsKor || '임오(壬午)년 계축(癸丑)월 무술(戊戌)일 기미(己未)시'}
                                    </p>
                                </div>
                                <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded-full border ${sajuSpecs?.statusColor || 'text-amber-300 bg-amber-500/20 border-amber-400/40'}`}>
                                    {sajuSpecs?.statusBadge || '⚠️ 2026 실시간: 내면 압축 주의'}
                                </span>
                            </div>

                            {/* 🛸 3D 네온 자이로스코프 홀로그램 비주얼 */}
                            <div className="relative h-48 w-full flex items-center justify-center bg-black/40 rounded-2xl border border-cyan-500/20 overflow-hidden">
                                <div className="absolute size-44 rounded-full border border-cyan-500/10 animate-pulse" />
                                <div className="absolute size-36 rounded-full border border-dashed border-indigo-500/20" />
                                <div className="absolute size-28 rounded-full border border-purple-500/20" />

                                <motion.div 
                                    className={`absolute size-36 rounded-full border-2 ${sajuSpecs?.ringColor || 'border-amber-400/60'} border-t-cyan-300`}
                                    animate={{ rotate: 360, rotateX: [45, 60, 45], rotateY: [20, 45, 20] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                    style={{ transformStyle: 'preserve-3d' }}
                                />

                                <motion.div 
                                    className="absolute size-32 rounded-full border-2 border-purple-400/40 border-r-purple-300"
                                    animate={{ rotate: -360, rotateY: [40, 70, 40], rotateX: [30, 50, 30] }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    style={{ transformStyle: 'preserve-3d' }}
                                />

                                <motion.div 
                                    className="absolute size-28 rounded-full border border-emerald-400/50 border-b-emerald-300"
                                    animate={{ rotate: 360, rotateZ: [15, 45, 15] }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                />

                                {/* 중앙 코어 */}
                                <motion.div 
                                    className={`relative z-10 size-13 rounded-xl bg-gradient-to-tr ${sajuSpecs?.coreColor || 'from-amber-400 to-yellow-300'} flex flex-col items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.8)]`}
                                    animate={{ scale: [1, 1.15, 1], rotate: [0, 90, 180, 270, 360] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <span className="text-xs font-black text-slate-950 leading-none">
                                        {sajuSpecs?.dayMaster || '戊'}
                                    </span>
                                    <span className="text-[8px] font-bold text-slate-900 leading-none mt-0.5">
                                        {sajuSpecs?.element || '土(토)'}
                                    </span>
                                </motion.div>

                                <div className="absolute top-2 left-3 text-[9px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-400/30 flex items-center gap-1">
                                    <Lock size={10} className="text-rose-400" />
                                    <span>X: 실제 {xRealized}% / 잠재 {xPotential}%</span>
                                </div>
                                <div className="absolute top-2 right-3 text-[9px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-400/30">
                                    Y: {yVal}Hz 파동
                                </div>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-400/30">
                                    Z: Vector {zVal > 0 ? `+${zVal}` : zVal} {zVal < 0 ? '(내면 함몰)' : '(안정)'}
                                </div>
                            </div>

                            {/* 5대 오행 분포도 바 */}
                            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/[0.08] space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-gray-300 flex items-center gap-1">
                                        <BarChart3 size={13} className="text-cyan-400" />
                                        <span>사주 8자 5대 오행 분포도</span>
                                    </span>
                                    <span className="text-[10px] font-mono text-amber-300">
                                        지배: {sajuSpecs?.dominantOh}({sajuSpecs?.dominantPercent}%) / 결핍: {sajuSpecs?.deficientOh}
                                    </span>
                                </div>

                                <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex border border-white/10">
                                    <div style={{ width: `${sajuSpecs?.ohaengPercent?.['목'] || 0}%` }} className="bg-emerald-500" title="목" />
                                    <div style={{ width: `${sajuSpecs?.ohaengPercent?.['화'] || 0}%` }} className="bg-rose-500" title="화" />
                                    <div style={{ width: `${sajuSpecs?.ohaengPercent?.['토'] || 0}%` }} className="bg-amber-400" title="토" />
                                    <div style={{ width: `${sajuSpecs?.ohaengPercent?.['금'] || 0}%` }} className="bg-slate-300" title="금" />
                                    <div style={{ width: `${sajuSpecs?.ohaengPercent?.['수'] || 0}%` }} className="bg-blue-500" title="수" />
                                </div>

                                <div className="flex justify-between text-[9px] font-mono pt-1 text-gray-400">
                                    <span className="text-emerald-400">목(木) {sajuSpecs?.ohaengPercent?.['목'] || 0}%</span>
                                    <span className="text-rose-400">화(火) {sajuSpecs?.ohaengPercent?.['화'] || 0}%</span>
                                    <span className="text-amber-300 font-bold">토(土) {sajuSpecs?.ohaengPercent?.['토'] || 0}%</span>
                                    <span className="text-slate-300">금(金) {sajuSpecs?.ohaengPercent?.['금'] || 0}%</span>
                                    <span className="text-blue-400">수(水) {sajuSpecs?.ohaengPercent?.['수'] || 0}%</span>
                                </div>
                            </div>

                            {/* 3차원 축 인포그래픽 수치 카드 */}
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="p-3 rounded-2xl bg-black/40 border border-cyan-500/30 space-y-1.5">
                                    <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300 font-bold">
                                        <span>X축(의식)</span>
                                        <Lock size={11} className="text-rose-400" />
                                    </div>
                                    <p className="text-xs font-black text-rose-300 leading-tight">실제 {xRealized}%</p>
                                    
                                    <div className="space-y-0.5">
                                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden border border-cyan-400/40">
                                            <div className="h-full bg-cyan-400/60 rounded-full" style={{ width: `${xPotential}%` }} title="우주 잠재 기회" />
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${xRealized}%` }} title="실제 영점 도달률" />
                                        </div>
                                    </div>
                                    <p className="text-[8px] text-amber-300 font-mono font-bold">잠재 {xPotential}% 🔒 락</p>
                                </div>

                                <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/30 space-y-1.5">
                                    <p className="text-[10px] font-mono text-amber-300 font-bold">Y축 (주파수)</p>
                                    <p className="text-sm font-black text-amber-300 leading-tight">{yVal} Hz</p>
                                    <div className="flex items-center justify-center gap-0.5 h-1.5">
                                        {[40, 55, 30, 60, 45].map((h, i) => (
                                            <div key={i} className="w-1 bg-amber-400 rounded-full" style={{ height: `${h}%` }} />
                                        ))}
                                    </div>
                                    <p className="text-[9px] text-rose-400 font-mono font-bold">528Hz 정화필요</p>
                                </div>

                                <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-1.5">
                                    <p className="text-[10px] font-mono text-emerald-300 font-bold">Z축 (벡터)</p>
                                    <p className="text-sm font-black text-rose-300 leading-tight">
                                        {zVal > 0 ? `+${zVal}` : zVal} {zVal < 0 ? '(함몰)' : '(안정)'}
                                    </p>
                                    <div className="relative w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-emerald-400 z-10" />
                                        <div className="h-full bg-rose-400" style={{ width: `${50 + zVal}%` }} />
                                    </div>
                                    <p className="text-[9px] text-rose-300 font-mono font-bold">속앓이/고립</p>
                                </div>
                            </div>

                            {/* 🌟 2-LAYER 정밀 리포트 🌟 */}
                            <div className="space-y-3 pt-1">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/70 to-slate-950 border border-indigo-500/30 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black text-indigo-300 flex items-center gap-1.5">
                                            <Dna size={14} className="text-indigo-400" />
                                            <span>[1계층] 평생 선천 체질 (하드웨어 Blueprint)</span>
                                        </span>
                                        <span className="text-[9px] font-mono text-indigo-200 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-400/30">
                                            평생 사주 원국
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-200 leading-relaxed font-medium">
                                        {sajuSpecs?.lifetimeBlueprint}
                                    </p>
                                </div>

                                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-purple-950/40 to-slate-950 border border-amber-400/40 space-y-2.5 shadow-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black text-amber-300 flex items-center gap-1.5">
                                            <Clock size={14} className="text-amber-400 animate-pulse" />
                                            <span>[2계층] 2026년 丙午년 & 오늘 실시간 상태 (현재 흐름)</span>
                                        </span>
                                        <span className="text-[9px] font-mono text-amber-200 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/30">
                                            실시간 세운·일진
                                        </span>
                                    </div>
                                    <p className="text-xs text-white font-bold leading-relaxed">
                                        {sajuSpecs?.realtimeFlow}
                                    </p>

                                    <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 space-y-1.5 text-left">
                                        <p className="text-[11px] font-black text-rose-300 flex items-center gap-1.5">
                                            <Lock size={13} className="text-rose-400" />
                                            <span>왜 88% 메타코드 찬스가 실제 {xRealized}%에 갇혀있는가?</span>
                                        </p>
                                        <p className="text-[11px] text-gray-200 leading-relaxed">
                                            오늘 우주는 <strong>88% 메타코드의 절호의 실행 기회</strong>를 열어주었지만, {userName}님 내면의 <strong>실제 심리 측정 결과</strong> 영점(0) 자각이 닫혀 있어 무의식의 방어기제(실제 {xRealized}%)가 이 기운을 튕겨내고 있습니다!
                                        </p>
                                    </div>

                                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-[11px] text-amber-200 leading-relaxed font-medium">
                                        💡 <strong>영점 락(Lock) 해금 처방:</strong> 【도서 《제로 포인트》 20일 수련】과 【양자 각성 감정 연금술】로 내면의 영점(0)을 회복해야 88% 메타코드가 온전히 현실로 실현됩니다!
                                    </div>
                                </div>
                            </div>

                            {/* 🌟 3문항 실시간 의식 스캐너 실행 버튼 🌟 */}
                            <div className="pt-2 flex flex-col gap-2">
                                <button
                                    onClick={handleStartQuestionnaire}
                                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                                >
                                    <Sparkles size={15} />
                                    <span>🔬 3문항 실시간 의식 심리 스캔 시작하기 (AI 무결성 검증)</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('x_axis')}
                                    className="w-full py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-cyan-200 hover:text-white border border-white/[0.08] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <Wind size={14} className="text-cyan-400" />
                                    <span>🧘 Day {selectedZeroDay} 오늘의 영점(Zero Point) 자각 훈련 하러 가기 ➔</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════════════════
                    MODULE 2: X축 의식 코드 & [매일 달라지는 20일 제로포인트 자각 퀘스트]
                   ══════════════════════════════════════════════════════ */}
                {activeTab === 'x_axis' && (
                    <div className="space-y-4 animate-fade-in text-left">
                        <div className="p-5 rounded-3xl bg-gradient-to-b from-[#181135] via-[#100a24] to-[#070412] border border-cyan-400/40 shadow-2xl space-y-4">
                            
                            {/* 헤더 */}
                            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                                <div>
                                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                                        <Zap size={16} className="text-cyan-400" />
                                        <span>X축: 의식 코드 & 영점(0) 자각 코스</span>
                                    </h3>
                                    <p className="text-[10px] text-gray-400">도서 《제로 포인트》 20일 마스터 수련</p>
                                </div>
                                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1">
                                    <BookmarkCheck size={11} />
                                    <span>Day {selectedZeroDay} / 20</span>
                                </span>
                            </div>

                            {/* 🌟 20일 일차 가로 스크롤 셀렉터 🌟 */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                                    <span>📅 1일차~20일차 매일 다른 자각 훈련</span>
                                    <span className="text-cyan-300">터치하여 다른 날짜 보기 ➔</span>
                                </div>
                                <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                                    {ZERO_POINT_20_DAYS.map((q) => {
                                        const isSel = q.day === selectedZeroDay;
                                        return (
                                            <button
                                                key={q.day}
                                                onClick={() => {
                                                    setSelectedZeroDay(q.day);
                                                    setIsBreathingDone(false);
                                                    setIsBreathingActive(false);
                                                }}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                                                    isSel
                                                        ? 'bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 shadow-md font-black scale-105'
                                                        : 'bg-white/[0.05] text-gray-400 border border-white/[0.08] hover:bg-white/[0.1] hover:text-gray-200'
                                                }`}
                                            >
                                                Day {q.day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 🌟 Day N 오늘의 영점 자각 카드 (초보자 맞춤 설명) 🌟 */}
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-[#130b2e] to-slate-950 border border-cyan-400/40 space-y-3 shadow-xl">
                                
                                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                                    <div>
                                        <span className="text-[10px] font-mono text-cyan-300 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-400/30">
                                            Day {activeQuest.day} : {activeQuest.element}
                                        </span>
                                        <h4 className="text-sm font-black text-white mt-1">
                                            {activeQuest.title}
                                        </h4>
                                        <p className="text-[11px] text-amber-300 font-medium">
                                            "{activeQuest.subtitle}"
                                        </p>
                                    </div>
                                    <span className="size-10 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 text-lg">
                                        🧘
                                    </span>
                                </div>

                                {/* 1. 초보자 비유 풀이 */}
                                <div className="p-3 rounded-xl bg-black/50 border border-white/[0.08] space-y-1">
                                    <p className="text-[11px] font-bold text-cyan-300 flex items-center gap-1">
                                        <Smile size={12} />
                                        <span>[1단계. 초보자도 1초 만에 이해하는 비유]</span>
                                    </p>
                                    <p className="text-xs text-gray-200 leading-relaxed font-medium">
                                        {activeQuest.metaphor}
                                    </p>
                                </div>

                                {/* 2. 오늘의 1분 영점 질문 */}
                                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-400/30 space-y-1">
                                    <p className="text-[11px] font-bold text-purple-300 flex items-center gap-1">
                                        <Eye size={12} />
                                        <span>[2단계. 내면을 0으로 만드는 영점 질문]</span>
                                    </p>
                                    <p className="text-xs text-purple-100 font-bold leading-relaxed">
                                        "{activeQuest.inquiry}"
                                    </p>
                                </div>

                                {/* 3. 오늘의 1분 실천 액션 */}
                                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-400/30 space-y-1">
                                    <p className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                                        <Target size={12} />
                                        <span>[3단계. 오늘 하루 즉각 실천 미션]</span>
                                    </p>
                                    <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                                        👉 {activeQuest.action}
                                    </p>
                                </div>

                                {/* 🌟 4. 30초 인터랙티브 영점 호흡기 위젯 🌟 */}
                                <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/30 text-center space-y-3">
                                    <p className="text-xs font-bold text-cyan-300">
                                        🫁 30초 인터랙티브 영점 호흡 실습 (Box Breathing)
                                    </p>

                                    {isBreathingActive ? (
                                        <div className="space-y-3 py-2">
                                            {/* 맥동하는 네온 링 */}
                                            <div className="relative size-32 mx-auto flex items-center justify-center">
                                                <motion.div
                                                    className="absolute inset-0 rounded-full bg-cyan-500/20 border-2 border-cyan-400"
                                                    animate={{
                                                        scale: breathPhase === 'inhale' ? [1, 1.3] : breathPhase === 'hold' ? 1.3 : breathPhase === 'exhale' ? [1.3, 1] : 1,
                                                        opacity: breathPhase === 'hold' ? [0.6, 1, 0.6] : 0.8
                                                    }}
                                                    transition={{ duration: 4, ease: "easeInOut" }}
                                                />
                                                <div className="relative z-10">
                                                    <p className="text-2xl font-black text-white font-mono">{breathSeconds}s</p>
                                                    <p className="text-[11px] font-bold text-cyan-300 mt-0.5">
                                                        {breathPhase === 'inhale' && '들이마시기 (Inhale)'}
                                                        {breathPhase === 'hold' && '✨ 영점 멈춤 (Zero Point)'}
                                                        {breathPhase === 'exhale' && '비워내기 (Exhale)'}
                                                        {breathPhase === 'rest' && '순수 현존 (Presence)'}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleStopBreathing}
                                                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-bold transition-all cursor-pointer"
                                            >
                                                호흡 멈추기
                                            </button>
                                        </div>
                                    ) : isBreathingDone ? (
                                        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 space-y-2 animate-fade-in">
                                            <p className="text-xs font-black text-emerald-300 flex items-center justify-center gap-1">
                                                <CheckCircle2 size={15} />
                                                <span>🎉 Day {activeQuest.day} 영점 자각 호흡 완료!</span>
                                            </p>
                                            <p className="text-[11px] text-emerald-100">
                                                내면의 영점(0)이 활성화되었습니다. 이제 88% 메타코드의 기운이 온전히 흡수됩니다!
                                            </p>
                                            <button
                                                onClick={handleStartBreathing}
                                                className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 text-[10px] font-bold"
                                            >
                                                다시 호흡하기
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleStartBreathing}
                                            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                                        >
                                            <Wind size={15} />
                                            <span>지금 화면을 보며 30초 영점 호흡 실습하기 (Start)</span>
                                        </button>
                                    )}
                                </div>

                                {/* 도서 연결 문구 */}
                                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-[10px] text-amber-200 leading-relaxed text-center">
                                    📖 <strong>도서 《제로 포인트》 수련 안내:</strong> 매일 접속하시면 Day 1부터 Day 20까지의 구체적인 자각 미션이 순차적으로 해금됩니다. 도서 제3장과 함께 수련하시면 100배의 시너지가 일어납니다!
                                </div>

                            </div>

                            {/* 하단 액션 버튼 */}
                            <div className="pt-1 flex flex-col gap-2">
                                <button
                                    onClick={handleStartQuestionnaire}
                                    className="w-full py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-cyan-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <Sparkles size={14} />
                                    <span>🔬 3문항 실시간 의식 레벨 다시 측정하기</span>
                                </button>

                                <button
                                    onClick={() => router.push('/quantum-awakening?tab=quest')}
                                    className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                                >
                                    <Unlock size={14} />
                                    <span>양자 각성 퀘스트 룸 전체 보러 가기 ➔</span>
                                </button>
                            </div>

                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════════════════
                    MODULE 3: Y축 주파수 측정
                   ══════════════════════════════════════════════════════ */}
                {activeTab === 'y_axis' && (
                    <div className="space-y-4 animate-fade-in text-left">
                        <div className="p-5 rounded-3xl bg-gradient-to-b from-[#191036] via-[#100924] to-[#070412] border border-purple-400/40 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                                <div>
                                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                                        <Radio size={16} className="text-purple-400" />
                                        <span>Y축: 행동 주파수 측정계 (Freq)</span>
                                    </h3>
                                    <p className="text-[10px] text-gray-400">현재 측정치: {yVal}Hz (가라앉은 파동)</p>
                                </div>
                                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse">
                                    528Hz 정화 권장
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { hz: 285, name: '285Hz 현재측정' },
                                    { hz: 528, name: '528Hz 기적·정화' },
                                    { hz: 963, name: '963Hz 우주각성' }
                                ].map((p) => (
                                    <button
                                        key={p.hz}
                                        onClick={() => setYVal(p.hz)}
                                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                                            yVal === p.hz
                                                ? 'bg-amber-400 text-slate-950 font-black border-amber-300 shadow-md'
                                                : 'bg-white/[0.04] text-gray-300 border-white/[0.08] hover:bg-white/[0.08]'
                                        }`}
                                    >
                                        <p className="text-xs font-mono font-bold">{p.hz}Hz</p>
                                        <p className="text-[9px] truncate">{p.name}</p>
                                    </button>
                                ))}
                            </div>

                            <p className="text-xs text-indigo-200 bg-indigo-950/40 p-3.5 rounded-2xl border border-indigo-500/30 leading-relaxed font-medium">
                                🎵 <strong>주파수 진단 처방:</strong> 현재 {userName}님의 행동 주파수는 {yVal}Hz로 무겁게 침잠되어 있습니다. 528Hz 솔페지오 치유 사운드를 통해 세포 활성도를 정상화하세요.
                            </p>

                            <button
                                onClick={toggleFrequency}
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                            >
                                {isPlayingSound ? <VolumeX size={15} /> : <Volume2 size={15} />}
                                <span>{isPlayingSound ? '528Hz 주파수 사운드 끄기' : '🔊 528Hz 솔페지오 사랑의 파동 청취하기'}</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════════════════
                    MODULE 4: Z축 에너지 벡터
                   ══════════════════════════════════════════════════════ */}
                {activeTab === 'z_axis' && (
                    <div className="space-y-4 animate-fade-in text-left">
                        <div className="p-5 rounded-3xl bg-gradient-to-b from-[#161132] via-[#0e0922] to-[#070412] border border-rose-400/40 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                                <div>
                                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                                        <Compass size={16} className="text-rose-400" />
                                        <span>Z축: 에너지 벡터 밸런서</span>
                                    </h3>
                                    <p className="text-[10px] text-gray-400">내면 함몰(-50) vs 외면 폭발(+50)</p>
                                </div>
                                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30">
                                    현재: {zVal} (내면 함몰 위험)
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.08] space-y-3">
                                <div className="flex justify-between text-[11px] font-bold">
                                    <span className="text-rose-300">← 내면 함몰 (속앓이/고립)</span>
                                    <span className="text-emerald-300 font-mono font-black">0 (Zero Point)</span>
                                    <span className="text-blue-300">외면 폭발 (번아웃) →</span>
                                </div>
                                
                                <div className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/10">
                                    <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-emerald-400 z-10" />
                                    <motion.div 
                                        className="h-full bg-gradient-to-r from-rose-500 to-amber-400"
                                        style={{ width: `${Math.min(100, Math.max(0, 50 + zVal))}%` }}
                                    />
                                </div>
                            </div>

                            <p className="text-xs text-rose-200/90 bg-rose-950/30 p-3.5 rounded-2xl border border-rose-500/30 leading-relaxed font-medium">
                                ⚖️ <strong>벡터 처방:</strong> 에너지가 바깥으로 순환하지 못하고 내면에 축적되어 감정 체증(Z: {zVal})이 발생했습니다. 3S 솔루션으로 0(Zero)의 균형점을 회복하세요.
                            </p>

                            <button
                                onClick={() => handleConsultAI(`${userName}님의 에너지 벡터(Z축 ${zVal} 내면 함몰 상태)를 해소하고, 속앓이와 감정 체증을 풀어내는 1:1 맞춤 코칭을 진행해주세요.`)}
                                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                            >
                                <MessageSquare size={14} />
                                <span>Z축 에너지 벡터 리포트 상담하기 ➔</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════════════════
                    MODULE 5: 64 뉴럴 DNA 디코더
                   ══════════════════════════════════════════════════════ */}
                {activeTab === 'decoder' && (
                    <div className="space-y-4 animate-fade-in text-left">
                        <div className="p-5 rounded-3xl bg-gradient-to-b from-[#1a1038] via-[#110926] to-[#070412] border border-amber-400/40 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                                <div>
                                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                                        <Key size={16} className="text-amber-400" />
                                        <span>64 뉴럴 DNA 원형 디코더</span>
                                    </h3>
                                    <p className="text-[10px] text-gray-400">생년월일({birthDate}) 기반 맞춤 해독</p>
                                </div>
                                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                    Code #{sajuSpecs?.codeNum || 28}
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-purple-500/10 border border-amber-400/40 space-y-2">
                                <h4 className="text-xs font-black text-amber-300">
                                    {sajuSpecs?.codeTitle}
                                </h4>
                                <div className="space-y-1.5 text-xs">
                                    <p className="text-gray-300">
                                        🌑 <strong>그림자(Shadow):</strong> {sajuSpecs?.shadowDesc}
                                    </p>
                                    <p className="text-amber-200 font-bold">
                                        🎁 <strong>선물(Gift):</strong> {sajuSpecs?.giftDesc}
                                    </p>
                                    <p className="text-cyan-200 font-bold">
                                        ✨ <strong>초월(Siddhi):</strong> {sajuSpecs?.siddhiDesc}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleConsultAI(`${userName}님의 생년월일(${birthDate}) 기반 [${sajuSpecs?.codeTitle}]의 그림자를 극복하고 천재적 선물을 100% 발현하는 심층 디코딩 코칭을 해주세요.`)}
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                            >
                                <MessageSquare size={14} />
                                <span>이 맞춤 뉴럴 코드로 AI 1:1 심층 디코딩 받기 ➔</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════════════════
                    MODULE 6: 3S 솔루션 실행
                   ══════════════════════════════════════════════════════ */}
                {activeTab === 'action_3s' && (
                    <div className="space-y-4 animate-fade-in text-left">
                        <div className="p-5 rounded-3xl bg-gradient-to-b from-[#181138] via-[#100a26] to-[#070412] border border-cyan-400/40 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                                <div>
                                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                                        <Rocket size={16} className="text-cyan-400" />
                                        <span>Sovereign 3S 긴급 처방 프로토콜</span>
                                    </h3>
                                    <p className="text-[10px] text-gray-400">{userName}님 오행 불균형 해소 솔루션</p>
                                </div>
                                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                                    {is3SCompleted ? '✅ 처방 완료' : '처방 대기'}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="p-3 rounded-2xl bg-black/40 border border-cyan-500/30 flex items-start gap-2.5">
                                    <span className="size-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                                        1S
                                    </span>
                                    <div>
                                        <p className="text-xs font-black text-white">SCAN (과밀집 에너지 인지)</p>
                                        <p className="text-[11px] text-gray-300">토(土) {sajuSpecs?.dominantPercent || 50}% 과밀집으로 인한 2026년 실시간 내면 압축과 피로 직시.</p>
                                    </div>
                                </div>

                                <div className="p-3 rounded-2xl bg-black/40 border border-purple-500/30 flex items-start gap-2.5">
                                    <span className="size-6 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                                        2S
                                    </span>
                                    <div>
                                        <p className="text-xs font-black text-white">SYNC (528Hz 파동 정화)</p>
                                        <p className="text-[11px] text-gray-300">285Hz로 가라앉은 신경계를 528Hz 기적의 사랑 주파수로 정화.</p>
                                    </div>
                                </div>

                                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 to-purple-500/15 border border-amber-400/40 flex items-start gap-2.5">
                                    <span className="size-6 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                                        3S
                                    </span>
                                    <div>
                                        <p className="text-xs font-black text-amber-200">SHIFT (결핍 에너지 완충 및 순환)</p>
                                        <p className="text-[11px] text-gray-200">결핍된 {sajuSpecs?.deficientOh} 에너지를 채워 2026년 막힌 기운을 뚫어냄.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 flex flex-col gap-2">
                                <button
                                    onClick={handleExecute3S}
                                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-400 to-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                                >
                                    <CheckCircle2 size={16} />
                                    <span>{is3SCompleted ? '✨ 3S 처방 재실행하기' : '⚡ Sovereign 3S 처방 지금 즉시 실행하기'}</span>
                                </button>

                                <button
                                    onClick={() => handleConsultAI(`${userName}님의 Sovereign 3S 긴급 처방을 오늘 일상에 적용하여 2026년 막힌 오행 에너지를 시원하게 순환시키는 1:1 맞춤 실행 가이드를 제시해주세요.`)}
                                    className="w-full py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-cyan-200 hover:text-white border border-white/[0.08] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <MessageSquare size={14} className="text-cyan-400" />
                                    <span>AI 코치와 3S 긴급 처방 1:1 실시간 실행하기 ➔</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </main>

            {/* ══════════════════════════════════════════════════════
                🌟 3문항 실시간 의식 스캐너 & 결과 리포트 모달 🌟
               ══════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {isQuestionModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 15 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 15 }}
                            className="w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-3xl bg-[#110b28] border border-cyan-400/40 p-5 shadow-2xl space-y-4 text-left relative scrollbar-thin scrollbar-thumb-cyan-500/30"
                        >
                            {/* 1. AI 불성실/모순 경고 팝업 화면 */}
                            {aiWarning ? (
                                <div className="space-y-4 text-center py-2 animate-fade-in">
                                    <div className="size-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]">
                                        <AlertTriangle size={24} />
                                    </div>
                                    <div className="space-y-2 text-left">
                                        <h3 className="text-sm font-black text-rose-300 text-center">
                                            ⚠️ AI 실시간 무결성 검증 경고
                                        </h3>
                                        <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/30 text-xs text-rose-100 whitespace-pre-line leading-relaxed font-medium">
                                            {aiWarning}
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleStartQuestionnaire}
                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                                    >
                                        <RefreshCw size={14} />
                                        <span>진지하게 마음을 가다듬고 다시 시작하기</span>
                                    </button>
                                </div>
                            ) : isAnalyzing ? (
                                /* 2. AI 신경망 실시간 연산 중 로딩 연출 */
                                <div className="py-8 text-center space-y-4 animate-fade-in">
                                    <div className="size-16 rounded-full border-4 border-cyan-400/20 border-t-cyan-400 animate-spin mx-auto shadow-[0_0_25px_rgba(6,182,212,0.8)]" />
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-black text-cyan-200">
                                            🧠 AI 신경망 심리 데이터 동기화 중...
                                        </h3>
                                        <p className="text-[11px] text-gray-400 font-mono">
                                            [사주 원국 30% + 일진 20% + 실시간 문진 50%] 결합 연산 중
                                        </p>
                                    </div>
                                </div>
                            ) : analysisResult ? (
                                /* 3. 🌟 문진 완료 종합 결과 리포트 카드 🌟 */
                                <div className="space-y-4 animate-fade-in">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="size-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                                                <CheckCircle2 size={16} />
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-black text-white">
                                                    실시간 심리 스캔 분석 완료
                                                </h3>
                                                <p className="text-[10px] text-cyan-300 font-mono">
                                                    {analysisResult.codeName}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsQuestionModalOpen(false)}
                                            className="text-gray-400 hover:text-white text-xs p-1"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    {/* Before ➔ After 비교 인포그래픽 */}
                                    <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-2.5">
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span className="text-gray-400">문진 반영 전: {analysisResult.prevLevel}%</span>
                                            <span className="text-emerald-400 text-sm font-mono font-black">
                                                ➔ 실제 측정치: {analysisResult.newLevel}%
                                            </span>
                                        </div>

                                        <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden flex border border-white/10">
                                            <div style={{ width: `${analysisResult.darkRatio}%` }} className="bg-rose-500" title="Dark" />
                                            <div style={{ width: `${analysisResult.neuralRatio}%` }} className="bg-indigo-500" title="Neural" />
                                            <div style={{ width: `${analysisResult.metaRatio}%` }} className="bg-cyan-400" title="Meta" />
                                        </div>

                                        <div className="flex justify-between text-[9px] font-mono text-gray-300 pt-0.5">
                                            <span className="text-rose-400 font-bold">Dark {analysisResult.darkRatio}%</span>
                                            <span className="text-indigo-300 font-bold">Neural {analysisResult.neuralRatio}%</span>
                                            <span className="text-cyan-300 font-bold">Meta {analysisResult.metaRatio}%</span>
                                        </div>
                                    </div>

                                    {/* 분석 총평 */}
                                    <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-400/30 text-xs text-gray-200 leading-relaxed font-medium">
                                        {analysisResult.summary}
                                    </div>

                                    {/* 🌟 [대표님 요청 장착] 제로포인트(0)로 들어가는 3단계 실천 공식 🌟 */}
                                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/50 via-[#160c33] to-slate-950 border border-cyan-400/40 space-y-2.5 text-left">
                                        <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                                            <p className="text-[11px] font-black text-cyan-300 flex items-center gap-1">
                                                <Sparkles size={13} className="text-amber-400" />
                                                <span>도서 《제로 포인트》 즉각 자각 3단계 공식</span>
                                            </p>
                                            <span className="text-[9px] font-mono text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-400/30">
                                                1초 리셋
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-xs">
                                            <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                                                <span className="text-[10px] font-bold text-cyan-300">1단계. 【1초 정지 & 감정 분리 (Decoupling)】</span>
                                                <p className="text-[11px] text-gray-300 leading-relaxed">
                                                    "지금 느끼는 불안·분노는 '나'가 아닙니다. 마음의 하늘을 지나가는 '비구름'일 뿐입니다. 비구름을 나라고 착각하지 마세요."
                                                </p>
                                            </div>

                                            <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                                                <span className="text-[10px] font-bold text-indigo-300">2단계. 【4-4-4 영점 호흡 (Zero-Breath)】</span>
                                                <p className="text-[11px] text-gray-300 leading-relaxed">
                                                    4초간 깊게 들이마시고 ➔ 4초간 숨을 멈춰 '영점(0)'을 잡고 ➔ 4초간 천천히 비워냅니다. 편도체(공포)가 꺼지고 전두엽(메타코드)이 켜집니다!
                                                </p>
                                            </div>

                                            <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                                                <span className="text-[10px] font-bold text-amber-300">3단계. 【영점 자각 질문 (The Zero-Question)】</span>
                                                <p className="text-[11px] text-amber-100 font-bold leading-relaxed">
                                                    "이 요동치는 감정을 뒤에서 고요히 바라보고 있는 '진짜 나'는 누구인가?" 질문 즉시 의식은 0(Zero)의 중심에 도달합니다!
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 🌟 [결과 팝업 내 즉시 실행] 30초 인터랙티브 영점 호흡기 위젯 🌟 */}
                                    <div className="p-3.5 rounded-2xl bg-black/60 border border-cyan-500/30 text-center space-y-2.5">
                                        <p className="text-xs font-bold text-cyan-300 flex items-center justify-center gap-1">
                                            <Wind size={13} />
                                            <span>화면에서 즉시 실행하는 30초 영점 호흡기</span>
                                        </p>

                                        {isBreathingActive ? (
                                            <div className="space-y-2.5 py-1">
                                                <div className="relative size-28 mx-auto flex items-center justify-center">
                                                    <motion.div
                                                        className="absolute inset-0 rounded-full bg-cyan-500/20 border-2 border-cyan-400"
                                                        animate={{
                                                            scale: breathPhase === 'inhale' ? [1, 1.25] : breathPhase === 'hold' ? 1.25 : breathPhase === 'exhale' ? [1.25, 1] : 1,
                                                            opacity: breathPhase === 'hold' ? [0.6, 1, 0.6] : 0.8
                                                        }}
                                                        transition={{ duration: 4, ease: "easeInOut" }}
                                                    />
                                                    <div className="relative z-10">
                                                        <p className="text-xl font-black text-white font-mono">{breathSeconds}s</p>
                                                        <p className="text-[10px] font-bold text-cyan-300 mt-0.5">
                                                            {breathPhase === 'inhale' && '들이마시기 (Inhale)'}
                                                            {breathPhase === 'hold' && '✨ 영점 멈춤 (Zero Point)'}
                                                            {breathPhase === 'exhale' && '비워내기 (Exhale)'}
                                                            {breathPhase === 'rest' && '순수 현존 (Presence)'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={handleStopBreathing}
                                                    className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-[10px] font-bold transition-all cursor-pointer"
                                                >
                                                    호흡 일시 정지
                                                </button>
                                            </div>
                                        ) : isBreathingDone ? (
                                            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 space-y-1.5 animate-fade-in">
                                                <p className="text-xs font-black text-emerald-300 flex items-center justify-center gap-1">
                                                    <CheckCircle2 size={14} />
                                                    <span>🎉 30초 영점(Zero Point) 평온 체험 완료!</span>
                                                </p>
                                                <p className="text-[10px] text-emerald-100">
                                                    방금 0점의 감각을 깨우셨습니다! 닫혀 있던 88% 메타코드가 현실로 연결됩니다.
                                                </p>
                                                <button
                                                    onClick={handleStartBreathing}
                                                    className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-[10px] font-bold"
                                                >
                                                    한 번 더 호흡하기
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleStartBreathing}
                                                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                                            >
                                                <Wind size={14} />
                                                <span>🧘 지금 30초 영점 호흡으로 리셋하기 (Start)</span>
                                            </button>
                                        )}

                                        <p className="text-[10px] text-amber-200/90 leading-relaxed font-medium pt-1">
                                            📖 <strong>도서 《제로 포인트》 필연적 수련:</strong> 방금 경험하신 30초의 영점 상태를 24시간 내 일상과 사업의 무기로 체화하는 비법이 바로 도서 《제로 포인트》 제3장에 수록되어 있습니다.
                                        </p>
                                    </div>

                                    {/* 액션 버튼 2종 */}
                                    <div className="flex flex-col gap-2 pt-1">
                                        <button
                                            onClick={() => {
                                                setIsQuestionModalOpen(false);
                                                setActiveTab('x_axis');
                                            }}
                                            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                                        >
                                            <BookmarkCheck size={14} />
                                            <span>📅 Day {selectedZeroDay} 20일 자각 코스 상세 수련 하러 가기 ➔</span>
                                        </button>

                                        <button
                                            onClick={() => {
                                                setIsQuestionModalOpen(false);
                                                handleConsultAI(`${userName}님의 [3문항 심리 스캔 실제 측정치: ${analysisResult.newLevel}%, ${analysisResult.codeName}] 분석 결과를 바탕으로, 방금 실습한 3단계 영점 공식을 활용해 무의식 방어기제를 녹여내는 1:1 맞춤 코칭을 해주세요.`);
                                            }}
                                            className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-cyan-200 border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                                        >
                                            <MessageSquare size={13} className="text-cyan-400" />
                                            <span>이 결과로 AI 코치와 1:1 심층 상담하기 ➔</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* 4. 3문항 질문 스텝 화면 */
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                        <div>
                                            <span className="text-[10px] font-mono text-cyan-300 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-400/30">
                                                문항 {currentQIndex + 1} / 3
                                            </span>
                                            <p className="text-xs font-bold text-gray-300 mt-1">
                                                [{CONSCIOUSNESS_QUESTIONS[currentQIndex].category}]
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setIsQuestionModalOpen(false)}
                                            className="text-gray-400 hover:text-white text-xs p-1"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <h4 className="text-sm font-black text-white leading-snug">
                                        {CONSCIOUSNESS_QUESTIONS[currentQIndex].question}
                                    </h4>

                                    <div className="space-y-2">
                                        {CONSCIOUSNESS_QUESTIONS[currentQIndex].options.map((opt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSelectOption(opt.weight)}
                                                className="w-full p-3 rounded-2xl bg-black/40 hover:bg-cyan-950/40 border border-white/10 hover:border-cyan-400/50 text-left transition-all group cursor-pointer active:scale-98"
                                            >
                                                <p className="text-[10px] font-mono font-bold text-cyan-300 mb-0.5 group-hover:text-cyan-200">
                                                    {opt.code}
                                                </p>
                                                <p className="text-xs text-gray-200 font-medium leading-relaxed">
                                                    {opt.text}
                                                </p>
                                            </button>
                                        ))}
                                    </div>

                                    <p className="text-[10px] text-gray-400 text-center font-mono">
                                        🔬 AI가 응답 시간 및 심리 일관성을 실시간 분석 중입니다.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

export default function NeuralDiagnosisPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#05030b] flex items-center justify-center text-cyan-300 font-mono text-xs">
                <span>🧬 3D 정밀 진단 시스템 동기화 중...</span>
            </div>
        }>
            <NeuralDiagnosisContent />
        </Suspense>
    );
}
