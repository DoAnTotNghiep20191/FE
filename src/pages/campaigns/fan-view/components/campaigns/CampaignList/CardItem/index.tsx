import { Collapse } from 'antd';
import dayjs from 'dayjs';
import { CampaignItemRes } from 'src/store/slices/campaign/types';
import CardContent from './CardContent';
import CardHeader from './CardHeader';
import './styles.scss';
import { EUserChallengeStatus } from 'src/socket/BaseSocket';
import { useTranslation } from 'react-i18next';

interface Props {
  data: CampaignItemRes;
  onUpdateChallengeStatus: (
    campaignId: number,
    challengeId: number,
    status: EUserChallengeStatus,
  ) => void;
}

const CardItem = ({ data, onUpdateChallengeStatus }: Props) => {
  const { t } = useTranslation('campaigns');
  const startIn = dayjs(data.startDate).diff(dayjs(), 's');
  const endIn = dayjs(data.endDate).diff(dayjs(), 's');

  const isGoingOn = startIn < 0 && endIn > 0;

  return (
    <Collapse
      className="campaign-insight campaign-card-item"
      collapsible={'header'}
      defaultActiveKey={isGoingOn ? ['1'] : undefined}
      expandIcon={() => null}
      items={[
        {
          key: '1',
          label: (
            <CardHeader
              avatarUrl={data.image}
              campaignName={data.name}
              endDate={data.endDate}
              startDate={data.startDate}
              description={t('campaignDescription')}
            />
          ),
          children: (
            <CardContent
              isGoingOn={isGoingOn}
              onUpdateChallengeStatus={onUpdateChallengeStatus}
              data={data}
            />
          ),
        },
      ]}
    />
  );
};

export default CardItem;
