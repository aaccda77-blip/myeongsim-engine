import React, { useMemo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, TrendingUp, AlertCircle, ChevronDown, Sparkles, Loader2 } from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';
import { calculateSaju, calculateSajuStats } from '@/lib/saju/SajuEngine';
import MyeongliTermModal from './MyeongliTermModal';
import PaymentCard from '../chat/PaymentCard';

interface SajuAnalysisReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile?: any | null;
    onOpenCoaching?: () => void;
}

// 1. 10대 일간(본질) 초밀도 감동 힐링 해설 데이터셋
const DAILY_MASTER_EXPLANATIONS: Record<string, { title: string; desc: string }> = {
    '甲': {
        title: '곧게 뻗는 큰 나무 // 당당함과 성장의 에너지',
        desc: '당신의 본질은 하늘을 향해 당당히 가지를 뻗는 거대한 큰 나무(甲)입니다. 늘 성장을 갈망하고 올곧은 의지와 굳건한 생명력을 지녔지만, 때로는 꺾이지 않으려 버티다가 내면의 상처를 깊이 입을 수 있습니다. 거친 바람이 불 때는 유연하게 흔들려도 괜찮습니다. 당신은 이미 그 존재 자체로 든든한 한 그루의 숲이자 타인을 보듬는 따뜻한 쉼터입니다.'
    },
    '을': {
        title: '유연한 덩굴 식물 // 지혜로운 적응과 유대',
        desc: '당신의 본질은 척박한 바위틈에서도 강인하게 뻗어나가 예쁜 꽃을 피우는 덩굴 식물(을)입니다. 뛰어난 친화력과 부드러운 유연성으로 모진 환경을 지혜롭게 극복해 가지만, 홀로 서지 못하고 주변에 기대어 쉽게 상처받기도 합니다. 덩굴의 부드러움은 유약함이 아닙니다. 모진 태풍에도 부러지지 않고 대지를 통째로 품어 안는 가장 지혜로운 생명의 힘입니다.'
    },
    '丙': {
        title: '세상을 비추는 태양 // 차별 없는 열정과 온기',
        desc: '당신의 본질은 온 세상을 아무런 분별 없이 따뜻하게 비추는 드넓은 태양(丙)입니다. 넘치는 정의로움과 환한 에너지는 주변 사람들에게 희망을 선사하지만, 때로는 스스로의 뜨거운 빛을 이기지 못해 번아웃되거나 다른 사람을 덥게 만들어 갈등을 겪기도 합니다. 밤이 오면 태양도 쉬어가듯, 가끔은 의식의 과열 버튼을 끄고 고요한 어둠을 부드럽게 받아들여 보세요.'
    },
    '정': {
        title: '어둠을 밝히는 촛불 // 사려 깊은 헌신과 위로',
        desc: '당신의 본질은 칠흑 같은 어둠 속에서 조용히 밤길을 밝혀주는 은은하고 따뜻한 촛불(정)입니다. 깊은 공감력과 세심한 배려심으로 아파하는 이들의 속마음을 어루만져 주는 따뜻한 빛을 지녔지만, 스스로의 몸을 녹여가며 빛을 내기에 내면이 늘 쓸쓸하고 외로워지기 쉽습니다. 타인을 비추기 전에, 지친 스스로의 마음 방을 먼저 따뜻하게 덥혀주세요.'
    },
    '戊': {
        title: '믿음직한 큰 산 // 넓은 포용력과 흔들림 없는 중심',
        desc: '당신의 본질은 억만년의 모진 비바람에도 묵묵히 제자리를 지키는 믿음직한 큰 산(戊)입니다. 넓은 포용력과 중용의 미덕으로 주변 사람들의 든든한 신뢰를 한 몸에 받지만, 때로는 지나치게 완고해져 속마음을 털어놓지 못하고 외로운 고립을 자초하곤 합니다. 산 위를 흘러가는 가벼운 구름처럼, 마음에 고여있는 무거운 생각의 짐들을 바람에 기꺼이 날려 보내도 괜찮습니다.'
    },
    '기': {
        title: '만물을 기르는 밭 // 묵묵한 모성적 수용과 헌신',
        desc: '당신의 본질은 온갖 씨앗을 품어 싹을 틔우는 따뜻하고 비옥한 대지(기)입니다. 사람들의 모난 생각과 감정을 다 받아주고 성장시켜 내는 묵묵한 어머니 같은 수용력을 가졌지만, 내면에는 미처 표현하지 못한 눈물과 굳어버린 번뇌들이 고여있기 쉽습니다. 땅속에 물이 고이면 썩듯, 가슴속에 묻어두었던 나만의 응어리를 밖으로 솔직하고 시원하게 털어놓아 보세요.'
    },
    '庚': {
        title: '강인한 바위/원석 // 타협 없는 정의로움과 단단함',
        desc: '당신의 본질은 거친 야성을 지니고 갓 캐내어진 강직한 바위와 원석(庚)입니다. 거짓 없는 솔직함과 선이 굵은 강한 힘을 지녀 든든한 신뢰를 선물하지만, 자칫 모나고 거칠어서 소중한 이들에게 뜻하지 않게 날카로운 상처를 주거나 스스로를 자책하기도 합니다. 당신은 무언가로 예쁘게 다듬어지기 전인, 있는 그대로의 원초적인 단단함만으로도 이미 완벽하게 가치 있습니다.'
    },
    '신': {
        title: '섬세한 보석/칼 // 영롱한 해상도와 날카로운 예리함',
        desc: '당신의 본질은 어두운 흙 속의 고통을 견디고 마침내 정교하게 세공된 가장 영롱하고 투명한 보석(신)입니다. 완성도 높은 세밀한 감수성과 곧은 결을 가졌지만, 내면에 서늘한 예리함을 품고 있어 스스로를 가혹하게 평가하고 찌르기 쉽습니다. 나를 찌르는 날카로운 판단의 칼끝을 잠시 내려놓고, 그저 고요하게 빛나고 있는 있는 그대로의 나를 따뜻하게 안아주세요.'
    },
    '壬': {
        title: '깊고 넓은 바다 // 무한한 지혜와 자유로운 심연',
        desc: '당신의 본질은 세상의 모든 물줄기를 차별 없이 다 받아들이는 거대하고 깊은 바다(壬)입니다. 막힘없는 자유로움과 유연한 지혜를 지녔으나, 때로는 나도 모르게 속을 알 수 없는 무거운 감정의 심연 속으로 가라앉아 우울과 쓸쓸함의 파도를 마주하곤 합니다. 바다 깊은 곳은 태풍이 불어도 언제나 평온하듯, 마음의 요동치는 파도 아래 늘 침묵하고 있는 고요한 나의 바탕을 자각해 보세요.'
    },
    '계': {
        title: '스며드는 봄비 // 촉촉한 감수성과 생명의 단비',
        desc: '당신의 본질은 메마른 대지를 소리 없이 다정하게 적셔주는 하늘에서 스며드는 맑은 단비(계)입니다. 뛰어난 영리함과 풍부한 예술적 감수성을 지녀 메마른 마음에 활력을 채워주지만, 쉽게 주변 환경이나 타인의 감정에 물들어 흐릿해지고 눈물을 머금곤 합니다. 비가 그치면 하늘이 맑게 개듯, 내 마음의 구름을 걷어내고 성성하게 깨어나 본연의 맑은 거울이 되어보세요.'
    }
};

