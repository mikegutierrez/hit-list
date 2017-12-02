const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  headliner: String,
  support: String,
  venue: String,
  city: String,
  state: String,
  date: String,
  time: String,
  tickets: String,
});

module.exports = mongoose.model('Listing', ListingSchema);
