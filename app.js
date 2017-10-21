var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'ecommerce-website',
  port: '8889'
});

connection.connect(function(err) {
    if (err) throw err
    console.log('You are now connected...')
  
    connection.query('SELECT * FROM orders', function(err, result) {
        if (err) throw err

        console.log(result);
    }); 
});

