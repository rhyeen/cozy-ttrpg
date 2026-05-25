import { current } from '@reduxjs/toolkit/react';
import { type ClientCharacterJson, type ClientCampaignJson, type ClientPrivatePlayEventJson, type ClientPublicPlayEventJson, CharacterFactory, type PartialClientCharacterJson } from '@rhyeen/cozy-ttrpg-shared';
import { characterFactory } from 'app/utils/factories';

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
  incomingEvent: ClientPrivatePlayEventJson | ClientPublicPlayEventJson,
): void {
  // @NOTE: If you are planning to console.log state, note that state is actually a draft,
  // the objects in it are Proxy objects. Use current(state) to get the actual state values,
  // but please only do this for console logging or debugging purposes.
  // See: https://stackoverflow.com/a/64653310/6090140
  rotateEvent(state, incomingEvent);
  const events = mergeEvents(state.rotatingEvents);
  for (const event of events) {
    if (event.entityClass !== incomingEvent.entityClass) return;
    if (event.entityId !== incomingEvent.entityId) return;
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
  // console.log('rotate event.data', event.data);
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
  const sortedEvents = [...events].sort((a, b) => a.createdAt - b.createdAt);
  for (const event of sortedEvents) {
    const key = `${event.entityClass}-${event.entityId}`;
    if (!merged[key]) {
      merged[key] = { ...event };
    } else {
      // Merge data if the event already exists
      merged[key].data = {
        ...merged[key].data,
        ...event.data,
      };
      merged[key].createdAt = event.createdAt;
    }
  }
  return Object.values(merged);
}

function missingEntityError(
  event: StateEventJson,
): void {
  // @NOTE: This is safe, because it means we've never seen this entity before
    // so when we call it via routes, it will be fully created with the latest updates.
  console.warn(`Event for entity class ${event.entityClass} with ID ${event.entityId} not found in state, skipping event.`);
}

function handleCharacterEvent(
  state: PlayState,
  event: StateEventJson,
): void {
  // console.log('Handling character event', event.data.private);
  if (eventIsStale(state.characters[event.entityId], event)) return;
  // console.log('Not stale', event.data.private);
  const json = state.characters[event.entityId];
  if (!json) return missingEntityError(event);
  const entity = characterFactory.clientJson(json);
  entity.update(event.data as PartialClientCharacterJson);
  state.characters[event.entityId] = {
    ...entity.clientJson(),
    updatedAt: new Date(event.createdAt).getTime(),
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
    updatedAt: new Date(event.createdAt).getTime(),
  };
}

function eventIsStale(
  entity: { updatedAt: number } | undefined | null,
  event: StateEventJson,
): boolean {
  // @NOTE: We cannot assume an event that triggered relatively soon to be
  // stale. It is possible that we received out of createdAt order two events
  // of the same nature (i.e. a private and public event). So we have to give
  // some (3 second) leeway here.
  return !!entity && entity.updatedAt >= event.createdAt + 3000;
}
