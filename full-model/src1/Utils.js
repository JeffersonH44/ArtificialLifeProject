'use strict';

class Utils {

    static gaussianRandom(mean, std) {

        if (mean === undefined || std === undefined) {
            throw "Gaussian random needs 2 arguments (mean, standard deviation)";
        }

        let randByBoxMullerTransform = (function () {
            let vals = [];

            function calc() {
                let alpha = Math.random(),
                    beta = Math.random();
                return [
                    Math.sqrt(-2 * Math.log(alpha)) * Math.sin(2 * Math.PI * beta),
                    Math.sqrt(-2 * Math.log(alpha)) * Math.cos(2 * Math.PI * beta)
                ];
            }

            return function () {
                vals = vals.length == 0 ? calc() : vals;
                return vals.pop();
            }
        })();

        return randByBoxMullerTransform() * std + mean;
    }

    static randomInt(min, max) {
        return Math.floor(this.random(min, max));
    }

    static random(min, max) {
        return Math.random()*(max-min)+min;
    }

    static toDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    static hypotenuse(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        let lo = Math.min(a, b);
        let hi = Math.max(a, b);
        return hi + 3 * lo / 32 + Math.max(0, 2 * lo - hi) / 8 + Math.max(0, 4 * lo - hi) / 16;
    }

    static distance(v1, v2) {
        let a = v1[0] - v2[0];
        let b = v1[1] - v2[1];

        return Math.sqrt( a*a + b*b );
    }

    static checkInfinity(vec) {
        let ret = [vec[0], vec[1]];
        for(let i = 0; i < vec.length; ++i) {
            if(vec[i] === Number.POSITIVE_INFINITY) {
                ret[i] = 1.0;
            }
            if(vec[i] === Number.NEGATIVE_INFINITY) {
                ret[i] = -1.0;
            }
            if(isNaN(vec[i])) {
                ret[i] = 0.0;
            }
        }
        return ret;
    }

    static normalize(v) {
        let x = v[0], y = v[1];
        let norm = Math.sqrt(x * x + y * y);
        if (norm != 0) { // as3 return 0,0 for a point of zero length
            x /= norm;
            y /= norm;
        }
        return [x, y];
    }

    static sub(v1, v2) {
        return [v1[0] - v2[0], v1[1] - v2[1]];
    }

    static add(v1, v2) {
        return [v1[0] + v2[0], v1[1] + v2[1]];
    }

    static mag(v1) {
        return Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
    }

    static mul(vec, val) {
        return [vec[0] * val, vec[1] * val];
    }

    static div(vec, val) {
        return [vec[0] / val, vec[1] / val];
    }
}