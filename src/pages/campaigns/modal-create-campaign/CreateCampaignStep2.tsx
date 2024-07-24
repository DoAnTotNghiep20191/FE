import { Divider, Form, FormInstance } from 'antd';
import { isEmpty } from 'lodash';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import ButtonOutLined from 'src/components/Buttons/ButtonOutLined';
import InputField from 'src/components/Inputs';
import SelectField from 'src/components/Select';
import {
  C1042,
  C1118,
  C1119,
  C1120,
  C1121,
  C1125,
  C1126,
  C1127,
  MSG,
} from 'src/constants/errorCode';
import {
  CampaignItemRes,
  ECampaignStatus,
  EChallengeDifficulty,
  EChallengeType,
  ESocialNetworkingLoginMethod,
  EventCampaignRes,
} from 'src/store/slices/campaign/types';
import './styles/createCampaignStep2.scss';

interface ICreateCampaignStep2 {
  form: FormInstance;
  dataEdit?: CampaignItemRes;
  onSubmit: (values: any) => void;
  addReward: (values: any) => void;
  listEvent: EventCampaignRes[] | undefined;
}

const socialOptionsMap: Record<EChallengeType, ESocialNetworkingLoginMethod[]> = {
  [EChallengeType.ARTIST_TOP_10]: [ESocialNetworkingLoginMethod.SPOTIFY],
  [EChallengeType.ARTIST_TOP_1]: [ESocialNetworkingLoginMethod.SPOTIFY],
  [EChallengeType.FOLLOW_ARTIST]: [ESocialNetworkingLoginMethod.SPOTIFY],
  [EChallengeType.LISTEN_SONG]: [ESocialNetworkingLoginMethod.SPOTIFY],
  [EChallengeType.FAVORITE_SONG]: [ESocialNetworkingLoginMethod.SPOTIFY],
  [EChallengeType.PUBLIC_POST_WITH_HASHTAG]: [
    ESocialNetworkingLoginMethod.X,
    ESocialNetworkingLoginMethod.INSTAGRAM,
    ESocialNetworkingLoginMethod.TIKTOK,
    ESocialNetworkingLoginMethod.FACEBOOK,
  ],
  [EChallengeType.COMMENT_POST]: [
    ESocialNetworkingLoginMethod.X,
    ESocialNetworkingLoginMethod.INSTAGRAM,
    ESocialNetworkingLoginMethod.TIKTOK,
    ESocialNetworkingLoginMethod.FACEBOOK,
    ESocialNetworkingLoginMethod.YOU_TUBE,
  ],
  [EChallengeType.FOLLOW_USER]: [
    ESocialNetworkingLoginMethod.X,
    ESocialNetworkingLoginMethod.INSTAGRAM,
    ESocialNetworkingLoginMethod.TIKTOK,
    ESocialNetworkingLoginMethod.FACEBOOK,
  ],
  [EChallengeType.LIKE]: [
    ESocialNetworkingLoginMethod.X,
    ESocialNetworkingLoginMethod.INSTAGRAM,
    ESocialNetworkingLoginMethod.TIKTOK,
    ESocialNetworkingLoginMethod.FACEBOOK,
    ESocialNetworkingLoginMethod.YOU_TUBE,
  ],
  [EChallengeType.REPOST]: [ESocialNetworkingLoginMethod.X, ESocialNetworkingLoginMethod.TIKTOK],
  [EChallengeType.SHARE]: [
    ESocialNetworkingLoginMethod.INSTAGRAM,
    ESocialNetworkingLoginMethod.TIKTOK,
    ESocialNetworkingLoginMethod.FACEBOOK,
    ESocialNetworkingLoginMethod.YOU_TUBE,
  ],
  [EChallengeType.PUBLIC_VIDEO_WITH_HASHTAG]: [ESocialNetworkingLoginMethod.YOU_TUBE],
  [EChallengeType.WATCH_VIDEO]: [ESocialNetworkingLoginMethod.YOU_TUBE],
  [EChallengeType.SUBSCRIBE]: [ESocialNetworkingLoginMethod.YOU_TUBE],
  [EChallengeType.CHECK_IN_LOCATION]: [ESocialNetworkingLoginMethod.FACEBOOK],
  [EChallengeType.PURCHASE_TICKET]: [],
  [EChallengeType.PURCHASE_MERCHANDISE]: [ESocialNetworkingLoginMethod.SHOPIFY],
};

const getSocialOptions = (type: EChallengeType): ESocialNetworkingLoginMethod[] => {
  return socialOptionsMap[type] || [];
};

