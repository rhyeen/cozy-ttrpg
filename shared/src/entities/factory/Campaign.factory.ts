import { Campaign, Player } from '../entities/Campaign';
import { EntityFactory } from '../entities/Entity';
import type { CampaignJson } from '../json/Campaign.json';

export class CampaignFactory extends EntityFactory<
  Campaign, CampaignJson
> {
  public fromJSON(json: CampaignJson): Campaign {
    return new Campaign(
      json.id,
      json.name,
      json.description,
      json.players.map((player) => new Player({
        ...player,
      })),
      json,
    );
  }
}
