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
    g.load.image('buying', 'assets/images/button4.png');
    g.load.image('toy', 'assets/images/toy.png');
}

var buffer = {};

function createP() {
    // home state 불러오는 곳
    let g = game;
    
    // set dat.gui
    gui.add(world, 'money', 0, 50000).listen();
    gui.add(world, 'fame', 0, 200).listen();
    gui.add(world, 'ingredient1', 0, 100).listen();
    gui.add(world, 'ingredient2', 0, 100).listen();
    gui.add(world, 'food1', 0, 10).listen();
    gui.add(world, 'food2', 0, 10).listen();
    gui.add(world, 'mode').listen();
    // gui.add(g.cook.params, 'happy', 0,100).listen();
    // gui.add(g.customer.params, 'endurance', 0, 100).listen();
    
    copyProperties(world, buffer);
    console.log(buffer);
    
    g.state.start('homeState');
}

function copyProperties(input, output) {
    // copy from a to b
    for(var prop in input) {
        if (Array.isArray(input[prop])) {
            var res= [];
            for(var i in input[prop]) {
                res[i] = input[prop][i];
            }
            console.log(res);
            output[prop] = res;
        }
        else {
            let value = input[prop];
            output[prop] = value;
        }        
    }
}
