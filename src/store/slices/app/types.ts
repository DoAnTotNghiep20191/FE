import { EPaymentMethod, ETicketStatus } from 'src/pages/event-detail/types';
import { UserInfo } from '../user/types';

export interface EventPayload {
  name: string;
  image: string;
  startTime: string;
  endTime: string;
  maxCapacity: string;
  longitude: string;
  latitude: string;
  policy: string;
  socialTags: string;
  description: string;
  websiteUrl: string;
  tiktokUrl: string;
  instagramUrl: string;
  naverUrl: string;
  twitterUrl: string;
  isPrivate: boolean;
  password: string;
  id: number;
  isShow: string;
  team: {
    id: number;
    name: string;
    status: string;
  };
}

export interface TicketPayload {
  id: number;
  name: string;
  description: string;
  maxBuyPerUser?: number;
  maxCapacityAmount: number;
  price: string;
  currency: string;
}

export interface PromoPayload {
  id: number | string;
  name: string;
  discountAmount: number | string;
  capacity?: number | string;
  ticketOptionIds: any[];
  applyStatus?: 'on' | 'off';
}

export interface UpdatePromoPayload {
  id: number | string;
  name: string;
  discountAmount: number | string;
  capacity: number | string;
  ticketOptionId?: number | string;
  applyStatus: 'on' | 'off';
}

export interface ParamsEvent {
  limit?: number;
  page?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
  search?: string;
  status?: string;
  id?: number;
  source?: string[];
}
export interface EventQueryParams {
  limit: number;
  page?: number;
  search: string;
  status: EventStatus;
}

export enum EventStatus {
  UPCOMING = 'upcoming',
  PAST = 'past',
}

export interface TicketOptionResponse {
  id: number;
  name: string;
  description: string;
  price: string;
  currency: string;
  maxBuyPerUser: number;
  maxCapacityAmount: number;
  createdAt: string;
  purchased: string;
}

export interface PromoCodeResponse {
  name: string;
  discountAmount: number;
  capacity: number;
  applyTo: number;
  id: number;
  applyStatus: 'on' | 'off';
}

export enum EEventFilter {
  UPCOMING = 'upcoming',
  PAST = 'past',
}

export enum ECampaign {
  CAMPAIGNS = 'campaigns',
  Insights = 'insights',
}

export enum EEventStatus {
  CREATED = 'created',
  REQUEST_DEPLOY = 'request_deploy',
  DEPLOYING = 'deploying',
  DEPLOYED = 'deployed',
  CANCELED = 'canceled',
  DISABLED = 'disabled',
  UPDATED = 'updated',
  REQUEST_UPDATE = 'request_update',
}

export interface EstimatePayload {
  collectionId: number;
  ticketOptions: {
    id: number;
    amount: number;
  }[];
  promoName?: string;
}

export interface EstimatedBillResponse {
  estimatedBill: string;
  discountAmount?: string;
  discountPercentage?: string;
  errorCode?: number;
  feeAmount: string;
}

export interface PaymentPayload extends EstimatePayload {
  paymentMethod: EPaymentMethod;
  currency?: string;
  email?: string;
}

export interface HoldTicketResponse {
  amount: string | number;
  collectionId: number;
  currency: string;
  currencyAddress: string;
  deadline: string;
  email: string | null;
  id: number;
  nonce: string | null;
  paymentMethod: string;
  signature: string | null;
  status: string;
  stripeClientSecret: string | null;
  stripeIntentId: string | null;
  userId: number;
}

export interface HoldTicketOption {
  ticketOption: {
    collectionId: number;
    name: string;
  };
  ticket: any;
  id?: number;
}

export interface TicketDetailResponse {
  collection: EventPayload;
  email: string;
  giftingEmail: string;
  status: string;
  id: number;
  user: UserInfo;
  holdTicketOption: HoldTicketOption[];
  paymentMethod?: EPaymentMethod;
}
export interface PurchaseStatisticResponse {
  total: string;
  totalSold: string;
}

export interface InsightsResponse {
  totalRevenue: string;
  demographic: string;
  uniquePageView: number;
  pageView: number;
  interactions: number;
  attendance: number;
  reviews: number;
  currency: string;
}

export interface RevenueBreakdownResponse {
  capacity: number;
  name: string;
  price: string;
  purchased: number;
  revenue: number;
  currency: string;
}

export interface EventAttendanceResponse {
  username: string;
  email: string;
  type: string;
  status: string;
}
export interface EventAttendanceStatisticResponse {
  absent: number;
  checkedIn: number;
}

export interface EventPurchaseStatisticResponse {
  time: number;
  value: number;
}

export interface ReviewPayload {
  reviewReaction: string;
  reviewImage?: string;
  review?: string;
  collectionId?: number;
}

export interface ResponseReviewEnjoin {
  totalGoodReview: string;
  totalReview: string;
}

export interface ResponseReviewAll {
  id: number;
  review: string;
  reviewImage: string;
  reviewReaction: string;
  user: {
    username: string;
  };
}

export interface ResponseHasTag {
  id: number;
  thumbnailSrc: string;
  source: string;
  postUrl: string;
  displayUrl: string;
  altThumbnailSrc: string;
}

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

export interface IGiftResponse {
  hold_ticket_id: number;
  created_at: string;
  status: ETicketStatus;
  gifting_email: string;
  hold_ticket_option_id: number;
  username?: string;
  phone?: string;
  ticket_id: number;
  ticket_option_name: string;
}

export interface IGiftDataTable {
  id: number;
  createdAt: string;
  ticketName: string;
  user?: string;
  phoneNumber?: string;
  giftingEmail?: string;
  giftedDate?: string;
  status?: ETicketStatus;
}

export interface IGiftPayloadInvite {
  data: [
    {
      email: string;
      ticketOptionId: number;
    },
  ];
}

export interface IClientGiftResponse {
  id: number;
  giftingEmail: string;
  collection: {
    id: number;
    name: string;
    image: string;
    startTime: number;
    endTime: number;
    team: {
      id: number;
      name: string;
      status: string;
    };
  };
}
