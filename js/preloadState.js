var preloadState = {init: initP, preload: preloadP, create: createP};

function initP() {
    // 나중에 해상도 관련된 코드가 추가될 것
}

function preloadP() {
    // 리소스들 불러오는 곳
    let g = game;
    
    g.load.image('bg', 'assets/images/background.png');
    g.load.image('cook', 'assets/images/cook.png');
    g.load.image('customer', 'assets/images/customer.png');
    g.load.image('minigame', 'assets/images/button1.png');
    g.load.image('cooking', 'assets/images/button2.png');
    g.load.image('hiring', 'assets/images/button3.png');
}

function createP() {
    // home state 불러오는 곳
    let g = game;
    
    g.state.start('homeState');
}