'use strict';

var config = {
    "general": {
        "numZebras": 70,
        "numLeopards": 0,
        "foodNodes": 2,
        "rows": 50,
        "cols": 50,
        "boxSize": 40,
        "fps": 15
    },
    "zebra": {
        "age": 300,
        "maxEnergy": 300,
        "minEnergy": 2,
        "metabolism": 4,
        "meanView": 4,
        "stdView": 2,
        "cubeSize": 15,
        "foodRate": 0.6,
        "separation": 5,
        "cohesion": 5,
        "alignment": 5,
        "separationForce": 2,
        "cohesionForce": 5,
        "alignmentForce": 1,
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
        "maxResourceMean": 30,
        "maxResourceStd": 1,
        "downgrade": 1,
        "cubeSize": 10
    },
    "box": {
        "cleanRate": 1
    }
};

var c = document.getElementById("myCanvas");
var simulation = new Simulation(c, config);
Simulation.startSimulation(simulation);

