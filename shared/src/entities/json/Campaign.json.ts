import { DocumentJson } from './Json';

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
