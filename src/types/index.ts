export type BOOLEAN_REACT_DOM = 1 | 0;

const KeyToVal = {
  key1: 'user_reject',
  key2: 'un_support_chain',
  key3: 'no_eth_provider',
} as const;

type Keys = keyof typeof KeyToVal;
type Values = (typeof KeyToVal)[Keys];

export type WEB3_ERROR = {
  type: Values;
  message: string;
  /*
  object error
  */
  description: any;
};

export enum EDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface IParamsQuery {
  limit?: number;
  sortBy?: string;
  direction?: EDirection;
  page?: number;
  search?: string;
}
