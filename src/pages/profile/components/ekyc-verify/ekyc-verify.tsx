import get from 'lodash/get';
import Persona from 'persona';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VerifyIcon } from 'src/assets/icons';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import { ToastMessage } from 'src/components/Toast';
import { C1081, MSG } from 'src/constants/errorCode';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';
import { useAppSelector } from 'src/store';
import { getUserInfo } from 'src/store/selectors/user';
import { useVerifyKYCMutation } from 'src/store/slices/profile/api';
import { useUpdateKycMutation } from 'src/store/slices/user/api';
import { EUserKycStatus } from 'src/store/slices/user/types';

interface IEkycVerifyButton {
  kycStatus?: string;
  imgUpload?: File;
}

export const EkycVerifyButton = ({ kycStatus }: IEkycVerifyButton) => {
  const [status, setStatus] = useState<EUserKycStatus>(EUserKycStatus.NOT_VERIFIED);
  const [isLoadingKyc, setLoadingKyc] = useState(false);
  const [updateKyc] = useUpdateKycMutation();
  const [onGetKYC] = useVerifyKYCMutation();
  const { rudderAnalytics } = useRudderStack();
  const userInfo = useAppSelector(getUserInfo);

  async function onVerifyKYC() {
    try {
      setLoadingKyc(true);
      const res = await onGetKYC();
      const client: any = new Persona.Client({
        inquiryId: get(res, 'data.data.inquiryId', ''),
        onComplete: async ({ inquiryId, status }) => {
          if (status === 'completed') {
            const res = await updateKyc(inquiryId).unwrap();
            const statusKyc = get(res, 'data.data.status', EUserKycStatus.PENDING_VERIFIED);
            rudderAnalytics?.track(ERudderStackEvents.UserKYCSubmitted, {
              eventType: ERudderStackEvents.UserKYCSubmitted,
              data: {
                userId: userInfo?.id,
                status: statusKyc,
              },
            });
            setStatus(statusKyc);
            return;
          }
          return ToastMessage.error(t(MSG[C1081]));
        },
      });
      client.open();
      rudderAnalytics?.track(ERudderStackEvents.UserKYCStarted, {
        eventType: ERudderStackEvents.UserKYCStarted,
        data: {
          userId: userInfo?.id,
        },
      });
    } catch (error) {
      console.error(error);
      return ToastMessage.error(t(MSG[C1081]));
    } finally {
      setLoadingKyc(false);
    }
  }

  const { t } = useTranslation();
  return (
    <>
      {status === EUserKycStatus.VERIFIED || kycStatus === EUserKycStatus.VERIFIED ? (
        <VerifyIcon />
      ) : (
        <>
          {status === EUserKycStatus.PENDING_VERIFIED ||
          kycStatus === EUserKycStatus.PENDING_VERIFIED ? (
            <ButtonContained
              buttonType="type1"
              className="md:w-[212px]"
              disabled={kycStatus === EUserKycStatus.PENDING_VERIFIED}
            >
              {t('profile.pending')}
            </ButtonContained>
          ) : (
            <ButtonContained
              onClick={onVerifyKYC}
              loading={isLoadingKyc}
              buttonType="type1"
              className="md:w-[212px]"
            >
              {t('profile.verifyAccount')}
            </ButtonContained>
          )}
        </>
      )}
    </>
  );
};
