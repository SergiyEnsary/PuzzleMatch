const GameLogic = require("../javascript/GameLogic.js")
class GameScene extends Phaser.Scene{

    gems;
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
        this.gems = this.add.group();
        this.drawField();
        this.input.on("pointerdown", this.gemSelect, this)
    }

    drawField(){
        for(let col = 0; col < this.gameLogic.getRows(); col ++){
            for(let row = 0; row < this.gameLogic.getColumns(); row ++){
                let gemX = this.gemSize * col + this.gemSize / 2;
                let gemY = this.gemSize * row + this.gemSize / 2;
                this.gems.create(
                    gemX,
                    gemY,
                    "gems",
                    this.gameLogic.getVal(row, col).getGemType()
                );
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
                    gem.setScale = 2
                    this.update();
                }
            }
        }
    }
    swap(gem){
        this.gameLogic.swapGems(this.selectedGem, gem);
        let gemSet = this.gameLogic.getMatches();
        this.gameLogic.destroyGems(gemSet);
        /*this.tweens.add({

        })*/
    }
}

module.exports = GameScene;
