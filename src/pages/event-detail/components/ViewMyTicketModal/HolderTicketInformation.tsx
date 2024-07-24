import { Divider } from 'antd';
import { useEffect, useState } from 'react';
import { ExpiredIcon, ValidIcon } from 'src/assets/icons';
import TicketQRCode from 'src/components/QRCode';
import { DATE_FORMAT } from 'src/constants';
import { formatDate } from 'src/helpers/formatValue';
import { TicketDetailResponse } from 'src/store/slices/app/types';
import './styles.scss';
import get from 'lodash/get';
import { ECheckInStatus } from '../../types';
import OverflowTooltip from 'src/components/OverflowTooltip';
import { useTranslation } from 'react-i18next';
import LoadingIcon from 'src/assets/icons/events/loading-ic.svg?react';
import {
  useLazyGetSessionTicketByIdQuery,
  useLazyRefreshSessionTicketQuery,
} from 'src/store/slices/app/api';
import CandleLoading from './CandleLoading';
import dayjs from 'dayjs';

interface IHolderTicketInformation {
  data: TicketDetailResponse;
  minded?: boolean;
  isScan?: boolean;
  initSessionCode?: string;
}

const HolderTicketInformation = ({
  data,
  minded,
  isScan,
  initSessionCode = '',
}: IHolderTicketInformation) => {
  const { t } = useTranslation();
  const idTicket = get(data, 'holdTicketOption[0].ticket[0].id', null);
  const statusTicket = get(data, 'holdTicketOption[0].ticket[0].checkInStatus', null);
  const [link, setLink] = useState<string>(initSessionCode);
  const [getSession] = useLazyGetSessionTicketByIdQuery();
  const [refreshSession] = useLazyRefreshSessionTicketQuery();
  const [lastSessionCreated, setLastCreated] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshError, setRefreshError] = useState(false);

  const handleRefreshQr = async () => {
    setRefreshError(false);
    try {
      setLoading(true);
      if (idTicket) {
        const response = await refreshSession({
          id: idTicket,
        }).unwrap();
        const sessionCode = response.data?.sessionCode;
        const createdAt = response.data?.createdAt;
        const url = `${import.meta.env.VITE_SITE_URI}/events/${data?.collection?.id}?id_ticket=${idTicket}&session=${sessionCode}`;
        setLink(url);
        setLastCreated(createdAt || 0);
      }
    } catch (error) {
      console.error(error);
      setRefreshError(true);
    }
    setLoading(false);
  };

  const handleGetLink = async () => {
    if (idTicket) {
      try {
        const response = await getSession({
          id: idTicket,
        }).unwrap();
        const sessionCode = response.data?.sessionCode;
        const createdAt = response.data?.createdAt;

        const url = `${import.meta.env.VITE_SITE_URI}/events/${data?.collection?.id}?id_ticket=${idTicket}&session=${sessionCode}`;
        setLink(url);
        setLastCreated(createdAt || 0);
      } catch (error) {
        handleRefreshQr();
      }
    }
  };

  useEffect(() => {
    if (!isScan && minded) {
      handleGetLink();
    }
  }, [minded, isScan]);

  const handleCountDownEnd = () => {
    if (!refreshError) {
      handleRefreshQr();
    }
  };

  return (
    <div className="py-[20px] bg-[#F2F2F5] text-[16px] p-[16px] rounded-[3px] shadow-2xl text-[#3C4A60]">
      {!isScan && minded && (
        <div className="flex flex-col items-center">
          <div>
            {t('myTicket.lastRefreshAt')}{' '}
            {dayjs.unix(lastSessionCreated).format('DD MMMM YYYY, hh:mm a')}
          </div>
          {loading ? (
            <CandleLoading />
          ) : (
            <button className="text-[#008AD8]" onClick={handleRefreshQr}>
              {t('myTicket.tabToRefresh')}
            </button>
          )}
        </div>
      )}

      {minded && (
        <TicketQRCode
          onTimeEnd={handleCountDownEnd}
          lastTime={lastSessionCreated}
          link={link}
          className="mb-[40px]"
          isScan={isScan}
          error={refreshError}
        />
      )}
      <div className="flex flex-col gap-[16px]">
        <div>
          {/* <p className="text-[12px] font-[500]">{t('myTicket.name')}</p> */}
          <h2 className="text-[32px] ">{data?.user?.username}</h2>
        </div>
        <Divider className="divider m-0" />
        <div>
          <p className="text-[12px] font-[500] ">{t('myTicket.dateOfBirth')}</p>
          <p className="text-[16px] ">{formatDate(data?.user?.dateOfBirth, DATE_FORMAT)}</p>
        </div>
        <Divider className="divider m-0" />
        <div>
          <p className="text-[12px] font-[500] ">{t('myTicket.emailAddress')}</p>
          <p className="text-[16px] ">{data?.email || data?.giftingEmail}</p>
        </div>
      </div>
      <Divider className="divider" />
      <div className="flex items-center gap-[10px]">
        <div className="w-[50%]">
          <p className="text-[12px] font-[500] mb-1 text-nowrap ">{t('myTicket.ticketStatus')}</p>
          {minded ? (
            <div className="flex gap-2 items-center">
              {statusTicket === ECheckInStatus.EXPIRED ? (
                <ExpiredIcon />
              ) : (
                <ValidIcon width={20} height={20} className="verified-icon" />
              )}
              <p className="text-[16px] ">
                {statusTicket === ECheckInStatus?.CHECKED
                  ? t('checkInYour.checkedIn')
                  : statusTicket === ECheckInStatus.EXPIRED
                    ? t('checkInYour.expired')
                    : t('checkInYour.valid')}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-[5px]">
              <LoadingIcon className="loading-icon" />
              <p className=" text-[16px]">{t('myTicket.generatingTicket')}</p>
            </div>
          )}
        </div>
        <div className="w-[50%]">
          <p className="text-[12px] font-[500] mb-1 ">{t('myTicket.ticketType')}</p>
          <OverflowTooltip title={data?.holdTicketOption[0]?.ticketOption?.name}>
            <p className="text-[16px] w-[100%] word-break-all">
              {data?.holdTicketOption[0]?.ticketOption?.name}
            </p>
          </OverflowTooltip>
        </div>
      </div>
    </div>
  );
};

export default HolderTicketInformation;
