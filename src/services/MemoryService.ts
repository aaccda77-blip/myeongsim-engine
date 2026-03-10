import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createHash } from 'crypto';
import { SajuSyncModule } from '../modules/MemoryModules/SajuSyncModule';
import { ShadowTrackerModule } from '../modules/MemoryModules/ShadowTrackerModule';
import { MindGraphModule } from '../modules/MemoryModules/MindGraphModule';
import { DreamStreamModule } from '../modules/MemoryModules/DreamStreamModule';
import { NarrativeArcModule } from '../modules/MemoryModules/NarrativeArcModule';
import { KarmicLoopModule } from '../modules/MemoryModules/KarmicLoopModule';
import { ZenDormancyModule } from '../modules/MemoryModules/ZenDormancyModule';
import { AkashicRecorderModule } from '../modules/MemoryModules/AkashicRecorderModule';
import { MirrorNeuronModule } from '../modules/MemoryModules/MirrorNeuronModule';

// Initialize Supabase Client
export class MemoryService {

    private static supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    private static supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
    private static supabase = createClient(this.supabaseUrl, this.supabaseKey);

    static {
        const isServiceKey = this.supabaseKey.startsWith('ey') && this.supabaseKey === process.env.SUPABASE_SERVICE_ROLE_KEY;
        console.log(`🧠 [MemoryService] Initialized. Using Service Role Key: ${isServiceKey ? 'YES ✅' : 'NO ❌ (Using Anon Key)'}`);
        console.log(`🔌 [MemoryService] Feature Flag: ${process.env.ENABLE_LONG_TERM_MEMORY === 'false' ? 'DISABLED ❌' : 'ENABLED ✅'}`);
    }

    // [Safety Valve] Feature Flag
    private static get isEnabled(): boolean {
        // Default to TRUE unless explicitly disabled
        return process.env.ENABLE_LONG_TERM_MEMORY !== 'false';
    }

