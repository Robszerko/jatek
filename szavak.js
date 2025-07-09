<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>SzóNyomozó</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Roboto+Mono:wght@500;700&display=swap" rel="stylesheet">
    
    <style>
        :root {
            /* Alapértelmezett Nyomozó Téma */
            --bg-gradient-start: #3d405b; --bg-gradient-end: #2c2f48; --container-bg: rgba(244, 241, 222, 0.95);
            --text-color: #3d405b; --title-color: #e07a5f; --border-color-idle: #bcaaa4;
            --border-color-active: #8d6e63; --correct-color: #81b29a; --present-color: #f2cc8f;
            --absent-color: #9e9e9e; --key-bg: '#dcd3b8'; --key-text: #3d405b;
            --key-shadow: 0 3px 0 #bcaaa4; --font-title: 'Fredoka One', cursive; --font-main: 'Roboto Mono', monospace;
            --difficulty-easy: #388e3c; --difficulty-hard: #f57c00; --difficulty-extra: #d32f2f;
        }

        body {
            background-color: var(--bg-gradient-end);
            background-image: 
                radial-gradient(circle at top left, rgba(255, 255, 255, 0.1) 0%, transparent 40%),
                url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            background-blend-mode: overlay;
            color: var(--text-color); font-family: var(--font-main); display: flex;
            justify-content: center; align-items: flex-start; padding: 15px;
            box-sizing: border-box; -webkit-user-select: none; user-select: none; touch-action: manipulation;
            transition: background 0.5s ease;
            position: relative; z-index: 1;
        }

        body::before {
            content: ''; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;
            background-image: 
                url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M7,7H5A2,2 0 0,0 3,9V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V9A2,2 0 0,0 19,7H17L16,5H8L7,7M12,18A5,5 0 0,1 7,13A5,5 0 0,1 12,8A5,5 0 0,1 17,13A5,5 0 0,1 12,18M12,10A3,3 0 0,0 9,13A3,3 0 0,0 12,16A3,3 0 0,0 15,13A3,3 0 0,0 12,10Z" /></svg>'),
                url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M17.3,13.5C17.3,13.5 14.5,12.2 12.8,11.4C10.9,10.5 10.3,9.2 10.3,7.9C10.3,6.6 10.9,5.5 12,5.5C13.1,5.5 13.7,6.6 13.7,7.9C13.7,8.2 13.8,8.5 14.1,8.5C14.4,8.5 14.7,8.2 14.7,7.9C14.7,6 13.5,4.5 12,4.5C10.5,4.5 9.3,6 9.3,7.9C9.3,9.8 10.2,11.5 12.3,12.5C14.3,13.5 18.3,15 18.3,15L17.3,13.5M20.5,18.2C20.5,17.7 20.1,17.3 19.6,17.3H5.4C4.9,17.3 4.5,17.7 4.5,18.2C4.5,18.7 4.9,19.1 5.4,19.1H19.6C20.1,19.1 20.5,18.7 20.5,18.2Z" /></svg>');
            background-repeat: no-repeat;
            background-position: bottom 5% left 5%, top 10% right 8%;
            background-size: 200px, 120px; opacity: 0.06;
            transform: rotate(-15deg) translateX(-10%);
        }

        #game-container {
            background-color: var(--container-bg); border-radius: 20px;
            border: 2px solid rgba(255,255,255,0.2);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); display: flex; flex-direction: column;
            align-items: center; width: 100%; max-width: 600px;
            padding: clamp(15px, 4vw, 30px); box-sizing: border-box; margin-top: 1vh;
            position: relative;
        }
        header, #word-tracker, #info-bar, #grid-container, #hint-container, #keyboard-container, #rules-container { width: 100%; }
        header { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0; margin-bottom: 20px; position: relative; }
        #header-main { display: flex; align-items: center; justify-content: center; position: relative; width: 100%; }
        #logo-container { display: flex; align-items: center; position: relative; }
        #logo-svg { width: clamp(80px, 20vw, 100px); height: auto; z-index: 1; }
        header h1 { font-family: var(--font-title); color: var(--title-color); font-size: clamp(2rem, 9vw, 3rem); margin: 0; letter-spacing: 0.05em; margin-left: -2px; z-index: 0; }
        #copyright-notice { font-size: 0.85rem; color: var(--text-color); opacity: 0.7; font-family: var(--font-main); margin-top: -5px; }
        #settings-container { position: relative; }
        #settings-button { background: none; border: none; cursor: pointer; padding: 5px; transform: translateX(-15px); }
        #settings-icon { width: 40px; height: 40px; fill: var(--title-color); transition: transform 0.3s ease, fill 0.3s ease; }
        #settings-button:hover #settings-icon { transform: rotate(15deg) scale(1.1); }
        #palette-container { display: none; position: absolute; top: 100%; right: -20px; background-color: var(--container-bg); border: 2px solid var(--border-color-idle); border-radius: 10px; padding: 15px; z-index: 100; width: 280px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); margin-top: 5px; }
        #palette-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(40px, 1fr)); gap: 10px; }
        .palette-swatch { width: 40px; height: 40px; border-radius: 50%; cursor: pointer; border: 3px solid transparent; transition: all 0.2s ease; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .palette-swatch:hover { transform: scale(1.1); }
        .palette-swatch.active { border-color: var(--title-color); transform: scale(1.1); }
        #word-tracker { display: flex; justify-content: center; gap: 10px; margin-bottom: 10px; }
        .tracker-item { flex: 1; padding: 10px 5px; text-align: center; border-radius: 8px; border: 2px solid var(--border-color-idle); font-weight: 500; cursor: pointer; transition: all 0.2s ease; position: relative; }
        .tracker-item.active { background-color: var(--title-color); color: white; border-color: var(--title-color); }
        .tracker-item.solved { background-color: var(--correct-color); border-color: var(--correct-color); color: white; cursor: not-allowed; }
        .tracker-item.failed { background-color: #e53935; border-color: #e53935; color: white; cursor: not-allowed; }
        #info-bar { padding: 12px; background: rgba(0,0,0,0.05); border: 2px solid var(--border-color-idle); border-radius: 10px; text-align: center; font-size: clamp(0.9rem, 2.5vw, 1rem); font-weight: 500; margin-bottom: 20px; display: flex; justify-content: center; align-items: center; gap: 15px; }
        #timer-display { font-weight: 700; font-size: 1.1em; color: var(--title-color); }
        #start-timer-button { background-color: var(--correct-color); color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-weight: 700; transition: background-color 0.2s; }
        #start-timer-button:hover { background-color: #6a9982; }
        #next-set-info { display: block; margin-top: 5px; font-size: 0.9em; color: var(--title-color); opacity: 0.8; }
        #word-info-container { display: flex; flex-direction: column; align-items: center; }
        #difficulty-display { font-weight: 700; margin-top: 4px; border-radius: 10px; padding: 3px 10px; color: white; font-size: 0.9em; text-transform: uppercase; letter-spacing: 0.5px; text-shadow: 1px 1px 2px rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.3); }
        .difficulty-könnyű { background-color: var(--difficulty-easy); }
        .difficulty-nehéz { background-color: var(--difficulty-hard); }
        .difficulty-extra-nehéz { background-color: var(--difficulty-extra); }
        #grid-container { display: grid; grid-template-rows: repeat(6, 1fr); gap: 8px; max-width: 500px; margin: 0 auto 20px auto; height: 360px; }
        .grid-row { display: grid; gap: 8px; }
        .grid-cell { perspective: 1000px; }
        .cell-inner { position: relative; width: 100%; height: 100%; transition: transform 0.6s; transform-style: preserve-3d; }
        .grid-cell.flip .cell-inner { transform: rotateX(180deg); }
        .cell-face { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; -webkit-backface-visibility: hidden; display: flex; justify-content: center; align-items: center; font-size: clamp(1.5rem, 5vw, 2.2rem); font-weight: bold; text-transform: uppercase; box-sizing: border-box; border-radius: 8px; }
        .cell-front { border: 3px solid var(--border-color-idle); }
        .cell-revealed { border-color: var(--correct-color); background-color: rgba(129, 178, 154, 0.2); animation: pop 0.3s; }
        .grid-cell.filled .cell-front:not(.cell-revealed) { border-color: var(--border-color-active); animation: pop 0.2s; }
        .cell-back { color: white; transform: rotateX(180deg); border: 3px solid transparent; }
        .cell-back.correct { background-color: var(--correct-color); border-color: var(--correct-color);}
        .cell-back.present { background-color: var(--present-color); border-color: var(--present-color);}
        .cell-back.absent  { background-color: var(--absent-color); border-color: var(--absent-color);}
        @keyframes pop { 50% { transform: scale(1.1); } }
        #hint-container { background-color: rgba(0,0,0,0.05); border: 2px solid var(--border-color-idle); border-radius: 10px; padding: 15px; margin-bottom: 15px; text-align: center; min-height: 40px; font-weight: 500; color: #5d4037; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 8px; }
        #hint-display-area p { margin: 0; font-style: italic; line-height: 1.5; }
        #hint-display-area p strong { color: var(--title-color); font-style: normal; }
        .hint-alert { color: var(--correct-color); font-weight: 900; font-style: normal; animation: flash 1s infinite; font-size: 1.8rem; letter-spacing: 2px; }
        @keyframes flash { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.05); } }
        #request-hint-button { background-color: var(--present-color); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 700; transition: all 0.2s; margin-bottom: 25px; box-shadow: 0 3px 0 #d0a457; font-size: 1rem; }
        #request-hint-button:hover:not(:disabled) { background-color: #eabf6f; transform: translateY(-2px); }
        #request-hint-button:disabled { background-color: var(--absent-color); cursor: not-allowed; box-shadow: none; }
        #keyboard-container { display: flex; flex-direction: column; gap: 12px; }
        .keyboard-row { display: flex; justify-content: center; gap: 6px; }
        .key { font-family: var(--font-main); font-weight: 500; background-color: var(--key-bg); color: var(--key-text); border: none; border-radius: 8px; height: 60px; flex: 1; cursor: pointer; text-transform: uppercase; font-size: clamp(1rem, 3vw, 1.4rem); display: flex; justify-content: center; align-items: center; transition: all 0.1s ease-in-out; box-shadow: var(--key-shadow); }
        .key:active { transform: translateY(2px); box-shadow: none; }
        .key.large { flex: 1.5; font-size: 0.9rem; }
        .key.correct, .key.present, .key.absent { color: white; }
        .key.correct { background-color: var(--correct-color); box-shadow: 0 3px 0 #6a9982; }
        .key.present { background-color: var(--present-color); box-shadow: 0 3px 0 #d0a457; }
        .key.absent { background-color: var(--absent-color); box-shadow: 0 3px 0 #616161; }
        #rules-container { margin-top: 30px; padding-top: 20px; border-top: 2px solid var(--border-color-idle); color: var(--text-color); font-size: clamp(0.8rem, 2.2vw, 0.9rem); line-height: 1.7; }
        #rules-container h3 { font-family: var(--font-title); color: var(--title-color); text-align: center; font-size: 1.5rem; margin: 0 0 15px 0; }
        #rules-container ul { list-style-type: '🕵️ '; padding-left: 20px; text-align: left; margin: 0; }
        #rules-container li { margin-bottom: 12px; padding-left: 8px; }
        #rules-container strong { color: var(--title-color); }
        .rules-correct { color: var(--correct-color); font-weight: 700; }
        .rules-present { color: var(--present-color); font-weight: 700; }
        .rules-absent { color: var(--absent-color); font-weight: 700; }
        .rules-penalty { color: #d32f2f; font-weight: 700; }
        #new-set-overlay, #bonus-game-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center; z-index: 1000; opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0s 0.3s; }
        #new-set-overlay.visible, #bonus-game-overlay.visible { opacity: 1; visibility: visible; transition-delay: 0s; }
        .overlay-content { background-color: var(--container-bg); color: var(--text-color); padding: clamp(20px, 5vw, 40px); border-radius: 20px; text-align: center; box-shadow: 0 5px 25px rgba(0,0,0,0.3); max-width: 95%; width: fit-content; }
        .overlay-content h2 { font-family: var(--font-title); color: var(--title-color); margin: 0 0 15px 0; font-size: clamp(1.5rem, 6vw, 2.2rem); }
        #refresh-button, #check-bonus-button, #close-bonus-button { background-color: var(--title-color); color: white; border: none; padding: 12px 25px; border-radius: 8px; font-family: var(--font-main); font-weight: 700; font-size: 1rem; cursor: pointer; margin-top: 20px; transition: transform 0.2s ease; }
        #refresh-button:hover, #check-bonus-button:hover, #close-bonus-button:hover { transform: scale(1.05); }

        #unlock-bonus-button {
            display: none; background-color: var(--difficulty-extra); color: white;
            border: 2px solid white; border-radius: 10px; padding: 15px 30px;
            font-family: var(--font-title); font-size: 1.2rem; letter-spacing: 1px;
            cursor: pointer; margin: 10px 0 20px 0; text-shadow: 1px 1px 3px rgba(0,0,0,0.4);
            animation: pulse 2s infinite;
        }
        @keyframes pulse { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(211, 47, 47, 0); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(211, 47, 47, 0); } }
        #bonus-game-container { display: flex; flex-direction: column; align-items: center; gap: 20px; }
        #bonus-header { display: flex; justify-content: space-around; align-items: center; width: 100%;}
        #bonus-timer-display { font-size: 1.8rem; font-weight: 700; color: var(--title-color); }
        #bonus-grid-wrapper { display: flex; gap: 20px; align-items: flex-start; flex-wrap: wrap; justify-content: center; }
        #bonus-grid-container { display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; }
        .bonus-cell { width: clamp(40px, 10vw, 55px); height: clamp(40px, 10vw, 55px); background-color: #fff; border: 2px solid var(--border-color-idle); text-align: center; font-size: 1.8rem; text-transform: uppercase; font-family: var(--font-main); font-weight: 700; color: var(--text-color); border-radius: 5px; padding: 0;}
        .bonus-cell:focus { outline: 3px solid var(--title-color); }
        .bonus-cell.pre-filled { background-color: var(--key-bg); font-weight: 900; color: var(--title-color); }
        .bonus-cell.correct { background-color: var(--correct-color); color: white; border-color: var(--correct-color); }
        .bonus-cell.incorrect { background-color: #e53935; color: white; border-color: #e53935; }
        .empty-cell { background-color: transparent; border: none; }
        #bonus-clues-container { text-align: left; list-style-type: none; padding: 0; margin: 0; line-height: 1.8; font-size: clamp(0.9rem, 2.5vw, 1.1rem); }
        #bonus-clues-container strong { color: var(--title-color); }
    </style>
</head>
<body>
    <div id="game-container">
        <header>
            <div id="header-main">
                <div id="logo-container">
                    <svg id="logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color: var(--title-color);stop-opacity:1" /><stop offset="100%" style="stop-color: var(--text-color);stop-opacity:1" /></linearGradient></defs>
                        <circle cx="50" cy="50" r="40" stroke="url(#grad1)" stroke-width="12" fill="#ffffff"/>
                        <line x1="32" y1="72" x2="5" y2="95" stroke="url(#grad1)" stroke-width="16" stroke-linecap="round"/>
                        <text x="50" y="62" font-family="Fredoka One, sans-serif" font-size="38" fill="var(--text-color)" text-anchor="middle">Szó</text>
                    </svg>
                    <h1>Nyomozó</h1>
                </div>
                <div id="settings-container">
                    <button id="settings-button" aria-label="Színpaletta megnyitása"><svg id="settings-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 1.5L14.18 6.96L20 7.34L15.45 11.07L17.06 16.8L12 13.5L6.94 16.8L8.55 11.07L4 7.34L9.82 6.96L12 1.5M12 3.87L10.65 7.8L6.39 8.08L9.57 10.74L8.62 14.93L12 12.63L15.38 14.93L14.43 10.74L17.61 8.08L13.35 7.8L12 3.87Z"/></svg></button>
                    <div id="palette-container"><div id="palette-grid"></div></div>
                </div>
            </div>
            <p id="copyright-notice">© Copyright by: Robi</p>
        </header>
        
        <div id="word-tracker"></div>
        <button id="unlock-bonus-button">🏆 Extra Nyomozás 🏆</button>
        
        <div id="info-bar">
            <div id="word-info-container">
                <span id="word-info"></span>
                <span id="difficulty-display"></span> 
                <span id="next-set-info"></span>
            </div>
            <span id="timer-display">07:00</span>
            <button id="start-timer-button">Óra Indul</button>
        </div>
        <main id="grid-container"></main>
        
        <div id="hint-container">
             <div id="hint-display-area"></div>
             <div id="game-end-message"></div>
        </div>
        <button id="request-hint-button">Segítséget kérek (-1 perc)</button>
        
        <div id="keyboard-container"></div>
        
        <div id="rules-container">
            <h3>Játékszabályok</h3>
            <ul>
                <li><strong>A Cél:</strong> Minden órában 5 új szót kell kitalálnod egy 500 szavas készletből. Minden szóhoz 6 próbálkozásod és 7 perced van.</li>
                <li><strong>Színek Jelentése:</strong> A <span class="rules-correct">zöld</span> betű a helyén van. A <span class="rules-present">sárga</span> betű szerepel a szóban, de rossz helyen. A <span class="rules-absent">szürke</span> betű egyáltalán nem része a megoldásnak.</li>
                <li><strong>Segítségek:</strong> Az idő múlásával automatikusan megjelennek a szöveges és betű-segítségek.</li>
                <li><strong>Manuális Segítség:</strong> Ha elakadsz, a <strong>"Segítséget kérek"</strong> gombbal is felfedhetsz egy újabb segítséget. Ennek ára <span class="rules-penalty">minden kattintáskor 1 perc</span> levonás!</li>
                <li><strong>Extra Nyomozás:</strong> Ha mind az 5 szót hibátlanul megfejted, egy <strong>bónusz keresztrejtvény</strong> oldható fel! Erre 2 perced lesz, segítség nélkül.</li>
            </ul>
        </div>
    </div>

    <div id="new-set-overlay">
        <div class="overlay-content">
            <h2>Új Feladványok!</h2>
            <p>Új óra kezdődött, friss szavak várnak rád.</p>
            <button id="refresh-button">Frissítés</button>
        </div>
    </div>
    
    <div id="bonus-game-overlay">
        <div class="overlay-content">
            <div id="bonus-game-container">
                <div id="bonus-header">
                    <h2>Extra Nyomozás</h2>
                    <div id="bonus-timer-display">02:00</div>
                </div>
                <div id="bonus-grid-wrapper">
                    <div id="bonus-grid-container"></div>
                    <ul id="bonus-clues-container"></ul>
                </div>
                <button id="check-bonus-button">Megfejtés</button>
                <button id="close-bonus-button" style="display: none;">Bezárás</button>
            </div>
        </div>
    </div>

    <!-- A szavakat mostantól a 'szavak.js' fájlból töltjük be. -->
    <!-- Ennek a fájlnak a HTML mellett kell lennie. -->
    <script src="szavak.js"></script>
    
    <script>
    document.addEventListener('DOMContentLoaded', () => {
        const palettes = [ { name: "Nyomozó", vars: { '--bg-gradient-start': '#3d405b', '--bg-gradient-end': '#2c2f48', '--container-bg': 'rgba(244, 241, 222, 0.95)', '--text-color': '#3d405b', '--title-color': '#e07a5f', '--border-color-idle': '#bcaaa4', '--border-color-active': '#8d6e63', '--correct-color': '#81b29a', '--present-color': '#f2cc8f', '--absent-color': '#9e9e9e', '--key-bg': '#dcd3b8', '--key-text': '#3d405b', '--key-shadow': '0 3px 0 #bcaaa4', '--difficulty-easy': '#388e3c', '--difficulty-hard': '#f57c00', '--difficulty-extra': '#d32f2f' } }, { name: "Eredeti Menta", vars: { '--bg-gradient-start': '#e0f7fa', '--bg-gradient-end': '#b2ebf2', '--container-bg': '#ffffff', '--text-color': '#004d40', '--title-color': '#00796b', '--border-color-idle': '#b0bec5', '--border-color-active': '#78909c', '--correct-color': '#43a047', '--present-color': '#ffa000', '--absent-color': '#90a4ae', '--key-bg': '#cfd8dc', '--key-text': '#263238', '--key-shadow': '0 3px 0 #90a4ae', '--difficulty-easy': '#43a047', '--difficulty-hard': '#ffa000', '--difficulty-extra': '#e53935' } }, { name: "Sötét Mód", vars: { '--bg-gradient-start': '#263238', '--bg-gradient-end': '#37474f', '--container-bg': '#455a64', '--text-color': '#eceff1', '--title-color': '#80cbc4', '--border-color-idle': '#78909c', '--border-color-active': '#b0bec5', '--correct-color': '#66bb6a', '--present-color': '#ffee58', '--absent-color': '#546e7a', '--key-bg': '#607d8b', '--key-text': '#ffffff', '--key-shadow': '0 3px 0 #37474f', '--difficulty-easy': '#66bb6a', '--difficulty-hard': '#ffee58', '--difficulty-extra': '#ef5350' } }, { name: "Naplemente", vars: { '--bg-gradient-start': '#ffab73', '--bg-gradient-end': '#ff8a65', '--container-bg': '#fff3e0', '--text-color': '#4e342e', '--title-color': '#e65100', '--border-color-idle': '#ffccbc', '--border-color-active': '#ffab91', '--correct-color': '#81c784', '--present-color': '#64b5f6', '--absent-color': '#e0e0e0', '--key-bg': '#ffcc80', '--key-text': '#4e342e', '--key-shadow': '0 3px 0 #e65100', '--difficulty-easy': '#81c784', '--difficulty-hard': '#e65100', '--difficulty-extra': '#b71c1c' } }, { name: "Levendula", vars: { '--bg-gradient-start': '#e1bee7', '--bg-gradient-end': '#ce93d8', '--container-bg': '#f3e5f5', '--text-color': '#4a148c', '--title-color': '#8e24aa', '--border-color-idle': '#d1c4e9', '--border-color-active': '#b39ddb', '--correct-color': '#4db6ac', '--present-color': '#ffd54f', '--absent-color': '#e0e0e0', '--key-bg': '#ce93d8', '--key-text': '#4a148c', '--key-shadow': '0 3px 0 #ab47bc', '--difficulty-easy': '#4db6ac', '--difficulty-hard': '#fbc02d', '--difficulty-extra': '#e91e63' } }, { name: "Erdő", vars: { '--bg-gradient-start': '#a5d6a7', '--bg-gradient-end': '#81c784', '--container-bg': '#e8f5e9', '--text-color': '#1b5e20', '--title-color': '#388e3c', '--border-color-idle': '#c8e6c9', '--border-color-active': '#a5d6a7', '--correct-color': '#66bb6a', '--present-color': '#ffb74d', '--absent-color': '#a1887f', '--key-bg': '#a5d6a7', '--key-text': '#1b5e20', '--key-shadow': '0 3px 0 #4caf50', '--difficulty-easy': '#388e3c', '--difficulty-hard': '#ffb74d', '--difficulty-extra': '#e57373' } }, ];
        
        // A NAGY SZÓLISTA (`wordData`) INNEN EL LETT TÁVOLÍTVA.
        // A BÖNGÉSZŐ AZT MÁR A 'szavak.js' FÁJLBÓL TÖLTÖTTE BE,
        // ÍGY A KÖVETKEZŐ KÓD MÁR TUDJA HASZNÁLNI.
        
        const bonusPuzzles = [
            {
                grid: [
                    ['K', 'A', 'B', 'Á', 'T'],
                    ['A', null, 'A', null, 'Á'],
                    ['L', 'A', 'T', 'O', 'R'],
                    ['A', null, 'A', null, 'O'],
                    ['P', 'A', 'D', 'L', 'Ó'],
                ],
                words: [
                    { num: 1, dir: 'Vízszintes', word: 'KABÁT', clue: 'Ruhanemű' },
                    { num: 2, dir: 'Vízszintes', word: 'LATOR', clue: 'Gonosztevő' },
                    { num: 3, dir: 'Vízszintes', word: 'PADLÓ', clue: 'Épület része' },
                    { num: 4, dir: 'Függőleges', word: 'KALAP', clue: 'Fejfedő' },
                    { num: 5, dir: 'Függőleges', word: 'TÁROL', clue: 'Cselekvés' },
                ],
                preFilled: [{r: 0, c: 2, char: 'B'}, {r: 2, c: 0, char: 'L'}, {r: 2, c: 3, char: 'O'}, {r: 4, c: 4, char: 'Ó'}, {r: 1, c: 0, char: 'A'}]
            },
            {
                grid: [
                    ['S', 'Z', 'Á', 'M', 'Á'],
                    ['Z', null, 'L', null, 'L'],
                    ['E', 'L', 'L', 'E', 'N'],
                    ['R', null, 'Ó', null, 'L'],
                    ['V', 'I', 'Z', 'S', 'A'],
                ],
                words: [
                    { num: 1, dir: 'Vízszintes', word: 'SZAMÁR', clue: 'Állat' },
                    { num: 2, dir: 'Vízszintes', word: 'ELLEN', clue: 'Viszonyszó' },
                    { num: 3, dir: 'Vízszintes', word: 'VIZSA', clue: 'Madár (régi)' },
                    { num: 4, dir: 'Függőleges', word: 'SZERV', clue: 'Testrész' },
                    { num: 5, dir: 'Függőleges', word: 'MÉRLEG', clue: 'Eszköz' },
                ],
                preFilled: [{r: 0, c: 0, char: 'S'}, {r: 2, c: 2, char: 'L'}, {r: 4, c: 4, char: 'A'}, {r: 0, c: 4, char: 'R'}, {r: 4, c: 0, char: 'V'}]
            }
        ];
        
        const MAX_GUESSES = 6;
        let gameData = {};
        let timerInterval;
        let bonusTimerInterval;

        const gridContainer = document.getElementById('grid-container');
        const keyboardContainer = document.getElementById('keyboard-container');
        const hintDisplayArea = document.getElementById('hint-display-area');
        const gameEndMessageEl = document.getElementById('game-end-message');
        const requestHintButton = document.getElementById('request-hint-button');
        const difficultyDisplay = document.getElementById('difficulty-display');
        const wordInfoDisplay = document.getElementById('word-info');
        const nextSetInfoDisplay = document.getElementById('next-set-info');
        const wordTrackerContainer = document.getElementById('word-tracker');
        const settingsButton = document.getElementById('settings-button');
        const paletteContainer = document.getElementById('palette-container');
        const paletteGrid = document.getElementById('palette-grid');
        const newSetOverlay = document.getElementById('new-set-overlay');
        const refreshButton = document.getElementById('refresh-button');
        const timerDisplay = document.getElementById('timer-display');
        const startTimerButton = document.getElementById('start-timer-button');
        const unlockBonusButton = document.getElementById('unlock-bonus-button');
        const bonusGameOverlay = document.getElementById('bonus-game-overlay');
        const bonusTimerDisplay = document.getElementById('bonus-timer-display');
        const bonusGridContainer = document.getElementById('bonus-grid-container');
        const bonusCluesContainer = document.getElementById('bonus-clues-container');
        const checkBonusButton = document.getElementById('check-bonus-button');
        const closeBonusButton = document.getElementById('close-bonus-button');

        function applyTheme(paletteIndex) {
            const selectedPalette = palettes[paletteIndex];
            if (!selectedPalette) return;
            Object.keys(selectedPalette.vars).forEach(key => {
                document.documentElement.style.setProperty(key, selectedPalette.vars[key]);
            });
            document.querySelectorAll('.palette-swatch').forEach((swatch, index) => {
                swatch.classList.toggle('active', index === paletteIndex);
            });
            localStorage.setItem('szonyomozo_theme_index', paletteIndex);
        }

        function initPalette() {
            paletteGrid.innerHTML = '';
            palettes.forEach((palette, index) => {
                const swatch = document.createElement('div');
                swatch.className = 'palette-swatch';
                swatch.title = palette.name;
                swatch.dataset.index = index;
                const bg = palette.vars['--bg-gradient-start'] && palette.vars['--bg-gradient-end']
                    ? `linear-gradient(135deg, ${palette.vars['--bg-gradient-start']}, ${palette.vars['--bg-gradient-end']})`
                    : palette.vars['--bg-gradient-end'];
                swatch.style.background = bg;
                swatch.addEventListener('click', () => {
                    applyTheme(index);
                    paletteContainer.style.display = 'none';
                });
                paletteGrid.appendChild(swatch);
            });
        }

        function seededRandom(seed) { let x = Math.sin(seed) * 10000; return x - Math.floor(x); }
        function getCurrentHourSeed() {
            const now = new Date();
            return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate() * 100 + now.getHours();
        }

        function initGame() {
            const hourSeed = getCurrentHourSeed();
            const storedData = JSON.parse(localStorage.getItem('szonyomozo_progress'));
            
            if (storedData && storedData.seed === hourSeed) {
                gameData = storedData;
                if (gameData.bonusPlayed === undefined) {
                    gameData.bonusPlayed = false;
                }
            } else {
                gameData = {
                    seed: hourSeed, hourlySet: [], progress: [], timers: [], 
                    revealedIndices: {}, isTimerRunning: [], revealedHints: {},
                    bonusPlayed: false,
                    currentWordIndex: 0, currentRow: 0, currentCol: 0, isGameOver: false
                };
                let tempWordIndices = Array.from(Array(wordData.length).keys());
                for (let i = 0; i < 5; i++) {
                    const randomIndex = Math.floor(seededRandom(hourSeed + i * 13) * tempWordIndices.length);
                    gameData.hourlySet.push(tempWordIndices.splice(randomIndex, 1)[0]);
                }
                gameData.progress = Array(5).fill('pending');
                gameData.timers = Array(5).fill(420);
                gameData.isTimerRunning = Array(5).fill(false);
                gameData.revealedIndices = {};
                gameData.revealedHints = {};
                for(let i=0; i<5; i++) {
                    gameData.revealedIndices[i] = [];
                    gameData.revealedHints[i] = [];
                }
                gameData.currentWordIndex = 0;
            }
            const nextHour = (new Date().getHours() + 1) % 24;
            nextSetInfoDisplay.textContent = `Következő 5 szó: ${nextHour}:00-kor`;
            renderWordTracker();
            loadWord(gameData.currentWordIndex);
            checkForBonusGameUnlock();
        }

        function saveGame() {
            localStorage.setItem('szonyomozo_progress', JSON.stringify(gameData));
        }

        function renderWordTracker() {
            wordTrackerContainer.innerHTML = '';
            gameData.hourlySet.forEach((_, index) => {
                const item = document.createElement('div');
                item.className = 'tracker-item'; item.textContent = `${index + 1}. szó`; item.dataset.index = index;
                if (gameData.progress[index] === 'solved') item.classList.add('solved');
                if (gameData.progress[index] === 'failed') item.classList.add('failed');
                if (index === gameData.currentWordIndex) item.classList.add('active');
                if (gameData.progress[index] === 'pending') {
                    item.addEventListener('click', () => { if(index !== gameData.currentWordIndex) loadWord(index); });
                }
                wordTrackerContainer.appendChild(item);
            });
        }

        function loadWord(indexInSet) {
            clearInterval(timerInterval);
            gameData.currentWordIndex = indexInSet;
            const wordProgress = gameData.progress[indexInSet];
            gameData.isGameOver = (wordProgress !== 'pending');
            gameData.currentRow = 0; 
            gameData.currentCol = 0;

            const wordObject = wordData[gameData.hourlySet[indexInSet]];
            const { word, category, difficulty } = wordObject;
            wordInfoDisplay.textContent = `${category} | ${word.length} betűs`;
            
            difficultyDisplay.textContent = difficulty;
            difficultyDisplay.className = 'difficulty-display';
            difficultyDisplay.classList.add(`difficulty-${difficulty.toLowerCase().replace(' ', '-')}`);

            updateTimerDisplay(gameData.timers[indexInSet]);
            hintDisplayArea.innerHTML = '';
            gameEndMessageEl.innerHTML = '';
            renderAllRevealedHints();
            initializeGrid(word.length);
            initializeKeyboard();
            renderWordTracker();
            
            if (gameData.isGameOver) {
                startTimerButton.style.display = 'none';
                requestHintButton.disabled = true;
                showEndMessage();
            } else if (gameData.isTimerRunning[indexInSet]) {
                startTimerButton.style.display = 'none';
                requestHintButton.disabled = false;
                startTimer(gameData.timers[indexInSet]);
            } else {
                startTimerButton.style.display = 'block';
                requestHintButton.disabled = true;
            }
        }
        
        function updateTimerDisplay(timeLeft) {
             if (timeLeft < 0) timeLeft = 0;
             const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
             const seconds = (timeLeft % 60).toString().padStart(2, '0');
             timerDisplay.textContent = `${minutes}:${seconds}`;
        }

        function startTimer(duration) {
            let timeLeft = duration;
            updateTimerDisplay(timeLeft);
            
            timerInterval = setInterval(() => {
                if (gameData.isGameOver) { clearInterval(timerInterval); return; }
                timeLeft--;
                gameData.timers[gameData.currentWordIndex] = timeLeft;
                updateTimerDisplay(timeLeft);
                checkAndRevealTimedHint(timeLeft);
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    failWord();
                }
                saveGame();
            }, 1000);
        }
        
        function showHintAlert(callback) {
            gameEndMessageEl.innerHTML = `<strong class="hint-alert">SEGÍTSÉG!!!</strong>`;
            setTimeout(() => {
                if (gameData.isGameOver) { showEndMessage(); return; }
                gameEndMessageEl.innerHTML = '';
                callback();
            }, 3000);
        }

        function checkAndRevealTimedHint(timeLeft) {
            const reveal = (id, action) => {
                const hints = gameData.revealedHints[gameData.currentWordIndex];
                if (hints && !hints.includes(id)) {
                    hints.push(id);
                    showHintAlert(action);
                    saveGame();
                }
            };
            const wordHints = wordData[gameData.hourlySet[gameData.currentWordIndex]].hints;
            if (timeLeft === 360) reveal('text1', () => renderHint('text1'));
            if (timeLeft === 240 && wordHints[1]) reveal('text2', () => renderHint('text2'));
            if (timeLeft === 180) reveal('letter1', () => revealRandomLetter());
            if (timeLeft === 120 && wordHints[2]) reveal('text3', () => renderHint('text3'));
            if (timeLeft === 60) reveal('letter2', () => revealRandomLetter());
        }

        function revealRandomLetter() {
            if (gameData.isGameOver) return;
            const wordObject = wordData[gameData.hourlySet[gameData.currentWordIndex]];
            const targetWord = wordObject.word.toUpperCase();
            const revealedIndices = gameData.revealedIndices[gameData.currentWordIndex];
            
            const unrevealedWordIndices = [];
            for (let i = 0; i < targetWord.length; i++) {
                if (!revealedIndices.includes(i)) unrevealedWordIndices.push(i);
            }
            if (unrevealedWordIndices.length === 0) return;
            
            const indexToReveal = unrevealedWordIndices[Math.floor(Math.random() * unrevealedWordIndices.length)];
            revealedIndices.push(indexToReveal);
            
            const letter = targetWord[indexToReveal];
            for(let i=0; i<MAX_GUESSES; i++) {
                const cellFront = document.querySelector(`#row-${i} #cell-container-${i}-${indexToReveal} .cell-front`);
                if(cellFront) {
                    cellFront.textContent = letter;
                    cellFront.classList.add('cell-revealed');
                }
            }
            updateKeyboard(letter, 'correct');
            saveGame();
        }
        
        function failWord() {
            gameData.isGameOver = true;
            gameData.progress[gameData.currentWordIndex] = 'failed';
            requestHintButton.disabled = true;
            showEndMessage();
            saveGame();
            renderWordTracker();
        }

        function initializeGrid(wordLength) {
            gridContainer.innerHTML = '';
            for (let i = 0; i < MAX_GUESSES; i++) {
                const row = document.createElement('div'); row.className = 'grid-row'; row.id = `row-${i}`;
                row.style.gridTemplateColumns = `repeat(${wordLength}, 1fr)`;
                for (let j = 0; j < wordLength; j++) {
                    row.innerHTML += `<div class="grid-cell" id="cell-container-${i}-${j}"><div class="cell-inner"><div class="cell-face cell-front"></div><div class="cell-face cell-back"></div></div></div>`;
                }
                gridContainer.appendChild(row);
            }
            const revealed = gameData.revealedIndices[gameData.currentWordIndex];
            if (revealed && revealed.length > 0) {
                const targetWord = wordData[gameData.hourlySet[gameData.currentWordIndex]].word.toUpperCase();
                revealed.forEach(index => {
                    for(let i=0; i<MAX_GUESSES; i++) {
                        const cellFront = document.querySelector(`#row-${i} #cell-container-${i}-${index} .cell-front`);
                        if(cellFront) {
                            cellFront.textContent = targetWord[index];
                            cellFront.classList.add('cell-revealed');
                        }
                    }
                });
            }
        }
        
        function initializeKeyboard() { 
            keyboardContainer.innerHTML = '';
            keyLayout.forEach(rowKeys => {
                const row = document.createElement('div'); row.className = 'keyboard-row';
                rowKeys.forEach(key => {
                    const button = document.createElement('button');
                    button.textContent = key; button.className = 'key';
                    button.dataset.key = key.toUpperCase();
                    if (key === 'Enter' || key === 'Backspace') button.classList.add('large');
                    button.addEventListener('click', () => handleKeyPress(key));
                    row.appendChild(button);
                });
                keyboardContainer.appendChild(row);
            });
        }

        const keyLayout = [
            ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P', 'Ö', 'Ü', 'Ó'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'É', 'Á', 'Ű', 'Ő', 'Ú'],
            ['Enter', 'Y', 'X', 'C', 'V', 'B', 'N', 'M', 'Í', 'Backspace']
        ];
        
        function handleKeyPress(key) {
            if (gameData.isGameOver || !gameData.isTimerRunning[gameData.currentWordIndex]) return;
            const upperKey = key.toUpperCase();
            if (upperKey === 'ENTER') submitGuess();
            else if (upperKey === 'BACKSPACE' || upperKey === 'DELETE') deleteLetter();
            else if (upperKey.length === 1 && "QWERTZUIOPÖÜÓASDFGHJKLÉÁŰŐÚYXCVBNMÍ".includes(upperKey)) addLetter(upperKey);
        }

        function addLetter(letter) {
            const wordLength = wordData[gameData.hourlySet[gameData.currentWordIndex]].word.length;
            if (gameData.currentCol >= wordLength) return;
            const cell = document.querySelector(`#row-${gameData.currentRow}`).children[gameData.currentCol];
            if (cell.querySelector('.cell-front').classList.contains('cell-revealed')) {
                gameData.currentCol++;
                if (gameData.currentCol < wordLength) addLetter(letter); 
                return;
            }
            if (cell) {
                cell.querySelector('.cell-front').textContent = letter;
                cell.classList.add('filled');
                gameData.currentCol++;
            }
        }

        function deleteLetter() {
            if (gameData.currentCol <= 0) return;
            gameData.currentCol--;
            const cell = document.querySelector(`#row-${gameData.currentRow}`).children[gameData.currentCol];

            if (cell.querySelector('.cell-front').classList.contains('cell-revealed')) {
                if(gameData.currentCol > 0) deleteLetter();
                return;
            }
            if (cell) {
                cell.querySelector('.cell-front').textContent = '';
                cell.classList.remove('filled');
            }
        }
        
        function renderHint(hintId) {
            const wordObject = wordData[gameData.hourlySet[gameData.currentWordIndex]];
            const hintIndex = parseInt(hintId.replace('text', ''), 10) - 1;
            
            if (wordObject.hints && wordObject.hints[hintIndex]) {
                const p = document.createElement('p');
                p.innerHTML = `<strong>${hintIndex + 1}. segítség:</strong> ${wordObject.hints[hintIndex]}`;
                p.dataset.hintId = hintId;
                if (!hintDisplayArea.querySelector(`[data-hint-id="${hintId}"]`)) {
                    hintDisplayArea.appendChild(p);
                }
            }
        }
        
        function renderAllRevealedHints() {
            const revealed = gameData.revealedHints[gameData.currentWordIndex] || [];
            revealed.forEach(hintId => {
                if (hintId.startsWith('text')) {
                    renderHint(hintId);
                }
            });
        }
        
        function showEndMessage() {
            const wordObject = wordData[gameData.hourlySet[gameData.currentWordIndex]];
            const progress = gameData.progress[gameData.currentWordIndex];
            let message = '';
            if (progress === 'solved') {
                message = `🎉 Ügyes! A helyes szó: <strong>${wordObject.word}</strong>. 🎉`;
            } else if (progress === 'failed') {
                message = `Sajnos nem sikerült. A megoldás: <strong>${wordObject.word}</strong>.`;
            }
            gameEndMessageEl.innerHTML = message;
        }

        function submitGuess() {
            const wordObject = wordData[gameData.hourlySet[gameData.currentWordIndex]];
            if (gameData.currentCol !== wordObject.word.length) return;
            const guess = Array.from(document.getElementById(`row-${gameData.currentRow}`).children).map(cell => cell.querySelector('.cell-front').textContent).join('');
            flipRow(guess, wordObject.word.toUpperCase());
            if (guess === wordObject.word.toUpperCase()) {
                clearInterval(timerInterval);
                gameData.isGameOver = true; 
                gameData.progress[gameData.currentWordIndex] = 'solved';
                requestHintButton.disabled = true;
                setTimeout(() => { 
                    showEndMessage();
                    checkForBonusGameUnlock();
                }, wordObject.word.length * 150);
            } else {
                gameData.currentRow++;
                if (gameData.currentRow >= MAX_GUESSES) {
                    clearInterval(timerInterval);
                    failWord();
                } else {
                    gameData.currentCol = 0;
                }
            }
            saveGame();
            renderWordTracker();
        }
        
        function flipRow(guess, targetWord) {
            const targetLetters = targetWord.split(''); const guessLetters = guess.split('');
            const letterStates = Array(targetWord.length).fill('absent'); const usedTargetIndexes = new Set();
            guessLetters.forEach((letter, index) => { if (letter === targetLetters[index]) { letterStates[index] = 'correct'; usedTargetIndexes.add(index); }});
            guessLetters.forEach((letter, index) => {
                if (letterStates[index] !== 'correct') {
                    const presentIndex = targetLetters.findIndex((l, i) => l === letter && !usedTargetIndexes.has(i));
                    if (presentIndex !== -1) { letterStates[index] = 'present'; usedTargetIndexes.add(presentIndex); }
                }
            });
            const rowEl = document.getElementById(`row-${gameData.currentRow}`);
            for (let i = 0; i < targetWord.length; i++) {
                const cell = rowEl.children[i];
                setTimeout(() => {
                    cell.querySelector('.cell-back').textContent = guessLetters[i];
                    cell.querySelector('.cell-back').classList.add(letterStates[i]);
                    cell.classList.add('flip'); updateKeyboard(guessLetters[i], letterStates[i]);
                }, i * 150);
            }
        }
        
        function updateKeyboard(letter, state) {
            const key = document.querySelector(`.key[data-key="${letter}"]`); if (!key) return;
            const priorities = { 'correct': 3, 'present': 2, 'absent': 1 };
            const currentClass = key.classList.contains('correct') ? 'correct' : key.classList.contains('present') ? 'present' : 'absent';
            if (!currentClass || priorities[state] > (priorities[currentClass] || 0)) {
                key.classList.remove('correct', 'present', 'absent'); key.classList.add(state);
            }
        }
        
        function checkForNewHour() {
            if (newSetOverlay.classList.contains('visible')) return;
            const currentSeed = getCurrentHourSeed();
            if (gameData.seed && currentSeed !== gameData.seed) {
                newSetOverlay.classList.add('visible');
            }
        }

        function handleStartTimerClick() {
            const currentIndex = gameData.currentWordIndex;
            if (gameData.isTimerRunning[currentIndex] || gameData.isGameOver) return;
            gameData.isTimerRunning[currentIndex] = true;
            startTimerButton.style.display = 'none';
            requestHintButton.disabled = false;
            startTimer(gameData.timers[currentIndex]);
            saveGame();
        }
        
        function handleRequestHintClick() {
            if (gameData.isGameOver || !gameData.isTimerRunning[gameData.currentWordIndex]) return;
            
            gameData.timers[gameData.currentWordIndex] -= 60;
            if (gameData.timers[gameData.currentWordIndex] < 0) {
                gameData.timers[gameData.currentWordIndex] = 0;
            }
            updateTimerDisplay(gameData.timers[gameData.currentWordIndex]);
            if(gameData.timers[gameData.currentWordIndex] <= 0) {
                failWord();
                return;
            }

            const revealedHints = gameData.revealedHints[gameData.currentWordIndex];
            const wordHints = wordData[gameData.hourlySet[gameData.currentWordIndex]].hints;
            let action = null;
            let hintId = null;

            if (!revealedHints.includes('text1')) {
                hintId = 'text1';
            } else if (wordHints[1] && !revealedHints.includes('text2')) {
                hintId = 'text2';
            } else if (wordHints[2] && !revealedHints.includes('text3')) {
                hintId = 'text3';
            } else {
                action = () => revealRandomLetter();
            }

            if (hintId) {
                 action = () => renderHint(hintId);
                 if (!revealedHints.includes(hintId)) {
                    revealedHints.push(hintId);
                }
            }

            if (action) {
                showHintAlert(action);
            }
            saveGame();
        }

       function checkForBonusGameUnlock() {
    const allSolved = gameData.progress.every(p => p === 'solved');
    unlockBonusButton.style.display = 'block'; // A gomb mindig látható lesz

    if (allSolved && !gameData.bonusPlayed) {
        unlockBonusButton.disabled = false; // Kattinthatóvá tesszük
        unlockBonusButton.style.cursor = 'pointer';
        unlockBonusButton.style.opacity = '1';
    } else {
        unlockBonusButton.disabled = true; // Nem kattinthatóvá tesszük
        unlockBonusButton.style.cursor = 'not-allowed';
        unlockBonusButton.style.opacity = '0.5';
    }
}

        function initBonusGame() {
            unlockBonusButton.style.display = 'none';
            gameData.bonusPlayed = true;
            saveGame();

            const puzzleIndex = getCurrentHourSeed() % bonusPuzzles.length;
            const puzzle = bonusPuzzles[puzzleIndex];
            
            bonusGridContainer.innerHTML = '';
            bonusCluesContainer.innerHTML = '';

            for (let r = 0; r < 5; r++) {
                for (let c = 0; c < 5; c++) {
                    if (puzzle.grid[r][c]) {
                        const input = document.createElement('input');
                        input.type = 'text';
                        input.maxLength = 1;
                        input.classList.add('bonus-cell');
                        input.dataset.r = r;
                        input.dataset.c = c;
                        bonusGridContainer.appendChild(input);
                    } else {
                        const div = document.createElement('div');
                        div.classList.add('empty-cell');
                        bonusGridContainer.appendChild(div);
                    }
                }
            }

            puzzle.preFilled.forEach(cell => {
                const input = bonusGridContainer.querySelector(`input[data-r="${cell.r}"][data-c="${cell.c}"]`);
                if(input) {
                    input.value = cell.char;
                    input.disabled = true;
                    input.classList.add('pre-filled');
                }
            });

            puzzle.words.forEach(word => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${word.num}. ${word.dir}:</strong> ${word.clue}`;
                bonusCluesContainer.appendChild(li);
            });

            checkBonusButton.style.display = 'block';
            closeBonusButton.style.display = 'none';
            bonusGameOverlay.classList.add('visible');
            startBonusTimer();
        }
        
        function startBonusTimer() {
            let timeLeft = 120;
            clearInterval(bonusTimerInterval);
            bonusTimerDisplay.textContent = '02:00';
            
            bonusTimerInterval = setInterval(() => {
                timeLeft--;
                const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
                const seconds = (timeLeft % 60).toString().padStart(2, '0');
                bonusTimerDisplay.textContent = `${minutes}:${seconds}`;

                if (timeLeft <= 0) {
                    clearInterval(bonusTimerInterval);
                    endBonusGame(true);
                }
            }, 1000);
        }

        function endBonusGame(isTimeUp = false) {
            clearInterval(bonusTimerInterval);
            const puzzleIndex = getCurrentHourSeed() % bonusPuzzles.length;
            const puzzle = bonusPuzzles[puzzleIndex];
            
            bonusGridContainer.querySelectorAll('.bonus-cell:not(.pre-filled)').forEach(input => {
                const r = parseInt(input.dataset.r);
                const c = parseInt(input.dataset.c);
                const correctChar = puzzle.grid[r][c];
                const userChar = input.value.toUpperCase();

                if (userChar === correctChar) {
                    input.classList.add('correct');
                } else {
                    input.classList.add('incorrect');
                    input.value = correctChar;
                }
                input.disabled = true;
            });
            
            checkBonusButton.style.display = 'none';
            closeBonusButton.style.display = 'block';
        }

        settingsButton.addEventListener('click', () => {
            paletteContainer.style.display = paletteContainer.style.display === 'block' ? 'none' : 'block';
        });
        document.addEventListener('click', (event) => {
            if (settingsButton && !settingsButton.contains(event.target) && paletteContainer && !paletteContainer.contains(event.target)) {
                paletteContainer.style.display = 'none';
            }
        });
        refreshButton.addEventListener('click', () => location.reload());
        unlockBonusButton.addEventListener('click', initBonusGame);
        checkBonusButton.addEventListener('click', () => endBonusGame(false));
        closeBonusButton.addEventListener('click', () => {
            bonusGameOverlay.classList.remove('visible');
        });

        startTimerButton.addEventListener('click', handleStartTimerClick);
        requestHintButton.addEventListener('click', handleRequestHintClick);
        document.addEventListener('keydown', (e) => handleKeyPress(e.key));
        
        initPalette();
        initGame();
    });
    </script>
</body>
</html>