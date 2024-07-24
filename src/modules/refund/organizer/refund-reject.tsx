import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import InputTextArea from 'src/components/InputTextArea';
import { ToastMessage } from 'src/components/Toast';
import { RefundType } from 'src/constants';
import { MSG } from 'src/constants/errorCode';
import { useModalContext } from 'src/contexts/modal';
import { useOrganizerRejectRefundMutation } from 'src/store/slices/app/api';
import { IRefundReject } from 'src/store/slices/app/types';
import '../styles.scss';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';
import { useState } from 'react';

interface IRefundRequestProps {
  payload: IRefundReject;
}

export const OrganizerRefundReject = ({ payload }: IRefundRequestProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [rejectRefundMutation] = useOrganizerRejectRefundMutation();
  const { setModalSelected } = useModalContext();
  const { rudderAnalytics } = useRudderStack();
  const [loading, setLoading] = useState(false);

  const handleRejectRefund = async () => {
    try {
      setLoading(true);
      const { data } = await rejectRefundMutation({
        payload: { ...payload, reasonOfOrganizer: form.getFieldValue('reasonOfOrganizer') },
      }).unwrap();
      if (data) {
        rudderAnalytics?.track(ERudderStackEvents.OrganizerDeniedRefund, {
          eventType: ERudderStackEvents.OrganizerDeniedRefund,
          data: { ...payload, reasonOfOrganizer: form.getFieldValue('reasonOfOrganizer') },
        });
        setModalSelected(RefundType.REJECT_SENT);
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
        name="reasonOfOrganizer"
        className="flex flex-col items-center justify-center"
        onFinish={handleRejectRefund}
      >
        <Form.Item
          key="reasonOfOrganizer"
          name="reasonOfOrganizer"
          className="md:w-[321px] md:h-[206px] w-[321px] h-[206px]"
          rules={[
            {
              required: true,
              message: t('message.reject.required'),
            },
            {
              max: 1200,
              message: t('message.reject.outOfLength'),
            },
          ]}
        >
          <InputTextArea
            label={t('purchaseTicket.refundRejected.label')}
            placeholder={t('purchaseTicket.refundRejected.placeHolder')}
            showCount
            rows={5}
            maxLength={1200}
            widthFull
            inputClassName="!w-[312px] !h-[170px]"
          />
        </Form.Item>
        <ButtonContained
          loading={loading}
          onClick={() => form.submit()}
          className="md:w-[212px] w-[212px] mt-[196px] refund-button__modified"
          buttonType="type1"
        >
          <span className="!text-base">{t('purchaseTicket.refundRejected.buttonReject')}</span>
        </ButtonContained>
      </Form>
    </>
  );
};
