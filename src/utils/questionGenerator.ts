import { ReportData } from '@/types/report';
import { getSocialRole } from '@/data/socialRoleData';
import { getWunsungData } from '@/data/wunsungData';
import { getHiddenMind } from '@/data/deepAnalysisData';
import { getInteractionInfo } from '@/data/advancedAnalysisData';

export interface CoachingQuestion {
    id: string;
    type: 'social' | 'hidden' | 'energy' | 'clash';
    text: string;
    options?: string[]; // Optional user choice buttons
}

/**
 * Generates dynamic questions based on user's Saju profile.
 */
export const generateQuestions = (report: ReportData): CoachingQuestion[] => {
    const questions: CoachingQuestion[] = [];

    // 1. [Clash Check] Saju interaction (e.g. Day vs Month Clash)
    // Note: In a real implementation this would calculate dynamic clashes based on today's date or Saju structure.
    // For now, we mock a check or use existing data if available.
    const monthBranch = report.saju.fourPillars?.month?.ji || ''; // 월지
    const dayBranch = report.saju.fourPillars?.day?.ji || '';   // 일지

    // Simple mock clash check (e.g. 자-오 충)
    if ((monthBranch === '자' && dayBranch === '오') || (monthBranch === '오' && dayBranch === '자')) {
        const clashInfo = getInteractionInfo('자오충');
        if (clashInfo) {
            questions.push({
                id: 'clash_ja_o',
                type: 'clash',
                text: `오늘 당신의 사주에 [${clashInfo.name}]이 발생했습니다. ${clashInfo.interpretation} 혹시 오늘따라 감정 기복이 심하지 않나요?`,
                options: ['맞아요, 힘들어요', '잘 모르겠어요']
            });
        }
    }

    // 2. [Social Role] Month Pillar Ten Gods
    // We need the Ten God code for the Month Pillar. 
    // Assuming report.tenGods includes something like { month: 'pyun_gwan' } or structure allows derivation.
    // Since strict types might vary, we'll try to map if available. 
    // For this implementation, let's assume we extract it via a helper or direct prop.
    // As a fallback/example, we'll look for keywords in the Month Ten God name if code isn't direct.

    // *Simplified Logic*: Use a mock mapping or extraction logic if simple code isn't in ReportData.
    // In a real app, ensure ReportData has 'monthTenGodCode'. 
    // Let's assume for now we can infer or it is passed. 
    // If not, we skip or use a generic one based on Element.

    // *Correction*: Let's trust the 'socialRoleData' logic which takes a 'code'.
    // If report has tenGods mapping, use it.
    // Example: 'pyun_gwan'

    // For demo purposes, let's push a question if we can identify the role.
    // In the full system, we'd parse `report.saju.month.tenGod` properly.

    // 3. [Energy Level] 12 Wunsung
    // Assuming report includes 12 Wunsung info or we calculate it.
    // Let's mock a check for 'Weak' energy (Jeol, Tae, Byeong).
    // questions.push(...)

    return questions;
}

/**
 * Helper to get a Social Role Question if we know the Ten God Code
 */
export const getSocialQuestion = (tenGodCode: string): CoachingQuestion | null => {
    const role = getSocialRole(tenGodCode);
    if (!role) return null;
    return {
        id: `social_${role.code}`,
        type: 'social',
        text: `사회에서 당신은 '${role.alias}' 같은 역할을 맡고 있군요. ${role.question}`,
        options: ['그렇습니다', '아니오']
    };
};

/**
 * Returns the final "Destiny Choice" question.
 */
export const getDestinyChoice = (roleAlias: string): CoachingQuestion => {
    return {
        id: 'destiny_choice',
        type: 'social',
        text: `자, 당신의 사주는 '${roleAlias}'로 설계되어 있습니다. 하지만 운명은 당신의 손에 달려 있습니다. 앞으로 어떻게 하시겠습니까?`,
        options: [
            `A. 이 역할을 받아들이되, 나를 지키며 현명하게 살겠다.`,
            `B. 가면을 벗어던지고, 불편하더라도 완전히 새로운 나로 살겠다.`
        ]
    };
};
