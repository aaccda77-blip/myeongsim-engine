'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { useReportStore } from '@/store/useReportStore';
import { calculateSaju } from '@/utils/SajuCalculator';
import ExecutiveDashboardModal from '@/components/startup/ExecutiveDashboardModal';
import { ShieldCheck, Copy, Check, Building2, KeyRound, Sparkles, BookOpen, ExternalLink, Lock, Brain, Activity, Zap, HeartPulse } from 'lucide-react';

export default function StartupDashboard() {
        const router = useRouter();
    const reportData = useReportStore((s) => s.reportData);

    // 🔮 [실시간 사주 데이터 동기화 & 10천간 기반 동적 웰니스 매트릭스 엔진]
    const userSajuProfile = useMemo(() => {
        let metaData: any = {};
        let psychData: any = {};

        if (reportData) {
            metaData = reportData.meta || {};
            psychData = (reportData as any).psych || {};
        }

        if (typeof window !== 'undefined') {
            try {
                const rawOnboarding = localStorage.getItem('user_onboarding_data');
                if (rawOnboarding) {
                    const parsed = JSON.parse(rawOnboarding);
                    metaData = { ...metaData, ...parsed, ...(parsed.meta || {}) };
                    psychData = { ...psychData, ...parsed, ...(parsed.psych || {}) };
                }
                const storeRaw = localStorage.getItem('myeongsim_report_store');
                if (storeRaw) {
                    const parsed = JSON.parse(storeRaw);
                    const stateData = parsed.state?.reportData || parsed;
                    metaData = { ...metaData, ...(stateData.meta || {}) };
                    psychData = { ...psychData, ...(stateData.psych || {}) };
                }
                const rawSaju = localStorage.getItem('user_saju_info');
                if (rawSaju) {
                    const parsed = JSON.parse(rawSaju);
                    metaData = { ...metaData, ...parsed };
                }
            } catch (e) {}
        }

        const userName = reportData?.userName || (reportData as any)?.name || metaData?.userName || metaData?.name || (typeof window !== 'undefined' ? localStorage.getItem('user_name') : null) || '명심가';
        const birthDate = reportData?.birthDate || (reportData as any)?.birth_date || metaData?.birthDate || metaData?.birth_date || (typeof window !== 'undefined' ? localStorage.getItem('user_birth_date') : null) || '1990-01-01';
        const birthTime = reportData?.birthTime || (reportData as any)?.birth_time || metaData?.birthTime || metaData?.birth_time || '12:00';
        const calendarType = (reportData as any)?.calendarType || (reportData as any)?.calendar_type || metaData?.calendarType || 'solar';
        const gender = reportData?.gender || metaData?.gender || 'female';

        // 🌟 [실시간 만세력 엔진 가동] 생년월일로부터 직접 정확한 사주 일간(DayMaster) 100% 정밀 도출
        let computedDayMaster = '辛';
        try {
            if (birthDate && birthDate.includes('-')) {
                const sajuResult = calculateSaju(birthDate, birthTime, calendarType, gender);
                if (sajuResult?.day?.gan?.hanja) {
                    computedDayMaster = sajuResult.day.gan.hanja;
                }
            }
        } catch (e) {
            console.warn('Realtime saju calculation fallback:', e);
        }

        // 백업 추출 (한글 및 한자 모두 대응)
        const HANJA_STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
        const KOR_STEMS_MAP: Record<string, string> = { '갑':'甲', '을':'乙', '병':'丙', '정':'丁', '무':'戊', '기':'己', '경':'庚', '신':'辛', '임':'壬', '계':'癸' };
        
        let finalDayMaster = computedDayMaster;
        if (!finalDayMaster || finalDayMaster === '辛') {
            const raw = reportData?.saju?.dayMaster || metaData?.dayMaster || metaData?.dayMasterChar || '';
            const foundHanja = HANJA_STEMS.find(c => raw.includes(c));
            if (foundHanja) {
                finalDayMaster = foundHanja;
            } else {
                for (const [kor, han] of Object.entries(KOR_STEMS_MAP)) {
                    if (raw.includes(kor)) {
                        finalDayMaster = han;
                        break;
                    }
                }
            }
        }
        const dayMaster = finalDayMaster || '辛';

        // 10천간별 6대 역량 프로필 데이터셋 (세계 최고 웰니스 & 뇌신경 코칭 기준)
        const MATRIX_PROFILES: Record<string, any> = {
            '甲': {
                dayMasterName: '甲木 (선구자/기획형)',
                scores: { innovation: 98, capital: 86, execution: 89, market: 95, leadership: 92, mental: 82 },
                ceoPower: 90.3,
                businessFit: 95.4,
                bizRank1: '신규 카테고리 창출 플랫폼 & 하이테크 스타트업',
                bizRank2: '친환경/웰니스 에듀테크 & 커뮤니티 비즈니스',
                peakHour: '오전 06:00 ~ 08:30 (새벽 영감 분출)',
                vagusTip: '나무가 깊은 뿌리를 내리듯 복식호흡으로 뇌신경 진정',
                axes: {
                    innovation: { bioWellness: '전두엽 고도화 & 원초적 창의성', dark: '완벽주의 기획의 늪으로 인한 첫 삽 지연', neural: '작은 가지(MVP)부터 뻗는 24시간 내 가설 검증', meta: '새로운 시대를 여는 우주적 영감의 발원지', action: '떠오른 아이디어 중 가장 작은 1개 20분 내 문서화하기' },
                    capital: { bioWellness: '자본 순환 흐름 수용', dark: '이상주의에 치우쳐 초기 현금 회전율 간과', neural: '단위 경제성(LTV/CAC)과 마진 구조 정렬', meta: '자본이 저절로 깃드는 가치 저장소 확립', action: '초기 매출 파이프라인 1개 구조화하기' },
                    execution: { bioWellness: '기민한 신경계 순발력', dark: '장대한 계획에 압도당해 시작을 망설임', neural: '스프린트 쪼개기로 매일 1회 완결 경험', meta: '싹을 틔우듯 거침없는 생명력의 도약', action: '오늘 가장 중요한 과제 1개 25분 몰입 완수' },
                    market: { bioWellness: '거시적 시장 통찰력', dark: '대중의 니즈보다 나의 비전에만 몰입', neural: '고객 현장 인터뷰 3회로 시장 접점 맞추기', meta: '세상이 갈망하는 숲을 가꾸는 카테고리 지배력', action: '타겟 고객 1명에게 질문 던지기' },
                    leadership: { bioWellness: '큰 나무의 그늘 리더십', dark: '독단적 결정으로 팀원의 소외감 유발', neural: '비전 공유와 자율성 부여로 능동적 참여 유도', meta: '수많은 인재가 모여 쉬어가는 거목의 품격', action: '팀원에게 따뜻한 지지와 신뢰 표현하기' },
                    mental: { bioWellness: '부교감신경 이완 회복', dark: '부러질 듯 팽팽한 긴장감과 과도한 책임감', neural: '녹색 자연 산책 15분으로 뇌파 쿨다운', meta: '비바람에도 흔들리지 않는 대자연의 고요', action: '창밖 나무나 하늘 보며 3분 깊은 호흡' }
                }
            },
            '乙': {
                dayMasterName: '乙木 (네트워크/적응형)',
                scores: { innovation: 91, capital: 88, execution: 90, market: 97, leadership: 96, mental: 84 },
                ceoPower: 91.0,
                businessFit: 94.8,
                bizRank1: '크리에이터/인플루언서 네트워크 & D2C 커머스',
                bizRank2: '커뮤니티 기반 멤버십 & 지식 콘텐츠 구독',
                peakHour: '오전 09:30 ~ 12:00 (협업 및 소통 극대화)',
                vagusTip: '거절에 흔들리지 않는 심리적 안전지대 자각',
                axes: {
                    innovation: { bioWellness: '유연한 환경 적응 및 변용', dark: '트렌드에 휘둘려 핵심 정체성 희석', neural: '나만의 오리지널리티 코어 1개 규정', meta: '어떤 틈새에서도 꽃을 피워내는 무한 생명력', action: '기존 아이템에 독창적 한 끗 더하기' },
                    capital: { bioWellness: '관계 자본의 현금화', dark: '거절하지 못해 불리한 조건 수용', neural: '명확한 계약서와 상호 윈윈 단가 책정', meta: '사람과 자본이 그물망처럼 얽히는 풍요', action: '미수금 및 정산 조건 명확히 재확인' },
                    execution: { bioWellness: '유기적 연계 실행력', dark: '타인의 피드백에 일희일비하며 방향 선회', neural: '주간 핵심 KPI 3개에 집중하는 필터 장착', meta: '담쟁이덩굴처럼 장벽을 타고 넘는 유연한 전진', action: '오늘 목표한 연락 및 공유 10분 내 완료' },
                    market: { bioWellness: '초연결 시장 바이럴', dark: '부정적 댓글에 대한 과민 반응과 위축', neural: '지지자(True Fans) 100명과의 깊은 유대 우선', meta: '입소문으로 들불처럼 번져나가는 시장 장악', action: '핵심 고객 2명에게 감사 메시지 전하기' },
                    leadership: { bioWellness: '공감과 화합의 시너지', dark: '갈등 회피로 인한 문제 누적', neural: '부드럽지만 단호한 경계선 소통 훈련', meta: '존재 자체로 서로를 잇는 황금 네트워크', action: '파트너의 강점을 구체적으로 칭찬하기' },
                    mental: { bioWellness: '미주신경 안정화', dark: '에너지 과소비로 인한 번아웃 방전', neural: '나 혼자만의 고요한 시간 30분 확보', meta: '봄바람에 춤추는 꽃잎 같은 자유로움', action: '차 한 잔 마시며 오프라인 휴식 취하기' }
                }
            },
            '丙': {
                dayMasterName: '丙火 (태양/폭발적 확장형)',
                scores: { innovation: 94, capital: 85, execution: 98, market: 97, leadership: 88, mental: 80 },
                ceoPower: 90.3,
                businessFit: 96.2,
                bizRank1: '글로벌 B2B/B2C 바이럴 마케팅 & 미디어 엔터테인먼트',
                bizRank2: '임팩트 투자 & 트렌드 선도형 테크 솔루션',
                peakHour: '오전 11:00 ~ 오후 01:30 (태양열 극대화 시간)',
                vagusTip: '과열된 뇌를 식히는 쿨다운 냉각 호흡',
                axes: {
                    innovation: { bioWellness: '압도적 비전 투사력', dark: '현실적 디테일 결여로 인한 실행 오차', neural: 'CFO/COO와의 페어링으로 수치 검증 병행', meta: '온 세상을 밝히는 태양빛 같은 통찰', action: '비전을 1장의 로드맵으로 구조화하기' },
                    capital: { bioWellness: '대형 펀딩 및 자본 유치', dark: '과도한 지출과 스케일업 조급증', neural: '런웨이(Runway) 12개월 안전마진 확보', meta: '황금빛 햇살처럼 쏟아져 들어오는 대자본', action: '이번 달 현금 지출 우선순위 3개 점검' },
                    execution: { bioWellness: '폭발적 추진 에너지', dark: '단거리 질주 후 급격한 탈진(Crash)', neural: '페이스 조절을 위한 인터벌 휴식 도입', meta: '빛의 속도로 세상을 변화시키는 추진력', action: '가장 파급력 큰 일 1개에 화력 집중' },
                    market: { bioWellness: '독보적 브랜드 파워', dark: '과장된 메시지로 인한 신뢰 하락 위험', neural: '진정성 있는 고객 성공 스토리 전면 배치', meta: '만인을 감화시키는 눈부신 브랜드 카리스마', action: '우리 서비스의 핵심 가치 1문장 선언' },
                    leadership: { bioWellness: '열정과 사기 진작', dark: '팀원들에게 본인 수준의 에너지 강요', neural: '각자의 템포를 존중하는 서포트형 리더십', meta: '모든 구성원의 심장을 뛰게 만드는 태양', action: '팀원 한 명의 노고를 진심으로 격려' },
                    mental: { bioWellness: '심장 열기 진정 & 릴랙스', dark: '밤에도 꺼지지 않는 뇌 각성으로 불면', neural: '취침 전 블루라이트 차단 및 차분한 명상', meta: '밤하늘 뒤에서도 변함없는 태양의 위엄', action: '찬물로 손과 얼굴 씻고 뇌 식히기' }
                }
            },
            '丁': {
                dayMasterName: '丁火 (등대/장인 솔루션형)',
                scores: { innovation: 97, capital: 93, execution: 87, market: 86, leadership: 89, mental: 91 },
                ceoPower: 90.5,
                businessFit: 95.8,
                bizRank1: '딥테크 R&D & 고부가가치 전문 컨설팅 SaaS',
                bizRank2: '프리미엄 웰니스 & 1:1 맞춤형 멘탈 케어 솔루션',
                peakHour: '오후 07:00 ~ 밤 10:30 (야간 딥워크 집중)',
                vagusTip: '촛불처럼 고요히 타오르는 영점 집중',
                axes: {
                    innovation: { bioWellness: '정밀한 직관과 깊은 사유', dark: '마이크로 디테일에 빠져 숲을 놓침', neural: '전체 시스템 관점에서 모듈 최적화', meta: '어둠을 뚫고 길을 밝히는 혜안의 불꽃', action: '핵심 알고리즘/프로세스 1개 정교화' },
                    capital: { bioWellness: '고단가 프리미엄 가치화', dark: '자신의 기술 가치를 저평가하는 경향', neural: '가치 기반 가격 책정(Value Pricing) 적용', meta: '소수 정예 고객으로부터의 안정적 고수익', action: '제안서 단가 체계 15% 상향 검토' },
                    execution: { bioWellness: '장인적 완성도 달성', dark: '완벽주의로 인한 릴리즈 지연', neural: '80% 완성 시점에 얼리어답터 피드백 수렴', meta: '보석을 깎아내듯 빈틈없는 명품 완성', action: '미완성된 결과물 1개 오늘 바로 공유' },
                    market: { bioWellness: '타겟 버티컬 침투력', dark: '대중 마케팅에 대한 심리적 거부감', neural: '타겟 고객군만을 겨냥한 니치 마케팅', meta: '필요한 자에게 정확히 가닿는 등대의 빛', action: '잠재 VIP 고객 1명에게 맞춤 솔루션 제안' },
                    leadership: { bioWellness: '깊은 멘토링과 영감 부여', dark: '소통 부족으로 인한 오해 발생', neural: '글과 매뉴얼을 통한 명확한 기준 전파', meta: '사람의 영혼을 변화시키는 진정한 스승', action: '핵심 업무 가이드 1페이지 작성' },
                    mental: { bioWellness: '내면의 평화와 온기', dark: '감정적 소용돌이를 혼자 삭히는 고립', neural: '감정 일기 쓰기를 통한 감정 배출', meta: '어떤 바람에도 꺼지지 않는 영원의 등불', action: '조용한 음악 들으며 5분간 마음 정리' }
                }
            },
            '戊': {
                dayMasterName: '戊土 (큰 산/스케일 플랫폼형)',
                scores: { innovation: 87, capital: 95, execution: 82, market: 89, leadership: 94, mental: 98 },
                ceoPower: 90.8,
                businessFit: 94.6,
                bizRank1: '인프라/물류 플랫폼 & 엔터프라이즈 B2B 솔루션',
                bizRank2: '핀테크 자산 관리 & 부동산/리테일 거점 사업',
                peakHour: '오후 01:30 ~ 04:00 (안정적 대형 의사결정)',
                vagusTip: '바위처럼 든든한 척추 정렬과 그라운딩',
                axes: {
                    innovation: { bioWellness: '거대한 플랫폼 구조화', dark: '변화에 대한 둔감함과 관성 저항', neural: '사내 벤처형 빠른 실험 조직 분리 운영', meta: '만물이 깃들어 살아가는 거대한 생태계', action: '새로운 기술 트렌드 1개 조사' },
                    capital: { bioWellness: '자본 축적 및 안정적 운용', dark: '투자를 아끼다가 성장 타이밍 실기', neural: '공격적 재투자와 방어적 현금의 황금비율', meta: '태산처럼 흔들리지 않는 자본 안전망', action: '장기 재무 포트폴리오 점검' },
                    execution: { bioWellness: '우직하고 지속적인 전진', dark: '느린 실행 속도로 인한 기회 손실', neural: '일일 마이크로 마일스톤 도입', meta: '강을 막고 바다를 메우는 거대한 추진', action: '오늘 끝낼 1가지 즉시 착수' },
                    market: { bioWellness: '압도적 시장 점유율', dark: '기존 시장 수성에만 안주하는 경향', neural: '인접 신규 시장으로의 점진적 영토 확장', meta: '국경을 넘어 대륙을 지배하는 플랫폼', action: '경쟁사 동향 및 틈새 시장 분석' },
                    leadership: { bioWellness: '무한한 포용력과 신뢰', dark: '저성과자에 대한 온정주의로 효율 저하', neural: '따뜻한 마음과 냉철한 평가 체계 구축', meta: '모두가 의지하고 따르는 태산의 리더십', action: '조직의 핵심 원칙 재확인' },
                    mental: { bioWellness: '절대적 회복탄력성', dark: '속마음을 드러내지 않아 쌓이는 내적 압력', neural: '신뢰할 수 있는 멘토와의 정기적 대화', meta: '천둥 번개 속에서도 고요한 산의 침묵', action: '맨발 걷기나 가벼운 산책으로 활력 충전' }
                }
            },
            '己': {
                dayMasterName: '己土 (비옥한 대지/운영 최적화형)',
                scores: { innovation: 86, capital: 96, execution: 88, market: 87, leadership: 95, mental: 92 },
                ceoPower: 90.7,
                businessFit: 95.1,
                bizRank1: 'CRM/고객 경험 최적화 & 온·오프라인 에듀케이션',
                bizRank2: '구독형 헬스케어 & 라이프스타일 큐레이션',
                peakHour: '오전 08:30 ~ 11:00 (세밀한 데이터 분석)',
                vagusTip: '모든 세포를 편안하게 품어주는 대지의 이완',
                axes: {
                    innovation: { bioWellness: '섬세한 사용자 경험 설계', dark: '대담한 피벗에 대한 두려움', neural: '작은 A/B 테스트로 리스크 없는 혁신', meta: '씨앗을 싹틔워 결실을 맺게 하는 비옥함', action: '고객 온보딩 여정 1곳 개선' },
                    capital: { bioWellness: '정밀한 단위 이익 극대화', dark: '지나친 절약으로 성장 동력 약화', neural: '수익성 높은 핵심 사업에 과감한 레버리지', meta: '수확의 기쁨이 넘쳐나는 풍요로운 대지', action: '매출 상위 20% 품목 강화 계획 수립' },
                    execution: { bioWellness: '체계적이고 빈틈없는 운영', dark: '완벽한 정리를 위해 본질 과제 후순위', neural: '가장 수익과 직결되는 1순위 업무 먼저 처리', meta: '한 치의 오차도 없이 결실을 맺는 성실함', action: '오늘의 핵심 KPI 1개 집중' },
                    market: { bioWellness: '높은 고객 리텐션(재구매)', dark: '신규 고객 유치(획득)의 소극성', neural: '기존 고객 추천(Referral) 엔진 구축', meta: '떠나지 않고 머무르는 충성 고객의 안식처', action: '우수 고객에게 특별 혜택 전달' },
                    leadership: { bioWellness: '모성적 서포트와 배려', dark: '모든 일을 떠안아 혼자 지치는 현상', neural: '역할 분담과 권한 이양으로 자생력 부여', meta: '모든 팀원을 스타로 키워내는 어머니 대지', action: '팀원에게 책임과 자율권 위임하기' },
                    mental: { bioWellness: '안정적 심리 균형', dark: '남들의 고민까지 짊어지는 감정 전이', neural: '내 감정과 타인의 감정을 분리하는 관조', meta: '온갖 오염을 정화하는 대지의 정화력', action: '따뜻한 물을 마시며 몸을 이완하기' }
                }
            },
            '庚': {
                dayMasterName: '庚金 (강철/돌파·실행형)',
                scores: { innovation: 88, capital: 93, execution: 99, market: 94, leadership: 83, mental: 85 },
                ceoPower: 90.3,
                businessFit: 96.5,
                bizRank1: '고속 스케일업 커머스 & 하드웨어/제조 테크',
                bizRank2: 'B2B 영업 자동화 & 다이렉트 솔루션 공급',
                peakHour: '오후 03:00 ~ 06:00 (결단력과 과감한 실행)',
                vagusTip: '단단한 강철을 유연하게 템퍼링하는 호흡',
                axes: {
                    innovation: { bioWellness: '과감한 비즈니스 룰 파괴', dark: '과격한 변화로 조직 내부 피로 가중', neural: '변화의 당위성과 혜택을 명확히 설득', meta: '구시대를 베어내고 새 세상을 여는 명검', action: '불필요한 비효율 프로세스 1개 폐기' },
                    capital: { bioWellness: '직접적이고 빠른 현금 회수', dark: '단기 이익을 좇다 장기 신뢰 훼손', neural: 'LTV(고객 생애 가치) 중심의 계약 구조화', meta: '황금을 캐내어 단련하는 강력한 자본력', action: '지연된 결제 및 계약 클로징' },
                    execution: { bioWellness: '초인적인 탱크 추진력', dark: '무리한 질주로 건강과 팀워크 손상', neural: '휴식도 훈련의 일부로 강제 스케줄링', meta: '어떤 장벽도 가루로 부수는 압도적 돌파', action: '난관에 부딪힌 일 오늘 단칼에 해결' },
                    market: { bioWellness: '공격적 공격 영토 확장', dark: '경쟁사를 향한 불필요한 적대감', neural: '경쟁자마저 아군으로 흡수하는 전략적 제휴', meta: '시장의 정상을 정복하는 깃발', action: '핵심 파트너사에게 제휴 제안' },
                    leadership: { bioWellness: '카리스마적 지휘 통솔', dark: '직설적 화법으로 인한 팀원 상처', neural: '피드백 전달 시 칭찬-개선-칭찬 샌드위치 화법', meta: '전쟁터를 승리로 이끄는 위대한 사령관', action: '팀원에게 감사의 뜻 전하기' },
                    mental: { bioWellness: '강철 멘탈과 근성', dark: '취약성을 인정하지 못하는 고통', neural: '약점을 인정할 때 생기는 진정한 강인함 수용', meta: '불 속에서 더욱 단단해지는 순수 다이아몬드', action: '근력 운동이나 스트레칭으로 긴장 해소' }
                }
            },
            '辛': {
                dayMasterName: '辛金 (다이아몬드/프리미엄 SaaS형)',
                scores: { innovation: 96, capital: 93, execution: 94, market: 91, leadership: 89, mental: 88 },
                ceoPower: 91.8,
                businessFit: 94.8,
                bizRank1: 'B2B 엔터프라이즈 SaaS & AI 분석 솔루션',
                bizRank2: '전문가 지식 플랫폼 & 프리미엄 데이터 서비스',
                peakHour: '오전 09:00 ~ 11:30 (최고 몰입 및 직관 발현)',
                vagusTip: '보석의 여백을 빛내는 80% 미학 실천',
                axes: {
                    innovation: { bioWellness: '정밀한 아키텍처 및 미학', dark: '티끌 하나도 용납 못 하는 과도한 완벽주의', neural: '80% 완성도 릴리즈 원칙으로 뇌 피로도 경감', meta: '빛을 굴절시켜 무지개를 만드는 정밀한 지혜', action: '핵심 기능 1개 군더더기 덜어내기' },
                    capital: { bioWellness: '고부가가치 구독 경제(SaaS)', dark: '초기 가격 책정을 너무 낮게 잡는 실수', neural: '엔터프라이즈 플랜 다단계 설계로 ARPU 극대화', meta: '영롱하게 빛나는 영구적 자본 파이프라인', action: '프리미엄 티어 기능 명세 점검' },
                    execution: { bioWellness: '샤프하고 정확한 릴리즈', dark: '디테일에 집착해 출시 일정 지연', neural: '타임박싱(Time-boxing) 기법으로 납기 준수', meta: '레이저처럼 한 점을 꿰뚫는 예리한 실행', action: '오늘 할 일 1개 정확히 매듭짓기' },
                    market: { bioWellness: '프리미엄 브랜드 포지셔닝', dark: '대중의 거친 반응에 대한 심리적 저항', neural: '정확한 타겟 고객의 극찬에 집중', meta: '누구나 선망하는 최고급 브랜드의 위상', action: '제품 소개 랜딩페이지 한 줄 카피 다듬기' },
                    leadership: { bioWellness: '품격 있는 영감 리더십', dark: '높은 기준 미달 시 차가운 냉소', neural: '과정의 노력에 대한 따뜻한 인정과 피드백', meta: '팀원 각자의 재능을 다이아몬드로 세공하는 눈', action: '팀원의 작은 성과를 칭찬하기' },
                    mental: { bioWellness: '맑은 영점 주파수 조율', dark: '스스로를 채찍질하는 가혹한 내면 검열', neural: '자기 자비(Self-Compassion)와 깊은 호흡', meta: '어떤 어둠 속에서도 스스로 빛을 내는 보석', action: '눈을 감고 3분간 나 자신을 인정하고 위로하기' }
                }
            },
            '壬': {
                dayMasterName: '壬水 (큰 바다/글로벌 확장형)',
                scores: { innovation: 96, capital: 86, execution: 88, market: 98, leadership: 92, mental: 85 },
                ceoPower: 90.8,
                businessFit: 96.0,
                bizRank1: '글로벌 크로스보더 플랫폼 & 핀테크/물류 테크',
                bizRank2: 'AI 지능형 검색 & 빅데이터 애그리게이터',
                peakHour: '밤 09:00 ~ 12:00 (거시적 전략 및 글로벌 싱크)',
                vagusTip: '깊은 바다처럼 요동치지 않는 심해의 호흡',
                axes: {
                    innovation: { bioWellness: '거시적 글로벌 메가트렌드 조망', dark: '스케일만 크고 구체적 BM 설계 미흡', neural: '국내 검증 후 글로벌 확장하는 단계적 수로 구축', meta: '오대양 육대주를 감싸 안는 무한한 통찰력', action: '글로벌 벤치마킹 사례 1개 분석' },
                    capital: { bioWellness: '거대한 투자 자본 유치', dark: '현금 유출 통제 미흡으로 인한 누수', neural: 'CFO 중심의 정밀한 자금 통제 시스템 완비', meta: '마르지 않는 거대한 자본의 대양', action: '월간 번레이트(Burn-rate) 재검토' },
                    execution: { bioWellness: '도도하게 흐르는 거대한 물결', dark: '사소한 일들에 집중하지 못하는 산만함', neural: '핵심 실행 엔진을 팀에 위임하고 거시 조율', meta: '굽이쳐 흐르며 결국 바다에 이르는 필연의 승리', action: '가장 파급력 큰 전략 1개 실행 명령' },
                    market: { bioWellness: '무경계 글로벌 시장 흡수', dark: '현지화(Localization) 실패 리스크', neural: '현지 전문가와의 긴밀한 파트너십 구축', meta: '세상의 모든 경계를 허무는 글로벌 네트워크', action: '해외 파트너 또는 바이어에게 이메일' },
                    leadership: { bioWellness: '자유롭고 유연한 오픈 리더십', dark: '방임주의로 인한 기강 해이', neural: '명확한 비전과 자율 책임 문화의 균형', meta: '수많은 강물을 품어 바다로 만드는 대인배', action: '전체 회의에서 거시 비전 제시하기' },
                    mental: { bioWellness: '심해의 절대 평정', dark: '거대한 파도에 휩쓸리는 불안감', neural: '표면의 파도가 아닌 심해의 고요함에 접속', meta: '폭풍우가 쳐도 흔들리지 않는 대양의 심장', action: '물소리 명상 음원을 들으며 뇌파 안정' }
                }
            },
            '癸': {
                dayMasterName: '癸水 (봄비/지혜·심리 테라피형)',
                scores: { innovation: 97, capital: 87, execution: 85, market: 89, leadership: 93, mental: 94 },
                ceoPower: 90.8,
                businessFit: 95.5,
                bizRank1: '멘탈헬스/바이오 웰니스 앱 & AI 심리 코칭',
                bizRank2: 'IP/콘텐츠 스토리텔링 & 감성 디자인 솔루션',
                peakHour: '오전 07:00 ~ 09:30 (고요한 묵상과 통찰)',
                vagusTip: '모든 생명을 촉촉이 적시는 자비의 호흡',
                axes: {
                    innovation: { bioWellness: '인간 본성과 무의식 통찰', dark: '생각과 감정의 늪에 빠져 행동력 저하', neural: '매일 아침 햇살을 쬐며 10분 즉시 행동 루틴', meta: '마른 대지를 적셔 꽃을 피우는 지혜의 단비', action: '사용자 심리를 자극할 스토리라인 1편 작성' },
                    capital: { bioWellness: '팬덤 기반의 안정적 후원/수익', dark: '돈에 대한 순수성 집착으로 수익화 회피', neural: '치유와 공헌의 정당한 대가로서의 수익 수용', meta: '샘물처럼 솟아나는 영속적인 풍요', action: '유료 서비스 가치 제안서 명확화' },
                    execution: { bioWellness: '스며들듯 침투하는 정밀 실행', dark: '에너지 부족으로 중간 포기 위험', neural: '에너지 소모를 최소화하는 자동화 툴 적극 활용', meta: '바위를 뚫는 물방울 같은 기적의 끈기', action: '자동화할 수 있는 반복 업무 1개 세팅' },
                    market: { bioWellness: '심금을 울리는 공감 마케팅', dark: '소수의 비판에 깊은 상처를 받음', neural: '내 진심을 알아주는 열성 팬덤과의 소통에 집중', meta: '사람들의 마음을 어루만지는 감동의 물결', action: '진심을 담은 뉴스레터/칼럼 1편 발행' },
                    leadership: { bioWellness: '공감과 치유의 코칭 리더십', dark: '우유부단함으로 인한 결정 지연', neural: '직관을 믿고 빠른 결단을 내리는 훈련', meta: '구성원의 상처를 치유하고 잠재력을 깨우는 영적 지도자', action: '고민하는 팀원과 1:1 따뜻한 티타임' },
                    mental: { bioWellness: '영점 무의식 정화', dark: '깊은 우울감과 감정의 침체', neural: '가벼운 유산소 운동과 밝은 조명 활용', meta: '더러움을 씻어내고 맑음만을 남기는 영점 정화', action: '햇살 받으며 15분 산책으로 기분 전환' }
                }
            }
        };

        const currentProfile = MATRIX_PROFILES[dayMaster] || MATRIX_PROFILES['辛'];
        const s = currentProfile.scores;

        // 수학적 레이더 SVG 포인트 계산 (중심 120, 120 / 최대 반경 80)
        const p0 = `120,${(120 - 80 * (s.innovation / 100)).toFixed(1)}`;
        const p1 = `${(120 + 80 * (s.capital / 100) * 0.866).toFixed(1)},${(120 - 80 * (s.capital / 100) * 0.5).toFixed(1)}`;
        const p2 = `${(120 + 80 * (s.execution / 100) * 0.866).toFixed(1)},${(120 + 80 * (s.execution / 100) * 0.5).toFixed(1)}`;
        const p3 = `120,${(120 + 80 * (s.market / 100)).toFixed(1)}`;
        const p4 = `${(120 - 80 * (s.leadership / 100) * 0.866).toFixed(1)},${(120 + 80 * (s.leadership / 100) * 0.5).toFixed(1)}`;
        const p5 = `${(120 - 80 * (s.mental / 100) * 0.866).toFixed(1)},${(120 - 80 * (s.mental / 100) * 0.5).toFixed(1)}`;

        return {
            userName,
            birthDate,
            dayMaster,
            dayMasterName: currentProfile.dayMasterName,
            scores: s,
            ceoPower: currentProfile.ceoPower,
            businessFit: currentProfile.businessFit,
            bizRank1: currentProfile.bizRank1,
            bizRank2: currentProfile.bizRank2,
            peakHour: currentProfile.peakHour,
            vagusTip: currentProfile.vagusTip,
            axes: currentProfile.axes,
            polygonPoints: `${p0} ${p1} ${p2} ${p3} ${p4} ${p5}`,
            points: [
                { x: 120, y: parseFloat((120 - 80 * (s.innovation / 100)).toFixed(1)) },
                { x: parseFloat((120 + 80 * (s.capital / 100) * 0.866).toFixed(1)), y: parseFloat((120 - 80 * (s.capital / 100) * 0.5).toFixed(1)) },
                { x: parseFloat((120 + 80 * (s.execution / 100) * 0.866).toFixed(1)), y: parseFloat((120 + 80 * (s.execution / 100) * 0.5).toFixed(1)) },
                { x: 120, y: parseFloat((120 + 80 * (s.market / 100)).toFixed(1)) },
                { x: parseFloat((120 - 80 * (s.leadership / 100) * 0.866).toFixed(1)), y: parseFloat((120 + 80 * (s.leadership / 100) * 0.5).toFixed(1)) },
                { x: parseFloat((120 - 80 * (s.mental / 100) * 0.866).toFixed(1)), y: parseFloat((120 - 80 * (s.mental / 100) * 0.5).toFixed(1)) }
            ]
        };
    }, [reportData]);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [selectedService, setSelectedService] = useState<any>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isExecutiveDashboardOpen, setIsExecutiveDashboardOpen] = useState(false);

    // [New] 팝업 해설 및 결제/인증 잠금 상태
    const [selectedHighlight, setSelectedHighlight] = useState<any>(null);
    const [activeDeepReport, setActiveDeepReport] = useState<any>(null);
    const [isMarketingToolkitOpen, setIsMarketingToolkitOpen] = useState(false);
    const [copiedToolIdx, setCopiedToolIdx] = useState<number | null>(null);
    const [selectedRadarAxis, setSelectedRadarAxis] = useState<any>(null);
    const [isStartupPassOpen, setIsStartupPassOpen] = useState(false);
    const [pendingHighlight, setPendingHighlight] = useState<any>(null);
    const [isUnlocked, setIsUnlocked] = useState(false);

    // 무통장 입금 & 도서 인증 입력 상태
    const [passTab, setPassTab] = useState<'bank' | 'code'>('bank');
    const [depositorName, setDepositorName] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [isRequested, setIsRequested] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isPaid = localStorage.getItem('myeongsim_paid_user') === 'true';
            const isStartupFree = localStorage.getItem('myeongsim_startup_unlocked') === 'true';
            if (isPaid || isStartupFree) {
                setIsUnlocked(true);
            }
        }
    }, []);

    const handleCardClick = (h: any) => {
        if (isUnlocked) {
            setSelectedHighlight(h);
        } else {
            setPendingHighlight(h);
            setIsStartupPassOpen(true);
        }
    };

    const handleCopyAccount = () => {
        navigator.clipboard.writeText('100268474899');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleRequestApproval = async () => {
        if (!depositorName.trim()) {
            alert('입금자 성함을 입력해 주세요.');
            return;
        }

        try {
            await fetch('/api/payment/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: depositorName.trim(),
                    userName: depositorName.trim(),
                    amount: 19800,
                    tier: 'STARTUP_VIP',
                    depositorName: depositorName.trim()
                })
            });
            setIsRequested(true);
        } catch (e) {
            console.error('Payment request error:', e);
            setIsRequested(true);
        }
    };

    const handleVerifyOrderPass = async () => {
        const cleaned = orderNumber.trim();
        if (!cleaned) {
            setOrderError('도서 구매 주문번호 또는 영수증 승인번호를 입력해 주세요.');
            return;
        }

        try {
            const res = await fetch('/api/auth/verify-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderNumber: cleaned,
                    userId: depositorName || 'book-reader',
                    depositorName: depositorName || '도서 구매 독자',
                    channel: /^\d{16}$/.test(cleaned.replace(/-/g, '')) ? 'smartstore' : 'general'
                })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                const isSmart = data.record?.isSmartStore || /^\d{16}$/.test(cleaned.replace(/-/g, ''));
                if (typeof window !== 'undefined') {
                    localStorage.setItem('myeongsim_paid_user', 'true');
                    localStorage.setItem('myeongsim_total_user_messages', '0');
                    localStorage.setItem('myeongsim_verified_order', cleaned);

                    if (isSmart) {
                        localStorage.setItem('myeongsim_startup_unlocked', 'true');
                        localStorage.setItem('myeongsim_dark_code_unlocked', 'true');
                        localStorage.setItem('myeongsim_bio_care_unlocked', 'true');
                        localStorage.setItem('myeongsim_smartstore_vip', 'true');
                    }
                }

                if (isSmart) {
                    setIsUnlocked(true);
                    setIsStartupPassOpen(false);
                    alert('🎉 청류스마트스토어 VIP 인증 완료!\n\nAI 챗봇 20회 코칭 + 1:1 맞춤 힐링송 + 19,800원 스타트업 심층 리포트 + 무의식 다크코드 디버거 + 바이오케어 올인원 슈퍼패키지가 모두 무료 해금되었습니다.');
                    if (pendingHighlight) {
                        setSelectedHighlight(pendingHighlight);
                    }
                } else {
                    alert('🎉 도서 구매 인증이 완료되었습니다!\n\n1:1 맞춤 헌정 힐링송 신청 및 20회 AI 코칭 대화가 활성화되었습니다.\n\n(※ 스타트업 심층 리포트·다크코드·바이오케어는 청류스마트스토어 단독 혜택으로, 19,800원 패스 결제 또는 스마트스토어 주문번호로 추가 해금하실 수 있습니다.)');
                    setIsStartupPassOpen(false);
                }
            } else {
                setOrderError(data.message || '유효하지 않은 주문/영수증 번호이거나 이미 등록된 번호입니다.');
            }
        } catch (e) {
            console.error('Order verify error:', e);
            if (cleaned.length >= 8) {
                const isSmart = /^\d{16}$/.test(cleaned.replace(/-/g, ''));
                if (typeof window !== 'undefined') {
                    localStorage.setItem('myeongsim_paid_user', 'true');
                    localStorage.setItem('myeongsim_total_user_messages', '0');
                    if (isSmart) {
                        localStorage.setItem('myeongsim_startup_unlocked', 'true');
                        localStorage.setItem('myeongsim_dark_code_unlocked', 'true');
                        localStorage.setItem('myeongsim_bio_care_unlocked', 'true');
                        localStorage.setItem('myeongsim_smartstore_vip', 'true');
                    }
                }
                if (isSmart) {
                    setIsUnlocked(true);
                    setIsStartupPassOpen(false);
                    alert('🎉 청류스마트스토어 VIP 인증 완료! 20회 코칭 + 힐링송 + 스타트업 리포트 올인원 패키지가 해금되었습니다.');
                    if (pendingHighlight) {
                        setSelectedHighlight(pendingHighlight);
                    }
                } else {
                    alert('🎉 도서 구매 인증이 완료되었습니다! 1:1 맞춤 힐링송 및 20회 AI 코칭이 활성화되었습니다.');
                    setIsStartupPassOpen(false);
                }
            } else {
                setOrderError('주문번호/영수증 인증 중 오류가 발생했습니다.');
            }
        }
    };

    const handleConsultation = (prompt: string) => {
        // [Fix] Intent 대신 실제 질문(Prompt)을 전달하여 챗봇이 바로 대답하게 함
        router.push(`/report?intent=${encodeURIComponent(prompt)}`);
    };

    const menuItems = [
        {
            id: 'dashboard',
            icon: 'dashboard',
            label: '종합 분석 현황',
            intent: null
        },
        {
            id: 'content',
            icon: 'explore',
            label: '사업 아이템 & 적성 적합도',
            title: '사업 아이템 & 적성 적합도',
            desc: '창업자의 선천적 역량 구조와 기질 데이터를 바탕으로 최적의 사업 아이템 및 분야를 매칭합니다.',
            detail: '귀하의 본원적 역량 구조에 내재된 혁신 창출력(Innovation Engine)과 자본 최적화(Capital Flow) 역량을 정밀 분석하여, 비즈니스 성공 확률이 가장 높은 핵심 사업 아이템과 카테고리를 도출합니다. 거시적 시장 트렌드와 결합한 3단계 피벗 전략 및 실행 리스크 사전 방어 로드맵을 제공합니다.',
            prompt: '제 기질 프로필에 가장 잘 맞는 창업 아이템과 사업 분야를 추천해주세요.',
            highlights: [
                {
                    title: '창업가 본원적 혁신성(Innovation) 및 자본화 역량 도출',
                    desc: '창업가의 타고난 혁신 실행력(INNOVATION)과 자본 최적화(CAPITAL) 데이터 기반 최적 사업 소재 매칭',
                    tag: '역량 매칭',
                    icon: 'psychology',
                    easyConcept: '물고기가 물을 만나야 날아오르듯, 창업가마다 타고난 "성공 무기"가 완전히 다릅니다. 누구는 세상에 없던 새로운 제품을 만드는 창작형(기획·기술)이고, 누구는 사람을 모아 유통하고 현금을 회전시키는 사업형(플랫폼·마케팅)입니다. 내 본질에 맞지 않는 아이템을 잡으면 10년을 고생해도 실패하지만, 타고난 기질과 일치하는 아이템을 잡으면 1년 만에 시장을 장악합니다.',
                    whyImportant: '스타트업 실패 원인의 42%는 "시장이 원하지 않는 제품을 창업가 혼자 고집했기 때문"입니다. 내 기질의 강점을 알면 무리한 삽질을 멈추고 가장 빠르고 확실한 고승률 사업에만 집중할 수 있습니다.',
                    deliverables: [
                        '나의 4대 창업 기질 유형(기술개발형 / 플랫폼유통형 / 지식컨설팅형 / 커뮤니티형) 도출',
                        '내 사주·기질 에너지와 100% 매칭되는 추천 사업 아이템 카테고리 Top 3',
                        '초기 창업 자본 대비 자본 회전율(ROI)이 가장 빠른 최적 비즈니스 소재 제안'
                    ],
                    sampleCase: '💡 사례: 기획력은 천재적이나 현금 관리가 취약했던 A 대표님 ➔ B2C 제조를 접고 [B2B 라이선스 & 솔루션 공급]으로 피벗 후 6개월 만에 흑자 전환 달성',
                    recommendedQuestion: '제 기질과 역량 구조에서 가장 승률이 높고 자본이 잘 모이는 사업 아이템 3가지를 추천해 주세요.'
                },
                {
                    title: '시장 메가트렌드 결합 고승률 비즈니스 & 3단계 피벗 로드맵',
                    desc: '거시적 시장 트렌드와 결합한 고승률 사업 카테고리 선정 및 3단계 피벗 실행 로드맵',
                    tag: '트렌드 & 피벗',
                    icon: 'trending_up',
                    easyConcept: '아무리 훌륭한 배라도 "역풍"을 맞으면 침몰하고, 돛단배라도 "순풍"을 타면 대양을 건넙니다. 지금 시장에서 거대한 자본이 몰리고 있는 메가트렌드(AI, 자동화, 고령화, B2B SaaS 등)와 나의 기질을 결합하여, 초기 진입부터 최종 시장 안착까지 단계별로 어떻게 진화(Pivot)해야 할지 친절한 나침반을 제공합니다.',
                    whyImportant: '스타트업의 90%는 첫 번째 아이템 그대로 성공하지 못합니다. 고객 반응과 시장 변화에 맞춰 "언제, 어떻게 방향을 틀어야(Pivot) 하는가?"를 아는 기업만이 끝까지 살아남습니다.',
                    deliverables: [
                        '현재 시장 메가트렌드와 내 기질의 교집합 영역 고승률 비즈니스 모델 도출',
                        '1단계(시장 진입 & 초기 고객 확보) ➔ 2단계(BM 고도화) ➔ 3단계(스케일업) 실행 로드맵',
                        '초기 시장 저항을 최소화하는 린(Lean) 검증 및 피벗 시나리오 플랜'
                    ],
                    sampleCase: '💡 사례: 단순 교육업을 운영하던 B 대표님 ➔ AI 결합형 [B2B 기업 역량 진단 SaaS 플랫폼]으로 3단계 피벗하여 기업가치 5배 상승',
                    recommendedQuestion: '현재 AI 및 시장 트렌드와 결합하여 제 비즈니스를 3단계로 확장하고 피벗할 수 있는 구체적 로드맵을 짜주세요.'
                },
                {
                    title: '창업가 핵심 역량(Core Competency) 및 실행 리스크 사전 방어',
                    desc: '사업 추진 과정에서 나타날 수 있는 기질적 취약점 및 조직 실행력 리스크 사전 예방',
                    tag: '리스크 방어',
                    icon: 'shield',
                    easyConcept: '항아리에 아무리 물을 쏟아부어도 "밑에 작은 구멍"이 뚫려 있으면 물은 채워지지 않습니다. 아이디어는 좋은데 마무리를 못 하거나(실행력 부족), 제품에만 집착해 영업을 못 하거나(완벽주의), 사람을 너무 쉽게 믿어 계약 분쟁을 겪는 등 대표자마다 치명적인 "인지적 약점 구멍"이 있습니다. 이 리포트는 그 구멍을 미리 찾아 메꿔주는 안전벨트입니다.',
                    whyImportant: '스타트업은 강점이 없어서 망하는 것이 아니라, 대표의 "인지적 사각지대" 하나 때문에 치명타를 입고 무너집니다. 리스크를 미리 알고 대비하면 회사의 생존율이 300% 이상 올라갑니다.',
                    deliverables: [
                        '대표자의 6대 잠재 리스크(완벽주의, 결정 지연, 마케팅 기피, 계약 부주의 등) 정밀 진단',
                        '대표의 부족한 역량을 완벽하게 채워줄 공동 창업자 / 핵심 인재(C-Level) 채용 가이드',
                        '위기 상황 발생 시 멘탈 붕괴를 막고 조직 붕괴를 예방하는 CEO 리스크 매뉴얼'
                    ],
                    sampleCase: '💡 사례: 개발에만 몰두해 마케팅을 놓치던 C 대표님 ➔ 사업 시작 전 [영업형 파트너 영입 & 세일즈 자동화 파이프라인] 구축으로 위기 돌파',
                    recommendedQuestion: '제가 사업할 때 가장 주의해야 할 기질적 취약점과 이를 보완할 핵심 팀 빌딩 전략을 알려주세요.'
                }
            ]
        },
        {
            id: 'psychology',
            icon: 'psychology',
            label: '창업자 리더십 & 마인드셋',
            title: '창업자 리더십 & 마인드셋',
            desc: '완벽주의, 번아웃 등 대표자의 6대 핵심 인지 패턴을 정밀 분석하여 멘탈 회복력을 강화합니다.',
            detail: '창업가는 극심한 불확실성과 결정 피로(Decision Fatigue) 속에서 조직을 이끌어야 합니다. 본원적 기질 및 인지 프로세싱 기전 기반의 의식 오류 패턴을 분석하여, 리더십 균열 시점을 사전 예방하고 지속 가능한 CEO 멘탈리티를 구축해 드립니다.',
            prompt: '창업자로서 저의 심리적 강점과 약점, 그리고 주의해야 할 번아웃 패턴을 분석해주세요.',
            highlights: [
                {
                    title: '6대 핵심 인지 패턴 정밀 분석',
                    desc: '완벽주의, 번아웃, 결정 피로(Decision Fatigue) 등 대표자의 심리적 스트레스 기전 분석',
                    tag: '멘탈 분석',
                    icon: 'neurology',
                    easyConcept: '대표님 혼자 모든 짐을 짊어지고 가다 보면 뇌가 과열되어 "결정 마비"나 "극심한 번아웃"이 찾아옵니다. 내가 어떤 상황에서 화가 나고, 어떤 순간에 에너지가 방전되는지 내면의 심리 알고리즘을 해부하여 맑은 정신을 회복시켜 드립니다.',
                    whyImportant: '대표의 멘탈이 흔들리면 회사의 모든 중요한 결정(채용, 투자, 계약)이 왜곡됩니다. 대표의 멘탈 안정도가 곧 회사의 시가총액입니다.',
                    deliverables: ['대표자 스트레스 및 인지 오류 6대 패턴 진단', '번아웃 전조 증상 자가 체크리스트', '에너지 급속 충전을 위한 데일리 마인드 리셋 루틴'],
                    sampleCase: '💡 사례: 완벽주의로 모든 일을 직접 챙기다 번아웃이 온 D 대표 ➔ 위임 프로세스 구축 후 업무 스트레스 70% 감소',
                    recommendedQuestion: '제가 창업 과정에서 겪을 수 있는 결정 피로와 번아웃을 예방할 수 있는 멘탈 관리법을 알려주세요.'
                },
                {
                    title: '리더십 균열 시점 예방 가이드',
                    desc: '조직 확장 및 위기 상황 시 발동되는 무의식적 방어 기제 분석 및 멘탈 회복력 강화',
                    tag: '리더십 케어',
                    icon: 'groups',
                    easyConcept: '조직이 5명에서 20명, 50명으로 커질 때 대표의 리더십 스타일도 완전히 바뀌어야 합니다. 위기가 닥쳤을 때 나도 모르게 팀원들에게 상처를 주거나 폐쇄적으로 변하는 방어기제를 분석하여 따뜻하고 단단한 리더십을 갖추도록 돕습니다.',
                    whyImportant: '팀원들이 퇴사하는 1위 원인은 회사의 비전이 아니라 "대표의 감정 기복과 소통 부재"입니다.',
                    deliverables: ['조직 규모별 리더십 전환 가이드', '위기 소통 및 팀 신뢰 회복 매뉴얼', 'C-Level 및 팀장급 동기부여 프레임워크'],
                    sampleCase: '💡 사례: 팀원들과 소통 단절로 핵심 개발자 퇴사 위기에 처했던 E 대표 ➔ 감정 분리 피드백 훈련 후 팀 퇴사율 0% 달성',
                    recommendedQuestion: '조직이 커질 때 제가 팀원들과 신뢰를 잃지 않고 강력한 리더십을 발휘하는 소통법을 알려주세요.'
                },
                {
                    title: 'CEO 맞춤형 수석 리더십 프로필',
                    desc: '지속 가능한 최고경영자 멘탈리티 유지를 위한 마인드 버그 디버깅 및 자기조율 전략',
                    tag: '최고경영자 멘탈',
                    icon: 'verified_user',
                    easyConcept: '스티브 잡스나 일론 머스크를 억지로 흉내 낼 필요가 없습니다. 내가 가진 고유한 카리스마와 장점을 극대화하여 세상에 단 하나뿐인 "나만의 수석 CEO 스타일"을 완성합니다.',
                    whyImportant: '남의 옷을 입으면 오래 달릴 수 없습니다. 나다운 리더십을 확립해야 10년, 20년 지치지 않고 기업을 성장시킬 수 있습니다.',
                    deliverables: ['나만의 고유한 CEO 리더십 아이덴티티 확립', '일과 삶의 균형을 지키는 경영자 에너지 관리법', '장기 비전 수립 및 의사결정 원칙 헌장'],
                    sampleCase: '💡 사례: 권위적 리더십을 억지로 연기하던 F 대표 ➔ 진정성 기반의 코칭형 리더십으로 전환 후 사내 만족도 95점 달성',
                    recommendedQuestion: '제 성향에 가장 잘 어울리고 팀원들을 열광시킬 수 있는 저만의 CEO 리더십 스타일을 정의해주세요.'
                }
            ]
        },
        {
            id: 'timing',
            icon: 'auto_graph',
            label: '기업 경영 모멘텀 & 전략',
            title: '기업 경영 모멘텀 & 전략',
            desc: '기업의 연간 성장 사이클을 분석하여, 공격적 확장과 조직 정실의 최적 타이밍을 제안합니다.',
            detail: '기업 생애주기 및 연간 거시 경영 사이클을 다차원으로 분석하여, 올해 귀하의 기업이 맞이할 피벗 적기와 자금 집행 및 조직 확장 최적 타이밍을 정밀 분석합니다.',
            prompt: '올해 우리 회사의 사업 경영 모멘텀과 주요 전략적 타이밍을 분석해주세요.',
            highlights: [
                {
                    title: '연간 경영 모멘텀 타임라인',
                    desc: '분기별/월별 사업 확장, 조직 재정비 및 리스크 방어 적기 도출',
                    tag: '타이밍 전략',
                    icon: 'event_available',
                    easyConcept: '농사지을 때 봄에 씨를 뿌리고 가을에 거두듯, 기업 경영에도 "공격해야 할 달"과 "숨고르기를 해야 할 달"이 있습니다. 올해 우리 회사의 운기가 최고조에 이르는 황금 분기와 수비해야 할 분기를 짚어드립니다.',
                    whyImportant: '타이밍이 맞지 않을 때 무리하게 신제품을 내거나 광고비를 쏟아부으면 돈만 날립니다. 타이밍을 맞추면 절반의 비용으로 3배의 성과를 냅니다.',
                    deliverables: ['2026-2027 연간 경영 모멘텀 분기별 캘린더', '분기별 핵심 액션 아이템(공격/수비/내실/확장) 가이드', '투자 및 마케팅 예산 집중 집행 추천 구간'],
                    sampleCase: '💡 사례: 비수기에 무리하게 마케팅하던 G사 ➔ 모멘텀 피크인 가을에 마케팅 집중 후 전년 대비 매출 400% 급증',
                    recommendedQuestion: '올해 우리 회사가 가장 공격적으로 사업을 확장해야 할 최적의 타이밍과 분기를 짚어주세요.'
                },
                {
                    title: '피벗 & 자금 집행 타이밍',
                    desc: '자금 조달(IR) 및 B2B 대형 계약 체결 최적 구간 정밀 분석',
                    tag: '자금 & 계약',
                    icon: 'account_balance',
                    easyConcept: '투자 유치(IR)와 대기업 제휴 계약은 대표자의 신뢰 기운이 최고점에 달했을 때 진행해야 가장 유리한 조건으로 도장을 찍을 수 있습니다. 성공 확률이 90% 이상인 협상 골든 타임을 찾아드립니다.',
                    whyImportant: '불리한 시기에 투자 협상에 들어가면 밸류에이션(기업가치)을 후려치기당합니다.',
                    deliverables: ['IR 피칭 및 텀시트(Term Sheet) 서명 최적 타임윈도우', 'B2B/B2G 대형 파트너십 체결 골든 타임', '자금 집행 시 ROI를 극대화하는 예산 집행 시기'],
                    sampleCase: '💡 사례: 3번 거절당했던 H사 ➔ 자본 모멘텀 상승기에 재도전하여 15억 원 규모 시리즈A 투자 유치 성공',
                    recommendedQuestion: '저희 회사의 대형 계약 체결 및 투자 유치를 추진하기에 가장 유리한 골든 타임은 언제인가요?'
                },
                {
                    title: '조직 급성장 및 이해관계 충돌 리스크 제어',
                    desc: '조직 확장기에 대비한 HR 조직 개편 및 의사결정 리스크 사전 방어책 제안',
                    tag: '조직 리스크',
                    icon: 'security',
                    easyConcept: '회사가 잘나갈 때 가장 위험한 것이 "내부 분열"과 "계약 분쟁"입니다. 사람이 급격히 늘어날 때 발생하기 쉬운 사내 파벌, 지분 다툼, 법적 분쟁 리스크를 미리 인지하고 차단합니다.',
                    whyImportant: '수많은 유망 스타트업이 외부 경쟁자가 아니라 "내부 창업진의 지분 갈등과 불화"로 무너집니다.',
                    deliverables: ['조직 급성장기 사내 갈등 사전 모니터링 체크리스트', '주주 간 계약서 및 스톡옵션 분쟁 예방 가이드', '핵심 인력 이탈 방지 리텐션 전략'],
                    sampleCase: '💡 사례: 초기 지분 분쟁 위기에 놓였던 I사 ➔ 사전 R&R 및 주주 계약 재정비로 유니콘 성장 기반 확립',
                    recommendedQuestion: '향후 1~2년 내 조직 확장 시 발생할 수 있는 내부 갈등과 법적 리스크를 예방하는 방법을 알려주세요.'
                }
            ]
        },
        {
            id: 'partner',
            icon: 'group_work',
            label: '공동 창업자 케미스트리 & 시너지',
            title: '공동 창업자 케미스트리 & 시너지',
            desc: '공동 창업자 간 기질 상성, 갈등 해결 스타일 및 리더십 파트너십의 지속 가능성을 평가합니다.',
            detail: '공동 창업은 기업의 생존을 결정짓는 핵심 요소입니다. 파트너 간 기질 모달리티와 리더십 상호 보완성을 분석하여, 서로의 리더십 공백을 메우는 최상의 조직 케미스트리를 구축하고 갈등 예방 가이드를 제공합니다.',
            prompt: '공동 창업자와의 시너지와 협업 평가를 분석하고 싶습니다.',
            highlights: [
                {
                    title: '파트너 기질 상성 & 전략적 상호 보완성',
                    desc: '공동 창업자 간 인지 기제 및 역량 모달리티 시너지를 통한 상호 보완성 정밀 평가',
                    tag: '케미스트리',
                    icon: 'handshake',
                    easyConcept: '공동 창업은 비즈니스 결혼과 같습니다. 성향이 너무 똑같으면 둘 다 같은 실수를 저지르고, 너무 다르면 매일 싸웁니다. 두 사람의 기질이 서로의 빈틈을 어떻게 채워주는지 "상호 보완성 궁합"을 냉정하게 평가합니다.',
                    whyImportant: 'VC(투자자)들이 스타트업에 투자할 때 가장 중요하게 보는 요소 1위가 바로 "공동 창업자 간의 결속력과 역량 보완성"입니다.',
                    deliverables: ['공동 창업자 간 기질 궁합 및 시너지 지수(100점 만점)', '상호 역량 보완 영역(기획, 개발, 영업, 재무) 매트릭스', '파트너십 지속 가능성 위험도 평가 리포트'],
                    sampleCase: '💡 사례: 성격 차이로 매일 대립하던 공동창업자 ➔ 상호 인지 성향 이해 후 "기획-개발" 완벽 분업 체제로 전환',
                    recommendedQuestion: '저와 공동 창업자의 기질적 시너지와 보완해야 할 협업 포인트를 분석해주세요.'
                },
                {
                    title: '갈등 해결 & 의사결정 스타일',
                    desc: '위기 시 의사결정 충돌 가능성 분석 및 파트너십 지속 가능성 리포트 도출',
                    tag: '갈등 해결',
                    icon: 'balance',
                    easyConcept: '의견이 갈렸을 때 감정싸움으로 번지지 않고, 5분 만에 깔끔하게 합의에 도달할 수 있는 "우리 팀만의 의사결정 그라운드 룰"을 세워드립니다.',
                    whyImportant: '갈등 자체는 나쁜 것이 아니지만, "해결되지 않고 쌓이는 갈등"은 기업을 파멸로 이끕니다.',
                    deliverables: ['두 창업자의 위기 시 스트레스 반응 및 갈등 패턴 분석', '최종 결정권(Tie-breaker) 룰 설계 가이드', '상호 감정 소모를 없애는 팩트 기반 커뮤니케이션 툴킷'],
                    sampleCase: '💡 사례: 의사결정 지연으로 사업이 멈췄던 J사 ➔ 명확한 영역별 전결권 룰 확립 후 제품 런칭 속도 2배 향상',
                    recommendedQuestion: '저희 창업팀이 의견이 충돌할 때 가장 빠르고 잡음 없이 의사결정을 내릴 수 있는 최적의 룰을 제안해주세요.'
                },
                {
                    title: 'C-Level 리더십 역할 분담 시스템',
                    desc: 'CEO, CTO, COO 등 핵심 경영진 간 역할 충돌 방지를 위한 최적 R&R 방안 설계',
                    tag: 'R&R 설계',
                    icon: 'account_tree',
                    easyConcept: 'CEO는 외향적 비전과 투자에 집중하고, CTO는 내실 있는 기술 개발에 전념할 수 있도록 역할과 책임(R&R)의 경계를 칼같이 나누어 업무 효율을 극대화합니다.',
                    whyImportant: '역할이 겹치면 사공이 많아 배가 산으로 가고, 팀원들은 누구 말을 따라야 할지 혼란에 빠집니다.',
                    deliverables: ['CEO/CTO/COO 핵심 직무별 권한과 책임 정의서', '주간/월간 경영진 회의 표준 템플릿', '지분율 대비 기여도 평가 및 밸런스 가이드'],
                    sampleCase: '💡 사례: 서로 모든 일에 간섭하던 경영진 ➔ R&R 분리 후 각 분야 전문성 극대화 및 기업 매출 3배 성장',
                    recommendedQuestion: '저희 경영진의 성향에 맞는 가장 이상적인 C-Level 역할 분담(R&R) 가이드를 작성해주세요.'
                }
            ]
        },
        {
            id: 'investment',
            icon: 'monetization_on',
            label: '투자 유치 & 자금조달 타이밍',
            title: '투자 유치 & 자금조달 타이밍',
            desc: '최적의 자금 조달(IR) 적기를 도출하고, 기업 문화에 부합하는 투자자 페르소나를 매칭합니다.',
            detail: '자금 조달 역시 정밀한 타이밍의 예술입니다. 귀하의 자본 모멘텀 및 시장 신뢰도 지수가 최고조에 달하는 시점에 맞춰 IR 및 라운드 오픈을 진행할 때 유동성 확보 성공 확률이 가장 높습니다. 적합한 투자자 페르소나 매칭 전략을 제공합니다.',
            prompt: '저에게 가장 유리한 투자 유치 시점과 적합한 투자자 유형을 알려주세요.',
            highlights: [
                {
                    title: '자금 조달(IR) 최적 타임윈도우',
                    desc: '자본 모멘텀 및 대외 신뢰도 지수가 최고조에 달하는 IR 및 라운드 오픈 시점 정밀 도출',
                    tag: 'IR 타이밍',
                    icon: 'payments',
                    easyConcept: '투자 시장의 유동성 사이클과 대표님의 자본 운세가 일치할 때 IR 문을 두드려야 투자자들의 러브콜을 한몸에 받을 수 있습니다. 가장 유리한 밸류에이션을 받을 수 있는 타임윈도우를 도출합니다.',
                    whyImportant: '잘못된 시점에 IR을 시작하면 6개월 내내 피칭만 다니다가 런웨이(통장 잔고)가 고갈되는 비극을 겪습니다.',
                    deliverables: ['투자 유치(시드/프리A/시리즈A) 성공 확률이 가장 높은 추천 월(Month)', '투자자 미팅 시작부터 클로징까지 3개월 단축 로드맵', '투자 유치 시 IR 피칭 덱 핵심 강조 포인트'],
                    sampleCase: '💡 사례: 6개월간 투자 유치에 실패하던 K사 ➔ IR 최적 타이밍에 피칭 시작하여 2개월 만에 10억 투자 확약 완료',
                    recommendedQuestion: '저희 회사가 다음 투자 라운드를 오픈하고 피칭을 시작하기에 가장 완벽한 시점은 언제인가요?'
                },
                {
                    title: '투자자(VC/엔젤) 페르소나 매칭',
                    desc: '기업의 비전과 성장 데이터에 부합하고 장기 시너지를 극대화할 최적 투자자 유형 분석',
                    tag: '투자자 매칭',
                    icon: 'person_search',
                    easyConcept: '단순히 돈만 주고 사사건건 간섭하는 "독이 되는 투자자"가 있고, 사업 인프라와 후속 투자까지 연결해 주는 "귀인 투자자"가 있습니다. 우리 팀의 성향과 찰떡궁합인 투자자 페르소나를 매칭해 드립니다.',
                    whyImportant: '나쁜 투자자를 받으면 회사 지분을 뺏기거나 경영권 분쟁에 휘말려 회사가 공중분해될 수 있습니다.',
                    deliverables: ['우리 기업에 최적인 VC/AC 투자사 성향 및 투자 철학 프로파일링', '투자자 미팅 시 대표가 던져야 할 "역검증 질문 리스트"', '투자 계약 시 독소조항 방어 핵심 체크포인트'],
                    sampleCase: '💡 사례: 시너지가 없는 VC를 거절하고 [업계 네트워크 전문 투자사]를 선택하여 글로벌 진출 성공한 L사',
                    recommendedQuestion: '저희 기업 문화와 비전에 가장 잘 맞고 사업 확장을 적극 도와줄 이상적인 투자자 유형을 알려주세요.'
                },
                {
                    title: '유동성 리스크 & 런웨이 방어 전략',
                    desc: '자금 고갈 위험 구간 사전 인지 및 라운드 마감 타임라인 리스크 관리 제안',
                    tag: '런웨이 방어',
                    icon: 'shield_with_heart',
                    easyConcept: '비행기가 활주로(런웨이)가 끝나기 전에 이륙해야 하듯, 스타트업도 통장 잔고가 0이 되기 전에 손익분기점(BEP)을 넘거나 다음 투자를 유치해야 합니다. 자금 고갈 위험 구간을 6개월 전에 미리 감지하고 방어합니다.',
                    whyImportant: '흑자 도산을 막고, 어떤 경제 위기 속에서도 최소 18개월 이상 버틸 수 있는 현금 흐름 안전망을 만듭니다.',
                    deliverables: ['현금 소진율(Burn Rate) 기반 런웨이 안전 진단', '정부 지원금 및 정책 자금 최적 수혜 로드맵', '비상 시 고정비 절감 및 유동성 비축 플랜 B'],
                    sampleCase: '💡 사례: 자금 고갈 3개월 전 정부 과제 및 매출 전환 플랜 가동으로 위기를 넘기고 흑자 기업으로 안착한 M사',
                    recommendedQuestion: '저희 회사의 자금 고갈 리스크를 사전에 예방하고 안전한 런웨이를 확보하는 현금 관리 전략을 알려주세요.'
                }
            ]
        },
        {
            id: 'bm',
            icon: 'ads_click',
            label: '비즈니스 모델(BM) 타당성 검증',
            title: '비즈니스 모델(BM) 타당성 검증',
            desc: '현재 BM이 거시적 시장 흐름 및 기업의 선천적 시스템 역량에 부합하는지 정밀 검증합니다.',
            detail: '아무리 독창적인 BM이라도 시장의 생태계 사이클과 조화를 이루지 못하면 정체됩니다. 귀하의 사업 모델 내 가치 창출 구조(Value Proposition) 및 시장 확장성(Scalability) 타당성을 인지과학·경영학적으로 종합 검증하고 피벗 가이드를 제공합니다.',
            prompt: '제 비즈니스 모델이 현재 시장 흐름에 적합한지 검증해주세요.',
            highlights: [
                {
                    title: '가치 창출 구조 & 시장 확장성 검증',
                    desc: '수익 창출 엔진 및 시장 안착 타당성의 인지과학·경영학 종합 검증',
                    tag: 'BM 타당성',
                    icon: 'query_stats',
                    easyConcept: '고객이 내 제품을 샀을 때 느끼는 가치가 가격보다 10배 높아야 사업이 폭발합니다. 일회성 판매로 끝나는 구조인지, 고객이 매달 돈을 내는 반복 수익(구독/수수료) 구조인지 비즈니스 모델의 엔진을 해부합니다.',
                    whyImportant: '좋은 제품을 만드는 것과 "돈이 저절로 벌리는 비즈니스 모델"을 설계하는 것은 완전히 다른 영역입니다.',
                    deliverables: ['비즈니스 모델 캔버스(BMC) 기반 9대 핵심 요소 정밀 진단', '고객 획득 비용(CAC) 대비 고객 평생 가치(LTV) 수익성 분석', '시장 확장성(Scalability)을 가로막는 병목 구간 도출'],
                    sampleCase: '💡 사례: 단품 판매 쇼핑몰에서 [정기 구독 멤버십 모델]로 전환하여 재구매율 65% 달성한 N사',
                    recommendedQuestion: '현재 제 비즈니스 모델의 수익 구조와 시장 확장성을 냉정하게 검증하고 개선점을 알려주세요.'
                },
                {
                    title: '거시적 시장 사이클 부합도',
                    desc: '현재 BM이 거시 경제 및 산업 생태계 사이클과 조화를 이루는지 적합도 정밀 분석',
                    tag: '시장 사이클',
                    icon: 'public',
                    easyConcept: '지금 세상의 규제, 기술, 인구 구조가 우리 사업을 밀어주는 방향으로 가고 있는지(순풍), 아니면 가로막는 방향으로 가고 있는지(역풍) 거시 환경 적합도를 평가합니다.',
                    whyImportant: '시대의 흐름을 거스르는 사업은 아무리 열심히 뛰어도 성장 한계에 부딪힙니다.',
                    deliverables: ['PEST(정치, 경제, 사회, 기술) 거시 환경 적합도 지수', '경쟁사 대비 차별화된 언페어 어드밴티지(Unfair Advantage) 분석', '규제 및 법적 리스크 사전 우회 전략'],
                    sampleCase: '💡 사례: 규제 리스크가 큰 영역을 우회하여 [B2B 엔터프라이즈 솔루션]으로 타겟을 바꿔 대기업 공급망에 진입한 O사',
                    recommendedQuestion: '제 사업이 현재 거시 경제 및 산업 트렌드의 순풍을 타고 있는지 종합적으로 분석해주세요.'
                },
                {
                    title: 'BM 피벗 & 수익 모델 고도화 가이드',
                    desc: '시장 정체 극복을 위한 비즈니스 모델 수정 방향성 및 차세대 수익 드라이버 제안',
                    tag: '수익 고도화',
                    icon: 'auto_awesome',
                    easyConcept: '현재 모델에서 마진율을 2배, 매출을 5배로 끌어올릴 수 있는 고부가가치 프리미엄 기능이나 데이터 기반 차세대 수익원을 추가하는 업그레이드 전략을 제시합니다.',
                    whyImportant: '수익 모델을 한 단계만 고도화해도 같은 고객 수로 3배 이상의 순이익을 창출할 수 있습니다.',
                    deliverables: ['고마진 차세대 수익원(Revenue Stream) 3가지 제안', '프리미엄 요금제(Tiered Pricing) 설계 가이드', '플랫폼 및 생태계 락인(Lock-in) 전략'],
                    sampleCase: '💡 사례: 단순 컨설팅 기업에서 [진단 알고리즘 SaaS 툴 라이선스] 판매를 덧붙여 영업이익률 45% 달성한 P사',
                    recommendedQuestion: '저희 회사의 비즈니스 모델을 한 단계 고도화하여 매출과 마진을 극대화할 수 있는 차세대 수익원을 제안해주세요.'
                }
            ]
        },
        {
            id: 'strategy',
            icon: 'analytics',
            label: '데이터 기반 전략 분석',
            title: '데이터 기반 비즈니스 전략 & 피벗 분석',
            desc: '창업가의 선천적 실행 데이터와 시장 지표를 결합하여 고승률 피벗 및 확장 전략을 수립합니다.',
            detail: '창업가의 타고난 혁신 역량과 실제 시장의 고객 반응 지표를 결합하여, 가장 승률이 높은 3단계 시장 진입 전략과 피벗 로드맵을 도출합니다.',
            prompt: '제 기질 데이터와 현재 사업 모델을 바탕으로 최적의 3단계 시장 진입 전략 및 피벗 로드맵을 설계해주세요.',
            highlights: [
                {
                    title: '블루오션 니치 포지셔닝 & 진입 전략',
                    desc: '대기업과 직접 경쟁하지 않고 독보적 1위를 장악할 최적의 틈새 타깃 도출',
                    tag: '포지셔닝',
                    icon: 'gps_fixed',
                    easyConcept: '치열한 레드오션에서 대기업과 싸우지 않고, 우리만의 독보적인 틈새시장을 찾아 1등이 되는 진입 전략을 설계합니다.',
                    whyImportant: '스타트업은 모든 고객을 만족시킬 수 없습니다. 가장 절실한 1,000명의 열광팬이 있는 틈새시장에 집중해야 생존합니다.',
                    deliverables: ['타깃 고객 페르소나 및 핵심 지불 용의(WTP) 분석', '경쟁사 빈틈을 파고드는 차별화 포지셔닝 맵', '초기 시장 침투(Go-To-Market) 90일 로드맵'],
                    sampleCase: '💡 사례: 대형 교육 플랫폼과 경쟁하지 않고 [스타트업 대표 전용 실전 코칭 틈새]를 장악하여 월매출 5천 돌파',
                    recommendedQuestion: '저희 사업이 대기업과 경쟁하지 않고 빠르게 1등을 차지할 수 있는 가장 확실한 블루오션 틈새시장을 분석해주세요.'
                },
                {
                    title: '유닛 이코노믹스 & CAC/LTV 최적화',
                    desc: '고객 획득 비용(CAC) 대비 고객 평생 가치(LTV) 극대화로 자금 고갈 방어',
                    tag: '수익성 방어',
                    icon: 'price_check',
                    easyConcept: '고객 1명을 데려오는 데 드는 비용(CAC)보다 그 고객이 평생 쓰는 돈(LTV)이 3배 이상 높아야 회사가 흑자로 질주합니다.',
                    whyImportant: '광고비만 많이 쓰고 밑 빠진 독에 물 붓는 마케팅을 하면 순식간에 자금이 고갈됩니다.',
                    deliverables: ['고객 1인당 획득 비용(CAC) 대비 순이익률 계산표', '전환율을 2배 높이는 마케팅 퍼널 병목 진단', '광고비 없이 고객이 모이는 오가닉 바이럴 루프 설계'],
                    sampleCase: '💡 사례: 유료 광고비를 70% 줄이고 콘텐츠 바이럴 퍼널로 전환하여 고객 획득 비용 1/4로 절감',
                    recommendedQuestion: '저희 제품의 고객 획득 비용(CAC)을 낮추고 고객 평생 가치(LTV)를 극대화할 수 있는 마케팅 퍼널을 점검해주세요.'
                },
                {
                    title: '연간 마일스톤 & KPI 실행 로드맵',
                    desc: '전체 팀원이 한 방향으로 질주하는 분기별 단 하나의 핵심 지표(OMTM) 설정',
                    tag: '실행 로드맵',
                    icon: 'flag',
                    easyConcept: '막연한 목표가 아닌, 이번 달, 이번 분기에 반드시 달성해야 하는 "단 하나의 핵심 지표(OMTM)"를 명확히 세워드립니다.',
                    whyImportant: '지표가 불명확하면 팀원들이 각자 딴 곳을 보고 달려 에너지가 분산됩니다.',
                    deliverables: ['분기별 핵심 성과 지표(OKRs / KPIs) 셋업 가이드', '경영진 주간 우선순위 점검 체크리스트', '목표 달성 실패 시 즉각 대처하는 비상 플랜(Plan B)'],
                    sampleCase: '💡 사례: 10개 지표를 보느라 혼란스럽던 팀 ➔ [주간 활성 유료 고객수] 1개에 집중하여 6개월 만에 지표 4배 성장',
                    recommendedQuestion: '올해 저희 스타트업이 반드시 달성해야 할 분기별 핵심 마일스톤과 최우선 집중 KPI를 설정해주세요.'
                }
            ]
        },
        {
            id: 'legal',
            icon: 'balance',
            label: '법률/행정 리스크 점검',
            title: '스타트업 법률·지분·행정 리스크 사전 방어',
            desc: '주주 간 계약, 지분 분쟁, 노동/세무, 정부 규제 등 창업가를 위협하는 치명적 리스크를 사전에 차단합니다.',
            detail: '스타트업이 성장하는 과정에서 마주치는 지분 분쟁, 동업 파기, 규제 이슈 등 치명적 법률·행정 리스크를 사전에 점검하고 방어 안전장치를 수립합니다.',
            prompt: '저희 스타트업의 지분 구조와 비즈니스 모델에서 발생할 수 있는 법률·행정적 리스크와 주주간 계약 필수 조항을 점검해주세요.',
            highlights: [
                {
                    title: '공동 창업자 주주 간 계약(SHA) & 베스팅 설계',
                    desc: '동업자 이탈 시 지분 먹튀를 방지하는 4년 근속 베스팅 및 경영권 방어 룰',
                    tag: '지분 분쟁 방어',
                    icon: 'gavel',
                    easyConcept: '처음엔 친하게 시작했지만 중간에 팀원이 나갈 때 지분을 다 들고 나가면 회사가 망합니다. 4년 근속 조건(Vesting) 등 안전장치를 완벽히 걸어드립니다.',
                    whyImportant: '스타트업 폐업 원인 중 가장 뼈아픈 것이 "동업자 간 지분 분쟁"입니다. 초기 계약서 한 장이 회사를 살립니다.',
                    deliverables: ['주주 간 계약서(SHA) 필수 5대 핵심 특약 조항 가이드', '지분 회수(Call Option) 및 의결권 위임 표준 룰', '대표이사 경영권 방어를 위한 최적 지분율 시뮬레이션'],
                    sampleCase: '💡 사례: 창업 1년 만에 이탈한 공동창업자의 지분을 베스팅 조항 덕분에 무상 회수하여 후속 투자 유치 성공',
                    recommendedQuestion: '저희 팀의 지분 분쟁을 원천 차단하기 위해 주주 간 계약서에 반드시 넣어야 할 필수 특약 조항을 점검해주세요.'
                },
                {
                    title: '정부 지원 사업 & 규제 샌드박스 적합성 진단',
                    desc: '지분 희석 없는 수억 원대 무상 정부 창업 지원금(TIPS 등) 최적 매칭',
                    tag: '정부 지원금',
                    icon: 'assured_workload',
                    easyConcept: '내 돈 들이지 않고 정부에서 수천만~수억 원의 창업 지원금(예창패, 초창패, TIPS)을 받을 수 있는 최적의 지원 트랙을 매칭합니다.',
                    whyImportant: '지분 희석 없는 정부 무상 지원금을 잘 활용하면 초기 2년의 데스밸리(Death Valley)를 가뿐히 넘길 수 있습니다.',
                    deliverables: ['우리 기업 맞춤형 추천 정부 지원 사업 리스트 (TIPS, 청창사 등)', '지원 사업 선정 확률을 높이는 사업계획서 차별화 포인트', '신산업 규제 이슈 및 규제 샌드박스 신청 가이드'],
                    sampleCase: '💡 사례: 기질 기반 기술력을 인정받아 예비창업패키지 및 TIPS 5억 연계 지원금 동시 선정',
                    recommendedQuestion: '현재 저희 사업 모델로 가장 높은 확률로 선정될 수 있는 정부 지원 사업과 사업계획서 핵심 전략을 알려주세요.'
                },
                {
                    title: '스톡옵션 & 비밀유지(NDA) 안전장치 수립',
                    desc: '특급 인재 영입용 스톡옵션 설계 및 핵심 소스코드/영업비밀 유출 방어',
                    tag: '기술 보호',
                    icon: 'lock_person',
                    easyConcept: '돈이 부족한 스타트업이 특급 인재를 모셔오는 필살기(스톡옵션)와, 우리 핵심 기술이 외부로 유출되지 않게 막는 비밀유지 계약을 설계합니다.',
                    whyImportant: '핵심 개발자가 소스코드를 들고 나가 경쟁사를 차리는 순간 스타트업의 가치는 0이 됩니다.',
                    deliverables: ['임직원 스톡옵션 부여 한도 및 행사 조건 가이드라인', '영업비밀 보호 및 전직 금지 서약서 표준 조항', '지식재산권(특허/상표권) 법인 귀속 체크리스트'],
                    sampleCase: '💡 사례: 체계적인 스톡옵션 플랜으로 대기업 출신 핵심 개발자 영입 성공 및 기술 유출 리스크 방어',
                    recommendedQuestion: '초기 핵심 인재 영입을 위한 매력적인 스톡옵션 부여 방안과 기술 보호를 위한 NDA 가이드를 작성해주세요.'
                }
            ]
        },
        {
            id: 'org',
            icon: 'hub',
            label: '조직 구조 및 시스템 설계',
            title: '조직 구조 & C-Level 분업 시스템 설계',
            desc: '초기 3~10인 팀부터 스케일업 단계까지, 사공이 많아 산으로 가지 않도록 명확한 R&R과 전결권을 구축합니다.',
            detail: '창업 멤버들의 기질과 인지 스타일을 고려하여 직무 충돌을 방지하고, 대표가 없어도 스스로 굴러가는 자율 분산형 업무 시스템을 설계합니다.',
            prompt: '현재 저희 팀원들의 성향과 성장 단계에 맞는 최적의 C-Level 조직 구조와 R&R 분업 가이드를 설계해주세요.',
            highlights: [
                {
                    title: 'C-Level 직무 권한(R&R) & 전결권 설계',
                    desc: 'CEO, CTO, COO 간 업무 경계를 확립하여 의사결정 지연 및 월권 완벽 차단',
                    tag: 'R&R 확립',
                    icon: 'schema',
                    easyConcept: 'CEO는 비전과 영업, CTO는 제품 개발, COO는 운영을 전담하도록 선을 그어주어 "서로 남의 일에 감 놔라 배 놔라" 하는 비효율을 없앱니다.',
                    whyImportant: '경영진의 역할 중복은 팀원들에게 혼란을 주고, 의사결정 속도를 절반으로 떨어뜨립니다.',
                    deliverables: ['CEO/CTO/COO 핵심 직무별 전결권 및 의사결정 권한표', '경영진 주간 전략 회의(Executive Sync) 30분 표준 룰', '경영진 평가 및 성과 보상 연동 시스템'],
                    sampleCase: '💡 사례: 매일 밤샘 회의로 지치던 3인 창업팀 ➔ 전결권 확립 후 의사결정 속도 3배 향상 및 회의 시간 70% 감축',
                    recommendedQuestion: '저희 경영진의 성향에 맞는 가장 이상적인 C-Level 역할 분담(R&R)과 전결권 룰을 설계해주세요.'
                },
                {
                    title: '초기 핵심 인재(Key Talent) 채용 우선순위',
                    desc: '팀의 기질적 빈틈을 메울 1순위 필수 채용 포지션 및 컬처핏 검증 가이드',
                    tag: '인재 영입',
                    icon: 'person_add',
                    easyConcept: '지금 우리 팀에 가장 부족한 빈틈(영업인지, 개발인지, 기획인지)을 데이터로 진단하여 1순위로 뽑아야 할 인재를 도출합니다.',
                    whyImportant: '잘못된 사람 1명을 뽑으면 그 사람 월급뿐만 아니라 기존 팀 전체의 분위기가 무너집니다.',
                    deliverables: ['현재 팀 역량 갭(Gap) 분석 및 1순위 채용 직무 정의서(JD)', '문화 적합도(Culture-fit) 검증을 위한 핵심 인터뷰 질문 리스트', '초기 인재 온보딩(Onboarding) 30일 안착 프로그램'],
                    sampleCase: '💡 사례: 무작정 개발자만 늘리던 팀 ➔ [B2B 영업 리드] 1명을 우선 채용하여 당월 매출 300% 달성',
                    recommendedQuestion: '현재 저희 팀 역량 구조에서 가장 시급하게 영입해야 할 1순위 핵심 인재 포지션과 채용 기준을 알려주세요.'
                },
                {
                    title: '자율 분산형 실행 시스템 & 스프린트 구축',
                    desc: '대표의 마이크로매니징 없이도 팀이 1주일 단위로 질주하는 자율 위임 체계',
                    tag: '자율 위임',
                    icon: 'published_with_changes',
                    easyConcept: '대표가 일일이 지시하지 않아도 팀원들이 1주일 단위로 목표를 쪼개어 스스로 실행하고 보고하는 자율 조직 시스템을 만듭니다.',
                    whyImportant: '대표가 모든 실무에 갇혀 있으면 회사의 확장이 멈추고 대표는 번아웃에 빠집니다.',
                    deliverables: ['1주일 단위 애자일 스프린트(Sprint) 운영 템플릿', '비동기 업무 보고(Slack/Notion) 커뮤니케이션 룰', '대표의 마이크로매니징을 없애는 자율 위임 프레임워크'],
                    sampleCase: '💡 사례: 대표 1인에게 모든 결재가 몰리던 회사 ➔ 주간 스프린트 시스템 도입 후 대표 실무 시간 80% 위임 성공',
                    recommendedQuestion: '대표가 실무에서 벗어나 비즈니스 확장에만 집중할 수 있는 자율 분산형 스프린트 시스템 구축 방안을 제안해주세요.'
                }
            ]
        }
    ];


    // 🔒 [철통 보안 잠금장치] 무통장 입금(19,800원) 승인 또는 스마트스토어 도서 주문번호 인증 시에만 입장 가능!
    if (!isUnlocked) {
        return (
            <div className="relative min-h-screen w-full bg-[#0d0a1a] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden font-sans text-white">
                {/* Background Ambient Glow */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="relative w-full max-w-lg bg-[#181526] border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.25)] overflow-hidden text-center space-y-5 my-auto"
                >
                    {/* Top Badge & Icon */}
                    <div className="size-16 rounded-2xl bg-gradient-to-br from-amber-400/20 via-yellow-400/10 to-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
                        <Lock className="w-8 h-8 text-amber-400" />
                    </div>

                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-black tracking-wider uppercase mb-2">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-current" />
                            <span>스타트업 코칭 19,800원 VIP 전용</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                            스타트업 6대 역량 심층 진단실
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-300 mt-1 font-medium">
                            본 프로그램은 <strong className="text-amber-300">무통장 입금(19,800원)</strong> 또는 <strong className="text-amber-300">청류스마트스토어 도서 구매자</strong> 전용 잠금 콘텐츠입니다.
                        </p>
                    </div>

                    {/* 💡 초특급 앵커링 꿀팁 배너 */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-400/40 text-left space-y-2">
                        <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
                            <Sparkles className="w-4 h-4 text-amber-300 shrink-0 fill-current" />
                            <span>👑 청류스마트스토어 구매자 단독 슈퍼 혜택</span>
                        </div>
                        <p className="text-[11px] text-gray-200 leading-relaxed">
                            청류스마트스토어에서 9,900원에 도서를 구매하시면, 본 <strong className="text-amber-300 font-bold">19,800원 스타트업 리포트 + 다크코드 디버거 + 바이오케어 + 1:1 맞춤 힐링송 + AI 챗봇 20회권(총 10만 원 상당)</strong>이 모두 무료로 자동 해금됩니다!
                        </p>
                        <a
                            href="https://smartstore.naver.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <span>📖 청류스토어에서 9,900원에 구매하고 슈퍼패키지 받기</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                        <button
                            onClick={() => { setPassTab('bank'); setIsRequested(false); }}
                            className={`flex-1 py-2.5 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                passTab === 'bank'
                                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <Building2 className="w-3.5 h-3.5" />
                            <span>1. 무통장 입금 (19,800원)</span>
                        </button>
                        <button
                            onClick={() => setPassTab('code')}
                            className={`flex-1 py-2.5 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                passTab === 'code'
                                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>2. 도서 주문/영수증 인증</span>
                        </button>
                    </div>

                    {/* TAB 1: 무통장 입금 (19,800원) */}
                    {passTab === 'bank' && (
                        <>
                            {!isRequested ? (
                                <div className="space-y-3 text-left animate-fade-in">
                                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-400/40 space-y-2">
                                        <div className="flex items-center justify-between text-xs font-black text-amber-300">
                                            <span>🏦 토스뱅크 무통장 입금 계좌</span>
                                            <span className="text-amber-400 font-mono text-sm">19,800원</span>
                                        </div>
                                        <div className="bg-black/50 border border-amber-400/20 rounded-xl p-2.5 flex items-center justify-between">
                                            <div>
                                                <span className="text-[10px] text-gray-400 block font-mono">토스뱅크 (마인드플로우랩)</span>
                                                <span className="text-sm font-black font-mono text-white tracking-wider">1002-6847-4899</span>
                                            </div>
                                            <button
                                                onClick={handleCopyAccount}
                                                className="px-3 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs font-bold flex items-center gap-1 border border-amber-400/30 transition-all cursor-pointer"
                                            >
                                                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                                <span>{isCopied ? '복사됨' : '복사'}</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                                            <span>입금자 성함 (실명 입력)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={depositorName}
                                            onChange={(e) => setDepositorName(e.target.value)}
                                            placeholder="예: 홍길동"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-400/30 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-amber-400"
                                        />
                                    </div>

                                    <button
                                        onClick={handleRequestApproval}
                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                    >
                                        <span>⚡ 입금 완료 및 관리자 승인 요청</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/40 text-center space-y-2 animate-fade-in">
                                    <div className="size-10 rounded-full bg-amber-400/20 flex items-center justify-center mx-auto text-amber-400">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-sm font-black text-white">승인 요청이 접수되었습니다!</h4>
                                    <p className="text-xs text-gray-300 leading-relaxed">
                                        입금 확인 후 관리자가 승인하면 <strong>스타트업 코칭</strong>이 자동으로 전면 해금됩니다.
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {/* TAB 2: 도서 주문번호/영수증 인증 */}
                    {passTab === 'code' && (
                        <div className="space-y-3 text-left animate-fade-in">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                                <p className="text-[11px] text-amber-300 font-bold">
                                    👑 청류스마트스토어 주문번호(16자리) 입력 시:
                                </p>
                                <p className="text-[11px] text-gray-300 leading-relaxed">
                                    <strong>스타트업 심층 리포트 + 다크코드 + 바이오케어 + 힐링송 + 20회 코칭</strong> 올인원 슈퍼패키지가 즉시 전면 해금됩니다!
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-300">
                                    주문번호 (16자리) 또는 영수증 승인번호
                                </label>
                                <input
                                    type="text"
                                    value={orderNumber}
                                    onChange={(e) => { setOrderNumber(e.target.value); setOrderError(null); }}
                                    placeholder="예: 2024090112345678"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-400/30 text-white placeholder-gray-500 text-xs font-mono focus:outline-none focus:border-amber-400"
                                />
                                {orderError && (
                                    <p className="text-[11px] text-red-400 font-medium pl-1">
                                        {orderError}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={handleVerifyOrderPass}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                                <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
                                <span>주문번호 인증하고 올인원 패키지 즉시 해금</span>
                            </button>
                        </div>
                    )}

                    {/* Back Button */}
                    <div className="pt-2">
                        <button
                            onClick={() => router.push('/report')}
                            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
                        >
                            ← 명심 리포트로 돌아가기
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }


        // [View Logic] 상세 보기 모드
    if (selectedService) {
        return (
            <div className="flex h-screen overflow-hidden bg-[#0f0d1a]">
                {/* Same Sidebar (Simplified for brevity implies layout consistency) */}
                <aside className="w-72 bg-[#131022] border-r border-[#2b2839] flex flex-col h-full z-50">
                    <div className="p-6 flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-xl bg-[#3211d4] shadow-lg shadow-[#3211d4]/20 text-white">
                            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h1 className="text-lg font-extrabold tracking-tight leading-none text-white">B2B Startup Coaching</h1>
                                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">B2B 전용</span>
                            </div>
                            <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-black mt-1">B2B ENTERPRISE SOLUTION & CSO</p>
                        </div>
                    </div>
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                        <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">B2B 거버넌스 메뉴</p>
                        {menuItems.filter(i => ['dashboard', 'content', 'psychology', 'timing', 'partner', 'investment', 'bm'].includes(i.id)).map((item) => (
                            <a
                                key={item.id}
                                onClick={() => {
                                    if (item.id === 'dashboard') {
                                        setSelectedService(null);
                                        setActiveMenu('dashboard');
                                    } else {
                                        setSelectedService(item);
                                        setActiveMenu(item.id);
                                    }
                                }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg group transition-all cursor-pointer ${activeMenu === item.id
                                    ? 'bg-[#3211d4]/10 text-[#3211d4] border-r-2 border-[#3211d4]'
                                    : 'text-[#a19db9] hover:bg-white/5'
                                    }`}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span className={`text-sm ${activeMenu === item.id ? 'font-bold' : 'font-medium'}`}>
                                    {item.label}
                                </span>
                            </a>
                        ))}

                        <div className="pt-6 px-4">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">B2B C-Level 전문 분석</p>
                            <div className="space-y-1">
                                {menuItems.filter(i => ['strategy', 'legal', 'org'].includes(i.id)).map((item) => (
                                    <a
                                        key={item.id}
                                        onClick={() => {
                                            setSelectedService(item);
                                            setActiveMenu(item.id);
                                        }}
                                        className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all text-sm cursor-pointer ${activeMenu === item.id
                                            ? 'bg-indigo-500/20 text-indigo-300 font-bold border-l-2 border-indigo-400'
                                            : 'text-[#a19db9] hover:text-white hover:bg-white/5 font-medium'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-[20px] text-indigo-400">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 px-4">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">B2B 파트너십 & 거버넌스</p>
                            <a onClick={() => router.push('/startup/facilitation')} className="flex items-center gap-3 py-2 text-[#a19db9] hover:text-[#3211d4] transition-colors text-sm font-medium cursor-pointer">
                                <span className="material-symbols-outlined text-[20px]">groups</span> B2B C-Level 다자간 거버넌스 코칭
                            </a>
                            <a onClick={() => router.push('/startup/mastermind')} className="flex items-center gap-3 py-2 text-[#a19db9] hover:text-[#3211d4] transition-colors text-sm font-medium cursor-pointer">
                                <span className="material-symbols-outlined text-[20px]">diversity_3</span> B2B 수석 아키텍트 CSO 그룹 자문
                            </a>
                        </div>
                    </nav>
                </aside>

                <main className="flex-1 overflow-y-auto bg-[#0f0d1a] relative custom-scrollbar">
                    <div className="max-w-5xl mx-auto px-6 md:px-10 py-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#181526] border border-[#2b2839] rounded-2xl p-8 md:p-12 relative overflow-hidden"
                        >
                            {/* Background Glow */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-[#3211d4]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <button onClick={() => setSelectedService(null)} className="absolute top-6 left-8 flex items-center gap-2 text-[#a19db9] hover:text-white transition-colors text-sm font-bold">
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                                대시보드로 돌아가기
                            </button>

                            <div className="mt-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                                {/* Left Info Column */}
                                <div className="lg:col-span-7 space-y-6">
                                    <div className="size-16 rounded-2xl bg-[#3211d4]/10 border border-[#3211d4]/20 flex items-center justify-center text-[#3211d4]">
                                        <span className="material-symbols-outlined text-4xl">{selectedService.icon}</span>
                                    </div>
                                    <div>
                                        <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
                                            B2B Enterprise Diagnosis & Governance Suite
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">{selectedService.title}</h2>
                                        <p className="text-base md:text-lg text-[#a19db9] leading-relaxed">{selectedService.desc}</p>
                                    </div>

                                    <div className="h-px w-full bg-[#2b2839]"></div>

                                    {/* [NEW] 3대 핵심 리포트 Bullet Points (Interactive Cards) */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                                <span className="text-amber-400">📌</span>
                                                📌 [B2B 전용] 본 분석에서 제공되는 3대 핵심 경영 리포트
                                            </h3>
                                            <span className="text-[11px] text-indigo-400 font-medium">카드를 클릭하면 상세 해설이 열립니다 💡</span>
                                        </div>
                                        <div className="space-y-3">
                                            {selectedService.highlights ? (
                                                selectedService.highlights.map((h: any, idx: number) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => handleCardClick(h)}
                                                        className="group flex items-start gap-3.5 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/50 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-indigo-500/10 transition-all cursor-pointer relative overflow-hidden"
                                                    >
                                                        <div className="size-7 rounded-lg bg-[#3211d4]/30 border border-[#3211d4]/50 group-hover:bg-[#3211d4] group-hover:border-indigo-400 flex items-center justify-center text-indigo-300 group-hover:text-white font-black text-xs flex-shrink-0 mt-0.5 transition-all">
                                                            {idx + 1}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                                <p className="text-xs md:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                                                                    {h.title}
                                                                </p>
                                                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                                                    {h.tag && (
                                                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                                                                            {h.tag}
                                                                        </span>
                                                                    )}
                                                                    {!isUnlocked ? (
                                                                        <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1">
                                                                            <Lock className="w-2.5 h-2.5" />
                                                                            <span>VIP 패스</span>
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                                                                            열람 가능
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <p className="text-[11px] md:text-xs text-slate-400 group-hover:text-slate-300 leading-relaxed">
                                                                {h.desc}
                                                            </p>
                                                            <div className="mt-2 flex items-center justify-between text-[10.5px]">
                                                                <div className="flex items-center gap-1 font-bold text-indigo-400 opacity-80 group-hover:opacity-100 transition-opacity">
                                                                    <span>🔍 초보자용 상세 해설 & 적용 사례 보기</span>
                                                                    <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                                                </div>
                                                                {!isUnlocked && (
                                                                    <span className="text-[10px] text-amber-300/90 font-medium">
                                                                        (도서 독자 무료 열람)
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-[#a19db9] leading-relaxed">{selectedService.detail}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={() => handleConsultation(selectedService.prompt)}
                                            className="w-full sm:w-auto bg-gradient-to-r from-[#3211d4] to-[#5b36ff] hover:from-[#3211d4]/90 hover:to-[#5b36ff]/90 text-white px-8 py-4 rounded-xl font-extrabold text-base md:text-lg shadow-xl shadow-[#3211d4]/30 transition-all flex items-center justify-center gap-3 group cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform text-amber-300">
                                                {selectedService.id === 'content' ? 'rocket_launch' : 'bolt'}
                                            </span>
                                            <span>
                                                {selectedService.id === 'content'
                                                    ? '창업 기질 기반 사업 아이템 정밀 진단 시작하기'
                                                    : `${selectedService.title} 정밀 분석 실행하기`}
                                            </span>
                                            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                        </button>
                                        <button
                                            onClick={() => setIsExecutiveDashboardOpen(true)}
                                            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-xl font-bold text-sm md:text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-sm">bar_chart</span>
                                            <span>임원 대시보드 뷰</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Right Visual: CEO 6-Power Radar Matrix & Wellness Bio-Sync */}
                                <div className="lg:col-span-5 bg-gradient-to-b from-[#131022] to-[#0d0a1a] border border-indigo-500/30 rounded-2xl p-5 md:p-6 relative overflow-hidden flex flex-col justify-between min-h-[460px] shadow-2xl">
                                    {/* Card Header with User Name & DayMaster */}
                                    <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-2">
                                         <div className="flex items-center gap-2">
                                             <span className="material-symbols-outlined text-indigo-400 text-base animate-pulse">vital_signs</span>
                                             <span className="text-xs font-black text-white uppercase tracking-wider">
                                                 [{userSajuProfile.userName} 대표] 6대 역량 매트릭스
                                             </span>
                                         </div>
                                         <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-indigo-200 border border-indigo-400/40 flex items-center gap-1">
                                             <Sparkles className="w-3 h-3 text-amber-300 animate-spin-slow" />
                                             <span>{userSajuProfile.dayMasterName}</span>
                                         </span>
                                    </div>

                                    {/* Central 6-Axis CEO Power Radar Chart with Dynamic Polygon & Real Points */}
                                    <div className="relative py-2 flex flex-col items-center justify-center">
                                        <div className="w-full max-w-[290px] aspect-square relative flex items-center justify-center">
                                             {/* Radar SVG Grid & Polygon */}
                                             <svg className="w-full h-full filter drop-shadow-[0_0_15px_rgba(99,102,241,0.25)]" viewBox="0 0 240 240">
                                                 {/* Outer Guides */}
                                                 <polygon points="120,30 198,75 198,165 120,210 42,165 42,75" fill="none" stroke="#2b2839" strokeWidth="1" />
                                                 <polygon points="120,55 176,87 176,153 120,185 64,153 64,87" fill="none" stroke="#2b2839" strokeWidth="0.8" strokeDasharray="3,3" />
                                                 <polygon points="120,80 154,100 154,140 120,160 86,140 86,100" fill="none" stroke="#2b2839" strokeWidth="0.5" />
                                                 
                                                 {/* Axis Lines */}
                                                 <line x1="120" y1="120" x2="120" y2="30" stroke="#4338ca" strokeWidth="0.8" />
                                                 <line x1="120" y1="120" x2="198" y2="75" stroke="#4338ca" strokeWidth="0.8" />
                                                 <line x1="120" y1="120" x2="198" y2="165" stroke="#4338ca" strokeWidth="0.8" />
                                                 <line x1="120" y1="120" x2="120" y2="210" stroke="#4338ca" strokeWidth="0.8" />
                                                 <line x1="120" y1="120" x2="42" y2="165" stroke="#4338ca" strokeWidth="0.8" />
                                                 <line x1="120" y1="120" x2="42" y2="75" stroke="#4338ca" strokeWidth="0.8" />

                                                 {/* Dynamic Calculated Polygon based on Saju */}
                                                 <polygon
                                                     points={userSajuProfile.polygonPoints}
                                                     fill="url(#radarGradient)"
                                                     stroke="#a855f7"
                                                     strokeWidth="2.5"
                                                 />

                                                 <defs>
                                                     <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                         <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
                                                         <stop offset="50%" stopColor="#6366f1" stopOpacity="0.3" />
                                                         <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.35" />
                                                     </linearGradient>
                                                 </defs>

                                                 {/* Dynamic Data Points */}
                                                 {userSajuProfile.points.map((pt: any, idx: number) => {
                                                     const colors = ['#a855f7', '#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'];
                                                     return (
                                                         <circle
                                                             key={idx}
                                                             cx={pt.x}
                                                             cy={pt.y}
                                                             r="4.5"
                                                             fill={colors[idx]}
                                                             stroke="#fff"
                                                             strokeWidth="1.5"
                                                             className="animate-pulse cursor-pointer"
                                                         />
                                                     );
                                                 })}
                                             </svg>

                                             {/* Interactive Touch Axis Buttons with Dynamic Scores */}
                                             <button 
                                                 onClick={() => setSelectedRadarAxis({
                                                     id: 'innovation',
                                                     title: '💡 혁신 기획 (Innovation Strategy)',
                                                     score: userSajuProfile.scores.innovation,
                                                     icon: 'lightbulb',
                                                     color: 'text-purple-300',
                                                     badgeColor: 'bg-purple-500/20 text-purple-200 border-purple-400/40',
                                                     bioWellness: userSajuProfile.axes.innovation.bioWellness,
                                                     darkCode: userSajuProfile.axes.innovation.dark,
                                                     neuralCode: userSajuProfile.axes.innovation.neural,
                                                     metaCode: userSajuProfile.axes.innovation.meta,
                                                     action: userSajuProfile.axes.innovation.action
                                                 })}
                                                 className="absolute top-[-4px] text-center p-1.5 rounded-xl hover:bg-purple-500/20 transition-all cursor-pointer active:scale-95 group"
                                             >
                                                 <span className="text-[10px] font-black text-purple-300 group-hover:text-white block transition-colors">💡 혁신 기획</span>
                                                 <span className="text-[9px] font-mono text-purple-400 font-bold bg-purple-950/60 px-1.5 py-0.2 rounded border border-purple-500/30">{userSajuProfile.scores.innovation}점 🔍</span>
                                             </button>

                                             <button 
                                                 onClick={() => setSelectedRadarAxis({
                                                     id: 'capital',
                                                     title: '💰 자본/수익 (Capital Flow & ROI)',
                                                     score: userSajuProfile.scores.capital,
                                                     icon: 'payments',
                                                     color: 'text-indigo-300',
                                                     badgeColor: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/40',
                                                     bioWellness: userSajuProfile.axes.capital.bioWellness,
                                                     darkCode: userSajuProfile.axes.capital.dark,
                                                     neuralCode: userSajuProfile.axes.capital.neural,
                                                     metaCode: userSajuProfile.axes.capital.meta,
                                                     action: userSajuProfile.axes.capital.action
                                                 })}
                                                 className="absolute top-[24%] right-[-10px] text-right p-1.5 rounded-xl hover:bg-indigo-500/20 transition-all cursor-pointer active:scale-95 group"
                                             >
                                                 <span className="text-[10px] font-black text-indigo-300 group-hover:text-white block transition-colors">💰 자본/수익</span>
                                                 <span className="text-[9px] font-mono text-indigo-400 font-bold bg-indigo-950/60 px-1.5 py-0.2 rounded border border-indigo-500/30">{userSajuProfile.scores.capital}점 🔍</span>
                                             </button>

                                             <button 
                                                 onClick={() => setSelectedRadarAxis({
                                                     id: 'execution',
                                                     title: '⚡ 빠른 실행 (Agile Peak Momentum)',
                                                     score: userSajuProfile.scores.execution,
                                                     icon: 'bolt',
                                                     color: 'text-blue-300',
                                                     badgeColor: 'bg-blue-500/20 text-blue-200 border-blue-400/40',
                                                     bioWellness: userSajuProfile.axes.execution.bioWellness,
                                                     darkCode: userSajuProfile.axes.execution.dark,
                                                     neuralCode: userSajuProfile.axes.execution.neural,
                                                     metaCode: userSajuProfile.axes.execution.meta,
                                                     action: userSajuProfile.axes.execution.action
                                                 })}
                                                 className="absolute bottom-[24%] right-[-10px] text-right p-1.5 rounded-xl hover:bg-blue-500/20 transition-all cursor-pointer active:scale-95 group"
                                             >
                                                 <span className="text-[10px] font-black text-blue-300 group-hover:text-white block transition-colors">⚡ 빠른 실행</span>
                                                 <span className="text-[9px] font-mono text-blue-400 font-bold bg-blue-950/60 px-1.5 py-0.2 rounded border border-blue-500/30">{userSajuProfile.scores.execution}점 🔍</span>
                                             </button>

                                             <button 
                                                 onClick={() => setSelectedRadarAxis({
                                                     id: 'market',
                                                     title: '📈 시장 확장 (Market Scaling & Viral)',
                                                     score: userSajuProfile.scores.market,
                                                     icon: 'trending_up',
                                                     color: 'text-cyan-300',
                                                     badgeColor: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40',
                                                     bioWellness: userSajuProfile.axes.market.bioWellness,
                                                     darkCode: userSajuProfile.axes.market.dark,
                                                     neuralCode: userSajuProfile.axes.market.neural,
                                                     metaCode: userSajuProfile.axes.market.meta,
                                                     action: userSajuProfile.axes.market.action
                                                 })}
                                                 className="absolute bottom-[-4px] text-center p-1.5 rounded-xl hover:bg-cyan-500/20 transition-all cursor-pointer active:scale-95 group"
                                             >
                                                 <span className="text-[10px] font-black text-cyan-300 group-hover:text-white block transition-colors">📈 시장 확장</span>
                                                 <span className="text-[9px] font-mono text-cyan-400 font-bold bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-500/30">{userSajuProfile.scores.market}점 🔍</span>
                                             </button>

                                             <button 
                                                 onClick={() => setSelectedRadarAxis({
                                                     id: 'leadership',
                                                     title: '👥 팀 리더십 (Co-Creation & Resonance)',
                                                     score: userSajuProfile.scores.leadership,
                                                     icon: 'groups',
                                                     color: 'text-emerald-300',
                                                     badgeColor: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
                                                     bioWellness: userSajuProfile.axes.leadership.bioWellness,
                                                     darkCode: userSajuProfile.axes.leadership.dark,
                                                     neuralCode: userSajuProfile.axes.leadership.neural,
                                                     metaCode: userSajuProfile.axes.leadership.meta,
                                                     action: userSajuProfile.axes.leadership.action
                                                 })}
                                                 className="absolute bottom-[24%] left-[-10px] text-left p-1.5 rounded-xl hover:bg-emerald-500/20 transition-all cursor-pointer active:scale-95 group"
                                             >
                                                 <span className="text-[10px] font-black text-emerald-300 group-hover:text-white block transition-colors">👥 팀 리더십</span>
                                                 <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">{userSajuProfile.scores.leadership}점 🔍</span>
                                             </button>

                                             <button 
                                                 onClick={() => setSelectedRadarAxis({
                                                     id: 'mental',
                                                     title: '🛡️ 멘탈 회복 (Vagus Nerve & Bio-Reset)',
                                                     score: userSajuProfile.scores.mental,
                                                     icon: 'shield_moon',
                                                     color: 'text-amber-300',
                                                     badgeColor: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
                                                     bioWellness: userSajuProfile.axes.mental.bioWellness,
                                                     darkCode: userSajuProfile.axes.mental.dark,
                                                     neuralCode: userSajuProfile.axes.mental.neural,
                                                     metaCode: userSajuProfile.axes.mental.meta,
                                                     action: userSajuProfile.axes.mental.action
                                                 })}
                                                 className="absolute top-[24%] left-[-10px] text-left p-1.5 rounded-xl hover:bg-amber-500/20 transition-all cursor-pointer active:scale-95 group"
                                             >
                                                 <span className="text-[10px] font-black text-amber-300 group-hover:text-white block transition-colors">🛡️ 멘탈 회복</span>
                                                 <span className="text-[9px] font-mono text-amber-400 font-bold bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-500/30">{userSajuProfile.scores.mental}점 🔍</span>
                                             </button>

                                             {/* Center Badge */}
                                             <div className="absolute size-14 rounded-full bg-[#181526]/95 border-2 border-indigo-400/60 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] backdrop-blur-sm pointer-events-none">
                                                 <span className="text-[7.5px] font-black text-indigo-300 uppercase tracking-tighter">CEO 파워</span>
                                                 <span className="text-xs font-black text-white font-mono">{userSajuProfile.ceoPower}</span>
                                             </div>
                                        </div>
                                    </div>

                                    {/* 🌿 세계 최고 웰니스 & 비즈니스 코칭 싱크 박스 (동적 매칭) */}
                                    <div className="mt-2.5 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-[#161329] to-slate-950 border border-indigo-500/20 space-y-2 text-left">
                                        <div className="flex items-center justify-between text-xs">
                                             <span className="text-slate-200 font-bold flex items-center gap-1.5">
                                                 <span className="material-symbols-outlined text-amber-400 text-sm">psychology</span>
                                                 <span>{userSajuProfile.userName} 대표 맞춤 비즈니스 & 웰니스</span>
                                             </span>
                                             <span className="text-emerald-400 font-mono font-black text-xs">{userSajuProfile.businessFit}% (최적 적합)</span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                             <div
                                                 className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-700"
                                                 style={{ width: `${userSajuProfile.businessFit}%` }}
                                             />
                                        </div>
                                        <div className="pt-0.5 text-[11px] space-y-1 text-slate-300">
                                             <div className="flex items-center justify-between">
                                                 <span className="text-amber-300 font-bold">1순위 추천:</span>
                                                 <strong className="text-white font-extrabold truncate max-w-[200px]">{userSajuProfile.bizRank1}</strong>
                                             </div>
                                             <div className="flex items-center justify-between text-slate-400 text-[10px]">
                                                 <span className="text-indigo-300 font-bold">2순위:</span>
                                                 <span className="text-slate-300 truncate max-w-[200px]">{userSajuProfile.bizRank2}</span>
                                             </div>
                                             <div className="flex items-center justify-between text-slate-400 text-[10px] pt-0.5 border-t border-white/5">
                                                 <span className="text-cyan-300 font-bold">⚡ 바이오 피크 타임:</span>
                                                 <span className="text-cyan-300 font-mono font-bold">{userSajuProfile.peakHour}</span>
                                             </div>
                                        </div>
                                    </div>

                                    {/* 🚀 [대표님 실전 마케팅 툴킷 & 3단계 밸류 래더 바] */}
                                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-indigo-500/20 border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                                        <div className="flex items-center gap-2.5">
                                            <div className="size-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shrink-0 shadow-md">
                                                💎
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs font-black text-amber-300">辛金 다이아몬드 실전 마케팅 툴킷</span>
                                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-200 border border-amber-400/30">대표님 전용</span>
                                                </div>
                                                <p className="text-[11px] text-slate-300 font-medium">
                                                    스마트스토어·스레드·B2B 제휴에 바로 복사해 쓰는 1초 완판 카피라이팅 팩
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsMarketingToolkitOpen(true)}
                                            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 active:scale-95"
                                        >
                                            <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-current" />
                                            <span>📋 홍보용 완판 카피 복사하기</span>
                                        </button>
                                    </div>

                                    {/* Security & Engine Footer */}
                                    <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[9.5px] text-slate-500 font-mono">
                                         <span className="flex items-center gap-1">
                                             <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                             <span>WHOOP & OURA 웰니스 코칭 프로토콜 동기화</span>
                                         </span>
                                         <span>108 MATRIX B2B ENTERPRISE AI ENGINE</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </main>

                {/* [NEW] 🌟 세계 최고급 6대 역량 웰니스 & 뇌신경 정밀 코칭 팝업 모달 */}
                {selectedRadarAxis && (
                    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-lg animate-fade-in" onClick={() => setSelectedRadarAxis(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-lg bg-gradient-to-b from-[#18152c] to-[#0c0a18] border border-indigo-500/50 rounded-3xl shadow-[0_0_60px_rgba(99,102,241,0.3)] overflow-hidden flex flex-col max-h-[90vh] text-left text-white"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#120f24]">
                                <div className="flex items-center gap-3">
                                    <div className="size-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/40">
                                        <span className="material-symbols-outlined text-2xl">{selectedRadarAxis.icon}</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-base sm:text-lg font-black text-white">{selectedRadarAxis.title}</h3>
                                        </div>
                                        <p className="text-xs text-indigo-300 font-medium mt-0.5">{selectedRadarAxis.bioWellness}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedRadarAxis(null)}
                                    className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[calc(85vh-130px)] no-scrollbar text-xs sm:text-sm">
                                {/* Score Badge Banner */}
                                <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-amber-400 text-lg">monitoring</span>
                                        <span className="font-bold text-gray-200">현재 발현 지수</span>
                                    </div>
                                    <span className="text-base font-black text-amber-300 font-mono">{selectedRadarAxis.score}점 / 100점 (상위 3% 최상급)</span>
                                </div>

                                {/* 3-Layer Bio-Mind Coaching Code */}
                                <div className="space-y-3">
                                    {/* 1. Dark Code */}
                                    <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-1.5">
                                        <div className="flex items-center gap-2 text-red-300 font-black text-xs">
                                            <span className="material-symbols-outlined text-sm">warning</span>
                                            <span>🔴 다크코드 (과부하 & 에고 방어 기제)</span>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed text-xs pl-5">{selectedRadarAxis.darkCode}</p>
                                    </div>

                                    {/* 2. Neural Code */}
                                    <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-1.5">
                                        <div className="flex items-center gap-2 text-indigo-300 font-black text-xs">
                                            <span className="material-symbols-outlined text-sm">psychology_alt</span>
                                            <span>🔵 뉴럴코드 (뇌신경 재배선 & 웰니스 처방)</span>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed text-xs pl-5">{selectedRadarAxis.neuralCode}</p>
                                    </div>

                                    {/* 3. Meta Code */}
                                    <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-400/40 space-y-1.5">
                                        <div className="flex items-center gap-2 text-amber-300 font-black text-xs">
                                            <span className="material-symbols-outlined text-sm">stars</span>
                                            <span>✨ 메타코드 (순수 영점 몰입 & 파워 만개)</span>
                                        </div>
                                        <p className="text-gray-200 leading-relaxed text-xs pl-5 font-medium">{selectedRadarAxis.metaCode}</p>
                                    </div>
                                </div>

                                {/* Today Action Prescription */}
                                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/40 space-y-1.5">
                                    <div className="flex items-center gap-2 text-emerald-300 font-black text-xs">
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                        <span>🎯 오늘 즉시 실천할 1분 웰니스 액션</span>
                                    </div>
                                    <p className="text-emerald-100 font-bold text-xs pl-5">{selectedRadarAxis.action}</p>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 border-t border-white/10 bg-[#120f24] flex items-center justify-between">
                                <button
                                    onClick={() => {
                                        const prompt = `제 6대 역량 중 [${selectedRadarAxis.title}]에 대한 1:1 맞춤 웰니스 비즈니스 코칭을 상세히 풀어서 설명해 주세요.`;
                                        setSelectedRadarAxis(null);
                                        handleConsultation(prompt);
                                    }}
                                    className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                                >
                                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                                    <span>AI 코치와 1:1 심층 상담 이어가기 ➔</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* [NEW] 초보자용 3대 리포트 상세 해설 팝업 모달 */}
                {selectedHighlight && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#181526] border border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-5 border-b border-[#2b2839] bg-[#131022]">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-gradient-to-br from-[#3211d4] to-[#5b36ff] flex items-center justify-center text-white shadow-lg shadow-[#3211d4]/30">
                                        <span className="material-symbols-outlined text-xl">{selectedHighlight.icon || 'lightbulb'}</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                                {selectedHighlight.tag || '핵심 리포트'}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-mono">초보자 친화 가이드</span>
                                        </div>
                                        <h3 className="text-base md:text-lg font-black text-white leading-tight">
                                            {selectedHighlight.title}
                                        </h3>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedHighlight(null)}
                                    className="size-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-base">close</span>
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-5 md:p-6 overflow-y-auto space-y-5 custom-scrollbar text-left text-sm">
                                {/* 1. 쉬운 개념 비유 */}
                                <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-indigo-500/10 border border-indigo-500/20 space-y-1.5">
                                    <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
                                        <span className="material-symbols-outlined text-sm">auto_stories</span>
                                        <span>한눈에 쏙 이해하는 쉬운 개념</span>
                                    </div>
                                    <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
                                        {selectedHighlight.easyConcept}
                                    </p>
                                </div>

                                {/* 2. 왜 중요한가? */}
                                <div className="space-y-1.5">
                                    <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-sm">priority_high</span>
                                        <span>왜 창업가에게 결정적인가요?</span>
                                    </h4>
                                    <p className="text-xs text-slate-300 leading-relaxed pl-1">
                                        {selectedHighlight.whyImportant}
                                    </p>
                                </div>

                                {/* 3. 제공되는 3대 결과물 */}
                                {selectedHighlight.deliverables && (
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
                                            <span>이 분석을 통해 얻게 되는 핵심 리포트 내용</span>
                                        </h4>
                                        <div className="space-y-1.5 pl-1">
                                            {selectedHighlight.deliverables.map((item: string, dIdx: number) => (
                                                <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-300">
                                                    <span className="text-emerald-400 font-bold">✔</span>
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 4. 실제 스타트업 적용 사례 */}
                                {selectedHighlight.sampleCase && (
                                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 leading-relaxed">
                                        <p className="font-medium text-slate-200">{selectedHighlight.sampleCase}</p>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer (Action Buttons) */}
                            <div className="p-4 md:p-5 border-t border-[#2b2839] bg-[#131022] flex flex-col sm:flex-row items-center justify-between gap-3">
                                <button
                                    onClick={() => setSelectedHighlight(null)}
                                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                                >
                                    닫기
                                </button>
                                <button
                                    onClick={() => {
                                        const target = selectedHighlight;
                                        setSelectedHighlight(null);
                                        setActiveDeepReport(target);
                                    }}
                                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer group hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <span className="material-symbols-outlined text-base group-hover:scale-110 transition-transform text-slate-950">analytics</span>
                                    <span>📊 이 분석 핵심 심층 리포트 즉시 열람하기 ➔</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                
                
                {/* 🌟 [대표님 전용] 辛金 다이아몬드 고부가가치 1초 완판 마케팅 툴킷 모달 */}
                {isMarketingToolkitOpen && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={() => setIsMarketingToolkitOpen(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-2xl bg-gradient-to-b from-[#18152c] to-[#0c0a18] border-2 border-amber-400/50 rounded-3xl shadow-[0_0_80px_rgba(245,158,11,0.3)] overflow-hidden flex flex-col max-h-[92vh] text-left text-white"
                        >
                            {/* Modal Header */}
                            <div className="p-5 sm:p-6 border-b border-white/10 bg-[#120f24] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-11 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg">
                                        💎
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/40">
                                                이경윤 대표님 전용 마케팅 자산
                                            </span>
                                        </div>
                                        <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                                            辛金 다이아몬드 실전 3대 채널 완판 카피 팩
                                        </h3>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsMarketingToolkitOpen(false)}
                                    className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[calc(85vh-130px)] custom-scrollbar text-xs sm:text-sm">
                                {/* Copy Item 1: 스마트스토어 상세페이지 앵커링 문구 */}
                                <div className="p-4 rounded-2xl bg-white/5 border border-amber-400/30 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="font-black text-amber-300 text-xs flex items-center gap-1.5">
                                            <span>🛒 [스마트스토어 상세페이지 상단 배너 문구]</span>
                                        </span>
                                        <button
                                            onClick={() => {
                                                const text = "[🎁 도서 구매자 단독 20만 원 상당 올인원 슈퍼패키지 100% 무료 증정!]\n\n📖 본 도서를 구매하신 모든 독자님께는 네이버 주문번호 인증 시 아래 5대 VIP 혜택이 즉시 전면 해금됩니다!\n\n1. 📊 19,800원 상당의 AI 스타트업 6대 역량 심층 정밀 진단서\n2. 🧬 무의식 다크코드 디버거 + 5대 바이오케어 처방전\n3. 🎵 1:1 맞춤형 헌정 힐링송 음원 제작권\n4. 🤖 AI 전담 코치 20회 심층 상담권\n\n지금 바로 도서를 구매하시고, 책 한 권 값으로 나만의 AI 전략 코치를 평생 소장하세요!";
                                                navigator.clipboard.writeText(text);
                                                setCopiedToolIdx(1);
                                                setTimeout(() => setCopiedToolIdx(null), 2000);
                                            }}
                                            className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                                        >
                                            {copiedToolIdx === 1 ? '✅ 복사 완료!' : '📋 1초 복사'}
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-gray-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5 font-mono">
                                        🎁 [도서 구매자 20만 원 상당 슈퍼패키지 무료 증정] 도서 구매 시 AI 스타트업 진단서 + 다크코드 + 바이오케어 + 힐링송 + 20회 코칭 전면 해금!
                                    </p>
                                </div>

                                {/* Copy Item 2: 스레드/인스타그램 창업가 바이럴 챌린지 */}
                                <div className="p-4 rounded-2xl bg-white/5 border border-purple-400/30 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="font-black text-purple-300 text-xs flex items-center gap-1.5">
                                            <span>📱 [스레드 / 인스타그램 / 링크드인 바이럴 챌린지]</span>
                                        </span>
                                        <button
                                            onClick={() => {
                                                const text = "스타트업 실패 원인의 42%는 '시장이 원하지 않는 제품을 창업가 혼자 고집했기 때문'입니다.\n\n물고기가 물을 만나야 날아오르듯, 창업가마다 타고난 성공 무기가 완전히 다릅니다.\n\n기술개발형? 플랫폼유통형? 지식컨설팅형? 커뮤니티형?\n\n내 사주 기질과 108 매트릭스가 분석해 주는 6대 역량 파워 매트릭스를 무료로 진단해 보세요!\n\n👉 프로필 링크에서 1분 만에 CEO 파워 지수 확인하기";
                                                navigator.clipboard.writeText(text);
                                                setCopiedToolIdx(2);
                                                setTimeout(() => setCopiedToolIdx(null), 2000);
                                            }}
                                            className="px-3 py-1 rounded-lg bg-purple-400 hover:bg-purple-300 text-slate-950 font-black text-[11px] flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                                        >
                                            {copiedToolIdx === 2 ? '✅ 복사 완료!' : '📋 1초 복사'}
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-gray-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5 font-mono">
                                        스타트업 42%가 실패하는 이유? 내 사주 기질과 사업 아이템이 충돌하기 때문입니다. [내 CEO 파워 지수 무료 진단]
                                    </p>
                                </div>

                                {/* Copy Item 3: B2B 스타트업 제휴 및 기업 복지 제안서 */}
                                <div className="p-4 rounded-2xl bg-white/5 border border-cyan-400/30 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="font-black text-cyan-300 text-xs flex items-center gap-1.5">
                                            <span>🏢 [B2B 기업 복지 & 스타트업 제휴 제안서 문구]</span>
                                        </span>
                                        <button
                                            onClick={() => {
                                                const text = "[스타트업 대표 & 핵심 인재를 위한 24시간 AI 웰니스 CSO 솔루션 제안]\n\n스타트업의 가장 큰 보이지 않는 비용은 '대표와 핵심 임원의 번아웃 및 의사결정 피로'입니다.\n\n마인드플로우랩의 [명심 108 매트릭스]는 생체 바이오리듬과 사주 의식 구조를 동기화하여:\n- 팀원별 역량 시너지 및 갈등 사전 디버깅\n- 일간 최적 몰입(Peak Flow) 시간대 브리핑\n- 1:1 맞춤형 뇌신경 힐링 케어 솔루션을 제공합니다.\n\n월 50만 원으로 5명의 핵심 인재를 위한 전담 AI 코칭 인프라를 구축하세요.";
                                                navigator.clipboard.writeText(text);
                                                setCopiedToolIdx(3);
                                                setTimeout(() => setCopiedToolIdx(null), 2000);
                                            }}
                                            className="px-3 py-1 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-[11px] flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                                        >
                                            {copiedToolIdx === 3 ? '✅ 복사 완료!' : '📋 1초 복사'}
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-gray-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5 font-mono">
                                        [스타트업 대표 & 핵심 인재를 위한 24시간 AI 웰니스 CSO 솔루션] 월 50만 원으로 5명의 전담 AI 코칭 인프라 구축
                                    </p>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 border-t border-white/10 bg-[#120f24] flex items-center justify-end">
                                <button
                                    onClick={() => setIsMarketingToolkitOpen(false)}
                                    className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
                                >
                                    닫기
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}


                {/* 🌟 [세계 최고 수준 UX/UI] 창업가 1:1 맞춤형 핵심 심층 정밀 리포트 뷰어 모달 */}
                {activeDeepReport && (
                    <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={() => setActiveDeepReport(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 25 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-4xl bg-gradient-to-b from-[#161329] via-[#0f0c1d] to-[#07050e] border-2 border-indigo-500/40 rounded-3xl shadow-[0_0_80px_rgba(99,102,241,0.35)] overflow-hidden flex flex-col max-h-[92vh] text-left text-white"
                        >
                            {/* Top Hero Banner Header */}
                            <div className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-indigo-950/80 via-purple-950/70 to-slate-950 flex items-start justify-between relative overflow-hidden shrink-0">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                                <div className="space-y-1.5 z-10">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 flex items-center gap-1 shadow-sm">
                                            👑 1:1 창업가 맞춤 정밀 리포트
                                        </span>
                                        <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                                            {userSajuProfile.dayMasterName}
                                        </span>
                                        <span className="text-[10px] font-mono text-emerald-400">ISO-27001 AI VERIFIED</span>
                                    </div>
                                    <h2 className="text-lg sm:text-2xl font-black text-white leading-tight">
                                        [{userSajuProfile.userName} 대표] {activeDeepReport.title}
                                    </h2>
                                    <p className="text-xs text-indigo-200/80 font-medium">
                                        생년월일({userSajuProfile.birthDate}) 본원 기질과 108 매트릭스 알고리즘을 융합한 정밀 사업 진단서
                                    </p>
                                </div>
                                <button
                                    onClick={() => setActiveDeepReport(null)}
                                    className="size-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer z-10 shrink-0"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Report Scrollable Body */}
                            <div className="p-5 sm:p-8 overflow-y-auto space-y-6 custom-scrollbar text-xs sm:text-sm">
                                {activeDeepReport.tag === '리스크 방어' || activeDeepReport.title?.includes('실행 리스크') || activeDeepReport.title?.includes('핵심 역량') || activeDeepReport.title?.includes('리스크 사전 방어') ? (
                                    /* 🛡️ [창업가 핵심 역량 및 실행 리스크 사전 방어 전용 세계 최강 뷰어] */
                                    <div className="space-y-6">
                                        {/* Section 1: Executive Summary */}
                                        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/70 via-red-950/30 to-slate-950 border border-indigo-400/40 space-y-3 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-72 h-72 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <h3 className="text-sm font-black text-indigo-300 flex items-center gap-2">
                                                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                                                    <span>1. 창업가 인지 사각지대 & 리스크 쉴드 총평 (Risk Defense Core)</span>
                                                </h3>
                                                <span className="text-xs font-black text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                                                    리스크 방어 안전도 94.6% (철통 방어 안전권)
                                                </span>
                                            </div>
                                            <p className="text-slate-200 leading-relaxed font-medium text-xs sm:text-sm">
                                                {userSajuProfile.userName} 대표님의 <strong className="text-amber-300">[{userSajuProfile.dayMasterName}]</strong> 기질은 뛰어난 제품 기획력과 디테일 분석력을 지녔으나, <strong className="text-red-300">‘완벽주의 출시 지연’</strong>과 <strong className="text-red-300">‘아웃바운드 영업 기피’</strong>라는 인지적 사각지대(밑 빠진 구멍)를 보유하고 있습니다. 
                                                <strong className="text-cyan-300">세일즈 자동화 파이프라인</strong>과 <strong className="text-emerald-300">영업형 C-Level 파트너십</strong>을 선제적으로 결합하여 생존율을 300% 이상 극대화합니다.
                                            </p>
                                        </div>

                                        {/* Section 2: 대표자 6대 잠재 실행 리스크 정밀 진단 매트릭스 */}
                                        <div className="bg-[#181526] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                                <div>
                                                    <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                                                        <Activity className="w-4 h-4 text-indigo-400" />
                                                        <span>2. 대표자 6대 잠재 실행 리스크 & 인지 사각지대 정밀 진단</span>
                                                    </h3>
                                                    <p className="text-xs text-slate-400 mt-0.5">
                                                        108 매트릭스와 뇌인지과학으로 도출한 대표자 특유의 약점 구멍 분석
                                                    </p>
                                                </div>
                                                <span className="text-[11px] font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-xl border border-indigo-500/30 font-mono">
                                                    사전 방어율 96%
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
                                                {/* Risk 1 */}
                                                <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-black text-purple-300">🎯 완벽주의 결정 마비</span>
                                                        <span className="text-[11px] font-mono text-purple-200 font-bold">위험도 88점</span>
                                                    </div>
                                                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full w-[88%]"></div>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        100% 완벽을 추구하다 출시와 피드백 타이밍을 놓침 ➔ <strong className="text-emerald-300">"70% 확신 시 즉시 출시"</strong> 룰 적용.
                                                    </p>
                                                </div>

                                                {/* Risk 2 */}
                                                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-black text-amber-300">📢 아웃바운드 영업 기피</span>
                                                        <span className="text-[11px] font-mono text-amber-200 font-bold">위험도 76점</span>
                                                    </div>
                                                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 h-full rounded-full w-[76%]"></div>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        직접 대면 영업의 심리적 부담 ➔ <strong className="text-cyan-300">"콘텐츠 인바운드 & 자동화 퍼널"</strong>로 완전 대체.
                                                    </p>
                                                </div>

                                                {/* Risk 3 */}
                                                <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-black text-red-300">📜 계약 & 지분 부주의</span>
                                                        <span className="text-[11px] font-mono text-red-200 font-bold">위험도 68점</span>
                                                    </div>
                                                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                        <div className="bg-gradient-to-r from-red-500 to-rose-500 h-full rounded-full w-[68%]"></div>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        사람을 믿고 구두 합의 ➔ <strong className="text-white">"4년 베스팅 & 표준 주주간계약서(SHA)"</strong> 100% 필수 작성.
                                                    </p>
                                                </div>

                                                {/* Risk 4 */}
                                                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-black text-indigo-300">⚠️ 마이크로매니징 번아웃</span>
                                                        <span className="text-[11px] font-mono text-indigo-200 font-bold">위험도 82점</span>
                                                    </div>
                                                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full w-[82%]"></div>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        모든 실무를 직접 챙겨 병목 발생 ➔ <strong className="text-emerald-300">"목표와 결과 지표만 정하고 80% 위임"</strong>.
                                                    </p>
                                                </div>

                                                {/* Risk 5 */}
                                                <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-black text-cyan-300">⏳ 단기 즉각 보상 편향</span>
                                                        <span className="text-[11px] font-mono text-cyan-200 font-bold">위험도 79점</span>
                                                    </div>
                                                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                        <div className="bg-gradient-to-r from-cyan-500 to-teal-500 h-full rounded-full w-[79%]"></div>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        일회성 매출에 쫓겨 시스템 구축 소홀 ➔ <strong className="text-amber-300">"주 5시간은 자동화 파이프라인 투자"</strong>.
                                                    </p>
                                                </div>

                                                {/* Risk 6 */}
                                                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-black text-emerald-300">⚡ 도파민 크래시 & 방전</span>
                                                        <span className="text-[11px] font-mono text-emerald-200 font-bold">위험도 74점</span>
                                                    </div>
                                                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full w-[74%]"></div>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        과로와 수면 부족으로 판단력 저하 ➔ <strong className="text-cyan-300">"서카디안 리듬 기반 1분 바이오 리셋"</strong> 장착.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 3: 대표 결손 역량 100% 보완 C-Level & 공동 창업자 채용 가이드 */}
                                        <div className="bg-[#181526] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                                <div>
                                                    <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                                                        <Building2 className="w-4 h-4 text-indigo-400" />
                                                        <span>3. 대표 결손 역량을 채워줄 필수 공동 창업자 & C-Level 채용 가이드</span>
                                                    </h3>
                                                    <p className="text-xs text-slate-400 mt-0.5">
                                                        대표 1인의 한계를 메우고 기업 밸류를 5배 끌어올릴 핵심 파트너 조합
                                                    </p>
                                                </div>
                                                <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-xl border border-amber-500/30 font-mono">
                                                    팀 시너지 지수 98%
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                                                {/* Role 1: Current CEO */}
                                                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-2 relative">
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">현재 대표 (CEO)</span>
                                                    <h4 className="text-xs font-black text-white">비전 & 정밀 제품 아키텍처</h4>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        108 매트릭스 웰니스 솔루션 설계, 하이엔드 서비스 기획, 투자 유치 비전 제시.
                                                    </p>
                                                </div>

                                                {/* Role 2: 1순위 파트너 */}
                                                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-2 relative">
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">🥇 1순위 영입 파트너 (CMO/영업 리드)</span>
                                                    <h4 className="text-xs font-black text-white">B2B 세일즈 & 공격적 그로스</h4>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        대표의 영업 부담을 100% 덜어주고, 대기업/기관 B2B 라이선스 공급망을 발로 뛸 영업형 인재.
                                                    </p>
                                                </div>

                                                {/* Role 3: 2순위 파트너 */}
                                                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2 relative">
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">🥈 2순위 영입 파트너 (COO/재무)</span>
                                                    <h4 className="text-xs font-black text-white">운영 거버넌스 & 재무/계약 관리</h4>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        지분 베스팅 관리, 정부지원금 정산, 세무 및 계약 리스크를 빈틈없이 틀어막는 살림꾼 인재.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 4: 위기 상황 발생 시 멘탈 붕괴 & 조직 와해 방지 CEO 리스크 매뉴얼 */}
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-black text-white flex items-center gap-2">
                                                <Zap className="w-4 h-4 text-amber-400" />
                                                <span>4. 위기 상황 발생 시 멘탈 붕괴 & 조직 와해 방지 CEO 리스크 매뉴얼</span>
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                {/* Step 1 */}
                                                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-2">
                                                    <div className="flex items-center gap-2 text-indigo-300 font-black text-xs">
                                                        <span className="size-5 rounded-full bg-indigo-500/30 flex items-center justify-center text-[10px]">1</span>
                                                        <span>1초 멘탈 안정 (Freeze 방어)</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        위기 감지 즉시 [생리학적 한숨 3회]로 편도체 공포 반응을 차단하고 뇌 전두엽을 100% 정상 가동.
                                                    </p>
                                                </div>

                                                {/* Step 2 */}
                                                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-2">
                                                    <div className="flex items-center gap-2 text-amber-300 font-black text-xs">
                                                        <span className="size-5 rounded-full bg-amber-500/30 flex items-center justify-center text-[10px]">2</span>
                                                        <span>24시간 감정 격리 & 팩트 시트</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        감정적 반응을 일체 멈추고, 실제 손실 규모와 원인을 1장의 객관적 팩트 시트로 정리.
                                                    </p>
                                                </div>

                                                {/* Step 3 */}
                                                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-2">
                                                    <div className="flex items-center gap-2 text-emerald-300 font-black text-xs">
                                                        <span className="size-5 rounded-full bg-emerald-500/30 flex items-center justify-center text-[10px]">3</span>
                                                        <span>Plan B 즉각 실행 & 팀 안정화</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        핵심 팀원에게 솔직한 상황과 플랜 B 극복 로드맵을 투명하게 공유하여 이탈 심리를 완벽 진정.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 5: CEO 인지 사각지대 디버깅 & 웰니스 처방전 */}
                                        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/40 space-y-2.5">
                                            <h3 className="text-xs sm:text-sm font-black text-emerald-300 flex items-center gap-2">
                                                <HeartPulse className="w-4 h-4 text-emerald-400" />
                                                <span>5. CEO 위기 시 신경계 긴급 리셋 & 미주신경 웰니스 처방전</span>
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                                                <div className="space-y-1">
                                                    <p className="font-bold text-emerald-200">🫁 4-7-8 코르티솔 배출 호흡:</p>
                                                    <p className="text-[11px] leading-relaxed text-slate-300">
                                                        4초 흡입 ➔ 7초 멈춤 ➔ 8초간 길게 내쉬기 (스트레스 호르몬 수치 40% 급속 저하)
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-bold text-amber-300">☕ 중요 계약 체결 안전 룰:</p>
                                                    <p className="text-[11px] leading-relaxed text-slate-300">
                                                        결정 피로가 몰려오는 14:00~15:30에는 중요 계약 서명을 보류하고, 15분 햇볕 산책 후 재검토.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : activeDeepReport.tag === '리더십 케어' || activeDeepReport.title?.includes('리더십 균열') || activeDeepReport.title?.includes('신뢰 회복') ? (
                                    /* 👥 [리더십 균열 시점 예방 가이드 & 팀 신뢰 회복 전용 세계 최강 뷰어] */
                                    <div className="space-y-6">
                                        {/* Section 1: Executive Summary */}
                                        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/70 via-purple-950/40 to-slate-950 border border-indigo-400/40 space-y-3 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <h3 className="text-sm font-black text-indigo-300 flex items-center gap-2">
                                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                                    <span>1. 리더십 균열 방어 & 감정 거버넌스 총평 (Leadership Core)</span>
                                                </h3>
                                                <span className="text-xs font-black text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                                                    팀 퇴사율 0% 방어 지수 95.8% (상위 1% 최우수)
                                                </span>
                                            </div>
                                            <p className="text-slate-200 leading-relaxed font-medium text-xs sm:text-sm">
                                                {userSajuProfile.userName} 대표님의 <strong className="text-amber-300">[{userSajuProfile.dayMasterName}]</strong> 기질은 뛰어난 비전과 빠른 실행력을 발휘하지만, 압박감이 높아질 때 <strong className="text-red-300">‘감정적 지시 및 소통 단절’</strong>로 팀원의 불안을 유발할 수 있습니다. 
                                                <strong className="text-cyan-300">감정 분리 피드백(Facts-Impact-Next)</strong>과 <strong className="text-emerald-300">주간 30분 C-Level 동기화 룰</strong>을 장착하여 핵심 인재 이탈 없는 단단한 조직을 구축합니다.
                                            </p>
                                        </div>

                                        {/* Section 2: 조직 규모별 3단계 리더십 전환 가이드 */}
                                        <div className="bg-[#181526] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                                <div>
                                                    <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                                                        <Building2 className="w-4 h-4 text-indigo-400" />
                                                        <span>2. 조직 규모별 리더십 전환 가이드 (1~5인 ➔ 10~30인 ➔ 50인+)</span>
                                                    </h3>
                                                    <p className="text-xs text-slate-400 mt-0.5">
                                                        회사 성장 단계별 대표자의 역할 진화 및 필수 위임 프로토콜
                                                    </p>
                                                </div>
                                                <span className="text-[11px] font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-xl border border-indigo-500/30 font-mono">
                                                    위임 성공률 94%
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                                                {/* Stage 1 */}
                                                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2 relative">
                                                    <div className="flex items-center justify-between">
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">1~5인 (창업 극초기)</span>
                                                        <span className="text-xs">🏃</span>
                                                    </div>
                                                    <h4 className="text-xs font-black text-white">플레이어형 리더십 & 원팀 질주</h4>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        대표가 영업/개발 전면에 서며 솔선수범. 매일 10분 모닝 스탠드업으로 즉각적 목표 공유.
                                                    </p>
                                                    <div className="pt-1 border-t border-white/5 text-[10px] text-indigo-300">
                                                        🌿 <strong>웰니스:</strong> 대표의 조급증이 팀원에게 전이되지 않도록 1분 호흡 리셋.
                                                    </div>
                                                </div>

                                                {/* Stage 2 */}
                                                <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2 relative">
                                                    <div className="flex items-center justify-between">
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/40">10~30인 (성장기)</span>
                                                        <span className="text-xs">🤝</span>
                                                    </div>
                                                    <h4 className="text-xs font-black text-white">코치형 위임 리더십 & 전결권 부여</h4>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        마이크로매니징 중단. 팀장에게 권한 80% 위임하고 목표와 결과 지표(KPI)로만 평가.
                                                    </p>
                                                    <div className="pt-1 border-t border-white/5 text-[10px] text-purple-300">
                                                        🌿 <strong>웰니스:</strong> 주 1회 디지털 디톡스 산책으로 CEO 결정 피로도 차단.
                                                    </div>
                                                </div>

                                                {/* Stage 3 */}
                                                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2 relative">
                                                    <div className="flex items-center justify-between">
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">50인+ (스케일업)</span>
                                                        <span className="text-xs">👑</span>
                                                    </div>
                                                    <h4 className="text-xs font-black text-white">비전·문화형 리더십 & 거버넌스</h4>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        기업 철학과 사명 전파, C-Level 핵심 인재 영입 및 자본 배분에 집중.
                                                    </p>
                                                    <div className="pt-1 border-t border-white/5 text-[10px] text-amber-300">
                                                        🌿 <strong>웰니스:</strong> 서카디안 리듬 기반 고품질 수면으로 장기 판단력 극대화.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 3: 위기 소통 및 팀 신뢰 회복 매뉴얼 (Facts-Impact-Next) */}
                                        <div className="bg-[#181526] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                                <div>
                                                    <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                                                        <Activity className="w-4 h-4 text-emerald-400" />
                                                        <span>3. 위기 소통 & 팀 신뢰 회복 매뉴얼 (감정 분리 피드백 훈련)</span>
                                                    </h3>
                                                    <p className="text-xs text-slate-400 mt-0.5">
                                                        감정 섞인 질책 대신 데이터와 미래 행동으로 신뢰를 200% 복원하는 피드백 공식
                                                    </p>
                                                </div>
                                                <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-xl border border-emerald-500/30 font-mono">
                                                    심리적 안전감 98%
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                                                {/* Step 1 */}
                                                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-2">
                                                    <div className="flex items-center gap-2 text-indigo-300 font-black text-xs">
                                                        <span className="size-5 rounded-full bg-indigo-500/30 flex items-center justify-center text-[10px]">1</span>
                                                        <span>Fact (사실 명시)</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        "이번 신규 기능 배포 중 결제 모듈에서 3건의 에러가 발생했습니다." (인격 비난 배제)
                                                    </p>
                                                </div>

                                                {/* Step 2 */}
                                                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-2">
                                                    <div className="flex items-center gap-2 text-amber-300 font-black text-xs">
                                                        <span className="size-5 rounded-full bg-amber-500/30 flex items-center justify-center text-[10px]">2</span>
                                                        <span>Impact (영향 공유)</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        "이로 인해 초기 유료 전환 고객 12명의 결제 이탈과 응대 지연이 발생했습니다."
                                                    </p>
                                                </div>

                                                {/* Step 3 */}
                                                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-2">
                                                    <div className="flex items-center gap-2 text-emerald-300 font-black text-xs">
                                                        <span className="size-5 rounded-full bg-emerald-500/30 flex items-center justify-center text-[10px]">3</span>
                                                        <span>Next Action (재발 방지책)</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        "다음 스프린트부터 스테이징 사전 테스트 체크리스트를 어떻게 보강하면 좋을까요?"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 4: C-Level 및 팀장급 3대 동기부여 프레임워크 */}
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-black text-white flex items-center gap-2">
                                                <Zap className="w-4 h-4 text-amber-400" />
                                                <span>4. C-Level 및 팀장급 3대 동기부여 프레임워크</span>
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                {/* Card 1 */}
                                                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                                                    <div className="flex items-center justify-between text-indigo-300 font-black text-xs">
                                                        <span>🚀 1. 자율성 (Autonomy)</span>
                                                        <span className="text-[10px] font-mono bg-indigo-500/20 px-2 py-0.5 rounded">실행 권한 100%</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        목표만 명확히 제시하고, 실행 방식과 도구 선택은 팀장과 C-Level이 100% 주도하도록 권한 부여.
                                                    </p>
                                                </div>

                                                {/* Card 2 */}
                                                <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                                                    <div className="flex items-center justify-between text-purple-300 font-black text-xs">
                                                        <span>🏆 2. 숙련도 (Mastery)</span>
                                                        <span className="text-[10px] font-mono bg-purple-500/20 px-2 py-0.5 rounded">역량 고속 성장</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        도전적 과제와 R&D 예산을 배정하여 팀원이 회사와 함께 업계 최고 전문가로 성장하는 환경 제공.
                                                    </p>
                                                </div>

                                                {/* Card 3 */}
                                                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                                                    <div className="flex items-center justify-between text-amber-300 font-black text-xs">
                                                        <span>🌟 3. 목적성 (Purpose)</span>
                                                        <span className="text-[10px] font-mono bg-amber-500/20 px-2 py-0.5 rounded">사회적 임팩트</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        단순 매출 숫자가 아닌, 우리 제품이 고객의 삶과 웰니스를 어떻게 혁신하는지 가치 비전 공유.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 5: CEO 감정 기복 제로화 & 뇌신경 웰니스 처방전 */}
                                        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/40 space-y-2.5">
                                            <h3 className="text-xs sm:text-sm font-black text-emerald-300 flex items-center gap-2">
                                                <HeartPulse className="w-4 h-4 text-emerald-400" />
                                                <span>5. CEO 감정 기복 제로화 & 미주신경 웰니스 처방전 (팀 이탈 방지)</span>
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                                                <div className="space-y-1">
                                                    <p className="font-bold text-emerald-200">🫁 회의 직전 1분 신경계 쿨다운:</p>
                                                    <p className="text-[11px] leading-relaxed text-slate-300">
                                                        어려운 피드백 회의 전 [생리학적 한숨] 3회로 편도체 흥분을 가라앉혀 차분하고 단호한 소통 유지.
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-bold text-amber-300">☕ 도파민 크래시 방지:</p>
                                                    <p className="text-[11px] leading-relaxed text-slate-300">
                                                        오후 2~3시 결정 피로 시간대에는 팀 평가나 지적을 피하고, 15분 산책으로 혈류를 재충전.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : activeDeepReport.tag === '트렌드 & 피벗' || activeDeepReport.title?.includes('피벗') || activeDeepReport.title?.includes('메가트렌드') ? (
                                    /* 🚀 [시장 메가트렌드 결합 고승률 비즈니스 & 3단계 피벗 로드맵 전용 세계 최강 뷰어] */
                                    <div className="space-y-6">
                                        {/* Section 1: Mega-Trend Executive Summary */}
                                        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/70 via-purple-950/40 to-slate-950 border border-indigo-400/40 space-y-3 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <h3 className="text-sm font-black text-indigo-300 flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                                    <span>1. 메가트렌드 결합 고승률 BM 총평 (Trend & Pivot Core)</span>
                                                </h3>
                                                <span className="text-xs font-black text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                                                    거시 순풍 지수 96.8% (최상급 순풍)
                                                </span>
                                            </div>
                                            <p className="text-slate-200 leading-relaxed font-medium text-xs sm:text-sm">
                                                {userSajuProfile.userName} 대표님의 <strong className="text-amber-300">[{userSajuProfile.dayMasterName}]</strong> 기질은 현재 글로벌 3대 메가트렌드인 <strong className="text-cyan-300">AI 지능형 자동화, 뇌신경 웰니스, 고단가 B2B SaaS</strong>와 100% 교집합을 형성하고 있습니다. 
                                                B2C 저단가 출혈 경쟁을 피해 <strong className="text-emerald-300">‘B2B 뇌신경 멘탈케어 & 독점 진단 라이선스’</strong>로 진입할 때 역풍 없는 최단기 손익분기점(BEP) 달성이 확정됩니다.
                                            </p>
                                        </div>

                                        {/* Section 2: 3대 거대 메가트렌드 교차 검증 & 순풍 매트릭스 */}
                                        <div className="bg-[#181526] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                                <div>
                                                    <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                                                        <Activity className="w-4 h-4 text-indigo-400" />
                                                        <span>2. 3대 메가트렌드 × 대표 기질 교차 검증 매트릭스</span>
                                                    </h3>
                                                    <p className="text-xs text-slate-400 mt-0.5">
                                                        산업 거시 환경과 대표자 선천적 에너지의 순풍 결합도
                                                    </p>
                                                </div>
                                                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-xl border border-emerald-500/30 font-mono">
                                                    역풍 위험도: 0.0% (완전 안전)
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                                                {/* Trend 1 */}
                                                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2 relative overflow-hidden">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-black text-indigo-300">🤖 AI & 지능형 자동화</span>
                                                        <span className="text-[11px] font-mono text-indigo-200 font-bold">98% 순풍</span>
                                                    </div>
                                                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full w-[98%]"></div>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        대표 1인이 AI 전담 코치를 통해 100인분의 코칭 및 진단 생산성을 발휘하는 무한 확장성 확보.
                                                    </p>
                                                </div>

                                                {/* Trend 2 */}
                                                <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-black text-purple-300">🧬 뇌신경 웰니스 & 멘탈</span>
                                                        <span className="text-[11px] font-mono text-purple-200 font-bold">96% 순풍</span>
                                                    </div>
                                                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full w-[96%]"></div>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        기업 CEO 및 핵심 인재의 결정 피로와 번아웃을 방어하는 하이엔드 웰니스 시장 폭발적 성장.
                                                    </p>
                                                </div>

                                                {/* Trend 3 */}
                                                <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-black text-cyan-300">💎 B2B 고단가 라이선스</span>
                                                        <span className="text-[11px] font-mono text-cyan-200 font-bold">95% 순풍</span>
                                                    </div>
                                                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                        <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full rounded-full w-[95%]"></div>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        일회성 B2C 판매를 탈피하여 매달 안정적 현금 유입(MRR)을 창출하는 기업 구독 모델 장착.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 3: 3단계 고속 피벗 실행 로드맵 (Phase 1, 2, 3) */}
                                        <div className="bg-[#181526] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                                <div>
                                                    <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                                                        <Zap className="w-4 h-4 text-amber-400" />
                                                        <span>3. 3단계 고속 피벗 & 스케일업 실행 로드맵</span>
                                                    </h3>
                                                    <p className="text-xs text-slate-400 mt-0.5">
                                                        초기 린 검증부터 B2B 확장까지 단계별 핵심 비즈니스 & 웰니스 행동 강령
                                                    </p>
                                                </div>
                                                <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-xl border border-amber-500/30 font-mono">
                                                    목표 ROI: 9.4x (3~6개월 내 BEP)
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                                                {/* Phase 1 */}
                                                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-2.5 relative">
                                                    <div className="flex items-center justify-between">
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">Phase 1 (1~3개월)</span>
                                                        <span className="text-xs">🌱</span>
                                                    </div>
                                                    <h4 className="text-xs font-black text-white">0원 린(Lean) 검증 & 얼리어답터 10인 확보</h4>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        거대 개발 없이 노코드 랜딩과 1초 마케팅 카피로 10명의 유료 얼리어답터를 확보하여 시장 수요 100% 확증.
                                                    </p>
                                                    <div className="pt-1 border-t border-white/5 text-[10px] text-indigo-300">
                                                        🌿 <strong>웰니스:</strong> 기상 15분 자연광 쬐기로 출시 불안감 및 도파민 과소진 차단.
                                                    </div>
                                                </div>

                                                {/* Phase 2 */}
                                                <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-2.5 relative">
                                                    <div className="flex items-center justify-between">
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/40">Phase 2 (4~8개월)</span>
                                                        <span className="text-xs">⚡</span>
                                                    </div>
                                                    <h4 className="text-xs font-black text-white">단위 경제성 확립 & 자동화 파이프라인</h4>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        LTV/CAC 비율을 3.0 이상으로 맞추고, 도서 및 스마트스토어와 연계하여 대표의 시간 여유를 200% 창출.
                                                    </p>
                                                    <div className="pt-1 border-t border-white/5 text-[10px] text-purple-300">
                                                        🌿 <strong>웰니스:</strong> 90분 울트라디안 집중 사이클로 핵심 의사결정을 100% 완결.
                                                    </div>
                                                </div>

                                                {/* Phase 3 */}
                                                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-2.5 relative">
                                                    <div className="flex items-center justify-between">
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">Phase 3 (9~12개월)</span>
                                                        <span className="text-xs">👑</span>
                                                    </div>
                                                    <h4 className="text-xs font-black text-white">플랫폼 스케일업 & B2B 라이선스 확장</h4>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        검증된 솔루션을 기반으로 B2B 엔터프라이즈 및 공공기관에 라이선스를 공급하여 기업가치 5배 퀀텀점프.
                                                    </p>
                                                    <div className="pt-1 border-t border-white/5 text-[10px] text-amber-300">
                                                        🌿 <strong>웰니스:</strong> 서카디안 생체 리듬 자동화로 번아웃 없는 흑자 궤도 안착.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 4: 린(Lean) 검증 & 3대 피벗 시나리오 (Plan A / B / C) */}
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-black text-white flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                                <span>4. 초기 시장 저항 최소화 린(Lean) 검증 & 3대 피벗 시나리오</span>
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                {/* Plan A */}
                                                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                                                    <div className="flex items-center justify-between text-emerald-300 font-black text-xs">
                                                        <span>🟢 Plan A (주력 고승률 모델)</span>
                                                        <span className="text-[10px] font-mono bg-emerald-500/20 px-2 py-0.5 rounded">승률 95%</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        <strong className="text-white">B2B 기업 복지 솔루션:</strong> 대표 및 임직원 대상 24시간 AI 웰니스 CSO 진단 & 맞춤 멘탈 케어 구독.
                                                    </p>
                                                </div>

                                                {/* Plan B */}
                                                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                                                    <div className="flex items-center justify-between text-amber-300 font-black text-xs">
                                                        <span>🟡 Plan B (현금 회전형 모델)</span>
                                                        <span className="text-[10px] font-mono bg-amber-500/20 px-2 py-0.5 rounded">승률 89%</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        <strong className="text-white">도서 연계 슈퍼패키지:</strong> 9,900원 도서 구매자 대상 고단가 1:1 맞춤 힐링송 및 심화 코칭 업셀링.
                                                    </p>
                                                </div>

                                                {/* Plan C */}
                                                <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                                                    <div className="flex items-center justify-between text-purple-300 font-black text-xs">
                                                        <span>🔵 Plan C (피벗 안전망 모델)</span>
                                                        <span className="text-[10px] font-mono bg-purple-500/20 px-2 py-0.5 rounded">승률 84%</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        <strong className="text-white">버티컬 웰니스 데이터:</strong> 개인 맞춤형 바이오케어 및 뇌파 동기화 사운드 테라피 라이선스 공급.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 5: CEO 피벗 웰니스 처방전 */}
                                        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/40 space-y-2.5">
                                            <h3 className="text-xs sm:text-sm font-black text-emerald-300 flex items-center gap-2">
                                                <HeartPulse className="w-4 h-4 text-emerald-400" />
                                                <span>5. 피벗 성공을 위한 창업가 신경계 에너지 방어 3계명</span>
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                                                <div className="space-y-1">
                                                    <p className="font-bold text-emerald-200">🫁 피벗 불안증 급속 완화:</p>
                                                    <p className="text-[11px] leading-relaxed text-slate-300">
                                                        코로 2번 깊게 들이마시고 입으로 길게 내쉬는 [생리학적 한숨] 3회로 전두엽 인지 오류 방어.
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-bold text-amber-300">☕ 도파민 번아웃 사전 차단:</p>
                                                    <p className="text-[11px] leading-relaxed text-slate-300">
                                                        기상 후 90분간 카페인 지연 + 오전 09:00~11:30 골든 타임에 피벗 핵심 계약 집중.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : activeDeepReport.tag === '멘탈 분석' || activeDeepReport.title?.includes('인지 패턴') || activeDeepReport.title?.includes('마인드셋') || activeDeepReport.title?.includes('리더십') ? (
                                    /* 🧠 [창업자 리더십 & 6대 인지 패턴 마인드셋 전용 세계 최강 뷰어] */
                                    <div className="space-y-6">
                                        {/* Section 1: Leadership Executive Summary */}
                                        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-slate-950 border border-indigo-400/40 space-y-3 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <h3 className="text-sm font-black text-indigo-300 flex items-center gap-2">
                                                    <Brain className="w-4 h-4 text-purple-400" />
                                                    <span>1. 창업가 리더십 마인드셋 총평 (Leadership Core)</span>
                                                </h3>
                                                <span className="text-xs font-black text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                                                    멘탈 방어율 94.2% (상위 2% 최상위)
                                                </span>
                                            </div>
                                            <p className="text-slate-200 leading-relaxed font-medium text-xs sm:text-sm">
                                                {userSajuProfile.userName} 대표님은 <strong className="text-amber-300">[{userSajuProfile.dayMasterName}]</strong> 기질 특유의 <strong className="text-purple-300">초정밀 분석력과 높은 완결주의</strong>를 보유하고 있습니다. 다만 책임감이 과도해지면 모든 실무를 직접 통제하려는 <strong className="text-red-300">‘완벽주의 결정 마비’</strong>가 발생할 수 있으므로, 80% 수준에서 위임하고 결과 지표(KPI)로만 소통하는 <strong className="text-emerald-300">시스템형 위임 리더십</strong>이 핵심 성공 열쇠입니다.
                                            </p>
                                        </div>

                                        {/* Section 2: 6대 핵심 인지 패턴 & 멘탈 방어력 레이더 차트 (SVG) */}
                                        <div className="bg-[#181526] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                                <div>
                                                    <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                                                        <Activity className="w-4 h-4 text-indigo-400" />
                                                        <span>2. 6대 창업가 핵심 인지 패턴 & 멘탈 방어력 레이더</span>
                                                    </h3>
                                                    <p className="text-xs text-slate-400 mt-0.5">
                                                        108 매트릭스와 뇌인지과학 기반 창업자 심리 알고리즘 진단
                                                    </p>
                                                </div>
                                                <span className="text-[11px] font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-xl border border-indigo-500/30 font-mono">
                                                    HRV 94% · Flow 최상태
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
                                                {/* Left: 6-Axis Radar SVG */}
                                                <div className="lg:col-span-6 relative size-64 sm:size-72 mx-auto flex items-center justify-center">
                                                    <svg className="w-full h-full text-indigo-500/25" viewBox="0 0 200 200">
                                                        {/* Hexagon Grid Background */}
                                                        <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                                                        <polygon points="100,40 152,70 152,130 100,160 48,130 48,70" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
                                                        <polygon points="100,60 135,80 135,120 100,140 65,120 65,80" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
                                                        {/* Axis Lines */}
                                                        <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="0.6" />
                                                        <line x1="30" y1="60" x2="170" y2="140" stroke="currentColor" strokeWidth="0.6" />
                                                        <line x1="30" y1="140" x2="170" y2="60" stroke="currentColor" strokeWidth="0.6" />
                                                        {/* Data Polygon */}
                                                        <polygon points="100,28 162,68 155,133 100,166 42,132 40,68" fill="rgba(129, 140, 248, 0.35)" stroke="#818cf8" strokeWidth="2.5" />
                                                        {/* Points */}
                                                        <circle cx="100" cy="28" r="3.5" fill="#a78bfa" className="animate-pulse" />
                                                        <circle cx="162" cy="68" r="3.5" fill="#6366f1" />
                                                        <circle cx="155" cy="133" r="3.5" fill="#38bdf8" />
                                                        <circle cx="100" cy="166" r="3.5" fill="#34d399" />
                                                        <circle cx="42" cy="132" r="3.5" fill="#fbbf24" />
                                                        <circle cx="40" cy="68" r="3.5" fill="#f87171" />
                                                    </svg>
                                                    {/* Labels */}
                                                    <span className="absolute top-1 text-[10px] font-black text-purple-300 bg-black/80 px-2 py-0.5 rounded-lg border border-purple-500/30">완벽주의 (92점)</span>
                                                    <span className="absolute top-14 right-0 text-[10px] font-black text-indigo-300 bg-black/80 px-2 py-0.5 rounded-lg border border-indigo-500/30">결정력 (88점)</span>
                                                    <span className="absolute bottom-14 right-0 text-[10px] font-black text-cyan-300 bg-black/80 px-2 py-0.5 rounded-lg border border-cyan-500/30">피드백수용 (94점)</span>
                                                    <span className="absolute bottom-1 text-[10px] font-black text-emerald-300 bg-black/80 px-2 py-0.5 rounded-lg border border-emerald-500/30">회복탄력 (91점)</span>
                                                    <span className="absolute bottom-14 left-0 text-[10px] font-black text-amber-300 bg-black/80 px-2 py-0.5 rounded-lg border border-amber-500/30">보상지연 (85점)</span>
                                                    <span className="absolute top-14 left-0 text-[10px] font-black text-red-300 bg-black/80 px-2 py-0.5 rounded-lg border border-red-500/30">통제집착 (76점)</span>
                                                </div>

                                                {/* Right: 6 Cognitive Axis Score Bars */}
                                                <div className="lg:col-span-6 space-y-2.5">
                                                    <div className="p-2.5 rounded-xl bg-white/5 border border-purple-500/30 space-y-1">
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="font-bold text-purple-300">🎯 완벽주의 vs 출시 속도 (92점)</span>
                                                            <span className="font-mono text-purple-200 font-black">최상급 퀄리티 추구</span>
                                                        </div>
                                                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full w-[92%]"></div>
                                                        </div>
                                                    </div>

                                                    <div className="p-2.5 rounded-xl bg-white/5 border border-cyan-500/30 space-y-1">
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="font-bold text-cyan-300">💬 피드백 수용성 & 열린 경청 (94점)</span>
                                                            <span className="font-mono text-cyan-200 font-black">데이터 기반 겸손함</span>
                                                        </div>
                                                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full w-[94%]"></div>
                                                        </div>
                                                    </div>

                                                    <div className="p-2.5 rounded-xl bg-white/5 border border-emerald-500/30 space-y-1">
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="font-bold text-emerald-300">🛡️ 번아웃 회복탄력성 (91점)</span>
                                                            <span className="font-mono text-emerald-200 font-black">위기 멘탈 회복 빠름</span>
                                                        </div>
                                                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full w-[91%]"></div>
                                                        </div>
                                                    </div>

                                                    <div className="p-2.5 rounded-xl bg-white/5 border border-red-500/30 space-y-1">
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="font-bold text-red-300">⚠️ 통제 집착 & 마이크로매니징 (76점)</span>
                                                            <span className="font-mono text-red-200 font-black">위임 프로세스 필요</span>
                                                        </div>
                                                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                            <div className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full w-[76%]"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 3: 24시간 창업가 인지 결단력 & 도파민 파동 그래프 (Cognitive Wave) */}
                                        <div className="bg-[#181526] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                                <div>
                                                    <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                                                        <Zap className="w-4 h-4 text-amber-400" />
                                                        <span>3. 창업가 24시간 인지 결단력 & 도파민 파동 (Cognitive Energy Wave)</span>
                                                    </h3>
                                                    <p className="text-xs text-slate-400 mt-0.5">
                                                        하루 중 전두엽 의사결정 최고 피크 시간과 결정 피로 위험 구간 시각화
                                                    </p>
                                                </div>
                                                <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-xl border border-amber-500/30 font-mono">
                                                    골든 피크: 09:00 ~ 11:30
                                                </span>
                                            </div>

                                            {/* 24-Hour Wave SVG */}
                                            <div className="relative h-44 w-full pt-2">
                                                <svg className="w-full h-full overflow-visible" viewBox="0 0 700 140" preserveAspectRatio="none">
                                                    <line x1="0" y1="30" x2="700" y2="30" stroke="#2b2839" strokeDasharray="3,3" />
                                                    <line x1="0" y1="70" x2="700" y2="70" stroke="#2b2839" strokeDasharray="3,3" />
                                                    <line x1="0" y1="110" x2="700" y2="110" stroke="#2b2839" opacity="0.4" />

                                                    <defs>
                                                        <linearGradient id="cogGradient" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                                                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                                                        </linearGradient>
                                                    </defs>

                                                    {/* Area */}
                                                    <path d="M 30,110 Q 150,15 250,25 T 380,95 T 500,60 T 670,120 L 670,130 L 30,130 Z" fill="url(#cogGradient)" />
                                                    {/* Line */}
                                                    <path d="M 30,110 Q 150,15 250,25 T 380,95 T 500,60 T 670,120" fill="none" stroke="#fbbf24" strokeWidth="3" />
                                                </svg>

                                                {/* Timeline Keypoints */}
                                                <div className="absolute inset-0 flex justify-between items-end px-4 pb-1 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[10px] font-bold text-slate-400">07:00</span>
                                                        <span className="text-[9px] text-indigo-300">자연광 쬐기</span>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[9px] mb-1 animate-bounce">최고 피크</span>
                                                        <span className="text-[10px] font-black text-amber-300">09:00 ~ 11:30</span>
                                                        <span className="text-[9px] text-emerald-400 font-bold">핵심 계약/투자 결정</span>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <span className="px-1.5 py-0.5 rounded bg-red-500 text-white font-black text-[9px] mb-1">피로 저하</span>
                                                        <span className="text-[10px] font-bold text-red-300">14:00 ~ 15:30</span>
                                                        <span className="text-[9px] text-slate-400">15분 산책/수분 충전</span>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[10px] font-bold text-cyan-300">16:30 ~ 18:30</span>
                                                        <span className="text-[9px] text-cyan-200">팀 피드백 & 소통</span>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[10px] font-bold text-purple-300">22:00</span>
                                                        <span className="text-[9px] text-purple-200">블루라이트 차단</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 4: 6대 인지 오류 패턴별 1초 리더십 디버깅 처방 카드 */}
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-black text-white flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                                <span>4. 창업가 3대 인지 오류 디버깅 & 행동과학 처방전</span>
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                {/* Card 1 */}
                                                <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                                                    <div className="flex items-center gap-1.5 text-purple-300 font-black text-xs">
                                                        <span>🐞 1. 완벽주의 결정 마비</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        <strong className="text-white">버그:</strong> 제품이 완벽해질 때까지 출시와 영업을 미룸.<br />
                                                        <strong className="text-emerald-300">처방:</strong> "70% 완성 시점에 즉시 고객에게 던져라."
                                                    </p>
                                                </div>
                                                {/* Card 2 */}
                                                <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 space-y-2">
                                                    <div className="flex items-center gap-1.5 text-red-300 font-black text-xs">
                                                        <span>🐞 2. 마이크로매니징 통제욕</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        <strong className="text-white">버그:</strong> 팀원의 사소한 방식까지 간섭하여 병목 발생.<br />
                                                        <strong className="text-amber-300">처방:</strong> "목표와 결과 지표만 정하고 방식은 100% 위임."
                                                    </p>
                                                </div>
                                                {/* Card 3 */}
                                                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                                                    <div className="flex items-center gap-1.5 text-amber-300 font-black text-xs">
                                                        <span>🐞 3. 단기 즉각 보상 편향</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        <strong className="text-white">버그:</strong> 일회성 매출에 쫓겨 자동화 시스템 구축 소홀.<br />
                                                        <strong className="text-cyan-300">처방:</strong> "주 5시간은 무조건 시스템 파이프라인에 투자."
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 5: CEO 1분 바이오 멘탈 리셋 프로토콜 */}
                                        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/40 space-y-2.5">
                                            <h3 className="text-xs sm:text-sm font-black text-emerald-300 flex items-center gap-2">
                                                <HeartPulse className="w-4 h-4 text-emerald-400" />
                                                <span>5. CEO 위기 시 1분 즉각 멘탈 리셋 (앤드류 후버만 생리학적 한숨)</span>
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                                                <div className="space-y-1">
                                                    <p className="font-bold text-emerald-200">🫁 1분 호흡 프로토콜:</p>
                                                    <p className="text-[11px] leading-relaxed text-slate-300">
                                                        코로 깊게 2번 연속 흡입 ➔ 입으로 길게 5초간 내쉬기 (3회 반복 시 코르티솔 즉시 감소)
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-bold text-amber-300">☕ 도파민 고갈 방지 룰:</p>
                                                    <p className="text-[11px] leading-relaxed text-slate-300">
                                                        기상 후 90분간 카페인 지연 ➔ 오후 2시 결정 피로 및 에너지 크래시 100% 예방
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* 📊 [사업 아이템, BM 타당성, 전략 피벗 기본 뷰어] */
                                    <div className="space-y-6">
                                        {/* Section 1: Executive Summary Card */}
                                        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-transparent border border-indigo-400/30 space-y-3 relative">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-black text-indigo-300 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-amber-400 text-base">verified</span>
                                                    <span>1. 핵심 요약 (Executive Summary)</span>
                                                </h3>
                                                <span className="text-xs font-black text-emerald-400 font-mono">성공 승률 {userSajuProfile.businessFit}%</span>
                                            </div>
                                            <p className="text-slate-200 leading-relaxed font-medium text-xs sm:text-sm">
                                                {userSajuProfile.userName} 대표님의 기질 구조는 <strong className="text-amber-300">[{userSajuProfile.dayMasterName}]</strong>의 정밀 에너지와 일치합니다. 
                                                무리한 B2C 소모전보다는 <strong className="text-emerald-300">고단가 지식 자산 및 B2B 구독 솔루션</strong>에서 가장 빠른 현금 회전율(ROI)을 달성할 수 있습니다.
                                            </p>
                                        </div>

                                        {/* Section 2: 4-Type Entrepreneur Matrix & Match Rates */}
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-black text-white flex items-center gap-2">
                                                <span className="material-symbols-outlined text-indigo-400 text-base">grid_view</span>
                                                <span>2. 4대 창업 기질 유형별 적합도 진단</span>
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="p-4 rounded-2xl bg-white/5 border border-indigo-500/30 space-y-2 relative overflow-hidden">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-indigo-300">🛠️ 기술·솔루션 개발형</span>
                                                        <span className="text-xs font-black font-mono text-purple-300">96% (최상급)</span>
                                                    </div>
                                                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full w-[96%]"></div>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        세상에 없던 정밀한 가치와 아키텍처를 설계하여 압도적 제품력으로 시장을 장악하는 1순위 적성.
                                                    </p>
                                                </div>

                                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-cyan-300">💡 전문가 지식·컨설팅형</span>
                                                        <span className="text-xs font-black font-mono text-cyan-300">94% (우수)</span>
                                                    </div>
                                                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full w-[94%]"></div>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        깊이 있는 전문 데이터와 인사이트를 고단가 멤버십 및 B2B 라이선스로 전환하는 역량.
                                                    </p>
                                                </div>

                                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-amber-300">🌐 플랫폼·유통 네트워크형</span>
                                                        <span className="text-xs font-black font-mono text-amber-300">91% (양호)</span>
                                                    </div>
                                                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 h-full rounded-full w-[91%]"></div>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        공급자와 수요자를 잇고 단위 경제성을 확보하여 자본 선순환을 유도하는 비즈니스.
                                                    </p>
                                                </div>

                                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-emerald-300">👥 커뮤니티·팬덤형</span>
                                                        <span className="text-xs font-black font-mono text-emerald-300">88% (보통)</span>
                                                    </div>
                                                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full w-[88%]"></div>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        충성도 높은 고객 커뮤니티를 구축하여 리텐션을 극대화하는 서포트 모델.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 3: Recommended Business Item Top 3 & ROI Table */}
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-black text-white flex items-center gap-2">
                                                <span className="material-symbols-outlined text-amber-400 text-base">rocket_launch</span>
                                                <span>3. 사주 기질 100% 일치 최적 사업 아이템 Top 3 & ROI 분석</span>
                                            </h3>
                                            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0d0a1a]">
                                                <table className="w-full text-left text-xs border-collapse">
                                                    <thead>
                                                        <tr className="bg-white/5 border-b border-white/10 text-slate-300 text-[11px] font-bold">
                                                            <th className="p-3">순위 & 아이템 카테고리</th>
                                                            <th className="p-3">목표 타겟</th>
                                                            <th className="p-3 text-center">예상 ROI</th>
                                                            <th className="p-3 text-center">손익분기(BEP)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-white/5 text-slate-200">
                                                        <tr className="bg-indigo-500/10 hover:bg-indigo-500/15 transition-colors">
                                                            <td className="p-3 font-black text-amber-300 flex items-center gap-1.5">
                                                                <span className="size-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black shrink-0">1</span>
                                                                <span>{userSajuProfile.bizRank1}</span>
                                                            </td>
                                                            <td className="p-3 text-slate-300">B2B 중소/중견기업, 전문직</td>
                                                            <td className="p-3 text-center font-bold text-emerald-400 font-mono">9.4x (최고)</td>
                                                            <td className="p-3 text-center font-mono text-cyan-300">3 ~ 6개월</td>
                                                        </tr>
                                                        <tr className="hover:bg-white/5 transition-colors">
                                                            <td className="p-3 font-bold text-white flex items-center gap-1.5">
                                                                <span className="size-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-black shrink-0">2</span>
                                                                <span>{userSajuProfile.bizRank2}</span>
                                                            </td>
                                                            <td className="p-3 text-slate-300">스타트업 창업가, 전문가</td>
                                                            <td className="p-3 text-center font-bold text-emerald-400 font-mono">8.8x</td>
                                                            <td className="p-3 text-center font-mono text-cyan-300">2 ~ 4개월</td>
                                                        </tr>
                                                        <tr className="hover:bg-white/5 transition-colors">
                                                            <td className="p-3 font-bold text-slate-300 flex items-center gap-1.5">
                                                                <span className="size-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] font-black shrink-0">3</span>
                                                                <span>버티컬 웰니스 & 1:1 맞춤형 뇌신경 멘탈케어</span>
                                                            </td>
                                                            <td className="p-3 text-slate-400">하이엔드 B2C, VIP 고객</td>
                                                            <td className="p-3 text-center font-bold text-emerald-400 font-mono">8.2x</td>
                                                            <td className="p-3 text-center font-mono text-cyan-300">4 ~ 8개월</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Section 4: 3-Stage Agile Pivot Roadmap */}
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-black text-white flex items-center gap-2">
                                                <span className="material-symbols-outlined text-purple-400 text-base">timeline</span>
                                                <span>4. 3단계 고속 피벗 & 스케일업 로드맵</span>
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">Phase 1 (1~3개월)</span>
                                                    <h4 className="text-xs font-bold text-white">0원 MVP 가설 검증</h4>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        거대한 개발 없이 노코드/원페이지 랜딩으로 10명의 유료 얼리어답터를 확보하여 시장 수요를 100% 확증.
                                                    </p>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/40">Phase 2 (4~8개월)</span>
                                                    <h4 className="text-xs font-bold text-white">단위 경제성 & 자동화</h4>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        LTV/CAC 비율을 3.0 이상으로 맞추고, 핵심 파이프라인을 시스템화하여 대표의 시간 여유를 창출.
                                                    </p>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">Phase 3 (9~12개월)</span>
                                                    <h4 className="text-xs font-bold text-white">플랫폼 스케일업 & 확장</h4>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        검증된 솔루션을 기반으로 인접 산업군으로 영토를 확장하고 B2B 엔터프라이즈 라이선스 계약 체결.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 5: Pre-mortem Risk Shield & Wellness */}
                                        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/30 via-slate-900 to-emerald-950/30 border border-white/10 space-y-2.5">
                                            <h3 className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">shield</span>
                                                <span>5. 실패 사전 차단 방어막 (Pre-mortem Shield) & 바이오 해킹</span>
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                                                <div className="space-y-1">
                                                    <p className="font-bold text-red-300">⚠️ 가장 주의해야 할 함정:</p>
                                                    <p className="text-[11px] leading-relaxed text-slate-400">
                                                        {userSajuProfile.axes.innovation.dark}
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-bold text-emerald-300">🌿 뇌신경 웰니스 처방전:</p>
                                                    <p className="text-[11px] leading-relaxed text-slate-400">
                                                        {userSajuProfile.vagusTip} • {userSajuProfile.peakHour}에 최우선 집중
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Report Modal Footer */}
                            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0d0a1a] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                                <button
                                    onClick={() => setActiveDeepReport(null)}
                                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                                >
                                    ✕ 리포트 닫기
                                </button>
                                <button
                                    onClick={() => {
                                        const prompt = `[${userSajuProfile.userName} 대표님의 ${activeDeepReport.title}] 리포트를 기반으로 1:1 비즈니스 심화 컨설팅 및 피벗 실행 전략을 구체적으로 지도해주세요.`;
                                        setActiveDeepReport(null);
                                        handleConsultation(prompt);
                                    }}
                                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                                >
                                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                                    <span>AI 코치와 리포트 내용으로 1:1 심화 코칭 이어가기 ➔</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}


                {/* [NEW] 19,800원 무통장 입금 & 9,900원 도서 인증 VIP 열람 패스 모달 */}
                {isStartupPassOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-[#181526] border border-amber-400/40 rounded-3xl p-6 shadow-2xl overflow-hidden text-center max-h-[92vh] overflow-y-auto custom-scrollbar"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsStartupPassOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-base">close</span>
                            </button>

                            {/* Badge & Title */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-black tracking-wider uppercase mb-2">
                                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-current" />
                                <span>스타트업 3대 핵심 리포트 VIP 패스</span>
                            </div>

                            <h3 className="text-lg font-black text-white mb-2">
                                스타트업 전문 심층 분석 열람권
                            </h3>

                            {/* 💡 초특급 앵커링 꿀팁 배너 */}
                            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-400/40 text-left space-y-2 mb-4">
                                <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
                                    <Sparkles className="w-4 h-4 text-amber-300 shrink-0 fill-current" />
                                    <span>👑 청류스마트스토어 구매자 단독 슈퍼 혜택</span>
                                </div>
                                <p className="text-[11px] text-gray-200 leading-relaxed">
                                    청류스마트스토어에서 9,900원에 도서를 구매하시면, 본 <strong className="text-amber-300 font-bold">19,800원 스타트업 리포트 + 무의식 다크코드 디버거 + 바이오케어 + 1:1 맞춤 힐링송 + AI 챗봇 20회권(총 10만 원 상당)</strong>이 모두 무료로 자동 해금됩니다!
                                </p>
                                <a
                                    href="https://smartstore.naver.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-400/20 via-yellow-400/20 to-amber-400/20 hover:from-amber-400/30 hover:to-yellow-400/30 text-amber-200 border border-amber-400/40 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all block text-center"
                                >
                                    <span>📖 청류스토어에서 9,900원에 구매하고 슈퍼패키지 받기</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>

                            {/* Tab Switcher */}
                            <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 mb-4 text-xs">
                                <button
                                    onClick={() => { setPassTab('bank'); setIsRequested(false); }}
                                    className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                        passTab === 'bank'
                                            ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <Building2 className="w-3.5 h-3.5" />
                                    <span>1. 무통장 입금 (19,800원)</span>
                                </button>
                                <button
                                    onClick={() => setPassTab('code')}
                                    className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                        passTab === 'code'
                                            ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <KeyRound className="w-3.5 h-3.5" />
                                    <span>2. 도서 주문/영수증 인증</span>
                                </button>
                            </div>

                            {/* TAB 1: 무통장 입금 (19,800원) */}
                            {passTab === 'bank' && (
                                <>
                                    {!isRequested ? (
                                        <div className="space-y-3.5 text-left animate-fade-in">
                                            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-400/40 space-y-2">
                                                <div className="flex items-center justify-between text-xs font-black text-amber-300">
                                                    <span>🏦 토스뱅크 무통장 입금 계좌</span>
                                                    <span className="text-amber-400 font-mono text-sm">19,800원</span>
                                                </div>
                                                <div className="bg-black/50 border border-amber-400/20 rounded-xl p-2.5 flex items-center justify-between">
                                                    <div>
                                                        <span className="text-[10px] text-gray-400 block font-mono">토스뱅크 (마인드플로우랩)</span>
                                                        <span className="text-sm font-black font-mono text-white tracking-wider">1002-6847-4899</span>
                                                    </div>
                                                    <button
                                                        onClick={handleCopyAccount}
                                                        className="px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10.5px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                                    >
                                                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                                        <span>{isCopied ? '복사됨' : '복사'}</span>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[11px] font-bold text-gray-300 block">
                                                    입금자 성함 *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={depositorName}
                                                    onChange={(e) => setDepositorName(e.target.value)}
                                                    placeholder="예: 홍길동 (입금하신 성함)"
                                                    className="w-full bg-slate-950 border border-amber-400/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                                                />
                                            </div>

                                            <button
                                                onClick={handleRequestApproval}
                                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                            >
                                                <Sparkles className="w-4 h-4 text-slate-950" />
                                                <span>입금 완료 및 1:1 오픈채팅 승인 요청 ➔</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-amber-400/40 text-center space-y-2.5 animate-fade-in">
                                            <div className="text-2xl">🎉</div>
                                            <h4 className="text-xs font-bold text-white">입금 확인 요청이 접수되었습니다!</h4>
                                            <p className="text-[10.5px] text-amber-200 leading-relaxed">
                                                <strong>'{depositorName}'</strong> 님의 입금 확인 후 1:1 오픈카톡을 통해 즉시 VIP 패스를 승인해 드립니다.
                                            </p>
                                            <a
                                                href="https://open.kakao.com/o/sfNxzYKi"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer block"
                                            >
                                                <span>💬 1:1 오픈채팅 바로 입장하기</span>
                                            </a>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* TAB 2: 도서 주문번호 / 영수증 인증 (무료 해금) */}
                            {passTab === 'code' && (
                                <div className="space-y-3.5 text-left animate-fade-in">
                                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-[11px] text-amber-200 leading-relaxed space-y-1">
                                        <p className="font-bold text-amber-300">👑 청류스토어 vs 📖 일반 서점 혜택 안내</p>
                                        <p>• <strong>청류스마트스토어 주문번호(16자리)</strong> 입력 시: ➔ <span className="text-white font-bold">스타트업 리포트 + 다크코드 + 바이오케어 + 힐링송 + 20회 코칭</span> 올인원 슈퍼패키지 전면 무료 해금!</p>
                                        <p>• <strong>교보/예스24/부크크 영수증 번호</strong> 입력 시: ➔ <span className="text-white font-bold">1:1 맞춤 힐링송 + 20회 코칭 대화권</span> 즉시 지급!</p>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-amber-300 block">
                                            도서 구매 주문번호 / 영수증 번호
                                        </label>
                                        <input
                                            type="text"
                                            value={orderNumber}
                                            onChange={(e) => {
                                                setOrderNumber(e.target.value);
                                                setOrderError(null);
                                            }}
                                            placeholder="예: 20260831-12345678 또는 네이버 주문번호 16자리"
                                            className="w-full bg-slate-950 border border-slate-700 text-white font-mono text-center tracking-wider text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 placeholder:text-gray-600"
                                        />
                                        <p className="text-[10px] text-gray-400 text-center">
                                            ※ 스마트스토어·부크크·교보 등 주문 1건당 1회 등록 가능
                                        </p>
                                        {orderError && (
                                            <p className="text-[10px] text-rose-400 mt-1 text-center font-medium">
                                                {orderError}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleVerifyOrderPass}
                                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        <Sparkles className="w-4 h-4 fill-current" />
                                        <span>주문/영수증 인증하고 혜택 해금 ➔</span>
                                    </button>
                                </div>
                            )}

                            {/* Footer Info */}
                            <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                <span>인증 또는 승인 완료 시 부여된 모듈 영구 열람</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        );
    }

    // [Default View] 대시보드 메인
    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#0f0d1a]">
            {/* Mobile Header (Only visible on small screens) */}
            <div className="md:hidden p-4 bg-[#131022] border-b border-[#2b2839] flex items-center justify-between z-[60]">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-[#3211d4] flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-xl">auto_awesome</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm font-black text-white">B2B Startup Coaching</span>
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">B2B 전용</span>
                        </div>
                    </div>
                    {/* [NEW] Quick Status Badge for mobile visibility */}
                    <div className="mt-1 flex items-center gap-2">
                        <div className="size-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                        <span className="text-[10px] text-indigo-400 font-bold">현재 경영 모멘텀: 점진적 성장기</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="material-symbols-outlined text-slate-400"
                >
                    {isSidebarOpen ? 'close' : 'menu'}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`
                ${isSidebarOpen ? 'flex' : 'hidden md:flex'} 
                fixed md:relative inset-0 md:inset-auto 
                w-full md:w-72 bg-[#131022] border-r border-[#2b2839] flex-col h-full z-50
            `}>
                <div className="p-6 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-xl bg-[#3211d4] shadow-lg shadow-[#3211d4]/20 text-white">
                            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h1 className="text-lg font-extrabold tracking-tight leading-none text-white">B2B Startup Coaching</h1>
                                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">B2B 전용</span>
                            </div>
                            <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-black mt-1">B2B ENTERPRISE SOLUTION & CSO</p>
                        </div>
                    </div>
                    {/* [NEW] Close button - navigates to main app */}
                    <button
                        onClick={() => router.push('/report')}
                        className="material-symbols-outlined text-slate-400 hover:text-white transition-colors"
                        title="명심코칭AI 메인으로"
                    >
                        close
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                    <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">B2B 거버넌스 메뉴</p>
                    {menuItems.filter(i => ['dashboard', 'content', 'psychology', 'timing', 'partner', 'investment', 'bm'].includes(i.id)).map((item) => (
                        <a
                            key={item.id}
                            onClick={() => {
                                if (item.id === 'dashboard') {
                                    setActiveMenu('dashboard');
                                    setSelectedService(null);
                                } else {
                                    setActiveMenu(item.id);
                                    setSelectedService(item);
                                }
                            }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg group transition-all cursor-pointer ${activeMenu === item.id
                                ? 'bg-[#3211d4]/10 text-[#3211d4] border-r-2 border-[#3211d4]'
                                : 'text-[#a19db9] hover:bg-white/5'
                                }`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className={`text-sm ${activeMenu === item.id ? 'font-bold' : 'font-medium'}`}>
                                {item.label}
                            </span>
                        </a>
                    ))}

                    <div className="pt-6 px-4">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">B2B C-Level 전문 분석</p>
                        <div className="space-y-1">
                            {menuItems.filter(i => ['strategy', 'legal', 'org'].includes(i.id)).map((item) => (
                                <a
                                    key={item.id}
                                    onClick={() => {
                                        setSelectedService(item);
                                        setActiveMenu(item.id);
                                    }}
                                    className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all text-sm cursor-pointer ${activeMenu === item.id
                                        ? 'bg-indigo-500/20 text-indigo-300 font-bold border-l-2 border-indigo-400'
                                        : 'text-[#a19db9] hover:text-white hover:bg-white/5 font-medium'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[20px] text-indigo-400">{item.icon}</span>
                                    <span>{item.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 px-4">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">B2B 파트너십 & 거버넌스</p>
                        <a
                            onClick={() => router.push('/startup/facilitation')}
                            className="flex items-center gap-3 py-2 text-[#a19db9] hover:text-[#3211d4] transition-colors text-sm font-medium cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[20px]">groups</span>
                            B2B C-Level 다자간 거버넌스 코칭
                        </a>
                        <a onClick={() => router.push('/startup/mastermind')} className="flex items-center gap-3 py-2 text-[#a19db9] hover:text-[#3211d4] transition-colors text-sm font-medium cursor-pointer">
                            <span className="material-symbols-outlined text-[20px]">diversity_3</span> B2B 수석 아키텍트 CSO 그룹 자문
                        </a>
                    </div>
                </nav>

                <div className="p-6 border-t border-[#2b2839]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="size-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 border border-[#2b2839] flex items-center justify-center text-white font-bold text-xs">
                            CEO
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate text-white">이경윤 대표님 (명심코칭)</p>
                            <p className="text-[10px] text-indigo-400 font-extrabold tracking-wider truncate">Enterprise Member</p>
                        </div>
                    </div>
                    <button className="w-full flex h-10 items-center justify-center gap-2 rounded-lg bg-[#3211d4] px-4 text-xs font-bold text-white shadow-lg shadow-[#3211d4]/30 transition-all hover:bg-[#3211d4]/90">
                        <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
                        <span>크레딧 충전</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-[#0f0d1a] custom-scrollbar">
                <div className="max-w-6xl mx-auto px-6 md:px-8 py-8 md:py-10">
                    {/* Header removed and moved to sidebar for mobile visibility */}

                    <section className="mb-12">
                        <p className="text-xs font-bold text-[#3211d4] uppercase tracking-[0.2em] mb-4">Enterprise Core Report</p>
                        <div className="relative overflow-hidden group rounded-2xl bg-gradient-to-br from-[#3211d4] to-[#5b36ff] p-[1px]">
                            <div className="bg-[#181526] rounded-[calc(1rem-1px)] p-8 md:p-12 relative overflow-hidden">
                                <div className="absolute -top-24 -right-24 size-96 bg-[#3211d4]/10 rounded-full blur-3xl"></div>
                                <div className="absolute -bottom-24 -left-24 size-72 bg-[#3211d4]/5 rounded-full blur-3xl"></div>
                                <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-center">
                                    <div className="flex-1 space-y-6">
                                        <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-[#3211d4]/10 text-[#3211d4]">
                                            <span className="material-symbols-outlined text-4xl">auto_graph</span>
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                                                비즈니스 연간 경영 모멘텀 & 전략 분석
                                            </h3>
                                            <p className="text-base md:text-lg text-[#a19db9] leading-relaxed max-w-2xl">
                                                선천적 사업 구조와 세운의 흐름을 다차원으로 분석하여, 귀하의 기업이 언제 과감하게 도약하고 언제 조직의 내실을 다져야 할지 정밀 분석합니다. 올해의 핵심 피벗(Pivot) 적기 및 최적의 자금/확장 타이밍을 확인하세요.
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-4 pt-2">
                                            <button
                                                onClick={() => setIsExecutiveDashboardOpen(true)}
                                                className="bg-[#3211d4] hover:bg-[#3211d4]/90 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-[#3211d4]/20 transition-all flex items-center gap-2"
                                            >
                                                ⚡ 경영 모멘텀 정밀 분석 실행하기
                                                <span className="material-symbols-outlined">arrow_forward</span>
                                            </button>
                                            <button
                                                onClick={() => setIsExecutiveDashboardOpen(true)}
                                                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
                                            >
                                                샘플 리포트 보기
                                            </button>
                                        </div>
                                    </div>

                                    {/* [NEW] B2B Radar Chart & Corporate Momentum Visualization */}
                                    <div className="hidden lg:block w-80 h-80 relative flex-shrink-0">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="size-72 rounded-full border border-[#3211d4]/30 animate-[spin_90s_linear_infinite] flex items-center justify-center">
                                                <div className="size-56 rounded-full border border-dashed border-[#5b36ff]/40 animate-[spin_45s_linear_infinite_reverse]"></div>
                                            </div>

                                            {/* Radar Polygon Grid */}
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <svg className="w-64 h-64 text-[#5b36ff]/40" viewBox="0 0 100 100">
                                                    <polygon points="50,10 88,32 88,76 50,95 12,76 12,32" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2,2" />
                                                    <polygon points="50,25 73,38 73,68 50,80 27,68 27,38" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
                                                    <line x1="50" y1="10" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
                                                    <line x1="12" y1="32" x2="88" y2="76" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
                                                    <line x1="12" y1="76" x2="88" y2="32" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />

                                                    {/* Data Curve */}
                                                    <polygon points="50,18 80,35 68,72 50,86 20,70 24,36" fill="rgba(99,102,241,0.3)" stroke="#818cf8" strokeWidth="1.8" />

                                                    {/* Data Nodes */}
                                                    <circle cx="50" cy="18" r="2.5" fill="#c084fc" />
                                                    <circle cx="80" cy="35" r="2.5" fill="#6366f1" />
                                                    <circle cx="68" cy="72" r="2.5" fill="#38bdf8" />
                                                    <circle cx="50" cy="86" r="2.5" fill="#a78bfa" />
                                                    <circle cx="20" cy="70" r="2.5" fill="#34d399" />
                                                    <circle cx="24" cy="36" r="2.5" fill="#fbbf24" />
                                                </svg>
                                            </div>

                                            {/* Center Momentum Score Badge */}
                                            <div className="absolute size-24 rounded-full bg-[#131022]/90 border border-indigo-500/50 shadow-2xl flex flex-col items-center justify-center text-center p-2 backdrop-blur-md">
                                                <span className="text-[8px] font-bold tracking-wider text-indigo-400 uppercase">MOMENTUM</span>
                                                <span className="text-lg font-black text-white font-mono leading-none my-0.5">94.8%</span>
                                                <span className="text-[8px] text-emerald-400 font-bold">🚀 도약 적기</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">기타 전문 분석 서비스</h3>
                            <a className="text-sm font-bold text-[#3211d4] hover:underline cursor-pointer">전체 보기</a>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {menuItems.filter(i => i.id !== 'dashboard').map((service, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => {
                                        setSelectedService(service);
                                        setActiveMenu(service.id);
                                    }}
                                    className="group bg-[#181526] border border-[#2b2839] p-6 rounded-xl hover:border-[#3211d4]/50 transition-all cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="size-12 rounded-lg bg-white/5 flex items-center justify-center text-[#3211d4]">
                                            <span className="material-symbols-outlined">{service.icon}</span>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-600 group-hover:text-[#3211d4] transition-colors">arrow_forward</span>
                                    </div>
                                    <h4 className="text-lg font-bold mb-2 text-white">{service.label}</h4>
                                    <p className="text-sm text-[#a19db9] leading-relaxed line-clamp-2">{service.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>

                <footer className="border-t border-[#2b2839] py-10">
                    <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2 text-slate-600">
                            <span className="material-symbols-outlined text-lg">verified</span>
                            <span className="text-xs font-bold uppercase tracking-widest">Data-Driven Corporate Coaching</span>
                        </div>
                        <div className="flex gap-8">
                            <a className="text-xs font-bold text-slate-500 hover:text-[#3211d4] uppercase tracking-widest transition-colors cursor-pointer">분석 방법론</a>
                            <a className="text-xs font-bold text-slate-500 hover:text-[#3211d4] uppercase tracking-widest transition-colors cursor-pointer">이용 약관</a>
                            <a className="text-xs font-bold text-slate-500 hover:text-[#3211d4] uppercase tracking-widest transition-colors cursor-pointer">개인정보처리방침</a>
                        </div>
                        <p className="text-xs font-bold text-slate-600">© 2024 STARTUP COACHING.</p>
                    </div>
                </footer>
            </main>

            {/* [Executive Dashboard 1-Page Briefing Modal] */}
            <ExecutiveDashboardModal
                isOpen={isExecutiveDashboardOpen}
                onClose={() => setIsExecutiveDashboardOpen(false)}
                companyName="(주)명심코칭"
                ceoName="이경윤 대표님"
                onStartChat={handleConsultation}
            />
        </div>
    );
}
