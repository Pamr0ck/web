class MapManager{
    view={x: 0, y: 0, w: 900, h: 900}

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

    loadMap(path){
        let self = this
        var request = new XMLHttpRequest();
        request.onreadystatechange = function (){
            if(request.readyState === 4 && request.status === 200){
                self.parseMap(request.responseText);
            }
        }
        request.open("GET", path, true);
        request.send();
    }

    parseMap(titlesJSON){
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

            img.src = this.mapData.tilesets[i].image; // path to img
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
        if (x + width < this.view.x ||
            y + height < this.view.y ||
            x > this.view.x + this.view.w ||
            y > this.view.y + this.view.h){
            return  false;
        }
        return true;
    }
}

var canvas = document.getElementById("canvasid");
var ctx = canvas.getContext("2d");
var image = new Image();

mapManager = MapManager()
mapManager.loadMap("../levels/lvl1.json");
mapManager.draw(ctx);
