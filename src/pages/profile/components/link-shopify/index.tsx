import Icon from '@ant-design/icons';
import { Form, Grid } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackIcon } from 'src/assets/icons';
import BackMobileIcon from 'src/assets/icons/common/arrow-left.svg?react';
import { VerificationIcon } from 'src/assets/icons/IconComponent';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import ButtonOutLined from 'src/components/Buttons/ButtonOutLined';
import InputField from 'src/components/Inputs';
import ModalComponent from 'src/components/Modals';
import { ToastMessage } from 'src/components/Toast';
import { WIDTH_FORM_MODAL } from 'src/constants';
import { C1001, C1004, MSG } from 'src/constants/errorCode';

const { useBreakpoint } = Grid;

interface IModalLinkShopify {
  isOpen: boolean;
  onClose: () => void;
}
const ModalLinkShopify = ({ isOpen, onClose }: IModalLinkShopify) => {
  const [form] = useForm();
  const { t } = useTranslation('campaigns');
  const breakpoint = useBreakpoint();

  const [isLinked, setIsLinked] = useState(false);

  const handleLinkShopify = async (data: any) => {
    try {
      console.log('============= data', data);
      setIsLinked(true);
    } catch (err: any) {
      console.error(err);
      ToastMessage.error(t(MSG[err?.data?.validator_errors || C1001]));
    }
  };
  const handleClose = () => {
    form.resetFields();
    setIsLinked(false);
    onClose && onClose();
  };

  return (
    <ModalComponent
      open={isOpen}
      centered
      width={WIDTH_FORM_MODAL}
      className="relative"
      onCancel={handleClose}
    >
      <button onClick={handleClose} className="btn back">
        <BackIcon />
      </button>
      {!breakpoint?.md && (
        <BackMobileIcon className="absolute top-11 left-5" onClick={handleClose} />
      )}
      <p className=" text-center text-[24px] font-normal font-loos mt-5 md:mt-0">
        {isLinked ? t('shopifyLinked') : t('shopify')}
      </p>
      <p className=" text-base text-center text-[14px] font-normal mb-10">
        {isLinked ? t('accessTokenHasBeenSuccess') : t('inputYourAccess')}
      </p>
      <Form
        name="link-shopify"
        onFinish={handleLinkShopify}
        autoComplete="off"
        initialValues={{ accessToken: '' }}
        form={form}
      >
        {isLinked ? (
          <div className="text-center">
            <Icon component={VerificationIcon} />
          </div>
        ) : (
          <div className="max-h-[445px] overflow-auto">
            <Form.Item name={'accessToken'} rules={[{ required: true, message: MSG[C1004] }]}>
              <InputField
                widthFull
                placeholder={t('assetTokenPlaceholder')}
                label={t('assetToken')}
                info={'assetToken'}
                inputType="type2"
                name="accessToken"
              />
            </Form.Item>
          </div>
        )}

        <Form.Item className="w-[272px] md:w-auto max-w-[212px] m-auto mt-10 md:mt-20">
          {isLinked ? (
            <ButtonOutLined fullWidth onClick={handleClose} className="rounded-[50px]">
              {t('close')}
            </ButtonOutLined>
          ) : (
            <ButtonContained fullWidth onClick={() => form.submit()}>
              {t('saveDetails')}
            </ButtonContained>
          )}
        </Form.Item>
      </Form>
    </ModalComponent>
  );
};

export default ModalLinkShopify;
