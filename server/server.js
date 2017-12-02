const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const scrapeController = require('./scraper');
const Listing = require('./model');

const app = express();
const PORT = 8080;

mongoose.connect('mongodb://localhost:27017/hitlist');

app.use(express.static(path.join(__dirname, './../')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

scrapeController.getData().then((data) => {
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
      image: event.image,
    });
  });
});

app.get('/data', (req, res) => {
  Listing.find({}, (err, data) => {
    res.json(data);
  });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}...`));
