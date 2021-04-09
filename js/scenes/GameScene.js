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
        console.log(this.gameLogic);
        this.drawField();
    }

    drawField(){
        for(let i = 0; i < this.gameLogic.getRows(); i ++){
            for(let j = 0; j < this.gameLogic.getColumns(); j ++){
                let gemX = gameOptions.gemSize*1.1 * j + gameOptions.gemSize / 2;
                let gemY = gameOptions.gemSize*1.1 * i + gameOptions.gemSize / 2;
                let gem = this.add.sprite(gemX, gemY, "gems", this.gameLogic.getVal(i, j));
            }
        }
    }
}
