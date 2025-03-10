const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: './dataBase.env' });

const PORT = 8092;
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
  try {
    await client.connect();
    db = client.db('lego'); // Nom de la base de données
    console.log('✅ Connecté à MongoDB');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB :', error);
  }
}

// Endpoint racine
app.get('/', (req, res) => {
  res.send({ ack: true });
});

// GET /deals/:id - Récupérer un deal par ID
app.get('/deals/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'La base de données n\'est pas encore connectée' });
    }

    const { id } = req.params;
    const deal = await db.collection('deals').findOne({ _id: new ObjectId(id) });

    if (!deal) {
      return res.status(404).json({ error: 'Deal non trouvé' });
    }

    res.json(deal);
  } catch (error) {
    console.error('Erreur lors de la récupération du deal:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Lancer le serveur après connexion à MongoDB
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`📡 Serveur en écoute sur le port ${PORT}`);
  });
});

module.exports = app;
