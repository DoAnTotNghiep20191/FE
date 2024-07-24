// CampaignInsight.tsx
import React, { useState, useEffect } from 'react';
import { Collapse } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import useInfinitePageQuery from 'src/hooks/useInfiniteQuery';
import {
  useGetInsightCampaignsQuery,
  useGetListCampaignQuery,
} from 'src/store/slices/campaign/api';
import { CampaignItemRes, ParamsListCampaign } from 'src/store/slices/campaign/types';
import CampaignInsightContent from './CampaignInsightContent';
import CampaignInsightLabel from './CampaignInsightLabel';
import './styles.scss';
import { DefaultCampaignImage } from 'src/assets/icons';
import dayjs from 'dayjs';
import { secondOfDay } from 'src/constants';

const CampaignInsight = () => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
  const [campaignData, setCampaignData] = useState<Record<number, any>>({});
  const [activeKey, setActiveKey] = useState<number[]>([]);

  const { combinedData: listCampaign, loadMore } = useInfinitePageQuery<CampaignItemRes>({
    useGetDataListQuery: useGetListCampaignQuery,
    params: {
      limit: 4,
    } as ParamsListCampaign,
  });

  const { data: dataPositionLeaderBoard } = useGetInsightCampaignsQuery(
    { campaignId: selectedCampaignId! },
    { skip: !selectedCampaignId },
  );

  useEffect(() => {
    if (dataPositionLeaderBoard && selectedCampaignId !== null) {
      setCampaignData((prevData) => ({
        ...prevData,
        [selectedCampaignId]: dataPositionLeaderBoard?.data,
      }));
    }
  }, [dataPositionLeaderBoard, selectedCampaignId]);

  const handleLabelClick = (campaignId: number) => {
    setSelectedCampaignId(campaignId);
  };

  return (
    <div className="flex flex-col gap-[10px]">
      <InfiniteScroll
        dataLength={listCampaign?.length}
        hasMore={true}
        loader={null}
        next={loadMore}
        className="!overflow-hidden gap-1 flex flex-col"
      >
        {listCampaign.map((item: CampaignItemRes, index: number) => {
          const totalCompleted = item?.challenges.reduce((a, b) => a + Number(b.completedUsers), 0);
          const gapSeconds = dayjs(item?.endDate).diff(dayjs(), 'second');
          const timeLeft = Math.ceil(Math.abs(gapSeconds) / secondOfDay);
          const timeLeftFormat =
            gapSeconds > 0 ? `Time left ${timeLeft}d` : `Ended ${timeLeft} day ago`;
          const campaignInsightData = campaignData[item.id];

          return (
            <Collapse
              key={item.id}
              className="campaign-insight"
              collapsible={'header'}
              defaultActiveKey={[]}
              expandIcon={() => null}
              onChange={() => {
                handleLabelClick(item.id);
                setActiveKey((prev) => {
                  if (prev.includes(item.id)) {
                    return prev.filter((x) => x !== item.id);
                  } else {
                    return [...prev, item.id];
                  }
                });
              }}
              items={[
                {
                  key: index,
                  label: (
                    <CampaignInsightLabel
                      avatarUrl={item?.image || DefaultCampaignImage}
                      campaignName={item?.name}
                      totalCompleted={totalCompleted}
                      timeLeft={timeLeftFormat}
                      isOpen={activeKey.includes(item?.id)}
                    />
                  ),
                  children: <CampaignInsightContent data={campaignInsightData} />,
                },
              ]}
            />
          );
        })}
      </InfiniteScroll>
    </div>
  );
};

export default CampaignInsight;
