import { NextResponse } from 'next/server';
import { calculateSaju } from '@/lib/saju/SajuEngine';
import { calculateMyeongsimProfile, parseBirthDate } from '@/utils/GeneKeyCalculator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// 오행 인터페이스 & 천간럇지지 매핑
// ---------------------------------------------------------------------------
interface SajuCharInfo {
  element: '목' | '화' | '토' | '금' | '수';
  isYang: boolean;
}

const SAJU_CHARS: Record<string, SajuCharInfo> = {
  '갑': { element: '목', isYang: true },
  '을': { element: '목', isYang: false },
  '병': { element: '화', isYang: true },
  '정': { element: '화', isYang: false },
  '무': { element: '토', isYang: true },
  '기': { element: '토', isYang: false },
  '경': { element: '금', isYang: true },
  '신': { element: '금', isYang: false },
  '임': { element: '수', isYang: true },
  '계': { element: '수', isYang: false },
  '자': { element: '수', isYang: true },
  '축': { element: '토', isYang: false },
  '인': { element: '목', isYang: true },
  '묘': { element: '목', isYang: false },
  '진': { element: '토', isYang: true },
  '사': { element: '화', isYang: false },
  '오': { element: '화', isYang: true },
  '미': { element: '토', isYang: false },
  '유': { element: '금', isYang: false },
  '술': { element: '토', isYang: true },
  '해': { element: '수', isYang: false },
};

const JIJI_SHIN: SajuCharInfo = { element: '금', isYang: true };

