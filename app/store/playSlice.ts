import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Character, CharacterJson } from '@rhyeen/cozy-ttrpg-shared'
import { characterFactory } from 'app/utils/factories';

interface PlayState {
  characters: CharacterJson[];
}

const initialState: PlayState = {
  characters: [],
};

const playSlice = createSlice({
  name: 'play',
  initialState,
  reducers: {
    setCharacters: (state, action: PayloadAction<CharacterJson[]>) => {
      state.characters = action.payload;
    },
    setCharacter: (state, action: PayloadAction<CharacterJson>) => {
      const index = state.characters.findIndex(char => char.id === action.payload.id);
      if (index !== -1) {
        state.characters[index] = action.payload;
      } else {
        state.characters.push(action.payload);
      }
    },
  },
});

export const playActions = playSlice.actions;
export default playSlice.reducer;

export const selectCharacters = (state: { play: PlayState }): Character[] => {
  return state.play.characters.map(c => characterFactory.clientJson(c));
};
