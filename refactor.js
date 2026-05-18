const fs = require('fs');
let html = fs.readFileSync('c:/Users/4-410-05/Desktop/sy/axon-main/index.html', 'utf8');

const regexLeeJung = /(<div class=\"instructor-profile\">.*?<h3>이중철 마스터<\/h3>.*?<\/p>\s*)(<\/div>)(\s*<div class=\"instructor-curriculum-tabs\">[\s\S]*?<\/button>\s*<\/div>)/;
const matchLeeJung = html.match(regexLeeJung);
const tabsLeeJung = matchLeeJung ? matchLeeJung[3] : '';

const regexHwang = /(<div class=\"instructor-profile\">.*?<h3>황O규 마스터<\/h3>.*?<\/p>\s*)(<\/div>)(\s*<div class=\"instructor-curriculum-tabs\">[\s\S]*?<\/button>\s*<\/div>)/;
const matchHwang = html.match(regexHwang);
const tabsHwang = matchHwang ? matchHwang[3] : '';

const regexLee = /(<div class=\"instructor-profile\">.*?<h3>이O원 마스터<\/h3>.*?<\/p>\s*)(<\/div>)(\s*<div class=\"instructor-curriculum-tabs\">[\s\S]*?<\/button>\s*<\/div>)/;
const matchLee = html.match(regexLee);
const tabsLee = matchLee ? matchLee[3] : '';

if (matchLeeJung) {
    html = html.replace(regexLeeJung, matchLeeJung[1] + '<button class=\"btn btn-outline btn-curriculum\" data-instructor=\"leejung\" style=\"margin-top: 1.5rem; border: 1px solid var(--accent-blue); color: var(--accent-blue); background: transparent; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;\">상세 커리큘럼 보기</button>\n                            ' + matchLeeJung[2]);
}

if (matchHwang) {
    html = html.replace(regexHwang, matchHwang[1] + '<button class=\"btn btn-outline btn-curriculum\" data-instructor=\"hwang\" style=\"margin-top: 1.5rem; border: 1px solid var(--accent-blue); color: var(--accent-blue); background: transparent; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;\">상세 커리큘럼 보기</button>\n                            ' + matchHwang[2]);
}

if (matchLee) {
    html = html.replace(regexLee, matchLee[1] + '<button class=\"btn btn-outline btn-curriculum\" data-instructor=\"lee\" style=\"margin-top: 1.5rem; border: 1px solid var(--accent-blue); color: var(--accent-blue); background: transparent; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;\">상세 커리큘럼 보기</button>\n                            ' + matchLee[2]);
}

const modalHtml = `
    <!-- Curriculum Modal -->
    <div id="curriculum-modal" class="modal-overlay" style="display: none;">
        <div class="curriculum-modal-content">
            <button class="modal-close-btn" id="btn-close-curriculum">&times;</button>
            <div id="curriculum-content-leejung" class="curriculum-instructor-block" style="display: none;">
${tabsLeeJung}
            </div>
            <div id="curriculum-content-hwang" class="curriculum-instructor-block" style="display: none;">
${tabsHwang}
            </div>
            <div id="curriculum-content-lee" class="curriculum-instructor-block" style="display: none;">
${tabsLee}
            </div>
        </div>
    </div>
`;

html = html.replace('<!-- Scroll to Top Button -->', modalHtml + '\n    <!-- Scroll to Top Button -->');
fs.writeFileSync('c:/Users/4-410-05/Desktop/sy/axon-main/index.html', html, 'utf8');
console.log('Done!');
