export interface ITicketType {
  id: number;
  name: string;
  maxBuyPerUser: number;
  maxCapacityAmount: number;
  description: string;
  price: string;
  currency: string;
  email?: string;
  promoCode?: string;
}

export enum ETicketStatus {
  HOLDING = 'holding',
  PAID = 'paid',
  DISABLE = 'disable',
  SUCCESS = 'success',
  INIT = 'init',
  MINTING_NFT = 'minting_nft',
  REFUNDING = 'processing_refund_request',
  REFUNDED = 'refunded',
}

export enum EPaymentMethod {
  CRYPTO = 'crypto',
  CARD = 'card',
  FREE_NOT_NEED_PAYMENT = 'free_not_need_payment',
  GIFTING = 'gifting',
}

export enum ECheckInStatus {
  CHECKED = 'checked',
  NOT_CHECKED = 'no_record',
  EXPIRED = 'expired',
  VALID = 'valid',
}