const CreateCampaignStep2: React.FC<ICreateCampaignStep2> = ({
  form,
  dataEdit,
  onSubmit,
  addReward,
  listEvent,
}) => {
  const { t } = useTranslation('campaigns');
  const { t: commonTrans } = useTranslation('translations');
  const [ticketOptions, setTicketOptions] = useState<{ label: string; value: number }[]>([]);
  const challengeFormRef = useRef<HTMLDivElement>(null);

  const optionsTypeOfChallenge = Object.keys(EChallengeType).map((key) => ({
    value: EChallengeType[key as keyof typeof EChallengeType],
    label: t(`${key}`),
  }));

  const optionsChallengeDifficulty = Object.keys(EChallengeDifficulty).map((key) => ({
    value: EChallengeDifficulty[key as keyof typeof EChallengeDifficulty],
    label: t(`${key}`),
  }));

  const eventOption = listEvent?.map((item: EventCampaignRes) => ({
    label: item.name,
    value: item.id,
    ticketOptions: item.ticketOptions.map((ticket) => ({
      label: ticket.name,
      value: ticket.id,
    })),
  }));

  const showSocialForm = (type: string) => !!type && type !== EChallengeType.PURCHASE_TICKET;
  const showSocialURLForm = (type: string) => {
    if (!type) return;
    switch (type) {
      case EChallengeType.PUBLIC_POST_WITH_HASHTAG:
      case EChallengeType.PUBLIC_VIDEO_WITH_HASHTAG:
        return 1;
      case EChallengeType.PURCHASE_TICKET:
        return 2;
      default:
        return 3;
    }
  };

  const onChangeSocialTag = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    const value = e.currentTarget.value;
    if (e.key === ' ' || e.keyCode === 32) {
      e.preventDefault();
      return;
    }
    form.setFieldValue(['challenges', index, 'hashTag'], value[0] !== '#' ? '#' + value : value);
  };

  const handleFinish = (val: any) => {
    const action = val.actionType;
    delete val.actionType;
    if (action === 'publishCampaign') {
      onSubmit({ ...val, status: ECampaignStatus.PUBLIC });
    } else {
      addReward(val);
    }
  };

  const handleEventChange = (eventId: string) => {
    const selectedEvent = listEvent?.find((event) => Number(event.id) === Number(eventId));
    setTicketOptions(
      selectedEvent
        ? selectedEvent.ticketOptions.map((ticket) => ({
            label: ticket.name,
            value: ticket.id,
          }))
        : [],
    );
  };

  return (
    <div className="step2-container">
      <Form
        form={form}
        name="create-event-step2"
        autoComplete="off"
        onFinish={handleFinish}
        scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
        className="step2-content"
        onValuesChange={(changedValues) => {
          if (changedValues.challenges.length === 1) {
            changedValues.challenges.forEach((change: any, index: number) => {
              if (change.type) {
                form.setFields([
                  { name: ['challenges', index, 'socialPlatform'], value: undefined, errors: [] },
                  { name: ['challenges', index, 'socialUrl'], value: undefined, errors: [] },
                  { name: ['challenges', index, 'hashTag'], value: undefined, errors: [] },
                  { name: ['challenges', index, 'eventUrl'], value: undefined, errors: [] },
                ]);
              }
            });
          }
        }}
        initialValues={{
          challenges: !isEmpty(dataEdit?.challenges)
            ? dataEdit?.challenges.map((item: any) => ({
                difficulty: item.difficulty || EChallengeDifficulty.EASY,
                type: item.type || null,
                socialPlatform: item.socialPlatform || null,
              }))
            : [
                {
                  difficulty: EChallengeDifficulty.EASY,
                  type: null,
                },
              ],
        }}
      >
        <Form.List name="challenges">
          {(fields, { add }) => {
            return (
              <>
                <div className="challenge-form max-h-[445px] overflow-auto px-2">
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key} className="m-auto">
                      <div className="mb-[25px]">
                        <Form.Item
                          {...restField}
                          className="w-[275px] mb-[25px]"
                          name={[name, 'difficulty']}
                          rules={[{ required: true, message: commonTrans(MSG[C1125]) }]}
                        >
                          <SelectField
                            widthFull
                            label={t('challengeDifficulty')}
                            options={optionsChallengeDifficulty}
                          />
                        </Form.Item>
                      </div>

                      <div className="mb-[25px]">
                        <Form.Item
                          {...restField}
                          className="w-[275px] mb-[25px]"
                          name={[name, 'type']}
                          rules={[{ required: true, message: commonTrans(MSG[C1118]) }]}
                        >
                          <SelectField
                            widthFull
                            showSearch
                            filterOption={(input, option) =>
                              (option?.label && typeof option.label === 'string'
                                ? option.label.toLowerCase()
                                : ''
                              ).includes(input.toLowerCase())
                            }
                            label={t('typeOfChallenge')}
                            placeholder={t('selectChallenge')}
                            options={optionsTypeOfChallenge}
                          />
                        </Form.Item>
                      </div>

                      <Form.Item
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.challenges?.[name]?.type !== curValues.challenges?.[name]?.type
                        }
                        noStyle
                      >
                        {({ getFieldValue }) => {
                          const type = getFieldValue(['challenges', name, 'type']);
                          const socialOptions = getSocialOptions(type).map((key) => ({
                            value: key,
                            label: t(key),
                          }));

                          return (
                            showSocialForm(type) && (
                              <div className="mb-[25px]">
                                <Form.Item
                                  {...restField}
                                  className="w-[275px] mb-[25px]"
                                  name={[name, 'socialPlatform']}
                                  rules={[{ required: true, message: commonTrans(MSG[C1119]) }]}
                                >
                                  <SelectField
                                    widthFull
                                    info={t('socialInfo')}
                                    label={t('social')}
                                    placeholder={t('selectSocial')}
                                    options={socialOptions}
                                  />
                                </Form.Item>
                              </div>
                            )
                          );
                        }}
                      </Form.Item>

                      <Form.Item
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.challenges?.[name]?.type !== curValues.challenges?.[name]?.type
                        }
                        noStyle
                      >
                        {({ getFieldValue }) => {
                          const socialURLFormType = showSocialURLForm(
                            getFieldValue(['challenges', name, 'type']),
                          );
                          return (
                            <>
                              {socialURLFormType === 1 && (
                                <div className="mb-[25px]">
                                  <Form.Item
                                    {...restField}
                                    className="w-[275px] mb-[25px]"
                                    name={[name, 'hashTag']}
                                    rules={[{ required: true, message: commonTrans(MSG[C1120]) }]}
                                  >
                                    <InputField
                                      inputType="type2"
                                      widthFull
                                      label={t('Hashtag')}
                                      placeholder={t('egHashtag')}
                                      info={t('hashtagInfo')}
                                      onKeyDown={(event) => onChangeSocialTag(event, index)}
                                    />
                                  </Form.Item>
                                </div>
                              )}
                              {socialURLFormType === 2 && (
                                <>
                                  <div className="mb-[25px]">
                                    <Form.Item
                                      name={[name, 'eventId']}
                                      className="w-[275px]"
                                      rules={[{ required: true, message: commonTrans(MSG[C1126]) }]}
                                    >
                                      <SelectField
                                        widthFull
                                        label={t('event')}
                                        placeholder={t('selectAnEvent')}
                                        info={t('findAnEvent')}
                                        options={eventOption}
                                        onChange={handleEventChange}
                                      />
                                    </Form.Item>
                                  </div>

                                  <div className="mb-[25px]">
                                    <Form.Item
                                      name={[name, 'ticketOptionId']}
                                      className="w-[275px]"
                                      rules={[{ required: true, message: commonTrans(MSG[C1127]) }]}
                                    >
                                      <SelectField
                                        widthFull
                                        label={t('ticketType')}
                                        placeholder={t('selectATicketType')}
                                        options={ticketOptions}
                                      />
                                    </Form.Item>
                                  </div>
                                </>
                              )}
                              {socialURLFormType === 3 && (
                                <div className="mb-[25px]">
                                  <Form.Item
                                    name={[name, 'socialUrl']}
                                    rules={[
                                      { required: true, message: commonTrans(MSG[C1121]) },
                                      {
                                        type: 'url',
                                        message: commonTrans(MSG[C1042]),
                                      },
                                    ]}
                                    className="w-[275px] mt-[20px]"
                                  >
                                    <InputField
                                      inputType="type2"
                                      widthFull
                                      label={t('socialURL')}
                                      placeholder={t('egSocialURL')}
                                      info={t('socialURLInfo')}
                                    />
                                  </Form.Item>
                                </div>
                              )}
                            </>
                          );
                        }}
                      </Form.Item>
                      {index < fields.length - 1 && <Divider className="step2-content-divider" />}
                    </div>
                  ))}
                  <div ref={challengeFormRef} />
                </div>

                <Form.Item className="w-[272px] md:w-auto max-w-[212px] m-auto">
                  <ButtonOutLined
                    buttonType="type2"
                    onClick={() => {
                      add({ difficulty: EChallengeDifficulty.EASY });
                      setTimeout(() => {
                        challengeFormRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }, 0);
                    }}
                  >
                    {t('addMoreChallenges')}
                  </ButtonOutLined>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
        <Form.Item name="actionType" hidden>
          <InputField />
        </Form.Item>
        <ButtonContained
          className="step2-content-btn !w-[212px]"
          buttonType="type1"
          onClick={() => {
            form.setFieldsValue({ actionType: 'addRewards' });
            form.submit();
          }}
        >
          {t('addRewards')}
        </ButtonContained>
        <ButtonContained
          className="step2-content-btn2 !w-[212px]"
          buttonType="type2"
          onClick={() => {
            form.setFieldsValue({ actionType: 'publishCampaign' });
            form.submit();
          }}
        >
          {t('publishCampaign')}
        </ButtonContained>
      </Form>
    </div>
  );
};

export default CreateCampaignStep2;
