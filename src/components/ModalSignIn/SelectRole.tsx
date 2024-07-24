import { useTranslation } from 'react-i18next';
import { FanIcon, OrganizerIcon } from 'src/assets/icons';
import { useResizeObserver } from 'src/hooks/useResizeObserver';
import { TypeRole } from 'src/store/slices/user/types';
import ButtonContained from '../Buttons/ButtonContained';
import './styles/select-role.scss';

interface ISelectRole {
  roleSelect: TypeRole;
  onChangeRole: (role: TypeRole) => void;
  onContinue: () => void;
  onClose?: () => void;
}

const SelectRole = ({ roleSelect, onChangeRole, onContinue }: ISelectRole) => {
  // const isMobile = useMobile();
  const { t } = useTranslation();
  const { height, setElemRef } = useResizeObserver();
  const { height: orgSvgHeight, setElemRef: setOrgSvgRef } = useResizeObserver();
  const { height: textFanHeight, setElemRef: setTextRef } = useResizeObserver();
  const { height: textOrgHeight, setElemRef: setTextOrgRef } = useResizeObserver();

  return (
    <div className="select-role h-[658px] w-[100vw] md:w-[100%]">
      {/* {isMobile && (
        <button className="absolute top-1 left-0" onClick={onClose}>
          <BackIcon />
        </button>
      )} */}
      <div className="switch-form relative z-50">
        <div
          className={`switch-form-item switch-form-left ${
            roleSelect === TypeRole?.FAN ? 'active' : ''
          }`}
          onClick={() => onChangeRole(TypeRole?.FAN)}
        >
          <p className="z-50">{t('selectUser.imAFan')}</p>
        </div>

        <div
          className={`switch-form-item switch-form-right ${
            roleSelect === TypeRole?.ORGANIZER ? 'active' : ''
          }`}
          onClick={() => onChangeRole(TypeRole?.ORGANIZER)}
        >
          <p className="z-50">{t('selectUser.imAnOrganizer')}</p>
        </div>
      </div>
      <div className="info z-1">
        {roleSelect === TypeRole?.FAN ? (
          <>
            <FanIcon ref={setElemRef} className="absolute top-0 left-[0] fan-icon" />
            <p
              ref={setTextRef}
              style={{ position: 'absolute', top: `calc(${height}px - 50px)` }}
              className="px-[10px] md:px-[0] info-des z-99 text-base whitespace-pre-wrap md:w-[424px]"
            >
              {t('selectUser.descriptionFan')}
            </p>
          </>
        ) : (
          <>
            <OrganizerIcon ref={setOrgSvgRef} className="absolute org-icon top-0 right-[0]" />
            <p
              style={{ position: 'absolute', top: `calc(${orgSvgHeight}px - 50px)` }}
              ref={setTextOrgRef}
              className="info-des text-base px-[10px] md:px-[0] whitespace-pre-wrap md:w-[424px]"
            >
              {t('selectUser.descriptionOrganizer')}
            </p>
          </>
        )}
      </div>
      <ButtonContained
        buttonType="type1"
        className="btn-continue absolute !m-0 !w-[212px]"
        style={{
          top: `calc(${height ?? orgSvgHeight}px + ${textFanHeight ?? textOrgHeight}px + 72px)`,
        }}
        onClick={onContinue}
      >
        {roleSelect === TypeRole?.FAN
          ? t('selectUser.continueFan')
          : t('selectUser.continueOrganizer')}
      </ButtonContained>
    </div>
  );
};

export default SelectRole;
