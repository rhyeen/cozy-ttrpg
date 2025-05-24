import { firestore } from 'firebase-admin';
import { Service } from './Service';
import { Campaign, CampaignFactory, CampaignJson, expandScope, Player, PlayerScope } from '@rhyeen/cozy-ttrpg-shared';
import { HttpsError } from 'firebase-functions/https';

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
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data.map(c => this.factory.fromJSON(c as any));
  }

  public async getCampaign(campaignId: string, assertPlayerUid?: string): Promise<Campaign | null> {
    const snapshot = await this.db.collection('campaigns').doc(campaignId).get();
    if (!snapshot.exists) {
      return null;
    }
    if (assertPlayerUid) {
      const campaign = this.factory.fromJSON(snapshot.data() as any);
      if (!campaign.players.some(p => p.uid === assertPlayerUid)) {
        return null;
      }
    }
    return this.factory.fromJSON(snapshot.data() as any);
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
    campaign: CampaignJson
  ): Promise<Campaign> {
    const newCampaign = this.factory.fromJSON(campaign);
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
    await this.db.collection('campaigns').doc(newCampaign.id).set(newCampaign.toJSON(true));
    return newCampaign;
  }

  public async updateCampaign(
    uid: string,
    campaign: CampaignJson,
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
    const updatedCampaign = this.factory.fromJSON(campaign);
    updatedCampaign.id = existingCampaign.id;
    updatedCampaign.name = campaign.name;
    updatedCampaign.description = campaign.description;
    await this.db.collection('campaigns').doc(existingCampaign.id).set(updatedCampaign.toJSON(true));
    return updatedCampaign;
  }

  public async addPlayer(
    uid: string,
    playerUid: string,
    campaignId: string,
  ): Promise<void> {
    const existingCampaign = await this.getCampaign(campaignId, uid);
    if (!existingCampaign) {
      throw new HttpsError('not-found', 'Campaign not found');
    }
    const player = existingCampaign.players.find(p => p.uid === playerUid);
    if (!player) {
      throw new HttpsError('not-found', 'Player not found');
    }
    if (
      !player.scopes.includes(PlayerScope.Owner) &&
      !player.scopes.includes(PlayerScope.GameMaster)
    ) {
      throw new HttpsError('permission-denied', 'You are not allowed to add players');
    }
    if (playerUid === uid) {
      throw new HttpsError('permission-denied', 'You cannot add yourself to the campaign');
    }
    const campaignRef = this.db.collection('campaigns').doc(campaignId);
    const newPlayer = new Player({
      uid: playerUid,
      invitedBy: uid,
      invitedAt: new Date(),
      approvedAt: null,
      deniedAt: null,
      deletedAt: null,
      scopes: [ PlayerScope.Player ],
    });
    await campaignRef.update({
      players: firestore.FieldValue.arrayUnion(newPlayer.toJSON(true)),
    });
  }

  public async updatePlayerStatus(
    uid: string,
    campaignId: string,
    status: 'approved' | 'denied',
  ) {
    const existingCampaign = await this.getCampaign(campaignId, uid);
    if (!existingCampaign) {
      throw new HttpsError('not-found', 'Campaign not found');
    }
    const player = existingCampaign.players.find(p => p.uid === uid);
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
    await this.db.collection('campaigns').doc(campaignId).update({
      players: existingCampaign.players.map(p => p.toJSON(true)),
    });
  }

  public async updatePlayerScopes(
    uid: string,
    playerUid: string,
    campaignId: string,
    scopes: PlayerScope[],
  ) {
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
    await this.db.collection('campaigns').doc(campaignId).update({
      players: existingCampaign.players.map(p => p.toJSON(true)),
    });
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
    const player = existingCampaign.players.find(p => p.uid === playerUid);
    if (!player) {
      throw new HttpsError('not-found', 'Player not found');
    }
    if (
      !player.scopes.includes(PlayerScope.Owner) &&
      !player.scopes.includes(PlayerScope.GameMaster)
    ) {
      throw new HttpsError('permission-denied', 'You are not allowed to remove players');
    }
    if (
      playerUid === uid &&
      (player.scopes.includes(PlayerScope.Owner) || player.scopes.includes(PlayerScope.GameMaster))
    ) {
      throw new HttpsError('permission-denied', 'You cannot remove yourself from the campaign if you run it');
    }
    const campaignRef = this.db.collection('campaigns').doc(campaignId);
    await campaignRef.update({
      players: firestore.FieldValue.arrayRemove({
        uid: playerUid,
      }),
    });
  }
}
