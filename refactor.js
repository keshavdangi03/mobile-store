const fs = require('fs');
const content = fs.readFileSync('app/page.tsx', 'utf8');

let newContent = content.replace('const isEditMode = useCmsStore(state => state.isEditMode);', 'const { isEditMode, pageSections } = useCmsStore();');

const parts = newContent.split('{/* 1. Hero Promo Grid (Carousel + Side Banners) - Section 1 */}');
const preHero = parts[0];
const postHero = parts[1];

let renderFn = `
  const renderSection = (sectionId: string, index: number) => {
    const baseId = sectionId.split('-')[0];
    switch (baseId) {
`;

const sections = postHero.split('{/* 5. Floating WhatsApp Assist Button */}');
const sectionsContent = sections[0];
const footerContent = sections[1];

const s1Split = sectionsContent.split('{/* 2. Shop By Categories */}');
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

function replaceWrapper(s, name) {
    return s.replace(`<SectionEditorWrapper sectionId="${name}">`, `<SectionEditorWrapper key={sectionId} sectionId={sectionId}>`);
}

s1 = replaceWrapper(s1, 'hero_section');
s2 = replaceWrapper(s2, 'categories_section');
s3 = replaceWrapper(s3, 'services_section');
s4 = replaceWrapper(s4, 'promo_banner_section');
s5 = replaceWrapper(s5, 'limited_deals_section');

renderFn += "      case 'hero_section': return (" + s1 + ");\n";
renderFn += "      case 'categories_section': return (" + s2 + ");\n";
renderFn += "      case 'services_section': return (" + s3 + ");\n";
renderFn += "      case 'promo_banner_section': return (" + s4 + ");\n";
renderFn += "      case 'limited_deals_section': return (" + s5 + ");\n";
renderFn += "      default: return null;\n    }\n  };\n\n";

const finalContent = preHero + renderFn + "      {pageSections.map(renderSection)}\n\n      {/* 5. Floating WhatsApp Assist Button */}" + footerContent;

fs.writeFileSync('app/page.tsx', finalContent);
console.log('Done!');
