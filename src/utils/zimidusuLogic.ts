import { astro } from 'iztro';
import { Solar, Lunar } from 'lunar-javascript';

// 자미두수 시 인덱스 매핑 (자시 0 ~ 해시 11)
export const getTimeHourIndex = (birthTime: string): number => {
  if (!birthTime) return 0;
  const parts = birthTime.split(':');
  const hour = Number(parts[0]);
  const minute = parts[1] ? Number(parts[1]) : 0;
  const totalMin = hour * 60 + minute;

  if (totalMin >= 23 * 60 || totalMin < 1 * 60) return 0; // 자
  if (totalMin >= 1 * 60 && totalMin < 3 * 60) return 1;  // 축
  if (totalMin >= 3 * 60 && totalMin < 5 * 60) return 2;  // 인
  if (totalMin >= 5 * 60 && totalMin < 7 * 60) return 3;  // 묘
  if (totalMin >= 7 * 60 && totalMin < 9 * 60) return 4;  // 진
  if (totalMin >= 9 * 60 && totalMin < 11 * 60) return 5; // 사
  if (totalMin >= 11 * 60 && totalMin < 13 * 60) return 6; // 오
  if (totalMin >= 13 * 60 && totalMin < 15 * 60) return 7; // 미
  if (totalMin >= 15 * 60 && totalMin < 17 * 60) return 8; // 신
  if (totalMin >= 17 * 60 && totalMin < 19 * 60) return 9; // 유
  if (totalMin >= 19 * 60 && totalMin < 21 * 60) return 10; // 술
  return 11; // 해
};

// 양/음력 변환을 포함하여 iztro 명반 가져오기
export const getZimidusuChart = (
  birthDate: string,
  birthTime: string,
  gender: 'male' | 'female',
  calendarType: 'solar' | 'lunar'
) => {
  try {
    let targetSolarDate = birthDate;

    // 만약 음력이면 lunar-javascript를 이용해 양력 날짜로 선행 변환 수행
    if (calendarType === 'lunar') {
      const parts = birthDate.split('-');
      const y = Number(parts[0]);
      const m = Number(parts[1]);
      const d = Number(parts[2]);
      
      const lunar = (Lunar as any).fromYmd(y, m, d);
      const solar = lunar.getSolar();
      targetSolarDate = `${solar.getYear()}-${String(solar.getMonth()).padStart(2, '0')}-${String(solar.getDay()).padStart(2, '0')}`;
    }

    const timeIdx = getTimeHourIndex(birthTime);
    
    // iztro 라이브러리로 초정밀 명반 계산
    const chart = astro.bySolar(targetSolarDate, timeIdx, gender, true, 'ko-KR');
    return chart;
  } catch (error) {
    console.error('Error generating Zimidusu Chart:', error);
    return null;
  }
};

