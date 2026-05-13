'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ServerCrash, Wrench, ChevronRight, Activity, Terminal, Calendar as CalendarIcon, Shield, Zap, Info, ChevronDown, BrainCircuit, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Solar } from 'lunar-javascript';
import { DAILY_AKASHIC_DB } from '@/data/DailyAkashicDB';

// ==========================================
// 1. 아카식 캘린더 프리미엄 셀프 코칭 딕셔너리 (10천간 유니버설)
// ==========================================


// ==========================================
// 2. 아카식 캘린더 프리미엄 셀프 코칭 딕셔너리 (10천간 유니버설)
// ==========================================
const PREMIUM_COACHING: Record<string, any> = {
  '甲': {
    danger: { targetGan: '庚', title: '칠살(七殺) 가동 - 강제 절단 및 충돌 위험', cause: '하늘을 향해 곧게 자라려는 당신(甲)의 코어를, 예리한 도끼(庚)가 사정없이 내려치는 날입니다.', action: '타인의 억지스러운 요구사항이나 날 선 비판이 당신의 자존심을 긁을 수 있습니다. 오늘 당신이 가장 먼저 해야 할 일은 \'반박(Response)\'이 아니라 \'무시(Mute)\'입니다. 억울하더라도 맞서 싸우지 마세요. 시스템을 끄고 일찍 잠자리에 드는 것만이 치명적인 런타임 에러를 막는 유일한 백신입니다.' },
    warning: { targetGan: '乙', title: '겁재(劫財) 가동 - 리소스 탈취 및 비교 주의', cause: '나의 양분을 나누어 먹는 덩굴(乙)이 내 몸(甲)을 감고 올라오는 날입니다.', action: '가까운 동료나 지인에게 성과를 뺏기거나 불필요한 금전 지출이 발생할 수 있습니다. 오늘은 누구의 부탁도 함부로 수락하지 말고 "내 코어 리소스" 방어에만 전념하십시오.' },
    green: { targetGan: '己', title: '갑기합(甲己合) - 완벽한 시스템 동기화 및 성과 창출', cause: '곧게 뻗은 나무(甲)가 뿌리를 내릴 수 있는 가장 비옥한 땅(己)을 만나 완벽한 동기화가 이루어졌습니다.', action: '평소 뻑뻑하게 돌아가던 인간관계나 업무의 병목 현상이 마법처럼 해결되는 타이밍입니다. 망설였던 계약, 중요한 미팅, 새로운 기획의 배포(Deploy)를 과감하게 실행하십시오. 모든 트래픽이 당신을 돕습니다.' }
  },
  '乙': {
    danger: { targetGan: '辛', title: '칠살(七殺) 가동 - 날카로운 절단 및 스트레스', cause: '유연하게 뻗어가는 덩굴(乙)을 예리한 가위(辛)가 가차 없이 잘라내는 형국입니다.', action: '오늘 들어오는 피드백은 뼈를 때리다 못해 심장을 후벼 팔 수 있습니다. 하지만 거기에 감정적으로 대응하면 당신의 뿌리마저 뽑힙니다. 상대의 날 선 비판을 그저 "단순한 버그 리포트"로 여기고 감정 회로를 완전히 차단하십시오.' },
    warning: { targetGan: '甲', title: '겁재(劫財) 가동 - 의존성 과다 및 주도권 상실', cause: '내가 의지하고 싶어지는 크고 단단한 나무(甲)가 나타나 나의 자생력을 빼앗는 날입니다.', action: '남의 뒤에 숨어서 편하게 가고 싶은 유혹이 강해집니다. 하지만 오늘은 타인에게 의사결정을 위탁하면 반드시 손해를 봅니다. 두렵더라도 단독 연산(독립적 결정)을 실행하십시오.' },
    green: { targetGan: '庚', title: '을경합(乙庚合) - 룰과 유연성의 완벽한 조화', cause: '부드러운 유연성(乙)이 단단한 원칙(庚)을 만나 시스템의 밸런스가 극대화되는 날입니다.', action: '조직 내에서 당신의 부드러운 카리스마가 엄청난 힘을 발휘합니다. 강압적인 상사나 까다로운 클라이언트를 설득하기에 가장 좋은 날이니, 적극적으로 커뮤니케이션 포트를 개방하십시오.' }
  },
  '丙': {
    danger: { targetGan: '壬', title: '칠살(七殺) 가동 - 강력한 압박 및 빛의 차단', cause: '세상을 비추는 태양(丙) 위로 거대한 먹구름과 폭우(壬)가 쏟아져 빛을 가리는 날입니다.', action: '오늘은 당신의 매력과 능력이 제대로 평가받지 못하고 무시당하는 느낌을 받을 수 있습니다. 억지로 빛나려고 발버둥 치지 마십시오. 오늘 하루는 철저히 로우키(Low-key) 모드로 전환하여 백그라운드 작업에만 몰두하는 것이 유리합니다.' },
    warning: { targetGan: '丁', title: '겁재(劫財) 가동 - 과열 경쟁 및 리소스 낭비', cause: '태양(丙)이 떠 있는데 인공 조명(丁)까지 켜져서 불필요한 열기와 경쟁심이 과열되는 날입니다.', action: '"내가 더 잘났어"를 증명하기 위해 무리한 오버클럭(Overclock)을 돌리지 마십시오. 타인의 칭찬에 연연하지 말고 나만의 페이스를 유지해야 배터리 방전을 막을 수 있습니다.' },
    green: { targetGan: '辛', title: '병신합(丙辛合) - 권위와 예리함의 동기화', cause: '강렬한 열기(丙)가 정밀한 보석(辛)을 만나 가치를 한 단계 더 끌어올리는 날입니다.', action: '당신의 열정이 누군가의 차가운 이성과 완벽한 시너지를 냅니다. 이성적인 조언자를 곁에 두고 새로운 아이디어를 검증받으세요. 완벽한 결과물(Output)이 보장됩니다.' }
  },
  '丁': {
    danger: { targetGan: '癸', title: '칠살(七殺) 가동 - 멘탈 붕괴 및 열기 소멸', cause: '집중해서 타오르는 촛불(丁)에 차가운 빗물(癸)이 떨어져 심지가 꺼질 위험이 큽니다.', action: '누군가의 차가운 한마디에 심장이 쿵 내려앉고 우울감이 시스템을 장악할 수 있습니다. 오늘은 절대 자책(Self-Blame) 프로세스를 가동하지 마십시오. 당신의 잘못이 아니라 그냥 비가 오는 날일 뿐입니다. 따뜻한 차 한 잔으로 내면의 온도를 지키세요.' },
    warning: { targetGan: '丙', title: '겁재(劫財) 가동 - 존재감 상실 및 위축', cause: '은은한 달빛(丁) 옆에 강렬한 태양(丙)이 떠올라 나의 존재감이 지워지는 날입니다.', action: '주목받는 타인을 질투하거나 위축되지 마십시오. 낮에는 태양이, 밤에는 달이 시스템의 주도권을 잡습니다. 조급해하지 말고 나의 시간(밤)이 올 때까지 데이터를 차분히 정비하십시오.' },
    green: { targetGan: '壬', title: '정임합(丁壬合) - 은밀하고 생산적인 연결', cause: '따뜻한 불빛(丁)이 넓은 바다(壬) 위를 비추며 낭만적이고 생산적인 조화를 이룹니다.', action: '아이디어가 솟구치고 매력이 돋보이는 날입니다. 하지만 공적인 성과보다는 사적인 친목이나 은밀한 기획(비공개 프로젝트)에 트래픽을 집중할 때 훨씬 큰 영감을 얻을 수 있습니다.' }
  },
  '戊': {
    danger: { targetGan: '甲', title: '칠살(七殺) 가동 - 강력한 통제 및 한계 봉착', cause: '단단하고 움직이지 않는 거대한 산(戊)을, 강한 뿌리를 가진 나무(甲)가 파고드는 형국입니다.', action: '기존의 방식(레거시)을 무시하고 완전히 새로운 룰을 강요받아 엄청난 스트레스가 몰려옵니다. 방어막을 치고 고집을 부리면 산사태(시스템 붕괴)가 납니다. 오늘은 상대의 요구를 "일단 수용"하는 유연한 패치가 필요합니다.' },
    warning: { targetGan: '己', title: '겁재(劫財) 가동 - 자원 분산 및 영역 침범', cause: '나의 거대한 영역(戊)에 타인의 땅(己)이 섞여들어 경계가 모호해지는 날입니다.', action: '공과 사, 혹은 내 일과 남의 일이 섞여서 내가 손해를 보며 덤터기를 쓸 수 있습니다. 오늘만큼은 철저히 접근 권한(Permission) 설정을 까다롭게 하여 오지랖을 부리지 마십시오.' },
    green: { targetGan: '癸', title: '무계합(戊癸合) - 메마른 대지의 해갈과 성과', cause: '건조한 대지(戊)에 부드러운 비(癸)가 내려 시스템의 건조함이 완벽히 해결되는 날입니다.', action: '그동안 노력해 왔지만 성과가 없던 일들이 드디어 결실(재물, 보상)을 맺기 시작합니다. 오늘은 혼자만의 동굴에서 나와 세상과 적극적으로 동기화(Sync)하여 기회를 모두 쓸어 담으십시오.' }
  },
  '己': {
    danger: { targetGan: '乙', title: '칠살(七殺) 가동 - 신경 쇠약 및 무단 점유', cause: '내가 정성껏 가꾼 비옥한 밭(己)에 잡초(乙)가 무성하게 자라나 영양분을 모두 뺏는 상황입니다.', action: '여기저기서 나를 찾는 귀찮은 트래픽이 폭주하여 신경이 극도로 날카로워집니다. "좋은 사람"이 되려는 강박을 당장 버리세요. 오늘 당신의 1순위 행동 지침은 "거절(Access Denied)"입니다.' },
    warning: { targetGan: '戊', title: '겁재(劫財) 가동 - 압도당함 및 성과 뺏김', cause: '작은 텃밭(己) 옆에 거대한 산(戊)이 들어서서 그늘이 지고 성과가 묻히는 날입니다.', action: '열심히 연산(일)은 내가 다 하고, 크레딧(칭찬)은 남이 가져갈 수 있습니다. 억울해하지 말고 오늘은 방어적으로 기본 유지보수(Maintenance)에만 집중하십시오.' },
    green: { targetGan: '甲', title: '갑기합(甲己合) - 안정적인 협속 및 신뢰 구축', cause: '비옥한 대지(己) 위로 크고 튼튼한 나무(甲)가 뿌리를 내려 완벽한 안정을 이룹니다.', action: '오늘은 당신의 포용력이 빛을 발하여 중요한 사람과의 신뢰(Trust) 네트워크가 견고하게 구축됩니다. 공적인 문서 작업, 계약, 리더와의 면담 등에서 최상의 결과를 얻을 수 있습니다.' }
  },
  '庚': {
    danger: { targetGan: '丙', title: '칠살(七殺) 가동 - 강제 제련 및 멘탈 과부하', cause: '제련되지 않은 강철(庚)을 용광로(丙)에 집어넣어 강제로 녹여버리는 극단적 환경입니다.', action: '엄청난 압박감과 강제적인 환경 변화가 시스템을 강타합니다. 이 고통은 당신을 명검으로 만들기 위한 필수 렌더링 과정입니다. 피하지 마십시오. 깨지고 녹아내리는 것을 두려워하지 않는 자만이 업그레이드됩니다.' },
    warning: { targetGan: '辛', title: '겁재(劫財) 가동 - 날카로운 신경전 및 스파크', cause: '원석(庚)과 완성된 보석(辛)이 부딪혀 불꽃이 튀고 서로에게 상처를 입히는 날입니다.', action: '말 한마디에 가시가 돋치고 불필요한 논쟁(Debate)이 발생하기 쉽습니다. 내가 맞더라도 끝까지 이기려 들지 마세요. 이겨도 결국 시스템에 스크래치만 남는 소모전일 뿐입니다.' },
    green: { targetGan: '乙', title: '을경합(乙庚合) - 강함과 부드러움의 최적화', cause: '단단하고 무뚝뚝한 원칙(庚)이 유연한 타협(乙)을 만나 완벽한 인터페이스를 갖추는 날입니다.', action: '오늘은 당신 특유의 딱딱함을 버리고 조금은 부드럽게 웃어보세요. "안 됩니다" 대신 "한번 맞춰보겠습니다"라고 말하는 순간, 막혀있던 트래픽이 시원하게 뚫리며 성과가 쏟아집니다.' }
  },
  '辛': {
    danger: { targetGan: '丁', title: '칠살(七殺) 가동 - 시스템 그을림 및 화병', cause: '이미 완벽하게 세공된 보석(辛)을 불(丁)로 다시 그을려 가치를 훼손하는 날입니다.', action: '사소한 일에 자존심이 심하게 상하고 내부에서 화병(Error 500)이 발생합니다. 오늘 당신의 분노는 합리적인 방어기제가 아니라 오작동입니다. 그 어떤 중요한 이슈라도 하루 뒤로 미루고 즉시 물리적 쿨링(수면)을 실행하세요.' },
    warning: { targetGan: '庚', title: '겁재(劫財) 가동 - 억지스러움과 강압에 의한 상처', cause: '정밀한 마이크로칩(辛) 옆에 무식한 망치(庚)가 떨어져 회로가 박살 날 위험이 있습니다.', action: '무식하게 밀어붙이는 타인 때문에 섬세한 당신의 멘탈이 크게 상할 수 있습니다. 그들과 논리적으로 싸우려 하지 마세요. 그저 방화벽을 닫고 물리적인 거리를 두는 것이 정답입니다.' },
    green: { targetGan: '丙', title: '병신합(丙辛合) - 스포트라이트 및 위상 강화', cause: '정밀한 보석(辛) 위로 강렬한 빛(丙)이 쏟아져 당신의 가치가 세상에 완벽하게 렌더링 됩니다.', action: '당신의 예리한 통찰력과 기획력이 마침내 올바른 평가를 받게 됩니다. 숨지 말고 무대 위로 올라가 당신의 능력을 마음껏 프리젠테이션(Presentation) 하십시오. 성공률 100%입니다.' }
  },
  '壬': {
    danger: { targetGan: '戊', title: '칠살(七殺) 가동 - 강제 통제 및 흐름의 차단', cause: '자유롭게 흘러야 할 거대한 바다(壬)를, 거대한 흙더미(戊)가 막아버리는 셧다운 상황입니다.', action: '하고 싶은 일은 많은데 환경이 허락하지 않아 극심한 답답함(Timeout)을 느낍니다. 억지로 제방을 부수려 하지 마십시오. 오늘은 에너지를 비축하며 다음 패치(기회)를 기다리는 것이 훌륭한 전략입니다.' },
    warning: { targetGan: '癸', title: '겁재(劫財) 가동 - 방향성 상실 및 과잉 팽창', cause: '바다(壬)에 폭우(癸)가 쏟아져 수위를 조절하지 못하고 주변을 모두 휩쓸어버리는 날입니다.', action: '자만심이 하늘을 찌르고 오지랖이 넓어져 일을 수습할 수 없게 커집니다. 오늘은 새로운 브랜치(Branch)를 따지 말고, 무조건 기존의 메인 코드만 점검하며 수비적으로 하루를 보내야 합니다.' },
    green: { targetGan: '丁', title: '정임합(丁壬合) - 창조적 영감 및 유대감 형성', cause: '거대한 어둠(壬) 속에서 은은한 불빛(丁)을 발견하여 새로운 영감의 코드가 컴파일되는 날입니다.', action: '상상력과 직관력이 극한으로 치솟습니다. 예술적 창작, 새로운 기획, 혹은 연인과의 깊은 소통에 배터리를 100% 집중하십시오. 이성적인 판단보다는 감각적인 결정이 무조건 옳습니다.' }
  },
  '癸': {
    danger: { targetGan: '己', title: '칠살(七殺) 가동 - 시스템 오염 및 극심한 스트레스', cause: '맑게 스며들어야 할 이슬(癸)이 진흙탕(己)과 섞여 흙탕물이 되어버리는 치명적 오염입니다.', action: '타인의 부정적인 감정이나 골치 아픈 문제에 휩쓸려 내 멘탈 램프(RAM)마저 탁해집니다. 오늘 누군가 하소연을 시작하면 즉각적으로 오디오 인터페이스를 음소거(Mute) 하십시오. 남의 쓰레기를 내 시스템에 담지 마세요.' },
    warning: { targetGan: '壬', title: '겁재(劫財) 가동 - 휩쓸림 및 자아 상실', cause: '조용히 내리던 비(癸)가 거대한 해일(壬)을 만나 내가 누구인지 방향성을 잃는 날입니다.', action: '주변 분위기나 타인의 거대한 주장에 휩쓸려 원하지 않는 결정을 내리게 됩니다. "다들 그렇게 하니까"라는 말은 가장 위험한 악성 코드입니다. 오직 내 코어의 목소리에만 귀를 기울이세요.' },
    green: { targetGan: '戊', title: '무계합(戊癸合) - 안정적 결속 및 목표 컴파일', cause: '안개(癸)가 거대한 산(戊)을 감싸 안으며 아름답고 신비로운 결과를 렌더링하는 날입니다.', action: '불안했던 마음이 가라앉고 단단한 안정감이 깃듭니다. 나를 지지해 줄 든든한 조력자나 시스템을 만나게 됩니다. 기회가 오면 주저하지 말고 꽉 붙잡으십시오. 당신의 성장을 위한 완벽한 발판이 되어줄 것입니다.' }
  }
};

