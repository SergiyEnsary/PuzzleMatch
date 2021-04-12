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

    setGemType(type){
        this.type = type;
    }

    setX(x){
        this.x = x;
    }

    setY(y){
        this.y = y;
    }
}

module.exports = Gem;
