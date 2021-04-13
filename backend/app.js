const express = require('express')
require('dotenv').config()

const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('welcome')
});

var mysql = require('mysql');

var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'database',
});

connection.connect(function(err) {
  if (err) throw err;
  console.log('You are now connected with mysql database...')
})

app.get('/customer', function (req, res) {
  connection.query('select * from persons', function (err, results, fields) {
   if (err) throw err;
   res.end(JSON.stringify(results));
 });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})