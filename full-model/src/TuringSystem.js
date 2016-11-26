'use strict';

function createMatrix(rows, cols) {
    var result = new Array(rows);
    for(var i = 0; i < rows; ++i) {
        result[i] = new Array(cols);
    }

    return result;
}

class TuringSystem {
    constructor(rows, cols, CA, CB) {
        this.Ao = createMatrix(rows, cols);
        this.An = createMatrix(rows, cols);
        this.Bo = createMatrix(rows, cols);
        this.Bn = createMatrix(rows, cols);

        this.rows = rows;
        this.cols = cols;
        this.CA = CA;
        this.CB = CB;
    }

    initialize() {
        for(var i = 0; i < this.rows; ++i) {
            for(var j = 0 ; j < this.cols; ++j) {
                this.Ao[i][j] = Utils.randomInt(0, 1) * 12.0 + Utils.gaussianRandom(0, 1) * 2.0;
                this.Bo[i][j] = Utils.randomInt(0, 1) * 12.0 + Utils.gaussianRandom(0, 1) * 2.0;
                this.An[i][j] = 0.0;
                this.Bn[i][j] = 0.0;
            }
        }
    }

    swapBuffers() {
        var temp = this.Ao;
        this.Ao = this.An;
        this.An = temp;
        temp = this.Bo;
        this.Bo = this.Bn;
        this.Bn = temp;
    }

    solve(iterations) {
        let n, i, j, iplus1, iminus1, jplus1, jminus1;
        let DiA, ReA, DiB, ReB;
        let height = this.rows, width = this.cols;
        let CA = this.CA, CB = this.CB;
        this.initialize();

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
        console.log(this.An);
        console.log(this.Bn);

        /*var DiA = 0.0, ReA = 0.0, DiB = 0.0, ReB = 0.0;

        this.initialize();
        for(var k = 0; k < iterations; ++k) {
            for(var i = 0; i < this.rows; ++i) {
                // treat the surface as a torus by wrapping at the edges
                var iPlus1 = i + 1;
                var iMinus1 = i - 1;
                if (i == 0) iMinus1 = this.rows - 1;
                if (i == this.rows - 1) iPlus1 = 0;

                for (var j = 0; j < this.cols; ++j) {
                    //if(i == 0 && j == 0) console.log(this.An[i][j]);
                    var jPlus1 = j + 1;
                    var jMinus1 = j - 1;
                    if (j == 0) jMinus1 = this.cols - 1;
                    if (j == this.cols - 1) jPlus1 = 0;

                    // Component A
                    DiA = this.CA * ( this.Ao[iPlus1][j] - 2.0 * this.Ao[i][j] + this.Ao[iMinus1][j]
                        + this.Ao[i][jPlus1] - 2.0 * this.Ao[i][j] + this.Ao[i][jMinus1] );
                    ReA = this.Ao[i][j] * this.Bo[i][j] - this.Ao[i][j] - 12.0;
                    this.An[i][j] = this.Ao[i][j] + 0.01 * (ReA + DiA);
                    if (this.An[i][j] < 0.0) this.An[i][j] = 0.0;

                    // Component B
                    DiB = this.CB * ( this.Bo[iPlus1][j] - 2.0 * this.Bo[i][j] + this.Bo[iMinus1][j]
                        + this.Bo[i][jPlus1] - 2.0 * this.Bo[i][j] + this.Bo[i][jMinus1] );
                    ReB = 16.0 - this.Ao[i][j] * this.Bo[i][j];
                    this.Bn[i][j] = this.Bo[i][j] + 0.01 * (ReB + DiB);
                    if (this.Bn[i][j] < 0.0) this.Bn[i][j] = 0.0;
                }
            }

            this.swapBuffers();
        }
        console.log(this.An);*/
    }

    getLeastValues() {
        var min = Number.POSITIVE_INFINITY;
        var max = Number.NEGATIVE_INFINITY;
        for(var i = 0; i < this.An.length; ++i) {
            for(var j = 0; j < this.Bn[0].length; ++j) {
                min = Math.min(min, this.Bn[i][j]);
                max = Math.max(max, this.Bn[i][j]);
            }
        }
        return [min, max];
    }

    fillContext(ctx, scale) {
        for(var i = 0; i < this.rows; ++i) {
            for(var j = 0; j < this.cols; ++j) {
                var a = this.An[i][j], b = this.Bn[i][j];
                ctx.fillStyle = scale(-a + b);
                ctx.fillRect(i, j, 1, 1);
            }
        }
    }
}
