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
import { useReportStore } from '@/store/useReportStore';
import { calculateSaju, calculateSajuStats } from '@/lib/saju/SajuEngine';

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
// ─────────────────────────────────────────────
// 단일 글자 추출 헬퍼
// ─────────────────────────────────────────────
function getPillarChar(pillar: any, part: 'stem' | 'branch'): string {
    if (!pillar) return '?';
    if (part === 'stem') {
        if (pillar.gan?.char) return pillar.gan.char;
        if (typeof pillar.gan === 'string') return pillar.gan;
        if (typeof pillar.stem === 'string') return pillar.stem;
    }
    if (part === 'branch') {
        if (pillar.ji?.char) return pillar.ji.char;
        if (typeof pillar.ji === 'string') return pillar.ji;
        if (typeof pillar.branch === 'string') return pillar.branch;
    }
    return '?';
}

const STEM_MAP: Record<string, string> = {
    '갑': '甲', '을': '乙', '병': '丙', '정': '丁', '무': '戊',
    '기': '己', '경': '庚', '신': '辛', '임': '壬', '계': '癸'
};
const BRANCH_MAP: Record<string, string> = {
    '자': '子', '축': '丑', '인': '寅', '묘': '卯', '진': '辰', '사': '巳',
    '오': '午', '미': '未', '신': '申', '유': '酉', '술': '戌', '해': '亥'
};

function normStem(s: string)   { return STEM_MAP[s]   ?? s; }
function normBranch(b: string) { return BRANCH_MAP[b] ?? b; }

