import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import useInfinitePageQuery from 'src/hooks/useInfiniteQuery';
import {
  useGetLeaderBoardByIdQuery,
  useGetListCampaignQuery,
  useGetPositionLeaderBoardQuery,
} from 'src/store/slices/campaign/api';
import {
  CampaignItemRes,
  ECampaignViewStatus,
  LeaderBoardRes,
  ParamsLeaderBoardById,
} from 'src/store/slices/campaign/types';
import LeaderBoardHeader from '../components/leader-boad-header';
import RankItem from '../components/rank-item';
import TopLeader from '../components/top-leader';
import MyRank from '../components/my-rank';

const GET_ALL = 10000000;

const FanLeaderBoard = () => {
  const { t } = useTranslation('campaigns');
  const { data: listCampaign } = useGetListCampaignQuery({
    limit: GET_ALL,
    isFan: true,
    sortBy: 'startDate',
    direction: 'DESC',
    viewStatus: [ECampaignViewStatus.ONGOING, ECampaignViewStatus.PAST],
  });
  const [campaignId, setCampaignId] = useState<number | undefined>(undefined);

  const { data: dataPositionLeaderBoard } = useGetPositionLeaderBoardQuery(
    { campaignId: campaignId! },
    { skip: campaignId ? false : true },
  );
  const {
    combinedData,
    loadMore,
    refresh: refreshLeaderBoard,
  } = useInfinitePageQuery<LeaderBoardRes>({
    useGetDataListQuery: useGetLeaderBoardByIdQuery,
    skip: campaignId ? false : true,
    params: {
      limit: 8,
      page: 1,
      campaignId,
      showRewarded: false,
    } as ParamsLeaderBoardById,
  });

  useEffect(() => {
    if (listCampaign && listCampaign.data.length > 0) {
      setCampaignId(listCampaign.data[0].id);
    }
  }, [listCampaign]);

  const campaign = listCampaign?.data.find(
    (item: CampaignItemRes) => Number(item?.id) === Number(campaignId),
  );

  // Default to the first campaign's name if the specific campaign is not found
  const campaignNameSelect = campaign?.name || listCampaign?.data[0]?.name || '';

  // Function to check if the campaign has ended
  const isCampaignEnded = (endDate: string): boolean => {
    return dayjs().isAfter(dayjs(endDate));
  };

  return (
    <div className="leader-board-layout flex flex-col justify-center items-center w-full">
      <LeaderBoardHeader
        listCampaign={listCampaign?.data}
        setCampaignId={setCampaignId}
        refresh={refreshLeaderBoard}
        campaignNameSelect={campaignNameSelect}
      />

      <TopLeader data={combinedData.slice(0, 3)} />
      {isCampaignEnded(campaign?.endDate || '') ? (
        <ButtonContained buttonType="type2" className="h-[30px] mt-9">
          <p className="text-[12px]">{t('rewardHaveDistributed')}</p>
        </ButtonContained>
      ) : (
        <ButtonContained buttonType="type2" className="h-[30px] mt-9 ">
          <p className="text-[12px]">{t('rewardsWillDistribute')}</p>
        </ButtonContained>
      )}

      <InfiniteScroll
        dataLength={combinedData.length - 3}
        hasMore={true}
        loader={null}
        next={loadMore}
        className="overflow-hidden"
      >
        {combinedData.slice(3, combinedData.length).map((item, index) => (
          <RankItem data={item} rank={index + 4} key={index} />
        ))}
      </InfiniteScroll>

      {dataPositionLeaderBoard?.data?.userRanking && (
        <MyRank data={dataPositionLeaderBoard?.data} />
      )}
    </div>
  );
};

export default FanLeaderBoard;
