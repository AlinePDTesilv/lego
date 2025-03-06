/* eslint-disable no-console, no-process-exit 
const avenuedelabrique = require('./websites/avenuedelabrique');

async function sandbox (website = 'https://www.avenuedelabrique.com/nouveautes-lego') {
  try {
    console.log(`🕵️‍♀️  browsing ${website} website`);

    const deals = await avenuedelabrique.scrape(website);

    console.log(deals);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop); */


// eslint-disable no-console, no-process-exit  

/* const dealabs = require('./websites/dealabs');

async function sandbox(website = 'https://www.dealabs.com/groupe/lego') {
  try {
    console.log(`🕵️‍♀️  browsing ${website} website`);
    
    const deals = await dealabs.scrape(website);

    console.log(deals);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

// Récupérer l'argument de ligne de commande pour un site spécifique, sinon utiliser le site par défaut
const [,, eshop] = process.argv;

sandbox(eshop);*/ 



const fetchVintedData = require('./websites/vinted'); // Importer vinted.js
const fs = require('fs'); // Importer le module fs

const legoIDs = ['42182', '60363', '43231', '75403', '75404', '21034', '42635', '75405', 
                 '76266', '42176', '42635', '71460', '42202', '40524', '75402', '76262',
                 '77051', '71387', '76303', '21333', '43224', '10363', '60373', '72032']; // Liste d'IDs LEGO à scraper

async function main() {
    const allAnnonces = [];

    for (const id of legoIDs) {
        console.log(`🔎 Recherche pour l'ID LEGO: ${id}`);
        const annonces = await fetchVintedData(id);
        
        console.log(`📌 ${annonces.length} annonces trouvées pour ${id}:`);
        console.log(annonces);

        allAnnonces.push(...annonces);
    }

    // Écrire les annonces dans un fichier JSON
    fs.writeFileSync('storage_sales_Vinted.json', JSON.stringify(allAnnonces, null, 2), 'utf-8');
    console.log('Les annonces ont été enregistrées dans lego_annonces.json');

}

main();   


