"use strict";

class Zebra extends Individual {
    constructor() {
        super();
    }

    action(boids, boids_t) {
        if ( Math.random() > 0.5 ) {
            this.flock( boids );
        }

        //Always escape from the tigers
        this.escape(boids_t);
    }
}