// 12궁 현대 심리학적 멘탈코칭 은유 풀이 상수
export const PALACE_COACHING_META: Record<string, { title: string; desc: string; mscQuote: string }> = {
  '명': {
    title: '🔮 내 영혼의 씨앗이자 인생의 돛대 (명궁 - 命宮)',
    desc: '이번 생이라는 드넓은 바다를 항해할 때 내 영혼에 새겨진 고유한 성정과 나침반입니다. 내가 나 자신을 바라보고, 세상을 헤쳐 나가는 진짜 나다움의 뼈대입니다.',
    mscQuote: '내가 어떤 행동을 취하든, 그것은 거친 바람 속에서 스스로를 안전하게 지키기 위해 내 영혼이 선택한 최선의 노력이었습니다. 참 애썼습니다.'
  },
  '형제': {
    title: '🤝 인생길을 함께 걷는 다정한 길벗들 (형제궁 - 兄弟宮)',
    desc: '인생의 여정에서 만나는 동료, 형제, 그리고 마음을 나누는 친구들과 맺는 따뜻한 소통 방식입니다. 서로 어깨를 기대며 나누는 우정의 온도를 나타냅니다.',
    mscQuote: '관계의 작은 서툶과 삐걱임 속에서도, 내 마음속 깊은 곳에는 타인과 따뜻하게 손잡고 연대할 수 있는 다정한 시냇물이 유유히 흐르고 있습니다.'
  },
  '부처': {
    title: '🪞 내 마음을 깊게 비추는 비밀 거울 (부처궁 - 夫妻宮)',
    desc: '가장 가까운 반려자나 깊은 인연을 통해, 내 마음속 깊이 숨겨진 그리움과 결핍을 비추어주는 심리의 거울방입니다. 상대를 통해 나를 이해하는 공간입니다.',
    mscQuote: '사랑하는 이에게 완벽함을 바랐던 내 안의 여린 두려움을 따뜻하게 알아채고, 오늘부터는 내가 나에게 먼저 가장 든든한 그늘막이 되어 주겠습니다.'
  },
  '자녀': {
    title: '🌱 내 무의식의 정원에 돋아나는 새싹 (자녀궁 - 子女宮)',
    desc: '세상에 태어날 사랑스런 아이뿐만 아니라, 내 내면에서 샘솟는 창조적 영감, 예술적 불꽃, 그리고 세상에 남기고 싶은 나의 꿈들을 싹틔우는 정원입니다.',
    mscQuote: '당장 눈부신 꽃을 피우지 못하더라도, 내 내면의 밭에서 자라나는 모든 생각과 도전은 이미 그 자체로 숨 쉬는 생명입니다.'
  },
  '재백': {
    title: '🌊 내 삶에 유유히 흐르는 풍요의 시냇물 (재백궁 - 財帛宮)',
    desc: '물리적인 세상에서 자원과 돈이라는 생명수를 끌어당기고 아름답게 순환시키는 나의 행동 방식입니다. 삶의 풍요를 조율하는 흐름의 전압을 뜻합니다.',
    mscQuote: '통장에 찍히는 숫자나 소유한 물질에 내 존엄한 가치를 얽매지 마세요. 당신이라는 존재는 이미 값을 매길 수 없는 소중한 우주입니다.'
  },
  '질액': {
    title: '🚦 아바타의 몸이 보내는 소중한 신호등 (질액궁 - 疾厄宮)',
    desc: '마음의 억눌린 피로와 눈물이 육체라는 고마운 집을 통해 보내는 신호(통증, 피로)입니다. 나를 보호하기 위해 몸이 켜는 비상등과 같습니다.',
    mscQuote: '몸이 무겁거나 아파올 때, 스스로를 다그치는 대신 가슴을 쓸어내리며 속삭여 주세요. "그동안 무거운 짐을 지고 버텨내느라 정말 고생 많았어."'
  },
  '천이': {
    title: '🧭 새로운 세상을 향해 나아가는 나침반 (천이궁 - 遷移宮)',
    desc: '익숙한 집을 떠나 새로운 타지나 낯선 환경, 혹은 사회적인 관계 속으로 도약할 때 나를 지켜주는 여행자의 용기이자 대외적인 사회적 모습입니다.',
    mscQuote: '낯선 길 위에서 조금 헤매거나 외로움을 느끼더라도 괜찮습니다. 내면의 고요한 나침반은 언제나 가장 알맞은 방향을 든든하게 비추고 있습니다.'
  },
  '노복': {
    title: '🕸️ 광활한 세상에서 맺는 인연의 그물망 (노복궁 - 奴僕宮)',
    desc: '사회라는 커다란 무대에서 만나는 수많은 인맥, 동료, 대중과의 상호작용 방식입니다. 혼자가 아니라 더불어 살아가는 세상의 연결 고리를 보여줍니다.',
    mscQuote: '모든 무거운 짐을 홀로 짊어지려 애쓰지 마세요. 가끔은 다른 이들의 다정한 호의에 내 등을 기댄 채 함께 노를 젓는 편안함을 허락해 줍니다.'
  },
  '관록': {
    title: '🌳 내 재능이 꽃을 피우는 배움의 숲 (관록궁 - 官祿宮)',
    desc: '내 창조적 재능과 노력을 직업, 공부, 삶의 과업에 쏟아부어 가치 있는 열매를 맺게 하는 일터입니다. 내 행동력이 가장 역동적으로 숨 쉬는 곳입니다.',
    mscQuote: '쉼 없이 달리고 증명해내지 않아도 좋습니다. 아무런 과업 없이 가만히 숨 쉬며 나를 비워두는 휴식 또한 삶을 채우는 위대한 배움입니다.'
  },
  '전택': {
    title: '🏡 지친 날개를 접고 쉬는 따뜻한 보금자리 (전택궁 - 田宅宮)',
    desc: '거친 세상의 소음을 벗어나 내 영혼의 배터리를 아늑하게 충전하는 공간입니다. 가정, 내 방, 그리고 고요하게 지켜지는 나만의 마음 영토를 의미합니다.',
    mscQuote: '세상이 문밖에서 세차게 흔들리고 요동칠지라도, 내 마음의 깊은 방은 언제나 따뜻하고 고요하게 당신을 온전히 품어주고 있습니다.'
  },
  '복덕': {
    title: '⛲ 내면 깊은 곳에서 솟는 평화의 샘물 (복덕궁 - 福德宮)',
    desc: '보이지 않는 정신적 기쁨과 행복을 느끼는 무의식의 힐링 안방입니다. 사색과 휴식, 그리고 나를 무조건적으로 안아주는 내적인 안식처입니다.',
    mscQuote: '밀려오는 불안의 파도에 영혼의 바다를 흐리지 마세요. 바다 가장 깊은 곳은 언제나 얼어붙지 않는 따뜻한 고요함으로 채워져 있습니다.'
  },
  '부모': {
    title: '☔ 비바람을 막아주던 내 인생의 첫 우산 (부모궁 - 父母宮)',
    desc: '내가 태어난 근원이자 나를 지탱해주던 윗사람, 수호자, 국가나 시스템의 넓은 우산입니다. 보호받고 자라난 내 삶의 뿌리이자 뼈대입니다.',
    mscQuote: '뿌리에서 입었던 오랜 상처가 있을지라도, 이제는 내 손으로 내 마음에 더욱 크고 울창한 나무를 심어 세상을 다정하게 품어주면 됩니다.'
  }
};

