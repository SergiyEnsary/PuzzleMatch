const GameLogic = require("../js/javascript/GameLogic");
describe("Test GameLogic", () => {
    it("Board generation", () => {
        expect(new GameLogic({rows: 4, columns: 3}).board)
            .toStrictEqual([[0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3]])
        expect(new GameLogic({rows: 3, columns: 2}))
                .toEqual({board: [[0, 1, 2], [0, 1, 2]], columns: 2, rows: 3})
    });
    it("Test getRows, getColumns, getBoard", () => {
        let board = new GameLogic({rows: 4, columns: 3});
        expect(board.getRows()).toStrictEqual(4)
        expect(board.getColumns()).toStrictEqual(3)
        expect(board.getBoard()).toStrictEqual([[0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3]])
    });
});
