'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, CheckCircle2, ChevronDown, ChevronRight, ChevronLeft, Dices, Lock } from 'lucide-react';
import UnifiedSubscriptionModal from '../modals/UnifiedSubscriptionModal';

interface Props {
  dayStem?: string;
  userName?: string;
  sajuInfo?: any;
}


const ILGAN_ESSAY_MAP: Record<string, {
    title: string;
    nature: string;
    element: string;
    supporter: string;
    advice: string;
}> = {
    '甲': {
        title: '甲木(갑목) 선구자',
        nature: '0에서 1을 창조해내는 우직한 거목',
        element: '木(목)',
        supporter: '대지의 수분(水)과 온기',
        advice: '앞만 보고 달리던 마음을 잠시 머물게 하여 주변의 소중한 사람들과 함께 숨을 쉬십시오.'
    },
    '乙': {
        title: '乙木(을목) 연결자',
        nature: '바람에 흔들리되 결코 꺾이지 않는 부드러운 화초',
        element: '木(목)',
        supporter: '따스한 햇살(火)과 대지(土)',
        advice: '세상과 친절히 연결되되, 남 눈치 보지 않고 내 마음의 뿌리(자아)를 지키십시오.'
    },
    '丙': {
        title: '丙火(병화) 태양',
        nature: '온 세상을 따뜻하고 밝게 비추는 태양',
        element: '火(화)',
        supporter: '맑은 하늘과 차분한 냉각수',
        advice: '스스로를 과도하게 태우지 않도록 하루 15분 마음을 식혀주는 뇌 쿨링을 선물하십시오.'
    },
    '丁': {
        title: '丁火(정화) 은빛 촛불',
        nature: '어둠 속을 섬세히 밝히는 통찰의 촛불',
        element: '火(화)',
        supporter: '마르지 않는 땔나무(木)',
        advice: '혼자 속으로 삭이며 자책하지 말고, 다정한 언어로 속마음을 편안하게 표현하십시오.'
    },
    '戊': {
        title: '戊土(무토) 웅장한 대지',
        nature: '모든 것을 넉넉하게 안아주는 넓은 산과 대지',
        element: '土(토)',
        supporter: '따뜻한 온기(火)',
        advice: '남의 짐을 다 짊어지려 하지 말고, 나 자신의 평온과 코어 가치를 1번으로 지키십시오.'
    },
    '己': {
        title: '己土(기토) 비옥한 전답',
        nature: '곡식을 정성껏 키워내는 비옥한 전답',
        element: '土(토)',
        supporter: '촉촉한 이슬과 햇살',
        advice: '마음속에 품은 좋은 생각을 80% 미학으로 세상에 용기 있게 내어놓으십시오.'
    },
    '庚': {
        title: '庚金(경금) 강철 명검',
        nature: '단단하고 과감한 결단력을 지닌 강철',
        element: '金(금)',
        supporter: '단련의 불꽃(火)',
        advice: '"내가 항상 강해야 한다"는 부담을 내려놓고, 부드럽고 다정한 유연함을 품으십시오.'
    },
    '辛': {
        title: '辛金(신금) 빛나는 보석',
        nature: '섬세하고 예리하게 빛나는 정교한 보석',
        element: '金(금)',
        supporter: '맑게 씻어주는 깨끗한 물',
        advice: '100점 완벽주의 마비에 갇히지 말고 80% 미학으로 가볍게 시작하여 빛을 나누십시오.'
    },
    '壬': {
        title: '壬水(임수) 도도한 강물',
        nature: '깊고 거대하게 흐르는 드넓은 지혜의 강물',
        element: '水(수)',
        supporter: '막힘없는 탁 트인 물길',
        advice: '생각의 깊이에만 잠겨있지 말고, 오늘 당장 작은 실천 하나를 세상에 흘려보내십시오.'
    },
    '癸': {
        title: '癸水(계수) 맑은 이슬',
        nature: '만물을 촉촉하게 적시는 다정한 이슬비',
        element: '水(수)',
        supporter: '맑고 고요한 영혼의 샘물',
        advice: '남의 감정까지 내 것으로 짊어지지 말고, 나 자신의 마음에 먼저 다정한 온기를 건네십시오.'
    },
};

