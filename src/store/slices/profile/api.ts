import { baseQueryApi } from 'src/store/baseQueryApi';
import { ApiResponse, RegisterOrganizerPayload, UpdateInfoPayload } from '../user/types';
import {
  BankPayload,
  BankResponse,
  ETeamRole,
  EventQueryParams,
  InvitationPayload,
  MemberTeam,
  RequestOrganizeResponse,
} from './types';

export const profileApi = baseQueryApi.injectEndpoints({
  endpoints: (build) => ({
    getBank: build.query<ApiResponse<BankResponse>, undefined>({
      query: () => {
        return {
          url: '/banks',
          method: 'GET',
        };
      },
      providesTags: ['bank-detail'],
    }),
    saveBank: build.mutation<ApiResponse<any>, BankPayload>({
      query: (params) => {
        return {
          url: '/banks',
          method: 'POST',
          body: params,
        };
      },
    }),
    updateBank: build.mutation<ApiResponse<any>, BankPayload>({
      query: ({ id, ...params }) => {
        return {
          url: `/banks/${id}`,
          method: 'PATCH',
          body: params,
        };
      },
      invalidatesTags: ['bank-detail'],
    }),
    updateUserInfo: build.mutation<any, UpdateInfoPayload>({
      query: (params) => {
        return {
          url: '/user/profile',
          body: params,
          method: 'PUT',
        };
      },
      invalidatesTags: ['user-info'],
    }),
    checkRequestOrganizer: build.query<ApiResponse<RequestOrganizeResponse>, undefined>({
      query: () => {
        return {
          url: '/user/check-request-exist',
          method: 'GET',
        };
      },
      providesTags: ['user-info'],
    }),
    registerOrganizer: build.mutation<any, RegisterOrganizerPayload>({
      query: (params) => {
        return {
          url: '/user/become-organizer',
          body: params,
          method: 'POST',
        };
      },
      invalidatesTags: ['user-info'],
    }),
    inviteTeam: build.mutation<ApiResponse<any>, InvitationPayload>({
      query: ({ idTeam, ...params }) => {
        return {
          url: `/team/${idTeam}/invitation`,
          method: 'POST',
          body: params,
        };
      },
      invalidatesTags: ['team-invite'],
    }),
    getMemberByTeam: build.query<ApiResponse<MemberTeam[]>, EventQueryParams>({
      query: ({ teamId, ...params }) => {
        return {
          url: `/team/${teamId}/member`,
          params: params,
          method: 'GET',
        };
      },
      providesTags: ['team-invite'],
    }),
    changeRoleTeam: build.mutation<
      ApiResponse<any>,
      { idTeam: number; memberId: number; role: ETeamRole }
    >({
      query: ({ idTeam, ...params }) => {
        return {
          url: `/team/${idTeam}/change-role`,
          method: 'PUT',
          body: params,
        };
      },
      invalidatesTags: ['team-invite'],
    }),
    removeMember: build.mutation<ApiResponse<any>, { idTeam: number; memberId: number }>({
      query: ({ idTeam, ...params }) => {
        return {
          url: `/team/${idTeam}/remove-member`,
          method: 'DELETE',
          body: params,
        };
      },
      invalidatesTags: ['team-invite'],
    }),
    sendCodeUpdateEmail: build.mutation<ApiResponse<any>, { email: string }>({
      query: (params) => {
        return {
          url: `/auth/fan/send-code-validate`,
          method: 'POST',
          body: params,
        };
      },
    }),
    verifyCodeUpdateEmail: build.mutation<ApiResponse<any>, { email: string; code: string }>({
      query: (params) => {
        return {
          url: `/auth/fan/verify-code`,
          method: 'POST',
          body: params,
        };
      },
    }),
    verifyInviteToken: build.mutation<ApiResponse<any>, { token: string }>({
      query: (params) => {
        return {
          url: `/auth/organiser/verify-invitation-token`,
          method: 'POST',
          body: params,
        };
      },
      invalidatesTags: ['user-info'],
    }),
    verifyKYC: build.mutation<ApiResponse<any>, void>({
      query: () => {
        return {
          url: `/kyc`,
          method: 'POST',
        };
      },
    }),
    refreshKYC: build.mutation<ApiResponse<any>, void>({
      query: () => {
        return {
          url: `/kyc/refresh`,
          method: 'POST',
        };
      },
    }),
    checkAllowance: build.query<
      ApiResponse<{
        isBankDetail: boolean;
        isFreeEvent: boolean;
      }>,
      { id: number }
    >({
      query: ({ id }) => {
        return {
          url: `/events/check-allowance/${id}`,
          method: 'GET',
        };
      },
    }),
    switchLanguage: build.mutation<ApiResponse<any>, string>({
      query: (payload) => {
        return {
          url: `/user/switch-language`,
          method: 'PATCH',
          body: { language: payload },
        };
      },
      invalidatesTags: ['user-info'],
    }),
  }),
});

export const {
  useGetBankQuery,
  useLazyGetBankQuery,
  useSaveBankMutation,
  useUpdateBankMutation,
  useUpdateUserInfoMutation,
  useInviteTeamMutation,
  useGetMemberByTeamQuery,
  useChangeRoleTeamMutation,
  useRemoveMemberMutation,
  useSendCodeUpdateEmailMutation,
  useVerifyCodeUpdateEmailMutation,
  useVerifyInviteTokenMutation,
  useVerifyKYCMutation,
  useRefreshKYCMutation,
  useLazyCheckAllowanceQuery,
  useSwitchLanguageMutation,
  useRegisterOrganizerMutation,
  useCheckRequestOrganizerQuery,
} = profileApi;
