/*------------------
Fase di preparazione
------------------- */

// Recuperare dalla pagina tutti gli elementi di interesse
const scoreCounter = document.querySelector('.score-counter');
const grid = document.querySelector('.grid');
const endGameScreen = document.querySelector('.end-game-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainButton = document.querySelector('.play-again');

// Prepararmi delle informazion i che sono utili alla logica del gioco
const totalCells = 100;
const totalBombs = 16;
const maxScore = totalCells - totalBombs;
const bombsList = [];
const totalTreasures = 1;
const treasureList = [];
let score = 0;
let isEnd = false;
let isShow = true;

// Generare TOT bombe casuali
while (bombsList.length < totalBombs) {
    const number = Math.floor(Math.random() * totalCells) + 1;
    if (!bombsList.includes(number)) bombsList.push(number);
}

// Generazione delle posizioni dei tesori
while (treasureList.length < totalTreasures) {
    const number = Math.floor(Math.random() * totalCells) + 1;
    if (!treasureList.includes(number) && !bombsList.includes(number)) {
        treasureList.push(number);
    }
}

/*-------------------
GRIGLIA E LOGICA DI GIOCO
---------------------*/

let isCellEven = false;
let isRowEven = false;

for (let i = 1; i <= 100; i++) {
    // Creo un elemento e gli do la classe 'cell'
    const cell = document.createElement('div');
    cell.classList.add('cell');
    // cell.innerText = 1;
    isCellEven = i % 2 === 0;

    // Se la riga è pari e la cella è pari: casella grigia
    // Se a riga è dispari e la cella è dispari: casella grigia
    if (isRowEven && isCellEven) cell.classList.add('cell-dark');
    else if (!isRowEven && !isCellEven) cell.classList.add('cell-dark');

    // Se sono alla fine della riga ... |
    if (i % 10 === 0) isRowEven = !isRowEven;

    // # Gestiamo il click della cella
    cell.addEventListener('click', function () {
        if (isShow === true) {
            if (cell.classList.contains('cell-clicked')) return;

            if (bombsList.includes(i)) {
                cell.classList.add('cell-bomb');
                endGame(false);
            } else if (treasureList.includes(i)) {
                // La cella è un tesoro
                cell.classList.add('cell-treasure');
                scoreCounter.innerText = String(99999)
                endGame(true);
            } else {
                cell.classList.add('cell-clicked');
                updateScore();
            }
        }
    });
    // Lo inserisco nella griglia
    grid.appendChild(cell);
}



/*------------------
FUNZIONI
-------------------*/

// Funzione per aggiornare il punteggio
function updateScore() {

    // Incremento lo score
    score++;

    // Lo inserisco nel contatore
    scoreCounter.innerText = String(score).padStart(5, 0);

    // Controlliamo se l'utente ha vinto
    if (score === maxScore) endGame(true);
}

// Funzione per decretare la fine del gioco
function endGame(isVictory) {
    if (isVictory == true) {

        // Coloriamo di verde e cambiamo il messaggio
        endGameScreen.classList.add('win');
        endGameText.innerHTML = 'SHIBA<br>WIN';
    }

    // Rileviamo le bombe, in caso di vittoria o sconfitta
    revealAllBombs();

    // Mostriamo la schermata rimuovendo la classe
    endGameScreen.classList.remove('hidden')
}

// Funzione per ricaricare la pagina
function playAgain() {
    location.reload();
}

// Funzione che rivela tutte le bombe
function revealAllBombs() {

    // Recupero tutte le celle
    const cells = document.querySelectorAll('.cell')
    for (let i = 1; i <= cells.length; i++) {

        // Controllo se la cella è una bomba
        if (bombsList.includes(i)) {
            const cellToReveal = cells[i - 1];
            cellToReveal.classList.add('cell-bomb');
        }
    }
}

/*-------------------------------
EVENTI
--------------------------------*/
// Gestiamo il click sul tasto Gioca ancora
playAgainButton.addEventListener('click', playAgain);