// 14주성 별 현대 심리학적 시적 은유 상수
export const STAR_COACHING_META: Record<string, { label: string; metaphor: string; coachMsg: string }> = {
  '자미': {
    label: '자미성 (紫微星)',
    metaphor: '내면의 존엄을 지켜주는 든든한 왕관 👑',
    coachMsg: '어떤 비바람에도 흔들리지 않는 내 안의 고귀한 자존감 엔진입니다. 내 삶의 주권과 품위를 단단하고 아름답게 수호해 줍니다.'
  },
  '천기': {
    label: '천기성 (天機星)',
    metaphor: '번뜩이는 생각의 실타래와 지혜의 열쇠 🧠',
    coachMsg: '빠르고 정밀한 지혜와 아이디어로 삶의 파도를 넘어서는 브레인입니다. 다만 생각의 바퀴를 잠시 멈추고 뇌에 다정한 쉼표를 찍어주는 것도 필요합니다.'
  },
  '태양': {
    label: '태양성 (太陽星)',
    metaphor: '주위를 아낌없이 따뜻하게 비추는 아침 햇살 ☀️',
    coachMsg: '세상을 밝게 비추고 이웃을 돌보는 찬란한 열정입니다. 남들에게 빛을 내어주느라 내 여린 마음이 까맣게 타버리지 않도록 스스로에게 먼저 햇살을 양보하세요.'
  },
  '무곡': {
    label: '무곡성 (武曲星)',
    metaphor: '우직하게 현실의 과실을 맺는 든든한 강철 망치 🔨',
    coachMsg: '흔들림 없이 맡은 바 가치와 현실의 성과를 일구어내는 곧은 성실함입니다. 강한 껍데기 속에 감춰진 고독감과 부드러운 속살을 따뜻하게 안아주세요.'
  },
  '천동': {
    label: '천동성 (天同星)',
    metaphor: '맑은 웃음을 간직한 내 안의 순수한 어린아이 🎈',
    coachMsg: '삶의 긴장을 허물고 소박한 기쁨과 평화를 누리게 하는 힐러의 마음입니다. 만사 귀찮음이 밀려올 때는 나를 비난하지 말고 손을 꼭 쥐며 다독여 주세요.'
  },
  '염정': {
    label: '염정성 (廉貞星)',
    metaphor: '가슴 깊숙이 타오르는 매혹적인 붉은 불꽃 🔥',
    coachMsg: '강렬한 집중력과 타협 없는 의리, 예술적 카리스마입니다. 마음속 불꽃이 너무 뜨겁게 치솟아 아플 때는 가만히 깊은숨을 내쉬며 열기를 가라앉혀 줍니다.'
  },
  '천부': {
    label: '천부성 (天府星)',
    metaphor: '소중한 것들을 고이 보관하는 대지의 든든한 곳간 🌾',
    coachMsg: '세상의 소란스러움을 드넓게 포용하며 안전하게 삶의 기반을 축적하는 넉넉한 마음입니다. 굳건한 안정감으로 내 주변을 편안하게 지탱해 줍니다.'
  },
  '태음': {
    label: '태음성 (太陰星)',
    metaphor: '고요한 밤바다를 부드럽게 비추는 은은한 달빛 🌙',
    coachMsg: '섬세한 감수성과 사색, 말없이 타인을 보듬어주는 촉촉한 사랑의 기운입니다. 어둠 속에서 지친 나를 고요하게 어루만져 정화하는 힘을 품고 있습니다.'
  },
  '탐랑': {
    label: '탐랑성 (貪狼星)',
    metaphor: '세상을 설레는 마음으로 탐색하는 호기심 많은 탐험가 🗺️',
    coachMsg: '지루한 일상에 오색 빛깔의 즐거움과 활기를 불어넣는 호기심과 매력입니다. 한 번에 너무 많은 보물지도를 보느라 길을 잃지 않도록 중심을 잘 잡아주세요.'
  },
  '거문': {
    label: '거문성 (巨門星)',
    metaphor: '보이지 않는 진실을 집요하게 비추는 돋보기 🔍',
    coachMsg: '어둠 속의 맹점을 찾아내고 잘못된 것을 바로잡는 예리한 안목과 비평 능력입니다. 거친 칼날 같은 말과 의심으로 스스로를 다치게 하지 않도록 지켜주세요.'
  },
  '천상': {
    label: '천상성 (天相星)',
    metaphor: '갈등을 둥글게 녹여 평화를 조율하는 천사 조율기 ⚖️',
    coachMsg: '타인과의 신뢰를 지키고 분쟁을 지혜롭게 버무리는 다정하고 헌신적인 수호 장치입니다. 남들을 조화롭게 만드느라 나의 소중한 기준을 잃지 않도록 하세요.'
  },
  '천량': {
    label: '천량성 (天梁星)',
    metaphor: '지친 이들을 말없이 안아주는 의젓한 아름드리 큰 나무 🌳',
    coachMsg: '세상의 거친 풍파 속에서 어른스러운 지혜와 든든한 버팀목이 되어주는 기운입니다. 혼자 모든 무거운 짐을 다 짊어지려고 굳어버린 어깨를 다정히 토닥여 줍니다.'
  },
  '칠살': {
    label: '칠살성 (七殺星)',
    metaphor: '거친 풀숲을 베어내고 새 길을 여는 용감한 선구자의 칼 ⚔️',
    coachMsg: '장애물을 뚫고 주체적인 성장을 향해 나아가는 거침없는 용기와 결단력입니다. 뜨거운 싸움 뒤에 홀로 남겨진 외로운 전사 같은 나를 다스려 안아주세요.'
  },
  '파군': {
    label: '파군성 (破軍星)',
    metaphor: '낡은 껍질을 깨고 대지 위로 쏟아지는 봄비의 혁신 ⚡',
    coachMsg: '관습에 얽매이지 않고 새로운 돌파구를 향해 판을 새롭게 그리는 위대한 변화의 에너지입니다. 급격한 파도 뒤에 밀려드는 상실감 또한 다정하게 감싸 안아 줍니다.'
  }
};

