import { copyDate, DocumentEntity, Entity } from './Entity';
import type { ClientCampaignJson, PlayerJson, PlayerScope, RootCampaignJson, StoreCampaignJson } from '../json/Campaign.json';
import { generateId } from '../../utils/idGenerator';
import type { DocumentJson } from '../json/Json';
import { Play } from './Play';

export class Player extends Entity<PlayerJson, PlayerJson> {
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

  private rootJson(): PlayerJson {
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

  public storeJson(): PlayerJson {
    return this.rootJson();
  }

  public clientJson(): PlayerJson {
    return this.rootJson();
  }

  public copy(): Player {
    return new Player(this.rootJson());
  }
}

export class Campaign extends DocumentEntity<StoreCampaignJson, ClientCampaignJson> {
  public players: Player[];
  public plays: Play[];
  public name: string;
  public description: string;
  public id: string;

  constructor(
    id: string,
    name: string,
    description: string,
    players: Player[],
    plays: Play[],
    documentJson?: DocumentJson,
  ) {
    super(documentJson);
    this.players = players;
    this.name = name;
    this.id = id;
    this.description = description;
    this.plays = plays;
  }

  private rootJson(): RootCampaignJson {
    return {
      name: this.name,
      id: this.id,
      description: this.description,
      ...this.copyDocumentJson(),
    };
  }

  public storeJson(): StoreCampaignJson {
    return {
      ...this.rootJson(),
      players_uids: this.players.map((player) => player.uid),
      characters_uids: this.plays.map((play) => play.characterId),
    };
  }

  public clientJson(): ClientCampaignJson {
    return {
      ...this.rootJson(),
      players: this.players.map((player) => player.clientJson()),
      plays: this.plays.map((play) => play.clientJson()),
    };
  }

  public copy(): Campaign {
    return new Campaign(
      this.id,
      this.name,
      this.description,
      this.players.map((player) => player.copy()),
      this.plays.map((play) => play.copy()),
      this.copyDocumentJson(),
    );
  }

  public static generateId(): string {
    return generateId('CPM');
  }
}
