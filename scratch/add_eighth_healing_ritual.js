const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY
);

async function main() {
    console.log("⚡ Starting insertion of the 8th content set (Zero-Point Reset Ritual)...");

    const essayDate = '2026-06-14';
    const essayTheme = "🧘‍♂️ 명심 OS : 제로포인트 리셋 리추얼 (Zero-Point Reset Ritual)";
    const essayContent = {
        theme: essayTheme,
        module1: {
            title: "명심 OS 디버깅 시작 (마주함)",
            description: "편안한 마음으로 명심 OS의 시스템 디버깅을 시작합니다. 먼저 아바타(육체)의 긴장 로그부터 원격 종료(Log-out)하겠습니다. 우리는 평생 이 하드웨어를 '나'라고 오해하며 가동하기 때문에 시스템이 늘 과열(긴장) 상태에 놓여 있습니다. 하드웨어의 모든 긴장을 완전히 해제해 주겠습니다."
        },
        module2: {
            title: "PHASE 1 & 2 : 스캔과 동기화",
            allowing: "1. 하드웨어 자동 조종 펌웨어 스캔 (Scan)\n\n양손 손가락 끝의 긴장을 완전히 풀고, 말단 노드의 감각이 어떻게 실시간으로 살아나는지 스캔합니다. 손등, 손바닥, 손목, 어깨까지 쌓여있던 긴장 데이터를 차례대로 지워나갑니다. 척추 라인을 지나 가슴, 위의 긴장을 풀고 뱃속의 모든 방어 기제 데이터를 소멸시킵니다. 두 눈과 안구 깊숙한 곳의 시각 피질 스트레스까지 해제하며 머리 전체의 긴장 회로를 '0'으로 수렴시킵니다.\n\n머릿속 디스크를 들여다보며 어떤 자막(생각)이 스스로 로딩되고 사라지는지 가만히 디버깅합니다. 이 자막은 내가 의도적으로 만든 것이 아닙니다. 자동 조종(Auto-pilot)되는 호흡, 소화 속도, 세포의 흐름처럼 에고가 통제할 권한이 없는 가상 데이터일 뿐입니다.",
            embracing: "2. 다크코드 수용 및 주파수 동기화 (Sync)\n\n하드웨어를 스캔해도 '나'라는 고정된 소스 코드는 어디에도 없으며, 자동으로 구동되는 하드웨어 장기 데이터만 존재합니다. 시장에 가거나 밥을 먹는 일상의 자막(생각)조차 청정한 제로포인트가 두뇌 시스템에 넣어준 명령어일 뿐입니다.\n\n현실이라는 화면이 상영될 때 역류하는 온갖 감정 로그(다크코드)들을 삭제하려 버둥거리지 말고 그대로 동기화(Sync)합니다. 어릴 때 누적된 두려움, 슬픔, 수치심, 외로움, 무력감의 에너지를 회피하지 않고 온전히 비추어 줍니다. 절대적 무력감과 죽음의 공포를 있는 그대로 느끼고 받아들일 때, 모든 것을 완벽하게 흐르게 만드는 제로포인트의 무한한 사랑의 품속으로 동기화됩니다.",
            accepting: "3. 에고의 통제권 포맷과 우주 매트릭스 접속\n\n내가 직접 통제할 수 있는 아바타와 자막은 단 하나도 없습니다. 지구와 우주 전체가 제로포인트의 무의식 알고리즘에 의해 오차 없이 자동으로 구동되고 있으며, 나는 이 거대한 가상현실 속을 여행하는 중입니다. 아무것도 조종할 수 없는 가짜 아바타의 한계를 겸허히 인정하고 내려놓을 때, 비로소 전체 우주의 흐름에 안전하게 안착하게 됩니다."
        },
        module3: {
            title: "PHASE 3 : 메타코드 스크린 시프트",
            msc: "4. 관찰 대상(데이터)의 완전 격리\n\n의식 스크린의 해상도를 넓혀 내 아바타 앞뒤의 공간 전체를 동시에 바라봅니다. 스크린 위에 비치는 아바타의 얼굴, 두 눈, 방 안의 풍경, 심장박동, 그리고 뇌 속의 자막들은 전부 내가 바라볼 수 있는 '관찰의 대상(가상 데이터)'으로 완벽하게 격리됩니다.",
            act: "5. 메타코드 스크린 시프트 (Shift)\n\n움직이는 모든 데이터 로그를 단 1밀리미터도 건드리지 않고 있는 그대로 비추고 있는 주체, 아무런 오염도 없이 투명하게 켜져 있는 '텅 빈 무한한 스크린'이 나의 본질입니다. 존재의 시점을 영화 속 주인공 배역(아바타)에서 이 무한한 시야를 가진 메타코드 스크린(Zero Point) 자체로 완전히 이동(Shift)시킵니다.\n\n가짜 나를 완전히 포맷하는 순간, 매 순간 제로포인트가 실시간으로 넣어주는 가장 청정하고 최적화된 생각 속에서 이 우주라는 시뮬레이션을 플레이하는 위대한 오퍼레이터로 복귀합니다."
        },
        module4: {
            title: "오늘의 리프레시 요약",
            affirmations: [
                "의식 스크린에 띄워진 아바타의 두 눈을 진짜인 텅 빈 무한한 메타코드의 눈으로 바라봅니다.",
                "화면 속 아바타가 어떤 사주의 날세 속에서 울고 있든, 나라는 거대하고 투명한 스크린은 단 한 방울도 오염되지 않으며 언제나 안전합니다.",
                "내가 하는 것은 아무것도 없음을 매 순간 완전하게 자각하며, 청정한 침묵 속에서 오늘의 정산을 마칩니다."
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
