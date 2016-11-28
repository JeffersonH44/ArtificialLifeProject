"use strict";

class Zebra extends Individual {
    constructor(config) {
        super(config);
        //this.isScaping = false;
        this.eatRadius = Utils.gaussianRandom(config.meanEatRadius, config.stdEatRadius);
        this.clip = undefined;
        this.moving = true;
    }

    action(zebraBoids, tigerBoids, foodNodes) {
        if ( Math.random() > 0.5 ) {
            this.flock( zebraBoids );
            this.cohesion(foodNodes);
        }

        //Always escape from the tigers
        let isScaping = this.escape(tigerBoids);
        if(!isScaping) {
            let value = this.tryEat(foodNodes);
            //console.log(value);
            if(value) {
                this.allowMove = false;
                if(this.moving) {
                    this.mixer.clipAction( this.clip, this.element3D ).stop();
                    this.moving = false;
                }
            }
        }
        if(!this.moving){
            this.mixer.clipAction(this.clip, this.element3D).setDuration(1)
                .startAt(-1 * Math.random()).play();
            this.moving = true;
        }
    }

    setDeath() {
        super.setDeath();
        this.mixer.clipAction( this.clip, this.element3D ).stop();
    }

    build3DObject() {
        // Morphs
        this.material = new THREE.MeshPhongMaterial( {
            map: this.turing.getTexture(),//THREE.ImageUtils.loadTexture('lib/three.js-master/examples/textures/zebra_skin.jpg'),
            morphTargets: true,
        });
        this.scale = 0.2;

        this.sceneList = {
            objectScale: new THREE.Vector3(this.scale, this.scale, this.scale),
            objectRotation: new THREE.Euler(Math.PI/2,  Math.PI/2, 0)
        };

        function createMorph(individual) {
            function addMorph( geometry, speed, duration, individual) {

                let mesh = new THREE.Mesh(geometry, individual.material);

                //Animatining the mesh with the default animation ****
                mesh.speed = speed;

                let clip = geometry.animations[ 0 ];
                individual.clip = clip;
                // set duration to shift the playback out of face
                individual.mixer.clipAction( clip, mesh ).setDuration(duration )
                    .startAt( - duration * Math.random() ).play();


                //Location and Orientation of the meshes
                mesh.position.set( individual.position.x, individual.position.y, individual.position.z );

                mesh.scale.copy(individual.sceneList.objectScale);

                mesh.rotation.copy(individual.sceneList.objectRotation);

                mesh.castShadow = true;
                mesh.receiveShadow = true;

                individual.scene.add( mesh );

                individual.element3D = mesh;
            }


            let loader = new THREE.JSONLoader();
            loader.load( "models/horse.js", function( geometry ) {
                addMorph( geometry, 400, 1, individual);
            });
        }

        createMorph(this);
    }

    //escaping from tigers
    escape( boids_t ) {

        let boid_t, distance;
        let steer = new THREE.Vector3();
        let isScaping = false;
        for (let i = 0, il = boids_t.length; i < il; i++ ) {
            boid_t = boids_t[ i ];
            distance = boid_t.position.distanceTo( this.position );

            if ( distance > 0 && distance <= this.neighborhoodRadius ) {
                steer = boid_t.position;
                this.repulse( steer );
                isScaping = true;
            }
        }
        return isScaping;
    }

    move3DObject() {
        this.element3D.position.copy(this.position);
        let direction = new THREE.Vector3();
        this.element3D.getWorldDirection(direction);

        //
        let indAngle = Math.atan2( direction.z , direction.x );
        let velAngle = Math.atan2( this.velocity.y , this.velocity.x );
        let velOldAngle = Math.atan2( this.oldVelocity.y , this.oldVelocity.x );
        let angleDifference = velAngle + velOldAngle;

        this.element3D.rotation.y = (angleDifference / 2) + (Math.PI / 2);
        this.oldVelocity = this.velocity;
    }
}