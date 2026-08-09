const fs = require('fs');
const path = require('path');

function search(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        search(fullPath);
      }
    } else if (file === 'page.tsx' || file === 'layout.tsx') {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('includes')) {
        console.log(`Found in: ${fullPath}`);
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (line.includes('includes')) {
            console.log(`  ${idx+1}: ${line.trim()}`);
          }
        });
      }
    }
  }
}
search('src/app');
