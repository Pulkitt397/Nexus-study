/* =========================================================
   Study with Nexus — Web Application
   ========================================================= */

// ── State ───────────────────────────────────────────────
const state = {
    flamingoProse: [],
    flamingoPoetry: [],
    vistasChapters: [],
    grammarTopics: [],
    writingFormats: [],
    examBlueprint: {},
    config: {},
    selectedCategory: 'All',
    searchQuery: '',
    generatedTest: null,
    chatMessages: [],
    aiProvider: 'gemini',
    isLoading: true,
};

// ── Dashboard Logic ──────────────────────────────────────
let dashboardTimer = null;
let timeLeft = 48 * 3600; // 48 hours in seconds

function updateDashboardTimer() {
    const hours = Math.floor(timeLeft / 3600);
    const mins = Math.floor((timeLeft % 3600) / 60);
    const secs = timeLeft % 60;
    const timerStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    const el = document.getElementById('countdown-timer');
    if (el) el.innerText = timerStr;
    if (timeLeft > 0) timeLeft--;
}

function hideDashboard() {
    const dash = document.getElementById('dashboard');
    if (dash) {
        dash.classList.remove('dashboard-visible');
        dash.style.display = 'none';
    }
}

function showDashboard() {
    const dash = document.getElementById('dashboard');
    if (dash) {
        dash.classList.add('dashboard-visible');
        dash.style.display = 'flex';
    }
}

function resumeLastRead() {
    let last = state.flamingoProse.find(c => c.title.toLowerCase().includes('last lesson'));
    if (!last && state.flamingoProse.length > 0) last = state.flamingoProse[0];

    if (last) {
        const idx = state.flamingoProse.indexOf(last);
        navigate(`chapter/prose-${idx}`);
        hideDashboard();
    }
}

// Start timer
setInterval(updateDashboardTimer, 1000);

// Global Exposure
window.hideDashboard = hideDashboard;
window.showDashboard = showDashboard;
window.resumeLastRead = resumeLastRead;
window.setCategory = (cat) => {
    state.selectedCategory = cat;
    render();
};

const ICONS = {
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    openBook: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    grammar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>',
    pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
    test: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
    stop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
    timer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    volume: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
};

// ── File Loading & Parsing ──────────────────────────────
async function loadFile(path) {
    const res = await fetch(path);
    return res.text();
}

function parseChapters(content, delimiter, type, filterFn) {
    const parts = content.split(delimiter);
    const chapters = [];
    for (const part of parts) {
        if (!part.trim() || part.includes('*** BOOK')) continue;

        const fullText = part.trim();
        const lines = fullText.split('\n');

        // Title Parse
        const titleLine = lines[0];
        let title = titleLine.split(':').slice(1).join(':').replace(/ ===/, '').trim();
        if (!title) title = titleLine.replace(/===/, '').trim();

        if (filterFn && filterFn(title)) continue;

        // Metadata
        const authorMatch = fullText.match(/AUTHOR:\s*(.+)/);
        const themeMatch = fullText.match(/THEME:\s*(.+)/); // \r? check

        // Section Extractor
        const extractSection = (regex) => {
            const match = fullText.match(regex);
            return match ? match[1].trim() : '';
        };

        // Flexible matching for different file formats
        // Flexible matching for different file formats
        const summary = extractSection(/(?:SHORT SUMMARY|FULL STORY|CONTENT|STORY)\s*:\s*([\s\S]*?)(?=\r?\n\s*(?:KEY POINTS|THEMES|PART|Ending|Structure|Important|CHARACTER|===|$))/i);
        const keyPoints = extractSection(/(?:KEY POINTS|KEY KEY POINTS|KEY ELEMENTS)(?: & EXAM NOTES)?\s*:\s*([\s\S]*?)(?=\r?\n\s*(?:CHARACTER|IMPORTANT|Ending|===|$))/i);
        const characters = extractSection(/(?:CHARACTER SKETCH|CHARACTERS)\s*:\s*([\s\S]*?)(?=\r?\n\s*(?:IMPORTANT|STORY|===|$))/i);
        const questions = extractSection(/IMPORTANT QUESTIONS\s*:\s*([\s\S]*?)(?=$|===)/i);

        chapters.push({
            title,
            type,
            author: authorMatch ? authorMatch[1].trim() : '',
            theme: themeMatch ? themeMatch[1].trim() : '',
            summary: summary || 'No summary available.',
            keyPoints: keyPoints || '',
            characters: characters || '',
            questions: questions || '',
            fullContent: fullText
        });
    }
    return chapters;
}

function parseGrammar(content) {
    const topics = content.split('=== TOPIC');
    const result = [];
    for (const topic of topics) {
        if (!topic.trim() || topic.includes('*** RBSE')) continue;
        const lines = topic.split('\n');

        let title = lines[0].includes(':') ? lines[0].split(':')[1] : lines[0];
        title = title.replace(/\(.*\)/, '').replace(/===/, '').trim();

        const fullText = topic.trim();
        const definitionMatch = fullText.match(/DEFINITION:\s*(.+)/);

        // Get content after first few metadata lines
        const bodyStartIndex = lines.findIndex(l => l.includes('RULE') || l.includes('TYPE') || l.includes('Common Exam'));
        const body = bodyStartIndex !== -1 ? lines.slice(bodyStartIndex).join('\n') : lines.slice(2).join('\n');

        result.push({
            title,
            definition: definitionMatch ? definitionMatch[1].trim() : '',
            content: body.trim(),
            examples: [] // handled in rendering
        });
    }
    return result;
}

