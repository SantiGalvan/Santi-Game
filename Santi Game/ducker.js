//*-----------------------
//* FASE DI PREPARAZIONE
//*-----------------------

// Raccogliamo tutti gli elementi di nostro interesse dalla pagina
const grid = document.querySelector('.grid');
const scoreCounter = document.querySelector('.score-counter');
const endGameScreen = document.querySelector('.end-game-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainButton = document.querySelector('.play-again');

// Creiamo la matrice per la nostra griglia
const gridMatrix = [
    ['', '', '', '', '', '', '', '', ''],
    ['river', 'wood', 'wood', 'river', 'wood', 'river', 'river', 'river', 'river'],
    ['river', 'river', 'river', 'wood', 'wood', 'river', 'wood', 'wood', 'river'],
    ['', '', '', '', '', '', '', '', ''],
    ['road', 'bus', 'road', 'road', 'road', 'car', 'road', 'road', 'road'],
    ['road', 'road', 'road', 'car', 'road', 'road', 'road', 'road', 'bus'],
    ['road', 'road', 'car', 'road', 'road', 'road', 'bus', 'road', 'road'],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '']
];

// Preaparo alcune informazioni utili alla logica di gioco
const victoryRow = 0;
const riverRows = [1, 2];
const roadRows = [4, 5, 6,];
const duckPosition = { y: 8, x: 4 };
let contentBeforeDuck = '';
let time = 15;
let isGameOver = false;

/*----------------------------
FUNZIONI DI GIOCO
-----------------------------*/

// Funzione per disegnare la scacchiera
function applyCellStyle(cell, rowIndex, cellIndex) {
    const isRowEven = rowIndex % 2 === 0;
    const isCellEven = cellIndex % 2 === 0;
    if (isRowEven && isCellEven) cell.classList.add('cell-dark');
    else if (!isRowEven && !isCellEven) cell.classList.add('cell-dark');
}


// Funzione che disegna la nostra griglia
function drawGrid() {

    // !! Ripulire i contenuti precedenti
    grid.innerHTML = '';

    // Per ogni riga
    gridMatrix.forEach(function (rowCells, rowIndex) {

        // Per ogni cella
        rowCells.forEach(function (cellContent, cellIndex) {

            // Creare una cella
            const cell = document.createElement('div');
            cell.classList.add('cell');

            // Inserisco una classe con lo stesso nome del contenuto della cella
            if (cellContent !== '') cell.classList.add(cellContent);

            // Andiamo a colorare le righe in maniera appropiata (fiume, strada e scacchiera)
            if (riverRows.includes(rowIndex)) {
                cell.classList.add('river');
            } else if (roadRows.includes(rowIndex)) {
                cell.classList.add('road');
            } else {

                // Creaiamo la scacchiera con una funzione
                applyCellStyle(cell, rowIndex, cellIndex);

                // Creiamo le celle a scacchiera direttamente dentro l'if
                // const isRowEven = rowIndex % 2 === 0;
                // const isCellEven = cellIndex % 2 === 0;
                // if (isRowEven && isCellEven) cell.classList.add('cell-dark');
                // else if (!isRowEven && !isCellEven) cell.classList.add('cell-dark');
            }

            // Inserisco la cella nella griglia
            grid.appendChild(cell);
        })
    })
}

// Funzione per piazzare la paperella
function placeDuck() {

    // Prima di piazzarla mi segno cosa c'era nella casella 
    contentBeforeDuck = gridMatrix[duckPosition.y][duckPosition.x];

    // Dopo, ci metto la paperella
    gridMatrix[duckPosition.y][duckPosition.x] = 'duck';
}

// Funzione per muovere la paperella
function moveDuck(event) {

    // Nella cella precedente rimetto il valore originale
    gridMatrix[duckPosition.y][duckPosition.x] = contentBeforeDuck;

    // Muovo la paperella
    switch (event.key) {
        case 'ArrowUp':
            if (duckPosition.y > 0) duckPosition.y--;
            break;
        case 'ArrowDown':
            if (duckPosition.y < 8) duckPosition.y++;
            break;
        case 'ArrowLeft':
            if (duckPosition.x > 0) duckPosition.x--;
            break;
        case 'ArrowRight':
            if (duckPosition.x < 8) duckPosition.x++;
            break;
        default:
            return;
    }

    drawElements();
}

