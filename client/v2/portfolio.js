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
 * Render list of deals
 * @param  {Array} deals
 */
const renderDeals = deals => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = deals
    .map(deal => {
      return `
      <div class="deal" id=${deal.uuid}>
        <span>${deal.id}</span>
        <a href="${deal.link}">${deal.title}</a>
        <span>${deal.price}</span>
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


// Lifetime Value (average)
const loadAndCalculateLifetime = async () => {
  const deals = await fetchDeals(currentPagination.currentPage, parseInt(selectShow.value)); // Charger les deals
  const lifetimeValue = calculateLifetimeValue(deals.result); // Calculer la Lifetime Value
  updateAverageLifetime(lifetimeValue); // Mettre à jour l'affichage
};

// Appeler cette fonction au chargement de la page
loadAndCalculateLifetime();


// Filter functions: 
const filterByBestDiscount = (deals) => 
{
  return deals.filter(deal => {
    return deal.discount > 50;  // Only show deals with a discount higher than 50%
  });
};

const filterByMostCommented = (deals) => 
{
  return deals.filter(deal => deal.comments > 15);  // no deals with 15 comments and more !
};

const filterByHotDeals = (deals) => 
{
  return deals.filter(deal => deal.temperature > 40.0);  // Assuming 'temperature' is the field for the deal's temperature
};

// Add event listeners for the filter buttons

// Listen for the 'By best discount' button click
document.getElementById('best-discount-button').addEventListener('click', async () => {
  const allDeals = await fetchDeals(currentPagination.currentPage, parseInt(selectShow.value));  // Get current page and size
  const filteredDeals = filterByBestDiscount(allDeals.result);  // Apply the filter

  
  setCurrentDeals({ result: filteredDeals, meta: allDeals.meta });  // Update the current deals with filtered results
  render(filteredDeals, allDeals.meta);  // Re-render with filtered deals
});

// Listen for the 'Most commented' button click
document.getElementById('most-commented-button').addEventListener('click', async () => {
  // Fetch the current page and size (same as before)
  const allDeals = await fetchDeals(currentPagination.currentPage, parseInt(selectShow.value));  

  // Apply the filter: only keep deals with more than 15 comments
  const filteredDeals = filterByMostCommented(allDeals.result);

  // Update the current deals with filtered results
  setCurrentDeals({ result: filteredDeals, meta: allDeals.meta });

  // Re-render the page with the filtered deals
  render(filteredDeals, allDeals.meta);
});

// Listen for the 'Hot deals' button click
document.getElementById('hot-deals-button').addEventListener('click', async () => {
  // Fetch the current page and size (same as before)
  const allDeals = await fetchDeals(currentPagination.currentPage, parseInt(selectShow.value));

  // Apply the filter: only keep deals with a temperature greater than 100
  const filteredDeals = filterByHotDeals(allDeals.result);

  // Update the current deals with filtered results
  setCurrentDeals({ result: filteredDeals, meta: allDeals.meta });

  // Re-render the page with the filtered deals
  render(filteredDeals, allDeals.meta);
});


// Function to filter deals based on the selected type
const filterDeals = (filterType) => {
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
  const nbSales = deals.filter(deal => deal.price > 0).length;

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


// FEATURE 10: Lifetime value

function calculateLifetimeValue(deals) 
{
  let totalLifetime = 0;
  let totalDeals = 0;

  deals.forEach(deal => {
    const publishedTimestamp = deal.published;

    const publishedDate = new Date(publishedTimestamp * 1000);
    const currentDate = new Date();

    const lifetimeInMillis = currentDate - publishedDate;
    const lifetimeInDays = Math.floor(lifetimeInMillis / (1000 * 60 * 60 * 24));

    totalLifetime += lifetimeInDays;
    totalDeals += 1;
  });

  const lifetime_value = totalDeals > 0 ? Math.floor(totalLifetime / totalDeals) : 0;
  return lifetime_value;
}

function updateAverageLifetime(lifetime_value) {
  const lifetimeElement = document.getElementById('lifetime_val');
  
  lifetimeElement.textContent = `${lifetime_value} days`;
}
