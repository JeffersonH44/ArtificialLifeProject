"use strict";

class Zebra extends Individual {
    constructor(scene) {
        super(scene);
    }

    action(boids, boids_t) {
        if ( Math.random() > 0.5 ) {
            this.flock( boids );
        }

        //Always escape from the tigers
        this.escape(boids_t);
    }

    build3DObject() {
        this.element3D = new THREE.Mesh( new THREE.BoxGeometry(8,8,8), new THREE.MeshBasicMaterial( { color:0x0000ff} ) );
    }
}