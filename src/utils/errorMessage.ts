/**
 * 사용자 친화적인 에러 메시지 변환 유틸리티
 */

export const OPEN_FREE_NOTICE_MESSAGE = 
  '오픈출시기념 전컨텐츠무료이나 일부컨텐츠 api비용처리때문에 일부작동이 안될수 있습니다. 이점 감안하시어 컨텐츠 이용부탁드립니다. 감사합니다.';

/**
 * 에러 객체나 메시지를 받아, Google Generative AI 할당량 초과(429, Quota, Spending Cap) 또는
 * 시스템 영문 기술 에러인 경우 사용자 친화적인 한국어 안내 문구로 변환합니다.
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

  // 1. Google Generative AI / Gemini 할당량 및 과금, API 오류 체크
  const isAiQuotaError = 
    raw.includes('GoogleGenerativeAI') ||
    raw.includes('429') ||
    raw.includes('spending cap') ||
    raw.includes('monthly spending cap') ||
    raw.includes('quota') ||
    raw.includes('Quota') ||
    raw.includes('Too Many Requests') ||
    raw.includes('RESOURCE_EXHAUSTED') ||
    raw.includes('generativelanguage.googleapis.com') ||
    raw.includes('models/gemini') ||
    raw.includes('Rate limit') ||
    raw.includes('exceeded your current quota');

  if (isAiQuotaError) {
    return OPEN_FREE_NOTICE_MESSAGE;
  }

  // 2. 영문 기술 에러 체크 (서버 내부 에러, JSON 파싱, fetch 실패 등)
  const isTechnicalEnglishError =
    raw.includes('Failed to fetch') ||
    raw.includes('NetworkError') ||
    raw.includes('Internal Server Error') ||
    raw.includes('Unexpected token') ||
    raw.includes('ECONNREFUSED') ||
    raw.includes('SyntaxError') ||
    raw.includes('TypeError');

  if (isTechnicalEnglishError) {
    return OPEN_FREE_NOTICE_MESSAGE;
  }

  return raw;
}
