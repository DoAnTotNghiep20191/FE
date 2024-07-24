import { ReactNode, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BackIcon } from 'src/assets/icons';
import ModalComponent from 'src/components/Modals';
import { RefundType } from 'src/constants';
import { useModalContext } from 'src/contexts/modal';
import { useAppSelector } from 'src/store';
import { getUserInfo } from 'src/store/selectors/user';
import { IRefundReject, IRefundRequest, IRefundsApprove } from 'src/store/slices/app/types';
import { RefundRequest } from './fan/refund-request';
import { OrganizerRefundMulti } from './organizer/refund-multi';
import { OrganizerRefundReject } from './organizer/refund-reject';
import { OrganizerRefundRequest } from './organizer/refund-request';
import { RefundNotice } from './refund-noticed';
import './styles.scss';
interface IRefundModal {
  children?: ReactNode;
  refreshCallback?: () => void;
  isOrganizerCreateTicket: boolean;
}

interface IModalContent {
  title: string;
  description: string;
  prevModal?: keyof typeof RefundType;
}

type ModalType = {
  [key in keyof typeof RefundType]: IModalContent;
};
interface ModalContentMap {
  organizer: Partial<ModalType>;
  fan: Partial<ModalType>;
}

const RefundModal = ({ refreshCallback, isOrganizerCreateTicket }: IRefundModal): JSX.Element => {
  const {
    modalSelected,
    close,
    setUseBackButton,
    useBackButton,
    setModalSelected,
    contentParams,
    setContentParams,
    payload,
  } = useModalContext();

  const userInfo = useAppSelector(getUserInfo);
  const userRole = userInfo?.role ?? 'organizer';
  const { t } = useTranslation();
  const renderRefundContent = (modalSelected: string) => {
    setUseBackButton && setUseBackButton(true);
    switch (modalSelected) {
      case RefundType.REFUND_REQUEST:
        return isOrganizerCreateTicket ? (
          <OrganizerRefundRequest payload={payload as IRefundsApprove} />
        ) : (
          <RefundRequest payload={payload as IRefundRequest} />
        );
      case RefundType.REJECT_REFUND:
        return <OrganizerRefundReject payload={payload as IRefundReject} />;

      case RefundType.REFUND_MULTI:
        return <OrganizerRefundMulti payload={payload as IRefundsApprove} />;

      case RefundType.REFUND_SENT:
      case RefundType.REJECT_SENT:
      case RefundType.REFUND_MULTI_SENT:
      case RefundType.REQUEST_SENT:
        setUseBackButton && setUseBackButton(false);
        return <RefundNotice refreshCallback={refreshCallback} />;

      default:
        break;
    }
  };

  const MODAL_CONTENT: ModalContentMap = useMemo(
    () => ({
      organizer: {
        REFUND_REQUEST: isOrganizerCreateTicket
          ? {
              title: 'purchaseTicket.refundRequest.title',
              description: 'purchaseTicket.refundRequest.des',
              prevModal: undefined,
            }
          : {
              title: 'myTicket.requestRefund.title',
              description: 'myTicket.refundRequest.desc',
              prevModal: 'VIEW_TICKET',
            },
        REFUND_SENT: {
          title: 'purchaseTicket.refundSent.title',
          description: 'purchaseTicket.refundSent.desc',
        },
        REJECT_REFUND: {
          title: 'purchaseTicket.refundRejected.title',
          description: 'purchaseTicket.refundRejected.desc',
          prevModal: 'REFUND_REQUEST',
        },
        REJECT_SENT: {
          title: 'purchaseTicket.rejectSent.title',
          description: 'purchaseTicket.rejectSent.desc',
        },
        REFUND_MULTI: {
          title: 'purchaseTicket.refundMulti.title',
          description: 'purchaseTicket.refundMulti.desc',
          prevModal: undefined,
        },
        REFUND_MULTI_SENT: {
          title: 'purchaseTicket.refundMultiSent.title',
          description: 'purchaseTicket.refundMultiSent.desc',
        },
        REQUEST_SENT: {
          title: 'myTicket.requestSent.title',
          description: 'myTicket.requestSent.desc',
        },
      },
      fan: {
        REFUND_REQUEST: {
          title: 'myTicket.requestRefund.title',
          description: 'myTicket.refundRequest.desc',
          prevModal: 'VIEW_TICKET',
        },
        REQUEST_SENT: {
          title: 'myTicket.requestSent.title',
          description: 'myTicket.requestSent.desc',
        },
      },
    }),
    [],
  );

  const title = modalSelected && MODAL_CONTENT[userRole][modalSelected]?.title;
  const des = modalSelected && MODAL_CONTENT[userRole][modalSelected]?.description;
  const previousModal = modalSelected && MODAL_CONTENT[userRole][modalSelected]?.prevModal;
  //clean up provider
  useEffect(() => {
    return () => {
      setModalSelected('');
      setContentParams && setContentParams({});
    };
  }, []);

  return (
    <ModalComponent
      isClose
      onCancel={close}
      className="refund-modal"
      open={!!modalSelected && modalSelected !== 'VIEW_TICKET'}
    >
      <div className="md:!h-[618px] h-[calc(100vh-40px)] flex flex-col items-center md:justify-center justify-start relative">
        <div className="pb-[40px] pt-[28px] md:w-[484px]">
          <p className="font-loos text-[24px] text-center text-[#121313]">
            {t(title!, { ...contentParams })}
          </p>
          <p className="text-[14px] text-center text-[#121313]"> {t(des!, { ...contentParams })}</p>
          {useBackButton && (
            <>
              <button
                onClick={() => setModalSelected(previousModal)}
                className="absolute top-0 left-0"
              >
                <BackIcon />
              </button>
            </>
          )}
        </div>
        {renderRefundContent(modalSelected!)}
      </div>
    </ModalComponent>
  );
};

export default RefundModal;
