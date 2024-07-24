import ModalComponent from 'src/components/Modals';
import { WIDTH_FORM_MODAL_2 } from 'src/constants';
import { useModalContext } from 'src/contexts/modal';
import RefundModal from 'src/modules/refund/refund-modal';
import { useAppSelector } from 'src/store';
import { getUserInfo } from 'src/store/selectors/user';
import { TicketDetailResponse } from 'src/store/slices/app/types';
import { TypeRole } from 'src/store/slices/user/types';
import MyTicket from './MyTicket';
import './styles.scss';

interface ViewMyTicketProps {
  isOpenMyTicket: boolean;
  data: TicketDetailResponse;
  onCloseMyTicket: () => void;
  viewOnBlockchain: () => void;
  refreshCallback?: () => void;
}

const ViewMyTicketModal = (props: ViewMyTicketProps) => {
  const { isOpenMyTicket, data, onCloseMyTicket, refreshCallback } = props;
  const { setModalSelected, setUseBackButton, modalSelected, setPayload } = useModalContext();

  /**
   * This action handle open modal and back button in refund modal
   * @param action  'next' | 'previous'
   * @returns
   */
  const handleStepOpenModal = (action: 'next' | 'previous', cb: CallableFunction) => {
    let ticketId = undefined;
    data.holdTicketOption.forEach((item) => {
      if ('ticket' in item && item.ticket) {
        return (ticketId = Array.isArray(item.ticket) && item.ticket[0].id);
      }
    });
    if (action === 'next') {
      onCloseMyTicket();
      setUseBackButton && setUseBackButton(true);
      setPayload && setPayload({ collectionId: data.collection.id, ticketId: ticketId });
      cb();
    } else {
      cb();
    }
  };
  const userInfo = useAppSelector(getUserInfo);
  const userRole = userInfo?.role ?? 'organizer';
  const currentTeamId = userInfo?.currentTeamId;

  const isOrganizerCreateTicket =
    userRole === TypeRole.ORGANIZER && Number(currentTeamId) === Number(data?.collection?.team?.id);
  return (
    <>
      <ModalComponent
        className="myticket-modal relative"
        open={isOpenMyTicket || modalSelected === 'VIEW_TICKET'}
        onCancel={onCloseMyTicket}
        centered
        zIndex={70}
        width={WIDTH_FORM_MODAL_2}
      >
        {/* {isMobile && <BackIcon className="absolute top-11 left-5" onClick={onCloseMyTicket} />} */}
        <MyTicket
          onCloseMyTicket={onCloseMyTicket}
          openRefundModal={() =>
            handleStepOpenModal('next', () => setModalSelected('REFUND_REQUEST'))
          }
          data={data}
        />
      </ModalComponent>
      <RefundModal
        refreshCallback={refreshCallback}
        isOrganizerCreateTicket={isOrganizerCreateTicket}
      />
    </>
  );
};

export default ViewMyTicketModal;
