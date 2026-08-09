const fs = require('fs');
const path = require('path');

function searchFile(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        searchFile(fullPath);
      }
    } else if (file.toLowerCase().includes('biorhythm')) {
      console.log("Found biorhythm file:", fullPath);
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.includes('includes')) {
          console.log(` - ${idx + 1}: ${line.trim()}`);
        }
      });
    }
  }
}
searchFile('src');
