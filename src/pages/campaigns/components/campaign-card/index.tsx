import React, { useState } from 'react';
import { CampaignItemRes, ECampaignStatus } from 'src/store/slices/campaign/types';
import CreateCampaignModal from '../../modal-create-campaign';
import CampaignCardHeader from '../campaign-card-header';
import CardItem from '../card-item';
import './styles.scss';
import { Collapse } from 'antd';

interface CampaignCardProps {
  campaigns: CampaignItemRes;
  refetchListCampaign: () => void;
  defaultActive: boolean;
}

const CampaignCard: React.FC<CampaignCardProps> = (props) => {
  const { campaigns, refetchListCampaign, defaultActive } = props;
  const [showDetail, setShowDetail] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleCancel = () => {
    setIsEdit(false);
  };

  return (
    <>
      <Collapse
        className="campaign-insight campaign-card-item"
        collapsible={'header'}
        defaultActiveKey={defaultActive ? ['1'] : []}
        expandIcon={() => null}
        items={[
          {
            key: '1',
            label: (
              <CampaignCardHeader
                campaign={campaigns}
                setShowDetail={setShowDetail}
                showDetail={showDetail}
                setIsEdit={setIsEdit}
              />
            ),
            children: (
              <CardItem
                onAddChallenge={() => {
                  setIsEdit(true);
                  setCurrentStep(2);
                }}
                challenges={campaigns?.challenges}
                reward={campaigns?.reward}
                status={campaigns.status as ECampaignStatus}
              />
            ),
          },
        ]}
      />

      <CreateCampaignModal
        refetchListCampaign={refetchListCampaign}
        open={isEdit}
        dataEdit={campaigns}
        onCancel={handleCancel}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
      />
    </>
  );
};

export default CampaignCard;
