'use strict';

const cheerio = require('cheerio');
const phantom = require('phantom');
const moment = require('moment');

// TODO: standardize time
// TODO: Promise.all or better async
// TODO: break out common functions
// TODO: catch errors

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
                    listing.date = moment($(elem).find('.show-info > .date').text().split(',')[0]).format('YYYY-MM-DD');
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
                const state = cityState.split(',')[1].trim();

                $('.ad-slot-count').map((idx, elem) => {
                    const listing = {};
                    listing.headliner = $(elem).find('.event-details > h3').text();
                    listing.support = 'LIVENATION TO DO';
                    listing.venue = $(elem).find('.event-details > h4 > a > span').text();
                    listing.city = city;
                    listing.state = state;
                    listing.date = moment($(elem).find('.event-details > .event-row-date > .event-date').attr('content')).format('YYYY-MM-DD');
                    listing.time = $(elem).find('.event-details > .event-row-date > .event-day').text().split('@ ')[1];
                    listing.tickets = 'https://www.livenation.com' + $(elem).find('.event-row-buy > div > a').attr('href');
                    output.push(listing);
                });

                await instance.exit();
            };

            async function spaceLand() {
                // TODO: click .btn-more & scrape
                // TODO: support 
                const instance = await phantom.create();
                const page = await instance.createPage();

                await page.on('onResourceRequested', function (requestData) {
                    console.info('Requesting', requestData.url);
                });

                const status = await page.open('https://www.spacelandpresents.com/events/');
                const content = await page.property('content');

                let $ = cheerio.load(content);

                $('.list-view-item').map((idx, elem) => {
                    // TODO: figure out how to get this date in proper format for sorting
                    const dateFormat = $(elem).find('.list-view-details > .dates').text().substring(4) + ' 2017';


                    const listing = {};
                    listing.headliner = $(elem).find('.list-view-details > .headliners > a').text();
                    listing.support = 'SPACELAND TO DO';
                    listing.venue = $(elem).find('.list-view-details > .venue').text();
                    listing.city = 'Los Angeles';
                    listing.state = 'CA';
                    listing.date = dateFormat;
                    listing.time = 'SPACELAND TO DO';
                    listing.tickets = $(elem).find('.ticket-price > h3 > a').attr('href');
                    output.push(listing);
                });

                await instance.exit();
            };

            // goldenVoice().then(() => liveNation().then(() => spaceLand().then(() => {
            //     const sortedOutput = output.sort((a, b) => {
            //         const dateA = moment(a.date);
            //         const dateB = moment(b.date);
            //         return dateA - dateB;
            //     });
            //     res.send(sortedOutput);
            // })));
            spaceLand().then(() => {
                res.send(output);
            });
        });
    }
};

module.exports = scrapeController;