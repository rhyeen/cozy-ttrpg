import { Entity } from './Entity';
import type { CampaignJson, PlayerJson } from '../json/Campaign.json';

export class Player extends Entity<PlayerJson> {
  public uid: string;

  constructor(uid: string) {
    super();
    this.uid = uid;
  }

  public toJSON(): PlayerJson {
    return {
      uid: this.uid,
    };
  }

  public copy(): Player {
    return new Player(this.uid);
  }
}

export class Campaign extends Entity<CampaignJson> {
  public players: Player[];
  public name: string;
  public id: string;

  constructor(
    id: string,
    name: string,
    players: Player[],
  ) {
    super();
    this.players = players;
    this.name = name;
    this.id = id;
  }

  public toJSON(): CampaignJson {
    return {
      name: this.name,
      players: this.players.map((player) => player.toJSON()),
      id: this.id,
    };
  }

  public copy(): Campaign {
    return new Campaign(
      this.id,
      this.name,
      this.players.map((player) => player.copy()),
    );
  }
}
