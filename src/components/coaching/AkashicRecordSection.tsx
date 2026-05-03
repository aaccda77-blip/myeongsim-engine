'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ServerCrash, Wrench, ChevronRight, Activity, Terminal, Calendar as CalendarIcon, Shield, Zap, Info, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ==========================================
// 1. 10천간(일간) 기반 동적 Post-Mortem 딕셔너리 (초고도화)
// ==========================================
const POST_MORTEM_DICT: Record<string, any> = {
  '甲': {
    triggerDate: '최근 비견(比肩) 과부하 주간',
    errorCode: '[Error 503: Service Unavailable] 고립 및 자원 고갈',
    trigger: '비견(比肩) 프로세스 발동 + 타협 없는 독단적 직진(木) 투입',
    scanSync: `당시 시스템은 외부의 환경적 압박(관살)만을 위험 지표로 스캔했습니다. 하지만 해당 에러는 외부의 공격이 아닌, **'스스로 주변 모듈과의 동기화를 차단하고 고립을 자초한 단독 실행(Standalone)'**이었습니다.\n\n**[2] Root Cause (근본 원인 분석)**\n* **비견(比肩)의 독단적 코드:** 목(木)의 기운은 위로 곧게 뻗어나가려는 강한 자아입니다. 타인의 피드백이나 협업 제안을 거추장스럽게 여깁니다.\n* **자원(네트워크) 상실:** 유연성이 결여된 상태에서 밀어붙이다가 주변 네트워크와 단절되었고, 결과적으로 시스템이 고립되어 기능이 정지된 것입니다.`,
    shiftCurrent: '오늘도 고집스러운 자아 비대(비견) 코드가 돌아갈 위험이 있습니다.',
    shiftActions: [
      {
        summary: '즉시 타인에게 도움이나 피드백을 요청하여 네트워크를 복구하십시오.',
        details: '갑목(甲)의 가장 큰 약점은 "나 혼자 다 할 수 있다"는 착각입니다. 시스템이 멈추기 전에 주변에 손을 내미세요. 타인의 API(조언)를 호출하는 것은 패배가 아니라 스마트한 리소스 관리입니다.'
      },
      {
        summary: '그날의 뼈아팠던 시스템 고립(외로움과 실패)을 기억하십시오.',
        details: '독단적인 결정 끝에 아무도 도와주지 않아 모든 책임을 혼자 떠안았던 그 서늘한 서버실의 온도를 기억하세요. 유연성이 없는 나무는 거센 바람에 결국 부러집니다.'
      },
      {
        summary: '나의 주장을 꺾고 유연하게 타협하는 쿨링(명상, 대화)을 실행하십시오.',
        details: '오늘은 내 말이 맞더라도 한 걸음 물러서는 훈련을 하세요. 뻣뻣해진 목과 어깨를 스트레칭으로 풀어주며, 물리적인 몸의 유연성이 정신의 유연성으로 이어지도록 시스템을 쿨링하십시오.'
      }
    ]
  },
  '乙': {
    triggerDate: '최근 겁재(劫財) 타임아웃 주간',
    errorCode: '[Error 408: Request Timeout] 의존성 과다로 인한 응답 지연',
    trigger: '겁재(劫財) 프로세스 발동 + 환경에 대한 과도한 덩굴(木) 의존',
    scanSync: `당시 시스템은 단독 연산 능력만을 스캔했습니다. 하지만 해당 에러는 연산 부족이 아닌, **'외부 API(타인)의 응답을 무한 대기하며 발생한 데드락(Deadlock)'**이었습니다.\n\n**[2] Root Cause (근본 원인 분석)**\n* **겁재(劫財)의 의존적 코드:** 을목(乙)의 기운은 타인의 지지나 동의 없이는 자립적으로 프로세스를 실행하지 못하는 오류가 발생했습니다.\n* **주도권 상실:** 모든 결정을 위탁하다 보니 처리 시간이 초과(Timeout)되었고, 성과를 타인에게 뺏기는 셧다운을 맞았습니다.`,
    shiftCurrent: '오늘도 타인의 눈치를 보며 실행을 미루는 코드가 돌아가고 있습니다.',
    shiftActions: [
      {
        summary: '즉시 외부의 동의를 구하는 네트워크 호출을 차단하십시오.',
        details: '타인의 컨펌을 기다리느라 멈춰있는 내 코어 프로세스를 강제로 재가동하세요. 오늘은 약간의 미움을 받을 용기가 필요합니다. 을목(乙)의 끈질긴 생명력은 타인이 아닌 내 뿌리에서 나옵니다.'
      },
      {
        summary: '아무도 도와주지 않아 방치되었던 그날의 타임아웃을 기억하십시오.',
        details: '끝까지 결정을 미루다가 결국 아무것도 진행되지 않아 기회를 날렸던 무기력한 시간을 떠올려 보세요. 의존은 결국 나의 통제권을 타인에게 넘기는 위험한 보안 결함입니다.'
      },
      {
        summary: '나만의 독자적인 로컬 환경에서 단독으로 결정을 내리는 훈련을 실행하십시오.',
        details: '점심 메뉴 고르기 같은 아주 작은 것부터 "내 방식대로" 결정하고 실행하세요. 외부 통신을 끄고 나만의 로컬 호스트에서 성공의 경험(작은 성취)을 렌더링하는 것이 오늘의 쿨링입니다.'
      }
    ]
  },
  '丙': {
    triggerDate: '최근 식상(食傷) 과열 주간',
    errorCode: '[Error 429: Too Many Requests] 감정 폭발 및 리소스 과열',
    trigger: '식상(食傷) 프로세스 발동 + 한계치 초과 출력(火) 투입',
    scanSync: `당시 시스템은 입력(Input) 부족만을 위험 지표로 스캔했습니다. 하지만 해당 에러는 입력의 부재가 아닌, **'제어 장치 없이 출력을 무한대로 쏟아낸 열폭주(Thermal Runaway)'**였습니다.\n\n**[2] Root Cause (근본 원인 분석)**\n* **식상(食傷)의 과열 코드:** 병화(丙)의 기운은 숨길 수 없는 빛과 열입니다. 감정과 아이디어를 여과 없이 쏟아내어 시스템 방열판이 녹아내렸습니다.\n* **리소스 고갈:** 오지랖과 감정적 폭발이 시스템을 장악했고, 결국 스로틀링(Throttling)이 걸리며 극심한 번아웃을 맞았습니다.`,
    shiftCurrent: '오늘도 감정적 아웃풋이 한도 초과되는 과열 코드가 돌아가고 있습니다.',
    shiftActions: [
      {
        summary: '즉시 불필요한 참견이나 감정 발산(SNS, 대화)을 차단하십시오.',
        details: '오늘 당신의 입 밖으로 나가는 모든 말은 시스템의 배터리를 10%씩 소모시킵니다. 꼭 필요한 말이 아니면 "Mute(음소거)" 모드를 켜십시오. 세상의 모든 문제를 당신이 밝혀줄 필요는 없습니다.'
      },
      {
        summary: '그날의 뼈아팠던 시스템 과열(번아웃과 후회)을 기억하십시오.',
        details: '순간의 감정을 통제하지 못해 쏟아내고 다음 날 아침 이불을 걷어차며 후회했던 끔찍한 데이터 후처리 과정을 떠올리세요. 열정은 훌륭한 엔진이지만 브레이크가 없으면 흉기가 됩니다.'
      },
      {
        summary: '아무 말도 하지 않고 빛을 차단한 채 물리적 쿨링(수면, 물 마시기)을 실행하십시오.',
        details: '병화(丙)의 에너지는 어둠 속에서 진정됩니다. 시원한 물을 마시고 방의 조도를 낮추세요. 뇌의 쿨링 팬이 조용해질 때까지 외부 자극으로부터 완벽하게 시스템을 격리하는 것이 답입니다.'
      }
    ]
  },
  '丁': {
    triggerDate: '최근 편인(偏印) 연소 주간',
    errorCode: '[Error 500: Internal Server Error] 내부 감정 연소 및 화병',
    trigger: '편인(偏印) 프로세스 발동 + 통제되지 않은 내적 불꽃(火) 투입',
    scanSync: `당시 시스템은 외부의 트래픽만을 스캔했습니다. 하지만 해당 에러는 외부 공격이 아닌, **'내부에서 스파크가 튀어 메인보드가 서서히 타들어간 내부 오류(Internal Error)'**였습니다.\n\n**[2] Root Cause (근본 원인 분석)**\n* **편인(偏印)의 연소 코드:** 정화(丁)의 기운은 집중되고 끈질긴 열기입니다. 서운함과 의심이라는 불씨를 내면에서 계속 태웠습니다.\n* **내부 붕괴:** 감정적 찌꺼기가 한계점을 돌파하면서 논리 회로가 붕괴되고 신체적 증상(화병)으로 시스템이 셧다운 되었습니다.`,
    shiftCurrent: '오늘도 과거의 서운함을 곱씹는 치명적인 내부 연소 코드가 돌아가고 있습니다.',
    shiftActions: [
      {
        summary: '즉시 내부에서 돌아가는 오버띵킹 루프 프로세스를 강제 종료하십시오.',
        details: '상대방의 사소한 눈빛이나 단어를 100번씩 리플레이하며 숨은 의도를 찾는 "악성 백그라운드 프로세스"를 당장 Kill 하세요. 당신의 소중한 CPU를 그런 쓰레기 데이터 연산에 낭비하지 마십시오.'
      },
      {
        summary: '감정을 삭히다 속이 타들어갔던 그날의 메인보드 손상을 기억하십시오.',
        details: '말하지 않고 혼자 참아내면 남들은 당신이 괜찮은 줄 압니다. 그러다 결국 나 혼자만 화병(Error 500)으로 쓰러져 응급 복구해야 했던 억울한 밤을 떠올리세요.'
      },
      {
        summary: '생각을 글로 적어 밖으로 배출(Export)하는 물리적 쿨링을 실행하십시오.',
        details: '정화(丁)의 내부 열기는 반드시 바깥으로 빼내야 합니다. 일기장에 서운함을 적나라하게 욕하며 적어 내리거나, 믿을 수 있는 사람에게 명확하게 불만(Error Log)을 리포트하세요.'
      }
    ]
  },
  '戊': {
    triggerDate: '최근 정인(正印) 고립 주간',
    errorCode: '[Error 404: Not Found] 변화 거부 및 시스템 고립',
    trigger: '정인(正印) 프로세스 발동 + 과도한 보수성(土) 투입',
    scanSync: `당시 시스템은 시스템 불안정성만을 위험 지표로 스캔했습니다. 하지만 해당 에러는 불안정이 아닌, **'업데이트를 완강히 거부하여 발생한 레거시(Legacy) 고립'**이었습니다.\n\n**[2] Root Cause (근본 원인 분석)**\n* **정인(正印)의 고착 코드:** 무토(戊)의 기운은 거대한 산입니다. 기존의 안전한 데이터(과거 경험)만 고집하고 새로운 패치를 거부했습니다.\n* **네트워크 단절:** 세상의 트래픽이 접근하지 못해 404 Not Found(도태) 상태에 이르렀습니다.`,
    shiftCurrent: '오늘도 익숙한 것만 고집하려는 레거시 방어 코드가 돌아가고 있습니다.',
    shiftActions: [
      {
        summary: '즉시 기존의 방식이 옳다는 시스템의 고집(Cache)을 삭제하십시오.',
        details: '"예전엔 이렇게 해서 잘 됐어"라는 생각은 캐시 메모리에 남은 오래된 쓰레기 데이터입니다. 지금 이 순간의 최신 버전에 맞게 내 고집과 원칙을 시원하게 포맷(Format)할 용기가 필요합니다.'
      },
      {
        summary: '안전지대에 갇혀 기회를 모두 놓쳤던 그날의 고립을 기억하십시오.',
        details: '너무 신중하게 돌다리만 두드리다가 결국 아무 곳에도 가지 못하고, 다른 사람들이 앞서나가는 것을 멀리서 지켜봐야만 했던 무토(戊)의 뼈아픈 고립감을 상기하세요.'
      },
      {
        summary: '가장 낯설고 새로운 환경에 자신을 던지는 강제 동기화(업데이트)를 실행하십시오.',
        details: '오늘은 의도적으로 가장 안 해본 일, 가장 낯선 길로 퇴근하기 등 사소한 변화의 패치를 시스템에 주입하세요. 무토(戊)라는 거대한 산은 변화를 받아들일 때 가장 웅장해집니다.'
      }
    ]
  },
  '己': {
    triggerDate: '최근 정관(正官) 모순 주간',
    errorCode: '[Error 409: Conflict] 내부 모순 및 스트레스 축적',
    trigger: '정관(正官) 프로세스 발동 + 감춰진 포용(土) 투입',
    scanSync: `당시 시스템은 명시적인 에러율만을 스캔했습니다. 하지만 해당 에러는 외부적으로는 에러가 없었으나, **'서로 충돌하는 프로세스를 모두 껴안아 발생한 교착 상태(Conflict)'**였습니다.\n\n**[2] Root Cause (근본 원인 분석)**\n* **정관(正官)의 모순 코드:** 기토(己)의 기운은 모든 것을 품는 땅입니다. 타인의 요구와 본심이 충돌함에도 모두 메모리에 적재했습니다.\n* **메모리 한계 초과:** 내부에 쓰레기 데이터가 정리(GC)되지 못하고 우울감과 함께 시스템이 정지했습니다.`,
    shiftCurrent: '오늘도 타인의 기대에 부응하려 내 자원을 무단 점유당하는 코드가 돌아가고 있습니다.',
    shiftActions: [
      {
        summary: '즉시 나의 권한 밖의 타인 프로세스(요구사항)를 강제로 Kill 하십시오.',
        details: '기토(己)는 남들을 포용하는 따뜻한 흙이지만, 쓰레기장까지 되어줄 필요는 없습니다. "그건 제가 할 수 없습니다"라고 단호하게 거절(Access Denied)하는 것이 당신의 핵심 시스템을 지키는 유일한 방법입니다.'
      },
      {
        summary: '모두를 만족시키려다 나 자신이 셧다운 되었던 그날의 Conflict를 기억하십시오.',
        details: '착한 사람이 되려고 무리하게 업무와 감정을 다 받아주다가, 결국 나 자신의 코어 데이터가 산산조각 났던 그 끔찍한 스트레스 붕괴 현상을 기억하세요. 희생은 미덕이 아니라 버그입니다.'
      },
      {
        summary: '오직 나의 코어 프로세스 하나에만 집중하는 로컬 모드를 실행하십시오.',
        details: '오늘은 철저하게 이기적으로 행동하세요. 핸드폰 알림을 끄고 나 자신만을 위한 보상(맛있는 음식, 혼자만의 시간)을 제공하며 비옥한 땅(己)에 영양분을 채우는 쿨링을 실행해야 합니다.'
      }
    ]
  },
  '庚': {
    triggerDate: '최근 칠살(七殺) 경직 주간',
    errorCode: '[Error 406: Not Acceptable] 과도한 원칙주의에 의한 연결 거부',
    trigger: '칠살(七殺) 프로세스 발동 + 융통성 제로의 강철(金) 투입',
    scanSync: `당시 시스템은 보안 취약점만을 위험 지표로 스캔했습니다. 하지만 해당 에러는 보안의 문제가 아니라, **'보안 레벨을 너무 높여 정상적인 패킷조차 튕겨낸 방화벽의 오작동'**이었습니다.\n\n**[2] Root Cause (근본 원인 분석)**\n* **칠살(七殺)의 경직 코드:** 경금(庚)의 기운은 날카로운 무기입니다. 원칙에 어긋나면 무자비하게 프로세스를 잘라냈습니다.\n* **협업 모듈 파괴:** 융통성이 마비된 상태에서 칼날이 주변 사람들을 상처 입혔고, 핵심 모듈(인간관계)이 파괴되며 고립되었습니다.`,
    shiftCurrent: '오늘도 타인의 사소한 실수를 용납하지 않는 극강의 방화벽 코드가 돌아가고 있습니다.',
    shiftActions: [
      {
        summary: '즉시 타인에게 들이대는 엄격한 유효성 검사(Validation)를 중단하십시오.',
        details: '세상은 경금(庚)처럼 완벽한 로직으로만 돌아가지 않습니다. 타인의 작은 실수를 볼 때마다 입술을 깨물고 넘어가세요. 지금 당신이 날리는 피드백은 조언이 아니라 시스템을 찌르는 치명적인 오류 창입니다.'
      },
      {
        summary: '원칙만 따지다 소중한 파트너를 잃었던 그날의 연결 거부(Not Acceptable)를 기억하십시오.',
        details: '맞는 말을 하고도 욕을 먹고, 결국 주위에 아무도 남지 않아 홀로 삭막하게 서 있어야 했던 그날의 외로움을 떠올리세요. 정답보다 중요한 것은 네트워크의 연결성입니다.'
      },
      {
        summary: '나의 잣대를 부러뜨리고 타인의 감정에 동기화하는 따뜻한 쿨링을 실행하십시오.',
        details: '오늘은 논리 회로를 끄고 감성 회로를 켜십시오. 무언가 잘못되었더라도 "그럴 수 있지"라고 넘기는 연습이 필요합니다. 강철(庚)은 따뜻한 불씨를 만날 때 가장 쓸모 있는 도구가 됩니다.'
      }
    ]
  },
  '辛': {
    triggerDate: '2026년 3월 19일 (임진일 壬辰日)',
    errorCode: '[Error 403: Forbidden] 외부 방화벽(공권력) 정면 충돌 및 강제 셧다운',
    trigger: '상관(傷官) 프로세스 발동 + 임계치 초과 알코올(火) 투입',
    scanSync: `당시 시스템은 하드웨어 간의 물리적 충돌(충돌, 형살)만을 위험 지표로 스캔했습니다. 하지만 3월 19일의 에러는 하드웨어 파손이 아닌, **'소프트웨어 보안 규범을 스스로 파괴하는 탈옥(Jailbreak)'**이었습니다.\n\n**[2] Root Cause (근본 원인 분석)**\n* **상관(傷官)의 탈옥 코드:** 기존의 보안 정책이나 통제를 거추장스럽게 여기고 이를 강제로 무력화하려는 해킹 코드와 같습니다.\n* **통제력 상실:** 알코올이 결합되며 이성적 브레이크(辛)가 마비되었습니다. "내가 맞는데 왜 통제해?"라는 반발심이 결국 외부 방화벽과 충돌했습니다.`,
    shiftCurrent: '오늘도 과거의 탈옥 시도처럼 통제력을 잃고 외부와 강하게 충돌할 위험이 있는 파괴적 코드가 돌아가고 있습니다.',
    shiftActions: [
      {
        summary: '즉시 외부 네트워크(술자리 등) 접속을 차단하십시오.',
        details: '지금 당신의 시스템은 작은 불꽃 하나에도 크게 폭발할 수 있는 화약고와 같습니다. 타인과의 불필요한 대화나 음주 상황에 노출되면, 평소라면 웃어넘길 타인의 조언도 나를 향한 \'공격\'으로 오해하게 됩니다. 오늘은 무조건 약속을 취소하고 혼자만의 물리적 안전지대를 확보하는 것이 가장 위대한 방어입니다.'
      },
      {
        summary: '그날의 아찔했던 시스템 크래시를 기억하십시오.',
        details: '나의 예리함이 통제를 잃었을 때 나 스스로와 주변 사람들에게 얼마나 큰 상처를 남겼는지 복기해 보세요. 당신의 코어(辛)는 세상을 정밀하게 조각하는 보석이지만, 통제력을 잃는 순간 나침반을 잃은 칼날이 됩니다. 과거의 실수를 자책하라는 것이 아닙니다. 똑같은 패턴에 다시 당하지 않도록 스스로에게 경고창을 띄우는 것입니다.'
      },
      {
        summary: '안전한 로컬 환경(집)으로 귀환하여 물리적 쿨링(음악, 휴식)을 실행하십시오.',
        details: '과열된 CPU는 억지로 다른 연산을 시킨다고 식지 않습니다. 가장 푹신한 소파, 좋아하는 음악, 따뜻한 차 한 잔처럼 오직 나만을 위한 독립적인(로컬) 쿨링 시스템을 가동하세요. 스위치를 끄고 푹 쉬는 것만으로도 내일의 시스템은 두 배로 강해집니다.'
      }
    ]
  },
  '壬': {
    triggerDate: '최근 편재(偏財) 유실 주간',
    errorCode: '[Error 502: Bad Gateway] 방향성 상실 및 과도한 방황',
    trigger: '편재(偏財) 프로세스 발동 + 제방 없는 거대한 물결(水) 투입',
    scanSync: `당시 시스템은 트래픽의 양만을 위험 지표로 스캔했습니다. 하지만 해당 에러는 트래픽 부족이 아니라, **'명확한 목적지(Gateway) 없이 트래픽이 사방으로 누수된 라우팅 실패'**였습니다.\n\n**[2] Root Cause (근본 원인 분석)**\n* **편재(偏財)의 무한 확장 코드:** 임수(壬)의 기운은 가두기 힘든 거대한 바다입니다. 너무 많은 호기심으로 포트를 사방에 열어두었습니다.\n* **방향성 상실:** 통제 수단이 부재한 상태에서 여기저기 기웃거리며 자원만 낭비하다가, 결국 어떤 결과물도 리턴(Return) 받지 못했습니다.`,
    shiftCurrent: '오늘도 집중력이 분산되고 무의미한 탐색을 반복하는 방황 코드가 돌아가고 있습니다.',
    shiftActions: [
      {
        summary: '즉시 필수적이지 않은 모든 외부 연결 포트(관심사)를 닫으십시오.',
        details: '임수(壬)의 방대한 스케일은 양날의 검입니다. 오늘은 새로운 아이디어를 벌이는 것을 멈추고, 열려있는 10개의 창 중 9개를 강제 종료하세요. 선택과 집중만이 당신의 흩어진 트래픽을 하나로 모아줍니다.'
      },
      {
        summary: '사방으로 에너지만 낭비하고 남는 게 없었던 그날의 Bad Gateway를 기억하십시오.',
        details: '이것저것 다 건드려보았지만 결국 마감일이 다가왔을 때 내 손에 쥐어진 결과물은 0(Zero)이었던 그날의 허탈함을 기억하세요. 방향 없는 호기심은 시스템 리소스의 극심한 낭비일 뿐입니다.'
      },
      {
        summary: '오직 단 하나의 명확한 타겟(목표)에만 에너지를 쏟는 정밀 타격을 실행하십시오.',
        details: '오늘 하루의 목표를 단 하나로 설정하고 책상 앞에 적어두세요. 거대한 물(壬)이 좁은 계곡을 만날 때 가장 파괴적인 전력을 생산하듯, 스스로에게 엄격한 제약을 걸어 에너지를 응축시키는 쿨링이 필요합니다.'
      }
    ]
  },
  '癸': {
    triggerDate: '최근 정인(正印) 루프 주간',
    errorCode: '[Error 508: Loop Detected] 오버띵킹 및 자기 파괴 루프',
    trigger: '정인(正印) 프로세스 발동 + 깊고 어두운 심연(水) 투입',
    scanSync: `당시 시스템은 물리적인 하드웨어 온도만을 스캔했습니다. 하지만 해당 에러는 물리적 과열이 아닌, **'머릿속에서 부정적인 가상 시뮬레이션을 무한 반복하다 발생한 무한 루프(Infinite Loop)'**였습니다.\n\n**[2] Root Cause (근본 원인 분석)**\n* **정인(正印)의 루프 코드:** 계수(癸)의 기운은 고요하게 스며드는 안개입니다. 불안감을 스스로 증폭시켜 빠져나올 수 없는 생각의 미로를 구축했습니다.\n* **시스템 프리징:** 행동으로 발산하지 않고 내면으로만 침잠하다 보니, 뇌의 메모리가 가득 차 결국 현실 시스템이 멈추는(Freezing) 상태에 이르렀습니다.`,
    shiftCurrent: '오늘도 스스로 만든 부정적 생각의 루프에 빠질 위험이 높은 코드가 돌아가고 있습니다.',
    shiftActions: [
      {
        summary: '즉시 머릿속에서 돌아가는 백그라운드 시뮬레이션(걱정) 프로세스를 강제 킬(Kill)하십시오.',
        details: '계수(癸)의 섬세함은 최악의 시나리오를 렌더링하는 데 특화되어 있습니다. "만약에 ~하면 어쩌지?"라는 질문이 떠오르는 순간 고개를 젓고 소리 내어 "그만!"이라고 외쳐 루프를 강제로 끊어내세요.'
      },
      {
        summary: '생각에 잡아먹혀 한 발자국도 떼지 못했던 그날의 무한 루프를 기억하십시오.',
        details: '아직 일어나지도 않은 일들을 걱정하느라 밤을 꼬박 새우고, 다음날 정작 현실의 업무는 손도 대지 못해 모든 일정이 무너졌던 그날의 끔찍한 프리징(Freezing) 현상을 상기하십시오.'
      },
      {
        summary: '생각을 멈추고 당장 몸을 움직이는 물리적 발산(운동, 외출)을 실행하십시오.',
        details: '정신이 끝없는 안갯속을 헤맬 때는 육체를 움직여 시선을 외부로 돌려야 합니다. 산책을 하거나 땀이 나는 강도 높은 운동을 통해, 뇌로 가는 혈류를 근육으로 분산시키는 물리적 쿨링을 지금 당장 실행하세요.'
      }
    ]
  }
};

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

