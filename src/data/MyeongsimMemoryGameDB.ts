/**
 * MyeongsimMemoryGameDB.ts
 * 
 * 도서 《ZERO POINT》 및 명심코칭 핵심 원천 데이터베이스
 * 
 * 4대 분류:
 * 1. KEY_CONCEPT: 핵심 개념 (익숙함, 동일시, 정체성, 보호전략 등)
 * 2. POWER_QUESTION: 파워 질문 (내가 본 것이 전부일까? 등)
 * 3. MICRO_PRACTICE: 3분 실습 (POINT→LINE→LENS, LABEL→LIFE 등)
 * 4. ANCHOR_LINE: 앵커 문장 (감정은 경보다 판결문이 아니다 등)
 */

export interface PracticeStep {
    stepNumber: number;
    stepCode: string;
    title: { kr: string; en: string; jp: string; cn: string };
    prompt: { kr: string; en: string; jp: string; cn: string };
    placeholder: { kr: string; en: string; jp: string; cn: string };
    exampleAnswer: { kr: string; en: string; jp: string; cn: string };
}

export interface QuizScenario {
    scenario: { kr: string; en: string; jp: string; cn: string };
    question: { kr: string; en: string; jp: string; cn: string };
    options: {
        id: string;
        text: { kr: string; en: string; jp: string; cn: string };
        isCorrect: boolean;
        feedback: { kr: string; en: string; jp: string; cn: string };
    }[];
}

export interface MemoryCard {
    id: string;
    category: 'KEY_CONCEPT' | 'POWER_QUESTION' | 'MICRO_PRACTICE' | 'ANCHOR_LINE';
    icon: string;
    keyword: { kr: string; en: string; jp: string; cn: string };
    subCode: string; // 예: "POINT → LINE → LENS"
    oneLiner: { kr: string; en: string; jp: string; cn: string };
    coreInsight: { kr: string; en: string; jp: string; cn: string };
    memoryLevel: 'short' | 'mid' | 'long'; // 단기(3초 퀴즈), 중기(패턴브레이커), 장기(5-STEP 실습)
    quiz?: QuizScenario;
    practiceSteps?: PracticeStep[];
}

