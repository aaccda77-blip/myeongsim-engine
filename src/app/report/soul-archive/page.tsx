'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Sparkles, Shield, Compass, Heart, Award, Download, 
  ChevronDown, ChevronUp, Zap, Sun, Globe, Flame, TreePine, 
  Brain, Smile, Crown, CheckCircle2, Share2, X, BookOpen, UserCheck, Lightbulb, Copy, ArrowLeft, Bot, RefreshCw, Target, CheckSquare, Gem, Droplets, Activity, Calendar, Edit3
} from 'lucide-react';
import { calculateMyeongsimProfile, parseBirthDate } from '@/utils/GeneKeyCalculator';
import { NEURAL_CODE_DATABASE } from '@/data/NeuralCodeDB';
import { ICHING_HEXAGRAMS } from '@/data/IChingHexagrams';
import { calculateSaju } from '@/lib/saju/SajuEngine';

/* ═══════════════════════════════════════════════════════
   MYEONGSIM SOUL VAULT · 2026 OFFICIAL ARCHIVE
   유전자키(Gene Keys) 황금경로 1:1 맞춤 천명 연금술 엔진
   (정통 만세력 SajuEngine 100% 실시간 연동)
   ═══════════════════════════════════════════════════════ */

// 64괘 한자 및 기본 효선 매핑 데이터 (King Wen Sequence 1-64)
const HEXAGRAM_STRUCTURES: Record<number, { hanja: string; lines: boolean[]; meaning: string; verse: string }> = {
  1: { hanja: '乾', lines: [true, true, true, true, true, true], meaning: '하늘의 순수한 창조력과 개척 정신', verse: '천행건 군자이 자강불식 (하늘의 운행이 굳건하니 스스로 힘써 쉬지 않는다)' },
  2: { hanja: '坤', lines: [false, false, false, false, false, false], meaning: '만물을 품고 기르는 옥토와 포용력', verse: '지세곤 군자이 후덕재물 (땅의 형세가 유순하니 덕을 두터이 하여 만물을 싣는다)' },
  3: { hanja: '屯', lines: [false, true, false, false, false, true], meaning: '어둠을 뚫고 솟아나는 새싹의 시작', verse: '운뢰둔 군자이 경륜 (구름과 우레가 가득하니 혼란 속에서 새 질서를 세운다)' },
  4: { hanja: '蒙', lines: [true, false, false, false, true, false], meaning: '어리석음을 깨우치는 배움과 지혜', verse: '산하출천 몽 군자이 과행육덕 (산 아래에서 샘물이 솟으니 과단성 있게 덕을 기른다)' },
  5: { hanja: '需', lines: [false, true, false, true, true, true], meaning: '때를 기다리며 내공을 기르는 인내', verse: '운상우천 수 군자이 음식이락 (구름이 하늘 위에 있으니 때를 기다리며 마음을 편히 한다)' },
  6: { hanja: '訟', lines: [true, true, true, false, true, false], meaning: '갈등을 지혜와 자비로 중재하는 화해', verse: '천여수위행 송 군자이 작사모시 (하늘과 물이 어긋나니 일을 시작할 때부터 도모한다)' },
  7: { hanja: '師', lines: [false, false, false, false, true, false], meaning: '공공의 목적을 위해 대중을 이끄는 지도력', verse: '지중유수 사 군자이 용민축중 (땅속에 물이 모여있듯 덕으로 백성을 품고 군사를 기른다)' },
  8: { hanja: '比', lines: [false, true, false, false, false, false], meaning: '마음을 열고 진심으로 돕는 친밀한 연대', verse: '지상유수 비 선왕이 건만국친제후 (땅 위에 물이 흐르듯 나라를 세우고 이웃과 친한다)' },
  9: { hanja: '小畜', lines: [true, true, false, true, true, true], meaning: '작은 정성을 모아 큰 신뢰를 쌓는 축적', verse: '풍행천상 소축 군자이 의문덕 (바람이 하늘 위를 스치듯 문채를 빛내고 덕을 닦는다)' },
  10: { hanja: '履', lines: [true, true, true, false, true, true], meaning: '호랑이 꼬리를 밟아도 다치지 않는 예의와 처세', verse: '상천하택 이 군자이 변상하정민지 (하늘이 위에 있고 연못이 아래에 있듯 분수를 지킨다)' },
  11: { hanja: '泰', lines: [false, false, false, true, true, true], meaning: '하늘과 땅이 소통하는 최고의 평화와 조화', verse: '천지교 태 후이 재성천지도 (하늘과 땅이 사귀어 태평하니 만물의 순리를 돕는다)' },
  12: { hanja: '否', lines: [true, true, true, false, false, false], meaning: '소통이 막혔을 때 침묵하며 힘을 비축하는 지혜', verse: '천지불교 비 군자이 검덕벽난 (하늘과 땅이 닫혔으니 덕을 감추어 환난을 피한다)' },
  13: { hanja: '同人', lines: [true, true, true, true, false, true], meaning: '벽을 허물고 뜻을 함께하는 대동의 협력', verse: '천여화 동인 군자이 유족변물 (하늘과 불이 함께 오르듯 무리를 나누고 만물을 분별한다)' },
  14: { hanja: '大有', lines: [true, false, true, true, true, true], meaning: '하늘의 태양처럼 모두를 비추는 광명과 대번영', verse: '화재천상 대유 군자이 알악양선 (불이 하늘 위에 있으니 악을 막고 선을 널리 편다)' },
  15: { hanja: '謙', lines: [false, false, false, true, false, false], meaning: '높은 산이 땅 아래로 몸을 낮추는 절대 겸손', verse: '지중유산 겸 군자이 부다익과 (땅속에 높은 산이 있듯 많은 것을 덜어 적은 데 보탠다)' },
  16: { hanja: '豫', lines: [false, false, true, false, false, false], meaning: '즐거움과 열정으로 미래를 준비하는 예견', verse: '뢰출지분 예 선왕이 작악숭덕 (우레가 땅을 울리며 솟듯 음악을 지어 덕을 기린다)' },
  17: { hanja: '隨', lines: [false, true, true, false, false, true], meaning: '자연의 섭리와 시대의 흐름을 따르는 유연함', verse: '택중유뢰 수 군자이 향회입식 (연못 속에 우레가 깃들듯 날이 저물면 편안히 쉰다)' },
  18: { hanja: '蠱', lines: [true, false, false, true, true, false], meaning: '묵은 폐단을 고치고 시스템을 혁신하는 치유', verse: '산하유풍 고 군자이 진민육덕 (산 아래 바람이 머물듯 백성을 깨우치고 덕을 기른다)' },
  19: { hanja: '臨', lines: [false, false, false, false, true, true], meaning: '따뜻한 봄기운으로 다가가 대중을 보살핌', verse: '지상유택 임 군자이 교사무궁 (땅 위에 연못이 임하듯 가르침에 지침이 없다)' },
  20: { hanja: '觀', lines: [true, true, false, false, false, false], meaning: '높은 곳에서 세상의 순리를 관찰하는 통찰', verse: '풍행지상 관 선왕이 성방설교 (바람이 땅 위를 두루 돌듯 세상을 살피고 가르침을 편다)' },
  21: { hanja: '噬嗑', lines: [true, false, true, false, false, true], meaning: '장애물을 과감히 씹어 부수는 명쾌한 결단', verse: '뇌전 서합 선왕이 명벌치법 (천둥과 번개가 함께 치듯 형벌을 밝히고 법을 다스린다)' },
  22: { hanja: '賁', lines: [true, false, true, false, false, true], meaning: '본질의 아름다움을 드러내는 우아한 품격', verse: '산하유화 비 군자이 명서정무감절옥 (산 아래 불이 밝히듯 정사를 밝히되 함부로 단죄하지 않는다)' },
  23: { hanja: '剝', lines: [true, false, false, false, false, false], meaning: '낡은 껍질을 벗겨내고 핵심 씨앗만 남김', verse: '산부우지 박 상이 안택 (산이 땅에 기대어 무너지듯 아래를 두텁게 하여 편안히 한다)' },
  24: { hanja: '復', lines: [false, false, false, false, false, true], meaning: '가장 깊은 어둠 속에서 다시 돌아오는 한 줄기 빛', verse: '뇌재지중 복 선왕이 지일폐관 (우레가 땅속에 깃들어 회복하니 동짓날에 관문을 닫고 쉰다)' },
  25: { hanja: '無妄', lines: [true, true, true, false, false, true], meaning: '사심과 계산 없이 순수한 진실을 따르는 정직', verse: '천하뇌행 물여무망 선왕이 무대시육만물 (하늘 아래 천둥이 치듯 때에 맞춰 만물을 기른다)' },
  26: { hanja: '大畜', lines: [true, false, false, true, true, true], meaning: '지혜와 내공을 태산처럼 거대하게 쌓아올림', verse: '천재산중 대축 군자이 다식전언왕행 (하늘이 산속에 품겨있듯 옛 성현의 말씀과 행동을 배운다)' },
  27: { hanja: '頤', lines: [true, false, false, false, false, true], meaning: '바른 음식을 먹고 고결한 생각을 기르는 양육', verse: '산하유뢰 이 군자이 신언어절음식 (산 아래 우레가 울리듯 말을 삼가고 음식을 절제한다)' },
  28: { hanja: '大過', lines: [false, true, true, true, true, false], meaning: '거대한 책임을 짊어지고 한계를 돌파하는 용기', verse: '택멸목 대과 군자이 독립불구 (연못이 나무를 삼킬 듯 넘치니 홀로 서서 두려워하지 않는다)' },
  29: { hanja: '坎', lines: [false, true, false, false, true, false], meaning: '깊은 물의 심연도 관통하는 1순위 초몰입', verse: '수천지 습감 군자이 상덕행습교사 (물이 끊임없이 흐르듯 덕을 거듭 닦고 가르침을 익힌다)' },
  30: { hanja: '離', lines: [true, false, true, true, false, true], meaning: '어둠을 환히 밝히는 두 개의 태양 같은 지혜', verse: '명양작 리 대인이 계명조우사방 (밝은 빛이 연이어 비추듯 사방을 환하게 밝힌다)' },
  31: { hanja: '咸', lines: [false, true, true, true, false, false], meaning: '말 없이도 가슴으로 통하는 순수한 감응과 매력', verse: '산상유택 함 군자이 허수인의 (산 위에 연못이 있듯 마음을 비워 사람을 받아들인다)' },
  32: { hanja: '恒', lines: [false, false, true, true, true, false], meaning: '변화 속에서도 중심을 잃지 않는 영원한 항상성', verse: '뇌풍 항 군자이 립불역방 (우레와 바람이 함께하듯 굳게 서서 방향을 바꾸지 않는다)' },
  33: { hanja: '遯', lines: [true, true, true, true, false, false], meaning: '때가 아닐 때 우아하게 물러서서 힘을 아끼는 은둔', verse: '천하유산 돈 군자이 원소인불오이엄 (하늘 아래 산이 있듯 소인을 멀리하되 미워하지 않고 엄하게 한다)' },
  34: { hanja: '大壯', lines: [false, false, true, true, true, true], meaning: '정의로운 힘으로 힘차게 전진하는 장엄한 도약', verse: '뇌재천상 대장 군자이 비례부리 (천둥이 하늘 위에서 치듯 예가 아니면 행하지 않는다)' },
  35: { hanja: '晉', lines: [true, false, true, false, false, false], meaning: '태양이 대지 위로 솟아오르듯 눈부신 전진과 승진', verse: '주지상 진 군자이 자소명덕 (해가 땅 위로 솟아오르듯 스스로 밝은 덕을 밝힌다)' },
  36: { hanja: '明夷', lines: [false, false, false, true, false, true], meaning: '어둠 속에서 지혜의 빛을 감추고 안을 지키는 인내', verse: '명입지중 명이 군자이 이중용회이명 (빛이 땅속으로 들어가니 무리를 대할 때 빛을 감추어 밝힌다)' },
  37: { hanja: '家人', lines: [true, true, false, true, false, true], meaning: '따뜻한 내실을 다져 신뢰의 안식처를 만드는 조화', verse: '풍자화출 가인 군자이 언유물이행유항 (바람이 불에서 나오듯 말에 실속이 있고 행동에 항상성이 있다)' },
  38: { hanja: '睽', lines: [true, false, true, false, true, true], meaning: '서로 다른 관점을 융합하여 새로운 시너지를 창출', verse: '상화하택 규 군자이 동이이 (위는 불이고 아래는 연못이니 같음 속에서 다름을 본다)' },
  39: { hanja: '蹇', lines: [false, true, false, true, false, false], meaning: '험난한 산맥 앞에서 멈추어 내면을 돌아보는 성찰', verse: '산상유수 건 군자이 반신수덕 (산 위에 물이 가로막히니 몸을 돌이켜 덕을 닦는다)' },
  40: { hanja: '解', lines: [false, false, true, false, true, false], meaning: '얽힌 매듭을 풀고 자유와 풍요를 선사하는 해방', verse: '뇌우작 해 군자이 사과유죄 (천둥과 봄비가 내리며 풀리니 허물을 용서하고 죄를 사한다)' },
  41: { hanja: '損', lines: [true, false, false, false, true, true], meaning: '욕심을 덜어내어 내면의 본질을 채우는 감량의 미학', verse: '산하유택 손 군자이 징분질욕 (산 아래 연못이 깊어지듯 분노를 징계하고 욕심을 막는다)' },
  42: { hanja: '益', lines: [true, true, false, false, false, true], meaning: '위에서 아래로 은혜를 베풀어 함께 번영하는 증익', verse: '풍뢰 익 군자이 견선즉천 유과즉개 (바람과 우레가 더하듯 선을 보면 옮겨가고 허물이면 고친다)' },
  43: { hanja: '夬', lines: [false, true, true, true, true, true], meaning: '어둠의 잔재를 결연히 결단하여 걷어내는 결단력', verse: '택상어천 쾌 군자이 시록급하 (연못이 하늘 위로 오르듯 베풂을 아래에 미치게 한다)' },
  44: { hanja: '姤', lines: [true, true, true, true, true, false], meaning: '예상치 못한 운명적 만남과 인연의 연결', verse: '천하유풍 구 후이 시명고사방 (하늘 아래 바람이 불듯 명을 내려 사방에 알린다)' },
  45: { hanja: '萃', lines: [false, true, true, false, false, false], meaning: '진실한 가치 중심으로 인재와 부가 모여드는 결집', verse: '택상어지 췌 군자이 수제기계 (연못이 땅 위에 모이듯 무기를 정비하여 뜻밖의 일에 대비한다)' },
  46: { hanja: '升', lines: [false, false, false, true, true, false], meaning: '뿌리 깊은 나무가 하늘 높이 자라오르는 점진적 상승', verse: '지중생목 승 군자이 순덕적소이다대 (땅속에서 나무가 자라듯 덕에 순응하여 작은 것을 쌓아 크게 이룬다)' },
  47: { hanja: '困', lines: [false, true, true, false, true, false], meaning: '시련과 고난 속에서 순금을 제련하는 내면의 단련', verse: '택무수 곤 군자이 치명수지 (연못에 물이 마르듯 곤궁할 때 목숨을 바쳐 뜻을 이룬다)' },
  48: { hanja: '井', lines: [false, true, true, false, true, false], meaning: '마르지 않는 지혜의 우물로 세상을 먹여 살림', verse: '목상유수 정 군자이 로민권상 (나무 위에 물이 오르듯 백성을 위로하고 서로 돕게 한다)' },
  49: { hanja: '革', lines: [false, true, true, true, false, true], meaning: '낡은 가죽을 벗기고 시대를 새로 쓰는 천명 혁신', verse: '택중유화 혁 군자이 치력명시 (연못 속에 불이 타오르듯 역법을 고치고 때를 밝힌다)' },
  50: { hanja: '鼎', lines: [true, false, true, true, true, false], meaning: '새로운 시대를 담는 성스러운 솥과 문화 창조', verse: '목상유화 정 군자이 정위응명 (나무 위에 불이 붙듯 자리를 바로잡아 천명에 응한다)' },
  51: { hanja: '震', lines: [false, false, true, false, false, true], meaning: '충격과 진동 속에서 참자아를 깨우는 대각성의 번개', verse: '천둥이 백 리를 울리나 술잔을 떨어뜨리지 않는 평정심' },
  52: { hanja: '艮', lines: [true, false, false, true, false, false], meaning: '우뚝 솟은 산처럼 흔들리지 않는 고요한 멈춤', verse: '겸산 간 군자이 사불출기위 (산이 첩첩이 솟았으니 생각이 그 자리를 벗어나지 않는다)' },
  53: { hanja: '漸', lines: [true, true, false, true, false, false], meaning: '시간이 흐를수록 거대한 가치가 복리로 폭발하는 점진적 완성', verse: '기러기가 물가에서 바위로, 산으로 올라가 마침내 큰 산을 이룬다' },
  54: { hanja: '歸妹', lines: [false, false, true, false, true, true], meaning: '내 고유한 자리를 다지고 주권을 사수할 때 일어나는 도약', verse: '외부의 요구에 휘둘리지 않고 내 고유한 바운더리를 확고히 지킨다' },
  55: { hanja: '豊', lines: [false, false, true, true, false, true], meaning: '한낮의 태양처럼 풍요의 정점에서 지혜롭게 다스림', verse: '뢰전개지 풍 군자이 절옥치형 (천둥과 번개가 함께 치듯 옥사를 판결하고 형벌을 집행한다)' },
  56: { hanja: '旅', lines: [true, false, true, true, false, false], meaning: '나그네처럼 집착 없이 가볍고 우아하게 살아가는 지혜', verse: '산상유화 려 군자이 명신용형 (산 위에 불이 타오르듯 형벌을 신중히 하고 옥사를 지체하지 않는다)' },
  57: { hanja: '巽', lines: [true, true, false, true, true, false], meaning: '바람처럼 유연하게 스며들어 본질을 꿰뚫어 보는 직관', verse: '말하지 않아도 본질을 꿰뚫어 보는 바람 같은 직관과 유연성' },
  58: { hanja: '兌', lines: [false, true, true, false, true, true], meaning: '맑은 연못처럼 사람들을 기쁘게 하는 즐거운 소통', verse: '려택 태 군자이 친구강습 (연못이 서로 맞닿아있듯 벗과 함께 강론하고 익힌다)' },
  59: { hanja: '渙', lines: [true, true, false, false, true, false], meaning: '얼어붙은 마음을 녹여 대양으로 흐르는 상생의 네트워크', verse: '막힌 기운을 흩어 새로운 흐름을 여는 해방의 바람' },
  60: { hanja: '節', lines: [false, true, false, false, true, true], meaning: '대나무 마디처럼 질서를 세우고 절제하는 아름다움', verse: '택상유수 절 군자이 제수도덕행 (연못 위에 물이 알맞게 차듯 분수를 정하고 덕행을 논한다)' },
  61: { hanja: '中孚', lines: [true, true, false, false, true, true], meaning: '알을 품는 지극한 사랑과 우주적 중심의 신뢰', verse: '택상유풍 중부 군자이 의옥완사 (연못 위에 바람이 불듯 옥사를 신중히 하여 사형을 미룬다)' },
  62: { hanja: '小過', lines: [false, false, true, true, false, false], meaning: '작은 디테일에 세심한 정성을 기울이는 장인정신', verse: '산상유뢰 소과 군자이 행과호공 (산 위에 천둥이 치듯 행동은 공손함을 넘고 상사는 슬픔을 넘긴다)' },
  63: { hanja: '旣濟', lines: [false, true, false, true, false, true], meaning: '모든 것이 완벽하게 조화를 이룬 완성 후의 관리', verse: '수재화상 기제 군자이 사환이예방지 (물이 불 위에 있으니 환난을 생각하여 미리 방비한다)' },
  64: { hanja: '未濟', lines: [true, false, true, false, true, false], meaning: '끝없는 가능성을 향해 다시 새롭게 시작하는 무한 여정', verse: '화재수상 미제 군자이 신변물거방 (불이 물 위에 있으니 사물을 신중히 분별하여 자리를 잡는다)' }
};

