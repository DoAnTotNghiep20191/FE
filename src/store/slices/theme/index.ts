import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type IStates = {
  mode: string;
};

const initialState: IStates = {
  mode: 'Light',
};

// slice
export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, actions: PayloadAction<string>) => {
      if (typeof state === 'string') {
        return (state = {
          mode: actions.payload,
        });
      } else {
        state.mode = actions.payload;
      }
    },
  },
});

// actions
export const { setTheme } = themeSlice.actions;

// reducer
export const themeReducer = themeSlice.reducer;