function parseWriting(content) {
    const sections = content.split('=== SECTION');
    const result = [];
    for (const section of sections) {
        if (!section.trim() || section.includes('*** RBSE')) continue;

        const lines = section.split('\n');
        let sectionTitle = lines[0].includes(':') ? lines[0].split(':')[1] : lines[0];
        sectionTitle = sectionTitle.replace(/\(.*\)/, '').replace(/===/, '').trim();

        // Split by "1. ", "2. " etc to get formats
        const items = section.split(/\n\d+\.\s/);

        for (let i = 1; i < items.length; i++) {
            const itemText = items[i];
            const endOfTitle = itemText.indexOf('\n');
            const title = itemText.substring(0, endOfTitle).trim();
            const body = itemText.substring(endOfTitle).trim();

            result.push({
                title: title, // e.g. NOTICE WRITING
                category: sectionTitle,
                content: body
            });
        }
    }
    return result;
}

async function loadAllData() {
    try {
        const [flamingo, poetry, vistas, grammar, writing, blueprint, mockBP, config] = await Promise.all([
            loadFile('assets/Flamingo.txt'),
            loadFile('assets/flamingo_poetry.txt'),
            loadFile('assets/vistas_master.txt'),
            loadFile('assets/grammer_master.txt'),
            loadFile('assets/writting_master.txt'),
            loadFile('assets/blueprint_ofmyexam.txt'),
            loadFile('assets/mocktest_blueprint'),
            loadFile('assets/config.json'),
        ]);

        state.flamingoProse = parseChapters(flamingo, '=== CHAPTER', 'prose');
        state.flamingoPoetry = parseChapters(poetry, '=== POEM', 'poetry',
            title => title.toLowerCase().includes('school classroom'));
        state.vistasChapters = parseChapters(vistas, '=== CHAPTER', 'vistas',
            title => title.toLowerCase().includes('wizard hit mommy') || title.toLowerCase().includes('evans tries'));
        state.grammarTopics = parseGrammar(grammar);
        state.writingFormats = parseWriting(writing);

        try { state.examBlueprint = JSON.parse(mockBP); } catch (e) { console.warn('Mock blueprint parse error', e); }
        try { state.config = JSON.parse(config); } catch (e) { console.warn('Config parse error', e); }

        if (timeLeft === 48 * 3600) { // first load
            const lastItemEl = document.getElementById('last-read-item');
            if (lastItemEl) {
                const last = state.flamingoProse.find(c => c.title.toLowerCase().includes('last lesson')) || state.flamingoProse[0];
                if (last) lastItemEl.innerText = last.title;
            }
        }

        state.isLoading = false;
        render(); // Initial render
    } catch (err) {

        console.error('Error loading data:', err);
        state.isLoading = false;
    }
}

// ── TTS Service ─────────────────────────────────────────
let ttsUtterance = null;
let isSpeaking = false;
let availableVoices = [];

function loadVoices() {
    availableVoices = speechSynthesis.getVoices();
}

// Load voices immediately and when changed
loadVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
}

function speak(text) {
    stopSpeaking();
    if (availableVoices.length === 0) loadVoices();

    ttsUtterance = new SpeechSynthesisUtterance(text);

    // Prioritize "Neerja" (Microsoft) or "Google" Indian voices for a soft, natural accent
    const indianVoice = availableVoices.find(v => v.name.includes('Neerja')) ||
        availableVoices.find(v => v.lang === 'en-IN' && v.name.includes('Google')) ||
        availableVoices.find(v => v.lang === 'en-IN' && v.name.includes('Heera')) ||
        availableVoices.find(v => v.lang === 'en-IN');

    if (indianVoice) {
        ttsUtterance.voice = indianVoice;
    } else {
        ttsUtterance.lang = 'en-IN';
    }

    // "Softer" adjustments: slightly lower rate and natural pitch
    ttsUtterance.rate = 0.85;
    ttsUtterance.pitch = 1.05;
    ttsUtterance.volume = 1.0;

    ttsUtterance.onend = () => {
        isSpeaking = false;
        const btn = document.getElementById('tts-btn');
        if (btn) btn.innerHTML = `${ICONS.play} <span>Listen to Chapter</span>`;
    };

    speechSynthesis.speak(ttsUtterance);
    isSpeaking = true;
}

function stopSpeaking() {
    speechSynthesis.cancel();
    isSpeaking = false;
}

// ── Router ──────────────────────────────────────────────
function navigate(hash) {
    window.location.hash = hash;
    if (hash === 'home') {
        showDashboard();
    } else {
        hideDashboard();
    }
}


function getRoute() {
    const hash = window.location.hash.slice(1) || 'home';
    const parts = hash.split('/');
    return { view: parts[0], param: parts[1] };
}

