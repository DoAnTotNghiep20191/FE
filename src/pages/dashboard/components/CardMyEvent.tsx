import { Image } from 'antd';
import dayjs from 'dayjs';
import { ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  CardEventImgDetail,
  GroupUserIcon,
  LocationIcon,
  LockEventIcon,
  UnlockEventIcon,
  WatchIcon,
} from 'src/assets/icons';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import OverflowTooltip from 'src/components/OverflowTooltip';
import { ToastMessage } from 'src/components/Toast';
import { C1043, C1087, MSG } from 'src/constants/errorCode';
import { nFormatter } from 'src/helpers/formatNumber';
import { getMonthDateTime } from 'src/helpers/formatValue';
import { useAppSelector } from 'src/store';
import { getUserInfo } from 'src/store/selectors/user';
import { EEventStatus } from 'src/store/slices/app/types';
import { ETeamRole } from 'src/store/slices/user/types';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const getTimeZone = () => {
  try {
    const arrNums = dayjs()
      .tz(dayjs.tz.guess())
      .format('z')
      .replace(/^[+-]*GMT/, () => {
        return '';
      });
    return arrNums;
  } catch {
    return 0;
  }
};

interface ICardMyEvent {
  event?: any;
  loadingPublish?: boolean;
  loadingRepublish?: boolean;
  onPublishEvent?: () => void;
  onRePublishEvent?: () => void;
  onRenderButtons?: () => ReactElement;
  onClickEvent: (number: string) => void;
}

enum TeamStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
}

