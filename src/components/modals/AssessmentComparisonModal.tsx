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
    Target,
    BookOpen,
    Compass,
    GraduationCap,
    Workflow,
    RefreshCw,
    Check,
    ChevronRight
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
        whatItMeasures: '성격특질의 정도 (외향성, 성실성, 개방성, 친화성, 정서성)',
        typicalResult: '5대 요인 백분위 및 프로파일',
        commonWithMyeongsim: '사람을 단면이 아닌 다차원적이고 연속적인 스펙트럼으로 봄',
        coreDifference: '측정·설명 중심. 명심은 특질 수치 측정 이후의 자각(SCAN)·수용(SYNC)·선택(SHIFT)을 통한 뇌신경 재배선까지 나아감',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        icon: '📊'
    },
    {
        id: 'hexaco',
        name: 'HEXACO 모델',
        category: 'cognitive',
        categoryLabel: '인지·성향',
        whatItMeasures: '6대 성격특질 (정직-겸손성 H 요인 추가)',
        typicalResult: '6개 차원 점수 프로파일',
        commonWithMyeongsim: '사람의 성향과 본질적 특질의 강약을 정밀하게 파악',
        coreDifference: '명심은 특질의 높고 낮음을 좋고 나쁨으로 판단하지 않고, 상황에 따른 과출력과 에너지 방향의 사용법을 다룸',
        badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
        icon: '💎'
    },
    {
        id: 'disc',
        name: 'DISC 행동유형검사',
        category: 'behavior',
        categoryLabel: '행동·비즈니스',
        whatItMeasures: '행동 및 소통 스타일 (주도형 D, 사교형 I, 안정형 S, 신중형 C)',
        typicalResult: '주요 행동 패턴 프로파일',
        commonWithMyeongsim: '조직 및 관계 속에서 겉으로 드러나는 반복 행동 패턴 파악',
        coreDifference: '상황별 겉보기 행동 스타일 중심. 명심은 그 행동 이전의 신체 감각, 왜곡된 해석(Story), 유년기 생존 패턴까지 근본 탐색',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        icon: '🎯',
        highlight: true
    },
    {
        id: 'enneagram',
        name: '에니어그램 (Enneagram)',
        category: 'strength',
        categoryLabel: '강점·동기',
        whatItMeasures: '내면의 핵심 욕구, 두려움, 무의식적 방어기제',
        typicalResult: '9가지 성격 유형 및 날개, 통합/분열 방향',
        commonWithMyeongsim: '자동 반응 패턴, 두려움, 성장 및 퇴행 방향을 다룸 (명심과 가장 친화적)',
        coreDifference: '명심코칭은 에니어그램의 깊은 동기 구조를 바탕으로 3S(State/Structure/Story)와 실제 신경망 재배선, 그리고 모든 역할을 내려놓는 Zero Point까지 명시적으로 설계',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        icon: '🔮',
        highlight: true
    },
    {
        id: 'tci',
        name: 'TCI (기질 및 성격검사)',
        category: 'strength',
        categoryLabel: '강점·동기',
        whatItMeasures: '유전적 기질(4종)과 후천적 성격(3종)',
        typicalResult: '자극추구, 위험회피, 자율성, 연대감 등 수치',
        commonWithMyeongsim: '타고난 기질(생물학적 하드웨어)과 후천적 인격의 형성 분리',
        coreDifference: '명심의 생체 Hardware 분류와 유사하나, 명심코칭은 Dark(생존반응) ➔ Neural(선택) ➔ Meta(창조)라는 명확한 3단계 운영체계를 둠',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        icon: '🧬'
    },
    {
        id: '16pf',
        name: '16PF (카텔 16 성격요인)',
        category: 'cognitive',
        categoryLabel: '인지·성향',
        whatItMeasures: '16가지 독립적 성격 근원 특질',
        typicalResult: '세밀한 16차원 연속 프로파일',
        commonWithMyeongsim: '인간의 성격 요소를 다면적으로 세분화하여 조망',
        coreDifference: '정밀 측정이 주 목적. 명심은 정밀 측정값 자체보다 특정 트리거에서 촉발되는 반복 루프와 중간 개입 지점을 중요시함',
        badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
        icon: '📐'
    },
    {
        id: 'epq',
        name: 'EPQ (아이젠크 성격검사)',
        category: 'cognitive',
        categoryLabel: '인지·성향',
        whatItMeasures: '생물학적 기질 차원 (외향성, 신경증, 정신증)',
        typicalResult: '생물학적 성향 지수',
        commonWithMyeongsim: '생물학적·신경학적 성향(Hardware)의 선천성 인정',
        coreDifference: '명심은 기질을 고정된 운명으로 보지 않고, 뇌가소성(Neuroplasticity)을 통해 자율적 자유의지 행동으로 재배선함',
        badgeColor: 'bg-blue-600/20 text-blue-300 border-blue-600/30',
        icon: '⚡'
    },
    {
        id: 'hogan_hpi',
        name: '호건 HPI (평상시 성격)',
        category: 'behavior',
        categoryLabel: '행동·비즈니스',
        whatItMeasures: '직장 및 일상에서의 밝은 면 성격 (사회적 명성)',
        typicalResult: '조정력, 야망, 사교성, 신중성 등 직무 적합도',
        commonWithMyeongsim: '비즈니스 및 리더십 상황에서의 현실 업무 행동 예측',
        coreDifference: '호건은 직장 업무 적합성이 주 타겟이나, 명심은 업무뿐 아니라 감정, 신체 에너지, 관계 및 삶의 정체성 전체로 확장',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        icon: '💼'
    },
    {
        id: 'hogan_hds',
        name: '호건 HDS (탈선 위험 검사)',
        category: 'behavior',
        categoryLabel: '행동·비즈니스',
        whatItMeasures: '극심한 스트레스 상황에서 발생하는 탈선 요인 (어두운 면)',
        typicalResult: '11가지 탈선 위험 요인 (독단, 회피, 의심 등)',
        commonWithMyeongsim: '명심의 핵심 개념인 **Dark Code(스트레스 시 자동 방어기제)**와 가장 정밀하게 매칭됨',
        coreDifference: 'HDS는 위험 성향을 측정하고 배제하는 목적이나, 명심코칭은 그것을 과거 나를 지켜준 하나의 “생존 장르”로 온전히 수용하고 자원화함',
        badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
        icon: '⚠️',
        highlight: true
    },
    {
        id: 'hogan_mvpi',
        name: '호건 MVPI (동기·가치·선호)',
        category: 'behavior',
        categoryLabel: '행동·비즈니스',
        whatItMeasures: '개인이 진정으로 추구하는 핵심 가치와 동기',
        typicalResult: '인정, 권력, 쾌락, 이타심 등 10개 핵심 가치',
        commonWithMyeongsim: '개인의 핵심 가치(Values)와 실제 행동을 정렬시키는 목표',
        coreDifference: '가치 자체를 정의하는 데 그치지 않고, 자동 생존 반응에서 가치 중심 선택으로 실시간 전환하는 메타 인지 훈련을 제공',
        badgeColor: 'bg-emerald-600/20 text-emerald-300 border-emerald-600/30',
        icon: '🏆'
    },
    {
        id: 'clifton_strengths',
        name: 'CliftonStrengths (갤럽 강점)',
        category: 'strength',
        categoryLabel: '강점·동기',
        whatItMeasures: '자연스럽게 반복되는 사고·감정·행동의 패턴 (재능)',
        typicalResult: '34개 강점 테마 중 Top 5 프로파일',
        commonWithMyeongsim: '“약점 교정보다 고유성을 활용하라”는 철학이 명심코칭과 매우 유사함',
        coreDifference: '명심코칭은 강점이 극단으로 치달아 스스로를 갉아먹는 **과출력 상태(Overdrive Dark Code)**를 함께 분석하고 제어함',
        badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
        icon: '🌟',
        highlight: true
    },
    {
        id: 'via_strengths',
        name: 'VIA 성격 강점 검사',
        category: 'strength',
        categoryLabel: '강점·동기',
        whatItMeasures: '보편적 미덕과 도덕적 성격 강점 (긍정심리학)',
        typicalResult: '24개 강점의 서열화된 프로파일',
        commonWithMyeongsim: '강점 기반의 긍정적 성장과 자기실현 지향',
        coreDifference: '명심은 미덕의 나열을 넘어, 강점이 특정 상황에서 방어기제로 왜곡될 때 즉시 SCAN-SYNC-SHIFT로 리셋하는 전환 구조가 명확함',
        badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        icon: '🎖️'
    },
    {
        id: 'riasec',
        name: '홀랜드 RIASEC 진로탐색',
        category: 'strength',
        categoryLabel: '강점·동기',
        whatItMeasures: '직업적 흥미와 환경 성향 (실제/탐구/예술/사회/기업/관습)',
        typicalResult: '3자리 흥미 코드 (예: SEC, RIA)',
        commonWithMyeongsim: '자신에 대한 이해를 바탕으로 한 진로 및 역할 탐색',
        coreDifference: '직업 흥미라는 단일 영역에 국한됨. 명심은 일뿐 아니라 내면 의식, 생체 리듬, 인간관계 등 삶 전체의 라이프 아키텍처를 재설계함',
        badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
        icon: '🧭'
    },
    {
        id: 'firo_b',
        name: 'FIRO-B 대인관계욕구',
        category: 'behavior',
        categoryLabel: '행동·비즈니스',
        whatItMeasures: '대인관계 3대 욕구 (소속/통제/애정의 표출 및 기대)',
        typicalResult: '대인관계 행동 점수 매트릭스',
        commonWithMyeongsim: '사람 사이에서 무의식적으로 반복되는 관계 패턴 규명',
        coreDifference: '명심은 표면적 관계 욕구 이면에 숨은 거절 공포, 무의식적 서사(Story), 결핍에서 비롯된 Dark Code까지 파고들어 치유함',
        badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
        icon: '🤝'
    },
    {
        id: 'attachment_ecr',
        name: '성인애착유형검사 (ECR)',
        category: 'clinical',
        categoryLabel: '임상·심리',
        whatItMeasures: '친밀한 관계에서의 애착 불안과 애착 회피 수준',
        typicalResult: '4대 애착 유형 (안정형, 몰두형, 거부회피형, 공포회피형)',
        commonWithMyeongsim: '관계 속에서 반복되는 무의식적 불안·회피 루프 분석과 매우 잘 연결됨',
        coreDifference: '명심은 애착 유형을 평생 꼬리표로 두지 않고, 갈등의 찰나에 몸 반응을 자각하고 탈융합하는 SCAN–SYNC–SHIFT 실천 훈련으로 전환함',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        icon: '🫂',
        highlight: true
    },
    {
        id: 'pcm_motivation',
        name: '동기형 모델 (PCM 등)',
        category: 'strength',
        categoryLabel: '강점·동기',
        whatItMeasures: '유형별 심리적 욕구, 스트레스 단계, 소통 채널',
        typicalResult: '성격 콘도미니엄 구조 및 스트레스 패턴',
        commonWithMyeongsim: '스트레스 발생 시 퇴행하는 심리적 패턴을 관찰한다는 점에서 유사',
        coreDifference: '유형의 정교한 분류보다, “그 패턴과 나(자아) 사이에 얼마나 거리를 둘 수 있는가(탈융합)?”를 핵심으로 다룸',
        badgeColor: 'bg-indigo-600/20 text-indigo-300 border-indigo-600/30',
        icon: '📶'
    },
    {
        id: 'social_styles',
        name: '소셜 스타일 (Social Styles)',
        category: 'behavior',
        categoryLabel: '행동·비즈니스',
        whatItMeasures: '대인관계 주장성 및 반응성 (분석형, 주도형, 우호형, 표현형)',
        typicalResult: '대인 스타일 4분면 프로파일',
        commonWithMyeongsim: '타인과의 소통 방식 및 관계 역동 이해',
        coreDifference: '관찰 가능한 외적 행동 중심. 명심은 그 행동을 촉발하는 내면의 신체화 반응, 동일시된 신념 체계를 함께 다룸',
        badgeColor: 'bg-blue-400/20 text-blue-200 border-blue-400/30',
        icon: '👥'
    },
    {
        id: 'belbin',
        name: '벨빈 팀 역할 (Belbin)',
        category: 'behavior',
        categoryLabel: '행동·비즈니스',
        whatItMeasures: '팀 내에서 개인이 기여하는 9가지 팀 역할',
        typicalResult: '자원탐색가, 추진자, 완료자 등 주요 역할',
        commonWithMyeongsim: '개인의 고유한 특성이 조직에서 발휘되는 역할 이해',
        coreDifference: '개인의 성격보다 팀 역할 중심. 명심은 특정 역할(예: 해결사, 희생자)과 자아를 동일시하여 번아웃되는 문제를 근본 해결함',
        badgeColor: 'bg-slate-400/20 text-slate-200 border-slate-400/30',
        icon: '🛡️'
    },
    {
        id: 'sdi',
        name: 'SDI (갈등·동기 검사)',
        category: 'behavior',
        categoryLabel: '행동·비즈니스',
        whatItMeasures: '평상시 동기 가치 체계와 갈등 상황에서의 동기 변화',
        typicalResult: '갈등 전후 화살표 이동 매트릭스',
        commonWithMyeongsim: '갈등 전후의 심리적 변화를 추적한다는 점에서 명심과 호환성이 높음',
        coreDifference: '명심코칭은 갈등 순간에 호흡, 신체 긴장, 생각, 감정이 행동으로 번지는 전 과정을 실시간으로 멈추고 재배선하는 훈련 제공',
        badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
        icon: '🔄'
    },
    {
        id: 'mmpi',
        name: 'MMPI-2 / MMPI-3',
        category: 'clinical',
        categoryLabel: '임상·심리',
        whatItMeasures: '임상적 성격 특성, 정신병리적 척도 및 타당도',
        typicalResult: 'T점수 기반 임상 척도 프로파일',
        commonWithMyeongsim: '인간 심리의 방어기제와 패턴을 매우 체계적으로 분석',
        coreDifference: '【완전히 다른 목적】 MMPI는 병리 진단 및 치료 목적의 전문 심리평가이며, 명심은 질병 진단이 아닌 일반인의 건강한 성장·행동 전환 코칭 체계임',
        badgeColor: 'bg-red-600/20 text-red-300 border-red-600/30',
        icon: '🏥',
        highlight: true
    },
    {
        id: 'pai',
        name: 'PAI (성격평가질문지)',
        category: 'clinical',
        categoryLabel: '임상·심리',
        whatItMeasures: '성인 정신병리 및 치료 고려 요소',
        typicalResult: '임상 증상 및 성격 프로파일',
        commonWithMyeongsim: '부정적 정서와 행동 패턴의 복합성을 파악',
        coreDifference: '의료 및 전문 임상평가 영역. 명심코칭은 이를 대체할 수 없으며 명확히 비의료적 의식 코칭의 영역을 준수함',
        badgeColor: 'bg-red-700/20 text-red-300 border-red-700/30',
        icon: '🩺'
    },
    {
        id: 'mcmi',
        name: 'MCMI (밀론 임상검사)',
        category: 'clinical',
        categoryLabel: '임상·심리',
        whatItMeasures: 'DSM 기반의 성격장애 및 임상 증후군',
        typicalResult: '성격장애 척도 및 중증 병리 패턴',
        commonWithMyeongsim: '뿌리 깊은 성격적 반복 패턴을 탐색한다는 접점',
        coreDifference: '임상 진단 보조도구와 자율적 라이프 디자인 코칭이라는 근본적 영역 차이',
        badgeColor: 'bg-rose-700/20 text-rose-300 border-rose-700/30',
        icon: '📋'
    },
    {
        id: 'rorschach',
        name: '로샤 (Rorschach Inkblot)',
        category: 'clinical',
        categoryLabel: '임상·심리',
        whatItMeasures: '모호한 잉크 반점 자극에 대한 무의식적 인지·정서 투사',
        typicalResult: '종합 채점 체계 기반 구조화된 심리 해석',
        commonWithMyeongsim: '의식되지 않은 내면의 억압된 심리 기제를 탐색',
        coreDifference: '명심은 검사자의 투사 해석이 아니라, 당사자가 자기 신체 반응과 감정 순서를 직접 관찰하고 알아차리는 자각 중심',
        badgeColor: 'bg-neutral-500/20 text-neutral-300 border-neutral-500/30',
        icon: '🦋'
    },
    {
        id: 'tat',
        name: 'TAT (주제통각검사)',
        category: 'clinical',
        categoryLabel: '임상·심리',
        whatItMeasures: '그림 자극을 통한 개인의 내적 서사(Story), 욕구, 압력',
        typicalResult: '주인공의 동기 및 환경적 상호작용 서사 해석',
        commonWithMyeongsim: '인간이 세상을 바라보는 개인 고유의 내러티브(Story)에 깊은 관심',
        coreDifference: '명심코칭은 Story를 찾아낸 뒤, 그 Story를 Fact(사실)와 완전히 분리(탈융합)하고 현실에서의 새로운 선택으로 즉각 이동시킴',
        badgeColor: 'bg-amber-600/20 text-amber-200 border-amber-600/30',
        icon: '🎨'
    },
    {
        id: 'saju_myeongri',
        name: '사주·명리 기질 체계',
        category: 'symbolic',
        categoryLabel: '동양·상징',
        whatItMeasures: '생년월일시 천간지지의 음양오행 에너지 분포',
        typicalResult: '일주 기질 원형, 오행의 균형, 십성 성향',
        commonWithMyeongsim: '명심코칭의 생물학적 기질(Hardware)을 분류하는 상징적 메타포로 활용',
        coreDifference: '숙명론적 길흉화복 예언을 철저히 배제하고, 현대 뇌과학과 3S 신경심리학으로 재해석하여 자기이해와 코칭의 출발점으로 삼음',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        icon: '☯️',
        highlight: true
    },
    {
        id: 'iching_64keys',
        name: '주역 64괘 (Gene Keys)',
        category: 'symbolic',
        categoryLabel: '동양·상징',
        whatItMeasures: '우주와 인간 의식 변화의 64가지 원형적 스펙트럼',
        typicalResult: '64개 유전자 열쇠 및 그림자/선물/싯디',
        commonWithMyeongsim: '명심 64 Life Code의 상징적 토대',
        coreDifference: '전통 주역에는 없는 Dark(생존반응) ➔ Neural(의식선택) ➔ Meta(창조)라는 3단계 진화 프로세스와 3S 실시간 재배선 시스템을 접목',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        icon: '🗝️',
        highlight: true
    },
    {
        id: 'astrology',
        name: '서양 점성술 (Astrology)',
        category: 'symbolic',
        categoryLabel: '동양·상징',
        whatItMeasures: '출생 시점 천체 배치를 통한 원형적 성향과 주기',
        typicalResult: '태양/달/상승점 및 행성 각도 프로파일',
        commonWithMyeongsim: '상징과 은유를 통한 자기 서사의 확장 가능성',
        coreDifference: '신비주의적 믿음보다, 명심은 상징을 뇌신경의 거울로 삼아 현재 순간의 자동반응을 자각하고 현실을 조작하는 데 초점을 둠',
        badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        icon: '✨'
    }
];

