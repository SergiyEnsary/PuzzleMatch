const GameLogic = require("../js/javascript/GameLogic");
const Gem = require("../js/javascript/Gem");

describe("Test Files", () => {
    let game1 = new GameLogic({rows: 2, columns: 2, gemTypes: [1, 2, 3, 4, 5, 6]});
    let expected = [
        [new Gem(0,0,0), new Gem(0,1,1)],
        [new Gem(1,0,0), new Gem(1,1,1)]
    ]
    it("Board generation", () => {
        expect(game1.board).toStrictEqual(expected)
        expect(game1).toEqual({board: expected, columns: 2, rows: 2, gemTypes: [1, 2, 3, 4, 5, 6], canPick: true})
    });
    it("Test Getters", () => {
        expect(game1.getRows()).toStrictEqual(2)
        expect(game1.getColumns()).toStrictEqual(2)
        expect(game1.getBoard()).toStrictEqual(expected)
        for(let col = 0; col < game1.getColumns(); col++) {
            for (let row = 0; row < game1.getRows(); row++) {
                expect(game1.getVal(row, col)).toStrictEqual(game1.getVal(row, col))
            }
        }
        expect(()=>{
            game1.getVal(5,4)
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
        game1.randomCreate(6);
        for(let col = 0; col < game1.getColumns(); col++) {
            for(let row = 0; row < game1.getRows(); row++) {
                let value = game1.getVal(row, col);
                expect(value).toStrictEqual(value)
                expect(value).toBeGreaterThanOrEqual(0)
                expect(value).toBeLessThan(6)
            }
        }
    })

    let gem0 = new Gem(0,0,0);
    let gem1 = new Gem(1,0,1);
    let gem2 = new Gem(1,1,2);
    it("Gem creation", () => {
        expect(gem0).toEqual({ x: 0, y: 0, type: 0 })
        expect(gem1).toEqual({ x: 1, y: 0, type: 1 })
        expect(gem2).toEqual({ x: 1, y: 1, type: 2 })
    })
    it("Gem getters", () =>{
        expect(gem0.getX()).toEqual(0)
        expect(gem0.getY()).toEqual(0)
        expect(gem0.getGemType()).toEqual(0)

        expect(gem1.getX()).toEqual(1)
        expect(gem1.getY()).toEqual(0)
        expect(gem1.getGemType()).toEqual(1)

        expect(gem2.getX()).toEqual(1)
        expect(gem2.getY()).toEqual(1)
        expect(gem2.getGemType()).toEqual(2)
    })
});
