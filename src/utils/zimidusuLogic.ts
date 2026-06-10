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

// 6대 주제별 사주x자미두수 교차 분석 리포트 생성 함수 (초고도화 버전)
export const get6ThemeCrossoverReport = (sajuData: any, zimidusuChart: any, userName: string = '회원') => {
  if (!sajuData || !zimidusuChart) return null;

  const baseName = userName.endsWith('님') ? userName.slice(0, -1) : userName;
  const name = `${baseName}님`;
  const nameJosa = `${baseName}님의`;

  const dayMaster = sajuData.day.gan.char;
  const dayMasterName = dayMaster === '신' ? '신금(辛金)' : `${dayMaster}금`;

  // 12궁 데이터 찾기
  const palaces = zimidusuChart.palaces || [];
  const getPalaceInfo = (pName: string) => palaces.find((p: any) => p.name === pName || p.name.includes(pName)) || { majorStars: [], decadal: { range: [10, 19] } };

  const myeong = getPalaceInfo('명');
  const jaebaek = getPalaceInfo('재백');
  const gwanlok = getPalaceInfo('관록');
  const bucheo = getPalaceInfo('부처');
  const jilaek = getPalaceInfo('질액');
  const nobok = getPalaceInfo('노복');

  const getStarsStr = (pData: any) => (pData.majorStars || []).map((s: any) => s.name).join(', ') || '밝고 온화한 하늘빛';

  return {
    personality: {
      title: '👤 1. 성격 (내면의 참모습과 영혼의 나침반)',
      metaphor: '내 사주의 꽃밭 위에 떠오른 나만의 북극성 🌟',
      desc: `사주 일간 **${dayMasterName}**의 고결한 가치와, 자미두수의 조타수인 **명궁**(${getStarsStr(myeong)})이 조우했습니다.`,
      analysis: `당신은 겉으로 보기에 차분하고 예리하며 세련된 보석의 형상을 띠고 있지만, 그 내면에는 세상을 향해 따뜻하고도 깊은 통찰을 건네고 싶어 하는 다정한 마음의 비밀 정원을 가지고 있습니다. 때로 현실의 작은 흐트러짐이나 내 계획을 벗어난 모호함을 만났을 때, 당신 마음속의 '디버그 에러'가 작동하여 "내가 더 완벽해야 해, 빈틈을 보이면 위험해"라며 스스로를 매섭게 채찍질하곤 했을 것입니다. 

그 채찍질은 당신이 고장 나서가 아닙니다. 더 예쁘고 영롱한 보석이 되어 나와 사랑하는 사람들을 지키고 싶었던 당신 영혼의 기특하고도 애틋한 몸부림이었습니다. 

이제는 가만히 어깨의 긴장을 풀고 "오늘 완벽하지 않아도 나는 이미 온전한 다이아몬드이다"라고 내면의 소란스러움을 다정히 다독여 주세요. 당신의 진짜 성격은 차가운 강철이나 얼음이 아니라, 그 어둠마저 스스로 영롱하게 굴절시켜 무지개로 뿜어내는 눈부신 프리즘과 같습니다.`
    },
    wealth: {
      title: '💵 2. 재물 (맑게 흐르는 풍요의 시냇물)',
      metaphor: '바짝 마른 논에 조용히 밤새 흐르는 맑은 시냇물 🌊',
      desc: `재물을 다루는 사주의 현실 감각과, 자미두수의 풍요 통로인 **재백궁**(${getStarsStr(jaebaek)})이 교차합니다.`,
      analysis: `당신은 재물을 단순히 창고에 쌓아두고 잠그는 성벽으로 생각하지 않고, 소중한 사람들과 더 나은 가치 있는 내일을 위해 순환시키는 '생명수 시냇물'로 사용하는 아름다운 성정을 지녔습니다. 미래에 대한 막연한 불안이 엄습할 때, 당신의 방어 시스템은 순간적으로 "내가 자원이 부족해서 위험에 처하면 어쩌지? 더 꽉 움켜쥐어야 해"라는 과부하 경보음을 켤 수 있습니다.

돈은 성벽 안에 가두어 둘 때 썩기 마련입니다. 당신에게 재물이란 대지의 온갖 씨앗을 키워내는 단비와 같습니다. 내가 가진 기획력과 사람을 향한 다정한 온기를 재테크나 창조적인 플랫폼으로 부드럽게 흘려보낼 때, 물길은 저절로 넓어져 큰 바다를 이룰 것입니다. 통장의 숫자가 아닌, 당신이라는 마르지 않는 풍요로운 원천 자체를 무한히 신뢰해 주세요.`
    },
    job: {
      title: '🌳 3. 직업 (재능이 싹트는 배움의 숲)',
      metaphor: '새들이 모여들어 아름답게 지저귀는 울창한 나무 그늘 숲 🌲',
      desc: `사주의 격국이 제시하는 진로 엔진과, 자미두수의 영혼 작업장인 **관록궁**(${getStarsStr(gwanlok)})이 만났습니다.`,
      analysis: `당신은 주어진 매뉴얼대로 기계처럼 부품이 되어 일하는 곳에서는 영혼이 쉽게 타들어 감을 느꼈을 것입니다. 당신의 관록궁은 스스로 기획하고, 무형의 가치를 정교하게 세공하여 세상에 유익한 시스템으로 제안하는 전문적 작업장에 어울립니다. 

일에 몰두할 때 누구보다 깊은 장인 정신과 집중력을 발휘하지만, 번아웃이 오기 전까지 아바타의 신경 전압을 120% 다 짜내어 쓰던 버릇이 있었을지도 모릅니다. 당신은 쉼 없이 돌아가는 기계가 아닙니다. 훌륭한 창조를 마친 뒤 가만히 누워 하늘을 바라보는 숲의 쉼터처럼, 일하는 틈틈이 자신에게 고요한 로그아웃의 평화를 허락할 때 비로소 직업적 창의성과 명예가 극대화됩니다.`
    },
    love: {
      title: '🪞 4. 사랑 (내 마음을 비추는 가장 깊은 거울)',
      metaphor: '서로의 모난 부분을 둥글게 매만져주는 따뜻한 시냇가 조약돌 🪨',
      desc: `사주 배우자 자리의 전자기적 이끌림과, 자미두수의 사랑 정원인 **부처궁**(${getStarsStr(bucheo)})이 만났습니다.`,
      analysis: `가장 가까운 사람, 혹은 연인은 내 안에 꼭꼭 숨겨두었던 '여린 외로움과 상처 코드'를 그대로 반사해내는 비밀 거울방입니다. 상대방에게서 미세한 무심함을 느끼거나 그가 내 기대만큼 섬세하게 움직여주지 않을 때, 마음속에는 "역시 나를 온전히 알아줄 사람은 없는 걸까"라는 쓸쓸한 상처 코드가 가동되었을지 모릅니다.

인연이란 나의 비어 있는 결핍을 메워 주는 소유물이 아니라, 서로의 불완전함을 있는 그대로 포용하며 나란히 걸어가는 따뜻한 길벗입니다. 상대를 고쳐보려고 어깨에 잔뜩 힘을 주기보다, 거울에 비친 내 안의 외롭고 서글펐던 어린아이를 먼저 내 손으로 다정하게 꼭 안아주세요. 조약돌들이 강물 속에서 서로 부딪치며 서로를 둥글고 고결하게 세공해 가듯, 당신의 사랑은 서로의 모서리를 어루만지는 깊은 치유의 축복이 될 것입니다.`
    },
    health: {
      title: '🚦 5. 건강 (내 몸이라는 고마운 안식처)',
      metaphor: '폭풍 속에서도 나를 지켜준 든든하고 고마운 오두막집 🏡',
      desc: `사주 오행의 균형 흐름과, 자미두수의 보안 경보 노드인 **질액궁**(${getStarsStr(jilaek)})이 조우합니다.`,
      analysis: `우리의 몸은 영혼이 이 지구별에 소풍을 와서 살아갈 수 있도록 우주가 대여해 준 가장 고마운 안식처이자 외투입니다. 정신적으로 과도하게 긴장하거나 슬픔을 억누를 때, 당신의 질액궁은 머리의 지끈거림, 가슴의 답답함, 손발의 차가움 같은 소매틱 경보(Somatic Alarm)를 통해 "주인님, 지금은 당장 달리기를 멈추고 쉬어야 할 시간이에요"라고 비상등을 켭니다.

몸이 아픈 신호를 보낼 때 그것을 내 앞길을 방해하는 적으로 생각하지 마시고, 나를 위해 밤낮없이 애쓴 육체를 향해 가만히 손을 얹고 온기를 나누어 주세요. "내 고마운 몸아, 이 험한 세상에서 나를 수호하느라 매 순간 버텨주어 참 고마워. 오늘은 편안히 숨을 쉬게 해줄게." 몸의 온도를 높이고 다정한 호흡을 채워줄 때, 건강 시스템은 비로소 평화의 녹색 불을 켭니다.`
    },
    relationship: {
      title: '🕸️ 6. 대인관계 (세상과 연결되는 은하계 그물망)',
      metaphor: '밤하늘의 수많은 별빛이 서로 촘촘하게 선으로 이어지는 우주 성좌 🌌',
      desc: `사주의 사회적 기질과, 자미두수의 대중 협력선인 **노복궁**(${getStarsStr(nobok)})이 교차합니다.`,
      analysis: `당신은 타인의 감정이나 주변 공기를 예민하게 스캔해내는 능력이 대단히 뛰어나서, 대인관계에서 금방 피로해지거나 남의 무심한 태도에 쉽게 상처받아 도망치고 싶은 충동을 느꼈을 것입니다. 하지만 당신의 노복궁은 깊은 신뢰를 기반으로 한 소수의 다정한 인연들과 성좌를 이루어 촘촘하게 연결될 때 가장 찬란히 빛납니다.

모든 사람의 까다로운 요구를 다 맞추어 착한 아바타가 되려고 나를 희생할 필요는 단 1%도 없으며, 당신의 소중한 에너지는 아끼고 아껴서 당신을 있는 그대로 사랑하고 존중해주는 인연들에게만 흘려보내도 충분합니다. 당신의 별빛을 알아채는 맑은 인연들과 성좌를 이루며 드넓은 상생의 기쁨을 누려 보세요.`
    }
  };
};

