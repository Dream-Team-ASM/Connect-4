const ROWS = 6
const COLS = 7
let player = 'red';
let player_names = []
var game = document.querySelector('#game');
var board = document.createElement('div');
board.id = 'board';
var current_player = '';
var time_elapsed = 0;
var timer;//time interval
var isGameOver = false;
const gameTimer = document.createElement('div');

function createGrid() {
    if(current_player === '')
        current_player = player_names[0];
    
    const player_title = document.createElement('div');
    player_title.classList.add('player-title');
    
    var player = document.createElement('p');
    player.classList.add('player');
    player.textContent = current_player + "'s Turn";
    
    player_title.append(player);
    game.append(player_title);
    
    for(let col = 0; col < ROWS; col++) {
        const col_div = document.createElement('div');
        col_div.classList.add('col');
        for(let row = 0; row < COLS; row++) {
            var row_div = document.createElement('div');
            row_div.classList.add('row','empty');
            row_div.setAttribute('data-col', col);
            row_div.setAttribute('data-row', row);
            col_div.append(row_div); 
        }
        board.append(col_div);
        game.append(board);
    }
    gameTimer.classList.add('game-timer');
    game.append(gameTimer);
    startTimer();
}

function tick() {
    time_elapsed++;
    var remain = time_elapsed;
    var mins = Math.floor(remain / 60);
    remain -= mins * 60;
    var secs = remain;

    mins = (mins < 10) ? `0${mins}` : mins;//Time is a string 10 < add a 0 before
    secs = (secs < 10) ? `0${secs}` : secs; 
    gameTimer.innerHTML = mins + ":" + secs;
}

function startTimer() {
    timer = setInterval(tick, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function setupEventListeners() {
    const cols = document.querySelectorAll('.col');

    function findLastEmptyCell(col) {
        const cells = col.querySelectorAll('.row');
        for(let i = cells.length - 1; i >= 0; i--) 
            if(cells[i].classList.contains('empty')) 
                return cells[i];
        return null;
    }
    
    cols.forEach(col => {
        col.addEventListener('mouseenter', () => {
            if(isGameOver) return;
            const lastEmptyCell = findLastEmptyCell(col);
            if(lastEmptyCell != null)
                lastEmptyCell.classList.add(`next-${player}`);
        });

        col.addEventListener('mouseleave', () => {
            if(document.querySelector('.next-black') != null)
                document.querySelector('.next-black').classList.remove('next-black');
            if(document.querySelector('.next-red') != null)
                document.querySelector('.next-red').classList.remove('next-red');
        });

        col.addEventListener('click', () => {
            if(isGameOver) return;
            const lastEmptyCell = findLastEmptyCell(col);
            if(lastEmptyCell != null) {
                lastEmptyCell.classList.remove('empty');
                lastEmptyCell.classList.add(`${player}`);
                lastEmptyCell.setAttribute(`data-player`, player);

                if(horizontalCheck() || verticalCheck() || diagonalCheck1() || diagonalCheck2()) {
                    isGameOver = true;
                    stopTimer();
                    alert(`Game Over! Player ${current_player} has won!`);
                } 

                player = (player == 'red') ? 'black' : 'red';
                current_player = (current_player === player_names[0]) ? player_names[1] : player_names[0];
                document.querySelector('.player').textContent =  current_player + "'s Turn";;
                col.dispatchEvent(new Event('mouseenter'));
            }
        });
    });
}

// ----------------------------------------------------------------------
//        CHECK FUNCTION NEEDS TO BE RE-DONE. IT STARTS HERE
// ----------------------------------------------------------------------
function colorMatchCheck(one, two, three, four) {
    return(one === two && one === three && one == four && one !== null);
}

function horizontalCheck() {
    for(let row = 0; row < ROWS + 1; row++) {
        for(let col = 0; col < 3; col++) {
            if(colorMatchCheck(
                document.querySelector(`.row[data-col='${col}'][data-row='${row}']`).getAttribute('data-player'),
                document.querySelector(`.row[data-col='${col + 1}'][data-row='${row}']`).getAttribute('data-player'),
                document.querySelector(`.row[data-col='${col + 2}'][data-row='${row}']`).getAttribute('data-player'),
                document.querySelector(`.row[data-col='${col + 3}'][data-row='${row}']`).getAttribute('data-player')
            )) {
                return true;
            }
        }
    }
}

function verticalCheck() {
    for(let col = 0; col < COLS - 1; col++) {
        for(let row = 0; row < 4; row++) {
            if(colorMatchCheck(
                document.querySelector(`.row[data-col='${col}'][data-row='${row}']`).getAttribute('data-player'),
                document.querySelector(`.row[data-col='${col}'][data-row='${row + 1}']`).getAttribute('data-player'),
                document.querySelector(`.row[data-col='${col}'][data-row='${row + 2}']`).getAttribute('data-player'),
                document.querySelector(`.row[data-col='${col}'][data-row='${row + 3}']`).getAttribute('data-player')
            )) {
                return true;
            }
        }
    }
}

function diagonalCheck1() {
    for(let col = 0; col < 3; col++) {
        for(let row = 0; row < 4; row++) {
            if(colorMatchCheck(
                document.querySelector(`.row[data-col='${col}'][data-row='${row}']`).getAttribute('data-player'),
                document.querySelector(`.row[data-col='${col + 1}'][data-row='${row + 1}']`).getAttribute('data-player'),
                document.querySelector(`.row[data-col='${col + 2}'][data-row='${row + 2}']`).getAttribute('data-player'),
                document.querySelector(`.row[data-col='${col + 3}'][data-row='${row + 3}']`).getAttribute('data-player')
            )) {
                return true;
            }
        }
    }
}

function diagonalCheck2() {
    for(let col = 0; col < 3; col++) {
        for(let row = 6; row > 2; row--) {
            if(colorMatchCheck(
                document.querySelector(`.row[data-col='${col}'][data-row='${row}']`).getAttribute('data-player'),
                document.querySelector(`.row[data-col='${col + 1}'][data-row='${row - 1}']`).getAttribute('data-player'),
                document.querySelector(`.row[data-col='${col + 2}'][data-row='${row - 2}']`).getAttribute('data-player'),
                document.querySelector(`.row[data-col='${col + 3}'][data-row='${row - 3}']`).getAttribute('data-player')
            )) {
                return true;
            }
        }
    }
}

// ----------------------------------------------------------------------
//        CHECK FUNCTION NEEDS TO BE RE-DONE. IT ENDS HERE
// ----------------------------------------------------------------------

function createForm(player_number) {
    form = `<div>
        <p class=''>Enter Player's ${player_number} Name:</p>
        <input id='name' type='text' />
        <input id='submit' type='submit' value='submit' />    
    </div>
    `;
    
    game.innerHTML = form;
    const submit = document.getElementById('submit');
    submit.onclick = function() {
        const name = document.getElementById('name').value;
        if(name !== '') {
            player_names.push(name);
            game.innerHTML = '';
            
            if(player_number == 1)
                createForm(2);
            else {  
                createGrid();
                setupEventListeners();
            }
            return;
        }
    }   
}


// this is where everything starts
createForm(1);