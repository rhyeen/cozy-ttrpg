import { firestore } from 'firebase-admin';
import { Route } from './Route';
import { CampaignService } from '../services/Campaign.service';
import { CampaignJson } from '@rhyeen/entities';

export class CampaignRoute extends Route {
  private service: CampaignService;
  constructor(db: firestore.Firestore) {
    super(db);
    this.service = new CampaignService(db);
  }

  public async getCampaigns(): Promise<{ items: CampaignJson[] }> {
    const campaigns = await this.service.getCampaigns();
    return { items: campaigns.map(c => c.toJSON()) };
  }
}
