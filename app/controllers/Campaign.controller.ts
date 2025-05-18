import type { Campaign, CampaignJson } from '@rhyeen/cozy-ttrpg-shared';
import { campaignFactory } from '../utils/factories';
import { Controller } from './Controller';

export class CampaignController extends Controller {
  constructor() {
    super();
  }

  public async getCampaigns(): Promise<Campaign[]> {
    const result = await this.callFirebase<
      undefined,
      { items: CampaignJson[] }
    >('getCampaigns', undefined);
    return result.items.map(i => campaignFactory.fromJSON(i));
  }

  public async createCampaign(campaign: Campaign): Promise<Campaign> {
    const result = await this.callFirebase<
      { campaign: CampaignJson },
      { item: CampaignJson }
    >('createCampaign', { campaign: campaign.toJSON() });
    return campaignFactory.fromJSON(result.item);
  }
}
