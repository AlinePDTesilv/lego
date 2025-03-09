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

/*const dealabs = require('./websites/dealabs');
require('dotenv').config({ path: './dataBase.env' }); // Charger les variables d'environnement
const { connectToDatabase } = require('./database');

const { findBestDiscountDeals } = require('./salesQueries');

async function sandbox(website = 'https://www.dealabs.com/groupe/lego') {
  try {
    console.log(`🕵️‍♀️  browsing ${website} website`);
    
    const deals = await dealabs.scrape(website);
    if (!deals || deals.length === 0) {
      console.log("❌ Aucun deal trouvé !");
      return;
    }

    // Connexion à la base de données
    const db = await connectToDatabase();
    const collection = db.collection('deals');

// Insérer les deals dans MongoDB
    const result = await collection.insertMany(deals);
    console.log(`✅ ${result.insertedCount} deals ajoutés à la base de données !`);

    process.exit(0);
  } catch (e) {
    console.error("❌ Erreur :", e);
    process.exit(1);
  }
}

// Récupérer l'argument de ligne de commande pour un site spécifique, sinon utiliser le site par défaut
const [,, eshop] = process.argv;

sandbox(eshop); */



const fetchVintedData = require('./websites/vinted'); // Importer vinted.js
const fs = require('fs'); // Importer le module fs

const legoIDs = ['42182', '60363', '43231', '75403', '75404', '21034']; // Liste d'IDs LEGO à scraper

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


