import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import InputTextArea from 'src/components/InputTextArea';
import InputField from 'src/components/Inputs';
import { ToastMessage } from 'src/components/Toast';
import {
  C1003,
  C1004,
  C1104,
  C1105,
  C1106,
  C1107,
  C1108,
  C1109,
  C1110,
  C1111,
  MSG,
} from 'src/constants/errorCode';
import { useContactUsMutation } from 'src/store/slices/user/api';
import { ContactUsPayload } from 'src/store/slices/user/types';

const ContactUs = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [sendMessage] = useContactUsMutation();

  const handleSubmitContact = async (data: ContactUsPayload) => {
    try {
      await sendMessage(data).unwrap();
      ToastMessage.success(t(MSG[C1110]));
      form.resetFields();
    } catch (error) {
      ToastMessage.error(t(MSG[C1111]));
    }
  };

  return (
    <div className="mt-12 px-5">
      <p className="text-2xl text-center font-loos">{t('contactUs.title')}</p>
      <p className="text-[14px] w-full md:w-[448px] mt-2 text-center mx-auto">
        {t('contactUs.needToGetInTouch')}
      </p>
      <div className="w-full md:w-[275px] px-3 rounded-[30px] mt-10 mb-2 mx-auto">
        <Form form={form} autoComplete="off" name="update-infor" onFinish={handleSubmitContact}>
          <Form.Item
            key="fullName"
            name="fullName"
            className="form-input"
            rules={[
              { required: true, message: t(MSG[C1104]) },
              { min: 2, message: t(MSG[C1105]) },
              { max: 50, message: t(MSG[C1105]) },
            ]}
          >
            <InputField
              inputType="type1"
              widthFull
              placeholder="Eg. John Smith"
              label={t('contactUs.fullName')}
              // maxLength={70}
            />
          </Form.Item>
          <Form.Item
            key="email"
            name="email"
            rules={[
              { required: true, message: t(MSG[C1004]) },
              { type: 'email', message: t(MSG[C1003]) },
            ]}
          >
            <InputField
              widthFull
              placeholder="Eg. johnsmith@sample.com"
              label={t('contactUs.email')}
              inputType="type2"
              name="email"
            />
          </Form.Item>
          <Form.Item
            key="subject"
            name="subject"
            className="form-input"
            rules={[
              { required: true, message: t(MSG[C1106]) },
              { max: 255, message: t(MSG[C1107]) },
            ]}
          >
            <InputField
              inputType="type2"
              widthFull
              placeholder="Eg. Publishing event"
              label={t('contactUs.subject')}
              // maxLength={70}
            />
          </Form.Item>
          <Form.Item
            key="message"
            name="message"
            className="w-full"
            rules={[
              { required: true, message: t(MSG[C1108]) },
              { max: 1200, message: t(MSG[C1109]) },
            ]}
          >
            <InputTextArea
              label={t('contactUs.message')}
              placeholder={t('contactUs.messagePlaceholder')}
              showCount
              maxLength={1200}
              widthFull
              rows={5}
            />
          </Form.Item>
        </Form>
        <ButtonContained
          buttonType="type1"
          className="w-[212px] mt-12 mx-auto !block"
          onClick={() => {
            form.submit();
          }}
        >
          {t('contactUs.submit')}
        </ButtonContained>
      </div>
    </div>
  );
};

export default ContactUs;
