import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {getFirestore} from "firebase-admin/firestore";
import {initializeApp} from "firebase-admin/app";
import { CampaignRoute } from './routes/Campaign.route';

// Initialize Firebase Admin SDK
initializeApp();

const db = getFirestore();
if (process.env.FUNCTIONS_EMULATOR) {
  db.settings({
    host: "localhost:8080",
    ssl: false,
  });
}

const campaignRoute = new CampaignRoute(db);

export const getCampaigns = onCall(async () => {
  return await campaignRoute.getCampaigns();
});

export const createCampaign = onCall(async (data) => {
  return await campaignRoute.createCampaign(data);
});

export const helloWorld = onCall(async () => {
  const docRef = db.collection('tickerTest').doc('testDoc');
  
  try {
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(docRef);
      const currentTicker = doc.exists ? doc.data()?.ticker || 0 : 0;
      const newTicker = currentTicker + 1;
      transaction.set(docRef, { ticker: newTicker });
    });

    const updatedDoc = await docRef.get();
    const updatedTicker = updatedDoc.data()?.ticker;

    logger.info("Ticker updated successfully", { updatedTicker });
    return updatedTicker;
  } catch (error) {
    logger.error("Error updating ticker", { error });
    throw new Error("Failed to update ticker");
  }
});
