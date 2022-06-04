require('dotenv').config();
const mysql = require('mysql2');

// connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: ' ',
        database: 'employee_track'
    },
    console.log('Connected to database.')
);

module.exports = db;
