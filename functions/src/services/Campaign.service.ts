import { firestore } from 'firebase-admin';
import { Service } from './Service';
import { Campaign, CampaignFactory, CampaignJson } from '@rhyeen/cozy-ttrpg-shared';

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

  public async createCampaign(campaign: CampaignJson): Promise<Campaign> {
    const newCampaign = this.factory.fromJSON(campaign);
    newCampaign.id = Campaign.generateId();
    newCampaign.players = [];
    await this.db.collection('campaigns').doc(newCampaign.id).set(newCampaign.toJSON());
    return newCampaign;
  }
}
