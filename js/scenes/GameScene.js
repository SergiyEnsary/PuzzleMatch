const GameLogic = require("../javascript/GameLogic.js")
class GameScene extends Phaser.Scene{
    air = this.scene.add.group();
    earth = this.scene.add.group();
    water = this.scene.add.group();
    sword = this.scene.add.group();
    heart = this.scene.add.group();
    fire = this.scene.add.group();

    gems;
    gemNum = 6;
    gemSize = 50;
    selectedGem;
    gemList = ["water", "sword", "heart", "fire", "earth", "air"];
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
        this.input.on("pointerdown", this.gemSelect, this)
    }

    drawField(){
        let water = this.gameLogic.getGems(0);
        let sword = this.gameLogic.getGems(1);
        let heart = this.gameLogic.getGems(2);
        let fire = this.gameLogic.getGems(3);
        let earth = this.gameLogic.getGems(4);
        let air = this.gameLogic.getGems(5);
        for(let wgem = 0; wgem < water.length; wgem++) {
            this.water.add({
                key: "gems",
                setXY: {
                    x: water[wgem].getX() * this.gemSize,
                    y: water[wgem].getY() * this.gemSize
                },
                frame: "water"
            });
        }
        for(let sgem = 0; sgem < sword.length; sgem++) {
            this.sword.add({
                key: "gems",
                setXY: {
                    x: sword[sgem].getX() * this.gemSize,
                    y: sword[sgem].getY() * this.gemSize
                },
                frame: "sword"
            });
        }
        for(let fgem = 0; fgem < fire.length; fgem++) {
            this.fire.add({
                key: "gems",
                setXY: {
                    x: fire[fgem].getX() * this.gemSize,
                    y: fire[fgem].getY() * this.gemSize
                },
                frame: "fire"
            });
        }
        for(let hgem = 0; hgem < heart.length; hgem++) {
            this.heart.add({
                key: "gems",
                setXY: {
                    x: heart[hgem].getX() * this.gemSize,
                    y: heart[hgem].getY() * this.gemSize
                },
                frame: "heart"
            });
        }
        for(let egem = 0; egem < earth.length; egem++) {
            this.earth.add({
                key: "gems",
                setXY: {
                    x: earth[egem].getX() * this.gemSize,
                    y: earth[egem].getY() * this.gemSize
                },
                frame: "earth"
            });
        }
        for(let agem = 0; agem < air.length; agem++) {
            this.air.add({
                key: "gems",
                setXY: {
                    x: air[agem].getX() * this.gemSize,
                    y: air[agem].getY() * this.gemSize
                },
                frame: "air"
            });
        }
        console.log(this.air, this.fire, this.earth, this.sword, this.heart. this.water)
        /*
        for(let col = 0; col < this.gameLogic.getRows(); col ++){
            for(let row = 0; row < this.gameLogic.getColumns(); row ++){
                let gemX = this.gemSize * col + this.gemSize / 2;
                let gemY = this.gemSize * row + this.gemSize / 2;
                let gem = this.physics.add.sprite(gemX, gemY, "gems", this.gameLogic.getVal(row, col).getGemType())
                gem.setInteractive();
                this.gems.add(gem);
                this.physics.add.collider(gem, this.ground);
                this.gameLogic.getVal(row, col).setSprite(gem);
            }
        }*/
        console.log(this.gems);
    }

    gemSelect(pointer){
        if(this.gameLogic.canPick){
            var row = Math.floor((pointer.y) / this.gemSize);
            var col = Math.floor((pointer.x) / this.gemSize);
            if(row < this.gameLogic.getRows() && col < this.gameLogic.getColumns()){
                var gem = this.gameLogic.getVal(row, col);
                if(this.selectedGem != null){
                    let canSwap = this.gameLogic.canSwap(this.selectedGem, gem);
                    if(canSwap == true) {
                        this.gameLogic.swapGems(this.selectedGem, gem);
                        let gemSet = this.gameLogic.getMatches();
                        this.gameLogic.destroyGems(gemSet);
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
