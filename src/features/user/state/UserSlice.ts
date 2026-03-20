import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  name: string;
  uid: string;
  userFavourites: string[];
  isUserLoggedIn: boolean;
}

const initialState: UserState = {
  name: '',
  uid: '',
  userFavourites: [],
  isUserLoggedIn: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logOnUser: (state) => {
      state.isUserLoggedIn = true;
    },
    logOutUser: (state) => {
      state.isUserLoggedIn = false;
    },
    setReduxName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.uid = action.payload;
    },
    setUserFavourites: (state, action: PayloadAction<string[]>) => {
      state.userFavourites = action.payload;
    },
    clearUserState: () => initialState
  }
});

export const {
  setReduxName,
  setUserId,
  setUserFavourites,
  clearUserState,
  logOnUser,
  logOutUser
} = userSlice.actions;

export default userSlice.reducer;
