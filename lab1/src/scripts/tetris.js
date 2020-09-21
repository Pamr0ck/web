//todo
// рестарт
// рекроды
// пауза
// счет за фигуры
// gitignore

// получаем доступ к холсту
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const nextCanvas = document.getElementById('next');
const nextContext = nextCanvas.getContext('2d');
const grid = 32; //px
const ROW = 20;
const COL = 10;
// массив с последовательностями фигур, на старте — пустой
let tetrominoSequence = [];
let playfield = [];  // размер поля — 10 на 20, и несколько строк ещё находится за видимой областью
// заполняем пустыми
for (let row = -2; row < ROW; row++){
    playfield[row] = [];
    for (let col = 0; col < COL; col++){
        playfield[row][col] = 0;
    }
}

let difficult = 35;
let score = 0;
let lvl = 1;
let koef = 0.9;
let lines = 0;
// задаем формы
const tetrominos = {
    'I':[
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],
    'J': [
        [1,0,0],
        [1,1,1],
        [0,0,0],
    ],
    'L': [
        [0,0,1],
        [1,1,1],
        [0,0,0],
    ],
    'O': [
        [1,1],
        [1,1],
    ],
    'S': [
        [0,1,1],
        [1,1,0],
        [0,0,0],
    ],
    'Z': [
        [1,1,0],
        [0,1,1],
        [0,0,0],
    ],
    'T': [
        [0,1,0],
        [1,1,1],
        [0,0,0],
    ]
};

//цвета фигур
const colors = {
    'I': 'cyan',
    'O': 'yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
};

// счетчик
let count = 0;
// следующая фигура

let currTetromino = getNextTetromino();
let nextTetromino = getNextTetromino();
// следим за кадрами анимации, чтобы если что — остановить игру
let rAF = null;
// флаг конца игры, на старте — неактивный
let gameOver = false;

// random
// https://stackoverflow.com/a/1527820/2124254

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//создаем псевдослучайную очередь из фигур, каждая по одному разу???
function  generateSequence(){
    const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    // const sequence = ['I'];
    while (sequence.length){
        let rand = getRandomInt(0, sequence.length-1);
        let name = sequence.splice(rand,1)[0];
        // let name = sequence[rand];
        tetrominoSequence.push(name);
    }
}
//получение фигуры
function getNextTetromino(){
    if (tetrominoSequence.length === 0)
        generateSequence();

    const name = tetrominoSequence.pop();
    const matrix = tetrominos[name]; // создаем матрицу
    // I и O стартуют с середины, остальные — чуть левее
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

    // I начинает с 21 строки (смещение -1), а все остальные — со строки 22 (смещение -2)
    const row = name === "I" ? -1 : -2;

    // вот что возвращает функция
    return {
        name: name,      // название фигуры (L, O, и т.д.)
        matrix: matrix,  // матрица с фигурой
        row: row,        // текущая строка (фигуры стартуют за видимой областью холста)
        col: col         // текущий столбец
    };
}
// поворот фигуры
// https://codereview.stackexchange.com/a/186834
function rotate(matrix){
    const N = matrix.length-1;
    return matrix.map((row, i) =>
        row.map((val, j) => matrix[N - j][i])
    );
}

// проверяем после появления или вращения, может ли матрица (фигура) быть в этом месте поля или она вылезет за его границы
function isValidMove(matrix, cellRow, cellCol) {
    // проверяем все строки и столбцы
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] && (
                // если выходит за границы поля…
                cellCol + col < 0 ||
                cellCol + col >= playfield[0].length ||
                cellRow + row >= playfield.length ||
                // …или пересекается с другими фигурами
                playfield[cellRow + row][cellCol + col])
            ) {
                // то возвращаем, что нет, так не пойдёт
                return false;
            }
        }
    }
    // а если мы дошли до этого момента и не закончили раньше — то всё в порядке
    return true;
}
// когда фигура окончательна встала на своё место
function placeTetromino(){
    for(let row  = 0; row < currTetromino.matrix.length; row++){
        for(let col  = 0; col < currTetromino.matrix[row].length; col++){
            if (currTetromino.matrix[row][col]) {
                // если край фигуры выходит за границы - game over
                if(currTetromino.row + row <= 0)
                    return  showGameOver();
                // если все в порядке - записываем в массив поля нашу фигуру
                playfield[currTetromino.row+row][currTetromino.col + col] = currTetromino.name;
            }
        }
    }
    score+=5;
    // удаление заполненных рядов снизу вверх
    let countOfRows = 0;
    for(let row = playfield.length-1; row >= 0;){
        // если ряд заполнен
        if (playfield[row].every(cell => !!cell)) {
            // очищаем его и опускаем всё вниз на одну клетку
            for (let r = row; r >= 0; r--) {
                for (let c = 0; c < playfield[r].length; c++) {
                    playfield[r][c] = playfield[r-1][c];
                }
            }
            countOfRows++;
            lines++;
        }
        else {
            // переходим к следующему ряду
            row--;
        }
    }
    switch (countOfRows){
        case 1:
            score+=100;
            break;
        case 2:
            score+=300;
            break;
        case 3:
            score+=700;
            break;
        case 4:
            score+=1500;
            break;
    }
    // получаем следующую фигуру
    currTetromino = nextTetromino;
    nextTetromino = getNextTetromino();
}