// 2. 5대 오행의 강약에 따른 마인드 디버깅 해설 데이터셋
const ELEMENT_EXPLANATIONS: Record<string, { max: string; min: string }> = {
    '목(木)': {
        max: '시작하려는 욕구와 무언가를 개척하려는 강박이 내면에 다소 과부하되어 있습니다. 뇌가 늘 곤두서서 쉬지 못할 수 있으니 성장의 속도를 늦추고 나무의 그늘처럼 잠시 가만히 멈춰 서 숨을 고르세요.',
        min: '새로운 일을 개척하거나 결단하려는 마음의 추진력이 저하되어 주저하고 있을 수 있습니다. 어떤 큰 결과를 만들어야 한다는 강박을 내려놓고, 오늘 가볍게 작은 하나를 시도해 보는 것만으로도 충분합니다.'
    },
    '화(火)': {
        max: '열정과 감정의 주파수가 지나치게 과열되어 마음이 쉽게 들뜨고 번아웃의 위기에 직면했습니다. 가슴이 타들어 가는 듯한 초조함이 든다면, 열정의 방 온도를 낮추고 2초간 시원하게 호흡의 코드를 정리해 보세요.',
        min: '내면의 밝은 열정과 에너지가 차갑게 식어 무기력함과 냉소주의에 노출되어 있을 수 있습니다. 나를 강박적으로 채찍질하기보다는 내 아바타를 따뜻하게 돌보고, 지금 느껴지는 소박한 감각들부터 따뜻하게 스캔하세요.'
    },
    '토(土)': {
        max: '생각의 데이터들이 한곳에 고여 굳어버린 완고함이나 과도한 꼬리물기(DMN 과열)에 갇혀 있을 수 있습니다. 복잡하게 얽힌 소유와 걱정의 자막들을 통째로 비워버리는 포맷(Format) 리추얼이 필요한 순간입니다.',
        min: '마음의 중심을 지탱해 주는 든든한 대지가 흔들리듯 심리적인 안정감이 일시적으로 저하되었을 수 있습니다. 무언가 무너질 것 같은 불안이 엄습한다면, 가만히 앉아 중력이 나를 지탱해 주는 느낌에 온전히 안착해 보세요.'
    },
    '금(金)': {
        max: '나와 세상을 칼같이 날카롭게 가르고 평가하려는 분별의 칼날이 너무 많이 서 있습니다. 이분법적으로 상황을 쪼개어 보며 분석하느라 의식 오퍼레이터가 크게 피로한 상태이니, 시시비비의 칼날을 잠시 내려놓으세요.',
        min: '상황을 맺고 끊는 결단과 나만의 안전한 심리적 울타리를 세우는 에너지가 부족해 흐릿한 상황이 방치되고 있을 수 있습니다. 쳐낼 것은 쳐내고 내 의식 스크린의 선명도를 확보하여 나를 방해하는 노이즈를 명확히 차단해 보세요.'
    },
    '수(水)': {
        max: '감정의 깊은 심연 속에 너무 깊이 빠져 고독과 우울의 동굴 속으로 움츠러들기 쉬운 과습 상태입니다. 혼자만의 무거운 고민에 침잠해 있기보다, 에너지를 밖으로 안전하게 표출하거나 산책을 하며 의식을 밖으로 스캔해 보세요.',
        min: '지혜롭게 흐르고 상황을 유연하게 수용해야 할 감정의 샘이 잠시 메마른 상태입니다. 유연하지 못하고 마음이 딱딱하게 굳어 불안이 생긴다면, 호흡의 부드러운 물길을 느끼며 긴장 로그를 흘려보내세요.'
    }
};

// 3. 자각 주파수 등급별 해설 데이터셋
const LEVEL_EXPLANATIONS: Record<string, { title: string; desc: string }> = {
    'shift': {
        title: '500Hz+ // 완전한 시프트(Shift) : 순수 자각 상태',
        desc: '마음속에서 일어나는 비련의 주인공 배역(에고)의 감정에 갇히지 않고, 모든 감정과 상황들이 평화롭게 흘러가는 얼룩지지 않는 고요한 "스크린 그 자체(제로포인트)"로 존재의 시점을 완전히 옮겨온 경이로운 의식 OS의 진화 상태입니다. 이곳은 세상 그 어떤 불길이나 폭풍우에도 상처를 입지 않는 당신 본래의 완전하고 안전한 기본값 영역입니다.'
    },
    'insight': {
        title: '400Hz+ // 자각/통찰(Insight) : 메타인지 관찰 상태',
        desc: '내면에 떠오르는 생각과 감정이 진짜 나 자신이 아니라, 단지 내 의식이라는 광활한 하늘을 가만히 스쳐 지나가는 구름과 데이터 로그일 뿐임을 제3자의 시선으로 명확히 비추어 목격하고 있는 상태입니다. 요동치는 감정에 과몰입해 휘쓸려 다니지 않고, 한 걸음 물러나 고요히 디버깅하는 지혜로운 오퍼레이터의 눈(정견)이 켜져 있습니다.'
    },
    'sync': {
        title: '300Hz+ // 수용/조화(Sync) : 다크코드 포용 상태',
        desc: '갑작스럽게 역류하는 불안, 우울, 수치심 같은 부정적 감정 로그(다크코드)들을 억지로 뜯어고치거나 없애려고 내면에서 발버둥 치며 싸우지 않고, 있는 그대로 따뜻하게 통째로 품어 안아주는 동기화(Sync)를 가동하고 있습니다. 생각과의 지루한 전투가 멈출 때, 마음의 프로세서 부하가 풀리며 스스로의 치유와 안정이 개시됩니다.'
    },
    'scan': {
        title: '200Hz+ // 마주함/용기(Scan) : 회피 로그 아웃 상태',
        desc: '그동안 아프다는 이유로 억누르고 피해왔던 내면의 상처와 직면하기(Scan) 시작한 대단히 용기 있고 대견한 상태입니다. 바깥 사주의 날씨 탓을 하며 절망하던 피해자 모드를 종료하고, 내 의식 OS의 정렬과 리셋을 직접 시도하겠다는 주도적인 자각 주파수가 힘차게 작동을 시작했습니다.'
    },
    'wait': {
        title: '200Hz 미만 // 자각 스캔 대기 : DMN 과열 모드',
        desc: '과거에 얽매여 후회하거나 다가오지 않은 미래를 미리 염려하느라 뇌의 자동 조종 네트워크(DMN)가 심각하게 과열되어 마음의 과부하가 걸려 있는 상태입니다. 억지로 이 불안을 해결하려 머리를 쓰지 마세요. 그저 눈을 감고 지금 들어오고 나가는 호흡에 감각 주파수를 동기화하며, 제로포인트 알사탕을 마음으로 녹이듯 뇌를 부드럽게 리셋해야 합니다.'
    }
};

// 4. 오늘의 컨디션 질문선택지
const CONDITION_OPTIONS = [
    { label: '🌌 제로포인트 접속 (생각이 없는 고요함)', offset: 120 },
    { label: '👁️ 관찰자 모드 (생각과 감정을 목격함)', offset: 80 },
    { label: '🤝 수용과 흐름 (부정적 감정도 품어줌)', offset: 40 },
    { label: '🏃 자동 조종 작동 (해결하려고 조바심 냄)', offset: 0 },
    { label: '🌪️ 시스템 과열 (걱정/후회 소설에 갇힘)', offset: -50 }
];

