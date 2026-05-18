import re

with open('c:/Users/4-410-05/Desktop/sy/axon-main/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

def extract_and_replace(html, name, course):
    # Find the instructor card for this name
    pattern = r'(<div class="instructor-profile">.*?<h3>.*?'+name+'.*?</h3>.*?</p>\s*)(</div>)(\s*<div class="instructor-curriculum-tabs">.*?</button>\s*</div>)'
    match = re.search(pattern, html, re.DOTALL)
    if not match:
        return html, ''
    
    profile = match.group(1)
    tabs = match.group(3)
    
    # New profile with button
    new_profile = profile + f'    <button class="btn btn-outline btn-curriculum" data-instructor="{course}" style="margin-top: 1.5rem; border: 1px solid var(--accent-blue); color: var(--accent-blue); background: transparent; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;">상세 커리큘럼 보기</button>\n' + match.group(2)
    
    html = html[:match.start()] + new_profile + html[match.end():]
    return html, tabs

html, leejung_tabs = extract_and_replace(html, '이중철', 'leejung')
html, hwang_tabs = extract_and_replace(html, '황O규', 'hwang')
html, lee_tabs = extract_and_replace(html, '이O원', 'lee')

modal_html = f'''
    <!-- Curriculum Modal -->
    <div id="curriculum-modal" class="modal-overlay" style="display: none;">
        <div class="curriculum-modal-content">
            <button class="modal-close-btn" id="btn-close-curriculum" style="position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 2rem; cursor: pointer; color: var(--text-secondary);">&times;</button>
            <div id="curriculum-content-leejung" class="curriculum-instructor-block" style="display: none;">
{leejung_tabs}            </div>
            <div id="curriculum-content-hwang" class="curriculum-instructor-block" style="display: none;">
{hwang_tabs}            </div>
            <div id="curriculum-content-lee" class="curriculum-instructor-block" style="display: none;">
{lee_tabs}            </div>
        </div>
    </div>
'''

# Insert modal before scroll-top-btn
modal_index = html.find('<!-- Scroll to Top Button -->')
if modal_index != -1:
    html = html[:modal_index] + modal_html + '\n    ' + html[modal_index:]

with open('c:/Users/4-410-05/Desktop/sy/axon-main/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
