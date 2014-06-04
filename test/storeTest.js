require('should');

var objects = require('../model/objects');

describe('Store', function() {
	describe('async_single', function() {
		it('should populate the store fields', function(done) {
			var store = new objects.Store();
			store.async_single(1, function(err) {
				if(err) {throw(err);}
				store.id.should.equal(1);
				store.city.should.equal('Lethbridge');
				store.address.should.equal('47 MySakila Drive');
				done();
			});
		});
	});
});