// 사화(化) 현대 심리학적 은유 해설
export const MUTAGEN_COACHING: Record<string, { label: string; meaning: string; advice: string }> = {
  '록': {
    label: '화록(化祿) - 맑게 샘솟는 축복의 샘물',
    meaning: '이 궁에 기쁨, 풍요, 그리고 부드러운 가치 순환의 통로가 시원하게 열렸음을 의미합니다.',
    advice: '이 부분에는 우주가 이미 당신을 위해 준비해 둔 따뜻한 선물이 있으니, 긴장하지 말고 그 풍요를 편안히 누리며 주변과 나누어 보세요.'
  },
  '권': {
    label: '화권(化權) - 주권을 쥐고 나아가는 핸들',
    meaning: '이 영역을 내가 직접 책임지고, 주도적으로 통제하며 이끌어가려는 건강한 실행력의 전압입니다.',
    advice: '삶을 끌고 가는 훌륭한 엔진이지만, 모든 것을 완벽히 통제하려다 내 어깨와 마음이 굳어지지 않도록 긴장의 전압을 살짝 풀어주셔도 안전합니다.'
  },
  '과': {
    label: '화과(化科) - 나를 따뜻하게 수호하는 은은한 달빛',
    meaning: '나의 명예로운 가치를 돋보이게 하고, 세련되고 부드러운 소통으로 신뢰를 얻는 조화로운 주파수입니다.',
    advice: '불안과 장벽이 가로막을 때, 이 부드럽고 다정한 우아함의 안테나를 켜서 둥글둥글하고 지혜롭게 매듭을 풀어 가세요.'
  },
  '기': {
    label: '화기(化忌) - 진정한 진주를 빚기 위해 선물된 조개 안의 모래알',
    meaning: '나도 모르게 집착하고, 결핍감을 느끼며 두려워하여 나를 서글프게 다그치는 인생 최대의 디버깅 퀘스트입니다.',
    advice: '화기는 우주의 벌이 결코 아닙니다. 조개가 상처 입은 살 속에 모래알을 품어 영롱한 진주를 빚어내듯, 그 결핍을 자각으로 보듬어 안을 때 이 화기는 세상에서 가장 찬란한 당신만의 무기가 됩니다.'
  }
};

