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

'use strict';

// Current deals and pagination
let currentDeals = [];
let currentPagination = {};

// Selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionDeals = document.querySelector('#deals');
const spanNbDeals = document.querySelector('#nbDeals');

// Set global value
const setCurrentDeals = ({ result, meta }) => {
  currentDeals = result;
  currentPagination = meta;
};

// Fetch deals from Dealabs API
const fetchDeals = async (page = 1, size = 6) => {
  try {
    const response = await fetch(`https://server-two-teal-60.vercel.app/deals?page=${page}&size=${size}`);
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

// Fetch sales from Vinted API
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


// Fonction de tri des ventes par legoId
const filterSalesByLegoId = (sales, legoId) => {
  // Filtrer les ventes qui contiennent un legoId correspondant
  return sales.filter(item => item.legoId && item.legoId.toString() === legoId);
};

// Render deals and sales
const renderDealabsDeals = (items) => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');

  const template = items
    .map((item) => {
      const datePublished = item.published ? new Date(item.published * 1000).toLocaleDateString() : 'N/A';
      const price = item.price;
      const title = item.title;
      const link = item.link || '#';
      const retailPrice = item.retail || null;
      const discount = item.discount || null;
      const temperature = item.temperature || null;
      const comments = item.comments || null;
      const source = 'dealabs';

      const sourceClass = 'dealabs-card';

      const logoURL = 'https://upload.wikimedia.org/wikipedia/fr/thumb/5/57/Dealabs_Logo.svg/512px-Dealabs_Logo.svg.png?20201028202032';

      return `
        <div class="deal-card ${sourceClass}" id="deal-${item._id || item.uuid}">
          <div class="deal-main-content">
            <div class="deal-left">
              <img src="${logoURL}" alt="${source} Logo" class="brand-logo" />
              <span class="deal-date">Published: ${datePublished}</span>
            </div>
            <div class="deal-center">
              <h3 class="deal-title">${title}</h3>
              <div class="deal-price-info">
                ${retailPrice ? `<span class="retail-price">${retailPrice} €</span>` : ''}
                <span class="deal-price">Price: €${price}</span>
              </div>
              <div class="deal-extra-info">
                ${discount ? `<span><strong>Discount:</strong> ${discount}%</span>` : ''}
                ${temperature ? `<span><strong>🔥 Temperature:</strong> ${temperature}°</span>` : ''}
                ${comments ? `<span><strong>💬 Comments:</strong> ${comments}</span>` : ''}
              </div>
            </div>
            <div class="deal-right">
              <a href="${link}" class="see-deal-button" target="_blank">See the deal</a>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionDeals.innerHTML = '<h2>Deals and Sales - Dealabs</h2>';
  sectionDeals.appendChild(fragment);
};

// Render Vinted sales
const renderVintedDeals = (items) => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');

  const template = items
    .map((item) => {
      const datePublished = item.published ? new Date(item.published).toLocaleDateString('fr-FR') : 'N/A';
      const price = item.price;
      const title = item.title;
      const link = item.link || '#';
      const retailPrice = item.retail || null;
      const discount = item.discount || null;
      const temperature = item.temperature || null;
      const comments = item.comments || null;
      const source = 'vinted';

      const sourceClass = 'vinted-card';

      const logoURL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Vinted_logo.png/960px-Vinted_logo.png';

      return `
        <div class="deal-card ${sourceClass}" id="deal-${item._id || item.uuid}">
          <div class="deal-main-content">
            <div class="deal-left">
              <img src="${logoURL}" alt="${source} Logo" class="brand-logo" />
              <span class="deal-date">Published: ${datePublished}</span>
            </div>
            <div class="deal-center">
              <h3 class="deal-title">${title}</h3>
              <div class="deal-price-info">
                ${retailPrice ? `<span class="retail-price">${retailPrice} €</span>` : ''}
                <span class="deal-price">Price: €${price}</span>
              </div>
              <div class="deal-extra-info">
                ${discount ? `<span><strong>Discount:</strong> ${discount}%</span>` : ''}
                ${temperature ? `<span><strong>🔥 Temp:</strong> ${temperature}°</span>` : ''}
                ${comments ? `<span><strong>💬 Comments:</strong> ${comments}</span>` : ''}
              </div>
            </div>
            <div class="deal-right">
              <a href="${link}" class="see-deal-button" target="_blank">See the deal</a>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

    div.innerHTML = template;
    fragment.appendChild(div);
  
    // Mise à jour des ventes affichées
    sectionDeals.innerHTML = '<h2>Deals and Sales - Vinted</h2>';
    sectionDeals.appendChild(fragment);
  
    // Calculer les indicateurs après avoir filtré les deals
    const indicators = calculatePriceIndicators(items); // Calcul des indicateurs pour les ventes filtrées
    updatePriceIndicators(indicators); // Mise à jour des indicateurs
  
    // Calculer la moyenne du lifetime pour les deals affichés
    const averageLifetime = calculateAverageLifetime(items); // Calcul de la moyenne pour le lifetime des ventes
    updateAverageLifetime(averageLifetime); // Mise à jour de l'indicateur de lifetime
};


// Fonction de recherche
const handleSearch = async () => {
  const legoId = document.getElementById('lego-set-search').value; // Récupérer l'ID LEGO de la barre de recherche

  // Si l'input est vide, ne rien faire
  if (!legoId) {
    return;
  }

  // Récupérer les ventes
  const sales = await fetchVintedSales();

  // Filtrer les ventes par legoId
  const filteredSales = filterSalesByLegoId(sales, legoId);

  // Si aucune vente n'est trouvée pour cet ID LEGO, arrêter l'exécution
  if (filteredSales.length === 0) {
    sectionDeals.innerHTML = '<h2>Aucune vente trouvée pour cet ID LEGO.</h2>';
    return;
  }

  // Récupérer les ventes abordables parmi celles filtrées
  const affordableSales = getTopAffordableVintedSalesByPercentile(filteredSales, 10, 5); // Filtrage par percentile (par exemple, 10% les moins chers, seuil minimum 5€)

  // Afficher ces ventes abordables
  renderVintedDeals(affordableSales); // Cette fonction prend les ventes filtrées et les affiche
};


// Ajouter un événement sur le bouton de recherche
const searchButton = document.getElementById('search-btn'); // Sélectionner le bouton de recherche
searchButton.addEventListener('click', handleSearch); // Ajouter un événement sur le clic du bouton de recherche

// Ajouter un événement sur l'input pour détecter les changements
const searchInput = document.getElementById('lego-set-search'); // Sélectionner le champ de saisie
searchInput.addEventListener('input', handleSearch); // Déclencher la recherche en temps réel (si souhaité)




// Modify renderDealsAndSales to choose the appropriate rendering function
const renderDealsAndSales = (items) => {
  const vintedItems = items.filter(item => item.source === 'vinted');
  const dealabsItems = items.filter(item => item.source === 'dealabs');

  if (vintedItems.length > 0) renderVintedDeals(vintedItems);
  if (dealabsItems.length > 0) renderDealabsDeals(dealabsItems);
};

// Get top 3 best sales per id

const getTopAffordableVintedSalesByPercentile = (sales, percentile = 10, minPriceThreshold = 5) => {
  // Trier les ventes par prix (prix croissant)
  const sortedSales = [...sales].sort((a, b) => a.price - b.price);

  // Calcul du prix à partir du percentile inférieur
  const index = Math.floor((percentile / 100) * sortedSales.length);
  const percentilePrice = sortedSales[index].price;

  // Filtrer les ventes dont le prix est inférieur au prix du percentile et au seuil minimum
  const affordableSales = sortedSales.filter(item => item.price <= percentilePrice && item.price >= minPriceThreshold);

  // Exclure les ventes avec des prix trop bas (sous le seuil minimum)
  // Si nécessaire, on peut aussi exclure un seul item très bas (par exemple, le moins cher de tous).
  if (affordableSales.length > 3) {
    affordableSales.splice(affordableSales.length - 1, 1); // On s'assure de garder uniquement les meilleures dans la gamme
  }

  // Retourner les 3 ventes les plus intéressantes parmi celles filtrées
  return affordableSales.slice(0, 3);
};

const renderAffordableVintedSales = async () => {
  // Récupérer toutes les ventes
  const allSales = await fetchVintedSales();

  // Filtrer les ventes selon le percentile (par exemple, percentile = 10 pour les 10% les moins chers)
  const affordableSales = getTopAffordableVintedSalesByPercentile(allSales, 10, 5); // Le seuil minimum de prix est ici 5€

  // Afficher ces ventes
  renderVintedDeals(affordableSales); // Cette fonction prend les ventes filtrées et les affiche
};


// Get top 5 deals
const getTopDealabsDeals = async (maxPrice) => {
  const data = await fetchDeals(1, maxPrice);

  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 1);

  const filteredDeals = data.result
    .filter(d => d.source === 'dealabs' || !d.source)
    .map(d => ({ ...d, source: 'dealabs' }))
    .filter(d => {
      const publishedDate = new Date(d.published * 1000);
      return d.temperature > 20 && publishedDate >= twoMonthsAgo && d.price <= maxPrice;
    });

  // Filtrer les doublons avant le scoring
  const uniqueDeals = [];
  const seenTitles = new Set(); // Un Set pour garder une trace des titres déjà vus

  for (const deal of filteredDeals) {
    if (!seenTitles.has(deal.title)) {
      uniqueDeals.push(deal);
      seenTitles.add(deal.title); // Ajouter le titre au Set
    }
  }

  // Calculer les scores après avoir filtré les doublons
  const scoredDeals = uniqueDeals.map(deal => {
    let score = deal.temperature || 0;
    if (deal.comments >= 5) score += 10;
    return { ...deal, score };
  });

  const topDeals = scoredDeals
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return topDeals;
};

// Display top deals
const displayTopDealabsDeals = async (maxPrice) => {
  const topDeals = await getTopDealabsDeals(maxPrice);

  // Mise à jour des deals avec les doublons supprimés
  setCurrentDeals({ result: topDeals, meta: { count: topDeals.length } });
  renderDealabsDeals(topDeals);

  // Calculer les indicateurs après avoir filtré les deals
  const indicators = calculatePriceIndicators(topDeals);
  updatePriceIndicators(indicators);

  // Calculer la moyenne du lifetime pour les deals affichés
  const averageLifetime = calculateAverageLifetime(topDeals);
  updateAverageLifetime(averageLifetime);
};

// Valeur par défaut de 100€
const defaultPrice = 100; 

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  // Assurer que le curseur et l'input sont bien initialisés à 100€
  priceMaxSlider.value = defaultPrice;
  priceMaxInput.value = defaultPrice;

  // Appeler la fonction pour afficher les deals
  displayTopDealabsDeals(defaultPrice);
});




