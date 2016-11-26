'use strict';

var morph = new TuringSystem(200, 200, 2.0, 24.0);
morph.solve();
var least = morph.getLeastValues();

var scale = chroma.scale(['black', 'yellow']).domain(least);
var c =  document.getElementById("myCanvas");
var ctx = c.getContext("2d");

morph.fillContext(ctx, scale);
