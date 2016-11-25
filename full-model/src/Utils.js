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
}