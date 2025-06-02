import { Campaign, Player } from '../entities/Campaign';
import { EntityFactory } from '../entities/Entity';
import type { ClientCampaignJson, PlayerJson, StoreCampaignJson } from '../json/Campaign.json';

export class CampaignFactory extends EntityFactory<
  Campaign, StoreCampaignJson, ClientCampaignJson, PlayerJson[], undefined
> {

  public storeJson(
    json: StoreCampaignJson,
    other: PlayerJson[],
  ): Campaign {
    return new Campaign(
      json.id,
      json.name,
      json.description,
      other.map((player) => new Player({
        ...player,
      })),
      json,
    );
  }

  public clientJson(json: ClientCampaignJson): Campaign {
    return new Campaign(
      json.id,
      json.name,
      json.description,
      json.players.map((player) => new Player(player)),
      json,
    );
  }
}
