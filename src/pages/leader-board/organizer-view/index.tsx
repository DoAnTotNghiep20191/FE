import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import { S40118 } from 'src/constants/errorCode';
import useInfinitePageQuery from 'src/hooks/useInfiniteQuery';
import {
  useGetLeaderBoardByIdQuery,
  useGetListCampaignQuery,
  useOrganizerRedeemRewardMutation,
} from 'src/store/slices/campaign/api';
import {
  CampaignItemRes,
  LeaderBoardRes,
  OrganizerRedeemRewardParams,
  ParamsLeaderBoardById,
} from 'src/store/slices/campaign/types';
import LeaderBoardHeader from '../components/leader-boad-header';
import RankItem from '../components/rank-item';
import TopLeader from '../components/top-leader';
import RedeemRewardModal from '../modals/redeem-reward';

const GET_ALL = 10000000;

const OrganizerLeaderBoard = () => {
  const { t } = useTranslation('campaigns');
  const [openRedeemReward, setOpenRedeemReward] = useState(false);
  const [rewardMembers, setRewardMembers] = useState(false);
  const { data: listCampaign } = useGetListCampaignQuery({
    limit: GET_ALL,
    isFan: false,
    sortBy: 'startDate',
    direction: 'DESC',
  });
  const [campaignId, setCampaignId] = useState<number | undefined>(undefined);
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const [isErrorCode, setIsErrorCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [redeemReward] = useOrganizerRedeemRewardMutation();

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
      showRewarded: rewardMembers,
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

  const onCancel = () => {
    setCode('');
    setStep(1);
    setOpenRedeemReward(false);
  };

  const handleChangeCode = (code: string) => {
    setCode(code);
    setIsErrorCode(false);
  };

  const handleVerifyCode = async () => {
    try {
      setIsLoading(true);
      const data: OrganizerRedeemRewardParams = {
        campaignId: campaignId!,
        redeemCode: code,
      };
      await redeemReward(data).unwrap();
      setStep(2);
    } catch (error: any) {
      const validator_errors = error?.data?.validator_errors;

      setIsErrorCode(true);
      if (validator_errors === S40118) {
        setStep(3);
      }
    } finally {
      setIsLoading(false);
    }
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
        <ButtonContained
          buttonType={`${rewardMembers ? 'type7' : 'type2'}`}
          className="h-[30px] mt-9"
          onClick={() => setRewardMembers(!rewardMembers)}
        >
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
      {rewardMembers && (
        <ButtonContained className="my-4" onClick={() => setOpenRedeemReward(true)}>
          {t('redeemReward')}
        </ButtonContained>
      )}
      <RedeemRewardModal
        open={openRedeemReward}
        onCancel={onCancel}
        code={code}
        isErrorCode={isErrorCode}
        step={step}
        onChangeCode={handleChangeCode}
        onRedeemCode={handleVerifyCode}
        isLoading={isLoading}
        reward={campaign?.reward}
      />
    </div>
  );
};

export default OrganizerLeaderBoard;
