export class MindGraphModule {
    /**
     * Very basic heuristical extraction of a Mind Graph Edge from a single interaction.
     * In a production system this could use NLP / LLM extraction.
     * @param message User message text
     * @returns Array of edges { source: string, target: string, relation: string }
     */
    static extractEdges(message: string): any[] {
        const edges: any[] = [];

        // Simple NLP mock mapping for crucial coaching concepts
        const concepts = ["돈", "가족", "어머니", "아버지", "일", "회사", "불안", "화", "성공", "실패"];

        const found = concepts.filter(c => message.includes(c));
        if (found.length >= 2) {
            // Create a naive linkage between first two concepts
            edges.push({
                source: found[0],
                target: found[1],
                relation: "co-occurring",
                timestamp: new Date().toISOString()
            });
        }

        return edges;
    }

    /**
     * Updates the mind graph array.
     */
    static updateMindGraph(existingGraph: any[] = [], newEdges: any[]): any[] {
        if (newEdges.length === 0) return existingGraph;

        const updated = [...existingGraph, ...newEdges];
        // Keep to 10 latest edges to avoid prompt bloat
        return updated.slice(-10);
    }

    /**
     * Synthesize mind graph instruction for AI
     */
    static buildGraphPrompt(mindGraph: any[]): string {
        if (!mindGraph || mindGraph.length === 0) return "";

        const connections = mindGraph.map(e => `[${e.source} ↔ ${e.target}]`).join(", ");
        return `
        [마인드맵 기억 시스템 (Mind-Graph)]:
        분석 결과, 사용자의 무의식은 다음 개념들을 서로 연결 짓고 있습니다: ${connections}
        *AI 지침*: 사용자가 한 쪽 개념을 언급하면, 연결된 다른 개념이 숨겨진 진짜 원인일 수 있습니다. 인과관계를 입체적으로 묶어서 질문하세요 (예: "결국 돈에 대한 불안은 사실 아버지와의 관계에서 시작된 건 아닐까요?").
        `;
    }
}
