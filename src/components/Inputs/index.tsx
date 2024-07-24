import { Input, InputProps, Tooltip } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EyeCloseIcon, EyeIcon, InfoCircleIcon } from 'src/assets/icons';
import './styles.scss';

export interface InputFieldProps extends InputProps {
  className?: string;
  widthFull?: boolean;
  type?: 'text' | 'password' | 'number';
  label?: string;
  inputType?: 'type1' | 'type2';
  optional?: boolean;
  info?: string;
  name?: string;
  colorTooltip?: string;
}

const InputField = ({
  className,
  widthFull,
  type = 'text',
  label,
  inputType = 'type1',
  optional,
  info,
  name,
  ...restProps
}: InputFieldProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { t } = useTranslation();

  return (
    <div className={`input-box ` + className}>
      <div className="input-header">
        {label && (
          <div className="flex gap-1 items-center">
            <p className="input-label">{label}</p>
            {info && (
              <Tooltip
                getTooltipContainer={(node) => node.parentElement || document.body}
                placement="top"
                color={restProps.colorTooltip}
                title={info}
                arrow={{ pointAtCenter: true }}
              >
                <InfoCircleIcon />
              </Tooltip>
            )}
          </div>
        )}
        {optional && <p className="text-[12px] text-gray3">{t('common.optional')}</p>}
      </div>
      {type === 'password' && (
        <Input.Password
          className={`input-default input-default-${inputType} ${widthFull ? 'w-full' : ''}`}
          iconRender={(visible) => (!visible ? <EyeCloseIcon /> : <EyeIcon />)}
          visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
          onInput={(e: any) => {
            e.currentTarget.value = e?.currentTarget?.value?.trim();
          }}
          {...restProps}
        />
      )}
      {type === 'text' && (
        <Input
          className={`input-default input-default-${inputType} ${widthFull ? 'w-full' : ''}`}
          onInput={(e: any) => {
            if (name === 'email') {
              e.currentTarget.value = e?.currentTarget?.value?.trim();
            }
          }}
          {...restProps}
        />
      )}
      {type === 'number' && (
        <Input
          className={`input-default input-default-${inputType} ${widthFull ? 'w-full' : ''}`}
          pattern="^\d*(\d{0,2})?$"
          onInput={(e) => {
            if (!e.currentTarget.validity.valid) {
              e.currentTarget.value = '';
            }
          }}
          {...restProps}
        />
      )}
    </div>
  );
};

export default InputField;
