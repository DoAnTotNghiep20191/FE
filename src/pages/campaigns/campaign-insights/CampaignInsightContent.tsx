import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { ICampaignInsightRes } from 'src/store/slices/campaign/types';

interface ICampaignInsightContent {
  data: ICampaignInsightRes;
}

const CampaignInsightContent: React.FC<ICampaignInsightContent> = (props) => {
  const { data } = props;
  const { t } = useTranslation('campaigns');

  const totalParticipated =
    new BigNumber(data?.participantDoingCount).plus(data?.participantDoneCount).toNumber() || 0;

  const percentUserCompleted =
    new BigNumber(data?.participantDoneCount)
      .dividedBy(totalParticipated)
      .multipliedBy(100)
      .toNumber() || 0;

  return (
    <div className="flex flex-col gap-[5px]">
      <div className="border-[1px] border-solid border-[#008AD880] rounded-[3px] p-[10px] bg-[#008ad833] flex flex-col justify-between">
        <div>
          <p className="text-primary text-[12px]">
            <span className="text-[16px]">{totalParticipated}</span> {t('usersParticipated')}
          </p>
          <p className="text-primary text-[12px]">
            <span className="text-[16px]">
              {`${data?.participantDoneCount || 0}/${totalParticipated}`}{' '}
              {`(${percentUserCompleted}%)`}
            </span>{' '}
            {t('ofUsersCompletedCampaign')}
          </p>
        </div>
        <div className="flex justify-end">
          <span className="uppercase text-[14px] text-[#1C1C28]">{t('engagement')}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-[5px]">
        <div className="border-[1px] border-solid border-[#008AD880] rounded-[3px] p-[10px] bg-[#008ad833] flex flex-col justify-between">
          <div>
            <p className="text-primary text-[14px]">1. Seoul</p>
            <p className="text-primary text-[14px]">2. Seoul</p>
            <p className="text-primary text-[14px]">3. Seoul</p>
          </div>
          <div className="flex justify-end">
            <span className="uppercase text-[14px] text-[#1C1C28]">{t('location')}</span>
          </div>
        </div>
        <div className="border-[1px] border-solid border-[#008AD880] rounded-[3px] p-[10px] bg-[#008ad833] flex flex-col justify-between">
          <p className="text-primary text-[14px]">{`${data?.participantMinAge || 0}-${data?.participantMaxAge || 0}`}</p>
          <div className="flex justify-end">
            <span className="uppercase text-[14px] text-[#1C1C28]">{t('demographic')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignInsightContent;
