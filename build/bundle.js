(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Gem = require("./Gem.js")
class GameLogic{

    constructor(game){
        this.rows = game.rows;
        this.columns = game.columns;
        this.canPick = true;
        this.gemTypes = game.gemTypes;
        this.board = this.generateBoard(this.columns, this.rows, game.gems);
    }

    /*
     *  Generate a board with gemType
     */
    generateBoard(cols, rows){
        var board = [];
        for(let column = 0; column<cols; column++){
            board[column] = [];
            for(let row = 0; row<rows; row++){
                board[column][row] = new Gem(column, row, row);
            }
        }
        return board;
    }

    /*
     * Randomize board with random
     * numbers within input range
     */
    randomCreate(num){
        for(let col = 0; col < this.getColumns(); col++){
            for(let row = 0; row < this.getRows(); row++){
                this.board[col][row] = new Gem(col, row, this.random(0, num));
            }
        }
    }

    /*
     * Swap places of gem1 and gem2
     */
    swapGems(gem1, gem2){
        let temp1 = new Gem(gem1.getX(), gem1.getY(), gem2.getGemType());
        let temp2 = new Gem(gem2.getX(), gem2.getY(), gem1.getGemType());
        this.setVal(gem1.getY(), gem1.getX(), temp1);
        this.setVal(gem2.getY(), gem2.getX(), temp2);
    }

    /*
     * Return number of rows on this board
     */
    getRows(){
        return this.rows;
    }

    /*
     * Return number of columns on this board
     */
    getColumns(){
        return this.columns;
    }

    /*
     * Return the board
     */
    getBoard(){
        return this.board;
    }

    /*
     * Get specific Gem at row and column
     */
    getVal(row, col){
        if(this.isInRange(0, this.getRows(), row) && this.isInRange(0, this.getColumns(), col)) {
            return this.board[col][row];
        }
        throw new Error("getVal out of range");
    }

    /*
     * Return board row of the gem
     */
    getRow(gem){
        return gem.getY();
    }

    /*
     * Return board column of the gem
     */
    getColumn(gem){
        return gem.getX();
    }

    /*
     * Set specific board value
     * Return true if set
     */
    setVal(row, col, value){
        if(this.isInRange(0, this.getRows(), row) && this.isInRange(0, this.getColumns(), col)) {
            this.board[col][row] = value;
            return true;
        }
        return false;
    }

    /*
     * Return a random number within range min < max(exclusive)
     */
    random(min, max){
        return Math.floor(Math.random() * (max - min) + min);
    }

    /*
     * Check if number within range
     * min(inclusive) and max(exclusive)
     */
    isInRange(min, max, value){
        return min <= value && value < max;
    }
}

module.exports = GameLogic;

},{"./Gem.js":2}],2:[function(require,module,exports){
class Gem {

    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.sprite = null;
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    getGemType(){
        return this.type;
    }

    getSprite(){
        return this.sprite;
    }

    setGemType(type){
        this.type = type;
    }

    setX(x){
        this.x = x;
    }

    setY(y){
        this.y = y;
    }

    setSprite(sprite){
        this.sprite = sprite;
    }
}

module.exports = Gem;

},{}],3:[function(require,module,exports){
const GameScene = require("../scenes/GameScene.js")
let game;
let config = {
    type: Phaser.AUTO,
    width : 600,
    height: 600,
    parent: 'phaser-game',
    scene: [GameScene],
    physics:{
        default: 'arcade',
        arcade:{
            debug:true
        }
    }
};

game = new Phaser.Game(config);
window.focus();

},{"../scenes/GameScene.js":4}],4:[function(require,module,exports){
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
        this.drawField();
        console.log(this.gameLogic.getBoard())
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

},{"../javascript/GameLogic.js":1}]},{},[3,4,1,2]);
