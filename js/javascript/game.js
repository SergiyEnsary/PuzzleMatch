const GameScene = require("../scenes/GameScene.js")
let game;
let config = {
    type: Phaser.AUTO,
    width : 600,
    height: 600,
    parent: 'phaser-game',
    scene: [GameScene],
    physics:{
        default: 'arcade',
        arcade:{
            debug:true
        }
    }
};

game = new Phaser.Game(config);
window.focus();
