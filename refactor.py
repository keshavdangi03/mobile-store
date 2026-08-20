import re

with open('app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('const isEditMode = useCmsStore(state => state.isEditMode);', 'const { isEditMode, pageSections } = useCmsStore();')

parts = content.split('{/* 1. Hero Promo Grid (Carousel + Side Banners) - Section 1 */}')
pre_hero = parts[0]
post_hero = parts[1]

render_fn = '''
  const renderSection = (sectionId: string) => {
    const baseId = sectionId.split('-')[0];
    switch (baseId) {
'''

sections = post_hero.split('{/* 5. Floating WhatsApp Assist Button */}')
sections_content = sections[0]
footer_content = sections[1]

s1_split = sections_content.split('{/* 2. Shop By Categories */}')
s1 = s1_split[0]
rest = s1_split[1]

s2_split = rest.split('{/* 2.5 Core Services Grid Section */}')
s2 = s2_split[0]
rest = s2_split[1]

s3_split = rest.split('{/* 3. Promotional banner full-width */}')
s3 = s3_split[0]
rest = s3_split[1]

s4_split = rest.split('{/* 4. Limited Time Deals with Countdown */}')
s4 = s4_split[0]
s5 = s4_split[1]

def replace_wrapper(s, name):
    return s.replace(f'<SectionEditorWrapper sectionId="{name}">', f'<SectionEditorWrapper key={{sectionId}} sectionId={{sectionId}}>')

s1 = replace_wrapper(s1, 'hero_section')
s2 = replace_wrapper(s2, 'categories_section')
s3 = replace_wrapper(s3, 'services_section')
s4 = replace_wrapper(s4, 'promo_banner_section')
s5 = replace_wrapper(s5, 'limited_deals_section')

render_fn += '      case \\'hero_section\\': return (' + s1 + ');\n'
render_fn += '      case \\'categories_section\\': return (' + s2 + ');\n'
render_fn += '      case \\'services_section\\': return (' + s3 + ');\n'
render_fn += '      case \\'promo_banner_section\\': return (' + s4 + ');\n'
render_fn += '      case \\'limited_deals_section\\': return (' + s5 + ');\n'
render_fn += '      default: return null;\n    }\n  };\n\n'

final_content = pre_hero + render_fn + '      {pageSections.map(renderSection)}\n\n      {/* 5. Floating WhatsApp Assist Button */}' + footer_content

with open('app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(final_content)
print('Done!')
