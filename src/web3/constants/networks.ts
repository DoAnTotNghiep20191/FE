import { Network } from '../types';
import {
  VITE_BLOCK_EXPLORER_URL,
  VITE_POLYGON_CHAIN_ID_HEX,
  VITE_POLYGON_RPC_URL,
  VITE_POLYGON_CHAIN_ID,
  VITE_NETWORK_NAME,
} from './envs';

export const SUPPORTED_NETWORKS: { [key: string]: Network } = {
  [VITE_POLYGON_CHAIN_ID as string]: {
    chainId: Number(VITE_POLYGON_CHAIN_ID),
    chainIdHex: VITE_POLYGON_CHAIN_ID_HEX as string,
    chainName: VITE_NETWORK_NAME as string,
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    blockExplorerUrls: [VITE_BLOCK_EXPLORER_URL as string],
    rpcUrls: [VITE_POLYGON_RPC_URL as string],
  },
};
