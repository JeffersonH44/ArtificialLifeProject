/**
 * Created by jefferson on 26/09/16.
 */
"use strict";

var camera, scene, renderer;
var geometry, material, mesh;
var kill=0.062, feed=0.03, difussionA=1.0, difussionB=0.5, deltaT=1.0, offset = 5;
var BArea = 5;
var A, B, rows=256, cols=256, iterations = 9000, BPoints = 20;
var conv = [0.05, 0.2, 0.05, 0.2, -1, 0.2, 0.05, 0.2, 0.05];
var fps = 1000;
var ctx, scale;

class Square {
    constructor() {
        this.squareGeometry = new THREE
    }
}

init();
animate();

function init() {
    // set the scene size
    var WIDTH = 400,
        HEIGHT = 300;

    // set some camera attributes
    var VIEW_ANGLE = 45,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000;

    // get the DOM element to attach to
    // - assume we've got jQuery to hand
    var c =  document.getElementById("myCanvas");

    // create a WebGL renderer, camera
    // and a scene
    var renderer = new THREE.WebGLRenderer({
        canvas: c
    });
    var camera =
        new THREE.PerspectiveCamera(
            VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR);

    var scene = new THREE.Scene();

    // add the camera to the scene
    scene.add(camera);

    // the camera starts at 0,0,0
    // so pull it back
    camera.position.z = 300;

    // start the renderer
    renderer.setSize(WIDTH, HEIGHT);

    var rad = 50, segments = 16, rings = 16;

    var sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0xCC0000
    });
    var basicMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000,
        wireframe: true
    });

    var size = 30;
    var width = 5;
    var height = 5;
    var grid = new THREE.Mesh(
        new THREE.PlaneGeometry(size*width, size*height, size, size),
        basicMaterial);
    //sphere.position.x = 100;
    scene.add(grid);

    var lightPoint = new THREE.PointLight(0xFFFFFFF);
    lightPoint.position.x = 10;
    lightPoint.position.y = 50;
    lightPoint.position.z = 130;
    scene.add(lightPoint);

    //scene.remove(sphere);

    renderer.render(scene, camera);


}

function animate() {

}