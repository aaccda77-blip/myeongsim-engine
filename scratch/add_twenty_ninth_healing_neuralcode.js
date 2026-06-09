const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 29th content set (Neural Code Concept & 3S)...");

    const essayDate = '2026-07-05';
    const essayTheme = "[뇌과학 디버깅] 내 생각의 암호화 방식, 뉴럴 코드(Neural Code)";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "뉴런의 스파이크와 정보 처리의 시작 (마주함)",
            description: "우리 뇌가 외부 세계를 인식하고 마음을 움직이는 과정은 컴퓨터가 0과 1의 디지털 코드로 복잡한 프로그램을 구동하는 과정과 매우 유사합니다. 약 860억 개의 신경세포(뉴런)가 전기 신호를 주고받으며 소통하는 전기적 분출을 '스파이크(Spike)' 또는 '활동전위(Action Potential)'라고 부릅니다. 컴퓨터의 디지털 신호가 0과 1로 나뉘듯, 뉴런도 전기 신호를 '보내거나(1)', '보내지 않거나(0)'의 상태를 가집니다. 이 스파이크의 패턴이 어떻게 우리의 생각과 감정의 씨앗이 되는지 마주해 봅니다."
        },
        module2: {
            title: "레이트 코딩과 타임 코딩: 신호의 암호화",
            allowing: "1. 레이트 코딩 (Rate Coding)\n\n뇌는 전기 신호(스파이크)가 특정 시간 동안 얼마나 많이(빈도) 발생하는지를 기준으로 정보를 구별합니다. 약한 자극이나 스트레스에는 신호가 천천히 뛰고, 강한 자극이나 격렬한 감정에는 신호가 폭발적으로 빠르게 뛰면서 우리의 몸과 마음에 강력한 경고를 보냅니다.",
            embracing: "2. 타임 코딩 (Temporal Coding)\n\n신호의 빈도뿐만 아니라, 신호가 '정확히 어느 타이밍에' 번쩍이는가가 중요합니다. 미세한 시간 차이를 통해 뇌는 복잡한 외부의 시각 정보나 미묘한 감정의 변화를 정밀하게 구별해 냅니다.",
            accepting: "3. 뉴럴 코드와 마음의 동기화\n\n이 수많은 전기적 분출의 조합이 얽혀 우리가 느끼는 '불안하다', '집중해야겠다' 같은 구체적인 생각과 감정이 뉴럴 코드로 인코딩됩니다. 자동으로 튀어나온 이 감정의 코드를 억지로 바꾸려 저항하는 대신, 이것이 단지 내 뇌 신경망이 자극에 반응해 출력하는 물리적 정보 처리 현상일 뿐임을 깊이 수용하고 동기화(Sync)합니다."
        },
        module3: {
            title: "인구 코딩과 의식적 알고리즘의 시프트",
            msc: "4. 인구 코딩 (Population Coding)\n\n하나의 뉴런만으로는 정교한 마음을 다 담아낼 수 없습니다. 그래서 뇌는 수천, 수만 개의 뉴런이 동시에 거대한 네트워크를 이루어 작동하는 '인구 코딩' 방식을 씁니다. 마치 오케스트라의 수많은 악기가 협업하여 하나의 웅장한 교향곡을 만드는 것과 같습니다.",
            act: "5. 고착화된 신호 패턴의 디버깅과 시프트\n\n특정 스트레스 상황에서 고착화된 뇌의 신호 처리 패턴을 객관적으로 알아차리는 것(Scan)이 변화의 시작입니다. 뇌 신경망 오케스트라의 자동 연주 패턴을 중단하고 의식적으로 새로운 반응과 가치 중심의 행동(Shift)을 누적시킴으로써, 뇌가 스스로 새로운 뉴럴 코드를 인코딩하도록 재배선(신경가소성)을 유도합니다."
        },
        module4: {
            title: "오늘의 마음코칭솔루션",
            affirmations: [
                "나는 내 마음에 불쑥 떠오른 생각과 불안이 뇌 신경세포들이 뿜어내는 전기 신호(뉴럴 코드)의 물리적 가공물임을 직시(Scan)합니다.",
                "나는 자동으로 울리는 뇌 신경망 오케스트라의 연주 소리에 저항하지 않고, 있는 그대로 묵묵히 수용하며 동기화(Sync)합니다.",
                "나는 자동화된 뉴럴 코드에 지배당하지 않고, 내가 주체적으로 선택한 가치 중심의 행동(Shift)을 통해 뇌 회로를 새롭게 써나갑니다."
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
