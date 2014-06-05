'use strict';

var Dataset = require('throwarm').Dataset;

function Rentals() {
    var rentals = new Dataset();
    rentals.typeName= 'Rentals';

    rentals.averageDuration = function() {
    	var self = this;
    	if(!self.has('Rental')) {
    		throw( new Error('Expected Child of type Rental'));
    	}
    	var total = self.reduce(function(sum, rental) {
    		return sum + rental.daysRented();
    	}, 0);
    	return total/self.length;
    }
    Object.defineProperty(rentals, 'averageDuration', {enumerable:false});

    rentals.outstandingRentals = function(){
    	var self = this;
    	if(!self.has('Rental')) {
    		throw( new Error('Expected Child of type Rental'));
    	}
    	var outstanding = self.filter(function(rental) {
    		return !rental.returnDate;
    	});
    	return self.copyReturn(outstanding, new Rentals());
    }

    Object.defineProperty(rentals, 'outstandingRentals', {enumerable:false});
    return rentals;
}

module.exports = Rentals;