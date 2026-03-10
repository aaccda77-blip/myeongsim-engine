export interface SocialRole {
    id: string;
    code: string; // 십성 코드 (bi, geop, etc.)
    alias: string; // 사회적 가면 이름
    question: string; // 자각 질문
    guide: string; // 코칭 가이드
}

export const SOCIAL_ROLES: SocialRole[] = [
    {
        id: 'bi',
        code: 'bi',
        alias: '독립군',
        question: "동료들과 비교당하거나, 내 밥그릇을 뺏길까 봐 긴장하고 있나요?",
        guide: "경쟁하지 마세요. 오늘은 동료에게 먼저 커피 한 잔 사며 '내 편'으로 만드세요."
    },
    {
        id: 'geop',
        code: 'geop',
        alias: '승부사',
        question: "이 치열한 경쟁 사회에서 살아남으려 억지로 강한 척하고 있나요?",
        guide: "어깨에 힘을 빼세요. 지는 것이 이기는 것입니다. 오늘은 한 발 물러서주세요."
    },
    {
        id: 'sik',
        code: 'sik',
        alias: '장인(Expert)',
        question: "내 일에만 몰두하느라, 정작 내 몸과 마음은 돌보지 못했나요?",
        guide: "일 중독 멈춤. 오늘 점심은 무조건 맛있는 걸 드시고 10분 산책하세요."
    },
    {
        id: 'sang',
        code: 'sang',
        alias: '비평가',
        question: "부당한 지시를 하는 상사나 조직 때문에 화가 치밀어 오르나요?",
        guide: "들이받지 마세요. 그 분노를 메모장에 글로 적어서 배설하고 끝내세요."
    },
    {
        id: 'pyun_jae',
        code: 'pyun_jae',
        alias: '전략가',
        question: "과정보다는 당장의 성과와 돈 때문에 조급해하고 있나요?",
        guide: "큰 그림은 잠시 접어두세요. 오늘 하루는 계산기 없이 사람 냄새나게 보내세요."
    },
    {
        id: 'jeong_jae',
        code: 'jeong_jae',
        alias: '살림꾼',
        question: "작은 실수도 용납 못 하고, 1원 한 푼까지 따지느라 피곤한가요?",
        guide: "완벽하지 않아도 큰일 안 납니다. 나를 위해 기분 좋게 '쓸모없는 지출'을 해보세요."
    },
    {
        id: 'pyun_gwan',
        code: 'pyun_gwan',
        alias: '해결사',
        question: "남들이 하기 싫어하는 힘든 일만 도맡아 하며 희생하고 있나요?",
        guide: "거절의 미학이 필요합니다. 오늘은 웃으면서 정중하게 'No'라고 말해보세요."
    },
    {
        id: 'jeong_gwan',
        code: 'jeong_gwan',
        alias: '모범생',
        question: "남들의 시선과 체면 때문에 하고 싶은 말을 꾹 참고 있나요?",
        guide: "넥타이를 푸세요. 남들이 뭐라든 오늘은 내가 편한 대로 행동하세요."
    },
    {
        id: 'pyun_in',
        code: 'pyun_in',
        alias: '철학자',
        question: "세상이 나를 이해 못 한다고 느끼며 혼자만의 동굴로 숨었나요?",
        guide: "생각의 고리를 끊으세요. 지금 당장 밖으로 나가 햇볕을 쬐며 걸으세요."
    },
    {
        id: 'jeong_in',
        code: 'jeong_in',
        alias: '사랑둥이',
        question: "누군가 내 노력을 알아주고 칭찬해 주길 하염없이 기다리나요?",
        guide: "기다리지 마세요. 거울을 보고 내가 나에게 '정말 고생했어'라고 말해주세요."
    }
];

export const getSocialRole = (tenGodCode: string): SocialRole | undefined => {
    return SOCIAL_ROLES.find(role => role.code === tenGodCode);
};
