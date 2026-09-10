/**
 * MyeongsimAcademyDB.ts
 * 
 * 명심코칭 평생교육원 (Myeongsim Coaching Lifelong Education Center)
 * 공식 5단계 자격 사다리 & 8대 교재 체계 & 9단계 표준이론 DB
 * 
 * "운명을 맞히는 교육이 아니라, 운명의 운전대를 되찾는 교육"
 * Know → Notice → Accept → Choose → Create
 */

export interface AcademyCourseLevel {
    levelNumber: number; // 0: 맛보기, 1: 셀프코치, 2: 프랙티셔너, 3: 코치, 4: 프로코치, 5: 마스터·강사
    code: 'LEVEL_0' | 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5';
    badge: string;
    title: { kr: string; en: string; jp: string; cn: string };
    subtitle: { kr: string; en: string; jp: string; cn: string };
    targetRole: { kr: string; en: string; jp: string; cn: string }; // 역할: 나를 코칭한다 / 도구를 쓴다 / 타인을 코칭한다 등
    targetAudience: { kr: string; en: string; jp: string; cn: string };
    recommendedHours: { kr: string; en: string; jp: string; cn: string };
    recommendedPrice: { kr: string; en: string; jp: string; cn: string };
    primaryTextbooks: string[]; // 연관 교재 ID 리스트
    unlockedSkillIds: string[]; // 해금되는 드릴메뉴 스킬 ID 리스트
    skillsDescription: { kr: string; en: string; jp: string; cn: string }[];
    coreKeywords: string[];
    examQuizId: string;
}

export interface AcademyTextbook {
    id: string; // book_01 ~ book_08
    number: number;
    title: { kr: string; en: string; jp: string; cn: string };
    subtitle: { kr: string; en: string; jp: string; cn: string };
    role: { kr: string; en: string; jp: string; cn: string };
    targetLevels: number[];
    tableOfContents: {
        part: { kr: string; en: string; jp: string; cn: string };
        chapters: { kr: string; en: string; jp: string; cn: string }[];
    }[];
}

export interface StandardTheoryStep {
    stepIndex: number;
    code: string;
    name: { kr: string; en: string; jp: string; cn: string };
    actionVerb: { kr: string; en: string; jp: string; cn: string };
    description: { kr: string; en: string; jp: string; cn: string };
    icon: string;
}

// ============== 9단계 표준이론 1.0 파이프라인 ==============
export const STANDARD_THEORY_STEPS: StandardTheoryStep[] = [
    {
        stepIndex: 1,
        code: 'HARDWARE',
        name: { kr: '① Hardware Architecture', en: '① Hardware Architecture', jp: '① ハードウェア設計', cn: '① 硬件架构' },
        actionVerb: { kr: 'KNOW (이해)', en: 'KNOW', jp: 'KNOW (理解)', cn: 'KNOW (认知)' },
        description: {
            kr: '내가 가지고 태어난 10가지 본질 기질(甲~癸)과 고유한 에너지 대역폭을 있는 그대로 이해합니다.',
            en: 'Understand your innate 10 core temperaments and baseline biological bandwidth.',
            jp: '生まれ持った10種類の本質気質(甲〜癸)と固有のエネルギー帯域を客観的に理解します。',
            cn: '客观看清自身与生俱来的10大本质气质（甲~癸）与固有能量带宽。'
        },
        icon: '🧬'
    },
    {
        stepIndex: 2,
        code: 'DARK_CODE',
        name: { kr: '② Legacy Driver / Dark Code', en: '② Legacy Driver / Dark Code', jp: '② レガシードライバー / ダークコード', cn: '② 遗留驱动 / 隐匿代码' },
        actionVerb: { kr: 'NOTICE (자각)', en: 'NOTICE', jp: 'NOTICE (自覚)', cn: 'NOTICE (觉察)' },
        description: {
            kr: '성격적 결함이 아니라 과거 취약했던 나를 지켜주었던 생존 방어기제이자 과출력된 기능을 자각합니다.',
            en: 'Notice that recurring flaws are actually survival defense drivers and overdriven functions from the past.',
            jp: '欠陥ではなく、過去の自分を守ってくれた生存防御機構(過出力機能)として自覚します。',
            cn: '觉察到反复出现的所谓缺陷，其实是过去保护自己免受伤害的遗留生存驱动与过度输出。'
        },
        icon: '🚨'
    },
    {
        stepIndex: 3,
        code: 'SCAN',
        name: { kr: '③ SCAN (정밀 스캔)', en: '③ SCAN (Precision Scan)', jp: '③ SCAN (精密スキャン)', cn: '③ SCAN (精准扫描)' },
        actionVerb: { kr: 'NOTICE (분리)', en: 'NOTICE', jp: 'NOTICE (分離)', cn: 'NOTICE (分离)' },
        description: {
            kr: '외부 자극에 반응하는 몸의 신호, 감정 경보, 그리고 Fact(사실)와 Story(가상 소설)를 1초 만에 깔끔하게 분리합니다.',
            en: 'Separate body alarms, emotional signals, and objectively distinguish Fact from mental Fiction.',
            jp: '身体のシグナル、感情の警報、そしてFact(客観事実)とStory(頭の創作)を1秒で鮮明に分離します。',
            cn: '在1秒内将身体信号、情绪警报与Fact（事实）和大脑虚构的Story（故事）彻底拆分。'
        },
        icon: '🔍'
    },
    {
        stepIndex: 4,
        code: 'SYNC',
        name: { kr: '④ SYNC (자기연민 & 수용)', en: '④ SYNC (Self-Compassion)', jp: '④ SYNC (自己慈愛と受容)', cn: '④ SYNC (自我慈悲与接纳)' },
        actionVerb: { kr: 'ACCEPT (수용)', en: 'ACCEPT', jp: 'ACCEPT (受容)', cn: 'ACCEPT (接纳)' },
        description: {
            kr: '감정과 억지로 싸우거나 억누르지 않고, "그동안 애썼다"고 온전히 안아주는 MSC 자기연민과 탈융합을 이룹니다.',
            en: 'Without fighting emotions, achieve defusion and embrace the inner experience with radical self-compassion.',
            jp: '感情と闘わず抑圧もせず、「よく頑張ってきたね」と丸ごと抱きしめる自己慈愛と脱フュージョンを達成します。',
            cn: '不与情绪搏斗或压抑，以极致的自我关怀和接纳，真诚拥抱内在体验，实现认知解离。'
        },
        icon: '🤝'
    },
    {
        stepIndex: 5,
        code: 'NEURAL_CODE',
        name: { kr: '⑤ Neural Code (신경망 재배선)', en: '⑤ Neural Code (Rewiring)', jp: '⑤ Neural Code (神経回路の再配線)', cn: '⑤ Neural Code (神经重塑)' },
        actionVerb: { kr: 'CHOOSE (재해석)', en: 'CHOOSE', jp: 'CHOOSE (再解釈)', cn: 'CHOOSE (重新定义)' },
        description: {
            kr: '과거의 결핍과 상처를 창조적 자산으로 재해석하여 뇌의 신경망(Synapse)을 긍정적이고 생산적인 배선으로 전환합니다.',
            en: 'Reframe past deficiencies into creative assets, physically rewiring neuro-synaptic pathways.',
            jp: '過去の欠乏や痛みを創造的資産として再解釈し、脳の神経回路を建設的・創造的配線へと切り替えます。',
            cn: '将过去的匮乏转化为创造性资产，重塑大脑神经突触回路，建立积极建设性通路。'
        },
        icon: '⚡'
    },
    {
        stepIndex: 6,
        code: 'SHIFT',
        name: { kr: '⑥ SHIFT (가치 지향 행동)', en: '⑥ SHIFT (Value Action)', jp: '⑥ SHIFT (価値志向の行動)', cn: '⑥ SHIFT (价值导向行动)' },
        actionVerb: { kr: 'CHOOSE (선택)', en: 'CHOOSE', jp: 'CHOOSE (选择)', cn: 'CHOOSE (践行选择)' },
        description: {
            kr: '좁아졌던 시야를 100미터 상공으로 확장하여, 내가 진짜 추구하는 가치에 맞는 작은 Micro Action과 경계를 실행합니다.',
            en: 'Zoom out perspectives, executing micro-actions and boundaries aligned with personal core values.',
            jp: '視野を上空100mへ引き上げ、自分が真に望む価値に沿った小さなMicro Actionと健康な境界線を選択します。',
            cn: '将视野提升至百米高空，落实与自身真正价值相符的微行动（Micro Action）与心理边界。'
        },
        icon: '🚀'
    },
    {
        stepIndex: 7,
        code: 'META_CODE',
        name: { kr: '⑦ Meta Code (관찰자 시선)', en: '⑦ Meta Code (Observer Mind)', jp: '⑦ Meta Code (観察者の視点)', cn: '⑦ Meta Code (观察者视角)' },
        actionVerb: { kr: 'CREATE (초월)', en: 'CREATE', jp: 'CREATE (超越)', cn: 'CREATE (超越)' },
        description: {
            kr: '스크린 위의 연극에 매몰되지 않고, 스크린 자체의 존재를 알아차리는 순수 관찰자의 자리에 머뭅니다.',
            en: 'Step off the movie screen drama, resting stably in the position of the untouched pure observer.',
            jp: 'スクリーンの劇中に巻き込まれず、スクリーンそのものを自覚する純粋な観察者の座に留まります。',
            cn: '不再深陷银幕上的悲喜戏剧，安住于不被染着的纯粹观察者本体。'
        },
        icon: '👁️'
    },
    {
        stepIndex: 8,
        code: 'ZERO_POINT',
        name: { kr: '⑧ Zero-Point (순수 자각)', en: '⑧ Zero-Point (Pure Awareness)', jp: '⑧ Zero-Point (純粋覚知)', cn: '⑧ Zero-Point (纯粹觉知)' },
        actionVerb: { kr: 'BEING (평정)', en: 'BEING', jp: 'BEING (平穏)', cn: 'BEING (本然宁静)' },
        description: {
            kr: '내면의 모든 소음이 멈추고, 100미터 바다 심해처럼 흔들리지 않는 절대적 평정과 원초적 생명력을 회복합니다.',
            en: 'All internal noises settle down, restoring unwavering peace and vital cosmic equilibrium.',
            jp: '頭の中のあらゆる雑音が鎮まり、水深100mの深海のような揺るぎなき絶対的静寂と生命力を取り戻します。',
            cn: '脑海中的一切杂音彻底沉寂，回归如百米深海般纹丝不动的绝对象度与生机。'
        },
        icon: '🌌'
    },
    {
        stepIndex: 9,
        code: 'FREE_WILL',
        name: { kr: '⑨ Free Will / Action (자유의지 창조)', en: '⑨ Free Will / Action', jp: '⑨ Free Will / 行動 (自由意志の創造)', cn: '⑨ Free Will / 自由意志创造' },
        actionVerb: { kr: 'CREATE (현실 창조)', en: 'CREATE', jp: 'CREATE (現実創造)', cn: 'CREATE (现实创造)' },
        description: {
            kr: '초월에 머물지 않고 현실의 삶으로 돌아와, 주어진 기질을 악기로 삼아 주체적인 삶의 작품을 연주합니다.',
            en: 'Return to real-world ground, playing your innate disposition like a master instrument to compose your life masterpiece.',
            jp: '超越に逃げ込まず現実の日常へ帰還し、与えられた気質を楽器として人生という芸術作品を能動的に奏でます。',
            cn: '不滞留于空洞的超越，重返现实大地，将天赋的气质视作乐器，亲手谱写人生的主权杰作。'
        },
        icon: '🎨'
    }
];

