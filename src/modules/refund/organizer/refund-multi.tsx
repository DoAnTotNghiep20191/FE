import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import InputTextArea from 'src/components/InputTextArea';
import { ToastMessage } from 'src/components/Toast';
import { RefundType } from 'src/constants';
import { MSG } from 'src/constants/errorCode';
import { useModalContext } from 'src/contexts/modal';
import { useOrganizerApproveRequestMutation } from 'src/store/slices/app/api';
import { IRefundsApprove } from 'src/store/slices/app/types';
import '../styles.scss';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';
import { useState } from 'react';

interface IRefundRequestProps {
  payload: IRefundsApprove;
}

export const OrganizerRefundMulti = ({ payload }: IRefundRequestProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { rudderAnalytics } = useRudderStack();
  const [loading, setLoading] = useState(false);

  const { setModalSelected } = useModalContext();
  const [approveRefundMutation] = useOrganizerApproveRequestMutation();

  const handleApproveMulti = async () => {
    try {
      setLoading(true);
      const { data } = await approveRefundMutation({
        payload: { ...payload, refundReason: form.getFieldValue('refundReason') },
      }).unwrap();
      if (data) {
        rudderAnalytics?.track(ERudderStackEvents.OrganizerRequestedRefund, {
          eventType: ERudderStackEvents.OrganizerRequestedRefund,
          data: { ...payload, refundReason: form.getFieldValue('refundReason') },
        });
        setModalSelected(RefundType.REFUND_MULTI_SENT);
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
        name="refundReason"
        className="flex flex-col items-center md:justify-center h-[100%] justify-between"
        onFinish={handleApproveMulti}
      >
        <Form.Item
          key="refundReason"
          name="refundReason"
          className="md:!w-[312px] md:h-[206px]  !w-[312px] h-[206px]"
          rules={[
            {
              required: true,
              message: t('message.multipleRefund.required'),
            },
            {
              max: 1200,
              message: t('message.multipleRefund.outOfLength'),
            },
          ]}
        >
          <InputTextArea
            label={t('purchaseTicket.refundMulti.label')}
            placeholder={t('purchaseTicket.refundMulti.placeHolder')}
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
          className="md:w-[212px] w-[212px] md:mt-[196px] refund-button__modified"
          buttonType="type1"
        >
          <span className="!text-base">{t('purchaseTIcket.refundMulti.buttonRefund')}</span>
        </ButtonContained>
      </Form>
    </>
  );
};
