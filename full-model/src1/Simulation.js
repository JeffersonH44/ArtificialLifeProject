"use strict";

/*var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight,
    SCREEN_WIDTH_HALF = SCREEN_WIDTH  / 2, SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;*/

class Simulation {

    constructor() {
        this.SCREEN_WIDTH = window.innerWidth;
        this.SCREEN_HEIGHT = window.innerHeight;
        this.SCREEN_WIDTH_HALF = this.SCREEN_WIDTH  / 2;
        this.SCREEN_HEIGHT_HALF = this.SCREEN_HEIGHT / 2;

        this.tiger = undefined;
        this.zebra = undefined;
        this.boid_t = undefined;
        this.foodNode = undefined;

        /*var camera, scene, renderer,
            birds, bird;

        var tigers, tiger; //tigers

        var boid, zebraBoids;

        var boid_t, tigerBoids;

        var treeUnit;

        var stats;

        //For  the Tree unit
        var iterations = 6;
        var nTimes = 200;*/


        /*init();
        animate();*/
    }

    init() {
        console.log("init!");

        this.camera = new THREE.PerspectiveCamera( 75, this.SCREEN_WIDTH / this.SCREEN_HEIGHT, 1, 10000 );
        this.camera.position.z = 450;

        this.scene = new THREE.Scene();

        //this.zebras = new HashSet();
        this.zebraBoids = new HashSet();
        //this.tigers = new HashSet();
        this.tigerBoids = new HashSet();
        this.foodNodes = new HashSet();

        for ( var i = 0; i < 35; i++ ) {
            this.boid = new Zebra({
                scene: this.scene,
                resource: this.resource
            });
            this.zebraBoids.add(this.boid);
            //this.boid = this.zebraBoids[ i ];
            this.boid.position.x = Math.random() * 400 - 200;
            this.boid.position.y = Math.random() * 400 - 200;
            this.boid.position.z = 0; //Math.random() * 400 - 200
            this.boid.velocity.x = Math.random() * 2 - 1;
            this.boid.velocity.y = Math.random() * 2 - 1;
            this.boid.velocity.z = 0;  //Math.random() * 2 - 1
            this.boid.setAvoidWalls( true );
            this.boid.setWorldSize( 500, 500, 400 );

            //this.zebras.push(new THREE.Mesh( new THREE.BoxGeometry(8,8,8), new THREE.MeshBasicMaterial( { color:0x0000ff} ) ));
            //this.zebra = this.zebras[ i ];
            //bird.phase = Math.floor( Math.random() * 62.83 );
            //this.scene.add( this.zebra );
        }

        for ( var i = 0; i < 3; i ++ ) {
            this.boid_t = new Leopard({
                scene: this.scene,
                resource: this.resource
            });
            this.tigerBoids.add(this.boid_t);
            //this.boid_t = this.tigerBoids[ i ];
            this.boid_t.position.x = Math.random() * 400 - 200;
            this.boid_t.position.y = Math.random() * 400 - 200;
            this.boid_t.position.z = 0; //Math.random() * 400 - 200
            this.boid_t.velocity.x = Math.random() * 2 - 1;
            this.boid_t.velocity.y = Math.random() * 2 - 1;
            this.boid_t.velocity.z = 0;  //Math.random() * 2 - 1
            this.boid_t.setAvoidWalls( true );
            this.boid_t.setWorldSize( 500, 500, 400 );

            //this.tigers.push(new THREE.Mesh( new THREE.BoxGeometry(8,8,8), new THREE.MeshBasicMaterial( { color:0xff0000} ) ));
            //this.tiger = this.tigers[ i ];
            //bird.phase = Math.floor( Math.random() * 62.83 );
            //this.scene.add( this.tiger );
        }

        for(var i = 0; i < 40; ++i) {
            this.foodNode = new Food({
                scene: this.scene,
                resource: this.resource,
                resourceProduction: 10
            });
            this.foodNodes.add(this.foodNode);
            this.foodNode.position.x = Utils.gaussianRandom(250, 50);
            this.foodNode.position.y = Utils.gaussianRandom(250, 50);
            this.foodNode.position.z = 0; //Math.random() * 400 - 200
            this.foodNode.velocity.x = 0;
            this.foodNode.velocity.y = 0;
            this.foodNode.velocity.z = 0;
            this.foodNode.setAvoidWalls(true);
            this.foodNode.setWorldSize(500, 500, 400);
            //this.foodNode.move3DObject();
        }

        this.renderer = new THREE.CanvasRenderer();
        this.renderer.setClearColor( 0xffffff );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( this.SCREEN_WIDTH, this.SCREEN_HEIGHT );

        document.body.appendChild( this.renderer.domElement );

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        //stats = new Stats();
        //document.getElementById( 'container' ).appendChild(stats.dom);

        //

        //go();
    }

