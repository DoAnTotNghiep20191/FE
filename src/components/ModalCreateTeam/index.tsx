import { useEffect, useMemo, useState } from 'react';
import ModalComponent from '../Modals';
import CreateTeam from './CreateTeam';
import CreateTeamSuccess from './CreateTeamSuccess';
import OptionTeam from './OptionTeam';
import './styles/index.scss';
import SwitchTeam from './SwitchTeam';
import { TypeCreateTeam } from './types';

interface IModalCreateTeam {
  open: boolean;
  onClose: () => void;
  typeForm?: TypeCreateTeam;
}

const ModalCreateTeam = ({ open, typeForm, onClose }: IModalCreateTeam) => {
  const [type, setType] = useState<TypeCreateTeam | null>(TypeCreateTeam.OPTION_TEAM);
  const [previousType, setPreviousType] = useState<TypeCreateTeam | null>(null);

  useEffect(() => {
    if (!typeForm) return;
    setType(typeForm);
    setPreviousType(TypeCreateTeam.OPTION_TEAM);
  }, [open]);

  const handleCloseModalTeam = () => {
    onClose && onClose();
    setType(TypeCreateTeam.OPTION_TEAM);
  };

  const switchContent = (type: TypeCreateTeam) => {
    switch (type) {
      case TypeCreateTeam.CREATE_TEAM:
        return (
          <CreateTeam
            onBack={() => setType(previousType)}
            onSuccess={() => setType(TypeCreateTeam.CREATE_TEAM_SUCCESS)}
          />
        );
      case TypeCreateTeam.CREATE_TEAM_SUCCESS:
        return <CreateTeamSuccess handleClose={handleCloseModalTeam} />;
      case TypeCreateTeam.OPTION_TEAM:
        return (
          <OptionTeam
            onBack={() => onClose()}
            onCreateTeam={() => {
              setType(TypeCreateTeam.CREATE_TEAM);
            }}
            onSwitchTeam={() => {
              setType(TypeCreateTeam.SWITCH_TEAM);
            }}
          />
        );
      case TypeCreateTeam.SWITCH_TEAM:
        return (
          <SwitchTeam onBack={() => setType(previousType)} handleClose={handleCloseModalTeam} />
        );
      default:
        return;
    }
  };

  const renderModalContent = useMemo(() => {
    if (type) {
      return switchContent(type);
    }
  }, [type]);

  return (
    <ModalComponent open={open} centered onCancel={handleCloseModalTeam} destroyOnClose>
      {renderModalContent}
    </ModalComponent>
  );
};

export default ModalCreateTeam;
