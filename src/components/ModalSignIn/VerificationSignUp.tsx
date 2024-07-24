import Icon from '@ant-design/icons/lib/components/Icon';
import { useEffect, useState } from 'react';
import { VerificationIcon } from 'src/assets/icons/IconComponent';
import { useAppDispatch } from 'src/store';
import { setIsFirst } from 'src/store/slices/auth';
import {
  useSendCodeUpdateEmailMutation,
  useVerifyCodeUpdateEmailMutation,
} from 'src/store/slices/profile/api';
import {
  useLazyGetUserInfoQuery,
  useSendVerifyCodeMutation,
  useVerifyCodeEmailFanMutation,
  useVerifyCodeEmailFanRegisterMutation,
} from 'src/store/slices/user/api';
import { ELoginMethod, TypeRole } from 'src/store/slices/user/types';
import ButtonContained from '../Buttons/ButtonContained';
import { ToastMessage } from '../Toast';
import Verification from '../Verification';
import CountdownTimer from './CountdownTimer';
import './styles/verification-signup.scss';
import { useTranslation, Trans } from 'react-i18next';
import { C1014, C1029, MSG } from 'src/constants/errorCode';
import { useWeb3Auth } from 'src/web3Auth/Web3AuthProvider';
import { saveQueries, setLoginProvider } from 'src/helpers/storage';
import { useLocation } from 'react-router-dom';
import { WALLET_ADAPTERS } from '@web3auth/base';

interface IVerificationSignUp {
  email: string;
  selectRole?: TypeRole;
  isSignUp?: boolean;
  open?: boolean;
  verifySuccess?: (email: string) => void;
  onBack?: () => void;
  backToLogin?: () => void;
  isRedirectToWeb3Auth?: boolean;
}

const VerificationSignUp = ({
  email,
  selectRole,
  isSignUp = true,
  verifySuccess,
  open,
  isRedirectToWeb3Auth,
}: IVerificationSignUp) => {
  const [code, setCode] = useState('');
  const [isError, setIsError] = useState(false);
  const [activeResent, setActiveResend] = useState(false);
  const [targetDate, setTargetDate] = useState<number>(new Date().getTime());
  const { web3Auth } = useWeb3Auth();
  const location = useLocation();

  const [sendEmailFan, { isLoading: isLoadingResend }] = useSendVerifyCodeMutation();
  const [verifyCodeEmail, { isLoading }] = useVerifyCodeEmailFanMutation();
  const [fanVerifySignup, { isLoading: isVerifyLoading }] = useVerifyCodeEmailFanRegisterMutation();
  const [getProFile] = useLazyGetUserInfoQuery();

  const [sendCodeUpdateEmail] = useSendCodeUpdateEmailMutation();
  const [verifyCodeUpdateEmail] = useVerifyCodeUpdateEmailMutation();

  const { t } = useTranslation();

  function onResendCode() {
    setActiveResend(false);
    setTargetDate(new Date().getTime() + 20 * 1000);
    handleResend();
  }
  const dispatch = useAppDispatch();

  const handleVerifyCode = async () => {
    try {
      if (isSignUp) {
        if (isRedirectToWeb3Auth) {
          if (!web3Auth) {
            ToastMessage.error('Web3auth not initialized yet');
            return;
          }
          if (web3Auth?.connected) {
            web3Auth.logout();
            return;
          }

          const response = await fanVerifySignup({
            email: email,
            verificationCode: code,
          }).unwrap();

          setLoginProvider(ELoginMethod.JWT);
          saveQueries(location.search);

          await web3Auth?.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
            loginProvider: 'jwt',
            extraLoginOptions: {
              id_token: response.data.token,
              verifierIdField: 'sub', // sub, email, or custom
            },
          });
        } else {
          await verifyCodeEmail({
            email: email,
            verificationCode: code,
          }).unwrap();

          if (selectRole === TypeRole.ORGANIZER) {
            dispatch(setIsFirst(true));
          }
          await getProFile(undefined).unwrap();

          ToastMessage.success(t(MSG[C1029]));
        }
      } else {
        const res = await verifyCodeUpdateEmail({
          email: email,
          code: code,
        }).unwrap();
        if (res?.data?.isValidated) {
          verifySuccess && verifySuccess(email);
        } else {
          setIsError(true);
        }
      }
    } catch (error: any) {
      setIsError(true);
    }
  };

  const handleResend = async () => {
    try {
      if (isSignUp) {
        await sendEmailFan({ email: email });
      } else {
        await sendCodeUpdateEmail({ email: email });
      }
      ToastMessage.success(t(MSG[C1014]));
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleChange = (code: string) => {
    setCode(code);
    setIsError(false);
  };

  useEffect(() => {
    if (open) {
      sendEmailFan({ email: email });
    }
  }, [open]);

  return (
    <div className="verification-container">
      {/* {isMobile && (
        <button className="btn-back" onClick={onBack}>
          <BackIcon />
        </button>
      )} */}
      <div className="verification-form">
        {isSignUp && (
          <>
            <p className="verification-form-title text-center">{t('signUp.yourAccountHave')}</p>
            <Icon component={VerificationIcon} className="icon-verification" />
          </>
        )}
        <p className="verification-form-label">{t('signUp.verifyYourEmail')}</p>
        <p className="verification-form-des">
          <Trans i18nKey={'signUp.enterThe6Digit'} values={{ email: email }} />
        </p>
        <Verification className="verification-input" onChange={handleChange} isError={isError} />
        <div className="fixed bottom-[40px] md:relative md:mt-[170px]">
          <ButtonContained
            fullWidth
            buttonType="type1"
            onClick={handleVerifyCode}
            disabled={code?.length < 6}
            loading={isLoading || isVerifyLoading}
            className="btn-verify !w-[212px] !md:mt-[100px]"
          >
            {t('signUp.verifyCode')}
          </ButtonContained>
          <ButtonContained
            fullWidth
            onClick={onResendCode}
            loading={isLoadingResend}
            buttonType="type2"
            className="flex btn-resend !w-[212px]"
            disabled={!activeResent}
          >
            <>
              {!activeResent ? (
                <span className="flex">
                  <p className="mr-2">{t('forgot.resendIn')}</p>
                  <CountdownTimer
                    handleExpired={() => setActiveResend(true)}
                    targetDate={targetDate}
                  />
                </span>
              ) : (
                <>{t('signUp.resendCode')}</>
              )}
            </>
          </ButtonContained>
        </div>
      </div>
    </div>
  );
};

export default VerificationSignUp;
