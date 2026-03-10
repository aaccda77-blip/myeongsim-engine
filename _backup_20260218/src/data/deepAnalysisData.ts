export interface HiddenStem {
    id: string; // branch code (ja, chuk...)
    hidden_stems: string[]; // e.g. ["임수", "계수"]
    interpretation: string;
}

export const HIDDEN_STEMS: HiddenStem[] = [
    { id: 'ja', hidden_stems: ['임수', '계수'], interpretation: "겉은 차분하지만, 속은 끊임없이 생각하고 계산하느라 뇌가 과열된 상태입니다." },
    { id: 'chuk', hidden_stems: ['계수', '신금', '기토'], interpretation: "묵묵히 참는 것 같지만, 속에는 날카로운 비수(신금)와 냉정함을 품고 있습니다." },
    { id: 'in', hidden_stems: ['무토', '병화', '갑목'], interpretation: "현실에 사는 것 같지만, 마음속엔 이미 거대한 야망과 미래의 청사진을 그리고 있습니다." },
    { id: 'myo', hidden_stems: ['갑목', '을목'], interpretation: "순해 보이지만, 속마음은 자신의 영역과 이익을 철저히 지키려는 생존 본능이 강합니다." },
    { id: 'jin', hidden_stems: ['을목', '계수', '무토'], interpretation: "스케일이 커 보이지만, 의외로 섬세하고 현실적인 이해득실을 꼼꼼하게 따집니다." },
    { id: 'sa', hidden_stems: ['무토', '경금', '병화'], interpretation: "조용해 보이지만, 내면에는 세상을 바꿀만한 폭발적인 열정과 결단력이 숨어 있습니다." },
    { id: 'o', hidden_stems: ['병화', '기토', '정화'], interpretation: "화려하고 밝아 보이지만, 속은 의외로 외로움을 많이 타고 감정 기복이 심합니다." },
    { id: 'mi', hidden_stems: ['정화', '을목', '기토'], interpretation: "온순해 보이지만, 한번 고집을 부리면 아무도 꺾을 수 없는 뜨거운 자존심이 있습니다." },
    { id: 'sin', hidden_stems: ['무토', '임수', '경금'], interpretation: "가벼워 보일 수 있지만, 속에는 세상을 꿰뚫어 보는 통찰력과 리더십이 숨겨져 있습니다." },
    { id: 'yu', hidden_stems: ['경금', '신금'], interpretation: "사교적으로 보이지만, 마음속에는 '내 사람'과 '남'을 칼같이 나누는 냉정함이 있습니다." },
    { id: 'sul', hidden_stems: ['신금', '정화', '무토'], interpretation: "충직해 보이지만, 내면에는 누구에게도 말 못 할 고독과 철학적인 고민이 가득합니다." },
    { id: 'hae', hidden_stems: ['무토', '갑목', '임수'], interpretation: "욕심이 많아 보이지만, 사실은 배우고 싶고 새로운 것을 시작하고 싶은 호기심이 더 큽니다." }
];

export interface ElementLuckyItem {
    element: string; // wood, fire, earth, metal, water
    symptom: string;
    color: string;
    food: string;
    action: string;
}

export const LUCKY_ITEMS: ElementLuckyItem[] = [
    { element: 'wood', symptom: '의욕 상실, 시작 두려움', color: 'Green (초록, 청록)', food: '신맛, 샐러드, 부추, 매실', action: '아침 일찍 일어나기, 등산하기, 식물 키우기' },
    { element: 'fire', symptom: '우울감, 표현력 부족', color: 'Red (빨강, 분홍)', food: '쓴맛, 커피, 다크초콜릿', action: '햇볕 쬐기, 노래방 가기, 화려한 옷 입기' },
    { element: 'earth', symptom: '불안감, 믿음 부족', color: 'Yellow (노랑, 황토)', food: '단맛, 꿀, 고구마, 호박', action: '맨발 걷기, 도자기 만들기, 약속 철저히 지키기' },
    { element: 'metal', symptom: '우유부단, 맺고 끊기 못함', color: 'White (화이트, 실버)', food: '매운맛, 마늘, 양파, 계피', action: '불필요한 물건 버리기, 근력 운동, 명상하기' },
    { element: 'water', symptom: '융통성 부족, 불면증', color: 'Black (검정, 네이비)', food: '짠맛, 해조류, 멸치, 소금', action: '반신욕 하기, 물 많이 마시기, 밤에 일찍 자기' }
];

export const getHiddenMind = (branchId: string) => HIDDEN_STEMS.find(h => h.id === branchId);
export const getLuckyItem = (element: string) => LUCKY_ITEMS.find(l => l.element === element);
