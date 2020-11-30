class MapManager{
    view={x: 0, y: 0, w: 900, h: 900};

    mapData = null;
    tLayer = null; //  Link for a map blocks
    xCount = 0; //  Number of horizontal blocks
    yCount = 0; //  Number of vertical blocks
    tSize = { x: 64, y: 64 }; //  Block size
    mapSize = { x: 64, y: 64 }; //  Map size
    tilesets = new Array();
    imgLoadCount = 0;
    imgLoaded = false;
    jsonLoaded = false;
    gameManager = null;

    constructor(path, gameManager) {
        this.gameManager = gameManager;
        this.view.h = this.gameManager.canvas.height;
        this.view.w = this.gameManager.canvas.width;
        let self = this;
        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                self.parseMap(request.responseText);
            }
        };
        request.open("GET", 'http://localhost:3000/' + path, true);
        request.send();
    }
    // loadMap(path){
    //
    // }

    parseMap(tilesJSON){
        this.mapData = JSON.parse(tilesJSON);
        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;
        this.tSize.x = this.mapData.tilewidth;
        this.tSize.y = this.mapData.tileheight;
        this.mapSize.x = this.xCount * this.tSize.x;
        this.mapSize.y = this.yCount * this.tSize.y;

        self = this;

        for (let i = 0; i < this.mapData.tilesets.length; i++){
            let img = new Image();
            img.onload = function (){
                self.imgLoadCount++;
                if(self.imgLoadCount === self.mapData.tilesets.length){
                    self.imgLoaded = true;
                }
            };

            img.src = 'http://localhost:3000/levels/'+ this.mapData.tilesets[i].image; // path to img
            let tileset = this.mapData.tilesets[i];  // path to tilset
            let ts = {
                firstgrid: tileset.firstgrid, // начало нумерации
                imag: img, //рисунок
                name: tileset.name,
                xCount:Math.floor(tileset.imagewidth/self.tSize.x),
                yCount:Math.floor(tileset.imageheigh/self.tSize.y)
            };
            this.tilesets.push(ts);
        }
        this.jsonLoaded = true;
    }

    draw(ctx){
        let self = this;
        if(!self.imgLoaded||!self.jsonLoaded){
            setTimeout(function (){
                self.draw(ctx);
            }, 100);
        } else {
            if(this.tLayer === null) {
                for (let id = 0; id < this.mapData.layers.length; id++){
                    let layer = this.mapData.layers[id];
                    if(layer.type === "tilelayer"){
                        this.tLayer = layer;
                        break;
                    }
                }
            }
            for (let  i = 0; i < this.tLayer.data.length; i++){ // проход по карте
                if(this.tLayer.data[i] !== 0){ // нет данных - пропускаем
                    let tile = this.getTile(this.tLayer.data[i]); // получаем блок по индексу
                    let pX = (i%this.xCount) * this.tSize.x; // x в пикселах
                    let pY = Math.floor(i/this.xCount) * this.tSize.y;

                    if(!this.isVisible(pX, pY, this.tSize.x, this.tSize.y)){
                        continue;
                    }
                    pX -= this.view.x;
                    pY -= this.view.y;

                    ctx.drawImage(
                        tile.img,
                        tile.px,
                        tile.py,
                        this.tSize.x,
                        this.tSize.y,
                        pX,
                        pY,
                        this.tSize.x,
                        this.tSize.y
                    );
                }
            }
        }
    }
    getTile(tileIndex){
        let self = this;
        let tile = {
            img: null,
            px: 0,
            py: 0
        };
        let tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;
        let id = tileIndex - tileset.firstgrid;
        let x = id % tileset.xCount;
        let y = Math. floor(id/ tileset.xCount);
        tile.px = x * self.tSize.x;
        tile.py = y * self.tSize.y;
        return tile;
    }

    getTileset(tileIndex){
        let self = this;
        for (let i = self.tilesets.length - 1; i >= 0; i--){
            if (self.tilesets[i].firstgrid <= tileIndex){
                return self.tilesets[i];
            }
        }
        return null;
    }
    isVisible(x, y, width, height){
        return !(x + width < this.view.x ||
            y + height < this.view.y ||
            x > this.view.x + this.view.w ||
            y > this.view.y + this.view.h);

    }

    parseEntities() {
        let self = this;
        if (!self.imgLoaded || !self.jsonLoaded) {
            setTimeout(function () {
                self.parseEntities();
            }, 100);
        } else {
            for (let j = 0; j < this.mapData.layers.length; j++) {
                if (this.mapData.layers[j].type === "objectgroup") {
                    let entities = this.mapData.layers[j];
                    for (let i = 0; i < entities.objects.length; i++) {
                        let e = entities.objects[i];
                        console.log(`TYPE: ${e.type}`);
                        let obj = this.gameManager.entityFactory(
                            e.type,
                            e.name,
                            e.x,
                            e.y
                        );

                        if (obj !== null) {
                            this.gameManager.entities.push(obj);
                            if (obj.name === "player") {
                                // console.log("Got Player in map!");
                                this.gameManager.initPlayer(obj);
                            }
                        } else {
                            console.error("Invalid object in map!");
                        }
                    }
                }
            }
        }
    }

    getTilesetIdx(x, y) {
        let wX = x;
        let wY = y;
        let idx =
            Math.floor(wY / this.tSize.y) * this.xCount +
            Math.floor(wX / this.tSize.x);
        return this.tLayer.data[idx];
    }

    centerAt(x, y) {
        if (x < this.view.w / 2) {
            this.view.x = 0;
        } else if (x > this.mapSize.x - this.view.w / 2) {
            this.view.x = this.mapSize.x - this.view.w;
        } else {
            this.view.x = x - this.view.w / 2;
        }

        if (y < this.view.h / 2) {
            this.view.y = 0;
        } else if (y > this.mapSize.y - this.view.h / 2) {
            this.view.y = this.mapSize.y - this.view.h;
        } else {
            this.view.y = y - this.view.h / 2;
        }
    }
}
