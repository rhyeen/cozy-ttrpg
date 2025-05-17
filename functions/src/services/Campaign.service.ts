import { firestore } from 'firebase-admin';
import { Service } from './Service';
import { Campaign, CampaignFactory } from '@rhyeen/entities';

export class CampaignService extends Service{
  constructor(
    db: firestore.Firestore,
  ) {
    super(db);
  };

  public async getCampaigns(): Promise<Campaign[]> {
    const snapshot = await this.db.collection('campaigns').get();
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    const campaignFactory = new CampaignFactory();
    return data.map(c => campaignFactory.fromJSON(c as any));
  }
}
