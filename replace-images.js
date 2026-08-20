const fs = require('fs');

let content = fs.readFileSync('app/page.tsx', 'utf8');

if (!content.includes('import EditableImage')) {
  content = content.replace('import BlockEditorWrapper from "@/components/block-editor-wrapper";', 'import BlockEditorWrapper from "@/components/block-editor-wrapper";\nimport EditableImage from "@/components/editable-image";');
}

let counter = 1;
content = content.replace(/<img\s+src=\{([^}]+)\}/g, (match, srcCode) => {
  return `<EditableImage imageId="dynamic-img-${counter++}" defaultSrc={${srcCode}}`;
});

content = content.replace(/<img\s+src="([^"]+)"/g, (match, srcString) => {
  return `<EditableImage imageId="static-img-${counter++}" defaultSrc="${srcString}"`;
});

fs.writeFileSync('app/page.tsx', content);
console.log('Replaced images with EditableImage');
