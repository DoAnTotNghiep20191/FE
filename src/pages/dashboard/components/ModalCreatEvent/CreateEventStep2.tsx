import { Divider, Form, FormInstance } from 'antd';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import InputTextArea from 'src/components/InputTextArea';

import './styles/createEventStep2.scss';
import { useTranslation } from 'react-i18next';
import { C1040, C1041, MSG } from 'src/constants/errorCode';

interface ICreateEventStep2 {
  form: FormInstance;
  dataEdit?: any;
  onSubmit: (values: any) => void;
}

const CreateEventStep2 = ({ form, dataEdit, onSubmit }: ICreateEventStep2) => {
  const { t } = useTranslation();

  return (
    <div className="step2-container">
      <Form
        form={form}
        name="create-event-step2"
        autoComplete="off"
        onFinish={onSubmit}
        className="step2-content"
        initialValues={{
          policy: dataEdit?.policy || '',
          description: dataEdit?.description || '',
        }}
      >
        <Form.Item
          key="policy"
          name="policy"
          className="limit-explain-error w-full md:!w-[312px]"
          rules={
            [
              //  { required: true, message: t(MSG[C1040]) },
              //  { min: 50, max: 1200, message: t(MSG[C1041]) },
            ]
          }
        >
          <InputTextArea
            label={t('createEvent.noticePolicy')}
            placeholder={t('createEvent.noticePolicyPlaceholder')}
            showCount
            rows={5}
            maxLength={1200}
            widthFull
            inputClassName="h-[170px]"
          />
        </Form.Item>
        <Divider className="step2-content-divider" />
        <Form.Item
          key="description"
          name="description"
          rules={[
            { required: true, message: t(MSG[C1040]) },
            { min: 50, max: 1200, message: t(MSG[C1041]) },
          ]}
          className="w-full md:!w-[312px] create-event-description"
        >
          <InputTextArea
            label={t('createEvent.eventDescription')}
            placeholder={t('createEvent.eventDescriptionPlaceholder')}
            showCount
            maxLength={1200}
            widthFull
            rows={5}
            inputClassName="h-[170px]"
          />
        </Form.Item>
        <ButtonContained
          className="step2-content-btn !w-[212px]"
          buttonType="type1"
          onClick={() => {
            form.submit();
          }}
        >
          {t('createEvent.buttonContinue')}
        </ButtonContained>
      </Form>
    </div>
  );
};

export default CreateEventStep2;
