import {
  CampaignItemRes,
  ChallengeItemRes,
  EChallengeType,
  ESocialNetworkPlatform,
  ESocialNetworkingLoginMethod,
} from 'src/store/slices/campaign/types';
import {
  LogoFacebook,
  LogoInstagram,
  LogoSpotify,
  LogoTiktok,
  LogoTwitter,
  LogoYoutube,
} from 'src/assets/icons';
import { Button } from 'antd';
import {
  useFanExecuteChallengeMutation,
  useFanVerifyChallengeMutation,
} from 'src/store/slices/campaign/api';
import { useState } from 'react';
import { usePublicPostVerifyModal } from 'src/components/ContextProvider/PublicPostVerifyProvider';
import { EUserChallengeStatus } from 'src/socket/BaseSocket';
import { TFunction, useTranslation } from 'react-i18next';
import TicketIcon from 'src/assets/icons/campaigns/ticket-icon.svg';
import { useAppDispatch, useAppSelector } from 'src/store';
import { getUserInfo } from 'src/store/selectors/user';
import { setOpenSignIn } from 'src/store/slices/auth';

const socialIcons: { [key in ESocialNetworkPlatform]: string } = {
  [ESocialNetworkPlatform.X]: LogoTwitter,
  [ESocialNetworkPlatform.YOU_TUBE]: LogoYoutube,
  [ESocialNetworkPlatform.SPOTIFY]: LogoSpotify,
  [ESocialNetworkPlatform.TIKTOK]: LogoTiktok,
  [ESocialNetworkPlatform.FACEBOOK]: LogoFacebook,
  [ESocialNetworkPlatform.INSTAGRAM]: LogoInstagram,
  [ESocialNetworkPlatform.MEREO_TICKET]: TicketIcon,
  [ESocialNetworkPlatform.SHOPIFY]: TicketIcon,
};

const altTexts: { [key in ESocialNetworkPlatform]: string } = {
  [ESocialNetworkPlatform.X]: 'X',
  [ESocialNetworkPlatform.YOU_TUBE]: 'YouTube',
  [ESocialNetworkPlatform.SPOTIFY]: 'Spotify',
  [ESocialNetworkPlatform.TIKTOK]: 'TikTok',
  [ESocialNetworkPlatform.FACEBOOK]: 'Facebook',
  [ESocialNetworkPlatform.INSTAGRAM]: 'Instagram',
  [ESocialNetworkPlatform.MEREO_TICKET]: 'Mereo ticket',
  [ESocialNetworkPlatform.SHOPIFY]: 'Shopify',
};
const challengeLoginMap = {
  [ESocialNetworkingLoginMethod.FACEBOOK]: (loginUrl: string) => {
    window.open(loginUrl, 'login', 'popup=true, height=600,width=600');
  },
  [ESocialNetworkingLoginMethod.INSTAGRAM]: (loginUrl: string) => {
    window.open(loginUrl, 'login', 'popup=true, height=600,width=600');
  },
  [ESocialNetworkingLoginMethod.X]: (loginUrl: string) => {
    window.open(loginUrl, 'login', 'popup=true, height=600,width=600');
  },
  [ESocialNetworkingLoginMethod.TIKTOK]: (loginUrl: string) => {
    window.open(loginUrl, 'login', 'popup=true, height=600,width=600');
  },
  [ESocialNetworkingLoginMethod.SPOTIFY]: (loginUrl: string) => {
    window.open(loginUrl, 'login', 'popup=true, height=600,width=600');
  },
  [ESocialNetworkingLoginMethod.YOU_TUBE]: (loginUrl: string) => {
    window.open(loginUrl, 'login', 'popup=true, height=600,width=600');
  },
  [ESocialNetworkingLoginMethod.SHOPIFY]: () => {
    // window.open(loginUrl, 'login', 'popup=true, height=600,width=600');
  },
};

