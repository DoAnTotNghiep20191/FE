import { useTranslation } from 'react-i18next';
import { Teams } from 'src/assets/icons';
import ButtonContained from '../Buttons/ButtonContained';

import './styles/OptionTeam.scss';

const OptionTeam = ({
  onSwitchTeam,
  onCreateTeam,
}: {
  onSwitchTeam: () => void;
  onCreateTeam: () => void;
  onBack: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className="create-container relative h-auto md:h-[618px]">
      <p className="create-team-title">{t('createTeam.team')}</p>
      <p className="create-team-des">{t('createTeam.switchBetweenMultiple')}</p>
      <div className="my-[50px]">
        <Teams width={64} height={57.14} />
      </div>
      <ButtonContained
        buttonType="type1"
        className="create-container-btn mt-auto md:mt-[293px] !w-[212px]"
        onClick={onSwitchTeam}
      >
        {t('createTeam.switchTeam')}
      </ButtonContained>
      <ButtonContained
        buttonType="type2"
        className="create-container-btn mt-[10px] !w-[212px]"
        onClick={onCreateTeam}
      >
        {t('createTeam.createNewTeam')}
      </ButtonContained>
    </div>
  );
};

export default OptionTeam;
