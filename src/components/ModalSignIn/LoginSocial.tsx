import { useTranslation } from 'react-i18next';
import { BackIcon } from 'src/assets/icons';
import LoginGoogle from './LoginGoogle';
import LoginKakao from './LoginKakao';
import LoginTwitter from './LoginTwitter';
import './styles/login-social.scss';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoginInstagram from './LoginInstagram';

interface ILoginSocial {
  onBack: () => void;
}

export const getIdFromPath = (path: string) => {
  const matches = path.match(/\/events\/\d+$/g);
  if (matches && matches.length > 0) {
    return matches[0].replace(/\/events\//g, '');
  }
};

const LoginSocial = ({ onBack }: ILoginSocial) => {
  const { t } = useTranslation();
  const [userAgentData, setUserAgentData] = useState({
    type: 'Android',
    isWebView: false,
  });
  const location = useLocation();

  const handleCheckWebview = () => {
    let type = 'IOS';
    const navigator: any = window.navigator;
    const standalone = navigator.standalone;
    const userAgent = navigator.userAgent.toLowerCase();
    const safari = /safari/.test(userAgent);
    const ios = /iphone|ipod|ipad/.test(userAgent);
    const isWebView = ios ? !standalone && !safari : /\bwv\b/.test(userAgent);
    const isAndroid = /android/i.test(userAgent);

    if (ios) {
      type = 'IOS';
    } else if (isAndroid) {
      type = 'Android';
    } else {
      type = 'Others';
    }

    setUserAgentData({
      isWebView,
      type,
    });
    return isWebView;
  };

  useEffect(() => {
    handleCheckWebview();
  }, []);
  return (
    <div className="form-container">
      <button className="btn-back" onClick={onBack}>
        <BackIcon />
      </button>
      <div className="other-social">
        <p className="modal-title">{t('signIn.continueToV3RIFIED')}</p>
        <div className="socials flex flex-col justify-center items-center">
          <LoginGoogle userAgentData={userAgentData} eventId={getIdFromPath(location.pathname)} />
          <LoginInstagram eventId={getIdFromPath(location.pathname)} />
          <LoginTwitter eventId={getIdFromPath(location.pathname)} />
          <LoginKakao eventId={getIdFromPath(location.pathname)} />
        </div>
      </div>
    </div>
  );
};

export default LoginSocial;
