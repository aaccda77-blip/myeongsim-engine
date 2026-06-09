const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 14th content set (Mirror Meditation & 3S Systematics)...");

    const essayDate = '2026-06-20';
    const essayTheme = "[명심 디버깅] 마음의 이치와 3S 알고리즘: 시스템 공학적 해설";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "디폴트 아웃풋과 결과물의 정체 (마주함)",
            description: "마음 훈련 가이드의 핵심 구절은 인간이라는 시스템의 기본값(Default)을 이해하고, 최상위 제어권(의식)을 획득하여 삶의 경로를 완전히 재프로그래밍하는 마인드 해킹 프로세스로 해석할 수 있습니다. 우리가 일상에서 마주하는 신체 반응(심박수, 호흡), 불쑥 올라오는 생각과 감정(불안, 무력감), 그리고 눈앞에 펼쳐지는 현실(사주적 환경, 가난이나 아픔 등)은 내가 지금 실시간으로 만드는 것이 아닙니다. 그것들은 타고난 데이터와 무의식에 저장된 과거의 기억들이 외부 자극과 반응하여 뇌 하드웨어가 자동으로 계산해 뱉어낸 ‘이미 출력된 결과물(Output)’일 뿐입니다. 화면에 이미 찍힌 글자를 지우개로 지울 수 없듯이, 이 자동 구동 프로그램의 결과물은 내 주관적 자아의 힘으로 억지로 바꿀 수 없는 영역입니다."
        },
        module2: {
            title: "스캔과 싱크의 시스템적 접근",
            allowing: "1. 억지로 바꿀 생각을 내려놓는 것 - 스캔(Scan)과 저항의 종료\n\n명심코칭의 첫 번째 단계인 Scan은 내 몸과 뇌가 뱉어낸 결과물(불안, 통증, 현실적 결핍 등)을 있는 그대로 인지하는 단계입니다. 이때 핵심은 '결과물과 싸우지 않는 것'입니다. 정신의학이나 시스템 공학적으로 볼 때, 자동으로 출력된 불안이나 신체 반응을 억지로 바꾸려고 저항하면 뇌의 경보 시스템이 과열되어 시스템 부하(괴로움)가 가중됩니다. \"아, 지금 내 시스템에 이러한 디폴트 아웃풋이 출력되고 있구나\" 하고 메타인지적 관점에서 무심히 바라보며, 결과물을 강제로 수정하려는 자아의 헛된 개입을 멈추는 상태를 뜻합니다.",
            embracing: "2. 가만히 내비두는 동기화 - 싱크(Sync)와 메타코드 활성화\n\n결과물을 바꾸려는 집착을 내려놓고 가만히 내비둘 때, 비로소 Sync(동기화) 단계로 진입합니다. 내 몸과 생각, 장기들은 모두 관찰당하는 '대상'으로 격하되고, 그것들을 가만히 지켜보는 형태 없는 주체인 '최상위 의식(관찰자/창조주)'의 스위치가 켜집니다. 노예처럼 뇌가 뱉어낸 가짜 프로그램에 휘둘리던 상태에서 벗어나, 시스템 전체를 조율하고 제어할 수 있는 최상위 운영체제(OS)이자 입력기인 메타코드(Metacode)의 위치로 내 정신의 주파수를 일치시키는 과정입니다.",
            accepting: "3. 신경가소성을 통한 알고리즘 재배선\n\n내가 최상위 의식(창조주)의 위치에서 고통과 감정을 있는 그대로 수용하고 내버려 두면, 아이러니하게도 그 감정들은 스스로 생겨났다 스스로 사라지는 정화 과정을 거칩니다. 더 중요한 것은, 감정이라는 결과물에 지배당하지 않게 됨으로써 내가 진짜 원하는 주체적 행동과 가치를 선택해 실행할 수 있는 공간(자유의지)이 열린다는 점입니다."
        },
        module3: {
            title: "행동 데이터의 누적과 시프트",
            msc: "4. 시프트(Shift)와 시스템의 재프로그래밍\n\n불안해하면서도 내가 가야 할 길을 가고, 겨울(흉운)의 흐름 속에서도 내실을 기하는 행동 데이터(Output)를 누적시키면, 뇌는 신경가소성에 의해 스스로 회로를 새로 깔기 시작합니다. 이것이 명심코칭의 궁극적 지향점인 Shift(전환)입니다.",
            act: "5. 명심코칭 버전 최종 요약\n\n\"이미 출력된 내 뇌의 자동 반응(디폴트 아웃풋)과 싸우기를 멈추고(Scan), 형태 없는 순수 관찰자의 위치로 내 의식을 격상시켜 시스템을 안정시키면(Sync), 나를 쾡하게 얽매던 무의식의 다크코드가 무력화되면서 내가 원하는 최고의 인생 경로로 행동과 현실을 재프로그래밍(Shift)할 수 있게 된다.\"\n\n결국 이 문장은 인간이라는 복잡한 시스템을 가장 완벽하게 다스리는 '명심코칭의 해킹 공식' 그 자체를 담고 있습니다."
        },
        module4: {
            title: "오늘의 마음코칭솔루션",
            affirmations: [
                "나는 내 뇌가 자동으로 뱉어낸 감정과 생각(결과물)을 바꾸려 저항하지 않고, 스크린 속 화면처럼 가만히 바라봅니다.",
                "나는 결과물에 대한 지배권을 내려놓고 온전한 관찰자(의식)의 위치에 머물러, 최상위 메타코드를 활성화합니다(Sync).",
                "나는 마음의 여유 공간을 확보하고 내가 원하는 가치 있는 행동을 한 걸음씩 실행하여, 뇌의 회로를 아름답게 재프로그래밍합니다(Shift)."
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