// ---------------------------------------------------------------------------
// 64 게이트 맵 (index 0 = placeholder, 1–64 = 실제 게이트)
// ---------------------------------------------------------------------------
const GATES_MAP: { name: string; keyword: string }[] = [
  { name: '', keyword: '' },
  { name: '자기세계의 창조', keyword: '자신만의 독창적인 세계를 표현하려는 강렬한 의지' },
  { name: '큰 방향의 수신자', keyword: '우주의 리듬에 귀 기울여 방향을 감지하는 직관' },
  { name: '새벽의 첫 발돋움', keyword: '혼란 속에서도 새로운 질서의 싹을 티우는 시작의 에너지' },
  { name: '논리적 해답 공식', keyword: '복잡한 문제를 단계별로 풀어내는 정돈된 사고 체계' },
  { name: '자연 리듬의 기다림', keyword: '인위적으로 재촉하지 않고 때가 오면 움직이는 자연의 타이밍' },
  { name: '감정의 파도 조절', keyword: '격한 감정의 물살을 다스리며 친밀감의 경계를 지키는 능력' },
  { name: '민주적 리더십', keyword: '앞에 나서기보다 뒤에서 사람들의 방향을 이끄는 조율의 지혜' },
  { name: '독창적 기여', keyword: '남과 다른 나만의 색깔로 공동체에 가치를 보태는 방식' },
  { name: '디테일 집중력', keyword: '아주 작고 세밀한 부분에도 놓치지 않고 끈질기게 파고드는 힘' },
  { name: '자기답게 사는 길', keyword: '남의 시선을 의식하지 않고 본연의 모습 그대로 살아가는 용기' },
  { name: '평화로운 아이디어', keyword: '조용히 마음속에 떠오르는 영감과 상상의 세계' },
  { name: '신중한 표현', keyword: '말과 행동을 멈추고 적절한 때를 기다려 내뼉는 절제된 소통' },
  { name: '경청과 증인', keyword: '타인의 이야기를 깊이 들어주며 삶의 지혜를 수집하는 귀' },
  { name: '풍요의 기술', keyword: '자원과 재능을 활용하여 물질적 풍요를 만들어내는 동력' },
  { name: '겸손의 극단', keyword: '다양한 사람과 리듬을 포용하며 큰 그릇으로 담아내는 관용' },
  { name: '열정적 숙련', keyword: '반복적인 연습과 몰입을 통해 기술을 완성해 가는 과정' },
  { name: '의견과 주장', keyword: '논리적 근거를 바탕으로 자신의 관점을 펼치는 설득력' },
  { name: '패턴 교정', keyword: '잘못된 것을 발견하고 더 나은 방향으로 바로잡으려는 본능' },
  { name: '예세한 감정 공감', keyword: '주변 사람들이 필요한 것까지 눈치로 알아채는 감각' },
  { name: '지금 이 순간 현존', keyword: '과거와 미래의 불안을 지우고 오직 현재에 깨어있는 의식' },
  { name: '공정한 바로세우기', keyword: '누구든 울타리가 넘도록 바운더리 질서와 기율을 세우는 주권' },
  { name: '따뜻한 감성 품격', keyword: '눈치 보지 않는 당당한 멋에 깃드는 매너와 아름다운 매력' },
  { name: '복잡한 것 단도직입 깎기', keyword: '어렵고 복잡한 정보를 핵심만 뽑아내 깔끔하게 정리하는 능력' },
  { name: '내적 숙고 성찰', keyword: '실패와 어두운 밤을 거쳐 결국 내 마음의 진짜 참뜻을 깨닫는 힘' },
  { name: '조건 없는 참사랑', keyword: '어떠한 편견과 조건 없이 상대의 입장까지 감싸주는 순수한 사랑의 에너지' },
  { name: '마음 읽는 비즈니스', keyword: '상대방의 마음과 본능을 간파하여 큰 가치를 거래하는 기획력' },
  { name: '생명 돌봄과 양육', keyword: '내 곡의 사람들의 생명을 건강하게 자라게 하려 정성을 가득 담는 힘' },
  { name: '의미 찾는 모험', keyword: '삶의 깊은 의미를 찾기 위해 위험도 감수하며 부딪히는 모험 정신' },
  { name: '끝까지 해내는 헌신', keyword: '한번 맡은 일은 끝까지 밀고 나가는 뚝심과 몰입의 힘' },
  { name: '운명적인 불꽃 감정', keyword: '비록 현실 벽에 막히더라도 새로운 꿈을 꾸며 가슴을 채우는 열정' },
  { name: '권위 있는 설득', keyword: '강압 없이 자연스러운 리더십으로 사람들을 부드럽게 이끄는 영향력' },
  { name: '한결같은 지키기', keyword: '트렌드가 바뀌고 세상이 변해도 내 고유한 뿌리를 흔들림 없이 지키는 지속성' },
  { name: '고요한 숙고 은퇴', keyword: '불필요한 참견을 멈추고 고요한 나만의 방으로 한 걸음 물러나 충전하는 지혜' },
  { name: '바른 힘의 사용', keyword: '누구를 짓밟지 않고 내 주체적인 독립성을 건강하게 지켜내는 진짜 힘' },
  { name: '경험을 통한 진보', keyword: '수많은 시행착오와 모험을 밟고 올라가 결국 인생을 더 높은 곳으로 비상시키는 힘' },
  { name: '어둠 속의 빛 준비', keyword: '어둠과 위기 속에서도 미래의 빛을 품고 기다리는 인내의 힘' },
  { name: '가족 챙기기', keyword: '가족과 공동체를 따뜻한 우정과 책임감으로 끈끈하게 지켜내는 힘' },
  { name: '정의로운 투사', keyword: '내 주권과 신념을 위해 부조리에 맞서 싸우는 투지' },
  { name: '돌파의 촉발자', keyword: '막힌 관계나 삶의 흐름을 본능적 추진력으로 시원하게 뚚어버리는 기운' },
  { name: '자유로운 해방', keyword: '과거의 무거운 짐과 족쇄를 후후 벗어던지는 자유' },
  { name: '시작의 에너지 충전', keyword: '새로운 시작을 위해 생각과 감각을 한 덩어리로 모아 축적하는 한계' },
  { name: '풍요로운 성장의 마침', keyword: '한번 시작한 일을 끝까지 성장시켜 풍성하게 마무리하는 번영' },
  { name: '직관의 돌파구', keyword: '복잡한 추론 없이 한순간에 떠오르는 진실의 통찰' },
  { name: '본능의 세포기억', keyword: '과거 사람들의 생존 노하우를 세포 깊이 기억하여 경계하는 직감' },
  { name: '사람 모으는 구심점', keyword: '자연스러운 포용력과 매력으로 주변에 사람과 자원을 자연스럽게 끌어모으는 힘' },
  { name: '온몸으로 부딪히는 삶', keyword: '머리로 고민하지 않고 몸이 가리키는 방향으로 직접 뛰어들어 체험하는 힘' },
  { name: '해석의 마스터키', keyword: '꾸이고 어두운 과거의 아픈 기억을 성찰을 통해 삶의 해석으로 전환하는 힘' },
  { name: '무의식의 마르지 않는 샘물', keyword: '끝도 없이 마르지 않는 깊고 신비로운 마음의 지식과 감각' },
  { name: '판을 새로 짜는 혁신', keyword: '더 이상 통하지 않는 낡은 구조를 깨고 새 판을 짜는 혁명가 기질' },
  { name: '영적 뼈대 구조', keyword: '양보할 수 없는 삶의 뼈대가 되는 공명 규칙과 도덕적 가치관' },
  { name: '각성 촉발의 천둥', keyword: '안주하는 나에게 충격을 주어 안일한 마음을 한순간에 일깨우는 깨달음의 불꽃' },
  { name: '움직이지 않는 묵직함', keyword: '세상이 시끄럽게 흔들려도 바위처럼 고요하게 한자리를 굳건히 지키는 힘' },
  { name: '첫단추 첫발 행진', keyword: '서두르지 않고 기초부터 벽돌을 한 장 한 장 쌓아 거대한 것을 짓는 인내' },
  { name: '마음의 성취 야망', keyword: '가장 낮은 자리에서 출발하더라도 결국에는 최고봉에 이르겠다는 강인한 야망' },
  { name: '마음의 멜로디', keyword: '현실의 필요보다 내 가슴속에 먼저 울려퍼지는 감정의 리듬을 신뢰하는 힘' },
  { name: '인생 여행 이야기꾼', keyword: '삶 곳곳에서 격은 수많은 경험을 감동적인 말로 전하는 스토리텔링' },
  { name: '바람결 같은 직감', keyword: '소리 없이 다가오는 미래의 직관적 메시지를 감각적으로 빠르게 캐치하는 귀' },
  { name: '삶의 기쁨 활력소', keyword: '특별한 이유가 없더라도 살아있음 자체만으로도 온몸에 충만한 에너지가 되는 활력' },
  { name: '장벽 허물기와 융합', keyword: '사람 사이의 보이지 않는 벽을 한숨에 부수고 친밀하게 섞이는 결합력' },
  { name: '한계의 지렛대 수용', keyword: '주어진 제약을 장애물이라 여기지 않고 슬기롭게 발판 삼아 뛰어넘는 수용력' },
  { name: '내면 우주 사색', keyword: '우주가 굴러가는 거시적인 원리와 인간 본성의 원리를 성찰하는 탐색가' },
  { name: '현실의 핵심 과학', keyword: '누구도 반박할 수 없는 논리를 배제하고 딱딱한 사실과 수치를 원리적으로 꿰어내는 힘' },
  { name: '아름다운 의심과 해결', keyword: '정말로 찜찜함과 의심을 끝까지 깔끔하게 마침표 찍고 문을 닫는 종결력' },
  { name: '운명 속의 가능성', keyword: '비록 지금은 안개 속처럼 뿌옇게 보이더라도 반드시 길이 있음을 신뢰하는 마음' },
];

