const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 11th content set (Addiction & Purification)...");

    const essayDate = '2026-06-17';
    const essayTheme = "[명심 디버깅] 의식의 각성과 하드웨어 중독의 관계 : 돈오점수(頓悟漸修)";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "의식과 중독의 모순 (마주함)",
            description: "우리가 감정과 생각을 나라고 착각하며 붙잡고 싸우던 그 상태가 바로 불교에서 말하는 전도몽상(顛倒夢想)의 정의입니다. 진짜 나(텅 빈 공간/의식)와 가짜 나(뇌의 자동 결과물인 생각·감정·몸)를 거꾸로 뒤집어서 착각하고, 그것이 영원할 것처럼 꿈(夢想)을 꾸며 괴로워하고 있다는 뜻입니다. 그런데 여기서 아주 실질적인 의문이 생깁니다. \"공간의식을 깨닫고 전도몽상에서 벗어났다고 하면서, 여전히 술도 먹고 담배도 피우는 이 모순은 어떻게 설명해야 하는가? 이 문제와는 관계가 없는가?\" 이에 대한 답을 명심코칭의 시스템적 프레임과 정신의학, 그리고 선불교의 눈으로 명쾌하게 풀어드리겠습니다."
        },
        module2: {
            title: "계층 분리와 돈오점수의 이치",
            allowing: "1. 결론: \"의식의 깨어남\"과 \"하드웨어의 중독(습관)\"은 계층(Layer)이 다릅니다\n\n내가 의식의 자리를 알아차린 것(견성/공간의식 확장)과 여전히 술·담배를 피우는 신체적·행동적 습관은 서로 다른 계층에서 작동하는 문제입니다. 관계가 없지는 않지만, \"술·담배를 하니 깨달은 게 아니다\"라고 볼 수는 없습니다. 컴퓨터 시스템으로 비유하면 이해가 아주 쉽습니다.\n\n- 최상위 OS 업데이트 (의식/공간의식): \"내 몸과 생각은 내가 아니다\"를 깨달아 메타코드를 활성화했습니다. 시스템의 최상위 제어권을 쥔 것입니다.\n- 하드웨어 디스크의 악성 레지스트리 (술/담배): 니코틴과 알코올이라는 물리적 물질이 뇌의 보상회로(도파민 경로)를 강력하게 장악해 오랜 세월 동안 깊이 새겨놓은 '무의식적 다크코드(신체적 중독 및 세포의 기억)'입니다. 최상위 운영체제(OS)가 업데이트되었다고 해서, 하드웨어 하부 디스크에 오랜 세월 쩔어있던 물리적 중독 데이터와 세포의 갈망이 그 즉시 포맷(삭제)되지는 않는 것입니다.",
            embracing: "2. 선불교의 대답: 돈오(頓悟)와 점수(漸修)의 간극\n\n선불교의 역사에서도 이 문제는 아주 치열하게 다뤄졌습니다. 보조국사 지눌 스님이 강조한 돈오점수(頓悟漸修)가 정확히 이 현상을 설명합니다.\n\n- 돈오(문득 깨달음): \"아! 내 몸과 생각은 관찰의 대상(가짜)일 뿐, 텅 빈 공간(진짜)이 나구나!\" 하고 전도몽상을 깨뜨렸습니다.\n- 점수(점진적 닦음): 이치를 단박에 깨달았을지라도, 내 몸과 무의식 세포에는 오랜 세월 쌓여온 '습기(習氣, 오랜 습관의 에너지)'가 그대로 남아있습니다.\n\n그래서 선불교에서는 견성을 한 수행자라도 여전히 세속의 습관(술, 담배 등)이 남아있을 수 있다고 봅니다. 깨달은 텅 빈 공간(의식) 속에서, 여전히 담배를 피우고 싶어 하는 뇌의 자동 반응(습기)이 뜸뜸이 올라오는 것을 바라보며, 그 습기를 정화해 나가는 점진적인 과정(점수)이 필요한 것입니다.",
            accepting: "3. 습관의 에너지를 다스리는 점진적 정화\n\n내 몸이 니코틴이나 알코올을 요구하는 무의식적인 자동 반응은 오랜 시간 뇌 회로에 누적된 결과물입니다. 이 오랜 물리적 기억들을 억지로 강압하지 않고, 매 순간 일어나는 갈망을 텅 빈 하늘 같은 의식 속에서 고요하게 품어 지켜보는 것이 점수(漸修)의 진정한 의미입니다. 오랜 습관이 비바람처럼 불어올 때, 그것을 억지로 밀어내지 않고 가만히 스캔(Scan)하는 것 자체가 훌륭한 수행입니다."
        },
        module3: {
            title: "중독을 대하는 메타코드의 시프트",
            msc: "4. 명심코칭의 시각: 술·담배를 대하는 '관점'이 달라진다\n\n재밌는 역설은, 공간의식이 확고해지면 술을 먹고 담배를 피우더라도 그것을 대하는 나의 인지 메커니즘이 완전히 달라진다는 점입니다.\n\n- 전도몽상 상태일 때 (중독의 노예): \"스트레스 받아 미치겠네, 담배 피워야 살겠다.\" (감정과 갈망에 완전히 융합(Fusion)되어 자동 반응으로 이끌려감)\n- 공간의식이 확장된 상태 (주체적 관찰): 담배 생각이 불쑥 올라올 때 최상위 메타코드가 켜집니다. \"어라? 내 뇌의 도파민 회로(뉴럴코드)가 니코틴이 부족하다고 결핍 신호(결과물)를 자동으로 뱉어내고 있네? 그 생각이 뜸뜸하게 올라오네?\" 하고 갈망을 대상화하여 물러서서 바라봅니다.",
            act: "5. 하늘은 열렸으나 땅의 먼지를 쓰는 시간\n\n이 상태가 되면, 술을 먹고 담배를 피우더라도 그것에 완전히 '지배'당하지 않는 상태가 됩니다. 그리고 우리가 도달한 결론처럼 \"결과물(담배 피우고 싶은 욕구)을 억지로 억누르고 바꿀 생각을 안 하고 가만히 내비두면, 역설적으로 그 욕구에 연료가 공급되지 않아 담배를 끊는 것(행동의 Shift) 또한 예전보다 훨씬 쉬워지는 상태\"가 됩니다. 싸우지 않으니 뇌의 보상회로가 굶어서 스스로 쪼그라들기 때문입니다.\n\n여전히 술을 먹고 담배를 피운다고 해서 도달한 그 위대한 '공간의식과 자유의지'의 확장이 가짜가 되는 것은 아닙니다. 그것은 하늘(의식)은 완벽하게 열렸으나, 땅(몸과 세포의 오랜 습관)에 고여있던 먼지들이 바람에 쓸려 나가는 데 시간이 조금 걸리는 과정일 뿐입니다. 내 몸이 자동으로 뱉어내는 흡연과 음주의 욕구마저 \"내 뇌의 자동 아웃풋이구나\" 하고 넓은 공간 속에서 묵묵히 스캔(Scan)해 나가다 보면, 그 하드웨어의 다크코드마저 내 뜻대로 다스리는 완벽한 시프트(Shift)의 순간이 찾아올 것입니다."
        },
        module4: {
            title: "오늘의 마음코칭솔루션",
            affirmations: [
                "나는 신체적 갈망이 올라올 때, 그것을 나라고 오해하지 않고 뇌가 자동으로 보내는 결핍 신호(결과물)로 스캔(Scan)합니다.",
                "나는 오랜 세월 내 몸 세포에 깃든 습관의 에너지(습기)를 억지로 누르지 않고, 텅 빈 의식의 넓은 공간 속에서 가만히 내비둡니다(Sync).",
                "나는 갈망과 싸우기를 포기함으로써 도파민 회로를 스스로 쪼그라들게 만들고, 온전한 나를 향해 자유롭게 행동(Shift)합니다."
            ]
        }
    };

    const { data: existingEssay } = await supabase
        .from('healing_posts')
        .select('id')
        .eq('date_string', essayDate)
        .maybeSingle();

    let essayResult;
    if (existingEssay) {
        console.log(`Essay for ${essayDate} already exists. Updating it.`);
        essayResult = await supabase
            .from('healing_posts')
            .update({ theme: essayTheme, content: essayContent })
            .eq('date_string', essayDate)
            .select();
    } else {
        console.log(`Inserting new essay for ${essayDate}...`);
        essayResult = await supabase
            .from('healing_posts')
            .insert([{ date_string: essayDate, theme: essayTheme, content: essayContent }])
            .select();
    }

    if (essayResult.error) {
        console.error("❌ Failed to insert essay:", essayResult.error);
    } else {
        console.log("✅ Successfully posted essay to daily_capsules on", essayDate);
    }
}

main();
