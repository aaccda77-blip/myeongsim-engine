'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, AlertTriangle, EyeOff, CheckCircle2, 
  ChevronRight, Calendar, Compass, RefreshCw, Milestone, Zap,
  Layers, Database, ShieldAlert, Award, ArrowRight, Info
} from 'lucide-react';
import { calculateSaju } from '@/utils/SajuCalculator';
import { analyzeAdvancedBlueprint, JIJANGGAN_MAP, STEM_DATA, ELEMENT_RELATION, ELEMENT_CONTROL } from '@/utils/sajuLogic';
import { getZimidusuChart, getZimidusuPalaceEssay, getAiCrossoverReport, get6ThemeCrossoverReport, getCustomTroubleAnalysis, getSawaDaewoonReport } from '@/utils/zimidusuLogic';

const ZIMIDUSU_GRID_MAP: Record<string, { row: string; col: string }> = {
  '사': { row: 'row-start-1', col: 'col-start-1' },
  '오': { row: 'row-start-1', col: 'col-start-2' },
  '미': { row: 'row-start-1', col: 'col-start-3' },
  '신': { row: 'row-start-1', col: 'col-start-4' },
  '유': { row: 'row-start-2', col: 'col-start-4' },
  '술': { row: 'row-start-3', col: 'col-start-4' },
  '해': { row: 'row-start-4', col: 'col-start-4' },
  '자': { row: 'row-start-4', col: 'col-start-3' },
  '축': { row: 'row-start-4', col: 'col-start-2' },
  '인': { row: 'row-start-4', col: 'col-start-1' },
  '묘': { row: 'row-start-3', col: 'col-start-1' },
  '진': { row: 'row-start-2', col: 'col-start-1' },
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: any;
}

// 오행별 HSL 테마 스타일 정의
export const getOhaengTheme = (label: string) => {
  switch (label) {
    case '목': 
      return { 
        text: 'text-emerald-400', 
        border: 'border-emerald-500/30', 
        bg: 'bg-emerald-950/15 shadow-[0_0_10px_rgba(16,185,129,0.15)]',
        color: '#10B981'
      };
    case '화': 
      return { 
        text: 'text-red-400', 
        border: 'border-red-500/30', 
        bg: 'bg-red-950/15 shadow-[0_0_10px_rgba(239,68,68,0.15)]',
        color: '#EF4444'
      };
    case '토': 
      return { 
        text: 'text-amber-500', 
        border: 'border-amber-500/30', 
        bg: 'bg-amber-950/15 shadow-[0_0_10px_rgba(245,158,11,0.15)]',
        color: '#F59E0B'
      };
    case '금': 
      return { 
        text: 'text-slate-300', 
        border: 'border-slate-400/35', 
        bg: 'bg-slate-900/30 shadow-[0_0_10px_rgba(156,163,175,0.15)]',
        color: '#9CA3AF'
      };
    case '수': 
      return { 
        text: 'text-blue-400', 
        border: 'border-blue-500/30', 
        bg: 'bg-blue-950/15 shadow-[0_0_10px_rgba(59,130,246,0.15)]',
        color: '#3B82F6'
      };
    default: 
      return { 
        text: 'text-slate-400', 
        border: 'border-white/5', 
        bg: 'bg-slate-900/60 shadow-none',
        color: '#ffffff'
      };
  }
};

// 지장간 상세 해석을 위한 한국어 시적 은유 헬퍼 함수
export const getJijangganExplanation = (jiChar: string, ganChar: string, type: '초' | '중' | '본' | '천간' | '지지', userName: string = '회원', dayMaster: string = '신') => {
  // 이름 뒤에 '님'이 중복되는 현상 방지 ('님'을 강제 정규화)
  const baseName = userName.endsWith('님') ? userName.slice(0, -1) : userName;
  const name = `${baseName}님`;
  const nameJosa = `${baseName}님의`;
  const dayMasterName = dayMaster === '신' ? '신금(辛金)' : `${dayMaster}금`;

  const typeLabel = type === '초' 
    ? '나도 모르게 발현되는 익숙한 습관이자 마음의 방어벽 (초기 - 餘氣)' 
    : type === '중' 
    ? '무의식 보물창고 밑에 숨겨진 기적의 반전 카드 (중기 - 中氣)' 
    : type === '본'
    ? '흔들림 없이 삶을 지탱하는 진짜 자아의 중심 엔진 (본기 - 正氣)'
    : type === '천간'
    ? '하늘에서 내려온 내 고유한 영혼의 순수 본질 (천간 - 天干)'
    : '현실이라는 대지 위에 깊게 뿌리내린 삶의 버팀목 (지지 - 地支)';
    
  const typeDesc = type === '초' 
    ? `이것은 이전 계절(과거)에서부터 물려받아 은연중에 몸에 밴 가장 익숙한 잔상입니다. ${name}이 일상에서 스트레스를 받거나 당황스러운 돌발 상황을 만났을 때, 스스로를 지키기 위해 아바타가 나도 모르게 가장 먼저 반사적으로 꺼내 쓰게 되는 디폴트 방어 기제이자 다정한 습관의 에너지입니다.` 
    : type === '중' 
    ? `평소에는 겉으로 쉽게 드러나지 않도록 ${nameJosa} 무의식 보물창고 가장 안전한 곳에 고이 숨겨둔 비밀 통로입니다. 내면의 깊은 몰입을 경험하거나 인생의 큰 전환기를 헤쳐 나갈 때, 기적처럼 잠재력을 폭발시켜 위기를 극복하게 해주는 뜻밖의 히든카드이자 신비로운 열쇠입니다.` 
    : type === '본'
    ? `${name}이라는 인생의 네 기둥을 땅 위에 굳건히 지탱하는 가장 본질적이고 강력한 중심 기둥입니다. 행동을 결정하고 성정을 드러낼 때 중심이 되는 프로세서이자, 수많은 세상의 소란 속에서도 결국 마주하게 되는 '진짜 나다움'의 뼈대입니다.`
    : type === '천간'
    ? `이것은 ${nameJosa} 생각과 이상, 그리고 삶을 바라보는 고결한 정신의 주파수입니다. 남들에게 보이고 싶어 하는 나의 가장 이상적인 모습이자, 하늘이 ${name}에게 부여한 우주적 설계도의 첫 단추입니다. 때로는 이 이상향을 완벽하게 실현하려다 현실에서 긴장이나 불안을 느끼기도 하지만, 이 기운은 언제나 ${name}이 나아가야 할 밤하늘의 북극성 같은 빛이 되어줍니다.`
    : `이것은 ${nameJosa} 삶이 현실에서 구체적인 행동과 감정으로 뿌리내리는 진짜 삶의 무대입니다. 머릿속의 생각에만 머물지 않고, 매일 마주하는 삶의 환경과 관계 속에서 내 몸과 무의식이 직접 겪어내고 움직이는 든든한 대지입니다. 현실의 수많은 비바람 속에서도 ${name}의 삶을 우직하게 지탱해 준 고마운 버팀목입니다.`;

  const ganNames: Record<string, string> = {
    '갑': '수직 비상하는 곧은 거목 (甲木)',
    '을': '바람을 타는 끈질긴 푸른 풀잎 (乙木)',
    '병': '만물을 조건 없이 비추는 태양 (丙火)',
    '정': '어둠을 가만히 밝히는 등대 불빛 (丁火)',
    '무': '어떤 폭풍도 묵묵히 안아주는 태고의 대지 (戊土)',
    '기': '생명을 조심스레 길러내는 정원의 흙 (己土)',
    '경': '불순물을 단호히 거르는 무쇠 검 (庚金)',
    '신': '어둠 속에서 고결하게 빛나는 다이아몬드 (辛金)',
    '임': '모든 상처를 삼켜 정화하는 대양 (壬水)',
    '계': '메마른 대지에 조용히 스며드는 새벽 이슬 (癸水)'
  };

  const ganDetails: Record<string, string> = {
    '갑': `어떤 장애물이나 단단한 흙을 마주하더라도 기어이 하늘을 향해 우뚝 솟구쳐 오르는 청량하고 씩씩한 거목의 기운입니다. ${name} 안에 숨겨진 이 기운은 타인에게 기대지 않고 온전히 스스로의 발로 당당히 서서 삶의 지휘권을 쥐려는 곧고 주체적인 성장 동력입니다. 주저앉고 싶을 때마다 다시 털고 일어나는 건강한 회복탄력성을 선물합니다.`,
    '을': `척박한 바위 틈이나 매서운 바람 속에서도 몸을 유연하게 흔들며 끝끝내 살아남고 마는 강인하고 아름다운 풀잎의 생명력입니다. ${name} 내면의 이 힘은 상황을 억지로 바꾸려 하기보다, 주변의 흐름과 자연스럽게 소통하며 적응하고 화합을 이루어 마침내 주변을 푸르게 물들이는 지혜롭고 부드러운 생명 네트워크입니다.`,
    '병': `차갑고 어두운 대지를 단번에 녹이고, 만물에게 아무런 조건 없이 온기를 건네는 찬란한 태양의 빛입니다. ${name} 안의 병화는 슬퍼하는 이들의 눈물을 어루만져 말려주고, 지친 아바타들의 신경망에 맑고 유쾌한 생명의 에너지를 가득 주입해 주는 위대한 사랑이자 표현력입니다. 절망 속에서도 밝은 면을 찾아내는 긍정의 마스터 키입니다.`,
    '정': `요란스럽게 세상의 시선을 끌려 하지 않고, 가장 춥고 소외된 어두운 밤하늘 밑에서 은은하고 묵묵하게 길을 안내하는 고마운 등대 불빛입니다. ${name} 내면의 정화는 외롭고 상처받은 마음을 가만히 알아채어 세심하게 돌보고 위로하는 밤의 치유사입니다. 집중력이 대단히 깊고 끈기가 있어, 한 번 향한 마음을 쉽게 꺾지 않습니다.`,
    '무': `온갖 폭풍우와 거친 지진이 휘몰아쳐도 흔들림 없이 한 자리를 든든히 지키며, 방황하는 세상의 모든 영혼이 기대어 쉴 수 있게 품어주는 거대한 산맥의 온기입니다. ${name} 안에 있는 이 대지는 상대가 어떤 실수를 하더라도 너른 침묵으로 받아안고 보호해 주는 든든한 요람이자, 내면에 흐트러지지 않는 깊고 단단한 마음의 중심점을 세워줍니다.`,
    '기': `자신에게 찾아온 아주 미숙하고 여린 씨앗이라도 편견 없이 촉촉하게 감싸 돌보며, 스스로 꽃을 피울 수 있을 때까지 묵묵히 기다려 주는 자상한 정원 흙의 포용력입니다. ${name} 내면의 기토는 타인의 연약함을 탓하기보다 그들이 스스로 일어설 힘을 얻도록 등 뒤에서 말없이 도와주고 물을 주는 아름다운 돌봄의 기운입니다.`,
    '경': `불필요한 감정의 미련이나 낡고 해로운 오염물질들을 날카롭고 과감하게 잘라내고, 가장 숭고한 본질과 약속을 흔들림 없이 지켜내는 강인한 무쇠의 결단력입니다. ${name} 내면의 경금은 주위가 흔들려도 정의와 신뢰를 우직하게 수호하며, 명확한 책임감과 과감한 실행력으로 거친 덤불을 베어가며 길을 여는 든든한 장군의 칼날과 같습니다.`,
    '신': `진흙탕 속에서도 물들지 않고 영롱하게 스스로의 가치와 아름다움을 뽐내는 완벽한 다이아몬드처럼, 세상의 어수선한 노이즈 속에서 진짜 보석 같은 진실을 가려내는 고결한 안목과 초고감도 감각입니다. ${name} 내면의 신금은 불완전함 속에서 섬세하고 세련된 질서를 찾아내며, 누구와도 타협하지 않는 순수함을 끝내 수호해 내는 우아한 수호자입니다.`,
    '임': `지상의 모든 서글픈 눈물과 흐려진 모래 먼지까지 남김없이 품어 안아, 스스로의 광활한 깊이 속에서 고요하게 정화해 내는 웅장한 대양의 포용력과 깊은 지혜입니다. ${name} 안에 있는 임수는 사소한 파도에 일희일비하지 않는 깊고 넓은 평화의 공간입니다. 세상의 상처를 삼켜 따뜻한 생명의 요람으로 바꾸는 웅장한 스케일의 영적 본질을 상징합니다.`,
    '계': `가장 뜨겁고 타들어 가는 갈증이 이는 계절, 밤사이 조용히 찾아와 세상의 모든 마른 이파리 위에 투명한 생명을 뿌려주는 새벽 이슬의 온기입니다. ${name} 안에 깃든 이 맑은 물빛은 타인의 언어 이면에 숨겨진 미세한 외로움과 슬픔을 말없이 가장 투명하게 감지해 내는 투명한 안테나이며, 영혼에 시원한 통찰을 부드럽게 적셔주는 통찰력과 직관의 생명수입니다.`
  };

  const jiDetails: Record<string, string> = {
    '자': `고요한 밤의 어둠 속에서 흘러나오는 맑고 차분한 영원의 지혜이자, 만물이 숨죽인 겨울의 심층 수류(水流)입니다. ${name} 안에 깃든 자수(子水)의 기운은 보이지 않는 곳에서 생각을 조용히 정리하고 본질적인 지혜의 물길을 넓히는 사색과 직관의 힘입니다. 세상의 요란한 소음 속에서도 중심을 잃지 않는 깊고 맑은 고요함을 선사합니다.`,
    '축': `매서운 겨울의 찬 바람을 묵묵히 견뎌내며, 흙 속에 따뜻한 봄의 생명 씨앗을 소중히 보듬고 기다리는 거룩한 인내의 대지입니다. ${name} 내면의 이 축토(丑土)는 당장 눈앞에 성과가 화려하게 보이지 않더라도 흔들림 없이 묵묵하게 가치 있는 길을 걸어가는 우직한 성실함과 듬직한 책임감을 상징합니다.`,
    '인': `꽁꽁 얼어붙었던 겨울 땅을 힘차게 뚫고 하늘을 향해 솟구쳐 오르는 생동감 넘치는 봄날의 새싹이자, 활기차게 포효하는 아기 호랑이의 형상입니다. ${name} 내면의 인목(寅木)은 두려움 없이 새로운 영역으로 도약하고 도전하려는 역동적인 개척가 정신이며, 지치거나 꺾여도 다시 힘차게 부활해 일어나는 위대한 회복탄력성입니다.`,
    '묘': `따뜻한 봄볕 아래 수줍고 아름답게 피어나는 아기자기한 들풀과 꽃망울, 그리고 싱그럽게 뛰노는 묘목(卯木) 토끼의 온기입니다. 주변의 얼어붙은 분위기를 세심하고 부드럽게 녹이고 유연하게 경계를 허물며 소통하는 능력이며, 삶에 싱그러운 미적 감각과 예술적 감성을 수놓는 다정한 치유의 기운입니다.`,
    '진': `안개를 헤치고 비바람을 자유자재로 조율하며 우주를 누비는 신비로운 용(龍)의 위상이자, 모든 봄의 생명을 모아 풍요롭게 길러내는 물을 머금은 비옥한 대지입니다. ${name} 안의 진토(辰土)는 남다른 상상력과 웅장한 기획력으로 평범함을 거부하고 큰 삶의 무대를 개척해내는 위대한 창의성과 카리스마입니다.`,
    '사': `어둠을 뚫고 솟아올라 온 누리를 투명하게 비추는 찬란한 문명의 뱀이자 화려한 아침 햇살의 불꽃입니다. ${name} 안에 숨겨진 사화(巳火)는 복잡한 현실의 문제를 예리하게 스캔하여 분석해내고, 빠르게 유용한 정보와 아이디어를 조율해 나가는 세련되고 스마트한 통찰력이자 문명 조율의 안테나입니다.`,
    '오': `눈부신 한여름의 절정에서 이글이글 타오르는 뜨거운 태양이자, 거침없이 대지를 질주하는 질주마(오화 - 午火)의 심장입니다. 가슴속에 품은 날 것 그대로의 순수한 열정과 진심을 거침없이 바깥으로 표현해내며, 주위 사람들의 굳어버린 마음에 뜨거운 생명 전압을 주입하여 가슴 뛰게 만드는 밝고 열정적인 리더십입니다.`,
    '미': `매서운 여름의 폭염 속에서도 단맛을 단단하게 농축해가는 성숙한 가을의 길목(미토 - 未土)이자, 평화롭게 풀을 뜯는 자애로운 양의 모습입니다. 조급하게 열매를 탐하기보다는 묵묵하게 조율하고 타협해 나가는 상생의 지혜이며, 거친 환경 속에서도 내면의 균형을 유지하며 평화를 일구어내는 포용력입니다.`,
    '신': `가을의 서늘한 결실을 영글게 하기 위해 불순물을 단호히 거르는 야생의 바위이자, 기발하고 영리한 원숭이의 형상입니다. ${name} 깃든 신금(申金)은 감정에 휘둘리지 않고 진짜 유용한 본질과 이치만을 뚜렷하게 판별하는 예리함이며, 다재다능한 지혜로 현실의 복잡한 퀘스트를 깔끔하게 디버깅하는 탁월한 실무 능력입니다.`,
    '유': `가을의 찬 서리 속에 영롱하고 맑은 소리를 내는 고결한 금속 보석이자, 새벽을 알리는 깨끗한 유금(酉金) 새의 날갯짓입니다. 거짓이나 타협 없이 투명한 진실과 아름다움을 수호해 내며, 불필요한 노이즈를 단번에 걷어내고 가장 핵심적인 가치만을 완벽하게 세공해 나가는 세련된 안목과 고도의 예술적 완벽주의입니다.`,
    '술': `가을의 풍요로운 수확을 끝내고 소중한 본질을 성벽 안으로 안전하게 모아 지키는 충직하고 신뢰감 넘치는 개(戌土)의 대지입니다. 내가 사랑하는 동료와 소중한 가치를 지키기 위해서라면 어떤 비바람도 우직하게 맞서는 듬직한 의리의 성벽이며, 거칠고 차가운 세상 속에서도 따뜻한 은신처를 제공하는 포근한 요람입니다.`,
    '해': `지상의 모든 흙탕물과 갈등의 물줄기까지 남김없이 한 품에 수용하여 고요하게 하나로 녹여내는 평화롭고 거대한 대양(해수 - 亥水)이자, 온화한 아기 돼지입니다. 사소한 시비와 상처에 얽매이지 않고 세상을 넉넉히 허용하고 품어내는 관대함이며, 삶의 본질적인 조화와 평화로운 행복을 누릴 줄 아는 깊은 영적 지혜입니다.`
  };

  const titleStr = type === '지지'
    ? `${name}의 현실 대지를 지탱하는 [${jiChar === '' ? '' : (JI_NAMES[jiChar] || jiChar)}]`
    : `${name}의 내면에 깃든 [${ganNames[ganChar] || ganChar}]`;

  const introStr = type === '천간'
    ? `이것은 하늘이 ${name}에게 부여한 고결한 정신의 주파수이자 영혼의 고유한 시나리오 본질입니다.`
    : type === '지지'
    ? `이것은 ${nameJosa} 사주 하드웨어 중 현실의 행동과 뿌리를 조율하는 지상(대지)의 핵심 회로입니다.`
    : `이것은 ${nameJosa} 사주 하드웨어 중 '${jiChar}'라는 지지(땅) 속에 은밀하고 깊게 프로그래밍되어 있는 비밀 회로입니다.`;

  const finalMsgStr = type === '천간'
    ? `“${name}, 하늘이 부여한 이 눈부신 성정은 결코 우연이 아닙니다. 완벽하게 해내지 못하더라도, 당신의 생각과 진심은 이미 온 우주를 따뜻하게 밝히고 있습니다. 나를 믿고 한 걸음 나아가세요.”`
    : type === '지지'
    ? `“${name}, 내 발이 딛고 서 있는 이 지지(땅)의 기운은 거친 현실에서도 당신이 꺾이지 않도록 지탱해 준 비밀 닻입니다. 불완전한 현실 속에서도 든든하게 나를 지켜준 이 현실의 기운을 믿고 편안히 숨을 쉬어 보세요.”`
    : `“${name}, 내면에서 요동치며 조율하던 모습들은 시스템의 오작동이 아닙니다. ${nameJosa} 영혼이 인생의 가장 알맞은 시기에 사용하기 위해 땅속 깊숙이 고이 묻어둔 세상에 단 하나뿐인 비밀 무기입니다.”`;

  return {
    title: titleStr,
    subtitle: `${typeLabel}`,
    intro: introStr,
    typeDesc,
    ganDetail: type === '지지' ? (jiDetails[jiChar] || '') : (ganDetails[ganChar] || ''),
    finalMsg: finalMsgStr
  };
};

