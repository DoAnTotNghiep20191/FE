import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { GroupLargeIcon } from 'src/assets/icons';
import AppHeader from 'src/components/Layout/header/AppHeader';
import { S40051, S40413, S40414 } from 'src/constants/errorCode';
import { PATHS } from 'src/constants/paths';
import NotificationModal from 'src/pages/event-detail/components/NotificationModal';
import { useAppDispatch, useAppSelector } from 'src/store';
import { getTheme } from 'src/store/selectors/theme';
import { getAccessToken, getUserInfo } from 'src/store/selectors/user';
import { useVerifyInviteTokenMutation } from 'src/store/slices/profile/api';
import { useLazyGetUserInfoQuery } from 'src/store/slices/user/api';
import { useTranslation } from 'react-i18next';
import AppNavbar from './navbar';
import { EUserView } from 'src/store/slices/user/types';
import { ExtendedWindow } from '../ModalSignIn/types';
import InviteTeam from '../Modals/InviteTeam';
import YourEventNowLive from '../Modals/YourEventNowLive';
import AppFooter from './header/AppFooter';
import './styles.scss';
import { LANGUAGE_CODE } from '../Locale-provider';
import { Helmet } from 'react-helmet';
import { setTheme } from 'src/store/slices/theme';
import { BaseSocket } from 'src/socket/BaseSocket';
import eventBus from 'src/socket/event-bus';
import { ESocketEvent } from 'src/socket/SocketEvent';
import { setAccessToken, setSelectedView } from 'src/store/slices/user';

