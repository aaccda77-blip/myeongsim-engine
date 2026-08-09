const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        searchDir(fullPath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (fullPath.includes('src/app') || fullPath.includes('src\\app') || fullPath.includes('src/components') || fullPath.includes('src\\components')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('.includes')) {
          const lines = content.split('\n');
          lines.forEach((line, idx) => {
            if (line.includes('.includes')) {
              console.log(`${fullPath}:${idx + 1}: ${line.trim()}`);
            }
          });
        }
      }
    }
  }
}

searchDir('src');
