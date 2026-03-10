import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Supabase Client (Service Role for Admin Access)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Gemini
const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Fix: 404 on flash on this Vercel setup

export interface UserCoreProfile {
    name: string;
    job?: string;
    core_struggle?: string; // 핵심 고민
    strengths?: string[];   // 발견된 강점
    last_updated: string;
}

export class PersonaProfileModule {
    private static readonly PROFILE_KEY = 'CORE_PROFILE';

    /**
     * 1. [Read] 사용자 핵심 프로필 조회
     * 'CORE_PROFILE'이라는 특수 persona_id를 사용하여 저장된 요약본을 가져옵니다.
     */
    static async getProfile(userId: string): Promise<string | null> {
        if (!userId) return null;

        try {
            // 우리는 embedding이 아닌 직접 조회를 사용합니다. (Metadata Filter)
            const { data, error } = await supabase
                .from('long_term_memory')
                .select('content, metadata')
                .eq('user_id', userId)
                .eq('persona_id', this.PROFILE_KEY)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error || !data) return null;

            return data.content;
        } catch (e) {
            console.error("❌ [PersonaProfile] Fetch Error:", e);
            return null;
        }
    }

    /**
     * 2. [Write] 사용자 핵심 프로필 업데이트 (AI 요약)
     * 대화가 끝난 후 비동기로 호출되어, 최신 대화 내용을 반영해 프로필을 갱신합니다.
     */
    static async updateProfile(userId: string, recentMessages: any[], existingProfile: string | null = null) {
        if (!userId || !recentMessages || recentMessages.length === 0) return;

        try {
            console.log(`📝 [PersonaProfile] Start Update for User: ${userId.substring(0, 8)}`);
            console.log(`📝 [PersonaProfile] Recent Messages Count: ${recentMessages.length}`);

            // 1. 요약 프롬프트 생성
            const prompt = `
            당신은 '사용자 프로필 관리자'입니다.
            아래의 [이전 프로필]과 [최근 대화]를 바탕으로, 사용자의 **핵심 정보**를 최신화하여 요약하세요.

            [이전 프로필]:
            ${existingProfile || "없음"}

            [최근 대화]:
            ${recentMessages.map(m => `${m.role}: ${m.content}`).join('\n')}

            **작성 규칙**:
            1. 사용자의 **이름, 직업, 나이, 가족관계** 등 사실 정보를 기록하세요.
            2. 사용자가 현재 겪고 있는 **핵심 고민(Struggle)**을 구체적으로 적으세요.
            3. 사용자의 **강점(Strength)**이나 **성격적 특징**을 기록하세요.
            4. 절대 '사용자가 말했다' 식의 서술이 아니라, **"사용자는 ~이다"** 형태의 **사실 명세서(Fact Sheet)**로 작성하세요.
            5. 길이: 300자 이내의 명확한 요약문.
            
            **출력 예시**:
            "이름은 김철수. 30대 중반의 IT 개발자. 현재 이직 문제로 큰 스트레스를 받고 있음. 책임감이 강하지만 거절을 잘 못하는 성격. 아버지가 엄격하셨던 것으로 보임."
            `;

            // 2. AI 요약 수행
            console.log("📝 [PersonaProfile] Generating AI Summary...");
            const result = await model.generateContent(prompt);
            const newProfileContent = result.response.text();

            console.log(`📝 [PersonaProfile] AI Summary Generated: ${newProfileContent?.substring(0, 50)}...`);

            if (!newProfileContent) {
                console.error("❌ [PersonaProfile] AI generated empty content.");
                return;
            }

            // 3. DB 저장 (Upsert 방식이 없으므로, 기존 것 삭제 후 삽입 or 최신 것만 insert)
            // 여기서는 'History'를 남기기 위해 Insert만 하고, Read 시 최신 1개만 가져옵니다.
            // (Embedding은 굳이 필요 없으나, 추후 검색을 위해 더미 벡터를 넣거나 생략)

            // *벡터 생성 생략 (단순 조회가 목적)*

            const { error, data } = await supabase
                .from('long_term_memory')
                .insert({
                    user_id: userId,
                    persona_id: this.PROFILE_KEY,
                    content: newProfileContent,
                    metadata: { type: 'core_profile', updated_at: new Date().toISOString() },
                    // vector 컬럼이 not null이면 더미 데이터 필요할 수 있음. 
                    // long_term_memory 테이블 정의상 vector가 nullable이면 생략 가능.
                    // 만약 필수라면 [0,0,...] 채워야 함. 여기서는 일단 생략 시도.
                })
                .select();

            if (error) {
                console.error("❌ [PersonaProfile] Update DB Error:", error.message, error.details);
            } else {
                console.log("✅ [PersonaProfile] Profile Updated Successfully. Inserted ID:", data?.[0]?.id);
            }

        } catch (e: any) {
            console.error("❌ [PersonaProfile] Update Execution Error:", e.message);
            if (e.response) console.error("API Response:", e.response);
        }
    }

    /**
     * 3. [Inject] 시스템 프롬프트 주입용 포맷터
     */
    static constructSystemPrompt(profileContent: string | null): string {
        if (!profileContent) return "";

        return `
        \n::: CORE_PERSONA_MEMORY :::
        [사용자 핵심 프로필 (반드시 기억할 것)]
        ${profileContent}
        ::: END_MEMORY :::\n
        `;
    }
}