// 동적 월별 캘린더 생성기
const generateCurrentMonthForecast = (dayMaster: string) => {
  const rules = PREMIUM_COACHING[dayMaster] || PREMIUM_COACHING['甲'];
  
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const currentDay = now.getDate();
  
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0: 일, 1: 월 ...

  const calendarDays = [];

  for (let date = 1; date <= daysInMonth; date++) {
    const solar = Solar.fromYmdHms(year, month, date, 12, 0, 0);
    const bazi = solar.getLunar().getEightChar();
    const gan = bazi.getDayGan();
    const zhi = bazi.getDayZhi();

    let status = 'safe';
    let detailData: any = null;

    if (gan === rules.danger.targetGan) {
      status = 'danger';
      detailData = rules.danger;
    } else if (gan === rules.warning.targetGan) {
      status = 'warning';
      detailData = rules.warning;
    } else if (gan === rules.green.targetGan) {
      status = 'green';
      detailData = rules.green;
    }

    // 신(辛)금 유저를 위한 특별한 복합 충돌 처리 로직
    if (dayMaster === '辛') {
      if (zhi === '寅' && gan === '丙') {
        status = 'danger';
        detailData = {
          title: '🚨 병신합(丙) + 인사신 삼형(寅) 동시 발생',
          cause: '시스템 합(合)으로 외부 트래픽이 몰려든 상태에서 코어 하드웨어 연쇄 충돌(형살)이 발생했습니다.',
          action: '최악의 시스템 충돌일입니다. 즉시 방화벽을 올리고 외부와의 접촉을 차단한 채 로컬 환경으로 대피하십시오.'
        };
      } else if (zhi === '寅') {
        status = 'danger';
        detailData = { title: '인사신 삼형(寅巳申 三刑)', cause: '하드웨어 연쇄 충돌 발생', action: '심각한 런타임 에러 주의. 오프라인 모드로 전환하세요.' };
      } else if (zhi === '亥') {
        status = 'danger';
        detailData = { title: '사해충(巳亥沖)', cause: '코어 커널 타격', action: '감정 기복 극대화. 감정적 결정을 절대 미루세요.' };
      } else if (zhi === '卯') {
        status = 'warning';
        detailData = { title: '묘신 귀문(卯申 鬼門)', cause: '극심한 예민함과 오버띵킹', action: '메모리 누수 발생 중. 복잡한 생각을 리셋하세요.' };
      } else if (zhi === '酉') {
        status = 'green';
        detailData = { title: '사유합(巳酉合)', cause: '하드웨어 냉각 완료', action: '예리한 이성이 돋보이는 날. 중요한 기획을 시작하세요.' };
      }
    }

    calendarDays.push({
      date,
      gan,
      zhi,
      status,
      detailData
    });
  }

  return { year, month, currentDay, firstDayOfWeek, calendarDays };
};

