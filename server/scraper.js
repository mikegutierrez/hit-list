'use strict';

const cheerio = require('cheerio');
const phantom = require('phantom');

const scrapeController = {
    getData: (req, res) => {
        console.log('getData');
        return new Promise((resolve, reject) => {
            console.log('PROMISE');
            const output = [];
            async function goldenVoice() {
                console.log('goldenVoice');
                const instance = await phantom.create();
                const page = await instance.createPage();
    
                await page.on('onResourceRequested', function(requestData) {
                    console.info('Requesting', requestData.url);
                });
    
                const status = await page.open('http://www.goldenvoice.com/shows/');
                console.log('status:  ', status);
                const content = await page.property('content');

                let $ = cheerio.load(content);

                $('.in').map((idx, elem) => {
                    const listing = {};
                    listing.headliner = $(elem).find('.show-info').find('h1').find('a').text();
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