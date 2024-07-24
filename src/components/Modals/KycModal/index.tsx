import { useAppSelector } from 'src/store';
import ModalComponent from '..';
import { getUserInfo } from 'src/store/selectors/user';
import PersonaReact from 'persona-react';
import { useLazyGetUserInfoQuery, useUpdateKycMutation } from 'src/store/slices/user/api';
import get from 'lodash/get';
import { EUserKycStatus } from 'src/store/slices/user/types';
import { useRefreshKYCMutation, useVerifyKYCMutation } from 'src/store/slices/profile/api';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { logout } from 'src/store/slices/user';
import { PATHS } from 'src/constants/paths';
import { useHistory } from 'react-router-dom';
import { baseQueryApi } from 'src/store/baseQueryApi';
import { C1100, MSG } from 'src/constants/errorCode';
import { ToastMessage } from 'src/components/Toast';
import { Spin } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';

const KycModal = () => {
  const userInfo = useAppSelector(getUserInfo);
  const { t } = useTranslation();
  const { rudderAnalytics } = useRudderStack();
  const [updateKyc] = useUpdateKycMutation();
  const [getInfo] = useLazyGetUserInfoQuery();
  const [onGetKYC] = useVerifyKYCMutation();
  const [refreshKycSession] = useRefreshKYCMutation();
  const [savedInquiryId, setInquiryId] = useState('');
  const dispatch = useDispatch();
  const { disconnect } = useWallet();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleLogOut = async () => {
    if (userInfo?.loginMethod === 'wallet') {
      try {
        await disconnect();
        localStorage.removeItem('AptosWalletName');
      } catch (error) {
        console.error(error);
      }
    }
    dispatch(logout());
    // logout rudder stack
    if (rudderAnalytics) {
      rudderAnalytics.identify('', { isLoggedIn: false });
      rudderAnalytics.reset();
    }
    // end logout rudder stack
    history.replace(PATHS.events);
    dispatch(baseQueryApi.util.resetApiState());
    ToastMessage.success(t(MSG[C1100]));
  };

  const handleGetInquiryId = async () => {
    try {
      if (userInfo && userInfo?.status === 'active') {
        const res = await onGetKYC();
        const inquiryId = get(res, 'data.data.inquiryId', '');
        setInquiryId(inquiryId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleGetInquiryId();
  }, [userInfo]);

  const handleReload = async () => {
    try {
      if (userInfo && userInfo?.status === 'active') {
        setInquiryId('');
        setLoading(true);
        const res = await refreshKycSession();
        const inquiryId = get(res, 'data.data.inquiryId', '');
        setInquiryId(inquiryId);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const open =
    userInfo?.kycStatus !== EUserKycStatus.VERIFIED &&
    userInfo?.status === 'active' &&
    import.meta.env.VITE_BYPASS_KYC !== 'true';

  return (
    <ModalComponent
      centered
      open={open}
      zIndex={70}
      width={684}
      isClose={true}
      onCancel={handleLogOut}
      destroyOnClose
      className="relative"
    >
      <div className="kyc-modal-container font-loos">
        <button className="absolute top-[16px] left-[16px]">
          <SyncOutlined
            onClick={handleReload}
            spin={loading}
            style={{ fontSize: '20px', color: '#08c' }}
          />
        </button>
        <div className="kyc-modal-container__header">
          <p className="text-[24px] text-center">{t('kycModal.title')}</p>
          <p className="text-center">{t('kycModal.subTitle')}</p>
        </div>
        <div className="kyc-modal-container__body mt-[40px] flex justify-center">
          <div className="max-w-[400px] w-[100%] h-[650px] flex justify-center">
            {savedInquiryId ? (
              <PersonaReact
                inquiryId={savedInquiryId}
                onLoad={() => {
                  console.info('Persona loaded inline');
                }}
                onComplete={async ({ inquiryId }) => {
                  // Inquiry completed. Optionally tell your server about it.
                  const updateKycResponse = await updateKyc(inquiryId).unwrap();
                  const statusKyc = get(
                    updateKycResponse,
                    'data.data.status',
                    EUserKycStatus.PENDING_VERIFIED,
                  );
                  rudderAnalytics?.track(ERudderStackEvents.UserKYCSubmitted, {
                    eventType: ERudderStackEvents.UserKYCSubmitted,
                    data: {
                      userId: updateKycResponse?.data?.userId,
                      status: statusKyc,
                    },
                  });
                  if (statusKyc === EUserKycStatus.VERIFIED) {
                    getInfo({});
                    return;
                  }
                }}
              />
            ) : (
              <div className="h-[100%] w-[100%] flex justify-center items-center">
                <Spin size="large" />
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalComponent>
  );
};

export default KycModal;
