import Icon from '@ant-design/icons/lib/components/Icon';
import { VerificationIcon } from 'src/assets/icons/IconComponent';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import ModalComponent from 'src/components/Modals';
import { WIDTH_FORM_MODAL_2 } from 'src/constants';
import './styles.scss';
import React from 'react';

interface NotificationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  textButton: string;
  description2?: string;
  onClose: () => void;
  onButton: () => void;
  icon?: React.ReactElement;
  withBackButton?: () => React.ReactNode;
}

const NotificationModal = (props: NotificationModalProps) => {
  const { isOpen, title, description, textButton, description2, icon, onClose, onButton } = props;

  return (
    <ModalComponent
      open={isOpen}
      onCancel={onClose}
      centered
      zIndex={70}
      width={WIDTH_FORM_MODAL_2}
      isCloseMobile={false}
    >
      <div className="flex flex-col relative items-center justify-start h-full my-[20px]">
        <div className="flex flex-row">
          <p className="text-[24px] font-loos md:w-[447px] text-center">{title}</p>
        </div>

        <p className="text-[14px] font-normal mt-1 sm:w-[342px] md:w-[447px] w-full text-center">
          {description}
        </p>
        {description2 && (
          <p className="text-[14px] font-normal mt-1 sm:w-[342px] md:w-[447px]  text-center">
            {description2}
          </p>
        )}
        <div className="mt-[56px] mb-[256px]">
          {icon ? icon : <Icon component={VerificationIcon} className="icon-verification" />}
        </div>
        <ButtonContained buttonType="type2" className="md:w-[212px] w-[272px]" onClick={onButton}>
          {textButton}
        </ButtonContained>
      </div>
    </ModalComponent>
  );
};

export default NotificationModal;
