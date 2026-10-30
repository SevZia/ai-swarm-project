const fs = require('fs');
const content = fs.readFileSync('src/frontend/index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('id="tab-') || l.includes('function switchTab')) {
    console.log(`Line ${i + 1}: ${l.trim()}`);
  }
});
