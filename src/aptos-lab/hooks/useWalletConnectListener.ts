import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'src/store';
import { getUserInfo } from 'src/store/selectors/user';
import { logout } from 'src/store/slices/user';
import { PATHS } from 'src/constants/paths';
import { useHistory } from 'react-router-dom';
import { baseQueryApi } from 'src/store/baseQueryApi';
import { ToastMessage } from 'src/components/Toast';
import { useConnectModal } from 'src/components/ContextProvider/WalletContextProvider';
import { WalletNames } from 'src/components/WalletListModal';
import { useRudderStack } from 'src/rudderstack';

const useWalletConnectListener = () => {
  const { disconnect, account, network } = useWallet();
  const { rudderAnalytics } = useRudderStack();
  const userInfo = useAppSelector(getUserInfo);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { isLoading } = useConnectModal();

  const handleLogOut = async () => {
    try {
      dispatch(logout());
      history.replace(PATHS.events);
      dispatch(baseQueryApi.util.resetApiState());
      try {
        await disconnect?.();
      } catch (err) {
        console.error(err);
      }

      // logout rudderstack
      if (rudderAnalytics) {
        rudderAnalytics.identify('', { isLoggedIn: false });
        rudderAnalytics.reset();
      }
      // end

      const wallet = localStorage.getItem('AptosWalletName');
      if (wallet === WalletNames.Petra) {
        localStorage.removeItem('AptosWalletName');
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (network && network?.name !== import.meta.env.VITE_APTOS_NETWORK && !isLoading) {
      ToastMessage.error(
        `Please change network to aptos ${import.meta.env.VITE_APTOS_NETWORK} to continue`,
      );
      setTimeout(() => {
        handleLogOut();
      }, 1000);
    }
  }, [network, isLoading]);

  useEffect(() => {
    if (
      userInfo &&
      account &&
      userInfo.loginMethod === 'wallet' &&
      userInfo.address !== account?.address
    ) {
      setTimeout(() => {
        handleLogOut();
      }, 500);
    }
  }, [userInfo, account]);
};

export default useWalletConnectListener;