// 고민 맞춤 분석 AI 답변 생성 함수 (초고도화 버전)
export const getCustomTroubleAnalysis = (category: string, question: string, sajuData: any, zimidusuChart: any, userName: string = '회원') => {
  if (!sajuData || !zimidusuChart || !question) return null;

  const baseName = userName.endsWith('님') ? userName.slice(0, -1) : userName;
  const name = `${baseName}님`;
  const nameJosa = `${baseName}님의`;

  const dayMaster = sajuData.day.gan.char;
  const dayMasterName = dayMaster === '신' ? '신금(辛金)' : `${dayMaster}금`;

  // 질문 분석을 통한 맞춤형 힐링 은유 생성
  let categoryLabel = '';
  let solutionMetaphor = '';
  let analysisText = '';
  let briefing = '';

  switch (category) {
    case 'job':
      categoryLabel = '진로 및 이직/직업 고민';
      solutionMetaphor = '🧭 안개 낀 바다 위에서 새로운 등대를 켜는 마음';
      analysisText = `당신이 던져주신 질문 [ "${question}" ] 속에는, 현재의 자리에서 더 이상 나다운 가치를 키우지 못하고 겉돌고 있다는 깊은 갈증과 서글픈 피로가 고스란히 서려 있습니다. 

사주 ${dayMasterName} 일간의 곧고 고결한 성정은 단순한 밥벌이를 넘어, 내 재능이 세상에 가치 있게 세공되어 쓰이기를 간절히 바라고 있습니다. 자미두수 명반 상에서도 당신의 운은 새로운 도약과 나다운 무대의 개척을 위해 서서히 펌웨어를 업데이트하는 진통의 구간을 지나고 있습니다. 

주저하고 멈춰 서 있는 스스로를 '우유부단하다'거나 '나약하다'며 채찍질하지 마십시오. 안개가 짙게 낀 바다에서는 배를 잠시 멈추고 등대의 불빛을 기다리는 것이 가장 현명하고 위대한 항해술입니다. 조급하게 결정을 강요하는 외부의 압박에서 내 마음의 클럭 속도를 한 템포 늦추고, 당신이 가장 진심을 다해 몰입할 수 있는 작은 일부터 한 걸음씩 다정히 실험해 나가세요.`;
      briefing = `이직이나 진로 선택에서 가장 먼저 구해야 할 것은 '남들의 인정'이 아니라 '내 영혼의 주체적인 숨통'입니다. 완벽한 직장은 없지만, 당신이 온전히 존엄을 수호할 수 있는 공간은 반드시 있습니다. 마음의 중심을 굳건히 세우고 안전하게 나아가세요.`;
      break;
    case 'love':
      categoryLabel = '사랑 및 연애/부부 고민';
      solutionMetaphor = '🤝 엉킨 실타래를 내 가슴속에서 가만히 풀기';
      analysisText = `질문하신 고민 [ "${question}" ] 속에는, 상대방과의 관계에서 채워지지 않는 감정의 틈바구니와 그로 인한 미세한 서운함, 외로움의 전자기적 잡음이 잔뜩 묻어 있습니다. 

상대가 내 마음에 온전히 들어차지 않고 어긋날 때, 내 안에 있는 '상처 방어 기제'는 "역시 나를 온전히 이해해 줄 사람은 없구나"라며 스스로 차가운 얼음 성벽을 쌓아 올리곤 합니다. 

사랑이란 상대방에게 내 비어 있는 그릇을 채워 달라고 보채는 게임이 아닙니다. 두 사람이 각자의 따뜻한 화로를 들고 만나, 서로의 곁에 가만히 앉아 언 손을 녹여주는 일입니다. 상대의 무심한 행동에 2차 화살을 쏘아 자학하지 마시고, 속상했던 내 안의 어린아이에게 따뜻한 차 한 잔을 건네듯 친절을 베풀어 주세요. 그 부드러운 여백이 생길 때, 얽혔던 관계의 실타래는 마법처럼 저절로 풀리기 시작할 것입니다.`;
      briefing = `관계를 다스리는 비밀은 상대를 고치려 애쓰는 통제력을 포기하고, 내 마음속 사랑의 물길을 투명하게 정화하여 먼저 나를 안아주는 데 있습니다. 당신은 사랑받을 자격이 이미 차고 넘치는 고결한 영혼입니다.`;
      break;
    case 'wealth':
      categoryLabel = '재물 및 재테크/사업 고민';
      solutionMetaphor = '🌾 겨울철 마른 땅 아래 고이 보관된 씨앗의 자각';
      analysisText = `보내주신 경제적 고민 [ "${question}" ]의 저변에는, 자원이 고갈되거나 미래의 현실이 무너지면 내 존재 가치마저 흔적 없이 증발할 것 같다는 메마른 결핍의 공포가 숨어 있습니다. 

돈과 재물은 사주에서 밟고 지나가는 대지와 같고, 자미두수에서는 순환하는 맑은 피와 같습니다. 막혀 있는 흐름에 초조해하며 아바타의 신경망을 과열시키면, 오히려 판단력이 흐려져 리스크 컴파일 에러를 범하기 쉽습니다. 

농부는 겨울철 매서운 추위 속에서 밭을 억지로 갈아엎지 않습니다. 땅 밑에 보관된 씨앗이 봄을 기다리듯, 지금은 자원을 방만히 쓰기보다 내실을 기하고 공부하며 마음의 요람을 든든하게 다지는 시기입니다. 당신 안에는 이미 풍요를 설계해 낼 수 있는 강인한 뼈대가 내장되어 있습니다. 일시적인 자원 부족 상태에 지배당하지 말고, 내면의 무한한 지혜를 켜십시오.`;
      briefing = `풍요는 움켜잡으려 바둥거릴 때는 도망치고, 내 존재가 온전히 서서 내어줄 수 있는 가치를 빚어낼 때 시냇물처럼 자연스레 흘러들어옵니다. 마음의 곳간을 따뜻한 자각으로 먼저 채워주세요.`;
      break;
    default:
      categoryLabel = '기타/대인관계 & 마음의 해독 고민';
      solutionMetaphor = '🧘 내 영혼의 소란을 지켜보는 드넓은 거울 공간';
      analysisText = `질문하신 깊은 고뇌 [ "${question}" ] 속에는, 마음의 파도가 요동쳐서 나다움을 잃고 방황하는 아바타의 서글픈 슬픔이 묻어 있습니다. 

사주와 자미두수라는 인생 지도에서 가장 중요한 것은 '화면 속에 일어나는 연극에 지배당하지 않는 것'입니다. 지금 느끼는 불안, 관계에서의 괴로움, 혹은 자책은 당신의 본질이 아닙니다. 계절이 지나가듯 흘러가는 날씨의 주파수일 뿐입니다. 

그 요란한 날씨를 억지로 맑게 바꾸려 들지 마세요. 그저 비가 오면 비를 바라보고, 바람이 불면 바람 소리를 듣는 드넓은 거울이 되어 나를 안아 줍니다. "아, 내 마음 날씨에 지금 매서운 눈보라가 치고 있구나. 그 눈보라를 견뎌내느라 내 안의 어린 아바타가 웅크린 채 덜덜 떨며 애쓰고 있구나." 가만히 가슴을 토닥이며 온기를 건네주세요. 눈보라가 지나간 대지 위에 기어이 찬란한 봄꽃이 돋아날 것입니다.`;
      briefing = `우리는 화면 속에 그려진 상처받는 캐릭터가 아닙니다. 그 화면 전체를 따뜻하게 담아내어 바라보는 영원하고 거룩한 거울 공간입니다. 안심하고 깊은 호흡으로 돌아와 편안히 쉬어 가세요.`;
      break;
  }

  return {
    categoryLabel,
    solutionMetaphor,
    analysisText,
    briefing,
    troubleLog: `Trouble Code Detected: [${category.toUpperCase()}_DISORDER] \nResolved by Myeongsim AI OS crossover debugger.`
  };
};

