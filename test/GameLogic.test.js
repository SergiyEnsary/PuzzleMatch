const GameLogic = require("../js/javascript/GameLogic.js");
const Gem = require("../js/javascript/Gem.js");

describe("Test Files", () => {
    let game1 = new GameLogic({rows: 2, columns: 2, gemTypes: [1, 2, 3, 4, 5, 6]});
    let expected = [
        [new Gem(0,0,0), new Gem(0,1,1)],
        [new Gem(1,0,0), new Gem(1,1,1)]
    ];

    it("Board constructor", () => {
        expect(game1.board).toStrictEqual([]);
        expect(game1).toEqual({board: [], columns: 2, rows: 2, canPick: true});
    });
    it("Test Getters", () => {
        let gb2 = new GameLogic({rows: 3, columns: 1, gems: 1});
        let gb3 = new GameLogic({rows: 1, columns: 3, gems: 1});
        gb2.generateBoard(1,3);
        gb3.generateBoard(3,1)

        gb2.setVal(0,0, new Gem(0,0,0));
        gb2.setVal(1,0, new Gem(0,1,0));
        gb2.setVal(2,0, new Gem(0,2,0));

        gb3.setVal(0,0, new Gem(0,0,0));
        gb3.setVal(0,1, new Gem(1,0,0));
        gb3.setVal(0,2, new Gem(2,0,0));

        game1.generateBoard(2,2);

        let set2 = new Set();
        set2.add(gb2.getVal(0,0));
        set2.add(gb2.getVal(1,0));
        set2.add(gb2.getVal(2,0));
        expect(gb2.getMatches()).toEqual([
            {
                "sprite": null,
                "type": 0,
                "x": 0,
                "y": 0
            },
            {
                "sprite": null,
                "type": 0,
                "x": 0,
                "y": 1
            },
            {
                "sprite": null,
                "type": 0,
                "x": 0,
                "y": 2
            }
        ]);
        gb2.destroyGemSet(gb2.getMatches());
        gb2.replenishGems();

        let set3 = new Set();
        set3.add(gb3.getVal(0,0));
        set3.add(gb3.getVal(0,1));
        set3.add(gb3.getVal(0,2));
        expect(gb3.getMatches()).toEqual([
            {
                "sprite": null,
                "type": 0,
                "x": 0,
                "y": 0
            },
            {
                "sprite": null,
                "type": 0,
                "x": 1,
                "y": 0
            },
            {
                "sprite": null,
                "type": 0,
                "x": 2,
                "y": 0
            }
        ]);
        gb3.destroyGemSet(gb3.getMatches());
        gb3.replenishGems();

        expect(game1.getRows()).toStrictEqual(2);
        expect(game1.getColumns()).toStrictEqual(2);
        expect(game1.getBoard()).toStrictEqual(expected);
        for(let col = 0; col < game1.getColumns(); col++) {
            for (let row = 0; row < game1.getRows(); row++) {
                let boardVal = game1.getVal(row, col);
                expect(boardVal).toStrictEqual(game1.getVal(row, col));
                expect(game1.getRow(boardVal)).toEqual(row);
                expect(game1.getColumn(boardVal)).toEqual(col);
            }
        }
        expect(()=>{game1.getVal(5,4)}).toThrow("getVal out of range");
    });
    it("Test Setters", () =>{
        let gameLogic = new GameLogic({rows: 4, columns: 3});
        gameLogic.generateBoard(3,4);
        expect(gameLogic.setVal(0,0,5)).toBe(true);
        expect(gameLogic.setVal(-1,0,5)).toBe(false);
        expect(gameLogic.setVal(5,0,5)).toBe(false);
        expect(gameLogic.setVal(0,-1,5)).toBe(false);
        expect(gameLogic.setVal(0,4,5)).toBe(false);
    });
    it("Test Gem Swap", () => {
        let gameBoard = new GameLogic({rows:8, columns:8});
        let gb2 = new GameLogic({rows: 1, columns: 2});
        gb2.randomCreate(2);
        gameBoard.generateBoard(8,8);
        let gem1 = gameBoard.getVal(3,3);
        let gem1Type = gem1.getGemType();
        let gem2 = gameBoard.getVal(3,4);
        let gem2Type = gem2.getGemType();
        let gem3 = gameBoard.getVal(4,4);
        expect(gameBoard.adjacentX(gem1, gem2)).toEqual(true);
        expect(gameBoard.adjacentY(gem1, gem2)).toEqual(false);
        expect(gameBoard.canSwap(gem1, gem2)).toEqual(true);
        expect(gameBoard.canSwap(gem1, gem3)).toEqual(false);
        gameBoard.swapGems(gem1, gem2);
        expect(gameBoard.getVal(0,0).getGemType()).toEqual(0);
        expect(gameBoard.getVal(0,1).getGemType()).toEqual(0);
        gameBoard.shuffle();
        expect(gameBoard.canSwap(gem2, gem3)).toEqual(false);
        expect(gb2.canSwap(gb2.getVal(0,0), gb2.getVal(0,1))).toStrictEqual(false);
        gameBoard.arrangeBoardAfterMatch();

    })
    it("Test Utils", () => {
        let gameLogic = new GameLogic({rows: 4, columns: 3});
        let gb2 = new GameLogic({rows: 1, columns: 3});
        gb2.generateBoard(3, 1);
        let gb3 = new GameLogic({rows: 3, columns: 1});
        gb3.generateBoard(1,3);
        gb3.setVal(0,0, new Gem(0,0,0))
        gb3.setVal(1,0, new Gem(0,1,0))
        gb3.setVal(2,0, new Gem(0,2,0))
        expect(gb2.isHorizontal()).toEqual(true);
        expect(gb3.isVertical()).toEqual(true);
        expect(gameLogic.random(0, 100)).toBeLessThan(100)
        expect(gameLogic.random(0, 100)).toBeGreaterThanOrEqual(0)
        expect(gameLogic.isInRange(0,5,5)).toBe(false)
        expect(gameLogic.isInRange(0,5,-1)).toBe(false)
        expect(gameLogic.isInRange(0,5,3)).toBe(true)
        gb3.setCol(0, [])
    })
    it("Test Random Board Generation", () => {
        game1.randomCreate(6);
        for(let col = 0; col < game1.getColumns(); col++) {
            for(let row = 0; row < game1.getRows(); row++) {
                let value = game1.getVal(row, col);
                expect(value).toBeInstanceOf(Gem)
            }
        }
    })

    let gem0 = new Gem(0,0,0);
    let gem1 = new Gem(1,0,1);
    let gem2 = new Gem(1,1,2);
    it("Gem creation", () => {
        expect(gem0).toEqual({ x: 0, y: 0, type: 0, sprite: null })
        expect(gem1).toEqual({ x: 1, y: 0, type: 1, sprite: null })
        expect(gem2).toEqual({ x: 1, y: 1, type: 2, sprite: null })
    })
    it("Gem getters", () =>{
        expect(gem0.getX()).toEqual(0)
        expect(gem0.getY()).toEqual(0)
        expect(gem0.getGemType()).toEqual(0)
        expect(gem0.getSprite()).toEqual(null)

        expect(gem1.getX()).toEqual(1)
        expect(gem1.getY()).toEqual(0)
        expect(gem1.getGemType()).toEqual(1)
        expect(gem1.getSprite()).toEqual(null)

        expect(gem2.getX()).toEqual(1)
        expect(gem2.getY()).toEqual(1)
        expect(gem2.getGemType()).toEqual(2)
        expect(gem2.getSprite()).toEqual(null)
    })
    it("Gem setters", () =>{
        gem0.setX(1)
        gem0.setY(1)
        gem0.setGemType(1)
        gem0.setSprite("test")
        expect(gem0.getX()).toEqual(1)
        expect(gem0.getY()).toEqual(1)
        expect(gem0.getGemType()).toEqual(1)
        expect(gem0.getSprite()).toEqual("test")
    })
});