// 자미두수 특정 궁위의 에세이를 생성하는 헬퍼 함수
export const getZimidusuPalaceEssay = (palaceData: any, userName: string = '회원', dayMaster: string = '신') => {
  const baseName = userName.endsWith('님') ? userName.slice(0, -1) : userName;
  const name = `${baseName}님`;
  const nameJosa = `${baseName}님의`;

  const palaceMeta = PALACE_COACHING_META[palaceData.name] || {
    title: `✨ ${palaceData.name}궁의 아름다운 무대`,
    desc: '내 내면 지도에 소중하게 펼쳐진 특별한 마음 공간입니다.',
    mscQuote: '내 안에 숨 쉬고 있는 고유한 기운들은 언제나 나를 가장 이롭게 지키기 위해 애써왔습니다.'
  };

  // 주성 정보 조합
  const starsList = palaceData.majorStars || [];
  let starMetaphor = '영혼의 다채로운 별빛들이 잔잔하게 공명하고 있습니다. 🌌';
  let starCoach = '이 궁은 고유하게 맑고 넓게 비어 있어서, 마주 보는 대궁의 좋은 기운을 투명하게 흡수하여 내 지혜로 부릴 수 있는 특별한 백지장 같은 축복을 받았습니다.';

  if (starsList.length > 0) {
    const starNames = starsList.map((s: any) => s.name);
    const starInfos = starNames.map((n: string) => STAR_COACHING_META[n]).filter(Boolean);
    
    if (starInfos.length > 0) {
      starMetaphor = starInfos.map((info: any) => `[${info.label}: ${info.metaphor}]`).join(' & ');
      starCoach = starInfos.map((info: any) => `• ${info.coachMsg}`).join('\n\n');
    }
  }

  // 보좌/살성에 묻은 사화(mutagen) 또는 궁 자체의 사화 분석
  const allStars = [...(palaceData.majorStars || []), ...(palaceData.minorStars || []), ...(palaceData.adjectiveStars || [])];
  const mutagenStar = allStars.find((s: any) => s.mutagen);
  
  let mutagenDesc = '이 영역에는 특이한 감정의 쏠림 없이 평화롭고 고요한 평시 상태가 유지되고 있습니다.';
  if (mutagenStar) {
    const mut = MUTAGEN_COACHING[mutagenStar.mutagen];
    if (mut) {
      mutagenDesc = `현재 이 궁에는 [${mutagenStar.name}]의 기운 위에 **${mut.label}**이 조화롭게 작동 중입니다.\n\n* **마음의 작동 원리:** ${mut.meaning}\n* **다정한 멘탈 솔루션:** ${mut.advice}`;
    }
  }

  return {
    title: palaceMeta.title,
    subtitle: `${palaceData.heavenlyStem}${palaceData.earthlyBranch}궁 좌표`,
    typeDesc: palaceMeta.desc,
    starMetaphor,
    starCoach,
    mutagenDesc,
    finalMsg: palaceMeta.mscQuote.replace(/\${name}/g, name).replace(/\${nameJosa}/g, nameJosa)
  };
};

