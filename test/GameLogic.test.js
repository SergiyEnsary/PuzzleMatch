const GameLogic = require("../js/javascript/GameLogic");
describe("Test GameLogic", () => {
    it("Board generation", () => {
        expect(new GameLogic({rows: 4, columns: 3}).board)
            .toStrictEqual([[0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3]])
        expect(new GameLogic({rows: 3, columns: 2}))
                .toEqual({board: [[0, 1, 2], [0, 1, 2]], columns: 2, rows: 3})
    });
    it("Test getRows, getColumns, getBoard", () => {
        let gameLogic = new GameLogic({rows: 4, columns: 3});
        expect(gameLogic.getRows()).toStrictEqual(4)
        expect(gameLogic.getColumns()).toStrictEqual(3)
        expect(gameLogic.getBoard()).toStrictEqual([[0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3]])
    });
    /*it("Test Random", () => {
        let gameLogic = new GameLogic({rows: 4, columns: 3});
        expect(gameLogic.random(0, 100)).toBeLessThan(100)
        expect(gameLogic.random(0, 100)).toBeGreaterThanOrEqual(0)
    })*/
});
