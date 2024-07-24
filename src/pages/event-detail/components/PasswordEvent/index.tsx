import { Form, FormInstance } from 'antd';
import { useTranslation } from 'react-i18next';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import InputField from 'src/components/Inputs';
import { C1005, MSG } from 'src/constants/errorCode';
import { disableSpace } from 'src/helpers';
import './styles.scss';
import { passwordPlaceholder } from 'src/constants';

interface IPasswordEvent {
  onHandlePassword: (values: { password: string }) => void;
  form: FormInstance;
  isLoading?: boolean;
}

const PasswordEvent = (props: IPasswordEvent) => {
  const { onHandlePassword, form, isLoading } = props;
  const { t } = useTranslation();

  return (
    <div className="w-full md:w-[676px] px-[40px] md:px-[150px] py-[70px] flex items-center flex-col">
      <p className="text-[24px] font-loos">{t('eventDetail.privateEvent')}</p>
      <p className="text-[14px] mt-[2px] text-center">{t('eventDetail.thisIsAPrivateEvent')}</p>
      <Form form={form} name="form-forgot" autoComplete="off" onFinish={onHandlePassword}>
        <Form.Item
          key="password"
          name="password"
          rules={[{ required: true, message: t(MSG[C1005]) }, disableSpace(form, 'password')]}
          className="w-[276px] my-[70px]"
        >
          <InputField
            widthFull
            placeholder={passwordPlaceholder}
            label="Password"
            type="password"
            inputType="type2"
          />
        </Form.Item>
      </Form>
      <div className="flex justify-center w-[212px]">
        <ButtonContained
          buttonType="type1"
          fullWidth
          disabled={isLoading}
          onClick={() => {
            form.submit();
          }}
        >
          {t('eventDetail.enterEvent')}
        </ButtonContained>
      </div>
    </div>
  );
};

export default PasswordEvent;
