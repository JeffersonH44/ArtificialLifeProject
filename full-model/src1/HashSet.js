"use strict";

class HashSet {
    constructor() {
        this.set = {};
    }

    add(key) {
        this.set[key] = true;
    }

    remove(key) {
        delete this.set[key];
    }

    clear() {
        this.set = {};
    }

    keys() {
        return Object.keys(this.set);
    }

    contains(key) {
        return this.set.hasOwnProperty(key);
    }
}