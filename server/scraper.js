'use strict';

const cheerio = require('cheerio');
const phantom = require('phantom');

const scrapeController = {
    getData: (req, res) => {
        return new Promise((resolve, reject) => {
            const output = [];
            async function phantomCherio() {
                const instance = await phantom.create();
                const page = await instance.createPage();
    
                await page.on('onResourceRequested', requestData => {
                    console.info('Requesting', requestData.url);
                });
    
                const status = await page.open('https://losangeles.ohmyrockness.com/shows?all=true');
                const content = await page.property('content');
    
                let $ = cheerio.load('content');
                console.log('$CHEERIO:  ', $);
                await instance.exit();
            };
            phantomCherio().then(() => {
                res.send(output);
            });
        });
    }
};

module.exports = scrapeController;