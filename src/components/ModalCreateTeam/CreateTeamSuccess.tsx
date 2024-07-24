import Icon from '@ant-design/icons';
import { VerificationIcon } from 'src/assets/icons/IconComponent';
import ButtonContained from '../Buttons/ButtonContained';

import './styles/CreateTeamSuccess.scss';
import { useHistory } from 'react-router-dom';
import { PATHS } from 'src/constants/paths';
import { useTranslation } from 'react-i18next';

const CreateTeamSuccess = ({ handleClose }: { handleClose: () => void }) => {
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <div className="create-container h-[calc(100vh-40px)] md:h-[618px]">
      <div className="flex flex-col items-center">
        <div className="mt-[48px]">
          <p className="create-team-title !text-[22px] md:!text-[24px]">
            {t('createTeam.teamSuccessfully')}
          </p>
          <p className="create-team-des">{t('createTeam.youCanNowInviteMember')}</p>
        </div>
        <Icon component={VerificationIcon} className="mt-[56px]" />
        <div className="mt-[60px] text-[14px] md:w-[448px]  text-[#121313] text-center flex flex-col justify-around">
          <p className="mb-6 break-all">{t('createTeam.thankYouForCreating')}</p>
          <p className="mb-6">{t('createTeam.aMemberOfOurTeam')}</p>
          <p className="mb-6">{t('createTeam.yourTeamCanStart')}</p>
        </div>
      </div>

      <ButtonContained
        buttonType="type2"
        className="create-container-btn mt-auto md:mt-auto mb-[80px] !w-[212px]"
        onClick={() => {
          handleClose();
          history.push(PATHS.dashboard);
        }}
      >
        {t('createTeam.getStart')}
      </ButtonContained>
    </div>
  );
};

export default CreateTeamSuccess;
