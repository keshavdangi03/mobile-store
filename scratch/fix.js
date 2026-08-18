const fs = require('fs');
let data = fs.readFileSync('components/header.tsx', 'utf8');

const mapping = {
  'label="ANNOUNCEMENT BAR"': '"ANNOUNCEMENT BAR"',
  'label="SITE TITLE & LOGO"': '"SITE TITLE & LOGO"',
  'label="SEARCH"': '"SEARCH"',
  'label="LIVE CHAT"': '"LIVE CHAT"',
  'label="THEME"': '"THEME"',
  'label="CART"': '"CART"',
  'label="ACCOUNT"': '"ACCOUNT"',
  'label="NAVIGATION"': '"NAVIGATION"',
  'label="QUICK LINKS"': '"QUICK LINKS"'
};

for (const [labelStr, valStr] of Object.entries(mapping)) {
  const searchStr = labelStr + ' \n            isEditorActive={isEditorActive} \n            isActiveSection={activeSection === }\n            hasActiveSection={activeSection !== null}';
  
  // wait, the broken code looks like:
  // label="ANNOUNCEMENT BAR" 
  // isEditorActive={isEditorActive} 
  // isActiveSection={activeSection === }
  // hasActiveSection={activeSection !== null}
}

// Instead of mapping, let's just use regex in node to fix it.
data = data.replace(/label="([^"]+)"([\s\S]*?)isActiveSection=\{activeSection === \}/g, (match, p1, p2) => {
  return `label="${p1}"${p2}isActiveSection={activeSection === "${p1}"}`;
});

fs.writeFileSync('components/header.tsx', data);
console.log('Fixed file');
