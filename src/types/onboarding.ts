export interface UserOnboardingData {
    id: string; // UUID from supabase auth.users
    created_at?: string; // ISO 8601 string
    birth_date?: string; // YYYY-MM-DD
    birth_time?: string | null; // HH:mm:ss, null if unknown
    gender?: '남성' | '여성' | '기타' | string;
    current_stressors?: string[]; // Array of string tags like ['커리어', '건강']
    sleep_quality?: number; // 1 to 5
    energy_level?: number; // 0 to 100
    personality_16?: string; // MBTI alias
    enneagram?: string;
    big_five?: string;
    disc?: string;
    terms_agreed: boolean; // Must be true to use the service
}
