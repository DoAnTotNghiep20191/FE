import { LoadingOutlined } from '@ant-design/icons';
import { Divider, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import InputField from 'src/components/Inputs';
import { ToastMessage } from 'src/components/Toast';
import { CURRENCY } from 'src/constants';
import { C1003, C1004, MSG } from 'src/constants/errorCode';
import { disableSpace, getCurrency } from 'src/helpers';
import { formatCurrency } from 'src/helpers/formatNumber';
import { useAppSelector } from 'src/store';
import { getUserInfo } from 'src/store/selectors/user';
import { usePaymentEstimateMutation } from 'src/store/slices/app/api';
import { EstimatedBillResponse } from 'src/store/slices/app/types';
import { ITicketType } from '../../types';
import TicketPurchase from './TicketPurchase';
import './styles.scss';
import { useTranslation } from 'react-i18next';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';

interface ReviewTicketProps {
  purchaseTicket?: ITicketType;
  id: number;
  isLoading: boolean;
  onPurchaseTicket: (values: any) => void;
  onClose: () => void;
}

const ReviewTicket = (props: ReviewTicketProps) => {
  const { purchaseTicket, id, isLoading, onPurchaseTicket, onClose } = props;
  const userInfo = useAppSelector(getUserInfo);
  const [form] = useForm();
  const [estimated, setEstimated] = useState<EstimatedBillResponse>();
  const [estimatePayment, { isLoading: isLoadingEst }] = usePaymentEstimateMutation();
  const [isLoadingPromo, setIsLoadingPromo] = useState(false);
  const { t } = useTranslation();
  const { rudderAnalytics } = useRudderStack();

  const promoCode = Form?.useWatch('promoCode', form);

  const checkValidateField = (data: EstimatedBillResponse) => {
    if (data?.errorCode) {
      form.setFields([
        {
          name: 'promoCode',
          errors: [t([MSG[data?.errorCode]])],
        },
      ]);
      return;
    } else {
      form.setFields([
        {
          name: 'promoCode',
          errors: [],
        },
      ]);
    }
  };

  const getEstimatePayment = debounce(async (promoName?: string) => {
    try {
      const { data } = await estimatePayment({
        collectionId: +id,
        ticketOptions: [
          {
            id: Number(purchaseTicket?.id),
            amount: 1,
          },
        ],
        promoName: promoName || '',
      }).unwrap();
      if (promoName) {
        rudderAnalytics?.track(ERudderStackEvents.UserEnteredPromoCode, {
          eventType: ERudderStackEvents.UserEnteredPromoCode,
          data: {
            code: promoName,
            collectionId: +id,
            ticketOptions: {
              id: Number(purchaseTicket?.id),
              amount: 1,
            },
          },
        });
      }
      setEstimated(data);
      checkValidateField(data);
    } catch (err: any) {
      console.error(err);
      onClose && onClose();
      ToastMessage.error(t(MSG[err?.data?.validator_errors]));
    }
    setIsLoadingPromo(false);
  }, 800);

  const debounceEstimate = useCallback(debounce(getEstimatePayment, 1000), []);

  useEffect(() => {
    setIsLoadingPromo(true);
    debounceEstimate(promoCode);
  }, [promoCode]);

  const handleClickPurchase = async () => {
    const error = form.getFieldError('promoCode').concat(form.getFieldError('email'));

    if (error.length === 0) {
      const values = form.getFieldsValue(['email', 'promoCode']);
      onPurchaseTicket && onPurchaseTicket({ estimatedBill: estimated?.estimatedBill, ...values });
    }
  };

  return (
    <Form
      form={form}
      name="control-hooks"
      initialValues={{
        email: userInfo?.email || '',
      }}
    >
      <div className="review-ticket flex flex-col items-center justify-center mt-[20px]">
        <div>
          <p className="text-[24px] font-loos text-center">
            {t('purchaseTicket.reviewTicketPurchase')}
          </p>
          <p className="text-[14px] font-normal w-full md:w-[375px] text-center">
            {t('purchaseTicket.confirmPurchaseDetails')}
          </p>
        </div>
        <div className="pt-[40px] pb-[60px] w-[275px]">
          <Form.Item
            normalize={(value) => {
              return value?.toLocaleUpperCase();
            }}
            key="PromoCode"
            name="promoCode"
          >
            <InputField
              widthFull
              placeholder={t('purchaseTicket.promoCodePlaceholder')}
              label={t('purchaseTicket.promoCode')}
              inputType="type2"
              optional
              maxLength={50}
            />
          </Form.Item>
          {purchaseTicket && <TicketPurchase {...purchaseTicket} />}
          <Divider className="divider" />
          <div className="mb-[20px]">
            <p className="text-[16px] font-medium mb-[20px] uppercase">
              {t('purchaseTicket.summary')}
            </p>
            {estimated?.discountAmount &&
              Number(estimated?.discountAmount) > 0 &&
              !estimated?.errorCode && (
                <div className="flex items-center justify-between mb-[10px]">
                  <p className="text-[12px] font-medium">
                    {t('purchaseTicket.discount')} ({estimated?.discountPercentage}%)
                  </p>
                  <p className="text-[12px] font-medium">
                    {getCurrency(purchaseTicket?.currency || CURRENCY.USD)}
                    {formatCurrency(estimated?.discountAmount)}
                  </p>
                </div>
              )}
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-medium">{t('purchaseTicket.processingFee')} (5%)</p>
              <p className="text-[12px] font-medium">
                {getCurrency(purchaseTicket?.currency || CURRENCY.USD)}
                {formatCurrency(estimated?.feeAmount!)}
              </p>
            </div>
          </div>
          <div className="price-area">
            <p className="text-[12px] font-medium text-primary">
              {t('purchaseTicket.estimatedTotal')}
            </p>
            <div className="price-area-input mt-[4px]">
              <span className="">
                {isLoadingEst || !estimated?.estimatedBill ? (
                  <LoadingOutlined />
                ) : (
                  <p className="text-[16px] text-primary">
                    {getCurrency(purchaseTicket?.currency || CURRENCY.USD)}
                    {formatCurrency(estimated?.estimatedBill)}
                  </p>
                )}
              </span>
            </div>
          </div>

          <Divider className="divider" />
          <Form.Item
            key="email"
            name="email"
            rules={[
              { required: true, message: t(MSG[C1004]) },
              {
                type: 'email',
                message: t(MSG[C1003]),
              },
              disableSpace(form, 'email'),
            ]}
          >
            <InputField
              widthFull
              placeholder={t('purchaseTicket.billingEmailPlaceholder')}
              label={t('purchaseTicket.billingEmail')}
              inputType="type2"
              name="email"
            />
          </Form.Item>
        </div>

        <ButtonContained
          className="md:mb-[40px] w-[212px]"
          buttonType="type1"
          onClick={handleClickPurchase}
          loading={isLoading || isLoadingEst || isLoadingPromo}
        >
          {t('purchaseTicket.buttonPurchaseTicket')}
        </ButtonContained>
      </div>
    </Form>
  );
};

export default ReviewTicket;
