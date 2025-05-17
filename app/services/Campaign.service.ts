import type { Campaign, CampaignJson } from '@rhyeen/entities';
import { httpsCallable } from 'firebase/functions';
import { campaignFactory } from '~/utils/factories';
import { functions } from '~/utils/firebase';

export class CampaignService {

  constructor() {}

  public async getCampaigns(): Promise<Campaign[]> {
    const getCampaigns = httpsCallable<undefined, { items: CampaignJson[] }>(functions, 'getCampaigns');
    const result = await getCampaigns();
    return result.data.items.map(i => campaignFactory.fromJSON(i));
  };
}
