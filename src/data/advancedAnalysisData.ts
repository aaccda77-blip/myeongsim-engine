export interface Interaction {
    type: 'chung' | 'hap' | 'hyeong';
    name: string;
    pair: [string, string] | [string, string, string];
    interpretation: string;
    guide: string;
}

export const INTERACTIONS: Interaction[] = [
    { type: 'chung', name: '자오충 (물vs불)', pair: ['자', '오'], interpretation: "감정과 이성이 정면으로 충돌합니다. 정신적인 충격이나 스트레스가 큽니다.", guide: "감정적인 결정 금지. 오늘은 차라리 혼자 있는 게 낫습니다." },
    { type: 'chung', name: '묘유충 (나무vs쇠)', pair: ['묘', '유'], interpretation: "신경이 곤두서고 예민해집니다. 뼈나 관절, 혹은 인간관계의 단절을 조심하세요.", guide: "운전 조심, 말조심. 날카로운 물건을 다룰 때 주의하세요." },
    { type: 'chung', name: '인신충 (나무vs쇠)', pair: ['인', '신'], interpretation: "역마끼리 부딪혔습니다. 갑작스러운 이동, 출장, 혹은 교통사고수가 있습니다.", guide: "어차피 움직일 운명입니다. 여행을 가거나 바쁘게 움직이세요." },
    { type: 'chung', name: '사해충 (불vs물)', pair: ['사', '해'], interpretation: "생각이 너무 많아서 머리가 터집니다. 쓸데없는 걱정으로 밤을 샐 수 있습니다.", guide: "잡생각 끊기. 명상이나 멍 때리기로 뇌를 식히세요." },
    { type: 'hap', name: '육합 (단짝)', pair: ['자', '축'], interpretation: "누군가와 찰떡같이 묶입니다. 연애운이 좋거나, 일에 너무 묶여 꼼짝 못 할 수 있습니다.", guide: "협력하기 좋은 날입니다. 다만, 정에 이끌려 공과 사를 구분 못 하면 안 됩니다." },
    { type: 'hyeong', name: '삼형살 (수술/조정)', pair: ['인', '사', '신'], interpretation: "강한 힘끼리 깎고 다듬는 날입니다. 관재구설(소송)이나 수술, 시비가 붙을 수 있습니다.", guide: "법을 지키고 원칙대로 하세요. 리모델링이나 치과 치료를 받기엔 최고의 날입니다." }
];

export interface HealthConstitution {
    element: string;
    organs: string;
    symptom: string;
    tip: string;
}

export const HEALTH_CONSTITUTION: HealthConstitution[] = [
    { element: 'wood', organs: "간, 담, 신경, 눈", symptom: "눈이 뻑뻑하고 근육 경련이 잦으며, 피로가 잘 풀리지 않습니다.", tip: "술 줄이기, 녹색 채소 섭취, 눈 스트레칭 필수." },
    { element: 'fire', organs: "심장, 소장, 혈관", symptom: "가슴이 두근거리고 얼굴이 잘 붉어지며, 혈압 관리가 필요합니다.", tip: "유산소 운동, 짠 음식 피하기, 붉은색 과일 섭취." },
    { element: 'earth', organs: "위장, 비장, 피부", symptom: "속이 더부룩하고 소화 불량이 잦으며, 살이 잘 찌거나 피부 트러블이 생깁니다.", tip: "규칙적인 식사, 단 음식 줄이기, 맨발 걷기." },
    { element: 'metal', organs: "폐, 대장, 뼈, 코", symptom: "환절기마다 감기에 걸리고, 피부가 건조하며 변비나 설사가 잦습니다.", tip: "물 많이 마시기, 도라지/배 섭취, 등산으로 폐활량 늘리기." },
    { element: 'water', organs: "신장, 방광, 귀", symptom: "몸이 잘 붓고 허리가 아프며, 이명(귀 울림)이나 생식기 질환을 주의해야 합니다.", tip: "하체 보온, 검은콩 섭취, 밤샘 금지." }
];

export const getInteractionInfo = (name: string) => INTERACTIONS.find(i => i.name.includes(name));
export const getHealthInfo = (element: string) => HEALTH_CONSTITUTION.find(h => h.element === element);
