import { useLayoutEffect, useState } from 'react';
import { Megaphone, MegaphoneActive } from 'src/assets/icons';
import FanCampaign from './components/campaigns';
import CampaignTabs from '../components/campaign-tabs';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import FanRewardTab from './components/rewards';
import ShoppingCartIcon from 'src/assets/icons/campaigns/shopping-cart.svg?react';

const FanCampaignView = () => {
  const { t } = useTranslation('campaigns');
  const [activeKey, setActiveKey] = useState('1');
  const location = useLocation();
  const history = useHistory();

  const tabs = [
    {
      key: '1',
      label: (
        <div className="flex items-center justify-center gap-1 uppercase tracking-[2px]">
          {activeKey === '1' ? <MegaphoneActive /> : <Megaphone />}
          {t('campaigns')}
        </div>
      ),
      children: <FanCampaign />,
    },
    {
      key: '2',
      label: (
        <div className="flex items-center justify-center gap-1 uppercase tracking-[2px]">
          {activeKey === '2' ? <ShoppingCartIcon color="#008AD8" /> : <ShoppingCartIcon />}
          {t('reward')}
        </div>
      ),
      children: <FanRewardTab />,
    },
  ];

  const handleTabChange = (key: string) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', key);
    history.replace({ pathname: location.pathname, search: searchParams.toString() });
    setActiveKey(key);
  };

  useLayoutEffect(() => {
    const searchParam = new URLSearchParams(location.search);
    const currentTab = searchParam.get('tab');
    if (currentTab === '1' || !currentTab) {
      setActiveKey('1');
    } else {
      setActiveKey('2');
    }
  }, []);

  return <CampaignTabs activeKey={activeKey} onChange={handleTabChange} items={tabs} />;
};

export default FanCampaignView;
