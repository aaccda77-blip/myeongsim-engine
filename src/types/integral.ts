/**
 * Integral Theory Quadrants
 */
export interface IntegralState {
    ul_mind: number;      // 1-10: Subjective Mind / Emotion
    ur_body: number;      // 1-10: Objective Body / Health
    ll_relation: number;  // 1-10: Intersubjective Culture / Relationship
    lr_system: number;    // 1-10: Interobjective System / Career
    symptoms: string[];   // Tags like "headache", "conflict", "anxiety"
}

/**
 * Calculated Context from the Engine
 * This snapshot is stored with the log to explain "why" the advice was given.
 */
export interface MyeongshimContext {
    saju: {
        energy_level: 'Critical_Heat' | 'Balanced' | 'Cold' | 'Normal';
        is_gongmang: boolean; // True if Year Branch is Void for the Day Master
        gongmang_type?: 'Resonant_Bell' | 'Standard_Void';
        sip_seong: string; // "Hurting Officer" etc.
        unseong_phase: 'Birth' | 'Peak' | 'Sickness' | 'Death' | string;
    };
    gene_keys: {
        lifes_work: number;
        evolution: number;
        radiance: number;
        purpose: number;
        pearl?: number; // Optional
    };
    integral_synthesis: {
        primary_issue: 'Body' | 'Mind' | 'Relation' | 'System' | 'None';
        action_mode: 'Rest' | 'Expand' | 'Maintain' | 'Reset';
    };
}

/**
 * DB Model for IntegralLog
 */
export interface IntegralLog {
    id: string;
    user_id: string;
    date: string;
    ul_mind: number;
    ur_body: number;
    ll_relation: number;
    lr_system: number;
    symptoms: string[];
    calculated_context: MyeongshimContext;
    ai_coaching_message: string;
    created_at: string;
}

/**
 * Engine Input Requirements
 */
export interface EngineInput {
    dob: string; // ISO String of Birth Date
    daily_state: IntegralState;
}
