// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode


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

// Invoking strict mode
'use strict';

// Current deals and pagination
let currentDeals = [];
let currentPagination = {};

// Selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionDeals = document.querySelector('#deals');
const spanNbDeals = document.querySelector('#nbDeals');

/**
 * Set global value
 * @param {Array} result - deals to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentDeals = ({ result, meta }) => {
  currentDeals = result;
  currentPagination = meta;
};

/**
 * Fetch deals from Dealabs API
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=6] - size of the page
 * @return {Object}
 */
const fetchDeals = async (page = 1, size = 6) => {
  try {
    const response = await fetch(
      `https://server-two-teal-60.vercel.app/deals?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (!Array.isArray(body)) {
      console.error('Erreur : données invalides reçues de l\'API Dealabs', body);
      return { result: [], meta: {} };
    }

    return {
      result: body,
      meta: {
        currentPage: page,
        pageCount: Math.ceil(body.length / size),
        count: body.length,
      },
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des deals :', error);
    return { result: [], meta: {} };
  }
};

/**
 * Fetch sales from Vinted API
 * @return {Array}
 */
const fetchVintedSales = async () => {
  try {
    const response = await fetch(`https://server-two-teal-60.vercel.app/sales`);
    const body = await response.json();

    if (!Array.isArray(body)) {
      console.error('Erreur : données invalides reçues de l\'API Vinted', body);
      return [];
    }

    return body;
  } catch (error) {
    console.error('Erreur lors de la récupération des ventes Vinted :', error);
    return [];
  }
};

/**
 * Render deals and sales in the same section
 * @param  {Array} items - combined deals and sales
 */
// Fonction de rendu des deals et sales (pour les deux sources)
const renderDealsAndSales = (items) => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');

  // Afficher uniquement les éléments filtrés
  const template = items
    .map((item) => {
      const datePublished = item.published ? new Date(item.published).toLocaleDateString() : 'N/A';
      const price = item.price;
      const title = item.title;
      const link = item.link || '#';
      const photo = item.photo || 'https://via.placeholder.com/150';
      const retailPrice = item.retail || null;
      const discount = item.discount || null;
      const temperature = item.temperature || null;
      const comments = item.comments || null;
      const source = item.source || 'dealabs'; // fallback au cas où

      const sourceClass = source === 'vinted' ? 'vinted-card' : 'dealabs-card';

      const logoURL = source === 'vinted'
        ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Vinted_logo.png/960px-Vinted_logo.png'
        : 'https://upload.wikimedia.org/wikipedia/fr/thumb/5/57/Dealabs_Logo.svg/512px-Dealabs_Logo.svg.png?20201028202032';

      return `
        <div class="deal-card ${sourceClass}" id="deal-${item._id || item.uuid}">
          <div class="deal-header">
            <img src="${photo}" alt="${title}" class="deal-photo">
            <h3>${title}</h3>
            <span class="deal-date">Published: ${datePublished}</span>
            <img class="brand-logo" src="${logoURL}" alt="${source} logo">
          </div>
          <div class="deal-body">
            <p><strong>Price:</strong> €${price}</p>
            ${retailPrice ? `<p><strong>Retail Price:</strong> €${retailPrice}</p>` : ''}
            ${discount ? `<p><strong>Discount:</strong> ${discount}%</p>` : ''}
            ${temperature ? `<p><strong>Temperature:</strong> ${temperature}°C</p>` : ''}
            ${comments ? `<p><strong>Comments:</strong> ${comments}</p>` : ''}
          </div>
          <div class="deal-footer">
            <a href="${link}" target="_blank" class="see-deal-button">See the deal</a>
          </div>
        </div>
      `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionDeals.innerHTML = '<h2>Deals and Sales</h2>';
  sectionDeals.appendChild(fragment);
};



/**
 * Initialize the page and fetch data from both APIs
 */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const deals = await fetchDeals();
    const sales = (await fetchVintedSales()).map(s => ({ ...s, source: 'vinted' }));

    const allItems = [
      ...deals.result.map(d => ({ ...d, source: 'dealabs' })),
      ...sales
    ];

    setCurrentDeals({ result: allItems, meta: deals.meta });
    renderDealsAndSales(allItems); // Rendu initial des deals et sales

    // Initialiser le prix maximum à 100€ et appliquer le filtre
    const initialMaxPrice = 100;
    const sortType = document.querySelector('#sort-select').value;

    // Appliquer les filtres et le tri dès le chargement de la page
    filterAndSortDeals(initialMaxPrice, sortType);

  } catch (error) {
    console.error('Erreur lors du chargement des données :', error);
  }
});

