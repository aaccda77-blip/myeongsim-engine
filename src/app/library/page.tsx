'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
    Ban,
    BookOpen, ArrowLeft, CheckCircle2, Shield, Sparkles, Lock, Unlock, 
    Download, ExternalLink, Volume2, VolumeX, Eye, Bookmark, Share2, 
    ShoppingBag, Star, RefreshCw, Layers, ZoomIn, ZoomOut, Check, ChevronRight,
    AlertTriangle, ShieldAlert, FileText, AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import HealingSongApplyModal from '@/components/modals/HealingSongApplyModal';
import BookVerificationSuccessModal from '@/components/modals/BookVerificationSuccessModal';
import RefinedEBookReader from '@/components/library/RefinedEBookReader';
import BrainwaveSoundLabModal from '@/components/audio/BrainwaveSoundLabModal';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

// 도서 서지 정보
const BOOK_INFO = {
    title: 'ZERO POINT (제로 포인트)',
    subtitle: 'AWARENESS OF AWARENESS / 내 안의 소음이 멈추고, 운명의 알고리즘이 리셋되는 순간',
    author: '이경윤',
    publisher: '청류 (EDITIONS CHEONGRYU)',
    publisherReg: '2026년 7월 21일 (제2026-000055호)',
    publishDate: '2026년 9월 14일',
    isbn: '979-11-220953-0-2',
    price: '11,000원',
    yes24Url: 'https://www.yes24.com/product/goods/195946431',
    smartstoreUrl: 'https://smartstore.naver.com/cheongryubooks/products/13751650301',
    totalPages: 309
};

// 목차 챕터 데이터 (대표님 PDF 원문 100% 동기화)
const CHAPTERS = [
    {
        id: 'prologue',
        title: '프롤로그 · 소음이 멈추는 곳, 제로 포인트',
        page: '6-10p',
        content: `종일 무언가에 쫓기듯 하루를 보내고 돌아와 불 꺼진 방에 가만히 누워 있을 때가 있습니다. 몸은 멈췄는데 머릿속은 여전히 낮에 들었던 날카로운 말들, 내일 해야 할 일들, 그리고 출처를 알 수 없는 막연한 불안감으로 웅성거립니다. 마치 수십 개의 프로그램을 동시에 돌리느라 뜨겁게 과열된 기계처럼, 뇌가 터질 것만 같은 순간들. 아마 당신에게도 그리 낯선 풍경은 아닐 겁니다.

그럴 때마다 우리는 습관적으로 세상을 향해 돋보기를 들이댑니다. 내가 왜 이렇게 불안한지 이유를 분석하고, 상황을 바꾸려 애쓰고, 마음을 고쳐먹으려 스스로를 다그칩니다. 조금 더 강해지면, 조금 더 많이 가지면 이 소란이 가라앉을까 싶어 정신의 배터리가 붉은빛을 깜빡이는데도 자꾸만 무언가를 더 채우려 듭니다.

하지만 채울수록 허기는 더해졌고, 세상과 촘촘히 연결될수록 외로움은 정직하게 깊어만 갔습니다. 내 삶의 주인이 정말 나인지, 아니면 세상이 짜 놓은 정교한 알고리즘에 끌려다니는 인형인지 분간하기조차 힘겨워질 때쯤, 저는 비로소 돋보기를 내려놓았습니다. 그리고 바깥으로만 향해 있던 시선을 안으로, 아주 천천히 돌려보았습니다.

그것은 내 상태를 날카롭게 분석하는 차가운 감시자가 되는 일이 아니었습니다. 그저, 이 소란스러운 생각과 감정들을 한 걸음 물러서서 가만히 지켜보는 투명한 눈을 갖는 일이었습니다.

옛사람들은 이 마음의 자리를 '공적영지(空寂靈知)'라는 깊은 언어로 불렀고, 현대의 심리학자들은 '알아차림을 알아차리는 상태'라고 말합니다. 복잡한 용어들을 다 걷어내고 나면, 결국 하나의 고요한 지점에 닿게 됩니다. 모든 소음이 멈추고 온전한 평정심만 남는 곳, 바로 이 책이 내내 머물게 될 '제로 포인트(Zero Point)'입니다.`
    },
    {
        id: 'part1_1',
        title: '제1부 1장. 달리는 자전거 위에서는 풍경이 보이지 않는다',
        page: '12-18p',
        content: `자전거를 타고 가파른 내리막길을 전속력으로 질주할 때를 떠올려 봅니다. 페달을 밟는 발에 힘이 들어가고 바퀴에 속도가 붙을수록, 기이하게도 눈앞의 시야는 점점 좁아집니다. 시속 10킬로미터로 달릴 때는 다정하게 인사하던 길가의 가로수와 이름 모를 들꽃들이, 속도가 올라갈수록 그저 하나의 흐릿한 선으로 초점 없이 뭉개져 스쳐 갈 뿐입니다.

그 순간 부딪히는 거센 바람 속에서 우리가 할 수 있는 일은 오직 하나입니다. 넘어지지 않기 위해, 살아남기 위해 바로 앞의 차가운 아스팔트 바닥만 매섭게 노려보는 것. 가속도가 붙은 자전거 위에서 풍경의 아름다움을 음미하기란 애초에 불가능한 일입니다.

어쩌면 지금을 살아가는 현대인들의 삶이 정확히 이 가파른 내리막길 위의 자전거를 닮아있는지도 모르겠습니다.

문제는 속도가 한계치를 넘어설 때, 우리의 뇌와 마음에도 '시야 협착'이 일어난다는 사실입니다. 과속하는 삶 속에서는 내가 지금 어디로 가고 있는지, 내 마음이 얼마나 지쳐 부서지고 있는지 보이지 않습니다.

꽉 쥐고 있던 핸들의 힘을 빼고, 서서히 브레이크를 잡아 속도를 줄이는 것입니다. 바퀴의 회전이 멈추고 자전거에서 완전히 내려와 발을 땅에 딛는 순간, 비로소 뭉개졌던 풍경들이 제 형태를 드러내며 선명하게 눈에 들어오기 시작합니다. 이것이 바로 내 삶의 고정된 패턴을 바꾸기 위한 첫 번째 관문, 모든 자극을 멈추고 나를 정밀하게 읽어내는 '스캔(Scan)'의 시작입니다.`
    },
    {
        id: 'part1_2',
        title: '제1부 2장. 뇌의 과열을 식히는 디폴트 모드 네트워크(DMN) 리셋',
        page: '19-24p',
        content: `우리가 아무런 집중 작업을 하지 않고 멍하니 있을 때도 뇌의 특정 부위는 여전히 격렬하게 활동합니다. 뇌과학에서는 이를 '디폴트 모드 네트워크(Default Mode Network, DMN)'라고 부릅니다. 

DMN은 과거의 후회, 미래의 불안, 타인과의 비교, 자의식 과잉을 끊임없이 재생산하는 뇌의 백그라운드 엔진입니다. 번아웃을 겪는 현대인의 뇌를 fMRI로 촬영해 보면, 이 DMN 회로가 비정상적으로 과열되어 붉게 타오르고 있는 것을 볼 수 있습니다.

제로 포인트는 바로 이 과열된 DMN 스위치를 내리고, 뇌의 중심부를 깊은 휴식과 재생의 알파파 상태로 전환하는 가장 정밀한 생체 신경학적 브레이크입니다.`
    },
    {
        id: 'part1_3',
        title: '제1부 3장. 불안이라는 이름의 자동 실행 프로그램',
        page: '25-30p',
        content: `어떤 사람은 작은 불확실성 앞에서도 심장이 두근거리고 최악의 시나리오를 먼저 떠올립니다. 또 어떤 사람은 타인의 작은 한숨 소리에도 "내가 뭘 잘못했나?" 하고 눈치를 보며 위축됩니다.

이것은 당신의 성격적 결함이 아닙니다. 유년기부터 생존을 위해 무의식 속에 설치되었던 '다크코드(Dark Code)', 즉 감정의 자동 실행 프로그램입니다. 

문제를 해결하겠다고 그 불안과 싸우려 들지 마세요. 싸우려 들수록 프로그램은 더 많은 에너지를 흡수하여 비대해집니다. 그저 스크린 뒤로 물러나 "아, 지금 내 안에서 불안이라는 옛날 프로그램이 또 돌아가고 있구나" 하고 투명하게 알아차리는 순간, 프로그램은 동력을 잃고 멈추게 됩니다.`
    },
    {
        id: 'part1_5',
        title: '제1부 5장. 타고난 기질이라는 생각의 감옥 & MSC 자기연민 에세이',
        page: '31-38p',
        content: `"나도 내가 왜 이러는지 모르겠어. 조금만 서운한 소리를 들으면 나도 모르게 차갑게 벽을 치고 문을 닫아버려. 타고난 팔자고 기질인데 어쩌겠어."

우리는 살아가며 얼마나 자주 이 무서운 문장에 스스로를 가두곤 할까요? "나는 원래 예민해." "나는 다혈질이라 화를 못 참아." 마치 태어날 때부터 영혼 깊숙한 곳에 새겨진 불가항력의 각인이라도 되는 것처럼, 우리는 특정한 자극 앞에서 어김없이 똑같은 방식으로 일그러지고, 분노하며 마음의 닫힌 방 안으로 숨어버립니다.

하지만 가만히 숨을 죽이고 내면의 뜰을 들여다보면, 그것은 결코 온전한 '진짜 나'의 모습이 아닙니다. 낯선 세상의 위협으로부터 스스로를 보호하기 위해 만들어 넣었던 조잡한 방어기제일 뿐입니다.

"아, 지금 내 안에서 또 '상처받기 두려워 벽을 치는 낡은 프로그램'이 자동으로 실행되고 있구나." 이 짧고 명징한 알아차림 하나. 바로 이 순간이 감옥의 문이 열리는 기적의 시작입니다.

제로 포인트는 기질을 '버리는 곳'이 아니라, 그 기질을 온전한 자비로 '안아주는 곳'입니다. 감옥에서 벗어나는 진짜 방법은 쇠창살을 망치로 부수는 물리적 파괴가 아닙니다. 그 창살을 가만히 만져보며 "그동안 이 좁은 공간에서 나를 지켜주느라 참 애썼구나" 하고 수용하는 마음, 바로 MSC(Mindful Self-Compassion, 마음챙김 자기연민)의 태도를 갖출 때 감옥은 순식간에 사라집니다.`
    },
    {
        id: 'part2_1',
        title: '제2부 1장. 가장 완벽한 멈춤, 제로 포인트 (Zero Point)',
        page: '39-46p',
        content: `스마트폰을 오래 쥐고 쓰다 보면 기기가 눈에 띄게 느려지거나 화면이 뚝뚝 끊기는 순간을 마주합니다. 화면 뒤편, 즉 백그라운드에서 나도 모르게 켜져 있던 수십 개의 앱들이 보이지 않게 메모리와 에너지를 갉아먹고 있었기 때문입니다.

이럴 때 우리가 할 수 있는 가장 명쾌한 처방은 하나입니다. 하단의 버튼을 눌러 실행 중인 '모든 앱 강제 종료'를 선택하거나, 전원 버튼을 길게 눌러 시스템을 완전히 껐다 켜는 것. 화면이 잠시 까맣게 암전되었다가 다시 부팅되는 찰나, 어떤 프로그램도 구동되지 않은 채 오직 첫 신호만을 기다리고 있는 순수한 운영체제(OS)의 깨끗한 바탕화면을 마주할 때, 우리는 묘한 쾌적함과 안정감을 느낍니다.

우리의 마음이 제로 포인트에 들어서는 과정도 이와 정확히 닮아 있습니다.

제로 포인트는 아무것도 존재하지 않는 차가운 허무의 공간이 아닙니다. 오히려 모든 소음이 사라졌기에 비로소 '진짜 나'라는 존재의 무게감이 온전히 드러나는 가장 밀도 높은 평정의 영토입니다.`
    },
    {
        id: 'part2_3',
        title: '제2부 3장. 내 마음의 스크린은 결코 찢어지지 않는다',
        page: '47-54p',
        content: `스크린 위로 거대한 불길이 치솟고, 사나운 폭풍우가 몰아치며, 참혹한 비극이 펼쳐집니다. 관객은 숨을 죽이고 공포에 떨거나 눈물을 흘립니다. 그러나 상영이 끝나고 조명이 켜진 뒤 스크린을 만져보면, 하얀 천은 단 한 군데도 그을리지 않았고 단 한 방울의 물기조차 묻어 있지 않습니다. 극 중 어떤 재난도 스크린 자체를 훼손할 수는 없습니다.

우리의 내면도 이와 완전히 같습니다. 슬픔, 절망, 걷잡을 수 없는 불안은 삶이라는 영사기가 의식의 스크린 위에 쏘아 올린 찰나의 빛과 그림자에 불과합니다. 감정의 파고가 아무리 거세게 몰아쳐도, 그 모든 경험을 담아내고 있는 '순수 관찰자'의 자리는 결코 찢어지거나 오염되지 않습니다.

우리가 고통에 압도당했던 유일한 이유는 스크린의 존재를 잊은 채 스크린 속 주인공과 나를 동일시했기 때문입니다. 타오르는 불길을 보며 "내가 불타고 있다"고 착각하고, 쏟아지는 폭우를 보며 "내가 익사하고 있다"고 믿어버린 탓입니다. 그러나 화염을 비추는 스크린은 뜨거워지지 않으며, 바다를 비추는 스크린은 젖지 않습니다.`
    },
    {
        id: 'part3_1',
        title: '제3부 1장. 운명의 알고리즘을 리셋하는 3S 매트릭스',
        page: '55-65p',
        content: `명심코칭의 핵심 프로토콜은 3S 매트릭스로 요약됩니다.

1. Scan (스캔): 내 기질과 사주 오행, 무의식의 다크코드를 있는 그대로 투명하게 정밀 스캔한다.
2. Synchronize (동기화): 과열된 생각과 현실의 간극을 인정하고, 호흡과 신체 감각을 통해 지금 이 순간과 주파수를 일치시킨다.
3. Shift (시프트): 문제에 매몰되어 있던 좁은 시야를 100미터 상공의 독수리처럼 끌어올려, 상위 차원의 순수 자각(Zero Point)으로 무게중심을 이동시킨다.

이 3단계 루틴을 일상에서 반복할 때, 우리는 더 이상 과거의 기억과 상처에 조종당하지 않는 주체적 창조자로 거듭납니다.`
    },
    {
        id: 'part3_3',
        title: '제3부 3장. 432Hz와 528Hz: 생체 파동을 치유하는 소리의 과학',
        page: '66-74p',
        content: `우리의 몸과 마음은 끊임없이 진동하는 파동의 복합체입니다. 스트레스와 불안은 신체의 고유 진동수를 왜곡시키고 세포 간의 통신을 방해합니다.

432Hz는 수학적으로 자연과 우주의 황금비율(피보나치 수열)과 완벽하게 공명하는 주파수입니다. 이 소리를 들을 때 우리의 심박 변이도(HRV)는 급격히 안정되며, 교감신경의 흥분이 가라앉고 부교감신경이 활성화됩니다.

528Hz는 '기적의 주파수'라 불리며, 손상된 생체 에너지를 회복시키고 무의식의 닫힌 감정을 따뜻하게 해동시키는 놀라운 변혁의 파동입니다. 이 책의 모든 챕터는 이 치유 파동과 함께 호흡할 때 가장 강력한 시너지를 발휘합니다.`
    },
    {
        id: 'practice_20',
        title: '제4부. 소음이 멈추는 그 찰나, 당신이라는 제로포인트 (20일 실천 마스터 코스)',
        page: '75-280p',
        content: `[1일차] 스크린은 영화 뒤에 언제나 있었다 — 불타오르던 불길도 스크린을 태우지 못했다.
[2일차] 당신이라는 거대한 하늘, 흘러가는 날씨에 속지 마세요 — 100미터 바다 아래 압도적 고요.
[3일차] 모든 것이 스쳐 가도 결코 닳지 않는 유일한 자리 — 무엇을 비추어도 물들지 않는 거울.
[4일차] 조건 없이 흐르는 생명, 당신이라는 완벽한 바탕 — 태피스트리를 수놓은 단 하나의 실.
[5일차] 슬픔을 연기하는 동안에도 당신은 늘 안전했습니다 — 배역이 끝나면 집으로 돌아가는 명배우.
[6일차] 흔들리는 세상의 중심에서 당신이라는 영점을 만나다 — 어떤 무게도 기억하지 않는 저울.
[7일차] 당신이라는 고요한 여백, 삶의 모든 글씨를 품다 — 그릇은 깨어져도 흙은 다치지 않는다.
[8일차] 거센 소용돌이 속에서 결코 흔들리지 않는 축(軸) — 회전하는 바퀴의 움직이지 않는 중심축.
[9일차] 흔들릴수록 더욱 선명해지는 당신이라는 고향 — 사정없이 흔들리는 나침반 바늘의 중심 핀.
[10일차] 움켜쥔 손을 놓는 순간 시작되는 거대한 고요 — 비눗방울의 두려움과 터지는 찰나의 자유.
[11일차] 당신이라는 무한한 우주, 그려진 운명의 선을 지우다 — 얼음도 수증기도 결국 H₂O.
[12일차] 상처 입지 않는 투명함, 당신이라는 가장 아름다운 기적 — 폭풍우 속에서도 홀로 투명한 유리창.
[13일차] 상처를 비출 뿐 상처 입지 않는 눈부신 원천 — 어떤 비극을 담아도 얼룩지지 않는 카메라 렌즈.
[14일차] 가상 현실의 헤드셋을 벗는 순간, 진짜 세계 — 게임 속 캐릭터의 부상과 소파 위 플레이어.
[15일차] 모든 소란이 멈춘 자리에 핀 절대적 평온 — 격렬한 독무를 받쳐주는 움직이지 않는 무대.
[16일차] 두려움의 온도를 낮추는 고요한 기점 — 시속 200km 폭풍 속 단 하나의 무풍지대 태풍의 눈.
[17일차] 흔들림의 끝에서 마주하는 가장 정직한 평화 — 흙탕물이 되어도 마르지 않는 지하의 수원.
[18일차] 스스로 묶은 매듭을 푸는 찰나, 부드러운 실크 — 수많은 흉터의 나이테 속 태초의 수심(樹心).
[19일차] 세상을 움직이되 스스로는 움직이지 않는 거룩한 정적 — 폭발하는 별들을 품은 99.9% 우주 허공.
[20일차] 세상의 모든 소음이 조율되는 자리, 근원적 조음 — 천 가지 목소리를 내어도 다치지 않는 성우.`
    },
    {
        id: 'epilogue',
        title: '에필로그 · 이제 자전거에서 내려와 걷는 당신에게',
        page: '281-309p',
        content: `책을 덮는 이 순간, 당신의 마음은 어디에 머물고 있습니까?

여전히 내일의 일정이 걱정되고, 해결되지 않은 문제들이 머릿속 한편에서 웅성거릴지도 모릅니다. 그것으로 족합니다. 삶은 결코 완벽하게 통제될 수 없으며, 모든 파도가 잠잠해진 바다란 존재하지 않기 때문입니다.

중요한 것은 파도를 없애는 것이 아니라, 내가 그 파도를 비추는 거대한 바다 그 자체임을 잊지 않는 것입니다.

넘어질까 두려워 핸들을 필사적으로 쥐고 있던 두 손의 힘을 풀고, 잠시 자전거에서 내려와 땅을 딛고 서십시오. 그리고 가만히 귀를 기울여 보십시오.
소음이 멈춘 바로 그곳, 당신이라는 기적이 조용히 숨 쉬고 있습니다.

- 2026년 가을, 저자 이경윤 드림`
    }
];

