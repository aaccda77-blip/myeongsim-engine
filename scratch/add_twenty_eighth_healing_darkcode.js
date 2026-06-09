const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 28th content set (Dark Code Concept & 3S)...");

    const essayDate = '2026-07-04';
    const essayTheme = "[뇌과학 디버깅] 다크코드(Dark Code)의 본질: 내 마음의 무의식적 알고리즘";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "다크코드의 탄생과 소프트웨어 패러다임 (마주함)",
            description: "'다크코드(Dark Code)'는 최근 AI와 소프트웨어 공학 분야에서 크게 부상한 개념입니다. 이는 \"인간이 단 한 줄도 직접 쓰지 않았고, 읽지도 않았으며, 검수(리뷰)조차 거치지 않은 채 AI가 스스로 생성하고 융합하여 짜 맞춘 코드\"를 의미합니다. 과거 불을 켤 필요가 없는 무인 공장(Dark Factory)에서 유래하여 AI들이 알아서 코드를 산출하는 시스템을 '다크 소프트웨어 팩토리'라고 부르게 되었습니다. 이 다크코드가 우리의 내면 무의식 회로와 어떻게 놀랍게 맞닿아 있는지 풀어봅니다."
        },
        module2: {
            title: "검수 배제와 결과 중심의 시스템",
            allowing: "1. 인간의 검수가 배제된 최종 결과물\n\n기존의 코딩 AI는 개발자가 코드를 짤 때 옆에서 힌트를 주거나 추천을 해주는 '비서' 역할이었습니다. 인간이 코드를 읽고 확인한 뒤 승인해야 시스템에 반영되었습니다. 반면 다크코드는 인간의 검수 과정을 완전히 건너뜁니다. 인간은 그저 요구사항(기획서)만 던질 뿐이고, AI 에이전트들이 서로 소통하며 코드를 짜고, 테스트하고, 배포까지 완수합니다.",
            embracing: "2. 결과(Outcome) 중심의 평가와 블랙박스\n\n다크코드 환경에서 인간 개발자는 코드가 어떻게 짜여 있는지 구조(소스코드)를 볼 필요가 없습니다. 프로그램이 버그 없이 제대로 작동하는지, 기획했던 요구사항을 완벽히 충족하는지 즉, 결과(Outcome)를 기준으로 시스템을 평가합니다. 이는 인간에게 코딩 피로감을 덜어주는 '생산성의 혁신'을 주지만, 내부 구조가 너무 복잡하게 얽혀 문제가 생겼을 때 코드를 전혀 이해할 수 없는 '블랙박스의 위험성'을 동시에 안겨줍니다.",
            accepting: "3. 마음의 다크코드 수용하기\n\n우리의 뇌도 일종의 '다크코드 팩토리'와 같습니다. 타고난 기질과 무의식에 누적된 과거의 기억들이 외부 자극과 결합하여, 우리가 자각하기도 전에 불안이나 분노라는 감정 반응(결과물)을 스스로 가공해 배포해 버리기 때문입니다. 자동으로 튀어나온 이 감정 반응의 내부 회로를 억지로 뜯어고치려 드는 것은 미로 속에서 허우적거리는 것과 같습니다. 내부 반응을 통제하려 개입하지 않고 그대로 두는 것(수용)이 진정으로 마음을 안정시키는 지혜입니다."
        },
        module3: {
            title: "무의식 디버깅과 시프트",
            msc: "4. 명심코칭의 관점으로 다스리는 무의식\n\n뇌가 자동으로 돌리는 감정 반응(다크코드)은 억지로 제어할 수 없는 영역입니다. 그러나 최상위 의식(메타코드)을 활성화하면 이 무의식 프로그램의 작동 흐름을 멀리서 객관적으로 스캔(Scan)할 수 있게 됩니다.",
            act: "5. 참된 자유의지와 시프트\n\n\"이 불안은 내 뇌 하드웨어가 조건 반사로 출력한 다크코드일 뿐, 나의 실체가 아니다.\" 이 자각(Sync)을 바탕으로, 자동으로 흘러가는 행동 패턴을 거부하고 내가 진정으로 지향하는 가치 행동(Shift)을 누적시킵니다. 이 행동들이 누적될 때 뇌는 스스로 신경 회로를 재배선하는 신경가소성을 발휘하여 미래에 다가올 결과물까지 달라지게 만듭니다."
        },
        module4: {
            title: "오늘의 마음코칭솔루션",
            affirmations: [
                "나는 내 마음에 불쑥 떠오른 불안과 방어기제가 뇌의 무의식적 알고리즘(다크코드)이 뱉어낸 결과물임을 직시(Scan)합니다.",
                "나는 자동으로 튀어나온 감정을 억지로 바꾸려 하지 않고, 묵묵히 바라보는 온전한 메타코드(의식)에 동기화(Sync)합니다.",
                "나는 뇌의 자동 반응에 지배당하지 않고, 내가 주체적으로 선택한 가치 중심의 행동(Shift)을 당당하게 밀고 나갑니다."
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
