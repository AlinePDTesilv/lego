// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/**
Description of the available api
GET https://lego-api-blue.vercel.app/deals

Search for specific deals

This endpoint accepts the following optional query string parameters:

- `page` - page of deals to return
- `size` - number of deals to return

GET https://lego-api-blue.vercel.app/sales

Search for current Vinted sales for a given lego set id

This endpoint accepts the following optional query string parameters:

- `id` - lego set id to return
*/

// current deals on the page
let currentDeals = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectLegoSetIds = document.querySelector('#lego-set-id-select');
const sectionDeals= document.querySelector('#deals');
const spanNbDeals = document.querySelector('#nbDeals');

/**
 * Set global value
 * @param {Array} result - deals to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentDeals = ({result, meta}) => {
  currentDeals = result;
  currentPagination = meta;
};

/**
 * Fetch deals from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */

//FEATURE 0: display 6, 12 or 24 deals on the same page
const fetchDeals = async (page = 1, size = 6) => 
{
  try {
    const response = await fetch(
      `https://lego-api-blue.vercel.app/deals?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentDeals, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentDeals, currentPagination};
  }
};

/**
 * Render list of deals (visual of cards)
 * @param  {Array} deals
 */
const renderDeals = (deals) => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  
  const template = deals
    .map((deal) => {
      const datePublished = new Date(deal.published * 1000).toLocaleDateString(); // Convertir la date UNIX en format lisible
      const discountPercentage = deal.discount; // Utiliser le discount
      const price = deal.price;
      const retailPrice = deal.retail;
      const photo = deal.photo;
      const commentsCount = deal.comments;
      const temperature = deal.temperature;
      const title = deal.title;
      const dealLink = deal.link;

      return `
      <div class="deal-card" id="deal-${deal.uuid}">
        <div class="deal-header">
          <img src="${photo}" alt="${title}" class="deal-photo">
          <h3>${title}</h3>
          <span class="deal-date">Published: ${datePublished}</span>
        </div>
        <div class="deal-body">
          <p><strong>Price:</strong> €${price} <span class="original-price">€${retailPrice}</span></p>
          <p><strong>Discount:</strong> ${discountPercentage}%</p>
          <p><strong>Temperature:</strong> ${temperature}°C</p>
          <p><strong>Comments:</strong> ${commentsCount}</p>
        </div>
        <div class="deal-footer">
          <a href="${dealLink}" target="_blank" class="see-deal-button">See the deal</a>
        </div>
      </div>
      `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionDeals.innerHTML = '<h2>Deals</h2>';
  sectionDeals.appendChild(fragment);
};


/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => 
{
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render lego set ids selector
 * @param  {Array} lego set ids
 */
const renderLegoSetIds = deals => {
  const ids = getIdsFromDeals(deals);
  const options = ids.map(id => 
    `<option value="${id}">${id}</option>`
  ).join('');

  selectLegoSetIds.innerHTML = options;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbDeals.innerHTML = count;
};

const render = (deals, pagination) => {
  renderDeals(deals);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderLegoSetIds(deals)
};



//Now the select page event 
selectPage.addEventListener('change', async (event) => {
  const selectedPage = parseInt(event.target.value);
  const deals = await fetchDeals(selectedPage, selectShow.value);
  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of deals to display
 */
selectShow.addEventListener('change', async (event) => {
  const deals = await fetchDeals(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const deals = await fetchDeals();

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});


// Feature 5 - Sort by price
// Sélectionner le menu déroulant pour le tri (EXEPENSIVE_CHEAP_ANCIENT_RECENT)
const sortSelect = document.getElementById('sort-select');

// Ajouter un événement de changement au menu déroulant pour le tri
sortSelect.addEventListener('change', async (event) => {
  const selectedSort = event.target.value; // "price-asc", "price-desc", "date-asc", "date-desc"

  // Récupérer les deals actuels et appliquer le tri
  const allDeals = await fetchDeals(currentPagination.currentPage, parseInt(selectShow.value));

  let sortedDeals;

  if (selectedSort === 'price-asc') {
    // Tri croissant par prix (Cheaper)
    sortedDeals = allDeals.result.sort((a, b) => a.price - b.price);
  } else if (selectedSort === 'price-desc') {
    // Tri décroissant par prix (Expensive)
    sortedDeals = allDeals.result.sort((a, b) => b.price - a.price);
  } else if (selectedSort === 'date-asc') {
    // Tri croissant par date (Recently published)
    sortedDeals = allDeals.result.sort((a, b) => b.published - a.published); // Tri du plus récent au plus ancien
  } else if (selectedSort === 'date-desc') {
    // Tri décroissant par date (Anciently published)
    sortedDeals = allDeals.result.sort((a, b) => a.published - b.published); // Tri du plus ancien au plus récent
  }

  // Mettre à jour les deals et leur pagination
  setCurrentDeals({ result: sortedDeals, meta: allDeals.meta });
  render(sortedDeals, allDeals.meta); // Affichage des deals triés
});





// Filter functions: 

// Function to filter deals by percentage of reduction, with a minimum percentage given
const filterByDiscount = (deals, minDiscount) => 
{
  return deals
    .filter(deal => deal.discount >= minDiscount) // Filtrer les deals avec une réduction >= minDiscount
    .sort((a, b) => b.discount - a.discount); // Trier par ordre décroissant de réduction
};


const filterByMostCommented = (deals, minComments) => 
{
  return deals.filter(deal => deal.comments >= minComments); // Filtrer les deals avec un nombre de commentaires >= minComments
};


const filterByHotDeals = (deals, minTemperature) => 
{
  return deals.filter(deal => deal.temperature >= minTemperature); // Filtrer les deals avec une température >= minTemperature
};


// Add event listeners for the filter buttons

// Écouter les changements sur le curseur de réduction
document.getElementById('discount-slider').addEventListener('input', async (event) => {
  const selectedDiscount = parseInt(event.target.value); // Obtenez la valeur actuelle du curseur
  document.getElementById('discount-value').textContent = `${selectedDiscount}%`; // Mettez à jour l'affichage de la valeur

  // Récupérer les deals actuels
  const allDeals = await fetchDeals(currentPagination.currentPage, parseInt(selectShow.value));

  // Filtrer les deals en fonction de la réduction sélectionnée
  const filteredDeals = filterByDiscount(allDeals.result, selectedDiscount);

  // Mettre à jour et afficher les deals filtrés
  setCurrentDeals({ result: filteredDeals, meta: allDeals.meta });
  render(filteredDeals, allDeals.meta);
});

// Listen for the 'Most commented' button click
const commentRange = document.getElementById('comment-range');
const commentValue = document.getElementById('comment-value');

// Mettre à jour la valeur affichée à côté du curseur
commentRange.addEventListener('input', (event) => {
  commentValue.textContent = event.target.value; // Met à jour la valeur dynamique
});

// Appliquer le filtre au changement de valeur
commentRange.addEventListener('change', async (event) => {
  const minComments = parseInt(event.target.value); // Récupère la valeur sélectionnée
  const allDeals = await fetchDeals(currentPagination.currentPage, parseInt(selectShow.value)); // Récupère les deals actuels
  
  // Filtrer les deals selon le nombre minimum de commentaires
  const filteredDeals = filterByMostCommented(allDeals.result, minComments);

  // Mettre à jour les deals actuels et réafficher
  setCurrentDeals({ result: filteredDeals, meta: allDeals.meta });
  render(filteredDeals, allDeals.meta);
});


// Listen for the 'Hot deals' button click
const hotDealsRange = document.getElementById('hot-deals-range');
const hotDealsValue = document.getElementById('hot-deals-value');

// Mettre à jour la valeur affichée à côté du curseur
hotDealsRange.addEventListener('input', (event) => {
  hotDealsValue.textContent = event.target.value; // Met à jour la valeur dynamique
});

// Appliquer le filtre au changement de valeur
hotDealsRange.addEventListener('change', async (event) => {
  const minTemperature = parseInt(event.target.value); // Récupère la valeur sélectionnée
  const allDeals = await fetchDeals(currentPagination.currentPage, parseInt(selectShow.value)); // Récupère les deals actuels
  
  // Filtrer les deals selon la température minimum
  const filteredDeals = filterByHotDeals(allDeals.result, minTemperature);

  // Mettre à jour les deals actuels et réafficher
  setCurrentDeals({ result: filteredDeals, meta: allDeals.meta });
  render(filteredDeals, allDeals.meta);
});



//FEATURE 7 - Display Vinted or Dealabs sales

const legoSortSelect = document.getElementById('sort-select');

// Add an event listener to the dropdown for change events
legoSortSelect.addEventListener('change', async (event) => {
  const selectedSort = event.target.value;  // Get the selected value (sorting option)
  let sortedDeals = [];

  // Get current deals based on pagination
  const allDeals = await fetchDeals(currentPagination.currentPage, parseInt(selectShow.value));

  // Filter deals based on the selected community
  if (selectedSort === 'vinted_d') 
  {
    sortedDeals = allDeals.result.filter(deal => deal.community === 'vinted');
  } 
  else if (selectedSort === 'dealabs_d') 
  {
    sortedDeals = allDeals.result.filter(deal => deal.community === 'dealabs');
  } 

  // Check if any deals were found
  if (sortedDeals.length > 0) {
    // Update the current deals state and render them
    setCurrentDeals({ result: sortedDeals, meta: allDeals.meta });
    render(sortedDeals, allDeals.meta);  // Call the render function to display the filtered deals
  } else {
    console.log("No deals found for the selected filter.");
  }
});
// Function to filter deals based on the selected type
const filterDeals = (filterType) => 
{
  // Example of how the filtering can be handled (you can adjust based on your needs)
  console.log(`Filtering by: ${filterType}`);
  
  // You can modify this part to fetch deals based on the filter type or apply a filter to your current deals
  // For instance, you can add a query parameter or adjust the deal data structure to reflect the filter
};


//FEATURE 8: filter by Id of the LEGO

// Sélectionner le menu déroulant pour le Lego Set ID
const legoSetSelect = document.getElementById('lego-set-id-select');

// Ajouter un événement de changement au menu déroulant
legoSetSelect.addEventListener('change', async (event) => {
  const selectedId = event.target.value; // Récupère l'ID sélectionné
  
  // Vérifie que l'ID sélectionné est valide
  if (!selectedId) {
    return;
  }

  // Récupérer les deals actuels (sans appliquer de tri ici)
  const allDeals = await fetchDeals(currentPagination.currentPage, parseInt(selectShow.value));

  // Filtrer les deals pour récupérer uniquement celui qui correspond à l'ID sélectionné
  const sortedDeals = allDeals.result.filter(deal => deal.id === selectedId);

  // Vérifier si on a trouvé un deal
  if (sortedDeals.length > 0) {
    // Mettre à jour les deals et leur pagination
    setCurrentDeals({ result: sortedDeals, meta: allDeals.meta });
    render(sortedDeals, allDeals.meta); // Affiche les deals filtrés
  } else {
    const dealsContainer = document.getElementById('deals');
    dealsContainer.innerHTML = `<p>No deals found for Lego set ID: ${selectedId}</p>`;
  }
});


//FEATURE 9: average, p5, p25, p50

let calculatedIndicators = null; // Variable pour stocker les indicateurs

// Fonction pour calculer les indicateurs de prix
function calculatePriceIndicators(deals) {
  if (!deals || deals.length === 0) {
    // Retourne des valeurs par défaut si aucun deal n'est disponible
    return { p5: 0, p25: 0, p50: 0, nbDeals: 0, nbSales: 0 };
  }

  // Extraire les prix et les trier
  const prices = deals.map(deal => deal.price).sort((a, b) => a - b);

  // Calcul des indicateurs statistiques
  const p5 = prices[Math.floor(prices.length * 0.05)] || 0;
  const p25 = prices[Math.floor(prices.length * 0.25)] || 0;
  const p50 = prices[Math.floor(prices.length * 0.5)] || 0;
  const nbDeals = deals.length;

  return { p5, p25, p50, nbDeals };
}

// Fonction pour mettre à jour l'affichage des indicateurs
function updatePriceIndicators(indicators) {
  // Vérifier que les indicateurs existent
  if (!indicators) return;

  // Mettre à jour les éléments HTML correspondants
  document.getElementById('nbDeals').textContent = indicators.nbDeals;
  document.getElementById('nb_p5').textContent = indicators.p5;
  document.getElementById('nb_p25').textContent = indicators.p25;
  document.getElementById('nb_p50').textContent = indicators.p50;
}

// Fonction principale pour récupérer les deals et calculer les indicateurs
async function fetchAndDisplayPriceIndicators(page = 1, size = 6) {
  try {
    // Récupérer les deals avec la fonction fetchDeals
    const data = await fetchDeals(page, size);
    const deals = data.result;

    // Calculer les indicateurs
    calculatedIndicators = calculatePriceIndicators(deals);

    // Mettre à jour l'affichage des indicateurs
    updatePriceIndicators(calculatedIndicators);
  } catch (error) {
    console.error("Erreur lors de la récupération ou de l'affichage des indicateurs :", error);
  }
}

// Appeler fetchAndDisplayPriceIndicators à chaque chargement ou mise à jour de page
fetchAndDisplayPriceIndicators(currentPagination.currentPage, parseInt(selectShow.value));



// FEATURE 10: Update Lifetime Value for a single selected deal by ID

// Sélectionner le menu déroulant pour le Lego Set ID



// Fonction pour calculer le Lifetime Value
function calculateLifetimeValue(deal) 
{
  const publishedTimestamp = deal.published; // Timestamp Unix en secondes
  const currentTimestamp = Math.floor(Date.now() / 1000); // Timestamp actuel en secondes
  const lifetimeInSeconds = currentTimestamp - publishedTimestamp; // Différence en secondes
  const lifetimeInDays = Math.floor(lifetimeInSeconds / (60 * 60 * 24)); // Conversion en jours
  return (lifetimeInDays+1);  //always missing a day, don't know why
}


function updateAverageLifetime(lifetimeValue) 
{
  // Mettre à jour l'élément HTML avec la valeur du Lifetime Value
  document.getElementById('lifetime_val').textContent = `${lifetimeValue} days`;
}



//FEATURE: Display the vinted sales for a specified id

// Function to fetch sales from Vinted API
const fetchVintedSales = async (id) => {
  try {
    const response = await fetch(`https://lego-api-blue.vercel.app/sales?id=${id}`);
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return [];
    }

    return body.data.result || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Modify the event listener to handle fetching and displaying data from both APIs

legoSetSelect.addEventListener('change', async (event) => {
  const selectedId = event.target.value.toString(); // Convertir en chaîne

  if (!selectedId) {
    return;
  }

  const allDeals = await fetchDeals(currentPagination.currentPage, parseInt(selectShow.value, 10));
  const vintedSales = await fetchVintedSales(selectedId);

  // Filtrer les deals avec l'ID en tant que chaîne
  const sortedDeals = allDeals.result.filter(deal => deal.id === selectedId);

  if (sortedDeals.length > 0 || vintedSales.length > 0) {
    const deal = sortedDeals[0]; // Un seul deal attendu pour un ID unique
    const lifetimeValue = calculateLifetimeValue(deal); // Calculer le Lifetime Value
    updateAverageLifetime(lifetimeValue); // Mettre à jour l'affichage

    // Render deals and Vinted sales
    renderDealsAndSales(sortedDeals, vintedSales);
  } else {
    document.getElementById('deals').innerHTML = `<p>No deals found for ID: ${selectedId}</p>`;
  }
});

// Function to render deals and Vinted sales
const renderDealsAndSales = (deals, sales) => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');

  const dealsTemplate = deals
    .map((deal) => {
      const datePublished = new Date(deal.published * 1000).toLocaleDateString();
      const discountPercentage = deal.discount;
      const price = deal.price;
      const retailPrice = deal.retail;
      const photo = deal.photo;
      const commentsCount = deal.comments;
      const temperature = deal.temperature;
      const title = deal.title;
      const dealLink = deal.link;

      
      return `
      <div class="deal-card" id="deal-${deal.uuid}">
        <div class="deal-header">
          <img src="${photo}" alt="${title}" class="deal-photo">
          <h3>${title}</h3>
          <span class="deal-date">Published: ${datePublished}</span>
        </div>
        <div class="deal-body">
          <p><strong>Price:</strong> €${price} <span class="original-price">€${retailPrice}</span></p>
          <p><strong>Discount:</strong> ${discountPercentage}%</p>
          <p><strong>Temperature:</strong> ${temperature}°C</p>
          <p><strong>Comments:</strong> ${commentsCount}</p>
        </div>
        <div class="deal-footer">
          <a href="${dealLink}" target="_blank" class="see-deal-button">See the deal</a>
        </div>
      </div>
      `;
    })
    .join('');


    const salesTemplate = sales
    .map((sale) => {
      const datePublished = new Date(sale.published).toLocaleDateString();
      const price = sale.price;
      const title = sale.title;
      const saleLink = sale.link;

      // Utiliser la photo du deal correspondant
      const logoVinted = 'https://play-lh.googleusercontent.com/Hs8pq7sF8ihEfencKzLZZh7w6A4jDF5CsALfnccHffE3P6rccKXULHXsdi6QrwuayDI';

      return `
      <div class="sale-card" id="sale-${sale.uuid}">
        <div class="sale-header">
          <img src="${logoVinted}" class="sale-photo">
        </div>
        <div class="sale-body">
          <h3>${title}</h3>
          <p><strong>Price:</strong> €${price}</p>
        </div>
        <div class="sale-footer">
          <span class="sale-date">Published: ${datePublished}</span>
          <a href="${saleLink}" target="_blank" class="see-sale-button">See the sale</a>
        </div>
      </div>
      `;
    })
    .join('');

  div.innerHTML = `<h2>Deals</h2>${dealsTemplate}<h2>Vinted Sales</h2>${salesTemplate}`;
  fragment.appendChild(div);
  sectionDeals.innerHTML = '';
  sectionDeals.appendChild(fragment);
};

/* FEATURE: showcasing the number of sales vinted for a specific id 



function calculatePriceIndicators(sales) {
  if (!sales || sales.length === 0) {
    // Retourne des valeurs par défaut si aucun deal n'est disponible
    return { p5: 0, p25: 0, p50: 0, nbDeals: 0, nbSales: 0 };
  }

  // Extraire les prix et les trier
  const prices = sales.map(sale => sale.price).sort((a, b) => a - b);

  // Calcul des indicateurs statistiques
  const p5 = prices[Math.floor(prices.length * 0.05)] || 0;
  const p25 = prices[Math.floor(prices.length * 0.25)] || 0;
  const p50 = prices[Math.floor(prices.length * 0.5)] || 0;
  const nbDeals = 1;
  const nbSales = sales.length;

  return { p5, p25, p50, nbDeals, nbSales };
}

// Fonction pour mettre à jour l'affichage des indicateurs
function updatePriceIndicators(indicators) {
  // Vérifier que les indicateurs existent
  if (!indicators) return;

  // Mettre à jour les éléments HTML correspondants
  document.getElementById('nbDeals').textContent = indicators.nbDeals;
  document.getElementById('nbSales').textContent = indicators.nbSales;
  document.getElementById('nb_p5').textContent = indicators.p5;
  document.getElementById('nb_p25').textContent = indicators.p25;
  document.getElementById('nb_p50').textContent = indicators.p50;
}

// Fonction principale pour récupérer les deals et calculer les indicateurs
async function fetchAndDisplayPriceIndicators(page = 1, size = 6) {
  try {
    // Récupérer les deals avec la fonction fetchDeals
    const data = await fetchVintedSales(page, size);
    const sales = data.result;

    // Calculer les indicateurs
    calculatedIndicators = calculatePriceIndicators(sales);

    // Mettre à jour l'affichage des indicateurs
    updatePriceIndicators(calculatedIndicators);
  } catch (error) {
    console.error("Erreur lors de la récupération ou de l'affichage des indicateurs :", error);
  }
}

// Appeler fetchAndDisplayPriceIndicators à chaque chargement ou mise à jour de page
fetchAndDisplayPriceIndicators(currentPagination.currentPage, parseInt(selectShow.value)); */
