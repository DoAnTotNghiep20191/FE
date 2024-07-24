import {
  CardEventImgDetail,
  LocationIcon,
  LockEventIcon,
  LogoInstagram,
  LogoTiktok,
  UnlockEventIcon,
  WatchIcon,
} from 'src/assets/icons';
import { Image } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';

import Map from '../Map';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { getMonthDateTime, renderStartEndDateTime } from 'src/helpers/formatValue';
import DividerLine from 'src/components/DividerLine';
import ArrowLeftIcon from 'src/assets/icons/common/arrow-left.svg?react';
import { PATHS } from 'src/constants/paths';
import { useGetHashtagsSocialQuery } from 'src/store/slices/app/api';
import { ResponseHasTag } from 'src/store/slices/app/types';
import { useAppSelector } from 'src/store';
import { getOldPath } from 'src/store/selectors/auth';
import { useTranslation } from 'react-i18next';
import TicketTooltip from 'src/components/Tooltip';
import useWindowSize from 'src/hooks/useWindowSize';
import { debounce } from 'lodash';
import CustomTab from './CustomTab';
import CampaignList from 'src/pages/campaigns/fan-view/components/campaigns/CampaignList';
import {
  EUserChallengeStatus,
  EVerifyUserChallengeStatus,
  IChallengeVerifyResult,
} from 'src/socket/BaseSocket';
import { replaceArrayElementByIndex } from 'src/helpers/array/replaceArrayElementByIndex';
import eventBus from 'src/socket/event-bus';
import { ESocketEvent } from 'src/socket/SocketEvent';
import { usePublicPostVerifyModal } from 'src/components/ContextProvider/PublicPostVerifyProvider';
import { ToastMessage } from 'src/components/Toast';
import useQueueLock from 'src/hooks/useQueueLock';

const desktopMaxWidthText = 450;

function textWidth(text: string) {
  const textElement = document.createElement('p');
  textElement.innerHTML = text;
  textElement.className = 'flex-1 text-[12px] w-fit';
  //if you have a parent element, append it here so it can inherit some necessary styles
  document.body.append(textElement);
  const width = textElement.clientWidth;
  textElement.remove();
  return width;
}

