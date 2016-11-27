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

        this.initialFoodResource = 10;
        this.stats = new Stats();
        document.getElementById( 'container' ).appendChild(this.stats.dom);
    }

    init(config) {
        let conf = config.general;
        console.log("init!");

        this.camera = new THREE.PerspectiveCamera( 75, this.SCREEN_WIDTH / this.SCREEN_HEIGHT, 1, 10000 );
        this.camera.position.z = 450;

        this.scene = new THREE.Scene();

        this.zebraBoids = new HashSet();
        this.tigerBoids = new HashSet();
        this.foodNodes = new HashSet();

        let configs = [config.zebra, config.leopard];
        let classes = [Zebra, Leopard];
        let inds = [conf.numZebras, conf.numLeopards];
        let indivudualBoids = [this.zebraBoids, this.tigerBoids];

        let startX = conf.width / 5;
        let endX = conf.width - startX;
        let startY = conf.height / 5;
        let endY = conf.height - startY;

        for(let c = 0; c < configs.length; c++) {
            let currentConfig = configs[c];
            let Individual = classes[c];
            let totalIndividuals = inds[c];
            let boids = indivudualBoids[c];

            currentConfig.scene = this.scene;
            currentConfig.baseSpeed = conf.baseSpeed;
            for (let i = 0; i < totalIndividuals; i++ ) {
                this.boid = new Individual(currentConfig);
                boids.add(this.boid);
                this.boid.position.x = Utils.randomInt(startX, endX);
                this.boid.position.y = Utils.randomInt(startY, endY);
                this.boid.position.z = 0;
                this.boid.velocity.x = Utils.random(-1, 1);
                this.boid.velocity.y = Utils.random(-1, 1);
                this.boid.velocity.z = 0;
                this.boid.setAvoidWalls( conf.avoidWall );
                this.boid.setWorldSize( conf.width, conf.height, conf.depth );
            }
        }

        let positions = [
            [-175, -175], [175, 175]
        ];
        config.tree.scene = this.scene;
        config.tree.baseSpeed = conf.baseSpeed;

        for(let i = 0 ; i < positions.length; ++i) {
            for(let j = 0; j < 40; ++j) {
                let x = positions[i][0];
                let y = positions[i][1];
                this.foodNode = new Food(config.tree);
                this.foodNodes.add(this.foodNode);
                this.foodNode.position.x = Utils.gaussianRandom(x, 50);
                this.foodNode.position.y = Utils.gaussianRandom(y, 50);
                this.foodNode.position.z = 0; //Math.random() * 400 - 200
                this.foodNode.velocity.x = 0;
                this.foodNode.velocity.y = 0;
                this.foodNode.velocity.z = 0;
                this.foodNode.setAvoidWalls(true);
                this.foodNode.setWorldSize(500, 500, 400);
                this.foodNode.run();
                this.foodNode.setDeath();
            }
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
        for (let i = 0; i < boids.length; i++ ) {
            simulation.boid = boids[ i ];
            vector.z = 0; //boid.position.z
            simulation.boid.follow(vector);
        }

        boids = simulation.tigerBoids.values();
        for (let i = 0; i < boids.length; i++ ) {
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
        simulation.stats.begin();
        simulation.render();
        simulation.stats.end();
    }

    render() {
        let boids = this.zebraBoids.values();
        let boids_t = this.tigerBoids.values();
        let foodNodes = this.foodNodes.values();

        for (let i = 0; i < boids.length; i++ ) {
            this.boid = boids[ i ];
            this.boid.run( boids, boids_t, foodNodes);
        }

        for (let i = 0; i < boids_t.length; i++ ) {
            this.boid_t = boids_t[ i ];
            this.boid_t.run(boids);
        }

        for (let i = 0 ; i < foodNodes.length; i++) {
            this.foodNode = foodNodes[i];
            this.foodNode.action();
        }



        // loop of death
        for (let i = 0; i < boids.length; i++ ) {

            this.boid = boids[ i ];
            if(this.boid.isRemovable()) {
                this.zebraBoids.remove(this.boid);
            }
        }

        //console.log( "Death?? 1=" + zebraBoids[0].death_state + "  2= " + zebraBoids[1].death_state );

        this.renderer.render( this.scene, this.camera );
    }
}
