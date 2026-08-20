const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

const returnStr = '  return (\n    <div className="w-full min-h-screen bg-background text-foreground space-y-12 pb-16">';
let returnIdx = content.indexOf(returnStr);
if (returnIdx === -1) {
    // Try with \r\n
    const returnStrWin = '  return (\r\n    <div className="w-full min-h-screen bg-background text-foreground space-y-12 pb-16">';
    returnIdx = content.indexOf(returnStrWin);
}
if (returnIdx === -1) throw new Error('Return not found');

// Find const renderSection = ...
const renderStartIdx = content.indexOf('  const renderSection = (sectionId: string, index: number) => {');
if (renderStartIdx === -1) throw new Error('renderSection not found');

// Find end of renderSection
const renderEndStr = '      default: return null;\n    }\n  };\n\n';
let renderEndIdx = content.indexOf(renderEndStr);
if (renderEndIdx === -1) {
    const renderEndStrWin = '      default: return null;\r\n    }\r\n  };\r\n\r\n';
    renderEndIdx = content.indexOf(renderEndStrWin);
    if (renderEndIdx !== -1) {
        renderEndIdx += renderEndStrWin.length;
    }
} else {
    renderEndIdx += renderEndStr.length;
}
if (renderEndIdx === -1) throw new Error('renderEnd not found');

// Extract renderSection function
const renderFunction = content.substring(renderStartIdx, renderEndIdx);

// Remove renderSection from its current place
const contentWithoutRender = content.substring(0, renderStartIdx) + content.substring(renderEndIdx);

// Insert renderFunction before return (
const newReturnIdx = contentWithoutRender.indexOf('  return (');
const finalContent = contentWithoutRender.substring(0, newReturnIdx) + renderFunction + contentWithoutRender.substring(newReturnIdx);

fs.writeFileSync('app/page.tsx', finalContent);
console.log('Fixed!');
