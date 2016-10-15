'use strict';

var morph = new TuringSystem(250, 250, 1.6, 6);
morph.solve(100);

var scale = chroma.scale(['yellow', 'black']).domain([-15, 15]);
var c =  document.getElementById("myCanvas");
var ctx = c.getContext("2d");

morph.fillContext(ctx, scale);