// 2026년 4월 1일 ~ 30일의 실제 일진(日辰) 간지 데이터 (4월 22일 丙寅일 기준 역산)
const APRIL_2026_GANZHI = [
  { date: 1, gan: '乙', zhi: '巳' }, { date: 2, gan: '丙', zhi: '午' }, { date: 3, gan: '丁', zhi: '未' },
  { date: 4, gan: '戊', zhi: '申' }, { date: 5, gan: '己', zhi: '酉' }, { date: 6, gan: '庚', zhi: '戌' },
  { date: 7, gan: '辛', zhi: '亥' }, { date: 8, gan: '壬', zhi: '子' }, { date: 9, gan: '癸', zhi: '丑' },
  { date: 10, gan: '甲', zhi: '寅' }, { date: 11, gan: '乙', zhi: '卯' }, { date: 12, gan: '丙', zhi: '辰' },
  { date: 13, gan: '丁', zhi: '巳' }, { date: 14, gan: '戊', zhi: '午' }, { date: 15, gan: '己', zhi: '未' },
  { date: 16, gan: '庚', zhi: '申' }, { date: 17, gan: '辛', zhi: '酉' }, { date: 18, gan: '壬', zhi: '戌' },
  { date: 19, gan: '癸', zhi: '亥' }, { date: 20, gan: '甲', zhi: '子' }, { date: 21, gan: '乙', zhi: '丑' },
  { date: 22, gan: '丙', zhi: '寅' }, { date: 23, gan: '丁', zhi: '卯' }, { date: 24, gan: '戊', zhi: '辰' },
  { date: 25, gan: '己', zhi: '巳' }, { date: 26, gan: '庚', zhi: '午' }, { date: 27, gan: '辛', zhi: '未' },
  { date: 28, gan: '壬', zhi: '申' }, { date: 29, gan: '癸', zhi: '酉' }, { date: 30, gan: '甲', zhi: '戌' }
];

