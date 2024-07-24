import Icon from '@ant-design/icons/lib/components/Icon';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { VerificationIcon } from 'src/assets/icons/IconComponent';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import { useModalContext } from 'src/contexts/modal';
import './styles.scss';

interface IRefundNoticeProps {
  refreshCallback?: () => void;
}

export const GiftingNotice = ({ refreshCallback }: IRefundNoticeProps) => {
  const { t } = useTranslation();
  const { setModalSelected, setPayload, setContentParams } = useModalContext();
  useEffect(() => {
    return () => {
      setModalSelected('');
      setPayload && setPayload({});
      setContentParams && setContentParams({});
      refreshCallback && refreshCallback();
    };
  }, []);
  return (
    <div className="h-[618px] flex flex-col items-center justify-center mt-4">
      <Icon component={VerificationIcon} />

      <ButtonContained
        onClick={() => setModalSelected('')}
        className="md:w-[212px] w-[212px] refund-button__modified mt-[232px]"
        buttonType="type2"
      >
        <span className="text-base">{t('common.button.close')}</span>
      </ButtonContained>
    </div>
  );
};
