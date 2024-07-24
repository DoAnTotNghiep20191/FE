import { Divider, Form } from 'antd';
import {
  PATTERN_LEAST_ONE_NUMBER,
  PATTERN_LEAST_ONE_SMALL_LETTER,
  PATTERN_LEAST_ONE_UPPER_LETTER,
} from 'src/constants/regex';
import './styles.scss';
import InputField from 'src/components/Inputs';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import ModalComponent from 'src/components/Modals';
import { useState } from 'react';
import NotificationModal from 'src/pages/event-detail/components/NotificationModal';
import {
  useChangeOrganizerPasswordMutation,
  useChangePasswordMutation,
} from 'src/store/slices/app/api';
import {
  C1001,
  C1021,
  C1022,
  C1023,
  C1024,
  C1025,
  C1027,
  C1076,
  C1077,
  C1078,
  C1079,
  MSG,
  S40013,
} from 'src/constants/errorCode';
import { ToastMessage } from 'src/components/Toast';
import { useAppSelector } from 'src/store';
import { getUserInfo } from 'src/store/selectors/user';
import { TypeRole } from 'src/store/slices/user/types';
import { disableSpace } from 'src/helpers';
import { useTranslation } from 'react-i18next';
import { BackIcon } from 'src/assets/icons';
import { passwordPlaceholder } from 'src/constants';

const UpdatePassword = ({ isOpen, onclose }: { isOpen: boolean; onclose: () => void }) => {
  const { t } = useTranslation();
  // const isMobile = useMobile();
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [changePassword] = useChangePasswordMutation();
  const [changeOrganizerPassword] = useChangeOrganizerPasswordMutation();
  const userInfo = useAppSelector(getUserInfo);

  const [form] = Form.useForm();

  const handleUpdatePassword = async (values: any) => {
    const { newPassword, oldPassword } = values;
    if (newPassword === oldPassword) {
      ToastMessage.error(t(MSG[C1076]));
      return;
    }

    try {
      userInfo?.role === TypeRole.ORGANIZER
        ? await changeOrganizerPassword({ newPassword, oldPassword }).unwrap()
        : await changePassword({ newPassword, oldPassword }).unwrap();
      setPasswordUpdated(true);
      form.resetFields();
    } catch (error: any) {
      if (error?.data?.validator_errors === S40013) {
        form.setFields([
          {
            name: 'oldPassword',
            errors: [t(MSG[C1077])],
          },
        ]);
      } else {
        ToastMessage.error(t(MSG[error?.data?.validator_errors || C1001]));
      }
    }
  };

  const handleCloseNotification = () => {
    onclose();
    setPasswordUpdated(false);
  };

  const handleCloseForm = () => {
    form.resetFields();
    onclose();
  };

  const handleChangeNewPass = (e: any) => {
    const isMatchPass = e.currentTarget.value === form.getFieldValue('confirmPassword');
    form.setFields([
      {
        name: 'confirmPassword',
        errors: !isMatchPass && !!form.getFieldValue('confirmPassword') ? [t(MSG[C1027])] : [],
      },
    ]);
  };

  const handleBackButton = () => {
    if (!passwordUpdated) {
      return handleCloseForm();
    }
    return setPasswordUpdated(!passwordUpdated);
  };

  return !passwordUpdated ? (
    <ModalComponent
      className="top-0 md:top-auto"
      width={574}
      open={isOpen}
      onCancel={handleCloseForm}
    >
      <button onClick={handleBackButton} className="btn-back">
        <BackIcon />
      </button>
      {/* {isMobile && <BackIcon className="absolute top-8 left-5 z-10" onClick={handleCloseForm} />} */}
      <div className="forgot-container">
        <div className="forgot-container-form">
          <>
            <p className="modal-title">{t('profile.updatePassword')}</p>
            <p className="modal-des">{t('profile.yourNewPasswordMustBe')}</p>
            <Form
              form={form}
              name="form-forgot"
              autoComplete="off"
              onFinish={handleUpdatePassword}
              className="form-reset"
            >
              <Form.Item
                key="oldPassword"
                name="oldPassword"
                rules={[
                  { required: true, message: t(MSG[C1078]) },
                  disableSpace(form, 'oldPassword'),
                ]}
                className="md:w-[272px]"
              >
                <InputField
                  widthFull
                  placeholder={passwordPlaceholder}
                  label={t('profile.currentPassword')}
                  type="password"
                  inputType="type2"
                />
              </Form.Item>

              <Divider className="divider" />

              <Form.Item
                key="newPassword"
                name="newPassword"
                rules={[
                  { required: true, message: t(MSG[C1021]) },
                  {
                    pattern: PATTERN_LEAST_ONE_SMALL_LETTER,
                    message: t(MSG[C1022]),
                  },
                  {
                    pattern: PATTERN_LEAST_ONE_UPPER_LETTER,
                    message: t(MSG[C1023]),
                  },

                  {
                    pattern: PATTERN_LEAST_ONE_NUMBER,
                    message: t(MSG[C1024]),
                  },
                  // {
                  //   pattern: PATTERN_NOT_SPACE,
                  //   message: 'Password does not contain space characters',
                  // },
                  {
                    min: 8,
                    message: t(MSG[C1025]),
                  },
                  disableSpace(form, 'newPassword'),
                ]}
                className="md:w-[272px]"
              >
                <InputField
                  widthFull
                  placeholder={passwordPlaceholder}
                  label={t('profile.newPassword')}
                  type="password"
                  inputType="type2"
                  onChange={handleChangeNewPass}
                />
              </Form.Item>

              <Form.Item
                key="confirmPassword"
                name="confirmPassword"
                rules={[
                  { required: true, message: t(MSG[C1079]) },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(t(MSG[C1027])));
                    },
                  }),
                  disableSpace(form, 'confirmPassword'),
                ]}
                className="md:w-[272px]"
              >
                <InputField
                  widthFull
                  placeholder={passwordPlaceholder}
                  label={t('profile.confirmNewPassword')}
                  type="password"
                  inputType="type2"
                />
              </Form.Item>
            </Form>
            <ButtonContained
              buttonType="type1"
              fullWidth
              onClick={() => {
                form.submit();
              }}
              className="w-[272px] md:w-[212px]"
            >
              {t('profile.saveNewPassword')}
            </ButtonContained>
          </>
        </div>
      </div>
    </ModalComponent>
  ) : (
    <NotificationModal
      isOpen={isOpen}
      title={t('profile.passwordUpdated')}
      description={t('profile.yourNewPasswordHas')}
      textButton={t('profile.buttonClose')}
      onButton={handleCloseNotification}
      onClose={handleCloseNotification}
    />
  );
};

export default UpdatePassword;
