import loadable, { DefaultComponent } from '@loadable/component';
import { getPublicCompressed } from '@toruslabs/eccrypto';
import { AptosAccount } from 'aptos';
import { useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { PATHS } from 'src/constants/paths';
import {
  clearLoginProvider,
  clearQueries,
  clearStorageLoginType,
  getLoginProvider,
  getQueries,
} from 'src/helpers/storage';
import { LoadingPage } from 'src/pages/loadings';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';
import { useLazyGetUserInfoQuery, useVerifyWeb3AuthMutation } from 'src/store/slices/user/api';
import { ELoginMethod } from 'src/store/slices/user/types';
import { useWeb3Auth } from 'src/web3Auth/Web3AuthProvider';
import { PrivateRoute } from './components/PrivateRoute';
import { PrivateRouteOrganizer } from './components/PrivateRouteOrganizer';

const LoadingByTemplate: React.FC = () => {
  return <LoadingPage />;
};

function loadableWFallback(
  loadFn: (
    props: unknown,
  ) => Promise<DefaultComponent<unknown extends JSX.Element ? JSX.Element : JSX.Element>>,
) {
  return loadable(loadFn, {
    fallback: <LoadingByTemplate />,
  });
}

const NotFound = loadableWFallback(() => import('./components/NotFound'));
const Dashboard = loadableWFallback(() => import('src/pages/dashboard'));
const Events = loadableWFallback(() => import('src/pages/events'));
const EventDetail = loadableWFallback(() => import('src/pages/event-detail'));
const MyEvents = loadableWFallback(() => import('src/pages/my-events'));
const PurchaseHistory = loadableWFallback(() => import('src/pages/my-events/PurchaseHistory'));
const Profile = loadableWFallback(() => import('src/pages/profile'));
const EventManager = loadableWFallback(() => import('src/pages/event-manager'));
const ContactUs = loadableWFallback(() => import('src/pages/loyalty/contact-us'));
const FAQ = loadableWFallback(() => import('src/pages/loyalty/FAQ'));
const QuickGuide = loadableWFallback(() => import('src/pages/loyalty/quick-start-guide'));
const TermOfService = loadableWFallback(() => import('src/pages/loyalty/term-service'));
const PrivacyPolicy = loadableWFallback(() => import('src/pages/loyalty/privacy-policy'));
const ScanQR = loadableWFallback(() => import('src/pages/scan-qr'));
const ComingSoon = loadableWFallback(() => import('src/pages/loyalty/comming-soon'));
const TeamManagement = loadableWFallback(
  () => import('src/pages/profile/components/team-management'),
);
const Campaigns = loadableWFallback(() => import('src/pages/campaigns/Layout'));
const LeaderBoard = loadableWFallback(() => import('src/pages/leader-board/Layout'));

const LoginInstagramCallback = loadableWFallback(
  () => import('src/pages/callback/LoginInstagramCallback'),
);
const LoginTwitterCallback = loadableWFallback(
  () => import('src/pages/callback/LoginTwitterCallback'),
);
const LoginKakoCallback = loadableWFallback(() => import('src/pages/callback/LoginKakaoCallback'));
const LoginGoogleCallback = loadableWFallback(
  () => import('src/pages/callback/LoginGoogleCallback'),
);

const ChallengeTwitterCallback = loadableWFallback(
  () => import('src/pages/callback/LoginTwitterChallengeCallback'),
);

const ChallengeYoutubeCallback = loadableWFallback(
  () => import('src/pages/callback/LoginYoutubeChallengeCallback'),
);

const ChallengeTiktokCallback = loadableWFallback(
  () => import('src/pages/callback/LoginTiktokChallengeCallback'),
);

const ChallengeSpotifyCallback = loadableWFallback(
  () => import('src/pages/callback/LoginSpotifyChallengeCallback'),
);
const ChallengeFacebookCallback = loadableWFallback(
  () => import('src/pages/callback/LoginFacebookChallengeCallback'),
);
const ChallengeInstagramCallback = loadableWFallback(
  () => import('src/pages/callback/LoginInstagramChallengeCallback'),
);

const Routes: React.FC = () => {
  const { rudderAnalytics } = useRudderStack();
  const [verifyWeb3Auth] = useVerifyWeb3AuthMutation();
  const [getInfo] = useLazyGetUserInfoQuery();
  const history = useHistory();

  const { web3Auth } = useWeb3Auth();

  const handleLoginWeb3Auth = async () => {
    try {
      if (web3Auth && web3Auth.connected && history) {
        const web3AuthUserInfo = await web3Auth.getUserInfo();
        const privateKey: any = await web3Auth.provider?.request({ method: 'private_key' });
        const privateKeyUint8Array = new Uint8Array(
          privateKey.match(/.{1,2}/g)!.map((byte: any) => parseInt(byte, 16)),
        );
        const aptosAccount = new AptosAccount(privateKeyUint8Array);
        const aptosAccountAddress = aptosAccount.address().toString(); // setUserLoggedIn(true);
        const publicKey = getPublicCompressed(
          Buffer.from(privateKey.padStart(64, '0'), 'hex'),
        ).toString('hex');

        const loginProvider = getLoginProvider();

        if (loginProvider) {
          await verifyWeb3Auth({
            token: web3AuthUserInfo.idToken!,
            publicKey,
            address: aptosAccountAddress,
            type: loginProvider as ELoginMethod,
          }).unwrap();

          const response = await getInfo(undefined).unwrap();
          clearLoginProvider();
          const search = getQueries();
          if (search) {
            history.replace({
              search,
            });
            clearQueries();
          }

          rudderAnalytics?.identify(response.data.id, {
            userId: response.data.id,
          });
          rudderAnalytics?.track(ERudderStackEvents.Login, {
            eventType: ERudderStackEvents.Login,
            data: {
              userId: response.data.id,
            },
          });
        }
      }
    } catch (error) {
      clearLoginProvider();
      clearStorageLoginType();
    }
  };

  useEffect(() => {
    handleLoginWeb3Auth();
  }, [history, web3Auth?.connected]);

  return (
    <Switch>
      <Route exact path={PATHS.events} component={Events} />
      <Route exact path={PATHS.eventDetail} component={EventDetail} />
      <Route exact path={PATHS.contactUs} component={ContactUs} />
      <Route exact path={PATHS.faqs} component={FAQ} />
      <Route exact path={PATHS.QuickGuide} component={QuickGuide} />
      <Route exact path={PATHS.Term} component={TermOfService} />
      <Route exact path={PATHS.ComingSoon} component={ComingSoon} />{' '}
      <Route exact path={PATHS.Privacy} component={PrivacyPolicy} />
      <Route exact path={PATHS.Privacy} component={PrivacyPolicy} />
      <Route exact path={PATHS.instagramCallback} component={LoginInstagramCallback} />
      <Route exact path={PATHS.twitterCallback} component={LoginTwitterCallback} />
      <Route exact path={PATHS.kakaoCallback} component={LoginKakoCallback} />
      <Route exact path={PATHS.googleCallback} component={LoginGoogleCallback} />
      <Route exact path={PATHS.challengeTwitterCallback} component={ChallengeTwitterCallback} />
      <Route exact path={PATHS.challengeTiktokCallback} component={ChallengeTiktokCallback} />
      <Route exact path={PATHS.challengeSpotifyCallback} component={ChallengeSpotifyCallback} />
      <Route exact path={PATHS.challengeYoutubeCallback} component={ChallengeYoutubeCallback} />
      <Route exact path={PATHS.challengeFacebookCallback} component={ChallengeFacebookCallback} />
      <Route exact path={PATHS.challengeInstagramCallback} component={ChallengeInstagramCallback} />
      <PrivateRoute exact path={PATHS.myEvents} component={MyEvents} />
      <PrivateRoute exact path={PATHS.campaigns} component={Campaigns} />
      <PrivateRoute exact path={PATHS.leaderBoard} component={LeaderBoard} />
      <PrivateRoute exact path={PATHS.purchaseHistory} component={PurchaseHistory} />
      <PrivateRouteOrganizer exact path={PATHS.eventManager} component={EventManager} />
      <PrivateRouteOrganizer exact path={PATHS.dashboard} component={Dashboard} />
      <PrivateRouteOrganizer exact path={PATHS.CheckIn} component={ScanQR} />
      <PrivateRouteOrganizer exact path={PATHS.teamManagement} component={TeamManagement} />
      <PrivateRoute exact path={PATHS.profile} component={Profile} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
};

export default Routes;