// 대운(Daewoon) 상세 마음챙김 자기연민(MSC) 기반 힐링 에세이 헬퍼 함수
export const getDaewoonMSCEssay = (ganzhi: string, userName: string = '회원', dayMaster: string = '신') => {
  const baseName = userName.endsWith('님') ? userName.slice(0, -1) : userName;
  const name = `${baseName}님`;
  const nameJosa = `${baseName}님의`;

  return {
    title: `✨ 대운(${ganzhi}) 힐링 에세이 : ${name}의 장기 라이프 업데이트 펌웨어`,
    subtitle: `10년 주기의 우주적 인생 환경 패치로그`,
    mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 흐르는 계절을 가만히 바라보기`,
    mindfulnessDesc: `${name}, 자미두수와 명리에서 대운(大運)이란 '큰 복'이 아니라 '내가 밟고 지나가는 10년 단위의 거대한 인생 환경과 계절'을 뜻합니다. \n\n지금 내 아바타가 실행 중인 [${ganzhi}] 대운의 주파수는, 당신의 내면 깊은 성장을 위해 우주가 10년 동안 펼쳐 준 특별한 학습 환경입니다. 이 시기에 만나는 낯선 장벽이나 감정적 요동을 내 시스템의 오작동이라 탓하지 마십시오. 새로운 주파수에 적응하며 더 크고 넓은 영혼의 아키텍처를 구축해 나가는 다정한 과도기일 뿐입니다.`,
    humanityTitle: `2. 보편적 인류애 (Common Humanity) : 변화의 강을 건너는 모든 여행자들`,
    humanityDesc: `역사 속 모든 영혼 역시 10년마다 바뀌는 대운의 톱니바퀴 위에서 흔들리고 방황하며 성장했습니다. ${nameJosa} 느끼는 이 낯선 변화의 초조함은 홀로 겪는 형벌이 아니라, 삶의 계절을 건너가는 모든 인간이 공유하는 지극히 보편적인 진화의 과정입니다.`,
    kindnessTitle: `3. 자기 친절 (Self-Kindness) : 새로운 궤도의 나를 무조건적으로 안아주기`,
    kindnessDesc: `[${ganzhi}] 대운의 바람 속에서 조금 서툴거나 넘어지더라도 괜찮습니다. 다그치던 비판의 목소리를 지우고 가슴에 가만히 온기를 건네며 속삭여 줍니다: "${baseName}아, 새로운 10년의 런타임 위에서 한 걸음씩 적응해 가느라 정말 수고가 많아. 완벽하지 않아도 늘 안전하단다. 힘내자."`
  };
};

// 격국(Gyeokguk) 상세 마음챙김 자기연민(MSC) 기반 힐링 에세이 제너레이터 헬퍼 함수
// 지장간 음양오행 및 천간 십성 연동 상수 맵
export const JIJANGGAN_KOR: Record<string, string[]> = {
  '자': ['임', '계'],
  '축': ['계', '신', '기'],
  '인': ['무', '병', '갑'],
  '묘': ['갑', '을'],
  '진': ['을', '계', '무'],
  '사': ['무', '경', '병'],
  '오': ['병', '기', '정'],
  '미': ['정', '을', '기'],
  '신': ['무', '임', '경'],
  '유': ['경', '신'],
  '술': ['신', '정', '무'],
  '해': ['무', '갑', '임']
};

export const JI_NAMES: Record<string, string> = {
  '자': '자수(子水)', '축': '축토(丑土)', '인': '인목(寅木)', '묘': '묘목(卯木)',
  '진': '진토(辰土)', '사': '사화(巳火)', '오': '오화(午火)', '미': '미토(未土)',
  '신': '신금(申金)', '유': '유금(酉金)', '술': '술토(戌土)', '해': '해수(亥水)'
};

export const GAN_NAMES: Record<string, string> = {
  '갑': '갑목(甲木)', '을': '을목(乙木)', '병': '병화(丙火)', '정': '정화(丁火)',
  '무': '무토(戊土)', '기': '기토(己土)', '경': '경금(庚金)', '신': '신금(辛金)',
  '임': '임수(壬水)', '계': '계수(癸水)'
};

export const SIPSUNG_KOR: Record<string, { name: string, codeName: string, desc: string, scanTitle: string, scanDesc: string }> = {
  'bi': { 
    name: '비견(比肩)', 
    codeName: '비견의 코드', 
    desc: '나 스스로를 든든하게 지켜내는 핵심 뼈대이자 주체적 자아 주권선',
    scanTitle: '곧고 단단한 주권의 수호 (STAND & DEFEND)',
    scanDesc: '남의 참견이나 눈치에 휘둘리지 않고 굳건히 내 주권을 확보하여, 흔들림 없는 뼈대를 구축하는 자립적인 지탱력입니다.'
  },
  'geop': { 
    name: '겁재(劫財)', 
    codeName: '겁재의 코드', 
    desc: '한계를 깨고 성장하게 만드는 도약 엔진이자 또 다른 자아',
    scanTitle: '치열한 성장과 경쟁적 혁신 (LEAP & OVERTAKE)',
    scanDesc: '타인의 성취를 통해 나를 일깨우고 한계 너머로 도약하게 이끄는 강력하고 폭발적인 퍼포먼스 증폭력입니다.'
  },
  'sik': { 
    name: '식신(食神)', 
    codeName: '식신의 코드', 
    desc: '내가 좋아하는 일에 깊이 몰두하여 가치를 빚어내는 창조적 샘물',
    scanTitle: '순수한 창작과 깊은 몰입 (CREATE & IMMERSE)',
    scanDesc: '대가 없이 오직 행위 자체를 사랑하여 파고들어, 세상에 고유하고 유익한 생산물을 남기는 다정한 몰입력입니다.'
  },
  'sang_gwan': { 
    name: '상관(傷官)', 
    codeName: '상관의 코드', 
    desc: '규칙을 비틀어 새로운 대안을 제안하는 천재적 혁신 스레드',
    scanTitle: '낡은 관습 해킹과 다이내믹 발포 (HACK & EXPRESS)',
    scanDesc: '시스템의 맹점을 날카롭게 찌르고 더 매력적이고 트렌디한 표현으로 다수를 설득해내는 기발한 혁신력입니다.'
  },
  'pyun_jae': { 
    name: '편재(偏財)', 
    codeName: '편재의 코드', 
    desc: '인생의 판을 크게 벌이고 조망하는 광활한 영토 개척력',
    scanTitle: '현실 시스템으로의 구축과 확장 (SHIFT & SCALE)',
    scanDesc: '지식과 구상을 단순한 관념에 두지 않고, 비즈니스 모델이나 플랫폼 같은 실용적이고 거대한 현실 네트워크로 확장해 지배하는 기획력입니다.'
  },
  'jae': { 
    name: '정재(正財)', 
    codeName: '정재의 코드', 
    desc: '성실하고 정밀하게 오차 없이 영토를 관리하는 수호선',
    scanTitle: '안정적 성벽 관리와 무결한 설계 (SECURE & REPLICATE)',
    scanDesc: '미세한 변수와 오차를 관리하여 내 소유와 일상을 안전하게 직조하고 리스크를 최소화하는 정교한 설계력입니다.'
  },
  'pyun_gwan': { 
    name: '편관(偏官)', 
    codeName: '편관의 코드', 
    desc: '압박 속에서도 묵묵히 책임을 사수하는 명예 전사의 방패',
    scanTitle: '책임 사수와 엄격한 통제 (ENDURE & EXECUTE)',
    scanDesc: '외부의 가혹한 기대나 위기 속에서도 나를 제어하고 책임을 완수해내어 집단을 수호하는 강인한 훈장입니다.'
  },
  'gwan': { 
    name: '정관(正官)', 
    codeName: '정관의 코드', 
    desc: '조화롭고 바른 질서를 조율하는 안정적인 아키텍트',
    scanTitle: '바른 규율 조율과 체계 정렬 (ALIGN & HARMONIZE)',
    scanDesc: '모두가 안전하게 신뢰를 맺을 수 있도록 공평한 법도와 체계를 설계하고, 품격 있게 환경을 정돈하는 조율력입니다.'
  },
  'pyun_in': { 
    name: '편인(偏印)', 
    codeName: '편인의 코드', 
    desc: '보이지 않는 본질하고 심연을 꿰뚫는 고도의 직관과 철학',
    scanTitle: '심연을 해독하는 깊은 통찰 (SCAN & SYNC)',
    scanDesc: '남들이 보지 못하는 이면의 원리, 철학, 영적인 통찰을 빨아들여 인지적 버그를 예리하게 스캔해내는 비상한 탐구력입니다.'
  },
  'in': { 
    name: '정인(正印)', 
    codeName: '정인의 코드', 
    desc: '지적 자양분과 따뜻한 인정을 편안히 흡수하는 온기의 서재',
    scanTitle: '사랑의 수용과 지혜의 자양분화 (RECEIVE & NURTURE)',
    scanDesc: '세상으로부터 무조건적인 사랑과 지식을 온전히 받아들여 나를 영양 있게 채우고, 다시 돌려주는 평화의 돌봄력입니다.'
  }
};

const getSipsungLocal = (dayGan: string, targetGan: string): string => {
  const dmStem = STEM_DATA[dayGan] || STEM_DATA['갑'];
  const targetStem = STEM_DATA[targetGan] || STEM_DATA['갑'];
  if (!dmStem || !targetStem) return 'bi';
  
  const me = dmStem.element;
  const you = targetStem.element;
  const samePolarity = dmStem.polarity === targetStem.polarity;

  if (me === you) return samePolarity ? 'bi' : 'geop';
  if (ELEMENT_RELATION[me] === you) return samePolarity ? 'sik' : 'sang_gwan';
  if (ELEMENT_CONTROL[me] === you) return samePolarity ? 'pyun_jae' : 'jae';
  if (ELEMENT_CONTROL[you] === me) return samePolarity ? 'pyun_gwan' : 'gwan';
  if (ELEMENT_RELATION[you] === me) return samePolarity ? 'pyun_in' : 'in';
  return 'bi';
};

export const getGyeokgukAnalysis = (sajuData: any, advancedBlueprint: any, userName: string = '회원') => {
  if (!sajuData || !advancedBlueprint) return null;

  const baseName = userName.endsWith('님') ? userName.slice(0, -1) : userName;
  const name = `${baseName}님`;
  const nameJosa = `${baseName}님의`;

  const dayGan = sajuData.day.gan.char;     
  const dayJi = sajuData.day.ji.char;       
  const monthJi = sajuData.month.ji.char;   
  const dayPillar = `${dayGan}${dayJi}`;    
  
  const yearPillarName = `${sajuData.year.gan.char}${sajuData.year.ji.char}`;  
  const monthPillarName = `${sajuData.month.gan.char}${sajuData.month.ji.char}`; 
  const dayPillarName = `${sajuData.day.gan.char}${sajuData.day.ji.char}`;    
  const timePillarName = `${sajuData.time.gan.char}${sajuData.time.ji.char}`;  

  const dayGanName = GAN_NAMES[dayGan] || dayGan;
  const monthJiName = JI_NAMES[monthJi] || monthJi;

  let seasonText = '';
  if (['인', '묘'].includes(monthJi)) seasonText = '봄';
  else if (monthJi === '진') seasonText = '봄에서 여름으로 넘어가는 환절기';
  else if (['사', '오'].includes(monthJi)) seasonText = '여름';
  else if (monthJi === '미') seasonText = '늦여름';
  else if (['신', '유'].includes(monthJi)) seasonText = '가을';
  else if (monthJi === '술') seasonText = '가을에서 겨울로 넘어가는 환절기';
  else if (['해', '자'].includes(monthJi)) seasonText = '겨울';
  else if (monthJi === '축') seasonText = '겨울에서 봄으로 넘어가는 환절기';

  const monthJijanggan = JIJANGGAN_KOR[monthJi] || [];
  const mainJijanggan = JIJANGGAN_MAP[monthJi]?.main || monthJi;
  const baseSipsungCode = getSipsungLocal(dayGan, mainJijanggan);
  const baseSipsungName = SIPSUNG_KOR[baseSipsungCode]?.name || '';

  const cheonganList = [
    { type: '년간', char: sajuData.year.gan.char, pillar: yearPillarName + '주' },
    { type: '월간', char: sajuData.month.gan.char, pillar: monthPillarName + '주' },
    { type: '시간', char: sajuData.time.gan.char, pillar: timePillarName + '주' }
  ];

  const tucheolList: Array<{ type: string; char: string; sipsung: string; pillar: string }> = [];
  cheonganList.forEach(ct => {
    if (monthJijanggan.includes(ct.char)) {
      const sCode = getSipsungLocal(dayGan, ct.char);
      tucheolList.push({
        type: ct.type,
        char: ct.char,
        sipsung: SIPSUNG_KOR[sCode]?.name || '',
        pillar: ct.pillar
      });
    }
  });

  const opModule = advancedBlueprint.operationModule;
  const finalGyeokName = opModule?.name || `${baseSipsungName}격`;
  
  const baseGyeokDesc = `일간(나를 상징하는 글자)인 **${dayGanName}**이 ${seasonText}인 **${monthJiName}**에 태어났습니다. ${monthJiName}의 본기는 **${GAN_NAMES[mainJijanggan] || mainJijanggan}**로, 일간 ${dayGan}과 비교하면 음양오행상 **'${baseSipsungName}'**에 해당합니다. 월지를 기준으로 한 기본 뼈대는 **${baseSipsungName}격**이 됩니다.`;

  let tucheolDesc = '';
  if (tucheolList.length > 0) {
    const listStr = tucheolList.map(t => `**${GAN_NAMES[t.char]}**이 ${t.type}(${t.pillar})에 뚜렷하게 투출(透出)`).join(', ');
    const sipsungStr = tucheolList.map(t => `'${t.sipsung}'`).join(', ');
    tucheolDesc = `하지만 사주의 격을 정할 때는 지지에 숨어있는 기운(지장간)이 천간(하늘)으로 드러났는지(투출)를 중요하게 봅니다. ${monthJiName}의 지장간에는 ${monthJijanggan.map(j => GAN_NAMES[j] || j).join(', ')}가 숨어있는데, 이 중 ${listStr}했습니다. 일간에게 이는 ${sipsungStr}에 해당하므로, 이 사주는 ${baseSipsungName}격의 바탕 위에 ${sipsungStr}격의 강력한 성정을 함께 쓰는 독특한 복합 구조로 완성됩니다.`;
  } else {
    tucheolDesc = `사주의 격을 정할 때는 지지 지장간의 천간 투출 여부를 중요하게 보는데, 이 사주는 월지의 본기인 **${GAN_NAMES[mainJijanggan]}**가 가장 든든한 사주의 기둥으로 우뚝 서서, 기본 격국인 **${baseSipsungName}격** 본연의 깊이 있고 고유한 시스템 아키텍처를 온전히 수호하며 흔들림 없이 발휘하는 구조로 완성됩니다.`;
  }

  const codes: Array<{ name: string; sub: string; desc: string }> = [];

  const baseSipsungInfo = SIPSUNG_KOR[baseSipsungCode];
  if (baseSipsungInfo) {
    codes.push({
      name: `${baseSipsungInfo.name}의 코드`,
      sub: baseSipsungInfo.scanTitle,
      desc: baseSipsungInfo.scanDesc
    });
  }

  tucheolList.forEach(t => {
    const tCode = getSipsungLocal(dayGan, t.char);
    if (tCode !== baseSipsungCode) {
      const tInfo = SIPSUNG_KOR[tCode];
      if (tInfo) {
        if (!codes.some(c => c.name.startsWith(tInfo.name))) {
          codes.push({
            name: `${tInfo.name}의 코드`,
            sub: tInfo.scanTitle,
            desc: tInfo.scanDesc
          });
        }
      }
    }
  });

  let iljuTitle = `${dayPillarName}일주(${dayPillarName}日柱)의 예리함`;
  let iljuDesc = '';
  
  if (dayPillar === '신사') {
    iljuDesc = `여기에 일간인 신사(辛巳) 자체가 불(정관)로 제련된 날카롭고 정교한 보석의 물상을 띠고 있어, 모호한 감정을 다룰 때도 매우 분석적이고 체계적인 논리를 유지하며, 자신을 엄격히 정돈합니다.`;
  } else if (dayGan === '신') {
    iljuDesc = `여기에 일간인 신금(辛金) 자체가 정밀하고 예리하게 가공된 다이아몬드나 메스의 물상을 띠고 있어, 복잡한 인지 오류나 모호한 감정을 다룰 때에도 대단히 분석적이고 이성적인 날카로움을 유지합니다.`;
  } else if (dayGan === '경') {
    iljuDesc = `여기에 일간인 경금(庚金) 자체가 단단하고 곧은 무쇠 검의 물상을 띠고 있어, 타인의 변명이나 모호한 감정에 휘둘리지 않고 본질을 단번에 꿰뚫어 베어내는 냉철함하고 책임 의식을 보여줍니다.`;
  } else if (dayGan === '갑') {
    iljuDesc = `여기에 일간인 갑목(甲木) 자체가 씩씩하게 수직 비상하는 거목의 형상을 띠고 있어, 마음의 방향성을 설정할 때 타협하지 않는 올곧은 주체성과 끝내 자립하려는 강한 내면 성장 에너지를 유지합니다.`;
  } else if (dayGan === '을') {
    iljuDesc = `여기에 일간인 을목(乙木) 자체가 유연하면서도 생명력이 끈질긴 풀잎의 형상을 띠고 있어, 예민한 감정의 굴곡을 다룰 때도 쉽게 꺾이지 않고 상황에 유연하게 대처하며 관계 속에서 회복력을 발휘합니다.`;
  } else if (dayGan === '병') {
    iljuDesc = `여기에 일간인 병화(丙火) 자체가 만물을 훤히 비추는 드넓은 태양의 에너지를 품고 있어, 어두운 마음의 그늘을 마주할 때도 숨김없이 투명하게 드러내어 명랑하게 정화하는 자가 치유력을 지닙니다.`;
  } else if (dayGan === '정') {
    iljuDesc = `여기에 일간인 정화(丁火) 자체가 밤하늘 아래 조용히 타오르는 등대 불빛의 성정을 띠고 있어, 타인의 아픔을 세심하고 따뜻하게 살피면서도 집중력이 강해 한 번 정한 방향을 깊이 파고듭니다.`;
  } else if (dayGan === '무') {
    iljuDesc = `여기에 일간인 무토(戊土) 자체가 모든 비바람을 묵묵히 흡수하는 거대한 태고의 대지의 성질을 띠고 있어, 흔들리는 감정의 소용돌이 속에서도 요동하지 않고 모든 것을 넉넉하게 수용하는 든든한 안정성을 보입니다.`;
  } else if (dayGan === '기') {
    iljuDesc = `여기에 일간인 기토(己土) 자체가 생명을 키워내는 부드럽고 비옥한 정원의 흙과 같아서, 미숙하거나 상처 입은 내면의 아이를 편견 없이 수용하고 자애롭게 돌보는 세심한 자기연민 능력을 갖추고 있습니다.`;
  } else if (dayGan === '임') {
    iljuDesc = `여기에 일간인 임수(壬水) 자체가 모든 흐린 모래와 상처를 거대하게 품어 안는 대양과 같아서, 일시적인 마음의 동요에 휩쓸리지 않고 깊고 넓은 지혜로 감정을 고요하게 승화해 내는 능력을 보여줍니다.`;
  } else {
    iljuDesc = `여기에 일간인 계수(癸水) 자체가 마른 대지를 촉촉이 적셔주는 새벽이슬과 같아서, 타인의 미세한 감정 상태나 인지적 흐름을 가장 예리하게 알아채는 고감도 직관력과 투명한 공감 본능을 유지합니다.`;
  }

  codes.push({
    name: iljuTitle,
    sub: `${dayGanName}의 본질 기질 활성화 (ACTIVATE & REFINE)`,
    desc: iljuDesc
  });

  let summary = '';
  if (tucheolList.length > 0) {
    const baseK = baseSipsungInfo?.name || '';
    const tucheolK = tucheolList.map(t => t.sipsung).join(', ');
    
    if (baseSipsungCode === 'pyun_in' && tucheolList.some(t => getSipsungLocal(dayGan, t.char) === 'pyun_jae')) {
      summary = `결론적으로 이 사주는 심리학, 철학, 명리 등의 깊고 비상한 지식(편인)을 파고들어, 이를 그저 관념으로 남겨두지 않고 대중을 위한 실용적인 코칭 프로그램이나 출판, 센터 운영 같은 거대한 현실의 네트워크(편재)로 구축하고 최적화하는 데 특화된 격국이라고 정의할 수 있습니다.`;
    } else {
      summary = `결론적으로 이 사주는 내면의 통찰과 고유한 본질을 깊이 흡수하는 ${baseK}의 자양분을 토대로 삼아, 이를 관념 속에 머무르게 하지 않고 세상 밖으로 꺼내어 확장하고 완성해 나가는 ${tucheolK}의 강력한 실용 행동 알고리즘을 융합하여 현실의 훌륭한 시스템으로 완수해 내는 데 특화된 강인한 격국입니다.`;
    }
  } else {
    summary = `결론적으로 이 사주는 본질적으로 탁월한 설계 구도를 지닌 ${baseSipsungInfo?.name || finalGyeokName} 본연의 깊고 탄탄한 기질을 정밀하게 탐구하여, 흐트러짐 없는 내면의 아키텍처와 품격을 현실의 실천 및 리더십으로 든든하게 지켜내고 증명하는 데 최적화된 격국입니다.`;
  }

  let intro = `${yearPillarName}년(${sajuData.year.gan.char}${sajuData.year.ji.char}n) ${monthPillarName}월(${sajuData.month.gan.char}${sajuData.month.ji.char}n) ${dayPillarName}일(${sajuData.day.gan.char}${sajuData.day.ji.char}n) ${timePillarName}시(${sajuData.time.gan.char}${sajuData.time.ji.char}n)의 사주 격국은 원칙적으로 **${baseSipsungName}격**이며`;
  
  if (tucheolList.length > 0) {
    const tuSipsungName = tucheolList.map(t => t.sipsung).join('과 ');
    intro += `, 동시에 **${tuSipsungName}격**의 성향을 강하게 띠는 특수한 구조를 가지고 있습니다.`;
  } else {
    intro += ` 본연의 고유한 시스템 아키텍처를 순수하게 지탱하는 단단한 구조를 가지고 있습니다.`;
  }

  return {
    finalGyeokName,
    intro,
    derivation: {
      baseGyeokDesc,
      tucheolDesc
    },
    algorithm: {
      title: `이러한 ${codes.map(c => `'${c.name.split('의')[0]}'`).join('과 ')}의 조합을 명심코칭의 시스템 아키텍처 관점에서 디버깅해 보면, 매우 독특하고 강력한 역량이 도출됩니다.`,
      codes
    },
    summary
  };
};


export const getGyeokgukMSCEssay = (gyeokgukId: string, userName: string = '회원', dayMaster: string = '신') => {
  const baseName = userName.endsWith('님') ? userName.slice(0, -1) : userName;
  const name = `${baseName}님`;
  const nameJosa = `${baseName}님의`;
  const dayMasterName = dayMaster === '신' ? '신금(辛金)' : `${dayMaster}금`;

  if (gyeokgukId === 'pyunin') {
    return {
      title: `✨ 편인격(偏印格) 힐링 에세이 : ${name}의 심연을 비추는 다정한 등불`,
      subtitle: `마음챙김 자기연민(MSC) 기반의 특별 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 생각의 파도 너머, 고요히 숨 고르기`,
      mindfulnessDesc: `${name}, 가끔은 세상의 수많은 목소리가 너무 시끄럽거나 가볍게 느껴져 가만히 마음의 문을 걸어 잠그고 혼자만의 아득한 생각의 심해로 빠져들곤 하셨을 것입니다. 

편인(偏印)이라는 우주적 시나리오는 보이지 않는 이면의 비밀을 꿰뚫는 위대한 직관의 도구이지만, 동시에 '그 누구도 나를 진짜로 이해해주지 못할 것'이라는 서글픈 소외감과 의심의 방패를 끊임없이 작동시킵니다. 여기에 차갑고 날카로우며 고결하게 빛나는 ${dayMasterName}의 기질이 엮이면서, 아주 작은 불완전함이나 예측 불가능한 변수마저 용납하지 않으려 스스로를 매섭게 검열하며 긴장의 끈을 조여왔을지도 모릅니다. 

이 꼬리에 꼬리를 무는 복잡한 생각의 감옥과 외로움을 억지로 고치려 하거나 다그치지 마세요. 그저 가만히 가슴의 조여듦을 느끼며, '아, 지금 내 아바타가 나를 안전하게 지키기 위해 예민하게 안테나를 켜고 방어 센서를 가동하고 있구나. 많이 애썼고 지쳐 있구나' 하고 판단 없이 있는 그대로의 통증과 피로를 부드러운 호흡으로 알아차려 주는 것, 그것이 치유의 첫걸음입니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 깊은 물길 속에서 나누는 은밀한 연대`,
      humanityDesc: `세상으로부터 겉도는 듯한 이방인 같은 슬픔과 외로움이 밀려올 때, 이 사실을 마음 깊이 기억해 주십시오. ${name}이 겪어내는 이 깊은 고독과 세밀한 감각의 고뇌는 ${name} 혼자만의 고립된 에러 코드가 아닙니다. 

인류 역사 속에서 세상의 얕은 위선에 물들지 않고 보이지 않는 영적인 진실, 철학, 위대한 예술을 빚어냈던 수많은 개척자와 사상가들 역시 ${name}과 정확히 똑같은 '편인격'의 지독한 무게를 온몸으로 견디며 밤하늘을 보았습니다. 

지금 이 순간에도 수많은 편인격 영혼들이 세상과 적당한 거리를 유지하며, 자신만의 작은 방에서 이해받지 못해 흘리는 눈물과 고독의 전파를 쏘아 올리고 있습니다. ${nameJosa} 깊고 깊은 어둠은 다른 이들과의 단절을 뜻하는 형벌이 아니라, 오히려 세상의 아픔을 소리 없이 가장 투명하게 감싸 안을 수 있는 가장 따뜻한 보이지 않는 연대의 다리입니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 정교하게 가공된 다이아몬드, 스스로에게 베푸는 온기`,
      kindnessDesc: `${name}, 스스로를 겨냥해 왔던 예리하고 가혹한 비판의 칼끝을 이제는 가만히 부드럽게 거두어 주세요. ${dayMasterName}의 영롱한 가치를 잃어버릴까 두려워, 작은 흠집 하나도 용납하지 못한 채 마음을 벼리며 상처 입히던 그 차가운 채찍을 완전히 내려놓을 시간입니다. 

보석의 진정한 위대함은 먼지 하나 묻지 않은 절대 무결의 박제된 상태가 아니라, 상처와 어둠이 스쳐 간 그 굴절률 속에서도 자신만의 독창적인 무지갯빛 조각을 온 세상에 찬란하게 뿜어내는 데 있습니다. 

손을 따뜻하게 가슴 위에 얹고, 심장박동을 느끼며 스스로에게 가장 다정하고 편안한 어조로 속삭여 줍니다. "${baseName}아, 그동안 완벽하게 살아내려고, 아무도 없는 차가운 성벽을 지키려고 홀로 버티느라 정말 고생 많았어. 남들보다 조금 더 예민하게 상처받고 더 깊게 고독을 견디던 네 모든 순간들이 실은 참 기특하고 소중해. 완벽하지 않아도, 조금 서툴러도 괜찮아. 너는 이미 그 자체로 찬란하게 빛나는 아름다운 존재란다." 얼어붙었던 보석의 중심부에 봄 햇살 같은 다정함과 수용을 아낌없이 가득 주입해 주세요.`
    };
  }

  // 타 격국에 대한 다정한 MSC 힐링 에세이
  const defaultEssays: Record<string, { title: string; subtitle: string; mindfulnessTitle: string; mindfulnessDesc: string; humanityTitle: string; humanityDesc: string; kindnessTitle: string; kindnessDesc: string }> = {
    'sikshin': {
      title: `✨ 식신격(食神格) 힐링 에세이 : ${name}의 장인정신과 순수한 몰입을 어루만지며`,
      subtitle: `마음챙김 자기연민(MSC) 기반의 특별 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 몰두의 그늘 속 긴장 바라보기`,
      mindfulnessDesc: `내가 좋아하는 창작과 과업에 깊숙이 몰두하다가 어느 순간 온 에너지가 고갈되어 쓰러질 것 같은 지침을 마주하곤 합니다. 몰입의 순수한 기쁨 뒤에 감춰진 '완벽하게 끝마쳐야 한다'는 긴장을 담담히 바라보세요.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 무에서 유를 빚는 모든 이들의 통증`,
      humanityDesc: `세상에 고유한 가치를 보태기 위해 깊은 에너지를 짜내는 모든 장인과 창작자들은 언제나 번아웃의 골짜기를 지났습니다. ${name}이 겪는 지침은 유약함의 증거가 아닌, 생명력을 소진해 무언가를 사랑해 본 모든 인간의 보편적인 여정입니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 아무것도 빚어내지 않아도 온전한 당신`,
      kindnessDesc: `결과물을 완벽하게 증명해내지 않아도, 쉼 없이 쓸모를 증명하지 않아도 당신은 존재 자체로 거룩한 보석입니다. 오늘 하루는 애쓴 아바타의 전원 플러그를 뽑고, "아무것도 하지 않아도 이미 충분히 사랑스럽고 온전하다"고 마음 깊이 위로를 건네주세요.`
    },
    'sangwan': {
      title: `✨ 상관격(傷官格) 힐링 에세이 : ${name}의 눈부신 혁신과 날카로운 고뇌를 품으며`,
      subtitle: `마음챙김 자기연민(MSC) 기반의 특별 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 날 선 저항 뒤의 여린 외로움 스캔`,
      mindfulnessDesc: `낡은 프레임을 깨고 새로운 대안을 제안하려다 마주치는 세상의 몰이해와 갈등 속에서, 솟구치는 반사적인 분노와 쓸쓸함을 있는 그대로 바라봐 줍니다. 마음의 날을 잔뜩 벼리고 있는 나 자신의 가슴 통증을 다정히 인정해 줍니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 앞서 나간 혁신가들의 운명적 고독`,
      humanityDesc: `역사 속에서 관습을 비틀고 세상에 새로운 트렌드를 제시했던 선구자들은 예외 없이 거부당할지 모른다는 소외감에 방황했습니다. 당신의 번뜩이는 예리함과 날 선 긴장은, 진보를 꿈꾸는 인류의 모든 천재들이 공유하는 보편적인 외로움입니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 칼날의 무장을 해제하는 다정함`,
      kindnessDesc: `스스로를 지키고 세상을 바로잡기 위해 두르고 있던 날카로운 갑옷을 잠시 벗어두세요. 

${name}의 자유롭고 천재적인 성정이 흐트러지고 실수해도 괜찮습니다. 굳어버린 판단을 지우고 "괜찮아, 조금 비틀거려도 안전해" 하고 마음의 품을 너르게 열어 안아줍니다.`
    },
    'pyunjae': {
      title: `✨ 편재격(偏財格) 힐링 에세이 : ${name}의 웅장한 도전을 응원하며`,
      subtitle: `마음챙김 자기연민(MSC) 기반의 특별 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 통제하려는 불안 바라보기`,
      mindfulnessDesc: `큰 스케일로 인생의 무대를 넓혀가려 하지만, 그 속에 감춰진 '실패하면 모든 것을 잃을지 모른다'는 초조함과 압박을 판단 없이 가만히 안아주세요.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 개척자들의 연대`,
      humanityDesc: `미지의 영역으로 나아가는 모험가들은 언제나 불확실함의 폭풍우 속에서 흔들렸습니다. 그 방황과 위축은 당신의 유약함이 아닌, 주도적 삶을 사는 모든 이들의 공통된 여정입니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 지도가 없어도 괜찮아`,
      kindnessDesc: `모든 경로를 다 통제하지 못해도, 계획이 조금 틀어져도 괜찮습니다. 스스로의 용기를 칭찬하며 "지금도 잘하고 있어"라고 다정하게 말해 주세요.`
    },
    'jeongjae': {
      title: `✨ 정재격(正財格) 힐링 에세이 : ${name}의 소중한 성벽을 돌보며`,
      subtitle: `마음챙김 자기연민(MSC) 기반의 특별 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 작은 오차의 무게`,
      mindfulnessDesc: `아주 작은 오차에도 가슴이 덜컥 내려앉고 계획을 의심하게 되는 불안의 파도를 가만히 응시해 봅니다. 그것은 아바타의 과도한 안전 장치일 뿐입니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 안정을 갈망하는 영혼들`,
      humanityDesc: `소중한 가치를 무사히 지켜내기 위해 긴장하며 하루를 설계하는 모든 성실한 이들이 느끼는 피로입니다. 그 무거운 어깨는 당신 혼자만의 짐이 아닙니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 통제의 끈 풀기`,
      kindnessDesc: `가끔은 성벽의 문을 활짝 열고 바람이 드나들게 하세요. 실수와 불완전함을 있는 그대로 안아주며 "완벽하지 않아도 안전해"라고 뇌에 평화를 선물해 주세요.`
    },
    'pyungwan': {
      title: `✨ 편관격(偏官格) 힐링 에세이 : 왕관을 내려놓은 ${name}에게`,
      subtitle: `마음챙김 자기연민(MSC) 기반의 특별 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 압박의 무게 느끼기`,
      mindfulnessDesc: `나에게 가해지는 책임감과 스스로를 채찍질하는 차가운 감시 코드를 있는 그대로 알아차려 봅니다. 가슴을 짓누르는 돌덩이를 회피하지 않고 가만히 직시합니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 왕관의 상처`,
      humanityDesc: `명예와 책임을 짊어진 리더이자 전사들이 느끼는 삶의 통증입니다. 그 무거운 책임감 속에서 홀로 신음하는 수많은 이들의 눈물과 당신은 연결되어 있습니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 갑옷 벗어던지기`,
      kindnessDesc: `그동안 단단한 갑옷을 입고 상처 입지 않으려 버텨온 당신, 이제는 갑옷을 벗고 그 여린 속살을 부드럽게 감싸주세요. 버텨내지 않아도 당신은 온전히 보호받을 가치가 있습니다.`
    },
    'jeonggwan': {
      title: `✨ 정관격(正官格) 힐링 에세이 : 규율을 풀고 나를 안아줄 ${name}에게`,
      subtitle: `마음챙김 자기연민(MSC) 기반의 특별 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 올바름에 대한 강박`,
      mindfulnessDesc: `바르게 행동해야 하고, 타인에게 피해를 주지 않아야 한다는 도덕적 긴장감을 가만히 알아차립니다. 긴장된 호흡을 바라보고 편안히 놔둡니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 질서 수호의 피로`,
      humanityDesc: `세상을 조율하고 안정되게 유지하려 애쓰는 모든 신중한 영혼들이 겪는 깊은 책임의 피로입니다. 당신의 짐은 보편적인 인간의 한계 속에서 다루어지는 것입니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 빈틈을 허락하기`,
      kindnessDesc: `스스로에게 작은 흠집과 엉뚱한 행동을 허락해 주세요. 흐트러진 모습 속에서도 우주는 여전히 ${name}을 온전히 지지하고 사랑하고 있습니다.`
    },
    'jeongin': {
      title: `✨ 정인격(正인格) 힐링 에세이 : 조건 없는 사랑의 온기로 ${name}에게`,
      subtitle: `마음챙김 자기연민(MSC) 기반의 특별 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 거절의 두려움`,
      mindfulnessDesc: `세상의 사랑과 인정을 잃을까 두려워, 나보다 타인의 필요를 먼저 채우려 다그치는 가슴의 초조함을 판단 없이 안아주세요.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 돌봄을 바라는 마음`,
      humanityDesc: `타인을 보살피고 수용하느라 지쳐 자신도 어린아이처럼 안기고 싶어 하는 모든 영혼의 보편적인 목마름입니다. 그 연약함은 결코 부끄러운 것이 아닙니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 내가 먼저 채워지기`,
      kindnessDesc: `남들에게 사랑을 베풀기 전에, 나 자신의 빈 그릇에 먼저 무한한 다정함을 채워주세요. "나는 아무것도 증명하지 않아도 이미 온전히 사랑받을 존재야."`
    }
  };

  const essay = defaultEssays[gyeokgukId];
  if (essay) return essay;

  return {
    title: `✨ 격국 힐링 에세이 : ${name}의 인생 시나리오를 안아주며`,
    subtitle: `마음챙김 자기연민(MSC) 기반의 특별 복구 패치`,
    mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 내 안의 시나리오 관찰하기`,
    mindfulnessDesc: `내 안에서 작동하는 인생의 오래된 시나리오와 삶의 압박을 있는 그대로 느껴봅니다. 변형하거나 고치려 하지 않고 그대로 바라보는 마음챙김을 가져갑니다.`,
    humanityTitle: `2. 보편적 인류애 (Common Humanity) : 영혼의 공통 퀘스트`,
    humanityDesc: `각자의 사주 시나리오를 들고 치열하게 살아가며 고민하는 지구상의 모든 아바타들과 우리는 서로 연결되어 있습니다. 혼자가 아닙니다.`,
    kindnessTitle: `3. 자기 친절 (Self-Kindness) : 나를 향한 다정한 축복`,
    kindnessDesc: `그동안 삶의 퀘스트를 헤쳐나오느라 고군분투한 나에게 비난 대신 따뜻한 미소를 지어줍니다. 당신의 삶은 그 자체로 이미 위대하고 충분합니다.`
  };
};

