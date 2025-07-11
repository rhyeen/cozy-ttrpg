import { firestore } from 'firebase-admin';
import { Route } from './Route';
import { CampaignService } from '../services/Campaign.service';
import type { ClientCampaignJson } from '@rhyeen/cozy-ttrpg-shared';
import { type CallableRequest, HttpsError, type HttpsFunction } from 'firebase-functions/https';

export class CampaignRoute extends Route {
  private service: CampaignService;
  constructor(db: firestore.Firestore) {
    super(db);
    this.service = new CampaignService(db);
  }

  public async getCampaigns(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const campaigns = await this.service.getCampaigns(this.getUidFromRequest(request));
    return this.handleJsonResponse({ items: campaigns.map(c => c.clientJson()) });
  }

  public async createCampaign(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const campaignJson = request.data.campaign as ClientCampaignJson;
    if (!campaignJson) {
      throw new HttpsError('invalid-argument', 'Campaign data is required');
    }
    const campaign = await this.service.createCampaign(
      this.getUidFromRequest(request),
      campaignJson,
    );
    return this.handleJsonResponse({ item: campaign.clientJson() });
  }

  public async deleteCampaign(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const campaignId = request.data.campaignId;
    if (!campaignId) {
      throw new HttpsError('invalid-argument', 'Campaign ID is required');
    }
    await this.service.deleteCampaign(
      this.getUidFromRequest(request),
      campaignId,
    );
    return this.handleOkResponse();
  }

  public async updateCampaign(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const campaignJson = request.data.campaign as ClientCampaignJson;
    if (!campaignJson) {
      throw new HttpsError('invalid-argument', 'Campaign ID and data are required');
    }
    if (!campaignJson.id) {
      throw new HttpsError('invalid-argument', 'Campaign ID is required');
    }
    const campaign = await this.service.updateCampaign(
      this.getUidFromRequest(request),
      campaignJson,
    );
    return this.handleJsonResponse({ item: campaign.clientJson() });
  }

  public async addPlayer(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const campaignId = request.data.campaignId;
    const playerUid = request.data.playerUid;
    if (!campaignId || !playerUid) {
      throw new HttpsError('invalid-argument', 'Campaign ID and Player UID are required');
    }
    const player = await this.service.addPlayer(
      this.getUidFromRequest(request),
      playerUid,
      campaignId,
    );
    return this.handleJsonResponse({ item: player.clientJson() });
  }

  public async removePlayer(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const campaignId = request.data.campaignId;
    const playerUid = request.data.playerUid;
    if (!campaignId || !playerUid) {
      throw new HttpsError('invalid-argument', 'Campaign ID and Player UID are required');
    }
    await this.service.removePlayer(
      this.getUidFromRequest(request),
      playerUid,
      campaignId,
    );
    return this.handleOkResponse();
  }

  public async updateSelfPlayerStatus(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const campaignId = request.data.campaignId;
    const status = request.data.status;
    if (!campaignId || !status) {
      throw new HttpsError('invalid-argument', 'campaignId and status are required');
    }
    if (status !== 'approved' && status !== 'denied') {
      throw new HttpsError('invalid-argument', 'status must be "approved" or "denied"');
    }
    const player = await this.service.updatePlayerStatus(
      this.getUidFromRequest(request),
      this.getUidFromRequest(request),
      campaignId,
      status,
    );
    return this.handleJsonResponse({ item: player.clientJson() });
  }

  public async updatePlayerScopes(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const campaignId = request.data.campaignId;
    const playerUid = request.data.playerUid;
    const scopes = request.data.scopes;
    if (!campaignId || !playerUid || !scopes) {
      throw new HttpsError('invalid-argument', 'campaignId, playerUid and scopes are required');
    }
    const player = await this.service.updatePlayerScopes(
      this.getUidFromRequest(request),
      playerUid,
      campaignId,
      scopes,
    );
    return this.handleJsonResponse({ item: player.clientJson() });
  }
}
