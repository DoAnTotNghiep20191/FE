import { AptosStandardSupportedWallet, Wallet, useWallet } from '@aptos-labs/wallet-adapter-react';
import { Button, ModalProps, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/store';
import { baseQueryApi } from 'src/store/baseQueryApi';
import { getUserInfo } from 'src/store/selectors/user';
import { logout } from 'src/store/slices/user';
import {
  useLazyGetUserInfoQuery,
  useLoginWithWalletConnectMutation,
} from 'src/store/slices/user/api';
import { VITE_MESSAGES_SIGN } from 'src/web3/constants/envs';
import ModalComponent from '../Modals';
import { useConnectModal } from '../ContextProvider/WalletContextProvider';

import PetraIcon from 'src/assets/icons/events/petra-ic.svg?react';
import PontemIcon from 'src/assets/icons/events/pontem-ic.svg?react';
import OkxIcon from 'src/assets/icons/events/okx-ic.svg?react';

import './styles.scss';
import useWindowSize from 'src/hooks/useWindowSize';
import { ToastMessage } from '../Toast';
import { useTranslation } from 'react-i18next';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';

interface Props extends ModalProps {
  onClose: () => void;
}
interface SignMessageResponse {
  address?: string;
  application?: string;
  chainId?: number;
  fullMessage: string;
  message: string;
  nonce: string;
  signature: any;
  bitmap?: Uint8Array;
}
interface WalletItemProps {
  data: Wallet | AptosStandardSupportedWallet<string>;
  connect: () => void;
  signMessage: any;
}

export enum WalletNames {
  Petra = 'Petra',
  Pontem = 'Pontem',
  OKX = 'OKX Wallet',
}

const walletIcons = {
  [WalletNames.Petra]: PetraIcon,
  [WalletNames.Pontem]: PontemIcon,
  [WalletNames.OKX]: OkxIcon,
};

const backgroundColor = {
  [WalletNames.Petra]: '#1C2B43',
  [WalletNames.Pontem]: '#110A2F',
  [WalletNames.OKX]: '#121212',
};

const walletsName = {
  [WalletNames.Petra]: 'Petra',
  [WalletNames.Pontem]: 'Pontem',
  [WalletNames.OKX]: 'OKX',
};

const WalletItem = ({ data, connect }: WalletItemProps) => {
  const Icon = walletIcons[data.name as WalletNames];
  return (
    <Button
      onClick={connect}
      style={{
        background: backgroundColor[data.name as WalletNames],
      }}
      className={`flex items-center px-[14px] py-[25px] gap-[40px] w-[212px] justify-between relative rounded-[50px] text-[white] text-[16px]`}
    >
      <Icon />
      <span className="absolute mx-[auto] left-[0] right-[0]">
        {walletsName[data.name as WalletNames]}
      </span>
    </Button>
  );
};

const handleCheckWalletIsInstalled = (
  wallet: Wallet | AptosStandardSupportedWallet<string>,
  isMobile: boolean,
) => {
  const appUrl = import.meta.env.VITE_SITE_URI || '';
  if (wallet.name === WalletNames.OKX && !(window as any).okxwallet) {
    if (isMobile) {
      const encodedDappUrl = encodeURIComponent(appUrl);
      const deepLink = 'okx://wallet/dapp/url?dappUrl=' + encodedDappUrl;
      window.open(deepLink);
    } else {
      const url = 'https://www.okx.com/vi/web3';
      window.open(url);
    }
    return false;
  }

  if (wallet.name === WalletNames.Pontem && !(window as any).pontem) {
    if (isMobile) {
      return true;
    } else {
      const url =
        'https://chromewebstore.google.com/detail/pontem-aptos-wallet/phkbamefinggmakgklpkljjmgibohnba';
      window.open(url);
    }
    return false;
  }

  if (wallet.name === WalletNames.Petra && !(window as any).petra) {
    let url = '';
    if (isMobile) {
      url = `https://petra.app/explore?link=${appUrl}`;
    } else {
      url = `https://chromewebstore.google.com/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci`;
    }
    window.open(url);
    return false;
  }

  return true;
};

const WalletListModal = ({ open, onClose, ...resprops }: Props) => {
  const { wallets, connect, signMessage, account, disconnect } = useWallet();
  const { isLoading, setIsLoading } = useConnectModal();
  const { isMobile } = useWindowSize();
  const userInfo = useAppSelector(getUserInfo);
  const [signatureResponse, setSignatureResponse] = useState<SignMessageResponse | null>(null);
  const [loginWithWalletConnect] = useLoginWithWalletConnectMutation();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [getInfo] = useLazyGetUserInfoQuery();
  const { rudderAnalytics } = useRudderStack();

  const handleLogout = async () => {
    try {
      await disconnect();
      localStorage.removeItem('AptosWalletName');
      dispatch(logout());
      dispatch(baseQueryApi.util.resetApiState());
      setSignatureResponse(null);
      // logout rudder stack
      if (rudderAnalytics) {
        rudderAnalytics.identify('', { isLoggedIn: false });
        rudderAnalytics.reset();
      }
      // end logout rudder stack
    } catch (error) {
      console.error(error);
    }
  };

  const handleConnectWallet = async (wallet: Wallet | AptosStandardSupportedWallet<string>) => {
    try {
      const isInstalled = handleCheckWalletIsInstalled(wallet, isMobile);
      if (!isInstalled) {
        ToastMessage.error('This wallet is not installed');
        return;
      }

      setIsLoading(true);
      try {
        await connect(wallet.name);
      } catch (error: any) {
        if (!error.includes('already connected')) {
          throw error;
        }
      }
      const response: any = await signMessage({
        address: false,
        application: false,
        chainId: false,
        message: VITE_MESSAGES_SIGN!,
        nonce: '1',
      });
      let result: any;
      if (wallet.name === WalletNames.Petra || wallet.name === WalletNames.OKX) {
        if (response?.signature?.data?.data) {
          const sig = Buffer.from(response?.signature?.data?.data).toString('hex');
          result = {
            ...response,
            signature: sig,
          };
        } else {
          result = response;
        }
      } else if (wallet.name === WalletNames.Pontem) {
        let sig = Buffer.from(response.result.signature).toString('hex');
        if (isMobile) {
          sig = response.result.signature;
        }
        result = {
          ...response.result,
          signature: sig,
        };
      }
      setSignatureResponse(result);
    } catch (error) {
      setIsLoading(false);
      handleLogout();
    }
  };

  const handleSignMessage = async () => {
    try {
      await loginWithWalletConnect({
        signature: signatureResponse?.signature,
        message: signatureResponse?.fullMessage || '',
        publicKey: (account?.publicKey as string) || '',
        address: account?.address || '',
      }).unwrap();
      onClose?.();
      setSignatureResponse(null);

      const response = await getInfo(undefined).unwrap();
      rudderAnalytics?.identify(response.data.id, {
        userId: response.data.id,
      });
      rudderAnalytics?.track(ERudderStackEvents.Login, {
        eventType: ERudderStackEvents.Login,
        data: {
          userId: response.data.id,
        },
      });
      ToastMessage.success(t('message.C1012'));
    } catch (error) {
      handleLogout();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoading && account && !userInfo && signatureResponse) {
      handleSignMessage();
    }
  }, [isLoading, account, signatureResponse, disconnect]);

  const OkxWallet = wallets?.find((item) => item.name === WalletNames.OKX);
  const PontemWallet = wallets?.find((item) => item.name === WalletNames.Pontem);
  const PetraWallet = wallets?.find((item) => item.name === WalletNames.Petra);

  return (
    <ModalComponent
      open={open}
      onCancel={() => {
        onClose?.();
      }}
      centered
      zIndex={70}
      // width={withModal}
      isClose={!isLoading}
      destroyOnClose
      className="relative"
      wrapClassName="h-[100%] wallets-modal"
      {...resprops}
    >
      <div className="min-h-[100vh] md:min-h-[auto] md:h-[100%] flex items-start md:items-center justify-center">
        <div className="flex h-[100%] flex-col items-center justify-center">
          {isLoading ? (
            <div className="h-[100vh] md:h-[460px] flex items-center justify-center">
              <Spin />
            </div>
          ) : (
            <div className="mt-[20px]">
              <div className="">
                <h3 className="text-[24px] text-center">{t('signIn.walletTitle')}</h3>
              </div>
              <div className="flex h-[100%] flex-col items-center justify-center gap-[20px] mt-[40px] mb-[80px]">
                {PetraWallet && (
                  <WalletItem
                    signMessage={signMessage}
                    connect={() => handleConnectWallet(PetraWallet)}
                    key={PetraWallet.name}
                    data={PetraWallet}
                  />
                )}
                {PontemWallet && (
                  <WalletItem
                    signMessage={signMessage}
                    connect={() => handleConnectWallet(PontemWallet)}
                    key={PontemWallet.name}
                    data={PontemWallet}
                  />
                )}
                {OkxWallet && (
                  <WalletItem
                    signMessage={signMessage}
                    connect={() => handleConnectWallet(OkxWallet)}
                    key={OkxWallet.name}
                    data={OkxWallet}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalComponent>
  );
};
export default WalletListModal;
