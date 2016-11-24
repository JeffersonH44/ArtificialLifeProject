"use strict";

class Random {
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
        return Math.random()*(max-min+1)+min;
    }
}