// 16모듈 평생교육원 커리큘럼 데이터
export const CURRICULUM_MODULES = [
    { num: '01', title: '성격이란 무엇인가 (Trait vs Type)', desc: '성격의 본질, 연속적 특질(Trait)과 유형론(Type)의 과학적 비교 및 오해 바로잡기' },
    { num: '02', title: 'MBTI 이해와 한계', desc: '16유형의 인지 선호 메커니즘과 정체성 융합(라벨링) 함정 극복' },
    { num: '03', title: 'Big Five / HEXACO 기초심리학', desc: '5대/6대 학술 성격특질을 고감도 위험감지 조기경보 시스템으로 재해석' },
    { num: '04', title: 'DISC와 Social Style', desc: '관찰 가능한 행동 양식과 내면의 자동 방어기제 분리' },
    { num: '05', title: 'Enneagram 심층 역동', desc: '9가지 근원적 욕구와 두려움, 스트레스 시 퇴행과 통합 경로 해체' },
    { num: '06', title: 'TCI와 기질의 생물학', desc: '유전적 하드웨어(기질)와 후천적 소프트웨어(인격)의 상호작용' },
    { num: '07', title: 'Strengths & VIA 강점 모델', desc: '약점 교정 탈피와 강점의 과출력(Overdrive Dark Code) 방지 전략' },
    { num: '08', title: '성인애착 (Attachment)', desc: '친밀한 관계 속 애착불안과 애착회피의 무의식적 알고리즘 교정' },
    { num: '09', title: 'Hogan과 리더십 탈선', desc: 'HDS 스트레스 탈선 요인과 Dark Code의 생존 장르 수용' },
    { num: '10', title: '임상검사와 코칭의 엄격한 경계', desc: 'MMPI/PAI 병리 진단 영역 존중과 라이프 코칭의 올바른 윤리선 확립' },
    { num: '11', title: '명리·주역과 심리검사의 차이', desc: '동양 고전 상징을 뇌신경의 거울로 삼아 현대 인지코칭에 융합' },
    { num: '12', title: '성격검사 ➔ Dark Code 매핑', desc: '모든 유형검사 결과를 1:1 Dark Code 및 생존반응 지도로 전환' },
    { num: '13', title: 'SCAN 질문 설계 기법', desc: '사실(Fact)과 해석(Story)을 즉시 분리하는 신경 탈융합 인터뷰' },
    { num: '14', title: 'SYNC 질문과 자기전쟁 중단', desc: '방어기제를 비난하지 않고 익숙한 연주 장르로 온전히 수용하기' },
    { num: '15', title: 'SHIFT 행동설계와 신경망 재배선', desc: '뇌가소성 기반의 구체적 현실 행동 퀘스트 및 마이크로 액션 도출' },
    { num: '16', title: '유형을 넘어 Zero Point로', desc: '모든 성격의 페르소나를 잠시 벗고 관찰자로서 삶을 새롭게 창조하는 메타 상태' }
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
    // 3대 탭: 'benchmark'(28대 검사 비교) | 'meta_philosophy'(지도 vs 운전 & 실전 해체) | 'curriculum'(16모듈 과정)
    const [mainTab, setMainTab] = useState<'benchmark' | 'meta_philosophy' | 'curriculum'>('benchmark');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
    const [activeAlgorithmTab, setActiveAlgorithmTab] = useState<'mbti' | 'bigfive' | 'enneagram'>('mbti');

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
                className="w-full max-w-6xl bg-slate-950 border-2 border-amber-400/40 rounded-t-3xl sm:rounded-3xl text-white shadow-2xl relative overflow-hidden flex flex-col max-h-[94vh]"
            >
                {/* 배경 HUD 그리드 & 네온 글로우 */}
                <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:28px_28px] opacity-30" />
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />
                </div>

                {/* ── 1. 헤더 영역 ── */}
                <div className="relative z-10 px-5 py-3.5 border-b border-amber-500/20 bg-slate-950/95 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 shrink-0">
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
                                    《나는 믿는다, 그러나 갇히지 않는다》 메타 코칭 센터
                                </span>
                            </div>
                            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                                <span>성격유형검사 비교분석 센터</span>
                                <span className="text-xs font-normal text-amber-400/90 hidden sm:inline">
                                    (지도를 넘어선 3단계 의식 운전 시스템)
                                </span>
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {mainTab === 'benchmark' && (
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
                        )}

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* ── 2. [책의 핵심 철학] 골드 명언 배너 ── */}
                <div className="relative z-10 px-4 sm:px-5 py-3 bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-cyan-950/40 border-b border-amber-500/20 shrink-0">
                    <div className="flex items-start gap-2.5">
                        <span className="text-xl shrink-0 mt-0.5">🧭</span>
                        <div className="space-y-1 w-full">
                            <p className="text-xs sm:text-[13px] font-bold text-amber-200 leading-snug">
                                “성격검사는 <span className="text-white font-black underline decoration-amber-400 decoration-2">‘나는 어떤 사람인가?’를 설명하는 지도</span>이고, 명심코칭은 <span className="text-cyan-300 font-black underline decoration-cyan-400 decoration-2">‘그 특성이 지금 어떻게 작동하고 있으며, 나는 그것에 끌려갈 것인가 아니면 그것을 사용할 것인가?’를 다루는 운전·전환 시스템</span>입니다.”
                            </p>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-300 pt-0.5">
                                <span className="text-amber-400/90 font-medium">✨ 유형을 알되 유형이 되지 않는다</span>
                                <span className="hidden sm:inline text-white/20">|</span>
                                <span className="text-emerald-400/90 font-medium">⚡ 반복은 성격이 아니라 ‘순서’다</span>
                                <span className="hidden sm:inline text-white/20">|</span>
                                <span className="text-cyan-400/90 font-medium">🎻 Dark Code는 결함이 아닌 ‘익숙한 연주 장르’다</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── 3. 3대 대메뉴 탭 내비게이션 ── */}
                <div className="relative z-10 px-5 pt-2 pb-0 bg-slate-950 border-b border-white/10 flex items-center gap-2 overflow-x-auto shrink-0">
                    <button
                        type="button"
                        onClick={() => setMainTab('benchmark')}
                        className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                            mainTab === 'benchmark'
                                ? 'border-amber-400 text-amber-300 bg-amber-400/10 rounded-t-xl'
                                : 'border-transparent text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        <Scale className="w-4 h-4" />
                        <span>28대 성격·심리검사 벤치마크</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10">28</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setMainTab('meta_philosophy')}
                        className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                            mainTab === 'meta_philosophy'
                                ? 'border-cyan-400 text-cyan-300 bg-cyan-400/10 rounded-t-xl'
                                : 'border-transparent text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        <Compass className="w-4 h-4" />
                        <span>메타 프레임 & 실전 사례 해체</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">심층</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setMainTab('curriculum')}
                        className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                            mainTab === 'curriculum'
                                ? 'border-emerald-400 text-emerald-300 bg-emerald-400/10 rounded-t-xl'
                                : 'border-transparent text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        <GraduationCap className="w-4 h-4" />
                        <span>평생교육원 16모듈 마스터 코스</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">16주</span>
                    </button>
                </div>

                {/* ── 4. 본문 영역 (탭에 따른 분기) ── */}
                <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-5">

                    {/* ═════════ TAB 1: 28대 검사 비교 ═════════ */}
                    {mainTab === 'benchmark' && (
                        <div className="space-y-4">
                            {/* 검색 & 카테고리 필터 바 */}
                            <div className="p-3 bg-slate-900/80 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                                {/* 카테고리 버튼들 */}
                                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                                    {[
                                        { id: 'all', label: '전체 (28)' },
                                        { id: 'cognitive', label: '인지·성향 (5)' },
                                        { id: 'behavior', label: '행동·비즈니스 (5)' },
                                        { id: 'strength', label: '강점·동기 (5)' },
                                        { id: 'clinical', label: '임상·심리 (7)' },
                                        { id: 'symbolic', label: '동양·상징 (3)' }
                                    ].map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                                selectedCategory === cat.id
                                                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                                                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5'
                                            }`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>

                                {/* 검색 인풋 */}
                                <div className="relative w-full sm:w-64">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="검사명, 측정내용, 차이점 검색..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* 카드 뷰 */}
                            {viewMode === 'card' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                                    {filteredList.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between group relative overflow-hidden ${
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

                                            {/* 하단 1:1 상담 연동 */}
                                            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                                                <span className="text-[10.5px] text-gray-400">
                                                    내 유형과 심층 비교
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
                                <div className="rounded-2xl border border-white/10 overflow-x-auto bg-slate-900/90">
                                    <table className="w-full text-left text-xs border-collapse min-w-[760px]">
                                        <thead>
                                            <tr className="border-b border-white/10 bg-slate-950/80 text-amber-400 font-bold">
                                                <th className="p-3.5 w-48">검사·모델명</th>
                                                <th className="p-3.5 w-44">무엇을 보는가</th>
                                                <th className="p-3.5 w-44">대표 결과</th>
                                                <th className="p-3.5 w-56">명심코칭과의 공통점</th>
                                                <th className="p-3.5 font-black text-amber-300 bg-amber-500/10">
                                                    명심코칭과의 핵심 초격차
                                                </th>
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
                    )}

                    {/* ═════════ TAB 2: 메타 프레임 & 실전 사례 해체 ═════════ */}
                    {mainTab === 'meta_philosophy' && (
                        <div className="space-y-6 max-w-5xl mx-auto">
                            {/* 1. 4대 표준 차별화 원칙 */}
                            <div className="space-y-3">
                                <h3 className="text-base font-black text-amber-400 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    <span>명심코칭 4대 표준 차별화 원칙</span>
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                    <div className="p-4 rounded-2xl bg-slate-900 border border-blue-500/30">
                                        <span className="text-xs font-mono text-blue-400 block mb-1">01. 기존 성격검사</span>
                                        <h4 className="text-sm font-bold text-white">“나는 어떤 사람인가?”</h4>
                                        <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                                            분류와 점수 측정(지도). 정체성을 규정하고 고착화할 위험 존재
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40 bg-gradient-to-b from-slate-900 to-amber-950/20">
                                        <span className="text-xs font-mono text-amber-400 block mb-1">02. 명심코칭 작동</span>
                                        <h4 className="text-sm font-bold text-amber-300">“그 성격이 지금 어떻게 나를 연주하는가?”</h4>
                                        <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                                            성격이 아닌 작동 '순서'를 추적하여 개입 가능한 알고리즘으로 분석
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/30">
                                        <span className="text-xs font-mono text-purple-400 block mb-1">03. Meta / Zero Point</span>
                                        <h4 className="text-sm font-bold text-purple-300">“나는 그 성격만으로 정의되는가?”</h4>
                                        <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                                            어떤 유형 라벨도 벗어던진 관찰자(Zero Point)로 깨어나 탈융합
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30">
                                        <span className="text-xs font-mono text-emerald-400 block mb-1">04. SHIFT 행동 재선택</span>
                                        <h4 className="text-sm font-bold text-emerald-300">“그렇다면 지금 무엇을 선택할 것인가?”</h4>
                                        <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                                            성격에 끌려가지 않고 도구로 사용하여 현실의 새로운 행동을 실행
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 2. "반복은 성격이 아니라 순서다" SCAN 인포그래픽 */}
                            <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                                        <Workflow className="w-4 h-4 text-cyan-400" />
                                        <span>“반복은 성격이 아니라 순서일 수 있다” (개입 지점 시각화)</span>
                                    </h3>
                                    <span className="text-[11px] text-cyan-300 font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                                        SCAN 핵심
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                    {/* 기존 유형화 함정 */}
                                    <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-2">
                                        <div className="flex items-center gap-1.5 text-red-400 font-bold">
                                            <X className="w-4 h-4" />
                                            <span>일반적인 유형 고정의 함정</span>
                                        </div>
                                        <div className="p-3 rounded-lg bg-slate-950/80 border border-red-500/20 text-center font-bold text-red-200">
                                            “나는 원래 화가 많은 사람이야” (정체성 고정)
                                        </div>
                                        <p className="text-gray-400 text-[11px] leading-relaxed">
                                            ↳ 중간 과정이 통째로 생략되어 무력감과 관계 파탄이 반복됨
                                        </p>
                                    </div>

                                    {/* 명심코칭 순서 개입 */}
                                    <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                            <Check className="w-4 h-4" />
                                            <span>명심코칭의 6단계 순서 개입</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-1 text-[11px] font-mono">
                                            <span className="px-2 py-0.5 rounded bg-slate-800 text-gray-300">비판</span>
                                            <span>→</span>
                                            <span className="px-2 py-0.5 rounded bg-slate-800 text-gray-300">수치심</span>
                                            <span>→</span>
                                            <span className="px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold">‘무시당했다’ Story</span>
                                            <span>→</span>
                                            <span className="px-2 py-0.5 rounded bg-slate-800 text-gray-300">분노</span>
                                            <span>→</span>
                                            <span className="px-2 py-0.5 rounded bg-slate-800 text-gray-300">공격</span>
                                            <span>→</span>
                                            <span className="px-2 py-0.5 rounded bg-slate-800 text-gray-300">관계악화</span>
                                        </div>
                                        <p className="text-emerald-300 text-[11px] leading-relaxed font-bold">
                                            ↳ ‘Story’ 단계에서 SCAN(탈융합)하여 분노 ➔ 공격의 자동 회로를 끊어냄!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 3. 3대 모델 실전 해체 인터랙티브 뷰 (MBTI, Big Five, Enneagram) */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm sm:text-base font-black text-amber-300 flex items-center gap-2">
                                        <Zap className="w-4 h-4" />
                                        <span>3대 대표 성격검사 실전 해체 알고리즘</span>
                                    </h3>
                                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                                        <button
                                            type="button"
                                            onClick={() => setActiveAlgorithmTab('mbti')}
                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                                activeAlgorithmTab === 'mbti' ? 'bg-amber-400 text-slate-950' : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            MBTI (INTJ)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveAlgorithmTab('bigfive')}
                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                                activeAlgorithmTab === 'bigfive' ? 'bg-amber-400 text-slate-950' : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            Big Five (신경성)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveAlgorithmTab('enneagram')}
                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                                activeAlgorithmTab === 'enneagram' ? 'bg-amber-400 text-slate-950' : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            에니어그램 (3번)
                                        </button>
                                    </div>
                                </div>

                                {/* 케이스 1: MBTI INTJ */}
                                {activeAlgorithmTab === 'mbti' && (
                                    <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-4">
                                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                            <div>
                                                <span className="text-xs font-mono text-amber-400 font-bold">CASE 1. MBTI</span>
                                                <h4 className="text-base font-black text-white">INTJ의 전략적 독립성 ➔ Dark Code 해체</h4>
                                            </div>
                                            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                                                Hardware: 분석·전략
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                            <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/80 border border-white/5">
                                                <div className="text-amber-400 font-bold">⚠️ 자동화된 Dark Code 경로:</div>
                                                <p className="text-gray-300"><strong>신념(Dark Code):</strong> “내가 직접 해야 완벽하다.”</p>
                                                <p className="text-gray-300"><strong>Trigger:</strong> 동료나 팀원이 작은 실수를 범함</p>
                                                <p className="text-gray-300"><strong>Story(왜곡):</strong> “저 사람은 근본적으로 무능하다.”</p>
                                                <p className="text-gray-300"><strong>Emotion & Action:</strong> 짜증·불안 ➔ 업무 독점, 비판, 고립</p>
                                            </div>

                                            <div className="space-y-2 p-3.5 rounded-xl bg-gradient-to-br from-slate-950 to-emerald-950/40 border border-emerald-500/30">
                                                <div className="text-emerald-400 font-bold">🎯 명심코칭 3S 개입 솔루션:</div>
                                                <p className="text-gray-200"><strong>SCAN:</strong> “지금 일어난 것은 1건의 실수인가, 아니면 그 사람의 전체 존재가 무능한 것인가?”</p>
                                                <p className="text-gray-200"><strong>SYNC:</strong> “통제하지 않으면 망할 것 같아 불안한 내 오랜 생존 패턴을 인정한다.”</p>
                                                <p className="text-gray-200"><strong>SHIFT:</strong> “직접 빼앗지 않고, 명확한 가이드라인을 제공한 뒤 다시 위임한다.”</p>
                                                <p className="text-amber-300 font-bold pt-1 border-t border-white/10">
                                                    <strong>Meta 결론:</strong> 전략적 능력은 사람을 통제하는 무기가 아니라, <strong>시스템을 세우는 사랑의 도구</strong>다.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 케이스 2: Big Five 신경성 */}
                                {activeAlgorithmTab === 'bigfive' && (
                                    <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-4">
                                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                            <div>
                                                <span className="text-xs font-mono text-cyan-400 font-bold">CASE 2. Big Five</span>
                                                <h4 className="text-base font-black text-white">높은 신경성(부정정서성) ➔ 조기경보 시스템 전환</h4>
                                            </div>
                                            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                                                Trait: 고감도 신경계
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                            <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/80 border border-white/5">
                                                <div className="text-red-400 font-bold">일반 진단의 한계:</div>
                                                <p className="text-gray-300">“당신은 신경증 수치가 높아 감정 기복이 심하고 스트레스에 취약합니다.”</p>
                                                <p className="text-gray-400 text-[11px]">↳ 결함으로 낙인찍혀 스스로를 탓하는 자기전쟁(Self-War) 발생</p>
                                            </div>

                                            <div className="space-y-2 p-3.5 rounded-xl bg-gradient-to-br from-slate-950 to-cyan-950/40 border border-cyan-500/30">
                                                <div className="text-cyan-300 font-bold">명심코칭의 작동 알고리즘 전환:</div>
                                                <p className="text-gray-200"><strong>새로운 정의:</strong> 위험신호에 가장 빠르고 민감하게 반응하는 <strong>'초고감도 안전 센서'</strong></p>
                                                <p className="text-gray-200"><strong>개입:</strong> 심박수가 올라갈 때 몸 감각을 알아차리고(SCAN), 경보 센서에 감사하며(SYNC), 실제 위험과 상상 속 위험을 분리하여 침착하게 대처(SHIFT)</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 케이스 3: 에니어그램 3번 */}
                                {activeAlgorithmTab === 'enneagram' && (
                                    <div className="p-5 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-4">
                                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                            <div>
                                                <span className="text-xs font-mono text-purple-400 font-bold">CASE 3. 에니어그램</span>
                                                <h4 className="text-base font-black text-white">3번 성취자 ➔ 존재 가치와의 동기 관계 변화</h4>
                                            </div>
                                            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                                                Motive: 성취와 인정
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                            <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/80 border border-white/5">
                                                <div className="text-purple-400 font-bold">에니어그램의 설명:</div>
                                                <p className="text-gray-300">성취 욕구 ➔ “성과가 없으면 나는 가치 없다”는 근원적 두려움 ➔ 번아웃</p>
                                                <p className="text-gray-400 text-[11px]">↳ 동기 구조는 짚어주지만 구체적 탈융합 훈련이 부족할 수 있음</p>
                                            </div>

                                            <div className="space-y-2 p-3.5 rounded-xl bg-gradient-to-br from-slate-950 to-purple-950/40 border border-purple-500/30">
                                                <div className="text-purple-300 font-bold">명심코칭의 Zero Point 도달:</div>
                                                <p className="text-gray-200"><strong>SCAN:</strong> “성과를 잃으면 지금 구체적으로 무엇이 무너질 것 같은가?”</p>
                                                <p className="text-gray-200"><strong>SYNC:</strong> “인정받기 위해 쉬지 않고 달려온 이 패턴이 과거의 나를 지키려 애썼음을 안다.”</p>
                                                <p className="text-gray-200"><strong>Zero Point:</strong> 성과라는 역할을 모두 벗어던져도, 그것을 지켜보는 참된 나(Zero Point)의 무조건적 가치를 회복</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ═════════ TAB 3: 평생교육원 16모듈 커리큘럼 ═════════ */}
                    {mainTab === 'curriculum' && (
                        <div className="space-y-6 max-w-5xl mx-auto">
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-amber-950/30 border border-emerald-500/30 flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 font-mono">
                                        ACADEMY MASTER PROGRAM
                                    </span>
                                    <h3 className="text-base sm:text-lg font-black text-white mt-1">
                                        《성격검사 통합과 명심코칭》 정규 16주 마스터 과정
                                    </h3>
                                    <p className="text-xs text-gray-300 mt-0.5">
                                        “어떤 검사 결과를 받았든, 그 결과에 갇히지 않고 자기 삶에 활용하게 해주는 메타코칭 전문가 양성”
                                    </p>
                                </div>
                                <div className="hidden md:flex flex-col items-end">
                                    <span className="text-xs font-bold text-amber-400">총 16개 핵심 모듈</span>
                                    <span className="text-[11px] text-gray-400">자격증 연계 표준 교안</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {CURRICULUM_MODULES.map((mod) => (
                                    <div
                                        key={mod.num}
                                        className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10 hover:border-emerald-500/40 hover:bg-slate-900 transition-all flex items-start gap-3 group"
                                    >
                                        <span className="text-xs font-black font-mono px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                                            M{mod.num}
                                        </span>
                                        <div>
                                            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                                                {mod.title}
                                            </h4>
                                            <p className="text-[11.5px] text-gray-400 mt-1 leading-relaxed">
                                                {mod.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 text-center text-xs text-gray-400">
                                💡 본 교육 과정은 평생교육원 정규 자격과정으로 운영되며, 1:1 맞춤 AI 코칭 챗봇을 통해 모듈별 실습을 수행할 수 있습니다.
                            </div>
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
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