// 5. 격국 및 2026 우주 기류 해설 헬퍼
const GYEOKGUK_MAP: Record<string, { title: string; desc: string; solution: string }> = {
    '甲': { title: '식신제살격 (식신/선구자형)', desc: '거대한 원칙과 추진력으로 세상을 바르게 일으켜 세우는 개척자적 본질', solution: '내 고집을 밀어붙이기보다 유연하게 타인의 소리를 품을 때 리더십이 만개합니다.' },
    '乙': { title: '인수쌍전격 (친화/지혜형)', desc: '척박한 바위에서도 끈질기게 꽃을 피워내는 부드럽고 지혜로운 유대 에너지', solution: '타인에게 기대기보다 나 자신의 자립심을 신뢰할 때 위대한 결실을 맺습니다.' },
    '丙': { title: '태양편재격 (열정/비전형)', desc: '온 세상을 밝게 비추며 세상을 이끄는 차별 없는 뜨거운 직관과 포용력', solution: '열정이 과열되어 번아웃되지 않도록 밤의 고요한 이완을 부드럽게 받아들이세요.' },
    '丁': { title: '정인관성격 (배려/위로형)', desc: '어둠 속을 고요히 밝혀 타인의 아픔을 어루만져 주는 따뜻한 촛불 에너지', solution: '스스로의 몸을 녹여 빛내기보다 내 안의 쉼터를 먼저 온화하게 덥혀주세요.' },
    '戊': { title: '신왕재성격 (포용/신뢰형)', desc: '모진 풍파에도 제자리를 묵묵히 지키는 든든한 큰 산 같은 중용의 미덕', solution: '무거운 생각을 혼자 품지 말고 바람에 날려 보내듯 마음을 포맷해 보세요.' },
    '己': { title: '기토탁희격 (수용/성장형)', desc: '만물의 씨앗을 품어 커다란 숲으로 키워내는 어머니 같은 묵묵한 헌신', solution: '가슴속에 고인 눈물과 응어리를 밖으로 솔직하게 털어놓을 때 평화가 깃듭니다.' },
    '庚': { title: '양금성기격 (정의/단단함)', desc: '거짓 없는 솔직함과 타협 없는 곧은 결을 지닌 강인한 원석과 바위', solution: '나와 세상을 칼로 자르듯 평가하지 말고, 원초적 단단함 자체를 사랑해 주세요.' },
    '辛': { title: '수기유통격 (예리/보석형)', desc: '흙 속의 아픔을 견디고 마침내 영롱하게 빛나는 세공된 다이아몬드 본질', solution: '나를 찌르는 날카로운 완벽주의 칼날을 거두고, 투명한 내 빛을 그대로 안아주세요.' },
    '壬': { title: '임수통해격 (자유/지혜형)', desc: '모든 물줄기를 다 안아주는 깊고 거대한 바다처럼 막힘없는 유연함', solution: '무거운 감정의 깊은 동굴에 침잠하지 말고 시선을 넓은 의식으로 올려보세요.' },
    '癸': { title: '계수윤하격 (단비/감수성)', desc: '메마른 대지를 소리 없이 다정하게 적셔주는 촉촉한 봄비 같은 맑은 영혼', solution: '타인의 감정에 물들어 눈물짓지 말고, 맑은 거울처럼 성성하게 깨어나세요.' }
};

