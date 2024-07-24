/* eslint-disable react-hooks/exhaustive-deps */
import { UseQuery } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { useCallback, useEffect, useState } from 'react';

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
const useInfinitePageQuery = <T>({
  useGetDataListQuery,
  params,
  headers,
  skip = false,
  refetchOnMountOrArgChange = false,
  pollingInterval,
  defaultPage = 1,
  mode = 'default',
}: Params) => {
  const [page, setPage] = useState<number>(defaultPage);
  const [refreshing, setRefreshing] = useState(false);
  const [combinedData, setCombinedData] = useState<T[]>([]);
  const inputParams =
    mode === 'default'
      ? {
          ...params,
          page,
        }
      : {
          params: {
            ...params,
            page,
          },
          headers,
        };

  const { data, isLoading, isFetching, isSuccess, isError, currentData, refetch } =
    useGetDataListQuery(inputParams, {
      skip,
      refetchOnMountOrArgChange,
      pollingInterval,
    });

  const convertedData = data as any;
  const metaData = convertedData?.metadata;

  useEffect(() => {
    if (Array.isArray(convertedData?.data || convertedData)) {
      if (page === defaultPage) {
        setCombinedData(convertedData?.data || (convertedData as any[]));
      } else {
        if (isValidArray(convertedData?.data || convertedData)) {
          setCombinedData((previousData) => {
            return [...previousData, ...(convertedData?.data || (convertedData as any[]))];
          });
        }
      }
    }
    setRefreshing(false);
  }, [convertedData]);

  const refresh = useCallback(() => {
    setCombinedData([]);
    setPage(1);
    setRefreshing(true);
    refetch();
  }, []);

  const softRefresh = useCallback(() => {
    setPage((pre) => {
      if (pre && pre !== 1) {
        setCombinedData([]);
        return 1;
      }
      return pre;
    });
  }, []);

  const loadMore = () => {
    if (
      isValidArray(convertedData?.data || (convertedData as any[])) &&
      metaData?.currentPage < metaData?.totalOfPages
    ) {
      setPage(page + 1);
    }
  };

  const resetPage = () => {
    setPage(1);
  };

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
    softRefresh,
  };
};

export default useInfinitePageQuery;
