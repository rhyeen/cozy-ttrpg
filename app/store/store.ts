import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import playReducer from './playSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    play: playReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;