// 📖 YES24 스타일 무료 미리보기 데이터 (총 15페이지 분량)
const PREVIEW_PAGES = [
    {
        pageNumber: 1,
        tag: '표지 (Cover)',
        title: 'ZERO POINT',
        content: `ZERO POINT
AWARENESS OF AWARENESS

내 안의 소음이 멈추고, 운명의 알고리즘이 리셋되는 순간

저자 이경윤
청 류 (EDITIONS CHEONGRYU)`
    },
    {
        pageNumber: 2,
        tag: '독자 전용 (Reader Exclusive)',
        title: '《제로포인트》 3-Code 실전 인터랙티브 가이드',
        content: `[독자 전용]
《제로포인트》 3-Code 실전 인터랙티브 가이드
다크코드 스캔 ➔ 메타인지 동기화 ➔ 알아차림의 알아차림

※ 스마트폰 카메라로 스캔하여 바로 접속하세요.
명심코칭의 3단계 변화는 [명심코칭 웹앱]과 함께 완성됩니다.

등록 독자 한정 특별 제공
1. 1:1 맞춤 헌정 힐링송(MP3) 무료 작곡 신청
2. 명심 AI 챗봇 20회 VIP 코칭 대화권 즉시 활성화
직접 접속 주소: https://myeongsimcoaching.com`
    },
    {
        pageNumber: 3,
        tag: '속표지 (Title Page)',
        title: '제로 포인트 (Zero Point)',
        content: `ZERO POINT
제로 포인트 (Zero Point)

내 안의 소음이 멈추고, 운명의 알고리즘이 리셋되는 순간

저자 이경윤
청 류`
    },
    {
        pageNumber: 4,
        tag: '목차 (Contents 1/2)',
        title: '전체 차례',
        content: `CONTENTS 목차

프롤로그 · 소음이 멈추는 곳, 제로 포인트 ...................................................... 6
제1부. 노이즈 오프 (Noise Off) : 자동 구동되는 앱을 끄다 ........................11
  1장. 달리는 자전거 위에서는 풍경이 보이지 않는다 ......................................12
  2장. 외로운 섬들의 연결망 / 상즉상입(相卽相入)을 잊은 고립감 ..................16
  3장. 무의식의 낡은 스크립트 스캔하기 ....................................................20
  4장. 정신의 배터리가 방전 신호를 보낼 때 / 자발적 로그아웃 .......................24
  5장. 타고난 기질이라는 생각의 감옥 / 오래된 알고리즘의 발견 .....................28

제2부. 제로 포인트 (Zero Point) : 알아차림을 알아차리다 ........................35
  1장. 가장 완벽한 멈춤, 제로 포인트 / 모든 앱 강제 종료의 순간 ..................36
  2장. 알아차림을 알아차릴 때 일어나는 일 ....................................................40
  3장. 내 마음의 스크린은 결코 찢어지지 않는다 ............................................43
  4장. 공적영지(空寂靈知), 텅 빈 고요 속의 신령한 빛 ...................................46`
    },
    {
        pageNumber: 5,
        tag: '목차 (Contents 2/2)',
        title: '전체 차례 (계속)',
        content: `제3부. 리라이트 (Rewrite) : 삶의 운영체제를 다시 쓰다 ...........................55
  1장. 순수 OS 레벨에서 코드를 수정하라 / 자동 반응의 고리를 끊는 자유 ......56
  2장. 프로그래밍된 운명을 해킹하는 법 / 사주와 기질의 한계를 뛰어넘다 ......59
  3장. 이완된 집중, 가장 부드럽고 강력한 에너지 ..........................................62
  4장. 인공지능의 시대, 인간이 인간으로 남는 단 하나의 영역 .........................65
  5장. 제로에서 시작하는 하루 / 매일 아침의 새로운 알고리즘 루틴 ...............69

에필로그 · 산은 다시 산이 되고, 물은 다시 물이 된다 (대자유의 여정) .....72
소음이 멈추는 그 찰나, 당신이라는 제로포인트 (20일과정) .......................75
자각 질문 (Self-Inquiry), 존재의 스펙트럼을 넓히는 시선 기법 (15일과정) ..186
[특별 섹션] 실전 명심코칭 워크북 가이드 (30일과정) ...............................248`
    },
    {
        pageNumber: 6,
        tag: '프롤로그 (Prologue 1/2)',
        title: '소음이 멈추는 곳, 제로 포인트',
        content: `종일 무언가에 쫓기듯 하루를 보내고 돌아와 불 꺼진 방에 가만히 누워 있을 때가 있습니다. 몸은 멈췄는데 머릿속은 여전히 낮에 들었던 날카로운 말들, 내일 해야 할 일들, 그리고 출처를 알 수 없는 막연한 불안감으로 웅성거립니다. 마치 수십 개의 프로그램을 동시에 돌리느라 뜨겁게 과열된 기계처럼, 뇌가 터질 것만 같은 순간들. 아마 당신에게도 그리 낯선 풍경은 아닐 겁니다.

그럴 때마다 우리는 습관적으로 세상을 향해 돋보기를 들이댑니다. 내가 왜 이렇게 불안한지 이유를 분석하고, 상황을 바꾸려 애쓰고, 마음을 고쳐먹으려 스스로를 다그칩니다. 조금 더 강해지면, 조금 더 많이 가지면 이 소란이 가라앉을까 싶어 정신의 배터리가 붉은빛을 깜빡이는데도 자꾸만 무언가를 더 채우려 듭니다.`
    },
    {
        pageNumber: 7,
        tag: '프롤로그 (Prologue 2/2)',
        title: '소음이 멈추는 곳, 제로 포인트',
        content: `하지만 채울수록 허기는 더해졌고, 세상과 촘촘히 연결될수록 외로움은 정직하게 깊어만 갔습니다. 내 삶의 주인이 정말 나인지, 아니면 세상이 짜 놓은 정교한 알고리즘에 끌려다니는 인형인지 분간하기조차 힘겨워질 때쯤, 저는 비로소 돋보기를 내려놓았습니다. 그리고 바깥으로만 향해 있던 시선을 안으로, 아주 천천히 돌려보았습니다.

그것은 내 상태를 날카롭게 분석하는 차가운 감시자가 되는 일이 아니었습니다. 그저, 이 소란스러운 생각과 감정들을 한 걸음 물러서서 가만히 지켜보는 투명한 눈을 갖는 일이었습니다.

옛사람들은 이 마음의 자리를 '공적영지(空寂靈知)'라는 깊은 언어로 불렀고, 현대의 심리학자들은 '알아차림을 알아차리는 상태'라고 말합니다. 복잡한 용어들을 다 걷어내고 나면, 결국 하나의 고요한 지점에 닿게 됩니다. 모든 소음이 멈추고 온전한 평정심만 남는 곳, 바로 이 책이 내내 머물게 될 '제로 포인트(Zero Point)'입니다.`
    },
    {
        pageNumber: 8,
        tag: '제1부 (Noise Off)',
        title: '1장. 달리는 자전거 위에서는 풍경이 보이지 않는다 (1/2)',
        content: `자전거를 타고 가파른 내리막길을 전속력으로 질주할 때를 떠올려 봅니다. 페달을 밟는 발에 힘이 들어가고 바퀴에 속도가 붙을수록, 기이하게도 눈앞의 시야는 점점 좁아집니다. 시속 10킬로미터로 달릴 때는 다정하게 인사하던 길가의 가로수와 이름 모를 들꽃들이, 속도가 올라갈수록 그저 하나의 흐릿한 선으로 초점 없이 뭉개져 스쳐 갈 뿐입니다.

그 순간 부딪히는 거센 바람 속에서 우리가 할 수 있는 일은 오직 하나입니다. 넘어지지 않기 위해, 살아남기 위해 바로 앞의 차가운 아스팔트 바닥만 매섭게 노려보는 것. 가속도가 붙은 자전거 위에서 풍경의 아름다움을 음미하기란 애초에 불가능한 일입니다.

어쩌면 지금을 살아가는 현대인들의 삶이 정확히 이 가파른 내리막길 위의 자전거를 닮아있는지도 모르겠습니다.`
    },
    {
        pageNumber: 9,
        tag: '제1부 (Noise Off)',
        title: '1장. 달리는 자전거 위에서는 풍경이 보이지 않는다 (2/2)',
        content: `문제는 속도가 한계치를 넘어설 때, 우리의 뇌와 마음에도 '시야 협착'이 일어난다는 사실입니다.
과속하는 삶 속에서는 내가 지금 어디로 가고 있는지, 내 마음이 얼마나 지쳐 부서지고 있는지 보이지 않습니다.

그저 나를 스쳐 지나가는 스트레스와 불안, 타인의 시선이라는 자극들이 거대하게 뭉개진 노이즈가 되어 내면을 가득 채울 뿐입니다. 뇌는 끊임없이 밀려드는 데이터를 처리하느라 쉴 새 없이 과열되고, 어느 순간부터는 내가 왜 이 페달을 밟고 있었는지 목적조차 잊어버린 채 그저 '달리는 상태' 자체에 중독되어 버립니다. 번아웃과 우울은 그 과속이 만들어낸 필연적인 급브레이크의 흔적입니다.

우리는 내 삶의 문제를 고치고 싶을 때 자꾸만 더 세게 페달을 밟으려 합니다. 하지만 틀렸습니다. 가속도가 붙은 상태에서는 내 안의 오래된 알고리즘이 어떻게 오작동하고 있는지 절대 읽어낼 수 없습니다.

꽉 쥐고 있던 핸들의 힘을 빼고, 서서히 브레이크를 잡아 속도를 줄이는 것입니다. 바퀴의 회전이 멈추고 자전거에서 완전히 내려와 발을 땅에 딛는 순간, 비로소 뭉개졌던 풍경들이 제 형태를 드러내며 선명하게 눈에 들어오기 시작합니다. 내 주위를 감싸고 있던 공기의 온도, 거칠어진 나의 숨소리, 그리고 내 안에서 쉼 없이 들끓던 생각의 정체들이 온전한 제 모습을 드러내는 순간입니다.

이것이 바로 내 삶의 고정된 패턴을 바꾸기 위한 첫 번째 관문, 모든 자극을 멈추고 나를 정밀하게 읽어내는 '스캔(Scan)'의 시작입니다. 멈춰 서야 비로소, 제대로 보이기 시작합니다.`
    }
];

