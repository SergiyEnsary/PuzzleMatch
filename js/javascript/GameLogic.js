const Gem = require("./Gem.js")
class GameLogic{

    constructor(game){
        this.rows = game.rows;
        this.columns = game.columns;
        this.canPick = true;
        this.board = [];
        this.gems = game.gems;
    }

    /*
     *  Generate a board with gemType
     */
    generateBoard(cols, rows){
        for(let column = 0; column<cols; column++){
            this.board[column] = [];
            for(let row = 0; row<rows; row++){
                this.board[column][row] = new Gem(column, row, row);
            }
        }
    }

    /*
     * Randomize board with random
     * numbers within input range
     */
    randomCreate(num){
        for(let col = 0; col < this.getColumns(); col++){
            this.board[col] = [];
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
        temp1.setSprite(gem2.getSprite());
        temp2.setSprite(gem1.getSprite());
        this.setVal(gem1.getY(), gem1.getX(), temp1);
        this.setVal(gem2.getY(), gem2.getX(), temp2);
    }

    /*
     * Destroy selected gems
     */
    destroyGems(gemSet){
        for(let item of gemSet.values()){
            this.gemDelete(item);
        }
        this.updateGems();
    }

    /*
     * Remove a gem
     */
    gemDelete(gem){
        let row = gem.getY()
        let board = this.getBoard()[gem.getX()];
        board.splice(row, 1);
    }

    /*
     * Are two gems next to each other and will they make a match
     */
    canSwap(gem1, gem2){
        if(this.adjacentX(gem1, gem2) || this.adjacentY(gem1, gem2)){
            return (this.makesMatch(gem1, gem2));
        }
        return false;
    }

    /*
     * Are two gems adjacent on X with the same y values
     */
    adjacentX(gem1, gem2){
        let xAdjacent = Math.abs(gem1.getX() - gem2.getX()) == 1;
        return (xAdjacent && gem1.getY() === gem2.getY());
    }

    /*
     * Are two gems adjacent on Y with the same x values
     */
    adjacentY(gem1, gem2){
        let yAdjacent = Math.abs(gem1.getY() - gem2.getY()) == 1;
        return (yAdjacent && gem1.getX() === gem2.getX());
    }

    /*
     * Is there a horizontal match
     */
    isHorizontal(){
        for(let col = 1; col < this.getColumns()-1; col++){
            for(let row = 0; row < this.getRows(); row ++){
                let gem1 = this.getVal(row, col-1).getGemType();
                let gem2 = this.getVal(row, col).getGemType();
                let gem3 = this.getVal(row, col+1).getGemType();
                if(gem1 === gem2 && gem1 === gem3){
                    return true;
                }
            }
        }
        return false;
    }

    /*
     * Is there a vertical match
     */
    isVertical(){
        for(let col = 0; col < this.getColumns(); col++){
            for(let row = 1; row < this.getRows()-1; row ++){
                let gem1 = this.getVal(row-1, col).getGemType();
                let gem2 = this.getVal(row, col).getGemType();
                let gem3 = this.getVal(row+1, col).getGemType();
                if(gem1 === gem2 && gem1 === gem3){
                    return true;
                }
            }
        }
        return false;
    }

    /*
      * Shuffle the current board until new moves arise
      * while maintaining the same gems
      */
    shuffle(){
        var gemList = [];
        for(let col = 0; col < this.getColumns(); col++){
            for(let row = 0; row < this.getRows(); row++){
                gemList.push(this.getVal(row, col));
            }
        }
        for(let col = 0; col < this.getColumns(); col++){
            for(let row = 0; row < this.getRows(); row++){
                var gemIndex = this.random(0, gemList.length);
                var gem = gemList[gemIndex];
                gem.setX(col);
                gem.setY(row);
                this.setVal(row, col, gem);
                gemList.splice(gemIndex, 1);
            }
        }
        if(this.isVertical() || this.isHorizontal()){
            this.shuffle();
        }
    }

    /*
     * Does this move make a match
     */
    makesMatch(gem1, gem2){
        let gem1X = gem1.getX(); let gem1Y = gem1.getY();
        let gem2X = gem2.getX(); let gem2Y = gem2.getY();
        this.swapGems(this.getVal(gem1Y, gem1X), this.getVal(gem2Y, gem2X))
        if(this.isVertical() || this.isHorizontal()){
            this.swapGems(this.getVal(gem1Y, gem1X), this.getVal(gem2Y, gem2X))
            return true;
        }
        this.swapGems(this.getVal(gem1Y, gem1X), this.getVal(gem2Y, gem2X))
        return false;
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
     * Set new column in the board
     */
    setCol(col, array){
        this.board[col] = array;
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

    /*
     * Return a set of all gems that make up matches
     */
    getMatches() {
        let gemList = new Set();
        for(let col = 1; col < this.getColumns()-1; col++){
            for(let row = 0; row < this.getRows(); row++){
                let gem1 = this.getVal(row, col-1);
                let gem2 = this.getVal(row, col);
                let gem3 = this.getVal(row, col+1);
                if(gem1.getGemType() === gem2.getGemType() && gem1.getGemType() === gem3.getGemType()){
                    gemList.add(gem1);
                    gemList.add(gem2);
                    gemList.add(gem3);
                }
            }
        }
        for(let col = 0; col < this.getColumns(); col++){
            for(let row = 1; row < this.getRows()-1; row++){
                let gem1 = this.getVal(row-1, col);
                let gem2 = this.getVal(row, col);
                let gem3 = this.getVal(row+1, col);
                if(gem1.getGemType() === gem2.getGemType() && gem1.getGemType() === gem3.getGemType()){
                    gemList.add(gem1);
                    gemList.add(gem2);
                    gemList.add(gem3);
                }
            }
        }
        return gemList;
    }

    updateGems() {
        for(let col = 0; col < this.getColumns(); col++){
            let lengthOfCol = this.getBoard()[col].length;
            if(lengthOfCol < this.getRows()) {
                let newGemList = new Array(this.getRows() - lengthOfCol);
                for (let newRow = 0; newRow < newGemList.length; newRow++) {
                    newGemList[newRow] = new Gem(col, newRow, this.random(0, this.gems));
                }
                this.setCol(col, newGemList.concat(this.getBoard()[col]));
            }
            for(let row = 0; row < this.getRows(); row++){
                this.getVal(row, col).setY(row);
            }
        }
    }

    getGems(gemType) {
        let gemList = [];
        for(let col = 0; col < this.getColumns(); col++){
            for(let row = 0; row < this.getRows(); row++){
                let gem = this.getVal(row, col);
                if(gem.getGemType() === gemType){
                    gemList.push(gem);
                }
            }
        }
        return gemList;
    }
}

module.exports = GameLogic;
