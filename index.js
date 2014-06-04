var mysql = require('mysql');
pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'demo',
  password        : 'password',
  database: 'saklia',
});

