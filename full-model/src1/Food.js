"use strict";

class Food extends Individual {
    constructor(config) {
        super(config);
        this.resourceProduction = config.resourceProduction;
    }

    action(boids, boids_t) {
        this.resource += 0.01;
    }

    build3DObject() {
        this.element3D = new THREE.Mesh( new THREE.BoxGeometry(8,8,8), new THREE.MeshBasicMaterial( { color:0x64FE2E} ) );
    }
}