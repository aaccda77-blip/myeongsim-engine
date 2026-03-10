# 🎱 명심 균형 로또 스크린 (Myeongsim Balanced Lotto Screen) UI/UX 가이드

이 문서는 사용자의 입력(마찰) 없이 100% AI 확률 제어를 통해 가장 완벽한 밸런스의 번호를 제공하는 '명심 균형 로또' 기능의 FlutterFlow 화면 구성 가이드입니다.

## 1. 핵심 컨셉 (Core Concept)
*   **No Friction, High Value:** 사용자가 숫자를 고르거나 고민할 필요 없이, 가장 완벽한 번호 세트가 "이미 준비되어 있음"을 강조합니다.
*   **신비감과 기술력의 결합:** 눈에 보이지 않는 백엔드 알고리즘(구간 쿼터제, 연속 번호 방지 등)을 시각적인 카피라이팅으로 포장하여 신뢰감을 극대화합니다.

## 2. 화면 구성 요소 (Screen Elements)

### A. 헤더 영역 (Hero Section)
*   **Title:** 명심 AI 균형 로또 (Myeongsim AI Balanced Lotto)
*   **Subtitle:** "우주적 확률의 편향을 제거한, 오직 당신만을 위한 6개의 황금 코드"
*   최상단에는 잔잔하게 돌아가는 고도화된 UI 애니메이션(예: 양자 궤도 컴포넌트나 부드러운 우주 파티클 Lottie)을 배치하여 몰입감을 줍니다.

### B. 메인 인터랙션 영역 (Main Interaction)
*   **Button (Call to Action):**
    *   **Text:** `[ 황금 밸런스 번호 받기 ]` 또는 `[ 명심 유니버스 동기화 스캔 ]`
    *   **Action:** 터치 시 `generateMyeongsimBalancedLotto()` Custom Action을 실행합니다.
*   **Loading State (중요!):** 
    *   버튼을 누르자마자 결과가 0.1초 만에 나오는 것보다, 의도적으로 **1.5~2초 정도의 로딩 스피너나 프로그래스 바**를 보여주는 것이 훨씬 고급스럽습니다. (진짜 수만 번 연산하고 있다는 느낌 연출)
    *   로딩 중 텍스트 롤링 (예시):
        *   "과도한 확률 밀집 구간 (30번대) 스캔 중..."
        *   "3연속 번호 중복 노이즈 제거 진행..."
        *   "최적의 홀짝 밸런스 조율 완료..."

### C. 결과 출력 영역 (Result Display)
*   **결과 카드 (Number Balls):**
    *   6개의 번호를 우아하고 세련된 원형 컴포넌트(골드, 딥 네이비, 또는 투명한 글래스모피즘 스타일)에 담아 보여줍니다.
    *   번호가 나타날 때 한 번에 짠! 나타나기보다, 0.2초 간격으로 스르륵(Fade-In + Slide Up) 등장하면 감동이 배가됩니다.
*   **코칭 스니펫 (Coaching Snippet):**
    *   번호 밑에 권장되는 긍정의 확언 멘트 배치.
    *   *"명심 AI가 무의미한 확률적 쏠림 패턴을 완벽히 차단했습니다. 오늘 이 균형 잡힌 코드가 회원님의 삶에 깊은 공명을 일으키길 바랍니다."*

## 3. FlutterFlow Action 흐름 요약

1.  **On Tap (Button)**
2.  **Update App State / Component State:** `isLoading: true`
3.  **Wait(Delay):** 1500 MS (의도적인 로딩 연출)
4.  **Custom Action:** `generateMyeongsimBalancedLotto()` 실행 -> 결과 리스트 변수 저장
5.  **Update App State / Component State:** `isLoading: false`, `lottoResult: [결과]`
6.  **UI 갱신:** 로딩 바가 사라지고 6개의 공이 나타남.