// ── Rendering Engine ────────────────────────────────────
const $main = () => document.getElementById('main');

function setActiveNav(view) {
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', el.dataset.view === view);
    });
}

function render() {
    const route = getRoute();
    setActiveNav(route.view);
    stopSpeaking();

    switch (route.view) {
        case 'home': renderHome(); break;
        case 'chapter': renderChapterDetail(route.param); break;
        case 'grammar': renderGrammarDetail(route.param); break;
        case 'writing': renderWritingDetail(route.param); break;
        case 'mocktest': renderMockTest(); break;
        case 'ai-tutor': renderAiTutor(); break;
        default: renderHome();
    }
}

// ── Home View ───────────────────────────────────────────
function getAllItems() {
    const cat = state.selectedCategory;
    let items = [];
    if (cat === 'All' || cat === 'Flamingo') {
        items.push(...state.flamingoProse.map((c, i) => ({ ...c, idx: i, kind: 'prose' })));
        items.push(...state.flamingoPoetry.map((c, i) => ({ ...c, idx: i, kind: 'poetry' })));
    }
    if (cat === 'All' || cat === 'Vistas') {
        items.push(...state.vistasChapters.map((c, i) => ({ ...c, idx: i, kind: 'vistas' })));
    }
    if (cat === 'All' || cat === 'Grammar') {
        items.push(...state.grammarTopics.map((t, i) => ({ ...t, idx: i, kind: 'grammar' })));
    }
    if (cat === 'All' || cat === 'Writing') {
        items.push(...state.writingFormats.map((w, i) => ({ ...w, idx: i, kind: 'writing' })));
    }

    if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        items = items.filter(item => item.title.toLowerCase().includes(q));
    }
    return items;
}

function cardColor(index) {
    const colors = ['purple', 'yellow', 'blue'];
    return colors[index % 3];
}

function badgeLabel(kind) {
    const map = { prose: 'PROSE', poetry: 'POETRY', vistas: 'VISTAS', grammar: 'GRAMMAR', writing: 'WRITING' };
    return map[kind] || kind.toUpperCase();
}

function cardRoute(item) {
    if (item.kind === 'prose' || item.kind === 'poetry' || item.kind === 'vistas') {
        return `chapter/${item.kind}-${item.idx}`;
    }
    if (item.kind === 'grammar') return `grammar/${item.idx}`;
    if (item.kind === 'writing') return `writing/${item.idx}`;
    return 'home';
}

function renderHome() {
    const items = getAllItems();
    const cardsHtml = items.map((item, i) => {
        const color = cardColor(i);
        return `
      <div class="study-card color-${color}" onclick="navigate('${cardRoute(item)}')">
        <span class="card-badge badge-${color}">${badgeLabel(item.kind)}</span>
        <h3>${escHtml(item.title)}</h3>
        <p class="card-desc">Learn more about this topic — key points and summary.</p>
        <span class="card-action">Start Now ${ICONS.arrowRight}</span>
      </div>`;
    }).join('');

    const pillsHtml = categories.map(c =>
        `<span class="pill ${state.selectedCategory === c ? 'active' : ''}" onclick="setCategory('${c}')">${c}</span>`
    ).join('');

    $main().innerHTML = `
    <div class="home-header">
      <h2><span>Hello,</span><br>Learner 👋</h2>
    </div>
    <div class="search-bar">
      ${ICONS.search}
      <input id="search-input" type="text" placeholder="Search your chapters..." value="${escHtml(state.searchQuery)}" oninput="onSearch(this.value)">
    </div>
    <div class="category-pills">${pillsHtml}</div>
    ${items.length ? `<div class="cards-grid">${cardsHtml}</div>` : '<div class="empty-state">No results found.</div>'}
  `;
}

function setCategory(cat) {
    state.selectedCategory = cat;
    renderHome();
}

function onSearch(val) {
    state.searchQuery = val;
    renderHome();
    // Restore focus
    const inp = document.getElementById('search-input');
    if (inp) { inp.focus(); inp.setSelectionRange(val.length, val.length); }
}

// ── Chapter Detail ──────────────────────────────────────
function resolveChapter(param) {
    const [kind, idx] = param.split('-');
    const i = parseInt(idx);
    if (kind === 'prose') return state.flamingoProse[i];
    if (kind === 'poetry') return state.flamingoPoetry[i];
    if (kind === 'vistas') return state.vistasChapters[i];
    return null;
}

