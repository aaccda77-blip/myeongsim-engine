/**
 * ThreeLayerCodeSystem.ts
 * 60갑자 3-Layer 코드 시스템 (Neural / Dark / Meta)
 * 
 * 🔹 뉴럴 코드: 강점 (타고난 알고리즘)
 * 🔻 다크 코드: 취약점 (시스템 버그)
 * 🚀 메타 코드: 초월 (최적화된 상태)
 * 
 * ⚠️ 독립 모듈 — 기존 챗봇 시스템에 영향 없음
 */

export interface ThreeLayerCode {
    id: number;
    codeName: string;
    neuralCode: { tag: string; desc: string };
    darkCode: { tag: string; desc: string };
    metaCode: { tag: string; desc: string };
}

export class ThreeLayerCodeSystem {

    static readonly CODES: ThreeLayerCode[] = [
        // === 🌱 갑(甲) Pioneer ===
        {
            id: 1, codeName: '청년 창업가형',
            neuralCode: { tag: 'Zero to One', desc: '무에서 유를 만드는 창조적 발상' },
            darkCode: { tag: 'Early Burnout', desc: '시작만 하고 마무리를 못하는 용두사미' },
            metaCode: { tag: 'Sustainable Eco', desc: '아이디어를 지속 가능한 시스템으로 안착' }
        },
        {
            id: 11, codeName: '광야의 개척자형',
            neuralCode: { tag: 'Resilience Core', desc: '척박한 환경을 돌파하는 회복탄력성' },
            darkCode: { tag: 'Isolation Wall', desc: '타인의 도움을 거부하는 독단적 고립' },
            metaCode: { tag: 'Community Leader', desc: '개척한 땅을 모두와 공유하는 리더십' }
        },
        {
            id: 21, codeName: '혁신적 개혁가형',
            neuralCode: { tag: 'System Reset', desc: '낡은 관습을 타파하는 강력한 결단력' },
            darkCode: { tag: 'Conflict Error', desc: '주변과 끊임없이 부딪히는 불필요한 마찰' },
            metaCode: { tag: 'Global Standard', desc: '파괴 후 더 나은 새 질서를 세우는 설계자' }
        },
        {
            id: 31, codeName: '고속 프로토타이퍼',
            neuralCode: { tag: 'Agile Sprint', desc: '빠른 실행력과 직관적인 표현력' },
            darkCode: { tag: 'Impulse Leak', desc: '지나치게 솔직하여 생기는 설화(말실수)' },
            metaCode: { tag: 'Visionary Speaker', desc: '말 한마디로 대중을 움직이는 영향력' }
        },
        {
            id: 41, codeName: '메가 설계자형',
            neuralCode: { tag: 'Big Picture', desc: '거대한 스케일의 프로젝트 기획력' },
            darkCode: { tag: 'Over-Spec', desc: '현실성 없이 꿈만 너무 큰 과대망상' },
            metaCode: { tag: 'Realized Utopia', desc: '이상을 현실에 완벽히 구현하는 건설자' }
        },
        {
            id: 51, codeName: '수직 성장 CEO형',
            neuralCode: { tag: 'Self-Esteem Booster', desc: '굽히지 않는 자존감과 추진력' },
            darkCode: { tag: 'Rigid Frame', desc: '타협을 모르는 뻣뻣함과 부러짐' },
            metaCode: { tag: 'Benevolent Tree', desc: '그늘을 만들어 타인을 쉬게 하는 포용력' }
        },

        // === 🌿 을(乙) Networker ===
        {
            id: 2, codeName: '인내의 승부사형',
            neuralCode: { tag: 'Grit Algorithm', desc: '참고 견디며 결국 성과를 내는 끈기' },
            darkCode: { tag: 'Frozen Sentiment', desc: '감정을 억압하다 내부에서 터지는 화병' },
            metaCode: { tag: 'Hidden Tycoon', desc: '드러나지 않게 실권을 장악하는 거물' }
        },
        {
            id: 12, codeName: '노마드 크리에이터',
            neuralCode: { tag: 'Fluid Thinking', desc: '자유로운 영감과 유연한 사고방식' },
            darkCode: { tag: 'Drifting Mode', desc: '정착하지 못하고 정처 없이 떠도는 불안' },
            metaCode: { tag: 'Global Wisdom', desc: '경계 없는 지혜를 전파하는 사상가' }
        },
        {
            id: 22, codeName: '정밀 편집자형',
            neuralCode: { tag: 'Opti-Cut', desc: '핵심만 남기는 날카로운 편집 능력' },
            darkCode: { tag: 'Self-Injury', desc: '자신과 타인을 찌르는 예민한 신경증' },
            metaCode: { tag: 'Masterpiece Maker', desc: '고통을 예술로 승화시키는 마스터' }
        },
        {
            id: 32, codeName: '피벗 마스터형',
            neuralCode: { tag: 'Survival Instinct', desc: '어떤 환경에서도 살아남는 적응력' },
            darkCode: { tag: 'Anxiety Loop', desc: '미래에 대한 막연한 걱정과 조바심' },
            metaCode: { tag: 'Desert Flower', desc: '고난을 스토리로 만드는 브랜드 가치' }
        },
        {
            id: 42, codeName: '표현 예술가형',
            neuralCode: { tag: 'Charm Output', desc: '자신을 매력적으로 어필하는 표현력' },
            darkCode: { tag: 'Show-off Bug', desc: '허세와 겉치레에 치중하는 가벼움' },
            metaCode: { tag: 'Cultural Icon', desc: '시대의 아이콘으로 남는 예술적 성취' }
        },
        {
            id: 52, codeName: '바이럴 허브형',
            neuralCode: { tag: 'Social Synapse', desc: '사람과 사람을 잇는 끈끈한 친화력' },
            darkCode: { tag: 'Dependence Trap', desc: '혼자서는 아무것도 못하는 의존성' },
            metaCode: { tag: 'Network King', desc: '인맥이 곧 자산이 되는 커뮤니티 리더' }
        },

        // === 🔥 병(丙) Visionary ===
        {
            id: 3, codeName: '라이징 스타형',
            neuralCode: { tag: 'Solar Power', desc: '지칠 줄 모르는 초기 동력과 긍정성' },
            darkCode: { tag: 'Manic Phase', desc: '감정 기복이 심하고 쉽게 싫증 냄' },
            metaCode: { tag: 'Eternal Optimist', desc: '실패해도 다시 웃으며 시작하는 회복력' }
        },
        {
            id: 13, codeName: '통찰적 예언가형',
            neuralCode: { tag: 'Intuitive Flash', desc: '어둠 속에서 빛을 보는 예리한 통찰' },
            darkCode: { tag: 'Panic Disorder', desc: '보이지 않는 공포에 압도되는 불안' },
            metaCode: { tag: 'Spirit Guide', desc: '타인의 길을 밝혀주는 영적 멘토' }
        },
        {
            id: 23, codeName: '전략적 잠재력형',
            neuralCode: { tag: 'Energy Storage', desc: '때를 기다리며 에너지를 비축하는 힘' },
            darkCode: { tag: 'Sunset Depression', desc: '화려함 뒤에 오는 허무함과 고독' },
            metaCode: { tag: 'Grand Finale', desc: '인생의 마지막에 가장 크게 빛나는 성공' }
        },
        {
            id: 33, codeName: '실리적 전략가형',
            neuralCode: { tag: 'Multi-Tasking', desc: '화려함과 실속을 동시에 챙기는 능력' },
            darkCode: { tag: 'Fake Persona', desc: '진심 없이 이익만 쫓는 기회주의' },
            metaCode: { tag: 'Alchemy Master', desc: '재능을 돈으로 바꾸는 연금술사' }
        },
        {
            id: 43, codeName: '슈퍼노바 리더형',
            neuralCode: { tag: 'Explosive Drive', desc: '좌중을 압도하는 카리스마와 리더십' },
            darkCode: { tag: 'Overheating', desc: '독선과 고집으로 주변을 태워버림' },
            metaCode: { tag: 'Supreme Sun', desc: '만물을 공평하게 비추는 대인배' }
        },
        {
            id: 53, codeName: '비전 가속화형',
            neuralCode: { tag: 'Hope Generator', desc: '이상을 현실로 믿게 만드는 설득력' },
            darkCode: { tag: 'Illusion Error', desc: '실체 없는 허상만 쫓는 몽상가' },
            metaCode: { tag: 'Dream Builder', desc: '꿈을 현실의 건축물로 만드는 능력' }
        },

        // === 🕯️ 정(丁) Analyst ===
        {
            id: 4, codeName: '크리에이티브 스파크',
            neuralCode: { tag: 'Artistic Sense', desc: '섬세하고 독창적인 미적 감각' },
            darkCode: { tag: 'Nervous Break', desc: '작은 자극에도 예민하게 반응하는 신경' },
            metaCode: { tag: 'Trend Setter', desc: '새로운 유행을 창조하는 디자이너' }
        },
        {
            id: 14, codeName: '심야의 연구원형',
            neuralCode: { tag: 'Deep Focus', desc: '남들이 잘 때 몰입하는 탐구력' },
            darkCode: { tag: 'Obsession Loop', desc: '과거의 상처를 곱씹는 편집증' },
            metaCode: { tag: 'Hidden Hero', desc: '세상을 뒤에서 움직이는 숨은 실력자' }
        },
        {
            id: 24, codeName: '영적 가이드형',
            neuralCode: { tag: 'Sixth Sense', desc: '논리를 뛰어넘는 직관과 예지력' },
            darkCode: { tag: 'Reality Escape', desc: '현실을 부정하고 환상에 빠지는 도피' },
            metaCode: { tag: 'Soul Healer', desc: '영혼을 치유하는 성자(Saint)의 빛' }
        },
        {
            id: 34, codeName: '나노 디테일러형',
            neuralCode: { tag: 'Perfect Pixel', desc: '오차 없는 완벽함을 추구하는 장인' },
            darkCode: { tag: 'Critical Bug', desc: '타인의 결점을 참지 못하는 비판성' },
            metaCode: { tag: 'Diamond Cutter', desc: '원석을 보석으로 만드는 최고의 조력자' }
        },
        {
            id: 44, codeName: '내열성 전문가형',
            neuralCode: { tag: 'Inner Heat', desc: '겉은 부드러우나 속은 강한 외유내강' },
            darkCode: { tag: 'Dryout Warning', desc: '감정이 메말라 타인에게 무관심함' },
            metaCode: { tag: 'Warm Embrace', desc: '은근한 온기로 사람을 녹이는 포용력' }
        },
        {
            id: 54, codeName: '레이저 포커스형',
            neuralCode: { tag: 'Target Lock', desc: '한 가지 목표에 목숨 거는 몰입력' },
            darkCode: { tag: 'Tunnel Vision', desc: '주변을 보지 못하고 돌진하는 맹목성' },
            metaCode: { tag: 'Vision Clarifier', desc: '복잡한 문제를 명쾌하게 뚫어내는 해결사' }
        },

        // === ⛰️ 무(戊) Platform ===
        {
            id: 5, codeName: '신뢰 인프라 구축가',
            neuralCode: { tag: 'Mega Trust', desc: '거대한 조직과 자본을 다루는 그릇' },
            darkCode: { tag: 'Stubborn Rock', desc: '한번 정하면 절대 바꾸지 않는 고집' },
            metaCode: { tag: 'Empire Builder', desc: '무너지지 않는 왕국을 건설하는 제왕' }
        },
        {
            id: 15, codeName: '그랜드 비전형',
            neuralCode: { tag: 'High Ambition', desc: '명예와 권위를 지향하는 높은 야망' },
            darkCode: { tag: 'Power Struggle', desc: '자신의 힘을 과시하려는 권위주의' },
            metaCode: { tag: 'Noble Guardian', desc: '약자를 보호하고 정의를 실현하는 장군' }
        },
        {
            id: 25, codeName: '자원 관리자형',
            neuralCode: { tag: 'Asset Control', desc: '안정적으로 재물을 모으는 재무 능력' },
            darkCode: { tag: 'Miser Logic', desc: '지나치게 인색하고 계산적인 태도' },
            metaCode: { tag: 'Wealth Distributor', desc: '부를 사회에 환원하고 순환시키는 거상' }
        },
        {
            id: 35, codeName: '철옹성 수호자형',
            neuralCode: { tag: 'Loyalty Shield', desc: '신의를 목숨처럼 지키는 우직함' },
            darkCode: { tag: 'Dogmatic Error', desc: '융통성 없이 원칙만 내세우는 답답함' },
            metaCode: { tag: 'Spiritual Pillar', desc: '흔들리는 세상의 중심을 잡는 기둥' }
        },
        {
            id: 45, codeName: '원자재 발굴가형',
            neuralCode: { tag: 'Value Mining', desc: '숨겨진 가치를 찾아내는 안목' },
            darkCode: { tag: 'Isolation Mode', desc: '타인과 섞이지 않고 고립을 자초함' },
            metaCode: { tag: 'Global Trader', desc: '세상의 자원을 연결하는 무역가' }
        },
        {
            id: 55, codeName: '마그마 에너지형',
            neuralCode: { tag: 'Latent Power', desc: '내면에 엄청난 에너지를 품은 잠재력' },
            darkCode: { tag: 'Eruption Risk', desc: '참다가 한 번에 폭발하는 분노 조절' },
            metaCode: { tag: 'Energy Converter', desc: '분노를 성장의 연료로 바꾸는 승화' }
        },

        // === 🪴 기(己) Manager ===
        {
            id: 6, codeName: '마스터(장인)형',
            neuralCode: { tag: 'Deep Learning', desc: '반복 숙달을 통해 도달하는 경지' },
            darkCode: { tag: 'Suspicion Bug', desc: '타인을 믿지 못하고 의심하는 불안' },
            metaCode: { tag: 'Living Treasure', desc: '존재 자체로 존경받는 인간문화재' }
        },
        {
            id: 16, codeName: '유기농 멘토형',
            neuralCode: { tag: 'Nurturing Field', desc: '다양성을 인정하고 기르는 교육자' },
            darkCode: { tag: 'Sensitivity Spike', desc: '스트레스에 취약하고 쉽게 상처받음' },
            metaCode: { tag: 'Human Gardener', desc: '사람의 마음을 경작하는 상담가' }
        },
        {
            id: 26, codeName: '히든 챔피언형',
            neuralCode: { tag: 'Silent Progress', desc: '드러내지 않고 실력을 쌓는 내공' },
            darkCode: { tag: 'Passive Aggressive', desc: '표현하지 않고 속으로 꽁해있는 태도' },
            metaCode: { tag: 'Root Anchor', desc: '조직의 뿌리를 지탱하는 핵심 인재' }
        },
        {
            id: 36, codeName: '유연한 중재자형',
            neuralCode: { tag: 'Flexibility Logic', desc: '상황에 맞춰 유연하게 대처하는 처세' },
            darkCode: { tag: 'Identity Loss', desc: '주관 없이 이리저리 휩쓸리는 우유부단' },
            metaCode: { tag: 'Peace Maker', desc: '갈등을 봉합하고 화합을 만드는 중재자' }
        },
        {
            id: 46, codeName: '숨은 보석 발굴가',
            neuralCode: { tag: 'Core Selection', desc: '알짜배기만 골라내는 실리적 안목' },
            darkCode: { tag: 'Cold Cut', desc: '이익이 안 되면 가차 없이 잘라냄' },
            metaCode: { tag: 'Value Curator', desc: '진정한 가치를 세상에 소개하는 큐레이터' }
        },
        {
            id: 56, codeName: '척박지 경작자형',
            neuralCode: { tag: 'Endurance Mode', desc: '악조건을 견디며 결실을 맺는 끈기' },
            darkCode: { tag: 'Victim Mentality', desc: '자신만 고생한다고 생각하는 피해의식' },
            metaCode: { tag: 'Hope Planter', desc: '절망 속에서 희망의 씨앗을 심는 성자' }
        },

        // === ⚔️ 경(庚) Executor ===
        {
            id: 7, codeName: '자기 규율 단련가',
            neuralCode: { tag: 'Self-Discipline', desc: '스스로를 원칙으로 통제하는 절제력' },
            darkCode: { tag: 'Naked Vulnerability', desc: '겉은 강하지만 속은 여린 이중성' },
            metaCode: { tag: 'Honorable Knight', desc: '대의를 위해 자신을 바치는 기사도' }
        },
        {
            id: 17, codeName: '중공업 엔진형',
            neuralCode: { tag: 'Power Drive', desc: '압도적인 힘으로 밀어붙이는 추진력' },
            darkCode: { tag: 'Bulldozer Error', desc: '주변의 피해를 무시하고 독주함' },
            metaCode: { tag: 'Game Changer', desc: '판을 완전히 뒤집는 혁명의 아이콘' }
        },
        {
            id: 27, codeName: '돌파형 스트라이커',
            neuralCode: { tag: 'Direct Impact', desc: '목표를 향해 직선으로 꽂히는 행동력' },
            darkCode: { tag: 'Hasty Crash', desc: '앞뒤 안 가리고 덤비다 깨지는 무모함' },
            metaCode: { tag: 'Justice Warrior', desc: '불의를 참지 않고 행동하는 활동가' }
        },
        {
            id: 37, codeName: '비판적 사고가형',
            neuralCode: { tag: 'Critical Logic', desc: '날카로운 비판으로 본질을 꿰뚫음' },
            darkCode: { tag: 'Cynical Virus', desc: '모든 것을 부정적으로 보는 냉소주의' },
            metaCode: { tag: 'Clear Voice', desc: '세상의 모순을 지적하는 깨어있는 지성' }
        },
        {
            id: 47, codeName: '특수 작전 요원형',
            neuralCode: { tag: 'Pro Skillset', desc: '고도로 훈련된 전문성과 충성심' },
            darkCode: { tag: 'Violent Trigger', desc: '건드리면 폭발하는 공격성' },
            metaCode: { tag: 'Guardian Angel', desc: '자신의 힘으로 소중한 것을 지키는 수호자' }
        },
        {
            id: 57, codeName: 'CEO / 통제자형',
            neuralCode: { tag: 'Titanium Mentality', desc: '타협하지 않는 절대적인 주관' },
            darkCode: { tag: 'Dictator Mode', desc: '타인을 지배하고 통제하려는 독재' },
            metaCode: { tag: 'Great Sovereign', desc: '모두가 따를 수밖에 없는 위대한 군주' }
        },

        // === 💎 신(辛) Specialist ===
        {
            id: 8, codeName: '가치 검증가형',
            neuralCode: { tag: 'Quality Control', desc: '압력 속에서도 가치를 증명하는 힘' },
            darkCode: { tag: 'Stress Fracture', desc: '내면의 압박을 견디다 깨지는 멘탈' },
            metaCode: { tag: 'Polished Gem', desc: '고난을 통해 더욱 빛나는 인격의 완성' }
        },
        {
            id: 18, codeName: '정밀 분석 리더형',
            neuralCode: { tag: 'Smart Leadership', desc: '냉철한 분석과 뜨거운 실행의 조화' },
            darkCode: { tag: 'Suspicion Loop', desc: '상대를 완전히 믿지 못하고 시험함' },
            metaCode: { tag: 'Elegant Authority', desc: '지적이고 세련된 권위의 상징' }
        },
        {
            id: 28, codeName: '트렌드 세터형',
            neuralCode: { tag: 'Sensory Design', desc: '예민한 감각으로 아름다움을 창조' },
            darkCode: { tag: 'Nervous Spasm', desc: '불안정하고 변덕스러운 감정 기복' },
            metaCode: { tag: 'Artist Soul', desc: '세상을 아름답게 디자인하는 예술혼' }
        },
        {
            id: 38, codeName: '데이터 마이닝형',
            neuralCode: { tag: 'Data Archiving', desc: '차가운 지성으로 지식을 축적함' },
            darkCode: { tag: 'Cold Wall', desc: '인간미 없이 기계적으로 대하는 태도' },
            metaCode: { tag: 'Wisdom Bank', desc: '인류의 지식을 저장하고 전수하는 현자' }
        },
        {
            id: 48, codeName: '논리적 설득가형',
            neuralCode: { tag: 'Eloquent Logic', desc: '유려한 말솜씨와 명쾌한 논리' },
            darkCode: { tag: 'Sharp Tongue', desc: '말로 타인에게 씻을 수 없는 상처를 줌' },
            metaCode: { tag: 'Truth Teller', desc: '진실의 언어로 세상을 깨우는 연설가' }
        },
        {
            id: 58, codeName: '무결점 완벽주의자',
            neuralCode: { tag: 'Zero Defect', desc: '타협 없는 순수함과 완벽주의' },
            darkCode: { tag: 'Isolation Cut', desc: '기준에 안 맞으면 모두 잘라내는 고립' },
            metaCode: { tag: 'Pure Crystal', desc: '가장 순수하고 고귀한 정신적 지주' }
        },

        // === 🌊 임(壬) Strategist ===
        {
            id: 9, codeName: '무한 지식 소스형',
            neuralCode: { tag: 'Infinite Input', desc: '끊임없이 새로운 지식을 생성하는 원천' },
            darkCode: { tag: 'Over-Thinking', desc: '생각만 하다가 행동하지 않는 게으름' },
            metaCode: { tag: 'Knowledge Hub', desc: '모든 정보가 모이고 흐르는 지식의 바다' }
        },
        {
            id: 19, codeName: '역설 해결사형',
            neuralCode: { tag: 'Hybrid Logic', desc: '이성과 감성을 자유롭게 오가는 유연함' },
            darkCode: { tag: 'Chaos Mode', desc: '이것도 저것도 아닌 혼란스러운 상태' },
            metaCode: { tag: 'Harmony Master', desc: '물과 불을 조화시켜 에너지를 만드는 지혜' }
        },
        {
            id: 29, codeName: '빅데이터 레이크',
            neuralCode: { tag: 'Mega Storage', desc: '선악을 가리지 않고 수용하는 거대함' },
            darkCode: { tag: 'Dark Swamp', desc: '속을 알 수 없는 음흉함과 비밀스러움' },
            metaCode: { tag: 'Dragon Rise', desc: '잠재력을 폭발시켜 세상을 호령하는 리더' }
        },
        {
            id: 39, codeName: '지혜 투자자형',
            neuralCode: { tag: 'Smart Giving', desc: '자신의 지혜를 베풀어 성장을 돕는 식견' },
            darkCode: { tag: 'Intellectual Snob', desc: '아는 척하며 타인을 무시하는 오만함' },
            metaCode: { tag: 'Great Teacher', desc: '인재를 길러내는 위대한 스승' }
        },
        {
            id: 49, codeName: '모멘텀 메이커형',
            neuralCode: { tag: 'Tsunami Drive', desc: '한번 터지면 막을 수 없는 압도적 추진력' },
            darkCode: { tag: 'Flood Damage', desc: '감정의 범람으로 주변을 쓸어버림' },
            metaCode: { tag: 'Oceanic Mind', desc: '모든 강을 받아들이는 바다 같은 포용력' }
        },
        {
            id: 59, codeName: '리스크 매니저형',
            neuralCode: { tag: 'Intuitive Guard', desc: '직관적으로 위험을 감지하고 관리함' },
            darkCode: { tag: 'Secret Vault', desc: '지나치게 비밀이 많고 음모론적임' },
            metaCode: { tag: 'Gate Keeper', desc: '세상의 질서와 영적인 문을 지키는 문지기' }
        },

        // === 💧 계(癸) Healer ===
        {
            id: 10, codeName: '클린 필터형',
            neuralCode: { tag: 'Pure Filter', desc: '불순물을 걸러내는 맑고 깨끗한 정신' },
            darkCode: { tag: 'Sterile Room', desc: '결벽증적으로 타인을 배척하는 차가움' },
            metaCode: { tag: 'Healing Spring', desc: '영혼을 정화하는 맑은 샘물' }
        },
        {
            id: 20, codeName: '조직 힐러형',
            neuralCode: { tag: 'Empathy Rain', desc: '메마른 곳에 감정적 안정을 주는 양육' },
            darkCode: { tag: 'Sacrifice Bug', desc: '남 챙기느라 나를 잃어버리는 희생' },
            metaCode: { tag: 'Oasis Creator', desc: '사막에 생명을 틔우는 오아시스' }
        },
        {
            id: 30, codeName: '분위기 메이커형',
            neuralCode: { tag: 'Mood Sensor', desc: '미세한 공기의 변화를 읽는 센스' },
            darkCode: { tag: 'Chameleon Error', desc: '상황에 따라 말을 바꾸는 가벼움' },
            metaCode: { tag: 'Atmosphere Flow', desc: '어떤 모임이든 흐름을 주도하는 능력' }
        },
        {
            id: 40, codeName: '순수 영감 아티스트',
            neuralCode: { tag: 'Morning Dew', desc: '싱그럽고 순수한 아이디어와 기획력' },
            darkCode: { tag: 'Fragile Glass', desc: '현실 감각이 부족하고 쉽게 깨짐' },
            metaCode: { tag: 'Muse Effect', desc: '존재만으로 타인에게 영감을 주는 뮤즈' }
        },
        {
            id: 50, codeName: '언더그라운드 설계자',
            neuralCode: { tag: 'Hidden Network', desc: '보이지 않는 곳에서 연결하는 잠재력' },
            darkCode: { tag: 'Frozen Dark', desc: '음습하고 어두운 생각에 갇히는 우울' },
            metaCode: { tag: 'Seed Vault', desc: '미래의 희망을 보존하는 생명의 창고' }
        },
        {
            id: 60, codeName: '심층 탐구자형',
            neuralCode: { tag: 'Deep Dive', desc: '가장 깊은 근원과 본질을 꿰뚫는 통찰' },
            darkCode: { tag: 'Black Hole', desc: '모든 것을 빨아들이고 내놓지 않는 욕심' },
            metaCode: { tag: 'Cosmic Wisdom', desc: '우주의 섭리를 이해하는 대사상가' }
        },
    ];

