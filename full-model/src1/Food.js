"use strict";

class Food extends Individual {
    constructor(config) {
        super(config);
        this.resourceProduction = this.baseSpeed * Utils.gaussianRandom(config.resourceProductionMean, config.resourceProductionStd);
        this.maxProduction = Utils.gaussianRandom(config.maxResourceMean, config.maxResourceStd);

    }

    action(boids, boids_t) {
        if(this.resource < this.maxProduction) {
            this.resource += this.resourceProduction;
        }
    }

    build3DObject() {
        this.element3D = new THREE.Mesh( new THREE.BoxGeometry(8,8,8), new THREE.MeshBasicMaterial( { color:0x64FE2E} ) );
    }
}