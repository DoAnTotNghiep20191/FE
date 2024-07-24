import { Divider, Form } from 'antd';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import InputField from 'src/components/Inputs';
import SelectField from 'src/components/Select';
import { ToastMessage } from 'src/components/Toast';
import { C1003, C1004, MSG } from 'src/constants/errorCode';
import { PATTERN_NOT_SPACE } from 'src/constants/regex';
import { useModalContext } from 'src/contexts/modal';
import { useOrganizerGiftInviteMutation } from 'src/store/slices/app/api';
import './styles.scss';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';

interface IGiftingTicketProps {
  tickets?: {
    ticketId: number;
    name: string;
  }[];
  collectionId: number;
}

export const GiftingTicket = ({ tickets, collectionId }: IGiftingTicketProps) => {
  const [form] = Form.useForm();
  const [orgGiftInviteMutation] = useOrganizerGiftInviteMutation();
  const [loading, setLoading] = useState(false);
  const { setModalSelected, setPayload } = useModalContext();
  const { rudderAnalytics } = useRudderStack();
  const { t } = useTranslation();
  const handleSubmit = async (payload: any) => {
    const data = payload.data.filter((item: { email: string; ticketOptionId: number }) => {
      return item.email && item.ticketOptionId;
    });
    if (!data.length) {
      setPayload && setPayload({});
      return setModalSelected('');
    }
    try {
      setLoading(true);
      const { data: response } = await orgGiftInviteMutation({
        payload: {
          data,
        },
        collectionId,
      }).unwrap();
      if (response) {
        rudderAnalytics?.track(ERudderStackEvents.GiftCreated, {
          eventType: ERudderStackEvents.GiftCreated,
          data: {
            emailReceiver: data.email,
            ticketOptionId: data.ticketOptionId,
            collectionId,
          },
        });
        setModalSelected('GIFT_SENT');
      }
    } catch (err: any) {
      ToastMessage.error(t(MSG[err?.data?.validator_errors || '']));
    }
    setLoading(false);
  };
  const itemRef = useRef<HTMLDivElement | null>(null);

  const handleAddForm = async (cb: CallableFunction) => {
    await cb();
    itemRef.current && itemRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Form
      name="dynamic_form_nest_item gifting-ticket overflow-auto overflow-y"
      onFinish={handleSubmit}
      autoComplete="off"
      initialValues={{ data: [{ email: '', ticketOptionId: undefined }] }}
      form={form}
      className="w-full flex flex-col justify-between h-[calc(100vh-200px)] md:h-auto"
    >
      <Form.List name="data">
        {(fields, { add }) => (
          <>
            <div className="pr-[10px] scroll-customize overflow-y-auto scroll-smooth md:max-h-[250px]">
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} ref={itemRef} className="max-w-[275px] m-auto w-[275px] ">
                  <Form.Item
                    {...restField}
                    name={[name, 'email']}
                    // validateTrigger={['onChange', 'onBlur']}
                    key={key}
                    rules={[
                      // { required: true, message: t(MSG[C1004]) },
                      {
                        type: 'email',
                        message: t(MSG[C1003]),
                      },
                      ({ setFieldValue, getFieldsValue, getFieldValue }) => ({
                        validator(_, value) {
                          const dataIndex = getFieldsValue(['data', name, 'email']).data.findIndex(
                            (item: any) => {
                              if (item) {
                                return item.email === value;
                              }
                            },
                          );

                          const emails = getFieldsValue(['data', name, 'email']).data.filter(
                            (item: any) => {
                              if (item) {
                                return item.email === value;
                              }
                            },
                          );
                          if (dataIndex === 0 && !emails[0]?.email && !emails[0]?.ticketOptionId) {
                            return Promise.reject(t(MSG[C1004]));
                          }

                          const role = getFieldValue(['data', name, 'ticketOptionId']);

                          if (emails.length > 1) {
                            return Promise.reject(
                              new Error(t('eventManagement.gifting.giftingTicket.message.already')),
                            );
                          }
                          if (role && !value) {
                            return Promise.reject(t(MSG[C1004]));
                          }
                          if (!PATTERN_NOT_SPACE.test(value)) {
                            setFieldValue(['data', name, 'email'], value.replace(/\s/g, ''));
                          }

                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <InputField
                      widthFull
                      placeholder={t('team.emailPlaceholder')}
                      label={t('team.email')}
                      inputType="type1"
                      name="email"
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'ticketOptionId']}
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const email = getFieldValue(['data', name, 'email']);
                          if (email && !value) {
                            return Promise.reject(
                              t('eventManagement.gifting.message.ticketRequired'),
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <SelectField
                      widthFull
                      label={t('eventManagement.gifting.giftingTicket.select.label')}
                      filterOption={(input: string, option: any) =>
                        option?.label?.toLocaleLowerCase()?.includes(input?.toLocaleLowerCase())
                      }
                      placeholder={t('eventManagement.gifting.giftingTicket.select.default')}
                      options={tickets?.map((ticket) => ({
                        value: ticket.ticketId,
                        label: ticket.name,
                      }))}
                    />
                  </Form.Item>
                  <Divider className="divider" />
                </div>
              ))}
            </div>
            <Form.Item className="w-[272px] md:w-auto max-w-[212px] m-auto mt-5">
              <ButtonContained
                className="mb-[30px] md:mb-[0] border-none shadow-lg md:w-[212px] w-[212px] !text-base mt-2 refund-button__modified"
                fullWidth
                buttonType="type2"
                onClick={() => handleAddForm(add)}
              >
                <span>{t('eventManagement.gifting.giftingTicket.button.add')}</span>
              </ButtonContained>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item className="w-[272px] !text-[16px] md:w-auto max-w-[212px] mx-auto md:mt-20">
        <ButtonContained
          className="md:w-[212px] w-[212px] !text-base mt-2 refund-button__modified"
          fullWidth
          onClick={() => form.submit()}
          loading={loading}
        >
          <span>{t('eventManagement.gifting.giftingTicket.button.send')}</span>
        </ButtonContained>
      </Form.Item>
    </Form>
  );
};
