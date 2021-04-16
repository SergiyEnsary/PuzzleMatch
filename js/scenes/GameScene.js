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
        this.load.spritesheet("border", spritePath+"border.png",{
            frameWidth : this.gemSize*8,
            frameHeight: 1
        });
        this.load.image("background", imagePath+"background.png");
        this.load.bitmapFont("pixelFont", fontPath+"font.png", fontPath+"font.xml")
    }

    create() {
        let groundX = 200;
        let groundY = 400;
        this.ground = this.physics.add.sprite(groundX, groundY, "border").setImmovable();
        this.background = this.add.tileSprite(
            0,
            0,
            this.sys.game.config.width,
            this.sys.game.config.height,
            "background"
        );
        this.background.setOrigin(0,0)

        let gemTypes = Array.from(new Array(this.gems), (val, index) => index + 1)
        let size = {
            rows: 8,
            columns: 8,
            gemTypes: gemTypes
        }
        this.gameLogic = new GameLogic(size);
        this.gameLogic.randomCreate(size.gemTypes.length);
        this.gameLogic.shuffle()
        this.drawField();
        this.input.on("pointerdown", this.gemSelect, this)
    }

    drawField(){
        for(let col = 0; col < this.gameLogic.getRows(); col ++){
            for(let row = 0; row < this.gameLogic.getColumns(); row ++){
                let gemX = this.gemSize * col + this.gemSize / 2;
                let gemY = this.gemSize * row + this.gemSize / 2;
                let gem = this.physics.add.sprite(gemX, gemY, "gems", this.gameLogic.getVal(row, col).getGemType()).setGravityY(50);
                if(row>0){
                    this.physics.add.collider(gem, this.gameLogic.getVal(row-1, col).getSprite(), function (s1, s2) {
                        var b1 = s1.body;
                        var b2 = s2.body;

                        if (b1.y > b2.y) {
                            b2.y += (b1.top - b2.bottom);
                            b2.stop();
                        }
                        else {
                            b1.y += (b2.top - b1.bottom);
                            b1.stop();
                        }
                    })
                }
                this.physics.add.collider(gem, this.ground);
                this.gameLogic.getVal(row, col).setSprite(gem);
            }
        }
    }

    gemSelect(pointer){
        if(this.canPick){
            var row = Math.floor((pointer.y) / this.gemSize);
            var col = Math.floor((pointer.x) / this.gemSize);
            this.dragging = true;
            if(row < this.gameLogic.getRows() && col < this.gameLogic.getColumns()){
                var gem = this.gameLogic.getVal(row, col);
                console.log(gem);
                if(this.selectedGem != null){
                    console.log(this.gameLogic.canSwap(this.selectedGem, gem))
                    if(this.gameLogic.canSwap(this.selectedGem, gem)) {
                        this.gameLogic.swapGems(this.selectedGem, gem);
                    }
                    this.selectedGem = null;

                }
                else{
                    this.selectedGem = gem;
                }
            }
        }
    }

}

module.exports = GameScene
