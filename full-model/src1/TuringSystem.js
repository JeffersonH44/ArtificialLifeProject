'use strict';

function createMatrix(rows, cols) {
    let result = new Array(rows);
    for(let i = 0; i < rows; ++i) {
        result[i] = new Array(cols);
    }
    return result;
}

function copyMatrix(mat) {
    let rows = mat.length;
    let cols = mat[0].length;

    let res = new Array(cols);
    for(let i = 0; i < rows; ++i) {
        res[i] = new Array(cols);
        for(let j = 0; j < cols; ++j) {
            res[i][j] = mat[i][j];
        }
    }

    return res;
}

class TuringSystem {
    constructor(rows, cols, animal) {
        this.Ao = createMatrix(rows, cols);
        this.An = createMatrix(rows, cols);
        this.Bo = createMatrix(rows, cols);
        this.Bn = createMatrix(rows, cols);

        this.rows = rows;
        this.cols = cols;
        if(animal === "zebra") {
            this.CA = Utils.gaussianRandom(2.0, 0.1);
            this.CB = Utils.gaussianRandom(24.0, 0.1);
            this.colors = ["white", "black"];
        } else if(animal === "leopard") {
            this.CA = Utils.gaussianRandom(3.5, 0.3);
            this.CB = Utils.gaussianRandom(16.0, 0.3);
            this.colors = ["yellow", "black"];
        }
    }

    initialize() {
        for(let i = 0; i < this.rows; ++i) {
            for(let j = 0 ; j < this.cols; ++j) {
                // tirano opresor de Daniel (no lo voy a borrar)
                this.Ao[i][j] = Utils.random(0, 1) * 12.0 + Utils.gaussianRandom(0, 1) * 2.0;
                this.Bo[i][j] = Utils.random(0, 1) * 12.0 + Utils.gaussianRandom(0, 1) * 2.0;
                this.An[i][j] = 0.0;
                this.Bn[i][j] = 0.0;
            }
        }
    }

    swapBuffers() {
        let temp = this.Ao;
        this.Ao = this.An;
        this.An = temp;
        temp = this.Bo;
        this.Bo = this.Bn;
        this.Bn = temp;
    }

    copy(CA, CB) {
        let copy = new TuringSystem(1, 1, "zebra");
        copy.Ao = copyMatrix(this.Ao);
        copy.An = copyMatrix(this.An);
        copy.Bo = copyMatrix(this.Bo);
        copy.Bn = copyMatrix(this.Bn);

        copy.rows = this.rows;
        copy.cols = this.cols;
        copy.colors = this.colors;
        copy.CA = CA;
        copy.CB = CB;

        return copy;
    }

    solve(iterations) {
        let n, i, j, iplus1, iminus1, jplus1, jminus1;
        let DiA, ReA, DiB, ReB;
        let height = this.rows, width = this.cols;
        let CA = this.CA, CB = this.CB;
        //this.initialize();

        // uses Euler's method to solve the diff eqns
        for( n=0; n<iterations; ++n ) {
            let Bo = this.Bo, Bn = this.Bn, Ao = this.Ao, An = this.An;
            for( i=0; i<height; ++i) {
                // treat the surface as a torus by wrapping at the edges
                iplus1 = i+1;
                iminus1 = i-1;
                if( i == 0 ) iminus1 = height - 1;
                if( i == height - 1 ) iplus1 = 0;

                for( j=0; j<width; ++j ) {
                    jplus1 = j+1;
                    jminus1 = j-1;
                    if( j == 0 ) jminus1 = width - 1;
                    if( j == width - 1 ) jplus1 = 0;

                    // Component A
                    DiA = CA * ( Ao[iplus1][j] - 2.0 * Ao[i][j] + Ao[iminus1][j]
                        + Ao[i][jplus1] - 2.0 * Ao[i][j] + Ao[i][jminus1] );
                    ReA = Ao[i][j] * Bo[i][j] - Ao[i][j] - 12.0;
                    An[i][j] = Ao[i][j] + 0.01 * (ReA + DiA);
                    if( An[i][j] < 0.0 ) An[i][j] = 0.0;

                    // Component B
                    DiB = CB * ( Bo[iplus1][j] - 2.0 * Bo[i][j] + Bo[iminus1][j]
                        + Bo[i][jplus1] - 2.0 * Bo[i][j] + Bo[i][jminus1] );
                    ReB = 16.0 - Ao[i][j] * Bo[i][j];
                    Bn[i][j] = Bo[i][j] + 0.01 * (ReB + DiB);
                    if( Bn[i][j] < 0.0 ) Bn[i][j]=0.0;
                }
            }
            // Swap Ao for An, Bo for Bn
            this.swapBuffers();
        }
    }

    getLeastValues() {
        let min = Number.POSITIVE_INFINITY;
        let max = Number.NEGATIVE_INFINITY;
        for(let i = 0; i < this.An.length; ++i) {
            for(let j = 0; j < this.Bn[0].length; ++j) {
                min = Math.min(min, this.Bn[i][j]);
                max = Math.max(max, this.Bn[i][j]);
            }
        }
        return [min, max];
    }

    getTexture() {
        let c = document.createElement("canvas");
        let ctx = c.getContext("2d");
        ctx.canvas.height = this.rows;
        ctx.canvas.width = this.cols;
        //document.body.appendChild(c);
        let scale = chroma.scale(this.colors).domain(this.getLeastValues());
        for(let i = 0; i < this.rows; ++i) {
            for(let j = 0; j < this.cols; ++j) {
                let a = this.An[i][j], b = this.Bn[i][j];
                ctx.fillStyle = scale(-a + b);
                ctx.fillRect(i, j, 1, 1);
            }
        }

        let texture = new THREE.Texture(c);

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        texture.offset.set(0, 0);
        texture.needsUpdate = true;
        return texture;
    }

    static load(file) {
        let system = new TuringSystem(2, 2, "zebra");
        system.Bo = file.Bo;
        system.Bn = file.Bn;
        system.Ao = file.Ao;
        system.An = file.An;
        system.rows = file.Bo.length;
        system.cols = file.Bo[0].length;
        system.colors = file.colors;
        return system;
    }
}
