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

        // for animation
        this.light = undefined;
        this.clock = new THREE.Clock();

        this.mixer = undefined;
        this.vX = new THREE.Vector3(1,0,0); //vector X
        this.vY = new THREE.Vector3(0,1,0); //vector Y
        this.vZ = new THREE.Vector3(0,0,1); //vector Z

        //For orientation
        this.angle_to_rotate = undefined;
        this.vel_angle = undefined;
        this.zebra_angle = undefined;
        this.tiger_angle = undefined;

        this.angle_old = undefined; // old angle
        this.vel_old_angle = undefined;
        this.angle_difference = undefined;

        //Grass
        this.geometryGrass = new THREE.BoxGeometry(1000,1000,1);
        this.materialGrass  = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('lib/three.js-master/examples/textures/terrain/grasslight-big.jpg') });

    }

    init(config, trees3D) {
        trees3D = trees3D || this.trees3D;
        let conf = config.general;
        console.log("init!");

        this.camera = new THREE.PerspectiveCamera( 75, this.SCREEN_WIDTH / this.SCREEN_HEIGHT, 1, 10000 );
        this.camera.position.z = 450;

        this.scene = new THREE.Scene();

        // lights
        this.ambient = new THREE.AmbientLight( 0x444444 );
        this.scene.add(this.ambient);

        this.light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 2 );
        this.light.position.set( 0, 1500, 1000 );
        this.light.target.position.set( 0, 0, 0 );

        this.light.castShadow = true;
        this.scene.add( this.light );

        this.grass = new THREE.Mesh(this.geometryGrass, this.materialGrass);
        this.scene.add(this.grass);

        //For the default animation of the mesh ****
        //For the clip animation of the animal
        this.mixer = new THREE.AnimationMixer(this.scene);

        this.zebraBoids = new HashSet();
        this.tigerBoids = new HashSet();
        this.foodNodes = new HashSet();
        this.pollutionNodes = new HashSet();

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
            currentConfig.mixer = this.mixer;
            currentConfig.population = boids;
            currentConfig.pollution = this.pollutionNodes;
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

        // trees config
        let positions = [
            [-175, -175], [175, 175]
        ];
        this.trees3D = new Array(positions.length);
        this.nTimes = 1;
        this.deltaSum = 0;

        this.timeRate = 0.5;
        this.timeCounter = this.timeRate / 0.02;
        this.growRate = 1;

        config.tree.scene = this.scene;
        config.tree.baseSpeed = conf.baseSpeed;

        for(let i = 0 ; i < positions.length; ++i) {
            let x = positions[i][0];
            let y = positions[i][1];
            this.trees3D[i] = new treeGenerator(x, y, 0, Utils.randomInt(4, 6), this.scene);
            this.trees3D[i].growing(this.nTimes);
            this.scene.add(this.trees3D[i].output_obj[0]);
            this.scene.add(this.trees3D[i].output_obj[1]);
            for(let j = 0; j < 40; ++j) {
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

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            width: 1024
        });
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
        let delta =  this.clock.getDelta();
        this.mixer.update(delta);

        let boids = this.zebraBoids.values();
        let boids_t = this.tigerBoids.values();
        //console.log("leopards:", boids_t.length, "zebras:", boids.length);
        let foodNodes = this.foodNodes.values();
        let pollutionNodes = this.pollutionNodes.values();

        for (let i = 0; i < boids.length; i++ ) {
            this.boid = boids[ i ];
            this.boid.run( boids, boids_t, foodNodes, pollutionNodes);
        }

        for (let i = 0; i < boids_t.length; i++ ) {
            this.boid_t = boids_t[ i ];
            this.boid_t.run(boids, boids_t, boids, pollutionNodes);
        }

        for (let i = 0 ; i < foodNodes.length; i++) {
            this.foodNode = foodNodes[i];
            this.foodNode.action();
        }

        for (let i = 0 ; i < pollutionNodes.length; i++) {
            let pollutionNode = pollutionNodes[i];
            pollutionNode.action();
        }

        // grow trees
        this.deltaSum += 1;
        if(this.deltaSum % this.timeCounter === 0) {
            this.nTimes += this.growRate;
            for(let i = 0; i < this.trees3D.length; ++i) {
                this.trees3D[i].growing(this.nTimes);
                this.scene.add(this.trees3D[i].output_obj[0]);
                this.scene.add(this.trees3D[i].output_obj[1]);
            }
        }


        // loop of death
        for (let i = 0; i < boids.length; i++ ) {
            this.boid = boids[ i ];
            if(this.boid.isRemovable()) {
                this.zebraBoids.remove(this.boid);
            }
        }

        for(let i = 0; i < boids_t.length; ++i) {
            this.boid = boids_t[i];
            if(this.boid.isRemovable()) {
                this.tigerBoids.remove(this.boid);
            }
        }

        //console.log( "Death?? 1=" + zebraBoids[0].death_state + "  2= " + zebraBoids[1].death_state );
        this.renderer.clear();
        this.renderer.render( this.scene, this.camera );
    }
}
