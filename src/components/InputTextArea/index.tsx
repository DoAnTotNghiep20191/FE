import { Input, Tooltip } from 'antd';
import { TextAreaProps } from 'antd/es/input';
import { useTranslation } from 'react-i18next';
import './styles.scss';
import { InfoCircleIcon } from 'src/assets/icons';

export interface InputTextAreaProps extends TextAreaProps {
  className?: string;
  widthFull?: boolean;
  label?: string;
  optional?: boolean;
  inputClassName?: string;
  info?: string;
  colorTooltip?: string;
}

const InputTextArea = ({
  className,
  widthFull,
  label,
  optional = false,
  inputClassName,
  info,
  colorTooltip,
  ...restProps
}: InputTextAreaProps) => {
  const { t } = useTranslation();

  return (
    <div className={`input-text-area-box ${widthFull ? 'w-full' : ''} ` + className}>
      <div className="flex justify-between">
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
        {optional && <p className="text-gray3 text-xs">{t('common.optional')}</p>}
      </div>

      <Input.TextArea className={`input-text-area ${inputClassName || ''}`} {...restProps} />
    </div>
  );
};

export default InputTextArea;
