import { Image } from 'antd';
import RewardImg from 'src/assets/icons/campaigns/reward.png';
import { CampaignItemRes, ERewardType } from 'src/store/slices/campaign/types';

import ChallengeItem from './ChallengeItem';
import { useTranslation } from 'react-i18next';
import { EUserChallengeStatus } from 'src/socket/BaseSocket';
interface Props {
  data: CampaignItemRes;
  onUpdateChallengeStatus: (
    campaignId: number,
    challengeId: number,
    status: EUserChallengeStatus,
  ) => void;
  isGoingOn: boolean;
}

const convertRewardData = (type: ERewardType, value: string) => {
  if (type === ERewardType.DISCOUNTED_TICKET) {
    return value + '%';
  }
  return value;
};

const CardContent = ({ data, onUpdateChallengeStatus, isGoingOn }: Props) => {
  const { t } = useTranslation('campaigns');
  return (
    <div>
      <div>
        {data?.reward && (
          <div className="flex gap-[6px] items-center px-[10px] py-[10px] reward-bg">
            <Image
              style={{
                background: 'black',
              }}
              width={30}
              height={30}
              src={RewardImg}
              preview={false}
            />
            <div className="flex flex-col">
              <span className="text-[10px]">{t('reward')}</span>
              <span className="text-[12px]">
                {data?.reward?.type}: {convertRewardData(data?.reward?.type, data?.reward?.item)}
              </span>
            </div>
          </div>
        )}

        {data.challenges.map((item) => {
          return (
            <ChallengeItem
              disabled={!isGoingOn}
              onUpdateChallengeStatus={onUpdateChallengeStatus}
              campaignData={data}
              data={item}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CardContent;
