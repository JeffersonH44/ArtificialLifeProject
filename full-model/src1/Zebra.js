"use strict";

class Zebra extends Individual {
    constructor(config) {
        super(config);
        this.isScaping = false;
        this.eatRadius = Utils.gaussianRandom(config.meanEatRadius, config.stdEatRadius);
    }

    action(zebraBoids, tigerBoids, foodNodes) {
        if ( Math.random() > 0.5 ) {
            this.flock( zebraBoids );
        }

        //Always escape from the tigers
        this.escape(tigerBoids);
        if(!this.isScaping) {
            let value = this.tryEat(foodNodes);
            if(value) {
                this.allowMove = false;
            }
        }
    }

    build3DObject() {
        this.element3D = new THREE.Mesh( new THREE.BoxGeometry(8,8,8), new THREE.MeshBasicMaterial( { color:0x0000ff} ) );
    }

    //escaping from tigers
    escape( boids_t ) {

        let boid_t, distance;
        let steer = new THREE.Vector3();
        this.isScaping = false;
        for (let i = 0, il = boids_t.length; i < il; i++ ) {
            boid_t = boids_t[ i ];
            distance = boid_t.position.distanceTo( this.position );

            if ( distance > 0 && distance <= this.neighborhoodRadius ) {
                steer = boid_t.position;
                this.repulse( steer );
                this.isScaping = true;
            }
        }
    }
}