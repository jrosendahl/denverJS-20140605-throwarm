require('should');

var objects = require('../model/objects');

describe('rentals', function() {
	describe('averageDuration', function() {
		it('should return the averageDuration', function() {
			var rentals = new objects.Rentals();

			var rental1 = new objects.Rental();
			rental1.date = '2012-01-10';
			rental1.returnDate = '2012-01-12';
			rentals.push(rental1);

			rental2 = new objects.Rental();
			rental2.date = '2012-01-10';
			rental2.returnDate = '2012-01-20';
			rentals.push(rental2);

			rentals.averageDuration().should.equal(6);

		});
	});

	describe('outstandingRentals', function() {
		it('should return a list on rentals that have not been returned', function() {
			rentals = new objects.Rentals();

			var rental1 = new objects.Rental();
			rental1.id = 1;
			rental1.date = '2012-01-13';
			rentals.push(rental1);

			var rental2 = new objects.Rental();
			rental2.id = 2;
			rental2.date = '2012-01-12';
			rental2.returnDate = '2012-02-1';
			rentals.push(rental2);

			var rental3 = new objects.Rental();
			rental3.id = 3;
			rental3.date = '2012-01-12';
			rentals.push(rental3);

			var outstanding = rentals.outstandingRentals();
			outstanding.averageDuration().should.be.above(0);
			outstanding.length.should.equal(2);
			outstanding[1].id.should.equal(3);

		});	
	});
});