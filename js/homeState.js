var homeState = {init: initH, preload:preloadH, create:createH};

function initH(msg) {
    // game start, game over에 대한 메시지 표시 나중에 추가됨
    let g = game;
    g.gameOverMsg = msg;
}

function preloadH() {
    // home에 대한 ... 내용이 추가될듯. 대기실 배경 같은 것.
    // 일단 그냥 게임 배경 넣음.
    let g = game;
    g.load.image('back', 'assets/images/background.png');
}

function createH() {
    // 터치하면 게임 스타트됨.
    let g = game;
    
    let bg = g.add.sprite(0,0,'back');
    bg.inputEnabled = true;
    bg.events.onInputDown.add(function() {
        g.state.start('gameState');
    })
    
    let style = {font: '30px arial', fill:'#00f'};
    let msg = g.add.text(g.world.centerX, g.world.height * 0.8, 'TOUCH to Start', style);
    msg.anchor.setTo(.5);
    
    if (g.gameOverMsg) {
        let style2 = {font: '30px arial', fill:'#f00'}
        let msg2 = g.add.text(g.world.centerX, g.world.centerY, g.gameOverMsg, style2);
        msg2.anchor.setTo(.5);
    }
}