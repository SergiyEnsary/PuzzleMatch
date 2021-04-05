let game;

let gameOptions = {
    gemSize: 50
};

let gameConfig = {
    width : 600,
    height: 600,
    scene: [GameScene],
    backgroundColor: 0x222222
};

game = new Phaser.Game(gameConfig);
window.focus();
