
const fs = require('fs');

function checkSyntax(filename) {
    const code = fs.readFileSync(filename, 'utf8');
    const stack = [];
    let inString = false;
    let stringChar = '';
    let inComment = false; // Simple line comment check


    let ignoreStart = -1, ignoreEnd = -1;
    const args = process.argv.slice(2);
    const ignoreArgIndex = args.indexOf('--ignore');
    if (ignoreArgIndex !== -1 && args[ignoreArgIndex + 1]) {
        const parts = args[ignoreArgIndex + 1].split('-');
        ignoreStart = parseInt(parts[0]);
        ignoreEnd = parseInt(parts[1]);
    }
    const filename = args[0] === '--ignore' ? args[2] : args[0]; // handle naive arg parsing

    for (let i = 0; i < lines.length; i++) {
        // Skip ignored lines
        if (i + 1 >= ignoreStart && i + 1 <= ignoreEnd) continue;

        const line = lines[i];
        for (let j = 0; j < line.length; j++) {
            const char = line[j];

            // Simple string handler (doesn't handle escaping perfectly but good enough)
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
                    console.error(`Unexpected '${char}' at line ${i + 1}:${j + 1}`);
                    return;
                }
                const last = stack.pop();
                if ((char === '}' && last.char !== '{') ||
                    (char === ']' && last.char !== '[') ||
                    (char === ')' && last.char !== '(')) {
                    console.error(`Mismatched '${char}' at line ${i + 1}:${j + 1}. Expected closing for '${last.char}' from line ${last.line}:${last.col}`);
                    return;
                }
            }
        }
    }

    if (stack.length > 0) {
        const last = stack[stack.length - 1];
        console.error(`Unclosed '${last.char}' at line ${last.line}:${last.col}`);
    } else {
        console.log("Syntax OK");
    }
}

checkSyntax('src/app/api/chat/route.ts');
