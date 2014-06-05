'use strict';

var Dataset = require('throwarm').Dataset;

function Films() {
    var films = new Dataset();
    films.typeName= 'Films';
    return films;
}

module.exports = Films;