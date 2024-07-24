import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

export const DEVNET_CONFIG = new AptosConfig({
  network: Network.DEVNET,
});
export const DEVNET_CLIENT = new Aptos(DEVNET_CONFIG);

export const TESTNET_CONFIG = new AptosConfig({ network: Network.TESTNET });
export const TESTNET_CLIENT = new Aptos(TESTNET_CONFIG);

export const MAINNET_CONFIG = new AptosConfig({ network: Network.MAINNET });
export const MAINNET_CLIENT = new Aptos(MAINNET_CONFIG);

export const aptosClient = (network?: string) => {
  const currentNetwork = network || import.meta.env.VITE_APTOS_NETWORK;
  if (currentNetwork === Network.DEVNET.toLowerCase()) {
    return DEVNET_CLIENT;
  } else if (currentNetwork === Network.TESTNET.toLowerCase()) {
    return TESTNET_CLIENT;
  } else if (currentNetwork === Network.MAINNET.toLowerCase()) {
    return MAINNET_CLIENT;
  } else {
    throw new Error(`Unknown network: ${currentNetwork}`);
  }
};

export const fromHexString = (hexString: string) =>
  Uint8Array.from(hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
