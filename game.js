import "phaser";

let game;
var timedEvent;
let gameOptions = {
    gemSize: 50,
    swapSpeed: 200,
    fallSpeed: 100,
    destroySpeed: 200,
    boardOffset: {
        x: 100,
        y: 50
    }
};
let gameConfig = {
    width: 600,
    height: 600,
    scene: [GameScene, EndGameScene],
    backgroundColor: 0x222222
};
game = new Phaser.Game(gameConfig);
window.focus();
resize();
window.addEventListener("resize", resize, false);

function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
