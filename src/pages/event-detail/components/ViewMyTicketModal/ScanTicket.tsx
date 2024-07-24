import dayjs from 'dayjs';
import get from 'lodash/get';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackIcon, UserChecked } from 'src/assets/icons';
import WarningIcon from 'src/assets/icons/events/warning-icon-2.svg?react';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import { ToastMessage } from 'src/components/Toast';
import { C1093, MSG } from 'src/constants/errorCode';
import { useCheckInTicketMutation, useValidateSessionCodeMutation } from 'src/store/slices/app/api';
import { TicketDetailResponse } from 'src/store/slices/app/types';
import { ECheckInStatus } from '../../types';
import CardTicket from './CardTicket';
import HolderTicketInformation from './HolderTicketInformation';
import useQuery from 'src/hooks/useQuery';
import { Spin } from 'antd';

interface MyTicketProps {
  data: TicketDetailResponse;
  checkInSuccess: (id: number) => void;
  onScanAnother: () => void;
  onBack: () => void;
}

interface Props {
  onScanAnother: () => void;
}

const InvalidQrCode = ({ onScanAnother }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="invalid-qr justify-between flex flex-col h-[calc(100vh-60px)] md:h-[598px]">
      <div className="mt-[50px] flex flex-col items-center">
        <div className="invalid-qr__title text-center text-[24px] text-[#121313] ">
          <span>{t('checkInYour.invalidQrTitle')}</span>
        </div>
        <div className="invalid-qr__description text-center text-[14px] text[#121313] max-w-[500px]">
          <span>{t('checkInYour.invalidQrDescription')}</span>
        </div>
      </div>
      <div className=" w-[212px] mx-auto">
        <ButtonContained className="w-full" buttonType="type2" onClick={onScanAnother}>
          {t('checkInYour.scanAnotherTicket')}
        </ButtonContained>
      </div>
    </div>
  );
};

const ScanTicket = ({ data, checkInSuccess, onScanAnother, onBack }: MyTicketProps) => {
  const [checkInTicket] = useCheckInTicketMutation();
  const { t } = useTranslation();

  const idTicket = get(data, 'holdTicketOption[0].ticket[0].id', null);
  const statusTicket = get(data, 'holdTicketOption[0].ticket[0].checkInStatus', null);
  const startTime = get(data, 'collection.startTime', null);
  const [validateSessionCode] = useValidateSessionCodeMutation();
  const [isExpiredSession, setIsExpiredSession] = useState(false);
  const [loading, setLoading] = useState(true);
  const query = useQuery();

  const isOngoging = useMemo(() => {
    if (startTime) {
      return dayjs.unix(+startTime).startOf('day').isBefore(dayjs());
    }
  }, [startTime]);

  const isCommingEvent = useMemo(() => {
    if (startTime) {
      return dayjs.unix(+startTime).startOf('day').isAfter(dayjs());
    }
  }, [startTime]);

  const handleCheckInUser = async () => {
    try {
      await checkInTicket({ id: +idTicket!, sessionCode: query.get('session') || '' }).unwrap();
      checkInSuccess && checkInSuccess(+idTicket!);
      ToastMessage.success(t(MSG[C1093]));
    } catch (err: any) {
      const validator_errors = err?.data?.validator_errors;
      ToastMessage.error(MSG[validator_errors]);
    }
  };

  const renderTitle = useMemo(() => {
    if (isCommingEvent) {
      return t('checkInYour.ticketIsComming');
    }
    return statusTicket === ECheckInStatus.EXPIRED
      ? t('checkInYour.ticketExpired')
      : t('checkInYour.ticketIsValid');
  }, [isCommingEvent, statusTicket]);

  const handleCheckExpiredQr = async (code: string) => {
    try {
      setLoading(true);
      const response = await validateSessionCode({
        id: idTicket || '',
        sessionCode: code,
      }).unwrap();
      const isValid = response?.data.isValid;
      if (!isValid) {
        setIsExpiredSession(true);
      } else {
        setIsExpiredSession(false);
      }
    } catch (error) {
      setIsExpiredSession(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    const sessionCode = query.get('session');
    if (sessionCode) {
      handleCheckExpiredQr(sessionCode);
    } else {
      setIsExpiredSession(true);
    }
  }, []);

  if (loading) {
    return (
      <div className="w-full relative">
        <button className="absolute top-[22px] left-[20px]" onClick={onBack}>
          <BackIcon />
        </button>
        <div className="max-md:px-[28px] md:w-[376px] my-0 mx-auto py-[20px]">
          <div className="h-[50vh] flex items-center justify-center">
            <Spin />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <button className="absolute top-[22px] left-[20px]" onClick={onBack}>
        <BackIcon />
      </button>
      {isExpiredSession ? (
        <InvalidQrCode onScanAnother={onScanAnother} />
      ) : (
        <div className="max-md:px-[28px] md:w-[376px] my-0 mx-auto py-[20px]">
          <p className="text-[24px] text-center font-loos">
            {statusTicket === ECheckInStatus.CHECKED
              ? t('checkInYour.userCheckedIn')
              : t('checkInYour.ticketScanned')}
          </p>
          <p className="text-[14px] text-center mb-[40px]">{renderTitle}</p>
          {statusTicket === ECheckInStatus.EXPIRED || !!isCommingEvent ? (
            <WarningIcon className="mb-[40px] mx-auto" />
          ) : (
            statusTicket === ECheckInStatus.CHECKED && <UserChecked className="mb-[40px] mx-auto" />
          )}
          <CardTicket event={data?.collection} />
          {/* <DividerLine /> */}
          <HolderTicketInformation
            initSessionCode={query.get('session') || ''}
            isScan={true}
            data={data}
            minded={true}
          />

          <div className="mt-[42px] w-[212px] mx-auto">
            {statusTicket === ECheckInStatus?.NOT_CHECKED && isOngoging ? (
              <ButtonContained className="w-full" buttonType="type2" onClick={handleCheckInUser}>
                {t('checkInYour.checkInUser')}
              </ButtonContained>
            ) : (
              // <ButtonContained className="w-full" buttonType="type2" onClick={onScanAnother}>
              //   {t('checkInYour.scanAnotherTicket')}
              // </ButtonContained>
              <></>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanTicket;
