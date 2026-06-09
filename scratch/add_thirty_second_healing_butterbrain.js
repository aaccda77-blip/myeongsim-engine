const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 32nd content set (Butter Brain & 전전두엽 Biohacking Concept)...");

    const essayDate = '2026-07-08';
    const essayTheme = "[뇌과학 디버깅] 전전두엽의 비밀 연료: 버터와 양질의 지방이 만드는 0.3초의 자유의지 공간";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "뇌의 연료 부족과 자동 반응의 지배 (마주함)",
            description: "뇌는 체중의 2%에 불과하지만 전체 에너지의 20% 이상을 소모하는 강력한 에너지 기관입니다. 그중에서도 무의식적인 자동 반응(다크코드)을 억제하고 메타인지적 행동(Shift)을 발휘하는 '전전두엽 피질'은 가장 연료 소모가 격심한 최상위 프로세서입니다. 전전두엽의 에너지가 고갈되면 우리는 작은 스트레스 자극에도 자동 감정에 지배당합니다. 버터와 양질의 지방이 어떻게 전전두엽에 맑고 강력한 청정 연료를 주입하여 0.3초의 메타인지 공간을 확보해 주는지 그 과학적 원리를 마주하고 스캔(Scan)해 봅니다."
        },
        module2: {
            title: "초고효율 케톤 연료와 뇌 회색질의 영양 수용",
            allowing: "1. 포도당 대신 '케톤(Ketone)'이라는 초고효율 연료 공급\n\n탄수화물 위주의 포도당은 혈당 롤러코스터 현상을 유발해 쉽게 뇌의 피로를 부르고 감정적 브레이크를 느슨하게 만듭니다. 반면 천연 목초 버터나 중쇄중성지방(MCT 오일)은 간에서 즉시 '케톤'으로 변환되어 뇌혈관장벽을 통과하며 세포 내 미토콘드리아에서 고효율 에너지(ATP)를 생산합니다. 이 연료 공급은 스트레스 자극을 일시 멈추고 자각할 수 있는 인지적 지구력을 올려줍니다.",
            embracing: "2. 뇌 회백질과 수초(Myelin)의 물리적 강화\n\n뇌 수분을 뺀 나머지 성분의 약 60%는 지방입니다. 특히 신경세포 간 전기 신호를 누전 없이 전달해 주는 절연체인 '수초'의 주성분이 지방입니다. 깨끗하고 건강한 포화지방이 주입되면 수초가 강화되고 신경 전달 속도가 최대 100배가량 빨라집니다. 이는 감정이 불쑥 튀어나왔을 때 메타인지 브레이크가 상황을 감지해 작동시키는 물리적 연산 능력이 급상승함을 의미합니다.",
            accepting: "3. 신경염증 차단과 뇌 하드웨어의 평정\n\n설탕이나 산화된 가공 식물성 오일은 뇌에 신경염증을 일으켜 전전두엽 회백질을 위축시킵니다. 천연 목초 버터에 가득한 유기산인 '부티르산'은 강력한 항염증 기능을 하여 장-뇌 축을 통해 뇌 신경염증을 극적으로 완화해 줍니다. 염증이 가라앉은 고요한 뇌 하드웨어를 있는 그대로 인정하고 동기화(Sync)할 때 마음의 안정감도 한층 더 깊어집니다."
        },
        module3: {
            title: "바이오해킹 실천과 인지 공간의 시프트",
            msc: "4. 에너지 지방 커피(방탄커피)의 바이오해킹 메커니즘\n\n일상에서 이 청정 연료를 활용하는 가장 확실한 방법은 에너지 지방 커피의 활용입니다. 아침 공복에 신선한 원두커피와 목초 버터 1스푼, MCT 오일 1스푼을 믹서기에 갈아 마시면 지방이 부드럽게 미셀화되어 뇌에 즉시 흡수됩니다. 혈당의 요동 없이 아침 내내 뇌에 강력한 케톤 비료를 공급하는 행위입니다.",
            act: "5. 깨끗한 하드웨어 위에서 일어나는 주체적 시프트\n\n지방 연료를 통해 전전두엽 피질의 두께와 수초를 물리적으로 보호하고 지키면, 자극과 반응 사이의 0.3초 틈새가 자유의지 공간으로 크게 벌어집니다. 이 청정한 뇌 하드웨어를 바탕으로 무의식적이고 낡은 조건 반사를 자유거부(Free Won't)하고, 내가 진정 지향하는 가치 중심의 행동(Shift)을 강하게 누적시킵니다."
        },
        module4: {
            title: "오늘의 마음코칭솔루션",
            affirmations: [
                "나는 내 전전두엽 피질이 맑고 튼튼한 지방 에너지를 가득 채워 무의식의 다크코드를 명확히 스캔(Scan)할 준비가 되었음을 믿습니다.",
                "나는 불쑥 치솟은 감정 자극에 저항하지 않고, 영양을 가득 채워 가라앉힌 뇌 하드웨어의 평온함 속에 나를 동기화(Sync)합니다.",
                "나는 깨끗하게 정돈된 전전두엽의 주의 집중을 통해, 내 삶에 더 가치 있고 지혜로운 선택(Shift)을 강력하게 이끌어갑니다."
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
