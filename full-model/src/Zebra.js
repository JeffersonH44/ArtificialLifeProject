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

        this.build3DObject();
        scene.add(this.element);
        this.element.translateX(row * boxSize);
        this.element.translateY(col * boxSize);

    }

    build3DObject() {
        var cubeMaterial = new THREE.MeshLambertMaterial({
            color: 0x00FF00
        });

        this.element = new THREE.Mesh(new THREE.BoxGeometry(this.cubeSize, this.cubeSize, this.cubeSize), cubeMaterial);
    }
}