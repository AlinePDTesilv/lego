
require('dotenv').config({ path: './dataBase.env' });  // Charger les variables d'environnement depuis dataBase.env
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

let client;
let db;

/**
 * Connexion à MongoDB
 */
const connectToDatabase = async () => {
  if (!client) {
    client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db(MONGODB_DB_NAME);
    console.log("✅ Connecté à MongoDB !");
  }
  return db;
};

module.exports = { connectToDatabase };