export default function SajuAnalysisReportModal({ isOpen, onClose, userProfile, onOpenCoaching }: SajuAnalysisReportModalProps) {
    const { reportData: storeData } = useReportStore();
    const reportData = storeData || userProfile;

    const [mounted, setMounted] = useState(false);
    
    // 클릭하여 아코디언 상세 설명이 열려 있는 섹션 상태 ('identity' | 'energy' | 'state' | null)
    const [expandedSection, setExpandedSection] = useState<'identity' | 'energy' | 'state' | null>(null);

    // 명리학 용어 팝업 모달 상태
    const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // 🔮 [수술] 사용자 생년월일(사주 오행) + 오늘 날짜(Daily Date Seed) 연동 동적 5대 에너지 점수 연산
    const dynamicEnergyScores = useMemo(() => {
        const todayStr = new Date().toISOString().slice(0, 10);
        let seed = 0;
        for (let i = 0; i < todayStr.length; i++) {
            seed = (seed * 31 + todayStr.charCodeAt(i)) % 10007;
        }

        const ohaeng = reportData?.saju?.ohaeng || reportData?.saju?.elements;
        const woodVal = typeof ohaeng?.wood === 'number' ? ohaeng.wood : 20;
        const fireVal = typeof ohaeng?.fire === 'number' ? ohaeng.fire : 20;
        const earthVal = typeof ohaeng?.earth === 'number' ? ohaeng.earth : 20;
        const metalVal = typeof ohaeng?.metal === 'number' ? ohaeng.metal : 20;
        const waterVal = typeof ohaeng?.water === 'number' ? ohaeng.water : 20;

        const relation = Math.min(99, Math.max(55, 68 + (woodVal % 16) + (seed % 13) - 5));
        const vision = Math.min(99, Math.max(55, 70 + (fireVal % 16) + ((seed * 3) % 13) - 5));
        const resource = Math.min(99, Math.max(55, 67 + (earthVal % 16) + ((seed * 7) % 13) - 5));
        const bio = Math.min(99, Math.max(55, 63 + (metalVal % 16) + ((seed * 11) % 13) - 5));
        const meta = Math.min(99, Math.max(55, 74 + (waterVal % 16) + ((seed * 13) % 13) - 5));
        const total = Math.round((relation + vision + resource + bio + meta) / 5);

        return { relation, vision, resource, bio, meta, total, todayStr };
    }, [reportData]);

    // 🎨 [동적 수호아이템 연산] 생년월일 + 오늘 일진(Daily Saju Ganji & Biorhythm) 기반 동적 연산
    const dynamicGuardianItems = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const birthDate = reportData?.birthDate || userProfile?.birthDate || userProfile?.birth_date || '1990-01-01';
        const dayStem = reportData?.saju?.dayMasterChar || userProfile?.saju?.dayMasterChar || '甲';
        
        // 생년월일 + 오늘 날짜 + 일간 결합 고유 시드
        const seedKey = `${birthDate}_${todayStr}_${dayStem}`;
        let seed = 0;
        for (let i = 0; i < seedKey.length; i++) {
            seed = (seed * 33 + seedKey.charCodeAt(i)) % 99991;
        }

        const colors = [
            { name: '클래식 네이비', colorClass: 'text-indigo-300' },
            { name: '에메랄드 포레스트', colorClass: 'text-emerald-300' },
            { name: '골든 앰버', colorClass: 'text-amber-300' },
            { name: '크림슨 로즈', colorClass: 'text-rose-300' },
            { name: '코발트 틸', colorClass: 'text-cyan-300' },
            { name: '티리언 퍼플', colorClass: 'text-purple-300' },
            { name: '딥 오션 블루', colorClass: 'text-blue-300' },
            { name: '선셋 오렌지', colorClass: 'text-orange-300' },
            { name: '루비 레드', colorClass: 'text-pink-300' },
            { name: '플래티넘 실버', colorClass: 'text-slate-200' },
        ];

        const numbers = ['3', '7', '8', '11', '24', '36', '58', '77', '88', '99'];

        const items = [
            '손목시계',
            '원목 오일 디퓨저',
            '천연 쿼츠 원석',
            '실크 스카프',
            '432Hz 이어버드',
            '은반지',
            '아로마 롤온',
            '가죽 다이어리',
            '텀블러',
            '황동 열쇠고리',
            '민트 오가닉 티',
            '블루라이트 차단안경'
        ];

        const selectedColor = colors[seed % colors.length];
        const selectedNumber = numbers[(seed * 7) % numbers.length];
        const selectedItem = items[(seed * 13) % items.length];

        return {
            color: selectedColor.name,
            colorClass: selectedColor.colorClass,
            number: selectedNumber,
            item: selectedItem,
        };
    }, [reportData, userProfile]);

    const handleTermClick = (e: React.MouseEvent, term: string) => {
        e.stopPropagation(); // 아코디언 열림 방지
        setSelectedTerm(term);
    };

    // 실시간 주파수 융합 스캔을 위한 로컬 상태 설계
    const [scanState, setScanState] = useState<'pending' | 'scanning' | 'completed'>('pending');
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [scannedHz, setScannedHz] = useState<number>(0);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // 모달이 켜질 때 오늘 이미 스캔을 마친 이력이 로컬스토리지에 있는지 판별하여 상태를 보존
    useEffect(() => {
        if (isOpen && typeof window !== 'undefined') {
            const todayStr = new Date().toISOString().split('T')[0];
            const savedDate = localStorage.getItem('myeongsim_today_scan_date');
            const savedHz = localStorage.getItem('myeongsim_today_scan_hz');
            
            if (savedDate === todayStr && savedHz) {
                setScannedHz(parseInt(savedHz));
                setScanState('completed');
            } else {
                setScanState('pending');
                setSelectedOption(null);
            }
        }
    }, [isOpen]);

    const toggleSection = (section: 'identity' | 'energy' | 'state') => {
        setExpandedSection(prev => prev === section ? null : section);
    };

    // 🔮 [수술] 사용자 실제 생년월일 기반 사주 4주 팔자 동적 연산 메모
    const analysis = useMemo(() => {
        let sajuData = reportData?.saju || reportData?.sajuData || reportData?.saju_data;
        
        // 1. 생년월일/시간/성별 정보 다각도 추출
        const rawDate = reportData?.birthDate || userProfile?.birthDate || userProfile?.birth_date || userProfile?.user_metadata?.saju_data?.date || userProfile?.user_metadata?.birth_date;
        const rawTime = reportData?.birthTime || userProfile?.birthTime || userProfile?.birth_time || userProfile?.user_metadata?.saju_data?.time || '12:00';
        const gender = reportData?.gender || userProfile?.gender || userProfile?.user_metadata?.saju_data?.gender || 'male';
        const calendarType = reportData?.meta?.calendarType || userProfile?.calendar_type || userProfile?.user_metadata?.saju_data?.calendar_type || 'solar';

        let calculatedPillars: any = sajuData?.fourPillars || null;
        let calculatedElements = sajuData?.elements || sajuData?.ohaeng || null;
        let calculatedDayMaster = sajuData?.dayMaster || sajuData?.dayMasterChar || null;

        // 2. 생년월일이 있을 경우 SajuEngine으로 실시간 정밀 연산
        if (rawDate) {
            try {
                const sajuResult = calculateSaju(rawDate, rawTime, calendarType, gender);
                if (sajuResult && sajuResult.success) {
                    calculatedPillars = sajuResult.fourPillars;
                    calculatedDayMaster = sajuResult.dayMasterChar;
                    const stats = calculateSajuStats(sajuResult.fourPillars, sajuResult.dayMasterChar);
                    calculatedElements = stats.ohaeng;
                }
            } catch (e) {
                console.error("SajuAnalysisReportModal saju calc error", e);
            }
        }

        const elements = calculatedElements || { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 };
        const dmChar = typeof calculatedDayMaster === 'string' ? calculatedDayMaster.charAt(0) : (calculatedDayMaster as any)?.char || '辛';

        // 3. 4주 팔자 정규화 헬퍼
        const GAN_KOR_MAP: Record<string, string> = { '甲': '갑', '乙': '을', '丙': '병', '丁': '정', '戊': '무', '己': '기', '庚': '경', '辛': '신', '壬': '임', '癸': '계' };
        const JI_KOR_MAP: Record<string, string> = { '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사', '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해' };
        const GAN_ELEMENT_MAP: Record<string, string> = { '甲': '목', '乙': '목', '丙': '화', '丁': '화', '戊': '토', '己': '토', '庚': '금', '辛': '금', '壬': '수', '癸': '수' };
        const JI_ELEMENT_MAP: Record<string, string> = { '子': '수', '丑': '토', '寅': '목', '卯': '목', '辰': '토', '巳': '화', '午': '화', '未': '토', '申': '금', '酉': '금', '戌': '토', '亥': '수' };

        const normPillar = (p: any, fallbackGan: string, fallbackJi: string) => {
            if (!p) {
                return {
                    gan: fallbackGan,
                    ji: fallbackJi,
                    ganKor: GAN_KOR_MAP[fallbackGan] || fallbackGan,
                    jiKor: JI_KOR_MAP[fallbackJi] || fallbackJi,
                    ganElement: GAN_ELEMENT_MAP[fallbackGan] || '금',
                    jiElement: JI_ELEMENT_MAP[fallbackJi] || '화'
                };
            }
            const gan = typeof p.gan === 'object' ? p.gan.char : (p.gan || p.ganKor || fallbackGan);
            const ji = typeof p.ji === 'object' ? p.ji.char : (p.ji || p.jiKor || fallbackJi);
            const ganKor = p.ganKor || GAN_KOR_MAP[gan] || gan;
            const jiKor = p.jiKor || JI_KOR_MAP[ji] || ji;
            const ganElement = p.ganElement || GAN_ELEMENT_MAP[gan] || '금';
            const jiElement = p.jiElement || JI_ELEMENT_MAP[ji] || '화';
            return { gan, ji, ganKor, jiKor, ganElement, jiElement };
        };

        const year = normPillar(calculatedPillars?.year, '庚', '申');
        const month = normPillar(calculatedPillars?.month, '癸', '未');
        const day = normPillar(calculatedPillars?.day, dmChar, '巳');
        const time = normPillar(calculatedPillars?.time, '乙', '未');

        // 사용자 실제 4주 팔자의 8자 성도 요소 직접 집계 (100% 사용자 맞춤 오행 강약)
        const elementCounts: Record<string, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
        const ELEM_ENG_MAP: Record<string, string> = { '목': 'wood', '화': 'fire', '토': 'earth', '금': 'metal', '수': 'water' };
        
        [year.ganElement, year.jiElement, month.ganElement, month.jiElement, day.ganElement, day.jiElement, time.ganElement, time.jiElement].forEach((elem, idx) => {
            const eng = ELEM_ENG_MAP[elem];
            if (eng) {
                // 월지(Index 3)는 계절의 령을 받으므로 2.0 가중치 부여
                elementCounts[eng] += (idx === 3 ? 2 : 1);
            }
        });

        const entries = Object.entries(elementCounts);
        const sorted = entries.sort(([k1, v1], [k2, v2]) => {
            if (v2 !== v1) return v2 - v1;
            const seedOffset = (rawDate ? rawDate.charCodeAt(0) : 65) % 5;
            return (k1.charCodeAt(0) + seedOffset) - (k2.charCodeAt(0) + seedOffset);
        });

        const dominant = sorted[0];
        const weakest = sorted[sorted.length - 1];

        const ELEMENT_KOR: Record<string, string> = {
            wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)'
        };
        const ELEMENT_ICON: Record<string, string> = {
            wood: '🌲', fire: '🔥', earth: '⛰️', metal: '⚔️', water: '🌊'
        };

        const getDayMasterDesc = (char: string) => {
            const item = DAILY_MASTER_EXPLANATIONS[char] || 
                         DAILY_MASTER_EXPLANATIONS[GAN_KOR_MAP[char]] || 
                         DAILY_MASTER_EXPLANATIONS['辛'];
            return item ? item.desc : '당신의 본질은 깊고 고귀한 의식의 빛입니다.';
        };

        const gyeokguk = GYEOKGUK_MAP[dmChar] || GYEOKGUK_MAP['辛'];

        return {
            fourPillars: { year, month, day, time },
            identity: {
                char: dmChar,
                desc: getDayMasterDesc(dmChar),
                gyeokguk
            },
            energy: {
                max: { label: ELEMENT_KOR[dominant[0]] || '금(金)', icon: ELEMENT_ICON[dominant[0]] || '⚔️', val: dominant[1] },
                min: { label: ELEMENT_KOR[weakest[0]] || '수(水)', icon: ELEMENT_ICON[weakest[0]] || '🌊', val: weakest[1] }
            }
        };
    }, [reportData, userProfile]);

    // 실시간 자각 주파수 융합 스캔 시작
    const handleStartScan = () => {
        if (selectedOption === null || !analysis) return;

        setScanState('scanning');

        setTimeout(() => {
            const baseHz = 300;
            // 1. 고유 일간 주파수 (dmChar의 아스키값 기반 변동치)
            const dmChar = analysis.identity.char;
            const identityOffset = (dmChar.charCodeAt(0) % 50); // 0 ~ 49
            
            // 2. 오늘의 일진 우주 기운 변동치
            const today = new Date();
            const dailyOffset = ((today.getDate() * 17) + (today.getMonth() * 11)) % 40; // 0 ~ 39
            
            // 3. 선택지 답변 가중치 (-50 ~ 120)
            const answerOffset = CONDITION_OPTIONS[selectedOption].offset;
            
            // 4. 미세 뇌파 노이즈
            const noise = Math.floor(Math.sin(Date.now()) * 5); // -5 ~ 5

            const finalHz = baseHz + identityOffset + dailyOffset + answerOffset + noise;

            setScannedHz(finalHz);
            setScanState('completed');

            // 하루 1회 완료 상태 보존을 위한 로컬스토리지 저장
            const todayStr = new Date().toISOString().split('T')[0];
            localStorage.setItem('myeongsim_today_scan_date', todayStr);
            localStorage.setItem('myeongsim_today_scan_hz', finalHz.toString());
        }, 1500); // 1.5초 스캔 시뮬레이션
    };

    // 실시간 산출된 Hz 등급 매핑 헬퍼
    const scannedInfo = useMemo(() => {
        if (scanState !== 'completed' || scannedHz === 0) return null;
        return {
            level: scannedHz,
            msg: getLevelMessage(scannedHz),
            key: getLevelKey(scannedHz)
        };
    }, [scanState, scannedHz]);

    // 오늘의 사용자 맞춤 기본 자각 주파수 (Hz)
    const defaultHzInfo = useMemo(() => {
        if (!analysis) return { hz: 432, msg: '432Hz · 코어 동기화 파동' };
        const dmChar = analysis.identity.char;
        const today = new Date();
        const todaySeed = (today.getFullYear() * 1000 + (today.getMonth() + 1) * 50 + today.getDate());
        const baseHz = 400 + (dmChar.charCodeAt(0) % 150) + (todaySeed % 80);
        return {
            hz: baseHz,
            msg: `${baseHz}Hz · ${dmChar}本質 코어 맞춤 주파수`
        };
    }, [analysis]);

    if (!isOpen || !mounted) return null;

    const modalContent = (
        <React.Fragment>
            {/* 뒷배경 블러 */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
            >
                {/* 모달 박스 - 다크 옵시디언 네온 스타일 */}
                <motion.div
                    initial={{ scale: 0.93, y: 15, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.93, y: 15, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md bg-[#090b11]/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col justify-between"
                    style={{
                        boxShadow: '0 0 45px rgba(0,0,0,0.85), inset 0 0 0 1px rgba(255,255,255,0.08)'
                    }}
                >
                    {/* 내장 오로라 네온 배경 */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-[-40%] left-[-40%] w-[180%] h-[180%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_50%)] animate-slow-spin" />
                    </div>

                    {/* 상단 헤더 - 24K 골드 & 옵시디언 럭셔리 Glassmorphism */}
                    <div className="relative z-10 p-5 border-b border-amber-500/20 flex justify-between items-center bg-gradient-to-r from-slate-950 via-purple-950/80 to-slate-950 backdrop-blur-xl select-none shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <span className="text-2xl p-2.5 rounded-2xl bg-gradient-to-br from-amber-500/20 via-purple-500/10 to-indigo-500/20 border border-amber-400/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] block">
                                    🧠
                                </span>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping opacity-75" />
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-purple-200 to-indigo-100 tracking-tight">
                                    인지행동 프로필 리포트
                                </h2>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-400/30">
                                        🏛️ 특허출원중 제10-2025-0166877호
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-all cursor-pointer border border-white/10 p-2 rounded-2xl hover:bg-white/10 active:scale-90">
                            <X size={18} />
                        </button>
                    </div>

                    {/* 메인 콘텐츠 스크롤 영역 */}
                    <div className="relative z-10 p-5 overflow-y-auto space-y-4 flex-1 scrollbar-hide">
                        
                        {/* 🏛️ 대한민국 특허출원중 24K 럭셔리 엠보싱 골드 메달 카드 */}
                        <div className="p-4 bg-gradient-to-r from-amber-950/70 via-slate-950 to-indigo-950/70 border border-amber-400/40 rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.2)] relative overflow-hidden group">
                            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-black text-amber-300 flex items-center gap-2">
                                    <span className="text-sm">🏛️</span>
                                    <span>대한민국 특허출원중 기술 검증</span>
                                </span>
                                <span className="bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/40 font-mono text-[10px] font-bold">
                                    제 10-2025-0166877 호
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-200 font-semibold leading-relaxed">
                                <strong className="text-amber-300">발명 명칭:</strong> 심리 및 생체데이터 기반 스트레스 관리 솔루션 제공장치 및 방법 (3세대 CBT/ACT 뇌신경가소성 교정 알고리즘)
                            </p>
                        </div>

                        {/* 상단 안내 바 */}
                        {analysis ? (
                            <>
                                {/* 🌟 [수술 1] 360° 영혼 마스터 해설 대형 헤더 카드 */}
                                <div className="p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-amber-500/40 rounded-2xl shadow-2xl space-y-3 relative overflow-hidden">
                                    <div className="absolute -top-10 -right-10 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                                    <div className="flex justify-between items-start border-b border-white/10 pb-3">
                                        <div>
                                            <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                                MASTER SOUL PORTRAIT
                                            </span>
                                            <h3 className="text-base sm:text-lg font-black text-white font-serif mt-1.5 leading-snug">
                                                {userProfile?.name || (storeData as any)?.name || '소중한 내담자'}님의 <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">본질 에너지 디코딩</span>
                                            </h3>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center font-serif text-xl font-black text-slate-950 shadow-lg">
                                            {analysis.identity.char}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-200 leading-relaxed font-serif tracking-tight">
                                        {analysis.identity.desc}
                                    </p>
                                </div>
                                {/* 📊 [수술] 사용자 생년월일 + 오늘 날짜 동기화 5대 생체 & 심리 에너지 활성도 게이지 카드 */}
                                <div 
                                    onClick={() => setExpandedSection(expandedSection === 'energy' ? null : 'energy')}
                                    className="p-4 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/80 border border-amber-400/30 rounded-2xl shadow-xl space-y-3 cursor-pointer transition-all hover:border-amber-300 select-none group"
                                >
                                    <div className="flex justify-between items-center border-b border-white/10 pb-2 flex-wrap gap-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-indigo-300">
                                                📊 5대 생체 & 심리 에너지 활성도
                                            </span>
                                            <span className="text-[10px] text-amber-300 font-normal underline group-hover:text-amber-200">
                                                {expandedSection === 'energy' ? '▲ 접기' : '▼ 터치하여 상세 해설'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[9px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                                                📅 매일 자동 갱신
                                            </span>
                                            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                                                종합 {dynamicEnergyScores.total}점 / 100점
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2.5">
                                        {/* 관계 연대 */}
                                        <div>
                                            <div className="flex justify-between text-[11px] font-extrabold mb-1">
                                                <span className="text-pink-300 flex items-center gap-1">💕 관계 연대 (소통)</span>
                                                <span className="font-mono text-pink-400">{dynamicEnergyScores.relation}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                                                <div className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all duration-500" style={{ width: `${dynamicEnergyScores.relation}%` }} />
                                            </div>
                                        </div>
                                        {/* 비전 성취 */}
                                        <div>
                                            <div className="flex justify-between text-[11px] font-extrabold mb-1">
                                                <span className="text-amber-300 flex items-center gap-1">🔥 비전 성취 (목표)</span>
                                                <span className="font-mono text-amber-400">{dynamicEnergyScores.vision}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                                                <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500" style={{ width: `${dynamicEnergyScores.vision}%` }} />
                                            </div>
                                        </div>
                                        {/* 자원 확장 */}
                                        <div>
                                            <div className="flex justify-between text-[11px] font-extrabold mb-1">
                                                <span className="text-yellow-300 flex items-center gap-1">💰 자원 확장 (결실)</span>
                                                <span className="font-mono text-yellow-400">{dynamicEnergyScores.resource}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                                                <div className="h-full bg-gradient-to-r from-yellow-500 to-amber-300 rounded-full transition-all duration-500" style={{ width: `${dynamicEnergyScores.resource}%` }} />
                                            </div>
                                        </div>
                                        {/* 생체 밸런스 */}
                                        <div>
                                            <div className="flex justify-between text-[11px] font-extrabold mb-1">
                                                <span className="text-emerald-300 flex items-center gap-1">🔋 생체 밸런스 (건강)</span>
                                                <span className="font-mono text-emerald-400">{dynamicEnergyScores.bio}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                                                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" style={{ width: `${dynamicEnergyScores.bio}%` }} />
                                            </div>
                                        </div>
                                        {/* 지성 메타인지 */}
                                        <div>
                                            <div className="flex justify-between text-[11px] font-extrabold mb-1">
                                                <span className="text-purple-300 flex items-center gap-1">🧠 지성 메타인지 (학업)</span>
                                                <span className="font-mono text-purple-400">{dynamicEnergyScores.meta}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                                                <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all duration-500" style={{ width: `${dynamicEnergyScores.meta}%` }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 🌌 [수술 2] 동서양 융합 주파수 8차원 원국 메트릭스 카드 (동적 연동) */}
                                    {(() => {
                                        const fp = analysis?.fourPillars || {
                                            time: { gan: '乙', ji: '未', ganKor: '을', jiKor: '미', ganElement: '목', jiElement: '토' },
                                            day: { gan: '辛', ji: '巳', ganKor: '신', jiKor: '사', ganElement: '금', jiElement: '화' },
                                            month: { gan: '癸', ji: '未', ganKor: '계', jiKor: '미', ganElement: '수', jiElement: '토' },
                                            year: { gan: '庚', ji: '申', ganKor: '경', jiKor: '신', ganElement: '금', jiElement: '금' }
                                        };

                                        const getBadgeStyle = (elem?: string) => {
                                            if (elem === '목') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                                            if (elem === '화') return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
                                            if (elem === '토') return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
                                            if (elem === '금') return 'bg-slate-800 text-slate-100 border-slate-600/40';
                                            if (elem === '수') return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
                                            return 'bg-slate-800 text-gray-300 border-white/10';
                                        };

                                        return (
                                            <div className="p-4 bg-slate-900/90 border border-indigo-500/30 rounded-2xl shadow-xl space-y-3">
                                                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                                    <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 flex items-center gap-1.5">
                                                        <span>🌌</span> 동서양 융합 주파수 8차원 메트릭스
                                                    </span>
                                                    <span className="text-[9px] font-mono text-indigo-400">8-DIMENSIONAL MATRIX</span>
                                                </div>
                                                
                                                <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                                                    {/* 의식 차원 (시주) */}
                                                    <div className="p-2 bg-slate-950 rounded-xl border border-white/5">
                                                        <p className="text-[9px] text-gray-400 font-bold mb-1">의식 차원</p>
                                                        <div className={`py-1 rounded font-black border ${getBadgeStyle(fp.time.ganElement)}`}>{fp.time.gan} ({fp.time.ganKor})</div>
                                                        <div className={`py-1 rounded font-black border mt-1 ${getBadgeStyle(fp.time.jiElement)}`}>{fp.time.ji} ({fp.time.jiKor})</div>
                                                    </div>
                                                    {/* 본질 차원 (일주) */}
                                                    <div className="p-2 bg-slate-950 rounded-xl border border-amber-500/30 shadow">
                                                        <p className="text-[9px] text-amber-300 font-black mb-1">본질 차원 ★</p>
                                                        <div className={`py-1 rounded font-black border ${getBadgeStyle(fp.day.ganElement)}`}>{fp.day.gan} ({fp.day.ganKor})</div>
                                                        <div className={`py-1 rounded font-black border mt-1 ${getBadgeStyle(fp.day.jiElement)}`}>{fp.day.ji} ({fp.day.jiKor})</div>
                                                    </div>
                                                    {/* 유대 차원 (월주) */}
                                                    <div className="p-2 bg-slate-950 rounded-xl border border-white/5">
                                                        <p className="text-[9px] text-gray-400 font-bold mb-1">유대 차원</p>
                                                        <div className={`py-1 rounded font-black border ${getBadgeStyle(fp.month.ganElement)}`}>{fp.month.gan} ({fp.month.ganKor})</div>
                                                        <div className={`py-1 rounded font-black border mt-1 ${getBadgeStyle(fp.month.jiElement)}`}>{fp.month.ji} ({fp.month.jiKor})</div>
                                                    </div>
                                                    {/* 환경 차원 (년주) */}
                                                    <div className="p-2 bg-slate-950 rounded-xl border border-white/5">
                                                        <p className="text-[9px] text-gray-400 font-bold mb-1">환경 차원</p>
                                                        <div className={`py-1 rounded font-black border ${getBadgeStyle(fp.year.ganElement)}`}>{fp.year.gan} ({fp.year.ganKor})</div>
                                                        <div className={`py-1 rounded font-black border mt-1 ${getBadgeStyle(fp.year.jiElement)}`}>{fp.year.ji} ({fp.year.jiKor})</div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* 3개 스마트 보정 아이템 지표 (생년월일 + 일진 동적 연산) */}
                                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10">
                                        <div className="bg-slate-950/80 p-2 rounded-xl text-center border border-white/5">
                                            <p className="text-[9px] text-gray-400 font-bold">🎨 수호 컬러</p>
                                            <p className={`text-[11px] font-black ${dynamicGuardianItems.colorClass} mt-0.5`}>
                                                {dynamicGuardianItems.color}
                                            </p>
                                        </div>
                                        <div className="bg-slate-950/80 p-2 rounded-xl text-center border border-white/5">
                                            <p className="text-[9px] text-gray-400 font-bold">🔢 조율 넘버</p>
                                            <p className="text-[11px] font-black text-amber-300 mt-0.5">
                                                {dynamicGuardianItems.number}
                                            </p>
                                        </div>
                                        <div className="bg-slate-950/80 p-2 rounded-xl text-center border border-white/5">
                                            <p className="text-[9px] text-gray-400 font-bold">🎁 생체 아이템</p>
                                            <p className="text-[11px] font-black text-purple-300 mt-0.5">
                                                {dynamicGuardianItems.item}
                                            </p>
                                        </div>
                                    </div>

                                    {/* 📜 [초밀도 아코디언 해설 & 890원 AI 코칭 직통 딥링크] */}
                                    <AnimatePresence>
                                        {expandedSection === 'energy' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="pt-3 border-t border-amber-500/30 space-y-3 overflow-hidden"
                                            >
                                                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 text-left">
                                                    <p className="text-xs font-black text-amber-300 flex items-center gap-1">
                                                        <span>📜</span> 오늘({dynamicEnergyScores.todayStr}) 5대 생체 & 심리 에너지 바이오 해설
                                                    </p>
                                                    <div className="text-[11px] text-gray-200 space-y-1.5 leading-relaxed">
                                                        <p>• <strong className="text-pink-300">💕 관계 연대({dynamicEnergyScores.relation}%):</strong> 타인과의 수용 및 공감 파동이 양호하여 원만한 관계를 유지합니다.</p>
                                                        <p>• <strong className="text-amber-300">🔥 비전 성취({dynamicEnergyScores.vision}%):</strong> 목표 추진력과 의지 도파민 회로가 매우 활발히 다듬어져 있습니다.</p>
                                                        <p>• <strong className="text-yellow-300">💰 자원 확장({dynamicEnergyScores.resource}%):</strong> 실질적 결실과 성과를 창출하는 내적 안정성이 돋보입니다.</p>
                                                        <p>• <strong className="text-emerald-300">🔋 생체 밸런스({dynamicEnergyScores.bio}%):</strong> 에너지 파동 소비가 지속되고 있어 뇌의 피로 관리가 필요합니다.</p>
                                                        <p>• <strong className="text-purple-300">🧠 지성 메타인지({dynamicEnergyScores.meta}%):</strong> 스스로의 감정을 관찰하는 전두엽 모니터링 능력이 탁월합니다.</p>
                                                    </div>
                                                </div>

                                                {/* 🔮 아코디언 내부 1:1 심층 AI 코칭 890원 직통 버튼 */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (onOpenCoaching) {
                                                            onClose();
                                                            onOpenCoaching();
                                                        } else {
                                                            setShowPaymentModal(true);
                                                        }
                                                    }}
                                                    className="w-full py-3 bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                                                >
                                                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                                                    <span>🔮 내 5대 에너지 파동으로 1:1 심층 AI 코칭 받기 (🔒 890원) ➔</span>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Section 1: 나의 에너지 프로필 (본질 일간) */}
                                <div 
                                    onClick={() => toggleSection('identity')}
                                    className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${expandedSection === 'identity' ? 'bg-zinc-900/60 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.05)]' : 'bg-white/[0.02] border-white/5 hover:border-zinc-800 hover:bg-white/[0.04]'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div 
                                                onClick={(e) => handleTermClick(e, 'gan_' + analysis.identity.char)}
                                                className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-700/20 to-amber-900/20 border border-amber-500/30 flex items-center justify-center text-lg font-bold relative shrink-0 hover:border-amber-400 hover:scale-105 transition-all cursor-help"
                                            >
                                                <span className="relative z-10 text-amber-300">{analysis.identity.char}</span>
                                                <div className="absolute inset-0 bg-amber-500/10 blur-sm rounded-full" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">나의 에너지 프로필</p>
                                                <p className="text-sm font-bold text-zinc-200">
                                                    본질: <span 
                                                        onClick={(e) => handleTermClick(e, 'gan_' + analysis.identity.char)}
                                                        className="text-amber-400 border-b border-dashed border-amber-500/60 cursor-help hover:text-amber-300 transition-colors"
                                                    >&apos;{analysis.identity.desc}&apos;</span>
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronIcon isOpen={expandedSection === 'identity'} color="text-amber-400" />
                                    </div>

                                    {/* 아코디언 해설창 */}
                                    <AnimatePresence initial={false}>
                                        {expandedSection === 'identity' && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className="overflow-hidden border-t border-zinc-900 pt-3 text-xs leading-relaxed text-zinc-300 space-y-1.5"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="font-semibold text-amber-400 font-mono text-[9px] uppercase">
                                                    // {DAILY_MASTER_EXPLANATIONS[analysis.identity.char]?.title || 'MYONGSIM_OS_DNA'}
                                                </div>
                                                <p className="whitespace-pre-line text-zinc-300 tracking-tight">
                                                    {DAILY_MASTER_EXPLANATIONS[analysis.identity.char]?.desc || '당신의 본질 코드를 해독 중입니다.'}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Section 2: 에너지 균형 (오행 강약) */}
                                <div 
                                    onClick={() => toggleSection('energy')}
                                    className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${expandedSection === 'energy' ? 'bg-zinc-900/60 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.05)]' : 'bg-white/[0.02] border-white/5 hover:border-zinc-800 hover:bg-white/[0.04]'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-700/20 to-purple-900/20 border border-purple-500/30 flex items-center justify-center text-sm shrink-0">
                                                <Activity size={16} className="text-purple-300 animate-pulse" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">에너지 균형 스캔</p>
                                                <div className="flex gap-2 text-xs font-semibold text-zinc-300 mt-0.5">
                                                    <span>강: <span 
                                                        onClick={(e) => handleTermClick(e, 'elem_' + analysis.energy.max.label)}
                                                        className="text-amber-200 border-b border-dashed border-amber-400/60 cursor-help hover:text-amber-100 transition-colors"
                                                    >{analysis.energy.max.icon}{analysis.energy.max.label}</span></span>
                                                    <span className="text-zinc-700">|</span>
                                                    <span>약: <span 
                                                        onClick={(e) => handleTermClick(e, 'elem_' + analysis.energy.min.label)}
                                                        className="text-blue-300 border-b border-dashed border-blue-400/60 cursor-help hover:text-blue-200 transition-colors"
                                                    >{analysis.energy.min.icon}{analysis.energy.min.label}</span></span>
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronIcon isOpen={expandedSection === 'energy'} color="text-purple-400" />
                                    </div>

                                    {/* 아코디언 해설창 */}
                                    <AnimatePresence initial={false}>
                                        {expandedSection === 'energy' && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className="overflow-hidden border-t border-zinc-900 pt-3 text-xs leading-relaxed text-zinc-300 space-y-3"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="space-y-1.5">
                                                    <div className="font-semibold text-amber-300 font-mono text-[9px] uppercase">
                                                        [+] 가장 강한 에너지: {analysis.energy.max.label} 과부하 진단
                                                    </div>
                                                    <p className="text-zinc-300 tracking-tight">
                                                        {ELEMENT_EXPLANATIONS[analysis.energy.max.label]?.max || '오행 정보를 빌드 중입니다.'}
                                                    </p>
                                                </div>
                                                <div className="space-y-1.5 pt-1">
                                                    <div className="font-semibold text-blue-400 font-mono text-[9px] uppercase">
                                                        [-] 가장 약한 에너지: {analysis.energy.min.label} 결핍 디버깅
                                                    </div>
                                                    <p className="text-zinc-300 tracking-tight">
                                                        {ELEMENT_EXPLANATIONS[analysis.energy.min.label]?.min || '오행 정보를 빌드 중입니다.'}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Section 3: 나의 현재 상태 (자가진단 융합 자각 주파수 스캐너) */}
                                <div 
                                    onClick={() => toggleSection('state')}
                                    className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${expandedSection === 'state' ? 'bg-zinc-900/60 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.05)]' : 'bg-white/[0.02] border-white/5 hover:border-zinc-800 hover:bg-white/[0.04]'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-700/20 to-emerald-900/20 border border-emerald-500/30 flex items-center justify-center text-sm shrink-0">
                                                <TrendingUp size={16} className="text-emerald-300" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-emerald-400 uppercase font-mono tracking-wider animate-pulse">자각 주파수 (Hz 스캐너)</p>
                                                
                                                {scanState === 'completed' && scannedInfo ? (
                                                    <div className="flex items-baseline gap-1.5 mt-0.5">
                                                        <span className="text-base font-serif font-bold text-white">{scannedInfo.level}Hz</span>
                                                        <span className="text-[9.5px] text-emerald-400 font-semibold">{scannedInfo.msg}</span>
                                                    </div>
                                                ) : scanState === 'scanning' ? (
                                                    <div className="text-xs font-semibold text-emerald-400 mt-0.5 animate-pulse">
                                                        ⚡ 정밀 SCANNING...
                                                    </div>
                                                ) : (
                                                    <div className="flex items-baseline gap-1.5 mt-0.5">
                                                        <span className="text-sm font-serif font-bold text-emerald-300">{defaultHzInfo.hz}Hz</span>
                                                        <span className="text-[9.5px] text-emerald-400/90 font-semibold">{defaultHzInfo.msg}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronIcon isOpen={expandedSection === 'state'} color="text-emerald-400" />
                                    </div>

                                    {/* 아코디언 해설창 */}
                                    <AnimatePresence initial={false}>
                                        {expandedSection === 'state' && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className="overflow-hidden border-t border-zinc-900 pt-3 text-xs leading-relaxed text-zinc-300 space-y-3"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {/* 상태 1: 스캔 전 (선택지 입력 화면) */}
                                                {scanState === 'pending' && (
                                                    <div className="space-y-3">
                                                        <p className="text-[11px] font-semibold text-zinc-400">// 지금 이 순간, 내 의식 스크린의 상태는 어떤가요?</p>
                                                        <div className="space-y-2">
                                                            {CONDITION_OPTIONS.map((opt, index) => (
                                                                <button
                                                                    key={index}
                                                                    onClick={() => setSelectedOption(index)}
                                                                    className={`w-full text-left px-3 py-2 rounded-lg border text-[11px] transition-all cursor-pointer flex items-center gap-2 ${selectedOption === index ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-400 font-medium' : 'bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:border-zinc-800'}`}
                                                                >
                                                                    <div className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${selectedOption === index ? 'border-emerald-400 bg-emerald-400' : 'border-zinc-800'}`}>
                                                                        {selectedOption === index && <div className="w-1.5 h-1.5 bg-zinc-950 rounded-full" />}
                                                                    </div>
                                                                    <span>{opt.label}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                        
                                                        <button
                                                            onClick={handleStartScan}
                                                            disabled={selectedOption === null}
                                                            className="w-full py-3 mt-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-zinc-900 disabled:to-zinc-900 disabled:text-zinc-600 text-white font-bold rounded-xl text-xs transition-all active:scale-[0.98] cursor-pointer shadow-[0_2px_10px_rgba(16,185,129,0.15)]"
                                                        >
                                                            내 의식 주파수 SCAN 시작
                                                        </button>
                                                    </div>
                                                )}

                                                {/* 상태 2: 스캐닝 로딩 화면 */}
                                                {scanState === 'scanning' && (
                                                    <div className="py-8 flex flex-col items-center justify-center gap-3 text-center">
                                                        <div className="relative">
                                                            <Loader2 size={32} className="text-emerald-400 animate-spin" />
                                                            <div className="absolute inset-0 bg-emerald-500/20 blur-md rounded-full animate-pulse" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-mono text-emerald-400 animate-pulse tracking-widest">// ALIGNING_OS_CHANNELS...</p>
                                                            <p className="text-[9px] text-zinc-500 font-mono mt-0.5">고유 일간 주파수 + 일진 융합 동기화 중</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* 상태 3: 스캔 완료 (Hz 출력 및 감동 해설 노출) */}
                                                {scanState === 'completed' && scannedInfo && (
                                                    <div className="space-y-2 animate-fadeIn">
                                                        <div className="font-semibold text-emerald-400 font-mono text-[9px] uppercase flex justify-between items-center">
                                                            <span>// {LEVEL_EXPLANATIONS[scannedInfo.key]?.title || 'AWARENESS_FREQUENCY_STATUS'}</span>
                                                            <span className="text-[8px] text-zinc-600">Hz_{scannedHz}</span>
                                                        </div>
                                                        <p className="whitespace-pre-line text-zinc-300 tracking-tight">
                                                            {LEVEL_EXPLANATIONS[scannedInfo.key]?.desc || '자각 지수 판정 정보를 로딩하고 있습니다.'}
                                                        </p>
                                                        
                                                        {/* 재진단 기회 안내 (사용자에게 친절하게) */}
                                                        <div className="pt-2 text-[9px] text-zinc-600 font-mono flex items-center gap-1 select-none">
                                                            <span>※ 측정된 주파수는 당일 자각 로그로 고정 기록되어 보존됩니다.</span>
                                                        </div>
                                                    </div>
                                                )}

                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                 {/* 🔮 [신규] 8자 십신 격국 & 2026년 우주 기류 해설 카드 */}
                                 <div className="p-4 bg-slate-900/90 border border-purple-500/30 rounded-2xl shadow-xl space-y-3">
                                     <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                         <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-amber-300 flex items-center gap-1.5">
                                             <span>🔮</span> 십신 격국 & 2026 우주 기류 분석
                                         </span>
                                         <span className="text-[9px] font-mono text-purple-400">COSMIC FLOW</span>
                                     </div>
                                     <div className="space-y-2 text-xs text-slate-200">
                                         <div className="p-3 bg-slate-950/80 rounded-xl border border-white/5 space-y-1">
                                             <p className="text-[10px] font-black text-amber-300 font-mono">🏆 {analysis.identity.gyeokguk.title}</p>
                                             <p className="text-slate-300 leading-relaxed text-xs">{analysis.identity.gyeokguk.desc}</p>
                                             <p className="text-amber-200/90 text-[11px] pt-1 border-t border-white/5 mt-1 font-medium">💡 솔루션: {analysis.identity.gyeokguk.solution}</p>
                                         </div>
                                         <div className="p-3 bg-purple-950/30 rounded-xl border border-purple-500/20 space-y-1">
                                             <p className="text-[10px] font-black text-purple-300 font-mono">🐎 2026년 丙午년 화(火) 주파수 기류</p>
                                             <p className="text-slate-300 leading-relaxed text-[11px]">
                                                 2026년은 강렬한 화(火) 에너지가 세상을 주도하는 대전환의 해입니다. {analysis.identity.char} 일간의 본질을 가진 당신에게 이 기류는 묵은 무의식의 껍질을 깨고 당신의 진가를 세상 밖으로 드러내는 강력한 촉매제입니다.
                                             </p>
                                         </div>
                                     </div>
                                 </div>

                                 {/* 🌸 [신규] 평생 소장용 나만의 영혼 주파수 확언문 카드 */}
                                 <div className="p-5 bg-gradient-to-r from-slate-950 via-amber-950/40 to-slate-950 border border-amber-500/40 rounded-2xl shadow-2xl text-center space-y-2 relative overflow-hidden">
                                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05)_0%,transparent_70%)]" />
                                     <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-0.5 rounded-full inline-block">
                                         SOUL FREQUENCY MANTRA
                                     </span>
                                     <h4 className="text-sm font-black text-amber-200 font-serif pt-1">
                                         &quot;나는 온전히 깨어있는 빛이며, 세상의 모진 풍파 속에서도 결코 흔들리지 않는 자유 그 자체이다.&quot;
                                     </h4>
                                     <p className="text-[10px] text-slate-400 font-medium">
                                         매일 아침 눈을 뜨고 이 확언을 가만히 낭송하면 뇌의 불안 파동(DMN)이 즉시 이완됩니다.
                                     </p>
                                 </div>
                            </>
                        ) : (
                            <EmptyState />
                        )}

                    </div>

                    {/* 하단 푸터 및 890원 AI 코치 심층 상담 딥링크 */}
                    <div className="relative z-10 p-4 border-t border-white/10 bg-slate-950 text-center select-none space-y-3">
                        <button 
                            onClick={() => {
                                if (onOpenCoaching) {
                                    onClose();
                                    onOpenCoaching();
                                } else {
                                    setShowPaymentModal(true);
                                }
                            }}
                            className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                        >
                            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                            <span>🔮 1:1 다각도 심층 명심 AI 코칭 받기 (🔒 890원) ➔</span>
                        </button>
                        <p className="text-[9.5px] text-gray-500 font-medium">
                            * 본 리포트는 3세대 CBT 인지재구성 특허출원중(제10-2025-0166877호) 알고리즘으로 작성되었습니다.
                        </p>
                    </div>

                </motion.div>
            </motion.div>

            {/* 💳 890원 1:1 심층 AI 코칭 결제 및 상담 딥링크 모달 */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
                    <div className="relative w-full max-w-md bg-slate-950 border border-amber-500/40 rounded-3xl p-4 shadow-2xl space-y-3 text-left">
                        <div className="flex justify-between items-center pb-2 border-b border-white/10">
                            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
                                <Sparkles className="w-4 h-4 text-amber-400" />
                                <span>📜 [특허출원중 82% OFF] 시중가 <span className="line-through text-gray-400">5,000원</span> ➔ 890원</span>
                            </div>
                            <button 
                                onClick={() => setShowPaymentModal(false)}
                                className="text-gray-400 hover:text-white p-1 cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <PaymentCard
                            onDetailedReport={() => {
                                setShowPaymentModal(false);
                                onClose();
                                if (typeof window !== 'undefined') {
                                    window.location.href = '/myeongsim-chat';
                                }
                            }}
                        />
                    </div>
                </div>
            )}

            {/* 명리학 용어 상세 설명 모달 */}
            <MyeongliTermModal
                isOpen={!!selectedTerm}
                onClose={() => setSelectedTerm(null)}
                term={selectedTerm}
            />
        </React.Fragment>
    );

    return createPortal(modalContent, document.body);
}

// 회전 Chevron 아이콘 서브 컴포넌트
function ChevronIcon({ isOpen, color = 'text-gray-400' }: { isOpen: boolean; color?: string }) {
    return (
        <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className={`${color} p-1 rounded-lg border border-zinc-900 bg-white/[0.01]`}
        >
            <ChevronDown size={14} />
        </motion.div>
    );
}

function EmptyState() {
    return (
        <div className="p-6 rounded-xl bg-white/[0.01] border border-white/5 text-center">
            <AlertCircle className="w-6 h-6 text-zinc-700 mx-auto mb-2" />
            <p className="text-xs text-zinc-500">데이터가 존재하지 않습니다.<br />대화를 통해 진단을 진행해 주세요.</p>
        </div>
    );
}

// 헬퍼 매핑 함수
function getDayMasterDesc(char: string) {
    const map: Record<string, string> = {
        '甲': '곧게 뻗는 큰 나무', '을': '유연한 덩굴 식물',
        '丙': '세상을 비추는 태양', '정': '어둠을 밝히는 촛불',
        '戊': '믿음직한 큰 산', '기': '만물을 기르는 밭',
        '庚': '강인한 바위/원석', '신': '섬세한 보석/칼',
        '壬': '깊고 넓은 바다', '계': '스며드는 봄비'
    };
    return map[char] || '미지의 탐험가';
}

function getLevelMessage(level: number) {
    if (level >= 500) return '순수 자각';
    if (level >= 400) return '자각/통찰';
    if (level >= 300) return '수용/조화';
    if (level >= 200) return '마주함/용기';
    return '자각 스캔 대기';
}

function getLevelKey(level: number) {
    if (level >= 500) return 'shift';
    if (level >= 400) return 'insight';
    if (level >= 300) return 'sync';
    if (level >= 200) return 'scan';
    return 'wait';
}