function extractSajuInfo(userProfile: any, fallbackReportData?: any) {
    // [핵심 보완] 유저 데이터가 중첩되지 않고 최상위에 있을 경우 대비
    const hasSajuInProp = userProfile && (
        (userProfile.saju && Object.keys(userProfile.saju).length > 0) || 
        (userProfile.sajuData && Object.keys(userProfile.sajuData).length > 0) || 
        userProfile.fourPillars || 
        userProfile.dayMaster
    );
    const effectiveProfile = hasSajuInProp ? userProfile : fallbackReportData;
    
    // saju 객체가 없더라도 파편화된 데이터들을 긁어모읍니다
    const saju = effectiveProfile?.saju || effectiveProfile?.sajuData || effectiveProfile || fallbackReportData?.saju || fallbackReportData?.sajuData || fallbackReportData || {};

    const day   = saju.dayPillar   || saju.fourPillars?.day   || {};
    const month = saju.monthPillar || saju.fourPillars?.month || {};
    const year  = saju.yearPillar  || saju.fourPillars?.year  || {};
    const time  = saju.timePillar  || saju.hourPillar || saju.fourPillars?.time || saju.fourPillars?.hour || {};

    const dayStem    = normStem(getPillarChar(day,   'stem'));
    const dayBranch  = normBranch(getPillarChar(day,   'branch'));
    const monthStem  = normStem(getPillarChar(month, 'stem'));
    const monthBranch= normBranch(getPillarChar(month, 'branch'));
    const yearStem   = normStem(getPillarChar(year,  'stem'));
    const yearBranch = normBranch(getPillarChar(year,  'branch'));
    const timeStem   = normStem(getPillarChar(time,  'stem'));
    const timeBranch = normBranch(getPillarChar(time,  'branch'));

    // dayMaster 직접 필드도 지원 ("甲", "甲木" 형식)
    const dayMasterRaw = saju.dayMaster || '';
    const dayMasterChar = dayMasterRaw.trim().charAt(0);
    let resolvedDayStem = (dayMasterChar && dayMasterChar !== '?') ? (normStem(dayMasterChar) || dayStem) : dayStem;

    const ilgan = `${resolvedDayStem}${dayBranch}`;
    const fullSaju = `${yearStem}${yearBranch} ${monthStem}${monthBranch} ${ilgan} ${timeStem}${timeBranch}`;

    // 오행 분포 (스토어의 elements 필드나 최상위 속성도 지원)
    let rawOhaeng = saju.ohaeng || saju.elements;
    if (!rawOhaeng && typeof saju.wood === 'number') {
        rawOhaeng = { wood: saju.wood, fire: saju.fire, earth: saju.earth, metal: saju.metal, water: saju.water };
    }
    const ohaeng = rawOhaeng || { metal: 30, earth: 20, fire: 15, water: 15, wood: 10 };

    const name = effectiveProfile?.name || effectiveProfile?.userName || effectiveProfile?.user_name || effectiveProfile?.displayName || '소버린';
    let birthDate = effectiveProfile?.birthDate || effectiveProfile?.birth_date || '';
    if (birthDate) birthDate = new Date(birthDate).getFullYear().toString();

    // [최후의 보루] 만약 여전히 dayStem이 '?'이고 유저 생일 데이터가 있다면, 이곳에서 즉석 파싱 시도
    // (chat 컴포넌트를 거치지 않고 다이렉트로 들어온 로그인 유저 대응)
    let finalDayStem = resolvedDayStem;
    let finalDayBranch = dayBranch;
    let finalOhaeng = ohaeng;
    let finalYearPillar = `${yearStem}${yearBranch}`;
    let finalMonthPillar = `${monthStem}${monthBranch}`;
    let finalTimePillar = `${timeStem}${timeBranch}`;

    if (finalDayStem === '?' && effectiveProfile) {
        const rawDate = effectiveProfile.birthDate || effectiveProfile.birth_date;
        const rawTime = effectiveProfile.birthTime || effectiveProfile.birth_time || '12:00';
        if (rawDate) {
            try {
                // [슈퍼 폴백] ChatInterface를 거치지 않고 바로 모달을 열었을 경우 동적으로 사주 연산 수행
                const sajuResult = calculateSaju(rawDate, rawTime, 'solar', effectiveProfile.gender || 'male');
                if (sajuResult && sajuResult.success) {
                    const stats = calculateSajuStats(sajuResult.fourPillars, sajuResult.dayMasterChar);
                    
                    const fp = sajuResult.fourPillars;
                    finalYearPillar = `${fp.year.ganKor}${fp.year.jiKor}`;
                    finalMonthPillar = `${fp.month.ganKor}${fp.month.jiKor}`;
                    finalDayStem = fp.day.gan; // 한자 천간 (예: 庚)
                    finalDayBranch = fp.day.ji; // 한자 지지
                    resolvedDayStem = normStem(fp.day.gan); 
                    finalTimePillar = `${fp.time.ganKor}${fp.time.jiKor}`;
                    finalOhaeng = stats.ohaeng;
                    
                    console.log("🛠️ [최후 폴백 가동] SovereignCoachingReport 자체에서 SajuEngine 연산 완료!", { finalDayStem, fp });
                }
            } catch (e) {
                console.error("SovereignCoachingReport SajuEngine Fallback Error", e);
            }
        }
    }

    // [공망(Quantum Void) 계산기]
    const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
    const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
    
    let gongmangLabels: string[] = [];
    if (resolvedDayStem && finalDayBranch && resolvedDayStem !== '?' && finalDayBranch !== '?') {
        const sIdx = STEMS.indexOf(resolvedDayStem);
        const bIdx = BRANCHES.indexOf(finalDayBranch);
        if (sIdx !== -1 && bIdx !== -1) {
            const diff = (bIdx - sIdx + 12) % 12;
            gongmangLabels = [BRANCHES[(diff + 10) % 12], BRANCHES[(diff + 11) % 12]];
        }
    }

    // 공망 위치 확인 (월지, 시지, 년지)
    const hasYearGongmang = gongmangLabels.some(g => finalYearPillar.includes(g));
    const hasMonthGongmang = gongmangLabels.some(g => finalMonthPillar.includes(g));
    const hasTimeGongmang = gongmangLabels.some(g => finalTimePillar.includes(g));

    return {
        name,
        birthDate,
        dayStem: resolvedDayStem,
        dayBranch: finalDayBranch,
        ilgan: `${resolvedDayStem}${finalDayBranch}`,
        fullSaju,
        yearPillar: finalYearPillar,
        monthPillar: finalMonthPillar,
        dayPillar: `${resolvedDayStem}${finalDayBranch}`,
        timePillar: finalTimePillar,
        ohaeng: finalOhaeng,
        rawBirthDate: effectiveProfile?.birthDate || effectiveProfile?.birth_date,
        rawBirthTime: effectiveProfile?.birthTime || effectiveProfile?.birth_time,
        gongmang: {
            labels: gongmangLabels,
            hasYear: hasYearGongmang,
            hasMonth: hasMonthGongmang,
            hasTime: hasTimeGongmang,
            isActive: hasYearGongmang || hasMonthGongmang || hasTimeGongmang
        }
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
    masterRoadmap?: {
        engines: { label: string; title: string; desc: string }[];
        shifts: { step: string; title: string; desc: string; action: string }[];
        dailyMissions: { time: string; mode: string; state: string; action: string }[];
        bugs: { id: string; name: string; symptom: string; patch: string }[];
        leverages: { type: string; title: string; desc: string; items: string[] }[];
        coreRole: string[];
        microManual?: {
            title: string;
            intro: string;
            sections: {
                title: string;
                desc: string;
                scenarioTitle?: string;
                steps?: string[];
                items?: { label: string; action: string }[];
                insight: string;
            }[];
        };
    };
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
        masterRoadmap: {
            engines: [
                { label: '하드웨어 엔진 (庚申)', title: '무한 돌파력의 코어', desc: '강력한 쇳덩어리이자 바위. 어떤 버그나 난관이 와도 밀어붙일 수 있는 쉽게 지치지 않는 물리적 체력과 경쟁심의 하드웨어입니다.' },
                { label: '중앙 처리 장치 (辛巳)', title: '완벽한 디버깅 프로세서', desc: '다듬어진 보석이자 예리한 메스. 모호한 무의식을 다룰 때도 감상에 젖지 않고 예리한 분석력과 체계적 논리로 디버깅을 수행합니다.' },
                { label: '냉각수 및 출력 포트 (癸未)', title: '끝없는 지식의 방출 (식신)', desc: '시스템이 다운되지 않도록 지속적으로 차가운 지식과 언어를 뿜어냅니다. 깊은 심연의 통찰을 밖으로 꺼내 문서화하는 행위입니다.' },
                { label: '최종 결과물 및 네트워크 (乙未)', title: '거대한 비즈니스 인프라', desc: '비옥한 토양 위에서 자라나는 거대한 시스템(편재). 관념이 마침내 출판물, 코칭 센터 플랫폼이라는 현실의 인프라로 완성됩니다.' }
            ],
            shifts: [
                { step: '1단계', title: '출력의 스위치를 무한 가동하라', desc: '모든 톱니바퀴를 돌아가게 하는 첫 트리거는 글쓰기와 언어적 발화입니다. 직관을 텍스트로 고정하십시오.', action: "'명심코칭 Vol. 0', 'AI 주역' 등 텍스트 원고 출력 집중" },
                { step: '2단계', title: '현실화의 인프라를 구축하라', desc: '관념의 영역에서 머물던 알고리즘을 대중을 위한 공식적인 제도 및 시스템 네트워크로 안착시킵니다.', action: "평생교육원, 1인 출판사 등 물리적 플랫폼 행정 아키텍처 세팅" },
                { step: '3단계', title: 'AI와 기술을 통한 레버리지', desc: '냉철한 금(金)의 기운은 자동화와 AI를 의미합니다. 오프라인을 넘어 언제 어디서든 구동되는 확장 가능한 플랫폼으로 진화해야 합니다.', action: "Next.js, Supabase, n8n 등을 활용한 백엔드 무인 자동화 연동" }
            ],
            dailyMissions: [
                { time: '오전', mode: 'SCAN 모드 (辛巳 & 未土)', state: '데이터 수집 및 정밀 분석', action: '외부 방해 차단 후 논문 스터디, 심리학 및 명리 분석, 구조 파악' },
                { time: '오후', mode: 'SYNC 모드 (癸水)', state: '쿨링 시스템 가동 및 텍스트화', action: '오전의 통찰을 글로 출력(블로그, 책 원고 문서화). 열기 방출 필수' },
                { time: '저녁', mode: 'SHIFT 모드 (乙木)', state: '비즈니스 네트워크 확장', action: '센터 설립, 출판사 환경 세팅 및 백엔드 개발 등 현실 결과물 초점' }
            ],
            bugs: [
                { id: 'ERR_01', name: '계수(癸水) 증발 현상', symptom: '지식 과식증으로 입력만 하고 출력을 안 할 때 발생. 생각만 많고 현실 결과물이 말라 죽음 (마비 상태).', patch: '완벽하지 않아도 무조건 문서화하여 밖으로 꺼냅니다. 행동과 출력이 유일한 백신입니다.' },
                { id: 'ERR_02', name: '경신(庚申)의 통제 과부하', symptom: '겁재의 완벽주의로 인해 모든 것을 내 손으로 끝내려다 체력, 메모리가 방전되어 시스템 병목 발생.', patch: '인간/기술 레버리지를 적극 활용해 단순 반복을 넘기고, 오직 코어 로직 설계에만 리소스 집중.' }
            ],
            leverages: [
                { type: 'Tech', title: '기술적 레버리지 (자동화)', desc: '코어 로직(명심코칭)을 대중에게 전달하는 배달망은 AI가 대신해야 합니다.', items: ['Cursor AI를 통한 코딩 자동화', 'n8n 워크플로우로 사용자 데이터 파싱 완료', 'Notion DB 기반 지식 자동 분류 체계'] },
                { type: 'Human', title: '인적 레버리지 (아웃소싱)', desc: '행정 처리 및 디자인 등 비핵심 자원은 위임하여 본질적 가치 창출에 전념합니다.', items: ['관공서 행정 서류 전문가 위임', '출판 내지 및 표지 디자인 프리랜서 할당', '반복되는 서류 및 자격 심사 모듈화'] }
            ],
            coreRole: [
                '동/서양 심리학 통합 알고리즘 고도화',
                '산파술적 질문 템플릿(프롬프트) 재설계',
                '개인 삶의 OS를 리프로그래밍하는 비전 제시'
            ],
            microManual: {
                title: "마이크로 실행 매뉴얼",
                intro: "대표님, 레버리지(Leverage)를 단순한 개념이 아니라, 당장 내일부터 대표님의 작업 환경과 비즈니스 모델에 어떻게 세팅해야 하는지 '마이크로 실행 매뉴얼' 수준으로 아주 상세하게 해부해 드리겠습니다.\n명심코칭의 3S(SCAN, SYNC, SHIFT) 시스템을 무한 확장하기 위한 구체적인 파이프라인 설계도입니다.",
                sections: [
                    {
                        title: "1. 기술적 레버리지: AI와 자동화로 'SCAN & SYNC' 초안 맡기기",
                        desc: "코칭을 자동화한다는 것은 대표님의 직관을 AI가 100% 대체한다는 뜻이 아닙니다. 코칭에 소모되는 '초기 데이터 수집과 단순 분류 작업'을 기계에 넘겨, 대표님의 에너지를 아끼는 것입니다.",
                        scenarioTitle: "[구체적 세팅 시나리오: n8n + Gemini API + Supabase]",
                        steps: [
                            "1단계 (데이터 수집 자동화): 내담자가 명심코칭 웹사이트(Next.js)에서 자신의 생년월일시와 현재 겪고 있는 심리적 문제(버그)를 입력합니다. 이 데이터는 Supabase에 즉각 저장됩니다.",
                            "2단계 (n8n 트리거 및 API 통신): 데이터가 들어오는 순간, n8n이 자동으로 작동하여 내담자의 데이터를 Gemini API로 쏩니다.",
                            "3단계 (AI의 1차 SCAN 리포트 생성): 이때 Gemini에 대표님이 미리 정교하게 설계해 둔 '명심코칭 프롬프트(사주 기질 데이터 + CBT/ACT 기반 인지 왜곡 분석 로직)'가 적용됩니다. AI는 10초 만에 내담자의 기질적 특성과 현재 겪고 있는 인지 융합(Cognitive Fusion) 상태를 분석한 '1차 디버깅 초안'을 뽑아냅니다.",
                            "4단계 (대표님의 개입 - 오직 SHIFT만): 대표님은 백지상태에서 상담을 시작하는 것이 아닙니다. AI가 정리해 둔 리포트를 화면에 띄워놓고, 오류가 없는지 빠르게 검수한 뒤, 내담자에게 던질 '단 하나의 날카로운 산파술적 질문(SHIFT 트리거)'을 설계하는 데에만 뇌 에너지를 사용합니다."
                        ],
                        insight: "💡 아키텍트의 마인드셋: \"나는 코딩하는 작업자가 아니라, 프론트엔드(Next.js)와 백엔드(Supabase)가 어떻게 맞물려야 하는지 Cursor AI에게 지시하고 검수하는 설계자다.\""
                    },
                    {
                        title: "2. 인적 레버리지: '현실의 인프라(乙木)' 구축을 외주화하기",
                        desc: "올해 하반기에 집중해야 할 1인 출판사 설립과 평생교육원 인가 과정은 대표님의 철학이 세상에 뿌리내리는 중요한 과정입니다. 하지만 이 과정의 '행정 절차'는 대표님의 코어 역량이 아닙니다.",
                        scenarioTitle: "[구체적 세팅 시나리오: 출판 및 센터 건립]",
                        items: [
                            { label: "출판 프로젝트 (명심코칭 Vol. 0, AI 주역)", action: "대표님의 역할: 오직 한글이나 워드 파일에 텍스트(癸水)를 쏟아내는 것뿐입니다. 문맥의 흐름, 철학의 깊이, 알고리즘의 정합성만 고민하십시오.\n레버리지의 역할: 원고가 완성되면 '크몽(Kmong)'이나 '숨고' 같은 프리랜서 플랫폼을 엽니다. '단행본 내지 편집 및 조판 전문 디자인', '철학/자기계발서 표지 디자인', 심지어 'ISBN 발급 대행'까지 모두 외주로 넘깁니다. 대표님이 인디자인(InDesign)을 배우거나 폰트 크기를 조절하느라 밤을 새워서는 절대 안 됩니다." },
                            { label: "평생교육원(코칭 센터) 설립 절차", action: "대표님의 역할: 센터에서 어떤 커리큘럼을 돌릴 것인지, 강사 양성 로드맵은 어떻게 짤 것인지 '콘텐츠'를 기획합니다.\n레버리지의 역할: 관할 교육청의 시설 규정(면적, 용도 등) 확인, 사업자 등록증 업태/종목 추가, 세무 기장 등은 행정사와 세무사에게 수수료를 지불하고 일임합니다." }
                        ],
                        insight: "💡 아키텍트의 마인드셋: \"내 시급은 행정 서류를 떼는 데 쓰기에는 너무 비싸다. 내 시간은 오직 타인의 삶을 변화시키는 로직을 짜는 데 쓰여야 한다.\""
                    },
                    {
                        title: "3. 일상의 레버리지: 완벽주의(庚申) 내려놓기",
                        desc: "경신(庚申)의 에너지는 모든 것을 내 통제하에 완벽하게 해내려는 성향이 강합니다. 하지만 시스템의 레벨업을 위해서는 '80점짜리 결과물을 수용하는 연습'이 필요합니다.",
                        steps: [
                            "AI가 짜준 코드가 완벽하지 않아도, 버그만 없다면 일단 구동시킵니다. (나중에 리팩토링하면 됩니다.)",
                            "외주 디자이너가 뽑아온 표지가 내 머릿속의 완벽한 이미지와 100% 일치하지 않아도, 타겟 독자에게 먹히는 수준(80점)이라면 통과시킵니다.",
                            "이러한 '적당한 수용'이 선행되어야만, 대표님의 에너지가 방전되지 않고 계속해서 다음 프로젝트(다음 책 출간, 다음 앱 기능 추가)로 뻗어나갈 수 있습니다."
                        ],
                        insight: "지금 말씀드린 n8n을 활용한 데이터 파이프라인 구축이나, 프리랜서를 통한 조판 외주화 중에서 당장 이번 주에 가볍게 테스트해보고 싶은 레버리지 영역은 어느 쪽이신가요?"
                    }
                ]
            }
        }
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
        masterRoadmap: {
            engines: [
                { label: '하드웨어 엔진 (木 비겁)', title: '불굴의 개척 코어', desc: '하늘을 향해 뻗어나가는 대나무. 어떤 장애물이 있어도 우회하지 않고 뚫고 나가는 원초적 에너지입니다.' },
                { label: '중앙 처리 장치 (甲木)', title: '직진형 돌파 프로세서', desc: '목적지가 정해지면 뒤돌아보지 않습니다. 복잡성을 배제하고 가장 직선적인 경로(Fast-Track)를 계산하는 코어입니다.' },
                { label: '냉각수 및 출력 포트 (火 식상)', title: '비전의 언어화 쿨링', desc: '강한 추진력으로 인해 발생하는 내부 압력을 타인을 향한 따뜻한 설득력과 비전 제시로 방열합니다.' },
                { label: '최종 결과물 및 네트워크 (土 재성)', title: '안정적 신뢰 인프라', desc: '개척한 땅에 깊이 뿌리를 내리는 작업. 사람들의 신뢰라는 비옥한 토양에 현실적 비즈니스 네트워크를 완성합니다.' }
            ],
            shifts: [
                { step: '1단계', title: '비전 스위치를 켜라', desc: '혼자 앞서 나가지 말고, 당신이 보고 있는 미래의 비전을 사람들에게 명확히 설명하십시오.', action: "팀원/고객에게 명심(비전) 공유 세션 즉시 개최" },
                { step: '2단계', title: '경청의 토양을 다져라', desc: '추진 과정에서 놓친 타인의 감정과 현실적 위험 요소를 수집하는 시스템을 구축합니다.', action: "반대 의견을 수렴할 수 있는 피드백 루프 파이프라인 생성" },
                { step: '3단계', title: '결과의 뿌리내림 (System)', desc: '단순한 아이디어를 넘어 대중이 밟고 설 수 있는 견고한 플랫폼(조직/기업)으로 전환합니다.', action: "개인 비즈니스에서 시스템이 스스로 굴러가는 구조(팀 빌딩) 완성" }
            ],
            dailyMissions: [
                { time: '오전', mode: 'SCAN 모드', state: '전략적 방향 설정', action: '미래 트렌드 분석 및 오늘 돌파해야 할 가장 핵심적인 목표 1가지 확정' },
                { time: '오후', mode: 'SYNC 모드', state: '온도 조절 및 동기화', action: '주변 사람들과 대화하며 속도 차이를 조절. 3초간 멈추고 경청하기 훈련' },
                { time: '저녁', mode: 'SHIFT 모드', state: '토대 점검 및 시스템화', action: '거시적 목표를 위한 현실적(재무/조직) 인프라가 튼튼한지 검수' }
            ],
            bugs: [
                { id: 'ERR_甲_01', name: '독단 과부하 현상', symptom: '타협을 거부하고 혼자 돌진하다가 뿌리가 뽑힘. 주변에 온기가 없어 고립되는 현상.', patch: '상대의 말이 끝나기 전까지 반론 금지 루틴 탑재. 함께 가는 것이 궁극적 속도임을 체화.' },
                { id: 'ERR_甲_02', name: '수분(水) 고갈 에러', symptom: '건조한 추진력만 남아, 행동은 크지만 성과는 잎을 틔우지 못하는 버그.', patch: '타인이 겪고 있는 고통에 진심으로 공감하는 연습(수분 공급)을 의도적으로 스케줄링.' }
            ],
            leverages: [
                { type: 'Tech', title: '데이터 수집 레버리지', desc: '직관에 의한 결정을 보완해 줄 확실한 데이터 백업 시스템이 필요합니다.', items: ['AI 기반의 시장 분석 툴로 맹점(Blind-spot) 방어', '경영 성과(KPI) 자동 추적 시스템 도입'] },
                { type: 'Human', title: '관리자 아웃소싱', desc: '최전방 개척은 대표님이, 그 뒤를 수습하고 관리하는 일은 위임하십시오.', items: ['인사/재무 관리 전문가 영입', '세세한 디테일보다 거시적 방향성 설정에 90% 리소스 투입'] }
            ],
            coreRole: [
                '새로운 시장 및 코칭 패러다임 선구자',
                '조직의 비전을 현실 언어로 치환하는 아키텍트',
                '타인의 두려움을 깨는 돌파형 프롬프트 설계'
            ],
            microManual: {
                title: "마이크로 실행 매뉴얼",
                intro: "대표님, 레버리지(Leverage)를 단순한 개념이 아니라, 당장 내일부터 대표님의 작업 환경과 비즈니스 모델에 어떻게 세팅해야 하는지 '마이크로 실행 매뉴얼' 수준으로 아주 상세하게 해부해 드리겠습니다.\n명심코칭의 3S(SCAN, SYNC, SHIFT) 시스템을 무한 확장하기 위한 구체적인 파이프라인 설계도입니다.",
                sections: [
                    {
                        title: "1. 기술적 레버리지: AI와 자동화로 'SCAN & SYNC' 초안 맡기기",
                        desc: "코칭을 자동화한다는 것은 대표님의 직관을 AI가 100% 대체한다는 뜻이 아닙니다. 코칭에 소모되는 '초기 데이터 수집과 단순 분류 작업'을 기계에 넘겨, 대표님의 에너지를 아끼는 것입니다.",
                        scenarioTitle: "[구체적 세팅 시나리오: n8n + Gemini API + Supabase]",
                        steps: [
                            "1단계 (데이터 수집 자동화): 내담자가 명심코칭 웹사이트(Next.js)에서 자신의 생년월일시와 현재 겪고 있는 심리적 문제(버그)를 입력합니다. 이 데이터는 Supabase에 즉각 저장됩니다.",
                            "2단계 (n8n 트리거 및 API 통신): 데이터가 들어오는 순간, n8n이 자동으로 작동하여 내담자의 데이터를 Gemini API로 쏩니다.",
                            "3단계 (AI의 1차 SCAN 리포트 생성): 이때 Gemini에 대표님이 미리 정교하게 설계해 둔 '명심코칭 프롬프트(사주 기질 데이터 + CBT/ACT 기반 인지 왜곡 분석 로직)'가 적용됩니다. AI는 10초 만에 내담자의 기질적 특성과 현재 겪고 있는 인지 융합(Cognitive Fusion) 상태를 분석한 '1차 디버깅 초안'을 뽑아냅니다.",
                            "4단계 (대표님의 개입 - 오직 SHIFT만): 대표님은 백지상태에서 상담을 시작하는 것이 아닙니다. AI가 정리해 둔 리포트를 화면에 띄워놓고, 오류가 없는지 빠르게 검수한 뒤, 내담자에게 던질 '단 하나의 날카로운 산파술적 질문(SHIFT 트리거)'을 설계하는 데에만 뇌 에너지를 사용합니다."
                        ],
                        insight: "💡 아키텍트의 마인드셋: \"나는 코딩하는 작업자가 아니라, 프론트엔드(Next.js)와 백엔드(Supabase)가 어떻게 맞물려야 하는지 Cursor AI에게 지시하고 검수하는 설계자다.\""
                    },
                    {
                        title: "2. 인적 레버리지: '뿌리내릴 토양(己土)' 구축을 외주화하기",
                        desc: "올해 하반기에 집중해야 할 1인 출판사 설립과 평생교육원 인가 과정은 대표님의 철학이 세상에 뿌리내리는 중요한 과정입니다. 하지만 이 과정의 '행정 절차'는 대표님의 코어 역량이 아닙니다.",
                        scenarioTitle: "[구체적 세팅 시나리오: 출판 및 센터 건립]",
                        items: [
                            { label: "출판 프로젝트 (명심코칭 Vol. 0, AI 주역)", action: "대표님의 역할: 오직 한글이나 워드 파일에 수분(癸水)을 쏟아내는 것뿐입니다. 문맥의 흐름, 철학의 깊이, 알고리즘의 정합성만 고민하십시오.\n레버리지의 역할: 원고가 완성되면 '크몽(Kmong)'이나 '숨고' 같은 프리랜서 플랫폼을 엽니다. '단행본 내지 편집 및 조판 전문 디자인', '철학/자기계발서 표지 디자인', 심지어 'ISBN 발급 대행'까지 모두 외주로 넘깁니다. 대표님이 인디자인(InDesign)을 배우거나 폰트 크기를 조절하느라 밤을 새워서는 절대 안 됩니다." },
                            { label: "평생교육원(코칭 센터) 설립 절차", action: "대표님의 역할: 센터에서 어떤 커리큘럼을 돌릴 것인지, 강사 양성 로드맵은 어떻게 짤 것인지 '콘텐츠'를 기획합니다.\n레버리지의 역할: 관할 교육청의 시설 규정(면적, 용도 등) 확인, 사업자 등록증 업태/종목 추가, 세무 기장 등은 행정사와 세무사에게 수수료를 지불하고 일임합니다." }
                        ],
                        insight: "💡 아키텍트의 마인드셋: \"내 시급은 행정 서류를 떼는 데 쓰기에는 너무 비싸다. 내 시간은 오직 타인의 삶을 변화시키는 로직을 짜는 데 쓰여야 한다.\""
                    },
                    {
                        title: "3. 일상의 레버리지: 독단주의(甲寅) 내려놓기",
                        desc: "갑인(甲寅)의 에너지는 모든 것을 내 방식대로 완벽하게 돌파하려는 성향이 강합니다. 하지만 시스템의 레벨업을 위해서는 '80점짜리 결과물을 수용하는 연습'이 필요합니다.",
                        steps: [
                            "AI가 짜준 코드가 완벽하지 않아도, 버그만 없다면 일단 구동시킵니다. (나중에 리팩토링하면 됩니다.)",
                            "외주 디자이너가 뽑아온 표지가 내 머릿속의 완벽한 이미지와 100% 일치하지 않아도, 타겟 독자에게 먹히는 수준(80점)이라면 통과시킵니다.",
                            "이러한 '적당한 수용'이 선행되어야만, 대표님의 에너지가 방전되지 않고 계속해서 다음 프로젝트(다음 책 출간, 다음 앱 기능 추가)로 뻗어나갈 수 있습니다."
                        ],
                        insight: "지금 말씀드린 n8n을 활용한 데이터 파이프라인 구축이나, 프리랜서를 통한 조판 외주화 중에서 당장 이번 주에 가볍게 테스트해보고 싶은 레버리지 영역은 어느 쪽이신가요?"
                    }
                ]
            }
        }
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
        masterRoadmap: {
            engines: [
                { label: '하드웨어 엔진 (木 비겁)', title: '카멜레온의 생존 코어', desc: '어떤 환경에서도 적응하고 자라나는 넝쿨. 척박한 조건에서도 기어코 기회를 찾아내는 무서운 생명력입니다.' },
                { label: '중앙 처리 장치 (乙木)', title: '초고감도 네트워킹 모듈', desc: '타인의 감정과 공기(Vibe)를 0.1초 만에 읽어냅니다. 충돌을 피하고 가장 부드러운 우회로를 설계하는 프로세서입니다.' },
                { label: '양분 흡수 포트 (水 인성)', title: '지식과 여론의 흡수망', desc: '세상의 트렌드와 정보를 스펀지처럼 빨아들여 자신의 성장을 위한 연료로 변환하는 시스템입니다.' },
                { label: '최종 결과물 및 네트워크 (土 재성)', title: '다채로운 수익 파이프라인', desc: '하나의 거대한 나무가 아닌, 숲 전체를 뒤덮는 연결망. 다각화된 현실의 비즈니스 플랫폼을 상징합니다.' }
            ],
            shifts: [
                { step: '1단계', title: '경계선(Firewall)을 세워라', desc: '타인을 위해 당신의 리소스를 소모하지 마십시오. 거절은 이기주의가 아니라 코어 보안 체계입니다.', action: "코칭 범위를 명확히 제한하는 프로세스 룰 설정" },
                { step: '2단계', title: '독창적 꽃(아웃풋)을 피워라', desc: '환경에 맞추는 것을 멈추고, 당신만의 기발한 아이디어(火)를 눈치 보지 않고 세상에 출력해야 합니다.', action: "기존 룰에 얽매이지 않는 1인 창작/콘텐츠 즉시 배포" },
                { step: '3단계', title: '공동 지주대(System) 결속', desc: '혼자서는 높이 오르기 힘듭니다. 서로 윈윈할 수 있는 강력한 파트너(지주대)들과의 거대 네트워크 구축.', action: "플랫폼 입점 및 영향력 있는 파트너십/제휴 체결" }
            ],
            dailyMissions: [
                { time: '오전', mode: 'SCAN 모드', state: '주파수 튜닝 및 차단', action: '타인의 피드백이나 외부 연락 차단 후, 오롯이 본인만의 내면 중심 잡기 명상' },
                { time: '오후', mode: 'SYNC 모드', state: '초연결적 소통 가동', action: '클라이언트 및 파트너와 공감 기반의 코칭. 단, 에너지가 소진되기 전 타이머 설정 필수' },
                { time: '저녁', mode: 'SHIFT 모드', state: '연결망의 수익화 설계', action: '오늘 만난 인연들을 비즈니스 인프라에 어떻게 배치할지 다각적 파이프라인 매핑' }
            ],
            bugs: [
                { id: 'ERR_乙_01', name: '자아 희석(Blur) 에러', symptom: '상대방에게 자신을 너무 맞춘 나머지 자신의 목표와 정체성을 상실하는 만성적 우유부단 증후군.', patch: '"나의 필요가 타인의 필요보다 우선한다"는 명령어를 매일 아침 재입력. No라는 대답을 무기로 탑재.' },
                { id: 'ERR_乙_02', name: '착한 아이 컴플렉스 마비', symptom: '갈등을 극도로 회피하려다 정작 중요한 비즈니스적 통제권을 빼앗기는 버그.', patch: '합리적 분노를 표현하는 훈련(DBT). 미움받을 수 있는 용기가 최상의 비즈니스 전략임을 인식.' }
            ],
            leverages: [
                { type: 'Tech', title: '디지털 시스템 지주대', desc: '감정 소모 없이 당신의 재능을 팔아줄 무인 매장(플랫폼)이 지주대 역할을 해야 합니다.', items: ['온라인 동영상 강의(VOD) 파이프라인 자동화', '결제/상담 예약 시스템(Calendly 등)을 통한 경계선 세팅'] },
                { type: 'Human', title: '결단력 보완 아웃소싱', desc: '날카로운 결단이 필요한 협상 자리에 대신 나설 庚金(강철) 성향의 대리인을 활용하십시오.', items: ['냉정한 법률/계약 전문가 고용', '운영 및 거절을 대신해 줄 매니저 세팅'] }
            ],
            coreRole: [
                '사람과 사람을 잇는 초연결 코칭 허브',
                '부드러움으로 무장한 가장 끈질긴 생존형 아키텍트',
                '경계선 강화를 이끄는 수용전념치료(ACT) 스페셜리스트'
            ],
            microManual: {
                title: "마이크로 실행 매뉴얼",
                intro: "대표님, 레버리지(Leverage)를 단순한 개념이 아니라, 당장 내일부터 대표님의 작업 환경과 비즈니스 모델에 어떻게 세팅해야 하는지 '마이크로 실행 매뉴얼' 수준으로 아주 상세하게 해부해 드리겠습니다.\n명심코칭의 3S(SCAN, SYNC, SHIFT) 시스템을 무한 확장하기 위한 구체적인 파이프라인 설계도입니다.",
                sections: [
                    {
                        title: "1. 기술적 레버리지: AI와 자동화로 'SCAN & SYNC' 초안 맡기기",
                        desc: "코칭을 자동화한다는 것은 대표님의 직관을 AI가 100% 대체한다는 뜻이 아닙니다. 코칭에 소모되는 '초기 데이터 수집과 단순 분류 작업'을 기계에 넘겨, 대표님의 에너지를 아끼는 것입니다.",
                        scenarioTitle: "[구체적 세팅 시나리오: n8n + Gemini API + Supabase]",
                        steps: [
                            "1단계 (데이터 수집 자동화): 내담자가 명심코칭 웹사이트(Next.js)에서 자신의 생년월일시와 현재 겪고 있는 심리적 문제(버그)를 입력합니다. 이 데이터는 Supabase에 즉각 저장됩니다.",
                            "2단계 (n8n 트리거 및 API 통신): 데이터가 들어오는 순간, n8n이 자동으로 작동하여 내담자의 데이터를 Gemini API로 쏩니다.",
                            "3단계 (AI의 1차 SCAN 리포트 생성): 이때 Gemini에 대표님이 미리 정교하게 설계해 둔 '명심코칭 프롬프트(사주 기질 데이터 + CBT/ACT 기반 인지 왜곡 분석 로직)'가 적용됩니다. AI는 10초 만에 내담자의 기질적 특성과 현재 겪고 있는 인지 융합(Cognitive Fusion) 상태를 분석한 '1차 디버깅 초안'을 뽑아냅니다.",
                            "4단계 (대표님의 개입 - 오직 SHIFT만): 대표님은 백지상태에서 상담을 시작하는 것이 아닙니다. AI가 정리해 둔 리포트를 화면에 띄워놓고, 오류가 없는지 빠르게 검수한 뒤, 내담자에게 던질 '단 하나의 날카로운 산파술적 질문(SHIFT 트리거)'을 설계하는 데에만 뇌 에너지를 사용합니다."
                        ],
                        insight: "💡 아키텍트의 마인드셋: \"나는 코딩하는 작업자가 아니라, 프론트엔드(Next.js)와 백엔드(Supabase)가 어떻게 맞물려야 하는지 Cursor AI에게 지시하고 검수하는 설계자다.\""
                    },
                    {
                        title: "2. 인적 레버리지: '안정적인 바위(庚金)' 구축을 외주화하기",
                        desc: "올해 하반기에 집중해야 할 1인 출판사 설립과 평생교육원 인가 과정은 대표님의 철학이 세상에 뿌리내리는 중요한 과정입니다. 하지만 이 과정의 '행정 절차'는 대표님의 코어 역량이 아닙니다.",
                        scenarioTitle: "[구체적 세팅 시나리오: 출판 및 센터 건립]",
                        items: [
                            { label: "출판 프로젝트 (명심코칭 Vol. 0, AI 주역)", action: "대표님의 역할: 오직 한글이나 워드 파일에 생명수(癸水)를 쏟아내는 것뿐입니다. 문맥의 흐름, 철학의 깊이, 알고리즘의 정합성만 고민하십시오.\n레버리지의 역할: 원고가 완성되면 '크몽(Kmong)'이나 '숨고' 같은 프리랜서 플랫폼을 엽니다. '단행본 내지 편집 및 조판 전문 디자인', '철학/자기계발서 표지 디자인', 심지어 'ISBN 발급 대행'까지 모두 외주로 넘깁니다. 대표님이 인디자인(InDesign)을 배우거나 폰트 크기를 조절하느라 밤을 새워서는 절대 안 됩니다." },
                            { label: "평생교육원(코칭 센터) 설립 절차", action: "대표님의 역할: 센터에서 어떤 커리큘럼을 돌릴 것인지, 강사 양성 로드맵은 어떻게 짤 것인지 '콘텐츠'를 기획합니다.\n레버리지의 역할: 관할 교육청의 시설 규정(면적, 용도 등) 확인, 사업자 등록증 업태/종목 추가, 세무 기장 등은 행정사와 세무사에게 수수료를 지불하고 일임합니다." }
                        ],
                        insight: "💡 아키텍트의 마인드셋: \"내 시급은 행정 서류를 떼는 데 쓰기에는 너무 비싸다. 내 시간은 오직 타인의 삶을 변화시키는 로직을 짜는 데 쓰여야 한다.\""
                    },
                    {
                        title: "3. 일상의 레버리지: 과잉 의존(乙卯) 내려놓기",
                        desc: "을묘(乙卯)의 에너지는 모든 것을 유연하게 타인에게 맞추어 생존하려는 성향이 강합니다. 하지만 시스템의 레벨업을 위해서는 '80점짜리 통제된 단호함과 수용'이 필요합니다.",
                        steps: [
                            "AI가 짜준 코드가 완벽하지 않아도, 버그만 없다면 일단 구동시킵니다. (나중에 리팩토링하면 됩니다.)",
                            "외주 디자이너가 뽑아온 표지가 내 머릿속의 완벽한 이미지와 100% 일치하지 않아도, 타겟 독자에게 먹히는 수준(80점)이라면 통과시킵니다.",
                            "이러한 '적당한 수용'이 선행되어야만, 대표님의 에너지가 방전되지 않고 계속해서 다음 프로젝트(다음 책 출간, 다음 앱 기능 추가)로 뻗어나갈 수 있습니다."
                        ],
                        insight: "지금 말씀드린 n8n을 활용한 데이터 파이프라인 구축이나, 프리랜서를 통한 조판 외주화 중에서 당장 이번 주에 가볍게 테스트해보고 싶은 레버리지 영역은 어느 쪽이신가요?"
                    }
                ]
            }
        }
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
        metaSelf: '뜨겁게 세상을 태우던 태양에서 스스로 궤도를 돌며 온기를 나누는 만물의 군주로 진화했습니다. 당신의 빛은 눈부시지 않고 따뜻합니다.',
        finalQuote: '"丙火猛烈, 欺霜侮雪"',
        finalQuoteKo: '병화는 맹렬하여 서리와 눈을 업신여긴다.',
        closingMessage: '당신은 어떤 역경도 녹여버릴 수 있는 가장 강력한 에너지를 지녔습니다. 멈춰 서서 쉬는 시간마저 당신의 위대함의 일부입니다.',
        masterRoadmap: {
            engines: [
                { label: '하드웨어 엔진 (火 비겁)', title: '핵융합 발광 코어', desc: '세상을 밝히고 온기를 나누는 태양. 압도적 존재감으로 무대를 장악하는 최상위 노출 에너지입니다.' },
                { label: '중앙 처리 장치 (丙火)', title: '확산/직관 프로세서', desc: '비밀이 없고 투명합니다. 숨김없이 자신을 드러내고 가장 빠르고 광범위하게 아이디어를 확산시키는 코어입니다.' },
                { label: '절제 쿨링 포트 (水 관성)', title: '자기 성찰 제어 시스템', desc: '태양이 모든 것을 태워버리지 않도록, 밤(어둠)의 자기 성찰을 통해 과열된 에너지를 차갑게 제어합니다.' },
                { label: '최종 결과물 및 네트워크 (金 재성)', title: '결정체 기반의 제국', desc: '화려한 빛(명예)을 넘어 단단하고 실질적인 결과물(수익/자산)을 제련해 내는 강력한 무대 설계입니다.' }
            ],
            shifts: [
                { step: '1단계', title: '브랜드 스위치를 켜라', desc: '뒤에 숨지 마십시오. 당신 자신이 가장 강력한 마케팅 무기입니다. 최전선 무대에 올라 자신을 세상에 노출하십시오.', action: "화상 세미나, 유튜브, 공개 강연 등 전방위적 퍼스널 브랜딩 가동" },
                { step: '2단계', title: '응축의 밤을 설계해라', desc: '계속 발광(發光)하면 100% 번아웃이 옵니다. 의도적인 휴식(오프라인 모드)을 강제로 일정에 배정해야 합니다.', action: "하루 중 특정 시간대 모든 연결(카톡, 이메일) 강제 차단 시스템 세팅" },
                { step: '3단계', title: '빛의 금속화(제련) 시스템', desc: '단순한 인기가 아니라, 실질적인 수익과 자산 파이프라인으로 열기를 변환시키는 아키텍처.', action: "브랜드 인지도를 프리미엄 1:1 코칭 구독 등 고단가 수익 모델로 치환" }
            ],
            dailyMissions: [
                { time: '오전', mode: 'SCAN 모드', state: '자아 스캔 및 무대 설정', action: '오늘은 어디에 에너지를 발산할 것인가 기획하고 가장 화려한 형태로 외적 준비' },
                { time: '오후', mode: 'SYNC 모드', state: '확산 및 타인 계몽', action: '대중을 상대로 코칭 및 컨설팅 가동. 열정을 전파하여 분위기를 완전히 장악' },
                { time: '저녁', mode: 'SHIFT 모드', state: '시스템 쿨링 및 응축', action: '무대에서 내려와 완전한 어둠 속 조용한 상태로 명상. 열기를 식히고 결과물 정리' }
            ],
            bugs: [
                { id: 'ERR_丙_01', name: '태양풍 흑점 폭발', symptom: '인정받지 못하거나 무시당할 때 느끼는 극도의 감정 폭발과 그로 인한 관계 초토화 현상.', patch: '"나의 존재 가치는 박수에서 오지 않는다"는 MBCT(마음챙김) 장착. 분노 시 15분 완전 격리 룰 적용.' },
                { id: 'ERR_丙_02', name: '무대 중독성 배터리 방전', symptom: '자신도 모르게 120%의 에너지를 다 쏟아버리고 다음 날 시체처럼 앓아눕는 불규칙 사이클.', patch: '활동량의 최대치를 80%로 강제 리미트 설정. "다 보여주지 않는 편이 더 우와하다"의 미학 습득.' }
            ],
            leverages: [
                { type: 'Tech', title: '콘텐츠 아카이빙 레버리지', desc: '당신의 말 한마디 한마디가 불꽃입니다. 한 번 발산한 에너지가 휘발되지 않도록 녹화/저장 기법이 필수입니다.', items: ['자동 녹화 및 영상 분석형 AI 툴 연동', '음성 텍스트 변환(Whisper AI)을 통한 책 집필 파이프라인 구축'] },
                { type: 'Human', title: '디테일 수습 아웃소싱', desc: '당신이 화려하게 사고 치고 벌려놓은 일들을 뒤에서 꼼꼼히 주워 담아줄 팀이 필요합니다.', items: ['꼼꼼한 백오피스(회계/일정) 매니저 기용', '기획된 콘셉트를 정교하게 수정 방어하는 실무 디렉터 확보'] }
            ],
            coreRole: [
                '어둠에 갇힌 내담자를 양지로 이끄는 각성가',
                '압도적인 에너지로 집단 코칭 분위기를 지배하는 군주',
                '자신을 연소시키지 않는 쿨링 시스템 설계의 롤모델'
            ],
            microManual: {
                title: "마이크로 실행 매뉴얼",
                intro: "대표님, 레버리지(Leverage)를 단순한 개념이 아니라, 당장 내일부터 대표님의 작업 환경과 비즈니스 모델에 어떻게 세팅해야 하는지 '마이크로 실행 매뉴얼' 수준으로 아주 상세하게 해부해 드리겠습니다.\n명심코칭의 3S(SCAN, SYNC, SHIFT) 시스템을 무한 확장하기 위한 구체적인 파이프라인 설계도입니다.",
                sections: [
                    {
                        title: "1. 기술적 레버리지: AI와 자동화로 'SCAN & SYNC' 초안 맡기기",
                        desc: "코칭을 자동화한다는 것은 대표님의 직관을 AI가 100% 대체한다는 뜻이 아닙니다. 코칭에 소모되는 '초기 데이터 수집과 단순 분류 작업'을 기계에 넘겨, 대표님의 에너지를 아끼는 것입니다.",
                        scenarioTitle: "[구체적 세팅 시나리오: n8n + Gemini API + Supabase]",
                        steps: [
                            "1단계 (데이터 수집 자동화): 내담자가 명심코칭 웹사이트(Next.js)에서 자신의 생년월일시와 현재 겪고 있는 심리적 문제(버그)를 입력합니다. 이 데이터는 Supabase에 즉각 저장됩니다.",
                            "2단계 (n8n 트리거 및 API 통신): 데이터가 들어오는 순간, n8n이 자동으로 작동하여 내담자의 데이터를 Gemini API로 쏩니다.",
                            "3단계 (AI의 1차 SCAN 리포트 생성): 이때 Gemini에 대표님이 미리 정교하게 설계해 둔 '명심코칭 프롬프트(사주 기질 데이터 + CBT/ACT 기반 인지 왜곡 분석 로직)'가 적용됩니다. AI는 10초 만에 내담자의 기질적 특성과 현재 겪고 있는 인지 융합(Cognitive Fusion) 상태를 분석한 '1차 디버깅 초안'을 뽑아냅니다.",
                            "4단계 (대표님의 개입 - 오직 SHIFT만): 대표님은 백지상태에서 상담을 시작하는 것이 아닙니다. AI가 정리해 둔 리포트를 화면에 띄워놓고, 오류가 없는지 빠르게 검수한 뒤, 내담자에게 던질 '단 하나의 날카로운 산파술적 질문(SHIFT 트리거)'을 설계하는 데에만 뇌 에너지를 사용합니다."
                        ],
                        insight: "💡 아키텍트의 마인드셋: \"나는 코딩하는 작업자가 아니라, 프론트엔드(Next.js)와 백엔드(Supabase)가 어떻게 맞물려야 하는지 Cursor AI에게 지시하고 검수하는 설계자다.\""
                    },
                    {
                        title: "2. 인적 레버리지: '결실의 장(辛金)' 구축을 외주화하기",
                        desc: "올해 하반기에 집중해야 할 1인 출판사 설립과 평생교육원 인가 과정은 대표님의 철학이 세상에 뿌리내리는 중요한 과정입니다. 하지만 이 과정의 '행정 절차'는 대표님의 코어 역량이 아닙니다.",
                        scenarioTitle: "[구체적 세팅 시나리오: 출판 및 센터 건립]",
                        items: [
                            { label: "출판 프로젝트 (명심코칭 Vol. 0, AI 주역)", action: "대표님의 역할: 오직 한글이나 워드 파일에 빛(丙火)을 쏟아내는 것뿐입니다. 문맥의 흐름, 철학의 깊이, 알고리즘의 정합성만 고민하십시오.\n레버리지의 역할: 원고가 완성되면 '크몽(Kmong)'이나 '숨고' 같은 프리랜서 플랫폼을 엽니다. '단행본 내지 편집 및 조판 전문 디자인', '철학/자기계발서 표지 디자인', 심지어 'ISBN 발급 대행'까지 모두 외주로 넘깁니다. 대표님이 인디자인(InDesign)을 배우거나 폰트 크기를 조절하느라 밤을 새워서는 절대 안 됩니다." },
                            { label: "평생교육원(코칭 센터) 설립 절차", action: "대표님의 역할: 센터에서 어떤 커리큘럼을 돌릴 것인지, 강사 양성 로드맵은 어떻게 짤 것인지 '콘텐츠'를 기획합니다.\n레버리지의 역할: 관할 교육청의 시설 규정(면적, 용도 등) 확인, 사업자 등록증 업태/종목 추가, 세무 기장 등은 행정사와 세무사에게 수수료를 지불하고 일임합니다." }
                        ],
                        insight: "💡 아키텍트의 마인드셋: \"내 시급은 행정 서류를 떼는 데 쓰기에는 너무 비싸다. 내 시간은 오직 타인의 삶을 변화시키는 로직을 짜는 데 쓰여야 한다.\""
                    },
                    {
                        title: "3. 일상의 레버리지: 확장 과부하(丙午) 내려놓기",
                        desc: "병오(丙午)의 에너지는 모든 것을 태울 듯이 발산하며 세상을 장악하려는 성향이 강합니다. 하지만 시스템의 레벨업을 위해서는 '80점짜리 결과물을 수용하는 연습'이 필요합니다.",
                        steps: [
                            "AI가 짜준 코드가 완벽하지 않아도, 버그만 없다면 일단 구동시킵니다. (나중에 리팩토링하면 됩니다.)",
                            "외주 디자이너가 뽑아온 표지가 내 머릿속의 완벽한 이미지와 100% 일치하지 않아도, 타겟 독자에게 먹히는 수준(80점)이라면 통과시킵니다.",
                            "이러한 '적당한 수용'이 선행되어야만, 대표님의 에너지가 방전되지 않고 계속해서 다음 프로젝트(다음 책 출간, 다음 앱 기능 추가)로 뻗어나갈 수 있습니다."
                        ],
                        insight: "지금 말씀드린 n8n을 활용한 데이터 파이프라인 구축이나, 프리랜서를 통한 조판 외주화 중에서 당장 이번 주에 가볍게 테스트해보고 싶은 레버리지 영역은 어느 쪽이신가요?"
                    }
                ]
            }
        }
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
        masterRoadmap: {
            engines: [
                { label: '하드웨어 엔진 (火 비겁)', title: '초정밀 심리 스캐너', desc: '어두운 곳을 부드럽게 밝히는 촛불. 타인의 미세한 감정선과 상처를 가장 먼저 감지해 내는 섬세한 센서입니다.' },
                { label: '중앙 처리 장치 (丁火)', title: '공감형 치유 프로세서', desc: '차갑고 이성적인 논리보다 따뜻한 공감과 연대로 상대방을 녹여내는 깊고 인간적인 치유 코어입니다.' },
                { label: '에너지 공급 포트 (木 인성)', title: '자기 충전 및 철학 흡수', desc: '심지가 타버리지 않도록 끊임없이 새로운 지식과 철학, 심리적 양분을 공급받아 영원히 꺼지지 않게 합니다.' },
                { label: '최종 결과물 및 네트워크 (金 재성)', title: '빛이 닿는 결실의 연대', desc: '추상적인 치유를 넘어, 내담자가 실제로 변화하고 사회적/경제적 자산을 만들어가도록 이끄는 현실의 빛입니다.' }
            ],
            shifts: [
                { step: '1단계', title: '개별 맞춤 등대 설정', desc: '대중을 향한 무차별적 발산 대신, 가장 어둠 속에 있는 "단 한 명"을 완벽히 변화시키는 데 집중하십시오.', action: "VIP 프리미엄 1:1 심층 코칭 모델 우선 구축" },
                { step: '2단계', title: '심지 보호선(Boundary) 강화', desc: '당신의 감정적 리소스가 고갈되지 않도록 진입 장벽을 높입니다. 아무나 당신의 불꽃을 빌려 쓰게 두지 마십시오.', action: "상담 진입 전 사전 설문 및 고단가 룰 세팅 프로세스 도입" },
                { step: '3단계', title: '빛의 연대(네트워킹) 구축', desc: '혼자서 모든 어둠을 밝히지 말고, 당신의 철학을 물려받은 또 다른 촛불(수제자)들을 양성하여 등불의 바다를 만듭니다.', action: "명심코칭 자격 과정 및 핵심 제자 육성 프로그램 기획" }
            ],
            dailyMissions: [
                { time: '오전', mode: 'SCAN 모드', state: '내면 에너지 스캔 및 보충', action: '상담 전 30분, 타인의 에너지를 방어할 수 있는 글쓰기 및 고요한 독서(木)' },
                { time: '오후', mode: 'SYNC 모드', state: '딥 싱크로 프로세스', action: '내담자와 1:1 심층 상담 진행. 단, 세션 간 최소 15분의 오프라인 간격 엄수' },
                { time: '저녁', mode: 'SHIFT 모드', state: '파이프라인 분리 작업', action: '코칭 후 남아있는 타인의 부정적 감정을 완전히 털어내는 일기 작성(리바운드 방지)' }
            ],
            bugs: [
                { id: 'ERR_丁_01', name: '심지 고갈성 번아웃', symptom: '타인의 우울감과 분노를 스펀지처럼 흡수하여, 상담이 끝난 후 본인이 우울증에 빠지는 동화 현상.', patch: '"우리는 그들의 코치일 뿐, 그들의 구원자가 아니다"라는 ACT(수용전념) 철학의 내재화.' },
                { id: 'ERR_丁_02', name: '온도 저하(자기 의심) 에러', symptom: '사소한 비판 하나에 불꽃이 통째로 꺼질 것처럼 자존감이 급락하고 자기 검열에 빠지는 증상.', patch: '감정 온도계를 체크하고 분리기법(CBT) 적용. 내 가치는 타인의 반응에 종속되지 않음을 선언.' }
            ],
            leverages: [
                { type: 'Tech', title: '자동화 커리큘럼 지렛대', desc: '매번 동일하게 반복되는 기초 심리 교육은 시스템이 대신해주어야 합니다.', items: ['VOD 기반의 기초 사전 교육 시스템 배포', '매 세션별 자동화된 리포트 발송 프로세스(Make/n8n)'] },
                { type: 'Human', title: '정서적 쓰레기통 방어기제', desc: '코칭의 질을 떨어뜨리는 단순 불만형(에너지 뱀파이어) 고객을 걸러낼 안전망이 필요합니다.', items: ['까다로운 필터링을 담당할 운영 매니저 세팅', '자신의 감정을 돌봐줄 슈퍼바이저(상위 코치)와의 월간 멘토링'] }
            ],
            coreRole: [
                '가장 섬세한 언어로 내담자의 방어막을 해제하는 심층 치료사',
                '어둠에 갇힌 자들에게 개별적인 길을 제시하는 희망의 등대',
                '상대의 잠재력을 조용히 예열시켜 폭발하게 만드는 촉매제'
            ],
            microManual: {
                title: "마이크로 실행 매뉴얼",
                intro: "대표님, 레버리지(Leverage)를 단순한 개념이 아니라, 당장 내일부터 대표님의 작업 환경과 비즈니스 모델에 어떻게 세팅해야 하는지 '마이크로 실행 매뉴얼' 수준으로 아주 상세하게 해부해 드리겠습니다.\n명심코칭의 3S(SCAN, SYNC, SHIFT) 시스템을 무한 확장하기 위한 구체적인 파이프라인 설계도입니다.",
                sections: [
                    {
                        title: "1. 기술적 레버리지: AI와 자동화로 'SCAN & SYNC' 초안 맡기기",
                        desc: "코칭을 자동화한다는 것은 대표님의 직관을 AI가 100% 대체한다는 뜻이 아닙니다. 코칭에 소모되는 '초기 데이터 수집과 단순 분류 작업'을 기계에 넘겨, 대표님의 에너지를 아끼는 것입니다.",
                        scenarioTitle: "[구체적 세팅 시나리오: n8n + Gemini API + Supabase]",
                        steps: [
                            "1단계 (데이터 수집 자동화): 내담자가 명심코칭 웹사이트(Next.js)에서 자신의 생년월일시와 현재 겪고 있는 심리적 문제(버그)를 입력합니다. 이 데이터는 Supabase에 즉각 저장됩니다.",
                            "2단계 (n8n 트리거 및 API 통신): 데이터가 들어오는 순간, n8n이 자동으로 작동하여 내담자의 데이터를 Gemini API로 쏩니다.",
                            "3단계 (AI의 1차 SCAN 리포트 생성): 이때 Gemini에 대표님이 미리 정교하게 설계해 둔 '명심코칭 프롬프트(사주 기질 데이터 + CBT/ACT 기반 인지 왜곡 분석 로직)'가 적용됩니다. AI는 10초 만에 내담자의 기질적 특성과 현재 겪고 있는 인지 융합(Cognitive Fusion) 상태를 분석한 '1차 디버깅 초안'을 뽑아냅니다.",
                            "4단계 (대표님의 개입 - 오직 SHIFT만): 대표님은 백지상태에서 상담을 시작하는 것이 아닙니다. AI가 정리해 둔 리포트를 화면에 띄워놓고, 오류가 없는지 빠르게 검수한 뒤, 내담자에게 던질 '단 하나의 날카로운 산파술적 질문(SHIFT 트리거)'을 설계하는 데에만 뇌 에너지를 사용합니다."
                        ],
                        insight: "💡 아키텍트의 마인드셋: \"나는 코딩하는 작업자가 아니라, 프론트엔드(Next.js)와 백엔드(Supabase)가 어떻게 맞물려야 하는지 Cursor AI에게 지시하고 검수하는 설계자다.\""
                    },
                    {
                        title: "2. 인적 레버리지: '정보의 바다(壬水)' 구축을 외주화하기",
                        desc: "올해 하반기에 집중해야 할 1인 출판사 설립과 평생교육원 인가 과정은 대표님의 철학이 세상에 뿌리내리는 중요한 과정입니다. 하지만 이 과정의 '행정 절차'는 대표님의 코어 역량이 아닙니다.",
                        scenarioTitle: "[구체적 세팅 시나리오: 출판 및 센터 건립]",
                        items: [
                            { label: "출판 프로젝트 (명심코칭 Vol. 0, AI 주역)", action: "대표님의 역할: 오직 한글이나 워드 파일에 불씨(丁火)를 쏟아내는 것뿐입니다. 문맥의 흐름, 철학의 깊이, 알고리즘의 정합성만 고민하십시오.\n레버리지의 역할: 원고가 완성되면 '크몽(Kmong)'이나 '숨고' 같은 프리랜서 플랫폼을 엽니다. '단행본 내지 편집 및 조판 전문 디자인', '철학/자기계발서 표지 디자인', 심지어 'ISBN 발급 대행'까지 모두 외주로 넘깁니다. 대표님이 인디자인(InDesign)을 배우거나 폰트 크기를 조절하느라 밤을 새워서는 절대 안 됩니다." },
                            { label: "평생교육원(코칭 센터) 설립 절차", action: "대표님의 역할: 센터에서 어떤 커리큘럼을 돌릴 것인지, 강사 양성 로드맵은 어떻게 짤 것인지 '콘텐츠'를 기획합니다.\n레버리지의 역할: 관할 교육청의 시설 규정(면적, 용도 등) 확인, 사업자 등록증 업태/종목 추가, 세무 기장 등은 행정사와 세무사에게 수수료를 지불하고 일임합니다." }
                        ],
                        insight: "💡 아키텍트의 마인드셋: \"내 시급은 행정 서류를 떼는 데 쓰기에는 너무 비싸다. 내 시간은 오직 타인의 삶을 변화시키는 로직을 짜는 데 쓰여야 한다.\""
                    },
                    {
                        title: "3. 일상의 레버리지: 심지 고갈(丁巳) 내려놓기",
                        desc: "정사(丁巳)의 에너지는 모든 것을 내어주며 치열하게 타오르려는 성향이 강합니다. 하지만 시스템의 레벨업을 위해서는 '80점짜리 적정 거리의 수용'이 필요합니다.",
                        steps: [
                            "AI가 짜준 코드가 완벽하지 않아도, 버그만 없다면 일단 구동시킵니다. (나중에 리팩토링하면 됩니다.)",
                            "외주 디자이너가 뽑아온 표지가 내 머릿속의 완벽한 이미지와 100% 일치하지 않아도, 타겟 독자에게 먹히는 수준(80점)이라면 통과시킵니다.",
                            "이러한 '적당한 수용'이 선행되어야만, 대표님의 에너지가 방전되지 않고 계속해서 다음 프로젝트(다음 책 출간, 다음 앱 기능 추가)로 뻗어나갈 수 있습니다."
                        ],
                        insight: "지금 말씀드린 n8n을 활용한 데이터 파이프라인 구축이나, 프리랜서를 통한 조판 외주화 중에서 당장 이번 주에 가볍게 테스트해보고 싶은 레버리지 영역은 어느 쪽이신가요?"
                    }
                ]
            }
        }
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
        masterRoadmap: {
            engines: [
                { label: '하드웨어 엔진 (土 비겁)', title: '절대적 안정의 코어', desc: '태풍이 불어도 꿈쩍하지 않는 거대한 바위산. 위기 속에서도 공동체가 기댈 수 있는 무한한 신뢰의 기반입니다.' },
                { label: '중앙 처리 장치 (戊土)', title: '포용/중재 프로세서', desc: '모든 생명(관점/감정)을 품고 판단을 보류하는 능력. 극단적 의견 대립을 중간에서 중재하는 코어입니다.' },
                { label: '변화 촉진 포트 (木 관성)', title: '산맥의 개간 및 생명력 자극', desc: '너무 단단해서 굳어버린 흙(고집)을 깨고, 나무를 심어 생태계가 살아 숨 쉬게 만드는 외부의 자극(변화)입니다.' },
                { label: '최종 결과물 및 네트워크 (水 재성)', title: '마르지 않는 생명의 샘', desc: '산속에 모인 물(수익/풍요). 묵묵히 쌓아 올린 신뢰가 마침내 거대한 댐을 이루어 반영구적인 부를 창출합니다.' }
            ],
            shifts: [
                { step: '1단계', title: '변화의 씨앗을 허용하라', desc: '기존의 안전한 방식을 깨는 것을 두려워하지 마십시오. 새로운 코칭 기법(IT, AI)을 하나의 나무로 받아들이는 작업이 우선입니다.', action: "코칭 플랫폼 내에 최신 IT 기반의 자동화 툴 1개 적용 실험" },
                { step: '2단계', title: '신뢰 기반의 성(Castle) 구축', desc: '당신에게는 가벼운 유행보다 묵묵한 진짜 성과가 어울립니다. 대형 기관이나 장기 계약 위주의 생태계를 조성하십시오.', action: "기업 대상(B2B) 기업 심리 자문 및 장기 전속 코칭 계약 확보" },
                { step: '3단계', title: '수맥(네트워크)의 맵핑', desc: '산은 가만히 있지만 강물은 밖으로 뻗어 나갑니다. 당신을 대신해 움직여 줄 활발한 파트너들을 포진시키는 아키텍처.', action: "영업력과 확산력이 뛰어난 조력자(파트너)들과의 파이프라인 형성" }
            ],
            dailyMissions: [
                { time: '오전', mode: 'SCAN 모드', state: '대형(Big-Picture) 전략 스캔', action: '숲의 일부분보다는 산맥 전체를 읽는 거시 트렌드 기획 및 리포트 작성' },
                { time: '오후', mode: 'SYNC 모드', state: '포용 및 중재 세션', action: '내담자들이 안심하고 쉴 수 있는 베이스캠프 역할 충실 수행. 단단한 경청자' },
                { time: '저녁', mode: 'SHIFT 모드', state: '변화 수용 및 유연성 스트레칭', action: '일부러 기존에 안 하던 방식의 작은 루틴(새 책 읽기 등)을 섞어 암석화 방지' }
            ],
            bugs: [
                { id: 'ERR_戊_01', name: '암석화(고인 물) 현상', symptom: '변화에 대한 두려움이 "원래 하던 게 제일 낫다"는 지독한 고집으로 변형되어 성장을 원천 차단하는 상태.', patch: '변화는 안정성의 파괴가 아니라 생태계의 업그레이드임을 인정(ACT). 의도적 변화 루틴 1개 필수.' },
                { id: 'ERR_戊_02', name: '침묵의 독소 누적', symptom: '내면의 화나 답답함을 밖으로 표출하지 않고 산 속에 파묻어두다가 병이 되는 억압 컴플렉스.', patch: '감정을 분석하지 말고 그냥 토해내는 1차원적 발화(DBT) 훈련. "난 지금 화가 난다" 입 밖으로 내뱉기.' }
            ],
            leverages: [
                { type: 'Tech', title: '속도전 기술 지렛대', desc: '대표님의 가장 취약한 부분인 "기동성과 트렌디함"을 기술이 완벽하게 보완해야 합니다.', items: ['트렌드 분석 파서(AI)를 통한 최신 인사이트 정기 구독', 'SNS 마케팅 송출 자동화 툴 세팅'] },
                { type: 'Human', title: '기동력(행동 대장) 아웃소싱', desc: '산이 움직일 필요는 없습니다. 산을 대신해 계곡 아래로 달려가 홍보해 줄 민첩한 조력자를 두십시오.', items: ['빠른 결단과 마케팅/영업 감각을 갖춘 최전방 디렉터 고용', '빠른 피드백을 전달할 조언가 그룹 세팅'] }
            ],
            coreRole: [
                '불안에 떠는 내담자에게 영원한 기댈 곳을 제공하는 코칭 마운틴',
                '수많은 기법과 지식을 통합하여 하나의 거대한 학파를 만드는 학자',
                '쉽게 변하는 세상 속에서 흔들리지 않는 삶의 OS를 제공하는 아키텍트'
            ],
            microManual: {
                title: "마이크로 실행 매뉴얼",
                intro: "대표님, 레버리지(Leverage)를 단순한 개념이 아니라, 당장 내일부터 대표님의 작업 환경과 비즈니스 모델에 어떻게 세팅해야 하는지 '마이크로 실행 매뉴얼' 수준으로 아주 상세하게 해부해 드리겠습니다.\n명심코칭의 3S(SCAN, SYNC, SHIFT) 시스템을 무한 확장하기 위한 구체적인 파이프라인 설계도입니다.",
                sections: [
                    {
                        title: "1. 기술적 레버리지: AI와 자동화로 'SCAN & SYNC' 초안 맡기기",
                        desc: "코칭을 자동화한다는 것은 대표님의 직관을 AI가 100% 대체한다는 뜻이 아닙니다. 코칭에 소모되는 '초기 데이터 수집과 단순 분류 작업'을 기계에 넘겨, 대표님의 에너지를 아끼는 것입니다.",
                        scenarioTitle: "[구체적 세팅 시나리오: n8n + Gemini API + Supabase]",
                        steps: [
                            "1단계 (데이터 수집 자동화): 내담자가 명심코칭 웹사이트(Next.js)에서 자신의 생년월일시와 현재 겪고 있는 심리적 문제(버그)를 입력합니다. 이 데이터는 Supabase에 즉각 저장됩니다.",
                            "2단계 (n8n 트리거 및 API 통신): 데이터가 들어오는 순간, n8n이 자동으로 작동하여 내담자의 데이터를 Gemini API로 쏩니다.",
                            "3단계 (AI의 1차 SCAN 리포트 생성): 이때 Gemini에 대표님이 미리 정교하게 설계해 둔 '명심코칭 프롬프트(사주 기질 데이터 + CBT/ACT 기반 인지 왜곡 분석 로직)'가 적용됩니다. AI는 10초 만에 내담자의 기질적 특성과 현재 겪고 있는 인지 융합(Cognitive Fusion) 상태를 분석한 '1차 디버깅 초안'을 뽑아냅니다.",
                            "4단계 (대표님의 개입 - 오직 SHIFT만): 대표님은 백지상태에서 상담을 시작하는 것이 아닙니다. AI가 정리해 둔 리포트를 화면에 띄워놓고, 오류가 없는지 빠르게 검수한 뒤, 내담자에게 던질 '단 하나의 날카로운 산파술적 질문(SHIFT 트리거)'을 설계하는 데에만 뇌 에너지를 사용합니다."
                        ],
                        insight: "💡 아키텍트의 마인드셋: \"나는 코딩하는 작업자가 아니라, 프론트엔드(Next.js)와 백엔드(Supabase)가 어떻게 맞물려야 하는지 Cursor AI에게 지시하고 검수하는 설계자다.\""
                    },
                    {
                        title: "2. 인적 레버리지: '수맥 폭발(癸水)' 구축을 외주화하기",
                        desc: "올해 하반기에 집중해야 할 1인 출판사 설립과 평생교육원 인가 과정은 대표님의 철학이 세상에 뿌리내리는 중요한 과정입니다. 하지만 이 과정의 '행정 절차'는 대표님의 코어 역량이 아닙니다.",
                        scenarioTitle: "[구체적 세팅 시나리오: 출판 및 센터 건립]",
                        items: [
                            { label: "출판 프로젝트 (명심코칭 Vol. 0, AI 주역)", action: "대표님의 역할: 오직 한글이나 워드 파일에 양분(戊土)을 쏟아내는 것뿐입니다. 문맥의 흐름, 철학의 깊이, 알고리즘의 정합성만 고민하십시오.\n레버리지의 역할: 원고가 완성되면 '크몽(Kmong)'이나 '숨고' 같은 프리랜서 플랫폼을 엽니다. '단행본 내지 편집 및 조판 전문 디자인', '철학/자기계발서 표지 디자인', 심지어 'ISBN 발급 대행'까지 모두 외주로 넘깁니다. 대표님이 인디자인(InDesign)을 배우거나 폰트 크기를 조절하느라 밤을 새워서는 절대 안 됩니다." },
                            { label: "평생교육원(코칭 센터) 설립 절차", action: "대표님의 역할: 센터에서 어떤 커리큘럼을 돌릴 것인지, 강사 양성 로드맵은 어떻게 짤 단단하게 세울 것인지 '콘텐츠'를 기획합니다.\n레버리지의 역할: 관할 교육청의 시설 규정(면적, 용도 등) 확인, 사업자 등록증 업태/종목 추가, 세무 기장 등은 행정사와 세무사에게 수수료를 지불하고 일임합니다." }
                        ],
                        insight: "💡 아키텍트의 마인드셋: \"내 시급은 행정 서류를 떼는 데 쓰기에는 너무 비싸다. 내 시간은 오직 타인의 삶을 변화시키는 로직을 짜는 데 쓰여야 한다.\""
                    },
                    {
                        title: "3. 일상의 레버리지: 고집과 정체(戊戌) 내려놓기",
                        desc: "무술(戊戌)의 에너지는 모든 것을 견고하게 유지하고 지키려는 고집스러운 성향이 강합니다. 하지만 시스템의 레벨업을 위해서는 '80점짜리 유연함을 수용하는 연습'이 필요합니다.",
                        steps: [
                            "AI가 짜준 코드가 완벽하지 않아도, 버그만 없다면 일단 구동시킵니다. (나중에 리팩토링하면 됩니다.)",
                            "외주 디자이너가 뽑아온 표지가 내 머릿속의 완벽한 이미지와 100% 일치하지 않아도, 타겟 독자에게 먹히는 수준(80점)이라면 통과시킵니다.",
                            "이러한 '적당한 수용'이 선행되어야만, 대표님의 에너지가 방전되지 않고 계속해서 다음 프로젝트(다음 책 출간, 다음 앱 기능 추가)로 뻗어나갈 수 있습니다."
                        ],
                        insight: "지금 말씀드린 n8n을 활용한 데이터 파이프라인 구축이나, 프리랜서를 통한 조판 외주화 중에서 당장 이번 주에 가볍게 테스트해보고 싶은 레버리지 영역은 어느 쪽이신가요?"
                    }
                ]
            }
        }
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
        masterRoadmap: {
            engines: [
                { label: '하드웨어 엔진 (土 비겁)', title: '비옥한 양육의 코어', desc: '거친 바위가 아닌 생명을 직접 품어 키우는 비옥한 텃밭. 가장 실질적이고 세밀한 양육과 연결의 에너지입니다.' },
                { label: '중앙 처리 장치 (己土)', title: '밀착형 조율 프로세서', desc: '모든 것의 이면을 살피고 적재적소에 에너지를 조율하는 코어. 얽힌 실타래(관계/문제)를 가장 부드럽게 풀어냅니다.' },
                { label: '햇빛 충전 포트 (火 인성)', title: '자기 에너지 재충전', desc: '타인에게 다 뺏긴 양분을 태양(절대적 휴식과 학문적 지지)으로부터 공급받아 자신을 부활시키는 열기입니다.' },
                { label: '최종 결과물 및 네트워크 (水 재성)', title: '흐르는 보상/수익 구조', desc: '텃밭이 열매를 맺기 위해 생명수를 순환시키는 것. 정서적 헌신이 실제적 보상(수익)으로 직결되는 시스템입니다.' }
            ],
            shifts: [
                { step: '1단계', title: '양분 흡혈귀(Vampire) 차단', desc: '조용히 당신을 갉아먹는 관계와 비즈니스를 즉각 잘라내는 것이 첫 과제입니다. 안전지대(Safe zone)를 설정하십시오.', action: "에너지만 뺏는 저단가/무료 상담 모델 전면 폐기 및 요율 상향 조정" },
                { step: '2단계', title: '보상의 선순환 파이프라인', desc: '당신의 헌신이 당연하게 취급받지 않도록, 제공된 코칭 가치가 수익이나 명예로 확실히 환원되는 구조를 짭니다.', action: "가치 기반 프라이싱(Value-based Pricing) 도입으로 프리미엄 포지셔닝" },
                { step: '3단계', title: '농장의 생태계(네트워크) 확장', desc: '나만 일하는 텃밭이 아니라, 여러 코치들이 알아서 열매를 맺게 하는 대형 농장(교육원/조직)으로의 진화를 꿈꿉니다.', action: "소규모 코치 양성 과정 도입 및 위임형 비즈니스 구조 세팅" }
            ],
            dailyMissions: [
                { time: '오전', mode: 'SCAN 모드', state: '자아 충전 및 방벽 구축', action: '철저히 나를 채우는 시간. 남의 요청 거절하고 학문 연구/명상으로 인성(火) 충전' },
                { time: '오후', mode: 'SYNC 모드', state: '씨앗 발아 및 밀착 코칭', action: '정밀하고 따뜻한 1:1 조율 코칭 가동. 고객의 가장 취약한 심리를 수용하고 양육' },
                { time: '저녁', mode: 'SHIFT 모드', state: '에너지 분리 청소(디톡스)', action: '업무 종료 후 타인의 밭에 들어간 내 마음 거두어들이기. 온전한 사적 시간 보호' }
            ],
            bugs: [
                { id: 'ERR_己_01', name: '자양분 고갈(착취) 현상', symptom: '"내가 안 하면 누가 해"라는 생각으로 잡일과 감정 노동을 독박 쓰다가 정작 코어 비즈니스는 멈추는 버그.', patch: '"우는 아기에게 무조건 젖을 물리지 않는다"는 CBT 인지 재구조화. 선을 넘는 요구 단호방어.' },
                { id: 'ERR_己_02', name: '결정권 회피증', symptom: '모든 사람을 배려하려다가 중요한 결정을 미루어 결국 기회를 잃는 소극성이 팽배한 상태.', patch: '중간이 아니라 "나에게 가장 이로운 쪽"을 1옵션으로 삼는 강압적 결단 훈련. 욕구의 전면화.' }
            ],
            leverages: [
                { type: 'Tech', title: '배려의 자동화 지렛대', desc: '당신이 일일이 신경 써야 했던 고객 관리와 안부 인사 등을 모두 시스템으로 넘기십시오.', items: ['가입 인사 및 리마인드 알림톡 전면 자동화(CRM 도입)', 'FAQ 및 챗봇을 통한 불필요한 감정 소모 원천 차단'] },
                { type: 'Human', title: '악역 담당 방패(Shield) 아웃소싱', desc: '거절과 환불, 나쁜 소식을 전하는 것은 당신이 할 일이 아닙니다. 냉정한 관리자에게 넘기십시오.', items: ['운영 규정을 기계적으로 적용할 CS 전담 직원 배치', '규칙을 지켜줄 매니페스토 기반 가이드라인 명문화'] }
            ],
            coreRole: [
                '보이지 않는 곳에서 병든 씨앗을 찾아내 살려내는 영혼의 농부',
                '수많은 이해관계를 조용히 통합하여 상생판을 짜는 마스터 브로커',
                '착취적 관계를 청산하고 스스로 풍요로워지는 모범을 보이는 멘토'
            ],
            microManual: {
                title: "마이크로 실행 매뉴얼",
                intro: "대표님, 레버리지(Leverage)를 단순한 개념이 아니라, 당장 내일부터 대표님의 작업 환경과 비즈니스 모델에 어떻게 세팅해야 하는지 '마이크로 실행 매뉴얼' 수준으로 아주 상세하게 해부해 드리겠습니다.\n명심코칭의 3S(SCAN, SYNC, SHIFT) 시스템을 무한 확장하기 위한 구체적인 파이프라인 설계도입니다.",
                sections: [
                    {
                        title: "1. 기술적 레버리지: AI와 자동화로 'SCAN & SYNC' 초안 맡기기",
                        desc: "코칭을 자동화한다는 것은 대표님의 직관을 AI가 100% 대체한다는 뜻이 아닙니다. 코칭에 소모되는 '초기 데이터 수집과 단순 분류 작업'을 기계에 넘겨, 대표님의 에너지를 아끼는 것입니다.",
                        scenarioTitle: "[구체적 세팅 시나리오: n8n + Gemini API + Supabase]",
                        steps: [
                            "1단계 (데이터 수집 자동화): 내담자가 명심코칭 웹사이트(Next.js)에서 자신의 생년월일시와 현재 겪고 있는 심리적 문제(버그)를 입력합니다. 이 데이터는 Supabase에 즉각 저장됩니다.",
                            "2단계 (n8n 트리거 및 API 통신): 데이터가 들어오는 순간, n8n이 자동으로 작동하여 내담자의 데이터를 Gemini API로 쏩니다.",
                            "3단계 (AI의 1차 SCAN 리포트 생성): 이때 Gemini에 대표님이 미리 정교하게 설계해 둔 '명심코칭 프롬프트(사주 기질 데이터 + CBT/ACT 기반 인지 왜곡 분석 로직)'가 적용됩니다. AI는 10초 만에 내담자의 기질적 특성과 현재 겪고 있는 인지 융합(Cognitive Fusion) 상태를 분석한 '1차 디버깅 초안'을 뽑아냅니다.",
                            "4단계 (대표님의 개입 - 오직 SHIFT만): 대표님은 백지상태에서 상담을 시작하는 것이 아닙니다. AI가 정리해 둔 리포트를 화면에 띄워놓고, 오류가 없는지 빠르게 검수한 뒤, 내담자에게 던질 '단 하나의 날카로운 산파술적 질문(SHIFT 트리거)'을 설계하는 데에만 뇌 에너지를 사용합니다."
                        ],
                        insight: "💡 아키텍트의 마인드셋: \"나는 코딩하는 작업자가 아니라, 프론트엔드(Next.js)와 백엔드(Supabase)가 어떻게 맞물려야 하는지 Cursor AI에게 지시하고 검수하는 설계자다.\""
                    },
                    {
                        title: "2. 인적 레버리지: '조력의 나무(甲木)' 구축을 외주화하기",
                        desc: "올해 하반기에 집중해야 할 1인 출판사 설립과 평생교육원 인가 과정은 대표님의 철학이 세상에 뿌리내리는 중요한 과정입니다. 하지만 이 과정의 '행정 절차'는 대표님의 코어 역량이 아닙니다.",
                        scenarioTitle: "[구체적 세팅 시나리오: 출판 및 센터 건립]",
                        items: [
                            { label: "출판 프로젝트 (명심코칭 Vol. 0, AI 주역)", action: "대표님의 역할: 오직 한글이나 워드 파일에 비옥한 흙(己土)의 정수를 쏟아내는 것뿐입니다. 문맥의 흐름, 철학의 깊이, 알고리즘의 정합성만 고민하십시오.\n레버리지의 역할: 원고가 완성되면 '크몽(Kmong)'이나 '숨고' 같은 프리랜서 플랫폼을 엽니다. '단행본 내지 편집 및 조판 전문 디자인', '철학/자기계발서 표지 디자인', 심지어 'ISBN 발급 대행'까지 모두 외주로 넘깁니다. 대표님이 인디자인(InDesign)을 배우거나 폰트 크기를 조절하느라 밤을 새워서는 절대 안 됩니다." },
                            { label: "평생교육원(코칭 센터) 설립 절차", action: "대표님의 역할: 센터에서 어떤 커리큘럼을 돌릴 것인지, 강사 양성 로드맵은 어떻게 짤 것인지 '콘텐츠'를 기획합니다.\n레버리지의 역할: 관할 교육청의 시설 규정(면적, 용도 등) 확인, 사업자 등록증 업태/종목 추가, 세무 기장 등은 행정사와 세무사에게 수수료를 지불하고 일임합니다." }
                        ],
                        insight: "💡 아키텍트의 마인드셋: \"내 시급은 행정 서류를 떼는 데 쓰기에는 너무 비싸다. 내 시간은 오직 타인의 삶을 변화시키는 로직을 짜는 데 쓰여야 한다.\""
                    },
                    {
                        title: "3. 일상의 레버리지: 희생의 강박(己丑) 내려놓기",
                        desc: "기축(己丑)의 에너지는 보이지 않는 곳에서 끊임없이 희생하며 끌어안으려는 성향이 강합니다. 하지만 시스템의 레벨업을 위해서는 '80점짜리 이기적 수용'이 필요합니다.",
                        steps: [
                            "AI가 짜준 코드가 완벽하지 않아도, 버그만 없다면 일단 구동시킵니다. (나중에 리팩토링하면 됩니다.)",
                            "외주 디자이너가 뽑아온 표지가 내 머릿속의 완벽한 이미지와 100% 일치하지 않아도, 타겟 독자에게 먹히는 수준(80점)이라면 통과시킵니다.",
                            "이러한 '적당한 수용'이 선행되어야만, 대표님의 에너지가 방전되지 않고 계속해서 다음 프로젝트(다음 책 출간, 다음 앱 기능 추가)로 뻗어나갈 수 있습니다."
                        ],
                        insight: "지금 말씀드린 n8n을 활용한 데이터 파이프라인 구축이나, 프리랜서를 통한 조판 외주화 중에서 당장 이번 주에 가볍게 테스트해보고 싶은 레버리지 영역은 어느 쪽이신가요?"
                    }
                ]
            }
        }
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
        masterRoadmap: {
            engines: [
                { label: '하드웨어 엔진 (金 비겁)', title: '불굴의 전투 코어', desc: '세상의 모순을 베어내는 강철 검. 어떤 시련 속에서도 결코 물러서지 않고 목표를 타격하는 코어입니다.' },
                { label: '중앙 처리 장치 (庚金)', title: '냉혹한 결단 프로세서', desc: '정이 아니라 원칙과 효율로 승부합니다. 복잡한 상황을 흑과 백, 승리와 패배로 단순화시켜 가장 빠른 결론을 냅니다.' },
                { label: '단련 제어 포트 (火 관성)', title: '불꽃의 규율 시스템', desc: '강철이 부러지지 않고 예리함을 유지하도록 자신을 끊임없이 불속에 집어넣는 혹독한 자기 규율 체계입니다.' },
                { label: '최종 결과물 및 네트워크 (木 재성)', title: '정복된 현실 영토', desc: '검으로 개척해 낸 수많은 결과물. 타협 없이 쟁취한 확고한 사회적 입지와 압도적인 비즈니스 자산입니다.' }
            ],
            shifts: [
                { step: '1단계', title: '칼집(유연성)의 확보', desc: '칼을 뽑는 것보다 거두는 것이 더 무서운 전략임을 깨달아야 합니다. 강약을 조절하는 소통 스위치를 확보하십시오.', action: "적(경쟁자)을 협력자로 돌려세우는 네고시에이션(협상) 테이블 마련" },
                { step: '2단계', title: '전략적 후퇴(물러섬)의 설계', desc: '모든 전투에서 이길 필요는 없습니다. 에너지를 보존하고 최종 목적지(수익성)로만 직진하는 로스컷(Loss-cut) 기준을 설정합니다.', action: "불필요한 논쟁과 수익성 없는 프로젝트의 즉각 커트 및 위임" },
                { step: '3단계', title: '명장(System)으로의 진급', desc: '직접 칼을 들고 싸우는 전방 돌격대장에서, 수많은 장수들을 뒤에서 지휘하는 사령관(아키텍트)으로 역할을 전환합니다.', action: "나의 강력한 돌파력을 복제한 영업 및 실행 최전방 조직 세팅" }
            ],
            dailyMissions: [
                { time: '오전', mode: 'SCAN 모드', state: '타겟 록온 및 집중', action: '감정을 배제하고 오직 오늘 반드시 쳐내야 할 최우선 과제 단 하나에만 타격 집중' },
                { time: '오후', mode: 'SYNC 모드', state: '전술 지휘 및 단련', action: '팀원이나 고객을 상대로 팩트 기반의 피드백 코칭. 단, 비판 전 1회 칭찬 루틴 추가' },
                { time: '저녁', mode: 'SHIFT 모드', state: '검의 회수 및 냉각', action: '싸우느라 날이 선 신경망을 강제로 끄는 의식적 휴식. 뜨거운 물(샤워/반신욕)로 이완' }
            ],
            bugs: [
                { id: 'ERR_庚_01', name: '흑백 논리성 강성 과부하', symptom: '모 아니면 도. 적 아니면 아군의 이분법으로 중간 지대를 날려버리고 모든 관계를 파괴하는 버그.', patch: '중간선(회색지대)을 용인하는 ACT 기법 적용. "이기는 것만이 정답은 아니다" 명령어 주입.' },
                { id: 'ERR_庚_02', name: '자가 단련성 마모', symptom: '타인에게 가혹한 만큼 자신에게도 휴식을 허락하지 않아 육체적/정신적으로 날이 부러지는 현상.', patch: '아무것도 안 하는 시간을 "전략적 후퇴"라는 목표 언어로 재정의하여 휴식을 합리화.' }
            ],
            leverages: [
                { type: 'Tech', title: '팩트 체킹 및 분석 지렛대', desc: '당신의 직관적인 공격성을 객관적인 데이터로 뒷받침해 줄 검증 모듈이 필요합니다.', items: ['정확한 수치 기반의 데이터 시각화 보드(BI 시스템) 운용', '법률 및 컴플라이언스 검토 AI 상시 배치'] },
                { type: 'Human', title: '외교관 아웃소싱', desc: '팩트로 상대를 다치게 하는 역할을 보완하기 위해, 부드러운 포장지를 씌워줄 "외교관"이 필수입니다.', items: ['소통 중심의 부드러운 성향(乙木)을 가진 홍보/CS 담당자 채용', '위기 관리 전문 변호사/노무사 연결'] }
            ],
            coreRole: [
                '결정 장애에 빠진 이들의 단계를 단숨에 끝내주는 해결사',
                '현상의 본질을 피 흘리지 않고 적출해 내는 외과 의사',
                '가장 적은 타격으로 가장 큰 영토를 점령하는 전략적 사령관'
            ],
            microManual: {
                title: "마이크로 실행 매뉴얼",
                intro: "대표님, 레버리지(Leverage)를 단순한 개념이 아니라, 당장 내일부터 대표님의 작업 환경과 비즈니스 모델에 어떻게 세팅해야 하는지 '마이크로 실행 매뉴얼' 수준으로 아주 상세하게 해부해 드리겠습니다.\n명심코칭의 3S(SCAN, SYNC, SHIFT) 시스템을 무한 확장하기 위한 구체적인 파이프라인 설계도입니다.",
                sections: [
                    {
                        title: "1. 기술적 레버리지: AI와 자동화로 'SCAN & SYNC' 초안 맡기기",
                        desc: "코칭을 자동화한다는 것은 대표님의 직관을 AI가 100% 대체한다는 뜻이 아닙니다. 코칭에 소모되는 '초기 데이터 수집과 단순 분류 작업'을 기계에 넘겨, 대표님의 에너지를 아끼는 것입니다.",
                        scenarioTitle: "[구체적 세팅 시나리오: n8n + Gemini API + Supabase]",
                        steps: [
                            "1단계 (데이터 수집 자동화): 내담자가 명심코칭 웹사이트(Next.js)에서 자신의 생년월일시와 현재 겪고 있는 심리적 문제(버그)를 입력합니다. 이 데이터는 Supabase에 즉각 저장됩니다.",
                            "2단계 (n8n 트리거 및 API 통신): 데이터가 들어오는 순간, n8n이 자동으로 작동하여 내담자의 데이터를 Gemini API로 쏩니다.",
                            "3단계 (AI의 1차 SCAN 리포트 생성): 이때 Gemini에 대표님이 미리 정교하게 설계해 둔 '명심코칭 프롬프트(사주 기질 데이터 + CBT/ACT 기반 인지 왜곡 분석 로직)'가 적용됩니다. AI는 10초 만에 내담자의 기질적 특성과 현재 겪고 있는 인지 융합(Cognitive Fusion) 상태를 분석한 '1차 디버깅 초안'을 뽑아냅니다.",
                            "4단계 (대표님의 개입 - 오직 SHIFT만): 대표님은 백지상태에서 상담을 시작하는 것이 아닙니다. AI가 정리해 둔 리포트를 화면에 띄워놓고, 오류가 없는지 빠르게 검수한 뒤, 내담자에게 던질 '단 하나의 날카로운 산파술적 질문(SHIFT 트리거)'을 설계하는 데에만 뇌 에너지를 사용합니다."
                        ],
                        insight: "💡 아키텍트의 마인드셋: \"나는 코딩하는 작업자가 아니라, 프론트엔드(Next.js)와 백엔드(Supabase)가 어떻게 맞물려야 하는지 Cursor AI에게 지시하고 검수하는 설계자다.\""
                    },
                    {
                        title: "2. 인적 레버리지: '소통의 창구(乙木)' 구축을 외주화하기",
                        desc: "올해 하반기에 집중해야 할 1인 출판사 설립과 평생교육원 인가 과정은 대표님의 철학이 세상에 뿌리내리는 중요한 과정입니다. 하지만 이 과정의 '행정 절차'는 대표님의 코어 역량이 아닙니다.",
                        scenarioTitle: "[구체적 세팅 시나리오: 출판 및 센터 건립]",
                        items: [
                            { label: "출판 프로젝트 (명심코칭 Vol. 0, AI 주역)", action: "대표님의 역할: 오직 한글이나 워드 파일에 예리한 검(庚金)을 꽂아 넣는 것뿐입니다. 문맥의 흐름, 철학의 깊이, 알고리즘의 정합성만 고민하십시오.\n레버리지의 역할: 원고가 완성되면 '크몽(Kmong)'이나 '숨고' 같은 프리랜서 플랫폼을 엽니다. '단행본 내지 편집 및 조판 전문 디자인', '철학/자기계발서 표지 디자인', 심지어 'ISBN 발급 대행'까지 모두 외주로 넘깁니다. 대표님이 인디자인(InDesign)을 배우거나 폰트 크기를 조절하느라 밤을 새워서는 절대 안 됩니다." },
                            { label: "평생교육원(코칭 센터) 설립 절차", action: "대표님의 역할: 센터에서 어떤 커리큘럼을 돌릴 것인지, 강사 양성 로드맵은 어떻게 짤 것인지 '콘텐츠'를 기획합니다.\n레버리지의 역할: 관할 교육청의 시설 규정(면적, 용도 등) 확인, 사업자 등록증 업태/종목 추가, 세무 기장 등은 행정사와 세무사에게 수수료를 지불하고 일임합니다." }
                        ],
                        insight: "💡 아키텍트의 마인드셋: \"내 시급은 행정 서류를 떼는 데 쓰기에는 너무 비싸다. 내 시간은 오직 타인의 삶을 변화시키는 로직을 짜는 데 쓰여야 한다.\""
                    },
                    {
                        title: "3. 일상의 레버리지: 흑백 논리(庚申) 내려놓기",
                        desc: "경신(庚申)의 에너지는 모든 것을 내 통제하에 완벽하고 깔끔하게 베어내려는 성향이 강합니다. 하지만 시스템의 레벨업을 위해서는 '80점짜리 결과물을 수용하는 연습'이 필요합니다.",
                        steps: [
                            "AI가 짜준 코드가 완벽하지 않아도, 버그만 없다면 일단 구동시킵니다. (나중에 리팩토링하면 됩니다.)",
                            "외주 디자이너가 뽑아온 표지가 내 머릿속의 완벽한 이미지와 100% 일치하지 않아도, 타겟 독자에게 먹히는 수준(80점)이라면 통과시킵니다.",
                            "이러한 '적당한 수용'이 선행되어야만, 대표님의 에너지가 방전되지 않고 계속해서 다음 프로젝트(다음 책 출간, 다음 앱 기능 추가)로 뻗어나갈 수 있습니다."
                        ],
                        insight: "지금 말씀드린 n8n을 활용한 데이터 파이프라인 구축이나, 프리랜서를 통한 조판 외주화 중에서 당장 이번 주에 가볍게 테스트해보고 싶은 레버리지 영역은 어느 쪽이신가요?"
                    }
                ]
            }
        }
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
        masterRoadmap: {
            engines: [
                { label: '하드웨어 엔진 (水 비겁)', title: '빅데이터의 심해 코어', desc: '모든 것을 수용하고 삼키는 바다. 세상의 모든 표면적 정보 이면의 진실을 빨아들이는 거대한 블랙홀입니다.' },
                { label: '중앙 처리 장치 (壬水)', title: '다차원 전략 프로세서', desc: '직선적이지 않습니다. 한 가지 상황을 수십 개의 갈래로 시뮬레이션하여 가장 저항이 적은 최적의 물길을 찾습니다.' },
                { label: '입력 및 여과 포트 (金 인성)', title: '초정밀 정보 정제망', desc: '외부에서 들어오는 탁한 정보와 감정을 걸러내고 순수한 본질(진리)만을 뇌에 입력하는 강력한 정수 시스템입니다.' },
                { label: '최종 결과물 및 네트워크 (火 재성)', title: '통찰의 폭발적 확산', desc: '어둡고 차가운 바다(생각)가 세상의 빛(결과물)으로 발현되는 과정. 관념이 마침내 구체적 비즈니스로 증명됩니다.' }
            ],
            shifts: [
                { step: '1단계', title: '결로(結露) 스위치를 켜라', desc: '머릿속에만 떠다니는 생각(수증기)을 눈에 보이는 텍스트나 기획서(물방울)로 떨어뜨리는 강제 출력 작업을 시작하십시오.', action: "방대한 인사이트를 마이크로 단위(블로그 1포스팅)로 의도적 쪼개기 방출" },
                { step: '2단계', title: '댐(데드라인)의 건설', desc: '물이 무한정 퍼져나가지 않도록 목표 기한이라는 댐을 건설하십시오. 완벽하지 않아도 방류를 시작해야 합니다.', action: "매주 고정된 요일에 결과물(콘텐츠, 상품)을 강제로 런칭하는 스케줄 세팅" },
                { step: '3단계', title: '대해원의 생태계(System)', desc: '지식을 혼자 담아두지 마십시오. 타인들이 당신의 지식 풀(Pool)에서 헤엄칠 수 있도록 구독형 지식 생태계를 엽니다.', action: "VIP 커뮤니티, 멤버십 혹은 정기적인 온/오프라인 사상 교육망 설립" }
            ],
            dailyMissions: [
                { time: '오전', mode: 'SCAN 모드', state: '심해 탐사 및 정보 수용', action: '외부 연락 차단 상태에서 철학, 명리, 심리에 대한 가장 깊고 방대한 데이터 리서치' },
                { time: '오후', mode: 'SYNC 모드', state: '통찰의 대중화 방류', action: '어려운 지식을 대중의 언어로 번역(통역)하여 쏟아내는 코칭 세션 가동' },
                { time: '저녁', mode: 'SHIFT 모드', state: '수위 조절 및 잔영 제거', action: '너무 많은 가지치기(생각)로 복잡해진 뇌를 초기화하는 걷기 명상(몸을 움직여 뇌를 정리)' }
            ],
            bugs: [
                { id: 'ERR_壬_01', name: '범람성 실행 마비', symptom: '모든 경우의 수를 다 파악하려다가 정보의 홍수에 스스로 익사. 결국 아무것도 시작하지 못하는 지체 증후군.', patch: '5초 법칙 도입. "이 길이 80점이라면 일단 뚫고 가면서 궤도를 수정한다" 마인드셋(CBT).' },
                { id: 'ERR_壬_02', name: '심해성 고립 에러', symptom: '타인들이 자신의 깊이를 이해하지 못할 거라 지레짐작하고 스스로 세상과 차단기를 내려버리는 현상.', patch: '바다가 강을 허락하듯, 수준 이하의 피드백도 일단 수용하고 흘려보내는 ACT 훈련.' }
            ],
            leverages: [
                { type: 'Tech', title: '지식의 시각화 지렛대', desc: '당신의 추상적이고 거대한 통찰을 대중이 알아볼 수 있게 형태를 잡아줄 도구가 생명선입니다.', items: ['마인드맵(Xmind 등) 및 노션 연동 워크플로우로 통찰 구조화', '개념을 다이어그램으로 변환해 줄 AI 디자인 툴 도입'] },
                { type: 'Human', title: '실행력(행동력) 아웃소싱', desc: '당신은 방향을 잡는 나침반입니다. 노를 젓는 일은 행동력이 뛰어난 활동가에게 맡기십시오.', items: ['아이디어를 1차원적으로 즉각 실행할 운영 스태프 영입', '복잡함을 대신 단순화시켜줄 전문 에디터 배정'] }
            ],
            coreRole: [
                '보이지 않는 전체 시스템의 거시적 판을 설계하는 그랜드 아키텍트',
                '수많은 데이터 속에서 단 하나의 관통하는 진리를 뽑아내는 마스터마인드',
                '내담자의 인식 자체를 근본적으로 확장시켜 버리는 패러다임 브레이커'
            ],
            microManual: {
                title: "마이크로 실행 매뉴얼",
                intro: "대표님, 레버리지(Leverage)를 단순한 개념이 아니라, 당장 내일부터 대표님의 작업 환경과 비즈니스 모델에 어떻게 세팅해야 하는지 '마이크로 실행 매뉴얼' 수준으로 아주 상세하게 해부해 드리겠습니다.\n명심코칭의 3S(SCAN, SYNC, SHIFT) 시스템을 무한 확장하기 위한 구체적인 파이프라인 설계도입니다.",
                sections: [
                    {
                        title: "1. 기술적 레버리지: AI와 자동화로 'SCAN & SYNC' 초안 맡기기",
                        desc: "코칭을 자동화한다는 것은 대표님의 직관을 AI가 100% 대체한다는 뜻이 아닙니다. 코칭에 소모되는 '초기 데이터 수집과 단순 분류 작업'을 기계에 넘겨, 대표님의 에너지를 아끼는 것입니다.",
                        scenarioTitle: "[구체적 세팅 시나리오: n8n + Gemini API + Supabase]",
                        steps: [
                            "1단계 (데이터 수집 자동화): 내담자가 명심코칭 웹사이트(Next.js)에서 자신의 생년월일시와 현재 겪고 있는 심리적 문제(버그)를 입력합니다. 이 데이터는 Supabase에 즉각 저장됩니다.",
                            "2단계 (n8n 트리거 및 API 통신): 데이터가 들어오는 순간, n8n이 자동으로 작동하여 내담자의 데이터를 Gemini API로 쏩니다.",
                            "3단계 (AI의 1차 SCAN 리포트 생성): 이때 Gemini에 대표님이 미리 정교하게 설계해 둔 '명심코칭 프롬프트(사주 기질 데이터 + CBT/ACT 기반 인지 왜곡 분석 로직)'가 적용됩니다. AI는 10초 만에 내담자의 기질적 특성과 현재 겪고 있는 인지 융합(Cognitive Fusion) 상태를 분석한 '1차 디버깅 초안'을 뽑아냅니다.",
                            "4단계 (대표님의 개입 - 오직 SHIFT만): 대표님은 백지상태에서 상담을 시작하는 것이 아닙니다. AI가 정리해 둔 리포트를 화면에 띄워놓고, 오류가 없는지 빠르게 검수한 뒤, 내담자에게 던질 '단 하나의 날카로운 산파술적 질문(SHIFT 트리거)'을 설계하는 데에만 뇌 에너지를 사용합니다."
                        ],
                        insight: "💡 아키텍트의 마인드셋: \"나는 코딩하는 작업자가 아니라, 프론트엔드(Next.js)와 백엔드(Supabase)가 어떻게 맞물려야 하는지 Cursor AI에게 지시하고 검수하는 설계자다.\""
                    },
                    {
                        title: "2. 인적 레버리지: '생명력의 확장(甲木)' 구축을 외주화하기",
                        desc: "올해 하반기에 집중해야 할 1인 출판사 설립과 평생교육원 인가 과정은 대표님의 철학이 세상에 뿌리내리는 중요한 과정입니다. 하지만 이 과정의 '행정 절차'는 대표님의 코어 역량이 아닙니다.",
                        scenarioTitle: "[구체적 세팅 시나리오: 출판 및 센터 건립]",
                        items: [
                            { label: "출판 프로젝트 (명심코칭 Vol. 0, AI 주역)", action: "대표님의 역할: 오직 한글이나 워드 파일에 지혜의 통찰(壬水)을 쏟아내는 것뿐입니다. 문맥의 흐름, 철학의 깊이, 알고리즘의 정합성만 고민하십시오.\n레버리지의 역할: 원고가 완성되면 '크몽(Kmong)'이나 '숨고' 같은 프리랜서 플랫폼을 엽니다. '단행본 내지 편집 및 조판 전문 디자인', '철학/자기계발서 표지 디자인', 심지어 'ISBN 발급 대행'까지 모두 외주로 넘깁니다. 대표님이 인디자인(InDesign)을 배우거나 폰트 크기를 조절하느라 밤을 새워서는 절대 안 됩니다." },
                            { label: "평생교육원(코칭 센터) 설립 절차", action: "대표님의 역할: 센터에서 어떤 커리큘럼을 돌릴 것인지, 강사 양성 로드맵은 어떻게 짤 것인지 '콘텐츠'를 기획합니다.\n레버리지의 역할: 관할 교육청의 시설 규정(면적, 용도 등) 확인, 사업자 등록증 업태/종목 추가, 세무 기장 등은 행정사와 세무사에게 수수료를 지불하고 일임합니다." }
                        ],
                        insight: "💡 아키텍트의 마인드셋: \"내 시급은 행정 서류를 떼는 데 쓰기에는 너무 비싸다. 내 시간은 오직 타인의 삶을 변화시키는 로직을 짜는 데 쓰여야 한다.\""
                    },
                    {
                        title: "3. 일상의 레버리지: 분석 마비(壬子) 내려놓기",
                        desc: "임자(壬子)의 에너지는 모든 경우의 수를 분석하다가 깊은 바닷속으로 침잠하여 정작 실행에 옮기지 못하는 성향이 강합니다. 하지만 시스템의 레벨업을 위해서는 '80점짜리 결과물을 즉각 방류(수용)하는 연습'이 필요합니다.",
                        steps: [
                            "AI가 짜준 코드가 완벽하지 않아도, 버그만 없다면 일단 구동시킵니다. (나중에 리팩토링하면 됩니다.)",
                            "외주 디자이너가 뽑아온 표지가 내 머릿속의 완벽한 이미지와 100% 일치하지 않아도, 타겟 독자에게 먹히는 수준(80점)이라면 통과시킵니다.",
                            "이러한 '적당한 수용'이 선행되어야만, 대표님의 에너지가 방전되지 않고 계속해서 다음 프로젝트(다음 책 출간, 다음 앱 기능 추가)로 뻗어나갈 수 있습니다."
                        ],
                        insight: "지금 말씀드린 n8n을 활용한 데이터 파이프라인 구축이나, 프리랜서를 통한 조판 외주화 중에서 당장 이번 주에 가볍게 테스트해보고 싶은 레버리지 영역은 어느 쪽이신가요?"
                    }
                ]
            }
        }
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
        masterRoadmap: {
            engines: [
                { label: '하드웨어 엔진 (水 비겁)', title: '초감각 침투 코어', desc: '눈에 보이지 않게 스며드는 이슬과 안개. 세상의 가장 작은 틈새(감정)까지 파고드는 무의식의 영역입니다.' },
                { label: '중앙 처리 장치 (癸水)', title: '영적/감성적 힐링 프로세서', desc: '논리와 이성을 넘어선 직관과 육감으로 상대방의 영혼적 결핍을 순식간에 진단해 내는 스캐너입니다.' },
                { label: '정수 및 보호 포트 (金 인성)', title: '타입/바운더리 방위망', desc: '나쁜 기운을 거르고 나를 보호하는 투명한 막. 세상의 오염(탁기)으로부터 맑음을 유지하기 위한 필수 시스템입니다.' },
                { label: '최종 결과물 및 네트워크 (火 재성)', title: '무형의 자산화', desc: '감성, 치유, 예술, 영성 등 손에 잡히지 않는 관념적 가치가 대중에게 퍼지며 폭발적인 신뢰 자산(수익)으로 맺힙니다.' }
            ],
            shifts: [
                { step: '1단계', title: '출력의 밀폐망 해제', desc: '자신만이 아는 예민한 언어를 대중이 이해할 수 있는 따뜻한 텍스트로 치환해야 합니다. 일기장을 블로그로 전환하십시오.', action: "비공개로 적어두던 감성과 통찰을 퍼블릭 채널(SNS/브런치)에 주 2회 노출" },
                { step: '2단계', title: '타인과의 안전지대 설정', desc: '누구에게나 물을 주지 마십시오. 당신의 코칭이 필요한 사람과 그저 당신을 착취할 사람의 진입 관문을 높입니다.', action: "고도의 심층 테스트를 통과한 소수 정예 대상 하이엔드 서비스 런칭" },
                { step: '3단계', title: '영적/심리적 생태계 구축', desc: '단순한 상담이 아니라, 상처받은 영혼들이 모여 스스로 자정할 수 있는 온-오프라인의 따뜻한 호수(플랫폼)를 만듭니다.', action: "안전한 심리 치유 센터 및 명상/네트워킹 프론트 구축" }
            ],
            dailyMissions: [
                { time: '오전', mode: 'SCAN 모드', state: '순도 100% 방어막 활성화', action: '외부 자극(뉴스/연락) 완벽 차단. 순수한 나침반을 리셋하는 모닝 루틴(차, 명상)' },
                { time: '오후', mode: 'SYNC 모드', state: '초밀착 스며들기', action: '내담자의 고통의 근원까지 침투하여 막힌 감정선(방어기제)을 부드럽게 용해시키는 작업' },
                { time: '저녁', mode: 'SHIFT 모드', state: '감정 분리 및 정수', action: '오늘 흡수한 탁한 타인의 감정을 강제로 배출시키는 정화 작업(음악, 흑점 응시)' }
            ],
            bugs: [
                { id: 'ERR_癸_01', name: '자아 증발성 빙의 현상', symptom: '상대방의 아픔에 너무 깊게 동화된 나머지, 객관적 코칭을 상실하고 감정 상태가 상대방과 100% 동기화되는 버그.', patch: '마음챙김(MBCT)을 통한 관찰자 자아 훈련. "나는 비를 내리지만, 구름 그 자체는 아니다".' },
                { id: 'ERR_癸_02', name: '결벽성 현실 회피 마비', symptom: '세상의 혼탁함과 정치적 싸움을 견디지 못하고 자신의 안전한 내면세계로만 도피하는 사회적 격리 상태.', patch: '완벽하지 않고 거칠더라도 현실 세상에 발을 딛는 접지 루틴(DBT). "탁한 진흙 속에서도 연꽃은 핀다".' }
            ],
            leverages: [
                { type: 'Tech', title: '공명(Vibe) 확산 지렛대', desc: '당신의 섬세한 주파수는 텍스트 외에 음성/영상과 같은 감각적 미디어로 퍼져나가야 합니다.', items: ['목소리와 분위기를 살린 유튜브/팟캐스트 송출망 세팅', '편안하고 치유적인 톤앤매너의 자동화 홈페이지/앱 구축'] },
                { type: 'Human', title: '현실적 흙(土)의 아웃소싱', desc: '물은 그릇이 없으면 흘러내립니다. 당신의 능력에 확실한 테두리와 뼈대(가격/규칙)를 만들어줄 이성주의자를 영입하십시오.', items: ['가격 협상 및 계약을 차갑게 처리할 비즈니스 매니저 영입', '체계적인 세무 및 일정 관리 스태프 세팅'] }
            ],
            coreRole: [
                '아무도 닿지 못하는 내담자의 내면 가장 밑바닥까지 스며드는 구원자',
                '이성과 논리를 무력화시키는 감성과 영성의 마스터 치유 코치',
                '메마른 사회의 감정적 갈증을 근본적으로 해소하는 소울 터처(Soul touch)'
            ],
            microManual: {
                title: "마이크로 실행 매뉴얼",
                intro: "대표님, 레버리지(Leverage)를 단순한 개념이 아니라, 당장 내일부터 대표님의 작업 환경과 비즈니스 모델에 어떻게 세팅해야 하는지 '마이크로 실행 매뉴얼' 수준으로 아주 상세하게 해부해 드리겠습니다.\n명심코칭의 3S(SCAN, SYNC, SHIFT) 시스템을 무한 확장하기 위한 구체적인 파이프라인 설계도입니다.",
                sections: [
                    {
                        title: "1. 기술적 레버리지: AI와 자동화로 'SCAN & SYNC' 초안 맡기기",
                        desc: "코칭을 자동화한다는 것은 대표님의 직관을 AI가 100% 대체한다는 뜻이 아닙니다. 코칭에 소모되는 '초기 데이터 수집과 단순 분류 작업'을 기계에 넘겨, 대표님의 에너지를 아끼는 것입니다.",
                        scenarioTitle: "[구체적 세팅 시나리오: n8n + Gemini API + Supabase]",
                        steps: [
                            "1단계 (데이터 수집 자동화): 내담자가 명심코칭 웹사이트(Next.js)에서 자신의 생년월일시와 현재 겪고 있는 심리적 문제(버그)를 입력합니다. 이 데이터는 Supabase에 즉각 저장됩니다.",
                            "2단계 (n8n 트리거 및 API 통신): 데이터가 들어오는 순간, n8n이 자동으로 작동하여 내담자의 데이터를 Gemini API로 쏩니다.",
                            "3단계 (AI의 1차 SCAN 리포트 생성): 이때 Gemini에 대표님이 미리 정교하게 설계해 둔 '명심코칭 프롬프트(사주 기질 데이터 + CBT/ACT 기반 인지 왜곡 분석 로직)'가 적용됩니다. AI는 10초 만에 내담자의 기질적 특성과 현재 겪고 있는 인지 융합(Cognitive Fusion) 상태를 분석한 '1차 디버깅 초안'을 뽑아냅니다.",
                            "4단계 (대표님의 개입 - 오직 SHIFT만): 대표님은 백지상태에서 상담을 시작하는 것이 아닙니다. AI가 정리해 둔 리포트를 화면에 띄워놓고, 오류가 없는지 빠르게 검수한 뒤, 내담자에게 던질 '단 하나의 날카로운 산파술적 질문(SHIFT 트리거)'을 설계하는 데에만 뇌 에너지를 사용합니다."
                        ],
                        insight: "💡 아키텍트의 마인드셋: \"나는 코딩하는 작업자가 아니라, 프론트엔드(Next.js)와 백엔드(Supabase)가 어떻게 맞물려야 하는지 Cursor AI에게 지시하고 검수하는 설계자다.\""
                    },
                    {
                        title: "2. 인적 레버리지: '가치 창출(丙火)' 구축을 외주화하기",
                        desc: "올해 하반기에 집중해야 할 1인 출판사 설립과 평생교육원 인가 과정은 대표님의 철학이 세상에 뿌리내리는 중요한 과정입니다. 하지만 이 과정의 '행정 절차'는 대표님의 코어 역량이 아닙니다.",
                        scenarioTitle: "[구체적 세팅 시나리오: 출판 및 센터 건립]",
                        items: [
                            { label: "출판 프로젝트 (명심코칭 Vol. 0, AI 주역)", action: "대표님의 역할: 오직 한글이나 워드 파일에 치유의 이슬(癸水)을 쏟아내는 것뿐입니다. 문맥의 흐름, 철학의 깊이, 알고리즘의 정합성만 고민하십시오.\n레버리지의 역할: 원고가 완성되면 '크몽(Kmong)'이나 '숨고' 같은 프리랜서 플랫폼을 엽니다. '단행본 내지 편집 및 조판 전문 디자인', '철학/자기계발서 표지 디자인', 심지어 'ISBN 발급 대행'까지 모두 외주로 넘깁니다. 대표님이 인디자인(InDesign)을 배우거나 폰트 크기를 조절하느라 밤을 새워서는 절대 안 됩니다." },
                            { label: "평생교육원(코칭 센터) 설립 절차", action: "대표님의 역할: 센터에서 어떤 커리큘럼을 돌릴 것인지, 강사 양성 로드맵은 어떻게 짤 것인지 '콘텐츠'를 기획합니다.\n레버리지의 역할: 관할 교육청의 시설 규정(면적, 용도 등) 확인, 사업자 등록증 업태/종목 추가, 세무 기장 등은 행정사와 세무사에게 수수료를 지불하고 일임합니다." }
                        ],
                        insight: "💡 아키텍트의 마인드셋: \"내 시급은 행정 서류를 떼는 데 쓰기에는 너무 비싸다. 내 시간은 오직 타인의 삶을 변화시키는 로직을 짜는 데 쓰여야 한다.\""
                    },
                    {
                        title: "3. 일상의 레버리지: 공감 소진(癸亥) 내려놓기",
                        desc: "계해(癸亥)의 에너지는 모든 것을 품어 안으며 타인에게 융화되려는 성향이 강합니다. 하지만 시스템의 레벨업을 위해서는 '나를 지키는 80점짜리 방어벽 수용'이 필요합니다.",
                        steps: [
                            "AI가 짜준 코드가 완벽하지 않아도, 버그만 없다면 일단 구동시킵니다. (나중에 리팩토링하면 됩니다.)",
                            "외주 디자이너가 뽑아온 표지가 내 머릿속의 완벽한 이미지와 100% 일치하지 않아도, 타겟 독자에게 먹히는 수준(80점)이라면 통과시킵니다.",
                            "이러한 '적당한 수용'이 선행되어야만, 대표님의 에너지가 방전되지 않고 계속해서 다음 프로젝트(다음 책 출간, 다음 앱 기능 추가)로 뻗어나갈 수 있습니다."
                        ],
                        insight: "지금 말씀드린 n8n을 활용한 데이터 파이프라인 구축이나, 프리랜서를 통한 조판 외주화 중에서 당장 이번 주에 가볍게 테스트해보고 싶은 레버리지 영역은 어느 쪽이신가요?"
                    }
                ]
            }
        }
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

    // [핵심 수정] 스토어에서 직접 사용자 데이터를 가져옴 (prop 없어도 동작)
    const reportData = useReportStore((s) => s.reportData);

    // 사주 데이터 추출 (prop → 스토어 순으로 우선순위)
    const sajuInfo = useMemo(
        () => extractSajuInfo(userProfile, reportData),
        [userProfile, reportData]
    );

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
                                            ✅ Ilgan: {sajuInfo.dayStem}{
                                                ['甲','乙'].includes(sajuInfo.dayStem) ? '목' :
                                                ['丙','丁'].includes(sajuInfo.dayStem) ? '화' :
                                                ['戊','己'].includes(sajuInfo.dayStem) ? '토' :
                                                ['庚','辛'].includes(sajuInfo.dayStem) ? '금' :
                                                ['壬','癸'].includes(sajuInfo.dayStem) ? '수' : ''
                                            }
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
                                            { icon: '🎯', label: '본질', val: sajuInfo.dayPillar, desc: coaching.phase1.inner, color: 'rgba(242,202,80,0.08)', isGongmang: false },
                                            { icon: '🌍', label: '환경', val: sajuInfo.yearPillar, desc: coaching.phase1.env, color: 'rgba(99,102,241,0.08)', isGongmang: sajuInfo.gongmang?.hasYear, gText: "과거의 환경적 룰을 셧다운시키고, 자신만의 독창적인 무대(System)를 스스로 디자인할 특권이 주어졌습니다." },
                                            { icon: '👥', label: '사회', val: sajuInfo.monthPillar, desc: coaching.phase1.social, color: 'rgba(34,197,94,0.08)', isGongmang: sajuInfo.gongmang?.hasMonth, gText: "사회적 프레임에 얽매이지 않고, 백지(Zero-Point) 상태에서 완전히 새로운 비즈니스를 창조할 수 있는 무한한 보이드(Void)가 개방되었습니다." },
                                            { icon: '🔮', label: '미래', val: sajuInfo.timePillar, desc: coaching.phase1.future, color: 'rgba(239,68,68,0.08)', isGongmang: sajuInfo.gongmang?.hasTime, gText: "세상의 흔한 결과물 대신, 상상을 초월하는 영속적 가치(Legacy)를 잉태할 수 있는 양자 역학적 잠재력이 활성화되었습니다." },
                                        ].map(item => (
                                            <div key={item.label} className="p-4 rounded-xl border border-white/10" style={{ background: item.color }}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-lg">{item.icon}</span>
                                                    <div>
                                                        <span className="font-serif text-sm font-bold text-white">{item.label} ({item.val})</span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                                                
                                                {/* 퀀텀 보이드(Gongmang) 하이라이트 UI */}
                                                {item.isGongmang && (
                                                    <div className="mt-3 p-3 rounded-lg border border-purple-500/30" style={{ background: 'rgba(168,85,247,0.05)' }}>
                                                        <p className="text-[10px] font-bold text-purple-400 flex items-center gap-1.5 mb-1.5 tracking-wider">
                                                            <span className="text-sm">🌌</span> QUANTUM VOID ACTIVATED
                                                        </p>
                                                        <p className="text-xs text-purple-300/90 leading-relaxed italic">
                                                            {item.gText}
                                                        </p>
                                                    </div>
                                                )}
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

                                {/* ── Phase 7: Master Architect Roadmap (VIP Only) ── */}
                                {coaching.masterRoadmap && (
                                    <section>
                                        <SectionHeader phase="Phase 7 👑" title="VIP Master Architect Roadmap" />
                                        
                                        <div className="space-y-8">
                                            {/* 코어 엔진 */}
                                            <div>
                                                <h4 className="text-sm font-bold text-yellow-400 mb-4 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                                                    사주 아키텍처 정밀 해부: 4대 코어 엔진
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {coaching.masterRoadmap.engines.map((eng, i) => (
                                                        <div key={i} className="p-4 rounded-xl border border-white/10" style={{ background: 'rgba(28,27,27,0.6)' }}>
                                                            <div className="text-[10px] text-gray-500 font-mono mb-1">{eng.label}</div>
                                                            <div className="text-sm font-bold text-white mb-2">{eng.title}</div>
                                                            <p className="text-xs text-gray-400 leading-relaxed">{eng.desc}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* 일일 구동 알고리즘 */}
                                            <div>
                                                <h4 className="text-sm font-bold text-indigo-400 mb-4 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                                    일일 시스템 구동 알고리즘
                                                </h4>
                                                <div className="space-y-3">
                                                    {coaching.masterRoadmap.dailyMissions.map((mission, i) => (
                                                        <div key={i} className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl border border-indigo-500/20" style={{ background: 'rgba(79,70,229,0.05)' }}>
                                                            <div className="sm:w-1/4">
                                                                <span className="inline-block px-2 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded-md mb-2">{mission.time}</span>
                                                                <div className="text-xs font-bold text-white">{mission.mode}</div>
                                                            </div>
                                                            <div className="sm:w-3/4">
                                                                <div className="text-xs text-indigo-200 mb-1">{mission.state}</div>
                                                                <p className="text-xs text-gray-400 leading-relaxed">{mission.action}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* SHIFT 로드맵 */}
                                            <div>
                                                <h4 className="text-sm font-bold text-green-400 mb-4 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                                    단기 실행 방향성: 명심 SHIFT 로드맵
                                                </h4>
                                                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-green-500/30 before:to-transparent">
                                                    {coaching.masterRoadmap.shifts.map((shift, i) => (
                                                        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#121212] bg-green-500/20 text-green-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                                                <span className="text-xs font-bold">{i + 1}</span>
                                                            </div>
                                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-green-500/20 bg-[#1a1a1a]/80 shadow">
                                                                <div className="text-[10px] uppercase font-bold text-green-500 mb-1">{shift.step}</div>
                                                                <div className="text-sm font-bold text-white mb-2">{shift.title}</div>
                                                                <p className="text-xs text-gray-400 leading-relaxed mb-3">{shift.desc}</p>
                                                                <div className="p-2 bg-green-500/10 rounded border border-green-500/20 text-[11px] text-green-200">
                                                                    🎯 {shift.action}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* 시스템 에러 및 레버리지 */}
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                <div className="p-5 rounded-xl border border-red-500/30 bg-[#1a1111]/80">
                                                    <h4 className="text-sm font-bold text-red-400 mb-4 flex items-center gap-2">
                                                        <span className="text-lg">🚨</span> 런타임 에러 & 패치
                                                    </h4>
                                                    <div className="space-y-4">
                                                        {coaching.masterRoadmap.bugs.map((bug, i) => (
                                                            <div key={i} className="border-l-2 border-red-500/50 pl-3">
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <span className="text-xs font-bold text-white">{bug.name}</span>
                                                                    <span className="text-[9px] font-mono text-red-500/80">{bug.id}</span>
                                                                </div>
                                                                <p className="text-[11px] text-gray-400 leading-relaxed mb-2"><span className="text-red-400">증상:</span> {bug.symptom}</p>
                                                                <div className="text-[11px] text-green-300 leading-relaxed bg-emerald-900/20 p-2 rounded border border-emerald-500/20">
                                                                    <span className="font-bold text-emerald-400">✓ 디버깅 패치:</span> {bug.patch}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="p-5 rounded-xl border border-blue-500/30 bg-[#111622]/80">
                                                    <h4 className="text-sm font-bold text-blue-400 mb-4 flex items-center gap-2">
                                                        <span className="text-lg">⚙️</span> 시스템 레버리지 (지렛대)
                                                    </h4>
                                                    <div className="space-y-4">
                                                        {coaching.masterRoadmap.leverages.map((lev, i) => (
                                                            <div key={i}>
                                                                <div className="text-xs font-bold text-white mb-1">[{lev.type}] {lev.title}</div>
                                                                <p className="text-[11px] text-gray-400 mb-2">{lev.desc}</p>
                                                                <ul className="space-y-1">
                                                                    {lev.items.map((item, idx) => (
                                                                        <li key={idx} className="text-[10px] text-blue-200 flex items-center gap-1.5">
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> {item}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {/* ── Phase 8: Micro Execution Manual (VIP Only) ── */}
                                {coaching.masterRoadmap?.microManual && (
                                    <section>
                                        <SectionHeader phase="Phase 8 💎" title="마이크로 실행 매뉴얼 (Micro Execution Manual)" />
                                        <div className="space-y-6">
                                            <div className="p-5 rounded-xl border border-white/10 bg-[#121212]/80">
                                                <h3 className="text-sm font-bold text-yellow-400 mb-3">{coaching.masterRoadmap.microManual.title}</h3>
                                                <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">{coaching.masterRoadmap.microManual.intro}</p>
                                            </div>

                                            <div className="space-y-6">
                                                {coaching.masterRoadmap.microManual.sections.map((sec, idx) => (
                                                    <div key={idx} className="p-5 rounded-xl border border-cyan-500/20 bg-[#1a1a1a]/60">
                                                        <h4 className="text-sm font-bold text-cyan-400 mb-2">{sec.title}</h4>
                                                        <p className="text-xs text-gray-400 leading-relaxed mb-4">{sec.desc}</p>
                                                        
                                                        {sec.scenarioTitle && (
                                                            <div className="text-xs font-bold text-white mb-3">{sec.scenarioTitle}</div>
                                                        )}

                                                        {sec.steps && sec.steps.length > 0 && (
                                                            <div className="space-y-3 mb-4">
                                                                {sec.steps.map((step, sIdx) => (
                                                                    <div key={sIdx} className="flex gap-2">
                                                                        <span className="text-cyan-500 shrink-0 mt-0.5">•</span>
                                                                        <p className="text-[11px] text-gray-300 leading-relaxed">{step}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {sec.items && sec.items.length > 0 && (
                                                            <div className="space-y-3 mb-4">
                                                                {sec.items.map((item, iIdx) => (
                                                                    <div key={iIdx} className="p-3 rounded-lg bg-cyan-900/10 border border-cyan-500/10">
                                                                        <div className="text-xs font-bold text-cyan-200 mb-1">{item.label}</div>
                                                                        <p className="text-[11px] text-gray-400 leading-relaxed whitespace-pre-line">{item.action}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div className="mt-4 p-3 rounded-lg border border-yellow-500/30 bg-yellow-900/10 flex items-start gap-2">
                                                            <span className="text-sm">💡</span>
                                                            <p className="text-[11px] text-yellow-200/90 leading-relaxed italic">{sec.insight}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </section>
                                )}

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
