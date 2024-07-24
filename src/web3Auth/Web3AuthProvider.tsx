import { IProvider, WEB3AUTH_NETWORK } from '@web3auth/base';
import { CommonPrivateKeyProvider } from '@web3auth/base-provider';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { createContext, useContext, useEffect, useState } from 'react';
import { chainConfig } from '.';

interface Props {
  children: React.ReactNode;
}

interface States {
  web3Auth: Web3AuthNoModal | null;
  provider: IProvider | null;
  userLoggedIn: boolean | null;
}

export const Web3AuthContext = createContext<States>({
  web3Auth: null,
  provider: null,
  userLoggedIn: null,
});

export function useWeb3Auth(): States {
  return useContext(Web3AuthContext);
}
const Web3AuthProvider = ({ children }: Props) => {
  const [web3Auth, setWeb3Auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean | null>(false);

  const init = async () => {
    try {
      const privateKeyProvider = new CommonPrivateKeyProvider({
        config: { chainConfig },
      });
      const isTestnet = import.meta.env.VITE_APTOS_NETWORK === 'testnet';

      const web3auth = new Web3AuthNoModal({
        clientId: import.meta.env.VITE_WEB3_AUTH_CLIENT_ID, // Get it from Web3Auth Dashboard
        web3AuthNetwork: isTestnet
          ? WEB3AUTH_NETWORK.SAPPHIRE_DEVNET
          : WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
        privateKeyProvider,
        sessionTime: Number(import.meta.env.VITE_MAX_SESSION_TIMEOUT || 86400 * 7), //7d
      });

      const openloginAdapter = new OpenloginAdapter({
        privateKeyProvider,
        adapterSettings: {
          clientId: import.meta.env.VITE_WEB3_AUTH_CLIENT_ID,
          uxMode: 'redirect',
          network: isTestnet ? WEB3AUTH_NETWORK.SAPPHIRE_DEVNET : WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
          loginConfig: {
            jwt: {
              verifier: import.meta.env.VITE_WEB3_AUTH_VERIFIER_NAME || 'jwt-custom', // Pass the Verifier name here
              typeOfLogin: 'jwt', // Pass on the login provider of the verifier you've created
              clientId: import.meta.env.VITE_WEB3_AUTH_CLIENT_ID, // Pass on the Auth0 `Client ID` here
            },
          },
        },
      });
      web3auth.configureAdapter(openloginAdapter);

      await web3auth.init();
      setProvider(web3auth.provider);
      console.log('web3auth', web3auth);
      if (web3auth.connected) {
        setUserLoggedIn(true);
      }
      console.log('web3auth', web3auth);
      setWeb3Auth(web3auth);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Web3AuthContext.Provider
      value={{
        web3Auth,
        provider,
        userLoggedIn,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};

export default Web3AuthProvider;
