import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { LogoGoogle, LogoInstagram, LogoKakao, LogoTwitter } from 'src/assets/icons';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import ModalComponent from 'src/components/Modals';
import LanguageModal from 'src/components/Modals/Language';
import { ToastMessage } from 'src/components/Toast';
import { DATE_FORMAT, LOGIN_METHOD, ValueStatus, WIDTH_FORM_MODAL_2 } from 'src/constants';
import { C1014, C1100, MSG } from 'src/constants/errorCode';
import { PATHS } from 'src/constants/paths';
import { ellipseAddress, getCityByCode, onLogError, transformPhoneNumber } from 'src/helpers';
import { formatDate } from 'src/helpers/formatValue';
import i18n from 'src/i18n';
import NotificationModal from 'src/pages/event-detail/components/NotificationModal';
import { useAppSelector } from 'src/store';
import { baseQueryApi } from 'src/store/baseQueryApi';
import { getUserInfo } from 'src/store/selectors/user';
import { useSwitchLanguageMutation } from 'src/store/slices/profile/api';
import { logout } from 'src/store/slices/user';
import { TypeRole } from 'src/store/slices/user/types';
import { AvatarUpload } from '../AvatarUpload';
import { EkycVerifyButton } from '../ekyc-verify/ekyc-verify';
import UpdatePassword from '../update-password';
import UpdatePersonalDetails from '../update-personal-details';
import VerificationEmail from '../verify-email';
import './styles.scss';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { LANGUAGE_CODE } from 'src/components/Locale-provider';
import { useWeb3Auth } from 'src/web3Auth/Web3AuthProvider';
import { useRudderStack } from 'src/rudderstack';

const formatedAddress = (address?: string | null) => {
  if (!address) {
    return address;
  }
  return ellipseAddress(address);
};

export const langMap = {
  [LANGUAGE_CODE.ENGLISH]: LANGUAGE_CODE.ENGLISH,
  [LANGUAGE_CODE.KOREAN]: 'kr',
};

interface Props {
  loading: boolean;
}

