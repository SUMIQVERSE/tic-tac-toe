const board = document.getElementById('board');
const statusText = document.getElementById('status');
const floatingMsg = document.getElementById('floating-msg');

let cells = Array(9).fill('');
let currentPlayer = 'X';
let gameOver = false;
let gameMode = null;
let difficulty = null;


// Attach listeners ONLY after DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('replay').addEventListener('click', () => {
    setupGame(); // restart same mode & difficulty
    });

    document.getElementById('home').addEventListener('click', () => {
    document.getElementById('menu').style.display = 'block';
    document.getElementById('level-select').style.display = 'none';
    document.getElementById('game-area').style.display = 'none';
    });
});

function chooseMode(mode) {
    gameMode = mode;
    if (mode === 'single') {
    document.getElementById('level-select').style.display = 'block';
    } else {
    startGame(); // multiplayer
    }
}

function startGame(level = null) {
    difficulty = level;
    document.getElementById('menu').style.display = 'none';
    document.getElementById('level-select').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
    setupGame();
}

function setupGame() {
    board.innerHTML = '';
    cells = Array(9).fill('');
    currentPlayer = 'X';
    gameOver = false;
    statusText.textContent = `Player ${currentPlayer}'s turn`;

    for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleClick);
    board.appendChild(cell);
    }
}

function handleClick(e) {
    const index = e.target.dataset.index;

    if (cells[index] !== '' || gameOver) return;

    cells[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add('taken');

    if (checkGameOver(currentPlayer)) return;

    if (gameMode === 'single') {
    currentPlayer = 'O';
    statusText.textContent = `Computer's turn...`;

    setTimeout(() => {
        aiMove();
    }, 300);
    } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function aiMove() {
    let move;
    if (difficulty === 'easy') {
    move = getRandomMove();
    } else if (difficulty === 'medium') {
    move = Math.random() < 0.5 ? getRandomMove() : getBestMove();
    } else {
    move = getBestMove();
    }

    cells[move] = 'O';  //ngnghghghf
    const cell = document.querySelector(`.cell[data-index='${move}']`);
    cell.textContent = 'O';
    cell.classList.add('taken');

    checkGameOver('O');
    if (!gameOver) {
    currentPlayer = 'X';
    statusText.textContent = `Your turn`;
    }
}

function getRandomMove() {
    const empty = cells.map((val, idx) => val === '' ? idx : null).filter(v => v !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
    if (cells[i] === '') {
        cells[i] = 'O';
        let score = minimax(cells, 0, false);
        cells[i] = '';
        if (score > bestScore) {
        bestScore = score;
        move = i;
        }
    }
    }
    return move;
}

function minimax(boardState, depth, isMaximizing) {
    if (checkWin('O')) return 10 - depth;
    if (checkWin('X')) return depth - 10;
    if (boardState.every(cell => cell !== '')) return 0;

    if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
        if (boardState[i] === '') {
        boardState[i] = 'O';
        best = Math.max(best, minimax(boardState, depth + 1, false));
        boardState[i] = '';
        }
    }
    return best;
    } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
        if (boardState[i] === '') {
        boardState[i] = 'X';
        best = Math.min(best, minimax(boardState, depth + 1, true));
        boardState[i] = '';
        }
    }
    return best;
    }
}

function checkWin(player) {
    const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
    ];
    return winPatterns.some(pattern =>
    pattern.every(i => cells[i] === player)
    );
}

function checkGameOver(player) {
    if (checkWin(player)) {
    const msg = gameMode === 'single'
        ? (player === 'X' ? "🎉 You Win!" : "💻 Computer Wins!")
        : `🎉 Player ${player} Wins!`;
    showFloatingMessage(msg);
    statusText.textContent = msg;
    gameOver = true;
    return true;
    } else if (cells.every(cell => cell !== '')) {
    showFloatingMessage("😐 It's a Draw!");
    statusText.textContent = "It's a Draw!";
    gameOver = true;
    return true;
    }
    return false;
}

function showFloatingMessage(text) {
    floatingMsg.textContent = text;
    floatingMsg.style.display = 'block';
    setTimeout(() => {
    floatingMsg.style.display = 'none';
    }, 1000);
}