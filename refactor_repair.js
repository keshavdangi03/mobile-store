const fs = require('fs');
try {
  let text = fs.readFileSync('e:/Programming/mobile-store/app/repair/page.tsx', 'utf-8');

  text = text.replace(
    /import \{ \n  Smartphone, \n  Wrench/g,
    'import BlockEditorWrapper from "@/components/block-editor-wrapper";\nimport { \n  Smartphone, \n  Wrench'
  );

  // Replace the main heading
  text = text.replace(
    /Fix Your Device in <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">5 Easy Steps<\/span>/g,
    '<BlockEditorWrapper blockId="repair-heading" defaultText="Fix Your Device in 5 Easy Steps" />'
  );

  // Replace paragraph
  text = text.replace(
    /<p className="text-xs text-foreground\/60 leading-relaxed">\n\s*Professional multi-brand repair service with certified OEM parts. Track every milestone live from your customer profile page.\n\s*<\/p>/g,
    '<BlockEditorWrapper blockId="repair-desc" as="p" className="text-xs text-foreground/60 leading-relaxed" defaultText="Professional multi-brand repair service with certified OEM parts. Track every milestone live from your customer profile page." />'
  );

  fs.writeFileSync('e:/Programming/mobile-store/app/repair/page.tsx', text);
  console.log("Repair updated");
} catch(e) { console.error(e) }
