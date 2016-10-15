'use strict';

class Simulation {
    constructor(ctx, config) {
        var generalConfig = config.general;
        this.boxSize = generalConfig.boxSize;
        this.create3DScenario(ctx, generalConfig);
        this.createScenario(config);
    }

    createScenario(config) {
        var generalConfig = config.general;

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
        var rows = generalConfig.rows;
        var cols = generalConfig.cols;
        this.grid = new Array(rows);

        for(var i = 0; i < rows; ++i) {
            this.grid[i] = new Array(cols);
            for(var j = 0; j < cols; ++j) {
                this.grid[i][j] = new Box(config.box);
            }
        }

        console.log("ho");
        this.fillIndividual(Zebra, generalConfig.numZebras, config.zebra);
        this.fillIndividual(Leopard, generalConfig.numLeopards, config.leopard);
        this.generateTrees(generalConfig.foodNodes, config.tree);
    }

    iterate() {
        var rows = this.grid.length;
        var cols = this.grid[0].length;
        for(var i = 0; i < rows; ++i) {
            for(var j = 0; j < cols; ++j) {
                this.grid.iterate(this.grid, i, j);
            }
        }
    }

    generateTrees(nodes, treeConfig) {
        var rows = this.grid.length;
        var cols = this.grid[0].length;
        var rowsOffset = rows / 15;
        var colsOffset = cols / 15;

        var node = [
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

        for(var i = 0; i < nodes; ++i) {
            var currentNode = node[i];
            var row = Utils.randomInt(currentNode.startRow, currentNode.endRow);
            var col = Utils.randomInt(currentNode.startCol, currentNode.endCol);
            this.fillTreeNode(row, col, treeConfig);
        }
    }

    fillTreeNode(row, col, treeConfig) {
        var rows = this.grid.length;
        var cols = this.grid[0].length;

        var visited = new Array(rows);
        for(var i = 0; i < rows; ++i) {
            visited[i] = new Array(cols);
            for(var j = 0; j < cols; ++j) {
                visited[i][j] = false;
            }
        }

        var queue = new Queue();
        queue.enqueue([row, col, treeConfig.maxResourceMean]);
        while(!queue.isEmpty()) {
            var currentValue = queue.dequeue();
            var r = currentValue[0];
            var c = currentValue[1];
            var maxResource = currentValue[2];

            if(r < 0 || r >= rows || c < 0 || c >= cols || visited[r][c]) {
                continue;
            }

            if(this.grid[r][c].tree === undefined ||
                this.grid[r][c].tree.maxResource < maxResource) {
                treeConfig.maxResourceMean = maxResource;
                this.grid[r][c].tree = new Tree(this.scene, treeConfig);
            }

            queue.enqueue([r + 1, c, maxResource - 1]);
            queue.enqueue([r, c + 1, maxResource - 1]);
            queue.enqueue([r - 1, c, maxResource - 1]);
            queue.enqueue([r, c - 1, maxResource - 1]);
            visited[r][c] = true;
        }
    }

    fillIndividual(Individual, size, config) {
        var rows = this.grid.length;
        var cols = this.grid[0].length;
        for(var i = 0; i < size; ++i) {
            var pos = this.getEmptyPosition(rows, cols);
            var row = pos[0];
            var col = pos[1];
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

        this.camera.position.z = 1000;

        this.renderer.setSize(width, height);

        // TODO: to change

        var basicMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF0000
        });

        var grid = new THREE.Mesh(
            new THREE.PlaneGeometry(width, height, size, size),
            basicMaterial);
        grid.translateX(width / 2);
        grid.translateY(height / 2);
        //sphere.position.x = 100;
        this.scene.add(grid);

        var lightPoint = new THREE.PointLight(0xFFFFFFF);
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
