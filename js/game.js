// ⛳ Python Code Golf - Game Logic
let pyodide = null;
let currentChallenge = null;
let editor = null;
let timerInterval = null;
let timerSeconds = 0;
let allTestsPassed = false;
let pyodideReady = false;

// ─── INIT ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderChallengeGrid();
  loadPlayerName();
  setupFilters();
  initLeaderboard();
  initPyodide();
});

function initPyodide() {
  const loaderText = document.getElementById('loader-text');
  const loaderDot = document.getElementById('loader-dot');
  const loader = document.getElementById('pyodide-loader');

  // If the script hasn't loaded yet, wait for it
  function tryLoad() {
    if (typeof window.loadPyodide !== 'function') {
      if (loaderText) loaderText.textContent = 'Waiting for Python script...';
      setTimeout(tryLoad, 300);
      return;
    }
    if (loaderText) loaderText.textContent = 'Loading Python engine...';
    window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/" })
      .then(py => {
        pyodide = py;
        pyodideReady = true;
        if (loaderText) loaderText.textContent = 'Python ready ✓';
        if (loaderDot) loaderDot.classList.add('ready');
        setTimeout(() => { if (loader) loader.classList.add('hidden'); }, 1500);
      })
      .catch(e => {
        if (loaderText) loaderText.textContent = 'Engine load failed — check internet';
        console.error('Pyodide failed:', e);
      });
  }
  tryLoad();
}

// ─── PLAYER NAME ─────────────────────────────────────────────────────────────
function loadPlayerName() {
  const input = document.getElementById('player-name');
  if (!input) return;
  const saved = localStorage.getItem('golf_player') || '';
  input.value = saved;
  input.addEventListener('input', () => {
    localStorage.setItem('golf_player', input.value.trim());
  });
}

function getPlayerName() {
  return localStorage.getItem('golf_player') || 'Anonymous';
}

// ─── CHALLENGE GRID ──────────────────────────────────────────────────────────
function renderChallengeGrid(filter = 'All') {
  const grid = document.getElementById('challenges-grid');
  if (!grid) return;
  const scores = getSavedScores();
  const filtered = filter === 'All' ? CHALLENGES : CHALLENGES.filter(c => c.difficulty === filter);

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-state">No challenges found.</div>';
    return;
  }

  grid.innerHTML = filtered.map(c => {
    const saved = scores[c.id];
    const isSolved = saved?.solved;
    const best = saved?.chars;
    return `
      <div class="challenge-card ${isSolved ? 'solved' : ''}" onclick="openChallenge(${c.id})">
        <div class="card-header">
          <span class="card-num">#${String(c.id).padStart(2,'0')}</span>
          <span class="difficulty-badge badge-${c.difficulty}">${c.difficulty}</span>
        </div>
        <div class="card-title">${c.title}</div>
        <div class="card-meta">
          <span>par: <b>${c.par_score}</b> chars</span>
          ${isSolved
            ? `<span class="card-best">✓ best: ${best} chars</span>`
            : `<span style="color:var(--text-dim)">unsolved</span>`
          }
        </div>
      </div>`;
  }).join('');
}

function setupFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderChallengeGrid(btn.dataset.filter);
    });
  });
  const allBtn = document.querySelector('[data-filter="All"]');
  if (allBtn) allBtn.classList.add('active');
}

// ─── OPEN CHALLENGE ──────────────────────────────────────────────────────────
function openChallenge(id) {
  currentChallenge = CHALLENGES.find(c => c.id === id);
  if (!currentChallenge) return;

  allTestsPassed = false;
  resetTimer();

  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-challenge-title').textContent = currentChallenge.title;
  document.getElementById('modal-meta').textContent =
    `#${String(id).padStart(2,'0')} · ${currentChallenge.difficulty} · par: ${currentChallenge.par_score} chars`;
  document.getElementById('modal-badge').className =
    `difficulty-badge badge-${currentChallenge.difficulty}`;
  document.getElementById('modal-badge').textContent = currentChallenge.difficulty;
  document.getElementById('challenge-description').innerHTML = currentChallenge.description;
  document.getElementById('example-input').textContent = currentChallenge.example_input;
  document.getElementById('example-output').textContent = currentChallenge.example_output;

  // Load saved draft or starter
  const draft = localStorage.getItem(`draft_${id}`) || currentChallenge.starter;

  if (editor) {
    editor.setValue(draft);
  } else {
    const textarea = document.getElementById('code-editor');
    textarea.value = draft;
    editor = CodeMirror.fromTextArea(textarea, {
      mode: 'python',
      theme: 'dracula',
      lineNumbers: true,
      indentUnit: 4,
      tabSize: 4,
      indentWithTabs: false,
      extraKeys: {
        'Tab': cm => cm.replaceSelection('    '),
        'Ctrl-Enter': () => runCode()
      }
    });
    editor.on('change', onEditorChange);
  }

  updateCharCounter();
  renderTestResults([]);
  hideScoringPanel();
  document.getElementById('btn-submit').disabled = true;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  startTimer();
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
  stopTimer();
  if (currentChallenge && editor) {
    localStorage.setItem(`draft_${currentChallenge.id}`, editor.getValue());
  }
}