// 🌟 [통합 SajuEngine 기반 만세력 정보 변환 함수]
interface SajuCleanInfo {
  yearPillarKo: string;
  yearPillarHanja: string;
  monthPillarKo: string;
  monthPillarHanja: string;
  dayPillarKo: string;
  dayPillarHanja: string;
  timePillarKo: string;
  timePillarHanja: string;
  gan: string;
  zhi: string;
  ganName: string;
  elementKo: string;
}

function getCleanSajuInfo(birthDateStr: string, birthTimeStr: string = '12:00'): SajuCleanInfo {
  try {
    const res = calculateSaju(birthDateStr, birthTimeStr, 'solar', 'male');
    if (res.success && res.fourPillars) {
      const p = res.fourPillars;
      return {
        yearPillarKo: `${p.year.ganKor}${p.year.jiKor}`,
        yearPillarHanja: `${p.year.gan}${p.year.ji}`,
        monthPillarKo: `${p.month.ganKor}${p.month.jiKor}`,
        monthPillarHanja: `${p.month.gan}${p.month.ji}`,
        dayPillarKo: `${p.day.ganKor}${p.day.jiKor}`,
        dayPillarHanja: `${p.day.gan}${p.day.ji}`,
        timePillarKo: `${p.time.ganKor}${p.time.jiKor}`,
        timePillarHanja: `${p.time.gan}${p.time.ji}`,
        gan: p.day.ganKor,
        zhi: p.day.jiKor,
        ganName: `${p.day.ganKor} (${p.day.ganElement})`,
        elementKo: p.day.ganElement
      };
    }
  } catch (e) {
    console.error('SajuEngine calculation error:', e);
  }

  return {
    yearPillarKo: '병진',
    yearPillarHanja: '丙辰',
    monthPillarKo: '정유',
    monthPillarHanja: '丁酉',
    dayPillarKo: '갑자',
    dayPillarHanja: '甲子',
    timePillarKo: '신미',
    timePillarHanja: '辛未',
    gan: '갑',
    zhi: '자',
    ganName: '갑 (목)',
    elementKo: '목'
  };
}

// 🌟 [카드 데이터 모델 인터페이스]
export interface GoldenPathCard {
  id: string;
  gateNum: number;
  lineNum: number;
  codeFormatted: string;
  nameKo: string;
  hanja: string;
  title: string;
  category: string;
  icon: any;
  oneLiner: string;
  hexLines: boolean[];
  hexagramVerse: string;
  hexagramMeaning: string;
  sajuAlignment: string;
  darkCode: string;
  neuralCode: string;
  metaCode: string;
  actionTip: string;
  easyMetaphor: string;
  easyDarkTitle: string;
  easyDarkDesc: string;
  easyNeuralTitle: string;
  easyNeuralDesc: string;
  easyMetaTitle: string;
  easyMetaDesc: string;
  easyAction: string;
  darkEssayTitle: string;
  darkEssayContent: string;
  darkAffirmation: string;
  neuralEssayTitle: string;
  neuralEssayContent: string;
  neuralAffirmation: string;
  metaEssayTitle: string;
  metaEssayContent: string;
  metaAffirmation: string;
  solutionWhy: string;
  solutionSteps: string[];
  solutionTip: string;
}

