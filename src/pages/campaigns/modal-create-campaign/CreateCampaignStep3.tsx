import { Form, FormInstance } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import InputTextArea from 'src/components/InputTextArea';
import InputFieldNumber from 'src/components/Inputs/InputNumber';
import SelectField from 'src/components/Select';
import { C1055, C1056, C1109, MSG } from 'src/constants/errorCode';
import { acceptInputNumber } from 'src/helpers';
import { ECampaignStatus, ERewardRarity, ERewardType } from 'src/store/slices/campaign/types';
import './styles/createCampaignStep3.scss';

interface ICreateCampaignStep3Props {
  form: FormInstance;
  dataEdit?: any;
  onSubmit: (values: any) => void;
}
const CreateCampaignStep3: React.FC<ICreateCampaignStep3Props> = (props) => {
  const { form, onSubmit } = props;
  const rewardType = Form?.useWatch('type', form);

  const { t } = useTranslation('campaigns');
  const { t: commonTrans } = useTranslation('translations');

  const numberUserEligible = [1, 5, 10, 20, 30, 50];
  const optionsUserEligible = numberUserEligible.map((item) => ({
    value: item,
    label: item,
  }));

  const optionsRewardType = [
    {
      label: t('discountedTicket'),
      value: ERewardType.DISCOUNTED_TICKET,
    },
    {
      label: t('redeemableItemAtEvent'),
      value: ERewardType.REDEEMABLE_ITEM,
    },
  ];

  const optionsRewardRarity = [
    {
      label: t('common'),
      value: ERewardRarity.COMMON,
    },
    {
      label: t('rare'),
      value: ERewardRarity.RARE,
    },
    {
      label: t('epic'),
      value: ERewardRarity.EPIC,
    },
  ];

  const handleFinish = (val: any) => {
    console.log('val', val);
    onSubmit({
      ...val,
      status: ECampaignStatus.PUBLIC,
    });
  };

  // const showSocialURLForm = (type: string) => {
  //   if (!type) return;
  //   switch (type) {
  //     case EChallengeType.PUBLIC_POST_WITH_HASHTAG:
  //     case EChallengeType.PUBLIC_VIDEO_WITH_HASHTAG:
  //       return 1;
  //     case EChallengeType.PURCHASE_TICKET:
  //       return 2;
  //     default:
  //       return 3;
  //   }
  // };
  return (
    <div className="step3-container">
      <Form form={form} className="step3-content" onFinish={handleFinish} autoComplete="off">
        <div className="mb-[25px]">
          <Form.Item
            className="w-[275px]"
            name="usersEligibleCount"
            rules={[{ required: true, message: t('validation.redeemableItemRequired') }]}
          >
            <SelectField
              widthFull
              label={t('numberOfUsersEligible')}
              placeholder={t('selectANumber')}
              options={optionsUserEligible}
              info={t('numberUsersEligibleInfo')}
              overlayClassName="create-campaign-tooltip"
            />
          </Form.Item>
        </div>

        <div className="mb-[25px]">
          <Form.Item
            className="w-[275px]"
            name="rarity"
            rules={[{ required: true, message: t('validation.rewardRarity') }]}
          >
            <SelectField
              widthFull
              label={t('rewardRarity')}
              placeholder={t('selectARewardRarity')}
              options={optionsRewardRarity}
              info={t('rewardRarityInfo')}
              overlayClassName="create-campaign-tooltip"
            />
          </Form.Item>
        </div>

        <div className="mb-[25px]">
          <Form.Item
            className="w-[275px]"
            name="type"
            rules={[{ required: true, message: t('validation.rewardType') }]}
          >
            <SelectField
              widthFull
              label={t('rewardType')}
              placeholder={t('selectAReward')}
              options={optionsRewardType}
              showSearch
            />
          </Form.Item>
        </div>

        {rewardType === ERewardType.DISCOUNTED_TICKET && (
          <div className="mb-[25px]">
            <Form.Item
              className="w-[275px]"
              name="discountAmount"
              rules={[
                () => ({
                  validator(_, value) {
                    if (value !== 0 && !value) {
                      return Promise.reject(commonTrans(MSG[C1055]));
                    }
                    if (value <= 0 || value > 100) {
                      return Promise.reject(commonTrans(MSG[C1056]));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <InputFieldNumber
                inputType="type2"
                widthFull
                colorTooltip="#008AD8"
                placeholder={t('discountAmountPlaceholder')}
                label={t('discountAmount')}
                info={t('discountAmountInfo')}
                formatter={(value) =>
                  value ? `${value}%`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                }
                // parser={(value) => value!.replace('%', '')}
                onKeyDown={acceptInputNumber}
                type="number"
              />
            </Form.Item>
          </div>
        )}

        {rewardType === ERewardType.REDEEMABLE_ITEM && (
          <div className="mb-[25px]">
            <Form.Item
              key="redeemable"
              name="redeemable"
              className="w-[275px]"
              rules={[
                { required: true, message: t('validation.redeemableItemRequired') },
                { max: 1200, message: commonTrans(MSG[C1109]) },
              ]}
            >
              <InputTextArea
                label={t('redeemableItem')}
                placeholder={t('redeemableItemPH')}
                info={t('redeemableItemInfo')}
                showCount
                widthFull
                rows={5}
                maxLength={1200}
              />
            </Form.Item>
          </div>
        )}
        <ButtonContained
          className="btn-continue"
          buttonType="type1"
          onClick={() => {
            form.submit();
          }}
        >
          {t('publishCampaign')}
        </ButtonContained>
      </Form>
    </div>
  );
};

export default CreateCampaignStep3;
