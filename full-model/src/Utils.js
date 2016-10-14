'use strict';

class Utils {
    // returns a g random function with the given mean and stdev.
    static gaussian(mean, stdev, generate) {
        var rand = g(mean, stdev);
        if(generate === undefined) {
            return rand();
        } else {
            var list = new Array(generate);
            for(var i = 0; i < generate; ++i) {
                list[i] = rand();
            }
            return list;
        }
    }

    static randomInt(a, b) {
        return Math.random() * (max - min) + min;
    }
}

function g(mean, stdev) {
    var y2;
    var use_last = false;
    return function() {
        var y1;
        if(use_last) {
            y1 = y2;
            use_last = false;
        }
        else {
            var x1, x2, w;
            do {
                x1 = 2.0 * Math.random() - 1.0;
                x2 = 2.0 * Math.random() - 1.0;
                w  = x1 * x1 + x2 * x2;
            } while( w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w))/w);
            y1 = x1 * w;
            y2 = x2 * w;
            use_last = true;
        }

        var retval = mean + stdev * y1;
        if(retval > 0)
            return retval;
        return -retval;
    }
}