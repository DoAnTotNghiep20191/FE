import { useTranslation } from 'react-i18next';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import W3 from 'src/assets/icons/events/warning-icon-3.svg?react';

interface IUnableToView {
  onClose: () => void;
  onScanAnother: () => void;
}

const UnableToView = ({ onScanAnother }: IUnableToView) => {
  // const isMobile = useMobile();
  const { t } = useTranslation();

  return (
    <div className="relative px-[24px] py-[40px] max-md:min-h-screen max-md:mt-auto md:px-[100px] md:pt-[50px] md:pb-[40px] flex flex-col items-center">
      <p className="text-[24px] font-loos">{t('checkInYour.unableToViewTicket')}</p>
      <p className="text-[14px] text-center">{t('checkInYour.youScannedATicket')}</p>
      <div className="pt-[40px] pb-[120px]">
        <W3 />
      </div>
      <ButtonContained
        buttonType="type2"
        className="max-md:mt-auto w-[212px]"
        onClick={onScanAnother}
      >
        {t('checkInYour.scanAnotherTicket')}
      </ButtonContained>
    </div>
  );
};

export default UnableToView;
