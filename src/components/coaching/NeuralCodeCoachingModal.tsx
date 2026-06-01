"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

// ============== Types ==============
interface CodeInfo {
    name: string;
    desc: string;
    body_symptom?: string;
    action?: string;
}

interface PillarCoachingData {
    pillarLabel: string;
    ganChar: string;
    jiChar: string;
    darkCode: CodeInfo;
    neuralCode: CodeInfo;
    metaCode: CodeInfo;
}

type StateType = 'dark' | 'neural' | 'meta';

interface NeuralCodeCoachingModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: PillarCoachingData | null;
}

// ============== Tab Config ==============
const TAB_CONFIG: Record<StateType, {
    label: string; icon: string; accentColor: string;
    bgGradient: string; borderColor: string; dotColor: string; btnGradient: string;
}> = {
    dark: {
        label: '다크 코드', icon: '🕯️', accentColor: 'text-rose-400',
        bgGradient: 'from-rose-950/40 to-pink-900/10', borderColor: 'border-rose-500/20',
        dotColor: 'bg-rose-400', btnGradient: 'from-rose-500/80 to-pink-600/80',
    },
    neural: {
        label: '뉴럴 코드', icon: '🌱', accentColor: 'text-teal-400',
        bgGradient: 'from-teal-950/40 to-emerald-900/10', borderColor: 'border-teal-500/20',
        dotColor: 'bg-teal-400', btnGradient: 'from-teal-500/80 to-emerald-600/80',
    },
    meta: {
        label: '메타 코드', icon: '🕊️', accentColor: 'text-indigo-400',
        bgGradient: 'from-indigo-950/40 to-violet-900/10', borderColor: 'border-indigo-500/20',
        dotColor: 'bg-indigo-400', btnGradient: 'from-indigo-500/80 to-violet-600/80',
    },
};

// ============== SCENARIO DATA (한 글자도 빠짐없이 원문 그대로) ==============
interface SlideData {
    stepLabel: string;
    stepIcon: string;
    stepDesc: string;
    question: string;
    tip?: string;      // ✅ AI가 생성한 통찰 팁
    choices?: string[]; // ✅ AI가 생성한 선택지
    inputPlaceholder: string;
}

interface StateScenario {
    awarenessQuestion: string;
    slides: SlideData[];
    completionMessage: string;
}

interface PillarScenario {
    dark: StateScenario;
    neural: StateScenario;
    meta: StateScenario;
}

