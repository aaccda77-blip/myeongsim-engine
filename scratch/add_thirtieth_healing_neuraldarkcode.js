const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 30th content set (Neural Dark Code & Barnum Effect Concept)...");

    const essayDate = '2026-07-06';
    const essayTheme = "[뇌과학 디버깅] 바놈 효과와 뉴럴 다크코드: 마음의 착각과 뇌의 설계도";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "바놈 효과와 뉴럴 다크코드의 본질적 차이 (마주함)",
            description: "\"당신은 겉으로는 강해 보이지만 속은 여린 구석이 있군요.\" 이처럼 누구나 자신에게 해당하는 모호하고 보편적인 묘사를 듣고 주관적으로 대입하여 믿는 심리적 착각 현상을 '바놈 효과(Barnum Effect)'라고 부릅니다. 반면 뇌의 실제 전기 신호 체계인 '뉴럴 코드(Neural Code)'와 무의식의 시스템적 작동을 일컫는 '다크코드(Dark Code)'가 융합된 '뉴럴 다크코드'는 주관적 착각이 아닌 과학적·기술적 실체입니다. 이 두 개념의 본질적인 차이를 마주하고 내면의 인지적 왜곡과 무의식의 물리적 구조를 함께 분석(Scan)해 봅니다. (참고 자료: [뇌의 암호 체계 분석하기 - Breaking the Neural Code](https://www.youtube.com/watch?v=gl3du4CaALg))"
        },
        module2: {
            title: "심리적 주관주의와 기술적 메커니즘의 구분",
            allowing: "1. 바놈 효과 (Barnum Effect)\n\n바놈 효과는 애매모호한 문장 속에서 자신만을 위한 특별한 의미를 찾아내려는 인간의 보편적인 인지적 인력(Gravitation) 때문에 발생합니다. 뇌는 불확실한 대상에 자의적인 스토리라인을 투사해 무조건적인 인지적 조화를 만들어내려는 심리적 습성을 가지고 있습니다.",
            embracing: "2. 뉴럴 다크코드 (Neural Dark Code)\n\n뉴럴 다크코드는 실제 데이터와 기술적 현상을 바탕으로 합니다. 컴퓨터 프로그래밍에서 인간의 검수를 건너뛴 채 생성·배포되는 AI의 다크코드처럼, 뇌 신경망 속에서 인간의 의식이 알지 못하는 사이에 자동으로 가동되는 무의식적이고도 복잡한 시스템의 블랙박스 상태를 의미합니다.",
            accepting: "3. 무의식의 블랙박스 수용과 동기화\n\n바놈 효과 같은 인지적 왜곡이나 무의식적 뉴럴 다크코드가 뿜어내는 불안과 방어기제(아웃풋)는 모두 우리 하드웨어 뇌가 뱉어내는 조건 반사적 결과물입니다. 이 복잡하게 얽힌 내면의 신호 체계에 억지로 저항하거나 뜯어고치려 애쓰는 대신, 이것이 그저 구동 중인 하나의 시스템 현상일 뿐임을 담담하게 직시하고 동기화(Sync)하여 긴장을 풀어줍니다."
        },
        module3: {
            title: "정신적 알고리즘의 해킹과 시프트",
            msc: "4. 명심코칭의 데이터 디버깅\n\n명심코칭에서 나만의 인지 알고리즘과 사주 프레임을 분석하는 것은 모호한 바놈 효과를 이용하는 것이 아닙니다. 동양 자연 명리학의 기질 데이터(오행과 격국 프레임)를 고대의 정교한 심리 데이터 포맷으로 삼아, 특정 조건에서 발생하는 심리적 과부하와 스트레스 패턴을 현대 인지과학적으로 디버깅하는 시스템적 접근입니다.",
            act: "5. 주체적 메타코드 활성화와 시프트\n\n\"자동으로 구동되는 이 무의식과 감정 반응은 내 뇌 하드웨어가 뿜어내는 뉴럴 다크코드일 뿐, 나의 실체가 아니다.\" 이 자각을 바탕으로 기존의 낡은 자동 반응을 멈추고(Free Won't), 내가 원하는 새로운 가치 중심의 행동(Shift)을 차곡차곡 축적합니다. 이 행동들이 쌓일 때 비로소 뇌의 오케스트라가 재편성(신경가소성)되고 운명도 달라지게 됩니다."
        },
        module4: {
            title: "오늘의 마음코칭솔루션",
            affirmations: [
                "나는 내 마음에 불쑥 스쳐 가는 생각과 감정이 모호한 착각이 아닌, 뇌 무의식 회로의 실제 자동 아웃풋(뉴럴 다크코드)임을 직시(Scan)합니다.",
                "나는 자동으로 튀어나와 나를 지배하려는 뇌의 감정 신호에 저항하지 않고, 묵묵히 바라보는 온전한 메타인지에 동기화(Sync)합니다.",
                "나는 뇌가 조건 반사적으로 연주하는 낡은 연주 패턴을 멈추고, 주체적으로 선택한 가치 중심의 행동(Shift)을 통해 내 삶을 새롭게 코딩합니다."
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
