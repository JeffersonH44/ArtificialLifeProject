"use strict";

var zebra_vision = 100;
var max_speed_zebra = 4;
var maxSt_F_zebra = 0.1;

//Tiger
var tiger_vision = 200;
var max_speed_tiger = 5;
var maxSt_F_tiger = 0.1;

var getKill_Radius = 30;


var avoid_wall = true;

class Individual {

    constructor(scene) {
        this.scene = scene;
        this.element3D = undefined;

        this.vector = new THREE.Vector3();
        this.width = 500;
        this.height = 500;
        this.depth = 200;
        this.goal = undefined;
        this.neighborhoodRadius = zebra_vision;
        this.maxSpeed = max_speed_zebra;
        this.maxSteerForce = maxSt_F_zebra;
        this.avoidWalls = avoid_wall;

        this.getKill_R = getKill_Radius;

        this.death_state = false;
        //this.stop_vector = new THREE.Vector3( 0, 0, 0 );

        this.position = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.acceleration = new THREE.Vector3();

        // build 3d object
        this.build3DObject();
        this.scene.add(this.element3D);
    }

    setGoal( target ) {
        this.goal = target;
    }

    setAvoidWalls( value ) {
        this.avoidWalls = value;
    }

    setWorldSize( width, height, depth ) {

        this.width = width;
        this.height = height;
        this.depth = depth;
    }

    run( boids , boids_t ) {

        if ( this.avoidWalls ) {

            this.vector.set( - this.width, this.position.y, this.position.z );
            this.vector = this.avoid( this.vector );
            this.vector.multiplyScalar( 5 );
            this.acceleration.add( this.vector );

            this.vector.set( this.width, this.position.y, this.position.z );
            this.vector = this.avoid( this.vector );
            this.vector.multiplyScalar( 5 );
            this.acceleration.add( this.vector );

            this.vector.set( this.position.x, - this.height, this.position.z );
            this.vector = this.avoid( this.vector );
            this.vector.multiplyScalar( 5 );
            this.acceleration.add( this.vector );

            this.vector.set( this.position.x, this.height, this.position.z );
            this.vector = this.avoid( this.vector );
            this.vector.multiplyScalar( 5 );
            this.acceleration.add( this.vector );

            this.vector.set( this.position.x, this.position.y, - this.depth );
            this.vector = this.avoid( this.vector );
            this.vector.multiplyScalar( 5 );
            this.acceleration.add( this.vector );

            this.vector.set( this.position.x, this.position.y, this.depth );
            this.vector = this.avoid( this.vector );
            this.vector.multiplyScalar( 5 );
            this.acceleration.add( this.vector );

        }/* else {

         this.checkBounds();

         }
         */

        // if not death then move
        //if(this.death_state == false){

        this.action(boids, boids_t);

        //}else{
        /*
         this.velocity = stop_vector;
         this._acceleration = stop_vector;

         console.log("catch out!" + this.velocity.x + "-" + this.velocity.y + "-" + this.velocity.z );
         */
        //}

        this.move();
        //console.log("catch out!" + this.velocity.x + "-" + this.velocity.y + "-" + this.velocity.z );
    }

    action(boids, boids_t) {
        console.log("uninplemented yet!");
    }

    flock( boids ) {

        if ( this.goal ) {
            this.acceleration.add( this.reach( this.goal, 0.005 ) );
        }

        this.acceleration.add( this.alignment( boids ) );
        this.acceleration.add( this.cohesion( boids ) );
        this.acceleration.add( this.separation( boids ) );

    };

    move() {

        /*
         if(this.death_state == true){
         this.velocity = stop_vector;
         this._acceleration = stop_vector;
         }else{

         }
         */

        this.velocity.add( this.acceleration );
        var l = this.velocity.length();

        if ( l > this.maxSpeed ) {
            this.velocity.divideScalar( l / this.maxSpeed );
        }

        if(this.death_state === false) {
            this.position.add( this.velocity );
            this.move3DObject();
        }
        this.acceleration.set( 0, 0, 0 );
    };

    /*this.checkBounds = function () {
        if ( this.position.x >   _width ) this.position.x = - _width;
        if ( this.position.x < - _width ) this.position.x =   _width;
        if ( this.position.y >   _height ) this.position.y = - _height;
        if ( this.position.y < - _height ) this.position.y =  _height;
        if ( this.position.z >  _depth ) this.position.z = - _depth;
        if ( this.position.z < - _depth ) this.position.z =  _depth;
    };*/

    //

