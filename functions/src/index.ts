import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {getFirestore} from "firebase-admin/firestore";
import {initializeApp} from "firebase-admin/app";
import { CampaignRoute } from './routes/Campaign.route';
import { UserRoute } from './routes/User.route';
import { FriendConnectionRoute } from './routes/FriendConnection.route';
import { CharacterRoute } from './routes/Character.route';
import { PlayRoute } from './routes/Play.route';

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
const userRoute = new UserRoute(db);
const friendConnectionRoute = new FriendConnectionRoute(db);
const characterRoute = new CharacterRoute(db);
const playRoute = new PlayRoute(db);

export const getSelfPlays = onCall(async (request) => {
  return await playRoute.getSelfPlays(request);
});

export const createSelfPlay = onCall(async (request) => {
  return await playRoute.createSelfPlay(request);
});

export const getCampaignPlays = onCall(async (request) => {
  return await playRoute.getCampaignPlays(request);
});

export const startPlay = onCall(async (request) => {
  return await playRoute.startPlay(request);
});

export const getSelfCharacters = onCall(async (request) => {
  return await characterRoute.getSelfCharacters(request);
});

export const createSelfCharacter = onCall(async (request) => {
  return await characterRoute.createSelfCharacter(request);
});

export const updateCharacter = onCall(async (request) => {
  return await characterRoute.updateCharacter(request);
});

export const deleteCharacter = onCall(async (request) => {
  return await characterRoute.deleteCharacter(request);
});

export const getCampaigns = onCall(async (request) => {
  return await campaignRoute.getCampaigns(request);
});

export const updateCampaign = onCall(async (request) => {
  return await campaignRoute.updateCampaign(request);
});

export const deleteCampaign = onCall(async (request) => {
  return await campaignRoute.deleteCampaign(request);
});

export const createCampaign = onCall(async (request) => {
  return await campaignRoute.createCampaign(request);
});

export const addPlayer = onCall(async (request) => {
  return await campaignRoute.addPlayer(request);
});

export const removePlayer = onCall(async (request) => {
  return await campaignRoute.removePlayer(request);
});

export const updateSelfPlayerStatus = onCall(async (request) => {
  return await campaignRoute.updateSelfPlayerStatus(request);
});

export const updatePlayerScopes = onCall(async (request) => {
  return await campaignRoute.updatePlayerScopes(request);
});

export const getSelfAsUser = onCall(async (request) => {
  return await userRoute.getSelfAsUser(request);
});

export const createSelfAsUser = onCall(async (request) => {
  return await userRoute.createSelfAsUser(request);
});

export const updateSelfAsUser = onCall(async (request) => {
  return await userRoute.updateSelfAsUser(request);
});

export const getFriendConnections = onCall(async (request) => {
  return await friendConnectionRoute.getFriendConnections(request);
});

export const inviteFriend = onCall(async (request) => {
  return await friendConnectionRoute.inviteFriend(request);
});

export const updateFriendStatus = onCall(async (request) => {
  return await friendConnectionRoute.updateFriendStatus(request);
});

export const updateFriendContext = onCall(async (request) => {
  return await friendConnectionRoute.updateFriendContext(request);
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
