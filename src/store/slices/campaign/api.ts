import { baseQueryApi } from 'src/store/baseQueryApi';
import { ApiResponse } from '../user/types';
import {
  AchievementsResponse,
  CampaignItemRes,
  CreateCampaignPayload,
  EventCampaignRes,
  FanRewardsItem,
  ICampaignInsightRes,
  IExecuteChallengeRes,
  LeaderBoardRes,
  OrganizerRedeemRewardParams,
  ParamsFanAchievement,
  ParamsFanRewards,
  ParamsLeaderBoardById,
  ParamsListCampaign,
  ParamsListEventCampaign,
  PositionLeaderBoardRes,
  RedeemRewardPayload,
  UpdateCampaignPayload,
} from './types';
import { omit } from 'lodash';

export const campaignApi = baseQueryApi.injectEndpoints({
  endpoints: (build) => ({
    createCampaign: build.mutation<any, CreateCampaignPayload>({
      query: (params) => {
        return {
          url: '/campaigns',
          body: params,
          method: 'POST',
        };
      },
    }),
    updateCampaign: build.mutation<ApiResponse<any>, UpdateCampaignPayload>({
      query: (params) => {
        return {
          url: `/campaigns/${params?.id}`,
          body: params,
          method: 'PUT',
        };
      },
    }),
    getEventCampaign: build.query<ApiResponse<EventCampaignRes[]>, ParamsListEventCampaign>({
      query: (params) => {
        return {
          url: '/events/organizer/event-campaign',
          method: 'GET',
          params,
        };
      },
    }),
    getListCampaign: build.query<ApiResponse<CampaignItemRes[]>, ParamsListCampaign>({
      query: (params) => {
        if (params.viewStatus) {
          const queryString = params.viewStatus.reduce((acc, item, index) => {
            if (index === 0) {
              return `viewStatus=${item}`;
            } else {
              return acc + `&viewStatus=${item}`;
            }
          }, '');

          return {
            url: `/campaigns?${queryString}`,
            method: 'GET',
            params: omit(params, 'viewStatus'),
          };
        }

        return {
          url: `/campaigns`,
          method: 'GET',
          params,
        };
      },
    }),
    fanExecuteChallenge: build.mutation<
      ApiResponse<IExecuteChallengeRes>,
      {
        campaignId: number;
        challengeId: number;
      }
    >({
      query: (params) => {
        return {
          url: '/challenge/fan/excute',
          method: 'POST',
          body: params,
        };
      },
    }),
    fanVerifyChallenge: build.mutation<
      ApiResponse<any>,
      {
        campaignId: number;
        challengeId: number;
        submittedData?: string;
      }
    >({
      query: (params) => {
        return {
          url: '/challenge/fan/submission',
          method: 'POST',
          body: params,
        };
      },
    }),

    getLeaderBoardById: build.query<ApiResponse<LeaderBoardRes[]>, ParamsLeaderBoardById>({
      query: (params) => {
        return {
          url: `/campaigns/leaderboard/${params.campaignId}`,
          method: 'GET',
          params: {
            limit: params.limit,
            page: params.page,
            showRewarded: params.showRewarded,
          },
        };
      },
    }),

    getPositionLeaderBoard: build.query<
      ApiResponse<PositionLeaderBoardRes>,
      { campaignId: number }
    >({
      query: (params) => {
        return {
          url: `/campaigns/leaderboard/position/${params.campaignId}`,
          method: 'GET',
        };
      },
    }),

    getInsightCampaigns: build.query<ApiResponse<ICampaignInsightRes>, { campaignId: number }>({
      query: (params) => {
        return {
          url: `/campaigns/insights/${params.campaignId}`,
          method: 'GET',
        };
      },
    }),

    organizerRedeemReward: build.mutation<any, OrganizerRedeemRewardParams>({
      query: (params) => {
        return {
          url: `/campaigns/claim-rewards/${params.campaignId}/code/${params.redeemCode}`,
          method: 'POST',
        };
      },
    }),
    getFanRewards: build.query<ApiResponse<FanRewardsItem[]>, ParamsFanRewards>({
      query: (params) => {
        return {
          url: `/campaigns/rewards/fan`,
          method: 'GET',
          params,
        };
      },
      providesTags: ['fan-rewards'],
    }),

    redeemReward: build.mutation<any, RedeemRewardPayload>({
      query: (params) => {
        return {
          url: `/campaigns/redeem-rewards/${params?.userRewardId}`,
          method: 'POST',
        };
      },
      invalidatesTags: ['fan-rewards'],
    }),

    getFanAchievements: build.query<ApiResponse<AchievementsResponse[]>, ParamsFanAchievement>({
      query: (params) => {
        return {
          url: `/campaigns/archivements/fan`,
          method: 'GET',
          params,
        };
      },
    }),
    getTotalCompletedChallengeAndCampaign: build.query<
      ApiResponse<{
        countCompletedCampaigns: number;
        countCompletedChallenges: number;
      }>,
      null
    >({
      query: () => {
        return {
          url: '/campaigns/archivements/count',
          method: 'GET',
        };
      },
    }),
    getAchievementDetail: build.query<
      ApiResponse<{
        this: AchievementsResponse;
        next: AchievementsResponse;
        prev: AchievementsResponse;
      }>,
      string
    >({
      query: (id) => {
        return {
          url: `/campaigns/archivements/fan/${id}`,
          method: 'GET',
        };
      },
    }),
  }),
});

export const {
  useCreateCampaignMutation,
  useGetEventCampaignQuery,
  useGetListCampaignQuery,
  useUpdateCampaignMutation,
  useGetLeaderBoardByIdQuery,
  useGetPositionLeaderBoardQuery,
  useFanExecuteChallengeMutation,
  useFanVerifyChallengeMutation,
  useGetInsightCampaignsQuery,
  useOrganizerRedeemRewardMutation,
  useGetFanRewardsQuery,
  useRedeemRewardMutation,
  useGetFanAchievementsQuery,
  useGetTotalCompletedChallengeAndCampaignQuery,
  useGetAchievementDetailQuery,
} = campaignApi;
