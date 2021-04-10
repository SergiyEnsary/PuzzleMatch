class GameScene extends Phaser.Scene{

    constructor() {
        super("PlayGame");
        this.gems = 6;
        this.gemsize = 50;
    }

    preload(){
        let fontPath = "assets/font/";
        let spritePath = "assets/spritesheets/";
        let imagePath = "assets/images/";

        this.load.spritesheet("gems", spritePath + "gems.png", {
            frameWidth : this.gemsize,
            frameHeight: this.gemsize
        });
        this.load.image("background", imagePath+"background.png");
        this.load.bitmapFont("pixelFont", fontPath+"font.png", fontPath+"font.xml")
    }

    create(){
        this.background = this.add.tileSprite(
            0,
            0,
            gameConfig.width,
            gameConfig.height,
            "background"
        ).setScale(2);
        let gemTypes = Array.from(new Array(this.gems), (val, index) => index+1)
        let size = {
            rows: 8,
            columns: 8,
            gemTypes: gemTypes
        }
        this.gameLogic = new GameLogic(size);
        this.drawField();
        console.log(this.gameLogic.getBoard())
    }

    drawField(){
        for(let row = 0; row < this.gameLogic.getRows(); row ++){
            for(let col = 0; col < this.gameLogic.getColumns(); col ++){
                let gemX = gameOptions.gemSize*1.1 * row + gameOptions.gemSize / 2;
                let gemY = gameOptions.gemSize*1.1 * col + gameOptions.gemSize / 2;
                this.add.sprite(gemX, gemY, "gems", this.gameLogic.getVal(row, col).getGemType());
            }
        }
    }
}
