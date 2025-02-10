const fetch = require('node-fetch');
const { v5: uuidv5 } = require('uuid'); // Pour générer des UUID uniques

const parse = (data) => {
    try {
        const { items } = data; 
        return items.map(item => {
            const link = item.url;
            const price = item.total_item_price;
            const { photo } = item;
            const published = photo.high_resolution && photo.high_resolution.timestamp;

            return {
                link,
                price: price.amount,
                title: item.title,
                published: published ? new Date(published * 1000).toUTCString() : "Unknown",
                uuid: uuidv5(link, uuidv5.URL) // Générer un identifiant unique pour chaque annonce
            };
        });
    } catch (error) {
        console.error("Erreur dans la fonction parse:", error);
        return [];
    }
};

async function fetchVintedData(legoID) {
    const url = `https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&search_text=${legoID}&brand_ids=89162&status_ids=6,1`;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Referer': 'https://www.vinted.fr/'
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: Impossible de récupérer les données`);
        }

        const data = await response.json();
        return parse(data); // On applique le parsing ici

    } catch (error) {
        console.error(`Erreur lors de la récupération des données pour ${legoID}:`, error);
        return [];
    }
}

module.exports = fetchVintedData;


