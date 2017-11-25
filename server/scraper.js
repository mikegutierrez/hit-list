'use strict';

const cheerio = require('cheerio');
const phantom = require('phantom');

// TODO: standardize date & time
// TODO: sort by date & time

const scrapeController = {
    getData: (req, res) => {
        return new Promise((resolve, reject) => {

            const output = [];

            async function goldenVoice() {
                // TODO: click .loadmore & scrape
                const instance = await phantom.create();
                const page = await instance.createPage();
    
                await page.on('onResourceRequested', function(requestData) {
                    console.info('Requesting', requestData.url);
                });
    
                const status = await page.open('http://www.goldenvoice.com/shows/');
                const content = await page.property('content');

                let $ = cheerio.load(content);

                $('.in').map((idx, elem) => {
                    const listing = {};
                    listing.headliner = $(elem).find('.show-info > h1 > a').text();
                    listing.support = $(elem).find('.show-info > .support').text();
                    listing.venue = $(elem).find('.show-info > .venue').text().split(',')[0];
                    listing.city = $(elem).find('.show-info > .venue').text().split(',')[1];
                    listing.state = $(elem).find('.show-info > .venue').text().split(',')[2];
                    listing.date = $(elem).find('.show-info > .date').text().split(',')[0];
                    listing.time = $(elem).find('.show-info > .date').text().split(',')[1];
                    listing.tickets = $(elem).find('.bottomshowpart > .wrapbuttonsshows > .buy-ticketlink').attr('href');
                    output.push(listing);
                });

                await instance.exit();
            };

            async function liveNation() {
                // TODO: click .btn-more & scrape
                // TODO: support 
                const instance = await phantom.create();
                const page = await instance.createPage();

                await page.on('onResourceRequested', function (requestData) {
                    console.info('Requesting', requestData.url);
                });

                const status = await page.open('https://www.livenation.com/cities/89824/los-angeles-ca');
                const content = await page.property('content');

                let $ = cheerio.load(content);

                const cityState = $('#city > .name > h1').text().split('Shows in ')[1];
                const city = cityState.split(',')[0];
                const state = cityState.split(',')[1];

                $('.ad-slot-count').map((idx, elem) => {
                    const listing = {};
                    listing.headliner = $(elem).find('.event-details > h3').text();
                    listing.support = 'TO DO';
                    listing.venue = $(elem).find('.event.details > .venue-link > span').text();
                    listing.city = city;
                    listing.state = state;
                    listing.date = $(elem).find('.event-details > .event-row-date > .event-date').attr('content');
                    listing.time = $(elem).find('.event-details > .event-row-date > .event-day').text().split('@ ')[1];
                    listing.tickets = 'https://www.livenation.com/' + $(elem).find('.event-details > .event-row-buy > div > a').attr('href');
                    output.push(listing);
                });

                await instance.exit();
            };

            goldenVoice().then(() => liveNation().then(() => {
                console.log('BIG OL PROMISE  ', output)
                res.send(output);
            }));
        });
    }
};

module.exports = scrapeController;