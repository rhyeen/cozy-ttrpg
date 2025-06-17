import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ClientCharacterJson, ClientCampaignJson, ClientPublicPlayEventJson } from '@rhyeen/cozy-ttrpg-shared';
import { campaignFactory, characterFactory } from 'app/utils/factories';
import { handleEvent, type PlayState } from './playEvent/handleEvent';

const initialState: PlayState = {
  characters: {},
  campaign: null,
  rotatingEvents: [],
  rotatingEventIndex: -1,
};

const playEventSlice = createSlice({
  name: 'playEvent',
  initialState,
  reducers: {
    setCharacters: (state, action: PayloadAction<ClientCharacterJson[]>) => {
      const charactersMap: Record<string, ClientCharacterJson> = {};
      action.payload.forEach(character => {
        charactersMap[character.id] = character;
      });
      state.characters = charactersMap;
    },
    setCampaign: (state, action: PayloadAction<ClientCampaignJson>) => {
      state.campaign = action.payload;
    },
    addPublicEvent: (state, action: PayloadAction<ClientPublicPlayEventJson>) => {
      handleEvent(state, action.payload);
    },
    addPrivateEvent: (state, action: PayloadAction<ClientPublicPlayEventJson>) => {
      handleEvent(state, action.payload);
    },
  },
});

export const playEventActions = playEventSlice.actions;
export default playEventSlice.reducer;

export const selectPlayCharacters = createSelector(
  state => state.playEvent.characters, characters => {
  return Object.values(characters).map(c => characterFactory.clientJson(c as ClientCharacterJson));
});

export const selectPlayCampaign = createSelector(
  state => state.playEvent.campaign, campaign => {
  if (!campaign) return null;
  return campaignFactory.clientJson(campaign);
});
