'use strict';

class Individual {
    constructor(scene, config, row, col, rowOffset, colOffset, boxSize, color) {
        this.age = 0;
        this.maxAge = config.age;
        this.minEnergy = config.minEnergy;
        this.maxEnergy = config.maxEnergy;
        this.metabolism = config.metabolism;
        this.view = Math.round(Utils.gaussian(config.meanView, config.stdView));
        this.cubeSize = config.cubeSize;
        this.energy = this.minEnergy + ((this.maxEnergy - this.minEnergy) / 2);
        this.reproduction = false;

        this.build3DObject(color);
        scene.add(this.element);
        this.element.translateX(row * boxSize + rowOffset);
        this.element.translateY(col * boxSize + colOffset);

    }

    isDeath() {
        return this.age === this.maxAge || this.energy < this.minEnergy || this.reproduction;
    }

    reproduction(individual) {

    }

    build3DObject(color) {
        var cubeMaterial = new THREE.MeshLambertMaterial({
            color: color
        });

        this.element = new THREE.Mesh(new THREE.BoxGeometry(this.cubeSize, this.cubeSize, this.cubeSize), cubeMaterial);
    }
}