const challengeTypesText = {
  [EChallengeType.PUBLIC_POST_WITH_HASHTAG]: (
    t: TFunction<'campaigns', undefined>,
    hashTag?: string,
  ) => {
    return t('PUBLIC_POST_WITH_HASHTAG') + ' ' + hashTag;
  },
  [EChallengeType.PUBLIC_VIDEO_WITH_HASHTAG]: (
    t: TFunction<'campaigns', undefined>,
    hashTag?: string,
  ) => {
    return t('PUBLIC_VIDEO_WITH_HASHTAG') + ' ' + hashTag;
  },
  [EChallengeType.ARTIST_TOP_1]: (t: TFunction<'campaigns', undefined>) => {
    return t('ARTIST_TOP_1');
  },
  [EChallengeType.ARTIST_TOP_10]: (t: TFunction<'campaigns', undefined>) => {
    return t('ARTIST_TOP_10');
  },
  [EChallengeType.CHECK_IN_LOCATION]: (t: TFunction<'campaigns', undefined>) => {
    return t('CHECK_IN_LOCATION');
  },
  [EChallengeType.COMMENT_POST]: (t: TFunction<'campaigns', undefined>) => {
    return t('COMMENT_POST');
  },
  [EChallengeType.FAVORITE_SONG]: (t: TFunction<'campaigns', undefined>) => {
    return t('FAVORITE_SONG');
  },
  [EChallengeType.FOLLOW_ARTIST]: (t: TFunction<'campaigns', undefined>) => {
    return t('FOLLOW_ARTIST');
  },
  [EChallengeType.FOLLOW_USER]: (t: TFunction<'campaigns', undefined>) => {
    return t('FOLLOW_USER');
  },
  [EChallengeType.LIKE]: (t: TFunction<'campaigns', undefined>) => {
    return t('LIKE');
  },
  [EChallengeType.LISTEN_SONG]: (t: TFunction<'campaigns', undefined>) => {
    return t('LISTEN_SONG');
  },
  [EChallengeType.PURCHASE_TICKET]: (t: TFunction<'campaigns', undefined>) => {
    return t('PURCHASE_TICKET');
  },
  [EChallengeType.REPOST]: (t: TFunction<'campaigns', undefined>) => {
    return t('REPOST');
  },
  [EChallengeType.SHARE]: (t: TFunction<'campaigns', undefined>) => {
    return t('SHARE');
  },
  [EChallengeType.SUBSCRIBE]: (t: TFunction<'campaigns', undefined>) => {
    return t('SUBSCRIBE');
  },
  [EChallengeType.WATCH_VIDEO]: (t: TFunction<'campaigns', undefined>) => {
    return t('WATCH_VIDEO');
  },
  [EChallengeType.PURCHASE_MERCHANDISE]: (t: TFunction<'campaigns', undefined>) => {
    return t('PURCHASE_TICKET');
  },
};

const shortChallengeButtonText = {
  [EChallengeType.PUBLIC_POST_WITH_HASHTAG]: (t: TFunction<'campaigns', undefined>) => {
    return t('post');
  },
  [EChallengeType.PUBLIC_VIDEO_WITH_HASHTAG]: (t: TFunction<'campaigns', undefined>) => {
    return t('post');
  },
  [EChallengeType.ARTIST_TOP_1]: (t: TFunction<'campaigns', undefined>) => {
    return t('Listen');
  },
  [EChallengeType.ARTIST_TOP_10]: (t: TFunction<'campaigns', undefined>) => {
    return t('Listen');
  },
  [EChallengeType.CHECK_IN_LOCATION]: (t: TFunction<'campaigns', undefined>) => {
    return t('checkin');
  },
  [EChallengeType.COMMENT_POST]: (t: TFunction<'campaigns', undefined>) => {
    return t('comment');
  },
  [EChallengeType.FAVORITE_SONG]: (t: TFunction<'campaigns', undefined>) => {
    return t('favorite');
  },
  [EChallengeType.FOLLOW_ARTIST]: (t: TFunction<'campaigns', undefined>) => {
    return t('follow');
  },
  [EChallengeType.FOLLOW_USER]: (t: TFunction<'campaigns', undefined>) => {
    return t('follow');
  },
  [EChallengeType.LIKE]: (t: TFunction<'campaigns', undefined>) => {
    return t('LIKE');
  },
  [EChallengeType.LISTEN_SONG]: (t: TFunction<'campaigns', undefined>) => {
    return t('listen');
  },
  [EChallengeType.PURCHASE_TICKET]: (t: TFunction<'campaigns', undefined>) => {
    return t('purchase');
  },
  [EChallengeType.REPOST]: (t: TFunction<'campaigns', undefined>) => {
    return t('repost');
  },
  [EChallengeType.SHARE]: (t: TFunction<'campaigns', undefined>) => {
    return t('share');
  },
  [EChallengeType.SUBSCRIBE]: (t: TFunction<'campaigns', undefined>) => {
    return t('subscribe');
  },
  [EChallengeType.WATCH_VIDEO]: (t: TFunction<'campaigns', undefined>) => {
    return t('watch');
  },
  [EChallengeType.PURCHASE_MERCHANDISE]: (t: TFunction<'campaigns', undefined>) => {
    return t('purchase');
  },
};