// GAMEOVER
function showGameOver(){
    // stop animation
    cancelAnimationFrame(rAF);
    // ставим флаг
    gameOver = true;
    // рисуем чёрный прямоугольник посередине поля
    context.fillStyle = 'black';
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 90);
    // пишем надпись белым моноширинным шрифтом по центру
    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '36px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
    context.font = '18px monospace';
    context.fillText('\nSCORE:'+ score, canvas.width / 2, canvas.height /2 + 40);

    let username = localStorage['tetris.username'];
    let player = {
        name: username,
        score: score
    }
    let records
    try {
        records = JSON.parse(localStorage["tetris.records"]);
    }catch (e) {
        records = [];
    }
    records.push(player);
    localStorage["tetris.records"] = JSON.stringify(records);
    setTimeout(()=>{
        window.location = "records.html";
    }, 0);
}

//обработка нажатий клавиш
document.addEventListener('keydown', function (e){
    // игра закончилась - выходим
    if(gameOver) return;
    // <- and ->

    if (e.which === 37 || e.which === 39){
        const col = e.which === 37
            // уменьшаем или увеличиваем значение столбца
            ? currTetromino.col - 1
            : currTetromino.col + 1;
        // если так ходить можно, то запоминаем текущее положение
        if (isValidMove(currTetromino.matrix, currTetromino.row, col)) {
            currTetromino.col = col;
        }
    }
    // up

    if (e.which === 38){
        // поворот
        const matrix = rotate(currTetromino.matrix);
        // если так ходить можно, то запоминаем текущее положение
        if (isValidMove(matrix, currTetromino.row, currTetromino.col)) {
            currTetromino.matrix = matrix;
        }
    }
    //down
    if (e.which === 40){
        // смещаем фигуру на строку вниз
        const row = currTetromino.row + 1;
        // если опускаться больше некуда — запоминаем новое положение
        if (!isValidMove(currTetromino.matrix, row, currTetromino.col)) {
            currTetromino.row = row - 1;
            // ставим на место и смотрим на заполненные ряды
            placeTetromino();
            return;
        }
        // запоминаем строку, куда стала фигура
        currTetromino.row = row;
    }
})
//show next figure
function showNext(){
    nextContext.clearRect(0,0,nextCanvas.width, nextCanvas.height);
    for (let row = 0; row < 5; row++){
        for (let col = 0; col < 8; col++){
            nextContext.fillStyle = '#202020';
            nextContext.fillRect(col * grid, row * grid, grid-2, grid-2);
        }
    }
    nextContext.fillStyle = colors[nextTetromino.name];
    for (let row = 0; row < nextTetromino.matrix.length; row++){
        for (let col = 0; col < nextTetromino.matrix[row].length; col++){
            if (nextTetromino.matrix[row][col]){
                nextContext.fillRect((nextTetromino.col + col-1)*grid, (nextTetromino.row + row+3)* grid, grid - 2, grid - 2 );
            }
        }
    }
}

//main loop
function loop(){
    if (score > 500 * lvl){
        lvl++;
        koef-=0.005;
        difficult = Math.floor(difficult*koef);
    }
    // if (lvl%10 === 0)
    //     koef-=0.05;
    // начинаем анимацию
    rAF = requestAnimationFrame(loop);
    // очищаем холст
    context.clearRect(0,0,canvas.width, canvas.height);
    showNext();
    updateInfo();
    // рисуем игровое поле с учетом фигур
    for (let row = 0; row < ROW; row++){
        for(let col = 0; col < COL; col++){
            if(playfield[row][col]){
                const name = playfield[row][col];
                context.fillStyle = colors[name];
                //рисуем всё на один пиксель меньше, чтобы получился эффект «в клетку»
                context.fillRect(col * grid, row * grid, grid-2, grid-2);
            }
            else{
                context.fillStyle = '#202020';
                context.fillRect(col * grid, row * grid, grid-2, grid-2);

            }
        }
    }
    // рисуем текущую фигуру
    if (currTetromino){
        //каждые difficult кадров вниз
        if (++count > difficult){
            currTetromino.row++;
            count = 0;
            // если движение закончилось — рисуем фигуру в поле и проверяем, можно ли удалить строки
            if (!isValidMove(currTetromino.matrix, currTetromino.row, currTetromino.col)){
                currTetromino.row--;
                placeTetromino();

            }
        }
        // красим фигуру
        context.fillStyle = colors[currTetromino.name];
        // отрисовываем
        for (let row = 0; row < currTetromino.matrix.length; row++){
            for (let col = 0; col < currTetromino.matrix[row].length; col++){
                if (currTetromino.matrix[row][col]){
                    // эффект клеток
                    context.fillRect((currTetromino.col + col) * grid, (currTetromino.row + row) * grid, grid-2, grid -2);
                }
            }
        }
    }
}
// info
function updateInfo(){
    let scoreDIV = document.getElementById('number');
    scoreDIV.innerHTML = score;
    let lvlDIV = document.getElementById('lvl');
    lvlDIV.innerHTML = lvl;
    let linesDIV = document.getElementById('lines');
    linesDIV.innerHTML = lines;

}

//start
rAF = requestAnimationFrame(loop);
