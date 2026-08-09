const fs = require('fs');
const content = fs.readFileSync('c:/Users/aaccd/Downloads/ux/myeongsim-report/src/components/chat/DrillDownIconMenu.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('includes')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
