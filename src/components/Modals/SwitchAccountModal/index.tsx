import ButtonContained from 'src/components/Buttons/ButtonContained';
import ModalComponent from '..';
import { useTranslation } from 'react-i18next';
import './styles.scss';
interface Props {
  open: boolean;
  onOk: () => void;
  onClose: () => void;
}

const SwitchAccountModal = ({ open, onClose, onOk }: Props) => {
  const { t } = useTranslation();

  return (
    <ModalComponent
      centered
      open={open}
      zIndex={70}
      width={684}
      isClose={true}
      className="relative modal-container-mobile-v2"
      onCancel={onClose}
    >
      <div className="full-height switch-account-modal flex flex-col items-center justify-between py-[20px] md:h-[auto]">
        <div className="max-w-[448px] md:mb-[60px]">
          <p className="text-center text-[24px] text-[#121313]">
            {t('selectUser.switchViewTitle')}
          </p>
          <p className="text-center text-[14px]">{t('selectUser.switchViewDescription')}</p>
        </div>
        <div>
          <ButtonContained
            buttonType="type2"
            fullWidth
            className="my-2.5 !w-[212px] !md:w-[212px]"
            onClick={onOk}
          >
            {t('header.switch')}
          </ButtonContained>
        </div>
      </div>
    </ModalComponent>
  );
};

export default SwitchAccountModal;
