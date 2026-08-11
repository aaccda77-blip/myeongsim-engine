'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity, ShieldAlert, Zap, Database } from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';
import { calculateSaju, calculateSajuStats } from '@/lib/saju/SajuEngine';

// ─────────────────────────────────────────────────────────────
// 천간 매핑 (한글 → 한자)
// ─────────────────────────────────────────────────────────────
const STEM_HAN: Record<string, string> = {
    '갑':'甲','을':'乙','병':'丙','정':'丁','무':'戊',
    '기':'己','경':'庚','신':'辛','임':'壬','계':'癸',
};
const VALID_STEMS = new Set(['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']);

/**
 * [핵심 함수] 다중 소스에서 일간(日干) 한자를 안전하게 추출
 * 우선순위: sajuInfo.dayStem → reportData.saju.fourPillars.day.gan → reportData.saju.dayMaster
 */
function resolveDayStem(sajuInfo: any, reportData: any): string {
    // 1) sajuInfo.dayStem이 유효 한자인 경우
    if (sajuInfo?.dayStem && VALID_STEMS.has(sajuInfo.dayStem)) {
        return sajuInfo.dayStem;
    }

    const saju = reportData?.saju || {};

    // 2) fourPillars.day.gan (한글 or 한자)
    const dayGan: string = saju.fourPillars?.day?.gan || '';
    if (dayGan) {
        const mapped = STEM_HAN[dayGan.charAt(0)] || dayGan.charAt(0);
        if (VALID_STEMS.has(mapped)) return mapped;
        if (VALID_STEMS.has(dayGan.charAt(0))) return dayGan.charAt(0);
    }

    // 3) dayMaster 문자열 파싱 (예: "辛", "신금", "辛金", "신 (#aaa)")
    const dm: string = saju.dayMaster || '';
    if (dm) {
        // 한자 우선
        for (const ch of dm) {
            if (VALID_STEMS.has(ch)) return ch;
        }
        // 한글
        const first = dm.trim().charAt(0);
        const mapped = STEM_HAN[first];
        if (mapped) return mapped;
    }

    // 4) 최후 폴백 — birthDate로 SajuEngine 호출 대신 '?' 반환 (UI에서 처리)
    return '?';
}

interface DiagnosticDashboardProps {
    sajuInfo: any;
    reportData: any;
    onStartChat?: (intent?: string) => void;
}

