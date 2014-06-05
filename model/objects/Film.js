'use strict';

var Datagram = require('throwarm').Datagram;
var endPoint = require('../endPoints/sakila');
var Calc = require('throwarm').Calc;

function Film () {
	Object.defineProperty(this, 'base', {value:Datagram, writable:false, configurable:false, enumerable:false});
	this.base(this);

	this.endPoint = new endPoint('film', 'film_id');
	this.fieldMap = {
		id:'film_id',
		title:'title',
		releaseYear:'release_year',
		rentalDuration:'rental_duration',
		rentalRate:'rental_rate',
		allAges: new Calc('rating', function(rating) {
			return rating === 'G' || rating === 'PG';
		})
	};
}

Film.prototype = new Datagram();
Film.prototype.constructor = Film;

module.exports = Film;