import { copyDate, DocumentEntity, Entity } from './Entity';
import type { ClientCampaignJson, ClientPlayerJson, PlayerScope, RootCampaignJson, RootPlayerJson, StoreCampaignJson, StorePlayerJson } from '../json/Campaign.json';
import { generateId } from '../../utils/idGenerator';
import { Play } from './Play';
import { DocumentJson } from '../json/Json';

export class Player extends Entity<
StorePlayerJson,
ClientPlayerJson,
undefined,
undefined
> {
  public uid: string;
  public scopes: PlayerScope[];
  public invitedBy: string;
  public invitedAt: Date | null;
  public approvedAt: Date | null;
  public deniedAt: Date | null;
  public deletedAt: Date | null;

  constructor(json: StorePlayerJson | ClientPlayerJson) {
    super();
    this.uid = json.uid;
    this.invitedBy = json.invitedBy;
    this.invitedAt = json.invitedAt ? copyDate(json.invitedAt) : null;
    this.approvedAt = json.approvedAt ? copyDate(json.approvedAt) : null;
    this.deniedAt = json.deniedAt ? copyDate(json.deniedAt) : null;
    this.deletedAt = json.deletedAt ? copyDate(json.deletedAt) : null;
    this.scopes = [...json.scopes];
  }

  private rootJson(): RootPlayerJson {
    return {
      uid: this.uid,
      invitedBy: this.invitedBy,
      scopes: [...this.scopes],
    };
  }

  public storeJson(): StorePlayerJson {
    return {
      ...this.rootJson(),
      invitedAt: this.invitedAt ? copyDate(this.invitedAt) : null,
      approvedAt: this.approvedAt ? copyDate(this.approvedAt) : null,
      deniedAt: this.deniedAt ? copyDate(this.deniedAt) : null,
      deletedAt: this.deletedAt ? copyDate(this.deletedAt) : null,
    };
  }

  public clientJson(): ClientPlayerJson {
    return {
      ...this.rootJson(),
      invitedAt: this.invitedAt ? this.invitedAt.getTime() : null,
      approvedAt: this.approvedAt ? this.approvedAt.getTime() : null,
      deniedAt: this.deniedAt ? this.deniedAt.getTime() : null,
      deletedAt: this.deletedAt ? this.deletedAt.getTime() : null,
    };
  }

  public copy(): Player {
    return new Player(this.storeJson());
  }
}

export class Campaign extends DocumentEntity<
  StoreCampaignJson,
  ClientCampaignJson,
  undefined,
  undefined
> {
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
    };
  }

  public storeJson(): StoreCampaignJson {
    return {
      ...this.rootJson(),
      ...this.storeDocumentJson(),
      players_uids: this.players.map((player) => player.uid),
      characters_ids: this.plays.map((play) => play.characterId),
    };
  }

  public clientJson(): ClientCampaignJson {
    return {
      ...this.rootJson(),
      ...this.clientDocumentJson(),
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
      this.clientDocumentJson(),
    );
  }

  public static generateId(): string {
    return generateId('CPM');
  }
}
