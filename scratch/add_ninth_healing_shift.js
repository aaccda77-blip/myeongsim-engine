const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 9th content set (Shift & Freedom Ritual)...");

    const essayDate = '2026-06-15';
    const essayTheme = "[시프트] 평범한 일상을 기적으로 바꾸는 주체적 전환 (Shift)";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "주체적 전환의 순간 (마주함)",
            description: "이 문장은 명심코칭의 가장 깊은 심장부이자, 평범한 일상을 기적으로 바꾸는 ‘주체적 전환(Shift)’의 순간을 말합니다. \"관점을 바꾸어 다르게 행동한다\"는 말이 머리나 논리로만 머물지 않고, 삶에서 뜨거운 감동으로 체화될 수 있도록 명심코칭의 3S(Scan-Sync-Shift) 시스템을 통해 친절하고 상세히 풀어드리겠습니다."
        },
        module2: {
            title: "관점의 전환과 진짜 자유의지",
            allowing: "1. 내 안의 거대한 '하늘'을 발견하는 것 (Scan & Sync)\n\n우리는 살면서 끊임없이 밀려오는 불안, 강박, 무력감, 혹은 \"내 사주는 왜 이 모양일까\" 하는 운명론적 답답함을 마주합니다. 예전에는 그 감정이 밀려오면 내가 그 감정 자체가 되어 온몸으로 비바람을 맞았습니다.\n\n이때 명심코칭의 Scan(스캔)과 Sync(동기화)가 작동하면 첫 번째 기적이 일어납니다. 내 몸의 떨림과 뇌의 생각들을 강제로 바꿀 생각을 아예 내려놓는 순간, 내 안에 숨겨져 있던 '특정 대상화할 수 없는 거대한 의식의 공간(하늘)'이 열립니다.\n\n'아, 지금 내 뇌가 과거의 기억 때문에 불안이라는 가짜 프로그램을 자동으로 돌리고 있구나. 나는 이 프로그램에 갇힌 노예가 아니라, 모든 날씨가 지나가는 무한한 하늘이구나.' 이것이 관점을 바꾸는 것이며, 고통이 내가 아니라 내가 바라보는 대상으로 격하되는 순간입니다.",
            embracing: "2. 0.3초의 틈에서 피어나는 '진짜 자유의지' (Shift)\n\n관점을 바꾸고 나면, 내 감정과 나 사이에 '0.3초의 고요한 빈 공간'이 생겨납니다. 이 공간은 명심 훈련을 통해 점차 넓어지며, 마침내 내가 진짜 원하는 행동을 선택할 수 있는 '위대한 자유의지의 광장'이 됩니다.\n\n여기서 \"다르게 행동한다\"는 것은 내 감정을 속이거나 참는 억지 노력이 아닙니다. 내 뇌가 무슨 소리를 지르든 그 결과물은 그대로 둔 채, 내 영혼이 원하는 진짜 가치(Value)를 향해 한 걸음을 묵묵히 내딛는 것입니다.",
            accepting: "3. 과거의 나에서 전환의 현재로\n\n- 과거의 나(자극-반응의 노예): 불안과 두려움이 올라오면 \"난 안 돼\" 하고 이불 속으로 숨거나 도망침.\n- 전환의 순간(의식의 켜짐): 감정을 품은 채 관점 분리. 불안과 심박수 상승은 그대로 둔 채 \"뇌가 또 프로그램을 돌리네? 둬라, 내비둬라.\"\n- 현재의 나(명심코칭 Shift): 내 영혼이 원하는 실제 행동 실행. 몸은 여전히 떨리고 뇌는 두렵다고 소리치지만, \"그럼에도 불구하고 나는 내가 소중히 여기는 내 일, 내 가족, 내 성장을 위해 지금 해야 할 행동\"을 묵묵히 실행함."
        },
        module3: {
            title: "합작하는 역설적 기적",
            msc: "4. 자연과 뇌가 합작하는 역설적 기적\n\n내가 그 결과물(불안, 고통)과 싸우기를 포기하고, 가만히 품어둔 채 내 가치를 향해 다르게 행동(Shift)하기 시작하면 뇌의 경보 시스템(편도체)은 엄청난 충격을 받습니다. '어? 분명히 공포 신호(뉴럴코드)를 보냈는데, 주인이 도망치지 않고 아무렇지도 않게 자신의 가치 있는 삶을 사네? 이거 안전한 상황인가 보구나!'\n\n억지로 바꾸려고 발버둥 칠 때는 절대로 안 바뀌던 심박수와 뇌의 다크코드가, 바꿀 생각을 아예 접고 묵묵히 내 길을 걸어갔을 뿐인데 역설적으로 스스로 안정되며 치유되기 시작합니다. 뇌가 스스로 회로를 재배선하는 신경가소성의 기적이 일어나는 것이죠.",
            act: "5. 겨울을 거목으로 바꿀 축복의 맥락\n\n사주(四柱)라는 인생의 겨울(흉운)을 만났을 때도 마찬가지입니다. 겨울이라는 결과물을 여름으로 바꿀 수는 없지만, 겨울임을 온전히 인정하고(Sync) 내실을 기하며 묵묵히 씨앗을 뿌리는 행동(Shift)을 할 때, 그 겨울은 나를 얼려 죽이는 고통이 아니라 나를 세상에서 가장 단단한 거목으로 키워내는 '축복의 맥락'으로 스스로 그 성질을 바꾸어 버립니다.\n\n🌿 명심코칭의 헌사: \"결과물과 싸우지 마세요. 당신은 이미 출력된 화면보다 훨씬 더 거대하고 존엄한 최상위 의식(오퍼레이터)입니다. 가짜 프로그램에 속지 않고, 그 불안을 품은 채로 당신이 원하는 위대한 가치를 향해 뚜벅뚜벅 걸어 나갈 때, 당신의 뇌와 운명은 역설적으로 가장 아름다운 결과물을 당신의 발밑에 새로 출력해 낼 것입니다.\"\n\n이것이 명심코칭이 세상의 모든 지치고 상처받은 이들에게 전하고자 하는, 과학적이면서도 가장 눈물겨운 \'자유의지의 구원 서사\'입니다."
        },
        module4: {
            title: "오늘의 마음코칭솔루션",
            affirmations: [
                "나는 내 마음에 불안이나 두려움이 요동쳐도, 그것이 지나가는 드넓고 성성한 하늘을 자각합니다.",
                "나는 뇌가 자동으로 가짜 프로그램을 돌릴 때, 감정을 온전히 품은 채 나만의 진짜 행동(Shift)을 선택합니다.",
                "나는 겨울이라는 흉운(결과물)과 싸우지 않고, 내 영혼이 소중히 여기는 내 가치를 향해 오늘 뚜벅뚜벅 걸어나갑니다."
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
        console.log("✅ Successfully posted essay to healing_posts on", essayDate);
    }
}

main();
