'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Share2, Sparkles, Download, Compass, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { MYEONGSIM_ORACLE_DATA } from '@/data/myeongsimOracleData';
import PaymentCard from '@/components/chat/PaymentCard';

interface MyeongsimOracleCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  sajuText?: string;
  gongWang?: string[];
}

// 64개 명심괘 매핑
const GATES_MAP: { name: string; keyword: string }[] = [
  { name: '', keyword: '' },
  { name: '자기세계의 창조', keyword: '자신만의 독창적인 세계를 표현하려는 강렬한 의지' },
  { name: '큰 방향의 수신자', keyword: '우주의 리듬에 귀 기울여 방향을 감지하는 직관' },
  { name: '새벽의 첫 발돋움', keyword: '혼란 속에서도 새로운 질서의 싹을 틔우는 시작의 에너지' },
  { name: '논리적 해답 공식', keyword: '복잡한 문제를 단계별로 풀어내는 정돈된 사고 체계' },
  { name: '자연 리듬의 기다림', keyword: '인위적으로 재촉하지 않고 때가 오면 움직이는 자연의 타이밍' },
  { name: '감정의 파도 조절', keyword: '격한 감정의 물살을 다스리며 친밀감의 경계를 지키는 능력' },
  { name: '민주적 리더십', keyword: '앞에 나서기보다 뒤에서 사람들의 방향을 이끄는 조율의 지혜' },
  { name: '독창적 기여', keyword: '남과 다른 나만의 색깔로 공동체에 가치를 보태는 방식' },
  { name: '디테일 집중력', keyword: '아주 작고 세밀한 부분에도 놓치지 않고 끈질기게 파고드는 힘' },
  { name: '자기답게 사는 길', keyword: '남의 시선을 의식하지 않고 본연의 모습 그대로 살아가는 용기' },
  { name: '평화로운 아이디어', keyword: '조용히 마음속에 떠오르는 영감과 상상의 세계' },
  { name: '신중한 표현', keyword: '말과 행동을 멈추고 적절한 때를 기다려 내뱉는 절제된 소통' },
  { name: '경청과 증인', keyword: '타인의 이야기를 깊이 들어주며 삶의 지혜를 수집하는 귀' },
  { name: '풍요의 기술', keyword: '자원과 재능을 활용하여 물질적 풍요를 만들어내는 동력' },
  { name: '겸손의 극단', keyword: '다양한 사람과 리듬을 포용하며 큰 그릇으로 담아내는 관용' },
  { name: '열정적 숙련', keyword: '반복적인 연습과 몰입을 통해 기술을 완성해 가는 과정' },
  { name: '의견과 주장', keyword: '논리적 근거를 바탕으로 자신의 관점을 펼치는 설득력' },
  { name: '패턴 교정', keyword: '잘못된 것을 발견하고 더 나은 방향으로 바로잡으려는 본능' },
  { name: '예세한 감정 공감', keyword: '주변 사람들이 필요한 것까지 눈치로 알아채는 감각' },
  { name: '지금 이 순간 현존', keyword: '과거와 미래의 불안을 지우고 오직 현재에 깨어있는 의식' },
  { name: '공정한 바로세우기', keyword: '누구든 울타리가 넘도록 바운더리 질서와 기율을 세우는 주권' },
  { name: '따뜻한 감성 품격', keyword: '눈치 보지 않는 당당한 멋에 깃드는 매너와 아름다운 매력' },
  { name: '복잡한 것 단도직입 깎기', keyword: '어렵고 복잡한 정보를 핵심만 뽑아내 깔끔하게 정리하는 능력' },
  { name: '내적 숙고 성찰', keyword: '실패와 어두운 밤을 거쳐 결국 내 마음의 진짜 참뜻을 깨닫는 힘' },
  { name: '조건 없는 참사랑', keyword: '어떠한 편견과 조건 없이 상대의 입장까지 감싸주는 순수한 사랑의 에너지' },
  { name: '마음 읽는 비즈니스', keyword: '상대방의 마음과 본능을 간파하여 큰 가치를 거래하는 기획력' },
  { name: '생명 돌봄과 양육', keyword: '내 곁의 사람들의 생명을 건강하게 자라게 하려 정성을 가득 담는 힘' },
  { name: '의미 찾는 모험', keyword: '삶의 깊은 의미를 찾기 위해 위험도 감수하며 부딪히는 모험 정신' },
  { name: '끝까지 해내는 헌신', keyword: '한번 맡은 일은 끝까지 밀고 나가는 뚝심과 몰입의 힘' },
  { name: '운명적인 불꽃 감정', keyword: '비록 현실 벽에 막히더라도 새로운 꿈을 꾸며 가슴을 채우는 열정' },
  { name: '권위 있는 설득', keyword: '강압 없이 자연스러운 리더십으로 사람들을 부드럽게 이끄는 영향력' },
  { name: '한결같은 지키기', keyword: '트렌드가 바뀌고 세상이 변해도 내 고유한 뿌리를 흔들림 없이 지키는 지속성' },
  { name: '고요한 숙고 은퇴', keyword: '불필요한 참견을 멈추고 고요한 나만의 방으로 한 걸음 물러나 충전하는 지혜' },
  { name: '바른 힘의 사용', keyword: '누구를 짓밟지 않고 내 주체적인 독립성을 건강하게 지켜내는 진짜 힘' },
  { name: '경험을 통한 진보', keyword: '수많은 시행착오와 모험을 밟고 올라가 결국 인생을 더 높은 곳으로 비상시키는 힘' },
  { name: '어둠 속의 빛 준비', keyword: '어둠과 위기 속에서도 미래의 빛을 품고 기다리는 인내의 힘' },
  { name: '가족 챙기기', keyword: '가족과 공동체를 따뜻한 우정과 책임감으로 끈끈하게 지켜내는 힘' },
  { name: '정의로운 투사', keyword: '내 주권과 신념을 위해 부조리에 맞서 싸우는 투지' },
  { name: '돌파의 촉발자', keyword: '막힌 관계나 삶의 흐름을 본능적 추진력으로 시원하게 뚫어버리는 기운' },
  { name: '자유로운 해방', keyword: '과거의 무거운 짐과 족쇄를 훌훌 벗어던지는 자유' },
  { name: '시작의 에너지 충전', keyword: '새로운 시작을 위해 생각과 감각을 한 덩어리로 모아 축적하는 한계' },
  { name: '풍요로운 성장의 마침', keyword: '한번 시작한 일을 끝까지 성장시켜 풍성하게 마무리하는 번영' },
  { name: '직관의 돌파구', keyword: '복잡한 추론 없이 한순간에 떠오르는 진실의 통찰' },
  { name: '본능의 세포기억', keyword: '과거 사람들의 생존 노하우를 세포 깊이 기억하여 경계하는 직감' },
  { name: '사람 모으는 구심점', keyword: '자연스러운 포용력과 매력으로 주변에 사람과 자원을 자연스럽게 끌어모으는 힘' },
  { name: '온몸으로 부딪히는 삶', keyword: '머리로 고민하지 않고 몸이 가리키는 방향으로 직접 뛰어들어 체험하는 힘' },
  { name: '해석의 마스터키', keyword: '꼬이고 어두운 과거의 아픈 기억을 성찰을 통해 삶의 해석으로 전환하는 힘' },
  { name: '무의식의 마르지 않는 샘물', keyword: '끝도 없이 마르지 않는 깊고 신비로운 마음의 지식과 감각' },
  { name: '판을 새로 짜는 혁신', keyword: '더 이상 통하지 않는 낡은 구조를 깨고 새 판을 짜는 혁명가 기질' },
  { name: '영적 뼈대 구조', keyword: '양보할 수 없는 삶의 뼈대가 되는 공명 규칙과 도덕적 가치관' },
  { name: '각성 촉발의 천둥', keyword: '안주하는 나에게 충격을 주어 안태한 마음을 한순간에 일깨우는 깨달음의 불꽃' },
  { name: '움직이지 않는 묵직함', keyword: '세상이 시끄럽게 흔들려도 바위처럼 고요하게 한자리를 굳건히 지키는 힘' },
  { name: '첫단추 첫발 행진', keyword: '서두르지 않고 기초부터 벽돌을 한 장 한 장 쌓아 거대한 것을 짓는 인내' },
  { name: '마음의 성취 야망', keyword: '가장 낮은 자리에서 출발하더라도 결국에는 최고봉에 이르겠다는 강인한 야망' },
  { name: '마음의 멜로디', keyword: '현실의 필요보다 내 가슴속에 먼저 울려퍼지는 감정의 리듬을 신뢰하는 힘' },
  { name: '인생 여행 이야기꾼', keyword: '삶 곳곳에서 겪은 수많은 경험을 감동적인 말로 전하는 스토리텔링' },
  { name: '바람결 같은 직감', keyword: '소리 없이 다가오는 미래의 직관적 메시지를 감각적으로 빠르게 캐치하는 귀' },
  { name: '삶의 기쁨 활력소', keyword: '특별한 이유가 없더라도 살아있음 자체만으로도 온몸에 충만한 에너지가 되는 활력' },
  { name: '장벽 허물기와 융합', keyword: '사람 사이의 보이지 않는 벽을 한숨에 부수고 친밀하게 섞이는 결합력' },
  { name: '한계의 지렛대 수용', keyword: '주어진 제약을 장애물이라 여기지 않고 슬기롭게 발판 삼아 뛰어넘는 수용력' },
  { name: '내면 우주 사색', keyword: '우주가 굴러가는 거시적인 원리와 인간 본성의 원리를 성찰하는 탐색가' },
  { name: '현실의 핵심 과학', keyword: '누구도 반박할 수 없는 논리를 배제하고 딱딱한 사실과 수치를 원리적으로 꿰어내는 힘' },
  { name: '아름다운 의심과 해결', keyword: '정말로 찜찜함과 의심을 끝까지 깔끔하게 마침표 찍고 문을 닫는 종결력' },
  { name: '운명 속의 가능성', keyword: '비록 지금은 안개 속처럼 뿌옇게 보이더라도 반드시 길이 있음을 신뢰하는 마음' }
];

