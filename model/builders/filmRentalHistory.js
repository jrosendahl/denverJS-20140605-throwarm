module.exports = function(filmID) {

	var mysql = require('mysql');
	var connection = mysql.connection({
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
	}

	var q = 'select film.*, store.*, rentals.* from films ' +
			'left join inventory on fims.film_id = inventory.film_id ' + 
			'left join store on inventory.store_id = store.store_id ' + 
			'left Join rental on inventory.inventory_id = rentals.inventory_id ' + 
			'where film_id = ?;


}