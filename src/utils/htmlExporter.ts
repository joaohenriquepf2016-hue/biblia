import { Sermon } from '../types';
import { OFFLINE_VERSES } from '../data/bibleVerses';
import { BIBLE_BOOKS } from '../data/bibleBooks';

/**
 * Generates a completely standalone, self-contained single-file HTML document
 * containing the full preaching app, offline database, color-changing verse tracker,
 * sermon editor, pulpit mode, timer, and LocalStorage persistence.
 */
export function generateStandaloneHtml(currentSermons: Sermon[]): string {
  const serializedSermons = JSON.stringify(currentSermons).replace(/</g, '\\u003c');
  const serializedOfflineVerses = JSON.stringify(OFFLINE_VERSES).replace(/</g, '\\u003c');
  const serializedBooks = JSON.stringify(BIBLE_BOOKS).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html lang="pt-BR" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Púlpito - Auxiliar de Pregação & Bíblia Sagrada</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Plus Jakarta Sans', 'sans-serif'],
            serif: ['Merriweather', 'serif'],
            display: ['Cinzel', 'serif']
          }
        }
      }
    }
  </script>
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-serif { font-family: 'Merriweather', serif; }
    .font-display { font-family: 'Cinzel', serif; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(168, 162, 158, 0.4); border-radius: 9999px; }
    @media print {
      .no-print { display: none !important; }
      body { background: white !important; color: black !important; }
    }
  </style>
