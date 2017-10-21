var mysql = require('mysql'); 

// Create your connect to MySQL with specified info
var connection = mysql.createConnection({
  host     :    'localhost',
  user     :    'root',
  password :    'root',
  database :    'ecommerce-website',
  port     :    '8889'
});
// port 8889 is the default MySQL port for MAMP

connection.connect();

// Close the connection, which makes sure all remaining queries are 
// executed before sending a quit packet to the mysql server
//connection.end();

module.exports = {connection};