// 🌐 도서관 다국어 번역 사전
// 🌐 도서관 다국어 번역 사전
const LIBRARY_I18N: Record<Language, any> = {
    kr: {
        title: "명심코칭 디지털 도서관",
        bookTitle: "《ZERO POINT (제로 포인트)》",
        bookSubtitle: "AWARENESS OF AWARENESS",
        catchphrase: "내 안의 소음이 멈추고, 운명의 알고리즘이 리셋되는 순간",
        authorInfo: "• 지은이: 이경윤 | 출판: 청류 (EDITIONS CHEONGRYU)",
        isbnInfo: "• e-ISBN: 979-11-220953-0-2",
        priceText: "11,000원",
        priceLabel: "• 정가:",
        fixedPriceLawBadge: "도서정가제 준수",
        officialBookBadge: "공식 출판 도서",
        totalPagesBadge: "총 309p",
        zoomInText: "크게보기",
        tabPdf: "309p 출판 원본 (PDF)",
        tabReader: "시력보호 e-리더",
        tabBenefits: "독자 VIP 특전",
        btnPreview: "📖 YES24 스타일 무료 미리보기 (Look Inside - 무료 15p)",
        buyYes24: "📗 YES24에서 구매",
        buySmartstore: "🛍️ 스마트스토어 구매",
        trialNoticeTitle: "의 맛보기 체험 안내",
        trialNoticeDesc: "현재 사이트 체험 모드로 이용 중이시며, 상단 [📖 무료 미리보기 (Look Inside)] 버튼을 통해 책의 핵심 내용을 바로 맛보실 수 있습니다.",
        trialNoticeBenefit: "💡 309p 출판 원문 전권 열람 및 VIP 2대 특전(헌정 힐링송 무료 작곡권, AI 코칭 대화권)은 아래 서점 주문번호 인증 즉시 평생 소장용으로 자동 활성화됩니다!",
        authSectionBadge: "👑 네이버 스마트스토어 구매자 전용 도서관",
        authSectionTitle: "스마트스토어 정품 구매 인증 및 도서관 열람",
        authNoticeTitle: "⚠️ 도서관 이용 권한 & 도서정가제 준수 안내",
        lawBadge: "법률 제22조 준수",
        authNoticeMain: "• 본 명심코칭 전자도서관(309p 전자책 완권)은 네이버 스마트스토어 도서 정품 구매 승인이 확인된 고객만 이용 가능합니다.",
        authNoticeLawBox: "⚖️ 『출판문화산업진흥법 제22조(도서정가제)』 엄격 준수 고지:\n본 서비스는 출판 간행물의 정가를 결제하고 정품 인증을 완료한 승인 회원에게만 1인 1열람 권한을 제공하며, 비구매자에 대한 무단 무료 열람 및 불법 배포를 엄격히 금지합니다.",
        authNoticeExternal: "• YES24 등 외부 서점 전자책 구매자님: 각 서점의 전용 뷰어(예: YES24 eBook 앱 또는 PC 뷰어)를 이용해 주시기 바랍니다.",
        platformLabel: "구매처",
        optSmartstore: "🛍️ 네이버 스마트스토어 (청류출판사) [도서관 전권 열람 전용]",
        optYes24: "📗 YES24 [특전 신청 - 전자책은 YES24 뷰어 이용]",
        optKyobo: "📚 교보문고 [특전 신청 - 전자책은 교보 뷰어 이용]",
        optBookk: "📖 부크크 [특전 신청]",
        optOther: "기타 서점",
        nameLabel: "구매자 성함",
        orderLabelField: "주문번호",
        yes24NoticeTitle: "📱 YES24 전자책(eBook) 구매 독자 안내",
        yes24ViewerBtn: "YES24 뷰어 바로가기",
        yes24NoticeBody: "YES24에서 전자책을 구매하신 독자님은 YES24 전용 전자책 뷰어(YES24 eBook 앱 또는 PC 웹 서재)를 이용해 주시기 바랍니다.",
        yes24NoticeBenefit: "🎁 아래에 YES24 주문번호를 입력하시면 명심코칭 도서관의 VIP 헌정 힐링송 작곡권 및 AI 코칭 20회 대화권이 즉시 활성화됩니다!",
        btnVerify: "✨ 1초 즉시 인증 및 전면 해금하기",
        soundLabBtn: "치유 사운드",
        homeBtn: "홈으로",
        drmTag: "DRM 2.0 포렌식 보안 적용",
        drmHeaderTitle: "[청류출판사 DRM 2.0 포렌식 보안 적용]",
        verifiedBadge: "정품 라이선스",
        ownerLabel: "• 소유자:",
        orderText: "주문:",
        licenseKeyLabel: "• 라이선스 키:",
        lawNoticeVerified: "⚖️ 도서정가제 준수 인증: 본 전자도서는 『출판문화산업진흥법 제22조』에 의거하여 정가 구매가 승인 확인된 회원 1인에게만 부여된 합법적 정품 라이선스입니다.",
        copyrightWarning: "⚖️ 저작권법 고지: 본 전자책에는 구매자 고유 디지털 워터마크가 각인되어 있습니다. 무단 캡처, 복제, 유출 시 저작권법 제136조에 따라 5년 이하의 징역 또는 5천만원 이하의 벌금형에 처해질 수 있습니다.",
        pdfViewTitle: "원문 PDF 열람",
        pdfStreamSub: "총 309p 정품 스트림",
        streamBadge: "YES24·교보 보안스트림 적용",
        adminDownload: "📥 관리자 다운로드",
        adminDownloading: "각인 중...",
        fullscreenBtn: "🖥️ 전체화면",
        safeReadingTag: "안심 정품 열람",
        drmStreamTag: "DRM 2.0 포렌식 각인 스트림",
        mobileHubTitle: "안심 모바일 리더 모드",
        mobileHubDesc: "모바일 화면에 최적화된 고화질 전체화면 뷰어로 즉시 연결됩니다.",
        mobileOpenBtn: "📱 모바일 고화질 전체화면 열기",
        screenSmallQuestion: "화면이 작게 느껴지시나요?",
        switchToFullscreen: "전체화면 모드로 전환 ➔",
        smartstoreNamePlaceholder: "예: 홍길동 (네이버페이 구매자 성함)",
        smartstoreOrderLabel: "네이버페이 주문번호 (16자리)",
        smartstoreOrderPlaceholder: "예: 20260904-12345678",
        smartstoreBtnText: "👑 네이버 스마트스토어 올인원 패키지 전면 해금하기",
        smartstoreVerifyingText: "네이버 스마트스토어 주문번호 검증 중...",
        smartstoreGuideBadge: "네이버 스마트스토어 VIP",
        yes24NamePlaceholder: "예: 홍길동 (YES24 주문자 성함)",
        yes24OrderLabel: "YES24 주문번호",
        yes24OrderPlaceholder: "예: 26090412345 (마이페이지 주문내역)",
        yes24BtnText: "📗 YES24 정품 독자 인증 및 도서 해금하기",
        yes24VerifyingText: "YES24 주문번호 검증 중...",
        yes24GuideBadge: "YES24 독자 전용",
        kyoboNamePlaceholder: "예: 홍길동 (교보문고 구매자 성함)",
        kyoboOrderLabel: "교보문고 주문/영수증 번호",
        kyoboOrderPlaceholder: "예: 202609040001 (주문내역 또는 영수증)",
        kyoboBtnText: "📚 교보문고 정품 독자 인증 및 도서 해금하기",
        kyoboVerifyingText: "교보문고 주문번호 검증 중...",
        kyoboGuideBadge: "교보문고 독자 전용",
        bookkNamePlaceholder: "예: 홍길동 (부크크 주문자 성함)",
        bookkOrderLabel: "부크크 주문번호",
        bookkOrderPlaceholder: "예: B20260904-1234",
        bookkBtnText: "📖 부크크 정품 독자 인증 및 도서 해금하기",
        bookkVerifyingText: "부크크 주문번호 검증 중...",
        bookkGuideBadge: "부크크 독자 전용",
        errNameRequired: "네이버 스마트스토어 결제 시 입력하신 구매자 성함을 입력해주세요.",
        errOrderRequired: "네이버페이 결제내역의 주문번호(16자리)를 올바르게 입력해주세요. (예: 20260904-12345678)",
        brainwaveSoundLab: "🎧 뇌파 치유 사운드 랩",
        solfeggioMixing: "6대 솔페지오 & 자연음 믹싱",
        downloadPersonalPdf: "소장용 다운로드",
        goToPdfTab: "309p 출판원문 ➔",
        zoomOut: "축소",
        zoomIn: "확대",
        mobileOptimizedBadge: "스마트폰 최적화 스트리밍",
        mobileBookTitle: "《ZERO POINT》 309p 정품 열람",
        mobileStreamDesc: "스마트폰 브라우저에서는 아래 전용 버튼을 통해 내장 고화질 뷰어로 309페이지 원문을 시원하게 확대/축소하며 감상하실 수 있습니다.",
        openMobilePdfBtn: "🚀 모바일 고화질 PDF 바로 열기",
        openFullscreenViewerBtn: "🖥️ 보안 전체화면 모드로 보기",
        switchToReaderBtn: "✨ 시력보호 e-Reader (텍스트)로 읽기",
        vipTabTitle: "《제로포인트》 독자 한정 2대 특별 특전",
        vipTabSub: "책 2페이지 및 308페이지 수록 혜택",
        vipBenefit1Title: "1. 1:1 맞춤 헌정 힐링송(MP3) 무료 작곡 신청",
        vipBenefit1Desc: "대표님의 사주 기질과 주파수(432Hz/528Hz)를 분석하여 세상에 단 하나뿐인 전용 치유 음원을 무료로 작곡하여 증정합니다.",
        vipBenefit1Btn: "🎵 헌정 힐링송 무료 작곡 신청하기 ➔",
        vipBenefit2Title: "2. 명심 AI 챗봇 20회 VIP 코칭 대화권 즉시 활성화",
        vipBenefit2Desc: "책을 읽다 생긴 의문이나 다크코드 디버깅을 명심 AI 수석 코치와 20회 동안 1:1 심층 상담할 수 있는 VIP 이용권이 자동 지급되었습니다.",
        vipBenefit2Btn: "💬 명심 AI VIP 코칭 시작하기 ➔",
        closeBtn: "닫기",
        fullscreenTitle: "《ZERO POINT》 전체화면 뷰어",
        licenseBadgeLabel: "라이선스",
        mobileFullscreenNativeTitle: "모바일 전체화면 네이티브 열람",
        mobileFullscreenNativeDesc: "스마트폰 브라우저에서는 아래 버튼을 누르면 스마트폰 전용 고화질 PDF 뷰어로 309페이지를 초고화질로 편안하게 확대/축소하며 감상하실 수 있습니다.",
        openMobileNativePdfBtn: "🚀 스마트폰 고화질 PDF 열기",
        coverModalTitle: "《ZERO POINT (제로 포인트)》 공식 출판 표지",
        coverModalAuthor: "지은이: 이경윤 | 출판: 청류 (EDITIONS CHEONGRYU) · 979-11-220953-0-2",
        coverModalDismiss: "(화면 아무 곳이나 누르면 닫힙니다)",
        previewModalTitle: "《ZERO POINT》 미리보기",
        previewEndTitle: "🎉 무료 미리보기가 여기까지입니다!",
        previewEndDesc: "다음 장부터 제2부 제로포인트의 감정 연금술과 20일 기적의 실전 자각 훈련(75~185p) 전문이 본격적으로 펼쳐집니다!",
        previewBuyYes24: "📗 YES24에서 구매하고 전편 읽기 ➔",
        previewBuySmartstore: "🛍️ 청류스마트스토어 올인원 패키지 구매 ➔",
        previewAlreadyBought: "🔑 이미 구매하셨다면? 구매 인증하고 전편 해금하기",
        prevPageBtn: "← 이전 페이지",
        nextPageBtn: "다음 페이지 →"
    },
    en: {
        title: "Myeongsim Digital Library",
        bookTitle: "《ZERO POINT》",
        bookSubtitle: "AWARENESS OF AWARENESS",
        catchphrase: "When the inner noise stops, the algorithm of destiny resets",
        authorInfo: "• Author: Kyeong-Yoon Lee | Publisher: Cheongryu (EDITIONS CHEONGRYU)",
        isbnInfo: "• e-ISBN: 979-11-220953-0-2",
        priceText: "KRW 11,000",
        priceLabel: "• List Price:",
        fixedPriceLawBadge: "Fixed Price Law Compliant",
        officialBookBadge: "Official Publication",
        totalPagesBadge: "Total 309p",
        zoomInText: "Zoom In",
        tabPdf: "309p Original (PDF)",
        tabReader: "Eye-Care e-Reader",
        tabBenefits: "VIP Benefits",
        btnPreview: "📖 Look Inside (Free 15p Preview)",
        buyYes24: "📗 Buy on YES24",
        buySmartstore: "🛍️ Buy on SmartStore",
        trialNoticeTitle: "'s Preview Experience Guide",
        trialNoticeDesc: "You are currently in site preview mode. Click the [📖 Look Inside] button above to explore key highlights.",
        trialNoticeBenefit: "💡 Reading the full 309p published text and unlocking 2 VIP perks (custom healing song, AI coaching) will activate permanently upon order verification below!",
        authSectionBadge: "👑 SmartStore Buyer Exclusive Library",
        authSectionTitle: "SmartStore Genuine Verification & Reading",
        authNoticeTitle: "⚠️ Library Access & Fixed Book Price Law Notice",
        lawBadge: "Article 22 Compliant",
        authNoticeMain: "• This digital library (full 309p e-Book) is strictly available only to customers whose genuine purchase on Naver SmartStore has been verified.",
        authNoticeLawBox: "⚖️ Strict Compliance with Article 22 of Publishing Industry Promotion Act (Fixed Book Price Law):\nThis service grants single-reader access strictly to verified buyers who paid the fixed statutory retail price. Unauthorized free access or illicit distribution to non-buyers is strictly prohibited.",
        authNoticeExternal: "• Buyers from external bookstores (YES24, etc.): Please use the dedicated viewer of each bookstore (e.g. YES24 eBook App or PC Viewer).",
        platformLabel: "Purchase Platform",
        optSmartstore: "🛍️ Naver SmartStore (Cheongryu) [Full Reading Exclusive]",
        optYes24: "📗 YES24 [Benefit Claim - Use YES24 Viewer for e-Book]",
        optKyobo: "📚 Kyobo [Benefit Claim - Use Kyobo Viewer for e-Book]",
        optBookk: "📖 Bookk [Benefit Claim]",
        optOther: "Other Bookstores",
        nameLabel: "Buyer Name",
        orderLabelField: "Order Number",
        yes24NoticeTitle: "📱 YES24 e-Book Reader Notice",
        yes24ViewerBtn: "Go to YES24 Viewer",
        yes24NoticeBody: "Readers who purchased the e-Book on YES24 are advised to use the dedicated YES24 eBook App or PC Web Library.",
        yes24NoticeBenefit: "🎁 Enter your YES24 Order Number below to activate your VIP Dedicated Healing Song Composition & 20 AI Coaching Sessions!",
        btnVerify: "✨ Verify & Unlock in 1 Sec",
        soundLabBtn: "Healing Sound",
        homeBtn: "Home",
        drmTag: "DRM 2.0 Forensic Security Applied",
        drmHeaderTitle: "[Cheongryu DRM 2.0 Forensic Security Applied]",
        verifiedBadge: "Official License",
        ownerLabel: "• Owner:",
        orderText: "Order:",
        licenseKeyLabel: "• License Key:",
        lawNoticeVerified: "⚖️ Fixed Price Law Verified: This e-Book is a legitimate single-user license granted strictly to a verified buyer paying full statutory price under Article 22.",
        copyrightWarning: "⚖️ Copyright Notice: This e-Book contains a unique forensic digital watermark. Unauthorized capture, duplication, or leak is subject to criminal prosecution under copyright laws.",
        pdfViewTitle: "Original PDF View",
        pdfStreamSub: "309p Official Stream",
        streamBadge: "Secure DRM Streaming",
        adminDownload: "📥 Admin Download",
        adminDownloading: "Watermarking...",
        fullscreenBtn: "🖥️ Fullscreen",
        safeReadingTag: "Official Reading",
        drmStreamTag: "DRM 2.0 Forensic Stream",
        mobileHubTitle: "Secure Mobile Reader Mode",
        mobileHubDesc: "Optimized high-definition fullscreen viewer for mobile screens.",
        mobileOpenBtn: "📱 Open Mobile Fullscreen",
        screenSmallQuestion: "Does the screen feel small?",
        switchToFullscreen: "Switch to Fullscreen ➔",
        smartstoreNamePlaceholder: "e.g. John Doe (Naver Pay Buyer Name)",
        smartstoreOrderLabel: "Naver Pay Order Number (16 digits)",
        smartstoreOrderPlaceholder: "e.g. 20260904-12345678",
        smartstoreBtnText: "👑 Unlock Naver SmartStore All-in-One Package",
        smartstoreVerifyingText: "Verifying SmartStore Order Number...",
        smartstoreGuideBadge: "Naver SmartStore VIP",
        yes24NamePlaceholder: "e.g. John Doe (YES24 Buyer Name)",
        yes24OrderLabel: "YES24 Order Number",
        yes24OrderPlaceholder: "e.g. 26090412345 (Order History)",
        yes24BtnText: "📗 Verify YES24 Reader & Unlock Book",
        yes24VerifyingText: "Verifying YES24 Order Number...",
        yes24GuideBadge: "YES24 Reader Exclusive",
        kyoboNamePlaceholder: "e.g. John Doe (Kyobo Buyer Name)",
        kyoboOrderLabel: "Kyobo Order / Receipt Number",
        kyoboOrderPlaceholder: "e.g. 202609040001 (Order History)",
        kyoboBtnText: "📚 Verify Kyobo Reader & Unlock Book",
        kyoboVerifyingText: "Verifying Kyobo Order Number...",
        kyoboGuideBadge: "Kyobo Reader Exclusive",
        bookkNamePlaceholder: "e.g. John Doe (Bookk Buyer Name)",
        bookkOrderLabel: "Bookk Order Number",
        bookkOrderPlaceholder: "e.g. B20260904-1234",
        bookkBtnText: "📖 Verify Bookk Reader & Unlock Book",
        bookkVerifyingText: "Verifying Bookk Order Number...",
        bookkGuideBadge: "Bookk Reader Exclusive",
        errNameRequired: "Please enter the buyer's name used during payment.",
        errOrderRequired: "Please enter a valid 16-digit order number. (e.g. 20260904-12345678)",
        brainwaveSoundLab: "🎧 Brainwave Sound Lab",
        solfeggioMixing: "6 Solfeggio & Nature Mix",
        downloadPersonalPdf: "Download PDF",
        goToPdfTab: "309p Full Text ➔",
        zoomOut: "Zoom Out",
        zoomIn: "Zoom In",
        mobileOptimizedBadge: "Smartphone Optimized Stream",
        mobileBookTitle: "《ZERO POINT》 309p Official Stream",
        mobileStreamDesc: "On mobile browsers, tap the button below to comfortably read and zoom the full 309-page text via the built-in HD viewer.",
        openMobilePdfBtn: "🚀 Open Mobile High-Res PDF",
        openFullscreenViewerBtn: "🖥️ Open Secure Fullscreen Mode",
        switchToReaderBtn: "✨ Read with Eye-Care e-Reader",
        vipTabTitle: "《ZERO POINT》 Exclusive 2 VIP Reader Perks",
        vipTabSub: "Perks featured on pages 2 and 308 of the book",
        vipBenefit1Title: "1. Free 1:1 Custom Dedicated Healing Song (MP3)",
        vipBenefit1Desc: "We analyze your natural energy disposition and resonance frequency (432Hz/528Hz) to compose a one-of-a-kind personal healing soundtrack for free.",
        vipBenefit1Btn: "🎵 Apply for Free Healing Song Composition ➔",
        vipBenefit2Title: "2. Myeongsim AI VIP Coaching (20 Sessions) Activated",
        vipBenefit2Desc: "A VIP pass allowing 20 in-depth 1:1 coaching sessions with Myeongsim AI to clarify questions and debug unconscious dark codes has been granted.",
        vipBenefit2Btn: "💬 Start Myeongsim AI VIP Coaching ➔",
        closeBtn: "Close",
        fullscreenTitle: "《ZERO POINT》 Fullscreen Viewer",
        licenseBadgeLabel: "License",
        mobileFullscreenNativeTitle: "Mobile Native Fullscreen Reading",
        mobileFullscreenNativeDesc: "Tap the button below to open in your smartphone high-definition viewer, allowing comfortable zoom and smooth navigation across 309 pages.",
        openMobileNativePdfBtn: "🚀 Open Smartphone HD PDF",
        coverModalTitle: "《ZERO POINT》 Official Book Cover",
        coverModalAuthor: "Author: Kyeong-Yoon Lee | Publisher: Cheongryu · 979-11-220953-0-2",
        coverModalDismiss: "(Click anywhere on the screen to close)",
        previewModalTitle: "《ZERO POINT》 Preview",
        previewEndTitle: "🎉 That's the end of the free preview!",
        previewEndDesc: "From the next chapter, Part 2 Emotional Alchemy of Zero Point and the 20-Day Miraculous Awareness Training (pp. 75-185) begin!",
        previewBuyYes24: "📗 Buy on YES24 & Read Full Book ➔",
        previewBuySmartstore: "🛍️ Buy Cheongryu SmartStore All-in-One Package ➔",
        previewAlreadyBought: "🔑 Already purchased? Verify & Unlock Full Book",
        prevPageBtn: "← Previous",
        nextPageBtn: "Next →"
    },
    jp: {
        title: "明心コーチング電子図書館",
        bookTitle: "《ZERO POINT (ゼロポイント)》",
        bookSubtitle: "AWARENESS OF AWARENESS",
        catchphrase: "心の中のノイズが静まり、運命のアルゴリズムがリセットされる瞬間",
        authorInfo: "• 著者: イ・ギョンユン | 出版: 晴流 (EDITIONS CHEONGRYU)",
        isbnInfo: "• e-ISBN: 979-11-220953-0-2",
        priceText: "11,000ウォン",
        priceLabel: "• 定価:",
        fixedPriceLawBadge: "定価法遵守",
        officialBookBadge: "公式出版図書",
        totalPagesBadge: "全 309p",
        zoomInText: "拡大表示",
        tabPdf: "309p 出版原本 (PDF)",
        tabReader: "視力保護 e-リーダー",
        tabBenefits: "読者VIP特典",
        btnPreview: "📖 試し読み (Look Inside - 無料15p)",
        buyYes24: "📗 YES24で購入",
        buySmartstore: "🛍️ ストアで購入",
        trialNoticeTitle: "様のお試し体験のご案内",
        trialNoticeDesc: "現在サイト体験モードでご利用中です。上部の「📖 試し読み (Look Inside)」ボタンから主要内容をお試しいただけます。",
        trialNoticeBenefit: "💡 309p出版原本の全編閲覧およびVIP2大特典(治癒ソング作曲権、AI対話権)は、下記注文番号認証により即時生涯有効化されます！",
        authSectionBadge: "👑 ネイバーストア購入者専用図書館",
        authSectionTitle: "ストア正規購入認証＆図書館閲覧",
        authNoticeTitle: "⚠️ 図書館利用権限＆定価法遵守のご案内",
        lawBadge: "法律第22条遵守",
        authNoticeMain: "• 本電子図書館(全309p電子書籍)は、ネイバーストアでの正規品購入が承認確認されたお客様のみご利用いただけます。",
        authNoticeLawBox: "⚖️ 『出版文化産業振興法第22条(定価法)』厳格遵守告知：\n本サービスは定価をお支払いいただき正規認証を完了した承認会員様のみに1人1閲覧権を付与し、未購入者への無断無料閲覧および違法配布を固く禁じます。",
        authNoticeExternal: "• YES24等の外部書店電子書籍購入者様：各書店の専用リーダー(YES24 eBookアプリ等)をご利用ください。",
        platformLabel: "購入先",
        optSmartstore: "🛍️ ネイバーストア (晴流) [図書館全編閲覧専用]",
        optYes24: "📗 YES24 [特典申請 - 電子書籍はYES24リーダーをご利用ください]",
        optKyobo: "📚 教保文庫 [特典申請 - 電子書籍は教保リーダーをご利用ください]",
        optBookk: "📖 Bookk [特典申請]",
        optOther: "その他の書店",
        nameLabel: "購入者氏名",
        orderLabelField: "注文番号",
        yes24NoticeTitle: "📱 YES24 電子書籍ご購入の読者様へ",
        yes24ViewerBtn: "YES24リーダーへ移動",
        yes24NoticeBody: "YES24で電子書籍を購入された読者様は、YES24専用リーダー(YES24 eBookアプリまたはPCウェブ本棚)をご利用ください。",
        yes24NoticeBenefit: "🎁 下記にYES24注文番号を入力すると、VIP治癒ソング作曲権とAIコーチング20回利用権が即時有効化されます！",
        btnVerify: "✨ 1秒即時認証＆全編解放",
        soundLabBtn: "治癒サウンド",
        homeBtn: "ホーム",
        drmTag: "DRM 2.0 真正性保護適用",
        drmHeaderTitle: "[晴流出版社 DRM 2.0 真正性セキュリティ適用]",
        verifiedBadge: "正規ライセンス",
        ownerLabel: "• 所有者:",
        orderText: "注文:",
        licenseKeyLabel: "• ライセンスキー:",
        lawNoticeVerified: "⚖️ 定価法遵守認証：本電子書籍は『出版文化産業振興法第22条』に基づき定価購入が承認された会員様1名にのみ付与された適法ライセンスです。",
        copyrightWarning: "⚖️ 著作権法告知：本電子書籍には購入者固有のデジタル透かしが刻印されています。無断キャプチャや複製・流出時は著作権法第136条により刑事処罰の対象となります。",
        pdfViewTitle: "原本PDF閲覧",
        pdfStreamSub: "全309p 正規品ストリーム",
        streamBadge: "安全ストリーミング適用",
        adminDownload: "📥 管理者ダウンロード",
        adminDownloading: "刻印中...",
        fullscreenBtn: "🖥️ 全画面",
        safeReadingTag: "安心の正規品閲覧",
        drmStreamTag: "DRM 2.0 真正性ストリーム",
        mobileHubTitle: "安心モバイルリーダーモード",
        mobileHubDesc: "モバイル画面に最適化された高画質全画面ビューアへ即時接続します。",
        mobileOpenBtn: "📱 モバイル高画質全画面を開く",
        screenSmallQuestion: "画面が小さく感じられますか？",
        switchToFullscreen: "全画面モードに切り替え ➔",
        smartstoreNamePlaceholder: "例: 山田太郎 (ストア購入者氏名)",
        smartstoreOrderLabel: "ストア注文番号 (16桁)",
        smartstoreOrderPlaceholder: "例: 20260904-12345678",
        smartstoreBtnText: "👑 ストア All-in-One パッケージを全編解放",
        smartstoreVerifyingText: "ストア注文番号を検証中...",
        smartstoreGuideBadge: "ネイバーストア VIP",
        yes24NamePlaceholder: "例: 山田太郎 (YES24購入者氏名)",
        yes24OrderLabel: "YES24注文番号",
        yes24OrderPlaceholder: "例: 26090412345 (注文履歴)",
        yes24BtnText: "📗 YES24正規読者認証＆全編解放",
        yes24VerifyingText: "YES24注文番号を検証中...",
        yes24GuideBadge: "YES24読者専用",
        kyoboNamePlaceholder: "例: 山田太郎 (教保文庫購入者氏名)",
        kyoboOrderLabel: "教保文庫注文/レシート番号",
        kyoboOrderPlaceholder: "例: 202609040001 (注文履歴)",
        kyoboBtnText: "📚 教保文庫正規読者認証＆全編解放",
        kyoboVerifyingText: "教保文庫注文番号を検証中...",
        kyoboGuideBadge: "教保文庫読者専用",
        bookkNamePlaceholder: "例: 山田太郎 (Bookk購入者氏名)",
        bookkOrderLabel: "Bookk注文番号",
        bookkOrderPlaceholder: "例: B20260904-1234",
        bookkBtnText: "📖 Bookk正規読者認証＆全編解放",
        bookkVerifyingText: "Bookk注文番号を検証中...",
        bookkGuideBadge: "Bookk読者専用",
        errNameRequired: "決済時に入力された購入者氏名を入力してください。",
        errOrderRequired: "注文番号を正しく入力してください。(例: 20260904-12345678)",
        brainwaveSoundLab: "🎧 脳波治癒サウンドラボ",
        solfeggioMixing: "6大ソルフェジオ＆自然音ミキシング",
        downloadPersonalPdf: "保存用ダウンロード",
        goToPdfTab: "309p 出版原本 ➔",
        zoomOut: "縮小",
        zoomIn: "拡大",
        mobileOptimizedBadge: "スマホ最適化ストリーミング",
        mobileBookTitle: "《ZERO POINT》 309p 正規品閲覧",
        mobileStreamDesc: "スマホブラウザでは、下記の専用ボタンから内蔵高画質ビューアで309ページの原本を快適に拡大・縮小してご覧いただけます。",
        openMobilePdfBtn: "🚀 モバイル高画質PDFを直接開く",
        openFullscreenViewerBtn: "🖥️ セキュリティ全画面モードで表示",
        switchToReaderBtn: "✨ 視力保護e-Readerで読む",
        vipTabTitle: "《ZERO POINT》読者限定 2大特別特典",
        vipTabSub: "書籍2ページおよび308ページ掲載特典",
        vipBenefit1Title: "1. 1:1オーダーメイド治癒ソング(MP3)無料作曲申請",
        vipBenefit1Desc: "お客様の四柱推命気質と周波数(432Hz/528Hz)を分析し、世界で唯一の専用ヒーリング音源を無料で作曲・進呈します。",
        vipBenefit1Btn: "🎵 治癒ソング無料作曲を申し込む ➔",
        vipBenefit2Title: "2. 明心AI 20回 VIPコーチング対話権 即時有効化",
        vipBenefit2Desc: "読書中の疑問やダークコードのデバッグを、明心AI首席コーチと20回にわたり1:1で深層相談できるVIP利用権が付与されました。",
        vipBenefit2Btn: "💬 明心AI VIPコーチングを始める ➔",
        closeBtn: "閉じる",
        fullscreenTitle: "《ZERO POINT》 全画面ビューア",
        licenseBadgeLabel: "ライセンス",
        mobileFullscreenNativeTitle: "モバイル全画面ネイティブ閲覧",
        mobileFullscreenNativeDesc: "スマホブラウザでは、下記のボタンを押すとスマホ専用の高画質PDFビューアで309ページを超高画質で快適に拡大・縮小してご覧いただけます。",
        openMobileNativePdfBtn: "🚀 スマホ高画質PDFを開く",
        coverModalTitle: "《ZERO POINT (ゼロポイント)》 公式出版表紙",
        coverModalAuthor: "著者: イ・ギョンユン | 出版: 晴流 · 979-11-220953-0-2",
        coverModalDismiss: "(画面のどこかをクリックすると閉じます)",
        previewModalTitle: "《ZERO POINT》 試し読み",
        previewEndTitle: "🎉 無料の試し読みはここまでです！",
        previewEndDesc: "次の章から第2部ゼロポイントの感情錬金術と20日間の奇跡の実践自覚訓練(75〜185p)の全文が本格的に展開されます！",
        previewBuyYes24: "📗 YES24で購入して全編を読む ➔",
        previewBuySmartstore: "🛍️ 晴流ストア All-in-One パッケージを購入 ➔",
        previewAlreadyBought: "🔑 すでにご購入済みですか？ 購入認証して全編解放",
        prevPageBtn: "← 前のページ",
        nextPageBtn: "次のページ →"
    },
    cn: {
        title: "明心教练电子图书馆",
        bookTitle: "《ZERO POINT (零点)》",
        bookSubtitle: "AWARENESS OF AWARENESS",
        catchphrase: "当内在噪音止息，命运算法重置的瞬间",
        authorInfo: "• 作者: 李庆润 | 出版: 清流 (EDITIONS CHEONGRYU)",
        isbnInfo: "• e-ISBN: 979-11-220953-0-2",
        priceText: "11,000韩元",
        priceLabel: "• 定价:",
        fixedPriceLawBadge: "遵循图书定价法",
        officialBookBadge: "官方出版图书",
        totalPagesBadge: "共 309页",
        zoomInText: "点击放大",
        tabPdf: "309页 原版 (PDF)",
        tabReader: "护眼电子阅读器",
        tabBenefits: "读者VIP特权",
        btnPreview: "📖 免费试读 (Look Inside - 15页)",
        buyYes24: "📗 YES24 购买",
        buySmartstore: "🛍️ 官方商城购买",
        trialNoticeTitle: "的试读体验指南",
        trialNoticeDesc: "您当前处于网站体验模式，可通过上方的[📖 免费试读 (Look Inside)]按钮抢先体验核心精彩内容。",
        trialNoticeBenefit: "💡 309页完整正版阅读及VIP两大特权（定制疗愈颂、AI教练对话券）在下方验证订单号后立即永久激活！",
        authSectionBadge: "👑 官方商城购买者专用图书馆",
        authSectionTitle: "官方商城正版验证与图书馆阅读",
        authNoticeTitle: "⚠️ 图书馆使用权限与图书定价法须知",
        lawBadge: "遵循法律第22条",
        authNoticeMain: "• 本明心教练电子图书馆（309页全本电子书）仅限在官方微店/商城正版购买并审核通过的用户使用。",
        authNoticeLawBox: "⚖️ 严格遵循《出版物定价管理法》相关法规：\n本服务仅向支付全额定价并完成正版认证的核准会员提供一人一权阅读权限，严禁向未购买者提供免费阅读或非法传播。",
        authNoticeExternal: "• YES24等外部电子书平台购买者：请使用各平台专属阅读器（如 YES24 eBook 应用或网页阅读器）进行阅读。",
        platformLabel: "购买渠道",
        optSmartstore: "🛍️ 官方商城 (清流) [图书馆全本阅读专用]",
        optYes24: "📗 YES24 [特权领取 - 电子书请使用YES24阅读器]",
        optKyobo: "📚 教保文库 [特权领取 - 电子书请使用教保阅读器]",
        optBookk: "📖 Bookk [特权领取]",
        optOther: "其他书店",
        nameLabel: "购买者姓名",
        orderLabelField: "订单号",
        yes24NoticeTitle: "📱 YES24 电子书购买读者须知",
        yes24ViewerBtn: "前往 YES24 阅读器",
        yes24NoticeBody: "在 YES24 购买电子书的读者，请使用 YES24 专属阅读器（YES24 eBook 应用或电脑网页书架）阅读。",
        yes24NoticeBenefit: "🎁 在下方输入 YES24 订单号，即可瞬间激活 VIP 专属疗愈颂定制权及 20 次 AI 深度教练对话特权！",
        btnVerify: "✨ 1秒即刻验证与解锁",
        soundLabBtn: "疗愈声音",
        homeBtn: "主页",
        drmTag: "DRM 2.0 版权保护应用",
        drmHeaderTitle: "[清流出版社 DRM 2.0 取证安全保护应用]",
        verifiedBadge: "正版授权",
        ownerLabel: "• 持有人:",
        orderText: "订单:",
        licenseKeyLabel: "• 授权密钥:",
        lawNoticeVerified: "⚖️ 图书定价法认证：本电子图书为严格依照《出版物定价管理法》第22条向全额正版购买核准会员提供的一对一合法专属许可。",
        copyrightWarning: "⚖️ 版权法声明：本电子书内嵌购买者专属数字取证水印。严禁截屏、盗印或非法传播，违者将依法追究刑事与民事法律责任。",
        pdfViewTitle: "原版PDF阅读",
        pdfStreamSub: "共309页 正版加密阅读",
        streamBadge: "安全加密流式阅读",
        adminDownload: "📥 管理员下载",
        adminDownloading: "水印刻印中...",
        fullscreenBtn: "🖥️ 全屏模式",
        safeReadingTag: "正版安心阅读",
        drmStreamTag: "DRM 2.0 取证加密流",
        mobileHubTitle: "移动端安全阅读模式",
        mobileHubDesc: "即刻进入适配移动端屏幕的高清全屏阅读器。",
        mobileOpenBtn: "📱 开启移动端高清全屏",
        screenSmallQuestion: "感觉画面太小了吗？",
        switchToFullscreen: "切换至全屏模式 ➔",
        smartstoreNamePlaceholder: "例: 张三 (官方商城购买者姓名)",
        smartstoreOrderLabel: "官方商城订单号 (16位数字)",
        smartstoreOrderPlaceholder: "例: 20260904-12345678",
        smartstoreBtnText: "👑 全面解锁官方商城 All-in-One 全套正版礼包",
        smartstoreVerifyingText: "正在验证官方商城订单号...",
        smartstoreGuideBadge: "官方商城 VIP",
        yes24NamePlaceholder: "例: 张三 (YES24购买者姓名)",
        yes24OrderLabel: "YES24 订单号",
        yes24OrderPlaceholder: "例: 26090412345 (个人中心订单记录)",
        yes24BtnText: "📗 YES24正版读者验证并解锁特权",
        yes24VerifyingText: "正在验证 YES24 订单号...",
        yes24GuideBadge: "YES24读者专属",
        kyoboNamePlaceholder: "例: 张三 (教保文库购买者姓名)",
        kyoboOrderLabel: "教保文库订单/收据号",
        kyoboOrderPlaceholder: "例: 202609040001 (订单记录)",
        kyoboBtnText: "📚 教保文库正版读者验证并解锁特权",
        kyoboVerifyingText: "正在验证教保文库订单号...",
        kyoboGuideBadge: "教保文库读者专属",
        bookkNamePlaceholder: "例: 张三 (Bookk购买者姓名)",
        bookkOrderLabel: "Bookk 订单号",
        bookkOrderPlaceholder: "例: B20260904-1234",
        bookkBtnText: "📖 Bookk正版读者验证并解锁特权",
        bookkVerifyingText: "正在验证 Bookk 订单号...",
        bookkGuideBadge: "Bookk读者专属",
        errNameRequired: "请输入购买时填写的购买者姓名。",
        errOrderRequired: "请正确输入订单号。(例: 20260904-12345678)",
        brainwaveSoundLab: "🎧 脑波疗愈声音工坊",
        solfeggioMixing: "6大索尔菲吉欧频率与自然混音",
        downloadPersonalPdf: "下载典藏版",
        goToPdfTab: "309页出版原著 ➔",
        zoomOut: "缩小",
        zoomIn: "放大",
        mobileOptimizedBadge: "手机优化加密流",
        mobileBookTitle: "《ZERO POINT》 309页 正版阅读",
        mobileStreamDesc: "在移动端浏览器中，可通过下方专属按钮使用内置高清阅读器舒适缩放浏览309页全本原著。",
        openMobilePdfBtn: "🚀 直接打开移动端高清PDF",
        openFullscreenViewerBtn: "🖥️ 安全全屏模式阅读",
        switchToReaderBtn: "✨ 使用护眼电子阅读器阅读",
        vipTabTitle: "《零点》读者专属 2大独家VIP特权",
        vipTabSub: "本书第2页及第308页所载专属福利",
        vipBenefit1Title: "1. 1对1专属定制疗愈颂(MP3)免费作曲申请",
        vipBenefit1Desc: "深度分析您的生辰五行气韵与疗愈共振频率(432Hz/528Hz)，免费为您专属定制世间绝无仅有的疗愈音频。",
        vipBenefit1Btn: "🎵 免费申请专属疗愈颂作曲 ➔",
        vipBenefit2Title: "2. 明心AI 20次 VIP深度教练对话权益即刻激活",
        vipBenefit2Desc: "已自动发放VIP特权卡，可与明心AI首席教练进行20次一对一深度对谈，解答阅读疑问并调试潜意识暗黑代码。",
        vipBenefit2Btn: "💬 开启明心AI VIP教练对谈 ➔",
        closeBtn: "关闭",
        fullscreenTitle: "《零点》全屏阅读器",
        licenseBadgeLabel: "授权",
        mobileFullscreenNativeTitle: "移动端原生全屏阅读",
        mobileFullscreenNativeDesc: "在手机浏览器中点击下方按钮，即可使用手机专属超清PDF阅读器，舒适缩放沉浸式阅读309页全本。",
        openMobileNativePdfBtn: "🚀 打开手机高清PDF",
        coverModalTitle: "《ZERO POINT (零点)》 官方正版封面",
        coverModalAuthor: "作者: 李庆润 | 出版: 清流 · 979-11-220953-0-2",
        coverModalDismiss: "(点击屏幕任意位置即可关闭)",
        previewModalTitle: "《零点》试读",
        previewEndTitle: "🎉 免费试读到此结束！",
        previewEndDesc: "下一章将正式展开第2部《零点的情绪炼金术》以及长达20天的奇迹觉察实战训练（第75~185页）全本内容！",
        previewBuyYes24: "📗 在 YES24 购买并阅读全书 ➔",
        previewBuySmartstore: "🛍️ 购买清流官方商城 All-in-One 尊享礼包 ➔",
        previewAlreadyBought: "🔑 已经购买？立刻验证并解锁全书",
        prevPageBtn: "← 上一页",
        nextPageBtn: "下一页 →"
    }
};