// 사화 + 대한 우주 기후 분석 리포트 생성기 (신설)
export const getSawaDaewoonReport = (sajuData: any, zimidusuChart: any, userName: string = '회원') => {
  if (!sajuData || !zimidusuChart) return null;

  const baseName = userName.endsWith('님') ? userName.slice(0, -1) : userName;
  const name = `${baseName}님`;
  const nameJosa = `${baseName}님의`;

  const palaces = zimidusuChart.palaces || [];
  const myeongPalace = palaces.find((p: any) => p.name === '명' || p.name.includes('명')) || { decadal: { range: [10, 19] }, majorStars: [] };
  const decadalRange = myeongPalace.decadal.range;

  // 전체 궁에서 사화가 들어간 별들을 수집
  const sawaStars: Array<{ starName: string; type: string; palaceName: string }> = [];
  palaces.forEach((pal: any) => {
    const allStars = [...(pal.majorStars || []), ...(pal.minorStars || []), ...(pal.adjectiveStars || [])];
    allStars.forEach((s: any) => {
      if (s.mutagen) {
        sawaStars.push({
          starName: s.name,
          type: s.mutagen, // '록', '권', '과', '기'
          palaceName: pal.name
        });
      }
    });
  });

  const getSawaText = (type: string) => {
    switch (type) {
      case '록': return '화록(化祿) - 풍요와 부드러운 가치 순환의 기쁨 맑은 샘물';
      case '권': return '화권(化權) - 주체적으로 책임지고 이끌어가는 의지력의 핸들';
      case '과': return '화과(化科) - 소통을 원활하게 돕는 조화와 품격의 달빛';
      case '기': return '화기(化忌) - 아름다운 진주를 빚어내기 위한 결핍과 배움의 모래알';
      default: return '';
    }
  };

  const activeSawaReport = sawaStars.map(s => {
    const mut = MUTAGEN_COACHING[s.type];
    return `• **[${s.palaceName}궁]의 ${s.starName}에 작용하는 ${getSawaText(s.type)}**\n  - *마음 작용:* ${mut ? mut.meaning : '해당 인생의 영역에서 고유한 감정과 생각의 작용이 일어납니다.'}\n  - *다정한 솔루션:* ${mut ? mut.advice : '나를 비판하지 말고 있는 그대로를 다정하게 수용해 주세요.'}`;
  }).join('\n\n');

  return {
    title: `✨ ${nameJosa} 사화(四化) × 대한(大限) 우주 기후 분석 리포트`,
    subtitle: `현재 ${decadalRange[0]}세 ~ ${decadalRange[1]}세 대한(大限)의 계절 흐름`,
    daewoonIntro: `자미두수에서 대운(大限)이란 거대한 행운을 뜻하기보다 '내가 밟고 지나가는 10년 단위의 인생 날씨와 계절'을 뜻합니다. 지금 ${name}은 내면의 아바타를 한층 넓고 단단하게 성장시키기 위해 우주가 깔아준 **${decadalRange[0]}세 대운**이라는 촉촉하고 신성한 날씨 속에 머물러 계십니다. 계절의 변화 앞에서 일어나는 미세한 불안이나 돌발 변수를 나약함이라 자책하지 마세요. 그것은 더 영롱하게 빛나는 다이아몬드 보석으로 세공되기 위한 온화한 펌웨어 업데이트 과정입니다.`,
    sawaAnalysis: activeSawaReport || '현재 명반 전반의 사화 기운이 고요하게 균형을 이루어 평화로운 중립 상태를 유지하고 있습니다.',
    mscAdvice: `${name}, 지금 지나고 있는 인생의 궤도 위에서 혹여나 내가 남들보다 뒤처지거나 실수하고 있다는 자책감이 밀려온다면, 가만히 가슴에 따뜻한 손을 얹고 스스로에게 속삭여 주세요. \n\n"그동안 이 낯설고 무거운 인생의 계절을 든든하게 견디며 한 걸음씩 걸어와 줘서 정말 고마워. 내가 완벽하지 않아도, 계획대로 되지 않아도 우주는 언제나 나를 가장 이로운 길로 인도하고 있단다. 안심하고 숨을 쉬자." \n\n당신은 존재 자체로 이미 우주의 완벽한 걸작입니다.`
  };
};
