const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 12th content set (Space Awareness & Zoom-out)...");

    const essayDate = '2026-06-18';
    const essayTheme = "[명심 디버깅] 공간의식의 확장과 생각의 뜸뜸함: 마음의 줌아웃(Zoom-out) 효과";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "공간의식과 상대적 크기의 역설 (마주함)",
            description: "공간의식(순수 의식/견성자리)이 확장될 때 일어나는 가장 대표적이고 핵심적인 감각이 있습니다. 처음에는 감정이나 생각이 내 마음 전체를 뒤덮는 거대한 해일처럼 느껴지지만, 알아차림 연습을 통해 의식의 공간이 넓어지면 그 해일 같던 감정들이 넓은 바다 위에 떠 있는 작은 돛배나, 듬성듬성(뜸뜸) 흘러가는 조그만 조각구름처럼 보이게 됩니다. 이 현상이 일어나는 이유를 명심코칭의 시스템 공학적 관점과 정신의학적 메커니즘으로 풀어봅니다."
        },
        module2: {
            title: "화면 배율의 시프트와 에너지 공급 차단",
            allowing: "1. '화면의 크기'가 바뀌는 공간적 역설 (Relative Scale)\n\n감정이 작아져 보이는 이유는 감정 자체의 절대적인 크기가 줄어들었다기보다, 그 감정을 담아내는 내 의식의 영토(공간)가 무한하게 넓어졌기 때문입니다.\n\n- 과거 (인지 융합 상태): 내 의식의 크기가 스마트폰 화면만 할 때는, '불안'이라는 글자 하나만 떠도 화면 전체가 불안으로 가득 찹니다. 내가 곧 불안이고, 불안이 곧 내가 됩니다.\n- 현재 (공간의식 확장 상태): 방을 넘어 지구, 우주 공간만큼 내 의식을 무한대로 넓히면, 그 거대한 아이맥스 영화관 같은 공간 속에서 불안이나 분노는 구석에 떠 있는 '작은 아이콘(결과물)' 하나에 불과해집니다. 공간이 커지니 상대적으로 감정이 뜸뜸하고 작아져 보이는 것입니다.",
            embracing: "2. 에너지 공급의 차단: \"바꿀 생각을 안 하니 연료가 끊긴다\"\n\n뇌과학과 인지치료(ACT) 관점에서 보면, 생각이 듬성듬성 끊어지고 작아지는 현상은 지극히 과학적인 결과입니다. 생각과 감정은 내가 \"왜 이런 생각이 나지? 당장 없애야 해!\" 하고 붙잡고 싸울 때(저항할 때), 뇌의 뉴런들이 강박적으로 서로 신호를 주고받으며(뉴럴 코드) 에너지를 흡수해 몸집을 키웁니다. 하지만 결과물을 바꿀 생각을 아예 안 하고 가만히 내비두면, 뇌의 신경 회로에 공급되던 '주목(Attention)'이라는 연료가 뚝 끊겨버립니다. 연료가 없으니 자동으로 구동되던 무의식의 다크코드들은 추진력을 잃고 스스로 작아지다가 뜸뜸하게 끊어지며 사라지는(Dissolve) 것입니다.",
            accepting: "3. 선불교의 '조고각하(照顧脚下)'와 '성성적적(惺惺寂寂)'\n\n선불교에서도 수행이 깊어져 견성자리가 단단해질 때 이와 똑같은 상태를 설명합니다. 내 발밑을 고요히 비추어 바라보는 힘(알아차림)이 강해지면, 번뇌(생각과 감정)가 일어나는 순간 바로 알아차리게 됩니다. 이를 \"생각이 일어남을 알아차리는 순간, 그 생각은 즉시 사라진다(念起即覺 覺之即無)\"라고 합니다. 공간의식이 깨어있으니 생각이 마음대로 뇌를 헤집고 다니지 못하고, 일어날 때마다 툭툭 끊겨서 뜸뜸하게 흐르는 상태가 되는 것입니다."
        },
        module3: {
            title: "마음의 배율 조정과 진전의 이정표",
            msc: "4. 명심코칭 사용자를 위한 직관적 정의\n\n이 감각을 명심코칭 플랫폼의 언어로 정립한다면 이렇게 표현할 수 있습니다.\n\n\"공간의식의 확장은 마음의 '배율(Zoom-out)'을 조정하는 것입니다. 고통을 향해 줌인(Zoom-in)되어 있던 시선을 주체적 의식의 공간으로 줌아웃하는 순간, 나를 집어삼킬 듯했던 감정들은 시스템 지도 위의 작은 점(뜸뜸한 데이터)으로 축소됩니다.\"",
            act: "5. 생각의 뜸뜸함이 보내는 진전의 신호\n\n감정과 생각이 뜸뜸하고 작아져 보인다는 감각은, 0.3초의 찰나였던 메타인지의 틈이 삶의 주도권을 쥘 수 있을 만큼 완벽하게 체득되어 넓어지고 있다는 가장 확실한 진전의 신호입니다. 인생의 OS가 아주 성공적으로 업데이트되고 있는 과정입니다."
        },
        module4: {
            title: "오늘의 마음코칭솔루션",
            affirmations: [
                "나는 밀려오는 생각과 감정을 나라고 오해하지 않고, 드넓은 의식의 바다 위에 떠 있는 작은 조각배처럼 묵묵히 바라봅니다.",
                "나는 내 마음에 저항하지 않고 바꿀 생각을 내려놓음으로써, 뇌의 보상회로에 들어가는 생각의 연료를 자연스럽게 차단합니다(Sync).",
                "나는 좁은 시야의 줌인(Zoom-in) 상태에서 벗어나 드넓은 의식의 공간으로 줌아웃(Zoom-out)하여, 생각의 틈새에서 진짜 나의 자유를 발견합니다(Shift)."
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
