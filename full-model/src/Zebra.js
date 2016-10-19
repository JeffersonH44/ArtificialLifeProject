'use strict';

class Zebra extends Individual{
    constructor(scene, config, row, col, boxSize) {
        super(scene, config, row, col, boxSize/4, boxSize/4, boxSize, 0x0000FF);
    }
}