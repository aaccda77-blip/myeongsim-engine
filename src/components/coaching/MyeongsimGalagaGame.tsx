'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Zap, RotateCcw, Award, Volume2, VolumeX, 
    Sparkles, Flame, Shield, Heart, Skull, Trophy, ArrowLeft, ArrowRight,
    Volume1, CheckCircle2, Copy, Check, Activity, Brain, Radio, Music
} from 'lucide-react';
import { passAcademyExam } from '@/lib/questUnlockManager';

interface MyeongsimGalagaGameProps {
    onExpEarned?: (amount: number) => void;
    onExamClear?: (level: number) => void;
    language?: 'kr' | 'en' | 'jp' | 'cn';
}

const GALAGA_I18N = {
    kr: {
        title: "네오 명심 갤러그: 제로포인트 노바",
        subtitle: "최신형 사이버 전투기로 왜곡된 생각을 격퇴하고 뇌파를 0점으로 리셋하세요!",
        score: "격추 점수",
        highScore: "최고 기록",
        wave: "WAVE",
        stressLevel: "잔여 스트레스",
        soundPrompt: "🔊 화면을 탭하면 2026 신스 BGM & 8-Bit 사운드가 켜집니다!",
        bossWarning: "⚠️ DANGER: 거대 에고 보스 출현! ⚠️",
        gameOver: "게임 오버 (깊은 호흡으로 리셋)",
        gameClear: "🎉 축하합니다! 모든 왜곡 소멸 & 0점 도달!",
        startBtn: "🚀 출격! 네오 파이터 발진",
        restartBtn: "🔄 다시 출격하기",
        controlsGuide: "화면 터치 드래그 또는 하단 버튼 / 탭하여 궁극기 가동!",
        bossName: "거대한 인지 왜곡의 에고",
        pureFactMsg: "✨ 왜곡된 인지 망상이 모두 증발하고 고요한 순수 영점(0)에 도달했습니다!",
        expEarned: "자각 EXP 획득!",
        comboLabel: "COMBO",
        feverBanner: "🔥 과몰입 하이퍼 피버! 트윈 플라즈마 전탄 발사!",
        tractorWarning: "⚡ 에고 트랙터 빔 가동! 4발 사격으로 깨뜨리세요!",
        tractorBroken: "💥 트랙터 빔 파괴! 보스 그로기 상태!",
        certTitle: "마인드 영점 리셋 & 자각 인증서",
        certSub: "마음 영점 회복(Zero Point Reset) 공인",
        purifiedTitle: "정화된 인지왜곡 및 승화 목록",
        brainwaveStatus: "뇌파 동조율: α(알파)파 99.4% 고요 상태 달성",
        copyCert: "📋 인증서 텍스트 복사",
        certCopied: "✅ 클립보드 복사 완료!",
        nextStage: "다음 멘탈 스테이지 도전 ➔",
        novaBtn: "💥 제로 노바 (全화면 정화)",
        waveBanner: {
            1: "WAVE 1: 일상 잡념 정찰대",
            2: "WAVE 2: 불안 & 과잉일반화 편대",
            3: "WAVE 3: 심층 자책 엘리트 편대",
            4: "FINAL WAVE: 거대 에고 보스 결전!"
        }
    },
    en: {
        title: "Neo Galaga: Zero-Point Nova",
        subtitle: "Pilot the advanced cyber fighter to dissolve distorted thoughts to Zero Point!",
        score: "Score",
        highScore: "High Score",
        wave: "WAVE",
        stressLevel: "Stress Level",
        soundPrompt: "🔊 Tap to activate Cyber Synth BGM & 8-Bit audio!",
        bossWarning: "⚠️ DANGER: Giant Ego Boss Approaching! ⚠️",
        gameOver: "GAME OVER (Take a deep breath)",
        gameClear: "🎉 Victory! All Distorted Illusions Dissolved!",
        startBtn: "🚀 Launch Neo Fighter!",
        restartBtn: "🔄 Try Again",
        controlsGuide: "Touch Drag or Bottom Buttons / Tap to Trigger Ultimate Nova!",
        bossName: "The Giant Distorted Ego",
        pureFactMsg: "✨ Distorted illusions dissolved, returning to pure Zero Point!",
        expEarned: "Awareness EXP Earned!",
        comboLabel: "COMBO",
        feverBanner: "🔥 HYPER FOCUS FEVER! Twin Plasma Active!",
        tractorWarning: "⚡ Ego Tractor Beam! Hit 4 shots to break it!",
        tractorBroken: "💥 Tractor Beam Broken! Boss Stunned!",
        certTitle: "Mind Zero-Point Reset Certificate",
        certSub: "Zero Point Reset Verified",
        purifiedTitle: "Purified Cognitive Distortions",
        brainwaveStatus: "Brainwave: 99.4% Alpha State Coherence Achieved",
        copyCert: "📋 Copy Certificate",
        certCopied: "✅ Copied to Clipboard!",
        nextStage: "Next Mental Stage ➔",
        novaBtn: "💥 ZERO NOVA (Full Cleansing)",
        waveBanner: {
            1: "WAVE 1: Routine Thought Scouts",
            2: "WAVE 2: Anxiety & Generalization Fleet",
            3: "WAVE 3: Deep Guilt Elite Squadron",
            4: "FINAL WAVE: Giant Distorted Ego Boss!"
        }
    },
    jp: {
        title: "ネオ明心ギャラガ: ゼロポイント・ノヴァ",
        subtitle: "最新サイバー戦闘機で歪んだ思考を撃退し脳波をゼロリセット！",
        score: "スコア",
        highScore: "ハイスコア",
        wave: "WAVE",
        stressLevel: "残留ストレス",
        soundPrompt: "🔊 タップでサイバーシンセBGM＆8-Bitサウンド始動！",
        bossWarning: "⚠️ DANGER: 巨大エゴボス出現！ ⚠️",
        gameOver: "ゲームオーバー (深呼吸しましょう)",
        gameClear: "🎉 勝利！全ての歪みが消滅しゼロポイントへ帰還！",
        startBtn: "🚀 出撃！ネオファイター発進",
        restartBtn: "🔄 もう一度出撃",
        controlsGuide: "画面タッチドラッグまたは下部ボタン / 必殺技タップ発動！",
        bossName: "巨大な認知歪曲のエゴ",
        pureFactMsg: "✨ すべての雑念が浄化され、静寂なゼロポイントへ戻りました！",
        expEarned: "自覚EXP獲得！",
        comboLabel: "コンボ",
        feverBanner: "🔥 過没入フィーバー！ツインプラズマ全弾発射！",
        tractorWarning: "⚡ 執着のトラクタービーム！4発撃ち込んで破壊せよ！",
        tractorBroken: "💥 トラクタービーム破壊！ボス気絶！",
        certTitle: "マインドゼロポイントリセット認定証",
        certSub: "ゼロポイントリセット公認",
        purifiedTitle: "浄化された思考の歪み一覧",
        brainwaveStatus: "脳波：α波99.4% 同調状態達成",
        copyCert: "📋 認定証をコピー",
        certCopied: "✅ コピー完了！",
        nextStage: "次のステージへ挑戦 ➔",
        novaBtn: "💥 ゼロ・ノヴァ (全体浄化)",
        waveBanner: {
            1: "WAVE 1: 日常雑念偵察隊",
            2: "WAVE 2: 不安と過度な一般化編隊",
            3: "WAVE 3: 深層自責エリート編隊",
            4: "FINAL WAVE: 巨大エゴボス決戦！"
        }
    },
    cn: {
        title: "新时代明心大蜜蜂: 零点新星",
        subtitle: "驾驶最新赛博战机轰碎认知执念，心智清明归零！",
        score: "击落分数",
        highScore: "最高分",
        wave: "WAVE",
        stressLevel: "残留压力值",
        soundPrompt: "🔊 点击屏幕开启电子合成BGM与街机音效！",
        bossWarning: "⚠️ DANGER: 巨型执念魔王降临！ ⚠️",
        gameOver: "游戏结束 (请深呼吸)",
        gameClear: "🎉 大获全胜！一切杂念灰飞烟灭，心智归零！",
        startBtn: "🚀 战机出击！",
        restartBtn: "🔄 重新出击",
        controlsGuide: "屏幕滑动或底部按钮 / 蓄力释放全屏觉察新星！",
        bossName: "巨型认知扭曲之自我",
        pureFactMsg: "✨ 杂念散尽，重归清明安详的零点纯境！",
        expEarned: "觉察EXP增加！",
        comboLabel: "连击",
        feverBanner: "🔥 超极专注FEVER! 双联等离子全开！",
        tractorWarning: "⚡ 执念牵引光束！命中4次将其瓦解！",
        tractorBroken: "💥 光束破碎！魔王陷入眩晕！",
        certTitle: "心智零点重塑认证证书",
        certSub: "心智归零 (Zero Point) 完毕公认",
        purifiedTitle: "已净化的认知偏差及升华清单",
        brainwaveStatus: "脑波状态：99.4% 阿尔法波共振清明",
        copyCert: "📋 复制认证文本",
        certCopied: "✅ 复制成功！",
        nextStage: "挑战下一心智关卡 ➔",
        novaBtn: "💥 零点新星 (全屏净化)",
        waveBanner: {
            1: "WAVE 1: 日常杂念先锋队",
            2: "WAVE 2: 焦虑与过度概括编队",
            3: "WAVE 3: 深层自责精锐编队",
            4: "FINAL WAVE: 巨型执念魔王决战！"
        }
    }
};

// 🌟 CBT 16대 인지왜곡 다채로운 데이터베이스 🌟
interface ThoughtItem {
    text: string;
    insight: string;
    tag: string;
    color: string;
    points: number;
}

