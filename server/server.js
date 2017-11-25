'use strict';

const express = require('express');
const app = express();

const scrapeController = require('./scraper');

const PORT = 8080;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.status(200).send('Welcome to Hit List');
});

app.get('/data', (req, res) => {
    scrapeController.getData(req, res).then(() => {
        res.json();
    });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}...`));