import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import InputTextArea from 'src/components/InputTextArea';
import { ToastMessage } from 'src/components/Toast';
import { RefundType } from 'src/constants';
import { MSG } from 'src/constants/errorCode';
import { useModalContext } from 'src/contexts/modal';
import { IRefundRequest } from 'src/interfaces/refund.payload';
import { useFanRequestRefundMutation } from 'src/store/slices/app/api';
import '../styles.scss';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';
import { useState } from 'react';

interface IRefundRequestProps {
  payload: IRefundRequest;
}

export const RefundRequest = ({ payload }: IRefundRequestProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [refundRequestMutation] = useFanRequestRefundMutation();
  const { rudderAnalytics } = useRudderStack();
  const [loading, setLoading] = useState(false);

  const { setModalSelected } = useModalContext();

  const handleRefundRequest = async () => {
    try {
      setLoading(true);
      const { data } = await refundRequestMutation({
        payload: { ...payload, reasonOfFan: form.getFieldValue('reasonOfFan') },
      }).unwrap();
      if (data) {
        rudderAnalytics?.track(ERudderStackEvents.FanRequestedRefund, {
          eventType: ERudderStackEvents.FanRequestedRefund,
          data: {
            ...payload,
            reasonOfFan: form.getFieldValue('reasonOfFan'),
          },
        });
        setModalSelected(RefundType.REQUEST_SENT);
      }
    } catch (err: any) {
      ToastMessage.error(t(MSG[err?.data?.validator_errors || '']));
    }
    setLoading(false);
  };

  return (
    <>
      <Form
        form={form}
        autoComplete="off"
        name="reasonOfFan"
        className="flex flex-col items-center justify-between h-[100%] md:justify-center"
        onFinish={handleRefundRequest}
      >
        <Form.Item
          key="reasonOfFan"
          name="reasonOfFan"
          className="md:w-[321px] md:h-[206px] w-[321px] h-[206px]"
          rules={[
            {
              required: true,
              message: t('message.refund.required'),
            },
            {
              max: 1200,
              message: t('message.refund.outOfLength'),
            },
          ]}
        >
          <InputTextArea
            label={t('myTicket.refundRequest.reason')}
            placeholder={t('myTicket.refundRequest.reasonPlaceholder')}
            showCount
            rows={5}
            maxLength={1200}
            widthFull
            inputClassName="!w-[312px] !h-[170px]"
          />
        </Form.Item>
        <ButtonContained
          onClick={() => form.submit()}
          className="md:w-[212px] w-[212px] refund-button__modified !text-base md:mt-[196px]"
          buttonType="type1"
          loading={loading}
        >
          <span className="!text-base">{t('myTicket.refundRequest.buttonRequestRefund')}</span>
        </ButtonContained>
      </Form>
    </>
  );
};
