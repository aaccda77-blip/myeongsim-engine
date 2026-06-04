'use client';

import React, { useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useReportStore } from '@/store/useReportStore';
import { calculateSaju, calculateSajuStats } from '@/lib/saju/SajuEngine';
import { X, Sparkles, TrendingUp, ShieldAlert, Award } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// 천간/지지 오행 및 음양 정보 정의
// ─────────────────────────────────────────────────────────────
const STEM_INFO: Record<string, { ohaeng: string; polarity: '+' | '-' }> = {
  '甲': { ohaeng: 'wood', polarity: '+' }, '乙': { ohaeng: 'wood', polarity: '-' },
  '丙': { ohaeng: 'fire', polarity: '+' }, '丁': { ohaeng: 'fire', polarity: '-' },
  '戊': { ohaeng: 'earth', polarity: '+' }, '己': { ohaeng: 'earth', polarity: '-' },
  '庚': { ohaeng: 'metal', polarity: '+' }, '辛': { ohaeng: 'metal', polarity: '-' },
  '壬': { ohaeng: 'water', polarity: '+' }, '癸': { ohaeng: 'water', polarity: '-' },
  '갑': { ohaeng: 'wood', polarity: '+' }, '을': { ohaeng: 'wood', polarity: '-' },
  '병': { ohaeng: 'fire', polarity: '+' }, '정': { ohaeng: 'fire', polarity: '-' },
  '무': { ohaeng: 'earth', polarity: '+' }, '기': { ohaeng: 'earth', polarity: '-' },
  '경': { ohaeng: 'metal', polarity: '+' }, '신': { ohaeng: 'metal', polarity: '-' },
  '임': { ohaeng: 'water', polarity: '+' }, '계': { ohaeng: 'water', polarity: '-' }
};

const BRANCH_INFO: Record<string, { ohaeng: string; polarity: '+' | '-' }> = {
  '子': { ohaeng: 'water', polarity: '-' }, '丑': { ohaeng: 'earth', polarity: '-' },
  '寅': { ohaeng: 'wood', polarity: '+' }, '卯': { ohaeng: 'wood', polarity: '-' },
  '辰': { ohaeng: 'earth', polarity: '+' }, '巳': { ohaeng: 'fire', polarity: '+' },
  '午': { ohaeng: 'fire', polarity: '-' }, '未': { ohaeng: 'earth', polarity: '-' },
  '申': { ohaeng: 'metal', polarity: '+' }, '酉': { ohaeng: 'metal', polarity: '-' },
  '戌': { ohaeng: 'earth', polarity: '+' }, '亥': { ohaeng: 'water', polarity: '+' },
  '자': { ohaeng: 'water', polarity: '-' }, '축': { ohaeng: 'earth', polarity: '-' },
  '인': { ohaeng: 'wood', polarity: '+' }, '묘': { ohaeng: 'wood', polarity: '-' },
  '진': { ohaeng: 'earth', polarity: '+' }, '사': { ohaeng: 'fire', polarity: '+' },
  '오': { ohaeng: 'fire', polarity: '-' }, '미': { ohaeng: 'earth', polarity: '-' },
  '신': { ohaeng: 'metal', polarity: '+' }, '유': { ohaeng: 'metal', polarity: '-' },
  '술': { ohaeng: 'earth', polarity: '+' }, '해': { ohaeng: 'water', polarity: '+' }
};

// 십신 계산 도구
const OHAENG_RELATION = ['wood', 'fire', 'earth', 'metal', 'water'];

function getTenGod(dayStem: string, targetStemOrBranch: string, isBranch = false): string {
  const dayInfo = STEM_INFO[dayStem];
  const targetInfo = isBranch ? BRANCH_INFO[targetStemOrBranch] : STEM_INFO[targetStemOrBranch];
  
  if (!dayInfo || !targetInfo) return '-';

  const dayIdx = OHAENG_RELATION.indexOf(dayInfo.ohaeng);
  const targetIdx = OHAENG_RELATION.indexOf(targetInfo.ohaeng);
  if (dayIdx === -1 || targetIdx === -1) return '-';

  const diff = (targetIdx - dayIdx + 5) % 5;
  const samePolarity = dayInfo.polarity === targetInfo.polarity;

  if (diff === 0) {
    return samePolarity ? '비견' : '겁재';
  } else if (diff === 1) {
    return samePolarity ? '식신' : '상관';
  } else if (diff === 2) {
    return samePolarity ? '편재' : '정재';
  } else if (diff === 3) {
    return samePolarity ? '편관' : '정관';
  } else {
    return samePolarity ? '편인' : '정인';
  }
}

// 60갑자 지지 동물 및 천간 색상 매핑
const ANIMAL_MAP: Record<string, string> = {
  '子': '쥐', '丑': '소', '寅': '호랑이', '卯': '토끼', '辰': '용', '巳': '뱀',
  '午': '말', '未': '양', '申': '원숭이', '酉': '닭', '戌': '개', '亥': '돼지',
  '자': '쥐', '축': '소', '인': '호랑이', '묘': '토끼', '진': '용', '사': '뱀',
  '오': '말', '미': '양', '신': '원숭이', '유': '닭', '술': '개', '해': '돼지'
};

const COLOR_MAP: Record<string, { adjective: string; emoji: string }> = {
  '甲': { adjective: '푸른', emoji: '🌲' }, '乙': { adjective: '초록빛', emoji: '🌱' },
  '丙': { adjective: '붉은', emoji: '🔥' }, '丁': { adjective: '은은한 불빛의', emoji: '🕯️' },
  '戊': { adjective: '황금빛 태산의', emoji: '⛰️' }, '己': { adjective: '부드러운 흙빛의', emoji: '🌾' },
  '庚': { adjective: '단단한 은빛', emoji: '🛡️' }, '辛': { adjective: '빛나는 보석의', emoji: '💎' },
  '壬': { adjective: '검은 파도의', emoji: '🌊' }, '癸': { adjective: '맑은 오아시스의', emoji: '💧' },
  '갑': { adjective: '푸른', emoji: '🌲' }, '을': { adjective: '초록빛', emoji: '🌱' },
  '병': { adjective: '붉은', emoji: '🔥' }, '정': { adjective: '은은한 불빛의', emoji: '🕯️' },
  '무': { adjective: '황금빛 태산의', emoji: '⛰️' }, '기': { adjective: '부드러운 흙빛의', emoji: '🌾' },
  '경': { adjective: '단단한 은빛', emoji: '🛡️' }, '신': { adjective: '빛나는 보석의', emoji: '💎' },
  '임': { adjective: '검은 파도의', emoji: '🌊' }, '계': { adjective: '맑은 오아시스의', emoji: '💧' }
};

// ─────────────────────────────────────────────────────────────
// 🧬 자아 OS 디버깅 10대 일간별 멘탈 스펙트럼 딕셔너리
// ─────────────────────────────────────────────────────────────
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
    neuralDesc: '정의와 질서를 강제하려는 탓에 척추 기립근, 턱관절, 승모근이 만성적으로 굳어 긴장성 두통과 뇌압 상승을 부르는 긴장성 뇌-근육 루프.',
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
    awareness: '출렁이는 물방울และ 흩날리는 감정들의 파동 너머, 그 모든 흔들림을 소리 없이 안고 비춰주는 광활하고 고요한 자각에 온전히 머물라.'
  }
};

const SECTIONS_108 = [
  {
    part: "Part 0. 나를 알아보기 : 성격·기질·장단점 (p. 5 ~ 32)",
    items: [
      { id: "p5_8", title: "p. 5 ~ 8 [핵심 기질 1] 일간 본질 분석", framework: "CBT 인지행동치료" },
      { id: "p9_12", title: "p. 9 ~ 12 [핵심 기질 2] 현대적 기질 메타포", framework: "CBT 인지행동치료" },
      { id: "p13_16", title: "p. 13 ~ 16 [결정적 재능] 잠재력 디코딩", framework: "MSC 자기자비 마음챙김" },
      { id: "p17_20", title: "p. 17 ~ 20 [일주 분석] 시공간과 영역의 법칙", framework: "CBT 인지행동치료" },
      { id: "p21_24", title: "p. 21 ~ 24 [심화 분석 1] 과다 십신의 폭주 제어", framework: "MBCT 마음챙김 인지치료" },
      { id: "p25_28", title: "p. 25 ~ 28 [심화 분석 2] 인지적 왜곡과 마인드셋", framework: "CBT 인지행동치료" },
      { id: "p29_32", title: "p. 29 ~ 32 [심화 분석 3] 결핍 십신의 보완과 소통", framework: "DBT 변증법적 행동치료" },
    ]
  },
  {
    part: "Part 1. 타이밍의 기술 : 운의 흐름과 메타 전략 (p. 33 ~ 54)",
    items: [
      { id: "p33_36", title: "p. 33 ~ 36 [포커스 월간 운세 1] 기회의 달 폭발 전략", framework: "ACT 수용전념치료" },
      { id: "p37_40", title: "p. 37 ~ 40 [포커스 월간 운세 2] 리스크 구간 방어 프로토콜", framework: "ACT 수용전념치료" },
      { id: "p41_46", title: "p. 41 ~ 46 [현재 대운 분석] 인생의 거대한 파도", framework: "MBSR 스트레스 완화" },
      { id: "p47_50", title: "p. 47 ~ 50 [미래 대운 분석] 선행적 자산 설계", framework: "MSC 자기자비 마음챙김" },
      { id: "p51_54", title: "p. 51 ~ 54 [타이밍 메타 코드] 운명 동기화", framework: "ACT 수용전념치료" },
    ]
  },
  {
    part: "Part 2. 나의 본질 완전판 : 갭 분석 + 적성 (p. 55 ~ 76)",
    items: [
      { id: "p55_59", title: "p. 55 ~ 59 [심리 구조] 내면 방어기제 해부", framework: "MBCT 마음챙김 인지치료" },
      { id: "p60_64", title: "p. 60 ~ 64 [기질 융합] 동서양 심리 지표 크로스 매핑", framework: "MSC 자기자비 마음챙김" },
      { id: "p65_68", title: "p. 65 ~ 68 [명심 적성] 천명 기반 비즈니스 설계", framework: "CBT 인지행동치료" },
      { id: "p69_72", title: "p. 69 ~ 72 [리스크 관리] 인간 리스크 방어막", framework: "MSC 자기자비 마음챙김" },
      { id: "p73_76", title: "p. 73 ~ 76 [갭 분석 솔루션] 자아 디커플링 보정", framework: "MBCT 마음챙김 인지치료" },
    ]
  },
  {
    part: "Part 3. 관계의 기술 : 신살·귀인 + 연애 + 결혼 (p. 77 ~ 94)",
    items: [
      { id: "p77_80", title: "p. 77 ~ 80 [신살 승화] 살을 매력 자산으로", framework: "DBT 변증법적 행동치료" },
      { id: "p81_84", title: "p. 81 ~ 84 [대인 귀인] 운명의 인적 네트워크", framework: "MSC 자기자비 마음챙김" },
      { id: "p85_87", title: "p. 85 ~ 87 [연애 DNA] 무의식적 끌림의 미학", framework: "DBT 변증법적 행동치료" },
      { id: "p88_90", title: "p. 88 ~ 90 [관계 리스크] 검열의 함정", framework: "DBT 변증법적 행동치료" },
      { id: "p91_94", title: "p. 91 ~ 94 [결혼 및 파트너십] 영혼의 결합", framework: "DBT 변증법적 행동치료" },
    ]
  },
  {
    part: "Part 4. 실천의 시작 : 종합 리포트 + 액션플랜 (p. 95 ~ 108)",
    items: [
      { id: "p95_98", title: "p. 95 ~ 98 [오행 솔루션] 신경학적 개운 처방", framework: "MBSR 스트레스 완화" },
      { id: "p99_102", title: "p. 99 ~ 102 [액션 플랜] 고효율 리추얼 설계", framework: "MBSR 스트레스 완화" },
      { id: "p103_105", title: "p. 103 ~ 105 [마스터의 편지] 세공의 마침표", framework: "MSC 자기자비 마음챙김" },
      { id: "p106_108", title: "p. 106 ~ 108 [명심코칭 메타 워크시트] 108일의 기적", framework: "MBSR 스트레스 완화" },
    ]
  }
];

