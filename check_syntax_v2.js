
const fs = require('fs');

function checkSyntax(filename, ignoreStart, ignoreEnd) {
    const code = fs.readFileSync(filename, 'utf8');
    const stack = [];
    let inString = false;
    let stringChar = '';

    const lines = code.split('\n');

    for (let i = 0; i < lines.length; i++) {
        // Skip ignored lines
        if (i + 1 >= ignoreStart && i + 1 <= ignoreEnd) continue;

        const line = lines[i];
        for (let j = 0; j < line.length; j++) {
            const char = line[j];

            // Simple string handler
            if (!inString && (char === '"' || char === "'" || char === "`")) {
                inString = true;
                stringChar = char;
                continue;
            }
            if (inString) {
                if (char === stringChar) {
                    if (j > 0 && line[j - 1] === '\\') { // escaped
                        // continue
                    } else {
                        inString = false;
                    }
                }
                continue;
            }

            // Simple comment handler
            if (char === '/' && j < line.length - 1 && line[j + 1] === '/') {
                break; // Ignore rest of line
            }

            if (['{', '[', '('].includes(char)) {
                stack.push({ char, line: i + 1, col: j + 1 });
            } else if (['}', ']', ')'].includes(char)) {
                if (stack.length === 0) {
                    console.log(`Unexpected '${char}' at line ${i + 1}:${j + 1}`);
                    return; // Found the error!
                }
                const last = stack.pop();
                if ((char === '}' && last.char !== '{') ||
                    (char === ']' && last.char !== '[') ||
                    (char === ')' && last.char !== '(')) {
                    console.log(`Mismatched '${char}' at line ${i + 1}:${j + 1}. Expected closing for '${last.char}' from line ${last.line}:${last.col}`);
                    return; // Found mismatch
                }
            }
        }
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
} else if (args[1] === '--ignore') {
    filename = args[0];
    const parts = args[2].split('-');
    ignoreStart = parseInt(parts[0]);
    ignoreEnd = parseInt(parts[1]);
}

if (!filename) {
    console.error("Usage: node check_syntax_v2.js [--ignore start-end] filename");
} else {
    checkSyntax(filename, ignoreStart, ignoreEnd);
}
