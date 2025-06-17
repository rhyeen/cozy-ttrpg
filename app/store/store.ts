import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user.slice';
import playReducer from './playEvent.slice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    playEvent: playReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;