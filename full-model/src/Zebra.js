'use strict';

class Zebra extends Individual {
    constructor(scene, config, row, col, boxSize) {
        super(scene, config, row, col, boxSize/4, boxSize/4, boxSize, 0x0000FF);
        this.separation = config.separation;
        this.cohesion = config.cohesion;
        this.alignment = config.alignment;
        this.separationForce = config.separationForce;
        this.cohesionForce = config.cohesionForce;
        this.speedX = 0.0;
        this.speedY = 0.0;
        this.accelerationX = 0.0;
        this.accelerationY = 0.0;
    }

    move(grid) {
        let sforceX = 0, sforceY = 0, cforceX = 0, cforceY = 0;//, aforceX = 0, aforceY = 0;
        let view = this.view, rows = grid.length, cols = grid[0].length;

        let startRow = Math.max(this.row - view, 0), endRow = Math.min(this.row + view, rows - 1);
        let startCol = Math.max(this.col - view, 0), endCol = Math.min(this.col + view, cols - 1);

        for(let i = startRow; i < endRow; ++i) {
            let box = grid[i][this.col];
            let spareX = this.row - i;
            let spareY = 0;
            // TODO: repeated code
            let distSquared = spareX * spareX + spareY + spareY;
            if(box.individual instanceof Leopard && distSquared < this.separation) {
                sforceX += spareX;
                sforceY += spareY;
            } else {
                let instance = this.reproduction ? box.individual instanceof Zebra : box.resources[Constants.TREE];
                if(instance && distSquared < this.cohesion) {
                    cforceX += spareX;
                    cforceY += spareY;
                }
            }
        }

        for(let i = startCol; i < endCol; ++i) {
            let box = grid[i][this.col];
            let spareX = 0;
            let spareY = this.col - i;
            // TODO: repeated code
            let distSquared = spareX * spareX + spareY + spareY;
            if(box.individual instanceof Leopard && distSquared < this.separation) {
                sforceX += spareX;
                sforceY += spareY;
            } else {
                let instance = this.reproduction ? box.individual instanceof Zebra : box.resources[Constants.TREE];
                if(instance && distSquared < this.cohesion) {
                    cforceX += spareX;
                    cforceY += spareY;
                }
            }
        }

        // Separation
        let length = Utils.hypotenuse(sforceX, sforceY);
        this.accelerationX += (this.separationForce * sforceX / length) || 0;
        this.accelerationY += (this.separationForce * sforceY / length) || 0;

        // Cohesion
        length = Utils.hypotenuse(cforceX, cforceY);
        this.accelerationX -= (this.cohesionForce * cforceX / length) || 0;
        this.accelerationY -= (this.cohesionForce * cforceY / length) || 0;

        this.speedX = this.accelerationX;
        this.speedY = this.accelerationY;

        let degree = Utils.toDegrees(Math.atan2(this.speedY, this.speedX));
        return Zebra.calculateOffset(degree);
    }

    static calculateOffset(degree) {
        if(45 < degree && degree <= 135) {
            return [0, -1];
        }
        if(135 < degree && degree <= 225) {
            return [-1, 0];
        }
        if(225 < degree && degree <= 315) {
            return [0, 1];
        }
        return [1, 0];
    }

    // TODO: add disease when eat polluted resource
    eat(grid) {
        let box = grid[this.row][this.col];
        let currentResource = box.resources[Constants.TREE];
        if(currentResource) {
            let resourceEaten = Math.min(this.maxEnergy - this.energy, currentResource);
            this.energy += resourceEaten;
            box.resources[Constants.TREE] -= resourceEaten;
            box.pollution += Math.ceil(resourceEaten * this.pollutionProduction);
        }
    }

    reproduce(grid) {

    }
}