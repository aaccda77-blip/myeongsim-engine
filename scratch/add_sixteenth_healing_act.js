const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 16th content set (ACT Metaphors & 3S Alignment)...");

    const essayDate = '2026-06-22';
    const essayTheme = "[임상 디버깅] 정신의학이 고통을 다루는 3가지 비유: 수용전념치료(ACT)와 3S";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "임상 치료에서 사용되는 마음의 비유 (마주함)",
            description: "실제 정신건강의학과 진료실이나 임상 심리치료(3세대 인지행동치료인 ACT 등) 현장에서는 복잡한 과학 이론 대신, 매우 직관적인 비유(은유)와 시각적 도구를 사용해 마음의 이치를 설명합니다. 마음이 경직된 상태(인지 융합)를 깨고 심리적 유연성(의식/Shift)을 회복하도록 돕는 대표적인 설명 방식들을 통해 3S 모델의 임상적 연관성을 정리해 봅니다."
        },
        module2: {
            title: "3가지 치료적 메타포",
            allowing: "1. 날씨와 하늘의 비유 - 맥락으로서의 자기\n\n우울증이나 불안장애 환자들은 \"나는 우울한 사람이에요\"라며 감정과 자신을 완전히 동일시(Cognitive Fusion, 인지 융합)한 채 찾아옵니다. 이때 임상에서는 '하늘과 날씨'의 비유를 가장 많이 씁니다.\n\n\"지금 마음속에 몰아치는 불안과 우울은 거센 폭풍우나 먹구름 같은 '날씨'입니다. 날씨는 거세게 불다가도 시간이 지나면 반드시 지나가고 바뀝니다. 당신은 그 먹구름이 아니라, 그 모든 날씨를 품고 있는 거대하고 텅 빈 '하늘'입니다. 먹구름을 없애려고 하늘이 싸울 필요가 없듯이, 그 감정을 억지로 지우려 하지 말고 그냥 지나가게 두세요. 하늘인 당신은 안전합니다.\"",
            embracing: "2. 버스 승객의 비유 - 탈융합과 가치 행동\n\n불안한 생각(뇌의 자동 결과물) 때문에 아무것도 못 하겠다는 이들에게 행동의 전환(Shift)을 유도할 때 쓰는 '버스의 승객' 비유입니다.\n\n\"당신의 인생이라는 버스를 운전하고 있다고 해봅시다. 뒤에 탄 무뢰한 승객들(불안, 강박, 공포라는 생각)이 소리를 지릅니다. '이쪽으로 가면 사고 나!', '당장 차 세워!' 이때 승객들을 쫓아내려고 운전대를 놓고 싸우기 시작하면(결과물을 수정하려 개입하면), 버스는 멈추거나 탈선합니다. 가장 좋은 방법은 그들이 뭐라고 소리 지르든, 운전사인 당신은 가만히 목적지(가치 실현)를 향해 묵묵히 운전해 나아가는 것입니다.\"",
            accepting: "3. 늪의 비유 - 경험 회피의 종료\n\n공황장애나 불안으로 인해 신체 증상(심박수 상승, 호흡 곤란)이 올 때, 억지로 통제하려다 증상이 악순환되는 상태를 치료하는 비유입니다.\n\n\"불안과 싸우는 것은 '늪'에 빠진 것과 같습니다. 늪에서 빠져나오려고 발버둥을 치고 허우적거릴수록(신체 반응을 억지로 통제하려 할수록) 몸은 더 깊이 가라앉습니다. 늪에서 사는 유일한 방법은 온몸에 힘을 빼고 늪에 몸을 넓게 뉘어 맡기는 것입니다(수용). 심장이 뛰는 것을 억지로 멈추려 하지 말고 가만히 내버려 두세요. 저항을 멈출 때 비로소 평온이 찾아옵니다.\""
        },
        module3: {
            title: "수용전념치료의 최종 메커니즘",
            msc: "4. 정신의학이 제시하는 치료 공식과 3S\n\n정신의학계에서 교육하는 치료의 단계는 명심코칭의 3S 프로세스와 완벽하게 일치합니다.\n\n- 1단계: \"자신에게 일어나는 증상과 통증(1차 화살)은 뇌의 자동 반응이니 통제할 수 없다. 바꿀 생각을 마라.\" ➔ Scan (수용)\n- 2단계: \"당신은 고통을 관찰하는 하늘이며, 고통을 품은 채로 소중한 일상을 살아내라.\" ➔ Sync (동기화)\n- 3단계: \"그렇게 관점을 바꾸고 일상을 살다 보면, 어느새 뇌 회로가 치료되어 불안도 사라져 있을 것이다.\" ➔ Shift (신경가소성을 통한 전환)",
            act: "5. 전문의가 제안하는 마음 다스림\n\n정신의학과 전문의들은 환자들이 생각과 감정을 바꾸려고 집착할 때 생기는 문제점을 지적하며, 이를 있는 그대로 내버려 두고(Let it be) 현실의 삶과 가치 행동에 전념할 때 일어나는 실질적인 치유 효과를 설명합니다. 이것이 바로 생각이라는 언어적 굴레를 내려놓고 현실에 전념하는 ACT(수용전념치료)의 핵심이자 명심코칭의 과학적 뼈대입니다. (추천 시청 자료: [정신의학과 전문의 수용전념치료 설명 영상](https://www.youtube.com/watch?v=rARvuuR3wEE))"
        },
        module4: {
            title: "오늘의 마음코칭솔루션",
            affirmations: [
                "나는 내 마음에 머무는 우울과 불안이 일시적인 날씨일 뿐이며, 나는 그 날씨를 품는 넓은 하늘임을 자각합니다.",
                "나는 뒤에서 소리 지르는 생각의 소음과 싸우는 대신, 내가 원하는 목적지를 향해 묵묵히 버스를 운전해 나갑니다(Sync).",
                "나는 고통을 억지로 억누르려 발버둥 치지 않고 온몸의 힘을 빼고 가만히 내버려 두며, 자유로운 시프트를 향해 전념합니다(Shift)."
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
