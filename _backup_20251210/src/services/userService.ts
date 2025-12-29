import { supabase } from '@/lib/supabaseClient';

export interface UserProfile {
    id: string;
    email: string | null;
    saju_data: any;
    subscription_tier: 'free' | 'basic' | 'premium';
    current_stage: number;
    created_at: string;
}

export const userService = {
    /**
     * Get user profile by ID
     */
    async getUserProfile(userId: string): Promise<UserProfile | null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
        return data;
    },

    /**
     * Update user's current stage (Unlock next level)
     */
    async updateUserStage(userId: string, newStage: number) {
        const { error } = await supabase
            .from('users')
            .update({ current_stage: newStage })
            .eq('id', userId);

        if (error) throw error;
    }
};
