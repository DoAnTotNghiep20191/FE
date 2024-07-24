import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  LogoFacebook,
  LogoInstagram,
  LogoSpotify,
  LogoTiktok,
  LogoTwitter,
  LogoYoutube,
  RewardLogo,
} from 'src/assets/icons';
import {
  ChallengeItemRes,
  ECampaignStatus,
  ERewardType,
  ESocialNetworkingLoginMethod,
  RewardCampaignItemRes,
} from 'src/store/slices/campaign/types';
import EmptyCampaign from 'src/assets/icons/campaigns/empty-campaign-logo.svg';

import './styles.scss';
interface CardItemProps {
  challenges?: ChallengeItemRes[];
  reward?: RewardCampaignItemRes;
  status?: ECampaignStatus;
  onAddChallenge?: () => void;
}

const socialIcons: { [key in ESocialNetworkingLoginMethod]: string } = {
  [ESocialNetworkingLoginMethod.X]: LogoTwitter,
  [ESocialNetworkingLoginMethod.YOU_TUBE]: LogoYoutube,
  [ESocialNetworkingLoginMethod.SPOTIFY]: LogoSpotify,
  [ESocialNetworkingLoginMethod.TIKTOK]: LogoTiktok,
  [ESocialNetworkingLoginMethod.FACEBOOK]: LogoFacebook,
  [ESocialNetworkingLoginMethod.INSTAGRAM]: LogoInstagram,
  [ESocialNetworkingLoginMethod.SHOPIFY]: LogoInstagram,
};

const altTexts: { [key in ESocialNetworkingLoginMethod]: string } = {
  [ESocialNetworkingLoginMethod.X]: 'X',
  [ESocialNetworkingLoginMethod.YOU_TUBE]: 'YouTube',
  [ESocialNetworkingLoginMethod.SPOTIFY]: 'Spotify',
  [ESocialNetworkingLoginMethod.TIKTOK]: 'TikTok',
  [ESocialNetworkingLoginMethod.FACEBOOK]: 'Facebook',
  [ESocialNetworkingLoginMethod.INSTAGRAM]: 'Instagram',
  [ESocialNetworkingLoginMethod.SHOPIFY]: 'Shopify',
};

const CardItem: React.FC<CardItemProps> = (props) => {
  const { challenges, reward, status, onAddChallenge } = props;
  const { t } = useTranslation('campaigns');

  const renderImageSocial = (type: ESocialNetworkingLoginMethod) => {
    const logo = socialIcons[type];
    const altText = altTexts[type];

    if (!logo) return null;

    return (
      <div className="w-[29px] h-[29px] bg-black flex justify-center items-center">
        <img src={logo} className="w-[16px] h-[16px]" alt={altText} />
      </div>
    );
  };

  return (
    <>
      {reward && (
        <div className="ml-3 card-reward-item">
          <div className="flex items-center">
            <RewardLogo />

            <div className="flex flex-col">
              <span className="card-reward-item__label ml-1">Reward</span>
              <span className="card-reward-item__label ml-1">
                {reward?.type === ERewardType.DISCOUNTED_TICKET
                  ? t('discountedTicketNumber', { item: reward?.item })
                  : t('customRewardItem', { item: reward?.item })}
              </span>
            </div>
          </div>
        </div>
      )}
      {(challenges?.length || 0) <= 0 && status === ECampaignStatus.DRAFT && (
        <div onClick={onAddChallenge} className={`ml-3 card-item mb-4}`}>
          <div className="flex items-center">
            <div className="w-[29px] h-[29px] bg-black flex justify-center items-center">
              <img src={EmptyCampaign} className="w-[16px] h-[16px]" />
            </div>
            <div className="flex flex-col">
              <span className="card-item__label ml-1">{'Challenge'}</span>
              <span className="card-item__label ml-1">{'Add challenge(s)'}</span>
            </div>
          </div>
        </div>
      )}
      {challenges?.map((task: ChallengeItemRes, index: number) => (
        <div
          key={index}
          className={`ml-3 card-item ${challenges.length - 1 === index ? 'mb-4' : ''}`}
        >
          <div className="flex items-center">
            {renderImageSocial(task.socialPlatform)}
            <div className="flex flex-col">
              <span className="card-item__label ml-1">{task.difficulty}</span>
              <span className="card-item__label ml-1">{task.type}</span>
            </div>
          </div>
          <div className="card-item__label">
            {t('userComplete', { completedUsers: task.completedUsers })}
          </div>
        </div>
      ))}
    </>
  );
};

export default CardItem;
