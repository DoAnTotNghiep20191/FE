import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import CampaignList from './CampaignList';
import Statistics from './Statistics';
import AchievementList from './AchievementList';
import {
  useGetAchievementDetailQuery,
  useGetFanAchievementsQuery,
  useGetListCampaignQuery,
} from 'src/store/slices/campaign/api';
import { CampaignItemRes, ECampaignViewStatus } from 'src/store/slices/campaign/types';
import { useHistory, useLocation } from 'react-router-dom';
import eventBus from 'src/socket/event-bus';
import { ESocketEvent } from 'src/socket/SocketEvent';
import { usePublicPostVerifyModal } from 'src/components/ContextProvider/PublicPostVerifyProvider';
import {
  EUserChallengeStatus,
  EVerifyUserChallengeStatus,
  IChallengeVerifyResult,
} from 'src/socket/BaseSocket';
import useInfiniteQueryWithQueue from 'src/hooks/useInfiniteQueryWithQueue';
import { ToastMessage } from 'src/components/Toast';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';

const FanCampaign = () => {
  const location = useLocation();
  const [showAchievements, setShowAchievements] = useState(false);
  const [selectedAchievementId, setSelectedAchievementId] = useState<string | null>(null);

  const [isViewPastCampaign, setIsViewPastCampaign] = useState(false);
  const { setOpenModal, selectedChallenge, setLoading } = usePublicPostVerifyModal();
  const [searchValue, setSearchValue] = useState('');
  const [valueDebounce, setValueDebounce] = useState('');
  const { t } = useTranslation();

  const { data, refetch } = useGetFanAchievementsQuery({
    limit: 1000,
    page: 1,
    sortBy: 'createdAt',
    direction: 'DESC',
    statuses: ['Deployed'],
  });

  const { data: achievementRes } = useGetAchievementDetailQuery(selectedAchievementId || '', {
    skip: selectedAchievementId === null,
  });

  const history = useHistory();

  const { combinedData, loadMore, refresh, updateOneRecord, resetPage } = useInfiniteQueryWithQueue(
    {
      useGetDataListQuery: useGetListCampaignQuery,
      params: {
        limit: 10,
        viewStatus: isViewPastCampaign
          ? [ECampaignViewStatus.PAST]
          : [ECampaignViewStatus.ONGOING, ECampaignViewStatus.UPCOMING],
        search: valueDebounce,
        sortBy: isViewPastCampaign ? 'endDate' : 'startDate',
        direction: isViewPastCampaign ? 'DESC' : 'ASC',
        isFan: true,
      },
      queueId: 'fan-campaign-queue',
    },
  );

  const handleShowAchievements = () => {
    const searchParams = new URLSearchParams(location.search);
    const achievementId = searchParams.get('id');
    if (achievementId) {
      searchParams.set('achievement', 'true');
      searchParams.delete('id');
      setSelectedAchievementId(null);
    } else {
      searchParams.set('achievement', (!showAchievements).toString());
      setShowAchievements(!showAchievements);
    }
    history.replace({ pathname: location.pathname, search: searchParams.toString() });
  };

  const handleViewPastCampaign = () => {
    refresh();
    setIsViewPastCampaign(!isViewPastCampaign);
  };

  useLayoutEffect(() => {
    const searchParam = new URLSearchParams(location.search);
    const showAchievements = searchParam.get('achievement');
    const achievementId = searchParam.get('id');

    if (showAchievements === 'true') {
      setShowAchievements(true);
    }

    if (achievementId) {
      setSelectedAchievementId(achievementId);
    }
  }, []);

  const handleVerifyChallengeResult = (data: IChallengeVerifyResult) => {
    if (
      data.campaignId === selectedChallenge?.campaign.id &&
      data.challengeId === selectedChallenge?.challenge.id
    ) {
      if (data.status === EVerifyUserChallengeStatus.VERIFYING) {
        setOpenModal(false);
        setLoading(false);
      }
      if (data.status === EVerifyUserChallengeStatus.SUCCESS) {
        setOpenModal(false);
        setLoading(false);
      }
    }
    if (data.status === EVerifyUserChallengeStatus.FAILED) {
      ToastMessage.error(
        `${data.campaignName} - ’${data.challengeType}’ not completed. Complete the challenge and try again.`,
      );
      updateOneRecord(data.campaignId, data.challengeId, EUserChallengeStatus.FAILED);
    }

    if (data.status === EVerifyUserChallengeStatus.VERIFYING) {
      updateOneRecord(data.campaignId, data.challengeId, EUserChallengeStatus.VERIFYING);
    }

    if (data.status === EVerifyUserChallengeStatus.SUCCESS) {
      updateOneRecord(data.campaignId, data.challengeId, EUserChallengeStatus.COMPLETE);
    }
  };

  useEffect(() => {
    eventBus.on(ESocketEvent.VerifyChallengeResult, handleVerifyChallengeResult);

    return () => {
      eventBus.remove(ESocketEvent.VerifyChallengeResult, handleVerifyChallengeResult);
    };
  }, [selectedChallenge]);

  const handleSearchChange = async (value: string) => {
    resetPage();
    setValueDebounce(value);
  };

  const debounceHandler = useCallback(debounce(handleSearchChange, 500), []);

  useEffect(() => {
    refetch();
  }, [showAchievements]);

  return (
    <div className="flex flex-col gap-[10px]">
      {!showAchievements ? (
        <>
          <Statistics
            totalAchievement={data?.metadata?.total || 0}
            searchValue={searchValue}
            isViewPastCampaign={isViewPastCampaign}
            onViewPastCampaign={handleViewPastCampaign}
            onShowAchievement={handleShowAchievements}
            onSearch={(val) => {
              debounceHandler(val);
              setSearchValue(val);
            }}
          />
          {combinedData.length > 0 ? (
            <CampaignList
              onUpdateChallengeStatus={updateOneRecord}
              data={(combinedData as CampaignItemRes[]) || []}
              loadMore={loadMore}
            />
          ) : valueDebounce ? (
            <p className="text-[16px] italic font-extralight text-center">
              {valueDebounce
                ? t('common.noResultsFoundFor', { search: valueDebounce })
                : t('common.noData')}
            </p>
          ) : (
            <></>
          )}
        </>
      ) : (
        <AchievementList
          selectedAchievementId={selectedAchievementId || ''}
          totalAchievements={data?.metadata?.total || 0}
          listAchievement={data?.data || []}
          onBack={handleShowAchievements}
          onSelectedAchievementChange={(id) => {
            setSelectedAchievementId(id);
            const searchParams = new URLSearchParams(location.search);
            searchParams.set('id', id);
            history.replace({ pathname: location.pathname, search: searchParams.toString() });
          }}
          selectedAchievement={achievementRes?.data || null}
        />
      )}
    </div>
  );
};

export default FanCampaign;
