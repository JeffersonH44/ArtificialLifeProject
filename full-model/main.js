'use strict';

var config = {
    "general": {
        "numZebras": 30,
        "numLeopards": 20,
        "foodNodes": 2,
        "rows": 10,
        "cols": 10,
        "boxSize": 100
    },
    "zebra": {
        "age": 12,
        "maxEnergy": 15,
        "minEnergy": 2,
        "metabolism": 4,
        "meanView": 5,
        "stdView": 2,
        "cubeSize": 15,
        "foodRate": 0.4,
        "separation": 2,
        "cohesion": 4,
        "separationForce": 0.15,
        "cohesionForce": 0.1,
        "pollutionProduction": 0.6
    },
    "leopard": {
        "age": 12,
        "maxEnergy": 15,
        "minEnergy": 2,
        "metabolism": 4,
        "meanView": 5,
        "stdView": 2,
        "cubeSize": 15,
        "foodRate": 0.4,
        "pollutionProduction": 0.8
    },
    "tree": {
        "resourceProductionMean": 3,
        "resourceProductionStd": 1,
        "maxResourceMean": 10,
        "maxResourceStd": 1,
        "downgrade": 3,
        "cubeSize": 10
    },
    "box": {
        "cleanRate": 1
    }
};

var c = document.getElementById("myCanvas");
var simulation = new Simulation(c, config);
Simulation.startSimulation(simulation);

