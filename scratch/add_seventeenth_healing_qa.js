const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 17th content set (Q&A Scientific Basis & 3S)...");

    const essayDate = '2026-06-23';
    const essayTheme = "[학술 디버깅] 대고객용 명심코칭 과학적 근거: 운명 알고리즘 해킹 공식";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "마인드 공학으로서의 명심코칭 (마주함)",
            description: "명심코칭은 단순히 운명을 맞추는 예언이 아닙니다. 당신의 뇌가 무의식적으로 작동시키고 있는 고정된 행동 알고리즘을 해킹하여, 스스로 삶의 경로를 바꾸게 돕는 현대적인 '마인드 공학'입니다. 복잡한 학술 용어를 넘어, \"왜 내 삶이 주체적으로 바뀌는가?\"라는 직관적 질문에 대한 답을 뇌과학과 심리학의 관점에서 쉽고 신뢰감 있게 풀어드립니다."
        },
        module2: {
            title: "3S 알고리즘의 뇌과학적 원리",
            allowing: "1. Scan: 나만의 정신적 알고리즘 분석\n\n타고난 사주(四柱) 구조는 단순한 미신이 아닌, 인간의 타고난 기질과 스트레스 취약성을 유형화한 고대의 유의미한 데이터 모델로 해석될 수 있습니다. 이 고유 성향 데이터를 바탕으로, 특정 자극에 대해 나의 뇌가 왜 불안이나 분노 등의 무의식적 신호 처리 패턴(뉴럴 코드)을 보게 되는지 그 흐름을 정밀하게 직시하고 진단합니다.",
            embracing: "2. Sync: 감정과 나를 분리하는 메타인지\n\n뇌과학에 따르면 불안, 우울, 쿵쾅거리는 심박수는 외부 자극에 의해 뇌 하드웨어가 자동으로 뱉어낸 '결과물'일 뿐입니다. 인지치료(ACT)의 탈융합 원리를 통해 생각과 감정이 곧 내가 아니라 뇌의 일시적인 자동 출력물일 뿐임을 깨닫고, 감정에 매몰되지 않는 메타인지의 자리(텅 빈 공간)에서 내 마음을 고요히 바라보며 동기화합니다.",
            accepting: "3. Shift: 뇌의 회로를 재배선하는 자유의지\n\n자동으로 튀어나온 감정은 억지로 멈출 수 없지만, 그것을 대하는 나의 인지적 관점을 바꿀 때 비로소 그 다음 행동을 내 뜻대로 선택할 자유의지가 깨어납니다. 뇌가 불안을 내보낼 때, 내가 원하는 소중한 가치를 위해 주체적으로 행동을 전환(Shift)하는 경험이 누적되면, 뇌는 스스로 신경 회로를 재배선하는 신경가소성(Neuroplasticity)을 발휘하여 내일의 현실과 운명이라는 결과물까지 달라지게 만듭니다."
        },
        module3: {
            title: "의심을 확신으로 바꾸는 Q&A",
            msc: "4. Q. 사주는 바놈 효과(모호한 말에 속아 넘어가는 착각) 아닌가요?\n\nA. 모호한 말로 위로하고 방관하게 만든다면 착각이 맞습니다. 하지만 명심코칭은 뇌가 특정 외부 자극에 어떻게 취약하고 경직되는지 메커니즘을 규명하고, 실제 행동 지침과 인지 교정 솔루션을 제공하여 삶을 최적화(Biohacking)하기 때문에 단순한 심리적 착각과는 본질적으로 다릅니다.",
            act: "5. Q. 내 마음대로 제어되지 않는 신체 반응과 감정도 정말 바꿀 수 있나요?\n\nA. 심장박동을 억지로 멈추는 물리적 통제는 불가능하며, 명심코칭 역시 결과물을 강제로 억누르라 하지 않습니다. 대신 그 자극을 대하는 관점을 전환(Shift)하는 것입니다. 싸우기를 멈추고 수용하며 한 걸음 나아갈 때, 역설적으로 과열되었던 뇌의 경보 시스템이 안정되며 감정과 통증까지도 스스로 조율되는 치유가 일어납니다."
        },
        module4: {
            title: "오늘의 마음코칭솔루션",
            affirmations: [
                "나는 내 삶의 자동 반응(디폴트 아웃풋)을 억지로 통제하는 대신, 내 뇌의 경향성과 알고리즘을 정확히 스캔(Scan)합니다.",
                "나는 감정과 나를 동일시하지 않고, 온전한 메타인지의 공간에서 나의 넓은 의식과 마음을 동기화(Sync)합니다.",
                "나는 마음의 여유 공간을 바탕으로 주체적 행동 전환(Shift)을 누적시킴으로써, 뇌의 회로를 건강하게 재배선합니다."
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
