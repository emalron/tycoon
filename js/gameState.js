var gameState = {create: create, update: update};
var gui = new dat.GUI();

function create() {
    let g = game;
    
    // draw entities
    var background = g.add.sprite(0,0,'bg');
    var mini = g.add.sprite(0.9*g.world.width-120, 0.9*g.world.height, 'minigame');
    mini.anchor.setTo(.5);
    var cooking = g.add.sprite(0.9*g.world.width, 0.9*g.world.height, 'cooking');
    cooking.anchor.setTo(.5);
    var hiring = g.add.sprite(0.9*g.world.width-240, 0.9*g.world.height, 'hiring');
    hiring.anchor.setTo(.5);
    var buying = g.add.sprite(0.9*g.world.width-360, 0.9*g.world.height, 'buying');
    buying.anchor.setTo(.5);
    
        
    // set input
    mini.inputEnabled = true;
    mini.events.onInputDown.add(setState, this);
    cooking.inputEnabled = true;
    cooking.events.onInputDown.add(setState, this);
    hiring.inputEnabled = true;
    hiring.events.onInputDown.add(hireCook, this);
    buying.inputEnabled = true;
    buying.events.onInputDown.add(buyingToy, this);
    
    
    // set timer event
    g.time.events.loop(1000, function() {
        for(var ci in world.customers) {
            let cus = world.customers[ci];
            if(cus != 'empty') {
                if(cus.params.endurance > 0) {
                    cus.params.endurance -= 5;
                }
                else {
                    world.fame -= 5;
                    cus.params.endurance = 100;
                }
            }
        }
    })
    
    g.time.events.loop(3000, pushCustomer);
}

function update() {
    if(world.fame <= 0) {
        game.time.events.add(4000, function() {
            game.state.start('homeState', true, false, 'GAME over');
        })
    }
    if(world.fame > 0 && world.money >= 10100) {
        game.state.start('homeState', true, false, 'Winner winner chicken dinner');
    }
}

function pushCustomer() {
    let g = game;
    // 식당 의자 수가 손님 수보다 많다면, 손님 입장 가능
    if(getNumberOfEmpty(world.customers) > 0) {
        // 빈자리 찾기
        let id = world.customers.findEmptyIndex();
        console.log(id);
        
        //손님 추가
        if(id != -1) {
            var customer = g.add.sprite(0.8*g.world.width-50*id, 0.6*g.world.height, 'customer');
            customer.anchor.setTo(.5);
            customer.inputEnabled = true;
            customer.events.onInputDown.add(serving, this);
            customer.params = {id: world.customID, endurance: 100};

            world.customers[id] = customer;
            world.customID += 1;
        }
    }
}

function getNumberOfEmpty(array) {
    let output = 0;
    for (var ci in array) {
        let item = array[ci];
        
        if(item == 'empty') {
            output += 1;
        }
    }    
    return output;
}


function hireCook() {
    let g = game;
    // TO가 있으면, 요리사 채용함.
    if(getNumberOfEmpty(world.employees)) {
        // 요리사 추가
        var rng = Math.floor(Math.random()*20)
        let index = world.employees.findEmptyIndex();
        var cook = g.add.sprite(0.1*g.world.width+rng, 0.1*g.world.height+rng, 'cook');
        cook.anchor.setTo(.5);
        cook.params = {id: world.employID, happy: 100, state:'idle'};
        cook.inputEnabled = true;
        cook.events.onInputDown.add(cookWork, this);
        cook.input.enableDrag();
        
        world.employees[index] = cook;
        world.employID += 1;
    }
    else {
        // TO가 없으면? 못함
        console.log('Not enough TO');
    }
}

function buyingToy() {
    let g = game;
    if(world.money >= 500 && world.toys < 4) {
        world.money -= 500;
        world.toys += 1;
        var rng = Math.floor(Math.random()*20)
        var toy = g.add.sprite(g.world.centerX+rng, g.world.centerY+rng, 'toy');
        toy.anchor.setTo(.5);
        toy.inputEnabled = true;
        toy.input.enableDrag();
    }
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
    // 음식이 준비됐다면,
    if(world.food > 0) {
        // 자원 교환이 일어남.
        world.food -= 1;
        world.money += 10;
        world.fame += 1;
        
        // 서빙 받은 고객 퇴장
        let id = world.customers.findIndex(o.params.id);
        world.customers[id] = 'empty';
        o.destroy();
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