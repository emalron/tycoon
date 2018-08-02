var gameState = {preload: preload, create: create};
var gui = new dat.GUI();

function preload() {
    let g = game;
    g.load.image('bg', 'assets/images/restaurant.png');
    g.load.image('cook', 'assets/images/cook.png');
    g.load.image('customer', 'assets/images/customer.png');
    g.load.image('minigame', 'assets/images/button1.png');
    g.load.image('cooking', 'assets/images/button2.png');
}

function create() {
    let g = game;
    
    // draw entities
    g.background = g.add.sprite(0,0,'bg');
    
    g.cook = g.add.sprite(0.3*g.world.width, 0.5*g.world.height, 'cook');
    g.cook.anchor.setTo(.5);
    g.customer = g.add.sprite(0.8*g.world.width, 0.5*g.world.height, 'customer');
    g.customer.anchor.setTo(.5);
    g.mini = g.add.sprite(0.9*g.world.width-130, 0.9*g.world.height, 'minigame');
    g.mini.anchor.setTo(.5);
    g.cooking = g.add.sprite(0.9*g.world.width, 0.9*g.world.height, 'cooking');
    g.cooking.anchor.setTo(.5);
        
    // set parameters
    g.cook.params = {happy: 100, state: 'idle'};
    g.customer.params = {endurance: 100};
    
    // set input
    g.cook.inputEnabled = true;
    g.cook.events.onInputDown.add(cookWork, this);
    g.cook.input.enableDrag(true);
    g.mini.inputEnabled = true;
    g.mini.events.onInputDown.add(setState, this);
    g.cooking.inputEnabled = true;
    g.cooking.events.onInputDown.add(setState, this);
    g.customer.inputEnabled = true;
    g.customer.events.onInputDown.add(serving, this);
    
    // set timer event
    g.time.events.loop(1000, function() {
        let cus = g.customer;
        
        if(cus.params.endurance > 0) {
            cus.params.endurance -= 5;
        }
        else {
            world.fame -= 5;
            cus.params.endurance = 100;
        }
    })
    
    // set dat.gui
    gui.add(world, 'money', 0, 50000).listen();
    gui.add(world, 'fame', 0, 200).listen();
    gui.add(world, 'ingredient', 0, 10000).listen();
    gui.add(world, 'food', 0, 10).listen();
    gui.add(world, 'mode').listen();
    gui.add(g.cook.params, 'happy', 0,100).listen();
    gui.add(g.customer.params, 'endurance', 0, 100).listen();
}

function cookWork(o, e) {
    if(o.params.state == 'idle') {
        switch(world.mode) {
            case 'minigame':
                findIngredient(o);
                break;
            case 'cooking':
                makingFood(o);
                break;
            default:
                break;
        }
    }

}

function findIngredient(o) {
    if(o.params.happy >= 10) {
        o.params.happy -= 10;
        world.ingredient += 20;
    }
}

function makingFood(o) {
    if(world.ingredient >= 10) {
        world.ingredient -= 10;
        world.food += 1;
    }
}

function serving(o) {
    if(world.food > 0) {
        world.food -= 1;
        world.money += 10;
        world.fame += 1;
        o.params.endurance = 100;
    }
}

function setState(o, e) {
    let state = {'idle': 0, 'minigame':1, 'cooking':2};
    let inputs = {'minigame': 0, 'cooking':1}
    let map = [[1, 2],
               [0, 2],
               [1, 0]];
    let cur = state[world.mode];
    let input = inputs[o.key];
    var newState = map[cur][input];
    
    world.mode = Object.keys(state)[newState];

}