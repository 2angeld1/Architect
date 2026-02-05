const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      walk(filepath, callback);
    } else if (file.endsWith('.tsx')) {
      callback(filepath);
    }
  });
}

const targetDir = 'c:\\Sources\\Archiquect\\frontend-next\\src\\components';

walk(targetDir, (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  let originalContent = content;

  // Replace Link props
  content = content.replace(/to="/g, 'href="');
  content = content.replace(/to={/g, 'href={');
  
  if (content !== originalContent) {
    fs.writeFileSync(filepath, content);
    console.log(`Fixed links in ${filepath}`);
  }
});
