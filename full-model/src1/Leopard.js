"use strict";

class Leopard extends Individual {
    constructor() {
        super();
    }

    action(boids, boids_t) {
        let boids_zebras = boids;
        if ( Math.random() > 0.5 ) {
            this.eat( boids_zebras );
        }
    }
}