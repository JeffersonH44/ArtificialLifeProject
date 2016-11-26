'use strict';

class Individual {
    constructor(scene, config, row, col, rowOffset, colOffset, boxSize, color) {
        this.age = 0;
        this.config = config;
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
        this.scene = scene;
        this.scene.add(this.element);
        this.element.translateX(row * boxSize + rowOffset);
        this.element.translateY(col * boxSize + colOffset);
        this.boxSize = boxSize;
        this.row = row;
        this.col = col;
        this.moved = false;
    }

    checkFoodRate() {
        let currentRate = (this.energy - this.minEnergy) / (this.maxEnergy - this.minEnergy);
        this.reproduction = currentRate > this.foodRate;
    }

    isDeath() {
        return this.age === this.maxAge || this.energy < this.minEnergy;
    }

    kill(grid) {
        this.scene.remove(this.element);
        grid[this.row][this.col].individual = undefined;
    }

    iterate(grid) {
        if(this.moved) {
            return;
        }

        if(this.isDeath()) {
            this.kill(grid);
            return;
        }

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
            this.translate3DObject(i, j);
        }

        if(this.reproduction) {
            //this.reproduce(grid);
        } else {
            this.eat(grid);
        }

        this.energy -= this.metabolism;
        this.age++;
        this.moved = true;
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

    translate3DObject(i, j) {
        //console.log(i, j, this.boxSize);
        this.element.translateX(i * this.boxSize);
        this.element.translateY(j * this.boxSize);
    }
}