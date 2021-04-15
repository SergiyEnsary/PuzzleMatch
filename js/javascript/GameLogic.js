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
     * Are two gems next to each other and will they make a match
     */
    canSwap(gem1, gem2){
        if(this.adjacentX(gem1, gem2) || this.adjacentY(gem1, gem2)){
            return true;
        }
        return false;
    }

    /*
     * Are two gems adjacent on X with the same y values
     */
    adjacentX(gem1, gem2){
        let xAdjacent = Math.abs(gem1.getX() - gem2.getX()) <= 1;
        return (xAdjacent && gem1.getY() === gem2.getY());
    }

    /*
     * Are two gems adjacent on Y with the same x values
     */
    adjacentY(gem1, gem2){
        let yAdjacent = Math.abs(gem1.getY() - gem2.getY()) <= 1;
        return (yAdjacent && gem1.getX() === gem2.getX());
    }

    /* Commented out since it is not yet used or tested
    /!*
     * Is there a horizontal match
     *!/
    isHorizontal(){
        var matched = 1;
        for(let col = 1; col < this.getColumns(); col++){
            for(let row = 0; row < this.getRows(); row ++){
                let gem = this.getVal(row, col);
                if(gem.getGemType() !== this.getVal(row, col-1).getGemType()){
                    matched = 0;
                }
                matched += 1;
                if(matched >= 3){
                    return true;
                }
            }
        }
        return false;
    }

    /!*
     * Is there a vertical match
     *!/
    isVertical(){
        var matched = 1;
        for(let col = 0; col < this.getColumns(); col++){
            for(let row = 1; row < this.getRows(); row ++){
                let gem = this.getVal(row, col);
                if(gem.getGemType() !== this.getVal(row-1, col).getGemType()){
                    matched = 0;
                }
                matched += 1;
                if(matched >= 3){
                    return true;
                }
            }
        }
        return false;
    }
    */

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
