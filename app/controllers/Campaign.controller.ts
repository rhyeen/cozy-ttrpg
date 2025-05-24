import { Player, type Campaign, type CampaignJson, type PlayerJson, type PlayerScope } from '@rhyeen/cozy-ttrpg-shared';
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

  public async updateCampaign(campaign: Campaign): Promise<Campaign> {
    const result = await this.callFirebase<
      { campaign: CampaignJson },
      { item: CampaignJson }
    >('updateCampaign', { campaign: campaign.toJSON(false) });
    return campaignFactory.fromJSON(result.item);
  }

  public async deleteCampaign(campaignId: string): Promise<void> {
    await this.callFirebase<{ campaignId: string }, undefined>(
      'deleteCampaign',
      { campaignId },
    );
  }

  public async addPlayer(
    campaignId: string,
    playerUid: string,
  ): Promise<Player> {
    const result = await this.callFirebase<
      { campaignId: string; playerUid: string },
      { item: PlayerJson }
    >('addPlayer', { campaignId, playerUid });
    return new Player(result.item);
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
  ): Promise<Player> {
    const result = await this.callFirebase<
      { campaignId: string; status: 'approved' | 'denied' },
      { item: PlayerJson }
    >('updateSelfPlayerStatus', { campaignId, status });
    return new Player(result.item);
  }

  public async updatePlayerScopes(
    campaignId: string,
    playerUid: string,
    scopes: PlayerScope[],
  ): Promise<Player> {
    const result = await this.callFirebase<
      { campaignId: string; playerUid: string; scopes: PlayerScope[] },
      { item: PlayerJson }
    >('updatePlayerScopes', { campaignId, playerUid, scopes });
    return new Player(result.item);
  }
}
