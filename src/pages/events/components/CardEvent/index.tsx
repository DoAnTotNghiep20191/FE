import {
  CardEventImgDetail,
  GroupUserIcon,
  LocationIcon,
  LockEventIcon,
  UnlockEventIcon,
  WatchIcon,
} from 'src/assets/icons';

import { Image } from 'antd';

import './styles.scss';
import { useMemo } from 'react';
import { getMonthDateTime } from 'src/helpers/formatValue';
import { nFormatter } from 'src/helpers/formatNumber';
import { useTranslation } from 'react-i18next';
import { getTimeZone } from 'src/pages/dashboard/components/CardMyEvent';

interface CardEventProps {
  event?: any;
  isMyTicket?: boolean;
  className?: string;
  onClickEvent: (e: string) => void;
}

const CardEvent = (props: CardEventProps) => {
  const { t, i18n } = useTranslation();
  const { isMyTicket, event, onClickEvent } = props;

  const startDateFormatted = useMemo(
    () => getMonthDateTime(event?.startTime),
    [event?.startTime, i18n.resolvedLanguage],
  );

  return (
    <div className={`card-event cursor-pointer mb-[40px]`} onClick={() => onClickEvent(event?.id)}>
      <div className="w-full !h-[220px] relative">
        <Image
          src={event?.image}
          alt="CardEventImg"
          fallback={CardEventImgDetail}
          preview={false}
          className="rounded-t-[3px] w-full !h-[220px] object-cover"
          rootClassName="w-[100%]"
        />
        <div className="card-event-info absolute bottom-0 left-0 right-0">
          <div className="info-time">
            <p className="info-time-month">{startDateFormatted.month}</p>
            <p className="info-time-date uppercase">{startDateFormatted.date}</p>
          </div>
          <div className="info-name">
            <p
              className="info-name-title truncate max-w-[250px] sm:max-w-[500px] md:max-w-[300px]"
              title={event?.name}
            >
              {event?.name}
            </p>
            <p
              className="info-name-create text-[12px] truncate max-w-[250px] sm:max-w-[500px] md:max-w-[300px]"
              title={t('common.by', { name: event?.team?.name })}
            >
              {t('common.by', { name: event?.team?.name })}
            </p>
          </div>
        </div>
      </div>
      <div>
        <div className="card-event-dec">
          <div className="dec-item">
            <WatchIcon />
            <p>{`${getMonthDateTime(event?.startTime).hour}  (UTC ${getTimeZone()})`}</p>
          </div>
          {/* {!isMyTicket && (
            <div className="dec-item">
              <GroupUserIcon />
              <p>
                {nFormatter(event?.totalTicketPaid)}/{nFormatter(event?.maxCapacity)}{' '}
                {t('common.guests')}
              </p>
            </div>
          )} */}
          <div className="dec-item">
            <LocationIcon />
            <p className="truncate">{event?.location}</p>
          </div>
          {event?.isPrivate ? (
            <div className="dec-item">
              <LockEventIcon />
              <p>{t('common.privateEvent')}</p>
            </div>
          ) : (
            <div className="dec-item">
              <UnlockEventIcon />
              <p>{t('common.publicEvent')}</p>
            </div>
          )}
        </div>
        {props.event.totalTicketPaid >= props.event.maxCapacity &&
          props.event.maxCapacity !== 0 && (
            <div className="sold-out-bar">
              <span>{t('common.soldOut')}</span>
            </div>
          )}
      </div>
    </div>
  );
};

export default CardEvent;
