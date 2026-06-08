'use client';

import React, { useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useReportStore } from '@/store/useReportStore';
import { calculateSaju, calculateSajuStats } from '@/lib/saju/SajuEngine';
import { X, Sparkles, TrendingUp, ShieldAlert, Award } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// 천간/지지 오행 및 음양 정보 정의
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// 🌌 공망(空亡, Void) 동적 계산 헬퍼 함수
// ─────────────────────────────────────────────────────────────
function safeChar(val: any): string {
  if (!val) return '';
  if (typeof val === 'object') {
    return (val.char || val.gan || val.ji || '').trim();
  }
  return String(val).trim();
}

function getGongmangBranches(dayGan: any, dayJi: any): string[] {
  const gans = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
  const jis = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
  const gansHanja = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const jisHanja = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  const g = safeChar(dayGan)[0] || '';
  const z = safeChar(dayJi)[0] || '';

  let ganIdx = gansHanja.indexOf(g);
  if (ganIdx === -1) ganIdx = gans.indexOf(g);

  let jiIdx = jisHanja.indexOf(z);
  if (jiIdx === -1) jiIdx = jis.indexOf(z);

  if (ganIdx === -1 || jiIdx === -1) return [];

  const startIdx = (jiIdx - ganIdx + 12) % 12;
  const gong1Idx = (startIdx + 10) % 12;
  const gong2Idx = (startIdx + 11) % 12;

  return [
    jisHanja[gong1Idx],
    jis[gong1Idx],
    jisHanja[gong2Idx],
    jis[gong2Idx]
  ];
}

// ─────────────────────────────────────────────────────────────
// 🧬 명리학-심리학 연동 번역 딕셔너리
// ─────────────────────────────────────────────────────────────
const SAJU_TRANSLATION_MAP: Record<string, { title: string; desc: string; advice: string }> = {
  '甲': { title: '갑목(甲木) : 강직하게 뻗어나가는 리더십 🌲', desc: '하늘을 향해 곧게 뻗어 오르는 거목처럼, 스스로의 주권을 세우고 주도적으로 인생을 개척하는 기운입니다.', advice: '부러질지언정 굽히지 않으려는 완고함을 가끔은 내려놓고, 대지를 유연하게 보듬는 숲의 온화함을 배워보세요.' },
  '乙': { title: '을목(乙木) : 유연하고 강인한 생명력 🌱', desc: '어떤 비바람에도 꺾이지 않고 끈질기게 생명력을 피워내는 넝쿨풀처럼, 융통성 있고 친화적인 기운입니다.', advice: '상대에게 너무 깊이 의존하거나 동조하려 하지 말고, 바람 속에서도 오롯이 빛나는 본인의 주권을 신뢰해 보세요.' },
  '丙': { title: '병화(丙火) : 세상을 비추는 밝은 태양 🔥', desc: '모든 만물을 골고루 비추고 활력을 불어넣는 태양의 열정처럼, 세상을 밝히고 앞장서는 에너지입니다.', advice: '스스로를 태워버리는 자가 소모에 빠지지 않도록, 가끔은 태양을 가리고 어둠 속에서 편안히 쉬어가는 시간을 가지세요.' },
  '丁': { title: '정화(丁火) : 어둠을 밝히는 은은한 등불 🕯️', desc: '어두운 바다의 등대나 추운 겨울밤의 모닥불처럼, 따뜻한 마음으로 주변을 세심하게 보살피고 안도감을 주는 빛입니다.', advice: '상대에 대한 깊은 애정이 원망과 희생양 콤플렉스로 꼬이지 않도록, 자신을 먼저 밝히는 이기적인 연습도 필요합니다.' },
  '戊': { title: '무토(戊土) : 포용력 있는 웅장한 태산 ⛰️', desc: '비바람을 묵묵히 견뎌내는 태산처럼, 무겁고 진중하며 모든 것을 수용하는 광활한 포용의 기운입니다.', advice: '변화를 두려워하고 고집을 꺾지 못하는 바위가 되지 말고, 계절에 따라 옷을 갈아입는 유연한 산이 되어보세요.' },
  '己': { title: '기토(己土) : 만물을 길러내는 부드러운 대지 🌾', desc: '생명을 잉태하고 보살피는 옥토처럼, 사람들을 연결하고 중재하며 넉넉하게 품어주는 기운입니다.', advice: '타인의 문제까지 나의 텃밭으로 가져와 걱정하지 말고, 나만의 경계를 명확히 세워 스스로의 마음 정원부터 가꾸세요.' },
  '庚': { title: '경금(庚金) : 원칙을 세우는 단단한 무쇠 🛡️', desc: '불순물을 허용하지 않는 예리한 칼날이나 단단한 원석처럼, 냉철한 판단력과 엄격한 원칙을 세우는 에너지입니다.', advice: '너무 날카로운 흑백논리로 세상을 재단하다가 고립되지 않도록, 타인의 모호함과 불완전함을 용인하는 여유를 가지세요.' },
  '辛': { title: '신금(辛金) : 세밀하게 다듬어진 빛나는 보석 💎', desc: '섬세하고 예민하게 세공된 보석처럼, 고귀한 자존감과 완벽주의적 성향, 예리한 미적 감각을 지닌 기운입니다.', advice: '외부의 사소한 충격에도 쉽게 금이 가는 유리 멘탈을 극복하고, 본인의 고유한 빛이 이미 완성되어 있음을 자각하세요.' },
  '壬': { title: '임수(壬水) : 깊고 넓게 흐르는 큰 바다 🌊', desc: '모든 것을 씻어내고 수용하며 도도하게 흐르는 대양처럼, 넓은 시야와 깊은 지혜, 뛰어난 수용성을 지닌 기운입니다.', advice: '감정과 생각을 심해 속에 묻어두고 회피하지 말고, 맑은 물결로 세상과 유연하게 소통하며 속마음을 표현하세요.' },
  '癸': { title: '계수(癸水) : 대지를 적시는 생명수 💧', desc: '가뭄을 해갈하는 봄비나 만물에 스며드는 이슬처럼, 세심하고 촉촉하게 주변을 적시는 치유와 감성의 기운입니다.', advice: '외부 환경에 지나치게 예민하게 반응하여 기분이 조울의 롤러코스터를 타지 않도록, 내면에 굳건한 닻을 내리세요.' },
  '子': { title: '자수(子水) : 밤의 심연을 여는 지혜의 쥐 🐀', desc: '가장 어두운 밤을 상징하며, 생명의 시작과 깊은 무의식적 지혜, 뛰어난 번식력과 아이디어를 품은 물의 기운입니다.', advice: '생각이 너무 깊어져 밤새우는 일 없이, 맑은 물결로 상쾌하게 흘려보내게.' },
  '丑': { title: '축토(丑土) : 봄을 준비하는 인내의 소 🐂', desc: '얼어붙은 겨울 땅 속에서 씨앗을 품고 봄을 기다리는, 묵묵하고 끈기 있는 인내와 근면의 흙 기운입니다.', advice: '과거의 원망이나 집착을 얼어붙은 땅에 묻어두지 말고, 봄볕에 부드럽게 녹여내게.' },
  '寅': { title: '인목(寅木) : 뚫고 솟아오르는 용맹한 호랑이 🐅', desc: '언 땅을 뚫고 나오는 새싹의 폭발적인 힘처럼, 두려움 없이 전진하고 새로운 시작을 이끄는 강인한 나무의 기운입니다.', advice: '결과를 빨리 보려는 조급함을 버리고, 한 걸음씩 내딛는 과정의 여유를 즐기게.' },
  '卯': { title: '묘목(卯木) : 봄바람을 탄 귀여운 푸른 토끼 🐇', desc: '생동감 넘치고 예민한 미적 오감과 순수한 아름다움의 기류입니다.', advice: '사소한 소음에 불안해하지 말고 대지에 닻을 내리게.' },
  '辰': { title: '진토(辰土) : 구름을 헤치며 승천하는 여의주의 용 🐉', desc: '변화무쌍하게 조화를 부리는 큰 포용력 있는 흙의 기운입니다.', advice: '이상과 현실의 갭에서 스스로 책망 말고 일상의 행복을 느끼게.' },
  '巳': { title: '사화(巳火) : 빛을 퍼뜨리는 지혜로운 뱀 🐍', desc: '밝고 화려하며 언변이 뛰어나고 융통성 있게 세상을 비추는 초여름의 지혜로운 불기운입니다.', advice: '과도한 발산으로 쉽게 지치지 않도록 조절하게.' },
  '午': { title: '오화(午火) : 정열적으로 질주하는 붉은 말 🐎', desc: '가장 뜨거운 한여름의 불꽃처럼, 명랑하고 열정적이며 뒤끝 없는 솔직함으로 돌진하는 강력한 불기운입니다.', advice: '급발진하는 열정을 차분히 호흡으로 다스리게.' },
  '未': { title: '미토(未土) : 열기를 품은 넉넉한 양 🐑', desc: '가장 뜨거운 열기를 품은 마른 땅으로, 꼼꼼하고 희생적이며 만물을 맛깔나게 익히는 흙의 기운입니다.', advice: '내면에 쌓아둔 서운함을 솔직히 표현하게.' },
  '申': { title: '신금(申金) : 재주 넘치고 예리한 원숭이 🐒', desc: '가을의 서늘한 결실을 알리는 기운으로, 판단력이 빠르고 다재다능하며 예리한 변혁의 쇠 기운입니다.', advice: '너무 날카로운 잣대로 주변을 다치게 하지 말게.' },
  '酉': { title: '유금(酉金) : 정밀하게 빚어진 맑은 닭 🐓', desc: '가장 순수하게 정제된 보석처럼, 빈틈없이 섬세하고 완벽주의적이며 깔끔한 직관을 지닌 쇠 기운입니다.', advice: '완벽에 대한 강박을 풀고 여유를 가지게.' },
  '戌': { title: '술토(戌土) : 충직하게 지키는 황금빛 개 🐕', desc: '늦가을의 쓸쓸함을 품고 결실을 보관하는 땅으로, 의리가 깊고 책임감이 강하며 수호하는 흙의 기운입니다.', advice: '과도한 책임감으로 혼자 짊어지지 말게.' },
  '亥': { title: '해수(亥水) : 풍요를 품고 흐르는 검은 돼지 🐖', desc: '겨울을 알리는 초입의 물로, 만물을 넉넉히 수용하고 지혜롭게 흘러가는 유연하고 다정다감한 물의 기운입니다.', advice: '감정의 소용돌이에 매몰되지 말고 유쾌하게 흘려보내게.' }
};

