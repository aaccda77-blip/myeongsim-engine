const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 27th content set (Metacoding Technical specs & 3S)...");

    const essayDate = '2026-07-03';
    const essayTheme = "[명심 디버깅] 메타코드(Metacode)의 기술적 의미: 내 삶을 프로그래밍하는 최상위 설계도";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "메타코드의 컴퓨터 과학적 정의 (마주함)",
            description: "'메타코드(Metacode)'는 단순한 심리적 현상이나 은유적 단어가 아닙니다. 컴퓨터 과학 및 인공지능(AI) 분야에서 깊이 있게 쓰이는 엄연한 기술적 개념입니다. 한마디로 요약하면 \"코드를 만드는 코드\" 혹은 \"하부 프로그램을 제어하기 위한 최상위 레벨의 코드\"를 뜻합니다. 이 메타코드가 우리의 마음을 리프로그래밍하는 훈련과 어떻게 닿아 있는지 공학적 관점에서 풀어봅니다."
        },
        module2: {
            title: "전통적 소프트웨어 및 AI에서의 메타코드",
            allowing: "1. 전통적 의미: 메타프로그래밍 (Metaprogramming)\n\n기존 소프트웨어 공학에서 메타코드는 프로그램이 실행되거나 컴파일될 때, 자기 자신의 구조를 스스로 분석하고 수정할 수 있도록 설계하는 코드를 의미합니다. 일반 코드가 단순히 데이터(숫자, 문자)를 조작한다면, 메타코드는 코드 그 자체를 조작의 대상으로 다룹니다. 도면을 보고 벽돌을 쌓는 행위가 일반 코딩이라면, 벽돌을 자동으로 쌓아주는 로봇의 작동 설계도를 그리는 행위가 메타코딩입니다.",
            embracing: "2. 현대적 AI 의미: 프롬프트 및 에이전트 시스템 (Meta-Coding)\n\n최근 대형 언어 모델(LLM)과 AI 에이전트 시대가 열리면서 메타코드의 의미는 한층 확장되었습니다. AI에게 단순 코딩을 요청하는 것을 넘어, 다수의 AI 역할군 에이전트를 어떻게 배치하고 상호 검수(Validation)하게 만들 것인지에 대한 전체적인 시스템 규칙과 사양(Spec)을 설계하는 기술을 뜻합니다. 즉, AI가 올바른 아웃풋(다크코드)을 생산하도록 지시, 통제, 검증하는 상위의 가이드라인인 것입니다.",
            accepting: "3. 마음의 알고리즘에 대입하기\n\n내 삶에서 자동으로 튀어나는 습관과 두려움은 일종의 무의식적 프로그램인 일반 코드입니다. 이 일반 코드를 억지로 지우려 애쓰는 대신, 한 걸음 물러서서 이 무의식 프로그램이 돌아가고 있음을 인지하고, 그것을 통제 및 검증할 수 있는 상위 수준의 가이드라인을 만드는 것(메타코딩)이 평온의 열쇠입니다."
        },
        module3: {
            title: "3대 코드 개념 총정리",
            msc: "4. 뉴럴코드, 다크코드, 메타코드의 명심코칭 비유\n\n뇌과학과 마인드 디버깅 프레임에서 이 세 가지 개념을 정렬하면 매우 명쾌하게 구조화됩니다.\n\n- 뉴럴 코드(Neural Code): 뇌세포가 정보를 처리하는 실제 전기 신호 암호 ➔ 외부 자극 시 감정과 생각을 자극하는 실제 물리적 신호 전달 체계.\n- 다크 코드(Dark Code): 인간의 검수 없이 AI가 스스로 짜서 가동하는 코드 ➔ 무의식에 깊이 박혀 자동으로 작동하는 습관, 방어기제, 자동적 불안 알고리즘.\n- 메타 코드(Metacode): 코드를 제어하고 수정하는 최상위 설계 코드 ➔ 무의식(다크코드)과 뇌(뉴럴코드)를 내려다보며 주체적으로 행동을 수정(Shift)하는 메타인지와 코칭 시스템.",
            act: "5. 바놈 효과의 극복과 메타코딩의 완수\n\n바놈 효과는 단순히 그럴듯한 모호한 위로에 속아 넘어가는 심리적 취약점일 뿐입니다. 반면 메타코드는 그 취약점(자동적 기질 반응)을 직시(Scan)하고, 주체성(의식)을 회복하여 삶의 알고리즘을 최적화하도록 돕는 강력한 리프로그래밍 도구입니다. 메타코드를 켜는 순간, 우리는 삶의 온전한 프로그래머가 될 수 있습니다."
        },
        module4: {
            title: "오늘의 마음코칭솔루션",
            affirmations: [
                "나는 내 무의식이 자동으로 구동하는 습관과 방어기제(다크코드)를 나라고 오해하지 않고 스캔(Scan)합니다.",
                "나는 자동으로 반응하는 물리적 전기 신호(뉴럴코드)와 싸우지 않고, 온전히 최상위 의식의 공간(메타코드)에 주파수를 일치시킵니다(Sync).",
                "나는 상위 가이드라인에 따라 내가 원하는 행동의 방향을 주체적으로 선택(Shift)하여 뇌의 지배로부터 완벽히 벗어납니다."
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
