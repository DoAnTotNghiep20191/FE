import { Network } from '@aptos-labs/ts-sdk';
import { CHAIN_NAMESPACES } from '@web3auth/base';

export const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.OTHER,
  chainId: import.meta.env.VITE_APTOS_NETWORK === Network.TESTNET ? '0x7E6' : '0x1', //
  rpcTarget: import.meta.env.VITE_APTOS_RPC,
  // Avoid using public rpcTarget in production.
  displayName: `Aptos ${import.meta.env.VITE_APTOS_NETWORK}`,
  blockExplorerUrl: import.meta.env.VITE_APTOSCAN_BASE_URL,
  ticker: 'APT',
  tickerName: 'Aptos',
};
