import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';

export const getAccessToken = createSelector(
  (state: RootState) => state.user.accessToken,
  (accessToken) => accessToken,
);

export const getWallet = createSelector(
  (state: RootState) => state.user.wallet,
  (wallet) => wallet,
);

export const getUserInfo = createSelector(
  (state: RootState) => state.user.userInfo,
  (userInfo) => userInfo,
);

export const getListTeam = createSelector(
  (state: RootState) => state.user.userInfo?.teams,
  (teams) => teams,
);

export const getSelectedView = createSelector(
  (state: RootState) => state.user.selectedView,
  (selectedView) => selectedView,
);
