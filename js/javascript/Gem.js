class Gem {

    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    getGemType(){
        return this.type;
    }
}

module.exports = Gem;
