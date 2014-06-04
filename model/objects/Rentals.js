'use strict';

var Dataset = require('throwarm').Dataset;

function Rentals() {
    var rentals = new Dataset();
    rentals.typeName= 'Rentals';
    return rentals;
}

module.exports = Rentals();