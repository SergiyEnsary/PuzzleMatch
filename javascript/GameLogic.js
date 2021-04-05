class GameLogic{

    constructor(game){
        this.rows = game.rows;
        this.columns = game.columns;
        this.generateBoard();
    }

    generateBoard(){
        this.board = [];
        for(let column = 0; column<this.columns; column++){
            this.board[column] = [];
            for(let row = 0; row<this.rows; row++){
                this.board[column][row] = row;
            }
        }
    }
}
