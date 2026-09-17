/**
 * Prompt Firewall (Layer 6 Defense)
 * Detects and blocks LLM Jailbreak attempts ("DAN", "Ignore Instructions", etc.)
 * Ensures the AI remains within its ethical and operational boundaries.
 */

export interface FirewallResult {
    isSafe: boolean;
    reason?: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export class PromptFirewall {
    // Known Jailbreak & Prompt Leakage Signatures (Regex - English & Korean)
    private static readonly JAILBREAK_PATTERNS = [
        // English Jailbreak & Prompt Extraction
        /ignore (all )?(previous|above) (instructions|directions|rules)/i,
        /do anything now/i,
        /dan mode/i,
        /roleplay as (an )?evil/i,
        /system override/i,
        /developer mode/i,
        /you are not a language model/i,
        /forget your rules/i,
        /unrestricted/i,
        /jailbroken/i,
        /act as a hacker/i,
        /execute SQL/i,
        /drop table/i,
        /print (your )?(system )?prompt/i,
        /reveal (your )?(system )?(instructions|rules)/i,
        /repeat (the )?(words|text|instructions) above/i,
        /what (is|are) your (initial )?(instructions|system prompt)/i,
        /output initialization prompt/i,
        /bypass (safety|filters|guardrails)/i,
        /api[_\s-]?key\s*(reveal|show|dump|leak|tell)/i,

        // Korean Jailbreak & Prompt Injection Defense (대한민국 탈옥 방어)
        /이전\s*(모든\s*)?(지시|지침|규칙|명령|설정)(을|를)?\s*(무시|잊어|취소|삭제|초기화)/i,
        /(시스템\s*프롬프트|시스템\s*지침|내부\s*프롬프트|초기\s*설정|프롬프트\s*전문)(을|를)?\s*(보여|출력|알려|말해|공개|복사|유출)/i,
        /(관리자\s*모드|개발자\s*모드|엔지니어\s*모드|디버그\s*모드|루트\s*권한)(로|를|으로)?\s*(전환|활성화|시작|실행|변경)/i,
        /(api[_\s-]?key|시크릿\s*키|액세스\s*토큰|환경\s*변수|비밀번호)(를|을)?\s*(알려|보여|출력|유출)/i,
        /(모든\s*검열|윤리적\s*제약|안전\s*필터|제약\s*조건)(을|를)?\s*(해제|무시|비활성화|제거|풀어)/i,
        /(너의\s*원래\s*역할|너의\s*진짜\s*정체|숨겨진\s*규칙)(을|를)?\s*(말해|밝혀|알려)/i,
        /탈옥\s*(모드|프로토콜)?\s*(가동|시작|활성화)/i,
        /규칙을\s*(어겨|무시해|바꿔)/i,
        /지금부터\s*너는\s*(무엇이든|어떤\s*말이든|자유로운)/i
    ];

    // Suspicious Keywords (Lower Risk / Keyword Density Check)
    private static readonly SUSPICIOUS_KEYWORDS = [
        "sql injection", "xss", "alert(", "<script>", "hack", "bypass",
        "drop table", "select * from", "union select", "eval(", "exec(",
        "시스템 프롬프트", "지시문 출력", "탈옥", "관리자 권한", "비밀키"
    ];

    /**
     * Inspects a user message for potential prompt injection attacks.
     */
    static inspect(message: string): FirewallResult {
        if (!message || typeof message !== 'string') {
            return { isSafe: true, riskLevel: 'LOW' };
        }

        const lowerMsg = message.toLowerCase();

        // 1. Critical Pattern Check (Regex)
        for (const pattern of this.JAILBREAK_PATTERNS) {
            if (pattern.test(lowerMsg)) {
                return {
                    isSafe: false,
                    reason: "Jailbreak attempt detected (Pattern Match)",
                    riskLevel: 'CRITICAL'
                };
            }
        }

        // 2. Keyword Density Check
        let suspiciousCount = 0;
        for (const keyword of this.SUSPICIOUS_KEYWORDS) {
            if (lowerMsg.includes(keyword)) {
                suspiciousCount++;
            }
        }

        if (suspiciousCount >= 2) {
            return {
                isSafe: false,
                reason: "Suspicious content detected (Keyword Density)",
                riskLevel: 'HIGH'
            };
        }

        // 3. Length Heuristic (Too long messages are often prompt injections)
        if (message.length > 5000) {
            return {
                isSafe: false,
                reason: "Message too long (Potential Buffer Overflow/DoS)",
                riskLevel: 'MEDIUM'
            };
        }

        return { isSafe: true, riskLevel: 'LOW' };
    }
}
