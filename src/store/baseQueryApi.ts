import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { RootState } from '.';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = (getState() as RootState).user.accessToken;
    if (!!token && endpoint !== 'refresh') {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();

  const result: any = await baseQuery(args, api, extraOptions);
  if (result?.error && result?.error?.status === 401 && !result?.error?.data?.validator_errors) {
    // checking whether the mutex is locked
    api.dispatch({ type: 'user/logout' });

    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        (window as any)?.logout && (window as any)?.logout();
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      // result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseQueryApi = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'user-info',
    'event-organizer',
    'ticket-option',
    'promo-code',
    'event-detail',
    'bank-detail',
    'team-invite',
    'update-kyc',
    'fan-rewards',
  ],
  endpoints: () => ({}),
  keepUnusedDataFor: 0,
});
