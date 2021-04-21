const GameLogic = require("../javascript/GameLogic.js")
class GameScene extends Phaser.Scene{

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
        this.air = this.add.group();
        this.earth = this.add.group();
        this.water = this.add.group();
        this.sword = this.add.group();
        this.heart = this.add.group();
        this.fire = this.add.group();
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
            this.water.create(
                water[wgem].getX() * this.gemSize + this.gemSize,
                water[wgem].getY() * this.gemSize + this.gemSize,
                "gems",
                0
            );
        }
        for(let sgem = 0; sgem < sword.length; sgem++) {
            this.sword.create(
                sword[sgem].getX() * this.gemSize + this.gemSize,
                sword[sgem].getY() * this.gemSize + this.gemSize,
                "gems",
                1);
        }
        for(let fgem = 0; fgem < fire.length; fgem++) {
            this.fire.create(
                fire[fgem].getX() * this.gemSize + this.gemSize,
                fire[fgem].getY() * this.gemSize + this.gemSize,
                "gems",
                2
            );
        }
        for(let hgem = 0; hgem < heart.length; hgem++) {
            this.heart.create(
                heart[hgem].getX() * this.gemSize + this.gemSize,
                heart[hgem].getY() * this.gemSize + this.gemSize,
                "gems",
                3
            );
        }
        for(let egem = 0; egem < earth.length; egem++) {
            this.earth.create(
                earth[egem].getX() * this.gemSize + this.gemSize,
                earth[egem].getY() * this.gemSize + this.gemSize,
                "gems",
                4
            );
        }
        for(let agem = 0; agem < air.length; agem++) {
            this.air.create(
                air[agem].getX() * this.gemSize + this.gemSize,
                air[agem].getY() * this.gemSize + this.gemSize,
                "gems",
                5
            );
        }
        console.log(this.air, this.fire, this.earth, this.sword, this.heart, this.water)
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
    update(time, delta) {
        super.update(time, delta);
    }
}

module.exports = GameScene;
