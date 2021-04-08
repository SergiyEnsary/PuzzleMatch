const GameLogic = require("../js/javascript/GameLogic");
describe("Test GameLogic", () => {
    it("Board generation", () => {
        expect(new GameLogic({rows: 4, columns: 3}).board)
            .toStrictEqual([[0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3]])
        expect(new GameLogic({rows: 3, columns: 2}))
                .toEqual({board: [[0, 1, 2], [0, 1, 2]], columns: 2, rows: 3})
    });
    it("Test Getters", () => {
        let gameLogic = new GameLogic({rows: 4, columns: 3});
        expect(gameLogic.getRows()).toStrictEqual(4)
        expect(gameLogic.getColumns()).toStrictEqual(3)
        expect(gameLogic.getBoard()).toStrictEqual([[0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3]])
        for(let col = 0; col < gameLogic.getColumns(); col++) {
            for (let row = 0; row < gameLogic.getRows(); row++) {
                expect(gameLogic.getVal(row, col)).toStrictEqual(gameLogic.getVal(row, col))
            }
        }
        expect(()=>{
            gameLogic.getVal(5,4)
        }).toThrow("getVal out of range");
    });
    it("Test Setters", () =>{
        let gameLogic = new GameLogic({rows: 4, columns: 3});
        expect(gameLogic.setVal(0,0,5)).toBe(true)
        expect(gameLogic.setVal(-1,0,5)).toBe(false)
        expect(gameLogic.setVal(5,0,5)).toBe(false)
        expect(gameLogic.setVal(0,-1,5)).toBe(false)
        expect(gameLogic.setVal(0,4,5)).toBe(false)
    });
    it("Test Utils", () => {
        let gameLogic = new GameLogic({rows: 4, columns: 3});
        expect(gameLogic.random(0, 100)).toBeLessThan(100)
        expect(gameLogic.random(0, 100)).toBeGreaterThanOrEqual(0)
        expect(gameLogic.isInRange(0,5,5)).toBe(false)
        expect(gameLogic.isInRange(0,5,-1)).toBe(false)
        expect(gameLogic.isInRange(0,5,3)).toBe(true)
    })
    it("Test Random Board Generation", () => {
        let gameLogic = new GameLogic({rows: 4, columns: 3});
        gameLogic.randomCreate(6);
        for(let col = 0; col < gameLogic.getColumns(); col++) {
            for(let row = 0; row < gameLogic.getRows(); row++) {
                let value = gameLogic.getVal(row, col)
                expect(value).toStrictEqual(value)
                expect(value).toBeGreaterThanOrEqual(0)
                expect(value).toBeLessThan(6)
            }
        }
    })
});
