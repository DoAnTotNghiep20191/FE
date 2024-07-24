import { WALLET_ADAPTERS } from '@web3auth/base';
import axios from 'axios';
import qs from 'qs';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ToastMessage } from 'src/components/Toast';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  KAKAO_REDIRECT_URI,
  KAKAO_REST_API_KEY,
} from 'src/constants/env';
import { C1001, C1012, MSG } from 'src/constants/errorCode';
import { PATHS } from 'src/constants/paths';
import { onLogError } from 'src/helpers';
import { clearLoginProvider, clearStorageLoginType } from 'src/helpers/storage';
import { useAppSelector } from 'src/store';
import { getAccessToken } from 'src/store/selectors/user';
import { ESocialNetworkingLoginMethod } from 'src/store/slices/campaign/types';
import {
  useChallengeLoginMutation,
  useGetUserInfoQuery,
  useLoginWithGoogleMutation,
  useLoginWithInstagramMutation,
  useLoginWithKakaoMutation,
  useLoginWithTwitterMutation,
} from 'src/store/slices/user/api';
import { useWeb3Auth } from 'src/web3Auth/Web3AuthProvider';

export const useLogin = () => {
  const [loginWithTwitter] = useLoginWithTwitterMutation();
  const [loginWithGoogle] = useLoginWithGoogleMutation();
  const [loginWithKakao] = useLoginWithKakaoMutation();
  const [loginWithInstagram] = useLoginWithInstagramMutation();
  const [challengeLogin] = useChallengeLoginMutation();
  const refreshToken = useAppSelector(getAccessToken);
  const { t } = useTranslation();
  const { web3Auth } = useWeb3Auth();
  const history = useHistory();

  useGetUserInfoQuery(undefined, { skip: !refreshToken });

  const exchangeKakaoToken = async (code = '') => {
    try {
      if (!web3Auth) {
        ToastMessage.error('Web3auth not initialized yet');
        return;
      }
      const tokenEndpoint = 'https://kauth.kakao.com/oauth/token';
      const requestBody = qs.stringify({
        grant_type: 'authorization_code',
        client_id: KAKAO_REST_API_KEY,
        redirect_uri: KAKAO_REDIRECT_URI,
        code: code,
      });
      const res = await axios.post(tokenEndpoint, requestBody);
      const response = await loginWithKakao({ token: res?.data.access_token }).unwrap();
      await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: 'jwt',
        extraLoginOptions: {
          id_token: response.data.token,
          verifierIdField: 'sub', // sub, email, or custom
        },
      });
      ToastMessage.success(t(MSG[C1012]));
    } catch (err: any) {
      console.error(err);
      clearLoginProvider();
      clearStorageLoginType();
      history.push(PATHS.events);
      ToastMessage.error(t(MSG[err?.data?.validator_errors || C1001]));
    }
  };

  const exchangeTwitterToken = async (code = '') => {
    try {
      if (!web3Auth) {
        ToastMessage.error('Web3auth not initialized yet');
        return;
      }

      const response = await loginWithTwitter({ token: code }).unwrap();

      await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: 'jwt',
        extraLoginOptions: {
          id_token: response.data.token,
          verifierIdField: 'sub', // sub, email, or custom
        },
      });
    } catch (err: any) {
      console.error(err);
      clearLoginProvider();
      clearStorageLoginType();
      history.push(PATHS.events);
      ToastMessage.error(t(MSG[err?.data?.validator_errors || C1001]));
    }
  };

  const exchangeInstaToken = async (code = '') => {
    try {
      if (!web3Auth) {
        ToastMessage.error('Web3auth not initialized yet');
        return;
      }

      const response = await loginWithInstagram({ token: code }).unwrap();

      await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: 'jwt',
        extraLoginOptions: {
          id_token: response.data.token,
          verifierIdField: 'sub', // sub, email, or custom
        },
      });
    } catch (err: any) {
      console.error(err);
      clearLoginProvider();
      clearStorageLoginType();
      history.push(PATHS.events);
      ToastMessage.error(MSG[err?.data?.validator_errors || C1001]);
    }
  };

  const exchangeGoogleToken = async (code: string) => {
    const tokenExchangeData = {
      code: code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    };
    try {
      const res = await axios.post('https://www.googleapis.com/oauth2/v4/token', tokenExchangeData);
      const response = await loginWithGoogle({ token: res?.data?.access_token }).unwrap();
      if (!web3Auth) {
        ToastMessage.error('Web3auth not initialized yet');
        return;
      }
      await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: 'jwt',
        extraLoginOptions: {
          id_token: response.data.token,
          verifierIdField: 'sub', // sub, email, or custom
        },
      });
    } catch (err: any) {
      console.error(err);
      clearLoginProvider();
      clearStorageLoginType();
      history.push(PATHS.events);
      ToastMessage.error(t(MSG[err?.data?.validator_errors || C1001]));
    }
  };

  const exchangeChallengeToken = async (code = '', platform: ESocialNetworkingLoginMethod) => {
    try {
      await challengeLogin({
        exchangeCode: code,
        socialPlatform: platform,
        state: 'string',
      }).unwrap();
      window.close();
    } catch (error) {
      onLogError(error);
      window.close();
    }
  };

  return {
    exchangeKakaoToken,
    exchangeGoogleToken,
    exchangeInstaToken,
    exchangeTwitterToken,
    exchangeChallengeToken,
  };
};
