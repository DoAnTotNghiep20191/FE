import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';

export const getIsFirst = createSelector(
  (state: RootState) => state.auth.isFirst,
  (isFirst) => isFirst,
);

export const getIsCreateTeam = createSelector(
  (state: RootState) => state.auth.isCreateTeam,
  (isCreateTeam) => isCreateTeam,
);

export const getIsLoading = createSelector(
  (state: RootState) => state.auth.isLoading,
  (isLoading) => isLoading,
);

export const getIsLoadingWc = createSelector(
  (state: RootState) => state.auth.isLoadingWc,
  (isLoadingWc) => isLoadingWc,
);

export const getTokenInvite = createSelector(
  (state: RootState) => state.auth.tokenInvite,
  (tokenInvite) => tokenInvite,
);

export const getOpenSignIn = createSelector(
  (state: RootState) => state.auth.openSignIn,
  (openSignIn) => openSignIn,
);

export const getOldPath = createSelector(
  (state: RootState) => state.auth.oldPath,
  (oldPath) => oldPath,
);

export const getDefaultForm = createSelector(
  (state: RootState) => state.auth.defaultForm,
  (defaultForm) => defaultForm,
);
