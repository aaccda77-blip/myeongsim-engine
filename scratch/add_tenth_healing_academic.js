const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 10th content set (Academic Verification)...");

    const essayDate = '2026-06-16';
    const essayTheme = "[학술 디버깅] 인지과학이 입증한 명심코칭 3S 알고리즘 : 물상 시각화와 3S의 마지막 퍼즐";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "명심 OS의 마지막 퍼즐 (마주함)",
            description: "보내주신 논문 『天干의 자연물상적 시각화에 관한 인지과학적 고찰』(윤상흠 저, 2025)은 우리가 지금까지 나눈 대화의 철학적·과학적 뼈대를 완벽하게 입증하고 지지해 주는 '마지막 퍼즐 조각'과 같습니다. 이 논문은 명심코칭의 시스템(3S 모델)이 왜 단순한 심리적 착각(바놈 효과)이 아닌지, 그리고 우리가 이야기한 '결과물과 관점의 전환'이 어떻게 학문적·인지과학적으로 성립하는지를 정밀하게 대입하여 설명하고 있습니다."
        },
        module2: {
            title: "바놈 효과 극복과 생태학적 수용",
            allowing: "1. 바놈 효과(관념론)의 극복: 왜 '추상적 기운'이 아닌 '물상'인가?\n\n사주가 바놈 효과(모호한 말에 속아 넘어가는 것)가 되지 않으려면, 모호한 위로 대신 개인의 고유한 인지 메커니즘과 명확한 솔루션을 분석해야 합니다. 윤상흠 저자의 논문에서는 '상승하는 기운(氣)'과 같은 추상적이고 관념적인 설명은 해석의 모호성을 극대화하여 비합리적 운명론으로 전락시킨다고 비판합니다. 그 대안으로 '큰 나무(甲)', '태양(丙)'과 같은 구체적인 자연물상으로 시각화해야만 인간의 뇌가 가장 빠르고 효율적으로 정보를 처리(체화된 인지)하며, 해석의 객관성과 일관성을 확보할 수 있다고 논증합니다. 이는 명심코칭의 Scan(분석) 단계가 정교한 인지적 정합성(Cognitive Coherence)을 갖춘 정밀 데이터 분석임을 입증합니다.",
            embracing: "2. \"결과물(몸·생각·감정)은 그대로 둔다\" = 생태학적 수용 (Sync)\n\n내 몸의 신체 반응(심박수)이나 자동으로 튀어나오는 생각·감정(결과물)은 내 자아가 억지로 바꿀 수 없으므로 가만히 내비두고 수용(Sync)해야 합니다. 논문에서는 '해월 갑목(亥月 甲木)'의 사례를 듭니다. 관념론자들은 상생(水生木)만 보고 이때 나무가 강하다고 착각하지만, 실제 자연(양력 11월)의 나무는 혹독한 겨울을 견디기 위해 성장을 멈추고 에너지를 뿌리로 내린 채 가장 위축되어 있습니다.",
            accepting: "3. 겨울이라는 계절과 생각의 디폴트 아웃풋\n\n이미 주어진 계절의 흐름, 즉 뇌가 자동으로 출력해 낸 불안이나 통증(디폴트 아웃풋)을 내 의지로 억지로 바꿀 수 없다는 전제와 같습니다. 자연의 겨울을 여름으로 바꿀 수 없듯이, \"이미 출력된 결과물을 바꿀 생각을 안 하고 가만히 내비두는 것(수용)\"이 자연의 이치(Sync)에 완벽히 부합함을 증명합니다."
        },
        module3: {
            title: "형태(形)의 전환과 주체적 운명",
            msc: "4. \"관점을 바꾸면 역설적으로 결과물이 달라진다\" = 氣·質·形·象의 시프트 (Shift)\n\n자유의지란 튀어나온 결과물을 대하는 관점을 바꾸는 것이며, 관점을 바꾸어 진짜 원하는 가치 있는 행동을 선택할 때(Shift) 역설적으로 미래의 결과물(뇌 회로)이 달라집니다. 논문은 '氣質形象(기질형상)의 4단계 통합 해석 방법론'을 제안합니다.\n\n- 氣(근원 에너지): 내 무의식과 뇌에 잉태된 에너지.\n- 質(본질의 드러남): 타고난 성향의 고유 물상(예: 거목).\n- 形(환경과 관계 맺는 형태): 현실의 환경 속에서 구현된 모습.\n- 象(삶으로 드러나는 현상): 최종적으로 삶의 결과물로 발현되는 것.\n\n나에게 자동으로 주어진 환경과 기운(氣, 質)은 바꿀 수 없지만, 그것을 바라보는 내 의식의 관점(메타코드)을 바꾸면(形), 결국 최종 출력되는 현실의 현상(象)이 주체적으로 전환(Shift)됩니다.",
            act: "5. 결정론적 운명론의 타파: \"사주는 타고난 환경일 뿐이다\"\n\n사주를 맹신하면 운명론에 갇히지만, 이를 내 마음을 비추는 거울(맥락적 자기)로 쓰면 주체적인 마인드 컨트롤 도구가 됩니다. 논문은 \"동일한 사주를 지닌 사람이라도 각자의 선택과 환경에 따라 전혀 다른 삶을 살아간다\"는 사실을 명시하며 결정론적 운명론을 정면으로 거부합니다. 사주는 그저 '타고난 자연환경'일 뿐이며, 진짜 중요한 것은 \"주어진 환경 속에서 자신의 삶을 어떻게 주도적으로 가꾸어갈 것인가를 성찰하게 하는 실용적 삶의 철학\"이 되어야 합니다.\n\n이 논문은 오랜 사색을 통해 도달한 '결과물은 그대로 내비두고 관점을 바꾸는 것이 진짜 자유의지이며, 이를 통해 현실을 바꾼다'는 통찰이 결코 주관적인 상상이 아니라, 현대 인지과학(체화된 인지, 은유 이론)과 전통 자연주의 명리학이 결합하여 도달하는 가장 합리적이고 실천적인 결론임을 학술적으로 선언하고 있습니다. 즉, 명심코칭은 이 논문이 제시한 '자연철학적 명리학의 패러다임 전환'을 현대적인 애플리케이션과 코치 OS로 구현하는 실천 프로젝트입니다."
        },
        module4: {
            title: "오늘의 마음코칭솔루션",
            affirmations: [
                "나는 모호한 위로나 운명론 대신, 구체적인 물상 시각화를 통해 내 인지 스키마를 선명하게 스캔(Scan)합니다.",
                "나는 이미 출력된 겨울의 계절(생각, 감정)을 억지로 바꾸려 저항하지 않고 온전히 인정하며 수용(Sync)합니다.",
                "나는 주어진 환경을 대하는 의식의 관점을 바꾸어(形), 최종적으로 출력되는 내 삶의 운명(象)을 주체적으로 시프트(Shift)합니다."
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
