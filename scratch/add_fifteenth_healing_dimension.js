const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 15th content set (Two Dimensions & Mind Purification)...");

    const essayDate = '2026-06-21';
    const essayTheme = "[마인드 해킹] 가짜 나와 진짜 나: 저항의 내려놓음과 주체적 재배치";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "자아의 무력함과 결과물의 수용 (마주함)",
            description: "내면 성찰 가이드의 핵심 이치는 \"몸으로서의 내가 억지로 결과를 바꿀 수는 없다. 그러니 바꾸려는 집착을 내려놓고 가만히 지켜보라. 그러면 진짜 나의 무한한 의식 속에서 결과가 저절로 바뀐다\"는 것입니다. 얼핏 보면 \"바꿀 수 없다\"와 \"바뀐다\"가 충돌하는 것 같지만, 이는 '누가(Who)' 바꾸느냐에 따라 철저하게 두 가지 차원으로 나누어 볼 수 있습니다. 몸을 나라고 믿고 내 의지대로 무언가(결과)를 바꾸려 애쓰는 행위는 착각이며, 오히려 바꿀 수 없는 것을 바꾸려 하다가 고통만 가중됩니다. 그러므로 자아의 차원에서는 결과를 바꿀 수 없음을 받아들이고(Scan) 그냥 내비두는 것이 첫걸음입니다."
        },
        module2: {
            title: "두 가지 차원의 시스템적 시프트",
            allowing: "1. 가짜 나(몸, 자아)의 차원: \"결과를 바꿀 수 없다\"\n\n우리가 일상에서 마주하는 신체 반응(심박수, 호흡), 불쑥 올라오는 생각과 감정(우울, 두려움)은 내가 지금 실시간으로 만드는 것이 아닙니다. 그것들은 무의식에 저장된 과거의 기억들이 외부 자극과 반응하여 뇌 하드웨어가 자동으로 계산해 뱉어낸 '결과물'일 뿐입니다. 심장, 폐, 세포 등 신체 기관과 뇌가 자동으로 뱉어내는 생각은 자아의 힘으로 통제하거나 억지로 멈출 수 없습니다.",
            embracing: "2. 진짜 나(의식, 관찰자)의 차원: \"저절로 바뀐다\"\n\n내가 한다고 착각하던 집착(가짜 나)을 완전히 내려놓고 가만히 지켜보기만 하면, 내 몸도 이 세상도 우주 전체도 텅 빈 무한한 사랑 속에서 저절로 굴러갑니다. 돈이 없는 두려움, 아픈 몸으로 살아가는 두려움을 억누르지 않고 관찰자의 눈으로 있는 그대로 느껴주고 내버려 두면, 모든 감정은 스스로 생겼다가 스스로 사라집니다. 괴로운 감정이라는 결과물이 스스로 녹아 없어지는 정화의 순간입니다.",
            accepting: "3. 수용을 통한 무한한 흐름과의 동기화\n\n통제하려는 시도를 멈출 때, 내 정신은 비로소 드넓은 의식의 자리에 안착합니다. 모든 불쾌한 감정과 통증은 '관찰 대상'으로 멀어지고, 그것을 지켜보는 진짜 나(의식)의 힘이 깨어나기 시작합니다."
        },
        module3: {
            title: "최상위 의식과의 동기화",
            msc: "4. 명심코칭의 시각으로 보는 총정리\n\n이 가이드의 메커니즘을 명심코칭의 프레임워크로 요약하면 다음과 같습니다.\n\n\"결과물(몸, 생각, 감정, 현실)을 내가 억지로 바꿀 생각을 아예 안 하고(Scan) 가만히 내비두면, 역설적으로 최상위 의식인 관찰자의 넓은 흐름과 동기화되어(Sync) 결과물이 저절로 가장 아름답게 달라집니다(Shift).\"",
            act: "5. 무력한 포기가 아닌 위대한 해방\n\n이 가이드의 결론은 바꿀 수 없으니 무력하게 포기하고 살라는 뜻이 결코 아닙니다. 내가 주체가 되어 내 몸과 생각을 '관찰의 대상'으로 바라볼 수 있을 때, 억지로 바꾸려 발버둥 치던 고통에서 벗어나 진짜 나의 힘으로 삶이 알아서 최적화되어 흘러가게 놔두라는 위대한 해방의 메시지입니다."
        },
        module4: {
            title: "오늘의 마음코칭솔루션",
            affirmations: [
                "나는 내 몸과 뇌가 자동으로 뱉어낸 생각과 감정을 내 힘으로 통제하려 하지 않고 가만히 내비둡니다.",
                "나는 바꾸려는 집착을 내려놓고 온전한 관찰자의 자리에 서서, 의식의 넓은 흐름과 동기화합니다(Sync).",
                "나는 가짜 자아의 저항을 멈춤으로써 마음의 정화를 유도하고, 삶이 저절로 최적의 방향으로 흐르도록 안내합니다(Shift)."
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
