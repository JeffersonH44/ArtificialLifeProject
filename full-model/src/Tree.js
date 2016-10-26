'use strict';

class Tree {
    constructor(scene, config, row, col, boxSize) {
        this.resourceProductionMean = config.resourceProductionMean;
        this.resourceProductionStd = config.resourceProductionStd;
        this.maxResourceMean = config.maxResourceMean;
        this.maxResourceStd = config.maxResourceStd;
        this.boxSize = boxSize;
        this.cubeSize = config.cubeSize;

        this.build3DObject(0x00FF00);
        scene.add(this.element);
        this.element.translateX(row * this.boxSize + (this.boxSize - 15));
        this.element.translateY(col * this.boxSize + (this.boxSize - 15));
    }

    build3DObject(color) {
        var cubeMaterial = new THREE.MeshLambertMaterial({
            color: color
        });

        this.element = new THREE.Mesh(new THREE.BoxGeometry(this.cubeSize, this.cubeSize, this.cubeSize), cubeMaterial);
    }
}