'use strict';
module.exports = function(callback) {
	var mysql = require('mysql');
	var connection = mysql.createConnection({
		host            : 'localhost',
		user            : 'demo',
		password        : 'password',
		database: 'sakila',
		dateStrings:true
	});


	var objects = require('../objects');

	var stores = new objects.Stores();
	stores.key = 'store_id';
	stores.items = function() {
		var store = new objects.Store();
		store.fieldMap.films = new objects.Films();
		store.fieldMap.films.key = 'film_id';
		store.fieldMap.films.items = function() {
			var film = new objects.Film();
			film.fieldMap.rentals = new objects.Rentals();
			film.fieldMap.rentals.key = 'rental_id';
			film.fieldMap.rentals.items = function() {
				var rental = new objects.Rental();
				return rental;
			}
			return film;
		}
		return store;
	}

	var q = 'select store.*, address.*, city.*, film.*, rental.* from film ' + 
			'left join inventory on film.film_id = inventory.film_id ' + 
			'left join store on inventory.store_id = store.store_id ' + 
			'left join address on store.address_id = address.address_id ' + 
			'left join city on address.city_id = city.city_id ' + 
			'left Join rental on inventory.inventory_id = rental.inventory_id ' + 
			'where isNull(return_date)';

	connection.query(q, [], function(err, results) {
		if(err) {return callback(err);}
		stores.fill(results);
		callback(null, stores);
	});
}