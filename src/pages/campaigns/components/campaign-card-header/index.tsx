import { Image } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DefaultCampaignImage } from 'src/assets/icons';
import { CampaignItemRes, ECampaignStatus } from 'src/store/slices/campaign/types';
import './styles.scss';
import { getTimeText } from '../../fan-view/components/campaigns/CampaignList/CardItem/CardHeader';

interface CampaignCardHeaderProps {
  setShowDetail: (showDetail: boolean) => void;
  showDetail: boolean;
  campaign: CampaignItemRes;
  setIsEdit?: any;
}

const CampaignCardHeader: React.FC<CampaignCardHeaderProps> = ({ campaign, setIsEdit }) => {
  const { t } = useTranslation('campaigns');

  return (
    <div className="campaign-card-header h-[100%] cursor-pointer">
      <div className="flex items-center text-white">
        <Image
          src={campaign?.image || DefaultCampaignImage}
          alt="CardEventImg"
          preview={false}
          className="!h-[29px] !w-[29px] !md:h-[23px] !md:w-[23px] object-cover mr-4"
        />
        <div>
          <span className="font-[400] text-[14px] uppercase">{campaign?.name}</span>
          {campaign.status === ECampaignStatus.DRAFT && (
            <p className="font-[400] text-[10px]" onClick={() => setIsEdit(true)}>
              {t('edit')}
            </p>
          )}
        </div>
      </div>
      <span className="font-[400] text-[10px] text-white">
        {getTimeText(campaign.startDate, campaign.endDate, t)}
      </span>
    </div>
  );
};

export default CampaignCardHeader;