// ---------------------------------------------------------------------------
// 공망(空亡) 계산
// ---------------------------------------------------------------------------
function getGongWang(dayGan: string, dayJi: string): string[] {
  const stemOrder = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
  const branchOrder = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

  const stemIdx = stemOrder.indexOf(dayGan);
  const branchIdx = branchOrder.indexOf(dayJi);
  if (stemIdx === -1 || branchIdx === -1) return [];

  const headBranchIdx = ((branchIdx - stemIdx) % 12 + 12) % 12;
  const headKey = '갑' + branchOrder[headBranchIdx];

  const gongWangByHead: Record<string, string[]> = {
    '갑자': ['술', '해'],
    '갑인': ['자', '축'],
    '갑진': ['인', '묘'],
    '갑오': ['진', '사'],
    '갑신': ['오', '미'],
    '갑술': ['신', '유'],
  };

  return gongWangByHead[headKey] ?? [];
}

// ---------------------------------------------------------------------------
// 오행 생극(生剔) 관계
// ---------------------------------------------------------------------------
const GENERATE_MAP: Record<string, string> = {
  '목': '화', '화': '토', '토': '금', '금': '수', '수': '목',
};
const CONTROL_MAP: Record<string, string> = {
  '목': '토', '토': '수', '수': '화', '화': '금', '금': '목',
};

