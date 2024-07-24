import { Form, ModalProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { useForm } from 'antd/es/form/Form';
import { C1042, C1121, MSG } from 'src/constants/errorCode';
import ModalComponent from 'src/components/Modals';
import InputField from 'src/components/Inputs';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import { useEffect } from 'react';

interface Props extends ModalProps {
  onSubmit: (url: string) => void;
  loading: boolean;
  hashTag?: string;
}

const PublicPostModal = ({ onSubmit, hashTag, loading, open, ...restProps }: Props) => {
  const { t } = useTranslation('campaigns');
  const { t: phase1Translate } = useTranslation('translations');

  const [form] = useForm();

  const handleSubmit = (values: { socialUrl: string }) => {
    onSubmit(values.socialUrl);
  };

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open]);

  return (
    <ModalComponent
      open={open}
      centered
      destroyOnClose
      className="relative"
      wrapClassName="h-[100%] wallets-modal"
      {...restProps}
    >
      <Form onFinish={handleSubmit} form={form}>
        <div className="full-height switch-account-modal flex flex-col items-center justify-between py-[20px] md:h-[auto]">
          <div className="max-w-[448px] md:mb-[60px]">
            <p className="text-center text-[24px] text-[#121313]">{t('publicPostModal.title')}</p>
            <p className="text-center text-[14px]">
              {t('publicPostModal.subtitle', {
                hashtag: hashTag,
              })}
            </p>
            <div className="flex justify-center mt-[20px]">
              <Form.Item
                name={'socialUrl'}
                rules={[
                  { required: true, message: phase1Translate(MSG[C1121]) },
                  {
                    type: 'url',
                    message: phase1Translate(MSG[C1042]),
                  },
                ]}
                className="w-[275px] mt-[20px]"
              >
                <InputField
                  inputType="type2"
                  widthFull
                  label={t('socialUrl')}
                  placeholder={'Eg. www.facebook.com/post'}
                />
              </Form.Item>
            </div>
          </div>
          <div>
            <ButtonContained
              buttonType="type1"
              fullWidth
              className="my-2.5 !w-[212px] !md:w-[212px]"
              htmlType="submit"
              loading={loading}
            >
              {t('verify')}
            </ButtonContained>
          </div>
        </div>
      </Form>
    </ModalComponent>
  );
};

export default PublicPostModal;
