const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage data response
 * @param  {String} data - html response
 * @return {Object} deal
 */
const parse = data => {
  const $ = cheerio.load(data, {'xmlMode': true});

  return $('article.thread')
    .map((i, element) => {
      const price = parseFloat(
        $(element)
          .find('.thread-price')
          .text()
          .replace('€', '')
          .trim()
      );

      const originalPrice = parseFloat(
        $(element)
          .find('.color--text-NeutralSecondary.text--lineThrough')
          .text()
          .replace('€', '')
          .trim()
      );

      const discount = $(element)
        .find('.textBadge--green')
        .text()
        .replace('%', '')
        .trim();

      const title = $(element)
        .find('.thread-title a')
        .attr('title');

      // Récupération de la température
      const temperature = $(element)
        .find('.threadListCard-header .cept-vote-temp')
        .text()
        .trim();

      // Récupération du nombre de commentaires
      const commentsCount = parseInt(
        $(element)
          .find('.button--mode-secondary')
          .last()
          .text()
      );

      return {
        title,
        price,
        originalPrice,
        discount,
        temperature,
        commentsCount,
      };
    })
    .get();
};


/**
 * Scrape a given url page
 * @param {String} url - url to parse
 * @returns 
 */
module.exports.scrape = async url => {
  const response = await fetch(url);

  if (response.ok) {
    const body = await response.text();

    return parse(body);
  }

  console.error(response);

  return null;
};