export const MEMORY_CARDS_DB: MemoryCard[] = [
    {
        id: 'card_01',
        category: 'ANCHOR_LINE',
        icon: '🚨',
        keyword: {
            kr: '감정은 경보다, 판결문은 아니다',
            en: 'Emotion is an Alarm, Not a Verdict',
            jp: '感情は警報であり、判決文ではない',
            cn: '情绪只是警报，绝非判决书'
        },
        subCode: 'ALARM ≠ VERDICT',
        oneLiner: {
            kr: '감정이 올라올 때 그것을 사실(판결)로 착각하지 않고, 몸이 보낸 신호(경보)로 분리하는 훈련',
            en: 'Separate emotions as body signals (alarms), not unchangeable objective facts (verdicts).',
            jp: '感情が湧き上がった時、それを事実(判決)と混同せず、身体からのサイン(警報)として切り離す練習',
            cn: '当情绪涌现时，不要误以为是客观事实（判决），而要将其看作身体发送的信号（警报）。'
        },
        coreInsight: {
            kr: '불안과 수치심은 "당신이 실패자"라는 판결문이 아니라, "무언가 주의가 필요하다"는 화재경보기일 뿐입니다.',
            en: 'Anxiety and shame are not verdicts that you failed; they are just smoke detectors reminding you to check.',
            jp: '不安や恥は「あなたが落伍者」という判決ではなく、「注意が必要だ」という火災報知器に過ぎません。',
            cn: '焦虑与羞愧不是判定你失败的判决书，只是提醒你“需要留意某些事物”的烟雾报警器。'
        },
        memoryLevel: 'short',
        quiz: {
            scenario: {
                kr: '직장 동료에게 중요한 제안 메시지를 보냈는데 반나절 동안 읽씹을 당했습니다. 가슴이 답답하고 "나를 무시하나 봐"라는 생각이 강하게 듭니다.',
                en: 'You sent an important proposal to a colleague, but they left it unread for half a day. You feel heavy: "They are disrespecting me."',
                jp: '同僚に重要な提案メッセージを送ったのに、半日未読スルーされました。「見下されているのか」と胸が苦しくなります。',
                cn: '给同事发了重要提议信息，但对方半天没有回复。胸口发闷并强烈觉得：“他肯定在无视我。”'
            },
            question: {
                kr: '이 상황에서 ‘감정을 경보로 다루는’ 가장 지혜로운 알아차림은 무엇일까요?',
                en: 'What is the wisest response treating emotion as an alarm rather than a verdict?',
                jp: 'この状況で「感情を警報として扱う」最も賢明な自覚は何でしょうか？',
                cn: '在这种情况下，将情绪视为警报而非判决的最明智觉察是什么？'
            },
            options: [
                {
                    id: 'opt1',
                    text: {
                        kr: '“내가 무시당했다는 것은 객관적 사실이니, 나도 앞으로 그 동료를 쌀쌀맞게 대해야겠다.”',
                        en: '"It is a proven fact they ignored me, so I will treat them coldly too."',
                        jp: '「無視されたのは客観的事実だから、今後冷たく接しよう。」',
                        cn: '“被无视是客观事实，以后我也对他冷淡。”'
                    },
                    isCorrect: false,
                    feedback: {
                        kr: '경보를 판결문으로 확정해버린 전형적인 동일시 반응입니다.',
                        en: 'This mistook the alarm for a final verdict.',
                        jp: '警報を判決として確定してしまった過ちです。',
                        cn: '这是把警报当成既成判决的错误反应。'
                    }
                },
                {
                    id: 'opt2',
                    text: {
                        kr: '“지금 내 가슴에 답답한 경보(불안 신호)가 울렸구나. 하지만 그가 바쁜지 여부는 아직 확인되지 않은 사실이야.”',
                        en: '"An alarm of anxiety just went off in my chest. But whether they are busy is still an unverified fact."',
                        jp: '「今、胸の中で不安の警報が鳴っているな。でも相手が忙しいのかどうかはまだ未確認の事実だ。」',
                        cn: '“此刻胸口敲响了不安的警报。但对方是否很忙目前仍是未经验证的事实。”'
                    },
                    isCorrect: true,
                    feedback: {
                        kr: '완벽합니다! 감정 신호(경보)와 실제 현실(사실)을 1초 만에 깔끔하게 분리해냈습니다.',
                        en: 'Excellent! You separated the emotion alarm from external facts.',
                        jp: '完璧です！感情の警報と現実の事実を即座に分離できました。',
                        cn: '太棒了！你完美地将情绪警报与外部事实分离。'
                    }
                },
                {
                    id: 'opt3',
                    text: {
                        kr: '“답답한 감정을 억지로 억누르고 아무 생각도 하지 않으려 애쓴다.”',
                        en: '"Suppression: Try to forcefully bottle up the feeling and ignore it."',
                        jp: '「苦しい感情を無理に押し殺して、何も考えないようにする。」',
                        cn: '“强行压抑窒息感，努力什么都不去想。”'
                    },
                    isCorrect: false,
                    feedback: {
                        kr: '경보기를 억지로 부수면 화재 원인을 확인하지 못해 나중에 폭발합니다.',
                        en: 'Smashing the smoke alarm will cause bigger issues later.',
                        jp: '警報器を壊しても火事は防げません。',
                        cn: '强行关掉警报器无法阻止隐患，随后会更大规模爆发。'
                    }
                }
            ]
        }
    },
    {
        id: 'card_02',
        category: 'MICRO_PRACTICE',
        icon: '🔍',
        keyword: {
            kr: 'POINT → LINE → LENS',
            en: 'POINT → LINE → LENS',
            jp: 'POINT → LINE → LENS (点・線・レンズ)',
            cn: 'POINT → LINE → LENS (事件·故事·滤镜)'
        },
        subCode: '5-STEP DECONSTRUCTION',
        oneLiner: {
            kr: '하나의 사건(점)을 왜곡된 이야기(선)로 엮어 세상 전체를 편향된 안경(렌즈)으로 보는 것을 해체하는 5단계 실습',
            en: 'Deconstruct turning a single point into a narrative line and wearing it as a distorted lens.',
            jp: '一つの出来事(点)を歪んだ物語(線)に結びつけ、世界全体を偏った眼鏡(レンズ)で見ている構造を解体する5段階実習',
            cn: '将单一事件（点）串联为扭曲故事（线）并演化为偏见滤镜（透镜）的心灵解构5步实训。'
        },
        coreInsight: {
            kr: '사실은 오직 POINT뿐입니다. LINE과 LENS는 모두 내 뇌가 무의식적으로 지어낸 가상 소설입니다.',
            en: 'Only the POINT is real. The LINE and LENS are involuntary mental fictions.',
            jp: '事実はPOINT(点)だけです。LINEとLENSはすべて脳が自動生成した小説です。',
            cn: '事实只有“点（POINT）”。所谓的“线”与“滤镜”全是大脑无意识编造的小说。'
        },
        memoryLevel: 'long',
        practiceSteps: [
            {
                stepNumber: 1,
                stepCode: 'POINT',
                title: { kr: 'STEP 1 — POINT (사건)', en: 'STEP 1 — POINT (Event)', jp: 'STEP 1 — POINT (客観的事実)', cn: 'STEP 1 — POINT (单一事实)' },
                prompt: {
                    kr: '오늘 실제로 일어난 객관적 사건을 카메라로 찍듯 단 한 문장으로 적으세요.',
                    en: 'Describe what objectively happened in one factual sentence, like a camera recording.',
                    jp: '今日実際に起きた客観的事実を、カメラで録画したように1文で書いてください。',
                    cn: '像摄像机记录一样，用一句话写下今天实际发生的客观事实。'
                },
                placeholder: {
                    kr: '예: 회의 시간에 팀장님이 내 발표 중 고개를 두 번 가로저었다.',
                    en: 'e.g. During the meeting, the manager shook their head twice while I was presenting.',
                    jp: '例: 会議中、チーム長が私の発表中に2回首を横に振った。',
                    cn: '例：开会做汇报时，组长中途摇了两次头。'
                },
                exampleAnswer: {
                    kr: '팀장님이 발표 중 고개를 두 번 저었음.',
                    en: 'Manager shook head twice during presentation.',
                    jp: 'チーム長が発表中に2回首を横に振った。',
                    cn: '汇报时组长摇了两次头。'
                }
            },
            {
                stepNumber: 2,
                stepCode: 'LINE',
                title: { kr: 'STEP 2 — LINE (이야기 연결)', en: 'STEP 2 — LINE (Story)', jp: 'STEP 2 — LINE (物語の連結)', cn: 'STEP 2 — LINE (故事串联)' },
                prompt: {
                    kr: '그 사건(점)들을 과거 기억과 연결해 내 머릿속이 지어낸 비극적 이야기는 무엇인가요?',
                    en: 'What dramatic story did your brain weave connecting this point to past memories?',
                    jp: 'その出来事(点)を過去の記憶と繋げて、脳が作り出したストーリーは何ですか？',
                    cn: '你的大脑将这个点与过去的记忆连接，编织出了什么戏剧化的故事？'
                },
                placeholder: {
                    kr: '예: "팀장님은 나를 무능하다고 생각하고, 다음 인사평가에서 나를 좌천시킬 거야."',
                    en: 'e.g. "They think I am incompetent and will demote me on the next evaluation."',
                    jp: '例: 「チーム長は私を無能だと思っていて、次の評価で左遷されるだろう。」',
                    cn: '例：“组长认为我能力不足，下次绩效考评肯定要把我降职调离。”'
                },
                exampleAnswer: {
                    kr: '“내 기획안은 형편없고, 팀장님은 나를 신뢰하지 않는다.”',
                    en: '"My proposal is awful and the manager completely distrusts me."',
                    jp: '「私の企画案は最悪で、チーム長は私を全く信頼していない。」',
                    cn: '“我的方案烂透了，组长彻底对我失去了信任。”'
                }
            },
            {
                stepNumber: 3,
                stepCode: 'LENS',
                title: { kr: 'STEP 3 — LENS (안경/신념)', en: 'STEP 3 — LENS (Belief Filter)', jp: 'STEP 3 — LENS (色眼鏡・思い込み)', cn: 'STEP 3 — LENS (固有滤镜)' },
                prompt: {
                    kr: '그 이야기를 진실로 믿을 때, 나는 앞으로 세상과 나 자신을 어떤 왜곡된 렌즈로 보게 되나요?',
                    en: 'Believing that story, through what distorted lens do you view yourself and the world?',
                    jp: 'その物語を信じ込むと、世界や自分自身をどんな歪んだレンズで見るようになりますか？',
                    cn: '把这个故事当作真理时，你正在透过怎样的扭曲滤镜看待世界与自己？'
                },
                placeholder: {
                    kr: '예: "나는 어차피 인정받을 수 없는 사람이다"라는 결핍의 렌즈.',
                    en: 'e.g. "I am inherently destined to be unappreciated" - a lens of deficiency.',
                    jp: '例: 「どうせ私は認められない人間だ」という無力感のレンズ。',
                    cn: '例：“反正我永远也得不到认可”——匮乏与否定的滤镜。'
                },
                exampleAnswer: {
                    kr: '“모든 동료가 나를 무능하게 볼 것이라는 두려움의 렌즈.”',
                    en: '"A fear lens that everyone in the office looks down on me."',
                    jp: '「同僚全員が私を無能と見なしているという恐れのレンズ。」',
                    cn: '“认定周围所有同事都在看扁我的恐惧滤镜。”'
                }
            },
            {
                stepNumber: 4,
                stepCode: 'GAP',
                title: { kr: 'STEP 4 — GAP (반증 찾기)', en: 'STEP 4 — GAP (Evidence Gap)', jp: 'STEP 4 — GAP (反証・矛盾の発見)', cn: 'STEP 4 — GAP (寻找破绽)' },
                prompt: {
                    kr: '내가 만든 비극 소설(LINE)과 잘 맞지 않는 반대 증거나 빈틈이 단 하나라도 있나요?',
                    en: 'Is there any single fact or counter-evidence that contradicts your tragic story?',
                    jp: '自分が作った悲劇の物語(LINE)と矛盾する事実や証拠は何か一つでもありますか？',
                    cn: '是否存在任何哪怕一个与你编造的悲剧故事不符的反向事实证据？'
                },
                placeholder: {
                    kr: '예: 지난주에는 팀장님이 내 보고서 칭찬을 해주셨고, 오늘 목이 아파서 스트레칭한 것일 수도 있다.',
                    en: 'e.g. Last week they praised my report, and today their neck was hurting.',
                    jp: '例: 先週は報告書を褒めてくれたし、今日首が痛くてストレッチしただけかもしれない。',
                    cn: '例：上周组长刚夸过我的报告，今天可能只是他脖子酸痛在活动颈椎。'
                },
                exampleAnswer: {
                    kr: '팀장님이 회의 후 "자료는 꼼꼼해서 좋았다"고 슬쩍 말씀하셨음.',
                    en: 'Manager mentioned afterwards that the data appendix was well-organized.',
                    jp: '会議後、チーム長から「補足データは充実していて良かった」と言われた。',
                    cn: '散会后组长提了一句：“附件数据整理得很详细，还不错。”'
                }
            },
            {
                stepNumber: 5,
                stepCode: 'TODAY',
                title: { kr: 'STEP 5 — TODAY (작은 행동)', en: 'STEP 5 — TODAY (Micro Action)', jp: 'STEP 5 — TODAY (今日できる最小の行動)', cn: 'STEP 5 — TODAY (今日微行动)' },
                prompt: {
                    kr: '소설에서 빠져나와, 오늘 확인하거나 다르게 행동할 수 있는 가장 작은 1가지는 무엇인가요?',
                    en: 'Exiting the drama, what is the smallest single action you can test today?',
                    jp: '物語から脱出し、今日確認したり行動できる最小の1歩は何ですか？',
                    cn: '跳出思想戏剧，今天你能够去求证或尝试的最小一件行动是什么？'
                },
                placeholder: {
                    kr: '예: 오후에 팀장님께 커피 한 잔 건네며 "발표 중 보완할 점이 있으실까요?" 물어보기.',
                    en: 'e.g. Ask politely with a coffee: "Was there any specific part to improve?"',
                    jp: '例: 午後「発表で補足すべき点がありましたら教えてください」と軽く確認する。',
                    cn: '例：下午递一杯咖啡顺便问一句：“关于刚才的汇报，您有哪部分觉得需要再完善吗？”'
                },
                exampleAnswer: {
                    kr: '혼자 속 끓이지 않고 단 3분 피드백 요청 메일 보내기.',
                    en: 'Send a concise 3-minute feedback request email instead of agonizing alone.',
                    jp: '一人で悩む代わりに、手短に改善点を聞くメモを送る。',
                    cn: '不再一个人内耗，简短发个确认邮件请教关键改进建议。'
                }
            }
        ]
    },
    {
        id: 'card_03',
        category: 'POWER_QUESTION',
        icon: '💡',
        keyword: {
            kr: '내가 본 것이 전부일까?',
            en: 'Is What I Saw Really Everything?',
            jp: '私が見たものが全てだろうか？',
            cn: '我所看到的真的是全部吗？'
        },
        subCode: '1-MIN PERSPECTIVE SHIFT',
        oneLiner: {
            kr: '확증 편향과 좁은 시야를 1초 만에 흔들어 깨우는 초강력 관점 전환 질문',
            en: 'The 1-second perspective shaker that shatters confirmation bias and tunnel vision.',
            jp: '確証バイアスと狭い視野を瞬時に打ち砕く超強力な視点転換の問い',
            cn: '在1秒内击碎证实偏差与狭隘视野的超强认知转换提问。'
        },
        coreInsight: {
            kr: '인간의 감각기관은 전체 현실의 0.001%도 담지 못합니다. "내가 모르는 것이 아직 있다"고 인정할 때 자유가 시작됩니다.',
            en: 'Our sensory organs register under 0.001% of reality. Freedom begins when admitting "There is more I do not yet know."',
            jp: '人間の知覚は現実全体の0.001%も捉えられません。「まだ知らないことがある」と認めた時に自由が訪れます。',
            cn: '人类感官能够接收的现实不足0.001%。只有承认“我所不知道的事物依然存在”时，心灵自由才会降临。'
        },
        memoryLevel: 'mid',
        quiz: {
            scenario: {
                kr: '연인이 주말 약속 시간에 20분 늦었습니다. 헐레벌떡 뛰어오는데 표정이 굳어있습니다. 나는 "나와의 약속을 하찮게 여기는구나"라며 섭섭함이 치솟습니다.',
                en: 'Your partner arrives 20 minutes late with a tense expression. You instantly assume: "They treat our date as trivial."',
                jp: '恋人が約束に20分遅れてやって来ました。焦った様子ですが表情が硬く、「私のことを軽視している」と不満が募ります。',
                cn: '伴侣在周末约会迟到了20分钟，气喘吁吁跑来且神情严肃。你立刻涌起委屈：“他根本不重视和我的约会。”'
            },
            question: {
                kr: '이 순간 “내가 본 것이 전부일까?”를 작동시키는 가장 성숙한 내면 질문은 무엇인가요?',
                en: 'What internal question activates "Is what I saw really everything?" in this moment?',
                jp: 'この瞬間に「私が見たものが全てだろうか？」を発動させる最も成熟した内省は何ですか？',
                cn: '在这一刻，触发“我所看到的真的是全部吗？”的最成熟自我觉察是什么？'
            },
            options: [
                {
                    id: 'q3_opt1',
                    text: {
                        kr: '“저 사람이 오늘 오는 길에 어떤 급박한 사고나 말 못 할 사정이 있었는지 내가 아직 확인한 적이 있던가?”',
                        en: '"Did I actually verify what urgent event or struggle they might have faced on the way?"',
                        jp: '「相手がここに来る途中でどんな緊急事態や事情があったか、私は確認しただろうか？」',
                        cn: '“在来的路上对方是否遭遇了突发紧急状况或难言之隐，我是否曾主动确认过？”'
                    },
                    isCorrect: true,
                    feedback: {
                        kr: '정답입니다! 내 판단의 한계를 인정하고 미지의 여백을 남겨둘 때 오해와 싸움이 멈춥니다.',
                        en: 'Bingo! Leaving room for what you don’t yet know defuses misunderstandings.',
                        jp: '正解です！自分の判断の限界を認め余白を残すことで、誤解と衝突を防げます。',
                        cn: '回答正确！承认认知的局限并留出未知空间，误解与争吵就会瞬间熄灭。'
                    }
                },
                {
                    id: 'q3_opt2',
                    text: {
                        kr: '“표정이 굳어있는 걸 보니 나한테 불만이 있는 게 틀림없어. 내가 먼저 화를 내야지.”',
                        en: '"Their stiff face proves they are mad at me. I must get angry first."',
                        jp: '「硬い表情を見る限り、私に不満があるに違いない。先に怒っておこう。」',
                        cn: '“看他拉着脸肯定是对我不满，我得先发制人表达愤怒。”'
                    },
                    isCorrect: false,
                    feedback: {
                        kr: '표정이라는 작은 단편을 전부로 단정 짓고 자동 전투 모드로 돌입한 반응입니다.',
                        en: 'This falls right into automatic battle mode by jumping to conclusions.',
                        jp: '表情という断片を全体と決めつけ、自動戦闘態勢に入ってしまいました。',
                        cn: '这是把面部表情这一片段当成全部，陷入自动防御攻击状态的反应。'
                    }
                }
            ]
        }
    },
    {
        id: 'card_04',
        category: 'KEY_CONCEPT',
        icon: '🏷️',
        keyword: {
            kr: 'LABEL → LIFE',
            en: 'LABEL → LIFE',
            jp: 'LABEL → LIFE (レッテルと人生)',
            cn: 'LABEL → LIFE (标签解构)'
        },
        subCode: 'IDENTITY RESET',
        oneLiner: {
            kr: '“나는 원래 이런 사람이야”라는 낡은 딱지(Label)가 내 삶(Life)을 감옥으로 가두는 알고리즘을 해체하기',
            en: 'Dismantling the obsolete mental label "I am just naturally this way" that imprisons your life.',
            jp: '「私は元々こういう人間だから」という古いレッテル(Label)が人生(Life)を縛る仕組みを解体する',
            cn: '解构“我生来就是这种人”的陈旧标签（Label）将人生（Life）囚禁于定势算法中的枷锁。'
        },
        coreInsight: {
            kr: '당신은 그 어떤 수식어로도 정의될 수 없는 순수한 가능성의 장(Zero Point)입니다. 꼬리표를 떼어내면 삶이 다시 숨을 쉽니다.',
            en: 'You are an open field of pure possibility (Zero Point). Detach the label, and life breathes again.',
            jp: 'あなたはどんな言葉でも定義できない純粋な可能性の場(Zero Point)です。レッテルを剥がせば自由になります。',
            cn: '你是任何词汇都无法限定的纯粹可能性之场（零点）。撕掉标签，生命才能重新呼吸。'
        },
        memoryLevel: 'mid',
        quiz: {
            scenario: {
                kr: '새로운 프로젝트 리더 자리를 제안받았습니다. 속에서 덜컥 겁이 나며 “나는 원래 발표도 못 하고 사람들 이끄는 리더 기질이 아니야”라는 생각이 떠오릅니다.',
                en: 'Offered to lead a new project, fear kicks in: "I am inherently not a leadership type."',
                jp: '新規プロジェクトのリーダー職を打診されました。「私は元々人前で話せないしリーダー気質じゃない」と萎縮します。',
                cn: '收到了担任新项目负责人的提议。心中猛然一沉并冒出想法：“我生来就不擅长公众演讲，也没有带领别人的领导气质。”'
            },
            question: {
                kr: '이 ‘LABEL → LIFE’ 함정에서 벗어나는 제로포인트 자각 문장은 무엇일까요?',
                en: 'What Zero Point sentence breaks free from this LABEL → LIFE trap?',
                jp: 'この「LABEL → LIFE」の罠から抜け出すゼロポイント自覚の言葉はどれですか？',
                cn: '摆脱“LABEL → LIFE”陷阱的零点觉察句式是哪一个？'
            },
            options: [
                {
                    id: 'q4_opt1',
                    text: {
                        kr: '“맞아, 나는 내성적이니까 괜히 망신당하지 말고 거절하는 게 현명해.”',
                        en: '"Right, since I am naturally introverted, declining is the safe bet."',
                        jp: '「そうだ、私は内向的だから恥をかく前に断るのが賢明だ。」',
                        cn: '“没错，我生性内向，与其丢脸不如直接拒绝更为明智。”'
                    },
                    isCorrect: false,
                    feedback: {
                        kr: '과거의 보호 전략으로 만든 딱지를 영구적인 운명으로 받아들인 상태입니다.',
                        en: 'Accepting past coping labels as your permanent destiny.',
                        jp: '過去の防衛ラベルを永遠の運命として受け入れてしまっています。',
                        cn: '把过去的防御策略标签当成了不可改变的既定命运。'
                    }
                },
                {
                    id: 'q4_opt2',
                    text: {
                        kr: '“‘리더 기질이 아니다’는 것은 과거에 상처받지 않으려 붙여둔 딱지일 뿐, 지금의 나를 규정하는 영구적인 진실은 아니다.”',
                        en: '"\'Not a leader type\' was just an old label to protect myself from failing, not my permanent truth."',
                        jp: '「『リーダー気質ではない』というのは傷つかないために貼った古いレッテルに過ぎず、今の私を決定づける真実ではない。」',
                        cn: '“‘不适合当领导’只是过去为了不受伤而贴上的防护标签，并非定义此刻我的永恒真理。”'
                    },
                    isCorrect: true,
                    feedback: {
                        kr: '정답입니다! 라벨(Label)과 나 자신의 무한한 본질(Life)을 완벽하게 분리했습니다.',
                        en: 'Correct! You untangled the label from your genuine potential.',
                        jp: '正解です！レッテルと真の可能性を鮮やかに切り離せました。',
                        cn: '回答正确！你将陈旧标签与内在潜能完整清晰地剥离了开来。'
                    }
                }
            ]
        }
    },
    {
        id: 'card_05',
        category: 'POWER_QUESTION',
        icon: '🛡️',
        keyword: {
            kr: 'WRONG OR THREAT?',
            en: 'WRONG OR THREAT?',
            jp: 'WRONG OR THREAT? (間違いか、脅威か)',
            cn: 'WRONG OR THREAT? (错误还是威胁？)'
        },
        subCode: 'CRITICISM CHECK',
        oneLiner: {
            kr: '누군가 나를 지적하거나 비판할 때, 뇌의 편도체가 느끼는 ‘생존 위협’과 실제 ‘단순 오류’를 구별하는 기술',
            en: 'Differentiating between a simple mistake (Wrong) and an existential survival danger (Threat).',
            jp: '誰かに指摘や批判を受けた時、脳の扁桃体が感じる「生存の脅威」と実際の「単なるミス」を識別する技術',
            cn: '当受到他人批评指责时，区分大脑杏仁核产生的“生存威胁”与现实中的“单纯错误”之心理技术。'
        },
        coreInsight: {
            kr: '보고서의 숫자가 틀렸다는 것은 ‘WRONG(오류)’일 뿐입니다. 하지만 뇌는 ‘THREAT(내 존재가 버림받는 위협)’으로 착각해 공격하거나 숨습니다.',
            en: 'A wrong number is just WRONG. But the primitive brain mistakes it for an existential THREAT.',
            jp: '数字が間違っていたのは単なるWRONG(ミス)です。しかし脳はTHREAT(存在が否定された脅威)と錯覚します。',
            cn: '报表数据有误只是一次“WRONG（单纯差错）”。但原始大脑却将其误判为“THREAT（生存与人格威胁）”。'
        },
        memoryLevel: 'short',
        quiz: {
            scenario: {
                kr: '직장 상사가 "이 데이터는 다시 확인해서 고쳐오세요"라고 건조하게 말했습니다. 순간 얼굴이 화끈거리고 심장이 쿵쾅대며 도망치고 싶어집니다.',
                en: 'Your manager dryly says: "Please double check this data and fix it." Your heart races and you freeze.',
                jp: '上司が「このデータを再確認して直してきて」と淡々と言いました。顔がカッとなり心臓が激しく脈打ちます。',
                cn: '领导神情平淡地说：“这组数据重新核实一下改过来。”瞬间你面红耳赤、心跳加速，甚至想逃离现场。'
            },
            question: {
                kr: '이 순간 편도체 납치(Amygdala Hijack)를 막는 가장 빠른 제로포인트 주문은?',
                en: 'What Zero Point anchor defuses this amygdala hijack fastest?',
                jp: 'この瞬間の扁桃体ハイジャックを防ぐ最速の呪文は何ですか？',
                cn: '阻止杏仁核劫持的最快速零点心锚是哪一句？'
            },
            options: [
                {
                    id: 'q5_opt1',
                    text: {
                        kr: '“숨을 깊이 내쉬며: ‘데이터가 틀렸을 뿐(Wrong), 내 존재나 목숨이 위험한 것(Threat)은 아니다.’”',
                        en: '"Breathe out: \'The data is wrong, but my life and worth are not threatened.\'"',
                        jp: '「深く息を吐きながら: 『データが間違っているだけで(Wrong)、私の存在や命が脅かされているわけではない(Threat)』」',
                        cn: '“深长呼气并对自己说：‘只是数据有错（Wrong），我的人格与生命并没有受到威胁（Threat）。’”'
                    },
                    isCorrect: true,
                    feedback: {
                        kr: '정답입니다! 뇌의 비상벨을 끄고 이성적 뇌(전두엽)를 복구시키는 마법의 스위치입니다.',
                        en: 'Bingo! Turns off the primitive alarm and restores your prefrontal cortex.',
                        jp: '正解です！原始的なアラームを消し、理性的前頭葉を取り戻すスイッチです。',
                        cn: '回答正确！这是关闭大脑虚假警报、重新夺回前额叶理性思考能力的关键开关。'
                    }
                },
                {
                    id: 'q5_opt2',
                    text: {
                        kr: '“상사가 나를 미워하는 게 분명하니, 다른 사람 잘못도 물고 늘어져야겠다.”',
                        en: '"The boss clearly hates me, so I will point out others\' mistakes too."',
                        jp: '「上司に嫌われているに違いない。他の人のミスも告発しよう。」',
                        cn: '“领导肯定讨厌我，我要把其他人的过错也扯出来垫背。”'
                    },
                    isCorrect: false,
                    feedback: {
                        kr: '위협(Threat) 반응에 굴복하여 투쟁 모드로 발작한 상태입니다.',
                        en: 'This is succumbing to fight-or-flight aggression.',
                        jp: '脅威反応に屈し、攻撃モードに暴走してしまいました。',
                        cn: '这是屈服于虚假威胁反应、陷入防御性攻击的内耗表现。'
                    }
                }
            ]
        }
    },
    {
        id: 'card_06',
        category: 'KEY_CONCEPT',
        icon: '🧭',
        keyword: {
            kr: 'OLD SAFE vs NEW STRANGE',
            en: 'OLD SAFE vs NEW STRANGE',
            jp: 'OLD SAFE vs NEW STRANGE (慣れた安全と未知の挑戦)',
            cn: 'OLD SAFE vs NEW STRANGE (旧的安全感与新的未知)'
        },
        subCode: 'COMFORT ZONE RESET',
        oneLiner: {
            kr: '고통스러워도 익숙해서 반복하는 불행(OLD SAFE) 대신, 어색하고 두렵지만 나를 성장시키는 낯선 선택(NEW STRANGE)을 택하기',
            en: 'Choosing unfamiliar growth (NEW STRANGE) over familiar misery (OLD SAFE).',
            jp: '苦しくても慣れているから繰り返してしまう不毛な選択(OLD SAFE)をやめ、不慣れでも成長を促す新しい選択(NEW STRANGE)へ進む',
            cn: '告别虽痛苦却因熟悉而反复陷入的陈旧安全感（OLD SAFE），拥抱虽陌生恐惧却能促成蜕变的全新选择（NEW STRANGE）。'
        },
        coreInsight: {
            kr: '뇌는 ‘행복’보다 ‘익숙함’을 안전하다고 여깁니다. 불행한 관계나 자책 습관을 끊지 못하는 이유가 바로 이 OLD SAFE 알고리즘 때문입니다.',
            en: 'The brain prefers familiarity over happiness. That is why we repeat toxic patterns.',
            jp: '脳は「幸福」よりも「馴染み深さ」を安全とみなします。不毛な自責をやめられないのはこのためです。',
            cn: '大脑对“熟悉感”的渴望远胜于对“幸福”的渴望。这也是人反复陷入自我消耗习惯的原因。'
        },
        memoryLevel: 'mid',
        quiz: {
            scenario: {
                kr: '다툼이 생길 때마다 나는 늘 상대에게 먼저 사과하고 내 감정을 삭여왔습니다. 오늘도 억울하지만 입을 닫으려는 순간, 마음 한구석이 답답합니다.',
                en: 'You always suppress your feelings to keep peace. Today you feel wronged, yet urge to stay silent strikes again.',
                jp: '揉め事が起きるたび、いつも自分が我慢して謝ってきました。今日も悔しいのに口を噤もうとして息が詰まります。',
                cn: '每次发生分歧，你总是习惯性压抑委屈抢先道歉。今天再次感到不公，刚想闭口忍耐时胸口堵得慌。'
            },
            question: {
                kr: '이 순간 “NEW STRANGE(낯선 성장)”를 선택하는 한 걸음은 무엇일까요?',
                en: 'What represents taking the step toward "NEW STRANGE"?',
                jp: 'この瞬間に「NEW STRANGE(新しい挑戦)」を選ぶ一歩はどれですか？',
                cn: '在这一刻，践行“NEW STRANGE（全新的成长体验）”的一步是什么？'
            },
            options: [
                {
                    id: 'q6_opt1',
                    text: {
                        kr: '“어색하고 심장이 떨리지만, ‘나는 이 부분에서 서운함을 느꼈어’라고 부드럽고 솔직하게 내 입장을 전한다.”',
                        en: '"Trembling, but calmly and honestly say: \'I felt hurt by that specific part.\'"',
                        jp: '「ぎこちなく緊張しても、『私はこの部分で悲しかった』と穏やかに正直に伝える。」',
                        cn: '“哪怕心跳加速感觉陌生，也温和而清晰地表达：‘在这件事上我感受到了委屈。’”'
                    },
                    isCorrect: true,
                    feedback: {
                        kr: '완벽합니다! 익숙한 자책의 늪(OLD SAFE)을 깨고 자존감 있는 새로운 세계(NEW STRANGE)로 들어섰습니다.',
                        en: 'Bravo! Breaking the cycle of familiar submission into authentic living.',
                        jp: '完璧です！慣れ親しんだ自己犠牲を破り、新しい成熟した関係へ進みました。',
                        cn: '太棒了！打破了习以为常的压抑与妥协，勇敢迈向充满力量的新自我。'
                    }
                },
                {
                    id: 'q6_opt2',
                    text: {
                        kr: '“갈등을 빚으면 버림받을지 모르니, 차라리 내가 속으로 울고 넘어가는 게 안전해.”',
                        en: '"Conflict might lead to abandonment, so suffering alone in silence is safer."',
                        jp: '「対立して見捨てられるくらいなら、自分が我慢してやり過ごす方が安全だ。」',
                        cn: '“要是发生冲突可能会被抛弃，还是我自己咽下眼泪更安全。”'
                    },
                    isCorrect: false,
                    feedback: {
                        kr: '고통스럽지만 익숙해서 안도감을 주는 OLD SAFE 감옥에 다시 갇힌 선택입니다.',
                        en: 'Trapped again in the miserable comfort zone of OLD SAFE.',
                        jp: '苦しいのに慣れているという理由でOLD SAFEの牢獄に戻ってしまいました。',
                        cn: '虽然痛苦，却因熟悉而再次退缩回牢笼般的陈旧安全区。'
                    }
                }
            ]
        }
    },
    {
        id: 'card_07',
        category: 'MICRO_PRACTICE',
        icon: '👂',
        keyword: {
            kr: 'FIRST BEFORE NEXT',
            en: 'FIRST BEFORE NEXT',
            jp: 'FIRST BEFORE NEXT (共感が先、助言は次)',
            cn: 'FIRST BEFORE NEXT (先接纳再建言)'
        },
        subCode: 'CONNECTION PROTOCOL',
        oneLiner: {
            kr: '상대방에게 조언이나 해결책(NEXT)을 서둘러 제시하기 전에, 먼저 상대의 감정과 존재(FIRST)를 온전히 수용하고 알아차려 주기',
            en: 'Connect and validate feelings (FIRST) before giving quick advice and solutions (NEXT).',
            jp: '相手に助言や解決策(NEXT)を急ぐ前に、まず相手の感情と存在(FIRST)をそのまま受け止める',
            cn: '在急于给出建议或解决方案（NEXT）之前，先全然倾听并确认对方的感受与情绪（FIRST）。'
        },
        coreInsight: {
            kr: '사람은 ‘바른 말’로 설득되지 않고 ‘이해받은 느낌’으로 마음을 엽니다. FIRST가 없으면 아무리 훌륭한 NEXT도 폭력이 됩니다.',
            en: 'People open up when feeling understood, not by being corrected. Without FIRST, NEXT feels like attack.',
            jp: '正論では心は動きません。「理解された」と感じた時に人は心を開きます。',
            cn: '人不会被“大道理”所说服，只会因“被理解的感觉”而敞开心扉。没有FIRST，再正确的NEXT也会成为说教。'
        },
        memoryLevel: 'short',
        quiz: {
            scenario: {
                kr: '친구가 "나 오늘 회사에서 진짜 억울한 일 겪었어..."라며 하소연을 시작했습니다.',
                en: 'A friend sighs: "I had such an unfair experience at work today..."',
                jp: '友人が「今日職場で本当に理不尽な目に遭って…」と愚痴をこぼし始めました。',
                cn: '朋友叹气向你倾诉：“今天在公司遇到了极其不公平的事……”'
            },
            question: {
                kr: '이때 ‘FIRST BEFORE NEXT’ 원칙에 부합하는 최고의 첫마디는 무엇일까요?',
                en: 'What is the best opening line honoring "FIRST BEFORE NEXT"?',
                jp: '「FIRST BEFORE NEXT」に合致する最も良い第一声はどれですか？',
                cn: '此时符合“FIRST BEFORE NEXT”法则的最佳第一反应是哪一句？'
            },
            options: [
                {
                    id: 'q7_opt1',
                    text: {
                        kr: '“너 그때 그 사람한테 왜 바로 따지지 않았어? 다음엔 그렇게 하지 마.”',
                        en: '"Why didn\'t you confront them right then? Next time, do this."',
                        jp: '「なんでその時言い返さなかったの？次からはこうしなよ。」',
                        cn: '“当时你怎么不当场怼回去？下次可千万别这样了。”'
                    },
                    isCorrect: false,
                    feedback: {
                        kr: 'FIRST(수용/공감)를 건너뛰고 조언(NEXT)부터 쏟아부어 상대의 마음에 벽을 쌓게 만듭니다.',
                        en: 'Skipping FIRST and jumping to NEXT builds defensive walls.',
                        jp: '共感を飛ばしてアドバイスを急ぐと、相手は心を閉ざします。',
                        cn: '跳过接纳直接灌输建议，会让对方感到不被理解而筑起心防。'
                    }
                },
                {
                    id: 'q7_opt2',
                    text: {
                        kr: '“정말 답답하고 억울했겠다. 얼마나 마음고생이 심했어. 무슨 일이었는지 차분히 들려줘.”',
                        en: '"That must have been so frustrating and unfair. I\'m listening, tell me what happened."',
                        jp: '「それは本当に悔しくて苦しかったね。何があったのか聞かせて。」',
                        cn: '“换作任何人都会觉得憋屈难受。发生什么事了，慢慢跟我说，我听着呢。”'
                    },
                    isCorrect: true,
                    feedback: {
                        kr: '정답입니다! 먼저 가슴을 따뜻하게 안아준 뒤(FIRST), 비로소 지혜로운 해결책(NEXT)을 나눌 수 있습니다.',
                        en: 'Bingo! Hug the heart first, then solve the puzzle together.',
                        jp: '正解です！まず感情を温かく受け止めることで、深い信頼が生まれます。',
                        cn: '回答正确！先全心接纳与抱持情绪（FIRST），才有之后共同理智探讨对策（NEXT）的契机。'
                    }
                }
            ]
        }
    },
    {
        id: 'card_08',
        category: 'ANCHOR_LINE',
        icon: '🌊',
        keyword: {
            kr: '틀리지 않겠다는 약속 대신, 틀리면 다시 보겠다는 약속',
            en: 'Not a Promise to Never Fail, But to Look Again When You Do',
            jp: '間違えないという誓いではなく、間違えたら再び見つめ直すという誓い',
            cn: '不承诺永不出错，只承诺出错时愿意重新审视'
        },
        subCode: 'RADICAL SELF-COMPASSION',
        oneLiner: {
            kr: '완벽주의라는 가혹한 채찍을 내려놓고, 넘어질 때마다 제로포인트로 부드럽게 돌아오는 평생의 마음가짐',
            en: 'Putting down the whip of perfectionism, returning gently to Zero Point whenever stumbled.',
            jp: '完璧主義という過酷な鞭を捨て、つまずく度にゼロポイントへ優しく立ち返る心のあり方',
            cn: '放下完美主义的苛责鞭笞，在每次跌倒时温柔回归零点自知的终身修养。'
        },
        coreInsight: {
            kr: '삶은 무오류의 시험지가 아니라 끊임없이 영점을 재조정(Re-calibration)하는 자전거 타기입니다.',
            en: 'Life is not a zero-defect exam; it is like riding a bicycle by constant re-balancing.',
            jp: '人生は減点方式のテストではなく、絶えずバランスを微調整しながら進む自転車のようなものです。',
            cn: '人生不是零差错的考卷，而是通过不断微调回正向前骑行的自行车旅途。'
        },
        memoryLevel: 'short',
        quiz: {
            scenario: {
                kr: '오늘 감정을 다스리기로 다짐해놓고, 또다시 가족에게 욱해서 짜증을 내버렸습니다. "난 왜 이 모양일까" 자책감이 밀려옵니다.',
                en: 'You vowed to stay calm, but snapped at your family again. Self-blame floods in: "Why am I always like this?"',
                jp: '感情をコントロールすると決めていたのに、家族にカッとなってしまいました。「なぜ私はこうなんだ」と自責が押し寄せます。',
                cn: '下定决心要平稳情绪，却再次忍不住对家人发火吼叫。“我怎么总是这么差劲”的自责感扑面而来。'
            },
            question: {
                kr: '이 순간 나 자신에게 건네야 할 진정한 명심 앵커 문장은?',
                en: 'What is the true Zero Point anchor sentence to tell yourself now?',
                jp: 'この瞬間、自分自身にかけるべき真のアンカー言葉は何ですか？',
                cn: '在这一刻，应当对自己说出的真正零点心锚金句是哪一句？'
            },
            options: [
                {
                    id: 'q8_opt1',
                    text: {
                        kr: '“괜찮아. 완벽하지 않아도 돼. 틀리지 않겠다는 약속 대신, 틀렸으니 지금 다시 숨을 고르고 영점을 맞추면 돼.”',
                        en: '"It\'s okay. I don\'t need to be flawless. Instead of never failing, I just recalibrate back to Zero Point right now."',
                        jp: '「大丈夫。完璧じゃなくていい。間違えない誓いではなく、間違えた今、呼吸を整えてゼロに戻ればいい。」',
                        cn: '“没关系，不必追求完美。比起永不失误的虚假承诺，此时此刻重新深呼吸、回到零点校准就好。”'
                    },
                    isCorrect: true,
                    feedback: {
                        kr: '감동적인 정답입니다! 자책을 멈추고 자비롭게 영점으로 돌아오는 것이 진정한 자각입니다.',
                        en: 'Touching and correct! Real awareness is gently returning to Zero Point.',
                        jp: '素晴らしい正解です！自責を手放し、慈悲深くゼロへ還ることこそが真の自覚です。',
                        cn: '感人且正确的回答！停止无休止的自我责备，慈悲回归零点才是觉察的本质。'
                    }
                },
                {
                    id: 'q8_opt2',
                    text: {
                        kr: '“또 실패했으니 나는 자각 훈련을 받을 자격이 없어. 포기해야겠어.”',
                        en: '"Failed again, I\'m hopeless and should just give up."',
                        jp: '「また失敗した。私には修行の資格なんてない。諦めよう。」',
                        cn: '“我又失败了，我根本不配做任何心理训练，干脆放弃算了。”'
                    },
                    isCorrect: false,
                    feedback: {
                        kr: '완벽주의가 무너지자 양극단의 포기(자포자기)로 빠져버린 패턴입니다.',
                        en: 'Falling into the all-or-nothing trap of perfectionism.',
                        jp: '白黒思考の罠にハマり、極端な諦めに走ってしまいました。',
                        cn: '非黑即白的完美主义破灭后，滑向彻底自暴自弃的惯性陷阱。'
                    }
                }
            ]
        }
    }
];

export interface UserGameProgress {
    level: number;
    exp: number;
    streakDays: number;
    masteredCardIds: string[];
    todayCompletedCount: number;
    lastPlayedDate: string;
}

export const INITIAL_GAME_PROGRESS: UserGameProgress = {
    level: 1,
    exp: 0,
    streakDays: 1,
    masteredCardIds: [],
    todayCompletedCount: 0,
    lastPlayedDate: ''
};
