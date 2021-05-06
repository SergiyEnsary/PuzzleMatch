const GameLogic = require("../javascript/GameLogic.js")

class GameScene extends Phaser.Scene{

    gameSetting = {
        gemSize: 50,
        rows: 8,
        columns: 8,
        gemNum: 6
    }
    selectedGem;
    gemPool;
    offset = {
        x: 100,
        y: 50
    }

    constructor() {
        super("PlayGame");
    }

    preload(){
        let fontPath = "assets/font/";
        let spritePath = "assets/spritesheets/";
        let imagePath = "assets/images/";

        this.load.spritesheet("gems", spritePath + "gems.png", {
            frameWidth : this.gameSetting.gemSize,
            frameHeight: this.gameSetting.gemSize
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
            rows: this.gameSetting.rows,
            columns: this.gameSetting.columns,
            gems: this.gameSetting.gemNum
        }
        this.gameLogic = new GameLogic(size);
        this.gameLogic.randomCreate(this.gameSetting.gemNum);
        this.gameLogic.shuffle();
        this.selectedGem = null;
        this.drawField();
        this.input.on("pointerdown", this.gemSelect, this);
    }

    drawField(){
        console.log("Drawing Board");
        this.gemPool = [];
        for(let col = 0; col < this.gameLogic.getRows(); col ++){
            for(let row = 0; row < this.gameLogic.getColumns(); row ++){
                let gemX = this.offset.x + this.gameSetting.gemSize * col + this.gameSetting.gemSize / 2;
                let gemY = this.offset.y + this.gameSetting.gemSize * row + this.gameSetting.gemSize / 2;
                let gem = this.add.sprite(gemX, gemY, "gems", this.gameLogic.getVal(row, col).getGemType());
                this.gameLogic.getVal(row, col).setSprite(gem);
            }
        }
    }

    gemSelect(pointer){
        if(this.gameLogic.canPick){
            var row = Math.floor((pointer.y - this.offset.y) / this.gameSetting.gemSize);
            var col = Math.floor((pointer.x - this.offset.x) / this.gameSetting.gemSize);
            if(row < this.gameLogic.getRows() && col < this.gameLogic.getColumns()){
                var gem = this.gameLogic.getVal(row, col);
                if(this.selectedGem === null){
                    this.selectedGem = gem;
                    this.selectedGem.getSprite().setScale(1.1);
                    this.selectedGem.getSprite().setDepth(1);
                }else{
                    if(this.selectedGem === gem){
                        this.selectedGem.getSprite().setScale(1);
                        this.selectedGem = null;
                    } else {
                        if (this.gameLogic.canSwap(this.selectedGem, gem)) {
                            this.gameLogic.canPick = false;
                            gem.getSprite().setScale(1.1);
                            this.swap(gem);
                        }
                        this.selectedGem = null;
                    }
                }
            }
        }
    }

    swap(gem){
        console.log("Swapping Gems")
        let forTween = this.gameLogic.swapGems(this.selectedGem, gem);
        let swapGems = 2
        forTween.forEach(function (gem) {
            this.gameLogic.getVal(gem.row, gem.column).getSprite().setScale(1);
            //Tween for gem movement
            this.tweens.add({
                targets: this.gameLogic.getVal(gem.row, gem.column).getSprite(),
                x: gem.gem.getSprite().x,
                y: gem.gem.getSprite().y,
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
            this.gemPool.push(gem.getSprite());
            gemsDestroyed++;
            this.tweens.add({
                targets: this.gameLogic.getVal(gem.getY(), gem.getX()).getSprite(),
                alpha: 0,
                duration: 1000,
                callbackScope: this,
                onComplete: function(event, sprite) {
                    gemsDestroyed--;
                    if(gemsDestroyed === 0){
                        this.updateGems();
                    }
                }
            });
        }.bind(this));
    }

    updateGems() {
        this.gameLogic.destroyGemSet(this.gameLogic.getMatches());
        console.log("Moving Gems Down");
        let gemsMoved = this.gameLogic.arrangeBoardAfterMatch();
        let moved = 0;
        gemsMoved.forEach(function (gem) {
            moved++;
            this.tweens.add({
                targets: this.gameLogic.getVal(gem.row, gem.column).getSprite(),
                y: this.gameLogic.getVal(gem.row, gem.column).getSprite().y + gem.deltaRow * this.gameSetting.gemSize,
                duration: 1000,
                callbackScope: this,
                onComplete: function () {
                    moved--;
                    if(moved > 0){
                        this.endMove();
                    }
                }
            })
        }.bind(this));

        console.log("Generating new gems");
        let replenishMovements = this.gameLogic.replenishGems();
        replenishMovements.forEach(function(gem){
            moved ++;
            let sprite = this.gemPool.pop();
            sprite.alpha = 1;
            sprite.y = this.offset.y + this.gameSetting.gemSize * (gem.row - gem.deltaRow + 1) - this.gameSetting.gemSize / 2;
            sprite.x = this.offset.x + this.gameSetting.gemSize * gem.column + this.gameSetting.gemSize / 2;
            sprite.setFrame(gem.gem.getGemType());
            gem.gem.setSprite(sprite);
            this.tweens.add({
                targets: sprite,
                y: this.offset.y + this.gameSetting.gemSize * gem.row + this.gameSetting.gemSize / 2,
                duration: 1000,
                callbackScope: this,
                onComplete: function(){
                    moved --;
                    if(moved === 0){
                        this.endMove()
                    }
                }
            });
        }.bind(this));
    }

    endMove(){
        if(this.gameLogic.getMatches() !== {}){
            this.time.addEvent({
                delay: 250,
                callback: this.updateGems()
            });
        }
        else{
            console.log("Turn Ended");
            this.selectedGem = null;
            this.gameLogic.canPick = true;
        }
    }
}

module.exports = GameScene;
