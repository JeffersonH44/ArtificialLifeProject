'use strict';

class Leopard extends Individual{
    constructor(scene, config, row, col, boxSize) {
        super(scene, config, row, col, boxSize - 15, boxSize - 15, boxSize, 0x0099FF);
    }

    move(grid) {
        let ret = [];
        let val = Utils.randomInt(-1, 1);
        ret.push(val);
        ret.push(val == 0 ? Utils.randomInt(-1, 1) : 0);
        return ret;
    }

    eat(grid) {
    }

    reproduce(grid) {

    }
}
