const fs = require('fs');

const transcriptPath = 'C:\\Users\\agraw\\.gemini\\antigravity-ide\\brain\\d4b40a43-fad5-4392-8d85-e9ace6285f2e\\.system_generated\\logs\\transcript.jsonl';
const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');

let viewFile1_149 = null;
let viewFile150_800 = null;

for (const line of lines) {
  if (!line.trim()) continue;
  if (line.includes('Showing lines 1 to 149') && line.includes('File Path: `file:///e:/Programming/mobile-store/app/page.tsx`')) {
      const entry = JSON.parse(line);
      viewFile1_149 = entry.content || (entry.tool_calls ? entry.tool_calls[0].output : JSON.stringify(entry));
  } else if (line.includes('Showing lines 150 to 800') && line.includes('File Path: `file:///e:/Programming/mobile-store/app/page.tsx`')) {
      const entry = JSON.parse(line);
      viewFile150_800 = entry.content || (entry.tool_calls ? entry.tool_calls[0].output : JSON.stringify(entry));
  }
}

// Fallback to searching output fields explicitly if needed
if (!viewFile1_149 || !viewFile150_800) {
    for (const line of lines) {
        if (!line.trim()) continue;
        if (line.includes('Showing lines 1 to 149')) viewFile1_149 = line;
        if (line.includes('Showing lines 150 to 800')) viewFile150_800 = line;
    }
}

function parseViewFileOutput(content) {
    if (typeof content !== 'string') return [];
    
    // In JSON, it's escaped \n
    let text = content;
    try {
        const parsed = JSON.parse(content);
        if (parsed.output) text = parsed.output;
    } catch(e) {}
    
    // If it's a full log line
    try {
        const obj = JSON.parse(text);
        if (obj.content) text = obj.content;
        else if (obj.output) text = obj.output;
    } catch(e) {}
    
    // If it contains escaped newlines, unescape them
    text = text.replace(/\\n/g, '\n');
    
    const lines = text.split('\n');
    const result = [];
    let parsing = false;
    for (const line of lines) {
        if (line.match(/^\d+:/)) {
            parsing = true;
            result.push(line.replace(/^\d+:\s?/, ''));
        } else if (parsing) {
            if (line.startsWith('The above content')) break;
        }
    }
    return result;
}

const lines1 = parseViewFileOutput(viewFile1_149);
const lines2 = parseViewFileOutput(viewFile150_800);

if (lines1.length === 0 || lines2.length === 0) {
    console.error('Failed to parse lines. Lengths:', lines1.length, lines2.length);
    console.log(viewFile1_149?.substring(0, 200));
    process.exit(1);
}

const fullLines = [...lines1, ...lines2];
fs.writeFileSync('e:/Programming/mobile-store/app/page.tsx', fullLines.join('\n'));
console.log('Restored page.tsx successfully!');
