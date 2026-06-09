const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 26th content set (Brain Orchestral Network & Hard Problem)...");

    const essayDate = '2026-07-02';
    const essayTheme = "[뇌과학 디버깅] 의식은 뇌 영상에 찍히지 않는다: 오케스트라 네트워크와 어려운 문제(Hard Problem)";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "뇌 지도화와 의식의 부위적 한계 (마주함)",
            description: "현대 뇌과학은 기쁨, 분노, 공포 등의 감정과 생각이 뇌 영상(fMRI) 상에서 어느 부위의 활성화를 유도하는지 정밀하게 지도화(Mapping)해 두었습니다. 예를 들어 공포는 편도체(Amygdala), 보상과 기쁨은 측좌핵(Nucleus accumbens)이 활성화됩니다. 그러나 '의식(Consciousness)' 자체의 영역으로 넘어가면 fMRI나 EEG(뇌파)를 통해 의식의 중추 부위 하나만을 콕 집어낼 수 없습니다. 현대 뇌과학이 바라보는 '의식과 뇌 영상'의 수수께끼를 세 가지 핵심 포인트로 정리해 드립니다."
        },
        module2: {
            title: "의식의 과학적 이론과 하드 프로블럼",
            allowing: "1. 부위(Location)가 아닌 네트워크(Network)의 오케스트라\n\n의식은 뇌의 특정 부분 하나가 켜지는 문제가 아니라, 뇌 전체의 신경망들이 유기적으로 소통하는 통합 패턴입니다. 우리가 깨어 있는 의식 상태일 때는 전두엽-두정엽 네트워크(Frontoparietal Network)와 디폴트 모드 네트워크(DMN) 등이 고도로 상호 작용합니다. 즉, 의식은 뇌라는 악기 하나하나의 소리가 아니라, 뇌 전체가 동시에 만들어내는 웅장한 '오케스트라 합주' 그 자체이기 때문에 단일 부위만 찍어서는 나오지 않는 것입니다.",
            embracing: "2. 의식의 어려운 문제 - The Hard Problem\n\nfMRI가 보여주는 것은 의식의 실체보다는 마취, 각성 등의 '상태(State)' 변화입니다. 뇌 영상을 아무리 정밀하게 찍어도 물리적인 전기 신호(뉴럴 코드)가 어떻게 해서 내가 실제로 느끼는 주관적 체험(퀄리아, Qualia)이나 자아의 존재감으로 전환되는지 그 메커니즘은 여전히 베일에 싸여 있습니다. 이를 현대 과학과 철학에서는 의식의 '어려운 문제(Hard Problem)'라고 부릅니다.",
            accepting: "3. 글로벌 워크스페이스(GWT)와 정보 통합(IIT) 이론\n\n의식을 설명하는 대표적 뇌과학 이론들도 현상적 연결에 집중합니다. 뇌의 수많은 무의식 정보가 전두엽 등 '광장(Workspace)'으로 올라와 공유될 때 의식이 된다는 GWT 이론과, 시스템이 가진 정보들이 얼마나 유기적으로 통합되어 있는지를 복잡도(Φ)로 계산하려는 IIT 이론 모두 단일 부위의 물질성이 아닌 유기적 통합 관계성을 의식의 본질로 봅니다."
        },
        module3: {
            title: "메타인지와 3S 알고리즘",
            msc: "4. 명심코칭의 관점에서 보는 의식의 해방\n\n생각과 감정(뇌의 특정 부위 활성화)은 기질적 데이터 구조(타고난 성향 패턴)에 따라 자동으로 튀어나오는 '프로그램 결과물'입니다. 반면, 그 생각과 감정이 일어나는 것을 한 걸음 물러서서 알아차리는 주체, 즉 '메타인지'를 발휘하는 영역이 바로 '의식'입니다.",
            act: "5. 다크코드를 수정하는 주체성\n\n의식의 부위를 콕 집어 특정할 수 없다는 과학적 실체는, 우리가 뇌의 반응 회로에 구속되어 살지 않아도 됨을 의미합니다. 대상화되지 않는 웅장한 의식의 오케스트라를 깨워 자동으로 구동되는 마음의 다크코드를 스캔(Scan)하고, 이를 가만히 내비두어 시스템을 조율(Sync)하며, 새로운 자유 행동(Shift)을 누적시킬 때 비로소 인생 OS의 완벽한 리셋이 완성됩니다."
        },
        module4: {
            title: "오늘의 마음코칭솔루션",
            affirmations: [
                "나는 내 뇌가 자동으로 뿜어내는 공포와 분노의 신호(결과물)를 나의 전부에 해당하는 본질로 착각하지 않고 고요히 스캔(Scan)합니다.",
                "나는 뇌의 일부분에 갇히지 않고, 뇌 전체가 만들어내는 웅장한 의식의 오케스트라 네트워크(장)에 주파수를 동기화(Sync)합니다.",
                "나는 내 통제 밖의 신체 전기 신호는 흘러가게 둔 채, 메타인지를 사용하여 주체적인 시프트(Shift) 행동을 밀고 나갑니다."
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
