'use strict';

var Datagram = require('throwarm').Datagram;
var endPoint = require('../endPoints/sakila');

function Film () {
	Object.defineProperty(this, 'base', {value:Datagram, writable:false, configurable:false, enumerable:false});
	this.base(this);

	this.endPoint = new endPoint('film', 'film_id');
	this.fieldMap = {
		id:'film_id',
		title:'title',
		releaseYear:'release_year',
		rentalDuration:'rental_duration',
		rentalRate:'rental_rate'
	};
}

Film.prototype = new Datagram();
Film.prototype.constructor = Film;

module.exports = Film;