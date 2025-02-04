const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage data response
 * @param  {String} data - html response
 * @return {Object[]} deals - Extracted deals
 */
const parse = data => {
  const $ = cheerio.load(data, { xmlMode: false });

  return $('article.thread') // Sélectionne chaque deal
    .map((i, element) => {
      // Extraction du titre
      const titleElement = $(element).find('.thread-title a');
      const title = titleElement.attr('title') ? titleElement.attr('title').trim() : 'Titre non trouvé';

      // Extraction du prix
      let priceText = $(element).find('.thread-price').text().trim();
      let price = priceText ? parseFloat(priceText.replace(/[^\d,\.]/g, '').replace(',', '.')) : null;

      // Extraction de la réduction
      let discountText = $(element).find('.thread-price .textBadge--green').text().trim();
      let discount = discountText ? parseInt(discountText.replace('%', '')) : null;

      // Extraction de la température
      let temperatureText = $(element).find('.cept-vote-temp').text().trim();
      let temperature = temperatureText || 'Température non trouvée';

      // Extraction du nombre de commentaires
      let commentsText = $(element).find('.button--mode-secondary').text().trim();
      let commentsCount = commentsText ? parseInt(commentsText.replace(/\D/g, '')) : 0;

      // DEBUG : Afficher les données récupérées pour chaque article
      console.log(`Article ${i + 1}:`, {
        title,
        priceText,
        price,
        discountText,
        discount,
        temperature,
        commentsText,
        commentsCount,
      });

      return {
        title,
        price,
        discount,
        temperature,
        commentsCount,
      };
    })
    .get(); // Convertir en tableau
};



/**
 * Scrape a given url page
 * @param {String} url - url to parse
 * @returns 
 */
module.exports.scrape = async url => {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    }
  });


  if (response.ok) {
    const body = await response.text();

    return parse(body);
  }

  console.error(response);

  return null;
};