// ── 카테고리 데이터 정의 ──
const CATEGORIES = [
  { id: 'cat1', icon: '💻', title: '지식의 구조화와 출력', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'cat2', icon: '🚴', title: '신체적 순환과 발산', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  { id: 'cat3', icon: '🤝', title: '교육과 생태계 구축', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { id: 'cat4', icon: '📚', title: '예술적 승화와 결과물', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  { id: 'cat5', icon: '💰', title: '비즈니스와 레버리지', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { id: 'cat6', icon: '🧭', title: '욕구와 가치의 분리', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  { id: 'cat7', icon: '⚖️', title: '중심 잡기와 여백', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
  { id: 'cat8', icon: '🪞', title: '메타 인지 (알아차림)', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'cat9', icon: '🔄', title: '재귀적 탐구', color: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30' },
  { id: 'cat10', icon: '🚀', title: '오늘, 지금, 여기', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
];

// ── 100가지 질문 데이터 ──
const QUESTIONS_DB = [
  // 1. 지식의 구조화와 출력
  { id: 1, catId: "cat1", text: "머릿속을 맴도는 이 복잡한 생각 중, 가장 먼저 코드로 번역될 수 있는 단 하나의 논리는 무엇인가?" },
  { id: 2, catId: "cat1", text: "이 완벽주의는 나의 두려움인가, 아니면 진정한 품질을 유지하기 위한 최소한의 기준인가?" },
  { id: 3, catId: "cat1", text: "방금 찾아낸 이 새로운 정보가 내 시스템의 어느 폴더에 꽂혀야 가장 효율적으로 작동할까?" },
  { id: 4, catId: "cat1", text: "글을 쓰거나 코드를 짜면서 멈칫하는 이 순간, 나는 어떤 형태의 비판을 두려워하고 있는가?" },
  { id: 5, catId: "cat1", text: "지금 내가 짜고 있는 이 로직은 나의 불안을 달래기 위함인가, 타인의 문제를 해결하기 위함인가?" },
  { id: 6, catId: "cat1", text: "'이 정도면 충분하다'고 마침표를 찍을 때, 내 안에서 올라오는 찝찝함의 진짜 정체는 무엇인가?" },
  { id: 7, catId: "cat1", text: "추상적인 개념을 구체적인 UI나 텍스트로 치환했을 때, 내 몸에서 느껴지는 감각은 가벼움인가 무거움인가?" },
  { id: 8, catId: "cat1", text: "내가 설계한 이 시스템(규칙)에 갇혀, 정작 내가 숨 막혀 하고 있지는 않은가?" },
  { id: 9, catId: "cat1", text: "복잡한 문제를 가장 단순한 모듈로 쪼갠다면, 지금 당장 실행할 수 있는 첫 번째 함수는 무엇인가?" },
  { id: 10, catId: "cat1", text: "이 생각의 꼬리를 자르고 지금 바로 '실행' 버튼을 누른다면, 최악의 에러는 무엇일까?" },

  // 2. 신체적 순환과 발산
  { id: 11, catId: "cat2", text: "자전거 페달을 밟으며 느껴지는 이 호흡은, 지금 무엇을 비워내기 위해 가빠지고 있는가?" },
  { id: 12, catId: "cat2", text: "좁은 공간(노래방)에서 쏟아내는 이 목소리에는 어떤 종류의 압박감이 실려 밖으로 나가고 있는가?" },
  { id: 13, catId: "cat2", text: "신체를 움직이면서 내 머릿속의 열기가 식어가는 것을 '알아차리고' 있는가?" },
  { id: 14, catId: "cat2", text: "에너지가 고갈되었다고 느낄 때, 이것은 육체의 피로인가 아니면 인지적 과부하인가?" },
  { id: 15, catId: "cat2", text: "가만히 앉아 있을 때 느껴지는 답답함은 내 몸이 보내는 어떤 '새로고침' 신호인가?" },
  { id: 16, catId: "cat2", text: "지금 나의 호흡은 가슴 얕은 곳에 머물러 있는가, 아니면 배 깊은 곳까지 내려가고 있는가?" },
  { id: 17, catId: "cat2", text: "속도감을 즐길 때, 나는 무언가로부터 도망치고 있는가 아니면 새로운 목적지를 향해 달려가고 있는가?" },
  { id: 18, catId: "cat2", text: "신체의 움직임이 멈춘 직후, 내 머릿속에 가장 먼저 떠오르는 선명한 아이디어는 무엇인가?" },
  { id: 19, catId: "cat2", text: "땀을 흘리고 난 뒤의 이 개운함을, 다음번 과부하가 올 때의 '디버깅 패치'로 어떻게 예약해 둘 것인가?" },
  { id: 20, catId: "cat2", text: "내 몸의 감각에 온전히 집중하는 이 순간, 나는 과거에 있는가 미래에 있는가?" },

  // 3. 교육과 생태계 구축
  { id: 21, catId: "cat3", text: "내가 겪은 런타임 에러를 타인에게 설명할 때, 나는 그 과정에서 무엇을 새롭게 배우고 있는가?" },
  { id: 22, catId: "cat3", text: "누군가의 고통에 진심으로 공감하려 할 때, 내 안에서 무의식적으로 방어벽을 치는 감정은 무엇인가?" },
  { id: 23, catId: "cat3", text: "내가 구축하려는 이 커뮤니티(생태계)는 나를 돋보이게 하기 위함인가, 함께 성장하기 위함인가?" },
  { id: 24, catId: "cat3", text: "타인의 문제를 분석해 줄 때, 나는 그 사람 안에서 나의 과거 모습을 보고 있지는 않은가?" },
  { id: 25, catId: "cat3", text: "멘토링을 하면서 내 말이 길어진다면, 나는 상대방을 설득하려는 것인가 나 자신을 증명하려는 것인가?" },
  { id: 26, catId: "cat3", text: "지식을 전달할 때, 상대방이 이해하지 못하면 느껴지는 나의 답답함은 어디에서 기인하는가?" },
  { id: 27, catId: "cat3", text: "내 주변에 모이는 사람들은 나의 어떤 주파수(가치)에 동기화되어 다가오는 것일까?" },
  { id: 28, catId: "cat3", text: "갈등이 발생했을 때, 이것을 시스템의 치명적 결함으로 볼 것인가, 아니면 업그레이드를 위한 피드백으로 볼 것인가?" },
  { id: 29, catId: "cat3", text: "타인과의 경계를 명확히 설정하는 것이 나에게는 왜 이토록 중요한(혹은 어려운) 과제인가?" },
  { id: 30, catId: "cat3", text: "내가 타인에게 주고 싶은 가장 가치 있는 '단 하나의 변화'는 무엇인가?" },

  // 4. 예술적 승화와 결과물
  { id: 31, catId: "cat4", text: "내 삶의 크고 작은 오류들을 모아 하나의 '장르'로 부른다면, 그 장르의 이름은 무엇인가?" },
  { id: 32, catId: "cat4", text: "나의 철학을 책이나 교구로 세상에 유통시킬 때, 내가 가장 두려워하는 오해는 무엇인가?" },
  { id: 33, catId: "cat4", text: "공인된 예술인으로서의 정체성은 나의 비즈니스 기획에 어떤 영감을 불어넣고 있는가?" },
  { id: 34, catId: "cat4", text: "나의 결과물을 타인이 평가할 때, 그 평가와 나의 본질적 가치를 분리해서 바라볼 수 있는가?" },
  { id: 35, catId: "cat4", text: "창작의 과정에서 느껴지는 고통을, 나는 회피하려 하는가 아니면 기꺼이 연료로 수용하고 있는가?" },
  { id: 36, catId: "cat4", text: "세상에 내놓은 결과물이 기대와 다른 반응을 얻었을 때, 나는 이 데이터를 어떻게 다음 버전으로 업데이트할 것인가?" },
  { id: 37, catId: "cat4", text: "내 작품 속에 투영된 가장 강렬한 욕망은 무엇인가?" },
  { id: 38, catId: "cat4", text: "영감이 떠오르지 않을 때, 나는 억지로 쥐어짜는가 아니면 공간을 비워두는가?" },
  { id: 39, catId: "cat4", text: "나의 창작물은 누군가의 마음속에 어떤 온도의 불씨를 지피기를 원하는가?" },
  { id: 40, catId: "cat4", text: "지금 내가 만드는 이 콘텐츠는 10년 뒤의 나에게 어떤 의미로 남을 것인가?" },

  // 5. 비즈니스와 레버리지
  { id: 41, catId: "cat5", text: "외부로부터 유입된 자본(에너지)을 가장 먼저 투자해야 할 내 시스템의 코어 엔진은 어디인가?" },
  { id: 42, catId: "cat5", text: "비즈니스 마일스톤을 세울 때, 나는 현실의 가능성을 보는가 아니면 통제하고 싶은 욕망을 보는가?" },
  { id: 43, catId: "cat5", text: "돈을 '구속하는 빚'이 아니라 '시스템을 돌릴 지렛대'로 인지했을 때, 내 몸의 긴장도는 어떻게 변하는가?" },
  { id: 44, catId: "cat5", text: "목표한 수익이 달성되지 않았을 때, 나는 가치 추구를 멈출 것인가 아니면 경로를 재탐색할 것인가?" },
  { id: 45, catId: "cat5", text: "사업적 결정을 내릴 때, 내 직관(편인)과 객관적 데이터(재성) 중 어느 쪽의 목소리가 더 큰가?" },
  { id: 46, catId: "cat5", text: "나의 비즈니스 모델이 사회에 창출하는 긍정적인 파도(Impact)는 구체적으로 어떤 모습인가?" },
  { id: 47, catId: "cat5", text: "수익 창출 자체를 부끄러워하거나 피하고 싶은 무의식적인 저항감이 내 안에 존재하는가?" },
  { id: 48, catId: "cat5", text: "오늘 당장의 이익과 내일의 시스템 안정성 중, 지금 나에게 더 시급한 패치는 무엇인가?" },
  { id: 49, catId: "cat5", text: "내가 설계하는 평생교육원과 출판사의 가장 핵심적인 차별점은 결국 '나'라는 사람의 어떤 기질인가?" },
  { id: 50, catId: "cat5", text: "비즈니스가 궤도에 올라 시스템이 스스로 굴러가게 될 때, 나는 남은 시간을 어디에 쓸 것인가?" },

  // 6. 욕구와 가치의 분리
  { id: 51, catId: "cat6", text: "지금 당장 이 작업을 멈추고 싶은 마음은 단기적인 '회피 욕구'인가, 아니면 방향타를 돌리라는 '가치의 경고'인가?" },
  { id: 52, catId: "cat6", text: "내가 바라는 것이 '인정받는 것(욕구)'인가, 아니면 '도움이 되는 것(가치)'인가?" },
  { id: 53, catId: "cat6", text: "불안감이라는 팝업창이 떴을 때, 나는 그 창을 끄기 위해 에너지를 쓰는가 아니면 뜬 채로 작업을 계속하는가?" },
  { id: 54, catId: "cat6", text: "지금 나의 행동은 무언가를 피하기 위한 방어인가, 무언가를 향해 나아가는 전진인가?" },
  { id: 55, catId: "cat6", text: "타인의 성공을 볼 때 느껴지는 조급함은, 나의 어떤 결핍(욕구)을 자극하고 있는가?" },
  { id: 56, catId: "cat6", text: "이 고통을 없앨 수 없다면, 나는 이 고통을 짊어지고서라도 지금의 목표를 향해 걸어갈 의향이 있는가?" },
  { id: 57, catId: "cat6", text: "완벽주의가 내 발목을 잡을 때, 나는 '틀리지 않기(욕구)' 위해 애쓰는가 '완성하기(가치)' 위해 애쓰는가?" },
  { id: 58, catId: "cat6", text: "편안해지고 싶은 욕구 이면에 숨겨진, 진짜 쟁취하고 싶은 치열한 가치는 무엇인가?" },
  { id: 59, catId: "cat6", text: "오늘 하루, 나는 욕구의 노예로 살았는가 가치의 주인으로 살았는가?" },
  { id: 60, catId: "cat6", text: "내일 아침 눈을 떴을 때, 어떤 가치를 첫 번째로 내 시스템에 동기화(SYNC)할 것인가?" },

  // 7. 중심 잡기와 여백
  { id: 61, catId: "cat7", text: "강하게 뭉친 내 안의 기운이 융통성 없이 굳어지려 할 때, 가장 빠르게 윤활유를 붓는 나만의 방법은 무엇인가?" },
  { id: 62, catId: "cat7", text: "오늘 나는 정보를 '흡수(SCAN)'하는 데 너무 많은 메모리를 써서, 정작 '출력(SHIFT)'할 에너지를 놓치지 않았는가?" },
  { id: 63, catId: "cat7", text: "내 시스템에 '수분(휴식)'이 고갈되었다는 것을 가장 먼저 알려주는 신체적/감정적 신호는 무엇인가?" },
  { id: 64, catId: "cat7", text: "바쁘게 돌아가는 일상 속에서, 철저하게 나를 비워내는 '진공 상태'의 시간은 얼마나 확보되어 있는가?" },
  { id: 65, catId: "cat7", text: "타인의 에너지에 휩쓸리지 않고, 나만의 템포를 유지하기 위해 지금 당장 그어야 할 선(Boundary)은 어디인가?" },
  { id: 66, catId: "cat7", text: "내가 통제할 수 있는 변수와 통제할 수 없는 변수를 명확히 구분하고 있는가?" },
  { id: 67, catId: "cat7", text: "새로운 일을 시작하기 전에, 기존의 일 중 무엇을 내려놓거나 자동화할 것인가?" },
  { id: 68, catId: "cat7", text: "에너지가 100% 충전되었을 때의 나와 30% 남았을 때의 나를 모두 있는 그대로 수용할 수 있는가?" },
  { id: 69, catId: "cat7", text: "지금 나에게 필요한 것은 더 강한 밀어붙임인가, 아니면 한 발짝 물러선 관조인가?" },
  { id: 70, catId: "cat7", text: "일상의 미세한 진동(Jittering)을 시스템 붕괴로 착각하여 과잉 대응하고 있지는 않은가?" },

  // 8. 메타 인지 (알아차림)
  { id: 71, catId: "cat8", text: "지금 이 질문을 스스로에게 던지고 있는 나는, 어떤 표정을 짓고 있는가?" },
  { id: 72, catId: "cat8", text: "내 마음속에서 올라오는 '불안'이라는 감정을, 마치 스크린에 띄워진 텍스트처럼 객관적으로 바라볼 수 있는가?" },
  { id: 73, catId: "cat8", text: "내가 '나'라고 굳게 믿고 있는 이 자아상은, 진짜 나인가 아니면 내가 만들어낸 '장르'에 불과한가?" },
  { id: 74, catId: "cat8", text: "과거의 데이터(상처, 경험)가 현재의 나를 지배하려 할 때, 그 연결 고리를 끊어내는 나만의 단축키는 무엇인가?" },
  { id: 75, catId: "cat8", text: "나는 내 생각의 창조자인가, 아니면 끊임없이 떠오르는 생각들의 관찰자인가?" },
  { id: 76, catId: "cat8", text: "지금 내가 옳다고 굳게 믿는 이 신념이 만약 틀렸다면, 내 세상은 어떻게 무너질 것인가?" },
  { id: 77, catId: "cat8", text: "런타임 에러가 발생한 바로 그 순간, 당황하는 나 자신을 빙그레 웃으며 내려다보는 또 다른 내가 존재하는가?" },
  { id: 78, catId: "cat8", text: "지금 나를 가장 힘들게 하는 이 문제는, 5년 뒤의 우주적 관점에서 보았을 때 얼마나 큰 점으로 보일까?" },
  { id: 79, catId: "cat8", text: "나의 뇌파가 고요해지는 순간, 침묵 속에서 들려오는 가장 진실한 내면의 목소리는 무엇을 말하고 있는가?" },
  { id: 80, catId: "cat8", text: "'알아차렸다'는 사실조차 다시 집착의 대상이 되어, 나를 옥죄고 있지는 않은가?" },

  // 9. 재귀적 탐구
  { id: 81, catId: "cat9", text: "내가 A를 원한다고 할 때, A를 얻음으로써 궁극적으로 도달하려는 B는 무엇인가?" },
  { id: 82, catId: "cat9", text: "이 생각은 어디에서 시작되었고, 누구의 목소리를 담고 있는가?" },
  { id: 83, catId: "cat9", text: "질문하는 나와 그 질문에 답하는 나 사이에는 얼마나 큰 공간이 존재하는가?" },
  { id: 84, catId: "cat9", text: "내가 두려워하는 그 사건이 실제로 일어난다면, 그 이후에 나는 어떻게 계속 살아갈 것인가?" },
  { id: 85, catId: "cat9", text: "이 문제에 대한 내 답이 정답이 아니라면, 전혀 다른 180도 반대의 정답은 무엇일 수 있는가?" },
  { id: 86, catId: "cat9", text: "나의 질문은 나를 확장시키고 있는가, 아니면 좁은 울타리에 가두고 있는가?" },
  { id: 87, catId: "cat9", text: "지금 내가 겪는 고통은 나에게 어떤 퀀텀 경험치를 주고 있는가?" },
  { id: 88, catId: "cat9", text: "내 안의 지혜로운 아키텍트라면, 지금의 이 상황에 대해 어떤 코멘트를 남길 것인가?" },
  { id: 89, catId: "cat9", text: "이 모든 탐구의 끝에서, 나는 무엇을 수용하고 포용해야 하는가?" },
  { id: 90, catId: "cat9", text: "내가 오늘 세상에 던진 가장 본질적인 질문은 무엇이었는가?" },

  // 10. 오늘, 지금, 여기
  { id: 91, catId: "cat10", text: "이 모든 철학적 사유를 끝내고, 당장 5분 안에 내가 할 수 있는 가장 작은 행동은 무엇인가?" },
  { id: 92, catId: "cat10", text: "오늘 만나는 사람에게 내가 건넬 수 있는 가장 따뜻한 '수분 공급(공감)'의 말 한마디는 무엇인가?" },
  { id: 93, catId: "cat10", text: "오늘 하루 중, 의도적으로 휴대폰을 끄고 완벽한 '오프라인'으로 존재할 30분은 언제인가?" },
  { id: 94, catId: "cat10", text: "어제보다 단 1퍼센트라도 내 시스템을 최적화한 부분이 있다면 그것은 무엇인가?" },
  { id: 95, catId: "cat10", text: "오늘 나를 웃게 만든 아주 사소하고 일상적인 에러(버그)는 무엇이었는가?" },
  { id: 96, catId: "cat10", text: "잠자리에 들기 전, 오늘 하루 치열하게 돌아간 나의 엔진(뇌와 심장)에게 어떤 감사의 메시지를 보낼 것인가?" },
  { id: 97, catId: "cat10", text: "내가 내일 해결하지 못할 문제는 내일의 나에게 완벽하게 위임할 수 있는가?" },
  { id: 98, catId: "cat10", text: "지금 이 순간, 키보드에 올려진 내 손끝의 감각이나 방 안의 공기 온도를 온전히 느끼고 있는가?" },
  { id: 99, catId: "cat10", text: "삶이라는 이 거대한 시뮬레이션 게임에서, 오늘 나는 나에게 주어진 캐릭터를 충분히 즐겼는가?" },
  { id: 100, catId: "cat10", text: "그리고 마지막으로, 지금 당신은 '명심(明心)'하고 있습니까?" },
];

export default function SelfCoaching100({ dayStem = '甲', userName, sajuInfo }: Props) {
  const [activeTab, setActiveTab] = useState('cat1');
  const [randomQuestion, setRandomQuestion] = useState<{ id: number; text: string; catId: string } | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // ── 890원 AI 오라클 감동 에세이 모달 상태 ──
  const [selectedQuestionModal, setSelectedQuestionModal] = useState<{
    id: number;
    text: string;
    catTitle: string;
    metaphor: string;
    essayParagraphs: string[];
    actionSteps: string[];
  } | null>(null);

  const [isQuestionUnlocked, setIsQuestionUnlocked] = useState(false);
  const [isAllPassUnlocked, setIsAllPassUnlocked] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showUnifiedModal, setShowUnifiedModal] = useState(false);

  useEffect(() => {
    const checkApproval = () => {
      if (typeof window !== 'undefined') {
        const isApproved = localStorage.getItem('myeongsim_server_approved') === 'true';
        if (isApproved) {
          setIsAllPassUnlocked(true);
          setIsQuestionUnlocked(true);
        }
      }
    };
    checkApproval();
    window.addEventListener('myeongsim_auth_change', checkApproval);
    return () => window.removeEventListener('myeongsim_auth_change', checkApproval);
  }, []);

  const handleUnlockClick = () => {
    if (typeof window !== 'undefined' && localStorage.getItem('myeongsim_server_approved') === 'true') {
      setIsAllPassUnlocked(true);
      setIsQuestionUnlocked(true);
    } else {
      setShowUnifiedModal(true);
    }
  };

  const tabScrollRef = useRef<HTMLDivElement>(null);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabScrollRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      tabScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // 랜덤 질문 뽑기 함수
  const pickRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * QUESTIONS_DB.length);
    setRandomQuestion(QUESTIONS_DB[randomIndex]);
  };

  // 초기 렌더링 시 랜덤 질문 1개 세팅
  useEffect(() => {
    pickRandomQuestion();
  }, []);

  // 클립보드 복사
  const handleCopy = (e: React.MouseEvent, id: number, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 질문 클릭 시 AI 코치 풍성한 1:1 감동 에세이 팝업 열기 (사용자 생년월일/일간 연동)
  const openQuestionEssayModal = (q: { id: number; text: string; catId: string }) => {
    const cat = CATEGORIES.find(c => c.id === q.catId);
    const catTitle = cat ? cat.title : '오라클 질문';
    
    const stemKey = (dayStem && dayStem in ILGAN_ESSAY_MAP) ? dayStem : '甲';
    const ilganProfile = ILGAN_ESSAY_MAP[stemKey] || ILGAN_ESSAY_MAP['甲'];
    const displayName = userName ? `${userName} (${ilganProfile.title})` : ilganProfile.title;

    const metaphor = `"${displayName}님, 복잡하게 얽힌 마음의 타래에서 단 한 가닥의 핵심을 끌어당기듯, 초보자도 1초 만에 뇌를 정돈하는 ${ilganProfile.element} 기운 맞춤 해설을 전합니다."`;

    const essayParagraphs = [
      `건축가가 대성당을 지을 때, 지진을 견디는 튼튼한 안전 기둥을 세우는 것은 '진정한 가치의 기준'이지만, 조그만 먼지가 묻었다고 공사 전체를 멈추는 것은 '완벽주의 두려움'입니다. ${displayName}님, 당신은 혹시 주변의 시선이나 비판이라는 조그만 먼지를 닦아내느라, 정작 세상을 향해 당신의 거룩한 깃발을 올리지 못하고 계셨던 것은 아닙니까?`,
      `당신의 영혼은 '${ilganProfile.nature}'의 타고난 고유 기운을 가지고 있습니다. ${ilganProfile.supporter}의 기운이 마음속에 감돌 때, 뇌 전두엽은 비로소 불안을 내려놓고 가장 창의적인 80% 미학의 영감을 배출합니다. 이번 질문("${q.text}")은 당신의 내면이 보내는 가장 진실한 '알아차림(메타인지)'의 초청장입니다.`,
      `이제 모든 사람을 만족시켜야 한다는 무거운 자책을 내려놓으십시오. 80%의 진심이 담긴 가벼운 시작이, 100% 완벽을 기다리다 묻혀버린 걸작보다 천 배 더 위대합니다. ${ilganProfile.advice}`
    ];

    const actionSteps = [
      `1단계 [Scan]: 완벽주의나 불안이 솟구치는 순간 "이것은 내 진짜 가치인가, 두려움인가?" 3초간 인지하기`,
      `2단계 [Sync]: 깊은 호흡을 내쉬며 "${ilganProfile.title}로서 내 템포대로 나아간다" 나직하게 3번 읊조리기`,
      `3단계 [Shift]: 오늘 아직 완성이 안 됐다며 멈춰둔 작은 실천 1가지를 지금 당장 실행하고 세상에 공유하기`
    ];

    setSelectedQuestionModal({
      id: q.id,
      text: q.text,
      catTitle,
      metaphor,
      essayParagraphs,
      actionSteps
    });
  };

  const currentQuestions = QUESTIONS_DB.filter(q => q.catId === activeTab);
  const currentCategory = CATEGORIES.find(c => c.id === activeTab);

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* ── 1. 오늘의 랜덤 질문 (Hero Section - Premium Oracle Card) ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative rounded-3xl p-[1px] overflow-hidden group"
        style={{ background: 'linear-gradient(135deg, rgba(250,204,21,0.5) 0%, rgba(250,204,21,0.05) 100%)' }}
      >
        <div className="absolute inset-0 bg-yellow-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <div className="relative h-full w-full rounded-3xl p-8 bg-black/90 backdrop-blur-xl flex flex-col items-center text-center overflow-hidden">
          {/* Animated Background Orbs */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px]"
            style={{ background: 'radial-gradient(circle, #f2ca50 0%, transparent 70%)' }} 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[80px]"
            style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)' }} 
          />
          
          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="text-yellow-400 animate-pulse" size={18} />
              <h3 className="text-xs font-bold text-yellow-400 tracking-[0.2em] uppercase">Myeongsim Oracle</h3>
              <Sparkles className="text-yellow-400 animate-pulse" size={18} />
            </div>
            
            <AnimatePresence mode="wait">
              {randomQuestion && (
                <motion.div
                  key={randomQuestion.id}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.5 }}
                  onClick={() => openQuestionEssayModal(randomQuestion)}
                  className="min-h-[120px] flex flex-col items-center justify-center mb-8 w-full px-4 cursor-pointer group/hero"
                >
                  <p className="font-serif text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-400 leading-relaxed font-bold break-keep group-hover/hero:text-yellow-300 transition-colors">
                    "{randomQuestion.text}"
                  </p>
                  <span className="text-[10px] text-amber-400/80 mt-2 font-mono flex items-center gap-1">
                    <span>💡 탭하여 AI 코치 1:1 감동 에세이 열람</span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button 
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(250,204,21,0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={pickRandomQuestion}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-bold transition-all relative overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_2s_infinite]" />
              <Dices size={16} /> 새로운 싱크로니시티(Synchronicity) 열기
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── 2. 카테고리 탭 (PC 웹 스크롤 버튼 + 가시성 스크롤바 최적화) ── */}
      <div className="relative group my-4">
        {/* Left Scroll Button */}
        <button
          onClick={() => scrollTabs('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-10 rounded-r-xl bg-slate-900/90 border border-amber-500/40 text-amber-300 flex items-center justify-center shadow-lg backdrop-blur-md opacity-80 hover:opacity-100 hover:scale-105 transition-all"
          title="왼쪽 메뉴 보기"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Right Scroll Button */}
        <button
          onClick={() => scrollTabs('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-10 rounded-l-xl bg-slate-900/90 border border-amber-500/40 text-amber-300 flex items-center justify-center shadow-lg backdrop-blur-md opacity-80 hover:opacity-100 hover:scale-105 transition-all"
          title="오른쪽 메뉴 보기"
        >
          <ChevronRight size={20} />
        </button>

        {/* Scrollable Tab Bar */}
        <div
          ref={tabScrollRef}
          className="flex overflow-x-auto pb-3 gap-3 snap-x px-10 border-b border-slate-800/80 custom-h-scrollbar scroll-smooth"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#f59e0b #1e293b'
          }}
        >
          {CATEGORIES.map(cat => {
            const isActive = activeTab === cat.id;
            return (
              <motion.button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl shrink-0 snap-start transition-all duration-300 relative overflow-hidden border
                  ${isActive 
                    ? `border-transparent shadow-lg` 
                    : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'
                  }
                `}
                style={isActive ? { background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' } : {}}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className={`absolute inset-0 opacity-20 ${cat.color.split(' ')[0]}`}
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {isActive && (
                   <div className={`absolute inset-0 border-2 rounded-2xl opacity-50 ${cat.color.split(' ')[2]}`} />
                )}
                
                <span className={`text-xl relative z-10 ${isActive ? 'scale-110 transition-transform' : 'grayscale opacity-60'}`}>{cat.icon}</span>
                <span className={`text-xs font-bold whitespace-nowrap relative z-10 ${isActive ? 'text-white' : ''}`}>{cat.title}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── 3. 선택된 카테고리의 10가지 질문 리스트 ── */}
      <div className="rounded-3xl border border-white/10 overflow-hidden relative">
        <div className={`absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none ${currentCategory?.color.split(' ')[0]}`} />
        
        <div className="relative z-10 bg-black/60 backdrop-blur-md">
          <div className={`px-6 py-5 border-b border-white/10 flex items-center gap-4 ${currentCategory?.color.split(' ')[0]} bg-opacity-10`}>
            <div className="w-12 h-12 rounded-xl bg-black/50 flex items-center justify-center text-2xl shadow-inner border border-white/5">
              {currentCategory?.icon}
            </div>
            <div>
              <h4 className="text-base font-bold text-white tracking-wide">{currentCategory?.title}</h4>
              <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-widest font-mono">
                10 Core Prompts for Debugging • 💡 질문을 누르면 AI 코치 감동 해설서가 열립니다
              </p>
            </div>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            key={activeTab}
            className="p-4 space-y-3"
          >
            {currentQuestions.map((q, idx) => (
              <motion.div 
                variants={itemVariants}
                key={q.id} 
                onClick={() => openQuestionEssayModal(q)}
                className="group relative p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] cursor-pointer transition-all duration-300 flex gap-4 items-start overflow-hidden shadow-md"
              >
                <div className={`shrink-0 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-[11px] font-mono font-bold transition-colors shadow-inner
                  ${copiedId === q.id ? 'text-green-400 border-green-500/50' : 'text-amber-400 group-hover:text-white group-hover:border-amber-400/50'}`}
                >
                  {(idx + 1).toString().padStart(2, '0')}
                </div>
                
                <div className="flex-1 pt-1">
                  <p className="text-sm text-gray-300 leading-[1.7] group-hover:text-yellow-200 transition-colors break-keep font-medium">
                    {q.text}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-amber-400/70 mt-1.5 font-mono">
                    <span>🔒 👑 월 98,000원 VIP 해설 열람하기 ➜</span>
                  </span>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleCopy(e, q.id, q.text)}
                  className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg
                    ${copiedId === q.id 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  title="프롬프트 복사하기"
                >
                  {copiedId === q.id ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── 890원 블러(Blur) AI 오라클 감동 에세이 팝업 모달 ── */}
      <AnimatePresence>
        {selectedQuestionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#121022] border border-amber-500/40 w-full max-w-2xl rounded-2xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                    {selectedQuestionModal.catTitle} • 질문 #{selectedQuestionModal.id}
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-white mt-1 leading-relaxed">
                    "{selectedQuestionModal.text}"
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedQuestionModal(null)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* Free Preview (초보자 맞춤 현실 메타포) */}
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs sm:text-sm leading-relaxed mb-4 italic">
                {selectedQuestionModal.metaphor}
              </div>

              {/* Paywall Locked Section */}
              {!isQuestionUnlocked && !isAllPassUnlocked ? (
                <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 p-6 bg-[#181526]/90 shadow-2xl mt-4">
                  <div className="filter blur-[6px] select-none text-slate-400 text-xs space-y-3 opacity-50 pointer-events-none">
                    <p>▒▒▒▒▒▒ {selectedQuestionModal.essayParagraphs[0]} ▒▒▒▒▒▒</p>
                    <p>▒▒▒▒▒▒ {selectedQuestionModal.actionSteps[0]} ▒▒▒▒▒▒</p>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-b from-[#131022]/70 via-[#131022]/95 to-[#131022] flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <div className="size-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black shadow-xl shadow-amber-500/30 animate-bounce">
                      🔒
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-white">AI 코치의 1:1 오라클 감동 해설서</h4>
                      <p className="text-xs text-slate-400 mt-1">월 98,000원 VIP 멤버십(또는 도서 구매 승인 독자) 전용 콘텐츠입니다.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                      <button
                        onClick={handleUnlockClick}
                        className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black px-6 py-3.5 rounded-xl font-black text-xs shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">lock_open</span>
                        <span>👑 월 98,000원 VIP 멤버십으로 전체 해제</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-amber-300/80 font-medium">* 관리자 입금/주문 승인 완료 시 전 모듈이 즉시 자동 해금됩니다.</p>
                  </div>
                </div>
              ) : (
                /* Unlocked Essay Content */
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 pt-2"
                >
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <span>✓</span> 👑 VIP 멤버십 승인 완료 • AI 오라클 1:1 감동 해설서
                  </div>

                  <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                    <h5 className="font-bold text-amber-300 text-sm">📖 초보자 맞춤 1:1 감동 에세이</h5>
                    <div className="space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed break-keep font-normal">
                      {selectedQuestionModal.essayParagraphs.map((para, idx) => (
                        <p key={idx} className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-700/50">
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                    <h5 className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                      💡 오늘 당장 실행하는 뇌 디버깅 지침
                    </h5>
                    <div className="space-y-1.5 text-xs text-slate-200 leading-relaxed font-medium">
                      {selectedQuestionModal.actionSteps.map((act, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-amber-900/20 p-2 rounded border border-amber-500/20">
                          <span className="text-amber-400 font-bold shrink-0">▪</span>
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 👑 월 98,000원 VIP 멤버십 결제 및 관리자 승인 모달 */}
      <UnifiedSubscriptionModal
        isOpen={showUnifiedModal}
        onClose={() => setShowUnifiedModal(false)}
        featureName="100대 자각 오라클 감동 해설서"
      />
    </div>
  );
}