//1) Mise en place slider de prix maximum :


// Valeur par défaut pour le prix

const priceMaxInput = document.getElementById("price-max-input"); // Ton input pour le prix max
const priceMaxSlider = document.getElementById("price-max-slider"); // Ton slider pour le prix max


priceMaxInput.value = defaultPrice;
priceMaxSlider.value = defaultPrice;

// Fonction pour appliquer le tri et le filtre en fonction du prix max et du type de tri
// Fonction pour trier et filtrer les éléments en fonction de la sélection de l'utilisateur
const filterAndSortDeals = (maxPrice, sortType) => {
  // Filtrer les items en fonction du prix maximum
  const filteredItems = currentDeals.filter(item => item.price <= maxPrice);

  // Appliquer le tri en fonction du type sélectionné
  const sortedItems = sortDeals(filteredItems, sortType);

  // Rendre les items triés et filtrés
  renderDealsAndSales(sortedItems);

  // Recalculer et mettre à jour les indicateurs
  const indicators = calculatePriceIndicators(sortedItems);
  updatePriceIndicators(indicators);

  // Calculer et mettre à jour l'average lifetime
  const averageLifetime = calculateAverageLifetime(sortedItems);
  updateAverageLifetime(averageLifetime);
};


// Écouteur d'événement pour l'input number (mise à jour du prix maximum via l'input)
priceMaxInput.addEventListener('input', () => {
  priceMaxSlider.value = priceMaxInput.value; // Synchroniser la valeur du slider avec l'input
  const maxPrice = parseFloat(priceMaxInput.value);
  displayTopDealabsDeals(maxPrice); 
});

