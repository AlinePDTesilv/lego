/* OBJECTIF: Trouver les 5 meilleurs deals Dealabs


// Fonction pour récupérer tous les deals Dealabs
async function fetchAllDealabsDeals() {
    try {
      const data = await fetchDeals(); // Récupère tous les deals
      console.log("Données récupérées depuis l'API :", data); // Log des données
      const dealabsDeals = data.result.filter(deal => deal.source === 'dealabs'); // Filtre les deals Dealabs
      console.log("Deals Dealabs filtrés :", dealabsDeals); // Log des deals filtrés
      return dealabsDeals;
    } catch (error) {
      console.error('Erreur lors de la récupération des deals Dealabs :', error);
      return [];
    }
  }
  
  // Fonction pour calculer la notation d'un deal
  function evaluateDeal(deal) {
    if (deal.source !== "dealabs") return 0; // Ne pas évaluer les deals qui ne viennent pas de Dealabs
    
    // Critères :
    const dateFactor = getDateFactor(deal.published);  // Date de publication (plus récent = mieux)
    const priceFactor = getPriceFactor(deal.price, deal.retailPrice);  // Remise et prix
    const temperatureFactor = getTemperatureFactor(deal.temperature);  // Température du deal
    
    // On combine ces facteurs pour obtenir une note finale.
    const finalScore = dateFactor * 0.4 + priceFactor * 0.4 + temperatureFactor * 0.2;
  
    return finalScore;
  }
  
  // Fonction pour calculer le facteur lié à la date
  function filterDealsByPrice(deals) {
    console.log("Deals avant filtrage :", deals);
  
    const prices = deals.map(deal => deal.price).sort((a, b) => a - b);
    console.log("Prix triés :", prices);
  
    const lowerBound = prices[Math.floor(prices.length * 0.05)]; // 5e percentile (prix trop bas)
    const upperBound = prices[Math.floor(prices.length * 0.95)]; // 95e percentile (prix trop élevé)
  
    console.log("Limites de prix :", { lowerBound, upperBound });
  
    const filteredDeals = deals.filter(deal => deal.price >= lowerBound && deal.price <= upperBound);
    console.log("Deals après filtrage :", filteredDeals);
  
    return filteredDeals;
  }
  
  // Fonction pour calculer le facteur lié au prix et à la remise
  function getPriceFactor(price, retailPrice) {
    const discount = ((retailPrice - price) / retailPrice) * 100;  // Remise en pourcentage
    
    if (discount >= 50) {
      return 1;  // Remise importante
    } else if (discount >= 30) {
      return 0.8;  // Remise modérée
    } else if (discount >= 10) {
      return 0.5;  // Remise faible
    } else {
      return 0.2;  // Aucune remise ou trop faible
    }
  }
  
  // Fonction pour calculer le facteur lié à la température du deal
  function getTemperatureFactor(temperature) {
    if (temperature >= 200) {
      return 1;  // Très populaire
    } else if (temperature >= 150) {
      return 0.8;  // Populaire
    } else if (temperature >= 100) {
      return 0.6;  // Moyennement populaire
    } else if (temperature >= 50) {
      return 0.3;  // Peu populaire
    } else {
      return 0.1;  // Très faible
    }
  }
  
  // Fonction pour filtrer les deals en excluant les prix trop bas (5%) et trop élevés (5%)
  function filterDealsByPrice(deals) {
    console.log("Deals avant filtrage :", deals);
  
    const prices = deals.map(deal => deal.price).sort((a, b) => a - b);
    console.log("Prix triés :", prices);
  
    const lowerBound = prices[Math.floor(prices.length * 0.05)]; // 5e percentile (prix trop bas)
    const upperBound = prices[Math.floor(prices.length * 0.95)]; // 95e percentile (prix trop élevé)
  
    console.log("Limites de prix :", { lowerBound, upperBound });
  
    const filteredDeals = deals.filter(deal => deal.price >= lowerBound && deal.price <= upperBound);
    console.log("Deals après filtrage :", filteredDeals);
  
    return filteredDeals;
  }
  
  // Fonction pour évaluer et trier les deals
  function evaluateAndSortDeals(deals) {
    const scoredDeals = deals.map(deal => {
      const score = evaluateDeal(deal);
      console.log(`Score pour le deal "${deal.title}" :`, score); // Log des scores
      return {
        ...deal,
        score
      };
    });
    return scoredDeals.sort((a, b) => b.score - a.score); // Trier par score décroissant
  }
  
  // Fonction pour afficher les 5 meilleurs deals
  function renderTopDeals(deals) {
    const topDeals = deals.slice(0, 5); // Prendre les 5 premiers deals
    renderDealabsDeals(topDeals); // Utiliser la fonction existante pour afficher les deals
  }
  
  // Fonction principale pour afficher les meilleurs deals Dealabs
  async function displayTopDealabsDeals() {
    try {
      const dealabsDeals = await fetchAllDealabsDeals(); // Récupérer les deals Dealabs
      const filteredDeals = filterDealsByPrice(dealabsDeals); // Filtrer les prix extrêmes
      const sortedDeals = evaluateAndSortDeals(filteredDeals); // Évaluer et trier les deals
      renderTopDeals(sortedDeals); // Afficher les 5 meilleurs deals
    } catch (error) {
      console.error('Erreur lors de l\'affichage des meilleurs deals Dealabs :', error);
    }
  }
  */