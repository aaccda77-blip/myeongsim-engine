'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Sparkles, ChevronLeft, ChevronRight, BookOpen, Shield, Award, Compass, Eye, Heart, Zap, Globe, Target, Activity } from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';
import MyeongliTermModal from '@/components/report/MyeongliTermModal';
import MicroPassModal from './MicroPassModal';
import DailyScanWidget from './DailyScanWidget';
import TeaserBlurPaywall from './TeaserBlurPaywall';
import PaymentCard from '@/components/chat/PaymentCard';

interface Myeongsim64KeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: any;
}

const CENTER_THEMES: Record<string, { glow: string; text: string; bg: string; border: string; circle: string; rgb: string }> = {
  inspiration: {
    glow: 'shadow-[0_0_25px_rgba(168,85,247,0.35)]',
    text: 'text-purple-400',
    bg: 'bg-purple-950/20',
    border: 'border-purple-500/30',
    circle: 'stroke-purple-500',
    rgb: '168,85,247'
  },
  mind: {
    glow: 'shadow-[0_0_25px_rgba(99,102,241,0.35)]',
    text: 'text-indigo-400',
    bg: 'bg-indigo-950/20',
    border: 'border-indigo-500/30',
    circle: 'stroke-indigo-500',
    rgb: '99,102,241'
  },
  expression: {
    glow: 'shadow-[0_0_25px_rgba(14,165,233,0.35)]',
    text: 'text-sky-400',
    bg: 'bg-sky-950/20',
    border: 'border-sky-500/30',
    circle: 'stroke-sky-500',
    rgb: '14,165,233'
  },
  identity: {
    glow: 'shadow-[0_0_25px_rgba(234,179,8,0.35)]',
    text: 'text-yellow-400',
    bg: 'bg-yellow-950/20',
    border: 'border-yellow-500/30',
    circle: 'stroke-yellow-500',
    rgb: '234,179,8'
  },
  willpower: {
    glow: 'shadow-[0_0_25px_rgba(249,115,22,0.35)]',
    text: 'text-orange-400',
    bg: 'bg-orange-950/20',
    border: 'border-orange-500/30',
    circle: 'stroke-orange-500',
    rgb: '249,115,22'
  },
  emotional: {
    glow: 'shadow-[0_0_25px_rgba(244,63,94,0.35)]',
    text: 'text-rose-400',
    bg: 'bg-rose-950/20',
    border: 'border-rose-500/30',
    circle: 'stroke-rose-500',
    rgb: '244,63,94'
  },
  intuition: {
    glow: 'shadow-[0_0_25px_rgba(16,185,129,0.35)]',
    text: 'text-emerald-400',
    bg: 'bg-emerald-950/20',
    border: 'border-emerald-500/30',
    circle: 'stroke-emerald-500',
    rgb: '16,185,129'
  },
  lifeforce: {
    glow: 'shadow-[0_0_25px_rgba(236,72,153,0.35)]',
    text: 'text-pink-400',
    bg: 'bg-pink-950/20',
    border: 'border-pink-500/30',
    circle: 'stroke-pink-500',
    rgb: '236,72,153'
  },
  drive: {
    glow: 'shadow-[0_0_25px_rgba(99,102,241,0.35)]',
    text: 'text-indigo-400',
    bg: 'bg-indigo-950/20',
    border: 'border-indigo-500/30',
    circle: 'stroke-indigo-500',
    rgb: '99,102,241'
  }
};

// 35개 주요 개념(의식 영역 9개 + 행성 기질 26개)의 비유/은유 자각 사전 정의
const CONCEPT_GUIDE_DATA: Record<string, { title: string; subtitle: string; desc: string; metaphor: string; action: string }> = {
  '다크코드': {
    title: '🔴 다크코드 (Dark Code)',
    subtitle: '뇌과학과 인지 오류가 빚어낸 에고의 자동 생존 보호막',
    metaphor: '🛡️ 시스템 붕괴를 막기 위해 일시적으로 전면 가동되는 붉은 방어 모니터',
    desc: '다크코드는 영적으로는 \'나라는 에고의 분리 의식\'이지만, 현대 뇌과학적으로는 우리 뇌의 가장 원초적인 부위인 \'편도체(Amygdala)\'가 위험(생존 위협, 사회적 거절, 불안)을 느낄 때 교감신경계를 활성화하는 75% 수준의 강력한 \'생존 방어 아키텍처\'입니다. 이 수치가 높게 나타나는 이유는 우리의 신경망이 과거의 상처나 실패(외상 기억)로부터 우리를 보호하기 위해 선제적으로 불안과 긴장을 퍼뜨리기 때문입니다. 마치 컴퓨터가 작은 충격을 받았을 때 시스템을 보호하려고 일시적으로 팬을 최대치(75%)로 돌려 경고음을 내는 것과 같으며, 나를 해치려는 오류가 아니라 나를 지켜내려는 에고의 서툰 방어 시스템이자 조건반사적 반응입니다.',
    action: '다크코드가 높아졌을 때 스스로를 탓하지 마세요. "아, 내 편도체와 에고 방어 시스템이 나를 지키려고 열심히 일하고 있구나" 하고 한 걸음 물러나 알아차리는 순간, 과부하 걸렸던 붉은 모니터가 즉시 본래의 맑은 상태로 복구되기 시작합니다.'
  },
  '자각 주파수': {
    title: '🔵 자각 주파수 (Awareness Frequency)',
    subtitle: '전두엽 활성화와 우주적 동기화를 이끄는 마음의 거울',
    metaphor: '🔵 거친 풍랑을 한순간에 맑고 잔잔하게 비추는 고요한 하늘빛 거울',
    desc: '자각 주파수는 영적으로는 \'에고와 나를 분리하는 참나(Subject)의 시선\'이며, 뇌과학적으로는 편도체의 날선 반응을 억제하고 이성적 평온함을 되찾아주는 \'전전두엽(Prefrontal Cortex)\'과 미주신경계(Parasympathetic Nervous System)의 안정도입니다. 전체 저울에서 25%의 자각 수치가 있는 이유는, 우리가 온전한 깨달음(100%)을 유지하지 못하더라도 단 25%의 알아차림("지금 내가 긴장했구나"라는 인식)만으로도 스트레스 호르몬인 코르티솔 분비가 억제되고 신경 가소성(Neuroplasticity)에 의해 뇌 회로가 재배선되기 시작하기 때문입니다. 단 3초 동안 숨을 관찰하며 \'진짜 이 고통을 관찰하는 주체는 누구인가?\'를 꿰뚫어 볼 때, 자각 주파수는 강력하게 진동하며 현실을 조율할 지혜를 열어줍니다.',
    action: '자각 주파수를 높이려 억지로 통제할 필요는 없습니다. 25%의 작은 알아차림 불꽃만 있어도 내면의 모든 붉은 불안은 고요히 가라앉으며, 결국 우주의 평온한 흐름과 하나 되는 100%의 본래 평화(메타코드)로 자연스럽게 귀환하게 됩니다.'
  },
  // 9대 의식 영역
  '영감 영역': {
    title: '영감 영역 (Head Center)',
    subtitle: '은하수처럼 쏟아지는 생각과 아이디어의 안테나',
    metaphor: '🌌 밤하늘을 수놓는 끝없는 유성우와 물음표',
    desc: '세상을 향해 던지는 근원적인 질문과 우주의 아이디어를 포착하는 정신적 발전소입니다. 답을 모르는 것에 대한 호기심을 유지할 때 가장 아름다운 창조의 문이 열립니다.',
    action: '모든 의문에 즉각 답을 내리려 애쓰지 마세요. 질문 그 자체를 품어주는 넓은 하늘이 되어줄 때, 진짜 영감이 스스로 찾아옵니다.'
  },
  '사고 영역': {
    title: '사고 영역 (Ajna Center)',
    subtitle: '정보를 체계적으로 분류하는 지혜의 서재',
    metaphor: '📚 질서정연하게 꽂혀 있는 거대한 고대 도서관의 책장',
    desc: '밀려오는 정보와 영감을 논리적이고 입체적인 이론 체계로 가공하고 분류하는 내적 분석실입니다. 유연한 생각의 넓이를 유지하는 힘을 내포합니다.',
    action: '"내 생각만 정답이다"라는 고집의 덫(다크코드)을 내려놓으세요. 타인의 생각도 하나의 책장에 꽂아두고 감상하는 도서관장이 되어주십시오.'
  },
  '소통 영역': {
    title: '소통 영역 (Throat Center)',
    subtitle: '생각과 영감을 현실로 구현하는 창조의 문',
    metaphor: '🎙️ 보이지 않는 마음의 소리를 황금빛 언어로 연성하는 목소리',
    desc: '내면의 주파수를 세상에 울리게 하는 창조의 마스터키입니다. 때를 기다려 내뱉는 나의 말 한마디는 주변 사람들을 일깨우는 강력한 천명 메시지가 됩니다.',
    action: '단지 관심을 받기 위해 말과 행동을 서두르지 마세요. 진짜 타이밍이 왔을 때 울려 퍼지는 목소리는 우주의 울림과 같습니다.'
  },
  '정체성 영역': {
    title: '정체성 영역 (G-Center)',
    subtitle: '내가 누구이며 어디로 향하는지 가리키는 사랑의 나침반',
    metaphor: '🧭 깊은 가슴 한가운데 고요히 박혀 있는 영혼의 북극성',
    desc: '나의 진정한 인생 방향과 순수한 자기 정체성을 보존하는 곳입니다. 타인의 기대에 맞추려 하지 않고 온전한 나로서 서 있을 때 우주의 완전한 흐름을 타게 됩니다.',
    action: '"내가 잘 가고 있는 건가?" 하며 남의 나침반을 기웃거리지 마세요. 고요히 숨 쉴 때 이미 내 심장이 가리키는 나만의 방향이 드러납니다.'
  },
  '주체 영역': {
    title: '주체 영역 (Ego Center)',
    subtitle: '한번 내뱉은 약속을 끝까지 관철하는 실행의 엔진',
    metaphor: '🔥 불을 뿜으며 기차를 앞으로 달리게 만드는 붉은 의지의 화로',
    desc: '약속을 책임지고, 목표를 향해 끝까지 밀어붙이는 굳건한 주체적 힘입니다. 자신의 한계와 에너지를 귀하게 대할 때 세상의 크나큰 신뢰와 존경을 얻습니다.',
    action: '남들에게 내 가치를 굳이 증명해 보이려 무리한 약속을 떠맡지 마세요. 당신은 태어난 자체만으로도 이미 완벽한 보석입니다.'
  },
  '감정 영역': {
    title: '감정 영역 (Solar Plexus Center)',
    subtitle: '기쁨과 슬픔을 온몸으로 겪어내는 감수성의 바다',
    metaphor: '🌊 매일 아침 밀물과 썰물이 끊임없이 요동치는 은빛 파도의 만',
    desc: '감정의 고조와 저조를 겪으며 인간 본성을 깊이 이해하게 해주는 영혼의 온실입니다. 파도가 칠 때 즉시 결정을 내리지 않고 기어이 감정이 잔잔해진 후에 내리는 지혜를 연마합니다.',
    action: '일렁이는 감정 파도를 억지로 멈추려 싸우지 마십시오. 감정은 그저 지나가는 날씨일 뿐이며, 당신은 그 날씨를 담는 웅장한 바다입니다.'
  },
  '통찰 영역': {
    title: '통찰 영역 (Splenic Center)',
    subtitle: '찰나의 생존 위험을 즉시 알아채는 본능적 센서',
    metaphor: '🐾 깊은 숲속에서 귓바퀴를 쫑긋 세워 사방을 감지하는 야생 동물의 귀',
    desc: '건강과 생존, 직감을 책임지는 실시간 무의식 방어 레이더입니다. 과거의 불안에 얽매이지 않고 오직 지금 이 순간 내 몸이 보내는 찰나의 소리에 귀 기울입니다.',
    action: '이미 지나가 버린 나쁜 인연이나 상처 입은 과거를 두려움 때문에 붙잡고 있지 마세요. 지금 이 순간 당신의 몸은 안전합니다.'
  },
  '생체에너지 영역': {
    title: '생체에너지 영역 (Sacral Center)',
    subtitle: '가슴 뛰는 열정을 향해 무한히 뿜어내는 생명 발전소',
    metaphor: '🔋 밤새 몰입해도 지치지 않는 영원불멸의 태양광 배터리',
    desc: '순수한 노동과 열정, 창조의 현실적 엔진입니다. 에고의 시샘이나 타인의 눈치 때문에 움직이지 않고 오직 내 가슴이 진정으로 원할 때만 반응하여 마르지 않는 에너지를 방사합니다.',
    action: '가슴이 원치 않는 일에 눈치 보여 억지로 "예스"라고 하지 마세요. 거절하는 용기야말로 당신의 생체에너지를 보존하는 영성입니다.'
  },
  '추진력 영역': {
    title: '추진력 영역 (Root Center)',
    subtitle: '스트레스와 압박을 폭발적 전진력으로 뒤바꾸는 터보 기어',
    metaphor: '🚀 우주선을 대기권 밖으로 밀어 올리는 강력한 분사구의 추진 불꽃',
    desc: '세상의 마감 압박과 물리적 긴장감을 기꺼이 도약의 동력으로 소화해내는 묵직한 가속 페달입니다. 서두르지 않고 묵묵히 제자리를 지키다 타이밍이 올 때 질주합니다.',
    action: '아직 아무 일도 일어나지 않았는데 혼자 조급해하며 달리려 마십시오. 긴장감을 가만히 들이마셔 내적인 평화의 지렛대로 삼으십시오.'
  },

  // 26개 행성 기질
  '천명 미션 [의식 태양]': {
    title: '천명 미션 [의식 태양]',
    subtitle: '이번 생에 세상을 향해 환히 비춰야 할 영혼의 햇살',
    metaphor: '☀️ 어두운 대지를 깨우며 솟아오르는 신성한 아침 해',
    desc: '내가 가장 의식적으로 추구하고 마침내 실현해야 할 천명이자 의식의 본질입니다. 이 주파수를 곧게 켤 때 비로소 내 삶 전체의 목적이 환하게 드러납니다.',
    action: '어려움을 피하려 타협하지 말고, 당신 존재 본연의 색깔을 세상에 당당하게 비추어 주십시오.'
  },
  '현재의 그라운딩 [의식 지구]': {
    title: '현재의 그라운딩 [의식 지구]',
    subtitle: '의식의 태양이 높이 뜰 수 있도록 뿌리를 내리는 대지',
    metaphor: '🌲 나무가 백 년 동안 서 있을 수 있도록 굳건히 지탱해 주는 비옥한 흙',
    desc: '태양의 빛을 영적으로 현실화시키고 일상의 안정성을 지켜주는 깊은 뿌리(Grounding)입니다. 지구가 자전하듯 변치 않는 현실적 리듬과 신체 균형을 의미합니다.',
    action: '머릿속 공상에 갇히지 말고, 당신의 몸을 건강히 챙기며 현실의 일상적 리듬을 차분히 밟아 나가십시오.'
  },
  '무의식적 사명 [무의식 태양]': {
    title: '무의식적 사명 [무의식 태양]',
    subtitle: '내가 인지하지 못해도 몸과 유전자가 밀고 가는 보이지 않는 운명의 바퀴',
    metaphor: '🚢 보이지 않는 밤바다 아래를 묵묵히 흐르는 거대한 해류',
    desc: '나의 이성적 자아는 잘 느끼지 못하지만, 내 신체 세포와 무의식이 본능적으로 행하는 숨겨진 진짜 천명의 추진력입니다.',
    action: '머리로 계산하려 애쓰지 말고, 내 무의식과 몸의 반응이 가리키는 자연스러운 흐름을 신뢰하십시오.'
  },
  '무의식적 목적 [무의식 지구]': {
    title: '무의식적 목적 [무의식 지구]',
    subtitle: '무의식의 돛이 흔들리지 않도록 잡아주는 신체적 그라운딩',
    metaphor: '⚓ 깊은 바다 아래에서 배가 휩쓸려 가지 않도록 꽉 움켜쥔 닻',
    desc: '신체적 건강과 본능적인 안전을 담당하는 대지의 기초입니다. 머리가 불안해해도 내 무의식의 뿌리가 튼튼하면 삶은 결코 쓰러지지 않습니다.',
    action: '몸의 소리에 귀 기울이십시오. 충분한 휴식과 자연 속에서의 그라운딩이 당신의 보이지 않는 운명을 지탱해 줍니다.'
  },
  '전생 전반기 기운 배경 [무의식 남결절]': {
    title: '전생 전반기 기운 배경 [무의식 남결절]',
    subtitle: '전생부터 익숙하게 가져온 내 신체의 무의식적 고향 환경',
    metaphor: '🏕️ 오랜 세월 머물러 낡았지만 언제든 편안히 기대 쉴 수 있는 가죽 텐트',
    desc: '인생 전반기(~40세) 동안 나의 신체적 활동과 환경에 디폴트값으로 작동하는 잠재적 기운의 토대이자, 익숙한 전생의 유산입니다.',
    action: '이 익숙한 패턴에 너무 깊이 안주하여 삶을 고여있게 만들기보다는, 후반기의 새로운 발돋움판으로 사용하십시오.'
  },
  '전생 후반기 기운 배경 [무의식 북결절]': {
    title: '전생 후반기 기운 배경 [무의식 북결절]',
    subtitle: '인생 후반기에 내 몸이 밟아 나가야 할 약속된 새로운 영토',
    metaphor: '🌅 안개를 뚫고 마주하게 될 미지의 찬란한 새로운 지평선',
    desc: '인생 후반기(40세 이후)에 내 신체와 유전자가 운명적으로 경험하고 맞닥뜨려야 할 성장과 기운의 방향성입니다.',
    action: '낯설고 두렵더라도, 새로운 환경과 몸의 변화가 이끄는 방향을 향해 당당히 걸음을 내딛으십시오.'
  },
  '전생 전반기 생각 패턴 [의식 남결절]': {
    title: '전생 전반기 생각 패턴 [의식 남결절]',
    subtitle: '머릿속에서 습관적으로 반복해 온 익숙한 전반기 정신세계',
    metaphor: '📻 오랫동안 틀어두어 나도 모르게 흥얼거리는 오래된 라디오 주파수',
    desc: '인생 전반기에 내가 세상을 바라보는 눈이 되는 생각과 관점의 익숙한 기본 프레임입니다.',
    action: '이 낡은 라디오 주파수(과거 생각)가 나를 옭아매지 않도록, "아, 또 옛날 노래가 나오는구나" 하고 한 걸음 물러나 관찰하십시오.'
  },
  '전생 후반기 생각 패턴 [의식 북결절]': {
    title: '전생 후반기 생각 패턴 [의식 북결절]',
    subtitle: '인생 후반기에 내가 지향해야 할 성숙하고 웅장한 새로운 관점',
    metaphor: '🔭 밤하늘 깊은 곳을 비추는 웅장한 천체 망원경의 새로운 초점',
    desc: '인생 후반기에 내가 도달해야 할 새로운 생각의 그릇이자, 세상을 넓게 해석해내는 고차원적인 지혜의 시야입니다.',
    action: '좁은 과거의 집착에서 벗어나, 우주가 넓게 허락한 새로운 생각의 주파수로 인생 전체를 폭넓게 수용하십시오.'
  },
  '무의식적 감동력 [무의식 달]': {
    title: '무의식적 감동력 [무의식 달]',
    subtitle: '내 몸의 신경계를 찌릿하게 흔드는 본능적인 울림의 에너지',
    metaphor: '🎻 미세한 바람 소리에도 가슴 속 깊은 현을 울려 퍼뜨리는 첼로의 진동',
    desc: '이성적 판단 이전에 내 신체와 무의식이 강력하게 끌리고 반응하여 감동과 만족을 얻는 참된 감각 동력입니다.',
    action: '남들이 멋지다고 하는 허상에 한눈팔지 말고, 내 몸이 본능적으로 평화와 전율을 느끼는 진짜 감동의 길을 선택하십시오.'
  },
  '집중의 초점 [의식 달]': {
    title: '집중의 초점 [의식 달]',
    subtitle: '내 눈길과 정성이 하루 종일 쏠리는 생각의 정원',
    metaphor: '🔍 어두운 연극 무대 위에서 오직 한 인물만을 환하게 쫓아 비추는 핀 조명',
    desc: '내가 일상에서 가장 의식적으로 주의(Attention)를 기울이고 정성을 쏟아붓는 중심적인 생각 집중점입니다.',
    action: '이 핀 조명이 불안과 걱정이라는 어두운 먹구름을 쫓아 비추지 않도록, 나의 아름다운 창조의 괘를 향해 조명을 돌려주십시오.'
  },
  '무의식적 내면의 소통 [무의식 수성]': {
    title: '무의식적 내면의 소통 [무의식 수성]',
    subtitle: '말을 하지 않아도 내 온몸의 파동으로 퍼져 나가는 진짜 메시지',
    metaphor: '🌫️ 향나무가 향기를 피워 말없이 숲 전체를 적시는 보이지 않는 기운',
    desc: '소리와 입술 너머에서 뿜어져 나오는 나의 진실된 무의식적 주파수입니다. 굳이 설명하려 애쓰지 않아도 상대의 심장 깊숙이 각인되는 비언어적 파동입니다.',
    action: '말을 예쁘게 꾸미려 머리를 굴리기보다, 내 가슴의 맑은 침묵을 유지하는 것이 훨씬 강력한 울림을 낳습니다.'
  },
  '일상의 대외 메시지 [의식 수성]': {
    title: '일상의 대외 메시지 [의식 수성]',
    subtitle: '세상을 향해 생각을 전달하는 소통의 확성기',
    metaphor: '🕊️ 편지를 물고 창공을 날아 소식을 전하는 푸른 전서구',
    desc: '내가 타인들과 직접 언어와 글을 통해 내 생각을 나누고 설득하며 의식을 전파하는 도구입니다.',
    action: '비판이나 억지 설득을 멈추고, 당신의 지혜로운 괘 코드를 담은 따뜻한 메시지로 세상을 깨워 주십시오.'
  },
  '관계적 미학 기반 [무의식 금성]': {
    title: '관계적 미학 기반 [무의식 금성]',
    subtitle: '내 몸이 타인과 포옹할 때 본능적으로 갈구하는 관계의 안전 지대',
    metaphor: '🏡 겨울 밤, 벽난로 옆에서 소중한 사람들과 둘러앉아 나누는 따뜻한 모포의 온기',
    desc: '무의식적으로 내 대인관계와 사랑의 안전함을 느끼게 해주는 영적인 도덕적 기초이자 예술성입니다.',
    action: '나를 학대하거나 내 바운더리를 무너뜨리는 불건전한 인연을 자비롭게 끊고, 내 존재가 온전히 대접받는 안전한 환경에 머무십시오.'
  },
  '표면의 핵심 가치관 [의식 금성]': {
    title: '표면의 핵심 가치관 [의식 금성]',
    subtitle: '세상 속에서 내가 수호해야 할 가장 가치 있고 아름다운 도덕과 사랑의 룰',
    metaphor: '💎 맑은 태양빛을 받아 일곱 빛깔 무지개를 반사하는 투명한 크리스탈 보석',
    desc: '내가 인간적으로 옳다고 느끼는 미학적 기준, 사랑의 가치, 도덕률의 나침반입니다.',
    action: '가치 없는 저급한 욕망에 휩쓸리지 말고, 내면의 고귀한 가치관을 품격 있게 수호할 때 큰 명성을 얻습니다.'
  },
  '잠재적 무의식 행동력 [무의식 화성]': {
    title: '잠재적 무의식 행동력 [무의식 화성]',
    subtitle: '위기나 기회가 왔을 때 내 몸이 본능적으로 먼저 튕겨 나가는 행동 엔진',
    metaphor: '⚡ 먹구름이 부딪혔을 때 단 1초 만에 천지를 흔들며 번뜩이는 번개 불꽃',
    desc: '계획이나 생각 이전에 내 신체가 즉각적으로 가동하는 가공할 만한 무의식적 추진 동력입니다.',
    action: '이 거대한 번개 기운이 분노나 파괴가 아닌, 세상을 치유하고 막힌 판을 돌파하는 주체적 힘으로 아름답게 쓰이게 하십시오.'
  },
  '전투적 기질 본능 [의식 화성]': {
    title: '전투적 기질 본능 [의식 화성]',
    subtitle: '부조리에 맞서 신념을 관철해내는 주권의 용기',
    metaphor: '🗡️ 불의에 맞서 주권을 당당하게 수호하기 위해 빼어 든 정의로운 장검',
    desc: '내 삶의 바운더리를 지키고 신념을 밀어붙이기 위해 도전하는 불같은 투지이자 개척 동력입니다.',
    action: '주변 눈치를 보느라 움츠러들지 말고, 당신의 정의로운 창(의식 화성)을 건강하고 정당하게 빼어 들어 당신의 길을 지켜내십시오.'
  },
  '무의식적 우주 확장력 [무의식 목성]': {
    title: '무의식적 우주 확장력 [무의식 목성]',
    subtitle: '내 존재 자체가 우주와 공명하여 자연스레 풍요를 끌어당기는 자력',
    metaphor: '🧲 철가루들을 소리 없이 자석의 중심으로 끌어모으는 보이지 않는 자석의 장',
    desc: '우주의 거대한 순풍 and 내 신체 리듬이 정렬되었을 때 마르지 않고 솟구쳐 오르는 신성한 확장과 풍요의 통로입니다.',
    action: '억지로 부유해지려 발버둥 치는 일을 내려놓고, 온전히 건강한 기질을 회복하여 자연스럽게 풍요가 쏟아져 들어오게 하십시오.'
  },
  '인생 번영 and 확장 방향 [의식 목성]': {
    title: '인생 번영과 확장 방향 [의식 목성]',
    subtitle: '내가 나다운 삶을 정렬할 때 우주가 기꺼이 불어넣어 주는 인생의 축복이자 행운',
    metaphor: '⛵ 돛을 높이 세운 배가 망망대해를 순탄하게 건널 수 있도록 밀어주는 우주의 찬란한 순풍',
    desc: '이번 생에 내 기질을 자각하고 살아낼 때 자연스럽게 번영과 번창이 따라오는 번영 지도상의 보물 좌표입니다.',
    action: '에고의 탐욕에 눈멀지 마십시오. 당신의 천명 코드를 따뜻하게 켤 때 우주는 자동으로 행운의 문을 열어 줍니다.'
  },
  '무의식적 자기 규율 [무의식 토성]': {
    title: '무의식적 자기 규율 [무의식 토성]',
    subtitle: '내 몸이 자연의 섭리를 벗어나 망가지지 않도록 지켜주는 안전 한계선',
    metaphor: '🧱 낭떠러지 바로 직전에 단단하게 설치되어 추락을 막아주는 안전한 방호벽',
    desc: '신체적 건강과 정신적 균형을 깨트리지 않도록 보이지 않는 무의식 수준에서 작동하는 규율과 한계의 보호등입니다.',
    action: '브레이크가 걸릴 때(토성이 제어할 때)는 불만을 갖지 말고 고요히 멈춰 서서 당신의 몸과 영혼을 재정비하십시오.'
  },
  '성찰과 절제 브레이크 [의식 토성]': {
    title: '성찰과 절제 브레이크 [의식 토성]',
    subtitle: '내 에고의 폭주를 막고 깊은 성찰로 돌려세우는 자각의 제동 장치',
    metaphor: '🛡️ 질주하는 마차가 길을 잃지 않도록 고삐를 묵직하게 쥐고 서 있는 마부의 지혜',
    desc: '삶에서 고난이나 브레이크가 걸렸을 때 "왜 나에게 이런 장애물이 생겼지?"가 아니라 "나를 더 크게 도약시키려는 성찰의 밤이구나"를 깨닫게 하는 내적 정지 장치입니다.',
    action: '절제의 순간이 다가왔다면 욕심을 내려놓고 침묵의 방으로 들어가 당신의 지혜를 더 날카롭게 연마하십시오.'
  },
  '무의식적 혁신력 [무의식 천왕성]': {
    title: '무의식적 혁신력 [무의식 천왕성]',
    subtitle: '기존의 질서를 뚫고 솟구치는 예측 불가능한 천재적 행동 파동',
    metaphor: '🌋 아무도 예상하지 못한 순간 지각을 뚫고 뿜어 나오는 푸른 용암의 줄기',
    desc: '낡은 패러다임을 한순간에 부수고 본능적으로 세상을 향해 쏟아내는 내 신체적 독창성과 돌연변이적 혁신성입니다.',
    action: '남들의 평범한 기준에 나를 억지로 끼워 맞추어 스스로의 특별함을 짓밟지 마십시오.'
  },
  '독창적 혁신 주파수 [의식 천왕성]': {
    title: '독창적 혁신 주파수 [의식 천왕성]',
    subtitle: '세상이 가지 않은 길을 나만의 개성으로 뚫어내는 번뜩이는 영감',
    metaphor: '⚡ 캄캄한 안개 속 세상을 단 한숨에 대낮처럼 밝히며 번쩍이는 푸른 번개',
    desc: '기존의 해묵은 이론과 규칙을 완전히 건너뛰어, 나만의 독보적이고 엉뚱한 창조력으로 세상을 뒤흔드는 혁신 주파수입니다.',
    action: '당신만의 엉뚱하고 독창적인 발상(천왕성 코드)을 신뢰하십시오. 그것이야말로 세상을 일깨울 우주적 힌트입니다.'
  },
  '무의식적 존재 베일 [무의식 해왕성]': {
    title: '무의식적 존재 베일 [무의식 해왕성]',
    subtitle: '나조차 쉽게 침범할 수 없는 내 무의식 속 깊은 영적 비밀의 샘',
    metaphor: '🌫️ 깊은 새벽, 은빛 안개가 고요히 내려앉아 신비를 품은 깊은 산속의 호수',
    desc: '나의 유전자 깊은 곳에 깃든 우주적 직관과 예술적 영감의 시원지이자, 평생토록 경외하며 탐험해야 할 내적 심연입니다.',
    action: '명확한 논리로 모든 것을 해명하려 들지 마세요. 신비의 안개를 가만히 안아줄 때 진짜 평화가 도래합니다.'
  },
  '직관의 영감 수용력 [의식 해왕성]': {
    title: '직관의 영감 수용력 [의식 해왕성]',
    subtitle: '우주의 소리 없는 지혜를 스펀지처럼 흡수하는 직관의 안테나',
    metaphor: '📻 허공을 떠돌아다니는 보이지 않는 미세한 클래식 음악 전파를 캐치하는 진공관 라디오',
    desc: '머리로 추론하지 않고 한순간에 우주의 흐름을 수용하고 이해하는 신성한 영감력과 감수성입니다.',
    action: '논리에 가로막혀 가슴의 소리(해왕성)를 무시하지 마십시오. 가만히 눈을 감을 때 귀에 머무는 우주의 음성이 진실입니다.'
  },
  '무의식적 시각 공백 [무의식 명왕성]': {
    title: '무의식적 시각 공백 [무의식 명왕성]',
    subtitle: '새로운 의식의 부활을 위해 도달해야 하는 무의식의 캄캄한 고요함',
    metaphor: '🥚 껍질을 깨뜨리고 새롭게 태어나기 위해 고치 속에서 겪는 절대적인 어둠과 적막',
    desc: '내 자아의 껍질이 다 깨어지고 죽은 뒤, 오직 순수한 생명력만 남아 새롭게 부활하기를 기다리는 신성한 고치(Cocoon) 단계입니다.',
    action: '삶이 캄캄해 보이고 길이 안 보인다면, 그것은 당신이 무너지기 위함이 아니라 가장 찬란하게 부활하기 전의 영적 밤일 뿐입니다.'
  },
  '영적 깊은 진실의 불꽃 [의식 명왕성]': {
    title: '영적 깊은 진실의 불꽃 [의식 명왕성]',
    subtitle: '죽음과 부활을 거쳐 마침내 찾아내는 인생의 단 하나의 불멸의 진실',
    metaphor: '🌋 마음 밑바닥 가장 어둡고 깊은 암석 아래서 요동치며 타오르는 영원한 지구의 화로',
    desc: '모든 가짜 위선과 껍데기가 불타 없어진 뒤, 내 영혼 밑바닥에 남아 있는 위대하고 순수한 의식의 참모습이자 용광로입니다.',
    action: '가짜 명성과 타인의 기준에 속지 마십시오. 당신의 삶에서 영원히 불타오를 진짜 내면의 불꽃을 응시하십시오.'
  },
  '1ST HALF': {
    title: '1ST HALF : 갈등 수용과 자각 축적기',
    subtitle: '겨울의 차가운 대지 아래서 묵묵히 뿌리 뻗는 고독한 씨앗의 시간',
    metaphor: '🌱 눈보라 속에서 대지 깊숙이 뻗어나가는 굳건한 뿌리',
    desc: '세상의 거친 파도와 관계의 소용돌이 속에서 부딪치고 깨어지며, 스스로를 둘러싼 단단한 에고의 껍질을 부수고 영혼의 뿌리를 내리는 시기입니다. 겉보기에는 갈등과 시련처럼 느껴지는 일상의 모든 아픔들은, 사실 당신이라는 아름다운 그릇을 더 크고 단단하게 빚어내기 위해 대자연이 준비한 신비로운 진흙탕의 축복이자 거름입니다.',
    action: '외부의 거센 충동에 무의식적으로 튕겨 나가는 대신, 3초간 가만히 숨을 고르며 마음의 일렁임을 고요히 안아주세요. "나를 지켜주느라 참 애썼구나"라며 스스로를 따뜻하게 품어줄 때, 비로소 진짜 자각(주파수 관점 재배선)의 주파수가 켜집니다.'
  },
  '2ND HALF': {
    title: '2ND HALF : 자비 반조와 천명 만개기',
    subtitle: '어두운 밤바다를 묵묵히 비춰 배들의 길을 잡아주는 황금빛 등대의 지혜',
    metaphor: '⚓ 밤바다를 수놓는 찬란한 등대의 황금빛 아우라와 우주의 숲',
    desc: '인생의 혹독한 겨울과 벼랑 끝 같았던 중대한 전환점을 기어이 통과한 뒤, 마침내 내면 깊은 심연에서 건져 올린 순수한 자각의 빛으로 세상 사람들의 어두운 아픔을 어루만지고 치유하는 성숙의 시기입니다. 내가 먼저 아파 보았기에 상처받은 타인의 고통을 아무런 편견 없이 자비롭게 안아줄 수 있는 거대한 하늘의 가슴이 활짝 열립니다.',
    action: '더 이상 나 하나의 안위와 이기적인 에고 증명(다크코드)에 연연하지 마십시오. 당신 고유의 천명 코드를 온 세상을 향해 맑게 방사할 때, 우주는 기적 같은 순풍과 함께 당신의 삶을 영원한 축복과 만개의 영역으로 안내할 것입니다.'
  }
};

