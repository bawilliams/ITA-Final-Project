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

// Connect using your created connection
connection.connect();

module.exports = {connection};