const STATUS_INFO: Record<string, { color: string, label: string, desc: string }> = {
  'danger': { color: 'bg-red-500', label: 'RED ZONE (시스템 셧다운 위험)', desc: '특이 사항이 발견되었습니다. 하단 브리핑을 확인하세요.' },
  'warning': { color: 'bg-amber-400', label: 'YELLOW ZONE (메모리 누수 주의)', desc: '특이 사항이 발견되었습니다. 하단 브리핑을 확인하세요.' },
  'green': { color: 'bg-emerald-400', label: 'GREEN ZONE (네트워크 최적화)', desc: '특이 사항이 발견되었습니다. 하단 브리핑을 확인하세요.' },
  'safe': { color: 'bg-slate-700', label: 'NORMAL (평시 트래픽)', desc: '특이 사항 없는 평온한 백그라운드 프로세스가 가동됩니다. 루틴에 집중하십시오.' }
};

// ==========================================
// 2. 메인 컴포넌트
// ==========================================
export default function AkashicRecordSection({ 
  dayMasterHanja,
  sajuData,
  harmony,
  biorhythm
}: { 
  dayMasterHanja?: string | null;
  sajuData?: any;
  harmony?: any;
  biorhythm?: any;
}) {
  const [viewMode, setViewMode] = useState<'post-mortem' | 'forecast'>('post-mortem');
  const [expandedAction, setExpandedAction] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [aiCoachingCache, setAiCoachingCache] = useState<Record<number, string>>({});
  const [isCoachingLoading, setIsCoachingLoading] = useState(false);
  const masterKey = dayMasterHanja || '辛';
  
  // 일진 십성 기반으로 아카식 데이터 가져오기
  const tenGod = harmony?.tenGod || '비견';
  const data = DAILY_AKASHIC_DB[tenGod] || DAILY_AKASHIC_DB['비견'];
  
  // 현재 월의 달력 데이터를 동적으로 렌더링마다 가져옵니다 (useMemo를 써도 좋지만 비용이 크지 않음)
  const { year, month, currentDay, firstDayOfWeek, calendarDays } = React.useMemo(() => generateCurrentMonthForecast(masterKey), [masterKey]);

  // 최초 렌더링 시 선택된 날짜를 오늘 날짜로 세팅
  useEffect(() => {
    setSelectedDay(currentDay);
  }, [currentDay]);

  // AI 실시간 융합 코칭 패치 로직
  useEffect(() => {
    const fetchAiCoaching = async () => {
      const selectedData = calendarDays.find(d => d.date === selectedDay);
      // 디테일 데이터가 없거나, 이미 캐시에 있으면 패스
      if (!selectedData?.detailData || aiCoachingCache[selectedDay]) return;

      setIsCoachingLoading(true);
      try {
        const res = await fetch('/api/akashic-coach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sajuData,
            biorhythm,
            calendarDay: selectedData
          })
        });
        const json = await res.json();
        if (json.reply) {
          setAiCoachingCache(prev => ({ ...prev, [selectedDay]: json.reply }));
        }
      } catch (err) {
        console.error('Failed to fetch AI coaching:', err);
      } finally {
        setIsCoachingLoading(false);
      }
    };

    if (viewMode === 'forecast') {
      fetchAiCoaching();
    }
  }, [selectedDay, viewMode, calendarDays, sajuData, biorhythm, aiCoachingCache]);

  // Markdown 렌더러
  const renderers = {
    strong: ({ node, ...props }: any) => {
      const text = props.children?.toString() || '';
      if (text.includes('Error') || text.includes('상관') || text.includes('루프') || text.includes('경직') || text.includes('모순') || text.includes('고립')) {
         return <strong className="font-bold text-red-400 bg-red-950/40 px-1.5 py-0.5 rounded border border-red-500/20 text-[13px] tracking-wide mx-0.5 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" {...props} />;
      }
      return <strong className="font-bold text-white bg-white/10 px-1.5 py-0.5 rounded text-[13px] tracking-wide mx-0.5" {...props} />;
    },
    p: ({ node, ...props }: any) => <p className="text-[13px] text-slate-300/90 leading-relaxed mb-4 break-keep" {...props} />,
    ul: ({ node, ...props }: any) => <ul className="space-y-4 mb-6 ml-1 p-4 bg-[#0a0f18] rounded-xl border border-white/5 shadow-inner" {...props} />,
    li: ({ node, ...props }: any) => <li className="text-[12.5px] text-slate-300 leading-relaxed flex items-start gap-2"><span className="text-cyan-500 mt-0.5 font-bold shrink-0">▹</span><div className="flex-1" {...props} /></li>,
  };

  return (
    <div className="space-y-5">
      {/* 🚀 상단 서브 탭 (Post-Mortem vs Forecast) */}
      <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/10">
        <button
          onClick={() => setViewMode('post-mortem')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] font-bold transition-all duration-300 ${
            viewMode === 'post-mortem' 
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <Activity className="w-4 h-4" />
          디버깅 리포트
        </button>
        <button
          onClick={() => setViewMode('forecast')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] font-bold transition-all duration-300 ${
            viewMode === 'forecast' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          트래픽 캘린더
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ================================================== */}
        {/* VIEW 1: POST-MORTEM (디버깅 리포트 & 아코디언) */}
        {/* ================================================== */}
        {viewMode === 'post-mortem' && (
          <motion.div key="post-mortem" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-5">
            
            {/* Trigger Alert */}
            <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/50 animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-widest text-red-400 font-bold">[시스템 알림] 과거의 치명적 에러 로그가 존재합니다.</p>
                </div>
              </div>
              <div className="bg-black/40 rounded-xl p-4 font-mono text-[11.5px] text-slate-300 space-y-2.5 border border-red-500/10">
                <div className="flex gap-3"><span className="text-slate-500 shrink-0">발생일시:</span> <span className="text-white">{data.triggerDate}</span></div>
                <div className="flex gap-3"><span className="text-slate-500 shrink-0">에러코드:</span> <span className="text-red-400 font-bold drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">{data.errorCode}</span></div>
              </div>
            </div>

            {/* SCAN & SYNC */}
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-5 border-b border-white/10 pb-4">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h2 className="text-[14px] font-black text-white tracking-wide uppercase">명심코칭 디버깅 리포트 <span className="text-cyan-500 font-normal">| SCAN & SYNC</span></h2>
              </div>
              <div className="prose prose-invert prose-sm max-w-none">
                <h3 className="text-[13px] font-bold text-cyan-400 mb-2 flex items-center gap-2"><span className="w-1.5 h-4 bg-cyan-500 rounded-sm"></span>[1] 왜 시스템은 경고하지 못했는가?</h3>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={renderers}>{data.scanSync}</ReactMarkdown>
              </div>
            </div>

            {/* SHIFT (Action Plan 아코디언) */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 overflow-hidden">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
                  <Wrench className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-[14px] font-black text-emerald-400 tracking-wide">[시스템 로직 업데이트 완료 🔄]</h2>
                </div>
              </div>
              <p className="text-[12.5px] text-slate-300 mb-4 font-bold bg-white/5 p-3 rounded-lg border border-white/5 border-l-2 border-l-emerald-500">
                ⚠️ {data.shiftCurrent}
              </p>

              <div className="space-y-3 mt-4">
                <span className="inline-block px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-sm mb-1 uppercase tracking-widest">Action Plan (클릭하여 셀프 자각 가이드 열기)</span>
                
                {data.shiftActions.map((action: any, i: number) => {
                  const isExpanded = expandedAction === i;
                  return (
                    <div key={i} className={`rounded-xl border transition-all duration-300 ${isExpanded ? 'bg-black/60 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-white/5 border-white/5 hover:border-emerald-500/20 cursor-pointer'}`}>
                      <button 
                        onClick={() => setExpandedAction(isExpanded ? null : i)}
                        className="w-full flex items-start gap-3 p-4 text-left"
                      >
                        <span className="text-emerald-400 font-mono text-[12px] font-black mt-0.5">0{i+1}</span>
                        <p className={`flex-1 text-[13px] font-bold transition-colors ${isExpanded ? 'text-emerald-400' : 'text-slate-200'}`}>{action.summary}</p>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 mt-0.5 ${isExpanded ? 'rotate-180 text-emerald-400' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-1 ml-7 border-l-2 border-emerald-500/30 pl-4 mb-2">
                              <p className="text-[12.5px] text-slate-300 leading-relaxed font-medium bg-emerald-950/20 p-3 rounded-r-lg border border-emerald-500/10">
                                <span className="text-emerald-400 font-bold mb-1 block">💡 코치의 속삭임:</span>
                                {action.details}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ================================================== */}
        {/* VIEW 2: FORECAST (트래픽 예측 캘린더) */}
        {/* ================================================== */}
        {viewMode === 'forecast' && (
          <motion.div key="forecast" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-5">
            
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50">
                    <Shield className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-[14px] font-black text-cyan-400 tracking-wide">보안 트래픽 예측 레이더</h2>
                    <p className="text-[11px] text-slate-400">{year}년 {month}월 ({masterKey}일간 동기화됨)</p>
                  </div>
                </div>
              </div>

              {/* 캘린더 그리드 */}
              <div className="grid grid-cols-7 gap-1.5 mb-6">
                {['일','월','화','수','목','금','토'].map(day => (
                  <div key={day} className="text-center text-[10px] font-bold text-slate-500 pb-2">{day}</div>
                ))}
                
                {/* 월 시작 오프셋 빈칸 생성 */}
                {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="aspect-square"></div>
                ))}
                
                {calendarDays.map((day) => {
                  const isSelected = selectedDay === day.date;
                  const colorClass = day.status === 'danger' ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]' :
                                     day.status === 'warning' ? 'bg-amber-400/20 text-amber-400 border-amber-400/50' :
                                     day.status === 'green' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]' :
                                     'bg-slate-800 text-slate-300 border-transparent';
                  
                  const activeRing = isSelected ? 'ring-2 ring-white/50 ring-offset-2 ring-offset-slate-900' : '';

                  return (
                    <button
                      key={day.date}
                      onClick={() => setSelectedDay(day.date)}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center border transition-all duration-200 ${colorClass} ${activeRing} hover:scale-105 relative`}
                    >
                      <span className="text-[12px] font-bold font-mono">{day.date}</span>
                      {day.status !== 'safe' && (
                        <div className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${
                          day.status === 'danger' ? 'bg-red-400 animate-ping' :
                          day.status === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 하단 Threat Intel 팝업 패널 */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedDay}
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                  className="bg-black/40 rounded-xl p-4 border border-white/5"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="mt-0.5">
                         {calendarDays.find(d => d.date === selectedDay)?.status === 'danger' ? <AlertTriangle className="w-5 h-5 text-red-400" /> :
                          calendarDays.find(d => d.date === selectedDay)?.status === 'warning' ? <Info className="w-5 h-5 text-amber-400" /> :
                          calendarDays.find(d => d.date === selectedDay)?.status === 'green' ? <Zap className="w-5 h-5 text-emerald-400" /> :
                          <Terminal className="w-5 h-5 text-slate-400" />}
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-white mb-1">
                          {month}월 {selectedDay}일 
                          <span className="ml-2 text-[11px] px-2 py-0.5 rounded-sm bg-white/10 font-mono">
                            {STATUS_INFO[calendarDays.find(d => d.date === selectedDay)?.status || 'safe'].label}
                          </span>
                        </h4>
                      </div>
                    </div>
                    
                    {/* 프리미엄 셀프 코칭 UI 렌더링 영역 */}
                    {calendarDays.find(d => d.date === selectedDay)?.detailData ? (
                      <div className="space-y-3 mt-1 pl-8">
                        <h5 className={`text-[13px] font-black ${
                            calendarDays.find(d => d.date === selectedDay)?.status === 'danger' ? 'text-red-400' :
                            calendarDays.find(d => d.date === selectedDay)?.status === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                          {calendarDays.find(d => d.date === selectedDay)?.detailData.title}
                        </h5>
                        <div className="bg-black/30 rounded-lg p-3 border border-white/5 space-y-2">
                          <p className="text-[12px] text-slate-300 leading-relaxed">
                            <span className="text-white font-bold block mb-1">🔍 [에러 원인]</span>
                            {calendarDays.find(d => d.date === selectedDay)?.detailData.cause}
                          </p>
                          <div className="h-px w-full bg-white/5 my-2"></div>
                          
                          <div className="text-[12px] text-slate-300 leading-relaxed">
                            <span className="text-cyan-400 font-bold block mb-1 flex items-center gap-1.5">
                              <BrainCircuit className="w-3.5 h-3.5" />
                              [Live Sync 융합 코칭 지침]
                            </span>
                            {isCoachingLoading && !aiCoachingCache[selectedDay] ? (
                              <div className="flex items-center gap-2 mt-2 py-1">
                                <Loader2 className="w-3 h-3 text-cyan-500 animate-spin" />
                                <span className="text-[11px] text-cyan-400/70 animate-pulse font-mono tracking-widest">ANALYZING BIOSYNC DATA...</span>
                              </div>
                            ) : (
                              <div className="mt-1 text-cyan-50/90 leading-relaxed break-keep border-l-2 border-cyan-500/30 pl-2">
                                {aiCoachingCache[selectedDay] || calendarDays.find(d => d.date === selectedDay)?.detailData.action}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[12px] text-slate-400 leading-relaxed pl-8">
                        {STATUS_INFO[calendarDays.find(d => d.date === selectedDay)?.status || 'safe'].desc}
                      </p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="flex gap-4 px-4">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"/><span className="text-[10px] text-slate-400">RED ZONE</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-400"/><span className="text-[10px] text-slate-400">YELLOW</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"/><span className="text-[10px] text-slate-400">GREEN ZONE</span></div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
