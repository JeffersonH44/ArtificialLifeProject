"use strict";

class Food extends Individual {
    constructor(config) {
        super(config);
        this.resourceProduction = config.resourceProduction;
        this.setDeath();
    }

    action(boids, boids_t) {
        this.resource += this.resourceProduction;
    }

    build3DObject() {
        this.element3D = new THREE.Mesh( new THREE.BoxGeometry(8,8,8), new THREE.MeshBasicMaterial( { color:0x64FE2E} ) );
    }
}