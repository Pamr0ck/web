class Player extends Entity {
    fireBlock = false;
    lifetime = 0;
    move_x = 0;
    move_y = 0;
    size_x = 0;
    size_y = 0;
    speed = 2;
    lastSpriteType = "Player_right"; //  save prev direction
    currentSpriteType = null;
    score = 0;
    impulse = 0;

    constructor(lifetime, type, name, pos_x, pos_y, gameManager) {
        // console.log('Player constructor was called');
        super(type, name, pos_x, pos_y, gameManager);
        // Because player character has several possible posisitions, there aren't
        // just "Player" sprite. Consider start sprite is idle in right direction
        let sprite = this.gameManager.spriteManager.getSprite(`${this.type}_right`);
        // let sprite = this.gameManager.spriteManager.getSprite(``);
        this.currentSpriteType = this.type;
        this.size_x = sprite.w;
        this.size_y = sprite.h;
        this.lifetime = lifetime;
    }

    draw() {
        // console.log(`CHECK: currentSpriteType == |${this.currentSpriteType}|, type == |${this.type}|`);
        this.currentSpriteType = this.type;
        // console.log(`PLAYER: move_x: ${this.move_x}, move_y: ${this.move_y}`);
        if (this.move_x < 0) {
            this.currentSpriteType += "_left";
            this.lastSpriteType = this.currentSpriteType;
        }
        if (this.move_x > 0) {
            this.currentSpriteType += "_right";
            this.lastSpriteType = this.currentSpriteType;
        }
        if (this.move_x === 0) {
            this.currentSpriteType = this.lastSpriteType;
        }
        // console.log(`Drawing Player: ${this.currentSpriteType}`);
        this.gameManager.spriteManager.drawSprite(
            this.currentSpriteType,
            this.pos_x,
            this.pos_y
        );
    }
    update() {
        // update in cycle
        this.gameManager.physicManager.update(this);
    }

    onTouchEntity(obj) {
        // collide entities handle
        if (obj.type === "BonusKey") {
            this.gameManager.soundsManager.playSound("bonus");
            this.gameManager.addScore(50);
            obj.kill();
        }
        if (obj.type === "Enemy") {
            this.kill();
        }
    }

    onTouchMap(tileset) {
        // console.log(`PLAYER TOUCH: ${tileset}`);
        if (tileset === LAVA_TILE_ID) {
            console.log('LAVE_TILE was triggered');
            this.kill(false);
        }
        // END LEVEL
        // TOGGLE NEXT LEVEL
        if (tileset === EXIT_TILE_ID_1) {
            console.log('EXIT_TILE was triggered');
            this.kill(true);
            this.gameManager.goToNextLevel();
        }
    }

    kill(goNextLevel) {
        // destroy this
        if (goNextLevel === true) {
            this.gameManager.kill(this, goNextLevel);
            this.gameManager.soundsManager.playSound("next level");
        } else {
            this.gameManager.soundsManager.playSound("hero death");
            this.gameManager.kill(this);
        }
    }

    fire() {
        if (this.fireBlock) return;

        let fireballMove_x = this.move_x;
        let fireballMove_y = this.move_y;
        let fireballName = "fireball" + ++this.gameManager.fireNum;
        let fireball = new Fireball(
            "Fireball",
            fireballName,
            fireballMove_x,
            fireballMove_y,
            0,
            0,
            this.gameManager
        );
        switch (this.move_x + 2 * this.move_y) {
            case -1:
                fireball.pos_x = this.pos_x - fireball.size_x;
                fireball.pos_y = this.pos_y + fireball.size_y / 2;
                this.gameManager.soundsManager.playSound("pew");
                break;
            case 1:
                fireball.pos_x = this.pos_x + this.size_x;
                fireball.pos_y = this.pos_y + fireball.size_y / 2;
                this.gameManager.soundsManager.playSound("pew");
                break;
            default:
                return;
        }
        this.fireBlock = true;
        let self = this;
        setTimeout(function () {
            self.fireBlock = false;
        }, 500);
        this.gameManager.entities.push(fireball);
    }
}