</head>
<body class="bg-stone-950 text-stone-100 min-h-screen flex flex-col antialiased selection:bg-amber-500 selection:text-stone-950">

  <!-- Header / Navbar -->
  <header class="sticky top-0 z-40 bg-stone-900 border-b border-stone-800 shadow-md no-print">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
      
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 font-serif font-black text-xl flex items-center justify-center shadow-sm">
          ✞
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="font-serif font-bold text-lg text-white">PÚLPITO</h1>
            <span class="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ● Arquivo Único Offline
            </span>
          </div>
          <p class="text-xs text-stone-400">Auxiliar de Pregação & Bíblia</p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <nav class="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs sm:text-sm font-medium">
        <button id="btn-tab-preach" onclick="switchTab('preach')" class="px-3.5 py-1.5 rounded-lg bg-amber-500 text-stone-950 font-bold transition-all">
          🔥 Modo Púlpito
        </button>
        <button id="btn-tab-editor" onclick="switchTab('editor')" class="px-3.5 py-1.5 rounded-lg text-stone-300 hover:text-white transition-all">
          📝 Esboço
        </button>
        <button id="btn-tab-bible" onclick="switchTab('bible')" class="px-3.5 py-1.5 rounded-lg text-stone-300 hover:text-white transition-all">
          📖 Bíblia Sagrada
        </button>
      </nav>

      <!-- Timer & Actions -->
      <div class="flex items-center gap-2">
        <div id="timer-box" class="flex items-center gap-2 px-3 py-1.5 bg-stone-950 border border-stone-800 rounded-xl">
          <span id="timer-display" class="font-mono text-sm font-bold text-amber-400">00:00</span>
          <button id="timer-toggle-btn" onclick="toggleTimer()" class="text-xs px-2 py-0.5 rounded bg-stone-800 text-stone-300 hover:text-white font-bold">
            Iniciar
          </button>
          <button onclick="resetTimer()" class="text-xs text-stone-500 hover:text-stone-300">
            ↺
          </button>
        </div>
        <button onclick="window.print()" class="p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-xl transition-colors" title="Imprimir Esboço">
          🖨️
        </button>
      </div>

    </div>
  </header>

  <!-- App Content Container -->
  <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
    
    <!-- Tab 1: Modo Púlpito -->
    <section id="view-preach" class="space-y-6">
      <div id="preach-sermon-header" class="bg-stone-900 p-5 rounded-2xl border border-stone-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="pulpit-title" class="font-serif text-2xl sm:text-3xl font-bold text-white mb-1">...</h2>
          <div class="flex items-center gap-3 text-xs text-stone-400">
            <span id="pulpit-theme" class="text-amber-400 font-semibold">...</span>
            <span>•</span>
            <span id="pulpit-meta">...</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-stone-400">Tema do Púlpito:</span>
          <button onclick="setPulpitTheme('dark')" class="px-2.5 py-1 text-xs rounded-lg bg-stone-800 text-white font-medium border border-stone-700">Noturno</button>
          <button onclick="setPulpitTheme('sepia')" class="px-2.5 py-1 text-xs rounded-lg bg-[#f4ede0] text-[#2c2416] font-medium">Sépia</button>
          <button onclick="setPulpitTheme('light')" class="px-2.5 py-1 text-xs rounded-lg bg-white text-stone-900 font-medium">Claro</button>
        </div>
      </div>

      <!-- Scripture Timeline / Flow Bar -->
      <div class="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-2">
        <div class="flex items-center justify-between text-xs text-stone-400">
          <span class="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            📖 Roteiro de Versículos na Ministração
          </span>
          <span id="scriptures-progress-label">0 lidos</span>
        </div>
        <div id="scripture-badges-bar" class="flex items-center gap-2 overflow-x-auto pb-1">
          <!-- Badges injected dynamically -->
        </div>
      </div>

      <!-- Pulpit 2-Column Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Sections / Outline (Left Column) -->
        <div id="pulpit-sections-container" class="lg:col-span-7 space-y-5">
          <!-- Sermon sections injected dynamically -->
        </div>

        <!-- Bible Reader (Right Column) -->
        <div class="lg:col-span-5">
          <div id="pulpit-reader-card" class="sticky top-24 bg-stone-900 p-6 rounded-2xl border border-stone-800 flex flex-col max-h-[80vh]">
            <div class="flex items-center justify-between pb-3 mb-3 border-b border-stone-800">
              <div>
                <h4 id="reader-title" class="font-serif font-bold text-xl text-amber-400">Selecione um Versículo</h4>
                <p id="reader-subtitle" class="text-xs text-stone-400">Texto bíblico offline</p>
              </div>
              <span id="reader-status-badge" class="text-[11px] px-2 py-0.5 rounded font-bold bg-stone-800 text-stone-300">
                Pendente
              </span>
            </div>

            <div id="reader-content" class="flex-1 overflow-y-auto font-serif text-lg leading-relaxed space-y-4 pr-1">
              <p class="text-stone-500 italic text-sm py-8 text-center">
                Clique em qualquer marcador de versículo no esboço ou na barra superior para carregar a leitura bíblica.
              </p>
            </div>

            <div class="pt-4 mt-3 border-t border-stone-800 flex items-center justify-between">
              <button onclick="toggleActiveCompleted()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5">
                ✓ Concluir Leitura deste Versículo
              </button>
              <button onclick="advanceNextScripture()" class="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl">
                Próximo Versículo →
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Tab 2: Esboço Editor -->
    <section id="view-editor" class="hidden space-y-6">
      <div class="bg-stone-900 p-6 rounded-2xl border border-stone-800 space-y-4">
        <div class="flex items-center justify-between border-b border-stone-800 pb-3">
          <h2 class="font-serif text-xl font-bold text-white">Editar Esboço da Mensagem</h2>
          <button onclick="saveSermonFromInputs()" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm rounded-xl">
            Salvar Alterações
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-stone-400 mb-1">Título da Mensagem</label>
            <input id="edit-title" type="text" class="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white font-serif">
          </div>
          <div>
            <label class="block text-xs font-semibold text-stone-400 mb-1">Tema / Assunto</label>
            <input id="edit-theme" type="text" class="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white">
          </div>
          <div>
            <label class="block text-xs font-semibold text-stone-400 mb-1">Texto Base Principal</label>
            <input id="edit-main-scripture" type="text" class="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white">
          </div>
          <div>
            <label class="block text-xs font-semibold text-stone-400 mb-1">Tempo Alvo (Minutos)</label>
            <input id="edit-duration" type="number" class="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white">
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-400 mb-1">Anotações / Lembretes Pastorais</label>
          <textarea id="edit-notes" rows="2" class="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white text-sm"></textarea>
        </div>

        <!-- Sections in Editor -->
        <div class="pt-4 border-t border-stone-800 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-serif font-bold text-lg text-white">Tópicos e Pontos da Mensagem</h3>
            <button onclick="addNewSection()" class="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-bold rounded-xl border border-stone-700">
              + Adicionar Novo Tópico
            </button>
          </div>
          <div id="editor-sections-list" class="space-y-4">
            <!-- Sections list injected dynamically -->
          </div>
        </div>

      </div>
    </section>

    <!-- Tab 3: Bíblia Sagrada Completa -->
    <section id="view-bible" class="hidden space-y-6">
      <div class="bg-stone-900 p-6 rounded-2xl border border-stone-800 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <h2 class="font-serif text-2xl font-bold text-white">Bíblia Sagrada (Offline)</h2>
            <p class="text-xs text-stone-400">Tradução João Ferreira de Almeida</p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <select id="bible-book-select" onchange="onSelectBibleBook()" class="p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white font-medium text-sm">
              <!-- Books options injected dynamically -->
            </select>
            <select id="bible-chapter-select" onchange="onSelectBibleChapter()" class="p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white font-medium text-sm">
              <!-- Chapters options injected dynamically -->
            </select>
          </div>
        </div>

        <div id="bible-chapter-content" class="font-serif text-lg leading-relaxed space-y-3 p-4 bg-stone-950 rounded-xl border border-stone-800 min-h-[300px]">
          <!-- Bible verses injected dynamically -->
        </div>
      </div>
    </section>

  </main>

  <script>
    // Embedded Data & State
    const BIBLE_BOOKS = ${serializedBooks};
    const OFFLINE_VERSES = ${serializedOfflineVerses};
    let sermons = ${serializedSermons};
    let activeSermonId = sermons[0] ? sermons[0].id : null;
    let currentScriptureId = null;

    // Load LocalStorage overrides if present
    try {
      const saved = localStorage.getItem('pulpito_sermons_v1');
      if (saved) {
        sermons = JSON.parse(saved);
        if (sermons.length > 0) activeSermonId = sermons[0].id;
      }
    } catch(e) {}

    function getActiveSermon() {
      return sermons.find(s => s.id === activeSermonId) || sermons[0];
    }

    function saveState() {
      try {
        localStorage.setItem('pulpito_sermons_v1', JSON.stringify(sermons));
      } catch(e) {}
    }

    function getVerseText(bookId, chapter, verse) {
      const b = (bookId || '').toLowerCase();
      // Look up in built-in dataset
      if (OFFLINE_VERSES[b] && OFFLINE_VERSES[b][chapter] && OFFLINE_VERSES[b][chapter][verse]) {
        return OFFLINE_VERSES[b][chapter][verse];
      }
      return null;
    }

    // Tabs Switcher
    function switchTab(tab) {
      document.getElementById('view-preach').classList.toggle('hidden', tab !== 'preach');
      document.getElementById('view-editor').classList.toggle('hidden', tab !== 'editor');
      document.getElementById('view-bible').classList.toggle('hidden', tab !== 'bible');

      const tabs = ['preach', 'editor', 'bible'];
      tabs.forEach(t => {
        const btn = document.getElementById('btn-tab-' + t);
        if (t === tab) {
          btn.className = 'px-3.5 py-1.5 rounded-lg bg-amber-500 text-stone-950 font-bold transition-all';
        } else {
          btn.className = 'px-3.5 py-1.5 rounded-lg text-stone-300 hover:text-white transition-all';
        }
      });

      if (tab === 'preach') renderPulpitMode();
      if (tab === 'editor') renderEditorMode();
      if (tab === 'bible') renderBibleMode();
    }

    // Timer Logic
    let timerSeconds = 0;
    let timerInterval = null;
    function toggleTimer() {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        document.getElementById('timer-toggle-btn').innerText = 'Iniciar';
      } else {
        timerInterval = setInterval(() => {
          timerSeconds++;
          const mins = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
          const secs = String(timerSeconds % 60).padStart(2, '0');
          document.getElementById('timer-display').innerText = mins + ':' + secs;
        }, 1000);
        document.getElementById('timer-toggle-btn').innerText = 'Pausar';
      }
    }

    function resetTimer() {
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = null;
      timerSeconds = 0;
      document.getElementById('timer-display').innerText = '00:00';
      document.getElementById('timer-toggle-btn').innerText = 'Iniciar';
    }

    // Render Pulpit Mode
    function renderPulpitMode() {
      const s = getActiveSermon();
      if (!s) return;

      document.getElementById('pulpit-title').innerText = s.title;
      document.getElementById('pulpit-theme').innerText = s.theme || 'Mensagem Bíblica';
      document.getElementById('pulpit-meta').innerText = (s.mainScripture ? s.mainScripture + ' • ' : '') + s.targetDurationMinutes + ' min';

      // Flatten scriptures
      const allSc = [];
      s.sections.forEach(sec => {
        sec.scriptures.forEach(sc => allSc.push(sc));
      });

      const completed = allSc.filter(sc => sc.status === 'completed').length;
      document.getElementById('scriptures-progress-label').innerText = completed + ' de ' + allSc.length + ' passagens ministradas';

      // Render Badges Flow
      const badgesContainer = document.getElementById('scripture-badges-bar');
      badgesContainer.innerHTML = '';
      if (allSc.length === 0) {
        badgesContainer.innerHTML = '<span class="text-xs text-stone-500 italic">Nenhum versículo registrado ainda.</span>';
      } else {
        allSc.forEach((sc, idx) => {
          const btn = document.createElement('button');
          let cls = 'shrink-0 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ';
          let label = sc.rawText || (sc.book + ' ' + sc.chapter + ':' + sc.verseStart);
          
          if (sc.id === currentScriptureId || sc.status === 'active') {
            cls += 'border-amber-400 bg-amber-500 text-stone-950 ring-2 ring-amber-400 scale-105';
            label = '📖 ' + label + ' (EM USO)';
          } else if (sc.status === 'completed') {
            cls += 'border-emerald-500 bg-emerald-950 text-emerald-300';
            label = '✓ ' + label;
          } else {
            cls += 'border-stone-700 bg-stone-800 text-stone-300 hover:border-stone-500';
          }
          btn.className = cls;
          btn.innerText = label;
          btn.onclick = () => selectScripture(sc);
          badgesContainer.appendChild(btn);
        });
      }

      // Render Sections Outline
      const secContainer = document.getElementById('pulpit-sections-container');
      secContainer.innerHTML = '';
      s.sections.forEach((sec, idx) => {
        const div = document.createElement('div');
        div.className = 'p-6 rounded-2xl border border-stone-800 bg-stone-900 space-y-4';
        
        let scBadgesHtml = '';
        if (sec.scriptures.length > 0) {
          scBadgesHtml = '<div class="pt-3 border-t border-stone-800 flex flex-wrap items-center gap-2"><span class="text-xs text-stone-400 font-bold uppercase">Passagens:</span>';
          sec.scriptures.forEach(sc => {
            let scCls = 'text-xs px-2.5 py-1 rounded-lg border font-bold ';
            if (sc.id === currentScriptureId || sc.status === 'active') {
              scCls += 'bg-amber-500 text-stone-950 border-amber-400';
            } else if (sc.status === 'completed') {
              scCls += 'bg-emerald-950 text-emerald-300 border-emerald-500';
            } else {
              scCls += 'bg-stone-800 text-stone-300 border-stone-700';
            }
            scBadgesHtml += '<button onclick="selectScriptureById(\\'' + sc.id + '\\')" class="' + scCls + '">' + (sc.status === 'completed' ? '✓ ' : '') + (sc.rawText || (sc.book + ' ' + sc.chapter + ':' + sc.verseStart)) + '</button>';
          });
          scBadgesHtml += '</div>';
        }

        div.innerHTML = '<div class="flex items-center justify-between pb-2 border-b border-stone-800"><h3 class="font-serif font-bold text-xl text-white flex items-center gap-2"><span class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-black">' + (idx + 1) + '</span> ' + sec.title + '</h3>' + (sec.estimatedMinutes ? '<span class="text-xs text-stone-500 bg-stone-950 px-2 py-1 rounded-lg">~' + sec.estimatedMinutes + ' min</span>' : '') + '</div><div class="font-serif text-stone-200 text-base leading-relaxed whitespace-pre-wrap">' + (sec.content || '') + '</div>' + scBadgesHtml;
        secContainer.appendChild(div);
      });
    }

    function selectScriptureById(id) {
      const s = getActiveSermon();
      let found = null;
      s.sections.forEach(sec => {
        sec.scriptures.forEach(sc => {
          if (sc.id === id) found = sc;
        });
      });
      if (found) selectScripture(found);
    }

    function selectScripture(sc) {
      currentScriptureId = sc.id;
      const s = getActiveSermon();
      s.sections.forEach(sec => {
        sec.scriptures.forEach(item => {
          if (item.id === sc.id) item.status = 'active';
          else if (item.status === 'active') item.status = 'completed';
        });
      });
      saveState();
      renderPulpitMode();

      // Render Reader Content
      const title = sc.rawText || (sc.book + ' ' + sc.chapter + ':' + sc.verseStart + (sc.verseEnd ? '-' + sc.verseEnd : ''));
      document.getElementById('reader-title').innerText = title;
      document.getElementById('reader-subtitle').innerText = sc.note ? 'Nota: ' + sc.note : 'Texto bíblico completo offline';
      document.getElementById('reader-status-badge').innerText = sc.status === 'active' ? 'EM LEITURA' : sc.status;

      const readerBox = document.getElementById('reader-content');
      readerBox.innerHTML = '';

      const end = sc.verseEnd || sc.verseStart;
      const bookObj = BIBLE_BOOKS.find(b => b.name.toLowerCase() === sc.book.toLowerCase() || b.id === (sc.bookAbbrev || '').toLowerCase());
      const bookId = bookObj ? bookObj.id : sc.book.toLowerCase();

      for (let v = sc.verseStart; v <= end; v++) {
        const text = getVerseText(bookId, sc.chapter, v);
        const p = document.createElement('p');
        p.className = 'relative pl-6';
        p.innerHTML = '<span class="absolute left-0 top-0.5 text-xs font-sans font-black text-amber-400 select-none">' + v + '</span><span>' + (text || 'Texto do versículo registrado para leitura e reflexão.') + '</span>';
        readerBox.appendChild(p);
      }
    }

    function toggleActiveCompleted() {
      if (!currentScriptureId) return;
      const s = getActiveSermon();
      s.sections.forEach(sec => {
        sec.scriptures.forEach(sc => {
          if (sc.id === currentScriptureId) sc.status = 'completed';
        });
      });
      saveState();
      renderPulpitMode();
    }

    function advanceNextScripture() {
      const s = getActiveSermon();
      const allSc = [];
      s.sections.forEach(sec => sec.scriptures.forEach(sc => allSc.push(sc)));
      const currIdx = allSc.findIndex(sc => sc.id === currentScriptureId);
      if (currIdx >= 0 && currIdx < allSc.length - 1) {
        selectScripture(allSc[currIdx + 1]);
      }
    }

    // Editor Render & Save
    function renderEditorMode() {
      const s = getActiveSermon();
      if (!s) return;
      document.getElementById('edit-title').value = s.title || '';
      document.getElementById('edit-theme').value = s.theme || '';
      document.getElementById('edit-main-scripture').value = s.mainScripture || '';
      document.getElementById('edit-duration').value = s.targetDurationMinutes || 30;
      document.getElementById('edit-notes').value = s.notes || '';

      const list = document.getElementById('editor-sections-list');
      list.innerHTML = '';
      s.sections.forEach((sec, idx) => {
        const card = document.createElement('div');
        card.className = 'p-4 rounded-xl border border-stone-800 bg-stone-950 space-y-3';
        card.innerHTML = '<div class="flex items-center justify-between"><input type="text" value="' + sec.title + '" onchange="updateSecTitle(' + idx + ', this.value)" class="font-serif font-bold text-lg bg-transparent text-white border-b border-stone-700 w-3/4"><button onclick="deleteSection(' + idx + ')" class="text-xs text-red-400 hover:text-red-300">Excluir</button></div><textarea rows="3" onchange="updateSecContent(' + idx + ', this.value)" class="w-full p-2 bg-stone-900 border border-stone-800 rounded-lg text-sm text-white">' + (sec.content || '') + '</textarea>';
        list.appendChild(card);
      });
    }

    function updateSecTitle(idx, val) {
      const s = getActiveSermon();
      if (s.sections[idx]) s.sections[idx].title = val;
      saveState();
    }
    function updateSecContent(idx, val) {
      const s = getActiveSermon();
      if (s.sections[idx]) s.sections[idx].content = val;
      saveState();
    }
    function deleteSection(idx) {
      const s = getActiveSermon();
      s.sections.splice(idx, 1);
      saveState();
      renderEditorMode();
    }
    function addNewSection() {
      const s = getActiveSermon();
      s.sections.push({
        id: 'sec_' + Date.now(),
        title: 'Novo Ponto da Mensagem',
        type: 'point',
        content: '',
        estimatedMinutes: 5,
        scriptures: []
      });
      saveState();
      renderEditorMode();
    }
    function saveSermonFromInputs() {
      const s = getActiveSermon();
      s.title = document.getElementById('edit-title').value;
      s.theme = document.getElementById('edit-theme').value;
      s.mainScripture = document.getElementById('edit-main-scripture').value;
      s.targetDurationMinutes = parseInt(document.getElementById('edit-duration').value) || 30;
      s.notes = document.getElementById('edit-notes').value;
      saveState();
      alert('Esboço salvo com sucesso!');
      switchTab('preach');
    }

    // Bible Explorer Render
    function renderBibleMode() {
      const bSelect = document.getElementById('bible-book-select');
      if (bSelect.options.length === 0) {
        BIBLE_BOOKS.forEach(b => {
          const opt = document.createElement('option');
          opt.value = b.id;
          opt.innerText = b.name;
          bSelect.appendChild(opt);
        });
      }
      onSelectBibleBook();
    }

    function onSelectBibleBook() {
      const bId = document.getElementById('bible-book-select').value;
      const bObj = BIBLE_BOOKS.find(b => b.id === bId) || BIBLE_BOOKS[0];
      const cSelect = document.getElementById('bible-chapter-select');
      cSelect.innerHTML = '';
      for (let c = 1; c <= bObj.chaptersCount; c++) {
        const opt = document.createElement('option');
        opt.value = c;
        opt.innerText = 'Capítulo ' + c;
        cSelect.appendChild(opt);
      }
      onSelectBibleChapter();
    }

    function onSelectBibleChapter() {
      const bId = document.getElementById('bible-book-select').value;
      const chapter = parseInt(document.getElementById('bible-chapter-select').value) || 1;
      const box = document.getElementById('bible-chapter-content');
      box.innerHTML = '';

      let foundAny = false;
      for (let v = 1; v <= 40; v++) {
        const text = getVerseText(bId, chapter, v);
        if (text) {
          foundAny = true;
          const p = document.createElement('p');
          p.className = 'relative pl-8';
          p.innerHTML = '<span class="absolute left-0 top-0.5 text-xs font-sans font-bold text-amber-400">' + v + '</span><span>' + text + '</span>';
          box.appendChild(p);
        }
      }
      if (!foundAny) {
        box.innerHTML = '<p class="text-stone-500 italic">Capítulo disponível. Você pode adicionar versículos específicos no seu esboço para pregar.</p>';
      }
    }

    // Initial load
    renderPulpitMode();
  </script>
</body>
</html>`;
}

/**
 * Initiates the download of the standalone HTML file in the user's browser.
 */
export function downloadStandaloneHtmlFile(sermons: Sermon[], sermonTitle?: string) {
  const htmlContent = generateStandaloneHtml(sermons);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  
  const cleanName = (sermonTitle || 'pulpito-pregacao-offline')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);

  a.href = url;
  a.download = `${cleanName || 'pulpito'}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
