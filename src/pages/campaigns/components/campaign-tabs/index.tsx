import { Tabs, TabsProps } from 'antd';
import './styles.scss';
interface Props extends TabsProps {}

const CampaignTabs = ({ items, ...restProps }: Props) => {
  return (
    <div className="campaign-tabs">
      <Tabs className="campaign-tabs__inner" items={items} {...restProps} />
    </div>
  );
};

export default CampaignTabs;
