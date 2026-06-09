const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 22nd content set (1st and 2nd Arrows of Pain & 3S)...");

    const essayDate = '2026-06-28';
    const essayTheme = "[임상 디버깅] 고통은 피할 수 없지만 괴로움은 선택이다: 1차 화살과 2차 화살의 3S 디버깅";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "1차 화살과 2차 화살의 정의 (마주함)",
            description: "불교의 오랜 지혜와 현대 심리학(특히 수용전념치료, ACT)에서는 우리의 마음 고통을 '1차 화살과 2차 화살'의 비유로 설명합니다. 1차 화살(고통)은 외부 자극으로 인해 자동으로 날아와 몸과 뇌에 꽂히는 통증, 슬픔, 불안, 쿵쾅거리는 심박수로 우리가 직접 통제할 수 없는 하드웨어의 자동 반응 결과물입니다. 반면 2차 화살(괴로움)은 꽂힌 화살을 보며 스스로 생각과 감정의 다크코드를 돌려 고통을 증폭시키는 마음의 저항 행위입니다. '고통(Pain)은 피할 수 없지만, 괴로움(Suffering)은 선택이다'라는 오랜 선언은 명심코칭과 내면 의식 훈련 가이드가 공통으로 추구하는 이치와 맞닿아 있습니다. 1차 고통의 발생 자체를 막는 것이 아니라, 고통을 대하는 나의 관점을 전환함으로써 진정한 자유를 얻는 3S 해킹 공식을 다룹니다."
        },
        module2: {
            title: "저항의 악순환과 관점의 분리",
            allowing: "1. 1차 반응에 대한 객관적 스캔 - Scan\n\n자동으로 뜬 불안이나 신체적 불편감(결과물)을 마주했을 때, \"큰일 났다. 이번 일은 망했다\"며 나 자신과 감정을 동일시하는 습관적 패턴을 내려놓습니다. 대신 \"어라, 내 뇌세포(뉴럴코드)와 신체 시스템이 자극을 받아 자동으로 긴장 반응을 연산해 내고 있구나\" 하고 관찰 대상으로서 객관적으로 직시(Scan)하기 시작합니다.",
            embracing: "2. 통제 시도의 종료와 저항 없는 수용 - Sync\n\n억지로 심박수를 낮추거나 불안을 지우려 발버둥 치면, 뇌의 경보 장치(편도체)가 이를 더 위급한 비상사태로 인지해 긴장 반응을 증폭시킵니다. 저항은 2차 화살의 연료가 됩니다. \"이 신체 반응은 내가 조절할 수 없는 자율신경계와 하드웨어 영역이니 그냥 뛰게 놔두자\"고 수용하며, 온전한 관찰자의 넓은 하늘 같은 의식에 나를 동기화(Sync)합니다.",
            accepting: "3. 고통은 피할 수 없음을 인정하기\n\n고통 자체는 생물학적 시스템의 자연스러운 경보음입니다. 그것을 고치거나 없애야만 내가 안전할 것이라는 고정관념에서 벗어날 때, 역설적으로 고통의 파도 위에서 균형을 잡는 힘이 길러집니다."
        },
        module3: {
            title: "관점 전환을 통한 행동의 시프트",
            msc: "4. 고통을 대하는 관점이 바뀔 때 일어나는 기적\n\n억지로 바꾸려 할 때는 오히려 강화되던 불안과 긴장이, 관점을 바꾸어 방치하는 순간 스스로 쪼그라드는 치유가 일어납니다. 몸은 긴장으로 떨릴지라도 내 최상위 의식은 자유롭기에, 내가 가고자 하는 본연의 가치 행동(Shift)을 묵묵히 밀고 나가는 것입니다.\n\n- 예전의 나(프로그램의 노예): \"심장이 뛰고 불안하네? 큰일 났다. 난 망했어.\" (고통과 나를 동일시)\n- 관점을 바꾼 나(의식의 주체): \"어라, 내 뇌세포와 심장이 자동으로 긴장 반응을 돌리고 있네? 그냥 뛰게 놔두고 나는 내 갈 길을 가자.\" (수용과 가치 전념)",
            act: "5. 고통 속에서 피어나는 주도권\n\n몸의 통증이나 삶의 거친 환경(사주적 기질 환경)이라는 1차 고통은 그대로 존재할지라도, 그것을 바라보는 최상위 의식의 관점을 리프로그래밍(Shift)함으로써 우리는 고통 속에서도 완벽하게 자유로운 인생의 주도권을 쥘 수 있게 됩니다."
        },
        module4: {
            title: "오늘의 마음코칭솔루션",
            affirmations: [
                "나는 자동으로 꽂힌 1차 화살(기질적 고통과 불안)을 억지로 뽑아내려 저항하지 않고 온전히 바라봅니다.",
                "나는 2차 화살(고통에 대한 집착과 걱정)을 돌려 괴로움을 증폭시키지 않고, 고요한 의식의 하늘과 동기화(Sync)합니다.",
                "나는 내 몸의 긴장 반응을 품어 안은 채로, 내가 지향하는 소중한 삶의 행동(Shift)을 당당하게 선택하여 나아갑니다."
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
