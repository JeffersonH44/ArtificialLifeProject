'use strict';

class Simulation {
    constructor(ctx, config) {
        let generalConfig = config.general;
        this.boxSize = generalConfig.boxSize;
        this.create3DScenario(ctx, generalConfig);
        this.createScenario(config);
    }

    createScenario(config) {
        let generalConfig = config.general;

        // creating all individuals
        /*this.zebras = [];
        this.leopards = [];
        for(var i = 0; i < generalConfig.numZebras; ++i) {
            this.zebras.push(new Zebra(this.ctx, config.zebra));
        }
        for(i = 0; i < generalConfig.numLeopards; ++i) {
            this.leopards.push(new Leopard(this.ctx, config.leopard));
        }*/

        // creating scenario
        let rows = generalConfig.rows;
        let cols = generalConfig.cols;
        this.grid = new Array(rows);

        for(let i = 0; i < rows; ++i) {
            this.grid[i] = new Array(cols);
            for(let j = 0; j < cols; ++j) {
                this.grid[i][j] = new Box(config.box);
            }
        }

        this.fillIndividual(Zebra, generalConfig.numZebras, config.zebra);
        this.fillIndividual(Leopard, generalConfig.numLeopards, config.leopard);
        this.generateTrees(generalConfig.foodNodes, config.tree);
    }

    iterate() {
        let rows = this.grid.length;
        let cols = this.grid[0].length;
        for(let i = 0; i < rows; ++i) {
            for(let j = 0; j < cols; ++j) {
                this.grid.iterate(this.grid, i, j);
            }
        }
    }

    generateTrees(nodes, treeConfig) {
        let rows = this.grid.length;
        let cols = this.grid[0].length;
        let rowsOffset = Math.floor(rows / 2);
        let colsOffset = Math.floor(cols / 2);

        let node = [
            {
                startRow: 0,
                endRow: rowsOffset,
                startCol: 0,
                endCol: colsOffset
            },
            {
                startRow: rows - rowsOffset,
                endRow: rows,
                startCol: cols - colsOffset,
                endCol: cols
            },
            {
                startRow: 0,
                endRow: rowsOffset,
                startCol: cols - colsOffset,
                endCol: cols
            },
            {
                startRow: rows - rowsOffset,
                endRow: rows,
                startCol: 0,
                endCol: colsOffset
            },
        ];

        for(let i = 0; i < nodes; ++i) {
            let currentNode = node[i];
            let row = Utils.randomInt(currentNode.startRow, currentNode.endRow);
            let col = Utils.randomInt(currentNode.startCol, currentNode.endCol);
            this.fillTreeNode(row, col, treeConfig);
        }
    }

    fillTreeNode(row, col, treeConfig) {
        let rows = this.grid.length;
        let cols = this.grid[0].length;
        let downgrade = treeConfig.downgrade;
        let initialMaxResource = treeConfig.maxResourceMean;

        let visited = new Array(rows);
        for(let i = 0; i < rows; ++i) {
            visited[i] = new Array(cols);
            for(let j = 0; j < cols; ++j) {
                visited[i][j] = false;
            }
        }

        let queue = new Queue();
        queue.enqueue([row, col, treeConfig.maxResourceMean]);
        while(!queue.isEmpty()) {
            let currentValue = queue.dequeue();
            let r = currentValue[0];
            let c = currentValue[1];
            let maxResource = currentValue[2];

            if(r < 0 || r >= rows || c < 0 || c >= cols || maxResource <= 0 || visited[r][c]) {
                continue;
            }

            // TODO: remove method in case of exist
            if(this.grid[r][c].tree === undefined ||
                this.grid[r][c].tree.maxResource < maxResource) {
                treeConfig.maxResourceMean = maxResource;
                this.grid[r][c].tree = new Tree(this.scene, treeConfig, r, c, this.boxSize);
            }

            queue.enqueue([r + 1, c, maxResource - downgrade]);
            queue.enqueue([r, c + 1, maxResource - downgrade]);
            queue.enqueue([r - 1, c, maxResource - downgrade]);
            queue.enqueue([r, c - 1, maxResource - downgrade]);
            visited[r][c] = true;
        }

        treeConfig.maxResourceMean = initialMaxResource;
    }

    fillIndividual(Individual, size, config) {
        console.log(Individual);
        let rows = this.grid.length;
        let cols = this.grid[0].length;
        for(let i = 0; i < size; ++i) {
            let pos = this.getEmptyPosition(rows, cols);
            let row = pos[0];
            let col = pos[1];
            this.grid[row][col].individual = new Individual(this.scene, config, row, col, this.boxSize);
        }
    }

    getEmptyPosition(rows, cols) {
        do {
            var row = Utils.randomInt(0, rows);
            var col = Utils.randomInt(0, cols);
        } while (this.grid[row][col].individual !== undefined);
        return [row, col]
    }

    generateTexture() {
        let canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;

        let context = canvas.getContext('2d');

        for (let i = 0; i < 20000; i ++ ) {

            context.fillStyle = 'hsl(0,0%,' + ( Math.random() * 50 + 50 ) + '%)';
            context.beginPath();
            context.arc( Math.random() * canvas.width, Math.random() * canvas.height, Math.random() + 0.15, 0, Math.PI * 2, true );
            context.fill();

        }

        context.globalAlpha = 0.075;
        context.globalCompositeOperation = 'lighter';

        return canvas;
    }

    create3DScenario(ctx, config) {
        this.ctx = ctx;
        let width = config.cols * config.boxSize;
        let height = config.rows * config.boxSize;
        let size = config.size;

        let viewAngle = 45;
        let aspect = width / height;
        let near = 0.1;
        let far = 10000;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.ctx
        });

        this.camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);

        this.scene = new THREE.Scene();

        this.scene.add(this.camera);

        this.camera.position.z = 1000;

        this.renderer.setSize(width, height);

        // TODO: to change

        let textureUrl = 'images/grasslight-small.jpg';
        let texture = THREE.ImageUtils.loadTexture(textureUrl);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.x= 10;
        texture.repeat.y= 10;
        texture.anisotropy = this.renderer.getMaxAnisotropy();
        // build object3d
        let geometry = new THREE.PlaneGeometry(width, height, size, size);
        let material = new THREE.MeshPhongMaterial({
            map: texture,
            emissive: 'green'
        });
        let grid = new THREE.Mesh(geometry, material);
        grid.translateX(width / 2);
        grid.translateY(height / 2);
        this.scene.add(grid);

        let lightPoint = new THREE.PointLight(0xFFFFFFF);
        lightPoint.position.x = 10;
        lightPoint.position.y = 50;
        lightPoint.position.z = 130;
        this.scene.add(lightPoint);

        //scene.remove(sphere);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        this.renderer.render(this.scene, this.camera);

    }

    show() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    static startSimulation(simulation) {
        requestAnimationFrame(function() {
            Simulation.startSimulation(simulation);
        });
        simulation.show();
    }
}
