//const mongoose = require('mongoose');
// database.js

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'huascar',
});

module.exports = connection;