// ─────────────────────────────────────────────────────────────
// 12운성(Twelve Changs) 및 12신살(Twelve Shinsals) 계산 헬퍼 함수
// ─────────────────────────────────────────────────────────────
function get12Unseong(dayStem: string, branch: string): string {
  const gan = (dayStem || '').trim()[0];
  const zhi = (branch || '').trim()[0];
  if (!gan || !zhi) return '건록';
  
  const ganMap: Record<string, string> = {
    '갑': '甲', '을': '乙', '병': '丙', '정': '丁', '무': '戊', '기': '己', '경': '庚', '신': '辛', '임': '壬', '계': '癸',
    '甲': '甲', '乙': '乙', '丙': '丙', '丁': '丁', '戊': '戊', '己': '己', '庚': '庚', '辛': '辛', '壬': '壬', '癸': '癸'
  };
  const zhiMap: Record<string, string> = {
    '자': '子', '축': '丑', '인': '寅', '묘': '卯', '진': '辰', '사': '巳', '오': '午', '미': '未', '신': '申', '유': '酉', '술': '戌', '해': '亥',
    '子': '子', '丑': '丑', '寅': '寅', '卯': '卯', '辰': '辰', '巳': '巳', '午': '午', '未': '未', '申': '申', '酉': '酉', '戌': '戌', '亥': '亥'
  };

  const g = ganMap[gan] || '甲';
  const z = zhiMap[zhi] || '子';

  const rule: Record<string, Record<string, string>> = {
    '甲': { '亥':'장생', '子':'목욕', '丑':'관대', '寅':'건록', '卯':'제왕', '辰':'쇠', '巳':'병', '午':'사', '未':'묘', '申':'절', '酉':'태', '戌':'양' },
    '乙': { '午':'장생', '巳':'목욕', '辰':'관대', '卯':'건록', '寅':'제왕', '丑':'쇠', '子':'병', '亥':'사', '戌':'묘', '酉':'절', '申':'태', '未':'양' },
    '丙': { '寅':'장생', '卯':'목욕', '辰':'관대', '巳':'건록', '午':'제왕', '未':'쇠', '申':'병', '酉':'사', '戌':'묘', '亥':'절', '子':'태', '丑':'양' },
    '戊': { '寅':'장생', '卯':'목욕', '辰':'관대', '巳':'건록', '午':'제왕', '未':'쇠', '申':'병', '酉':'사', '戌':'묘', '亥':'절', '子':'태', '丑':'양' },
    '丁': { '酉':'장생', '申':'목욕', '未':'관대', '午':'건록', '巳':'제왕', '辰':'쇠', '卯':'병', '寅':'사', '丑':'묘', '子':'절', '亥':'태', '戌':'양' },
    '己': { '酉':'장생', '申':'목욕', '未':'관대', '午':'건록', '巳':'제왕', '辰':'쇠', '卯':'병', '寅':'사', '丑':'묘', '子':'절', '亥':'태', '戌':'양' },
    '庚': { '巳':'장생', '午':'목욕', '未':'관대', '申':'건록', '酉':'제왕', '戌':'쇠', '亥':'병', '子':'사', '丑':'묘', '寅':'절', '卯':'태', '辰':'양' },
    '辛': { '子':'장생', '亥':'목욕', '戌':'관대', '酉':'건록', '申':'제왕', '未':'쇠', '午':'병', '巳':'사', '辰':'묘', '卯':'절', '寅':'태', '丑':'양' },
    '壬': { '申':'장생', '酉':'목욕', '戌':'관대', '亥':'건록', '子':'제왕', '丑':'쇠', '寅':'병', '卯':'사', '辰':'묘', '巳':'절', '午':'태', '未':'양' },
    '癸': { '卯':'장생', '寅':'목욕', '丑':'관대', '子':'건록', '亥':'제왕', '戌':'쇠', '酉':'병', '申':'사', '未':'묘', '午':'절', '巳':'태', '辰':'양' },
  };

  return rule[g]?.[z] || '건록';
}

function get12Shinsal(basisBranch: string, targetBranch: string): string {
  const zhiMap: Record<string, string> = {
    '자': '子', '축': '丑', '인': '寅', '묘': '卯', '진': '辰', '사': '巳', '오': '午', '미': '未', '신': '申', '유': '酉', '술': '戌', '해': '亥',
    '子': '子', '丑': '丑', '寅': '寅', '卯': '卯', '辰': '辰', '巳': '巳', '午': '午', '未': '未', '申': '申', '酉': '酉', '戌': '戌', '亥': '亥'
  };

  const basis = zhiMap[(basisBranch || '').trim()[0]] || '子';
  const target = zhiMap[(targetBranch || '').trim()[0]] || '子';

  const zhiOrder = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const shinsalList = ['지살', '년살', '월살', '망신', '장성', '반안', '역마', '육해', '화개', '겁살', '재살', '천살'];

  let startZhi = '子';
  if (['寅', '午', '戌'].includes(basis)) {
    startZhi = '寅';
  } else if (['申', '子', '辰'].includes(basis)) {
    startZhi = '申';
  } else if (['巳', '酉', '丑'].includes(basis)) {
    startZhi = '巳';
  } else if (['亥', '卯', '未'].includes(basis)) {
    startZhi = '亥';
  }

  const sIdx = zhiOrder.indexOf(startZhi);
  const tIdx = zhiOrder.indexOf(target);
  
  if (sIdx === -1 || tIdx === -1) return '-';

  const diff = (tIdx - sIdx + 12) % 12;
  return shinsalList[diff];
}

interface MyeongsimCoachingDashboardProps {
  isOpen?: boolean;
  onClose?: () => void;
  userProfile?: any;
}

