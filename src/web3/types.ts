import { JsonRpcSigner } from '@ethersproject/providers';
import { BaseContract } from 'ethers';

export interface IContract extends BaseContract {
  acceptOffer: any;
}

export interface IOffer {
  signer: JsonRpcSigner;
  loanDuration: number;
  nftCollateralId: number;
  nonce: number;
  signature?: string;
  expiry: number;
  lenderAddress?: string;
  collectionAddress?: string;
  amount: string;
  tokenAddress?: string;
  decimalToken: number;
  prepayment?: string;
  loanType: 0 | 1; // 0 p2Peer, 1 stand collection
}

export interface IRenegotiateOffer {
  loanId: number;
  signer: JsonRpcSigner;
  loanDuration: number;
  repayment: string;
  fee: string;
  nonce: number;
  expiry: number;
  signature: string;
  tokenDecimal: number;
}

export interface IOfferSync {
  signer: JsonRpcSigner;
  initiator: string;
  asset: string;
  amount: string;
  nftAsset: string;
  nftTokenId: string;
  onBehalfOf: string;
  referralCode: number;
  duration?: number;
  adminFee?: number;
  maxRepaymentAmount?: number;
  loanType?: number;
  nonce: number;
  expiry: number;
  signature: string;
  lenderAddress: string;
}
export type TypeGetRenegotiateSignature = {
  loanId: number;
  signer: JsonRpcSigner;
  loanDuration: number;
  nonce: number;
  expiry: number;
  prepayment: string;
  fee: string;
  decimalToken: number;
};

export type Network = {
  chainId: number;
  chainIdHex: string;
  rpcUrls: string[];
  chainName: string;
  nativeCurrency: { name: string; decimals: number; symbol: string };
  blockExplorerUrls: string[];
};