// ============== 평생교육원 5단계 자격 사다리 (Education Ladder) ==============
export const ACADEMY_COURSES: AcademyCourseLevel[] = [
    {
        levelNumber: 0,
        code: 'LEVEL_0',
        badge: '맛보기',
        title: {
            kr: '명심코칭 오픈클래스',
            en: 'Myeongsim Open Class',
            jp: '明心オープンスクール',
            cn: '明心体验公开课'
        },
        subtitle: {
            kr: '운명의 운전대를 되찾는 첫 번째 만남',
            en: 'First meeting to reclaim the steering wheel of destiny',
            jp: '運命のハンドルを取り戻す最初の出会い',
            cn: '重握命运方向盘的初次相逢'
        },
        targetRole: {
            kr: '나의 기질과 자동반응 패턴을 탐색한다',
            en: 'Explore innate temperament and automatic habits',
            jp: '生まれ持った気質と自動反応パターンを把握する',
            cn: '初探自身本质气质与自动反应模式'
        },
        targetAudience: {
            kr: '일반 성인, 삶의 방향과 피로감의 원인을 찾고 싶은 분',
            en: 'General adults, anyone seeking self-understanding',
            jp: '一般成人、生き方や疲れの原因を探求したい方',
            cn: '大众成人、渴望探寻人生迷茫与疲惫根源者'
        },
        recommendedHours: { kr: '2~3시간', en: '2-3 Hours', jp: '2〜3時間', cn: '2~3课时' },
        recommendedPrice: { kr: '무료 ~ 50,000원', en: 'Free ~ $40', jp: '無料〜5,000円', cn: '免费~250元' },
        primaryTextbooks: ['book_01'],
        unlockedSkillIds: ['MY_REPORT', 'MEMORY_DOJO', 'BENCHMARK', 'LIBRARY', 'ORACLE_CARD'],
        skillsDescription: [
            { kr: '📋 나의 리포트 (기본 사주 진단)', en: 'My Report', jp: 'マイレポート', cn: '我的体检报告' },
            { kr: '🎮 기억 훈련소 (단·중·장기 훈련)', en: 'Memory Dojo', jp: '記憶道場', cn: '记忆演练场' },
            { kr: '📖 명심도서관 (제로포인트 e-Book)', en: 'Library', jp: '電子図書館', cn: '明心图书馆' },
            { kr: '🃏 오늘의 명심 카드 (3D 드로우)', en: 'Daily Card', jp: '本日のオラクル', cn: '每日觉察卡' }
        ],
        coreKeywords: ['오픈클래스', '기질발견', '자동반응', '자각의시작'],
        examQuizId: 'quiz_lvl0'
    },
    {
        levelNumber: 1,
        code: 'LEVEL_1',
        badge: 'Level 1',
        title: {
            kr: '명심 셀프코치 (Self Coach)',
            en: 'Myeongsim Self Coach',
            jp: '明心セルフコーチ',
            cn: '明心自愈教练 (Self Coach)'
        },
        subtitle: {
            kr: '내 운명의 운전대를 되찾는 4주 명심코칭',
            en: '4-Week Journey to Reclaim the Driver Seat of Destiny',
            jp: '運命のハンドルを取り戻す4週間のセルフコーチング',
            cn: '重握命运方向盘的4周实战自愈课程'
        },
        targetRole: {
            kr: 'L1 = 나를 코칭한다 (셀프 코칭)',
            en: 'L1 = Coach Myself',
            jp: 'L1 = 自分自身をコーチングする',
            cn: 'L1 = 自我教练 (自愈与系统重置)'
        },
        targetAudience: {
            kr: '자기이해, 감정 조절, 반복되는 불행 각본을 끊고 싶은 일반인',
            en: 'Individuals seeking emotional regulation and pattern reset',
            jp: '感情コントロールや不自由なシナリオを書き換えたい方',
            cn: '渴望跳出负面循环剧本、实现情绪自主的大众学员'
        },
        recommendedHours: { kr: '12시간 (4주, 주 1회 3시간)', en: '12 Hours (4 Weeks)', jp: '12時間 (4週間)', cn: '12课时 (4周)' },
        recommendedPrice: { kr: '220,000 ~ 290,000원', en: '$190 ~ $250', jp: '22,000〜29,000円', cn: '1,200~1,500元' },
        primaryTextbooks: ['book_01', 'book_02'],
        unlockedSkillIds: ['ZERO_POINT_3S', 'GENIUS_DECODE'],
        skillsDescription: [
            { kr: '🌌 제로포인트 3S (Scan, Sync, Shift 3대 프로토콜 진단기)', en: 'Zero Point 3S Protocol', jp: 'ゼロポイント3Sプロトコル', cn: '零点3S核心协议' },
            { kr: '💡 본재(本財) 해독 (나의 본빛 기질 10대 하드웨어 자각)', en: 'Genius Hardware Decode', jp: '本財解読 (生得気質)', cn: '本财天赋硬件解码' }
        ],
        coreKeywords: ['하드웨어10기질', 'DarkCode', 'SCAN', 'SYNC', 'SHIFT', 'FreeWill'],
        examQuizId: 'quiz_lvl1'
    },
    {
        levelNumber: 2,
        code: 'LEVEL_2',
        badge: 'Level 2',
        title: {
            kr: '명심코칭 프랙티셔너 (Practitioner)',
            en: 'Myeongsim Practitioner',
            jp: '明心プラクティショナー',
            cn: '明心实战从业师 (Practitioner)'
        },
        subtitle: {
            kr: '명심코칭 8대 실전 도구 완벽 마스터 과정',
            en: 'Complete Mastery of 8 Practical Coaching Tools',
            jp: '明心コーチング8大ツールの実践マスター講座',
            cn: '明心八大核心实战工具精通认证课'
        },
        targetRole: {
            kr: 'L2 = 명심코칭 도구를 능숙하게 사용한다',
            en: 'L2 = Skilfully Apply Myeongsim Coaching Tools',
            jp: 'L2 = 明心コーチングのツールを自在に駆使できる',
            cn: 'L2 = 娴熟驾驭与操作全套心智重塑工具'
        },
        targetAudience: {
            kr: '자기계발·심리상담 관심자, 조직 내 소통 리더, 타인 지원자',
            en: 'Psychology enthusiasts, HR leaders, active self-developers',
            jp: '心理カウンセリング関心層、組織のコミュニケーションリーダー',
            cn: '心理学爱好者、HR管理者、致力于深度助人与自我精进人士'
        },
        recommendedHours: { kr: '30시간 (8주 과정)', en: '30 Hours (8 Weeks)', jp: '30時間 (8週間)', cn: '30课时 (8周)' },
        recommendedPrice: { kr: '590,000 ~ 690,000원', en: '$490 ~ $590', jp: '59,000〜69,000円', cn: '3,200~3,800元' },
        primaryTextbooks: ['book_03', 'book_04'],
        unlockedSkillIds: ['INNER_HEALING', 'DARK_DECODING', 'MIRROR_ROOM'],
        skillsDescription: [
            { kr: '💎 내면치유 코어 (5대 감정 연금술 솔루션)', en: 'Inner Healing Core (5 Alchemy Tools)', jp: '内面癒しコア (5大錬金術)', cn: '内在疗愈核心 (5大炼金术)' },
            { kr: '⚡ 다크 디코딩 (과출력된 Legacy Driver 에너지 전환기)', en: 'Dark Decoding & Rewiring', jp: 'ダークデコーディング', cn: '暗码逆转与神经重构' },
            { kr: '🪞 거울의 방 (참나 자각 & 1:1 미러링 코칭)', en: 'Mirror Room Awareness', jp: '鏡の部屋 (真我覚知)', cn: '明镜之室 (真我镜映)' }
        ],
        coreKeywords: ['64LifeCode', '3S매뉴얼', '내면연금술', '다크디코딩', '거울의방'],
        examQuizId: 'quiz_lvl2'
    },
    {
        levelNumber: 3,
        code: 'LEVEL_3',
        badge: 'Level 3',
        title: {
            kr: '명심코치 (Professional Coach)',
            en: 'Myeongsim Coach',
            jp: '明心プロフェッショナルコーチ',
            cn: '明心专业教练 (Coach)'
        },
        subtitle: {
            kr: '다른 사람을 전문적으로 코칭하는 실전 코치 양성과정',
            en: 'Professional Coach Training to Transform Others',
            jp: '他者をプロとしてコーチングする実践コーチ養成講座',
            cn: '赋能他者、落地真实改变的专业执业教练体系'
        },
        targetRole: {
            kr: 'L3 = 다른 사람을 1:1로 코칭한다',
            en: 'L3 = Coach Others 1-on-1',
            jp: 'L3 = 他者を1対1でコーチングする',
            cn: 'L3 = 开展一对一专业深度辅导'
        },
        targetAudience: {
            kr: '전문 코치·상담사 지망자, 사내 코치, 커리어 멘토',
            en: 'Aspiring coaches, counselors, career mentors',
            jp: 'プロコーチ・カウンセラー志望者、企業内コーチ',
            cn: '职业教练志向者、咨询师、企业内训师、职业发展导师'
        },
        recommendedHours: { kr: '60시간 (이론 24 + 실습 24 + 멘토코칭 12)', en: '60 Hours', jp: '60時間', cn: '60课时 (理论+实战)' },
        recommendedPrice: { kr: '1,100,000 ~ 1,390,000원', en: '$950 ~ $1,200', jp: '110,000〜139,000円', cn: '6,200~7,500元' },
        primaryTextbooks: ['book_05', 'book_06', 'book_07'],
        unlockedSkillIds: ['NTS_CAREER', 'WATCH_WELLNESS', 'COACHING_SONG', 'MIND_DEBUGGER'],
        skillsDescription: [
            { kr: '💼 국세청 공식 창업·N잡 리포트 (1:1 실전 진로·업태 코칭)', en: 'Business & Career 1:1 Architecture', jp: '起業・キャリア実戦コーチング', cn: '国税厅官方创业N职实战报告' },
            { kr: '⌚ 워치 웰니스 (애플·갤럭시 스마트워치 생체 바이오피드백 코칭)', en: 'Smartwatch Bio-Wellness', jp: 'スマートウォッチ生体コーチング', cn: '智能手表实时生物反馈' },
            { kr: '🎧 기질 1:1 맞춤 코칭 에세이노래 (432Hz/528Hz 파동 리셋)', en: '432Hz Personalized Coaching Songs', jp: '気質別432Hzコーチングソング', cn: '432Hz能量声波疗愈曲' },
            { kr: '💻 마인드 디버거 (의식 오류 분석 및 시간선 재배선)', en: 'Mind Debugger Timeline Rewire', jp: 'マインドデバッガー (意識タイムライン)', cn: '心智调试器 (时间线重排)' }
        ],
        coreKeywords: ['ZeroPoint', '1on1세션', '바이오피드백', '국세청업태', '치유음악'],
        examQuizId: 'quiz_lvl3'
    },
    {
        levelNumber: 4,
        code: 'LEVEL_4',
        badge: 'Level 4',
        title: {
            kr: '명심 프로코치 (Pro Master Coach)',
            en: 'Myeongsim Pro Coach',
            jp: '明心マスターコーチ',
            cn: '明心高级资深督导教练 (Pro Coach)'
        },
        subtitle: {
            kr: '복잡한 난제 사례를 통합적으로 다루는 마스터 코치',
            en: 'Master Coach Integrating Complex Life Case Scenarios',
            jp: '複雑な難問ケースを統合的に扱うマスターコーチ',
            cn: '综合驾驭多维复杂案例与重大生命议题的资深教练'
        },
        targetRole: {
            kr: 'L4 = 복잡한 사례를 통합적으로 코칭한다',
            en: 'L4 = Comprehensively Coach Complex Cases',
            jp: 'L4 = 複雑なケースを統合的にコーチングする',
            cn: 'L4 = 整合解决复杂疑难与系统性人生困局'
        },
        targetAudience: {
            kr: '시니어 코치, 임원 코칭 전문가, 부부·가족 갈등 해결 전문가',
            en: 'Executive coaches, family systems specialists',
            jp: 'エグゼクティブコーチ、家族関係・組織紛争の専門家',
            cn: '企业高管教练、家族关系及深层心理症结化解专家'
        },
        recommendedHours: { kr: '100시간 (실제 고객 실습 30시간 포함)', en: '100 Hours', jp: '100時間 (実務実習含む)', cn: '100课时 (含30h督导实战)' },
        recommendedPrice: { kr: '1,900,000 ~ 2,400,000원', en: '$1,600 ~ $2,000', jp: '190,000〜240,000円', cn: '10,000~13,000元' },
        primaryTextbooks: ['book_07', 'book_08'],
        unlockedSkillIds: ['DESTINY_MAP', 'GENIUS_REPORT', 'ALIGNMENT', 'SOVEREIGN_REPORT'],
        skillsDescription: [
            { kr: '🗺️ 천명 지도 (64 Life Code 삶의 궤적과 운명 매핑)', en: '64 Life Codes Destiny Map', jp: '天命マップ (64コード軌跡)', cn: '天命全景图谱 (64生命代码)' },
            { kr: '🧬 천부 성정 8페이지 전면 심층 해독서', en: 'Genius 8-Page Full Blueprint', jp: '天賦性情8P全面解読', cn: '天赋性情8页深度全景解构' },
            { kr: '☯️ 격국 연금술 (삶의 격과 에너지 균형추 조정)', en: 'Structure Alchemy Balance', jp: '格局錬金術 (エネルギー均衡)', cn: '格局炼金术 (能量终极平衡)' },
            { kr: '🔬 통합 심층 마스터 리포트 (사회적 기여 완성본)', en: 'Sovereign Master Report', jp: '統合深層マスターレポート', cn: '明心主权大师综合白皮书' }
        ],
        coreKeywords: ['난제사례100선', '64LifeCode완전해독', '코칭윤리', '임원코칭'],
        examQuizId: 'quiz_lvl4'
    },
    {
        levelNumber: 5,
        code: 'LEVEL_5',
        badge: 'Level 5',
        title: {
            kr: '명심 마스터·강사 (Master & Instructor)',
            en: 'Master & Chief Instructor',
            jp: '明心マスター・公認講師',
            cn: '明心总导师·首席讲师 (Master & Instructor)'
        },
        subtitle: {
            kr: '코치를 양성하고 교육 프로그램을 총괄 운영하는 최고 권위',
            en: 'Train-the-Trainer: Educate Future Coaches and Run Centers',
            jp: 'コーチを育成し教育プログラムを統括・指導する最高位',
            cn: '培养教练新苗、统筹教育中心课程的最高导师认证'
        },
        targetRole: {
            kr: 'L5 = 코치를 교육하고 프로그램을 총괄 운영한다',
            en: 'L5 = Educate Coaches & Operate Programs',
            jp: 'L5 = コーチを育成しプログラムを統括する',
            cn: 'L5 = 培育执业教练并总览运营平生教育院'
        },
        targetAudience: {
            kr: '평생교육원 지부장, 공인 교수진, 강사 양성 희망자',
            en: 'Branch heads, accredited faculty, master trainers',
            jp: '教育センター支部長、公認教授陣、講師養成希望者',
            cn: '平生教育院分院院长、公认导师团、高级师资合伙人'
        },
        recommendedHours: { kr: '80시간 + 강의시연 및 슈퍼비전', en: '80 Hours + Supervision', jp: '80時間 + 模擬講義実習', cn: '80课时 + 讲师实操考核' },
        recommendedPrice: { kr: '2,200,000 ~ 2,900,000원', en: '$1,900 ~ $2,500', jp: '220,000〜290,000円', cn: '12,000~16,000元' },
        primaryTextbooks: ['book_01', 'book_02', 'book_03', 'book_04', 'book_05', 'book_06', 'book_07', 'book_08'],
        unlockedSkillIds: ['ACADEMY_CURRICULUM', 'CERT_CENTER', 'TRAIN_THE_TRAINER'],
        skillsDescription: [
            { kr: '🏛️ 평생교육원 공인 커리큘럼 대시보드 (8권 교재 & 연간 일정 총괄)', en: 'Official Academy Curriculum Hub', jp: '教育院公認カリキュラム本部', cn: '平生教育院官方教学总指挥中枢' },
            { kr: '🎓 공인 자격증 및 수료증 검증·발급 센터', en: 'Certification Issuance Center', jp: '修了証・資格証発行センター', cn: '官方认证资质证书审发中心' },
            { kr: '👑 마스터 강사용 Train-the-Trainer 강의 지도 매뉴얼', en: 'Master Trainer Toolset', jp: 'マスター講師指導ツール', cn: '导师级授课指导实操系统' }
        ],
        coreKeywords: ['TrainTheTrainer', '평생교육원장', '슈퍼비전', '브랜드수호'],
        examQuizId: 'quiz_lvl5'
    }
];

