'use strict';
var DBbase = require('./sakila');

function DBstore(table, idColumn) {
	this.base = DBbase;
	this.base(table,idColumn);

	this.get = function get(id, callback) {
		var q = 'Select * from store left join address on store.address_id = address.address_id left join city on address.city_id = city.city_id where ' + idColumn + ' = ?';
		this.pool.getConnection(function (err, connection) {
			if(err) {return callback(err);}
			connection.query(q, [id], function(err, results) {
				connection.release();
				return callback(err, results);
			});
		});
	};
}

DBstore.prototype = new DBbase();




module.exports = DBstore;
