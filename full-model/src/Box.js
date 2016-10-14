'use strict';

class Box {
    constructor(config) {
        this.tree = undefined;
        this.individual = undefined;
        this.cleanRate = config.cleanRate;
        this.resources = 0;
        this.pollution = 0;
    }

    iterate(grid, i, j) {
        // iterate individual and tree
        if(this.tree) {
            this.tree.iterate(this);
        }
        if(this.individual) {
            var offset = this.individual.iterate(this, grid, i, j);

            // move current individual if they want to move
            if(offset[0] || offset[1]) {
                var x = i + offset[0];
                var y = j + offset[1];
                grid[x][y].individual = this.individual;
                this.individual = undefined;
            }
        }

        // remove polution
        this.pollution -= this.cleanRate;
    }
}