/**
 * DayMasterReframing.ts
 * 명심코칭 60갑자 뉴럴 페르소나 데이터베이스 (Master_Saju_Code)
 * Ver. Final — neuro_trait + psych_trait + img_url 포함
 * 
 * ⚠️ 독립 모듈 — 기존 챗봇 시스템에 영향 없음
 */

export interface NeuralType {
    id: number;
    traditional: string;
    hanja: string;
    codeName: string;
    varName: string;
    group: string;
    groupEn: string;
    neuroTrait: string;
    psychTrait: string;
    imgPrompt: string;
}

export class DayMasterReframing {

    static readonly NEURAL_TYPES: NeuralType[] = [
        // === 01~10: 초기 형성 및 기반 ===
        {
            id: 1, traditional: '갑자', hanja: '甲子', codeName: '청년 창업가형', varName: 'Blue_Ocean_Pioneer',
            group: '개척자', groupEn: 'Pioneer',
            neuroTrait: '새로운 신경망을 빠르게 형성하는 학습 능력 우수',
            psychTrait: '실패를 두려워하지 않는 높은 자기 효능감',
            imgPrompt: '꽁꽁 언 땅을 뚫고 나오는 네온 블루 색상의 새싹'
        },
        {
            id: 2, traditional: '을축', hanja: '乙丑', codeName: '인내의 승부사형', varName: 'Cryo_Survivor',
            group: '연결자', groupEn: 'Networker',
            neuroTrait: '악조건 속에서도 도파민 보상을 지연시키는 인내력',
            psychTrait: '목표 달성을 위해 불편함을 감수하는 그릿(Grit)',
            imgPrompt: '차가운 금속 틈에서 피어난 강인한 덩굴 식물'
        },
        {
            id: 3, traditional: '병인', hanja: '丙寅', codeName: '라이징 스타형', varName: 'Rising_Sun_Energy',
            group: '비전가', groupEn: 'Visionary',
            neuroTrait: '전두엽의 활성도가 높아 긍정적 미래 시뮬레이션에 능함',
            psychTrait: '타인에게 영감을 주는 높은 외향성과 개방성',
            imgPrompt: '동쪽 지평선에서 강렬하게 떠오르는 붉은 태양'
        },
        {
            id: 4, traditional: '정묘', hanja: '丁卯', codeName: '크리에이티브 스파크형', varName: 'Creative_Spark_Plug',
            group: '분석가', groupEn: 'Analyst',
            neuroTrait: '시각 피질이 발달하여 이미지와 패턴 인식에 탁월',
            psychTrait: '감수성이 풍부하고 독창적인 아이디어 발상력',
            imgPrompt: '어둠 속에서 반짝이는 섬세한 촛불 또는 필라멘트'
        },
        {
            id: 5, traditional: '무진', hanja: '戊辰', codeName: '신뢰 인프라 구축가형', varName: 'Trust_Infrastructure',
            group: '플랫폼', groupEn: 'Platform',
            neuroTrait: '여러 정보를 통합하여 큰 그림을 그리는 게슈탈트 사고',
            psychTrait: '조직의 중심을 잡는 안정적인 정서적 신뢰감',
            imgPrompt: '거대하고 웅장한 산맥을 형상화한 폴리곤 아트'
        },
        {
            id: 6, traditional: '기사', hanja: '己巳', codeName: '마스터(장인)형', varName: 'Ceramic_Kiln_Master',
            group: '관리자', groupEn: 'Manager',
            neuroTrait: '반복 학습을 통해 절차적 기억을 고도로 발달시킴',
            psychTrait: '완벽함을 추구하며 끝까지 해내는 성취 지향성',
            imgPrompt: '뜨거운 가마 속에서 구워지고 있는 단단한 도자기'
        },
        {
            id: 7, traditional: '경오', hanja: '庚午', codeName: '자기 규율 단련가형', varName: 'Self_Discipline_Forge',
            group: '실행가', groupEn: 'Executor',
            neuroTrait: '충동을 억제하고 목표에 집중하는 전두엽 통제력',
            psychTrait: '스스로를 엄격하게 관리하는 높은 자기 절제력',
            imgPrompt: '불 속에서 제련되고 있는 달궈진 검(Sword)'
        },
        {
            id: 8, traditional: '신미', hanja: '辛未', codeName: '가치 검증가형', varName: 'Pressure_Tester',
            group: '전문가', groupEn: 'Specialist',
            neuroTrait: '미세한 오류를 감지하는 예민한 감각 처리 시스템',
            psychTrait: '스트레스 상황에서도 본질을 지키는 자아 강도',
            imgPrompt: '건조한 사막 모래 속에 빛나는 날카로운 보석'
        },
        {
            id: 9, traditional: '임신', hanja: '壬申', codeName: '무한 지식 소스형', varName: 'Infinite_Source_Code',
            group: '전략가', groupEn: 'Strategist',
            neuroTrait: '유동적 지능이 높아 끊임없이 새로운 지식을 흡수',
            psychTrait: '깊은 사고를 통해 원리를 파악하는 탐구적 태도',
            imgPrompt: '끊임없이 솟아나는 맑고 깊은 수원(Source)'
        },
        {
            id: 10, traditional: '계유', hanja: '癸酉', codeName: '클린 필터형', varName: 'Clean_Filter_System',
            group: '치유자', groupEn: 'Healer',
            neuroTrait: '불필요한 노이즈를 제거하고 핵심 신호만 포착',
            psychTrait: '타인의 감정을 명확히 구분하는 냉철한 공감력',
            imgPrompt: '맑은 물이 담긴 투명하고 깨끗한 유리잔'
        },

        // === 11~20: 성장 및 개발 ===
        {
            id: 11, traditional: '갑술', hanja: '甲戌', codeName: '광야의 개척자형', varName: 'Frontier_Ranger',
            group: '개척자', groupEn: 'Pioneer',
            neuroTrait: '척박한 환경을 기회로 인식하는 리프레이밍 능력',
            psychTrait: '독립적이고 자율적인 환경에서 동기 부여됨',
            imgPrompt: '황무지 위에 홀로 서 있는 굳건한 고목'
        },
        {
            id: 12, traditional: '을해', hanja: '乙亥', codeName: '노마드 크리에이터형', varName: 'Nomadic_Creator',
            group: '연결자', groupEn: 'Networker',
            neuroTrait: '유연한 사고로 경계를 넘나드는 확산적 사고력',
            psychTrait: '자유를 추구하며 어디서든 적응하는 유연성',
            imgPrompt: '바다 위에 떠 있는 잎사귀 모양의 보트'
        },
        {
            id: 13, traditional: '병자', hanja: '丙子', codeName: '통찰적 예언가형', varName: 'Insight_Reflector',
            group: '비전가', groupEn: 'Visionary',
            neuroTrait: '이성과 직관의 뇌 영역이 동시에 활성화되는 통찰력',
            psychTrait: '이상적인 비전을 현실적으로 조율하는 균형 감각',
            imgPrompt: '호수에 비친 태양, 반짝이는 윤슬'
        },
        {
            id: 14, traditional: '정축', hanja: '丁丑', codeName: '심야의 연구원형', varName: 'Midnight_Researcher',
            group: '분석가', groupEn: 'Analyst',
            neuroTrait: '높은 몰입도로 한 가지 주제를 깊게 파고드는 집중력',
            psychTrait: '남들이 보지 못하는 이면을 탐구하는 호기심',
            imgPrompt: '캄캄한 밤을 밝히는 등대 또는 서치라이트'
        },
        {
            id: 15, traditional: '무인', hanja: '戊寅', codeName: '그랜드 비전형', varName: 'Grand_Canyon_Builder',
            group: '플랫폼', groupEn: 'Platform',
            neuroTrait: '장기적인 목표를 설정하고 계획하는 집행 기능 우수',
            psychTrait: '권위와 명예를 중시하며 리더십을 발휘함',
            imgPrompt: '높은 산 위에 펄럭이는 깃발 3D 아이콘'
        },
        {
            id: 16, traditional: '기묘', hanja: '己卯', codeName: '유기농 멘토형', varName: 'Organic_Growth_Field',
            group: '관리자', groupEn: 'Manager',
            neuroTrait: '타인의 성장을 돕는 거울 뉴런(Mirror Neuron) 활성',
            psychTrait: '잠재력을 믿고 기다려주는 인본주의적 태도',
            imgPrompt: '비옥한 텃밭에서 자라나는 다양한 작물들'
        },
        {
            id: 17, traditional: '경진', hanja: '庚辰', codeName: '중공업 엔진형', varName: 'Heavy_Industry_Core',
            group: '실행가', groupEn: 'Executor',
            neuroTrait: '강력한 추진력을 뒷받침하는 높은 도파민 수용성',
            psychTrait: '압도적인 힘으로 난관을 돌파하는 지배성',
            imgPrompt: '거대한 기계 장치의 톱니바퀴와 엔진'
        },
        {
            id: 18, traditional: '신사', hanja: '辛巳', codeName: '정밀 분석 리더형', varName: 'Precision_Leadership_Engine',
            group: '전문가', groupEn: 'Specialist',
            neuroTrait: '냉철한 분석과 뜨거운 실행의 완벽한 조화',
            psychTrait: '예리한 판단력과 품격 있는 카리스마',
            imgPrompt: '빛나는 보석이 박힌 최첨단 회로 기판'
        },
        {
            id: 19, traditional: '임오', hanja: '壬午', codeName: '역설 해결사형', varName: 'Paradox_Solver',
            group: '전략가', groupEn: 'Strategist',
            neuroTrait: '상반된 정보를 융합하여 새로운 해법을 찾는 창의성',
            psychTrait: '이성과 감성 사이의 균형을 유지하는 조절 능력',
            imgPrompt: '물과 불이 태극 문양으로 섞이는 3D 구체'
        },
        {
            id: 20, traditional: '계미', hanja: '癸未', codeName: '조직 힐러(Healer)형', varName: 'Eco_Optimizer_Solution',
            group: '치유자', groupEn: 'Healer',
            neuroTrait: '건조한 환경에 감정적 윤활유를 공급',
            psychTrait: '타인을 보살피고 양육하는 이타적인 성향',
            imgPrompt: '메마른 땅에 내리는 촉촉한 단비(Rain)'
        },

        // === 21~30: 확장 및 혁신 ===
        {
            id: 21, traditional: '갑신', hanja: '甲申', codeName: '혁신적 구조개혁가형', varName: 'Innovation_Reformer',
            group: '개척자', groupEn: 'Pioneer',
            neuroTrait: '낡은 시냅스 연결을 끊고 새 경로를 만드는 가소성',
            psychTrait: '기존 체계에 안주하지 않고 도전하는 혁신성',
            imgPrompt: '바위를 뚫고 자라나는 금속성의 나무'
        },
        {
            id: 22, traditional: '을유', hanja: '乙酉', codeName: '정밀 편집자형', varName: 'Precision_Pruner',
            group: '연결자', groupEn: 'Networker',
            neuroTrait: '핵심 정보만 남기고 가지치기하는 정보 처리 효율성',
            psychTrait: '불필요한 감정 소모를 줄이는 실용주의적 태도',
            imgPrompt: '정교하게 다듬어진 분재 또는 가위 아이콘'
        },
        {
            id: 23, traditional: '병술', hanja: '丙戌', codeName: '전략적 잠재력형', varName: 'Energy_Vault',
            group: '비전가', groupEn: 'Visionary',
            neuroTrait: '에너지를 비축했다가 필요할 때 폭발시키는 조절력',
            psychTrait: '자신의 감정을 세련되게 표현하는 사회적 지능',
            imgPrompt: '언덕 너머로 지는 석양의 따스한 빛'
        },
        {
            id: 24, traditional: '정해', hanja: '丁亥', codeName: '영적 가이드형', varName: 'Guide_Lighthouse',
            group: '분석가', groupEn: 'Analyst',
            neuroTrait: '무의식적 신호를 감지하는 높은 직관적 지능',
            psychTrait: '타인의 마음을 깊이 이해하고 위로하는 포용력',
            imgPrompt: '밤바다 위에 떠 있는 은은한 달빛'
        },
        {
            id: 25, traditional: '무자', hanja: '戊子', codeName: '자원(Resource) 관리자형', varName: 'Resource_Dam_Controller',
            group: '플랫폼', groupEn: 'Platform',
            neuroTrait: '안정적으로 자원을 축적하고 관리하는 보상 회로',
            psychTrait: '신중하고 합리적인 경제적 의사결정 능력',
            imgPrompt: '견고한 댐 안에 가득 찬 물(에너지)'
        },
        {
            id: 26, traditional: '기축', hanja: '己丑', codeName: '히든 챔피언형', varName: 'Deep_Culture_Lab',
            group: '관리자', groupEn: 'Manager',
            neuroTrait: '묵묵히 데이터를 축적하며 내공을 쌓는 학습 기제',
            psychTrait: '겉으로 드러내지 않고 실속을 챙기는 실리성',
            imgPrompt: '눈 덮인 밭 아래서 겨울을 나는 씨앗'
        },
        {
            id: 27, traditional: '경인', hanja: '庚寅', codeName: '돌파형 스트라이커형', varName: 'Breakthrough_Striker',
            group: '실행가', groupEn: 'Executor',
            neuroTrait: '목표를 향해 직선적으로 질주하는 운동 피질 활성',
            psychTrait: '위험을 감수하고 승부를 거는 대담성',
            imgPrompt: '맹렬한 속도로 달리는 백호(White Tiger) 형상'
        },
        {
            id: 28, traditional: '신묘', hanja: '辛卯', codeName: '트렌드 세터형', varName: 'Design_Sensor',
            group: '전문가', groupEn: 'Specialist',
            neuroTrait: '시각적 자극과 미적 요소에 민감하게 반응',
            psychTrait: '예민한 감각으로 유행을 선도하는 심미안',
            imgPrompt: '날카롭게 세공된 크리스탈 장미'
        },
        {
            id: 29, traditional: '임진', hanja: '壬辰', codeName: '빅데이터 레이크형', varName: 'Big_Data_Lake',
            group: '전략가', groupEn: 'Strategist',
            neuroTrait: '방대한 정보를 카테고리화하여 저장하는 해마 기능',
            psychTrait: '다양성을 수용하고 변화에 능동적인 스케일',
            imgPrompt: '거대한 용이 승천하는 듯한 물기둥'
        },
        {
            id: 30, traditional: '계사', hanja: '癸巳', codeName: '분위기 메이커형', varName: 'Atmosphere_Changer',
            group: '치유자', groupEn: 'Healer',
            neuroTrait: '비언어적 신호를 빠르게 포착하는 사회적 인지력',
            psychTrait: '주변 분위기를 부드럽게 만드는 사교적 유연성',
            imgPrompt: '아지랑이처럼 피어오르는 몽환적인 안개'
        },

        // === 31~40: 절정 및 전환 ===
        {
            id: 31, traditional: '갑오', hanja: '甲午', codeName: '고속 프로토타이퍼형', varName: 'Rapid_Prototyper',
            group: '개척자', groupEn: 'Pioneer',
            neuroTrait: '생각과 행동 사이의 지연 시간이 짧은 즉각적 반응',
            psychTrait: '솔직하고 직선적으로 자신을 표현하는 태도',
            imgPrompt: '불길에 휩싸인 채 달리는 나무 전차'
        },
        {
            id: 32, traditional: '을미', hanja: '乙未', codeName: '피벗(Pivot) 마스터형', varName: 'Adaptive_Growth_Model',
            group: '연결자', groupEn: 'Networker',
            neuroTrait: '스트레스 상황에서 대안을 찾는 문제 해결력',
            psychTrait: '척박한 환경에서도 살아남는 강인한 생활력',
            imgPrompt: '건조한 모래땅에 깊게 뿌리 내린 선인장'
        },
        {
            id: 33, traditional: '병신', hanja: '丙申', codeName: '실리적 전략가형', varName: 'Golden_Hour_Strategist',
            group: '비전가', groupEn: 'Visionary',
            neuroTrait: '화려한 표현과 실질적 이득을 동시에 계산하는 능력',
            psychTrait: '다재다능하고 임기응변에 능한 스마트함',
            imgPrompt: '태양 빛을 받아 반짝이는 금괴'
        },
        {
            id: 34, traditional: '정유', hanja: '丁酉', codeName: '나노 디테일러형', varName: 'Nano_Detail_Scanner',
            group: '분석가', groupEn: 'Analyst',
            neuroTrait: '완벽주의적 성향으로 오차를 수정하는 피드백 루프',
            psychTrait: '깔끔하고 세련된 마무리를 중시하는 성향',
            imgPrompt: '어둠 속에서 빛나는 촛불과 보석'
        },
        {
            id: 35, traditional: '무술', hanja: '戊戌', codeName: '철옹성 수호자형', varName: 'Iron_Fortress',
            group: '플랫폼', groupEn: 'Platform',
            neuroTrait: '외부의 자극에도 쉽게 흔들리지 않는 편도체 안정성',
            psychTrait: '자신의 신념을 끝까지 고수하는 뚝심',
            imgPrompt: '거대한 성벽이나 요새를 형상화한 아이콘'
        },
        {
            id: 36, traditional: '기해', hanja: '己亥', codeName: '유연한 중재자형', varName: 'Flexible_Ecosystem',
            group: '관리자', groupEn: 'Manager',
            neuroTrait: '다양한 이해관계를 조율하는 전두엽의 중재 기능',
            psychTrait: '상황에 맞춰 물 흐르듯 대처하는 처세술',
            imgPrompt: '넓은 바다 위에 떠 있는 비옥한 섬'
        },
        {
            id: 37, traditional: '경자', hanja: '庚子', codeName: '비판적 사고가형', varName: 'Critical_Thinking_Blade',
            group: '실행가', groupEn: 'Executor',
            neuroTrait: '논리적 모순을 찾아내는 예리한 분석적 사고',
            psychTrait: '차가운 이성으로 상황을 판단하는 객관성',
            imgPrompt: '맑은 물에 씻겨 더욱 날카로워진 칼날'
        },
        {
            id: 38, traditional: '신축', hanja: '辛丑', codeName: '데이터 마이닝 전문가형', varName: 'Data_Mining_Expert',
            group: '전문가', groupEn: 'Specialist',
            neuroTrait: '차가운 지성으로 가치를 분류하고 저장하는 능력',
            psychTrait: '냉철하고 꼼꼼하게 일처리를 하는 완벽주의',
            imgPrompt: '얼음 속에 보관된 정교한 반도체 칩'
        },
        {
            id: 39, traditional: '임인', hanja: '壬寅', codeName: '지혜 투자자형', varName: 'Smart_Investor',
            group: '전략가', groupEn: 'Strategist',
            neuroTrait: '자신의 지적 자산을 성장에 투자하는 기획력',
            psychTrait: '풍부한 표현력과 지혜를 겸비한 멘토링',
            imgPrompt: '깊은 물 속에서 자라나는 거목의 뿌리'
        },
        {
            id: 40, traditional: '계묘', hanja: '癸卯', codeName: '순수 영감 아티스트형', varName: 'Morning_Dew_Artist',
            group: '치유자', groupEn: 'Healer',
            neuroTrait: '섬세한 감수성으로 창의적 영감을 포착하는 능력',
            psychTrait: '맑고 순수한 마음으로 타인에게 호감을 줌',
            imgPrompt: '아침 이슬이 맺힌 싱그러운 풀잎'
        },

        // === 41~50: 스케일 및 주도 ===
        {
            id: 41, traditional: '갑진', hanja: '甲辰', codeName: '메가 프로젝트 설계자형', varName: 'Mega_Scale_Architect',
            group: '개척자', groupEn: 'Pioneer',
            neuroTrait: '거시적인 관점에서 시스템을 설계하는 구조적 사고',
            psychTrait: '스케일이 크고 포부가 당당한 리더십',
            imgPrompt: '비옥한 옥토 위에 우뚝 솟은 거목'
        },
        {
            id: 42, traditional: '을사', hanja: '乙巳', codeName: '표현 예술가형', varName: 'Expressive_Performer',
            group: '연결자', groupEn: 'Networker',
            neuroTrait: '언어 중추와 감정 영역의 연결성이 뛰어난 언변',
            psychTrait: '자신을 매력적으로 어필하는 자기 PR 능력',
            imgPrompt: '화려하게 피어난 꽃 주위를 나는 나비'
        },
        {
            id: 43, traditional: '병오', hanja: '丙午', codeName: '슈퍼노바 리더형', varName: 'Supernova_Core',
            group: '비전가', groupEn: 'Visionary',
            neuroTrait: '주변을 압도하는 강한 에너지 장(Field) 형성',
            psychTrait: '누구에게도 지기 싫어하는 강한 승부욕',
            imgPrompt: '가장 뜨겁게 타오르는 한낮의 태양'
        },
        {
            id: 44, traditional: '정미', hanja: '丁未', codeName: '내열성 전문가형', varName: 'Thermal_Endurance_Unit',
            group: '분석가', groupEn: 'Analyst',
            neuroTrait: '뜨거운 열정을 내면에 가두어 동력으로 쓰는 힘',
            psychTrait: '은근과 끈기로 목표를 달성하는 집념',
            imgPrompt: '뜨거운 열기를 품은 붉은 흙(황토)'
        },
        {
            id: 45, traditional: '무신', hanja: '戊申', codeName: '원자재 발굴가형', varName: 'Raw_Material_Miner',
            group: '플랫폼', groupEn: 'Platform',
            neuroTrait: '잠재적 가치를 찾아내어 이동시키는 유통 감각',
            psychTrait: '고독을 즐기며 묵묵히 자신의 길을 가는 힘',
            imgPrompt: '산 속에 묻혀 있는 거대한 철광석'
        },
        {
            id: 46, traditional: '기유', hanja: '己酉', codeName: '숨은 보석 발굴가형', varName: 'Hidden_Gem_Miner',
            group: '관리자', groupEn: 'Manager',
            neuroTrait: '날카로운 직관으로 핵심 인재를 알아보는 안목',
            psychTrait: '실속을 챙기며 결실을 맺는 알짜배기 성향',
            imgPrompt: '가을 들판에 잘 익은 황금빛 곡식'
        },
        {
            id: 47, traditional: '경술', hanja: '庚戌', codeName: '특수 작전 요원형', varName: 'Special_Ops_Unit',
            group: '실행가', groupEn: 'Executor',
            neuroTrait: '고도의 훈련을 통해 전문 기술을 습득하는 능력',
            psychTrait: '의리와 충성심이 강하며 프로페셔널함',
            imgPrompt: '거친 광야를 지키는 무장한 전사'
        },
        {
            id: 48, traditional: '신해', hanja: '辛亥', codeName: '논리적 설득가형', varName: 'Lucid_Logic_Stream',
            group: '전문가', groupEn: 'Specialist',
            neuroTrait: '명확한 논리로 상대를 설득하는 언어적 유창성',
            psychTrait: '예리한 비판 의식과 차가운 지성',
            imgPrompt: '물에 씻겨 더욱 반짝이는 하얀 보석'
        },
        {
            id: 49, traditional: '임자', hanja: '壬子', codeName: '모멘텀 메이커형', varName: 'Tsunami_Momentum',
            group: '전략가', groupEn: 'Strategist',
            neuroTrait: '한번 시작하면 멈추지 않는 거대한 에너지 흐름',
            psychTrait: '속을 알 수 없는 깊이와 압도적인 추진력',
            imgPrompt: '끝없이 펼쳐진 망망대해의 파도'
        },
        {
            id: 50, traditional: '계축', hanja: '癸丑', codeName: '언더그라운드 설계자형', varName: 'Underground_Network',
            group: '치유자', groupEn: 'Healer',
            neuroTrait: '보이지 않는 곳에서 치밀하게 준비하는 기획력',
            psychTrait: '인내심이 강하고 폭발적인 잠재력을 비축함',
            imgPrompt: '얼어붙은 땅 아래 흐르는 지하수'
        },

        // === 51~60: 완성 및 지혜 ===
        {
            id: 51, traditional: '갑인', hanja: '甲寅', codeName: '수직 성장 CEO형', varName: 'Vertical_Growth_Booster',
            group: '개척자', groupEn: 'Pioneer',
            neuroTrait: '자기 확신이 강하고 주도적으로 행동하는 자율성',
            psychTrait: '굽히지 않는 자존심과 곧은 성품',
            imgPrompt: '울창하고 빽빽한 숲 속의 거목들'
        },
        {
            id: 52, traditional: '을묘', hanja: '乙卯', codeName: '바이럴 네트워크 허브형', varName: 'Viral_Network_Hub',
            group: '연결자', groupEn: 'Networker',
            neuroTrait: '주변 사람들과 끈끈하게 연결되는 사회적 친화력',
            psychTrait: '생존력이 강하고 환경 적응력이 뛰어남',
            imgPrompt: '서로 얽히고설킨 생명력 넘치는 덩굴 식물'
        },
        {
            id: 53, traditional: '병진', hanja: '丙辰', codeName: '비전 가속화형', varName: 'Potential_Accelerator',
            group: '비전가', groupEn: 'Visionary',
            neuroTrait: '이상을 현실로 구현하려는 높은 성취 동기',
            psychTrait: '밝고 명랑하지만 내면에 우울감을 조절하는 힘',
            imgPrompt: '구름 사이를 뚫고 비치는 햇살'
        },
        {
            id: 54, traditional: '정사', hanja: '丁巳', codeName: '레이저 포커스형', varName: 'Laser_Focus_Beam',
            group: '분석가', groupEn: 'Analyst',
            neuroTrait: '목표물을 정확히 조준하는 고도의 시각적 집중력',
            psychTrait: '화끈하고 뒤끝 없는 솔직한 성격',
            imgPrompt: '활활 타오르는 횃불 또는 레이저 빔'
        },
        {
            id: 55, traditional: '무오', hanja: '戊午', codeName: '마그마 에너지형', varName: 'Magma_Energy_Hub',
            group: '플랫폼', groupEn: 'Platform',
            neuroTrait: '겉은 차분해 보이나 내면에 뜨거운 열정을 품음',
            psychTrait: '꼼꼼하고 치밀하게 자신의 영역을 관리함',
            imgPrompt: '화산 분화구 안에 끓고 있는 마그마'
        },
        {
            id: 56, traditional: '기미', hanja: '己未', codeName: '척박지 경작자형', varName: 'Arid_Zone_Cultivator',
            group: '관리자', groupEn: 'Manager',
            neuroTrait: '어떤 환경에서도 적응하여 결과를 만드는 생존력',
            psychTrait: '남을 위해 봉사하고 희생하는 이타적 심성',
            imgPrompt: '뜨거운 태양 아래 펼쳐진 전원 풍경'
        },
        {
            id: 57, traditional: '경신', hanja: '庚申', codeName: '게임 체인저(CEO)형', varName: 'Titanium_Frame',
            group: '실행가', groupEn: 'Executor',
            neuroTrait: '흔들리지 않는 강력한 멘탈과 실행력',
            psychTrait: '조직을 장악하고 이끄는 카리스마 넘치는 리더',
            imgPrompt: '거대한 바위 위에 우뚝 솟은 강철 탑'
        },
        {
            id: 58, traditional: '신유', hanja: '辛酉', codeName: '무결점 완벽주의자형', varName: 'Zero_Defect_Crystal',
            group: '전문가', groupEn: 'Specialist',
            neuroTrait: '결점을 허용하지 않는 엄격한 기준과 원칙',
            psychTrait: '자존심이 매우 강하고 타협하지 않는 순수성',
            imgPrompt: '티 하나 없이 투명하고 날카로운 다이아몬드'
        },
        {
            id: 59, traditional: '임술', hanja: '壬戌', codeName: '리스크 매니저형', varName: 'Risk_Management_System',
            group: '전략가', groupEn: 'Strategist',
            neuroTrait: '불확실성을 통제하고 재물을 관리하는 능력',
            psychTrait: '직관력이 뛰어나고 영적인 분야에 관심이 많음',
            imgPrompt: '깊은 산 속에 위치한 고요한 호수'
        },
        {
            id: 60, traditional: '계해', hanja: '癸亥', codeName: '심층 탐구자형', varName: 'Deep_Dive_Explorer',
            group: '치유자', groupEn: 'Healer',
            neuroTrait: '우주적 원리와 근원을 탐구하는 철학적 사고',
            psychTrait: '모든 것을 포용하고 이해하는 넓은 마음',
            imgPrompt: '깊고 어두운 심해, 모든 생명의 근원'
        },
    ];