function renderChapterDetail(param) {
    const ch = resolveChapter(param);
    if (!ch) { renderHome(); return; }

    // Helper to format Markdown-like text
    const parseMD = (str) => {
        // First escape HTML to prevent XSS, but we want to allow our own bold tags later
        // So we escape first, then replace the markdown syntax
        let s = escHtml(str);
        // Replace **text** with <strong>text</strong>
        s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Replace *text* with <em>text</em>
        s = s.replace(/\*(.*?)\*/g, '<em>$1</em>');
        return s;
    };

    const renderKeyPointsGrid = (text) => {
        if (!text) return '';
        // Split by lines that look like bullet points
        const lines = text.split('\n').filter(l => l.trim().length > 0);
        return `<div class="key-points-grid">
            ${lines.map((line, i) => {
            const clean = line.trim().replace(/^[-*]\s*/, '');
            return `
                <div class="key-point-card">
                    <div class="key-point-number">${i + 1}</div>
                    <div class="key-point-text">${parseMD(clean)}</div>
                </div>`;
        }).join('')}
        </div>`;
    };

    const renderCharactersGrid = (text) => {
        if (!text) return '';
        const lines = text.split('\n').filter(l => l.trim().length > 0);
        return `<div class="characters-grid">
            ${lines.map(line => {
            let clean = line.trim().replace(/^[-*]\s*/, '');
            // Try to detect "Name: Description" format
            const colIdx = clean.indexOf(':');
            let name = '';
            let desc = clean;

            if (colIdx !== -1 && colIdx < 30) { // arbitrary length for name check
                name = clean.substring(0, colIdx).replace(/\*\*/g, '').trim();
                desc = clean.substring(colIdx + 1).trim();
            } else {
                // Maybe bolded name at start? "**Name** - desc"
                const boldMatch = clean.match(/^\*\*(.*?)\*\*/);
                if (boldMatch) {
                    name = boldMatch[1];
                    desc = clean.replace(/^\*\*(.*?)\*\*/, '').replace(/^[\s-:]+/, '').trim();
                }
            }

            if (name) {
                return `
                    <div class="character-card">
                        <div class="character-name">${name}</div>
                        <div style="font-size:15px;color:var(--text-secondary);line-height:1.6">${parseMD(desc)}</div>
                    </div>`;
            }
            // Fallback if no clear name
            return `
                <div class="character-card">
                    <div class="character-text">${parseMD(clean)}</div>
                </div>`;
        }).join('')}
        </div>`;
    };

    // Helper for questions
    const formatQA = (text) => {
        if (!text) return '';
        return `<div class="qa-grid">` + text.split('\n').map(line => {
            if (!line.trim()) return '';
            let clean = parseMD(line);
            if (line.match(/^\s*[-*]?\s*Q:|Question/i)) {
                return `<div class="qa-item-q">${ICONS.help || '?'} ${clean.replace(/^[-*]\s*/, '')}</div>`;
            }
            if (line.match(/^\s*[-*]?\s*A:|Answer/i)) {
                return `<div class="qa-item-a">${clean.replace(/^[-*]\s*/, '')}</div>`;
            }
            return `<div class="qa-item-text">${clean}</div>`;
        }).join('') + `</div>`;
    };

    const html = `
    <div class="detail-view">
      <div class="detail-back" onclick="navigate('home')">${ICONS.arrowLeft} Back to Home</div>
      
      <div class="detail-hero ${ch.type === 'poetry' ? 'hero-teal' : 'hero-purple'}">
        ${ICONS.openBook}
      </div>

      <div class="chapter-header">
        <h1 class="detail-title">${escHtml(ch.title)}</h1>
        <div class="detail-subtitle">${ICONS.book} ${ch.type.toUpperCase()}</div>
      </div>

      <div class="chapter-content-grid">
        <!-- Main Column (Summary, Key Points, Questions) -->
        <div class="chapter-main-col">
            
            <div class="content-section">
                <h3 class="detail-section-title"><span class="section-icon icon-purple">${ICONS.book}</span> Summary</h3>
                <div class="detail-content-box box-summary">${parseMD(ch.summary)}</div>
            </div>

            ${ch.keyPoints ? `
            <div class="content-section">
                <h3 class="detail-section-title"><span class="section-icon icon-amber">${ICONS.star}</span> Key Points</h3>
                ${renderKeyPointsGrid(ch.keyPoints)}
            </div>` : ''}

            ${ch.questions ? `
            <div class="content-section">
                <h3 class="detail-section-title"><span class="section-icon icon-rose">${ICONS.test}</span> Important Questions</h3>
                <div class="detail-content-box box-questions">${formatQA(ch.questions)}</div>
            </div>` : ''}
        </div>

        <!-- Sidebar Column (Quick Facts, Characters, Flashcards) -->
        <div class="chapter-side-col">
            
            <!-- Quick Info Card -->
            <div class="quick-facts-box">
                <div class="fact-item">${ICONS.pen} Author: ${escHtml(ch.author || 'Unknown')}</div>
                <div class="fact-item">${ICONS.star} Theme: ${escHtml(ch.theme || 'General')}</div>
                <div class="fact-item">${ICONS.timer} Read Time: 5 mins</div>
            </div>

            ${ch.characters ? `
            <div class="content-section">
                <h3 class="detail-section-title" style="font-size:16px"><span class="section-icon icon-teal">${ICONS.rocket}</span> Characters</h3>
                ${renderCharactersGrid(ch.characters)}
            </div>` : ''}

            <!-- Auto-generated Flashcards (from Key Points) -->
            <div class="flashcard">
                <div class="flashcard-title">💡 Did You Know?</div>
                <div class="flashcard-content">
                    This chapter is crucial for the board exam. Focus on the character sketch of the protagonist and the central theme.
                </div>
            </div>

            <div class="flashcard" style="border-top-color:var(--amber)">
                <div class="flashcard-title">⚡ Exam Tip</div>
                <div class="flashcard-content">
                    Use keywords from the 'Key Points' section in your answers to score full marks.
                </div>
            </div>

        </div>
      </div>

      <div style="text-align:center;margin-top:40px">
        <button class="tts-btn" id="tts-btn" onclick="toggleTTS(this)">
            ${ICONS.play} <span>Listen to Chapter</span>
        </button>
      </div>

    </div>`;

    $main().innerHTML = html;

    // TTS Content backup
    const ttsText = `${ch.title}. By ${ch.author}. Summary: ${ch.summary}`;
    document.getElementById('tts-btn').dataset.content = ttsText;
}

