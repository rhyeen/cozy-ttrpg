import { firestore } from 'firebase-admin';
import { Route } from './Route';
import { CampaignService } from '../services/Campaign.service';
import { CampaignJson } from '@rhyeen/cozy-ttrpg-shared';
import { CallableRequest, HttpsError, HttpsFunction } from 'firebase-functions/https';

export class CampaignRoute extends Route {
  private service: CampaignService;
  constructor(db: firestore.Firestore) {
    super(db);
    this.service = new CampaignService(db);
  }

  public async getCampaigns(): Promise<HttpsFunction> {
    const campaigns = await this.service.getCampaigns();
    return this.handleJsonResponse({ items: campaigns.map(c => c.toJSON()) });
  }

  public async createCampaign(
    data: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const campaignJson = data.data.campaign as CampaignJson;
    if (!campaignJson) {
      throw new HttpsError('invalid-argument', 'Campaign data is required');
    }
    const campaign = await this.service.createCampaign(campaignJson);
    return this.handleJsonResponse({ item: campaign.toJSON() });
  }
}
