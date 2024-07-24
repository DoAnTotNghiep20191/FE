import { TabsProps } from 'antd';
import ArrowRightIcon from 'src/assets/icons/common/arrow-right.svg?react';
import AchievementTabs from './AchivementTabs';
import Trophy1 from 'src/assets/icons/campaigns/trophy1.svg?react';
import Trophy2 from 'src/assets/icons/campaigns/trophy2.svg?react';
import Trophy3 from 'src/assets/icons/campaigns/trophy3.svg?react';
import SBT from 'src/assets/icons/campaigns/SBT.svg?react';
import AllAchievementTab from './AllAchievementTab';
import { useLayoutEffect, useState } from 'react';
import AchievementDetail from './AchievementDetail';
import { useHistory, useLocation } from 'react-router-dom';
import useInfinitePageQuery from 'src/hooks/useInfiniteQuery';
import { AchievementsResponse } from 'src/store/slices/campaign/types';
import { useGetFanAchievementsQuery } from 'src/store/slices/campaign/api';
import { useTranslation } from 'react-i18next';

interface Props {
  onBack: () => void;
  listAchievement: AchievementsResponse[];
  totalAchievements: number;
  selectedAchievementId: string;
  selectedAchievement: {
    next: AchievementsResponse | null;
    this: AchievementsResponse | null;
    prev: AchievementsResponse | null;
  } | null;
  onSelectedAchievementChange: (id: string) => void;
}

enum TabKey {
  All = '1',
  SBT = '2',
  Bronze = '3',
  Silver = '4',
  Gold = '5',
}

const tabMap = {
  [TabKey.All]: undefined,
  [TabKey.SBT]: 'SoulBound_token',
  [TabKey.Bronze]: 'Easy',
  [TabKey.Silver]: 'Medium',
  [TabKey.Gold]: 'Hard',
};

const AchievementList = ({
  onBack,
  totalAchievements,
  selectedAchievement,
  onSelectedAchievementChange,
  selectedAchievementId,
}: Props) => {
  const { t } = useTranslation('campaigns');
  const [activeKey, setActiveKey] = useState<TabKey>(TabKey.All);
  const location = useLocation();
  const history = useHistory();

  const { combinedData, loadMore } = useInfinitePageQuery<AchievementsResponse>({
    useGetDataListQuery: useGetFanAchievementsQuery,
    params: {
      limit: 20,
      direction: 'DESC',
      sortBy: 'createdAt',
      difficulty: tabMap[activeKey],
      statuses: ['Deployed'],
    },
  });

  const handleClickAchievement = (item: AchievementsResponse) => {
    onSelectedAchievementChange(item.id.toString());
  };

  const items: TabsProps['items'] = [
    {
      key: TabKey.All,
      label: <div className="tab-label text-[14px] text-white">ALL</div>,
      children: (
        <AllAchievementTab
          data={combinedData}
          onClick={handleClickAchievement}
          loadMore={loadMore}
        />
      ),
    },
    {
      key: TabKey.SBT,
      label: (
        <div className="tab-label">
          <SBT />
        </div>
      ),
      children: (
        <AllAchievementTab
          data={combinedData}
          onClick={handleClickAchievement}
          loadMore={loadMore}
        />
      ),
    },
    {
      key: TabKey.Bronze,
      label: (
        <div className="tab-label">
          <Trophy3 />
        </div>
      ),
      children: (
        <AllAchievementTab
          data={combinedData}
          onClick={handleClickAchievement}
          loadMore={loadMore}
        />
      ),
    },
    {
      key: TabKey.Silver,
      label: (
        <div className="tab-label">
          <Trophy1 />
        </div>
      ),
      children: (
        <AllAchievementTab
          data={combinedData}
          onClick={handleClickAchievement}
          loadMore={loadMore}
        />
      ),
    },
    {
      key: TabKey.Gold,
      label: (
        <div className="tab-label">
          <Trophy2 />
        </div>
      ),
      children: (
        <AllAchievementTab
          data={combinedData}
          onClick={handleClickAchievement}
          loadMore={loadMore}
        />
      ),
    },
  ];

  const handleTabChange = (key: TabKey) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('achieveTab', key);
    history.replace({ pathname: location.pathname, search: searchParams.toString() });
    setActiveKey(key);
  };

  useLayoutEffect(() => {
    const searchParam = new URLSearchParams(location.search);
    const currentTab = searchParam.get('achieveTab');
    const tabs = [TabKey.All, TabKey.Bronze, TabKey.Silver, TabKey.Gold];
    if (currentTab && tabs.includes(currentTab as TabKey)) {
      setActiveKey(currentTab as TabKey);
    } else {
      setActiveKey(TabKey.All);
    }
  }, []);

  return (
    <div className="flex flex-col gap-[10px] px-[10px]">
      <div className="border-wrap rounded-[10px]">
        <div
          onClick={onBack}
          className="campaign-statistic flex items-center gap-[5px] justify-center w-[168px] relative bg-newBlack text-white py-[4px] px-[6px] rounded-[10px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] cursor-[pointer]"
        >
          <div className="absolute left-[10px] rotate-180">
            <ArrowRightIcon />
          </div>
          <span>
            {totalAchievements} {t('achievements')}
          </span>
        </div>
      </div>
      <div>
        {selectedAchievementId && selectedAchievement?.this ? (
          <AchievementDetail
            nextable={!!selectedAchievement.next}
            backable={!!selectedAchievement.prev}
            onNextItem={() => {
              onSelectedAchievementChange(selectedAchievement?.next?.id.toString() || '');
            }}
            onBackItem={() => {
              onSelectedAchievementChange(selectedAchievement?.prev?.id.toString() || '');
            }}
            data={selectedAchievement.this}
          />
        ) : (
          <AchievementTabs
            onChange={(key) => {
              handleTabChange(key as TabKey);
            }}
            activeKey={activeKey}
            items={items}
          />
        )}
      </div>
    </div>
  );
};

export default AchievementList;
