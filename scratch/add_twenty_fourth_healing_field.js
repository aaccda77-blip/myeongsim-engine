const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 24th content set (Qualia & Consciousness Field in Brain)...");

    const essayDate = '2026-06-30';
    const essayTheme = "[뇌과학 디버깅] 대상화할 수 없지만 존재하는 의식: 주관적 경험(Qualia)과 의식의 장(Field)";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "의식의 비대상성과 주관적 실재 (마주함)",
            description: "과학적·철학적 관점에서 마음을 요약하자면, “의식은 뇌 영상으로 특정 ‘대상(Object)’처럼 끄집어내어 관찰할 수는 없지만, 그것이 존재한다는 사실만큼은 그 어떤 과학적 증거보다 확실하다”라고 정의할 수 있습니다. 현대 뇌과학과 인지과학이 이 ‘존재하지만 대상화할 수 없는 의식’의 수수께끼를 어떻게 다루며, 명심코칭의 넓은 의식 공간과 융합하는지 그 과학적 전말을 정리해 드립니다."
        },
        module2: {
            title: "의식의 실재를 증명하는 뇌과학적 원리",
            allowing: "1. 대상화할 수 없다는 과학적 증거 - 주관적 경험(Qualia)의 한계\n\n과학에서 무언가를 대상화한다는 것은 수치로 측정하거나 현미경 등으로 관찰할 수 있어야 함을 의미합니다. 그러나 의식은 그것이 불가능합니다. 뇌과학자가 fMRI로 뇌를 분석하여 특정 시각 피질이 활성화되었음을 보고할 수는 있지만, 그 사람이 눈앞에 마주하고 있는 '붉은 주관적 느낌(퀄리아, Qualia)' 그 자체를 데이터로 고스란히 뽑아내 스크린에 띄울 수는 없습니다. 물리적 현상(뇌 활동)은 대상화가 되나, 그것을 느끼는 주체적 경험(의식)은 관찰 대상을 넘어섭니다.",
            embracing: "2. 눈에 보이지 않지만 분명히 존재하는 의식\n\n그렇다면 의식은 단순한 착각일까요? 인지과학과 신경학에서는 마취나 뇌간(Brainstem) 부위의 손상에 따라 의식의 상태가 꺼지는 것을 확인해왔습니다. 물리적 기반과 고유하게 연동하여 작동하는 실체가 분명히 존재함을 반증하는 것입니다. 또한, 모든 회의론적 의심 속에서도 \"착각이든 무엇이든 간에, 무언가를 의심하고 자각하고 있는 나의 주체적 마음 공간\"의 존재성 자체는 세상에서 가장 부정할 수 없는 확실한 사실로 남습니다.",
            accepting: "3. 의식은 사물이 아닌 장(Field)이다\n\n최근 물리학과 뇌과학에서 의식을 설명할 때 유용하게 쓰이는 개념이 '장(Field)'입니다. 자석 주변의 자기장(Magnetic Field) 자체는 눈에 보이지 않지만 철가루를 뿌리면 특정 패턴으로 정렬되며 그 존재를 증명하듯이, 의식 자체는 뇌 영상에 단일 부위로 잡히지 않을지라도 그 의식의 공간(장) 안에 생각, 감정, 오감이라는 철가루(데이터)들이 뿌려질 때 마음의 패턴이 정렬되고 자각이 가능해집니다."
        },
        module3: {
            title: "대상화의 해제와 영혼의 자유",
            msc: "4. 대상화할 수 없기에 누릴 수 있는 진짜 자유\n\n만약 의식이 뇌의 특정 활성 부위(사물/대상)로만 고정되어 있었다면, 우리는 뇌의 생물학적 크기나 한계에 얽매인 노예로 살아야 했을 것입니다. 그러나 의식은 대상화되지 않는 넓은 배경이자 공간이기 때문에, 뇌가 자동으로 가공해 뱉어내는 불안, 강박, 무력감이라는 생각의 철가루에 휩쓸리지 않고, 한 걸음 물러나 이를 다르게 배치(Shift)할 수 있습니다.",
            act: "5. 최상위 메타코드를 켜는 열쇠\n\n\"나의 의식은 대상화할 수는 없지만 분명히 존재하며, 그것이 진짜 나의 본질이다.\" 이 명제는 뇌가 만들어내는 1차 결과물에 지배당하지 않는 길을 안내합니다. 뇌 하드웨어의 노예 짓을 거부하고, 텅 빈 장(Field)의 중심에서 삶의 주파수를 주체적으로 맞출 때 진정한 치유가 가능해집니다."
        },
        module4: {
            title: "오늘의 마음코칭솔루션",
            affirmations: [
                "나는 뇌의 물리적 회로가 뱉어낸 감정과 신체 반응을 나의 전부에 해당하는 대상(Object)으로 오해하지 않고 스캔(Scan)합니다.",
                "나는 눈에 보이지 않지만 분명히 실재하는 드넓은 의식의 공간(장, Field)에 나의 정신을 고요하게 동기화(Sync)합니다.",
                "나는 생각의 철가루가 어떻게 요동치든 관계없이, 텅 빈 마음의 평화를 유지하며 내가 선택한 가치 있는 행동(Shift)을 실행합니다."
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
