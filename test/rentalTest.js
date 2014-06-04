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
			});
		});
	});
});