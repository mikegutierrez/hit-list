const request = require('request');

const API_URL = 'http://localhost:8080/data';

let migrate;
const dbname = process.argv[2];

if (dbname === 'hitlist') {
  migrate = require('./listingModel');
}

request(API_URL, (req, res) => {
  const data = JSON.parse(res.body);
  migrate(data);
});
