'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, TrendingUp, GitMerge, Fingerprint, X, ChevronRight, Sparkles, BookOpen } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import DeepHealingGuideModal from './DeepHealingGuideModal';
import HealingArchiveModal from './HealingArchiveModal';
import ZeroPointDashboard from './ZeroPointDashboard';

const zeroPointData = [
  { name: '집착도', uv: 30, fill: '#ef4444' }, // Red
  { name: '평온도', uv: 85, fill: '#10b981' }, // Emerald
];

interface CoachingData {
  desc: string;
  socratic: string;
  recursive: string;
  meta: string;
  pureAwareness?: string;
  awareness: string;
}

interface PairData {
  code: string;
  reality: string;
  theme: { bg: string; border: string; textTitle: string; textLight: string; textDark: string; dot: string; };
  coaching: CoachingData;
}

const pairsData: PairData[] = [
  {
    code: '사랑받지 못할 두려움', reality: '타인의 비방/무시',
    theme: { bg: 'bg-fuchsia-950/40', border: 'border-fuchsia-500/20', textTitle: 'text-fuchsia-300', textLight: 'text-fuchsia-100', textDark: 'text-fuchsia-400/70', dot: 'bg-fuchsia-400' },
    coaching: {
      desc: '사랑받고 싶다는 강박은 역설적으로 스스로를 사랑받을 자격이 없다고 믿는 결핍에서 출발합니다. 내면의 결핍 주파수가 외부로 방사되어, 나를 무시하고 비방하는 타인을 현실 매트릭스에 창조해냅니다.',
      socratic: '타인이 나를 무시한다고 느낄 때, 마음속 가장 깊은 곳에서 나를 제일 먼저 무시하고 있는 사람은 누구인가요?',
      recursive: '그들에게 사랑을 받아야만 내가 가치 있는 존재라는 그 조건부 공식은, 과거 어느 순간에 당신의 시스템에 설치된 것인가요?',
      meta: "타인의 인정을 구걸하며 요동치는 그 감정을 객관적으로 알아차리세요.",
      pureAwareness: "그 모든 끄달림을 고요히 비추고 있는 '텅 빈 알아차림' 그 자체를 자각해 보세요.",
      awareness: '사랑받지 못할까 봐 떨고 있는 그 두려움의 파동을 텅 빈 마음으로 온전히 느껴보세요. 그 떨림이 녹아 사라지면, 굳이 애쓰지 않아도 이미 온전한 자신(Zero Point)을 자각하게 되며, 타인의 인정도 자연스레 따라옵니다.'
    }
  },
  {
    code: '결핍/가난에 대한 공포', reality: '계속되는 뜻밖의 지출',
    theme: { bg: 'bg-cyan-950/40', border: 'border-cyan-500/20', textTitle: 'text-cyan-300', textLight: 'text-cyan-100', textDark: 'text-cyan-400/70', dot: 'bg-cyan-400' },
    coaching: {
      desc: '돈을 잃을까 봐 두려워 꽉 쥐려는 에고의 에너지는 극심한 \'결핍 상태\'를 시스템에 각인시킵니다. 우주는 이 결핍의 에너지를 증명하기 위해, 돈이 빠져나가는 사고나 지출을 정반대의 짝으로 끊임없이 투사합니다.',
      socratic: '돈이 줄어드는 숫자를 볼 때 느껴지는 그 공포감은, 정말 통장의 문제인가요 아니면 당신의 생존이 위협받는다는 원초적 두려움인가요?',
      recursive: '돈이 있어야만 안전하다는 믿음이 무너졌을 때, 당신에게 남는 본질적인 존재 가치는 무엇인가요?',
      meta: "돈에 집착하며 벌벌 떠는 에고를 객관적으로 알아차리세요.",
      pureAwareness: "그 두려움마저 품고 있는 내면의 투명하고 무한한 '배경(알아차림)'으로 물러나 보세요.",
      awareness: '가난해질지도 모른다는 밑바닥의 끔찍한 공포 에너지를 도망치지 말고 그대로 마주하세요. 공포감이 완전히 연소되어 사라지면, 통장의 숫자와 상관없이 당신은 이미 무한한 풍요의 근원(Zero Point)과 연결됩니다.'
    }
  },
  {
    code: '완벽해야 한다는 강박', reality: '잦은 실수와 타인의 질책',
    theme: { bg: 'bg-amber-950/40', border: 'border-amber-500/20', textTitle: 'text-amber-300', textLight: 'text-amber-100', textDark: 'text-amber-400/70', dot: 'bg-amber-400' },
    coaching: {
      desc: '완벽하려는 통제는 사실 \'실수하면 버림받을 것\'이라는 강한 수치심을 숨기기 위한 방어기제입니다. 당신이 완벽의 틀을 강하게 조일수록, 시스템은 그 억압을 풀기 위해 어처구니없는 실수와 거센 질책을 창조해냅니다.',
      socratic: '단 한 번의 실수도 허용하지 않고 스스로를 채찍질할 때, 당신의 몸과 마음은 지금 안전하다고 느끼고 있나요?',
      recursive: '완벽하지 않은 나를 타인이 비난할 것이라는 생각은 사실인가요? 아니면 당신 스스로가 자신을 비난하고 있는 것의 뼈아픈 투영인가요?',
      meta: "실수를 두려워하는 마음을 객관적으로 알아차리세요.",
      pureAwareness: "그 알아차림마저 비추고 있는 아무런 경계 없는 '순수한 의식' 그 자체에 머물러 보세요.",
      awareness: '완벽하지 않으면 큰일 날 것 같은 팽팽한 긴장감과 목구멍의 조임을 있는 그대로 느껴줍니다. 그 수치심의 에너지가 증발하면, 있는 그대로의 불완전함을 수용하는 진정한 완벽함(Zero Point)에 도달합니다.'
    }
  },
  {
    code: '살찌는 것에 대한 공포', reality: '통제 불능의 폭식/요요',
    theme: { bg: 'bg-rose-950/40', border: 'border-rose-500/20', textTitle: 'text-rose-300', textLight: 'text-rose-100', textDark: 'text-rose-400/70', dot: 'bg-rose-400' },
    coaching: {
      desc: '자신의 몸을 적으로 간주하고 먹는 것을 억누를 때, 몸의 생존 본능은 극심한 기아 상태로 착각합니다. 다이어트 강박이 심해질수록 무의식은 억눌린 결핍을 보상하기 위해 폭식이라는 폭주 프로그램을 강제로 실행합니다.',
      socratic: '음식을 참아내며 체중계의 숫자에 집착할 때, 당신이 진짜로 갈구하고 있는 것은 날씬한 몸인가요, 아니면 있는 그대로 사랑받는 느낌인가요?',
      recursive: '내 몸을 통제하고 학대해야만 아름다워진다는 폭력적인 알고리즘은 도대체 누구의 목소리에서 시작되었나요?',
      meta: "음식 앞에서 갈망과 죄책감을 오가는 뇌의 작용을 객관적으로 알아차리세요.",
      pureAwareness: "그 요동침을 허공처럼 묵묵히 담아내고 있는 '텅 빈 그것'을 인식하세요.",
      awareness: '거울 속 자신의 몸을 보며 느끼는 비참함, 음식을 향한 갈망을 100% 허용하고 느껴줍니다. 이 감정이 텅 빈 마음에 녹아들면 강박이 사라지고 몸은 가장 자연스러운 균형(Zero Point)을 저절로 되찾습니다.'
    }
  },
  {
    code: '배신당할 것에 대한 불안', reality: '믿었던 사람의 거짓말',
    theme: { bg: 'bg-emerald-950/40', border: 'border-emerald-500/20', textTitle: 'text-emerald-300', textLight: 'text-emerald-100', textDark: 'text-emerald-400/70', dot: 'bg-emerald-400' },
    coaching: {
      desc: '의심하고 불안해하는 마음은 끊임없이 타인의 일거수일투족을 통제하려 듭니다. 이 숨 막히는 의심의 에너지는 상대방의 무의식에 저항감을 일으켜, 결국 거짓말을 하거나 내 곁을 떠나게 만드는 현실을 스스로 창조합니다.',
      socratic: '상대방이 나를 배신할까 봐 두려워 끊임없이 확인하려 할 때, 당신은 상대방을 사랑하고 있는 것인가요, 아니면 소유하고 있는 것인가요?',
      recursive: '결코 상처받지 않으려고 마음의 벽을 높이 쌓을수록, 당신은 누군가와 진정으로 연결될 수 있다고 믿으시나요?',
      meta: "'혹시?' 하며 의심하는 불안한 생각을 객관적으로 알아차리세요.",
      pureAwareness: "생각의 뒤편에 언제나 고요하게 현존하는 '알아차림의 빛'으로 시선을 돌리세요.",
      awareness: '누군가에게 버려지고 배신당해 혼자 남겨질 것 같은 끔찍한 고립감을 피하지 말고 심장으로 느껴줍니다. 그 공포가 완전히 타들어가면, 타인의 행동에 휘둘리지 않는 굳건한 평화(Zero Point)가 찾아옵니다.'
    }
  },
  {
    code: '통제하려는 억압적 에고', reality: '내 맘대로 안되는 인연',
    theme: { bg: 'bg-indigo-950/40', border: 'border-indigo-500/20', textTitle: 'text-indigo-300', textLight: 'text-indigo-100', textDark: 'text-indigo-400/70', dot: 'bg-indigo-400' },
    coaching: {
      desc: '세상과 타인을 내 뜻대로 통제해야만 안전하다고 믿는 것은 에고의 흔한 착각입니다. 당신이 억압의 틀을 세게 쥘수록 시스템은 균형을 맞추기 위해, 당신을 절대 따르지 않는 반항적인 자녀나 배우자를 눈앞에 투사합니다.',
      socratic: '타인이 내 방식대로 행동해야만 직성이 풀리는 그 통제욕의 이면에는, 세상이 내 맘대로 되지 않으면 무너질 것 같은 나약함이 숨어있지 않나요?',
      recursive: '내가 옳다는 굳건한 신념을 내려놓았을 때 발생할 최악의 일은 무엇이며, 그것은 정말로 당신을 파괴할 수 있나요?',
      meta: "내 뜻대로 되지 않아 분노하는 감정을 객관적으로 알아차리세요.",
      pureAwareness: "그 분노를 알고 있는 그 '텅 빈 자리'는 결코 훼손되지 않음을 자각하세요.",
      awareness: '통제력을 잃고 속수무책으로 당할 것 같은 내면의 무기력함과 두려움을 직면하세요. 모든 통제를 포기하고 텅 빈 마음에 내맡길 때, 역설적으로 모든 것이 가장 조화롭게 맞물려 돌아가는 기적(Zero Point)을 체험합니다.'
    }
  },
  {
    code: '무능력함에 대한 수치심', reality: '끊임없는 경쟁과 압박',
    theme: { bg: 'bg-orange-950/40', border: 'border-orange-500/20', textTitle: 'text-orange-300', textLight: 'text-orange-100', textDark: 'text-orange-400/70', dot: 'bg-orange-400' },
    coaching: {
      desc: '자신이 쓸모없고 무능하다는 깊은 수치심을 감추기 위해, 에고는 끊임없이 무언가를 증명하려 듭니다. 우주는 이 증명욕에 부응하여, 당신을 쉴 틈 없는 경쟁과 성과를 강요하는 숨 막히는 매트릭스로 몰아넣습니다.',
      socratic: '어떤 성과도 내지 않고 그저 방구석에 누워만 있는 당신을 상상할 때, 당신은 여전히 숨 쉴 자격이 있는 존재라고 느껴지나요?',
      recursive: '남보다 뒤처지면 끝장난다는 그 레이스의 결승점에는 도대체 무엇이 기다리고 있기에 평생을 고통스럽게 달려야 하나요?',
      meta: "도태될까 봐 초조해하는 마음을 객관적으로 알아차리세요.",
      pureAwareness: "이름도 형체도 없지만 모든 것을 완벽하게 알고 있는 '자각' 그 자체를 느껴보세요.",
      awareness: '세상에서 도태되어 아무런 가치도 없는 존재처럼 버려질 것 같은 끔찍한 수치심을 온전히 맛보세요. 그 에너지가 정화되면, 무엇을 증명할 필요 없이 존재하는 것만으로 완벽한 자유(Zero Point)를 누리게 됩니다.'
    }
  },
  {
    code: '고립되고 버려질 두려움', reality: '피상적이고 피곤한 관계',
    theme: { bg: 'bg-teal-950/40', border: 'border-teal-500/20', textTitle: 'text-teal-300', textLight: 'text-teal-100', textDark: 'text-teal-400/70', dot: 'bg-teal-400' },
    coaching: {
      desc: '혼자 남겨지는 것을 두려워하여 무리하게 관계에 집착하면, 에고는 타인의 비위를 맞추느라 자신을 잃어버립니다. 억지로 이어진 주파수는 에너지를 급격히 고갈시키고 피상적이며 공허한 인간관계를 창조합니다.',
      socratic: '무리에 속하기 위해 가짜 미소를 짓고 있는 당신은, 무리에 섞여 있을 때 정말로 내면이 외롭지 않다고 느끼나요?',
      recursive: '혼자가 되는 것이 두려워 타인에게 맞추는 행동은, 결국 나 자신이 나와 함께 있는 것을 견디지 못하기 때문이 아닌가요?',
      meta: "연결되려 발버둥 치는 조급함을 객관적으로 알아차리세요.",
      pureAwareness: "이미 온 우주와 연결되어 있는 고요한 '관찰 의식' 속으로 편안히 녹아드세요.",
      awareness: '우주 공간에 홀로 남겨진 듯한 처절한 고립감과 외로움을 있는 그대로 받아들이세요. 외로움의 불꽃이 완전히 타들어가면, 텅 빈 고요 속에서 우주 전체와 하나가 되어 있는 절대적 연결감(Zero Point)을 깨닫게 됩니다.'
    }
  },
  {
    code: '병들고 아플 것에 대한 공포', reality: '원인 모를 통증과 건강 염려',
    theme: { bg: 'bg-pink-950/40', border: 'border-pink-500/20', textTitle: 'text-pink-300', textLight: 'text-pink-100', textDark: 'text-pink-400/70', dot: 'bg-pink-400' },
    coaching: {
      desc: '몸에 조금만 이상이 생겨도 큰 병일 것이라 두려워하는 것은 생존에 대한 지독한 집착입니다. 당신이 병에 집중하고 에너지를 쏟을수록, 무의식은 통증을 과장하고 실제로 몸을 긴장시켜 면역력을 떨어뜨립니다.',
      socratic: '건강 정보와 영양제에 집착할수록 당신의 마음은 더 건강해지나요, 아니면 더 큰 불안에 휩싸이나요?',
      recursive: '내 몸이 완벽하게 건강해야만 삶이 안전할 거라는 그 통제 욕구는 언제부터 당신을 지배했나요?',
      meta: "몸의 감각에 소스라치게 놀라는 생각들을 객관적으로 알아차리세요.",
      pureAwareness: "그 생각들이 피고 지는 텅 빈 스크린(알아차림) 그 자체를 응시하세요.",
      awareness: '병들어 고통 속에서 죽어갈 것 같은 원초적인 두려움을 도망치지 말고 느껴줍니다. 공포가 소멸된 자리에 몸을 향한 완전한 수용이 일어날 때, 치유 메커니즘(Zero Point)이 비로소 작동하기 시작합니다.'
    }
  },
  {
    code: '구원자 증후군 (오지랖)', reality: '의존적이고 사고치는 주변인',
    theme: { bg: 'bg-violet-950/40', border: 'border-violet-500/20', textTitle: 'text-violet-300', textLight: 'text-violet-100', textDark: 'text-violet-400/70', dot: 'bg-violet-400' },
    coaching: {
      desc: '타인을 구원하고 도와야만 스스로 가치 있다고 느끼는 에고는, 자신을 돋보이게 해줄 \'구제불능의 피해자\'를 끊임없이 끌어당깁니다. 결국 당신은 그들의 문제를 대신 떠안고 착취당하게 됩니다.',
      socratic: '당신이 그들을 돕지 않았을 때 느껴지는 죄책감은, 정말 그들을 위한 것인가요 아니면 나쁜 사람이 되기 싫은 나를 위한 것인가요?',
      recursive: '누군가를 책임지지 않으면 내 존재 가치가 없다는 신념은 어린 시절 어떤 상처에서 기인했나요?',
      meta: "남의 문제에 과몰입하는 감정을 객관적으로 알아차리세요.",
      pureAwareness: "그 모든 드라마 밖에서 고요하게 침묵하고 있는 '본래의 나(순수 의식)'를 자각하세요.",
      awareness: '내가 도와주지 않아 그들이 파멸할 때 느껴지는 죄책감과 무가치함을 있는 그대로 직면하세요. 모든 책임감을 내려놓을 때, 각자의 삶은 각자의 카르마대로 온전하다는 진리(Zero Point)를 깨닫습니다.'
    }
  },
  {
    code: '늙고 추해지는 것에 대한 공포', reality: '급격한 노화 체감과 외모 강박',
    theme: { bg: 'bg-fuchsia-950/40', border: 'border-fuchsia-500/20', textTitle: 'text-fuchsia-300', textLight: 'text-fuchsia-100', textDark: 'text-fuchsia-400/70', dot: 'bg-fuchsia-400' },
    coaching: {
      desc: '영원한 젊음에 대한 집착은 거스를 수 없는 자연의 법칙과 싸우는 가장 피곤한 저항입니다. 주름 하나에 연연하며 외모를 통제하려 할수록, 그 스트레스 호르몬이 역설적으로 노화를 더 빠르게 촉진시킵니다.',
      socratic: '젊음과 아름다움이 사라진 당신은 세상에서 쓸모없는 존재인가요? 껍데기를 벗겨내면 무엇이 남습니까?',
      recursive: '아름다워야만 대접받는다는 그 얕은 신념은 당신의 영혼을 풍요롭게 하나요, 아니면 갉아먹고 있나요?',
      meta: "노화를 두려워하는 에고를 객관적으로 알아차리세요.",
      pureAwareness: "나고 늙고 죽는 현상 너머에 결코 변하지 않는 영원한 '알아차림의 본질'에 접속하세요.",
      awareness: '젊음을 잃고 추하게 늙어가 아무도 찾지 않게 될 것 같은 처절한 두려움을 100% 느껴줍니다. 그 공포를 수용하면, 세월이 흘러도 변하지 않는 내면의 절대적 아름다움(Zero Point)이 빛나기 시작합니다.'
    }
  },
  {
    code: '무시당할까 두려운 지식 강박', reality: '결정적 순간의 어리석은 판단',
    theme: { bg: 'bg-cyan-950/40', border: 'border-cyan-500/20', textTitle: 'text-cyan-300', textLight: 'text-cyan-100', textDark: 'text-cyan-400/70', dot: 'bg-cyan-400' },
    coaching: {
      desc: '자신이 똑똑하다는 것을 증명하기 위해 끊임없이 지식을 채우고 가르치려 드는 에고입니다. 우주는 이 오만함을 꺾기 위해, 그 알량한 논리로는 절대 해결할 수 없는 복잡한 문제나 어처구니없는 실수를 투사합니다.',
      socratic: '당신이 모른다는 사실을 들켰을 때, 세상이 무너질 것 같은 그 공포는 어디서 오는 것인가요?',
      recursive: '어릴 적 바보 취급을 받았던, 혹은 똑똑해야만 칭찬받았던 그 최초의 기억은 언제인가요?',
      meta: "아는 척하며 우월감을 느끼려는 얕은 마음을 객관적으로 알아차리세요.",
      pureAwareness: "지식의 유무와 상관없이 스스로 온전한 '텅 빈 앎(Knowing)' 그 자체를 느껴보세요.",
      awareness: '무식함이 탄로 나 모두에게 조롱받을 것 같은 강렬한 수치심을 있는 그대로 맛보세요. 아는 척을 모두 내려놓고 "모른다"를 수용할 때, 무한한 지혜의 근원(Zero Point)과 비로소 연결됩니다.'
    }
  },
  {
    code: '피해자가 되기 싫은 강한 방어', reality: '어김없이 등장하는 악질 가해자',
    theme: { bg: 'bg-rose-950/40', border: 'border-rose-500/20', textTitle: 'text-rose-300', textLight: 'text-rose-100', textDark: 'text-rose-400/70', dot: 'bg-rose-400' },
    coaching: {
      desc: '\'나는 절대 당하지 않겠다\'며 날을 세우고 방어벽을 치는 것은, 무의식에 \'나는 언제든 공격받을 수 있는 약자다\'라는 코드를 심는 행위입니다. 시스템은 당신의 방어기제를 써먹게 해주기 위해 어김없이 가해자를 보냅니다.',
      socratic: '당신이 누군가에게 부당하게 공격받을까 봐 24시간 긴장하고 있을 때, 그 전쟁은 현실입니까 당신의 머릿속입니까?',
      recursive: '내가 억울함을 당하면 내 존재 전체가 부정당한다고 느끼는 그 극단적인 피해 의식은 누구의 것인가요?',
      meta: "누군가의 사소한 말 한마디에도 가시를 세우는 뇌의 비상벨을 객관적으로 알아차리세요.",
      pureAwareness: "그 비상벨 소리마저 고요하게 담아내는 '침묵의 배경'을 자각하세요.",
      awareness: '철저하게 짓밟히고 억울함을 호소할 데조차 없는 그 비참한 패배감을 허용하고 온몸으로 겪어냅니다. 방패를 완전히 내려놓을 때, 누구도 나를 상처 입힐 수 없는 진정한 무적 상태(Zero Point)가 됩니다.'
    }
  },
  {
    code: '특별해져야 한다는 나르시시즘', reality: '철저한 무관심과 평범함의 굴레',
    theme: { bg: 'bg-amber-950/40', border: 'border-amber-500/20', textTitle: 'text-amber-300', textLight: 'text-amber-100', textDark: 'text-amber-400/70', dot: 'bg-amber-400' },
    coaching: {
      desc: '나는 남들과 다르며 특별 대우를 받아야 한다는 우월주의는, 사실 철저히 평범해지는 것에 대한 수치심을 덮기 위한 포장지입니다. 우주는 이 에고를 산산조각 내기 위해, 철저한 무관심과 당신을 엑스트라 취급하는 현실을 창조합니다.',
      socratic: '당신이 아무 특별한 것 없이 수많은 군중 속의 먼지 같은 존재라면, 당신의 삶은 의미가 없나요?',
      recursive: '남들 위에 군림해야만 스스로 가치 있다고 느끼는 그 우월감은, 사실 지독한 열등감의 다른 이름이 아닌가요?',
      meta: "존재감을 과시하려는 조급한 마음을 알아차린 뒤는 것을 객관적으로 알아차리세요.",
      pureAwareness: "특별함과 평범함의 분별조차 없는 텅 빈 '의식의 바다'로 시선을 거두어 보세요.",
      awareness: '아무도 나를 알아주지 않고 잊혀지는 철저한 무관심의 공포를 있는 그대로 느껴줍니다. 특별함에 대한 집착을 버리고 가장 평범한 먼지가 될 때, 역설적으로 우주 전체를 담은 유일무이함(Zero Point)을 깨닫습니다.'
    }
  },
  {
    code: '미래 예측과 계획 집착', reality: '모든 것이 틀어지는 대형 변수',
    theme: { bg: 'bg-emerald-950/40', border: 'border-emerald-500/20', textTitle: 'text-emerald-300', textLight: 'text-emerald-100', textDark: 'text-emerald-400/70', dot: 'bg-emerald-400' },
    coaching: {
      desc: '미래의 불확실성을 통제하기 위해 완벽한 계획에 집착하는 것은 현존을 거부하는 행위입니다. 당신이 계획의 틀을 단단히 짤수록, 우주는 당신의 통제력을 비웃듯 예측 불허의 대형 사고나 돌발 변수를 던져 매트릭스를 흔듭니다.',
      socratic: '당신이 세운 계획대로 모든 것이 굴러가지 않으면, 세상이 멸망하거나 당신이 파괴되나요?',
      recursive: '한 치 앞을 모르는 불안을 감당하기 싫어 끊임없이 시나리오를 쓰는 행위는 정말 당신을 안심시켜 줍니까?',
      meta: "계획이 틀어져 절망하는 자아를 객관적으로 알아차리세요.",
      pureAwareness: "그 어떤 변수에도 흔들림 없이 여여(如如)한 '알아차림의 스크린' 자체를 인식하세요.",
      awareness: '모든 통제력을 잃고 낭떠러지로 떨어지는 듯한 막막함과 두려움을 피하지 않고 직면합니다. 완벽한 계획을 포기할 때, 삶이 알아서 가장 완벽한 길로 나를 이끌어가는 거대한 흐름(Zero Point)에 올라타게 됩니다.'
    }
  },
  {
    code: '버림받지 않기 위한 착한 아이', reality: '나를 호구로 알고 착취하는 관계',
    theme: { bg: 'bg-purple-950/40', border: 'border-purple-500/20', textTitle: 'text-purple-300', textLight: 'text-purple-100', textDark: 'text-purple-400/70', dot: 'bg-purple-400' },
    coaching: {
      desc: '자신의 욕구를 억누르고 무조건 남에게 맞추는 맹목적인 친절은 "나를 떠나지 말아달라"는 비굴한 주파수입니다. 이 주파수는 포식자들의 본능을 자극하여, 당신을 얕보고 권리를 착취하는 가해자를 끌어당깁니다.',
      socratic: '당신이 싫은 소리를 못 하고 억지로 웃어줄 때, 그들은 당신을 존중하나요 아니면 편리하게 여기나요?',
      recursive: '착하지 않으면 부모님이나 세상으로부터 버려질 것이라는 그 오랜 믿음은 아직도 유효한가요?',
      meta: "억지로 웃으며 비위를 맞추는 초라한 마음을 알아차리는 순간는 것을 객관적으로 알아차리세요.",
      pureAwareness: "그 마음에 결코 오염되지 않는 순백의 '자각'으로 물러나 보세요.",
      awareness: '착한 가면을 벗어던졌을 때 모두가 나를 비난하고 떠나버릴 것 같은 원초적 공포를 심장으로 온전히 겪어냅니다. 버림받을 용기를 낼 때, 타인의 시선에서 해방된 진정한 나 자신(Zero Point)과 만나게 됩니다.'
    }
  },
  {
    code: '가난을 혐오하는 졸부 마인드', reality: '알맹이 없는 사기꾼과의 엮임',
    theme: { bg: 'bg-indigo-950/40', border: 'border-indigo-500/20', textTitle: 'text-indigo-300', textLight: 'text-indigo-100', textDark: 'text-indigo-400/70', dot: 'bg-indigo-400' },
    coaching: {
      desc: '자신이 돈이 없다는 것을 들킬까 봐 명품과 과시로 치장하는 에고입니다. 가난에 대한 극렬한 혐오와 허세의 주파수는, 같은 진동수를 가진 허풍쟁이나 사기꾼들을 기가 막히게 당신의 현실 매트릭스로 불러들입니다.',
      socratic: '화려한 겉모습으로 치장할 때, 당신의 영혼은 부유해지나요 아니면 텅 빈 공허함이 더 커지나요?',
      recursive: '가난한 자는 무시당해 마땅하다는 그 폭력적인 서열 의식은 당신이 만든 것인가요, 사회가 주입한 것인가요?',
      meta: "남들에게 꿇리지 않으려 애쓰는 불안함을 객관적으로 알아차리세요.",
      pureAwareness: "무엇을 더하고 뺄 필요 없이 완벽한 '텅 빈 의식'의 풍요를 자각하세요.",
      awareness: '가진 것을 모두 잃고 밑바닥으로 떨어져 타인의 손가락질을 받을 것 같은 그 참담한 수치심을 피하지 말고 느껴줍니다. 껍데기에 대한 집착이 타버리면, 존재 자체의 찬란함(Zero Point)으로 세상을 대하게 됩니다.'
    }
  },
  {
    code: '독박 쓰는 것에 대한 책임 회피', reality: '모든 짐을 짊어져야 하는 상황 연속',
    theme: { bg: 'bg-orange-950/40', border: 'border-orange-500/20', textTitle: 'text-orange-300', textLight: 'text-orange-100', textDark: 'text-orange-400/70', dot: 'bg-orange-400' },
    coaching: {
      desc: '책임을 지면 피해를 볼 것이라는 극도의 계산적인 회피는, 무의식에 \'책임=무거운 형벌\'이라는 공식을 만듭니다. 당신이 도망치려 발버둥 칠수록 우주는 당신을 옴짝달싹 못 하게 묶어버리는 독박 책임 상황을 설계합니다.',
      socratic: '당신이 모든 짐을 회피하고 편하게만 살려 할 때, 당신의 삶은 주체성을 잃고 끌려다니지 않습니까?',
      recursive: '희생하면 내 것을 다 뺏긴다는 그 깊은 억울함은 과거 어떤 사건에 여전히 묶여있는 것인가요?',
      meta: "손해 보지 않으려 잔머리를 굴리는 에고를 알아차리는 동시에는 것을 객관적으로 알아차리세요.",
      pureAwareness: "그 모든 계산을 무심하게 비추고 있는 '무한한 배경'을 느껴보세요.",
      awareness: '모든 책임을 뒤집어쓰고 억울하게 파멸할 것 같은 그 무거운 공포를 온몸의 세포로 느껴줍니다. 책임에 대한 저항을 버리고 흔쾌히 삶의 짐을 질 때, 오히려 중력이 사라진 듯한 압도적 가벼움(Zero Point)을 경험합니다.'
    }
  },
  {
    code: '행복해야만 한다는 긍정 강박', reality: '우울감과 분노의 돌발적인 대폭발',
    theme: { bg: 'bg-pink-950/40', border: 'border-pink-500/20', textTitle: 'text-pink-300', textLight: 'text-pink-100', textDark: 'text-pink-400/70', dot: 'bg-pink-400' },
    coaching: {
      desc: '부정적인 감정을 나쁜 것으로 치부하고 무조건 밝게만 살려는 긍정 강박은 심각한 감정 억압입니다. 그림자를 보지 않으려 빛에만 집착할수록, 무의식 밑바닥에 쌓인 분노와 우울이 임계점을 넘어 현실에 쓰나미처럼 덮칩니다.',
      socratic: '우울하고 화나는 감정을 "괜찮다"며 억지로 포장할 때, 당신의 가슴속 깊은 곳은 진짜로 괜찮은가요?',
      recursive: '항상 밝고 긍정적이어야만 세상이 나를 사랑해 줄 것이라는 그 숨 막히는 역할극은 언제 끝이 나나요?',
      meta: "슬픔을 억압하고 억지웃음을 짓는 감정 노동을 객관적으로 알아차리세요.",
      pureAwareness: "슬픔과 기쁨을 차별 없이 수용하는 '허공 같은 알아차림'을 자각하세요.",
      awareness: '끝없는 우울의 늪에 빠져 영원히 헤어 나오지 못할 것 같은 깊은 절망과 슬픔을 아무 조건 없이 100% 허용하고 웁니다. 감정의 폭풍우가 완전히 휩쓸고 지나가면, 애쓰지 않아도 잔잔한 고요함(Zero Point)만이 남습니다.'
    }
  },
  {
    code: '불행해질 수 없다는 성공 강박', reality: '정상에서 겪는 참혹한 공허함과 추락',
    theme: { bg: 'bg-slate-800/80', border: 'border-slate-500/20', textTitle: 'text-slate-300', textLight: 'text-slate-100', textDark: 'text-slate-400/70', dot: 'bg-slate-400' },
    coaching: {
      desc: '오직 위로 올라가야만 실패를 면할 수 있다는 생존 본능적 성공 강박입니다. 정상을 향해 채찍질할수록 내면은 황폐해지며, 결국 목표를 이루더라도 지독한 허무감이 몰려오거나 모든 것을 잃는 극적인 추락을 겪게 됩니다.',
      socratic: '당신이 사회적 성공의 사다리 꼭대기에 올라갔을 때, 당신의 영혼은 안식을 얻었습니까, 아니면 떨어질까 봐 더 두렵습니까?',
      recursive: '남들에게 인정받는 성공만이 내 삶의 유일한 정답이라고 굳게 믿게 된 바탕에는 어떤 상처가 숨어있나요?',
      meta: "성취하지 못할까 채찍질하는 마음을 객관적으로 알아차리세요.",
      pureAwareness: "그 요동치는 마음 너머에 원래부터 아무 일도 없는 고요한 '텅 빈 성품'을 응시하세요.",
      awareness: '모든 것을 잃고 실패자로 전락하여 길거리에 나앉을 것 같은 그 끔찍한 추락의 공포를 뼈저리게 느껴줍니다. 성취에 대한 집착을 완전히 내려놓고 지금 이 순간에 현존할 때, 이미 모든 것을 다 이룬 완전함(Zero Point)을 경험합니다.'
    }
  },
  {
    code: '끝없는 재물 축적 강박 (돈 중독)', reality: '여유 상실과 채워지지 않는 갈증',
    theme: { bg: 'bg-yellow-950/40', border: 'border-yellow-500/20', textTitle: 'text-yellow-300', textLight: 'text-yellow-100', textDark: 'text-yellow-400/70', dot: 'bg-yellow-400' },
    coaching: {
      desc: '돈을 버는 것을 넘어 모으는 것 자체에 중독된 에고는, 사실 \'나는 스스로 가치 없다\'는 끔찍한 공허함을 통장의 숫자로 채우려 발버둥 치는 것입니다. 숫자가 아무리 늘어나도 내면의 블랙홀은 채워지지 않으며, 오히려 돈을 잃을까 두려워 삶의 모든 기쁨과 인간관계를 갉아먹는 감옥을 창조합니다.',
      socratic: '통장 잔고가 지금보다 10배로 늘어난다고 상상해 보세요. 그 안도감은 며칠이나 지속될까요? 그리고 그 뒤에 찾아올 또 다른 두려움은 무엇입니까?',
      recursive: '돈이 나를 완벽하게 보호해 줄 것이라는 이 강박적인 환상은, 과거 어느 시절의 지독한 불안 속에서 싹트기 시작했나요?',
      meta: "숫자가 올라갈 때만 쾌감을 느끼는 메마른 마음을 객관적으로 알아차리세요.",
      pureAwareness: "그 갈증을 비추고 있는 텅 비고 충만한 '순수 자각' 그 자체로 돌아오세요.",
      awareness: '돈이 모두 사라져 알거지가 되어 길거리에 나앉을 것 같은 밑바닥의 서늘한 공포를 회피하지 말고 직면하세요. 그 결핍의 에너지가 완전히 타버리면, 돈에 묶여있던 생명력이 풀려나 지금 숨 쉬는 것만으로 압도적인 풍요(Zero Point)를 누리게 됩니다.'
    }
  }
];