    private static genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || 'placeholder-key');
    private static embeddingModel = this.genAI.getGenerativeModel({ model: "gemini-embedding-001" });


    /**
     * Generates a unique Persona ID
     */
    public static generatePersonaId(userId: string, targetName: string, birthDate: string): string {
        const rawString = `${userId}:${targetName}:${birthDate}`;
        return createHash('sha256').update(rawString).digest('hex');
    }

    /**
     * Embeds text using Gemini
     */
    private static async getEmbedding(text: string): Promise<number[]> {
        const result = await this.embeddingModel.embedContent({
            content: { parts: [{ text }] },
            outputDimensionality: 768
        } as any);
        return result.embedding.values;
    }

    /**
     * Stores a new memory to long_term_memory
     */
    static async storeMemory(userId: string, personaId: string, content: string, metadata: any = {}) {
        try {
            if (!this.isEnabled) return;
            if (!content || content.length < 5) return;

            const embedding = await this.getEmbedding(content);

            const { error } = await this.supabase
                .from('long_term_memory')
                .insert({
                    user_id: userId,
                    persona_id: personaId,
                    content: content,
                    embedding: embedding,
                    metadata: metadata
                });

            if (error) throw error;
            console.log(`🧠 [Memory] Stored for Persona ${personaId.substring(0, 8)}: "${content.substring(0, 30)}..."`);
        } catch (e) {
            console.error("Memory Store Error:", e);
        }
    }

    /**
     * Recalls relevant memories based on Persona Context
     */
    static async recallMemories(userId: string, personaId: string, query: string, limit: number = 3): Promise<string> {
        try {
            if (!this.isEnabled) return "";

            const embedding = await this.getEmbedding(query);

            const { data, error } = await this.supabase.rpc('match_memories', {
                query_embedding: embedding,
                match_threshold: 0.5,
                match_count: limit,
                p_user_id: userId,
                p_persona_id: personaId
            });

            if (error) {
                console.error("Memory Search Error:", error);
                // Return empty string on error to prevent crash
                return "";
            }

            if (!data || data.length === 0) return "";

            let memoryContext = "## [Episodic Memory (Past Conversations)]\n";
            // We'll aggregate shadow and graph data over matched memories
            let shadowData: any[] = [];
            let graphData: any[] = [];

            data.forEach((mem: any) => {
                const dayPillarInfo = mem.metadata?.saju_sync ? `[기억 태그: ${mem.metadata.saju_sync.day_pillar}일 - ${mem.metadata.saju_sync.dominant_element} 기운]` : '';
                memoryContext += `- ${mem.content} ${dayPillarInfo}\n`;

                if (mem.metadata?.shadow_trigger) shadowData.push(mem.metadata.shadow_trigger);
                if (mem.metadata?.mind_graph) graphData.push(...mem.metadata.mind_graph);
            });

            // Append Advanced Modules Context
            memoryContext += `\n${ShadowTrackerModule.buildShadowPrompt(shadowData)}\n`;
            memoryContext += `\n${MindGraphModule.buildGraphPrompt(graphData)}\n`;

            // [NEW] Ultra-Premium Modules (Dream Stream, Narrative Arc, Karmic Loop)

            // Generate Dream Stream by checking the latest memory timestamp
            const { data: latestMem } = await this.supabase
                .from('long_term_memory')
                .select('created_at')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
            const lastTime = latestMem?.created_at || null;

            memoryContext += `\n${DreamStreamModule.buildDreamPrompt(lastTime)}\n`;
            memoryContext += `\n${NarrativeArcModule.buildNarrativePrompt()}\n`;
            memoryContext += `\n${KarmicLoopModule.buildKarmicLoopPrompt()}\n`;

            // [FINAL BOSS] Ultra-Premium Modules (Zen Dormancy, Akashic Recorder, Mirror Neuron)
            memoryContext += `\n${ZenDormancyModule.buildZenPrompt(lastTime)}\n`;
            memoryContext += `\n${AkashicRecorderModule.buildAkashicPrompt()}\n`;
            memoryContext += `\n${MirrorNeuronModule.buildMirrorPrompt()}\n`;

            console.log(`🧠 [Memory] Recalled ${data.length} items for Persona ${personaId.substring(0, 8)}`);
            return memoryContext;

        } catch (e) {
            console.error("Memory Recall Failed:", e);
            return "";
        }
    }

    /**
     * Auto-summarize and store
     */
    static async summarizeAndStore(userId: string, personaId: string, messages: any[]) {
        if (messages.length < 4) return;

        try {
            const conversationText = messages.map(m => `${m.role}: ${m.content}`).join('\n');
            const summaryModel = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
            Summarize the following consultation conversation into one key insight or user fact for long-term memory.
            Focus on: User's core problem, specific advice given, or personal details revealed.
            Language: Korean.
            Max Length: 2 sentences.
            
            Conversation:
            ${conversationText}
            `;

            const result = await summaryModel.generateContent(prompt);
            const summary = result.response.text();

            // Setup Base Metadata
            let metadata: any = { type: 'auto-summary' };

            // 1. Saju-Bio Sync Module
            metadata = SajuSyncModule.injectSajuSync(metadata);

            // 2. Shadow Tracker Module
            const latestUserMessage = messages.filter(m => m.role === 'user').slice(-1)[0]?.content || '';
            const shadowTrigger = ShadowTrackerModule.extractShadow(conversationText); // Using full chat for broader scan
            if (shadowTrigger) {
                metadata.shadow_trigger = shadowTrigger;
            }

            // 3. Mind-Graph Module
            const graphEdges = MindGraphModule.extractEdges(conversationText);
            if (graphEdges.length > 0) {
                metadata.mind_graph = graphEdges;
            }

            await this.storeMemory(userId, personaId, summary, metadata);

        } catch (e) {
            console.error("Auto-Summary Failed:", e);
        }
    }

    /**
     * Fetches recent chat history for a user (Standard DB)
     */
    static async fetchRecentChatLogs(userId: string, limit: number = 50) {
        const { data, error } = await this.supabase
            .from('chat_history')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true })
            .limit(limit);

        if (error) {
            console.error("Fetch History Error:", error);
            return [];
        }
        return data || [];
    }

    /**
     * Saves a chat message (Standard DB)
     */
    static async saveChatLog(userId: string, role: string, message: string, stage: number = 1) {
        const { error } = await this.supabase
            .from('chat_history')
            .insert({
                user_id: userId,
                role: role,
                message: message,
                metadata: { stage }
            });

        if (error) console.error("Save Chat Log Error:", error);
    }
}
