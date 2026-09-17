/**
 * 사용자 친화적인 에러 메시지 변환 유틸리티
 */

export const OPEN_FREE_NOTICE_MESSAGE = 
  '현재 이용자 분석 요청이 집중되어 AI 코칭 엔진을 잠시 재정비하고 있습니다. 3초간 편안하게 호흡을 가다듬으신 후 다시 시도해 주시면 성심껏 안내해 드리겠습니다. (오픈 기념 전 컨텐츠 무료 이용 중)';

/**
 * 에러 객체나 메시지를 받아, Google Generative AI 오류(404, 429, Quota, Spending Cap, Not Found) 및
 * 각종 영문 시스템 기술 에러인 경우 사용자 친화적인 한국어 안내 문구로 100% 변환합니다.
 */
export function formatFriendlyErrorMessage(err: any): string {
  if (!err) return OPEN_FREE_NOTICE_MESSAGE;

  let raw = '';
  if (typeof err === 'string') {
    raw = err;
  } else if (err?.message) {
    raw = err.message;
  } else if (err?.error) {
    raw = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
  } else {
    try {
      raw = JSON.stringify(err);
    } catch {
      raw = String(err);
    }
  }

  // 1. Google Generative AI / Gemini 관련 모든 영문 에러 패턴 포괄 검사
  const isAiTechnicalError = 
    raw.includes('GoogleGenerativeAI') ||
    raw.includes('generativelanguage') ||
    raw.includes('models/gemini') ||
    raw.includes('models/') ||
    raw.includes('generateContent') ||
    raw.includes('ModelService') ||
    raw.includes('404 Not Found') ||
    raw.includes('404') ||
    raw.includes('429') ||
    raw.includes('500') ||
    raw.includes('spending cap') ||
    raw.includes('monthly spending cap') ||
    raw.includes('quota') ||
    raw.includes('Quota') ||
    raw.includes('Too Many Requests') ||
    raw.includes('RESOURCE_EXHAUSTED') ||
    raw.includes('Rate limit') ||
    raw.includes('exceeded your current quota') ||
    raw.includes('API_KEY_INVALID') ||
    raw.includes('API key');

  if (isAiTechnicalError) {
    return OPEN_FREE_NOTICE_MESSAGE;
  }

  // 2. 일반 영문 시스템 기술 에러 체크 (네트워크, 구문, 서버 내부 오류 등)
  const isTechnicalEnglishError =
    raw.includes('Failed to fetch') ||
    raw.includes('NetworkError') ||
    raw.includes('Internal Server Error') ||
    raw.includes('Unexpected token') ||
    raw.includes('ECONNREFUSED') ||
    raw.includes('SyntaxError') ||
    raw.includes('TypeError') ||
    raw.includes('Unhandled') ||
    raw.includes('Error:') ||
    raw.startsWith('[') && raw.includes('Error]');

  if (isTechnicalEnglishError) {
    return OPEN_FREE_NOTICE_MESSAGE;
  }

  // 3. 만약 메시지에 한글이 거의 없고 영문 에러 뉘앙스인 경우에도 안전하게 차단
  const hasKorean = /[가-힣]/.test(raw);
  if (!hasKorean && raw.length > 15) {
    return OPEN_FREE_NOTICE_MESSAGE;
  }

  return raw;
}
