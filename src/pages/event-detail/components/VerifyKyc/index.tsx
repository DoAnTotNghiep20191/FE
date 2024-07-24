import { get } from 'lodash';
import Persona from 'persona';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import { ToastMessage } from 'src/components/Toast';
import { PURCHASE_STEP } from 'src/constants';
import { C1081, MSG } from 'src/constants/errorCode';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';
import { useAppSelector } from 'src/store';
import { getUserInfo } from 'src/store/selectors/user';
import { useVerifyKYCMutation } from 'src/store/slices/profile/api';
import { useLazyGetUserInfoQuery, useUpdateKycMutation } from 'src/store/slices/user/api';
import { EUserKycStatus } from 'src/store/slices/user/types';

interface VerifyKycProps {
  setPurchaseStep: Dispatch<SetStateAction<number>>;
}

export default function VerifyKyc({ setPurchaseStep }: VerifyKycProps) {
  const { t } = useTranslation();
  const [onGetKYC] = useVerifyKYCMutation();
  const [updateKyc] = useUpdateKycMutation();
  const [getInfo] = useLazyGetUserInfoQuery();
  const { rudderAnalytics } = useRudderStack();
  const userInfo = useAppSelector(getUserInfo);

  const [isLoadingKyc, setLoadingKyc] = useState(false);

  const onVerifyKYC = async () => {
    try {
      setLoadingKyc(true);
      const res = await onGetKYC();
      const client: any = new Persona.Client({
        inquiryId: get(res, 'data.data.inquiryId', ''),
        onComplete: async ({ inquiryId, status }) => {
          if (status === 'completed') {
            const res = await updateKyc(inquiryId).unwrap();
            const statusKyc = get(res, 'data.status', EUserKycStatus.PENDING_VERIFIED);
            rudderAnalytics?.track(ERudderStackEvents.UserKYCSubmitted, {
              eventType: ERudderStackEvents.UserKYCSubmitted,
              data: {
                userId: userInfo?.id,
                status: statusKyc,
              },
            });
            if (statusKyc === EUserKycStatus.VERIFIED) {
              setPurchaseStep(PURCHASE_STEP.REVIEW_TICKET);
              getInfo({});
              return;
            }
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
  };

  return (
    <div className="mt-[30px]">
      <div className="flex-row justify-center items-center">
        <div>
          <p className="font-loos text-[24px] text-center">{t('verifyKYC.title')}</p>
        </div>
      </div>
      <div className="px-[80px]">
        <p className="text-center text-[14px] my-[16px]">{t('verifyKYC.itLooksLikeYour')}</p>
        <p className="text-center text-[14px] mb-[81px]">{t('verifyKYC.dueToKorean')}</p>
      </div>
      <div className="flex justify-center pb-[40px]">
        <ButtonContained
          loading={isLoadingKyc}
          onClick={onVerifyKYC}
          className="w-[212px]"
          buttonType="type2"
        >
          {t('verifyKYC.verifyMyIdentity')}
        </ButtonContained>
      </div>
    </div>
  );
}