// ============== 평생교육원 공인 8권 교재 체계 ==============
export const ACADEMY_TEXTBOOKS: AcademyTextbook[] = [
    {
        id: 'book_01',
        number: 1,
        title: {
            kr: '《명심코칭 입문: 운명의 각본을 다시 쓰는 심리수업》',
            en: 'Intro to Myeongsim Coaching: Rewriting the Script of Destiny',
            jp: '『明心コーチング入門: 運命の脚本を書き換える心理学』',
            cn: '《明心教练入门：重写命运脚本的心灵课》'
        },
        subtitle: {
            kr: 'Level 1 명심 셀프코치 기본 교재',
            en: 'Primary Textbook for Level 1 Self Coach',
            jp: 'Level 1 セルフコーチ必須テキスト',
            cn: 'Level 1 自我教练核心教材'
        },
        role: {
            kr: '자각과 탈융합, 삶의 주도권 회복',
            en: 'Awareness, defusion, regaining sovereignty',
            jp: '自覚、脱フュージョン、主導権の回復',
            cn: '觉察解离、重获生命主导权'
        },
        targetLevels: [0, 1],
        tableOfContents: [
            {
                part: { kr: 'Part 1. 자각 (Awareness)', en: 'Part 1. Awareness', jp: '第1部 自覚', cn: '第一部分 觉察' },
                chapters: [
                    { kr: '1장. 나는 어떤 캐릭터인가', en: '1. What character am I?', jp: '第1章 私はどんなキャラクターか', cn: '第1章 我是何种生命角色' },
                    { kr: '2장. 네 가지 기둥 (Four Pillars)', en: '2. The Four Pillars', jp: '第2章 4つの柱', cn: '第2章 四大时空支柱' },
                    { kr: '3장. 결핍은 창조의 공간이다', en: '3. Deficiency is the canvas of creation', jp: '第3章 欠乏は創造のキャンバス', cn: '第3章 匮乏是创造的沃土' },
                    { kr: '4장. 반복되는 고통과 Dark Code', en: '4. Recurring pain and Dark Code', jp: '第4章 繰り返される苦痛とダークコード', cn: '第4章 轮回之苦与隐匿暗码' }
                ]
            },
            {
                part: { kr: 'Part 2. 변화 (Transformation)', en: 'Part 2. Transformation', jp: '第2部 変化', cn: '第二部分 转变' },
                chapters: [
                    { kr: '5장. 감정과 거리두기 (Defusion)', en: '5. Distancing from emotions', jp: '第5章 感情との距離をとる', cn: '第5章 与汹涌情绪拉开距离' },
                    { kr: '6장. 온전한 수용 (Acceptance)', en: '6. Radical acceptance', jp: '第6章 丸ごとの受容', cn: '第6章 毫无保留的全然接纳' },
                    { kr: '7장. 관점과 자유의지 (Free Will)', en: '7. Perspective & Free Will', jp: '第7章 視点と自由意志', cn: '第7章 视角跃迁与自由意志' },
                    { kr: '8장. 작은 행동의 기적 (Micro Action)', en: '8. Miracle of Micro Action', jp: '第8章 小さな行動の奇跡', cn: '第8章 微小行动引发的奇迹' }
                ]
            },
            {
                part: { kr: 'Part 3. 초월 (Transcendence)', en: 'Part 3. Transcendence', jp: '第3部 超越', cn: '第三部分 超越' },
                chapters: [
                    { kr: '9장. 중심 잡기 (Being Centered)', en: '9. Being centered in the storm', jp: '第9章 嵐の中の中心保持', cn: '第9章 于狂风骤雨中安住核心' },
                    { kr: '10장. 삶을 예술로 만들기', en: '10. Transforming life into art', jp: '第10章 人生を芸術作品へ', cn: '第10章 将日常点滴化作生命艺术' },
                    { kr: '11장. 순수 관찰자와 Meta Code', en: '11. Pure Observer & Meta Code', jp: '第11章 純粋観察者とメタコード', cn: '第11章 纯粹观察者与元代码' }
                ]
            }
        ]
    },
    {
        id: 'book_02',
        number: 2,
        title: {
            kr: '《명심 코드: Mind OS》',
            en: 'Myeongsim Code: Mind OS',
            jp: '『明心コード: Mind OS』',
            cn: '《明心代码：Mind OS心智系统》'
        },
        subtitle: {
            kr: 'Level 1~2 핵심 이론서',
            en: 'Core Theoretical Manual for Levels 1-2',
            jp: 'Level 1〜2 中核理論書',
            cn: 'Level 1~2 核心理论教程'
        },
        role: {
            kr: '10 Hardware & Dark-Neural-Meta 시스템 매뉴얼',
            en: '10 Hardware & Dark-Neural-Meta Operating Manual',
            jp: '10のハードウェアとDark-Neural-Meta OS解説書',
            cn: '10大硬件架构与三阶心智处理器全解'
        },
        targetLevels: [1, 2],
        tableOfContents: [
            {
                part: { kr: '제1부. Hardware Architecture (10대 본질 기질)', en: 'Part 1. Hardware (10 Core Archetypes)', jp: '第1部 ハードウェア設計 (10大気質)', cn: '第一部分 硬件架构 (十大本质气质)' },
                chapters: [
                    { kr: '01. 甲 전진돌파형', en: '01. Jia (甲): Frontier Pioneer', jp: '01. 甲 (直進突破型)', cn: '01. 甲木：前沿开拓破局型' },
                    { kr: '02. 乙 유연네트워크형', en: '02. Yi (乙): Flexible Networker', jp: '02. 乙 (柔軟ネットワーク型)', cn: '02. 乙木：韧性网络联结型' },
                    { kr: '03. 丙 스케일업확장형', en: '03. Bing (丙): Scale-up Expander', jp: '03. 丙 (拡大拡散型)', cn: '03. 丙火：裂变扩张聚光型' },
                    { kr: '04. 丁 정밀타겟형', en: '04. Ding (丁): Precision Targeter', jp: '04. 丁 (精密照準型)', cn: '04. 丁火：精准聚焦穿透型' },
                    { kr: '05. 戊 철옹성수호형', en: '05. Wu (戊): Fortress Guardian', jp: '05. 戊 (要塞守護型)', cn: '05. 戊土：不动如山守御型' },
                    { kr: '06. 己 내실결실형', en: '06. Ji (己): Solid Fruit-bearer', jp: '06. 己 (着実結実型)', cn: '06. 己土：务实滋养结实型' },
                    { kr: '07. 庚 결단혁신형', en: '07. Geng (庚): Decisive Innovator', jp: '07. 庚 (決断改革型)', cn: '07. 庚金：果决斩断变革型' },
                    { kr: '08. 辛 초정밀완결형', en: '08. Xin (辛): Diamond Perfectionist', jp: '08. 辛 (超精密完結型)', cn: '08. 辛金：至臻打磨淬炼型' },
                    { kr: '09. 壬 글로벌통섭형', en: '09. Ren (壬): Global Synthesizer', jp: '09. 壬 (大洋統合型)', cn: '09. 壬水：大江巨流统摄型' },
                    { kr: '10. 癸 영감통찰형', en: '10. Gui (癸): Intuitive Visionary', jp: '10. 癸 (直感洞察型)', cn: '10. 癸水：润物透彻灵感型' }
                ]
            },
            {
                part: { kr: '제2부. Mind Processor', en: 'Part 2. Mind Processor', jp: '第2部 マインドプロセッサー', cn: '第二部分 心智运算处理器' },
                chapters: [
                    { kr: '11. Dark Code (과거의 생존 드라이버)', en: '11. Dark Code (Legacy Survivor)', jp: '11. ダークコード (生存ドライバー)', cn: '11. 隐匿暗码 (历史生存驱动)' },
                    { kr: '12. Neural Code (신경망 재해석)', en: '12. Neural Code (Creative Reframe)', jp: '12. ニューラルコード (再解釈)', cn: '12. 神经代码 (创造性重构)' },
                    { kr: '13. Meta Code (순수 관찰자 시선)', en: '13. Meta Code (Observer Perspective)', jp: '13. メタコード (純粋観察)', cn: '13. 元代码 (纯粹观察视角)' }
                ]
            },
            {
                part: { kr: '제3부. 3S 프로토콜', en: 'Part 3. 3S Protocol', jp: '第3部 3Sプロトコル', cn: '第三部分 3S核心协议' },
                chapters: [
                    { kr: '14. SCAN: Fact와 Story 분리', en: '14. SCAN: Separate Fact from Story', jp: '14. SCAN: 事実と物語の分離', cn: '14. SCAN：剥离事实与故事' },
                    { kr: '15. SYNC: 자기연민과 감정 허용', en: '15. SYNC: Embrace & Compassion', jp: '15. SYNC: 自己受容と慈愛', cn: '15. SYNC：全然接纳自我慈悲' },
                    { kr: '16. SHIFT: 가치 기반 행동 선택', en: '16. SHIFT: Value-driven Action', jp: '16. SHIFT: 価値志向の選択', cn: '16. SHIFT：践行价值导向抉择' }
                ]
            },
            {
                part: { kr: '제4부 & 5부. Zero-Point & 30일 OS 리셋', en: 'Part 4 & 5. Zero-Point & 30-Day Reset', jp: '第4・5部 ゼロポイント & 30日リセット', cn: '第四与五部分 零点状态与30天重置' },
                chapters: [
                    { kr: '17. 관찰자와 순수 자각 (Zero-Point)', en: '17. The Observer & Zero-Point', jp: '17. 観察者と純粋覚知', cn: '17. 观察者与纯粹本觉' },
                    { kr: '18. 30일 OS 리셋 마이크로 루틴', en: '18. 30-Day OS Reset Routine', jp: '18. 30日間OSリセット習慣', cn: '18. 30天系统重置微习惯' }
                ]
            }
        ]
    },
    {
        id: 'book_03',
        number: 3,
        title: {
            kr: '《64 Life Code 해독학: 인간 행동의 64가지 알고리즘》',
            en: '64 Life Codes: 64 Algorithms of Human Behavior',
            jp: '『64 Life Code 解読学: 人間行動の64アルゴリズム』',
            cn: '《64生命代码破译学：人类行为的64种底层算法》'
        },
        subtitle: {
            kr: '명심코칭의 독보적 차별화 고급 교재',
            en: 'Proprietary Differentiator for Level 2 Practitioners',
            jp: '明心コーチングの差別化された中核教本',
            cn: '明心教练核心差异化进阶典籍'
        },
        role: {
            kr: '주역 64괘를 Dark-Neural-Meta 3단계 행동패턴으로 표준화',
            en: 'Standardizing 64 Hexagrams into Dark-Neural-Meta Triads',
            jp: '易経64卦をDark-Neural-Metaの3階層へ標準化',
            cn: '将周易64卦系统解构为三维行为模式与实操问题'
        },
        targetLevels: [2, 3, 4],
        tableOfContents: [
            {
                part: { kr: '총론. 64 Life Code 표준 포맷', en: 'Format Blueprint', jp: '総論 64コード標準構成', cn: '总论 64代码标准范式' },
                chapters: [
                    { kr: '① 원전 주역 괘 & 핵심 에너지', en: '1. Original Hexagram & Energy', jp: '1. 原典卦とコアエネルギー', cn: '1. 原始卦象与核心能量' },
                    { kr: '② 인간 행동 패턴 & Legacy Driver', en: '2. Human Pattern & Legacy Driver', jp: '2. 行動パターンと生存ドライバー', cn: '2. 行为模式与遗留驱动' },
                    { kr: '③ Dark Code (버그/과출력 상태)', en: '3. Dark Code Overdrive', jp: '3. ダークコード (過出力状態)', cn: '3. 隐匿暗码 (过载失衡态)' },
                    { kr: '④ Neural Code (신경망 재해석)', en: '4. Neural Code Reframe', jp: '4. ニューラルコード (再解釈)', cn: '4. 神经重构代码 (破局解)' },
                    { kr: '⑤ Meta Code & 3S Coaching Question', en: '5. Meta Code & 3S Questions', jp: '5. メタコードと3S問いかけ', cn: '5. 元代码与3S辅导发问' }
                ]
            },
            {
                part: { kr: 'Code 01 ~ 64 전편', en: 'Codes 01 through 64', jp: 'コード01〜64 全編', cn: '第01至64代码全录' },
                chapters: [
                    { kr: 'Code 01~16: 씨앗과 돌파 (창조와 발아)', en: 'Codes 01-16: Creation & Breakthrough', jp: 'コード01〜16: 創造と突破', cn: '01~16：创生与突破' },
                    { kr: 'Code 17~32: 성장과 시련 (관계와 연금술)', en: 'Codes 17-32: Growth & Crucible', jp: 'コード17〜32: 成長と試練', cn: '17~32：淬炼与关系' },
                    { kr: 'Code 33~48: 전환과 도약 (심층 디버깅)', en: 'Codes 33-48: Transformation & Jump', jp: 'コード33〜48: 転換と跳躍', cn: '33~48：转折与跃迁' },
                    { kr: 'Code 49~64: 완성괴 초월 (Zero-Point 통합)', en: 'Codes 49-64: Completion & Integration', jp: 'コード49〜64: 完成と超越', cn: '49~64：圆融与超越' }
                ]
            }
        ]
    },
    {
        id: 'book_04',
        number: 4,
        title: {
            kr: '《3S 명심코칭 실전 매뉴얼: SCAN·SYNC·SHIFT》',
            en: '3S Practical Coaching Manual: SCAN·SYNC·SHIFT',
            jp: '『3S 明心コーチング実践マニュアル』',
            cn: '《3S明心教练实战手册：SCAN·SYNC·SHIFT》'
        },
        subtitle: {
            kr: '“그래서 실제 세션에서는 뭘 하죠?”에 대한 완벽한 해답',
            en: 'The Definite Answer to "What exactly do we do in a session?"',
            jp: '「実際のセッションでは何をすべきか」に対する完璧な答え',
            cn: '关于“教练会谈究竟如何实操”的终极实操指南'
        },
        role: {
            kr: '24개 실전 프로토콜과 질문법, 세션 구조화',
            en: '24 Action Protocols, Inquiry Methods, Session Structuring',
            jp: '24の実戦プロトコルと問いかけ技法',
            cn: '24套标准化流程、发问模型与全案架构'
        },
        targetLevels: [2, 3],
        tableOfContents: [
            {
                part: { kr: '1부. SCAN 프로토콜 (8개)', en: 'Part 1. SCAN Protocols', jp: '第1部 SCAN (8プロトコル)', cn: '第一部分 SCAN扫描体系 (8法)' },
                chapters: [
                    { kr: '01. 자동반응이란 무엇인가 / 02. Fact와 Story 구분', en: '1. What is Automatic Habit / 2. Fact vs Story', jp: '1. 自動反応の正体 / 2. FactとStoryの分離', cn: '1. 自动反应本质 / 2. 事实与故事界定' },
                    { kr: '03. 감정 신호 읽기 / 04. 몸의 반응 읽기', en: '3. Emotional Signals / 4. Somatic Cues', jp: '3. 感情シグナル / 4. 身体感覚の読解', cn: '3. 情绪信号捕捉 / 4. 身体体感解读' },
                    { kr: '05. Dark Code Naming / 06. Pattern Tracking', en: '5. Dark Code Naming / 6. Pattern Tracking', jp: '5. コード命名 / 6. パタントラッキング', cn: '5. 暗码命名赋名 / 6. 行为轨迹追踪' }
                ]
            },
            {
                part: { kr: '2부. SYNC 프로토콜 (8개)', en: 'Part 2. SYNC Protocols', jp: '第2部 SYNC (8プロトコル)', cn: '第二部分 SYNC同步体系 (8法)' },
                chapters: [
                    { kr: '09. 수용과 포기의 차이 / 10. MSC 자기연민', en: '9. Acceptance vs Resignation / 10. Self-Compassion', jp: '9. 受容と諦めの違い / 10. 自己慈愛MSC', cn: '9. 全然接纳与躺平放弃 / 10. 自我慈爱' },
                    { kr: '11. Legacy Driver 이해 / 12. 저항과 경험회피', en: '11. Legacy Driver / 12. Resistance & Avoidance', jp: '11. 生存ドライバー / 12. 抵抗と経験回避', cn: '11. 认同历史驱动 / 12. 瓦解经验回避' },
                    { kr: '13. 인지적 탈융합 / 15. 자신의 장르 인정하기', en: '13. Cognitive Defusion / 15. Owning Your Genre', jp: '13. 脱フュージョン / 15. 自己のジャンル肯定', cn: '13. 认知彻底解离 / 15. 坦然认同自我体裁' }
                ]
            },
            {
                part: { kr: '3부. SHIFT 프로토콜 (8개)', en: 'Part 3. SHIFT Protocols', jp: '第3部 SHIFT (8プロトコル)', cn: '第三部分 SHIFT跃迁体系 (8法)' },
                chapters: [
                    { kr: '17. 가치 발견 / 18. 선택과 책임 (Free Will)', en: '17. Value Discovery / 18. Free Will Choice', jp: '17. 価値発見 / 18. 選択と責任', cn: '17. 真实核心价值 / 18. 自由意志责任' },
                    { kr: '20. Micro Action 설계 / 21. 건강한 경계 설정', en: '20. Micro Action Design / 21. Healthy Boundaries', jp: '20. 微小行動設計 / 21. 健全な境界線', cn: '20. 微行动触发展开 / 21. 建立健康边界' }
                ]
            }
        ]
    },
    {
        id: 'book_05',
        number: 5,
        title: {
            kr: '《Zero-Point 명심코칭: 침묵 속의 무한한 지혜》',
            en: 'Zero-Point Myeongsim Coaching: Wisdom of Stillness',
            jp: '『Zero-Point 明心コーチング: 静寂の中の無限知恵』',
            cn: '《零点明心教练：寂静深处的无限智慧》'
        },
        subtitle: {
            kr: '초월에서 머물지 않고 현실 행동으로 귀환하는 상위 의식 코칭',
            en: 'Higher Consciousness Coaching Returning to Pragmatic Action',
            jp: '超越に留まらず現実の行動へと着地する高次元コーチング',
            cn: '不坠空性幻梦、扎实行践于现实的终极意识辅导'
        },
        role: {
            kr: 'Level 3 이상 전용 — 영적 우회(Spiritual Bypass) 방지',
            en: 'Advanced Manual Preventing Spiritual Bypass',
            jp: 'スピリチュアル・バイパスを排した高次元実践書',
            cn: '防范灵性逃避、淬炼坚实意志的进阶教程'
        },
        targetLevels: [3, 4, 5],
        tableOfContents: [
            {
                part: { kr: '1장~6장. 관찰자 자각', en: 'Observer Awareness', jp: '第1〜6章 観察者の目覚め', cn: '1~6章 观察者本体' },
                chapters: [
                    { kr: '생각은 나인가? 감정은 나인가?', en: 'Are thoughts me? Are feelings me?', jp: '思考は私か？感情は私か？', cn: '念头是我吗？情绪是我吗？' },
                    { kr: 'Zoom-Out과 Background Awareness', en: 'Zoom-Out & Background Awareness', jp: 'ズームアウトと背景の覚知', cn: '百米拉远与背景纯知' }
                ]
            },
            {
                part: { kr: '7장~12장. 현실로의 귀환', en: 'Return to Reality', jp: '第7〜12章 現実への帰還', cn: '7~12章 现实之创生' },
                chapters: [
                    { kr: '영화와 스크린 (타오르는 불길도 스크린을 태우지 못한다)', en: 'Movie vs Screen: Fire cannot burn the screen', jp: '映画とスクリーン (火もスクリーンを焼けない)', cn: '电影与屏幕 (熊熊烈火烧不毁纯白银幕)' },
                    { kr: 'Being(존재)과 Doing(행위)의 완전한 일치', en: 'Unity of Being and Doing', jp: 'BeingとDoingの完全調和', cn: '本然存在(Being)与行动造作(Doing)的圆融' },
                    { kr: '★ 12장: Zero-Point에서 현실 행동으로 돌아오기 (삶의 창조)', en: 'Ch 12: Returning from Zero-Point to Action', jp: '第12章 ゼロポイントから現実行動への帰還', cn: '第12章 从零点归来：在泥泞现实中挥毫创造' }
                ]
            }
        ]
    },
    {
        id: 'book_06',
        number: 6,
        title: {
            kr: '《명심코칭 실전 워크북: 10대 저널 컬렉션》',
            en: 'Myeongsim Coaching Workbook: 10 Journal Collections',
            jp: '『明心コーチング実戦ワークブック: 10大ジャーナル』',
            cn: '《明心教练实战手册：十大实修日志全集》'
        },
        subtitle: {
            kr: '이론을 현실 습관으로 바꾸는 기록과 체화의 성물',
            en: 'The Holy Grail Transforming Theory into Daily Habits',
            jp: '理論を日常の習慣へと落とし込む記録の書',
            cn: '将深邃理论转化为日常肌肉记忆的心智练习册'
        },
        role: {
            kr: '수강생 만족도를 극대화하는 10대 실전 기록 템플릿',
            en: '10 Hands-on Logging Templates Maximizing Completion',
            jp: '満足度を最大化する10の実践ログテンプレート',
            cn: '最大化教学转化率的十大实操日志范本'
        },
        targetLevels: [1, 2, 3, 4, 5],
        tableOfContents: [
            {
                part: { kr: '10대 필수 실전 저널', en: '10 Essential Journals', jp: '10大必須ワークシート', cn: '十大必备实修日志' },
                chapters: [
                    { kr: 'Workbook 1. 내 Hardware 진단 체크리스트', en: '1. Innate Hardware Checklist', jp: '1. ハードウェア診断チェック', cn: '1. 硬件自检诊断清单' },
                    { kr: 'Workbook 2. Dark Code Log (Trigger-Fact-Story-Emotion-Body)', en: '2. Dark Code Log Sheet', jp: '2. ダークコードログ', cn: '2. 暗码日志 (触发-事实-故事-身心)' },
                    { kr: 'Workbook 3. 3S SCAN 정밀 기록장', en: '3. SCAN Precision Log', jp: '3. SCAN精密記録シート', cn: '3. SCAN 精准扫描记录表' },
                    { kr: 'Workbook 4. SYNC 자기연민 허용 일지', en: '4. SYNC Compassion Journal', jp: '4. SYNC自己慈愛日誌', cn: '4. SYNC 自我慈悲接纳日志' },
                    { kr: 'Workbook 5. SHIFT 가치 실행 트래커', en: '5. SHIFT Value Action Tracker', jp: '5. SHIFT行動トラッカー', cn: '5. SHIFT 价值微行动追踪表' },
                    { kr: 'Workbook 6. 30일 Neural Rewiring 챌린지', en: '6. 30-Day Rewiring Challenge', jp: '6. 30日神経再配線チャレンジ', cn: '6. 30天神经回路重构挑战' },
                    { kr: 'Workbook 7. Zero-Point Journal (심해 고요 기록)', en: '7. Zero-Point Stillness Log', jp: '7. ゼロポイント日誌', cn: '7. 零点寂静沉淀日记' },
                    { kr: 'Workbook 8. 나의 64 Life Code 해독표', en: '8. Personal 64 Life Code Matrix', jp: '8. 個人64コード解読表', cn: '8. 个人生命代码破译对照表' },
                    { kr: 'Workbook 9. 관계 코드 & 건강한 경계장', en: '9. Relationship Code & Boundaries', jp: '9. 関係コードと境界線', cn: '9. 关系代码与健康心理防线' },
                    { kr: 'Workbook 10. 100일 Free Will 자유의지 선언문', en: '10. 100-Day Free Will Declaration', jp: '10. 100日自由意志宣言書', cn: '10. 百日自由意志重生日记' }
                ]
            }
        ]
    },
    {
        id: 'book_07',
        number: 7,
        title: {
            kr: '《명심코칭 사례집: 100대 실전 케이스 스터디》',
            en: 'Case Studies: 100 Real-World Coaching Cases',
            jp: '『明心コーチング事例集: 100大実戦ケーススタディ』',
            cn: '《明心教练案例集：100个真实深度实战案卷》'
        },
        subtitle: {
            kr: '직장, 부부, 부모자녀, 완벽주의, 은퇴 등 전 영역 완벽 분석',
            en: 'Covers Workplace, Couple, Parenting, Perfectionism, Retirement',
            jp: '職場、夫婦、親子、完璧主義、引退など全領域を網羅',
            cn: '职场、婚姻、亲子、完美主义、退休全场景案卷'
        },
        role: {
            kr: '상황 → Hardware → Dark → 3S → Action 표준 형식 통일',
            en: 'Standardized Case Framework: Trigger → Dark → 3S → Action',
            jp: '状況→気質→Dark→3S→Actionの標準化分析',
            cn: '统一规范：现状→硬件→暗码→3S→行动'
        },
        targetLevels: [3, 4, 5],
        tableOfContents: [
            {
                part: { kr: '100대 사례 8대 도메인 분류', en: '100 Cases Across 8 Domains', jp: '100事例 8大ドメイン分類', cn: '百大案卷八大领域归类' },
                chapters: [
                    { kr: '1. 직장 내 번아웃·상사 갈등 (20건)', en: '1. Workplace Burnout & Conflict (20)', jp: '1. 職場のバーンアウト・対立 (20件)', cn: '1. 职场耗竭与上下级冲突 (20例)' },
                    { kr: '2. 부부 소통 불능 및 성향 충돌 (15건)', en: '2. Couple Disconnection (15)', jp: '2. 夫婦の断絶と相性摩擦 (15件)', cn: '2. 婚姻沟通冰封与性格碰撞 (15例)' },
                    { kr: '3. 부모-자녀 양육 및 불안 전이 (15건)', en: '3. Parent-Child Anxiety Transfer (15)', jp: '3. 親子の不安連鎖 (15件)', cn: '3. 亲子焦虑投射与代际创伤 (15例)' },
                    { kr: '4. 완벽주의, 불안, 가면증후군 등 자기조절 (15건)', en: '4. Perfectionism & Imposter Syndrome (15)', jp: '4. 完璧主義・自己否定 (15件)', cn: '4. 完美主义、冒充者综合征 (15例)' },
                    { kr: '5. 연애 의존 및 회피 애착 패턴 (10건)', en: '5. Romantic Attachment Issues (10)', jp: '5. 恋愛依存と回避傾向 (10件)', cn: '5. 亲密关系依赖与回避依恋 (10例)' },
                    { kr: '6. 조직 리더십 및 권위 갈등 (10건)', en: '6. Leadership Under Pressure (10)', jp: '6. リーダーシップと重圧 (10件)', cn: '6. 组织领袖决断与高压困局 (10例)' },
                    { kr: '7. 중년 위기, 은퇴, 제2인생 재부팅 (5건)', en: '7. Mid-life & Retirement Reboot (5)', jp: '7. 中年の危機・第二の人生 (5件)', cn: '7. 中年危机与退休二次起跑 (5例)' },
                    { kr: '8. 청년 진로 방황 및 정체성 혼란 (10건)', en: '8. Youth Career Lostness (10)', jp: '8. キャリア迷走 (10件)', cn: '8. 青年生涯迷茫与自我确认 (10例)' }
                ]
            }
        ]
    },
    {
        id: 'book_08',
        number: 8,
        title: {
            kr: '《명심코치 윤리·경계·운영 매뉴얼: 브랜드 보호장치》',
            en: 'Coach Ethics, Boundaries & Operation Manual',
            jp: '『明心コーチ倫理・境界線・運営マニュアル』',
            cn: '《明心教练伦理·边界与运营总则：品牌守护规章》'
        },
        subtitle: {
            kr: '의료적 침해 방지, 사주결정론 배제, 안전한 브랜드 수호 규범',
            en: 'Safe Boundary Practice, Anti-Fatalism, Brand Protection',
            jp: '医療侵害の防止、宿命論の排除、ブランド保護規範',
            cn: '界定医疗边界、杜绝宿命盲从、筑牢品牌安全防线'
        },
        role: {
            kr: '명심코칭 평생교육원의 공신력과 지속가능성을 담보하는 법률·윤리 헌장',
            en: 'Legal & Ethical Charter Safeguarding Sustainable Trust',
            jp: '教育院の社会的信頼を担保する倫理憲章',
            cn: '确保平生教育院权威公信力与长远基业的伦理铁律'
        },
        targetLevels: [3, 4, 5],
        tableOfContents: [
            {
                part: { kr: '12대 윤리 및 경계 규정', en: '12 Core Ethical Canons', jp: '12大倫理および境界規定', cn: '12大伦理规范与边界红线' },
                chapters: [
                    { kr: '1. 코칭과 의료·정신과 치료의 명확한 경계', en: '1. Coaching vs Medical Treatment', jp: '1. 医療行為との境界明示', cn: '1. 教练辅导与医疗诊疗的明确边界' },
                    { kr: '2. 사주 결정론 및 공포 마케팅 엄격 금지', en: '2. Strict Ban on Fatalism & Fear Marketing', jp: '2. 宿命論・不安商法の絶対禁止', cn: '2. 严禁宿命论断与恐惧焦虑式营销' },
                    { kr: '3. 생년월일시 및 민감 개인정보 암호화 관리', en: '3. Privacy & Birth Data Security', jp: '3. 個人情報の厳重保護', cn: '3. 生辰与隐私信息的绝对保密安全' },
                    { kr: '4. 고객의 자기결정권 존중 (코치 가치관 강요 금지)', en: '4. Honoring Client Autonomy', jp: '4. 自己決定権の尊重', cn: '4. 充分尊重客户的自主决断权' },
                    { kr: '5. AI 코치 활용 시 윤리 가이드라인 및 기밀유지', en: '5. AI Coaching Ethics & Secrecy', jp: '5. AI活用倫理と秘密保持', cn: '5. AI辅助教练合规与商业机密保护' }
                ]
            }
        ]
    }
];

