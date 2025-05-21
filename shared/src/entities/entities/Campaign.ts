import { copyDate, DocumentEntity, Entity } from './Entity';
import type { CampaignJson, PlayerJson, PlayerScope } from '../json/Campaign.json';
import { generateId } from '../../utils/idGenerator';
import { DocumentJson } from '../json/Json';

export class Player extends Entity<PlayerJson> {
  public uid: string;
  public scopes: PlayerScope[];
  public invitedBy: string;
  public invitedAt: Date | null;
  public approvedAt: Date | null;
  public deniedAt: Date | null;
  public deletedAt: Date | null;

  constructor(json: PlayerJson) {
    super();
    this.uid = json.uid;
    this.invitedBy = json.invitedBy;
    this.invitedAt = json.invitedAt ? copyDate(json.invitedAt) : null;
    this.approvedAt = json.approvedAt ? copyDate(json.approvedAt) : null;
    this.deniedAt = json.deniedAt ? copyDate(json.deniedAt) : null;
    this.deletedAt = json.deletedAt ? copyDate(json.deletedAt) : null;
    this.scopes = [...json.scopes];
  }

  public toJSON(toStore: boolean): PlayerJson {
    return {
      uid: this.uid,
      invitedBy: this.invitedBy,
      invitedAt: this.invitedAt,
      approvedAt: this.approvedAt,
      deniedAt: this.deniedAt,
      deletedAt: this.deletedAt,
      scopes: [...this.scopes],
    };
  }

  public copy(): Player {
    return new Player(this.toJSON(true));
  }
}

export class Campaign extends DocumentEntity<CampaignJson> {
  public players: Player[];
  public name: string;
  public description: string;
  public id: string;

  constructor(
    id: string,
    name: string,
    description: string,
    players: Player[],
    documentJson?: DocumentJson,
  ) {
    super(documentJson);
    this.players = players;
    this.name = name;
    this.id = id;
    this.description = description;
  }

  public toJSON(toStore: boolean): CampaignJson {
    return {
      name: this.name,
      players: this.players.map((player) => player.toJSON(toStore)),
      id: this.id,
      description: this.description,
      ...this.copyDocumentJson(),
      players_uids: toStore ? this.players.map((player) => player.uid) : [],
    };
  }

  public copy(): Campaign {
    return new Campaign(
      this.id,
      this.name,
      this.description,
      this.players.map((player) => player.copy()),
      this.copyDocumentJson(),
    );
  }

  public static generateId(): string {
    return generateId('CPM');
  }
}
