import queryString from 'query-string';

import { baseQueryApi } from 'src/store/baseQueryApi';
import { ApiResponse } from '../user/types';
import {
  EventPayload,
  ParamsEvent,
  PromoPayload,
  TicketPayload,
  EventQueryParams,
  TicketOptionResponse,
  PromoCodeResponse,
  EstimatePayload,
  UpdatePromoPayload,
  EstimatedBillResponse,
  PaymentPayload,
  HoldTicketResponse,
  TicketDetailResponse,
  PurchaseStatisticResponse,
  InsightsResponse,
  RevenueBreakdownResponse,
  EventAttendanceResponse,
  EventAttendanceStatisticResponse,
  EventPurchaseStatisticResponse,
  ReviewPayload,
  ResponseReviewEnjoin,
  ResponseReviewAll,
  ResponseHasTag,
  IRefundRequest,
  IRefundsApprove,
  IRefundReject,
  IGiftPayloadInvite,
  IGiftResponse,
} from './types';

export const appApi = baseQueryApi.injectEndpoints({
  endpoints: (build) => ({
    createTeam: build.mutation<ApiResponse<any>, { name: string }>({
      query: (params) => {
        return {
          url: '/team',
          body: params,
          method: 'POST',
        };
      },
      invalidatesTags: ['user-info'],
    }),
    listTeam: build.query<ApiResponse<any>, undefined>({
      query: () => {
        return {
          url: '/team',
        };
      },
    }),
    switchTeam: build.mutation<ApiResponse<any>, { teamId: string | number }>({
      query: (params) => {
        return {
          url: '/user/switch-team',
          body: params,
          method: 'PUT',
        };
      },
      invalidatesTags: ['user-info'],
    }),
    uploadFile: build.mutation<ApiResponse<any>, FormData>({
      query: (formData) => {
        return {
          url: `/media/image`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    createEvent: build.mutation<ApiResponse<any>, EventPayload>({
      query: (params) => {
        return {
          url: '/events',
          body: params,
          method: 'POST',
        };
      },
      invalidatesTags: ['event-organizer'],
    }),
    updateEvent: build.mutation<ApiResponse<any>, EventPayload>({
      query: (params) => {
        return {
          url: `/events/${params?.id}`,
          body: params,
          method: 'PUT',
        };
      },
      invalidatesTags: ['event-organizer', 'event-detail'],
    }),
    deleteEvent: build.mutation<ApiResponse<any>, { id: number }>({
      query: ({ id }) => {
        return {
          url: `/events/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['event-organizer'],
    }),
    createTicket: build.mutation<ApiResponse<any>, TicketPayload>({
      query: (params) => {
        return {
          url: `/events/ticket-option/${params?.id}`,
          body: params,
          method: 'POST',
        };
      },
      invalidatesTags: ['ticket-option', 'event-detail'],
    }),
    updateTicket: build.mutation<ApiResponse<any>, TicketPayload>({
      query: (params) => {
        return {
          url: `/events/ticket-option/${params?.id}`,
          body: params,
          method: 'PUT',
        };
      },
      invalidatesTags: ['ticket-option', 'event-detail'],
    }),
    deleteTicket: build.mutation<ApiResponse<any>, { id: number | string }>({
      query: ({ id }) => {
        return {
          url: `/events/ticket-option/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['ticket-option', 'event-detail'],
    }),
    getMyEventOrganizer: build.query<ApiResponse<any>, ParamsEvent>({
      query: (params) => {
        return {
          url: `/events/organizer/my-event?${queryString.stringify(params)}`,
        };
      },
      providesTags: ['event-organizer', 'ticket-option'],
    }),
    createPromoCode: build.mutation<ApiResponse<any>, PromoPayload>({
      query: (params) => {
        return {
          url: `/promo/${params?.id}`,
          body: params,
          method: 'POST',
        };
      },
      invalidatesTags: ['promo-code', 'event-detail'],
    }),
    getEventData: build.query<ApiResponse<any>, EventQueryParams>({
      query: (params) => {
        return {
          url: `/events?${queryString.stringify(params)}`,
          method: 'GET',
        };
      },
    }),
    getEventDetail: build.query<ApiResponse<any>, { id: number }>({
      query: ({ id }) => {
        return {
          url: `/events/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['event-detail'],
    }),
    verifyPrivate: build.mutation<ApiResponse<any>, { password: string; id: number }>({
      query: ({ password, id }) => {
        return {
          url: `/events/verify-private/${id}`,
          body: { password: password },
          method: 'POST',
        };
      },
    }),
    getListTicketOption: build.query<ApiResponse<TicketOptionResponse[]>, ParamsEvent>({
      query: ({ id, ...params }) => {
        return {
          url: `/events/ticket-option/${id}`,
          method: 'GET',
          params: params,
        };
      },
      providesTags: ['ticket-option'],
    }),
    getListTicketOptionDraft: build.query<ApiResponse<TicketOptionResponse[]>, ParamsEvent>({
      query: ({ id, ...params }) => {
        return {
          url: `/events/ticket-option-draft/${id}`,
          method: 'GET',
          params: params,
        };
      },
      providesTags: ['ticket-option'],
    }),
    getListPromoCode: build.query<ApiResponse<PromoCodeResponse[]>, ParamsEvent>({
      query: ({ id, ...params }) => {
        return {
          url: `/promo/${id}`,
          method: 'GET',
          params,
        };
      },
      providesTags: ['promo-code'],
    }),
    updatePromoCode: build.mutation<ApiResponse<any>, UpdatePromoPayload>({
      query: ({ id, ...params }) => {
        return {
          url: `/promo/${id}`,
          body: params,
          method: 'PUT',
        };
      },
      invalidatesTags: ['promo-code', 'event-detail'],
    }),
    deletePromoCode: build.mutation<ApiResponse<any>, { id: number }>({
      query: ({ id }) => {
        return {
          url: `/promo/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['promo-code', 'event-detail'],
    }),
    publishEvent: build.mutation<ApiResponse<any>, { id: number }>({
      query: ({ id }) => {
        return {
          url: `/events/organizer/publish/${id}`,
          method: 'POST',
        };
      },
      invalidatesTags: ['event-organizer'],
    }),
    paymentEstimate: build.mutation<ApiResponse<EstimatedBillResponse>, EstimatePayload>({
      query: (params) => {
        return {
          url: '/payment/estimate',
          method: 'POST',
          body: params,
        };
      },
    }),
    payment: build.mutation<ApiResponse<EstimatedBillResponse>, PaymentPayload>({
      query: (params) => {
        return {
          url: '/payment',
          method: 'POST',
          body: params,
        };
      },
    }),
    getHoldTicket: build.query<ApiResponse<HoldTicketResponse>, { id: number }>({
      query: ({ id }) => {
        return {
          url: `/payment/hold-ticket/${id}`,
          method: 'GET',
        };
      },
    }),
    getTicketDetail: build.query<ApiResponse<TicketDetailResponse[]>, { id: number }>({
      query: ({ id }) => {
        return {
          url: `/tickets/hold-ticket/${id}`,
          method: 'GET',
          cache: 'no-cache',
        };
      },
    }),
    getEventPurchases: build.query<ApiResponse<any>, ParamsEvent>({
      query: ({ id, ...rest }) => {
        return {
          url: `/events/purchases/${id}`,
          params: { ...rest },
        };
      },
    }),
    getPurchaseStatistic: build.query<ApiResponse<PurchaseStatisticResponse>, { id: number }>({
      query: ({ id }) => {
        return {
          url: `/events/purchases/statistcal/${id}`,
          method: 'GET',
        };
      },
    }),
    getInsights: build.query<ApiResponse<InsightsResponse>, { id: number }>({
      query: ({ id }) => {
        return {
          url: `/events/insights/${id}`,
          method: 'GET',
        };
      },
    }),
    getRevenueBreakdown: build.query<ApiResponse<RevenueBreakdownResponse[]>, { id: number }>({
      query: ({ id }) => {
        return {
          url: `/events/revenue-breakdown/${id}`,
          method: 'GET',
        };
      },
    }),
    getEventAttendance: build.query<
      ApiResponse<EventAttendanceResponse[]>,
      { id: number; search: string }
    >({
      query: ({ id, search }) => {
        return {
          url: `/events/event-attendance/${id}`,
          method: 'GET',
          params: { search },
        };
      },
    }),
    getEventAttendanceStatistic: build.query<
      ApiResponse<EventAttendanceStatisticResponse>,
      { id: number }
    >({
      query: ({ id }) => {
        return {
          url: `/events/event-attendance/statistical/${id}`,
          method: 'GET',
        };
      },
    }),
    getEventPurchaseStatistic: build.query<
      ApiResponse<EventPurchaseStatisticResponse[]>,
      { id: number; endTime: number }
    >({
      query: ({ id, ...params }) => {
        return {
          url: `/events/ticket-purchase/chart/${id}`,
          method: 'GET',
          params: params,
        };
      },
    }),
    getMyEventFan: build.query<ApiResponse<any>, ParamsEvent>({
      query: (params) => {
        return {
          url: `/events/fan/my-event?${queryString.stringify(params)}`,
        };
      },
    }),
    getFanPurchasesHistories: build.query<ApiResponse<any>, ParamsEvent>({
      query: (params) => {
        return {
          url: '/user/fan/purchases/histories',
          params: params,
        };
      },
    }),
    reviews: build.mutation<ApiResponse<any>, ReviewPayload>({
      query: (params) => {
        return {
          url: '/reviews',
          method: 'POST',
          body: params,
        };
      },
    }),
    updateReviews: build.mutation<ApiResponse<any>, ReviewPayload>({
      query: ({ collectionId, ...rest }) => {
        return {
          url: `/reviews/${collectionId}`,
          method: 'PATCH',
          body: rest,
        };
      },
    }),
    changePassword: build.mutation<
      ApiResponse<EstimatedBillResponse>,
      { oldPassword: string; newPassword: string }
    >({
      query: (params) => {
        return {
          url: '/auth/fan/change-password',
          method: 'POST',
          body: params,
        };
      },
    }),
    changeOrganizerPassword: build.mutation<
      ApiResponse<EstimatedBillResponse>,
      { oldPassword: string; newPassword: string }
    >({
      query: (params) => {
        return {
          url: '/auth/organiser/change-password',
          method: 'POST',
          body: params,
        };
      },
    }),
    getReviews: build.query<ApiResponse<any>, { id: number }>({
      query: ({ id }) => {
        return {
          url: `/reviews/${id}`,
          method: 'GET',
        };
      },
    }),
    getReviewAll: build.query<ApiResponse<ResponseReviewAll[]>, ParamsEvent>({
      query: ({ id, ...params }) => {
        return {
          url: `/reviews/all/${id}`,
          method: 'GET',
          params: params,
        };
      },
    }),
    getReviewEnjoy: build.query<ApiResponse<ResponseReviewEnjoin>, { id: number }>({
      query: ({ id }) => {
        return {
          url: `/reviews/enjoy/${id}`,
          method: 'GET',
        };
      },
    }),
    getTicketById: build.query<ApiResponse<TicketDetailResponse[]>, { id: number }>({
      query: ({ id }) => {
        return {
          url: `/tickets/${id}`,
        };
      },
    }),
    getSessionTicketById: build.query<
      ApiResponse<{
        sessionCode: string;
        createdAt: number;
      }>,
      { id: number }
    >({
      query: ({ id }) => {
        return {
          url: `/tickets/session-code/${id}`,
        };
      },
    }),
    refreshSessionTicket: build.query<
      ApiResponse<{
        sessionCode: string;
        createdAt: number;
      }>,
      { id: number }
    >({
      query: ({ id }) => {
        return {
          url: `/tickets/session-code/refresh/${id}`,
        };
      },
    }),
    validateSessionCode: build.mutation<ApiResponse<any>, { id: string; sessionCode: string }>({
      query: ({ id, sessionCode }) => {
        return {
          url: `/tickets/validate-session-code/${id}`,
          method: 'POST',
          body: {
            sessionCode,
          },
        };
      },
    }),
    checkInTicket: build.mutation<ApiResponse<any>, { id: number; sessionCode: string }>({
      query: ({ id, sessionCode }) => {
        return {
          url: `/tickets/check-in/${id}`,
          method: 'PATCH',
          body: {
            sessionCode,
          },
        };
      },
    }),
    subscribedNotification: build.mutation<ApiResponse<any>, { id: number }>({
      query: ({ id }) => {
        return {
          url: `/events/fan/register/${id}`,
          method: 'POST',
        };
      },
      invalidatesTags: ['event-detail'],
    }),
    getHashtagsSocial: build.query<ApiResponse<ResponseHasTag[]>, ParamsEvent>({
      query: ({ id, ...params }) => {
        return {
          url: `/hashtags/social-posts/collection/${id}?${queryString.stringify(params)}`,
          method: 'GET',
        };
      },
    }),
    checkUserInvite: build.mutation<ApiResponse<{ isRegister: boolean }>, { token: string }>({
      query: ({ token }) => {
        return {
          url: `/auth/organiser/check-user-invite`,
          method: 'POST',
          body: {
            token: token,
          },
        };
      },
    }),
    checkStatusPayment: build.mutation<ApiResponse<any>, { id: number }>({
      query: ({ id }) => {
        return {
          url: `/payment/check-status/${id}`,
          method: 'POST',
        };
      },
    }),
    fanRequestRefund: build.mutation<ApiResponse<any>, { payload: IRefundRequest }>({
      query: ({ payload }) => {
        return {
          url: '/refund/fan/request',
          method: 'POST',
          body: payload,
        };
      },
    }),
    organizerApproveRequest: build.mutation<ApiResponse<any>, { payload: IRefundsApprove }>({
      query: ({ payload }) => {
        return {
          url: '/refund/organizer/approve',
          method: 'PUT',
          body: payload,
        };
      },
    }),
    organizerRejectRefund: build.mutation<ApiResponse<any>, { payload: IRefundReject }>({
      query: ({ payload }) => {
        return {
          url: '/refund/organizer/reject',
          method: 'PUT',
          body: payload,
        };
      },
    }),

    organizerGiftInvite: build.mutation<
      ApiResponse<any>,
      { payload: IGiftPayloadInvite; collectionId: number }
    >({
      query: ({ payload, collectionId }) => {
        return {
          url: `/gift/invite/${collectionId}`,
          method: 'POST',
          body: payload,
        };
      },
    }),

    clientCheckUserAlready: build.mutation<ApiResponse<any>, { token: string }>({
      query: ({ token }) => {
        return {
          url: '/gift/verify-user',
          method: 'POST',
          body: { token: token },
        };
      },
    }),

    organizerGetGifts: build.query<
      ApiResponse<IGiftResponse[]>,
      { collectionId: number; query?: string }
    >({
      query: ({ collectionId, query, ...params }) => {
        return {
          url: `/gift/${collectionId}`,
          method: 'GET',
          params: { ...params },
        };
      },
    }),
    organizerExportGiftCSV: build.query<
      ApiResponse<any>,
      { collectionId: number; payload?: Record<'search', string> }
    >({
      query: ({ collectionId, payload }) => {
        return {
          url: `/gift/export/${collectionId}`,
          method: 'PATCH',
          body: {
            ...(payload && { ...payload }),
            direction: 'ASC',
          },
        };
      },
    }),
    organizerRevokeTicket: build.mutation<
      ApiResponse<any>,
      { collectionId: number; payload: { holdTicketIds: number[]; reason: string } }
    >({
      query: ({ collectionId, payload }) => {
        return {
          url: `/gift/revoke/${collectionId}`,
          method: 'POST',
          body: { ...payload },
        };
      },
    }),
    clientGetListGift: build.mutation<ApiResponse<any>, undefined>({
      query: () => {
        return {
          url: '/gift/list-gifting-tickets',
          method: 'POST',
        };
      },
    }),
    clientClaimTicket: build.mutation<ApiResponse<any>, { collectionId: number }>({
      query: ({ collectionId }) => {
        return {
          url: `/gift/accept/${collectionId}`,
          method: 'POST',
        };
      },
    }),
    getTotalGiftedTicketAmount: build.query<ApiResponse<any>, { collectionId: number }>({
      query: ({ collectionId }) => {
        return {
          url: `/gift/gifted-amount/${collectionId}`,
          method: 'GET',
        };
      },
    }),
  }),
});

export const {
  useCreateTeamMutation,
  useListTeamQuery,
  useSwitchTeamMutation,
  useUploadFileMutation,
  useCreateEventMutation,
  useUpdateEventMutation,
  useCreateTicketMutation,
  useGetMyEventOrganizerQuery,
  useCreatePromoCodeMutation,
  useGetEventDataQuery,
  useGetEventDetailQuery,
  useVerifyPrivateMutation,
  useGetListTicketOptionQuery,
  useGetListTicketOptionDraftQuery,
  useGetListPromoCodeQuery,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  usePublishEventMutation,
  useDeleteEventMutation,
  usePaymentEstimateMutation,
  useUpdatePromoCodeMutation,
  useDeletePromoCodeMutation,
  usePaymentMutation,
  useLazyGetHoldTicketQuery,
  useGetTicketDetailQuery,
  useLazyGetTicketDetailQuery,
  useGetEventPurchasesQuery,
  useGetPurchaseStatisticQuery,
  useGetInsightsQuery,
  useGetRevenueBreakdownQuery,
  useGetEventAttendanceQuery,
  useGetEventAttendanceStatisticQuery,
  useGetEventPurchaseStatisticQuery,
  useGetMyEventFanQuery,
  useGetFanPurchasesHistoriesQuery,
  useReviewsMutation,
  useUpdateReviewsMutation,
  useChangePasswordMutation,
  useLazyGetReviewsQuery,
  useGetReviewAllQuery,
  useGetReviewEnjoyQuery,
  useChangeOrganizerPasswordMutation,
  useCheckInTicketMutation,
  useGetTicketByIdQuery,
  useLazyGetTicketByIdQuery,
  useSubscribedNotificationMutation,
  useGetHashtagsSocialQuery,
  useCheckUserInviteMutation,
  useCheckStatusPaymentMutation,
  useFanRequestRefundMutation,
  useOrganizerApproveRequestMutation,
  useOrganizerRejectRefundMutation,
  useLazyGetSessionTicketByIdQuery,
  useLazyRefreshSessionTicketQuery,
  useValidateSessionCodeMutation,
  useOrganizerGiftInviteMutation,
  useClientCheckUserAlreadyMutation,
  useOrganizerGetGiftsQuery,
  useOrganizerExportGiftCSVQuery,
  useOrganizerRevokeTicketMutation,
  useClientGetListGiftMutation,
  useClientClaimTicketMutation,
  useGetTotalGiftedTicketAmountQuery,
} = appApi;
