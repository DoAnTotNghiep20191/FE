import { useTranslation } from 'react-i18next';
import { GroupLargeIcon } from 'src/assets/icons';
import ModalComponent from '.';
import ButtonContained from '../Buttons/ButtonContained';

interface IInviteTeam {
  dataTeam: { teamName: string; owner: string } | null;
  open: boolean;
  onClose: () => void;
}

const InviteTeam = ({ open, dataTeam, onClose }: IInviteTeam) => {
  const { t } = useTranslation();
  return (
    <ModalComponent open={open} onCancel={onClose}>
      <div className="flex w-[] flex-col items-center justify-center p-[20px]">
        <p className="text-[24px] font-loos pb-[5px]">{t('createTeam.invitedToATeam')}</p>
        <p className="text-[14px]">
          {t('createTeam.hasInvitedYouToTeam', {
            user: dataTeam?.owner,
            teamName: dataTeam?.teamName,
          })}
        </p>
        <div className="mt-[56px] mb-[293px]">
          <GroupLargeIcon />
        </div>
        <ButtonContained buttonType="type2" className="w-[212px]" onClick={onClose}>
          {t('createTeam.getStart')}
        </ButtonContained>
      </div>
    </ModalComponent>
  );
};

export default InviteTeam;
