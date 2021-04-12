const GameScene = require("../scenes/GameScene.js")
let game;
let config = {
    width : 600,
    height: 600,
    scene: [GameScene],
    backgroundColor: 0x222222
};

game = new Phaser.Game(config);
window.focus();
