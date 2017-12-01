'use strict';

const cheerio = require('cheerio');
const phantom = require('phantom');
const puppeteer = require('puppeteer');
const moment = require('moment');

// const TODO = {
//   1: 'Promise.all or better async',
//   2: 'break out common functions',
//   3: 'catch errors',
//   4: 'add http://www.nederlanderconcerts.com/events/all to scraper',
// };

const scrapeController = {
  getData: (req, res) => {
    return new Promise((resolve, reject) => {
      const output = [];

      async function goldenVoice() {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto('http://www.goldenvoice.com/shows/');
        
        // TODO: turn this into reusable function and modify showlistLength
        const showlistLength = await page.evaluate((sel) => {
          return page.querySelectorAll(sel).length;
        }, '#main > div.xx.showlist.firstwrap.ng-scope > section.showlist');
        console.log('showlistLength:  ', showlistLength);

        const listLength = await page.evaluate((sel) => {
          return page.getElementsByClassName(sel).length;
        }, 'in');
        console.log('listLength:  ', listLength);

        async function gvScraper(list) {

          
          for (let i = 1; i <= listLength; i += 1) {
            
            const gvSelectors = {
              headliner: `section.showlist:nth-of-type(${list}) > div:nth-child(${i}) > div > div.show-info > h1 > a`,
              support: `section.showlist:nth-of-type(${list}) > div:nth-child(${i}) > div > div.show-info > div.support`,
              venue: `section.showlist:nth-of-type(${list}) > div:nth-child(${i}) > div > div.show-info > div.venue`,
              date: `section.showlist:nth-of-type(${list}) > div:nth-child(${i}) > div > div.show-info > div.date`,
            };


            const listing = {};


            listing.headliner = await page.evaluate((sel) => {
              let element = document.querySelector(sel);
              return element ? element.innerHTML : null;
            }, gvSelectors.headliner);

            listing.support = await page.evaluate((sel) => {
              let element = document.querySelector(sel);
              return element ? element.innerHTML : 'Not Listed';
            }, gvSelectors.support);

            listing.venue = await page.evaluate((sel) => {
              let element = document.querySelector(sel);
              return element ? element.innerHTML.split(',')[0].trim() : 'Not Listed';
            }, gvSelectors.venue);

            listing.city = await page.evaluate((sel) => {
              let element = document.querySelector(sel);
              return element ? element.innerHTML.split(',')[1].trim() : 'Not Listed';
            }, gvSelectors.venue);

            listing.state = await page.evaluate((sel) => {
              let element = document.querySelector(sel);
              return element ? element.innerHTML.split(',')[2].trim() : 'Not Listed';
            }, gvSelectors.venue);



  
            if (!listing.headliner) continue;
            if (!listing.support) continue;
            if (!listing.venue) continue;
            if (!listing.city) continue;
            if (!listing.state) continue;

            output.push(listing);
          }
        }

        async function runGvScraper() {
          for (let i = 1; i <= showlistLength; i += 1) {
            await gvScraper(i);
          }
        }

        await runGvScraper();

        // const content = await page.content();
        // const $ = cheerio.load(content);
        
        // $('.in').map((elem) => {
        //   const listing = {};
        //   listing.headliner = $(elem).find('.show-info > h1 > a').text();
        //   listing.support = $(elem).find('.show-info > .support').text();
        //   listing.venue = $(elem).find('.show-info > .venue').text().split(',')[0];
        //   listing.city = $(elem).find('.show-info > .venue').text().split(',')[1];
        //   listing.state = $(elem).find('.show-info > .venue').text().split(',')[2].trim();
        //   listing.date = moment($(elem).find('.show-info > .date').text().split(',')[0]).format('YYYY-MM-DD');
        //   listing.time = $(elem).find('.show-info > .date').text().split(',')[1].trim().toLowerCase();
        //   listing.tickets = $(elem).find('.bottomshowpart > .wrapbuttonsshows > .buy-ticketlink').attr('href');
        //   output.push(listing);
        // });

        await browser.close();
      }

      // async function liveNation() {
      //   const instance = await phantom.create();
      //   const page = await instance.createPage();

      //   await page.on('onResourceRequested', requestData => console.info('Requesting', requestData.url));
      //   await page.open('https://www.livenation.com/cities/89824/los-angeles-ca');

      //   const content = await page.property('content');
      //   const $ = cheerio.load(content);

      //   const cityState = $('#city > .name > h1').text().split('Shows in ')[1];
      //   const city = cityState.split(',')[0];
      //   const state = cityState.split(',')[1].trim();

      //   const formatTime = (timeStamp) => {
      //     let digits = timeStamp.slice(0, -2);
      //     const meridiem = timeStamp.slice(-2);
      //     if (digits.length === 1) digits += ':00';
      //     return `${digits} ${meridiem}`;
      //   };

      //   $('.ad-slot-count').map((idx, elem) => {
      //     const listing = {};
      //     listing.headliner = $(elem).find('.event-details > h3').text();
      //     listing.support = 'Not listed';
      //     listing.venue = $(elem).find('.event-details > h4 > a > span').text();
      //     listing.city = city;
      //     listing.state = state;
      //     listing.date = moment($(elem).find('.event-details > .event-row-date > .event-date').attr('content')).format('YYYY-MM-DD');
      //     listing.time = formatTime($(elem).find('.event-details > .event-row-date > .event-day').text().split('@ ')[1]);
      //     listing.tickets = 'https://www.livenation.com' + $(elem).find('.event-row-buy > div > a').attr('href');
      //     output.push(listing);
      //   });

      //   await instance.exit();
      // }

      // async function spaceLand() {
      //   const instance = await phantom.create();
      //   const page = await instance.createPage();

      //   await page.on('onResourceRequested', requestData => console.info('Requesting', requestData.url));
      //   await page.open('https://www.spacelandpresents.com/events/');

      //   const content = await page.property('content');
      //   const $ = cheerio.load(content);
    
      //   $('#detail > .detail-view > .list-view > .list-view-item').map((idx, elem) => {
      //     const listing = {};
      //     listing.headliner = $(elem).find('.list-view-details > .headliners > a').text();
      //     listing.support = $(elem).find('.list-view-details > .supports > a').text();
      //     listing.venue = $(elem).find('.list-view-details > .venue').text();
      //     listing.city = $(elem).find('.list-view-details > .city-state').text().split(',')[0];
      //     listing.state = $(elem).find('.list-view-details > .city-state').text().split(',')[1].trim();
      //     listing.date = moment($(elem).find('.list-view-details > .times > .start > span').attr('title')).format('YYYY-MM-DD');
      //     listing.time = moment($(elem).find('.list-view-details > .times > .start > span').attr('title')).format('h:mm a');
      //     listing.tickets = $(elem).find('.ticket-price > h3 > a').attr('href') || 'Free';
      //     output.push(listing);
      //   });

      //   await instance.exit();
      // }

      // async function sendSortedData() {
      //   const sortedOutput = output.sort((a, b) => {
      //     const dateA = moment(a.date);
      //     const dateB = moment(b.date);
      //     return dateA - dateB;
      //   });
      //   console.log('Scrape complete');
      //   res.send(sortedOutput);
      // }

      // Promise.all([goldenVoice, liveNation, spaceLand, sendSortedData]);

      // goldenVoice().then(() => liveNation().then(() => spaceLand().then(() => {
      //   const sortedOutput = output.sort((a, b) => {
      //     const dateA = moment(a.date);
      //     const dateB = moment(b.date);
      //     return dateA - dateB;
      //   });
      //   console.log('Scrape complete');
      //   res.send(sortedOutput);
      // })));

      goldenVoice().then(() => {
        const sortedOutput = output.sort((a, b) => {
          const dateA = moment(a.date);
          const dateB = moment(b.date);
          return dateA - dateB;
        });
        console.log('Scrape complete');
        // res.send(sortedOutput);
        res.send(output);
      }).catch(err => console.error(err));
    });
  },
};

module.exports = scrapeController;
