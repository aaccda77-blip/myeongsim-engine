export interface Gongmang {
    location: 'year' | 'month' | 'day' | 'hour';
    meaning: string;
    advice: string;
}

export const GONGMANGS: Gongmang[] = [
    { location: 'year', meaning: "뿌리의 부재 - 조상이나 윗사람 덕이 없고, 고향을 떠나야 성공합니다.", advice: "맨땅에 헤딩하는 자수성가형입니다. 부모 원망 말고 독립하세요." },
    { location: 'month', meaning: "사회의 부재 - 직장이나 조직 생활이 맞지 않고, 늘 어딘가로 떠나고 싶어 합니다.", advice: "일반적인 직장보다는 프리랜서나 전문직, 혹은 해외로 나가세요." },
    { location: 'day', meaning: "배우자의 부재 - 배우자가 있어도 외롭고, 내 마음을 온전히 의지할 곳이 없습니다.", advice: "사람에게 기대려 하지 마세요. 종교나 취미로 내면을 채워야 합니다." },
    { location: 'hour', meaning: "미래의 부재 - 자식 덕을 보기 힘들거나, 노년의 계획이 자꾸 틀어집니다.", advice: "자식에게 집착하지 말고, 나만의 노후 프로젝트나 제자를 키우세요." }
];

export interface LifeSeason {
    season: 'spring' | 'summer' | 'autumn' | 'winter';
    element: string;
    keyword: string;
    flow: string;
    guide: string;
}

export const LIFE_SEASONS: LifeSeason[] = [
    { season: 'spring', element: '목', keyword: '시작/희망', flow: "얼었던 땅이 녹고 새싹이 돋습니다. 무엇이든 시작하고 저지르는 시기입니다.", guide: "실패를 두려워 말고 다양한 시도를 하세요. 교육, 기획, 창업의 적기입니다." },
    { season: 'summer', element: '화', keyword: '확장/열정', flow: "꽃이 피고 활동이 왕성해집니다. 내 이름을 세상에 알리고 화려하게 펼칩니다.", guide: "집에 있지 말고 밖으로 나가세요. 영업, 홍보, 인맥 확장에 올인하세요." },
    { season: 'autumn', element: '금', keyword: '결실/정리', flow: "열매를 맺고 추수를 합니다. 벌려놓은 일을 정리하고 실속(돈)을 챙깁니다.", guide: "새로운 일을 벌이지 마세요. 내실을 다지고 현금화하여 곳간을 채우세요." },
    { season: 'winter', element: '수', keyword: '휴식/준비', flow: "모든 것이 멈추고 밤이 왔습니다. 겉으로는 조용하지만 내면의 지혜는 깊어집니다.", guide: "활동을 줄이고 공부하세요. 자격증을 따거나 다음 봄을 위한 '무기'를 만드세요." }
];

export const getGongmangInfo = (loc: string) => GONGMANGS.find(g => g.location === loc);
export const getLifeSeason = (season: string) => LIFE_SEASONS.find(s => s.season === season);
