const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

if (!content.includes('import { useCmsStore } from "@/lib/cms-store";')) {
    content = content.replace('import Link from "next/link";', 'import Link from "next/link";\nimport { useCmsStore } from "@/lib/cms-store";\nimport SectionEditorWrapper from "@/components/section-editor-wrapper";\nimport BlockEditorWrapper from "@/components/block-editor-wrapper";');
}

// Check if isEditMode exists, if not add it. Actually, it might not exist if I lost my changes.
if (content.includes('const isEditMode = useCmsStore')) {
    content = content.replace('const isEditMode = useCmsStore(state => state.isEditMode);', 'const { isEditMode, pageSections } = useCmsStore();');
} else {
    content = content.replace('const { addToCart } = useCart();', 'const { addToCart } = useCart();\n  const { isEditMode, pageSections } = useCmsStore();');
}

const mainReturnRegex = /return \(\s*<div className="w-full min-h-screen bg-background text-foreground space-y-12 pb-16">/;
const mainReturnMatch = content.match(mainReturnRegex);
if (!mainReturnMatch) throw new Error("Could not find main return");

const preMainReturn = content.substring(0, mainReturnMatch.index);
const postMainReturn = content.substring(mainReturnMatch.index);

const parts = postMainReturn.split('{/* 1. Hero Promo Grid (Carousel + Side Banners) */}');
const headerContent = parts[0]; 
const sectionsContentPart = parts[1];

const endParts = sectionsContentPart.split('{/* 5. Floating WhatsApp Assist Button */}');
const allSectionsStr = endParts[0];
const footerContentStr = endParts[1];

const s1Split = allSectionsStr.split('{/* 2. Shop By Categories */}');
let s1 = s1Split[0];
const rest1 = s1Split[1];

const s2Split = rest1.split('{/* 2.5 Core Services Grid Section */}');
let s2 = s2Split[0];
const rest2 = s2Split[1];

const s3Split = rest2.split('{/* 3. Promotional banner full-width */}');
let s3 = s3Split[0];
const rest3 = s3Split[1];

const s4Split = rest3.split('{/* 4. Limited Time Deals with Countdown */}');
let s4 = s4Split[0];
let s5 = s4Split[1];

function wrapSection(s, name) {
    // If it's already wrapped, don't wrap it again
    if (s.includes(`<SectionEditorWrapper`)) {
        return s.replace(`<SectionEditorWrapper sectionId="${name}">`, `<SectionEditorWrapper key={sectionId} sectionId={sectionId}>`);
    }
    return `\n      <SectionEditorWrapper key={sectionId} sectionId={sectionId}>\n${s}      </SectionEditorWrapper>\n`;
}

s1 = wrapSection(s1, 'hero_section');
s2 = wrapSection(s2, 'categories_section');
s3 = wrapSection(s3, 'services_section');
s4 = wrapSection(s4, 'promo_banner_section');
s5 = wrapSection(s5, 'limited_deals_section');

let renderFn = `
  const renderSection = (sectionId: string, index: number) => {
    const baseId = sectionId.split('-')[0];
    switch (baseId) {
`;

renderFn += "      case 'hero_section': return (" + s1 + ");\n";
renderFn += "      case 'categories_section': return (" + s2 + ");\n";
renderFn += "      case 'services_section': return (" + s3 + ");\n";
renderFn += "      case 'promo_banner_section': return (" + s4 + ");\n";
renderFn += "      case 'limited_deals_section': return (" + s5 + ");\n";
renderFn += "      default: return null;\n    }\n  };\n\n";

const finalContent = preMainReturn + renderFn + headerContent + "\n      {pageSections.map(renderSection)}\n\n      {/* 5. Floating WhatsApp Assist Button */}" + footerContentStr;

fs.writeFileSync('app/page.tsx', finalContent);
console.log('Done!');
