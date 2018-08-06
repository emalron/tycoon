var homeState = {init: initH, preload:preloadH, create:createH};

function initH() {
    // game start, game over에 대한 메시지 표시 나중에 추가됨
}

function preloadH() {
    // home에 대한 ... 내용이 추가될듯. 대기실 배경 같은 것.
}

function createH() {
    // 터치하면 게임 스타트됨.
    let g = game;
    g.state.start('gameState');
}