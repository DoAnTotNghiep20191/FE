import React from 'react';
import { useTranslation } from 'react-i18next';
import { BackIcon, CheckedStep } from 'src/assets/icons';
import './styles/headerModal.scss';
interface IHeaderModal {
  step: number;
  isEdit: boolean;
  onBack?: () => void;
}

const HEAD_DES = ['coreDetails', 'createYourChallenge', 'addReward'];

const HeaderModal: React.FC<IHeaderModal> = (props) => {
  const { step, isEdit, onBack } = props;

  const { t } = useTranslation('campaigns');

  return (
    <div className="modal-header relative">
      <p className="modal-header-title">{isEdit ? t('editCampaign') : t('campaignCreation')}</p>
      <p className="modal-header-des text-center">{t(HEAD_DES[step - 1])}</p>
      <button onClick={onBack} className="absolute top-0 left-0">
        <BackIcon />
      </button>
      <div className="modal-header-box">
        {Array(3)
          .fill({})
          .map((_, index) => {
            const isLast = index === 3 - 1;
            const active = step > index + 1;
            const current = step === index + 1;
            return (
              <div
                key={`e-${index + 1}`}
                className={`modal-header-box-step  ${active && 'active'} ${current && 'current'}`}
              >
                {!active ? (
                  <div className="step">
                    <p className="count">{index + 1}</p>
                  </div>
                ) : (
                  <CheckedStep />
                )}
                {isLast || <div className={`line`} />}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default HeaderModal;
