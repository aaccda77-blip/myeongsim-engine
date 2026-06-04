/**
 * ===============================================================
 * 🔮 명심코칭 온디맨드(On-Demand) 캐싱 API
 * API Route: /api/generate-myeongsim/route.ts
 * 
 * 기능:
 * - Supabase 'report_contents' 테이블 캐싱 (Cache Hit 시 API 비용 0원)
 * - 캐시 미스 시 Gemini 2.5 Flash API를 활용하여 108페이지 개인화 리포트 생성
 * - 생성 즉시 Supabase에 Upsert(캐싱)하여 중복 비용 방지
 * ===============================================================
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const google = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || ''
);

// 🧬 자아 OS 디버깅 10대 일간별 멘탈 스펙트럼 딕셔너리
const OS_DEBUGGING_DICTIONARY: Record<string, {
  darkCode: string;
  darkTitle: string;
  darkDesc: string;
  neuralCode: string;
  neuralTitle: string;
  neuralDesc: string;
  metaCode: string;
  metaTitle: string;
  metaDesc: string;
  socratic: string;
  recursive: string;
  metaQuestion: string;
  awareness: string;
}> = {
  '甲': {
    darkCode: 'DRK-WOOD-01',
    darkTitle: '완벽주의적 억압과 과잉 주권의 그림자',
    darkDesc: '타인의 통제를 견디지 못하고 스스로를 항상 영웅적 리더로 몰아세우는 완고함. 현실의 한계를 마주할 때 유연하게 굽히지 못하고 한순간에 무너져 내리는 자가파괴(Catastrophic collapse) 기전.',
    neuralCode: 'NRL-WOOD-01',
    neuralTitle: '전두엽-자율신경계 과부하 루프',
    neuralDesc: '새로운 기획과 추진에 집착할 때 전전두엽(PFC)과 교감신경계가 과전압으로 치솟아, 극심한 불면과 승모근 경직, 만성 두통을 유발하는 투쟁-도피성 신경망 루프.',
    metaCode: 'MET-WOOD-01',
    metaTitle: '유연한 삼림 상생 주파수',
    metaDesc: '독자적으로 뚫고 나가려는 고립 자아에서 벗어나, 대지의 지지력을 믿고 주변 자원들과 숲을 이루어 유연하고 부드럽게 수용하며 성장하는 본질 코드.',
    socratic: '내가 지금 억지로 밀어붙이려는 방식이 과연 유일하고 합리적인가? 이 완고함이 내 장기적 평온에 주는 효용은 무엇인가?',
    recursive: '나는 어릴 적 누구로부터 "강해야만 살아남고 약함을 보이면 즉시 꺾인다"는 억압적 소스코드를 다운로드 받았는가?',
    metaQuestion: '지금 이 막막하고 무거운 부담감 너머에서, 에고의 모든 분투를 가만히 연민으로 안아주는 관찰자 자아의 크기는 얼마나 광활한가?',
    awareness: '"어떻게든 돌파해야 한다"는 긴장감 너머, 지금 아무 요구 없이 고요하게 숨 쉬고 있는 고요한 텅 빈 의식 그 자체에 온전히 안주해 보라.'
  },
  '乙': {
    darkCode: 'DRK-WOOD-02',
    darkTitle: '과도한 타인 동조와 의존적 불안의 늪',
    darkDesc: '생존과 안정을 위해 타인에게 과도하게 유착되어 눈치를 보거나 비위를 맞추며, 정작 자기 주권과 본질적 색깔을 잃어버리는 자기 지움.',
    neuralCode: 'NRL-WOOD-02',
    neuralTitle: '변연계 과민 거절 경보 회로',
    neuralDesc: '관계 속 거절이나 거부의 미세한 신호에 편도체가 즉각 과잉 경보를 울려 세로토닌을 급감시키고, 만성 대인불안, 신경성 위장 장애, 신체 부종을 유발하는 회로.',
    metaCode: 'MET-WOOD-02',
    metaTitle: '바람에 춤추는 잡초의 자생 주파수',
    metaDesc: '어떤 강풍에도 흔들릴지언정 절대 뿌리째 뽑히지 않는 질긴 자생력을 깨닫고, 타인의 평가에 얽매이지 않는 독립적이고 자유로운 주권을 회복하는 코드.',
    socratic: '타인의 기분을 맞추지 못하면 내 가치와 생존이 무너질 것이라는 신념이 진실인가? 타인의 평가가 내 실존을 위협할 물리적 권한이 있는가?',
    recursive: '관계 속에서 버림받을지 모른다는 이 극심한 불안의 코드는 과거 유년 시절 어떤 대상과의 분리 불안과 상처에서 기인했는가?',
    metaQuestion: '남들의 시선이라는 가상의 안개를 뚫고 올라와, 그 어떤 바람에도 흔들리지 않는 내면의 맑은 실존 자체를 느껴보라.',
    awareness: '남을 탐색하고 살피려는 촉각을 가만히 거두어들이고, 지금 이 순간 오롯이 지각하고 있는 내 안의 조용하고 맑은 주체 자체에 머물라.'
  },
  '丙': {
    darkCode: 'DRK-FIRE-01',
    darkTitle: '과잉 발산과 자가 연소(Burnout)의 불씨',
    darkDesc: '모든 사람의 슬픔과 문제를 자신이 다 비추고 해결해야 한다는 메시아적 책임감. 끊임없이 에너지를 발산하다 결국 텅 비어 재만 남는 자가 소멸 기전.',
    neuralCode: 'NRL-FIRE-01',
    neuralTitle: '도파민 폭주 및 부신 피로 악순환',
    neuralDesc: '환호와 열정적 성취 자극에 뇌가 과도하게 반응하여 도파민을 과다 소모하고, 부신 피질 호르몬 고갈로 심각한 무기력와 만성 피로를 부르는 신경계 고갈 루프.',
    metaCode: 'MET-FIRE-01',
    metaTitle: '자비의 훈훈한 자연 복사열',
    metaDesc: '억지로 타오르려 하지 않아도, 존재 자체로 세상과 타인을 따뜻하게 치유하고 생동감을 불어넣는 잔잔하고 깊은 온도의 자비 주파수.',
    socratic: '내가 매 순간 밝게 타오르지 않으면 정말 세상이 어둠에 잠기는가? 내가 잠시 빛을 꺼두고 어둠 속에 머물 때 일어나는 실제 비극은 무엇인가?',
    recursive: '내가 끊임없이 성과를 내거나 타인을 돕지 않으면 가치 없는 존재가 될 것이라는 오래된 인정 강박은 누구의 기대에 보답하려는 것인가?',
    metaQuestion: '타오르는 불꽃의 열기 너머, 어떤 온도나 모양에도 구속받지 않는 맑고 시원한 의식의 하늘을 가만히 내려다보라.',
    awareness: '타오르고 싶은 충동과 꺼져가는 허무함, 이 모든 감정의 기복을 있는 그대로 비춰주고 있는 투명하고 고요한 마음의 거울에 안착하라.'
  },
  '丁': {
    darkCode: 'DRK-FIRE-02',
    darkTitle: '응축된 원망과 보이지 않는 서늘한 소유욕',
    darkDesc: '겉으로는 다정하고 헌신적인 희생자의 모습을 띠지만, 무의식 밑바닥에서는 타인에 대한 만성적 서운함과 통제 불가능한 차가운 소유욕을 감추어두는 그림자 기전.',
    neuralCode: 'NRL-FIRE-02',
    neuralTitle: '세로토닌 누출 및 대뇌피질 야간 과열',
    neuralDesc: '서운함과 분노를 억누르는 탓에 밤이 되어도 대뇌피질이 식지 못하고 세로토닌 결핍을 초래하여, 야간 불안과 만성 불면증을 유발하는 과열 회로.',
    metaCode: 'MET-FIRE-02',
    metaTitle: '지혜의 고결한 등대 주파수',
    metaDesc: '상대를 소유하고 통제하려는 집착을 내려놓고, 칠흑 같은 밤바다에서 오직 방향만을 묵묵히 잡아주는 초연하고 지혜로운 등대의 힘을 실현하는 코드.',
    socratic: '상대가 내 기대대로 움직이지 않는 것이 정말 그 사람의 죄인가? 내 원망이 내 마음을 태우는 것 외에 내 삶에 무슨 실용성이 있는가?',
    recursive: '내 안의 깊은 서운함은 사실 "나를 제발 알아주고 사랑해달라"고 외치는 내면의 어린 상처가 울부짖는 메아리가 아닌가?',
    metaQuestion: '미움과 서운함의 비바람 속에서도 꺼지지 않는, 내 가슴 한편에 묵묵히 켜져 있는 고요하고 따뜻한 영혼의 불빛을 마주해보라.',
    awareness: '원망하는 감정과 그것을 억누르는 긴장 자체를 전혀 방해받지 않고 있는 그대로 비춰주는, 평온하고 텅 빈 관찰자의 자리로 돌아가라.'
  },
  '戊': {
    darkCode: 'DRK-EARTH-01',
    darkTitle: '자아 비대화와 유연성 거부의 바위 장벽',
    darkDesc: '태산 같은 권위와 신뢰를 지켜야 한다는 강박 때문에 자신의 사소한 과오나 취약성을 절대로 인정하지 않고 타협 없이 고립되어 버리는 자존심의 감옥.',
    neuralCode: 'NRL-EARTH-01',
    neuralTitle: '비장-소화계 및 뇌 노폐물 정체 루프',
    neuralDesc: '생각의 순환이 일어나지 않고 꽉 막혀, 대뇌 피질의 림프 배출이 저하되고 만성 위장 장애, 신체 긴장, 머리가 돌처럼 무거운 피로 회로.',
    metaCode: 'MET-EARTH-01',
    metaTitle: '만물을 길러내는 광활한 수용 주파수',
    metaDesc: '변화에 버티고 저항하려는 힘을 내려놓고, 대지처럼 온갖 계절의 변화와 비바람을 있는 그대로 품어 자양분으로 삼는 회복 코드.',
    socratic: '내 고집을 꺾고 패배를 인정하면 내 존재 가치가 완전히 소멸하는가? 오히려 생각을 바꾸는 유연함이 더 큰 번영을 가져오진 않는가?',
    recursive: '나는 왜 항상 "완벽하게 굳건하고 끄떡없는 산맥"이어야만 하는가? 내 취약함을 드러내는 것이 정말 파멸을 부른다고 생각하는가?',
    metaQuestion: '이 바위 장벽 같은 내 생각의 고집 너머에서, 흘러가는 바람과 비를 조용히 관찰하며 받아들이는 거대하고 우주적인 자아를 보라.',
    awareness: '변화에 저항하며 묵직하게 버티고 있는 에고의 저항감 자체를, 아무런 무게감 없이 투명하게 알아차리고 있는 맑은 공간에 머물라.'
  },
  '己': {
    darkCode: 'DRK-EARTH-02',
    darkTitle: '타인 경계 침범과 끝없는 불안의 잡초',
    darkDesc: '주변인들의 문제를 본인의 일처럼 참견하고 기우를 키우며, 감정 쓰레기통을 자처하다가 결국 원망과 배신감에 잠식되는 자기 파괴 기전.',
    neuralCode: 'NRL-EARTH-02',
    neuralTitle: '과사고 뇌하수체 과부하 및 신경 긴장 루프',
    neuralDesc: '걱정이 꼬리를 물고 이어져 뇌세포의 에너지가 고갈되고 림프 순환 부전, 기력의 급격한 저하를 유발하는 만성 스트레스 회로.',
    metaCode: 'MET-EARTH-02',
    metaTitle: '경계가 명확한 아름다운 정원',
    metaDesc: '타인의 고통을 억지로 대신 지려 하지 않고, 건강한 자아의 울타리를 세워 오직 꽃향기로 세상을 치유하는 건강한 주파수 정렬 코드.',
    socratic: '내가 주변 사람들을 위해 안달하고 조바심 내는 것이 그들에게 정말 도움이 되는가? 오히려 그들의 자생력을 해치진 않는가?',
    recursive: '타인을 걱정하고 챙기려는 소스코드는 사실 "쓸모 있는 사람이 되어 버려지지 않겠다"는 원초적 공포의 대리 만족인가?',
    metaQuestion: '타인의 감정과 불행은 내 영혼의 울타리 바깥에서 일어나는 비바람일 뿐임을 자각하고, 맑게 가꾸어진 내 뜰에서 편안히 머물라.',
    awareness: '불안해하며 타인을 챙기려 하는 나 자신의 생각들을 따뜻한 자비의 눈으로 조용히 굽어보는, 평온하고 빈 알아차림의 품에 안주하라.'
  },
  '庚': {
    darkCode: 'DRK-METAL-01',
    darkTitle: '엄격한 흑백논리와 무자비한 관계 숙청',
    darkDesc: '자신만의 철칙으로 타인을 가혹하게 검열하고, 선에 맞지 않으면 칼로 자르듯 냉혹하게 단절하여 결국 깊은 고립과 고독을 자초하는 어둠.',
    neuralCode: 'NRL-METAL-01',
    neuralTitle: '투쟁-도피 생존 반응 및 근골격 긴장성 회로',
    neuralDesc: '정의와 질서를 강제하려는 탓에 척추 기립근, 턱관절, 승모근이 만성적으로 굳어 긴장성 두통และ 뇌압 상승을 부르는 긴장성 뇌-근육 루프.',
    metaCode: 'MET-METAL-01',
    metaTitle: '포용을 머금은 굳건한 정의의 주파수',
    metaDesc: '상처를 입히는 칼날을 거두고, 투박한 원석이 불 속에서 단련되어 만인에게 유익한 위대한 도구로 재탄생하는 성숙의 제련 주파수.',
    socratic: '온 세상이 내 규칙대로 완벽하게 통제되어야만 내가 안전한가? 타인의 모호함과 실수를 허용하는 것이 내 삶을 덜 피곤하게 만들지 않는가?',
    recursive: '내가 이토록 차갑고 엄격한 칼날 방어벽을 세운 것은, 어릴 적 "틈을 보이거나 완벽하지 않으면 생존이 위협받았다"는 상처 때문인가?',
    metaQuestion: '내 날카로운 통제 욕구와 원칙 너머에서, 세상의 다채로운 불완전함을 조용히 지켜보고 허용해주는 드넓은 의식의 하늘을 보라.',
    awareness: '"저것은 틀렸다"라고 규정하며 칼을 겨누는 내면의 생각 자체를, 그저 묵묵히 흘려보내고 비추는 맑고 평온한 순수 자각으로 존재하라.'
  },
  '辛': {
    darkCode: 'DRK-METAL-02',
    darkTitle: '극도의 예민한 유리벽과 완벽주의의 그림자',
    darkDesc: '타인의 사소한 비평이나 태도에도 유리 파편처럼 내면이 깨져, 칼날 같은 독설을 품거나 세상으로부터 스스로를 가두어두는 예민성 기전.',
    neuralCode: 'NRL-METAL-02',
    neuralTitle: '대뇌피질 초감각 과부하 및 편도체 폭주 루프',
    neuralDesc: '시각, 청각, 정서적 오감이 너무 민감하게 열려 있어 일상 자극에도 뇌의 편도체가 비명을 지르며 신경계를 순식간에 탈진시키는 소진 회로.',
    metaCode: 'MET-METAL-02',
    metaTitle: '영원의 빛을 뿜는 다이아몬드 지혜',
    metaDesc: '사소한 자극에 쉽게 흠집 나는 얇은 유리 벽 자아를 내려놓고, 온 세상을 영롱하고 투명하게 비추는 굳건한 다이아몬드 영혼 코드를 실현하는 것.',
    socratic: '상대의 무심한 반응이 정말 나를 깎아내리기 위한 공격인가? 내가 스스로 유리 파편을 쥐고 내 살을 찌르고 있는 것은 아닌가?',
    recursive: '내가 가시를 세우고 철벽을 치는 무의식 로그는 사실 "내 여린 본성을 더는 다치게 하고 싶지 않다"는 깊은 상처의 눈물겨운 몸부림인가?',
    metaQuestion: '상처 입을 수 있는 것은 오직 내 에고(껍질)일 뿐이며, 내 가슴 안의 본래 영혼은 그 어떤 칼날로도 흠집 낼 수 없는 불멸의 보석임을 깨달으라.',
    awareness: '예민하게 솟아오르는 가시와 아픈 느낌들을 가만히 안아주며, 그것들이 생겼다 사라지는 투명한 마음의 우주 공간 자체에 머물라.'
  },
  '壬': {
    darkCode: 'DRK-WATER-01',
    darkTitle: '심해 속에 고립된 깊은 감정 회피와 고독',
    darkDesc: '자신의 슬픔과 약점을 깊은 무의식 밑바닥에 가두어둔 채 묵묵부답으로 일관하다, 속에서 썩어 터질 때 관계를 일시에 유실시키는 회피적 그림자.',
    neuralCode: 'NRL-WATER-01',
    neuralTitle: '신경 내분비계 침전 및 기력 다운 루프',
    neuralDesc: '감정을 외부로 건강하게 방출하지 못해 신체 림프계와 내분비계의 흐름이 막히고, 만성 피로와 심리적 침체에 잠식당하는 저주파 순환 회로.',
    metaCode: 'MET-WATER-01',
    metaTitle: '만물을 연결하고 정화하는 대양 주파수',
    metaDesc: '어둠에 가두어두던 물결을 맑게 흘려보내어 온 세상과 자연스럽게 교류하고, 스스로를 정화하는 광활한 대양의 지혜 코드를 가동하는 것.',
    socratic: '내 취약함과 아픔을 솔직히 고백했을 때 정말 파멸이 찾아오는가? 꽁꽁 숨겨두는 것이 오히려 주변 사람들을 지치게 만들진 않는가?',
    recursive: '내가 속마음을 보이면 사람들이 나를 버리거나 만만하게 볼 것이라는 깊은 불신은 과거 어떤 상처에서 시작되었는가?',
    metaQuestion: '내 안에 출렁이는 아픈 기억들이 깊은 바다 표면의 일시적인 파도일 뿐임을 깨닫고, 더 광활하고 깊은 바다 자체가 되어라.',
    awareness: '심해 속에 묻어둔 묵직한 응어리들을 억누르지 않고, 그것들을 있는 그대로 흔쾌히 품고 흘려보내는 텅 빈 의식 공간에 안주하라.'
  },
  '癸': {
    darkCode: 'DRK-WATER-02',
    darkTitle: '극세사 감정 롤러코스터와 만성 조울 기전',
    darkDesc: '외부의 미세한 기류나 타인의 감정 파동에도 가슴 속 빗방울이 요동쳐, 하루에도 수십 번씩 불안와 환희를 오가는 롤러코스터적 자기 잠식.',
    neuralCode: 'NRL-WATER-02',
    neuralTitle: '부신피질 호르몬 만성 고갈 루프',
    neuralDesc: '사소한 감정 자극에도 아드레날린 수치가 요동쳐, 자율신경계가 과민해지고 늘 극심한 심리 피로감과 신경불안에 시달리는 소진성 뇌 회로.',
    metaCode: 'MET-WATER-02',
    metaTitle: '대지를 적시는 치유의 봄비 주파수',
    metaDesc: '기분의 일렁임에 흔들리지 않고, 하늘에서 내려와 마른 대지를 촉촉하게 적셔 온갖 생명을 피워내는 맑고 치유적인 프리즘 영감 코드.',
    socratic: '지금 요동치는 이 감정이 정말 내 실존을 삼키는 대재앙인가? 아니면 그저 잠시 내면을 지나가는 봄소나기 같은 구름의 흔적인가?',
    recursive: '나는 왜 감정의 출렁임을 내 의지로 완벽하게 통제하고 억눌러야 한다는 강박에 갇혀 괴로워하고 있는가?',
    metaQuestion: '감정이라는 구름이 끼고 걷히는 푸른 하늘처럼, 언제나 그 배후에서 맑고 투명하게 개어 있는 진짜 나의 의식 상태를 마주하라.',
    awareness: '출렁이는 물방울과 흩날리는 감정들의 파동 너머, 그 모든 흔들림을 소리 없이 안고 비춰주는 광활하고 고요한 자각에 온전히 머물라.'
  }
};

// 108페이지 상세 매핑에 맞는 프롬프트 조각 생성기
function getFrameworkPromptForPage(pageId: string, sajuProfile: any): { title: string; framework: string; prompt: string } {
  const p = sajuProfile || {};
  const dm = p.dayMasterChar || '辛金';
  
  // 108페이지 매핑 정보
  const mappings: Record<string, { title: string; framework: string; prompt: string }> = {
    p5_8: {
      title: "[핵심 기질 1] 일간 본질 분석",
      framework: "CBT 인지행동치료",
      prompt: `내담자의 타고난 일간(${dm})에 대한 본질 분석과 심리적 필터, 빛과 그림자를 인지행동치료(CBT) 관점에서 분석해주세요. 일간 기질의 치우침으로 인해 일상에서 발생하는 누수 스트레스를 진단하고 따뜻한 어조로 교정 방안을 써주세요.`
    },
    p9_12: {
      title: "[핵심 기질 2] 현대적 기질 메타포",
      framework: "CBT 인지행동치료",
      prompt: `내담자의 기질 메타포(${p.dayMasterAnalogy || '은빛 다이아몬드'})에 대해 비즈니스적 가치와 오작동 시의 자기파괴 메커니즘을 CBT 기법으로 진단해주세요. 왜곡된 인지 오류를 해제하는 맞춤 확언을 제안해주세요.`
    },
    p13_16: {
      title: "[결정적 재능] 잠재력 디코딩",
      framework: "MSC 자기자비 마음챙김",
      prompt: `내담자의 타고난 재능이 억압받았던 심리적 궤적을 짚어내고, 무의식 속 깊은 상처와 그림자 에너지를 스스로 따뜻하게 안아주고 보듬어주는 자기자비(MSC) 치유 처방을 기술해주세요.`
    },
    p17_20: {
      title: "[일주 분석] 시공간과 영역의 법칙",
      framework: "CBT 인지행동치료",
      prompt: `내담자의 일주 기질을 바탕으로 이동, 이직, 독립 등 삶의 주요 결정을 내릴 때 주도권을 쥐는 공간적 확장 전략과 커리어 가이드를 인지행동치료(CBT) 관점에서 설계해주세요.`
    },
    p21_24: {
      title: "[심화 분석 1] 과다 십신의 폭주 제어",
      framework: "MBCT 마음챙김 인지치료",
      prompt: `내담자의 과잉 십신으로 인해 발생하는 과밀 행동(예: 완벽주의, 불안 등)의 신경망 루프를 마음챙김 인지치료(MBCT) 기법으로 진단하고, 의식적 자각을 통해 뇌를 안정시키는 비즈니스 리추얼을 처방해주세요.`
    },
    p25_28: {
      title: "[심화 분석 2] 인지적 왜곡과 마인드셋",
      framework: "CBT 인지행동치료",
      prompt: `불안과 강박이 엄습할 때 그것이 실재가 아닌 단순한 에너지 쏠림 현상일 뿐임을 자각하고 분리하는 CBT 디커플링 기법을 친절하고 상세히 설명하고 감동적인 치유 스크립트를 작성해주세요.`
    },
    p29_32: {
      title: "[심화 분석 3] 결핍 십신의 보완과 소통",
      framework: "DBT 변증법적 행동치료",
      prompt: `결핍된 기운으로 인해 고질적으로 겪는 소통의 한계를 변증법적 행동치료(DBT)의 대인관계 효율성 기법으로 분석하고, 이를 대안적 시스템이나 말하기 코드로 채워나가는 메타 소통법을 설계해주세요.`
    },
    p33_36: {
      title: "[포커스 월간 운세 1] 기회의 달 폭발 전략",
      framework: "ACT 수용전념치료",
      prompt: `올해 에너지가 극대화되는 달에 리스크를 줄이고 가치 중심 행동(Committed Action)으로 나아가기 위한 실행 메뉴얼과 아침 확언 로그를 작성해주세요.`
    },
    p37_40: {
      title: "[포커스 월간 운세 2] 리스크 구간 방어 프로토콜",
      framework: "ACT 수용전념치료",
      prompt: `주의해야 할 리스크 달에 발생 가능한 판단 착오와 갈등 요소를 예방하고, 감정의 폭풍 속에서 관찰자 자아(Self-as-Context)로 신속히 복귀하기 위한 위기 관리 SOP를 처방해주세요.`
    },
    p41_46: {
      title: "[현재 대운 분석] 인생의 거대한 파도",
      framework: "MBSR 스트레스 완화",
      prompt: `현재 주도하는 10년 대운이 가해오는 압박을 스트레스 완화(MBSR) 관점에서 자아 탄력성으로 전환하는 명심 멘탈 바이오해킹 기술을 다루고, 신체적 긴장 완화 가이드를 처방해주세요.`
    },
    p47_50: {
      title: "[미래 대운 분석] 선행적 자산 설계",
      framework: "MSC 자기자비 마음챙김",
      prompt: `다가올 다음 대운의 징후를 알아차리고, 미래의 나에게 따뜻한 지지와 위안을 보내는 자기자비(MSC) 자산 설계 공식을 제안해주세요.`
    },
    p51_54: {
      title: "[타이밍 메타 코드] 운명 동기화",
      framework: "ACT 수용전념치료",
      prompt: `운의 흐름에 억지로 저항하여 힘을 낭비하지 않고, 고통을 수용(Acceptance)하여 우주의 주기와 행동 주기를 일치시키는 가치 전념 확언문을 집필해주세요.`
    },
    p55_59: {
      title: "[심리 구조] 내면 방어기제 해부",
      framework: "MBCT 마음챙김 인지치료",
      prompt: `내면 깊숙이 자리 잡은 고위험 핵심 신념과 방어기제의 뿌리를 해부하고, 칼날 같은 방어기제를 내려놓고 안전지대를 구축하는 MBCT 3분 마음챙김 호흡 프로토콜을 처방해주세요.`
    },
    p60_64: {
      title: "[기질 융합] 동서양 심리 지표 크로스 매핑",
      framework: "MSC 자기자비 마음챙김",
      prompt: `내담자의 사주 기질과 서양의 심리 기질(MBTI 등)을 자기자비(MSC)의 보편적 인간성 관점에서 크로스 매핑하고, 오행의 쏠림이 유발하는 성격 단점을 따뜻하게 수용하며 초강점 지능으로 승화시키는 결과를 시각화해 제안해주세요.`
    },
    p65_68: {
      title: "[명심 적성] 천명 기반 비즈니스 설계",
      framework: "CBT 인지행동치료",
      prompt: `격국과 용신을 자본주의 비즈니스에 투사하여 수익으로 전환되는 최대 부(富)의 확장 구조 아키텍처를 CBT의 기능적 인지교정으로 서술해주세요.`
    },
    p69_72: {
      title: "[리스크 관리] 인간 리스크 방어막",
      framework: "MSC 자기자비 마음챙김",
      prompt: `투자나 파트너십 시 취약점을 파고드는 상극 기질로부터 자신을 보호하기 위해, 상처받은 마음을 돌보는 MSC 기반의 자비로운 경계선(Boundary) 설정 및 메타 협상 스크립트를 작성해주세요.`
    },
    p73_76: {
      title: "[갭 분석 솔루션] 자아 디커플링 보정",
      framework: "MBCT 마음챙김 인지치료",
      prompt: `우주가 설계한 타고난 본질과 현재 살아가는 현실 페르소나의 불일치로 인한 무기력을 해결하기 위해, 영혼의 신호를 듣고 간극을 좁히는 갭 보정 공식을 선언해주세요.`
    },
    p77_80: {
      title: "[신살 승화] 살을 매력 자산으로",
      framework: "DBT 변증법적 행동치료",
      prompt: `신살의 파괴적 에너지를 독보적인 예술적 전문성이나 대중적 카리스마로 치환하는 공식을 제시하고, 감정이 극단으로 치달을 때 안정을 주는 DBT TIPP 프로토콜을 적용해주세요.`
    },
    p81_84: {
      title: "[대인 귀인] 운명의 인적 네트워크",
      framework: "MSC 자기자비 마음챙김",
      prompt: `내담자의 성장을 견인할 귀인을 만났을 때 상대방 무의식을 따뜻하게 연결하는 자비와 상생 동맹의 소통 기술을 MSC 관점에서 서술해주세요.`
    },
    p85_87: {
      title: "[연애 DNA] 무의식적 끌림의 미학",
      framework: "DBT 변증법적 행동치료",
      prompt: `천간 합과 지지 기운을 통해 강렬하게 끌리는 이상형과 친밀감 속에서 발현되는 다크 뉴럴 애착 패턴을 분석하고, 욕구를 우아하게 소통하는 연애 코드를 처방해주세요.`
    },
    p88_90: {
      title: "[관계 리스크] 검열의 함정",
      framework: "DBT 변증법적 행동치료",
      prompt: `파트너를 무의식적으로 검열하고 지치게 만드는 갈등 루프를 진단하고, 상대의 불완전함을 타당화(Validation)하며 존엄을 지켜내는 DBT DEAR MAN 대화 기술을 처방해주세요.`
    },
    p91_94: {
      title: "[결혼 및 파트너십] 영혼의 결합",
      framework: "DBT 변증법적 행동치료",
      prompt: `일지 배우자 자리에 숨겨진 오행 에너지 분석을 바탕으로, 부부 대운 충돌 시 가정을 방어하는 안전 시나리오와 조화로운 최종 결합 프로토콜을 제시해주세요.`
    },
    p95_98: {
      title: "[오행 솔루션] 신경학적 개운 처방",
      framework: "MBSR 스트레스 완화",
      prompt: `부족한 기운을 일상 공간 인테리어와 배치를 통해 조율하는 공간 에너지 아키텍처 및 뇌를 자극하는 개운 환경 처방(색상, 숫자, 방향)을 제시해주세요.`
    },
    p99_102: {
      title: "[액션 플랜] 고효율 리추얼 설계",
      framework: "MBSR 스트레스 완화",
      prompt: `기질적 게으름이나 미루기 행동을 예방하는 뇌 부팅용 모닝/나이트 리추얼 및 신체적 긴장감을 이완하는 보디스캔(Body Scan) 명상 가이드를 작성해주세요.`
    },
    p103_105: {
      title: "[마스터의 편지] 세공의 마침표",
      framework: "MSC 자기자비 마음챙김",
      prompt: `삶의 단련 과정을 견뎌낸 내담자의 영혼에 바치는 시적이고 감동적인 자기자비(MSC)의 헌사와 최종 마스터의 서신을 작성해주세요.`
    },
    p106_108: {
      title: "[명심코칭 메타 워크시트] 108일의 기적",
      framework: "MBSR 스트레스 완화",
      prompt: `108일간의 무의식 리프로그래밍을 위한 데일리 마인드 로그의 구체적인 기록법과 완전한 도약을 돕는 최종 마스터 체크리스트를 제안해주세요.`
    }
  };

  return mappings[pageId] || {
    title: "명심코칭 맞춤 분석",
    framework: "CBT 통합 아키텍처",
    prompt: `내담자의 사주 기질 프로파일을 바탕으로 해당 주제에 관하여 CBT, ACT, DBT 등의 기법을 통합적으로 활용해 상세한 가이드를 작성해주세요.`
  };
}

export async function POST(req: NextRequest) {
  try {
    const { userId, pageId, sajuData, sajuProfile, force } = await req.json();

    if (!userId || !pageId) {
      return NextResponse.json({ success: false, error: 'userId와 pageId가 필요합니다.' }, { status: 400 });
    }

    // 1. 수파베이스 캐시 조회 (Cache Hit Check)
    if (!force) {
      const { data: cacheData, error: cacheError } = await supabase
        .from('report_contents')
        .select('generated_text')
        .eq('user_id', userId)
        .eq('page_id', pageId)
        .maybeSingle();

      if (cacheData && !cacheError) {
        console.log(`✨ [Cache Hit] user_id: ${userId}, page_id: ${pageId}`);
        return NextResponse.json({ success: true, text: cacheData.generated_text });
      }
    }

    console.log(`⚡ [Cache Miss] Generating new content via Gemini...`);

    // 2. 사주 프로파일 확보 (폴백 구조 작동)
    let finalSaju = sajuData;
    let finalProfile = sajuProfile;

    if (!finalSaju) {
      // Supabase 'users_saju' 또는 기존의 'report_contents'에 의존하지 않는 유저 만세력 데이터 탐색
      const { data: dbSaju } = await supabase
        .from('users_saju')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (dbSaju) {
        finalSaju = dbSaju.saju_data || dbSaju;
        finalProfile = dbSaju.profile_data || {};
      }
    }

    // 최종 폴백 데이터 구축
    if (!finalSaju) {
      finalSaju = {
        dayMaster: '신금',
        dayMasterChar: '辛',
        fourPillars: {
          year: { gan: '庚', ji: '申' },
          month: { gan: '癸', ji: '未' },
          day: { gan: '辛', ji: '巳', char: '辛' },
          time: { gan: '乙', ji: '未' }
        },
        elements: { wood: 1, fire: 1, earth: 2, metal: 2, water: 2 },
        tenGods: { self: 2, output: 2, wealth: 1, power: 1, resource: 2 }
      };
    }

    if (!finalProfile) {
      finalProfile = {
        dayMasterChar: finalSaju.dayMasterChar || '辛',
        dayMasterAnalogy: '빛나는 다이아몬드(辛金)',
        dayMasterShortAnalogy: '보석',
        sajuGanji: '庚申 癸未 辛巳 乙未'
      };
    }

    // 3. 페이지별 맞춤 프롬프트 조립
    const mapping = getFrameworkPromptForPage(pageId, finalProfile);
    
    // 내담자 일간에 해당하는 디버깅 데이터 추출 (모듈식 주입)
    const dmChar = (finalProfile.dayMasterChar || '辛')[0];
    const activeDebug = OS_DEBUGGING_DICTIONARY[dmChar] || OS_DEBUGGING_DICTIONARY['辛'];
    
    const prompt = `
당신은 명심코칭의 수석 AI 무의식 디버깅 및 명리 치유 전문가입니다.
내담자의 타고난 사주 원국과 심리학적 아키텍처를 결합해, 다음 테마에 대한 초개인화 솔루션을 아주 감동적이고 시적이며 구체적으로 집필하십시오.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[🧬 내담자 사주 기질 정보]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 일간(Day Master): ${finalSaju.dayMaster || '신금'} (${finalSaju.dayMasterChar || '辛'})
- 일주 별칭 및 메타포: ${finalProfile.dayMasterAnalogy || '빛나는 다이아몬드'}
- 사주 원국 흐름: ${finalProfile.sajuGanji || '庚申 癸未 辛巳 乙未'}
- 오행 구성: 목(${finalSaju.elements?.wood || 0}) 화(${finalSaju.elements?.fire || 0}) 토(${finalSaju.elements?.earth || 0}) 금(${finalSaju.elements?.metal || 0}) 수(${finalSaju.elements?.water || 0})

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[⚙️ 내담자 일간 맞춤형 자아 OS 디버깅 스펙트럼]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 다크코드(DARK CODE): ${activeDebug.darkCode} [${activeDebug.darkTitle}]
  * 무의식적 자가파괴 패턴: ${activeDebug.darkDesc}
- 뉴럴코드(NEURAL CODE): ${activeDebug.neuralCode} [${activeDebug.neuralTitle}]
  * 스트레스 신경 루프: ${activeDebug.neuralDesc}
- 메타코드(META CODE): ${activeDebug.metaCode} [${activeDebug.metaTitle}]
  * 존재 정렬 주파수: ${activeDebug.metaDesc}
- 핵심 치유 재귀 자각 질문:
  * 인지 오류 소크라테스 질문: "${activeDebug.socratic}"
  * 무의식 상처 재귀적 질문: "${activeDebug.recursive}"
  * 차원 상승 메타 질문: "${activeDebug.metaQuestion}"
  * 순수 자각 알아차림 질문: "${activeDebug.awareness}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[📖 오늘 디버깅할 치유 테마]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 섹션: ${mapping.title}
- 심리 프레임워크: ${mapping.framework}
- 핵심 치유 가이드라인:
${mapping.prompt}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[✍️ 문체 및 출력 지침 (초고도화 필독)]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. **절대 가볍거나 짤막한 답변을 내놓지 마십시오.** 리포트의 신뢰도와 완성도를 위해 분량은 **최소 1,200자~1,500자 이상**으로 매우 깊이 있고 구체적으로 풍부하게 서술하십시오.
2. 전문적이고 딱딱한 용어(예: 인지적 융합, 변증법, 인지행동 등)는 배제하고, "생각의 사슬", "마음의 거울", "감정의 강물", "내면의 상처 코드" 같이 초보자도 쉽게 이해할 수 있는 다정하고 따뜻한 비유와 문장으로 설명하세요.
3. 말투는 경어체(~해요, ~일 것입니다, ~라네)를 섞어서, 영혼을 따뜻하게 안아주는 치유사와 같은 감동적인 느낌을 가득 담으세요.
4. 출력 형식은 반드시 아래의 **[3단계 마크다운 구조]**를 100% 동일하게 지켜 가독성 있게 렌더링하십시오.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[📝 출력 마크다운 규격 템플릿]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🌌 [여기에 섹션의 한글 타이틀 출력]

## 1. 🔍 기질적 인지 필터와 무의식 에러 코드 분석
- **무의식의 에러 로그**: 타고난 사주 오행의 치우침(${finalSaju.dayMasterChar} 일간 중심)과 오늘 페이지의 테마가 얽혀 발생하는 일상의 무의식적 걸림돌, 집착, 또는 판단 왜곡의 구체적 원인을 짚어냅니다.
- **생각과 자아의 분리 (디커플링)**: 내담자가 겪는 부정적인 생각이나 불안이 자신의 본질이 아님을 깨닫게 돕고, 관찰자 시점(Meta-Self)에서 이를 가만히 내려다볼 수 있는 메타 인지 공간을 설정해 줍니다.

## 2. 💡 명심 코칭 3단계 디버깅 처방전
- **1단계 (자각 - Scan)**: 마음속 일어나는 동요의 실체를 있는 그대로 인지하기 위한 자각 스캔법을 제안합니다.
- **2단계 (수용 - Accept)**: 부족하거나 치우친 에너지를 억누르지 않고, 오히려 삶의 무기로 활용할 수 있도록 허용하는 수용의 논리를 설명합니다.
- **3단계 (전념 행동 - Shift)**: 뇌의 과부하를 막고 실제로 행동으로 옮겨 현실을 리프로그래밍할 수 있는 모닝/나이트 3단계 리추얼 수칙을 처방합니다.

## 3. ✨ 오늘의 운명 동기화 메타 확언 (Meta-Affirmation)
- 내담자의 타고난 일주와 오행 주파수에 유기적으로 주파수를 맞춘, 가슴을 울리는 감동적이고 시적인 최종 확언 카드를 만들어 줍니다. (읽는 것만으로도 가슴이 벅차오르고 위안이 되도록 정성 들여 써주세요.)
`.trim();

    // 4. Gemini API 호출
    const model = google.getGenerativeModel({
      model: 'gemini-2.5-flash',
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 2048,
        // @ts-ignore
        thinkingConfig: { thinkingBudget: 1024 }
      }
    });

    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();

    if (!generatedText) {
      throw new Error('Gemini API가 빈 텍스트를 반환했습니다.');
    }

    // 5. 생성된 결과를 Supabase 테이블에 Upsert (캐싱)
    const { error: upsertError } = await supabase
      .from('report_contents')
      .upsert({
        user_id: userId,
        page_id: pageId,
        title: mapping.title,
        generated_text: generatedText,
        updated_at: new Date()
      }, { onConflict: 'user_id,page_id' });

    if (upsertError) {
      console.warn('⚠️ Supabase 캐시 저장 실패:', upsertError);
    }

    return NextResponse.json({ success: true, text: generatedText });

  } catch (error: any) {
    console.error('❌ [/api/generate-myeongsim] 에러 발생:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
