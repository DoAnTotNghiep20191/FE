import Icon from '@ant-design/icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteEventWarning, WarningIcon } from 'src/assets/icons';
import { VerificationIcon } from 'src/assets/icons/IconComponent';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import ModalComponent from 'src/components/Modals';
import { WIDTH_FORM_MODAL_2 } from 'src/constants';

interface IModalDeleteEvent {
  step: number;
  isOpen: boolean;
  onDeleteEvent: () => void;
  onClose: () => void;
  loading: boolean;
}

const ModalDeleteEvent = ({ step, isOpen, onDeleteEvent, onClose, loading }: IModalDeleteEvent) => {
  const { t } = useTranslation();
  const switchModal = (type: number) => {
    switch (type) {
      case 1:
        return (
          <div className="relative flex flex-col items-center justify-center pt-0 md:pt-[20px] px-[10px]">
            {/* <BackIcon className="md:hidden absolute top-2 left-0 z-10" onClick={onClose} /> */}
            <p className="text-[24px] text-[#121313]">{t('deleteEvent.confirmDeletionOfEvent')}</p>
            <p className="text-[16px] text-[#121313] font-normal text-center w-[90%] md:w-[402px]">
              {t('deleteEvent.ifYourEventHasCompleteOrders')}
            </p>
            <p className="text-[14px] text-[#121313] font-normal text-center w-[90%] md:w-[402px] mt-[10px]">
              {t('deleteEvent.deletingThisEventRemoves')}
            </p>
            <div className="mt-[80px] mb-[136px]">
              <DeleteEventWarning />
            </div>
            <ButtonContained
              loading={loading}
              className="mt-auto md:mt-0 !w-[212px] !md:w-[212px] mb-[10px] !border-[#E53535] !text-[#E53535]"
              buttonType="type2"
              onClick={onDeleteEvent}
            >
              {t('deleteEvent.iWantToDelete')}
            </ButtonContained>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center justify-center pt-[20px] px-[10px]">
            <p className="text-[24px] text-[#121313] font-extrabold">
              {t('deleteEvent.eventDelete')}
            </p>
            <p className="text-[16px] text-[#121313] font-normal text-center w-[90%] md:w-[402px]">
              {t('deleteEvent.yourEventHasBeen')}
            </p>
            <Icon component={VerificationIcon} className="create-container-icon" />
            <ButtonContained
              className="mt-auto md:mt-0 !w-[212px] !md:w-[212px]"
              buttonType="type2"
              onClick={onClose}
            >
              {t('deleteEvent.buttonClose')}
            </ButtonContained>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center justify-center pt-[20px] px-[10px]">
            <p className="text-[24px] text-[#121313] font-extrabold">
              {t('deleteEvent.unableToDeleteEvent')}
            </p>
            <p className="text-[16px] text-[#121313] font-normal text-center w-[90%] md:w-[402px]">
              {t('deleteEvent.itLooksLikeThereArePriced')}
            </p>
            <div className="py-[40px]">
              <WarningIcon />
            </div>
            <ButtonContained
              className="mt-auto md:mt-0 !w-[212px] !md:w-[212px]"
              buttonType="type2"
              onClick={onClose}
            >
              {t('deleteEvent.buttonClose')}
            </ButtonContained>
          </div>
        );

      default:
        return;
    }
  };

  const renderModalDelete = useMemo(() => {
    return switchModal(step);
  }, [step]);

  return (
    <ModalComponent
      width={WIDTH_FORM_MODAL_2}
      open={isOpen}
      onCancel={onClose}
      centered
      destroyOnClose
      className="modal-mobile-confirm"
      isCloseMobile={step !== 2}
    >
      {renderModalDelete}
    </ModalComponent>
  );
};

export default ModalDeleteEvent;
