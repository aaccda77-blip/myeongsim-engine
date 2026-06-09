const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 31st content set (Barnum Effect Overcoming & CBT Concept)...");

    const essayDate = '2026-07-07';
    const essayTheme = "[명심 디버깅] 명심코칭이 바놈 효과의 함정을 극복하는 방법: 마음의 해킹과 삶의 최적화";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "바놈 효과의 함정과 명심코칭의 차별점 (마주함)",
            description: "\"당신은 겉은 강해 보이지만 속은 여린 구석이 있네요.\" 이처럼 누구에게나 해당하는 모호한 묘사를 듣고 주관적으로 대입하는 심리적 오류를 '바놈 효과(Barnum Effect)'라고 부릅니다. 사주가 대중에게 모호한 예언처럼 다가갈 때 흔히 바놈 효과의 착각에 빠지지만, 명심코칭은 사주의 구조적 프레임을 '현대 심리학과 코칭 방법론'으로 완전히 재해석하여 개인의 고유한 인지·행동 알고리즘을 정밀 타겟팅 분석합니다. 모호한 착각을 넘어 삶의 경로를 설계하는 차별점을 스캔(Scan)해 봅니다."
        },
        module2: {
            title: "모호한 위로 대신 명확한 인지 메커니즘 분석",
            allowing: "1. 모호한 위로 대신 '명확한 메커니즘' 분석\n\n바놈 효과는 추상적이고 감정적인 문장으로 위안을 유도합니다. 반면 명심코칭은 동양 자연 명리학의 오행과 관계 체계(십신)를 개인의 타고난 성향, 스트레스 취약성, 행동 패턴을 분류하는 고대의 데이터 모델로 봅니다. 이를 현대 인지행동치료(CBT)나 수용전념치료(ACT) 프레임과 연결하여 왜 특정 조건에서 고착된 인지 오류가 발생하는지 명확히 짚어냅니다.",
            embracing: "2. 운명론적 예언이 아닌 '주체적 인지 수용'\n\n사주가 \"올해는 이동수가 있으니 몸을 사려라\"는 식의 운명론으로 흘러간다면 바놈 효과의 불안 속에 갇히게 됩니다. 명심코칭은 타고난 기운의 치우침을 나라는 '시스템의 기본값(Default)'으로 받아들입니다. 내 마음에 탑재된 조건 반사 회로를 억지로 부정하지 않고 온전히 인정하고 동기화(Sync)하는 것이 주체적 변화의 출발점입니다.",
            accepting: "3. 착각을 넘어선 '실질적인 솔루션' 제공\n\n바놈 효과는 듣고 나면 \"내 얘기네\" 하고 끝나지만 정작 일상은 바뀌지 않습니다. 명심코칭의 종착지는 단순한 안도가 아닌 삶의 최적화(Biohacking)입니다. 분석된 데이터를 바탕으로 마음의 인지 왜곡을 교정하고, 멘탈 퍼포먼스를 극대화할 구체적인 행동 전략과 훈련법을 제공하여 실제적인 삶의 변화를 창출합니다."
        },
        module3: {
            title: "주체적 운명 해킹과 라이프 설계",
            msc: "4. 사주라는 텍스트 코드와 최신 마음 OS\n\n명심코칭은 사주라는 오래된 기질 텍스트 코드를 현대 심리학과 뇌과학이라는 최신의 마음 OS(운영체제)로 재구동하는 혁신적인 설계도입니다. 모호함에 흔들리는 대신 나만의 정신적 알고리즘을 해킹하고 주체적으로 경로를 재설계하도록 돕습니다.",
            act: "5. 주체적으로 행동의 경로를 재배선하는 Shift\n\n\"이 취약성과 조건 반사적 성향은 내 기질 하드웨어가 뱉어내는 반응일 뿐, 나의 실체가 아니다.\" 이 자각을 기반으로 마음의 중심을 잡고, 고착화된 낡은 반응 패턴을 자유거부(Free Won't)한 뒤 진정으로 지향하는 가치 행동(Shift)을 매일의 일상 속에 누적시켜 나갑니다."
        },
        module4: {
            title: "오늘의 마음코칭솔루션",
            affirmations: [
                "나는 내 성향과 반응 패턴이 모호한 운명이 아닌, 마음 OS가 가진 고유한 인지 메커니즘(기질)임을 직시(Scan)합니다.",
                "나는 타고난 기질의 치우침을 바꾸려고 싸우지 않고, 내 마음에 장착된 기본값(Default)으로 편안하게 동기화(Sync)합니다.",
                "나는 모호한 위로나 운명론적 예언에 휘둘리지 않고, 내가 주체적으로 선택한 행동(Shift)을 통해 내 삶을 최적화해 나갑니다."
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
