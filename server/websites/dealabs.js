const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage data response
 * @param  {String} data - html response
 * @return {Array} deals
 */
const parse = data => {
  const $ = cheerio.load(data, {'xmlMode': true});

  return $('div.js-threadList article') // Sélectionner chaque deal
    .map((i, element) => {
      
      const link = $(element)
      .find('a[data-t="threadLink"]')
      .attr('href');

      const data = JSON.parse($(element)
      .find('div.js-vue2')
      .attr('data-vue2'));

      const thread = data.props.thread;

      const title = thread.title;
  
      const retail = thread.nextBestPrice;

      const price = thread.price;

      const discount = parseInt((retail-price) /retail*100);

      const photo = thread.mainImage || null;

      const temperature = +thread.temperature;
      const comments = +thread.commentCount;
      const published = thread.publishedAt;

      const data2 = JSON.parse($(element).attr('data-t-d'));
      
      // Extraire les informations pertinentes
      const id = data2.id;

      return { link, title, retail, price, photo, discount, temperature, comments, published, id};

    })
    .get();
};

/**
 * Scrape a given url page
 * @param {String} url - url to parse
 * @returns {Promise<Array>} deals
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

    const body = await response.text();
    return parse(body);
  } catch (error) {
    console.error('Erreur lors du scraping:', error);
    return null;
  }
};

