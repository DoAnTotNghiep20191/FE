import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';

export const getTheme = createSelector(
  (state: RootState) => state.theme,
  (wallet) => wallet,
);