const CardEventDetail = (props: {
  event: any;
  children?: ReactNode;
  className?: string;
  isShowAllReview?: boolean;
  showCampaign?: boolean;
  onCampaignChanges?: (event: any) => void;
}) => {
  const history = useHistory();
  const { handleAddQueue } = useQueueLock({ id: 'event-challenge-queue' });

  const [addressWidth, setAddressWidth] = useState(0);
  const { pathname } = useLocation();
  const oldPath = useAppSelector(getOldPath);
  const { isMobile } = useWindowSize();

  const [activeKey, setActiveKey] = useState(1);

  const { setOpenModal, selectedChallenge, setLoading } = usePublicPostVerifyModal();

  const [listSocial, setListSocial] = useState<{
    instagram: ResponseHasTag[];
    tiktok: ResponseHasTag[];
  }>({
    instagram: [],
    tiktok: [],
  });

  const { t } = useTranslation();

  const { event, children, className = '', isShowAllReview, onCampaignChanges } = props;
  const { data: dataSocial } = useGetHashtagsSocialQuery({ id: event?.id }, { skip: !event });

  const handleGetSocialLink = async () => {
    if (dataSocial?.data && dataSocial?.data?.length > 0) {
      const listPostInstagram = await Promise.all(
        dataSocial?.data
          ?.filter((item) => item?.source === 'instagram')
          .map(async (item) => {
            try {
              await fetch(item.altThumbnailSrc);
              return item;
            } catch {
              return {
                ...item,
                altThumbnailSrc: '',
              };
            }
          }),
      );

      const listPostTikTok = await Promise.all(
        dataSocial?.data
          ?.filter((item: any) => item?.source === 'tiktok')
          .map(async (item) => {
            try {
              const url = await (await fetch(item.altThumbnailSrc)).json();
              return {
                ...item,
                altThumbnailSrc: url.thumbnail_url,
              };
            } catch (error) {
              return {
                ...item,
                altThumbnailSrc: null,
              };
            }
          }),
      );

      setListSocial({
        instagram: listPostInstagram?.filter((item) => !!item.altThumbnailSrc) || [],
        tiktok: listPostTikTok?.filter((item) => !!item.altThumbnailSrc) || [],
      });
    }
  };

  useEffect(() => {
    handleGetSocialLink();
  }, [dataSocial]);

  const startDateFormatted = useMemo(() => getMonthDateTime(event?.startTime), [event?.startTime]);

  const handleOpenLink = (link: string) => {
    window.open(link, '_bank');
  };

  const removeUTC = () => {
    const str = renderStartEndDateTime(event?.startTime, event?.endTime);
    const idx = str.indexOf('(UTC');
    return str.slice(0, idx);
  };

  const setWidthHandle = useCallback(
    debounce((width) => {
      setAddressWidth(width);
    }, 400),
    [],
  );

  useEffect(() => {
    setWidthHandle(textWidth(event?.location));
  }, [isMobile]);

  const handleUpdateOneRecord = (
    campaignId: number,
    challengeId: number,
    status: EUserChallengeStatus,
  ) => {
    handleAddQueue(() => {
      onCampaignChanges?.((preData: any) => {
        const campaignList = preData?.campaigns || [];
        const foundIndex = campaignList.findIndex((item: any) => item.id === campaignId);
        if (foundIndex !== -1) {
          const campaign = campaignList[foundIndex];
          const foundChallengeIndex = campaign.challenges.findIndex((item: any) => {
            return item.id === challengeId;
          });
          if (foundChallengeIndex !== -1) {
            const challenge = campaign.challenges[foundChallengeIndex];
            const newChallenge = {
              ...challenge,
              status,
              isCompleted: status === EUserChallengeStatus.COMPLETE,
            };
            const newCampaign = {
              ...campaign,
              challenges: replaceArrayElementByIndex(
                campaign.challenges,
                foundChallengeIndex,
                newChallenge,
              ),
            };
            const newData = replaceArrayElementByIndex(campaignList, foundIndex, newCampaign);
            return {
              ...preData,
              campaigns: newData || [],
            };
          }
        }
      });
    });
  };

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
      handleUpdateOneRecord(data.campaignId, data.challengeId, EUserChallengeStatus.FAILED);
    }

    if (data.status === EVerifyUserChallengeStatus.VERIFYING) {
      handleUpdateOneRecord(data.campaignId, data.challengeId, EUserChallengeStatus.VERIFYING);
    }

    if (data.status === EVerifyUserChallengeStatus.SUCCESS) {
      handleUpdateOneRecord(data.campaignId, data.challengeId, EUserChallengeStatus.COMPLETE);
    }
  };

  useEffect(() => {
    eventBus.on(ESocketEvent.VerifyChallengeResult, handleVerifyChallengeResult);

    return () => {
      eventBus.remove(ESocketEvent.VerifyChallengeResult, handleVerifyChallengeResult);
    };
  }, [selectedChallenge]);

  return (
    <div className={`w-full md:w-[676px] px-4 relative ${className}`}>
      {pathname.includes('events') && (
        <ArrowLeftIcon
          className="absolute top-[20px] md:top-[50px] left-[20px] cursor-pointer"
          onClick={() => history.push(oldPath || PATHS.events)}
        />
      )}
      <div className="w-full flex flex-col">
        <Image
          src={event?.image}
          alt="CardEventImg"
          className="rounded-t-[3px] w-full h-[172px] md:!h-full object-cover"
          rootClassName="w-[100%] md:h-[220px]"
          fallback={CardEventImgDetail}
          preview={false}
        />
        <div className="flex gap-[10px] bg-black1 p-[16px] items-center">
          <div className="w-[49px] h-[49px] flex items-center justify-center bg-black5B/40 rounded-[100px] flex-col">
            <p className="text-[14px] text-white font-normal">{startDateFormatted?.month}</p>
            <p className="text-[16px] text-white font-medium uppercase">
              {startDateFormatted?.date}
            </p>
          </div>
          <div>
            <p
              className="text-[20px] text-white font-bold event-title-with-overflow-wrap"
              title={event?.name}
            >
              {event?.name}
            </p>
            <p
              className="text-[12px] text-white font-normal"
              title={t('common.by', { name: event?.team?.name })}
            >
              {t('common.by', { name: event?.team?.name })}
            </p>
          </div>
        </div>
      </div>
      <div className="flex p-[16px] gap-[10px] items-start shadow rounded-b-[3px]">
        <div className="flex-1">
          <div className="flex gap-[4px] items-center justify-start mt-[10px]">
            <WatchIcon />
            <p className="flex-1 text-[12px]">{removeUTC()}</p>
          </div>
          <div className="flex gap-[4px] items-start justify-start mt-[10px]">
            <div className="min-w[16px] min-h-[16px]">
              <LocationIcon />
            </div>
            <TicketTooltip
              overlayClassName={
                addressWidth >= (isMobile ? 200 : desktopMaxWidthText) ? '' : 'hidden'
              }
              title={event?.location}
            >
              <p className={`flex-1 text-[12px]`} title={event?.location}>
                {event?.location}
              </p>
            </TicketTooltip>
          </div>
          {event?.isPrivate ? (
            <div className="flex text-[12px] gap-[4px] items-center justify-start mt-[10px]">
              <LockEventIcon />
              <p>{t('common.privateEvent')}</p>
            </div>
          ) : (
            <div className="flex text-[12px] gap-[4px] items-center justify-start mt-[10px]">
              <UnlockEventIcon />
              <p>{t('common.publicEvent')}</p>
            </div>
          )}
        </div>
        <Map
          className="w-[100px] h-[100px] md:w-[93px] md:h-[97px] rounded-[10px] overflow-hidden mt-2.5 md:mt-0"
          latitude={event?.latitude}
          longitude={event?.longitude}
        />
      </div>

      <CustomTab
        activeKey={activeKey}
        showCampaign={!!props.showCampaign && event.campaigns && event.campaigns.length > 0}
        onChange={(key) => {
          setActiveKey(key);
        }}
      />
      {activeKey === 1 ? (
        <>
          {!isShowAllReview && (
            <>
              <div className="w-fit mx-auto">{children}</div>
              <div className="pt-[50px]">
                {event?.description && (
                  <>
                    <p className="font-bold text-[12px]">{t('eventDetail.aboutEvent')}</p>
                    <p className="font-normal pt-[10px] whitespace-pre-wrap break-words">
                      {event?.description}
                    </p>
                    <DividerLine className="my-[40px]" />
                  </>
                )}
                {event?.policy && (
                  <>
                    <p className="font-bold text-[12px]">{t('eventDetail.notice&Policy')}</p>
                    <p className="font-normal pt-[10px] whitespace-pre-wrap break-words">
                      {event?.policy}
                    </p>
                    <DividerLine className="my-[40px]" />
                  </>
                )}

                <div className="gap-[10px] flex flex-col">
                  {event?.websiteUrl && (
                    <div>
                      <p className="font-bold text-[12px]">{t('eventDetail.website')}</p>
                      <p className="font-normal pt-[10px]">{event.websiteUrl}</p>
                    </div>
                  )}
                  {event?.instagramUrl && (
                    <div>
                      <p className="font-bold text-[12px]">{t('eventDetail.instagram')}</p>
                      <p className="font-normal pt-[10px]">{event.instagramUrl}</p>
                    </div>
                  )}
                  {event?.tiktokUrl && (
                    <div>
                      <p className="font-bold text-[12px]">{t('eventDetail.tiktok')}</p>
                      <p className="font-normal pt-[10px]">{event.tiktokUrl}</p>
                    </div>
                  )}
                  {event?.naverUrl && (
                    <div>
                      <p className="font-bold text-[12px]">{t('eventDetail.naver')}</p>
                      <p className="font-normal pt-[10px]">{event.naverUrl}</p>
                    </div>
                  )}
                  {event?.twitterUrl && (
                    <div>
                      <p className="font-bold text-[12px]">{t('eventDetail.twitter')}</p>
                      <p className="font-normal pt-[10px]">{event.twitterUrl}</p>
                    </div>
                  )}
                </div>
                {(event?.websiteUrl ||
                  event?.instagramUrl ||
                  event?.tiktokUrl ||
                  event?.naverUrl ||
                  event?.twitterUrl) && <DividerLine className="my-[40px]" />}
                {event?.socialTags && (
                  <>
                    <p className="font-bold text-[12px]">{t('eventDetail.socialTag')}</p>

                    <div className="flex gap-[8px] items-center justify-start pt-[10px]">
                      <img src={LogoInstagram} alt="Instagram" />
                      <img src={LogoTiktok} alt="LogoTiktok" className="w-[30px] h-[30px]" />
                      <span className="font-normal text-[16px]">#{event?.socialTags}</span>
                    </div>
                  </>
                )}

                <div className="px-[4px] w-full flex justify-center">
                  <div className="grid grid-cols-[1fr_1fr]  md:grid-cols-[1fr_1fr_1fr] gap-1 size-fit mt-[20px]">
                    {listSocial?.instagram &&
                      listSocial?.instagram?.length > 0 &&
                      listSocial?.instagram?.map((item, index) => {
                        if (index > 9) return;
                        return (
                          <Image
                            key={item?.id}
                            src={item?.altThumbnailSrc}
                            alt="event-img"
                            fallback={CardEventImgDetail}
                            className="w-[100%] !h-[100%]"
                            preview={false}
                            onClick={() => handleOpenLink(item?.postUrl)}
                          />
                        );
                      })}

                    {listSocial?.tiktok &&
                      listSocial?.tiktok?.length > 0 &&
                      listSocial?.tiktok?.map((item, index) => {
                        if (index > 9) return;
                        return (
                          <Image
                            key={item?.id}
                            src={item?.altThumbnailSrc}
                            alt="event-img"
                            fallback={CardEventImgDetail}
                            preview={false}
                            className="w-[100%] !h-[100%]"
                            rootClassName="w-[100%] !h-[100%]"
                            onClick={() => handleOpenLink(item?.postUrl)}
                          />
                        );
                      })}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="mt-[20px]">
          <CampaignList
            onUpdateChallengeStatus={handleUpdateOneRecord}
            data={event?.campaigns || []}
            loadMore={() => {}}
          />
        </div>
      )}
    </div>
  );
};

export default CardEventDetail;
