import { UseQuery } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { useCallback, useEffect, useState } from 'react';
import { replaceArrayElementByIndex } from 'src/helpers/array/replaceArrayElementByIndex';
import useQueueLock from './useQueueLock';
import { EUserChallengeStatus, EVerifyUserChallengeStatus } from 'src/socket/BaseSocket';

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
  queueId: string;
}
const useInfiniteCampaignQueryWithQueue = <T>({
  useGetDataListQuery,
  params,
  headers,
  skip = false,
  refetchOnMountOrArgChange = false,
  pollingInterval,
  defaultPage = 1,
  mode = 'default',
  queueId,
}: Params) => {
  const [page, setPage] = useState<number>(defaultPage);
  const [refreshing, setRefreshing] = useState(false);
  const [combinedData, setCombinedData] = useState<T[]>([]);
  const { handleAddQueue } = useQueueLock({ id: queueId });

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
    handleAddQueue(() => {
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
    });
  }, [convertedData]);

  const refresh = useCallback(() => {
    setCombinedData([]);
    setPage(1);
    setRefreshing(true);
    refetch();
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

  const updateOneRecord = (
    campaignId: number,
    challengeId: number,
    status: EUserChallengeStatus,
  ) => {
    handleAddQueue(() => {
      setCombinedData((pre: any[]) => {
        const foundIndex = (pre || []).findIndex((item) => item.id === campaignId);
        console.log('foundIndex' + status, foundIndex);
        if (foundIndex !== -1) {
          const campaign = pre[foundIndex];
          const foundChallengeIndex = campaign.challenges.findIndex((item: any) => {
            return item.id === challengeId;
          });
          if (foundChallengeIndex !== -1) {
            console.log('foundChallengeIndex' + status, foundChallengeIndex);

            const challenge = campaign.challenges[foundChallengeIndex];
            const newChallenge = {
              ...challenge,
              status,
              isCompleted: status === EUserChallengeStatus.COMPLETE,
            };
            console.log('newChallenge', newChallenge);

            console.log(
              'newChallenges',
              replaceArrayElementByIndex(campaign.challenges, foundChallengeIndex, newChallenge),
            );
            const newCampaign = {
              ...campaign,
              challenges: replaceArrayElementByIndex(
                campaign.challenges,
                foundChallengeIndex,
                newChallenge,
              ),
            };
            const newData = replaceArrayElementByIndex(pre, foundIndex, newCampaign);
            console.log('newData' + status, newData);
            return newData;
          }
        }
        return pre;
      });
    });
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
    updateOneRecord,
  };
};

export default useInfiniteCampaignQueryWithQueue;
