import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PontemWallet } from '@pontem/wallet-adapter-plugin';
import { OKXWallet } from '@okwallet/aptos-wallet-adapter';

import { createContext, useContext, useState } from 'react';
import WalletListModal from '../../WalletListModal';
import { PetraWallet } from 'petra-plugin-wallet-adapter';

interface Props {
  children: React.ReactNode;
}

export interface WalletContextStates {
  isOpenConnect: boolean;
  setOpenConnect(open: boolean): void;
  isLoading: boolean;
  setIsLoading(open: boolean): void;
}

export const WalletContext = createContext<WalletContextStates>({
  isOpenConnect: false,
  setOpenConnect: () => {},
  isLoading: false,
  setIsLoading: () => {},
});

export function useConnectModal(): WalletContextStates {
  return useContext(WalletContext);
}
const wallets = [new PetraWallet(), new PontemWallet(), new OKXWallet()];

const WalletContextProvider = ({ children }: Props) => {
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <WalletContext.Provider
      value={{
        isOpenConnect: isOpen,
        setOpenConnect: setOpen,
        setIsLoading: setIsLoading,
        isLoading,
      }}
    >
      <AptosWalletAdapterProvider
        plugins={wallets}
        autoConnect={true}
        onError={(error) => {
          console.error('Custom error handling', error);
        }}
        optInWallets={['Nightly'] as any}
      >
        {children}
        <WalletListModal onClose={handleCloseModal} open={isOpen} />
      </AptosWalletAdapterProvider>
    </WalletContext.Provider>
  );
};

export default WalletContextProvider;