const SIPSIN_TRANSLATION_MAP: Record<string, { title: string; desc: string }> = {
  '비견': { title: '나와 어깨를 나란히 하는 독립심', desc: '경쟁과 자립의 기운. 타인에게 의존하지 않고 주체적으로 나아갑니다.' },
  '겁재': { title: '투쟁하고 쟁취하는 승부욕', desc: '경쟁심과 탈취의 기운. 손해를 보지 않으려는 강한 자아와 투쟁성을 상징합니다.' },
  '식신': { title: '여유롭게 뿜어내는 나의 재능', desc: '먹을 복과 연구심. 하나의 기술을 깊게 파고들어 나만의 것으로 만듭니다.' },
  '상관': { title: '관습을 깨고 표현하는 혁신', desc: '파격과 언변. 뛰어난 표현력으로 잘못된 규칙을 꼬집고 개혁합니다.' },
  '편재': { title: '광활한 무대를 장악하는 스케일', desc: '큰 재물과 공간 지각력. 모험을 즐기며 큰 무대에서 활약하는 투기성 재물입니다.' },
  '정재': { title: '안정적으로 모아가는 나의 자산', desc: '티끌 모아 태산. 예측 가능한 안정과 치밀함을 바탕으로 한 정당한 보상입니다.' },
  '편관': { title: '나를 통제하는 가혹한 규율', desc: '카리스마와 억압. 스트레스를 견뎌내어 명예와 권력을 쥐는 무관의 에너지입니다.' },
  '정관': { title: '사회를 지키는 합리적 시스템', desc: '원칙과 명예. 타인의 시선과 규범을 중시하며 바르고 안정적인 궤도를 걷습니다.' },
  '편인': { title: '보이지 않는 세계를 읽는 직관', desc: '신비주의와 고독. 비주류 학문이나 영적인 것에 관심이 많고 눈치가 빠릅니다.' },
  '정인': { title: '세상으로부터 받는 사랑과 지혜', desc: '학문과 도덕. 스펀지처럼 지식을 수용하며, 타인에게 사랑받고 보살핌을 받는 수용성입니다.' }
};

const UNSEONG_TRANSLATION_MAP: Record<string, { name: string; phase: string; meaning: string }> = {
  '장생': { name: '장생', phase: '성장', meaning: '새로운 탄생과 무한한 후원' },
  '목욕': { name: '목욕', phase: '도전', meaning: '매력 발산과 아찔한 시행착오' },
  '관대': { name: '관대', phase: '패기', meaning: '당당한 자아와 고집스런 전진' },
  '건록': { name: '건록', phase: '전성기', meaning: '능력 발휘와 사회적 인정' },
  '제왕': { name: '제왕', phase: '정점', meaning: '절대적 권력과 정점의 압박감' },
  '쇠': { name: '쇠', phase: '원숙', meaning: '물러남의 지혜와 깊은 통찰력' },
  '병': { name: '병', phase: '쇠퇴', meaning: '건강 유의 및 동정심 발현' },
  '사': { name: '사', phase: '정지', meaning: '육체적 정지와 정신적 탐구' },
  '묘': { name: '묘', phase: '저장', meaning: '수집, 저축, 무의식의 세계' },
  '절': { name: '절', phase: '단절', meaning: '바닥을 친 후의 새로운 기로' },
  '태': { name: '태', phase: '잉태', meaning: '불안정 속에서 싹트는 희망' },
  '양': { name: '양', phase: '양육', meaning: '안정적인 보살핌과 기획' }
};

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

