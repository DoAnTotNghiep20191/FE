import { Grid, Layout } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { LogoDesktop, LogoLanguage, LogoProfile, LogoSwitch, LogoTeam } from 'src/assets/icons';
import ModalCreateTeam from 'src/components/ModalCreateTeam';
import ModalSignIn from 'src/components/ModalSignIn';
import UpdateEmailModal from 'src/components/Modals/UpdateEmailModal';
import { PATHS } from 'src/constants/paths';
import useDidClickOutside from 'src/hooks/useDidClickOutside';
import { useLogin } from 'src/hooks/useLogin';
import { useAppDispatch, useAppSelector } from 'src/store';
import { baseQueryApi } from 'src/store/baseQueryApi';
import {
  getDefaultForm,
  getIsCreateTeam,
  getIsFirst,
  getOpenSignIn,
} from 'src/store/selectors/auth';
import { getSelectedView, getUserInfo } from 'src/store/selectors/user';
import { setDefaultForm, setIsCreateTeam, setIsFirst, setOpenSignIn } from 'src/store/slices/auth';
import { logout, setSelectedView } from 'src/store/slices/user';
import { EUserView, TypeForm, TypeRole } from 'src/store/slices/user/types';
import SubMenu from './SubMenu';
import './styles.scss';

import { TypeCreateTeam } from 'src/components/ModalCreateTeam/types';
import { useCheckUserInviteMutation } from 'src/store/slices/app/api';
import { useTranslation } from 'react-i18next';
import LanguageModal from 'src/components/Modals/Language';
import i18n from 'src/i18n';
import ModalComponent from 'src/components/Modals';
import { WIDTH_FORM_MODAL_2 } from 'src/constants';
import { ToastMessage } from 'src/components/Toast';
import { C1100, MSG } from 'src/constants/errorCode';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import useWalletConnectListener from 'src/aptos-lab/hooks/useWalletConnectListener';
import VerifyEmailModal from 'src/components/Modals/VerifyEmailModal';
import { useWeb3Auth } from 'src/web3Auth/Web3AuthProvider';
import { useRudderStack } from 'src/rudderstack';
import SwitchAccountModal from 'src/components/Modals/SwitchAccountModal';

const { Header } = Layout;
const { useBreakpoint } = Grid;