const CardMyEvent = ({
  event,
  loadingPublish,
  loadingRepublish,
  onPublishEvent,
  onRePublishEvent,
  onRenderButtons,
  onClickEvent,
}: ICardMyEvent) => {
  const history = useHistory();
  const { t } = useTranslation();
  const user = useAppSelector(getUserInfo);

  const startDateFormatted = useMemo(() => getMonthDateTime(event?.startTime), [event?.startTime]);
  const status = event?.status;
  const isPast = useMemo(() => {
    return dayjs.unix(event?.endTime).isBefore(dayjs());
  }, [event?.endTime]);

  const handleRePublishEvent = () => {
    if (isPast) {
      ToastMessage.error(t(MSG[C1043]));
    } else {
      onRePublishEvent && onRePublishEvent();
    }
  };

  const handlePublishEvent = (event?: any) => {
    if (isPast) {
      ToastMessage.error(t(MSG[C1043]));
    } else {
      if (event?.team?.status === TeamStatus.PENDING) {
        ToastMessage.error(t(MSG[C1087]));
        return;
      }
      onPublishEvent && onPublishEvent();
    }
  };

  return (
    <div className="mb-[50px] cursor-pointer">
      <div className="flex flex-col h-auto rounded-[3px] bg-white shadow-lg shadow-rgba(0, 0, 0, 0.25)">
        <div className="w-full relative !h-[220px]" onClick={() => onClickEvent(event?.id)}>
          <Image
            src={event?.image}
            fallback={CardEventImgDetail}
            preview={false}
            alt="CardEventImgDetail"
            width={'100%'}
            className="!w-full !h-full object-cover rounded-[3px]"
            rootClassName="!w-full !h-full"
          />
          <div className="grid grid-cols-[49px_auto] gap-[10px] items-center p-[16px] absolute bottom-0 left-0 right-0 bg-black1/80">
            <div className="w-[49px] h-[49px] flex items-center justify-center bg-white/30 rounded-full flex-col">
              <p className="text-[12px] text-white font-normal">{startDateFormatted?.month}</p>
              <p className="text-[16px] text-white font-normal uppercase">
                {startDateFormatted?.date}
              </p>
            </div>
            <div>
              <OverflowTooltip className="truncate w-[250px] md:w-[300px]" title={event?.name}>
                <p className="text-[20px] text-white font-bold truncate w-[250px] md:w-[300px]">
                  {event?.name}
                </p>
              </OverflowTooltip>

              <OverflowTooltip
                className="truncate w-[250px] md:w-[300px]"
                title={t('common.by', { name: event?.team?.name })}
              >
                <p className="text-[12px] text-white font-normal truncate w-[250px] md:w-[300px]">
                  {t('common.by', { name: event?.team?.name })}
                </p>
              </OverflowTooltip>
            </div>
          </div>
        </div>
        <div className="px-17 md:px-[8px] py-[8px] px-[10px] flex flex-col justify-between flex-1 gap-6 md:gap-0">
          <div className="flex flex-wrap gap-[10px]">
            <div className="flex gap-[6px] w-[48%] items-center justify-start">
              <WatchIcon />
              <p className="text-black1 h-[20px] text-[14px]">
                {`${getMonthDateTime(event?.startTime).hour} (UTC ${getTimeZone()})`}
              </p>
            </div>
            {/* <div className="flex gap-[6px] w-[48%] items-center justify-start">
              <GroupUserIcon />
              <p className="text-black1 h-[20px] max-w-[146px] text-[14px]">
                {nFormatter(event?.totalTicketPaid)}/{nFormatter(event?.maxCapacity)}{' '}
                {t('common.guests')}
              </p>
            </div> */}
            <div className="flex gap-[6px] w-[48%] items-center justify-start">
              <LocationIcon />
              <OverflowTooltip
                className="truncate w-[130px] md:w-[146px] text-[14px]"
                title={`By ${event?.location}`}
              >
                <p className="text-black1 h-[20px] truncate w-[130px] md:w-[146px]">
                  {event?.location}
                </p>
              </OverflowTooltip>
            </div>
            {event?.isPrivate ? (
              <div className="flex gap-[6px] w-[48%] items-center justify-start">
                <LockEventIcon />
                <p className="text-black1 h-[20px] max-w-[146px] text-[14px]">
                  {t('common.privateEvent')}
                </p>
              </div>
            ) : (
              <div className="flex gap-[6px] w-[48%] items-center justify-start">
                <UnlockEventIcon />
                <p className="text-black1 h-[20px] max-w-[146px] text-[14px]">
                  {t('common.publicEvent')}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end gap-5 md:gap-[16px] p-[16px]">
          {onRenderButtons ? (
            onRenderButtons()
          ) : (
            <>
              <ButtonContained
                buttonType="type2"
                mode="medium"
                className="flex-1 md:flex-none"
                onClick={() => history.push(`/event-manager/${event.id}`)}
                disabled={status === EEventStatus.DEPLOYING}
              >
                {t('dashboard.manageEvent')}
              </ButtonContained>
              {(status === EEventStatus.CREATED ||
                status === EEventStatus.REQUEST_DEPLOY ||
                status === EEventStatus.DEPLOYING) &&
                user?.roleOfTeam !== ETeamRole.OPERATIONS && (
                  <ButtonContained
                    mode="medium"
                    className="flex-1 md:flex-none"
                    onClick={() => handlePublishEvent(event)}
                    loading={loadingPublish}
                    disabled={
                      status === EEventStatus.REQUEST_DEPLOY || status === EEventStatus.DEPLOYING
                    }
                  >
                    {status === EEventStatus.REQUEST_DEPLOY || status === EEventStatus?.DEPLOYING
                      ? t('dashboard.eventPublishing')
                      : t('dashboard.publishEvent')}
                  </ButtonContained>
                )}

              {(status === EEventStatus.UPDATED || status === EEventStatus.REQUEST_UPDATE) &&
                user?.roleOfTeam !== ETeamRole.OPERATIONS && (
                  <ButtonContained
                    mode="medium"
                    className="flex-1 md:flex-none"
                    onClick={handleRePublishEvent}
                    loading={loadingRepublish}
                    disabled={status === EEventStatus.REQUEST_UPDATE}
                  >
                    {status === EEventStatus.REQUEST_UPDATE
                      ? t('dashboard.eventRepublishing')
                      : t('dashboard.republishEvent')}
                  </ButtonContained>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default CardMyEvent;