const SCENARIOS: Record<string, PillarScenario> = {
    // ===== 🚀 1. 지향점: 을미 =====
    vision: {
        dark: {
            awarenessQuestion: "결과에 집착하여 과정을 즐기지 못하고, 당장 눈에 보이는 성과가 없어 극도로 불안해하고 있나요?",
            slides: [
                { stepLabel: "산파술 (Socratic)", stepIcon: "🔍", stepDesc: "본질과 효용 묻기", question: "당장 결실을 맺어야 한다는 그 '초조함'은, 처음 당신을 어떤 위협으로부터 보호하기 위해 켜진 알람인가요?", inputPlaceholder: "눈에 보이는 결과물이 없으면 당신의 삶에 어떤 치명적인 일이 생길 것 같나요?" },
                { stepLabel: "재귀적 (Recursive)", stepIcon: "🔄", stepDesc: "심층 신념 파고들기", question: "만약 오랜 시간 공을 들였음에도 끝내 결과가 나오지 않는다면, 성과를 내지 못하는 당신은 존재 자체로 인정받을 가치가 없다고 굳게 믿고 있나요?", inputPlaceholder: "사람들의 평가가 당신의 존재 가치를 무너뜨릴 거라 두려워하고 있지는 않나요?" },
                { stepLabel: "알아차림의 알아차림", stepIcon: "👁️", stepDesc: "관찰자적 시선 확장", question: "끊임없이 열매를 맺어야만 안심하는 내면의 '초조한 수확자'를 한 걸음 뒤에서 가만히 바라보세요. 수확의 결과와 상관없이 묵묵히 밭을 일구는 당신에게 어떤 말을 건네고 싶나요?", inputPlaceholder: "관찰자인 당신이, 조급해하는 당신에게 해주고 싶은 위로를 적어보세요." },
            ],
            completionMessage: "당신의 초조함은 오류가 아닙니다. 이제 이 강력한 성취욕을 나를 갉아먹는 불안이 아닌, 상황을 유연하게 돌파하는 [유연한 기획자]의 적응력으로 사용하겠습니다.",
        },
        neural: {
            awarenessQuestion: "어떤 변수에도 꺾이지 않고 상황에 맞춰 유연하게 대처하며, 기어코 눈에 보이는 결실을 만들어내고 있나요?",
            slides: [
                { stepLabel: "산파술 (Socratic)", stepIcon: "🔍", stepDesc: "본질과 효용 묻기", question: "목표를 향해 가는 길에 예상치 못한 장애물이 나타났을 때, 당신의 '유연한 기획력'은 어떻게 경로를 수정하여 기어코 결과를 만들어내나요? 당신의 적응력은 어떤 원리로 작동합니까?", inputPlaceholder: "유연하게 궤도를 수정해서 결과를 만들어낸 경험을 적어보세요." },
                { stepLabel: "재귀적 (Recursive)", stepIcon: "🔄", stepDesc: "심층 신념 파고들기", question: "상황에 맞춰 유연하게 변형하면서도 결국 원하던 결실을 손에 쥐었을 때, 당신은 자신의 '현실 창조 능력'에 대해 어떤 확신을 얻게 되나요? ➡️ (대답 후) 그 확신은 앞으로 당신이 마주할 불확실한 미래를 대하는 태도를 어떻게 바꾸어 놓나요?", inputPlaceholder: "현실 창조의 확신이 미래를 대하는 태도를 어떻게 바꾸는지 적어보세요." },
                { stepLabel: "알아차림의 알아차림", stepIcon: "👁️", stepDesc: "관찰자적 시선 확장", question: "바람에 부드럽게 흔들리면서도 결국 튼튼한 열매를 맺어내는 당신의 유연한 과정을 한 걸음 뒤에서 관찰해 보세요. 고집부리지 않고 물 흐르듯 결과를 만들어내는 그 여유로운 모습을 보며, 내면의 관찰자는 당신에게 어떤 지지와 찬사를 보내고 있나요?", inputPlaceholder: "여유롭게 결실을 맺는 스스로에게 보내는 찬사를 적어보세요." },
            ],
            completionMessage: "유연한 기획자 코드가 활성화되었습니다. 어떤 변수 앞에서도 꺾이지 않는 당신의 적응력이 빛나고 있습니다.",
        },
        meta: {
            awarenessQuestion: "나 혼자 살아남는 것을 넘어, 척박한 땅을 개척하여 모두가 살 수 있는 옥토로 바꾸는 비전을 품고 있나요?",
            slides: [
                { stepLabel: "산파술 (Socratic)", stepIcon: "🔍", stepDesc: "본질과 효용 묻기", question: "당신이 개척하고자 하는 '모두가 살 수 있는 옥토'는 어떤 모습이며, 나 혼자만의 안위를 넘어 이 거대한 생태계를 구축하는 일에 왜 영혼의 끌림을 느끼나요?", inputPlaceholder: "당신이 꿈꾸는 생태계의 모습을 구체적으로 적어보세요." },
                { stepLabel: "재귀적 (Recursive)", stepIcon: "🔄", stepDesc: "심층 신념 파고들기", question: "척박했던 땅이 생명력 넘치는 옥토로 변하는 것을 볼 때, 이 이타적인 성취는 당신이 세상에 태어난 진짜 이유와 어떻게 맞닿아 있나요?", inputPlaceholder: "타인의 삶까지 꽃피우는 것이 당신의 존재 이유와 어떻게 연결되나요?" },
                { stepLabel: "알아차림의 알아차림", stepIcon: "👁️", stepDesc: "관찰자적 시선 확장", question: "황무지를 개척하는 당신을, 완성된 생태계 위를 나는 새의 시선으로 내려다보세요. 그 위대한 수고로움이 빚어낸 숲을 보며, 더 큰 의식은 어떤 경의를 보내고 있나요?", inputPlaceholder: "완성된 숲을 내려다보며 자신에게 보내는 경의를 적어보세요." },
            ],
            completionMessage: "생태계 건축가 코드가 각성하고 있습니다. 당신의 비전은 개인을 넘어 세상을 바꾸는 위대한 결실로 이어질 것입니다.",
        },
    },

    // ===== 👤 2. 핵심 자아: 신사 =====
    identity: {
        dark: {
            awarenessQuestion: "작은 흠결도 용납 못하고 자신과 타인을 날카롭게 비판하며, 완벽주의에 갇혀 밤잠을 설치고 있나요?",
            slides: [
                { stepLabel: "산파술 (Socratic)", stepIcon: "🔍", stepDesc: "본질과 효용 묻기", question: "언제나 세련되고 빈틈없는 모습을 유지하기 위해 바짝 세워둔 그 '면도날'은, 애초에 당신의 어떤 초라함이나 상처를 감추기 위한 갑옷이었나요?", inputPlaceholder: "이 날카로운 갑옷 뒤에 숨기고 싶었던 것은 무엇인가요?" },
                { stepLabel: "재귀적 (Recursive)", stepIcon: "🔄", stepDesc: "심층 신념 파고들기", question: "만약 통제력을 잃고 완벽하지 않은 민낯을 들킨다면, 세상은 당신을 어떻게 대할 거라 두려워하나요?", inputPlaceholder: "그 시선이 당신의 어떤 근원적 수치심을 찌르나요?" },
                { stepLabel: "알아차림의 알아차림", stepIcon: "👁️", stepDesc: "관찰자적 시선 확장", question: "오차도 없어야 한다는 무거운 법복을 입고 팽팽하게 긴장한 채 스스로를 다그치는 당신을 방청석에서 응시해 보세요. 그 날카로움을 어떻게 안아주고 싶어지나요?", inputPlaceholder: "팽팽하게 긴장한 스스로를 안아주는 말을 적어보세요." },
            ],
            completionMessage: "당신의 예민함은 오류가 아닙니다. 이제 이 날카로운 감각을 자신을 베는 칼이 아닌, 품격 있게 리드하는 [세련된 엘리트]의 정밀함으로 사용하겠습니다.",
        },
        neural: {
            awarenessQuestion: "감정에 휘둘리지 않는 냉철함과 목표를 향한 열정을 동시에 발휘하여, 품격 있게 리드하고 있나요?",
            slides: [
                { stepLabel: "산파술 (Socratic)", stepIcon: "🔍", stepDesc: "본질과 효용 묻기", question: "결정을 내릴 때는 얼음처럼 냉철하지만, 실행할 때는 불처럼 뜨거운 당신의 '세련된 리더십'은 조직과 사람들에게 어떤 압도적인 신뢰감을 주고 있나요?", inputPlaceholder: "당신의 리더십이 사람들에게 주는 신뢰감을 적어보세요." },
                { stepLabel: "재귀적 (Recursive)", stepIcon: "🔄", stepDesc: "심층 신념 파고들기", question: "사람들이 당신의 빈틈없는 완벽함과 그 이면의 따뜻한 열정에 매료되어 자발적으로 따를 때, 당신은 리더로서 어떤 자부심을 느끼나요? ➡️ (대답 후) 힘으로 군림하지 않고 품격으로 이끄는 그 경험은, 당신이라는 사람의 가치를 어떻게 증명해주고 있나요?", inputPlaceholder: "품격으로 이끄는 경험이 당신의 가치를 어떻게 증명하는지 적어보세요." },
                { stepLabel: "알아차림의 알아차림", stepIcon: "👁️", stepDesc: "관찰자적 시선 확장", question: "감정에 휘둘리지 않고 날카롭게 상황을 정리하면서도, 우아함과 품위를 잃지 않는 당신의 모습을 거울 보듯 가만히 응시해 보세요. 이성과 감정의 완벽한 줄타기를 해내는 당신의 탁월한 균형 감각을, 더 큰 의식의 당신은 어떻게 바라보며 미소 짓고 있나요?", inputPlaceholder: "균형 잡힌 스스로에게 보내는 미소와 찬사를 적어보세요." },
            ],
            completionMessage: "세련된 엘리트 코드가 활성화되었습니다. 냉철한 이성과 뜨거운 열정의 완벽한 밸런스가 당신의 리더십을 빛나게 합니다.",
        },
        meta: {
            awarenessQuestion: "힘으로 누르지 않아도 저절로 고개가 숙여지는 인격적 권위를 완성하여, 세상의 기준이 되고 있나요?",
            slides: [
                { stepLabel: "산파술 (Socratic)", stepIcon: "🔍", stepDesc: "본질과 효용 묻기", question: "당신이 생각하는 '힘으로 누르지 않아도 저절로 고개가 숙여지는 고귀한 권위'란, 내면의 어떤 불안을 완전히 내려놓았을 때 뿜어져 나오는 에너지인가요?", inputPlaceholder: "고귀한 권위의 원천이 무엇인지 적어보세요." },
                { stepLabel: "재귀적 (Recursive)", stepIcon: "🔄", stepDesc: "심층 신념 파고들기", question: "사람들이 당신의 품격에 진심으로 존경을 표하고 따를 때, 세상의 올바른 기준이 되어준다는 것은 영혼에 어떤 평온을 가져다주나요?", inputPlaceholder: "기준이 되어준다는 것이 주는 영혼의 평온을 적어보세요." },
                { stepLabel: "알아차림의 알아차림", stepIcon: "👁️", stepDesc: "관찰자적 시선 확장", question: "엄청난 찬사 앞에서도 교만해지거나 흔들리지 않는 중심(관찰자)에서, 묵묵히 자신의 길을 걷는 스스로를 향해 어떤 깊은 신뢰의 미소를 보내고 싶나요?", inputPlaceholder: "흔들리지 않는 스스로에게 보내는 깊은 신뢰의 말을 적어보세요." },
            ],
            completionMessage: "고귀한 권위 코드가 각성하고 있습니다. 당신의 존재 자체가 세상의 올바른 기준이 되어가고 있습니다.",
        },
    },

    // ===== 💼 3. 사회적 환경: 계미 =====
    social: {
        dark: {
            awarenessQuestion: "타인의 기대와 환경에 억지로 맞추느라 정작 자신의 진짜 목소리를 잃고 소진되어 있나요?",
            slides: [
                { stepLabel: "산파술 (Socratic)", stepIcon: "🔍", stepDesc: "본질과 효용 묻기", question: "무대 위에서 주변 상황에 완벽하게 스며들려는 그 '눈물겨운 적응력'은, 애초에 어떤 버림받음으로부터 당신을 숨겨주려는 생존 전략이었나요?", inputPlaceholder: "무엇이 그토록 당신을 무대 밖으로 밀려날까 봐 두렵게 만들었나요?" },
                { stepLabel: "재귀적 (Recursive)", stepIcon: "🔄", stepDesc: "심층 신념 파고들기", question: "만약 타인에게 맞춰주기를 멈추고 당신만의 뾰족한 아이디어를 밀고 나간다면, 어떤 비난이 돌아올 것 같나요?", inputPlaceholder: "그 거절이 당신을 영원히 고립시킬 거라는 깊은 공포가 숨어 있지는 않나요?" },
                { stepLabel: "알아차림의 알아차림", stepIcon: "👁️", stepDesc: "관찰자적 시선 확장", question: "생존하기 위해 끊임없이 보호색을 바꾸며 에너지를 소진하고 있는 당신의 지친 모습을 관찰해 보세요. 무대 밖에서 묵묵히 지켜보는 감독으로서 어떤 대본을 주고 싶나요?", inputPlaceholder: "눈치 보느라 지친 당신에게 쥐여주고 싶은 '진짜 대본'을 적어보세요." },
            ],
            completionMessage: "당신의 눈치 봄은 오류가 아닙니다. 이제 이 섬세한 촉을 나를 숨기는 데 쓰지 않고, 판을 생동감 있게 짜는 [창의적 전략가]의 무기로 사용하겠습니다.",
        },
        neural: {
            awarenessQuestion: "머릿속의 추상적인 아이디어를 사람들이 열광하는 현실의 무대로 완벽하게 구현해 내고 있나요?",
            slides: [
                { stepLabel: "산파술 (Socratic)", stepIcon: "🔍", stepDesc: "본질과 효용 묻기", question: "아무도 보지 못한 아이디어를 현실의 무대에 맞게 다듬어내는 당신만의 '창의적 전략'은 무엇인가요? 주변 환경의 미세한 흐름을 읽어내는 당신의 촉은 어떻게 아이디어를 생존하게 만드나요?", inputPlaceholder: "당신만의 창의적 전략이 무엇인지 적어보세요." },
                { stepLabel: "재귀적 (Recursive)", stepIcon: "🔄", stepDesc: "심층 신념 파고들기", question: "당신의 머릿속에만 있던 전략이 마침내 현실의 무대에서 완벽하게 작동하고 사람들이 환호할 때, 당신은 세상과 어떻게 연결되어 있다고 느끼나요? ➡️ (대답 후) 무에서 유를 창조해 내는 그 짜릿한 경험은, 당신의 창조적 본능을 어떻게 더 깊이 일깨우나요?", inputPlaceholder: "무에서 유를 창조할 때의 짜릿함을 적어보세요." },
                { stepLabel: "알아차림의 알아차림", stepIcon: "👁️", stepDesc: "관찰자적 시선 확장", question: "무대 뒤에서 조용히 상황을 읽어내고, 적재적소에 아이디어를 배치하며 판을 짜고 있는 당신의 모습을 무대 위 조명석에서 내려다보세요. 소리 없이 세상을 자신이 기획한 방향으로 움직이게 만드는 그 지혜로운 전략가에게, 어떤 긍정의 메시지를 건네고 싶나요?", inputPlaceholder: "조용히 판을 짜는 전략가 스스로에게 보내는 메시지를 적어보세요." },
            ],
            completionMessage: "창의적 전략가 코드가 활성화되었습니다. 당신의 촉촉한 기획력이 세상의 무대를 생동감 있게 움직이고 있습니다.",
        },
        meta: {
            awarenessQuestion: "죽어가는 조직, 꺾인 아이디어, 상처받은 사람에게 스며들어 다시 생명력을 불어넣고 있나요?",
            slides: [
                { stepLabel: "산파술 (Socratic)", stepIcon: "🔍", stepDesc: "본질과 효용 묻기", question: "가망 없다고 포기한 사람에게서 당신은 어떻게 다시 살아날 불씨를 발견하나요? 그 치유력은 어떤 깊은 공감에서 시작되었나요?", inputPlaceholder: "당신이 불씨를 발견하는 방식을 적어보세요." },
                { stepLabel: "재귀적 (Recursive)", stepIcon: "🔄", stepDesc: "심층 신념 파고들기", question: "당신의 손길로 멈춰있던 것들이 생명력을 얻을 때, 타인을 소생시키는 그 헌신적인 과정은 역설적으로 당신 자신의 영혼을 어떻게 채워주고 있나요?", inputPlaceholder: "타인을 살리는 과정이 당신의 영혼을 어떻게 치유하는지 적어보세요." },
                { stepLabel: "알아차림의 알아차림", stepIcon: "👁️", stepDesc: "관찰자적 시선 확장", question: "절망의 끝에 선 누군가에게 손을 내미는 당신을 바라보세요. 기적적인 치유의 에너지가 당신을 통해 흘러갈 때, 큰 자아는 어떤 충만한 경이로움을 느끼나요?", inputPlaceholder: "치유의 통로가 된 스스로에 대한 경이로움을 적어보세요." },
            ],
            completionMessage: "생명 소생자 코드가 각성하고 있습니다. 당신의 존재는 죽어가는 것들에게 다시 생명을 불어넣는 기적의 원천입니다.",
        },
    },

    // ===== 🌳 4. 배경 에너지: 경신 =====
    base: {
        dark: {
            awarenessQuestion: "타인의 의견을 튕겨내고 오직 내 방식만을 고집하며, 결국 외롭게 홀로 고립된 채 밀어붙이고 있나요?",
            slides: [
                { stepLabel: "산파술 (Socratic)", stepIcon: "🔍", stepDesc: "본질과 효용 묻기", question: "누구의 말도 듣지 않고 앞만 보고 밀어붙이는 그 '강력한 뚝심'의 이면에는, 누군가에게 주도권을 빼앗길 것에 대한 어떤 방어막이 쳐져 있나요?", inputPlaceholder: "누군가에게 휘둘리거나 통제당하는 것이 그토록 두려웠던 이유는 무엇인가요?" },
                { stepLabel: "재귀적 (Recursive)", stepIcon: "🔄", stepDesc: "심층 신념 파고들기", question: "만약 당신이 고집을 꺾고 타인의 방식을 수용한다면, 당신이 쌓아온 권위와 카리스마가 모두 무너져 내릴 것이라 믿나요?", inputPlaceholder: "굽히는 순간, 세상에서 완전히 무력한 존재가 될 것이라 확신하고 있지는 않나요?" },
                { stepLabel: "알아차림의 알아차림", stepIcon: "👁️", stepDesc: "관찰자적 시선 확장", question: "상처받지 않기 위해 강철 갑옷을 입은 채 돌진하고 있는 '외로운 불도저'를 멈춰 세워 바라보세요. 굳이 무장하고 소리치지 않아도 이미 단단한 당신에게 어떤 말을 건네고 싶나요?", inputPlaceholder: "갑옷 속에 숨은 당신에게, 부드러운 허용과 위로의 말을 적어보세요." },
            ],
            completionMessage: "당신의 고집은 오류가 아닙니다. 이제 이 강력한 뚝심을 타인을 튕겨내는 데 쓰지 않고, 모두를 한 방향으로 이끄는 [강력한 주도성]의 엔진으로 사용하겠습니다.",
        },
        neural: {
            awarenessQuestion: "어떤 방해물도 뚫고 나가는 강철 같은 뚝심으로, 조직을 한 방향으로 이끌고 전진하고 있나요?",
            slides: [
                { stepLabel: "산파술 (Socratic)", stepIcon: "🔍", stepDesc: "본질과 효용 묻기", question: "모두가 주저하고 망설일 때, 앞장서서 장애물을 돌파해 내는 그 '타협 없는 뚝심'의 원동력은 무엇인가요? 당신의 그 단단한 추진력은 조직에 어떤 안정감을 부여하나요?", inputPlaceholder: "타협 없는 뚝심의 원동력을 적어보세요." },
                { stepLabel: "재귀적 (Recursive)", stepIcon: "🔄", stepDesc: "심층 신념 파고들기", question: "당신의 흔들림 없는 결단력과 강력한 카리스마로 인해 조직이 결국 목표를 달성해 냈을 때, 당신은 스스로의 돌파력에 대해 어떤 믿음을 갖게 되나요? ➡️ (대답 후) 나의 에너지가 거대한 집단을 움직일 수 있다는 사실은, 당신 내면의 책임감을 어떻게 진화시키나요?", inputPlaceholder: "거대한 집단을 움직이는 경험이 주는 책임감을 적어보세요." },
                { stepLabel: "알아차림의 알아차림", stepIcon: "👁️", stepDesc: "관찰자적 시선 확장", question: "거대한 바위처럼 굳건하게 서서 사람들을 이끌고 돌진하는 당신의 에너지를, 폭풍우가 지나간 뒤의 맑은 하늘의 시선으로 내려다보세요. 그 폭발적이고 강력한 에너지를 파괴가 아닌 '건설'을 위해 통제하고 사용하는 당신의 성숙함을 알아차릴 때, 내면에서 어떤 웅장한 평안함이 느껴지나요?", inputPlaceholder: "에너지를 건설적으로 사용하는 성숙함에서 느끼는 평안을 적어보세요." },
            ],
            completionMessage: "강력한 주도성 코드가 활성화되었습니다. 타협하지 않는 뚝심이 건설적인 리더십으로 승화되어 빛나고 있습니다.",
        },
        meta: {
            awarenessQuestion: "개인의 성공을 넘어, 시대를 관통하여 후대까지 이롭게 할 거대한 시스템과 유산을 세우고 있나요?",
            slides: [
                { stepLabel: "산파술 (Socratic)", stepIcon: "🔍", stepDesc: "본질과 효용 묻기", question: "당신이 생애를 바쳐 남기고자 하는 '시간을 견뎌낼 시스템'은, 세상의 어떤 고통이나 혼란을 해결하기 위한 당신만의 반석인가요?", inputPlaceholder: "당신이 세우고자 하는 시스템이 해결할 문제를 적어보세요." },
                { stepLabel: "재귀적 (Recursive)", stepIcon: "🔄", stepDesc: "심층 신념 파고들기", question: "수많은 후대 사람들이 그 시스템 안에서 번영을 누리는 미래를 상상해 보세요. 역사의 주역으로 영원히 살아 숨 쉰다는 것은 어떤 의미인가요?", inputPlaceholder: "역사에 남는다는 것이 당신에게 주는 의미를 적어보세요." },
                { stepLabel: "알아차림의 알아차림", stepIcon: "👁️", stepDesc: "관찰자적 시선 확장", question: "당신이 세운 제국이 수백 년 후에도 사람들을 이롭게 하는 모습을 우주적인 시선으로 굽어보세요. 역사의 관찰자로서 자신에게 어떤 헌사를 바치고 싶나요?", inputPlaceholder: "시간을 초월한 관찰자로서 자신에게 바치는 헌사를 적어보세요." },
            ],
            completionMessage: "제국의 건설자 코드가 각성하고 있습니다. 당신의 유산은 시대를 관통하여 후대까지 이어질 것입니다.",
        },
    },
};

