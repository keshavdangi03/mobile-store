const fs = require('fs');
const transcriptPath = 'C:\\Users\\agraw\\.gemini\\antigravity-ide\\brain\\d4b40a43-fad5-4392-8d85-e9ace6285f2e\\.system_generated\\logs\\transcript.jsonl';
const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('File Path: `file:///e:/Programming/mobile-store/app/page.tsx`')) {
      try {
          const entry = JSON.parse(line);
          const content = entry.content || (entry.tool_calls ? entry.tool_calls[0].output : null) || entry.output;
          if (content) {
              console.log(`Found at step ${entry.step_index}, length: ${content.length}`);
              fs.writeFileSync(`backup_${entry.step_index}.txt`, content);
          }
      } catch(e) {
          // might not be a valid top level JSON if it's deeply nested, but it should be
      }
  }
}
