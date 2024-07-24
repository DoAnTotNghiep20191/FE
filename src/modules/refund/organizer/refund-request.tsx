import { Form } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import InputTextArea from 'src/components/InputTextArea';
import { ToastMessage } from 'src/components/Toast';
import { RefundType } from 'src/constants';
import { MSG } from 'src/constants/errorCode';
import { useModalContext } from 'src/contexts/modal';
import { IRefundsApprove } from 'src/interfaces/refund.payload';
import { useOrganizerApproveRequestMutation } from 'src/store/slices/app/api';
import '../styles.scss';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';
interface IRefundRequestProps {
  payload: IRefundsApprove;
}

export const OrganizerRefundRequest = ({ payload }: IRefundRequestProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [approveRefundMutation] = useOrganizerApproveRequestMutation();
  const { setModalSelected } = useModalContext();
  const { rudderAnalytics } = useRudderStack();
  const [loading, setLoading] = useState(false);

  const handleApproveRefund = async () => {
    const { ticketId, ...params } = payload as any;
    try {
      setLoading(true);
      const { data } = await approveRefundMutation({
        payload: {
          ...params,
          ticketIds: [ticketId],
          refundReason: form.getFieldValue('refundReason'),
        },
      }).unwrap();
      if (data) {
        rudderAnalytics?.track(ERudderStackEvents.OrganizerApprovedRefund, {
          eventType: ERudderStackEvents.OrganizerApprovedRefund,
          data: {
            ...params,
            ticketIds: [ticketId],
            refundReason: form.getFieldValue('refundReason'),
          },
        });
        setModalSelected(RefundType.REFUND_SENT);
      }
    } catch (err: any) {
      ToastMessage.error(t(MSG[err?.data?.validator_errors || '']));
    }
    setLoading(false);
  };

  const handleRejectRefund = () => {
    setModalSelected(RefundType.REJECT_REFUND);
  };

  useEffect(() => {
    form.setFieldValue('refundReason', payload?.refundReason);
  }, []);

  return (
    <>
      <Form
        form={form}
        autoComplete="off"
        name="refundReason"
        className="flex flex-col items-center md:justify-center h-[100%] justify-between"
        onFinish={handleApproveRefund}
      >
        <Form.Item
          key="refundReason"
          name="refundReason"
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
            label={t('purchaseTicket.refundRequest.reason')}
            placeholder={t('myTicket.refundRequest.reasonPlaceholder')}
            showCount
            rows={5}
            maxLength={1200}
            widthFull
            disabled
            inputClassName="!w-[312px] !h-[170px]"
          />
        </Form.Item>
        <div className="flex flex-col items-center">
          <ButtonContained
            loading={loading}
            onClick={() => form.submit()}
            className="md:w-[212px] w-[212px] !text-base md:mt-[146px] refund-button__modified"
            buttonType="type1"
          >
            <span className="!text-base">{t('purchaseTicket.refundRequest.approved')}</span>
          </ButtonContained>
          <ButtonContained
            onClick={handleRejectRefund}
            className="md:w-[212px] w-[212px] !text-base mt-2 refund-button__modified"
            buttonType="type2"
          >
            <span className="!text-base">{t('purchaseTicket.refundRequest.reject')}</span>
          </ButtonContained>
        </div>
      </Form>
    </>
  );
};
