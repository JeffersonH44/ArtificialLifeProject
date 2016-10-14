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

init();
animate();

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createMatrix() {
    A = new Array(rows + 2*offset);
    B = new Array(rows + 2*offset);
    for(var i = 0; i < A.length; ++i) {
        A[i] = new Array(cols + 2*offset);
        B[i] = new Array(cols + 2*offset);
        for(var j = 0; j < A[i].length; ++j) {
            if(i === 0 || j === 0 || i === A.length || j === A[i].length) {
                A[i][j] = 0.0;
                B[i][j] = 0.0;
            } else {
                A[i][j] = 1.0;
                B[i][j] = 0.0;
            }
        }
    }

    for(var k = 0; k < BPoints; ++k) {
        var row = getRandomInt(20, rows - 20), col = getRandomInt(20, cols - 20);
        var startRow = row - BArea, endRow = row + BArea, startCol = col - BArea, endCol = col + BArea;
        for(startRow; startRow < endRow; ++startRow) {
            for(startCol; startCol < endCol; ++startCol) {
                i = startRow;
                j = startCol;
                A[i][j] = 0.0;
                B[i][j] = 1.0;
            }
        }
    }
}

function convolution(i, j, mat) {
    return conv[0] * mat[i - 1][j - 1] + conv[1] * mat[i - 1][j] + conv[2] * mat[i - 1][j + 1] +
           conv[3] * mat[i][j - 1] + conv[4] * mat[i][j] + conv[5] * mat[i][j + 1] +
           conv[6] * mat[i + 1][j - 1] + conv[7] * mat[i + 1][j] + conv[8] * mat[i + 1][j + 1];
}

function updateMatrix() {
    for(var i = 1; i < rows + 2*offset - 1; ++i) {
        for(var j = 1; j < cols + 2*offset - 1; ++j) {
            var a = A[i][j], b = B[i][j], mul = a * b * b;
            A[i][j] += (difussionA * convolution(i, j, A) - (mul) + feed*(1 - a)) * deltaT;
            B[i][j] += (difussionB * convolution(i, j, B) + (mul) - ((kill + feed)*b)) * deltaT;
        }
    }
}

function fillContext() {
    for(var i = 0; i < rows; ++i) {
        for(var j = 0; j < cols; ++j) {
            var a = A[i + offset][j + offset], b = B[i + offset][j + offset];
            ctx.fillStyle = scale(-a + b);
            ctx.fillRect(i, j, 1, 1);
        }
    }

}

function init() {
    createMatrix();
    var c =  document.getElementById("myCanvas");
    ctx = c.getContext("2d");

    scale = chroma.scale(['yellow', 'black']).domain([-1, 1]);

    fillContext();
}

function animate() {
    //console.log(A);
    for(var i = 0 ; i < iterations; ++i) {
        updateMatrix();
    }
    fillContext();

}