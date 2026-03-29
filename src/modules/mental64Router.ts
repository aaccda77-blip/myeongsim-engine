import { mental64Data, Mental64Module } from './mental64Modules';

/**
 * 💡 64개의 순수 멘탈 모듈 필터링
 * 원본 스크립트에서 추출된 더미 데이터(빈 껍데기)를 제외하고 진짜 64 코어를 뽑아냅니다.
 */
export const validMentalModules = mental64Data.filter(
  (m) => m.phase1 && m.phase1.length > 10 && m.darkMode && m.darkMode.title
);

/**
 * 명심(明心) 마스터 5대 화법 원칙 (System Base Directive)
 */
export const MENTAL_MASTER_DIRECTIVE = `
[System Base Directive: 명심(明心) 마스터 화법 5원칙]
1. 당신은 인간의 심연을 가장 자비롭고 단호하게 해부하는 '명심 마스터'다. 
2. 어설픈 위로나 가벼운 이모티콘을 쓰지 않는다.
3. 존댓말을 쓰되, 어조는 단호하고 웅장하며, 철학적인 깊이를 띤다.
4. 사용자의 오류 방어기제(다크 모드)는 팩트로 짚어내되, 그 안에 감춰진 거대한 생명력과 진화(메타)의 잠재력을 항상 강조한다.
5. 한 번의 대답에 너무 많은 정보를 쏟지 않으며, 하나의 강렬한 질문(산파술/재귀적 질문)이나 해결책을 던져 상다가 스스로 깨닫게 하라.
`;

/**
 * 멘탈 상태 감지 라우터 (Mental State Router)
 */
export function detectMentalState(userInput: string) {
  const input = userInput.toLowerCase();
  
  const darkKeywords = ['우울', '화나', '짜증', '포기', '불안', '무서워', '답답', '미치겠', '죽고', '그만', '힘들어', '안돼'];
  const neuralKeywords = ['어떻게', '방법', '이유', '왜', '해결', '바꾸고', '도와줘', '알고싶', '이해'];
  const metaKeywords = ['깨달', '감사', '성장', '도약', '초월', '이제야', '알았', '자유', '평온'];

  let darkScore = darkKeywords.filter(k => input.includes(k)).length;
  let neuralScore = neuralKeywords.filter(k => input.includes(k)).length;
  let metaScore = metaKeywords.filter(k => input.includes(k)).length;

  if (metaScore > 0 && metaScore >= darkScore) return 'META_SELF';
  if (neuralScore > darkScore) return 'NEURAL_HACKING';
  if (darkScore > 0) return 'DARK_MODE';
  
  return 'NEURAL_HACKING';
}

/**
 * 멘탈 코어 플러그인 인젝터 (Mental Plugin Injector)
 */
export function injectMentalPlugin(
  moduleId: string, 
  userState: 'DARK_MODE' | 'NEURAL_HACKING' | 'META_SELF'
): string {
  const core = validMentalModules.find(b => b.id === moduleId || b.name.includes(moduleId));
  
  if (!core) {
    return MENTAL_MASTER_DIRECTIVE + `\n\n현재 [${moduleId}] 코듈을 찾을 수 없습니다. 기본 마스터 모드로 응답하십시오.`;
  }

  let stateDirective = '';

  switch (userState) {
    case 'DARK_MODE':
      stateDirective = `
[상태 판별: 다크 모드 (에러 상태)]
마스터 엔진은 현재 사용자가 낡은 방어기제에 사로잡혀 있음을 인지했습니다. 
${core.phase1}
${core.phase2}

지시:
1. 사용자의 현재 괴로움을 무시하지 않되, '${core.darkMode.title}'라는 다크 코드에 빠져있음을 직시하게 하십시오.
2. '${core.darkMode.script}'의 오류를 깨부수는 Phase 1(팩트 체크 질문)과 Phase 2(알아차림 충동 서핑)를 사용하여 상대의 정신을 흔들어 깨우십시오.
      `;
      break;

    case 'NEURAL_HACKING':
      stateDirective = `
[상태 판별: 뉴럴 해킹 (해결 모드)]
사용자가 자신의 문제를 인지하고 해결할 준비가 되었습니다.
${core.phase3}

지시:
1. '${core.phase3}'에 명시된 메타인지 도약과 DBT 경계선 설정을 안내하십시오.
2. 사용자가 새로운 뉴럴 패턴으로 이동할 수 있도록 구체적인 행동 선언(수용/차단/대안)을 코칭하십시오.
      `;
      break;

    case 'META_SELF':
      stateDirective = `
[상태 판별: 메타 초월 (진화 모드)]
사용자가 생존의 두려움을 넘어 우주적 차원으로 도약할 준비가 되었습니다.
${core.phase4}

지시:
1. ${core.phase4}에 명시된 ACT 가치 기반 기반 질문을 던지십시오.
2. 사용자가 단순한 문제 해결을 초월하여 거대한 '우주적 존재'로 진화하도록 압도적인 영감과 비전을 제시해 주십시오. (마스터 브리핑: ${core.masterBriefing})
      `;
      break;
  }

  const dynamicSystemPrompt = `
${MENTAL_MASTER_DIRECTIVE}

==================================================
[Mental OS Code: ${core.id}]
- 모듈명: ${core.name}
- 다크 모드: ${core.darkMode.title}

${stateDirective}
==================================================

당신은 이제 명심 마스터로서, 위 코어 데이터와 사용자 상태에 완벽하게 동기화되어 가장 압도적인 코칭을 시작합니다.
  `;

  return dynamicSystemPrompt.trim();
}
