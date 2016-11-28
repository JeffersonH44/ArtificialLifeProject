"use strict";

class Pollution extends Individual {
    constructor(config) {
        super(config);
    }

    action(boids, boids_t) {
        if(this.resource < 0) {
            this.setDeath();
        }

        this.resource -= this.baseSpeed;
    }

    build3DObject() {
        this.element3D = new THREE.Mesh( new THREE.BoxGeometry(8,8,8), new THREE.MeshBasicMaterial( { color:0x4A2209} ) );
    }
}