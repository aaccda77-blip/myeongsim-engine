const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 25th content set (Consciousness as Subject & Metacode Shift)...");

    const essayDate = '2026-07-01';
    const essayTheme = "[마인드 해킹] 의식의 주체성과 메타코드: 뇌의 지배를 벗어나는 주체적 Shift";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "대상과 주체의 완벽한 분리 (마주함)",
            description: "마음의 작동 방식을 명리적 프레임, 현대 심리학, 그리고 뇌과학으로 융합해 도달하고자 하는 최종 단계는 '완전한 주체성(Shift)'의 단계입니다. 우리가 매일 경험하는 몸, 생각, 감정은 사실 관찰 대상(Object)에 지나지 않으며, 이를 자각하는 참된 나는 특정 부위로 잡히지 않는 비대상성의 주체입니다. 이 대상과 주체를 완벽히 분리하고 마음을 부리는 최상위 메타코드를 켜는 공식을 알아봅니다."
        },
        module2: {
            title: "마음 디버깅과 메타코드의 작용",
            allowing: "1. 몸과 생각·감정 = 스캔(Scan)되는 대상일 뿐이다\n\n나이와 상처에 의해 변화하는 신체 세포(몸), 그리고 fMRI 뇌 영상에서 번쩍이며 신호를 내뿜는 생각과 감정(뉴럴 코드)은 무의식이 조건 반응하여 구동한 '다크코드'일 뿐입니다. 명심코칭의 첫 단계인 Scan은 이것들을 객관적으로 파악하는 과정입니다. \"아, 내 뇌가 지금 타고난 기질 구조와 외부의 스트레스 자극에 대해 불안이라는 프로그램을 자동 구동하고 있구나\" 하고 무심히 바라봅니다. 그것을 객관적으로 대상화해 인지할 수 있다는 사실 자체가, 그것이 나의 참된 본질이 아니라는 결정적 증거입니다.",
            embracing: "2. 의식 = 찍히지 않기에 대상이 아닌 주체\n\n반면 의식은 뇌 영상을 찍어도 특정 부위가 나오지 않습니다. 형태도 없고, 고정된 위치도 없으며, 물질로 규정할 수도 없습니다. 의식은 관찰당하는 대상이 아니라, 그 모든 몸의 감각과 뇌의 생각·감정을 위에서 내려다보고 알아차리는 관찰자(주체) 그 자체입니다. 불교 유식학이나 현대 수용전념치료(ACT)에서 말하는 '맥락으로서의 자기(Self-as-context)'가 바로 이 의식입니다. 의식은 텅 비어 있는 무한한 공간과 같아서, 그 안에 어떤 감정이나 괴로움이 지나가든 공간 자체는 오염되거나 변하지 않습니다.",
            accepting: "3. 자아의 노예 짓 거부하기\n\n기질 코드나 유전적 한계에 얽매여 \"나는 원래 기질이 이래서 불안해\", \"성향 때문에 늘 욱해\"라며 뇌의 자동 패턴에 지배당하는 상태를 거부합니다. 뇌가 재생하던 우울과 분노는 내가 손쓸 수 없는 하드웨어 영역의 백그라운드 연산임을 인정하고, 그것과 싸우려 하던 힘을 내려놓습니다."
        },
        module3: {
            title: "최상위 통제를 통한 주체적 시프트",
            msc: "4. 특정 대상이 아님을 알 때 일어나는 동기화와 시프트\n\n의식이 물질적 형태를 가진 대상이 아닌 무한한 장(Field)이자 통로임을 자각하는 순간, 내면의 위대한 전환이 일어납니다.\n\n- Sync (동기화): 나를 뇌의 하위 반응에 지배받는 상태에서 격상시켜, 뇌를 도구로 부리는 최상위 메타코드(Metacode)의 지점에 주파수를 맞춥니다.\n- Shift (전환): 뇌의 자동 다크코드 구동을 자연히 소멸시키고, 내가 원하는 현실과 가치 행동을 주체적으로 출력하여 운명의 궤도를 재배치합니다.",
            act: "5. 메타 코칭 시스템의 마침표\n\n결국 마음 훈련의 마침표는 \"내 생각과 감정은 뇌 하드웨어가 조건 반사로 구동해 뱉어낸 가짜 화면(결과물)이니 속지 말고, 형태 없는 무한한 의식의 주체성을 켜서 인생의 알고리즘을 다시 설계하라\"는 자각에 있습니다. 뇌의 연산을 대상화하여 흘려보내고 진짜 의식의 자유를 누릴 때, 삶은 마침내 주체적으로 재프로그래밍(Shift)됩니다."
        },
        module4: {
            title: "오늘의 마음코칭솔루션",
            affirmations: [
                "나는 내 뇌가 자동으로 뱉어낸 생각과 감정을 관찰당하는 대상(Object)으로 명확히 스캔(Scan)합니다.",
                "나는 형태 없는 드넓은 관찰자의 공간(의식)에 내 마음의 주파수를 완벽하게 동기화(Sync)합니다.",
                "나는 자동으로 튀어나오는 자아의 다크코드에 속지 않고, 내 영혼이 지향하는 가치 행동(Shift)을 묵묵히 출력합니다."
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
