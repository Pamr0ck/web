class PhysicManager {
    gameManager = null;
    EMPTY_SPACE = null;

    constructor(gameManager, empty_space_tile) {
        this.gameManager = gameManager;
        this.EMPTY_SPACE = empty_space_tile;
    }

    checkMove(obj, x, y) {
        let tileset = this.gameManager.mapManager.getTilesetIdx(x, y);

        if (tileset === this.EMPTY_SPACE) {
            tileset = this.gameManager.mapManager.getTilesetIdx(
                x + obj.size_x,
                y + obj.size_y
            );
            if (tileset !== this.EMPTY_SPACE && obj.type === "Player") {
                //  console.log("map right");
            }
        }

        if (tileset === this.EMPTY_SPACE) {
            tileset = this.gameManager.mapManager.getTilesetIdx(
                x,
                y + obj.size_y
            );
            // if (obj.type === "Fireball") console.log("FIREBALL HERE №1");
        }

        if (tileset === this.EMPTY_SPACE) {
            tileset = this.gameManager.mapManager.getTilesetIdx(
                x + obj.size_x,
                y
            );
            // if (obj.type === "Fireball") console.log("FIREBALL HERE №2");
        }

        return tileset;
    }


     // * Search object by coords.

    entityAtXY(obj, x, y) {
        for (let i = 0; i < this.gameManager.entities.length; i++) {
            let entity = this.gameManager.entities[i];

            if (entity.name !== obj.name) {
                // not crossing
                if (
                    x + obj.size_x < entity.pos_x ||
                    y + obj.size_y < entity.pos_y ||
                    x > entity.pos_x + entity.size_x ||
                    y > entity.pos_y + entity.size_y
                )
                    continue;
                //console.log(x, y, obj.size_x, obj.size_y, entity.pos_x, entity.pos_y, entity.size_x, entity.size_y, entity.name);
                return entity;
            }
        }
        return null;
    }
}