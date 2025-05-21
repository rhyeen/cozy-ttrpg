import type { Campaign, CampaignJson, PlayerScope } from '@rhyeen/cozy-ttrpg-shared';
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
    >('createCampaign', { campaign: campaign.toJSON(false) });
    return campaignFactory.fromJSON(result.item);
  }

  public async addPlayer(
    campaignId: string,
    playerUid: string,
  ): Promise<void> {
    await this.callFirebase<
      { campaignId: string; playerUid: string },
      undefined
    >('addPlayer', { campaignId, playerUid });
  }

  public async removePlayer(
    campaignId: string,
    playerUid: string,
  ): Promise<void> {
    await this.callFirebase<
      { campaignId: string; playerUid: string },
      undefined
    >('removePlayer', { campaignId, playerUid }
    );
  }

  public async updateSelfPlayerStatus(
    campaignId: string,
    status: 'approved' | 'denied',
  ): Promise<void> {
    await this.callFirebase<
      { campaignId: string; status: 'approved' | 'denied' },
      undefined
    >('updateSelfPlayerStatus', { campaignId, status });
  }

  public async updatePlayerScopes(
    campaignId: string,
    playerUid: string,
    scopes: PlayerScope[],
  ): Promise<void> {
    await this.callFirebase<
      { campaignId: string; playerUid: string; scopes: PlayerScope[] },
      undefined
    >('updatePlayerScopes', { campaignId, playerUid, scopes });
  }
}
