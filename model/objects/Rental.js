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

function daysRented() {
	var self = this;
	var rentalDate = new Date(self.date);
	if(self.returnDate) {
		var date = new Date(self.returnDate);
	}
	else {
		var date = new Date();
	}
	var days = (date.getTime() - rentalDate.getTime())/(24*60*60*1000);
	return days |0;
}
Rental.prototype.daysRented = daysRented;

module.exports = Rental;