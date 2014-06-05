var util = require('util');
var unreturned = require('./model/builders/unreturnedRentals');

unreturned(function(err, list) {
	if(err) {throw(err);}
	console.log(util.inspect(list, false, null));
	console.log('store 1 has: ' + list[0].films.length + ' film titles that have not been returned');
	console.log('store 2 has: ' + list[1].films.length + ' film titles that have not been returned');
	process.exit();

});