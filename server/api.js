console.log('api.js est exécuté');

const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: './dataBase.env' });

const app = express();

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

// Connexion à MongoDB
const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);
let db;

async function connectToDatabase() {
  if (db) {
    console.log('✅ Connexion MongoDB déjà établie');
    return db;
  }

  console.log('🔄 Tentative de connexion à MongoDB...');
  try {
    await client.connect();
    db = client.db('lego'); // Nom de la base de données
    console.log('✅ Connecté à MongoDB');
    return db;
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB :', error);
    throw error;
  }
}

// Middleware global pour loguer les requêtes
app.use((req, res, next) => {
  console.log(`🔍 Requête reçue : ${req.method} ${req.url}`);
  next();
});

// Endpoint racine
app.get('/', (req, res) => {
  res.send({ ack: true });
});

// Fonction pour supprimer les doublons basés sur 'title' et 'price'
function removeDuplicates(items) {
  const uniqueItems = [];
  const seen = new Set();

  for (const item of items) {
    const identifier = `${item.title}-${item.price}`; // Combinaison unique de 'title' et 'price'
    if (!seen.has(identifier)) {
      seen.add(identifier);
      uniqueItems.push(item);
    }
  }

  return uniqueItems;
}


// GET /deals - Récupérer tous les deals
app.get('/deals', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const deals = await database.collection('deals').find().toArray();
    const uniqueDeals = removeDuplicates(deals);
    
    res.json(uniqueDeals);
  } catch (error) {
    console.error('Erreur lors de la récupération des deals:', error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

// GET /deals/:id - Récupérer un deal par ID
app.get('/deals/:id', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const { id } = req.params;

    // Vérifie si l'ID est valide avant de l'utiliser
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID invalide' });
    }

    const deal = await database.collection('deals').findOne({ _id: new ObjectId(id) });

    if (!deal) {
      return res.status(404).json({ error: 'Deal non trouvé' });
    }

    res.json(deal);
  } catch (error) {
    console.error('Erreur lors de la récupération du deal:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// GET /sales - Récupérer toutes les ventes
app.get('/sales', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const sales = await database.collection('sales').find({}).toArray();
    const uniqueSales = removeDuplicates(sales);
    
    res.json(uniqueSales);
  } catch (error) {
    console.error('Erreur lors de la récupération des ventes:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// GET /sales/:legoId - Récupérer une vente par legoId
app.get('/sales/:legoId', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const { legoId } = req.params; // On récupère legoId depuis les paramètres

    // Vérifie si legoId est valide (si c'est un string ou un format valide pour legoId)
    if (!legoId || legoId.trim() === '') {
      return res.status(400).json({ error: 'legoId invalide' });
    }

    // Recherche de la vente en utilisant legoId dans la base de données
    const sale = await database.collection('sales').findOne({ legoId });

    if (!sale) {
      return res.status(404).json({ error: 'Vente non trouvée' });
    }
    
    res.json(sale);
  } catch (error) {
    console.error('Erreur lors de la récupération de la vente:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});


module.exports = app;