export default function LibraryPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const tLib = LIBRARY_I18N[language] || LIBRARY_I18N.kr;

    // 구매 인증 상태 (로컬스토리지 연동)
    const [isVerified, setIsVerified] = useState(false);
    const [buyerName, setBuyerName] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [serialKey, setSerialKey] = useState('');
    const [purchasePlatform, setPurchasePlatform] = useState('smartstore');
    const [verificationError, setVerificationError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isBlockedByAdmin, setIsBlockedByAdmin] = useState(false);
    const [blockedReason, setBlockedReason] = useState('');
    // 🏪 서점 플랫폼별 맞춤 라벨 & 안내 (스마트스토어, YES24, 교보문고 등)
    const platformConfig = useMemo(() => {
        switch (purchasePlatform) {
            case 'yes24':
                return {
                    namePlaceholder: tLib.yes24NamePlaceholder,
                    orderLabel: tLib.yes24OrderLabel,
                    orderPlaceholder: tLib.yes24OrderPlaceholder,
                    btnText: tLib.yes24BtnText,
                    verifyingText: tLib.yes24VerifyingText,
                    guideBadge: tLib.yes24GuideBadge,
                    bannerNotice: tLib.yes24NoticeBody,
                    externalViewerUrl: 'https://www.yes24.com/Member/FTMypageEBookList.aspx'
                };
            case 'kyobo':
                return {
                    namePlaceholder: tLib.kyoboNamePlaceholder,
                    orderLabel: tLib.kyoboOrderLabel,
                    orderPlaceholder: tLib.kyoboOrderPlaceholder,
                    btnText: tLib.kyoboBtnText,
                    verifyingText: tLib.kyoboVerifyingText,
                    guideBadge: tLib.kyoboGuideBadge
                };
            case 'bookk':
                return {
                    namePlaceholder: tLib.bookkNamePlaceholder,
                    orderLabel: tLib.bookkOrderLabel,
                    orderPlaceholder: tLib.bookkOrderPlaceholder,
                    btnText: tLib.bookkBtnText,
                    verifyingText: tLib.bookkVerifyingText,
                    guideBadge: tLib.bookkGuideBadge
                };
            default:
                return {
                    namePlaceholder: tLib.smartstoreNamePlaceholder,
                    orderLabel: tLib.smartstoreOrderLabel,
                    orderPlaceholder: tLib.smartstoreOrderPlaceholder,
                    btnText: tLib.smartstoreBtnText,
                    verifyingText: tLib.smartstoreVerifyingText,
                    guideBadge: tLib.smartstoreGuideBadge
                };
        }
    }, [purchasePlatform, tLib]);


    // 🔍 확대/축소 및 🖥️ 전체화면 상태
    const [pdfZoom, setPdfZoom] = useState<number>(100);
    const [isPdfFullscreen, setIsPdfFullscreen] = useState(false);
    const [isReaderFullscreen, setIsReaderFullscreen] = useState(false);
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
    const [allowDownload, setAllowDownload] = useState(false);

    const handleDownloadSecurePdf = () => {
        setIsDownloadingPdf(true);
        setSecurityAlert(`📥 [${maskedBuyerName}] 님 전용 포렌식 워터마크가 각인된 평생 소장용 PDF를 생성 중입니다... (약 1~2초 소요)`);
        
        const downloadUrl = `/api/library/secure-pdf?buyer=${encodeURIComponent(buyerName)}&order=${encodeURIComponent(orderNumber)}&serial=${encodeURIComponent(serialKey)}&download=true`;
        
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `ZERO-POINT_${buyerName || 'VIP'}_소장본.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
            setIsDownloadingPdf(false);
            setSecurityAlert(`✅ 다운로드 완료! 모든 페이지에 [${maskedBuyerName}] 님 고유 포렌식 코드가 영구 각인되어 오프라인에서도 안전하게 소장하실 수 있습니다.`);
            setTimeout(() => setSecurityAlert(null), 5000);
        }, 2000);
    };
    const [showHealingSongModal, setShowHealingSongModal] = useState(false);
    const [showVerifySuccessModal, setShowVerifySuccessModal] = useState(false);
    const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);

    // 📖 YES24 스타일 무료 미리보기 상태
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewPageIndex, setPreviewPageIndex] = useState(0);

    // 뷰어 설정 상태 (모바일 및 범용 호환성을 위해 시력보호 e-리더를 기본 탭으로 설정)
    const [activeTab, setActiveTab] = useState<'reader' | 'pdf' | 'benefits'>('reader');
    const [selectedChapter, setSelectedChapter] = useState(CHAPTERS[0]);
    const [fontSize, setFontSize] = useState<number>(15);
    const [isTrialUser, setIsTrialUser] = useState(false);
    const [isMobileDevice, setIsMobileDevice] = useState(false);

    // 보안 경고 토스트 상태
    const [securityAlert, setSecurityAlert] = useState<string | null>(null);

    // 🧠 뇌파 사운드 랩 상태
    const [isPlayingSound, setIsPlayingSound] = useState(false);
    const [isSoundLabOpen, setIsSoundLabOpen] = useState(false);
    const [activeSoundName, setActiveSoundName] = useState('브라운 노이즈');
    const audioCtxRef = useRef<AudioContext | null>(null);
    const oscRef = useRef<OscillatorNode | null>(null);

    // 👤 중복 '님' 방지 및 단정한 호칭 정제 ('체험 회원님님' 방지)
    const displayBuyerName = useMemo(() => {
        if (!buyerName || buyerName.trim() === '' || buyerName === '명심코칭 VIP 독자') return 'VIP 정품 독자';
        const clean = buyerName.trim();
        return clean.endsWith('님') ? clean : `${clean}님`;
    }, [buyerName]);

    // 🛡️ 안심 개인정보 마스킹 (Social DRM - 개인정보 유출 0% 방지)
    const maskedBuyerName = useMemo(() => {
        if (!buyerName || buyerName.trim() === '' || buyerName === '명심코칭 VIP 독자') return 'VIP 정품 독자';
        const clean = buyerName.trim();
        if (clean.includes('체험 회원')) return '체험 회원님';
        if (clean.length === 2) return `${clean[0]}*`;
        if (clean.length >= 3) return `${clean[0]}*${clean[clean.length - 1]}`;
        return clean;
    }, [buyerName]);

    const maskedOrderNumber = useMemo(() => {
        if (!orderNumber) return '20260904-****';
        const clean = orderNumber.trim();
        if (clean.length <= 6) return clean;
        return `${clean.slice(0, 4)}-****-${clean.slice(-3)}`;
    }, [orderNumber]);

    // 🛡️ 309p 전권 영구 각인 포렌식 보안 스트림 URL
    const securePdfStreamUrl = useMemo(() => {
        return `/api/library/secure-pdf?buyer=${encodeURIComponent(buyerName)}&order=${encodeURIComponent(orderNumber)}&serial=${encodeURIComponent(serialKey)}#toolbar=0&navpanes=0&scrollbar=1`;
    }, [buyerName, orderNumber, serialKey]);

    // 📱 모바일 디바이스 감지 (모바일 브라우저의 PDF Object 태그 블랙아웃 방지)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
            const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
            setIsMobileDevice(mobileRegex.test(userAgent) || window.innerWidth < 768);
        }
    }, []);

    // 🛡️ 우클릭/인쇄/단축키(Ctrl+S, Ctrl+P) 보안 방지
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p' || e.key === 'u')) {
                e.preventDefault();
                setSecurityAlert('⚠️ 저작권 보호 정책에 따라 인쇄 및 원본 저장이 제한됩니다. 포렌식 워터마크가 각인된 보안 스트림으로 열람 중입니다.');
                setTimeout(() => setSecurityAlert(null), 4000);
            }
        };
        const handleContextMenu = (e: MouseEvent) => {
            if (activeTab === 'pdf') {
                e.preventDefault();
                setSecurityAlert('🔒 저작권 보호를 위해 우클릭 메뉴가 비활성화되어 있습니다.');
                setTimeout(() => setSecurityAlert(null), 3000);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('contextmenu', handleContextMenu);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [activeTab]);


    // 초기화 및 DRM 워터마크 정보 생성
    useEffect(() => {
        const nowStr = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
        setPurchaseDate(nowStr);

        if (typeof window !== 'undefined') {
            const searchParams = new URLSearchParams(window.location.search);
            const urlOrder = searchParams.get('order') || searchParams.get('order_id');
            const urlName = searchParams.get('name') || searchParams.get('buyer');
            const urlAutoVerify = searchParams.get('verify') === 'true' || searchParams.get('auto') === 'true';
            const urlAllowDownload = searchParams.get('download') === 'true' || searchParams.get('admin') === 'true';
            if (urlAllowDownload) setAllowDownload(true);

            let savedName = localStorage.getItem('myeongsim_book_buyer') || localStorage.getItem('user_name') || '';
            let savedOrder = localStorage.getItem('myeongsim_book_order') || '';

            // 🌟 [정품 구매자 vs 사이트 체험 회원 엄격한 분리] 🌟
            const isBookVerified = localStorage.getItem('myeongsim_book_verified') === 'true';
            const isTrial = !isBookVerified && (
                localStorage.getItem('myeongsim_paid_user') === 'true' || 
                localStorage.getItem('myeongsim_trial_active') === 'true' || 
                localStorage.getItem('myeongsim_smartstore_vip') === 'true'
            );

            if (urlOrder || urlName || urlAutoVerify) {
                savedName = urlName || savedName;
                savedOrder = urlOrder || 'SMARTSTORE-VIP';
                setBuyerName(savedName);
                setOrderNumber(savedOrder);
                localStorage.setItem('myeongsim_book_verified', 'true');
                localStorage.setItem('myeongsim_book_buyer', savedName);
                localStorage.setItem('myeongsim_book_order', savedOrder);
                localStorage.setItem('myeongsim_smartstore_vip', 'true');
                localStorage.setItem('myeongsim_paid_user', 'true');
                localStorage.setItem('myeongsim_bio_care_unlocked', 'true');
                localStorage.setItem('myeongsim_site_access', 'granted');
                document.cookie = "myeongsim_site_access=granted; path=/; max-age=2592000; SameSite=Lax";
                setIsVerified(true);
                setIsTrialUser(false);
                setShowVerifySuccessModal(true);
                confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
            } else if (isBookVerified) {
                // 실제 도서 정품 인증 완료자
                setIsVerified(true);
                setIsTrialUser(false);
                setBuyerName(savedName);
                setOrderNumber(savedOrder);
            } else if (isTrial) {
                // 사이트 무료 맛보기 체험 회원 (도서 309p 완권은 구매 인증 필요)
                setIsVerified(false);
                setIsTrialUser(true);
                setBuyerName(savedName || '체험 회원');
                setOrderNumber(savedOrder || '2026-TRIAL-GUEST');
            } else {
                setIsVerified(false);
                setIsTrialUser(false);
                setBuyerName(savedName);
                setOrderNumber(savedOrder);
            }

            // 🚫 [방식 1: 실시간 차단 상태 조회] 관리자에 의해 권한이 회수되었는지 백그라운드 검증
            const orderToCheck = urlOrder || savedOrder;
            if (orderToCheck) {
                fetch(`/api/auth/check-blocked?order=${encodeURIComponent(orderToCheck)}`)
                    .then(r => r.json())
                    .then(data => {
                        if (data && data.blocked) {
                            setIsVerified(false);
                            setIsTrialUser(false);
                            setIsBlockedByAdmin(true);
                            setBlockedReason(data.reason || '관리자 권한 회수 (환불 취소 또는 허위 번호)');
                            localStorage.removeItem('myeongsim_book_verified');
                            localStorage.removeItem('myeongsim_site_access');
                            localStorage.removeItem('myeongsim_smartstore_vip');
                            localStorage.removeItem('myeongsim_paid_user');
                            localStorage.removeItem('myeongsim_bio_care_unlocked');
                            document.cookie = "myeongsim_site_access=; path=/; max-age=0;";
                        }
                    })
                    .catch(e => console.warn('[BlockCheck] Offline or check bypassed:', e));
            }

            // 포렌식 고유 시리얼 생성
            const rawSeed = `${savedName}_${savedOrder}_CHEONGRYU`;
            let hash = 0;
            for (let i = 0; i < rawSeed.length; i++) {
                hash = ((hash << 5) - hash) + rawSeed.charCodeAt(i);
                hash |= 0;
            }
            const sKey = `CR-DRM-${Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')}`;
            setSerialKey(sKey);
        }
    }, []);

    // 🛡️ [전자책 저작권 보안 시스템: 단축키 & 복사 차단] 🛡️
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+C, Ctrl+P, Ctrl+S, Ctrl+U, F12 차단
            if (
                (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'p' || e.key === 'P' || e.key === 's' || e.key === 'S' || e.key === 'u' || e.key === 'U')) ||
                e.key === 'F12' || e.key === 'PrintScreen'
            ) {
                e.preventDefault();
                setSecurityAlert('⚠️ [청류출판사 저작권 보안 감지] 본 도서는 저작권법 제136조에 의해 보호되는 콘텐츠로, 복사/인쇄/캡처가 엄격히 차단됩니다.');
                setTimeout(() => setSecurityAlert(null), 3500);
            }
        };

        const handleCopy = (e: ClipboardEvent) => {
            e.preventDefault();
            setSecurityAlert('⚠️ [저작권 보호 알림] 도서 본문 무단 복사 및 배포는 법적 처벌 대상입니다.');
            setTimeout(() => setSecurityAlert(null), 3500);
        };

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            setSecurityAlert('🛡️ 본 전자책은 구매자 보호를 위해 우클릭이 제한되어 있습니다.');
            setTimeout(() => setSecurityAlert(null), 3000);
        };

        window.addEventListener('keydown', handleKeyDown);
        document.addEventListener('copy', handleCopy);
        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    // 🌟 [상용화] 실제 서버 DB 및 스마트스토어 주문번호 검증 처리 🌟
    const handleVerifyPurchase = async (e: React.FormEvent) => {
        e.preventDefault();
        setVerificationError('');

        const cleanName = buyerName.trim();
        const cleanOrder = orderNumber.trim();

        if (!cleanName) {
            setVerificationError(tLib.errNameRequired);
            return;
        }

        if (!cleanOrder || cleanOrder.length < 8) {
            setVerificationError(tLib.errOrderRequired);
            return;
        }

        setIsVerifying(true);

        try {
            // 실제 서버 인증 API 호출
            const res = await fetch('/api/auth/verify-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderNumber: cleanOrder,
                    depositorName: cleanName,
                    channel: purchasePlatform
                })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setVerificationError(data.message || '유효하지 않은 주문번호이거나 이미 인증이 완료된 번호입니다. 네이버페이 결제내역을 확인해주세요.');
                setIsVerifying(false);
                return;
            }

            // 인증 성공 시
            const nowStr = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
            setPurchaseDate(nowStr);

            // 포렌식 시리얼키 생성
            const rawSeed = `${cleanName}_${cleanOrder}_CHEONGRYU`;
            let hash = 0;
            for (let i = 0; i < rawSeed.length; i++) {
                hash = ((hash << 5) - hash) + rawSeed.charCodeAt(i);
                hash |= 0;
            }
            const sKey = `CR-DRM-${Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')}`;
            setSerialKey(sKey);

            if (typeof window !== 'undefined') {
                localStorage.setItem('myeongsim_book_verified', 'true');
                localStorage.setItem('myeongsim_book_buyer', cleanName);
                localStorage.setItem('myeongsim_book_order', cleanOrder);
                localStorage.setItem('myeongsim_smartstore_vip', 'true');
                localStorage.setItem('myeongsim_paid_user', 'true');
                localStorage.setItem('myeongsim_chat_turns_left', '20'); // AI 챗봇 20회 VIP 코칭 대화권 지급
                localStorage.setItem('myeongsim_bio_care_unlocked', 'true');
                localStorage.setItem('myeongsim_site_access', 'granted');
                document.cookie = "myeongsim_site_access=granted; path=/; max-age=2592000; SameSite=Lax";
            }

            setIsVerified(true);
            setIsTrialUser(false);
            setShowVerifySuccessModal(true);
            confetti({
                particleCount: 110,
                spread: 90,
                origin: { y: 0.6 },
                colors: ['#06b6d4', '#6366f1', '#f59e0b', '#10b981']
            });
        } catch (err) {
            setVerificationError('인증 서버 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsVerifying(false);
        }
    };

    // 🧠 전문 뇌파 사운드 랩 토글 및 제어판 열기
    const toggleFrequency = () => {
        setIsSoundLabOpen(true);
    };

    return (
        <div 
            className="relative flex h-full min-h-screen w-full flex-col bg-[#05030b] max-w-md mx-auto shadow-2xl overflow-hidden font-sans pb-28 text-white select-none"
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
        >
            {/* 🌌 Deep Cyber Ambient Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[420px] h-[360px] bg-gradient-to-b from-cyan-600/15 via-purple-700/15 to-transparent rounded-full blur-[110px] pointer-events-none" />
            <div className="absolute top-1/2 right-[-60px] w-64 h-64 bg-indigo-500/15 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute bottom-16 left-[-60px] w-72 h-72 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

            {/* 🚨 실시간 보안 침해 경고 토스트 🚨 */}
            <AnimatePresence>
                {securityAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-4 left-4 right-4 z-50 p-3.5 rounded-2xl bg-rose-950/95 border-2 border-rose-500 text-white text-xs font-bold shadow-2xl flex items-center gap-2.5 backdrop-blur-xl"
                    >
                        <ShieldAlert size={20} className="text-rose-400 shrink-0 animate-bounce" />
                        <span className="leading-snug text-left">{securityAlert}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── 1. Top Header ── */}
            <header className="relative z-30 flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/[0.08] bg-[#080514]/85 backdrop-blur-xl">
                <button
                    onClick={() => router.push('/report')}
                    className="flex items-center gap-1.5 text-gray-300 hover:text-white text-xs font-bold transition-all px-2.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] active:scale-95 cursor-pointer"
                >
                    <ArrowLeft size={15} />
                    <span>{tLib.homeBtn}</span>
                </button>

                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-indigo-100 to-purple-200">
                        {tLib.title}
                    </span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                        DRM 2.0
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <LanguageSwitcher />

                <button
                    onClick={() => setIsSoundLabOpen(true)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        isPlayingSound 
                            ? 'bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 text-slate-950 border-cyan-300 shadow-[0_0_18px_rgba(6,182,212,0.7)] animate-pulse' 
                            : 'bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 border-white/[0.08]'
                    }`}
                    title="ZERO POINT 뇌파 안정 & 사운드 테라피 랩"
                >
                    {isPlayingSound ? (
                        <div className="flex items-center gap-1">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
                            </span>
                            <span className="text-[10px] font-mono font-black">{activeSoundName} ON</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1">
                            <Volume2 size={13} className="text-cyan-400" />
                            <span className="text-[10px] font-mono font-bold whitespace-nowrap">{tLib.soundLabBtn}</span>
                        </div>
                    )}
                </button>
                </div>
            </header>

            {/* ── 2. 메인 바디 ── */}
            <main className="relative z-20 px-4 pt-4 space-y-4 text-left">

                {/* 📘 《ZERO POINT》 3D 책 쇼케이스 카드 */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-[#160c33] via-[#0e0824] to-[#060312] border border-cyan-400/40 shadow-2xl space-y-4">
                    <div className="flex items-start gap-3.5">
                        {/* 📘 3D 북 커버 비주얼 (클릭 시 원본 크기 모달 팝업) */}
                        <div 
                            onClick={() => setIsCoverModalOpen(true)}
                            className="relative group shrink-0 cursor-zoom-in"
                            title="클릭하여 표지 원본 크기로 크게보기"
                        >
                            <img
                                src="/images/zero_point_cover.jpg"
                                alt="ZERO POINT 공식 도서 표지"
                                className="w-24 h-36 object-cover rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.8)] border border-amber-300/40 transition-all duration-300 group-hover:scale-105 group-hover:border-amber-300"
                            />
                            {/* 호버 시 나타나는 돋보기 오버레이 */}
                            <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-amber-300">
                                <ZoomIn size={18} className="animate-pulse" />
                                <span className="text-[9px] font-bold">{tLib.zoomInText}</span>
                            </div>
                            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 pointer-events-none" />
                        </div>

                        {/* 도서 상세 설명 */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                    {tLib.officialBookBadge}
                                </span>
                                <span className="text-[9px] text-gray-400 font-mono">
                                    {tLib.totalPagesBadge}
                                </span>
                            </div>

                            <h2 className="text-sm font-black text-white leading-snug">
                                {tLib.bookTitle}
                            </h2>
                            <p className="text-[10px] text-gray-300 leading-relaxed font-medium">
                                {tLib.catchphrase}
                            </p>

                            <div className="pt-1 space-y-0.5 text-[10px] text-gray-400 font-mono">
                                <p>{tLib.authorInfo}</p>
                                <p>{tLib.isbnInfo}</p>
                                <p>{tLib.priceLabel} <span className="text-amber-300 font-bold">{tLib.priceText}</span> <span className="text-[9px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30 font-sans">{tLib.fixedPriceLawBadge}</span></p>
                            </div>
                        </div>
                    </div>

                    {/* 📖 [YES24 스타일 무료 미리보기 버튼] 🌟 */}
                    <button
                        onClick={() => {
                            setIsPreviewOpen(true);
                            setPreviewPageIndex(0);
                        }}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                        <BookOpen size={16} />
                        <span>{tLib.btnPreview}</span>
                    </button>

                    {/* 🛒 외부 구매 링크 버튼 2종 */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/[0.08]">
                        <a
                            href={BOOK_INFO.yes24Url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-[11px] shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
                        >
                            <span>{tLib.buyYes24}</span>
                            <ExternalLink size={12} />
                        </a>

                        <a
                            href={BOOK_INFO.smartstoreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-[11px] shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
                        >
                            <span>{tLib.buySmartstore}</span>
                            <ExternalLink size={12} />
                        </a>
                    </div>
                </div>

                {/* ── 3. 미인증 독자: 구매 인증 폼 ── */}
                {!isVerified ? (
                    <div className="p-5 rounded-3xl bg-[#0f0a22]/90 border border-amber-400/40 shadow-2xl space-y-4 text-center">
                        {/* 🎁 사이트 체험 회원 맞춤 안내 배너 */}
                        {isTrialUser && (
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-indigo-950/80 to-purple-950/80 border border-cyan-400/50 text-left space-y-2 shadow-lg">
                                <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                                    <Sparkles size={14} className="text-cyan-400" />
                                    <span>🎁 {displayBuyerName}{tLib.trialNoticeTitle}</span>
                                </div>
                                <p className="text-[11px] text-gray-200 leading-relaxed font-medium">
                                    {tLib.trialNoticeDesc}
                                </p>
                                <p className="text-[10px] text-amber-300 font-medium">
                                    {tLib.trialNoticeBenefit}
                                </p>
                            </div>
                        )}

                        <div className="size-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                            <Lock size={24} />
                        </div>

                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400/20 via-yellow-400/20 to-amber-500/20 border border-amber-400/50 text-amber-300 text-[11px] font-mono font-black shadow-md">
                                <Sparkles size={12} />
                                <span>{tLib.authSectionBadge}</span>
                            </div>
                            <h3 className="text-base font-black text-white">
                                {tLib.authSectionTitle}
                            </h3>

                            {/* ⚠️ 스마트스토어 구매자 전용 명확한 이용 안내 배너 & 도서정가제 준수 명시 */}
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/90 via-[#1f1505] to-amber-950/90 border-2 border-amber-400/60 text-left space-y-2 shadow-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-amber-300 font-black text-xs">
                                        <AlertCircle size={15} className="text-amber-400 shrink-0 animate-pulse" />
                                        <span>{tLib.authNoticeTitle}</span>
                                    </div>
                                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/40">
                                        {tLib.lawBadge}
                                    </span>
                                </div>
                                <p className="text-[11px] text-white leading-relaxed font-bold">
                                    {tLib.authNoticeMain}
                                </p>
                                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-200 leading-relaxed font-medium whitespace-pre-line">
                                    {tLib.authNoticeLawBox}
                                </div>
                                <p className="text-[10px] text-cyan-200 leading-relaxed font-medium pt-0.5 border-t border-white/10">
                                    {tLib.authNoticeExternal}
                                </p>
                            </div>
                        </div>

                        {verificationError && (
                            <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs font-bold text-rose-300">
                                {verificationError}
                            </div>
                        )}

                        <form onSubmit={handleVerifyPurchase} className="space-y-2.5 text-left">
                            <div>
                                <label className="text-[10px] text-gray-400 block mb-1">{tLib.platformLabel}</label>
                                <select
                                    value={purchasePlatform}
                                    onChange={(e) => setPurchasePlatform(e.target.value)}
                                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                                >
                                    <option value="smartstore">{tLib.optSmartstore}</option>
                                    <option value="yes24">{tLib.optYes24}</option>
                                    <option value="kyobo">{tLib.optKyobo}</option>
                                    <option value="bookk">{tLib.optBookk}</option>
                                    <option value="other">{tLib.optOther}</option>
                                </select>
                            </div>

                            {/* 📱 YES24 전자책 뷰어 이용 안내 배너 */}
                            {purchasePlatform === 'yes24' && (
                                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/90 to-indigo-950/90 border border-blue-400/50 space-y-1.5 shadow-lg animate-fade-in">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                                            {tLib.yes24NoticeTitle}
                                        </span>
                                        <a 
                                            href="https://www.yes24.com/Member/FTMypageEBookList.aspx" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-[10px] font-bold text-cyan-300 hover:text-cyan-200 hover:underline flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-lg transition-colors"
                                        >
                                            <span>{tLib.yes24ViewerBtn}</span>
                                            <ExternalLink size={10} />
                                        </a>
                                    </div>
                                    <p className="text-[11px] text-gray-200 leading-relaxed font-medium">
                                        {tLib.yes24NoticeBody}
                                    </p>
                                    <p className="text-[10px] text-amber-300 font-medium">
                                        {tLib.yes24NoticeBenefit}
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="text-[10px] text-gray-400 block mb-1">{tLib.nameLabel}</label>
                                <input
                                    type="text"
                                    value={buyerName}
                                    onChange={(e) => setBuyerName(e.target.value)}
                                    placeholder={platformConfig.namePlaceholder}
                                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] text-gray-400 block mb-1">{platformConfig.orderLabel}</label>
                                <input
                                    type="text"
                                    value={orderNumber}
                                    onChange={(e) => setOrderNumber(e.target.value)}
                                    placeholder={platformConfig.orderPlaceholder}
                                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isVerifying}
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                            >
                                <CheckCircle2 size={16} className={isVerifying ? "animate-spin" : ""} />
                                <span>{isVerifying ? platformConfig.verifyingText : platformConfig.btnText}</span>
                            </button>
                        </form>


                    </div>
                ) : (
                    /* ── 4. 인증 완료 독자: 럭셔리 전자책 뷰어 ── */
                    <div className="space-y-4 animate-fade-in">
                        
                        {/* 🛡️ DRM 보안 활성화 & 법적 책임 고지 배너 */}
                        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-cyan-400/40 shadow-xl space-y-1.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs font-black text-cyan-300">
                                    <Shield size={14} className="text-cyan-400" />
                                    <span>{tLib.drmHeaderTitle}</span>
                                </div>
                                <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-400/30">
                                    {tLib.verifiedBadge}
                                </span>
                            </div>
                            <div className="text-[10px] text-gray-300 space-y-0.5 font-mono">
                                <p>{tLib.ownerLabel} <strong className="text-white">{displayBuyerName}</strong> ({tLib.orderText} {orderNumber})</p>
                                <p>{tLib.licenseKeyLabel} <span className="text-amber-300">{serialKey}</span></p>
                                <p className="text-[9px] text-emerald-300 leading-tight pt-0.5">
                                    {tLib.lawNoticeVerified}
                                </p>
                                <p className="text-[9px] text-rose-300 leading-tight pt-0.5">
                                    {tLib.copyrightWarning}
                                </p>
                            </div>
                        </div>

                        {/* 뷰어 탭 네비게이션 (309p 출판 원본 완권 강조) */}
                        <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-[#0d091e] border border-white/10">
                            {[
                                { id: 'pdf', label: tLib.tabPdf, icon: '📑' },
                                { id: 'reader', label: tLib.tabReader, icon: '📖' },
                                { id: 'benefits', label: tLib.tabBenefits, icon: '🎁' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                        activeTab === tab.id
                                            ? 'bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black shadow-md'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* 탭 1: 🌟 시력보호 e-리더 (텍스트 뷰어) 🌟 */}
                        {activeTab === 'reader' && (
                            <div className="space-y-3">
                                {/* 309p 원본 완권 전환 퀵 배너 */}
                                <div className="p-3 rounded-2xl bg-gradient-to-r from-[#181138] via-[#120c2b] to-[#181138] border border-cyan-400/30 flex flex-wrap items-center justify-between gap-2 text-xs shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setIsSoundLabOpen(true)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                                                isPlayingSound 
                                                    ? 'bg-gradient-to-r from-cyan-400 to-purple-400 text-slate-950 shadow-md shadow-cyan-500/30 animate-pulse' 
                                                    : 'bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300'
                                            }`}
                                        >
                                            <Sparkles size={13} className={isPlayingSound ? 'animate-spin' : ''} />
                                            <span>{isPlayingSound ? `🎧 ${activeSoundName} ON` : tLib.brainwaveSoundLab}</span>
                                        </button>
                                        <span className="text-[11px] text-gray-400 hidden sm:inline">{tLib.solfeggioMixing}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {allowDownload && (
                                            <button
                                                onClick={handleDownloadSecurePdf}
                                                disabled={isDownloadingPdf}
                                                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-black text-xs transition-all shadow-sm cursor-pointer flex items-center gap-1"
                                            >
                                                <Download size={12} className={isDownloadingPdf ? "animate-bounce" : ""} />
                                                <span>{isDownloadingPdf ? tLib.adminDownloading : tLib.downloadPersonalPdf}</span>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setActiveTab('pdf')}
                                            className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
                                        >
                                            {tLib.goToPdfTab}
                                        </button>
                                    </div>
                                </div>

                                <RefinedEBookReader
                                chapters={CHAPTERS}
                                buyerName={buyerName}
                                orderNumber={orderNumber}
                                serialKey={serialKey}
                                purchaseDate={purchaseDate}
                                onReportSecurityAlert={(msg) => {
                                    setSecurityAlert(msg);
                                    setTimeout(() => setSecurityAlert(null), 3500);
                                }}
                            />
                            </div>
                        )}

                        {/* 탭 2: 원문 PDF 보안 스트리밍 뷰어 (확대/축소 + 모바일/PC 전체화면 지원) */}
                        {activeTab === 'pdf' && (
                            <div className="space-y-3">
                                {/* 상단 툴바: 확대/축소 & 전체화면 컨트롤러 */}
                                <div className="p-3 rounded-2xl bg-black/70 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-2 shadow-lg">
                                    <div className="flex items-center gap-1.5">
                                        <div className="size-6 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300">
                                            <FileText size={13} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white leading-none">{tLib.pdfViewTitle}</p>
                                            <p className="text-[9px] text-gray-400 font-mono mt-0.5">{tLib.pdfStreamSub}</p>
                                        </div>
                                    </div>

                                    {/* 🔍 확대/축소 컨트롤러 */}
                                    <div className="flex items-center gap-1 bg-[#150d30] border border-white/10 px-2 py-1 rounded-xl">
                                        <button
                                            onClick={() => setPdfZoom(prev => Math.max(80, prev - 15))}
                                            className="size-6 rounded bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-300 hover:text-white"
                                            title={tLib.zoomOut}
                                        >
                                            <ZoomOut size={12} />
                                        </button>
                                        <span className="text-[10px] font-mono text-cyan-300 font-bold px-1.5 min-w-[42px] text-center">
                                            {pdfZoom}%
                                        </span>
                                        <button
                                            onClick={() => setPdfZoom(prev => Math.min(250, prev + 15))}
                                            className="size-6 rounded bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-300 hover:text-white"
                                            title={tLib.zoomIn}
                                        >
                                            <ZoomIn size={12} />
                                        </button>
                                        <button
                                            onClick={() => setPdfZoom(100)}
                                            className="text-[9px] text-gray-400 hover:text-white px-1 ml-0.5 border-l border-white/10"
                                        >
                                            100%
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        {/* 🛡️ YES24·교보문고 표준: 원본 파일 다운로드 대신 전용 뷰어 스트림 배지 */}
                                        {allowDownload ? (
                                            <button
                                                onClick={handleDownloadSecurePdf}
                                                disabled={isDownloadingPdf}
                                                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                                                title={tLib.adminDownload}
                                            >
                                                <Download size={13} className={isDownloadingPdf ? "animate-bounce" : ""} />
                                                <span>{isDownloadingPdf ? tLib.adminDownloading : tLib.adminDownload}</span>
                                            </button>
                                        ) : (
                                            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[10px] text-gray-300">
                                                <Shield size={11} className="text-cyan-400" />
                                                <span>{tLib.streamBadge}</span>
                                            </span>
                                        )}

                                        {/* 🖥️ 전체화면 버튼 */}
                                        <button
                                            onClick={() => setIsPdfFullscreen(true)}
                                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 text-xs font-black flex items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer"
                                        >
                                            <Layers size={13} />
                                            <span>{tLib.fullscreenBtn}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* 인라인 PDF 컨테이너 (모바일 블랙아웃 완벽 방어) */}
                                <div className="relative w-full h-[580px] rounded-3xl bg-[#080512] border-2 border-cyan-400/40 overflow-hidden shadow-2xl select-none">
                                    {/* 상단 안심 워터마크 바 */}
                                    <div className="absolute top-0 left-0 right-0 z-20 bg-slate-950/95 backdrop-blur-md px-3.5 py-1.5 border-b border-white/10 flex items-center justify-between text-[10px] font-mono text-cyan-300">
                                        <span className="flex items-center gap-1.5">
                                            <Shield size={11} className="text-cyan-400" />
                                            <span>👤 {displayBuyerName} {tLib.safeReadingTag}</span>
                                            <span className="text-gray-400 hidden sm:inline">({maskedOrderNumber})</span>
                                        </span>
                                        <span className="text-amber-300 font-bold flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                            <span>{tLib.drmStreamTag}</span>
                                        </span>
                                    </div>

                                    {/* 모바일 환경 전용 뷰어 허브 (검은 화면 0% 방지) */}
                                    {isMobileDevice ? (
                                        <div className="w-full h-full pt-10 px-5 pb-6 flex flex-col items-center justify-center text-center space-y-4 bg-gradient-to-b from-[#160f33] via-[#0d0724] to-[#080417]">
                                            <div className="size-16 rounded-3xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 text-3xl shadow-[0_0_25px_rgba(6,182,212,0.3)]">
                                                📱
                                            </div>
                                            
                                            <div className="space-y-1 max-w-sm">
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-mono font-bold mb-1">
                                                    <Sparkles size={11} />
                                                    <span>{tLib.mobileOptimizedBadge}</span>
                                                </div>
                                                <h4 className="text-base font-black text-white">
                                                    {tLib.mobileBookTitle}
                                                </h4>
                                                <p className="text-xs text-gray-300 leading-relaxed font-medium">
                                                    {tLib.mobileStreamDesc}
                                                </p>
                                            </div>

                                            <div className="flex flex-col gap-2.5 w-full max-w-xs pt-1">
                                                {/* 1. 모바일 브라우저 네이티브 PDF 뷰어 (새 탭에서 초고속 열람) */}
                                                <a
                                                    href={securePdfStreamUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-cyan-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                                >
                                                    <span>{tLib.openMobilePdfBtn}</span>
                                                    <ExternalLink size={14} />
                                                </a>

                                                {/* 2. 보안 전체화면 뷰어 */}
                                                <button
                                                    onClick={() => setIsPdfFullscreen(true)}
                                                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 border border-white/15 cursor-pointer"
                                                >
                                                    <Layers size={13} className="text-cyan-400" />
                                                    <span>{tLib.openFullscreenViewerBtn}</span>
                                                </button>

                                                {/* 3. 시력보호 e-리더로 읽기 */}
                                                <button
                                                    onClick={() => setActiveTab('reader')}
                                                    className="w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold active:scale-95 transition-all text-xs border border-cyan-500/25 flex items-center justify-center gap-1.5 cursor-pointer"
                                                >
                                                    <BookOpen size={13} />
                                                    <span>{tLib.switchToReaderBtn}</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* PC 환경: 안정적인 인라인 PDF 스트림 프레임 */
                                        <div className="w-full h-full pt-7 overflow-auto flex items-center justify-center bg-[#1a162b]">
                                            <div 
                                                className="w-full h-full transition-transform duration-200 origin-top"
                                                style={{ transform: `scale(${pdfZoom / 100})`, transformOrigin: 'top center' }}
                                            >
                                                <iframe
                                                    src={securePdfStreamUrl}
                                                    className="w-full h-full border-none"
                                                    title="ZERO POINT DRM Protected PDF"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 모바일 사용자를 위한 안내 배너 */}
                                <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-400/30 flex items-center justify-between text-xs text-gray-300">
                                    <span>📱 {tLib.screenSmallQuestion}</span>
                                    <button
                                        onClick={() => setIsPdfFullscreen(true)}
                                        className="text-cyan-300 font-bold flex items-center gap-1 hover:underline"
                                    >
                                        <span>{tLib.switchToFullscreen}</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 탭 3: 독자 한정 특별 제공 혜택 */}
                        {activeTab === 'benefits' && (
                            <div className="space-y-3">
                                <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/60 via-[#130a2a] to-slate-950 border border-purple-400/40 space-y-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="size-9 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                                            <Sparkles size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-white">
                                                {tLib.vipTabTitle}
                                            </h3>
                                            <p className="text-[10px] text-purple-200">
                                                {tLib.vipTabSub}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2.5 text-xs">
                                        <div className="p-3.5 rounded-2xl bg-black/50 border border-purple-500/30 space-y-1.5">
                                            <p className="font-black text-amber-300 flex items-center gap-1.5">
                                                <span>{tLib.vipBenefit1Title}</span>
                                            </p>
                                            <p className="text-[11px] text-gray-300 leading-relaxed font-medium">
                                                {tLib.vipBenefit1Desc}
                                            </p>
                                            <button
                                                onClick={() => setShowHealingSongModal(true)}
                                                className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-black text-xs transition-all mt-1 cursor-pointer active:scale-98 shadow-md"
                                            >
                                                {tLib.vipBenefit1Btn}
                                            </button>
                                        </div>

                                        <div className="p-3.5 rounded-2xl bg-black/50 border border-cyan-500/30 space-y-1.5">
                                            <p className="font-black text-cyan-300 flex items-center gap-1.5">
                                                <span>{tLib.vipBenefit2Title}</span>
                                            </p>
                                            <p className="text-[11px] text-gray-300 leading-relaxed font-medium">
                                                {tLib.vipBenefit2Desc}
                                            </p>
                                            <button
                                                onClick={() => router.push('/myeongsim-chat')}
                                                className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black text-xs transition-all mt-1"
                                            >
                                                {tLib.vipBenefit2Btn}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                )}

            </main>


            {/* 🌟 🖥️ PDF 전체화면 모드 (모바일 & PC 전체화면 확대 뷰어) 🌟 */}
            <AnimatePresence>
                {isPdfFullscreen && (
                    <div className="fixed inset-0 z-50 flex flex-col bg-black text-white select-none">
                        {/* 전체화면 상단 컨트롤 바 */}
                        <header className="relative z-30 flex items-center justify-between px-4 py-2.5 bg-slate-950/95 border-b border-white/15 backdrop-blur-xl shrink-0">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsPdfFullscreen(false)}
                                    className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-gray-300 flex items-center gap-1 cursor-pointer"
                                >
                                    <ArrowLeft size={14} />
                                    <span>{tLib.closeBtn}</span>
                                </button>
                                <span className="text-xs font-black text-white hidden sm:inline">
                                    {tLib.fullscreenTitle}
                                </span>
                            </div>

                            {/* 🔍 전체화면 확대/축소 버튼 */}
                            <div className="flex items-center gap-1.5 bg-[#170e30] border border-white/10 px-2.5 py-1 rounded-xl">
                                <button
                                    onClick={() => setPdfZoom(prev => Math.max(80, prev - 20))}
                                    className="size-7 rounded bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-300"
                                    title={tLib.zoomOut}
                                >
                                    <ZoomOut size={14} />
                                </button>
                                <span className="text-xs font-mono text-cyan-300 font-bold px-1.5 min-w-[48px] text-center">
                                    {pdfZoom}%
                                </span>
                                <button
                                    onClick={() => setPdfZoom(prev => Math.min(300, prev + 20))}
                                    className="size-7 rounded bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-300"
                                    title={tLib.zoomIn}
                                >
                                    <ZoomIn size={14} />
                                </button>
                                <button
                                    onClick={() => setPdfZoom(100)}
                                    className="text-[10px] text-gray-400 hover:text-white px-1.5 ml-1 border-l border-white/10"
                                >
                                    100%
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/30 hidden sm:inline">
                                    {displayBuyerName} {tLib.licenseBadgeLabel}
                                </span>
                                <button
                                    onClick={() => setIsPdfFullscreen(false)}
                                    className="size-8 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
                                    title={tLib.closeBtn}
                                >
                                    ✕
                                </button>
                            </div>
                        </header>

                        {/* 전체화면 바디 & 워터마크 오버레이 */}
                        <div className="relative flex-1 w-full h-full bg-[#110d22] overflow-auto flex items-center justify-center">
                            {/* 은은한 전체화면 포렌식 워터마크 타일 */}
                            <div 
                                className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-around opacity-[0.08] select-none text-xs font-mono text-cyan-200 font-bold overflow-hidden"
                                style={{ transform: 'rotate(-18deg) scale(1.15)' }}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
                                    <div key={row} className="whitespace-nowrap flex justify-around">
                                        <span>🔒 {displayBuyerName} 정품 | {maskedOrderNumber} | 무단배포금지</span>
                                        <span>⚠️ 저작권법 제136조 형사책임 추적 | {purchaseDate}</span>
                                    </div>
                                ))}
                            </div>

                            {/* 줌 배율이 적용된 PDF 프레임 */}
                            <div 
                                className="w-full h-full transition-transform duration-150 origin-top flex items-center justify-center select-none"
                                style={{ transform: `scale(${pdfZoom / 100})`, transformOrigin: 'top center' }}
                            >
                                {isMobileDevice ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
                                        <div className="size-16 rounded-3xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-3xl text-cyan-300">
                                            📱
                                        </div>
                                        <div className="space-y-1 max-w-sm">
                                            <h4 className="text-sm font-bold text-white">{tLib.mobileFullscreenNativeTitle}</h4>
                                            <p className="text-gray-400 text-xs leading-relaxed">
                                                {tLib.mobileFullscreenNativeDesc}
                                            </p>
                                        </div>
                                        <a
                                            href={securePdfStreamUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 cursor-pointer"
                                        >
                                            <span>{tLib.openMobileNativePdfBtn}</span>
                                            <ExternalLink size={14} />
                                        </a>
                                    </div>
                                ) : (
                                    <iframe
                                        src={securePdfStreamUrl}
                                        className="w-full h-full border-none"
                                        title="ZERO POINT Fullscreen PDF"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* 🌟 🔍 《ZERO POINT》 공식 도서 표지 원본 크기 확대 모달 (라이트박스) 🌟 */}
            <AnimatePresence>
                {isCoverModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCoverModalOpen(false)}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl p-4 cursor-zoom-out select-none"
                    >
                        {/* 닫기 버튼 */}
                        <button
                            onClick={() => setIsCoverModalOpen(false)}
                            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer z-50 shadow-lg border border-white/20"
                            title="닫기"
                        >
                            <ZoomOut size={20} />
                        </button>

                        {/* 대형 원본 이미지 카드 */}
                        <motion.div
                            initial={{ scale: 0.85, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.85, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-sm sm:max-w-md w-full flex flex-col items-center cursor-default"
                        >
                            <div className="relative rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.95)] border-2 border-amber-400/40">
                                <img
                                    src="/images/zero_point_cover.jpg"
                                    alt="ZERO POINT 공식 도서 표지 원본"
                                    className="max-h-[75vh] w-auto object-contain rounded-3xl"
                                />
                                <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-3xl pointer-events-none" />
                            </div>

                            {/* 하단 캡션 안내 */}
                            <div className="mt-4 text-center space-y-1">
                                <h3 className="text-base font-black text-white">
                                    {tLib.coverModalTitle}
                                </h3>
                                <p className="text-xs text-gray-300 font-mono">
                                    {tLib.coverModalAuthor}
                                </p>
                                <p className="text-[11px] text-amber-300/80 pt-1 cursor-pointer hover:underline" onClick={() => setIsCoverModalOpen(false)}>
                                    {tLib.coverModalDismiss}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 🌟 🎵 1:1 맞춤 헌정 힐링송 작곡 신청 전용 모달 🌟 */}
            <HealingSongApplyModal
                isOpen={showHealingSongModal}
                onClose={() => setShowHealingSongModal(false)}
                defaultName={buyerName}
                defaultOrder={orderNumber}
            />

            {/* 🌟 👑 독자 정품 인증 축하 모달 🌟 */}
            <BookVerificationSuccessModal
                isOpen={showVerifySuccessModal}
                onClose={() => setShowVerifySuccessModal(false)}
                buyerName={buyerName}
                serialKey={serialKey}
                onStartReading={() => {
                    setActiveTab('pdf');
                    window.scrollTo({ top: 450, behavior: 'smooth' });
                }}
                onOpenHealingSong={() => setShowHealingSongModal(true)}
            />

            {/* 🌟 📖 YES24 스타일 무료 미리보기 모달 (Look-Inside Reader) 🌟 */}
            <AnimatePresence>
                {isPreviewOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 select-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md h-[90vh] bg-[#0c081e] border border-cyan-400/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-left"
                        >
                            {/* 🕵️‍♂️ 미리보기 포렌식 워터마크 레이어 */}
                            <div 
                                className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-around opacity-[0.09] select-none text-[10px] font-mono text-cyan-200 font-bold overflow-hidden"
                                style={{ transform: 'rotate(-20deg) scale(1.2)' }}
                            >
                                {[1, 2, 3, 4, 5, 6].map((row) => (
                                    <div key={row} className="whitespace-nowrap flex justify-around">
                                        <span>📖 청류출판사 《ZERO POINT》 YES24 공식 미리보기 | 무단배포금지</span>
                                        <span>저작권자 이경윤 | Copyright 2026</span>
                                    </div>
                                ))}
                            </div>

                            {/* 모달 상단 헤더 */}
                            <div className="relative z-20 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#120b2c]/90 backdrop-blur-md">
                                <div className="flex items-center gap-2">
                                    <div className="size-7 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                                        <BookOpen size={14} />
                                    </div>
                                    <div>
                                         <p className="text-xs font-black text-white leading-tight">{tLib.previewModalTitle}</p>
                                         <p className="text-[10px] text-cyan-300 font-mono">
                                             {PREVIEW_PAGES[previewPageIndex].tag} ({previewPageIndex + 1} / {PREVIEW_PAGES.length})
                                         </p>
                                     </div>
                                </div>

                                <button
                                    onClick={() => setIsPreviewOpen(false)}
                                    className="size-8 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* 본문 스크롤 영역 */}
                            <div className="relative z-20 flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-cyan-500/30">
                                <div className="border-b border-white/10 pb-2.5">
                                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-400/30">
                                        {PREVIEW_PAGES[previewPageIndex].tag}
                                    </span>
                                    <h3 className="text-sm font-black text-white mt-1.5 leading-snug">
                                        {PREVIEW_PAGES[previewPageIndex].title}
                                    </h3>
                                </div>

                                {previewPageIndex === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-2 space-y-3">
                                        <img
                                            src="/images/zero_point_cover.jpg"
                                            alt="ZERO POINT 공식 표지"
                                            className="w-48 h-72 object-cover rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.9)] border-2 border-amber-300/40"
                                        />
                                        <div className="text-center space-y-1">
                                            <h3 className="text-sm font-black text-white">ZERO POINT (제로 포인트)</h3>
                                            <p className="text-xs text-amber-300 font-mono">AWARENESS OF AWARENESS</p>
                                            <p className="text-[11px] text-gray-400">저자 이경윤 | 출판 청류</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-gray-200 text-xs leading-loose whitespace-pre-line font-medium text-justify select-none">
                                        {PREVIEW_PAGES[previewPageIndex].content}
                                    </div>
                                )}

                                {/* 마지막 페이지 도달 시 구매 안내 카드 */}
                                {previewPageIndex === PREVIEW_PAGES.length - 1 && (
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/60 via-purple-950/60 to-slate-950 border border-amber-400/50 space-y-3 text-center animate-fade-in mt-4">
                                        <div className="size-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-300">
                                            <Lock size={20} />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-black text-white">
                                                {tLib.previewEndTitle}
                                            </h4>
                                            <p className="text-[11px] text-gray-300 leading-relaxed">
                                                {tLib.previewEndDesc}
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-2 pt-1">
                                            <a
                                                href={BOOK_INFO.yes24Url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5"
                                            >
                                                <span>{tLib.previewBuyYes24}</span>
                                                <ExternalLink size={13} />
                                            </a>
                                            <a
                                                href={BOOK_INFO.smartstoreUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-1.5"
                                            >
                                                <span>{tLib.previewBuySmartstore}</span>
                                                <ExternalLink size={13} />
                                            </a>
                                            <button
                                                onClick={() => {
                                                    setIsPreviewOpen(false);
                                                }}
                                                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-cyan-200 text-[11px] font-bold"
                                            >
                                                {tLib.previewAlreadyBought}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 모달 하단 페이지 넘김 네비게이션 */}
                            <div className="relative z-20 px-4 py-3 border-t border-white/10 bg-[#0c081e] flex items-center justify-between">
                                <button
                                    onClick={() => setPreviewPageIndex(prev => Math.max(0, prev - 1))}
                                    disabled={previewPageIndex === 0}
                                    className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-gray-300 disabled:opacity-30 cursor-pointer"
                                >
                                    {tLib.prevPageBtn}
                                </button>

                                <span className="text-[11px] font-mono text-cyan-300 font-bold">
                                    {previewPageIndex + 1} / {PREVIEW_PAGES.length}
                                </span>

                                <button
                                    onClick={() => setPreviewPageIndex(prev => Math.min(PREVIEW_PAGES.length - 1, prev + 1))}
                                    disabled={previewPageIndex === PREVIEW_PAGES.length - 1}
                                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 text-xs font-black disabled:opacity-30 cursor-pointer"
                                >
                                    {tLib.nextPageBtn}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 🛡️ 보안 경고 토스트 */}
            <AnimatePresence>
                {securityAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] px-4 py-3 rounded-2xl bg-slate-900/95 border border-cyan-400/40 text-cyan-200 text-xs shadow-2xl backdrop-blur-md flex items-center gap-2.5 font-sans"
                    >
                        <Shield size={16} className="text-cyan-400 shrink-0" />
                        <span>{securityAlert}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