// Écouteur d'événement pour le slider (mise à jour du prix maximum via le slider)
priceMaxSlider.addEventListener('input', () => {
  priceMaxInput.value = priceMaxSlider.value; // Synchroniser la valeur de l'input number avec le slider
  const maxPrice = parseFloat(priceMaxSlider.value);
  displayTopDealabsDeals(maxPrice); // Rafraîchir les meilleurs deals avec le prix sélectionné
});

// Appel initial avec un prix max par défaut
getTopDealabsDeals(defaultPrice);
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



// Ajout d'un écouteur d'événements pour le tri
sortSelect.addEventListener('change', () => {
  const maxPrice = parseFloat(priceMaxInput.value); // On récupère le prix maximum
  const sortType = sortSelect.value; // On récupère le type de tri sélectionné
  filterAndSortDeals(maxPrice, sortType); // Applique à la fois le filtre et le tri
});



//3) Top 3 best Sales Vinted by Id

const legoIDs = ['42182', '60363', '43231', '75403', '75404', '21034', '42635', '75405', 
  '76266', '42176', '71460', '42202', '40524', '75402', '76262',
  '77051', '71387', '76303', '21333', '43224', '10363', '60373', '72032'];

// Remplir le datalist
const datalist = document.getElementById('lego-ids');
[...new Set(legoIDs)].forEach(id => {
  const option = document.createElement('option');
  option.value = id;
  datalist.appendChild(option);
});

