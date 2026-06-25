import React, { useMemo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, TrendingUp, AlertCircle, ChevronDown, Sparkles, Loader2 } from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';
import { calculateSaju, calculateSajuStats } from '@/lib/saju/SajuEngine';
import MyeongliTermModal from './MyeongliTermModal';

interface SajuAnalysisReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile?: any | null;
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

export default function SajuAnalysisReportModal({ isOpen, onClose, userProfile }: SajuAnalysisReportModalProps) {
    const { reportData: storeData } = useReportStore();
    const reportData = storeData || userProfile;

    const [mounted, setMounted] = useState(false);
    
    // 클릭하여 아코디언 상세 설명이 열려 있는 섹션 상태 ('identity' | 'energy' | 'state' | null)
    const [expandedSection, setExpandedSection] = useState<'identity' | 'energy' | 'state' | null>(null);

    // 명리학 용어 팝업 모달 상태
    const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

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

    const analysis = useMemo(() => {
        let sajuData = reportData?.saju || reportData?.sajuData || reportData?.saju_data;
        
        if (!sajuData && userProfile) {
            const rawDate = userProfile.birthDate || userProfile.birth_date;
            const rawTime = userProfile.birthTime || userProfile.birth_time || '12:00';
            if (rawDate) {
                try {
                    const sajuResult = calculateSaju(rawDate, rawTime, 'solar', userProfile.gender || 'male');
                    if (sajuResult.success) {
                        const stats = calculateSajuStats(sajuResult.fourPillars, sajuResult.dayMasterChar);
                        sajuData = {
                            dayMaster: sajuResult.dayMasterChar,
                            elements: stats.ohaeng
                        };
                    }
                } catch (e) {
                    console.error("SajuAnalysisReportModal fallback error", e);
                }
            }
        }

        if (!sajuData) return null;

        const { dayMaster, elements } = sajuData;
        const dmChar = typeof dayMaster === 'string' ? dayMaster.charAt(0) : (dayMaster as any)?.char || '?';

        const entries = Object.entries(elements || {});
        const sorted = entries.sort(([, a], [, b]) => (b as number) - (a as number));

        // [Bug Fix] 가드가 없어서 elements가 비어있을 때 dominant와 weakest가 undefined가 되어 dominant[0] 에러가 발생하는 것 차단
        const dominant = sorted.length > 0 ? sorted[0] : ['metal', 20];
        const weakest = sorted.length > 0 ? sorted[sorted.length - 1] : ['water', 10];

        const ELEMENT_KOR: Record<string, string> = {
            wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)'
        };
        const ELEMENT_ICON: Record<string, string> = {
            wood: '🌲', fire: '🔥', earth: '⛰️', metal: '⚔️', water: '🌊'
        };

        return {
            identity: {
                char: dmChar,
                desc: getDayMasterDesc(dmChar)
            },
            energy: {
                max: { label: ELEMENT_KOR[dominant[0]] || '금(金)', icon: ELEMENT_ICON[dominant[0]] || '⚔️', val: dominant[1] },
                min: { label: ELEMENT_KOR[weakest[0]] || '수(水)', icon: ELEMENT_ICON[weakest[0]] || '🌊', val: weakest[1] }
            }
        };
    }, [reportData]);

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

                    {/* 상단 헤더 */}
                    <div className="relative z-10 p-5 border-b border-zinc-900 flex justify-between items-center bg-white/[0.02] select-none">
                        <div>
                            <h2 className="text-lg font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F4E2D8] via-[#BA9F8F] to-[#F4E2D8]"
                                style={{ textShadow: '0 2px 10px rgba(186,159,143,0.2)' }}
                            >
                                인지행동 프로필 리포트
                            </h2>
                            <p className="text-[9px] text-zinc-500 tracking-widest uppercase mt-0.5 font-mono">Core Dynamics Analysis</p>
                        </div>
                        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors cursor-pointer border border-zinc-800 p-1 rounded-lg hover:bg-zinc-900">
                            <X size={18} />
                        </button>
                    </div>

                    {/* 메인 콘텐츠 스크롤 영역 */}
                    <div className="relative z-10 p-5 overflow-y-auto space-y-4 flex-1 scrollbar-hide">
                        
                        {/* 상단 안내 바 */}
                        <div className="flex items-center gap-2 px-3.5 py-2.5 bg-blue-950/20 border border-blue-900/20 rounded-xl text-[10px] text-blue-400 select-none animate-pulse">
                            <Sparkles size={12} className="text-yellow-400 shrink-0" />
                            <span>카드를 클릭하면 <b>초밀도 감동 해설 아코디언</b>이 펼쳐집니다.</span>
                        </div>

                        {analysis ? (
                            <>
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
                                                ) : (
                                                    <div className="text-xs font-semibold text-zinc-400 mt-0.5">
                                                        {scanState === 'scanning' ? '정밀 SCANNING...' : '오늘의 상태 스캔 대기 중'}
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
                            </>
                        ) : (
                            <EmptyState />
                        )}

                    </div>

                    {/* 하단 푸터 */}
                    <div className="relative z-10 p-4 border-t border-zinc-900 bg-[#06080d] text-center select-none">
                        <p className="text-[9px] text-zinc-600">
                            * 이 리포트는 &apos;명심코칭 워크북&apos; 작성을 위해 제공됩니다.
                        </p>
                    </div>

                </motion.div>
            </motion.div>

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
