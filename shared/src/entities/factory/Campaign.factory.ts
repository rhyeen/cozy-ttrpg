import { Campaign, Player } from '../entities/Campaign';
import { EntityFactory } from '../entities/Entity';
import { Play } from '../entities/Play';
import type { ClientCampaignJson, StoreCampaignJson, StorePlayerJson } from '../json/Campaign.json';
import type { StorePlayJson } from '../json/Play.json';

export class CampaignFactory extends EntityFactory<
  Campaign, StoreCampaignJson, ClientCampaignJson, {
    players: StorePlayerJson[];
    plays: StorePlayJson[];
  }, undefined
> {

  public storeJson(
    json: StoreCampaignJson,
    other: {
      players: StorePlayerJson[],
      plays: StorePlayJson[],
    },
  ): Campaign {
    return new Campaign(
      json.id,
      json.name,
      json.description,
      other.players.map((player) => new Player({
        ...player,
      })),
      other.plays.map((play) => new Play(
        play.uid,
        play.characterId,
        json.id,
        play.lastPlayedAt ? new Date(play.lastPlayedAt) : undefined,
        play,
      )),
    );
  }

  public clientJson(json: ClientCampaignJson): Campaign {
    return new Campaign(
      json.id,
      json.name,
      json.description,
      json.players.map((player) => new Player(player)),
      json.plays.map((play) => new Play(
        play.uid,
        play.characterId,
        json.id,
        play.lastPlayedAt ? new Date(play.lastPlayedAt) : undefined,
        play,
      )),
    );
  }
}
