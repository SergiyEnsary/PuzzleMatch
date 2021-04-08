class GameLogic{

    constructor(game){
        this.rows = game.rows;
        this.columns = game.columns;
        this.board = this.generateBoard(this.columns, this.rows);
    }

    /*
     *  Generate a board[column][row] with the
     *  number of columns and rows provided
     */
    generateBoard(cols, rows){
        var board = [];
        for(let column = 0; column<cols; column++){
            board[column] = [];
            for(let row = 0; row<rows; row++){
                board[column][row] = row;
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
                this.board[col][row] = this.random(0, num);
            }
        }
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
     * Get specific board value
     */
    getVal(row, col){
        if(this.isInRange(0, this.getRows(), row) && this.isInRange(0, this.getColumns(), col)) {
            return this.board[col][row]
        }
        throw new Error("getVal out of range");
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
     * min(inclusive) and max(exlusive)
     */
    isInRange(min, max, value){
        return min <= value && value < max;
    }
}

module.exports = GameLogic;
