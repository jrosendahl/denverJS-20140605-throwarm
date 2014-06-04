'use strict';

var Dataset = require('throwarm').Dataset;

function Stores() {
    var stores = new Dataset();
    stores.typeName= 'Stores';
    return stores;
}

module.exports = Stores();