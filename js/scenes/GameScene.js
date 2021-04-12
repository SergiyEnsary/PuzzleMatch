const GameLogic = require("../javascript/GameLogic.js")
class GameScene extends Phaser.Scene{

    constructor() {
        super("PlayGame");
        this.gems = 6;
        this.gemSize = 50;
        this.dragging = true;
        this.canPick = true;
        this.selectedGem = null;
    }

    preload(){
        let fontPath = "assets/font/";
        let spritePath = "assets/spritesheets/";
        let imagePath = "assets/images/";

        this.load.spritesheet("gems", spritePath + "gems.png", {
            frameWidth : this.gemSize,
            frameHeight: this.gemSize
        });
        this.load.image("background", imagePath+"background.png");
        this.load.bitmapFont("pixelFont", fontPath+"font.png", fontPath+"font.xml")
    }

    create(){
        this.background = this.add.tileSprite(
            0,
            0,
            this.game.config.width,
            this.game.config.height,
            "background"
        ).setScale(2);
        let gemTypes = Array.from(new Array(this.gems), (val, index) => index+1)
        let size = {
            rows: 8,
            columns: 8,
            gemTypes: gemTypes
        }
        this.gameLogic = new GameLogic(size);
        this.gameLogic.randomCreate(size.gemTypes.length);
        this.drawField();
        console.log(this.gameLogic.getBoard())
        this.input.on("pointerdown", this.gemSelect, this)
    }

    drawField(){
        for(let row = 0; row < this.gameLogic.getRows(); row ++){
            for(let col = 0; col < this.gameLogic.getColumns(); col ++){
                let gemX = this.gemSize * row + this.gemSize / 2;
                let gemY = this.gemSize * col + this.gemSize / 2;
                this.add.sprite(gemX, gemY, "gems", this.gameLogic.getVal(row, col).getGemType());
            }
        }
    }

    gemSelect(pointer){
        if(this.canPick){
            var row = Math.floor((pointer.x) / this.gemSize);
            var col = Math.floor((pointer.y) / this.gemSize);
            this.dragging = true;
            if(row < this.gameLogic.getRows() && col < this.gameLogic.getColumns()){
                var gem = this.gameLogic.getVal(row, col);
                if(this.selectedGem != null){
                    this.gameLogic.swapGems(this.selectedGem, gem);
                    this.selectedGem = null;
                }
                else{
                    this.selectedGem = gem;
                }
                this.drawField();
            }
        }
    }

}

module.exports = GameScene
