export type EmotionState = 'positive' | 'negative' | 'anxious' | 'angry' | 'neutral';

export function analyzeEmotion(text: string): EmotionState {
    const t = text.trim();
    if (!t) return 'neutral';

    // 1. Positive
    const positiveKeywords = ['좋아', '행복', '즐거', '뿌듯', '감사', '다행', '편안', '기대', '설레', '성취', '멋지', '화이팅'];
    if (positiveKeywords.some(k => t.includes(k))) return 'positive';

    // 2. Negative (Sad/Tired)
    const negativeKeywords = ['힘들어', '지쳐', '피곤', '우울', '슬퍼', '눈물', '포기', '괴로', '답답', '하기 싫어', '그만'];
    if (negativeKeywords.some(k => t.includes(k))) return 'negative';

    // 3. Anxious
    const anxiousKeywords = ['걱정', '무서', '불안', '초조', '긴장', '떨려', '막막', '어떡하지', '실수할까봐'];
    if (anxiousKeywords.some(k => t.includes(k))) return 'anxious';

    // 4. Angry
    const angryKeywords = ['짜증', '화나', '미워', '억울', '열받', '싸웠', '꼰대', '무시', '분노'];
    if (angryKeywords.some(k => t.includes(k))) return 'angry';

    return 'neutral';
}
