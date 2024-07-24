import { baseQueryApi } from 'src/store/baseQueryApi';
import {
  ApiResponse,
  ContactUsPayload,
  ELoginMethod,
  LoginSuccessResponse,
  RegisterPayLoad,
  ResetPasswordPayload,
  TypeRole,
  UserInfo,
} from './types';

export const authApi = baseQueryApi.injectEndpoints({
  endpoints: (build) => ({
    loginWithTwitter: build.mutation<
      ApiResponse<{
        token: string;
      }>,
      { token: string }
    >({
      query: (params) => {
        return {
          url: '/auth/fan/login/twitter',
          body: params,
          method: 'POST',
        };
      },
    }),
    loginWithGoogle: build.mutation<
      ApiResponse<{
        token: string;
      }>,
      { token: string }
    >({
      query: (params) => {
        return {
          url: '/auth/fan/login/google',
          body: params,
          method: 'POST',
        };
      },
    }),
    loginWithInstagram: build.mutation<
      ApiResponse<{
        token: string;
      }>,
      { token: string }
    >({
      query: (params) => {
        return {
          url: '/auth/fan/login/instagram',
          body: params,
          method: 'POST',
        };
      },
    }),
    loginWithKakao: build.mutation<
      ApiResponse<{
        token: string;
      }>,
      { token: string }
    >({
      query: (params) => {
        return {
          url: '/auth/fan/login/kakao',
          body: params,
          method: 'POST',
        };
      },
    }),
    loginWithWalletConnect: build.mutation<
      ApiResponse<LoginSuccessResponse>,
      { address: string; message: string; publicKey: string; signature: string }
    >({
      query: (params) => {
        return {
          url: '/auth/fan/login/wallet-connect',
          body: params,
          method: 'POST',
        };
      },
    }),
    registerNormalFan: build.mutation<LoginSuccessResponse, RegisterPayLoad>({
      query: (params) => {
        return {
          url: '/auth/fan/register',
          body: params,
          method: 'POST',
        };
      },
    }),
    registerNormalOrganizer: build.mutation<LoginSuccessResponse, RegisterPayLoad>({
      query: (params) => {
        return {
          url: '/auth/organiser/register',
          body: params,
          method: 'POST',
        };
      },
    }),
    getUserInfo: build.query<ApiResponse<UserInfo>, any>({
      query: () => ({ url: '/user/profile' }),
      providesTags: ['user-info'],
    }),
    checkEmailExisted: build.query<ApiResponse<{ isExisted: boolean }>, { email: string }>({
      query: (params) => ({ url: '/user/check-email', params }),
    }),
    sendVerifyCode: build.mutation<ApiResponse<LoginSuccessResponse>, { email: string }>({
      query: (params) => {
        return {
          url: '/auth/fan/send-verify-code',
          body: params,
          method: 'POST',
        };
      },
    }),
    verifyCodeEmailFan: build.mutation<
      ApiResponse<any>,
      { email: string; verificationCode: string }
    >({
      query: (params) => {
        return {
          url: '/auth/fan/verify-email',
          body: params,
          method: 'POST',
        };
      },
    }),
    verifyCodeEmailFanRegister: build.mutation<
      ApiResponse<any>,
      { email: string; verificationCode: string }
    >({
      query: (params) => {
        return {
          url: '/auth/fan/verify-email-register',
          body: params,
          method: 'POST',
        };
      },
    }),
    signupWalletVerifyCodeEmailFan: build.mutation<
      ApiResponse<any>,
      { email: string; verificationCode: string }
    >({
      query: (params) => {
        return {
          url: '/auth/fan/verify-email',
          body: params,
          method: 'POST',
        };
      },
    }),

    forgotPassword: build.mutation<ApiResponse<any>, { email: string; role: TypeRole }>({
      query: (params) => {
        return {
          url: '/auth/fan/forgot-password',
          body: params,
          method: 'POST',
        };
      },
    }),
    verifyForgotPassword: build.mutation<
      ApiResponse<any>,
      { email: string; code: string; role: TypeRole }
    >({
      query: (params) => {
        return {
          url: '/auth/fan/forgot-password/verify',
          body: params,
          method: 'POST',
        };
      },
    }),
    resetPassword: build.mutation<ApiResponse<any>, ResetPasswordPayload>({
      query: (params) => {
        return {
          url: '/auth/fan/reset-password',
          body: params,
          method: 'POST',
        };
      },
    }),
    updateKyc: build.mutation<ApiResponse<any>, any>({
      query: (id) => {
        return {
          url: `/kyc/confirm/${id}`,
          method: 'POST',
        };
      },
      invalidatesTags: ['user-info'],
    }),
    contactUs: build.mutation<ApiResponse<any>, ContactUsPayload>({
      query: (params) => {
        return {
          url: '/user/contact-us',
          body: params,
          method: 'POST',
        };
      },
    }),
    getJwtToken: build.query<
      ApiResponse<any>,
      {
        email: string;
        password: string;
      }
    >({
      query: (params) => {
        return {
          url: '/auth/fan/login',
          body: params,
          method: 'POST',
        };
      },
    }),
    verifyWeb3Auth: build.mutation<
      ApiResponse<any>,
      {
        token: string;
        publicKey: string;
        address: string;
        type: ELoginMethod;
      }
    >({
      query: (params) => {
        return {
          url: '/auth/fan/verify-web3auth',
          body: params,
          method: 'POST',
        };
      },
    }),
    checkEmailParallelExist: build.query<
      ApiResponse<{
        isParallelExist: boolean;
      }>,
      {
        email: string;
      }
    >({
      query: (params) => {
        return {
          url: '/auth/fan/check-account-parallel',
          params,
          method: 'GET',
        };
      },
    }),
    challengeLogin: build.mutation<
      ApiResponse<any>,
      {
        exchangeCode: string;
        state?: string;
        socialPlatform: string;
        externalFlatformUserId?: string;
      }
    >({
      query: (body) => {
        return {
          url: '/challenge/fan/login-social',
          body,
          method: 'POST',
        };
      },
    }),
  }),
});

export const {
  useLoginWithTwitterMutation,
  useLoginWithGoogleMutation,
  useLoginWithKakaoMutation,
  useLoginWithInstagramMutation,
  useGetUserInfoQuery,
  useLazyGetUserInfoQuery,
  useRegisterNormalFanMutation,
  useRegisterNormalOrganizerMutation,
  useLoginWithWalletConnectMutation,
  useLazyCheckEmailExistedQuery,
  useSendVerifyCodeMutation,
  useVerifyCodeEmailFanMutation,
  useForgotPasswordMutation,
  useVerifyForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateKycMutation,
  useContactUsMutation,
  useLazyGetJwtTokenQuery,
  useVerifyWeb3AuthMutation,
  useLazyCheckEmailParallelExistQuery,
  useVerifyCodeEmailFanRegisterMutation,
  useChallengeLoginMutation,
} = authApi;
