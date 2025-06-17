import { firestore } from 'firebase-admin';
import { Service } from './Service';
import { Campaign, CampaignFactory, type ClientCampaignJson, expandScope, Player, type StorePlayerJson, PlayerScope, type StorePlayJson, type StoreCampaignJson } from '@rhyeen/cozy-ttrpg-shared';
import { HttpsError } from 'firebase-functions/https';
import { FieldValue } from 'firebase-admin/firestore';

export class CampaignService extends Service{
  private factory: CampaignFactory;

  constructor(
    db: firestore.Firestore,
  ) {
    super(db);
    this.factory = new CampaignFactory();
  }

  public async getCampaigns(uid: string): Promise<Campaign[]> {
    const snapshot = await this.db.collection('campaigns')
      .where('players_uids', 'array-contains', uid)
      .get();
    if (snapshot.empty) {
      return [];
    }
    const campaigns = await Promise.all(snapshot.docs.map(async (doc) => {
      const campaign = await this.getFillCampaignBySnapshot(doc);
      return campaign ? campaign : null;
    }));
    return campaigns.filter(c => c !== null) as Campaign[];
  }

  public async getCampaign(campaignId: string, assertPlayerUid?: string): Promise<Campaign | null> {
    const snapshot = await this.db.collection('campaigns').doc(campaignId).get();
    const campaign = await this.getFillCampaignBySnapshot(snapshot);
    if (!campaign) {
      return null;
    }
    if (assertPlayerUid) {
      if (!this.playerInCampaign(campaign, assertPlayerUid)) {
        throw new HttpsError('not-found', 'Player not found in campaign');
      }
    }
    return campaign;
  }

  private async getFillCampaignBySnapshot(
    campaignSnapshot: firestore.DocumentSnapshot,
  ): Promise<Campaign | null> {
    if (!campaignSnapshot.exists) {
      return null;
    }
    const playerSnapshot = await this.db.collection(campaignSnapshot.ref.parent.path)
    .doc(campaignSnapshot.id).collection('players').get();
    const playerJsons = playerSnapshot.docs.map(doc => {
      return doc.data() as StorePlayerJson;
    });
    const playJsons: StorePlayJson[] = [];
    await Promise.all(playerJsons.map(async playerJson => {
      const playSnapshot = await this.db.collection(campaignSnapshot.ref.parent.path)
      .doc(campaignSnapshot.id)
      .collection('players')
      .doc(playerJson.uid)
      .collection('characters').get();
      playJsons.push(...playSnapshot.docs.map(doc => doc.data() as StorePlayJson));
    }));
    const campaignJson = campaignSnapshot.data() as StoreCampaignJson;
    return this.factory.storeJson(campaignJson, {
      players: playerJsons,
      plays: playJsons,
    });
  }

  private playerInCampaign(
    campaign: StoreCampaignJson | Campaign | Player[],
    playerUid: string,
  ): boolean {
    if (Array.isArray(campaign)) {
      return campaign.some(p => p.uid === playerUid);
    }
    if (campaign instanceof Campaign) {
      if (campaign.players.find(p => p.uid === playerUid)) {
        return true;
      }
    } else {
      if (campaign.players_uids.find(p => p === playerUid)) {
        return true;
      }
    }
    return false;
  }

  public async deleteCampaign(
    uid: string,
    campaignId: string,
  ): Promise<void> {
    const existingCampaign = await this.getCampaign(campaignId, uid);
    if (!existingCampaign) {
      throw new HttpsError('not-found', 'Campaign not found');
    }
    const player = existingCampaign.players.find(p => p.uid === uid);
    if (!player) {
      throw new HttpsError('not-found', 'Player not found');
    }
    if (!player.scopes.includes(PlayerScope.Owner)) {
      throw new HttpsError('permission-denied', 'You are not allowed to delete this campaign');
    }
    await this.db.collection('campaigns').doc(campaignId).set({
      deletedAt: new Date(),
    }, { merge: true });
  }