function toggleTTS(btn) {
    if (isSpeaking) {
        stopSpeaking();
        btn.innerHTML = `${ICONS.play} <span>Listen to Chapter</span>`;
    } else {
        speak(btn.dataset.content);
        btn.innerHTML = `${ICONS.stop} <span>Stop Listening</span>`;
    }
}

function renderGrammarDetail(param) {
    const idx = parseInt(param);
    const topic = state.grammarTopics[idx];
    if (!topic) { renderHome(); return; }

    const formatGrammar = (txt) => {
        return txt.split('\n').map(line => {
            const l = line.trim();
            if (!l) return '';
            if (l.includes('RULE') || l.includes('TYPE')) {
                return `<h4 style="margin:20px 0 10px;color:var(--purple);font-size:16px">${escHtml(l)}</h4>`;
            }
            if (l.startsWith('Q:') || l.startsWith('- Q:')) {
                return `<div style="font-weight:600;margin-top:8px">${escHtml(l)}</div>`;
            }
            if (l.startsWith('A:') || l.startsWith('- A:')) {
                return `<div style="color:var(--teal);margin-bottom:8px;font-weight:500">${escHtml(l)}</div>`;
            }
            if (l.includes('TRICK:')) {
                return `<div style="display:inline-block;padding:6px 12px;background:var(--amber);color:white;border-radius:6px;font-weight:700;font-size:12px;margin:5px 0">${escHtml(l)}</div>`;
            }
            return `<div style="margin-bottom:4px">${escHtml(l)}</div>`;
        }).join('');
    };

    $main().innerHTML = `
    <div class="detail-view">
      <div class="detail-back" onclick="navigate('home')">${ICONS.arrowLeft} Back to Home</div>
      <h1 class="detail-title">${escHtml(topic.title)}</h1>
      
      ${topic.definition ? `
      <div class="detail-content-box" style="background:var(--purple-50);border-color:var(--purple-200);color:var(--purple-deep)">
         <strong>Definition:</strong> ${escHtml(topic.definition)}
      </div>` : ''}

      <div class="detail-content-box">
        ${formatGrammar(topic.content)}
      </div>
    </div>`;
}

function renderWritingDetail(param) {
    const idx = parseInt(param);
    const item = state.writingFormats[idx];
    if (!item) { renderHome(); return; }

    const isVisualBox = item.title.toUpperCase().includes('NOTICE') ||
        item.title.toUpperCase().includes('INVITATION') ||
        item.title.toUpperCase().includes('ADVERTISEMENT');

    let bodyHtml = item.content.split('\n').map(l => {
        if (l.includes('-----') || l.includes('|_') || l.includes('_|')) return '';
        if (l.includes('|')) {
            // Center text that was in the text-box art
            return `<div style="text-align:center;padding:2px 0">${escHtml(l.replace(/\|/g, '').trim())}</div>`;
        }
        return `<div>${escHtml(l)}</div>`;
    }).join('');

    // If it's a box format, wrap it in a styled div
    if (isVisualBox) {
        bodyHtml = `
        <div style="border:2px solid var(--text);background:#fff;padding:24px;max-width:500px;margin:20px auto;box-shadow:5px 5px 0 rgba(0,0,0,0.1)">
           ${bodyHtml}
        </div>`;
    } else {
        bodyHtml = `<div class="detail-content-box">${bodyHtml}</div>`;
    }

    $main().innerHTML = `
    <div class="detail-view">
      <div class="detail-back" onclick="navigate('home')">${ICONS.arrowLeft} Back to Home</div>
      <h1 class="detail-title">${escHtml(item.title)}</h1>
      <div class="chapter-meta-tag tag-type">${escHtml(item.category)}</div>
      
      <h3 class="detail-section-title" style="margin-top:30px">${ICONS.pen} Format & Guide</h3>
      ${bodyHtml}
    </div>`;
}

