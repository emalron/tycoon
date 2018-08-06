var gWid = 640;
var gHig = 360;
var game = new Phaser.Game(gWid, gHig, Phaser.Auto);

game.state.add('preloadState', preloadState);
game.state.add('homeState', homeState);
game.state.add('gameState', gameState);
game.state.start('preloadState');