    avoid( target ) {
        let steer = new THREE.Vector3();
        steer.copy( this.position );
        steer.sub( target );
        steer.multiplyScalar( 1 / this.position.distanceToSquared( target ) );
        return steer;
    };

    setDeath() {
        this.death_state = true;
    }

    repulse( target ) {

        let distance = this.position.distanceTo( target );

        if ( distance < 100 ) {
            let steer = new THREE.Vector3();
            steer.subVectors( this.position, target );
            steer.multiplyScalar( 0.5 / distance );
            this.acceleration.add( steer );
        }
    }



    follow( target ) {

        let distance = this.position.distanceTo( target );

        if ( distance < 500 ) {
            let steer = new THREE.Vector3();
            steer.subVectors( target, this.position ); //this.position, target
            steer.multiplyScalar( 0.5 / distance ); //0.5 / distance
            this.acceleration.add( steer );
        }
    }


    reach( target, amount ) {
        let steer = new THREE.Vector3();
        steer.subVectors( target, this.position );
        steer.multiplyScalar( amount );
        return steer;
    }

    alignment ( boids ) {

        let boid, velSum = new THREE.Vector3(),
            count = 0;

        for ( var i = 0, il = boids.length; i < il; i++ ) {
            if ( Math.random() > 0.6 ) continue;
            boid = boids[ i ];
            let distance = boid.position.distanceTo( this.position );
            if ( distance > 0 && distance <= this.neighborhoodRadius ) {
                velSum.add( boid.velocity );
                count++;
            }
        }

        if ( count > 0 ) {
            velSum.divideScalar( count );
            let l = velSum.length();
            if ( l > this.maxSteerForce ) {
                velSum.divideScalar( l / this.maxSteerForce );
            }
        }
        return velSum;
    }

    cohesion( boids ) {

        let boid, distance,
            posSum = new THREE.Vector3(),
            steer = new THREE.Vector3(),
            count = 0;

        for ( var i = 0, il = boids.length; i < il; i ++ ) {
            if ( Math.random() > 0.6 ) continue;

            boid = boids[ i ];
            distance = boid.position.distanceTo( this.position );
            if ( distance > 0 && distance <= this.neighborhoodRadius ) {
                posSum.add( boid.position );
                count++;
            }
        }

        if ( count > 0 ) {
            posSum.divideScalar( count );
        }

        steer.subVectors( posSum, this.position );
        let l = steer.length();
        if ( l > this.maxSteerForce ) {
            steer.divideScalar( l / this.maxSteerForce );
        }
        return steer;
    };

    separation( boids ) {

        let boid, distance,
            posSum = new THREE.Vector3(),
            repulse = new THREE.Vector3();

        for ( var i = 0, il = boids.length; i < il; i ++ ) {
            if ( Math.random() > 0.6 ) continue;

            boid = boids[ i ];
            distance = boid.position.distanceTo( this.position );

            if ( distance > 0 && distance <= this.neighborhoodRadius ) {
                repulse.subVectors( this.position, boid.position );
                repulse.normalize();
                repulse.divideScalar( distance );
                posSum.add( repulse );
            }
        }
        return posSum;
    }

    //escaping fro tigers
    escape( boids_t ) {

        let boid_t, distance;
        let steer = new THREE.Vector3();
        let count = 0;
        for ( var i = 0, il = boids_t.length; i < il; i++ ) {
            boid_t = boids_t[ i ];
            distance = boid_t.position.distanceTo( this.position );

            if ( distance > 0 && distance <= this.getKill_R ) {
                this.setDeath();
            }

            if ( distance > 0 && this.getKill_R < distance <= this.neighborhoodRadius ) {
                steer = boid_t.position;
                this.repulse( steer );
            }
            //console.log("Dist to Tig " + distance + " vs " + getKill_R);
            //console.log( "Death??" + this.death_state );
        }
    }

    //Go for the zebras
    eat( boids_zebras ) {

        let boid_z, distance;
        let steer = new THREE.Vector3();
        let count = 0;
        for ( var i = 0, il = boids_zebras.length; i < il; i++ ) {

            boid_z = boids_zebras[ i ];
            distance = boid_z.position.distanceTo( this.position );
            if ( distance > 0 && distance <= this.neighborhoodRadius ) {
                steer = boid_z.position;
                this.follow( steer );
            }
        }
    }

    build3DObject() {
    }

    move3DObject() {
        this.element3D.position.copy(this.position);
        this.element3D.rotation.z = Math.asin( this.velocity.y / this.velocity.length() );
    }
}
