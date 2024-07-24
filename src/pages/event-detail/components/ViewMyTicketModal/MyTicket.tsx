import get from 'lodash/get';
import { useTranslation } from 'react-i18next';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import { openTransactionHash } from 'src/helpers';
import { TicketDetailResponse } from 'src/store/slices/app/types';
import CardTicket from './CardTicket';
import HolderTicketInformation from './HolderTicketInformation';
import { BackIcon } from 'src/assets/icons';
import { RefundStatus } from 'src/constants';
import dayjs from 'dayjs';
import { useModalContext } from 'src/contexts/modal';
import { ECheckInStatus, EPaymentMethod } from '../../types';

interface MyTicketProps {
  data: TicketDetailResponse;
  openRefundModal?: (action: 'next' | 'previous') => void;
  onCloseMyTicket?: () => void;
  refreshCallback?: () => void;
}

const MyTicket = ({ data, onCloseMyTicket, openRefundModal }: MyTicketProps) => {
  const minedNFT = get(data, 'holdTicketOption[0].ticket[0].blockchainStatus', null);
  const transactionHash = get(data, 'holdTicketOption[0].ticket[0].transactionHash', null);
  const { t } = useTranslation();
  const { setModalSelected } = useModalContext();
  const viewOnBlockchain = () => {
    if (transactionHash) openTransactionHash(transactionHash);
  };
  const clickBackButton = () => {
    onCloseMyTicket && onCloseMyTicket();
    setModalSelected('');
  };
  return (
    <div className="my-ticket flex flex-col items-center md:mh-[1298px] justify-center">
      <button onClick={clickBackButton} className="absolute top-4 left-4">
        <BackIcon />
      </button>
      <div className="pb-[40px]">
        <p className="font-loos text-[24px] text-center">{t('myTicket.myTicket')}</p>
        <p className="text-[14px] text-center">{t('myTicket.scanQRCodeAtEntry')}</p>
      </div>
      <div className="flex-1 px-0">
        <CardTicket event={data?.collection} />
        {/* <DividerLine /> */}
        <div className="md:max-w-[342px] mx-auto">
          <HolderTicketInformation data={data} minded={minedNFT === 'MINTED'} />
        </div>
      </div>
      {minedNFT === 'MINTED' && (
        <>
          <ButtonContained
            className="mx-[52px] md:w-[212px] w-[212px] !text-base mt-[50px] border-none shadow-lg"
            buttonType="type2"
            onClick={viewOnBlockchain}
          >
            {t('myTicket.viewOnBlockchain')}
          </ButtonContained>
          {!!data.holdTicketOption.length &&
            data.holdTicketOption[0].ticket[0]?.checkInStatus !== ECheckInStatus.CHECKED &&
            data.paymentMethod !== EPaymentMethod.GIFTING && (
              <ButtonContained
                className="md:w-[212px] w-[212px] !text-base mt-2"
                buttonType="type2"
                disabled={
                  data.status === RefundStatus.PROCESSING_REFUND ||
                  dayjs.unix(Number(data.collection.startTime)).isBefore(dayjs())
                }
                onClick={() => openRefundModal && openRefundModal('next')}
              >
                {t(
                  data.status === RefundStatus.PROCESSING_REFUND
                    ? 'myTicket.requestPending'
                    : 'myTicket.requestRefund',
                )}
              </ButtonContained>
            )}
        </>
      )}
    </div>
  );
};

export default MyTicket;
