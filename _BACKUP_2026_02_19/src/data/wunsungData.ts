export interface Wunsung {
    id: string; // jang, mok, etc.
    name_kor: string;
    name_hanja: string;
    image: string; // metaphor image
    description: string;
    advice: string;
}

export const WUNSUNGS: Wunsung[] = [
    {
        id: 'jang',
        name_kor: '장생',
        name_hanja: '長生',
        image: "갓 태어난 아기",
        description: "순수하고 호기심이 넘치지만, 혼자서는 불안해요. 누군가의 후원이 필요합니다.",
        advice: "혼자 끙끙 앓지 마세요. 주변에 도움을 요청하면 기꺼이 도와줄 겁니다."
    },
    {
        id: 'mok',
        name_kor: '목욕',
        name_hanja: '沐浴',
        image: "씻고 있는 아이",
        description: "매력적이고 멋을 부리기를 좋아하지만, 아직 미숙해서 실수가 잦아요.",
        advice: "겉모습보다 내실을 다지세요. 작은 실수를 줄이는 것이 성공의 열쇠입니다."
    },
    {
        id: 'gwan',
        name_kor: '관대',
        name_hanja: '冠帶',
        image: "제복 입은 청소년",
        description: "자신감이 하늘을 찌르고 용기가 넘치지만, 남의 말을 안 듣는 고집불통입니다.",
        advice: "겸손이 최고의 무기입니다. 고개를 숙이고 경청하면 적이 사라집니다."
    },
    {
        id: 'geon',
        name_kor: '건록',
        name_hanja: '建祿',
        image: "청년 가장",
        description: "가장 튼튼하고 건강하며, 누구의 도움 없이도 자수성가할 힘이 있습니다.",
        advice: "지금이 기회입니다. 망설이지 말고 당신의 능력을 세상에 펼치세요."
    },
    {
        id: 'je',
        name_kor: '제왕',
        name_hanja: '帝旺',
        image: "정상의 왕",
        description: "능력과 권력이 최고조에 달했지만, 너무 강해서 주변이 떠나고 외로울 수 있습니다.",
        advice: "독단적인 결정은 위험합니다. 일부러라도 주변 사람을 챙기고 베푸세요."
    },
    {
        id: 'swe',
        name_kor: '쇠',
        name_hanja: '衰',
        image: "지혜로운 은퇴자",
        description: "전성기는 지났지만, 노련미와 지혜가 있어 실질적인 리더 역할을 합니다.",
        advice: "직접 뛰기보다 뒤에서 참모 역할을 하세요. 당신의 지혜가 빛을 발합니다."
    },
    {
        id: 'byeong',
        name_kor: '병',
        name_hanja: '病',
        image: "병상에 누운 환자",
        description: "몸은 약하지만 감수성이 풍부하고, 타인의 아픔을 누구보다 잘 이해합니다.",
        advice: "건강이 최우선입니다. 무리한 경쟁보다는 예술이나 봉사 쪽으로 관심을 돌려보세요."
    },
    {
        id: 'sa',
        name_kor: '사',
        name_hanja: '死',
        image: "정지된 상태",
        description: "육체적 활동은 멈췄지만, 정신적 깊이는 심해처럼 깊어지는 시기입니다.",
        advice: "깊게 파고드는 공부나 기획에 집중하세요. 정신적인 분야에서 대가(Master)가 될 수 있습니다."
    },
    {
        id: 'myo',
        name_kor: '묘',
        name_hanja: '墓',
        image: "창고지기",
        description: "알뜰살뜰 모으고 저장하는 능력은 최고지만, 때로는 갇혀 있는 듯 답답합니다.",
        advice: "돈은 잘 모으겠지만 인색하다는 평을 듣습니다. 가끔은 나를 위해 시원하게 쓰세요."
    },
    {
        id: 'jeol',
        name_kor: '절',
        name_hanja: '絕',
        image: "끊어진 다리",
        description: "모든 것이 끊어져 위태로워 보이지만, 반대로 완전히 백지에서 새로 시작할 수 있습니다.",
        advice: "과거에 연연하지 마세요. 지금이 바로 인생의 판을 새로 짤 수 있는 타이밍입니다."
    },
    {
        id: 'tae',
        name_kor: '태',
        name_hanja: '胎',
        image: "잉태된 생명",
        description: "가능성은 무한하지만 아직 형체가 없습니다. 보호받으며 준비해야 합니다.",
        advice: "성급하게 결과를 내러 하지 마세요. 지금은 조용히 계획을 세우고 미래를 꿈꿀 때입니다."
    },
    {
        id: 'yang',
        name_kor: '양',
        name_hanja: '養',
        image: "뱃속의 태아",
        description: "안정적이고 편안하지만, 부모(보호자)와 윗사람의 혜택을 받는 운입니다.",
        advice: "상속받거나 이어받는 운이 강합니다. 윗사람과 잘 지내면 복이 굴러들어옵니다."
    }
];

export const getWunsungData = (id: string): Wunsung | undefined => {
    return WUNSUNGS.find(w => w.id === id);
};
