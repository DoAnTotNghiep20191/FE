import { useHistory } from 'react-router-dom';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import { PATHS } from 'src/constants/paths';
import Icon from 'src/assets/icons/common/404-icon.png';
import './not-found.scss';
import { useTranslation } from 'react-i18next';

const NotFound: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-[50px] pt-[60px] text-black">
      <div>
        <img src={Icon} />
      </div>
      <p className="text-center">{t('404.thePageYourLookingForAppears')}</p>
      <ButtonContained
        onClick={() => history.push(PATHS.events)}
        className="w-[212px] h-[53px]"
        buttonType="type1"
      >
        {t('404.returnToHomepage')}
      </ButtonContained>
    </div>
  );
};

export default NotFound;
