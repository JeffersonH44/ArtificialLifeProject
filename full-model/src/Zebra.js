'use strict';

class Zebra extends Individual {
    constructor(scene, config, row, col, boxSize) {
        super(scene, config, row, col, boxSize/4, boxSize/4, boxSize, 0x0000FF);
        this.separation = config.separation;
        this.cohesion = config.cohesion;
        this.alignment = config.alignment;
        this.separationForce = config.separationForce;
        this.cohesionForce = config.cohesionForce;
        this.alignmentForce = config.alignmentForce;
        this.speedX = 0.0;
        this.speedY = 0.0;
        this.accelerationX = 0.0;
        this.accelerationY = 0.0;
    }

    move(grid) {
        let sforceX = 0, sforceY = 0, cforceX = 0, cforceY = 0, aforceX = 0, aforceY = 0;
        let view = this.view, rows = grid.length, cols = grid[0].length;

        let startRow = Math.max(this.row - view, 0), endRow = Math.min(this.row + view, rows - 1);
        let startCol = Math.max(this.col - view, 0), endCol = Math.min(this.col + view, cols - 1);

        for(let i = startRow; i < endRow; ++i) {
            for(let j = startCol; j < endCol; ++j) {
                let box = grid[i][j];
                let spareX = this.row - i;
                let spareY = this.col - j;
                let distSquared = spareX + spareY;
                if(box.individual instanceof Leopard && distSquared < this.separation) {
                    sforceX += spareX;
                    sforceY += spareY;
                } else {
                    let instance = this.reproduction ? box.individual instanceof Zebra : box.resources[Constants.TREE];
                    if(instance && distSquared < this.cohesion) {
                        cforceX += spareX;
                        cforceY += spareY;
                    }
                    if(this.reproduction && instance && distSquared < this.alignment) {
                        aforceX += box.individual.speedX;
                        aforceY += box.individual.speedY;
                    }
                }
            }
        }


        // Separation
        let length = Utils.hypotenuse(sforceX, sforceY);
        this.accelerationX -= (this.separationForce * sforceX / length) || 0;
        this.accelerationY -= (this.separationForce * sforceY / length) || 0;

        // Cohesion
        length = Utils.hypotenuse(cforceX, cforceY);
        this.accelerationX += (this.cohesionForce * cforceX / length) || 0;
        this.accelerationY += (this.cohesionForce * cforceY / length) || 0;

        //alignment
        length = Utils.hypotenuse(aforceX, aforceY);
        this.accelerationX += (this.alignmentForce * aforceX / length) || 0;
        this.accelerationY += (this.alignmentForce * aforceY / length) || 0;

        this.speedX += this.accelerationX;
        this.speedY += this.accelerationY;

        //console.log(this.row, this.col, this.speedX, this.speedY);

        let degree = Utils.toDegrees(Math.atan2(this.speedY, this.speedX));
        return Zebra.calculateOffset(degree);
    }

    static calculateOffset(degree) {
        if(45 < degree && degree <= 135) {
            return [0, 1];
        }
        if(135 < degree && degree <= 225) {
            return [-1, 0];
        }
        if(225 < degree && degree <= 315) {
            return [0, -1];
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
        let arr = [];
        if(0 < this.row - 1 && grid[this.row - 1][this.col].individual instanceof Zebra) {
            arr.push(grid[this.row - 1][this.col].individual);
        }

        if(this.row + 1 < grid.length && grid[this.row + 1][this.col].individual instanceof Zebra) {
            arr.push(grid[this.row + 1][this.col].individual);
        }

        if(0 < this.col - 1 && grid[this.row][this.col - 1].individual instanceof Zebra) {
            arr.push(grid[this.row][this.col - 1].individual);
        }

        if(this.col + 1 < grid[0].length && grid[this.row][this.col + 1].individual instanceof Zebra) {
            arr.push(grid[this.row][this.col + 1].individual);
        }

        if(arr.length) {
            let index = Utils.randomInt(0, arr.length);
            let ind = arr[index];
            let initial = [[this.row, this.col], [ind.row, ind.col]];
            arr = Zebra.getEmptyPosition(grid, initial);
            let row = arr[0], col = arr[1];
            grid[row][col].individual = new Zebra(this.scene, this.config, row, col, this.boxSize);
        }
    }

    static getEmptyPosition(grid, initialPositions) {
        let q = new Queue(), rows = grid.length, cols = grid[0].length;
        let visited = new Array(grid.length * grid[0].length);
        for(let i = 0; i < initialPositions.length; ++i) {
            q.enqueue(initialPositions[i]);
            let r = initialPositions[i][0], c = initialPositions[i][0];
            visited[r * cols + c] = true;
        }

        while(!q.isEmpty()) {
            let currentValue = q.dequeue();
            let r = currentValue[0];
            let c = currentValue[1];

            if(r < 0 || r >= rows || c < 0 || c >= cols || visited[r * cols + c]) {
                continue;
            }

            if(grid[r][c].tree === undefined) {
                return [r, c];
            }

            q.enqueue([r + 1, c]);
            q.enqueue([r, c + 1]);
            q.enqueue([r - 1, c]);
            q.enqueue([r, c - 1]);
            visited[r * cols + c] = true;
        }

    }
}