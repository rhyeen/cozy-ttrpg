import { Play, Player, PlayFactory, type Campaign, type ClientCampaignJson, type PlayerJson, type PlayerScope } from '@rhyeen/cozy-ttrpg-shared';
import { campaignFactory, playFactory } from '../utils/factories';
import { Controller } from './Controller';

export class CampaignController extends Controller {
  constructor() {
    super();
  }

  public async getCampaigns(): Promise<Campaign[]> {
    const result = await this.callFirebase<
      undefined,
      { items: ClientCampaignJson[] }
    >('getCampaigns', undefined);
    return result.items.map(i => campaignFactory.clientJson(i));
  }

  public async createCampaign(campaign: Campaign): Promise<Campaign> {
    const result = await this.callFirebase<
      { campaign: ClientCampaignJson },
      { item: ClientCampaignJson }
    >('createCampaign', { campaign: campaign.clientJson() });
    return campaignFactory.clientJson(result.item);
  }

  public async updateCampaign(campaign: Campaign): Promise<Campaign> {
    const result = await this.callFirebase<
      { campaign: ClientCampaignJson },
      { item: ClientCampaignJson }
    >('updateCampaign', { campaign: campaign.clientJson() });
    return campaignFactory.clientJson(result.item);
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