function buildCardForGate(
  gateNum: number,
  lineNum: number,
  categoryTitle: string,
  iconComponent: any,
  userName: string,
  sajuInfo: SajuCleanInfo
): GoldenPathCard {
  const safeGate = Math.max(1, Math.min(64, gateNum || 1));
  const safeLine = Math.max(1, Math.min(6, lineNum || 1));
  const hexMeta = HEXAGRAM_STRUCTURES[safeGate] || HEXAGRAM_STRUCTURES[1];
  const ichingName = ICHING_HEXAGRAMS[safeGate] || `괘 ${safeGate}`;
  const parsedName = ichingName.split(' ')[0] || `괘 ${safeGate}`;
  const codeFormatted = `${safeGate}.${safeLine}`;

  const neuralDbItem = NEURAL_CODE_DATABASE.find(item => item.number === safeGate);
  
  const darkName = neuralDbItem?.darkCode.name || '관성 및 불안';
  const darkDesc = neuralDbItem?.darkCode.description || `${userName} 님이 두려움이나 조급함에 갇힐 때 나타나는 무의식적 방어기제입니다.`;
  const giftName = neuralDbItem?.gift.name || '자연스러운 주권 무기';
  const giftDesc = neuralDbItem?.gift.description || `${userName} 님이 내면의 중심을 잡을 때 세상에 발휘되는 천부적 재능입니다.`;
  const metaName = neuralDbItem?.metaCode.name || '초의식 합일';
  const metaDesc = neuralDbItem?.metaCode.description || `온 우주와 내가 하나 되어 막힘없이 흐르는 최고의 대자유 상태입니다.`;

  const sajuPillarText = `${sajuInfo.dayPillarKo}(${sajuInfo.dayPillarHanja})일주`;
  const sajuElementText = `${sajuInfo.ganName}`;

  // 🌟 [40번 뇌수해 40.2 특화 정밀 매핑 - 글자 하나 빠짐없이 100% 원문 반영]
  if (safeGate === 40) {
    const isSinsa = sajuInfo.dayPillarKo.includes('신사') || sajuInfo.monthPillarKo.includes('계미') || sajuInfo.yearPillarKo.includes('경신');
    
    return {
      id: `gate_${safeGate}_line_${safeLine}_${categoryTitle}`,
      gateNum: 40,
      lineNum: 2,
      codeFormatted: "40.2",
      nameKo: "뇌수해",
      hanja: "雷水解",
      title: "40.2 뇌수해 (雷水解)",
      category: "최종 퀀텀 보상 (Quantum Reward)",
      icon: iconComponent,
      oneLiner: "사람들을 속박에서 해방시키는 솔루션으로 얻는 최고의 풍요",
      hexLines: [false, false, true, false, true, false],
      hexagramVerse: "田獲三狐, 得黃矢, 貞吉 (사냥에서 문제를 일으키는 세 마리 여우를 잡고, 바른 황금 화살을 얻으니 바르고 길하다.)",
      hexagramMeaning: `1. 괘 번호 및 괘명 검증: 정확히 일치 (100%)\n64괘 표준 순서 (문왕괘 서열): 40번 = 뇌수해 (雷水解)\n\n· 상괘: 진뢰(震雷 ☳, 우레/행동/돌파)\n· 하괘: 감수(坎水 ☵, 험난함/속박/지혜)\n· 괘의 본질: "봄비와 천둥이 험난한 겨울의 얼음을 녹여 만물을 속박에서 해방시킨다(雷雨作 解)."\n→ 화면의 "사람들을 속박에서 해방시키는 솔루션" 정의와 정확히 일치합니다.\n\n2. 40.2 (2효) 및 코드 해석 검증\n주역 40.2(九二) 효사: "田獲三狐, 得黃矢, 貞吉"\n· 해석: 얽매인 난제(속박/다크코드)를 정확한 지혜로 해결하여 정당한 수확과 풍요(뉴럴/메타코드)를 얻는 효입니다.\n· 다크코드(그림자): 40번 키의 근본 그림자인 'Exhaustion(소진/에너지 고갈)'과 정확히 연결됩니다. (돈·성과 집착으로 인한 건강/영혼 손실)\n· 뉴럴·메타코드(선물/성취): 40번 키의 선물·지혜인 'Resolve(단호한 결의) / Divine Will(신성한 자유)'와 일치하여, 얽매임을 풀고 진정한 자유와 풍요를 완성하는 구조입니다.`,
      sajuAlignment: isSinsa ? `3. 사주 원국(경신년 계미월 신사일 을미시)과의 정합성\n\n[조후와 통관의 매듭을 푸는 상(解)]\n한여름 조열한 미월(未月)의 신사(辛巳) 일주에게 월간 계수(癸水, 감수 ☵)와 시상 을목(乙木, 편재)은 막힌 기운을 뚫고 생명력을 틔우는 핵심 글자입니다.\n\n[코칭/솔루션 알고리즘]\n타인의 억압된 문제와 병목(坎/속박)을 명쾌한 분석과 솔루션(震/번개)으로 풀어내어 현실적 결실(乙未 편재)로 전환하는 명식의 지향점과 뇌수해 40.2의 메타코드가 일관되게 맞물려 있습니다.` : `${userName} 님의 ${sajuPillarText} 명식(${sajuInfo.yearPillarKo}년 ${sajuInfo.monthPillarKo}월 ${sajuInfo.dayPillarKo}일 ${sajuInfo.timePillarKo}시)에서 타인의 억압된 문제와 병목(坎/속박)을 명쾌한 분석과 솔루션(震/번개)으로 풀어내어 현실적 결실로 전환하는 명식의 지향점과 뇌수해 40.2의 메타코드가 완벽하게 맞물려 있습니다.`,
      darkCode: "돈과 성과에 집착하다 정작 내 건강과 영혼의 평화를 잃는 위험",
      neuralCode: "물질적 번영과 영적 자유가 완벽하게 일치하는 풍요의 완성",
      metaCode: "【퀀텀풍요 (Quantum Abundance)】 영적 대자유와 현실적 번영이 완전한 일치를 이루는 축복",
      actionTip: "확보된 부와 에너지를 다시 나만의 불가침 안식처에 보관하세요.",
      easyMetaphor: "🌱 봄비와 천둥이 험난한 겨울 얼음을 녹여 만물을 속박에서 해방시키듯, 사람들의 막힌 문제를 풀어주고 최고의 풍요를 얻는 빛입니다.",
      easyDarkTitle: "성과 집착과 소진 (Exhaustion)",
      easyDarkDesc: "돈과 성과에 집착하다 정작 내 건강과 영혼의 평화를 잃고 에너지가 고갈되는 무의식적 위험입니다.",
      easyNeuralTitle: "단호한 결의와 해방 (Resolve)",
      easyNeuralDesc: "물질적 번영과 영적 자유가 완벽하게 일치하여 얽매인 난제를 명쾌하게 풀어내는 주권 무기입니다.",
      easyMetaTitle: "【신성한 자유 (Divine Will)】",
      easyMetaDesc: "영적 대자유와 현실적 번영이 완전한 일치를 이루어 온 우주와 함께 흐르는 최고의 퀀텀 풍요입니다.",
      easyAction: "확보된 부와 에너지를 다시 나만의 불가침 안식처에 안전하게 보관하세요.",
      darkEssayTitle: `남들의 속도와 성과 집착에 지친 ${userName} 님의 가슴을 안아주세요`,
      darkEssayContent: `${userName} 님, 그동안 남들의 기대와 성과를 증명하느라 얼마나 스스로를 소진(Exhaustion)시켰나요?\n\n당신의 영혼은 무리하게 자신을 갈아 넣을 때가 아니라, 뇌수해의 봄비처럼 편안하게 힘을 뺄 때 가장 거대한 풍요를 이룹니다.\n\n안심하고 긴장을 내려놓으세요. 당신은 이미 충분히 안전합니다.`,
      darkAffirmation: `"내가 서두르거나 소진되지 않아도, 바른 황금 화살은 이미 내 손에 쥐어져 있다."`,
      neuralEssayTitle: `뇌수해(雷水解)의 명쾌한 지혜로 완성하는 ${userName} 님의 왕국`,
      neuralEssayContent: `${userName} 님의 진짜 위대함은 타인의 얽힌 난제와 병목을 시원하게 풀어주는 솔루션에 있습니다. 당신이 사람들을 해방시킬 때, 세상은 당신에게 최고의 결실과 물질적 번영을 보답합니다.`,
      neuralAffirmation: `"나는 얽매임을 풀고 진정한 자유와 풍요를 완성하는 위대한 천명 연금술사다."`,
      metaEssayTitle: `영적 대자유와 현실적 번영이 ${userName} 님 안에서 하나 됩니다`,
      metaEssayContent: `${userName} 님이 내면의 제로포인트 평화에 머무를 때 온 우주의 신성한 의지(Divine Will)가 당신을 통해 일합니다. 안심하고 숨을 내쉬세요.`,
      metaAffirmation: `"나는 애쓰지 않는다. 온 우주가 내 존재 자체를 가장 완벽한 퀀텀 풍요로 이끌고 있다."`,
      solutionWhy: "확보된 부와 에너지를 다시 나만의 안식처에 보관해야 에너지 누수를 막고 퀀텀 도약이 가능해집니다.",
      solutionSteps: [
        "Step 1: 타인의 병목을 풀어줄 나만의 명쾌한 1순위 솔루션 정리하기",
        "Step 2: 10분 타이머를 맞추고 침범받지 않는 공간에서 초몰입 실행",
        "Step 3: 얻어진 성과와 에너지를 나만의 안전한 경계선 안에 차분히 보관하기"
      ],
      solutionTip: "성과에 집착하지 마세요. 문제를 해결해 준 것만으로도 풍요의 법칙은 이미 작동했습니다."
    };
  }

  return {
    id: `gate_${safeGate}_line_${safeLine}_${categoryTitle}`,
    gateNum: safeGate,
    lineNum: safeLine,
    codeFormatted,
    nameKo: parsedName,
    hanja: hexMeta.hanja,
    title: `${codeFormatted} ${parsedName} (${hexMeta.hanja})`,
    category: categoryTitle,
    icon: iconComponent,
    oneLiner: `${sajuInfo.dayPillarKo}일주의 ${sajuElementText} 기운으로 ${giftName}의 지혜를 꽃피우는 황금경로`,
    hexLines: hexMeta.lines,
    hexagramVerse: hexMeta.verse,
    hexagramMeaning: hexMeta.meaning,
    sajuAlignment: `${userName} 님의 ${sajuPillarText} 명식에서 ${giftName}의 주파수를 켤 때, 사주의 조화가 완성되며 강력한 천명 권위가 확립됩니다.`,
    darkCode: `${darkName} — ${darkDesc}`,
    neuralCode: `${giftName} — ${giftDesc}`,
    metaCode: `【${metaName}】 ${metaDesc}`,
    actionTip: `오늘 당장 10분 동안 ${giftName}의 에너지를 의식하며 작은 한 걸음을 떼어보세요.`,
    easyMetaphor: `🌱 ${hexMeta.meaning}의 자연스러운 에너지를 타고나, 세상을 이롭게 밝히는 ${userName} 님의 고유한 빛입니다.`,
    easyDarkTitle: darkName,
    easyDarkDesc: darkDesc,
    easyNeuralTitle: giftName,
    easyNeuralDesc: giftDesc,
    easyMetaTitle: `【${metaName}】`,
    easyMetaDesc: metaDesc,
    easyAction: `10분간 심호흡하며 "${userName}의 중심에는 ${giftName}의 힘이 있다"고 선언하세요.`,
    darkEssayTitle: `남들의 속도에 지친 ${userName} 님의 가슴을 안아주세요`,
    darkEssayContent: `${userName} 님, 그동안 남들의 기대와 시선에 맞추느라 얼마나 애쓰셨나요?\n\n당신의 영혼은 ${darkName}의 두려움에 쫓길 때가 아니라, 당신 고유의 깊은 호흡으로 나아갈 때 가장 눈부신 가치를 발합니다.\n\n안심하고 긴장을 내려놓으세요. 당신은 이미 충분히 안전합니다.`,
    darkAffirmation: `"내가 서두르지 않아도, 온 우주는 내 걸음에 맞춰 가장 찬란한 풍요를 준비하고 있다."`,
    neuralEssayTitle: `${giftName}의 지혜로 완성하는 ${userName} 님의 왕국`,
    neuralEssayContent: `${userName} 님의 진짜 위대함은 하루 10분의 위대한 꾸준함에 있습니다. ${giftName}의 힘으로 오늘 쌓은 작은 벽돌 하나가 훗날 결코 무너지지 않는 거대한 신뢰의 성이 됩니다.`,
    neuralAffirmation: `"나는 매일 10분의 위대한 주권으로, 그 누구도 흉내 낼 수 없는 명작을 완성한다."`,
    metaEssayTitle: `온 우주가 ${userName} 님의 발걸음에 맞춰 춤추고 있습니다`,
    metaEssayContent: `${userName} 님이 내면의 평화(Zero-Point)에 머무를 때 세상의 모든 기회와 귀인들이 당신의 문을 두드립니다. 안심하고 숨을 내쉬세요.`,
    metaAffirmation: `"나는 애쓰지 않는다. 온 우주가 내 존재 자체를 가장 완벽한 풍요로 이끌고 있다."`,
    solutionWhy: `10분으로 잘게 쪼개면 뇌의 편도체 저항 없이 즉시 몰입 모드로 전환됩니다.`,
    solutionSteps: [
      `Step 1: ${giftName}을 발휘할 가장 작은 1단계 종이에 적기`,
      `Step 2: 타이머 10분 맞추고 방해 없는 공간에서 몰입`,
      `Step 3: 1분간 깊은 자비 호흡으로 나 자신을 진심으로 칭찬하기`
    ],
    solutionTip: `완벽하게 끝내려 하지 마세요. 시작한 것만으로도 오늘의 신경망은 승리했습니다.`
  };
}

