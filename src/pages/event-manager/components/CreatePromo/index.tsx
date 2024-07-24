import { Divider, Form, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { InfoCircleIcon } from 'src/assets/icons';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import InputField from 'src/components/Inputs';
import InputFieldNumber from 'src/components/Inputs/InputNumber';
import { ToastMessage } from 'src/components/Toast';
import {
  C1001,
  C1048,
  C1049,
  C1050,
  C1051,
  C1052,
  C1053,
  C1054,
  C1055,
  C1056,
  C1057,
  MSG,
  S40046,
} from 'src/constants/errorCode';
import {
  useCreatePromoCodeMutation,
  useDeletePromoCodeMutation,
  useUpdatePromoCodeMutation,
} from 'src/store/slices/app/api';
import {
  PromoCodeResponse,
  TicketOptionResponse,
  UpdatePromoPayload,
} from 'src/store/slices/app/types';
import './styles.scss';
import { acceptInputNumber } from 'src/helpers';
import { useTranslation } from 'react-i18next';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';

interface IModalCreatePromo {
  id: number;
  onClose: () => void;
  dataEdit?: PromoCodeResponse | null;
  options?: TicketOptionResponse[] | [];
}

const CreatePromo = ({ id, dataEdit, options, onClose }: IModalCreatePromo) => {
  const [optionId, setOptionId] = useState<number[]>([]);
  const [errorOption, setErrorOption] = useState(false);
  const [applyPromo, setApplyPromo] = useState(false);
  const { rudderAnalytics } = useRudderStack();

  const [createPromo] = useCreatePromoCodeMutation();
  const [deletePromo] = useDeletePromoCodeMutation();
  const [updatePromo] = useUpdatePromoCodeMutation();

  const { t } = useTranslation();

  const [form] = Form.useForm();

  useEffect(() => {
    if (dataEdit) {
      setApplyPromo(dataEdit?.applyStatus === 'on');
    }
  }, [dataEdit]);

  const handleClose = () => {
    form.resetFields();
    setOptionId([]);
    onClose && onClose();
  };

  const handleSwitch = (id: number) => {
    if (optionId.includes(id)) {
      const newOption = optionId.filter((e) => e !== id);
      setOptionId(newOption);
      if (newOption?.length === 0) {
        setErrorOption(true);
      }
    } else {
      setOptionId([...optionId, id]);
      setErrorOption(false);
    }
  };

  const handleSavePromo = async () => {
    try {
      if (optionId?.length === 0) {
        setErrorOption(true);
      }
      const values = await form.validateFields(['name', 'discountAmount', 'capacity']);
      if (optionId?.length === 0) return;

      const param = {
        name: values?.name,
        discountAmount: values?.discountAmount.toString(),
        id,
        capacity: values?.capacity.toString(),
        ticketOptionIds: [...optionId],
      };
      await createPromo(param).unwrap();
      ToastMessage.success(t(MSG[C1048]));
      rudderAnalytics?.track(ERudderStackEvents.PromoCodeCreated, {
        eventType: ERudderStackEvents.PromoCodeCreated,
        data: param,
      });
      handleClose();
    } catch (err: any) {
      console.error(err);
      const validator_errors = err?.data?.validator_errors;
      if (validator_errors === S40046) {
        return form.setFields([
          {
            name: 'name',
            errors: [t(MSG[validator_errors])],
          },
        ]);
      }
      if (validator_errors) {
        ToastMessage.error(t(MSG[validator_errors]));
      }
    }
  };

  const handleUpdatePromo = async () => {
    try {
      const values = await form.validateFields(['name', 'discountAmount', 'capacity']);
      const param: UpdatePromoPayload = {
        name: values?.name,
        discountAmount: Number(values?.discountAmount),
        id: dataEdit?.id!,
        capacity: values?.capacity.toString(),
        // ticketOptionId: 1,
        applyStatus: applyPromo ? 'on' : 'off',
      };
      await updatePromo(param).unwrap();
      rudderAnalytics?.track(ERudderStackEvents.PromoCodeUpdated, {
        eventType: ERudderStackEvents.PromoCodeUpdated,
        data: param as any,
      });
      ToastMessage.success(t(MSG[C1049]));
      handleClose();
    } catch (err: any) {
      console.error(err);
      const validator_errors = err?.data?.validator_errors;
      ToastMessage.error(t(MSG[validator_errors || C1001]));
    }
  };

  const handleDeletePromo = async () => {
    try {
      await deletePromo({ id: +dataEdit?.id! }).unwrap();
      rudderAnalytics?.track(ERudderStackEvents.PromoCodeDeleted, {
        eventType: ERudderStackEvents.PromoCodeDeleted,
        data: { id: dataEdit?.id },
      });
      ToastMessage.success(t(MSG[C1050]));
      handleClose();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="ticket-content mt-0">
      <p className="ticket-content-title text-[24px] md:text-[32px]">
        {!dataEdit ? t('promoCode.promoCode') : t('promoCode.editPromoCode')}
      </p>
      <p className="ticket-content-des text-center">
        {!dataEdit ? t('promoCode.addAPromo') : t('promoCode.editAndReviewPromo')}
      </p>
      <Form
        form={form}
        autoComplete="off"
        className="flex items-center flex-col"
        initialValues={{
          name: dataEdit?.name || '',
          capacity: dataEdit?.capacity || '',
          discountAmount: dataEdit?.discountAmount || '',
        }}
      >
        <Form.Item
          normalize={(value) => {
            return value?.toLocaleUpperCase();
          }}
          key="name"
          name="name"
          rules={[
            { required: true, message: t(MSG[C1051]) },
            { min: 2, message: t(MSG[C1052]) },
          ]}
          className="w-[275px] mt-[50px]"
        >
          <InputField
            inputType="type2"
            colorTooltip="#008AD8"
            widthFull
            placeholder={t('promoCode.promoCodeNamePlaceholder')}
            label={t('promoCode.promoCodeName')}
            maxLength={50}
            info={t('promoCode.whatAttendeesEnterDuring')}
          />
        </Form.Item>
        <Form.Item
          key="capacity"
          name="capacity"
          rules={[
            () => ({
              validator(_, value) {
                if (!value && value !== 0) {
                  return Promise.reject(t(MSG[C1053]));
                }
                if (value < 1) {
                  return Promise.reject(t(MSG[C1054]));
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
            placeholder={t('promoCode.promoCodeCapacityPlaceholder')}
            label={t('promoCode.promoCodeCapacity')}
            maxLength={10}
            colorTooltip="#008AD8"
            // type="number"
            info={t('promoCode.theNumberOfTickets')}
            onKeyDown={acceptInputNumber}
            formatter={(value) => (value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
          />
        </Form.Item>
        <Form.Item
          key="discountAmount"
          name="discountAmount"
          rules={[
            () => ({
              validator(_, value) {
                if (value !== 0 && !value) {
                  return Promise.reject(t(MSG[C1055]));
                }
                if (value <= 0 || value > 100) {
                  return Promise.reject(t(MSG[C1056]));
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
            colorTooltip="#008AD8"
            placeholder={t('discountAmountPlaceholder')}
            label={t('promoCode.discountAmount')}
            formatter={(value) => (value ? `${value}%`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
            // parser={(value) => value!.replace('%', '')}
            info={t('promoCode.chooseASetAmount')}
            onKeyDown={acceptInputNumber}
            type="number"
          />
        </Form.Item>
        <Divider className="ticket-content-divider" />
        <div className="w-[275px] mb-2">
          <div className="flex  gap-1 items-center">
            <p className="text-[#121313] text-[12px] font-medium">{t('promoCode.applyCodeTo')}</p>
            <Tooltip
              placement="top"
              color="#008AD8"
              title={t('promoCode.selectAllApplicable')}
              arrow={{ pointAtCenter: true }}
            >
              <InfoCircleIcon />
            </Tooltip>
          </div>

          {dataEdit ? (
            <>
              <div
                onClick={() => setApplyPromo(!applyPromo)}
                className="flex gap-4 mt-3"
                key={dataEdit?.id}
              >
                <div
                  className={`${' border-[#00456C] bg-[#80C5EC]'} py-[15px] border border-solid flex-1 rounded-[10px] px-[15px] cursor-pointer`}
                >
                  <p className={`${'text-[#00456C]'}  font-normal text-base`}>
                    {dataEdit?.applyTo}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {Array(options) &&
                options?.map((item: any) => {
                  return (
                    <div
                      onClick={() => handleSwitch(item?.id)}
                      className="flex gap-4 mt-3"
                      key={item?.id}
                    >
                      <div
                        className={`${
                          optionId.includes(item?.id)
                            ? ' border-[#00456C] bg-[#80C5EC]'
                            : 'border-[#008AD8] bg-[#FFF]'
                        } py-[15px] border border-solid flex-1 rounded-[10px] px-[15px] cursor-pointer`}
                      >
                        <p
                          className={`${
                            optionId.includes(item?.id) ? 'text-[#00456C]' : 'text-[#008AD8]'
                          }  font-normal text-base`}
                        >
                          {item?.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              {errorOption && <p className="mt-2 text-error">{t(MSG[C1057])}</p>}
            </>
          )}
        </div>
        {dataEdit ? (
          <div className="my-[20px] flex justify-center items-center flex-col">
            <ButtonContained
              buttonType="type1"
              className="w-[212px] md:w-[212px]"
              onClick={handleUpdatePromo}
            >
              {t('promoCode.updatePromoCode')}
            </ButtonContained>
            <ButtonContained
              buttonType="type2"
              className="w-[212px] md:w-[212px] mt-[10px] !border-[#E53535] !text-[#E53535]"
              onClick={handleDeletePromo}
            >
              {t('promoCode.deletePromo')}
            </ButtonContained>
          </div>
        ) : (
          <ButtonContained
            buttonType="type1"
            className="w-[212px] md:w-[212px] my-[20px]"
            onClick={handleSavePromo}
          >
            {t('promoCode.savePromoCode')}
          </ButtonContained>
        )}
      </Form>
    </div>
  );
};

export default CreatePromo;