const generateForecastDays = (dayMaster: string) => {
  const rules = PREMIUM_COACHING[dayMaster] || PREMIUM_COACHING['甲'];

  return APRIL_2026_GANZHI.map(day => {
    let status = 'safe';
    let detailData: any = null;

    if (day.gan === rules.danger.targetGan) {
      status = 'danger';
      detailData = rules.danger;
    } else if (day.gan === rules.warning.targetGan) {
      status = 'warning';
      detailData = rules.warning;
    } else if (day.gan === rules.green.targetGan) {
      status = 'green';
      detailData = rules.green;
    }

    // 신(辛)금 유저를 위한 특별한 복합 충돌 처리 로직 (원국 巳, 申 고려)
    if (dayMaster === '辛') {
      if (day.zhi === '寅' && day.gan === '丙') {
        status = 'danger';
        detailData = {
          title: '🚨 병신합(丙) + 인사신 삼형(寅) 동시 발생',
          cause: '시스템 합(合)으로 외부 트래픽이 몰려든 상태에서 코어 하드웨어 연쇄 충돌(형살)이 발생했습니다.',
          action: '최악의 시스템 충돌일입니다. 즉시 방화벽을 올리고 외부와의 접촉을 차단한 채 로컬 환경으로 대피하십시오.'
        };
      } else if (day.zhi === '寅') {
        status = 'danger';
        detailData = { title: '인사신 삼형(寅巳申 三刑)', cause: '하드웨어 연쇄 충돌 발생', action: '심각한 런타임 에러 주의. 오프라인 모드로 전환하세요.' };
      } else if (day.zhi === '亥') {
        status = 'danger';
        detailData = { title: '사해충(巳亥沖)', cause: '코어 커널 타격', action: '감정 기복 극대화. 감정적 결정을 절대 미루세요.' };
      } else if (day.zhi === '卯') {
        status = 'warning';
        detailData = { title: '묘신 귀문(卯申 鬼門)', cause: '극심한 예민함과 오버띵킹', action: '메모리 누수 발생 중. 복잡한 생각을 리셋하세요.' };
      } else if (day.zhi === '酉') {
        status = 'green';
        detailData = { title: '사유합(巳酉合)', cause: '하드웨어 냉각 완료', action: '예리한 이성이 돋보이는 날. 중요한 기획을 시작하세요.' };
      }
    }

    return {
      date: day.date,
      status: status,
      detailData: detailData
    };
  });
};

