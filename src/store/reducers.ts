import { combineReducers } from 'redux';
import { baseQueryApi } from './baseQueryApi';
import { authReducer } from './slices/auth';
import { themeReducer } from './slices/theme';
import { userReducer } from './slices/user';

const appReducer = combineReducers({
  // wallet: userWalletReducer,
  theme: themeReducer,
  auth: authReducer,
  user: userReducer,
  [baseQueryApi.reducerPath]: baseQueryApi.reducer,
});

export const rootReducer = (state: any, action: any) => appReducer(state, action);
