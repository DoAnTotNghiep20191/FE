import { Tabs, TabsProps } from 'antd';
import './styles.scss';

interface Props extends TabsProps {}

const AchievementTabs = (props: Props) => {
  return (
    <div className="achievement-tabs">
      <Tabs className="achievement-tabs__inner" {...props} />
    </div>
  );
};

export default AchievementTabs;
