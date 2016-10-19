'use strict';

class Leopard extends Individual{
    constructor(scene, config, row, col, boxSize) {
        super(scene, config, row, col, boxSize - 15, boxSize - 15, boxSize, 0x0099FF);
    }
}
