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
        architectNote: '甲木 시스템: 강력한 추진력(木)이 핵심 드라이브입니다. 독단적 처리 방식이 협업 모듈과 충돌하여 "관계 단절" 에러를 반복 생성하고 있습니다. 멈추지 않고 달리는 것이 美德이지만, 지금 당장 당신 주변의 사람들이 숨을 쉬고 있는지 확인하십시오. 뿌리 없는 성장은 첫 번째 강풍에 쓰러집니다.',
        darkCodes: [
            { label: '독단 과부하 (Authority Override)', key: 'perfection', desc: '"내 방식만이 정답"이라는 확신이 협업 채널을 차단합니다. 주변 피드백 수신 포트가 닫혀 있는 상태입니다.', color: 'from-green-400 to-emerald-600' },
            { label: '고속 소진 (Burnout Sprint)', key: 'anxiety', desc: '전속력으로 달리다 연료가 바닥나는 패턴. 체력 리소스 잔량이 임계치를 향해 접근 중입니다.', color: 'from-lime-400 to-green-600' },
            { label: '관계 단절 (Connection Failure)', key: 'decision', desc: '속도를 우선시하며 타인을 뒤에 두고 혼자 달리는 패턴. 팀워크 모듈이 오프라인 상태입니다.', color: 'from-teal-400 to-cyan-600' },
        ],
        roadmap: [
            { type: '오늘', title: '속도 조절 — 3초 멈춤 루틴', items: ['가장 최근 결정 1건에 대해 타인 의견 수집', '"이게 진짜 최선인가?" 30초 자문 후 실행'] },
            { type: '1주일', title: '협업 채널 재개통', items: ['팀원/파트너에게 나의 비전을 설명하는 세션 1회', '타인의 반대 의견을 3일간 실험으로 받아들이기'] },
            { type: '1개월', title: '시스템 분산 아키텍처 전환', items: ['혼자 하던 업무 1가지 위임 (결과를 기다리는 연습)', '관계 투자: 감사 표현 루틴 시스템화'] },
        ],
        awarenessQuestions: [
            { q: '지금 내가 "혼자" 해결하려는 것들 중, 사실은 누군가의 도움을 받으면 10배 빨리 끝날 수 있는 것이 있다면 무엇인가?', desc: '甲木의 독립심이 때로는 가장 강력한 비효율의 원인입니다. 협력을 거부하는 내면의 코드를 점검하십시오.' },
            { q: '내가 가장 최근에 "틀렸다"고 인정했던 순간은 언제인가? 그 경험이 나를 더 강하게 만들었는가, 약하게 만들었는가?', desc: '수용의 근육은 멈추는 훈련에서 옵니다. 인정이 패배가 아니라 업그레이드임을 증명하는 사례를 찾으십시오.' },
        ],
    },
    '乙': {
        architectNote: '乙木 시스템: 초연결 네트워킹 능력이 핵심 강점입니다. 자아 희석(Identity Blur) 버그로 인해 타인의 요청에 과도하게 응답하면서 자신의 코어 미션 파일이 덮어쓰여지고 있습니다. 연결은 하되, 루트 디렉토리(자아)는 반드시 지켜야 합니다.',
        darkCodes: [
            { label: '자아 희석 (Identity Blur)', key: 'perfection', desc: '타인에게 맞추다 자신의 방향을 잃는 패턴. 자아 코어 파일이 외부 변수에 의해 서서히 덮어쓰여지고 있습니다.', color: 'from-green-400 to-teal-600' },
            { label: '경계선 붕괴 (Boundary Collapse)', key: 'anxiety', desc: '거절 루틴이 비활성화 상태입니다. 모든 요청에 응답하다 에너지 리소스가 고갈되고 있습니다.', color: 'from-emerald-400 to-green-600' },
            { label: '우유부단 루프 (Indecision Loop)', key: 'decision', desc: '갈등 회피 본능이 중요한 의사결정 실행을 지연시키고 있습니다. 선택 큐에 처리되지 않은 항목이 쌓이고 있습니다.', color: 'from-teal-400 to-emerald-600' },
        ],
        roadmap: [
            { type: '오늘', title: '"아니오" 1번 실행하기', items: ['현재 부담스러운 요청 1건에 정중히 거절 연습', '"내가 진짜 원하는 것이 무엇인가?" 3분 일기'] },
            { type: '1주일', title: '자아 경계선 펌웨어 업데이트', items: ['코칭·상담 시간 외 응답 금지 규칙 설정', '나만의 창작 활동 30분 확보 (남 눈치 없이)'] },
            { type: '1개월', title: '독자적 브랜드 아키텍처 구축', items: ['내 철학을 담은 콘텐츠 1건 수정 없이 배포', '핵심 관계와 소모적 관계 명확하게 분리'] },
        ],
        awarenessQuestions: [
            { q: '지금 내가 맺고 있는 관계들 중, 나의 에너지를 채워주는 관계와 소모하는 관계를 각각 1개씩 떠올릴 수 있는가?', desc: '乙木의 네트워크는 자산이지만, 선택되지 않은 연결은 부채입니다. 어떤 연결에 투자하고 어떤 연결을 줄여야 하는지 직면하십시오.' },
            { q: '"나"가 없어진 상황에서도 유지되는 것들이 있는가? 그것이 진짜 나의 시스템인가, 아니면 타인에 의해 돌아가는 시스템인가?', desc: '자동화된 관계와 의존적 구조를 구분하십시오. 내가 없어도 돌아가는 것이 진정한 레버리지입니다.' },
        ],
    },
    '丙': {
        architectNote: '丙火 시스템: 태양급 에너지 방출이 핵심 드라이브입니다. 에너지가 너무 강렬하여 주변에 과다 열량을 방사하는 번아웃 리스크가 감지됩니다. 밝게 빛나되, 스스로 타지 않는 냉각 시스템이 시급합니다. 당신의 빛이 지속되려면 연료를 계획적으로 관리해야 합니다.',
        darkCodes: [
            { label: '과잉 방사 (Energy Overflow)', key: 'perfection', desc: '타인에게 너무 많은 것을 주려다 자신의 에너지 코어가 과열되는 패턴. 냉각수 보충이 시급합니다.', color: 'from-orange-400 to-red-600' },
            { label: '인정 의존 (Approval Addiction)', key: 'anxiety', desc: '타인의 반응이 없을 때 시스템이 불안정해집니다. 외부 피드백에 과도하게 의존하는 상태입니다.', color: 'from-amber-400 to-orange-600' },
            { label: '충동 실행 (Impulsive Deploy)', key: 'decision', desc: '열정이 앞선 나머지 계획 없이 즉각 배포하는 패턴. 롤백(수정) 비용이 지속 누적되고 있습니다.', color: 'from-red-400 to-pink-600' },
        ],
        roadmap: [
            { type: '오늘', title: '열 방출 조절 — 일시 정지 루틴', items: ['하루 중 "아무것도 안 하는" 15분 확보', '오늘 쏟아낸 에너지 양을 한 줄로 기록'] },
            { type: '1주일', title: '선택적 빛 발산 설계', items: ['가장 중요한 프로젝트 1개에만 최대 에너지 집중', '나머지 요청에는 70% 출력으로만 응답하는 연습'] },
            { type: '1개월', title: '지속 가능한 빛의 아키텍처', items: ['번아웃 전조 증상 인식 체크리스트 설계', '에너지 보충 루틴 (수면·자연·고요함) 시스템화'] },
        ],
        awarenessQuestions: [
            { q: '지금 내가 가장 많은 에너지를 쏟고 있는 일이 진짜 나를 불태우는 일인가, 아니면 타인의 기대에 응답하는 일인가?', desc: '丙火의 빛은 방향이 있어야 효과적입니다. 무엇을 향해 타오르고 있는지 점검하십시오.' },
            { q: '"빛나야 한다"는 압박에서 자유로워진다면, 지금 당장 그만하고 싶은 것이 있는가?', desc: '존재 자체로 충분하다는 것을 인식하는 것이 丙火의 가장 강력한 업그레이드입니다.' },
        ],
    },
    '丁': {
        architectNote: '丁火 시스템: 섬세한 통찰의 촛불이 핵심 드라이브입니다. 혼자 속으로 타는 내부 연소 방식으로 인해 주변에 자신의 진짜 상태가 전달되지 않는 "감정 암호화" 버그가 관찰됩니다. 내면의 불꽃을 언어로 출력하는 채널 개통이 가장 시급한 업그레이드입니다.',
        darkCodes: [
            { label: '감정 암호화 (Emotion Encryption)', key: 'perfection', desc: '내면의 상태를 겉으로 드러내지 않습니다. 감정이 출력되지 않아 내부 압력이 점점 축적되고 있습니다.', color: 'from-pink-400 to-rose-600' },
            { label: '이상주의 충돌 (Idealism Crash)', key: 'anxiety', desc: '마음속 완벽한 그림과 현실의 차이가 클 때 시스템이 멈춥니다. 현실 인터페이스와의 충돌 빈도가 높습니다.', color: 'from-rose-400 to-pink-600' },
            { label: '자기희생 루프 (Self-Sacrifice Loop)', key: 'decision', desc: '타인을 위해 자신을 지속적으로 소모하는 패턴. 자기 유지 리소스가 임계치를 향해 감소 중입니다.', color: 'from-fuchsia-400 to-purple-600' },
        ],
        roadmap: [
            { type: '오늘', title: '감정 출력 채널 개통', items: ['오늘 느낀 감정을 3단어로만 기록 (판단 없이)', '"나는 지금 무엇이 필요한가?"를 솔직하게 답하기'] },
            { type: '1주일', title: '내면 상태 언어화 훈련', items: ['신뢰하는 1명에게 속마음 50% 털어놓기 연습', '감정 일기 루틴 — 이상과 현실의 간극 측정'] },
            { type: '1개월', title: '이상과 현실의 인터페이스 설계', items: ['완벽한 비전의 70% 수준에서 배포 결정하기', '자기희생 없이도 타인에게 가치를 줄 방법 설계'] },
        ],
        awarenessQuestions: [
            { q: '지금 이 순간, 나는 누군가를 위해 타고 있는가, 아니면 나 자신을 위해 타고 있는가?', desc: '丁火의 빛은 방향을 잃을 때 스스로를 태웁니다. 나의 불꽃이 나를 위해 방향 지정된 것인지 점검하십시오.' },
            { q: '"완벽하지 않아도 된다"는 것을 진심으로 수용한다면, 오늘 당장 배포할 수 있는 것이 있는가?', desc: '이상과 현실의 간극이 실행을 막고 있다면, 그 간극 자체가 내부 컴파일 오류입니다.' },
        ],
    },
    '戊': {
        architectNote: '戊土 시스템: 광활한 대지의 포용력이 핵심 드라이브입니다. 너무 많은 것을 품으려다 "중심 없는 팽창" 에러가 발생하고 있습니다. 크게 포용하되, 내 중심축(Core Mission)을 기준으로 무엇을 받아들이고 무엇을 거절할지 명확히 설정하십시오.',
        darkCodes: [
            { label: '과팽창 포용 (Over-Expansion)', key: 'perfection', desc: '모든 것을 다 받아들이다 중심이 흐려지는 패턴. 시스템 경계가 너무 넓어 코어 로직이 희석되고 있습니다.', color: 'from-yellow-400 to-amber-600' },
            { label: '변화 저항 (Change Resistance)', key: 'anxiety', desc: '안정을 추구하다 변화를 수용하지 못하는 패턴. 업데이트 거부로 인한 레거시 코드 누적이 관찰됩니다.', color: 'from-amber-400 to-yellow-600' },
            { label: '핵심 분산 (Core Diffusion)', key: 'decision', desc: '너무 많은 것을 감싸안아 정작 핵심에 리소스를 집중하지 못하는 비효율 구조입니다.', color: 'from-orange-400 to-amber-600' },
        ],
        roadmap: [
            { type: '오늘', title: '핵심 미션 파일 재정의', items: ['오늘 "반드시" 해야 할 것 3개만 추리기', '핵심 가치와 무관한 활동 1개 내려놓기'] },
            { type: '1주일', title: '경계선 (Firewall) 설치', items: ['에너지를 분산시키는 요청에 "현재 용량 초과" 응답 연습', '핵심 프로젝트에 70% 이상 리소스 집중 실험'] },
            { type: '1개월', title: '선택적 포용 시스템 설계', items: ['받아들일 것과 내려놓을 것의 기준 매뉴얼 작성', '변화를 수용하는 소규모 실험 매주 1건 실행'] },
        ],
        awarenessQuestions: [
            { q: '지금 내가 "반드시 내가 해야 한다"고 믿고 있는 것들 중, 사실은 내려놓아도 되는 것이 있는가?', desc: '戊土의 포용력은 자산이지만, 경계 없는 포용은 중심 상실로 이어집니다. 진짜 지켜야 할 코어를 명확히 하십시오.' },
            { q: '지금 내가 변화를 거부하고 있는 영역은 어디인가? 그 저항의 이면에 있는 진짜 두려움은 무엇인가?', desc: '안정과 변화의 균형이 戊土의 핵심 과제입니다. 변화 거부의 뿌리를 추적하면 다음 성장의 문이 열립니다.' },
        ],
    },
    '己': {
        architectNote: '己土 시스템: 섬세한 옥토(沃土)의 비옥함이 핵심 드라이브입니다. 내면의 방대한 아이디어를 외부로 출력하는 채널이 막혀 있는 "과잉 내성화" 버그가 관찰됩니다. 생각을 행동으로 전환하는 출력 루틴 구축이 가장 시급한 업그레이드입니다.',
        darkCodes: [
            { label: '과잉 내성화 (Over-Internalization)', key: 'perfection', desc: '좋은 아이디어와 감정이 내부에만 쌓이고 외부로 출력되지 않는 패턴. 내부 버퍼가 포화 상태입니다.', color: 'from-yellow-400 to-lime-600' },
            { label: '소심한 실행 (Timid Execution)', key: 'anxiety', desc: '실행 전 과도한 걱정으로 배포가 지연됩니다. 완벽한 준비를 기다리다 기회를 놓치는 패턴이 반복됩니다.', color: 'from-lime-400 to-yellow-600' },
            { label: '과잉 배려 (Excessive Consideration)', key: 'decision', desc: '타인을 배려하다 정작 나의 의사결정이 밀려나는 구조. 자기 우선순위 처리 모듈이 비활성화 상태입니다.', color: 'from-green-400 to-lime-600' },
        ],
        roadmap: [
            { type: '오늘', title: '1가지 내부 아이디어를 외부로 출력하기', items: ['완벽하지 않아도 메모·메시지·초안 1건 외부 공유', '"이것을 왜 아직 실행하지 않았는가?" 1줄로 솔직하게 기록'] },
            { type: '1주일', title: '소규모 배포 실험 3회 이상', items: ['소셜미디어·카톡·이메일에 내 생각 1개 발신', '상대의 반응을 분석하지 않고 그냥 받아들이기 연습'] },
            { type: '1개월', title: '규칙적 출력 루틴 시스템화', items: ['주 1회 콘텐츠 정기 배포 구조 세팅', '타인 배려 전에 내 우선순위 먼저 채우는 루틴 설계'] },
        ],
        awarenessQuestions: [
            { q: '머릿속에 오래 품고 있는 아이디어가 있다면, 지금 그것을 실행하지 못하게 막는 진짜 장벽은 무엇인가?', desc: '己土의 가장 큰 손실은 꺼내지 못한 아이디어입니다. 내부에 쌓인 것을 외부로 꺼내는 행위 자체가 첫 번째 성공입니다.' },
            { q: '내가 상대를 배려한다고 믿는 행동들 중, 사실은 거절당할 것이 두려워서 하는 행동이 있는가?', desc: '배려와 두려움을 구분하는 것이 己土 성장의 핵심 명령어입니다.' },
        ],
    },
    '庚': {
        architectNote: '庚金 시스템: 단단한 쇳덩어리의 돌파력이 핵심 드라이브입니다. "나는 강해야 한다"는 강박적 코드가 유연성 모듈을 비활성화하여 불필요한 충돌 에러를 반복 생성하고 있습니다. 강철은 제련될 때 더 강해집니다. 지금의 저항이 진짜 강함인지 점검하십시오.',
        darkCodes: [
            { label: '강철 고집 (Rigid Persistence)', key: 'perfection', desc: '"내 방식이 옳다"는 확신이 유연한 방법 탐색을 차단합니다. 처리 방식에 경직성이 점점 증가하고 있습니다.', color: 'from-slate-400 to-gray-600' },
            { label: '과잉 경쟁 (Competition Overflow)', key: 'anxiety', desc: '항상 이겨야 한다는 압박이 협력 가능한 상황에서도 경쟁 모드를 강제 활성화합니다.', color: 'from-zinc-400 to-slate-600' },
            { label: '감정 억압 (Emotion Suppression)', key: 'decision', desc: '강한 모습을 유지하려다 내면의 감정 신호가 무시되고 있습니다. 내부 경고등이 쌓이고 있습니다.', color: 'from-gray-400 to-zinc-600' },
        ],
        roadmap: [
            { type: '오늘', title: '유연성 스위치 — 1가지 방법 바꾸기', items: ['평소와 다른 방법으로 루틴 1개 실행해보기', '"내가 틀릴 수도 있다"는 가정 하에 대화 1건 시도'] },
            { type: '1주일', title: '감정 신호 수신 채널 개통', items: ['하루 한 번 "지금 나는 어떤 감정 상태인가?" 체크', '강함이 아닌 솔직함으로 대화하는 연습 1회'] },
            { type: '1개월', title: '제련된 강철 아키텍처 설계', items: ['협력 우선 경쟁 후순위의 프로젝트 1건 경험', '내 약점을 사전에 공개하고 도움 요청하는 시도'] },
        ],
        awarenessQuestions: [
            { q: '지금 내가 타협하지 않겠다고 결심하고 있는 것들 중, 유연하게 접근하면 더 빨리 해결될 수 있는 것이 있는가?', desc: '庚金의 강함은 때로 빠른 해결을 가로막는 장벽이 됩니다. 강함과 경직성을 구별하는 것이 핵심입니다.' },
            { q: '"강해야 한다"는 믿음이 없어진다면, 지금 당장 누군가에게 도움을 요청하고 싶은 것이 있는가?', desc: '도움 요청이 약함이 아님을 증명하는 경험이 庚金의 다음 단계 성장을 여는 열쇠입니다.' },
        ],
    },
    '辛': {
        architectNote: '辛金 시스템: 예리한 보석 세공사의 분석력이 핵심 드라이브입니다. "완벽하지 않으면 배포하지 않는다"는 통제 과부하 버그가 실행 속도를 극단적으로 저하시키고 있습니다. 80점짜리를 빠르게 배포하고 피드백으로 100점을 만드는 것이 辛金의 진짜 완벽주의 방법론입니다.',
        darkCodes: [
            { label: '완벽주의 루프 (Perfectionism Loop)', key: 'perfection', desc: '재귀적 루프가 감지되었습니다. 시스템이 핵심 자원을 소모하면서 비효율적인 루틴을 최적화하려고 시도 중입니다.', color: 'from-cyan-400 to-blue-600' },
            { label: '미래 불안 (Predictive Anxiety)', key: 'anxiety', desc: '발생 가능성이 낮은 실패 시나리오에 대한 과다한 시뮬레이션이 연산 RAM을 진동시키고 있습니다.', color: 'from-indigo-400 to-purple-600' },
            { label: '결정 장애 (Decision Paralysis)', key: 'decision', desc: '실행 모듈 내 데드락(Deadlock)이 발생했습니다. 과도한 비교 분석으로 실행 명령이 지연되고 있습니다.', color: 'from-cyan-400 to-teal-600' },
        ],
        roadmap: [
            { type: '오늘', title: '마인드 해킹 (인지 전환)', items: ['다크 코드 트리거 인지 및 즉시 중단', '오류 로그(감정·생각) 분리 기록'] },
            { type: '1주일', title: '마이크로 루틴 배포', items: ['환경적 제약 요소 디버깅 (정리정돈)', '80점짜리 결과물로 일단 배포하는 연습'] },
            { type: '1개월', title: '시스템 재부팅 (레버리지)', items: ['비핵심 로직 아웃소싱 — AI가 초안, 나는 세공', '인적·기술적 파이프라인 구축'] },
        ],
        awarenessQuestions: [
            { q: '현재 귀하의 제약 사항이 스스로 설계한 방어체계임이 밝혀진다면, 가장 먼저 해체해야 할 코드는 무엇입니까?', desc: '인지된 한계를 분석하십시오. 이것은 외부 변수입니까, 아니면 내부 컴파일 오류입니까?' },
            { q: '귀하의 의사결정 프로세스 중 어떤 레거시(과거) 시스템이 의미 없는 에너지를 가장 많이 소모하고 있습니까?', desc: '더 효율적인 실행을 가로막는 매몰 비용 논리를 식별하십시오.' },
        ],
    },
    '壬': {
        architectNote: '壬水 시스템: 깊고 거대한 강물의 지혜가 핵심 드라이브입니다. 방대한 아이디어와 전략이 내부에 집적되어 있지만, "흐름이 막히는" 정체 현상이 관찰됩니다. 아이디어는 흘러야 강이 됩니다. 지금 당장 세상에 흘려보낼 것을 하나라도 시작하십시오.',
        darkCodes: [
            { label: '전략 과잉 (Strategy Overflow)', key: 'perfection', desc: '실행보다 전략이 과도하게 우선시됩니다. 계획 버퍼가 포화되어 실행 큐가 비어있는 상태입니다.', color: 'from-blue-400 to-indigo-600' },
            { label: '심층 침잠 (Deep Immersion Lock)', key: 'anxiety', desc: '혼자 깊이 사유하다 현실 인터페이스와 단절되는 패턴. 공회전 사이클이 과도하게 길어지고 있습니다.', color: 'from-indigo-400 to-blue-600' },
            { label: '방향 부재 (Direction Loss)', key: 'decision', desc: '무한한 가능성 앞에서 방향을 결정하지 못하는 패턴. 나침반 없이 흐르는 물은 웅덩이에 고입니다.', color: 'from-cyan-400 to-blue-600' },
        ],
        roadmap: [
            { type: '오늘', title: '흐름 개시 — 지금 당장 1개 출력', items: ['머릿속 아이디어 1개를 바로 텍스트로 기록', '"이번 주 배포할 것" 1가지 명확히 결정'] },
            { type: '1주일', title: '실행 파이프라인 개통', items: ['아이디어를 행동 단계로 분해하는 3줄 로드맵 작성', '완성하지 않아도 초안 상태로 1명에게 공유'] },
            { type: '1개월', title: '지속 흐름 아키텍처 설계', items: ['사유-실행 사이클을 1:1로 맞추는 루틴 설계', '전략가에서 실행가로의 정체성 전환 실험 1건'] },
        ],
        awarenessQuestions: [
            { q: '지금 내 머릿속에 있는 가장 강력한 아이디어를 세상에 내보내지 못하게 막고 있는 진짜 이유는 무엇인가?', desc: '壬水는 흘러야 가장 강력합니다. 막힌 곳을 찾아 단 1mm라도 뚫는 것이 오늘의 명령입니다.' },
            { q: '"완벽한 전략"과 "지금 당장의 작은 실행" 중, 어느 것이 3개월 후 나를 더 성장시킬 것인가?', desc: '전략의 양이 아닌 실행의 속도가 壬水를 강으로 만듭니다.' },
        ],
    },
    '癸': {
        architectNote: '癸水 시스템: 촉촉한 이슬비 같은 섬세한 감지 능력이 핵심 드라이브입니다. 타인의 감정을 너무 예민하게 수신하여 자신의 신호와 타인의 신호가 혼선을 일으키는 "감정 혼선" 버그가 관찰됩니다. 수신 감도를 적절히 조율하는 내부 필터 시스템이 필요합니다.',
        darkCodes: [
            { label: '감정 혼선 (Emotion Crosstalk)', key: 'perfection', desc: '타인의 감정을 자신의 것으로 혼동하는 패턴. 외부 신호와 내부 신호의 경계가 모호해진 상태입니다.', color: 'from-sky-400 to-blue-600' },
            { label: '과잉 민감 (Hyper-Sensitivity)', key: 'anxiety', desc: '미세한 외부 자극에도 강한 내부 반응이 발생합니다. 패턴 과감지로 에너지가 지속 소모되고 있습니다.', color: 'from-blue-400 to-sky-600' },
            { label: '암묵적 기대 (Silent Expectation)', key: 'decision', desc: '말하지 않고 알아주길 기대하는 패턴. 사소 통신 실패로 관계 에러가 반복 발생 중입니다.', color: 'from-cyan-400 to-sky-600' },
        ],
        roadmap: [
            { type: '오늘', title: '감정 주인 찾기 — 내 것 vs 남의 것 구분', items: ['지금 느끼는 감정이 내 것인지 타인에게서 온 것인지 기록', '"나는 지금 무엇이 필요한가?"를 큰 소리로 말해보기'] },
            { type: '1주일', title: '직접 소통 루틴 설치', items: ['필요한 것을 상대에게 직접 말하는 연습 하루 1회', '감정 수신기 끄기 — 30분 완전 고요한 혼자만의 시간'] },
            { type: '1개월', title: '감정 필터 시스템 설계', items: ['수신할 감정과 차단할 감정의 기준 매뉴얼 작성', '비폭력 대화(NVC) 언어 훈련 — 직접 표현 근육 키우기'] },
        ],
        awarenessQuestions: [
            { q: '지금 내가 느끼는 이 감정이 진짜 나의 것인가, 아니면 주변 사람들로부터 수신된 것인가?', desc: '癸水는 모든 것을 흡수합니다. 내 안의 신호를 정확히 읽으려면 먼저 외부 신호와의 경계를 설정해야 합니다.' },
            { q: '내가 말하지 않고 상대가 알아주기를 바랐던 것들 중, 지금 당장 솔직하게 표현할 수 있는 것이 있는가?', desc: '암묵적 기대는 관계의 가장 큰 에너지 낭비입니다. 말하는 것이 가장 빠른 해결책입니다.' },
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
                        분석 요약 보고서 // <span className="text-cyan-400">DIAGNOSTIC_0X01</span>
                    </h1>
                </div>
                <div className="text-[10px] font-mono text-gray-500 text-right">
                    <p>액세스 로그</p>
                    <p className="text-yellow-400/80">{dayStem}.MODE</p>
                </div>
            </div>

            {/* ── Section 1: 코어 리소스 맵 & 무결성 점수 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#0a0f16] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-4 right-4 text-cyan-500/20 group-hover:text-cyan-500/40 transition-colors">
                        <Activity className="w-8 h-8" />
                    </div>
                    <p className="text-[10px] font-mono text-cyan-400 mb-4 tracking-widest">
                        데이터 아키텍처<br />
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
                        종합 지표 // 시스템 무결성 점수
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
                            : `에너지 재정렬이 필요합니다. 다크 코드 패턴을 즉시 점검하십시오.`}
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
                            <span className="text-gray-500">에너지 동기율</span>
                            <span style={{ color: entropyColor }}>{entropyLabel}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── 아키텍트의 기록 — 일간별 완전 동적 */}
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
                    <h2 className="text-[10px] font-mono text-pink-500 tracking-[0.3em] mb-1">02 // 신경_텔레메트리</h2>
                    <h1 className="text-2xl font-black text-white">인지 과부하 분석</h1>
                </div>
                <div className="p-6 rounded-2xl bg-[#0a0f16] border border-white/5">
                    <p className="text-[10px] font-mono text-gray-500 mb-6">
                        시그널_감지 // <span className="text-yellow-400">{dayStem}</span> 다크 코드 발현율
                    </p>
                    <div className="space-y-6">
                        {ilgan.darkCodes.map(item => {
                            const val = stressLevels[item.key];
                            return (
                                <div key={item.label}>
                                    <div className="flex justify-between items-end mb-2">
                                        <h4 className="text-sm font-bold text-white font-mono">{item.label}</h4>
                                        <span className="text-lg font-bold text-cyan-400">{val.toFixed(0)}%</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-gray-900 rounded-full overflow-hidden mb-2">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${val}%` }}
                                            transition={{ duration: 1, ease: 'easeOut' }}
                                            className={`h-full bg-gradient-to-r ${item.color} shadow-[0_0_10px_rgba(34,211,238,0.4)]`}
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-500 leading-relaxed break-keep">{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Section 3: 로드맵 — 일간별 완전 동적 */}
            <div className="pt-8">
                <div className="mb-6">
                    <h2 className="text-[10px] font-mono text-teal-400 tracking-[0.3em] mb-1">03 // 전략_기획</h2>
                    <h1 className="text-2xl font-black text-white">
                        뉴럴 코드 패치 // <span className="text-teal-400">{dayStem} 맞춤 로드맵</span>
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