document.getElementById('modal-overlay')?.addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

// ─── EDITOR ──────────────────────────────────────────────────────────────────
function onEditorChange() {
  updateCharCounter();
  if (currentChallenge) {
    localStorage.setItem(`draft_${currentChallenge.id}`, editor.getValue());
  }
}

function updateCharCounter() {
  if (!editor || !currentChallenge) return;
  const code = editor.getValue();
  const chars = countMeaningfulChars(code);
  const counter = document.getElementById('char-counter');
  counter.textContent = `${chars} chars`;
  if (chars <= currentChallenge.par_score) {
    counter.className = 'char-counter under-par';
  } else {
    counter.className = 'char-counter over-par';
  }
}

function countMeaningfulChars(code) {
  // Count only the function body lines (exclude blank lines and comments for display)
  return code.replace(/\r/g, '').length;
}

function resetCode() {
  if (!currentChallenge || !editor) return;
  editor.setValue(currentChallenge.starter);
  localStorage.removeItem(`draft_${currentChallenge.id}`);
  renderTestResults([]);
  hideScoringPanel();
  document.getElementById('btn-submit').disabled = true;
  allTestsPassed = false;
}

// ─── RUN CODE ─────────────────────────────────────────────────────────────────
async function runCode() {
  if (!pyodideReady) {
    showToast('Python engine still loading, please wait...', 'info');
    return;
  }
  if (!currentChallenge || !editor) return;

  const btn = document.getElementById('btn-run');
  btn.disabled = true;
  btn.textContent = '⏳ Running...';

  const userCode = editor.getValue();
  const results = [];

  for (const tc of currentChallenge.test_cases) {
    const result = await runTestCase(userCode, tc);
    results.push(result);
  }

  allTestsPassed = results.every(r => r.passed);
  renderTestResults(results);

  btn.disabled = false;
  btn.innerHTML = '▶ Run Code';

  document.getElementById('btn-submit').disabled = !allTestsPassed;

  if (allTestsPassed) {
    showScoringPanel();
    stopTimer();
  }
}

async function runTestCase(code, tc) {
  try {
    // Build a small harness: define f, call it, print repr of result
    const harness = `
${code}

_args = (${tc.input},)
_result = f(*_args) if not isinstance((${tc.input},)[0], list) or ',' in '${tc.input}' and not '${tc.input}'.startswith('[') else f(${tc.input})
repr(_result)
`.trim();

    // Simpler, more reliable harness
    const safeHarness = `${code}\n_r = f(${tc.input})\nrepr(_r)`;

    let raw;
    try {
      raw = await pyodide.runPythonAsync(safeHarness);
    } catch (e) {
      const msg = e.message ? e.message.split('\n').filter(l => l.trim()).pop() : String(e);
      return { passed: false, input: tc.input, expected: tc.expected, got: `Error: ${msg}` };
    }

    const got = String(raw);
    const passed = normalizeAndCompare(got, tc.expected);
    return { passed, input: tc.input, expected: tc.expected, got };

  } catch (e) {
    return { passed: false, input: tc.input, expected: tc.expected, got: `Error: ${e.message}` };
  }
}