// 주역 6효의 단계적 의미 사전 정의
const LINE_GUIDE_DATA: Record<number, { title: string; subtitle: string; desc: string; metaphor: string; action: string }> = {
  1: {
    title: '1효: 기초 탐색가 (The Investigator)',
    subtitle: '튼튼한 주춧돌을 만드는 연구의 시간',
    metaphor: '🧱 건물의 단단한 주춧돌, 깊은 우물 파기',
    desc: '섣불리 움직이지 않고 아래에서 묵묵히 기초를 닦고 조사하는 단계입니다. 스스로 깊은 확신을 가지기 전까지 충분히 배우고 연마할 때 가장 빛납니다.',
    action: '조급하게 나설 필요가 없습니다. 모르는 것은 충분히 공부하고 내적 확신(기초)을 먼저 탄탄하게 쌓아보세요.'
  },
  2: {
    title: '2효: 자연적 천재 (The Hermit)',
    subtitle: '배우지 않아도 흘러나오는 본능적 재능',
    metaphor: '💡 가르쳐주지 않아도 피어나는 야생화의 자연스러운 향기',
    desc: '내가 억지로 애써서 능력을 증명하려 하지 않아도, 남들이 나조차 모르는 나의 천재성을 알아채고 불러내(Call) 주는 단계입니다. 자연스럽게 뿜어져 나오는 재능의 매력입니다.',
    action: '억지로 애쓰지 마세요. 가만히 내 일에 몰두하고 있으면, 당신이 필요한 사람들이 당신의 문을 두드릴 것입니다.'
  },
  3: {
    title: '3효: 경험적 모험가 (The Martyr)',
    subtitle: '시행착오를 통해 무엇이 진짜인지 밝혀내는 힘',
    metaphor: '🧗 넘어져도 오뚝이처럼 일어나는 모험가, 우주적 베타테스터',
    desc: '머리로만 이해하는 지식이 아니라, 직접 부딪히고 실패하며 "어떤 것이 통하고 안 통하는지" 온몸으로 경험하는 단계입니다. 실수와 실패는 결함이 아니라 세상을 향한 위대한 적응의 나침반입니다.',
    action: '실패를 두려워 마세요. "아, 이 방법은 안 통하는구나"를 배운 것 자체가 세상을 위한 엄청난 발견이자 번영의 밑거름입니다.'
  },
  4: {
    title: '4효: 신뢰 전파자 (The Opportunist)',
    subtitle: '마음을 이어 다리를 놓는 사교와 네트워크',
    metaphor: '🤝 사람과 사람 사이를 따뜻하게 잇는 상생의 징검다리',
    desc: '나와 오랜 신뢰 관계를 맺어 온 지인이나 공동체 네트워크를 통해 기회와 상생을 얻고 영향력을 전파하는 단계입니다. 억지 영업이나 낯선 이와의 거래보다, 내 곁의 사람들과 깊은 우정을 쌓는 것이 핵심입니다.',
    action: '가장 가까운 사람들에게 우정과 진심을 표현해 보세요. 당신의 기회는 그 따뜻한 신뢰 네트워크를 타고 찾아옵니다.'
  },
  5: {
    title: '5효: 해결사 리더 (The Heretic)',
    subtitle: '기대를 한 몸에 받고 문제를 해결하는 천명 투사',
    metaphor: '🎯 위기의 현장에 깃발을 꽂고 질서를 바로 세우는 최고 사령관',
    desc: '위기에 빠진 대중이 당신을 바라볼 때, 현실적이고 실용적인 해법을 제시하여 문제를 한숨에 해결하는 영향력의 단계입니다. 사람들의 무의식적 기대치가 높아 영웅이 되거나 오해를 사기도 하는 드라마틱한 자리입니다.',
    action: '타이밍을 보아 실용적인 해법을 당당하게 제시하세요. 사람들의 기대를 투사받는 자리이므로 경계를 지키고 단호한 바운더리를 갖는 것도 중요합니다.'
  },
  6: {
    title: '6효: 도인 관찰자 (The Role Model)',
    subtitle: '내 껍질을 벗고 전체를 비추는 정신적 등대',
    metaphor: '🦅 지붕 위, 혹은 하늘 높이 날아 세상을 굽어보는 관조자',
    desc: '개인적인 욕망과 투쟁에서 한 걸음 물러나, 지붕 위에서 세상 전체가 굴러가는 흐름을 고요히 관찰하는 단계입니다. 인생의 수많은 모험을 거친 후 마침내 타인에게 모범이 되는 참된 인생 모델 역할을 합니다.',
    action: '당장의 작은 이해타산에 일희일비하지 마세요. 더 높은 시야에서 전체 흐름을 바라보며, 사람들에게 방향을 조용히 일러주는 등대의 지혜를 켜십시오.'
  }
};

// 명심 3대 핵심 기질 재능 감동 은유 에세이 사전 정의
const TALENT_ESSAY_DATA: Record<string, { title: string; subtitle: string; desc: string; metaphor: string; content: string }> = {
  '감정 소통': {
    title: '감정 소통',
    subtitle: '마음의 거문고를 타며 오로라를 빚어내는 빛의 시인',
    desc: '내 기분과 감정을 참되게 표현하는 힘',
    metaphor: '🎻 내면의 프리즘을 통과해 빛나는 일겁 빛깔 오로라',
    content: '감정은 부끄러워하거나 감추어야 할 그늘이 아닙니다. 경윤님의 감정 소통 점수가 76점이라는 것은, 가슴 속에 세상 그 누구보다 섬세하고 빛나는 프리즘이 설치되어 있음을 뜻합니다.\n\n때로는 슬픔의 빗방울이, 때로는 기쁨의 햇살이 찾아올 때 경윤님은 그것을 억누르지 않고 자신의 언어와 따뜻한 눈빛, 그리고 글을 통해 세상에 오로라처럼 아름답게 투사해낼 수 있는 타고난 전달자입니다. 감정을 억지로 통제하려 하기보다, 내 마음의 거문고가 연주하는 멜로디를 있는 그대로 신뢰해 주세요.\n\n경윤님이 내뿜는 솔직하고 따뜻한 파동은 주변 사람들의 꽁꽁 얼어붙은 감정의 빗장을 녹이고, 서로의 마음을 보이지 않는 주파수로 단단하게 연결해 주는 치유의 다리가 되어줄 것입니다. ✨'
  },
  '비즈니스 본능': {
    title: '비즈니스 본능',
    subtitle: '마을 사람들의 목마름을 해소해 주는 지혜로운 옹달샘 개척자',
    desc: '대중의 필요와 가치를 파악하여 연결하는 힘',
    metaphor: '🧭 바다의 조류와 바람의 방향을 온몸으로 감지하는 항해사',
    content: '비즈니스 본능 80점은 단순히 돈을 버는 기술을 넘어, 사람들이 정말로 무엇에 목말라하고 아파하는지 그 결핍과 갈망의 냄새를 본능적으로 감지하는 따뜻한 레이더입니다.\n\n경윤님은 세상이라는 넓은 숲에서 사람들이 길을 잃고 헤매고 있을 때, 그들이 필요로 하는 진짜 옹달샘(가치와 해결책)이 어디에 있는지 정확히 짚어내고, 그곳을 향해 상생의 길을 뚫어주는 놀라운 구심점 역할을 합니다.\n\n이 재능은 강요하거나 계산하는 머리에서 나오는 것이 아닙니다. 상대의 입장에 서서 그 영혼의 주파수를 다정하게 바라볼 때 자연스럽게 솟구치는 지혜입니다. 경윤님이 제안하는 솔루션은 대중에게 단순한 상품이 아니라, 그들의 삶을 더 나은 방향으로 인도하는 고마운 선물이 될 것입니다. 🌟'
  },
  '현존감': {
    title: '현존감',
    subtitle: '흘러가는 구름에 구애받지 않고 고요히 자리를 지키는 영원의 태산',
    desc: '과거와 미래의 불안을 지우고 지금 현존하는 힘',
    metaphor: '🧱 폭풍우가 몰아쳐도 흔들림 없이 바다 한가운데 우뚝 서 있는 등대',
    content: '현존감 67점은 경윤님이 인생의 거친 파도 속에서도 언제든 \'지금 이 순간\'이라는 고요한 닻을 내릴 수 있는 내적 회복 탄력성을 지니고 있음을 보여줍니다.\n\n에고는 끊임없이 지나간 과거의 후회로 경윤님을 흔들고, 오지도 않은 미래의 불안으로 마음을 졸이게 만들지만, 경윤님은 깊은 호흡 한 번으로 그 모든 먹구름을 흩날려 보내고 맑은 하늘로 우뚝 설 수 있는 굳건한 정신의 뼈대를 품고 있습니다.\n\n67점이라는 수치는 결코 부족함이 아니라, 거센 바람 속에서도 언제든 맑은 중심을 쥐고 다시 현재로 복귀할 수 있는 튼튼한 알아차림의 발판이 이미 완성되어 있음을 의미합니다. 불안이 파도처럼 밀려올 때마다 가만히 손을 가슴에 얹고 느껴보세요. "나는 지금 안전하다." 이 짧은 현존의 선언 하나가 경윤님의 온몸을 우주의 조화로운 주파수와 일치시켜 줄 것입니다. 🍀'
  }
};

