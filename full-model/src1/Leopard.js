"use strict";

class Leopard extends Individual {
    constructor(config) {
        super(config);
        this.isEating = false;
        this.rest = 5;
        this.clip = undefined;
        this.moving = true;
        this.config = config;
    }

    action(zebrasBoids, tigerBoids, foodBoids) {
        if(this.isEating) {
            let value = this.tryEat(foodBoids);
            if(!value) {
                this.rest -= this.baseSpeed;
                if(!this.moving) {
                    this.mixer.clipAction(this.clip, this.element3D).setDuration(1)
                        .startAt(-1 * Math.random()).play();
                    this.moving = true;
                }
            } else {
                this.allowMove = false;
                if(this.moving) {
                    this.mixer.clipAction( this.clip, this.element3D ).stop();
                    this.moving = false;
                }
            }
            if(this.rest < 0) {
                this.isEating = false;
                this.rest = 5;
            }
        } else {
            if(this.resource > this.reproductionThreshold ) {
                this.reproduction(tigerBoids);
            } else if(Math.random() > 0.5) {
                this.chase( zebrasBoids );
            }
        }
    }

    reproduce(individual) {
        let ind = new Leopard(this.config);
        console.log("ind created");
        let total = Utils.randomInt(1, 3);
        let options = ["minEnergy", "maxEnergy", "neighborhoodRadius", "eatRadius", "eatRadius", "metabolism"];
        let threshold = total / options.length;
        for(let i = 0; i < options.length; ++i) {
            let index = options[i];
            if(Utils.random(0, 1) < threshold) {
                ind[index] = Utils.combine(this[index], individual[index]);
            } else {
                ind[index] = this[index];
            }
        }
        let CA = Utils.combine(this.turing.CA, individual.turing.CA);
        let CB = Utils.combine(this.turing.CB, individual.turing.CB);

        let turing = this.turing.copy(CA, CB);
        turing.solve(100);
        ind.turing = turing;
        ind.position.copy(this.position);
        this.population.add(ind);
        this.resource /= 3;
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
                this.isEating = true;
                return;
            }else if( distance > 0 && distance <= this.neighborhoodRadius ) {
                steer = boid_z.position;
                this.follow( steer );
            }
        }
    }

    build3DObject() {
        // rebuld object
        if(this.element3D) {
            this.scene.remove(this.element3D);
        }

        this.material = new THREE.MeshPhongMaterial( {
            map: this.turing.getTexture(),//THREE.ImageUtils.loadTexture('lib/three.js-master/examples/textures/tiger_skin.jpg'),
            morphTargets: true,
        });
        this.scale = 0.02;

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
                    .startAt( -duration * Math.random() ).play();


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
            loader.load( "models/monster/monster.js", function( geometry ) {
                addMorph( geometry, 400, 1, individual);
            });
        }

        createMorph(this);
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

        this.element3D.rotation.y = (angleDifference / 2);// + (Math.PI / 2);
        this.oldVelocity = this.velocity;
    }
}