function normalizeAndCompare(got, expected) {
  // Normalize both sides: strip whitespace, unify quotes, parse if possible
  const norm = s => s.trim().replace(/'/g, '"');
  const g = norm(got);
  const e = norm(expected);
  if (g === e) return true;

  // Try JSON parse comparison (handles lists, dicts)
  try {
    return JSON.stringify(JSON.parse(g)) === JSON.stringify(JSON.parse(e));
  } catch {}

  // Boolean normalization
  if ((g === 'True' || g === 'true') && (e === 'True' || e === 'true')) return true;
  if ((g === 'False' || g === 'false') && (e === 'False' || e === 'false')) return true;

  // Numeric comparison
  if (!isNaN(g) && !isNaN(e)) return Number(g) === Number(e);

  // Strip outer quotes for string comparison
  const stripQ = s => s.replace(/^["']|["']$/g, '');
  return stripQ(g) === stripQ(e);
}

// ─── TEST RESULTS ─────────────────────────────────────────────────────────────
function renderTestResults(results) {
  const container = document.getElementById('test-results');
  if (results.length === 0) {
    container.innerHTML = `<div style="font-family:'JetBrains Mono',monospace;font-size:0.75rem;color:var(--text-dim);padding:0.5rem 0;">
      Click "▶ Run Code" to test your solution (Ctrl+Enter)
    </div>`;
    return;
  }

  container.innerHTML = results.map((r, i) => `
    <div class="test-case ${r.passed ? 'pass' : 'fail'}">
      <span class="test-icon">${r.passed ? '✅' : '❌'}</span>
      <div class="test-info">
        <div class="test-input">in: <span style="color:var(--text)">${escHtml(r.input)}</span></div>
        ${r.passed
          ? `<div class="test-pass-text">→ ${escHtml(r.got)} ✓</div>`
          : `<div class="test-expected">expected: <span style="color:var(--green)">${escHtml(r.expected)}</span></div>
             <div class="test-got">got: <span>${escHtml(r.got)}</span></div>`
        }
      </div>
    </div>`).join('');
}

// ─── SCORING ─────────────────────────────────────────────────────────────────
function showScoringPanel() {
  if (!currentChallenge || !editor) return;
  const chars = editor.getValue().length;
  const panel = document.getElementById('score-panel');

  const base = 1000;
  const charDeduct = chars * 10;
  const underParBonus = chars <= currentChallenge.par_score ? 200 : 0;
  const speedBonus = timerSeconds < 180 ? 100 : 0;
  const total = Math.max(0, base - charDeduct + underParBonus + speedBonus);

  document.getElementById('score-base').textContent = `+${base}`;
  document.getElementById('score-chars').textContent = `-${charDeduct}`;
  document.getElementById('score-par-bonus').textContent = underParBonus > 0 ? `+${underParBonus}` : '0';
  document.getElementById('score-speed-bonus').textContent = speedBonus > 0 ? `+${speedBonus}` : '0';
  document.getElementById('score-total').textContent = total;

  panel.classList.add('visible');
  triggerConfetti();
  showToast('All tests passed! 🎉 Submit your solution.', 'success');
}

function hideScoringPanel() {
  document.getElementById('score-panel')?.classList.remove('visible');
}

// ─── SUBMIT ──────────────────────────────────────────────────────────────────
function submitSolution() {
  if (!allTestsPassed || !currentChallenge || !editor) return;

  const chars = editor.getValue().length;
  const base = 1000;
  const charDeduct = chars * 10;
  const underParBonus = chars <= currentChallenge.par_score ? 200 : 0;
  const speedBonus = timerSeconds < 180 ? 100 : 0;
  const total = Math.max(0, base - charDeduct + underParBonus + speedBonus);

  const scores = getSavedScores();
  const existing = scores[currentChallenge.id];

  if (!existing || chars < existing.chars) {
    scores[currentChallenge.id] = { solved: true, chars, score: total, time: timerSeconds };
    localStorage.setItem('golf_scores', JSON.stringify(scores));
  }

  // Update leaderboard
  updateLeaderboard(getPlayerName(), total, chars, currentChallenge.id);

  closeModal();
  renderChallengeGrid(getActiveFilter());
  updateHeroStats();
  showToast(`Solution submitted! ${chars} chars, ${total} pts`, 'success');
}

// ─── HINT ────────────────────────────────────────────────────────────────────
function showHint() {
  if (!currentChallenge) return;
  showToast(`💡 Hint: ${currentChallenge.hint}`, 'hint');
}

// ─── TIMER ──────────────────────────────────────────────────────────────────
function startTimer() {
  timerSeconds = 0;
  timerInterval = setInterval(() => {
    timerSeconds++;
    const m = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
    const s = String(timerSeconds % 60).padStart(2, '0');
    const el = document.getElementById('timer');
    if (el) {
      el.textContent = `⏱ ${m}:${s}`;
      el.className = 'timer-display' + (timerSeconds > 180 ? ' warning' : '');
    }
  }, 1000);
}

function stopTimer() { clearInterval(timerInterval); }
function resetTimer() { stopTimer(); timerSeconds = 0; const el = document.getElementById('timer'); if (el) el.textContent = '⏱ 00:00'; }

// ─── LEADERBOARD ─────────────────────────────────────────────────────────────
function initLeaderboard() {
  if (!document.getElementById('lb-body')) return;
  renderLeaderboard();
  renderPlayerStats();
}

function updateLeaderboard(name, score, chars, challengeId) {
  const lb = getLeaderboardData();
  const existing = lb.find(e => e.name === name);
  if (existing) {
    existing.score = (existing.score || 0) + score;
    existing.solved = (existing.solved || 0) + 1;
    existing.best = Math.min(existing.best || 999, chars);
  } else {
    lb.push({ name, score, solved: 1, best: chars });
  }
  lb.sort((a, b) => b.score - a.score);
  localStorage.setItem('golf_leaderboard', JSON.stringify(lb));
}

function getLeaderboardData() {
  try { return JSON.parse(localStorage.getItem('golf_leaderboard')) || []; }
  catch { return []; }
}

function renderLeaderboard() {
  const tbody = document.getElementById('lb-body');
  if (!tbody) return;
  const lb = getLeaderboardData();
  if (lb.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:2rem;font-family:'JetBrains Mono',monospace;color:var(--text-dim);">No entries yet. Solve a challenge!</td></tr>`;
    return;
  }
  const medals = ['🥇', '🥈', '🥉'];
  tbody.innerHTML = lb.map((e, i) => `
    <tr>
      <td class="${i < 3 ? `rank-${i+1}` : ''}">${medals[i] || `#${i+1}`}</td>
      <td style="font-weight:600">${escHtml(e.name)}</td>
      <td>${e.solved || 0}</td>
      <td class="lb-score">${e.score || 0}</td>
      <td class="lb-chars">${e.best || '—'}</td>
    </tr>`).join('');
}

function renderPlayerStats() {
  const name = getPlayerName();
  const scores = getSavedScores();
  const solved = Object.values(scores).filter(s => s.solved).length;
  const totalScore = Object.values(scores).reduce((a, s) => a + (s.score || 0), 0);
  const bestChars = Math.min(...Object.values(scores).filter(s => s.chars).map(s => s.chars), 999);
  const lb = getLeaderboardData();
  const rank = lb.findIndex(e => e.name === name) + 1 || '—';

  const el = document.getElementById('player-stats');
  if (!el) return;
  el.innerHTML = `
    <div class="player-card">
      <h3>📊 Your Stats — ${escHtml(name || 'Set your name on the home page')}</h3>
      <div class="player-stats-grid">
        <div class="pstat"><div class="pval">${rank}</div><div class="plabel">Rank</div></div>
        <div class="pstat"><div class="pval">${solved}</div><div class="plabel">Solved</div></div>
        <div class="pstat"><div class="pval">${totalScore}</div><div class="plabel">Total Score</div></div>
        <div class="pstat"><div class="pval">${bestChars === 999 ? '—' : bestChars}</div><div class="plabel">Best (chars)</div></div>
      </div>
    </div>`;
}

// ─── HERO STATS ───────────────────────────────────────────────────────────────
function updateHeroStats() {
  const scores = getSavedScores();
  const solved = Object.values(scores).filter(s => s.solved).length;
  const totalScore = Object.values(scores).reduce((a, s) => a + (s.score || 0), 0);
  const el = document.getElementById('hero-solved');
  const el2 = document.getElementById('hero-score');
  if (el) el.textContent = solved;
  if (el2) el2.textContent = totalScore;
}

// ─── STORAGE ─────────────────────────────────────────────────────────────────
function getSavedScores() {
  try { return JSON.parse(localStorage.getItem('golf_scores')) || {}; }
  catch { return {}; }
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function getActiveFilter() {
  const btn = document.querySelector('.filter-btn.active');
  return btn ? btn.dataset.filter : 'All';
}

// ─── CONFETTI ────────────────────────────────────────────────────────────────
function triggerConfetti() {
  const colors = ['#00ff88','#00d4ff','#ffd60a','#ff4466','#ffffff'];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.top = '-10px';
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.animationDelay = Math.random() * 1 + 's';
    el.style.animationDuration = (1.5 + Math.random()) + 's';
    el.style.transform = `rotate(${Math.random()*360}deg)`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Init stats on load
document.addEventListener('DOMContentLoaded', updateHeroStats);