// 로마 숫자 변환 함수
function toRoman(num: number): string {
  const romanMap: Record<string, number> = {
    M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90,
    L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1
  };
  let roman = '';
  let n = num;
  for (const key in romanMap) {
    while (n >= romanMap[key]) {
      roman += key;
      n -= romanMap[key];
    }
  }
  return roman || 'O';
}

// 주역 괘상 구하기
const getTrigramLines = (gateNum: number): boolean[] => {
  const lines: boolean[] = [];
  let seed = gateNum * 17 + 5;
  for (let i = 0; i < 6; i++) {
    lines.push(seed % 2 === 1);
    seed = Math.floor(seed / 2);
  }
  return lines;
};

// 괘별 고유 영문 서브타이틀 매핑
const GET_ENGLISH_SUBTITLE = (gateNum: number): string => {
  const englishTitles: Record<number, string> = {
    1: 'Creativity of Personal Universe',
    2: 'Receiver of Large Direction',
    3: 'First Step of the Dawn',
    4: 'Formula of Logical Solution',
    5: 'Waiting for Natural Rhythm',
    6: 'Control of Emotional Waves',
    7: 'Democratic Leadership Core',
    8: 'Unique Contribution Style',
    9: 'Intensity of Detail Focus',
    10: 'Beyond Self-Identity: The Eternal Witness',
    11: 'Peaceful Realm of Ideas',
    12: 'Awareness of Awareness: Silent Expression',
    13: 'The Ear of Deep Listening',
    14: 'Technology of Material Abundance',
    15: 'Tolerance of Extreme Humility',
    16: 'Mastery through Repetitive Molten',
    17: 'Persuasion of Logical Ground',
    18: 'Correction of Defective Patterns',
    19: 'Empathy of Subtle Feelings',
    20: 'Now and Here: Absolute Presence',
    21: 'Establishment of Fair Boundary',
    22: 'Graceful Manners & Charm',
    23: 'Mastery of Direct Simplification',
    24: 'Silent Reflection of Inner True Meaning',
    25: 'Pure Energy of Unconditional Love',
    26: 'Business Insight into Human Instinct',
    27: 'Grave Nurturing of Life Force',
    28: 'Adventure of Finding Deep Meaning',
    29: 'Absolute Devotion & Persistence',
    30: 'Emotional Spark of Destiny',
    31: 'Authority of Gentle Persuasion',
    32: 'Continuity of Unshakable Roots',
    33: 'Wisdom of Silent Retreat',
    34: 'Healthy Use of Inner Autonomy',
    35: 'Shattering Trial to Higher Ascension',
    36: 'Holding the Light in Deep Darkness',
    37: 'Warm Responsibility of Family Union',
    38: 'Fierce Fight for True Sovereignty',
    39: 'Trigger of Breakthrough Flow',
    40: 'Liberation from Heavy Burden',
    41: 'Condensation of Starting Energy',
    42: 'Magnificent Finishing of Growth',
    43: 'Instant Insight of Truth',
    44: 'Cellular Memory of Instinctive Survival',
    45: 'Magnetic Attraction of Human Union',
    46: 'Direct Physical Body Integration',
    47: 'Transcendent Transformation of Pain',
    48: 'Wellspring of Unconscious Wisdom',
    49: 'Revolution of Structure Transformation',
    50: 'Spiritual Skeleton of Moral Value',
    51: 'Thunder of Shocking Awakening',
    52: 'Stationary Solidness of Sacred Rock',
    53: 'Step-by-Step Patient Walk',
    54: 'Ambition to Highest Peak',
    55: 'Melody of Emotional Acceptance',
    56: 'Storytelling of Life Journey Traveler',
    57: 'Whisper of Fast Intuitive Wind',
    58: 'Vitality of Exquisite Live Joy',
    59: 'Dissolving Barriers to 친밀감',
    60: 'Acceptance of Limitation as Pivot',
    61: 'Contemplation of Cosmic Principle',
    62: 'Details of Solid Facts',
    63: 'Perfect Closure of 의심',
    64: 'Trusting Potential in Foggy Destiny'
  };
  return englishTitles[gateNum] || 'Cosmic Flow of Awareness';
};

// 상괘/하괘 주역 8상 파싱용 헬퍼 함수
const getTrigramType = (lines: boolean[]): number => {
  let val = 0;
  if (lines[0]) val += 1;
  if (lines[1]) val += 2;
  if (lines[2]) val += 4;
  return val;
};

