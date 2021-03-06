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

        let rv = [{
            row: gem2.getY(),
            column: gem2.getX(),
            gem: temp1
        },
            {
                row: gem1.getY(),
                column: gem1.getX(),
                gem: temp2
            }]
        return rv;
    }

    /*
     * Destroy selected gems
     */
    destroyGemSet(gemSet){
        for(let i = 0; i<gemSet.length; i++) {
            this.gemDelete(gemSet[i]);
        }
    }

    /*
     * Remove a gem
     */
    gemDelete(gem){
        if(this.getVal(gem.getY(), gem.getX()) !== null) {
            this.setVal(gem.getY(), gem.getX(), null);
        }
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
        let gem1col = gem1.getX(); let gem1row = gem1.getY();
        let gem2col = gem2.getX(); let gem2row = gem2.getY();
        return (this.isPartOfMatch(gem1row, gem1col, gem2.getGemType()) || this.isPartOfMatch(gem2row, gem2col, gem1.getGemType()))
    }

    // returns true if the item at (row, column) is part of a match
    isPartOfMatch(row, column, type){
        let horizontal = this.isPartOfHorizontalMatch(row, column, type);
        let vertical = this.isPartOfVerticalMatch(row, column, type);
        return horizontal || vertical;
    }

    // returns true if the item at (row, column) is part of an horizontal match
    isPartOfHorizontalMatch(row, column, type) {
        let check1;
        let check2;
        let check3;
        try {
            check1 = (type === this.getVal(row, column - 1).getGemType() && type === this.getVal(row, column - 2).getGemType());
        } catch (e) {
            check1 = false;
        }
        try {
            check2 = (type === this.getVal(row, column + 1).getGemType() && type === this.getVal(row, column + 2).getGemType());
        } catch (e) {
            check2 = false
        }
        try {
            check3 = (type === this.getVal(row, column - 1).getGemType() && type === this.getVal(row, column + 1).getGemType());
        } catch (e) {
            check3 = false
        }
        return check1 || check2 || check3;
    }

    // returns true if the item at (row, column) is part of an horizontal match
    isPartOfVerticalMatch(row, column, type){
        let check1;
        let check2;
        let check3;
        try {
            check1 = (type === this.getVal(row - 1, column).getGemType() && type === this.getVal(row - 2, column).getGemType());
        } catch (e) {check1 = false;}
        try{
            check2 = (type === this.getVal(row + 1, column).getGemType() && type === this.getVal(row + 2, column).getGemType());
        } catch (e) {check2 = false}
        try{
            check3 = (type === this.getVal(row - 1, column).getGemType() && type === this.getVal(row + 1, column).getGemType());
        } catch (e) {check3 = false}
        return check1 || check2 || check3;
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
        for (let col = 0; col < this.getColumns(); col++) {
            for (let row = 0; row < this.getRows(); row++) {
                let gem = this.getVal(row, col);
                if(gem !== null) {
                    if (this.isPartOfMatch(row, col, gem.getGemType())) {
                        gemList.add(gem);
                    }
                }
            }
        }
        console.log(Array.from(gemList));
        return Array.from(gemList);
    }

    /*
     * Create new gems to replenish destroyed ones
     * Returns list of new gems
     */
    replenishGems() {
        let newGems = [];
        for(let col = 0; col < this.getColumns(); col++) {
            for (let row = 0; row < this.getRows(); row++) {
                if(this.getVal(row, col) === null) {
                    let below = this.emptySpacesBelow(row, col);
                    let newGem = new Gem(col, row, this.random(0, this.gems));
                    this.setVal(row, col, newGem);
                    newGems.push({
                        row: row,
                        column: col,
                        deltaRow: below,
                        gem: newGem
                    });
                }
            }
        }
        return newGems;
    }

    // returns the amount of empty spaces below the item at (row, column)
    emptySpacesBelow(row, column){
        let result = 0;
        for(let index = row+1; index < this.getRows(); index++) {
            if(this.getVal(index, column) === null){
                result += 1;
            }
        }
        return result;
    }

    /*
     * Returns list of all gems that need to be moved
     */
    arrangeBoardAfterMatch(){
        let result = [];
        for(let col = 0; col < this.getColumns(); col++){
            for(let row = this.getRows()-1; row >= 0; row--){
                let emptySpaces = this.emptySpacesBelow(row, col);
                if(emptySpaces > 0 && this.getVal(row, col) !== null){
                    let gem = this.getVal(row, col)
                    gem.setY(row);
                    this.setVal(row + emptySpaces, col, gem);
                    this.setVal(row, col, null);
                    result.push({
                        row: gem.getY() + emptySpaces,
                        column: gem.getX(),
                        deltaRow: emptySpaces,
                    });
                }
            }
        }
        return result;
    }
}

module.exports = GameLogic;
