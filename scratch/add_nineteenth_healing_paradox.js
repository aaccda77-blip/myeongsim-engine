const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 19th content set (Beautiful Paradox of Mind & 3S)...");

    const essayDate = '2026-06-25';
    const essayTheme = "[명심 디버깅] 관점의 변화가 부르는 아름다운 역설: 결과물의 자동적 시프트";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "통제와 저항의 종료 (마주함)",
            description: "명심코칭과 동양의 기질 명리학, 그리고 현대 뇌과학이 만나는 가장 거대하고도 아름다운 역설(Paradox)이 있습니다. 그것은 바로 \"결과물을 바꿀 생각을 아예 내려놓고 관점만 바꾸었을 뿐인데, 정신을 차려보니 최종 결과물까지 완전히 달라져 있는 현상\"입니다. 우리가 내면에서 겪는 고통의 실체와 이를 시스템적으로 어떻게 해킹해 나갈 수 있는지 그 아름다운 역설의 단계를 명쾌하게 규명해 봅니다."
        },
        module2: {
            title: "역설을 만드는 3단계 메커니즘",
            allowing: "1. 결과물을 바꿀 생각을 안 한다 - 저항의 종료\n\n우리가 고통스러운 진짜 이유는 나쁜 결과물(불안, 우울, 타고난 기질적 취약성 등) 자체 때문이 아닙니다. 그것을 내 맘대로 억지로 바꾸려고 덤벼들기 때문입니다. 뇌과학적으로 보면, 자동으로 뜬 불안(결과물)을 억지로 안 불안하게 만들려고 싸우는 순간, 뇌는 비상사태로 인식해 스트레스 반응을 증폭시킵니다. 이때 \"아, 이건 하드웨어 레벨에서 나온 결과물이니 내가 억지로 손댈 수 없다\"고 바꿀 생각을 아예 포기(수용)해 버리는 것이 역설의 시작입니다.",
            embracing: "2. 그것에 대한 관점을 바꾼다 - 의식의 분리\n\n결과물을 있는 그대로 둔 채, 최상위 의식(메타코드)을 켜서 관점을 바꿉니다. \"이 불안과 신체적 긴장은 내가 아니다. 내 뇌와 신체 시스템이 잠시 돌리고 있는 화면 속 데이터일 뿐이다.\" 이 순간, 나는 고통의 한복판에 갇힌 노예가 아니라 고통을 고요히 내려다보는 자유로운 관찰자가 됩니다. 고통은 저기 존재하지만 나와 분리되었기에 더 이상 나를 흔들지 못합니다.",
            accepting: "3. 역설적으로 결과물이 달라진다 - 미래의 재프로그래밍\n\n관점을 바꾸면 내 다음 행동(Output)의 선택권이 나에게 넘어옵니다. 예전 같으면 불안이라는 결과물에 휩쓸려 도망쳤을 텐데, 관점을 바꾼 주체는 불안을 옆에 둔 채로 내가 진짜 원하던 도전과 가치 행동(Shift)을 묵묵히 밀고 나갑니다."
        },
        module3: {
            title: "신경가소성과 행동의 누적",
            msc: "4. 행동 변화를 통한 뇌 회로의 재배선\n\n다르게 행동하기 시작하면 뇌의 신경망(뉴럴코드)은 \"어? 이 불안 자극이 왔는데도 도망치지 않고 전혀 다르게 행동하네?\"라고 판단하여 뇌의 물리적 회로 자체를 스스로 재배선(Neuroplasticity, 신경가소성)하기 시작합니다. 기질의 흐름 속에서 최고의 결실을 쌓아 올리는 주체적 행동 데이터가 누적되는 것입니다.",
            act: "5. 한 줄 역설의 요약\n\n\"결과물과 싸우기를 멈추고(Scan & Sync) 관점을 바꾸어 다르게 행동하면(Shift), 내일의 뇌와 내일의 삶의 궤적이라는 새로운 결과물이 알아서 우리 앞에 재구성됩니다.\" 이 위대한 역설의 결론은 단순한 심리적 위안이 아니라, 나라는 인간 시스템의 OS를 가장 효율적으로 구동하는 마인드 해킹의 마스터키입니다."
        },
        module4: {
            title: "오늘의 마음코칭솔루션",
            affirmations: [
                "나는 뇌 하드웨어가 뱉어낸 감정과 신체 반응(결과물)을 억지로 바꾸려 저항하지 않고 온전히 직시(Scan)합니다.",
                "나는 고통을 내버려 두고 그것을 무심히 바라보는 드넓은 관찰자의 자리(의식)와 나를 동기화(Sync)합니다.",
                "나는 불안을 옆에 둔 채로 내가 지향하는 가치 행동을 실행(Shift)하여, 뇌의 회로를 주체적으로 재배선해 나갑니다."
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