  public async createCampaign(
    uid: string,
    campaign: ClientCampaignJson
  ): Promise<Campaign> {
    const newCampaign = this.factory.clientJson(campaign);
    newCampaign.id = Campaign.generateId();
    newCampaign.players = [
      new Player({
        uid,
        invitedBy: uid,
        invitedAt: new Date(),
        approvedAt: new Date(),
        deniedAt: null,
        deletedAt: null,
        scopes: expandScope(PlayerScope.Owner),
      }),
    ];
    const campaignRef = this.db.collection('campaigns').doc(newCampaign.id);
    // @NOTE: Intentionally not doing a transaction or promise.all here
    // because we want to ensure the campaign is created before adding the player.
    await campaignRef.set(newCampaign.storeJson());
    if (!newCampaign.players[0]) {
      throw new Error('Campaign must have at least one player');
    }
    await campaignRef.collection('players').doc(uid).set(newCampaign.players[0].storeJson());
    return newCampaign;
  }

  public async updateCampaign(
    uid: string,
    campaign: ClientCampaignJson,
  ): Promise<Campaign> {
    const existingCampaign = await this.getCampaign(campaign.id, uid);
    if (!existingCampaign) {
      throw new HttpsError('not-found', 'Campaign not found');
    }
    const selfPlayer = existingCampaign.players.find(p => p.uid === uid);
    if (!selfPlayer) {
      throw new HttpsError('not-found', 'You are not a player in this campaign');
    }
    if (
      !selfPlayer.scopes.includes(PlayerScope.Owner) &&
      !selfPlayer.scopes.includes(PlayerScope.GameMaster)
    ) {
      throw new HttpsError('permission-denied', 'You are not allowed to update this campaign');
    }
    const updatedCampaign = this.factory.clientJson(campaign);
    updatedCampaign.id = existingCampaign.id;
    updatedCampaign.name = campaign.name;
    updatedCampaign.description = campaign.description;
    const campaignRef = this.db.collection('campaigns').doc(existingCampaign.id);
    await campaignRef.set(updatedCampaign.storeJson());
    return updatedCampaign;
  }

  public async addPlayer(
    uid: string,
    playerUid: string,
    campaignId: string,
  ): Promise<Player> {
    const existingCampaign = await this.getCampaign(campaignId, uid);
    if (!existingCampaign) {
      throw new HttpsError('not-found', 'Campaign not found');
    }
    const selfPlayer = existingCampaign.players.find(p => p.uid === uid);
    if (!selfPlayer) {
      throw new HttpsError('not-found', 'You are not a player in this campaign');
    }
    if (
      !selfPlayer.scopes.includes(PlayerScope.Owner) &&
      !selfPlayer.scopes.includes(PlayerScope.GameMaster)
    ) {
      throw new HttpsError('permission-denied', 'You are not allowed to add players');
    }
    if (playerUid === uid) {
      throw new HttpsError('permission-denied', 'You cannot add yourself to the campaign');
    }
    if (existingCampaign.players.some(p => p.uid === playerUid)) {
      throw new HttpsError('already-exists', 'Player already exists in the campaign');
    }
    const campaignRef = this.db.collection('campaigns').doc(campaignId);
    const newPlayer = new Player({
      uid: playerUid,
      invitedBy: uid,
      invitedAt: new Date(),
      approvedAt: null,
      deniedAt: null,
      deletedAt: null,
      scopes: expandScope(PlayerScope.Player),
    });
    await Promise.all([
      campaignRef.update({
        players_uids: FieldValue.arrayUnion(playerUid),
      }),
      campaignRef.collection('players').doc(playerUid).set(newPlayer.storeJson())
    ]);
    return newPlayer;
  }

