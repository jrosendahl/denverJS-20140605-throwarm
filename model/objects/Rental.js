'use strict';

var Datagram = require('throwarm').Datagram;
var endPoint = require('../endPoints/sakila');

function Rental() {
	Object.defineProperty(this,'base',{value:Datagram, writable:false,configurable:true,enumerable:false});
	this.base(this);
	this.endPoint = new endPoint('rental', 'rental_id');
	this.fieldMap = {
		id:'rental_id',
		date: 'rental_date',
		returnDate: 'return_date'
	};
}

Rental.protytype = new Datagram();
Rental.prototype.constructor = Rental;

module.exports = Rental;