// 동양풍 타로 선화 만다라 SVG 렌더러 컴포넌트 (초고도화 버전: 주역 8상 대자연 배경 + 저잣거리 사람들)
const OracleCardIllustration = ({ gateNum }: { gateNum: number }) => {
  const circles = (gateNum % 3) + 3; // 3~5개 동심원
  const rays = ((gateNum * 7) % 12) + 12; // 12~23개 광선
  const trigram = getTrigramLines(gateNum);
  
  const lowerTrigram = trigram.slice(0, 3); // 하괘 (1, 2, 3효)
  const upperTrigram = trigram.slice(3, 6); // 상괘 (4, 5, 6효)
  const lowerType = getTrigramType(lowerTrigram);
  const upperType = getTrigramType(upperTrigram);

  // 상괘 자연 배경 렌더링 (하늘 영역, Y: 10 ~ 95)
  const renderUpperNature = (type: number) => {
    switch (type) {
      case 7: // 건(乾) - 하늘: 상서로운 구름들과 신성한 빛내림
        return (
          <g opacity="0.45" stroke="#b89550" strokeWidth="0.5">
            {/* 빛내림 */}
            <line x1="100" y1="10" x2="30" y2="90" strokeDasharray="1 3" />
            <line x1="100" y1="10" x2="65" y2="90" strokeDasharray="1 3" />
            <line x1="100" y1="10" x2="135" y2="90" strokeDasharray="1 3" />
            <line x1="100" y1="10" x2="170" y2="90" strokeDasharray="1 3" />
            {/* 상서로운 구름 */}
            <path d="M35,22 C40,17 50,17 55,22 C60,19 70,19 75,24 C80,22 90,22 95,27" fill="none" strokeLinecap="round" />
            <path d="M105,18 C110,13 120,13 125,18 C130,15 140,15 145,20 C150,18 160,18 165,23" fill="none" strokeLinecap="round" />
          </g>
        );
      case 5: // 리(離) - 불: 이글거리는 태양 불길 아우라와 태양 구체
        return (
          <g opacity="0.45" stroke="#b89550" strokeWidth="0.5">
            <circle cx="100" cy="40" r="10" fill="none" strokeWidth="0.8" />
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 360) / 8;
              return (
                <path 
                  key={i} 
                  d="M100,26 C102,20 98,16 100,12" 
                  transform={`rotate(${angle}, 100, 40)`} 
                  fill="none" 
                  strokeLinecap="round" 
                />
              );
            })}
          </g>
        );
      case 1: // 진(震) - 천둥: 하늘을 가르는 번개 파동선
        return (
          <g opacity="0.5" stroke="#b89550" strokeWidth="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M85,15 L105,35 L95,40 L115,65 L100,70 L110,90" />
            <path d="M125,20 L135,35 L130,38 L142,55" strokeWidth="0.5" />
          </g>
        );
      case 2: // 감(坎) - 물: 비 내리는 먹구름 패턴
        return (
          <g opacity="0.4" stroke="#b89550" strokeWidth="0.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <line 
                key={i} 
                x1={30 + i * 12} 
                y1="15" 
                x2={20 + i * 12} 
                y2="85" 
                strokeDasharray="2 6" 
              />
            ))}
            <path d="M25,20 C30,15 40,15 45,20 C50,17 60,17 65,22 C70,18 85,18 90,25" fill="none" strokeLinecap="round" />
            <path d="M110,25 C115,20 125,20 130,25 C135,22 145,22 150,27 C155,23 170,23 175,30" fill="none" strokeLinecap="round" />
          </g>
        );
      case 4: // 손(巽) - 바람: 흩날리는 소용돌이 기류선
        return (
          <g opacity="0.4" stroke="#b89550" strokeWidth="0.6" fill="none" strokeLinecap="round">
            <path d="M25,20 C50,10 80,35 110,15 C130,5 160,20 175,10" />
            <path d="M30,35 C60,25 90,50 120,30 C140,20 165,35 180,25" strokeWidth="0.4" />
          </g>
        );
      case 3: // 태(兌) - 연못(하늘): 은은한 밤하늘 보름달과 별무리
        return (
          <g opacity="0.45">
            <circle cx="150" cy="35" r="8" stroke="#b89550" strokeWidth="0.6" fill="none" />
            {[
              {x: 40, y: 20}, {x: 55, y: 25}, {x: 70, y: 15}, 
              {x: 85, y: 30}, {x: 100, y: 20}, {x: 115, y: 35}, 
              {x: 130, y: 25}, {x: 45, y: 40}
            ].map((pt, i) => (
              <circle key={i} cx={pt.x} cy={pt.y} r="0.8" fill="#b89550" />
            ))}
          </g>
        );
      case 6: // 간(艮) - 산(하늘): 높고 거대한 먼산 능선
        return (
          <g opacity="0.35" stroke="#b89550" strokeWidth="0.5" fill="none" strokeLinecap="round">
            <path d="M15,65 L45,30 L75,65 M60,65 L95,20 L130,65 M115,65 L145,35 L175,65" />
          </g>
        );
      case 0: // 곤(坤) - 땅(하늘): 완만하고 부드러운 언덕선
      default:
        return (
          <g opacity="0.35" stroke="#b89550" strokeWidth="0.5" fill="none" strokeLinecap="round">
            <path d="M15,55 C45,45 75,65 105,50 C135,35 165,55 185,45" />
          </g>
        );
    }
  };

  // 하괘 자연 배경 렌더링 (땅/수면 영역, Y: 105 ~ 180)
  const renderLowerNature = (type: number) => {
    switch (type) {
      case 0: // 곤(坤) - 땅: 평평한 지평선과 돌밭, 잔디 펜선들
        return (
          <g opacity="0.5" stroke="#b89550" strokeWidth="0.5" fill="none" strokeLinecap="round">
            <line x1="15" y1="165" x2="185" y2="165" strokeWidth="0.7" />
            <line x1="20" y1="169" x2="70" y2="169" strokeDasharray="1 3" />
            <line x1="130" y1="169" x2="180" y2="169" strokeDasharray="1 3" />
            <path d="M25,165 L27,159 M28,165 L31,158 M65,165 L64,160 M135,165 L137,159 M142,165 L140,157" />
          </g>
        );
      case 2: // 감(坎) - 물: 수면 위로 굽이치는 파도와 물살
      case 3: // 태(兌) - 연못: 잔잔한 동심원 수면파와 수줍은 연꽃
        return (
          <g opacity="0.5" stroke="#b89550" strokeWidth="0.6" fill="none" strokeLinecap="round">
            <path d="M15,160 C35,157 55,163 75,160 C95,157 115,163 135,160 C155,157 175,163 185,160" />
            <path d="M20,166 C40,164 60,168 80,166 C100,164 120,168 140,166 C160,164 175,168 180,166" strokeWidth="0.4" />
            {type === 3 && (
              <>
                <ellipse cx="100" cy="167" rx="35" ry="4" strokeDasharray="3 3" />
                <ellipse cx="100" cy="172" rx="20" ry="2.5" strokeDasharray="2 2" />
                <path d="M96,165 C96,160 99,157 100,157 C101,157 104,160 104,165 Z" fill="none" strokeWidth="0.8" />
              </>
            )}
          </g>
        );
      case 6: // 간(艮) - 산: 뾰족하고 거대한 산맥 능선과 빗금 해칭
        return (
          <g opacity="0.5" stroke="#b89550" strokeWidth="0.6" fill="none" strokeLinecap="round">
            <path d="M15,168 L40,140 L70,168 L105,130 L135,168 L160,145 L185,168" strokeWidth="0.8" />
            <path d="M30,168 L50,150 L65,168 M90,168 L115,142 L130,168" strokeWidth="0.4" strokeDasharray="1 1" />
          </g>
        );
      case 1: // 진(震) - 천둥(하단): 번개의 흔적이 남은 갈라진 대지
        return (
          <g opacity="0.45" stroke="#b89550" strokeWidth="0.5" fill="none" strokeLinecap="round">
            <line x1="15" y1="165" x2="185" y2="165" strokeWidth="0.7" />
            <path d="M50,165 L53,172 L48,177 L52,182" />
            <path d="M130,165 L128,170 L133,176 L129,181" />
          </g>
        );
      case 4: // 손(巽) - 바람(하단): 강하게 휘날리는 바닥 풀숲
        return (
          <g opacity="0.45" stroke="#b89550" strokeWidth="0.5" fill="none" strokeLinecap="round">
            <line x1="15" y1="165" x2="185" y2="165" strokeWidth="0.7" />
            <path d="M30,165 Q38,153 45,155 M35,165 Q45,150 52,154 M80,165 Q86,155 93,157 M145,165 Q153,152 161,154" />
          </g>
        );
      case 5: // 리(離) - 불: 타오르는 모닥불/봉화
        return (
          <g opacity="0.5" stroke="#b89550" strokeWidth="0.6" fill="none" strokeLinecap="round">
            <line x1="15" y1="165" x2="185" y2="165" strokeWidth="0.7" />
            <line x1="92" y1="165" x2="108" y2="159" strokeWidth="1" />
            <line x1="108" y1="165" x2="92" y2="159" strokeWidth="1" />
            <path d="M96,159 C93,150 97,140 100,132 C103,140 107,150 104,159" strokeWidth="0.8" />
          </g>
        );
      case 7: // 건(乾) - 하늘(하단): 바닥에 구름 안개가 자욱이 낀 모습
      default:
        return (
          <g opacity="0.4" stroke="#b89550" strokeWidth="0.5" fill="none" strokeLinecap="round">
            <line x1="15" y1="165" x2="185" y2="165" strokeWidth="0.7" />
            <path d="M20,161 C35,157 45,165 60,161 C75,157 85,165 100,161 C115,157 125,165 140,161" />
          </g>
        );
    }
  };

  return (
    <svg className="w-full h-44 md:h-48" viewBox="0 0 200 200" fill="none">
      {/* 앤티크 배경 */}
      <rect width="200" height="200" fill="transparent" />
      
      {/* 아스트랄 격자 차트 선 */}
      <circle cx="100" cy="100" r="92" stroke="#b89550" strokeWidth="0.4" strokeDasharray="3 4" opacity="0.3" />
      <circle cx="100" cy="100" r="82" stroke="#b89550" strokeWidth="0.7" opacity="0.4" />
      <circle cx="100" cy="100" r="70" stroke="#b89550" strokeWidth="0.4" opacity="0.4" />
      
      {/* 장식용 십자 좌표선 */}
      <line x1="8" y1="100" x2="192" y2="100" stroke="#b89550" strokeWidth="0.4" opacity="0.25" />
      <line x1="100" y1="8" x2="100" y2="192" stroke="#b89550" strokeWidth="0.4" opacity="0.25" />
      
      {/* 1. 상괘/하괘 주역 8상 자연배경 합성 */}
      {renderUpperNature(upperType)}
      {renderLowerNature(lowerType)}

      {/* 2. 저잣거리 실루엣 펜화 풍경 추가 (좌측 초가집/기와집 실루엣 + 우측 고목나무 및 바위) */}
      {/* 좌측 초가집 */}
      <g stroke="#5c4a31" strokeWidth="0.6" fill="none" opacity="0.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 15 165 L 15 148 L 40 135 L 55 148 L 55 165 Z" />
        <path d="M 10 148 L 40 132 L 60 148" strokeWidth="1" />
        <line x1="25" y1="165" x2="25" y2="154" />
        <rect x="35" y="148" width="12" height="8" strokeWidth="0.5" />
        {/* 지붕 결 해칭선 */}
        <line x1="20" y1="145" x2="25" y2="140" />
        <line x1="30" y1="142" x2="35" y2="137" />
        <line x1="40" y1="142" x2="45" y2="137" />
      </g>
      {/* 우측 고목 나무 */}
      <g stroke="#5c4a31" strokeWidth="0.6" fill="none" opacity="0.4" strokeLinecap="round">
        <path d="M 185 165 L 180 135 C 176 128 170 125 167 127 C 164 130 162 138 160 165" strokeWidth="1" />
        <path d="M 178 138 C 174 130 160 128 152 134 M 176 132 C 182 120 190 123 186 118" />
        <circle cx="152" cy="134" r="3" strokeWidth="0.3" strokeDasharray="1 1" />
        <circle cx="186" cy="118" r="4.5" strokeWidth="0.3" strokeDasharray="1 1" />
      </g>
      {/* 저잣거리 구경꾼 실루엣 */}
      <g fill="#5c4a31" opacity="0.4">
        {/* 구경꾼 1 */}
        <path d="M 40 165 L 40 155 C 40 152 44 152 44 155 L 44 165 Z" />
        <circle cx="42" cy="151.5" r="2" />
        {/* 구경꾼 2 */}
        <path d="M 148 165 L 148 157 C 148 154 152 154 152 157 L 152 165 Z" />
        <circle cx="150" cy="153.5" r="2" />
      </g>

      {/* 주역 괘상 (상단에 렌더링) */}
      <g transform="translate(76, 22) scale(0.8)">
        {trigram.map((isYang, idx) => (
          <g key={idx} transform={`translate(0, ${idx * 4.5})`}>
            {isYang ? (
              <line x1="0" y1="0" x2="60" y2="0" stroke="#8c6c39" strokeWidth="2.2" strokeLinecap="round" />
            ) : (
              <>
                <line x1="0" y1="0" x2="26" y2="0" stroke="#8c6c39" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="34" y1="0" x2="60" y2="0" stroke="#8c6c39" strokeWidth="2.2" strokeLinecap="round" />
              </>
            )}
          </g>
        ))}
      </g>

      {/* 겹겹이 쳐진 거룩한 광배(동심원 후광 - 사용자 첨부 이미지 핵심 디자인) */}
      {Array.from({ length: circles }).map((_, i) => (
        <circle 
          key={i} 
          cx="100" 
          cy="105" 
          r={28 + i * 12} 
          stroke="#b89550" 
          strokeWidth="0.8" 
          opacity={0.8 - (i * 0.12)} 
        />
      ))}

      {/* 만다라 광선 */}
      <g transform="translate(100, 105)">
        {Array.from({ length: rays }).map((_, i) => {
          const angle = (i * 360) / rays;
          return (
            <line
              key={i}
              x1="0"
              y1="0"
              x2="0"
              y2={-32 - (gateNum % 4) * 4}
              stroke="#b89550"
              strokeWidth="0.5"
              opacity="0.25"
              transform={`rotate(${angle})`}
            />
          );
        })}
      </g>

      {/* 소를 탄 동자 및 명상 성자 라인 아트 (심우도 기반 동양적 깨달음 일러스트) */}
      <g transform="translate(100, 118) scale(0.8)">
        {/* 소의 외곽 형태 */}
        <path 
          d="M-36,12 C-26,7 -12,2 5,2 C22,2 38,7 44,18 C50,28 38,38 28,38 C18,38 8,33 -2,33 C-12,33 -24,28 -30,15 M-36,12 C-40,15 -42,22 -36,25" 
          stroke="#423420" 
          strokeWidth="1.3" 
          fill="none" 
          strokeLinecap="round"
        />
        {/* 소의 뿔 */}
        <path d="M42,12 C46,9 52,7 54,12 C52,15 46,17 42,12 Z" stroke="#423420" strokeWidth="1.1" fill="none" />
        <path d="M38,7 C36,-1 30,-3 32,7" stroke="#423420" strokeWidth="0.9" fill="none" />
        {/* 다리 심볼 */}
        <line x1="-25" y1="28" x2="-22" y2="44" stroke="#423420" strokeWidth="1.2" />
        <line x1="-12" y1="28" x2="-15" y2="42" stroke="#423420" strokeWidth="1" />
        <line x1="20" y1="35" x2="22" y2="48" stroke="#423420" strokeWidth="1.2" />
        <line x1="28" y1="32" x2="31" y2="45" stroke="#423420" strokeWidth="1" />
        
        {/* 위에 타고 있는 명상 동자 */}
        <circle cx="10" cy="-14" r="7.5" stroke="#322616" strokeWidth="1.4" fill="#faf8f2" />
        <path d="M10,-6 C1,-6 -2,12 10,12 C22,12 19,-6 10,-6 Z" stroke="#322616" strokeWidth="1.4" fill="#faf8f2" />
        {/* 명상 중인 손 합장 */}
        <path d="M10,-1 C8,2 12,2 10,-1" stroke="#322616" strokeWidth="1" />
        {/* 동자 개별 후광 */}
        <circle cx="10" cy="-14" r="14" stroke="#b89550" strokeWidth="0.8" strokeDasharray="2 2" />
      </g>
      
      {/* 앤티크 기하학 코너 & 테두리 눈동자 장식 */}
      <g transform="translate(28, 105) scale(0.6)">
        <path d="M-15,0 C-7,-7 7,-7 15,0 C7,7 -7,7 -15,0 Z" stroke="#b89550" strokeWidth="0.9" />
        <circle cx="0" cy="0" r="3.5" stroke="#b89550" strokeWidth="0.9" fill="#b89550" />
      </g>
      <g transform="translate(172, 105) scale(0.6)">
        <path d="M-15,0 C-7,-7 7,-7 15,0 C7,7 -7,7 -15,0 Z" stroke="#b89550" strokeWidth="0.9" />
        <circle cx="0" cy="0" r="3.5" stroke="#b89550" strokeWidth="0.9" fill="#b89550" />
      </g>
      
      {/* 상단 천장 장식 왕관선 */}
      <path d="M82,53 C90,56 110,56 118,53" stroke="#b89550" strokeWidth="0.6" />
      <circle cx="100" cy="54" r="2" fill="#b89550" />
    </svg>
  );
};

