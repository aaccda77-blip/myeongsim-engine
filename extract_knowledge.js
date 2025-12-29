
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const documentsPath = path.join(__dirname, 'src/knowledge/docs');
const outputPath = path.join(__dirname, 'src/services/KnowledgeBase.ts');

async function processPdfs() {
    try {
        const files = fs.readdirSync(documentsPath).filter(file => file.endsWith('.pdf'));
        let combinedText = '';

        console.log(`Found ${files.length} PDF files.`);

        let fileCount = 0;
        // Limit to 40 files to prevent memory overflow

        files.sort();

        for (const file of files) {
            fileCount++;
            if (fileCount > 40) break;

            console.log(`[${fileCount}/${files.length}] Processing ${file}...`);
            try {
                const dataBuffer = fs.readFileSync(path.join(documentsPath, file));
                const data = await pdf(dataBuffer);

                let text = data.text || "";
                text = text.replace(/\s+/g, ' ').trim();

                combinedText += `\n\n### MANUAL SOURCE: ${file} ###\n${text.substring(0, 50000)}\n`;
            } catch (err) {
                console.error(`Failed to parse ${file}:`, err.message);
            }
        }

        const escapedText = combinedText
            .replace(/`/g, '\\`')
            .replace(/\$\{/g, '\\${');

        const fileContent = `
/**
 * KnowledgeBase: 학습된 챗봇 상담 매뉴얼 (Direct Knowledge Injection)
 * Generated automatically from PDF documents.
 * Context Size: ${escapedText.length} chars
 */
export const KNOWLEDGE_BASE = \`
${escapedText}
\`;

export default KNOWLEDGE_BASE;
`;

        fs.writeFileSync(outputPath, fileContent);
        console.log(`Successfully generated ${outputPath} (Size: ${escapedText.length} chars)`);

    } catch (error) {
        console.error('Error processing PDFs:', error);
    }
}

processPdfs();
