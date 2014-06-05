require('should');

var objects = require('../model/objects');

describe('Film', function() {
	describe('async_single', function() {
		it('should return a populated object', function(done) {
			var film = new objects.Film();
			film.async_single(45, function(err) {
				if(err) {throw(err);}
				film.id.should.equal(45);
				film.title.should.equal('ATTRACTION NEWTON');
				film.releaseYear.should.equal(2006);
				film.rentalDuration.should.equal(5);
				film.rentalRate.should.equal(4.99);
				film.allAges.should.be.false;
				done();
			});
		});
	});
});