const AppHeader: React.FC = () => {
  const history = useHistory();
  const breakpoint = useBreakpoint();
  const [isOpenDropDown, setOpenDropDown] = useState(false);
  const [isUpdateEmail, setUpdateEmail] = useState(false);
  const [isOpenLang, setIsOpenLang] = useState(false);
  const [openSwitchAccount, setOpenSwitchAccount] = useState(false);

  const selectedView = useAppSelector(getSelectedView);

  const { disconnect } = useWallet();
  const { rudderAnalytics } = useRudderStack();

  const useInfo = useAppSelector(getUserInfo);
  const openCreateTeam = useAppSelector(getIsCreateTeam);
  const isFirstRegister = useAppSelector(getIsFirst);
  const openSignIn = useAppSelector(getOpenSignIn);
  const defaultForm = useAppSelector(getDefaultForm);
  useLogin();
  useWalletConnectListener();
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const dropdownRef = useRef(null);
  const userInfo = useAppSelector(getUserInfo);
  const [checkUserInvite] = useCheckUserInviteMutation();

  const { web3Auth } = useWeb3Auth();

  useDidClickOutside(dropdownRef, () => setOpenDropDown(false));

  const { t } = useTranslation();

  const handleOnBoxRight = () => {
    if (useInfo) {
      setOpenDropDown(!isOpenDropDown);
    } else {
      dispatch(setOpenSignIn(true));
    }
  };

  const handleLogOut = async (isUserLogout: boolean) => {
    if (useInfo?.loginMethod === 'wallet') {
      await disconnect();
      localStorage.removeItem('AptosWalletName');
    } else {
      web3Auth?.logout();
    }
    dispatch(logout());
    history.replace(PATHS.events);
    setOpenDropDown(false);
    dispatch(baseQueryApi.util.resetApiState());

    // logout rudder stack
    if (rudderAnalytics) {
      rudderAnalytics.identify('', { isLoggedIn: false });
      rudderAnalytics.reset();
    }
    // end logout rudder stack

    if (isUserLogout) {
      ToastMessage.success(t(MSG[C1100]));
    } else {
      ToastMessage.error('Session timeout');
    }
  };

  const handleCloseCreateTeam = () => {
    dispatch(setIsCreateTeam(false));
  };

  const handleOpenSwitchViewModal = () => {
    setOpenSwitchAccount(!openSwitchAccount);
  };

  const handleSwitchView = () => {
    if (!selectedView || !selectedView?.account || selectedView?.view === EUserView.ORGANIZER) {
      dispatch(
        setSelectedView({
          account: userInfo?.userWallet[0].address || '',
          view: EUserView.FAN,
        }),
      );
    } else {
      dispatch(
        setSelectedView({
          account: userInfo?.userWallet[0].address || '',
          view: EUserView.ORGANIZER,
        }),
      );
    }
    setOpenSwitchAccount(!openSwitchAccount);
  };

  const handleSwitchLang = (lang: string) => {
    setIsOpenLang(false);
    i18n.changeLanguage(lang);
  };

  const handleUserInvite = async (token: string) => {
    try {
      const { data } = await checkUserInvite({ token }).unwrap();
      if (data?.isRegister) {
        dispatch(setDefaultForm(TypeForm.SIGN_UP));
      } else {
        dispatch(setDefaultForm(TypeForm.LOGIN));
      }
      dispatch(setOpenSignIn(true));
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    const tokenInvite = new URLSearchParams(search).get('token');
    if (useInfo) {
      dispatch(setOpenSignIn(false));
      if (!useInfo?.email) {
        setUpdateEmail(true);
      } else {
        setUpdateEmail(false);
      }
      if (isFirstRegister && !tokenInvite) {
        dispatch(setIsCreateTeam(true));
        dispatch(setIsFirst(false));
      }
    } else {
      setUpdateEmail(false);
    }

    if (!useInfo && tokenInvite) {
      handleUserInvite(tokenInvite);
    }
  }, [useInfo]);

  useEffect(() => {
    (window as any).logout = handleLogOut;
  }, [web3Auth, userInfo]);

  useEffect(() => {
    const windowHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty('--window-height', `${window.innerHeight}px`);
    };
    window.addEventListener('resize', windowHeight);
    windowHeight();
  }, []);

  useEffect(() => {
    if (
      !!userInfo?.userWallet?.[0]?.address &&
      userInfo?.userWallet?.[0]?.address !== selectedView?.account &&
      userInfo.role === TypeRole.ORGANIZER
    ) {
      dispatch(
        setSelectedView({
          account: userInfo?.userWallet[0].address || '',
          view: EUserView.ORGANIZER,
        }),
      );
    } else if (
      !!userInfo?.userWallet?.[0]?.address &&
      userInfo?.userWallet?.[0]?.address !== selectedView?.account &&
      userInfo.role === TypeRole.FAN
    ) {
      dispatch(
        setSelectedView({
          account: userInfo?.userWallet[0].address || '',
          view: EUserView.FAN,
        }),
      );
    } else if (
      !!userInfo?.userWallet?.[0]?.address &&
      userInfo?.userWallet?.[0]?.address === selectedView?.account &&
      userInfo.role === TypeRole.FAN &&
      selectedView?.view === EUserView.ORGANIZER
    ) {
      dispatch(
        setSelectedView({
          account: userInfo?.userWallet[0].address || '',
          view: EUserView.FAN,
        }),
      );
    }
  }, [userInfo, selectedView]);

  const renderHeader = useMemo(() => {
    return (
      <>
        {breakpoint.md ? (
          <Header className="site-layout-header">
            <div className="sidebar-wrapper">
              <div className="logo-section" onClick={() => history.push(PATHS.events)}>
                <img src={LogoDesktop} alt="frac logo" />
              </div>
              <SubMenu />
            </div>
            <div className="flex">
              {!useInfo && (
                <img
                  src={LogoLanguage}
                  className="button-switch-language"
                  alt="logo-switch-language"
                  onClick={() => setIsOpenLang(true)}
                />
              )}
              {useInfo ? (
                <div className="flex gap-[32px]">
                  {useInfo?.role === TypeRole.ORGANIZER && (
                    <>
                      {selectedView?.view === EUserView.ORGANIZER && (
                        <div
                          className="cursor-pointer flex justify-center items-center flex-col"
                          onClick={() => history.push(PATHS.teamManagement)}
                        >
                          <LogoTeam />
                          <p className="text-[12px] leading-4 pt-1">{t('header.teams')}</p>
                        </div>
                      )}
                      <div
                        className="cursor-pointer flex justify-center items-center flex-col"
                        onClick={handleOpenSwitchViewModal}
                      >
                        <LogoSwitch />
                        <p className="text-[12px] leading-4 pt-1">{t('header.switch')}</p>
                      </div>
                    </>
                  )}
                  <div
                    className="cursor-pointer flex justify-center items-center flex-col"
                    onClick={() => {
                      history.push(PATHS.profile);
                    }}
                  >
                    <LogoProfile />
                    <p className="text-[12px] leading-4 pt-1">{t('header.profile')}</p>
                  </div>
                </div>
              ) : (
                <button className="header-user" onClick={handleOnBoxRight}>
                  <p>{t('discover.signInOrSignUp')}</p>
                </button>
              )}
            </div>
          </Header>
        ) : (
          <Header className="site-layout-header">
            <div className="sidebar-wrapper">
              <div className="logo-section" onClick={() => history.push(PATHS.events)}>
                <img src={LogoDesktop} alt="frac logo" />
              </div>
              {!useInfo && (
                <img
                  src={LogoLanguage}
                  className="button-switch-language"
                  alt="logo-switch-language"
                  onClick={() => setIsOpenLang(true)}
                />
              )}
            </div>
            <div>
              {useInfo && (
                <div className="flex gap-[24px]">
                  {useInfo?.role === TypeRole.ORGANIZER && (
                    <>
                      {selectedView?.view === EUserView.ORGANIZER && (
                        <div
                          className="cursor-pointer flex justify-center items-center"
                          onClick={() => history.push(PATHS.teamManagement)}
                        >
                          <LogoTeam />
                        </div>
                      )}
                      <div onClick={handleOpenSwitchViewModal}>
                        <LogoSwitch />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            {/* <TicketMenuIcon onClick={() => setIsOpenDrawer(true)} /> */}
          </Header>
        )}
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    breakpoint.md,
    useInfo,
    isOpenDropDown,
    openSignIn,
    isOpenLang,
    selectedView,
    i18n.resolvedLanguage,
  ]);

  return (
    // <Affix offsetTop={0}>
    <div className="!bg-white z-10 shadow-lg shadow-rgba(0, 0, 0, 0.25) fixed left-0 right-0 top-0">
      <div className={`header-votee container-ticket`}>
        {renderHeader}

        {openSignIn && (
          <ModalSignIn
            isOpen={openSignIn}
            roleDefault={defaultForm?.includes('fan') ? TypeRole.FAN : TypeRole.ORGANIZER}
            typeFormDefault={defaultForm?.includes('fan') ? defaultForm : undefined}
            onClose={() => {
              dispatch(setOpenSignIn(false));
            }}
          />
        )}
        <UpdateEmailModal isOpen={isUpdateEmail} />
        <ModalComponent
          open={isOpenLang}
          onCancel={() => setIsOpenLang(false)}
          width={WIDTH_FORM_MODAL_2}
          centered
          destroyOnClose
        >
          <LanguageModal onSwitchLanguage={handleSwitchLang} />
        </ModalComponent>
        <ModalCreateTeam
          open={openCreateTeam}
          onClose={handleCloseCreateTeam}
          typeForm={
            useInfo?.teams?.length! > 0 ? TypeCreateTeam.OPTION_TEAM : TypeCreateTeam.CREATE_TEAM
          }
        />
      </div>
      {userInfo && (
        <>
          <VerifyEmailModal />
          <SwitchAccountModal
            onClose={handleOpenSwitchViewModal}
            onOk={handleSwitchView}
            open={openSwitchAccount}
          />
          {/* <PickRoleModal /> */}
          {/* <KycModal /> */}
        </>
      )}
    </div>
  );
};

export default React.memo(AppHeader);
