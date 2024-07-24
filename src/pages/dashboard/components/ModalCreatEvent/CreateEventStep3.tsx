import { Divider, Form, FormInstance } from 'antd';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import InputField from 'src/components/Inputs';

import './styles/createEventStep3.scss';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { C1042, MSG } from 'src/constants/errorCode';

interface ICreateEventStep3 {
  form: FormInstance;
  dataEdit?: any;
  onSubmit: (values: any) => void;
  loading?: boolean;
}

const CreateEventStep3 = ({ form, dataEdit, onSubmit, loading }: ICreateEventStep3) => {
  const { t } = useTranslation();

  const onChangeSocialTag = (e: any) => {
    const value = e?.currentTarget?.value;
    if (e.keyCode === 32 || e.key === ' ') {
      e.preventDefault();
      return;
    }
    form.setFieldValue('socialTags', value[0] !== '#' ? '#' + value : value);
  };

  useEffect(() => {
    if (dataEdit) {
      form.setFieldsValue({
        socialTags: dataEdit?.socialTags ? `#${dataEdit?.socialTags}` : '',
        websiteUrl: dataEdit?.websiteUrl || '',
        tiktokUrl: dataEdit?.tiktokUrl || '',
        instagramUrl: dataEdit?.instagramUrl || '',
        naverUrl: dataEdit?.naverUrl || '',
        twitterUrl: dataEdit?.twitterUrl || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataEdit]);

  return (
    <div className="step3-container">
      <Form form={form} className="step3-content" onFinish={onSubmit} autoComplete="off">
        <Form.Item key="socialTags" className="w-full md:!w-[275px]" name="socialTags" rules={[]}>
          <InputField
            inputType="type2"
            widthFull
            placeholder={t('createEvent.linkASocialTagPlaceholder')}
            label={t('createEvent.linkASocialTag')}
            optional
            className="input-tag"
            info={t('createEvent.createASocialTag')}
            onKeyDown={onChangeSocialTag}
          />
        </Form.Item>
        <Divider className="step3-content-divider" />

        <div className="mb-[16px] w-full md:w-auto">
          <Form.Item
            key="websiteUrl"
            name="websiteUrl"
            rules={[
              {
                type: 'url',
                message: t(MSG[C1042]),
              },
            ]}
            className="w-full md:!w-[275px]"
          >
            <InputField
              inputType="type2"
              widthFull
              placeholder={t('createEvent.websiteURLPlaceholder')}
              label={t('createEvent.websiteURL')}
              optional
            />
          </Form.Item>
        </div>
        <div className="mb-[16px] w-full md:w-auto">
          <Form.Item
            key="instagramUrl"
            name="instagramUrl"
            rules={[
              {
                type: 'url',
                message: t(MSG[C1042]),
              },
            ]}
            className="w-full md:!w-[275px]"
          >
            <InputField
              inputType="type2"
              widthFull
              placeholder={t('createEvent.instagramURLPlaceholder')}
              label={t('createEvent.instagramURL')}
              optional
            />
          </Form.Item>
        </div>
        <div className="mb-[16px] w-full md:w-auto">
          <Form.Item
            key="twitterUrl"
            name="twitterUrl"
            rules={[
              {
                type: 'url',
                message: t(MSG[C1042]),
              },
            ]}
            className="w-full md:!w-[275px]"
          >
            <InputField
              inputType="type2"
              widthFull
              placeholder={t('createEvent.xURLPlaceholder')}
              label={t('createEvent.xURL')}
              optional
            />
          </Form.Item>
        </div>
        <div className="mb-[16px] w-full md:w-auto">
          <Form.Item
            key="tiktokUrl"
            name="tiktokUrl"
            rules={[
              {
                type: 'url',
                message: t(MSG[C1042]),
              },
            ]}
            className="w-full md:!w-[275px]"
          >
            <InputField
              inputType="type2"
              widthFull
              placeholder={t('createEvent.tikTokURLPlaceholder')}
              label={t('createEvent.tikTokURL')}
              optional
            />
          </Form.Item>
        </div>

        <div className="mb-[56px] w-full md:w-auto">
          <Form.Item
            key="naverUrl"
            name="naverUrl"
            rules={[
              {
                type: 'url',
                message: t(MSG[C1042]),
              },
            ]}
            className="w-full md:!w-[275px]"
          >
            <InputField
              inputType="type2"
              widthFull
              placeholder={t('createEvent.naverURLPlaceholder')}
              label={t('createEvent.naverURL')}
              optional
            />
          </Form.Item>
        </div>
        <ButtonContained
          loading={loading}
          className="btn-continue"
          buttonType="type1"
          onClick={() => {
            form.submit();
          }}
        >
          {t('createEvent.buttonSaveEvent')}
        </ButtonContained>
      </Form>
    </div>
  );
};

export default CreateEventStep3;
