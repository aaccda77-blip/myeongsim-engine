const fs = require('fs');
const path = require('path');

const directoryToSearch = path.join(__dirname, '../src');

function replaceInFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Replace Korean '내러티브' with '인생각본'
    let updatedContent = fileContent.replace(/내러티브/g, '인생각본');
    // Also replace English 'Narrative' with 'Life Script' in string literals/comments if needed.
    // Let's do a case-sensitive replace for common title cases, and keep it safe for others.
    // updatedContent = updatedContent.replace(/Narrative/g, 'Life Script');

    if (fileContent !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function traverseDirectory(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDirectory(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.json') || fullPath.endsWith('.md')) {
            replaceInFile(fullPath);
        }
    });
}

traverseDirectory(directoryToSearch);
console.log('Finished updating "내러티브" to "인생각본".');
