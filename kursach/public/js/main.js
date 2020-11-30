const EMPTY_SPACE_ID = 8;
const LAVA_TILE_ID = 4;
const EXIT_TILE_ID_1 = 2;

function startGame() {
    console.info('GAME STARTED');

    let canvas = document.getElementById("gameCanvas");

    let infoBlock = document.getElementById("game-info");
    let infoWindow = document.getElementById("game-info-block");
    let scoreElem = document.getElementById("score");
    let hideMePlz = document.getElementById("interact-with-page");

    gameManager = new GameManager(
        canvas,
        ["/levels/level_1.json", "/levels/level_2.json"],
        "/levels/sprites.json",
        "/levels/spritesheet.png",
        scoreElem,
        infoBlock,
        infoWindow,
        hideMePlz
    );
}
