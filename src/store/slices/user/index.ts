import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from './api';
import { ApiResponse, EUserView, LoginSuccessResponse, UserInfo } from './types';

type AuthStates = {
  accessToken: string | null;
  refreshToken: string | null;
  wallet: string | null;
  userInfo: null | UserInfo;
  selectedView: {
    account: string | null;
    view: EUserView | null;
  };
};

const initialState: AuthStates = {
  accessToken: null,
  refreshToken: null,
  wallet: null,
  userInfo: null,
  selectedView: {
    account: null,
    view: null,
  },
};

// slice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.wallet = null;
      state.userInfo = null;
    },
    setAccessToken: (state, actions: PayloadAction<LoginSuccessResponse>) => {
      state.accessToken = actions.payload?.accessToken;
      state.refreshToken = actions.payload?.refreshToken;
    },
    setWallet: (state, actions: PayloadAction<string | null>) => {
      state.wallet = actions.payload;
    },
    clearWallet: (state) => {
      state.wallet = null;
    },
    setSelectedView: (
      state,
      actions: PayloadAction<{
        account: string;
        view: EUserView;
      }>,
    ) => {
      state.selectedView = actions.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.verifyWeb3Auth.matchFulfilled,
      (state, action: PayloadAction<ApiResponse<LoginSuccessResponse>>) => {
        state.accessToken = action.payload.data.accessToken;
        state.refreshToken = action.payload.data.refreshToken;
      },
    );
    // builder.addMatcher(
    //   authApi.endpoints.loginWithTwitter.matchFulfilled,
    //   (state, action: PayloadAction<ApiResponse<LoginSuccessResponse>>) => {
    //     state.accessToken = action.payload.data.accessToken;
    //     state.refreshToken = action.payload.data.refreshToken;
    //   },
    // );
    // builder.addMatcher(
    //   authApi.endpoints.loginWithGoogle.matchFulfilled,
    //   (state, action: PayloadAction<ApiResponse<LoginSuccessResponse>>) => {
    //     state.accessToken = action.payload.data.accessToken;
    //     state.refreshToken = action.payload.data.refreshToken;
    //   },
    // );
    // builder.addMatcher(
    //   authApi.endpoints.loginWithKakao.matchFulfilled,
    //   (state, action: PayloadAction<ApiResponse<LoginSuccessResponse>>) => {
    //     state.accessToken = action.payload.data.accessToken;
    //     state.refreshToken = action.payload.data.refreshToken;
    //   },
    // );
    // builder.addMatcher(
    //   authApi.endpoints.loginWithInstagram.matchFulfilled,
    //   (state, action: PayloadAction<ApiResponse<LoginSuccessResponse>>) => {
    //     state.accessToken = action.payload.data.accessToken;
    //     state.refreshToken = action.payload.data.refreshToken;
    //   },
    // );
    builder.addMatcher(
      authApi.endpoints.loginWithWalletConnect.matchFulfilled,
      (state, action: PayloadAction<ApiResponse<LoginSuccessResponse>>) => {
        state.accessToken = action.payload.data.accessToken;
        state.refreshToken = action.payload.data.refreshToken;
      },
    );
    builder.addMatcher(
      authApi.endpoints.verifyCodeEmailFan.matchFulfilled,
      (state, action: PayloadAction<ApiResponse<LoginSuccessResponse>>) => {
        state.accessToken = action.payload.data.accessToken;
        state.refreshToken = action.payload.data.refreshToken;
      },
    );
    builder.addMatcher(
      authApi.endpoints.getUserInfo.matchFulfilled,
      (state, action: PayloadAction<ApiResponse<UserInfo>>) => {
        state.userInfo = action.payload.data;
      },
    );
  },
});

// actions
export const { setAccessToken, setWallet, clearWallet, logout, setSelectedView } =
  userSlice.actions;

// reducer
export const userReducer = userSlice.reducer;