export default function MyeongsimCoachingDashboard({
  isOpen = false,
  onClose,
  userProfile
}: MyeongsimCoachingDashboardProps) {
  
  const { reportData } = useReportStore();

  const [activeTab, setActiveTab] = React.useState<'dashboard' | 'report'>('dashboard');
  const [selectedSection, setSelectedSection] = React.useState<string | null>(null);
  const [sectionContent, setSectionContent] = React.useState<string | null>(null);
  const [isSectionLoading, setIsSectionLoading] = React.useState<boolean>(false);
  const [fetchingCache, setFetchingCache] = React.useState<boolean>(false);

  // 특정 섹션 클릭 시 수파베이스/로컬 캐시 확인
  const handleSectionClick = async (sectionId: string) => {
    setSelectedSection(sectionId);
    setSectionContent(null);
    setFetchingCache(true);

    const userId = userProfile?.id || (reportData as any)?.userId || 'guest';

    try {
      // 1. 먼저 DB 조회 (Supabase 'report_contents' 테이블 직접 연동)
      const { data, error } = await supabase
        .from('report_contents')
        .select('generated_text')
        .eq('user_id', userId)
        .eq('page_id', sectionId)
        .maybeSingle();

      if (data && !error) {
        setSectionContent(data.generated_text);
        setFetchingCache(false);
        return;
      }
    } catch (e) {
      console.warn('⚠️ DB 캐시 조회 실패, 로컬 캐시 탐색:', e);
    }

    // 2. 로컬스토리지 캐시 탐색
    if (typeof window !== 'undefined') {
      const userKey = activeSaju ? activeSaju.dayMasterChar + '_' + (activeSaju.dayMaster || '') : 'guest';
      const localCacheKey = `ms_108_ai_content_v12_${userKey}`;
      const localCacheStr = localStorage.getItem(localCacheKey);
      if (localCacheStr) {
        const localCache = JSON.parse(localCacheStr);
        if (localCache[sectionId]) {
          const val = localCache[sectionId];
          const text = typeof val === 'object' ? (val.desc || val.generated_text || JSON.stringify(val)) : val;
          setSectionContent(text);
          setFetchingCache(false);
          return;
        }
      }
    }

    setFetchingCache(false);
  };

  const handleGenerateSection = async (sectionId: string, title: string, force = false) => {
    setIsSectionLoading(true);
    const userId = userProfile?.id || (reportData as any)?.userId || 'guest';

    try {
      const response = await fetch('/api/generate-myeongsim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          pageId: sectionId,
          sajuData: activeSaju,
          sajuProfile: {
            dayMasterChar: activeSaju.dayMasterChar,
            dayMasterAnalogy: metaphor.title,
            sajuGanji: metaphor.sub
          },
          force
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.text) {
          setSectionContent(data.text);

          // 로컬 동기화
          if (typeof window !== 'undefined') {
            const userKey = activeSaju ? activeSaju.dayMasterChar + '_' + (activeSaju.dayMaster || '') : 'guest';
            const localCacheKey = `ms_108_ai_content_v12_${userKey}`;
            const localCacheStr = localStorage.getItem(localCacheKey);
            const localCache = localCacheStr ? JSON.parse(localCacheStr) : {};
            localCache[sectionId] = data.text;
            localStorage.setItem(localCacheKey, JSON.stringify(localCache));
          }
        } else {
          alert('명심코칭 엔진 가동 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
      } else {
        alert('명심코칭 엔진 가동 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } catch (e) {
      console.error(e);
      alert('AI 생성 요청 중 네트워크 오류가 발생했습니다.');
    } finally {
      setIsSectionLoading(false);
    }
  };

  // ── [실시간 만세력 연산 & Hydration 락 해소 장치] ──
  const [activeSaju, setActiveSaju] = React.useState<any>({
    dayMaster: "갑목",
    dayMasterChar: "甲",
    fourPillars: {
      year: { gan: "甲", ji: "子", ganKor: "갑", jiKor: "자", ganColor: "#10B981", jiColor: "#3B82F6" },
      month: { gan: "甲", ji: "子", ganKor: "갑", jiKor: "자", ganColor: "#10B981", jiColor: "#3B82F6" },
      day: { gan: "甲", ji: "子", ganKor: "갑", jiKor: "자", ganColor: "#10B981", jiColor: "#3B82F6", char: "甲" },
      time: { gan: "甲", ji: "子", ganKor: "갑", jiKor: "자", ganColor: "#10B981", jiColor: "#3B82F6" }
    },
    elements: { wood: 1, fire: 0, earth: 0, metal: 0, water: 0 },
    tenGods: { self: 1, output: 0, wealth: 0, power: 0, resource: 0 },
    daewoonList: []
  });

  // [Hyper-Pass] 로컬 스토리지 다이렉트 파싱 폴백
  const getSajuFromLocalStorage = (): any => {
    if (typeof window === 'undefined') return null;
    try {
      const storageStr = localStorage.getItem('myeongsim-report-storage');
      if (storageStr) {
        const parsed = JSON.parse(storageStr);
        return parsed?.state?.reportData || null;
      }
    } catch (e) {
      console.warn('⚠️ [Dashboard] 스토리지 파싱 실패:', e);
    }
    return null;
  };

  React.useEffect(() => {
    if (isOpen) {
      const localData = getSajuFromLocalStorage();
      const finalReportData = reportData || localData;

      const rawDate = finalReportData?.birthDate || userProfile?.birthDate || userProfile?.birth_date || userProfile?.user_metadata?.saju_data?.date || userProfile?.user_metadata?.birth_date;
      const rawTime = finalReportData?.birthTime || userProfile?.birthTime || userProfile?.birth_time || '12:00';
      const calType = finalReportData?.meta?.calendarType || userProfile?.calendar_type || 'solar';
      const gender = finalReportData?.gender || userProfile?.gender || 'male';

      let finalSaju = null;

      if (rawDate) {
        try {
          const result = calculateSaju(rawDate, rawTime, calType, gender);
          if (result && result.success) {
            const stats = calculateSajuStats(result.fourPillars, result.dayMasterChar);
            finalSaju = {
              dayMaster: result.dayMaster,
              dayMasterChar: result.dayMasterChar,
              fourPillars: result.fourPillars,
              elements: stats.ohaeng,
              tenGods: stats.tenGods,
              currentDaewoon: result.currentDaewoon || null,
              currentSeun: result.currentSeun || null,
              daewoonList: result.daewoonList || [],
              birthYear: parseInt(rawDate.split('-')[0], 10)
            };
            console.log('📊 [Dashboard] 실시간 사주 매칭 연동 성공! 생년월일:', rawDate);
          }
        } catch (e) {
          console.warn('⚠️ [Dashboard] 실시간 사주 계산 오류:', e);
        }
      }

      if (!finalSaju) {
        finalSaju = finalReportData?.saju || userProfile?.saju;
      }

      if (finalSaju) {
        setActiveSaju(finalSaju);
      }
    }
  }, [isOpen, reportData, userProfile]);

  // ── 1. 운명 DNA 메타포 계산 ──
  const tenGods = activeSaju.tenGods || { self: 0, output: 0, wealth: 0, power: 0, resource: 0 };
  const dayPillar = activeSaju.fourPillars?.day || {};
  const dayGan = dayPillar.gan?.char || dayPillar.gan || activeSaju.dayMasterChar || '甲';
  const dayJi = dayPillar.ji?.char || dayPillar.ji || '子';
  const dayMasterName = activeSaju.dayMaster || '갑목';

  const metaphor = useMemo(() => {
    const colorInfo = COLOR_MAP[dayGan] || { adjective: '신비로운', emoji: '🔮' };
    const animalName = ANIMAL_MAP[dayJi] || '호랑이';
    return {
      title: `${colorInfo.adjective} ${animalName}`,
      emoji: colorInfo.emoji,
      sub: `${dayMasterName} × ${dayGan}${dayJi} 일주`
    };
  }, [dayGan, dayJi, dayMasterName]);

  // ── 1.2. 동적 격국 및 출현 확률 계산 (명리 감정 초고도화) ──
  const premiumSajuInfo = useMemo(() => {
    const dm = activeSaju.dayMasterChar || '甲';
    const elements = activeSaju.elements || { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    const name = (reportData as any)?.userName || userProfile?.name || userProfile?.user_metadata?.name || '내담자';

    let title = '기질의 조율자';
    let probability = 8.5;
    let description = `${name}님은 타고난 일간의 균형을 바탕으로 삶의 중심을 잡고 나아가는 조율자의 면모를 지니고 있습니다.`;

    if (['庚', '辛', '경', '신'].includes(dm) && elements.water >= 2) {
      title = '금수쌍청(金水雙淸)의 전략가';
      probability = 4.2;
      description = `${name}님은 맑고 냉철한 금(金)의 결단력과 깊은 지혜의 수(水)의 물길이 결합되어, 탁월한 분석력과 통찰을 뽐내는 금수쌍청의 전략가 기질을 타고나셨습니다.`;
    }
    else if (['甲', '乙', '갑', '을'].includes(dm) && elements.fire >= 2) {
      title = '목화통명(木火通明)의 예술가';
      probability = 5.1;
      description = `${name}님은 나무(木)의 창조성과 타오르는 불(火)의 표현력이 결합되어, 자신의 재능과 지식을 세상에 널리 밝히는 목화통명의 뛰어난 지적 예술가 기질을 지니셨습니다.`;
    }
    else if (['壬', '癸', '임', '계'].includes(dm) && elements.wood >= 2) {
      title = '수목청화(水木淸華)의 교육자';
      probability = 4.8;
      description = `${name}님은 차가운 지혜의 물(Water)로 나무(Wood)를 푸르게 길러내어, 세상을 가르치고 타인을 따뜻하게 훈육하는 수목청화의 맑은 교육자 기질을 품고 계십니다.`;
    }
    else if (elements.earth >= 2 && elements.metal >= 2) {
      title = '토금용심(土金用心)의 경영가';
      probability = 6.8;
      description = `${name}님은 단단한 대지(Earth)의 포용력과 그 속에 매힌 보석(Metal)의 냉철함이 결합되어, 거대한 시스템을 조직하고 비즈니스를 완벽히 일구어내는 현실적인 경영가 기질이 돋보입니다.`;
    }
    else if (elements.fire >= 3) {
      title = '炎上之象 (염상지상)의 개척자';
      probability = 3.5;
      description = `${name}님은 타오르는 뜨거운 불꽃(Fire)의 주파수가 지배적이며, 어떤 난관이 와도 용맹하게 뚫고 나가는 도전성과 열정을 탑재한 염상의 개척자이십니다.`;
    }
    else if (elements.metal >= 3) {
      title = '從革之象 (종혁지상)의 군주';
      probability = 3.2;
      description = `${name}님은 서슬 퍼런 무쇠와 보석(Metal)의 칼날 같은 통제력이 강하게 쏠려있어, 부적절한 관습을 과감히 혁파하고 엄격한 주권을 세우는 종혁의 카리스마 군주 기질을 지녔습니다.`;
    }
    else if (elements.wood >= 3) {
      title = '曲直之象 (곡직지상)의 선구자';
      probability = 3.9;
      description = `${name}님은 곧게 뻗어나가는 거대한 나무(Wood)들의 기세가 가득하여, 억압에 굴하지 않고 이상향을 향해 꿋꿋이 뻗어가며 새로운 영역을 넓히는 선구자이십니다.`;
    }
    else if (elements.water >= 3) {
      title = '潤下之象 (윤하지상)의 탐험가';
      probability = 3.1;
      description = `${name}님은 끊임없이 흐르고 침투하는 거대한 물(Water)의 에너지를 지녀, 무의식의 심연을 탐험하고 세상을 윤택하게 적시는 깊은 지혜의 탐험가이십니다.`;
    }
    else if (elements.earth >= 3) {
      title = '稼穡之象 (가색지상)의 중재자';
      probability = 4.5;
      description = `${name}님은 모든 만물을 길러내고 수용하는 광활한 대지(Earth)의 어머니 기운이 강하여, 갈등을 화해시키고 만인을 안착시키는 넉넉한 중재자이십니다.`;
    }

    return { title, probability, description, name };
  }, [activeSaju, reportData, userProfile]);

  const premiumBadges = useMemo(() => {
    const list = [
      { name: '맑은 지혜의 흐름', value: tenGods.output, key: '식상', emoji: '💧' },
      { name: '추구하는 재물욕', value: tenGods.wealth, key: '재성', emoji: '🪙' },
      { name: '나를 지키는 주권', value: tenGods.self, key: '비겁', emoji: '🛡️' },
      { name: '삶을 규율하는 통제', value: tenGods.power, key: '관성', emoji: '⚖️' },
      { name: '깊은 학문과 수용', value: tenGods.resource, key: '인성', emoji: '📚' }
    ];
    return list.sort((a, b) => b.value - a.value).slice(0, 3);
  }, [tenGods]);

  // ── 2. 십성 레이다 차트 좌표 동적 연산 ──
  const radarPoints = useMemo(() => {
    // 십성 데이터의 상대적 강도를 비례하여 SVG 오각형 좌표 도출
    const maxVal = Math.max(tenGods.self, tenGods.output, tenGods.wealth, tenGods.power, tenGods.resource, 1);
    
    const getR = (val: number) => 10 + (val / maxVal) * 35; // 최소 반경 10, 최대 45
    
    const rSelf = getR(tenGods.self);
    const rOutput = getR(tenGods.output);
    const rWealth = getR(tenGods.wealth);
    const rPower = getR(tenGods.power);
    const rResource = getR(tenGods.resource);

    // 오각형 꼭짓점 각도 계산
    const angleSelf = -Math.PI / 2; // 12시
    const angleOutput = -Math.PI / 2 + (72 * Math.PI) / 180;
    const angleWealth = -Math.PI / 2 + (144 * Math.PI) / 180;
    const anglePower = -Math.PI / 2 + (216 * Math.PI) / 180;
    const angleResource = -Math.PI / 2 + (288 * Math.PI) / 180;

    const pSelf = { x: 50 + rSelf * Math.cos(angleSelf), y: 50 + rSelf * Math.sin(angleSelf) };
    const pOutput = { x: 50 + rOutput * Math.cos(angleOutput), y: 50 + rOutput * Math.sin(angleOutput) };
    const pWealth = { x: 50 + rWealth * Math.cos(angleWealth), y: 50 + rWealth * Math.sin(angleWealth) };
    const pPower = { x: 50 + rPower * Math.cos(anglePower), y: 50 + rPower * Math.sin(anglePower) };
    const pResource = { x: 50 + rResource * Math.cos(angleResource), y: 50 + rResource * Math.sin(angleResource) };

    return `${pSelf.x.toFixed(1)},${pSelf.y.toFixed(1)} ${pOutput.x.toFixed(1)},${pOutput.y.toFixed(1)} ${pWealth.x.toFixed(1)},${pWealth.y.toFixed(1)} ${pPower.x.toFixed(1)},${pPower.y.toFixed(1)} ${pResource.x.toFixed(1)},${pResource.y.toFixed(1)}`;
  }, [tenGods]);

  // ── 3. 오행 데이터 비율 계산 ──
  const elements = activeSaju.elements || { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const elementsPercent = useMemo(() => {
    const total = (elements.wood + elements.fire + elements.earth + elements.metal + elements.water) || 1;
    return {
      wood: Math.round((elements.wood / total) * 100),
      fire: Math.round((elements.fire / total) * 100),
      earth: Math.round((elements.earth / total) * 100),
      metal: Math.round((elements.metal / total) * 100),
      water: Math.round((elements.water / total) * 100),
    };
  }, [elements]);

  // ── 4. 겉과 속 갭 점수 동적 계산 ──
  const meta = (reportData?.meta || {}) as any;
  const gapScore = useMemo(() => {
    const perfection = Math.min(98, 50 + (meta.energyLevel ? (100 - meta.energyLevel) / 2 : 34));
    const anxiety = Math.min(99, 40 + (meta.sleepQuality ? (5 - meta.sleepQuality) * 12 : 42));
    const decision = meta.stressFactors?.length ? Math.min(90, 40 + meta.stressFactors.length * 10) : 67;
    return Math.round((perfection + anxiety + decision) / 3);
  }, [meta]);

  // ── 5. 월별 재물/성취 흐름 데이터 계산 ──
  const monthlyScores = useMemo(() => {
    const total = (elements.wood + elements.fire + elements.earth + elements.metal + elements.water) || 5;
    const wPct = elements.wood / total;
    const fPct = elements.fire / total;
    const ePct = elements.earth / total;
    const mPct = elements.metal / total;
    const waPct = elements.water / total;

    const baseScores = [
      { month: '1월', score: 40 + waPct * 50 + ePct * 10 },
      { month: '2월', score: 45 + wPct * 40 + waPct * 10 },
      { month: '3월', score: 55 + wPct * 50 },
      { month: '4월', score: 50 + wPct * 30 + ePct * 20 },
      { month: '5월', score: 65 + fPct * 40 + wPct * 10 },
      { month: '6월', score: 70 + fPct * 50 },
      { month: '7월', score: 60 + fPct * 30 + ePct * 20 },
      { month: '8월', score: 50 + mPct * 40 + fPct * 10 },
      { month: '9월', score: 65 + mPct * 50 },
      { month: '10월', score: 55 + mPct * 30 + ePct * 20 },
      { month: '11월', score: 45 + waPct * 40 + mPct * 10 },
      { month: '12월', score: 40 + waPct * 50 }
    ];

    return baseScores.map(item => {
      const rounded = Math.max(35, Math.min(98, Math.round(item.score)));
      let status = 'warning';
      if (rounded >= 70) status = 'success';
      else if (rounded < 50) status = 'danger';
      return { month: item.month, score: rounded, status };
    });
  }, [elements]);

  // ── 6. 년월별 운세 매트릭스 계산 (2026년 5월 ~ 8월 기준) ──
  const sajuMatrixData = useMemo(() => {
    // 2026년 월별 간지
    const monthlyPillars = [
      { date: '2026.05', gan: '癸', ji: '巳', un: '태(胎)', sin: '재살, 겁살', active: true },
      { date: '2026.06', gan: '甲', ji: '午', un: '양(養)', sin: '천살, 재살', active: false },
      { date: '2026.07', gan: '乙', ji: '未', un: '장생(長生)', sin: '지살, 천살', active: false },
      { date: '2026.08', gan: '丙', ji: '申', un: '목욕(沐浴)', sin: '연살, 망신', active: false }
    ];

    // 천간 색상 매핑
    const getGanBg = (gan: string) => {
      const info = STEM_INFO[gan];
      if (!info) return 'bg-slate-500 text-white';
      if (info.ohaeng === 'wood') return 'bg-green-600 text-white';
      if (info.ohaeng === 'fire') return 'bg-red-500 text-white';
      if (info.ohaeng === 'earth') return 'bg-amber-500 text-white';
      if (info.ohaeng === 'metal') return 'bg-slate-400 text-white';
      return 'bg-blue-500 text-white'; // water
    };

    const getJiBg = (ji: string) => {
      const info = BRANCH_INFO[ji];
      if (!info) return 'bg-slate-500 text-white';
      if (info.ohaeng === 'wood') return 'bg-green-600 text-white';
      if (info.ohaeng === 'fire') return 'bg-red-500 text-white';
      if (info.ohaeng === 'earth') return 'bg-amber-500 text-white';
      if (info.ohaeng === 'metal') return 'bg-slate-400 text-white';
      return 'bg-blue-500 text-white'; // water
    };

    return monthlyPillars.map(col => {
      const tSip = getTenGod(dayGan, col.gan, false);
      const zSip = getTenGod(dayGan, col.ji, true);
      return {
        ...col,
        tSip,
        zSip,
        tGanBg: getGanBg(col.gan),
        zziBg: getJiBg(col.ji)
      };
    });
  }, [dayGan]);

  // ── 7. 10년 주기 대운표 계산 (동적 12운성 및 12신살 포함) ──
  const daewoonTableData = useMemo(() => {
    const list = activeSaju.daewoonList || [];
    const birthYear = activeSaju.birthYear || 1980;
    const dayStem = activeSaju.dayMasterChar || '甲';
    const yearZhi = activeSaju.fourPillars?.year?.ji || '子';
    const currentYear = new Date().getFullYear();

    const getGanBg = (gan: string) => {
      const info = STEM_INFO[gan];
      if (!info) return 'bg-slate-500 text-white';
      if (info.ohaeng === 'wood') return 'bg-green-600 text-white';
      if (info.ohaeng === 'fire') return 'bg-red-500 text-white';
      if (info.ohaeng === 'earth') return 'bg-amber-500 text-white';
      if (info.ohaeng === 'metal') return 'bg-slate-400 text-white';
      return 'bg-blue-500 text-white'; // water
    };

    const getJiBg = (ji: string) => {
      const info = BRANCH_INFO[ji];
      if (!info) return 'bg-slate-500 text-white';
      if (info.ohaeng === 'wood') return 'bg-green-600 text-white';
      if (info.ohaeng === 'fire') return 'bg-red-500 text-white';
      if (info.ohaeng === 'earth') return 'bg-amber-500 text-white';
      if (info.ohaeng === 'metal') return 'bg-slate-400 text-white';
      return 'bg-blue-500 text-white'; // water
    };

    return list.map((dw: any) => {
      const gan = dw.ganZhi[0];
      const ji = dw.ganZhi[1];
      const startAge = dw.startYear - birthYear;
      const endAge = dw.endYear - birthYear;
      const ageRange = `${startAge}-${endAge}`;

      const tSip = getTenGod(dayStem, gan, false);
      const zSip = getTenGod(dayStem, ji, true);
      const unseong = get12Unseong(dayStem, ji);
      const shinsal = get12Shinsal(yearZhi, ji);

      const isActive = currentYear >= dw.startYear && currentYear <= dw.endYear;

      return {
        year: dw.startYear,
        age: ageRange,
        tSip,
        gan,
        ji,
        zSip,
        un: unseong,
        sin: shinsal,
        tGanBg: getGanBg(gan),
        zziBg: getJiBg(ji),
        isActive
      };
    });
  }, [activeSaju]);

  // 대우주 기질 등급 (SSR, SR 등)
  const ssrBadge = useMemo(() => {
    const isSpecial = tenGods.self >= 3 || tenGods.output >= 3 || tenGods.wealth >= 3 || tenGods.power >= 3 || tenGods.resource >= 3;
    return isSpecial ? '👑 희소성: SSR 등급 (상위 0.1%)' : '💎 등급: SR 등급 (상위 1.5%)';
  }, [tenGods]);

  // ── 모달 렌더링 ──
  const content = (
    <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-800">
      
      {/* 닫기 버튼 (모달 전용) */}
      {onClose && (
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-500 flex items-center justify-center transition-all border border-slate-200"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* 헤더 */}
      <div className="max-w-4xl mx-auto mb-6 text-center">
        <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-600 text-xs font-bold rounded-full mb-3 shadow-sm">
          <Sparkles size={12} className="animate-spin-slow" /> Myeongsim OS V4 Dashboard
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F1E1D] font-serif tracking-tight">
          명심코칭 <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600">프리미엄 리포트 new</span>
        </h1>
        <p className="text-sm text-[#7A7571] mt-2 font-medium">
          동양 사주 역학 메커니즘과 서양 인지 심리학 알고리즘의 유기적 동적 바인딩
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex justify-center border-b border-[#EBE7DC] mb-8 gap-4">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`py-3 px-6 font-bold text-sm tracking-wide transition-all border-b-2 ${
            activeTab === 'dashboard'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-slate-800'
          }`}
        >
          📊 실시간 대시보드
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`py-3 px-6 font-bold text-sm tracking-wide transition-all border-b-2 ${
            activeTab === 'report'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-slate-800'
          }`}
        >
          📖 108자각 상세 백서 (108p)
        </button>
      </div>

      {/* 탭 1: 실시간 대시보드 */}
      {activeTab === 'dashboard' && (
        <>
          {/* ==========================================
              1. 운명 DNA 프로필 & 십성 레이다 차트 컴포넌트
              ========================================== */}
          <div className="w-full bg-[#FAF9F5] p-6 rounded-3xl border border-[#EBE7DC] shadow-sm mb-8">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-xs font-bold rounded-full shadow-sm animate-pulse">
                {ssrBadge}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2C2A29] mt-3 font-serif">운명 프로필 & 십성 분석</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 초고도화 명국성도 & 격국 카드 */}
              <div className="bg-white p-6 rounded-2xl border border-[#EAE6DB] flex flex-col justify-between shadow-inner-sm gap-6">
                
                {/* 1. 명국성도 (命局星圖) 2행 4열 그리드 (우에서 좌로 년->월->일->시 배치) */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded uppercase tracking-widest">
                      命局星圖 (명국성도)
                    </span>
                    <span className="text-xs font-serif text-[#7A7571] font-bold">
                      {premiumSajuInfo.name}님께 새겨진 여덟 글자 운명
                    </span>
                  </div>
                  
                  {/* 8칸 그리드 (우에서 좌로 년->월->일->시 배치) */}
                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold font-sans">
                    {/* 헤더 */}
                    <div className="text-gray-400 text-[10px]">시주(時)</div>
                    <div className="text-amber-800 text-[10px]">일주(日)★</div>
                    <div className="text-gray-400 text-[10px]">월주(月)</div>
                    <div className="text-gray-400 text-[10px]">년주(年)</div>

                    {/* 천간 (천간행) */}
                    <div className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 ${
                      activeSaju.fourPillars?.time?.ganElement === '목' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      activeSaju.fourPillars?.time?.ganElement === '화' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      activeSaju.fourPillars?.time?.ganElement === '토' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      activeSaju.fourPillars?.time?.ganElement === '금' ? 'bg-slate-100 text-slate-700 border-slate-300' :
                      activeSaju.fourPillars?.time?.ganElement === '수' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      <span className="text-lg font-black font-serif">{activeSaju.fourPillars?.time?.gan}</span>
                      <span className="text-[9px] opacity-80">{activeSaju.fourPillars?.time?.ganKor || activeSaju.fourPillars?.time?.ganElement}</span>
                    </div>
                    <div className={`p-2.5 rounded-lg border-2 ring-2 ring-amber-500/20 flex flex-col items-center justify-center gap-1 ${
                      activeSaju.fourPillars?.day?.ganElement === '목' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      activeSaju.fourPillars?.day?.ganElement === '화' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      activeSaju.fourPillars?.day?.ganElement === '토' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      activeSaju.fourPillars?.day?.ganElement === '금' ? 'bg-slate-100 text-slate-700 border-slate-300' :
                      activeSaju.fourPillars?.day?.ganElement === '수' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      <span className="text-lg font-black font-serif">{activeSaju.fourPillars?.day?.gan}</span>
                      <span className="text-[9px] opacity-80">{activeSaju.fourPillars?.day?.ganKor || activeSaju.fourPillars?.day?.ganElement}</span>
                    </div>
                    <div className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 ${
                      activeSaju.fourPillars?.month?.ganElement === '목' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      activeSaju.fourPillars?.month?.ganElement === '화' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      activeSaju.fourPillars?.month?.ganElement === '토' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      activeSaju.fourPillars?.month?.ganElement === '금' ? 'bg-slate-100 text-slate-700 border-slate-300' :
                      activeSaju.fourPillars?.month?.ganElement === '수' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      <span className="text-lg font-black font-serif">{activeSaju.fourPillars?.month?.gan}</span>
                      <span className="text-[9px] opacity-80">{activeSaju.fourPillars?.month?.ganKor || activeSaju.fourPillars?.month?.ganElement}</span>
                    </div>
                    <div className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 ${
                      activeSaju.fourPillars?.year?.ganElement === '목' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      activeSaju.fourPillars?.year?.ganElement === '화' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      activeSaju.fourPillars?.year?.ganElement === '토' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      activeSaju.fourPillars?.year?.ganElement === '금' ? 'bg-slate-100 text-slate-700 border-slate-300' :
                      activeSaju.fourPillars?.year?.ganElement === '수' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      <span className="text-lg font-black font-serif">{activeSaju.fourPillars?.year?.gan}</span>
                      <span className="text-[9px] opacity-80">{activeSaju.fourPillars?.year?.ganKor || activeSaju.fourPillars?.year?.ganElement}</span>
                    </div>

                    {/* 지지 (지지행) */}
                    <div className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 ${
                      activeSaju.fourPillars?.time?.jiElement === '목' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      activeSaju.fourPillars?.time?.jiElement === '화' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      activeSaju.fourPillars?.time?.jiElement === '토' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      activeSaju.fourPillars?.time?.jiElement === '금' ? 'bg-slate-100 text-slate-700 border-slate-300' :
                      activeSaju.fourPillars?.time?.jiElement === '수' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      <span className="text-lg font-black font-serif">{activeSaju.fourPillars?.time?.ji}</span>
                      <span className="text-[9px] opacity-80">{activeSaju.fourPillars?.time?.jiKor || activeSaju.fourPillars?.time?.jiElement}({ANIMAL_MAP[activeSaju.fourPillars?.time?.ji] || '동물'})</span>
                    </div>
                    <div className={`p-2.5 rounded-lg border-2 ring-2 ring-amber-500/20 flex flex-col items-center justify-center gap-1 ${
                      activeSaju.fourPillars?.day?.jiElement === '목' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      activeSaju.fourPillars?.day?.jiElement === '화' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      activeSaju.fourPillars?.day?.jiElement === '토' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      activeSaju.fourPillars?.day?.jiElement === '금' ? 'bg-slate-100 text-slate-700 border-slate-300' :
                      activeSaju.fourPillars?.day?.jiElement === '수' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      <span className="text-lg font-black font-serif">{activeSaju.fourPillars?.day?.ji}</span>
                      <span className="text-[9px] opacity-80">{activeSaju.fourPillars?.day?.jiKor || activeSaju.fourPillars?.day?.jiElement}({ANIMAL_MAP[activeSaju.fourPillars?.day?.ji] || '동물'})</span>
                    </div>
                    <div className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 ${
                      activeSaju.fourPillars?.month?.jiElement === '목' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      activeSaju.fourPillars?.month?.jiElement === '화' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      activeSaju.fourPillars?.month?.jiElement === '토' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      activeSaju.fourPillars?.month?.jiElement === '금' ? 'bg-slate-100 text-slate-700 border-slate-300' :
                      activeSaju.fourPillars?.month?.jiElement === '수' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      <span className="text-lg font-black font-serif">{activeSaju.fourPillars?.month?.ji}</span>
                      <span className="text-[9px] opacity-80">{activeSaju.fourPillars?.month?.jiKor || activeSaju.fourPillars?.month?.jiElement}({ANIMAL_MAP[activeSaju.fourPillars?.month?.ji] || '동물'})</span>
                    </div>
                    <div className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 ${
                      activeSaju.fourPillars?.year?.jiElement === '목' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      activeSaju.fourPillars?.year?.jiElement === '화' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      activeSaju.fourPillars?.year?.jiElement === '토' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      activeSaju.fourPillars?.year?.jiElement === '금' ? 'bg-slate-100 text-slate-700 border-slate-300' :
                      activeSaju.fourPillars?.year?.jiElement === '수' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      <span className="text-lg font-black font-serif">{activeSaju.fourPillars?.year?.ji}</span>
                      <span className="text-[9px] opacity-80">{activeSaju.fourPillars?.year?.jiKor || activeSaju.fourPillars?.year?.jiElement}({ANIMAL_MAP[activeSaju.fourPillars?.year?.ji] || '동물'})</span>
                    </div>
                  </div>
                </div>

                {/* 2. 격국 / 출현 확률 분석 */}
                <div className="bg-[#FFFDF9] border border-amber-200/50 p-4 rounded-xl text-left">
                  <div className="flex justify-between items-start mb-1.5 gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-amber-900 font-serif">{premiumSajuInfo.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">이 조합의 출현 확률: {premiumSajuInfo.probability}%</p>
                    </div>
                    {premiumSajuInfo.probability <= 6 && (
                      <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-300 animate-pulse whitespace-nowrap">
                        ⚡ 극희소 조합
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5C5856] leading-relaxed mb-3">{premiumSajuInfo.description}</p>
                  
                  {/* 동적 십신 배지 3선 */}
                  <div className="flex flex-wrap gap-1.5">
                    {premiumBadges.map((badge, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 text-[10px] font-bold text-[#5C5856] bg-white border border-[#EAE6DB] px-2 py-1 rounded-md shadow-sm">
                        <span>{badge.emoji}</span>
                        <span>{badge.name} ({badge.key})</span>
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* 오각형 레이다 차트 (네이티브 SVG 동적 좌표 연산) */}
              <div className="bg-white p-6 rounded-2xl border border-[#EAE6DB] flex flex-col items-center justify-center shadow-inner-sm">
                <h4 className="text-sm font-bold text-[#5C5856] mb-2">자네의 십성(十星) 강점 분포도</h4>
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                    {/* 배경 가이드 라인 오각형 */}
                    <polygon points="50,5 93,36 76,88 24,88 7,36" fill="none" stroke="#E6E0D2" strokeWidth="0.5" />
                    <polygon points="50,20 82,43 70,80 30,80 18,43" fill="none" stroke="#E6E0D2" strokeWidth="0.5" strokeDasharray="2" />
                    <polygon points="50,35 71,50 63,71 37,71 29,50" fill="none" stroke="#E6E0D2" strokeWidth="0.5" />
                    
                    {/* 축 라인 */}
                    <line x1="50" y1="50" x2="50" y2="5" stroke="#E6E0D2" strokeWidth="0.5" />
                    <line x1="50" y1="50" x2="93" y2="36" stroke="#E6E0D2" strokeWidth="0.5" />
                    <line x1="50" y1="50" x2="76" y2="88" stroke="#E6E0D2" strokeWidth="0.5" />
                    <line x1="50" y1="50" x2="24" y2="88" stroke="#E6E0D2" strokeWidth="0.5" />
                    <line x1="50" y1="50" x2="7" y2="36" stroke="#E6E0D2" strokeWidth="0.5" />

                    {/* 실제 데이터 폴리곤 (동적 바인딩 연산) */}
                    <polygon points={radarPoints} fill="rgba(245, 158, 11, 0.2)" stroke="#F59E0B" strokeWidth="1.5" />
                    
                    {/* 텍스트 축 라벨 */}
                    <text x="50" y="2" textAnchor="middle" className="text-[5px] font-bold fill-[#8A8473]">비겁 (자비)</text>
                    <text x="97" y="37" textAnchor="start" className="text-[5px] font-bold fill-green-600">식상 (표현)★</text>
                    <text x="80" y="94" textAnchor="middle" className="text-[5px] font-bold fill-[#8A8473]">재성 (분별)</text>
                    <text x="20" y="94" textAnchor="middle" className="text-[5px] font-bold fill-red-500">관성 (통제)⚠️</text>
                    <text x="3" y="37" textAnchor="end" className="text-[5px] font-bold fill-[#8A8473]">인성 (통찰)</text>
                  </svg>
                </div>
                <div className="flex gap-4 mt-3 text-xs font-medium">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>내면 상태</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>주의 요망</span>
                </div>
              </div>
            </div>
            
            {/* 긴급 진단 안내문 배너 */}
            <div className="mt-4 bg-[#FFF9F0] border border-[#F5E3C3] p-4 rounded-xl">
              <p className="text-sm text-[#876229] leading-relaxed font-medium">
                ⚠️ <span className="font-bold">기질 디버깅 조언:</span> 자네의 기질에 비추어볼 때, 외부적 통제(관성)가 들어올 때 스트레스 지수가 치솟을 수 있네. 겉마음의 포용력과 내적 자각의 조율이 꼭 필요하네.
              </p>
            </div>
          </div>

          {/* ==========================================
              2. 오행 기운 분석 & 갭 점수 도넛 컴포넌트
              ========================================== */}
          <div className="w-full bg-white p-6 rounded-3xl border border-[#EBE7DC] shadow-sm mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 왼쪽: 오행 프로그레스 레이아웃 */}
            <div>
              <h3 className="text-lg font-bold text-[#2C2A29] mb-4 font-serif">사주팔자가 가진 다섯 기운 균형</h3>
              <div className="space-y-4">
                {[
                  { name: '목 mok', count: `${elements.wood}개`, percent: elementsPercent.wood, color: 'bg-green-500' },
                  { name: '화 hwa', count: `${elements.fire}개`, percent: elementsPercent.fire, color: 'bg-red-500' },
                  { name: '토 to', count: `${elements.earth}개`, percent: elementsPercent.earth, color: 'bg-amber-600' },
                  { name: '금 geum', count: `${elements.metal}개`, percent: elementsPercent.metal, color: 'bg-slate-500' },
                  { name: '수 su', count: `${elements.water}개`, percent: elementsPercent.water, color: 'bg-blue-500' },
                ].map((elem, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4">
                    <div className="w-20 font-bold text-sm text-[#4A4744] tracking-wide uppercase">{elem.name}</div>
                    <div className="flex-1 bg-[#F4F1E9] h-3 rounded-full overflow-hidden">
                      <div className={`h-full ${elem.color} transition-all duration-1000`} style={{ width: `${elem.percent}%` }}></div>
                    </div>
                    <div className="w-14 text-right">
                      <span className="text-xs text-gray-400 mr-1.5">{elem.count}</span>
                      <span className="text-base font-bold text-[#2C2A29]">{elem.percent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 오른쪽: 내면 심리 갭 점수 원형 도넛 */}
            <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-[#EBE7DC] pt-6 md:pt-0 md:pl-8">
              <h3 className="text-sm font-bold text-[#5C5856] mb-4">자네의 겉과 속 갭(Gap) 점수</h3>
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle className="text-[#F4F1E9]" strokeWidth="3.5" stroke="currentColor" fill="none" cx="18" cy="18" r="15.915" />
                  <circle className="text-red-500 transition-all duration-1000" 
                          strokeDasharray={`${gapScore}, 100`} 
                          strokeWidth="3.5" 
                          strokeLinecap="round" 
                          stroke="currentColor" 
                          fill="none" 
                          cx="18" cy="18" r="15.915" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-black text-[#2C2A29]">{gapScore}</span>
                  <span className="text-xs block text-gray-400 font-bold tracking-tight">갭 점수</span>
                </div>
              </div>
              <p className="text-xs text-center text-[#6E6A66] leading-relaxed mt-4 max-w-xs font-medium">
                100점 만점 기준 · 높을수록 피로도와 내면의 갈등이 깊음을 뜻하네. <span className="text-red-500 font-bold">MBCT 자각 명상 완화 기법</span>이 추천되네.
              </p>
            </div>
          </div>

          {/* ==========================================
              자아 OS 디버깅 센터: 다크/뉴럴/메타 코드 & 4대 치유 문답 (동적 바인딩)
              ========================================== */}
          {(() => {
            const dmChar = (activeSaju?.dayMasterChar || '甲')[0];
            const debugData = OS_DEBUGGING_DICTIONARY[dmChar] || OS_DEBUGGING_DICTIONARY['甲'];
            
            return (
              <div className="w-full bg-[#181716] text-[#F3EFE9] p-6 sm:p-8 rounded-3xl border border-amber-900/40 shadow-xl mb-8 relative overflow-hidden text-left">
                {/* 배경 은은한 오렌지 그라데이션 광원 */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="text-center sm:text-left mb-6 relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-black rounded-full uppercase tracking-widest">
                    ⚙️ Ego OS Debugging Terminal
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-serif mt-3 tracking-tight text-white">
                    {premiumSajuInfo.name}님의 자아 OS 핵심 디버깅 스펙트럼
                  </h3>
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                    타고난 일간({dmChar}) 기질 주파수에서 누출되는 무의식적 결함과 자가 파괴 메커니즘을 규명하고 뇌 신경망을 재정렬합니다.
                  </p>
                </div>

                {/* 3대 코드 모듈 카드 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
                  {/* 다크코드 */}
                  <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl relative group hover:border-red-500/40 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-red-400 bg-red-950/40 border border-red-900/30 px-2 py-0.5 rounded">
                          DARK CODE
                        </span>
                        <span className="text-xs text-gray-500 font-mono">{debugData.darkCode}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-2">{debugData.darkTitle}</h4>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mt-2">{debugData.darkDesc}</p>
                  </div>

                  {/* 뉴럴코드 */}
                  <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl relative group hover:border-cyan-500/40 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-900/30 px-2 py-0.5 rounded">
                          NEURAL CODE
                        </span>
                        <span className="text-xs text-gray-500 font-mono">{debugData.neuralCode}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-2">{debugData.neuralTitle}</h4>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mt-2">{debugData.neuralDesc}</p>
                  </div>

                  {/* 메타코드 */}
                  <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl relative group hover:border-amber-500/40 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-950/40 border border-amber-900/30 px-2 py-0.5 rounded">
                          META CODE
                        </span>
                        <span className="text-xs text-gray-500 font-mono">{debugData.metaCode}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-2">{debugData.metaTitle}</h4>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mt-2">{debugData.metaDesc}</p>
                  </div>
                </div>

                {/* 4단계 마음 디버깅 질문 */}
                <div className="bg-white/[0.01] border border-white/10 rounded-2xl p-5 relative z-10">
                  <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-500" /> 자아 해킹 방지 4대 치유 문답 (Recursive Inquiry)
                  </h4>
                  
                  <div className="space-y-4">
                    {[
                      { label: "🤔 소크라테스 질문 (인지 오류 객관화)", q: debugData.socratic, placeholder: "내 마음의 고집을 덜어내고 실용적인 관점으로 스스로 답해보게..." },
                      { label: "🔁 재귀적 질문 (에러 로그의 기원 탐색)", q: debugData.recursive, placeholder: "이 상처의 뿌리가 과거 어디서 시작되었는지 기록해보게..." },
                      { label: "👁️ 메타 질문 (차원 상승 및 meta-자각)", q: debugData.metaQuestion, placeholder: "고통 너머의 투명하고 광활한 맑은 자아의 관점에서 답해보게..." },
                      { label: "✨ 알아차림의 알아차림 (순수 관찰자 회귀)", q: debugData.awareness, placeholder: "생각을 붙잡지 않고 그 너머에 머무르며 드는 온전한 느낌을 기록해보게..." }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/5 p-4 rounded-xl text-left">
                        <div className="font-bold text-[10px] text-amber-300/80 mb-1">{item.label}</div>
                        <div className="text-sm font-serif text-white mb-2 leading-relaxed italic">"{item.q}"</div>
                        <textarea 
                          rows={2} 
                          className="w-full bg-[#1F1E1C] border border-white/10 rounded-lg p-2.5 text-xs text-[#FAF9F5] focus:outline-none focus:border-amber-500/40 transition-colors placeholder-gray-600 font-sans"
                          placeholder={item.placeholder}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ==========================================
              3. 월별 재물/성취 에너지 흐름도 바 차트
              ========================================== */}
          <div className="w-full bg-[#FFFDF9] p-6 rounded-3xl border border-[#EBE7DC] shadow-sm mb-8">
            <h3 className="text-lg font-bold text-[#2C2A29] mb-6 flex items-center gap-2 font-serif">
              <TrendingUp className="w-5 h-5 text-amber-600" /> 2026년 대운 커스터마이징 재물/성취 에너지 흐름도
            </h3>
            
            {/* 바 차트 레이아웃 */}
            <div className="w-full h-48 flex items-end justify-between gap-1 border-b border-[#EAE6DB] pb-2 pt-4 px-2 overflow-x-auto">
              {monthlyScores.map((item, idx) => {
                let barColor = 'bg-amber-400';
                let textColor = 'text-amber-600';
                if (item.status === 'success') { barColor = 'bg-emerald-500'; textColor = 'text-emerald-600'; }
                if (item.status === 'danger') { barColor = 'bg-rose-500'; textColor = 'text-rose-500'; }

                return (
                  <div key={idx} className="flex flex-col items-center flex-1 min-w-[32px] group">
                    <span className={`text-xs font-bold ${textColor} mb-1 opacity-90 group-hover:scale-110 transition-transform`}>
                      {item.score}
                    </span>
                    <div 
                      className={`w-full max-w-[18px] ${barColor} rounded-t-sm transition-all duration-1000 ease-out origin-bottom hover:brightness-95`}
                      style={{ height: `${item.score * 1.3}px` }}
                    ></div>
                    <span className="text-[11px] font-medium text-gray-500 mt-2 whitespace-nowrap">{item.month}</span>
                  </div>
                );
              })}
            </div>

            {/* 상태 안내 라벨 */}
            <div className="flex justify-center gap-4 mt-4 text-xs font-semibold text-[#5C5856]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>올해 타이밍의 달</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-400 rounded-full"></span>보통의 달</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span>조심해야 하는 달</span>
            </div>
          </div>

          {/* ==========================================
              4. 프리미엄 커스텀 월운표 격자 테이블
              ========================================== */}
          <div className="w-full bg-white p-6 rounded-3xl border border-[#EBE7DC] shadow-sm overflow-hidden">
            <h3 className="text-lg font-bold text-[#2C2A29] mb-4 text-center font-serif">🗓️ 명심코칭 개인 맞춤형 운세 매트릭스 (2026.05 ~ 08)</h3>
            <div className="overflow-x-auto rounded-xl border border-[#EAE6DB]">
              <table className="w-full text-center border-collapse text-sm">
                <thead>
                  <tr className="bg-[#F8F6F0] text-[#5C5856] font-bold border-b border-[#EAE6DB]">
                    <th className="py-3 px-2 border-r border-[#EAE6DB] bg-[#F1EDE2] w-24">년/월</th>
                    {sajuMatrixData.map((col, idx) => (
                      <th key={idx} className={`py-3 px-3 border-r border-[#EAE6DB] min-w-[100px] ${col.active ? 'ring-2 ring-rose-500 ring-inset bg-rose-50/30' : ''}`}>
                        {col.date}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-[#2C2A29] font-medium">
                  <tr className="border-b border-[#EAE6DB]">
                    <td className="py-2.5 bg-[#F8F6F0] font-bold border-r border-[#EAE6DB]">천간십성</td>
                    {sajuMatrixData.map((col, idx) => <td key={idx} className={`border-r border-[#EAE6DB] ${col.active ? 'bg-rose-50/20 font-bold' : ''}`}>{col.tSip}</td>)}
                  </tr>
                  <tr className="border-b border-[#EAE6DB]">
                    <td className="py-3 bg-[#F8F6F0] font-bold border-r border-[#EAE6DB]">천간(天干)</td>
                    {sajuMatrixData.map((col, idx) => (
                      <td key={idx} className="border-r border-[#EAE6DB] p-1.5">
                        <div className={`w-9 h-9 mx-auto flex items-center justify-center rounded-md text-base font-black ${col.tGanBg}`}>
                          {col.gan}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-[#EAE6DB]">
                    <td className="py-3 bg-[#F8F6F0] font-bold border-r border-[#EAE6DB]">지지(地支)</td>
                    {sajuMatrixData.map((col, idx) => (
                      <td key={idx} className="border-r border-[#EAE6DB] p-1.5">
                        <div className={`w-9 h-9 mx-auto flex items-center justify-center rounded-md text-base font-black ${col.zziBg}`}>
                          {col.ji}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-[#EAE6DB]">
                    <td className="py-2.5 bg-[#F8F6F0] font-bold border-r border-[#EAE6DB]">지지십성</td>
                    {sajuMatrixData.map((col, idx) => <td key={idx} className="border-r border-[#EAE6DB]">{col.zSip}</td>)}
                  </tr>
                  <tr className="border-b border-[#EAE6DB]">
                    <td className="py-2.5 bg-[#F8F6F0] font-bold border-r border-[#EAE6DB]">12운성</td>
                    {sajuMatrixData.map((col, idx) => <td key={idx} className="border-r border-[#EAE6DB] text-gray-600">{col.un}</td>)}
                  </tr>
                  <tr>
                    <td className="py-3 bg-[#F8F6F0] font-bold border-r border-[#EAE6DB]">12신살</td>
                    {sajuMatrixData.map((col, idx) => (
                      <td key={idx} className="border-r border-[#EAE6DB] text-xs px-2 text-[#7A5B35] font-semibold whitespace-pre-line">
                        {col.sin}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ==========================================
              5. 10년 주기 대운표 테이블 (초고도화)
              ========================================== */}
          <div className="w-full bg-white p-6 rounded-3xl border border-[#EBE7DC] shadow-sm overflow-hidden mt-8">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-[#2C2A29] font-serif">🔮 {premiumSajuInfo.name}님의 대운표</h3>
              <p className="text-xs text-gray-400 mt-1">인생의 거대한 흐름을 관장하는 10년 주기 대운 주파수</p>
            </div>
            
            <div className="overflow-x-auto rounded-xl border border-[#EAE6DB]">
              <table className="w-full text-center border-collapse text-sm">
                <thead>
                  <tr className="bg-[#F8F6F0] text-[#5C5856] font-bold border-b border-[#EAE6DB]">
                    <th className="py-3 px-2 border-r border-[#EAE6DB] bg-[#F1EDE2] w-24">구분</th>
                    {daewoonTableData.map((col: any, idx: number) => (
                      <th key={idx} className={`py-3 px-3 border-r border-[#EAE6DB] min-w-[100px] ${col.isActive ? 'ring-4 ring-red-500 ring-inset bg-red-50/30' : ''}`}>
                        {col.isActive ? '현재 대운' : `${idx + 1}대운`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-[#2C2A29] font-medium">
                  <tr className="border-b border-[#EAE6DB]">
                    <td className="py-2.5 bg-[#F8F6F0] font-bold border-r border-[#EAE6DB]">년도</td>
                    {daewoonTableData.map((col: any, idx: number) => (
                      <td key={idx} className={`border-r border-[#EAE6DB] font-semibold text-gray-500 ${col.isActive ? 'ring-4 ring-red-500 ring-inset bg-red-50/10' : ''}`}>
                        {col.year}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-[#EAE6DB]">
                    <td className="py-2.5 bg-[#F8F6F0] font-bold border-r border-[#EAE6DB]">나이*¹</td>
                    {daewoonTableData.map((col: any, idx: number) => (
                      <td key={idx} className={`border-r border-[#EAE6DB] text-xs text-gray-600 ${col.isActive ? 'ring-4 ring-red-500 ring-inset bg-red-50/10' : ''}`}>
                        {col.age}세
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-[#EAE6DB]">
                    <td className="py-2.5 bg-[#F8F6F0] font-bold border-r border-[#EAE6DB]">천간십성</td>
                    {daewoonTableData.map((col: any, idx: number) => (
                      <td key={idx} className={`border-r border-[#EAE6DB] text-amber-800 ${col.isActive ? 'ring-4 ring-red-500 ring-inset bg-red-50/10 font-bold' : ''}`}>
                        {col.tSip}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-[#EAE6DB]">
                    <td className="py-3 bg-[#F8F6F0] font-bold border-r border-[#EAE6DB]">천간(天干)</td>
                    {daewoonTableData.map((col: any, idx: number) => (
                      <td key={idx} className={`border-r border-[#EAE6DB] p-1.5 ${col.isActive ? 'ring-4 ring-red-500 ring-inset bg-red-50/10' : ''}`}>
                        <div className={`w-9 h-9 mx-auto flex flex-col items-center justify-center rounded-md text-base font-black ${col.tGanBg}`}>
                          <span>{col.gan}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-[#EAE6DB]">
                    <td className="py-3 bg-[#F8F6F0] font-bold border-r border-[#EAE6DB]">지지(地支)</td>
                    {daewoonTableData.map((col: any, idx: number) => (
                      <td key={idx} className={`border-r border-[#EAE6DB] p-1.5 ${col.isActive ? 'ring-4 ring-red-500 ring-inset bg-red-50/10' : ''}`}>
                        <div className={`w-9 h-9 mx-auto flex flex-col items-center justify-center rounded-md text-base font-black ${col.zziBg}`}>
                          <span>{col.ji}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-[#EAE6DB]">
                    <td className="py-2.5 bg-[#F8F6F0] font-bold border-r border-[#EAE6DB]">지지십성</td>
                    {daewoonTableData.map((col: any, idx: number) => (
                      <td key={idx} className={`border-r border-[#EAE6DB] text-emerald-800 ${col.isActive ? 'ring-4 ring-red-500 ring-inset bg-red-50/10 font-bold' : ''}`}>
                        {col.zSip}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-[#EAE6DB]">
                    <td className="py-2.5 bg-[#F8F6F0] font-bold border-r border-[#EAE6DB]">12운성</td>
                    {daewoonTableData.map((col: any, idx: number) => (
                      <td key={idx} className={`border-r border-[#EAE6DB] text-gray-600 ${col.isActive ? 'ring-4 ring-red-500 ring-inset bg-red-50/10 font-bold' : ''}`}>
                        {col.un}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 bg-[#F8F6F0] font-bold border-r border-[#EAE6DB]">12신살</td>
                    {daewoonTableData.map((col: any, idx: number) => (
                      <td key={idx} className={`border-r border-[#EAE6DB] text-xs px-2 text-[#7A5B35] font-semibold whitespace-pre-line ${col.isActive ? 'ring-4 ring-red-500 ring-inset bg-red-50/10 font-bold' : ''}`}>
                        {col.sin}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="text-[10px] text-gray-400 mt-3 text-left">
              *¹ 감명물에 작성되는 모든 나이는 특정 년도의 생일이 지난 만 나이로 표기합니다.
            </p>
          </div>
        </>
      )}

      {/* 탭 2: 108페이지 상세 백서 조회 */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          <div className="p-5 bg-amber-50/50 border border-amber-200/60 rounded-2xl text-center max-w-xl mx-auto mb-6">
            <p className="text-xs text-amber-800 font-bold">
              🔮 각 서판을 클릭하면 봉인이 풀리며, 제미나이 2.5 플래시 AI 엔진이 작동해 108페이지 분량의 개인 맞춤형 리포트를 페이지별로 즉석 해석합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 좌측: 108페이지 목차 섹션 리스트 */}
            <div className="lg:col-span-1 bg-[#FAF9F5] p-4 rounded-2xl border border-[#EBE7DC] max-h-[60vh] overflow-y-auto space-y-4">
              {SECTIONS_108.map((part, idx) => (
                <div key={idx} className="space-y-1.5 text-left">
                  <h4 className="text-xs font-black text-amber-700 tracking-wider mb-2 border-b border-amber-200/50 pb-1 uppercase">
                    {part.part}
                  </h4>
                  {part.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSectionClick(item.id)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-semibold flex flex-col transition-all gap-1 ${
                        selectedSection === item.id
                          ? 'bg-amber-600 text-white border-transparent shadow-sm'
                          : 'bg-white text-slate-700 border-[#EAE6DB] hover:bg-[#FDFDFB]'
                      }`}
                    >
                      <span>{item.title}</span>
                      <span className={`text-[10px] ${selectedSection === item.id ? 'text-amber-100' : 'text-gray-400'}`}>
                        {item.framework}
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* 우측: 클릭한 섹션의 실시간 온디맨드 뷰어 */}
            <div className="lg:col-span-2 min-h-[400px] flex flex-col justify-center">
              {!selectedSection ? (
                /* 미선택 초기 뷰 */
                <div className="bg-white p-8 rounded-3xl border border-[#EBE7DC] text-center py-12 shadow-sm text-left">
                  <span className="text-4xl mb-4 block">📖</span>
                  <h4 className="text-base font-bold text-slate-800 font-serif">108 자각 백서 열람실</h4>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto mt-2 leading-relaxed">
                    왼쪽 목차에서 해석하고 싶은 페이지 범위를 선택해주십시오. 즉석에서 AI 분석 엔진이 기질을 바인딩합니다.
                  </p>
                </div>
              ) : fetchingCache ? (
                /* 캐시 로딩 뷰 */
                <div className="bg-[#FAF9F5] p-8 rounded-3xl border border-[#EBE7DC] text-center py-12 flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-xs text-gray-500 font-medium">운명의 봉인을 확인하는 중...</p>
                </div>
              ) : sectionContent ? (
                /* 상태 1: 콘텐츠가 이미 존재할 때 (수파베이스 캐시 로드 완료) */
                <div className="w-full bg-[#FAF9F5] rounded-3xl border border-[#EBE7DC] shadow-sm overflow-hidden transition-all duration-300 text-left">
                  <div className="p-5 border-b border-[#EBE7DC] bg-[#FFFDFB] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                        {SECTIONS_108.flatMap(p => p.items).find(i => i.id === selectedSection)?.framework}
                      </span>
                      <h3 className="text-lg font-bold text-[#2C2A29] mt-1 font-serif">
                        {SECTIONS_108.flatMap(p => p.items).find(i => i.id === selectedSection)?.title}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      ID: {selectedSection.toUpperCase()}
                    </span>
                  </div>
                  <div className="p-6 bg-white min-h-[200px] flex flex-col justify-center">
                    <div className="prose prose-stone max-w-none text-[#3A3837] leading-relaxed animate-fade-in">
                      <div className="bg-emerald-50/50 border border-emerald-200/60 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 mb-4">
                        ✨ 안심하세요! 이 페이지는 수파베이스 보안 서버에 안전하게 보관되어 있습니다. (API 추가 소모 없음)
                      </div>
                      <p className="whitespace-pre-wrap text-sm sm:text-base font-serif leading-loose max-h-[50vh] overflow-y-auto pr-2">{sectionContent}</p>
                    </div>
                    <button
                      onClick={() => {
                        const item = SECTIONS_108.flatMap(p => p.items).find(i => i.id === selectedSection);
                        if (item) handleGenerateSection(item.id, item.title, true);
                      }}
                      className="mt-6 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 self-end transition-all animate-pulse"
                    >
                      🔄 AI 엔진으로 다시 해석하기
                    </button>
                  </div>
                </div>
              ) : isSectionLoading ? (
                /* 상태 2: 제미나이 API가 열심히 생성 중일 때 (로딩 애니메이션) */
                <div className="w-full bg-[#FAF9F5] rounded-3xl border border-[#EBE7DC] shadow-sm overflow-hidden text-center">
                  <div className="p-6 bg-white min-h-[300px] flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-base font-bold text-amber-800 font-serif animate-pulse">
                      명심코칭 AI 엔진이 자네의 무의식 알고리즘을 해석하고 있네...
                    </p>
                    <p className="text-xs text-gray-400 mt-2">잠시만 기다려주시면 평생 소장 가능한 리포트가 기록됩니다.</p>
                  </div>
                </div>
              ) : (
                /* 상태 3: 아직 생성되지 않은 페이지일 때 (프리미엄 생성 유도 UI) */
                <div className="w-full bg-[#FAF9F5] rounded-3xl border border-[#EBE7DC] shadow-sm overflow-hidden text-left">
                  <div className="p-5 border-b border-[#EBE7DC] bg-[#FFFDFB] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                        {SECTIONS_108.flatMap(p => p.items).find(i => i.id === selectedSection)?.framework}
                      </span>
                      <h3 className="text-lg font-bold text-[#2C2A29] mt-1 font-serif">
                        {SECTIONS_108.flatMap(p => p.items).find(i => i.id === selectedSection)?.title}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      ID: {selectedSection.toUpperCase()}
                    </span>
                  </div>
                  <div className="p-8 bg-white min-h-[240px] flex flex-col justify-center text-center">
                    <div className="text-4xl mb-3">🔒</div>
                    <p className="text-base font-bold text-[#4A4744] font-serif">아직 봉인 해제되지 않은 운명의 서판일세.</p>
                    <p className="text-xs text-gray-400 max-w-md mx-auto mt-2 leading-relaxed">
                      아래 버튼을 누르면 제미나이 2.5 플래시 인지 분석 엔진이 작동하며, 한 번 기록된 천명은 추가 비용 없이 평생 언제든 열람할 수 있네.
                    </p>
                    <button
                      onClick={() => {
                        const item = SECTIONS_108.flatMap(p => p.items).find(i => i.id === selectedSection);
                        if (item) handleGenerateSection(item.id, item.title);
                      }}
                      className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold text-sm rounded-xl shadow-md transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 self-center"
                    >
                      🔮 AI 명심코칭 엔진 가동 (봉인 해제)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // 모달로 열릴 경우
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1050] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-slate-200">
        {content}
      </div>
    </div>
  );
}
