const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './dataBase.env' });

const mongoUri = process.env.MONGODB_URI;
console.log('🔍 MONGODB_URI:', process.env.MONGODB_URI);

async function testConnection() {
  const client = new MongoClient(mongoUri);

  try {
    console.log('🔄 Tentative de connexion à MongoDB...');
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    const db = client.db('lego');
    const collections = await db.listCollections().toArray();
    console.log('Collections disponibles :', collections.map(c => c.name));
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB :', error);
  } finally {
    await client.close();
  }
}

testConnection();