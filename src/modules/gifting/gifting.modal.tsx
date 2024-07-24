import { useTranslation } from 'react-i18next';
import { BackIcon } from 'src/assets/icons';
import ModalComponent from 'src/components/Modals';
import { useModalContext } from 'src/contexts/modal';
import { TicketOptionResponse } from 'src/store/slices/app/types';
import { GiftingTicket } from './gifting-ticket';
import { useEffect, useMemo } from 'react';
import { RevokeGift } from './gifting-revoke';
import { GiftingNotice } from './gifting-notice';

interface IGiftModal {
  data?: TicketOptionResponse[];
  collectionId: number;
  refreshCallback?: () => void;
}

export const GiftingModal = ({ collectionId, data, refreshCallback }: IGiftModal) => {
  const { t } = useTranslation();
  const {
    contentParams,
    modalSelected,
    close,
    useBackButton,
    setModalSelected,
    setUseBackButton,
    payload,
    setPayload,
    setContentParams,
  } = useModalContext();

  const transformData = useMemo(() => {
    return data?.length
      ? data.map((ticket) => ({
          ticketId: ticket.id,
          name: ticket.name,
        }))
      : undefined;
  }, [data]);
  const renderModalContent = (modalType: string) => {
    switch (modalType) {
      case 'GIFTING_TICKET':
        setUseBackButton && setUseBackButton(true);

        return <GiftingTicket tickets={transformData} collectionId={collectionId} />;
      case 'GIFT_SENT':
      case 'GIFT_REVOKE_NOTICE':
        setUseBackButton && setUseBackButton(false);

        return <GiftingNotice refreshCallback={refreshCallback} />;
      case 'GIFT_REVOKE':
        setUseBackButton && setUseBackButton(true);

        return <RevokeGift payload={payload} />;
      default:
        break;
    }
    return <></>;
  };

  useEffect(() => {
    return () => {
      setModalSelected('');
      setPayload && setPayload({});
      setContentParams && setContentParams({});
    };
  }, []);

  const modalContent = {
    GIFTING_TICKET: {
      title: 'eventManagement.gifting.giftingTicket.title',
      description: 'eventManagement.gifting.giftingTicket.description',
      previousModal: undefined,
    },
    GIFT_SENT: {
      title: 'eventManagement.gifting.giftingNotice.title',
      description: 'eventManagement.gifting.giftingNotice.description',
    },
    GIFT_REVOKE: {
      title: 'eventManagement.gifting.revoke.title',
      description: 'eventManagement.gifting.revoke.description',
      previousModal: undefined,
    },
    GIFT_REVOKE_NOTICE: {
      title: 'eventManagement.gifting.revokeNotice.title',
      description: 'eventManagement.gifting.revokeNotice.description',
    },
  };

  const title = modalSelected && modalContent[modalSelected as keyof typeof modalContent]?.title;
  const des =
    modalSelected && modalContent[modalSelected as keyof typeof modalContent]?.description;

  return (
    <ModalComponent className="gift-modal" onCancel={close} isClose open={!!modalSelected}>
      <div className="md:!h-[618px] refund-modal flex flex-col items-center justify-center h-full relative">
        <div className="pb-[40px] pt-[28px] md:w-[484px]">
          <p className="font-loos text-[24px] text-center text-[#121313]">
            {t(title!, { ...contentParams })}
          </p>
          <p className="text-[14px] text-center text-[#121313]">{t(des!, { ...contentParams })}</p>
          {useBackButton && (
            <>
              <button
                onClick={() => setModalSelected(modalContent.GIFTING_TICKET.previousModal)}
                className="absolute top-0 left-0"
              >
                <BackIcon />
              </button>
            </>
          )}
        </div>
        {renderModalContent(modalSelected!)}
      </div>
    </ModalComponent>
  );
};
