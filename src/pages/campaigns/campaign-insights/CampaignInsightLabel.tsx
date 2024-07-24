import { useTranslation } from 'react-i18next';

interface Props {
  avatarUrl: string;
  campaignName: string;
  timeLeft: string;
  totalCompleted: number;
  isOpen: boolean;
}

const CampaignInsightLabel = ({
  avatarUrl,
  campaignName,
  timeLeft,
  totalCompleted,
  isOpen,
}: Props) => {
  const { t } = useTranslation('campaigns');
  return (
    <div>
      <div className="flex justify-between text-white">
        <div className="flex items-center gap-[10px]">
          <img className="w-[30px] h-[30px]" src={avatarUrl} />
          <div className="flex flex-col">
            <span className="uppercase">{campaignName}</span>
            <span className="text-[10px]">{isOpen ? t('viewLess') : t('viewMore')}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] whitespace-nowrap">{timeLeft}</span>
          <span className="text-[10px] whitespace-nowrap">
            {totalCompleted} {t('completed')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CampaignInsightLabel;