const THOUGHT_DATA: Record<string, Array<ThoughtItem>> = {
    kr: [
        { tag: "흑백논리", text: "완벽하지 않으면 실패야", insight: "✨ 과정 자체가 소중한 성장이다!", color: "#f87171", points: 15 },
        { tag: "파국화", text: "모든 게 다 끝장났어", insight: "🌱 새로운 시작의 문이 열렸다!", color: "#fb923c", points: 20 },
        { tag: "독심술", text: "날 무시하고 비웃을 거야", insight: "💪 타인의 시선은 내 본질이 아니다!", color: "#facc15", points: 20 },
        { tag: "점쟁이오류", text: "앞으로도 영원히 안 풀려", insight: "☀️ 미래는 지금 이 순간 만들어진다!", color: "#38bdf8", points: 25 },
        { tag: "과잉일반화", text: "난 언제나 늘 실패자였어", insight: "🎯 이번 한 번의 값진 경험일 뿐!", color: "#c084fc", points: 20 },
        { tag: "정신적여과", text: "칭찬은 가짜고 비난만 진짜", insight: "🌸 내 안의 빛과 장점을 바라보자!", color: "#34d399", points: 20 },
        { tag: "감정적추론", text: "불안하니까 분명 나쁜 일 생겨", insight: "🕊️ 감정은 구름일 뿐 실체가 아니다!", color: "#fb7185", points: 25 },
        { tag: "당위적사고", text: "난 무조건 완벽해야만 해", insight: "🌿 있는 그대로의 나로도 충분하다!", color: "#818cf8", points: 25 },
        { tag: "개인화/자책", text: "전부 나 때문에 이렇게 된 거야", insight: "🤍 자책을 내려놓고 스스로를 안아주자!", color: "#f43f5e", points: 30 },
        { tag: "명명하기", text: "난 구제불능 게으름뱅이야", insight: "⚡ 지금 잠시 에너지를 충전 중이다!", color: "#e879f9", points: 20 },
        { tag: "비교함정", text: "남들은 앞서는데 나만 뒤처졌어", insight: "🛤️ 내 인생만의 고유한 속도가 있다!", color: "#2dd4bf", points: 25 },
        { tag: "후회집착", text: "그때 그 선택만 안 했어도...", insight: "🌅 과거는 흘러갔고 현재가 선물이다!", color: "#60a5fa", points: 30 },
        { tag: "무력감", text: "아무리 발버둥쳐도 소용없어", insight: "🔥 작은 1보가 거대한 기적을 만든다!", color: "#fbbf24", points: 25 },
        { tag: "거절공포", text: "거절당하면 내 가치가 없어", insight: "💎 나의 본질적 가치는 불변이다!", color: "#a78bfa", points: 25 },
        { tag: "피해의식", text: "세상이 나만 억까하고 괴롭혀", insight: "🧘 중심을 잡고 내 영점으로 복귀한다!", color: "#fdba74", points: 25 },
        { tag: "완벽주의", text: "실수 하나도 용납할 수 없어", insight: "🎨 실수는 최고의 지혜를 주는 스승!", color: "#4ade80", points: 25 }
    ],
    en: [
        { tag: "All-or-Nothing", text: "If it's not perfect, it's failure", insight: "✨ Every step is valuable growth!", color: "#f87171", points: 15 },
        { tag: "Catastrophizing", text: "Everything is ruined forever", insight: "🌱 A new door of opportunity opens!", color: "#fb923c", points: 20 },
        { tag: "Mind Reading", text: "They will surely judge and mock me", insight: "💪 Other's thoughts do not define me!", color: "#facc15", points: 20 },
        { tag: "Fortune Telling", text: "Things will never get better", insight: "☀️ The future is created right now!", color: "#38bdf8", points: 25 },
        { tag: "Overgeneralizing", text: "I am always a complete failure", insight: "🎯 It is just one single experience!", color: "#c084fc", points: 20 },
        { tag: "Mental Filtering", text: "Only negative things count", insight: "🌸 Witness my inner light and gifts!", color: "#34d399", points: 20 },
        { tag: "Emotional Reason", text: "I feel anxious so disaster comes", insight: "🕊️ Feelings are passing clouds!", color: "#fb7185", points: 25 },
        { tag: "Should Statements", text: "I must do everything flawlessly", insight: "🌿 I am worthy as I am!", color: "#818cf8", points: 25 },
        { tag: "Personalization", text: "Everything bad is solely my fault", insight: "🤍 Release guilt and embrace myself!", color: "#f43f5e", points: 30 },
        { tag: "Labeling", text: "I am totally hopeless and lazy", insight: "⚡ I am recharging my battery!", color: "#e879f9", points: 20 },
        { tag: "Comparison Trap", text: "Others advance while I lag behind", insight: "🛤️ I walk my own unique timeline!", color: "#2dd4bf", points: 25 },
        { tag: "Regret Trap", text: "If only I hadn't made that choice", insight: "🌅 Past has gone; now is the true gift!", color: "#60a5fa", points: 30 },
        { tag: "Helplessness", text: "No matter what I do, it's useless", insight: "🔥 One tiny step builds a miracle!", color: "#fbbf24", points: 25 },
        { tag: "Rejection Fear", text: "Rejection means I am worthless", insight: "💎 My intrinsic dignity is untouched!", color: "#a78bfa", points: 25 },
        { tag: "Victim Mindset", text: "The universe is against me", insight: "🧘 Grounded peace at Zero Point!", color: "#fdba74", points: 25 },
        { tag: "Perfectionism", text: "I cannot tolerate a single mistake", insight: "🎨 Mistakes are life's greatest teacher!", color: "#4ade80", points: 25 }
    ],
    jp: [
        { tag: "白黒思考", text: "完璧でなければ全て失敗だ", insight: "✨ プロセス自体が尊い成長だ！", color: "#f87171", points: 15 },
        { tag: "破局的思考", text: "もう全部おしまいだ", insight: "🌱 新たな好機の扉が開いた！", color: "#fb923c", points: 20 },
        { tag: "読心術", text: "皆私を心の中で見下している", insight: "💪 他人の視線は私の本質ではない！", color: "#facc15", points: 20 },
        { tag: "占い師の誤謬", text: "今後も永遠に好転しない", insight: "☀️ 未来は今この瞬間に創られる！", color: "#38bdf8", points: 25 },
        { tag: "過度の一般化", text: "私はいつも失敗者だった", insight: "🎯 今回の一度の尊い経験に過ぎない！", color: "#c084fc", points: 20 },
        { tag: "心のフィルター", text: "称賛は嘘で批判だけが本物だ", insight: "🌸 自分の中の光と長所を見つめよう！", color: "#34d399", points: 20 },
        { tag: "感情的推論", text: "不安だから悪いことが起きる", insight: "🕊️ 感情は過ぎ去る雲に過ぎない！", color: "#fb7185", points: 25 },
        { tag: "べき思考", text: "絶対に完璧でなければならない", insight: "🌿 ありのままの私で十分だ！", color: "#818cf8", points: 25 },
        { tag: "自己関連づけ", text: "全て私のせいでこうなった", insight: "🤍 自責を手放し、自分を抱きしめよう！", color: "#f43f5e", points: 30 },
        { tag: "レッテル貼り", text: "私は救いようのない怠け者だ", insight: "⚡ 今はエネルギーを充電中だ！", color: "#e879f9", points: 20 },
        { tag: "比較の罠", text: "皆先を行くのに私だけ遅れている", insight: "🛤️ 私の人生には固有の速度がある！", color: "#2dd4bf", points: 25 },
        { tag: "後悔の執着", text: "あの時あの選択さえしなければ…", insight: "🌅 過去は過ぎ去り、今が贈り物だ！", color: "#60a5fa", points: 30 },
        { tag: "無力感", text: "どんなにもがいても無駄だ", insight: "🔥 小さな一歩が大きな奇跡を生む！", color: "#fbbf24", points: 25 },
        { tag: "拒絶恐怖", text: "拒絶されたら私には価値がない", insight: "💎 私の本質的価値は不変だ！", color: "#a78bfa", points: 25 },
        { tag: "被害妄想", text: "世界が私を苦しめている", insight: "🧘 軸を整え、ゼロポイントへ復帰する！", color: "#fdba74", points: 25 },
        { tag: "完璧主義", text: "ミスは一つも許されない", insight: "🎨 失敗は最大の知恵を授ける師！", color: "#4ade80", points: 25 }
    ],
    cn: [
        { tag: "非黑即白", text: "不完美就是彻底失败", insight: "✨ 过程本身就是宝贵的成长！", color: "#f87171", points: 15 },
        { tag: "灾难化", text: "一切全都彻底完蛋了", insight: "🌱 崭新机缘之门已经开启！", color: "#fb923c", points: 20 },
        { tag: "读心术", text: "别人肯定在暗暗嘲笑我", insight: "💪 他人的看法不是我的本质！", color: "#facc15", points: 20 },
        { tag: "算命师谬误", text: "以后永远都好不起来了", insight: "☀️ 未来正在当下这一刻被创造！", color: "#38bdf8", points: 25 },
        { tag: "过度概括", text: "我从来都是个失败者", insight: "🎯 这只是单次宝贵的体验！", color: "#c084fc", points: 20 },
        { tag: "心理过滤", text: "夸赞是假的批评才是真的", insight: "🌸 凝视内在的光芒与天赋！", color: "#34d399", points: 20 },
        { tag: "情绪化推理", text: "我感到焦虑就一定会出事", insight: "🕊️ 情绪只是过往浮云而非实体！", color: "#fb7185", points: 25 },
        { tag: "应该句式", text: "我必须无条件做到十全十美", insight: "🌿 此时此刻的我就已足够圆满！", color: "#818cf8", points: 25 },
        { tag: "自责归因", text: "全都是因为我才变成这样的", insight: "🤍 放下内疚，温柔拥抱自己！", color: "#f43f5e", points: 30 },
        { tag: "乱贴标签", text: "我是个不可救药的懒骨头", insight: "⚡ 我只是正在静心充电蓄能！", color: "#e879f9", points: 20 },
        { tag: "攀比陷阱", text: "别人突飞猛进只有我落后", insight: "🛤️ 我拥有专属于自己的人生节奏！", color: "#2dd4bf", points: 25 },
        { tag: "后悔执念", text: "要是当初没做那个决定该多好…", insight: "🌅 过往已随风逝，当下才是馈赠！", color: "#60a5fa", points: 30 },
        { tag: "习得无助", text: "再怎么挣扎也毫无意义", insight: "🔥 微小的一步足以缔造伟大奇迹！", color: "#fbbf24", points: 25 },
        { tag: "惧怕拒绝", text: "一旦被拒绝我就毫无价值", insight: "💎 我的本真价值恒久不变！", color: "#a78bfa", points: 25 },
        { tag: "受害者心态", text: "整个世界都在故意为难我", insight: "🧘 守定核心，安住于心智零点！", color: "#fdba74", points: 25 },
        { tag: "完美主义", text: "哪怕一点疏漏也绝不能容忍", insight: "🎨 瑕疵是赋予至高智慧的导师！", color: "#4ade80", points: 25 }
    ]
};