// ---------------------------------------------------------------------------
// POST 핸들러
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      birthDate,
      birthTime,
      calendarType,
      gender,
      userName,
    } = body as {
      userId?: string;
      birthDate?: string;
      birthTime?: string;
      calendarType?: string;
      gender?: string;
      userName?: string;
    };

    if (!birthDate) {
      return NextResponse.json(
        { success: false, error: '생년월일(birthDate)은 필수 항목입니다.' },
        { status: 400 },
      );
    }

    const effectiveTime = birthTime || '12:00';
    const effectiveCalendar = (calendarType === 'lunar' ? 'lunar' : 'solar') as 'solar' | 'lunar';
    const effectiveGender = (gender === 'female' ? 'female' : 'male') as 'male' | 'female';

    const saju = calculateSaju(birthDate, effectiveTime, effectiveCalendar, effectiveGender);
    const pillars = (saju as any).fourPillars;

    const allChars: string[] = [
      pillars.year?.ganKor, pillars.year?.jiKor,
      pillars.month?.ganKor, pillars.month?.jiKor,
      pillars.day?.ganKor, pillars.day?.jiKor,
      pillars.time?.ganKor, pillars.time?.jiKor,
    ].filter(Boolean) as string[];

    const dayGan = pillars.day?.ganKor ?? '';
    const dayJi = pillars.day?.jiKor ?? '';

    const dayMasterInfo = SAJU_CHARS[dayGan];
    const dayMasterElement = dayMasterInfo?.element ?? '목';

    const generatedByMaster = GENERATE_MAP[dayMasterElement]!;
    const controlledByMaster = CONTROL_MAP[dayMasterElement]!;
    const gwanElement = Object.keys(CONTROL_MAP).find((k) => CONTROL_MAP[k] === dayMasterElement) ?? '금';
    const inElement = Object.keys(GENERATE_MAP).find((k) => GENERATE_MAP[k] === dayMasterElement) ?? '수';

    const elementCounts: Record<string, number> = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 };
    for (const ch of allChars) {
      const info = SAJU_CHARS[ch];
      if (info) {
        elementCounts[info.element] += 1;
      }
    }

    const bigeop = elementCounts[dayMasterElement] ?? 0;
    const sigsang = elementCounts[generatedByMaster] ?? 0;
    const jaeseong = elementCounts[controlledByMaster] ?? 0;
    const gwanseong = elementCounts[gwanElement] ?? 0;
    const inseong = elementCounts[inElement] ?? 0;

    let seed = 0;
    for (const ch of allChars) {
      for (let i = 0; i < ch.length; i++) {
        seed += ch.charCodeAt(i);
      }
    }

    function scale(raw: number, maxRaw: number): number {
      return Math.min(98, Math.max(15, Math.round((raw / maxRaw) * 100)));
    }

    function clamp(min: number, max: number, v: number): number {
      return Math.min(max, Math.max(min, v));
    }

    const gongWangList = getGongWang(dayGan, dayJi);

    // ── 9 센터 ──
    interface CenterDef {
      id: string;
      name: string;
      scoreCalc: number;
      desc: string;
      darkCode: string;
      neuralCode: string;
      metaCode: string;
    }

    const centerDefs: CenterDef[] = [
      {
        id: 'inspiration',
        name: '영감 영역',
        scoreCalc: scale(inseong * 2.0 + (seed % 3) * 0.5, 9.0),
        desc: '끊임없이 밀려오는 의문과 영감을 포착하여 생각의 새로운 가능성을 여는 지적 발전소입니다.',
        darkCode: '답을 모르는 상황에 대한 막연한 조급함에 눌려, 끊임없이 불필요한 걱정거리를 찾아 헤매며 정신 에너지를 분산시킵니다.',
        neuralCode: '뇌의 호기심 및 사색 신경망이 일상적으로 풀리지 않는 미지에 반응하여 끊임없이 정보를 덮어쓰고 조합합니다.',
        metaCode: '답을 찾으려는 에고의 발버둥을 멈추고 텅 빈 고요를 수용할 때, 우주적 지혜가 순리대로 흘러드는 자각의 기쁨이 열립니다.',
      },
      {
        id: 'mind',
        name: '사고 영역',
        scoreCalc: scale(inseong * 1.5 + jaeseong * 1.0, 9.0),
        desc: '정보를 정밀하게 분류하고 일관된 논리와 생각의 구조를 설계하는 마인드 아키텍트입니다.',
        darkCode: '내 로직과 이론만 완벽하고 옳다는 아집에 갇혀, 타인의 시선과 생각을 적대시하고 스스로의 틀을 견고하게 방어합니다.',
        neuralCode: '기존의 학습 데이터와 경험적 패턴을 비교 연산하여, 어떤 상황이든 가장 논리적으로 이해할 수 있는 정답을 출력합니다.',
        metaCode: '복잡하게 엉킨 삶의 문제를 단 3초 만에 꿰뚫어 보는 본연의 명석함과 한계 없는 통찰의 맑은 거울이 깨어납니다.',
      },
      {
        id: 'expression',
        name: '소통 영역',
        scoreCalc: scale(sigsang * 2.5 + bigeop * 1.0, 11.0),
        desc: '내면의 주파수와 깨달음을 말과 행동을 통해 세상에 구현하고 물질화시키는 창조의 메시지 센터입니다.',
        darkCode: '주변의 시선과 관심을 갈구하여, 준비되지 않은 타이밍에 쓸데없는 말과 서두른 행동을 쏟아내며 에너지를 낭비합니다.',
        neuralCode: '가슴속에서 솟구치는 표현 욕구를 말과 글의 신경망으로 즉각 연결하여 타인에게 감동을 전하려는 회로가 작동합니다.',
        metaCode: '고요히 기다리다 적절한 우주적 타이밍에 내뱉는 말 한마디가 수천 명의 가슴을 울리는 진정한 삶의 이정표가 됩니다.',
      },
      {
        id: 'identity',
        name: '정체성 영역',
        scoreCalc: scale(inseong * 2.0 + bigeop * 1.5, 11.0),
        desc: '내 삶의 진정한 방향타와 존재의 근원적 아름다움을 감지하는 영혼의 나침반입니다.',
        darkCode: '나 자신의 참거울을 신뢰하지 못해, 끊임없이 밖에서 정답과 방향을 찾으려 헤매고 남들의 인정과 사랑을 구걸합니다.',
        neuralCode: '환경의 에너지 분포를 파악하여 내 존재가 어느 자리에서 가장 편안하고 빛나는지 적응성을 끊임없이 조율합니다.',
        metaCode: '그 어떤 외부 조건 없이도 본래 온전하고 사랑받아 마땅한 우주의 보석임을 깨닫고, 거울처럼 삶의 올바른 궤도를 밝혀냅니다.',
      },
      {
        id: 'willpower',
        name: '주체 영역',
        scoreCalc: scale(bigeop * 2.5 + gwanseong * 1.0, 11.0),
        desc: '진실한 약속을 기어코 지켜내고, 목표를 향해 한 걸음 한 걸음 성실하게 밀고 나가는 주체적 약속의 엔진입니다.',
        darkCode: '나의 가치를 남들에게 입증해 보이려고 억지로 무리한 약속을 남발하고 경쟁 회로를 돌리다 번아웃에 빠집니다.',
        neuralCode: '성취와 자존감을 지켜내려는 본능적 책임 반응이 신경 회로에 새겨져 성과 지향적 질주를 지속합니다.',
        metaCode: '에고의 억지 증명을 내려놓고 오직 가슴이 원하는 약속을 성실히 이행할 때, 주변의 자연스러운 존경과 영예를 획득합니다.',
      },
      {
        id: 'emotional',
        name: '감정 영역',
        scoreCalc: scale(sigsang * 2.0 + jaeseong * 1.5, 11.0),
        desc: '기쁨과 슬픔, 설렘과 아픔의 다채로운 파도를 겪어내며 마음을 정화하는 감수성의 깊은 바다입니다.',
        darkCode: '감정의 파도가 크게 흔들리는 요동 상태에서 성급히 판단하고 중대한 결정을 내렸다가 뼈아픈 후회를 겪습니다.',
        neuralCode: '감정 호르몬에 민감하게 반응하여 매 순간의 기분과 상대방의 파동을 빠르게 스캔하고 동조하려 합니다.',
        metaCode: '희로애락의 모든 요동을 고요한 거울 뒤로 한 걸음 물러나 비출 때, 사람들의 고통을 완전히 이해하는 대자비가 발현됩니다.',
      },
      {
        id: 'intuition',
        name: '통찰 영역',
        scoreCalc: scale(inseong * 2.0 + gwanseong * 1.5, 11.0),
        desc: '현실의 미세한 위협과 건강 신호를 찰나의 순간 직감적으로 알아채는 본능적 생존 센서입니다.',
        darkCode: '지나간 해묵은 공포나 상처의 기억에 매달려, 나에게 해로운 낡은 버릇이나 인연을 집착하듯 움켜쥐고 놓아주지 못합니다.',
        neuralCode: '오감과 환경의 안위 상태를 실시간 감시하며, 위협을 회피하고 안전을 도모하는 동물적 직관 회로가 상시 켜져 있습니다.',
        metaCode: '내 세포와 몸이 즉각적으로 전하는 소리 없는 알람에 깨어나, 위기에서 나뿐만 아니라 사람들의 생명을 건져내는 나침반이 됩니다.',
      },
      {
        id: 'lifeforce',
        name: '생체에너지 영역',
        scoreCalc: scale(bigeop * 2.0 + sigsang * 2.0, 11.0),
        desc: '어떤 일에 진심으로 몰입할 때 지치지 않고 번영의 씨앗을 가꾸어내는 창조적 생명 발전소입니다.',
        darkCode: '가슴속 내면의 소리가 "아니오"라고 속삭임에도 남들의 시선을 의식해 거절하지 못해 질질 끌려다니다 고갈됩니다.',
        neuralCode: '체력적 분배와 노동의 집중을 본능적 거부 및 동의 반응에 따라 자동으로 할당하고 관리하는 최하단 의식 엔진입니다.',
        metaCode: '가슴 뛰는 순리의 일과 연결되었을 때, 밤새워 작업해도 전혀 피로하지 않고 오히려 주변의 기운을 환희로 가득 채웁니다.',
      },
      {
        id: 'drive',
        name: '추진력 영역',
        scoreCalc: scale(gwanseong * 2.0 + jaeseong * 1.5, 11.0),
        desc: '마감 직전의 팽팽한 압박과 스트레스를 기적적인 집중력과 돌파 에너지로 전환하는 추진 가속 페달입니다.',
        darkCode: '일어나지 않은 미래에 대해 혼자 지레 조급함을 내며 설익은 서두름으로 일을 망치거나 주변을 강박적으로 닦달합니다.',
        neuralCode: '마감 압박과 긴장 호르몬의 유입 속에서 오히려 두뇌 회전 속도를 높이고 신속하게 해법을 조합해내는 회로입니다.',
        metaCode: '그 어떤 거센 폭풍우 속에서도 흔들림 없는 태산 같은 묵직함으로, 스트레스를 고요의 동력으로 가볍게 치환해 버립니다.',
      },
    ];

    const centers = centerDefs.map((c) => {
      const status = c.scoreCalc >= 60 ? 'DEFINED' : 'OPEN';
      return {
        id: c.id,
        name: c.name,
        score: c.scoreCalc,
        status,
        desc: c.desc,
        darkCode: c.darkCode,
        neuralCode: c.neuralCode,
        metaCode: c.metaCode,
      };
    });

    // ── 26 하늘의 성정 활성화 (정밀 천문 계산기 연동) ──
    const parsedDate = parseBirthDate(birthDate, effectiveTime);
    const myeongsimProfile = calculateMyeongsimProfile(parsedDate);
    const { conscious, unconscious } = myeongsimProfile;

    const PLANETS_DEFS = [
      { id: 'p_sun', label: '천명 미션 [의식 태양]', pos: conscious.sun },
      { id: 'p_earth', label: '현재의 그라운딩 [의식 지구]', pos: conscious.earth },
      { id: 'd_sun', label: '무의식적 사명 [무의식 태양]', pos: unconscious.sun },
      { id: 'd_earth', label: '무의식적 목적 [무의식 지구]', pos: unconscious.earth },
      { id: 'd_south_node', label: '전생 전반기 기운 배경 [무의식 남결절]', pos: unconscious.southNode },
      { id: 'd_north_node', label: '전생 후반기 기운 배경 [무의식 북결절]', pos: unconscious.northNode },
      { id: 'p_south_node', label: '전생 전반기 생각 패턴 [의식 남결절]', pos: conscious.southNode },
      { id: 'p_north_node', label: '전생 후반기 생각 패턴 [의식 북결절]', pos: conscious.northNode },
      { id: 'd_moon', label: '무의식적 감동력 [무의식 달]', pos: unconscious.moon },
      { id: 'p_moon', label: '집중의 초점 [의식 달]', pos: conscious.moon },
      { id: 'd_mercury', label: '무의식적 내면의 소통 [무의식 수성]', pos: unconscious.mercury },
      { id: 'p_mercury', label: '일상의 대외 메시지 [의식 수성]', pos: conscious.mercury },
      { id: 'd_venus', label: '관계적 미학 기반 [무의식 금성]', pos: unconscious.venus },
      { id: 'p_venus', label: '표면의 핵심 가치관 [의식 금성]', pos: conscious.venus },
      { id: 'd_mars', label: '잠재적 무의식 행동력 [무의식 화성]', pos: unconscious.mars },
      { id: 'p_mars', label: '전투적 기질 본능 [의식 화성]', pos: conscious.mars },
      { id: 'd_jupiter', label: '무의식적 우주 확장력 [무의식 목성]', pos: unconscious.jupiter },
      { id: 'p_jupiter', label: '인생 번영과 확장 방향 [의식 목성]', pos: conscious.jupiter },
      { id: 'd_saturn', label: '무의식적 자기 규율 [무의식 토성]', pos: unconscious.saturn },
      { id: 'p_saturn', label: '성찰과 절제 브레이크 [의식 토성]', pos: conscious.saturn },
      { id: 'd_uranus', label: '무의식적 혁신력 [무의식 천왕성]', pos: unconscious.uranus },
      { id: 'p_uranus', label: '독창적 혁신 주파수 [의식 천왕성]', pos: conscious.uranus },
      { id: 'd_neptune', label: '무의식적 존재 베일 [무의식 해왕성]', pos: unconscious.neptune },
      { id: 'p_neptune', label: '직관의 영감 수용력 [의식 해왕성]', pos: conscious.neptune },
      { id: 'd_pluto', label: '무의식적 시각 공백 [무의식 명왕성]', pos: unconscious.pluto },
      { id: 'p_pluto', label: '영적 깊은 진실의 불꽃 [의식 명왕성]', pos: conscious.pluto },
    ];

    const activations = PLANETS_DEFS.map((config, index) => {
      const calculatedGate = config.pos?.gate || 1;
      const calculatedLine = config.pos?.line || 1;

      const gateMeta = GATES_MAP[calculatedGate] ?? { name: '미지의 괘', keyword: '알 수 없는 마음의 영토' };

      const scoreKeys = [bigeop, sigsang, jaeseong, gwanseong, inseong];
      const scoreBase = scoreKeys[calculatedGate % 5];
      const randomFactor = ((seed * (index + 1) + 13) % 25) - 12;
      const finalScore = clamp(25, 98, Math.round((scoreBase / 6.0) * 80 + 20 + randomFactor));

      const darkCodeTxt = `내 안의 눈부신 잠재력인 [${gateMeta.name}]의 기운이 내면의 오류 데이터(소멸 공포) 때문에 한순간 왜곡되어 작동하는 다크코드 상태입니다. 에고가 살기 위해 발버둥 치며 방어벽을 친 상태이니 스스로를 탓하지 마시고, 따뜻하고 자비로운 반조로 품어 안아 포맷해 주세요.`;
      const neuralCodeTxt = `마음이 자각을 얻고 안정되며, [${gateMeta.name}]의 기질이 건강하게 순리대로 자리를 잡는 뉴럴코드 단계입니다. 뇌신경망의 불필요한 저항 회로가 해제되고 더 맑게 정렬되어, 나다우면서도 조화로운 활력이 깨어납니다.`;
      const metaCodeTxt = `모든 인위적인 집착과 에고의 계산을 내려놓고 우주 본래의 맑은 거울과 완전히 일치된 메타코드 상태입니다. [${gateMeta.name}]의 천명이 온전한 평화 속에서 대자유로 흘러넘치며 세상을 아름답게 환희로 밝힙니다.`;

      return {
        id: config.id,
        label: config.label,
        gate: calculatedGate,
        line: calculatedLine,
        name: gateMeta.name,
        keyword: gateMeta.keyword,
        score: finalScore,
        darkCodeTxt,
        neuralCodeTxt,
        metaCodeTxt,
      };
    });

    // ── 유형론(Typology) ──
    const expressionCenter = centers.find((c) => c.id === 'expression');
    const lifeforceCenter = centers.find((c) => c.id === 'lifeforce');

    const expressionDefined = expressionCenter?.status === 'DEFINED';
    const lifeforceDefined = lifeforceCenter?.status === 'DEFINED';

    let typeName: string;
    let typeDesc: string;

    if (expressionDefined && lifeforceDefined) {
      typeName = '표현형 창시자';
      typeDesc = '당신은 내면의 강력한 에너지를 스스로 발화시켜 세상에 직접 밀어내는 적극적인 창시자 유형입니다. 머릿속의 창조적 비전을 말과 행동으로 뚜렷하게 실현하려는 본래 능력이 훌륭하며, 주변에 긍정적인 파동을 일으킵니다.';
    } else if (lifeforceDefined) {
      typeName = '실행형 구축가';
      typeDesc = '당신은 지치지 않는 맑은 에너지를 간직하고 있어, 진정 가슴 뛰는 순리의 일과 마주할 때 폭발적으로 일에 몰입하여 완성하는 구축의 달인입니다. 억지로 행동하기보다 삶이 주는 순리를 기다려 반응할 때 영롱한 꽃이 핍니다.';
    } else if (expressionDefined && !lifeforceDefined) {
      typeName = '안내형 전략가';
      typeDesc = '당신은 에너지를 마구 쓰는 노동자이기보다는, 타인의 숨겨진 재능과 방향성을 명민하게 꿰뚫어 보고 올바르게 가이드해주는 사랑 어린 길잡이입니다. 사람들의 참 가치를 발견하고 조율해줄 때 가장 행복합니다.';
    } else {
      typeName = '반영형 관찰자';
      typeDesc = '당신은 온 우주의 기운과 흐름을 자신의 맑은 마음 거울 위에 있는 그대로 담아내어 세상에 올바르게 되비춰주는 지혜로운 관찰자입니다. 서두르지 않고 마음의 고요를 유지할 때 우주의 기적이 스며듭니다.';
    }

    const line1 = conscious.sun?.line || 1;
    const line2 = unconscious.sun?.line || 1;
    const profileName = line1 + '/' + line2 + ' 주파수 조합';

    let profileDesc: string;
    switch (line1) {
      case 1:
        profileDesc = '명심단계별주역효 1효(탐구 기질)로서 삶의 근원을 깊고 꼼꼼하게 성찰하는 학구열을 지녔으며, 신뢰할 만한 기초 위에 나를 바로 세울 때 깊은 안정감을 얻습니다.';
        break;
      case 2:
        profileDesc = '명심단계별주역효 2효(자연 기질)로서 억지스러운 조율 없이 혼자만의 고요한 충전 시간을 가질 때 천재성이 저절로 피어나며, 때가 되면 외부에서 부름을 얻게 됩니다.';
        break;
      case 3:
        profileDesc = '명심단계별주역효 3효(실험 기질)로서 삶의 크고 작은 모험과 시행착오를 기꺼이 겪어내며, 이를 살아있는 귀한 자산이자 지혜로 정화해나가는 불굴의 성정입니다.';
        break;
      case 4:
        profileDesc = '명심단계별주역효 4효(우정 기질)로서 사람들과 따뜻하게 관계를 맺고 깊이 공감하는 네트워크가 운명의 다리가 되어주며, 돈독한 인연들 속에서 삶의 번영이 찾아옵니다.';
        break;
      case 5:
        profileDesc = '명심단계별주역효 5효(혁신 기질)로서 사람들의 가려운 곳을 긁어주고 위기 상황에서 실용적인 솔루션을 명쾌하게 내려받아 제시해주는 문제 해결사의 아우라를 지닙니다.';
        break;
      case 6:
        profileDesc = '명심단계별주역효 6효(리더 기질)로서 인생 전반기의 뜨거운 배움을 성숙한 성찰로 승화하여, 후반기에 많은 이들에게 삶의 롤모델이자 지혜로운 멘토가 되는 대기만성형 성정입니다.';
        break;
      default:
        profileDesc = '나만의 유일무이한 명심단계별주역효가 조화롭게 어우러진 주파수를 뿜어냅니다.';
    }

    const typology = { typeName, typeDesc, profileName, profileDesc };

    return NextResponse.json({
      success: true,
      userName: userName ?? '',
      birthDate,
      birthTime: effectiveTime,
      typology,
      centers,
      activations,
      saju: {
        fourPillars: pillars,
        gongWang: gongWangList,
      },
    });
  } catch (error: any) {
    console.error('[myeongsim-64keys] 오류 발생:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message ?? '알 수 없는 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
}