export default function Myeongsim64KeysModal({ isOpen, onClose, userProfile }: Myeongsim64KeysModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [docentLoading, setDocentLoading] = useState(false);
  const [docentContent, setDocentContent] = useState<string | null>(null);
  const [docentCooldown, setDocentCooldown] = useState(0); // 쿨다운 남은 초
  const lastDocentCallRef = useRef<number>(0); // 마지막 API 호출 타임스탬프
  const [showExplainHelp, setShowExplainHelp] = useState(false);
  const [showLineHelp, setShowLineHelp] = useState<number | null>(null);
  const [showConceptHelp, setShowConceptHelp] = useState<string | null>(null);
  const [activeDarkScore, setActiveDarkScore] = useState<number>(75);
  const [activeAwareScore, setActiveAwareScore] = useState<number>(25);
  const [selectedMyeongliTerm, setSelectedMyeongliTerm] = useState<string | null>(null);
  const [showMyeongliModal, setShowMyeongliModal] = useState(false);

  const handleMyeongliClick = (term: string) => {
    setSelectedMyeongliTerm(term);
    setShowMyeongliModal(true);
  };
  
  // 타임라인 년도별 분석용 상태들
  const [timelineTab, setTimelineTab] = useState<'wealth' | 'love' | 'work'>('wealth');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [showYearDetailModal, setShowYearDetailModal] = useState<boolean>(false);
  const [showMicroPassModal, setShowMicroPassModal] = useState<boolean>(false);
  const [showTimelineChart, setShowTimelineChart] = useState(false);
  const [selectedBalanceAct, setSelectedBalanceAct] = useState<any>(null);
  const [selectedFrequencyDetail, setSelectedFrequencyDetail] = useState<string | null>(null);

  // 사용자의 사주 고유 시드값 계산
  const userSeed = useMemo(() => {
    if (!data) return 0;
    const pillars = data.saju?.fourPillars;
    if (!pillars) return 0;

    const allChars = [
      pillars.year?.ganKor, pillars.year?.jiKor,
      pillars.month?.ganKor, pillars.month?.jiKor,
      pillars.day?.ganKor, pillars.day?.jiKor,
      pillars.time?.ganKor, pillars.time?.jiKor,
    ].filter(Boolean);

    let seed = 0;
    for (const ch of allChars) {
      for (let i = 0; i < ch.length; i++) {
        seed += ch.charCodeAt(i);
      }
    }
    return seed;
  }, [data]);

  // 사용자의 생년월일 기준 실제 사주 대운(교운기) 전환점 연도 계산
  const turningYear = useMemo(() => {
    const daewoonList = data?.saju?.daewoonList;
    
    let currentAge = 30;
    let birthYear = 1996;
    if (data?.birthDate) {
      try {
        birthYear = new Date(data.birthDate).getFullYear();
        const currentYear = new Date().getFullYear();
        currentAge = currentYear - birthYear;
      } catch {}
    }

    // 만 38세 기준으로 분기 (젊은 층은 만 30세 타겟, 중장년층은 만 50세 타겟)
    const ageTargetOffset = currentAge < 38 ? 30 : 50;

    if (!daewoonList || daewoonList.length === 0) {
      if (!data?.birthDate) return 2032;
      return birthYear + ageTargetOffset;
    }

    try {
      const targetYear = birthYear + ageTargetOffset;

      // 타겟 연도와 가장 가까운 실제 대운(교운기) 시작 연도를 검색
      let bestYear = daewoonList[0].startYear;
      let minDiff = Math.abs(bestYear - targetYear);

      for (const dw of daewoonList) {
        const diff = Math.abs(dw.startYear - targetYear);
        if (diff < minDiff) {
          minDiff = diff;
          bestYear = dw.startYear;
        }
      }
      return bestYear;
    } catch {
      const idx = currentAge < 38 ? 3 : 5;
      return daewoonList[idx]?.startYear || (birthYear + ageTargetOffset);
    }
  }, [data]);

  // 선택 연도의 상세 운세 감동 해설을 동적 생성
  const getYearDetailAnalyses = (yr: number, activeInfo: any) => {
    if (!activeInfo) return { wealthTxt: '', loveTxt: '', workTxt: '' };
    
    const dayGan = data?.saju?.fourPillars?.day?.gan || '신';
    const elementMap: Record<string, string> = { '갑': '목', '을': '목', '병': '화', '정': '화', '무': '토', '기': '토', '경': '금', '신': '금', '임': '수', '계': '수' };
    const myElement = elementMap[dayGan] || '금';
    
    // 오행별 은유적 묘사
    const elementMetaphor: Record<string, string> = {
      '목': '🌳 푸른 숲을 향해 뻗어나가는 굳건한 한 그루의 소나무',
      '화': '🔥 어두운 세상을 환히 밝히는 따뜻한 모닥불과 태양',
      '토': '⛰️ 흔들림 없이 수많은 생명을 안아주는 웅장한 대지',
      '금': '💎 오랜 압력을 이겨내고 스스로를 완성한 눈부신 다이아몬드',
      '수': '🌊 좁은 골짜기를 지나 마침내 대해로 유연하게 흘러가는 생명수'
    };
    
    const myMetaphor = elementMetaphor[myElement] || '💎 눈부신 원석';

    // 재운(Wealth) 비유
    const wealthScore = activeInfo.wealth;
    let wealthTxt = '';
    if (wealthScore < 50) {
      wealthTxt = `내 영혼의 기름진 대지(${myElement})에 비축해 둔 씨앗들이 겨울 눈보라를 견디며 땅속 깊이 묵묵히 뿌리를 밀어 넣는 소중한 적립의 철학적 겨울입니다. 당장은 수확이 눈에 띄지 않더라도, 이는 곧 다가올 거대한 재정적 번영의 그릇을 단단하게 넓히기 위해 내실의 창고를 비우고 재정비하는 고귀한 우주적 안식기입니다. 수치에 연연하기보다 흙 속에 조용히 숨 쉬는 생명력과 가능성을 응시해 주세요.`;
    } else if (wealthScore < 75) {
      wealthTxt = `따스한 봄비와 온화한 햇살이 메마른 영토 위에 부드럽게 스며들어, 당신이 인내로 가꾸어 온 주체적 성장의 싹이 대지 껍질을 뚫고 연록색 고유의 이파리를 힘차게 내미는 희망찬 자립의 계절입니다. 맑은 기운 흐름 속에서 재정적 자립도가 점진적이고 윤택한 우상향 흐름을 타기 시작하여, 흔들리지 않는 나만의 견고한 경제적 안전 기틀이 훌륭하게 축적되어 갑니다.`;
    } else {
      wealthTxt = `마침내 풍성하게 물결치는 황금빛 이삭들이 벌판을 가득 채우고, 오랜 훈련을 통해 쌓인 자각의 지혜가 거대한 재정적 번영과 결실로 환하게 폭발하는 눈부신 추수의 대풍년기입니다. ${myMetaphor} 본연의 맑은 창조성이 세상과 온전히 맞물리며, 억지로 소유하려 집착하지 않아도 필요한 풍요와 자원이 마르지 않는 영원의 샘물처럼 아름답게 순환하는 기적을 낳습니다.`;
    }

    // 연애/관계(Love) 비유
    const loveScore = activeInfo.love;
    let loveTxt = '';
    if (loveScore < 50) {
      loveTxt = `외부 관계의 시끄러운 소음과 먼지를 후후 털어내고, 오직 나 자신의 참된 영혼을 비추는 맑고 외로운 고요의 호숫가를 응시하는 치유의 밤입니다. 겉보기에는 고독하고 외로운 동굴 같지만, 밖으로 흩어지던 애정 결핍의 시선을 내면으로 돌려 나 자신을 가장 극진하고 따뜻하게 안아주는 '참된 자비와 상생'의 기초 뼈대를 세우는 신비로운 영혼의 충전 기간입니다.`;
    } else if (loveScore < 75) {
      loveTxt = `맑은 유리거울 위에 서로의 진실을 투명하게 비추어 보듯, 에고의 불필요한 위선과 방어 경계를 허물고 상대방과 진실하고 성숙한 소통을 조율해 가는 다정하고 유연한 보정기입니다. 따뜻한 자각의 주파수가 활성화되어 주변 인맥들과 오해 없이 조화롭게 신뢰를 쌓아가는 든든한 상생의 평화 네트워크가 완성됩니다.`;
    } else {
      loveTxt = `억지로 마음을 갈구하거나 증명하지 않아도, 온전하게 빛나는 당신 고유의 아름다운 영혼 아우라에 공명하여 인생의 소중한 귀인과 평생을 함께할 영혼의 동반자가 붉은 꽃길을 밟듯 자연스럽게 당신의 마당으로 찾아오는 인연 만개의 황금기입니다. 조건 없는 순수한 참사랑과 가슴 따뜻한 영적 연대가 온 사방으로 황금빛 파동을 일으킵니다.`;
    }

    // 사업/일(Work) 비유
    const workScore = activeInfo.work;
    let workTxt = '';
    if (workScore < 50) {
      workTxt = `낡고 무거운 구조의 댐을 뚫고 지나가기 위해, 고요한 밤의 연구소처럼 나만의 독립적 비즈니스 설계도를 정밀하게 구상하고 조립해 가는 단단한 준비의 기초기입니다. 조급하게 열매를 탐하기보다는, 나다움을 훌륭하게 무기로 제련하기 위해 실력과 숙련도를 묵묵히 쌓으십시오. 이것은 곧 하늘을 뚫고 비상하기 전 활주로를 힘차게 달리는 축복의 시작점입니다.`;
    } else if (workScore < 75) {
      workTxt = `수많은 시행착오라는 보물 상자를 밟고 가며, 내게 진짜 맞물리는 천명 비즈니스의 아키타입이 무엇인지 정교하고 유연하게 베타 테스트해 가는 실험과 숙련의 계절입니다. 겪는 모든 보정의 시행착오는 좌절이 아닌 최적의 정답 지점을 고정해 주는 소중한 길잡이가 되며, 이때 벼려진 내공이 거대한 상생 사업을 이끌어 줍니다.`;
    } else {
      workTxt = `당신이 일생을 거쳐 벼려 온 본질적인 솔루션과 가치 철학이 대중과 사회의 절실한 목마름과 조우하며, 큰 사회적 평판과 기적적인 비상의 도약을 선물 받는 축복의 절정기입니다. 억지 노동과 투쟁이 아닌, 존재 자체로 세상의 문제를 부드럽게 해결해 주는 문제 해결사의 리더로서 명예와 찬란한 번영이 세상에 널리 방사됩니다.`;
    }

    return { wealthTxt, loveTxt, workTxt };
  };

  // 타임라인 데이터 연동
  const timelineData = useMemo(() => {
    if (!data) return [];
    const pillars = data.saju?.fourPillars;
    if (!pillars) return [];

    const allChars = [
      pillars.year?.ganKor, pillars.year?.jiKor,
      pillars.month?.ganKor, pillars.month?.jiKor,
      pillars.day?.ganKor, pillars.day?.jiKor,
      pillars.time?.ganKor, pillars.time?.jiKor,
    ].filter(Boolean);

    let seed = 0;
    for (const ch of allChars) {
      for (let i = 0; i < ch.length; i++) {
        seed += ch.charCodeAt(i);
      }
    }

    // 1. 사주 오행 수집 및 십성 산출
    const SAJU_CHARS_MAP: Record<string, string> = {
      '갑': '목', '을': '목', '병': '화', '정': '화', '무': '토', '기': '토', '경': '금', '신': '금', '임': '수', '계': '수',
      '자': '수', '축': '토', '인': '목', '묘': '목', '진': '토', '사': '화', '오': '화', '미': '토', '유': '금', '술': '토', '해': '수'
    };

    const dayGan = pillars.day?.ganKor || '신';
    const dayMasterElement = SAJU_CHARS_MAP[dayGan] || '금';

    // 생극 십성 맵 정의
    const GENERATE_MAP: Record<string, string> = { '목': '화', '화': '토', '토': '금', '금': '수', '수': '목' };
    const CONTROL_MAP: Record<string, string> = { '목': '토', '토': '수', '수': '화', '화': '금', '금': '목' };

    const generatedByMaster = GENERATE_MAP[dayMasterElement] || '수';
    const controlledByMaster = CONTROL_MAP[dayMasterElement] || '목';
    const gwanElement = Object.keys(CONTROL_MAP).find((k) => CONTROL_MAP[k] === dayMasterElement) || '화';
    const inElement = Object.keys(GENERATE_MAP).find((k) => GENERATE_MAP[k] === dayMasterElement) || '토';

    const elementCounts: Record<string, number> = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 };
    for (const ch of allChars) {
      const el = SAJU_CHARS_MAP[ch];
      if (el) {
        elementCounts[el] += 1;
      }
    }

    const bigeop = elementCounts[dayMasterElement] || 0;
    const sigsang = elementCounts[generatedByMaster] || 0;
    const jaeseong = elementCounts[controlledByMaster] || 0;
    const gwanseong = elementCounts[gwanElement] || 0;
    const inseong = elementCounts[inElement] || 0;

    // 사주 오행 분포 기반 맞춤형 Base 점수 산출
    const gender = data.inputInfo?.gender || 'male';
    const baseWealth = 32 + jaeseong * 7 + sigsang * 3 + (seed % 4);
    const baseLove = 34 + (gender === 'female' ? gwanseong * 8 : jaeseong * 8) + bigeop * 2 + (seed % 4);
    const baseWork = 30 + gwanseong * 6 + sigsang * 4 + inseong * 2 + (seed % 4);

    const isFirstHalf = showConceptHelp?.includes('1ST HALF');
    const startYear = isFirstHalf ? turningYear - 6 : turningYear;
    const endYear = isFirstHalf ? turningYear : turningYear + 6;
    const years: number[] = [];
    for (let y = startYear; y <= endYear; y++) {
      years.push(y);
    }

    // 60갑자 세운 천간/지지 오행 맵 (2024 甲辰년 ~ 2035 乙卯년)
    const YEAR_GANJI_ELEMENTS: Record<number, { ganEl: string; jiEl: string; name: string }> = {
      2024: { ganEl: '목', jiEl: '토', name: '갑진' },
      2025: { ganEl: '목', jiEl: '화', name: '을사' },
      2026: { ganEl: '화', jiEl: '화', name: '병오' },
      2027: { ganEl: '화', jiEl: '토', name: '정미' },
      2028: { ganEl: '토', jiEl: '금', name: '무신' },
      2029: { ganEl: '토', jiEl: '금', name: '기유' },
      2030: { ganEl: '금', jiEl: '토', name: '경술' },
      2031: { ganEl: '금', jiEl: '수', name: '신해' },
      2032: { ganEl: '수', jiEl: '수', name: '임자' },
      2033: { ganEl: '수', jiEl: '토', name: '계축' },
      2034: { ganEl: '목', jiEl: '목', name: '갑인' },
      2035: { ganEl: '목', jiEl: '목', name: '을묘' }
    };

    return years.map((yr) => {
      // 해당 연도 세운 오행 추출
      const yearInfo = YEAR_GANJI_ELEMENTS[yr] || { ganEl: (yr % 2 === 0 ? '목' : '화'), jiEl: '토', name: `${yr}년` };
      const { ganEl, jiEl } = yearInfo;

      // 생극 십성 관계에 따른 파동 계산
      // 재운: 내가 극하는 오행(재성)이나 나를 생하는 오행(인성)이 세운에 올 때 재정적 결실 파동 상승
      let wealthMod = 0;
      if (ganEl === controlledByMaster || jiEl === controlledByMaster) wealthMod += 18; // 재성 세운: 대폭 상승
      if (ganEl === inElement || jiEl === inElement) wealthMod += 12; // 인성 세운: 안정적 보존
      if (ganEl === dayMasterElement || jiEl === dayMasterElement) wealthMod -= 8; // 비겁 세운: 경쟁/지출
      if (ganEl === generatedByMaster || jiEl === generatedByMaster) wealthMod += 8; // 식상 세운: 투자/발상

      // 연애/관계운: 관성(여성) 또는 재성(남성) 및 합/생 관계
      let loveMod = 0;
      const targetLoveEl = gender === 'female' ? gwanElement : controlledByMaster;
      if (ganEl === targetLoveEl || jiEl === targetLoveEl) loveMod += 20; // 배우자/연인운 직격 만개
      if (ganEl === inElement || jiEl === inElement) loveMod += 10;
      if (ganEl === generatedByMaster || jiEl === generatedByMaster) loveMod += 6;

      // 사업/직장운: 관성(직장/평판) & 식상(사업/기술) & 인성(계약/문서)
      let workMod = 0;
      if (ganEl === gwanElement || jiEl === gwanElement) workMod += 22; // 관성: 승진/명예/승승장구
      if (ganEl === generatedByMaster || jiEl === generatedByMaster) workMod += 15; // 식상: 신규 비즈니스 창출
      if (ganEl === inElement || jiEl === inElement) workMod += 12; // 인성: 라이선스/계약 성사

      // 주기적 인파동 삼합/충 파동 삼각함수 파동 추가 (단조로운 직선 사멸)
      const wavePhase = Math.sin((yr - turningYear) * 1.35 + (seed % 5));
      const cosPhase = Math.cos((yr - turningYear) * 1.1 + (seed % 7));

      let wealth = Math.round(baseWealth + wealthMod + wavePhase * 16 + (seed % 7) - 3);
      let love = Math.round(baseLove + loveMod + cosPhase * 18 + ((seed * yr) % 9) - 4);
      let work = Math.round(baseWork + workMod + wavePhase * 14 + cosPhase * 8 + ((seed + yr) % 7) - 2);

      // 25~98 사이로 clamp
      wealth = Math.min(98, Math.max(25, wealth));
      love = Math.min(98, Math.max(25, love));
      work = Math.min(98, Math.max(25, work));

      let comment = '';
      const dayGan = data?.saju?.fourPillars?.day?.gan || '신';
      const dayJi = data?.saju?.fourPillars?.day?.ji || '사';
      const myGanJi = dayGan + dayJi;
      const elementMap: Record<string, string> = { '갑': '목', '을': '목', '병': '화', '정': '화', '무': '토', '기': '토', '경': '금', '신': '금', '임': '수', '계': '수' };
      const myElement = elementMap[dayGan] || '금';

      // Seed를 활용한 동적 변형 패턴 (0 ~ 2)
      const patternIdx = (seed + yr) % 3;

      if (timelineTab === 'wealth') {
        if (yr === turningYear - 6) {
          const wealthPatterns = [
            `${turningYear - 6}년은 ${myGanJi} 일주 본연의 ${myElement} 기운이 새로운 변화를 맞이하며, 과거의 제한적 경제 패턴을 깨뜨리고 일어서는 운명적 자립의 첫걸음입니다. 일시적인 정비를 거쳐 재정적 독립도가 점진적으로 우상향하기 시작하는 대전환점입니다.`,
            `${turningYear - 6}년은 ${data.userName || '명심가'}님의 재물운 흐름에서 낡은 껍질이 벗겨지는 터닝포인트입니다. 당장은 재정적 재구성을 거치는 과정이지만, 이는 곧 주체적인 풍요를 향해 내딛는 위대한 자립의 기초가 될 것입니다.`,
            `${turningYear - 6}년은 무의식적 긴장을 풀고 현실적인 재물 흐름을 내 주체적 힘으로 쥐기 시작하는 해입니다. ${myElement}의 안정적인 토대 위에 자력으로 재정적 번영을 개척하기 시작하는 귀한 도약대입니다.`
          ];
          comment = wealthPatterns[patternIdx];
        } else if (yr > turningYear - 6 && yr < turningYear) {
          const midPatterns = [
            `${yr}년은 과도기적 갈등을 수용하며 ${myElement}의 내실을 다져 독립적인 경제 구조를 확립하는 시기입니다. 뇌신경의 조급함을 다스리고 차분히 자각 주파수를 적립하십시오.`,
            `${yr}년은 ${data.userName || '명심가'}님의 가치 창조력이 실질적 자원으로 축적되는 단계입니다. 외부 요동에 흔들리지 않고 재정적 자립도를 차분히 높여가는 것이 유리합니다.`,
            `${yr}년은 사주 오행의 균형 속에서 불필요한 지출을 통제하고 나만의 번영 에너지를 차곡차곡 모아가는 성찰과 적립의 황금 과도기입니다.`
          ];
          comment = midPatterns[patternIdx];
        } else if (yr === turningYear) {
          const peakPatterns = [
            `${turningYear}년은 대운의 문이 본격적으로 열리며 ${myGanJi}의 잠재 재물력이 폭발하는 시기입니다. 1ST HALF 동안 성실히 쌓아온 자각의 씨앗이 마침내 강력한 재정적 번영과 결실로 극대화됩니다.`,
            `${turningYear}년은 주역 주파수가 70점대 후반 이상으로 뛰어오르며, ${data.userName || '명심가'}님의 인생 후반기 번영이 강력한 자석처럼 재물과 기회를 끌어당기기 시작하는 해입니다.`,
            `${turningYear}년은 물질적 제약의 고리를 완전히 끊고 넓고 윤택한 ${myElement}의 대지로 진입하는 만개의 기점입니다. 자립의 훈련이 끝나고 풍요가 순리대로 안착합니다.`
          ];
          comment = peakPatterns[patternIdx];
        } else {
          const latePatterns = [
            `${yr}년은 천명 만개기의 절정으로, 재성의 우주 주파수가 80~90점대 수준으로 극대화됩니다. 기적 같은 풍요와 재산의 상생 번영이 자연스럽게 찾아옵니다.`,
            `${yr}년은 ${data.userName || '명심가'}님의 영적 성장이 실제 물질적 안정으로 투사되어, 애쓰지 않아도 원하는 자원과 재정이 원활히 순환되는 시기입니다.`,
            `${yr}년은 ${myGanJi} 특유의 뚝심과 지혜가 번영의 열매를 풍성하게 맺는 해입니다. 평화로운 축복 속에서 주변에 재정적 나눔과 상생을 실천하게 됩니다.`
          ];
          comment = latePatterns[patternIdx];
        }
      } else if (timelineTab === 'love') {
        if (yr <= turningYear - 6) {
          const loveEarly = [
            `${turningYear - 6}년은 주변의 불필요한 인맥 관계를 건강하게 정비하고 오직 내면의 ${myElement} 기운을 보듬으며 홀로서기를 완성하는 시기입니다. 나를 참되게 사랑하는 토대가 단단해집니다.`,
            `${turningYear - 6}년은 에고의 눈치와 긴장을 내려놓고 깊은 고요를 회복하는 시기입니다. 외면의 관심보다 내 가슴속 깊은 영혼의 알아차림과 먼저 연애하듯 소통하십시오.`,
            `${turningYear - 6}년은 관계의 군더더기를 털어내고 순백의 도화지 상태를 회복하는 해입니다. ${myGanJi}의 본연의 매력이 내실을 다져가는 중요한 시점입니다.`
          ];
          comment = loveEarly[patternIdx];
        } else if (yr > turningYear - 6 && yr < turningYear) {
          const loveMid = [
            `${yr}년은 내면의 맑은 거울을 통해 인간관계의 경계를 정비하고 조율하는 시기입니다. 성숙한 소통 방식을 연습하며 타인과의 주파수 조율 능력을 키웁니다.`,
            `${yr}년은 ${data.userName || '명심가'}님의 따뜻한 공감 능력이 영적인 성장을 거쳐 주변 사람들에게 잔잔한 신뢰의 물결로 다가가는 해입니다.`,
            `${yr}년은 무조건적인 끌림보다 서로의 가치관과 인생의 지향점을 묵묵히 공유할 수 있는 깊이 있는 연대를 실험하는 과도기입니다.`
          ];
          comment = loveMid[patternIdx];
        } else {
          const loveLate = [
            `${yr}년은 만개한 당신의 아우라에 이끌려 소중한 귀인과 영혼의 동반자가 자연스럽게 찾아오는 해입니다. 조건 없는 참사랑과 깊은 감정적 공명이 열립니다.`,
            `${yr}년은 ${myGanJi}의 매력 주파수가 극대화되어, 굳이 애써 구걸하지 않아도 내면의 풍요에 공명하는 아름다운 인연들이 자연스레 맺어지는 축복의 해입니다.`,
            `${yr}년은 ${data.userName || '명심가'}님을 아끼고 지지해주는 끈끈한 네트워크와 소울 파트너십이 활성화되어, 가슴 따뜻한 인생 후반기의 황금기를 보냅니다.`
          ];
          comment = loveLate[patternIdx];
        }
      } else {
        if (yr <= turningYear - 6) {
          const workEarly = [
            `${turningYear - 6}년은 기존의 낡은 구조를 깨트리고 독립적인 진로의 새로운 기틀을 마련하는 해입니다. 내실 있는 자립 의지가 생동하여 일의 소중한 첫 단추를 꿰게 됩니다.`,
            `${turningYear - 6}년은 ${myGanJi} 특유의 독창성을 바탕으로 나만의 독자적인 가치 창조 모델을 설계하는 해입니다. 무리하기보다 기초 체력과 시스템을 세우는 데 집중하십시오.`,
            `${turningYear - 6}년은 환경의 불확실성을 기회로 바꾸는 ${myElement}의 유연한 대처 능력이 빛나는 시기입니다. 주체적인 일의 싹이 비옥한 흙 속에서 움틉니다.`
          ];
          comment = workEarly[patternIdx];
        } else if (yr > turningYear - 6 && yr < turningYear) {
          const workMid = [
            `${yr}년은 다양한 시행착오(경험적 모험)를 밟아가며 나에게 진짜 맞는 비즈니스/직업 아키타입이 무엇인지 정교하게 보정해나가는 귀한 실험 기간입니다.`,
            `${yr}년은 자각의 지혜를 바탕으로 무모한 도전을 삼가고 내공과 기술력을 점진적으로 숙련시키는 단계입니다. 축적된 실력이 미래의 큰 번영을 약속합니다.`,
            `${yr}년은 ${data.userName || '명심가'}님의 일에서 독창적인 정체성이 서서히 뿌리를 내리는 해입니다. 조급한 성과 대신 나만의 브랜드를 차분히 키워내십시오.`
          ];
          comment = workMid[patternIdx];
        } else {
          const workLate = [
            `${yr}년은 당신의 고유한 천명 비즈니스 모델이 세상에 널리 알려지며 영향력이 극대화되는 황금기입니다. 억지 노력 없이도 내 솔루션이 명성을 낳습니다.`,
            `${yr}년은 ${myGanJi}의 전문적인 천재성이 빛을 발해, 공동체와 사회 내에서 리더이자 지혜로운 길잡이로서 우뚝 서는 영광과 번영의 해입니다.`,
            `${yr}년은 ${data.userName || '명심가'}님이 지닌 본질적인 비즈니스 주파수가 세상의 가려운 곳을 긁어주며, 큰 공헌과 함께 사회적 명예를 획득하는 비상의 해입니다.`
          ];
          comment = workLate[patternIdx];
        }
      }

      return { year: yr, wealth, love, work, comment };
    });
  }, [data, showConceptHelp, timelineTab]);

  // 타임라인 팝업 오픈 시 선택 연도 자동 정돈
  useEffect(() => {
    if (showConceptHelp) {
      if (showConceptHelp.includes('1ST HALF')) {
        setSelectedYear(turningYear - 6);
        setShowTimelineChart(false);
      } else if (showConceptHelp.includes('2ND HALF')) {
        setSelectedYear(turningYear);
        setShowTimelineChart(false);
      }
    }
  }, [showConceptHelp, turningYear]);

  const [selectedItem, setSelectedItem] = useState<{
    type: string;
    label: string;
    gate?: number;
    line?: number;
    score: number;
    dark: string;
    darkCodeText?: string;
    neural: string;
    neuralCodeText?: string;
    meta: string;
    metaCodeText?: string;
    metaphor?: string;
    content?: string;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  // [보안] 로컬 캐시 맵 — 중복 API 호출 방지
  const interpretCacheRef = useRef<Record<string, string>>({});

  const totalPages = 40;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 마운트 관리
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // CSS 키프레임 주입 (네온 입자 회전 및 성운 효과 전용)
  useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('myeongsim-premium-neon-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'myeongsim-premium-neon-styles';
      styleSheet.textContent = `
        @keyframes shimmer-glow {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-neon-bar {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
          background-size: 200% 100%;
          animation: shimmer-glow 3s infinite linear;
        }
        @keyframes ring-pulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 8px currentColor); }
          50% { transform: scale(1.05); filter: drop-shadow(0 0 20px currentColor); }
        }
        .animate-ring-pulse {
          animation: ring-pulse 4s infinite ease-in-out;
        }
        @keyframes nebula-flow {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          50% { transform: translate(-10px, 15px) scale(1.15); opacity: 0.6; }
        }
        .nebula-glow-1 {
          animation: nebula-flow 15s infinite ease-in-out;
        }
        .nebula-glow-2 {
          animation: nebula-flow 25s infinite ease-in-out reverse;
        }
        .ruler-tick {
          position: relative;
        }
        .ruler-tick::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          height: 4px;
          background-color: rgba(255,255,255,0.2);
        }
        .ruler-tick-major::after {
          height: 6px;
          background-color: rgba(255,255,255,0.5);
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, []);

  // 1. 천명분석 데이터 로드
  useEffect(() => {
    if (isOpen && userProfile) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await fetch('/api/coaching/myeongsim-64keys', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: userProfile.id,
              userName: userProfile.userName || userProfile.name,
              birthDate: userProfile.birthDate || userProfile.birthDateString,
              birthTime: userProfile.birthTime || userProfile.birthTimeString,
              calendarType: userProfile.calendarType || 'solar',
              gender: userProfile.gender || 'male'
            })
          });
          if (res.ok) {
            const result = await res.json();
            if (result.success) {
              setData(result);
            }
          }
        } catch (e) {
          console.error('Failed to fetch 64Keys analysis data:', e);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen, userProfile]);

  // 2. AI 도슨트 해설 호출 (하루 1회 캐시 + 쿨다운 보안 + 중복 요청 방지)
  const DOCENT_COOLDOWN_SEC = 30; // 30초 쿨다운

  // localStorage 기반 하루 1회 캐시 헬퍼
  const getTodayKey = () => new Date().toISOString().slice(0, 10); // "2026-06-29"

  const getDailyCache = (cacheKey: string): string | null => {
    try {
      const stored = localStorage.getItem(`docent::${cacheKey}`);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      if (parsed.date === getTodayKey()) return parsed.content;
      // 날짜가 다르면 만료된 캐시 삭제
      localStorage.removeItem(`docent::${cacheKey}`);
      return null;
    } catch { return null; }
  };

  const setDailyCache = (cacheKey: string, content: string) => {
    try {
      localStorage.setItem(`docent::${cacheKey}`, JSON.stringify({
        date: getTodayKey(),
        content
      }));
    } catch { /* localStorage 용량 초과 시 무시 */ }
  };

  const handleDocentRequest = async (item: any) => {
    if (!item || !data) return;
    
    // [보안] 로딩 중이면 추가 호출 차단
    if (docentLoading) return;

    // 캐시 키 정의
    const cacheKey = `${item.type}::${item.label}`;

    // [캐시] 1) 메모리 캐시 확인 (가장 빠름)
    if (interpretCacheRef.current[cacheKey]) {
      setSelectedItem(item);
      setDocentContent(interpretCacheRef.current[cacheKey]);
      return;
    }

    // [캐시] 2) localStorage 하루 캐시 확인 (같은 날이면 API 호출 안 함)
    const dailyCached = getDailyCache(cacheKey);
    if (dailyCached) {
      interpretCacheRef.current[cacheKey] = dailyCached; // 메모리에도 올림
      setSelectedItem(item);
      setDocentContent(dailyCached);
      return;
    }

    // [보안] 30초 쿨다운 — 새 API 호출 간 최소 간격 강제
    const now = Date.now();
    const elapsed = (now - lastDocentCallRef.current) / 1000;
    if (lastDocentCallRef.current > 0 && elapsed < DOCENT_COOLDOWN_SEC) {
      const remaining = Math.ceil(DOCENT_COOLDOWN_SEC - elapsed);
      setDocentCooldown(remaining);
      setSelectedItem(item);
      setDocentContent(`🛡️ 명심 AI 코치 보호 모드\n\n에너지 과부하를 방지하기 위해 ${remaining}초 후에 다시 해설을 요청해 주세요.\n\n잠시 호흡을 가다듬으며, 방금 읽은 해설을 마음속에서 되새겨 보는 시간을 가져보세요. ✨`);
      // 카운트다운 타이머
      const timer = setInterval(() => {
        setDocentCooldown(prev => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
      return;
    }
    lastDocentCallRef.current = now;

    setSelectedItem(item);
    setDocentLoading(true);
    setDocentContent(null);

    const sajuText = data.saju?.fourPillars 
      ? `년주: ${data.saju.fourPillars.year.gan}${data.saju.fourPillars.year.ji}, 월주: ${data.saju.fourPillars.month.gan}${data.saju.fourPillars.month.ji}, 일주: ${data.saju.fourPillars.day.gan}${data.saju.fourPillars.day.ji}, 시주: ${data.saju.fourPillars.time.gan}${data.saju.fourPillars.time.ji}`
      : '사주 정보 부족';

    try {
      const res = await fetch('/api/coaching/myeongsim-64keys/docent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: data.userName,
          sajuText,
          gongWang: data.saju?.gongWang || [],
          type: item.type,
          label: item.label,
          gate: item.gate,
          line: item.line,
          score: item.score,
          darkCodeText: item.dark,
          neuralCodeText: item.neural,
          metaCodeText: item.meta
        })
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.interpretation) {
          interpretCacheRef.current[cacheKey] = result.interpretation;
          setDailyCache(cacheKey, result.interpretation); // localStorage에 하루 캐시 저장
          setDocentContent(result.interpretation);
        } else {
          throw new Error(result.error || '해설 응답 오류');
        }
      } else {
        throw new Error('네트워크 연결 지연');
      }
    } catch (e) {
      console.error('Docent generation failed:', e);
      setDocentContent('우주 에너지를 해독하는 중 일시적인 연결 지연이 발생했습니다. 다시 한번 클릭해 주십시오.');
    } finally {
      setDocentLoading(false);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/95 backdrop-blur-lg p-2 sm:p-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 15 }}
          className="w-full max-w-lg h-[94dvh] sm:h-[88vh] max-h-[96dvh] sm:max-h-[900px] bg-[#020205] border border-purple-500/20 rounded-[28px] sm:rounded-[36px] shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col relative overflow-hidden text-left"
        >
          <div className="absolute top-[-20%] left-[-20%] w-[450px] h-[450px] bg-gradient-to-tr from-purple-600/10 to-indigo-600/5 rounded-full blur-[120px] pointer-events-none nebula-glow-1" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[450px] h-[450px] bg-gradient-to-bl from-pink-600/5 to-amber-500/10 rounded-full blur-[120px] pointer-events-none nebula-glow-2" />

          {/* 럭셔리 헤더 - 정밀 슬림 피팅 및 특허 뱃지 탑재 */}
          <header className="px-3 sm:px-3.5 py-2.5 sm:py-3 border-b border-amber-500/20 flex items-center justify-between z-10 bg-gradient-to-r from-slate-950 via-purple-950/90 to-slate-950 backdrop-blur-xl shrink-0 select-none shadow-2xl">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden min-w-0">
              <span className="text-base sm:text-lg shrink-0 p-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">🌌</span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <h2 className="text-xs sm:text-sm font-black text-white tracking-tight truncate">
                    의식지도 정밀 리포트
                  </h2>
                  <span className="text-[8px] sm:text-[8.5px] bg-gradient-to-r from-amber-400 to-amber-600 text-black px-1.5 py-0.5 rounded-full font-black shadow shrink-0">
                    Premium
                  </span>
                </div>
                <p className="text-[7.5px] sm:text-[8.5px] text-amber-300 font-mono mt-0.5 truncate">
                  🏛️ 특허출원중 제10-2025-0166877호
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 ml-1">
              <button
                onClick={() => setShowMicroPassModal(true)}
                className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-[9.5px] sm:text-[10px] shadow-[0_0_15px_rgba(245,158,11,0.35)] transition-all active:scale-95 flex items-center gap-1 cursor-pointer whitespace-nowrap border border-amber-400/40"
              >
                <Zap size={10} className="text-amber-300 animate-pulse fill-amber-300" />
                <span>⚡ 890원 처방 ➔</span>
              </button>
              <button
                onClick={onClose}
                className="p-1 sm:p-1.5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all active:scale-95 border border-white/10"
              >
                <X size={15} />
              </button>
            </div>
          </header>

          {!loading && data && (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
              {/* 스크롤 패딩 모바일 터치 스무스 및 dvh 호흡 최적화 */}
              <div 
                className="flex-1 overflow-y-auto px-3.5 sm:px-4 pt-3.5 sm:pt-5 pb-5 sm:pb-4 space-y-3.5 sm:space-y-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="h-full flex flex-col space-y-4"
                  >
                    {currentPage === 1 && (
                      <div className="flex-1 flex flex-col justify-between py-4 select-none">
                        <div className="space-y-3 text-center">
                          <div className="relative inline-block">
                            <span className="text-5xl animate-pulse block">🗺️</span>
                            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl animate-ping opacity-50" />
                          </div>
                          <h1 className="text-lg sm:text-xl font-black bg-gradient-to-r from-amber-200 via-purple-200 to-indigo-100 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(245,158,11,0.4)] tracking-tight">
                            동양학·심리 과학 융합 의식지도 정밀 진단서
                          </h1>
                          <p className="text-[9.5px] text-amber-300 font-mono tracking-widest uppercase font-bold">MYEONGSIM CONSCIOUSNESS REPORT</p>
                        </div>

                        {/* 24K 럭셔리 수검자 명심 프로필 카드 */}
                        <div className="bg-gradient-to-br from-amber-950/40 via-slate-950 to-purple-950/40 border border-amber-400/40 rounded-3xl p-5 space-y-4 shadow-[0_0_30px_rgba(245,158,11,0.2)] backdrop-blur-xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                          <h3 className="text-xs font-black text-amber-300 border-b border-amber-500/20 pb-2 text-center flex items-center justify-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> ✨ 수검자 명심 프로필
                          </h3>
                          <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                            <div className="bg-slate-900/80 p-3 rounded-2xl border border-white/10">
                              <span className="text-purple-300 block text-[9px] font-bold">이름</span>
                              <span className="text-white font-extrabold">{data.userName}님</span>
                            </div>
                            <div className="bg-slate-900/80 p-3 rounded-2xl border border-amber-500/20">
                              <span className="text-amber-400 block text-[9px] font-bold">명심 유형</span>
                              <span className="text-amber-300 font-extrabold">{data.typology.typeName}</span>
                            </div>
                            <div className="bg-slate-900/80 p-3 rounded-2xl border border-white/10 col-span-2">
                              <span className="text-gray-400 block text-[9px] font-bold">출생 일시</span>
                              <span className="text-white font-extrabold">{new Date(data.birthDate).toLocaleDateString('ko-KR')} ({data.birthTime})</span>
                            </div>
                            <div className="bg-slate-900/80 p-3 rounded-2xl border border-amber-500/30 col-span-2">
                              <span className="text-amber-300 font-bold block text-[9px]">동양학·심리 8차원 주파수</span>
                              <span className="text-purple-200 font-mono font-extrabold tracking-wide text-xs">
                                {data.saju.fourPillars.year.gan}{data.saju.fourPillars.year.ji} / {data.saju.fourPillars.month.gan}{data.saju.fourPillars.month.ji} / {data.saju.fourPillars.day.gan}{data.saju.fourPillars.day.ji} / {data.saju.fourPillars.time.gan}{data.saju.fourPillars.time.ji}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-center text-[9.5px] text-gray-500 font-mono">
                          © 명심코칭 Co. All Rights Reserved.
                        </div>
                      </div>
                    )}
                    {currentPage === 2 && (
                      <div className="space-y-4 select-none">
                        <div className="text-center">
                          <h3 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-purple-200 to-indigo-100">
                            명심 기질 26대 지표 매트릭스
                          </h3>
                          <p className="text-[9.5px] text-amber-300 font-mono mt-0.5 font-bold">26대 기질 활성 주역코드의 입체 격자 도표입니다.</p>
                        </div>

                        {/* 26개 격자 24K 코스믹 럭셔리 그리드 */}
                        <div className="bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-950 border border-amber-500/30 rounded-3xl p-3.5 shadow-2xl backdrop-blur-xl">
                          <div className="grid grid-cols-4 gap-2">
                            {data.activations.map((act: any, idx: number) => {
                              const labelText = act.label ? act.label.split(' [')[0] : '';
                              return (
                                <motion.button
                                  key={act.id || idx}
                                  onClick={() => setCurrentPage(14 + idx)}
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="bg-gradient-to-br from-slate-900/90 to-purple-950/80 border border-amber-400/30 hover:border-amber-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] p-2 rounded-2xl text-center transition-all cursor-pointer flex flex-col justify-between h-[72px] sm:h-[78px] active:scale-95 group relative overflow-hidden"
                                >
                                  {/* 2줄 텍스트 짤림 방지 수술 (line-clamp-2) */}
                                  <span className="text-[8.5px] sm:text-[9.5px] text-purple-200 group-hover:text-amber-200 font-extrabold block leading-tight line-clamp-2 h-[22px] flex items-center justify-center break-keep">
                                    {labelText}
                                  </span>
                                  <span className="text-xs sm:text-sm font-black text-amber-300 group-hover:text-amber-200 block font-mono">
                                    {act.gate}
                                  </span>
                                  <span className="text-[8px] sm:text-[8.5px] text-gray-400 font-bold block bg-black/40 px-1.5 py-0.5 rounded-md border border-white/5">
                                    {act.line}효
                                  </span>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 안내 문구 카드 */}
                        <div className="bg-gradient-to-r from-amber-950/60 to-purple-950/60 border border-amber-400/40 p-3.5 rounded-2xl text-[10.5px] text-amber-200 leading-relaxed shadow-lg flex items-center gap-2">
                          <span className="text-base shrink-0">💡</span>
                          <span><b>원하시는 기질 격자 칸</b>을 누르시면, 해당 명심 파동 코드에 대한 상세 도표 페이지로 즉시 입체 점프합니다!</span>
                        </div>
                      </div>
                    )}
                    {currentPage === 3 && (
                      <div className="space-y-4 flex-1 flex flex-col justify-between py-2 select-none">
                        <div className="text-center">
                          <h3 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-purple-200 to-indigo-100">
                            의식 주파수 유형 및 명심 조합
                          </h3>
                          <p className="text-[9.5px] text-amber-300 font-mono mt-0.5 font-bold">타고난 에너지의 형태와 사회적 관계망의 주파수 구조입니다.</p>
                        </div>
                        <div className="space-y-3.5">
                          <div className="bg-gradient-to-br from-purple-950/60 to-slate-950 border border-purple-500/40 rounded-3xl p-4.5 shadow-[0_0_20px_rgba(168,85,247,0.15)] border-l-4 border-l-purple-400 relative overflow-hidden">
                            <span className="text-[8.5px] text-purple-300 font-mono font-bold uppercase tracking-wider block">에너지 형태 (Type)</span>
                            <span className="text-sm font-black text-white mt-1 block">{data.typology.typeName}</span>
                            <p className="text-[11px] text-gray-300 mt-2 leading-relaxed">{data.typology.typeDesc}</p>
                          </div>
                          <div className="bg-gradient-to-br from-amber-950/60 to-slate-950 border border-amber-500/40 rounded-3xl p-4.5 shadow-[0_0_20px_rgba(245,158,11,0.15)] border-l-4 border-l-amber-400 relative overflow-hidden">
                            <span className="text-[8.5px] text-amber-300 font-mono font-bold uppercase tracking-wider block">명심 주파수 조합</span>
                            <span className="text-sm font-black text-white mt-1 block">{data.typology.profileName}</span>
                            <p className="text-[11px] text-gray-300 mt-2 leading-relaxed">{data.typology.profileDesc}</p>
                          </div>
                        </div>

                        {/* 🔒 890원 1:1 심층 코칭 직통 버튼 마운트 */}
                        <button
                          onClick={() => {
                            setShowMicroPassModal(true);
                          }}
                          className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-xs rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] border border-amber-300/40"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                          <span>🔮 내 유형 파동으로 1:1 심층 AI 코칭 받기 (🔒 890원) ➔</span>
                        </button>

                        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-3 text-[10px] text-gray-400 leading-relaxed">
                          📌 <b>명심 AI 코치 팁</b>: 유형은 나의 동력 엔진의 특성이고, 프로필은 나의 옷과 같은 사회적 아키타입입니다.
                        </div>
                      </div>
                    )}
                    {currentPage >= 4 && currentPage <= 12 && (() => {
                      const centerIdx = currentPage - 4;
                      const center = data.centers[centerIdx];
                      const isDefined = center.status === 'DEFINED';
                      const theme = CENTER_THEMES[center.id] || CENTER_THEMES.inspiration;
                      return (
                        <div className="space-y-4 flex-1 flex flex-col justify-between py-2">
                          <div className="text-center">
                            <span className="text-[9px] text-purple-400 font-bold tracking-widest uppercase block">의식 영역 분석 {currentPage - 3} / 9</span>
                            <div className="flex items-center justify-center gap-1.5 mt-1">
                              <h3 className="text-xs font-bold text-white">{center.name}</h3>
                              <button
                                onClick={() => setShowConceptHelp(center.name)}
                                className="w-3.5 h-3.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-purple-300 text-[8px] font-black flex items-center justify-center hover:bg-purple-900/50 hover:text-white transition-colors active:scale-90"
                                title="개념 도움말 보기"
                              >
                                ?
                              </button>
                            </div>
                          </div>
                          {/* 👑 스위스 명품 시계 톱니 오라(Horology Dial) 24K 게이지 카드 */}
                          <div className="flex flex-col items-center justify-center p-5 bg-gradient-to-br from-slate-950 via-[#0b081c] to-slate-950 border border-amber-500/30 shadow-[0_0_35px_rgba(168,85,247,0.2)] rounded-[32px] relative transition-all overflow-hidden backdrop-blur-xl">
                            <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                            <div className="relative w-32 h-32 flex items-center justify-center animate-ring-pulse">
                              <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="54" className="stroke-slate-900/80" strokeWidth="8" fill="transparent" />
                                <motion.circle 
                                  cx="64" cy="64" r="54" 
                                  className={`transition-all duration-1000 ${theme.circle}`} 
                                  strokeWidth="8" 
                                  fill="transparent" 
                                  strokeDasharray={2 * Math.PI * 54} 
                                  initial={{ strokeDashoffset: 2 * Math.PI * 54 }} 
                                  animate={{ strokeDashoffset: 2 * Math.PI * 54 * (1 - center.score / 100) }} 
                                  transition={{ delay: 0.1, duration: 1.2, ease: 'easeOut' }} 
                                  strokeLinecap="round" 
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-2xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]">
                                  {center.score}점
                                </span>
                                <span className={`text-[8.5px] font-black px-2 py-0.5 rounded-full mt-1 border ${isDefined ? 'bg-purple-500/20 border-purple-400/40 text-purple-200' : 'bg-sky-500/20 border-sky-400/40 text-sky-200'}`}>
                                  {isDefined ? '고정형 주파수' : '수용형 주파수'}
                                </span>
                              </div>
                            </div>
                            <p className="text-[10.5px] text-gray-300 mt-4 text-center px-3 leading-relaxed font-sans font-medium">
                              {center.desc}
                            </p>
                          </div>

                          <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-slate-950 p-2.5 space-y-2 shadow-lg">
                            <div className="relative p-2 rounded-xl bg-black/40 border border-white/5">
                              <p className="text-[8px] text-gray-400 leading-relaxed blur-[2.5px] select-none">
                                해당 파동은 무의식 편도체 방어막과 맞물려 있으며, 1:1 심층 처방을 통해 에고의 불안을 해소하고 본래의 자각 상태로 즉시 재배선하는 솔루션을 포함합니다.
                              </p>
                              <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center">
                                <button
                                  onClick={() => setShowMicroPassModal(true)}
                                  className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 text-white font-black text-[9px] shadow transition-all active:scale-95 flex items-center gap-1 cursor-pointer border border-amber-300/40"
                                >
                                  <span>🔒 890원 처방 락 해제 ➔</span>
                                </button>
                              </div>
                            </div>

                            <button
                              disabled={docentLoading}
                              onClick={() => handleDocentRequest({
                                type: 'center',
                                label: center.name,
                                score: center.score,
                                dark: center.shadow || '외부 조건에 자극받아 무의식적인 에고 반응 및 불안이 형성되는 파동입니다.',
                                neural: `${center.name}의 주파수가 일상 뇌신경 회로 속에서 ${center.score}점의 현실 조율 상태를 지니며 작동하고 있습니다.`,
                                meta: center.potential || '우주의 진동 주파수와 정렬되어 나만의 참된 지혜와 영감을 발산하는 근본 성정입니다.'
                              })}
                              className={`bg-[#0b0b18]/80 border border-amber-500/20 hover:border-amber-500/40 p-2.5 rounded-xl text-left transition-all active:scale-[0.98] shadow flex justify-between items-center w-full ${
                                docentLoading ? 'opacity-60 cursor-not-allowed' : ''
                              }`}
                            >
                              <span className="text-amber-300 text-[9.5px] font-bold">🔮 자각 패치 주파수 관점 재배선 상세 풀이</span>
                              <span className="text-[8px] text-purple-300 font-semibold">{docentLoading ? '조회 중...' : '터치 시 팝업 💡'}</span>
                            </button>
                          </div>

                          {/* 4대 주파수 상태 필터 버튼 */}
                          <div className="grid grid-cols-2 gap-2 text-[9.5px] text-center font-sans">
                            <button
                              type="button"
                              onClick={() => setSelectedFrequencyDetail('미약 주파수')}
                              className={`p-2.5 rounded-2xl border text-center transition-all active:scale-95 cursor-pointer block w-full ${center.score < 30 ? 'text-amber-200 border-amber-400/50 bg-amber-500/20 font-black shadow-[0_0_12px_rgba(245,158,11,0.2)]' : 'text-gray-400 border-white/10 bg-slate-900/60 font-bold hover:text-white'}`}
                            >
                              <span>미약 주파수 (0~29점) 💡</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedFrequencyDetail('수용형 주파수')}
                              className={`p-2.5 rounded-2xl border text-center transition-all active:scale-95 cursor-pointer block w-full ${center.score >= 30 && center.score < 60 ? 'text-sky-200 border-sky-400/50 bg-sky-500/20 font-black shadow-[0_0_12px_rgba(14,165,233,0.2)]' : 'text-gray-400 border-white/10 bg-slate-900/60 font-bold hover:text-white'}`}
                            >
                              <span>수용형 주파수 (30~59점) 💡</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedFrequencyDetail('고정형 주파수')}
                              className={`p-2.5 rounded-2xl border text-center transition-all active:scale-95 cursor-pointer block w-full ${center.score >= 60 && center.score < 86 ? 'text-purple-200 border-purple-400/50 bg-purple-500/20 font-black shadow-[0_0_12px_rgba(168,85,247,0.2)]' : 'text-gray-400 border-white/10 bg-slate-900/60 font-bold hover:text-white'}`}
                            >
                              <span>고정형 주파수 (60~85점) 💡</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedFrequencyDetail('극대화 주파수')}
                              className={`p-2.5 rounded-2xl border text-center transition-all active:scale-95 cursor-pointer block w-full ${center.score >= 86 ? 'text-emerald-200 border-emerald-400/50 bg-emerald-500/20 font-black shadow-[0_0_12px_rgba(16,185,129,0.2)]' : 'text-gray-400 border-white/10 bg-slate-900/60 font-bold hover:text-white'}`}
                            >
                              <span>극대화 주파수 (86~100점) 💡</span>
                            </button>
                          </div>

                          {/* 24K 럭셔리 3,900원 AI 코치 해설 CTA 카드 */}
                          <button
                            disabled={docentLoading}
                            onClick={() => handleDocentRequest({
                              type: 'center',
                              label: center.name,
                              score: center.score,
                              dark: center.shadow || '외부 조건에 자극받아 무의식적인 에고 반응 및 불안이 형성되는 파동입니다.',
                              neural: `${center.name}의 주파수가 일상 뇌신경 회로 속에서 ${center.score}점의 현실 조율 상태를 지니며 작동하고 있습니다.`,
                              meta: center.potential || '우주의 진동 주파수와 정렬되어 나만의 참된 지혜와 영감을 발산하는 근본 성정입니다.'
                            })}
                            className="bg-gradient-to-br from-amber-950/40 via-slate-950 to-purple-950/40 border border-amber-400/40 hover:border-amber-300 p-4 rounded-3xl space-y-3 text-left transition-all active:scale-[0.98] shadow-[0_0_25px_rgba(245,158,11,0.2)] w-full group relative overflow-hidden"
                          >
                            <div className="flex justify-between items-center text-[10.5px]">
                              <span className="text-amber-300 font-extrabold flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> 🔮 주파수 재배선 명심 AI 코치 해설
                              </span>
                              <span className="shrink-0 flex items-center gap-1">
                                <span className="line-through text-gray-500 text-[9px]">29,000원</span>
                                <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-[9.5px] px-2 py-0.5 rounded-full shadow">
                                  특허출원중 한시적 3,900원 ➔
                                </span>
                              </span>
                            </div>
                            <div className="space-y-2 text-[9.5px] text-gray-300 leading-relaxed border-t border-white/10 pt-2.5">
                              <div>
                                <span className="text-rose-400 font-bold flex items-center gap-1">🔴 다크코드 (에고 에러)</span>
                                <p className="text-gray-300 mt-0.5 leading-snug">
                                  {center.shadow || '외부 자극에 반응하여 생성되는 에고 무의식의 정체 파동입니다.'}
                                </p>
                              </div>
                              <div>
                                <span className="text-sky-300 font-bold flex items-center gap-1">🔵 뉴럴코드 (신경 재배선)</span>
                                <p className="text-gray-300 mt-0.5 leading-snug">
                                  {center.neuralCode || `${center.name} 주파수를 일상 뇌신경망에서 조화롭게 재배선해냅니다.`}
                                </p>
                              </div>
                              <div>
                                <span className="text-amber-300 font-bold flex items-center gap-1">✨ 메타코드 (우주 싱크)</span>
                                <p className="text-gray-300 mt-0.5 leading-snug">
                                  {center.potential || '우주의 무한한 창조 에너지와 온전히 정렬되는 각성 파동입니다.'}
                                </p>
                              </div>
                            </div>
                          </button>
                        </div>
                      );
                    })()}
                    {currentPage === 13 && (
                      <div className="space-y-4 flex-1 flex flex-col justify-between py-1 select-none">
                        {/* 스위스 타이포그래피 럭셔리 타이틀 */}
                        <div className="text-center">
                          <span className="text-[9.5px] text-amber-300 font-mono font-bold tracking-widest uppercase block">
                            TALENTS PAGE 13 / 40
                          </span>
                          <h3 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-purple-200 to-indigo-100 mt-0.5 drop-shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                            명심 3대 핵심 기질 재능 대비표
                          </h3>
                          <p className="text-[9.5px] text-amber-300/90 font-mono mt-0.5 font-bold">타고난 3대 천부 에너지의 현실 발현 파동 지수입니다.</p>
                        </div>

                        {/* 3대 핵심 재능 24K 코스믹 카드 */}
                        <div className="space-y-3 bg-gradient-to-br from-slate-950 via-[#0b081c] to-slate-950 border border-amber-500/30 rounded-3xl p-4.5 shadow-[0_0_35px_rgba(168,85,247,0.2)] backdrop-blur-xl">
                          {[
                            { name: '감정 소통', score: userSeed > 0 ? Math.min(98, Math.max(55, 75 + (userSeed % 23) - 10)) : 87, color: 'from-pink-500 via-purple-500 to-indigo-500', desc: '내 기분과 감정을 참되게 표현하는 힘', glow: 'shadow-[0_0_15px_rgba(236,72,153,0.4)]' },
                            { name: '비즈니스 본능', score: userSeed > 0 ? Math.min(98, Math.max(55, 78 + ((userSeed * 3) % 21) - 10)) : 86, color: 'from-amber-400 via-amber-500 to-orange-500', desc: '대중의 필요와 가치를 파악하여 연결하는 힘', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.4)]' },
                            { name: '현존감', score: userSeed > 0 ? Math.min(98, Math.max(55, 72 + ((userSeed * 7) % 25) - 12)) : 65, color: 'from-emerald-400 via-teal-500 to-cyan-500', desc: '과거와 미래의 불안을 지우고 지금 현존하는 힘', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.4)]' }
                          ].map((tal, i) => {
                            const essay = TALENT_ESSAY_DATA[tal.name];
                            return (
                              <div
                                key={i}
                                onClick={() => {
                                  if (essay) {
                                    setSelectedItem({
                                      type: 'talent',
                                      label: tal.name + ' - ' + essay.subtitle,
                                      score: tal.score,
                                      dark: '',
                                      neural: '',
                                      meta: '',
                                      metaphor: essay.metaphor,
                                      content: essay.content
                                    });
                                  }
                                }}
                                className="space-y-2 cursor-pointer hover:bg-white/5 p-3 rounded-2xl transition-all border border-white/5 hover:border-amber-400/40 active:scale-[0.98] group bg-black/40"
                              >
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-white font-extrabold flex items-center gap-1.5 group-hover:text-amber-300 transition-colors">
                                    {tal.name} <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                  </span>
                                  <span className="text-amber-300 font-mono font-black text-sm">{tal.score}점</span>
                                </div>
                                <div className="w-full h-3 bg-black/80 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
                                  <motion.div 
                                    className={`h-full rounded-full bg-gradient-to-r ${tal.color} ${tal.glow}`} 
                                    initial={{ width: 0 }} 
                                    animate={{ width: `${tal.score}%` }} 
                                    transition={{ delay: 0.2, duration: 1.0, ease: 'easeOut' }} 
                                  />
                                </div>
                                <p className="text-[10px] text-gray-400 flex justify-between items-center pt-0.5">
                                  <span>{tal.desc}</span>
                                  <span className="text-[9px] text-amber-300 font-bold group-hover:underline">터치 시 감동 해설 팝업 🔮</span>
                                </p>
                              </div>
                            );
                          })}
                        </div>

                        {/* 🏛️ 3대 핵심 재능 융합 시너지 분석 & 890원 코칭 버튼 */}
                        <div className="space-y-2.5">
                          <div className="bg-slate-900/90 border border-amber-500/30 p-3.5 rounded-2xl text-[10px] text-gray-300 leading-relaxed shadow-lg">
                            <span className="text-amber-300 font-extrabold block text-xs mb-1">🏛️ 3대 천부 재능 융합 파동 시너지</span>
                            <p className="text-gray-300 leading-relaxed">
                              {data?.userName || '명심가'}님의 3대 천부 기질은 <b>[감정 소통]</b>의 공감 파동과 <b>[비즈니스 본능]</b>의 자원 확장 파워가 결합하여, 세상 사람들의 마음을 따뜻하게 열고 실질적인 부와 결실로 실체화하는 강력한 리더십 융합을 이루고 있습니다.
                            </p>
                          </div>

                          <button
                            onClick={() => setShowMicroPassModal(true)}
                            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-xs rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] border border-amber-300/40"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                            <span>🔮 3대 천부 재능으로 1:1 심층 AI 코칭 받기 (🔒 890원) ➔</span>
                          </button>
                        </div>
                      </div>
                    )}
                    {currentPage >= 14 && currentPage <= 39 && (() => {
                      const actIdx = currentPage - 14;
                      const act = data.activations[actIdx];
                      return (
                        <div className="space-y-4 flex-1 flex flex-col justify-between py-2">
                          <div className="text-center">
                            <span className="text-[9px] text-amber-500 font-bold tracking-widest uppercase block">PLANETS PAGE {currentPage - 13} / 26</span>
                            <div className="flex items-center justify-center gap-1.5 mt-1">
                              <h3 className="text-xs font-bold text-white">{act.label}</h3>
                              <button
                                onClick={() => setShowConceptHelp(act.label)}
                                className="w-3.5 h-3.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[8px] font-black flex items-center justify-center hover:bg-amber-900/50 hover:text-white transition-colors active:scale-90"
                                title="개념 도움말 보기"
                              >
                                ?
                              </button>
                            </div>
                          </div>

                          {/* 1. 활성 코드 번호 카드 표 */}
                          <div className="bg-[#0f0f1f]/80 border border-white/10 rounded-2xl p-4 flex justify-between items-center shadow-lg">
                            <div>
                              <span className="text-[8px] text-gray-500 block leading-none mb-1 font-mono uppercase">ACTIVATED CODE</span>
                              <h4 className="text-xs font-bold text-white">{act.name}</h4>
                              <p className="text-[9px] text-amber-400 mt-1.5 italic">“ {act.keyword} ”</p>
                            </div>
                            <div className="text-center bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl shadow-[0_0_10px_rgba(245,158,11,0.1)] flex flex-col justify-center items-center">
                              <span className="text-xs font-mono font-extrabold text-amber-400 block">{act.gate}번 코드</span>
                              <div className="flex items-center gap-1 mt-1 justify-center">
                                <span className="text-[8px] text-purple-300 font-bold font-mono leading-none">{act.line}효</span>
                                <button 
                                  onClick={() => setShowLineHelp(act.line)} 
                                  className="w-3.5 h-3.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-purple-300 text-[8px] font-black flex items-center justify-center hover:bg-purple-900/50 hover:text-white transition-colors active:scale-90"
                                  title="효 단계별 상세 가이드북 보기"
                                >
                                  ?
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 2. 최고급 대칭 저울형 밸런스 차트 & 네온 눈금 자 */}
                          <div className="bg-[#0b0b1a]/90 border border-amber-500/20 rounded-[28px] p-5 space-y-4 relative overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.08)]">
                            <div className="flex justify-between items-center text-[10px] text-gray-400">
                              <span className="text-white font-black flex items-center gap-1.5">⚖️ 의식 밸런스 저울 (다크 vs 자각 주파수)</span>
                              <span className="text-amber-400 font-mono text-[8px] font-bold">BALANCE SCALE</span>
                            </div>

                            {/* 입체 네온 다이얼 기어 */}
                            <div className="flex items-center justify-between gap-3 h-10 relative">
                              <div className="flex-1 h-3.5 bg-black/80 rounded-l-full overflow-hidden border border-white/5 flex justify-end p-[2px]">
                                <motion.div 
                                  className="h-full bg-gradient-to-l from-red-500 via-orange-600 to-red-950 rounded-l-full shadow-[0_0_15px_rgba(239,68,68,0.65)]"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${100 - act.score}%` }}
                                  transition={{ duration: 1.4, ease: 'easeOut' }}
                                />
                              </div>

                              {/* 중앙 3D 저울 바늘 기어 */}
                              <div className="flex flex-col items-center justify-center shrink-0 w-9 h-9 rounded-full bg-[#15152b] border border-amber-500/40 z-10 shadow-[0_0_15px_rgba(245,158,11,0.35)] relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15)_0%,transparent_70%)]" />
                                <motion.div 
                                  className="w-1 h-7 bg-gradient-to-t from-amber-600 to-amber-300 rounded-full origin-bottom"
                                  style={{ bottom: '15%' }}
                                  animate={{ rotate: (act.score - 50) * 0.9 }}
                                  transition={{ type: 'spring', stiffness: 60, damping: 12 }}
                                />
                              </div>

                              <div className="flex-1 h-3.5 bg-black/80 rounded-r-full overflow-hidden border border-white/5 p-[2px]">
                                <motion.div 
                                  className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-amber-300 rounded-r-full shadow-[0_0_15px_rgba(99,102,241,0.65)]"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${act.score}%` }}
                                  transition={{ duration: 1.4, ease: 'easeOut' }}
                                />
                              </div>
                            </div>

                            <div className="flex justify-between text-[7.5px] text-gray-500 px-1 pt-0.5 select-none font-mono">
                              <span className="ruler-tick text-red-500/80 font-bold">100% (다크)</span>
                              <span className="ruler-tick">60</span>
                              <span className="ruler-tick">20</span>
                              <span className="ruler-tick">0</span>
                              <span className="ruler-tick">20</span>
                              <span className="ruler-tick">60</span>
                              <span className="ruler-tick text-indigo-400/80 font-bold">100% (자각)</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 items-center text-[9px] font-sans pt-1">
                              <button 
                                onClick={() => {
                                  setActiveDarkScore(100 - act.score);
                                  setShowConceptHelp('다크코드');
                                }}
                                className="bg-red-950/30 border border-red-500/30 hover:border-red-500/60 hover:bg-red-950/50 px-2.5 py-1.5 rounded-xl text-center shadow-inner transition-all active:scale-95 cursor-pointer block w-full"
                              >
                                <span className="text-red-400 block font-bold">🔴 다크코드 💡</span>
                                <span className="text-white font-mono font-black text-[11px] mt-0.5 block">{100 - act.score}%</span>
                              </button>
                              <button 
                                type="button"
                                onClick={() => setSelectedBalanceAct(act)}
                                className="text-center text-[8.5px] text-amber-200/90 font-bold bg-amber-500/10 hover:bg-amber-500/20 active:scale-95 border border-amber-500/30 hover:border-amber-500/50 py-2 px-1 rounded-xl transition-all cursor-pointer block w-full shadow-[0_0_10px_rgba(245,158,11,0.05)]"
                              >
                                {act.score === 50 ? '완벽한 의식 균형 💡' : act.score > 50 ? '자각 고조 상태 💡' : '에고 방어 과부하 💡'}
                              </button>
                              <button 
                                onClick={() => {
                                  setActiveAwareScore(act.score);
                                  setShowConceptHelp('자각 주파수');
                                }}
                                className="bg-indigo-950/30 border border-indigo-500/30 hover:border-indigo-500/60 hover:bg-indigo-950/50 px-2.5 py-1.5 rounded-xl text-center shadow-inner transition-all active:scale-95 cursor-pointer block w-full"
                              >
                                <span className="text-indigo-400 block font-bold">🔵 자각 주파수 💡</span>
                                <span className="text-white font-mono font-black text-[11px] mt-0.5 block">{act.score}%</span>
                              </button>
                            </div>
                          </div>

                          {/* 3. "언제 작동하나요? 타고난 상태인가요?" 대화식 자각 가이드 카드 신설 */}
                          <div className="bg-[#0f0f23]/70 border border-amber-500/20 rounded-2xl p-4 space-y-3 shadow-lg text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                            <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
                              <span className="text-xs">💡</span>
                              <h4 className="text-[10px] font-black text-amber-200">의식 저울 점수의 진짜 비밀 (쉽게 읽는 법)</h4>
                            </div>

                            <div className="space-y-2.5 text-[9px] text-gray-300 leading-relaxed font-sans">
                              <div>
                                <span className="text-red-400 font-extrabold flex items-center gap-1">⚡ 무의식 작동 타이밍 (언제 {100 - act.score}%까지 치솟나요?)</span>
                                <p className="text-gray-400 pl-3.5 mt-0.5">
                                  이 다크코드는 평소엔 잠잠하다가, <b>내 뜻대로 일이 안 풀리거나, 몸이 피로하여 뇌가 비상사태를 느낄 때, 혹은 타인의 눈치와 평가에 위축될 때</b> 나를 보호하려 순간적으로 발동하는 <b>'무의식적 불안 방어막'</b>입니다.
                                </p>
                              </div>
                              <div>
                                <span className="text-indigo-400 font-extrabold flex items-center gap-1">🧬 타고난 나의 기질 (평상시 자각이 약해 고정된 성적인가요?)</span>
                                <p className="text-gray-400 pl-3.5 mt-0.5">
                                  아닙니다! 처음부터 100% 자각(뉴럴코드)으로만 사는 인간은 우주에 없습니다. 이 수치는 태어날 때 부여받은 <b>기질적 취약성(고마운 생존 갑옷)</b>을 보여주며, "내가 또 갑옷을 입고 애쓰는구나" 하고 알아차리고 3초 숨을 고르는 <b>찰나의 자각({act.score}%)</b>을 통해 다크코드는 녹아내리고 본래의 찬란한 자각 상태로 즉시 돌아가게 됩니다.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* 3초 직관 정의 요약 칩 추가 */}
                          <div className="space-y-2">
                            <div className="flex justify-end">
                              <button
                                onClick={() => setShowExplainHelp(prev => !prev)}
                                className="text-[9px] text-amber-400/80 hover:text-amber-300 flex items-center gap-1 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full transition-all active:scale-95"
                              >
                                💡 이게 무슨 뜻인가요? {showExplainHelp ? '닫기 ▲' : '자세히 보기 ▼'}
                              </button>
                            </div>

                            <AnimatePresence>
                              {showExplainHelp && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                                  className="overflow-hidden bg-[#0d0d1b] border border-amber-500/20 rounded-2xl p-4 space-y-2 text-[9px] text-gray-300 shadow-inner"
                                >
                                  <p className="text-white font-extrabold text-[10px] flex items-center gap-1.5 border-b border-white/5 pb-1.5">
                                    🔮 의식 삼중 코드 3초 직관 정의
                                  </p>
                                  <div className="space-y-2 leading-relaxed">
                                    <p>
                                      <span className="text-red-400 font-bold">🔴 다크코드 (에고 에러)</span>: 내면의 소멸 불안으로 인해 뇌가 나를 보호하려고 일시적으로 친 <b>불안 및 긴장 방어막</b>입니다.
                                    </p>
                                    <p>
                                      <span className="text-indigo-400 font-bold">🔵 자각 주파수 (뉴럴)</span>: 마음의 어깨 힘을 빼고 일상에서 보다 유연하고 지혜롭게 현실에 <b>대처하고 조율해내는 힘</b>입니다.
                                    </p>
                                    <p>
                                      <span className="text-amber-400 font-bold">✨ 자각 주파수 (메타)</span>: 억지 통제를 내려놓고 우주 본래의 맑은 흐름과 하나 되어 기적처럼 만개하는 <b>본래 평화</b>입니다.
                                    </p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* 4. 감동의 AI 도슨트 트리거 칩 */}
                          <button
                            disabled={docentLoading}
                            onClick={() => handleDocentRequest({
                              type: 'planet',
                              label: act.label,
                              score: act.score,
                              gate: act.gate,
                              line: act.line,
                              dark: act.darkCodeTxt || act.shadowTxt || act.shadow,
                              neural: act.neuralCodeTxt || `[${act.name}] 기질이 현실 뇌신경 구조에 투사되어 일상 영역에서 ${act.score}점의 조율도 및 적응 패턴을 띄며 작용합니다.`,
                              meta: act.metaCodeTxt || act.lightTxt || act.light
                            })}
                            className={`bg-[#0b0b18]/60 border border-white/5 hover:border-amber-500/30 p-3 rounded-xl text-left transition-all active:scale-[0.98] shadow-lg flex justify-between items-center w-full ${
                              docentLoading ? 'opacity-60 cursor-not-allowed' : ''
                            }`}
                          >
                            <span className="text-amber-400 text-[10px] font-bold">🔮 자각 패치 주파수 관점 재배선 상세 풀이</span>
                            <span className="text-[8px] text-purple-300">{docentLoading ? '조회 중...' : '터치 시 팝업 💡'}</span>
                          </button>
                        </div>
                      );
                    })()}
                    {currentPage === 40 && (
                      <div className="space-y-4 flex-1 flex flex-col justify-between py-1 select-none">
                        {/* 스위스 타이포그래피 럭셔리 타이틀 */}
                        <div className="text-center">
                          <span className="text-[9.5px] text-purple-300 font-mono font-bold tracking-widest uppercase block">
                            TIMELINE PAGE 40 / 40
                          </span>
                          <h3 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-purple-200 to-indigo-100 mt-0.5 drop-shadow-[0_0_12px_rgba(168,85,247,0.3)]">
                            인생 명심 라이프 주기 타임라인
                          </h3>
                        </div>

                        {/* 24K 코스믹 타임라인 도표 */}
                        <div className="bg-gradient-to-br from-slate-950 via-[#0b081c] to-slate-950 border border-purple-500/30 rounded-3xl p-4.5 shadow-[0_0_35px_rgba(168,85,247,0.2)] backdrop-blur-xl">
                          <div className="relative border-l-2 border-purple-500/50 pl-4 space-y-4 text-[10.5px]">
                            {/* 전반기 */}
                            <div 
                              onClick={() => setShowConceptHelp(`1ST HALF (~ ${turningYear}년)`)}
                              className="relative bg-black/40 hover:bg-purple-950/30 border border-white/10 hover:border-purple-400/50 p-4 rounded-2xl cursor-pointer transition-all active:scale-[0.98] hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] group"
                            >
                              <span className="absolute -left-[22.5px] top-6 w-3.5 h-3.5 bg-purple-400 rounded-full border-2 border-slate-950 group-hover:scale-125 transition-transform duration-300 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                              <div className="flex justify-between items-center">
                                <span className="text-[8.5px] text-purple-300 font-bold font-mono uppercase tracking-wider">1ST HALF (~ {turningYear}년) • 터치 시 팝업 💡</span>
                                <span className="text-[9.5px] text-purple-300 group-hover:translate-x-0.5 transition-transform font-bold">자세히 보기 →</span>
                              </div>
                              <h4 className="text-white font-extrabold mt-1 group-hover:text-purple-200 transition-colors text-xs">갈등 수용과 자각 축적기</h4>
                              <p className="text-[9.5px] text-gray-300 mt-1.5 leading-relaxed break-keep font-sans">
                                거친 파도 속에서 에고의 껍질을 부수고 영혼의 뿌리를 내리는 훈련기입니다. 마주하는 모든 시련은 당신이라는 그릇을 크고 웅장하게 빚어내기 위한 숨겨진 축복의 거름입니다.
                              </p>
                            </div>

                            {/* 후반기 */}
                            <div 
                              onClick={() => setShowConceptHelp(`2ND HALF (${turningYear}년 ~)`)}
                              className="relative bg-black/40 hover:bg-amber-950/30 border border-white/10 hover:border-amber-400/50 p-4 rounded-2xl cursor-pointer transition-all active:scale-[0.98] hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] group"
                            >
                              <span className="absolute -left-[22.5px] top-6 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-slate-950 group-hover:scale-125 transition-transform duration-300 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                              <div className="flex justify-between items-center">
                                <span className="text-[8.5px] text-amber-300 font-bold font-mono uppercase tracking-wider">2ND HALF ({turningYear}년 ~) • 터치 시 팝업 💡</span>
                                <span className="text-[9.5px] text-amber-300 group-hover:translate-x-0.5 transition-transform font-bold">자세히 보기 →</span>
                              </div>
                              <h4 className="text-white font-extrabold mt-1 group-hover:text-amber-200 transition-colors text-xs">자비 반조와 천명 만개기</h4>
                              <p className="text-[9.5px] text-gray-300 mt-1.5 leading-relaxed break-keep font-sans">
                                혹독한 겨울 끝에 깊은 지혜의 빛을 건져 올려, 세상의 어두운 길을 밝혀주는 영혼의 등대로 부활하는 축복과 번영, 만개의 황금기입니다.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* 🏛️ 철학 명언 & 890원 AI 코칭 결제 전환 버튼 */}
                        <div className="space-y-2.5">
                          <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 rounded-2xl p-3.5 text-center shadow-lg">
                            <p className="text-[10.5px] text-purple-200 italic leading-relaxed font-serif">
                              "인생의 굴곡과 방황은 에너지가 약해서가 아닙니다.<br />
                              더욱 크고 깊은 빛의 주파수를 피워내기 위한<br />
                              우주적 충전기이자, 성찰의 밤일 뿐입니다."
                            </p>
                          </div>

                          <button
                            onClick={() => setShowMicroPassModal(true)}
                            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-xs rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] border border-amber-300/40"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                            <span>🔮 인생 라이프 주기 1:1 심층 AI 코칭 받기 (🔒 890원) ➔</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 👑 스위스 명품 장인정신 24K 네비게이션 툴바 */}
              <div className="px-5 py-3.5 border-t border-amber-500/20 bg-gradient-to-r from-slate-950 via-[#0a0718] to-slate-950 flex items-center justify-between shrink-0 select-none shadow-2xl backdrop-blur-xl">
                <button 
                  onClick={prevPage} 
                  disabled={currentPage === 1} 
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900/90 border border-white/10 hover:border-amber-400/40 rounded-2xl text-gray-300 hover:text-white disabled:opacity-20 transition-all active:scale-95 text-[10.5px] font-black cursor-pointer shadow"
                >
                  <ChevronLeft size={14} className="text-amber-400" /> Previous
                </button>

                <div className="text-center font-mono text-xs flex items-center gap-2 px-3 py-1 bg-black/60 border border-amber-500/20 rounded-full shadow-inner">
                  <span className="font-black text-amber-300">{currentPage}</span>
                  <span className="text-gray-600 text-[10px]">/</span>
                  <span className="text-gray-400 font-bold">{totalPages}</span>
                </div>

                <button 
                  onClick={nextPage} 
                  disabled={currentPage === totalPages} 
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-black rounded-2xl disabled:opacity-20 transition-all active:scale-95 text-[10.5px] cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)] border border-amber-300/40"
                >
                  Next <ChevronRight size={14} className="stroke-[3]" />
                </button>
              </div>
            </div>
          )}

          {mounted && selectedItem && typeof window !== 'undefined' && createPortal(
            <AnimatePresence>
              <div className="fixed inset-0 z-[10000] flex justify-center items-center bg-black/85 backdrop-blur-md p-4 overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="w-full max-w-md h-[85vh] max-h-[85dvh] bg-[#020205] border border-purple-500/30 rounded-[32px] shadow-[0_0_60px_rgba(168,85,247,0.3)] flex flex-col relative overflow-hidden text-left p-5 text-white"
                >
                  <div className="absolute top-[-20%] left-[-20%] w-[350px] h-[350px] bg-gradient-to-tr from-purple-600/10 to-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
                  <div className="flex justify-between items-center border-b border-white/5 pb-3 shrink-0 z-10">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span className="text-xs font-bold text-white">명심 AI 코치 상세코칭</span>
                    </div>
                    <button onClick={() => setSelectedItem(null)} className="p-1.5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex-1 min-h-0 overflow-y-auto py-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent text-left animate-fade-in pr-1.5 z-10" style={{ WebkitOverflowScrolling: 'touch' }}>
                    <div className="bg-[#17172e]/90 p-4 rounded-2xl border border-purple-500/10 shadow-md">
                      <span className="text-[8px] font-black text-purple-400 tracking-wider block uppercase">
                        {selectedItem.type === 'center' ? '의식 영역' : selectedItem.type === 'talent' ? '명심 핵심 기질' : '기질 활성'}
                      </span>
                      <h3 className="text-xs md:text-sm font-black text-white mt-0.5">{selectedItem.label}</h3>
                      <div className="flex items-center gap-3 mt-1.5 border-b border-white/5 pb-2">
                        <span className="text-[9px] md:text-xs text-amber-400 font-extrabold">발현 지수: {selectedItem.score}점</span>
                        {selectedItem.gate && (
                          <span className="text-[9px] text-gray-400 font-mono">명심주역코드 {selectedItem.gate}번 {selectedItem.line}효</span>
                        )}
                      </div>
 
                      {/* 삼중 코드 요약 정보 */}
                      {selectedItem.type !== 'talent' ? (
                        <div className="space-y-2 mt-2.5 text-[8.5px] md:text-[9.5px] text-gray-300 leading-normal font-sans">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-red-400 font-black flex items-center gap-1">🔴 다크코드 (Dark Code)</span>
                            <p className="text-gray-400 text-[8.5px] md:text-[9.5px] leading-relaxed pl-3.5">{selectedItem.dark}</p>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-indigo-400 font-black flex items-center gap-1">🔵 뉴럴코드 (Neural Code)</span>
                            <p className="text-gray-400 text-[8.5px] md:text-[9.5px] leading-relaxed pl-3.5">{selectedItem.neural}</p>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-amber-400 font-black flex items-center gap-1">✨ 메타코드 (Meta Code)</span>
                            <p className="text-gray-400 text-[8.5px] md:text-[9.5px] leading-relaxed pl-3.5">{selectedItem.meta}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 mt-2.5 text-[9px] md:text-xs text-purple-300 leading-normal font-sans">
                          <div className="flex flex-col gap-1">
                            <span className="text-amber-400 font-black flex items-center gap-1">🔮 기질 은유 (Metaphor)</span>
                            <p className="text-gray-200 font-medium italic pl-3.5">{selectedItem.metaphor}</p>
                          </div>
                        </div>
                      )}
                    </div>
 
                    {/* 해설 로딩 */}
                    {docentLoading && (
                      <div className="h-44 flex flex-col items-center justify-center space-y-3">
                        <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                        <div className="space-y-1 text-center">
                          <p className="text-[9.5px] font-bold text-amber-200 animate-pulse">명심 AI 엔진이 의식 주파수를 해독하고 있습니다...</p>
                          <p className="text-[8.5px] text-gray-500">당신의 명심 지도와 사주 주파수를 동기화하는 중입니다.</p>
                        </div>
                      </div>
                    )}
 
                    {/* 해설 텍스트 */}
                    {!docentLoading && (docentContent || selectedItem.content) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[11px] md:text-xs text-gray-300 leading-relaxed whitespace-pre-wrap space-y-2.5 pb-12 pr-1"
                      >
                        {docentContent || selectedItem.content}
                      </motion.div>
                    )}
                  </div>
 
                  {/* 닫기 버튼 */}
                  <div className="border-t border-white/5 pt-3 shrink-0 bg-[#020205] z-10">
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="w-full py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-purple-900/30 text-center flex items-center justify-center gap-1"
                    >
                      <span>자각 완료 (주파수 관점 재배선)</span>
                      <span>↩️</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </AnimatePresence>,
            document.body
          )}

          {mounted && showLineHelp !== null && typeof window !== 'undefined' && createPortal(
            <AnimatePresence>
              <div className="fixed inset-0 z-[20000] flex justify-center items-center bg-black/85 backdrop-blur-sm p-4 overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="w-full max-w-sm max-h-[85vh] bg-[#06060c] border border-purple-500/40 rounded-[28px] shadow-[0_0_40px_rgba(168,85,247,0.25)] flex flex-col relative overflow-hidden text-left p-5 text-white"
                >
                  <div className="absolute top-[-10%] left-[-15%] w-[250px] h-[250px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />
                  <div className="flex justify-between items-center border-b border-white/5 pb-3 shrink-0 z-10">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <span className="text-[11px] font-bold text-amber-200">명심단계별주역효 가이드</span>
                    </div>
                    <button onClick={() => setShowLineHelp(null)} className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                      <X size={14} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto py-3 space-y-3.5 z-10 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
                    {(() => {
                      const lInfo = LINE_GUIDE_DATA[showLineHelp];
                      if (!lInfo) return null;
                      return (
                        <div className="space-y-3">
                          <div className="bg-purple-950/20 border border-purple-500/20 p-3.5 rounded-xl">
                            <h4 className="text-xs font-black text-purple-300 leading-tight">{lInfo.title}</h4>
                            <p className="text-[9.5px] text-amber-400 font-semibold mt-1">{lInfo.subtitle}</p>
                          </div>
                          <div className="space-y-2 text-[9px] text-gray-300 leading-relaxed font-sans">
                            <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                              <span className="text-white font-extrabold block">🌱 은유적 비유</span>
                              <p className="text-gray-400 mt-0.5">{lInfo.metaphor}</p>
                            </div>
                            <div className="bg-[#0b0b18]/60 p-2.5 rounded-xl border border-white/5">
                              <span className="text-white font-extrabold block">⚙️ 현실 의식 작용</span>
                              <p className="text-gray-400 mt-0.5">{lInfo.desc}</p>
                            </div>
                            <div className="bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/10">
                              <span className="text-amber-300 font-extrabold block">✨ 자각 복귀 지침</span>
                              <p className="text-amber-200/90 mt-0.5">{lInfo.action}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="pt-2 shrink-0 z-10">
                    <button
                      onClick={() => setShowLineHelp(null)}
                      className="w-full py-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1"
                    >
                      <span>가이드북 닫기</span>
                      <span>↩️</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </AnimatePresence>,
            document.body
          )}

          {mounted && showConceptHelp !== null && typeof window !== 'undefined' && createPortal(
            <AnimatePresence>
              <div className="fixed inset-0 z-[20000] flex justify-center items-center bg-black/85 backdrop-blur-sm p-4 overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="w-full max-w-sm max-h-[85vh] bg-[#06060c] border border-amber-500/40 rounded-[28px] shadow-[0_0_40px_rgba(245,158,11,0.25)] flex flex-col relative overflow-hidden text-left p-5 text-white"
                >
                  <div className="absolute top-[-10%] left-[-15%] w-[250px] h-[250px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />
                  <div className="flex justify-between items-center border-b border-white/5 pb-3 shrink-0 z-10">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span className="text-[11px] font-bold text-amber-200">명심 자각 도움말</span>
                    </div>
                    <button onClick={() => setShowConceptHelp(null)} className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                      <X size={14} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto py-3 space-y-3.5 z-10 scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent">
                    {(() => {
                      let key = showConceptHelp;
                      if (showConceptHelp?.includes('1ST HALF')) key = '1ST HALF';
                      if (showConceptHelp?.includes('2ND HALF')) key = '2ND HALF';
                      let cInfo = CONCEPT_GUIDE_DATA[key];
                      if (cInfo) {
                        if (key === '1ST HALF') {
                          cInfo = {
                            ...cInfo,
                            title: `1ST HALF (~ ${turningYear}년) : 갈등 수용과 자각 축적기`,
                          };
                        } else if (key === '2ND HALF') {
                          cInfo = {
                            ...cInfo,
                            title: `2ND HALF (${turningYear}년 ~) : 자비 반조와 천명 만개기`,
                          };
                        } else if (showConceptHelp === '다크코드') {
                          cInfo = {
                            ...cInfo,
                            desc: cInfo.desc.replace(/75%/g, `${activeDarkScore}%`)
                          };
                        } else if (showConceptHelp === '자각 주파수') {
                          cInfo = {
                            ...cInfo,
                            desc: cInfo.desc.replace(/25%/g, `${activeAwareScore}%`),
                            action: cInfo.action ? cInfo.action.replace(/25%/g, `${activeAwareScore}%`) : cInfo.action
                          };
                        }
                      }
                      if (!cInfo) return (
                        <div className="text-center py-4 text-xs text-gray-400">
                          준비 중인 개념입니다. ({showConceptHelp})
                        </div>
                      );
                      return (
                        <div className="space-y-3">
                          <div className="bg-amber-950/20 border border-amber-500/20 p-3.5 rounded-xl">
                            <h4 className="text-xs font-black text-amber-300 leading-tight">{cInfo.title}</h4>
                            <p className="text-[9.5px] text-purple-300 font-semibold mt-1">{cInfo.subtitle}</p>
                          </div>
                          <div className="space-y-2 text-[9px] text-gray-300 leading-relaxed font-sans">
                            {showConceptHelp === '자각 주파수' ? (
                              <div className="space-y-3.5">
                                {/* 뉴럴코드 카드 */}
                                <div className="bg-[#090b16]/90 border border-indigo-500/30 p-3.5 rounded-2xl shadow-[0_0_15px_rgba(99,102,241,0.15)] space-y-2">
                                  <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                                    🧠 뉴럴코드의 과학적 근거 (현실 자각의 뇌과학)
                                  </span>
                                  <div className="bg-black/30 p-2 rounded-lg border border-white/5 text-[8.5px] text-gray-400">
                                    <span className="text-white font-extrabold block">🌳 은유적 비유</span>
                                    습관적인 불안의 흙길(다크코드) 옆에, 튼튼한 아스팔트 고속도로(자각 회로)를 새롭게 까는 과정.
                                  </div>
                                  <p className="text-gray-300 text-[8.5px] leading-relaxed pt-1">
                                    우리가 불안을 느낄 때 뇌의 생존 센서인 <b>편도체(Amygdala)</b>가 자극됩니다. 이 순간 숨을 고르며 "내 마음이 긴장해 있구나" 하고 객관적으로 알아차리면, <b>전전두엽(Prefrontal Cortex)</b>이 활성화되어 편도체의 과잉 활성을 억제합니다. 이러한 3초의 찰나적 자각이 반복되면, <b>신경가소성(Neuroplasticity)</b> 원리에 의해 뇌 신경망이 물리적으로 새롭게 재배선(Rewire)되어 영구적인 자각 회로가 장착됩니다.
                                  </p>
                                </div>

                                {/* 메타코드 카드 */}
                                <div className="bg-[#0a0614]/90 border border-purple-500/30 p-3.5 rounded-2xl shadow-[0_0_15px_rgba(168,85,247,0.15)] space-y-2">
                                  <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                                    ✨ 메타코드의 과학적 근거 (우주 동기화의 양자 뇌파학)
                                  </span>
                                  <div className="bg-black/30 p-2 rounded-lg border border-white/5 text-[8.5px] text-gray-400">
                                    <span className="text-white font-extrabold block">📻 은유적 비유</span>
                                    지직거리는 라디오의 다이얼을 정밀하게 돌려, 우주에서 송출하는 가장 맑은 본래 평화 주파수와 깨끗하게 싱크를 맞추는 현상.
                                  </div>
                                  <p className="text-gray-300 text-[8.5px] leading-relaxed pt-1">
                                    자각 상태가 깊어지면 날뛰던 뇌파가 고도의 일관성 있는 <b>세타파(Theta)</b> 및 통합 뇌파인 <b>감마파(Gamma)</b>로 동조화됩니다. 또한 양자물리학의 <b>'관찰자 효과(Observer Effect)'</b>에 의해, 관찰자의 의식이 개입하여 고통의 불규칙한 에너지 파동을 붕괴시키고 우주 본래의 고요한 기본 주파수와 하나로 정렬(Tuning)하게 됩니다. 이것이 우주와 동기화되는 메타코드의 힘입니다.
                                  </p>
                                </div>
                              </div>
                            ) : showConceptHelp === '다크코드' ? (
                              <div className="space-y-3.5">
                                {/* 다크코드 과학적 근거 */}
                                <div className="bg-[#120509]/90 border border-red-500/30 p-3.5 rounded-2xl shadow-[0_0_15px_rgba(239,68,68,0.1)] space-y-2">
                                  <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                                    🛡️ 다크코드의 과학적 근거 (에고의 자동 생존 보호막)
                                  </span>
                                  <div className="bg-black/30 p-2 rounded-lg border border-white/5 text-[8.5px] text-gray-400">
                                    <span className="text-white font-extrabold block">🚨 은유적 비유</span>
                                    시스템 붕괴를 막기 위해 일시적으로 최대 속도로 팬을 돌리며 경고음을 내는 붉은 방어 모니터.
                                  </div>
                                  <p className="text-gray-300 text-[8.5px] leading-relaxed pt-1">
                                    다크코드는 영적으로는 '에고의 분리감'이지만, 뇌과학적으로는 생존 위험을 감지하는 <b>편도체(Amygdala)</b>의 자동 방어 조건반사입니다. 위협이나 피로를 느낄 때 교감신경을 강하게 긴장시켜 나를 보호하려는 무의식적 방어 장치로, 나를 공격하려는 버그가 아니라 나를 지켜주려는 에고의 본능적 시스템 작동 방식입니다.
                                  </p>
                                </div>

                                {/* 사주 기질 분석 연동 해설 */}
                                <div className="bg-[#140b05]/95 border border-amber-500/30 p-3.5 rounded-2xl shadow-[0_0_15px_rgba(245,158,11,0.1)] space-y-2">
                                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                                    🧬 {data?.userName || '명심가'}님의 사주 에너지 기질 분석 (왜 {activeDarkScore}%인가?)
                                  </span>
                                  <p className="text-gray-300 text-[8.5px] leading-relaxed font-sans select-none">
                                    태어난 생년월일시의 사주 원국에서{' '}
                                    <b>
                                      <span onClick={() => handleMyeongliClick('오행')} className="text-purple-300 font-extrabold underline decoration-dotted decoration-purple-500/60 cursor-pointer hover:text-purple-200 hover:brightness-125 transition-all">오행</span>
                                      (
                                      <span onClick={() => handleMyeongliClick('목')} className="text-emerald-400 font-extrabold underline decoration-dotted decoration-emerald-500/60 cursor-pointer hover:text-emerald-300 hover:brightness-125 transition-all">목</span>·
                                      <span onClick={() => handleMyeongliClick('화')} className="text-red-400 font-extrabold underline decoration-dotted decoration-red-500/60 cursor-pointer hover:text-red-300 hover:brightness-125 transition-all">화</span>·
                                      <span onClick={() => handleMyeongliClick('토')} className="text-amber-500 font-extrabold underline decoration-dotted decoration-amber-500/60 cursor-pointer hover:text-amber-400 hover:brightness-125 transition-all">토</span>·
                                      <span onClick={() => handleMyeongliClick('금')} className="text-zinc-300 font-extrabold underline decoration-dotted decoration-zinc-400/60 cursor-pointer hover:text-zinc-200 hover:brightness-125 transition-all">금</span>·
                                      <span onClick={() => handleMyeongliClick('수')} className="text-blue-400 font-extrabold underline decoration-dotted decoration-blue-500/60 cursor-pointer hover:text-blue-300 hover:brightness-125 transition-all">수</span>
                                      )과{' '}
                                      <span onClick={() => handleMyeongliClick('십성')} className="text-purple-300 font-extrabold underline decoration-dotted decoration-purple-500/60 cursor-pointer hover:text-purple-200 hover:brightness-125 transition-all">십성</span>
                                      (
                                      <span onClick={() => handleMyeongliClick('비겁')} className="text-sky-300 font-extrabold underline decoration-dotted decoration-sky-500/60 cursor-pointer hover:text-sky-200 hover:brightness-125 transition-all">비겁</span>·
                                      <span onClick={() => handleMyeongliClick('식상')} className="text-pink-300 font-extrabold underline decoration-dotted decoration-pink-500/60 cursor-pointer hover:text-pink-200 hover:brightness-125 transition-all">식상</span>·
                                      <span onClick={() => handleMyeongliClick('재성')} className="text-amber-400 font-extrabold underline decoration-dotted decoration-amber-500/60 cursor-pointer hover:text-amber-300 hover:brightness-125 transition-all">재성</span>·
                                      <span onClick={() => handleMyeongliClick('편관')} className="text-violet-300 font-extrabold underline decoration-dotted decoration-violet-500/60 cursor-pointer hover:text-violet-200 hover:brightness-125 transition-all">관성</span>·
                                      <span onClick={() => handleMyeongliClick('편인')} className="text-indigo-300 font-extrabold underline decoration-dotted decoration-indigo-500/60 cursor-pointer hover:text-indigo-200 hover:brightness-125 transition-all">인성</span>
                                      )의 불균형적 혹은 강한 쏠림
                                    </b>
                                    이 발생할 경우, 뇌 신경망은 스트레스 상황에서 쉽게 긴장 상태로 각성하게 됩니다. {data?.userName || '명심가'}님의 고유한 사주 에너지 조합은 외부 환경에 민감하게 반응하여 나를 방어하려는 성향을 지니고 있어, 시스템 디버깅 결과 {activeDarkScore}% 수준의 에고 방어 과부하 지수로 산출된 것입니다. 이는 고정된 성적이 아닌, 알아차림을 통해 즉시 녹아내릴 기질적 무늬입니다.
                                  </p>
                                </div>
                              </div>
                            ) : (showConceptHelp?.includes('1ST HALF') || showConceptHelp?.includes('2ND HALF')) ? (
                              <div className="space-y-3.5">
                                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                                  <span className="text-white font-extrabold block">🌱 은유적 비유</span>
                                  <p className="text-gray-400 mt-0.5 leading-relaxed">{cInfo.metaphor}</p>
                                </div>
                                <div className="bg-[#0b0b18]/60 p-2.5 rounded-xl border border-white/5">
                                  <span className="text-white font-extrabold block">⚙️ 현실 의식 작용</span>
                                  <p className="text-gray-400 mt-0.5 leading-relaxed">{cInfo.desc}</p>
                                </div>

                                {/* 📊 연도별 3대 운세 시뮬레이터 차트 토글 버튼 */}
                                <button
                                  onClick={() => setShowTimelineChart(prev => !prev)}
                                  className="w-full py-2.5 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 hover:from-purple-800/80 hover:to-indigo-800/80 border border-purple-500/30 rounded-xl text-[10px] font-black text-purple-200 hover:text-white transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.15)] cursor-pointer"
                                >
                                  <span>📊 {showTimelineChart ? '년도별 운세 시뮬레이터 닫기 ▲' : '년도별 3대 운세 상세 그래프 보기 ▼'}</span>
                                </button>

                                {showTimelineChart && (
                                  <div className="bg-[#0b0b1a] border border-purple-500/20 rounded-2xl p-4 space-y-3.5 shadow-[0_0_25px_rgba(168,85,247,0.1)] text-left">
                                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                      <span className="text-[10px] font-bold text-amber-200">📊 연도별 기운 주파수 시뮬레이터</span>
                                      <span className="text-[8px] text-gray-500 font-mono">20~100 SCALE</span>
                                    </div>

                                    {/* 3대 필터 칩 */}
                                    <div className="flex gap-2">
                                      {[
                                        { id: 'wealth', label: '💰 재운', activeColor: 'bg-amber-500/20 border-amber-500/50 text-amber-300' },
                                        { id: 'love', label: '💖 연애', activeColor: 'bg-pink-500/20 border-pink-500/50 text-pink-300' },
                                        { id: 'work', label: '💼 사업', activeColor: 'bg-sky-500/20 border-sky-500/50 text-sky-300' }
                                      ].map((tab) => (
                                        <button
                                          key={tab.id}
                                          type="button"
                                          onClick={() => setTimelineTab(tab.id as any)}
                                          className={`flex-1 py-1.5 rounded-lg border text-[8.5px] font-bold transition-all cursor-pointer ${
                                            timelineTab === tab.id 
                                              ? tab.activeColor 
                                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                                          }`}
                                        >
                                          {tab.label}
                                        </button>
                                      ))}
                                    </div>

                                    {/* SVG Line Chart */}
                                    <div className="relative bg-black/40 rounded-xl p-2 border border-white/5 flex items-center justify-center">
                                      <svg className="w-[280px] h-[110px] select-none" viewBox="0 0 280 110">
                                        <defs>
                                          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={timelineTab === 'wealth' ? '#F59E0B' : timelineTab === 'love' ? '#EC4899' : '#0EA5E9'} stopOpacity="0.25"/>
                                            <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
                                          </linearGradient>
                                        </defs>
                                        
                                        {/* 그리드 눈금 선 */}
                                        <line x1="20" y1="15" x2="260" y2="15" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" strokeDasharray="2,2" />
                                        <line x1="20" y1="55" x2="260" y2="55" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" strokeDasharray="2,2" />
                                        <line x1="20" y1="95" x2="260" y2="95" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />

                                        {/* 영역 채우기 */}
                                        {(() => {
                                          const pts = timelineData.map((d, i) => {
                                            const x = 20 + i * 40;
                                            const val = timelineTab === 'wealth' ? d.wealth : timelineTab === 'love' ? d.love : d.work;
                                            const y = 95 - ((val - 30) / 70) * 80;
                                            return `${x},${y}`;
                                          });
                                          if (pts.length === 0) return null;
                                          const pathStr = `M 20 95 L ${pts[0]} ` + pts.slice(1).map(p => `L ${p}`).join(' ') + ` L 260 95 Z`;
                                          return <path d={pathStr} fill="url(#chartGlow)" />;
                                        })()}

                                        {/* 라인 드로잉 */}
                                        {(() => {
                                          const pts = timelineData.map((d, i) => {
                                            const x = 20 + i * 40;
                                            const val = timelineTab === 'wealth' ? d.wealth : timelineTab === 'love' ? d.love : d.work;
                                            const y = 95 - ((val - 30) / 70) * 80;
                                            return `${x},${y}`;
                                          }).join(' ');
                                          const strokeColor = timelineTab === 'wealth' ? '#F59E0B' : timelineTab === 'love' ? '#EC4899' : '#0EA5E9';
                                          return <polyline points={pts} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />;
                                        })()}

                                        {/* 각 포인트 점 버튼 */}
                                        {timelineData.map((d, i) => {
                                          const x = 20 + i * 40;
                                          const val = timelineTab === 'wealth' ? d.wealth : timelineTab === 'love' ? d.love : d.work;
                                          const y = 95 - ((val - 30) / 70) * 80;
                                          const isSelected = selectedYear === d.year;
                                          const color = timelineTab === 'wealth' ? '#F59E0B' : timelineTab === 'love' ? '#EC4899' : '#0EA5E9';

                                          return (
                                            <g key={d.year} className="cursor-pointer" onClick={() => { setSelectedYear(d.year); setShowYearDetailModal(true); }}>
                                              <circle cx={x} cy={y} r={isSelected ? 5.5 : 3.5} fill={isSelected ? '#FFFFFF' : color} stroke={color} strokeWidth={isSelected ? 3 : 1} className="transition-all" />
                                              <text x={x} y="107" fill={isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.3)'} fontSize="7" fontWeight={isSelected ? 'bold' : 'normal'} textAnchor="middle" className="font-mono">
                                                {d.year}
                                              </text>
                                            </g>
                                          );
                                        })}
                                      </svg>
                                    </div>

                                    {/* 선택한 연도별 설명 보드 */}
                                    {(() => {
                                      const activeInfo = timelineData.find(d => d.year === selectedYear);
                                      if (!activeInfo) return null;
                                      const score = timelineTab === 'wealth' ? activeInfo.wealth : timelineTab === 'love' ? activeInfo.love : activeInfo.work;
                                      const colorClass = timelineTab === 'wealth' ? 'text-amber-400 border-amber-500/20 bg-amber-500/5' : timelineTab === 'love' ? 'text-pink-400 border-pink-500/20 bg-pink-500/5' : 'text-sky-400 border-sky-500/20 bg-sky-500/5';
                                      const tabLabel = timelineTab === 'wealth' ? '재운 주파수' : timelineTab === 'love' ? '연애 주파수' : '사업/직장 주파수';

                                      return (
                                        <div className={`p-3 rounded-xl border ${colorClass} space-y-1.5 transition-all`}>
                                          <div className="flex justify-between items-center border-b border-white/5 pb-1">
                                            <span className="text-[9.5px] font-black">{selectedYear}년 {tabLabel}</span>
                                            <span className="font-mono font-black text-[11px]">{score}점</span>
                                          </div>
                                          <p className="text-[8.5px] leading-relaxed text-gray-300 break-keep font-sans">
                                            {activeInfo.comment}
                                          </p>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                )}

                                <div className="bg-purple-950/30 p-2.5 rounded-xl border border-purple-500/20">
                                  <span className="text-purple-300 font-extrabold block">✨ 자각 복귀 지침</span>
                                  <p className="text-purple-200/90 mt-0.5 leading-relaxed">{cInfo.action}</p>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                                  <span className="text-white font-extrabold block">🌱 은유적 비유</span>
                                  <p className="text-gray-400 mt-0.5">{cInfo.metaphor}</p>
                                </div>
                                <div className="bg-[#0b0b18]/60 p-2.5 rounded-xl border border-white/5">
                                  <span className="text-white font-extrabold block">⚙️ 현실 의식 작용</span>
                                  <p className="text-gray-400 mt-0.5">{cInfo.desc}</p>
                                </div>
                                <div className="bg-purple-950/30 p-2.5 rounded-xl border border-purple-500/20">
                                  <span className="text-purple-300 font-extrabold block">✨ 자각 복귀 지침</span>
                                  <p className="text-purple-200/90 mt-0.5">{cInfo.action}</p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="pt-2 shrink-0 z-10 space-y-2">
                    <button
                      onClick={() => {
                        setShowConceptHelp(null);
                        setShowMicroPassModal(true);
                      }}
                      className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] border border-amber-300/40"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                      <span>🔮 내 라이프 주기로 1:1 심층 AI 코칭 받기 (🔒 890원) ➔</span>
                    </button>
                    <button
                      onClick={() => setShowConceptHelp(null)}
                      className="w-full py-2 bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-amber-200 border border-amber-500/30 font-bold text-xs rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1 cursor-pointer shadow"
                    >
                      <span>자각 완료</span>
                      <span>↩️</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </AnimatePresence>,
            document.body
          )}

          {mounted && selectedBalanceAct !== null && typeof window !== 'undefined' && createPortal(
            <AnimatePresence>
              <div className="fixed inset-0 z-[20000] flex justify-center items-center bg-black/85 backdrop-blur-sm p-4 overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="w-full max-w-sm max-h-[85vh] bg-[#06060c] border border-amber-500/40 rounded-[28px] shadow-[0_0_40px_rgba(245,158,11,0.25)] flex flex-col relative overflow-hidden text-left p-5 text-white animate-fade-in"
                >
                  <div className="absolute top-[-10%] left-[-15%] w-[250px] h-[250px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />
                  <div className="flex justify-between items-center border-b border-white/5 pb-3 shrink-0 z-10">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span className="text-[11px] font-bold text-amber-200">의식 밸런스 저울 상세 설명</span>
                    </div>
                    <button onClick={() => setSelectedBalanceAct(null)} className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                      <X size={14} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto py-3 space-y-3.5 z-10 scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent text-left" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {(() => {
                      const score = selectedBalanceAct.score;
                      const darkScore = 100 - score;
                      const awareScore = score;
                      
                      const gan = data?.saju?.fourPillars?.day?.gan || '';
                      const elementMap: Record<string, string> = {
                        '갑': '목', '을': '목',
                        '병': '화', '정': '화',
                        '무': '토', '기': '토',
                        '경': '금', '신': '금',
                        '임': '수', '계': '수'
                      };
                      const dayMaster = gan ? `${gan}${elementMap[gan] || ''}` : '신금';
                      
                      const isPerfect = score === 50;
                      const isAware = score > 50;
                      const isEgo = score < 50;

                      return (
                        <>
                          {/* 현재 기질 밸런스 상태 요약 카드 */}
                          <div className="bg-amber-950/20 border border-amber-500/20 p-3.5 rounded-xl">
                            <span className="text-[8px] text-gray-500 block leading-none mb-1 font-mono uppercase">CURRENT STATUS</span>
                            <h4 className="text-xs font-black text-white leading-tight">
                              {selectedBalanceAct.label} 기질의 의식 밸런
                            </h4>
                            <p className="text-[9.5px] text-amber-400 font-semibold mt-1">
                              현재 상태: {isPerfect ? '⚖️ 완벽한 의식 균형 (50% vs 50%)' : isAware ? `🔵 자각 고조 상태 (자각 ${awareScore}% vs 다크 ${darkScore}%)` : `🔴 에고 방어 과부하 (다크 ${darkScore}% vs 자각 ${awareScore}%)`}
                            </p>
                          </div>

                          <div className="space-y-3.5 text-[9px] text-gray-300 leading-relaxed font-sans">
                            
                            {/* 🧬 실시간 주파수 밸런스 맞춤 분석 카드 */}
                            <div className="bg-gradient-to-r from-purple-950/20 to-indigo-950/20 border border-indigo-500/30 p-3.5 rounded-xl space-y-2">
                              <span className="text-purple-300 font-extrabold flex items-center gap-1">🧬 실시간 주파수 밸런스 맞춤 분석</span>
                              <p className="text-gray-200 text-[8.5px] leading-relaxed break-keep">
                                {isPerfect && (
                                  `✨ ${dayMaster} 일간이신 ${data?.userName || '명심가'}님의 [${selectedBalanceAct.label}] 기질은 현재 완벽한 의식 균형(50:50)을 이루고 있습니다. 이는 생존을 위한 현실적인 긴장감(에고)과 본질을 지각하는 참나(자각)가 조화롭게 평형을 이루어, 해당 기질의 본연의 에너지인 [${selectedBalanceAct.keyword || '타고난 고유 성정'}]가 아무런 왜곡이나 갈등 없이 현실 세계에 가장 아름답고 투명하게 발현되고 있음을 뜻합니다.`
                                )}
                                {isAware && (
                                  `🔵 ${dayMaster} 일간이신 ${data?.userName || '명심가'}님의 [${selectedBalanceAct.label}] 기질은 현재 자각 주파수(${awareScore}%)가 에고 방어망(${darkScore}%)보다 우세하게 작동하고 있는 '자각 고조 상태'입니다. 불안이나 긴장에 의식이 휩쓸리지 않고, [${selectedBalanceAct.keyword || '타고난 고유 성정'}]의 지혜를 유연하게 현실 소통과 창조로 녹여낼 수 있는 아주 정돈된 신경망 밸런스입니다.`
                                )}
                                {isEgo && (
                                  `🔴 ${dayMaster} 일간이신 ${data?.userName || '명심가'}님의 [${selectedBalanceAct.label}] 기질은 현재 에고 방어망(${darkScore}%)이 자각 주파수(${awareScore}%)를 앞서 있는 '에고 방어 과부하 상태'입니다. 이는 일시적인 긴장감, 조급증 혹은 거절에 대한 두려움으로 인해 뇌의 편도체가 경보 시스템을 켠 상태입니다. 

하지만 이것은 결코 기질적인 결함이 아닙니다. ${dayMaster} 일간 특유의 세심하고 깊은 내면 에너지가 외부 충격에 상처받지 않도록, 에고가 스스로를 지키기 위해 고마운 '생존 갑옷(방어막)'을 덧씌운 상태입니다.`
                                )}
                              </p>
                              {isEgo && (
                                <div className="border-t border-white/5 pt-2 mt-1">
                                  <span className="text-amber-400 font-bold block text-[8px]">💡 자각 재배선 처방 가이드</span>
                                  <p className="text-gray-300 text-[8.2px] leading-normal mt-0.5 break-keep">
                                    "아하, 내 에고가 나를 지키려고 이렇게 애쓰고 있구나" 하고 내면의 긴장을 따뜻하게 알아차리고 3초 숨을 고르는 찰나의 순간, 이성적 관조를 담당하는 전전두엽이 개입합니다. ${awareScore}%의 가벼운 자각(알아차림)만 보태져도 ${darkScore}%의 단단한 다크코드 갑옷은 순식간에 녹아내려 고조된 자각 상태로 나아가게 됩니다.
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* 의식 저울의 판정 기준 */}
                            <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-2.5">
                              <span className="text-white font-extrabold block">📊 의식 저울의 3대 판정 기준</span>
                              
                              <div className={`space-y-1 p-2 rounded-lg border transition-all ${isPerfect ? 'border-amber-500/30 bg-amber-500/5 opacity-100' : 'border-transparent opacity-40'}`}>
                                <div className="flex justify-between items-center">
                                  <span className="text-amber-300 font-bold block">1. 완벽한 의식 균형 (50:50)</span>
                                  {isPerfect && <span className="text-[7.5px] bg-amber-500/20 text-amber-300 font-black px-1.5 py-0.5 rounded">현재 상태</span>}
                                </div>
                                <p className="text-gray-400 pl-1 leading-normal text-[8.2px] break-keep">
                                  생존 불안을 조율하는 에고(다크코드 50%)와 본질을 지각하는 참나(자각 주파수 50%)가 완벽한 평형을 이룬 황금 비율 상태입니다. 자기 방어에 매몰되지도 않고, 지나치게 이상만을 쫓지도 않는 가장 조화로운 지점입니다.
                                </p>
                              </div>

                              <div className={`space-y-1 p-2 rounded-lg border transition-all ${isAware ? 'border-indigo-500/30 bg-indigo-500/5 opacity-100' : 'border-transparent opacity-40'}`}>
                                <div className="flex justify-between items-center">
                                  <span className="text-indigo-300 font-bold block">2. 자각 고조 상태 (자각 &gt; 50%)</span>
                                  {isAware && <span className="text-[7.5px] bg-indigo-500/20 text-indigo-300 font-black px-1.5 py-0.5 rounded">현재 상태</span>}
                                </div>
                                <p className="text-gray-400 pl-1 leading-normal text-[8.2px] break-keep">
                                  자각 주파수가 더 우세하게 작동하여 내면의 유연성과 수용도가 매우 깊어진 상태입니다. 외부 자극이나 위기에도 뇌가 긴장하지 않고, 침착하고 명석한 의식(뉴럴코드/메타코드)으로 대처해 나갈 수 있습니다.
                                </p>
                              </div>

                              <div className={`space-y-1 p-2 rounded-lg border transition-all ${isEgo ? 'border-red-500/30 bg-red-500/5 opacity-100' : 'border-transparent opacity-40'}`}>
                                <div className="flex justify-between items-center">
                                  <span className="text-red-300 font-bold block">3. 에고 방어 과부하 (다크 &gt; 50%)</span>
                                  {isEgo && <span className="text-[7.5px] bg-red-500/20 text-red-300 font-black px-1.5 py-0.5 rounded">현재 상태</span>}
                                </div>
                                <p className="text-gray-400 pl-1 leading-normal text-[8.2px] break-keep">
                                  불안, 긴장, 거절의 두려움 등으로 인해 다크코드가 비상 경보({darkScore}% 수준)를 발동한 상태입니다. 이는 영구적인 결함이 아니며, 뇌가 스스로를 위기에서 보호하기 위해 서투른 방어막(갑옷)을 임시로 씌운 고마운 상태를 뜻합니다.
                                </p>
                              </div>
                            </div>

                            {/* 뇌과학적 작동 메커니즘 */}
                            <div className="bg-[#0b0b18]/60 p-3 rounded-xl border border-white/5 space-y-1.5">
                              <span className="text-white font-extrabold block">🧠 뇌과학적 작동 메커니즘</span>
                              <p className="text-gray-400 leading-relaxed text-[8.5px] break-keep">
                                인간의 뇌는 위험을 느낄 때 가장 원초적인 부위인 <b>편도체(Amygdala)</b>를 즉각 활성화하여 생존 방어 본능(다크코드)을 가동합니다. 이에 대항하여 우리가 "지금 마음이 긴장해 있구나"라고 가만히 인지하는 순간, 이성적 관조를 담당하는 <b>전전두엽(Prefrontal Cortex)</b>이 개입하여 편도체의 흥분을 누르고 부교감신경계를 안정시킵니다.
                              </p>
                              <p className="text-gray-400 leading-relaxed text-[8.5px] mt-1 break-keep">
                                이때 {awareScore}%의 알아차림만 보태져도 신경망은 물리적인 재배선 과정(신경가소성)을 거쳐 {darkScore}%의 다크코드를 순식간에 녹여내고, 50%의 평형 상태를 넘어 고도의 고조 상태로 나아갈 수 있습니다.
                              </p>
                            </div>

                            {/* 사주 에너지와의 연동 원리 */}
                            <div className="bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 space-y-1.5">
                              <span className="text-amber-300 font-extrabold block">🧬 내 사주 분석에 따른 고유 수치 도출</span>
                              <p className="text-amber-200/90 leading-relaxed text-[8.5px] select-none break-keep">
                                이 수치는 단순한 랜덤 점수가 아닙니다. {data?.userName || '명심가'}님이 태어나신 년·월·일·시의 사주 천간·지지(8글자)에서{' '}
                                <b>
                                  <span onClick={() => handleMyeongliClick('오행')} className="text-purple-300 font-extrabold underline decoration-dotted decoration-purple-500/60 cursor-pointer hover:text-purple-200 hover:brightness-125 transition-all">오행</span>
                                </b>
                                의 분포와{' '}
                                <b>
                                  <span onClick={() => handleMyeongliClick('비겁')} className="text-sky-300 font-bold underline decoration-dotted decoration-sky-500/60 cursor-pointer hover:text-sky-200 hover:brightness-125 transition-all">비겁</span>·
                                  <span onClick={() => handleMyeongliClick('식상')} className="text-pink-300 font-bold underline decoration-dotted decoration-pink-500/60 cursor-pointer hover:text-pink-200 hover:brightness-125 transition-all">식상</span>·
                                  <span onClick={() => handleMyeongliClick('재성')} className="text-amber-400 font-bold underline decoration-dotted decoration-amber-500/60 cursor-pointer hover:text-amber-300 hover:brightness-125 transition-all">재성</span>·
                                  <span onClick={() => handleMyeongliClick('편관')} className="text-violet-300 font-bold underline decoration-dotted decoration-violet-500/60 cursor-pointer hover:text-violet-200 hover:brightness-125 transition-all">관성</span>·
                                  <span onClick={() => handleMyeongliClick('편인')} className="text-indigo-300 font-bold underline decoration-dotted decoration-indigo-500/60 cursor-pointer hover:text-indigo-200 hover:brightness-125 transition-all">인성</span>
                                  (<span onClick={() => handleMyeongliClick('십성')} className="text-purple-300 font-extrabold underline decoration-dotted decoration-purple-500/60 cursor-pointer hover:text-purple-200 hover:brightness-125 transition-all">십성</span>)
                                </b>
                                의 치우침을 계산하고, 이를 행성 고유의 기하학적 활성 위치(고유 시드값)에 대입하여 산출된 <b>실시간 기질적 밸런스 주파수</b>입니다.
                              </p>
                              <p className="text-amber-200/80 leading-relaxed text-[8.5px] mt-1 break-keep">
                                이 점수가 50%로 수렴되어 평형을 이룬다면, 해당 행성의 기질적 에너지가 현실에서 갈등 없이 완벽하게 조율되어 흐르고 있음을 뜻합니다.
                              </p>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <div className="pt-2 shrink-0 z-10">
                    <button
                      onClick={() => setSelectedBalanceAct(null)}
                      className="w-full py-2 bg-gradient-to-r from-amber-700 to-indigo-900 hover:from-amber-600 hover:to-indigo-800 text-white font-bold text-xs rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1"
                    >
                      <span>자각 완료</span>
                      <span>↩️</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </AnimatePresence>,
            document.body
          )}

          {mounted && selectedFrequencyDetail !== null && typeof window !== 'undefined' && createPortal(
            <AnimatePresence>
              <div className="fixed inset-0 z-[20000] flex justify-center items-center bg-black/85 backdrop-blur-sm p-4 overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="w-full max-w-sm max-h-[85vh] bg-[#06060c] border border-purple-500/40 rounded-[28px] shadow-[0_0_40px_rgba(168,85,247,0.25)] flex flex-col relative overflow-hidden text-left p-5 text-white animate-fade-in"
                >
                  <div className="absolute top-[-10%] left-[-15%] w-[250px] h-[250px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />
                  <div className="flex justify-between items-center border-b border-white/5 pb-3 shrink-0 z-10">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                      <span className="text-[11px] font-bold text-amber-200">{selectedFrequencyDetail} 상세 해설</span>
                    </div>
                    <button onClick={() => setSelectedFrequencyDetail(null)} className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                      <X size={14} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto py-3 space-y-3.5 z-10 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent text-left" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {(() => {
                      if (selectedFrequencyDetail === '미약 주파수') {
                        return (
                          <div className="space-y-3.5">
                            <div className="bg-gray-900/40 border border-gray-500/20 p-3.5 rounded-xl">
                              <span className="text-[8px] text-gray-500 block leading-none mb-1 font-mono uppercase">METAPHOR & VISUAL</span>
                              <h4 className="text-xs font-black text-gray-300">📡 송수신을 일시적으로 끈 고요한 밤의 안테나</h4>
                              <p className="text-[9.5px] text-gray-400 font-semibold mt-1">대역 점수: 0 ~ 29점</p>
                            </div>
                            <div className="space-y-2.5 text-[9px] text-gray-300 leading-relaxed font-sans">
                              <p>
                                해당 의식 영역의 주파수가 현실적으로 작동하지 않거나 비워져 있는 상태입니다. 점수가 낮다고 해서 기능이 부족하거나 나쁜 것이 결코 아닙니다.
                              </p>
                              <p>
                                🎨 <b>은유적 비유</b>: 하얀 도화지 위의 <b>'여백의 미'</b>와 같으며, 소음이 가득한 도심 한가운데에 조용히 문을 닫아걸어 놓은 <b>'나만의 고요한 명상방'</b>입니다.
                              </p>
                              <p>
                                ⚙️ <b>현실 자각 원리</b>: 고정된 생각이나 의무적 행동 패턴에 사로잡히지 않는 가장 자유롭고 초연한 영역입니다. 외부의 시선이나 강박에 쉽게 오염되지 않고, 세상의 흐름을 가장 객관적이고 맑은 거울의 눈으로 비춰줄 수 있는 숨겨진 '초월의 안식처' 역할을 합니다.
                              </p>
                            </div>
                          </div>
                        );
                      } else if (selectedFrequencyDetail === '수용형 주파수') {
                        return (
                          <div className="space-y-3.5">
                            <div className="bg-sky-950/20 border border-sky-500/20 p-3.5 rounded-xl">
                              <span className="text-[8px] text-sky-400 block leading-none mb-1 font-mono uppercase">METAPHOR & VISUAL</span>
                              <h4 className="text-xs font-black text-sky-300">🌊 바람에 따라 유연하게 춤추는 맑은 호숫물</h4>
                              <p className="text-[9.5px] text-sky-400 font-semibold mt-1">대역 점수: 30 ~ 59점</p>
                            </div>
                            <div className="space-y-2.5 text-[9px] text-gray-300 leading-relaxed font-sans">
                              <p>
                                고집스러운 규칙이나 단단한 껍질을 버리고, 내 곁에 다가오는 사람들과 주변 환경의 주파수를 가감 없이 부드럽게 흡수하고 담아내는 유연한 지대입니다.
                              </p>
                              <p>
                                🏺 <b>은유적 비유</b>: 정해진 모양이 없어 어떤 그릇에든 담기는 <b>'투명한 물'</b>과 같으며, 나를 비우고 상대를 담아내는 <b>'열린 쉼터'</b>입니다.
                              </p>
                              <p>
                                ⚙️ <b>현실 자각 원리</b>: "내 방식이 무조건 맞다"는 아집(다크코드)을 내려놓기 가장 쉬운 축복받은 상태입니다. 타인의 슬픔이나 아이디어를 깊이 공감하고 비춰주는 뛰어난 관조력을 선사합니다. 다만, 물이 흙탕물에 물들기 쉽듯 내 중심이 일시적으로 흔들릴 수 있으므로, 감정에 지쳤을 땐 가만히 내 본래의 맑은 거울을 닦아내는 3초의 알아차림 호흡이 필요합니다.
                              </p>
                            </div>
                          </div>
                        );
                      } else if (selectedFrequencyDetail === '고정형 주파수') {
                        return (
                          <div className="space-y-3.5">
                            <div className="bg-purple-950/20 border border-purple-500/20 p-3.5 rounded-xl">
                              <span className="text-[8px] text-purple-400 block leading-none mb-1 font-mono uppercase">METAPHOR & VISUAL</span>
                              <h4 className="text-xs font-black text-purple-300">⛰️ 흔들림 없이 숲을 지키는 굳건한 태산</h4>
                              <p className="text-[9.5px] text-purple-400 font-semibold mt-1">대역 점수: 60 ~ 85점</p>
                            </div>
                            <div className="space-y-2.5 text-[9px] text-gray-300 leading-relaxed font-sans">
                              <p>
                                나만의 확고한 의지, 가치관, 일관성 있는 행동 규칙이 늘 뚜렷하고 흔들림 없이 밖을 향해 방송(Broadcasting)되는 굳건한 에너지 상태입니다.
                              </p>
                              <p>
                                🪨 <b>은유적 비유</b>: 모진 비바람과 태풍이 몰아쳐도 끄떡없이 자리를 지키는 <b>'단단한 반석'</b>이자, 사막에서 길을 잃은 자들에게 일정한 신호를 보내주는 <b>'등대 방송국'</b>입니다.
                              </p>
                              <p>
                                ⚙️ <b>현실 자각 원리</b>: 주변 사람들의 평가나 불안의 파도에 쉽게 쓸려가지 않고 신뢰를 형성하는 핵심 뼈대입니다. 다만, 내 반석의 단단함이 자칫 타인에게 강요나 편협함(다크코드)으로 변질되지 않도록, 내 굳건함 사이에 부드러운 자비와 관용의 잔디를 곁들여주는 것이 메타코드로 가는 최고의 비결입니다.
                              </p>
                            </div>
                          </div>
                        );
                      } else if (selectedFrequencyDetail === '극대화 주파수') {
                        return (
                          <div className="space-y-3.5">
                            <div className="bg-amber-950/20 border border-amber-500/20 p-3.5 rounded-xl">
                              <span className="text-[8px] text-amber-400 block leading-none mb-1 font-mono uppercase">METAPHOR & VISUAL</span>
                              <h4 className="text-xs font-black text-amber-300">☀️ 온 세상을 눈부시게 비추는 정오의 태양</h4>
                              <p className="text-[9.5px] text-amber-400 font-semibold mt-1">대역 점수: 86 ~ 100점</p>
                            </div>
                            <div className="space-y-2.5 text-[9px] text-gray-300 leading-relaxed font-sans">
                              <p>
                                해당 영역의 기질과 잠재력이 한계점까지 극대화되어, 주변 공간과 만나는 사람들의 파동 전체를 내 강력한 흐름으로 주도하고 흡수해 버리는 강렬한 기운입니다.
                              </p>
                              <p>
                                🌋 <b>은유적 비유</b>: 지각을 뚫고 타오르는 <b>'활화산의 마그마'</b>와 같으며, 빛과 열을 골고루 나누어 만물을 자라나게 하는 <b>'정오의 태양빛'</b>입니다.
                              </p>
                              <p>
                                ⚙️ <b>현실 자각 원리</b>: 억지로 행동하지 않아도 저절로 대중의 이목을 끌고 영향력을 뿜어내는 '리더십의 중심축'입니다. 그러나 너무 강렬한 태양빛은 주위를 건조하게 만들 수 있듯이, 내 강력한 기운이 타인을 위축시키거나 조급하게 만들지 않도록 스스로 힘을 낮추고 그늘막을 만들어주는 '지극한 겸손의 미덕'을 발휘할 때 진정한 천명이 완성됩니다.
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>

                  <div className="pt-2 shrink-0 z-10">
                    <button
                      onClick={() => setSelectedFrequencyDetail(null)}
                      className="w-full py-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1"
                    >
                      <span>자각 완료</span>
                      <span>↩️</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </AnimatePresence>,
            document.body
          )}

        </motion.div>
      </div>
    </AnimatePresence>

    {/* 📊 연도별 3대 운세 상세 감동 분석 모달 팝업 */}
    {typeof window !== 'undefined' && createPortal(
      <AnimatePresence>
        {showYearDetailModal && (
          <div className="fixed inset-0 z-[30000] flex justify-center items-center bg-black/85 backdrop-blur-sm p-4 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-full max-w-sm max-h-[85vh] bg-[#06060c] border border-amber-500/40 rounded-[28px] shadow-[0_0_40px_rgba(245,158,11,0.25)] flex flex-col relative overflow-hidden text-left p-5 text-white"
            >
              {/* 은은한 네온 성운 효과 */}
              <div className="absolute top-[-10%] left-[-15%] w-[250px] h-[250px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />
              
              {/* 상단 헤더 */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3 shrink-0 z-10">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                  <span className="text-[11px] font-black text-amber-200 truncate">
                    🌌 {selectedYear}년 {data?.userName || '명심가'}님 사주 맞춤 오행 분석
                  </span>
                </div>
                <button 
                  onClick={() => setShowYearDetailModal(false)} 
                  className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors shrink-0"
                >
                  <X size={14} />
                </button>
              </div>

              {/* 사주 원국 명시 뱃지 */}
              <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl my-2 shrink-0 flex items-center gap-1.5">
                <span className="text-xs">🧬</span>
                <p className="text-[8.5px] text-amber-300 font-bold truncate">
                  {data?.userName || '명심가'}님의 생년월일 사주 원국({data?.saju?.fourPillars?.day?.gan || '신'}금 일간) & {selectedYear}년 세운 결합
                </p>
              </div>

              {/* 스크롤 설명 본문 */}
              <div className="flex-1 overflow-y-auto py-2 space-y-4 z-10 scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent">
                {(() => {
                  const activeInfo = timelineData.find(d => d.year === selectedYear);
                  if (!activeInfo) return <p className="text-xs text-gray-400">데이터가 없습니다.</p>;
                  const analyses = getYearDetailAnalyses(selectedYear, activeInfo);

                  return (
                    <div className="space-y-4 font-sans">
                      {/* 1. 3대 지표 점수 현황 */}
                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3.5 space-y-2.5">
                        <span className="text-[9.5px] font-extrabold text-amber-400/90 block">📊 {selectedYear}년 3대 기운 주파수</span>
                        <div className="space-y-2 text-[9px]">
                          {/* 재물 */}
                          <div className="space-y-1">
                            <div className="flex justify-between font-bold text-gray-300">
                              <span>💰 재물 주파수</span>
                              <span className="text-amber-400">{activeInfo.wealth}점</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${activeInfo.wealth}%` }} />
                            </div>
                          </div>
                          {/* 연애 */}
                          <div className="space-y-1">
                            <div className="flex justify-between font-bold text-gray-300">
                              <span>❤️ 연애·인연 주파수</span>
                              <span className="text-pink-400">{activeInfo.love}점</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-pink-500 rounded-full" style={{ width: `${activeInfo.love}%` }} />
                            </div>
                          </div>
                          {/* 사업 */}
                          <div className="space-y-1">
                            <div className="flex justify-between font-bold text-gray-300">
                              <span>💼 사업·직업 주파수</span>
                              <span className="text-sky-400">{activeInfo.work}점</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-sky-500 rounded-full" style={{ width: `${activeInfo.work}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 2. 오행 비유법 해설 목록 */}
                      <div className="space-y-3.5 text-[9px] leading-relaxed">
                        {/* 재물 상세 */}
                        <div className="bg-[#120b05]/95 border border-amber-500/20 p-3.5 rounded-2xl space-y-1.5">
                          <span className="text-amber-400 font-extrabold flex items-center gap-1">
                            💰 재정적 풍요와 상생의 기류
                          </span>
                          <p className="text-gray-300 select-none break-keep leading-relaxed font-normal">
                            {analyses.wealthTxt}
                          </p>
                        </div>

                        {/* 연애 상세 */}
                        <div className="bg-[#160610]/95 border border-pink-500/20 p-3.5 rounded-2xl space-y-1.5">
                          <span className="text-pink-400 font-extrabold flex items-center gap-1">
                            ❤️ 관계와 우주적 인연의 등불
                          </span>
                          <p className="text-gray-300 select-none break-keep leading-relaxed font-normal">
                            {analyses.loveTxt}
                          </p>
                        </div>

                        {/* 사업 상세 */}
                        <div className="bg-[#060c16]/95 border border-sky-500/20 p-3.5 rounded-2xl space-y-1.5">
                          <span className="text-sky-400 font-extrabold flex items-center gap-1">
                            💼 천명 비즈니스와 영향력의 확장
                          </span>
                          <p className="text-gray-300 select-none break-keep leading-relaxed font-normal">
                            {analyses.workTxt}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 하단 890원 AI 코칭 CTA & 닫기 */}
              <div className="pt-2 shrink-0 z-10 border-t border-white/5 space-y-2">
                <button
                  onClick={() => {
                    setShowYearDetailModal(false);
                    setShowMicroPassModal(true);
                  }}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] border border-amber-300/40"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>🔮 {selectedYear}년 사주 맞춤 1:1 심층 AI 코칭 (🔒 890원) ➔</span>
                </button>
                <button
                  onClick={() => setShowYearDetailModal(false)}
                  className="w-full py-2 bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-amber-200 border border-amber-500/30 font-bold text-xs rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1 cursor-pointer shadow"
                >
                  <span>우주 자각 완료</span>
                  <span>✨</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}

    <MyeongliTermModal 
      isOpen={showMyeongliModal} 
      onClose={() => setShowMyeongliModal(false)} 
      term={selectedMyeongliTerm} 
    />

    <MicroPassModal
      isOpen={showMicroPassModal}
      onClose={() => setShowMicroPassModal(false)}
      userSajuData={data}
    />
    </>
  );
}
