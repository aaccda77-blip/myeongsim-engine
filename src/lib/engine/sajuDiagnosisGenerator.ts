/**
 * Saju Diagnosis & Dynamic Initial Greeting Generator
 * Analyzes Saju 8 Characters, Ten Gods, Temperature (Hot/Cold), and DayMaster dynamics
 * to generate deep, personalized first questions and targeted 1-Tap choices.
 */

export interface PersonalizedGreeting {
    headline: string;
    coreProblemDiagnosis: string;
    greetingText: string;
    options: [string, string, string];
}

export function generatePersonalizedSajuGreeting(params: {
    sajuGanji?: string;
    dayMaster?: string;
    archetypeName?: string;
}): PersonalizedGreeting {
    const rawGanji = params.sajuGanji || '';
    const dm = params.dayMaster || '辛';
    const archName = params.archetypeName || '마스터 코어';

    // 1. Check for specific Saju combinations
    const isHotDry = rawGanji.includes('미') || rawGanji.includes('미월') || rawGanji.includes('사') || rawGanji.includes('오') || rawGanji.includes('술');
    const isColdWet = rawGanji.includes('해') || rawGanji.includes('자') || rawGanji.includes('축') || rawGanji.includes('진');
    const hasStrongRoot = rawGanji.includes('신') || rawGanji.includes('유') || rawGanji.includes('인') || rawGanji.includes('묘');

    // Special Case 1: 辛金 + 조열(未/巳) + 癸水/庚申 (e.g. 경신년 계미월 신사일 을미시)
    if (dm === '辛' || dm === '신') {
        if (isHotDry) {
            return {
                headline: '조열한 대지 위의 정밀 메스 & 구원자 번아웃',
                coreProblemDiagnosis: '메마르고 뜨거운 환경(未土/巳火) 속에서 주변의 위기를 해결하고 살려내느라, 맑은 단비(癸水) 같은 본인의 에너지가 바싹 마르고 만성 소진에 빠져 있습니다.',
                greetingText: `안녕하세요! **${archName}** 맞춤형 제로포인트 코치입니다.\n\n주변의 메마르고 긴박한 문제들을 수습해 주느라, 정작 **본인의 맑은 에너지가 소진된 채 1순위 본업을 방치**하고 계시진 않나요?\n\n타인을 구원하느라 번아웃되는 트랩을 멈추고, 오직 당신의 중심을 회복하는 10분 마이크로 시동을 지휘해 드리겠습니다.`,
                options: [
                    '남의 위기 수습하느라 내 에너지가 바싹 말랐어요 (구원자 트랩) 💎',
                    '100점 완벽한 해결책을 내놓아야 한다는 강박에 짓눌려요 🛡️',
                    '자책감과 피로 때문에 시작 자체를 계속 망설이고 있어요 ⚡'
                ]
            };
        } else {
            return {
                headline: '극강의 심미안 & 비타협적 완벽주의',
                coreProblemDiagnosis: '0.1%의 오차도 용납하지 못하는 보석의 결벽성으로 인해, 시작 단계에서부터 스스로를 과도하게 검열하며 착수를 지연시키는 병목이 있습니다.',
                greetingText: `안녕하세요! **${archName}** 맞춤형 제로포인트 코치입니다.\n\n0.1%의 티끌도 용납하지 않으려는 완벽주의 때문에, **완벽한 완성도가 안 보인다는 이유로 첫 줄 작성을 미루고** 계시진 않나요?\n\n완벽의 채찍질을 내려놓고, 30점짜리 거친 초안으로 10분 만에 돌파하는 법을 열어드립니다.`,
                options: [
                    '완벽하게 해낼 각이 안 서서 첫 단추를 못 꿰겠어요 💎',
                    '타인의 결함이 너무 눈에 띄어 혼자 다 떠맡게 돼요 🛡️',
                    '사소한 실수 하나도 용납이 안 돼서 검열만 반복하고 있어요 ⚡'
                ]
            };
        }
    }

    // Special Case 2: 甲木 (거목)
    if (dm === '甲' || dm === '갑') {
        if (!hasStrongRoot || isColdWet || rawGanji.includes('부목')) {
            return {
                headline: '착근(뿌리) 결여 부목 & 이상과 현실의 간극',
                coreProblemDiagnosis: '우뚝 선 거목(甲木)의 이상과 자존심은 하늘을 찌르나, 현실적 지반(토/착근)이 흔들려 겉의 끈질김 이면에 심한 내적 불안과 변덕을 혼자 끙끙 앓고 있습니다.',
                greetingText: `안녕하세요! **${archName}** 맞춤형 제로포인트 코치입니다.\n\n우뚝 서서 모든 것을 이끌어야 한다는 책임감은 크지만, 현실 지반이 흔들려 **겉의 끈질김 뒤에 숨은 불안과 변덕으로 혼자 자책**하고 계시진 않나요?\n\n당신이 나약한 것이 아니라 뿌리를 내릴 안정된 환경이 필요했던 것입니다. 오늘 10분간 에너지를 착근시키는 루틴을 시작합니다.`,
                options: [
                    '뿌리(환경)가 불안정해 거목의 이상과 현실 사이에서 흔들려요 🌲',
                    '혼자 다 짊어져야 한다는 압박감에 오늘 할 일을 미뤘어요 ⏰',
                    '실패하거나 나약해 보일까 봐 첫 걸음을 떼지 못하고 있어요 💡'
                ]
            };
        } else {
            return {
                headline: '선구적 리더의 과잉 책임감 & 본업 방치',
                coreProblemDiagnosis: '앞장서서 새로운 길을 개척하고 큰 책임을 짊어지느라, 정작 본인의 1순위 핵심 과제를 뒤로 미루는 병목이 있습니다.',
                greetingText: `안녕하세요! **${archName}** 맞춤형 제로포인트 코치입니다.\n\n조직과 프로젝트의 큰 짐을 홀로 짊어지고 개척하느라, 정작 **나 자신을 위한 1순위 본진 과제를 미루고** 계시진 않나요?\n\n거대한 부담을 바닥에 내려놓고, 오늘 나만을 위한 10분의 마이크로 시동을 켜드리겠습니다.`,
                options: [
                    '혼자 다 짊어지려니 너무 버겁고 지쳐요 🌲',
                    '큰 그림에 압도되어 오늘 10분 착수를 미뤘어요 ⏰',
                    '남들 이끌어주느라 내 본업이 방치됐어요 💡'
                ]
            };
        }
    }

    // Special Case 3: 乙木 (초목/새싹)
    if (dm === '乙' || dm === '을') {
        return {
            headline: '주변 조율로 인한 경계 상실 & 에너지 분산',
            coreProblemDiagnosis: '주변 환경과 사람들의 요구에 유연하게 맞추느라, 나만의 독립된 작업 영역과 경계선이 무너져 있습니다.',
            greetingText: `안녕하세요! **${archName}** 맞춤형 제로포인트 코치입니다.\n\n주변 사람들의 기대와 감정에 맞추어 조율하느라, **정작 내 작업의 명확한 경계선을 잃고 산만해져** 계시진 않나요?\n\n흩어진 에너지를 회수하고 나만의 단단한 중심을 세우는 10분 몰입을 함께 시작하겠습니다.`,
            options: [
                '남들 눈치 보고 부탁 들어주느라 내 경계를 잃었어요 🌿',
                '할 일이 사방으로 흩어져 어디서부터 손댈지 막막해요 💡',
                '내 본업보다 남의 감정에 휘말려 에너지가 소진됐어요 🍂'
            ]
        };
    }

    // Special Case 4: 丙火 (태양) & 丁火 (등불)
    if (dm === '丙' || dm === '병' || dm === '丁' || dm === '정') {
        return {
            headline: '과열된 열정의 방전 & 소진형 번아웃',
            coreProblemDiagnosis: '세상을 환하게 비추며 달리다 내면의 땔감(연료)이 고갈되어 순간적인 방전과 무기력에 직면해 있습니다.',
            greetingText: `안녕하세요! **${archName}** 맞춤형 제로포인트 코치입니다.\n\n세상을 환하게 비추며 온 열정을 쏟아붓다, **순간 연료가 고갈되어 깊은 무기력과 번아웃에 멈춰** 서 계시진 않나요?\n\n과열된 불꽃을 10초간 식히고, 타오르는 부담 대신 가벼운 10분의 온기로 다시 시동을 켜드리겠습니다.`,
            options: [
                '열정을 다 쏟아붓고 순간 에너지가 완전 방전됐어요 ⚡',
                '완벽하게 터뜨리지 못할 바엔 손대기 싫은 무기력에 빠졌어요 🔥',
                '성과 압박감으로 인해 가슴이 답답하고 집중이 안 돼요 🕯️'
            ]
        };
    }

    // Special Case 5: 戊土 / 己土 (대지/옥토)
    if (dm === '戊' || dm === '무' || dm === '己' || dm === '기') {
        return {
            headline: '모든 무게를 삼키는 침묵 & 만성적 고착',
            coreProblemDiagnosis: '모든 상황과 사람을 품어주느라 무게를 혼자 삼키며 결단을 내리지 못하고 에너지가 굳어 있습니다.',
            greetingText: `안녕하세요! **${archName}** 맞춤형 제로포인트 코치입니다.\n\n태산처럼 모든 중압감을 묵묵히 짊어지고 삼키느라, **몸과 마음이 무겁게 굳어 시작을 망설이고** 계시진 않나요?\n\n거대한 산을 한 번에 옮기려 하지 마시고, 10초의 숨과 10분의 가벼운 1줄 쓰기로 시작해 보세요.`,
            options: [
                '모든 짐을 묵묵히 짊어지느라 몸과 마음이 굳었어요 ⛰️',
                '과제가 너무 방대해 보여서 엄두가 안 나요 💡',
                '책임감 때문에 거절하지 못하고 만성 과부하에 걸렸어요 🛡️'
            ]
        };
    }

    // Special Case 6: 庚金 (무쇠)
    if (dm === '庚' || dm === '경') {
        return {
            headline: '가혹한 자기 검열 & 흑백논리적 중단',
            coreProblemDiagnosis: '스스로에게 지나치게 엄격한 규율과 잣대를 들이대며, 단번에 결판내지 못할 일은 시작조차 거부하는 강박이 있습니다.',
            greetingText: `안녕하세요! **${archName}** 맞춤형 제로포인트 코치입니다.\n\n단단한 강철처럼 스스로에게 가혹한 기준을 들이대며, **단번에 완벽하게 끝내지 못할 바엔 손도 대기 싫은 상태**에 갇혀 계시진 않나요?\n\n자기 채찍질을 내려놓고, 완성도 30%짜리 엉성한 10분 시도로 막힌 물꼬를 터드립니다.`,
            options: [
                '스스로에게 너무 가혹한 채찍질을 하며 자책하고 있었어요 ⚔️',
                '완벽하게 끝낼 각이 안 서서 착수를 거부하고 있어요 🛡️',
                '한 번 흐름이 끊기면 모든 것을 포기하고 싶어져요 ⚡'
            ]
        };
    }

    // Special Case 7: 壬水 / 癸水 (대양/단비)
    if (dm === '壬' || dm === '임' || dm === '癸' || dm === '계') {
        return {
            headline: '생각의 감옥 & 물길의 분산',
            coreProblemDiagnosis: '수많은 시나리오와 끝없는 생각의 파도에 갇혀 실제 물리적인 첫 단추를 꿰지 못하는 병목이 있습니다.',
            greetingText: `안녕하세요! **${archName}** 맞춤형 제로포인트 코치입니다.\n\n거대한 대양처럼 끝없는 생각과 시나리오의 파도에 갇혀, **머릿속만 과열된 채 실제 물리적인 첫 단추를 못 꿰고** 계시진 않나요?\n\n생각의 스위치를 잠시 끄고, 단 10분 동안 손가락을 가볍게 움직이는 실천의 닻을 내려드립니다.`,
            options: [
                '생각의 바다에 빠져서 첫 단추를 못 꿰고 있어요 🌊',
                '너무 방대한 계획이라 손대기가 막막해요 🧭',
                '머릿속 시나리오만 무한 반복되며 실행력이 마비됐어요 🧊'
            ]
        };
    }

    // Default Fallback
    return {
        headline: '사주 오행 불균형 & 핵심 병목 해소',
        coreProblemDiagnosis: '타고난 잠재력에 비해 환경적 압박으로 인해 1순위 과제 착수에 병목을 겪고 있습니다.',
        greetingText: `안녕하세요! **${archName}** 맞춤형 제로포인트 코치입니다.\n\n거대한 책임감과 완벽주의의 무게에 눌려, **정작 나를 위한 1순위 과제를 미루고** 계시진 않나요?\n\n부담을 내려놓고 10초 이완과 10분 마이크로 시동으로 돌파구를 열어드립니다.`,
        options: [
            '혼자 다 짊어지려니 버겁고 지쳐요 🌿',
            '큰 그림에 압도되어 오늘 10분을 미뤘어요 💡',
            '실패할지도 모른다는 불안감에 시작을 피하고 있어요 🛡️'
        ]
    };
}
