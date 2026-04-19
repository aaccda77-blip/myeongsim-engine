'use client';

/**
 * [독립 모듈] 사회적 기여 DNA 맵
 * - 일간(日干) × 십신(十神) × 오행(五行) 3축 기반
 * - 레이더 차트 + 히트맵 + 상세 분석으로 시각화
 * - SovereignCoachingReport에 플러그인 방식으로 주입 (기존 코드 최소 영향)
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateSajuStats } from '@/lib/saju/SajuEngine';

// ─────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────
export interface DnaMapScores {
    education: number;      // 교육/성장 기여
    environment: number;    // 환경/지속가능성
    creativity: number;     // 창의/혁신
    community: number;      // 커뮤니티/연결
    healing: number;        // 치유/돌봄
    leadership: number;     // 리더십/변화
}

interface DnaDomainDetail {
    label: string;
    icon: string;
    color: string;
    bgColor: string;
    score: number;
    description: string;     // 이 일간이 이 분야에서 기여하는 방식
    strength: string;        // 강점 키워드
    blindspot: string;       // 주의할 점 (Anti-Pattern)
    realExample: string;     // 현실 기여 사례
}

// ─────────────────────────────────────────────
// 10 일간별 DNA 점수 + 상세 데이터베이스
// ─────────────────────────────────────────────
const DNA_DATABASE: Record<string, {
    tagline: string;
    domains: Record<keyof DnaMapScores, DnaDomainDetail>;
}> = {
    '甲': {
        tagline: '선도하며 성장을 이식하는 거목',
        domains: {
            education:   { label: '교육/성장', icon: '🌱', color: '#22c55e', bgColor: '#052e16', score: 95, description: '선점 리더로서 길을 개척하고 다음 세대에게 이정표를 세워줍니다.', strength: '비전 제시력', blindspot: '속도 강요 — 따라오지 못하는 이를 방치할 위험', realExample: '스타트업 창업 → 생태계 구축 → 후배 창업자 멘토링' },
            environment: { label: '환경/지속가능성', icon: '🌍', color: '#16a34a', bgColor: '#052e16', score: 78, description: '장기적 관점에서 생태계를 바라보고 지속가능한 성장 구조를 설계합니다.', strength: '장기 로드맵', blindspot: '단기 가시적 성과 없음 → 동료 이탈', realExample: '50년 후를 바라본 숲 조성 프로젝트 기획' },
            creativity:  { label: '창의/혁신', icon: '✨', color: '#4ade80', bgColor: '#052e16', score: 82, description: '없는 길을 만들어내는 개척자 DNA가 혁신의 씨앗이 됩니다.', strength: '0 → 1 창출', blindspot: '기존 것을 계승하지 않으려는 파괴 충동', realExample: '새 시장 카테고리 창조, 업계 패러다임 전환' },
            community:   { label: '커뮤니티/연결', icon: '🤝', color: '#86efac', bgColor: '#052e16', score: 62, description: '공동체를 이끌지만, 자신의 속도와 고독이 연결을 약화시킵니다.', strength: '목표 결집력', blindspot: '고고한 위치에서 연결 단절됨', realExample: '비전 주도형 커뮤니티 창설 → 구심점 역할' },
            healing:     { label: '치유/돌봄', icon: '💚', color: '#4ade80', bgColor: '#052e16', score: 44, description: '약자를 섬세하게 돌보기보다 강하게 끌어올리는 방식을 선호합니다.', strength: '성장 촉진', blindspot: '취약한 이들의 속도를 무시할 수 있음', realExample: '자립 프로그램 설계 (직접 돌봄보다 시스템 제공)' },
            leadership:  { label: '리더십/변화', icon: '👑', color: '#15803d', bgColor: '#052e16', score: 91, description: '세상의 방향을 틀어버리는 전략적 리더십으로 변혁을 이끕니다.', strength: '변혁적 리더십', blindspot: '독주 — 팀을 소외시킬 위험', realExample: '사회 운동 창시, 업계 표준 재정의' },
        }
    },
    '乙': {
        tagline: '틈새를 파고들어 생명을 잇는 연결자',
        domains: {
            education:   { label: '교육/성장', icon: '🌱', color: '#22c55e', bgColor: '#052e16', score: 76, description: '상대의 속도에 맞추어 천천히 스며드는 교육으로 지속적 변화를 만듭니다.', strength: '맞춤형 코칭', blindspot: '자신의 지식을 과소평가 → 가르치기 주저', realExample: '1:1 멘토링, 취약계층 맞춤 교육 커리큘럼' },
            environment: { label: '환경/지속가능성', icon: '🌍', color: '#16a34a', bgColor: '#052e16', score: 88, description: '작은 틈새에도 뿌리를 내리는 생존 능력으로 환경 재생에 최적화됩니다.', strength: '회복 탄력 설계', blindspot: '전체 구조 변혁보다 국소 적응에 그침', realExample: '도시 틈새 정원 가꾸기, 소규모 생태 복원' },
            creativity:  { label: '창의/혁신', icon: '✨', color: '#4ade80', bgColor: '#052e16', score: 71, description: '기존 자원을 유연하게 재조합하는 혁신으로 새 가치를 창출합니다.', strength: '재조합 혁신', blindspot: '원본 창조보다 변용에 그침 — 개척자 역할은 부담', realExample: '업사이클링 아이디어, 기존 서비스 리포지셔닝' },
            community:   { label: '커뮤니티/연결', icon: '🤝', color: '#86efac', bgColor: '#052e16', score: 93, description: '네트워크 전반에 넝쿨처럼 뻗어 모든 이를 연결하는 살아있는 다리입니다.', strength: '관계 네트워킹', blindspot: '자신의 연결 희생에 대한 보상 없음 → 번아웃', realExample: '커뮤니티 코디네이터, 사회적 인프라 구축자' },
            healing:     { label: '치유/돌봄', icon: '💚', color: '#4ade80', bgColor: '#052e16', score: 85, description: '상대의 고통에 공명하며 세밀하게 회복을 돕는 천부적 치유자입니다.', strength: '공감 기반 돌봄', blindspot: '자기 자신의 치유는 뒤로 미룸', realExample: '상담사, 정신건강 지원 봉사, 위기 个人 지원' },
            leadership:  { label: '리더십/변화', icon: '👑', color: '#15803d', bgColor: '#052e16', score: 68, description: '배후에서 전체 생태계를 조율하는 조용한 변화 주도자입니다.', strength: '영향력 전파', blindspot: '전면에 나서길 피해 임팩트가 희석됨', realExample: '캠페인 기획자, 변화의 숨은 설계자' },
        }
    },
    '丙': {
        tagline: '세상을 비추어 움직이게 하는 태양',
        domains: {
            education:   { label: '교육/성장', icon: '🌱', color: '#f97316', bgColor: '#431407', score: 88, description: '강렬한 존재감과 열정으로 청중을 깨우고 세상을 향한 에너지를 불어넣습니다.', strength: '동기 부여 강의', blindspot: '내용보다 분위기에 의존 → 지속성 낮음', realExample: '대중 강연, TED류 임팩트 스피치, 유튜브 교육' },
            environment: { label: '환경/지속가능성', icon: '🌍', color: '#ea580c', bgColor: '#431407', score: 58, description: '에너지와 열정을 통해 사람들을 환경 운동에 끌어들이는 촉매 역할을 합니다.', strength: '운동 점화', blindspot: '본인 에너지 고갈 후 지속력 부재', realExample: '환경 캠페인 홍보, 기후 변화 인식 확산 운동' },
            creativity:  { label: '창의/혁신', icon: '✨', color: '#fb923c', bgColor: '#431407', score: 90, description: '세상에 없던 콘텐츠와 퍼포먼스로 문화를 창조하는 예술형 혁신가입니다.', strength: '문화 창조', blindspot: '독창성에 집착 → 협업 어려움', realExample: '사회 참여 예술, 문화 콘텐츠를 통한 인식 변화' },
            community:   { label: '커뮤니티/연결', icon: '🤝', color: '#fdba74', bgColor: '#431407', score: 83, description: '주목받는 인물로서 자연스럽게 사람들을 끌어당기며 커뮤니티를 구성합니다.', strength: '팬덤 구축', blindspot: '자신을 중심으로 한 커뮤니티 → 확장성 제한', realExample: '로컬 커뮤니티 이벤트, 소셜 무브먼트 허브' },
            healing:     { label: '치유/돌봄', icon: '💚', color: '#fb923c', bgColor: '#431407', score: 55, description: '타인을 치유하기보다 에너지를 수혈하는 방식으로 활력을 나눕니다.', strength: '활력 충전', blindspot: '세밀한 개인 감정을 챙기지 못함', realExample: '에너자이저형 봉사, 무료 퍼포먼스로 희망 전달' },
            leadership:  { label: '리더십/변화', icon: '👑', color: '#c2410c', bgColor: '#431407', score: 86, description: '카리스마적 비전으로 대중을 매혹시키고 거대한 변화의 흐름을 만들어냅니다.', strength: '카리스마 리더십', blindspot: '지속적 운영보다 점화에만 강함', realExample: '사회 운동 최전선, 대중 캠페인 리더' },
        }
    },
    '丁': {
        tagline: '가장 어두운 곳을 비추는 영혼의 촛불',
        domains: {
            education:   { label: '교육/성장', icon: '🌱', color: '#a78bfa', bgColor: '#2e1065', score: 82, description: '깊은 내면의 통찰로 1:1 집중 교육을 통해 개인의 잠재력을 끌어냅니다.', strength: '심층 코칭', blindspot: '강의보다 대화를 선호 → 규모 확장 어려움', realExample: '심리 상담, 진로 코칭, 영적 멘토링' },
            environment: { label: '환경/지속가능성', icon: '🌍', color: '#7c3aed', bgColor: '#2e1065', score: 63, description: '감성적 글쓰기와 예술로 환경 의식을 조용히 스며들게 합니다.', strength: '감성 환경 캠페인', blindspot: '직접 행동보다 간접 영향 선호', realExample: '환경 주제 시창작, 감성 다큐멘터리' },
            creativity:  { label: '창의/혁신', icon: '✨', color: '#8b5cf6', bgColor: '#2e1065', score: 89, description: '섬세한 감수성과 집착에 가까운 몰입으로 타의 추종을 불허하는 작품을 만듭니다.', strength: '장인 창작', blindspot: '타인의 평가에 극도로 민감 → 공개 주저', realExample: '사회 참여 예술, 치유적 창작 워크숍 운영' },
            community:   { label: '커뮤니티/연결', icon: '🤝', color: '#c4b5fd', bgColor: '#2e1065', score: 57, description: '소규모 깊은 유대의 커뮤니티를 형성하지만 대규모 공동체 운영은 부담.', strength: '깊이 있는 연결', blindspot: '소수 중심 →대규모 임팩트 한계', realExample: '소그룹 독서 모임, 감성 커뮤니티 호스트' },
            healing:     { label: '치유/돌봄', icon: '💚', color: '#a78bfa', bgColor: '#2e1065', score: 94, description: '가장 예민한 감수성으로 타인의 상처를 감지하고 정교하게 치유합니다.', strength: '정밀 공감 치유', blindspot: '치유자가 스스로 소진되는 역전사 외상', realExample: '상담사, 미술치료사, 위기개입 전문가' },
            leadership:  { label: '리더십/변화', icon: '👑', color: '#6d28d9', bgColor: '#2e1065', score: 71, description: '조용히 타오르는 내적 신념으로 주변을 물들이는 영향력 있는 인플루언서.', strength: '내면 신념 리더십', blindspot: '전면에 서기를 피해 리더십이 빛을 못 봄', realExample: '사상적 리더, 조용한 변화 촉진자' },
        }
    },
    '戊': {
        tagline: '만물을 품는 든든한 대지의 수호자',
        domains: {
            education:   { label: '교육/성장', icon: '🌱', color: '#d97706', bgColor: '#451a03', score: 73, description: '흔들리지 않는 원칙과 체계로 학습의 견고한 토대를 만들어 줍니다.', strength: '구조적 교육', blindspot: '변화하는 교육 트렌드 적응이 느림', realExample: '체계적 커리큘럼 설계, 기초 교육 인프라 구축' },
            environment: { label: '환경/지속가능성', icon: '🌍', color: '#b45309', bgColor: '#451a03', score: 91, description: '대지 에너지 그대로 자연을 지키고 지속가능한 생태 시스템을 구축합니다.', strength: '생태 보전 리더', blindspot: '행동보다 현상 유지를 선호 → 변화 지연', realExample: '국립공원 관리, 지속가능 농업, 생태마을 조성' },
            creativity:  { label: '창의/혁신', icon: '✨', color: '#f59e0b', bgColor: '#451a03', score: 52, description: '기존 자원을 안정적으로 운용하는 데 강하나, 창의적 파괴는 불편합니다.', strength: '자원 최적화', blindspot: '혁신보다 안정 선호 → 변화 기회 놓침', realExample: '사회적 기업 운영 효율화, 자원 재분배 시스템' },
            community:   { label: '커뮤니티/연결', icon: '🤝', color: '#fbbf24', bgColor: '#451a03', score: 86, description: '모두를 품는 포용력으로 공동체의 구심점이자 든든한 기반이 됩니다.', strength: '포용 구심점', blindspot: '자신의 필요를 드러내지 않아 번아웃 유발', realExample: '마을 공동체 허브, 지역 사회 통합 플랫폼' },
            healing:     { label: '치유/돌봄', icon: '💚', color: '#d97706', bgColor: '#451a03', score: 79, description: '대산 같은 존재감으로 취약계층에게 심리적 안전감을 제공합니다.', strength: '존재 자체의 치유', blindspot: '감정적 섬세함보다 물리적 안전에 집중', realExample: '노숙인 쉼터 운영, 취약계층 주거 지원' },
            leadership:  { label: '리더십/변화', icon: '👑', color: '#92400e', bgColor: '#451a03', score: 83, description: '변화의 소용돌이 속에서도 흔들리지 않는 중심으로 팀을 안정시킵니다.', strength: '위기 안정 리더십', blindspot: '변화에 저항 → 조직의 혁신 지연', realExample: '위기관리 리더, 대규모 조직의 안정적 운영자' },
        }
    },
    '己': {
        tagline: '조용히 비옥하게 만드는 만물의 어머니',
        domains: {
            education:   { label: '교육/성장', icon: '🌱', color: '#65a30d', bgColor: '#1a2e05', score: 85, description: '개개인의 가능성을 발굴해 적합한 환경을 조성해주는 섬세한 교육자입니다.', strength: '잠재력 발굴', blindspot: '자신의 지혜를 주변에 다 내주고 정작 자신은 성장 멈춤', realExample: '부모 교육 프로그램, 개인 맞춤형 성장 지원' },
            environment: { label: '환경/지속가능성', icon: '🌍', color: '#4d7c0f', bgColor: '#1a2e05', score: 83, description: '토양을 비옥하게 가꾸듯 지속가능한 삶의 방식을 조용히 실천합니다.', strength: '일상적 지속가능성', blindspot: '큰 그림보다 개인 생활 중심 → 규모 한계', realExample: '유기농 생활, 제로웨이스트 커뮤니티 조성' },
            creativity:  { label: '창의/혁신', icon: '✨', color: '#84cc16', bgColor: '#1a2e05', score: 67, description: '기존 것들을 정성스럽게 가꾸고 조합하여 새로운 가치를 만들어냅니다.', strength: '정성 큐레이션', blindspot: '자신의 창의적 아이디어를 공개하기 망설임', realExample: '문화재 보전, 전통과 현대의 융합 프로젝트' },
            community:   { label: '커뮤니티/연결', icon: '🤝', color: '#a3e635', bgColor: '#1a2e05', score: 90, description: '모든 구성원을 배려하며 공동체의 영양분이 되는 숨은 핵심 연결자.', strength: '집단 배려', blindspot: '자신의 필요를 드러내지 못해 관계에서 착취당함', realExample: '지역 돌봄 네트워크, 공동체 부엌/식탁' },
            healing:     { label: '치유/돌봄', icon: '💚', color: '#65a30d', bgColor: '#1a2e05', score: 92, description: '어머니의 대지처럼 아무도 거부하지 않고 모두를 품어 치유합니다.', strength: '무조건적 돌봄', blindspot: '자기 자신을 마지막 순위에 두어 스스로 병듦', realExample: '장기 요양 봉사, 다문화 가정 지원' },
            leadership:  { label: '리더십/변화', icon: '👑', color: '#3f6212', bgColor: '#1a2e05', score: 72, description: '모두의 의견을 수렴하여 합의를 이끄는 조화형 리더입니다.', strength: '합의 도출', blindspot: '우유부단해 보여 결단력 의심받음', realExample: '지역 갈등 조정자, 사회적 협동조합 운영자' },
        }
    },
    '庚': {
        tagline: '불순물을 제거하고 세상을 정제하는 강철',
        domains: {
            education:   { label: '교육/성장', icon: '🌱', color: '#9ca3af', bgColor: '#111827', score: 74, description: '엄격한 기준과 체계적 프레임으로 실력 기반의 진짜 성장을 이끕니다.', strength: '기준 기반 교육', blindspot: '너무 엄격해 학습자 의욕 저하 가능', realExample: '전문 기술 훈련, 군사/체육 교육, 역량 진단 프로그램' },
            environment: { label: '환경/지속가능성', icon: '🌍', color: '#6b7280', bgColor: '#111827', score: 70, description: '비효율적 환경 파괴 시스템을 단호하게 개혁하는 정책형 환경 전사입니다.', strength: '구조적 환경 개혁', blindspot: '공감 없는 개혁 →저항 유발', realExample: '환경 규제 정책 설계, 불법 쓰레기 근절 캠페인' },
            creativity:  { label: '창의/혁신', icon: '✨', color: '#d1d5db', bgColor: '#111827', score: 65, description: '불필요한 것을 제거하는 미니멀 혁신으로 정제된 시스템을 만들어냅니다.', strength: '정제형 혁신', blindspot: '새로운 것의 가치를 빠르게 무시하는 경향', realExample: '비효율적 사회 시스템 재설계, 표준화 작업' },
            community:   { label: '커뮤니티/연결', icon: '🤝', color: '#e5e7eb', bgColor: '#111827', score: 54, description: '명확한 공동 목표 아래 강점 있는 멤버들을 조직화하여 성과를 냅니다.', strength: '목적형 조직화', blindspot: '따뜻한 연결보다 기능적 관계에 그침', realExample: 'タスク포스 결성, 사회 문제 해결형 프로젝트 팀' },
            healing:     { label: '치유/돌봄', icon: '💚', color: '#9ca3af', bgColor: '#111827', score: 47, description: '직접적인 돌봄보다 근본 원인을 제거하는 방식으로 치유에 기여합니다.', strength: '근본 원인 제거', blindspot: '차갑게 느껴져 관계적 치유 실패 가능', realExample: '사회 구조적 문제 해결 (제도 개혁을 통한 치유)' },
            leadership:  { label: '리더십/변화', icon: '👑', color: '#374151', bgColor: '#111827', score: 93, description: '결단력 있게 방향을 정하고 과감히 불필요한 것을 쳐내는 변혁형 리더.', strength: '결단형 변혁 리더십', blindspot: '인간적 고려 없는 구조조정 → 신뢰 이탈', realExample: '조직 혁신 리더, 부패 척결 활동가' },
        }
    },
    '辛': {
        tagline: '세상의 흠결을 발견하고 정제하는 보석',
        domains: {
            education:   { label: '교육/성장', icon: '🌱', color: '#67e8f9', bgColor: '#083344', score: 80, description: '디테일에 강한 정밀 교육으로 수강자의 역량을 명품 수준으로 끌어올립니다.', strength: '정밀 역량 개발', blindspot: '자신의 높은 기준으로 학습자를 질리게 함', realExample: '전문 자격증 코칭, 피드백 강도 높은 교육' },
            environment: { label: '환경/지속가능성', icon: '🌍', color: '#22d3ee', bgColor: '#083344', score: 72, description: '환경 문제의 세밀한 데이터를 분석하고 정교한 해결책을 제시합니다.', strength: '데이터 기반 환경 분석', blindspot: '완벽한 해결책 없이는 행동 못 함 → 마비', realExample: '환경 영향 평가 보고서, 데이터 기반 정책 제안' },
            creativity:  { label: '창의/혁신', icon: '✨', color: '#a5f3fc', bgColor: '#083344', score: 91, description: '기존의 불완전함을 극복하는 정밀한 개선과 혁신으로 최고 수준의 작품을 냅니다.', strength: '품질 극대화 혁신', blindspot: '완벽을 추구하다 출시 시기 놓침', realExample: '디자인 혁신, 세밀한 브랜딩, 예술적 정밀 작업' },
            community:   { label: '커뮤니티/연결', icon: '🤝', color: '#cffafe', bgColor: '#083344', score: 53, description: '고품질의 소수 관계를 중시하며 수준 있는 커뮤니티를 구성합니다.', strength: '고품질 네트워크', blindspot: '배타적 기준으로 커뮤니티 확장 제한', realExample: '전문가 그룹, 하이엔드 소셜 클럽, 품질 기준 커뮤니티' },
            healing:     { label: '치유/돌봄', icon: '💚', color: '#67e8f9', bgColor: '#083344', score: 77, description: '치유의 방식도 정밀하게 접근하여 피상적 돌봄보다 깊은 변화를 만듭니다.', strength: '정밀 치유', blindspot: '상처를 파고드는 날카로움이 오히려 상처를 줄 수 있음', realExample: '트라우마 정밀 상담, 고급 웰니스 프로그램' },
            leadership:  { label: '리더십/변화', icon: '👑', color: '#0891b2', bgColor: '#083344', score: 79, description: '높은 기준을 제시하며 집단의 수준을 끌어올리는 품질 중심 리더십.', strength: '품질 기준 리더십', blindspot: '기준에 못 미치는 구성원 배제 경향', realExample: '전문조직 리더, 품질 혁신 드라이버' },
        }
    },
    '壬': {
        tagline: '깊은 지혜로 세상의 구조를 꿰뚫는 심연',
        domains: {
            education:   { label: '교육/성장', icon: '🌱', color: '#60a5fa', bgColor: '#0c1a2e', score: 87, description: '심층적 통찰과 폭넓은 지식으로 학습자의 세계관 자체를 바꾸는 교육을 합니다.', strength: '세계관 확장 교육', blindspot: '너무 거시적 → 실용적 스킬 교육 약함', realExample: '철학적 강의, 인문학 기반 리더십 교육, 비판적 사고 교육' },
            environment: { label: '환경/지속가능성', icon: '🌍', color: '#3b82f6', bgColor: '#0c1a2e', score: 80, description: '환경 문제의 거대한 흐름과 패턴을 읽어 장기적 전략을 제시합니다.', strength: '장기 전략 수립', blindspot: '분석은 탁월하나 행동 전환 속도 느림', realExample: '기후 전략 연구, 글로벌 환경 정책 설계' },
            creativity:  { label: '창의/혁신', icon: '✨', color: '#93c5fd', bgColor: '#0c1a2e', score: 84, description: '기존 구조 전체를 뒤집는 패러다임 전환급 혁신 아이디어를 생산합니다.', strength: '패러다임 혁신', blindspot: '아이디어는 넘치나 실행 동반자 필요', realExample: '플랫폼 비즈니스 설계, 사회 시스템 재설계' },
            community:   { label: '커뮤니티/연결', icon: '🤝', color: '#bfdbfe', bgColor: '#0c1a2e', score: 75, description: '다양한 사람들을 깊이 이해하며 서로 다른 그룹을 연결하는 통합자입니다.', strength: '다양성 통합', blindspot: '과도한 포용으로 자신의 경계 상실', realExample: '다원화 사회 통합 프로젝트, 글로벌 연대 플랫폼' },
            healing:     { label: '치유/돌봄', icon: '💚', color: '#60a5fa', bgColor: '#0c1a2e', score: 82, description: '상대의 마음 깊숙한 곳까지 공감하여 심층적인 치유를 이끌어냅니다.', strength: '심층 공감 치유', blindspot: '상대의 우울을 다 흡수하여 자신이 침잠', realExample: '트라우마 치유 전문가, 심리극 치료사' },
            leadership:  { label: '리더십/변화', icon: '👑', color: '#1d4ed8', bgColor: '#0c1a2e', score: 78, description: '큰 흐름을 꿰뚫는 전략가로서 시대의 방향을 읽고 변화를 준비합니다.', strength: '전략적 변화 리더십', blindspot: '과잉 분석 → 행동 타이밍 놓침', realExample: '미래 전략가, 싱크탱크 리더, 사회 변화 설계자' },
        }
    },
    '癸': {
        tagline: '모든 틈에 스며들어 생명을 깨우는 봄비',
        domains: {
            education:   { label: '교육/성장', icon: '🌱', color: '#818cf8', bgColor: '#1e1b4b', score: 83, description: '스며들듯 자연스럽게 학습자의 마음을 열고 성장의 씨앗을 심어줍니다.', strength: '비공식적 영향력 교육', blindspot: '체계적 교육보다 영감 중심 → 지속성 한계', realExample: '비공식 멘토링, 영감을 주는 스토리텔링 교육' },
            environment: { label: '환경/지속가능성', icon: '🌍', color: '#6366f1', bgColor: '#1e1b4b', score: 76, description: '물처럼 모든 환경에 스며들어 조용히 지속가능한 문화를 만듭니다.', strength: '일상 환경 문화 전파', blindspot: '가시적 성과 없어 기여가 보이지 않음', realExample: '생활 속 환경 문화 캠페인, 소셜 미디어 인식 확산' },
            creativity:  { label: '창의/혁신', icon: '✨', color: '#a5b4fc', bgColor: '#1e1b4b', score: 88, description: '경계를 넘나드는 유연한 사고로 예상치 못한 연결을 통해 혁신합니다.', strength: '크로스오버 혁신', blindspot: '아이디어가 산재해 실행력 약함', realExample: '분야를 넘나드는 융합 창작, 예술-기술 경계 작업' },
            community:   { label: '커뮤니티/연결', icon: '🤝', color: '#c7d2fe', bgColor: '#1e1b4b', score: 91, description: '어느 그룹에도 조용히 스며들어 내부를 연결하는 가장 유연한 연결자입니다.', strength: '경계 없는 연결', blindspot: '자아를 잃을 만큼 과도한 동화', realExample: '다문화 브릿지 활동, 세대 간 연결 프로젝트' },
            healing:     { label: '치유/돌봄', icon: '💚', color: '#818cf8', bgColor: '#1e1b4b', score: 95, description: '비처럼 조용히 스며들어 상대가 모르는 사이 치유를 완성하는 최고의 치유자.', strength: '무의식적 치유', blindspot: '치유하다 자신의 경계를 잃고 오염됨', realExample: '자연 치유, 미술/음악 치료, 비언어적 공감 치유' },
            leadership:  { label: '리더십/변화', icon: '👑', color: '#4338ca', bgColor: '#1e1b4b', score: 74, description: '보이지 않는 영향력으로 조용히 집단 전체의 방향을 바꾸는 소프트 파워 리더.', strength: '소프트 파워 리더십', blindspot: '리더로 인정받기 어려워 공신력 획득 어려움', realExample: '비공식 문화 리더, 사회 분위기 메이커' },
        }
    },
};

// ─────────────────────────────────────────────
// SVG 레이더 차트 컴포넌트 (프리미엄 HUD 에디션)
// ─────────────────────────────────────────────
function RadarChart({ scores, color }: { scores: DnaMapScores; color: string }) {
    const size = 280; // 크기 약간 확대
    const center = size / 2;
    const radius = 95;
    const domains = [
        { key: 'education', label: '교육' },
        { key: 'environment', label: '환경' },
        { key: 'creativity', label: '창의' },
        { key: 'community', label: '커뮤니티' },
        { key: 'healing', label: '치유' },
        { key: 'leadership', label: '리더십' },
    ] as const;
    const n = domains.length;

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const getPoint = (index: number, value: number) => {
        const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
        const r = (value / 100) * radius;
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle),
        };
    };

    const getAxisPoint = (index: number, r: number) => {
        const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
        return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
    };

    const dataPoints = domains.map((d, i) => getPoint(i, scores[d.key]));
    const polygonPoints = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

    const gridLevels = [25, 50, 75, 100];

    return (
        <div className="relative flex justify-center items-center w-full my-6">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
                <defs>
                    {/* 네온 글로우 필터 */}
                    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur2" />
                        <feMerge>
                            <feMergeNode in="blur2" />
                            <feMergeNode in="blur1" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    
                    {/* 레이더 표면 방사형 그라데이션 */}
                    <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.7" />
                        <stop offset="60%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.05" />
                    </radialGradient>
                </defs>

                {/* 중앙 코어 포인트 (스마트 워치 심박계 느낌 부여) */}
                <circle cx={center} cy={center} r="3" fill="#ffffff" opacity="0.3" filter="url(#neonGlow)" />
                <circle cx={center} cy={center} r="40" fill={color} opacity="0.05" />

                {/* HUD 스타일 동심원 배경 그리드 */}
                {gridLevels.map((level, i) => (
                    <circle 
                        key={`circ-${level}`} 
                        cx={center} 
                        cy={center} 
                        r={(level/100) * radius} 
                        fill="none" 
                        stroke="rgba(255,255,255,0.03)" 
                        strokeWidth="1"
                        strokeDasharray={i % 2 === 0 ? "4 4" : "none"}
                    />
                ))}

                {/* 배경 다각형 그리드 */}
                {gridLevels.map((level, i) => {
                    const pts = Array.from({ length: n }, (_, idx) => getAxisPoint(idx, (level / 100) * radius));
                    return (
                        <polygon
                            key={`poly-${level}`}
                            points={pts.map(p => `${p.x},${p.y}`).join(' ')}
                            fill="none"
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth={level === 100 ? "1.5" : "1"}
                            strokeDasharray={level === 100 ? "none" : "2 6"}
                        />
                    );
                })}

                {/* 축 라인 (크로스헤어 UI) */}
                {domains.map((_, i) => {
                    const outer = getAxisPoint(i, radius + 5);
                    return (
                        <g key={`axis-${i}`}>
                            <line 
                                x1={center} y1={center} 
                                x2={outer.x} y2={outer.y} 
                                stroke="rgba(255,255,255,0.15)" strokeWidth="1" 
                                strokeDasharray="1 3"
                            />
                            {/* 끝점 기준 마커 */}
                            <circle cx={outer.x} cy={outer.y} r="1.5" fill="rgba(255,255,255,0.3)" />
                        </g>
                    );
                })}

                {/* 실제 데이터 영역 (그라데이션 및 네온 필터 적용) */}
                <motion.polygon
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: `${center}px ${center}px` }}
                    points={polygonPoints}
                    fill="url(#radarGradient)"
                    stroke={color}
                    strokeWidth="2.5"
                    filter="url(#neonGlow)"
                    className="cursor-pointer"
                />

                {/* 데이터 포인트 노드 & 펄스 효과 */}
                {dataPoints.map((p, i) => (
                    <g key={`dp-${i}`} 
                       onMouseEnter={() => setHoveredIndex(i)} 
                       onMouseLeave={() => setHoveredIndex(null)}
                       className="cursor-pointer"
                    >
                        {/* 힛박스 (호버 용이성) */}
                        <circle cx={p.x} cy={p.y} r="15" fill="transparent" />
                        
                        <motion.circle
                            initial={{ opacity: 0, r: 0 }}
                            animate={{ 
                                opacity: 1, 
                                r: hoveredIndex === i ? 6 : 4,
                                fill: hoveredIndex === i ? '#ffffff' : color
                            }}
                            transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
                            cx={p.x}
                            cy={p.y}
                            stroke={hoveredIndex === i ? color : "transparent"}
                            strokeWidth="2"
                            filter={hoveredIndex === i ? "url(#neonGlow)" : "none"}
                        />
                        {/* 마우스 호버 시 숨막히는 물결(Ping) 애니메이션 */}
                        {hoveredIndex === i && (
                            <motion.circle
                                initial={{ opacity: 0.8, r: 4 }}
                                animate={{ opacity: 0, r: 18 }}
                                transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }}
                                cx={p.x}
                                cy={p.y}
                                fill="none"
                                stroke={color}
                                strokeWidth="2"
                            />
                        )}
                    </g>
                ))}

                {/* 카테고리 레이블 및 마우스 오버 툴팁 */}
                {domains.map((d, i) => {
                    const pt = getAxisPoint(i, radius + 32);
                    const isHovered = hoveredIndex === i;
                    return (
                        <g key={`lbl-${i}`}>
                            <motion.text 
                                x={pt.x} y={pt.y} 
                                textAnchor="middle" dominantBaseline="middle" 
                                fontSize={isHovered ? "11" : "10"} 
                                fontWeight={isHovered ? "bold" : "normal"}
                                fill={isHovered ? "#ffffff" : "rgba(255,255,255,0.6)"}
                                transition={{ duration: 0.2 }}
                            >
                                {d.label}
                            </motion.text>

                            {/* 툴팁 팝업 */}
                            <AnimatePresence>
                                {isHovered && (
                                    <motion.g 
                                        initial={{ opacity: 0, y: 5 }} 
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                    >
                                        <rect 
                                            x={pt.x - 22} y={pt.y + 12} 
                                            width="44" height="22" 
                                            rx="4" fill={color} opacity="0.9"
                                            filter="url(#neonGlow)"
                                        />
                                        <text 
                                            x={pt.x} y={pt.y + 23} 
                                            fill="#ffffff" fontSize="11" 
                                            fontWeight="900" 
                                            textAnchor="middle" dominantBaseline="middle"
                                        >
                                            {scores[d.key]}점
                                        </text>
                                    </motion.g>
                                )}
                            </AnimatePresence>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

// ─────────────────────────────────────────────
// 도메인 상세 카드
// ─────────────────────────────────────────────
function DomainCard({ domain, index }: { domain: DnaDomainDetail; index: number }) {
    const [expanded, setExpanded] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            className="rounded-xl border border-white/5 overflow-hidden"
            style={{ background: `${domain.bgColor}cc` }}
        >
            <button
                onClick={() => setExpanded(p => !p)}
                className="w-full flex items-center gap-3 p-3 text-left"
            >
                <span className="text-xl">{domain.icon}</span>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-white">{domain.label}</span>
                        <span className="text-sm font-black" style={{ color: domain.color }}>{domain.score}</span>
                    </div>
                    <div className="mt-1 h-1.5 bg-black/30 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${domain.score}%` }}
                            transition={{ duration: 1, ease: 'easeOut', delay: index * 0.07 }}
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(to right, ${domain.color}88, ${domain.color})` }}
                        />
                    </div>
                </div>
                <span className="text-slate-500 text-xs">{expanded ? '▲' : '▼'}</span>
            </button>
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
                            <p className="text-xs text-slate-300 leading-relaxed">{domain.description}</p>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-black/20 rounded-lg p-2">
                                    <p className="text-xs text-slate-500 mb-1">💪 강점</p>
                                    <p className="text-xs font-bold" style={{ color: domain.color }}>{domain.strength}</p>
                                </div>
                                <div className="bg-black/20 rounded-lg p-2">
                                    <p className="text-xs text-slate-500 mb-1">⚠️ 주의</p>
                                    <p className="text-xs text-orange-300">{domain.blindspot}</p>
                                </div>
                            </div>
                            <div className="bg-black/20 rounded-lg p-2">
                                <p className="text-xs text-slate-500 mb-1">🌟 기여 사례</p>
                                <p className="text-xs text-slate-200">{domain.realExample}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ─────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────
interface SocialDnaMapProps {
    dayStem: string;       // 일간 한자 (甲, 乙, ..., 癸)
    userName?: string;
    fourPillars?: any;     // 사주 8글자 전체 객체 (calculateSajuStats 동적 계산용)
}

// ─────────────────────────────────────────────
// 동적 점수 증폭 알고리즘 (십성 가중치)
// 십성: resource=인성, output=식상, self=비겁, power=관성, wealth=재성
// ─────────────────────────────────────────────
function amplifyScores(
    base: DnaMapScores,
    tenGods: { resource: number; output: number; self: number; power: number; wealth: number }
): DnaMapScores {
    const cap = (v: number) => Math.min(99, Math.round(v));
    return {
        education:   cap(base.education   + tenGods.resource * 6 + tenGods.output * 3),
        environment: cap(base.environment + tenGods.self * 5     + tenGods.resource * 4),
        creativity:  cap(base.creativity  + tenGods.output * 8),
        community:   cap(base.community   + tenGods.wealth * 6  + tenGods.self * 4),
        healing:     cap(base.healing     + tenGods.resource * 5 + tenGods.output * 4),
        leadership:  cap(base.leadership  + tenGods.power * 8),
    };
}

export default function SocialDnaMap({ dayStem, userName, fourPillars }: SocialDnaMapProps) {
    const [activeView, setActiveView] = useState<'radar' | 'list'>('radar');

    const data = useMemo(() => DNA_DATABASE[dayStem] || DNA_DATABASE['甲'], [dayStem]);

    // ── 십성 동적 계산 ──
    const tenGods = useMemo(() => {
        if (fourPillars) {
            try {
                const stats = calculateSajuStats(fourPillars, dayStem);
                return stats.tenGods;
            } catch { /* fallback */ }
        }
        return { resource: 0, output: 0, self: 0, power: 0, wealth: 0 };
    }, [fourPillars, dayStem]);

    // ── 기본 점수 (일간 DB 기준) ──
    const baseScores = useMemo((): DnaMapScores => ({
        education:   data.domains.education.score,
        environment: data.domains.environment.score,
        creativity:  data.domains.creativity.score,
        community:   data.domains.community.score,
        healing:     data.domains.healing.score,
        leadership:  data.domains.leadership.score,
    }), [data]);

    // ── 동적 증폭 점수 (십성 반영) ──
    const scores = useMemo(() => amplifyScores(baseScores, tenGods), [baseScores, tenGods]);

    // ── 최고 기여 분야 (동적 점수 기준 재계산) ──
    const topDomain = useMemo(() => {
        const domainKeys = Object.keys(data.domains) as (keyof DnaMapScores)[];
        let best = { ...data.domains[domainKeys[0]], score: scores[domainKeys[0]] };
        for (const key of domainKeys) {
            if (scores[key] > best.score) {
                best = { ...data.domains[key], score: scores[key] };
            }
        }
        return best;
    }, [data, scores]);

    // ── 십성 반영 여부 표시용 ──
    const hasDynamicData = fourPillars != null;

    // 일간별 대표색
    const STEM_COLORS: Record<string, string> = {
        '甲': '#22c55e', '乙': '#4ade80', '丙': '#f97316', '丁': '#a78bfa',
        '戊': '#d97706', '己': '#84cc16', '庚': '#9ca3af', '辛': '#67e8f9',
        '壬': '#60a5fa', '癸': '#818cf8',
    };
    const themeColor = STEM_COLORS[dayStem] || '#818cf8';

    return (
        <div className="w-full space-y-4">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-black" style={{ color: themeColor }}>{dayStem}</span>
                        <div>
                            <p className="text-xs text-slate-400">사회적 기여 DNA 맵</p>
                            <p className="text-sm font-bold text-white">{data.tagline}</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-1 bg-slate-800/60 rounded-lg p-1">
                    {(['radar', 'list'] as const).map(v => (
                        <button
                            key={v}
                            onClick={() => setActiveView(v)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-all ${activeView === v ? 'text-white shadow' : 'text-slate-500'}`}
                            style={activeView === v ? { background: themeColor + '44', color: themeColor } : {}}
                        >
                            {v === 'radar' ? '📊 레이더' : '📋 상세'}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeView === 'radar' ? (
                    <motion.div key="radar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {/* 레이더 차트 */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="bg-slate-900/60 rounded-2xl p-4 border border-white/5">
                                <RadarChart scores={scores} color={themeColor} />
                            </div>

                            {/* Top 기여 분야 뱃지 */}
                            <div className="w-full bg-slate-800/40 rounded-xl p-3 border border-white/5">
                                <p className="text-xs text-slate-400 mb-2">🏆 당신의 핵심 기여 분야</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{topDomain.icon}</span>
                                    <div>
                                        <p className="text-sm font-black" style={{ color: themeColor }}>{topDomain.label} — {topDomain.score}점</p>
                                        <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{topDomain.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* 간략 스코어 바 */}
                            <div className="w-full grid grid-cols-2 gap-2">
                                {Object.values(data.domains).map((d, i) => (
                                    <div key={i} className="bg-slate-800/30 rounded-lg p-2">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-400">{d.icon} {d.label}</span>
                                            <span className="font-bold" style={{ color: d.color }}>{d.score}</span>
                                        </div>
                                        <div className="h-1 bg-black/30 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${d.score}%` }}
                                                transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.08 }}
                                                className="h-full rounded-full"
                                                style={{ background: d.color }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                        <p className="text-xs text-slate-500">각 영역을 눌러 상세 기여 방식과 주의점을 확인하세요 👆</p>
                        {Object.values(data.domains).map((d, i) => (
                            <DomainCard key={d.label} domain={d} index={i} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