    static getByTraditional(name: string): NeuralType | undefined {
        return this.NEURAL_TYPES.find(t => t.traditional === name);
    }

    static getById(id: number): NeuralType | undefined {
        return this.NEURAL_TYPES.find(t => t.id === id);
    }

    static getByGroup(groupEn: string): NeuralType[] {
        return this.NEURAL_TYPES.filter(t => t.groupEn === groupEn);
    }

    /** AI 프롬프트 주입용 60갑자 뉴럴 페르소나 사전 */
    static generatePromptDictionary(): string {
        let dict = `\n[🧬 60갑자 뉴럴 페르소나 DB (Master_Saju_Code)]\n`;
        dict += `**절대 규칙**: "갑자", "을축" 등 전통 60갑자 명칭을 직접 사용하지 마십시오.\n`;
        dict += `반드시 '명심코칭 페르소나명'으로 변환하여 설명하십시오.\n\n`;
        dict += `**출력 예시:**\n`;
        dict += `"당신의 일주는 신사(辛巳)입니다" (❌)\n`;
        dict += `→ "당신의 🧠 코어 OS는 **[정밀 분석 리더형]** 타입입니다.\n`;
        dict += `  뇌과학: 냉철한 분석과 뜨거운 실행의 완벽한 조화\n`;
        dict += `  심리: 예리한 판단력과 품격 있는 카리스마" (✅)\n\n`;

        const groups = ['Pioneer', 'Networker', 'Visionary', 'Analyst', 'Platform', 'Manager', 'Executor', 'Specialist', 'Strategist', 'Healer'];
        const icons: Record<string, string> = {
            Pioneer: '🌱', Networker: '🌿', Visionary: '🔥', Analyst: '🕯️', Platform: '⛰️',
            Manager: '🪴', Executor: '⚔️', Specialist: '💎', Strategist: '🌊', Healer: '💧'
        };

        for (const g of groups) {
            const members = this.getByGroup(g);
            if (!members.length) continue;
            dict += `### ${icons[g] || '▪'} ${members[0].group} (${g})\n`;
            for (const m of members) {
                dict += `  ${m.traditional} → **"${m.codeName}"** \`${m.varName}\`\n`;
                dict += `    뇌: ${m.neuroTrait} / 심리: ${m.psychTrait}\n`;
            }
            dict += `\n`;
        }
        return dict;
    }
}
