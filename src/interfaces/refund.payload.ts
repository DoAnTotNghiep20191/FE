interface IRefundBase {
  collectionId: number;
  ticketId: number;
}

export interface IRefundRequest extends IRefundBase {
  reasonOfFan: string;
}

export interface IRefundsApprove {
  collectionId: number;
  ticketIds: number[];
  refundReason: string;
}

export interface IRefundReject extends IRefundBase {
  reasonOfOrganizer: string;
}
