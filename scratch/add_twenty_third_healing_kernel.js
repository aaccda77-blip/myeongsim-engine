const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 23rd content set (OS Kernel Metaphor & 3S Layer Architecture)...");

    const essayDate = '2026-06-29';
    const essayTheme = "[명심 디버깅] 신체 반응과 메타코딩의 계층 구조: OS 커널과 상위 메타코드";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "신체 반응의 불가 제어성과 마음의 모순 (마주함)",
            description: "내면 관찰이나 의식 훈련에서는 \"심박수나 숨쉬는 것, 세포의 움직임 같은 신체 반응을 내 마음대로 즉시 조절하지 못한다\"는 사실을 강조합니다. 얼핏 보면 의식의 힘으로 인생의 흐름을 주체적으로 바꾸고 재배치한다는 명심코칭의 시프트(Shift) 개념과 충돌하는 것처럼 보이지만, 사실 이 두 가지는 나라는 시스템이 작동하는 정교한 계층 구조(Layer)로 명쾌하게 설명됩니다. 신체 반응과 무의식이 작동하는 하위 계층과, 이를 조율하는 상위 의식 메타코드의 완벽한 융합적 이치를 풀어봅니다."
        },
        module2: {
            title: "신체와 무의식의 시스템 계층 분석",
            allowing: "1. 신체 반응(심박수, 호흡) = OS의 커널과 하드웨어 레벨\n\n심박수, 소화, 호흡, 호르몬 분비 같은 신체 기능은 사용자가 임의로 껐다 켜는 응용 프로그램이 아닙니다. CPU 온도를 제어하고 메모리를 강제 할당하는 운영체제(OS)의 가장 깊은 코어인 '커널(Kernel)'이나 하드웨어 레벨에서 자동으로 구동되는 백그라운드 시스템 프로세스입니다. 의식적인 얕은 노력(생각)으로 자율신경계 센서를 강제로 바꾸려 드는 것 자체가 오류이며, \"내가 내 심장을 제어하는 것이 아니구나\"를 인정하며 자아의 통제 집착을 내려놓는 스캔(Scan)이 필요합니다.",
            embracing: "2. 생각과 감정 = 자동으로 실행되는 무의식적 다크코드\n\n과거의 기질적 취약성이나 기억 때문에 특정 자극에 자동으로 불쑥 불안과 분노의 감정이 떠오르는 것 역시, 뇌가 자동으로 가동하는 무의식적 프로그램(앱)입니다. 뇌 영상 활성화에 찍히는 물리적 결과물이므로, 자아가 당장 화를 멈추라고 억지로 명령해도 통제되지 않습니다.",
            accepting: "3. 하위 제어 불가능성의 수용\n\n신체 반응과 생각의 1차 출력물은 내 직접적인 통제 범위 밖에 있는 '주어진 환경'입니다. 이를 내 의지로 조작하려 애쓰는 에너지를 완전히 차단할 때, 뇌의 편도체 경보 장치와 디폴트 모드 네트워크(DMN)가 스스로 과열 상태를 해제하게 됩니다."
        },
        module3: {
            title: "최상위 의식의 메타코딩",
            msc: "4. 의식(Shift)이 시스템의 방향을 전환하는 법\n\n의식은 하드웨어를 강제로 멈추는 초능력이 아니라, 상위 레벨의 메타코드(Metacode)로서 주파수와 맥락을 재설계하는 주체성입니다.\n\n- 1단계 Scan (의식적 알아차림): \"지금 내 하드웨어(몸)와 무의식(생각)이 자동으로 긴장을 계산하여 뱉어내는구나\" 하고 대상화하여 묵묵히 관찰합니다.\n- 2단계 Sync (저항 멈추기): 신체 반응과 싸우지 않고 자율신경계 영역임을 인정하며 텅 빈 의식 공간에 주파수를 동기화합니다.\n- 3단계 Shift (주체적 경로 재배선): 몸의 반응은 그대로 둔 채, 메타코드를 발휘하여 \"이 긴장 속에서 내가 진정으로 실행해야 할 가치와 행동은 무엇인가?\"를 주체적으로 선택하여 행동을 출력합니다.",
            act: "5. 하드웨어와 소프트웨어의 명쾌한 공존\n\n우리는 심박수나 세포의 생물학적 작동을 직접 통제할 수는 없지만, 최상위 의식의 자리에 서서 자동으로 구동되는 뇌의 생각과 감정을 수용하고 그 다음의 선택과 행동(Shift)을 주도할 수는 있습니다. 하드웨어는 제 스스로 뛰게 놔두고, 우리는 그 위에서 인생의 마인드셋과 주체적 행동 데이터를 메타코딩하여 뇌의 신경망을 재배선해 나가는 것입니다."
        },
        module4: {
            title: "오늘의 마음코칭솔루션",
            affirmations: [
                "나는 내 통제 밖에서 자동으로 작동하는 신체 반응(OS 커널)을 강제로 바꾸려 싸우지 않고 고요히 직시(Scan)합니다.",
                "나는 자동으로 튀어나온 무의식적 감정을 내 힘으로 강압하지 않고, 흘러가도록 있는 그대로 수용(Sync)합니다.",
                "나는 몸의 긴장과 싸우는 에너지를 돌려, 내가 지향하는 소중한 가치를 위한 주체적 선택과 행동(Shift)에 집중합니다."
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
