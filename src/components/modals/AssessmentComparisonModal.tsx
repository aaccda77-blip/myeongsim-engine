'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Scale,
    Search,
    Layers,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    X,
    Brain,
    Shield,
    Flame,
    Zap,
    Table,
    LayoutGrid,
    ExternalLink,
    HelpCircle,
    Info,
    Send,
    Activity,
    Target
} from 'lucide-react';

export interface AssessmentItem {
    id: string;
    name: string;
    category: 'cognitive' | 'behavior' | 'strength' | 'clinical' | 'symbolic';
    categoryLabel: string;
    whatItMeasures: string;
    typicalResult: string;
    commonWithMyeongsim: string;
    coreDifference: string;
    badgeColor: string;
    icon: string;
    highlight?: boolean;
}

export const ASSESSMENT_DATA: AssessmentItem[] = [
    {
        id: 'mbti',
        name: 'MBTI (마이어스-브릭스)',
        category: 'cognitive',
        categoryLabel: '인지·성향',
        whatItMeasures: '인식·판단의 선호 (외향/내향, 감각/직관, 사고/감정, 판단/인식)',
        typicalResult: '16가지 성격 유형 (INTJ, ENFP 등)',
        commonWithMyeongsim: '타고난/익숙한 인지 스타일과 정보 처리 방식 이해',
        coreDifference: '유형을 고정된 정체성으로 삼기보다 “이 선호가 언제 Dark Code(생존 방어기제/인지 오류)로 자동화되는가?”를 실시간 추적하고 탈융합함',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        icon: '🧩',
        highlight: true
    },
    {
        id: 'big_five',
        name: 'Big Five / NEO-PI-R',
        category: 'cognitive',
        categoryLabel: '인지·성향',
        whatItMeasures: '성격특질의 정도 (5대 요인)',
        typicalResult: '외향성·성실성·개방성·친화성·정서성(신경성) 연속 점수',
        commonWithMyeongsim: '사람을 단일 유형이 아닌 다차원적 스펙트럼으로 조망',
        coreDifference: '측정·설명 중심. 명심은 특질 수치 확인 이후의 [자각(Awareness) ➔ 수용 ➔ 의도적 선택(Shift)]까지 훈련함',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        icon: '📊'
    },
    {
        id: 'hexaco',
        name: 'HEXACO 모델',
        category: 'cognitive',
        categoryLabel: '인지·성향',
        whatItMeasures: '6대 성격 특질 (정직-겸손성 추가)',
        typicalResult: '정직-겸손, 정서성, 외향성, 원만성, 성실성, 개방성',
        commonWithMyeongsim: '도덕성 및 내면의 미세 특질 강약 파악',
        coreDifference: '특질의 높고 낮음을 좋고 나쁨으로 판단하지 않고, 상황에 따른 에너지 사용 방향(OS 운영)을 코칭함',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        icon: '💎'
    },
    {
        id: 'disc',
        name: 'DISC 행동유형검사',
        category: 'behavior',
        categoryLabel: '행동·비즈니스',
        whatItMeasures: '행동·소통 스타일',
        typicalResult: 'D(주도), I(사교), S(안정), C(신중)',
        commonWithMyeongsim: '관계·조직 현장에서의 즉각적 행동 패턴 파악',
        coreDifference: '상황별 행동스타일이 중심. 명심은 그 행동 이전의 무의식 감정·해석·생존패턴(Story)까지 깊이 들어감',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        icon: '🎯'
    },
    {
        id: 'enneagram',
        name: '에니어그램 (Enneagram)',
        category: 'cognitive',
        categoryLabel: '인지·성향',
        whatItMeasures: '핵심 욕구, 근원적 두려움, 방어기제',
        typicalResult: '9가지 성격 유형 및 날개/통합·분열 방향',
        commonWithMyeongsim: '자동화된 에고 패턴, 심층 두려움, 성장 방향을 다룸',
        coreDifference: '명심과 상당히 가까우나, 명심은 3S(Scan-Sync-Shift)와 실제 행동 전환·Zero Point(본래의 완전함)까지 명시적으로 설계함',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        icon: '🔯',
        highlight: true
    },
    {
        id: 'tci',
        name: 'TCI (기질 및 성격검사)',
        category: 'cognitive',
        categoryLabel: '인지·성향',
        whatItMeasures: '생물학적 기질과 후천적 성격',
        typicalResult: '4기질(자극추구 등) + 3성격(자율성 등)',
        commonWithMyeongsim: '타고난 기질과 후천적 성격을 정밀하게 구분',
        coreDifference: '명심의 Hardware(기질)와 유사하나, 명심은 Dark ➔ Neural ➔ Meta라는 3단계 운영 OS 단계를 둠',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        icon: '🧬'
    },
    {
        id: '16pf',
        name: '16PF (Cattell 성격요인)',
        category: 'cognitive',
        categoryLabel: '인지·성향',
        whatItMeasures: '16개 근원 성격 요인',
        typicalResult: '연속적 프로파일 차트',
        commonWithMyeongsim: '다양한 성격 요소를 세밀하게 다룸',
        coreDifference: '측정이 목적. 명심은 측정값 자체보다 일상에서 반복되는 패턴과 개입 지점(Intervention Point)을 중요시함',
        badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
        icon: '📈'
    },
    {
        id: 'epq',
        name: 'EPQ / Eysenck 성격검사',
        category: 'cognitive',
        categoryLabel: '인지·성향',
        whatItMeasures: '외향성·신경성·정신증 등',
        typicalResult: '생물학적 주요 기질 차원',
        commonWithMyeongsim: '신경계의 생물학적 성향 인정',
        coreDifference: '명심은 기질을 바꿀 수 없는 운명으로 고정하지 않고, 자유의지 기반의 3-Day 마이크로 퀘스트 행동으로 연결함',
        badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
        icon: '🔬'
    },
    {
        id: 'hogan_hpi',
        name: 'Hogan HPI (평상시 성격)',
        category: 'behavior',
        categoryLabel: '행동·비즈니스',
        whatItMeasures: '직장에서의 평상시 성격 및 대인 스타일',
        typicalResult: '업무 성향 및 리더십 예측',
        commonWithMyeongsim: '비즈니스와 업무 행동 예측',
        coreDifference: '명심은 업무뿐 아니라 개인의 내면 감정·관계·영혼의 영웅 서사까지 확장함',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        icon: '💼'
    },
    {
        id: 'hogan_hds',
        name: 'Hogan HDS (탈선 위험 요인)',
        category: 'behavior',
        categoryLabel: '행동·비즈니스',
        whatItMeasures: '스트레스 및 위기 시 폭발하는 탈선 위험',
        typicalResult: 'Derailers (11개 탈선 척도)',
        commonWithMyeongsim: '★ 명심의 Dark Code(버그)와 매우 완벽하게 비교되는 세계적 모델',
        coreDifference: 'HDS는 위험 성향을 측정·경고하는 데 그치나, 명심은 그것을 생존 장르(Dark Code)로 온전히 수용하고 메타 코드로 전환함',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        icon: '⚠️',
        highlight: true
    },
    {
        id: 'hogan_mvpi',
        name: 'Hogan MVPI (동기·가치)',
        category: 'strength',
        categoryLabel: '강점·동기',
        whatItMeasures: '핵심 가치, 내적 동기, 선호 환경',
        typicalResult: '10대 가치 프로파일',
        commonWithMyeongsim: '인간의 Values와 실제 행동을 연결',
        coreDifference: '명심은 가치 측정뿐 아니라, 에고의 자동반응에서 진정한 가치선택으로 이동하는 과정 자체를 코칭함',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        icon: '🧭'
    },
    {
        id: 'clifton_strengths',
        name: 'CliftonStrengths (갤럽 강점)',
        category: 'strength',
        categoryLabel: '강점·동기',
        whatItMeasures: '반복적으로 나타나는 고유한 재능',
        typicalResult: '34대 강점 테마',
        commonWithMyeongsim: '★ “약점 교정보다 고유성 활용” 철학이 명심과 매우 유사',
        coreDifference: '명심은 강점 발휘뿐 아니라, 강점이 지나치게 과출력되어 주변을 태우는 [과출력 상태]도 Dark Code로 함께 다룸',
        badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        icon: '🏆',
        highlight: true
    },
    {
        id: 'via_strengths',
        name: 'VIA Character Strengths',
        category: 'strength',
        categoryLabel: '강점·동기',
        whatItMeasures: '성격적 강점 및 인류 보편적 미덕',
        typicalResult: '24대 성품 강점',
        commonWithMyeongsim: '긍정심리학 기반 강점 중심 성장',
        coreDifference: '명심은 강점이 상황에 따라 과출력·왜곡될 수 있다는 역동적 전환 구조(Dark ➔ Neural ➔ Meta)가 훨씬 강력함',
        badgeColor: 'bg-green-500/20 text-green-300 border-green-500/30',
        icon: '🌱'
    },
    {
        id: 'riasec',
        name: 'RIASEC / Holland 흥미검사',
        category: 'strength',
        categoryLabel: '강점·동기',
        whatItMeasures: '직업 흥미와 적성 환경',
        typicalResult: 'R/I/A/S/E/C 6대 흥미 코드',
        commonWithMyeongsim: '자기이해를 통한 진로 선택과 적합 직무 탐색',
        coreDifference: '성격 전체가 아니라 직업흥미에 국한됨. 명심은 삶 전체 패턴과 국세청 실전 창업·N잡 모델까지 융합함',
        badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
        icon: '🛠️'
    },
    {
        id: 'firo_b',
        name: 'FIRO-B (대인관계 욕구)',
        category: 'strength',
        categoryLabel: '강점·동기',
        whatItMeasures: '대인관계 욕구 (포함, 통제, 애정)',
        typicalResult: '표출 욕구 vs 기대 욕구 점수',
        commonWithMyeongsim: '관계에서 반복되는 갈등 패턴 파악',
        coreDifference: '명심은 욕구 수치 뒤에 숨은 무의식적 두려움, 왜곡된 내면 Story, Dark Code까지 깊이 탐색해 해체함',
        badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
        icon: '🤝'
    },
    {
        id: 'ecr_attachment',
        name: '성인 애착검사 (ECR 등)',
        category: 'strength',
        categoryLabel: '강점·동기',
        whatItMeasures: '친밀관계에서의 애착불안 및 애착회피',
        typicalResult: '안정형, 불안형, 회피형, 혼란형',
        commonWithMyeongsim: '반복되는 연인·인간관계 상처 패턴 분석과 연결',
        coreDifference: '명심은 애착유형을 정체성으로 고정하지 않고, 갈등이 터지는 순간 실제 3S(Scan-Sync-Shift)를 통해 반응을 선택하게 함',
        badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
        icon: '❤️'
    },
    {
        id: 'pcm_motivation',
        name: '애니어그램/PCM 동기 모델',
        category: 'behavior',
        categoryLabel: '행동·비즈니스',
        whatItMeasures: '욕구·스트레스·소통 패턴',
        typicalResult: '유형별 동기와 스트레스 반응 단계',
        commonWithMyeongsim: '스트레스 시 나타나는 내면 패턴을 본다는 점에서 유사',
        coreDifference: '명심은 ‘유형 설명’에 머무르지 않고 패턴과 자아 사이의 거리(인지적 탈융합)를 핵심으로 둠',
        badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
        icon: '📡'
    },
    {
        id: 'social_styles',
        name: 'Social Styles (소셜 스타일)',
        category: 'behavior',
        categoryLabel: '행동·비즈니스',
        whatItMeasures: '외적 대인 행동 패턴',
        typicalResult: 'Analytical / Driver / Amiable / Expressive',
        commonWithMyeongsim: '타인의 소통법 이해 및 관계 조율',
        coreDifference: '관찰 가능한 행동 중심. 내적 자동반응, 신체 감각, 주파수 레벨의 동일시는 상대적으로 덜 다룸',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        icon: '👥'
    },
    {
        id: 'belbin',
        name: 'Belbin Team Roles (벨빈 역할)',
        category: 'behavior',
        categoryLabel: '행동·비즈니스',
        whatItMeasures: '팀 안에서의 기능적 역할',
        typicalResult: '9가지 팀 역할 프로파일',
        commonWithMyeongsim: '조직 내 역할과 상호보완적 강점 이해',
        coreDifference: '개인의 성격검사라기보다 팀 역할에 집중. 명심은 역할 자체와 자신을 동일시하여 생기는 가면 우울증까지 치유함',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        icon: '🧩'
    },
    {
        id: 'sdi',
        name: 'SDI (갈등 대처 스타일)',
        category: 'behavior',
        categoryLabel: '행동·비즈니스',
        whatItMeasures: '동기와 갈등 상황에서의 대처 방식',
        typicalResult: '동기 가치체계(MVS)와 갈등 3단계 프로파일',
        commonWithMyeongsim: '갈등 전후의 심리 변화를 추적',
        coreDifference: '명심은 갈등 순간의 몸(신체반응)·생각·감정 ➔ 행동까지 실시간 4초 호흡과 3S로 코칭함',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        icon: '⚖️'
    },
    {
        id: 'mmpi',
        name: 'MMPI-2 / MMPI-3 (다면적 인성)',
        category: 'clinical',
        categoryLabel: '임상·심리평가',
        whatItMeasures: '임상적 성격·정신병리 특성',
        typicalResult: '10대 임상 척도 (우울증, 편집증 등)',
        commonWithMyeongsim: '무의식 심리 패턴을 체계적으로 조망',
        coreDifference: '★ 완전히 다른 목적. MMPI는 전문 심리평가·의료 진단 도구이며, 명심은 치료가 아닌 잠재력 각성과 영웅의 여정을 위한 코칭임',
        badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
        icon: '🩺'
    },
    {
        id: 'pai',
        name: 'PAI (성격평가질문지)',
        category: 'clinical',
        categoryLabel: '임상·심리평가',
        whatItMeasures: '임상증상·성격·치료 관련 정보',
        typicalResult: '임상 증후군 프로파일',
        commonWithMyeongsim: '행동·정서 패턴의 다각적 파악',
        coreDifference: '의료·임상평가 영역. 명심으로 대체하면 안 되며, 명심은 내담자를 환자가 아닌 본래 완전한 존재로 대함',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        icon: '🏥'
    },
    {
        id: 'mcmi',
        name: 'MCMI (성격장애 검사)',
        category: 'clinical',
        categoryLabel: '임상·심리평가',
        whatItMeasures: '성격장애 및 임상 증후군',
        typicalResult: '14개 임상 성격 패턴',
        commonWithMyeongsim: '반복적인 고착 성격 패턴 이해',
        coreDifference: '임상 진단 보조도구와 코칭 체계라는 근본적 차이. 명심은 어두운 면을 장애가 아닌 생존 장르(Dark Code)로 재해석함',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        icon: '📑'
    },
    {
        id: 'rorschach',
        name: 'Rorschach (로샤 잉크반점)',
        category: 'clinical',
        categoryLabel: '임상·심리평가',
        whatItMeasures: '투사적 반응을 통한 무의식 심리 특성',
        typicalResult: '구조화된 반응 채점 및 성격 구조 해석',
        commonWithMyeongsim: '의식되지 않은 심층 영역 탐색',
        coreDifference: '명심은 투사검사가 아니라 당사자가 직접 자기 뇌와 신체의 반응을 관찰(알아차림)하도록 안내함',
        badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
        icon: '🖌️'
    },
    {
        id: 'tat',
        name: 'TAT (주제통각검사)',
        category: 'clinical',
        categoryLabel: '임상·심리평가',
        whatItMeasures: '이야기·욕구·갈등의 투사',
        typicalResult: '서사적 심리 해석',
        commonWithMyeongsim: '개인 고유의 내면 이야기(Story)에 깊은 관심',
        coreDifference: '명심은 Story를 찾아낸 뒤, 그것이 사실(Fact)이 아님을 즉각 분리하고 새로운 선택(Meta Code)으로 이동시킴',
        badgeColor: 'bg-stone-500/20 text-stone-300 border-stone-500/30',
        icon: '🖼️'
    },
    {
        id: 'saju_myeongli',
        name: '전통 사주·명리학',
        category: 'symbolic',
        categoryLabel: '동양철학·상징',
        whatItMeasures: '생년월일시 기반 시공간 상징체계',
        typicalResult: '일간·오행·십성·신살·길흉화복',
        commonWithMyeongsim: '★ 명심의 영혼 본질 기질(Hardware)을 구성하는 핵심 재료',
        coreDifference: '전통 명리는 결정론과 길흉에 얽매이기 쉬우나, 명심은 이를 최신 뇌과학과 시스템 아키텍처 코칭 언어로 완벽 번역해 자유의지로 리부팅함',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        icon: '☯️',
        highlight: true
    },
    {
        id: 'iching_64',
        name: '주역 64괘 기반 유형',
        category: 'symbolic',
        categoryLabel: '동양철학·상징',
        whatItMeasures: '우주와 인간 변화의 64 패턴',
        typicalResult: '64괘 괘상 및 시공간 신탁',
        commonWithMyeongsim: '★ 명심 Life Code의 직접적 기반',
        coreDifference: '전통 주역 자체에는 Dark ➔ Neural ➔ Meta의 3단계 신경망 진화 모델과 3S(Scan-Sync-Shift) 바이오피드백 체계가 없음',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        icon: '🔮',
        highlight: true
    },
    {
        id: 'astrology',
        name: '별자리·점성술 모델',
        category: 'symbolic',
        categoryLabel: '동양철학·상징',
        whatItMeasures: '출생 시점의 천체 배치와 상징적 해석',
        typicalResult: '12별자리, 행성 애스펙트',
        commonWithMyeongsim: '자기 서사와 원형적 상징을 통한 다차원적 자기이해',
        coreDifference: '신비주의적 믿음보다, 명심은 상징을 뇌신경의 거울로 삼아 현재 순간의 자동반응을 자각하고 현실을 조작하는 데 초점을 둠',
        badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        icon: '✨'
    }
];