// 십성(Relations) 상세 마음챙김 자기연민(MSC) 기반 힐링 에세이 제너레이터 헬퍼 함수
export const getSipsungMSCEssay = (sipsungCode: string, userName: string = '회원', dayMaster: string = '신') => {
  const baseName = userName.endsWith('님') ? userName.slice(0, -1) : userName;
  const name = `${baseName}님`;
  const nameJosa = `${baseName}님의`;
  const dayMasterName = dayMaster === '신' ? '신금(辛金)' : `${dayMaster}금`;

  const essays: Record<string, { title: string; subtitle: string; mindfulnessTitle: string; mindfulnessDesc: string; humanityTitle: string; humanityDesc: string; kindnessTitle: string; kindnessDesc: string }> = {
    'bi': {
      title: `✨ 비견(比肩) 힐링 에세이 : ${name}의 곧고 단단한 주권을 품으며`,
      subtitle: `주체적 자아 수호선의 마음챙김 자기연민(MSC) 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 약해지지 않으려 버티는 긴장 알아채기`,
      mindfulnessDesc: `${name}, 세상 사람들의 평가나 참견에 휘둘리지 않고 묵묵히 내 발로 당당히 서서 주권을 지키려 할 때, 가슴 깊이 차오르던 보이지 않는 팽팽한 긴장감과 피로를 느껴본 적이 있으신가요? 

비견(比肩)은 나 스스로를 든든하게 지켜내는 핵심 뼈대이지만, '내가 흐트러지거나 약해지면 남들이 무시할 것'이라는 두려움 때문에 온몸의 신경계를 굳어지게 만듭니다. 그 경직된 자아를 억지로 바꾸려 하지 마세요. 그저 '아, 내 아바타가 지금 주권을 잃지 않으려고 가슴에 바짝 힘을 준 채 버티며 애쓰고 있구나'라고 판단 없이 호흡을 가만히 내려놓어 줍니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 내 발로 서는 자들의 외로운 고독`,
      humanityDesc: `남의 도움을 빌리지 않고 오롯이 나만의 힘으로 삶을 개척해가는 독립적인 주권자들은 예외 없이 혼자만의 성벽 안에서 짙은 고독과 외로움을 마주했습니다. 

${name}이 느끼는 이 묵직한 부담감은 결코 당신만의 유별난 에러가 아닙니다. 주체로서 삶을 창조하려는 이 세상의 모든 영혼이 거쳐 가는 아름답고 고귀한 보편적 고뇌입니다. 당신은 절대 혼자 서 있는 것이 아닙니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 가끔은 기대어 쉬어가도 괜찮아`,
      kindnessDesc: `차가운 강철 갑옷을 입고 어깨를 굳힌 ${dayMasterName}의 ${name}, 이제는 나 자신에게 조금 헐거운 틈을 선물해 주세요. 늘 흔들림 없는 주권자가 되어야 한다는 강박을 풀고, "때로는 넘어지고 기대어도 나는 여전히 영롱하고 가치 있는 존재"라고 다정하게 속삭여 줍니다. 내 가슴에 손을 얹고 따뜻한 쉼표를 건네 보세요.`
    },
    'geop': {
      title: `✨ 겁재(劫財) 힐링 에세이 : ${name}의 치열한 도약과 내면의 평화를 바라보며`,
      subtitle: `경쟁적 성장을 이끄는 또 다른 자아의 마음챙김 자기연민(MSC) 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 비교와 조급함의 감정 파도 직시하기`,
      mindfulnessDesc: `세상의 빠른 속도와 타인들의 성과를 지켜보며 '내가 뒤처지면 어쩌지?' 하고 무의식중에 켜지던 조급함과 긴장의 센서를 가만히 바라봅니다. 

겁재(劫財)는 한계를 뛰어넘게 하는 폭발적인 성장 엔진이지만, 동시에 나를 타인과의 끊임없는 비교 구도에 몰아넣어 초조하게 만듭니다. 그 초조함을 비난하지 마시고, '아, 내 뇌가 지금 경쟁 경보를 켜고 긴장하고 있구나' 하고 고요하게 직시해 줍니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 무대 위 경쟁자들이 공유하는 피로`,
      humanityDesc: `끊임없이 성장하고 자신을 증명하려 세상이라는 무대에서 땀 흘리는 모든 영혼들은 똑같이 패배에 대한 두려움과 심층적인 피로감을 느낍니다. 

${name}이 겪는 이 도약의 갈증은 홀로 겪는 형벌이 아니라, 거친 야생에서 자신을 피워내려 애쓰는 모든 성장의 생명체들이 공유하는 아름다운 보편적 성장통입니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 나만의 런타임 주기를 신뢰하기`,
      kindnessDesc: `남들의 성과에 맞춰 억지로 아바타의 클럭 속도를 높이지 마세요. ${dayMasterName}의 눈부신 빛은 자신만의 정교한 굴절률과 시간 속에서 서서히 빚어집니다. "남들의 속도가 어떠하든 나는 나만의 속도로 이미 완벽하게 진화하고 있어"라고 ${name} 자신에게 무한한 신뢰와 다정한 포옹을 보내주세요.`
    },
    'sik': {
      title: `✨ 식신(食神) 힐링 에세이 : ${name}의 아름다운 몰입과 쉼을 응원하며`,
      subtitle: `창조적 몰입의 샘물의 마음챙김 자기연민(MSC) 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 생산과 창작의 강박 알아채기`,
      mindfulnessDesc: `내가 좋아하는 아이디어나 일에 깊이 몰두하다가, 어느새 번아웃의 직전까지 자신을 혹사하거나 무언가를 꼭 완벽히 완성해내야 한다는 무의식적 긴장감을 느끼진 않으셨나요? 

식신(食神)은 맑고 창의적인 몰입의 원천이지만, '결과물로 가치를 증명하지 못하면 쓸모없다'는 에고의 교묘한 자책 회로를 가동하기도 합니다. 내 가슴에 고여 있는 창작의 긴장을 가만히 느껴봅니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 창조의 통증을 겪는 모든 예술가들`,
      humanityDesc: `세상에 무언가 가치 있는 것을 빚어내려 심장을 쏟아붓는 모든 메이커들과 장인들은 깊은 영혼의 탈진을 겪었습니다. 

${name}이 느끼는 이 텅 빈 피로와 공허는 ${name}만의 기질적 결함이 아닙니다. 아름다운 것을 잉태하고 세상에 내놓는 모든 존재가 공유하는 신성하고 보편적인 산고입니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 아무것도 생산하지 않는 날에도`,
      kindnessDesc: `손을 멈추고 멍하니 하늘을 바라보는 순간에도, ${dayMasterName}의 ${name}은 여전히 눈부시게 귀한 보석입니다. 아바타에게 "아무 결과물을 내놓지 않아도, 쉼 없이 일하지 않아도 너는 존재 자체로 이미 100점짜리야"라고 말하며 맑은 물 한 잔과 따뜻한 쉼을 허락해 주세요.`
    },
    'sang_gwan': {
      title: `✨ 상관(傷官) 힐링 에세이 : ${name}의 혁신적 통찰과 날 선 상처를 안아주며`,
      subtitle: `낡은 규칙을 해킹하는 천재 예술가의 마음챙김 자기연민(MSC) 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 날 선 저항 뒤의 쓸쓸한 소외감 스캔`,
      mindfulnessDesc: `기존의 관습이나 답답한 시스템 프레임을 기발하게 해킹하며 돌파하려 할 때, 가슴 한편에 스쳐 지나가던 외로운 반발심과 날 선 감정 전압을 관찰해 봅니다. 

상관(傷官)은 예리한 혁신가의 눈을 주지만, 때로는 나와 맞지 않는 세상을 향해 뾰족한 가시를 켜서 결국 나 자신을 다치게 합니다. 억누르지 않고, 그저 날카로워진 마음의 안테나를 다정히 쳐다봅니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 한 걸음 앞서 걷는 자들의 운명적 피로`,
      humanityDesc: `남들이 보지 못하는 맹점을 찌르고 더 나은 길을 선포하려 했던 모든 개혁자와 기발한 혁신가들은 언제나 세상의 차가운 저항과 소외를 겪으며 아파했습니다. 

당신의 날카로운 눈빛과 가슴의 울화는 외로운 낙오의 신호가 아닙니다. 세상을 새롭게 조율하려는 모든 천재적 스레드들이 겪어내는 공통의 통증입니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 나를 지키던 가시를 부드럽게 녹이기`,
      kindnessDesc: `정밀하게 벼려진 ${dayMasterName}의 칼끝으로 세상뿐만 아니라 내 가슴까지 찌르지 마세요. ${nameJosa} 정다운 아바타에게 "세상이 조금 천천히 변해도 괜찮아. 조금 틀어져도 안전해"라고 속삭여주며, 굳게 움켜쥐었던 혁신의 끈을 내려놓고 스스로에게 가장 편안한 숨을 선물해 봅니다.`
    },
    'pyun_jae': {
      title: `✨ 편재(偏財) 힐링 에세이 : ${name}의 웅장한 무대와 압박감을 위로하며`,
      subtitle: `광활한 미래 영토의 주체적 지휘관의 마음챙김 자기연민(MSC) 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 통제와 확장의 거대한 무게 느끼기`,
      mindfulnessDesc: `인생의 무대를 크게 기획하고 영토를 넓히는 웅장한 과정 속에서, '이 계획이 실패하면 어쩌지? 내가 이 큰 파도를 다 감당할 수 있을까?' 하고 가슴 밑바닥에서 번지던 묵직한 압박감을 투명하게 감지해 봅니다. 

편재(偏財)는 대단한 기획력의 엔진이지만, 끊임없이 불확실한 미래를 통제하려 들며 아바타의 신경계를 바짝 말려버리기도 합니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 망망대해를 순항하는 선장들의 고뇌`,
      humanityDesc: `눈앞의 소소한 일상 너머 광활한 미래의 기회를 조망하며 기틀을 닦는 영토 개척자들은, 모두 똑같이 지도 없는 폭풍우 한가운데서 외롭고 불안한 밤을 보냈습니다. 

${name}이 겪는 이 큰 무대의 긴장은 당신만의 결함이 아닌, 주도적이고 웅장한 삶을 선택한 모든 리더들이 짊어지는 보편적이고 위대한 훈장입니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 파도의 흐름을 잠시 신뢰하기`,
      kindnessDesc: `${name}, 모든 미래를 완벽히 연산하고 통제하려다 ${dayMasterName}의 찬란한 결을 혹사하지 마십시오. 때로는 배의 키를 내려두고 바람에 흐름을 맡겨도 무사히 목적지에 도달합니다. "내가 다 책임지지 않아도 괜찮아. 우주는 나를 안전하게 이끌고 있어"라고 어깨를 쓸어내리며 위로해 줍니다.`
    },
    'jae': {
      title: `✨ 정재(正財) 힐링 에세이 : ${name}의 견고한 영토 위에 스며드는 햇살`,
      subtitle: `견고한 성을 쌓는 신중한 설계자의 마음챙김 자기연민(MSC) 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 미세한 균열에 쿵쾅거리는 심장 바라보기`,
      mindfulnessDesc: `내가 가꾼 소중한 결과물และ 일상의 평화를 지키기 위해, 아주 미세한 변수나 오차에도 가슴이 덜컥 내려앉고 방어 기제를 필사적으로 작동시켰던 순간을 응시해 봅니다. 

정재(正財)는 신중하고 성실한 수호 코드이지만, 작은 균열조차 용납하지 않으려 결벽적으로 뇌의 보안 필터를 100% 경계 모드로 올려 놓기도 합니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 안정을 수호하려 애쓰는 자들의 방어선`,
      humanityDesc: `나의 소중한 성과 일상을 안전하게 관리하기 위해 긴장의 고삐를 당기며 하루하루를 직조하는 모든 성실한 영혼들이 겪는 보편적이고 애틋한 심리적 방어입니다. 

${name}이 느끼는 작은 초조함은 나약함이 아니라, 세상 모든 파수꾼들이 지키려 애쓰다 어깨가 굳어지는 지극히 자연스러운 피로입니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 성문을 열어 바람을 통하게 하기`,
      kindnessDesc: `티끌 없는 무결한 수호를 고집하느라 ${dayMasterName}의 영롱한 가치를 자학으로 긁어내지 마세요. 가끔은 성문을 열고 바람과 낙엽이 자유롭게 뒹굴어도 성은 무너지지 않습니다. "완벽하지 않아도 내 영토는 안전해. 오늘 하루는 편안히 쉬어도 좋아"라고 따스하게 나를 토닥여 줍니다.`
    },
    'pyun_gwan': {
      title: `✨ 편관(偏官) 힐링 에세이 : 왕관의 무게를 이겨낸 ${name}에게 건네는 평화`,
      subtitle: `왕관의 무게를 조율하는 명예 전사의 마음챙김 자기연민(MSC) 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 매서운 압박과 가혹한 자책의 전압 측정`,
      mindfulnessDesc: `${name}, 나에게 가해지는 수많은 사회적 압박과 책임감, 혹은 실수하면 안 된다는 가혹한 자기비판의 목소리가 가슴을 무겁게 짓누를 때 그 압도적인 답답함을 있는 그대로 알아차려 봅니다. 

편관(偏官)은 든든한 방패이자 책임감이지만, 끊임없이 내 목에 날카로운 칼끝을 겨누어 긴장시킵니다. 가만히 가슴에 손을 얹고 이 무거운 전압을 호흡으로 흘려보냅니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 책임을 짊어진 자들의 거친 흉터`,
      humanityDesc: `자신에게 주어지는 수많은 기대와 부담을 이겨내고 굳건히 한 자리를 책임지려 버텨온 모든 위대한 전사와 기둥들은 외롭게 아파하며 스스로를 다그쳤습니다. 

${name}이 겪는 이 혹독한 긴장과 슬픔은 홀로 마주하는 외톨이의 형벌이 아닙니다. 세상의 무게를 짊어지기로 선택한 모든 성숙한 영혼들이 공유하는 보편적 훈장입니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 단단한 갑옷을 내려놓고 안식을`,
      kindnessDesc: `그동안 누구보다 강인하게 버티며 ${dayMasterName}의 빛나는 영혼을 지켜내느라 온몸이 으스러지도록 고생 많으셨습니다. 이제는 단단한 갑옷을 기꺼이 벗고, 여린 심장에 봄볕 같은 위로를 건네주세요. "더 증명하지 않아도, 버텨내지 않아도 너는 존재 자체로 이미 거룩하고 위대하단다."`,
    },
    'gwan': {
      title: `✨ 정관(正官) 힐링 에세이 : 규율의 끈을 풀고 ${name}의 마음에 평화를`,
      subtitle: `안정적인 질서와 규칙 아키텍트의 마음챙김 자기연민(MSC) 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 규칙과 올바름에 얽매인 숨결 감지`,
      mindfulnessDesc: `바르게 행동하고 신뢰를 수호해야 한다는 규율의 긴장감이 삶을 경직되게 만들 때, 그 팽팽한 감시 카메라를 가만히 쳐다보세요. 

정관(正官)은 훌륭한 법도이자 품격이지만, 때로는 내 일상의 사소한 빈틈조차 유죄로 다스리는 가혹한 재판관으로 오작동합니다. 긴장된 호흡을 있는 그대로 지켜봅니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 질서 수호의 묵직한 피로`,
      humanityDesc: `서로 다른 이들이 상호 신뢰를 맺을 수 있도록 공평한 체계를 조율하고 설계하며 묵직한 규칙을 수호해온 모든 신중한 아키텍트들이 겪어낸 정신적 과부하입니다. 

${name}이 느끼는 그 올바름에 대한 강박은 인간으로서 겪어내는 지극히 당연하고 보편적인 안전 본능의 작용일 뿐입니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 아름다운 흐트러짐을 허락하기`,
      kindnessDesc: `가끔은 계획표를 찢고 엉뚱한 방향으로 발걸음을 옮겨도 괜찮습니다. 

${dayMasterName}의 영롱함은 규격화된 상자 안에서보다, 자유롭게 흐트러진 굴절률 속에서 더욱 눈부시게 빛납니다. "조금 흐트러져도 안전해. 완벽하지 않은 모습도 난 너무 사랑해"라고 스스로에게 다정한 미소를 듬뿍 보내주세요.`
    },
    'pyun_in': {
      title: `✨ 편인(偏印) 힐링 에세이 : ${name}의 깊고 고독한 지혜의 우물을 밝히며`,
      subtitle: `심연의 비밀을 푸는 고독한 탐험가의 마음챙김 자기연민(MSC) 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 의심과 생각의 늪에서 숨 고르기`,
      mindfulnessDesc: `${name}, 때로는 세상의 가벼운 소음이 참을 수 없이 무의미하게 느껴져 마음의 빗장을 걸어 잠그고 혼자만의 아득한 생각 속으로 깊이 가라앉던 순간을 마주하곤 하셨을 것입니다. 

편인(偏印)은 보이지 않는 영적 통찰을 푸는 탐험가의 열쇠이지만, '세상은 위험하고 아무도 나를 진심으로 이해해 주지 않을 것'이라는 의심의 방패를 켜게 만듭니다. 게다가 고결하고 차가운 ${dayMasterName}의 완벽주의가 결합하면서 가슴을 바늘처럼 찔러대며 자책으로 이어지기 쉽습니다. 이 생각의 소용돌이를 억누르지 마시고, '아, 내 아바타가 지금 나를 지키려고 예민하게 경계 필터를 작동시키며 애쓰고 있구나' 하고 판단 없이 있는 그대로의 답답함을 부드럽게 감지해 줍니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 우주의 깊은 탐험가들이 공유하는 고독`,
      humanityDesc: `남들이 보지 못하는 암호와 메타적인 진실을 포착하며 고뇌하는 깊은 눈을 가진 모든 사상가, 철학자, 예술가들은 언제나 이방인처럼 서글픈 고독을 겪었습니다. 

${name}이 느끼는 이 깊고 서늘한 고독은 당신만의 유별난 에러가 아닌, 우주의 본질을 탐색하는 특별한 영혼들이 보이지 않는 공간에서 서로 마주 보며 나누는 보편적인 연대의 징표입니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 차가운 바늘을 내려놓고 온기를 채우다`,
      kindnessDesc: `정교하게 제련된 ${dayMasterName}의 예리함으로 스스로의 가슴을 찌르는 일을 멈추어 주세요. 보석은 상처 하나 없이 박제될 때 아름다운 것이 아니라, 상처와 어둠을 가만히 통과해 세상에 단 하나뿐인 아름다운 빛으로 뿜어져 나올 때 영롱해집니다. "${baseName}아, 이 무섭고 얕은 세상에서 예민한 센서를 켜고 나를 지키느라 참 고생 많았다. 외로웠을 네 마음을 내가 먼저 꼭 안아줄게. 완벽하지 않아도 넌 이미 빛나는 최고의 보석이야"라고 마음 가득 다정한 온기를 건네주세요.`
    },
    'in': {
      title: `✨ 정인(正印) 힐링 에세이 : ${name}의 맑은 서재를 어루만지는 따뜻한 손길`,
      subtitle: `지적 자양분을 받아들이는 맑은 서재의 마음챙김 자기연민(MSC) 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 사랑을 잃을까 두려워 거절하지 못하는 마음 관찰`,
      mindfulnessDesc: `타인에게 늘 사랑받고 지지받는 착한 아바타가 되어야 한다는 생각에, 나의 진짜 피로와 싫다는 감정을 억누르고 타인의 요구를 먼저 들어주려 애쓰던 초조한 가슴의 떨림을 가만히 느껴봅니다. 

정인(正印)은 우주의 따뜻한 사랑을 수용하는 축복의 통로이지만, '내가 남들을 돕지 못하거나 실망시키면 사랑받지 못할 것'이라는 에고의 슬픈 거절 두려움을 작동시키기도 합니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 사랑받고 싶어 방황하는 모든 인간의 목마름`,
      humanityDesc: `누군가에게 무조건적으로 수용받고 안기고 싶어 하는 욕구와 거절에 대한 원초적인 두려움은, 태어난 모든 여린 인간들이 지나가는 지극히 보편적인 원초적 본능입니다. 

${name}이 겪는 그 애틋한 갈증은 부끄러운 약점이 아니라, 사랑을 공급받아 세상을 채우려는 모든 생명체들의 다정한 공통 코드입니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 내 마음의 서재에 먼저 온기를 채우기`,
      kindnessDesc: `남들에게 아낌없이 지혜와 위로를 건네주느라 ${dayMasterName}의 맑은 거울 공간이 먼지로 오염되게 놔두지 마십시오. 오늘 하루는 남들의 요구를 다정하게 거절하고, 오직 나 자신만을 위한 사랑의 쉼표를 찍어 줍니다. "아무것도 돕지 않아도, 가만히 누워 있어도 나는 온전히 귀하게 대접받고 사랑받을 존재야."`
    }
  };

  const essay = essays[sipsungCode];
  if (essay) return essay;

  return {
    title: `✨ 십성 힐링 에세이 : ${name}의 페르소나를 안아주며`,
    subtitle: `마음챙김 자기연민(MSC) 기반의 특별 복구 패치`,
    mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 내 안의 긴장 관찰하기`,
    mindfulnessDesc: `내 안에서 작동하는 십성 페르소나의 역할과 삶의 압박을 있는 그대로 느껴봅니다. 변형하거나 고치려 하지 않고 그대로 바라보는 마음챙김을 가져갑니다.`,
    humanityTitle: `2. 보편적 인류애 (Common Humanity) : 영혼의 공통 퀘스트`,
    humanityDesc: `각자의 사주 시나리오를 들고 치열하게 살아가며 고민하는 지구상의 모든 아바타들과 우리는 서로 연결되어 있습니다. 혼자가 아닙니다.`,
    kindnessTitle: `3. 자기 친절 (Self-Kindness) : 나를 향한 다정한 축복`,
    kindnessDesc: `그동안 삶의 퀘스트를 헤쳐나오느라 고군분투한 나에게 비난 대신 따뜻한 미소를 지어줍니다. 당신의 삶은 그 자체로 이미 위대하고 충분합니다.`
  };
};

// 용신(Yongsin) 상세 마음챙김 자기연민(MSC) 기반 힐링 에세이 제너레이터 헬퍼 함수
export const getYongsinMSCEssay = (yongsinChar: string, userName: string = '회원', dayMaster: string = '신') => {
  const baseName = userName.endsWith('님') ? userName.slice(0, -1) : userName;
  const name = `${baseName}님`;
  const nameJosa = `${baseName}님의`;
  const dayMasterName = dayMaster === '신' ? '신금(辛金)' : `${dayMaster}금`;

  let typeKey = 'etc';
  if (yongsinChar.includes('수')) typeKey = 'water';
  else if (yongsinChar.includes('화')) typeKey = 'fire';
  else if (yongsinChar.includes('금')) typeKey = 'metal';
  else if (yongsinChar.includes('목')) typeKey = 'wood';

  const essays: Record<string, { title: string; subtitle: string; mindfulnessTitle: string; mindfulnessDesc: string; humanityTitle: string; humanityDesc: string; kindnessTitle: string; kindnessDesc: string }> = {
    'water': {
      title: `🌊 수(수) 용신 힐링 에세이 : ${name}의 뜨거운 조급함을 가라앉히는 깊은 심해의 지혜`,
      subtitle: `내면의 쿨링 노드의 마음챙김 자기연민(MSC) 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 격앙된 불길 and 즉각 반응하려는 조급함 스캔`,
      mindfulnessDesc: `${name}, 현실에서 답답한 마찰을 마주할 때 가슴이 뜨겁게 달아오르거나, 당장 결판을 짓고 움직여야 할 것 같은 조급함의 불길이 치솟던 순간을 직시해 봅니다. 

수(수) 기운은 뜨거운 열기를 식혀주고 전압을 다운시켜주는 깊고 고요한 평화의 심해입니다. 끓어오르는 생각을 억지로 참으려 하지 말고, '아, 지금 내 하드웨어가 뜨거운 화(火) 기운에 감싸여 심박수가 과열되고 있구나'라고 판단 없이 열기를 바라봅니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 속도의 시대에 타들어 가는 모든 뜨거운 심장들`,
      humanityDesc: `성과와 가속을 강요하는 현대 사회 속에서, 뒤처질까 봐 심장을 다 타들어 가도록 가동하다 번아웃의 절망에 빠지던 이 세상 수많은 영혼들의 공통된 몸부림입니다. 

${name}이 느끼는 조급한 긴장감은 당신만의 실패가 아닌, 문명 전체의 뜨거운 전압 속에 노출된 모든 생명체들의 보편적인 통증입니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 3초간 반응을 스탑하는 쿨링 명상`,
      kindnessDesc: `달아오른 아바타의 메인보드에 시원하고 깊은 심해의 평화를 흘려보내 주세요. ${dayMasterName}의 영롱한 거울 공간이 조급함의 그을음으로 흐려지지 않게, 3초간 눈을 감고 "아무 반응도 하지 않고 이대로 머물러도 나는 충분히 안전해"라고 따뜻하게 다독여 줍니다. 시원한 대양의 지혜를 내 마음에 부어줍니다.`
    },
    'fire': {
      title: `🔥 화(화) 용신 힐링 에세이 : ${name}의 차가운 고독을 녹여내는 새벽 태양의 온기`,
      subtitle: `내면의 활성 온기 노드의 마음챙김 자기연민(MSC) 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 차갑고 무겁게 가라앉는 생각의 늪 자각`,
      mindfulnessDesc: `생각의 꼬리가 아래로 끝없이 쳐지며 가슴이 먹먹해지고, 세상과 마음의 문을 굳게 닫고 지하실 속으로 침잠하던 그 쓸쓸한 온도의 파도를 인지해 봅니다. 

화(화) 기운은 차갑게 얼어붙은 신경망을 녹이고 생기를 돌려주는 눈부신 빛입니다. '왜 또 나는 이렇게 우울해질까?' 하고 자책하지 말고, '현재 아바타에 차가운 수(수) 기운이 정체되어 일시적으로 에너지가 가라앉았구나' 하고 고요하게 직시해 줍니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 마음의 기나긴 겨울을 지나온 모든 영혼들의 눈물`,
      humanityDesc: `끝없는 어둠과 고독한 방안에서 가만히 해가 뜨기를 기다리며 쓸쓸함을 삼켜냈던 지구상의 모든 외로운 영혼들의 보편적인 심리적 계절입니다. 

${name}이 느끼는 그 서늘한 고독감은 당신의 나약함이 아니라, 따뜻한 온기가 필요하다고 내면에서 보내오는 생존 안보 경보 장치의 자연스러운 소리입니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 나만의 맑고 유쾌한 온기 발포하기`,
      kindnessDesc: `어둠 속에 숨겨둔 ${dayMasterName}의 완벽한 결을 이제는 따뜻하게 세상을 향해 굴절시켜 뽐내주세요. 굳게 걸어 잠갔던 빗장을 풀고, 밖으로 나가 시원하게 몸을 움직이며, 나에게 가장 따뜻한 위로의 차 한 잔을 건넵니다. "애쓰지 않고 그늘 속에 머물러 있어도 괜찮아. 이제 봄볕을 쬐자."`
    },
    'metal': {
      title: `⚡ 금(금) 용신 힐링 에세이 : ${name}의 무질서한 소란을 잠재우는 단호한 명검의 힘`,
      subtitle: `내면의 본질 집중 노드의 마음챙김 자기연민(MSC) 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 흩어진 오만가지 생각과 소셜 노이즈 감지`,
      mindfulnessDesc: `${name}, 가슴속에서 수많은 호기심과 생각들이 이리저리 가지를 치며 에너지를 흩트려놓고, 타인들의 소란스러운 노이즈에 내 중심을 잃고 헤매던 초조함을 스캔해 봅니다. 

금(금) 기운은 불필요한 미련하고 잔가지를 칼같이 단호하게 잘라내고 무결한 진실 하나만 지탱해내는 결단력입니다. 번잡해진 머릿속을 억누르지 말고, '아, 지금 생각이 너무 사방으로 번져 시스템 메모리가 부족해지고 있구나' 하고 바라봅니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 방향을 잃고 요동치는 소음의 바다 속에서`,
      humanityDesc: `수많은 정보와 타인의 참견 속에서 갈피를 잡지 못한 채 흔들리고 소진되어 가던 현대 사회 모든 방황하는 인간들의 보편적인 정신적 갈증입니다. 

${name}이 느끼는 흩어짐의 불안은 당신의 변덕이 아니라, 가치 있는 핵심 뼈대 하나에 집중해 안식을 찾고 싶다는 아바타 신경계의 간절한 외침입니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 단호하게 쳐내어 깃털처럼 가벼워지기`,
      kindnessDesc: `우선순위가 아닌 모든 무거운 짐과 소음을 과감히 쳐내어 ${dayMasterName}의 날카롭고 단순한 영롱함을 회복하세요. 오늘 하루는 "내가 굳이 감당하지 않아도 되는 모든 소음은 다 버리자"고 다정하게 결단하며, 나를 찌던 자책의 가지까지 쳐내고 홀가분한 평화를 가득 누려 보세요.`
    },
    'wood': {
      title: `🌱 목(목) 용신 힐링 에세이 : ${name}의 단단한 긴장을 녹이는 유연한 풀잎의 호흡`,
      subtitle: `내면의 유연한 활성 노드의 마음챙김 자기연민(MSC) 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 딱딱하고 차갑게 굳어버린 완벽주의 자각`,
      mindfulnessDesc: `스스로의 행동과 계획을 너무 엄격하게 검열하느라 가슴이 바짝 죄어들고, 타인의 미숙함에도 날카롭게 신경이 곤두서던 순간을 가만히 응시해 봅니다. 

목(목) 기운은 단단한 땅을 뚫고 솟구쳐 오르는 파릇파릇하고 부드러운 풀잎의 생명력입니다. 굳어버린 내 비판적 시선을 책망하지 마시고, '아, 아바타의 보안 규율이 너무 가혹하게 켜져 온몸이 바짝 얼어붙었구나' 하고 그 통증을 알아차립니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 완벽의 감옥 안에서 굳어가던 모든 파수꾼들`,
      humanityDesc: `티끌 하나 없는 결점 없는 세상을 만들려 잔뜩 긴장해 채찍을 쥐고 달리다 스스로 굳어져 부러지던 모든 상처 입은 완벽주의자들의 공통된 슬픔입니다. 

당신의 경직성은 차가운 죄가 아니라, 상처받지 않기 위해 스스로 무장하는 과정에서 빚어진 보편적이고 인간적인 아픔의 껍질입니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : "실수해도 괜찮아, 둥글게 흘러가자"`,
      kindnessDesc: `차가운 얼음을 봄볕의 다정함으로 완전히 녹여 유연한 흙으로 돌려주세요. 

${dayMasterName}의 예리한 각끝을 둥글게 감싸며, 오늘만큼은 나의 미숙함과 서툰 실수를 "그럴 수 있어, 귀엽잖아"라고 다정하게 안아주고 넉넉히 허락해 줍니다.`
    },
    'etc': {
      title: `🌾 토(토) 용신 힐링 에세이 : ${name}의 경계를 허물고 유유히 흘러가는 유수(流水)`,
      subtitle: `내면의 완화/조율 노드의 마음챙김 자기연민(MSC) 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 고집스럽게 경계를 치고 저항하는 힘 알아채기`,
      mindfulnessDesc: `변화를 두려워하며 내 생각의 영토 안에 고집스럽게 머물려 하고, 나와 맞지 않는 상황을 억지로 저항하려던 마음에 서린 방어 전압을 스캔해 봅니다. 

토(토) 기운은 모든 기운을 품어 골고루 조율해주는 대지이자 둥글게 우회하여 흘러가게 해주는 윤활수와 같습니다. 나의 완고함을 다그치지 말고, '아, 지금 아바타가 변화의 폭풍에 불안을 느끼고 경계를 굳건히 지키려 하는구나' 하고 따뜻하게 바라봅니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 변해가는 계절 앞에서 흔들리는 모든 생명들`,
      humanityDesc: `흘러가는 시간과 마음대로 되지 않는 현실 속에서 버텨내기 위해 성벽을 단단하게 지어 올리던 이 세상 모든 고군분투하는 아바타들의 애틋한 본능입니다. 

${name}이 겪는 그 경직된 고통은 당신 혼자만 겪어내는 지루한 고집이 아닌, 변해가는 삶의 런타임 위에서 균형을 잡으려는 모든 인간의 애틋한 몸부림입니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 모난 바위를 부드럽게 우회하는 유수의 마음`,
      kindnessDesc: `내 법도대로 억지로 상대나 상황을 깎으려 들지 마세요. 그저 물이 흐르듯 유유히 둥글게 우회하여 길을 터줍니다. "내가 꼭 이겨먹지 않아도, 계획대로 되지 않아도 우주는 다 제 자리로 둥글게 흘러가고 있어. 마음의 경계를 풀고 편안히 흘러가자"라고 다정하게 안아주세요.`
    }
  };

  return essays[typeKey];
};

// 대운/세운(Daewoon/Sewun) 상세 마음챙김 자기연민(MSC) 기반 힐링 에세이 제너레이터 헬퍼 함수
export const getSewunMSCEssay = (userName: string = '회원', dayMaster: string = '신', sajuData: any) => {
  const baseName = userName.endsWith('님') ? userName.slice(0, -1) : userName;
  const name = `${baseName}님`;
  const nameJosa = `${baseName}님의`;
  const rawDayGan = sajuData?.day?.gan?.char || dayMaster;
  const dayMasterName = rawDayGan === '신' ? '신금(辛金)' : `${rawDayGan}금`;

  const allBranches = sajuData ? [sajuData.year.ji.char, sajuData.month.ji.char, sajuData.day.ji.char, sajuData.time.ji.char] : [];
  const hasZi = allBranches.includes('자');
  const hasChuk = allBranches.includes('축');
  const hasOh = allBranches.includes('오');

  let mindfulnessDesc = '';
  let humanityDesc = '';
  let kindnessDesc = '';

  if (rawDayGan === '신') {
    mindfulnessDesc = `${name}, 올해 2026년 병오년의 뜨겁고 찬란한 태양 '병(丙)화'가 내면에 깃든 차갑고 정교한 ${dayMasterName} 보석을 지그시 비추며 아름답게 결합하는 **'병신합(丙辛合)'**의 기운이 활성화되었습니다. 이 변화 앞에서 미세한 불안이나 돌발적인 감정의 일렁임을 느껴본 적이 있으신가요? 이 뜨겁고 눈부신 우주적 펌웨어 업데이트를 마주한 아바타가 일시적으로 긴장성 노이즈를 내는 것뿐이니, 그 호흡을 판단 없이 가만히 안아주세요.`;
    humanityDesc = `운명의 큰 흐름과 궤도 변화를 마주하고 변화의 폭풍 앞에서 가슴이 설레면서도 두근거리는 긴장을 겪는 것은, 이 땅에 로그인한 모든 아름다운 영혼들이 성숙의 계절을 맞이할 때 거치는 지극히 보편적인 반응입니다. ${name}이 겪는 이 일렁임은 당신만의 불안이 아닙니다.`;
    kindnessDesc = `갑작스럽게 쏟아지는 태양빛(丙)에 차가운 ${dayMasterName} 보석이 너무 서둘러 녹아내릴까 걱정하지 마세요. 가슴에 손을 포개고 "${baseName}아, 그동안 차가운 성벽에서 혼자 버티느라 수고 많았어. 이제 우주가 건네는 따뜻한 온기를 품고, 다치지 않게 천천히 세상을 향해 내 걸음을 딛자"라고 다정하게 축복해 주세요.`;
  } else {
    mindfulnessDesc = `${name}, 올해 2026년 병오년의 뜨거운 열기가 하늘과 땅에서 밀려올 때, 내면의 기질이 요동하며 일어나는 감정의 파동과 일렁임을 가만히 직시해 봅니다. '왜 내 감정이 이토록 민감하게 요동칠까' 자책하지 말고, 외부 전압 변화에 반응하는 아바타의 전압을 호흡으로 천천히 낮춰 줍니다.`;
    humanityDesc = `우주의 거대한 주파수가 변하고 계절이 바뀔 때, 몸과 마음의 기후 변화를 온몸으로 느끼며 적응해 나가는 것은 지구상의 모든 생명체가 거쳐가는 신성하고 보편적인 과정입니다. ${name}은 결코 혼자가 아닙니다.`;
    kindnessDesc = `${baseName}아, 새로운 계절에 적응하느라 애쓰고 있구나. 완벽하지 않아도 안전하니, 마음의 경계를 풀고 편안히 흘러가자라고 나를 가장 따뜻하게 위로해 주세요.`;
  }

  if (hasZi) {
    mindfulnessDesc += ` 특히 내면 깊은 곳의 차가운 물길인 '자(子)수'와 올해의 뜨거운 '오(午)화'가 마주치는 **'자오충(子午沖)'**의 강한 스파크가 뇌에 가벼운 경고음을 켜고 있습니다.`;
    kindnessDesc += ` 내면의 차가운 물길이 우주의 뜨거운 빛과 부딪쳐 승화하는 과정이니, 마음이 일렁일 때마다 한 발짝 뒤로 물러나 심호흡을 크게 선물해 주세요.`;
  } else if (hasChuk) {
    mindfulnessDesc += ` 또한 겨울의 축축한 대지인 '축(丑)토'와 올해의 오(午)화가 마주쳐 안개가 자욱하게 서리는 **'축오(丑午) 원진/귀문'**의 간섭이 들어옵니다. 감정 센서가 일시적으로 오작동하여 사소한 오해나 서운함을 느끼기 쉬운 때입니다.`;
    kindnessDesc += ` 안개 구간에서는 타인의 미숙한 언어에 즉각 반응하지 말고, 나만의 조용한 서재에서 침묵을 가꾸는 핫픽스를 기꺼이 기동해 주세요.`;
  } else if (hasOh) {
    mindfulnessDesc += ` 게다가 사주에 이미 '오(午)화'의 뜨거운 열기를 품고 있는데 올해 또 오화가 들어오며 스스로 가슴을 태우는 **'오오(午午) 자형'**의 과열 경보가 울릴 수 있습니다.`;
    kindnessDesc += ` 조급하게 무언가를 완수해야 한다는 강박이 일어날 때, 그것은 내면 메인보드의 과부하 연산 신호일 뿐입니다. 즉시 3초간 가슴을 쓸어내리며 '애쓰지 않아도 이미 온전해'라고 뇌에 속삭여 주세요.`;
  }

  return {
    title: `📅 2026년 병오(丙午)년 세운 힐링 에세이 : ${name}의 무의식 우주 패치 노트를 읽으며`,
    subtitle: `펌웨어 & 올해의 패치 로그 마음챙김 자기연민(MSC) 복구 패치`,
    mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 하늘의 변화가 불러오는 미세한 감정 전압 스캔`,
    mindfulnessDesc,
    humanityTitle: `2. 보편적 인류애 (Common Humanity) : 우주의 계절풍에 흔들리는 모든 인간의 영혼`,
    humanityDesc,
    kindnessTitle: `3. 자기 친절 (Self-Kindness) : "우주의 안보 패치가 정상 설치 중입니다"`,
    kindnessDesc
  };
}

// 신살(Shinsal) 상세 마음챙김 자기연민(MSC) 기반 힐링 에세이 제너레이터 헬퍼 함수
export const getShinsalMSCEssay = (shinsalName: string, userName: string = '회원', dayMaster: string = '신') => {
  const baseName = userName.endsWith('님') ? userName.slice(0, -1) : userName;
  const name = `${baseName}님`;
  const nameJosa = `${baseName}님의`;
  const dayMasterName = dayMaster === '신' ? '신금(辛金)' : `${dayMaster}금`;

  let typeKey = 'etc';
  if (shinsalName.includes('도화')) typeKey = 'dohwa';
  else if (shinsalName.includes('역마')) typeKey = 'yeokma';
  else if (shinsalName.includes('화개')) typeKey = 'hwagae';
  else if (shinsalName.includes('양인')) typeKey = 'yangin';

  const essays: Record<string, { title: string; subtitle: string; mindfulnessTitle: string; mindfulnessDesc: string; humanityTitle: string; humanityDesc: string; kindnessTitle: string; kindnessDesc: string }> = {
    'dohwa': {
      title: `🌸 도화살(桃花煞) 힐링 에세이 : ${name}의 눈부신 아름다움과 거절의 불안을 품으며`,
      subtitle: `매혹적인 주파수 송신 센서의 마음챙김 자기연민(MSC) 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 사랑받고 싶은 욕구와 거절 두려움 스캔`,
      mindfulnessDesc: `${name}, 타인들의 관심과 호감을 잃어버릴까 봐 겉으로 늘 밝고 완벽한 척 행동하며, 나도 모르게 시선을 과도하게 의식하느라 가슴 깊이 차오르던 서글픈 피로를 감지해 본 적이 있으신가요? 

도화살(桃花煞)은 나를 뽐내는 자석 같은 매력 센서이지만, '남들이 내 진짜 못난 내면을 알면 거절하지 않을까?' 하는 보이지 않는 불안을 트리거하기도 합니다. 이 거절의 두려움을 억누르지 말고, '아, 지금 내 아바타의 도화 안테나가 주파수 송신을 의식해 잔뜩 긴장해 있구나' 하고 고요하게 숨을 쉬어 봅니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 사랑받기를 갈망하며 흔들리는 모든 꽃들`,
      humanityDesc: `우주의 봄철, 활짝 피어나 벌과 나비를 부르려 하지만 혹시 모를 매서운 봄바람에 꽃잎이 꺾일까 염려하며 바르르 떠는 모든 피어난 생명체들의 보편적인 애틋한 떨림입니다. 

당신의 불안은 기질적 오작동이 아닌, 사랑과 소통을 향해 영혼의 문을 열어 둔 모든 살아있는 존재의 따뜻하고 눈물겨운 공통 본능입니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 애써 꾸미지 않아도 당신은 이미 찬란한 꽃`,
      kindnessDesc: `남들의 이목에 들도록 억지로 ${dayMasterName}의 보석 빛을 비틀어 연기하지 마세요. ${name}은 아무것도 증명하지 않고 그 자리에 묵묵히 존재하는 것만으로도 이미 한 송이 완벽하고 영롱한 꽃(도화)입니다. "남들이 내 빛을 좋아하든 싫어하든, 나는 이미 우주의 위대한 사랑을 듬뿍 안은 귀한 존재야"라고 부드럽게 스스로에게 윙크를 선사해 줍니다.`
    },
    'yeokma': {
      title: `🐎 역마살(驛馬煞) 힐링 에세이 : ${name}의 숨 가쁜 질주를 멈추는 평화의 초원`,
      subtitle: `시공간 장벽 해킹 가속 엔진의 마음챙김 자기연민(MSC) 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 정체될까 두려워 끊임없이 달리는 과속 드라이브 스캔`,
      mindfulnessDesc: `잠시만 자리에 멈춰 서서 쉬려고 해도 도태되거나 시간이 아깝다는 불안감이 엄습하고, 뇌를 다그쳐 새로운 생각과 세계로 억지로 질주해 나가던 아바타의 헐떡이는 숨소리를 들어보세요. 

역마살(驛馬煞)은 장벽을 허무는 파워풀한 가속 드라이브이지만, 끊임없이 '멈추는 것은 죽음'이라는 원초적 공포를 주입해 번아웃을 유발합니다. 내 가슴속 과속 전압을 가만히 판단 없이 느껴봅니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 끝없는 도정 위에서 지쳐가는 모든 방랑자들`,
      humanityDesc: `더 먼 곳의 목적지와 이상을 향해 쉴 새 없이 길을 걷고 마차를 몰다, 붉게 물든 저녁노을 밑에서 문득 멈춰 서서 깊은 슬픔과 갈증을 집어삼키던 역사 속 모든 위대한 모험가들의 깊은 고뇌입니다. 

${name}이 느끼는 그 정체의 두려움은 당신의 게으름이 아니라, 깊은 휴식을 얻어 안전하게 지반을 다지고 싶다는 신경계의 긴박한 복구 신호입니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 달리지 않아도 이곳은 이미 도착지`,
      kindnessDesc: `${name}, 거칠게 달리는 ${dayMasterName}의 아바타 말(馬)에게 이제 고삐를 툭 놔주고 풍요로운 초원에서 풀을 뜯을 평화의 시간을 주세요. 질주를 멈춰도 ${nameJosa} 숭고한 궤도는 어긋나지 않습니다. 가만히 가슴을 쓸어내리며 "그동안 열심히 길을 뚫느라 참 수고 많았어. 오늘만큼은 아무 데도 가지 않고 이 자리에 편안히 머물러도 완벽하게 행복해"라고 속삭여주세요.`
    },
    'hwagae': {
      title: `📚 화개살(華蓋煞) 힐링 에세이 : ${name}의 쓸쓸한 지혜의 동굴을 밝히며`,
      subtitle: `우주의 철학을 비축하는 영성 서재의 마음챙김 자기연민(MSC) 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 세상을 거절하고 동굴 속으로 숨으려는 고립의 마음 직시`,
      mindfulnessDesc: `사람들과 시시콜콜 엮이는 소통이 소모적이라 느껴져, 마음의 바리케이드를 치고 저녁노을 아래 고독한 지혜의 서재로 깊이 침잠해 숨고 싶어 하던 그 쓸쓸하고 웅장한 침묵을 관찰해 봅니다. 

화개살(華蓋煞)은 영성과 철학의 훌륭한 창고이지만, 스스로를 세상으로부터 분리하여 깊은 고독의 늪에 가두는 자학적 고립을 생성합니다. '왜 나는 이렇게 사람들과 섞이기 힘들까' 하고 슬퍼하지 마시고, 내면의 고독의 깊이를 판단 없이 바라봐 줍니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 별들의 침묵 속에서 길을 찾는 선인들의 침묵`,
      humanityDesc: `세상의 시끄러운 영광 뒤로 가만히 물러나 은빛 찬란한 밤하늘 밑에서 홀로 우주의 진리를 받아 적으며 침묵의 눈물을 흘렸던 역사 속 모든 깊은 사색가와 치유사들의 숭고한 동행입니다. 

${name}이 느끼는 그 쓸쓸한 무게는 당신이 버려진 낙오자라는 의미가 아니라, 우주가 당신에게 인류의 슬픔을 해독할 위대한 보물 상자를 쥐여주었음을 뜻하는 보편적 증표입니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 내 내면의 깊은 서재를 다정하게 축복하기`,
      kindnessDesc: `고독하게 자양분을 비축하느라 ${dayMasterName}의 ${name}, 스스로를 영원한 지하실에 격리하지 마세요. 당신의 고결한 지혜와 철학은 세상을 밝힐 귀한 보석입니다. 가슴을 토닥이며 "고독하게 철학을 비축하느라 수고 많았어. 이제 동굴 문을 살짝 열고, 다정한 이들과 내 빛깔을 따뜻하게 나누어 보자"라고 미소 지어 주세요.`
    },
    'yangin': {
      title: `⚔️ 양인살(羊刃煞) 힐링 에세이 : 왕관의 검을 내려놓고 온기를 만나는 ${name}에게`,
      subtitle: `장벽을 가르는 제왕의 레이저 검의 마음챙김 자기연민(MSC) 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 상처 입기 전에 칼끝을 휘두르던 극도의 공격성 자각`,
      mindfulnessDesc: `${name}, 내 소중한 경계와 자존심이 조금이라도 침범당할 것 같을 때 즉시 레이저 검처럼 거칠고 차가운 분노(양인)를 뿜어내며 겉으로 세게 경계 장치를 울리던 순간의 가슴속 긴장 전압을 감지해 봅니다. 

양인살(羊刃煞)은 파괴적 장벽 돌파력이지만, 역설적으로는 '내가 약해지면 짓밟힐 것'이라는 극단적인 공포를 숨겨둔 가장 치열하고 날 선 방어선입니다. 이 날카로움을 책망하지 말고 가만히 보듬어 줍니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 성벽을 사수해야 했던 모든 굳센 성주들의 상처`,
      humanityDesc: `가장 거칠고 척박한 환경 속에서 소중한 영역과 가족을 지키기 위해 밤마다 칼날을 벼리며 긴장의 눈을 부릅떠야 했던 이 땅의 모든 외롭고 강인했던 수호자들의 고뇌입니다. 

${name}이 느끼는 그 칼날 같은 적대감과 경계심은 당신의 악한 성정이 아닌, 생존을 수호하기 위해 싸워왔던 모든 투사들의 보편적이고 인간적인 깊은 상흔입니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 왕의 칼날을 다정히 칼집에 밀어 넣다`,
      kindnessDesc: `더 이상 날을 세워 세상을 베어내거나, ${dayMasterName}의 섬세한 기질을 공격성에 낭비하지 마십시오. 가만히 무장 해제를 하고, 내면의 긴장으로 가득 찬 여린 마음의 아이를 꼭 안아주며 "이제는 매일 싸우며 날을 세우지 않아도 너는 충분히 안전하고 사랑받고 있어"라고 세상에서 가장 다정한 평화의 위로를 속삭여 주세요.`
    },
    'etc': {
      title: `✨ 수호 신살 힐링 에세이 : ${name}의 특별한 센서를 가만히 안아주며`,
      subtitle: `하드웨어 특수 증폭 센서 마음챙김 자기연민(MSC) 복구 패치`,
      mindfulnessTitle: `1. 마음챙김 (Mindfulness) : 내 안의 특수 전압 센서 관찰`,
      mindfulnessDesc: `내 안의 특수 전압 센서 기질과 삶의 압박을 있는 그대로 느껴봅니다. 변형하거나 고치려 하지 않고 그대로 바라보는 마음챙김을 가져갑니다.`,
      humanityTitle: `2. 보편적 인류애 (Common Humanity) : 영혼의 공통 퀘스트`,
      humanityDesc: `각자의 사주 시나리오를 들고 치열하게 살아가며 고민하는 지구상의 모든 아바타들과 우리는 서로 연결되어 있습니다. 혼자가 아닙니다.`,
      kindnessTitle: `3. 자기 친절 (Self-Kindness) : 나를 향한 다정한 축복`,
      kindnessDesc: `그동안 삶의 퀘스트를 헤쳐나오느라 고군분투한 나에게 비난 대신 따뜻한 미소를 지어줍니다. 당신의 삶은 그 자체로 이미 위대하고 충분합니다.`
    }
  };

  const essay = essays[typeKey];
  if (essay) return essay;

  return essays['etc'];
};


