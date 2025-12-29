import QuestionData from './QuestionData.json';

/**
 * @module QuestionModule
 * @description
 * Provides questions to assess 'Acquired' traits (Environment/Choices).
 * Mapped dynamically from QuestionData.json based on NC Codes.
 */

export interface QuestionOption {
    label: string;
    value: number[]; // Vector delta
    gap: number;     // 0.1 (Neural) ~ 0.9 (Dark)
    type: string;    // 'NEURAL' | 'DARK'
}

export interface Question {
    id: string;
    text: string;
    type?: string;   // 'interrupt' etc.
    options: QuestionOption[];
}

export class QuestionModule {

    /**
     * Retrieves questions tailored to the user's specific Saju Code.
     * Searches through the GROUP structure in QuestionData.json.
     * @param code - The Saju Code (e.g., 'NC-06')
     */
    public static getQuestions(code: string): Question[] {
        const data = QuestionData as any;
        const groups = data.NC_QUESTIONS;

        // 1. Search for the Code in Groups
        for (const groupKey in groups) {
            const group = groups[groupKey];
            if (group.codes.includes(code)) {
                // Found matching group
                // Map the raw JSON structure to our Interface if needed (keys match largely)
                return group.questions;
            }
        }

        // 2. Fallback (Default to Group G for Freedom/General)
        console.warn(`⚠️ [QuestionModule] Code ${code} not found. Defaulting to GROUP_G.`);
        return groups["GROUP_G_FREEDOM"]?.questions || [];
    }
}