// Logique de recherche
document.getElementById('search-btn').addEventListener('click', () => {
  const legoId = document.getElementById('lego-set-search').value.trim();

  if (!legoId) return;

  fetch(`/sales/${legoId}`)
    .then(res => {
      if (!res.ok) throw new Error('Vente non trouvée');
      return res.json();
    })
    .then(sales => {
      displaySales(Array.isArray(sales) ? sales : [sales]); // pour s'adapter si c'est un seul objet
    })
    .catch(err => {
      console.error(err);
      alert('Erreur ou vente non trouvée.');
    });
});

//4) average, p5, p25, p50

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

  // Compter les deals et les sales séparément
  const nbDeals = deals.filter(deal => deal.source === 'dealabs').length;
  const nbSales = deals.filter(deal => deal.source === 'vinted').length;

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
    const indicators = calculatePriceIndicators(deals);
    updatePriceIndicators(indicators);

    // Calculer et mettre à jour l'average lifetime
    const averageLifetime = calculateAverageLifetime(deals);
    updateAverageLifetime(averageLifetime);
  } catch (error) {
    console.error("Erreur lors de la récupération ou de l'affichage des indicateurs :", error);
  }
}


// FEATURE 10: Update Lifetime Value for a single selected deal by ID

// Sélectionner le menu déroulant pour le Lego Set ID



// Fonction pour calculer le Lifetime Value moyen
function calculateAverageLifetime(deals) {
  if (!deals || deals.length === 0) {
    return 0; // Retourne 0 si aucun deal n'est disponible
  }

  // Calculer le lifetime pour chaque deal
  const lifetimes = deals.map(deal => {
    let publishedTimestamp;

    // Vérifiez la source pour déterminer le format de la date
    if (deal.source === 'dealabs') {
      publishedTimestamp = deal.published; // Timestamp Unix en secondes
    } else if (deal.source === 'vinted') {
      publishedTimestamp = Math.floor(new Date(deal.published).getTime() / 1000); // Convertir la date ISO en timestamp Unix en secondes
    }

    // Vérifiez si `publishedTimestamp` est valide
    if (!publishedTimestamp || isNaN(publishedTimestamp)) {
      return 0; // Retourne 0 si la date de publication est invalide
    }

    const currentTimestamp = Math.floor(Date.now() / 1000); // Timestamp actuel en secondes
    const lifetimeInSeconds = currentTimestamp - publishedTimestamp; // Différence en secondes
    const lifetimeInDays = Math.floor(lifetimeInSeconds / (60 * 60 * 24)); // Conversion en jours
    return lifetimeInDays + 1; // Ajout de 1 pour corriger le décalage
  });

  // Filtrer les valeurs invalides
  const validLifetimes = lifetimes.filter(lifetime => !isNaN(lifetime));

  // Calculer la moyenne des lifetimes
  const totalLifetime = validLifetimes.reduce((sum, lifetime) => sum + lifetime, 0);
  return Math.round(totalLifetime / validLifetimes.length); // Retourne la moyenne arrondie
}


// Fonction pour mettre à jour l'affichage de l'average lifetime
function updateAverageLifetime(averageLifetime) {
  // Mettre à jour l'élément HTML avec la valeur de l'average lifetime
  document.getElementById('lifetime_val').textContent = `${averageLifetime} days`;
}

//OBJECTIF: display 5 best sales per id



