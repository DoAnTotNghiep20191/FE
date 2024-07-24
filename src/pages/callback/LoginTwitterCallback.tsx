import { useEffect } from 'react';
import { LoadingPage } from '../loadings';
import { useLogin } from 'src/hooks/useLogin';
import { useHistory, useLocation } from 'react-router-dom';
import { useWeb3Auth } from 'src/web3Auth/Web3AuthProvider';
import { PATHS } from 'src/constants/paths';

const LoginTwitterCallback = () => {
  const { exchangeTwitterToken } = useLogin();
  const location = useLocation();
  const history = useHistory();

  const { web3Auth } = useWeb3Auth();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    if (web3Auth && !web3Auth.connected && code) {
      exchangeTwitterToken(code);
    }

    if (!code) {
      history.push(PATHS.events + history.location.hash);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, web3Auth]);

  return (
    <div>
      <LoadingPage />
    </div>
  );
};

export default LoginTwitterCallback;
