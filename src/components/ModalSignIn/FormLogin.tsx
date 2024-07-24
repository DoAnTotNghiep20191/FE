import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { ClockIcon, EmailIcon } from 'src/assets/icons';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import InputField from 'src/components/Inputs';
import {
  C1001,
  C1003,
  C1004,
  C1005,
  C1014,
  MSG,
  S4001,
  S40013,
  S4006,
  S4041,
} from 'src/constants/errorCode';
import { disableSpace, ellipseAddress } from 'src/helpers';
import { useMobile } from 'src/hooks/useMobile';
import { useAppSelector } from 'src/store';
import { ELoginMethod, TypeRole } from 'src/store/slices/user/types';
import { ToastMessage } from '../Toast';
import ReturnIcon from 'src/assets/icons/events/return-arrow-ic.svg';
import chatIcon from 'src/assets/icons/events/chat-icon.svg';
import TwitterIcon from 'src/assets/icons/events/twitter-icon.svg';
import GoogleIcon from 'src/assets/icons/events/google-icon.svg';

import './styles/form-login.scss';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { getUserInfo } from 'src/store/selectors/user';
import { useWeb3Auth } from 'src/web3Auth/Web3AuthProvider';
import { WALLET_ADAPTERS } from '@web3auth/base';
import { useLazyGetJwtTokenQuery } from 'src/store/slices/user/api';
import { useState } from 'react';
import { saveQueries, setCurrentEvent, setLoginProvider } from 'src/helpers/storage';
import { useLocation } from 'react-router-dom';

interface IFormLogin {
  selectRole: TypeRole;
  onBack: () => void;
  onRedirectSignUp: () => void;
  onLoginOtherSocial: () => void;
  onWalletConnect: () => void;
  onForgot: () => void;
  onRedirectVerify: (email: string) => void;
  eventId?: string;
}

interface ILoginSocialOther {
  onLoginOtherSocial: () => void;
  onWalletConnect: () => void;
}

export const LoginSocialOther = ({ onLoginOtherSocial, onWalletConnect }: ILoginSocialOther) => {
  const { account, connected, isLoading } = useWallet();
  const userInfo = useAppSelector(getUserInfo);

  const isMobile = useMobile();
  const { t } = useTranslation();
  return (
    <div className="login-social w-full items-center">
      <div className="login-social-with">
        <div className="line" />
        <p className="or-login">{t('signIn.orLoginWith')}</p>
        <div className="line" />
      </div>
      <ButtonContained
        buttonType={'type2'}
        className="btn btn-wc !relative flex w-[212px] justify-center"
        loading={isLoading}
        onClick={onWalletConnect}
      >
        <p className={`!text-[16px] !font-[500] !text-[#008AD8]`}>
          {connected && userInfo
            ? `SignIn with ${isMobile ? ellipseAddress(account?.address, 3) : ellipseAddress(account?.address)}`
            : t('signIn.continueWithWallet')}{' '}
        </p>
        <p></p>
      </ButtonContained>
      <div className="flex flex-col items-end gap-[4px]">
        <ButtonContained
          buttonType={'type2'}
          className={`btn w-[212px]`}
          onClick={onLoginOtherSocial}
        >
          <p className={`!text-[16px] !font-[500] !text-[#008AD8]`}>
            {t('signIn.continueWithOtherSocials')}
          </p>
        </ButtonContained>
        <div className="flex gap-[5px]">
          <img src={ReturnIcon} />
          <img src={GoogleIcon} />
          {/* <img src={InstaIcon} /> */}
          <img src={TwitterIcon} />
          <img src={chatIcon} />
        </div>
      </div>
    </div>
  );
};

