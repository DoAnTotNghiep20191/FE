import { Form } from 'antd';
import { useCreateTeamMutation } from 'src/store/slices/app/api';
import ButtonContained from '../Buttons/ButtonContained';
import InputField from '../Inputs';

import './styles/CreateTeam.scss';
import { useTranslation } from 'react-i18next';
import { C1008, C1009, MSG } from 'src/constants/errorCode';
import { BackIcon } from 'src/assets/icons';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';
interface ICreateTeam {
  onSuccess: () => void;
  onBack?: () => void;
}
const CreateTeam = ({ onSuccess, onBack }: ICreateTeam) => {
  const [form] = Form.useForm();

  const [createTeam, { isLoading }] = useCreateTeamMutation();
  const { rudderAnalytics } = useRudderStack();

  const { t } = useTranslation();

  const handleCreateTeam = async (values: { name: string }) => {
    try {
      await createTeam(values);
      rudderAnalytics?.track(ERudderStackEvents.TeamCreated, {
        eventId: ERudderStackEvents.TeamCreated,
        data: values,
      });
      onSuccess && onSuccess();
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div className="create-container relative h-[calc(100vh-50px)] md:h-[618px]">
      <div>
        <div className="mt-[48px]">
          <p className="create-team-title">{t('createTeam.createYourTeam')}</p>
          <p className="create-team-des">{t('createTeam.letStartOffBy')}</p>
          <button onClick={onBack} className="absolute top-0 left-0">
            <BackIcon />
          </button>
        </div>
        <Form form={form} autoComplete="off" name="update-email" onFinish={handleCreateTeam}>
          <Form.Item
            key="name"
            name="name"
            rules={[
              { required: true, message: t(MSG[C1008]) },
              { min: 2, max: 50, message: t(MSG[C1009]) },
            ]}
            className="create-container-input"
          >
            <InputField
              widthFull
              placeholder={t('createTeam.teamNamePlaceholder')}
              label={t('createTeam.teamName')}
              inputType="type2"
              maxLength={50}
            />
          </Form.Item>
        </Form>
      </div>

      <ButtonContained
        buttonType="type1"
        className="create-container-btn !w-[212px] mt-auto md:mt-auto mb-[80px]"
        loading={isLoading}
        onClick={() => {
          form.submit();
        }}
      >
        {t('createTeam.createTeam')}
      </ButtonContained>
    </div>
  );
};

export default CreateTeam;
