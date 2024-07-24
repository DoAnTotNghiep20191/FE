import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalComponent from 'src/components/Modals';
import { WIDTH_FORM_MODAL_2 } from 'src/constants';
import { Scanner } from '@yudiel/react-qr-scanner';
import './styles.scss';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import { useHistory } from 'react-router-dom';
import {
  useCheckInTicketMutation,
  useLazyGetTicketByIdQuery,
  useValidateSessionCodeMutation,
} from 'src/store/slices/app/api';
import { QRCode } from 'antd';
import { get } from 'lodash';
import { ECheckInStatus } from 'src/pages/event-detail/types';
import dayjs from 'dayjs';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';

interface Props {
  isOpenCheckInModal: boolean;
  onCancel: () => void;
}

enum ETicketStatus {
  EXPIRED = 'EXPIRED',
  NOT_VALID = 'NOT_VALID',
  CHECK_IN_SUCCESS = 'CHECK_IN_SUCCESS',
}

const CheckInModal = ({ isOpenCheckInModal, onCancel }: Props) => {
  const { t } = useTranslation();
  const [dataQR, setDataQR] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [checkinStatus, setCheckinStatus] = useState<ETicketStatus | null>(null);

  const [validateSessionCode] = useValidateSessionCodeMutation();
  const [getTicketCheckIn] = useLazyGetTicketByIdQuery();
  const [checkInTicket] = useCheckInTicketMutation();
  const { rudderAnalytics } = useRudderStack();

  const [ticketIsOnRefunding, setTicketIsOnRefunding] = useState(false);

  const history = useHistory();

  const handleViewTicket = () => {
    if (dataQR) {
      const uri = dataQR?.split(import.meta.env.VITE_SITE_URI!)?.[1];
      history.replace(uri);
    }
  };

  const ticketText = useMemo(() => {
    return {
      [ETicketStatus.EXPIRED]: t('checkInYour.ticketExpired'),
      [ETicketStatus.CHECK_IN_SUCCESS]: t('checkInYour.checkInSuccessful'),
      [ETicketStatus.NOT_VALID]: t('checkInYour.checkInNotValid'),
    };
  }, []);

  const handleResetQR = () => {
    setDataQR(null);
    setCheckinStatus(null);
    setUsername(null);
    setTicketIsOnRefunding(false);
  };

  const handleCheckExpiredQr = async (code: string) => {
    try {
      const id = dataQR?.split('?id_ticket=')[1]?.split('&')[0];
      const response = await validateSessionCode({ id: id || '', sessionCode: code }).unwrap();
      return response?.data.isValid ?? false;
    } catch (error) {
      setCheckinStatus(ETicketStatus.EXPIRED);
      return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!dataQR) return;

      if (!dataQR.includes('id_ticket')) {
        setCheckinStatus(ETicketStatus.NOT_VALID);
        return;
      }

      try {
        const id = Number(dataQR.split('?id_ticket=')[1]?.split('&')[0]);
        const sessionCode = dataQR.split('session=')[1]?.split('&')[0];
        const response = await getTicketCheckIn({ id }).unwrap();

        setUsername(get(response, 'data[0].user.username'));
        const statusTicket = get(
          response,
          'data[0].holdTicketOption[0].ticket[0].checkInStatus',
          null,
        );

        const startTime = get(response, 'data[0].collection.startTime', null);
        if (startTime) {
          const isCommingEvent = dayjs.unix(+startTime).startOf('day').isAfter(dayjs());
          if (isCommingEvent) {
            setCheckinStatus(ETicketStatus.NOT_VALID);
            return;
          }
        }

        if (statusTicket === ECheckInStatus.EXPIRED) {
          setCheckinStatus(ETicketStatus.EXPIRED);
          return;
        }

        if (!sessionCode) {
          setCheckinStatus(ETicketStatus.NOT_VALID);
          return;
        }

        const isValidSession = await handleCheckExpiredQr(sessionCode);

        if (!isValidSession) {
          setCheckinStatus(ETicketStatus.NOT_VALID);
          return;
        } else {
          await checkInTicket({ id, sessionCode: sessionCode || '' }).unwrap();
          setCheckinStatus(ETicketStatus.CHECK_IN_SUCCESS);
          rudderAnalytics?.track(ERudderStackEvents.UserCheckedIn, {
            eventType: ERudderStackEvents.UserCheckedIn,
            data: {
              ticketId: id,
              sessionCode: sessionCode || '',
            },
          });
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        // ticket is created by another team or ticket is on refunding
        if (error.data.validator_errors === 4042) {
          const uri = dataQR?.split(import.meta.env.VITE_SITE_URI!)?.[1];
          history.replace(uri);
        }

        if ([40073, 4048].includes(error.data.validator_errors)) {
          setTicketIsOnRefunding(true);
        }

        setCheckinStatus(ETicketStatus.NOT_VALID);
      }
    };

    fetchData();
  }, [dataQR]);

  return (
    <ModalComponent
      className="top-0 publish-event-modal"
      open={isOpenCheckInModal}
      width={WIDTH_FORM_MODAL_2}
      onCancel={() => {
        onCancel();
        handleResetQR();
      }}
      destroyOnClose
    >
      <div className="relative h-[calc(100vh-30px)] py-[5px] flex overflow-auto hide-scroll flex-col justify-start items-center md:h-[auto] md:min-h-[50vh]">
        <div className="flex flex-col mt-[40px] [&>video]:rounded-xl">
          <b className="text-center font-loos font-normal text-[24px]">
            {t('checkInYour.scanORCode')}
          </b>
          <b className="text-center text-[14px] font-[400] mt-[10px] mb-[32px]">
            {t('checkInYour.placeORCode')}
          </b>
          {!dataQR ? (
            <div className="scanner-background">
              <Scanner
                onResult={(text) => setDataQR(text)}
                onError={(error) => console.error(error)}
              />
            </div>
          ) : (
            <div className="qr-background">
              <QRCode className="qr-img" value={dataQR || ''} size={330} />
            </div>
          )}

          {dataQR && (
            <>
              <div
                className={`check-in-result-wrapper border-${checkinStatus ? (checkinStatus && checkinStatus === ETicketStatus.CHECK_IN_SUCCESS ? 'success' : 'failed') : 'normal'}`}
              >
                <p className="ticket-user-name">{username}</p>

                <p
                  className={`result-text ${checkinStatus && checkinStatus === ETicketStatus.CHECK_IN_SUCCESS ? 'text-success' : 'text-failed'} uppercase`}
                >
                  {checkinStatus ? ticketText[checkinStatus] : ''}
                </p>

                <ButtonContained
                  buttonType="type2"
                  className="w-[212px] md:w-[212px] my-[10px]"
                  disabled={!dataQR?.includes('id_ticket') || ticketIsOnRefunding}
                  onClick={handleViewTicket}
                >
                  {t('eventDetail.buttonViewTicket')}
                </ButtonContained>
              </div>

              <ButtonContained
                buttonType="type1"
                className="w-[212px] md:w-[212px] my-[10px] items-center justify-center reset-qr-btn"
                onClick={handleResetQR}
              >
                {t('checkInYour.scanAnotherTicket')}
              </ButtonContained>
            </>
          )}
        </div>
      </div>
    </ModalComponent>
  );
};

export default CheckInModal;
