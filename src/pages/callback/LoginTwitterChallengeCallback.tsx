import { useEffect } from 'react';
import { LoadingPage } from '../loadings';
import { useLogin } from 'src/hooks/useLogin';
import { useHistory, useLocation } from 'react-router-dom';
import { PATHS } from 'src/constants/paths';
import { useAppSelector } from 'src/store';
import { getUserInfo } from 'src/store/selectors/user';
import { ESocialNetworkingLoginMethod } from 'src/store/slices/campaign/types';

const LoginTwitterChallengeCallback = () => {
  const { exchangeChallengeToken } = useLogin();
  const location = useLocation();
  const history = useHistory();
  const userInfo = useAppSelector(getUserInfo);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    if (code && userInfo) {
      exchangeChallengeToken(code, ESocialNetworkingLoginMethod.X);
    } else {
      history.push(PATHS.events);
    }
  }, [location]);

  return (
    <div>
      <LoadingPage />
    </div>
  );
};

export default LoginTwitterChallengeCallback;
