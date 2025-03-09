

//Best discount (at least 30% and by descending order)
const findBestDiscountDeals = async (db) => {
    try {
      const collectionStatic = db.collection('deals');
      const collectionDynamic = db.collection('lego_dynamique');
  
      const bestDeals = await collectionStatic
        .find({ discount: { $gte: 30 } }) // Réduction >= 30%
        .sort({ discount: -1 })
        .toArray();
  
      await collectionDynamic.deleteMany({}); // Vider la collection dynamique
      await collectionDynamic.insertMany(bestDeals);
  
      console.log("✅ Meilleures réductions mises à jour dans 'lego_dynamique' !");
      return bestDeals;
    } catch (err) {
      console.error("❌ Erreur dans findBestDiscountDeals :", err);
      return [];
    }
  };
  
  // Most commented (at least 10 comments)
  const findMostCommentedDeals = async (db) => {
    try {
      const collectionStatic = db.collection('deals');
      const collectionDynamic = db.collection('lego_dynamique');
  
      const mostCommented = await collectionStatic
        .find({ comments: { $gte: 10 } }) // Filter: at least 10 comments
        .sort({ comments: -1 }) // Sort: most commented first
        .toArray();
  
      await collectionDynamic.deleteMany({});
      await collectionDynamic.insertMany(mostCommented);
  
      console.log("✅ Deals les plus commentés (min. 5 commentaires) mis à jour !");
      return mostCommented;
    } catch (err) {
      console.error("❌ Erreur dans findMostCommentedDeals :", err);
      return [];
    }
  };
  
  // Sorted by Price (by crescent order)
  const findDealsSortedByPrice = async (db) => {
    try {
      const collectionStatic = db.collection('deals');
      const collectionDynamic = db.collection('lego_dynamique');
  
      const sortedByPrice = await collectionStatic
        .find()
        .sort({ price: 1 }) //1 for crescent and (-1) for decrescent
        .toArray();
  
      await collectionDynamic.deleteMany({});
      await collectionDynamic.insertMany(sortedByPrice);
  
      console.log("✅ Deals triés par prix mis à jour !");
      return sortedByPrice;
    } catch (err) {
      console.error("❌ Erreur dans findDealsSortedByPrice :", err);
      return [];
    }
  };
  
  // Sorted by date (recent, published in the last 24 hours)

  const findDealsSortedByDate = async (db) => {
    try {
      const collectionStatic = db.collection('deals');
      const collectionDynamic = db.collection('lego_dynamique');
  
      const ADayAgo = Math.floor((Date.now() - (24 * 60 * 60 * 1000))/1000); // Convert to Unix timestamp 
      console.log("🕒 Timestamp 10 jours avant :", ADayAgo);
      const sortedByDate = await collectionStatic
        .find({ published: { $gte: ADayAgo } }) // Keep only deals from the last 3 days
        .sort({ published: -1 }) // Sort by most recent first
        .toArray();
  
      if (sortedByDate.length === 0) {
        console.warn("⚠️ No deals found in the last 24 hours!");
        return [];
      }
  
      await collectionDynamic.deleteMany({});
      await collectionDynamic.insertMany(sortedByDate);
  
      console.log("✅ Deals sorted by date updated!");
      return sortedByDate;
    } catch (err) {
      console.error("❌ Error in findDealsSortedByDate:", err);
      return [];
    }
  };


  //
  
  module.exports = {
    findBestDiscountDeals,
    findMostCommentedDeals,
    findDealsSortedByPrice,
    findDealsSortedByDate
  };
  
