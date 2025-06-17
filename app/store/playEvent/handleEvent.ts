import type { ClientCharacterJson, ClientCampaignJson, ClientPrivatePlayEventJson, ClientPublicPlayEventJson } from '@rhyeen/cozy-ttrpg-shared';

export const MAX_ROTATING_EVENTS = 30;

interface StateEventJson {
  id: string;
  operation: string;
  entityId: string;
  entityClass: string;
  createdAt: number;
  data: any;
}

export interface PlayState {
  characters: Record<string, ClientCharacterJson>;
  campaign: ClientCampaignJson | null;
  rotatingEvents: StateEventJson[];
  rotatingEventIndex: number;
}

export function handleEvent(
  state: PlayState,
  event: ClientPrivatePlayEventJson | ClientPublicPlayEventJson,
): void {
  rotateEvent(state, event);
  const events = mergeEvents(state.rotatingEvents);
  for (const event of events) {
    switch (event.entityClass) {
      case 'character':
        handleCharacterEvent(state, event);
        break;
      case 'campaign':
        handleCampaignEvent(state, event);
        break;
      default:
        console.error(`Unhandled event for entity class: ${event.entityClass}`, event);
        break;
    }
  }
}

function rotateEvent(
  state: PlayState,
  event: ClientPrivatePlayEventJson | ClientPublicPlayEventJson,
): void {
  const nextIndex = (state.rotatingEventIndex + 1) % MAX_ROTATING_EVENTS;
  state.rotatingEvents[nextIndex] = {
    id: event.id,
    operation: event.operation,
    entityId: event.entityId,
    entityClass: event.entityClass,
    createdAt: event.createdAt,
    data: event.data,
  };
  state.rotatingEventIndex = nextIndex;
}

/**
 * Merges the event rotation by combining event data of like entities into
 * single events. This way, if multiple events occur around the same time
 * for the same entity, their data will be guaranteed to be in order of
 * creation, even if the dispatches are in the wrong order.
 */
function mergeEvents(
  events: StateEventJson[],
): StateEventJson[] {
  const merged: Record<string, StateEventJson> = {};
  for (const event of events) {
    const key = `${event.entityClass}-${event.entityId}`;
    if (!merged[key]) {
      merged[key] = { ...event };
    } else {
      const existingEventIsOlder = merged[key].createdAt < event.createdAt;
      const newestData = existingEventIsOlder ? event : merged[key];
      const oldestData = existingEventIsOlder ? merged[key] : event;
      // Merge data if the event already exists
      merged[key].data = {
        ...oldestData.data,
        ...newestData.data,
      };
    }
  }
  return Object.values(merged);
}

function handleCharacterEvent(
  state: PlayState,
  event: StateEventJson,
): void {
  if (eventIsStale(state.characters[event.entityId], event)) return;
  state.characters[event.entityId] = {
    ...state.characters[event.entityId],
    ...event.data,
    updatedAt: new Date(event.createdAt),
  };
}

function handleCampaignEvent(
  state: PlayState,
  event: StateEventJson,
): void {
  if (eventIsStale(state.campaign, event)) return;
  state.campaign = {
    ...state.campaign,
    ...event.data,
    updatedAt: new Date(event.createdAt),
  };
}

function eventIsStale(
  entity: { updatedAt: number } | undefined | null,
  event: StateEventJson,
): boolean {
  return !!entity && entity.updatedAt >= event.createdAt;
}
