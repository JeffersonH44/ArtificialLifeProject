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
                this.Ao[i][j] = Utils.randomInt(0, 1) * 12.0 + Utils.gaussian(0, 1) * 2.0;
                this.Bo[i][j] = Utils.randomInt(0, 1) * 12.0 + Utils.gaussian(0, 1) * 2.0;
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
        var DiA = 0.0, ReA = 0.0, DiB = 0.0, ReB = 0.0;

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
        console.log(this.An);
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
