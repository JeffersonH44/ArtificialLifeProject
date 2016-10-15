'use strict';

var config = {
    "general": {
        "numZebras": 25,
        "numLeopards": 7,
        "foodNodes": 2,
        "rows": 10,
        "cols": 10,
        "boxSize": 40
    },
    "zebra": {
        "age": 12,
        "maxEnergy": 15,
        "minEnergy": 2,
        "metabolism": 4,
        "meanView": 5,
        "stdView": 2,
        "cubeSize": 15
    },
    "leopard": {
        "age": 12,
        "maxEnergy": 15,
        "minEnergy": 2,
        "metabolism": 4,
        "viewMean": 5,
        "viewStd": 2,
        "cubeSize": 15
    },
    "tree": {
        "resourceProductionMean": 3,
        "resourceProductionStd": 1,
        "maxResourceMean": 10,
        "maxResourceStd": 1
    },
    "box": {
        "cleanRate": 1
    }
};

var c = document.getElementById("myCanvas");
var simulation = new Simulation(c, config);
Simulation.startSimulation(simulation);

