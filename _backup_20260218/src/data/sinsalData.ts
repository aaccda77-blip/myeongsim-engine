export interface Sinsal {
    id: string;
    name_kor: string;
    name_eng: string;
    keyword: string;
    description: string;
    advice: string;
}

export const SINSALS: Sinsal[] = [
    {
        id: 'dohwa',
        name_kor: '도화살',
        name_eng: 'Peach Blossom',
        keyword: "치명적 매력",
        description: "가만히 있어도 시선을 끄는 매력이 있어, 본의 아니게 구설수에 오르기도 합니다.",
        advice: "연예인, 유튜버, 영업 등 나를 드러내는 일에서 대성공합니다. 끼를 발산하세요."
    },
    {
        id: 'yeokma',
        name_kor: '역마살',
        name_eng: 'Station Horse',
        keyword: "글로벌 이동",
        description: "한곳에 정착하면 답답증을 느낍니다. 활동 반경이 넓을수록 운이 트입니다.",
        advice: "해외 비즈니스, 여행, 운수업 등 몸을 움직이는 분야가 천직입니다."
    },
    {
        id: 'hwagae',
        name_kor: '화개살',
        name_eng: 'Artistic Talent',
        keyword: "고독한 천재",
        description: "화려함을 뒤로하고 내면을 탐구합니다. 예술, 종교, 철학 분야에 비상한 재능이 있습니다.",
        advice: "외로움을 즐기세요. 그 시간 속에서 위대한 창작물이 나옵니다."
    },
    {
        id: 'hongyeom',
        name_kor: '홍염살',
        name_eng: 'Red Beauty',
        keyword: "다정다감한 유혹",
        description: "도화살보다 더 은근하게 이성에게 인기가 많으며, 눈웃음 하나로 상대를 녹입니다.",
        advice: "당신의 친절함은 큰 무기지만, 오해를 사지 않도록 맺고 끊음을 확실히 하세요."
    },
    {
        id: 'gwiyin',
        name_kor: '천을귀인',
        name_eng: 'Nobleman',
        keyword: "최고의 수호천사",
        description: "살면서 죽을 고비를 넘기게 해주는 귀인이 항상 따릅니다. 인복이 타고났습니다.",
        advice: "위기 상황에서 당황하지 마세요. 반드시 돕는 손길이 나타납니다."
    },
    {
        id: 'baekho',
        name_kor: '백호살',
        name_eng: 'White Tiger',
        keyword: "폭발적 에너지",
        description: "평소엔 조용하다가도 한 번 화나면 호랑이처럼 무섭습니다. 집중력이 엄청납니다.",
        advice: "이 강한 기운을 운동이나 전문 기술(의료, 요리)로 풀어내야 건강합니다."
    },
    {
        id: 'hyeonchim',
        name_kor: '현침살',
        name_eng: 'Needle',
        keyword: "정교한 바늘",
        description: "성격이 예민하고 날카롭습니다. 말로 상처를 주거나, 손재주가 아주 좋습니다.",
        advice: "말조심해야 합니다. 대신 그 예리함을 IT, 디자인, 의료 등 정밀한 작업에 쓰세요."
    },
    {
        id: 'goegang',
        name_kor: '괴강살',
        name_eng: 'Extreme Leader',
        keyword: "압도적 카리스마",
        description: "총명하고 결단력이 있어, 남 밑에 있기보다 우두머리가 되어야 직성이 풀립니다.",
        advice: "평범하게 살기 힘듭니다. 큰 꿈을 꾸고 난세의 영웅이 되십시오."
    }
];

export const getSinsalData = (id: string): Sinsal | undefined => {
    return SINSALS.find(s => s.id === id);
};
