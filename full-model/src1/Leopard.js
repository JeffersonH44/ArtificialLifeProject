"use strict";

class Leopard extends Individual {
    constructor(config) {
        super(config);
    }

    action(zebrasBoids, tigerBoids) {
        if ( Math.random() > 0.5 ) {
            this.chase( zebrasBoids );
        }
    }

    chase( boids_zebras ) {

        let boid_z, distance;
        let steer = new THREE.Vector3();
        let count = 0;
        for ( var i = 0, il = boids_zebras.length; i < il; i++ ) {

            boid_z = boids_zebras[ i ];
            distance = boid_z.position.distanceTo( this.position );

            if(distance < this.eatRadius) {
                boid_z.setDeath();
            }else if( distance > 0 && distance <= this.neighborhoodRadius ) {
                steer = boid_z.position;
                this.follow( steer );
            }
        }
    }

    build3DObject() {
        this.element3D = new THREE.Mesh( new THREE.BoxGeometry(8,8,8), new THREE.MeshBasicMaterial( { color:0xff0000} ) );
    }
}