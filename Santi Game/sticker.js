const grid = document.querySelector('.grid');
const stackButton = document.querySelector('.stack');
const scoreCounter = document.querySelector('.score-counter');

const endGameScreen = document.querySelector('.end-game-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainButton = document.querySelector('.play-again');



// 0 - Cella vuota
// 1 - Barra
const gridMatrix = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0],
];

let currentRowIndex = gridMatrix.length - 1;
let barDirection = 'right';
let barSize = 3;
let isGameOver = false;
let score = 0;
let t;

function draw() {
    grid.innerHTML = '';
    gridMatrix.forEach(function (rowContent, rowIndex) {
        rowContent.forEach(function (cellContent, cellIndex) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            // cell.innerText = cellContent --> Serve per vedere la riproduzione di numeri sopra all'interno del nostro tabellone
            const isRowEven = rowIndex % 2 === 0;
            const isCellEven = cellIndex % 2 === 0;
            if ((isRowEven && isCellEven) || (!isRowEven && !isCellEven)) {
                cell.classList.add('cell-dark');
            };
            if (cellContent === 1) {
                cell.classList.add('bar')
            }
            grid.appendChild(cell);
        })
    });
}

function moveRight(row) {
    row.pop();
    row.unshift(0);
}

function moveLeft(row) {
    row.shift();
    row.push(0);
}

function isRightEdge(row) {
    const lastElement = row[row.length - 1];
    return lastElement === 1;
}

function isLeftEdge(row) {
    const firstElement = row[0];
    return firstElement === 1;
}

function moveBar() {
    const currentRow = gridMatrix[currentRowIndex];
    if (barDirection === 'right') {
        moveRight(currentRow);
        if (isRightEdge(currentRow)) {
            barDirection = 'left';
        }
    } else if (barDirection === 'left') {
        moveLeft(currentRow);
        if (isLeftEdge(currentRow)) {
            barDirection = 'right';
        }
    }
}

function checkLost() {
    const currentRow = gridMatrix[currentRowIndex];
    const prevRow = gridMatrix[currentRowIndex + 1];
    if (!prevRow) return;
    for (let i = 0; i < currentRow.length; i++) {
        if (currentRow[i] === 1 && prevRow[i] === 0) {
            currentRow[i] = 0;
            barSize--;
        }
    }

    if (barSize === 0) {
        isGameOver = true;
        clearInterval(t);
        scoreCounter.innerText = '00000';
        endGame(false);
    }
}

function checkWin() {
    if (currentRowIndex === 0) {
        isGameOver = true;
        clearInterval(t);
        endGame(true);
    }
}

function onStack() {
    // Check lost
    checkLost();
    // Check win
    checkWin();

    updateScore();

    if (isGameOver) return;
    // Cambio riga
    currentRowIndex--;
    barDirection = 'right';
    for (let i = 0; i < barSize; i++) {
        gridMatrix[currentRowIndex][i] = 1;
    }
}

function updateScore() {
    // Lo score viene aumentato solo dalle righe impilate
    // score++;
    // scoreCounter.innerText = score.toString().padStart(5, '0');

    // Controlliamo il numero di blocchi impilati per aumentare lo score
    // Lo score viene aumentato da tutti blocchi rimasti
    const finalBlock = document.querySelectorAll('.bar');
    scoreCounter.innerText = finalBlock.length.toString().padStart(5, '0');
}

function endGame(isVictory) {
    if (isVictory == true) {

        // Coloriamo di verde e cambiamo il messaggio
        endGameScreen.classList.add('win');
        endGameText.innerHTML = 'YOU<br>WIN';
    }

    // Mostriamo la schermata rimuovendo la classe
    endGameScreen.classList.remove('hidden')
}

draw();

function main() {
    // Update della posizione della barra
    moveBar();
    // Disegno dell'interfaccia
    draw();
}

t = setInterval(main, 600);

stackButton.addEventListener('click', onStack);

playAgainButton.addEventListener('click', function () {
    location.reload();
});