//1) Mise en place slider de prix maximum :

// Initialisation des valeurs des prix min et max
const priceMaxInput = document.querySelector('#price-max-input');
const priceMaxSlider = document.querySelector('#price-max-slider');

// Valeur par défaut pour le prix
const defaultPrice = 100; // Valeur initiale de 100€

priceMaxInput.value = defaultPrice;
priceMaxSlider.value = defaultPrice;

// Écouteur d'événements pour l'input de type number
priceMaxInput.addEventListener('input', () => {
  priceMaxSlider.value = priceMaxInput.value; // Synchroniser la valeur du slider avec l'input number
  const maxPrice = parseFloat(priceMaxInput.value);
  const sortType = document.querySelector('#sort-select').value;
  filterAndSortDeals(maxPrice, sortType); // Appliquer le filtre et le tri
});

// Écouteur d'événements pour le slider
priceMaxSlider.addEventListener('input', () => {
  priceMaxInput.value = priceMaxSlider.value; // Synchroniser la valeur de l'input number avec le slider
  const maxPrice = parseFloat(priceMaxSlider.value);
  const sortType = document.querySelector('#sort-select').value;
  filterAndSortDeals(maxPrice, sortType); // Appliquer le filtre et le tri
});


// Filtrer les items en fonction du prix maximum

/**
 * Filtrer les deals et sales par prix maximum
 * @param {Number} maxPrice - prix maximum à filtrer
 */
const filterAndRenderDeals = (maxPrice = parseFloat(priceMaxInput.value)) => {
  // Filtrer les items en fonction du prix
  const filteredItems = currentDeals.filter(item => {
    return item.price <= maxPrice;
  });

  // Rendre les items filtrés
  renderDealsAndSales(filteredItems);
};

// 2) Sort By price and date (expensive, cheap, recent, old)

/**
 * Fonction pour trier les deals en fonction du prix et de la date
 * @param {Array} items - Liste des items à trier
 * @param {string} sortType - Le type de tri ('price-asc', 'price-desc', 'date-asc', 'date-desc')
 * @return {Array} - Liste triée des items
 */
// Sélectionner le menu déroulant du tri
const sortSelect = document.querySelector('#sort-select');

// Fonction pour trier les éléments selon la sélection
const sortDeals = (items, sortType) => {
  switch (sortType) {
    case 'price-asc':
      return items.sort((a, b) => a.price - b.price); // Tri par prix croissant
    case 'price-desc':
      return items.sort((a, b) => b.price - a.price); // Tri par prix décroissant
    case 'date-asc':
      return items.sort((a, b) => new Date(b.published) - new Date(a.published)); // Tri par date croissante
    case 'date-desc':
      return items.sort((a, b) => new Date(a.published) - new Date(b.published)); // Tri par date décroissante
    case 'vinted_d':
      return items.filter(item => item.source === 'vinted'); // Filtrer les deals Vinted
    case 'dealabs_d':
      return items.filter(item => item.source === 'dealabs'); // Filtrer les deals Dealabs
    default:
      return items;
  }
};


// Fonction pour trier et filtrer les éléments en fonction de la sélection de l'utilisateur
const filterAndSortDeals = (maxPrice, sortType) => {
  // Filtrer les items en fonction du prix maximum
  const filteredItems = currentDeals.filter(item => item.price <= maxPrice);

  // Appliquer le tri en fonction du type sélectionné
  const sortedItems = sortDeals(filteredItems, sortType);

  // Rendre les items triés et filtrés
  renderDealsAndSales(sortedItems);
};

// Ajout d'un écouteur d'événements pour le tri
sortSelect.addEventListener('change', () => {
  const maxPrice = parseFloat(priceMaxInput.value); // On récupère le prix maximum
  const sortType = sortSelect.value; // On récupère le type de tri sélectionné
  filterAndSortDeals(maxPrice, sortType); // Applique à la fois le filtre et le tri
});

// 3) Sort only deals or sales (dealabs, vinted)



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
