# ⛳ Python Code Golf Challenge

> Write the shortest Python code that passes all test cases. Every character counts.

A fully browser-based competitive coding game where players solve Python puzzles using as few characters as possible. No installs, no server, no API keys — just open `index.html` and play.

## 🎮 Features
- 15 challenges across Easy / Medium / Hard
- Real Python execution in the browser via Pyodide (WebAssembly)
- Syntax-highlighted editor (CodeMirror)
- Live character counter with par comparison
- Scoring: base + char penalty + under-par bonus + speed bonus
- Confetti on passing all tests
- Leaderboard saved to localStorage
- Personal best tracking per challenge

## 🚀 Run Locally
Just open `index.html` in any modern browser. No install needed.

> Requires internet connection on first load (to fetch Pyodide + CodeMirror from CDN)

## 📁 Structure
```
python-code-golf/
├── index.html          # Main game
├── leaderboard.html    # Rankings
├── how-to-play.html    # Tips & tricks
├── css/style.css       # All styles
└── js/
    ├── challenges.js   # 15 challenges data
    └── game.js         # Full game logic
```

## 🌐 Deploy to GitHub Pages
1. Push to GitHub
2. Settings → Pages → Source: main branch / root
3. Live at `https://yourusername.github.io/python-code-golf`

## Tech Stack
- Pyodide v0.24.1 — Python in WebAssembly
- CodeMirror 5 — Code editor
- Vanilla JS + CSS — No frameworks needed

## License
MIT
