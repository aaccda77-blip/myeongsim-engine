const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 13th content set (Awareness of Awareness & Space Expansion)...");

    const essayDate = '2026-06-19';
    const essayTheme = "[마인드 해킹] 0.3초의 틈에서 태어나는 자유: 알아차림의 공간 확장";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "내면의 빈 공간과 알아차림의 자각 (마주함)",
            description: "자극과 반응 사이에는 미세한 틈이 존재합니다. 그 빈 공간이 바로 '알아차림의 알아차림'이자, 삶의 주도권을 되찾아주는 순수 의식의 자리입니다. 연습을 통해 이 공간(틈)이 0.3초에서 시작해 점차 넓어지고 견고해진다는 것은 뇌과학과 마음 훈련의 관점에서 모두 증명된 사실입니다. 이 공간이 어떻게 진화하고 삶을 바꾸는지 그 원리를 명쾌하게 풀어봅니다."
        },
        module2: {
            title: "0.3초의 틈을 넓히는 원리",
            allowing: "1. 뇌과학적 관점: '신경 회로의 브레이크' 확장 (신경가소성)\n\n벤저민 리벳 박사의 실험에서 무의식적 자극이 행동으로 가기 전 인간에게 주어진 수정 시간은 단 0.2~0.3초 남짓이었습니다. 처음 마음 훈련을 시작할 때는 이 타이밍을 놓치기 쉽고, 감정이 터진 뒤에야 휘둘렸음을 깨닫곤 합니다. 하지만 반복 훈련을 하면 뇌의 신경가소성(Neuroplasticity)에 의해 메타인지가 개입하는 속도가 빨라지며, 찰나 같았던 그 0.3초의 공간이 심리적으로 2초, 5초, 더 나아가 완전히 주도권을 잡을 수 있는 넓은 광장처럼 느껴지기 시작합니다. 감정이라는 결과물이 옆에서 요동쳐도 내 의식은 끄떡없는 거대한 공간으로 머물 수 있게 됩니다.",
            embracing: "2. 마음 훈련의 이치: 돈오(頓悟)와 보임(保任)의 과정\n\n마음의 자리를 한 번 알아차렸을지라도, 오랜 세월 누적된 무의식의 다크코드와 습관(습기, 習氣)은 자꾸만 우리를 다시 감정에 휩쓸리게 만듭니다. 그래서 알아차림의 끈을 놓치지 않고 깨달은 공간을 계속 가꾸어 나가는 보임(保任, 깨달음을 보호하고 기름)의 과정이 필요합니다. 찰나의 0.3초를 일상 전체로 넓혀 성성적적(惺惺寂寂, 맑게 깨어있으면서도 고요함)의 자리를 유지할 때, 마음은 완벽하고 흔들림 없는 고요를 얻습니다.",
            accepting: "3. 생각과 의식 사이에 심리적 거리두기\n\n감정이 일어나는 것을 억지로 제어하려 애쓰는 대신, 생각과 나 사이에 안전거리를 확보하는 것이 중요합니다. 생각이 일어나는 순간 '어, 생각이 올라오네' 하고 0.3초만 멈추고 관찰할 수 있다면, 그 생각은 더 이상 내 마음에 힘을 쓰지 못하고 힘을 잃어버리게 됩니다."
        },
        module3: {
            title: "3S 알고리즘의 진화와 주체적 선택",
            msc: "4. 명심코칭의 시각으로 보는 '공간의 진화'\n\n초기 단계에서는 자극 뒤에 자동 반응이 폭발한 후 뒤늦게 후회(Scan)하지만, 공간이 확장된 단계에서는 자극과 반응 사이에 넓은 의식의 공간이 개입합니다.\n\n[초기 단계]\n자극 ──(0.3초의 찰나)──> 자동 반응(폭발) ──> 뒤늦은 Scan (후회)\n\n[훈련 및 확장 단계]\n자극 ───[ 넓어진 의식의 공간 (의식자리) ]───> 주체적 Shift (가치 실현)\n- \"어? 뇌가 또 화를 내려고 하네? (Scan)\"\n- \"하늘인 나는 가만히 내비둔다 (Sync)\"",
            act: "5. 운명의 알고리즘을 해킹하는 유일한 경로\n\n이처럼 연습을 통해 의식의 공간이 점차 넓어지는 과정은, 인간이 내면의 노예 상태에서 벗어나 삶의 주도권을 되찾는 유일한 경로입니다. 0.3초의 틈을 넓혀가는 이 마인드 공학적 여정이 일상의 온전한 평화를 창조합니다."
        },
        module4: {
            title: "오늘의 마음코칭솔루션",
            affirmations: [
                "나는 자극이 올 때 즉각적으로 반응하지 않고, 그 사이에 존재하는 0.3초의 틈(알아차림의 자리)을 고요히 포착합니다.",
                "나는 올라오는 습관적인 감정을 바꾸려 저항하지 않고, 넓어진 의식의 공간 속에서 온전히 품어 안습니다(Sync).",
                "나는 감정과 나 사이의 거리를 충분히 넓혀, 무의식적 자동 반응 대신 내가 선택한 가치 있는 행동을 시작합니다(Shift)."
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