// ── Mock Test ───────────────────────────────────────────
function generateMockTest() {
    const bp = state.examBlueprint;
    if (!bp || !bp.blue_print) return;

    const sections = [];

    for (const section of bp.blue_print) {
        const questions = [];
        const name = section.name;

        if (name === 'Reading Skills') {
            questions.push('Unseen Passage 1 (9 Marks): Read the provided passage and answer the questions.');
            questions.push('Unseen Passage 2 (6 Marks): Read the provided passage and answer the questions.');
        } else if (name === 'Writing Skills') {
            for (const opt of section.breakdown) {
                if (opt.type === 'Short Composition') {
                    const chosen = opt.options[Math.floor(Math.random() * opt.options.length)];
                    const fmt = state.writingFormats.find(f => f.title.toLowerCase().includes(chosen.toLowerCase()));
                    questions.push(`Short Composition (4 Marks): ${fmt ? fmt.template.substring(0, 200) + '...' : `Write a ${chosen} based on the syllabus.`}`);
                } else if (opt.type === 'Report/Paragraph') {
                    questions.push('Report/Paragraph (5 Marks): Write a report or factual description in 100 words based on current events or school activities.');
                } else if (opt.type === 'Letter') {
                    const chosen = opt.options[Math.floor(Math.random() * opt.options.length)];
                    const fmt = state.writingFormats.find(f => f.title.toLowerCase().includes(chosen.toLowerCase()));
                    questions.push(`Letter Writing (6 Marks): ${fmt ? fmt.template.substring(0, 200) + '...' : `Write a ${chosen} (100-120 words).`}`);
                }
            }
        } else if (name === 'Grammar') {
            for (const topic of section.topics) {
                const gt = state.grammarTopics.find(t => t.title.toLowerCase().includes(topic.topic.toLowerCase()));
                if (gt && gt.examples.length > 0) {
                    const ex = gt.examples[Math.floor(Math.random() * gt.examples.length)];
                    questions.push(`${topic.topic} (2 Marks): Fill in the blanks or combine: ${ex}`);
                } else {
                    questions.push(`${topic.topic} (2 Marks): Attempt questions based on RBSE rules for ${topic.topic}.`);
                }
            }
        } else if (name === 'Textbooks') {
            for (const b of section.breakdown) {
                if (b.book === 'Flamingo Prose' && state.flamingoProse.length) {
                    const ch = state.flamingoProse[Math.floor(Math.random() * state.flamingoProse.length)];
                    questions.push(`Flamingo Prose: Reference to context from '${ch.title}'.`);
                    questions.push('Flamingo Prose: Long answer question from the textbook.');
                } else if (b.book === 'Flamingo Poetry' && state.flamingoPoetry.length) {
                    const ch = state.flamingoPoetry[Math.floor(Math.random() * state.flamingoPoetry.length)];
                    questions.push(`Flamingo Poetry: Explanation with reference to context from '${ch.title}'.`);
                } else if (b.book === 'Vistas' && state.vistasChapters.length) {
                    const ch = state.vistasChapters[Math.floor(Math.random() * state.vistasChapters.length)];
                    questions.push(`Vistas: Short answer question and MCQs from '${ch.title}'.`);
                }
            }
        }

        sections.push({
            section: section.section,
            name,
            marks: section.marks,
            questions,
        });
    }

    state.generatedTest = {
        year: bp.exam_config.year,
        total_marks: bp.exam_config.total_marks,
        time: bp.exam_config.time_minutes,
        sections,
    };

    renderMockTest();
}

function renderMockTest() {
    if (!state.generatedTest) {
        $main().innerHTML = `
      <div class="detail-view">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
          <h2 style="font-size:24px;font-weight:700">Mock Test Generator</h2>
        </div>
        <div class="mock-empty">
          ${ICONS.test}
          <p>No test generated yet.</p>
          <button class="btn-primary" style="max-width:260px;height:52px" onclick="generateMockTest()">Generate Mock Test</button>
        </div>
      </div>
    `;
        return;
    }

    const test = state.generatedTest;
    const sectionsHtml = test.sections.map(s => `
    <div class="mock-section">
      <div class="mock-section-header">
        <h4>SECTION ${escHtml(s.section)}: ${escHtml(s.name)}</h4>
        <span class="marks">[${s.marks} Marks]</span>
      </div>
      <div class="mock-questions">
        ${s.questions.map((q, i) => `<div class="mock-q"><span class="q-num">Q${i + 1}.</span><span>${escHtml(q)}</span></div>`).join('')}
      </div>
    </div>
  `).join('');

    $main().innerHTML = `
    <div class="detail-view">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
        <h2 style="font-size:24px;font-weight:700">Mock Test Generator</h2>
        <button class="tts-btn" style="padding:10px 20px;font-size:13px" onclick="generateMockTest()">
          ${ICONS.refresh} <span>Regenerate</span>
        </button>
      </div>
      <div class="mock-meta">
        <h3>RBSE CLASS 12 ENGLISH COMPULSORY</h3>
        <div class="year">BOARD EXAMINATION — ${escHtml(test.year)}</div>
        <div class="mock-meta-row">
          <div class="mock-meta-item">${ICONS.timer} ${test.time} Mins</div>
          <div class="mock-meta-item">${ICONS.star} ${test.total_marks} Marks</div>
        </div>
      </div>
      ${sectionsHtml}
      <div class="mock-footer">*** ALL THE BEST ***</div>
    </div>
  `;
}

