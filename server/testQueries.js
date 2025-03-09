
const { connectToDatabase } = require('./database');
const {
  findBestDiscountDeals,
  findMostCommentedDeals,
  findDealsSortedByPrice,
  findDealsSortedByDate
} = require('./salesQueries');

async function testQueries() {
  try {
    const db = await connectToDatabase();
    
    console.log("📌 Quelle requête veux-tu exécuter ?");
    console.log("1️⃣ Meilleures réductions");
    console.log("2️⃣ Deals les plus commentés");
    console.log("3️⃣ Deals triés par prix");
    console.log("4️⃣ Deals triés par date");

    const userInput = process.argv[2]; // Reading the argument putted in the command line

    let result;
    switch (userInput) {
      case '1':
        result = await findBestDiscountDeals(db);
        break;
      case '2':
        result = await findMostCommentedDeals(db);
        break;
      case '3':
        result = await findDealsSortedByPrice(db);
        break;
      case '4':
        result = await findDealsSortedByDate(db);
        break;
      default:
        console.log("❌ Entrée invalide. Utilise 1, 2, 3 ou 4.");
        process.exit(1);
    }

    console.log("✅ Résultat :", result);
    process.exit(0);
  } catch (e) {
    console.error("❌ Erreur :", e);
    process.exit(1);
  }
}

testQueries();
