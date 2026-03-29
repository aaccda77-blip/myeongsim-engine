import fs from 'fs';
import path from 'path';

function parseMentalCodes(filepath, outpath) {
    let content = '';
    try {
        // Read file (Assume UTF-8 first, Windows often creates UTF-16LE or UTF-8 but fs.readFileSync default is utf8)
        const raw = fs.readFileSync(filepath);
        if (raw[0] === 0xFF && raw[1] === 0xFE) {
            content = raw.toString('utf16le');
        } else {
            content = raw.toString('utf8');
        }
        console.log('Successfully read the file.');
    } catch (e) {
        console.error('Failed to read file:', e);
        return;
    }

    const codes = [];
    // Split by "Code XX."
    const parts = content.split(/(Code \d{2}\.\s*\[)/);

    if (parts.length < 3) {
        console.log('No codes found. Content starts with:', content.substring(0, 100));
        return;
    }

    for (let i = 1; i < parts.length; i += 2) {
        const codeHeader = parts[i] + parts[i + 1];

        // Format: Code 01. [EXP-01] 순수 창조 모듈 (The Genesis)
        const match = codeHeader.match(/Code (\d{2})\.\s*(\[.*?\][^\n]*)/);
        if (!match) continue;

        const codeId = `CODE-${match[1]}`;
        const codeName = match[2].trim();

        // Extra details
        const bodyMatch = codeHeader.substring(match[0].length);

        // Extracting scripts and phases using regex
        const darkScriptMatch = bodyMatch.match(/파괴적 인생 각본 \((.*?)\):\s*([^\n]+)/);
        const darkTitle = darkScriptMatch ? darkScriptMatch[1].trim() : '';
        const darkContent = darkScriptMatch ? darkScriptMatch[2].trim() : '';

        const extractPhase = (pattern) => {
            const m = bodyMatch.match(pattern);
            return m ? m[1].trim() : '';
        };

        const phase1 = extractPhase(/1단계:\s*\[.*?\](.*?)(?=\n2단계:|\n\* 해킹 원리|\n[^\n]*2단계)/s);
        const phase2 = extractPhase(/2단계:\s*\[.*?\](.*?)(?=\n3단계:|\n\* 해킹 원리|\n[^\n]*3단계)/s);
        const phase3 = extractPhase(/3단계:\s*\[.*?\](.*?)(?=\n4단계:|\n\* 해킹 원리|\n[^\n]*4단계)/s);
        const phase4 = extractPhase(/4단계:\s*\[.*?\](.*?)(?=\n💡 명심|\n[^\n]*💡)/s);
        const briefing = extractPhase(/💡 명심.*?브리핑\s*(.*?)(?=\nCode \d{2}|\n제\d장|\n\n\n|$)/s);

        codes.push({
            id: codeId,
            name: codeName,
            darkMode: {
                title: darkTitle,
                script: darkContent
            },
            phase1,
            phase2,
            phase3,
            phase4,
            masterBriefing: briefing
        });
    }

    console.log(`Extracted ${codes.length} codes.`);

    // TS Template
    let tsContent = `/**
 * Myeongsim Master - 64 Mental OS Codes Module
 * Generated automatically from the raw manuscript.
 */

export interface Mental64Module {
  id: string; // e.g., CODE-01
  name: string; // e.g., [EXP-01] 순수 창조 모듈
  darkMode: {
    title: string;
    script: string;
  };
  phase1: string; // Scan
  phase2: string; // Sync
  phase3: string; // Shift
  phase4: string; // ACT
  masterBriefing: string;
}

export const mental64Data: Mental64Module[] = ${JSON.stringify(codes, null, 2)};
`;

    // Write file
    fs.writeFileSync(outpath, tsContent, 'utf-8');
    console.log(`Successfully wrote parsed data to ${outpath}`);
}

parseMentalCodes('saju_data.md', 'src/modules/mental64Modules.ts');
