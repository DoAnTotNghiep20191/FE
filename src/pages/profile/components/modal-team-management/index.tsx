import { Divider, Form, Grid } from 'antd';
import { useForm } from 'antd/es/form/Form';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import InputField from 'src/components/Inputs';
import ModalComponent from 'src/components/Modals';
import SelectField from 'src/components/Select';
import { ToastMessage } from 'src/components/Toast';
import { WIDTH_FORM_MODAL } from 'src/constants';
import { C1001, C1003, C1004, C1074, MSG } from 'src/constants/errorCode';
import { useInviteTeamMutation } from 'src/store/slices/profile/api';
import { ETeamRole } from 'src/store/slices/user/types';
import BackMobileIcon from 'src/assets/icons/common/arrow-left.svg?react';
import { PATTERN_NOT_SPACE } from 'src/constants/regex';
import { useTranslation } from 'react-i18next';
import { BackIcon } from 'src/assets/icons';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';
import { useAppSelector } from 'src/store';
import { getUserInfo } from 'src/store/selectors/user';

const { useBreakpoint } = Grid;

interface IModalTeamManagement {
  isOpen: boolean;
  teamId: string | number;
  onClose: () => void;
  onSendInviteSuccess: () => void;
}
const ModalTeamManagement = ({
  isOpen,
  teamId,
  onSendInviteSuccess,
  onClose,
}: IModalTeamManagement) => {
  const [form] = useForm();
  const { t } = useTranslation();
  const breakpoint = useBreakpoint();
  const [inviteTeam] = useInviteTeamMutation();
  const { rudderAnalytics } = useRudderStack();
  const userInfo = useAppSelector(getUserInfo);

  const roleOptions = [
    ...(userInfo?.roleOfTeam === ETeamRole.ADMIN
      ? [
          {
            label: t('team.admin'),
            value: ETeamRole.ADMIN,
          },
        ]
      : []),
    {
      label: t('team.organizer'),
      value: ETeamRole.ORGANIZER,
    },
    {
      label: t('team.operations'),
      value: ETeamRole.OPERATIONS,
    },
  ];

  const handleSendInvite = async (data: any) => {
    try {
      const teams = data?.teams?.filter(
        (item: { email: string; role: string }) => item?.email && item?.role,
      );
      if (teams?.length > 0) {
        await inviteTeam({ idTeam: teamId!, data: teams }).unwrap();
        form.resetFields();
        onSendInviteSuccess && onSendInviteSuccess();
        rudderAnalytics?.track(ERudderStackEvents.TeamAddedMember, {
          eventType: ERudderStackEvents.TeamAddedMember,
          data: {
            idTeam: teamId!,
            ...teams,
          },
        });
      } else {
        handleClose();
      }
    } catch (err: any) {
      console.error(err);
      ToastMessage.error(t(MSG[err?.data?.validator_errors || C1001]));
    }
  };
  const handleClose = () => {
    form.resetFields();
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
      <p className=" text-center text-[24px] font-normal font-loos font-black mt-5 md:mt-0">
        {t('team.teamManagement')}
      </p>
      <p className=" text-base text-center text-[14px] font-normal mb-10">
        {t('team.inviteMembersToYourEvent')}
      </p>
      <Form
        name="dynamic_form_nest_item"
        onFinish={handleSendInvite}
        autoComplete="off"
        initialValues={{ teams: [{ email: '', role: undefined }] }}
        form={form}
      >
        <Form.List name="teams">
          {(fields, { add }) => (
            <>
              <div className="max-h-[445px] overflow-auto">
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="max-w-[275px] m-auto ">
                    <Form.Item
                      {...restField}
                      name={[name, 'email']}
                      rules={[
                        // { required: true, message: MSG[C1004] },
                        {
                          type: 'email',
                          message: t(MSG[C1003]),
                        },
                        ({ getFieldValue, setFieldValue, getFieldsValue }) => ({
                          validator(_, value) {
                            const dataIndex = getFieldsValue().teams.findIndex((item: any) => {
                              if (item) {
                                return item.email === value;
                              }
                            });

                            const role = getFieldValue(['teams', name, 'role']);
                            if (dataIndex === 0 && !role && !value) {
                              return Promise.reject(t(MSG[C1004]));
                            }

                            if (role && !value) {
                              return Promise.reject(t(MSG[C1004]));
                            }

                            if (!PATTERN_NOT_SPACE.test(value)) {
                              setFieldValue(['teams', name, 'email'], value.replace(/\s/g, ''));
                            }

                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <InputField
                        widthFull
                        placeholder={t('team.emailPlaceholder')}
                        label={t('team.email')}
                        inputType="type2"
                        name="email"
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'role']}
                      rules={[
                        // { required: true, message: 'Role is required' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const email = getFieldValue(['teams', name, 'email']);

                            if (email && !value) {
                              return Promise.reject(t(MSG[C1074]));
                            }

                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <SelectField
                        widthFull
                        label={t('team.role')}
                        filterOption={(input: string, option: any) =>
                          option?.label?.toLocaleLowerCase()?.includes(input?.toLocaleLowerCase())
                        }
                        placeholder={t('team.selectRole')}
                        options={roleOptions?.map((role) => ({ ...role }))}
                      />
                    </Form.Item>
                    <Divider className="divider" />
                  </div>
                ))}
              </div>
              <Form.Item className="w-[272px] md:w-auto max-w-[212px] m-auto mt-5">
                <ButtonContained
                  fullWidth
                  buttonType="type2"
                  onClick={() => add()}
                  disabled={fields?.length >= 10}
                >
                  {t('team.addAnotherMember')}
                </ButtonContained>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item className="w-[272px] md:w-auto max-w-[212px] m-auto mt-10 md:mt-20">
          <ButtonContained fullWidth onClick={() => form.submit()}>
            {t('team.sendInvite')}
          </ButtonContained>
        </Form.Item>
      </Form>
    </ModalComponent>
  );
};

export default ModalTeamManagement;
