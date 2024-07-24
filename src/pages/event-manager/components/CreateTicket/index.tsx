import { Divider, Form } from 'antd';
import { useMemo } from 'react';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import InputField from 'src/components/Inputs';
import InputFieldNumber from 'src/components/Inputs/InputNumber';
import InputTextArea from 'src/components/InputTextArea';
import SelectField from 'src/components/Select';
import { ToastMessage } from 'src/components/Toast';
import { CURRENCY, CURRENCY_KEY, regexFloatNumber } from 'src/constants';
import {
  C1058,
  C1059,
  C1060,
  C1061,
  C1062,
  C1064,
  C1067,
  C1068,
  C1090,
  MSG,
  S40047,
  S40055,
  S40057,
  S40060,
} from 'src/constants/errorCode';
import {
  useCreateTicketMutation,
  useDeleteTicketMutation,
  useUpdateTicketMutation,
} from 'src/store/slices/app/api';
import { TicketOptionResponse } from 'src/store/slices/app/types';
import './styles.scss';
import { acceptInputNumber } from 'src/helpers';
import { useTranslation } from 'react-i18next';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';

interface ICreateTicket {
  id: number;
  dataEdit?: TicketOptionResponse | null;
  onClose: () => void;
  onUnDelete?: () => void;
}

const CreateTicket = ({ id, dataEdit, onClose, onUnDelete }: ICreateTicket) => {
  const [createTicket, { isLoading }] = useCreateTicketMutation();
  const [updateTicket, { isLoading: isLoadingUpdate }] = useUpdateTicketMutation();
  const [deleteTicket, { isLoading: isLoadingDelete }] = useDeleteTicketMutation();

  const [form] = Form.useForm();

  const { rudderAnalytics } = useRudderStack();

  const { t } = useTranslation();

  const currency = Form.useWatch('currency', form);

  const iconCurrency = useMemo(() => {
    return currency === CURRENCY_KEY.USD ? CURRENCY.USD : CURRENCY.KRW;
  }, [currency]);

  const handleClose = () => {
    form.resetFields();
    onClose && onClose();
  };

  const handleCreateTicket = async (values: any) => {
    try {
      if (dataEdit) {
        const param = {
          ...values,
          id: dataEdit?.id,
          price: values?.price ? values?.price.toString() : '0',
          maxBuyPerUser: 1,
          maxCapacityAmount: Number(values?.maxCapacityAmount),
        };
        await updateTicket(param).unwrap();
        rudderAnalytics?.track(ERudderStackEvents.TicketOptionUpdated, {
          eventType: ERudderStackEvents.TicketOptionUpdated,
          data: param,
        });
        ToastMessage.success(t(MSG[C1058]));
      } else {
        const param = {
          ...values,
          id: id,
          price: values?.price ? values?.price.toString() : '0',
          maxBuyPerUser: 1,
          maxCapacityAmount: Number(values?.maxCapacityAmount),
        };
        await createTicket(param).unwrap();
        rudderAnalytics?.track(ERudderStackEvents.TicketOptionCreated, {
          eventType: ERudderStackEvents.TicketOptionCreated,
          data: param,
        });
        ToastMessage.success(t(MSG[C1059]));
      }
      handleClose();
    } catch (err: any) {
      console.error(err);
      const validator_errors = err?.data?.validator_errors;
      const minPrice = err?.data?.data?.minPrice;
      const maxPrice = err?.data?.data?.maxPrice;
      if (validator_errors === S40047) {
        return form.setFields([
          {
            name: 'name',
            errors: [t(MSG[validator_errors])],
          },
        ]);
      }
      if (validator_errors === S40055) {
        return form.setFields([
          {
            name: 'price',
            errors: [t('message.S40055', { currency: iconCurrency, price: minPrice })],
          },
        ]);
      }
      if (validator_errors === S40060) {
        return form.setFields([
          {
            name: 'price',
            errors: [t('message.S40060', { currency: iconCurrency, price: maxPrice })],
          },
        ]);
      }
      ToastMessage.error(t(MSG[validator_errors]));
    }
  };

  const handleDeleteTicket = async () => {
    try {
      await deleteTicket({ id: dataEdit?.id! }).unwrap();
      ToastMessage.success(t(MSG[C1060]));
      rudderAnalytics?.track(ERudderStackEvents.TicketOptionDeleted, {
        eventType: ERudderStackEvents.TicketOptionDeleted,
        data: {
          ticketId: dataEdit?.id!,
        },
      });
      handleClose();
    } catch (err: any) {
      console.error(err);
      const validator_errors = err?.data?.validator_errors;
      if (validator_errors === S40057) {
        onUnDelete && onUnDelete();
      }
    }
  };

  const handleKeydownPrice = (e: any) => {
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight'
    ) {
      return;
    }
    if (!regexFloatNumber.test(e.key)) {
      e.preventDefault();
    }

    if (e.key === '.' && e.target.value.includes('.')) {
      e.preventDefault();
    }

    const dotIndex = e.target.value.indexOf('.');
    if (
      dotIndex !== -1 &&
      e.target.selectionStart > dotIndex &&
      e.target.value.length - dotIndex > 2
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className="ticket-content pb-[20px] relative">
      {/* {isMobile && (
        <BackIcon
          className="absolute top-2 left-0 z-10"
          onClick={handleClose}
        />
      )} */}
      <p className="ticket-content-title text-[24px] md:text-[32px] mt-0">
        {dataEdit ? t('ticket.editTicket') : t('ticket.ticketManagement')}
      </p>
      <p className="ticket-content-des text-center">
        {dataEdit ? t('ticket.editAndReviewYour') : t('ticket.createDifferentTicket')}
      </p>
      <Form
        form={form}
        autoComplete="off"
        className="flex items-center flex-col w-full md:w-auto"
        onFinish={handleCreateTicket}
        initialValues={{
          name: dataEdit?.name || '',
          maxCapacityAmount: dataEdit?.maxCapacityAmount || '',
          price: dataEdit?.price || '',
          currency: dataEdit?.currency || CURRENCY_KEY.USD,
          description: dataEdit?.description || '',
        }}
      >
        <Form.Item
          key="name"
          name="name"
          rules={[
            { required: true, message: t(MSG[C1061]) },
            { min: 2, message: t(MSG[C1062]) },
          ]}
          className="w-[275px] mt-[50px]"
        >
          <InputField
            inputType="type2"
            widthFull
            placeholder={t('ticket.ticketNamePlaceholder')}
            label={t('ticket.ticketName')}
            maxLength={50}
          />
        </Form.Item>
        <Form.Item
          key="maxCapacityAmount"
          name="maxCapacityAmount"
          rules={[
            () => ({
              validator(_, value) {
                if (value !== 0 && !value) {
                  return Promise.reject(t(MSG[C1090]));
                }
                if (value < 1) {
                  return Promise.reject(t(MSG[C1064]));
                }

                return Promise.resolve();
              },
            }),
          ]}
          className="w-[275px]"
        >
          <InputFieldNumber
            inputType="type2"
            widthFull
            placeholder={t('ticket.ticketCapacityPlaceholder')}
            label={t('ticket.ticketCapacity')}
            type="number"
            min={0}
            maxLength={10}
            onKeyDown={acceptInputNumber}
            formatter={(value) => (value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
          />
        </Form.Item>
        <Form.Item
          key="price"
          name="price"
          className="w-[275px]"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                const currency = getFieldValue('currency');
                // if (value !== 0 && !value) {
                //   return Promise.reject(t(MSG[C1066]));
                // }
                if (!!value && value > 0 && value < 5 && currency === CURRENCY_KEY.USD) {
                  return Promise.reject(t('message.S40055', { currency: CURRENCY?.USD, price: 5 }));
                }
                if (!!value && value > 1000000 && currency === CURRENCY_KEY.USD) {
                  return Promise.reject(
                    t('message.C1091', { currency: CURRENCY?.USD, price: 1000000 }),
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <InputFieldNumber
            inputType="type2"
            widthFull
            placeholder={t('ticket.pricePlaceholder', { currency: iconCurrency })}
            label={t('ticket.price')}
            min={0}
            maxLength={14}
            optional
            info={t('ticket.priceInfo')}
            colorTooltip="#008AD8"
            formatter={(value) =>
              value ? `${iconCurrency} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
            }
            // parser={(value) =>
            //   value!.replace(iconCurrency === CURRENCY.USD ? REGEX_DOLLAR : REGEX_WON, '')
            // }
            onKeyDown={handleKeydownPrice}
          />
        </Form.Item>
        <Form.Item key="currency" name="currency" className="w-[275px]">
          <SelectField
            widthFull
            label={t('ticket.currency')}
            // suffixIcon={<DownOutlined className="suffix-icon" />}
            options={[
              {
                value: CURRENCY_KEY.USD,
                label: CURRENCY_KEY.USD,
              },
              {
                value: CURRENCY_KEY.KRW,
                label: CURRENCY_KEY.KRW,
              },
            ]}
          />
        </Form.Item>
        <Divider className="ticket-content-divider" />
        <Form.Item
          key="description"
          name="description"
          className="mx-auto description-input"
          rules={[
            { required: true, message: t(MSG[C1067]) },
            { min: 10, message: t(MSG[C1068]) },
          ]}
        >
          <InputTextArea
            label={t('ticket.ticketDescription')}
            placeholder={t('ticket.ticketDescriptionPlaceholder')}
            showCount
            rows={5}
            maxLength={500}
            widthFull
            inputClassName=" !w-[312px] !h-[170px]"
          />
        </Form.Item>
        <ButtonContained
          buttonType="type1"
          className="w-[212px] md:w-[212px] my-[10px]"
          onClick={() => {
            form.submit();
          }}
          loading={isLoading || isLoadingUpdate}
        >
          {dataEdit ? t('ticket.updateTicketOption') : t('ticket.createTicketOption')}
        </ButtonContained>
        {dataEdit && (
          <ButtonContained
            buttonType="type2"
            className="w-[212px] md:w-[212px] mt-[10px] !border-[#E53535] !text-[#E53535]"
            loading={isLoadingDelete}
            onClick={handleDeleteTicket}
          >
            {t('ticket.deleteTicket')}
          </ButtonContained>
        )}
      </Form>
    </div>
  );
};

export default CreateTicket;
