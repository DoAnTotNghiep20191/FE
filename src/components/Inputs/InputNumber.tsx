import { InputNumber, InputNumberProps, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { InfoCircleIcon } from 'src/assets/icons';
import './styles.scss';

export interface InputFieldProps extends InputNumberProps {
  className?: string;
  widthFull?: boolean;
  label?: string;
  inputType?: 'type1' | 'type2';
  optional?: boolean;
  info?: string;
  colorTooltip?: string;
}

const InputFieldNumber = ({
  className,
  widthFull,
  type: _,
  label,
  inputType = 'type1',
  optional,
  info,
  colorTooltip,
  ...restProps
}: InputFieldProps) => {
  const { t } = useTranslation();

  return (
    <div className={`input-box ` + className}>
      <div className="input-header">
        <div className="flex gap-1 items-center">
          {label && <p className="input-label">{label}</p>}
          {info && (
            <Tooltip
              placement="top"
              color={colorTooltip}
              title={info}
              arrow={{ pointAtCenter: true }}
            >
              <InfoCircleIcon />
            </Tooltip>
          )}
        </div>
        {optional && <p className="optional text-gray3">{t('common.optional')}</p>}
      </div>
      <InputNumber
        className={`input-default input-default-${inputType} ${widthFull ? 'w-full' : ''}`}
        // changeOnWheel={false}
        {...restProps}
      />
    </div>
  );
};

export default InputFieldNumber;
