'use strict';

module.exports = function(table, idColumn) {
	var mysql = require('mysql');
	this.pool = mysql.createPool({
		connectionLimit : 10,
		host            : 'localhost',
		user            : 'demo',
		password        : 'password',
		database: 'sakila',
		dateStrings:true
	});

	function get(id, callback) {
		var q = 'Select * from ' + table + ' where ' + idColumn + ' = ?';
		this.pool.getConnection(function (err, connection) {
			if(err) {return callback(err);}
			connection.query(q, [id], function(err, results) {
				connection.release();
				return callback(err, results);
			});
		});
	}

	function insert(values, callback) {
		var q = 'insert into  ' + table + '  (';
		var cols = [];
		var vals = [];
		var params = [];
		for(var key in values) {
			cols.push(key);
			vals.push(values[key]);
			params.push('?');
		}
		q += cols + ') values(' + params + ')';
		this.pool.getConnection(function (err, connection) {
			if(err) {return callback(err);}
			connection.query(q, vals, function(err, info) {
				connection.release();
				if(err) {return callback(err);}
				callback(null, info.insertId);
			});
		});
	}

	function update(id, values, callback){
		if(!id) {callback(new Error('id required for update'));}
		var q = 'update + table +  set ';
		var vals = [];
		var sets = [];
		for(var key in values) {
			sets.push(key + '= ?');
			vals.push(values[key]);
		}
		q+= sets + ' where  ' + idColumn  + ' = ?';
		vals.push(id);
		this.pool.getConnection(function (err, connection) {
			if(err) {return callback(err);}
			connection.query(q, vals, function(err) {
				connection.release();
				callback(err, id);
			});
		});
	}

	this.get = get;
	this.insert = insert;
	this.update = update;

};
