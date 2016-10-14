'use strict';

class Simulation {
    constructor(ctx, config) {
        var generalConfig = config.general;
        this.create3DScenario(ctx, generalConfig);
        this.createScenario(config);
    }

    createScenario(config) {
        var generalConfig = config.general;

        // creating all individuals
        this.zebras = [];
        this.leopards = [];
        for(var i = 0; i < generalConfig.numZebras; ++i) {
            this.zebras.push(new Zebra(this.ctx, config.zebra));
        }
        for(i = 0; i < generalConfig.numLeopards; ++i) {
            this.leopards.push(new Leopard(this.ctx, config.leopard));
        }

        // creating scenario
        this.grid = new Array(generalConfig.rows);

        for(i = 0; i < generalConfig.rows; ++i) {
            this.grid[i] = new Array(generalConfig.cols);
            for(var j = 0; j < generalConfig.cols; ++j) {
                this.grid[i][j] = new Box(config.box);
            }
        }

        // put all individuals inside
    }

    create3DScenario(ctx, config) {
        this.ctx = ctx;
        var width = config.cols * config.boxSize;
        var height = config.rows * config.boxSize;
        var size = config.size;

        var viewAngle = 45;
        var aspect = width / height;
        var near = 0.1;
        var far = 10000;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.ctx
        });

        this.camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);

        this.scene = new THREE.Scene();

        this.scene.add(this.camera);

        this.camera.position.z = 300;

        this.renderer.setSize(width, height);

        // TODO: to change

        var basicMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF0000
        });

        var grid = new THREE.Mesh(
            new THREE.PlaneGeometry(width, height, size, size),
            basicMaterial);
        //sphere.position.x = 100;
        this.scene.add(grid);

        var lightPoint = new THREE.PointLight(0xFFFFFFF);
        lightPoint.position.x = 10;
        lightPoint.position.y = 50;
        lightPoint.position.z = 130;
        this.scene.add(lightPoint);

        //scene.remove(sphere);

        this.renderer.render(this.scene, this.camera);

    }
}