export default function OSUpgradeLog() {
  const [selectedPair, setSelectedPair] = useState<typeof pairsData[0] | null>(null);
  const [dailyPair, setDailyPair] = useState<typeof pairsData[0] | null>(null);
  const [showZeroModal, setShowZeroModal] = useState(false);
  const [showHealingGuide, setShowHealingGuide] = useState(false);
  const [showHealingArchive, setShowHealingArchive] = useState(false);
  const [healingDate, setHealingDate] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchDaily = async () => {
      try {
        const res = await fetch('/api/os/daily-matrix');
        if (res.ok) {
          const data = await res.json();
          setDailyPair(data);
        }
      } catch (e) {
        console.error('Failed to fetch daily matrix', e);
      }
    };
    fetchDaily();
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-6 overflow-y-auto overflow-x-hidden relative scrollbar-hide">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-slate-950 pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="z-10 w-full max-w-3xl flex flex-col items-center pb-20">
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 mb-2 tracking-tight flex items-center justify-center gap-3">
            <Database className="w-6 h-6 text-cyan-400" />
            내면 OS 업그레이드
          </h2>
          <p className="text-cyan-200/60 text-sm font-mono tracking-widest uppercase">
            무의식 패턴 추적기
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => { setHealingDate(undefined); setShowHealingGuide(true); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-sm font-medium text-slate-300 transition-all hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] group"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 group-hover:animate-pulse" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-purple-200">
                오늘의 딥 힐링 가이드 (AI)
              </span>
            </button>
            <button
              onClick={() => setShowHealingArchive(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-sm font-medium text-slate-300 transition-all hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] group"
            >
              <BookOpen className="w-4 h-4 text-cyan-400 group-hover:animate-bounce" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-200 to-blue-200">
                치유의 숲 (아카이브)
              </span>
            </button>
          </div>
        </header>

        <ZeroPointDashboard />

        {showHealingGuide && (
          <DeepHealingGuideModal 
            dateString={healingDate} 
            onClose={() => { setShowHealingGuide(false); setHealingDate(undefined); }} 
          />
        )}

        {showHealingArchive && (
          <HealingArchiveModal 
            onClose={() => setShowHealingArchive(false)} 
            onSelectDate={(date) => {
              setHealingDate(date);
              setShowHealingArchive(false);
              setShowHealingGuide(true);
            }}
          />
        )}

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Zero Point Reachability */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setShowZeroModal(true)}
            className="bg-slate-900/50 border border-slate-700/50 rounded-3xl p-6 backdrop-blur-md shadow-xl flex flex-col items-center relative overflow-hidden cursor-pointer group hover:border-emerald-500/30 transition-colors"
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full border border-emerald-500/30 font-bold">클릭하여 원리 보기</span>
            </div>
            <h3 className="text-slate-200 font-bold mb-1 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              시스템 영점 (Zero Point)
            </h3>
            <p className="text-[10px] text-slate-500 font-mono mb-4">마음이 텅 비어있는 상태 지수</p>
            
            <div className="w-full h-48 relative -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="50%" outerRadius="100%" barSize={15} data={zeroPointData}>
                  <RadialBar background dataKey="uv" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pl-4">
                <span className="text-3xl font-black text-emerald-400">85<span className="text-sm">%</span></span>
                <span className="text-[9px] text-emerald-500/50 uppercase tracking-widest">Stable</span>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 mt-2 text-center break-keep">
              최근 7일간의 디버깅 결과, 집착에서 <span className="text-emerald-400 font-bold">자유로워진 빈도</span>가 크게 상승했습니다.
            </p>
          </motion.div>

          {/* Card 2: Opposite Pair Analysis */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/50 border border-slate-700/50 rounded-3xl p-6 backdrop-blur-md shadow-xl flex flex-col relative overflow-hidden h-[400px]"
          >
            <h3 className="text-slate-200 font-bold mb-1 flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-fuchsia-400" />
              정반대의 짝 (Pair) 매트릭스
            </h3>
            <p className="text-[10px] text-slate-500 font-mono mb-6 shrink-0">무의식 코드가 생성한 현실 ➔ <span className="text-amber-400 font-bold">클릭하여 해석 보기</span></p>
            
            <div className="flex-1 flex flex-col gap-3 relative overflow-y-auto scrollbar-hide pr-2 pb-4">
              <div className="absolute left-[50%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-slate-500/0 via-slate-500/30 to-slate-500/0 -translate-x-1/2" />
              
              {/* Today's AI Matrix */}
              {dailyPair && (
                <div 
                  onClick={() => setSelectedPair(dailyPair)}
                  className={`flex justify-between items-center w-full z-10 shrink-0 cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] group relative mb-4`}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500/20 via-cyan-500/20 to-fuchsia-500/20 rounded-2xl blur-sm opacity-50 group-hover:opacity-100 transition-opacity animate-pulse" />
                  
                  <div className={`w-[45%] ${dailyPair.theme.bg} border ${dailyPair.theme.border} rounded-xl p-3 text-center shadow-lg relative overflow-hidden z-10`}>
                    <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className={`w-3 h-3 ${dailyPair.theme.textTitle}`} />
                    </div>
                    <div className="absolute top-1 left-2 flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded-full backdrop-blur-md">
                      <span className={`w-1.5 h-1.5 rounded-full ${dailyPair.theme.dot} animate-pulse`} />
                      <span className="text-[7px] font-bold text-white tracking-widest">TODAY AI</span>
                    </div>
                    <span className={`block text-[9px] ${dailyPair.theme.textDark} mb-1 mt-3`}>오늘의 소스코드</span>
                    <span className={`text-xs ${dailyPair.theme.textLight} font-bold break-keep`}>{dailyPair.code}</span>
                  </div>
                  
                  <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.2)] z-20 group-hover:bg-slate-700 transition-colors">
                    <span className="text-[10px] group-hover:rotate-180 transition-transform duration-500">🔄</span>
                  </div>
                  
                  <div className={`w-[45%] bg-slate-800/60 border border-slate-600 rounded-xl p-3 text-center shadow-lg group-hover:${dailyPair.theme.bg} group-hover:${dailyPair.theme.border} transition-colors z-10`}>
                    <span className="block text-[9px] text-slate-400 group-hover:text-slate-300 mb-1 mt-3">오늘의 투사된 현실</span>
                    <span className="text-xs text-slate-200 font-bold break-keep group-hover:text-white">{dailyPair.reality}</span>
                  </div>
                </div>
              )}

              {/* Existing Matrix Pairs */}
              {pairsData.map((pair, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedPair(pair)}
                  className={`flex justify-between items-center w-full z-10 shrink-0 cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] group`}
                >
                  <div className={`w-[45%] ${pair.theme.bg} border ${pair.theme.border} rounded-xl p-3 text-center shadow-lg relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className={`w-3 h-3 ${pair.theme.textTitle}`} />
                    </div>
                    <span className={`block text-[9px] ${pair.theme.textDark} mb-1`}>내면의 소스코드</span>
                    <span className={`text-xs ${pair.theme.textLight} font-bold break-keep`}>{pair.code}</span>
                  </div>
                  
                  <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,255,255,0.1)] z-10 group-hover:bg-slate-700 transition-colors">
                    <span className="text-[10px] group-hover:rotate-180 transition-transform duration-500">🔄</span>
                  </div>
                  
                  <div className={`w-[45%] bg-slate-800/40 border border-slate-700 rounded-xl p-3 text-center shadow-lg group-hover:${pair.theme.bg} group-hover:${pair.theme.border} transition-colors`}>
                    <span className="block text-[9px] text-slate-500 group-hover:text-slate-400 mb-1">투사된 현실</span>
                    <span className="text-xs text-slate-300 font-bold break-keep group-hover:text-white">{pair.reality}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Full Width Card: AI System Insight */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 bg-gradient-to-br from-indigo-950/40 to-slate-900/40 border border-indigo-500/20 rounded-3xl p-6 backdrop-blur-md shadow-xl"
          >
            <h3 className="text-indigo-200 font-bold mb-3 flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-indigo-400" />
              카르마(Karma) 대물림 추적
            </h3>
            <p className="text-sm text-indigo-100/70 leading-relaxed break-keep">
              최근 14일간의 데이터를 기반으로 볼 때, 당신의 시스템은 <strong>'타인에게 인정받지 못할 것에 대한 공포'</strong>를 지속적으로 구동하고 있습니다. 
              이는 현실에서 '나를 통제하려는 직장 상사' 혹은 '질투하는 지인'이라는 정반대의 짝을 끊임없이 초대합니다. 
              <br/><br/>
              이를 해결하려면 상대를 원망할 것이 아니라, 위 매트릭스 카드를 클릭하여 내면의 '결핍 코드'가 어떻게 현실을 창조하는지 원리를 깨닫고 <strong>텅 빈 마음으로 디버깅</strong>해야 합니다.
            </p>
          </motion.div>

        </div>
      </div>

      {/* Modal Overlay for Detailed Coaching */}
      <AnimatePresence>
        {selectedPair && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedPair(null)}
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md bg-slate-900 ${selectedPair.theme.border} border-2 rounded-3xl p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto scrollbar-hide`}
            >
              <button 
                onClick={() => setSelectedPair(null)} 
                className="absolute top-4 right-4 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-6 pr-8">
                <div className={`w-3 h-3 rounded-full ${selectedPair.theme.dot} animate-pulse`} />
                <h3 className={`text-xl font-black ${selectedPair.theme.textTitle} tracking-tight`}>매트릭스 디버깅</h3>
              </div>

              {/* Pair Visualization */}
              <div className="flex items-center justify-between bg-black/40 rounded-2xl p-4 mb-6 border border-white/5">
                <div className="w-[45%] text-center">
                  <span className={`block text-[10px] ${selectedPair.theme.textDark} mb-1`}>내면의 소스코드</span>
                  <span className={`text-sm ${selectedPair.theme.textLight} font-bold break-keep`}>{selectedPair.code}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                  <span className="text-xs">🔄</span>
                </div>
                <div className="w-[45%] text-center">
                  <span className="block text-[10px] text-slate-500 mb-1">투사된 현실</span>
                  <span className="text-sm text-slate-300 font-bold break-keep">{selectedPair.reality}</span>
                </div>
              </div>
              
              {/* Coaching Content */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-5 rounded-2xl border border-slate-700/50">
                  <h4 className="text-xs font-mono text-emerald-400 mb-2 flex items-center gap-2">
                    <span className="text-base">💡</span> 명심 코칭 풀이
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed break-keep">{selectedPair.coaching.desc}</p>
                </div>
                
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-5 rounded-2xl border border-slate-700/50">
                  <h4 className="text-xs font-mono text-amber-400 mb-2 flex items-center gap-2">
                    <span className="text-base">🤔</span> 소크라테스 문답
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed break-keep">{selectedPair.coaching.socratic}</p>
                </div>
                
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-5 rounded-2xl border border-slate-700/50">
                  <h4 className="text-xs font-mono text-indigo-400 mb-2 flex items-center gap-2">
                    <span className="text-base">🔁</span> 재귀적 질문
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed break-keep">{selectedPair.coaching.recursive}</p>
                </div>
                
                {/* 2-Step Awakening Process */}
                <div className="bg-gradient-to-b from-slate-950/80 to-slate-900/80 p-4 sm:p-5 rounded-2xl border border-purple-500/10 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-300 border-b border-purple-500/10 pb-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>의식 리셋 2단계 디버깅 프로세스</span>
                  </div>
                  
                  {/* Step 1: Meta-cognition */}
                  <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/30 hover:border-purple-500/20 transition-all">
                    <h4 className="text-xs font-bold text-purple-400 mb-2 flex items-center gap-2">
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono">STEP 1</span>
                      👁️ 메타 인지 (객관적 관찰)
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed break-keep">
                      {selectedPair.coaching.meta}
                    </p>
                    <span className="block text-[10px] text-slate-500 mt-2 font-mono">➔ 에고의 생각과 감정을 관찰자 시점으로 가만히 바라봅니다.</span>
                  </div>

                  {selectedPair.coaching.pureAwareness ? (
                    <>
                      {/* Connector Animation */}
                      <div className="flex flex-col items-center justify-center py-1">
                        <div className="w-[2px] h-6 bg-gradient-to-b from-purple-500 to-fuchsia-500 animate-pulse" />
                        <span className="text-[9px] text-fuchsia-400/80 font-mono tracking-widest uppercase my-1 animate-pulse">
                          Deepen Awareness (차원 상승)
                        </span>
                        <div className="w-[2px] h-6 bg-gradient-to-b from-fuchsia-500 to-pink-500 animate-pulse" />
                      </div>

                      {/* Step 2: Awareness of Awareness */}
                      <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/30 hover:border-fuchsia-500/20 transition-all relative overflow-hidden group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <h4 className="text-xs font-bold text-fuchsia-400 mb-2 flex items-center gap-2 relative z-10">
                          <span className="text-xs bg-fuchsia-500/20 text-fuchsia-300 px-1.5 py-0.5 rounded font-mono">STEP 2</span>
                          🌌 알아차림의 알아차림 (순수 자각)
                        </h4>
                        <p className="text-sm text-slate-200 font-medium leading-relaxed break-keep relative z-10">
                          {selectedPair.coaching.pureAwareness}
                        </p>
                        <span className="block text-[10px] text-slate-500 mt-2 font-mono relative z-10">➔ 관찰하고 있는 '텅 빈 배경 자체(자각 그 자체)'에 머무릅니다.</span>
                      </div>
                    </>
                  ) : (
                    // Fallback if pureAwareness is missing
                    <>
                      <div className="flex flex-col items-center justify-center py-1">
                        <div className="w-[2px] h-4 bg-slate-700" />
                      </div>
                      <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/30">
                        <h4 className="text-xs font-bold text-fuchsia-400 mb-2 flex items-center gap-2">
                          🌌 알아차림의 알아차림
                        </h4>
                        <p className="text-sm text-slate-400 italic">
                          현재 의식 튜닝 데이터를 분석 중입니다...
                        </p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-5 rounded-2xl border border-slate-700/50 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-r ${selectedPair.theme.bg} opacity-50`} />
                  <div className="relative z-10">
                    <h4 className="text-xs font-mono text-cyan-400 mb-2 flex items-center gap-2">
                      <span className="text-base">✨</span> Zero Point 솔루션
                    </h4>
                    <p className="text-sm text-white font-medium leading-relaxed break-keep">{selectedPair.coaching.awareness}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 mb-4">
                <button 
                  onClick={() => setSelectedPair(null)}
                  className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold tracking-widest transition-colors"
                >
                  디버깅 완료 (닫기)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Zero Point Modal for Beginners */}
        {showZeroModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setShowZeroModal(false)}
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-slate-900 border-2 border-emerald-500/30 rounded-3xl p-6 shadow-[0_0_40px_rgba(16,185,129,0.15)] relative max-h-[85vh] overflow-y-auto scrollbar-hide"
            >
              <button 
                onClick={() => setShowZeroModal(false)} 
                className="absolute top-4 right-4 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-6 pr-8">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" />
                <h3 className="text-xl font-black text-emerald-300 tracking-tight">시스템 영점(Zero Point)이란?</h3>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed mb-6 break-keep">
                  우리의 마음은 스마트폰의 <strong>운영체제(OS)</strong>와 같습니다. 하루 종일 온갖 생각과 감정이라는 쓸데없는 어플들이 켜져 삶의 배터리를 갉아먹고 있죠. 
                  <br/><br/>
                  <strong className="text-emerald-400 font-bold text-base">'시스템 영점'</strong>은 모든 어플이 꺼진, 완벽하게 고요하고 투명한 <strong className="text-white">순수 의식(초기화 상태)</strong>을 뜻합니다.
                </p>

                <div className="bg-gradient-to-br from-red-950/40 to-slate-900/80 p-5 rounded-2xl border border-red-500/20">
                  <h4 className="text-sm font-bold text-red-400 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> 🔴 집착도 (Ego Friction: 15%)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed break-keep">
                    "내가 맞다", "통제해야 한다", "불안하다"며 끊임없이 현실과 싸우고 대상을 억압하는 에고(자아)의 저항 수치입니다. 이 수치가 높을수록 뇌는 과열되고 현실은 고통스러운 굴레가 됩니다.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900/80 p-5 rounded-2xl border border-emerald-500/20">
                  <h4 className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> 🟢 평온도 (Zero Point: 85%)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed break-keep">
                    감정이 요동칠 때, 거기에 끌려가지 않고 그 요동침을 '텅 빈 배경'에서 그저 가만히 비추고 있는 <strong>알아차림 자체</strong>의 수치입니다. 이 상태에 머무르면, 굳이 애쓰지 않아도 우주의 동시성(기적)을 따라 모든 일이 자연스럽게 풀려갑니다.
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-700/50">
                  <p className="text-xs text-slate-400 text-center leading-relaxed break-keep">
                    현재 당신의 시스템은 <strong className="text-emerald-400">85%의 시간 동안</strong> 외부 자극에 흔들리지 않는 안정된 관찰자 모드로 작동 중입니다. 나머지 15%의 찌꺼기가 올라올 때마다, <strong>매트릭스 디버깅</strong> 카드를 눌러 무의식 코드를 완전히 삭제해 주세요!
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
