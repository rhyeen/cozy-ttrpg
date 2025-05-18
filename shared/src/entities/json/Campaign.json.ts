import { DocumentJson } from './Json';

export enum PlayerScope {
  Owner = 'owner',
  GameMaster = 'gm',
  Player = 'player',
}

export interface PlayerJson {
  uid: string;
  invitedBy: string;
  invitedAt: Date | null;
  approvedAt: Date | null;
  deniedAt: Date | null;
  deletedAt: Date | null;
  scopes: PlayerScope[];
}

export interface CampaignJson extends DocumentJson {
  name: string;
  description: string;
  players: PlayerJson[];
  id: string;
  players_uids: string[];
}
