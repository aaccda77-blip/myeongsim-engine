
const fs = require('fs');

function checkSyntax(filename, ignoreStart, ignoreEnd) {
    const code = fs.readFileSync(filename, 'utf8');
    const stack = [];
    let inString = false;
    let stringChar = '';
    let inBlockComment = false;

    // Split by lines for processing, but block comments span lines
    // Better to iterate char by char on whole content

    for (let pos = 0; pos < code.length; pos++) {
        const char = code[pos];

        // Handle ignore range logic manually? Too complex with pos.
        // Let's stick to line-based ignoring if needed, but here let's process whole file char-by-char first.
        // Or reconstruct lines logic.

        // Actually, let's keep line-split logic but handle state across lines.
    }

    const lines = code.split('\n');
    let lineIdx = 0;

    for (let i = 0; i < lines.length; i++) {
        // Skip ignored lines logic
        if (i + 1 >= ignoreStart && i + 1 <= ignoreEnd) continue;

        const line = lines[i];
        for (let j = 0; j < line.length; j++) {
            const char = line[j];

            // Handle Strings
            if (!inBlockComment && !inString && (char === '"' || char === "'" || char === "`")) {
                inString = true;
                stringChar = char;
                continue;
            }
            if (inString) {
                if (char === stringChar) {
                    if (j > 0 && line[j - 1] === '\\' && (j < 2 || line[j - 2] !== '\\')) { // escaped check
                        // continue string
                    } else {
                        inString = false;
                    }
                }
                continue;
            }

            // Handle Block Comments /* ... */
            if (!inBlockComment && char === '/' && j < line.length - 1 && line[j + 1] === '*') {
                inBlockComment = true;
                j++; // skip *
                continue;
            }
            if (inBlockComment) {
                if (char === '*' && j < line.length - 1 && line[j + 1] === '/') {
                    inBlockComment = false;
                    j++; // skip /
                }
                continue;
            }

            // Handle Line Comments //
            if (!inBlockComment && char === '/' && j < line.length - 1 && line[j + 1] === '/') {
                break; // Ignore rest of line
            }

            // Check Braces
            if (['{', '[', '('].includes(char)) {
                stack.push({ char, line: i + 1, col: j + 1 });
            } else if (['}', ']', ')'].includes(char)) {
                if (stack.length === 0) {
                    console.log(`Unexpected '${char}' at line ${i + 1}:${j + 1}`);
                    return;
                }
                const last = stack.pop();
                if ((char === '}' && last.char !== '{') ||
                    (char === ']' && last.char !== '[') ||
                    (char === ')' && last.char !== '(')) {
                    console.log(`Mismatched '${char}' at line ${i + 1}:${j + 1}. Expected closing for '${last.char}' from line ${last.line}:${last.col}`);
                    return;
                }
            }
        }

        // Reset inString if line ends? No, template literals span lines.
        // But normal strings don't (except with \).
        // Let's assume template literals are the main concern.
    }

    if (stack.length > 0) {
        const last = stack[stack.length - 1];
        console.log(`Unclosed '${last.char}' at line ${last.line}:${last.col}`);
    } else {
        console.log("Syntax OK");
    }
}

const args = process.argv.slice(2);
let ignoreStart = -1, ignoreEnd = -1;
let filename = args[0];

if (args[0] === '--ignore') {
    const parts = args[1].split('-');
    ignoreStart = parseInt(parts[0]);
    ignoreEnd = parseInt(parts[1]);
    filename = args[2];
}

checkSyntax(filename, ignoreStart, ignoreEnd);