function getTenGod(dayStem: any, targetStemOrBranch: any, isBranch = false): string {
  const dStem = safeChar(dayStem);
  const tStemOrBranch = safeChar(targetStemOrBranch);
  const dayInfo = STEM_INFO[dStem];
  const targetInfo = isBranch ? BRANCH_INFO[tStemOrBranch] : STEM_INFO[tStemOrBranch];
  
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
function get12Unseong(dayStem: any, branch: any): string {
  const gan = safeChar(dayStem)[0] || '';
  const zhi = safeChar(branch)[0] || '';
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

function get12Shinsal(basisBranch: any, targetBranch: any): string {
  const zhiMap: Record<string, string> = {
    '자': '子', '축': '丑', '인': '寅', '묘': '卯', '진': '辰', '사': '巳', '오': '午', '미': '未', '신': '申', '유': '酉', '술': '戌', '해': '亥',
    '子': '子', '丑': '丑', '寅': '寅', '卯': '卯', '辰': '辰', '巳': '巳', '午': '午', '未': '未', '申': '申', '酉': '酉', '戌': '戌', '亥': '亥'
  };

  const basis = zhiMap[safeChar(basisBranch)[0] || ''] || '子';
  const target = zhiMap[safeChar(targetBranch)[0] || ''] || '子';

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
  initialSectionId?: string;
}

export default function MyeongsimCoachingDashboard({
  isOpen = false,
  onClose,
  userProfile,
  initialSectionId
}: MyeongsimCoachingDashboardProps) {
  
  const { reportData } = useReportStore();

  const [activeModalData, setActiveModalData] = React.useState<any | null>(null);
  const [activeTab, setActiveTab] = React.useState<'dashboard' | 'report'>('dashboard');
  const [selectedSection, setSelectedSection] = React.useState<string | null>(null);
  const [sectionContent, setSectionContent] = React.useState<string | null>(null);
  const [isSectionLoading, setIsSectionLoading] = React.useState<boolean>(false);
  const [fetchingCache, setFetchingCache] = React.useState<boolean>(false);

  // 특정 섹션 클릭 시 수파베이스/로컬 캐시 확인
  
  // ── 갭 점수 동적 계산 및 모달 치유 기법 ──


  const handleSajuCellClick = (charOrObj: any, position: string) => {
    const char = safeChar(charOrObj);
    if (!char) return;
    const cleanChar = char[0];
    const trans = SAJU_TRANSLATION_MAP[cleanChar];
    if (trans) {
      const dayGan = safeChar(activeSaju?.fourPillars?.day?.gan);
      const dayJi = safeChar(activeSaju?.fourPillars?.day?.ji);
      const isGM = getGongmangBranches(dayGan, dayJi).includes(cleanChar) && position.includes('지지');
      setActiveModalData({
        type: 'saju',
        typeLabel: `명국성도 분석 (${position})`,
        mainIcon: isGM ? '🌌' : '💎',
        title: `내 운명의 고유 주파수 '${cleanChar}'${isGM ? ' (공망)' : ''}`,
        subtitle: trans.title,
        content: (
          <div className="space-y-4 font-sans text-left">
            <p className="text-xs text-slate-500 leading-relaxed font-medium">명국성도의 여덟 글자는 평생 자네를 수호하는 고유한 기질의 원천이자 마음의 소스코드라네.</p>
            {isGM && (
              <div className="bg-purple-50/50 border border-purple-200/50 p-4 rounded-xl">
                <span className="block font-bold text-purple-800 text-xs mb-1">🌌 공망(Void) 코칭 솔루션</span>
                <p className="text-[#4A4744] text-xs leading-relaxed font-semibold italic">
                  "이 자리는 공망(비워짐)의 자리라네. 남들보다 결핍을 더 강하게 느껴 집착하기 쉽지만, 사실 이 비워짐은 우주를 담아낼 수 있는 무한한 그릇이기도 하지. 집착을 버리고 마음을 편안히 할 때 가장 큰 재능이 폭발할 걸세!"
                </p>
              </div>
            )}
            <div className="bg-amber-50/50 border border-amber-200/50 p-4 rounded-xl">
              <span className="block font-bold text-amber-800 text-xs mb-1">🌿 이 글자가 품은 기질 메커니즘</span>
              <p className="text-[#4A4744] text-sm leading-relaxed">{trans.desc}</p>
            </div>
            <div className="bg-[#FFF9F0] border border-amber-200/40 p-4 rounded-xl">
              <span className="block font-bold text-amber-800 text-xs mb-1">💡 마음을 어루만지는 따뜻한 치유 편지</span>
              <p className="text-[#4A4744] text-sm leading-relaxed font-semibold italic">"{trans.advice}"</p>
            </div>
          </div>
        )
      });
    }
  };

  const handleMonthlyCellClick = (col: any) => {
    const tTrans = SIPSIN_TRANSLATION_MAP[col.tSip] || { title: col.tSip, desc: '해당 시기의 심리적 에너지 흐름' };
    const zTrans = SIPSIN_TRANSLATION_MAP[col.zSip] || { title: col.zSip, desc: '현실에서 나타나는 실질적 환경 변화' };
    const unNameClean = (col.un || '').replace(/\([가-힣]+\)/g, '').trim();
    const unTrans = UNSEONG_TRANSLATION_MAP[unNameClean] || { name: col.un, phase: '흐름', meaning: '현재 당신이 겪고 있는 주기' };
    setActiveModalData({
      type: 'monthly',
      typeLabel: '🗓️ 명심코칭 개인 맞춤형 운세 해석',
      mainIcon: '🗓️',
      title: `${col.date}의 마음챙김 리포트`,
      subtitle: `${col.tSip}과 ${col.zSip}이 교차하는 시기`,
      content: (
        <div className="space-y-4 font-sans text-left">
          <div className="bg-blue-50/50 border border-blue-200/50 p-4 rounded-xl">
            <span className="block font-bold text-blue-800 text-xs mb-1">🌤️ 마음의 날씨 (천간: {col.tSip}) - {tTrans.title}</span>
            <p className="text-[#4A4744] text-xs leading-relaxed">{tTrans.desc}</p>
          </div>
          <div className="bg-green-50/50 border border-green-200/50 p-4 rounded-xl">
            <span className="block font-bold text-green-800 text-xs mb-1">🌱 현실의 토양 (지지: {col.zSip}) - {zTrans.title}</span>
            <p className="text-[#4A4744] text-xs leading-relaxed">{zTrans.desc}</p>
          </div>
          <div className="bg-purple-50/50 border border-purple-200/50 p-4 rounded-xl">
            <span className="block font-bold text-purple-800 text-xs mb-1">🔄 운의 파동 (12운성: {unTrans.name}) - {unTrans.phase}기</span>
            <p className="text-[#4A4744] text-xs leading-relaxed">{unTrans.meaning}</p>
          </div>
          <p className="text-xs text-slate-500 italic font-medium mt-2">
            "이 시기에는 조급함을 내려놓고, 우주의 리듬에 당신의 호흡을 맞춰보세요."
          </p>
        </div>
      )
    });
  };

  const handleDaewoonCellClick = (col: any) => {
    const tTrans = SIPSIN_TRANSLATION_MAP[col.tSip] || { title: col.tSip, desc: '10년을 지배하는 마인드셋' };
    const zTrans = SIPSIN_TRANSLATION_MAP[col.zSip] || { title: col.zSip, desc: '10년간 깔리는 현실적 무대' };
    const unNameClean = (col.un || '').replace(/\([가-힣]+\)/g, '').trim();
    const unTrans = UNSEONG_TRANSLATION_MAP[unNameClean] || { name: col.un, phase: '흐름', meaning: '대운의 거대한 기운 주기' };
    setActiveModalData({
      type: 'daewoon',
      typeLabel: '🌊 10년 주기 대운(大運) 해석',
      mainIcon: '🌊',
      title: `${col.age}세 시작되는 새로운 챕터`,
      subtitle: `${col.gan}${col.ji} 대운의 파도 타기`,
      content: (
        <div className="space-y-4 font-sans text-left">
          <p className="text-xs text-slate-500 leading-relaxed font-medium">대운은 10년마다 바뀌는 당신 삶의 거대한 무대 배경이자 계절입니다.</p>
          <div className="bg-amber-50/50 border border-amber-200/50 p-4 rounded-xl">
            <span className="block font-bold text-amber-800 text-xs mb-1">생각의 틀 (천간: {col.tSip}) - {tTrans.title}</span>
            <p className="text-[#4A4744] text-xs leading-relaxed">{tTrans.desc}</p>
          </div>
          <div className="bg-[#FFF9F0] border border-amber-200/40 p-4 rounded-xl">
            <span className="block font-bold text-amber-800 text-xs mb-1">현실의 무대 (지지: {col.zSip}) - {zTrans.title}</span>
            <p className="text-[#4A4744] text-xs leading-relaxed">{zTrans.desc}</p>
          </div>
          <div className="bg-rose-50/50 border border-rose-200/40 p-4 rounded-xl">
            <span className="block font-bold text-rose-800 text-xs mb-1">에너지 스케일 (12운성: {unTrans.name}) - {unTrans.phase}</span>
            <p className="text-[#4A4744] text-xs leading-relaxed">{unTrans.meaning}</p>
          </div>
        </div>
      )
    });
  };


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
  const radarCoords = useMemo(() => {
    const maxVal = Math.max(tenGods.self, tenGods.output, tenGods.wealth, tenGods.power, tenGods.resource, 1);
    const getR = (val: number) => 10 + (val / maxVal) * 35; 
    
    const rSelf = getR(tenGods.self);
    const rOutput = getR(tenGods.output);
    const rWealth = getR(tenGods.wealth);
    const rPower = getR(tenGods.power);
    const rResource = getR(tenGods.resource);

    const angleSelf = -Math.PI / 2;
    const angleOutput = -Math.PI / 2 + (72 * Math.PI) / 180;
    const angleWealth = -Math.PI / 2 + (144 * Math.PI) / 180;
    const anglePower = -Math.PI / 2 + (216 * Math.PI) / 180;
    const angleResource = -Math.PI / 2 + (288 * Math.PI) / 180;

    const pSelf = { x: 50 + rSelf * Math.cos(angleSelf), y: 50 + rSelf * Math.sin(angleSelf) };
    const pOutput = { x: 50 + rOutput * Math.cos(angleOutput), y: 50 + rOutput * Math.sin(angleOutput) };
    const pWealth = { x: 50 + rWealth * Math.cos(angleWealth), y: 50 + rWealth * Math.sin(angleWealth) };
    const pPower = { x: 50 + rPower * Math.cos(anglePower), y: 50 + rPower * Math.sin(anglePower) };
    const pResource = { x: 50 + rResource * Math.cos(angleResource), y: 50 + rResource * Math.sin(angleResource) };

    const pointsStr = `${pSelf.x.toFixed(1)},${pSelf.y.toFixed(1)} ${pOutput.x.toFixed(1)},${pOutput.y.toFixed(1)} ${pWealth.x.toFixed(1)},${pWealth.y.toFixed(1)} ${pPower.x.toFixed(1)},${pPower.y.toFixed(1)} ${pResource.x.toFixed(1)},${pResource.y.toFixed(1)}`;
    return { pointsStr, pSelf, pOutput, pWealth, pPower, pResource };
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

  // ── 4. 겉과 속 갭 점수 동적 계산 (오행 편중도 & 십성 불균형도 연동) ──
  const gapScore = useMemo(() => {
    // 1) 오행 분포의 표준편차 계산 (쏠림 정도)
    const elArr = [elements.wood, elements.fire, elements.earth, elements.metal, elements.water];
    const elTotal = elArr.reduce((s, v) => s + v, 0) || 1;
    const elMean = elTotal / 5;
    const elVariance = elArr.reduce((s, v) => s + Math.pow(v - elMean, 2), 0) / 5;
    const elStdDev = Math.sqrt(elVariance);
    const ohaengGap = Math.min(100, Math.round(elStdDev * 38));

    // 2) 십성 불균형도 계산 (최대 격차)
    const tgArr = [tenGods.self, tenGods.output, tenGods.wealth, tenGods.power, tenGods.resource];
    const tgMax = Math.max(...tgArr);
    const tgMin = Math.min(...tgArr);
    const tgDiff = tgMax - tgMin;
    const sipsinGap = Math.min(100, Math.round(tgDiff * 18));

    const rawGap = Math.round(ohaengGap * 0.45 + sipsinGap * 0.55);
    return Math.max(18, Math.min(96, rawGap));
  }, [elements, tenGods]);

  
  // 🌌 5대 십성 그룹별 공망 여부 계산
  const sipsinGongmang = useMemo(() => {
    const dayGan = safeChar(activeSaju?.fourPillars?.day?.gan);
    const dayJi = safeChar(activeSaju?.fourPillars?.day?.ji);
    const gmBranches = getGongmangBranches(dayGan, dayJi);

    const result = { self: false, output: false, wealth: false, power: false, resource: false };
    if (gmBranches.length === 0) return result;

    const checkAndAssign = (ji: any) => {
      if (!ji) return;
      const cleanJi = safeChar(ji)[0];
      if (gmBranches.includes(cleanJi)) {
        const tenGod = getTenGod(dayGan, cleanJi, true);
        if (['비견', '겁재'].includes(tenGod)) result.self = true;
        if (['식신', '상관'].includes(tenGod)) result.output = true;
        if (['편재', '정재'].includes(tenGod)) result.wealth = true;
        if (['편관', '정관'].includes(tenGod)) result.power = true;
        if (['편인', '정인'].includes(tenGod)) result.resource = true;
      }
    };

    checkAndAssign(activeSaju?.fourPillars?.year?.ji);
    checkAndAssign(activeSaju?.fourPillars?.month?.ji);
    checkAndAssign(activeSaju?.fourPillars?.day?.ji);
    checkAndAssign(activeSaju?.fourPillars?.time?.ji);

    return result;
  }, [activeSaju]);

  // 십성 레이다 클릭 핸들러
  const handleSipsinRadarClick = (key: 'self' | 'output' | 'wealth' | 'power' | 'resource') => {
    const isGM = sipsinGongmang[key];
    const nameMap = {
      self: { label: '비겁 (비견/겁재)', title: '나다운 주권과 자립 (비겁) ✊', desc: '내면의 나를 지키는 든든한 뼈대이자, 자립심과 자아의 깊이를 상징합니다.' },
      output: { label: '식상 (식신/상관)', title: '창조적인 표현과 재능 (식상) 🎨', desc: '세상을 향해 내 지식과 끼를 발산하고, 맛깔나게 나를 표현하는 생명력입니다.' },
      wealth: { label: '재성 (편재/정재)', title: '현실감각과 결실 (재성) 💰', desc: '세상의 자원을 내 것으로 만들고, 공간을 장악하며 결실을 거두는 현실적 감각입니다.' },
      power: { label: '관성 (편관/정관)', title: '사회적 명예와 통제력 (관성) 🏛️', desc: '나를 절제하여 사회적 규범에 맞추고, 리더십과 명예를 지켜내는 힘입니다.' },
      resource: { label: '인성 (편인/정인)', title: '수용성과 깊은 통찰 (인성) 📚', desc: '세상의 지혜를 스펀지처럼 빨아들이고, 직관과 사랑으로 나를 채우는 힐링의 기운입니다.' }
    };
    const info = nameMap[key];

    setActiveModalData({
      type: 'radar',
      typeLabel: `십성 파동 분석 (${info.label})`,
      mainIcon: '🎯',
      title: info.title,
      subtitle: isGM ? '🌌 공망(Void) 상태 - 비워짐을 채우려는 강력한 영적 갈망' : '✨ 오롯이 빛나는 본질적 기질',
      content: (
        <div className="space-y-4 font-sans text-left">
          <p className="text-sm text-slate-600 leading-relaxed font-medium">{info.desc}</p>
          {isGM && (
            <div className="bg-purple-50/50 border border-purple-200/50 p-4 rounded-xl mt-4">
              <span className="block font-bold text-purple-800 text-xs mb-1">🌌 공망(Void) 코칭 솔루션</span>
              <p className="text-[#4A4744] text-xs leading-relaxed font-semibold italic">
                "현재 이 영역은 밑빠진 독처럼 채워도 채워지지 않는 공허함(공망)을 느끼기 쉬운 주파수입니다. 
                하지만 명심하시게. 비워져 있다는 것은 우주만큼 무한히 담을 수 있다는 뜻이라네. 
                집착을 내려놓고 마음을 편안하게 비울 때, 오히려 이 영역에서 남들이 흉내 낼 수 없는 비범한 천재성이 폭발할 걸세!"
              </p>
            </div>
          )}
        </div>
      )
    });
  };

  const handleSSRClick = () => {
    let titleText = '당신의 타고난 에너지 스케일';
    let modalContent = null;

    if (isOhaengGujok) {
      titleText = '🌈 오행구족(五行具足) - 조화와 포용의 아름다운 우주';
      modalContent = (
        <div className="space-y-4 font-sans text-left">
          <div className="bg-emerald-50/50 border border-emerald-200/50 p-5 rounded-2xl">
            <span className="block font-bold text-emerald-800 text-xs mb-1">🌈 오행구족 조화파 분석</span>
            <p className="text-[#4A4744] text-sm leading-relaxed">
              자네가 입력한 <strong>경신년 계미월 신사일 을미시</strong> 사주는 목(木), 화(火), 토(土), 금(金), 수(水) 다섯 가지 우주적 에너지가 단 하나도 빠짐없이 균형 있게 골고루 들어있는 <strong>오행구족(五行具足)</strong> 명식이라네! 
            </p>
            <p className="text-[#4A4744] text-xs leading-relaxed mt-2 italic font-semibold text-emerald-950">
              "사주에 빠진 기운이 없다는 것은 삶의 큰 굴곡이 적고, 어떤 가혹한 환경 변화나 스트레스 속에서도 스스로 중심을 되찾는 강인한 회복 탄력성과 뛰어난 적응력을 타고났음을 뜻하지. 모나거나 치우침 없이 세상을 넓게 수용하고 중재하는 거대한 포용력이 바로 자네의 핵심 무기라네."
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-1">
            <span className="block font-bold text-slate-800 text-xs">💡 조화파를 위한 명심 코칭 조언</span>
            <p className="text-slate-600 text-xs leading-relaxed">
              에너지가 한 곳으로 지나치게 쏠려 있지 않고 순환이 잘 되기 때문에, 억지로 남들처럼 유별나거나 뾰족하게 튀려고 애쓸 필요가 전혀 없네. 둥글고 원만하게 사람들을 감싸 안는 조화로운 주권이야말로 세상이 자네에게 기대하는 큰 덕목이라네. 자네가 가진 넉넉함과 안도감의 기류를 온전히 신뢰하시게.
            </p>
          </div>
        </div>
      );
    } else {
      const sipsinNames: Record<string, string> = {
        self: '비겁(🛡️ 주권)',
        output: '식상(💧 재능)',
        wealth: '재성(🪙 결과)',
        power: '관성(⚖️ 통제)',
        resource: '인성(📚 통찰)'
      };
      
      const sipsinArr = [
        { key: 'self', val: tenGods.self },
        { key: 'output', val: tenGods.output },
        { key: 'wealth', val: tenGods.wealth },
        { key: 'power', val: tenGods.power },
        { key: 'resource', val: tenGods.resource }
      ];
      sipsinArr.sort((a, b) => b.val - a.val);
      const dominantSipsin = sipsinNames[sipsinArr[0].key] || '특정 기운';

      titleText = `⚡ 특정 기질 집중형 - 한 분야의 스페셜리스트`;
      modalContent = (
        <div className="space-y-4 font-sans text-left">
          <div className="bg-amber-50/50 border border-amber-200/50 p-5 rounded-2xl">
            <span className="block font-bold text-amber-800 text-xs mb-1">⚡ 쏠림 기질 스페셜리스트 분석</span>
            <p className="text-[#4A4744] text-sm leading-relaxed">
              자네는 사주의 특정 영역({dominantSipsin})에 에너지가 아주 강렬하게 쏠려 있는 <strong>독특한 기류</strong>를 가졌네.
            </p>
            <p className="text-[#4A4744] text-xs leading-relaxed mt-2 italic font-semibold text-amber-950">
              "십성의 쏠림이나 불균형은 결코 흉이 아니라네. 현대 사회와 비즈니스 환경에서는 모든 분야를 어중간하게 아는 것보다, 한 분야에 미친 듯이 몰입하여 끝장을 보는 '오타쿠적 스페셜리스트'가 세상을 바꾼다네! 자네의 뾰족하게 날이 서 있는 재능은 하늘이 자네에게 준 강력한 특화 무기이니, 억지로 남들처럼 둥글어지거나 무던해지려고 스스로를 깎아내지 마시게."
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-1">
            <span className="block font-bold text-slate-800 text-xs">💡 스페셜리스트를 위한 명심 코칭 조언</span>
            <p className="text-slate-600 text-xs leading-relaxed">
              특화된 기운을 자신의 주 무대로 삼되, 빠져 있는 결핍 오행이 주는 취약성(충동성이나 과사고)만 자아 성찰을 통해 잔잔하게 인지하고 보완해주면 되네. 자네의 그 남다른 뾰족함이야말로 가장 위대한 차별성이라네.
            </p>
          </div>
        </div>
      );
    }

    setActiveModalData({
      type: 'ssr',
      typeLabel: '💎 대우주 기질 희소성 평가',
      mainIcon: '👑',
      title: titleText,
      subtitle: ssrBadge,
      content: modalContent
    });
  };

  // ── 4.2 갭 점수 디커플링 치유 기법 클릭 핸들러 (1:1 명심 코칭 솔루션 초고도화) ──
  const handleGapScoreClick = () => {
    const dayGan = safeChar(activeSaju?.fourPillars?.day?.gan);
    const dayJi = safeChar(activeSaju?.fourPillars?.day?.ji);
    const monthJi = safeChar(activeSaju?.fourPillars?.month?.ji);

    const jiToKor: Record<string, string> = {
      '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사',
      '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해',
      '자': '자', '축': '축', '인': '인', '묘': '묘', '진': '진', '사': '사',
      '오': '오', '미': '미', '신': '신', '유': '유', '술': '술', '해': '해'
    };

    const getJiDisplayName = (jiChar: string) => {
      const kor = jiToKor[jiChar] || jiChar;
      const ohaengInfo = BRANCH_INFO[jiChar];
      let hanjaOhaeng = '';
      if (ohaengInfo) {
        if (ohaengInfo.ohaeng === 'wood') hanjaOhaeng = '목(木)';
        else if (ohaengInfo.ohaeng === 'fire') hanjaOhaeng = '화(火)';
        else if (ohaengInfo.ohaeng === 'earth') hanjaOhaeng = '토(土)';
        else if (ohaengInfo.ohaeng === 'metal') hanjaOhaeng = '금(金)';
        else if (ohaengInfo.ohaeng === 'water') hanjaOhaeng = '수(Sub)'; // 물
      }
      const hanjaMap: Record<string, string> = {
        '자': '자', '축': '축', '인': '인', '묘': '묘', '진': '진', '사': '사',
        '오': '오', '미': '미', '신': '신', '유': '유', '술': '술', '해': '해'
      };
      const korChar = jiToKor[jiChar] || jiChar;
      return korChar + (hanjaMap[korChar] || jiChar) + '(' + (hanjaOhaeng || '물') + ')';
    };

    const dayJiSipsin = getTenGod(dayGan, dayJi, true);
    const monthJiSipsin = getTenGod(dayGan, monthJi, true);
    const dayJiFull = getJiDisplayName(dayJi);
    const monthJiFull = getJiDisplayName(monthJi);

    // 갭 점수별 동적 해설 문구
    let scoreFeedback = '';
    if (gapScore <= 30) {
      scoreFeedback = '현재 자네의 내면 갭 점수는 ' + gapScore + '점(안정)이라네. 겉마음과 속마음의 에너지가 아주 평화롭게 균형을 이루고 있군. 세상에 보여주는 모습과 본래 타고난 기질이 일치하여 마음에 걸림이 없고 투명한 상태일세. 이 고요한 평온함을 깊이 누리며 한걸음씩 나아가시게.';
    } else if (gapScore <= 60) {
      scoreFeedback = '현재 자네의 내면 갭 점수는 ' + gapScore + '점(경계)이라네. 사회적인 역할이나 관계 속의 책임을 다하느라 본래의 솔직한 기질을 조금 억누르며, 무의식 속에서 은근히 많은 에너지를 소모하고 있음을 의미하네. 마음속 피로가 조금씩 누적되고 있으니 지친 자신을 따뜻하게 위로해주시게.';
    } else {
      scoreFeedback = '현재 자네의 내면 갭 점수는 ' + gapScore + '점(요망)이라네. 세상이 기대하는 완벽한 페르소나(가면)를 유지하느라 내면에 심각한 에너지 불균형과 정신적 과부하가 걸려 있는 상태일세. 겉을 채우느라 속을 비워두진 않았는지 되돌아보고, 지금이야말로 스스로를 지키기 위해 멈춰야 할 때라네.';
    }

    const sipsinArr = [
      { key: 'self', name: '비겁(🛡️ - 나를 지키는 주권)', val: tenGods.self, tip: '자네는 내면에 스스로를 지키려는 방어막(비겁)이 지나치게 견고하여, 남에게 짐을 나누기보다 혼자 모든 것을 짊어지려다 탈진하기 쉬운 성향이 있네. "타인의 조언 경청하기"와 의도적으로 타인에게 도움을 한 가지 요청하는 훈련을 권장하네.' },
      { key: 'output', name: '식상(💧 - 맑은 지혜와 표현)', val: tenGods.output, tip: '자네는 생각이나 감정을 말과 행동으로 표현하려는 욕구(식상)가 풍부하여 쉽게 감정이 소모되거나 기복이 커지기 쉽다네. 감정이 요동칠 때 단 5초간 말하기를 멈추고 혀끝을 천장에 대어 에너지를 안으로 거두어들이는 훈련이 마음을 고요하게 해줄 걸세.' },
      { key: 'wealth', name: '재성(🪙 - 추구하는 재물과 결과)', val: tenGods.wealth, tip: '자네는 일의 결과를 서둘러 완성하고 통제하려는 성향(재성)이 과도해져, 조급함과 불면증이 뇌의 깊은 휴식을 방해하기 쉬운 기류를 가졌네. 잠들기 전 10분 동안 통제할 수 없는 내일의 일들은 모두 내려놓고, 오직 숨결에 주의를 모으는 훈련을 진행하시게.' },
      { key: 'power', name: '관성(⚖️ - 삶을 규율하는 통제와 평가)', val: tenGods.power, tip: '자네는 사회적 규범, 시선, 타인의 평가를 과하게 신경 쓰며 스스로를 엄격한 틀에 가두는 기운(관성)의 압박이 깊네. 번아웃이 오기 쉬우니 "지금의 사회적 역할은 연극 속 배역일 뿐"이라고 하루 세 번 인지적으로 자아를 분리(디커플링)해 보게.' },
      { key: 'resource', name: '인성(📚 - 깊은 학문과 통찰)', val: tenGods.resource, tip: '자네는 인풋과 생각, 고민이 머릿속에 너무 많이 고여 있어(인성) 정작 행동으로 나아가지 못하고 생각의 감옥에 갇히는 특징이 있네. 무언가 망설여질 때 5, 4, 3, 2, 1 카운트다운을 외치고 즉시 발걸음을 떼는 행동 개시 솔루션이 특효약이라네.' }
    ];
    sipsinArr.sort((a, b) => b.val - a.val);
    const dominantSipsin = sipsinArr[0];

    const dmChar = (dayGan || '甲')[0];
    let elementSolution = '';
    if (dmChar === '甲' || dmChar === '乙' || dmChar === '갑' || dmChar === '을') {
      elementSolution = '초록색 엽록소가 가득한 식물을 책상 위에 두고, 스트레스가 밀려올 때 잎사귀의 무늬를 가만히 1분간 응시하며 머리를 비워내 보시게. 목(木)의 싱그러움이 자네를 회복시켜 줄 걸세.';
    } else if (dmChar === '丙' || dmChar === '丁' || dmChar === '병' || dmChar === '정') {
      elementSolution = '방에 은은한 붉은 캔들이나 조명을 켜 두고, 흔들리는 불꽃을 멍하니 바라보는 불멍 호흡을 매주 10분씩 실행하시게. 과열된 감정의 화(火)를 평화롭게 다스려 줄 걸세.';
    } else if (dmChar === '戊' || dmChar === '己' || dmChar === '무' || dmChar === '기') {
      elementSolution = '흙의 묵직한 내음이 주는 샌달우드나 패출리 향의 에센셜 오일을 손목에 바르고 깊게 향을 들이마셔 보게. 둥둥 떠다니는 생각들을 대지(土)의 무게감으로 굳건히 잡아 줄 걸세.';
    } else if (dmChar === '庚' || dmChar === '辛' || dmChar === '경' || dmChar === '신') {
      elementSolution = '정갈하게 방을 청소해 불필요한 물건을 과감히 처분하고, 싱잉볼 사운드나 맑은 종소리를 감상하시게. 금(金) 특유의 예리한 긴장감을 부드러운 파동으로 이완해 줄 걸세.';
    } else {
      elementSolution = '미온수로 따뜻하게 통목욕을 하거나, 샤워할 때 물줄기가 정수리부터 자네 몸을 타고 흐르며 온갖 잡념과 피로를 대지로 씻어내린다고 깊이 심상화하시게. 수(水)의 맑은 순환이 일어날 걸세.';
    }

    setActiveModalData({
      type: 'gap',
      typeLabel: '🧘 내면 심리 갭(Gap) 분석 & 명심 코칭 솔루션',
      mainIcon: '🧘',
      title: '내면 갭 점수(' + gapScore + '점)와 자아 디커플링 코칭 가이드',
      subtitle: '내면의 본질(속마음)과 사회적 페르소나(겉마음)의 아름다운 조화',
      content: (
        <div className="space-y-6 font-sans text-left max-h-[60vh] overflow-y-auto pr-1">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 p-5 rounded-2xl shadow-sm space-y-3">
            <span className="block font-bold text-amber-900 text-xs">📊 초보자를 위한 갭(Gap) 점수 풀이</span>
            <p className="text-[#4A4744] text-sm leading-relaxed">
              갭 점수란 자네가 타고난 <strong>'본래의 속마음(기질)'</strong>과 세상에 보여주고 있는 <strong>'겉마음(사회적 페르소나)'</strong> 사이의 에너지 격차를 뜻하네.
            </p>
            <div className="bg-white/80 p-3.5 rounded-xl border border-amber-100 text-xs text-slate-700 leading-loose">
              📍 <strong>0 ~ 30점 (안정):</strong> 겉과 속이 매우 일치하여 편안하고 솔직하게 자아를 표현하고 있네.<br />
              📍 <strong>31 ~ 60점 (경계):</strong> 사회생활을 위해 본래 기질을 조금 억누르고 있어 은근한 심적 피로감이 쌓이는 중이라네.<br />
              📍 <strong>61 ~ 100점 (요망):</strong> 페르소나의 무게가 너무 무거워 내면 갈등과 정신적 과부하가 걸리기 쉬운 상태일세.
            </div>
            <p className="text-sm font-semibold text-amber-950 mt-1 border-t border-amber-200/40 pt-2 leading-relaxed">
              💡 {scoreFeedback}
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/60 p-5 rounded-2xl shadow-sm space-y-3">
            <span className="block font-bold text-purple-900 text-xs flex items-center gap-1">
              👁️ 1:1 사주 기질 기반 명심 코칭 솔루션
            </span>
            <p className="text-[#4A4744] text-sm leading-relaxed">
              사주 분석을 통해 내면 갈등을 일으키는 엉킨 실타래를 직시하고, 이를 조율하기 위한 자네만의 맞춤 행동과 공간 조율 기법을 조언하네.
            </p>

            <div className="space-y-3">
              <div className="bg-white p-3.5 rounded-xl border border-purple-100 space-y-1">
                <span className="block font-bold text-purple-950 text-xs flex items-center gap-1.5">
                  🛡️ 십성(육친) 불균형 족집게 진단: <span className="text-purple-700 font-extrabold">{dominantSipsin.name}</span>
                </span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {dominantSipsin.tip}
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-purple-100 space-y-1">
                <span className="block font-bold text-purple-950 text-xs flex items-center gap-1.5">
                  🔮 일간 기류 연계 환경 조율 비책: <span className="text-indigo-700 font-extrabold">({dmChar}) 오행 솔루션</span>
                </span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {elementSolution}
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-purple-100 space-y-1">
                <span className="block font-bold text-purple-950 text-xs">🧘 자아 디커플링 호흡 기법 (3-Minute Breathing Space)</span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  일이나 관계에서 숨이 턱 막힐 때, 단 3분간 하던 일을 멈추고 실행하시게.<br />
                  • <strong>1분 (알아차림):</strong> 지금 내 마음에 떠오른 스트레스와 감정을 있는 그대로 가만히 인지하네.<br />
                  • <strong>2분 (주의 집중):</strong> 모든 의식을 콧구멍을 통과하는 숨결과 들숨/날숨의 파동에만 집중하네.<br />
                  • <strong>3분 (확장):</strong> 집중된 에너지를 몸 전체의 감각과 공간 전체로 부드럽게 확장하여 고요함을 회복하네.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border-l-4 border-amber-500 p-5 rounded-r-2xl shadow-sm space-y-2">
            <span className="block font-bold text-amber-900 text-xs">🌿 자네의 운명 흐름에 띄우는 편지</span>
            <p className="text-[#3A3837] text-sm leading-relaxed italic font-medium">
              "자네는 사주에서 일지 {dayJiFull} {dayJiSipsin}이 주는 깊은 성향과 월지 {monthJiFull} {monthJiSipsin}의 운명적 에너지 흐름 속에서 늘 남몰래 번민하고 치열하게 고민해 왔을 것이네. 세상이 자네에게 요구하는 기준을 맞추느라(겉마음), 원래 자유롭고 지혜롭게 흘러야 할 내면의 우주(속마음)를 너무 조여매고 있었던 것은 아닌지 가만히 돌아보게나. 이제 그만 세상의 채찍질을 내려놓고, 자네 본연의 호흡이 지닌 맑은 리듬으로 천천히 돌아오시게. 자네는 무언가를 완벽히 입증해내지 않아도, 지금 숨 쉬고 있는 그대로 이미 더없이 온전하고 위대하다네."
            </p>
          </div>
        </div>
      )
    });
  };

  // ── 4.3 월별 재물/성취 운세 바 클릭 핸들러 (초고도화 1:1 공망 위로 카드 배너) ──
  const handleMonthlyBarClick = (item: { month: string; ji: string; score: number; status: string; isGM: boolean }) => {
    const dayGan = safeChar(activeSaju?.fourPillars?.day?.gan);
    const dayJi = safeChar(activeSaju?.fourPillars?.day?.ji);
    
    // 지지 한글명 및 동물
    const animal = ANIMAL_MAP[item.ji] || '';
    
    // 십신 획득
    const monthSipsin = getTenGod(dayGan, item.ji, true);
    
    let modalTitle = `${item.month} (${item.ji}달) 재물/성취 에너지 분석`;
    let modalContent = null;
    let modalSubtitle = `에너지 점수: ${item.score}점 · ${item.status === 'success' ? '기회의 구간' : item.status === 'danger' ? '조심의 구간' : '보통의 구간'}`;
    
    if (item.isGM) {
      modalTitle = `🌌 ${item.month} 특별 공망(空亡) 위로 카드 배너`;
      modalSubtitle = `비워짐으로써 비로소 더 크게 채우는 운명적 쉼표`;
      
      // 초보자 맞춤형 해설 문구
      modalContent = (
        <div className="space-y-6 font-sans text-left max-h-[60vh] overflow-y-auto pr-1">
          {/* 카드 배너 헤더 일러스트적 연출 */}
          <div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-purple-100 p-6 rounded-2xl shadow-lg border border-purple-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl font-serif">{item.ji}</div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-black uppercase tracking-wider mb-3">
              Void Cycle Solution
            </span>
            <h4 className="text-lg font-black text-white leading-snug">
              아이고, 자네! {item.month}({item.ji}월)은 하늘이 자네에게 준 '마음 청소 기간'이자 '영혼의 방학'이라네.
            </h4>
            <p className="text-xs text-purple-200/90 leading-relaxed mt-2.5">
              사주명리학에서 <strong>공망(空亡)</strong>이란 말 그대로 '구멍이 나 비어 있다'는 뜻일세. 초보자들은 이 단어만 들으면 가슴이 덜컥 내려앉지만, 실은 전혀 겁먹을 필요가 없다네! 밑 빠진 독처럼 채워도 채워지지 않는 이 시기는, 우주가 자네에게 <strong>"억지로 움켜쥐려 힘쓰지 말고, 잠시 손을 풀고 쉬어가라"</strong>며 마련해 준 특별한 '영혼의 안식년'이자 '성장의 징검다리'일세.
            </p>
          </div>

          {/* 1:1 맞춤형 족집게 진단 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-inner-sm space-y-4">
            <div className="border-b border-purple-100 pb-3">
              <span className="block text-xs font-bold text-purple-800 mb-1">🔍 1:1 사주 맞춤형 족집게 진단</span>
              <p className="text-sm text-slate-700 leading-relaxed">
                자네의 <strong>{dayGan}{dayJi} 일주</strong> 기류에 비추어 볼 때, 이 {item.month}은 지지 <strong>{item.ji}({animal})</strong>과 결합하여 <strong>{monthSipsin}</strong>의 에너지 작용이 공망을 겪게 되네. 이는 평소보다 재물이나 일적인 성취에 집착할수록 밑 빠진 독에 물을 붓듯 허무함을 느끼기 쉽다는 뜻이라네.
              </p>
            </div>

            {/* 환경 조율 비책 */}
            <div className="space-y-3.5">
              <span className="block text-xs font-bold text-slate-800">💡 {item.month}을 보내는 환경 조율 비책 (행동 솔루션)</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-100">
                  <span className="block font-black text-purple-950 text-xs mb-1">🚫 1. 외부적 확장 및 투자 금지</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    새로운 프로젝트 시작, 큰 액수의 재물 투자, 낯선 이와의 동업 등은 이번 달만큼은 보류하시게. 에너지가 밖으로 분산되면 피로감만 깊어지네.
                  </p>
                </div>
                
                <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
                  <span className="block font-black text-emerald-950 text-xs mb-1">📖 2. 공부와 내면의 내실 다지기</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    비어 있는 공간은 지혜로 채워야 하네. 책을 읽거나, 미뤄두었던 공부를 하거나, 명심 일기를 쓰며 마인드 컨트롤을 하는 데 아주 최적의 시기일세.
                  </p>
                </div>

                <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-100">
                  <span className="block font-black text-amber-950 text-xs mb-1">🧘 3. 에고 비우기 3분 호흡법</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    하루에 한 번, 내면에 스쳐 지나가는 욕심과 불안감을 내쉬는 호흡에 태워 멀리 날려보내는 '비움 명상 리추얼'을 단 3분간 실행해 보게나.
                  </p>
                </div>

                <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
                  <span className="block font-black text-blue-950 text-xs mb-1">🏡 4. 머무는 공간 청소 리추얼</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    물리적인 공간이 비워지면 내면의 혼란도 함께 정돈되네. 책상 위를 깨끗이 닦고 불필요한 서류를 정리하는 것만으로도 운의 흐름이 치유되네.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 감동 멘토링 편지 */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-5 rounded-r-2xl shadow-sm">
            <span className="block font-bold text-amber-900 text-xs mb-1">✉️ 자네에게 띄우는 감동의 편지</span>
            <p className="text-[#3A3837] text-xs leading-relaxed italic font-medium">
              "자네, 겨울철 앙상해진 나뭇가지를 본 적이 있는가? 나뭇잎을 다 떨어뜨린 그 모습이 흉해 보일지 몰라도, 사실 나무는 그 비워냄을 통해 매서운 겨울바람을 견디고 따뜻한 봄에 더 풍요로운 새싹을 틔울 준비를 하는 것이라네. 지금 자네의 인생 시계에서 {item.month}은 바로 그 '아름다운 비움의 계절'일세. 조급해하지 마시게. 남들과 비교하며 자신을 채찍질하지도 마시게. 이번 달만큼은 자네의 지친 몸과 영혼을 안아주고 맛있는 밥 한 끼 사주며 다독여 주게나. 비워진 그릇에 우주가 머지않아 더 값진 지혜와 축복을 가득 채워줄 것임을 내가 보증하겠네."
            </p>
          </div>
        </div>
      );
    } else {
      // 일반월 혹은 대길월 클릭 시 피드백
      const statusText = item.status === 'success' ? '대길(大吉)의 기류가 흐르는 시기' : item.status === 'danger' ? '매사 돌다리도 두드려야 하는 조심의 시기' : '무난하고 평온하게 흘러가는 보통의 시기';
      const statusIcon = item.status === 'success' ? '🚀' : item.status === 'danger' ? '🛡️' : '✨';
      const detailFeedback = item.status === 'success' 
        ? '이 달은 자네가 가진 재능과 운의 파도가 가장 높게 치솟는 최고의 타이밍일세! 가슴 속에 품어왔던 아이디어나 비즈니스 계획이 있다면 과감하게 도전을 밀어붙여 보시게. 하늘이 자네의 발걸음을 힘차게 밀어줄 것이니 머뭇거릴 틈이 없다네.'
        : item.status === 'danger'
        ? '이 달은 하늘의 기류가 잠시 숨을 고르며 거친 비바람을 보내는 시기일세. 무리한 확장이나 계약서 작성, 과도한 지출은 피하시고, 현상을 유지하며 스스로의 마음을 다스리는 보수적 전략이 최고라네. 이럴 때일수록 틈틈이 휴식을 취해주시게.'
        : '이 달은 잔잔한 호수처럼 평화롭고 무난한 흐름이라네. 큰 무리 없이 일상이 순탄하게 흘러갈 것이니, 일상의 사소한 행복을 즐기고 평범함의 위대함을 감사하며 성실히 자리를 지키면 대길의 계절로 향하는 징검다리가 되어줄 걸세.';

      modalContent = (
        <div className="space-y-4 font-sans text-left">
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
            <span className="block font-bold text-slate-800 text-xs mb-1">📊 {item.month} 흐름도 분석</span>
            <p className="text-[#4A4744] text-sm leading-relaxed">
              자네의 오행 원소(일간 중심) 순환 알고리즘에 기초한 {item.month} 운명지표는 <strong>{item.score}점</strong>으로 <strong>{statusText}</strong>에 해당하네.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed mt-3 pt-3 border-t border-slate-200">
              {statusIcon} <strong>코칭 솔루션:</strong> {detailFeedback}
            </p>
          </div>
        </div>
      );
    }

    setActiveModalData({
      type: 'monthly_gongmang',
      typeLabel: `월별 재물/성취 에너지 진단`,
      mainIcon: item.isGM ? '🌌' : '📈',
      title: modalTitle,
      subtitle: modalSubtitle,
      content: modalContent
    });
  };


  // ── 5. 월별 재물/성취 흐름 데이터 계산 ──
  const monthlyScores = useMemo(() => {
    const total = (elements.wood + elements.fire + elements.earth + elements.metal + elements.water) || 5;
    const wPct = elements.wood / total;
    const fPct = elements.fire / total;
    const ePct = elements.earth / total;
    const mPct = elements.metal / total;
    const waPct = elements.water / total;

    const baseScores = [
      { month: '1월', ji: '寅', score: 40 + waPct * 50 + ePct * 10 },
      { month: '2월', ji: '卯', score: 45 + wPct * 40 + waPct * 10 },
      { month: '3월', ji: '辰', score: 55 + wPct * 50 },
      { month: '4월', ji: '巳', score: 50 + wPct * 30 + ePct * 20 },
      { month: '5월', ji: '午', score: 65 + fPct * 40 + wPct * 10 },
      { month: '6월', ji: '未', score: 70 + fPct * 50 },
      { month: '7월', ji: '申', score: 60 + fPct * 30 + ePct * 20 },
      { month: '8월', ji: '酉', score: 50 + mPct * 40 + fPct * 10 },
      { month: '9월', ji: '戌', score: 65 + mPct * 50 },
      { month: '10월', ji: '亥', score: 55 + mPct * 30 + ePct * 20 },
      { month: '11월', ji: '子', score: 45 + waPct * 40 + mPct * 10 },
      { month: '12월', ji: '丑', score: 40 + waPct * 50 }
    ];

    const dayGan = safeChar(activeSaju?.fourPillars?.day?.gan);
    const dayJi = safeChar(activeSaju?.fourPillars?.day?.ji);
    const gmBranches = getGongmangBranches(dayGan, dayJi);

    return baseScores.map(item => {
      const isGM = gmBranches.includes(item.ji) || gmBranches.includes(ANIMAL_MAP[item.ji]);
      // 공망인 경우 에너지가 약간 감쇄함을 명리학적으로 표현 (10% 감쇄하되 최소 35 유지)
      const finalScore = isGM ? Math.max(35, Math.round(item.score * 0.9)) : Math.round(item.score);
      const rounded = Math.max(35, Math.min(98, finalScore));
      
      let status = 'warning';
      if (rounded >= 70) status = 'success';
      else if (rounded < 50) status = 'danger';
      
      return { month: item.month, ji: item.ji, score: rounded, status, isGM };
    });
  }, [elements, activeSaju]);

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

  const isOhaengGujok = useMemo(() => {
    return elements.wood >= 1 && elements.fire >= 1 && elements.earth >= 1 && elements.metal >= 1 && elements.water >= 1;
  }, [elements]);

  // 대우주 기질 등급 (SSR, SR 등)
  const ssrBadge = useMemo(() => {
    if (isOhaengGujok) {
      return '👑 희소성: SSR 등급 (오행구족 조화파)';
    }
    const isSpecial = tenGods.self >= 3 || tenGods.output >= 3 || tenGods.wealth >= 3 || tenGods.power >= 3 || tenGods.resource >= 3;
    return isSpecial ? '👑 희소성: SSR 등급 (상위 0.1% 스페셜)' : '💎 등급: SR 등급 (상위 1.5%)';
  }, [tenGods, isOhaengGujok]);

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
              <span 
                onClick={handleSSRClick}
                className="cursor-pointer inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-xs font-bold rounded-full shadow-sm animate-pulse hover:brightness-110 transition-all"
              >
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
                    <div onClick={() => handleSajuCellClick(activeSaju.fourPillars?.time?.gan, '시주 천간')} className={`cursor-pointer hover:bg-amber-50/50 hover:ring-2 hover:ring-amber-400 transition-all p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 ${
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
                    <div onClick={() => handleSajuCellClick(activeSaju.fourPillars?.day?.gan, '일주 천간(기질)')} className={`cursor-pointer hover:bg-amber-50/50 hover:ring-2 hover:ring-amber-400 transition-all p-2.5 rounded-lg border-2 ring-2 ring-amber-500/20 flex flex-col items-center justify-center gap-1 ${
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
                    <div onClick={() => handleSajuCellClick(activeSaju.fourPillars?.month?.gan, '월주 천간')} className={`cursor-pointer hover:bg-amber-50/50 hover:ring-2 hover:ring-amber-400 transition-all p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 ${
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
                    <div onClick={() => handleSajuCellClick(activeSaju.fourPillars?.year?.gan, '년주 천간')} className={`cursor-pointer hover:bg-amber-50/50 hover:ring-2 hover:ring-amber-400 transition-all p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 ${
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
                    <div onClick={() => handleSajuCellClick(activeSaju.fourPillars?.time?.ji, '시주 지지')} className={`cursor-pointer hover:bg-amber-50/50 hover:ring-2 hover:ring-amber-400 transition-all p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 ${
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
                    <div onClick={() => handleSajuCellClick(activeSaju.fourPillars?.day?.ji, '일주 지지')} className={`cursor-pointer hover:bg-amber-50/50 hover:ring-2 hover:ring-amber-400 transition-all p-2.5 rounded-lg border-2 ring-2 ring-amber-500/20 flex flex-col items-center justify-center gap-1 ${
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
                    <div onClick={() => handleSajuCellClick(activeSaju.fourPillars?.month?.ji, '월주 지지')} className={`cursor-pointer hover:bg-amber-50/50 hover:ring-2 hover:ring-amber-400 transition-all p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 ${
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
                    <div onClick={() => handleSajuCellClick(activeSaju.fourPillars?.year?.ji, '년주 지지')} className={`cursor-pointer hover:bg-amber-50/50 hover:ring-2 hover:ring-amber-400 transition-all p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 ${
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
                    <polygon points={radarCoords?.pointsStr} fill="rgba(245, 158, 11, 0.2)" stroke="#F59E0B" strokeWidth="1.5" />
                    
                    {/* 텍스트 축 라벨 */}
                    {/* 공망 꼭짓점 마커 오버레이 */}
                    {sipsinGongmang.self && <circle cx={radarCoords?.pSelf?.x} cy={radarCoords?.pSelf?.y} r="3" fill="none" stroke="#A78BFA" strokeWidth="1" className="animate-pulse" />}
                    {sipsinGongmang.output && <circle cx={radarCoords?.pOutput?.x} cy={radarCoords?.pOutput?.y} r="3" fill="none" stroke="#A78BFA" strokeWidth="1" className="animate-pulse" />}
                    {sipsinGongmang.wealth && <circle cx={radarCoords?.pWealth?.x} cy={radarCoords?.pWealth?.y} r="3" fill="none" stroke="#A78BFA" strokeWidth="1" className="animate-pulse" />}
                    {sipsinGongmang.power && <circle cx={radarCoords?.pPower?.x} cy={radarCoords?.pPower?.y} r="3" fill="none" stroke="#A78BFA" strokeWidth="1" className="animate-pulse" />}
                    {sipsinGongmang.resource && <circle cx={radarCoords?.pResource?.x} cy={radarCoords?.pResource?.y} r="3" fill="none" stroke="#A78BFA" strokeWidth="1" className="animate-pulse" />}

                    {/* 투명한 클릭 감지 원형 영역 (모바일/웹 터치 편의성 극대화) */}
                    <circle cx={radarCoords?.pSelf?.x} cy={radarCoords?.pSelf?.y} r="6" fill="transparent" className="cursor-pointer" onClick={() => handleSipsinRadarClick('self')} />
                    <circle cx={radarCoords?.pOutput?.x} cy={radarCoords?.pOutput?.y} r="6" fill="transparent" className="cursor-pointer" onClick={() => handleSipsinRadarClick('output')} />
                    <circle cx={radarCoords?.pWealth?.x} cy={radarCoords?.pWealth?.y} r="6" fill="transparent" className="cursor-pointer" onClick={() => handleSipsinRadarClick('wealth')} />
                    <circle cx={radarCoords?.pPower?.x} cy={radarCoords?.pPower?.y} r="6" fill="transparent" className="cursor-pointer" onClick={() => handleSipsinRadarClick('power')} />
                    <circle cx={radarCoords?.pResource?.x} cy={radarCoords?.pResource?.y} r="6" fill="transparent" className="cursor-pointer" onClick={() => handleSipsinRadarClick('resource')} />

                    <text x="50" y="2" textAnchor="middle" onClick={() => handleSipsinRadarClick('self')} className="text-[5px] font-bold fill-[#8A8473] cursor-pointer hover:fill-amber-600">비겁 (자비){sipsinGongmang.self ? '🌌' : ''}</text>
                    <text x="97" y="37" textAnchor="start" onClick={() => handleSipsinRadarClick('output')} className="text-[5px] font-bold fill-green-600 cursor-pointer hover:fill-amber-600">식상 (표현)★{sipsinGongmang.output ? '🌌' : ''}</text>
                    <text x="80" y="94" textAnchor="middle" onClick={() => handleSipsinRadarClick('wealth')} className="text-[5px] font-bold fill-[#8A8473] cursor-pointer hover:fill-amber-600">재성 (분별){sipsinGongmang.wealth ? '🌌' : ''}</text>
                    <text x="20" y="94" textAnchor="middle" onClick={() => handleSipsinRadarClick('power')} className="text-[5px] font-bold fill-red-500 cursor-pointer hover:fill-amber-600">관성 (통제)⚠️{sipsinGongmang.power ? '🌌' : ''}</text>
                    <text x="3" y="37" textAnchor="end" onClick={() => handleSipsinRadarClick('resource')} className="text-[5px] font-bold fill-[#8A8473] cursor-pointer hover:fill-amber-600">인성 (통찰){sipsinGongmang.resource ? '🌌' : ''}</text>
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
            <div 
              onClick={handleGapScoreClick}
              className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-[#EBE7DC] pt-6 md:pt-0 md:pl-8 cursor-pointer group hover:bg-[#FAF9F5] p-4 rounded-2xl transition-all duration-300"
            >
              <h3 className="text-sm font-bold text-[#5C5856] mb-4 group-hover:text-amber-700 transition-colors">자네의 겉과 속 갭(Gap) 점수</h3>
              <div className="relative w-36 h-36 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
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
                  <span className="text-3xl font-black text-[#2C2A29] group-hover:text-amber-800 transition-colors">{gapScore}</span>
                  <span className="text-xs block text-gray-400 font-bold tracking-tight">갭 점수</span>
                </div>
              </div>
              <p className="text-xs text-center text-[#6E6A66] leading-relaxed mt-4 max-w-xs font-medium">
                100점 만점 기준 · 높을수록 피로도와 내면의 갈등이 깊음을 뜻하네. <span className="text-red-500 font-bold underline group-hover:text-red-600">명심 코칭 솔루션 가이드</span>가 추천되네.
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
                
                if (item.isGM) {
                  barColor = 'bg-gradient-to-t from-purple-500 via-indigo-500 to-purple-600 border border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)] animate-pulse';
                  textColor = 'text-purple-600 font-extrabold';
                } else if (item.status === 'success') {
                  barColor = 'bg-emerald-500';
                  textColor = 'text-emerald-600';
                } else if (item.status === 'danger') {
                  barColor = 'bg-rose-500';
                  textColor = 'text-rose-500';
                }

                return (
                  <div 
                    key={idx} 
                    onClick={() => handleMonthlyBarClick(item)}
                    className="flex flex-col items-center flex-1 min-w-[32px] group cursor-pointer hover:scale-105 transition-all duration-300"
                  >
                    <span className={`text-xs font-bold ${textColor} mb-1 opacity-90 group-hover:scale-110 transition-transform flex items-center gap-0.5`}>
                      {item.score}
                      {item.isGM && <span className="text-[10px] animate-bounce">🌌</span>}
                    </span>
                    <div 
                      className={`w-full max-w-[18px] ${barColor} rounded-t-sm transition-all duration-1000 ease-out origin-bottom hover:brightness-95`}
                      style={{ height: `${item.score * 1.3}px` }}
                    ></div>
                    <span className={`text-[11px] font-medium mt-2 whitespace-nowrap ${item.isGM ? 'text-purple-700 font-black' : 'text-gray-500'}`}>
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 상태 안내 라벨 */}
            <div className="flex justify-center flex-wrap gap-4 mt-4 text-xs font-semibold text-[#5C5856]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>올해 타이밍의 달</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-400 rounded-full"></span>보통의 달</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span>조심해야 하는 달</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-full animate-pulse"></span>공망월(비움의 달) 🌌</span>
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
                      <th key={idx} onClick={() => handleMonthlyCellClick(col)} className={`cursor-pointer hover:bg-rose-50/50 py-3 px-3 border-r border-[#EAE6DB] min-w-[100px] ${col.active ? 'ring-2 ring-rose-500 ring-inset bg-rose-50/30' : ''}`}>{col.date} 🔍</th>
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
                      <th key={idx} onClick={() => handleDaewoonCellClick(col)} className={`cursor-pointer hover:bg-red-50/50 py-3 px-3 border-r border-[#EAE6DB] min-w-[100px] ${col.isActive ? 'ring-4 ring-red-500 ring-inset bg-red-50/30' : ''}`}>{col.isActive ? '현재 대운' : `${idx + 1}대운`} 🔍</th>
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
    <>
      <div className="fixed inset-0 z-[1050] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-slate-200">
          {content}
        </div>
      </div>
      
      {/* 🔮 팝업 치유 모달 */}
      {activeModalData && (
        <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-[#FAF9F5] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-amber-200/50 relative transform transition-all max-h-[85vh] overflow-y-auto text-[#2C2A29]">
            <button
              onClick={() => setActiveModalData(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors border border-slate-200 shadow-sm"
            >
              <X size={18} />
            </button>
            <div className="text-left mb-5 border-b border-amber-100 pb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm mb-3">
                {activeModalData.mainIcon} {activeModalData.typeLabel}
              </span>
              <h3 className="text-xl font-black text-[#1F1E1D] font-serif tracking-tight">{activeModalData.title}</h3>
              {activeModalData.subtitle && <p className="text-xs font-semibold text-amber-600 mt-1">{activeModalData.subtitle}</p>}
            </div>
            <div>{activeModalData.content}</div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveModalData(null)}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 text-white font-bold text-xs rounded-xl shadow-md transition-all duration-200"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