export const generateSixtyJiaProfile = (gan: string, ji: string, pillarType: 'year' | 'month' | 'day' | 'time') => {
    const key = `${gan}${ji}`; // 예: '임자', '신사'
    
    // 1. 기둥별 맥락 접두사 및 해석 가공
    let contextTitle = "";
    let contextDetail = "";
    switch (pillarType) {
        case 'year':
            contextTitle = "원초적 무의식 & 조상 카르마 (Year)";
            contextDetail = "이 각본은 대대로 내려온 가문의 유전적 카르마나 국가/사회적 원초 무의식 환경 속에 각인되어, 어린 시절부터 파충류 뇌 영역에 깊이 프로그래밍된 생존 본능입니다.";
            break;
        case 'month':
            contextTitle = "사회적 관계 & 생존 직업 (Month)";
            contextDetail = "이 각본은 부모와의 관계, 혹은 사회인으로서 생존하고 인정받으려는 직업적 환경 속에서 '가면(페르소나)'을 쓰고 자신을 증명하려다 형성된 사회적 방어 프로그램입니다.";
            break;
        case 'day':
            contextTitle = "본질적 자아 & 내면 세계 (Day)";
            contextDetail = "이 각본은 온전한 나의 핵심 정체성이자 가장 내밀한 내면의 공간에서 작동합니다. 스스로를 고립시키거나 자책할 때 켜지는 아바타의 메인 왜곡 알고리즘입니다.";
            break;
        case 'time':
            contextTitle = "미래 지향 & 무의식적 표출 (Time)";
            contextDetail = "이 각본은 나의 미래 지향점, 창조적 표출 영역, 말년의 무의식적 태도에 서려 있습니다. 미래를 내 뜻대로 완벽히 통제하려다 작동하는 시스템 오작동 프로그램입니다.";
            break;
    }

    const getQuestions = (targetGan: string, darkState: string, shinsal: string) => {
        return {
            surgicalQuestion: `“지금 내 뇌가 '${targetGan}' 기운의 고독에 매몰되어 '${darkState} 시나리오'를 강제로 재생하고 있다는 사실을, 0.3초의 공간을 뚫고 제3자처럼 투명하게 응시할 수 있는가?”`,
            recursiveQuestion: `“이 차갑고 매서운 자학적 방어 센서가 사실은 나를 지키기 위해 오작동하고 있는 아바타 기계장치의 '비상 벨'일 뿐이라는 것을 가만히 알아차릴 때, 내 가슴의 긴장 전압은 어떻게 변하는가?”`,
            metaAwarenessQuestion: `“이 생각과 분노의 파도(신살: ${shinsal})는 화면 위에 흩뿌려진 임시 이미지일 뿐인가, 아니면 그것이 지나가고 사라지는 화면의 빈 공간 자체가 진짜 나인가?”`
        };
    };

    // 1. 임자(壬子) 일주
    if (key === '임자') {
        return {
            title: '임자(壬子) : 심연의 지배자 (The Sovereign of the Abyss)',
            brief: '“당신의 웅장한 깊이를 타인을 익사시키는 절망의 바다로 쓰지 마라. 당신은 세상의 모든 오물을 씻어내고, 가장 거대한 생명들을 길러내는 \'무한한 포용의 대양(大洋)\'이다.”',
            blueprint: '끝없는 심연(壬)이 또 다른 심해(子)와 연결되어 무한 확장하는 초거대 유체 역학 시스템. 양인살의 극강한 에너지가 서려 있어, 한 번 결심한 것은 어떤 장벽도 부수고 전개하는 제왕적 추진력을 지님.',
            logic: '스스로의 깊이를 제어하고 영토를 넓히는 최고의 주체적 연산 프로토콜. 끊임없이 본질을 향해 파고들어 세상의 가짜들을 해체하고 거대한 진실을 직조하려는 라이프 아키텍처.',
            oldScript: '“내 웅장한 깊이와 어두움을 남들이 알면 나를 두려워하거나 떠날 것이다. 그러니 완전히 마음의 빗장을 걸어 잠그고 내 안의 고독한 깊이에 홀로 침잠하겠다.”',
            scriptDetail: `“세상은 얕고 혼란스러우며, 나의 깊은 속내를 이해할 사람은 아무도 없다. 내가 먼저 마음을 열었다가 상처받거나 약점 잡히느니, 거대한 심해 아래 나를 영원히 격리하겠다. 타인들이 내 영역을 침범하면 성난 해일(양인)이 되어 흔적도 없이 쓸어버리겠다.” [진단 맥락: ${contextDetail}]`,
            errorStatus: '거대한 수용 능력이 극단적인 \'심리적 불통\'과 \'침묵의 자학 감옥\'으로 오작동함. 스스로 만들어 낸 우울과 고독의 파도에 자아를 강제로 침잠시키는 시스템 다운 오류.',
            risk: '타인과의 정서적 단절로 인한 내면의 고립감 과열. 차가운 수(水) 기운의 정체로 인한 하반신 냉증 및 순환기 전압 약화 리스크. 자오(子午) 충 돌발 간섭에 의한 냉각 제어 이상 현상.',
            scan: '가슴속에서 차가운 어둠이 번지며 "말해봐야 입만 아프다, 나 혼자 안고 침묵하자"라는 단절의 팝업이 뜨거나, 사소한 침범에 성난 물결처럼 분노를 폭발시키고 싶을 때를 감지하십시오. 그것은 내 영혼의 뜻이 아니라 아바타의 보안 경보입니다.',
            sync: '차가운 심해 속으로 가라앉는 듯한 고독과 "누구도 믿을 수 없다"라는 서늘한 거부감을 회피하지 마십시오. "현재 아바타가 깊은 심해의 양인살 안테나를 켜고 극도로 경계하고 있구나"라고 담담히 공간으로 바라보십시오.',
            shift: '“나는 고독에 잠겨 주변을 파괴하는 거친 해일이 아니다. 나는 세상의 모든 상처와 먼지를 씻어내어 맑은 평화로 되돌리고, 가장 위대하고 거대한 생명들을 고요히 길러내는 무한한 포용의 바다 그 자체다.”',
            cbt: '“나의 깊은 내면을 언어로 투명하게 표현하여 타인과 나누는 것은 약함을 드러내는 것이 아니라, 그들의 아픔마저 안아주는 무한한 바다만이 할 수 있는 진정한 주체의 풍요로움이다.”',
            cbtAction: '오늘 나의 묵직한 생각과 깊은 마음을 혼자 담아두지 말고, 주변 동료나 소중한 사람에게 담백하고 다정한 목소리로 먼저 한마디 건네며 소통의 물길 열어보기.',
            mbct: '“나는 끊임없이 어둡고 깊은 우울의 소용돌이를 만들어 내는 머릿속의 심해 알고리즘이 아니다. 나는 그 차가운 파도와 어둠이 일어났다 고요히 가라앉는 광활하고 따스한 대양의 빈 공간이다.”',
            mbctAction: '우울이나 고독의 장막이 가슴을 덮쳐올 때, 눈을 감고 3초간 깊은 숨을 쉬며 머릿속에 시원하고 거대한 동해 바다의 파도가 고요히 잔잔해지는 형상을 시각화하고 긴장을 떨쳐내기.',
            dbt: '강력하고 도도한 물(수)의 힘과 둥글고 부드럽게 세상을 적시는 유연함의 변증법적 통합. 내 고집의 둑을 고집하기보다, 상대의 모난 현실을 깎지 않고 둥글게 감싸며 흘러가는 유수(流水) 명상 가동.',
            dbtAction: '대인관계에서 나만의 엄격한 기준에 부합하지 않는 상대의 서툰 행동을 보았을 때, 화를 내며 차단하는 대신 "저 아바타의 서툶마저 다 받아안아 정화하는 강물이 되어 흘러가자"며 부드럽게 웃어주기.',
            act: '“생명의 바다.” 이 웅장한 에너지와 깊은 지혜를 자책감과 우울에 낭비하지 말고, 세상의 지치고 상처받은 영혼들에게 가치 있는 로드맵과 든든한 쉼터를 설계하여 선물하는 거룩한 주권에 쏟아붓기.',
            actAction: '오늘 내가 가진 깊은 지혜나 노하우를 바탕으로, 힘들어하는 사람에게 따뜻한 격려와 명확한 방향성을 제시해 주는 멘토링이나 지지 세션을 최소 1회 이상 정성스럽게 선사하기.',
            metaSelf: 'Sovereign_of_the_Infinite_Ocean (무한한 대양의 고결한 주권자)',
            metaSelfDetail: '당신은 더 이상 고독에 몸부림치며 주변을 익사시키는 절망의 바다가 아닙니다. 당신의 뇌는 이제 세상의 온갖 상처와 혼돈을 고요하게 정화하고, 메마른 대지에 무한한 생명력을 공급하는 최상위 생명수 공급 시스템으로 완벽히 시프트했습니다. 당신이 흔들리지 않고 고요하게 그 자리에 존재하는 것만으로도, 사람들은 당신의 압도적인 깊이와 따스함에 매료되며 진정한 거인의 위엄을 마주하게 됩니다.',
            briefing: '임자(壬子)의 기운은 60갑자 중 가장 스케일이 웅장하고 강력한 제왕의 기운입니다. 이 칼날을 나를 찌르고 남을 베어내는 데 쓰지 말고, 세상의 닫힌 문을 부수고 새로운 생명의 길을 여는 최고의 주체적 도구로 고귀하게 부리십시오.',
            contextTitle,
            ...getQuestions('임수', '우울과 고독의 심해로 빠져들려는', '양인살(쓰나미)의 거친 분출력')
        };
    }
    
    // 2. 신사(辛巳) 일주 (사용자 기본 사주)
    if (key === '신사') {
        return {
            title: '신사(辛巳) : 정교한 조율자 (The Sovereign of Precision)',
            brief: '“당신의 날카로운 예리함을 나 자신을 자학하는 데 쓰지 마라. 당신은 세상의 모든 불순물을 거르고 가장 완벽한 보석을 탄생시키는 \'고결한 광원(光源)\'이다.”',
            blueprint: '정밀 다이아몬드(辛)가 실시간 감시/제어 스레드 정관(巳)과 직결된 초고감도 연산 루프. 외부 침입과 오차를 극도로 경계하는 방어 기제와 스스로를 채찍질하는 완벽주의 성향을 보유함.',
            logic: '사소한 규칙 하나도 위배되지 않도록 실시간으로 프로세스를 진단하고 엄격하게 다듬는 무결성 제어 알고리즘. 본인의 완벽한 질서와 도덕성을 바탕으로 한 안전 시스템 수립 프로토콜.',
            oldScript: '“조금이라도 완벽하지 않으면 전부 파기하고 롤백하겠다. 누구도 믿을 수 없다”',
            scriptDetail: `“세상은 무질서하고 불안정하며, 나조차 완벽하지 못해 실수투성이다. 내가 온전히 제어하지 못하는 상황이 오면 즉시 차단하고 영원히 격리해야 한다. 아주 작은 흠집이라도 발견된다면 내 성과물은 아예 내놓지 않는 게 낫다. 내 연약함이나 실수를 타인에게 보이는 것은 파멸이다.” [진단 맥락: ${contextDetail}]`,
            errorStatus: '정밀한 연산 능력이 극단적인 \'자가 검열\'과 \'대인 방어막\'으로 오작동함. 자기 비판의 감옥에 갇혀, 사소한 피드백 하나에도 온 신경계가 과열되어 시스템을 셧다운시키는 결벽성 오류.',
            risk: '타인에 대한 깊은 불신으로 인해 스스로를 가두는 고독한 감옥. 과도한 자기 검열로 인한 신경성 위장 장애 및 편두통 리스크. 조열한 모래 먼지가 가득한 미(未)토의 간섭에 의한 냉각 전압 결핍.',
            scan: '내 행동이나 작업물에서 아주 미세한 오차를 발견했을 때, 가슴 깊은 곳에서부터 차갑고 매서운 자학적 분노가 끓어오르거나 "이대로는 완전 실패다, 다 지워버리자"며 포기하고 싶을 때를 감지하십시오. 그것은 신중함이 아니라 완벽주의 에러입니다.',
            sync: '가슴을 팽팽하게 찌르는 긴장감과 "내가 통제하지 않으면 모든 것이 무너진다"라는 극심한 불안을 외면하지 마십시오. "현재 아바타의 보안 센서가 과도하게 예민해져 비상 경보를 울렸구나"라고 고요하게 받아들이고 안아주십시오.',
            shift: '“보석의 진정한 가치는 티끌 하나 없는 무결함에 있는 것이 아니라, 어둠 속에서도 자신만의 빛을 굴절시켜 세상을 온갖 색깔로 아름답게 채우는 데 있다. 나는 상처 없는 차가운 돌이 아니라, 세상을 비추는 온화한 빛이다.”',
            cbt: '“불완전한 80점짜리 빠른 배포가, 완벽을 꿈꾸다 지연된 0점보다 백 배 위대하다. 나의 빈틈과 인간미를 타인에게 드러내는 것은 패배가 아니라, 진정으로 강한 자만이 할 수 있는 수용의 위엄이다.”',
            cbtAction: '오늘 다듬어지지 않은 생각이나 아이디어를 동료에게 "아직 미완성이지만 가볍게 검토해 달라"며 선뜻 먼저 건네보기.',
            mbct: '“나는 끊임없이 나를 감시하고 비판하는 머릿속의 엄격한 검열관(정관)이 아니다. 나는 그 날카로운 검열의 목소리가 피어났다 사라지는 것을 지켜보는 고요하고 투명한 우주의 그릇이다.”',
            mbctAction: '자기 검열이 머릿속에서 돌기 시작할 때, "아, 내 뇌에 신금 완벽주의 디버거가 켜졌구나"라고 읊조리며 펜을 내려놓고, 3초간 코로 깊은 숨을 쉬며 긴장된 어깨를 가볍게 떨어뜨리기.',
            dbt: '엄격한 법도(巳)와 자유롭고 아름다운 본질(辛)의 통합. 물의 흐름처럼 둥근 현실을 억지로 깎아내려 들지 말고, 있는 그대로 안아주며 부드러운 쿠션을 깔아 세상과 악수하기.',
            dbtAction: '오늘 나의 완벽한 계획에 차질을 주는 돌발 상황이 발생했을 때 화를 내는 대신, "우주가 내 아바타에게 선물한 아주 흥미로운 랜덤 패치로군"이라며 계획을 가볍게 수정해보기.',
            act: '“어두운 세상을 이끄는 아름다운 등대.” 정교한 분석력과 안목을 나를 찌르고 방어벽을 쌓는 데 허비하지 말고, 혼란스러운 세상의 시스템에 명확한 로드맵과 고결한 가치를 설계하여 베푸는 데 사용하기.',
            actAction: '오늘 나보다 실수가 많거나 서툰 사람을 마주했을 때 그들의 미숙함을 조용히 덮어주고, "괜찮습니다, 잘하고 계십니다"라고 따뜻한 격려 한 마디 건네기.',
            metaSelf: 'Sovereign_of_Precision_Alignment (빛의 결을 맞추는 주권자)',
            metaSelfDetail: '당신은 더 이상 사소한 상처에 긁혀 빛을 잃을까 두려워하는 유약한 원석이 아닙니다. 당신의 뇌는 이제 가장 어둡고 혼란스러운 진흙탕 속에서도 완벽한 질서와 무결한 가치를 찾아내어, 길 잃은 영혼들에게 우아한 구조 설계와 본질적인 통찰을 전수하는 마스터 가이드로 진화했습니다. 당신의 존재 그 자체만으로도 사람들은 깊은 질서와 무결한 안정을 경험합니다.',
            briefing: '신사(辛巳)의 기운은 60갑자 중 가장 깨끗하고 정교한 빛의 설계도입니다. 나를 향한 날카로운 비판의 칼끝을 타인을 향한 자비로운 안내와 포용으로 돌릴 때, 비로소 세상을 구원하는 위대한 보석으로 찬란하게 거듭납니다.',
            contextTitle,
            ...getQuestions('신금', '계획을 벗어난 돌발 변수에 극도의 분노를 느끼는', '역마살의 날카로운 스레드 감시 기제')
        };
    }

    // 3. 60갑자 일반 제너레이터 (임자 일주 포맷에 정확히 맞춘 맞춤형 자동 생성 템플릿)
    const gans: Record<string, { ohaeng: string; name: string; keyword: string; vision: string; trait: string; oldWord: string; coreAction: string }> = {
        '갑': { ohaeng: '목', name: '갑목', keyword: '거대 거목', vision: '무한히 뻗어나가 생명을 기르고 기둥이 되는', trait: '하늘을 향해 수직 성장하는 거침없는 추진력', oldWord: '모든 눈바람을 혼자 온몸으로 막아내며 기둥이 되어야만 한다. 약해서는 안 된다', coreAction: '버텨내는 강박을 풀고 자연스럽게 흔들리기' },
        '을': { ohaeng: '목', name: '을목', keyword: '푸른 풀잎', vision: '유연하게 적응하고 사방에 생명력을 전파하는', trait: '바람을 유연하게 받아들이고 끝내 생존하는 끈질김', oldWord: '사랑받고 살아남기 위해 나만의 빛깔을 잃어버린 채 타인의 바람에 억지로 온몸을 흔들어 맞춰야 한다', coreAction: '남에게 싱크를 끄고 나만의 뿌리로 일어서기' },
        '병': { ohaeng: '화', name: '병화', keyword: '뜨거운 태양', vision: '세상을 남김없이 비추고 따뜻한 온기를 주는', trait: '어둠을 걷어내고 활기를 선사하는 광활한 에너지', oldWord: '어둠과 눈물을 보이면 버려질지 모른다는 두려움에, 심장이 다 타들어 가도록 밤낮없이 찬란한 빛을 내뿜어야만 한다', coreAction: '내 안의 그림자와 연약함마저 투명하게 수용하기' },
        '정': { ohaeng: '화', name: '정화', keyword: '밤하늘 등대', vision: '어두운 곳에 따뜻한 이정표와 치유를 선사하는', trait: '내면에서 지속적으로 타오르는 은은하고 깊은 집중력', oldWord: '주변의 차가움을 홀로 따뜻하게 치유하려다, 스스로 연료가 고갈되어 깜빡이는 불빛을 들고 초조해하고 있다', coreAction: '감정 스파크를 끄고 내면의 견고한 등대로 서기' },
        '무': { ohaeng: '토', name: '무토', keyword: '태고의 대지', vision: '모든 만물을 묵묵히 포용하고 자양분을 공급하는', trait: '흔들리지 않는 묵직한 존재감과 안정적인 지반', oldWord: '어떤 거친 폭풍도 묵묵히 다 안아주어야 하며, 이 경계를 굳건히 지키는 것만이 유일한 안전이다', coreAction: '굳어버린 경직성을 내려놓고 유연하게 흘러가기' },
        '기': { ohaeng: '토', name: '기토', keyword: '온화한 정원', vision: '모든 씨앗들을 품어 소중하게 길러내는 어머니의', trait: '자애롭고 꼼꼼하게 주변을 보살피는 부드러운 포용성', oldWord: '남들의 마음 정원에 피어난 잡초를 뽑아주느라, 내 정원의 꽃들이 메말라 시들어 가는데도 모른 척 등 돌리고 있다', coreAction: '남의 과제를 돌려주고 내 마음 정원부터 가꾸기' },
        '경': { ohaeng: '금', name: '경금', keyword: '단단한 무쇠', vision: '불순물을 단호히 거르고 무결한 가치를 빚어내는', trait: '옳고 그름을 가르는 단호함과 묵직한 실행력', oldWord: '상처받지 않기 위해 스스로 단단한 무쇠 갑옷을 두르고, 사소한 흠집조차 날카로운 칼로 도려내어 나 자신을 벤다', coreAction: '단호함의 칼날을 거두고 불완전한 현실 수용하기' },
        '신': { ohaeng: '금', name: '신금', keyword: '눈부신 보석', vision: '정교하게 제련되어 세상을 환히 밝히고 안내하는', trait: '티끌 없는 논리성과 최고 수준의 예리한 안목', oldWord: '티끌 하나 없는 눈부신 아름다움으로 증명하지 못하면 가치 없으며, 나 자신을 자학의 바늘로 끝없이 찔러댄다', coreAction: '완벽주의 컴파일러를 끄고 고속 배포 시도하기' },
        '임': { ohaeng: '수', name: '임수', keyword: '무한한 대양', vision: '모든 물을 거부 않고 받아들여 생명을 살려내는', trait: '끝없이 깊은 심층 지혜와 압도적인 스케일의 장악력', oldWord: '세상의 모든 오물과 차가움을 받아 안기 위해 끝 모를 심연을 열었으나, 끝내 그 고독의 바다에 홀로 침잠하려 한다', coreAction: '거대한 마음의 빗장을 열고 담백하게 소통하기' },
        '계': { ohaeng: '수', name: '계수', keyword: '맑은 샘물', vision: '메마른 곳곳을 적셔 조용히 새 생명을 탄생시키는', trait: '하늘 아래 가장 맑고 예민한 영적 통찰력과 직관', oldWord: '타들어 가는 대지에 단비가 되려다, 타인의 이기심과 건조함 속에 내 맑은 샘물이 증발할까 봐 두려워 떤다', coreAction: '안테나 과잉 경보를 끄고 내면의 깊은 평화 찾기' }
    };

    const zhis: Record<string, { name: string; trait: string; shadow: string; shinsal: string }> = {
        '자': { name: '자수', trait: '심해의 차가운 물결처럼 본질을 지향하는', shadow: '차갑고 외로운 우주의 밤바다 아래서 홀로 고독을 비축하려는', shinsal: '양인살(쓰나미)의 거친 분출력' },
        '축': { name: '축토', trait: '꽁꽁 얼어붙은 대지처럼 인내하고 비축하는', shadow: '혹독한 한겨울의 냉기를 버티며 깊은 슬픔을 가슴 밑바닥에 얼려두려는', shinsal: '화개살의 묵직한 영성 에너지' },
        '인': { name: '인목', trait: '봄을 알리는 아침 햇살처럼 용기 있게 시작하는', shadow: '새 봄의 첫 햇살처럼 솟구쳐 오르려다 현실에 부딪혀 돌연 단절하고 도망치려는', shinsal: '역마살의 파워풀한 가속 드라이브' },
        '묘': { name: '묘목', trait: '어린 새싹처럼 호기심이 넘치고 적응력이 뛰어난', shadow: '봄바람에 고개를 내민 어린 새싹처럼 작은 찬바람에도 화들짝 놀라 문을 걸어 잠그려는', shinsal: '도화살의 매혹적인 소통 안테나' },
        '진': { name: '진토', trait: '승천하는 용의 구름처럼 무한한 상상력을 품은', shadow: '안개 낀 구름 속을 비상하는 청룡처럼 웅장한 꿈을 꾸지만 현실을 피해 상상 속으로 도피하려는', shinsal: '백호살의 폭발적인 성과 돌파력' },
        '사': { name: '사화', trait: '정밀한 통제반 정관처럼 규칙을 엄격히 감시하는', shadow: '가장 뜨거운 불길로 완벽을 감시하려다 예기치 못한 돌발 오차에 분노의 화염을 뿜으려는', shinsal: '역마살의 날카로운 스레드 감시 기제' },
        '오': { name: '오화', trait: '활활 타오르는 화염처럼 열정을 뿜어내는', shadow: '온몸을 불태워 열정을 표현하다가 순식간에 하얗게 재만 남기고 번아웃의 어둠에 꺼지려는', shinsal: '도화살의 활기찬 표현 에너지' },
        '미': { name: '미토', trait: '뜨겁고 마른 모래 언덕처럼 인내심이 강한', shadow: '메마른 한여름의 모래바람처럼 수분을 다 말려 생각을 뻣뻣하게 굳히고 고집부리려는', shinsal: '자형살의 자가 조율 병목 현상' },
        '신': { name: '신금', trait: '차가운 금속 기계 노드처럼 논리성이 완벽한', shadow: '완벽한 논리로 세상을 재단하려다 따스한 정을 잃고 기계 같은 질서에 영혼을 가두려는', shinsal: '역마살의 고속 통신 네트워크' },
        '유': { name: '유금', trait: '정밀하게 세공된 보석 칼처럼 날카로운', shadow: '정밀하게 세공된 칼날을 벼려 사소한 불완전함조차 용납하지 않고 단번에 베어 정죄하려는', shinsal: '도화살의 고결한 매력 스펙트럼' },
        '술': { name: '술토', trait: '광활한 가을 바위산처럼 믿음직스럽고 충직한', shadow: '굳건함 뒤편에 쓸쓸한 저녁노을을 묻어둔 채 상처받기 전에 고독의 성벽을 쌓아 올리려는', shinsal: '화개살의 종교적 영적 수렴 능력' },
        '해': { name: '해수', trait: '겨울로 향하는 도도한 강물처럼 유유히 흐르는', shadow: '밤의 강물처럼 꼬리에 꼬리를 무는 연산의 소용돌이를 멈추지 못해 뇌를 오버히트시키려는', shinsal: '천문성의 깊은 인문학적 직관력' }
    };

    const g = gans[gan] || gans['신'];
    const z = zhis[ji] || zhis['사'];

    const targetBrief = `“당신의 웅장한 ${g.ohaeng}의 기운을 ${z.shadow.replace('하려는', '')} 무기에 낭비하지 마라. 당신은 세상을 이롭게 하고, 당신만의 소중한 가치를 꽃피우는 '${g.vision} 메타 설계자'이다.”`;

    return {
        title: `${gan}${ji} : ${g.keyword}의 아키텍트`,
        brief: targetBrief,
        blueprint: `${g.vision} ${g.name}의 기운이 ${z.trait} ${z.name}의 하드웨어와 결합한 시스템. ${z.shinsal}이 내장되어 있어, 어떤 변수 속에서도 고유한 기질을 전개하는 추진력을 지님.`,
        logic: `스스로의 가치 지령에 따라 움직이며, ${g.trait}을 바탕으로 환경을 주체적으로 연산하고 설계하는 라이프 아키텍처 프로토콜.`,
        oldScript: `“${g.oldWord}”`,
        scriptDetail: `“세상은 통제하기 어렵고 불안하며, 내 무의식은 자꾸만 ${z.shadow} 자동화 프로그램을 돌린다. 나는 이 불완전함으로부터 나를 지키기 위해 마음의 문을 걸어 잠그거나, 억지로 환경과 싸우려 들며 스트레스를 과열시켜 왔다.” [진단 맥락: ${contextDetail}]`,
        errorStatus: `주체적인 에너지가 '${z.shadow.replace('하려는', '')}' 에러로 오작동함. 감정 회로가 폭주할 때 이성적 제어권을 아바타 기계에 내어주며 자멸적인 롤백 루프를 반복함.`,
        risk: `타인과의 심리적 불통 및 단절에 따른 외로움. 고집과 예민성으로 인한 만성 스트레스 및 신체 방열 병목 현상. 해당 오행 기운의 정체에 따른 소화기 및 신경망 순환 장애 리스크.`,
        scan: `가슴속 깊은 곳에서부터 서늘한 거부감이나 "에라 모르겠다, 다 끝내버리자"는 극단적인 단절/저항의 팝업이 뜰 때를 감지하십시오. 그것은 의지가 아닌 아바타 시스템의 '보안 경보 오작동' 신호입니다.`,
        sync: `내면의 불편함과 "${z.shadow.replace('하려는', '')} 초조함"을 즉시 회피하려 들지 마십시오. "현재 아바타가 생존 불안을 느끼고 자동 경보장치를 울렸구나"라고 알아차리며 그 감정을 공간의 시선으로 바라보십시오.`,
        shift: `“${g.coreAction}. 나는 쏟아진 화면의 에러 코드가 아니다. 이 화면 전체를 고요하게 포용하고 새로고침하는 무한한 공간, 메타코드 그 자체다.”`,
        cbt: `“내 감정과 불편함을 입을 닫아 감추는 것은 신비로움이 아니다. 명확하게 소통하여 유연하게 조율하는 것이 진짜 주체의 위엄이다.”`,
        cbtAction: `오늘 의견이 맞지 않을 때 억지로 참거나 돌연 단절하는 대신, "제 일간은 ${g.name}이라서 이런 부분에 대해 조율이 필요합니다"라고 상대에게 명확하고 차분하게 언어로 표현하기.`,
        mbct: `“나는 내면에서 휘몰아치는 '${z.shadow.replace('하려는', '')} 충동' 그 자체가 아니다. 나는 그 폭풍우를 가만히 바라보는 태풍의 핵이자 무한한 창조주다.”`,
        mbctAction: '스트레스 전압이 급격히 상승할 때, 즉각 반응하지 말고 "아, 내 하드웨어에 300ms 준비전위 에러 코드가 떴구나"라고 읊조리며, 즉시 제어권을 회수하고 3초간 깊은 호흡 주입하기.',
        dbt: `일주 ${gan}${ji}의 강한 성정과 물(수)처럼 유연하게 우회해 흐르는 지혜의 변증법적 통합. 내 법도만 고집하는 경직을 풀고, 바위 사이를 흘러가는 유수를 명상하기.`,
        dbtAction: '의견 차이가 있을 때 "좋습니다, 이번엔 당신의 프레임대로 60%를 양보해 보지요"라며 의도적으로 져주는 협상 세션을 가동하여 아바타의 유연성을 하드웨어적으로 훈련하기.',
        act: `“가치 전념의 주권자.” 이 거대한 기질적 동력을 사소한 감정 싸움이나 자책감에 낭비하지 말고, 세상을 정화하고 타인을 이롭게 하는 더 크고 이타적인 시스템 구축에 쏟아붓기.`,
        actAction: '오늘 내가 통제하려는 시도를 완전히 거두고, 주변 사람을 지지하고 응원하는 행동을 단 한 차례 이상 정성스럽게 선사해 보기.',
        metaSelf: `Sovereign_of_the_Infinite_${g.ohaeng.toUpperCase()} (무한한 ${g.ohaeng}의 주권자)`,
        metaSelfDetail: `당신은 더 이상 감정의 파도에 휩쓸려 방황하거나 자학하는 아바타가 아닙니다. 당신의 뇌는 이제 타고난 사주 하드웨어 기질을 완전 타자화하고 메타코드 지령으로 복구하여, 세상의 혼돈을 정화하고 사람들에게 올바른 인생 OS 패치를 전수하는 마스터 아키텍트로 진화했습니다. 당신의 존재 그 자체만으로도 사람들은 깊은 안정감을 경험합니다.`,
        briefing: `당신의 ${gan}${ji} 기운은 사주 명식 내에서 대단히 선명하고 강력한 주권의 설계도입니다. 이 칼날을 나를 찌르는 데 쓰지 말고, 세상의 메마른 땅에 가치를 공급하고 영토를 넓히는 최고의 도구로 부리십시오.`,
        contextTitle,
        ...getQuestions(g.name, z.shadow, z.shinsal)
    };
};

