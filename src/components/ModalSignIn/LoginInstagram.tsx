import { useTranslation } from 'react-i18next';
import { LogoInstagram } from 'src/assets/icons';
import { INSTA_APP_ID, INSTAGRAM_REDIRECT_URI } from 'src/constants/env';
import { saveQueries, setCurrentEvent, setLoginProvider } from 'src/helpers/storage';
import { ELoginMethod } from 'src/store/slices/user/types';
import ButtonContained from '../Buttons/ButtonContained';
import { useLocation } from 'react-router-dom';
import { useWeb3Auth } from 'src/web3Auth/Web3AuthProvider';
import { ToastMessage } from '../Toast';

interface Props {
  eventId?: string;
}

const LoginInstagram = ({ eventId }: Props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { web3Auth } = useWeb3Auth();

  const handleLogin = async () => {
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
    setLoginProvider(ELoginMethod.JWT);
    saveQueries(location.search);
    const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${INSTA_APP_ID}&redirect_uri=${INSTAGRAM_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
    window.location.href = instagramAuthUrl;
  };

  return (
    <ButtonContained
      className="btn !md:w-[212px] !w-[212px]"
      fullWidth
      onClick={() => handleLogin()}
    >
      <img src={LogoInstagram} alt="Instagram" />
      <p className="text-[16px] !text-white pl-5">{t('signIn.continueWithInstagram')}</p>
    </ButtonContained>
  );
};

export default LoginInstagram;
