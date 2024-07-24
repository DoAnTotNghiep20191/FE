import { useTranslation } from 'react-i18next';
import { LogoGoogle } from 'src/assets/icons';
import { MSG, S40061 } from 'src/constants/errorCode';
import ButtonContained from '../Buttons/ButtonContained';
import { ToastMessage } from '../Toast';
import {
  saveQueries,
  setCurrentEvent,
  setLoginProvider,
  setStorageLoginType,
} from 'src/helpers/storage';

import { ELoginMethod, TypeLogin } from 'src/store/slices/user/types';
import { useLocation } from 'react-router-dom';
import { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } from 'src/constants/env';
import { useWeb3Auth } from 'src/web3Auth/Web3AuthProvider';
import { useLogin } from 'src/hooks/useLogin';

interface Props {
  eventId?: string;
  userAgentData?: {
    type: string;
    isWebView: boolean;
  };
}

const mobileOSType = ['Android', 'IOS'];

const LoginGoogle = ({ eventId, userAgentData }: Props) => {
  const location = useLocation();
  const { web3Auth } = useWeb3Auth();
  const { exchangeGoogleToken } = useLogin();

  const { t } = useTranslation();

  const handleDeeplink = () => {
    const url = import.meta.env.VITE_SITE_URI?.replace(/^https:\/\//, '');

    if (userAgentData?.type === 'Android' && userAgentData.isWebView) {
      window.open(`intent:${import.meta.env.VITE_SITE_URI}#Intent;end`, '__blank');
    } else if (userAgentData?.type === 'IOS' && userAgentData.isWebView) {
      window.open(`googlechrome://${url}`, '__blank');
    }

    ToastMessage.error(t(MSG[S40061]));
  };

  const handleLoginGoogle = () => {
    if (!web3Auth) {
      ToastMessage.error('Web3auth not initialized yet');
      return;
    }
    if (web3Auth.connected) {
      web3Auth.logout();
      return;
    }

    if (eventId) {
      setCurrentEvent(eventId);
    }
    setStorageLoginType(TypeLogin.GOOGLE);
    setLoginProvider(ELoginMethod.JWT);
    saveQueries(location.search);
    const instagramAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?gsiwebsdk=3&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&scope=openid%20profile%20email&access_type=offline&response_type=code&include_granted_scopes=true&enable_granular_consent=true&service=lso&o2v=2&ddm=0&flowName=GeneralOAuthFlow`;
    window.location.href = instagramAuthUrl;
  };

  return (
    <>
      {userAgentData?.isWebView && mobileOSType.includes(userAgentData.type) ? (
        <ButtonContained
          onClick={handleDeeplink}
          className="btn !md:w-[212px] !w-[212px]"
          fullWidth
        >
          <img src={LogoGoogle} alt="LogoGoogle" />
          <p className="text-[16px] !text-white">{t('signIn.continueWithGoogle')}</p>
        </ButtonContained>
      ) : (
        <ButtonContained
          onClick={handleLoginGoogle}
          className="btn !md:w-[212px] !w-[212px]"
          fullWidth
        >
          <img src={LogoGoogle} alt="LogoGoogle" />
          <p className="text-[16px] !text-white">{t('signIn.continueWithGoogle')}</p>
        </ButtonContained>
      )}
    </>
  );
};

export default LoginGoogle;