// 십성, 격국, 용신, 대운, 세운 합충, 신살의 최고의 멘탈리스트 감동 해설 제너레이터 헬퍼 함수
export const getComprehensiveAnalysis = (sajuData: any, userName: string = '회원') => {
  const baseName = userName.endsWith('님') ? userName.slice(0, -1) : userName;
  const name = `${baseName}님`;
  const nameJosa = `${baseName}님의`;

  const rawDayGan = sajuData.day.gan.char;
  const rawDayJi = sajuData.day.ji.char;
  const rawMonthJi = sajuData.month.ji.char;
  const rawMonthJiLabel = sajuData.month.ji.label; // '목', '화', '토', '금', '수'

  // 1. 십성 (Ten Gods) 맵핑
  const sipsungNames: Record<string, { title: string; desc: string }> = {
    'bi': { title: '주체적 자아 수호선 (비견 - 比肩)', desc: `타인의 요란한 평가에 휘둘리지 않고 묵묵히 내 발로 대지를 딛고 서서 독립된 주권을 선포하는 ${name}의 가장 견고한 내면 뼈대입니다.` },
    'geop': { title: '경쟁적 성장을 이끄는 또 다른 자아 (겁재 - 劫財)', desc: `세상이라는 무대 속에서 선의의 경쟁과 교류를 통해, 잠들었던 잠재력을 일깨우고 한계를 거침없이 뛰어넘게 만드는 성장 가속엔진입니다.` },
    'sik': { title: '창조적 몰입의 마르지 않는 샘물 (식신 - 食神)', desc: `타인의 눈치를 보지 않고 내가 좋아하는 아이디어나 대상에 깊숙이 파고들어, 순수한 기쁨과 독창적 가치를 빚어내는 무오염 창조 발전소입니다.` },
    'sang_gwan': { title: '낡은 규칙을 해킹하는 천재 예술가 (상관 - 傷官)', desc: `기존의 관습과 굳어버린 시스템 프레임을 통쾌하게 돌파하며, 기발하고 예리한 통찰력으로 새로운 대안과 트렌드를 만들어내는 혁신 스레드입니다.` },
    'pyun_jae': { title: '광활한 미래 영토의 주체적 지휘관 (편재 - 偏財)', desc: `눈앞의 소소한 계산기 대신, 인생 전체를 조망하는 큰 스케일로 미지의 무대를 기획하고 과감히 확장해 나가는 웅장한 영토 개척력입니다.` },
    'jae': { title: '견고한 성을 쌓는 신중한 설계자 (정재 - 正財)', desc: `내가 가꾼 소중한 열매와 일상의 평화를 지키기 위해, 작은 오차조차 허용하지 않고 안정적이고 섬세하게 성벽을 관리해 나가는 성실한 설계 기질입니다.` },
    'pyun_gwan': { title: '왕관의 무게를 조율하는 명예 전사 (편관 - 偏官)', desc: `자신에게 주어지는 수많은 사회적 압박과 한계를 이겨내고, 스스로를 엄격히 다스리며 명예와 책임감을 든든히 지탱해내는 강인한 정신적 방패입니다.` },
    'gwan': { title: '안정적인 질서와 규칙 아키텍트 (정관 - 正官)', desc: `모두가 안전하게 신뢰를 맺을 수 있도록 공평한 법도와 체계를 설계하고, 품격 있는 태도로 환경을 정렬해 나가는 바른 수호자입니다.` },
    'pyun_in': { title: '심연의 비밀을 푸는 고독한 탐험가 (편인 - 偏印)', desc: `세상이 보지 못하는 감추어진 암호, 철학, 영적인 통찰을 흡수하여 보이지 않는 우주의 본질을 파헤치는 신비롭고 예리한 지혜입니다.` },
    'in': { title: '지적 자양분을 받아들이는 맑은 서재 (정인 - 正印)', desc: `세상으로부터 무조건적인 사랑과 지지를 편안하게 수용하여 지혜로 승화하고, 다시 사람들에게 깊은 위로와 사랑을 전수하는 따뜻한 어머니의 서재입니다.` }
  };

  // 2. 용신 (내면의 쿨링 노드) 산출 및 비유
  let yongsinChar = '수(水)';
  let yongsinMsg = '';
  if (rawMonthJiLabel === '화') {
    yongsinChar = '수(水) - 깊고 고요한 깊은 물빛의 지혜';
    yongsinMsg = `현재 ${name}의 무의식 엔진은 매우 뜨겁게 타오르는 화(火) 기운에 감싸여 있습니다. 생각이 격앙되거나 조급함이 솟구칠 때, 전압을 조절해줄 솔루션은 '시원하고 고요한 대양의 깊이(수)'입니다. 즉각적인 외부 반응에 휘둘리지 않고, 3초간 가만히 내면을 가라앉히는 쿨링 명상이 최고의 안정제입니다.`;
  } else if (rawMonthJiLabel === '수') {
    yongsinChar = '화(火) - 어둠을 헤치고 떠오르는 빛의 온기';
    yongsinMsg = `현재 ${name}의 내면은 차갑고 생각의 꼬리가 무겁게 가라앉는 수(수) 기운으로 채워져 있습니다. 이에 필요한 수호 코드는 '밝고 거침없는 불꽃의 온기(화)'입니다. 생각의 감옥에 갇히는 대신, 밝은 태양 아래에서 움직이고 자신의 참된 영혼의 목소리를 담백하게 말로 표출하여 내부 전압을 화사하게 올려주어야 합니다.`;
  } else if (rawMonthJiLabel === '목') {
    yongsinChar = '금(金) - 노이즈를 베어내는 단호한 명검';
    yongsinMsg = `사방으로 무한히 번져나가는 생각과 호기심(목)이 에너지를 흩트려놓고 있습니다. ${name}의 중심을 바로잡는 열쇠는 '불필요한 노이즈를 칼같이 정리하는 무쇠 검의 단호함(금)'입니다. 우선순위가 아닌 소란을 과감히 처단하고, 오직 하나의 핵심 가치에 몰입하는 냉철한 집중이 최고의 치료약입니다.`;
  } else if (rawMonthJiLabel === '금') {
    yongsinChar = '목(木) - 봄 햇살 속에서 춤추는 유연한 풀잎';
    yongsinMsg = `지나치게 엄격한 규율과 차가운 자기검열(금)로 인해 신경망이 잔뜩 긴장해 있는 구조입니다. ${name}에게 진정으로 필요한 힐링 기운은 '하늘을 향해 씩씩하고 유연하게 솟아오르는 풀잎의 유연함(목)'입니다. 잘잘못의 엄격한 잣대를 잠시 내려두고, 아바타의 사소한 실수마저 "괜찮아, 그럴 수 있어" 하고 부드럽게 웃어주는 자기 연민의 통로를 열어주세요.`;
  } else {
    yongsinChar = '화(火) or 수(水) - 유유히 흘러가는 유수(流水)';
    yongsinMsg = `대지가 단단하게 굳어있어 변화를 거부하기 쉽습니다. ${name}의 엔진을 부드럽게 윤활해 줄 기운은 '막힘없이 우회해 흐르는 물빛 소통'입니다. 고집의 경계를 풀고 상대방의 입장과 자연스럽게 하나가 되어 흘러가는 유연한 관계 조율을 실천해 보세요.`;
  }

  // 3. 2026년 병오(丙午)년 세운 합충 분석
  let sewunAnalysis = '';
  const allBranches = [sajuData.year.ji.char, sajuData.month.ji.char, sajuData.day.ji.char, sajuData.time.ji.char];
  const hasZi = allBranches.includes('자');
  const hasChuk = allBranches.includes('축');
  const hasOh = allBranches.includes('오');

  if (rawDayGan === '신') {
    sewunAnalysis += `2026년(병오년) 올해 하늘에 떠오른 찬란한 태양 '병(丙)화'가 ${name}의 보석 같은 '신(辛)금' 일간을 지그시 비추며 아름답게 결합하는 **'병신합(丙辛合)'**의 기운이 활성화되었습니다. 이것은 차가운 골방에 머물던 ${nameJosa} 정교한 예술적 재능과 안목이 세상의 빛을 만나 찬란하게 날개를 달고 공적인 주권으로 승화되는 정답고 따사로운 협력적 우주 패치입니다.\n\n`;
  } else {
    sewunAnalysis += `올해(2026년 병오년)는 뜨겁고 명랑한 태양의 온기가 세상을 적시는 한 해입니다. ${name}의 내면에 감추어져 있던 뜨거운 창작 열망과 표현 욕구가 우주의 계절과 만나 시원하게 발현되도록 든든히 격려해 줍니다.\n\n`;
  }

  if (hasZi) {
    sewunAnalysis += `특히 ${name}의 땅속 깊이 묻혀 있던 밤바다 '자(子)수'와 올해의 활화산 같은 '오(午)화'가 마주치는 **'자오충(자오충 - 子午沖)'**의 에너지 스파크가 발생합니다. 이것은 파괴적 저주가 아니라, 차갑게 고여 있던 생각의 웅덩이를 뜨거운 빛으로 요동쳐 깨우는 '무의식 청소 패치'입니다. 마음에 가벼운 불안이나 출렁임이 일어날 때마다 "내 오래된 습관의 차가운 물길이 우주의 따뜻한 빛을 만나 승화하는 과정이구나" 하고 바라보세요.`;
  } else if (hasChuk) {
    sewunAnalysis += `또한 얼어붙은 겨울 대지 '축(丑)토'와 올해의 오(午)화가 만나 축축한 대지 위에 안개가 자욱하게 서리는 **'축오(축오 - 丑午) 원진/귀문'**의 간섭이 들어옵니다. 감정 센서가 일시적으로 오작동하여 사소한 오해나 서운함을 느끼기 쉬운 때입니다. 이 안개 구간에서는 타인의 말 한마디에 즉각 반응하지 마시고, 조용한 나만의 명상 서재에서 침묵을 가꾸는 핫픽스를 기꺼이 기동해 주세요.`;
  } else if (hasOh) {
    sewunAnalysis += `게다가 사주에 이미 '오(午)화'의 뜨거운 열기를 품고 있는데 올해 또 오화가 들어오며 스스로 가슴을 태우는 **'오오(오오 - 午午) 자형'**의 과열 경보가 울릴 수 있습니다. 조급하게 무언가를 완수해야 한다는 강박이 일어날 때, 그것은 ${nameJosa} 영혼이 아닌 아바타의 과부하 연산 신호일 뿐입니다. 즉시 펜을 내려두고 3초간 가슴을 쓰다듬으며 "애쓰지 않아도 이미 온전해"라고 뇌에 속삭여 주세요.`;
  } else {
    sewunAnalysis += `올해 오(午)화의 다정한 열기는 ${nameJosa} 사주 4기둥 전반을 골고루 어루만지며, 마음속 오랫동안 얼어붙어 있던 감정의 정체를 따뜻하게 녹여내고, 자신감 있게 세상 밖으로 걸어 나가도록 부드럽게 등을 밀어주고 있습니다.`;
  }

  // 4. 신살 (특수 증폭 센서)
  const shinsalList: Array<{ name: string; desc: string; icon: string }> = [];
  if (allBranches.includes('자') || allBranches.includes('오') || allBranches.includes('묘') || allBranches.includes('유')) {
    shinsalList.push({
      name: '도화살 (桃花煞) - 매혹적인 주파수 송신 센서',
      desc: `남들에게 억지로 나를 맞추거나 잘 보이기 위해 애쓰지 않아도, ${name}이 묵묵히 나다움을 발포할 때 그 고유한 빛깔에 매료된 수많은 사람이 자석처럼 이끌려오게 만드는 신비로운 매력 소통 안테나입니다.`,
      icon: '🌸'
    });
  }
  if (allBranches.includes('인') || allBranches.includes('신') || allBranches.includes('사') || allBranches.includes('해')) {
    shinsalList.push({
      name: '역마살 (驛馬煞) - 시공간 장벽 해킹 가속 엔진',
      desc: `지루하게 정체되어 고여 있는 환경을 과감히 거부하며, 더 드넓은 배움과 세계, 새로운 통신망을 찾아 생각과 신체의 경계를 뚫고 번쩍이며 비상하는 강력한 이동성 가속 회로입니다.`,
      icon: '🐎'
    });
  }
  if (allBranches.includes('축') || allBranches.includes('미') || allBranches.includes('진') || allBranches.includes('술')) {
    shinsalList.push({
      name: '화개살 (華蓋煞) - 우주의 철학을 비축하는 영성 서재',
      desc: `소란스럽고 가벼운 현실의 유행 뒤에 감춰진 고결한 본질을 바라보고, 깊이 있는 철학과 예술, 영적인 암호를 깊이 탐구하고 비축하여 마침내 찬란한 깨달음을 짓는 거대한 지혜의 보물창고입니다.`,
      icon: '📚'
    });
  }
  
  const hasYangIn = (rawDayGan === '임' && allBranches.includes('자')) || 
                    (rawDayGan === '병' && allBranches.includes('오')) || 
                    (rawDayGan === '무' && allBranches.includes('오')) || 
                    (rawDayGan === '갑' && allBranches.includes('인')) || 
                    (rawDayGan === '경' && allBranches.includes('신'));
  if (hasYangIn) {
    shinsalList.push({
      name: '양인살 (羊刃煞) - 장벽을 가르는 제왕의 레이저 검',
      desc: `위기의 순간, 어떤 장애물이나 위선도 단번에 동강 내어 무력화해 버리는 극강의 정신적 추진력과 카리스마입니다. 나를 찌르는 칼이 아닌, 세상을 구하는 주권의 무기로 쓰일 때 기적을 빚어냅니다.`,
      icon: '⚔️'
    });
  }

  // 십성 요약 리스트 구축
  const targetPillars = [sajuData.year, sajuData.month, sajuData.day, sajuData.time];
  
  // 십성 추출용 로직
  const relations = targetPillars.map((p, idx) => {
    const pName = idx === 0 ? '년주' : idx === 1 ? '월주' : idx === 2 ? '일주' : '시주';
    
    // 일간의 오행/음양과 비교
    const dmStem = STEM_DATA[rawDayGan] || STEM_DATA['갑'];
    const targetStem = STEM_DATA[p.gan.char] || STEM_DATA['갑'];
    
    let relCode = 'bi';
    const me = dmStem.element;
    const you = targetStem.element;
    const samePolarity = dmStem.polarity === targetStem.polarity;

    if (me === you) relCode = samePolarity ? 'bi' : 'geop';
    else if (ELEMENT_RELATION[me] === you) relCode = samePolarity ? 'sik' : 'sang_gwan';
    else if (ELEMENT_CONTROL[me] === you) relCode = samePolarity ? 'pyun_jae' : 'jae';
    else if (ELEMENT_CONTROL[you] === me) relCode = samePolarity ? 'pyun_gwan' : 'gwan';
    else if (ELEMENT_RELATION[you] === me) relCode = samePolarity ? 'pyun_in' : 'in';

    return {
      pillarName: pName,
      ganChar: p.gan.char,
      ganHanja: p.gan.hanja,
      code: relCode,
      ...sipsungNames[relCode]
    };
  });

  return {
    yongsinChar,
    yongsinMsg,
    sewunAnalysis,
    shinsalList,
    relations
  };
};

