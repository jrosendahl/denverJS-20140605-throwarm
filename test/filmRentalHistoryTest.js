require('should');
var util = require('util');
var history = require('../model/builders/filmRentalHistory');

describe('filmRentalHistory', function() {
	it('should return the correct rental history', function(done) {
		history(1000, function(err, list) {
			if(err) {throw (err);}
			list.stores.length.should.equal(2);
			console.log(util.inspect(list, false, null));
			done();

		});
	});
})