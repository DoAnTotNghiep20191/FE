import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TypeForm } from '../user/types';

type AuthStates = {
  isFirst: boolean;
  isLoading: boolean;
  isCreateTeam: boolean;
  isLoadingWc: boolean;
  tokenInvite: string;
  openSignIn: boolean;
  oldPath: string;
  defaultForm: null | TypeForm;
  countRefresh: number;
  countChartDataRefresh: number;
};

const initialState: AuthStates = {
  isFirst: false,
  isLoading: false,
  isCreateTeam: false,
  isLoadingWc: false,
  tokenInvite: '',
  openSignIn: false,
  oldPath: '',
  defaultForm: null,
  countRefresh: 0,
  countChartDataRefresh: 0,
};

// slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsFirst: (state, actions: PayloadAction<boolean>) => {
      state.isFirst = actions.payload;
    },
    setIsLoading: (state, actions: PayloadAction<boolean>) => {
      state.isLoading = actions.payload;
    },
    setIsCreateTeam: (state, actions: PayloadAction<boolean>) => {
      state.isCreateTeam = actions.payload;
    },
    setIsLoadingWc: (state, actions: PayloadAction<boolean>) => {
      state.isLoadingWc = actions.payload;
    },
    setTokenInvite: (state, actions: PayloadAction<string>) => {
      state.tokenInvite = actions.payload;
    },
    setOpenSignIn: (state, actions: PayloadAction<boolean>) => {
      state.openSignIn = actions.payload;
    },
    setOldPath: (state, actions: PayloadAction<string>) => {
      state.oldPath = actions.payload;
    },
    setDefaultForm: (state, actions: PayloadAction<TypeForm>) => {
      state.defaultForm = actions.payload;
    },
    setCountRefresh: (state, actions: PayloadAction<number>) => {
      state.countRefresh = actions.payload;
    },
    setChartDataRefresh: (state, actions: PayloadAction<number>) => {
      state.countChartDataRefresh = actions.payload;
    },
  },
});

// actions
export const {
  setIsFirst,
  setIsLoading,
  setIsCreateTeam,
  setIsLoadingWc,
  setTokenInvite,
  setOpenSignIn,
  setOldPath,
  setDefaultForm,
  setChartDataRefresh,
} = authSlice.actions;

// reducer
export const authReducer = authSlice.reducer;
