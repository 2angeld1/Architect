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

  // Replace imports
  if (content.includes('react-router-dom')) {
    // Check if it needs 'use client'
    const needsClient = content.includes('useState') || content.includes('useEffect') || content.includes('useNavigate') || content.includes('useLocation') || content.includes('onClick');
    
    if (needsClient && !content.includes("'use client'")) {
      content = "'use client';\n\n" + content;
    }

    // Replace Link import
    if (content.includes('import { Link } from \'react-router-dom\'')) {
      content = content.replace('import { Link } from \'react-router-dom\'', 'import Link from \'next/link\'');
    } else if (content.match(/import {.*Link.*} from 'react-router-dom'/)) {
        // Complex import
        content = content.replace(/import {(.*)Link(.*)} from 'react-router-dom'/, "import Link from 'next/link';\nimport {$1$2} from 'next/navigation'");
    }
    
    // Replace other hooks imports
    content = content.replace(/import { (.*)useNavigate(.*) } from 'react-router-dom'/, "import { $1useRouter$2 } from 'next/navigation'");
    content = content.replace(/import { (.*)useLocation(.*) } from 'react-router-dom'/, "import { $1usePathname$2 } from 'next/navigation'");
    
    // Clean up empty imports or leftovers
    content = content.replace(/import {  } from 'next\/navigation';/g, '');
    content = content.replace(/import { , } from 'next\/navigation';/g, '');

    // Replace usages
    content = content.replace(/useLocation\(\)/g, 'usePathname()');
    content = content.replace(/location.pathname/g, 'pathname');
    content = content.replace(/useNavigate\(\)/g, 'useRouter()');
    content = content.replace(/navigate\(/g, 'router.push(');
    
    // Replace Link props (already done partially but good to ensure)
    // content = content.replace(/to="/g, 'href="'); // Powershell did this
    // content = content.replace(/to={/g, 'href={'); // Powershell did this
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filepath, content);
    console.log(`Updated ${filepath}`);
  }
});