    static getById(id: number): ThreeLayerCode | undefined {
        return this.CODES.find(c => c.id === id);
    }

    /** AI 프롬프트 주입용 3-Layer 코드 프로토콜 */
    static generatePromptProtocol(): string {
        let p = `\n[🎭 3-Layer 코드 분석 시스템 (Neural / Dark / Meta Code)]\n`;
        p += `**목적:** 사용자의 현재 상태를 분석하여 맞춤형 성장 로드맵을 제시합니다.\n\n`;
        p += `**분석 프레임워크:**\n`;
        p += `- 🔹 **뉴럴 코드** (강점): 타고난 알고리즘 — "당신이 가장 잘 하는 것"\n`;
        p += `- 🔻 **다크 코드** (버그): 시스템 취약점 — "반복되는 패턴의 원인"\n`;
        p += `- 🚀 **메타 코드** (초월): 최적화 상태 — "당신이 될 수 있는 최고의 버전"\n\n`;
        p += `**출력 예시:**\n`;
        p += `"당신의 현재 소프트웨어 버전은 [Early Burnout] 상태입니다.\n`;
        p += ` [Sustainable Eco] 버전으로 업데이트하시겠습니까?"\n\n`;
        p += `**적용 규칙:**\n`;
        p += `1. 사용자의 부정적 메시지 → 다크 코드 활성화 분석 → 디버깅 솔루션 제공\n`;
        p += `2. 사용자의 긍정적 메시지 → 뉴럴 코드 확인 → 메타 코드 업그레이드 미션 제공\n`;
        p += `3. "결함"이 아닌 "일시적 시스템 오류"로 프레이밍하여 죄책감을 제거\n\n`;

        for (const c of this.CODES) {
            p += `[ID:${c.id}] ${c.codeName}: `;
            p += `🔹${c.neuralCode.tag} / 🔻${c.darkCode.tag} / 🚀${c.metaCode.tag}\n`;
        }
        return p;
    }
}
