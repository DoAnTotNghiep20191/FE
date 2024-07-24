/* eslint-disable react-hooks/exhaustive-deps */
import { UseQuery } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { get } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import unionBy from 'lodash/unionBy';

export const isValidArray = (array: any[]): boolean => {
  return Array.isArray(array) && array.length > 0;
};
interface Params {
  useGetDataListQuery: UseQuery<any>;
  params?: any;
  headers?: any;
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
  pollingInterval?: number;
  defaultPage?: number;
  mode?: 'params_input' | 'default';
}
const useInfiniteDefaultPageQuery = <T>({
  useGetDataListQuery,
  params,
  headers,
  skip = false,
  pollingInterval,
  defaultPage = 1,
  mode = 'params_input',
}: Params) => {
  const [page, setPage] = useState<number>(defaultPage);
  const [refreshing, setRefreshing] = useState(false);
  const [combinedData, setCombinedData] = useState<T[]>([]);
  const [random, setRandom] = useState(Math.random());
  const [id, setId] = useState<number>();
  const inputParams =
    mode === 'default'
      ? {
          page,
          id,
          ...params,
          random,
        }
      : {
          params: {
            page,
            id,
            ...params,
            random,
          },
          headers,
        };

  const { data, isLoading, isFetching, isSuccess, isError, currentData, refetch } =
    useGetDataListQuery(inputParams, {
      skip,
      pollingInterval,
    });

  const convertedData = data as any;
  const metaData = convertedData?.metadata;

  useEffect(() => {
    if (isValidArray(convertedData?.data || convertedData)) {
      setCombinedData((previousData) => {
        return [...previousData, ...(convertedData?.data || (convertedData as any[]))];
      });
    }
    setRefreshing(false);
  }, [convertedData]);

  const refresh = useCallback(() => {
    setRandom(Math.random());
    setCombinedData([]);
    setId(undefined);
    setRefreshing(true);
    refetch();
  }, []);

  const loadMore = () => {
    setId(get(combinedData, `[${combinedData.length - 1}].id`, undefined));
  };

  const resetPage = () => {
    setPage(1);
  };

  useEffect(() => {
    setRandom(Math.random());
    setCombinedData([]);
    setId(undefined);
    setRefreshing(true);
  }, []);

  return {
    combinedData,
    metaData,
    page,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    currentData,
    refreshing,
    loadMore,
    refresh,
    resetPage,
  };
};

export default useInfiniteDefaultPageQuery;