const STATUS_INFO: Record<string, { color: string, label: string, desc: string }> = {
  'danger': { color: 'bg-red-500', label: 'RED ZONE (시스템 셧다운 위험)', desc: '특이 사항이 발견되었습니다. 하단 브리핑을 확인하세요.' },
  'warning': { color: 'bg-amber-400', label: 'YELLOW ZONE (메모리 누수 주의)', desc: '특이 사항이 발견되었습니다. 하단 브리핑을 확인하세요.' },
  'green': { color: 'bg-emerald-400', label: 'GREEN ZONE (네트워크 최적화)', desc: '특이 사항이 발견되었습니다. 하단 브리핑을 확인하세요.' },
  'safe': { color: 'bg-slate-700', label: 'NORMAL (평시 트래픽)', desc: '특이 사항 없는 평온한 백그라운드 프로세스가 가동됩니다. 루틴에 집중하십시오.' }
};

// ==========================================
// 3. 메인 컴포넌트
// ==========================================
export default function AkashicRecordSection({ 
  dayMasterHanja,
  sajuData
}: { 
  dayMasterHanja?: string | null;
  sajuData?: any;
}) {
  const [viewMode, setViewMode] = useState<'post-mortem' | 'forecast'>('post-mortem');
  const [expandedAction, setExpandedAction] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(22); // Default selected to 22 (오늘)

  const masterKey = dayMasterHanja && POST_MORTEM_DICT[dayMasterHanja] ? dayMasterHanja : '辛';
  const data = POST_MORTEM_DICT[masterKey];
  const calendarDays = generateForecastDays(masterKey);

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
                    <p className="text-[11px] text-slate-400">2026년 4월 ({masterKey}일간 동기화됨)</p>
                  </div>
                </div>
              </div>

              {/* 캘린더 그리드 */}
              <div className="grid grid-cols-7 gap-1.5 mb-6">
                {['일','월','화','수','목','금','토'].map(day => (
                  <div key={day} className="text-center text-[10px] font-bold text-slate-500 pb-2">{day}</div>
                ))}
                {/* 4월 1일 수요일 시작 오프셋 (일~화 빈칸) */}
                <div className="aspect-square"></div>
                <div className="aspect-square"></div>
                <div className="aspect-square"></div>
                
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
                          4월 {selectedDay}일 
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
                          <p className="text-[12px] text-slate-300 leading-relaxed">
                            <span className="text-cyan-400 font-bold block mb-1">💡 [명심 코칭 지침]</span>
                            {calendarDays.find(d => d.date === selectedDay)?.detailData.action}
                          </p>
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
