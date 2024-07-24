import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import InputTextArea from 'src/components/InputTextArea';
import { ToastMessage } from 'src/components/Toast';
import { MSG } from 'src/constants/errorCode';
import { useModalContext } from 'src/contexts/modal';
import { useOrganizerRevokeTicketMutation } from 'src/store/slices/app/api';

interface IRefundRequestProps {
  payload: any;
}

export const RevokeGift = ({ payload }: IRefundRequestProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const { setModalSelected } = useModalContext();
  const [revokeTicketMutation] = useOrganizerRevokeTicketMutation();

  const handleApproveMulti = async () => {
    try {
      const { data } = await revokeTicketMutation({
        collectionId: payload.collectionId,
        payload: { ...payload, reason: form.getFieldValue('reason') },
      }).unwrap();
      if (data) {
        return setModalSelected('GIFT_REVOKE_NOTICE');
      }
    } catch (err: any) {
      return ToastMessage.error(t(MSG[err?.data?.validator_errors || '']));
    }
  };
  return (
    <>
      <Form
        form={form}
        autoComplete="off"
        name="reason"
        className="flex flex-col items-center justify-center h-[calc(100vh-220px)] md:h-[600px] justify-between"
        onFinish={handleApproveMulti}
      >
        <Form.Item
          key="reason"
          name="reason"
          className="md:!w-[312px] md:h-[206px] !w-[312px] h-[206px]"
          rules={[
            {
              required: true,
              message: t('eventManagement.gifting.message.revokeRequire'),
            },
            {
              max: 1200,
              message: t('eventManagement.gifting.message.outOfLength'),
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
          onClick={() => form.submit()}
          className="md:w-[212px] w-[212px] refund-button__modified"
          buttonType="type1"
        >
          <span className="!text-base">{t('purchaseTIcket.refundMulti.buttonRefund')}</span>
        </ButtonContained>
      </Form>
    </>
  );
};