export default function MyeongsimGalagaGame({
    onExpEarned,
    onExamClear,
    language = 'kr'
}: MyeongsimGalagaGameProps) {
    const t = GALAGA_I18N[language] || GALAGA_I18N.kr;
    const thoughts = THOUGHT_DATA[language] || THOUGHT_DATA.kr;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // 오디오 컨텍스트 싱글톤
    const audioCtxRef = useRef<AudioContext | null>(null);
    const bgmOscRef = useRef<{ osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null>(null);
    const [soundActive, setSoundActive] = useState<boolean>(false);
    const [bgmEnabled, setBgmEnabled] = useState<boolean>(true);

    // 게임 상태
    const [gameState, setGameState] = useState<'playing' | 'paused' | 'gameover' | 'clear'>('playing');
    const [score, setScore] = useState<number>(0);
    const [highScore, setHighScore] = useState<number>(0);
    const [lives, setLives] = useState<number>(3);
    const [wave, setWave] = useState<number>(1);
    const [stressPct, setStressPct] = useState<number>(100);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [bossWarning, setBossWarning] = useState<boolean>(false);
    const [comboCount, setComboCount] = useState<number>(0);
    const [isFeverMode, setIsFeverMode] = useState<boolean>(false);
    const [tractorNotice, setTractorNotice] = useState<string | null>(null);
    const [waveBanner, setWaveBanner] = useState<string | null>("WAVE 1: 일상 잡념 정찰대");
    const [copied, setCopied] = useState<boolean>(false);

    // 💥 최신형 궁극기: 제로 노바 (Zero Nova) 게이지 (0 ~ 100)
    const [ultimateGauge, setUltimateGauge] = useState<number>(0);

    // 정화 통계 저장 (다채로운 인지왜곡별 통계)
    const [purifiedStats, setPurifiedStats] = useState<{ 
        [thoughtText: string]: { count: number; insight: string; tag: string } 
    }>({});

    const gameEngineRef = useRef<{
        player: { 
            x: number; 
            y: number; 
            width: number; 
            height: number; 
            speed: number; 
            power: number; 
            shieldTimer: number; 
            hasDrone: boolean;
            droneAngle: number;
        };
        bullets: Array<{ 
            x: number; 
            y: number; 
            vx: number; 
            vy: number; 
            radius: number; 
            color: string; 
            isFever?: boolean;
            isHoming?: boolean;
        }>;
        enemies: Array<{ 
            x: number; 
            y: number; 
            vx: number; 
            vy: number; 
            width: number; 
            height: number; 
            text: string; 
            insight: string; 
            tag: string;
            color: string; 
            points: number; 
            hp: number; 
            maxHp: number; 
            diveTimer: number; 
            hitFlash: number;
            isElite?: boolean;
            wingPhase: number;
        }>;
        enemyBullets: Array<{ x: number; y: number; vx: number; vy: number; radius: number }>;
        particles: Array<{ x: number; y: number; vx: number; vy: number; color: string; life: number; maxLife: number; size: number }>;
        floatingTexts: Array<{ x: number; y: number; text: string; color: string; life: number; maxLife: number; vy: number }>;
        items: Array<{ x: number; y: number; vy: number; type: 'power' | 'shield' | 'life' | 'drone'; label: string }>;
        stars: Array<{ x: number; y: number; speed: number; size: number; opacity: number; color: string }>;
        shockwaves: Array<{ x: number; y: number; radius: number; maxRadius: number; color: string; life: number }>;
        nebulaOffset: number;
        boss: { 
            x: number; 
            y: number; 
            width: number; 
            height: number; 
            hp: number; 
            maxHp: number; 
            vx: number; 
            active: boolean; 
            shootTimer: number; 
            hitFlash: number;
            tractorState: 'idle' | 'charging' | 'firing' | 'stunned';
            tractorTimer: number;
            tractorHits: number;
        } | null;
        combo: number;
        comboTimer: number;
        maxCombo: number;
        feverTimer: number;
        ultimateEnergy: number;
        lastFireTime: number;
        fireInterval: number;
        score: number;
        lives: number;
        wave: number;
        shakeTimer: number;
        keys: { [key: string]: boolean };
        mousePos: { x: number; y: number };
        isTouching: boolean;
        animId: number | null;
    }>({
        player: { x: 200, y: 430, width: 44, height: 44, speed: 7, power: 1, shieldTimer: 120, hasDrone: false, droneAngle: 0 },
        bullets: [],
        enemies: [],
        enemyBullets: [],
        particles: [],
        floatingTexts: [],
        items: [],
        stars: [],
        shockwaves: [],
        nebulaOffset: 0,
        boss: null,
        combo: 0,
        comboTimer: 0,
        maxCombo: 0,
        feverTimer: 0,
        ultimateEnergy: 0,
        lastFireTime: 0,
        fireInterval: 135,
        score: 0,
        lives: 3,
        wave: 1,
        shakeTimer: 0,
        keys: {},
        mousePos: { x: 200, y: 430 },
        isTouching: false,
        animId: null
    });

    // ── 📳 햅틱 진동 피드백 유틸 ──
    const triggerHaptic = useCallback((pattern: number | number[]) => {
        if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && navigator.vibrate) {
            try {
                navigator.vibrate(pattern);
            } catch (e) {}
        }
    }, []);

    // ── 🔊 Web Audio API 레트로 사운드 & 신스 BGM 엔진 ──
    const getAudioContext = useCallback(() => {
        if (typeof window === 'undefined') return null;
        if (!audioCtxRef.current) {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) {
                audioCtxRef.current = new AudioCtx();
            }
        }
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume().then(() => {
                setSoundActive(true);
            }).catch(() => {});
        } else if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
            setSoundActive(true);
        }
        return audioCtxRef.current;
    }, []);

    // 🎵 사이버펑크 아르페지오 신스 BGM 루프
    const startBgm = useCallback(() => {
        if (isMuted || !bgmEnabled) return;
        const ctx = getAudioContext();
        if (!ctx || ctx.state !== 'running' || bgmOscRef.current) return;

        try {
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc1.type = 'sawtooth';
            osc2.type = 'triangle';

            osc1.frequency.setValueAtTime(110, ctx.currentTime);
            osc2.frequency.setValueAtTime(55, ctx.currentTime);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(320, ctx.currentTime);

            gain.gain.setValueAtTime(0.025, ctx.currentTime);

            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc1.start();
            osc2.start();

            bgmOscRef.current = { osc1, osc2, gain };
        } catch (e) {}
    }, [isMuted, bgmEnabled, getAudioContext]);

    const stopBgm = useCallback(() => {
        if (bgmOscRef.current) {
            try {
                bgmOscRef.current.osc1.stop();
                bgmOscRef.current.osc2.stop();
                bgmOscRef.current.osc1.disconnect();
                bgmOscRef.current.osc2.disconnect();
            } catch (e) {}
            bgmOscRef.current = null;
        }
    }, []);

    const unlockAudio = useCallback(() => {
        const ctx = getAudioContext();
        if (ctx && ctx.state === 'suspended') {
            ctx.resume().then(() => {
                setSoundActive(true);
                startBgm();
            }).catch(() => {});
        } else {
            setSoundActive(true);
            startBgm();
        }
    }, [getAudioContext, startBgm]);

    // 레이저 발사음
    const playLaserSound = useCallback((isFever: boolean = false) => {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx || ctx.state !== 'running') return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = isFever ? 'square' : 'sawtooth';
            const startFreq = isFever ? 1400 : 1150;
            const endFreq = isFever ? 220 : 160;

            osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.08);

            gain.gain.setValueAtTime(isFever ? 0.06 : 0.07, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.08);
        } catch (e) {}
    }, [isMuted, getAudioContext]);

    // 폭발음 (White noise)
    const playExplosionSound = useCallback(() => {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx || ctx.state !== 'running') return;

        try {
            const bufferSize = Math.floor(ctx.sampleRate * 0.18);
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(750, ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.18);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.18, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            noise.start();
            noise.stop(ctx.currentTime + 0.18);
        } catch (e) {}
    }, [isMuted, getAudioContext]);

    // 💥 궁극기 제로 노바 사운드 (우주 충격파)
    const playZeroNovaSound = useCallback(() => {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx || ctx.state !== 'running') return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(80, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.35);
            osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.9);

            gain.gain.setValueAtTime(0.25, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.9);
        } catch (e) {}
    }, [isMuted, getAudioContext]);

    // 콤보 상승음
    const playComboSound = useCallback((combo: number) => {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx || ctx.state !== 'running') return;

        try {
            const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
            const freq = notes[Math.min(notes.length - 1, combo % notes.length)];

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.14);
        } catch (e) {}
    }, [isMuted, getAudioContext]);

    // 피버 팡파레
    const playFeverSound = useCallback(() => {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx || ctx.state !== 'running') return;

        try {
            const tones = [523.25, 659.25, 783.99, 1046.50];
            tones.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const t0 = ctx.currentTime + idx * 0.06;

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, t0);

                gain.gain.setValueAtTime(0.09, t0);
                gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.18);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(t0);
                osc.stop(t0 + 0.18);
            });
        } catch (e) {}
    }, [isMuted, getAudioContext]);

    // 통찰 승화 크리스탈 차임 (880Hz)
    const playInsightSound = useCallback(() => {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx || ctx.state !== 'running') return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12);

            gain.gain.setValueAtTime(0.07, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } catch (e) {}
    }, [isMuted, getAudioContext]);

    // 트랙터 빔 사운드
    const playTractorSound = useCallback(() => {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx || ctx.state !== 'running') return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(140, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.25);

            gain.gain.setValueAtTime(0.06, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.25);
        } catch (e) {}
    }, [isMuted, getAudioContext]);

    // 파워업 사운드
    const playPowerupSound = useCallback(() => {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx || ctx.state !== 'running') return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(528, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1056, ctx.currentTime + 0.15);

            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } catch (e) {}
    }, [isMuted, getAudioContext]);

    // 보스 경고 사이렌
    const playBossAlertSound = useCallback(() => {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx || ctx.state !== 'running') return;

        try {
            for (let i = 0; i < 2; i++) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const t0 = ctx.currentTime + i * 0.28;

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(320, t0);
                osc.frequency.linearRampToValueAtTime(740, t0 + 0.14);
                osc.frequency.linearRampToValueAtTime(320, t0 + 0.28);

                gain.gain.setValueAtTime(0.12, t0);
                gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.28);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(t0);
                osc.stop(t0 + 0.28);
            }
        } catch (e) {}
    }, [isMuted, getAudioContext]);

    // 별 배경 생성 (패럴랙스 3중 깊이감)
    const initStars = (w: number, h: number) => {
        const stars = [];
        for (let i = 0; i < 55; i++) {
            const depth = Math.random();
            stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                speed: depth < 0.3 ? 0.4 : depth < 0.7 ? 1.4 : 2.8,
                size: depth < 0.3 ? 1.0 : depth < 0.7 ? 1.8 : 2.6,
                opacity: depth < 0.3 ? 0.3 : depth < 0.7 ? 0.6 : 0.9,
                color: depth > 0.8 ? '#38bdf8' : depth > 0.6 ? '#c084fc' : '#ffffff'
            });
        }
        return stars;
    };

    // ── 단계별 WAVE 스폰 로직 (웨이브 1 ~ 3 및 파이널 보스) ──
    const spawnEnemyWave = (canvasWidth: number, currentWave: number) => {
        const enemies = [];
        
        let rows = 3;
        let cols = 4;
        let speedMultiplier = 1.0;

        if (currentWave === 2) {
            rows = 3;
            cols = 5;
            speedMultiplier = 1.3;
        } else if (currentWave >= 3) {
            rows = 4;
            cols = 5;
            speedMultiplier = 1.6;
        }

        const spacingX = Math.min(62, Math.floor((canvasWidth - 40) / cols));
        const spacingY = 40;
        const startX = (canvasWidth - cols * spacingX) / 2 + spacingX / 2;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const thoughtIndex = (r * cols + c + (currentWave - 1) * 4) % thoughts.length;
                const thought = thoughts[thoughtIndex];
                const isElite = (currentWave >= 3 && r === 0);

                enemies.push({
                    x: startX + c * spacingX,
                    y: 36 + r * spacingY,
                    vx: (Math.random() > 0.5 ? 1 : -1) * (0.8 + Math.random() * 0.5) * speedMultiplier,
                    vy: 0,
                    width: 46,
                    height: 28,
                    text: thought.text,
                    insight: thought.insight,
                    tag: thought.tag,
                    color: isElite ? '#e11d48' : thought.color,
                    points: thought.points * (isElite ? 2 : 1),
                    hp: isElite ? 2 : 1,
                    maxHp: isElite ? 2 : 1,
                    diveTimer: 140 + Math.floor(Math.random() * 260) / speedMultiplier,
                    hitFlash: 0,
                    isElite,
                    wingPhase: Math.random() * Math.PI * 2
                });
            }
        }
        return enemies;
    };

    // 거대 에고 보스
    const spawnBoss = (canvasWidth: number) => {
        setBossWarning(true);
        playBossAlertSound();
        triggerHaptic([40, 30, 60, 40]);
        setTimeout(() => setBossWarning(false), 2500);

        return {
            x: canvasWidth / 2 - 60,
            y: 50,
            width: 120,
            height: 60,
            hp: 65,
            maxHp: 65,
            vx: 2.2,
            active: true,
            shootTimer: 45,
            hitFlash: 0,
            tractorState: 'idle' as const,
            tractorTimer: 150,
            tractorHits: 0
        };
    };

    // 💥 최신형 궁극기 발동: 제로 노바 (ZERO NOVA)
    const triggerZeroNova = useCallback(() => {
        const ge = gameEngineRef.current;
        if (ge.ultimateEnergy < 100) return;

        ge.ultimateEnergy = 0;
        setUltimateGauge(0);
        playZeroNovaSound();
        triggerHaptic([60, 40, 80, 50, 120]);
        ge.shakeTimer = 16;

        const canvas = canvasRef.current;
        const w = canvas ? canvas.width : 400;
        const h = canvas ? canvas.height : 500;

        ge.shockwaves.push({
            x: ge.player.x,
            y: ge.player.y,
            radius: 10,
            maxRadius: Math.max(w, h) * 1.2,
            color: '#38bdf8',
            life: 30
        });

        ge.enemyBullets = [];

        for (let i = ge.enemies.length - 1; i >= 0; i--) {
            const e = ge.enemies[i];
            ge.floatingTexts.push({
                x: e.x,
                y: e.y - 8,
                text: e.insight,
                color: '#34d399',
                life: 60,
                maxLife: 60,
                vy: -1.2
            });

            setPurifiedStats(prev => {
                const current = prev[e.text] || { count: 0, insight: e.insight, tag: e.tag };
                return {
                    ...prev,
                    [e.text]: { count: current.count + 1, insight: e.insight, tag: e.tag }
                };
            });

            ge.score += e.points * 2;
        }
        ge.enemies = [];

        if (ge.boss && ge.boss.active) {
            ge.boss.hp -= 25;
            ge.boss.hitFlash = 10;
            ge.boss.tractorState = 'stunned';
            ge.boss.tractorTimer = 180;
        }

        setScore(ge.score);
        setStressPct(prev => Math.max(0, prev - 25));
    }, [playZeroNovaSound, triggerHaptic]);

    // 리셋 / 시작
    const resetAndStartGame = useCallback(() => {
        const canvas = canvasRef.current;
        const w = canvas ? canvas.width : 400;
        const h = canvas ? canvas.height : 500;

        gameEngineRef.current = {
            player: { x: w / 2, y: h - 55, width: 44, height: 44, speed: 7, power: 1, shieldTimer: 120, hasDrone: false, droneAngle: 0 },
            bullets: [],
            enemies: spawnEnemyWave(w, 1),
            enemyBullets: [],
            particles: [],
            floatingTexts: [],
            items: [],
            stars: initStars(w, h),
            shockwaves: [],
            nebulaOffset: 0,
            boss: null,
            combo: 0,
            comboTimer: 0,
            maxCombo: 0,
            feverTimer: 0,
            ultimateEnergy: 0,
            lastFireTime: 0,
            fireInterval: 135,
            score: 0,
            lives: 3,
            wave: 1,
            shakeTimer: 0,
            keys: {},
            mousePos: { x: w / 2, y: h - 55 },
            isTouching: false,
            animId: null
        };

        setScore(0);
        setLives(3);
        setWave(1);
        setStressPct(100);
        setComboCount(0);
        setIsFeverMode(false);
        setUltimateGauge(0);
        setTractorNotice(null);
        setWaveBanner(t.waveBanner[1]);
        setTimeout(() => setWaveBanner(null), 2500);
        setPurifiedStats({});
        setGameState('playing');
        unlockAudio();
    }, [unlockAudio, thoughts, t.waveBanner]);

    useEffect(() => {
        resetAndStartGame();
        return () => {
            stopBgm();
        };
    }, [resetAndStartGame, stopBgm]);

    // 키보드 조작
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            unlockAudio();
            gameEngineRef.current.keys[e.key] = true;
            if (e.key === ' ' || e.key === 'Enter') {
                triggerZeroNova();
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            gameEngineRef.current.keys[e.key] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [unlockAudio, triggerZeroNova]);

    // ── 메인 게임 루프 (60 FPS) ──
    useEffect(() => {
        if (gameState !== 'playing') return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let isRunning = true;

        const loop = () => {
            if (!isRunning) return;

            const ge = gameEngineRef.current;
            const w = canvas.width;
            const h = canvas.height;

            ctx.save();
            if (ge.shakeTimer > 0) {
                ge.shakeTimer--;
                const shakeX = (Math.random() - 0.5) * 8;
                const shakeY = (Math.random() - 0.5) * 8;
                ctx.translate(shakeX, shakeY);
            }

            // 1. 화면 클리어 (딥 스페이스)
            ctx.fillStyle = '#060814';
            ctx.fillRect(0, 0, w, h);

            // 🌌 2026 최신형 사이버 성운(Nebula) 배경 렌더링
            ge.nebulaOffset += 0.003;
            const nebulaX = w / 2 + Math.sin(ge.nebulaOffset) * 60;
            const nebulaY = h / 2 + Math.cos(ge.nebulaOffset * 0.8) * 60;
            const nebGrad = ctx.createRadialGradient(nebulaX, nebulaY, 20, nebulaX, nebulaY, 260);
            nebGrad.addColorStop(0, 'rgba(56, 189, 248, 0.07)');
            nebGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.05)');
            nebGrad.addColorStop(1, 'rgba(6, 8, 20, 0)');
            ctx.fillStyle = nebGrad;
            ctx.fillRect(0, 0, w, h);

            // 피버 모드 외곽 오라
            if (ge.feverTimer > 0) {
                ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
                ctx.lineWidth = 6;
                ctx.strokeRect(3, 3, w - 6, h - 6);
            }

            // 2. 패럴랙스 별무리
            ge.stars.forEach(star => {
                star.y += star.speed * (ge.feverTimer > 0 ? 2.2 : 1.0);
                if (star.y > h) {
                    star.y = 0;
                    star.x = Math.random() * w;
                }
                ctx.fillStyle = star.color;
                ctx.globalAlpha = star.opacity;
                ctx.fillRect(star.x, star.y, star.size, star.size);
            });
            ctx.globalAlpha = 1.0;

            // 3. 콤보 및 피버 타이머 관리
            if (ge.comboTimer > 0) {
                ge.comboTimer--;
                if (ge.comboTimer <= 0) {
                    ge.combo = 0;
                    setComboCount(0);
                }
            }

            if (ge.feverTimer > 0) {
                ge.feverTimer--;
                if (ge.feverTimer <= 0) {
                    setIsFeverMode(false);
                }
            }

            // 4. 플레이어 이동
            const p = ge.player;
            if (ge.keys['ArrowLeft'] || ge.keys['a'] || ge.keys['A']) {
                p.x -= p.speed;
            }
            if (ge.keys['ArrowRight'] || ge.keys['d'] || ge.keys['D']) {
                p.x += p.speed;
            }
            if (ge.mousePos.x !== p.x) {
                p.x += (ge.mousePos.x - p.x) * 0.32;
            }
            p.x = Math.max(26, Math.min(w - 26, p.x));

            if (p.shieldTimer > 0) p.shieldTimer--;

            if (p.hasDrone) {
                p.droneAngle += 0.06;
            }

            // 5. 무기 자동 연사
            const now = performance.now();
            const currentFireInterval = ge.feverTimer > 0 ? 105 : ge.fireInterval;
            if (now - ge.lastFireTime >= currentFireInterval) {
                ge.lastFireTime = now;
                const isFever = ge.feverTimer > 0;

                if (isFever) {
                    ge.bullets.push({ x: p.x, y: p.y - 18, vx: 0, vy: -10, radius: 4, color: '#fbbf24', isFever: true });
                    ge.bullets.push({ x: p.x - 14, y: p.y - 14, vx: -2.4, vy: -9.5, radius: 3.5, color: '#34d399', isFever: true });
                    ge.bullets.push({ x: p.x + 14, y: p.y - 14, vx: 2.4, vy: -9.5, radius: 3.5, color: '#34d399', isFever: true });
                } else if (p.power === 1) {
                    ge.bullets.push({ x: p.x, y: p.y - 18, vx: 0, vy: -8.5, radius: 3, color: '#38bdf8' });
                } else if (p.power === 2) {
                    ge.bullets.push({ x: p.x - 9, y: p.y - 16, vx: 0, vy: -8.5, radius: 3, color: '#22d3ee' });
                    ge.bullets.push({ x: p.x + 9, y: p.y - 16, vx: 0, vy: -8.5, radius: 3, color: '#22d3ee' });
                } else {
                    ge.bullets.push({ x: p.x, y: p.y - 20, vx: 0, vy: -9, radius: 4, color: '#f59e0b' });
                    ge.bullets.push({ x: p.x - 14, y: p.y - 14, vx: -1.2, vy: -8.5, radius: 3, color: '#38bdf8' });
                    ge.bullets.push({ x: p.x + 14, y: p.y - 14, vx: 1.2, vy: -8.5, radius: 3, color: '#38bdf8' });
                }

                if (p.hasDrone && ge.enemies.length > 0) {
                    const drone1X = p.x + Math.cos(p.droneAngle) * 32;
                    const drone1Y = p.y + Math.sin(p.droneAngle) * 16;
                    const drone2X = p.x + Math.cos(p.droneAngle + Math.PI) * 32;
                    const drone2Y = p.y + Math.sin(p.droneAngle + Math.PI) * 16;

                    ge.bullets.push({ x: drone1X, y: drone1Y, vx: 0, vy: -9, radius: 2.8, color: '#a855f7', isHoming: true });
                    ge.bullets.push({ x: drone2X, y: drone2Y, vx: 0, vy: -9, radius: 2.8, color: '#a855f7', isHoming: true });
                }

                playLaserSound(isFever);
            }

            // 6. 총알 업데이트 및 렌더링
            for (let i = ge.bullets.length - 1; i >= 0; i--) {
                const b = ge.bullets[i];
                b.x += b.vx;
                b.y += b.vy;

                ctx.fillStyle = b.color;
                ctx.shadowColor = b.color;
                ctx.shadowBlur = b.isFever ? 14 : 9;
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                if (b.y < -10 || b.x < -10 || b.x > w + 10) {
                    ge.bullets.splice(i, 1);
                }
            }

            // 7. 적 잡념 군단 업데이트 & 렌더링
            for (let i = ge.enemies.length - 1; i >= 0; i--) {
                const e = ge.enemies[i];
                e.x += e.vx;
                if (e.x < 30 || e.x > w - 30) e.vx *= -1;
                if (e.hitFlash > 0) e.hitFlash--;
                e.wingPhase += 0.12;

                e.diveTimer--;
                if (e.diveTimer <= 0) {
                    e.y += 2.4;
                    e.x += Math.sin(e.y * 0.05) * 2.2;

                    if (e.y > h + 20) {
                        e.y = 35;
                        e.diveTimer = 140 + Math.floor(Math.random() * 220);
                    }

                    if (Math.random() < 0.024) {
                        ge.enemyBullets.push({ x: e.x, y: e.y + 12, vx: 0, vy: 4.2, radius: 3.2 });
                    }
                }

                ctx.save();
                ctx.translate(e.x, e.y);
                ctx.fillStyle = e.hitFlash > 0 ? '#ffffff' : e.color;
                ctx.shadowColor = e.color;
                ctx.shadowBlur = e.hitFlash > 0 ? 18 : 10;
                
                const wingSpan = 16 + Math.sin(e.wingPhase) * 4;
                ctx.beginPath();
                ctx.moveTo(0, -12);
                ctx.lineTo(wingSpan, -2);
                ctx.lineTo(wingSpan * 0.7, 12);
                ctx.lineTo(-wingSpan * 0.7, 12);
                ctx.lineTo(-wingSpan, -2);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.fillRect(-6, -2, 3, 3);
                ctx.fillRect(3, -2, 3, 3);
                ctx.restore();

                ctx.font = 'bold 10px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.fillText(e.text, e.x, e.y - 16);

                for (let bi = ge.bullets.length - 1; bi >= 0; bi--) {
                    const b = ge.bullets[bi];
                    const dist = Math.hypot(b.x - e.x, b.y - e.y);
                    if (dist < 22) {
                        ge.bullets.splice(bi, 1);
                        e.hp--;
                        e.hitFlash = 5;

                        if (e.hp <= 0) {
                            triggerHaptic(20);
                            for (let pIdx = 0; pIdx < 16; pIdx++) {
                                ge.particles.push({
                                    x: e.x,
                                    y: e.y,
                                    vx: (Math.random() - 0.5) * 8,
                                    vy: (Math.random() - 0.5) * 8,
                                    color: e.color,
                                    life: 25,
                                    maxLife: 25,
                                    size: 2 + Math.random() * 3.5
                                });
                            }

                            ge.floatingTexts.push({
                                x: e.x,
                                y: e.y - 8,
                                text: e.insight,
                                color: '#34d399',
                                life: 55,
                                maxLife: 55,
                                vy: -1.0
                            });
                            playInsightSound();

                            ge.combo++;
                            ge.comboTimer = 160;
                            if (ge.combo > ge.maxCombo) ge.maxCombo = ge.combo;
                            setComboCount(ge.combo);
                            playComboSound(ge.combo);

                            ge.ultimateEnergy = Math.min(100, ge.ultimateEnergy + 6);
                            setUltimateGauge(ge.ultimateEnergy);

                            if (ge.combo >= 8 && ge.feverTimer <= 0) {
                                ge.feverTimer = 340;
                                setIsFeverMode(true);
                                playFeverSound();
                            }

                            setPurifiedStats(prev => {
                                const current = prev[e.text] || { count: 0, insight: e.insight, tag: e.tag };
                                return {
                                    ...prev,
                                    [e.text]: { count: current.count + 1, insight: e.insight, tag: e.tag }
                                };
                            });

                            if (Math.random() < 0.24) {
                                const types: Array<'power' | 'shield' | 'life' | 'drone'> = ['power', 'shield', 'life', 'drone'];
                                const itemType = types[Math.floor(Math.random() * types.length)];
                                ge.items.push({
                                    x: e.x,
                                    y: e.y,
                                    vy: 1.8,
                                    type: itemType,
                                    label: itemType === 'power' ? '⚡2X' : itemType === 'shield' ? '🛡️0' : itemType === 'drone' ? '🛸드론' : '💖+1'
                                });
                            }

                            playExplosionSound();
                            const earnedPoints = ge.feverTimer > 0 ? e.points * 2 : e.points;
                            ge.score += earnedPoints;
                            setScore(ge.score);
                            setStressPct(prev => Math.max(0, prev - (ge.wave >= 3 ? 3 : 5)));
                            if (onExpEarned) onExpEarned(10);
                            ge.enemies.splice(i, 1);
                            break;
                        }
                    }
                }

                if (ge.player.shieldTimer <= 0) {
                    const playerDist = Math.hypot(ge.player.x - e.x, ge.player.y - e.y);
                    if (playerDist < 28) {
                        ge.lives--;
                        setLives(ge.lives);
                        ge.player.shieldTimer = 90;
                        ge.shakeTimer = 10;
                        ge.combo = 0;
                        setComboCount(0);
                        playExplosionSound();
                        triggerHaptic(40);

                        if (ge.lives <= 0) {
                            setGameState('gameover');
                            isRunning = false;
                            ctx.restore();
                            return;
                        }
                    }
                }
            }

            // 8. 거대 에고 보스
            if (ge.boss && ge.boss.active) {
                const b = ge.boss;

                if (b.tractorState === 'stunned') {
                    b.tractorTimer--;
                    if (b.tractorTimer <= 0) {
                        b.tractorState = 'idle';
                        b.tractorTimer = 180;
                    }
                } else {
                    b.x += b.vx;
                    if (b.x < 70 || b.x > w - 70) b.vx *= -1;
                }

                if (b.hitFlash > 0) b.hitFlash--;

                if (b.tractorState !== 'stunned') {
                    b.shootTimer--;
                    if (b.shootTimer <= 0) {
                        b.shootTimer = 46;
                        ge.enemyBullets.push({ x: b.x - 30, y: b.y + 30, vx: -1.2, vy: 3.8, radius: 4 });
                        ge.enemyBullets.push({ x: b.x, y: b.y + 35, vx: 0, vy: 4.5, radius: 5 });
                        ge.enemyBullets.push({ x: b.x + 30, y: b.y + 30, vx: 1.2, vy: 3.8, radius: 4 });
                    }
                }

                if (b.tractorState === 'idle') {
                    b.tractorTimer--;
                    if (b.tractorTimer <= 0) {
                        b.tractorState = 'charging';
                        b.tractorTimer = 60;
                        setTractorNotice(t.tractorWarning);
                    }
                } else if (b.tractorState === 'charging') {
                    b.tractorTimer--;
                    if (b.tractorTimer <= 0) {
                        b.tractorState = 'firing';
                        b.tractorTimer = 180;
                        b.tractorHits = 0;
                        playTractorSound();
                    }
                } else if (b.tractorState === 'firing') {
                    b.tractorTimer--;
                    if (Math.random() < 0.1) playTractorSound();

                    const beamGrad = ctx.createLinearGradient(b.x, b.y + 25, b.x, h);
                    beamGrad.addColorStop(0, 'rgba(6, 182, 212, 0.65)');
                    beamGrad.addColorStop(1, 'rgba(192, 132, 252, 0.18)');

                    ctx.fillStyle = beamGrad;
                    ctx.beginPath();
                    ctx.moveTo(b.x - 18, b.y + 28);
                    ctx.lineTo(b.x + 18, b.y + 28);
                    ctx.lineTo(b.x + 80, h);
                    ctx.lineTo(b.x - 80, h);
                    ctx.closePath();
                    ctx.fill();

                    const beamLeft = b.x - 70;
                    const beamRight = b.x + 70;
                    if (p.x >= beamLeft && p.x <= beamRight && p.y > b.y + 40) {
                        p.y -= 1.8;
                        p.x += (b.x - p.x) * 0.05;
                    }

                    if (b.tractorTimer <= 0) {
                        b.tractorState = 'idle';
                        b.tractorTimer = 220;
                        setTractorNotice(null);
                    }
                }

                ctx.save();
                ctx.translate(b.x, b.y);
                ctx.shadowColor = b.hitFlash > 0 ? '#ffffff' : (b.tractorState === 'stunned' ? '#38bdf8' : '#f43f5e');
                ctx.shadowBlur = b.hitFlash > 0 ? 30 : 20;
                ctx.fillStyle = b.hitFlash > 0 ? '#ffffff' : (b.tractorState === 'stunned' ? '#0f172a' : '#4c0519');
                ctx.beginPath();
                ctx.roundRect(-60, -28, 120, 56, 18);
                ctx.fill();

                ctx.strokeStyle = b.tractorState === 'stunned' ? '#38bdf8' : '#fb7185';
                ctx.lineWidth = 4;
                ctx.strokeRect(-50, -20, 42, 40);
                ctx.strokeRect(8, -20, 42, 40);
                ctx.beginPath();
                ctx.moveTo(-8, 0);
                ctx.lineTo(8, 0);
                ctx.stroke();

                ctx.fillStyle = b.tractorState === 'stunned' ? '#38bdf8' : '#f43f5e';
                ctx.beginPath();
                ctx.arc(-29, 0, 9, 0, Math.PI * 2);
                ctx.arc(29, 0, 9, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();

                const hpPct = b.hp / b.maxHp;
                ctx.fillStyle = 'rgba(0,0,0,0.6)';
                ctx.fillRect(w / 2 - 80, 16, 160, 8);
                ctx.fillStyle = b.tractorState === 'stunned' ? '#38bdf8' : '#f43f5e';
                ctx.fillRect(w / 2 - 80, 16, 160 * hpPct, 8);
                ctx.strokeStyle = '#ffffff';
                ctx.strokeRect(w / 2 - 80, 16, 160, 8);

                ctx.font = 'bold 11px sans-serif';
                ctx.fillStyle = '#fecdd3';
                ctx.textAlign = 'center';
                ctx.fillText(b.tractorState === 'stunned' ? '⚡ STUNNED (그로기)' : t.bossName, w / 2, 12);

                for (let bi = ge.bullets.length - 1; bi >= 0; bi--) {
                    const blt = ge.bullets[bi];
                    if (blt.x > b.x - 60 && blt.x < b.x + 60 && blt.y > b.y - 28 && blt.y < b.y + 28) {
                        ge.bullets.splice(bi, 1);
                        b.hp -= (ge.feverTimer > 0 ? 2 : 1);
                        b.hitFlash = 5;

                        ge.ultimateEnergy = Math.min(100, ge.ultimateEnergy + 2);
                        setUltimateGauge(ge.ultimateEnergy);

                        if (b.tractorState === 'firing') {
                            b.tractorHits++;
                            if (b.tractorHits >= 4) {
                                b.tractorState = 'stunned';
                                b.tractorTimer = 160;
                                setTractorNotice(t.tractorBroken);
                                setTimeout(() => setTractorNotice(null), 2500);
                                playExplosionSound();
                                triggerHaptic([30, 30, 60]);
                                ge.shakeTimer = 12;
                            }
                        }

                        for (let pIdx = 0; pIdx < 8; pIdx++) {
                            ge.particles.push({
                                x: blt.x,
                                y: blt.y,
                                vx: (Math.random() - 0.5) * 6,
                                vy: (Math.random() - 0.5) * 6,
                                color: '#f43f5e',
                                life: 18,
                                maxLife: 18,
                                size: 3
                            });
                        }

                        if (b.hp <= 0) {
                            triggerHaptic([80, 50, 100, 60, 150]);
                            for (let pIdx = 0; pIdx < 40; pIdx++) {
                                ge.particles.push({
                                    x: b.x + (Math.random() - 0.5) * 80,
                                    y: b.y + (Math.random() - 0.5) * 40,
                                    vx: (Math.random() - 0.5) * 12,
                                    vy: (Math.random() - 0.5) * 12,
                                    color: Math.random() > 0.5 ? '#f43f5e' : '#38bdf8',
                                    life: 45,
                                    maxLife: 45,
                                    size: 4 + Math.random() * 4
                                });
                            }
                            playExplosionSound();
                            ge.boss = null;
                            ge.score += 800;
                            setScore(ge.score);
                            setStressPct(0);
                            if (onExpEarned) onExpEarned(70);
                            
                            const examResult = passAcademyExam('quiz_galaga_boss', 2);
                            if (onExamClear) onExamClear(examResult.newLevel);

                            setGameState('clear');
                            isRunning = false;
                            ctx.restore();
                            return;
                        }
                    }
                }
            }

            // 9. 웨이브 진행 로직
            if (ge.enemies.length === 0 && (!ge.boss || !ge.boss.active)) {
                if (ge.wave < 3) {
                    ge.wave++;
                    setWave(ge.wave);
                    ge.enemies = spawnEnemyWave(w, ge.wave);
                    setWaveBanner(t.waveBanner[ge.wave as 2 | 3]);
                    setTimeout(() => setWaveBanner(null), 2500);
                    playPowerupSound();
                } else if (ge.wave === 3) {
                    ge.wave = 4;
                    setWave(4);
                    setWaveBanner(t.waveBanner[4]);
                    setTimeout(() => setWaveBanner(null), 2500);
                    ge.boss = spawnBoss(w);
                }
            }

            // 10. 적 총알
            for (let i = ge.enemyBullets.length - 1; i >= 0; i--) {
                const eb = ge.enemyBullets[i];
                eb.x += eb.vx;
                eb.y += eb.vy;

                ctx.beginPath();
                ctx.arc(eb.x, eb.y, eb.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#f43f5e';
                ctx.shadowColor = '#f43f5e';
                ctx.shadowBlur = 6;
                ctx.fill();
                ctx.shadowBlur = 0;

                if (ge.player.shieldTimer <= 0) {
                    const dist = Math.hypot(eb.x - ge.player.x, eb.y - ge.player.y);
                    if (dist < 20) {
                        ge.enemyBullets.splice(i, 1);
                        ge.lives--;
                        setLives(ge.lives);
                        ge.player.shieldTimer = 90;
                        ge.shakeTimer = 8;
                        ge.combo = 0;
                        setComboCount(0);
                        playExplosionSound();
                        triggerHaptic(40);

                        if (ge.lives <= 0) {
                            setGameState('gameover');
                            isRunning = false;
                            ctx.restore();
                            return;
                        }
                        continue;
                    }
                }

                if (eb.y > h + 10) ge.enemyBullets.splice(i, 1);
            }

            // 11. 파워업 아이템
            for (let i = ge.items.length - 1; i >= 0; i--) {
                const it = ge.items[i];
                it.y += it.vy;

                ctx.fillStyle = it.type === 'power' ? '#f59e0b' : it.type === 'shield' ? '#06b6d4' : it.type === 'drone' ? '#a855f7' : '#ec4899';
                ctx.beginPath();
                ctx.roundRect(it.x - 14, it.y - 10, 28, 20, 8);
                ctx.fill();

                ctx.font = 'bold 9px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.fillText(it.label, it.x, it.y + 4);

                const dist = Math.hypot(it.x - ge.player.x, it.y - ge.player.y);
                if (dist < 28) {
                    ge.items.splice(i, 1);
                    playPowerupSound();
                    triggerHaptic(25);
                    if (it.type === 'power') {
                        ge.player.power = Math.min(3, ge.player.power + 1);
                    } else if (it.type === 'shield') {
                        ge.player.shieldTimer = 300;
                    } else if (it.type === 'drone') {
                        ge.player.hasDrone = true;
                    } else if (it.type === 'life') {
                        ge.lives = Math.min(5, ge.lives + 1);
                        setLives(ge.lives);
                    }
                    ge.score += 50;
                    setScore(ge.score);
                }

                if (it.y > h + 20) ge.items.splice(i, 1);
            }

            // 12. 충격파 링 (Shockwaves)
            for (let i = ge.shockwaves.length - 1; i >= 0; i--) {
                const sw = ge.shockwaves[i];
                sw.radius += 18;
                sw.life--;

                ctx.strokeStyle = sw.color;
                ctx.lineWidth = 4 * (sw.life / 30);
                ctx.beginPath();
                ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
                ctx.stroke();

                if (sw.life <= 0 || sw.radius >= sw.maxRadius) {
                    ge.shockwaves.splice(i, 1);
                }
            }

            // 13. 초록빛 긍정 승화 플로팅 텍스트
            for (let i = ge.floatingTexts.length - 1; i >= 0; i--) {
                const ft = ge.floatingTexts[i];
                ft.y += ft.vy;
                ft.life--;

                const alpha = Math.min(1, ft.life / (ft.maxLife * 0.4));
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.font = 'bold 12px sans-serif';
                ctx.fillStyle = ft.color;
                ctx.shadowColor = ft.color;
                ctx.shadowBlur = 10;
                ctx.textAlign = 'center';
                ctx.fillText(ft.text, ft.x, ft.y);
                ctx.restore();

                if (ft.life <= 0) ge.floatingTexts.splice(i, 1);
            }

            // 14. 파티클
            for (let i = ge.particles.length - 1; i >= 0; i--) {
                const pt = ge.particles[i];
                pt.x += pt.vx;
                pt.y += pt.vy;
                pt.life--;

                const alpha = pt.life / pt.maxLife;
                ctx.fillStyle = pt.color;
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;

                if (pt.life <= 0) ge.particles.splice(i, 1);
            }

            // 15. 🛸 호위 자각 드론 렌더링
            if (p.hasDrone) {
                const d1X = p.x + Math.cos(p.droneAngle) * 32;
                const d1Y = p.y + Math.sin(p.droneAngle) * 16;
                const d2X = p.x + Math.cos(p.droneAngle + Math.PI) * 32;
                const d2Y = p.y + Math.sin(p.droneAngle + Math.PI) * 16;

                [ { x: d1X, y: d1Y }, { x: d2X, y: d2Y } ].forEach(dPos => {
                    ctx.save();
                    ctx.translate(dPos.x, dPos.y);
                    ctx.fillStyle = '#a855f7';
                    ctx.shadowColor = '#c084fc';
                    ctx.shadowBlur = 10;
                    ctx.beginPath();
                    ctx.roundRect(-5, -5, 10, 10, 3);
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(-2, -2, 4, 4);
                    ctx.restore();
                });
            }

            // 16. 🚀 2026 최신형 네오 파이터
            ctx.save();
            ctx.translate(ge.player.x, ge.player.y);

            // 육각형 홀로그램 쉴드 배리어
            if (ge.player.shieldTimer > 0) {
                ctx.strokeStyle = '#38bdf8';
                ctx.shadowColor = '#38bdf8';
                ctx.shadowBlur = 16;
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                for (let a = 0; a < 6; a++) {
                    const angle = (Math.PI / 3) * a + performance.now() * 0.002;
                    const hx = Math.cos(angle) * 30;
                    const hy = Math.sin(angle) * 30;
                    if (a === 0) ctx.moveTo(hx, hy);
                    else ctx.lineTo(hx, hy);
                }
                ctx.closePath();
                ctx.stroke();
                ctx.shadowBlur = 0;
            }

            // 전투기 동체
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = ge.feverTimer > 0 ? '#fbbf24' : '#38bdf8';
            ctx.shadowBlur = ge.feverTimer > 0 ? 20 : 14;
            ctx.beginPath();
            ctx.moveTo(0, -24);
            ctx.lineTo(24, 15);
            ctx.lineTo(9, 12);
            ctx.lineTo(0, 18);
            ctx.lineTo(-9, 12);
            ctx.lineTo(-24, 15);
            ctx.closePath();
            ctx.fill();

            // 네온 윙렛
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.moveTo(24, 15);
            ctx.lineTo(15, 3);
            ctx.lineTo(15, 13);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(-24, 15);
            ctx.lineTo(-15, 3);
            ctx.lineTo(-15, 13);
            ctx.closePath();
            ctx.fill();

            // 콕핏
            ctx.fillStyle = ge.feverTimer > 0 ? '#f59e0b' : '#06b6d4';
            ctx.beginPath();
            ctx.arc(0, -4, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(-2, -6, 2, 0, Math.PI * 2);
            ctx.fill();

            // 트윈 플라즈마 화염
            const flameLen = 15 + Math.random() * (ge.feverTimer > 0 ? 15 : 9);
            ctx.fillStyle = ge.feverTimer > 0 ? '#38bdf8' : '#f59e0b';
            ctx.beginPath();
            ctx.moveTo(-7, 15);
            ctx.lineTo(-4, 15 + flameLen);
            ctx.lineTo(-1, 15);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(1, 15);
            ctx.lineTo(4, 15 + flameLen);
            ctx.lineTo(7, 15);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
            ctx.restore();

            ge.animId = requestAnimationFrame(loop);
        };

        gameEngineRef.current.animId = requestAnimationFrame(loop);

        return () => {
            isRunning = false;
            if (gameEngineRef.current.animId) {
                cancelAnimationFrame(gameEngineRef.current.animId);
            }
        };
    }, [
        gameState, playLaserSound, playExplosionSound, playComboSound, playFeverSound, 
        playInsightSound, playTractorSound, playPowerupSound, onExpEarned, onExamClear, 
        t.bossName, t.tractorWarning, t.tractorBroken, t.waveBanner, triggerHaptic
    ]);

    // 마우스 및 원터치 다이렉트 핑거 트래킹
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        unlockAudio();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const x = (e.clientX - rect.left) * scaleX;
        gameEngineRef.current.mousePos.x = x;
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
        unlockAudio();
        gameEngineRef.current.isTouching = true;
        const canvas = canvasRef.current;
        if (!canvas || e.touches.length === 0) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const x = (e.touches[0].clientX - rect.left) * scaleX;
        gameEngineRef.current.mousePos.x = x;
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas || e.touches.length === 0) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const x = (e.touches[0].clientX - rect.left) * scaleX;
        gameEngineRef.current.mousePos.x = x;
    };

    const handleTouchEnd = () => {
        gameEngineRef.current.isTouching = false;
    };

    const moveLeft = () => {
        unlockAudio();
        gameEngineRef.current.mousePos.x = Math.max(30, gameEngineRef.current.player.x - 45);
    };

    const moveRight = () => {
        unlockAudio();
        gameEngineRef.current.mousePos.x = Math.min(370, gameEngineRef.current.player.x + 45);
    };

    useEffect(() => {
        if (score > highScore) setHighScore(score);
    }, [score, highScore]);

    // 인증서 복사
    const handleCopyCertificate = () => {
        const statsSummary = Object.entries(purifiedStats)
            .map(([thought, data]) => `- [#${data.tag}] ${thought} (${data.count}회 격퇴) ➔ "${data.insight}" 승화`)
            .join('\n');

        const certText = `[명심 마음자각 연구소 공인 마인드 리셋 인증서]
------------------------------------
🎯 격추 점수: ${score} PTS
🔥 최대 연속 콤보: ${gameEngineRef.current.maxCombo} 연타
🧠 뇌파 상태: α(알파)파 99.4% 고요 동조
🌿 잔여 스트레스: 0% 완벽 영점(Zero-Point) 복귀

[정화된 인지왜곡 및 승화 목록]
${statsSummary || '- 모든 잡념 즉각 완전 정화 완료'}

✨ "잡념은 내가 아닙니다. 바라보고 자각하는 순간 순수한 빛으로 흩어집니다."
공식 인증: myeongsimcoaching.com`;

        navigator.clipboard.writeText(certText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    return (
        <div 
            onClick={unlockAudio}
            className="flex flex-col items-center justify-center w-full max-w-lg mx-auto select-none"
        >
            {/* 상단 HUD 바 */}
            <div className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#0c1022] rounded-2xl border border-white/10 flex items-center justify-between text-xs mb-2 shadow-md">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 font-mono font-bold text-cyan-300 text-[11px] sm:text-xs">
                        <Trophy size={13} className="text-amber-400" />
                        <span>{score} PTS</span>
                    </div>

                    <div className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 font-mono text-[10px] text-purple-300 font-bold">
                        WAVE {wave}/4
                    </div>

                    {comboCount > 1 && (
                        <div className="flex items-center gap-0.5 font-mono font-extrabold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded-full border border-amber-400/40 animate-pulse text-[10px]">
                            <Flame size={11} />
                            <span>{comboCount}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Heart
                            key={i}
                            size={13}
                            className={i < lives ? 'text-rose-500 fill-rose-500' : 'text-white/10'}
                        />
                    ))}
                </div>

                <div className="flex items-center gap-1.5">
                    {/* BGM 토글 버튼 */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            unlockAudio();
                            if (bgmEnabled) {
                                stopBgm();
                                setBgmEnabled(false);
                            } else {
                                setBgmEnabled(true);
                                startBgm();
                            }
                        }}
                        className={`p-1 rounded-xl border flex items-center gap-0.5 text-[9px] font-mono font-bold cursor-pointer transition-all ${
                            bgmEnabled ? 'bg-purple-500/20 text-purple-300 border-purple-400/40' : 'bg-white/5 text-gray-400 border-white/10'
                        }`}
                        title="신스 BGM 토글"
                    >
                        <Music size={11} className={bgmEnabled ? 'animate-spin' : ''} />
                        <span>BGM</span>
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            unlockAudio();
                            setIsMuted(!isMuted);
                        }}
                        className="p-1 sm:p-1.5 rounded-xl border flex items-center gap-1 cursor-pointer transition-all bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-sm"
                    >
                        {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} className="animate-pulse" />}
                        <span className="text-[9px] sm:text-[10px] font-mono font-bold">{isMuted ? 'MUTE' : 'SFX'}</span>
                    </button>
                </div>
            </div>

            {/* 캔버스 게임 화면 프레임 */}
            <div 
                onClick={unlockAudio}
                className="relative w-full h-[370px] sm:h-[450px] rounded-3xl overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_45px_rgba(6,182,212,0.3)] bg-[#060814]"
            >
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={500}
                    onMouseMove={handleMouseMove}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className="w-full h-full cursor-crosshair touch-none"
                />

                {/* 사운드 활성화 안내 */}
                {!soundActive && (
                    <div 
                        onClick={unlockAudio}
                        className="absolute top-2 inset-x-4 mx-auto py-1 px-2.5 rounded-xl bg-cyan-950/90 border border-cyan-400/60 text-cyan-200 text-[11px] font-bold text-center cursor-pointer shadow-lg animate-bounce flex items-center justify-center gap-1.5 z-20"
                    >
                        <Volume1 size={13} />
                        <span>{t.soundPrompt}</span>
                    </div>
                )}

                {/* 웨이브 알림 배너 */}
                <AnimatePresence>
                    {waveBanner && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute top-1/3 inset-x-6 mx-auto py-2 px-4 rounded-2xl bg-indigo-950/90 border-2 border-cyan-400 text-cyan-200 text-xs sm:text-sm font-black text-center shadow-[0_0_30px_rgba(6,182,212,0.7)] z-20 flex items-center justify-center gap-1.5"
                        >
                            <Sparkles size={16} className="text-yellow-400 animate-spin" />
                            <span>{waveBanner}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 과몰입 피버 배너 */}
                <AnimatePresence>
                    {isFeverMode && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-2 inset-x-6 mx-auto py-1 px-3 rounded-xl bg-gradient-to-r from-amber-500/90 via-rose-500/90 to-amber-500/90 border border-amber-300 text-slate-950 text-[11px] font-black text-center shadow-lg flex items-center justify-center gap-1 z-20"
                        >
                            <Flame size={13} className="text-white fill-white animate-bounce" />
                            <span>{t.feverBanner}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 보스 알림 & 트랙터 빔 공지 */}
                <AnimatePresence>
                    {bossWarning && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ repeat: 3, duration: 0.5 }}
                            className="absolute top-1/4 inset-x-0 mx-auto w-fit px-4 py-2 bg-rose-600/90 text-white font-black text-xs sm:text-sm rounded-2xl border-2 border-rose-300 shadow-[0_0_30px_rgba(244,63,94,0.8)] flex items-center gap-2 z-20"
                        >
                            <span>{t.bossWarning}</span>
                        </motion.div>
                    )}

                    {tractorNotice && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-12 inset-x-4 mx-auto py-1.5 px-3 bg-cyan-950/90 border border-cyan-400 text-cyan-200 text-[11px] font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 z-20"
                        >
                            <Zap size={13} className="text-yellow-400" />
                            <span>{tractorNotice}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 게임 오버 모달 */}
                {gameState === 'gameover' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center space-y-3 z-30"
                    >
                        <div className="size-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                            <Skull size={28} />
                        </div>
                        <div className="space-y-0.5">
                            <h3 className="text-sm sm:text-base font-black text-white">
                                {t.gameOver}
                            </h3>
                            <p className="text-[11px] text-gray-400">
                                잡념은 지나가는 구름일 뿐입니다. 다시 호흡을 가다듬어보세요.
                            </p>
                        </div>

                        <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-xs font-mono space-y-1 w-48">
                            <div className="flex justify-between text-gray-300 text-[11px]">
                                <span>최종 점수</span>
                                <span className="font-bold text-cyan-300">{score} PTS</span>
                            </div>
                            <div className="flex justify-between text-gray-300 text-[11px]">
                                <span>최대 콤보</span>
                                <span className="font-bold text-amber-400">{gameEngineRef.current.maxCombo} 연타</span>
                            </div>
                        </div>

                        <button
                            onClick={resetAndStartGame}
                            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/30 cursor-pointer active:scale-95 transition-all"
                        >
                            <RotateCcw size={14} />
                            <span>{t.restartBtn}</span>
                        </button>
                    </motion.div>
                )}

                {/* 🎉 게임 클리어: 마인드 영점 리셋 & 자각 인증 카드 모달 */}
                {gameState === 'clear' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-black/92 backdrop-blur-md flex flex-col justify-between p-3 sm:p-4 text-center z-30 overflow-y-auto"
                    >
                        <div className="space-y-1 pt-1 shrink-0">
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-[9px] font-mono text-cyan-300">
                                <Sparkles size={11} className="text-cyan-300" />
                                <span>{t.certSub}</span>
                            </div>
                            <h3 className="text-sm sm:text-base font-black text-white">
                                {t.certTitle}
                            </h3>
                            <p className="text-[10px] text-cyan-200/80 leading-tight">
                                {t.pureFactMsg}
                            </p>
                        </div>

                        <div className="w-full my-1.5 p-2.5 bg-cyan-950/60 rounded-2xl border border-cyan-400/40 text-left text-xs font-mono space-y-1.5">
                            <div className="flex justify-between items-center pb-1 border-b border-white/10 text-gray-300 text-[11px]">
                                <span>점수 / 콤보</span>
                                <span className="font-bold text-cyan-300">{score} PTS ({gameEngineRef.current.maxCombo} COMBO)</span>
                            </div>

                            <div className="text-[10px] text-emerald-300 flex items-center gap-1">
                                <Activity size={11} />
                                <span>{t.brainwaveStatus}</span>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold">
                                    <span>{t.purifiedTitle}:</span>
                                    <span className="text-cyan-400">총 {Object.values(purifiedStats).reduce((acc, cur) => acc + cur.count, 0)}개 정화</span>
                                </div>
                                <div className="max-h-24 sm:max-h-32 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                                    {Object.entries(purifiedStats).length > 0 ? (
                                        Object.entries(purifiedStats).map(([thought, data], idx) => (
                                            <div key={idx} className="p-1.5 bg-black/40 rounded-lg border border-white/5 text-[10px] space-y-0.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-amber-400 font-bold text-[9px] bg-amber-400/10 px-1 py-0.2 rounded border border-amber-400/20">
                                                        #{data.tag}
                                                    </span>
                                                    <span className="text-gray-400 text-[9px]">{data.count}회 격퇴</span>
                                                </div>
                                                <div className="flex items-center justify-between gap-1">
                                                    <span className="text-rose-300 line-through truncate max-w-[110px]">{thought}</span>
                                                    <span className="text-emerald-300 font-bold truncate max-w-[160px]">➔ {data.insight}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-[10px] text-gray-400">모든 잡념 완전 정화 완료!</div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between text-amber-300 font-bold pt-1 border-t border-white/10 text-[10px]">
                                <span>자각 EXP 보너스</span>
                                <span>+70 EXP (자격 승급)</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full pt-1 shrink-0">
                            <button
                                onClick={handleCopyCertificate}
                                className="flex-1 py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-all"
                            >
                                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                                <span>{copied ? t.certCopied : t.copyCert}</span>
                            </button>

                            <button
                                onClick={resetAndStartGame}
                                className="flex-1 py-2 px-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black text-[11px] flex items-center justify-center gap-1 shadow-lg shadow-cyan-500/30 cursor-pointer active:scale-95 transition-all"
                            >
                                <RotateCcw size={13} />
                                <span>{t.nextStage}</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* 💥 최신형 궁극기 게이지 & 발동 바 */}
            <div className="w-full flex items-center gap-2 mt-2 px-1">
                <div className="flex-1 bg-black/50 border border-white/10 rounded-xl h-9 px-2 flex items-center gap-2">
                    <Zap size={14} className={ultimateGauge >= 100 ? 'text-amber-400 animate-bounce' : 'text-gray-500'} />
                    <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-300 ${
                                ultimateGauge >= 100 
                                    ? 'bg-gradient-to-r from-amber-400 via-rose-500 to-amber-300 animate-pulse' 
                                    : 'bg-cyan-400'
                            }`}
                            style={{ width: `${ultimateGauge}%` }}
                        />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-gray-300 w-9 text-right">
                        {ultimateGauge}%
                    </span>
                </div>

                <button
                    onClick={triggerZeroNova}
                    disabled={ultimateGauge < 100}
                    className={`py-2 px-3 rounded-xl font-black text-xs flex items-center gap-1 transition-all cursor-pointer ${
                        ultimateGauge >= 100
                            ? 'bg-gradient-to-r from-amber-400 via-rose-500 to-amber-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse active:scale-95'
                            : 'bg-white/5 text-gray-500 border border-white/5 opacity-50 cursor-not-allowed'
                    }`}
                >
                    <Sparkles size={13} />
                    <span>{t.novaBtn}</span>
                </button>
            </div>

            {/* 모바일 원터치 이동 패드 */}
            <div className="w-full flex items-center justify-between gap-2.5 mt-2 px-1">
                <button
                    onClick={moveLeft}
                    className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-cyan-500/40 text-white font-bold text-xs flex items-center justify-center gap-1 border border-white/10 cursor-pointer transition-all"
                >
                    <ArrowLeft size={15} />
                    <span>좌측 이동</span>
                </button>
                <div className="text-[10px] text-cyan-300 font-mono text-center shrink-0">
                    자동 연사 ⚡
                </div>
                <button
                    onClick={moveRight}
                    className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-cyan-500/40 text-white font-bold text-xs flex items-center justify-center gap-1 border border-white/10 cursor-pointer transition-all"
                >
                    <span>우측 이동</span>
                    <ArrowRight size={15} />
                </button>
            </div>

            <p className="text-[10px] text-gray-400 font-mono mt-1.5 text-center">
                {t.controlsGuide}
            </p>
        </div>
    );
}
