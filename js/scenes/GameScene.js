const GameLogic = require("../javascript/GameLogic.js")

class GameScene extends Phaser.Scene{

    gemNum = 6;
    gemSize = 50;
    selectedGem;
    rows = 8;
    columns = 8;

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
                duration: 500,
                callbackScope: this,
                onComplete: function(){
                    this.gameLogic.getVal(gem.row, gem.column).sprite.setY(gem.row * 50 + 25);
                    this.gameLogic.getVal(gem.row, gem.column).sprite.setX(gem.column * 50 + 25);
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
            gemsDestroyed++;
            this.tweens.add({
                targets: this.gameLogic.getVal(gem.getY(), gem.getX()).getSprite(),
                alpha: 0,
                duration: 1000,
                callbackScope: this,
                onComplete: function() {
                    this.gameLogic.getVal(gem.getY(), gem.getX()).getSprite().active = false;
                    gemsDestroyed--;
                    if(gemsDestroyed === 0){
                        this.gameLogic.destroyGemSet(gemsToDestroy);
                        this.replenish();
                    }
                }
            });
        }.bind(this));
    }

    updateGems() {
        console.log("Moving Gems Down");
        let gemsMoved = this.gameLogic.arrangeBoardAfterMatch();
        let moved = 0;
        console.log(this.gameLogic.getBoard());
        gemsMoved.forEach(function (gem) {
            moved++;
            this.tweens.add({
                targets: this.gameLogic.getVal(gem.row, gem.column).getSprite(),
                y: gem.row * 50 + gem.deltaRow * 50 + 25,
                duration: 200 * gem.deltaRow,
                callbackScope: this,
                onComplete: function () {
                    moved--;
                    if(moved > 0){
                        this.gameLogic.getVal(gem.row, gem.column).getSprite().y = gem.row * 50 + gem.deltaRow * 50 + 25;
                    }else{
                        this.replenish();
                    }
                }
            })
        }.bind(this));
    }

    replenish(){
        console.log("Generating new gems");
        let replenishMovements = this.gameLogic.replenishGems();
        let moved = 0;
        replenishMovements.forEach(function(gem){
            moved ++;
            let gemX = 50 * gem.column + 50 / 2;
            let gemY = 50 * gem.row + 50 / 2;
            let sprite = this.add.sprite(-gemX, -gemY, "gems", gem.getGemType());
            sprite.setX(gemX);
            sprite.setY(gemY);
            gem.setSprite(sprite);
            console.log(gem);
            this.tweens.add({
                targets: sprite,
                y: -gemY,
                duration: 0,
                callbackScope: this,
                onComplete: function(){
                    moved --;
                    if(moved == 0){
                        if(this.gameLogic.getMatches() !== {}){
                            this.updateGems();
                        } else {
                            this.endOfMove()
                        }
                    }
                }
            });
        }.bind(this));
    }
}

module.exports = GameScene;
