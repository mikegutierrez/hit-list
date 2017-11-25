'use strict';

const cheerio = require('cheerio');
const phantom = require('phantom');

const scrapeController = {
    getData: (req, res) => {
        return new Promise((resolve, reject) => {
            const output = [];
            async function goldenVoice() {
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
            goldenVoice().then(() => {
                console.log('goldenVoice().then  ', output)
                res.send(output);
            });
        });
    }
};

module.exports = scrapeController;