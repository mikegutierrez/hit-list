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

module.exports = function(data) {
  mongoose.connect('mongodb://localhost:27017/hitlist');
  mongoose.connection.once('open', () => {
    const Listing = mongoose.model('Listing', ListingSchema);

    data.forEach((event) => {
      Listing.create({
        headliner: event.headliner,
        support: event.support,
        venue: event.venue,
        city: event.city,
        state: event.state,
        date: event.date,
        time: event.time,
        tickets: event.tickets,
      });
    });
  });
}
