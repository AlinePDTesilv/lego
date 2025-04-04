const dealabs = require('./websites/dealabs');
const fetchVintedData = require('./websites/vinted');
const { connectToDatabase } = require('./database');
require('dotenv').config({ path: './dataBase.env' }); // Charger les variables d'environnement

const legoIDs = ['42182', '60363', '43231', '75403', '75404', '21034', '42635', '75405', 
  '76266', '42176', '42635', '71460', '42202', '40524', '75402', '76262',
  '77051', '71387', '76303', '21333', '43224', '10363', '60373', '72032', '42635', '75405', 
  '76266', '42176', '42635', '71460'];

async function fetchAndStoreDealabs(db) {
    console.log("🕵️‍♀️ Scraping Dealabs...");
    const deals = await dealabs.scrape('https://www.dealabs.com/groupe/lego');
    
    if (!deals || deals.length === 0) {
        console.log("❌ Aucun deal trouvé sur Dealabs.");
        return;
    }

    const dealsCollection = db.collection('deals');
    const result = await dealsCollection.insertMany(deals);
    console.log(`✅ ${result.insertedCount} deals ajoutés à la base de données !`);
}

async function fetchAndStoreVinted(db) {
    console.log("🕵️‍♀️ Scraping Vinted...");
    const allAnnonces = [];

    for (const id of legoIDs) {
        console.log(`🔎 Recherche pour l'ID LEGO: ${id}`);
        const annonces = await fetchVintedData(id);

        if (annonces && annonces.length > 0) {
            console.log(`📌 ${annonces.length} annonces trouvées pour ${id}`);
            allAnnonces.push(...annonces);
        }
    }

    if (allAnnonces.length > 0) {
        const salesCollection = db.collection('sales');
        const result = await salesCollection.insertMany(allAnnonces);
        console.log(`✅ ${result.insertedCount} annonces Vinted ajoutées à la base de données !`);
    } else {
        console.log("❌ Aucune annonce trouvée sur Vinted.");
    }
}

async function main() {
    try {
        const db = await connectToDatabase();
        console.log("🔗 Connexion à MongoDB...");
        await Promise.all([fetchAndStoreDealabs(db), fetchAndStoreVinted(db)]);
        console.log("✅ Données de Dealabs et Vinted stockées avec succès !");
        process.exit(0);
    } catch (error) {
        console.error("❌ Erreur lors du scraping et stockage :", error);
        process.exit(1);
    }
}

main();