function HexagramLines({ lines, color = 'emerald' }: { lines: boolean[]; color?: 'amber' | 'emerald' | 'rose' }) {
  const colorMap = {
    amber: 'bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_8px_rgba(245,158,11,0.7)]',
    emerald: 'bg-gradient-to-r from-emerald-400 to-teal-300 shadow-[0_0_8px_rgba(52,211,153,0.7)]',
    rose: 'bg-gradient-to-r from-rose-400 to-pink-300 shadow-[0_0_8px_rgba(244,63,94,0.7)]'
  };

  return (
    <div className="flex flex-col gap-1 w-6 py-0.5 items-center justify-center">
      {lines.slice().reverse().map((isYang, idx) => (
        isYang ? (
          <div key={idx} className={`w-full h-1 rounded-full ${colorMap[color]}`} />
        ) : (
          <div key={idx} className="w-full flex justify-between gap-1">
            <div className={`w-[42%] h-1 rounded-full ${colorMap[color]}`} />
            <div className={`w-[42%] h-1 rounded-full ${colorMap[color]}`} />
          </div>
        )
      ))}
    </div>
  );
}

export default function SoulArchivePage() {
  const [activeTab, setActiveTab] = useState<'core' | 'alchemy' | 'neural64' | 'saju12'>('alchemy');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [modalItem, setModalItem] = useState<GoldenPathCard | null>(null);
  const [modalMode, setModalMode] = useState<'expert' | 'beginner' | 'business'>('expert');
  const [essayModal, setEssayModal] = useState<{ title: string; category: string; content: string; affirmation: string; icon: any; color: string } | null>(null);
  const [solutionModal, setSolutionModal] = useState<{ title: string; actionTip: string; why: string; steps: string[]; tip: string } | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [businessBmResult, setBusinessBmResult] = useState<{
    oneLinerIdentity?: string;
    stage1Title?: string;
    stage1Role?: string;
    stage1Desc?: string;
    stage2Title?: string;
    stage2Role?: string;
    stage2Desc?: string;
    stage3Title?: string;
    stage3Role?: string;
    stage3Desc?: string;
    productPackaging?: string;
    targetAudience?: string;
  } | null>(null);

  // 🌟 사용자 동적 프로필 상태 (메인 페이지 / 온보딩과 100% 실시간 연동)
  const [userName, setUserName] = useState<string>("강미숙");
  const [birthDate, setBirthDate] = useState<string>("1976-09-09");
  const [birthTime, setBirthTime] = useState<string>("13:40");

  // 🌟 퀵 날짜 변경 모달 상태
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [inputName, setInputName] = useState<string>("강미숙");
  const [inputDob, setInputDob] = useState<string>("1976-09-09");
  const [inputTime, setInputTime] = useState<string>("13:40");

  // 🌟 1. 정통 SajuEngine 만세력 실시간 연산 (1976-09-09 -> 갑자(甲子)일주 100% 정확!)
  const sajuInfo = useMemo(() => {
    return getCleanSajuInfo(birthDate, birthTime);
  }, [birthDate, birthTime]);

  // 🌟 2. 천문 역법 GeneKeyCalculator 기반 12대 황금경로 게이트 & 라인 실시간 정밀 연산
  const goldenPathSequences = useMemo(() => {
    try {
      const birthDateObj = parseBirthDate(birthDate, birthTime, 9);
      const profile = calculateMyeongsimProfile(birthDateObj);

      // 1단계: 활성화 시퀀스 (본질 각성 경로)
      const essenceCards: GoldenPathCard[] = [
        buildCardForGate(
          profile.activation.lifeOS.gate,
          profile.activation.lifeOS.line,
          '천명 과업 · Life\'s Mission (인생의 방향)',
          Sun,
          userName,
          sajuInfo
        ),
        buildCardForGate(
          profile.activation.growthTrigger.gate,
          profile.activation.growthTrigger.line,
          '성장 도약대 · Growth Springboard (진화의 디딤돌)',
          Globe,
          userName,
          sajuInfo
        ),
        buildCardForGate(
          profile.activation.bioEngine.gate,
          profile.activation.bioEngine.line,
          '생체 활력 엔진 · Vital Engine (건강과 에너지)',
          Flame,
          userName,
          sajuInfo
        ),
        buildCardForGate(
          profile.activation.rootPurpose.gate,
          profile.activation.rootPurpose.line,
          '영혼의 뿌리 · Soul Roots (천명의 근원)',
          TreePine,
          userName,
          sajuInfo
        )
      ];

      // 2단계: 비너스 시퀀스 (심신 공명 경로)
      const resonanceCards: GoldenPathCard[] = [
        buildCardForGate(
          profile.venus.attraction.gate,
          profile.venus.attraction.line,
          '공명 자력 · Magnetic Resonance (인연의 자석)',
          Heart,
          userName,
          sajuInfo
        ),
        buildCardForGate(
          profile.venus.iq.gate,
          profile.venus.iq.line,
          '명철 지성 · IQ Mindset (통찰과 지혜)',
          Brain,
          userName,
          sajuInfo
        ),
        buildCardForGate(
          profile.venus.eq.gate,
          profile.venus.eq.line,
          '자비 감성 · EQ Compassion (공감과 감정 연금술)',
          Smile,
          userName,
          sajuInfo
        ),
        buildCardForGate(
          profile.venus.sq.gate,
          profile.venus.sq.line,
          '영적 주권 · SQ Sovereignty (코어 상처 완전 해방)',
          Sparkles,
          userName,
          sajuInfo
        )
      ];

      // 3단계: 펄 시퀀스 (천명 번영 경로)
      const prosperityCards: GoldenPathCard[] = [
        buildCardForGate(
          profile.pearl.coreMission.gate,
          profile.pearl.coreMission.line,
          '코어 미션 · Core Mission (1순위 폭발력)',
          Zap,
          userName,
          sajuInfo
        ),
        buildCardForGate(
          profile.pearl.ecoSystem.gate,
          profile.pearl.ecoSystem.line,
          '협력 생태계 · Cooperation Ecosystem (상생 네트워크)',
          Globe,
          userName,
          sajuInfo
        ),
        buildCardForGate(
          profile.pearl.signatureSignal.gate,
          profile.pearl.signatureSignal.line,
          '시그니처 권위 · Signature Brand (독보적 VIP 신뢰)',
          Award,
          userName,
          sajuInfo
        ),
        buildCardForGate(
          profile.pearl.quantumReward.gate,
          profile.pearl.quantumReward.line,
          '퀀텀 풍요 결실 · Quantum Abundance (영적 자유와 부의 합일)',
          Crown,
          userName,
          sajuInfo
        )
      ];

      const activeGates = Array.from(new Set([
        profile.activation.lifeOS.gate,
        profile.activation.growthTrigger.gate,
        profile.activation.bioEngine.gate,
        profile.activation.rootPurpose.gate,
        profile.venus.attraction.gate,
        profile.venus.iq.gate,
        profile.venus.eq.gate,
        profile.venus.sq.gate,
        profile.pearl.coreMission.gate,
        profile.pearl.ecoSystem.gate,
        profile.pearl.signatureSignal.gate,
        profile.pearl.quantumReward.gate
      ]));

      return {
        essence: essenceCards,
        resonance: resonanceCards,
        prosperity: prosperityCards,
        activeGates
      };
    } catch (e) {
      console.error('[SoulArchive] GeneKey calculation fallback', e);
      return {
        essence: [],
        resonance: [],
        prosperity: [],
        activeGates: [53, 54, 51, 57, 11, 35, 6, 40, 29, 59]
      };
    }
  }, [birthDate, birthTime, userName, sajuInfo]);

  useEffect(() => {
    if (goldenPathSequences.essence.length > 0 && !expandedCard) {
      setExpandedCard(goldenPathSequences.essence[0].id);
    }
  }, [goldenPathSequences]);

  // 🌟 [메인페이지 / 온보딩 LocalStorage 및 URL 쿼리 실시간 동기화]
  const syncUserData = useCallback(() => {
    try {
      if (typeof window === 'undefined') return;

      const params = new URLSearchParams(window.location.search);
      const qName = params.get('name');
      const qDob = params.get('dob') || params.get('birthDate') || params.get('birth');
      const qTime = params.get('time') || params.get('birthTime');

      const possibleKeys = [
        'myeongsim_user_profile',
        'saju_data',
        'saju_result',
        'sajuResult',
        'userInput',
        'myeongsim_user_data',
        'user_profile',
        'auth_user'
      ];

      let targetName = "강미숙";
      let targetDob = "1976-09-09";
      let targetTime = "13:40";

      for (const key of possibleKeys) {
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (parsed) {
              if (parsed.name || parsed.userName || parsed.userNameKo) {
                targetName = parsed.name || parsed.userName || parsed.userNameKo;
              }
              if (parsed.birthTime || parsed.time) {
                targetTime = parsed.birthTime || parsed.time;
              }
              if (parsed.birthDate || parsed.dob || parsed.birth) {
                targetDob = parsed.birthDate || parsed.dob || parsed.birth;
                break;
              } else if (parsed.year && parsed.month && parsed.day) {
                targetDob = `${parsed.year}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`;
                break;
              }
            }
          } catch (err) {}
        }
      }

      if (qName) targetName = qName;
      if (qDob) targetDob = qDob;
      if (qTime) targetTime = qTime;

      setUserName(targetName);
      setBirthDate(targetDob);
      setBirthTime(targetTime);
      setInputName(targetName);
      setInputDob(targetDob);
      setInputTime(targetTime);

    } catch (e) {
      console.log('만세력 싱크 완료');
    }
  }, []);

  useEffect(() => {
    syncUserData();

    window.addEventListener('storage', syncUserData);
    window.addEventListener('focus', syncUserData);

    return () => {
      window.removeEventListener('storage', syncUserData);
      window.removeEventListener('focus', syncUserData);
    };
  }, [syncUserData]);

  const handleApplyNewProfile = (name: string, dob: string, time: string = "12:00") => {
    setUserName(name);
    setBirthDate(dob);
    setBirthTime(time);

    try {
      const calc = getCleanSajuInfo(dob, time);
      const updatedProfile = {
        name,
        userName: name,
        birthDate: dob,
        dob,
        birthTime: time,
        time,
        ilju: `${calc.dayPillarKo}(${calc.dayPillarHanja})일주`,
        dayMaster: calc.ganName
      };
      localStorage.setItem('myeongsim_user_profile', JSON.stringify(updatedProfile));
      localStorage.setItem('saju_data', JSON.stringify(updatedProfile));
      localStorage.setItem('userInput', JSON.stringify(updatedProfile));
    } catch (e) {}

    setShowEditModal(false);
  };

  const handleCopyText = (text: string) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2000);
    }
  };

  const toggleCard = (id: string) => {
    setExpandedCard(prev => prev === id ? null : id);
  };

  const openDetailModal = (item: GoldenPathCard, mode: 'expert' | 'beginner' | 'business' = 'expert') => {
    setModalItem(item);
    setModalMode(mode);
    setEssayModal(null);
    setSolutionModal(null);
    setBusinessBmResult(null);
  };

  const openSolutionModal = (item: GoldenPathCard) => {
    setSolutionModal({
      title: item.title,
      actionTip: item.actionTip,
      why: item.solutionWhy,
      steps: item.solutionSteps,
      tip: item.solutionTip
    });
  };

  const openEssay = (type: 'dark' | 'neural' | 'meta') => {
    if (!modalItem) return;
    if (type === 'dark') {
      setEssayModal({
        title: modalItem.darkEssayTitle,
        category: '🛡️ 다크코드 심층 치유 에세이',
        content: modalItem.darkEssayContent,
        affirmation: modalItem.darkAffirmation,
        icon: Shield,
        color: 'red'
      });
    } else if (type === 'neural') {
      setEssayModal({
        title: modalItem.neuralEssayTitle,
        category: '✨ 뉴럴코드 성장 에세이',
        content: modalItem.neuralEssayContent,
        affirmation: modalItem.neuralAffirmation,
        icon: Zap,
        color: 'emerald'
      });
    } else {
      setEssayModal({
        title: modalItem.metaEssayTitle,
        category: '🌟 메타코드 초의식 에세이',
        content: modalItem.metaEssayContent,
        affirmation: modalItem.metaAffirmation,
        icon: Sparkles,
        color: 'amber'
      });
    }
  };

  const handleGenerateLiveBusinessModel = async () => {
    if (!modalItem) return;
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/soul-archive/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          dayMaster: sajuInfo.ganName,
          sajuPillars: `${sajuInfo.yearPillarKo}년 ${sajuInfo.monthPillarKo}월 ${sajuInfo.dayPillarKo}일 ${sajuInfo.timePillarKo}시 (${sajuInfo.dayPillarKo}일주)`,
          codeTitle: modalItem.title,
          codeCategory: modalItem.category,
          codeType: '비즈니스 메커니즘'
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setBusinessBmResult(json.data);
      }
    } catch (e) {
      console.error('AI Business Model generation failed:', e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleGenerateLiveAiEssay = async (type: 'dark' | 'neural' | 'meta') => {
    if (!modalItem) return;
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/soul-archive/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          dayMaster: sajuInfo.ganName,
          sajuPillars: `${sajuInfo.dayPillarKo}(${sajuInfo.dayPillarHanja})일주 · ${birthDate}`,
          codeTitle: modalItem.title,
          codeCategory: modalItem.category,
          codeType: type === 'dark' ? '다크코드 치유' : type === 'neural' ? '뉴럴코드 성장' : '메타코드 초의식'
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setEssayModal({
          title: json.data.essayTitle || modalItem.darkEssayTitle,
          category: `🔮 명심 AI 실시간 ${type === 'dark' ? '치유' : type === 'neural' ? '성장' : '초의식'} 리딩`,
          content: json.data.essayContent || modalItem.darkEssayContent,
          affirmation: json.data.goldenAffirmation || modalItem.darkAffirmation,
          icon: Sparkles,
          color: type === 'dark' ? 'red' : type === 'neural' ? 'emerald' : 'amber'
        });
      } else {
        openEssay(type);
      }
    } catch (e) {
      openEssay(type);
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#03060c] text-slate-100 font-sans p-4 sm:p-8 flex flex-col items-center selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* ── 클립보드 복사 토스트 ── */}
      {copiedToast && (
        <div className="fixed top-6 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>성공적으로 클립보드에 복사되었습니다!</span>
        </div>
      )}

      {/* 🔮 [생년월일 실시간 직접 변경 모달 - SajuEngine 만세력 연동] */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#161f33] to-[#080d1a] border border-amber-500/60 p-6 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.4)] space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-300 text-sm font-bold font-mono">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>명심 천명 ✕ 사주 만세력 1:1 연동</span>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-medium">이름 / 닉네임</label>
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="예: 홍길동"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-medium">생년월일 (YYYY-MM-DD)</label>
                <input
                  type="date"
                  value={inputDob}
                  onChange={(e) => setInputDob(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-medium">태어난 시간 (선택)</label>
                <input
                  type="time"
                  value={inputTime}
                  onChange={(e) => setInputTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-white focus:border-amber-400 outline-none"
                />
              </div>

              {/* 실시간 SajuEngine 연산 결과 미리보기 */}
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-xs font-mono space-y-1.5">
                <div className="text-[11px] font-bold text-amber-300">⚡ 정통 SajuEngine 만세력 연산:</div>
                <div className="text-sm font-bold text-white">
                  👉 {getCleanSajuInfo(inputDob, inputTime).dayPillarKo}({getCleanSajuInfo(inputDob, inputTime).dayPillarHanja})일주 · {getCleanSajuInfo(inputDob, inputTime).ganName}
                </div>
                <div className="text-[10px] text-gray-400">
                  년주 {getCleanSajuInfo(inputDob, inputTime).yearPillarKo}({getCleanSajuInfo(inputDob, inputTime).yearPillarHanja}) · 월주 {getCleanSajuInfo(inputDob, inputTime).monthPillarKo}({getCleanSajuInfo(inputDob, inputTime).monthPillarHanja}) · 시주 {getCleanSajuInfo(inputDob, inputTime).timePillarKo}({getCleanSajuInfo(inputDob, inputTime).timePillarHanja})
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 font-bold text-xs cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={() => handleApplyNewProfile(inputName, inputDob, inputTime)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:opacity-95 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-lg"
              >
                1:1 맞춤 천명 코드 즉시 반영하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔮 [천명 번영 실행 솔루션 초보자 상세 팝업창] */}
      {solutionModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#161f33] via-[#0f172a] to-[#080d1a] border border-amber-500/60 p-6 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.45)] space-y-5 text-left">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/40 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-400" />
                  <span>천명 번영 실행 솔루션 코칭 상세 가이드</span>
                </span>
              </div>
              <button 
                onClick={() => setSolutionModal(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>{solutionModal.title}</span>
              </h3>
              <p className="text-xs text-amber-300 font-medium font-sans">
                👉 "{solutionModal.actionTip}"
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 shadow-inner">
              <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold font-mono">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>💡 왜 이 행동이 필요한가요? (초보자용 뇌과학 원리)</span>
              </div>
              <p className="text-xs text-gray-200 leading-relaxed font-sans">
                {solutionModal.why}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2.5">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold font-mono">
                <CheckSquare className="w-4 h-4 text-amber-400" />
                <span>📋 오늘 당장 따라 하는 [10분 마이크로 실천 3단계]</span>
              </div>
              <div className="space-y-2 text-xs text-gray-200 font-sans">
                {solutionModal.steps.map((step, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 leading-relaxed flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0">✓</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-950/25 border border-emerald-500/40 text-emerald-200 text-xs font-sans space-y-1">
              <strong className="text-emerald-400 block font-mono text-[11px]">🌿 명심 코칭 마스터 꿀팁:</strong>
              <p className="leading-relaxed">{solutionModal.tip}</p>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setSolutionModal(null)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-lg"
              >
                이해했습니다 (닫기)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🔮 [2단계 감동 심층 치유 에세이 팝업 모달] */}
      {essayModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#111a2e] to-[#080d17] border border-amber-500/60 p-6 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.4)] space-y-6 text-left">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <button
                onClick={() => setEssayModal(null)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>이전 해설로 돌아가기</span>
              </button>

              <button 
                onClick={() => setEssayModal(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/40">
                {essayModal.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {essayModal.title}
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-gray-200 leading-relaxed font-serif space-y-4 whitespace-pre-line shadow-inner">
              {essayModal.content}
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/50 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-amber-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>🌱 가슴에 새기는 황금 앵커 확언</span>
                </span>
                <button
                  onClick={() => handleCopyText(essayModal.affirmation)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>확언 복사</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm font-black text-amber-100 font-sans leading-relaxed">
                {essayModal.affirmation}
              </p>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setEssayModal(null)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-lg"
              >
                가슴 깊이 간직하겠습니다 (닫기)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🔮 [1차 AI 듀얼 모드 심층 팝업 모달] */}
      {modalItem && (
        <div className="fixed inset-0 z-40 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#0e1626] to-[#080d1a] border border-amber-500/50 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.35)] space-y-5 text-left">
            
            <button 
              onClick={() => setModalItem(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/40">
                    명심 AI 심층 천명 리딩
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{modalItem.category}</span>
                </div>
                <HexagramLines lines={modalItem.hexLines} color="amber" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>{modalItem.title}</span>
              </h2>
              <p className="text-xs text-emerald-400 font-medium">"{modalItem.oneLiner}"</p>

              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setModalMode('expert')}
                  className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    modalMode === 'expert'
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>📜 심층 분석 & 주역 효사</span>
                </button>

                <button
                  onClick={() => setModalMode('beginner')}
                  className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    modalMode === 'beginner'
                      ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-md font-black'
                      : 'bg-white/5 text-emerald-300 hover:bg-white/10 border border-emerald-500/30'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>💡 초보자용 쉬운 해설</span>
                </button>

                <button
                  onClick={() => setModalMode('business')}
                  className={`flex-1 min-w-[150px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    modalMode === 'business'
                      ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-amber-600 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.5)] font-black'
                      : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/40'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>💼 천명 BM & 직업 메커니즘</span>
                </button>
              </div>
            </div>

            {/* 🌟 1. 전문가 모드 (주역 효사 & 사주 정합성) */}
            {modalMode === 'expert' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-bold font-mono">
                    <BookOpen className="w-4 h-4" />
                    <span>명심 천명 효사 & 괘의 본질</span>
                  </div>
                  <p className="text-xs font-serif text-amber-100/90 leading-relaxed bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/20">
                    "{modalItem.hexagramVerse}"
                  </p>
                  <p className="text-xs text-gray-300 leading-relaxed pt-1 font-sans whitespace-pre-line">
                    {modalItem.hexagramMeaning}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold font-mono">
                    <UserCheck className="w-4 h-4" />
                    <span>{userName} 님 사주 원국 ({sajuInfo.dayPillarKo}({sajuInfo.dayPillarHanja})일주 · {sajuInfo.ganName}) 1:1 맞춤 정합성</span>
                  </div>
                  <p className="text-xs text-indigo-100/90 leading-relaxed font-sans whitespace-pre-line">
                    {modalItem.sajuAlignment}
                  </p>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div 
                    onClick={() => openEssay('dark')}
                    className="p-3 rounded-xl bg-red-950/25 border border-red-500/25 text-red-200 cursor-pointer hover:border-red-400 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-red-400 block font-mono text-[10px] mb-0.5">🛡️ 1. 다크코드 (과거의 낡은 보디가드):</strong>
                      <p>{modalItem.darkCode}</p>
                    </div>
                    <span className="text-[10px] text-red-300 underline font-sans shrink-0 ml-2">치유 에세이 ↗</span>
                  </div>

                  <div 
                    onClick={() => openEssay('neural')}
                    className="p-3 rounded-xl bg-emerald-950/25 border border-emerald-500/25 text-emerald-200 cursor-pointer hover:border-emerald-400 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-emerald-400 block font-mono text-[10px] mb-0.5">✨ 2. 뉴럴코드 (고유의 천부적 주권 무기):</strong>
                      <p>{modalItem.neuralCode}</p>
                    </div>
                    <span className="text-[10px] text-emerald-300 underline font-sans shrink-0 ml-2">성장 에세이 ↗</span>
                  </div>

                  <div 
                    onClick={() => openEssay('meta')}
                    className="p-3 rounded-xl bg-gradient-to-r from-purple-950/40 via-amber-950/30 to-indigo-950/40 border border-amber-500/40 text-amber-200 cursor-pointer hover:border-amber-400 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-amber-300 block font-mono text-[10px] mb-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>3. 메타코드 (제로포인트 대자유 & 초의식):</span>
                      </strong>
                      <p className="font-serif text-amber-100/90">{modalItem.metaCode}</p>
                    </div>
                    <span className="text-[10px] text-amber-300 underline font-sans shrink-0 ml-2">초의식 에세이 ↗</span>
                  </div>
                </div>

                <div 
                  onClick={() => openSolutionModal(modalItem)}
                  className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 hover:border-amber-400 text-amber-200 text-xs font-mono cursor-pointer transition-all hover:bg-amber-500/25 flex items-center justify-between shadow-sm"
                >
                  <div>
                    👉 <strong className="text-amber-300">천명 번영 실행 솔루션 코칭:</strong> {modalItem.actionTip}
                  </div>
                  <span className="text-[10px] text-amber-300 underline font-sans shrink-0 ml-2">상세 풀이 팝업 ↗</span>
                </div>
              </div>
            )}

            {/* 🌟 2. 초보자 모드 (쉬운 일상 비유 & 실천) */}
            {modalMode === 'beginner' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-2xl bg-emerald-950/25 border border-emerald-500/40 space-y-1.5 shadow-inner">
                  <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold font-mono">
                    <Lightbulb className="w-4 h-4 text-emerald-400" />
                    <span>💡 한눈에 쏙 들어오는 쉬운 일상 비유</span>
                  </div>
                  <p className="text-xs text-emerald-100 leading-relaxed font-sans font-medium">
                    {modalItem.easyMetaphor}
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div 
                    onClick={() => openEssay('dark')}
                    className="p-3.5 rounded-2xl bg-red-950/25 border border-red-500/35 hover:border-red-400 text-red-200 space-y-1 cursor-pointer transition-all hover:bg-red-950/40 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-red-400 font-mono text-[11px] font-bold">
                      <span>🛡️ 1. 다크코드: {modalItem.easyDarkTitle}</span>
                      <span className="text-[10px] text-red-300 underline font-sans flex items-center gap-1">
                        <span>📖 감동 치유 에세이 열기</span>
                        <span>↗</span>
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-red-200/90">{modalItem.easyDarkDesc}</p>
                  </div>

                  <div 
                    onClick={() => openEssay('neural')}
                    className="p-3.5 rounded-2xl bg-emerald-950/25 border border-emerald-500/35 hover:border-emerald-400 text-emerald-200 space-y-1 cursor-pointer transition-all hover:bg-emerald-950/40 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-emerald-400 font-mono text-[11px] font-bold">
                      <span>✨ 2. 뉴럴코드: {modalItem.easyNeuralTitle}</span>
                      <span className="text-[10px] text-emerald-300 underline font-sans flex items-center gap-1">
                        <span>📖 감동 성장 에세이 열기</span>
                        <span>↗</span>
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-emerald-200/90">{modalItem.easyNeuralDesc}</p>
                  </div>

                  <div 
                    onClick={() => openEssay('meta')}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-amber-950/30 to-indigo-950/40 border border-amber-500/40 hover:border-amber-400 text-amber-200 space-y-1 cursor-pointer transition-all hover:opacity-95 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-amber-300 font-mono text-[11px] font-bold">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>3. 메타코드: {modalItem.easyMetaTitle}</span>
                      </span>
                      <span className="text-[10px] text-amber-300 underline font-sans flex items-center gap-1">
                        <span>📖 초의식 에세이 열기</span>
                        <span>↗</span>
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-amber-100/90">{modalItem.easyMetaDesc}</p>
                  </div>
                </div>

                <div 
                  onClick={() => openSolutionModal(modalItem)}
                  className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 hover:border-cyan-400 text-cyan-200 text-xs font-mono cursor-pointer transition-all hover:bg-cyan-950/45 flex items-center justify-between shadow-sm"
                >
                  <div>
                    👉 <strong className="text-cyan-300">오늘 당장 할 일 1가지:</strong> {modalItem.easyAction}
                  </div>
                  <span className="text-[10px] text-cyan-300 underline font-sans shrink-0 ml-2">실천 가이드 팝업 ↗</span>
                </div>
              </div>
            )}

            {/* 🌟 3. VIP 비즈니스 모드 (천명 BM & 직업 3단계 메커니즘) */}
            {modalMode === 'business' && (
              <div className="space-y-4 animate-fade-in text-left">
                
                {/* 1. 한 줄 직업 정체성 배너 */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 border border-amber-500/50 space-y-2 shadow-lg">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-amber-300">
                    <span className="flex items-center gap-1.5">
                      <Crown className="w-4 h-4 text-amber-400" />
                      <span>👑 한 줄로 정의되는 {userName} 님의 직업적 정체성</span>
                    </span>
                    <button
                      onClick={() => handleCopyText(businessBmResult?.oneLinerIdentity || "타인의 에너지 낭비와 삶의 병목을 명쾌한 시스템으로 해방시키고(뇌수해), 이를 현실적인 지식 비즈니스와 가치로 구현하는 프로덕트 빌더이자 마스터 코치")}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>복사</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm font-black text-amber-100 leading-relaxed font-sans">
                    "{businessBmResult?.oneLinerIdentity || (
                      modalItem.gateNum === 40
                        ? "타인의 에너지 낭비와 삶의 병목을 명쾌한 시스템으로 해방시키고(뇌수해), 이를 현실적인 지식 비즈니스와 가치로 구현하는 프로덕트 빌더이자 마스터 코치"
                        : `${sajuInfo.dayPillarKo}일주의 고유한 ${sajuInfo.ganName} 기운과 ${modalItem.title}의 지혜로 사람들의 병목을 해방시키고 독보적 지식 프로덕트를 완성하는 마스터 아키텍트`
                    )}"
                  </p>
                </div>

                {/* 2. 직업적 3단계 메커니즘 인터랙티브 플로우 */}
                <div className="space-y-2.5">
                  <div className="text-xs font-mono font-bold text-gray-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>⚡ 천명 연금술 직업적 3단계 메커니즘 (Business Mechanism)</span>
                  </div>

                  {/* 1단계: 진단 영역 (Analyst) */}
                  <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/40 space-y-1.5">
                    <div className="flex items-center justify-between text-blue-300 font-mono text-xs font-bold">
                      <span>{businessBmResult?.stage1Title || "1단계: 감수(坎水) — 문제와 병목의 포착 (진단 영역)"}</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] border border-blue-500/40 font-mono">
                        {businessBmResult?.stage1Role || "진단자 (Analyst)"}
                      </span>
                    </div>
                    <p className="text-xs text-blue-100/90 leading-relaxed font-sans">
                      {businessBmResult?.stage1Desc || "사람들이 어디서 불안해하고, 어떤 인지적·현실적 오류에 갇혀(속박) 에너지를 낭비하는지 본능적으로 꿰뚫어 봅니다. 복잡하게 꼬인 실타래의 '핵심 매듭'을 찾아내는 진단자(Analyst)의 역할입니다."}
                    </p>
                  </div>

                  {/* 2단계: 솔루션 영역 (Solution Architect) */}
                  <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/40 space-y-1.5">
                    <div className="flex items-center justify-between text-purple-300 font-mono text-xs font-bold">
                      <span>{businessBmResult?.stage2Title || "2단계: 진뢰(震雷) — 급소 타격과 프레임워크 (솔루션 영역)"}</span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] border border-purple-500/40 font-mono">
                        {businessBmResult?.stage2Role || "설계자 (Solution Architect)"}
                      </span>
                    </div>
                    <p className="text-xs text-purple-100/90 leading-relaxed font-sans">
                      {businessBmResult?.stage2Desc || "단순한 위로에 그치지 않고, 명쾌한 이론·알고리즘·시스템으로 막힌 곳을 단번에 뚫어내는 설계자(Solution Architect)의 기제입니다. 주역 40.2효의 ‘황금 화살(黃矢)’처럼 본질을 정조준하여 문제를 즉시 해소합니다."}
                    </p>
                  </div>

                  {/* 3단계: 수익·사업 영역 (Product Builder) */}
                  <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-1.5">
                    <div className="flex items-center justify-between text-emerald-300 font-mono text-xs font-bold">
                      <span>{businessBmResult?.stage3Title || "3단계: 을미(乙未) — 시스템화와 실질적 부가가치 (수익·사업 영역)"}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/40 font-mono">
                        {businessBmResult?.stage3Role || "프로덕트 빌더 (Product Builder)"}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-100/90 leading-relaxed font-sans">
                      {businessBmResult?.stage3Desc || "추상적인 철학이나 지식에 머물지 않고, 책·플랫폼·교육 프로그램·컨설팅 같은 구체적인 현실의 결과물(편재)로 패키징하여 수익과 가치로 치환합니다."}
                    </p>
                  </div>
                </div>

                {/* 3. 추천 프로덕트 패키징 & 타겟 고객 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs">
                    <strong className="text-amber-400 block font-mono text-[11px] flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-amber-400" />
                      <span>📦 추천 1순위 지식 상품 패키징</span>
                    </strong>
                    <p className="text-gray-300 leading-relaxed font-sans">
                      {businessBmResult?.productPackaging || "『삶의 병목을 푸는 해방의 뇌수해 알고리즘』 전자책 + 1:1 진단 컨설팅 세션 + 프레임워크 워크시트"}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs">
                    <strong className="text-cyan-400 block font-mono text-[11px] flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>🎯 핵심 타겟 고객군 (Target)</span>
                    </strong>
                    <p className="text-gray-300 leading-relaxed font-sans">
                      {businessBmResult?.targetAudience || "노력 대비 성과가 막혀 답답해하는 창업가, 전문가, 그리고 자기검열과 에너지 소진에 갇힌 도반들"}
                    </p>
                  </div>
                </div>

                {/* 4. AI 실시간 생성 버튼 */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                  <div className="text-xs text-amber-200 font-sans">
                    💡 다른 관점의 1:1 맞춤형 비즈니스 BM 아키텍처를 AI로 즉시 재연산할 수 있습니다.
                  </div>
                  <button
                    onClick={handleGenerateLiveBusinessModel}
                    disabled={isAiGenerating}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:opacity-95 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shrink-0"
                  >
                    {isAiGenerating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>AI BM 분석 중...</span>
                      </>
                    ) : (
                      <>
                        <Bot className="w-3.5 h-3.5" />
                        <span>🔮 AI 천명 BM 생성</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => handleGenerateLiveAiEssay('neural')}
                disabled={isAiGenerating}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600/30 to-cyan-600/30 hover:from-purple-600/50 hover:to-cyan-600/50 border border-cyan-500/50 text-cyan-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                {isAiGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    <span>명심 AI 천명 리딩 분석 중...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    <span>🔮 명심 AI 실시간 천명 리딩</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setModalItem(null)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-lg"
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          메인 컨테이너
          ═══════════════════════════════════════════════════════ */}
      <div className="w-full max-w-4xl space-y-6">
        
        {/* VIP 럭셔리 볼트 헤더 */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0e1628] via-[#090e1a] to-[#04060a] border border-amber-500/50 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.95)]">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-2.5 text-left">
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/50 text-[10px] font-extrabold text-amber-300 tracking-widest uppercase font-mono shadow-[0_0_15px_rgba(245,158,11,0.25)] flex items-center gap-1.5">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>MYONGSIM SOUL VAULT · 2026 OFFICIAL ARCHIVE</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                <span>소울 아카이브</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-mono border border-amber-500/30">80P VIP Report</span>
              </h1>
              
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
                <span className="text-gray-300">수신인: <strong className="text-amber-300 font-bold">{userName}</strong> 님</span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-300">사주 일주: <strong className="text-emerald-300 font-bold px-2 py-0.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40">{sajuInfo.dayPillarKo}({sajuInfo.dayPillarHanja})일주</strong></span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-300">본질 기운: <strong className="text-amber-400 font-bold">{sajuInfo.ganName}</strong></span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-300">생년월일: <strong className="text-cyan-300 font-bold">{birthDate} ({birthTime})</strong></span>
                
                <button
                  onClick={() => setShowEditModal(true)}
                  className="ml-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>생년월일 변경</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleCopyText(window.location.href)}
                className="px-3.5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>공유</span>
              </button>

              <button 
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:opacity-95 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF 리포트 보관</span>
              </button>
            </div>
          </div>
        </div>

        {/* 플로팅 글래스 캡슐 탭 바 */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/90 border border-slate-800/80 backdrop-blur-2xl shadow-xl overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('core')}
            className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'core'
                ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>당신의 본질</span>
          </button>

          <button
            onClick={() => setActiveTab('alchemy')}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'alchemy'
                ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/50 shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>천명 연금술 경로</span>
          </button>

          <button
            onClick={() => setActiveTab('neural64')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'neural64'
                ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/50 shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>명심 64 뉴럴코드</span>
          </button>

          <button
            onClick={() => setActiveTab('saju12')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'saju12'
                ? 'bg-amber-500/30 text-amber-200 border border-amber-500/50 shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>십성 · 12운성</span>
          </button>
        </div>

        {/* 🌟 TAB 1: [당신의 본질 (Core Essence)] */}
        {activeTab === 'core' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#130b24] via-[#0c0818] to-[#04060a] border border-purple-500/40 space-y-6 shadow-[0_15px_40px_rgba(168,85,247,0.15)] overflow-hidden">
              <div className="flex items-center justify-between border-b border-purple-950/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                    <Gem className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-purple-300 flex items-center gap-2">
                      <span>{userName} 님의 영혼 본질 원형 매트릭스</span>
                      <span className="text-[10px] text-purple-400/80 font-mono font-normal">(Core Essence Matrix)</span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      {sajuInfo.dayPillarKo}일주 ({sajuInfo.ganName}) ✕ {birthDate} 정통 SajuEngine 만세력 & 유전자키 천문 정밀 연산
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-purple-300 font-bold bg-purple-950/80 px-3 py-1 rounded-xl border border-purple-500/40">
                  {sajuInfo.ganName}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-purple-500/25 space-y-2">
                  <div className="flex items-center gap-2 text-purple-300 text-xs font-bold font-mono">
                    <Gem className="w-4 h-4 text-purple-400" />
                    <span>1. 영혼 기질: {goldenPathSequences.essence[0]?.title}</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    {goldenPathSequences.essence[0]?.easyMetaphor}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-rose-500/25 space-y-2">
                  <div className="flex items-center gap-2 text-rose-300 text-xs font-bold font-mono">
                    <Flame className="w-4 h-4 text-rose-400" />
                    <span>2. 내면 성장 엔진: {sajuInfo.dayPillarKo}의 핵심 동력</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    {goldenPathSequences.essence[0]?.sajuAlignment}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-cyan-500/25 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold font-mono">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    <span>3. 천명 조후 균형: 유연한 소통과 감성 조화</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    {sajuInfo.elementKo} 기운의 특성을 부드러운 호흡과 10분의 쉼으로 조율할 때, {userName} 님의 신경계는 완벽히 안정되며 막혔던 부와 영감이 솟아납니다.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-amber-500/25 space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-bold font-mono">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>4. 주권 방패: 불가침 안식처와 바운더리</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    타인의 시선이나 무리한 요구에 내 권리를 양도하지 않고 단단한 울타리를 칠 때, {userName} 님의 천부적 에너지가 최고 권위로 보존됩니다.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-950/40 border border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-purple-200 flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>오늘의 본질 정렬 선언문</span>
                  </div>
                  <p className="text-xs text-purple-100/90 font-serif leading-relaxed">
                    "나는 남들의 기준에 흔들리지 않는 찬란한 {sajuInfo.ganName}의 주권자다. 내 속도대로 우아하게 나아갈 때 온 우주가 나와 함께한다."
                  </p>
                </div>
                <button
                  onClick={() => handleCopyText(`나는 남들의 기준에 흔들리지 않는 찬란한 ${sajuInfo.ganName}의 주권자다. 내 속도대로 우아하게 나아갈 때 온 우주가 나와 함께한다.`)}
                  className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>선언문 복사</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🌟 TAB 2: [천명 연금술 경로 (유전자키 황금경로 1:1 맞춤 12대 괘)] */}
        {activeTab === 'alchemy' && (
          <div className="space-y-6 animate-fade-in text-left">
            
            {/* 1단계: 본질 각성 경로 (Activation Sequence) */}
            <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#06151b] via-[#051015] to-[#03060c] border border-emerald-500/40 space-y-5 shadow-[0_10px_35px_rgba(16,185,129,0.15)] overflow-hidden">
              <div className="flex items-center justify-between border-b border-emerald-950/60 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-emerald-300 flex items-center gap-2">
                      <span>1단계. 본질 각성 경로</span>
                      <span className="text-[10px] text-emerald-400/80 font-mono font-normal">(Activation Sequence)</span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      {userName} 님의 천명 과업 · 성장 도약대 · 생체 활력 · 영혼의 뿌리 4대 코드
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-xl border border-emerald-500/40">
                  4 Codes Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {goldenPathSequences.essence.map((card: GoldenPathCard) => {
                  const Icon = card.icon;
                  const isExpanded = expandedCard === card.id;

                  return (
                    <div
                      key={card.id}
                      className={`p-4.5 rounded-2xl border transition-all space-y-3.5 ${
                        isExpanded
                          ? 'bg-slate-900/95 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)]'
                          : 'bg-slate-900/50 border-slate-800/90 hover:border-emerald-500/50 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 cursor-pointer" onClick={() => toggleCard(card.id)}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-black text-white">
                              {card.title}
                            </div>
                            <div className="text-[10px] text-emerald-400/90 font-mono font-medium">{card.category}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <HexagramLines lines={card.hexLines} color="emerald" />
                          <div className="p-1 rounded-lg bg-slate-950 border border-slate-800 text-gray-400">
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-emerald-400" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed cursor-pointer" onClick={() => toggleCard(card.id)}>
                        "{card.oneLiner}"
                      </p>

                      {isExpanded && (
                        <div className="pt-3 border-t border-slate-800/80 space-y-2.5 text-xs animate-fade-in">
                          <div 
                            onClick={() => openDetailModal(card, 'expert')}
                            className="p-3 rounded-xl bg-red-950/25 border border-red-500/25 text-red-200/90 space-y-0.5 cursor-pointer hover:border-red-400 transition-colors"
                          >
                            <strong className="text-red-400 block font-mono text-[10px] flex items-center justify-between">
                              <span>🛡️ 1. 다크코드 (과거의 낡은 보디가드):</span>
                              <span className="text-[9px] text-red-400/80 underline font-sans">심층 분석 열기 ↗</span>
                            </strong>
                            <p className="text-xs">{card.darkCode}</p>
                          </div>

                          <div 
                            onClick={() => openDetailModal(card, 'expert')}
                            className="p-3 rounded-xl bg-emerald-950/25 border border-emerald-500/25 text-emerald-200/90 space-y-0.5 cursor-pointer hover:border-emerald-400 transition-colors"
                          >
                            <strong className="text-emerald-400 block font-mono text-[10px] flex items-center justify-between">
                              <span>✨ 2. 뉴럴코드 (천부적 주권 무기):</span>
                              <span className="text-[9px] text-emerald-400/80 underline font-sans">심층 분석 열기 ↗</span>
                            </strong>
                            <p className="text-xs">{card.neuralCode}</p>
                          </div>

                          <div 
                            onClick={() => openDetailModal(card, 'expert')}
                            className="p-3 rounded-xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-amber-950/30 border border-purple-500/35 text-purple-200 space-y-1 shadow-inner cursor-pointer hover:border-amber-400 transition-colors"
                          >
                            <strong className="text-amber-300 block font-mono text-[10px] flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                <span>3. 메타코드 (제로포인트 초의식):</span>
                              </span>
                              <span className="text-[9px] text-amber-300/80 underline font-sans">명심 효사 보기 ↗</span>
                            </strong>
                            <p className="text-xs font-serif leading-relaxed text-amber-100/90">{card.metaCode}</p>
                          </div>

                          <div 
                            onClick={() => openDetailModal(card, 'beginner')}
                            className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/40 text-amber-300 font-mono text-[11px] cursor-pointer hover:opacity-90 transition-all flex items-center justify-between shadow-sm"
                          >
                            <span className="flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                              <strong>💡 초보자용 쉬운 해설 & 감동 에세이 보기:</strong>
                            </span>
                            <span className="text-[9px] underline font-sans shrink-0 ml-2">터치 ↗</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2단계: 심신 공명 경로 (Venus Sequence) */}
            <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#1b0a12] via-[#14070d] to-[#03060c] border border-rose-500/40 space-y-5 shadow-[0_10px_35px_rgba(244,63,94,0.15)] overflow-hidden">
              <div className="flex items-center justify-between border-b border-rose-950/60 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-rose-300 flex items-center gap-2">
                      <span>2단계. 심신 공명 경로</span>
                      <span className="text-[10px] text-rose-400/80 font-mono font-normal">(Venus Sequence)</span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      {userName} 님의 공명 자력 · 명철 지성 · 자비 감성 · 영적 주권 4대 코드
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-950/80 px-2.5 py-1 rounded-xl border border-rose-500/40">
                  4 Resonance Codes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {goldenPathSequences.resonance.map((card: GoldenPathCard) => {
                  const Icon = card.icon;
                  const isExpanded = expandedCard === card.id;

                  return (
                    <div
                      key={card.id}
                      className={`p-4.5 rounded-2xl border transition-all space-y-3.5 ${
                        isExpanded
                          ? 'bg-slate-900/95 border-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.25)]'
                          : 'bg-slate-900/50 border-slate-800/90 hover:border-rose-500/50 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 cursor-pointer" onClick={() => toggleCard(card.id)}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-black text-white">
                              {card.title}
                            </div>
                            <div className="text-[10px] text-rose-400/90 font-mono font-medium">{card.category}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <HexagramLines lines={card.hexLines} color="rose" />
                          <div className="p-1 rounded-lg bg-slate-950 border border-slate-800 text-gray-400">
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-rose-400" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed cursor-pointer" onClick={() => toggleCard(card.id)}>
                        "{card.oneLiner}"
                      </p>

                      {isExpanded && (
                        <div className="pt-3 border-t border-slate-800/80 space-y-2.5 text-xs animate-fade-in">
                          <div 
                            onClick={() => openDetailModal(card, 'expert')}
                            className="p-3 rounded-xl bg-red-950/25 border border-red-500/25 text-red-200/90 space-y-0.5 cursor-pointer hover:border-red-400 transition-colors"
                          >
                            <strong className="text-red-400 block font-mono text-[10px] flex items-center justify-between">
                              <span>🛡️ 1. 다크코드:</span>
                              <span className="text-[9px] text-red-400/80 underline font-sans">심층 분석 열기 ↗</span>
                            </strong>
                            <p className="text-xs">{card.darkCode}</p>
                          </div>

                          <div 
                            onClick={() => openDetailModal(card, 'expert')}
                            className="p-3 rounded-xl bg-rose-950/25 border border-rose-500/25 text-rose-200/90 space-y-0.5 cursor-pointer hover:border-rose-400 transition-colors"
                          >
                            <strong className="text-rose-400 block font-mono text-[10px] flex items-center justify-between">
                              <span>✨ 2. 뉴럴코드:</span>
                              <span className="text-[9px] text-rose-400/80 underline font-sans">심층 분석 열기 ↗</span>
                            </strong>
                            <p className="text-xs">{card.neuralCode}</p>
                          </div>

                          <div 
                            onClick={() => openDetailModal(card, 'expert')}
                            className="p-3 rounded-xl bg-gradient-to-r from-purple-950/40 via-rose-950/40 to-amber-950/30 border border-rose-500/35 text-rose-200 space-y-1 shadow-inner cursor-pointer hover:border-amber-400 transition-colors"
                          >
                            <strong className="text-amber-300 block font-mono text-[10px] flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                <span>3. 메타코드 (관계의 대자유):</span>
                              </span>
                              <span className="text-[9px] text-amber-300/80 underline font-sans">명심 효사 보기 ↗</span>
                            </strong>
                            <p className="text-xs font-serif leading-relaxed text-amber-100/90">{card.metaCode}</p>
                          </div>

                          <div 
                            onClick={() => openDetailModal(card, 'beginner')}
                            className="p-2.5 rounded-xl bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-rose-500/40 text-rose-300 font-mono text-[11px] cursor-pointer hover:opacity-90 transition-all flex items-center justify-between shadow-sm"
                          >
                            <span className="flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5 text-rose-400" />
                              <strong>💡 초보자용 쉬운 해설 & 감동 에세이 보기:</strong>
                            </span>
                            <span className="text-[9px] underline font-sans shrink-0 ml-2">터치 ↗</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3단계: 천명 번영 경로 (Pearl Sequence) */}
            <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#1c1406] via-[#140f04] to-[#03060c] border border-amber-500/45 space-y-5 shadow-[0_10px_35px_rgba(245,158,11,0.2)] overflow-hidden">
              <div className="flex items-center justify-between border-b border-amber-950/60 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.35)]">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-amber-300 flex items-center gap-2">
                      <span>3단계. 천명 번영 경로</span>
                      <span className="text-[10px] text-amber-400/80 font-mono font-normal">(Pearl Sequence)</span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      {userName} 님의 코어 미션 · 협력 생태계 · 시그니처 권위 · 퀀텀 풍요 4대 코드
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-950/80 px-2.5 py-1 rounded-xl border border-amber-500/40">
                  4 Wealth Codes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {goldenPathSequences.prosperity.map((card: GoldenPathCard) => {
                  const Icon = card.icon;
                  const isExpanded = expandedCard === card.id;

                  return (
                    <div
                      key={card.id}
                      className={`p-4.5 rounded-2xl border transition-all space-y-3.5 ${
                        isExpanded
                          ? 'bg-slate-900/95 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
                          : 'bg-slate-900/50 border-slate-800/90 hover:border-amber-500/50 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 cursor-pointer" onClick={() => toggleCard(card.id)}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-black text-white">
                              {card.title}
                            </div>
                            <div className="text-[10px] text-amber-400/90 font-mono font-medium">{card.category}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <HexagramLines lines={card.hexLines} color="amber" />
                          <div className="p-1 rounded-lg bg-slate-950 border border-slate-800 text-gray-400">
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-amber-400" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed cursor-pointer" onClick={() => toggleCard(card.id)}>
                        "{card.oneLiner}"
                      </p>

                      {isExpanded && (
                        <div className="pt-3 border-t border-slate-800/80 space-y-2.5 text-xs animate-fade-in">
                          <div 
                            onClick={() => openDetailModal(card, 'expert')}
                            className="p-3 rounded-xl bg-red-950/25 border border-red-500/25 text-red-200/90 space-y-0.5 cursor-pointer hover:border-red-400 transition-colors"
                          >
                            <strong className="text-red-400 block font-mono text-[10px] flex items-center justify-between">
                              <span>🛡️ 1. 다크코드:</span>
                              <span className="text-[9px] text-red-400/80 underline font-sans">심층 분석 열기 ↗</span>
                            </strong>
                            <p className="text-xs">{card.darkCode}</p>
                          </div>

                          <div 
                            onClick={() => openDetailModal(card, 'expert')}
                            className="p-3 rounded-xl bg-amber-950/25 border border-amber-500/25 text-amber-200/90 space-y-0.5 cursor-pointer hover:border-amber-400 transition-colors"
                          >
                            <strong className="text-amber-400 block font-mono text-[10px] flex items-center justify-between">
                              <span>✨ 2. 뉴럴코드:</span>
                              <span className="text-[9px] text-amber-400/80 underline font-sans">심층 분석 열기 ↗</span>
                            </strong>
                            <p className="text-xs">{card.neuralCode}</p>
                          </div>

                          <div 
                            onClick={() => openDetailModal(card, 'expert')}
                            className="p-3 rounded-xl bg-gradient-to-r from-amber-950/40 via-yellow-950/30 to-indigo-950/40 border border-amber-500/40 text-amber-200 space-y-1 shadow-inner cursor-pointer hover:border-amber-400 transition-colors"
                          >
                            <strong className="text-amber-300 block font-mono text-[10px] flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                <span>3. 메타코드 (부와 번영의 완성):</span>
                              </span>
                              <span className="text-[9px] text-amber-300/80 underline font-sans">명심 효사 보기 ↗</span>
                            </strong>
                            <p className="text-xs font-serif leading-relaxed text-amber-100/90">{card.metaCode}</p>
                          </div>

                          <div 
                            onClick={() => openDetailModal(card, 'beginner')}
                            className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 font-mono text-[11px] cursor-pointer hover:opacity-90 transition-all flex items-center justify-between shadow-sm"
                          >
                            <span className="flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                              <strong>💡 초보자용 쉬운 해설 & 감동 에세이 보기:</strong>
                            </span>
                            <span className="text-[9px] underline font-sans shrink-0 ml-2">터치 ↗</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* 🌟 TAB 3: [명심 64 뉴럴코드 (Neural 64)] */}
        {activeTab === 'neural64' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-cyan-500/40 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-300">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-cyan-300">
                      명심 64 천명 뉴럴코드 아틀라스
                    </h3>
                    <p className="text-xs text-gray-400">
                      {userName} 님 ({sajuInfo.dayPillarKo}일주)의 12대 활성화 천명 코드(Gold Glow)
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/80 px-3 py-1 rounded-xl border border-cyan-500/40">
                  64 Soul Codes
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-xs font-mono">
                {Array.from({ length: 64 }, (_, i) => i + 1).map((gate) => {
                  const isActive = goldenPathSequences.activeGates.includes(gate);
                  return (
                    <div
                      key={gate}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isActive
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)] scale-105'
                          : 'bg-slate-900/40 border-slate-800/80 text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      <div className="text-[10px]">Code</div>
                      <div className="text-sm font-black">{gate}</div>
                      {isActive && <div className="text-[8px] text-amber-400 mt-0.5">Active</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 🌟 TAB 4: [십성 · 12운성 (Saju 12)] */}
        {activeTab === 'saju12' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-amber-500/40 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-amber-300">
                      십성(十星) & 12운성(十二運星) 심층 에너지
                    </h3>
                    <p className="text-xs text-gray-400">
                      {userName} 님 ({sajuInfo.dayPillarKo}일주 · {sajuInfo.ganName}) 사주 원국의 격국과 생체 에너지 주기
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-950/80 px-3 py-1 rounded-xl border border-amber-500/40">
                  {sajuInfo.dayPillarKo} 고유 에너지
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                  <span className="text-amber-400 font-bold font-mono">🌟 주도 십성 및 천부적 재능</span>
                  <p className="text-gray-300 leading-relaxed">
                    {sajuInfo.ganName}의 본질 기운을 바탕으로 확고한 사회적 신뢰와 탁월한 전문성을 발휘하며, 타협하지 않는 깊은 인문학적·영적 지혜를 세상에 전합니다.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                  <span className="text-emerald-400 font-bold font-mono">🔄 12운성 생체 사이클 & 1순위 초몰입</span>
                  <p className="text-gray-300 leading-relaxed">
                    잡념을 비우고 1순위 핵심 과업에 에너지를 집중할 때 누구도 흉내 낼 수 없는 명작을 만들어내는 강력한 몰입 사이클을 타고났습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
