import superagent from 'superagent';

var products;

superagent
.get('/products')
.set('Accept', 'application/json')
.end(function(err, res){
  if (err || !res.ok) {
    return console.log(err);
  } else {
    console.log(JSON.stringify(res.body));
    console.log(products);
    products = JSON.stringify(res.body);
    console.log(products);
  }
});

console.log(products);

const initialState = products;
  
export default initialState;