// ── AI Tutor ────────────────────────────────────────────
// ── AI Tutor (Refactored) ──────────────────────────────
function renderAiTutor() {
    const messagesHtml = state.chatMessages.map(m =>
        `<div class="ai-msg ${m.role}">
            ${parseMD(m.content)}
         </div>`
    ).join('');

    $main().innerHTML = `
    <!-- API Key Modal -->
    <div id="ai-key-modal" class="api-modal-overlay">
        <div class="api-modal-card">
            <h3 class="api-modal-title">Enter API Key</h3>
            <p class="api-modal-desc">
                ${state.aiProvider === 'ollama' ? 'Enter the Public URL of your Cloud Ollama Instance (e.g. NGrok URL).'
            : state.aiProvider === 'ollama_cloud' ? 'Enter your Ollama.com API Key.'
                : 'Enter your API Key below. We save it locally.'}
            </p>
            
            <div class="api-input-group">
                <label class="api-label">
                    ${state.aiProvider === 'ollama' ? 'Ollama Instance URL'
            : state.aiProvider === 'ollama_cloud' ? 'Ollama API Key'
                : 'API Key'}
                </label>
                <input type="${state.aiProvider === 'ollama' ? 'text' : 'password'}" id="input-api-key" class="api-key-input" 
                       placeholder="${state.aiProvider === 'ollama' ? 'https://...' : (state.aiProvider === 'ollama_cloud' ? 'k_...' : 'gsk_...')}" 
                       value="${state.aiProvider === 'ollama' ? (localStorage.getItem('OLLAMA_URL') || '') : (state.aiProvider === 'ollama_cloud' ? (localStorage.getItem('OLLAMA_CLOUD_KEY') || '') : (localStorage.getItem('GROQ_KEY') || ''))}">
            </div>

            <div class="api-actions">
                <button class="btn-text" onclick="toggleApiKeyModal()">Cancel</button>
                <button class="btn-save" onclick="saveApiKey()">Save</button>
            </div>
        </div>
    </div>

    <!-- AI Page Wrapper -->
    <div class="ai-page-wrapper">
      
      <!-- Glass Chat Window -->
      <div class="ai-chat-card">
        
        <!-- Header -->
        <div class="ai-header-bar">
          <div class="ai-branding">
            <div class="ai-avatar-circle">
                ${ICONS.ai || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>'}
            </div>
            <div class="ai-title-text">
                <h2>Nexus AI Tutor</h2>
                <span>Online • ${state.aiProvider === 'groq' ? 'Groq Llama-3' : state.aiProvider.startsWith('ollama') ? 'Ollama ' + (state.aiProvider.includes('cloud') ? 'Cloud' : 'Local') : 'Gemini 1.5'}</span>
            </div>
          </div>

          <div class="ai-controls">
            <select class="ai-model-select" onchange="state.aiProvider=this.value; renderAiTutor()">
              <option value="groq" ${state.aiProvider === 'groq' ? 'selected' : ''}>Groq Llama-3</option>
              <option value="gemini" ${state.aiProvider === 'gemini' ? 'selected' : ''}>Gemini Flash</option>
              <option value="ollama" ${state.aiProvider === 'ollama' ? 'selected' : ''}>Ollama (Local)</option>
              <option value="ollama_cloud" ${state.aiProvider === 'ollama_cloud' ? 'selected' : ''}>Ollama (Cloud API)</option>
            </select>
            
            <button class="btn-icon-soft" onclick="toggleApiKeyModal()" title="Set API Key">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
            </button>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="ai-messages-area" id="ai-messages">
          ${messagesHtml || `
            <div class="empty-state" style="flex:1">
                <div style="font-size:48px;margin-bottom:16px">👋</div>
                <h3 style="font-size:20px;font-weight:700;margin-bottom:8px">Hello there!</h3>
                <p style="max-width:300px;margin:0 auto">I'm your personal AI tutor. Ask me anything about your English syllabus, grammar, or writing skills.</p>
            </div>
          `}
          <div id="ai-typing" style="display:none; padding: 10px 20px; font-size:13px; color:var(--text-muted); font-style:italic">
             AI is typing...
          </div>
        </div>

        <!-- Input Zone -->
        <div class="ai-input-zone">
          <input id="ai-input" class="ai-input-field" type="text" placeholder="Ask a question..." onkeydown="if(event.key==='Enter')sendAiMessage()">
          <button class="ai-send-btn-lg" onclick="sendAiMessage()">
            ${ICONS.send}
          </button>
        </div>

      </div>
    </div>`;

    scrollChat();
}

// Modal Toggle
function toggleApiKeyModal() {
    const modal = document.getElementById('ai-key-modal');
    modal.classList.toggle('active');
}

// Save Key or URL
function saveApiKey() {
    const val = document.getElementById('input-api-key').value.trim();
    if (val) {
        if (state.aiProvider === 'ollama') {
            localStorage.setItem('OLLAMA_URL', val);
            alert('Ollama Instance URL Saved!');
        } else if (state.aiProvider === 'ollama_cloud') {
            localStorage.setItem('OLLAMA_CLOUD_KEY', val);
            alert('Ollama API Key Saved!');
        } else {
            localStorage.setItem('GROQ_KEY', val);
            alert('API Key Saved!');
        }
        toggleApiKeyModal();
    } else {
        alert('Please enter a valid value.');
    }
}

function scrollChat() {
    const el = document.getElementById('ai-messages');
    if (el) el.scrollTop = el.scrollHeight;
}

