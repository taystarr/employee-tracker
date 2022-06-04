const db = require('./db/connection');
const start = require('./index');
const PORT = process.env.PORT || 3001;

db.connect(err => {
    if (err) throw err;
    start;
});