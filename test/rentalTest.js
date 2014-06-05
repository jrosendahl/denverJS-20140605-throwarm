require('should');

var objects = require('../model/objects');

describe('Rental', function() {
	describe('async_single', function() {
		it('should populate the fields', function(done) {
			var rental = new objects.Rental();
			rental.async_single(67, function(err) {
				if(err) {throw(err);}
				rental.id.should.equal(67);
				rental.date.should.equal('2005-05-25 09:41:01');
				rental.returnDate.should.equal('2005-05-27 13:46:01');
				done();
			});
		});
	});
	describe('daysRented', function() {
		describe('for a returned video', function() {
			it('should tell you the days rented', function() {
				var rental = new objects.Rental();
				rental.date = '2012-1-05';
				rental.returnDate = '2012-1-10 4:00';
				rental.daysRented().should.equal(5);
			});
		});
		describe('for a video that has not been returned', function() {
			it('should still work', function() {
				var rental = new objects.Rental();
				rental.date = '2013-1-05';
				var days = (new Date() - new Date(rental.date) )/ (24*60*60*1000) | 0;
				rental.daysRented().should.equal(days);
			});
		});
	});
});