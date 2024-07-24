import Icon from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { VerificationIcon } from 'src/assets/icons/IconComponent';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import './styles/createSuccess.scss';

interface ICreateSuccess {
  onCancel: () => void;
}
const CreateSuccess: React.FC<ICreateSuccess> = (props) => {
  const { onCancel } = props;
  const { t } = useTranslation('campaigns');

  return (
    <div className="modal-success-campaign justify-start">
      <p className="modal-header-title">{t('campaignCreated')}</p>
      <p className="modal-header-des text-center">{t('campaignCreatedDes1')}</p>
      <Icon component={VerificationIcon} className="modal-verification-icon" />
      <ButtonContained fullWidth onClick={onCancel} className="modal-btn-close" buttonType="type2">
        {t('buttonClose')}
      </ButtonContained>
    </div>
  );
};

export default CreateSuccess;