const { Content } = Layout;
interface ILayoutProps {
  children?: React.ReactNode;
}
export enum ThemesMode {
  dark = 'dark',
  light = 'light',
}
declare let window: ExtendedWindow;
export const langMap = {
  [LANGUAGE_CODE.ENGLISH]: LANGUAGE_CODE.ENGLISH,
  kr: LANGUAGE_CODE.KOREAN,
};
const LayoutDefault: React.FC<ILayoutProps> = ({ children }) => {
  const currentTheme = useAppSelector(getTheme);
  const userInfo = useAppSelector(getUserInfo);
  const accessToken = useAppSelector(getAccessToken);

  const { pathname, search } = useLocation();
  const dispatch = useAppDispatch();
  const [verifyTokenInvite] = useVerifyInviteTokenMutation();
  const [getProFile] = useLazyGetUserInfoQuery();
  const [showNotiInviteTeam, setShowNotiRemoveTeam] = useState<{
    title: string;
    subTitle: string;
  }>();
  const [idEventPublish, setIdEventPublish] = useState<number | null>(null);
  const history = useHistory();
  const { t, i18n } = useTranslation();

  const [dataTeam, setDataTeam] = useState<{ teamName: string; owner: string } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (!currentTheme.mode) {
      dispatch(setTheme('Light'));
      document.body.dataset.theme = 'Light';
    } else {
      document.body.dataset.theme = currentTheme.mode;
    }
  }, [currentTheme]);

  useEffect(() => {
    setTimeout(() => {
      const tokenInvite = new URLSearchParams(search).get('token');
      if (tokenInvite && userInfo && userInfo?.email && userInfo.status === 'active') {
        accessTokenInvite(tokenInvite);
      }
    }, 1500);
  }, [userInfo?.email, search]);

  const accessTokenInvite = async (token: string) => {
    try {
      const res = await verifyTokenInvite({ token: token }).unwrap();
      setDataTeam({ teamName: res?.data?.teamName, owner: res?.data?.owner });
      dispatch(
        setAccessToken({
          refreshToken: res?.data?.refreshToken,
          accessToken: res?.data?.accessToken,
        }),
      );
      window.history.replaceState(null, '', window.location.pathname);
    } catch (err: any) {
      const validator_errors = err?.data?.validator_errors;
      const data = err?.data?.data;
      if (validator_errors === S40051) {
        setShowNotiRemoveTeam({
          title: t('createTeam.yourTeamInviteWasLinked'),
          subTitle: t('createTeam.itLooksLikeTheEmailAddress'),
        });
        return;
      }
      if (validator_errors === S40413) {
        setShowNotiRemoveTeam({
          title: t('team.teamRemoval'),
          subTitle: t('team.hasRemovedYouFrom', {
            user: data?.username,
            teamName: data?.team_name,
          }),
        });
        return;
      }
      if (validator_errors === S40414) {
        history.push(PATHS.dashboard);
        return;
      }
      console.error(err);
    }
  };

  const handleViewEvent = (id: number) => {
    history.push(`/events/${id}`);
    setIdEventPublish(null);
  };

  const handleCloseModalTeam = () => {
    window.history.replaceState(null, '', window.location.pathname);
    setShowNotiRemoveTeam(undefined);
  };

  // change language base on user profile language
  useEffect(() => {
    if (
      userInfo &&
      userInfo.language &&
      i18n &&
      i18n.resolvedLanguage &&
      userInfo.language !== i18n.resolvedLanguage
    ) {
      if (userInfo.language === 'kr') {
        i18n.changeLanguage(LANGUAGE_CODE.KOREAN);
      } else {
        i18n.changeLanguage(LANGUAGE_CODE.ENGLISH);
      }
    }
  }, [userInfo, i18n.resolvedLanguage]);

  useEffect(() => {
    const currentToken = BaseSocket.getToken();
    if (currentToken && accessToken && currentToken !== accessToken) {
      BaseSocket.getInstance().reconnect(accessToken);
    } else if (accessToken) {
      BaseSocket.getInstance().connect(accessToken);
    } else {
      BaseSocket.getInstance().connect();
    }
  }, [accessToken]);

  useEffect(() => {
    const currentTeamId = BaseSocket.getTeamId();

    if (userInfo && userInfo.currentTeamId && currentTeamId !== userInfo.currentTeamId) {
      BaseSocket.getInstance().listenTeamNotification(userInfo.currentTeamId);
    }
  }, [userInfo]);

  const handleReloadProfile = () => {
    getProFile(undefined);
  };

  useEffect(() => {
    eventBus.on(ESocketEvent.TeamMemberRemoved, handleReloadProfile);

    return () => {
      eventBus.remove(ESocketEvent.TeamMemberRemoved, handleReloadProfile);
    };
  }, []);

  return (
    <div id="layout" className="!bg-black1F">
      <Helmet>
        <title>Mereo</title>
        <meta name="description" content="Believe Earn Win" />
      </Helmet>
      <Layout className="container-main !bg-black1F">
        <AppHeader />
        <div className="bg-black1F content-ticket max-md:pb-[80px] mb-[20px] pt-[85px]">
          <Layout className="site-layout container-ticket md:px-[30px] lg:px-[96px] bg-black1F">
            <Content className="bg-black1F">{children}</Content>
          </Layout>
        </div>
        <AppFooter />
        <InviteTeam
          dataTeam={dataTeam}
          open={!!dataTeam}
          onClose={() => {
            setDataTeam(null);
            dispatch(
              setSelectedView({
                account: userInfo?.userWallet[0].address || '',
                view: EUserView.ORGANIZER,
              }),
            );
            setTimeout(() => {
              history.push(PATHS.teamManagement);
            }, 500);
          }}
        />
        <AppNavbar />
      </Layout>
      <YourEventNowLive
        open={!!idEventPublish}
        onClose={() => setIdEventPublish(null)}
        id={idEventPublish}
        onView={handleViewEvent}
      />
      <NotificationModal
        isOpen={!!showNotiInviteTeam}
        title={showNotiInviteTeam ? showNotiInviteTeam.title : ''}
        description={showNotiInviteTeam ? showNotiInviteTeam.subTitle : ''}
        icon={<GroupLargeIcon />}
        textButton="Close"
        onButton={handleCloseModalTeam}
        onClose={handleCloseModalTeam}
      />
    </div>
  );
};

export default LayoutDefault;
