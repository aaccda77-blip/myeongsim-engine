import { QUANTUM_AWAKENING_CONTENT, QUANTUM_SCENARIOS } from '../data/QuantumAwakeningDB';

export interface QuantumResponse {
    type: 'QUANTUM_PROMPT';
    message: string;
    options: {
        label: string;
        value: string;
        trigger_mode?: string;
        next_prompt_guide?: string;
    }[];
    system_prompt_injection?: string;
    audio_therapy_url?: string; // [NEW] Audio Therapy Link
}

export class QuantumLabModule {

    /**
     * S-C-A-R Engine: Main Logic for Quantum Awakening
     */
    public static getQuantumResponse(intent: string, sajuData: any): QuantumResponse | null {

        // 1. DIMENSION 1: Soul X-Ray (Diagnosis)
        if (intent === 'ms_quantum_xray') {
            const scenario = QUANTUM_SCENARIOS['ms_quantum_xray'];
            return {
                type: 'QUANTUM_PROMPT',
                message: `### ${scenario.title}\n\n**"${scenario.subtitle}"**\n\n${scenario.concept}\n\n지금 당신의 마음속을 촬영할 준비가 되셨나요? 가장 엑스레이를 찍어보고 싶은 '마음의 통증'은 무엇인가요?`,
                options: [
                    { label: "😰 막막한 불안감", value: "xray_anxiety", trigger_mode: "deep_scan", next_prompt_guide: "User feels Anxiety. Analyze the root cause using Saju Day Master Weakness." },
                    { label: "🥀 무기력한 번아웃", value: "xray_burnout", trigger_mode: "deep_scan", next_prompt_guide: "User feels Burnout. Analyze Energy Leak theory in Saju." },
                    { label: "😡 억울한 분노", value: "xray_anger", trigger_mode: "deep_scan", next_prompt_guide: "User feels Anger. Analyze Suppressed Expression (Hurting Officer) in Saju." }
                ],
                system_prompt_injection: `[S-C-A-R Engine] Mode: X-Ray. Act as a Soul Radiologist. Diagnose the root of pain.`
            };
        }

        // 2. DIMENSION 2: Unlock Code (Talent)
        if (intent === 'ms_quantum_code') {
            const scenario = QUANTUM_SCENARIOS['ms_quantum_code'];
            return {
                type: 'QUANTUM_PROMPT',
                message: `### ${scenario.title}\n\n**"${scenario.subtitle}"**\n\n${scenario.concept}\n\n당신의 무의식 창고에 잠들어 있는 '재능 상자'를 찾아보겠습니다. 열쇠는 당신의 기억 속에 있습니다.`,
                options: [
                    { label: "🧸 어릴 적 몰입했던 놀이", value: "code_childhood", trigger_mode: "memory_recall", next_prompt_guide: "Unlock Talent via Childhood Memory using Monthly Branch (Resource/Output)." },
                    { label: "⚡ 나도 모르게 잘하는 일", value: "code_flow", trigger_mode: "flow_check", next_prompt_guide: "Unlock Talent via Flow State using Day Master Strength." },
                    { label: "💎 남들이 칭찬하는 점", value: "code_feedback", trigger_mode: "social_mirror", next_prompt_guide: "Unlock Talent via Social Feedback using Official/Wealth Star." }
                ],
                system_prompt_injection: `[S-C-A-R Engine] Mode: Unlock. Act as a Talent Archaeologist. Dig up hidden gifts.`
            };
        }

        // 3. DIMENSION 3: Alchemy (Transformation)
        if (intent === 'ms_quantum_alchemy') {
            const scenario = QUANTUM_SCENARIOS['ms_quantum_alchemy'];
            return {
                type: 'QUANTUM_PROMPT',
                message: `### ${scenario.title}\n\n**"${scenario.subtitle}"**\n\n${scenario.concept}\n\n황금으로 바꾸고 싶은 당신의 '납(단점)'은 무엇입니까? 우리가 그것을 가장 빛나는 무기로 제련해 드리겠습니다.`,
                options: [
                    { label: "🌵 예민하고 까칠함", value: "alchemy_sensitive", trigger_mode: "reframing", next_prompt_guide: "Reframe Sensitivity as 'High Resolution Perception' (Sin-Geum quality)." },
                    { label: "🐢 느리고 게으름", value: "alchemy_slow", trigger_mode: "reframing", next_prompt_guide: "Reframe Slowness as 'Deep Processing & Stability' (Earth quality)." },
                    { label: "🤡 줏대 없고 흔들림", value: "alchemy_weak", trigger_mode: "reframing", next_prompt_guide: "Reframe Flexibility as 'Adaptability & Survival' (Water/Wood quality)." }
                ],
                system_prompt_injection: `[S-C-A-R Engine] Mode: Alchemy. Act as a Destiny Alchemist. Transmute weakness to strength.`
            };
        }

        // 4. DIMENSION 4: Frequency (Connection)
        if (intent === 'ms_quantum_connect') {
            const scenario = QUANTUM_SCENARIOS['ms_quantum_connect'];
            return {
                type: 'QUANTUM_PROMPT',
                message: `### ${scenario.title}\n\n**"${scenario.subtitle}"**\n\n${scenario.concept}\n\n지금 당신의 주파수를 교란시키는 '노이즈(관계)'는 무엇입니까?`,
                options: [
                    { label: "🧛 에너지를 뺏는 사람", value: "freq_vampire", trigger_mode: "boundary_setting", next_prompt_guide: "Prescription: Energy Shielding Technique for Energy Vampires." },
                    { label: "🥊 자꾸 부딪히는 사람", value: "freq_conflict", trigger_mode: "mirror_work", next_prompt_guide: "Prescription: Mirror Neuron Reflection for Conflicts." },
                    { label: "🧊 나를 무시하는 사람", value: "freq_ignore", trigger_mode: "self_worth", next_prompt_guide: "Prescription: Inner Sun Activation for Indifference." }
                ],
                system_prompt_injection: `[S-C-A-R Engine] Mode: Frequency. Act as a Sound Engineer. Tune the relationship dynamics.`
            };
        }

        // 5. DIMENSION 5: World (Legacy)
        if (intent === 'ms_quantum_universe') {
            const scenario = QUANTUM_SCENARIOS['ms_quantum_universe'];
            return {
                type: 'QUANTUM_PROMPT',
                message: `### ${scenario.title}\n\n**"${scenario.subtitle}"**\n\n${scenario.concept}\n\n당신의 이야기는 아직 끝나지 않았습니다. 이제 당신의 작은 우주를 밖으로 확장할 시간입니다. 어디서부터 시작하시겠습니까?`,
                options: [
                    { label: "📝 나의 치유 기록 남기기", value: "world_write", trigger_mode: "legacy_build", next_prompt_guide: "Mission: Start a 'Healing Log' to share emerging wisdom." },
                    { label: "🤝 같은 아픔 가진 사람 돕기", value: "world_help", trigger_mode: "community_build", next_prompt_guide: "Mission: Find one person to listen to today. Become the Healer." },
                    { label: "🎨 나만의 작품 만들기", value: "world_create", trigger_mode: "creation_build", next_prompt_guide: "Mission: Create one artifact (drawing, song, code) that represents your soul." }
                ],
                system_prompt_injection: `[S-C-A-R Engine] Mode: World. Act as a Universe Architect. Design the legacy.`
            };
        }

        return null;
    }

    /**
     * [Multi-modal] Emotion Prescription Logic
     * Simulates analyzing text/voice tone and prescribing audio therapy.
     */
    public static getEmotionPrescription(emotionKeyword: string): string {
        const prescriptions: Record<string, string> = {
            'anxiety': 'https://www.youtube.com/embed/lHc1h8j5rV4', // 432Hz Calm
            'burnout': 'https://www.youtube.com/embed/2OEL4P1Rz04', // Nature Sounds
            'anger': 'https://www.youtube.com/embed/77ZozI0rw7w',   // Rain Sound
            'sadness': 'https://www.youtube.com/embed/ND07C16f0qE'  // Warm Piano
        };
        return prescriptions[emotionKeyword] || '';
    }
}
