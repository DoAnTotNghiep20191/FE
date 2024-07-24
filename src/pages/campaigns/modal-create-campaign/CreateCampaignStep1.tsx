import { Form } from 'antd';
import { FormInstance } from 'antd/lib';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import DateField from 'src/components/DateField';
import InputField from 'src/components/Inputs';
import SelectField from 'src/components/Select';
import { DATE_TIME_FORMAT_AM, datePickerPlaceHolder } from 'src/constants';
import { C1037, C1038, C1117, C1124, MSG } from 'src/constants/errorCode';
import { CampaignItemRes, ECampaignStatus } from 'src/store/slices/campaign/types';
import './styles/createCampaignStep1.scss';
interface ICreateEventStep1 {
  form: FormInstance;
  dataEdit?: CampaignItemRes;
  onSubmit: (values: any) => void;
  nextStep: (values: any) => void;
  listEvent: any;
}
const hourArray = Array(24)
  .fill(1)
  .map((_, index) => index);
const minutesArray = Array(60)
  .fill(1)
  .map((_, index) => index);

const disabledHours = (current: Dayjs) => {
  const now = dayjs();
  if (current.isSame(now, 'day')) {
    return hourArray.filter((hour) => hour < now.hour());
  }
  return [];
};

const disabledMinutes = (current: Dayjs) => {
  const now = dayjs();
  if (current.isSame(now, 'day') && current.hour() === now.hour()) {
    return minutesArray.filter((minute) => minute < now.minute());
  }
  return [];
};

const disabledEndHours = (current: Dayjs, startDate: Dayjs) => {
  const startHour = startDate.hour();
  const isSameDay = startDate.isSame(current, 'day');
  const disabledHoursArray = disabledHours(current);

  return isSameDay
    ? disabledHoursArray.concat(hourArray.filter((hour) => hour < startHour))
    : disabledHoursArray;
};

const disabledEndMinutes = (current: Dayjs, startDate: Dayjs) => {
  const startMinute = startDate.minute();
  const isSameDay = startDate.isSame(current, 'day');
  const isSameHour = current.hour() === startDate.hour();
  const disabledMinutesArray = disabledMinutes(current);

  return isSameDay && isSameHour
    ? disabledMinutesArray.concat(minutesArray.filter((minute) => minute < startMinute))
    : disabledMinutesArray;
};

