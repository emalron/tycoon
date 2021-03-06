var world = {
    money: 10000,
    ingredient1: 0,
    ingredient2: 0,
    mode: 'idle',
    food1: 0,
    food2: 0,
    fame: 100,
    TO: 4,
    employees: ['empty', 'empty','empty','empty'],
    employID: 0,
    chairs: 4,
    customers: ['empty', 'empty', 'empty', 'empty'],
    customID: 0,
    toys: 0,
    week: 0
}

Array.prototype.findIndex = function(key) {
    let array = this;

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

Array.prototype.findEmptyIndex = function() {
    let array = this;
    
    for(var ci in array) {
        let cus = array[ci];
        
        if(cus == 'empty') {
            return ci;
        }
    }
    
    return -1;
}

Object.defineProperty(Array.prototype, 'findEmptyIndex', {
    enumerable: false
})
Object.defineProperty(Array.prototype, 'findIndex', {
    enumerable: false
})