// ─────────────────────────────────────────────────────────────
// 일간(甲~癸)별 완전 개인화 분석 데이터 맵
// ─────────────────────────────────────────────────────────────
const ILGAN_DIAGNOSTIC_DB: Record<string, {
    architectNote: string;
    darkCodes: { label: string; key: 'perfection' | 'anxiety' | 'decision'; desc: string; color: string }[];
    roadmap: { type: string; title: string; items: string[] }[];
    awarenessQuestions: { q: string; desc: string }[];
}> = {
    '甲': {
        architectNote: '甲木(갑목) 영혼의 기운: 곧게 뻗어가는 강력한 추진력(木)이 당신 내면의 가장 아름다운 불꽃입니다. 다만 앞만 보고 달리는 마음이 주변 사람들의 온기와 부딪혀 마음의 울타리를 외롭게 만들 수 있습니다. 멈추지 않고 달리는 것도 용기이지만, 지금 당장 당신 주변의 소중한 사람들이 함께 숨을 쉬고 있는지 다정하게 살피십시오. 깊은 뿌리가 뒷받침된 성장이 거친 풍랑을 이겨냅니다.',
        darkCodes: [
            { label: '혼자 짊어지려는 중압감', key: 'perfection', desc: '"내 방식만이 정답"이라는 조급함이 주변의 다정한 도움을 차단하고 마음의 문을 닫게 만듭니다.', color: 'from-green-400 to-emerald-600' },
            { label: '열정 과열과 번아웃', key: 'anxiety', desc: '전속력으로 달리다 내면의 에너지가 바닥나는 패턴. 잠시 쉬어가는 뇌 쿨링 호흡이 필요합니다.', color: 'from-lime-400 to-green-600' },
            { label: '마음의 소원함과 외로움', key: 'decision', desc: '속도를 우선시하며 타인을 뒤에 두고 혼자 달릴 때 생기는 쓸쓸한 마음의 경계입니다.', color: 'from-teal-400 to-cyan-600' },
        ],
        roadmap: [
            { type: '오늘', title: '속도 조절 — 3초 멈춤 루틴', items: ['가장 최근 결정 1건에 대해 소중한 사람 의견 경청', '"이게 진짜 내 마음에 평온을 주는가?" 30초 자문'] },
            { type: '1주일', title: '다정한 대화의 장 마련', items: ['나의 꿈과 고민을 편안하게 나누는 따뜻한 대화 세션', '타인의 다른 의견을 3일간 마음 열고 수용해보기'] },
            { type: '1개월', title: '함께 성장하는 신뢰의 울타리', items: ['혼자 애쓰던 일 1가지 내려놓고 부탁해보기', '소중한 이들에게 마음속 감사를 솔직하게 표현하기'] },
        ],
        awarenessQuestions: [
            { q: '지금 내가 "혼자" 해결하려는 일 중, 누군가의 따뜻한 도움을 받으면 훨씬 마음이 가벼워질 수 있는 것은 무엇인가요?', desc: '甲木의 강한 자립심이 때로는 내면의 고독을 부릅니다. 마음을 열고 도움을 청하는 용기를 내어보세요.' },
            { q: '내가 가장 최근에 "내 생각을 내려놓았던" 순간은 언제였나요? 그 경험이 내 마음을 한결 편안하게 해주었나요?', desc: '인정과 내려놓음은 패배가 아니라 영혼의 그릇이 더욱 커지는 아름다운 성숙입니다.' },
        ],
    },
    '乙': {
        architectNote: '乙木(을목) 영혼의 기운: 바람에 흔들리되 꺾이지 않는 부드러운 친화력과 연결 능력이 당신의 가장 큰 자산입니다. 다만 남들의 부탁에 치여 정작 나 자신의 소중한 마음을 돌보지 못하는 자아 희석 현상이 생길 수 있습니다. 세상과 친절히 연결되되, 내 마음의 뿌리(자아)는 단단히 지키셔야 합니다.',
        darkCodes: [
            { label: '남 눈치 보기와 자아 흔들림', key: 'perfection', desc: '타인에게 맞추다 정작 내가 원하는 진짜 삶의 방향을 놓치고 마음이 서늘해지는 습관입니다.', color: 'from-green-400 to-teal-600' },
            { label: '마음의 울타리 붕괴', key: 'anxiety', desc: '거절하지 못하고 모든 요구를 다 안아주려다 내면의 에너지가 고갈되고 있습니다.', color: 'from-emerald-400 to-green-600' },
            { label: '선택의 망설임과 우유부단', key: 'decision', desc: '갈등을 피하려다 중요한 결정을 미루는 마음. 이제는 나를 위한 용기 있는 선택이 필요합니다.', color: 'from-teal-400 to-emerald-600' },
        ],
        roadmap: [
            { type: '오늘', title: '"정중한 다정한 거절" 연습', items: ['부담스러운 요청 1건에 "지금은 어려워요" 정중히 거절', '"내가 진짜 좋아하는 것" 3가지 기록'] },
            { type: '1주일', title: '나만의 휴식 공간 확보', items: ['혼자만의 고요한 30분 명상 및 휴식 시간 확정', '남의 시선에 흔들리지 않는 나만의 취미 활동'] },
            { type: '1개월', title: '당당한 내면의 주권 회복', items: ['내 철학과 가치가 담긴 작은 목표 하나 완성하기', '나를 응원하는 따뜻한 이들과 깊은 관계 맺기'] },
        ],
        awarenessQuestions: [
            { q: '지금 내 곁의 인연들 중, 내 마음에 든든한 용기를 주는 이와 에너지를 소모시키는 이는 누구인가요?', desc: '乙木의 연결 능력은 아름답지만, 내 영혼을 피로하게 만드는 인연에는 다정한 울타리가 필요합니다.' },
            { q: '"남을 기쁘게 하려는 마음"을 잠시 내려놓는다면, 오늘 당장 나를 위해 하고 싶은 일은 무엇인가요?', desc: '나 자신을 먼저 수용하고 안아줄 때 세상도 나를 진심으로 존중합니다.' },
        ],
    },
    '丙': {
        architectNote: '丙火(병화) 영혼의 기운: 태양처럼 만물을 따뜻하게 비추는 열정과 명랑함이 영혼의 본질입니다. 다만 열정이 너무 강렬하여 스스로를 과도하게 태우는 번아웃 현상이 감지됩니다. 세상에 온기를 뿜어내되, 스스로 타버리지 않도록 가슴을 가만히 식혀주는 뇌 쿨링이 시급합니다.',
        darkCodes: [
            { label: '에너지 과열과 번아웃', key: 'perfection', desc: '타인에게 너무 많은 것을 주려다 자신의 가슴이 달아오르고 과열되는 습관입니다.', color: 'from-orange-400 to-red-600' },
            { label: '타인의 인정에 대한 목마름', key: 'anxiety', desc: '칭찬이나 반응이 없으면 마음이 허전해집니다. 내면의 가치를 스스로 인정해 주는 마음이 필요합니다.', color: 'from-amber-400 to-orange-600' },
            { label: '성급한 결정과 조급함', key: 'decision', desc: '열정이 앞서 충분한 숙고 없이 시작했다가 쉽게 피로해지는 행동 패턴입니다.', color: 'from-red-400 to-pink-600' },
        ],
        roadmap: [
            { type: '오늘', title: '열 식히기 — 15분 고요 루틴', items: ['하루 15분 아무것도 하지 않고 편안히 눕기', '오늘의 감정을 있는 그대로 다정히 받아들이기'] },
            { type: '1주일', title: '선택과 집중의 지혜', items: ['가장 소중한 일 1가지에만 에너지를 다정하게 쏟기', '나머지 일에는 70%의 편안함으로 임하기'] },
            { type: '1개월', title: '지속 가능한 열정 시스템', items: ['번아웃 신호(가슴 답답함)를 미리 알아차리는 호흡법', '수면과 자연 속에서의 충전 시간 정례화'] },
        ],
        awarenessQuestions: [
            { q: '지금 내가 가장 많은 에너지를 쏟는 일이 진짜 내 가슴을 뛰게 하는 일인가요, 남에게 보여주기 위한 일인가요?', desc: '丙火의 태양 빛은 올바른 방향을 지향할 때 가장 아름답습니다.' },
            { q: '"항상 밝아야 한다"는 부담을 내려놓는다면, 지금 내 가슴에 속삭이고 싶은 말은 무엇인가요?', desc: '가끔은 그늘에 쉬어가도 당신은 여전히 세상에서 가장 빛나는 태양입니다.' },
        ],
    },
    '丁': {
        architectNote: '丁火(정화) 영혼의 기운: 어둠 속을 밝히는 은은한 촛불처럼 섬세한 통찰력과 온기가 당신의 영혼입니다. 다만 속마음을 밖으로 표현하지 않고 혼자 삭이는 무거운 자책으로 마음속 불꽃이 쓰라릴 수 있습니다. 내면의 다정한 불꽃을 솔직한 언어로 세상에 표현해 보세요.',
        darkCodes: [
            { label: '속마음 숨기기와 감정 삭임', key: 'perfection', desc: '내면의 솔직한 감정을 밖으로 드러내지 않아 가슴속 답답함과 중압감이 축적되는 습관입니다.', color: 'from-pink-400 to-rose-600' },
            { label: '이상과 현실 사이의 자책', key: 'anxiety', desc: '마음속 완벽한 꿈과 실제 상황의 차이로 인해 스스로를 엄격히 비난하게 되는 패턴입니다.', color: 'from-rose-400 to-pink-600' },
            { label: '자기희생과 쓸쓸함', key: 'decision', desc: '남을 위해 자신을 끝없이 헌신하다 기운이 소진되고 가슴이 서늘해지는 마음입니다.', color: 'from-fuchsia-400 to-purple-600' },
        ],
        roadmap: [
            { type: '오늘', title: '내 마음 솔직히 기록하기', items: ['오늘 느낀 감정을 있는 그대로 3단어로 다정히 작성', '"지금 내 마음이 원하는 것" 솔직히 알아차리기'] },
            { type: '1주일', title: '속마음 나누기 훈련', items: ['나를 진심으로 이해해 주는 1명에게 속마음 편히 털어놓기', '완벽하지 않은 나 자신을 그대로 온전히 안아주기'] },
            { type: '1개월', title: '편안한 내면의 평화 안착', items: ['80% 미학으로 완벽주의를 내려놓고 가볍게 실천하기', '나 자신을 먼저 아끼고 보살피는 삶의 자세'] },
        ],
        awarenessQuestions: [
            { q: '지금 이 순간, 나는 타인을 위해 마음을 태우고 있나요, 나 자신의 행복을 위해 태우고 있나요?', desc: '丁火의 빛이 나 자신을 먼저 비출 때 세상을 향한 온기도 진정으로 따뜻해집니다.' },
            { q: '"완벽해야 한다"는 자책을 내려놓는다면, 오늘 내 마음에 선물하고 싶은 편안함은 무엇인가요?', desc: '있는 그대로의 당신 모습 자체가 이미 충분히 아름다운 은빛 촛불입니다.' },
        ],
    },
    '戊': {
        architectNote: '戊土(무토) 영혼의 기운: 웅장한 대지처럼 모든 것을 넓은 품으로 안아주는 든든함과 포용력이 영혼의 본질입니다. 다만 너무 많은 사연과 걱정을 다 품으려다 내면의 중심이 흔들리고 지칠 수 있습니다. 세상을 따뜻하게 감싸되, 나 자신의 코어 가치를 명확히 지키십시오.',
        darkCodes: [
            { label: '지나친 포용과 내면 피로', key: 'perfection', desc: '모든 사람의 짐을 다 받으려다 정작 내 가슴이 무거워지고 중심이 지쳐버리는 습관입니다.', color: 'from-yellow-400 to-amber-600' },
            { label: '변화에 대한 두려움', key: 'anxiety', desc: '익숙함에 머물려다 새로운 기회를 미루게 되는 마음. 따뜻한 변화에 마음을 열 때입니다.', color: 'from-amber-400 to-yellow-600' },
            { label: '에너지 분산과 무거움', key: 'decision', desc: '너무 많은 일에 마음을 쓰느라 정작 중요한 일에 집중하지 못하는 안타까움입니다.', color: 'from-orange-400 to-amber-600' },
        ],
        roadmap: [
            { type: '오늘', title: '가장 중요한 1가지 선택', items: ['오늘 내 마음에 진짜 중요한 일 1가지만 챙기기', '남의 걱정거리 1가지는 조용히 내려놓기'] },
            { type: '1주일', title: '다정한 마음의 경계선 설정', items: ['지나친 부탁에 "지금은 조금 어렵습니다" 표현해보기', '내 마음의 에너지를 채우는 고요한 시간 챙기기'] },
            { type: '1개월', title: '단단한 중심 바로 세우기', items: ['내 삶의 핵심 가치 리스트 작성 및 실천', '작은 변화를 즐겁게 수용해보는 도전 루틴'] },
        ],
        awarenessQuestions: [
            { q: '지금 내가 "꼭 내가 짊어져야 한다"고 생각하는 짐 중, 내려놓아도 괜찮은 것은 무엇인가요?', desc: '戊土의 든든함도 나 자신의 평온이 우선될 때 세상을 진정으로 포용할 수 있습니다.' },
            { q: '새로운 변화를 머뭇거리게 만드는 마음속 진짜 걱정은 무엇인가요?', desc: '대지는 계절의 변화를 받아들일 때 가장 풍요로운 결실을 맺습니다.' },
        ],
    },
    '己': {
        architectNote: '己土(기토) 영혼의 기운: 곡식을 키워내는 비옥한 전답처럼 섬세함과 자비로운 배려심이 당신 영혼의 선물입니다. 다만 머릿속에 품은 수많은 좋은 생각과 아이디어를 밖으로 표현하지 못하는 안타까움이 생길 수 있습니다. 80% 미학으로 마음속 씨앗을 세상을 향해 용기 있게 틔워내세요.',
        darkCodes: [
            { label: '속으로만 품는 아이디어', key: 'perfection', desc: '좋은 생각과 마음을 내면에만 가두어두고 밖으로 표현하지 못해 답답해지는 습관입니다.', color: 'from-yellow-400 to-lime-600' },
            { label: '거절과 실패에 대한 걱정', key: 'anxiety', desc: '시작하기 전 과도한 걱정으로 배포를 미루게 되는 마음. 가벼운 시작이 답입니다.', color: 'from-lime-400 to-yellow-600' },
            { label: '남을 향한 과도한 배려', key: 'decision', desc: '타인의 눈치를 보느라 정작 내가 원하는 용기 있는 선택을 미루게 되는 행동 패턴입니다.', color: 'from-green-400 to-lime-600' },
        ],
        roadmap: [
            { type: '오늘', title: '마음속 생각 1가지 밖으로 내어놓기', items: ['머릿속 아이디어를 소중한 사람에게 텍스트로 전달', '"완벽하지 않아도 괜찮아" 스스로를 격려하기'] },
            { type: '1주일', title: '가벼운 나눔 훈련', items: ['내 생각을 글이나 표현으로 세상에 나눠보기', '상대의 반응에 연연하지 않고 편안히 수용하기'] },
            { type: '1개월', title: '용기 있는 당당한 표현법', items: ['나만의 작은 프로젝트 세상에 가볍게 선보이기', '내 마음의 우선순위를 1번으로 채우는 연습'] },
        ],
        awarenessQuestions: [
            { q: '오랫동안 마음속에 품어둔 꿈이 있다면, 오늘 당장 아주 작게라도 시작해볼 수 있는 일은 무엇인가요?', desc: '己土의 비옥한 땅은 씨앗을 심고 싹을 틔울 때 비로소 풍요로운 꽃밭이 됩니다.' },
            { q: '타인을 배려하느라 미뤄두었던 "나만을 위한 진짜 용기"는 무엇인가요?', desc: '나를 아끼는 마음이 모든 아름다운 관계의 뿌리입니다.' },
        ],
    },
    '庚': {
        architectNote: '庚金(경금) 영혼의 기운: 단단한 강철처럼 탁월한 결단력과 과감한 추진력이 영혼의 강점입니다. 다만 "나는 항상 강해야 한다"는 엄격함이 내면의 유연함을 차단하여 부딪힘을 만들 수 있습니다. 강철도 제련을 거칠 때 명검이 되듯, 마음속에 다정한 부드러움을 더해 보세요.',
        darkCodes: [
            { label: '완강함과 타협의 어려움', key: 'perfection', desc: '"내 방식만이 올바르다"는 고집으로 타인의 다정한 조언을 놓치고 마음이 경직되는 습관입니다.', color: 'from-slate-400 to-gray-600' },
            { label: '이겨야 한다는 중압감', key: 'anxiety', desc: '항상 승리해야 한다는 압박감에 마음이 쉴 사이 없이 긴장해 있는 패턴입니다.', color: 'from-zinc-400 to-slate-600' },
            { label: '내면 감정의 억압', key: 'decision', desc: '약한 모습을 보이지 않으려 지친 감정을 억지로 누르다 속이 타들어가는 마음입니다.', color: 'from-gray-400 to-zinc-600' },
        ],
        roadmap: [
            { type: '오늘', title: '유연성 한 스푼 — 경청하기', items: ['타인의 의견에 "그럴 수도 있겠네요" 따뜻하게 수용', '오늘 하루 마음의 긴장을 풀고 부드럽게 웃어보기'] },
            { type: '1주일', title: '내면 감정 자비롭게 안아주기', items: ['"지금 내 마음이 지쳐있구나" 솔직하게 인정하기', '강함이 아닌 솔직함으로 사람들과 마음 터놓기'] },
            { type: '1개월', title: '부드러운 용기의 명검 완비', items: ['경쟁보다는 함께 협력하는 기쁨 경험하기', '누군가에게 내 솔직한 고민을 나누고 도움 청하기'] },
        ],
        awarenessQuestions: [
            { q: '지금 내가 물러서지 않겠다고 고집하는 일 중, 다정하게 풀어가면 훨씬 쉬워질 수 있는 것은 무엇인가요?', desc: '진정한 강함은 부드러움을 품을 때 더욱 빛납니다.' },
            { q: '"항상 강해야 한다"는 무거운 짐을 내려놓는다면, 오늘 내 영혼에 전하고 싶은 안식은 무엇인가요?', desc: '솔직하게 도움을 청하는 것 또한 가장 아름다운 용기입니다.' },
        ],
    },
    '辛': {
        architectNote: '辛金(신금) 영혼의 기운: 보석처럼 정교하고 맑으며 아름다움을 추구하는 섬세함이 영혼의 매력입니다. 다만 "100점이 아니면 안 돼"라는 완벽주의 다크코드가 마음을 옥죄어 시작조차 미루게 만드는 완벽주의 마비를 부를 수 있습니다. "80% 미학"으로 마음의 짐을 내려놓고 가볍게 세상에 선보이세요.',
        darkCodes: [
            { label: '완벽주의 마비와 자책', key: 'perfection', desc: '100점 무결점에 갇혀 배포나 시작을 미루고 스스로를 까다롭게 비난하는 습관입니다.', color: 'from-cyan-400 to-blue-600' },
            { label: '미래에 대한 조급함과 불안', key: 'anxiety', desc: '혹시 모를 작은 실수나 실패를 미리 걱정하느라 뇌의 과열이 심해지는 패턴입니다.', color: 'from-indigo-400 to-purple-600' },
            { label: '결정 장애와 머뭇거림', key: 'decision', desc: '이 길인가 저 길인가 너무 오랫동안 비교 분석하다 좋은 타이밍을 놓치는 아쉬움입니다.', color: 'from-cyan-400 to-teal-600' },
        ],
        roadmap: [
            { type: '오늘', title: '80% 미학 실천하기', items: ['80점 수준에서 완벽주의를 내려놓고 가볍게 시도', '나를 향한 엄격한 자책 멈추고 온전히 수용하기'] },
            { type: '1주일', title: '마음 쿨링 호흡법', items: ['불안이 올 때 깊은 숨을 내쉬며 "괜찮아" 속삭이기', '완성되지 않은 초안이라도 가볍게 공유해보기'] },
            { type: '1개월', title: '빛나는 보석의 자유로운 발현', items: ['나만의 독창적 역량을 편안하게 세상에 나누기', '실수를 배움의 소중한 과정으로 다정하게 받아들이기'] },
        ],
        awarenessQuestions: [
            { q: '지금 내가 "완벽하지 못할까 봐" 미루고 있는 일 중, 오늘 80% 가볍게 배포해볼 수 있는 것은 무엇인가요?', desc: '辛금 보석의 진짜 미학은 완성된 결과물이 아니라 가볍게 시도하는 용기에서 비롯됩니다.' },
            { q: '나를 가장 옥죄던 완벽주의 자책을 내려놓는다면, 오늘 내 가슴에 밀려올 평온함은 어떤 느낌일까요?', desc: '이미 충분히 빛나는 당신 자신을 따뜻하게 온기로 안아주세요.' },
        ],
    },
    '壬': {
        architectNote: '壬水(임수) 영혼의 기운: 깊고 거대한 강물처럼 드넓은 지혜와 아이디어가 영혼의 선물입니다. 다만 생각의 깊이가 너무 깊어 현실에서의 가벼운 실천이 막히는 정체 현상이 생길 수 있습니다. 거대한 강물도 한 방울의 물줄기에서 시작하듯, 오늘 당장 아주 작은 행동 하나를 세상에 흘려보내십시오.',
        darkCodes: [
            { label: '생각 과잉과 실행 지연', key: 'perfection', desc: '머릿속으로 너무 먼 미래까지 계산하느라 당장의 첫 걸음을 떼지 못하는 습관입니다.', color: 'from-blue-400 to-indigo-600' },
            { label: '혼자만의 생각에 잠김', key: 'anxiety', desc: '혼자 깊은 생각에 빠져 세상과의 따뜻한 연결을 잠시 잊고 외로워지는 패턴입니다.', color: 'from-indigo-400 to-blue-600' },
            { label: '방향의 혼란과 망설임', key: 'decision', desc: '무한한 가능성 앞에서 어떤 길을 먼저 선택해야 할지 갈팡질팡하는 마음입니다.', color: 'from-cyan-400 to-blue-600' },
        ],
        roadmap: [
            { type: '오늘', title: '가벼운 실행 1가지', items: ['생각만 하던 아이디어를 한 줄 문장으로 메모', '오늘 당장 시도할 작은 행동 1가지 결정'] },
            { type: '1주일', title: '물길 트기 루틴', items: ['생각을 3단계 작은 실천으로 나누어 행동하기', '초안 상태라도 사람들과 가볍게 나누어보기'] },
            { type: '1개월', title: '도도히 흐르는 강물의 결실', items: ['생각과 행동을 1:1로 맞추는 다정한 삶의 균형', '나의 넓은 지혜를 세상을 위해 나누는 기쁨'] },
        ],
        awarenessQuestions: [
            { q: '머릿속에 품은 가장 거대한 아이디어를 오늘 세상에 가볍게 선보이지 못하게 막는 진짜 두려움은 무엇인가요?', desc: '壬水는 흘러갈 때 비로소 바다를 만납니다.' },
            { q: '"완벽한 계획"보다 "오늘의 작은 시도"가 내 마음을 얼마나 더 가볍게 해줄 수 있을까요?', desc: '작은 시도가 모여 당신의 지혜를 위대한 현실로 만들어줍니다.' },
        ],
    },
    '癸': {
        architectNote: '癸水(계수) 영혼의 기운: 촉촉한 이슬비처럼 섬세하고 다정한 공감 능력이 당신 영혼의 가장 맑은 매력입니다. 다만 타인의 감정이나 기분을 너무 예민하게 수신하여 내 마음의 소리와 섞이는 감정 혼선이 생길 수 있습니다. 남의 마음을 살피듯, 나 자신의 마음 소리에도 다정한 호흡을 건네주세요.',
        darkCodes: [
            { label: '남의 감정까지 내 것으로 짊어짐', key: 'perfection', desc: '타인의 슬픔이나 지침을 내 마음처럼 받아들여 영혼이 쉽게 피로해지는 습관입니다.', color: 'from-sky-400 to-blue-600' },
            { label: '미세한 외부 반응에 대한 민감함', key: 'anxiety', desc: '주변의 사소한 말이나 시선에도 깊게 영향받아 마음이 흔들리는 패턴입니다.', color: 'from-blue-400 to-sky-600' },
            { label: '말하지 않고 알아주길 바라는 마음', key: 'decision', desc: '내 솔직한 기대를 표현하지 않고 혼자 서운해하는 안타까움입니다.', color: 'from-cyan-400 to-sky-600' },
        ],
        roadmap: [
            { type: '오늘', title: '내 마음 지키기 — 감정 구분', items: ['지금 느끼는 감정이 내 것인지 남의 것인지 알아차리기', '"나는 지금 편안함을 원해" 나에게 말해주기'] },
            { type: '1주일', title: '솔직하고 다정한 표현', items: ['내가 원하는 것을 상대에게 편안하게 표현하기', '30분간 온전히 나 혼자만의 고요한 휴식 갖기'] },
            { type: '1개월', title: '맑고 강인한 맑은 샘물 수호', items: ['받아들일 감정과 거리를 둘 감정의 기준 세우기', '내 마음에 다정한 온기를 전하는 수용 루틴'] },
        ],
        awarenessQuestions: [
            { q: '지금 내 마음에 가득 찬 감정 중, 사실은 주변 사람들에게서 스며들어온 것은 무엇인가요?', desc: '癸水의 맑은 이슬도 나 자신의 그릇이 먼저 단단할 때 세상을 적십니다.' },
            { q: '상대방이 알아주길 기다리기보다, 오늘 내가 직접 솔직하게 다정히 말해볼 수 있는 것은 무엇인가요?', desc: '솔직한 언어 표현이 당신의 마음을 가장 가볍고 자유롭게 해줍니다.' },
        ],
    },
};

