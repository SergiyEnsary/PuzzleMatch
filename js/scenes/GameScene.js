import GameLogic from "/js/javascript/GameLogic"
class GameScene extends Phaser.Scene{

    constructor() {
        super("PlayGame");
    }

    preload(){
        let fontPath = "assets/font/";
        let spritePath = "assets/spritesheets/";
        let imagePath = "assets/images/";

        this.load.spritesheet("gems", spritePath + "gems.png", {
            frameWidth : gameOptions.gemSize,
            frameHeight: gameOptions.gemSize
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
        let game = new GameLogic({
            rows: 8,
            columns: 6
        });
        console.log(game.board);
    }
}
