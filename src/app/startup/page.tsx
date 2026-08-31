'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import ExecutiveDashboardModal from '@/components/startup/ExecutiveDashboardModal';
import { ShieldCheck, Copy, Check, Building2, KeyRound, Sparkles, BookOpen, ExternalLink, Lock } from 'lucide-react';

export default function StartupDashboard() {
    const router = useRouter();
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [selectedService, setSelectedService] = useState<any>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isExecutiveDashboardOpen, setIsExecutiveDashboardOpen] = useState(false);

    // [New] 팝업 해설 및 결제/인증 잠금 상태
    const [selectedHighlight, setSelectedHighlight] = useState<any>(null);
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
                    depositorName: depositorName || '도서 구매 독자'
                })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('myeongsim_paid_user', 'true');
                    localStorage.setItem('myeongsim_startup_unlocked', 'true');
                    localStorage.setItem('myeongsim_total_user_messages', '0');
                    localStorage.setItem('myeongsim_verified_order', cleaned);
                }
                setIsUnlocked(true);
                setIsStartupPassOpen(false);
                alert('🎉 도서 구매 인증이 완료되었습니다! 19,800원 스타트업 심층 리포트 무료 열람 및 20회 VIP 코칭 대화가 활성화되었습니다.');
                if (pendingHighlight) {
                    setSelectedHighlight(pendingHighlight);
                }
            } else {
                setOrderError(data.message || '유효하지 않은 주문/영수증 번호이거나 이미 등록된 번호입니다.');
            }
        } catch (e) {
            console.error('Order verify error:', e);
            if (cleaned.length >= 8) {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('myeongsim_paid_user', 'true');
                    localStorage.setItem('myeongsim_startup_unlocked', 'true');
                }
                setIsUnlocked(true);
                setIsStartupPassOpen(false);
                alert('🎉 도서 구매 인증이 완료되었습니다! 스타트업 심층 리포트가 해금되었습니다.');
                if (pendingHighlight) {
                    setSelectedHighlight(pendingHighlight);
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
        }
    ];

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
                            <h1 className="text-lg font-extrabold tracking-tight leading-none text-white">Startup Coaching</h1>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Enterprise Solution</p>
                        </div>
                    </div>
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">컨설팅 메뉴</p>
                        {menuItems.map((item) => (
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
                        <div className="pt-8 px-4">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">특별 기능</p>
                            <a onClick={() => router.push('/startup/facilitation')} className="flex items-center gap-3 py-2 text-[#a19db9] hover:text-[#3211d4] transition-colors text-sm font-medium cursor-pointer">
                                <span className="material-symbols-outlined text-[20px]">groups</span> 창업팀 다자간 코칭
                            </a>
                            <a onClick={() => router.push('/startup/mastermind')} className="flex items-center gap-3 py-2 text-[#a19db9] hover:text-[#3211d4] transition-colors text-sm font-medium cursor-pointer">
                                <span className="material-symbols-outlined text-[20px]">diversity_3</span> 수석 아키텍트 그룹 자문
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
                                            Enterprise Diagnosis Core
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
                                                본 분석에서 제공되는 3대 핵심 리포트
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

                                {/* Right Visual: CEO 6-Power Radar Matrix & Business Fit */}
                                <div className="lg:col-span-5 bg-[#131022] border border-[#2b2839] rounded-2xl p-5 md:p-6 relative overflow-hidden flex flex-col justify-between min-h-[440px]">
                                    {/* Card Header */}
                                    <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-indigo-400 text-base">radar</span>
                                            <span className="text-xs font-black text-white uppercase tracking-wider">창업가 6대 역량 파워 매트릭스</span>
                                        </div>
                                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                            AI 역량 진단
                                        </span>
                                    </div>

                                    {/* Central 6-Axis CEO Power Radar Chart with Clear Labels */}
                                    <div className="relative py-2 flex flex-col items-center justify-center">
                                        <div className="w-full max-w-[280px] aspect-square relative flex items-center justify-center">
                                            {/* Radar SVG Grid & Polygon */}
                                            <svg className="w-full h-full" viewBox="0 0 240 240">
                                                {/* Outer Guides */}
                                                <polygon points="120,30 198,75 198,165 120,210 42,165 42,75" fill="none" stroke="#2b2839" strokeWidth="1" />
                                                <polygon points="120,55 176,87 176,153 120,185 64,153 64,87" fill="none" stroke="#2b2839" strokeWidth="0.8" strokeDasharray="3,3" />
                                                <polygon points="120,80 154,100 154,140 120,160 86,140 86,100" fill="none" stroke="#2b2839" strokeWidth="0.5" />
                                                
                                                {/* Axis Lines */}
                                                <line x1="120" y1="120" x2="120" y2="30" stroke="#3730a3" strokeWidth="0.8" />
                                                <line x1="120" y1="120" x2="198" y2="75" stroke="#3730a3" strokeWidth="0.8" />
                                                <line x1="120" y1="120" x2="198" y2="165" stroke="#3730a3" strokeWidth="0.8" />
                                                <line x1="120" y1="120" x2="120" y2="210" stroke="#3730a3" strokeWidth="0.8" />
                                                <line x1="120" y1="120" x2="42" y2="165" stroke="#3730a3" strokeWidth="0.8" />
                                                <line x1="120" y1="120" x2="42" y2="75" stroke="#3730a3" strokeWidth="0.8" />

                                                {/* Filled Power Area (Calculated Polygon for 94, 92, 96, 91, 89, 88) */}
                                                <polygon
                                                    points="120,38 191,80 193,161 120,199 49,158 48,82"
                                                    fill="rgba(99, 102, 241, 0.28)"
                                                    stroke="#818cf8"
                                                    strokeWidth="2.2"
                                                />

                                                {/* Data Points */}
                                                <circle cx="120" cy="38" r="3.5" fill="#a855f7" stroke="#fff" strokeWidth="1" />
                                                <circle cx="191" cy="80" r="3.5" fill="#6366f1" stroke="#fff" strokeWidth="1" />
                                                <circle cx="193" cy="161" r="3.5" fill="#3b82f6" stroke="#fff" strokeWidth="1" />
                                                <circle cx="120" cy="199" r="3.5" fill="#06b6d4" stroke="#fff" strokeWidth="1" />
                                                <circle cx="49" cy="158" r="3.5" fill="#10b981" stroke="#fff" strokeWidth="1" />
                                                <circle cx="48" cy="82" r="3.5" fill="#f59e0b" stroke="#fff" strokeWidth="1" />
                                            </svg>

                                            {/* Axis Labels Placed Around the Radar */}
                                            <div className="absolute top-0 text-center">
                                                <span className="text-[10px] font-black text-purple-300 block">💡 혁신 기획</span>
                                                <span className="text-[9px] font-mono text-purple-400 font-bold">94점</span>
                                            </div>
                                            <div className="absolute top-[26%] right-0 text-right">
                                                <span className="text-[10px] font-black text-indigo-300 block">💰 자본/수익</span>
                                                <span className="text-[9px] font-mono text-indigo-400 font-bold">92점</span>
                                            </div>
                                            <div className="absolute bottom-[26%] right-0 text-right">
                                                <span className="text-[10px] font-black text-blue-300 block">⚡ 빠른 실행</span>
                                                <span className="text-[9px] font-mono text-blue-400 font-bold">96점</span>
                                            </div>
                                            <div className="absolute bottom-0 text-center">
                                                <span className="text-[10px] font-black text-cyan-300 block">📈 시장 확장</span>
                                                <span className="text-[9px] font-mono text-cyan-400 font-bold">91점</span>
                                            </div>
                                            <div className="absolute bottom-[26%] left-0 text-left">
                                                <span className="text-[10px] font-black text-emerald-300 block">👥 팀 리더십</span>
                                                <span className="text-[9px] font-mono text-emerald-400 font-bold">89점</span>
                                            </div>
                                            <div className="absolute top-[26%] left-0 text-left">
                                                <span className="text-[10px] font-black text-amber-300 block">🛡️ 멘탈 회복</span>
                                                <span className="text-[9px] font-mono text-amber-400 font-bold">88점</span>
                                            </div>

                                            {/* Center Badge */}
                                            <div className="absolute size-14 rounded-full bg-[#181526]/90 border border-indigo-500/50 flex flex-col items-center justify-center shadow-lg backdrop-blur-sm pointer-events-none">
                                                <span className="text-[8px] font-bold text-indigo-300 uppercase">CEO 파워</span>
                                                <span className="text-xs font-black text-white font-mono">92.5</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Real-time Matching Result Box */}
                                    <div className="mt-3 p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2 text-left">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300 font-bold flex items-center gap-1">
                                                <span>🎯 추천 비즈니스 적합도</span>
                                            </span>
                                            <span className="text-emerald-400 font-mono font-black">94.8% (최적 적합)</span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full w-[94.8%]"></div>
                                        </div>
                                        <div className="pt-1 text-[11px] space-y-1 text-slate-300">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-amber-400 font-bold">1순위:</span>
                                                <strong className="text-white">B2B 엔터프라이즈 SaaS / 솔루션</strong>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                <span className="text-indigo-400 font-bold">2순위:</span>
                                                <span>전문가 지식 플랫폼 & 데이터 서비스</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Security & Engine Footer */}
                                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                                        <span>ISO-27001 ENCRYPTED</span>
                                        <span>108 MATRIX AI ENGINE</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </main>

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
                                        const q = selectedHighlight.recommendedQuestion || selectedService.prompt;
                                        setSelectedHighlight(null);
                                        handleConsultation(q);
                                    }}
                                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#3211d4] via-indigo-600 to-[#5b36ff] hover:from-[#3211d4]/90 hover:to-[#5b36ff]/90 text-white font-extrabold text-xs shadow-lg shadow-[#3211d4]/30 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                                >
                                    <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform text-amber-300">bolt</span>
                                    <span>이 질문으로 AI 전담 코칭 바로 시작하기 ➔</span>
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
                                    <BookOpen className="w-4 h-4 text-amber-300 shrink-0" />
                                    <span>💡 도서 독자 전용 100% 무료 혜택 안내</span>
                                </div>
                                <p className="text-[11px] text-gray-200 leading-relaxed">
                                    정가 11,000원(할인가 <strong className="text-amber-300 font-bold">9,900원</strong>)에 도서를 구매하시면, 본 <strong className="text-white">19,800원 리포트 + 1:1 맞춤 힐링송 + AI 챗봇 20회권이 모두 무료로 자동 해금</strong>됩니다!
                                </p>
                                <a
                                    href="https://smartstore.naver.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/40 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all block text-center"
                                >
                                    <span>📖 9,900원에 도서 구매하고 전 혜택 받기</span>
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
                                    <span>2. 도서 인증 (무료)</span>
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
                                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-[11px] text-amber-200 leading-relaxed">
                                        📖 <strong>도서 구매 독자 전용 무료 혜택</strong><br />
                                        스마트스토어, 부크크, 교보문고 등의 <strong>구매 주문번호 또는 영수증 번호</strong>를 입력하시면 19,800원 스타트업 심층 리포트가 즉시 무료 해금됩니다.
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
                                            placeholder="예: 20260831-12345678 (주문/영수증 번호)"
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
                                        <span>주문/영수증 인증하고 무료 해금 ➔</span>
                                    </button>
                                </div>
                            )}

                            {/* Footer Info */}
                            <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                <span>인증 또는 승인 완료 시 스타트업 전 리포트 영구 열람</span>
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
                        <span className="text-sm font-black text-white">Startup Coaching</span>
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
                            <h1 className="text-lg font-extrabold tracking-tight leading-none text-white">Startup Coaching</h1>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Enterprise Solution</p>
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

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">컨설팅 메뉴</p>
                    {menuItems.map((item) => (
                        <a
                            key={item.id}
                            onClick={() => {
                                if (item.id === 'dashboard') {
                                    setActiveMenu('dashboard');
                                    setSelectedService(null);
                                } else {
                                    setActiveMenu(item.id);
                                    setSelectedService(item); // 바로 상세 보기로 이동
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

                    <div className="pt-8 px-4">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">특별 기능</p>
                        <a
                            onClick={() => router.push('/startup/facilitation')}
                            className="flex items-center gap-3 py-2 text-[#a19db9] hover:text-[#3211d4] transition-colors text-sm font-medium cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[20px]">groups</span>
                            창업팀 다자간 코칭
                        </a>
                        <a onClick={() => router.push('/startup/mastermind')} className="flex items-center gap-3 py-2 text-[#a19db9] hover:text-[#3211d4] transition-colors text-sm font-medium cursor-pointer">
                            <span className="material-symbols-outlined text-[20px]">diversity_3</span> 수석 아키텍트 그룹 자문
                        </a>
                    </div>

                    {/* [NEW] Status Section moved from main header for mobile visibility */}
                    <div className="pt-8 px-4 mt-4 border-t border-[#2b2839]/50">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">기업 컨설팅 대시보드</p>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <div className="flex items-start gap-3 text-indigo-400 mb-1">
                                <span className="material-symbols-outlined text-lg">insights</span>
                                <span className="text-xs font-bold">현재 경영 모멘텀</span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                                점진적 성장기 • 안정적 확장 단계
                            </p>
                            <div className="mt-3 text-[9px] text-slate-500 font-bold uppercase tracking-tight">
                                분석: 2일 전
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 px-4 pb-10">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">전문 분석 서비스</p>
                        <div className="space-y-2">
                            <a className="flex items-center gap-3 py-2 text-[#a19db9] hover:text-[#3211d4] transition-colors text-sm font-medium cursor-pointer">
                                <span className="material-symbols-outlined text-[20px]">analytics</span> 데이터 기반 전략 분석
                            </a>
                            <a className="flex items-center gap-3 py-2 text-[#a19db9] hover:text-[#3211d4] transition-colors text-sm font-medium cursor-pointer">
                                <span className="material-symbols-outlined text-[20px]">balance</span> 법률/행정 리스크 점검
                            </a>
                            <a className="flex items-center gap-3 py-2 text-[#a19db9] hover:text-[#3211d4] transition-colors text-sm font-medium cursor-pointer">
                                <span className="material-symbols-outlined text-[20px]">hub</span> 조직 구조 및 시스템 설계
                            </a>
                        </div>
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