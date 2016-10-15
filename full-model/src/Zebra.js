'use strict';

class Zebra {
    constructor(scene, config, row, col, boxSize) {
        this.age = 0;
        this.maxAge = config.age;
        this.minEnergy = config.minEnergy;
        this.maxEnergy = config.maxEnergy;
        this.metabolism = config.metabolism;
        this.view = Math.round(Utils.gaussian(config.meanView, config.stdView));
        this.cubeSize = config.cubeSize;
        this.energy = this.minEnergy + ((this.maxEnergy - this.minEnergy) / 2);
        this.reproduction = false;

        this.build3DObject();
        scene.add(this.element);
        this.element.translateX(row * boxSize + (boxSize / 4));
        this.element.translateY(col * boxSize + (boxSize / 4));

    }

    isDeath() {
        return this.age === this.maxAge || this.energy < this.minEnergy || this.reproduction;
    }

    reproduction(individual) {

    }

    build3DObject() {
        var cubeMaterial = new THREE.MeshLambertMaterial({
            color: 0x00FF00
        });

        this.element = new THREE.Mesh(new THREE.BoxGeometry(this.cubeSize, this.cubeSize, this.cubeSize), cubeMaterial);
    }
}