const PersonalProfile = ({ loading }: Props) => {
  const { t } = useTranslation();
  const userInfo = useAppSelector(getUserInfo);
  const [email, setEmail] = useState('');
  const [isVerifyEmail, setVerifyEmail] = useState(false);
  const [isUpdatePassword, setUpdatePassword] = useState(false);
  const [isUpdateSuccess, setUpdateSuccess] = useState(false);
  const [isUpdatePersonalDetails, setUpdatePersonalDetails] = useState(false);
  const [isOpenLang, setIsOpenLang] = useState(false);
  const [switchLanguage] = useSwitchLanguageMutation();
  const { disconnect } = useWallet();
  const { web3Auth } = useWeb3Auth();
  const { rudderAnalytics } = useRudderStack();

  const dispatch = useDispatch();
  const history = useHistory();

  const handleBack = () => {
    setVerifyEmail(false);
    setUpdatePersonalDetails(true);
  };

  const handleUpdateSuccess = (email?: string) => {
    setUpdatePersonalDetails(false);
    if (email) {
      setEmail(email);
      setVerifyEmail(true);
      ToastMessage.success(t(MSG[C1014]));
    } else {
      setUpdateSuccess(true);
    }
  };

  const handleSwitchLang = async (lang: string) => {
    try {
      await switchLanguage(langMap[lang]).unwrap();
      setIsOpenLang(false);
      i18n.changeLanguage(lang);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleLogOut = async () => {
    if (userInfo?.loginMethod === 'wallet') {
      try {
        await disconnect();
        localStorage.removeItem('AptosWalletName');
      } catch (error) {
        console.error(error);
      }
    } else {
      web3Auth?.logout();
    }
    dispatch(logout());
    // logout rudder stack
    if (rudderAnalytics) {
      rudderAnalytics.identify('', { isLoggedIn: false });
      rudderAnalytics.reset();
    }
    // end logout rudder stack
    history.replace(PATHS.events);
    ToastMessage.success(t(MSG[C1100]));
  };

  const getLogoMethod = () => {
    switch (userInfo?.loginMethod) {
      case LOGIN_METHOD.GOOGLE:
        return (
          <img
            className="bg-[#F8F6F5] rounded-full p-1"
            width={28}
            height={28}
            src={LogoGoogle}
            alt="google"
          />
        );
      case LOGIN_METHOD.KAKAO:
        return <img width={28} height={28} src={LogoKakao} alt="kakao" />;
      case LOGIN_METHOD.INSTAGRAM:
        return <img width={28} height={28} src={LogoInstagram} alt="instagram" />;
      case LOGIN_METHOD.TWITTER:
        return <img width={28} height={28} src={LogoTwitter} alt="twitter" />;
      default:
        return <></>;
    }
  };

  return (
    <div
      className={`"bg-gray2 rounded-[10px] max-md:mx-[20px] mb-[16px] md:min-h-[819px] shadow-xl shadow-rgba(0, 0, 0, 0.25)`}
    >
      <div className="flex flex-col items-center justify-center px-4">
        <div className="w-[198px] h-[198px] relative mb-[64px] md:mt-[23px] md:mb-[32px] cursor-pointer ">
          <AvatarUpload url={userInfo?.avatar} kycStatus={userInfo?.kycStatus} />
        </div>

        <div className="flex items-center justify-between border-gray border-b-[1px] border-solid py-[16px] w-full">
          <p className="text-[24px] text-blue6C block max-w-full truncate">{userInfo?.username}</p>
          <button
            onClick={() => setIsOpenLang(true)}
            className="p-[8px] bg-white rounded-full shadow-lg shadow-rgba(0, 0, 0, 0.25) text-primary "
          >
            {t('header.language')}
          </button>
        </div>
        <div className="flex items-center justify-center border-gray border-b-[1px] border-solid py-[16px] w-full">
          <EkycVerifyButton kycStatus={userInfo?.kycStatus} />
        </div>
        <div className="border-gray border-b-[1px] border-solid  py-[16px] w-full">
          <p className="text-[12px] mb-[8px] text-blue6C">{t('profile.dateOfBirth')}</p>
          <p className="text-[16px]  text-blue6C">
            {formatDate(userInfo?.dateOfBirth, DATE_FORMAT)}
          </p>
        </div>
        <div className="border-gray border-b-[1px] border-solid  py-[16px] w-full">
          <p className="text-[12px] mb-[8px] text-blue6C">{t('profile.country')}</p>
          <p className="text-[16px]  text-blue6C">{getCityByCode(userInfo?.city)}</p>
        </div>
        <div className="border-gray border-b-[1px] border-solid  py-[16px] w-full">
          <p className="text-[12px] mb-[8px] text-blue6C">{t('profile.phoneNumber')}</p>
          <p className="text-[16px]  text-blue6C">
            {userInfo?.phone ? transformPhoneNumber(userInfo.phone) : ValueStatus.UNKNOWN}
          </p>
        </div>
        <div className="py-[16px] break-words w-full">
          <p className="text-[12px] mb-[8px] text-blue6C">{t('profile.email')}</p>
          <p className="text-[16px]  text-blue6C">{userInfo?.email}</p>
        </div>
        {userInfo?.loginMethod !== LOGIN_METHOD.NORMAL && (
          <div className="py-[16px] w-full">
            <p className="text-[12px]">{t('profile.likedSocials')}</p>
            <p className="text-[16px]  flex items-center gap-2">
              {getLogoMethod()}{' '}
              {userInfo?.loginMethod === LOGIN_METHOD.GOOGLE
                ? userInfo?.email
                : formatedAddress(userInfo?.userWallet[0]?.address) || userInfo?.username}
            </p>
          </div>
        )}
        <ButtonContained
          buttonType="type2"
          fullWidth
          className="my-2.5 !w-[212px] !md:w-[212px]"
          onClick={() => setUpdatePersonalDetails(true)}
        >
          {t('profile.updatePersonalDetails')}
        </ButtonContained>

        {userInfo?.loginMethod === LOGIN_METHOD.NORMAL && (
          <ButtonContained
            buttonType="type2"
            fullWidth
            onClick={() => setUpdatePassword(true)}
            className="!w-[212px] !md:w-[212px]"
          >
            {t('profile.updatePassword')}
          </ButtonContained>
        )}
        <ButtonContained
          buttonType="type2"
          fullWidth
          className="my-2.5 !w-[212px]"
          onClick={handleLogOut}
          loading={loading}
        >
          {t('header.logOut')}
        </ButtonContained>
      </div>

      <UpdatePersonalDetails
        isOpen={isUpdatePersonalDetails}
        onClose={() => setUpdatePersonalDetails(false)}
        onUpdateSuccess={handleUpdateSuccess}
        userInfo={userInfo}
      />
      <NotificationModal
        isOpen={isUpdateSuccess}
        title={t('profile.personalDetailsUpdate')}
        description={t('profile.yourDetailsHasBeen')}
        textButton={t('profile.buttonClose')}
        onButton={() => setUpdateSuccess(false)}
        onClose={() => setUpdateSuccess(false)}
      />
      {isVerifyEmail && (
        <VerificationEmail
          isOpen={isVerifyEmail}
          email={email}
          handleBack={handleBack}
          onclose={() => setVerifyEmail(false)}
          selectRole={userInfo?.role!}
        />
      )}
      <UpdatePassword isOpen={isUpdatePassword} onclose={() => setUpdatePassword(false)} />
      <ModalComponent
        open={isOpenLang}
        onCancel={() => setIsOpenLang(false)}
        width={WIDTH_FORM_MODAL_2}
        centered
        destroyOnClose
      >
        <LanguageModal onSwitchLanguage={handleSwitchLang} />
      </ModalComponent>
    </div>
  );
};

export default PersonalProfile;
