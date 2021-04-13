class Gem {

    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.sprite = null;
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

    getSprite(){
        return this.sprite;
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

    setSprite(sprite){
        this.sprite = sprite;
    }
}

module.exports = Gem;
