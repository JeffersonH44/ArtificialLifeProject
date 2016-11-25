'use strict';

class Individual {
    constructor(scene, config, row, col, rowOffset, colOffset, boxSize, color) {
        this.age = 0;
        this.maxAge = config.age;
        this.minEnergy = config.minEnergy;
        this.maxEnergy = config.maxEnergy;
        this.metabolism = config.metabolism;
        this.view = Math.round(Utils.gaussianRandom(config.meanView, config.stdView));
        this.cubeSize = config.cubeSize;
        this.energy = this.minEnergy + ((this.maxEnergy - this.minEnergy) / 2);
        this.reproduction = false;
        this.foodRate = config.foodRate;
        this.pollutionProduction = config.pollutionProduction;

        this.build3DObject(color);
        scene.add(this.element);
        this.element.translateX(row * boxSize + rowOffset);
        this.element.translateY(col * boxSize + colOffset);
        this.row = row;
        this.col = col;
    }

    checkFoodRate() {
        let currentRate = this.energy / this.maxEnergy;
        this.reproduction = currentRate > this.foodRate;
    }

    isDeath() {
        return this.age === this.maxAge || this.energy < this.minEnergy;
    }

    iterate(grid) {
        this.checkFoodRate();
        let offset = this.move(grid);
        let i = offset[0], j = offset[1];
        let newRow = this.row + i, newCol = this.col + j;

        let rowCondition = 0 <= newRow && newRow < grid.length;
        let colCondition = 0 <= newCol && newCol < grid[0].length;

        if(rowCondition && colCondition && grid[this.row + i][this.col + j].individual === undefined) {
            let prevRow = this.row;
            let prevCol = this.col;
            let ind = grid[this.row][this.col].individual;
            this.row = newRow;
            this.col = newCol;
            grid[this.row][this.col].individual = ind;
            grid[prevRow][prevCol].individual = undefined;
        }

        if(this.reproduction) {
            this.reproduce(grid);
        } else {
            this.eat(grid);
        }
    }

    reproduce(grid) {}

    eat(grid) {}

    move(grid) {
        return [0, 0];
    }

    build3DObject(color) {
        var cubeMaterial = new THREE.MeshLambertMaterial({
            color: color
        });

        this.element = new THREE.Mesh(new THREE.BoxGeometry(this.cubeSize, this.cubeSize, this.cubeSize), cubeMaterial);
    }
}