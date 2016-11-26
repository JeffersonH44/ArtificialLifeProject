"use strict";

class Leopard extends Individual {
    constructor(scene) {
        super(scene);
    }

    action(boids, boids_t) {
        let boids_zebras = boids;
        if ( Math.random() > 0.5 ) {
            this.eat( boids_zebras );
        }
    }

    build3DObject() {
        this.element3D = new THREE.Mesh( new THREE.BoxGeometry(8,8,8), new THREE.MeshBasicMaterial( { color:0xff0000} ) );
    }
}