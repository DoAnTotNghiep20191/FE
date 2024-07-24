import { useTranslation } from 'react-i18next';
import { LogoTwitter } from 'src/assets/icons';
import {
  saveQueries,
  setCurrentEvent,
  setLoginProvider,
  setStorageLoginType,
} from 'src/helpers/storage';
import { ELoginMethod, TypeLogin } from 'src/store/slices/user/types';
import ButtonContained from '../Buttons/ButtonContained';
import { useLocation } from 'react-router-dom';
import { TWITTER_REDIRECT_URI, TWITTER_CLIENT_ID } from 'src/constants/env';

interface Props {
  eventId?: string;
}

const LoginTwitter = ({ eventId }: Props) => {
  const { t } = useTranslation();
  const location = useLocation();

  const handleLogin = async () => {
    if (eventId) {
      setCurrentEvent(eventId);
    }
    setStorageLoginType(TypeLogin.TWITTER);
    setLoginProvider(ELoginMethod.JWT);
    saveQueries(location.search);
    const twitterAuthUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${TWITTER_CLIENT_ID}&redirect_uri=${TWITTER_REDIRECT_URI}&scope=tweet.read%20users.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain`;
    window.location.href = twitterAuthUrl;
  };

  return (
    <ButtonContained className="btn !md:w-[212px] !w-[212px]" fullWidth onClick={handleLogin}>
      <img src={LogoTwitter} alt="LogoTwitter" />
      <p className="text-[16px] !text-white">{t('signIn.continueWithX')}</p>
    </ButtonContained>
  );
};

export default LoginTwitter;
