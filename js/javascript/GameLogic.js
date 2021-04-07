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

    getRows(){
        return this.rows;
    }

    getColumns(){
        return this.columns;
    }

    getBoard(){
        return this.board;
    }

    random(min, max){
        return Phaser.Math.Between(min, max);
    }
}

module.exports = GameLogic