// ============== 자격 승급 시험(Exam Scenario Quiz) 데이터 ==============
export interface AcademyExamQuiz {
    quizId: string;
    level: number;
    title: { kr: string; en: string; jp: string; cn: string };
    scenario: { kr: string; en: string; jp: string; cn: string };
    question: { kr: string; en: string; jp: string; cn: string };
    options: {
        id: string;
        text: { kr: string; en: string; jp: string; cn: string };
        isCorrect: boolean;
        explanation: { kr: string; en: string; jp: string; cn: string };
    }[];
}

export const ACADEMY_EXAMS: Record<string, AcademyExamQuiz> = {
    quiz_lvl0: {
        quizId: 'quiz_lvl0',
        level: 0,
        title: {
            kr: '오픈클래스 입문 수료 퀴즈',
            en: 'Open Class Completion Quiz',
            jp: 'オープンスクール修了確認',
            cn: '公开课入门通关测评'
        },
        scenario: {
            kr: '오늘 하루도 머릿속에서 여러 가지 걱정과 타인의 시선 때문에 피로감이 몰려옵니다.',
            en: 'Fatigue builds up from worrying about others’ judgments today.',
            jp: '他人の視線や将来への不安で頭の中が疲弊しています。',
            cn: '今天因过度在意他人眼光与对未来的焦虑而深感心智耗竭。'
        },
        question: {
            kr: '명심코칭의 첫걸음인 [자기이해]의 가장 올바른 태도는 무엇입니까?',
            en: 'What is the correct attitude of [Self-Understanding] in Myeongsim Coaching?',
            jp: '明心コーチングの第一歩である「自己理解」の最も正しい態度はどれですか？',
            cn: '作为明心教练第一步的【自我理解】，最正确的态度是什么？'
        },
        options: [
            {
                id: 'opt1',
                text: {
                    kr: '“내 성격에 심각한 결함이 있으니 당장 뜯어고쳐야겠다.”',
                    en: '"My personality has fatal defects, I must fix it immediately."',
                    jp: '「自分の性格には致命的欠陥があるから直ちに直すべきだ。」',
                    cn: '“我的性格有严重缺陷，必须立刻彻底改造。”'
                },
                isCorrect: false,
                explanation: {
                    kr: '기질을 죄악시하고 억압하면 내면의 저항과 분열이 커집니다.',
                    en: 'Judging disposition creates severe inner resistance.',
                    jp: '気質を否定し抑圧すると、内面の摩擦が増大します。',
                    cn: '否定并压抑本质气质会导致剧烈的内在冲突。'
                }
            },
            {
                id: 'opt2',
                text: {
                    kr: '“내 타고난 하드웨어 기질을 알고, 그동안 나를 지켜준 자동반응을 비판 없이 알아차린다.”',
                    en: '"Recognize innate hardware, mindfully noticing past survival habits without judgment."',
                    jp: '「生まれ持ったハードウェア気質を知り、自分を守ってきた自動反応を裁かず認識する。」',
                    cn: '“看清自身生而具有的硬件气质，不带批判地全然觉察那些曾保护自己的自动反应。”'
                },
                isCorrect: true,
                explanation: {
                    kr: '정답입니다! 비판 없는 투명한 자각이 운명의 운전대를 되찾는 첫 번째 열쇠입니다.',
                    en: 'Correct! Non-judgmental awareness is the first key to taking the wheel.',
                    jp: '正解です！裁きのない透明な自覚こそが主導権を握る第一歩です。',
                    cn: '回答正确！不带批判的清澈觉察，是重获主权的第一把金钥匙。'
                }
            }
        ]
    },
    quiz_lvl1: {
        quizId: 'quiz_lvl1',
        level: 1,
        title: {
            kr: 'Level 1 명심 셀프코치 자격 인증 평가',
            en: 'Level 1 Self Coach Certification Exam',
            jp: 'Level 1 セルフコーチ資格認定試験',
            cn: 'Level 1 自我教练资格认证测评'
        },
        scenario: {
            kr: '직장에서 메신저를 보냈으나 반나절 동안 읽씹을 당하자 심장이 답답해지며 "나를 무시하나 봐"라는 자동반응이 튀어나왔습니다.',
            en: 'Your colleague leaves your message unread; chest tightens with "They are disrespecting me."',
            jp: '同僚がメッセージを半日未読スルーし、「軽んじられている」という自動反応が出ました。',
            cn: '发出的工作信息被对方半天未回，胸口紧缩，自动跳出“他肯定是看扁我”的念头。'
        },
        question: {
            kr: '명심 셀프코치로서 Fact(사실)와 Story(가상 소설)를 SCAN하는 올바른 분리는?',
            en: 'As a Self Coach, what is the correct SCAN separating Fact from Story?',
            jp: 'セルフコーチとしてFact(客観事実)とStory(頭の物語)をSCANする正しい分離はどれか？',
            cn: '作为合格的自愈教练，剥离Fact（事实）与Story（头脑故事）的标准SCAN是？'
        },
        options: [
            {
                id: 'opt1',
                text: {
                    kr: 'Fact: 상대가 아직 답장을 보내지 않았다 / Story: 나를 무시하고 있다는 생각과 상처받기 싫은 방어기제',
                    en: 'Fact: No reply received yet / Story: Thinking they disrespect me, triggering defense.',
                    jp: 'Fact: 返信がまだ来ていない / Story: 無視されているという思い込みと自己防衛',
                    cn: 'Fact：对方尚未回复 / Story：脑海认定对方在轻视自己、害怕受伤的自我防御'
                },
                isCorrect: true,
                explanation: {
                    kr: '완벽합니다! 관찰 가능한 카메라 기록(Fact)과 내 뇌가 지어낸 소설(Story)을 완벽히 분리했습니다.',
                    en: 'Perfect! You cleanly severed the objective fact from cognitive fiction.',
                    jp: '完璧です！カメラで撮れる客観的事実と脳の創作物語を完全に切り離しました。',
                    cn: '完美！你如摄像机般精准剥离了客观事实与大脑编造的痛苦虚构。'
                }
            },
            {
                id: 'opt2',
                text: {
                    kr: 'Fact: 상대가 나를 무시하는 게 팩트다 / Story: 앞으로 회사를 그만둬야 할지도 모른다',
                    en: 'Fact: They undeniably disrespect me / Story: I might have to quit.',
                    jp: 'Fact: 相手が私を無視している事実 / Story: 会社を辞めるべきかという悩み',
                    cn: 'Fact：对方轻视我是无可争辩的客观事实 / Story：我以后恐怕得离职'
                },
                isCorrect: false,
                explanation: {
                    kr: '‘상대가 나를 무시한다’는 것은 사실이 아니라 마음이 만든 추측(Story)입니다.',
                    en: '"Disrespect" is an assumption, not an objective physical fact.',
                    jp: '「無視されている」というのは客観的事実ではなく解釈に過ぎません。',
                    cn: '“对方看不起我”只是大脑的主观假说与故事，绝非物理事实。'
                }
            }
        ]
    },
    quiz_lvl2: {
        quizId: 'quiz_lvl2',
        level: 2,
        title: {
            kr: 'Level 2 명심코칭 프랙티셔너 도구숙련 평가',
            en: 'Level 2 Practitioner Tools Mastery Exam',
            jp: 'Level 2 プラクティショナー実戦ツール認定試験',
            cn: 'Level 2 实战从业师工具熟练度测评'
        },
        scenario: {
            kr: '중요한 발표를 앞두고 가슴에 강한 불안이 솟구쳐 오릅니다. 머릿속에서는 실패할 것 같은 공포가 맴돕니다.',
            en: 'Before a big presentation, intense anxiety rises with fears of catastrophic failure.',
            jp: '重要なプレゼン直前、胸に激しい不安が湧き「大失敗する」という恐怖が渦巻いています。',
            cn: '在重大汇报前夕，胸口剧烈升腾起焦虑，脑海中盘旋着惨烈失败的灾难性恐慌。'
        },
        question: {
            kr: '3S 프로토콜 중 [SYNC (자기연민 & 수용)]의 가장 강력한 실천 언어는 무엇입니까?',
            en: 'What is the most powerful language of [SYNC] in 3S coaching?',
            jp: '3Sプロトコルのうち「SYNC (自己受容と慈愛)」の最も強力な実践の言葉はどれか？',
            cn: '在3S核心协议中，践行【SYNC（自我慈悲与全然接纳）】最有力量的语言是？'
        },
        options: [
            {
                id: 'opt1',
                text: {
                    kr: '“불안해하면 안 돼! 빨리 심호흡해서 이 떨림을 완전히 없애버리자.”',
                    en: '"I must not feel anxious! Breathe fast to kill this vibration."',
                    jp: '「不安になってはいけない！深呼吸してこの震えを消し去れ。」',
                    cn: '“绝不能感到焦虑！快深呼吸把这该死的颤抖强行压制消除掉。”'
                },
                isCorrect: false,
                explanation: {
                    kr: '감정을 억누르고 통제하려 드는 것은 전형적인 경험회피(Resistance)입니다.',
                    en: 'Forced suppression is typical experiential avoidance.',
                    jp: '感情の強引な抑圧は典型的な経験回避です。',
                    cn: '强行压抑与控制情绪，是典型的经验回避与内在对抗。'
                }
            },
            {
                id: 'opt2',
                text: {
                    kr: '“지금 내 몸이 중요한 순간을 앞두고 긴장 경보를 울렸구나. 실수하기 두려워 열심히 준비하느라 그동안 참 애썼어. 이 떨림이 내 안에 머무는 것을 온전히 허용한다.”',
                    en: '"My body is ringing an alarm for an important event. You worked so hard trying to avoid mistakes. I allow this tremor to be here."',
                    jp: '「大切な舞台を前に、身体が警報を鳴らしてくれたんだね。失敗を防ごうと頑張ってきた自分、お疲れ様。この震えの存在を丸ごと許容します。」',
                    cn: '“身体是在重大时刻前为我敲响了警觉的号角。为了防止出错你一直如此拼命努力，辛苦了。我允许这份颤抖在体内全然流动。”'
                },
                isCorrect: true,
                explanation: {
                    kr: '감동적인 정답입니다! 결함을 과거의 헌신(Legacy Driver)으로 안아줄 때 신경망은 비로소 안전감을 느끼고 이완됩니다.',
                    en: 'Profound! When defused with compassion, the nervous system feels safe and resets.',
                    jp: '素晴らしい正解です！自分を慈愛で抱きしめるとき、神経系は初めて真の安全感を得て弛緩します。',
                    cn: '令人动容的正确答案！唯有以慈悲接纳拥抱遗留驱动，神经系统才会感到真正的安全并舒展。'
                }
            }
        ]
    },
    quiz_lvl3: {
        quizId: 'quiz_lvl3',
        level: 3,
        title: {
            kr: 'Level 3 명심코치 1:1 실전 코칭 역량 평가',
            en: 'Level 3 Coach 1-on-1 Competency Exam',
            jp: 'Level 3 プロコーチ対人実践認定試験',
            cn: 'Level 3 专业教练一对一辅导实战考核'
        },
        scenario: {
            kr: '코칭 고객이 "제 타고난 사주와 팔자가 불행해서 사업도 망하고 사람 복도 없는 것 같아요"라며 무기력하게 울먹입니다.',
            en: 'A client weeps: "My destiny/saju is cursed, that’s why my business and relations fail."',
            jp: 'クライアントが「生まれつき運勢が悪く、ビジネスも人間関係も絶望的だ」と泣いています。',
            cn: '来访客户抽泣道：“我命中注定八字不好，所以创业失败，命中也无贵人。”'
        },
        question: {
            kr: '윤리 매뉴얼과 3S 철학을 준수하는 공인 명심코치로서 가장 적절한 코칭 개입은?',
            en: 'As an accredited Myeongsim Coach respecting ethics, what is the best intervention?',
            jp: '倫理マニュアルと3S哲学を遵守する公認コーチとして、最も適切な介入はどれか？',
            cn: '作为恪守伦理准则与3S哲学的公认明心教练，最得当的辅导干预方式是？'
        },
        options: [
            {
                id: 'opt1',
                text: {
                    kr: '“맞습니다. 당신 사주에는 겁재와 살이 많으니 굿을 하거나 특정 부적을 지니셔야 합니다.”',
                    en: '"Yes, you have curses in your birth chart, you need talismans."',
                    jp: '「その通りです。あなたの命式には悪運が多いので特別な祈祷が必要です。」',
                    cn: '“确实如此，你的八字劫财重煞，必须购买特定护身符转运。”'
                },
                isCorrect: false,
                explanation: {
                    kr: '명심코치 윤리 규정 제2조 위반! 사주결정론과 공포 마케팅은 엄격히 금지됩니다.',
                    en: 'Severe ethical violation! Fatalism and fear manipulation are strictly forbidden.',
                    jp: '重大な倫理違反！宿命論と不安商法は厳格に禁止されています。',
                    cn: '严重违背教练伦理红线！严禁任何宿命论宣判与焦虑恐吓式误导。'
                }
            },
            {
                id: 'opt2',
                text: {
                    kr: '“그동안 겪으셨던 실패의 아픔이 얼마나 크셨으면 운명 탓을 하고 싶으셨을까요. 하지만 기질은 형벌이 아니라 당신만의 독특한 악기입니다. 우리가 그 악기를 어떻게 조율하고 어떤 멜로디를 연주할지, 지금 이 순간 당신의 자유의지로 다시 시작할 수 있습니다.”',
                    en: '"I hear how deeply those failures hurt. But your temperament is not a curse, it is your unique instrument. Together we can tune it with your free will today."',
                    jp: '「これまでのご苦労とお痛みがどれほど深かったか、胸が痛みます。しかし気質は刑罰ではなくあなた固有の楽器です。その楽器をどう調律しどんな旋律を奏でるかは、今ここからの自由意志で選択できます。」',
                    cn: '“过往经历的挫败必定痛彻心扉，才让您想将原因归咎于宿命。但天生气质绝非惩罚，而是独属于您的乐器。如今如何校准这把乐器、演奏何种人生乐章，这一刻起全由您的自由意志重新谱写。”'
                },
                isCorrect: true,
                explanation: {
                    kr: '최고의 코치입니다! 고객의 고통을 공감(SYNC)하고, 결정론을 해체하여 주체적인 자유의지(Free Will)를 깨웠습니다.',
                    en: 'Outstanding! You showed radical empathy and awakened the client’s free will.',
                    jp: '名コーチです！クライアントの痛みに寄り添い、主権的な自由意志を呼び覚ましました。',
                    cn: '大师级教练！既给予了深切共情（SYNC），又彻底击碎宿命枷锁，唤醒了来访者的主体自由意志。'
                }
            }
        ]
    },
    quiz_lvl4: {
        quizId: 'quiz_lvl4',
        level: 4,
        title: {
            kr: 'Level 4 프로코치 통합 사례 해결 평가',
            en: 'Level 4 Master Coach Integrated Case Exam',
            jp: 'Level 4 マスターコーチ複合事例解決試験',
            cn: 'Level 4 资深教练多维复杂案例终考'
        },
        scenario: {
            kr: '수십억 대 성공 사업가이자 완벽주의 성향의 庚金(경금) 대표가 극심한 공황장애와 임원들과의 단절로 번아웃 직전에 찾아왔습니다.',
            en: 'A high-net-worth perfectionist executive on the brink of panic attacks and burnout.',
            jp: '数億円規模の成功を収めながらも完璧主義でパニック障害寸前の企業代表が来談しました。',
            cn: '身家数亿的完美主义庚金企业总裁，因极致内耗、惊恐发作以及高管团队严重疏离而处于全面崩溃边缘。'
        },
        question: {
            kr: '복합 난제 사례에서 Zero-Point와 Meta Code를 통합한 최상의 코칭 처방은?',
            en: 'What is the highest coaching integration uniting Zero-Point and Meta Code?',
            jp: '複合難問ケースにおいて、ゼロポイントとメタコードを統合した最善の処方はどれか？',
            cn: '面对此类高度复杂的系统性困局，融汇零点本觉与元代码的最佳辅导处方是？'
        },
        options: [
            {
                id: 'opt1',
                text: {
                    kr: '사업을 당장 모두 매각하고 깊은 산속으로 들어가 영원한 명상에만 머물 것을 권고한다.',
                    en: 'Advise selling the business completely and living as an ascetic hermit forever.',
                    jp: '事業を即刻売却し、深山に入って瞑想のみに没頭することを勧める。',
                    cn: '建议其即刻抛售所有产业，隐遁深山彻底不理世事，永远安住于空寂冥想。'
                },
                isCorrect: false,
                explanation: {
                    kr: '영적 우회(Spiritual Bypass)이자 현실 도피입니다. 명심코칭은 현실에서의 창조를 지향합니다.',
                    en: 'This is spiritual bypass and escapism, not Myeongsim integration.',
                    jp: 'これは現実逃避(スピリチュアル・バイパス)であり、明心の実践ではありません。',
                    cn: '这是典型的灵性逃避与消极避世，违背明心教练重返现实大地、主权创造的终极宗旨。'
                }
            },
            {
                id: 'opt2',
                text: {
                    kr: '“대표님이 지금까지 회사를 일군 결단력(庚金)의 헌신을 인정합니다. 하지만 스크린 속 영화의 성패에 나 자신을 100% 동일시하면 스크린이 불타는 착각에 빠집니다. Zero-Point에서 순수 관찰자의 평정을 회복한 뒤, 완벽 통제를 내려놓고 조직원들에게 권한을 위임하는 작은 Micro Action을 설계합니다.”',
                    en: '"Acknowledge their sharp decisive Geng metal contribution, separate the observer from the screen drama, restore Zero-Point peace, and design micro-actions of delegation."',
                    jp: '「これまで会社を築き上げた決断力(庚金)の献身を心から認めます。しかしスクリーンの劇と自分を同化させると映画の火事で自らが燃えていると錯覚します。Zero-Pointの静寂を取り戻した上で、権限委譲という小さなMicro Actionを実行しましょう。」',
                    cn: '“全然肯定其坚毅果决的庚金硬件为企业奠定的历史功绩。随后指明：若与银幕戏剧全盘认同，便会误认大火在焚烧自己。在零点寂静中重获如如不动的观察者本体，放下全知全控的执念，设计微小的权力下放实操清单。”'
                },
                isCorrect: true,
                explanation: {
                    kr: '탁월합니다! 초월(Zero-Point)을 통해 동일시를 해체하고, 현실의 리더십 행동(Action)으로 아름답게 착지시켰습니다.',
                    en: 'Brilliant! You dissolved identification through Zero-Point and anchored it into pragmatic leadership action.',
                    jp: '卓越しています！超越によって過度な同一化を解体し、現実のリーダーシップ行動へと見事に着地させました。',
                    cn: '超凡卓绝！通过零点本觉瓦解沉重同一化，同时坚实扎根于现实层面的领导力行动再造。'
                }
            }
        ]
    }
};
