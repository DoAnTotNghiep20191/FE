import ArrowRightIcon from 'src/assets/icons/common/arrow-right.svg?react';
import StatisticsItem from './StatisticItem';
import './styles.scss';
import CustomSearch from 'src/components/Search';
import { useTranslation } from 'react-i18next';
import { useGetTotalCompletedChallengeAndCampaignQuery } from 'src/store/slices/campaign/api';

interface Props {
  onShowAchievement: () => void;
  isViewPastCampaign: boolean;
  onViewPastCampaign: () => void;
  searchValue: string;
  onSearch: (val: string) => void;
  totalAchievement: number;
}

const Statistics = ({
  onShowAchievement,
  isViewPastCampaign,
  onViewPastCampaign,
  searchValue,
  onSearch,
  totalAchievement,
}: Props) => {
  const { t } = useTranslation('campaigns');
  const { t: commonTranslation } = useTranslation('translations');
  const { data } = useGetTotalCompletedChallengeAndCampaignQuery(null);
  return (
    <div className="px-[10px] flex flex-col gap-[10px]">
      <div className="border-wrap rounded-[10px]">
        <div
          onClick={onShowAchievement}
          className="campaign-statistic flex items-center gap-[5px] justify-center w-[168px] relative bg-newBlack text-white py-[4px] px-[6px] rounded-[10px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] cursor-[pointer]"
        >
          <span>
            {totalAchievement} {t('achievements')}
          </span>
          <div className="absolute right-[10px] ">
            <ArrowRightIcon />
          </div>
        </div>
      </div>
      <div className="flex gap-[10px]">
        <StatisticsItem
          number={data?.data?.countCompletedCampaigns || 0}
          label={t('campaignCompleted')}
        />
        <StatisticsItem
          number={data?.data?.countCompletedChallenges || 0}
          label={t('challengeCompleted')}
        />
      </div>
      <div>
        <CustomSearch
          onChange={(e) => {
            onSearch(e.target.value);
          }}
          value={searchValue}
          placeholder={t('searchPlaceholder')}
          className="md:w-full md:h-[53px] !w-[100%] !pl-[10px]"
        />
      </div>
      <div>
        <div
          onClick={onViewPastCampaign}
          style={{
            background: isViewPastCampaign ? '#8F90A6' : 'transparent',
            color: isViewPastCampaign ? '#fff' : '#8F90A6',
          }}
          className="border-solid border-[1px] border-gray w-[168px] rounded-[100px] py-[2px] flex justify-center text-gray cursor-pointer"
        >
          <span>{t('viewPastCampaigns')}</span>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