const CreateCampaignStep1: React.FC<ICreateEventStep1> = (props) => {
  const { form, onSubmit, dataEdit, nextStep, listEvent } = props;
  const { t } = useTranslation('campaigns');
  const { t: commonTrans } = useTranslation('translations');
  const startDate: dayjs.Dayjs = Form?.useWatch('startDate', form);
  const endDate = Form?.useWatch('endDate', form);

  const eventOption = useMemo(() => {
    return listEvent?.map((item: any) => ({ label: item.name, value: item.id }));
  }, [listEvent]);

  const handleFinish = (val: any) => {
    const action = val.actionType;
    delete val.actionType;
    if (action === 'addChallenge') {
      nextStep(val);
    } else {
      onSubmit({
        ...val,
        status: ECampaignStatus.DRAFT,
      });
    }
  };
  const filteredList = dataEdit?.eventIds?.map((item: any) =>
    eventOption.find((x: any) => Number(x.value) === Number(item?.value || item)),
  );

  useEffect(() => {
    if (dataEdit) {
      form.setFieldsValue({
        name: dataEdit?.name || null,
        startDate: dataEdit?.startDate ? dayjs(dataEdit?.startDate) : null,
        endDate: dataEdit?.startDate ? dayjs(dataEdit?.endDate) : null,
        eventIds: filteredList || null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataEdit, eventOption]);

  return (
    <div className="step1-container">
      <Form form={form} autoComplete="off" onFinish={handleFinish} className="step1-content">
        <div className="mb-[25px]">
          <Form.Item
            key="name"
            name="name"
            rules={[
              { required: true, message: commonTrans(MSG[C1117]) },
              { min: 2, max: 50, message: commonTrans(MSG[C1124]) },
            ]}
            className="w-[275px] mt-[20px]"
          >
            <InputField
              inputType="type2"
              widthFull
              placeholder={t('campaignNamePlaceholder')}
              label={t('campaignName')}
            />
          </Form.Item>
        </div>
        <div className="mb-[25px]">
          <Form.Item
            key="startDate"
            name="startDate"
            rules={[
              {
                type: 'object' as const,
                required: true,
                message: commonTrans(MSG[C1037]),
              },
            ]}
            className="w-[275px]"
          >
            <DateField
              widthFull
              label={t('campaignStartDate')}
              format={DATE_TIME_FORMAT_AM}
              placeholder={datePickerPlaceHolder}
              showTime
              allowClear={false}
              disabledDate={(current) => {
                return endDate
                  ? current < dayjs().startOf('day') || current > dayjs(endDate)
                  : current < dayjs().startOf('day');
              }}
              disabledTime={(current) => {
                if (!current) return {};

                const disabledHoursArray = disabledHours(current);
                const disabledMinutesArray = disabledMinutes(current);

                if (endDate) {
                  const endHour = endDate.hour();
                  const endMinute = endDate.minute();
                  const isSameDay = endDate.isSame(current, 'day');
                  if (isSameDay) {
                    return {
                      disabledHours: () =>
                        disabledHoursArray.concat(hourArray.filter((hour) => hour > endHour)),
                      disabledMinutes: (selectedHour) =>
                        selectedHour === endHour
                          ? disabledMinutesArray.concat(
                              minutesArray.filter((minute) => minute > endMinute),
                            )
                          : disabledMinutesArray,
                    };
                  }
                }

                return {
                  disabledHours: () => disabledHoursArray,
                  disabledMinutes: () => disabledMinutesArray,
                };
              }}
              use12Hours={false}
            />
          </Form.Item>
        </div>
        <div className="mb-[25px]">
          <Form.Item
            key="endDate"
            name="endDate"
            rules={[
              {
                type: 'object' as const,
                required: true,
                message: commonTrans(MSG[C1038]),
              },
            ]}
            className="w-[275px]"
          >
            <DateField
              widthFull
              label={t('campaignEndDate')}
              format={DATE_TIME_FORMAT_AM}
              placeholder={datePickerPlaceHolder}
              showTime
              allowClear={false}
              disabledDate={(current) => {
                return startDate
                  ? current < dayjs(startDate).startOf('day')
                  : current < dayjs().startOf('day');
              }}
              disabledTime={(current) => {
                if (!startDate || !current) {
                  return {};
                }

                return {
                  disabledHours: () => disabledEndHours(current, startDate),
                  disabledMinutes: () => disabledEndMinutes(current, startDate),
                };
              }}
              use12Hours={false}
            />
          </Form.Item>
        </div>
        <div className="mb-[25px]">
          <Form.Item key="eventIds" name="eventIds" className="w-[275px] custom-height-auto">
            <SelectField
              mode="multiple"
              widthFull
              label={t('linkToExistingEvent')}
              className="link-campaign-event-select"
              placeholder={t('selectAnEvent')}
              info={t('selectEventInfo')}
              overlayClassName="create-campaign-tooltip"
              options={eventOption}
              optional={true}
              filterOption={(input, option) =>
                (option?.label && typeof option.label === 'string'
                  ? option.label.toLowerCase()
                  : ''
                ).includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </div>
        <Form.Item name="actionType" hidden>
          <InputField />
        </Form.Item>
        <ButtonContained
          className="btn-continue !w-[212px]"
          buttonType="type1"
          onClick={() => {
            form.setFieldsValue({ actionType: 'addChallenge' });
            form.submit();
            // onSubmit(null);
          }}
        >
          {t('addChallenge')}
        </ButtonContained>
        <ButtonContained
          className="!w-[212px] mt-2"
          buttonType="type2"
          onClick={() => {
            form.setFieldsValue({ actionType: 'saveAndContinue' });
            form.submit();
          }}
        >
          {t('saveAndContinue')}
        </ButtonContained>
      </Form>
    </div>
  );
};

export default CreateCampaignStep1;