// Funzione per ridisegnare la griglia e la paperella
function drawElements() {
    placeDuck();
    checkDuckPosition();
    drawGrid();
}

// Funzione per terminare la partita
function endGame(reason) {
    if (reason === 'duck-arrived') {
        endGameScreen.classList.add('win');
        endGameText.innerHTML = 'YOU<br>WIN';
    }

    // Blocco lo spostamento degli elementi
    clearInterval(renderingLoop);

    // Blocco il conto alla rovescia
    clearInterval(countdown);

    // Blocchiamo l'ascolto sui tasti
    document.removeEventListener('keyup', moveDuck);

    // Assegnamo la classe appropriata
    gridMatrix[duckPosition.y][duckPosition.x] = reason;

    // Mostriamo la schermata di fine gioco
    endGameScreen.classList.remove('hidden');

    // Metto il focus sul bottone
    playAgainButton.focus();

    // Mi appunto che ho perso
    isGameOver = true;
}

// Funzione per controllare la posizione della paperella
function checkDuckPosition() {
    if (duckPosition.y === victoryRow) endGame('duck-arrived');
    else if (contentBeforeDuck === 'river') endGame('duck-drowned');
    else if (contentBeforeDuck === 'bus' || contentBeforeDuck === 'car') endGame('duck-hit');
}

// Funzione per muovere una riga
function moveRow(rowIndex) {

    // Recupero tutte le celle di una riga
    const rowCells = gridMatrix[rowIndex];

    // Tolgo l'ultima cella e la metto da parte
    const lastCell = rowCells.pop();

    // La rimetto all'inizio
    rowCells.unshift(lastCell);
}

// Funzione che muove una riga verso dietro
function moveRowBack(rowIndex) {

    // Recupero tutte le celle di una riga
    const rowCells = gridMatrix[rowIndex];

    // Tolgo la prima cella e la metto da parte
    const firstCell = rowCells.shift();

    // La aggiungo alla fine
    rowCells.push(firstCell);
}


// Funzione che si preoccupa di spostare correttamente la paperella
function handleDuckPosition() {
    gridMatrix[duckPosition.y][duckPosition.x] = contentBeforeDuck;

    // Se la paperella si trova sopra un tronco e prima dell'estremo destra, allora la paperella si muove con il tronco
    // if (contentBeforeDuck === 'wood' && duckPosition.x < 8) duckPosition.x++; <-- Con due righe in moto diverso questa parte cambia

    // Modo corretto se hai 2 righe che vanno in sensi diversi
    if (contentBeforeDuck === 'wood') {

        // Se sono nella prima riga e non alla fine, sposta a destra
        if (duckPosition.y === 1 && duckPosition.x < 8) duckPosition.x++;

        // Se sono nella seconda e non all'inizio, sposta a sinistra
        else if (duckPosition.y === 2 && duckPosition.x > 0) duckPosition.x--;
    }
    contentBeforeDuck = gridMatrix[duckPosition.y][duckPosition.x];
}

// Funzione per decrementare il tempo
function reduceTime() {
    time--;
    scoreCounter.innerText = String(time).padStart(5, 0);
    if (time === 0) endGame('time-up');
}

/*---------------------
SVOLGIMENTO DEL GIOCO
---------------------*/
const renderingLoop = setInterval(function () {
    handleDuckPosition();
    moveRow(1);
    moveRowBack(2);
    moveRow(4);
    moveRow(5);
    moveRow(6);
    drawElements();
}, 600);

const countdown = setInterval(reduceTime, 1000);

/*-------------------
EVENTI
--------------------*/

// Evento per ascoltare la pressione dei tasti
document.addEventListener('keyup', moveDuck);

// Evento per ascoltare il click sul bottono rigioca
playAgainButton.addEventListener('click', function () {
    window.location.reload();
});

// Evento per terminare la partita
document.addEventListener('keyup', function (event) {
    if (event.key === ' ' && isGameOver === true) window.location.reload();
});