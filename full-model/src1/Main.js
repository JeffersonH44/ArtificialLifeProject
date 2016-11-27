"use strict";

let config = {
    "general": {
        "numZebras": 35,
        "numLeopards": 3,
        "foodNodes": 2,
        "baseSpeed": 0.01,
        "height": 500,
        "width": 500,
        "depth": 400,
        "avoidWall": true,
        "wallForce": 10
    },
    "zebra": {
        "age": 300,
        "maxEnergy": 300,
        "minEnergy": 2,
        "maxSpeed": 4,
        "metabolism": 1,
        "meanView": 100,
        "stdView": 20,
        "cubeSize": 15,
        "foodRate": 0.6,
        "separation": 5,
        "cohesion": 5,
        "alignment": 5,
        "maxSteerForce": 0.1,
        "pollutionProduction": 0.6,
        "meanEatRadius": 30,
        "stdEatRadius": 5
    },
    "leopard": {
        "age": 12,
        "maxSpeed": 5,
        "maxEnergy": 15,
        "minEnergy": 2,
        "metabolism": 4,
        "meanView": 200,
        "stdView": 40,
        "meanEatRadius": 30,
        "stdEatRadius": 5,
        "cubeSize": 15,
        "foodRate": 0.4,
        "maxSteerForce": 0.1,
        "pollutionProduction": 0.8
    },
    "tree": {
        "maxEnergy": 0,
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

document.addEventListener( 'mousemove', function (event) {
    Simulation.onDocumentMouseMove(event, sim);
}, false );

window.addEventListener( 'resize', function () {
    Simulation.onWindowResize(sim);
}, false );

Simulation.StartSimulation(sim);