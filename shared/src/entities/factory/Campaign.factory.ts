import { Campaign, Player } from '../entities/Campaign';
import { EntityFactory } from '../entities/Entity';
import { Play } from '../entities/Play';
import type { ClientCampaignJson, PlayerJson, StoreCampaignJson } from '../json/Campaign.json';
import type { PlayJson } from '../json/Play.json';

export class CampaignFactory extends EntityFactory<
  Campaign, StoreCampaignJson, ClientCampaignJson, {
    players: PlayerJson[];
    plays: PlayJson[];
  }, undefined
> {

  public storeJson(
    json: StoreCampaignJson,
    other: {
      players: PlayerJson[],
      plays: PlayJson[],
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