    /*go() {

        treeUnit = new treeGenerator(200,200,0, iterations);

        treeUnit.growing(nTimes);

        this.scene.add(treeUnit.output_obj[0]);
        this.scene.add(treeUnit.output_obj[1]);
    }*/


    static onWindowResize(simulation) {

        simulation.camera.aspect = window.innerWidth / window.innerHeight;
        simulation.camera.updateProjectionMatrix();

        simulation.renderer.setSize( window.innerWidth, window.innerHeight );

    }

    static onDocumentMouseMove( event, simulation) {

        let vector = new THREE.Vector3( event.clientX - simulation.SCREEN_WIDTH_HALF, - event.clientY + simulation.SCREEN_HEIGHT_HALF, 0 );
        let boids = simulation.zebraBoids.values();
        for ( var i = 0; i < boids.length; i++ ) {
            simulation.boid = boids[ i ];
            vector.z = 0; //boid.position.z
            simulation.boid.follow(vector);
        }

        boids = simulation.tigerBoids.values();
        for ( var i = 0; i < boids.length; i++ ) {
            simulation.boid_t = boids[ i ];
            vector.z = 0; //boid.position.z
            simulation.boid_t.repulse( vector );
        }
    }

    //
    static StartSimulation(simulation) {
        requestAnimationFrame(function () {
            Simulation.StartSimulation(simulation);
        });
        simulation.render();
    }


    /*animate() {

        requestAnimationFrame( animate );

        //stats.begin();
        render();
        //stats.end();
    }*/


    render() {


        let boids = this.zebraBoids.values();
        let boids_t = this.tigerBoids.values();
        let foodNodes = this.foodNodes.values();

        for ( var i = 0; i < boids.length; i++ ) {

            this.boid = boids[ i ];
            this.boid.run( boids, boids_t );

            //this.zebra = this.zebras[ i ];
            //this.zebra.position.copy( this.zebraBoids[ i ].position );


            //color = bird.material.color;

            //color.r = color.g = color.b = ( 500 - bird.position.z*2 ) / 1000; //

            //bird.rotation.y = Math.atan2( - boid.velocity.z, boid.velocity.x );
            //this.zebra.rotation.z = Math.asin( this.boid.velocity.y / this.boid.velocity.length() );

            //bird.phase = ( bird.phase + ( Math.max( 0, bird.rotation.z ) + 0.1 )  ) % 62.83;
            //.geometry.vertices[ 5 ].y = bird.geometry.vertices[ 4 ].y = Math.sin( bird.phase ) * 5;
            //this.scene.add(this.zebra);
        }

        for ( var i = 0; i < boids_t.length; i++ ) {
            this.boid_t = boids_t[ i ];
            this.boid_t.run(boids);

            //this.tiger = this.tigers[ i ];
            //this.tiger.position.copy( this.tigerBoids[ i ].position );

            //this.tiger.rotation.z = Math.asin( this.boid_t.velocity.y / this.boid_t.velocity.length() );

            //this.scene.add(this.tiger);
        }

        for (var i = 0 ; i < foodNodes.length; i++) {
            this.foodNode = foodNodes[i];
            this.foodNode.run()
        }



        // loop of death
        for ( var i = 0; i < boids.length; i++ ) {

            this.boid = boids[ i ];
            if(this.boid.isDead()) {
                this.zebraBoids.remove(this.boid);
                console.log("killed");
            }
        }

        //console.log( "Death?? 1=" + zebraBoids[0].death_state + "  2= " + zebraBoids[1].death_state );

        this.renderer.render( this.scene, this.camera );
    }
}