// ============== Helper: Get scenario for pillar ==============
function getScenario(pillarId: string): PillarScenario | null {
    return SCENARIOS[pillarId] || null;
}

function detectPillarId(data: PillarCoachingData): string {
    const label = data.pillarLabel.toLowerCase();
    if (label.includes('지향') || label.includes('vision')) return 'vision';
    if (label.includes('자아') || label.includes('identity') || label.includes('핵심')) return 'identity';
    if (label.includes('사회') || label.includes('social') || label.includes('환경')) return 'social';
    if (label.includes('배경') || label.includes('base') || label.includes('에너지')) return 'base';
    return 'vision'; // fallback
}

// ============== Main Component ==============
export default function NeuralCodeCoachingModal({ isOpen, onClose, data }: NeuralCodeCoachingModalProps) {
    const [currentState, setCurrentState] = useState<StateType>('dark');
    const [currentStep, setCurrentStep] = useState(-1); // -1 = awareness screen
    const [inputs, setInputs] = useState<Record<string, string>>({});
    const [showCompletion, setShowCompletion] = useState(false);
    const sessionStartRef = useRef<number>(Date.now());

    // ── 일진 기반 동적 질문 상태 ─────────────────────────
    const [dailyQuestions, setDailyQuestions] = useState<any>(null);
    const [dailyTheme, setDailyTheme] = useState<string>('');
    const [isLoadingDaily, setIsLoadingDaily] = useState(false);

    // ── 일진 질문 로드 (모달 열릴 때 자동 실행) ────────────
    useEffect(() => {
        if (!isOpen || !data) return;
        const pillarId = detectPillarId(data);
        setIsLoadingDaily(true);

        const clientDate = (() => {
            const d = new Date();
            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        })();

        fetch('/api/daily-questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pillarId, clientDate, sajuData: null }),
        })
        .then(r => r.json())
        .then(res => {
            if (res.success && res.questions) {
                setDailyQuestions(res.questions);
                setDailyTheme(res.questions.dayTheme || '');
            }
        })
        .catch(() => { /* fallback: 기존 SCENARIOS 사용 */ })
        .finally(() => setIsLoadingDaily(false));
    }, [isOpen, data]);


    // [DB] 코칭 로그 자동 저장
    const saveCoachingLog = useCallback(async (pillarId: string, state: StateType, codeName: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { console.log('⏭️ [Coaching] Guest user, skip save'); return; }

            const pillarLabels: Record<string, string> = { vision: '지향점', identity: '핵심 자아', social: '사회적 환경', base: '배경 에너지' };
            const baseCodes: Record<string, string> = { vision: '을미', identity: '신사', social: '계미', base: '경신' };

            const scanKey = `${pillarId}-${state}-0`;
            const syncKey = `${pillarId}-${state}-1`;
            const shiftKey = `${pillarId}-${state}-2`;

            const { error } = await supabase.from('coaching_logs').insert({
                user_id: user.id,
                pillar_type: pillarLabels[pillarId] || pillarId,
                pillar_id: pillarId,
                base_code: baseCodes[pillarId] || '',
                start_state: state,
                end_state: state === 'dark' ? 'neural' : state,
                code_name: codeName,
                scan_input: inputs[scanKey] || null,
                sync_input: inputs[syncKey] || null,
                shift_input: inputs[shiftKey] || null,
                completed: true,
                session_duration_ms: Date.now() - sessionStartRef.current,
            });

            if (error) console.error('❌ [Coaching] Save failed:', error.message);
            else console.log('✅ [Coaching] Log saved successfully');
        } catch (e) {
            console.warn('⚠️ [Coaching] Save error:', e);
        }
    }, [inputs, supabase]);

    const handleClose = useCallback(() => {
        setCurrentStep(-1);
        setCurrentState('dark');
        setShowCompletion(false);
        setInputs({});
        onClose();
    }, [onClose]);

    const handleStateChange = useCallback((state: StateType) => {
        setCurrentState(state);
        setCurrentStep(-1);
        setShowCompletion(false);
        sessionStartRef.current = Date.now(); // Reset timer on tab change
    }, []);

    const handleNext = useCallback(() => {
        if (showCompletion) {
            handleClose();
            return;
        }
        if (currentStep < 2) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Shift 완료 → DB 저장
            if (data) {
                const pId = detectPillarId(data);
                const code = currentState === 'dark' ? data.darkCode : currentState === 'neural' ? data.neuralCode : data.metaCode;
                saveCoachingLog(pId, currentState, code.name);
            }
            setShowCompletion(true);
        }
    }, [currentStep, showCompletion, handleClose, data, currentState, saveCoachingLog]);

    if (!data) return null;

    const pillarId = detectPillarId(data);
    const scenario = getScenario(pillarId);
    if (!scenario) return null;

    // ✅ 일진 기반 동적 질문이 있으면 우선 사용, 없으면 기존 SCENARIOS fallback
    const stateScenario = dailyQuestions?.[currentState]
        ? {
            awarenessQuestion: dailyQuestions[currentState].awarenessQuestion,
            slides: dailyQuestions[currentState].slides,
            completionMessage: dailyQuestions[currentState].completionMessage,
          }
        : scenario[currentState];
    const tab = TAB_CONFIG[currentState];
    const isAwareness = currentStep === -1;
    const currentCode = currentState === 'dark' ? data.darkCode : currentState === 'neural' ? data.neuralCode : data.metaCode;
    const inputKey = `${pillarId}-${currentState}-${currentStep}`;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
                    onClick={handleClose}
                >
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
                    <motion.div
                        initial={{ y: 100, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 100, opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative z-10 w-full max-w-md mx-4 mb-4 sm:mb-0 bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] max-h-[90vh] flex flex-col"
                    >
                        {/* Background Glow */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className={`absolute top-[-30%] right-[-30%] w-[80%] h-[80%] ${currentState === 'dark' ? 'bg-rose-900/20' : currentState === 'neural' ? 'bg-teal-900/20' : 'bg-indigo-900/20'
                                } blur-[100px] rounded-full transition-colors duration-1000 animate-pulse`} />
                        </div>

                        {/* 3-TAB STATE SELECTOR (Floating Pill Style) */}
                        <div className="relative z-10 flex p-1 mx-4 mt-5 mb-2 bg-black/40 rounded-2xl border border-white/5 flex-shrink-0 shadow-inner">
                            {(['dark', 'neural', 'meta'] as StateType[]).map((state) => {
                                const cfg = TAB_CONFIG[state];
                                const isActive = currentState === state;
                                return (
                                    <button key={state} onClick={() => handleStateChange(state)}
                                        className={`flex-1 py-2.5 text-center text-xs font-bold transition-all duration-300 rounded-xl ${isActive ? `${cfg.accentColor} bg-white/10 shadow-sm border border-white/10` : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'
                                            }`}>
                                        <span className="mr-1.5 opacity-90">{cfg.icon}</span>{cfg.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Header */}
                        <div className="relative z-10 px-6 pt-5 pb-3 flex justify-between items-start flex-shrink-0">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-white/90 font-bold text-lg tracking-tight">{data.pillarLabel}</span>
                                    {/* 일진 테마 배지 */}
                                    {dailyTheme && (
                                        <span className="text-[10px] font-bold text-cyan-300 bg-cyan-900/30 border border-cyan-400/30 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                                            오늘의 테마
                                        </span>
                                    )}
                                </div>
                                {dailyTheme ? (
                                    <p className="text-xs text-cyan-200/80 font-medium mb-1.5">✨ {dailyTheme}</p>
                                ) : null}
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 ${tab.accentColor}`}>
                                    <span className="text-xs">{tab.icon}</span>
                                    <span className="text-[11px] font-bold tracking-wide">{currentCode.name}</span>
                                </div>
                            </div>
                            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10 ml-2 backdrop-blur-md bg-white/5">
                                <X size={16} />
                            </button>
                        </div>


                        {/* Progress Bar */}
                        {!isAwareness && !showCompletion && (
                            <div className="relative z-10 px-6 pb-2 flex-shrink-0">
                                <div className="flex gap-2.5">
                                    {[0, 1, 2].map(i => (
                                        <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-black/40 border border-white/5 shadow-inner">
                                            <motion.div initial={{ width: 0 }} animate={{ width: i <= currentStep ? '100%' : '0%' }}
                                                transition={{ duration: 0.8, ease: "easeOut" }} className={`h-full rounded-full ${tab.dotColor} shadow-[0_0_8px_currentColor]`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Scrollable Content */}
                        <div className="relative z-10 overflow-y-auto flex-1">
                            <AnimatePresence mode="wait">
                                <motion.div key={`${currentState}-${currentStep}-${showCompletion}`}
                                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                                    transition={{ duration: 0.25 }} className="p-5">

                                    {/* === COMPLETION SCREEN === */}
                                    {showCompletion && (
                                        <div className="text-center py-4">
                                            <div className="text-5xl mb-4">✨</div>
                                            <div className={`bg-gradient-to-br ${tab.bgGradient} rounded-2xl p-5 border ${tab.borderColor}`}>
                                                <p className="text-gray-200 text-sm leading-relaxed font-medium">
                                                    {stateScenario.completionMessage}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* === AWARENESS SCREEN (Step 1: 상태 자각) === */}
                                    {isAwareness && !showCompletion && (
                                        <div className="px-1">
                                            <div className="text-center mb-6 mt-2">
                                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${tab.bgGradient} border ${tab.borderColor} mb-4 shadow-lg shadow-black/20`}>
                                                    <span className="text-2xl">{tab.icon}</span>
                                                </div>
                                                <h3 className="text-white/90 font-bold text-xl mb-2 tracking-tight">잠시 멈춰서,<br />내 마음을 들여다볼까요?</h3>
                                                <p className="text-gray-400 text-sm">심호흡을 하고, 아래 질문을 천천히 읽어보세요.</p>
                                            </div>
                                            
                                            <div className={`bg-gradient-to-br ${tab.bgGradient} rounded-[1.5rem] p-6 border ${tab.borderColor} shadow-inner relative overflow-hidden group`}>
                                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                                <p className="text-gray-200 text-[15px] leading-loose font-medium text-center break-keep">
                                                    "{stateScenario.awarenessQuestion}"
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* === SLIDE SCREENS (산파술 / 재귀적 / 알아차림의알아차림) === */}
                                    {!isAwareness && !showCompletion && stateScenario.slides[currentStep] && (
                                        <div className="px-1">
                                            <div className="flex flex-col items-center text-center mb-6 mt-2">
                                                <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/30 border border-white/5 mb-3 backdrop-blur-sm shadow-inner`}>
                                                    <span className="text-sm opacity-80">{stateScenario.slides[currentStep].stepIcon}</span>
                                                    <span className={`text-[11px] font-bold tracking-widest uppercase ${tab.accentColor}`}>
                                                        Step {currentStep + 1} · {stateScenario.slides[currentStep].stepLabel}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400/90 text-sm font-medium">{stateScenario.slides[currentStep].stepDesc}</p>
                                            </div>

                                            <div className={`bg-gradient-to-br ${tab.bgGradient} rounded-[1.5rem] p-6 border ${tab.borderColor} mb-5 shadow-inner relative`}>
                                                <p className="text-gray-200 text-[15px] leading-loose font-medium text-center break-keep">
                                                    "{stateScenario.slides[currentStep].question}"
                                                </p>
                                            </div>

                                            {/* AI Tip (Lightbulb) */}
                                            {stateScenario.slides[currentStep].tip && (
                                                <div className="flex gap-3 p-4 mb-5 bg-black/20 border border-white/5 rounded-2xl backdrop-blur-sm shadow-inner">
                                                    <Sparkles className="w-4 h-4 text-amber-300/80 shrink-0 mt-0.5" />
                                                    <p className="text-xs text-gray-400/90 leading-relaxed font-medium break-keep">
                                                        {stateScenario.slides[currentStep].tip}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Choices (Radio Buttons) */}
                                            {stateScenario.slides[currentStep].choices && stateScenario.slides[currentStep].choices!.length > 0 ? (
                                                <div className="space-y-2.5 mb-2">
                                                    <p className="text-[10px] text-gray-500/70 uppercase font-black ml-2 mb-2 tracking-widest">나의 마음 선택하기</p>
                                                    {stateScenario.slides[currentStep].choices!.map((choice: string, i: number) => {
                                                        const isSelected = inputs[inputKey] === choice;
                                                        return (
                                                            <button
                                                                key={i}
                                                                onClick={() => setInputs({ ...inputs, [inputKey]: choice })}
                                                                className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 text-left ${
                                                                    isSelected
                                                                        ? `bg-white/10 ${tab.borderColor} shadow-[0_0_15px_rgba(255,255,255,0.05)] scale-[1.02]`
                                                                        : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10'
                                                                }`}
                                                            >
                                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                                                    isSelected ? 'border-amber-400' : 'border-gray-600'
                                                                }`}>
                                                                    {isSelected && <motion.div initial={{scale:0}} animate={{scale:1}} className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                                                                </div>
                                                                <span className={`text-[13.5px] leading-relaxed font-medium ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                                                    {choice}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                /* Input Field (Fallback/Legacy) */
                                                <>
                                                    <textarea
                                                        value={inputs[inputKey] || ''}
                                                        onChange={(e) => setInputs({ ...inputs, [inputKey]: e.target.value })}
                                                        placeholder={stateScenario.slides[currentStep].inputPlaceholder}
                                                        className="w-full bg-black/30 border border-white/5 rounded-2xl p-5 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all shadow-inner"
                                                        rows={3}
                                                    />
                                                    <p className="text-gray-500/80 text-[11px] mt-3 text-center font-medium">✨ 마음에 떠오르는 단어들을 편안하게 적어보세요</p>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div className="relative z-10 px-6 pb-6 pt-4 flex justify-between items-center flex-shrink-0 border-t border-white/5 bg-slate-900/50 backdrop-blur-md">
                            <div>
                                {currentStep > -1 && !showCompletion && (
                                    <button onClick={() => setCurrentStep(prev => prev - 1)}
                                        className="px-4 py-3 rounded-xl text-gray-400 text-[13px] font-medium hover:bg-white/5 hover:text-white transition-all flex items-center gap-1">
                                        ← 이전
                                    </button>
                                )}
                            </div>
                            <button onClick={handleNext}
                                className={`flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-[14px] text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto bg-gradient-to-r ${showCompletion ? 'from-amber-500 to-orange-500' : `${tab.btnGradient}`
                                    }`}>
                                {showCompletion ? (<><Sparkles size={16} />여정 완료</>) :
                                    isAwareness ? (<>네, 치유 여정을 시작할게요 ✨</>) :
                                        currentStep === 2 ? (<><Sparkles size={16} />마음 전환 완료</>) :
                                            (<>다음으로<ChevronRight size={16} /></>)}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