// 명리 사주와 자미두수 명반을 결합하여 AI의 시각으로 영혼을 디버깅해주는 크로스오버 분석 리포트 생성
export const getAiCrossoverReport = (sajuData: any, zimidusuChart: any, userName: string = '회원') => {
  if (!sajuData || !zimidusuChart) return null;

  const baseName = userName.endsWith('님') ? userName.slice(0, -1) : userName;
  const name = `${baseName}님`;
  const nameJosa = `${baseName}님의`;

  // 1. 사주 요인 분석
  const dayMaster = sajuData.day.gan.char;
  const dayMasterName = dayMaster === '신' ? '신금(辛金)' : `${dayMaster}금`;
  
  // 2. 자미두수 요인 분석 (명궁 찾기)
  const palaces = zimidusuChart.palaces || [];
  const myeongPalace = palaces.find((p: any) => p.name === '명' || p.name.includes('명'));
  const myeongStars = myeongPalace ? (myeongPalace.majorStars || []).map((s: any) => s.name) : [];

  let crossEssay = '';
  let crossTitle = `✨ ${name}을 향한 [사주 × 자미두수] AI 영혼의 시 융합 리포트`;

  if (dayMaster === '신') {
    crossEssay = `고결하고 투명하게 빛나는 다이아몬드 보석인 **${dayMasterName} 일간**의 기운과, `;
    if (myeongStars.includes('자미') || myeongStars.includes('천부')) {
      crossEssay += `내면의 드넓은 품격과 풍요로운 대지를 수호하는 **자미/천부** 명궁의 우주적 나침반이 만났습니다. \n\n이 융합은 대단히 우아하고 결점 없는 삶을 지향하는 섬세한 구조를 뜻합니다. 현실이 조금 어지럽거나 완벽하지 않을 때 내면에 자가 검열 장치가 켜지기 쉽지만, 이는 당신이 세상에 맑고 고귀한 질서를 수립하기 위해 품고 태어난 눈부신 주파수입니다. 그 예리함으로 나와 상대를 아프게 찌르지 않고, 먼저 내 마음의 불완전함을 있는 그대로 다정하게 안아주는 봄 햇살의 지혜를 가동해 보세요.`;
    } else if (myeongStars.includes('태음') || myeongStars.includes('천동')) {
      crossEssay += `고요한 밤하늘의 부드러운 달빛과 맑은 웃음을 간직한 **태음/천동** 명궁의 우주적 나침반이 만났습니다. \n\n이 융합은 단단하게 정제된 보석의 내면에 맑고 여린 감수성과 따뜻한 물길이 찰랑이며 흐르고 있음을 뜻합니다. 겉보기에는 단호하고 이성적으로 비칠지라도, 내면은 누구보다 쉽게 눈물짓고 아파하는 여린 꽃잎을 품고 있습니다. 상처받지 않기 위해 마음의 방패를 켰던 나를 미워하지 마시고, 그 풍부한 감성 자체를 세상을 따뜻하게 적시는 치유와 예술적 영감의 맑은 시냇물로 흘려보내 주세요.`;
    } else {
      crossEssay += `자신만의 독창적이고 소중한 삶의 궤적을 그려 나가는 자미두수 명궁의 기운이 결합되었습니다. \n\n단단한 다이아몬드의 본질이 우주의 따뜻한 별빛들과 어우러져, 요란한 세상 속에서도 묵묵히 보석 같은 진짜 가치를 판별해내는 훌륭한 아키텍처를 이루고 있습니다. 내가 완벽하지 않아도 늘 안전하고 사랑받을 가치가 충분함을 매 순간 내 마음에 안심하듯 속삭여 주십시오.`;
    }
  } else {
    // 디폴트 교차 분석
    crossEssay = `${nameJosa} 사주 일간인 **${dayMaster}**의 푸르른 생명력과, 자미두수의 고유한 나침반인 **명궁**의 기운이 융합되어 세상에 단 하나뿐인 아름다운 주파수를 연주하고 있습니다. \n\n두 운명의 지도가 교차하는 지점에서 당신에게 건네는 단 하나의 치유 메시지는 '나를 향한 가혹한 채찍질을 멈추고, 우주가 나를 있는 그대로 무한히 사랑하고 있음을 신뢰하는 것'입니다. 낡은 방어 기제에 씌워둔 빗장을 풀고, 오늘 내 존재 자체를 마음껏 칭찬하며 삶이라는 모험을 다정하게 가로질러 나아가십시오.`;
  }

  // 10년 대한 연령대 분석 구하기 (명궁 기준 대한 연령대)
  let decadalRange = myeongPalace ? myeongPalace.decadal.range : [10, 19];

  return {
    title: crossTitle,
    summary: `사주의 주파수와 자미두수 명궁의 우주적 나침반을 융합 연산하여 내면의 상처를 따뜻하게 치유합니다.`,
    crossoverDetail: crossEssay,
    activeDecade: `${decadalRange[0]}세 ~ ${decadalRange[1]}세 대한(大限) 흐름`,
    briefing: `두 개의 정밀한 하늘의 지도가 한목소리로 일러주는 치유의 열쇠는 간단합니다. 그동안 나의 유능함과 완벽함을 세상에 증명해 보이느라 온몸의 전압을 소진한 채 애써 온 나를 향해, 비난 대신 한없는 너그러움과 연민을 가득 덮어주는 것입니다. 당신은 존재 자체로 이미 한없이 거룩하고 온전합니다.`
  };
};