  public async updatePlayerStatus(
    uid: string,
    playerUid: string,
    campaignId: string,
    status: 'approved' | 'denied',
  ): Promise<Player> {
    if (uid !== playerUid) {
      throw new HttpsError('permission-denied', 'You can only update your own player status');
    }
    const existingCampaign = await this.getCampaign(campaignId, uid);
    if (!existingCampaign) {
      throw new HttpsError('not-found', 'Campaign not found');
    }
    const player = existingCampaign.players.find(p => p.uid === playerUid);
    if (!player) {
      throw new HttpsError('not-found', 'Player not found');
    }
    if (status === 'approved') {
      player.approvedAt = new Date();
      player.deniedAt = null;
    } else {
      player.deniedAt = new Date();
      player.approvedAt = null;
    }
    const campaignRef = this.db.collection('campaigns').doc(campaignId);
    await campaignRef.collection('players').doc(playerUid).set(player.storeJson());
    return player;
  }

  public async updatePlayerScopes(
    uid: string,
    playerUid: string,
    campaignId: string,
    scopes: PlayerScope[],
  ): Promise<Player> {
    const existingCampaign = await this.getCampaign(campaignId, uid);
    if (!existingCampaign) {
      throw new HttpsError('not-found', 'Campaign not found');
    }
    const player = existingCampaign.players.find(p => p.uid === playerUid);
    if (!player) {
      throw new HttpsError('not-found', 'Player not found');
    }
    const userPlayer = existingCampaign.players.find(p => p.uid === uid);
    if (!userPlayer) {
      throw new HttpsError('not-found', 'User\'s player not found');
    }
    if (
      !userPlayer.scopes.includes(PlayerScope.Owner) &&
      !userPlayer.scopes.includes(PlayerScope.GameMaster)
    ) {
      throw new HttpsError('permission-denied', 'You are not allowed to update player scopes');
    }
    if (playerUid === uid && !scopes.includes(PlayerScope.Owner) && userPlayer.scopes.includes(PlayerScope.Owner)) {
      throw new HttpsError('permission-denied', 'You cannot update your own owner scope');
    }
    if (scopes.includes(PlayerScope.Owner) && !userPlayer.scopes.includes(PlayerScope.Owner)) {
      throw new HttpsError('permission-denied', 'You cannot assign an owner scope to a player if you are not an owner');
    }
    if (
      scopes.includes(PlayerScope.GameMaster) &&
      !userPlayer.scopes.includes(PlayerScope.GameMaster) &&
      !userPlayer.scopes.includes(PlayerScope.Owner)
    ) {
      throw new HttpsError('permission-denied', 'You cannot assign a GM scope to a player if you are not a GM or an owner');
    }
    player.scopes = scopes;
    const campaignRef = this.db.collection('campaigns').doc(campaignId);
    await campaignRef.collection('players').doc(playerUid).set(player.storeJson());
    return player;
  }

  public async removePlayer(
    uid: string,
    playerUid: string,
    campaignId: string,
  ) {
    const existingCampaign = await this.getCampaign(campaignId, uid);
    if (!existingCampaign) {
      throw new HttpsError('not-found', 'Campaign not found');
    }
    const userPlayer = existingCampaign.players.find(p => p.uid === uid);
    const player = existingCampaign.players.find(p => p.uid === playerUid);
    if (!player) {
      throw new HttpsError('not-found', 'Player not found');
    }
    if (!userPlayer) {
      throw new HttpsError('not-found', 'User\'s player not found');
    }
    if (
      !userPlayer.scopes.includes(PlayerScope.Owner) &&
      !userPlayer.scopes.includes(PlayerScope.GameMaster) &&
      uid !== playerUid
    ) {
      throw new HttpsError('permission-denied', 'You are not allowed to remove players');
    }
    if (
      playerUid === uid &&
      (userPlayer.scopes.includes(PlayerScope.Owner) || userPlayer.scopes.includes(PlayerScope.GameMaster))
    ) {
      throw new HttpsError('permission-denied', 'You cannot remove yourself from the campaign if you run it');
    }
    const campaignRef = this.db.collection('campaigns').doc(campaignId);
    await Promise.all([
      campaignRef.update({
        players_uids: FieldValue.arrayRemove(playerUid),
      }),
      campaignRef.collection('players').doc(playerUid).delete(),
    ]);
  }
}