interface AssessmentComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStartCoaching?: (testName: string, prompt?: string) => void;
}

export default function AssessmentComparisonModal({
    isOpen,
    onClose,
    onStartCoaching
}: AssessmentComparisonModalProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
    const [selectedItem, setSelectedItem] = useState<AssessmentItem | null>(null);

    // 필터링
    const filteredList = useMemo(() => {
        return ASSESSMENT_DATA.filter((item) => {
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            const matchesSearch = searchQuery.trim() === '' ||
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.whatItMeasures.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.coreDifference.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    if (!isOpen) return null;

    return (
        <div 
            onClick={onClose}
            className="fixed inset-0 z-[2300] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        >
            <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                className="w-full max-w-6xl bg-slate-950 border-2 border-amber-400/40 rounded-t-3xl sm:rounded-3xl text-white shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]"
            >
                {/* 배경 HUD 그리드 & 네온 글로우 */}
                <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:28px_28px] opacity-30" />
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />
                </div>

                {/* ── 1. 헤더 영역 ── */}
                <div className="relative z-10 px-5 py-4 border-b border-amber-500/20 bg-slate-950/95 backdrop-blur-xl flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 border border-amber-300/40 shrink-0">
                            <Scale className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono tracking-wider">
                                    ASSESSMENT BENCHMARK 28
                                </span>
                                <span className="text-[11px] text-gray-400 hidden md:inline">
                                    시중 28대 심리·성격 검사와 명심 코칭의 초격차 비교
                                </span>
                            </div>
                            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                                <span>성격유형검사 비교분석 센터</span>
                                <span className="text-xs font-normal text-amber-400/90 hidden sm:inline">
                                    (측정을 넘어선 3단계 의식 진화)
                                </span>
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* 뷰 모드 전환 버튼 */}
                        <div className="hidden sm:flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
                            <button
                                type="button"
                                onClick={() => setViewMode('card')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                    viewMode === 'card' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <LayoutGrid className="w-3.5 h-3.5" />
                                <span>카드</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('table')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                    viewMode === 'table' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <Table className="w-3.5 h-3.5" />
                                <span>표(Table)</span>
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* ── 2. 핵심 3대 초격차 요약 배너 ── */}
                <div className="relative z-10 px-5 py-3.5 bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-cyan-950/40 border-b border-white/10 shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                        <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/90 border border-amber-400/25">
                            <span className="text-base shrink-0">①</span>
                            <div>
                                <h4 className="font-bold text-amber-300">유형에 가두지 않는 탈융합</h4>
                                <p className="text-[11px] text-gray-300 mt-0.5">
                                    “나는 INTJ야”에 갇히지 않고, 그 선호가 언제 오류(Dark Code)가 되는지 관찰
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/90 border border-emerald-400/25">
                            <span className="text-base shrink-0">②</span>
                            <div>
                                <h4 className="font-bold text-emerald-300">Dark ➔ Neural ➔ Meta 3단계 진화</h4>
                                <p className="text-[11px] text-gray-300 mt-0.5">
                                    단순 측정을 넘어, 결핍을 강점으로 승화하고 '비현실을 현실로 창조'
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/90 border border-cyan-400/25">
                            <span className="text-base shrink-0">③</span>
                            <div>
                                <h4 className="font-bold text-cyan-300">3S 기반 실시간 신경망 재배선</h4>
                                <p className="text-[11px] text-gray-300 mt-0.5">
                                    Scan ➔ Sync ➔ Shift로 뇌파와 행동을 즉각 바꾸는 실천 퀘스트 탑재
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── 3. 검색 & 카테고리 필터 바 ── */}
                <div className="relative z-10 p-3 sm:px-5 sm:py-3 bg-slate-950 border-b border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
                    {/* 카테고리 탭 */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                        {[
                            { key: 'all', label: '전체 (28종)', icon: '🌟' },
                            { key: 'cognitive', label: '인지·성향 (MBTI/Big5 등)', icon: '🧠' },
                            { key: 'behavior', label: '행동·비즈니스 (Hogan/DISC 등)', icon: '💼' },
                            { key: 'strength', label: '강점·동기 (갤럽/애착 등)', icon: '💎' },
                            { key: 'clinical', label: '임상·심리 (MMPI/로샤 등)', icon: '🩺' },
                            { key: 'symbolic', label: '동양·상징 (사주/주역 64괘)', icon: '🌌' }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setSelectedCategory(tab.key)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer border ${
                                    selectedCategory === tab.key
                                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-black'
                                        : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* 실시간 검색창 */}
                    <div className="relative w-full sm:w-64 shrink-0">
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="검사명, 측정 내용 검색..."
                            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* ── 4. 메인 콘텐츠 영역 (카드 뷰 vs 테이블 뷰) ── */}
                <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6">
                    {viewMode === 'card' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
                            {filteredList.map((item) => (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                                    onClick={() => setSelectedItem(item)}
                                    className={`group relative rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 border cursor-pointer ${
                                        item.highlight
                                            ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/30 border-amber-500/40 shadow-[0_4px_20px_rgba(245,158,11,0.15)] hover:border-amber-400'
                                            : 'bg-slate-900/80 hover:bg-slate-900 border-white/10 hover:border-white/25 shadow-lg'
                                    }`}
                                >
                                    <div>
                                        {/* 헤더: 아이콘 + 뱃지 */}
                                        <div className="flex items-center justify-between gap-2 mb-2.5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">{item.icon}</span>
                                                <div>
                                                    <h3 className="text-sm sm:text-base font-black text-white group-hover:text-amber-300 transition-colors">
                                                        {item.name}
                                                    </h3>
                                                    <span className="text-[10px] text-gray-400 font-mono">
                                                        {item.categoryLabel}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                                                {item.categoryLabel}
                                            </span>
                                        </div>

                                        {/* 측정 대상 & 대표 결과 */}
                                        <div className="space-y-1.5 my-3 p-3 rounded-xl bg-slate-950/70 border border-white/5 text-xs">
                                            <div>
                                                <span className="text-gray-400 font-bold block text-[11px]">무엇을 보는가:</span>
                                                <span className="text-gray-200">{item.whatItMeasures}</span>
                                            </div>
                                            <div className="pt-1 border-t border-white/5">
                                                <span className="text-gray-400 font-bold block text-[11px]">대표 결과:</span>
                                                <span className="text-amber-300/90 font-medium">{item.typicalResult}</span>
                                            </div>
                                        </div>

                                        {/* 명심코칭과의 공통점 */}
                                        <div className="text-xs mb-2">
                                            <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px] mb-0.5">
                                                <span>🤝</span>
                                                <span>명심코칭과의 공통점</span>
                                            </span>
                                            <p className="text-gray-300 text-[11.5px] leading-relaxed pl-4">
                                                {item.commonWithMyeongsim}
                                            </p>
                                        </div>

                                        {/* 명심코칭과의 핵심 차이 */}
                                        <div className="text-xs p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/30">
                                            <span className="text-amber-300 font-black flex items-center gap-1 text-[11.5px] mb-1">
                                                <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                <span>명심코칭만의 핵심 차이</span>
                                            </span>
                                            <p className="text-gray-200 text-[11.5px] leading-relaxed font-medium">
                                                {item.coreDifference}
                                            </p>
                                        </div>
                                    </div>

                                    {/* 하단 1:1 AI 상담 버튼 */}
                                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                                        <span className="text-[10.5px] text-gray-400">
                                            내 유형과 비교해보기
                                        </span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const prompt = `[28대 검사 비교 코칭] ${item.name} 검사와 명심코칭의 핵심 차이(“${item.coreDifference}”)를 바탕으로, 저의 고유 기질과 무의식 자동반응을 점검하고 3S 신경망 재배선 심층 코칭을 받고 싶습니다.`;
                                                if (onStartCoaching) onStartCoaching(item.name, prompt);
                                            }}
                                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-amber-400 hover:text-slate-950 font-bold text-[11px] text-gray-200 transition-all flex items-center gap-1 cursor-pointer"
                                        >
                                            <Send className="w-3 h-3" />
                                            <span>AI 분석 받기</span>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        /* 테이블 뷰 */
                        <div className="max-w-7xl mx-auto bg-slate-900/90 border border-white/10 rounded-2xl overflow-x-auto shadow-2xl">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-slate-950 border-b border-white/10 text-gray-400 font-bold">
                                        <th className="p-3.5 w-44">검사·모델</th>
                                        <th className="p-3.5 w-48">무엇을 보는가</th>
                                        <th className="p-3.5 w-48">대표 결과</th>
                                        <th className="p-3.5 w-56">명심코칭과의 공통점</th>
                                        <th className="p-3.5 min-w-[280px] text-amber-300">명심코칭과의 핵심 차이 (초격차)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredList.map((item) => (
                                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-3.5 font-bold text-white flex items-center gap-2">
                                                <span className="text-lg">{item.icon}</span>
                                                <span>{item.name}</span>
                                            </td>
                                            <td className="p-3.5 text-gray-300">{item.whatItMeasures}</td>
                                            <td className="p-3.5 text-amber-300/90 font-medium">{item.typicalResult}</td>
                                            <td className="p-3.5 text-gray-300">{item.commonWithMyeongsim}</td>
                                            <td className="p-3.5 text-gray-200 font-medium bg-amber-500/5">
                                                {item.coreDifference}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* ── 5. 하단 풋바 ── */}
                <div className="relative z-10 px-5 py-3 border-t border-white/10 bg-slate-950/95 backdrop-blur-xl flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-amber-400" />
                        <span>특허출원 제10-2025-0166877호 기반 3세대 신경심리학 진화 체계</span>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        <span>총 <strong>{filteredList.length}</strong>개 검사 모델 비교 중</span>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer ml-2"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
