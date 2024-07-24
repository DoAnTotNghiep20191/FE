import SkeletonButton from 'antd/es/skeleton/Button';
import { isArray } from 'lodash';
import { useState } from 'react';
import { useAppSelector } from 'src/store';
import { getUserInfo } from 'src/store/selectors/user';
import { useListTeamQuery, useSwitchTeamMutation } from 'src/store/slices/app/api';
import ButtonContained from '../Buttons/ButtonContained';
import { ToastMessage } from '../Toast';
import { useHistory } from 'react-router-dom';
import { PATHS } from 'src/constants/paths';
import { useTranslation } from 'react-i18next';
import { C1010, MSG } from 'src/constants/errorCode';
import { BackIcon } from 'src/assets/icons';
import './styles/switchTeam.scss';
import useWindowSize from 'src/hooks/useWindowSize';
const SwitchTeam = ({ handleClose, onBack }: { handleClose: () => void; onBack: () => void }) => {
  const { data, isLoading } = useListTeamQuery(undefined);
  const useInfo = useAppSelector(getUserInfo);
  const [teamSelect, setTeamSelect] = useState(useInfo?.currentTeamId || -1);
  const { height } = useWindowSize();
  const [switchTeam, { isLoading: isLoadingSwitch }] = useSwitchTeamMutation();
  const history = useHistory();

  const { t } = useTranslation();

  const handleSelectTeam = (id: number) => {
    setTeamSelect(id);
  };

  const handleSwitchTeam = async () => {
    try {
      await switchTeam({ teamId: teamSelect }).unwrap();
      ToastMessage.success(t(MSG[C1010]));
      history.push(PATHS.dashboard);
      handleClose && handleClose();
    } catch (err) {
      console.error(err);
      ToastMessage.error('Switch team failed');
    }
  };

  return (
    <div className="create-container flex flex-col justify-between h-auto md:h-[618px] relative">
      <div>
        <p className="create-team-title">{t('createTeam.switchTeam')}</p>
        <p className="create-team-des">{t('createTeam.selectATeam')}</p>
        <button onClick={onBack} className="absolute top-0 left-0">
          <BackIcon />
        </button>
        <div
          style={{
            height: height - 240,
          }}
          className={`w-[261px] pr-[2px] flex flex-col gap-[10px] my-[40px] md:!h-[380px] overflow-auto`}
        >
          {isLoading ? (
            <>
              <SkeletonButton active className="w-full" size="large" />
              <SkeletonButton active className="w-full" size="large" />
              <SkeletonButton active className="w-full" size="large" />
              <SkeletonButton active className="w-full" size="large" />
            </>
          ) : (
            <>
              {isArray(data?.data) &&
                data?.data?.map((item: any) => {
                  const active = item?.id === teamSelect;
                  return (
                    <div
                      key={item?.id}
                      className={`flex p-[14px] rounded-[10px]  border border-solid items-center justify-between ${
                        active ? 'border-[#00456C] bg-[#80C5EC]' : 'border-black5B'
                      } relative`}
                      onClick={() => handleSelectTeam(item?.id)}
                    >
                      <p className="text-16px font-medium text-[#00456C] truncate">{item?.name}</p>

                      {/* {active && (
                      <span className="absolute right-2">
                        <CheckTeamIcon />
                      </span>
                    )} */}
                    </div>
                  );
                })}
            </>
          )}
        </div>
      </div>
      <ButtonContained
        buttonType="type1"
        className="create-container-btn !w-[212px] switch-team-btn "
        onClick={handleSwitchTeam}
        disabled={teamSelect === -1 || (!teamSelect && teamSelect !== 0)}
        loading={isLoadingSwitch}
      >
        {t('createTeam.switch')}
      </ButtonContained>
    </div>
  );
};

export default SwitchTeam;