const FormLogin = ({
  selectRole,
  onRedirectSignUp,
  onLoginOtherSocial,
  onWalletConnect,
  onForgot,
  onRedirectVerify,
  eventId,
}: IFormLogin) => {
  const [loading, setLoading] = useState(false);
  const [getJwtToken, { isLoading }] = useLazyGetJwtTokenQuery();
  const location = useLocation();

  const { web3Auth } = useWeb3Auth();

  const [form] = Form.useForm();
  const { t } = useTranslation();

  const handleVerifyCode = async (email: string) => {
    try {
      // await sendEmailFan({ email: email });
      ToastMessage.success(t(MSG[C1014]));
      onRedirectVerify && onRedirectVerify(email);
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleSignIn = async (values: { email: string; password: string }) => {
    try {
      if (loading || isLoading) {
        return;
      }
      if (!web3Auth) {
        ToastMessage.error('Web3auth not initialized yet');
        return;
      }
      if (web3Auth.connected) {
        web3Auth.logout();
        return;
      }
      setLoading(true);

      const jwtResponse = await getJwtToken({
        email: values.email,
        password: values.password,
      }).unwrap();

      if (eventId) {
        setCurrentEvent(eventId);
      }
      setLoginProvider(ELoginMethod.JWT);
      saveQueries(location.search);

      await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: 'jwt',
        extraLoginOptions: {
          id_token: jwtResponse.data.token,
          verifierIdField: 'sub', // sub, email, or custom
        },
      });
    } catch (error: any) {
      console.error(error);
      const validator_errors = error?.data?.validator_errors;
      if (validator_errors === S40013 || validator_errors === S4006 || validator_errors === S4041) {
        form.setFields([
          {
            name: 'password',
            errors: [t(MSG[S40013])],
          },
        ]);
        setLoading(false);
        return;
      }
      if (validator_errors === S4001) {
        handleVerifyCode(values?.email);
        setLoading(false);
        return;
      }
      ToastMessage.error(t(MSG[validator_errors || C1001]));
    }
    setLoading(false);
  };

  const handlePressEnter = (e: any) => {
    const keyCode = e.keyCode;
    if (keyCode === 13) form.submit();
  };

  return (
    <div
      className={`form-sign-in-container ${selectRole === TypeRole.FAN ? 'h-[844px] pt-[48px]' : 'h-[658px]'}`}
    >
      <div className="form-login flex flex-col items-center">
        <p className="modal-title">{t('signIn.title')}</p>
        <p className="modal-des">{t('signIn.description')}</p>
        <Form
          form={form}
          name="control-hooks"
          autoComplete="off"
          onFinish={handleSignIn}
          onKeyDown={handlePressEnter}
          initialValues={{
            email: '',
            password: '',
          }}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: t(MSG[C1004]),
              },
              {
                type: 'email',
                message: t(MSG[C1003]),
              },
              disableSpace(form, 'email'),
            ]}
            className="form-input"
          >
            <InputField
              className="w-[275px]"
              widthFull
              placeholder={t('signIn.email')}
              name="email"
              prefix={<EmailIcon />}
              // onKeyDown={handlePressEnter}
            />
          </Form.Item>
          <Form.Item
            name="password"
            className="form-input"
            rules={[{ required: true, message: t(MSG[C1005]) }, disableSpace(form, 'password')]}
          >
            <InputField
              className="w-[275px]"
              widthFull
              placeholder={t('signIn.password')}
              type="password"
              prefix={<ClockIcon />}
              // onKeyDown={handlePressEnter}
            />
          </Form.Item>
        </Form>

        <div className="text-right self-end">
          <p className="forgot tex" onClick={onForgot}>
            {t('signIn.forgot')}
          </p>
        </div>
        <ButtonContained
          fullWidth
          className={`!w-[212px] btn-signIn ${selectRole === TypeRole.FAN ? '!mt-[80px]' : 'mobile'}`}
          buttonType={'type1'}
          loading={loading || isLoading}
          onClick={() => {
            form.submit();
          }}
        >
          {t('signIn.buttonSignIn')}
        </ButtonContained>

        {selectRole === TypeRole.FAN && (
          <LoginSocialOther
            onLoginOtherSocial={onLoginOtherSocial}
            onWalletConnect={onWalletConnect}
          />
        )}
        <ButtonContained
          fullWidth
          className={`${selectRole === TypeRole.FAN ? 'mt-[90px]' : 'mt-[20px] mobile'}  !w-[212px] mx-auto`}
          buttonType="type4"
          onClick={onRedirectSignUp}
        >
          {t('signIn.signUpNow')}
        </ButtonContained>
      </div>
    </div>
  );
};

export default FormLogin;
