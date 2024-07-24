import { useEffect, useState } from 'react';
import GiftIcon from 'src/assets/icons/campaigns/gift-icon.png';
import MereoLogo from 'src/assets/icons/campaigns/mereo-logo-white.png';
import useInfinitePageQuery from 'src/hooks/useInfiniteQuery';
import { useGetFanRewardsQuery, useRedeemRewardMutation } from 'src/store/slices/campaign/api';
import { ERewardType, EUserRewardStatus, FanRewardsItem } from 'src/store/slices/campaign/types';
import RewardsList from './RewardsList';
import { Button, Grid } from 'antd';
import ModalComponent from 'src/components/Modals';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import { useTranslation } from 'react-i18next';
import BackMobileIcon from 'src/assets/icons/common/arrow-left.svg?react';
import { BackIcon } from 'src/assets/icons';

const { useBreakpoint } = Grid;

const FanRewardTab = () => {
  const [selectedReward, setSelectedReward] = useState<FanRewardsItem>();
  const [openRedeem, setOpenRedeem] = useState<boolean>(false);
  const [redeemCode, setRedeemCode] = useState<string>();
  const [redeemReward] = useRedeemRewardMutation();
  const breakpoint = useBreakpoint();
  const { t } = useTranslation('campaigns');

  const { combinedData, loadMore } = useInfinitePageQuery<FanRewardsItem>({
    useGetDataListQuery: useGetFanRewardsQuery,
    params: {
      limit: 20,
      direction: 'DESC',
      sortBy: 'createdAt',
    },
  });

  useEffect(() => {
    setSelectedReward(combinedData?.[0]);
  }, [combinedData]);

  const onSelected = (data: FanRewardsItem) => {
    setSelectedReward(data);
  };

  const handleRedeemReward = async () => {
    if (selectedReward?.id) {
      const params = {
        userRewardId: selectedReward?.id,
      };
      const data = await redeemReward(params).unwrap();
      if (data?.data) {
        setRedeemCode(data?.data?.redeemCode);
        setOpenRedeem(true);
      }
    }
  };

  const onClose = () => {
    setOpenRedeem(false);
  };

  return (
    <div className="w-[100%] flex flex-col gap-[10px]">
      {selectedReward && (
        <div className="w-[100%] flex gap-[10px] ">
          <div className="bg-[#282828] w-[50%] h-[350px] flex items-center justify-center relative border-[6px] border-solid border-primary border-l-0 rounded-md rounded-tl-none rounded-bl-none">
            {selectedReward && (
              <div className="w-[70%] text-[10px] bg-primary h-[20px] absolute top-[16px] rounded-[100px] flex items-center justify-center">
                <span className="text-white">{selectedReward?.rewardInfo?.rarity}</span>
              </div>
            )}

            <div className="flex justify-center flex-col items-center">
              <img src={GiftIcon} />
              <img src={MereoLogo} />
            </div>
            {selectedReward?.status === EUserRewardStatus.DISTRIBUTED && (
              <div className="absolute bottom-[0] right-[5px] uppercase">
                <span className="text-white text-[10px] tracking-[2px]">{t('tradable')}</span>
              </div>
            )}
          </div>
          <div className="grow flex flex-col gap-[20px]">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[2px]">{t('reward')}</span>
              <span className="text-[14px]">
                {selectedReward?.rewardInfo.type === ERewardType.REDEEMABLE_ITEM
                  ? selectedReward?.rewardInfo?.item
                  : t('discountCode')}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[2px]">{t('campaign')}</span>
              <span className="text-[14px]">{selectedReward?.campaign?.name}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[2px]">{t('dateRedeemed')}</span>
              <span className="text-[14px]">{t('discountCode')}</span>
            </div>
            {selectedReward?.rewardInfo.type !== ERewardType.REDEEMABLE_ITEM && (
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[2px]">{t('promoCode')}</span>
                <span className="text-[14px]">{t('discountCode')}</span>
              </div>
            )}

            {selectedReward?.status === EUserRewardStatus.DISTRIBUTED &&
              selectedReward?.rewardInfo.type === ERewardType.REDEEMABLE_ITEM && (
                <div className="mt-auto flex justify-center">
                  <Button
                    className="!bg-primary min-w-[160px]"
                    type="primary"
                    onClick={handleRedeemReward}
                  >
                    {t('redeemItem')}
                  </Button>
                </div>
              )}
          </div>
        </div>
      )}
      <RewardsList
        data={combinedData}
        loadMore={loadMore}
        onSelected={onSelected}
        selectedReward={selectedReward}
      />

      <ModalComponent
        centered
        open={openRedeem}
        zIndex={70}
        width={684}
        isClose={true}
        className="relative modal-container-mobile-v2"
        onCancel={onClose}
      >
        {!breakpoint?.md ? (
          <BackMobileIcon className="absolute top-6 left-5 z-10" onClick={onClose} />
        ) : (
          <button onClick={onClose} className="btn back">
            <BackIcon />
          </button>
        )}

        <div className="full-height switch-account-modal flex flex-col items-center justify-between py-[20px] md:h-[auto]">
          <div className="max-w-[448px] md:mb-[60px]">
            <p className="text-center text-[24px] text-[#121313]">{t('redeemReward')}</p>
            <p className="text-center text-[16px] px-[16px]">{t('redeemIntructions')}</p>
            <p className="text-center text-[28px] pt-[100px]">{redeemCode || ''}</p>
          </div>
          <div>
            <ButtonContained
              buttonType="type2"
              fullWidth
              className="my-2.5 !w-[212px] !md:w-[212px]"
              onClick={onClose}
            >
              {t('buttonClose')}
            </ButtonContained>
          </div>
        </div>
      </ModalComponent>
    </div>
  );
};

export default FanRewardTab;
