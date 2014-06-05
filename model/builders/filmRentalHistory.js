module.exports = function(filmID, callback) {

	var mysql = require('mysql');
	var connection = mysql.createConnection({
		host            : 'localhost',
		user            : 'demo',
		password        : 'password',
		database: 'sakila',
		dateStrings:true
	});


	var objects = require('../objects');

	var film = new objects.Film();
	film.fieldMap.stores = new objects.Stores();
	film.fieldMap.stores.key = 'store_id';
	film.fieldMap.stores.items = function() {
		var store = new objects.Store();
		store.fieldMap.rentals = new objects.Rentals();
		store.fieldMap.rentals.key = 'rental_id';
		store.fieldMap.rentals.items = function() {
			var rental = new objects.Rental();
			return rental;
		};
		return store;
	}

	var q = 'select film.*, store.*, rental.*, address.*, city.* from film ' +
			'left join inventory on film.film_id = inventory.film_id ' + 
			'left join store on inventory.store_id = store.store_id ' + 
			'left join address on store.address_id = address.address_id ' + 
			'left join city on address.city_id = city.city_id ' + 
			'left Join rental on inventory.inventory_id = rental.inventory_id ' + 
			'where film.film_id = ?';
	connection.query(q, [filmID], function(err, results) {
		if(err) {return callback(err)}
		film.fill(results);
		console.log(film);
		callback(null, film);
	});

}