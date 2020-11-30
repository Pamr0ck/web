class BonusKey extends Entity {
    impulse = 0;
    speed = 1;
    move_x = 0;
    move_y = 0;

    constructor(lifetime, type, name, pos_x, pos_y, gameManager) {
        console.log('Bonus constructor was called');
        super(type, name, pos_x, pos_y, gameManager);
        let sprite = this.gameManager.spriteManager.getSprite(this.type);
        console.log(this.type);
        this.size_x = sprite.w;
        this.size_y = sprite.h;
        // empty for while
    }

    draw() {
        // console.log(`Drawing Bonus: ${this.type}`);
        this.gameManager.spriteManager.drawSprite(
            this.type,
            this.pos_x,
            this.pos_y
        );
    }

    update() {
        // update in cycle
        this.gameManager.physicManager.update(this);
    }

    kill() {
        this.gameManager.kill(this);
    }
}