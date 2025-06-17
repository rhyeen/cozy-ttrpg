import type { ClientDocumentJson, StoreDocumentJson } from './Json';
import type { ClientPlayJson } from './Play.json';

export enum PlayerScope {
  Owner = 'owner',
  GameMaster = 'gm',
  Player = 'player',
  Spectator = 'spectator',
}

export function expandScope(
  scope: PlayerScope | PlayerScope[],
): PlayerScope[] {
  if (Array.isArray(scope)) {
    return expandScope(scope.map(s => s)).flat();
  }
  const scopes = [PlayerScope.Spectator];
  if (scope === PlayerScope.Spectator) {
    return scopes;
  }
  scopes.push(PlayerScope.Player);
  if (scope === PlayerScope.Player) {
    return scopes;
  }
  scopes.push(PlayerScope.GameMaster);
  if (scope === PlayerScope.GameMaster) {
    return scopes;
  }
  scopes.push(PlayerScope.Owner);
  if (scope === PlayerScope.Owner) {
    return scopes;
  }
  // If we reach here, it means the scope is not recognized
  throw new Error(`Unknown scope: ${scope}`);
}

export interface RootPlayerJson {
  uid: string;
  invitedBy: string;
  scopes: PlayerScope[];
}

export interface ClientPlayerJson extends RootPlayerJson {
  invitedAt: number | null;
  approvedAt: number | null;
  deniedAt: number | null;
  deletedAt: number | null;
}

export interface StorePlayerJson extends RootPlayerJson {
  invitedAt: Date | null;
  approvedAt: Date | null;
  deniedAt: Date | null;
  deletedAt: Date | null;
}

export interface RootCampaignJson {
  name: string;
  description: string;
  id: string;
}

export interface StoreCampaignJson extends StoreDocumentJson, RootCampaignJson {
  players_uids: string[];
  characters_ids: string[];
}

export interface ClientCampaignJson extends ClientDocumentJson, RootCampaignJson {
  players: ClientPlayerJson[];
  plays: ClientPlayJson[];
}
