"use strict";

let config = {
    "general": {
        "numZebras": 20,
        "numLeopards": 3,
        "foodNodes": 2,
        "baseSpeed": 0.01,
        "height": 500,
        "width": 500,
        "depth": 400,
        "avoidWall": true,
        "wallForce": 8
    },
    "zebra": {
        "turing": zebrasSkin,
        "age": 300,
        "maxEnergy": 300,
        "minEnergy": 2,
        "maxSpeed": 4,
        "metabolism": 5,
        "meanView": 100,
        "stdView": 20,
        "cubeSize": 15,
        "foodRate": 0.9,
        "separation": 5,
        "cohesion": 5,
        "alignment": 5,
        "maxSteerForce": 0.1,
        "pollutionProduction": 0.6,
        "meanEatRadius": 30,
        "stdEatRadius": 5,
        "meanEatSpeed": 10,
        "stdEatSpeed": 1,
        "reproductionView": 30
    },
    "leopard": {
        "turing": leopardsSkin,
        "age": 12,
        "maxSpeed": 5,
        "maxEnergy": 30,
        "minEnergy": 2,
        "metabolism": 4,
        "meanView": 200,
        "stdView": 40,
        "meanEatRadius": 30,
        "stdEatRadius": 5,
        "cubeSize": 15,
        "foodRate": 0.7,
        "maxSteerForce": 0.1,
        "pollutionProduction": 0.8,
        "meanEatSpeed": 8,
        "stdEatSpeed": 2,
        "reproductionView": 30
    },
    "tree": {
        "maxEnergy": 30,
        "minEnergy": 0,
        "resourceProductionMean": 3,
        "resourceProductionStd": 1,
        "maxResourceMean": 3,
        "maxResourceStd": 1,
        "downgrade": 1,
        "cubeSize": 10
    }
};

let sim = new Simulation();
sim.init(config);

/*document.addEventListener( 'mousemove', function (event) {
    Simulation.onDocumentMouseMove(event, sim);
}, false );

window.addEventListener( 'resize', function () {
    Simulation.onWindowResize(sim);
}, false );*/

Simulation.StartSimulation(sim);