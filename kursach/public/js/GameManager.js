class GameManager {
    entities = [];
    fireNum = 0;
    player = null;
    laterKill = [];

    spriteManager = null;
    eventsManager = null;
    physicManager = null;
    soundsManager = null;
    mapManager = null;
    canvas = null;
    ctx = null;

    currentLevel = 0;
    levels = [];
    playInterval = null;
    scoreElem = undefined;
    infoElem = undefined;
    infoWindow = undefined;
    infoWindowTimeout = null;

    score = 0;

    constructor(
        canvas,
        levelPaths,
        spritePath,
        spritesheetPath,
        scoreElem,
        infoElem,
        infoWindow,
        hideThisAfterLoad
    ) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.scoreElem = scoreElem;
        this.infoElem = infoElem;
        this.infoWindow = infoWindow;

        for (let i = 0; i < levelPaths.length; i++) {
            this.levels.push(levelPaths[i]);
        }

        this.soundsManager = new SoundsManager(this);
        this.mapManager = new MapManager(this.levels[this.currentLevel], this);
        this.spriteManager = new SpriteManager(
            spritePath,
            spritesheetPath,
            this
        );
        this.mapManager.parseEntities();
        this.eventsManager = new EventsManager(canvas, this);
        this.physicManager = new PhysicManager(this, EMPTY_SPACE_ID);

        setTimeout(function () {
            hideThisAfterLoad.style.display = "none";
        }, 200);

        this.play();
    }

    addScore(number) {
        this.score += number;
        this.scoreElem.innerHTML = this.score;
    }

    initPlayer(obj) {
        this.player = obj;
    }

    entityFactory(type, name, x, y) {
        let resultEntity = null;
        switch (type) {
            case "Player":
                resultEntity = new Player(100, type, name, x, y, this);
                break;
            case "Enemy":
                resultEntity = new Enemy(100, type, name, x, y, this);
                break;
            case "BonusKey":
                resultEntity = new BonusKey(100, type, name, x, y, this);
                break;
            default:
                resultEntity = null;
        }
        return resultEntity;
    }

    kill(obj, isNextLevel) {
        this.laterKill.push(obj);
        if (obj.type === "Player" && this.playInterval !== null) {
            clearInterval(this.playInterval);
            this.playInterval = null;
            if (isNextLevel !== undefined) {
                this.addScore((this.currentLevel + 1) * 100);
            } else {
                let score = this.score;
                this.player = null;
                this.addScore(-score);
                //this.scoreElem.innerHTML = "0";
                this.showInfo(
                    `GAME OVER
                    <br />
                    YOUR SCORE:
                    <span>${score}</span>
                    <div style="font-size: large">press ENTER to restart</div>`,
                    "forever"
                );
                let self = this;
                let blockRestart = false; //  block ENTER restart before loosing
                let waitForAction = setInterval(function () {
                    if (self.eventsManager.action["restart"] && !blockRestart) {
                        blockRestart = true;
                        if (self.playInterval === null) {
                            // disable time for action waiting
                            clearInterval(waitForAction);
                            console.info("RESTART");
                            self.currentLevel = -1;
                            self.goToNextLevel();
                        }
                    }
                }, 100);
            }
        }
    }

    update() {
        // console.log(this.entities)

        if (this.player === null) {
            // alert("WTF IS HAPENNING HERE?!");
            return;
        }

        this.player.move_x = 0;
        this.player.move_y = 0;

        if (this.eventsManager.action["up"]) {
            if (this.player.impulse === 0) {
                this.player.impulse = -15;
            }
        }

        //if(this.eventsManager.action["down"])
        //    this.player.move_y = 1;

        if (this.eventsManager.action["left"]) this.player.move_x = -1;

        if (this.eventsManager.action["right"]) this.player.move_x = 1;

        if (this.eventsManager.action["fire"]) this.player.fire();

        this.entities.forEach(function (event) {
            try {
                event.update();
                if (event.type === "Enemy") {
                    event.move_y = 0;
                }
                if (event.type === "BonusKey") {
                    event.move_y = 0;
                }
            } catch (ex) {
                //console.log(ex)
            }
        });

        for (let i = 0; i < this.laterKill.length; i++) {
            let idx = this.entities.indexOf(this.laterKill[i]);
            if (idx > -1) {
                this.entities.splice(idx, 1);
            }
        }

        if (this.laterKill.length > 0) this.laterKill.length = 0;

        if (this.player === null) {
            return;
        }

        this.mapManager.draw(this.ctx);
        this.mapManager.centerAt(this.player.pos_x, this.player.pos_y);
        this.draw(this.ctx);
    }

    draw() {
        // console.log('Draw from GameManager');
        for (let entityNum = 0; entityNum < this.entities.length; entityNum++) {
            this.entities[entityNum].draw();
        }
    }

    showInfo(text, timeout) {
        this.canvas.style.filter = "blur(7px)";
        if (timeout === "forever") {
            clearTimeout(this.infoWindowTimeout);
            this.infoWindow.style.display = "block";
            this.infoElem.innerHTML = text;
            return;
        }
        let self = this;
        self.infoWindow.style.display = "block";
        self.infoElem.innerHTML = text;
        this.infoWindowTimeout = setTimeout(function () {
            self.canvas.style.filter = "";
            self.infoElem.innerHTML = "";
            self.infoWindow.style.display = "none";
        }, timeout);
    }

    play() {
        let self = this;
        let description =
            "";
        switch (this.currentLevel) {
            case 0:
                description =
                    "Приветствую, RD-D3! Твоя миссия выжить и уйти.";
                break;
            case 1:
                description =
                    "Хорошая работа! Теперь вниз!!!!";
                break;
        }
        // tests with start
        let tryStart = setInterval(function () {
            if (
                self.mapManager.jsonLoaded &&
                self.mapManager.imgLoaded &&
                self.spriteManager.jsonLoaded &&
                self.spriteManager.imgLoaded
            ) {
                self.showInfo(
                    `Добро пожаловать на уровень ${self.currentLevel + 1}
                        <br/>
                        <br/>
                        <div style="font-size: large">${description}</div>`,
                    1500
                );
                self.playInterval = setInterval(function () {
                    self.update();
                }, 10);
                clearInterval(tryStart);
            }
        }, 100);
    }

    // Next lvl or current restart after falling

    goToNextLevel() {
        this.entities = [];
        this.player = null;
        this.currentLevel++;
        // Final lvl was passed
        if (this.currentLevel === this.levels.length) {
            let name = prompt("Enter your name");
            this.saveResult(name, this.score);
            this.showInfo(
                `Congratulations ${name}
                    <br />
                    YOUR SCORE:
                    <span>${this.score}</span>
                    <div style="font-size: large">
                    press ENTER to restart
                    <br />
                    press SPACE to show table of records</div>`,
                "forever"
            );
            this.currentLevel = -1;
            let self = this;
            let blockRestart = false;
            let waitForAction = setInterval(function () {
                if (self.eventsManager.action["restart"] && !blockRestart) {
                    blockRestart = true;
                    if (self.playInterval === null) {
                        clearInterval(waitForAction);
                        self.addScore(-self.score);
                        console.info("RESTART");
                        self.currentLevel = -1;
                        self.goToNextLevel();
                    }
                }

                if (self.eventsManager.action["fire"]) {
                    window.location.href = window.location.href + "records/";
                }
            }, 100);
            return;
        }
        console.info("Change lvl / restart");
        this.mapManager = new MapManager(this.levels[this.currentLevel], this);
        this.mapManager.parseEntities();

        this.physicManager.EMPTY_SPACE = EMPTY_SPACE_ID;

        console.log(`Current lvl: ${this.currentLevel}`);
        console.info("HERE BEFORE PLAY");
        this.play();
    }

    saveResult(name, record) {
        let self = this;
        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                // to-do
            }
        };
        request.open("PUT", `/?name=${name}&record=${record}`, true);
        request.send();
    }

}