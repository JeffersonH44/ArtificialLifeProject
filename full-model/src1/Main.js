"use strict";

let sim = new Simulation();
sim.init();

document.addEventListener( 'mousemove', function (event) {
    Simulation.onDocumentMouseMove(event, sim);
}, false );

window.addEventListener( 'resize', function () {
    Simulation.onWindowResize(sim);
}, false );

Simulation.StartSimulation(sim);