export default function MyeongsimOracleCardModal({
  isOpen,
  onClose,
  userName = '명심가',
  sajuText = '분석 중',
  gongWang = []
}: MyeongsimOracleCardModalProps) {
  const [step, setStep] = useState<'intro' | 'drawing' | 'pulled'>('intro');
  const [shuffling, setShuffling] = useState(false);
  const [selectedGate, setSelectedGate] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // 3D 카드 효과용 마우스 좌표 각도
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  const captureRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    // 부드러운 각도 보정
    setTiltX(-y / 10);
    setTiltY(x / 10);
  };

  const handleMouseLeave = () => {
    setTiltX(0);
    setTiltY(0);
  };

  // 셔플 & 카드 배치 연출
  const startDrawing = () => {
    setStep('drawing');
    setShuffling(true);
    // 카드 날리는 신비로운 사운드 대신 테크니컬 피드백 효과 연출
    setTimeout(() => {
      setShuffling(false);
    }, 2200); // 셔플링 연출 길이를 조금 더 화려하게 유지
  };

  const pullCard = (gateNum: number) => {
    setSelectedGate(gateNum);
    setStep('pulled');
    setIsFlipped(false);
    setAiAdvice('');
  };

  const flipCard = () => {
    if (isFlipped) return;
    setIsFlipped(true);

    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#b89550', '#8b5cf6', '#f472b6']
    });
  };

  const getAiAdvice = async () => {
    if (!selectedGate) return;
    setLoadingAi(true);
    try {
      const gateMeta = GATES_MAP[selectedGate];
      const localAdvice = MYEONGSIM_ORACLE_DATA[selectedGate];

      const res = await fetch('/api/coaching/myeongsim-oracle/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          sajuText,
          gongWang,
          gate: selectedGate,
          gateName: gateMeta.name,
          gateKeyword: gateMeta.keyword,
          darkAdvice: localAdvice?.darkAdvice || '',
          neuralAdvice: localAdvice?.neuralAdvice || ''
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiAdvice(data.interpretation);

        // 📚 [개인 영혼 보관함] 생성된 오라클 카드 해설 자동 저장
        try {
          const archiveKey = 'myeongsim_soul_archive';
          const existingArchive = JSON.parse(localStorage.getItem(archiveKey) || '[]');
          const newEntry = {
            id: Date.now().toString(),
            title: `오늘의 명심 카드: ${selectedGate}번. ${gateMeta.name}`,
            content: data.interpretation,
            createdAt: new Date().toISOString().slice(0, 10),
            category: '오늘의 오라클 카드'
          };
          const updatedArchive = [newEntry, ...existingArchive.filter((item: any) => item.title !== newEntry.title)];
          localStorage.setItem(archiveKey, JSON.stringify(updatedArchive));
        } catch (e) {
          console.error("Soul Archive Save Error:", e);
        }
      } else {
        setAiAdvice('오늘의 행성 에너지가 얽혀 해석을 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } catch (err) {
      console.error(err);
      setAiAdvice('우주 서버와의 동기화에 실패했습니다. 네트워크 상태를 확인해 주세요.');
    } finally {
      setLoadingAi(false);
    }
  };

  const downloadCardImage = async () => {
    if (!captureRef.current) return;
    setIsCapturing(true);
    try {
      // 1. html2canvas 안정 옵션으로 카드 영역 캡처
      const canvas = await html2canvas(captureRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#f5ebd6',
        scale: 2,
        logging: false,
        imageTimeout: 15000,
        ignoreElements: (element) => element.classList.contains('no-capture')
      });

      const dataUrl = canvas.toDataURL('image/png');

      // 2. 모바일 브라우저 Web Share API 지원 시 이미지 직통 공유
      if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        try {
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], `Myeongsim_Oracle_${selectedGate}.png`, { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: '명심 오라클 카드',
              text: '나의 명심 오라클 카드 인스타그램 스토리'
            });
            setIsCapturing(false);
            return;
          }
        } catch (shareErr) {
          console.warn('Share API Fallback:', shareErr);
        }
      }

      // 3. 데스크톱 및 일반 스마트폰 브라우저 이미지 자동 다운로드
      const link = document.createElement('a');
      link.download = `Myeongsim_Oracle_${userName}_Card_${selectedGate}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Capture Error:', err);
      // 4. 모바일 팝업 에러 방지용 가이드 안내 (유용 UX)
      alert('✨ 인스타 스토리 카드 캡처가 완료되었습니다! 카드를 꾹 눌러 저장하거나 스크린샷으로 공유해 보세요.');
    } finally {
      setIsCapturing(false);
    }
  };

  const resetOracle = () => {
    setStep('intro');
    setSelectedGate(null);
    setIsFlipped(false);
    setAiAdvice('');
  };

  if (!isOpen) return null;

  const currentGateData = selectedGate ? GATES_MAP[selectedGate] : null;
  const currentAdvice = selectedGate ? MYEONGSIM_ORACLE_DATA[selectedGate] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      {/* 앤티크 타로 전용 성운 및 고풍스러운 격자 조명 배경 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute w-[700px] h-[700px] rounded-full blur-[140px] opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(184, 149, 80, 0.3) 0%, rgba(139, 92, 246, 0.05) 75%)',
            top: '5%',
            left: '15%',
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(244, 239, 226, 0.25) 0%, rgba(0, 0, 0, 0) 80%)',
            bottom: '5%',
            right: '10%',
          }}
        />
      </div>

      <div className="relative w-full max-w-lg bg-[#0d0a15]/95 border border-[#b89550]/20 rounded-3xl shadow-[0_0_50px_rgba(184,149,80,0.15)] p-6 md:p-8 z-10 my-8 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between border-b border-[#b89550]/15 pb-4 mb-4 z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-[#b89550] bg-clip-text text-transparent">
              오늘의 명심 오라클 카드
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full bg-purple-950/20 border border-[#b89550]/20 text-purple-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 메인 뷰포트 (스크롤 지원) */}
        <div className="flex-1 overflow-y-auto pr-1 min-h-0 z-10 scrollbar-thin scrollbar-thumb-[#b89550]/20 scrollbar-track-transparent">
          <AnimatePresence mode="wait">
            
            {/* Step 1: 인트로 */}
            {step === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col items-center text-center py-8"
              >
                <div className="relative w-28 h-28 mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-[#1b152e] to-[#0a0518] border-2 border-[#b89550]/30 shadow-[0_0_20px_rgba(184,149,80,0.1)]">
                  <Compass className="w-14 h-14 text-amber-500/90 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-amber-100 mb-2">
                  오늘 하루를 일깨워 줄 자각의 힌트
                </h3>
                <p className="text-xs md:text-sm text-purple-200/80 max-w-sm mb-8 leading-relaxed">
                  매일 아침 우주의 리듬과 {userName}님의 고유한 기질 주파수가 공명하는 명심 괘 하나를 선정합니다. 차분히 숨을 고르고, 당신의 마음을 인도할 오라클을 뽑아보세요.
                </p>
                <button
                  onClick={startDrawing}
                  className="px-8 py-3.5 rounded-full font-bold text-white shadow-xl shadow-amber-900/20 bg-gradient-to-r from-amber-500 via-[#b89550] to-yellow-600 hover:opacity-95 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4.5 h-4.5 text-white" /> 오라클 카드 드로잉
                </button>
              </motion.div>
            )}

            {/* Step 2: 3D 동적 카오틱 셔플 및 펼침 애니메이션 */}
            {step === 'drawing' && (
              <motion.div
                key="drawing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-6 min-h-[350px]"
              >
                <h3 className="text-sm font-semibold text-amber-200/80 mb-6 text-center animate-pulse tracking-widest">
                  {shuffling ? '🔮 마법 같은 3D 우주 궤도 셔플링...' : '✨ 당신의 운명을 비출 괘 카드를 터치하세요'}
                </h3>

                {/* 3D 카오틱 셔플 궤적 컨테이너 */}
                <div className="relative w-full h-[240px] flex items-center justify-center overflow-hidden">
                  {Array.from({ length: 9 }).map((_, idx) => {
                    const offsetAngle = (idx - 4) * 8; // 입체 원호 스프레드를 위한 미세 회전
                    const randGate = ((idx * 9 + 17) % 64) + 1; // 무작위 카드 매핑
                    
                    return (
                      <motion.div
                        key={idx}
                        className="absolute w-[100px] h-[155px] rounded-xl border border-[#b89550]/40 bg-gradient-to-br from-indigo-950 to-slate-900 shadow-2xl cursor-pointer flex flex-col items-center justify-center origin-bottom select-none transition-shadow"
                        style={{
                          bottom: 12,
                          transformStyle: 'preserve-3d',
                          background: 'linear-gradient(135deg, #1b163a, #0b0717)'
                        }}
                        animate={shuffling ? {
                          // 입체 나선형 회오리 셔플링 (Helix Whirl Shuffle)
                          x: [
                            0, 
                            Math.sin(idx * 1.5) * 85, 
                            -Math.sin(idx * 1.5) * 85, 
                            Math.cos(idx * 1.5) * 60,
                            0
                          ],
                          y: [0, -70, -15, -45, 0],
                          z: [0, 40 + idx * 10, -50 - idx * 5, 20, 0],
                          rotate: [0, 360, -360, 180, 0],
                          rotateY: [0, 180, 360, 0, 0],
                          scale: [1, 1.2, 0.8, 1.1, 1]
                        } : {
                          // 3D 실린더 아치 배치 (Cylindrical Arch Spread)
                          x: (idx - 4) * 26,
                          y: Math.abs(idx - 4) * 5,
                          z: -Math.abs(idx - 4) * 15,
                          rotate: offsetAngle,
                          rotateY: (idx - 4) * 12,
                          scale: 1
                        }}
                        transition={{
                          duration: shuffling ? 2.5 : 0.7,
                          ease: shuffling ? 'easeInOut' : 'easeOut',
                        }}
                        whileHover={!shuffling ? {
                          y: -24,
                          z: 40,
                          scale: 1.16,
                          borderColor: '#fbbf24',
                          boxShadow: '0 0 25px rgba(245, 158, 11, 0.65)',
                          zIndex: 50,
                          transition: { duration: 0.25 }
                        } : {}}
                        onClick={() => {
                          if (!shuffling) pullCard(randGate);
                        }}
                      >
                        {/* 앤티크 카드 뒷면 디자인 */}
                        <div className="w-[88%] h-[92%] border border-[#b89550]/20 rounded-lg flex flex-col items-center justify-between bg-[#080410] p-2">
                          <div className="w-full flex justify-between text-[6px] text-[#b89550]/40 font-mono">
                            <span>XII</span>
                            <span>AWARENESS</span>
                          </div>
                          
                          <div className="relative w-8 h-8 rounded-full border border-[#b89550]/30 flex items-center justify-center">
                            <Compass className="w-4 h-4 text-[#b89550]/70 animate-spin" style={{ animationDuration: '10s' }} />
                          </div>

                          <div className="text-[5px] text-[#b89550]/40 tracking-widest font-mono">
                            MYEONGSIM ORACLE
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {!shuffling && (
                  <button
                    onClick={() => setShuffling(true)}
                    className="mt-6 px-4 py-2 rounded-full border border-[#b89550]/30 text-[#b89550] text-xs hover:text-white bg-purple-950/15 transition-all flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3" /> 다시 뒤섞기
                  </button>
                )}
              </motion.div>
            )}

            {/* Step 3: 프리미엄 앤티크 카드 디자인 렌더링 */}
            {step === 'pulled' && selectedGate && currentGateData && currentAdvice && (
              <motion.div
                key="pulled"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-2"
              >
                {/* 3D 자이로 반응형 플립 카드 컨테이너 */}
                <div 
                  style={{ perspective: '1200px' }}
                  className="w-[245px] h-[375px] cursor-pointer relative mb-6 select-none"
                  onClick={flipCard}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <motion.div
                    className="w-full h-full relative"
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{ 
                      rotateX: !isFlipped ? tiltX : -tiltX,
                      rotateY: isFlipped ? 180 + tiltY : tiltY
                    }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                  >
                    {/* 카드 뒷면 (앤티크 럭셔리 골드 장식) */}
                    <div 
                      className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-[#120e24] via-[#090514] to-[#04010a] border-[3px] border-[#b89550] flex flex-col items-center justify-center p-4 shadow-2xl"
                      style={{ backfaceVisibility: 'hidden', zIndex: isFlipped ? 0 : 2 }}
                    >
                      <div className="w-full h-full border border-[#b89550]/30 rounded-xl flex flex-col items-center justify-between bg-[#080410] p-4 relative">
                        {/* 클래식 문양 모서리 데코 */}
                        <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#b89550]/40" />
                        <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[#b89550]/40" />
                        <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[#b89550]/40" />
                        <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#b89550]/40" />
                        
                        <div className="text-[8px] text-[#b89550]/50 tracking-[0.3em] font-mono uppercase mt-2">
                          Myeongsim Oracle
                        </div>

                        <div className="flex flex-col items-center gap-2.5">
                          <Compass className="w-12 h-12 text-[#b89550]/75 animate-pulse" />
                          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#b89550]/50 to-transparent" />
                        </div>

                        <span className="text-[10px] text-amber-200/80 mb-2 font-medium animate-pulse">카드를 터치하여 해독</span>
                      </div>
                    </div>

                    {/* 카드 앞면 (세계 최고 심리학 디자이너가 스케치한 스위스 럭셔리 앤티크 크림 골드 디자인) */}
                    <div 
                      className="absolute inset-0 w-full h-full rounded-2xl bg-[#faf8f2] border-[3px] border-[#b89550] flex flex-col justify-between p-3.5 shadow-2xl text-[#322616]"
                      style={{ 
                        backfaceVisibility: 'hidden', 
                        transform: 'rotateY(180deg)',
                        zIndex: isFlipped ? 2 : 0,
                        transformStyle: 'preserve-3d',
                        boxShadow: 'inset 0 0 20px rgba(184, 149, 80, 0.2), 0 20px 45px rgba(0,0,0,0.5)'
                      }}
                    >
                      <div 
                        className="w-full h-full border border-[#b89550]/40 rounded-xl p-3 flex flex-col justify-between relative bg-gradient-to-b from-[#faf8f2] via-[#f4efe2] to-[#f4efe2]"
                        style={{ transform: 'translateZ(15px)', transformStyle: 'preserve-3d' }}
                      >
                        {/* 앤티크 명품 금박 코너 데코 */}
                        <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#b89550]" />
                        <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#b89550]" />
                        <div className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#b89550]" />
                        <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#b89550]" />

                        {/* 좌우 프레임: 심리학 황금비 매듭 문양 */}
                        <div className="absolute left-1.5 top-8 bottom-8 flex flex-col justify-between items-center text-[#b89550] opacity-80 text-[8px]" style={{ transform: 'translateZ(10px)' }}>
                          <span>✦</span>
                          <span>❖</span>
                          <span>✦</span>
                          <span>❖</span>
                          <span>✦</span>
                        </div>
                        <div className="absolute right-1.5 top-8 bottom-8 flex flex-col justify-between items-center text-[#b89550] opacity-80 text-[8px]" style={{ transform: 'translateZ(10px)' }}>
                          <span>✦</span>
                          <span>❖</span>
                          <span>✦</span>
                          <span>❖</span>
                          <span>✦</span>
                        </div>

                        {/* 상단: 로마 숫자 & 스위스 명품 세리프 타이포그래피 */}
                        <div className="flex flex-col items-center text-center" style={{ transform: 'translateZ(30px)' }}>
                          <div className="text-[9px] text-[#b89550] tracking-[0.3em] font-serif uppercase mb-0.5">
                            SWISS PSYCHOLOGY EMBLEM
                          </div>
                          <span className="text-xs font-mono font-black tracking-widest text-[#8c6c39] leading-none mb-1">
                            {toRoman(selectedGate)}
                          </span>
                          <h3 className="text-xs md:text-sm font-black tracking-wider text-[#261c0e] uppercase leading-tight font-serif px-1 truncate w-full">
                            {GET_ENGLISH_SUBTITLE(selectedGate)}
                          </h3>
                          <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#b89550] to-transparent mt-1.5" />
                        </div>

                        {/* 중앙: 심리학적 신성 기하학 수제 에칭 만다라 일러스트 */}
                        <div className="my-auto overflow-hidden py-1" style={{ transform: 'translateZ(45px)' }}>
                          <OracleCardIllustration gateNum={selectedGate} />
                        </div>

                        {/* 하단: 한글 명심 괘 및 심리 치유 키워드 */}
                        <div className="flex flex-col items-center text-center mt-1" style={{ transform: 'translateZ(25px)' }}>
                          <h4 className="text-xs font-black text-[#261c0e] tracking-widest bg-[#b89550]/15 px-3 py-1 rounded-full border border-[#b89550]/30 shadow-sm font-serif">
                            {selectedGate}번. {currentGateData.name}
                          </h4>
                          <p className="text-[8.5px] md:text-[9.5px] text-[#4a3922] mt-1.5 max-w-[190px] font-semibold leading-relaxed">
                            {currentGateData.keyword}
                          </p>
                          <div className="text-[9px] text-[#b89550] tracking-widest leading-none mt-2 opacity-90">
                            ❖ ────── ❖
                          </div>
                          <span className="text-[6.5px] text-[#8c6c39] font-mono tracking-[0.2em] mt-1 uppercase font-bold block">
                            MYEONGSIM PSYCHOLOGICAL ORACLE
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* 캡처 다운로드용 인스타 9:16 거대 고해상도 타로 레이아웃 */}
                <div className="absolute pointer-events-none" style={{ left: '-9999px', top: '-9999px' }}>
                  <div 
                    ref={captureRef}
                    className="w-[1080px] h-[1920px] bg-[#f4efe2] flex flex-col justify-between p-24 text-[#3a2f20] relative font-serif"
                    style={{
                      background: 'radial-gradient(circle at center, #faf8f2 0%, #f4efe2 100%)',
                    }}
                  >
                    {/* 상단 앤티크 헤더 */}
                    <div className="flex flex-col items-center text-center mt-12">
                      <span className="text-2xl tracking-[0.4em] text-[#8c6c39] font-bold uppercase mb-4">MYEONGSIM ORACLE</span>
                      <div className="w-48 h-[2px] bg-[#b89550]/70" />
                      <span className="text-3xl text-[#5c4a31] mt-6 font-light">{userName}님을 위한 자각 오라클 카드</span>
                    </div>

                    {/* 중앙 타로 카드 본체 */}
                    <div className="w-[660px] h-[1000px] self-center rounded-[36px] bg-[#faf8f2] border-[8px] border-[#b89550] p-7 shadow-2xl flex flex-col justify-between relative">
                      <div className="w-full h-full border-2 border-[#b89550]/40 rounded-[28px] p-8 flex flex-col justify-between relative bg-[#faf8f2]">
                        <div className="absolute top-2 left-2 w-5 h-5 border-t border-l border-[#b89550]" />
                        <div className="absolute top-2 right-2 w-5 h-5 border-t border-r border-[#b89550]" />
                        <div className="absolute bottom-2 left-2 w-5 h-5 border-b border-l border-[#b89550]" />
                        <div className="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-[#b89550]" />

                        <div className="flex flex-col items-center text-center">
                          <span className="text-3xl font-mono font-bold tracking-widest text-[#8c6c39] mb-2">{toRoman(selectedGate)}</span>
                          <h3 className="text-2xl font-black text-[#322616] uppercase tracking-wider">{GET_ENGLISH_SUBTITLE(selectedGate)}</h3>
                          <div className="w-32 h-[1px] bg-[#b89550]/50 mt-3" />
                        </div>

                        <div className="my-auto scale-110">
                          <OracleCardIllustration gateNum={selectedGate} />
                        </div>

                        <div className="flex flex-col items-center text-center">
                          <h4 className="text-2xl font-black text-[#3a2f20] bg-[#b89550]/15 px-6 py-1.5 rounded-full border border-[#b89550]/30 tracking-widest">
                            🔑 {selectedGate}번. {currentGateData.name}
                          </h4>
                          <p className="text-lg text-[#5c4a31] mt-4 max-w-[420px] font-medium leading-relaxed">
                            {currentGateData.keyword}
                          </p>
                          <div className="w-20 h-[1px] bg-[#b89550]/30 mt-4" />
                          <span className="text-xs text-[#b89550]/60 font-mono tracking-widest mt-2 block">
                            MYEONGSIM COACHING
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 하단 일기장식 자각 가이드 */}
                    <div className="flex flex-col items-center mb-12 text-center max-w-[800px] self-center">
                      <div className="bg-[#fcfbf7] border border-[#b89550]/30 rounded-[28px] p-8.5 shadow-md w-full">
                        <h5 className="text-xl font-bold text-[#8c6c39] mb-3.5">🧘 오늘의 실천 지침 (뉴럴코드)</h5>
                        <p className="text-lg text-[#3a2f20] leading-relaxed font-sans font-medium">
                          "{currentAdvice.neuralAdvice}"
                        </p>
                      </div>
                      <span className="text-md text-[#8c6c39]/80 mt-8 font-sans">나만의 명심 주역의식지도 리포트에서 본질의 천명을 발견하세요.</span>
                    </div>
                  </div>
                </div>

                {/* 해독 후 풀이 정보 렌더링 */}
                <AnimatePresence>
                  {isFlipped ? (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full flex flex-col gap-5 text-left"
                    >
                      <div className="bg-purple-950/20 border border-purple-500/10 rounded-2xl p-4 flex flex-col gap-3 shadow-inner">
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-pink-900/50 border border-pink-500/30 text-pink-300 mb-1">
                            🔴 오늘 경계할 다크코드 (에고 에러)
                          </span>
                          <p className="text-xs text-purple-200 leading-relaxed font-light">
                            {currentAdvice.darkAdvice}
                          </p>
                        </div>

                        <div className="border-t border-purple-500/10 pt-3">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-900/50 border border-amber-500/30 text-amber-300 mb-1">
                            🔵 오늘의 실천 지침 (뉴럴코드)
                          </span>
                          <p className="text-xs text-amber-100 leading-relaxed font-semibold">
                            {currentAdvice.neuralAdvice}
                          </p>
                        </div>
                      </div>

                      {/* 추가 기능: 명심 AI 코치 조언 및 다운로드 버튼 */}
                      <div className="flex gap-2">
                        <button
                          onClick={downloadCardImage}
                          disabled={isCapturing}
                          className="flex-1 py-2.5 rounded-xl border border-[#b89550]/30 text-xs font-semibold text-[#b89550] hover:text-white hover:bg-amber-950/15 transition-all flex items-center justify-center gap-1"
                        >
                          {isCapturing ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> 생성 중...
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5" /> 인스타 스토리 다운로드
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setShowPaymentModal(true)}
                          disabled={loadingAi}
                          className="flex-1 py-2.5 rounded-xl font-bold bg-gradient-to-r from-amber-500 via-[#b89550] to-yellow-600 text-xs text-white hover:opacity-90 transition-all flex items-center justify-between px-3 shadow-lg shadow-amber-950/20"
                        >
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI 심층 조언
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="bg-black/30 px-2 py-0.5 rounded-full text-[10px] font-mono text-amber-300">
                              👑 VIP 멤버십 전용 ➔
                            </span>
                          </span>
                        </button>
                      </div>

                      {/* AI 깊은 조언 렌더링 영역 */}
                      {loadingAi && (
                        <div className="flex flex-col items-center justify-center py-8 gap-3 border border-purple-500/10 rounded-2xl bg-purple-950/10">
                          <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
                          <span className="text-xs text-purple-300 animate-pulse">오늘의 하늘 궤도와 사주 조화를 분석하는 중...</span>
                        </div>
                      )}

                      {!loadingAi && aiAdvice && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border border-[#b89550]/15 rounded-2xl bg-purple-950/30 p-4 shadow-inner"
                        >
                          <div className="flex items-center gap-1 mb-2 text-xs font-bold text-amber-400">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>명심 오라클 AI 코치 심층 해설</span>
                          </div>
                          <div 
                            className="text-xs text-purple-200/90 leading-relaxed font-light whitespace-pre-wrap"
                            style={{ wordBreak: 'keep-all' }}
                          >
                            {aiAdvice}
                          </div>
                        </motion.div>
                      )}

                      {/* 다시 뽑기 버튼 */}
                      <button
                        onClick={resetOracle}
                        className="py-2.5 mt-2 rounded-xl border border-purple-500/20 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors flex items-center justify-center gap-1 bg-purple-950/10"
                      >
                        <RefreshCw className="w-3 h-3" /> 다른 오라클 다시 뽑기
                      </button>
                    </motion.div>
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-purple-300/80 animate-pulse mt-2 text-center"
                    >
                      카드를 클릭하여 오늘 하루 당신의 마음을 뒤흔들 코드를 자각해 보세요.
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 모달 하단 푸터 */}
        <div className="border-t border-[#b89550]/15 pt-4 mt-4 flex items-center justify-between text-[10px] text-purple-400/50 z-10 font-mono">
          <span>ID: {userName}</span>
          <span>© MYEONGSIM ORACLE</span>
        </div>
      </div>

      {/* 💳 Toss Payment Modal for Myeongsim Oracle Card */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-950 border border-amber-500/40 rounded-3xl p-4 shadow-2xl space-y-3 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>👑 [특허출원 기념 66% OFF] <span className="line-through text-gray-400">월 289,000원</span> ➔ 월 98,000원 VIP 올패스</span>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <PaymentCard
              onDetailedReport={() => {
                setShowPaymentModal(false);
                getAiAdvice();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