// ─────────────────────────────────────────────────────────────
// 컴포넌트 본체
// ─────────────────────────────────────────────────────────────
export default function DiagnosticDashboard({ sajuInfo, reportData: propReportData, onStartChat }: DiagnosticDashboardProps) {

    const router = useRouter();

    // ── 스토어에서도 직접 참조 (prop으로 안 왔을 경우 대비)
    const storeReportData = useReportStore((s) => s.reportData);
    const reportData = propReportData ?? storeReportData;

    // ── [핵심] 다중 소스 일간 추출
    const dayStem = useMemo(() => {
        const resolved = resolveDayStem(sajuInfo, reportData);
        console.log('🎯 [DiagnosticDashboard] dayStem 해석:', {
            fromSajuInfo: sajuInfo?.dayStem,
            fromFourPillars: reportData?.saju?.fourPillars?.day?.gan,
            fromDayMaster: reportData?.saju?.dayMaster,
            resolved,
        });
        // '?'인 경우 기본 데이터 없음 표시용 그대로 유지 (UI에서 처리)
        return resolved !== '?' ? resolved : '辛';
    }, [sajuInfo, reportData]);

    const ilgan = ILGAN_DIAGNOSTIC_DB[dayStem] ?? ILGAN_DIAGNOSTIC_DB['辛'];

    // ── 오행 데이터: SajuEngine 실시간 계산 최우선
    // 하드코딩 방지: 항상 직접 계산을 시도하고, 불가능할 때만 저장값 사용
    const rawOhaeng = useMemo(() => {
        const HARDCODED = { metal: 30, earth: 20, fire: 15, water: 15, wood: 10 };
        const isHardcoded = (o: any) =>
            o && o.metal === 30 && o.earth === 20 && o.fire === 15 && o.water === 15 && o.wood === 10;
        const hasValue = (o: any) =>
            o && ((o.wood||0)+(o.fire||0)+(o.earth||0)+(o.metal||0)+(o.water||0)) > 0;

        // ━━━ [1순위] birthDate → SajuEngine 전체 재계산 (가장 정확) ━━━
        const birthDate = reportData?.birthDate || reportData?.birth_date
                       || sajuInfo?.rawBirthDate;
        if (birthDate) {
            try {
                const birthTime = reportData?.birthTime || reportData?.birth_time
                               || sajuInfo?.rawBirthTime || '12:00';
                const calType = reportData?.meta?.calendarType || 'solar';
                const gender  = reportData?.meta?.gender || reportData?.gender || 'male';
                const result = calculateSaju(birthDate, birthTime, calType, gender);
                if (result?.success && result.fourPillars) {
                    const stats = calculateSajuStats(result.fourPillars, result.dayMasterChar);
                    if (hasValue(stats?.ohaeng)) {
                        console.log('✅ [Ohaeng] SajuEngine 실시간 계산:', stats.ohaeng);
                        return stats.ohaeng;
                    }
                }
            } catch(e) { console.warn('[Ohaeng] SajuEngine 계산 오류', e); }
        }

        // ━━━ [2순위] fourPillars → calculateSajuStats 직접 계산 ━━━
        const s = reportData?.saju;
        if (s?.fourPillars) {
            try {
                const dmChar = s.dayMasterChar || s.fourPillars?.day?.gan || dayStem;
                const stats = calculateSajuStats(s.fourPillars, dmChar);
                if (hasValue(stats?.ohaeng)) {
                    console.log('✅ [Ohaeng] fourPillars → calculateSajuStats:', stats.ohaeng);
                    return stats.ohaeng;
                }
            } catch(e) { console.warn('[Ohaeng] calculateSajuStats 오류', e); }
        }

        // ━━━ [3순위] 저장된 ohaeng 값 (하드코딩 제외) ━━━
        if (hasValue(sajuInfo?.ohaeng) && !isHardcoded(sajuInfo.ohaeng)) {
            console.log('✅ [Ohaeng] sajuInfo.ohaeng 사용:', sajuInfo.ohaeng);
            return sajuInfo.ohaeng;
        }
        if (hasValue(s?.ohaeng) && !isHardcoded(s.ohaeng)) {
            console.log('✅ [Ohaeng] saju.ohaeng 사용:', s.ohaeng);
            return s.ohaeng;
        }
        if (hasValue(s?.elements) && !isHardcoded(s.elements)) {
            console.log('✅ [Ohaeng] saju.elements 사용:', s.elements);
            return s.elements;
        }

        // ━━━ [최후 폴백] 균등 분포 (절대 하드코딩 사용 안 함) ━━━
        console.warn('⚠️ [Ohaeng] 모든 소스 실패 — 균등 분포 표시');
        return { wood: 1, fire: 1, earth: 1, metal: 1, water: 1 };
    }, [sajuInfo, reportData, dayStem]);

    // 1. 오행 레이더 데이터
    const radarData = useMemo(() => {
        const w  = Number(rawOhaeng.wood  || 0);
        const f  = Number(rawOhaeng.fire  || 0);
        const e  = Number(rawOhaeng.earth || 0);
        const m  = Number(rawOhaeng.metal || 0);
        const wa = Number(rawOhaeng.water || 0);
        const total = (w + f + e + m + wa) || 1;
        return [
            { format: '목(WOOD)',  value: Math.round((w  / total) * 100), fullMark: 100 },
            { format: '화(FIRE)',  value: Math.round((f  / total) * 100), fullMark: 100 },
            { format: '토(EARTH)', value: Math.round((e  / total) * 100), fullMark: 100 },
            { format: '금(METAL)', value: Math.round((m  / total) * 100), fullMark: 100 },
            { format: '수(WATER)', value: Math.round((wa / total) * 100), fullMark: 100 },
        ];
    }, [rawOhaeng]);

    const systemScore = useMemo(() => {
        // ━━━ [복합 지표 계산] 오행 균형 + 사용자별 고유 요소 ━━━

        // 1) 오행 분포 균형 지수
        const vals = radarData.map(d => d.value);
        const maxV = Math.max(...vals);
        const minV = Math.min(...vals);
        const balanceScore = 100 - (maxV - minV) / 2;

        // 2) 십성(十星) 복잡도 — tenGods 분포 다양성
        const tenGods = reportData?.saju?.tenGods || {};
        const tgVals = (Object.values(tenGods) as number[]);
        const tgTotal = tgVals.reduce((a, b) => a + b, 0) || 8;
        const tgMax = tgVals.length > 0 ? Math.max(...tgVals) / tgTotal : 0.4;
        const tenGodsScore = Math.round((1 - tgMax) * 100);

        // 3) 일간(日干) 인덱스 기반 고유 변동값 (사용자마다 다른 값 보장)
        const STEMS10 = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
        const stemIdx = STEMS10.indexOf(dayStem);
        const stemVariation = stemIdx >= 0 ? (stemIdx * 1.5 - 5) : 0;

        // 4) 사용자 통계 점수 반영
        const stats = reportData?.stats;
        const statsAvg = stats
            ? ((stats.creativity||50) + (stats.leadership||50) + (stats.empathy||50)
               + (stats.wealth||50) + (stats.execution||50)) / 5
            : 50;
        const statsFactor = (statsAvg - 50) * 0.1;

        // ━━━ 종합 가중 평균 ━━━
        const composite = (balanceScore * 0.6) + (tenGodsScore * 0.25) + stemVariation + statsFactor;
        const score = Math.max(52, Math.min(99, Math.round(composite)));

        console.log('📊 [SystemScore]', {
            balanceScore: balanceScore.toFixed(1), tenGodsScore, stemVariation,
            statsFactor: statsFactor.toFixed(1), finalScore: score, dayStem,
        });
        return score;
    }, [radarData, reportData, dayStem]);

    const dominatingElement = [...radarData].sort((a, b) => b.value - a.value)[0];

    // ── 사용자 이름 추출
    const userName = sajuInfo?.name || reportData?.userName || reportData?.saju?.name || '';

    // 3. 인지 과부하 수치 (설문 메타데이터 반영)
    const meta = reportData?.meta || {};
    const stressLevels = {
        perfection: Math.min(98, 50 + (meta.energyLevel  ? (100 - meta.energyLevel) / 2   : 34)),
        anxiety:    Math.min(99, 40 + (meta.sleepQuality ? (5 - meta.sleepQuality) * 12    : 42)),
        decision:   meta.stressFactors?.length ? Math.min(90, 40 + meta.stressFactors.length * 10) : 67,
    };

    const entropyLabel = systemScore > 80 ? '안정' : systemScore > 65 ? '주의' : '불안정';
    const entropyColor = systemScore > 80 ? '#4ade80' : systemScore > 65 ? '#facc15' : '#f87171';

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-sans text-gray-200">

            {/* ── 헤더 */}
            <div className="flex items-end justify-between border-b border-cyan-500/20 pb-4">
                <div>
                    <h2 className="text-[10px] font-mono text-cyan-500 tracking-[0.3em] mb-1">01 // 전략</h2>
                    <h1 className="text-2xl font-black text-white">
                        분석 요약 보고서 // <span className="text-cyan-400">내면 서사 정밀 진단</span>
                    </h1>
                </div>
                <div className="text-[10px] font-mono text-gray-500 text-right">
                    <p>액세스 로그</p>
                    <p className="text-yellow-400/80">영혼 기록 {dayStem}木 기운</p>
                </div>
            </div>

            {/* ── Section 1: 내면 에너지 방위 지도 & 무결성 점수 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#0a0f16] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-4 right-4 text-cyan-500/20 group-hover:text-cyan-500/40 transition-colors">
                        <Activity className="w-8 h-8" />
                    </div>
                    <p className="text-[10px] font-mono text-cyan-400 mb-4 tracking-widest">
                        오행 밸런스 지도<br />
                        <span className="text-white text-lg font-bold mt-1 block">코어 리소스 맵</span>
                    </p>
                    <div className="h-[240px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                <PolarAngleAxis dataKey="format" tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #06b6d4' }}
                                    itemStyle={{ color: '#06b6d4', fontSize: 12 }}
                                />
                                <Radar name="에너지 밀도" dataKey="value" stroke="#06b6d4" strokeWidth={2} fill="#06b6d4" fillOpacity={0.15} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0a0f16] border border-white/5 flex flex-col justify-center items-center text-center">
                    <p className="text-[10px] font-mono text-cyan-500 mb-3 tracking-widest uppercase">
                        종합 지표 // 영혼 평온 & 조화 점수
                    </p>

                    {/* 점수 숫자 */}
                    <div className="relative">
                        <div className="text-6xl font-black tracking-tighter"
                            style={{ color: entropyColor }}>
                            {systemScore.toFixed(0)}
                        </div>
                        <div className="text-[10px] font-mono text-gray-500 mt-1">/ 99</div>
                    </div>

                    {/* 점수 의미 — 동적 레이블 */}
                    <div className="mt-3 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider"
                        style={{
                            background: systemScore > 80 ? 'rgba(74,222,128,0.1)' : systemScore > 65 ? 'rgba(250,204,21,0.1)' : 'rgba(248,113,113,0.1)',
                            border: `1px solid ${entropyColor}40`,
                            color: entropyColor,
                        }}>
                        {systemScore > 85 ? '✦ 고도 정렬 상태' :
                         systemScore > 75 ? '◈ 안정 운행 중' :
                         systemScore > 65 ? '⚠ 미세 조정 필요' :
                         '⊗ 재조정 권장'}
                    </div>

                    {/* 점수 해석 설명 */}
                    <p className="text-[10px] text-gray-500 mt-3 leading-relaxed px-2 break-keep">
                        {systemScore > 85
                            ? `내 사주 에너지가 균형 잡혀 있습니다. ${dayStem} 일간의 강점이 충분히 발휘되고 있는 상태입니다.`
                            : systemScore > 75
                            ? `전반적으로 안정적이나, 일부 에너지 영역에서 편중이 감지됩니다.`
                            : systemScore > 65
                            ? `${dayStem} 일간의 에너지 흐름에 불균형이 있습니다. 아래 로드맵을 참고하세요.`
                            : `내면의 따뜻한 온기 재정렬이 필요합니다. 완벽주의와 조급함을 다정하게 감싸 안아주세요.`}
                    </p>

                    {/* 시각적 게이지 바 */}
                    <div className="w-full mt-4 bg-gray-900 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${systemScore}%` }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, #06b6d4, ${entropyColor})` }}
                        />
                    </div>

                    {/* 세부 지표 */}
                    <div className="w-full mt-5 space-y-2 font-mono text-[10px]">
                        <div className="flex justify-between border-b border-white/5 pb-1">
                            <span className="text-gray-500">주 지배 오행</span>
                            <span className="text-cyan-400">{dominatingElement.format}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1">
                            <span className="text-gray-500">일간(日干)</span>
                            <span className="text-yellow-400">{dayStem}</span>
                        </div>
                        <div className="flex justify-between pb-1">
                            <span className="text-gray-500">에너지 조화도</span>
                            <span style={{ color: entropyColor }}>{entropyLabel}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── 명심 멘토의 영혼 기록 — 일간별 완전 동적 */}
            <div className="p-5 rounded-2xl bg-[#080b0f] border border-cyan-500/20">
                <div className="flex items-center gap-2 mb-3">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white tracking-wide">아키텍트의 기록</h3>
                    <span className="ml-auto text-[10px] font-mono text-yellow-400 border border-yellow-400/30 px-1.5 py-0.5 rounded">
                        {dayStem} PROFILE
                    </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mb-4 break-keep">{ilgan.architectNote}</p>
                <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 text-[9px] font-mono rounded">
                        # 태그: {dayStem} 기질 맞춤분석
                    </span>
                    <span className="px-2 py-1 bg-gray-900/60 text-gray-400 border border-white/10 text-[9px] font-mono rounded">
                        # 상태: 추적 중
                    </span>
                </div>
            </div>

            {/* ── Section 2: 인지 과부하 분석 — 일간별 다크코드 */}
            <div className="pt-8">
                <div className="mb-6">
                    <h2 className="text-[10px] font-mono text-pink-500 tracking-[0.3em] mb-1">02 // 내면 마음 알아차림</h2>
                    <h1 className="text-2xl font-black text-white">인지 과부하 분석</h1>
                </div>
                <div className="p-6 rounded-2xl bg-[#0a0f16] border border-white/5">
                    <p className="text-[10px] font-mono text-gray-500 mb-6">
                        마음 상태 스캔 // <span className="text-yellow-400">{dayStem}</span> 내면 방어 습관(다크코드)
                    </p>
                    <div className="space-y-6">
                        {ilgan.darkCodes.map(item => {
                            const val = stressLevels[item.key];
                            return (
                                <div key={item.label} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                            <span>{item.label}</span>
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black text-amber-300 font-mono">{val.toFixed(0)}%</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const prompt = `내 안의 ${item.label} 다크코드를 80% 미학과 3세대 뇌과학(ACT)으로 정밀 뇌 쿨링 해줘`;
                                                    if (onStartChat) onStartChat(prompt);
                                                    else router.push(`/myeongsim-chat?prompt=${encodeURIComponent(prompt)}`);
                                                }}
                                                className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-[10px] font-black transition-all flex items-center gap-1 active:scale-95 cursor-pointer shadow-md hover:scale-105"
                                            >
                                                <Zap size={11} className="fill-slate-950" />
                                                <span>1:1 뇌 쿨링 ➔</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden mb-2.5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${val}%` }}
                                            transition={{ duration: 1, ease: 'easeOut' }}
                                            className={`h-full bg-gradient-to-r ${item.color} shadow-[0_0_10px_rgba(245,158,11,0.4)]`}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-300 leading-relaxed break-keep font-medium">{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Section 3: 로드맵 — 일간별 완전 동적 */}
            <div className="pt-8">
                <div className="mb-6">
                    <h2 className="text-[10px] font-mono text-teal-400 tracking-[0.3em] mb-1">03 // 뇌회로 재배선</h2>
                    <h1 className="text-2xl font-black text-white">
                        3S 행동 실천 // <span className="text-teal-400">{dayStem}일간 맞춤 뇌 쿨링 로드맵</span>
                    </h1>
                </div>
                <div className="p-6 rounded-2xl bg-[#0a0f16] border border-white/5 relative">
                    <div className="absolute left-[39px] top-10 bottom-10 w-px border-l border-dashed border-cyan-500/30" />
                    <div className="space-y-8">
                        {ilgan.roadmap.map((node, i) => (
                            <div key={i} className="flex gap-6 relative z-10">
                                <div className="flex flex-col items-center gap-2 shrink-0">
                                    <div className="text-[9px] font-mono py-1 px-2 bg-cyan-950 text-cyan-400 border border-cyan-500/50 rounded w-16 text-center">
                                        {node.type}
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                                </div>
                                <div className="flex-1 bg-black/40 border border-white/5 p-4 rounded-xl hover:border-cyan-500/30 transition-colors">
                                    <h4 className="text-sm font-bold text-white mb-3 flex justify-between items-center">
                                        <span className="break-keep">{node.title}</span>
                                        <span className="text-[10px] text-gray-600 font-mono ml-2 shrink-0">STEP_0{i + 1}</span>
                                    </h4>
                                    <ul className="space-y-1.5">
                                        {node.items.map((item, ii) => (
                                            <li key={ii} className="text-[11px] text-gray-400 flex gap-2 break-keep">
                                                <span className="text-cyan-600 font-bold shrink-0">›</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Section 4: 자각 세션 — 일간별 완전 개인화 질문 */}
            <div className="pt-8 pb-10">
                <div className="mb-6">
                    <h2 className="text-[10px] font-mono text-cyan-500 tracking-[0.3em] mb-1">04 // 자각_세션</h2>
                    <h1 className="text-2xl font-black text-white flex flex-wrap gap-2 items-center">
                        핵심 질문 // <span className="text-cyan-400">{dayStem} 디버깅 모드</span>
                        <ShieldAlert className="w-6 h-6 text-cyan-400 ml-2" />
                    </h1>
                    <p className="text-[11px] text-gray-500 mt-2 font-mono break-keep">
                        아래 질문은 <span className="text-yellow-400 font-bold">{dayStem}</span> 일간의 핵심 인지 패턴을 분석하여
                        자동 생성된 맞춤형 산파술적 질문입니다.
                    </p>
                </div>

                <div className="space-y-6">
                    {ilgan.awarenessQuestions.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.15, duration: 0.5 }}
                            className="flex gap-4"
                        >
                            <div className="text-3xl font-light text-cyan-900 select-none shrink-0">
                                {String(idx + 1).padStart(2, '0')}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base font-bold text-white mb-2 leading-snug break-keep">
                                    {item.q}
                                </h3>
                                <p className="text-xs text-gray-500 leading-relaxed mb-3 break-keep">{item.desc}</p>
                                <div className="p-3 bg-black/60 border border-white/5 rounded-lg hover:border-cyan-500/20 transition-colors">
                                    <p className="text-[10px] font-mono text-gray-500 italic">
                                        💭 이 질문을 마음에 품고 아래 AI 코치와 대화를 시작해 보십시오...
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    <button
                        onClick={() => {
                            if (onStartChat) onStartChat();
                            router.push('/myeongsim-chat');
                        }}
                        className="w-full mt-6 py-4 bg-cyan-500 hover:bg-cyan-400 text-[#070a12] font-black text-sm uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2 group cursor-pointer"
                    >
                        <Zap className="w-5 h-5 group-hover:animate-bounce" />
                        {dayStem} 맞춤 메인 AI 챗봇 연결 — 실시간 코칭 시작
                    </button>
                    <p className="text-center text-[10px] text-cyan-400/80 font-mono mt-2">
                        명심 메인 AI 챗봇으로 이동합니다. {dayStem} 일간 맞춤 코칭을 바로 시작하십시오.
                    </p>
                </div>
            </div>

        </div>
    );
}
