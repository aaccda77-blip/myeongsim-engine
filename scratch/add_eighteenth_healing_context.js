const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 18th content set (Self-as-context & Value Realization)...");

    const essayDate = '2026-06-24';
    const essayTheme = "[임상 디버깅] 관점과 가치의 동조화: 맥락적 자기와 가치 실현의 3S 메커니즘";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "맥락과 가치의 유기적 결합 (마주함)",
            description: "3세대 인지행동치료인 수용전념치료(ACT)의 핵심 프로세스에서 ‘맥락으로서의 자기(Self-as-context)’와 ‘가치(Values) 실현’은 동전의 양면처럼 긴밀하게 맞물려 있는 같은 맥락의 이야기입니다. \"결과물(고통)은 그대로 두고 그것에 대한 관점을 바꾸면 역설적으로 결과물이 달라진다\"는 3S 메커니즘이 이 두 개념으로 어떻게 구현되는지 그 유기적인 연결고리를 임상적이고 과학적으로 풀어봅니다."
        },
        module2: {
            title: "두 기둥의 메커니즘 분석",
            allowing: "1. 맥락으로서의 자기는 관점을 바꾸는 공간이다\n\nACT에서 말하는 맥락으로서의 자기(의식/무한한 공간)는 뇌 영상에 직접적으로 찍히지 않는 텅 빈 하늘과 같습니다. 우리가 일상에서 겪는 불안, 강박, 사주적 흉운 등의 자극들은 그 하늘을 흘러가는 '먹구름(생각과 감정)'일 뿐입니다. 내가 먹구름과 싸우기를 완전히 멈추고, \"나는 이 모든 것을 담아내고 관찰하는 거대한 하늘(맥락)이다\"라고 관점을 바꾸는 것이 맥락으로서의 자기를 켜는 순간입니다.",
            embracing: "2. 가치 실현은 관점을 바꾼 주체가 내딛는 자유의지다\n\n고통을 있는 그대로 둔 채 관점을 하늘로 바꾼 상태에서 우리는 무엇을 해야 할까요? 여기서 바로 가치(Values) 실현이 등장합니다. 먹구름(불안)에 매몰되어 있을 때는 먹구름이 내 행동을 지배하지만, 내가 하늘(맥락)이 되는 순간 \"먹구름이 끼어 있든 말든, 하늘인 내가 지금 이 순간 내 삶에서 가장 소중하게 여기는 방향(가치)은 무엇인가?\"를 주체적으로 선택하여 행동할 수 있게 됩니다.",
            accepting: "3. 관점과 행동 전환의 상호 작용\n\n- 맥락으로서의 자기: \"불안이라는 결과물은 내가 아니구나\" 하고 나와 감정을 분리하는 것 (관점의 전환)\n- 가치 실현: \"그러므로 불안을 품은 채로, 내가 원하는 가치(성장, 도전, 기여 등)를 향해 나아가겠다\"고 선택하여 전념하는 것 (행동의 전환 / Shift)"
        },
        module3: {
            title: "3S 프레임워크 대입 구조",
            msc: "4. 명심코칭 3S 모델로 정렬해 보는 구조\n\n이 두 개념이 어떻게 유기적으로 연결되어 삶의 역설적 결과물을 만들어내는지 명심코칭의 3S 모델로 정렬하면 다음과 같습니다.\n\n- [자동 출력 결과물] ──→ 불안, 강박, 뇌의 스트레스 반응 (Scan)\n- [맥락으로서의 자기] ──→ \"이 고통은 하드웨어의 반응일 뿐, 내가 아니다\" (Sync / 관점 변환)\n- [가치 실현 / 전념 행동] ──→ 고통을 품은 채로 내가 원하는 가치 중심의 행동을 실행 (Shift)\n- [역설적 결과] ──→ 뇌 회로가 재배선되고 삶의 경로가 바뀜 (미래 결과물 변화)",
            act: "5. 왜 맥락과 가치는 하나인가?\n\n맥락으로서의 자기가 되지 않으면(관점을 바꾸지 못하면), 인간은 절대로 자기 삶의 진짜 가치를 실현할 수 없습니다. 관점이 바뀌지 않은 상태에서의 행동은 그저 고통으로부터 도망치거나(회피), 고통을 없애려고 발버둥 치는 자극-반응 시스템의 노예 짓일 뿐입니다. 결국 내가 대상화할 수 없는 무한한 의식임을 깨닫고, 자동으로 튀어나오는 뇌의 충동을 거부하며, 나의 진짜 지향점으로 묵묵히 걸어가는 가치 실현—이 두 가지는 인간이 진짜 자유의지를 발휘할 때 일어나는 하나의 연속적인 정신 프로세스입니다."
        },
        module4: {
            title: "오늘의 마음코칭솔루션",
            affirmations: [
                "나는 내 마음에 스쳐 지나가는 먹구름 같은 생각과 감정을 내가 아닌 관찰 대상(결과물)으로 스캔(Scan)합니다.",
                "나는 감정과 나를 철저히 분리하여, 드넓은 하늘 같은 온전한 의식의 공간(맥락적 자기)과 나를 동기화(Sync)합니다.",
                "나는 불안한 감정을 억지로 밀어내지 않고 품은 채로, 내가 진정 소중히 여기는 가치를 향해 자유롭게 전념 행동(Shift)을 수행합니다."
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
