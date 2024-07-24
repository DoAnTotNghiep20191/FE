import { Tabs } from 'antd';
import { useState } from 'react';
import { InsightActiveIcon, InsightIcon, Megaphone, MegaphoneActive } from 'src/assets/icons';
import CampaignInsight from '../campaign-insights';
import CampaignsTab from '../campaigns-tab';
import './styles.scss';

const CampaignsFlow = () => {
  const [activeKey, setActiveKey] = useState('1');
  const handleTabChange = (key: string) => {
    setActiveKey(key);
  };

  const tabs = [
    {
      key: '1',
      label: (
        <div className="flex items-center justify-center gap-1">
          {activeKey === '1' ? <MegaphoneActive /> : <Megaphone />}
          CAMPAIGNS
        </div>
      ),
      children: <CampaignsTab />,
    },
    {
      key: '2',
      label: (
        <div className="flex items-center justify-center gap-1">
          {activeKey === '2' ? <InsightActiveIcon /> : <InsightIcon />}
          INSIGHTS
        </div>
      ),
      children: <CampaignInsight />,
    },
  ];

  return (
    <div className="w-[100%] md:w-[675px] flex flex-col items-center justify-center m-auto md:px-0">
      <div className="campaign-content">
        <Tabs onChange={handleTabChange} items={tabs} />
      </div>
    </div>
  );
};

export default CampaignsFlow;
