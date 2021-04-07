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
     * Return a random number within range min < max(exclusive)
     */
    random(min, max){
        return Math.random() * (max - min) + min;
    }
}

module.exports = GameLogic
