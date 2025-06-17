import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface FirebaseUser {
  email: string | null;
  uid: string;
  displayName: string | null;
  emailVerified: boolean;
  providerData: {
    providerId: string;
    uid: string;
    email: string | null;
  }[];
  isAnonymous: boolean;
  metadata: {
    // @NOTE: Both of these can be made Date by new Date(x)
    creationTime?: string;
    lastSignInTime?: string;
  }
}

interface UserState {
  user: FirebaseUser | null | undefined;
}

const initialState: UserState = {
  user: undefined,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setFirebaseUser: (state, action: PayloadAction<FirebaseUser | null>) => {
      state.user = action.payload;
    },
  },
});

export const { setFirebaseUser } = userSlice.actions;
export default userSlice.reducer;

export const selectFirebaseUser = (state: { user: UserState }) => state.user.user;