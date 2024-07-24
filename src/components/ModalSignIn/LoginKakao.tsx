import { useEffect } from 'react';
import {
  saveQueries,
  setCurrentEvent,
  setLoginProvider,
  setStorageLoginType,
} from 'src/helpers/storage';
import { LogoKakao } from 'src/assets/icons';
import ButtonContained from '../Buttons/ButtonContained';
import { useTranslation } from 'react-i18next';
import { ELoginMethod, TypeLogin } from 'src/store/slices/user/types';
import { useLocation } from 'react-router-dom';
import { KAKAO_KEY, KAKAO_REDIRECT_URI } from 'src/constants/env';
import { ExtendedWindow } from './types';

interface Props {
  eventId?: string;
}

export const loadSdk = () => {
  return new Promise((resolve) => {
    const js: HTMLScriptElement = document.createElement('script');

    js.id = 'kakao-sdk';
    js.src = '//t1.kakaocdn.net/kakao_js_sdk/2.6.0/kakao.min.js';
    js.onload = resolve;

    document.body.append(js);
  });
};

declare let window: ExtendedWindow;

const LoginKakao = ({ eventId }: Props) => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const initKakao = async () => {
      await loadSdk();
      window.Kakao.init(KAKAO_KEY);
    };

    initKakao();
  }, []);

  const handleLoginKakao = () => {
    if (eventId) {
      setCurrentEvent(eventId);
    }
    setStorageLoginType(TypeLogin.KAKAO);
    setLoginProvider(ELoginMethod.JWT);
    saveQueries(location.search);
    (window?.Kakao?.Auth as any)?.authorize({
      redirectUri: KAKAO_REDIRECT_URI,
      throughTalk: false,
    });
  };

  return (
    <ButtonContained className="btn !md:w-[212px] !w-[212px]" fullWidth onClick={handleLoginKakao}>
      <img src={LogoKakao} alt="LogoKakao" />
      <p className="text-[16px] !text-white">{t('signIn.continueWithKakao')}</p>
    </ButtonContained>
  );
};

export default LoginKakao;
