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
var wall_force = 10;

class Individual {

    constructor(config) {
        this.resource = ((config.maxEnergy - config.minEnergy) / 2) + config.minEnergy;
        this.scene = config.scene;
        this.mixer = config.mixer;

        if(config.meanView === undefined) config.meanView = 0;
        if(config.stdView === undefined) config.stdView = 0;
        this.neighborhoodRadius = Utils.gaussianRandom(config.meanView, config.stdView);

        if(config.meanEatRadius === undefined) config.meanEatRadius = 0;
        if(config.stdEatRadius === undefined) config.stdEatRadius = 0;
        this.eatRadius = Utils.gaussianRandom(config.meanEatRadius, config.stdEatRadius);

        if(config.meanEatSpeed === undefined) config.meanEatSpeed = 0;
        if(config.stdEatSpeed === undefined) config.stdEatSpeed = 0;
        this.eatSpeed = Utils.gaussianRandom(config.meanEatSpeed, config.stdEatSpeed);

        this.maxSpeed = config.maxSpeed;
        this.maxSteerForce = config.maxSteerForce;
        this.baseSpeed = config.baseSpeed;
        this.metabolism *= this.baseSpeed;
        this.eatSpeed *= this.baseSpeed;

        this.element3D = undefined;

        this.vector = new THREE.Vector3();
        //this.width = 500;
        //this.height = 500;
        //this.depth = 200;
        //this.goal = undefined;
        //this.avoidWalls = avoid_wall;

        //this.getKill_R = getKill_Radius;

        this.death_state = false;
        //this.stop_vector = new THREE.Vector3( 0, 0, 0 );

        this.position = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.acceleration = new THREE.Vector3();

        // build 3d object
        this.turing = new TuringSystem(128, 128, config.turing);
        this.turing.solve(2000);
        this.build3DObject();
        this.scene.add(this.element3D);

        // for animation
        this.oldVelocity = new THREE.Vector3();
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

    run( zebraBoids , tigerBoids, foodBoids ) {
        this.allowMove = true;
        if ( this.avoidWalls ) {

            this.vector.set( - this.width, this.position.y, this.position.z );
            this.vector = this.avoid( this.vector );
            this.vector.multiplyScalar( wall_force );
            this.acceleration.add( this.vector );

            this.vector.set( this.width, this.position.y, this.position.z );
            this.vector = this.avoid( this.vector );
            this.vector.multiplyScalar( wall_force );
            this.acceleration.add( this.vector );

            this.vector.set( this.position.x, - this.height, this.position.z );
            this.vector = this.avoid( this.vector );
            this.vector.multiplyScalar( wall_force );
            this.acceleration.add( this.vector );

            this.vector.set( this.position.x, this.height, this.position.z );
            this.vector = this.avoid( this.vector );
            this.vector.multiplyScalar( wall_force );
            this.acceleration.add( this.vector );

            this.vector.set( this.position.x, this.position.y, - this.depth );
            this.vector = this.avoid( this.vector );
            this.vector.multiplyScalar( wall_force );
            this.acceleration.add( this.vector );

            this.vector.set( this.position.x, this.position.y, this.depth );
            this.vector = this.avoid( this.vector );
            this.vector.multiplyScalar( wall_force );
            this.acceleration.add( this.vector );

        }/* else {

         this.checkBounds();

         }
         */

        // if not death then move
        //if(this.death_state == false){

        this.action(zebraBoids, tigerBoids, foodBoids);

        //}else{
        /*
         this.velocity = stop_vector;
         this._acceleration = stop_vector;

         console.log("catch out!" + this.velocity.x + "-" + this.velocity.y + "-" + this.velocity.z );
         */
        //}
        if(this.allowMove) {
            this.move();
            //this.resource -= this.metabolism;
        }
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

    isDeath() {
        return this.death_state;
    }

    isRemovable() {
        let state = this.death_state && this.resource < 0;
        if(state) {
            this.scene.remove(this.element3D);
        }
        return state;
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

    tryEat(food) {
        for(let i = 0; i < food.length; ++i) {
            let currentFood = food[i];
            let distance = currentFood.position.distanceTo(this.position);
            if(currentFood.isDeath() && currentFood.resource > 0 && distance < this.eatRadius) {
                this.resource += this.eatSpeed;
                currentFood.resource -= this.eatSpeed;
                this.follow(currentFood);
                //this.acceleration.set(0, 0, 0);
                //this.velocity.set(0, 0, 0);
                return true;
            }
        }
        return false;
    }

    build3DObject() {
    }

    move3DObject() {
        this.element3D.position.copy(this.position);
        this.element3D.rotation.z = Math.asin( this.velocity.y / this.velocity.length() );
    }
}