async function sendAiMessage() {
    const input = document.getElementById('ai-input');
    if (!input || !input.value.trim()) return;

    const userText = input.value.trim();
    state.chatMessages.push({ role: 'user', content: userText });
    input.value = '';

    // Re-render to show user message
    const msgsEl = document.getElementById('ai-messages');
    const emptyEl = msgsEl.querySelector('.empty-state');
    if (emptyEl) emptyEl.remove();
    msgsEl.insertAdjacentHTML('beforeend', `<div class="ai-msg user">${escHtml(userText)}</div>`);
    const typingEl = document.getElementById('ai-typing');
    typingEl.style.display = 'flex';
    scrollChat();

    try {
        const response = await callAiApi(userText);
        state.chatMessages.push({ role: 'ai', content: response });
        msgsEl.insertAdjacentHTML('beforeend', `<div class="ai-msg ai">${escHtml(response)}</div>`);
    } catch (err) {
        const errMsg = 'Sorry, I encountered an error. Please check your internet connection or API key.';
        state.chatMessages.push({ role: 'ai', content: errMsg });
        msgsEl.insertAdjacentHTML('beforeend', `<div class="ai-msg ai">${escHtml(errMsg)}</div>`);
    }

    typingEl.style.display = 'none';
    scrollChat();
}

async function callAiApi(userMessage) {
    const flamingoContent = state.flamingoProse.map(c => c.content).join('\n\n');
    const poetryContent = state.flamingoPoetry.map(c => c.content).join('\n\n');
    const vistasContent = state.vistasChapters.map(c => c.content).join('\n\n');

    const systemPrompt = `You are an RBSE (Rajasthan Board) Class 12 English Expert. 
Use the following official textbook content to answer questions. 
If the information is not in the textbooks, tell the user politely that it's outside the syllabus.

--- TEXTBOOK CONTENT START ---
FLAMINGO PROSE:
${flamingoContent}

FLAMINGO POETRY:
${poetryContent}

VISTAS SUPPLEMENTARY:
${vistasContent}
--- TEXTBOOK CONTENT END ---

Be concise, encouraging, and helpful. Always refer to specific characters or chapters when possible.`;

    const provider = state.aiProvider;
    const config = state.config;

    if (provider === 'gemini') {
        const apiKey = config.gemini_api_key || config.api_key || '';
        if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') return 'Error: Gemini API Key missing in config.json';
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: `System: ${systemPrompt}\nUser: ${userMessage}` }] }] }),
        });
        if (!res.ok) return `Gemini Error: ${res.status}`;
        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
    }

    if (provider === 'groq') {
        const apiKey = config.groq_api_key || '';
        if (!apiKey || apiKey === 'YOUR_GROQ_API_KEY_HERE') return 'Error: Groq API Key missing in config.json';
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }] }),
        });
        if (!res.ok) return `Groq Error: ${res.status}`;
        const data = await res.json();
        return data.choices?.[0]?.message?.content || 'No response.';
    }

    if (provider === 'ollama_cloud') {
        const apiKey = localStorage.getItem('OLLAMA_CLOUD_KEY');
        if (!apiKey) return 'Error: Please set your Ollama Cloud API Key.';

        // Use a CORS proxy to bypass browser restrictions
        const proxyUrl = 'https://corsproxy.io/?';
        const targetUrl = 'https://ollama.com/api/chat';

        try {
            const res = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-oss:120b', // Default cloud model
                    messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
                    stream: false
                }),
            });

            if (!res.ok) throw new Error(`Status ${res.status}`);

            const data = await res.json();
            return data.message?.content || 'No response from Ollama Cloud.';
        } catch (e) {
            console.error(e);
            return `Ollama Cloud Error: ${e.message}. (This is likely a CORS issue. If usage is heavy, consider a local proxy).`;
        }
    }

    if (provider === 'ollama') {
        // Use custom cloud URL if set, otherwise default local
        const savedUrl = localStorage.getItem('OLLAMA_URL');
        let baseUrl = savedUrl ? savedUrl : 'http://localhost:11434';

        // Ensure not trailing slash
        baseUrl = baseUrl.replace(/\/$/, '');
        const url = `${baseUrl}/api/generate`;

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama3',
                    prompt: `System: ${systemPrompt}\nUser: ${userMessage}`,
                    stream: false
                }),
            });

            if (!res.ok) throw new Error(`Status ${res.status}`);

            const data = await res.json();
            return data.response || 'No response from Ollama.';
        } catch (e) {
            console.error(e);
            return `Ollama Error: Could not connect to ${url}. ${e.message}. If using cloud, check CORS/SSL.`;
        }
    }

    return 'Unknown provider.';
}

// ── Helpers ─────────────────────────────────────────────
function escHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function escJs(str) {
    return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

// ── Init ────────────────────────────────────────────────
window.addEventListener('hashchange', render);

document.addEventListener('DOMContentLoaded', async () => {
    await loadAllData();

    // Intro overlay
    const introBtn = document.getElementById('intro-btn');
    if (introBtn) {
        introBtn.addEventListener('click', () => {
            document.getElementById('intro-overlay').classList.add('hidden');
        });
    }

    render();
});
