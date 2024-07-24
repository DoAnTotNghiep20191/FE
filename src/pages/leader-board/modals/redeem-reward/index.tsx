import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalComponent from 'src/components/Modals';
import { WIDTH_FORM_MODAL } from 'src/constants';
import Verification from 'src/components/Verification';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import './styles.scss';
import { RewardCampaignItemRes } from 'src/store/slices/campaign/types';
interface IRedeemReward {
  open: boolean;
  onCancel: () => void;
  step: number;
  code: string;
  isErrorCode: boolean;
  onChangeCode: (code: string) => void;
  onRedeemCode: () => void;
  isLoading: boolean;
  reward?: RewardCampaignItemRes;
}

const RedeemRewardModal: React.FC<IRedeemReward> = (props) => {
  const { open, onCancel, step, isErrorCode, onChangeCode, onRedeemCode, isLoading, reward } =
    props;

  const { t } = useTranslation('campaigns');
  const handleCancel = () => {
    onCancel();
  };
  return (
    <div>
      <ModalComponent
        open={open}
        width={WIDTH_FORM_MODAL}
        centered
        onCancel={handleCancel}
        destroyOnClose
        // isCloseMobile={isSuccess ? false : true}
      >
        <div className="full-height flex flex-col items-center justify-between py-[20px] md:h-[auto]">
          <div className="flex flex-col justify-center items-center">
            <span className=" text-center text-[24px] mt-5">{t('redeemReward')}</span>
            {step === 1 && (
              <div className="flex flex-col justify-center items-center mt-2">
                <span className="mb-[58px] text-center">{t('enterFourDigit')}</span>
                <Verification
                  className="verification-input"
                  length={4}
                  validChars="A-Za-z0-9"
                  isError={isErrorCode}
                  onChange={onChangeCode}
                />
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col justify-center items-center mt-2">
                <div className="flex flex-col justify-center items-center mb-11">
                  <span className="mb-[20px] text-center">{t('codeValid')}</span>
                  <span>{t('startInTheReward', { reward: reward?.item || '' })}</span>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col justify-center items-center mt-2">
                <div className="flex flex-col justify-center items-center mb-11">
                  <span className="mb-[20px] text-center">{t('codeInValid')}</span>
                  <span>{t('codeIsUsed')}</span>
                </div>
              </div>
            )}
          </div>
          <div>
            {step === 1 && (
              <ButtonContained
                className="mt-[60px]"
                buttonType="type1"
                onClick={() => onRedeemCode()}
                loading={isLoading}
              >
                <span className="w-[180px]">{t('verifyCode')}</span>
              </ButtonContained>
            )}
            {step === 2 && (
              <ButtonContained className="mt-[60px]" buttonType="type2" onClick={() => onCancel()}>
                <span className="w-[180px]">{t('done')}</span>
              </ButtonContained>
            )}
            {step === 3 && (
              <ButtonContained className="mt-[60px]" buttonType="type2" onClick={() => onCancel()}>
                <span className="w-[180px]">{t('close')}</span>
              </ButtonContained>
            )}
          </div>
        </div>
      </ModalComponent>
    </div>
  );
};

export default RedeemRewardModal;
