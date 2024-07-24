import { CardEventImgDetail, LocationIcon, WatchIcon } from 'src/assets/icons';

import { Image } from 'antd';

import './styles.scss';
import { useMemo } from 'react';
import { getMonthDateTime, renderStartEndDateTime } from 'src/helpers/formatValue';
import OverflowTooltip from 'src/components/OverflowTooltip';
import { useTranslation } from 'react-i18next';

interface CardEventProps {
  event?: any;
  className?: string;
}

const CardTicket = (props: CardEventProps) => {
  const { event } = props;
  const { t } = useTranslation();
  const startDateFormatted = useMemo(() => getMonthDateTime(event?.startTime), [event?.startTime]);

  return (
    <div className={`card-event cursor-pointer shadow-2xl rounded-[3px] mb-[40px]`}>
      <div className="w-full !h-[168px] md:!h-[220px]">
        <Image
          src={event?.image}
          alt="CardEventImg"
          fallback={CardEventImgDetail}
          preview={false}
          className="w-full !h-[168px] md:!h-[220px] object-cover rounded-t-[3px]"
          rootClassName="w-[100%]"
        />
      </div>
      <div className="flex flex-col justify-between flex-1">
        <div className="grid grid-cols-[49px_auto] gap-[10px] items-start bg-[#121313] p-[16px]">
          <div className="w-[49px] h-[49px] flex items-center justify-center bg-black5B rounded-[100px] flex-col">
            <p className="text-[14px] text-white font-normal">{startDateFormatted?.month}</p>
            <p className="text-[16px] text-white font-normal uppercase">
              {startDateFormatted?.date}
            </p>
          </div>
          <div>
            <p className="text-[20px] font-bold text-white event-title-with-overflow-wrap break-all w-[100%] md:w-[280px]">
              {event?.name}
            </p>
            <p className="text-[12px] text-white font-normal w-[100%] md:w-[280px] break-all">
              {t('common.by', { name: event?.team?.name })}
            </p>
          </div>
        </div>
        <div className="gap-[8px] flex flex-col py-[16px] px-[8px]">
          <div className="flex gap-[6px] items-center justify-start">
            <WatchIcon />
            <p className="">{renderStartEndDateTime(event?.startTime, event?.endTime)}</p>
          </div>

          <div className="flex gap-[6px] items-center justify-start">
            <LocationIcon />
            <p className="w-[100%] md:w-[280px]">{event?.location}</p>
          </div>
          {/* {event?.isPrivate ? (
            <div className="flex gap-[4px] items-center justify-start">
              <LockEventIcon />
              <p className="text-white">Private event</p>
            </div>
          ) : (
            <div className="flex gap-[4px] items-center justify-start">
              <UnlockEventIcon />
              <p className="text-white">Public event</p>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default CardTicket;
