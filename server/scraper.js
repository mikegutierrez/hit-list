const cheerio = require('cheerio');
const phantom = require('phantom');
const moment = require('moment');

let lastRequest;
let savedData = [];

const scrapeController = {
  getData: (req, res) => {
    if (savedData.length && Date.now() - lastRequest < 300000) {
      return new Promise((resolve, reject) => {
        res.send(savedData);
      });
    }
    lastRequest = Date.now();
    return new Promise((resolve, reject) => {
      const output = [];

      async function goldenVoice() {
        const instance = await phantom.create();
        const page = await instance.createPage();

        await page.open('http://www.goldenvoice.com/shows/');

        const content = await page.property('content');
        const $ = cheerio.load(content);

        $('.in').map((idx, elem) => {
          const listing = {};
          listing.headliner = $(elem).find('.show-info > h1 > a').text();
          listing.support = $(elem).find('.show-info > .support').text() || 'Not Listed';
          listing.venue = $(elem).find('.show-info > .venue').text().split(',')[0];
          listing.city = $(elem).find('.show-info > .venue').text().split(',')[1].trim();
          listing.state = $(elem).find('.show-info > .venue').text().split(',')[2].trim();
          listing.date = moment($(elem).find('.show-info > .date').text().split(',')[0]).format('YYYY-MM-DD');
          listing.time = $(elem).find('.show-info > .date').text().split(',')[1].trim().toLowerCase();
          listing.tickets = $(elem).find('.bottomshowpart > .wrapbuttonsshows > .buy-ticketlink').attr('href');
          output.push(listing);
        });

        await instance.exit();
      }

      async function liveNation() {
        const instance = await phantom.create();
        const page = await instance.createPage();

        await page.open('https://www.livenation.com/cities/89824/los-angeles-ca');

        const content = await page.property('content');
        const $ = cheerio.load(content);

        const cityState = $('#city > .name > h1').text().split('Shows in ')[1];
        const city = cityState.split(',')[0].trim();
        const state = cityState.split(',')[1].trim();

        const formatTime = (timeStamp) => {
          let digits = timeStamp.slice(0, -2);
          const meridiem = timeStamp.slice(-2);
          if (digits.length === 1) digits += ':00';
          return `${digits} ${meridiem}`;
        };

        $('.ad-slot-count').map((idx, elem) => {
          const listing = {};
          listing.headliner = $(elem).find('.event-details > h3').text();
          listing.support = 'Not listed';
          listing.venue = $(elem).find('.event-details > h4 > a > span').text();
          listing.city = city;
          listing.state = state;
          listing.date = moment($(elem).find('.event-details > .event-row-date > .event-date').attr('content')).format('YYYY-MM-DD');
          listing.time = formatTime($(elem).find('.event-details > .event-row-date > .event-day').text().split('@ ')[1]);
          listing.tickets = 'https://www.livenation.com' + $(elem).find('.event-row-buy > div > a').attr('href');
          output.push(listing);
        });

        await instance.exit();
      }

      async function spaceLand() {
        const instance = await phantom.create();
        const page = await instance.createPage();

        await page.open('https://www.spacelandpresents.com/events/');

        const content = await page.property('content');
        const $ = cheerio.load(content);

        $('#detail > .detail-view > .list-view > .list-view-item').map((idx, elem) => {
          const listing = {};
          listing.headliner = $(elem).find('.list-view-details > .headliners > a').text();
          listing.support = $(elem).find('.list-view-details > .supports > a').text();
          listing.venue = $(elem).find('.list-view-details > .venue').text();
          listing.city = $(elem).find('.list-view-details > .city-state').text().split(',')[0].trim();
          listing.state = $(elem).find('.list-view-details > .city-state').text().split(',')[1].trim();
          listing.date = moment($(elem).find('.list-view-details > .times > .start > span').attr('title')).format('YYYY-MM-DD');
          listing.time = moment($(elem).find('.list-view-details > .times > .start > span').attr('title')).format('h:mm a');
          listing.tickets = $(elem).find('.ticket-price > h3 > a').attr('href') || 'Free';
          output.push(listing);
        });

        await instance.exit();
      }

      goldenVoice().then(() => liveNation().then(() => spaceLand().then(() => {
        const sortedOutput = output.sort((a, b) => {
          const dateA = moment(a.date);
          const dateB = moment(b.date);
          return dateA - dateB;
        });
        console.log('Scrape complete');
        savedData = sortedOutput;
        resolve(savedData);
      }))).catch(err => console.error(`Error: ${err.message}`));
    });
  },
};

module.exports = scrapeController;
