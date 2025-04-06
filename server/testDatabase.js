const { connectToDatabase } = require('./database');

async function testConnection() {
    try {
        const db = await connectToDatabase();
        console.log("✅ Connexion réussie à la base de données :", db.databaseName);
    } catch (error) {
        console.error("❌ Erreur de connexion à MongoDB :", error);
    } finally {
        process.exit(0); // Fermer le processus après le test
    }
}

testConnection();