const hashTagChallenges = [
  EChallengeType.PUBLIC_POST_WITH_HASHTAG,
  EChallengeType.PUBLIC_VIDEO_WITH_HASHTAG,
];

interface Props {
  data: ChallengeItemRes;
  campaignData: CampaignItemRes;
  onUpdateChallengeStatus: (
    campaignId: number,
    challengeId: number,
    status: EUserChallengeStatus,
  ) => void;
  disabled?: boolean;
}

const ChallengeItem = ({ data, campaignData, onUpdateChallengeStatus, disabled }: Props) => {
  const [failedNumber, setFailedNumber] = useState(0);
  const userInfo = useAppSelector(getUserInfo);
  const dispatch = useAppDispatch();
  const [executeChallenge] = useFanExecuteChallengeMutation();
  const [fanVerifyChallenge] = useFanVerifyChallengeMutation();
  const { setOpenModal, setSelectedChallenge } = usePublicPostVerifyModal();

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
  const handleExecuteChallenge = async (challenge: ChallengeItemRes) => {
    try {
      if (!userInfo) {
        dispatch(setOpenSignIn(true));
        return;
      }

      const response = await executeChallenge({
        campaignId: campaignData.id,
        challengeId: challenge.id,
      }).unwrap();

      if (response.data.isLoginNeed) {
        if (challengeLoginMap[challenge.socialPlatform]) {
          challengeLoginMap[challenge.socialPlatform](response.data.socialLoginUrl);
        }
      } else if (response.data.challengeUrl) {
        onUpdateChallengeStatus(campaignData.id, challenge.id, EUserChallengeStatus.INIT);
        window.open(response.data.challengeUrl, 'login', 'popup=true, height=600,width=600');
      } else if (hashTagChallenges.includes(challenge.type)) {
        setSelectedChallenge({
          challenge,
          campaign: campaignData,
          hashTag: challenge.hashTag,
        });
        setOpenModal(true);
      } else if (challenge.type === EChallengeType.PURCHASE_TICKET) {
        window.open('/events/' + response.data.eventId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFanVerifyChallenge = async (
    campaignData: CampaignItemRes,
    challenge: ChallengeItemRes,
  ) => {
    try {
      await fanVerifyChallenge({
        campaignId: campaignData.id,
        challengeId: challenge.id,
      }).unwrap();
    } catch (error) {
      if (failedNumber < 3) {
        setFailedNumber(failedNumber + 1);
      } else {
        setFailedNumber(0);
      }
      console.error(error);
    }
  };

  const verifyChallengeMap = {
    [EChallengeType.PUBLIC_POST_WITH_HASHTAG]: (
      campaign: CampaignItemRes,
      challenge: ChallengeItemRes,
      hashTag?: string,
    ) => {
      setSelectedChallenge({
        challenge,
        campaign,
        hashTag,
      });
      setOpenModal(true);
    },
    [EChallengeType.PUBLIC_VIDEO_WITH_HASHTAG]: (
      campaign: CampaignItemRes,
      challenge: ChallengeItemRes,
      hashTag?: string,
    ) => {
      setSelectedChallenge({ challenge, campaign, hashTag });
      setOpenModal(true);
    },
    [EChallengeType.ARTIST_TOP_1]: (campaign: CampaignItemRes, challenge: ChallengeItemRes) => {
      handleFanVerifyChallenge(campaign, challenge);
    },
    [EChallengeType.ARTIST_TOP_10]: (campaign: CampaignItemRes, challenge: ChallengeItemRes) => {
      handleFanVerifyChallenge(campaign, challenge);
    },
    [EChallengeType.CHECK_IN_LOCATION]: (
      campaign: CampaignItemRes,
      challenge: ChallengeItemRes,
    ) => {
      handleFanVerifyChallenge(campaign, challenge);
    },
    [EChallengeType.COMMENT_POST]: (campaign: CampaignItemRes, challenge: ChallengeItemRes) => {
      handleFanVerifyChallenge(campaign, challenge);
    },
    [EChallengeType.FAVORITE_SONG]: (campaign: CampaignItemRes, challenge: ChallengeItemRes) => {
      handleFanVerifyChallenge(campaign, challenge);
    },
    [EChallengeType.FOLLOW_ARTIST]: (campaign: CampaignItemRes, challenge: ChallengeItemRes) => {
      handleFanVerifyChallenge(campaign, challenge);
    },
    [EChallengeType.FOLLOW_USER]: (campaign: CampaignItemRes, challenge: ChallengeItemRes) => {
      handleFanVerifyChallenge(campaign, challenge);
    },
    [EChallengeType.LIKE]: (campaign: CampaignItemRes, challenge: ChallengeItemRes) => {
      handleFanVerifyChallenge(campaign, challenge);
    },
    [EChallengeType.LISTEN_SONG]: (campaign: CampaignItemRes, challenge: ChallengeItemRes) => {
      handleFanVerifyChallenge(campaign, challenge);
    },
    [EChallengeType.PURCHASE_TICKET]: (campaign: CampaignItemRes, challenge: ChallengeItemRes) => {
      handleFanVerifyChallenge(campaign, challenge);
    },
    [EChallengeType.REPOST]: (campaign: CampaignItemRes, challenge: ChallengeItemRes) => {
      handleFanVerifyChallenge(campaign, challenge);
    },
    [EChallengeType.SHARE]: (campaign: CampaignItemRes, challenge: ChallengeItemRes) => {
      handleFanVerifyChallenge(campaign, challenge);
    },
    [EChallengeType.SUBSCRIBE]: (campaign: CampaignItemRes, challenge: ChallengeItemRes) => {
      handleFanVerifyChallenge(campaign, challenge);
    },
    [EChallengeType.WATCH_VIDEO]: (campaign: CampaignItemRes, challenge: ChallengeItemRes) => {
      handleFanVerifyChallenge(campaign, challenge);
    },
    [EChallengeType.PURCHASE_MERCHANDISE]: (
      campaign: CampaignItemRes,
      challenge: ChallengeItemRes,
    ) => {
      handleFanVerifyChallenge(campaign, challenge);
    },
  };

  const handleVerifyChallenge = async (challenge: ChallengeItemRes) => {
    verifyChallengeMap[challenge.type](campaignData, challenge, challenge.hashTag);
  };

  return (
    <div key={data.id} className="item-bg p-[10px] flex justify-between">
      <div className="flex items-center gap-[5px]">
        {renderImageSocial(data.socialPlatform)}
        <div className="flex flex-col">
          <span className="text-[10px]">{data.difficulty}</span>
          <span className="text-[12px]">
            {t(`${challengeTypesText[data.type](t, data.hashTag)}`)}
          </span>
        </div>
      </div>
      <div>
        {data.status === EUserChallengeStatus.COMPLETE && (
          <Button className="!bg-gray4 !text-white min-w-[100px]" type="primary" disabled>
            {t('redeemed')}
          </Button>
        )}

        {data.status === EUserChallengeStatus.VERIFYING && (
          <Button className="!bg-gray4 !text-white min-w-[100px]" type="primary" disabled>
            {t('verifying')}
          </Button>
        )}

        {data.status === EUserChallengeStatus.INIT && (
          <Button
            disabled={disabled}
            onClick={() => {
              handleVerifyChallenge(data);
            }}
            className={`!bg-${disabled ? 'gray4' : 'primary'} min-w-[100px] !text-white`}
            type="primary"
          >
            {t('verify')}
          </Button>
        )}
        {(!data.status || data.status === EUserChallengeStatus.FAILED) && (
          <Button
            disabled={disabled}
            onClick={() => {
              handleExecuteChallenge(data);
            }}
            className={`!bg-${disabled ? 'gray4' : 'primary'} min-w-[100px] !text-white`}
            type="primary"
          >
            {shortChallengeButtonText[data.type] ? shortChallengeButtonText[data.type](t) : null}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChallengeItem;