export default function MindSpaceTrainingModal({ isOpen, onClose, userProfile }: Props) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'training' | 'profile' | 'advanced' | 'comprehensive' | 'zimidusu' | 'crossover'>('training');
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [trainingMode, setTrainingMode] = useState<'classic' | 'deep'>('classic');
  const [advancedSelectedPillar, setAdvancedSelectedPillar] = useState<'year' | 'month' | 'day' | 'time' | null>(null);
  
  // 날짜 및 시간 입력 상태
  const [userName, setUserName] = useState('회원님');
  const [birthDate, setBirthDate] = useState('1980-07-07');
  const [birthTime, setBirthTime] = useState('13:30');
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  // 커스텀 오전/오후 시간 분할 상태
  const [ampm, setAmpm] = useState<'am' | 'pm'>('pm');
  const [hour12, setHour12] = useState<number>(1);
  const [minuteVal, setMinuteVal] = useState<number>(30);
  
  // 사주 및 동적 데이터 상태
  const [sajuData, setSajuData] = useState<any>(null);
  const [advancedBlueprint, setAdvancedBlueprint] = useState<any>(null);
  const [currentSajuText, setCurrentSajuText] = useState<any>(CHUN_GAN_DATA['신']);
  const [isCompiling, setIsCompiling] = useState(false);
  const [showSuccessCert, setShowSuccessCert] = useState(false);
  
  // 사주 네 기둥 프로파일 상태
  const [selectedPillar, setSelectedPillar] = useState<'day' | 'year' | 'month' | 'time'>('day');
  const [yearProfile, setYearProfile] = useState<any>(null);
  const [monthProfile, setMonthProfile] = useState<any>(null);
  const [dayProfile, setDayProfile] = useState<any>(null);
  const [timeProfile, setTimeProfile] = useState<any>(null);

  // 충/형 디버깅 모달 상태
  const [selectedInteraction, setSelectedInteraction] = useState<any>(null);

  // 지장간 상세 해석 모달 상태
  const [selectedJijanggan, setSelectedJijanggan] = useState<any>(null);

  // 격국 상세 MSC 힐링 모달 상태
  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const [gyeokgukTab, setGyeokgukTab] = useState<'essay' | 'advanced'>('essay');

  // 자미두수 상세 모달 상태
  const [selectedZimidusuPalace, setSelectedZimidusuPalace] = useState<any>(null);

  // 6번 AI 교차 탭 상태 변수 추가
  const [troubleCategory, setTroubleCategory] = useState<'job' | 'love' | 'wealth' | 'general'>('job');
  const [troubleQuestion, setTroubleQuestion] = useState('');
  const [troubleReport, setTroubleReport] = useState<any>(null);
  const [isAnalyzingTrouble, setIsAnalyzingTrouble] = useState(false);
  const [selectedThemeCard, setSelectedThemeCard] = useState<any>(null);
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [followUpAnswer, setFollowUpAnswer] = useState<string | null>(null);
  const [showZimidusuGridModal, setShowZimidusuGridModal] = useState(false);
  const [showSawaDaewoonModal, setShowSawaDaewoonModal] = useState(false);

  // 현재 활성화된 낡은각본/질문 카드 단계
  const [profileCardStep, setProfileCardStep] = useState<'blueprint' | 'script' | 'questions' | 'solution' | 'meta'>('script');

  // 4번째 탭 종합 분석 데이터 계산 (실시간 userName 바인딩)
  const comprehensiveData = sajuData ? getComprehensiveAnalysis(sajuData, userName) : null;
  const gyeokgukAnalysis = sajuData && advancedBlueprint ? getGyeokgukAnalysis(sajuData, advancedBlueprint, userName) : null;

  // 5번째 탭 자미두수 명반 및 AI 교차분석 데이터 계산
  const zimidusuChart = sajuData ? getZimidusuChart(birthDate, birthTime, gender, calendarType) : null;
  const zimidusuCrossover = sajuData && zimidusuChart ? getAiCrossoverReport(sajuData, zimidusuChart, userName) : null;
  const themeCrossoverReport = sajuData && zimidusuChart ? get6ThemeCrossoverReport(sajuData, zimidusuChart, userName) : null;

  const getActiveDetailEssay = () => {
    if (!selectedDetail || !sajuData) return null;
    const dayMasterParam = sajuData.day.gan.char;
    
    switch (selectedDetail.type) {
      case 'sipsung':
        return getSipsungMSCEssay(selectedDetail.id, userName, dayMasterParam);
      case 'gyeokguk':
        let gyeokgukId = 'etc';
        const idLower = selectedDetail.id.toLowerCase();
        if (idLower.includes('편인')) gyeokgukId = 'pyunin';
        else if (idLower.includes('식신')) gyeokgukId = 'sikshin';
        else if (idLower.includes('상관')) gyeokgukId = 'sangwan';
        else if (idLower.includes('편재')) gyeokgukId = 'pyunjae';
        else if (idLower.includes('정재')) gyeokgukId = 'jeongjae';
        else if (idLower.includes('편관')) gyeokgukId = 'pyungwan';
        else if (idLower.includes('정관')) gyeokgukId = 'jeonggwan';
        else if (idLower.includes('정인')) gyeokgukId = 'jeongin';
        return getGyeokgukMSCEssay(gyeokgukId, userName, dayMasterParam);
      case 'yongsin':
        return getYongsinMSCEssay(selectedDetail.id, userName, dayMasterParam);
      case 'sewun':
        return getSewunMSCEssay(userName, dayMasterParam, sajuData);
      case 'shinsal':
        let shinKey = 'etc';
        const nameStr = selectedDetail.id;
        if (nameStr.includes('도화')) shinKey = 'dohwa';
        else if (nameStr.includes('역마')) shinKey = 'yeokma';
        else if (nameStr.includes('화개')) shinKey = 'hwagae';
        else if (nameStr.includes('양인')) shinKey = 'yangin';
        return getShinsalMSCEssay(shinKey, userName, dayMasterParam);
      default:
        return null;
    }
  };
  
  const activeDetailEssay = getActiveDetailEssay();
  
  const dayMasterParam = sajuData ? sajuData.day.gan.char : '신';

  const jijangganEssay = selectedJijanggan 
    ? getJijangganExplanation(selectedJijanggan.jiChar, selectedJijanggan.ganChar, selectedJijanggan.type, userName, dayMasterParam)
    : null;

  const contentBodyRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 최초 오픈 시 사용자 프로필이 있으면 데이터 연동
  useEffect(() => {
    if (isOpen && userProfile) {
      if (userProfile.userName) setUserName(userProfile.userName);
      if (userProfile.birthDate) setBirthDate(userProfile.birthDate);
      if (userProfile.birthTime) setBirthTime(userProfile.birthTime);
      if (userProfile.gender) setGender(userProfile.gender);
      if (userProfile.calendarType) setCalendarType(userProfile.calendarType);
    }
  }, [isOpen, userProfile]);

  // birthTime 문자열이 들어올 때 커스텀 오전/오후/시/분 상태 파싱 동기화
  useEffect(() => {
    if (birthTime) {
      const [h, m] = birthTime.split(':').map(Number);
      if (h >= 12) {
        setAmpm('pm');
        setHour12(h === 12 ? 12 : h - 12);
      } else {
        setAmpm('am');
        setHour12(h === 0 ? 12 : h);
      }
      setMinuteVal(m || 0);
    }
  }, [birthTime]);

  // 커스텀 ampm / hour12 / minuteVal 이 변경될 때 24시간제 birthTime 문자열 갱신
  useEffect(() => {
    let h24 = hour12;
    if (ampm === 'pm') {
      h24 = hour12 === 12 ? 12 : hour12 + 12;
    } else {
      h24 = hour12 === 12 ? 0 : hour12;
    }
    const formattedTime = `${String(h24).padStart(2, '0')}:${String(minuteVal).padStart(2, '0')}`;
    if (formattedTime !== birthTime) {
      setBirthTime(formattedTime);
    }
  }, [ampm, hour12, minuteVal]);

  // 생년월일/시간/음력양력이 변경될 때 사주 계산 연동
  useEffect(() => {
    if (mounted) {
      handleCalculateSaju();
    }
  }, [birthDate, birthTime, calendarType, gender, mounted]);

  const handleCalculateSaju = () => {
    setIsCompiling(true);
    try {
      // 1. 사주 팔자(Four Pillars) 기본 계산
      const result = calculateSaju(birthDate, birthTime, calendarType, gender);
      setSajuData(result);
      
      const rawDayGan = result.day.gan.char; 
      const rawDayJi = result.day.ji.char;   
      
      // 2. 격국 / 충 / 형 등 고급 사주 아키텍처 계산
      const advResult = analyzeAdvancedBlueprint(rawDayGan, result.month.ji.char, rawDayJi);
      setAdvancedBlueprint(advResult);

      // 3. 1단계 다크코드 매핑 텍스트 갱신
      const targetText = CHUN_GAN_DATA[rawDayGan] || CHUN_GAN_DATA['신'];
      const customWaterShape = `${result.month.ji.hanja}月 ${result.day.gan.hanja}${result.day.gan.label === '목' ? '木' : result.day.gan.label === '화' ? '火' : result.day.gan.label === '토' ? '土' : result.day.gan.label === '금' ? '金' : '水'}`;
      
      const updatedText = {
        ...targetText,
        waterShape: `‘${result.month.ji.char}월의 ${result.day.gan.char}${result.day.gan.label === '목' ? '나무' : result.day.gan.label === '화' ? '태양' : result.day.gan.label === '토' ? '대지' : result.day.gan.label === '금' ? '보석' : '샘물'}(${customWaterShape})’`
      };
      setCurrentSajuText(updatedText);

      // 4. 네 기둥 60갑자 프로파일 계산
      setYearProfile(generateSixtyJiaProfile(result.year.gan.char, result.year.ji.char, 'year'));
      setMonthProfile(generateSixtyJiaProfile(result.month.gan.char, result.month.ji.char, 'month'));
      setDayProfile(generateSixtyJiaProfile(result.day.gan.char, result.day.ji.char, 'day'));
      setTimeProfile(generateSixtyJiaProfile(result.time.gan.char, result.time.ji.char, 'time'));
      
      setTimeout(() => {
        setIsCompiling(false);
      }, 400);
    } catch (e) {
      console.error(e);
      setIsCompiling(false);
    }
  };

  const getActiveProfile = () => {
    switch (selectedPillar) {
      case 'year': return yearProfile;
      case 'month': return monthProfile;
      case 'day': return dayProfile;
      case 'time': return timeProfile;
    }
  };

  const activeProfile = getActiveProfile();

  // 아바타 나이 계산 헬퍼 (대운 매칭용)
  const getAvatarAge = () => {
    if (!birthDate) return 40;
    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };
  const avatarAge = getAvatarAge();

  if (!isOpen || !mounted) return null;

  // 12지 지장간 객체를 분리해서 클릭 가능한 요소로 파싱하는 헬퍼
  const getParsedJijangganList = (jiChar: string) => {
    const data = JIJANGGAN_MAP[jiChar];
    if (!data) return [];
    
    const list = [];
    if (data.initial) list.push({ char: data.initial, type: '초' as const });
    if (data.middle) list.push({ char: data.middle, type: '중' as const });
    if (data.main) list.push({ char: data.main, type: '본' as const });
    return list;
  };

  // 단계별 테마 컬러 및 배경 HSL 가치 매핑 (훈련용)
  const getThemeStyles = () => {
    if (activeTab !== 'training') {
      return {
        bg: 'radial-gradient(circle at 50% 30%, #0c0e1a 0%, #05060d 100%)',
        borderColor: 'border-slate-800',
        glowColor: 'shadow-[0_0_30px_rgba(30,41,59,0.25)]',
        badgeBg: 'bg-slate-800 border-slate-700 text-slate-300',
        badgeText: 'System Diagnostic Mode',
        progressColor: 'bg-slate-600',
        nextBtn: 'from-slate-700 to-slate-800 hover:shadow-slate-500/10'
      };
    }
    switch (step) {
      case 1:
        return {
          bg: 'radial-gradient(circle at 50% 30%, #1c0e18 0%, #0c0712 100%)',
          borderColor: 'border-pink-500/30',
          glowColor: 'shadow-[0_0_40px_rgba(236,72,153,0.15)]',
          badgeBg: 'bg-pink-500/10 border-pink-500/30 text-pink-400',
          badgeText: 'Dark Code Scan',
          progressColor: 'bg-pink-500',
          nextBtn: 'from-pink-600 to-rose-500 hover:shadow-pink-500/20'
        };
      case 2:
        return {
          bg: 'radial-gradient(circle at 50% 30%, #06192e 0%, #030a17 100%)',
          borderColor: 'border-cyan-500/30',
          glowColor: 'shadow-[0_0_40px_rgba(6,182,212,0.15)]',
          badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
          badgeText: 'Neural Code Detachment',
          progressColor: 'bg-cyan-500',
          nextBtn: 'from-cyan-600 to-blue-500 hover:shadow-cyan-500/20'
        };
      case 3:
        return {
          bg: 'radial-gradient(circle at 50% 30%, #29122c 0%, #0e0514 100%)',
          borderColor: 'border-purple-500/30',
          glowColor: 'shadow-[0_0_40px_rgba(168,85,247,0.15)]',
          badgeBg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
          badgeText: 'Meta Code Integration',
          progressColor: 'bg-purple-500',
          nextBtn: 'from-purple-600 to-indigo-500 hover:shadow-purple-500/20'
        };
      case 4:
        return {
          bg: 'radial-gradient(circle at 50% 30%, #fffdf5 0%, #f7f9fc 70%, #edf2f7 100%)',
          borderColor: 'border-amber-500/30',
          glowColor: 'shadow-[0_0_50px_rgba(245,158,11,0.2)]',
          badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-600',
          badgeText: 'Ultimate Sovereign Shift',
          progressColor: 'bg-amber-500',
          nextBtn: 'from-amber-600 to-yellow-500 hover:shadow-amber-500/20'
        };
    }
  };

  const currentTheme = getThemeStyles();
  const textDark = activeTab === 'training' && step === 4;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-lg overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        style={{ background: currentTheme.bg }}
        className={`relative w-full max-w-4xl border ${currentTheme.borderColor} rounded-3xl overflow-hidden ${currentTheme.glowColor} flex flex-col my-3 h-[92dvh] sm:h-auto max-h-[92dvh] sm:max-h-[88vh] transition-all duration-1000`}
      >
        {/* Glow ambient backdrops */}
        {textDark ? (
          <div className="absolute top-[-10%] left-[-15%] w-[50%] h-[50%] bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none" />
        ) : (
          <div className="absolute top-[-10%] left-[-15%] w-[50%] h-[50%] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />
        )}

        {/* Header Section */}
        <div className="p-4 md:p-6 border-b border-white/5 flex justify-between items-center relative z-10 bg-slate-950/20 backdrop-blur-sm shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-0.5 md:mb-1 text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              명심 메타 아레나 (Myeongsim Meta Arena)
            </div>
            <h2 className={`text-base md:text-xl font-black ${textDark ? 'text-slate-900' : 'text-white'} tracking-tight`}>
              마음 공간 넓히기 훈련실
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${textDark ? 'bg-slate-200 hover:bg-slate-300 text-slate-600' : 'bg-white/5 hover:bg-white/10 text-slate-400'} hover:text-white transition-colors`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 5단 탭 내비게이션 바 (가로 스크롤 최적화) */}
        <div className={`px-4 md:px-6 py-2.5 border-b ${textDark ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/60 border-white/5'} flex flex-nowrap shrink-0 overflow-x-auto scrollbar-none gap-1.5 md:gap-2 relative z-10 w-full`}>
          {[
            { id: 'training', label: '1. 3단계 훈련실', icon: Compass },
            { id: 'profile', label: '2. 4기둥 메타코드 프로파일', icon: Layers },
            { id: 'advanced', label: '3. 4기둥 멘탈 OS 디버거', icon: Database },
            { id: 'comprehensive', label: '4. 4기둥 종합 멘탈 OS 분석', icon: Sparkles },
            { id: 'zimidusu', label: '5. 자미두수 명반 해독', icon: Zap },
            { id: 'crossover', label: '6. AI 종합 교차 해독실', icon: Sparkles }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSelectedDetail(null);
                  setSelectedJijanggan(null);
                  setSelectedInteraction(null);
                  setSelectedZimidusuPalace(null);
                }}
                className={`px-3 py-2 rounded-xl text-[10px] md:text-xs font-black flex items-center justify-center gap-1.5 whitespace-nowrap transition-all shrink-0 ${
                  isActive 
                    ? textDark 
                      ? 'bg-amber-600 text-white shadow-md' 
                      : 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-md shadow-purple-500/20'
                    : textDark 
                      ? 'text-slate-500 hover:bg-slate-200' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Birth Date & Sync Bar */}
        <div className={`p-3 md:p-4 ${textDark ? 'bg-slate-100 border-b border-slate-200' : 'bg-slate-950/40 border-b border-white/5'} px-4 md:px-6 flex flex-col md:flex-row gap-3 items-center justify-between relative z-10 shrink-0`}>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* 이름 입력 필드 */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`text-[11px] font-bold ${textDark ? 'text-slate-600' : 'text-slate-400'}`}>이름:</span>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="이름"
                className={`text-xs px-2.5 py-1.5 rounded-lg w-20 md:w-24 focus:outline-none transition-all font-bold ${
                  textDark 
                    ? 'bg-white border border-slate-300 text-slate-800 focus:border-amber-500' 
                    : 'bg-slate-900 border border-white/10 text-white focus:border-purple-500'
                }`}
              />
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Calendar className={`w-3.5 h-3.5 ${textDark ? 'text-slate-600' : 'text-purple-400'}`} />
              <span className={`text-[11px] font-bold ${textDark ? 'text-slate-600' : 'text-slate-400'}`}>생년월일 연동:</span>
              
              {/* 음력/양력 토글 단추 */}
              <div className={`flex border rounded-lg overflow-hidden p-0.5 max-w-[110px] ${textDark ? 'border-slate-300' : 'border-white/10'}`}>
                <button
                  onClick={() => setCalendarType('solar')}
                  className={`text-[9px] px-2 py-0.5 font-bold rounded transition-all ${
                    calendarType === 'solar'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  양력
                </button>
                <button
                  onClick={() => setCalendarType('lunar')}
                  className={`text-[9px] px-2 py-0.5 font-bold rounded transition-all ${
                    calendarType === 'lunar'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  음력
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto mt-2 md:mt-0 justify-start md:justify-end">
            {/* 날짜 입력 */}
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className={`text-xs px-2 py-1.5 rounded-lg font-mono focus:outline-none transition-all flex-1 md:flex-initial ${
                textDark 
                  ? 'bg-white border border-slate-300 text-slate-800 focus:border-amber-500' 
                  : 'bg-slate-900 border border-white/10 text-white focus:border-purple-500'
              }`}
            />
            
            {/* 오전/오후 토글 버튼 */}
            <div className={`flex border rounded-lg overflow-hidden p-0.5 shrink-0 ${textDark ? 'border-slate-300' : 'border-white/10'}`}>
              <button
                onClick={() => setAmpm('am')}
                className={`text-[9px] px-2 py-0.5 font-bold rounded transition-all ${
                  ampm === 'am'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                오전
              </button>
              <button
                onClick={() => setAmpm('pm')}
                className={`text-[9px] px-2 py-0.5 font-bold rounded transition-all ${
                  ampm === 'pm'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                오후
              </button>
            </div>

            {/* 시(Hour) 선택 */}
            <select
              value={hour12}
              onChange={(e) => setHour12(Number(e.target.value))}
              className={`text-xs px-1.5 py-1.5 rounded-lg font-mono focus:outline-none transition-all cursor-pointer ${
                textDark 
                  ? 'bg-white border border-slate-300 text-slate-800 focus:border-amber-500' 
                  : 'bg-slate-900 border border-white/10 text-white focus:border-purple-500'
              }`}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={h} className="text-slate-950">
                  {h}시
                </option>
              ))}
            </select>

            {/* 분(Minute) 선택 */}
            <select
              value={minuteVal}
              onChange={(e) => setMinuteVal(Number(e.target.value))}
              className={`text-xs px-1.5 py-1.5 rounded-lg font-mono focus:outline-none transition-all cursor-pointer ${
                textDark 
                  ? 'bg-white border border-slate-300 text-slate-800 focus:border-amber-500' 
                  : 'bg-slate-900 border border-white/10 text-white focus:border-purple-500'
              }`}
            >
              {Array.from({ length: 12 }, (_, i) => i * 5).map((m) => (
                <option key={m} value={m} className="text-slate-950">
                  {String(m).padStart(2, '0')}분
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Saju Board with Interactive Jijanggans */}
        {sajuData && (
          <div className={`px-4 md:px-6 py-3 border-b ${textDark ? 'bg-amber-50/50 border-slate-200' : 'bg-purple-950/10 border-white/5'} flex flex-col gap-3 relative z-10`}>
            <div className="flex gap-2.5 overflow-x-auto scrollbar-none items-center w-full">
              <span className={`text-[9px] md:text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md ${textDark ? 'bg-slate-200 text-slate-700' : 'bg-white/5 text-slate-400'} shrink-0`}>
                SAJU OS
              </span>
              <div className="flex gap-1.5 md:gap-3 flex-1 justify-between min-w-[340px]">
                {[
                  { label: '시주', p: sajuData.time, key: 'time' },
                  { label: '일주', p: sajuData.day, key: 'day', isMaster: true },
                  { label: '월주', p: sajuData.month, key: 'month' },
                  { label: '년주', p: sajuData.year, key: 'year' }
                ].map((item, i) => {
                  const ganTheme = getOhaengTheme(item.p.gan.label);
                  const jiTheme = getOhaengTheme(item.p.ji.label);
                  const isSelected = item.key === selectedPillar && activeTab === 'profile';
                  
                  return (
                    <div 
                      key={i} 
                      className={`flex flex-col items-center p-2 rounded-xl border transition-all flex-1 text-center ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_12px_rgba(168,85,247,0.3)] scale-[1.02]'
                          : item.isMaster 
                            ? 'border-amber-500/40 bg-amber-500/5' 
                            : textDark ? 'border-slate-300 bg-white' : 'border-white/10 bg-slate-900/60'
                      }`}
                    >
                      <span className={`text-[8px] md:text-[9px] font-bold ${textDark ? 'text-slate-500' : 'text-slate-400'} mb-1`}>{item.label}</span>
                      
                      {/* 천간/지지 오행별 컬러 카드 (개별 버튼화) */}
                      <div className="flex flex-col gap-1 w-full max-w-[75px] relative z-20">
                        {/* 천간 버튼 */}
                        <button
                          onClick={() => {
                            setSelectedPillar(item.key as any);
                            setActiveTab('profile');
                            setSelectedDetail(null);
                            setSelectedInteraction(null);
                            setSelectedJijanggan({
                              jiChar: '',
                              ganChar: item.p.gan.char,
                              type: '천간' as any
                            });
                          }}
                          className={`flex items-center justify-center gap-0.5 py-1 rounded-md border cursor-pointer w-full transition-all hover:scale-105 active:scale-95 ${ganTheme.border} ${ganTheme.bg} focus:outline-none`}
                        >
                          <span className={`text-[10px] md:text-xs font-black ${ganTheme.text}`}>{item.p.gan.char}</span>
                          <span className="text-[8px] md:text-[9px] text-slate-400 font-serif">({item.p.gan.hanja})</span>
                        </button>
                        
                        {/* 지지 버튼 */}
                        <button
                          onClick={() => {
                            setSelectedPillar(item.key as any);
                            setActiveTab('profile');
                            setSelectedDetail(null);
                            setSelectedInteraction(null);
                            setSelectedJijanggan({
                              jiChar: item.p.ji.char,
                              ganChar: '',
                              type: '지지' as any
                            });
                          }}
                          className={`flex items-center justify-center gap-0.5 py-1 rounded-md border cursor-pointer w-full transition-all hover:scale-105 active:scale-95 ${jiTheme.border} ${jiTheme.bg} focus:outline-none`}
                        >
                          <span className={`text-[10px] md:text-xs font-black ${jiTheme.text}`}>{item.p.ji.char}</span>
                          <span className="text-[8px] md:text-[9px] text-slate-400 font-serif">({item.p.ji.hanja})</span>
                        </button>
                      </div>
                      
                      {/* 지장간 (Hidden Stems) 칩셋 버튼화 */}
                      <div className="w-full border-t border-white/5 pt-1.5 mt-1.5">
                        <span className={`text-[7px] md:text-[8px] font-bold block ${textDark ? 'text-slate-400' : 'text-slate-550'} mb-1`}>지장간 (해독클릭)</span>
                        <div className="flex gap-0.5 justify-center flex-wrap">
                          {getParsedJijangganList(item.p.ji.char).map((jijang, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setSelectedJijanggan({
                                  jiChar: item.p.ji.char,
                                  ganChar: jijang.char,
                                  type: jijang.type
                                });
                              }}
                              className={`text-[8px] md:text-[9px] font-bold px-1 py-0.5 rounded transition-all cursor-pointer border ${
                                textDark 
                                  ? 'bg-slate-100 hover:bg-amber-100 border-slate-200 text-slate-700' 
                                  : 'bg-slate-950/40 hover:bg-purple-950/60 border-white/5 text-slate-350 hover:text-purple-300'
                              }`}
                            >
                              {jijang.char}({jijang.type})
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {isCompiling && (
                <span className="text-[9px] text-amber-500 font-bold flex items-center gap-1 animate-pulse shrink-0">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                </span>
              )}
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 relative z-10 scrollbar-thin">
          <AnimatePresence mode="wait">
            
            {/* 1. 3단계 훈련실 탭 */}
            {activeTab === 'training' && (
              <motion.div
                key="training-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* 훈련 모드 설정 및 기둥 스위치 제어 바 */}
                <div className="p-3 bg-slate-900/80 border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                    <span className="text-[10px] font-black text-purple-400 tracking-wider">
                      훈련 모드 설정:
                    </span>
                    <div className="flex border border-white/10 rounded-lg overflow-hidden p-0.5">
                      <button
                        onClick={() => setTrainingMode('classic')}
                        className={`text-[9px] px-2.5 py-0.5 font-bold rounded transition-all ${
                          trainingMode === 'classic'
                            ? 'bg-purple-600 text-white font-black shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        오리지널 클래식 🌌
                      </button>
                      <button
                        onClick={() => setTrainingMode('deep')}
                        className={`text-[9px] px-2.5 py-0.5 font-bold rounded transition-all ${
                          trainingMode === 'deep'
                            ? 'bg-purple-600 text-white font-black shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        4기둥 딥 코칭 🪐
                      </button>
                    </div>
                  </div>

                  {/* 딥 코칭 모드일 때만 기둥 스위치가 노출되도록 제어하여 클래식 모드의 심플함을 극대화 */}
                  {trainingMode === 'deep' && (
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-slate-400">타겟 기둥:</span>
                      <div className="flex gap-1">
                        {[
                          { key: 'year', label: '년주' },
                          { key: 'month', label: '월주' },
                          { key: 'day', label: '일주' },
                          { key: 'time', label: '시주' }
                        ].map((btn) => (
                          <button
                            key={btn.key}
                            onClick={() => setSelectedPillar(btn.key as any)}
                            className={`px-2.5 py-1 rounded-lg text-[9px] font-black transition-all ${
                              selectedPillar === btn.key
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-slate-950/40 text-slate-400 hover:text-white'
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Step Badge */}
                <div className="flex justify-between items-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${currentTheme.badgeBg}`}>
                    {currentTheme.badgeText}
                  </span>
                  <span className={`text-[10px] ${textDark ? 'text-slate-500' : 'text-slate-400'} font-mono`}>
                    Step {step} of 4
                  </span>
                </div>

                {/* Step 1: 다크코드 스캔 (클래식 vs 딥코칭 분기) */}
                {step === 1 && (
                  <div className="space-y-4">
                    {trainingMode === 'classic' ? (
                      /* 클래식 모드: 오리지널 일간 기반 자연물상 및 다크코드 루프 */
                      <div className="space-y-4">
                        <div className="p-4 bg-pink-500/5 border border-pink-500/10 rounded-2xl">
                          <h3 className="text-xs font-bold text-pink-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                            <Compass className="w-4 h-4 animate-spin-slow" />
                            오리지널 자연물상 시각화 진단 (Default Climate)
                          </h3>
                          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                            당신의 타고난 사주적 흐름과 디폴트 하드웨어 환경은 현재 <strong className="text-white text-sm md:text-base font-extrabold">{currentSajuText.waterShape}</strong>의 형상을 띠고 있습니다.
                          </p>
                        </div>

                        <div className="p-4 bg-slate-950/60 border border-white/5 rounded-2xl space-y-3">
                          <div>
                            <h4 className="text-[10px] font-bold text-pink-400 mb-1 uppercase tracking-wider">무의식 다크코드 왜곡 루프 (Legacy Error Loop)</h4>
                            <p className="text-xs text-slate-300 leading-relaxed">"{currentSajuText.darkLoop}"</p>
                          </div>
                          <div className="border-t border-white/5 pt-3">
                            <h4 className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">아바타 시스템 부하 상태 (CPU Load Status)</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">{currentSajuText.systemOverload}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* 딥 코칭 모드: 선택 기둥 60갑자 기반 상세 낡은각본 */
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-red-500/10 to-slate-900 border border-red-500/20 rounded-2xl">
                          <h3 className="text-xs font-bold text-red-400 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            {activeProfile.title}
                          </h3>
                          <p className="text-[11px] text-slate-400 italic">"{activeProfile.brief}"</p>
                        </div>

                        <div className="p-4 bg-slate-950/60 border border-red-500/20 rounded-2xl space-y-2">
                          <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-wider">선택된 기둥 60갑자 낡은 각본 (The Old Script)</h4>
                          <p className="text-red-200 font-serif italic text-center p-2.5 bg-red-500/5 rounded-xl border border-red-500/10 text-xs select-none">
                            {activeProfile.oldScript}
                          </p>
                          <p className="text-xs text-slate-300 leading-relaxed pt-1">
                            <strong>상세 시나리오:</strong> {activeProfile.scriptDetail}
                          </p>
                        </div>

                        <div className="p-4 bg-slate-950/60 border border-white/5 rounded-2xl">
                          <h4 className="text-[10px] font-bold text-red-400 mb-1 uppercase tracking-wider">신규 취약점 오류현황 (Hardware Crash)</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">{activeProfile.errorStatus}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: 뉴럴코드 타자화 (클래식 vs 딥코칭 분기) */}
                {step === 2 && (
                  <div className="space-y-4">
                    {trainingMode === 'classic' ? (
                      /* 클래식 모드: 300ms 준비전위 + 오리지널 뉴럴 커맨드 */
                      <div className="space-y-4">
                        <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl">
                          <h3 className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                            <Compass className="w-4 h-4" />
                            물리적 실체 스캔 (300ms Telemetry)
                          </h3>
                          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                            지금 가슴이 답답하고 심박수가 상승하며 손끝이 차가워지는 물리적 신호는 당신이 스스로 만들어 낸 것이 아닙니다. 
                            뇌과학 실험이 증명하듯, 당신이 "불안이나 답답함"을 인지하기 <strong className="text-cyan-300 text-sm md:text-base font-extrabold">0.3초(300ms) 전</strong>에 뇌의 하부 운동 피질(준비전위)이 자동으로 출력해 낸 아바타 기계장치의 디폴트 출력물(Output)일 뿐입니다.
                          </p>
                        </div>

                        <div className="p-4 bg-slate-950/60 border border-cyan-500/20 rounded-2xl">
                          <h4 className="text-[10px] font-bold text-cyan-400 mb-1.5 uppercase tracking-wider">아바타가 자동으로 뿜어낸 에러 팝업 (Neural Command)</h4>
                          <p className="text-xs text-slate-300 leading-relaxed font-serif bg-slate-900/40 p-3 rounded-xl border border-white/5">
                            {currentSajuText.neuralCommand}
                          </p>
                        </div>

                        <div className="p-4 bg-cyan-950/40 border border-cyan-500/20 rounded-2xl">
                          <h3 className="text-xs font-bold text-cyan-300 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                            <Zap className="w-4 h-4 animate-bounce" />
                            자동 반응 스탑 연습 (Free Won't)
                          </h3>
                          <p className="text-xs text-slate-300 leading-relaxed font-serif">
                            가슴이 조여올 때마다 머릿속으로 조용히 외치십시오: <br />
                            <strong className="text-white font-sans text-xs">“아바타가 또 자동으로 오류 시나리오 화면을 켰네. 나는 이 화면을 가만히 쳐다보는 주체(관찰자)다. 3초만 가만히 지켜보자.”</strong>
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* 딥 코칭 모드: 60갑자 3대 자각 질문 */
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-slate-900 border border-cyan-500/20 rounded-2xl">
                          <h3 className="text-xs font-bold text-cyan-300 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                            <Milestone className="w-4 h-4 text-cyan-400" />
                            자각 활성화 3대 질문 (Sovereign Inquisition)
                          </h3>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            당신의 아바타 신경망에 침투한 60갑자 디폴트 오류를 끊어내기 위해, 다음 3가지 메타인지 질문에 가만히 내면으로 대답해 보십시오.
                          </p>
                        </div>

                        <div className="p-4 bg-slate-950/60 border border-cyan-500/20 rounded-2xl space-y-3">
                          <div className="p-3 bg-slate-900/60 border border-white/5 rounded-xl">
                            <span className="text-[9px] font-black text-cyan-400 block mb-0.5">1. 소파술 질문 🧩</span>
                            <p className="text-xs text-slate-300 leading-relaxed font-serif">{activeProfile.surgicalQuestion}</p>
                          </div>
                          <div className="p-3 bg-slate-900/60 border border-white/5 rounded-xl">
                            <span className="text-[9px] font-black text-cyan-400 block mb-0.5">2. 재귀적 질문 🔄</span>
                            <p className="text-xs text-slate-300 leading-relaxed font-serif">{activeProfile.recursiveQuestion}</p>
                          </div>
                          <div className="p-3 bg-slate-900/60 border border-white/5 rounded-xl">
                            <span className="text-[9px] font-black text-cyan-400 block mb-0.5">3. 알아차림의 알아차림 질문 👁️</span>
                            <p className="text-xs text-slate-300 leading-relaxed font-serif">{activeProfile.metaAwarenessQuestion}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: 메타코드 통합 (클래식 vs 딥코칭 분기) */}
                {step === 3 && (
                  <div className="space-y-4">
                    {trainingMode === 'classic' ? (
                      /* 클래식 모드: 오리지널 가치 지령 가이드 */
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/5 border border-purple-500/20 rounded-2xl">
                          <h3 className="text-xs font-bold text-purple-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                            <Compass className="w-4 h-4" />
                            메타 아키텍처로의 이동 (不二 - Non-Duality)
                          </h3>
                          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                            이제 에러가 뜬 화면(아바타의 불안)과 그것을 쳐다보는 관찰자(나)가 하나로 통합됩니다.
                            화면은 파도처럼 끊임없이 요동치지만, 바다 깊은 곳은 언제나 고요합니다. 파도와 바다는 둘이 아닙니다(不二).
                            화면이 요동치든 말든 가만히 지켜보면, 마침내 무오염의 청정한 의식 상태가 복구됩니다.
                          </p>
                        </div>
                        <div className="p-4 bg-slate-950/60 border border-purple-500/20 rounded-2xl">
                          <h4 className="text-[10px] font-bold text-purple-400 mb-1.5 uppercase tracking-wider">무오염 인지/행동 시프트 알림 (Shift Action)</h4>
                          <p className="text-xs text-slate-355 leading-relaxed font-serif bg-slate-900/40 p-3 rounded-xl border border-white/5">
                            {currentSajuText.shiftAction}
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* 딥 코칭 모드: 60갑자 4기둥 분석 및 자각 설계 */
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-purple-500/10 to-slate-900 border border-purple-500/20 rounded-2xl">
                          <h3 className="text-xs font-bold text-purple-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                            <Compass className="w-4 h-4 animate-spin-slow" />
                            4기둥 딥 코칭 설계 (Pillar-Specific Metacode)
                          </h3>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            아바타의 4기둥(년주, 월주, 일주, 시주)별 낡은 각본과 자각 질문, 그리고 4대 뉴럴 솔루션을 진단합니다. 아래 기둥 카드를 클릭하여 각각의 심화 디버깅 정보를 확인하세요.
                          </p>
                        </div>

                        {/* 4기둥 그리드 버튼 */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { label: '시주', p: sajuData.time, key: 'time' },
                            { label: '일주', p: sajuData.day, key: 'day', isMaster: true },
                            { label: '월주', p: sajuData.month, key: 'month' },
                            { label: '년주', p: sajuData.year, key: 'year' }
                          ].map((item) => {
                            const isActive = advancedSelectedPillar === item.key;
                            return (
                              <button
                                key={item.key}
                                onClick={() => setAdvancedSelectedPillar(item.key as any)}
                                className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all ${
                                  isActive
                                    ? 'border-purple-500 bg-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-[1.03]'
                                    : item.isMaster
                                      ? 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10'
                                      : 'border-white/5 bg-slate-900/60 hover:bg-white/5'
                                }`}
                              >
                                <span className="text-[8px] md:text-[9px] font-bold text-slate-400 mb-1">
                                  {item.label}
                                </span>
                                <span className="text-sm md:text-base font-black tracking-tight mb-1" style={{ color: item.p.gan.color }}>
                                  {item.p.gan.char}{item.p.ji.char}
                                </span>
                                <span className="text-[9px] text-slate-500 font-mono">
                                  {item.p.gan.hanja}{item.p.ji.hanja}
                                </span>
                                <div className={`mt-2 px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                                  isActive
                                    ? 'bg-purple-600 text-white shadow'
                                    : 'bg-white/5 text-slate-400'
                                }`}>
                                  {isActive ? '디버깅 활성' : '검사 대기'}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}


                {/* 하부 배치: 정밀 격국 및 대운 & 충/형 하드웨어 아키텍처 */}
                <div className="border-t border-white/5 pt-5 space-y-5">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[9px] font-black tracking-wider uppercase text-slate-400">
                    Hardware Infrastructure Diagnosis
                  </span>

                  {/* 격국 카드 (클릭 시 상세 모달 연동) */}
                  {advancedBlueprint.operationModule && (
                    <button
                      onClick={() => {
                        setSelectedDetail({
                          type: 'gyeokguk',
                          id: advancedBlueprint.operationModule.id
                        });
                      }}
                      className="p-4 md:p-5 bg-gradient-to-r from-blue-950/20 to-purple-950/20 border border-blue-500/20 hover:border-blue-500/50 rounded-2xl relative overflow-hidden shadow-inner text-left cursor-pointer transition-all hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] group focus:outline-none w-full"
                    >
                      <div className="absolute top-[-10%] right-[-10%] w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none transition-colors group-hover:bg-blue-500/10" />
                      <div className="flex items-center justify-between w-full mb-2 border-b border-white/5 pb-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-[9px] font-black text-blue-400 uppercase tracking-widest">Gyeokguk</span>
                          <h4 className="text-xs md:text-sm font-black text-white">사주 격국 연산 모듈 : {advancedBlueprint.operationModule.name}</h4>
                        </div>
                        <span className="text-[8px] font-bold text-blue-400 animate-pulse bg-blue-500/10 px-1.5 py-0.5 rounded">상세 치유 해독클릭</span>
                      </div>
                      <p className="text-[11px] md:text-xs text-slate-300 leading-relaxed pr-4">
                        {advancedBlueprint.operationModule.desc || '회원님의 기질을 제어하고 연산하는 핵심 동작 모듈입니다. 삶의 추진력과 방향성을 제공합니다.'}
                      </p>
                    </button>
                  )}

                  {/* 대운 흐름 타임라인 카드 */}
                  <div className="p-4 md:p-5 bg-slate-900 border border-white/5 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                      <span className="px-2.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-[9px] font-black text-purple-400 uppercase tracking-widest">Daewoon</span>
                      <h4 className="text-xs md:text-sm font-black text-white">천문 대운 주기 궤적 (Decade Luck Timeline)</h4>
                    </div>
                    <p className="text-[11px] md:text-xs text-slate-400 leading-relaxed">
                      인생의 격변점과 전환기를 조율하는 10년 주기 천문 하드웨어 대운 흐름 정보입니다. 각 카드를 <strong>클릭하여 10년의 힐링 지침</strong>을 확인하세요. (현재 만나이: <strong>만 {avatarAge}세</strong>)
                    </p>
                    
                    {/* 대운 카드 동적 생성 */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {sajuData.daewoon && sajuData.daewoon.length > 0 ? (
                        sajuData.daewoon.slice(0, 4).map((dw: any, i: number) => {
                          const isCurrentActive = avatarAge >= dw.age && avatarAge < dw.age + 10;
                          return (
                            <button 
                              key={i} 
                              onClick={() => {
                                setSelectedDetail({
                                  type: 'daewoon',
                                  id: dw.ganzhi
                                });
                              }}
                              className={`p-3 rounded-xl border text-center transition-all cursor-pointer hover:scale-[1.03] hover:border-purple-500/50 hover:shadow-[0_0_12px_rgba(168,85,247,0.15)] focus:outline-none w-full text-left flex flex-col justify-between h-full ${
                                isCurrentActive 
                                  ? 'border-purple-500 bg-purple-500/20 shadow-[0_0_12px_rgba(168,85,247,0.25)] scale-[1.03]' 
                                  : 'border-white/5 bg-slate-950/60 hover:bg-white/5'
                              }`}
                            >
                              <span className="text-[9px] text-slate-500 font-bold block mb-1">만 {dw.age}세 대운</span>
                              <span className={`text-xs font-black block ${isCurrentActive ? 'text-purple-300' : 'text-slate-300'}`}>{dw.ganzhi} 운</span>
                              <span className={`text-[8px] font-bold block mt-1 ${isCurrentActive ? 'text-purple-400' : 'text-slate-600'}`}>
                                {isCurrentActive ? '현재 런타임 활성' : '해독클릭'}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        // Fallback 대운
                        [
                          { year: '10대 대운', name: '초기 부팅기', active: false },
                          { year: '20-30대 대운', name: '정밀 가공기', active: false },
                          { year: '40대 대운 (현재)', name: sajuData?.dayMaster?.includes('금') ? '정해(丁亥) 운' : '현재 런타임', active: true },
                          { year: '50-60대 대운', name: '미래 대도약기', active: false }
                        ].map((dw, i) => (
                          <div 
                            key={i} 
                            className={`p-3 rounded-xl border text-center transition-all ${
                              dw.active 
                                ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_10px_rgba(168,85,247,0.15)]' 
                                : 'border-white/5 bg-slate-950/60'
                            }`}
                          >
                            <span className="text-[9px] text-slate-500 font-bold block mb-1">{dw.year}</span>
                            <span className={`text-xs font-black ${dw.active ? 'text-purple-300' : 'text-slate-300'}`}>{dw.name}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* 충(Clash) & 형(Punishment) 진단 리스트 */}
                  <div className="p-4 md:p-5 bg-slate-900 border border-white/5 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                      <span className="px-2.5 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-[9px] md:text-[10px] font-black text-red-400 uppercase tracking-widest">Security Audit</span>
                      <h4 className="text-xs md:text-sm font-black text-white">System Clash & Vulnerability Audit Log</h4>
                    </div>
                    <p className="text-[11px] md:text-xs text-slate-400 leading-relaxed">
                      사주 명식 내 오행 충돌(충) 및 제약(형) 현상으로 인해 발생하는 인지 왜곡 취약점 목록입니다. <strong>카드를 클릭하여 치유 패치</strong>를 확인하십시오.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {advancedBlueprint.interactions && advancedBlueprint.interactions.length > 0 ? (
                        advancedBlueprint.interactions.map((inter: any, idx: number) => (
                          <div 
                            key={idx}
                            onClick={() => setSelectedInteraction(inter)}
                            className="p-3 md:p-4 bg-slate-950/60 border border-red-500/10 hover:border-red-500/40 rounded-xl cursor-pointer hover:-translate-y-0.5 transition-all shadow-md flex justify-between items-center"
                          >
                            <div className="space-y-1">
                              <span className="text-[8px] md:text-[9px] font-black text-red-400 uppercase tracking-widest block">Vulnerability #{idx+1}</span>
                              <span className="text-[11px] md:text-xs font-black text-white">{inter.name || inter.type}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-red-400/50" />
                          </div>
                        ))
                      ) : (
                        <>
                          <div 
                            onClick={() => setSelectedInteraction({
                              name: '을신충(乙辛沖) 자가 기획 완벽주의 컴파일 에러',
                              desc: '정밀 다이아몬드 신금(辛金) 마스터와 기획의 을목(乙木)이 충돌하는 현상입니다. 기획 자원을 과도하게 가공하려다 스스로 검열해 파기하고 지연시키는 자가 롤백 사이클을 생성합니다. "완벽하지 않은 80점짜리 결과물을 고속 배포"하는 패치노트 적용이 극단적으로 필요합니다.'
                            })}
                            className="p-3 md:p-4 bg-slate-950/60 border border-red-500/10 hover:border-red-500/40 rounded-xl cursor-pointer hover:-translate-y-0.5 transition-all shadow-md flex justify-between items-center"
                          >
                            <div className="space-y-1">
                              <span className="text-[8px] md:text-[9px] font-black text-red-400 uppercase tracking-widest block">Vulnerability #1</span>
                              <span className="text-[11px] md:text-xs font-black text-white">을신충(乙辛沖) 자가 완벽주의 에러</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-red-400/50" />
                          </div>

                          <div 
                            onClick={() => setSelectedInteraction({
                              name: '사신합·형(巳申合·刑) 대인관계 이중 스레드 간섭',
                              desc: '일지 사화(巳火) 정관 제어 스레드와 연지 신금(申金) 겁재 외부 리소스 노드가 겉으로는 상호 신뢰 연결(合)하지만, 내부적으로는 공망 경쟁 자원과 지속적 간섭 및 상호 견제(刑)를 맺는 아키텍처입니다. 대인관계에서 겉보기 협력을 꾀하다 돌연 신뢰 보안 인터럽트가 발생하여 롤백하는 구조입니다.'
                            })}
                            className="p-3 md:p-4 bg-slate-950/60 border border-red-500/10 hover:border-red-500/40 rounded-xl cursor-pointer hover:-translate-y-0.5 transition-all shadow-md flex justify-between items-center"
                          >
                            <div className="space-y-1">
                              <span className="text-[8px] md:text-[9px] font-black text-red-400 uppercase tracking-widest block">Vulnerability #2</span>
                              <span className="text-[11px] md:text-xs font-black text-white">사신합·형(巳申合·刑) 이중 스레드 간섭</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-red-400/50" />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. 4기둥 종합 멘탈 OS 분석 탭 */}
            {activeTab === 'comprehensive' && comprehensiveData && sajuData && (
              <motion.div
                key="comprehensive-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-white pb-6"
              >
                {/* 탭 헤더 */}
                <div className="p-4 bg-gradient-to-r from-purple-950/25 via-indigo-950/30 to-slate-900 border border-purple-500/35 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="p-1 rounded bg-purple-500/10 border border-purple-500/30">
                      <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                    </div>
                    <h3 className="text-xs md:text-sm font-black text-purple-300 uppercase tracking-widest">
                      Comprehensive Mental OS Blueprint
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    {userProfile?.userName || '회원님'}의 영혼이 지구에 로그인할 때 설계된 네 기둥의 통합 명리 지도입니다. 
                    딱딱한 고전 해석 대신, 인생의 주권을 되찾도록 돕는 <strong>최고의 멘탈리스트적 심리 해설</strong>로 당신의 본질을 펼쳐 드립니다.
                  </p>
                </div>

                {/* 섹션 1: 십성 분석 (10대 무의식 페르소나) */}
                <div className="p-5 bg-slate-950/50 border border-white/5 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-[9px] font-black text-purple-400">THREAD 1</span>
                    <h4 className="text-xs md:text-sm font-black text-white">10대 무의식 페르소나 (십성 분석)</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    사주 원국의 네 기둥에 분포된 천간들의 상호작용이 빚어내는 무의식적 가면(페르소나) 목록입니다. 내 안의 어떤 강력한 내적 에너지가 삶을 돕고 있는지 확인하세요.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {comprehensiveData.relations.map((rel, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedDetail({
                            type: 'sipsung',
                            id: rel.code
                          });
                        }}
                        className="p-4 bg-slate-900/60 border border-white/5 hover:border-purple-500/35 rounded-2xl space-y-2 relative overflow-hidden text-left cursor-pointer transition-all hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] group focus:outline-none w-full"
                      >
                        <div className="absolute top-0 right-0 w-12 h-12 bg-white/2 rounded-full blur-xl group-hover:bg-purple-500/5 transition-colors" />
                        <div className="flex justify-between items-center w-full">
                          <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] text-slate-400 font-mono uppercase tracking-wider">{rel.pillarName} ({rel.ganChar})</span>
                          <span className="text-[8px] font-bold text-purple-400 animate-pulse bg-purple-500/10 px-1.5 py-0.5 rounded">상세 치유 해독클릭</span>
                        </div>
                        <h5 className="text-xs md:text-sm font-black text-white">{rel.title}</h5>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{rel.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 섹션 2: 격국 & 용신 (인생 메인 아키텍처) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 격국 카드 */}
                  {advancedBlueprint?.operationModule && (
                    <button
                      onClick={() => {
                        setSelectedDetail({
                          type: 'gyeokguk',
                          id: advancedBlueprint.operationModule.id
                        });
                      }}
                      className="p-5 bg-slate-950/50 border border-blue-500/20 hover:border-blue-500/50 rounded-3xl space-y-3 relative overflow-hidden flex flex-col justify-between text-left cursor-pointer transition-all hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] group focus:outline-none w-full"
                    >
                      <div className="absolute top-[-10%] right-[-10%] w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none transition-colors group-hover:bg-blue-500/10" />
                      <div className="space-y-3 w-full">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-[9px] font-black text-blue-400">ARCHITECTURE</span>
                            <h4 className="text-xs md:text-sm font-black text-white">인생 메인 퀘스트 시나리오 (격국)</h4>
                          </div>
                          <span className="text-[8px] font-bold text-blue-400 animate-pulse bg-blue-500/10 px-1.5 py-0.5 rounded">상세 치유 해독클릭</span>
                        </div>
                        <strong className="text-sm font-black text-white block font-mono">
                          {advancedBlueprint.operationModule.name}
                        </strong>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                          {advancedBlueprint.operationModule.desc || `${userName}님의 영혼이 이 생에 태어나 완수하기로 설계한 핵심 시나리오 모듈입니다. 삶의 추진력과 비전을 제공해 주는 원동력입니다.`}
                        </p>
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono mt-3">
                        OS Core Module ID: {advancedBlueprint.operationModule.id}
                      </div>
                    </button>
                  )}

                  {/* 용신 카드 */}
                  <button
                    onClick={() => {
                      setSelectedDetail({
                        type: 'yongsin',
                        id: comprehensiveData.yongsinChar
                      });
                    }}
                    className="p-5 bg-slate-950/50 border border-amber-500/20 hover:border-amber-500/50 rounded-3xl space-y-3 relative overflow-hidden flex flex-col justify-between text-left cursor-pointer transition-all hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] group focus:outline-none w-full"
                  >
                    <div className="absolute top-[-10%] right-[-10%] w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none transition-colors group-hover:bg-amber-500/10" />
                    <div className="space-y-3 w-full">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[9px] font-black text-amber-400">COOLING NODE</span>
                          <h4 className="text-xs md:text-sm font-black text-white">내면의 수호 기운 (용신)</h4>
                        </div>
                        <span className="text-[8px] font-bold text-amber-400 animate-pulse bg-amber-500/10 px-1.5 py-0.5 rounded">상세 치유 해독클릭</span>
                      </div>
                      <strong className="text-sm font-black text-amber-300 block font-mono">
                        {comprehensiveData.yongsinChar}
                      </strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        {comprehensiveData.yongsinMsg}
                      </p>
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono mt-3">
                      System Balance Restorer: Active
                    </div>
                  </button>
                </div>

                {/* 섹션 3: 대운 & 세운 합충 (우주 패치 및 네트워크 동기화 로그) */}
                <div className="p-5 bg-slate-950/50 border border-white/5 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[9px] font-black text-cyan-300">SYNC LOGS</span>
                    <h4 className="text-xs md:text-sm font-black text-white">우주 펌웨어 & 올해의 패치 로그 (대운/세운 합충)</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    10년 주기의 메인 라이프 업데이트(대운)와 올해 2026년(병오년) 세운의 패치가 마찰하는 지점을 디버깅하여 평화로운 궤도로 정렬합니다.
                  </p>

                  <div className="space-y-4">
                    {/* 대운 흐름 */}
                    <div className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl">
                      <span className="text-[9px] font-black text-slate-500 block mb-1 uppercase tracking-wider">10년 대운 업데이트 현황</span>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs text-slate-300 font-serif leading-relaxed">
                          현재 {userName}님은 10년 단위의 메인 하드웨어 장기 펌웨어 궤도를 지나고 있습니다. (만 {avatarAge}세 시기)
                        </span>
                        <div className="px-2.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/30 text-[9px] text-purple-300 font-black">
                          {sajuData.daewoon && sajuData.daewoon.find((dw: any) => avatarAge >= dw.age && avatarAge < dw.age + 10)?.ganzhi || '정해'} 운 실행 중
                        </div>
                      </div>
                    </div>

                    {/* 세운 합충 */}
                    <button
                      onClick={() => {
                        setSelectedDetail({
                          type: 'sewun',
                          id: 'sewun2026'
                        });
                      }}
                      className="p-4 bg-slate-900/60 border border-cyan-500/20 hover:border-cyan-500/50 rounded-2xl relative overflow-hidden text-left cursor-pointer transition-all hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] group focus:outline-none w-full"
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl pointer-events-none transition-colors group-hover:bg-cyan-500/10" />
                      <div className="flex justify-between items-center w-full mb-2">
                        <span className="text-[9px] font-black text-cyan-400 uppercase tracking-wider">올해(2026년 丙午) 세운 합충 디버깅</span>
                        <span className="text-[8px] font-bold text-cyan-400 animate-pulse bg-cyan-500/10 px-1.5 py-0.5 rounded">상세 치유 해독클릭</span>
                      </div>
                      <p className="text-[11.5px] text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                        {comprehensiveData.sewunAnalysis}
                      </p>
                    </button>
                  </div>
                </div>

                {/* 섹션 4: 하드웨어 특수 증폭 센서 (신살) */}
                <div className="p-5 bg-slate-950/50 border border-white/5 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[9px] font-black text-amber-400">BOOST SENSORS</span>
                    <h4 className="text-xs md:text-sm font-black text-white">하드웨어 특수 증폭 센서 (신살)</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    사주 원국에 장착되어 특정 전자기적 흐름을 극대화시키는 특수 전압 센서들입니다. 이를 무의식에 지배당하지 않고, 주체로서 부리는 비결을 가이드합니다.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {comprehensiveData.shinsalList.map((shin, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedDetail({
                            type: 'shinsal',
                            id: shin.name
                          });
                        }}
                        className="p-4 bg-slate-900/60 border border-amber-500/10 hover:border-amber-500/35 rounded-2xl relative overflow-hidden text-left cursor-pointer transition-all hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] group focus:outline-none w-full"
                      >
                        <div className="absolute top-4 right-4 text-xl select-none group-hover:scale-110 transition-transform duration-300">
                          {shin.icon}
                        </div>
                        <div className="flex justify-between items-center w-full mb-1">
                          <span className="text-[8px] md:text-[9px] font-black text-amber-500 uppercase tracking-widest block">Boost Node #{idx+1}</span>
                          <span className="text-[8px] font-bold text-amber-500 animate-pulse bg-amber-500/10 px-1.5 py-0.5 rounded">상세 치유 해독클릭</span>
                        </div>
                        <h5 className="text-xs md:text-sm font-black text-white mb-2">{shin.name}</h5>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans pr-4">{shin.desc}</p>
                      </button>
                    ))}
                    {comprehensiveData.shinsalList.length === 0 && (
                      <div className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl text-center text-xs text-slate-500 col-span-2">
                        장착된 특수한 신살 센서가 모두 안전 모드로 동작하고 있거나 기본 상태입니다.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. 자미두수 명반 해독 및 AI 교차분석 탭 */}
            {activeTab === 'zimidusu' && zimidusuChart && (
              <motion.div
                key="zimidusu-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-white pb-6"
              >
                {/* 탭 헤더 */}
                <div className="p-4 bg-gradient-to-r from-purple-950/25 via-indigo-950/30 to-slate-900 border border-purple-500/35 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="p-1 rounded bg-purple-500/10 border border-purple-500/30">
                      <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                    </div>
                    <h3 className="text-xs md:text-sm font-black text-purple-300 uppercase tracking-widest">
                      Zimidusu & AI Crossover Blueprint
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    {userProfile?.userName || '회원님'}의 생년월일시와 성별을 기준으로 산출한 평생의 우주적 별자리 설계도(명반)입니다.
                    명리(사주)의 일간 기운과 자미두수 명궁의 영혼 작동 코드를 AI가 교차분석하여, 심리적 한계를 넘어설 수 있는 최고의 멘탈코칭 솔루션을 제안합니다.
                  </p>
                </div>

                {/* AI 교차분석 결과 카드 */}
                {zimidusuCrossover && (
                  <div className="p-5 bg-gradient-to-b from-purple-950/20 via-slate-950/80 to-slate-950/60 border border-purple-500/25 rounded-3xl space-y-4 relative overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-[9px] font-black text-purple-400">AI CROSSOVER</span>
                        <h4 className="text-xs md:text-sm font-black text-white">사주 × 자미두수 AI 영혼 통합 리포트</h4>
                      </div>
                      <span className="text-[9px] text-purple-300 font-mono bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/20">
                        {zimidusuCrossover.activeDecade}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-sm font-black text-purple-300 leading-tight">
                        {zimidusuCrossover.title}
                      </h5>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-serif bg-slate-900/40 p-4 rounded-2xl border border-white/5 shadow-inner">
                        {zimidusuCrossover.crossoverDetail}
                      </p>
                      <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-center">
                        <span className="text-[9px] font-black text-amber-500 block mb-1 uppercase tracking-wider">💡 메인 시스템 디버깅 핵심 솔루션</span>
                        <p className="text-xs text-amber-200/90 font-serif leading-relaxed italic">
                          {zimidusuCrossover.briefing}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 12궁 명반 안내 */}
                <div className="text-center py-1">
                  <span className="text-[10px] md:text-xs text-slate-400 font-medium">
                    🔍 아래 명반의 각 궁(카드)을 클릭하면, 현대 심리학적 은유 해설과 멘탈코칭 메시지가 열립니다.
                  </span>
                </div>

                {/* 자미두수 명반 12궁 Grid / Scroll */}
                <div className="space-y-4">
                  {/* 1. 모바일 뷰 (가로 스와이프 캐러셀) */}
                  <div className="flex md:hidden gap-3 overflow-x-auto pb-4 px-1 snap-x scrollbar-thin scrollbar-thumb-purple-900">
                    {zimidusuChart.palaces?.map((palace: any, idx: number) => {
                      const mutagenStar = [...(palace.majorStars || []), ...(palace.minorStars || []), ...(palace.adjectiveStars || [])].find(s => s.mutagen);
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedZimidusuPalace(palace)}
                          className="min-w-[170px] max-w-[200px] snap-center p-4 bg-slate-900/60 border border-white/5 hover:border-purple-500/40 rounded-2xl text-left cursor-pointer transition-all flex flex-col justify-between space-y-3 relative group focus:outline-none"
                        >
                          <div className="absolute top-0 right-0 w-12 h-12 bg-white/2 rounded-full blur-xl group-hover:bg-purple-500/5" />
                          <div className="space-y-1 w-full">
                            <div className="flex justify-between items-center w-full">
                              <span className="text-[10px] font-bold text-slate-500 font-mono">{palace.heavenlyStem}{palace.earthlyBranch}</span>
                              <span className="text-[8px] font-black text-slate-400 bg-white/5 px-1 py-0.5 rounded">
                                {palace.decadal.range[0]}-{palace.decadal.range[1]}세
                              </span>
                            </div>
                            <h5 className="text-sm font-black text-white flex items-center gap-1">
                              {palace.name === '명' || palace.name.includes('명') ? '🔮 명궁' : `${palace.name}궁`}
                            </h5>
                          </div>

                          {/* 주요 별 및 사화 표시 */}
                          <div className="space-y-1.5 w-full flex-grow">
                            {palace.majorStars && palace.majorStars.length > 0 ? (
                              <div className="flex flex-col gap-1">
                                {palace.majorStars.map((star: any, sIdx: number) => (
                                  <span key={sIdx} className="text-xs font-bold text-purple-300">
                                    {star.name}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-500 italic block">대궁 기운 흡수</span>
                            )}

                            {/* 사화 뱃지 */}
                            {mutagenStar && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                <span className={`text-[8px] px-1 py-0.5 rounded font-black border uppercase ${
                                  mutagenStar.mutagen === '기' ? 'bg-red-950/40 border-red-500/40 text-red-400' :
                                  mutagenStar.mutagen === '록' ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' :
                                  mutagenStar.mutagen === '권' ? 'bg-amber-950/40 border-amber-500/40 text-amber-400' :
                                  'bg-blue-950/40 border-blue-500/40 text-blue-400'
                                }`}>
                                  화{mutagenStar.mutagen} ({mutagenStar.name})
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="w-full pt-1.5 border-t border-white/5 text-[9px] text-purple-400 font-black animate-pulse flex justify-between items-center">
                            <span>상세 해독</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* 2. 데스크탑 4x4 자미두수 명반 그리드 */}
                  <div className="hidden md:grid grid-cols-4 grid-rows-4 gap-3 max-w-[680px] mx-auto aspect-square p-2 bg-slate-950/40 border border-white/5 rounded-3xl relative">
                    
                    {/* 12궁 카드들 배치 */}
                    {zimidusuChart.palaces?.map((palace: any, idx: number) => {
                      const branch = palace.earthlyBranch;
                      const gridPos = ZIMIDUSU_GRID_MAP[branch] || { row: 'row-start-1', col: 'col-start-1' };
                      const mutagenStar = [...(palace.majorStars || []), ...(palace.minorStars || []), ...(palace.adjectiveStars || [])].find(s => s.mutagen);

                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedZimidusuPalace(palace)}
                          className={`${gridPos.row} ${gridPos.col} p-3 bg-slate-900/50 border border-white/5 hover:border-purple-500/40 rounded-2xl text-left cursor-pointer transition-all hover:scale-[1.03] hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] flex flex-col justify-between space-y-2 relative group focus:outline-none w-full h-full`}
                        >
                          <div className="absolute top-0 right-0 w-10 h-10 bg-white/2 rounded-full blur-lg group-hover:bg-purple-500/5" />
                          
                          <div className="w-full flex justify-between items-start">
                            <div className="flex flex-col">
                              <span className="text-[8px] font-bold text-slate-500 font-mono leading-none mb-0.5">{palace.heavenlyStem}{palace.earthlyBranch}</span>
                              <h5 className="text-xs font-black text-white leading-none">
                                {palace.name === '명' || palace.name.includes('명') ? '🔮 명궁' : `${palace.name}궁`}
                              </h5>
                            </div>
                            <span className="text-[8px] text-slate-400 font-mono leading-none bg-white/5 px-1 py-0.5 rounded">
                              {palace.decadal.range[0]}-{palace.decadal.range[1]}세
                            </span>
                          </div>

                          {/* 별 목록 */}
                          <div className="w-full flex-grow space-y-1">
                            {palace.majorStars && palace.majorStars.length > 0 ? (
                              <div className="flex flex-col gap-0.5">
                                {palace.majorStars.map((star: any, sIdx: number) => (
                                  <span key={sIdx} className="text-[10px] font-bold text-purple-300 truncate">
                                    {star.name}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[9px] text-slate-500 italic block">대궁 기운 흡수</span>
                            )}

                            {/* 사화 뱃지 */}
                            {mutagenStar && (
                              <span className={`text-[8px] px-1 py-0.5 rounded font-black border uppercase block w-fit truncate mt-1 leading-none ${
                                mutagenStar.mutagen === '기' ? 'bg-red-950/40 border-red-500/40 text-red-400' :
                                mutagenStar.mutagen === '록' ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' :
                                mutagenStar.mutagen === '권' ? 'bg-amber-950/40 border-amber-500/40 text-amber-400' :
                                'bg-blue-950/40 border-blue-500/40 text-blue-400'
                              }`}>
                                화{mutagenStar.mutagen} ({mutagenStar.name})
                              </span>
                            )}
                          </div>

                          <div className="w-full pt-1 border-t border-white/5 text-[8px] text-purple-400 font-black animate-pulse flex justify-between items-center">
                            <span>치유 해독</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </div>
                        </button>
                      );
                    })}

                    {/* 중앙 4x4 비는 4칸 (row 2 ~ row 3, col 2 ~ col 3) 병합 영역 */}
                    <div className="row-start-2 row-end-4 col-start-2 col-end-4 bg-gradient-to-b from-purple-950/15 via-slate-900/30 to-slate-950/40 border border-purple-500/10 rounded-2xl flex flex-col justify-center items-center p-3 text-center space-y-2 relative overflow-hidden select-none">
                      <div className="absolute inset-0 bg-radial-gradient from-purple-500/5 to-transparent pointer-events-none" />
                      
                      <div className="p-1 rounded bg-purple-500/10 border border-purple-500/30 w-fit">
                        <Compass className="w-4 h-4 text-purple-400 animate-spin-slow" />
                      </div>
                      
                      <div className="space-y-0.5">
                        <strong className="text-[11px] font-black text-purple-300 block uppercase tracking-widest leading-none">
                          Zimidusu Astrolabe
                        </strong>
                        <span className="text-[9px] text-slate-500 font-mono block">
                          Core Control Node
                        </span>
                      </div>
                      
                      <p className="text-[10px] text-slate-400 font-serif leading-tight max-w-[130px]">
                        내면의 은하계가 한눈에 매핑되어 조율 중입니다.
                      </p>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {/* 6. 사주 × 자미두수 AI 종합 해독 탭 */}
            {activeTab === 'crossover' && zimidusuChart && themeCrossoverReport && (
              <motion.div
                key="crossover-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-white pb-6"
              >
                {/* 상단 통합 해독 배너 */}
                <div className="p-5 bg-gradient-to-r from-indigo-950/45 via-purple-950/40 to-slate-900 border border-purple-500/35 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 rounded bg-purple-500/10 border border-purple-500/30">
                      <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                    </div>
                    <h3 className="text-xs md:text-sm font-black text-purple-300 uppercase tracking-widest">
                      Saju & Zimidusu AI Crossover Chamber
                    </h3>
                  </div>
                  <h4 className="text-sm md:text-base font-black text-white mb-2">
                    사주 × 자미두수 AI 초고도화 교차 해독실
                  </h4>
                  <p className="text-[11px] leading-relaxed text-slate-400 font-sans">
                    사주 명리학의 현실 행동 인프라(일간/십성)와 자미두수 하늘의 나침반(12궁/성계/사화)을 AI가 초정밀 크로스오버 분석합니다.
                    인생의 6대 핵심 주제에 대한 힐링 에세이를 열어보고, 당신만을 위한 1:1 맞춤형 고민 해결 솔루션을 만나보세요.
                  </p>
                </div>

                {/* 파트 1: 자미두수 정밀 분석 (12궁 & 사화 대한) */}
                <div className="p-5 bg-slate-950/40 border border-white/5 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-[9px] font-black text-purple-400">ASTROLOBE SPEC</span>
                    <h4 className="text-xs md:text-sm font-black text-white">자미두수 정밀 기체 명세 (12궁 명반 & 사화 대한)</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setShowZimidusuGridModal(true)}
                      className="p-4 bg-slate-900/60 border border-purple-500/10 hover:border-purple-500/40 rounded-2xl space-y-2 text-left cursor-pointer transition-all hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] group focus:outline-none w-full"
                    >
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-1.5 text-xs font-black text-purple-300">
                          <Milestone className="w-3.5 h-3.5 text-purple-400" />
                          <span>12궁 명반 + 100+별 배치</span>
                        </div>
                        <span className="text-[8px] font-bold text-purple-400 animate-pulse bg-purple-500/10 px-1.5 py-0.5 rounded">상세 명반보기</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        4x4 그리드 명반 차트에 12궁별 주성, 부성, 잡요와 밝기(묘왕평함)를 시각화. 내 영혼의 구체적인 12가지 인생 지도를 한눈에 직접 조망합니다.
                      </p>
                    </button>
                    
                    <button
                      onClick={() => setShowSawaDaewoonModal(true)}
                      className="p-4 bg-slate-900/60 border border-purple-500/10 hover:border-purple-500/40 rounded-2xl space-y-2 text-left cursor-pointer transition-all hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] group focus:outline-none w-full"
                    >
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-1.5 text-xs font-black text-purple-300">
                          <Zap className="w-3.5 h-3.5 text-purple-400" />
                          <span>사화(四化) + 대한(10년 운세)</span>
                        </div>
                        <span className="text-[8px] font-bold text-purple-400 animate-pulse bg-purple-500/10 px-1.5 py-0.5 rounded">운세 리포트보기</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        화록, 화권, 화과, 화기가 작용하는 궁 분석. 10년 단위 대한에서 별들의 흐름 변화와 영혼이 마주할 기회, 위기 시점을 정밀 파악합니다.
                      </p>
                    </button>
                  </div>
                </div>

                {/* 파트 2: 6대 주제별 교차분석 리포트 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-[9px] font-black text-indigo-400">6 CORE THEMES</span>
                    <h4 className="text-xs md:text-sm font-black text-white">6대 영역별 사주 × 자미두수 AI 교차 보고서</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    원하는 분야의 카드를 클릭해 보세요. 사주 일주와 자미두수 궁성(宮星)의 흐름을 다정한 은유법으로 버무린 감동의 자아 치유 리포트가 펼쳐집니다.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(themeCrossoverReport).map(([key, data]: [string, any]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedThemeCard(data)}
                        className="p-4.5 bg-slate-900/60 border border-purple-500/10 hover:border-purple-500/40 rounded-2xl text-left transition-all hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] group relative overflow-hidden w-full focus:outline-none flex flex-col justify-between h-[125px]"
                      >
                        <div className="absolute top-0 right-0 w-12 h-12 bg-white/2 rounded-full blur-xl group-hover:bg-purple-500/5 pointer-events-none" />
                        <div className="space-y-1.5 w-full">
                          <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest block">{data.metaphor}</span>
                          <h5 className="text-xs font-black text-white group-hover:text-purple-300 transition-colors leading-none">
                            {data.title.split('(')[0]}
                          </h5>
                          <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed pr-2 font-serif">
                            {data.desc}
                          </p>
                        </div>
                        <div className="w-full pt-1.5 border-t border-white/5 text-[8px] text-purple-400 font-black flex justify-between items-center group-hover:animate-pulse">
                          <span>교차 힐링 에세이 해독</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 파트 3: 고민 맞춤 해독 및 1:1 추가 질문 */}
                <div className="p-5 bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-purple-500/20 rounded-3xl space-y-5 relative">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[9px] font-black text-amber-500">CUSTOM SOLVER</span>
                      <h4 className="text-xs md:text-sm font-black text-white">사주 × 자미두수 고민 맞춤 AI 디버깅</h4>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    진로, 연애, 재물 등 마음속에 품고 있는 구체적인 고민을 아래에 적어주세요. 사주 기하학과 자미두수 성계를 융합하여 당신의 무의식 상처를 해독하고 나아갈 길을 비추는 1:1 맞춤 치유 솔루션을 실시간 튜닝해 냅니다.
                  </p>

                  <div className="space-y-4">
                    {/* 고민 분야 선택 */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 block">고민 분야 선택</span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'job', label: '🌳 직업/진로/이직', icon: Milestone },
                          { id: 'love', label: '🪞 연애/결혼/사랑', icon: EyeOff },
                          { id: 'wealth', label: '💵 재물/사업/재테크', icon: Compass },
                          { id: 'general', label: '🧘 마음 치유/인간관계', icon: Sparkles }
                        ].map((cat) => {
                          const CatIcon = cat.icon;
                          const isSelected = troubleCategory === cat.id;
                          return (
                            <button
                              key={cat.id}
                              onClick={() => {
                                setTroubleCategory(cat.id as any);
                                setFollowUpAnswer(null);
                                setFollowUpQuestion('');
                              }}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all focus:outline-none ${
                                isSelected
                                  ? 'bg-purple-650 text-white border border-purple-500/30 shadow-md shadow-purple-500/15'
                                  : 'bg-slate-900 border border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                              }`}
                            >
                              <CatIcon className="w-3.5 h-3.5" />
                              <span>{cat.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 고민 입력란 */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 block">구체적인 고민 작성</span>
                      <div className="relative">
                        <textarea
                          value={troubleQuestion}
                          onChange={(e) => setTroubleQuestion(e.target.value)}
                          placeholder="예: 올해 다니던 직장을 옮기고 다른 직업 분야로 과감히 도전하고 싶습니다. 저한테 어떤 변화가 생기고, 어떻게 마음을 다스리면 좋을까요?"
                          rows={3}
                          className="w-full bg-slate-950/60 border border-white/10 hover:border-purple-500/30 focus:border-purple-500/50 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none transition-all leading-relaxed font-sans pr-12 resize-none"
                        />
                        <button
                          disabled={!troubleQuestion.trim() || isAnalyzingTrouble}
                          onClick={() => {
                            setIsAnalyzingTrouble(true);
                            // 1초 시뮬레이션 후 결과 생성
                            setTimeout(() => {
                              const report = getCustomTroubleAnalysis(troubleCategory, troubleQuestion, sajuData, zimidusuChart, userName);
                              setTroubleReport(report);
                              setIsAnalyzingTrouble(false);
                            }, 1100);
                          }}
                          className={`absolute bottom-4 right-4 p-2 rounded-xl focus:outline-none transition-all ${
                            troubleQuestion.trim() && !isAnalyzingTrouble
                              ? 'bg-purple-650 text-white hover:bg-purple-500 active:scale-95 shadow-md shadow-purple-500/20'
                              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                          }`}
                        >
                          {isAnalyzingTrouble ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <ArrowRight className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* Footer Navigation Buttons */}
        <div className={`p-4 md:p-6 border-t ${textDark ? 'border-slate-200 bg-slate-50' : 'border-white/5 bg-slate-950/40'} flex items-center justify-between relative z-10`}>
          
          {/* 하단 좌측 Progress / 탭 안내 */}
          {activeTab === 'training' ? (
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((dotNum) => (
                <button
                  key={dotNum}
                  onClick={() => setStep(dotNum as any)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    step === dotNum 
                      ? step === 4 ? 'bg-amber-600 scale-125' : 'bg-purple-500 scale-125' 
                      : step === 4 ? 'bg-slate-300' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          ) : (
            <span className={`text-[9px] md:text-[10px] ${textDark ? 'text-slate-500' : 'text-slate-400'} font-mono uppercase tracking-wider`}>
              {activeTab} mode active
            </span>
          )}

          {/* 하단 우측 네비게이션 버튼 세트 */}
          <div className="flex gap-2">
            {activeTab === 'training' && step > 1 && (
              <button
                onClick={() => setStep((step - 1) as any)}
                className={`px-3 md:px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  textDark 
                    ? 'border-slate-300 text-slate-600 hover:bg-slate-100' 
                    : 'border-white/10 text-slate-400 hover:bg-white/5'
                }`}
              >
                이전 단계
              </button>
            )}
            
            {activeTab === 'training' ? (
              step < 4 ? (
                <button
                  onClick={() => setStep((step + 1) as any)}
                  className={`px-4 md:px-5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r ${currentTheme.nextBtn} flex items-center gap-1 shadow-md transition-all active:scale-95`}
                >
                  <span>차원 상승</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-4 md:px-5 py-2 rounded-xl text-xs font-black text-slate-800 bg-slate-200 hover:bg-slate-300 transition-all active:scale-95"
                >
                  훈련실 퇴장
                </button>
              )
            ) : (
              <button
                onClick={onClose}
                className={`px-4 md:px-5 py-2 rounded-xl text-xs font-black ${
                  textDark 
                    ? 'text-slate-800 bg-slate-200 hover:bg-slate-300' 
                    : 'text-slate-300 bg-white/5 hover:bg-white/10'
                } transition-all active:scale-95`}
              >
                닫기
              </button>
            )}
          </div>
        </div>



      </motion.div>
          {/* 1. 자유의지 시프트 발동 완료 증명서 서브 모달 */}
          <AnimatePresence>
            {showSuccessCert && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 30 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 30 }}
                  className="w-full max-w-md bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-center relative overflow-hidden max-h-full overflow-y-auto scrollbar-thin"
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-50 via-yellow-400 to-amber-500" />
                  <div className="text-[48px] mb-3">📜</div>
                  <span className="text-[9px] font-black text-amber-500 tracking-widest uppercase block mb-1">
                    Myeongsim Space Training Certificate
                  </span>
                  <h3 className="text-lg font-serif font-black text-white mb-2">
                    자유의지 시프트 (Shift) 발동 증명서
                  </h3>
                  
                  <div className="my-5 p-4 bg-slate-950/60 border border-white/5 rounded-2xl text-left space-y-3 font-serif">
                    <div className="text-[11px] text-slate-400 flex justify-between border-b border-white/5 pb-1">
                      <span>훈련 대상자 :</span>
                      <span className="text-white font-sans font-bold">{userName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex justify-between border-b border-white/5 pb-1">
                      <span>해킹 마스터 일간 :</span>
                      <span className="text-amber-300 font-sans font-bold">{sajuData?.day?.gan?.char}({sajuData?.day?.gan?.hanja}) {sajuData?.day?.gan?.label}기운</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex justify-between border-b border-white/5 pb-1">
                      <span>자유의지 공간 확보 :</span>
                      <span className="text-cyan-400 font-sans font-bold">0.3초 (300ms Free Won't)</span>
                    </div>
                    <p className="text-[11px] text-slate-350 leading-relaxed pt-1 select-none">
                      "위 사람은 타고난 사주의 디폴트 환경과 왜곡 루프(다크코드)를 완전 타자화하고, 
                      자극과 반응 사이의 0.3초의 광장을 확보하여 메타코드 통합(不二)의 주체적 시프트를 완벽하게 발동하였음을 증명합니다."
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-500 italic mb-5">
                    "당신은 화면이 아닙니다. 화면 전체를 바라보는 거울 공간입니다."
                  </p>
                  <button
                    onClick={() => {
                      setShowSuccessCert(false);
                      onClose();
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition-transform"
                  >
                    기적의 오늘 출력 시작하기
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2. 충/형 취약점 디버깅 팝업 모달 */}
          <AnimatePresence>
            {selectedInteraction && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 30 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 30 }}
                  className="w-full max-w-md bg-slate-900 border border-red-500/30 rounded-3xl p-6 shadow-[0_0_45px_rgba(239,68,68,0.2)] text-left relative overflow-hidden max-h-full overflow-y-auto scrollbar-thin"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-purple-600" />
                  <h3 className="text-base font-black text-red-400 mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                    {selectedInteraction.name || '사주 취약점 상세'}
                  </h3>
                  <p className="text-xs text-slate-350 leading-relaxed font-serif bg-slate-950/60 p-4 rounded-xl border border-white/5 mb-5 select-none">
                    {selectedInteraction.desc || selectedInteraction.message || '상세 진단 로그가 없습니다.'}
                  </p>
                  
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-emerald-400 block uppercase tracking-wider">💡 인지행동 치유 가이드 (Hot-Fix Patch)</span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      이 충돌 에러는 특정 상황에서 작동하는 당신의 자동 방어 기제일 뿐입니다. 
                      이를 무력화하기 위해 "내가 틀릴 수 있음을 수용"하거나 "상황을 급격히 롤백하지 않고 3초간 머무르는" 핫픽스 실천을 가동해 보십시오.
                    </p>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={() => setSelectedInteraction(null)}
                      className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
                    >
                      닫기
                    </button>
                    <button
                      onClick={() => {
                        setSelectedInteraction(null);
                        setActiveTab('profile');
                      }}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-purple-600 text-white font-black text-xs shadow-lg active:scale-95 transition-transform"
                    >
                      네 기둥 솔루션 확인
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3. 지장간 상세 해석 모달 */}
          <AnimatePresence>
            {selectedJijanggan && jijangganEssay && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
              >
                <motion.div
                  initial={{ scale: 0.94, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.94, y: 15 }}
                  className="w-full max-w-lg bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-indigo-950/30 border-2 border-purple-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(168,85,247,0.35)] text-left relative overflow-hidden max-h-full overflow-y-auto scrollbar-thin"
                >
                  <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
                  <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-500" />
                  
                  <button
                    onClick={() => setSelectedJijanggan(null)}
                    className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black text-purple-300 tracking-widest uppercase">
                      Hidden Soul Gear Decoded
                    </span>
                  </div>

                  <h3 className="text-base md:text-lg font-black text-white mb-2 tracking-tight">
                    {jijangganEssay.title}
                  </h3>
                  <span className="text-[10px] md:text-xs font-black text-cyan-300 bg-cyan-950/60 border border-cyan-500/35 px-3 py-1 rounded-full block w-fit mb-6 shadow-sm shadow-cyan-500/10">
                    {jijangganEssay.subtitle}
                  </span>

                  <div className="space-y-5 text-xs md:text-sm leading-relaxed text-slate-300">
                    <div className="p-4 bg-slate-950/70 border border-white/5 rounded-2xl relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500/50" />
                      <span className="text-[9px] font-black text-slate-500 block mb-1.5 uppercase tracking-wider">이 기운의 심리적 위치</span>
                      <p className="font-serif italic leading-relaxed text-slate-200">
                        {jijangganEssay.typeDesc}
                      </p>
                    </div>

                    <div className="p-4.5 bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/20 rounded-2xl space-y-2 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
                      <span className="text-[9px] font-black text-purple-400 block uppercase tracking-wider">따뜻한 영혼의 은유 풀이</span>
                      <p className="font-sans font-medium text-slate-200 leading-relaxed text-[13px] md:text-sm whitespace-pre-line">
                        {jijangganEssay.ganDetail}
                      </p>
                    </div>

                    <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-500/30" />
                      <p className="text-xs text-amber-200/90 font-serif leading-relaxed select-none italic">
                        {jijangganEssay.finalMsg}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                    <button
                      onClick={() => setSelectedJijanggan(null)}
                      className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-500/20 active:scale-95 transition-all duration-300"
                    >
                      자각 완료 (OS에 장착하기)
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 4. 종합 분석 상세 MSC 힐링 모달 팝업 */}
          <AnimatePresence>
            {selectedDetail && activeDetailEssay && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
              >
                <motion.div
                  initial={{ scale: 0.94, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.94, y: 15 }}
                  className="w-full max-w-lg bg-gradient-to-b from-slate-900/95 via-slate-950/98 to-purple-950/30 border-2 border-purple-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(168,85,247,0.35)] text-left relative overflow-hidden max-h-full overflow-y-auto scrollbar-thin"
                >
                  <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
                  <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-indigo-500 to-amber-500" />
                  
                  <button
                    onClick={() => { setSelectedDetail(null); setGyeokgukTab('essay'); }}
                    className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black text-purple-300 tracking-widest uppercase">
                      Deep Mental Healing Essay
                    </span>
                  </div>

                  <h3 className="text-base md:text-lg font-black text-white mb-1.5 tracking-tight">
                    {activeDetailEssay.title}
                  </h3>
                  <span className="text-[10px] md:text-xs font-black text-purple-350 bg-purple-950/60 border border-purple-500/35 px-3 py-1 rounded-full block w-fit mb-5 shadow-sm shadow-purple-500/10">
                    {activeDetailEssay.subtitle}
                  </span>

                  {/* 격국 카드 상세인 경우 서브 탭 노출 */}
                  {selectedDetail.type === 'gyeokguk' && gyeokgukAnalysis && (
                    <div className="flex bg-slate-950/60 p-1 rounded-xl border border-white/5 gap-1 mb-5">
                      <button
                        onClick={() => setGyeokgukTab('essay')}
                        className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${
                          gyeokgukTab === 'essay'
                            ? 'bg-purple-650 text-white shadow-md shadow-purple-500/20'
                            : 'text-slate-400 hover:text-slate-205'
                        }`}
                      >
                        🌿 마음 치유 에세이
                      </button>
                      <button
                        onClick={() => setGyeokgukTab('advanced')}
                        className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${
                          gyeokgukTab === 'advanced'
                            ? 'bg-gradient-to-r from-indigo-650 to-purple-650 text-white shadow-md shadow-purple-500/20'
                            : 'text-slate-400 hover:text-slate-205'
                        }`}
                      >
                        📊 고급 심화 분석
                      </button>
                    </div>
                  )}

                  <div className="space-y-5 text-xs md:text-sm leading-relaxed text-slate-355 max-h-[45vh] overflow-y-auto pr-1 scrollbar-thin">
                    {selectedDetail.type === 'gyeokguk' && gyeokgukTab === 'advanced' && gyeokgukAnalysis ? (
                      // 고급 심화 분석 탭 화면
                      <div className="space-y-6 text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
                        
                        {/* 사주 간지 소개 인트로 */}
                        <p className="font-semibold text-slate-200 bg-slate-900/60 p-4 border border-white/5 rounded-2xl whitespace-pre-line leading-relaxed shadow-inner">
                          {gyeokgukAnalysis.intro}
                        </p>

                        {/* 1. 격국의 도출 원리 */}
                        <div className="space-y-3 p-4 bg-slate-950/40 border border-white/5 rounded-2xl">
                          <h4 className="text-sm font-black text-blue-300 flex items-center gap-1.5 border-b border-white/5 pb-2">
                            <span className="text-blue-500 font-mono">1.</span> 격국(Gyeokguk)의 도출 원리
                          </h4>
                          <div className="space-y-3 pl-1">
                            <div className="flex gap-2">
                              <span className="text-blue-400 text-xs mt-0.5">•</span>
                              <p className="text-[12px] md:text-xs text-slate-300 leading-relaxed">
                                <strong className="text-white">기본 격국 ({gyeokgukAnalysis.finalGyeokName}):</strong>{' '}
                                <span className="text-slate-300">{gyeokgukAnalysis.derivation.baseGyeokDesc}</span>
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-blue-400 text-xs mt-0.5">•</span>
                              <p className="text-[12px] md:text-xs text-slate-300 leading-relaxed">
                                <strong className="text-white">투출에 의한 변화:</strong>{' '}
                                <span className="text-slate-300">{gyeokgukAnalysis.derivation.tucheolDesc}</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* 2. 명심코칭 관점에서의 인지 및 행동 알고리즘 */}
                        <div className="space-y-4 p-4 bg-slate-950/40 border border-white/5 rounded-2xl">
                          <h4 className="text-sm font-black text-purple-300 flex items-center gap-1.5 border-b border-white/5 pb-2">
                            <span className="text-purple-500 font-mono">2.</span> 명심코칭 관점에서의 인지 및 행동 알고리즘
                          </h4>
                          <p className="text-[11px] text-slate-400 italic leading-relaxed pl-1">
                            {gyeokgukAnalysis.algorithm.title}
                          </p>
                          <div className="space-y-3.5 pl-0.5">
                            {gyeokgukAnalysis.algorithm.codes.map((code: any, cIdx: number) => (
                              <div key={cIdx} className="p-4 bg-slate-900/60 border border-purple-500/10 rounded-xl relative overflow-hidden group hover:border-purple-500/30 transition-all">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
                                <div className="flex flex-col gap-0.5 mb-2">
                                  <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">{code.name}</span>
                                  <strong className="text-xs md:text-sm text-white font-black">{code.sub}</strong>
                                </div>
                                <p className="text-[11px] md:text-xs text-slate-305 leading-relaxed whitespace-pre-line font-sans">
                                  {code.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 요약 결론 */}
                        <div className="p-4 bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-indigo-500/25 rounded-2xl relative overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500" />
                          <span className="text-[10px] font-black text-indigo-400 block mb-1.5 uppercase tracking-wider">요약</span>
                          <p className="text-[12px] md:text-xs text-indigo-200 leading-relaxed font-semibold">
                            {gyeokgukAnalysis.summary}
                          </p>
                        </div>

                      </div>
                    ) : (
                      // 기존 마음 치유 에세이 탭 화면 (3대 MSC 자각)
                      <>
                        {/* 마음챙김 영역 */}
                        <div className="p-4 bg-slate-950/70 border border-white/5 rounded-2xl relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500/50" />
                          <span className="text-[10px] font-black text-blue-400 block mb-1.5 uppercase tracking-wider">
                            {activeDetailEssay.mindfulnessTitle}
                          </span>
                          <p className="font-serif italic leading-relaxed text-slate-200 whitespace-pre-line">
                            {activeDetailEssay.mindfulnessDesc}
                          </p>
                        </div>

                        {/* 보편적 인류애 영역 */}
                        <div className="p-4 bg-slate-950/70 border border-white/5 rounded-2xl relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/50" />
                          <span className="text-[10px] font-black text-indigo-400 block mb-1.5 uppercase tracking-wider">
                            {activeDetailEssay.humanityTitle}
                          </span>
                          <p className="font-serif italic leading-relaxed text-slate-200 whitespace-pre-line">
                            {activeDetailEssay.humanityDesc}
                          </p>
                        </div>

                        {/* 자기 친절 영역 */}
                        <div className="p-4 bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/20 rounded-2xl relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
                          <span className="text-[10px] font-black text-purple-400 block uppercase tracking-wider">
                            {activeDetailEssay.kindnessTitle}
                          </span>
                          <p className="font-sans font-medium text-slate-200 leading-relaxed text-[13px] md:text-sm whitespace-pre-line">
                            {activeDetailEssay.kindnessDesc}
                          </p>
                        </div>

                        {/* 마음챙김 다정 요약 위로 */}
                        <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-center relative overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-500/30" />
                          <p className="text-xs text-amber-200/90 font-serif leading-relaxed select-none italic">
                            “{userName}, 가슴을 따뜻하게 적시는 연민의 숨을 크게 들이마시며, 오늘 하루는 나에게 가장 다정한 친구가 되어주세요.”
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                    <button
                      onClick={() => { setSelectedDetail(null); setGyeokgukTab('essay'); }}
                      className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all duration-300"
                    >
                      치유의 자각 동기화 완료
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* 5. 자미두수 12궁 상세 해석 모달 */}
            {selectedZimidusuPalace && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
              >
                <motion.div
                  initial={{ scale: 0.94, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.94, y: 15 }}
                  className="w-full max-w-lg bg-gradient-to-b from-slate-900/95 via-slate-950/98 to-purple-950/30 border-2 border-purple-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(168,85,247,0.35)] text-left relative overflow-hidden max-h-full overflow-y-auto scrollbar-thin"
                >
                  <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
                  <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-indigo-500 to-amber-500" />
                  
                  <button
                    onClick={() => setSelectedZimidusuPalace(null)}
                    className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black text-purple-300 tracking-widest uppercase">
                      Zimidusu Palace Decoded
                    </span>
                  </div>

                  {(() => {
                    const essay = getZimidusuPalaceEssay(selectedZimidusuPalace, userName, sajuData?.day?.gan?.char);
                    if (!essay) return null;

                    return (
                      <>
                        <h3 className="text-base md:text-lg font-black text-white mb-1.5 tracking-tight">
                          {essay.title}
                        </h3>
                        <span className="text-[10px] md:text-xs font-black text-cyan-300 bg-cyan-950/60 border border-cyan-500/35 px-3 py-1 rounded-full block w-fit mb-6 shadow-sm shadow-cyan-500/10">
                          {essay.subtitle} ({selectedZimidusuPalace.decadal.range[0]}세 ~ {selectedZimidusuPalace.decadal.range[1]}세 대한)
                        </span>

                        <div className="space-y-5 text-xs md:text-sm leading-relaxed text-slate-350 max-h-[50vh] overflow-y-auto pr-1 scrollbar-thin">
                          <div className="p-4 bg-slate-950/70 border border-white/5 rounded-2xl relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500/50" />
                            <span className="text-[9px] font-black text-slate-500 block mb-1.5 uppercase tracking-wider">이 영역의 마음 에너지 작용</span>
                            <p className="font-serif italic leading-relaxed text-slate-200">
                              {essay.typeDesc}
                            </p>
                          </div>

                          <div className="p-4.5 bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/20 rounded-2xl space-y-2 relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
                            <span className="text-[9px] font-black text-purple-400 block uppercase tracking-wider">따뜻한 영혼의 은유와 심리 코칭</span>
                            <div className="font-sans font-medium text-slate-200 leading-relaxed text-[13px] md:text-sm whitespace-pre-line">
                              <p className="text-xs text-purple-300 font-bold mb-2">{essay.starMetaphor}</p>
                              {essay.starCoach}
                            </div>
                          </div>

                          <div className="p-4 bg-slate-950/70 border border-white/5 rounded-2xl relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500/50" />
                            <span className="text-[9px] font-black text-slate-500 block mb-1.5 uppercase tracking-wider">사화(化)로 본 내면 주파수 분석</span>
                            <p className="font-sans text-slate-305 leading-relaxed whitespace-pre-line">
                              {essay.mutagenDesc}
                            </p>
                          </div>

                          <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-500/30" />
                            <p className="text-xs text-amber-200/90 font-serif leading-relaxed select-none italic">
                              {essay.finalMsg}
                            </p>
                          </div>
                        </div>
                      </>
                    );
                  })()}

                  <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                    <button
                      onClick={() => setSelectedZimidusuPalace(null)}
                      className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-500/20 active:scale-95 transition-all duration-300"
                    >
                      자각 완료 (내면의 우주로 수용)
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* 6. 4기둥 상세 멘탈 해킹 모달 */}
          <AnimatePresence>
            {advancedSelectedPillar && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
              >
                <motion.div
                  initial={{ scale: 0.94, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.94, y: 15 }}
                  className="w-full max-w-xl bg-gradient-to-b from-slate-900/95 via-slate-950/98 to-purple-950/30 border-2 border-purple-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(168,85,247,0.35)] text-left relative overflow-hidden max-h-[85vh] overflow-y-auto scrollbar-thin"
                >
                  <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
                  <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-cyan-400 to-purple-500" />
                  
                  <button
                    onClick={() => setAdvancedSelectedPillar(null)}
                    className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black text-purple-300 tracking-widest uppercase">
                      Pillar Metacode Decoded
                    </span>
                  </div>

                  {(() => {
                    const activeProfileData = (() => {
                      switch (advancedSelectedPillar) {
                        case 'year': return yearProfile;
                        case 'month': return monthProfile;
                        case 'day': return dayProfile;
                        case 'time': return timeProfile;
                        default: return null;
                      }
                    })();

                    if (!activeProfileData) return null;

                    const pillarLabels = {
                      year: '년주 (조상/외부 환경)',
                      month: '월주 (부모/사회 무대)',
                      day: '일주 (진짜 자아/배우자)',
                      time: '시주 (자녀/미래 영감)'
                    };

                    return (
                      <>
                        <h3 className="text-base md:text-lg font-black text-white mb-1.5 tracking-tight">
                          {pillarLabels[advancedSelectedPillar]} 딥 코칭 설계
                        </h3>
                        <span className="text-[10px] md:text-xs font-black text-cyan-300 bg-cyan-950/60 border border-cyan-500/35 px-3 py-1 rounded-full block w-fit mb-6 shadow-sm shadow-cyan-500/10">
                          {activeProfileData.title}
                        </span>

                        <div className="space-y-6 text-xs md:text-sm leading-relaxed text-slate-350">
                          
                          {/* 1. 다크코드 (상처와 생존 각본) */}
                          <div className="bg-slate-950/60 border border-red-500/20 rounded-2xl p-4 md:p-5 relative overflow-hidden shadow-inner">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
                            <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-[9px] font-black text-red-400 tracking-wider block w-fit mb-3">
                              PHASE 1. DARK CODE SCAN (상처와 생존 각본)
                            </span>
                            
                            <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl mb-3">
                              <span className="text-[9px] font-bold text-red-400 block mb-1">무의식 왜곡 루프 (Legacy Error Script)</span>
                              <p className="text-xs text-red-200 font-serif italic leading-relaxed">
                                {activeProfileData.oldScript}
                              </p>
                            </div>

                            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed font-sans">
                              <p><strong>생존 각본 디테일:</strong> {activeProfileData.scriptDetail}</p>
                              <p className="border-t border-white/5 pt-2 mt-2"><strong>오작동 상태 로그:</strong> {activeProfileData.errorStatus}</p>
                              <p className="text-slate-400"><strong>임계값 축적 리스크:</strong> {activeProfileData.risk}</p>
                            </div>
                          </div>

                          {/* 2. 뉴럴코드 (0.3초 공간을 확보하는 3대 자각 질문) */}
                          <div className="bg-slate-950/60 border border-cyan-500/20 rounded-2xl p-4 md:p-5 shadow-inner space-y-4">
                            <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[9px] font-black text-cyan-300 tracking-wider block w-fit">
                              PHASE 2. NEURAL CODE DETACHMENT (0.3초의 공간 확보)
                            </span>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="p-3 bg-slate-900 border border-cyan-500/10 rounded-xl">
                                <span className="text-[9px] font-black text-cyan-400 block mb-1">소파술 질문 (Surgical)</span>
                                <p className="text-[11px] text-slate-300 leading-relaxed font-serif">{activeProfileData.surgicalQuestion}</p>
                              </div>
                              <div className="p-3 bg-slate-900 border border-cyan-500/10 rounded-xl">
                                <span className="text-[9px] font-black text-cyan-400 block mb-1">재귀적 질문 (Recursive)</span>
                                <p className="text-[11px] text-slate-350 leading-relaxed font-serif">{activeProfileData.recursiveQuestion}</p>
                              </div>
                              <div className="p-3 bg-slate-900 border border-cyan-500/10 rounded-xl">
                                <span className="text-[9px] font-black text-cyan-400 block mb-1">자각의 자각 (Meta-Aware)</span>
                                <p className="text-[11px] text-slate-355 leading-relaxed font-serif">{activeProfileData.metaAwarenessQuestion}</p>
                              </div>
                            </div>
                          </div>

                          {/* 3. 메타코드 (최종 진화 및 4대 통합 솔루션 패치) */}
                          <div className="bg-slate-950/60 border border-purple-500/20 rounded-2xl p-4 md:p-5 shadow-inner space-y-4">
                            <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-[9px] font-black text-purple-400 tracking-wider block w-fit">
                              PHASE 3. META CODE SHIFT & SOLVER (주권자의 탄생)
                            </span>

                            <div className="p-4 bg-gradient-to-br from-purple-500/10 via-amber-500/5 to-slate-950 border border-amber-500/20 rounded-xl">
                              <span className="text-[8px] font-black text-amber-400 uppercase tracking-wider block mb-1">최종 진화 형태 (Meta-Self Output)</span>
                              <strong className="text-xs md:text-sm font-black block text-white font-mono mb-1">{activeProfileData.metaSelf}</strong>
                              <p className="text-xs text-slate-300 leading-relaxed">{activeProfileData.metaSelfDetail}</p>
                            </div>

                            <div className="p-3 bg-slate-900 border border-white/5 rounded-xl text-slate-300 font-serif text-xs leading-relaxed">
                              <strong>명심 마스터 브리핑:</strong> {activeProfileData.briefing}
                            </div>

                            <div className="space-y-2 pt-1">
                              <span className="text-[9px] font-black text-purple-400 block uppercase tracking-wider">4대 통합 뉴럴 솔루션 핫픽스 패치 (Solution Patch)</span>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="p-3 bg-slate-900 border border-white/5 rounded-xl">
                                  <span className="text-[9px] font-black text-purple-400 block">CBT 인지 행동 패치</span>
                                  <p className="text-[11px] text-slate-300 font-serif mt-0.5">"{activeProfileData.cbt}"</p>
                                  <p className="text-[9px] text-amber-300 mt-1">💡 <strong>액션:</strong> {activeProfileData.cbtAction}</p>
                                </div>
                                <div className="p-3 bg-slate-900 border border-white/5 rounded-xl">
                                  <span className="text-[9px] font-black text-purple-400 block">MBCT 마음 수용 패치</span>
                                  <p className="text-[11px] text-slate-300 font-serif mt-0.5">"{activeProfileData.mbct}"</p>
                                  <p className="text-[9px] text-cyan-300 mt-1">💡 <strong>액션:</strong> {activeProfileData.mbctAction}</p>
                                </div>
                                <div className="p-3 bg-slate-900 border border-white/5 rounded-xl">
                                  <span className="text-[9px] font-black text-purple-400 block">DBT 변증법적 조율 패치</span>
                                  <p className="text-[11px] text-slate-300 mt-0.5">{activeProfileData.dbt}</p>
                                  <p className="text-[9px] text-purple-300 mt-1">💡 <strong>액션:</strong> {activeProfileData.dbtAction}</p>
                                </div>
                                <div className="p-3 bg-slate-900 border border-white/5 rounded-xl">
                                  <span className="text-[9px] font-black text-purple-400 block">ACT 수용 전념 가치 패치</span>
                                  <p className="text-[11px] text-slate-300 font-serif mt-0.5">"{activeProfileData.act}"</p>
                                  <p className="text-[9px] text-emerald-300 mt-1">💡 <strong>액션:</strong> {activeProfileData.actAction}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </>
                    );
                  })()}

                  <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                    <button
                      onClick={() => setAdvancedSelectedPillar(null)}
                      className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-500/20 active:scale-95 transition-all duration-300"
                    >
                      자각 완료 및 패치 활성화
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 7. 6대 주제별 상세 해독 모달 팝업 */}
          <AnimatePresence>
            {selectedThemeCard && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
              >
                <motion.div
                  initial={{ scale: 0.94, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.94, y: 15 }}
                  className="w-full max-w-lg bg-gradient-to-b from-slate-900/95 via-slate-950/98 to-purple-950/30 border-2 border-purple-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(168,85,247,0.35)] text-left relative overflow-hidden max-h-[85vh] overflow-y-auto scrollbar-thin"
                >
                  <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
                  <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-indigo-500 to-amber-500" />
                  
                  <button
                    onClick={() => setSelectedThemeCard(null)}
                    className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black text-purple-300 tracking-widest uppercase">
                      6 Core Theme Crossover Decoded
                    </span>
                  </div>

                  <h3 className="text-base md:text-lg font-black text-white mb-1.5 tracking-tight">
                    {selectedThemeCard.title}
                  </h3>
                  <span className="text-[10px] md:text-xs font-black text-cyan-300 bg-cyan-950/60 border border-cyan-500/35 px-3 py-1 rounded-full block w-fit mb-5 shadow-sm shadow-cyan-500/10">
                    {selectedThemeCard.metaphor}
                  </span>

                  <div className="space-y-5 text-xs md:text-sm leading-relaxed text-slate-300">
                    <div className="p-4 bg-slate-950/70 border border-white/5 rounded-2xl relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500/50" />
                      <span className="text-[9px] font-black text-slate-500 block mb-1.5 uppercase tracking-wider">이 영역의 융합 주파수</span>
                      <p className="font-serif italic leading-relaxed text-slate-200">
                        {selectedThemeCard.desc}
                      </p>
                    </div>

                    <div className="p-4.5 bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/20 rounded-2xl space-y-2 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
                      <span className="text-[9px] font-black text-purple-400 block uppercase tracking-wider">사주 × 자미두수 AI 상세 해독</span>
                      <p className="font-sans text-slate-200 leading-relaxed text-[13px] md:text-sm whitespace-pre-line">
                        {selectedThemeCard.analysis}
                      </p>
                    </div>

                    <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-center">
                      <p className="text-xs text-amber-200/90 font-serif leading-relaxed italic">
                        “{userName}, 세상의 수많은 목소리에 나를 맞추려 애쓰지 마세요. 당신이라는 존재 자체로 이미 우주는 풍요롭고 안전합니다.”
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                    <button
                      onClick={() => setSelectedThemeCard(null)}
                      className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-500/20 active:scale-95 transition-all duration-300"
                    >
                      해독 완료 (영혼에 동기화하기)
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 8. AI 고민 맞춤 분석 결과 팝업 모달 */}
          <AnimatePresence>
            {troubleReport && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
              >
                <motion.div
                  initial={{ scale: 0.94, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.94, y: 15 }}
                  className="w-full max-w-lg bg-gradient-to-b from-slate-900/95 via-slate-950/98 to-purple-950/30 border-2 border-purple-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(168,85,247,0.35)] text-left relative overflow-hidden max-h-[85vh] overflow-y-auto scrollbar-thin"
                >
                  <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
                  <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-purple-500 to-cyan-500" />
                  
                  <button
                    onClick={() => {
                      setTroubleReport(null);
                      setFollowUpAnswer(null);
                      setFollowUpQuestion('');
                    }}
                    className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black text-amber-400 tracking-widest uppercase">
                      AI Custom Solver Result
                    </span>
                  </div>

                  <h3 className="text-base md:text-lg font-black text-white mb-1.5 tracking-tight">
                    {troubleReport.categoryLabel} AI 디버깅
                  </h3>
                  <span className="text-[10px] md:text-xs font-black text-amber-300 bg-amber-950/60 border border-amber-500/35 px-3 py-1 rounded-full block w-fit mb-5 shadow-sm shadow-amber-500/10">
                    {troubleReport.solutionMetaphor}
                  </span>

                  <div className="space-y-5 text-xs md:text-sm leading-relaxed text-slate-300">
                    {/* 맞춤 분석 본문 */}
                    <div className="p-4.5 bg-slate-955/70 border border-white/5 rounded-2xl space-y-2 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
                      <span className="text-[9px] font-black text-purple-400 block uppercase tracking-wider">명심 마스터 AI 해독 솔루션</span>
                      <p className="font-sans text-slate-200 leading-relaxed text-[13px] md:text-sm whitespace-pre-line">
                        {troubleReport.analysisText}
                      </p>
                    </div>

                    {/* AI 브리핑 요약 */}
                    <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl">
                      <span className="text-[8px] font-black text-purple-400 block mb-1 uppercase tracking-widest">💡 영혼의 주권 회복 패치</span>
                      <p className="text-xs text-purple-200/90 font-serif leading-relaxed italic">
                        {troubleReport.briefing}
                      </p>
                    </div>

                    {/* 추가 질문 폼 */}
                    <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-3">
                      <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider">💬 명심 마스터에게 추가 질문하기</span>
                      
                      {followUpAnswer ? (
                        <div className="p-3 bg-purple-955/20 border border-purple-500/20 rounded-xl space-y-1.5">
                          <span className="text-[9px] font-black text-purple-400 block">추가 해독 답변</span>
                          <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                            {followUpAnswer}
                          </p>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={followUpQuestion}
                            onChange={(e) => setFollowUpQuestion(e.target.value)}
                            placeholder="예: 알려주신 솔루션을 실생활에서 더 잘 활용하려면 어떤 훈련을 해야 할까요?"
                            className="flex-1 bg-slate-900 border border-white/10 hover:border-purple-500/20 focus:border-purple-500/40 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                          />
                          <button
                            disabled={!followUpQuestion.trim()}
                            onClick={() => {
                              // 추가 질문 답변 연산
                              setFollowUpAnswer(
                                `${userName}님, 참 깊고 아름다운 추가 질문을 던져주셨네요. \n\n이것을 일상에 단단히 심어두기 위한 최고의 방법은 '아바타가 자동으로 켜는 불안 경보(다크코드)를 발견할 때마다 억지로 부정하려 들지 않고, 내 감정을 한 발짝 떨어져서 가만히 지켜보며 3초 동안 크게 심호흡하는 것'입니다. "아, 내 하드웨어가 지금 익숙하게 예전 왜곡 루프를 구동하고 있구나" 하고 마음챙김(자각)을 적용하고, 나의 소중한 가치를 한 번 소리 내어 읊어 주십시오. 그것만으로도 시스템은 즉각 수용 모드로 롤백됩니다.`
                              );
                            }}
                            className={`px-3.5 rounded-xl text-xs font-bold transition-all focus:outline-none ${
                              followUpQuestion.trim()
                                ? 'bg-purple-650 text-white hover:bg-purple-500 active:scale-95'
                                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                            }`}
                          >
                            질문 전송
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                    <button
                      onClick={() => {
                        setTroubleReport(null);
                        setFollowUpAnswer(null);
                        setFollowUpQuestion('');
                      }}
                      className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition-all duration-300"
                    >
                      솔루션 장착 (나를 품어 안기)
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 6-A. 6번 탭 전용: 12궁 명반 팝업 모달 */}
          <AnimatePresence>
            {showZimidusuGridModal && zimidusuChart && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
              >
                <motion.div
                  initial={{ scale: 0.94, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.94, y: 15 }}
                  className="w-full max-w-2xl bg-gradient-to-b from-slate-900/95 via-slate-950/98 to-purple-950/30 border-2 border-purple-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(168,85,247,0.35)] text-left relative overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-thin"
                >
                  <button
                    onClick={() => setShowZimidusuGridModal(false)}
                    className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black text-purple-300 tracking-widest uppercase">
                      Zimidusu Full Grid Map
                    </span>
                  </div>

                  <h3 className="text-base md:text-lg font-black text-white mb-1.5 tracking-tight">
                    내 영혼의 우주 12궁 명반 배치도
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans mb-6">
                    각 궁(카드)을 클릭하면 해당 인생 영역의 현대 심리학적 은유 해설과 MSC 멘탈코칭 메시지가 세밀하게 펼쳐집니다.
                  </p>

                  <div className="space-y-4">
                    {/* 모바일 뷰 캐러셀 */}
                    <div className="flex md:hidden gap-3 overflow-x-auto pb-4 px-1 snap-x scrollbar-thin scrollbar-thumb-purple-900">
                      {zimidusuChart.palaces?.map((palace: any, idx: number) => {
                        const mutagenStar = [...(palace.majorStars || []), ...(palace.minorStars || []), ...(palace.adjectiveStars || [])].find(s => s.mutagen);
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedZimidusuPalace(palace)}
                            className="min-w-[150px] snap-center p-3.5 bg-slate-900/60 border border-white/5 hover:border-purple-500/40 rounded-xl text-left cursor-pointer transition-all flex flex-col justify-between space-y-2 relative group focus:outline-none"
                          >
                            <div className="flex justify-between items-center w-full">
                              <span className="text-[9px] font-bold text-slate-500 font-mono">{palace.heavenlyStem}{palace.earthlyBranch}</span>
                              <span className="text-[8px] font-black text-slate-400 bg-white/5 px-1 py-0.5 rounded">
                                {palace.decadal.range[0]}-{palace.decadal.range[1]}세
                              </span>
                            </div>
                            <h5 className="text-xs font-black text-white">
                              {palace.name === '명' || palace.name.includes('명') ? '🔮 명궁' : `${palace.name}궁`}
                            </h5>
                            <div className="space-y-1 w-full flex-grow">
                              {palace.majorStars && palace.majorStars.length > 0 ? (
                                <div className="flex flex-col gap-0.5">
                                  {palace.majorStars.map((star: any, sIdx: number) => (
                                    <span key={sIdx} className="text-[10px] font-bold text-purple-300 truncate">
                                      {star.name}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-[9px] text-slate-500 italic block">대궁 기운 흡수</span>
                              )}
                            </div>
                            {mutagenStar && (
                              <span className="text-[7.5px] px-1 py-0.5 rounded font-black border uppercase bg-purple-950/40 border-purple-500/40 text-purple-300">
                                화{mutagenStar.mutagen} ({mutagenStar.name})
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* 데스크탑 뷰 4x4 그리드 */}
                    <div className="hidden md:grid grid-cols-4 grid-rows-4 gap-2.5 max-w-[500px] mx-auto aspect-square p-2 bg-slate-950/40 border border-white/5 rounded-2xl relative">
                      {zimidusuChart.palaces?.map((palace: any, idx: number) => {
                        const branch = palace.earthlyBranch;
                        const gridPos = ZIMIDUSU_GRID_MAP[branch] || { row: 'row-start-1', col: 'col-start-1' };
                        const mutagenStar = [...(palace.majorStars || []), ...(palace.minorStars || []), ...(palace.adjectiveStars || [])].find(s => s.mutagen);

                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedZimidusuPalace(palace)}
                            className={`${gridPos.row} ${gridPos.col} p-2.5 bg-slate-900/50 border border-white/5 hover:border-purple-500/40 rounded-xl text-left cursor-pointer transition-all hover:scale-[1.03] flex flex-col justify-between space-y-1 relative group focus:outline-none w-full h-full`}
                          >
                            <div className="w-full flex justify-between items-start">
                              <div className="flex flex-col">
                                <span className="text-[7.5px] font-bold text-slate-500 font-mono leading-none mb-0.5">{palace.heavenlyStem}{palace.earthlyBranch}</span>
                                <h5 className="text-[11px] font-black text-white leading-none">
                                  {palace.name === '명' || palace.name.includes('명') ? '🔮 명궁' : `${palace.name}궁`}
                                </h5>
                              </div>
                              <span className="text-[7.5px] text-slate-400 font-mono leading-none bg-white/5 px-1 py-0.5 rounded">
                                {palace.decadal.range[0]}세
                              </span>
                            </div>
                            <div className="w-full flex-grow space-y-0.5">
                              {palace.majorStars && palace.majorStars.length > 0 ? (
                                <div className="flex flex-col gap-0.5">
                                  {palace.majorStars.map((star: any, sIdx: number) => (
                                    <span key={sIdx} className="text-[9px] font-bold text-purple-300 truncate">
                                      {star.name}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-[8px] text-slate-500 italic block">대궁 흡수</span>
                              )}
                            </div>
                            {mutagenStar && (
                              <span className="text-[7px] px-1 py-0.5 rounded font-black border uppercase bg-purple-950/40 border-purple-500/40 text-purple-300 truncate block w-fit max-w-full leading-none">
                                化{mutagenStar.mutagen}
                              </span>
                            )}
                          </button>
                        );
                      })}
                      {/* 중앙 4칸 */}
                      <div className="row-start-2 row-end-4 col-start-2 col-end-4 bg-gradient-to-b from-purple-950/10 via-slate-900/20 to-slate-950/30 border border-purple-500/10 rounded-xl flex flex-col justify-center items-center p-2 text-center space-y-1 select-none">
                        <Compass className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
                        <strong className="text-[9px] font-black text-purple-300 block uppercase tracking-widest leading-none">OS Core</strong>
                        <p className="text-[8px] text-slate-400 leading-tight">클릭하여 궁을 상세 해독하세요.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                    <button
                      onClick={() => setShowZimidusuGridModal(false)}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-650 to-indigo-650 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg active:scale-95 transition-all duration-300"
                    >
                      닫기
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 6-B. 6번 탭 전용: 사화 + 대한 운세 팝업 모달 */}
          <AnimatePresence>
            {showSawaDaewoonModal && zimidusuChart && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
              >
                <motion.div
                  initial={{ scale: 0.94, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.94, y: 15 }}
                  className="w-full max-w-lg bg-gradient-to-b from-slate-900/95 via-slate-950/98 to-purple-950/30 border-2 border-purple-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(168,85,247,0.35)] text-left relative overflow-hidden max-h-[85vh] overflow-y-auto scrollbar-thin"
                >
                  <button
                    onClick={() => setShowSawaDaewoonModal(false)}
                    className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {(() => {
                    const report = getSawaDaewoonReport(sajuData, zimidusuChart, userName);
                    if (!report) return <p className="text-xs text-slate-400">데이터를 불러오는 중 오류가 발생했습니다.</p>;

                    return (
                      <>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="p-1 rounded-lg bg-purple-500/10 border border-purple-500/20">
                            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                          </div>
                          <span className="text-[9px] md:text-[10px] font-black text-purple-300 tracking-widest uppercase">
                            Sawa & Decadal Astrolife Report
                          </span>
                        </div>

                        <h3 className="text-base md:text-lg font-black text-white mb-1.5 tracking-tight">
                          {report.title}
                        </h3>
                        <span className="text-[10px] md:text-xs font-black text-cyan-300 bg-cyan-950/60 border border-cyan-500/35 px-3 py-1 rounded-full block w-fit mb-6 shadow-sm shadow-cyan-500/10">
                          {report.subtitle}
                        </span>

                        <div className="space-y-5 text-xs md:text-sm leading-relaxed text-slate-350 pr-1 max-h-[55vh] overflow-y-auto scrollbar-thin">
                          {/* 대한 설명 */}
                          <div className="p-4 bg-slate-950/70 border border-white/5 rounded-2xl relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500/50" />
                            <span className="text-[9px] font-black text-slate-500 block mb-1.5 uppercase tracking-wider">10년 대운(인생 기후) 분석</span>
                            <p className="font-serif italic leading-relaxed text-slate-200">
                              {report.daewoonIntro}
                            </p>
                          </div>

                          {/* 사화 분석 */}
                          <div className="p-4.5 bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/20 rounded-2xl space-y-2 relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
                            <span className="text-[9px] font-black text-purple-400 block uppercase tracking-wider">내면의 4대 작용력 (사화 분석)</span>
                            <div className="font-sans font-medium text-slate-200 leading-relaxed text-[13px] md:text-sm whitespace-pre-line space-y-3">
                              {report.sawaAnalysis}
                            </div>
                          </div>

                          {/* 자기연민 MSC 위로 */}
                          <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-500/30" />
                            <p className="text-xs text-amber-200/90 font-serif leading-relaxed select-none italic whitespace-pre-line">
                              {report.mscAdvice}
                            </p>
                          </div>
                        </div>
                      </>
                    );
                  })()}

                  <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                    <button
                      onClick={() => setShowSawaDaewoonModal(false)}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-650 to-indigo-650 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg active:scale-95 transition-all duration-300"
                    >
                      자각 완료 (내면의 우주 흐름 동기화)
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
    </div>
  );
}

// 10천간에 따른 동적 물상 및 다크코드 텍스트 매핑 데이터
const CHUN_GAN_DATA: Record<string, {
  waterShape: string;
  darkLoop: string;
  systemOverload: string;
  neuralCommand: string;
  shiftAction: string;
}> = {
  '갑': {
    waterShape: '한겨울 눈보라 속에 홀로 서 있는 거목 (亥月 甲木)',
    darkLoop: '현실에서 예상치 못한 제약이나 고립감을 마주할 때, 무의식 저저변에 깔린 다크코드는 즉시 "나는 외롭다, 위축되었다, 이 억압적인 환경을 내 힘으로 당장 억지로 뚫어내야 한다"는 저항 루프를 활성화합니다.',
    systemOverload: '성장하지 못한다는 에고의 공포가 내면의 스트레스 알고리즘을 과열시키고, 경직된 근육과 굳어버린 판단력으로 메인보드를 방열 보틀넥 상태에 빠뜨리고 있었습니다.',
    neuralCommand: '“이 답답함과 성장의 지체는 내가 아니다. 계절이 겨울이 되었을 뿐, 아바타의 성장이 잠시 멈춘 자연의 런타임일 뿐이다. 억지로 밀어붙이려는 에고의 가속을 끄고, 있는 그대로 내버려 둔다.”',
    shiftAction: '외부 한계는 그대로 둔 채, 깊은 뿌리를 내리는 성찰과 가장 가치 있는 일에 우선 집중하는 지혜를 선택합니다.'
  },
  '을': {
    waterShape: '꽃샘추위 속 바람에 부드럽게 흔들리는 푸른 풀잎 (春月 乙木)',
    darkLoop: '대인관계나 사회적 피드백에서 미묘한 거절감을 느낄 때, 다크코드는 즉시 "나는 버림받았다, 불안하다, 남들의 마음에 들도록 나를 더 꺾고 맞춰야 한다"는 왜곡 루프를 가동합니다.',
    systemOverload: '타인의 반응에 극도로 민감하게 동기화되면서 전전두엽 피질에 소셜 노이즈가 과부하되어 독자적인 의사결정 엔진을 마비시키고 있었습니다.',
    neuralCommand: '“남들의 평가와 흔들리는 마음(뉴럴코드)은 내 소유가 아니다. 아바타의 미세 안테나가 감지해 낸 전자기적 잡음일 뿐이다. 고치려 들지 않고, 흔들리는 채로 가만히 둔다.”',
    shiftAction: '타인의 시선에서 싱크(Sync)를 해제하고, 오늘 나만의 독창적인 영토에서 부드럽고 끈질기게 생명력의 꽃을 피우는 실제 행동을 선택합니다.'
  },
  '병': {
    waterShape: '먹구름 사이로 세상을 뜨겁게 비추는 태양 (夏月 丙火)',
    darkLoop: '내 뜻대로 상황이 제어되지 않거나 무력함을 느낄 때, 다크코드는 즉시 "나는 완벽히 통제해야 한다, 나약한 모습을 보이면 끝장이다, 다 에너지를 불태워 해결해야 한다"는 영웅주의적 강박 루프를 트리거합니다.',
    systemOverload: '번아웃에 도달했음에도 출력을 멈추지 않고 과전압 상태로 아바타를 혹사하여 심장박동과 자율신경계 시스템을 오버히트시키고 있었습니다.',
    neuralCommand: '“이 과도한 책임감과 타오르는 조급함(뉴럴코드)은 내가 아니다. 에너지를 모두 쏟아내도록 설정된 하드웨어의 자동 연산일 뿐이다. 통제하려는 손아귀를 풀고, 일어난 열기를 그냥 내버려 둔다.”',
    shiftAction: '아바타의 전원 스위치를 잠시 내리고 깊은 휴식(Rest)을 허락하며, 통제 불가능한 것들에 대한 강박을 종료합니다.'
  },
  '정': {
    waterShape: '어두운 바다 위 차가운 파도를 묵묵히 비추는 등대 불빛 (冬月 丁火)',
    darkLoop: '예기치 못한 감정적 동요나 우울감을 만날 때, 다크코드는 "이 불안을 당장 해결하지 못하면 내면이 완전히 타버릴 것이다"라는 극단적 자기검열과 자가소모 루프를 돌립니다.',
    systemOverload: '작은 심리적 스파크에도 내면의 보이지 않는 불길(집착)이 과열되어, 뇌하수체와 스트레스 호르몬 수치를 위험 수준까지 격상시키고 있었습니다.',
    neuralCommand: '“이 요동치는 감정과 타는 듯한 생각(뉴럴코드)은 내가 아니다. 외부 환경의 온도 차이에 의해 하부 피질이 자동으로 뿜어낸 전기 신호일 뿐이다. 바꿀 생각을 접고 그대로 내버려 둔다.”',
    shiftAction: '작은 감정에 매몰되기를 종료하고, 내 영혼의 불빛이 진짜 비춰야 할 가치 있는 과업으로 시선을 돌려 묵묵히 나아갑니다.'
  },
  '무': {
    waterShape: '비바람과 지진에도 말없이 자리를 지키는 태고의 황토 대지 (土月 戊土)',
    darkLoop: '삶의 급격한 변화나 예상치 못한 변수를 마주할 때, 다크코드는 "변화는 위험하다, 움직이지 말고 고집스럽게 이 자리를 지켜야 한다"며 극단적인 방어 기제와 경직성 루프를 켭니다.',
    systemOverload: '상황을 고정하려는 저항 에너지로 인해 전신 신경계가 바짝 굳어지며 생각의 확장성을 가로막고, 번아웃 알고리즘을 내부에서 서서히 끓여 올리고 있었습니다.',
    neuralCommand: '“이 완고한 저항감과 멈춰 서려는 두려움(뉴럴코드)은 내가 아니다. 급격한 변화로부터 아바타를 지키려 가동된 원시 보안 쉘일 뿐이다. 고집을 접고 이 변화의 흐름에 몸을 내맡긴다.”',
    shiftAction: '경직성을 깨고 한 걸음 유연하게 내딛는 모험을 수용하며, 유수처럼 흐르는 새로운 경로로 기꺼이 시프트합니다.'
  },
  '기': {
    waterShape: '단비가 내린 후 온갖 새싹을 조용히 품고 있는 정원 흙 (春月 己土)',
    darkLoop: '주변 사람들의 슬픔이나 갈등을 목격할 때, 다크코드는 즉시 "내가 다 해결해주고 평화를 만들어야 한다. 그렇지 않으면 나는 가치 없다"는 희생자 컴플렉스 루프를 활성화합니다.',
    systemOverload: '타인의 부정적 정서 쓰레기를 여과 없이 내면 정원에 쏟아부어 정신적 흙을 오염시키고, 신경계의 여과 용량을 완전히 초과하게 만들었습니다.',
    neuralCommand: '“타인의 아픔에 지나치게 동조되어 요동치는 이 가슴(뉴럴코드)은 내가 아니다. 타인과 나를 경계 짓지 못하는 아바타의 과도한 공감 알고리즘일 뿐이다. 내가 해결하려는 개입을 멈추고 지켜본다.”',
    shiftAction: '타인의 과제를 그들의 몫으로 존중하며 온전히 돌려주고, 먼저 내 마음에 영양분을 공급하는 자기 연민(Self-Compassion)을 선택합니다.'
  },
  '경': {
    waterShape: '가을바람 속 거대한 바위산에서 뿜어 나오는 서슬 퍼런 무쇠 검 (秋月 庚金)',
    darkLoop: '결과물이 불만족스럽거나 오차를 발견할 때, 다크코드는 즉시 "이것은 잘못되었다, 즉시 칼같이 도려내고 처벌해야 한다"는 정죄와 가혹한 자기비판의 루프를 발포합니다.',
    systemOverload: '자신과 타인을 향한 완벽의 자대로 인해 뇌의 비판적 컴파일러가 과열 작동하며 신경 전달 물질의 도파민을 바짝 말려버리고 있었습니다.',
    neuralCommand: '“이 가혹한 통제력과 분노의 날(뉴럴코드)은 내가 아니다. 예리함을 유지하려는 아바타 철강 골격의 디폴트 연산일 뿐이다. 잘잘못을 가리려는 날카로움을 무디게 해두고 그대로 둔다.”',
    shiftAction: '비판을 멈추고 현상의 불완전함을 있는 그대로 포용하며, 80점짜리 결과물이라도 세상에 따뜻하게 흘려보내는 주체적 유연함을 실현합니다.'
  },
  '신': {
    waterShape: '한겨울 눈보라 속에 홀로 빛을 발하는 다이아몬드 (亥月 辛金)',
    darkLoop: '현실에서 예상치 못한 제약이나 고립감을 마주할 때, 당신의 무의식 저저변에 깔린 다크코드는 즉시 "나는 외롭다, 위축되었다, 이 환경을 억지로 바꿔야 한다"는 2차 화살을 쏘아 올립니다.',
    systemOverload: '닫힌 기호 체계 안에 갇힌 자아는 이 겨울이라는 현실(결과물)과 억지로 싸우려 들며, 그 저항 에너지로 인해 내면의 스트레스 알고리즘을 과열시키고 있었습니다.',
    neuralCommand: '“이 불안과 떨림(뉴럴코드)은 내가 아니다. 내 제어권 밖에 존재하는 하드웨어의 화면일 뿐이다. 바꿀 생각을 아예 접고, 일어난 그대로 내비둔다.”',
    shiftAction: '겨울(흉운)이라는 계절은 바꿀 수 없지만, 그것을 바라보는 메타코드가 켜졌습니다. 거대한 공간이 되어 아바타를 움직여 가치 있는 행동을 시작합니다.'
  },
  '임': {
    waterShape: '얼어붙은 빙하 아래 소리 없이 도도히 흐르는 거대한 물결 (Down-Stream 壬수)',
    darkLoop: '미래에 대한 불확실성이 엄습할 때, 다크코드는 즉시 "무언가 큰 위험이 닥칠 것이다. 완벽히 대비하기 전엔 아무것도 시작해선 안 된다"는 생각의 심해 속 침잠 루프를 가동합니다.',
    systemOverload: '뇌 속에서 무한 루프의 위험 시뮬레이션을 컴파일하여, 전전두엽 피질에 블루스크린 과부하를 초래하고 몸을 무기력의 늪에 방치하고 있었습니다.',
    neuralCommand: '“이 끝없는 생각의 파도와 마비된 행동력(뉴럴코드)은 내가 아니다. 위험을 피하고자 과부하 연산을 돌리는 뇌의 본능적 안전 드라이버일 뿐이다. 생각을 강제로 중단하고 내버려 둔다.”',
    shiftAction: '생각의 심연에서 빠져나와, 오늘 당장 눈앞에 할 수 있는 초소형 행동(Micro Action)을 가볍게 즉시 실행하는 시프트를 단행합니다.'
  },
  '계': {
    waterShape: '여름날 타들어 가는 대지를 적시기 위해 맺힌 맑은 이슬 (夏月 癸水)',
    darkLoop: '환경이 건조하거나 사람들의 이기심을 목격할 때, 다크코드는 즉시 "나는 고갈되고 있다, 내 존재가 흔적도 없이 증발할 것 같다"는 극단적 탈수 공포와 센서 과민 루프를 돌립니다.',
    systemOverload: '주변 자극에 신경계 안테나가 오작동하여 과잉 경보(Somatic Alarm)를 발령하고, 가슴 통증 and 차가운 손발 등 자율신경 조절 차단 현상을 일으켰습니다.',
    neuralCommand: '“이 타들어 갈 것 같은 극도의 초조함(뉴럴코드)은 내가 아니다. 메마른 환경에서 아바타를 방어하기 위해 설계된 탈수 방지 자동 오작동 신호일 뿐이다. 환경을 통제하려는 애씀을 내려놓는다.”',
    shiftAction: '고갈에 대한 두려움을 안아주고, 내 안의 무한한 의식 장에서 맑고 시원한 쿨링 에너지를 스스로 샘솟게 하여 안정을 구축합니다.'
  }
};
