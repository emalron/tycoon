var gameState = {create: create};
var gui = new dat.GUI();

function create() {
    let g = game;
    
    // draw entities
    g.background = g.add.sprite(0,0,'bg');
    g.mini = g.add.sprite(0.9*g.world.width-130, 0.9*g.world.height, 'minigame');
    g.mini.anchor.setTo(.5);
    g.cooking = g.add.sprite(0.9*g.world.width, 0.9*g.world.height, 'cooking');
    g.cooking.anchor.setTo(.5);
    g.hiring = g.add.sprite(0.9*g.world.width-260, 0.9*g.world.height, 'hiring');
    g.hiring.anchor.setTo(.5);
        
    // set input
    g.mini.inputEnabled = true;
    g.mini.events.onInputDown.add(setState, this);
    g.cooking.inputEnabled = true;
    g.cooking.events.onInputDown.add(setState, this);
    g.hiring.inputEnabled = true;
    g.hiring.events.onInputDown.add(hireCook, this);
    
    
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
    
    // set dat.gui
    gui.add(world, 'money', 0, 50000).listen();
    gui.add(world, 'fame', 0, 200).listen();
    gui.add(world, 'ingredient', 0, 10000).listen();
    gui.add(world, 'food', 0, 10).listen();
    gui.add(world, 'mode').listen();
    // gui.add(g.cook.params, 'happy', 0,100).listen();
    // gui.add(g.customer.params, 'endurance', 0, 100).listen();
}

function pushCustomer() {
    let g = game;
    // 식당 의자 수가 손님 수보다 많다면, 손님 입장 가능
    if(getNumberOfEmpty(world.customers) > 0) {
        // 빈자리 찾기
        let id = findEmptyIndex(world.customers)
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
    
    console.log(output);
    
    return output;
}

function findEmptyIndex(array) {
    for(var ci in array) {
        let cus = array[ci];
        
        if(cus == 'empty') {
            return ci;
        }
    }
}

function hireCook() {
    let g = game;
    // TO가 있으면, 요리사 채용함.
    if(getNumberOfEmpty(world.employees)) {
        // 요리사 추가
        let index = findEmptyIndex(world.employees);
        var cook = g.add.sprite(0.1*g.world.width, 0.1*g.world.height, 'cook');
        cook.anchor.setTo(.5);
        cook.params = {id: world.employID, happy: 100, state:'idle'};
        cook.inputEnabled = true;
        cook.events.onInputDown.add(cookWork, this);
        cook.input.enableDrag(true);
        
        world.employees[index] = cook;
        world.employID += 1;
    }
    else {
        // TO가 없으면? 못함
        console.log('Not enough TO');
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
        let id = findIndex(world.customers, o.params.id);
        world.customers[id] = 'empty';
        o.destroy();
    }
}

function findIndex(array, key) {
    for(var id in array) {
        let item = array[id];
        if(item != 'empty') {
            if(item.params.id == key) {
                return id;
            }
        }
    }
    return undefined;
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