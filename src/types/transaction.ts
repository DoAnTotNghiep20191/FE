export enum TX_STATUS {
  UNKNOWN = 0,
  WAITING = 1,
  APPROVED = 2,
  SUCCEED = 3,
  FAILED = 4,
  REJECTED = 99,
}

export const TX_ERROR_CODE = {
  REJECTED: 4001,
};
