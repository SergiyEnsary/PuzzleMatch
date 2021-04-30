const GameLogic = require("../javascript/GameLogic.js")

class GameScene extends Phaser.Scene{

    gemNum = 6;
    gemSize = 50;
    selectedGem;
    rows = 8;
    columns = 8;
    poolArray = [];

    constructor() {
        super("PlayGame");
    }

    preload(){
        let fontPath = "assets/font/";
        let spritePath = "assets/spritesheets/";
        let imagePath = "assets/images/";

        this.load.spritesheet("gems", spritePath + "gems.png", {
            frameWidth : this.gemSize,
            frameHeight: this.gemSize
        });
        this.load.spritesheet("border", spritePath+"border.png",{
            frameWidth : this.gemSize*8,
            frameHeight: 1
        });

        this.load.image("background", imagePath+"background.png");
        this.load.bitmapFont("pixelFont", fontPath+"font.png", fontPath+"font.xml");
    }

    create() {
        this.background = this.add.tileSprite(
            0,
            0,
            this.sys.game.config.width,
            this.sys.game.config.height,
            "background"
        );
        this.background.setOrigin(0,0)

        let size = {
            rows: this.rows,
            columns: this.columns,
            gems: this.gemNum
        }
        this.gameLogic = new GameLogic(size);
        this.gameLogic.randomCreate(this.gemNum);
        this.gameLogic.shuffle();
        this.drawField();
        this.input.on("pointerdown", this.gemSelect, this);
    }

    drawField(){
        console.log("Drawing Board");
        for(let col = 0; col < this.gameLogic.getRows(); col ++){
            for(let row = 0; row < this.gameLogic.getColumns(); row ++){
                let gemX = this.gemSize * col + this.gemSize / 2;
                let gemY = this.gemSize * row + this.gemSize / 2;
                let gem = this.add.sprite(gemX, gemY, "gems", this.gameLogic.getVal(row, col).getGemType());
                this.gameLogic.getVal(row, col).setSprite(gem);
            }
        }
    }

    gemSelect(pointer){
        if(this.gameLogic.canPick){
            var row = Math.floor((pointer.y) / this.gemSize);
            var col = Math.floor((pointer.x) / this.gemSize);
            if(row < this.gameLogic.getRows() && col < this.gameLogic.getColumns()){
                var gem = this.gameLogic.getVal(row, col);
                if(this.selectedGem != null){
                    let canSwap = this.gameLogic.canSwap(this.selectedGem, gem);
                    if(canSwap === true) {
                        this.swap(gem);
                    }
                    this.selectedGem = null;

                }
                else{
                    this.selectedGem = gem;
                }
            }
        }
    }

    swap(gem){
        console.log("Swapping Gems")
        let forTween = this.gameLogic.swapGems(this.selectedGem, gem);
        let swapGems = 2
        forTween.forEach(function (gem) {
            //Tween for gem movement
            this.tweens.add({
                targets: this.gameLogic.getVal(gem.row, gem.column).getSprite(),
                x: gem.column * 50 + 25,
                y: gem.row * 50 + 25,
                duration: 1000,
                callbackScope: this,
                onComplete: function(){
                    swapGems--;
                    if(swapGems === 0){
                        this.destroyGems();
                    }
                }
            });
        }.bind(this));
    }

    destroyGems(){
        console.log("Gem Destruction");
        let gemsToDestroy = this.gameLogic.getMatches();
        let gemsDestroyed = 0;
        gemsToDestroy.forEach(function (gem) {
            this.poolArray.push(gem);
            gemsDestroyed++;
            this.tweens.add({
                targets: this.gameLogic.getVal(gem.getY(), gem.getX()).getSprite(),
                alpha: 0,
                duration: 1000,
                callbackScope: this,
                onComplete: function(event, sprite) {
                    gemsDestroyed--;
                    if(gemsDestroyed === 0){
                        this.gameLogic.destroyGemSet(gemsToDestroy);
                        this.updateGems();
                    }
                }
            });
        }.bind(this));
    }

    updateGems(){
        console.log("Generating new gems");
        let gemsMoved = this.gameLogic.arrangeBoardAfterMatch();
        console.log(gemsMoved);
        let moved = 0;
        gemsMoved.forEach(function(gem){
            moved ++;
            this.tweens.add({
                targets: this.gameLogic.getVal(gem.getY(), gem.getX()).getSprite(),
                y:  this.gameLogic.stepsDown(gem.getY(), gem.getX()).deltaRow * 50 + 25,
                duration: 1000,
                callbackScope: this,
                onComplete: function(){
                    moved --;
                    if(moved == 0){
                        //this.endOfMove()
                    }
                }
            })
        }.bind(this));

        let replenishMovements = this.gameLogic.replenishGems();
        replenishMovements.forEach(function(gem){
            moved ++;
            let sprite = this.poolArray.pop();
            sprite.alpha = 1;
            //sprite.y = 50 * (gem.row - gem.deltaRow + 1) - 50 / 2;
            //sprite.x = 50 * gem.column + 50 / 2,
            //sprite.setFrame(this.match3.valueAt(gem.row, gem.column));
            //this.match3.setCustomData(gem.row, gem.column, sprite);
            this.tweens.add({
                targets: sprite,
                y: 50 * gem.row + 50 / 2,
                duration: 1000 * gem.deltaRow,
                callbackScope: this,
                onComplete: function(){
                    moved --;
                    if(moved == 0){
                        //this.endOfMove()
                    }
                }
            });
        }.bind(this));
    }
}

module.exports = GameScene;
