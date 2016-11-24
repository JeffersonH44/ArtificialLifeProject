'use strict';

class Tree {
    constructor(scene, config, row, col, boxSize) {
        this.boxSize = boxSize;
        this.cubeSize = config.cubeSize;
        this.production = Math.floor(Random.gaussianRandom(config.resourceProductionMean, config.resourceProductionStd));
        this.maxProduction = Math.floor(Random.gaussianRandom(config.maxResourceMean, config.maxResourceStd));

        this.build3DObject(0x00FF00);
        scene.add(this.element);
        this.element.translateX(row * this.boxSize);
        this.element.translateY(col * this.boxSize + (this.boxSize - 15));
    }

    iterate(box) {
        //TODO: grow tree

        //TODO: produce with a random variable
        let resource = box.resources[Constants.TREE];
        box.resources[Constants.TREE] = resource + this.production > this.maxProduction ? this.maxProduction : resource + this.production;
    }

    build3DObject(color) {
        let cubeMaterial = new THREE.MeshLambertMaterial({
            color: color
        });

        this.element = new THREE.Mesh(new THREE.BoxGeometry(this.cubeSize, this.cubeSize, this.cubeSize), cubeMaterial);
    }
}