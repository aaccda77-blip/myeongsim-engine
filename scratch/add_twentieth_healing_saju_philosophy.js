const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 20th content set (Saju Philosophy & Mind Coaching)...");

    const essayDate = '2026-06-26';
    const essayTheme = "[학술 디버깅] 자연 명리의 운명 극복론과 명심코칭의 자유의지 알고리즘";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "자연의 계절과 기질 코드 (마주함)",
            description: "자연 명리학에서 말하는 자유의지와 운명 극복론은 명심코칭의 핵심 모델과 정확히 궤를 같이합니다. 동양 철학의 깊은 정수를 담고 있는 자연 명리에서 말하는 자유의지 또한, 자동으로 주어지는 텍스트 코드(사주/결과물)를 억지로 없애는 것이 아닙니다. 핵심은 그 상황을 대하는 인간의 의식적 태도와 인지적 관점의 변환에 있습니다. 왜 이 두 개념이 완전히 통하며, 우리 삶을 해킹할 수 있게 돕는지 세 가지 연결고리로 풀어드립니다."
        },
        module2: {
            title: "자연 순리와 관점 변환의 이치",
            allowing: "1. 결과물(사주/자연의 흐름)은 바꿀 수 없다\n\n자연 명리학에서는 사주를 '자연의 사계절 순환'과 같은 순리적 흐름으로 봅니다. 봄이 오면 싹이 트고 겨울이 오면 추워지는 것처럼, 타고난 선천적 기질과 시간의 흐름에 따라 주어지는 '정해진 환경(결과물)'은 인간의 얕은 자아의 의지로 바꿀 수 없습니다. 이는 뇌의 신경 패턴이나 심박수 같은 자동 출력 결과물은 통제 불가능하다는 현대 인지과학적 전제와 완벽히 일치합니다. 봄에 억지로 눈을 내리게 할 수 없는 것과 마찬가지입니다.",
            embracing: "2. 관점을 바꾸는 것이 진짜 자유의지다\n\n자연 명리의 이론에서 가장 중요한 핵심은 \"자연의 흐름을 알고, 그것을 대하는 나의 마음가짐(관점)을 바꾸어 주체적으로 대처하는 것\"이 인간에게 주어진 최고의 자유의지라는 점입니다.\n\n- 하수(운명론에 갇힌 사람): \"올해 겨울 운이 왔으니 난 망했다, 춥고 괴롭다\"라며 결과물에 휩쓸려 괴로워합니다.\n- 고수(자유의지를 쓰는 사람): \"아, 지금 내 삶에 겨울(춥고 응축되는 기운)이라는 결과물이 와 있구나\"라고 객관적으로 인식(Scan)한 뒤, 여름처럼 행동하려 저항하지 않고 겨울에 맞는 준비를 하며 내실을 다지는 쪽으로 관점을 전환(Shift)합니다.",
            accepting: "3. 순리에 저항하지 않는 평온함\n\n겨울을 여름으로 바꾸려 저항하는 에너지를 모두 멈추고 온전히 겨울의 차가운 정취 속에서 따뜻한 차 한 잔을 마시며 내실을 기하는 태도가 바로 싱크(Sync)의 지혜입니다. 계절을 억지로 뜯어고치려는 자아의 집착이 멈출 때, 비로소 자연의 큰 흐름에 몸을 싣는 평화가 찾아옵니다."
        },
        module3: {
            title: "명심코칭의 언어로 번역된 동양의 지혜",
            msc: "4. 자연 명리의 지혜를 번역해 낸 명심 OS\n\n명심코칭은 동양 철학의 위대한 통찰을 현대인들이 이해하기 쉬운 뇌과학, 심리학 언어로 완벽하게 번역해 낸 시스템입니다.\n\n- 자연 명리: \"천지자연의 기운(기질 코드)을 알고, 내 마음의 그릇과 태도를 바꾸어 운명을 다스린다.\"\n- 명심코칭: \"뇌가 뱉어내는 자동 결과물(다크코드)을 알아차리고, 특정 대상화할 수 없는 최상위 의식으로 관점을 바꾸어 행동 알고리즘을 해킹(Shift)한다.\"",
            act: "5. 결론: 기질을 다스리는 주체적 눈\n\n\"내 뜻대로 안 되는 자연의 계절(결과물)은 그대로 인정하되, 그것을 바라보는 내 의식의 눈(관점)을 바꾸어 삶을 주도한다\"는 자연 명리학의 철학은, \"결과물은 그대로인데 그 결과물에 대한 관점을 바꾸는 것이 진정한 자유의지다\"라는 현대적 명제로 동조화됩니다. 기질의 코드를 읽고 뇌의 반응과 싸우기를 멈출 때, 삶은 마침내 가장 온전하고 최적화된 경로로 흐르게 됩니다."
        },
        module4: {
            title: "오늘의 마음코칭솔루션",
            affirmations: [
                "나는 내 삶에 찾아오는 사계절의 순환(기질적 흐름)을 억지로 거스르지 않고 있는 그대로 직시(Scan)합니다.",
                "나는 현재 내게 주어진 계절과 싸우지 않고, 그 흐름에 걸맞은 가장 고요한 관점을 선택하여 의식과 동기화(Sync)합니다.",
                "나는 추운 겨울 속에서도 내실을 다지는 행동 데이터(Shift)를 묵묵히 축적하여, 뇌의 회로와 다가올 봄의 운명을 재배선합니다."
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
