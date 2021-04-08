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
        let size = {
            rows: 8,
            columns: 6
        }
        let gameLogic = new GameLogic(size);
        console.log(gameLogic.board);
    }
}
