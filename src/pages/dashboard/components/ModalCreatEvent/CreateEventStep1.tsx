import { Divider, Form, FormInstance } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import DateField from 'src/components/DateField';
import InputPickLocation from 'src/components/InputPickLocation';
import InputField from 'src/components/Inputs';
import SwitchField from 'src/components/Switch';
import UploadImage from 'src/components/UploadImage';
import { DATE_TIME_FORMAT_AM, datePickerPlaceHolder, passwordPlaceholder } from 'src/constants';
import {
  C1032,
  C1033,
  C1034,
  C1035,
  C1036,
  C1037,
  C1038,
  C1039,
  MSG,
} from 'src/constants/errorCode';
import { disableSpace } from 'src/helpers';
import './styles/createEventStep1.scss';

interface ICreateEventStep1 {
  form: FormInstance;
  isPrivate: boolean;
  isShowPrivate: boolean;
  dataEdit?: any;
  onSwitchPrivate: (e: boolean) => void;
  onSwitchShowEvent: (e: boolean) => void;
  onSubmit: (values: any) => void;
}

const hourArray = Array(24)
  .fill(1)
  .map((_, index) => index);
const minutesArray = Array(60)
  .fill(1)
  .map((_, index) => index);

const CreateEventStep1 = ({
  form,
  isPrivate,
  isShowPrivate,
  dataEdit,
  onSwitchPrivate,
  onSwitchShowEvent,
  onSubmit,
}: ICreateEventStep1) => {
  const { t } = useTranslation();
  const endTime = Form?.useWatch('endTime', form);
  const startTime: dayjs.Dayjs = Form?.useWatch('startTime', form);
  const location = Form?.useWatch('location', form);
  const [latitude, setLatitude] = useState(dataEdit?.latitude || '');
  const [longitude, setLongitude] = useState(dataEdit?.longitude || '');

  const handleFinish = (val: any) => {
    if (!form.getFieldValue('location')) {
      form.setFields([{ name: 'location', errors: [t(MSG[C1033])] }]);
      return;
    }
    onSubmit({
      ...val,
      latitude,
      longitude,
    });
  };

  return (
    <div className="step1-container">
      <Form
        form={form}
        // autoComplete="off"
        onFinish={handleFinish}
        className="step1-content"
        initialValues={{
          image: dataEdit?.image || '',
          name: dataEdit?.name || '',
          startTime: dataEdit?.startTime ? dayjs.unix(dataEdit?.startTime) : '',
          endTime: dataEdit?.startTime ? dayjs.unix(dataEdit?.endTime) : '',
          location: dataEdit?.location || '',
          password: dataEdit?.passwordEvent,
        }}
      >
        <Form.Item
          key="image"
          name="image"
          rules={[{ required: true, message: t(MSG[C1034]) }]}
          className="w-[321px] !md:w-[312px] h-[171px] !md-h[171px]"
        >
          <UploadImage
            withOutDefaultImage
            width={312}
            height={171}
            className="border h-full rounded-[10px] border-[##C7C9D9]"
            defaultValue={dataEdit ? dataEdit?.image : form.getFieldValue('image') || ''}
            onImageSelect={(src: string) => {
              if (!!src && typeof src === 'string') form.setFieldValue('image', src);
            }}
            form={form}
          />
        </Form.Item>

        <div className="mb-[25px]">
          <Form.Item
            key="name"
            name="name"
            rules={[
              { required: true, message: t(MSG[C1035]) },
              { min: 2, max: 50, message: t(MSG[C1036]) },
            ]}
            className="w-[275px] mt-[20px]"
          >
            <InputField
              inputType="type2"
              widthFull
              placeholder={t('createEvent.eventNamePlaceholder')}
              label={t('createEvent.eventName')}
              maxLength={50}
            />
          </Form.Item>
        </div>
        <div className="mb-[25px]">
          <Form.Item
            key="location"
            name="location"
            className="w-[275px]"
            rules={[
              () => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject(new Error(t(MSG[C1032])));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputPickLocation
              defaultValue={
                form.getFieldValue('location')
                  ? form.getFieldValue('location')
                  : dataEdit?.location || ''
              }
              onSelectLocation={(address: string, latitude?: string, longitude?: string) => {
                form.setFieldValue('location', address);
                setLongitude(longitude);
                setLatitude(latitude);
                form.validateFields(['location']);
              }}
              latitude={latitude}
              longitude={longitude}
              locationSelected={location}
              inputType="type2"
              widthFull
              placeholder={t('createEvent.eventLocationPlaceholder')}
              label={t('createEvent.eventLocation')}
              allowToManualInput={false}
              enableCustomAddress={true}
            />
          </Form.Item>
        </div>
        <div className="mb-[25px]">
          <Form.Item
            key="startTime"
            name="startTime"
            rules={[
              {
                type: 'object' as const,
                required: true,
                message: t(MSG[C1037]),
              },
            ]}
            className="w-[275px]"
          >
            <DateField
              widthFull
              label={t('createEvent.eventStart')}
              format={DATE_TIME_FORMAT_AM}
              placeholder={datePickerPlaceHolder}
              showTime
              allowClear={false}
              disabledDate={(current: any) => {
                return endTime
                  ? current < dayjs().startOf('day') || current > dayjs(endTime)
                  : current < dayjs().startOf('day');
              }}
              disabledTime={(current) => {
                if (!endTime) {
                  return {};
                }
                const endHour = endTime.hour();
                const endMinute = endTime.minute();
                const isSameDay = endTime.isSame(current, 'day');
                return {
                  disabledHours: () =>
                    isSameDay ? hourArray.filter((item) => item > endHour) : [],
                  disabledMinutes: (hours) => {
                    const isSameHour = hours === endHour;

                    if (isSameHour && isSameDay) {
                      return minutesArray.filter((item) => item > endMinute);
                    }

                    return [];
                  },
                };
              }}
              use12Hours={false}
            />
          </Form.Item>
        </div>
        <div>
          <Form.Item
            key="endTime"
            name="endTime"
            rules={[
              {
                type: 'object' as const,
                required: true,
                message: t(MSG[C1038]),
              },
            ]}
            className="w-[275px]"
          >
            <DateField
              widthFull
              label={t('createEvent.eventEnd')}
              format={DATE_TIME_FORMAT_AM}
              placeholder={datePickerPlaceHolder}
              allowClear={false}
              disabledDate={(current) => {
                return startTime
                  ? current < dayjs(startTime).startOf('day')
                  : current < dayjs().startOf('day');
              }}
              disabledTime={(current) => {
                if (!startTime) {
                  return {};
                }

                const startHour = startTime.hour();
                const startMinute = startTime.minute();
                const isSameDay = startTime.isSame(current, 'day');
                return {
                  disabledHours: () =>
                    isSameDay ? hourArray.filter((item) => item < startHour) : [],
                  disabledMinutes: (hours) => {
                    const isSameHour = hours === startHour;

                    if (isSameHour && isSameDay) {
                      return minutesArray.filter((item) => item < startMinute);
                    }

                    return [];
                  },
                };
              }}
              showTime
              use12Hours={false}
            />
          </Form.Item>
        </div>

        <Divider className="step1-content-divider" />
        <div className="space-y-[12px]">
          <SwitchField
            onChange={(e) => {
              onSwitchPrivate(e);
            }}
            checked={isPrivate}
          >
            <p className="switch">
              {t('createEvent.thisIsA')}{' '}
              <p>{isPrivate ? t('createEvent.privateEvent') : t('createEvent.publicEvent')} </p>
            </p>
          </SwitchField>
          {isPrivate && (
            <SwitchField
              onChange={(e) => {
                onSwitchShowEvent(e);
              }}
              checked={isShowPrivate}
            >
              <p>{isShowPrivate ? t('createEvent.discoverEvent') : t('createEvent.hideEvent')} </p>
            </SwitchField>
          )}
        </div>
        {isPrivate && (
          <Form.Item
            key="password"
            name="password"
            rules={[{ required: true, message: t(MSG[C1039]) }, disableSpace(form, 'password')]}
          >
            <InputField
              widthFull
              placeholder={passwordPlaceholder}
              label={t('createEvent.eventPassword')}
              // type="password"
              inputType="type2"
              className="input-password"
            />
          </Form.Item>
        )}
        <ButtonContained className="btn-continue !w-[212px]" buttonType="type1" htmlType="submit">
          {t('createEvent.buttonContinue')}
        </ButtonContained>
      </Form>
    </div>
  );
};

export default CreateEventStep1;
