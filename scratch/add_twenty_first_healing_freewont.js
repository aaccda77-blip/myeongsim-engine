const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 21st content set (Free Won't & Veto Power in Brain)...");

    const essayDate = '2026-06-27';
    const essayTheme = "[뇌과학 디버깅] 뇌과학이 밝힌 진짜 자유의지: 0.2초의 자유거부(Free Won't)와 3S";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "생각의 발생과 뇌의 메커니즘 (마주함)",
            description: "철학과 뇌과학이 수백 년간 탐구해 온 ‘자유의지(Free Will)’의 본질이 있습니다. 현대 뇌과학과 인지심리학이 내린 매혹적인 결론은 “인간에게 자유의지가 있다면, 그것은 자동으로 튀어나오는 결과물(생각·감정·신체 반응)을 억지로 억누르는 힘이 아니라, 그 결과물을 대하는 관점을 선택하고 최종 행동의 방향을 틀어내는 힘”이라는 것입니다. 뇌과학의 기념비적인 실험을 통해 이 진짜 자유의지의 실체가 명심코칭의 3S 모델과 어떻게 결합하는지 명쾌하게 풀어봅니다."
        },
        module2: {
            title: "자유거부의 과학적 입증",
            allowing: "1. 벤저민 리벳 박사의 실험 - 생각이 일어나는 순서\n\n1983년 벤저민 리벳(Benjamin Libet) 박사는 사람이 \"손가락을 움직여야지!\"라고 의식적으로 결정하기 약 0.3~0.5초 전에, 이미 뇌의 운동피질에서는 손가락을 움직이겠다는 준비전위가 먼저 활성화된다는 사실을 밝혔습니다. 이는 내가 주체적으로 생각을 먼저 일으키는 게 아니라, 뇌라는 생물학적 시스템이 무의식적 알고리즘(다크코드)에 의해 생각과 감정이라는 결과물을 먼저 뱉어내고 우리는 그것을 사후에 인지할 뿐임을 보여줍니다.",
            embracing: "2. 자유거부(Free Won't) - 0.2초의 제동 장치\n\n그러나 리벳 박사는 의식에 주어진 놀라운 가능성도 함께 발견했습니다. 뇌가 무의식적으로 행동 지시를 보냈을 때, 의식은 이를 인지한 순간부터 실제 행동을 시작하기 전까지 약 0.2초의 짧은 틈새 동안 \"잠깐, 나 이 행동을 하지 않겠다\"고 멈출 수 있는 제어력을 가집니다. 과학자들은 이를 자유의지(Free Will)가 아닌 '자유거부(Free Won't)'라 부릅니다. 자동으로 튀어나온 충동을 물리적 행동으로 이어가지 않고 관찰하는 것—이것이 유일한 참된 자유의지의 영역입니다.",
            accepting: "3. 자동화 프로그램의 지배로부터 해방\n\n자동으로 계산되어 출력된 불안이나 충동 자체는 바꿀 수 없습니다. 이미 하드웨어가 뱉어낸 화면이기 때문입니다. 하지만 \"이 출력된 화면은 내 뇌의 경향성일 뿐, 나의 본질이 아니다\"라고 관점만 바꾸어주면, 그 자극에 매몰되지 않고 자아의 지배를 내려놓는 성찰이 가능해집니다."
        },
        module3: {
            title: "행동 변화를 통한 미래의 시프트",
            msc: "4. 명심 OS에서 자유의지가 작동하는 경로\n\n최상위 의식(메타코드)을 켜서 관점을 바꿀 때 비로소 그 다음 행동(Output)을 선택할 권한이 나에게 넘어옵니다. 불안을 옆에 둔 채로 내가 진짜 원하는 주체적 가치 행동(Shift)을 실행할 수 있습니다.\n\n- [외부 자극] ──→ 뇌의 자동 연산 ──→ 조절 불가능한 자동 결과물(불안, 신체 반응)\n- [최상위 의식] ──→ \"자동 프로그램이 돌고 있구나\" 하고 스캔하여 관점 분리 (Sync)\n- [최종 행동] ──→ 휩쓸리지 않고 진짜 주체적인 가치 중심의 행동을 실행 (Shift)",
            act: "5. 신경가소성을 통한 결과물의 역설적 전환\n\n이렇게 관점을 바꾸는 자유의지를 사용하면 나의 행동이 달라집니다. 그리고 바뀐 행동은 뇌의 신경가소성(Neuroplasticity)에 의해 뉴런 회로를 새로 깔기 시작합니다. 즉, 지금 이 순간 결과물에 대한 관점을 바꾸면 미래에 다가올 삶의 결과물까지도 아름답게 재프로그래밍(Shift)하게 되는 위대한 마법이 실현됩니다. 이것이 바로 명심코칭이 지향하는 운명의 해킹입니다."
        },
        module4: {
            title: "오늘의 마음코칭솔루션",
            affirmations: [
                "나는 내 뇌가 무의식적으로 뱉어내는 1차 반응(결과물)을 나의 본질로 오해하지 않고 스캔(Scan)합니다.",
                "나는 뇌의 충동에 즉각 반응하지 않고, 행동 직전 0.2초의 틈새(자유거부) 속에서 온전히 의식과 동기화(Sync)합니다.",
                "나는 감정을 억누르지 않고 묵묵히 관찰하는 지혜를 발휘하여, 내 삶의 궤적을 재배선하는 가치 행동(Shift)을 시작합니다."
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
